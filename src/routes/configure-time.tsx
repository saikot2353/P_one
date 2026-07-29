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
  Calendar,
  Clock,
  AlertTriangle,
  Coins,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/configure-time")({
  head: () => ({
    meta: [
      { title: "Time & Shift Setup — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Manage and configure standard shifts, abnormal shifts, attendance bonus rules, and OT config.",
      },
    ],
  }),
  component: TimeSetupPage,
});

type TabType = "shift" | "ot" | "abnormal" | "bonus";

// ----------------------------------------------------
// Interfaces
// ----------------------------------------------------
interface Shift {
  sl: number;
  nameEng: string;
  nameBng: string;
  startTime: string;
  endTime: string;
  lateTime: string;
  startTimeFrom: string;
  endTimeTo: string;
  lateCount: "Yes" | "No";
  sortOrder: number;
  isActive: "Active" | "Inactive";
  isRotate: "Yes" | "No";
  rotationCriteria: string;
  shiftChangeDay: string;
  isLateDeduction: "Yes" | "No";
  deductionFrom: string;
  deductionPer: string;
  deductionAfterDay: string;
}

interface OtConfig {
  sl: number;
  employeeType: string;
  department: string;
  section: string;
  designation: string;
  unit: string;
  otCalculationType: string;
  bufferMinutes: number;
  isActive: "Active" | "Inactive";
  startDate?: string;
  endDate?: string;
  shift?: string;
  startTime?: string;
  endTime?: string;
  shiftStartTime?: string;
  otStartTime?: string;
  otToleranceUpTo?: string;
  time2Min?: number;
  time2MaxOt?: number;
  time3Min?: number;
  time3MaxOt?: number;
  time4Min?: number;
  time4MaxOt?: number;
  otAfterWH?: "Yes" | "No";
  generalDeductHour?: number;
  holidayDeductHour?: number;
  deductAfter?: number;
  otRound?: "Yes" | "No";
  roundSlots?: string;
  minOt?: number;
  maxOt?: number;
  prayerBreak?: "Yes" | "No";
  dinnerBreak?: "Yes" | "No";
  deductionFor?: string;
  timeFrom?: string;
  timeTo?: string;
  deductMin?: number;
  otStartFromShift?: "Yes" | "No";
}

interface AbnormalShift {
  sl: number;
  shiftName: string;
  dateFrom: string;
  dateTo: string;
  dayFor: string;
  minOutTime: string;
  maxOutTime: string;
  prevDayInTime: string;
  splitOutTime: string;
  isActive: "Active" | "Inactive";
}

interface AttendanceBonusPolicy {
  sl: number;
  name: string;
  employeeType: string;
  department: string;
  section: string;
  designation: string;
  unit: string;
  maxLeaveAllowed: number;
  maxAbsentAllowed: number;
  lateBasedOn: string;
  maxLateAllowed: number;
  maxLateMin: number;
  lateAuthCount: number;
  maxEarlyOutAllowed: string;
  maxEarlyOutMin: number;
  earlyOutAuthCount: number;
  combinedStatus: "Yes" | "No";
  combinedBasedOn: string;
  combinedMaxMin: number;
  combinedAuth: number;
  calculateBy: string;
  ratio: number;
  isActive: "Active" | "Inactive";
}

// ----------------------------------------------------
// Defaults
// ----------------------------------------------------
const DEFAULT_SHIFTS: Shift[] = [
  {
    sl: 1,
    nameEng: "General Shift",
    nameBng: "সাধারণ শিফট",
    startTime: "09:00:00",
    endTime: "18:00:00",
    lateTime: "09:15:00",
    startTimeFrom: "07:30:00",
    endTimeTo: "11:30:00",
    lateCount: "Yes",
    sortOrder: 1,
    isActive: "Active",
    isRotate: "No",
    rotationCriteria: "",
    shiftChangeDay: "",
    isLateDeduction: "No",
    deductionFrom: "",
    deductionPer: "",
    deductionAfterDay: "",
  },
  {
    sl: 2,
    nameEng: "Morning Roster",
    nameBng: "সকাল শিফট",
    startTime: "06:00:00",
    endTime: "14:00:00",
    lateTime: "06:05:00",
    startTimeFrom: "05:00:00",
    endTimeTo: "08:00:00",
    lateCount: "Yes",
    sortOrder: 2,
    isActive: "Active",
    isRotate: "Yes",
    rotationCriteria: "Weekly",
    shiftChangeDay: "Friday",
    isLateDeduction: "No",
    deductionFrom: "",
    deductionPer: "",
    deductionAfterDay: "",
  },
  {
    sl: 3,
    nameEng: "Evening Roster",
    nameBng: "সন্ধ্যা শিফট",
    startTime: "14:00:00",
    endTime: "22:00:00",
    lateTime: "14:05:00",
    startTimeFrom: "13:00:00",
    endTimeTo: "16:00:00",
    lateCount: "Yes",
    sortOrder: 3,
    isActive: "Active",
    isRotate: "Yes",
    rotationCriteria: "Weekly",
    shiftChangeDay: "Friday",
    isLateDeduction: "No",
    deductionFrom: "",
    deductionPer: "",
    deductionAfterDay: "",
  },
  {
    sl: 4,
    nameEng: "Night Roster",
    nameBng: "রাত শিফট",
    startTime: "22:00:00",
    endTime: "06:00:00",
    lateTime: "22:05:00",
    startTimeFrom: "21:00:00",
    endTimeTo: "23:59:00",
    lateCount: "Yes",
    sortOrder: 4,
    isActive: "Active",
    isRotate: "Yes",
    rotationCriteria: "Weekly",
    shiftChangeDay: "Friday",
    isLateDeduction: "No",
    deductionFrom: "",
    deductionPer: "",
    deductionAfterDay: "",
  },
  {
    sl: 5,
    nameEng: "RMG-PIP",
    nameBng: "আরএমজি-পিআইপি",
    startTime: "08:00:00",
    endTime: "17:00:00",
    lateTime: "08:05:00",
    startTimeFrom: "06:30:00",
    endTimeTo: "10:30:00",
    lateCount: "Yes",
    sortOrder: 5,
    isActive: "Active",
    isRotate: "No",
    rotationCriteria: "",
    shiftChangeDay: "",
    isLateDeduction: "No",
    deductionFrom: "",
    deductionPer: "",
    deductionAfterDay: "",
  },
  {
    sl: 6,
    nameEng: "Support Shift A",
    nameBng: "সহায়তা শিফট এ",
    startTime: "08:00:00",
    endTime: "16:00:00",
    lateTime: "08:10:00",
    startTimeFrom: "07:00:00",
    endTimeTo: "10:00:00",
    lateCount: "Yes",
    sortOrder: 6,
    isActive: "Active",
    isRotate: "No",
    rotationCriteria: "",
    shiftChangeDay: "",
    isLateDeduction: "No",
    deductionFrom: "",
    deductionPer: "",
    deductionAfterDay: "",
  },
  {
    sl: 7,
    nameEng: "Support Shift B",
    nameBng: "সহায়তা শিফট বি",
    startTime: "16:00:00",
    endTime: "23:59:00",
    lateTime: "16:10:00",
    startTimeFrom: "15:00:00",
    endTimeTo: "18:00:00",
    lateCount: "Yes",
    sortOrder: 7,
    isActive: "Active",
    isRotate: "No",
    rotationCriteria: "",
    shiftChangeDay: "",
    isLateDeduction: "No",
    deductionFrom: "",
    deductionPer: "",
    deductionAfterDay: "",
  },
  {
    sl: 8,
    nameEng: "Security Shift Day",
    nameBng: "নিরাপত্তা দিন",
    startTime: "06:00:00",
    endTime: "18:00:00",
    lateTime: "06:05:00",
    startTimeFrom: "05:00:00",
    endTimeTo: "08:00:00",
    lateCount: "Yes",
    sortOrder: 8,
    isActive: "Active",
    isRotate: "No",
    rotationCriteria: "",
    shiftChangeDay: "",
    isLateDeduction: "No",
    deductionFrom: "",
    deductionPer: "",
    deductionAfterDay: "",
  },
  {
    sl: 9,
    nameEng: "Security Shift Night",
    nameBng: "নিরাপত্তা রাত",
    startTime: "18:00:00",
    endTime: "06:00:00",
    lateTime: "18:05:00",
    startTimeFrom: "17:00:00",
    endTimeTo: "20:00:00",
    lateCount: "Yes",
    sortOrder: 9,
    isActive: "Active",
    isRotate: "No",
    rotationCriteria: "",
    shiftChangeDay: "",
    isLateDeduction: "No",
    deductionFrom: "",
    deductionPer: "",
    deductionAfterDay: "",
  },
  {
    sl: 10,
    nameEng: "Part-time Morning",
    nameBng: "খন্ডকালীন সকাল",
    startTime: "08:00:00",
    endTime: "12:00:00",
    lateTime: "08:15:00",
    startTimeFrom: "07:00:00",
    endTimeTo: "09:30:00",
    lateCount: "Yes",
    sortOrder: 10,
    isActive: "Active",
    isRotate: "No",
    rotationCriteria: "",
    shiftChangeDay: "",
    isLateDeduction: "No",
    deductionFrom: "",
    deductionPer: "",
    deductionAfterDay: "",
  },
  {
    sl: 11,
    nameEng: "Part-time Evening",
    nameBng: "খন্ডকালীন সন্ধ্যা",
    startTime: "14:00:00",
    endTime: "18:00:00",
    lateTime: "14:15:00",
    startTimeFrom: "13:00:00",
    endTimeTo: "15:30:00",
    lateCount: "Yes",
    sortOrder: 11,
    isActive: "Active",
    isRotate: "No",
    rotationCriteria: "",
    shiftChangeDay: "",
    isLateDeduction: "No",
    deductionFrom: "",
    deductionPer: "",
    deductionAfterDay: "",
  },
  {
    sl: 12,
    nameEng: "IT Support Shift",
    nameBng: "আইটি সাপোর্ট",
    startTime: "09:00:00",
    endTime: "18:00:00",
    lateTime: "09:10:00",
    startTimeFrom: "08:00:00",
    endTimeTo: "11:00:00",
    lateCount: "Yes",
    sortOrder: 12,
    isActive: "Active",
    isRotate: "No",
    rotationCriteria: "",
    shiftChangeDay: "",
    isLateDeduction: "No",
    deductionFrom: "",
    deductionPer: "",
    deductionAfterDay: "",
  },
  {
    sl: 13,
    nameEng: "Admin Shift",
    nameBng: "প্রশাসন শিফট",
    startTime: "09:30:00",
    endTime: "18:30:00",
    lateTime: "09:45:00",
    startTimeFrom: "08:00:00",
    endTimeTo: "11:30:00",
    lateCount: "Yes",
    sortOrder: 13,
    isActive: "Active",
    isRotate: "No",
    rotationCriteria: "",
    shiftChangeDay: "",
    isLateDeduction: "No",
    deductionFrom: "",
    deductionPer: "",
    deductionAfterDay: "",
  },
  {
    sl: 14,
    nameEng: "Weekend Support",
    nameBng: "সাপ্তাহিক সহায়তা",
    startTime: "10:00:00",
    endTime: "16:00:00",
    lateTime: "10:15:00",
    startTimeFrom: "09:00:00",
    endTimeTo: "12:00:00",
    lateCount: "Yes",
    sortOrder: 14,
    isActive: "Active",
    isRotate: "No",
    rotationCriteria: "",
    shiftChangeDay: "",
    isLateDeduction: "No",
    deductionFrom: "",
    deductionPer: "",
    deductionAfterDay: "",
  },
  {
    sl: 15,
    nameEng: "Overtime Special",
    nameBng: "ওভারটাইম বিশেষ",
    startTime: "18:00:00",
    endTime: "22:00:00",
    lateTime: "18:05:00",
    startTimeFrom: "17:30:00",
    endTimeTo: "19:00:00",
    lateCount: "No",
    sortOrder: 15,
    isActive: "Active",
    isRotate: "No",
    rotationCriteria: "",
    shiftChangeDay: "",
    isLateDeduction: "No",
    deductionFrom: "",
    deductionPer: "",
    deductionAfterDay: "",
  },
  {
    sl: 16,
    nameEng: "Maintenance Shift",
    nameBng: "রক্ষণাবেক্ষণ",
    startTime: "07:30:00",
    endTime: "16:30:00",
    lateTime: "07:45:00",
    startTimeFrom: "06:30:00",
    endTimeTo: "09:00:00",
    lateCount: "Yes",
    sortOrder: 16,
    isActive: "Active",
    isRotate: "No",
    rotationCriteria: "",
    shiftChangeDay: "",
    isLateDeduction: "No",
    deductionFrom: "",
    deductionPer: "",
    deductionAfterDay: "",
  },
  {
    sl: 17,
    nameEng: "Loading-Unloading",
    nameBng: "লোডিং-আনলোডিং",
    startTime: "12:00:00",
    endTime: "20:00:00",
    lateTime: "12:10:00",
    startTimeFrom: "11:00:00",
    endTimeTo: "14:00:00",
    lateCount: "Yes",
    sortOrder: 17,
    isActive: "Active",
    isRotate: "No",
    rotationCriteria: "",
    shiftChangeDay: "",
    isLateDeduction: "No",
    deductionFrom: "",
    deductionPer: "",
    deductionAfterDay: "",
  },
  {
    sl: 18,
    nameEng: "Executive Flexi Shift",
    nameBng: "নির্বাহী নমনীয়",
    startTime: "10:00:00",
    endTime: "19:00:00",
    lateTime: "10:30:00",
    startTimeFrom: "08:30:00",
    endTimeTo: "12:00:00",
    lateCount: "Yes",
    sortOrder: 18,
    isActive: "Active",
    isRotate: "No",
    rotationCriteria: "",
    shiftChangeDay: "",
    isLateDeduction: "No",
    deductionFrom: "",
    deductionPer: "",
    deductionAfterDay: "",
  },
  {
    sl: 19,
    nameEng: "Store & Inventory",
    nameBng: "স্টোর ও ইনভেন্টরি",
    startTime: "08:30:00",
    endTime: "17:30:00",
    lateTime: "08:45:00",
    startTimeFrom: "07:30:00",
    endTimeTo: "10:00:00",
    lateCount: "Yes",
    sortOrder: 19,
    isActive: "Active",
    isRotate: "No",
    rotationCriteria: "",
    shiftChangeDay: "",
    isLateDeduction: "No",
    deductionFrom: "",
    deductionPer: "",
    deductionAfterDay: "",
  },
  {
    sl: 20,
    nameEng: "Factory Roster E",
    nameBng: "ফ্যাক্টরি রোস্টার ই",
    startTime: "14:30:00",
    endTime: "22:30:00",
    lateTime: "14:35:00",
    startTimeFrom: "13:30:00",
    endTimeTo: "16:00:00",
    lateCount: "Yes",
    sortOrder: 20,
    isActive: "Active",
    isRotate: "Yes",
    rotationCriteria: "Weekly",
    shiftChangeDay: "Friday",
    isLateDeduction: "No",
    deductionFrom: "",
    deductionPer: "",
    deductionAfterDay: "",
  },
];

const DEFAULT_OT_CONFIGS: OtConfig[] = [
  {
    sl: 1,
    employeeType: "ALL",
    department: "All Departments",
    section: "ALL",
    designation: "ALL",
    unit: "ALL",
    otCalculationType: "Fixed Hour",
    bufferMinutes: 15,
    isActive: "Active",
  },
  {
    sl: 2,
    employeeType: "Operator",
    department: "Production Dept",
    section: "Sewing Section",
    designation: "Operator",
    unit: "ALL",
    otCalculationType: "Basic Ratio",
    bufferMinutes: 10,
    isActive: "Active",
  },
  {
    sl: 3,
    employeeType: "Supervisor",
    department: "Production Dept",
    section: "Sewing Section",
    designation: "Supervisor",
    unit: "ALL",
    otCalculationType: "Fixed Hour",
    bufferMinutes: 15,
    isActive: "Active",
  },
  {
    sl: 4,
    employeeType: "Admin staff",
    department: "HR & Admin",
    section: "ALL",
    designation: "ALL",
    unit: "ALL",
    otCalculationType: "Fixed Hour",
    bufferMinutes: 30,
    isActive: "Active",
  },
  {
    sl: 5,
    employeeType: "Permanent Worker",
    department: "Production Dept",
    section: "Sewing Section",
    designation: "Operator",
    unit: "ALL",
    otCalculationType: "Gross Ratio",
    bufferMinutes: 15,
    isActive: "Active",
  },
  {
    sl: 6,
    employeeType: "Casual Worker",
    department: "Production Dept",
    section: "Sewing Section",
    designation: "Helper",
    unit: "ALL",
    otCalculationType: "Fixed Hour",
    bufferMinutes: 10,
    isActive: "Active",
  },
  {
    sl: 7,
    employeeType: "Probationary Worker",
    department: "Production Dept",
    section: "Sewing Section",
    designation: "Helper",
    unit: "ALL",
    otCalculationType: "Fixed Hour",
    bufferMinutes: 15,
    isActive: "Active",
  },
  {
    sl: 8,
    employeeType: "Contractual Staff",
    department: "HR & Admin",
    section: "ALL",
    designation: "ALL",
    unit: "ALL",
    otCalculationType: "Basic Ratio",
    bufferMinutes: 20,
    isActive: "Active",
  },
  {
    sl: 9,
    employeeType: "Support Staff",
    department: "HR & Admin",
    section: "ALL",
    designation: "ALL",
    unit: "ALL",
    otCalculationType: "Fixed Hour",
    bufferMinutes: 15,
    isActive: "Active",
  },
  {
    sl: 10,
    employeeType: "Technical Team",
    department: "HR & Admin",
    section: "ALL",
    designation: "ALL",
    unit: "ALL",
    otCalculationType: "Gross Ratio",
    bufferMinutes: 15,
    isActive: "Active",
  },
  {
    sl: 11,
    employeeType: "Security Guard",
    department: "HR & Admin",
    section: "ALL",
    designation: "ALL",
    unit: "ALL",
    otCalculationType: "Fixed Hour",
    bufferMinutes: 10,
    isActive: "Active",
  },
  {
    sl: 12,
    employeeType: "Office Runner",
    department: "HR & Admin",
    section: "ALL",
    designation: "ALL",
    unit: "ALL",
    otCalculationType: "Fixed Hour",
    bufferMinutes: 15,
    isActive: "Active",
  },
  {
    sl: 13,
    employeeType: "Company Driver",
    department: "HR & Admin",
    section: "ALL",
    designation: "ALL",
    unit: "ALL",
    otCalculationType: "Fixed Hour",
    bufferMinutes: 20,
    isActive: "Active",
  },
  {
    sl: 14,
    employeeType: "HR & Admin",
    department: "HR & Admin",
    section: "ALL",
    designation: "ALL",
    unit: "ALL",
    otCalculationType: "Fixed Hour",
    bufferMinutes: 15,
    isActive: "Active",
  },
  {
    sl: 15,
    employeeType: "Store Keeper",
    department: "HR & Admin",
    section: "ALL",
    designation: "ALL",
    unit: "ALL",
    otCalculationType: "Gross Ratio",
    bufferMinutes: 15,
    isActive: "Active",
  },
  {
    sl: 16,
    employeeType: "Quality Inspector",
    department: "Quality Assurance",
    section: "Inspection",
    designation: "QC Inspector",
    unit: "ALL",
    otCalculationType: "Basic Ratio",
    bufferMinutes: 10,
    isActive: "Active",
  },
  {
    sl: 17,
    employeeType: "Senior Welder",
    department: "Production Dept",
    section: "ALL",
    designation: "ALL",
    unit: "ALL",
    otCalculationType: "Fixed Hour",
    bufferMinutes: 15,
    isActive: "Active",
  },
  {
    sl: 18,
    employeeType: "Helper",
    department: "Production Dept",
    section: "Sewing Section",
    designation: "Helper",
    unit: "ALL",
    otCalculationType: "Fixed Hour",
    bufferMinutes: 10,
    isActive: "Active",
  },
  {
    sl: 19,
    employeeType: "Senior Executive",
    department: "HR & Admin",
    section: "ALL",
    designation: "ALL",
    unit: "ALL",
    otCalculationType: "Fixed Hour",
    bufferMinutes: 30,
    isActive: "Active",
  },
  {
    sl: 20,
    employeeType: "Junior Officer",
    department: "HR & Admin",
    section: "ALL",
    designation: "ALL",
    unit: "ALL",
    otCalculationType: "Fixed Hour",
    bufferMinutes: 20,
    isActive: "Active",
  },
];

const DEFAULT_ABNORMAL_SHIFTS: AbnormalShift[] = [
  {
    sl: 1,
    shiftName: "Night",
    dateFrom: "2024-12-30",
    dateTo: "2041-11-30",
    dayFor: "Thursday",
    minOutTime: "09:00:00",
    maxOutTime: "15:00:00",
    prevDayInTime: "06:00:00",
    splitOutTime: "06:00:00",
    isActive: "Active",
  },
  {
    sl: 2,
    shiftName: "Morning Roster",
    dateFrom: "2025-01-01",
    dateTo: "2025-12-31",
    dayFor: "Friday",
    minOutTime: "14:00:00",
    maxOutTime: "16:00:00",
    prevDayInTime: "05:00:00",
    splitOutTime: "13:00:00",
    isActive: "Active",
  },
  {
    sl: 3,
    shiftName: "Evening Roster",
    dateFrom: "2026-03-15",
    dateTo: "2026-04-15",
    dayFor: "ALL",
    minOutTime: "18:00:00",
    maxOutTime: "20:00:00",
    prevDayInTime: "13:00:00",
    splitOutTime: "21:00:00",
    isActive: "Active",
  },
];

const DEFAULT_ATTN_BONUS_POLICIES: AttendanceBonusPolicy[] = [
  "General Worker Policy",
  "Senior Staff Policy",
  "Officer Bonus Policy",
  "Eid Special Attendance",
  "Ramadan Punctuality Policy",
  "Monsoon Regularity Bonus",
  "Winter Shift Incentive",
  "Night Shift Attendance Bonus",
  "Perfect Month Award",
  "Quarterly Regularity Bonus",
  "Basic Attendance Support",
  "Operator Incentive Plan",
  "Helper Punctuality Plan",
  "Security Attendance Bonus",
  "Support Staff Reward",
  "IT & Maintenance Incentive",
  "Driver Regularity Bonus",
  "Store Keepers Bonus Scheme",
  "Executive Regularity Policy",
  "Technical Team Punctuality",
].map((name, i) => ({
  sl: i + 1,
  name,
  employeeType: "ALL",
  department: "All Departments",
  section: "ALL",
  designation: "ALL",
  unit: "ALL",
  maxLeaveAllowed: 0,
  maxAbsentAllowed: 0,
  lateBasedOn: "Both",
  maxLateAllowed: 0,
  maxLateMin: 0,
  lateAuthCount: 0,
  maxEarlyOutAllowed: "Both",
  maxEarlyOutMin: 0,
  earlyOutAuthCount: 0,
  combinedStatus: "Yes",
  combinedBasedOn: "Min",
  combinedMaxMin: 1,
  combinedAuth: 0,
  calculateBy: "Percentage (%)",
  ratio: 100,
  isActive: "Active",
}));

function TimeSetupPage() {
  const [activeTab, setActiveTab] = useState<TabType>("shift");
  const [searchQuery, setSearchQuery] = useState("");

  // Lists state
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [otConfigs, setOtConfigs] = useState<OtConfig[]>([]);
  const [abnormalShifts, setAbnormalShifts] = useState<AbnormalShift[]>([]);
  const [attnPolicies, setAttnPolicies] = useState<AttendanceBonusPolicy[]>([]);

  // Shift Info modal state
  const [isShiftInfoOpen, setIsShiftInfoOpen] = useState(false);
  const [shiftInfoItem, setShiftInfoItem] = useState<Shift | null>(null);
  // Shift Info editable fields
  const [siStartDate, setSiStartDate] = useState("");
  const [siEndDate, setSiEndDate] = useState("");
  const [siNameEng, setSiNameEng] = useState("");
  const [siNameBng, setSiNameBng] = useState("");
  const [siStartTime, setSiStartTime] = useState("");
  const [siEndTime, setSiEndTime] = useState("");
  const [siLateTime, setSiLateTime] = useState("");
  const [siLateCount, setSiLateCount] = useState<"Yes" | "No">("No");
  const [siLunchFrom, setSiLunchFrom] = useState("");
  const [siLunchTo, setSiLunchTo] = useState("");
  const [siSortOrder, setSiSortOrder] = useState<number>(1);
  const [siIsActive, setSiIsActive] = useState<"Active" | "Inactive">("Active");
  const [siIsRotate, setSiIsRotate] = useState<"Yes" | "No">("No");
  const [siRotationCriteria, setSiRotationCriteria] = useState("");
  const [siShiftChangeDay, setSiShiftChangeDay] = useState("Select..");
  const [siIsLateDeduction, setSiIsLateDeduction] = useState<"Yes" | "No">("No");
  const [siStartTimeFrom, setSiStartTimeFrom] = useState("");
  const [siEndTimeTo, setSiEndTimeTo] = useState("");

  // OT Config Info modal state
  const [isOtInfoOpen, setIsOtInfoOpen] = useState(false);
  const [oiModalTab, setOiModalTab] = useState<
    "general" | "timings" | "slabs" | "rules" | "breaks"
  >("general");
  const [otInfoItem, setOtInfoItem] = useState<OtConfig | null>(null);
  const [oiEmployeeType, setOiEmployeeType] = useState("ALL");
  const [oiDepartment, setOiDepartment] = useState("All Departments");
  const [oiSection, setOiSection] = useState("ALL");
  const [oiDesignation, setOiDesignation] = useState("ALL");
  const [oiUnit, setOiUnit] = useState("ALL");
  const [oiStartDate, setOiStartDate] = useState("");
  const [oiEndDate, setOiEndDate] = useState("");
  const [oiShift, setOiShift] = useState("General");
  const [oiStartTime, setOiStartTime] = useState("06:11:00");
  const [oiEndTime, setOiEndTime] = useState("11:59:00");
  const [oiShiftStartTime, setOiShiftStartTime] = useState("08:00:00");
  const [oiOtStartTime, setOiOtStartTime] = useState("17:00:00");
  const [oiOtToleranceUpTo, setOiOtToleranceUpTo] = useState("");
  const [oiTime2Min, setOiTime2Min] = useState<number>(110);
  const [oiTime2MaxOt, setOiTime2MaxOt] = useState<number>(2);
  const [oiTime3Min, setOiTime3Min] = useState<number>(110);
  const [oiTime3MaxOt, setOiTime3MaxOt] = useState<number>(2);
  const [oiTime4Min, setOiTime4Min] = useState<number>(0);
  const [oiTime4MaxOt, setOiTime4MaxOt] = useState<number>(0);
  const [oiOtAfterWH, setOiOtAfterWH] = useState<"Yes" | "No">("No");
  const [oiGeneralDeductHour, setOiGeneralDeductHour] = useState<number>(0);
  const [oiHolidayDeductHour, setOiHolidayDeductHour] = useState<number>(1);
  const [oiDeductAfter, setOiDeductAfter] = useState<number>(0);
  const [oiOtRound, setOiOtRound] = useState<"Yes" | "No">("Yes");
  const [oiRoundSlots, setOiRoundSlots] = useState("0-49,0#50-59,1");
  const [oiMinOt, setOiMinOt] = useState<number>(0);
  const [oiMaxOt, setOiMaxOt] = useState<number>(14);
  const [oiOtType, setOiOtType] = useState("General");
  const [oiPrayerBreak, setOiPrayerBreak] = useState<"Yes" | "No">("No");
  const [oiDinnerBreak, setOiDinnerBreak] = useState<"Yes" | "No">("Yes");
  const [oiDeductionFor, setOiDeductionFor] = useState("Holiday");
  const [oiTimeFrom, setOiTimeFrom] = useState("14:00:00");
  const [oiTimeTo, setOiTimeTo] = useState("14:30:00");
  const [oiDeductMin, setOiDeductMin] = useState<number>(30);
  const [oiIsActive, setOiIsActive] = useState<"Active" | "Inactive">("Active");
  const [oiOtStartFromShift, setOiOtStartFromShift] = useState<"Yes" | "No">("Yes");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as TabType;
      if (tabParam && ["shift", "ot", "abnormal", "bonus"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }

    const safeParse = (key: string, defaultVal: any) => {
      const saved = localStorage.getItem(key);
      if (!saved) return defaultVal;
      try {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) return defaultVal;
        // If stored data has fewer items than defaultVal, override it to ensure expanded list is loaded
        if (parsed.length < defaultVal.length) {
          return defaultVal;
        }
        return parsed;
      } catch (e) {
        return defaultVal;
      }
    };

    // Shifts
    const shiftsData = safeParse("hris_shifts", DEFAULT_SHIFTS);
    setShifts(shiftsData);
    localStorage.setItem("hris_shifts", JSON.stringify(shiftsData));

    // OT Config
    const otData = safeParse("hris_ot_config", DEFAULT_OT_CONFIGS).map((o: any) => ({
      ...o,
      department: o.department || "All Departments",
      section: o.section || "ALL",
      designation: o.designation || "ALL",
      unit: o.unit || "ALL",
    }));
    setOtConfigs(otData);
    localStorage.setItem("hris_ot_config", JSON.stringify(otData));

    // Abnormal Shifts
    const abData = safeParse("hris_abnormal_shifts", DEFAULT_ABNORMAL_SHIFTS);
    setAbnormalShifts(abData);
    localStorage.setItem("hris_abnormal_shifts", JSON.stringify(abData));

    // Attendance Policies
    const policiesData = safeParse("hris_attendance_bonus_policy", DEFAULT_ATTN_BONUS_POLICIES);
    setAttnPolicies(policiesData);
    localStorage.setItem("hris_attendance_bonus_policy", JSON.stringify(policiesData));
  }, []);

  // Modal controls
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editSl, setEditSl] = useState<number | null>(null);

  // Form states - Shift
  const [shiftNameEng, setShiftNameEng] = useState("");
  const [shiftNameBng, setShiftNameBng] = useState("");
  const [shiftStart, setShiftStart] = useState("08:00:00");
  const [shiftEnd, setShiftEnd] = useState("17:00:00");
  const [shiftLate, setShiftLate] = useState("08:05:00");
  const [shiftLateCount, setShiftLateCount] = useState<"Yes" | "No">("Yes");
  const [shiftStartFrom, setShiftStartFrom] = useState("06:00:00");
  const [shiftEndTo, setShiftEndTo] = useState("12:00:00");
  const [shiftSort, setShiftSort] = useState<number>(1);
  const [shiftIsActive, setShiftIsActive] = useState<"Active" | "Inactive">("Active");
  const [shiftIsRotate, setShiftIsRotate] = useState<"Yes" | "No">("No");
  const [shiftRotation, setShiftRotation] = useState("");
  const [shiftChangeDay, setShiftChangeDay] = useState("Select..");
  const [shiftIsLateDeduct, setShiftIsLateDeduct] = useState<"Yes" | "No">("No");
  const [shiftDeductFrom, setShiftDeductFrom] = useState("");
  const [shiftDeductPer, setShiftDeductPer] = useState("");
  const [shiftDeductAfterDay, setShiftDeductAfterDay] = useState("");

  // Form states - OT Configuration
  const [otEmpType, setOtEmpType] = useState("ALL");
  const [otCalcType, setOtCalcType] = useState("Fixed Hour");
  const [otBuffer, setOtBuffer] = useState<number>(15);
  const [otIsActive, setOtIsActive] = useState<"Active" | "Inactive">("Active");

  // Form states - Abnormal Shift
  const [abShiftName, setAbShiftName] = useState("");
  const [abDateFrom, setAbDateFrom] = useState("");
  const [abDateTo, setAbDateTo] = useState("");
  const [abDayFor, setAbDayFor] = useState("Thursday");
  const [abMinOutTime, setAbMinOutTime] = useState("");
  const [abMaxOutTime, setAbMaxOutTime] = useState("");
  const [abPrevDayInTime, setAbPrevDayInTime] = useState("");
  const [abSplitOutTime, setAbSplitOutTime] = useState("");
  const [abIsActive, setAbIsActive] = useState<"Active" | "Inactive">("Active");

  // Form states - Attendance Bonus Policy
  const [policyEmployeeType, setPolicyEmployeeType] = useState("ALL");
  const [policyDepartment, setPolicyDepartment] = useState("All Departments");
  const [policySection, setPolicySection] = useState("ALL");
  const [policyDesignation, setPolicyDesignation] = useState("ALL");
  const [policyUnit, setPolicyUnit] = useState("ALL");
  const [policyMaxLeave, setPolicyMaxLeave] = useState<number>(0);
  const [policyMaxAbsent, setPolicyMaxAbsent] = useState<number>(0);
  const [policyLateBasedOn, setPolicyLateBasedOn] = useState("Both");
  const [policyMaxLateAllowed, setPolicyMaxLateAllowed] = useState<number>(0);
  const [policyMaxLateMin, setPolicyMaxLateMin] = useState<number>(0);
  const [policyLateAuthCount, setPolicyLateAuthCount] = useState<number>(0);
  const [policyMaxEarlyOutAllowed, setPolicyMaxEarlyOutAllowed] = useState("Both");
  const [policyMaxEarlyOutMin, setPolicyMaxEarlyOutMin] = useState<number>(0);
  const [policyEarlyOutAuthCount, setPolicyEarlyOutAuthCount] = useState<number>(0);
  const [policyCombinedStatus, setPolicyCombinedStatus] = useState<"Yes" | "No">("Yes");
  const [policyCombinedBasedOn, setPolicyCombinedBasedOn] = useState("Min");
  const [policyCombinedMaxMin, setPolicyCombinedMaxMin] = useState<number>(1);
  const [policyCombinedAuth, setPolicyCombinedAuth] = useState<number>(0);
  const [policyCalculateBy, setPolicyCalculateBy] = useState("Percentage (%)");
  const [policyRatio, setPolicyRatio] = useState<number>(100);
  const [policyIsActive, setPolicyIsActive] = useState<"Active" | "Inactive">("Active");

  const openForm = (sl: number | null) => {
    setEditSl(sl);
    if (activeTab === "shift") {
      const item = shifts.find((s) => s.sl === sl);
      setShiftNameEng(item?.nameEng || "");
      setShiftNameBng(item?.nameBng || "");
      setShiftStart(item?.startTime || "08:00:00");
      setShiftEnd(item?.endTime || "17:00:00");
      setShiftLate(item?.lateTime || "08:05:00");
      setShiftLateCount(item?.lateCount || "Yes");
      setShiftStartFrom(item?.startTimeFrom || "06:00:00");
      setShiftEndTo(item?.endTimeTo || "12:00:00");
      setShiftSort(item?.sortOrder || shifts.length + 1);
      setShiftIsActive(item?.isActive || "Active");
      setShiftIsRotate(item?.isRotate || "No");
      setShiftRotation(item?.rotationCriteria || "");
      setShiftChangeDay(item?.shiftChangeDay || "Select..");
      setShiftIsLateDeduct(item?.isLateDeduction || "No");
      setShiftDeductFrom(item?.deductionFrom || "");
      setShiftDeductPer(item?.deductionPer || "");
      setShiftDeductAfterDay(item?.deductionAfterDay || "");
    } else if (activeTab === "ot") {
      const item = otConfigs.find((o) => o.sl === sl);
      setOtInfoItem(
        item ||
        ({ sl: 0, employeeType: "ALL", isActive: "Active", otCalculationType: "General" } as any),
      );
      setOiEmployeeType(item?.employeeType || "ALL");
      setOiDepartment(item?.department || "All Departments");
      setOiSection(item?.section || "ALL");
      setOiDesignation(item?.designation || "ALL");
      setOiUnit(item?.unit || "ALL");
      setOiStartDate(item?.startDate || "");
      setOiEndDate(item?.endDate || "");
      setOiShift(item?.shift || "General");
      setOiStartTime(item?.startTime || "06:11:00");
      setOiEndTime(item?.endTime || "11:59:00");
      setOiShiftStartTime(item?.shiftStartTime || "08:00:00");
      setOiOtStartTime(item?.otStartTime || "17:00:00");
      setOiOtToleranceUpTo(item?.otToleranceUpTo || "");
      setOiTime2Min(item?.time2Min !== undefined ? item.time2Min : 110);
      setOiTime2MaxOt(item?.time2MaxOt !== undefined ? item.time2MaxOt : 2);
      setOiTime3Min(item?.time3Min !== undefined ? item.time3Min : 110);
      setOiTime3MaxOt(item?.time3MaxOt !== undefined ? item.time3MaxOt : 2);
      setOiTime4Min(item?.time4Min !== undefined ? item.time4Min : 0);
      setOiTime4MaxOt(item?.time4MaxOt !== undefined ? item.time4MaxOt : 0);
      setOiOtAfterWH(item?.otAfterWH || "No");
      setOiGeneralDeductHour(item?.generalDeductHour !== undefined ? item.generalDeductHour : 0);
      setOiHolidayDeductHour(item?.holidayDeductHour !== undefined ? item.holidayDeductHour : 1);
      setOiDeductAfter(item?.deductAfter !== undefined ? item.deductAfter : 0);
      setOiOtRound(item?.otRound || "Yes");
      setOiRoundSlots(item?.roundSlots || "0-49,0#50-59,1");
      setOiMinOt(item?.minOt !== undefined ? item.minOt : 0);
      setOiMaxOt(item?.maxOt !== undefined ? item.maxOt : 14);
      setOiOtType(item?.otCalculationType || "General");
      setOiPrayerBreak(item?.prayerBreak || "No");
      setOiDinnerBreak(item?.dinnerBreak || "Yes");
      setOiDeductionFor(item?.deductionFor || "Holiday");
      setOiTimeFrom(item?.timeFrom || "14:00:00");
      setOiTimeTo(item?.timeTo || "14:30:00");
      setOiDeductMin(item?.deductMin !== undefined ? item.deductMin : 30);
      setOiIsActive(item?.isActive || "Active");
      setOiOtStartFromShift(item?.otStartFromShift || "Yes");
      setIsOtInfoOpen(true);
      return;
    } else if (activeTab === "abnormal") {
      const item = abnormalShifts.find((a) => a.sl === sl);
      setAbShiftName(item?.shiftName || "");
      setAbDateFrom(item?.dateFrom || "");
      setAbDateTo(item?.dateTo || "");
      setAbDayFor(item?.dayFor || "Thursday");
      setAbMinOutTime(item?.minOutTime || "09:00:00");
      setAbMaxOutTime(item?.maxOutTime || "15:00:00");
      setAbPrevDayInTime(item?.prevDayInTime || "06:00:00");
      setAbSplitOutTime(item?.splitOutTime || "06:00:00");
      setAbIsActive(item?.isActive || "Active");
    } else if (activeTab === "bonus") {
      const item = attnPolicies.find((b) => b.sl === sl);
      setPolicyEmployeeType(item?.employeeType || "ALL");
      setPolicyDepartment(item?.department || "All Departments");
      setPolicySection(item?.section || "ALL");
      setPolicyDesignation(item?.designation || "ALL");
      setPolicyUnit(item?.unit || "ALL");
      setPolicyMaxLeave(item?.maxLeaveAllowed !== undefined ? item.maxLeaveAllowed : 0);
      setPolicyMaxAbsent(item?.maxAbsentAllowed !== undefined ? item.maxAbsentAllowed : 0);
      setPolicyLateBasedOn(item?.lateBasedOn || "Both");
      setPolicyMaxLateAllowed(item?.maxLateAllowed !== undefined ? item.maxLateAllowed : 0);
      setPolicyMaxLateMin(item?.maxLateMin !== undefined ? item.maxLateMin : 0);
      setPolicyLateAuthCount(item?.lateAuthCount !== undefined ? item.lateAuthCount : 0);
      setPolicyMaxEarlyOutAllowed(item?.maxEarlyOutAllowed || "Both");
      setPolicyMaxEarlyOutMin(item?.maxEarlyOutMin !== undefined ? item.maxEarlyOutMin : 0);
      setPolicyEarlyOutAuthCount(
        item?.earlyOutAuthCount !== undefined ? item.earlyOutAuthCount : 0,
      );
      setPolicyCombinedStatus(item?.combinedStatus || "Yes");
      setPolicyCombinedBasedOn(item?.combinedBasedOn || "Min");
      setPolicyCombinedMaxMin(item?.combinedMaxMin !== undefined ? item.combinedMaxMin : 1);
      setPolicyCombinedAuth(item?.combinedAuth !== undefined ? item.combinedAuth : 0);
      setPolicyCalculateBy(item?.calculateBy || "Percentage (%)");
      setPolicyRatio(item?.ratio !== undefined ? item.ratio : 100);
      setPolicyIsActive(item?.isActive || "Active");
    }
    setIsFormOpen(true);
  };

  const handleDelete = (sl: number) => {
    if (!confirm("Are you sure you want to delete this setting?")) return;

    if (activeTab === "shift") {
      const updated = shifts.filter((s) => s.sl !== sl).map((s, idx) => ({ ...s, sl: idx + 1 }));
      setShifts(updated);
      localStorage.setItem("hris_shifts", JSON.stringify(updated));
    } else if (activeTab === "ot") {
      const updated = otConfigs.filter((o) => o.sl !== sl).map((o, idx) => ({ ...o, sl: idx + 1 }));
      setOtConfigs(updated);
      localStorage.setItem("hris_ot_config", JSON.stringify(updated));
    } else if (activeTab === "abnormal") {
      const updated = abnormalShifts
        .filter((a) => a.sl !== sl)
        .map((a, idx) => ({ ...a, sl: idx + 1 }));
      setAbnormalShifts(updated);
      localStorage.setItem("hris_abnormal_shifts", JSON.stringify(updated));
    } else if (activeTab === "bonus") {
      const updated = attnPolicies
        .filter((b) => b.sl !== sl)
        .map((b, idx) => ({ ...b, sl: idx + 1 }));
      setAttnPolicies(updated);
      localStorage.setItem("hris_attendance_bonus_policy", JSON.stringify(updated));
    }
    toast.success("Deleted successfully");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "shift") {
      if (!shiftNameEng) {
        toast.error("Shift Name is required.");
        return;
      }
      let nextList = [...shifts];
      if (editSl !== null) {
        nextList = shifts.map((s) =>
          s.sl === editSl
            ? {
              ...s,
              nameEng: shiftNameEng,
              nameBng: shiftNameBng,
              startTime: shiftStart,
              endTime: shiftEnd,
              lateTime: shiftLate,
              startTimeFrom: shiftStartFrom,
              endTimeTo: shiftEndTo,
              lateCount: shiftLateCount,
              sortOrder: Number(shiftSort),
              isActive: shiftIsActive,
              isRotate: shiftIsRotate,
              rotationCriteria: shiftRotation,
              shiftChangeDay,
              isLateDeduction: shiftIsLateDeduct,
              deductionFrom: shiftDeductFrom,
              deductionPer: shiftDeductPer,
              deductionAfterDay: shiftDeductAfterDay,
            }
            : s,
        );
      } else {
        const sl = shifts.length > 0 ? Math.max(...shifts.map((s) => s.sl)) + 1 : 1;
        nextList.push({
          sl,
          nameEng: shiftNameEng,
          nameBng: shiftNameBng,
          startTime: shiftStart,
          endTime: shiftEnd,
          lateTime: shiftLate,
          startTimeFrom: shiftStartFrom,
          endTimeTo: shiftEndTo,
          lateCount: shiftLateCount,
          sortOrder: Number(shiftSort),
          isActive: shiftIsActive,
          isRotate: shiftIsRotate,
          rotationCriteria: shiftRotation,
          shiftChangeDay,
          isLateDeduction: shiftIsLateDeduct,
          deductionFrom: shiftDeductFrom,
          deductionPer: shiftDeductPer,
          deductionAfterDay: shiftDeductAfterDay,
        });
      }
      setShifts(nextList);
      localStorage.setItem("hris_shifts", JSON.stringify(nextList));
    } else if (activeTab === "ot") {
      let nextList = [...otConfigs];
      if (editSl !== null) {
        nextList = otConfigs.map((o) =>
          o.sl === editSl
            ? {
              ...o,
              employeeType: otEmpType,
              otCalculationType: otCalcType,
              bufferMinutes: Number(otBuffer),
              isActive: otIsActive,
            }
            : o,
        );
      } else {
        const sl = otConfigs.length > 0 ? Math.max(...otConfigs.map((o) => o.sl)) + 1 : 1;
        nextList.push({
          sl,
          employeeType: otEmpType,
          otCalculationType: otCalcType,
          bufferMinutes: Number(otBuffer),
          isActive: otIsActive,
          department: "All Departments",
          section: "ALL",
          designation: "ALL",
          unit: "ALL",
        });
      }
      setOtConfigs(nextList);
      localStorage.setItem("hris_ot_config", JSON.stringify(nextList));
    } else if (activeTab === "abnormal") {
      if (!abShiftName) {
        toast.error("Shift Name is required.");
        return;
      }
      let nextList = [...abnormalShifts];
      const newAb: AbnormalShift = {
        sl:
          editSl !== null
            ? editSl
            : abnormalShifts.length > 0
              ? Math.max(...abnormalShifts.map((a) => a.sl)) + 1
              : 1,
        shiftName: abShiftName,
        dateFrom: abDateFrom,
        dateTo: abDateTo,
        dayFor: abDayFor,
        minOutTime: abMinOutTime,
        maxOutTime: abMaxOutTime,
        prevDayInTime: abPrevDayInTime,
        splitOutTime: abSplitOutTime,
        isActive: abIsActive,
      };
      if (editSl !== null) {
        nextList = abnormalShifts.map((a) => (a.sl === editSl ? newAb : a));
      } else {
        nextList.push(newAb);
      }
      setAbnormalShifts(nextList);
      localStorage.setItem("hris_abnormal_shifts", JSON.stringify(nextList));
    } else if (activeTab === "bonus") {
      let nextList = [...attnPolicies];
      const pName = `${policyEmployeeType} - ${policyDepartment}`;
      const newPol: AttendanceBonusPolicy = {
        sl:
          editSl !== null
            ? editSl
            : attnPolicies.length > 0
              ? Math.max(...attnPolicies.map((b) => b.sl)) + 1
              : 1,
        name: pName,
        employeeType: policyEmployeeType,
        department: policyDepartment,
        section: policySection,
        designation: policyDesignation,
        unit: policyUnit,
        maxLeaveAllowed: Number(policyMaxLeave),
        maxAbsentAllowed: Number(policyMaxAbsent),
        lateBasedOn: policyLateBasedOn,
        maxLateAllowed: Number(policyMaxLateAllowed),
        maxLateMin: Number(policyMaxLateMin),
        lateAuthCount: Number(policyLateAuthCount),
        maxEarlyOutAllowed: policyMaxEarlyOutAllowed,
        maxEarlyOutMin: Number(policyMaxEarlyOutMin),
        earlyOutAuthCount: Number(policyEarlyOutAuthCount),
        combinedStatus: policyCombinedStatus,
        combinedBasedOn: policyCombinedBasedOn,
        combinedMaxMin: Number(policyCombinedMaxMin),
        combinedAuth: Number(policyCombinedAuth),
        calculateBy: policyCalculateBy,
        ratio: Number(policyRatio),
        isActive: policyIsActive,
      };
      if (editSl !== null) {
        nextList = attnPolicies.map((b) => (b.sl === editSl ? newPol : b));
      } else {
        nextList.push(newPol);
      }
      setAttnPolicies(nextList);
      localStorage.setItem("hris_attendance_bonus_policy", JSON.stringify(nextList));
    }

    toast.success("Saved successfully");
    setIsFormOpen(false);
  };

  const insetWrapperClass =
    "group relative rounded-xl border border-border/80 focus-within:border-primary px-3.5 py-1.5 bg-muted/15 focus-within:bg-card transition-all duration-200";
  const insetLabelClass =
    "text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-0.5";
  const insetInputClass =
    "w-full bg-transparent border-0 outline-none text-xs font-normal text-foreground focus:ring-0 p-0";
  const insetSelectClass =
    "w-full bg-transparent border-0 outline-none text-xs font-normal text-foreground focus:ring-0 p-0 cursor-pointer";

  // Tab Header Items
  const tabsList: { type: TabType; label: string; icon: any }[] = [
    { type: "shift", label: "Standard Shift", icon: Calendar },
    { type: "ot", label: "OT Configuration", icon: Clock },
    { type: "abnormal", label: "Abnormal Shift", icon: AlertTriangle },
    { type: "bonus", label: "Attendance Bonus Policy", icon: Coins },
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
                <span className="text-primary font-bold">Time & Shift Setup</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Calendar className="size-6 text-primary" />
                Time & Shift Configuration
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
              {activeTab === "shift" && (
                <table
                  className="w-full text-left text-xs border-collapse whitespace-nowrap"
                  style={{ minWidth: "1600px" }}
                >
                  <thead className="bg-muted/30 text-muted-foreground uppercase font-semibold tracking-wider text-xs border-b border-border/40">
                    <tr className="bg-transparent">
                      <th className="sticky left-0 bg-transparent px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">
                        #
                      </th>
                      <th className="sticky left-[60px] bg-transparent px-5 py-4 w-[140px] text-center border-r border-border/30 z-20">
                        Actions
                      </th>
                      <th className="px-5 py-4 min-w-[150px]">Name (Eng)</th>
                      <th className="px-5 py-4 min-w-[150px]">Name (Bng)</th>
                      <th className="px-5 py-4 w-[100px]">Start Time</th>
                      <th className="px-5 py-4 w-[100px]">End Time</th>
                      <th className="px-5 py-4 w-[100px]">Late Time</th>
                      <th className="px-5 py-4 w-[100px]">Start Time From</th>
                      <th className="px-5 py-4 w-[100px]">End Time To</th>
                      <th className="px-5 py-4 w-[100px] text-center">Late Count</th>
                      <th className="px-5 py-4 w-[100px] text-center">Sort Order</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                      <th className="px-5 py-4 w-[100px] text-center">IsRotate</th>
                      <th className="px-5 py-4 min-w-[150px]">Rotation Criteria</th>
                      <th className="px-5 py-4 w-[120px]">Shift Change Day</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {shifts
                      .filter((s) =>
                        (s.nameEng || "").toLowerCase().includes(searchQuery.toLowerCase()),
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
                                  setShiftInfoItem(item);
                                  setSiStartDate("");
                                  setSiEndDate("");
                                  setSiNameEng(item.nameEng);
                                  setSiNameBng(item.nameBng);
                                  setSiStartTime(item.startTime);
                                  setSiEndTime(item.endTime);
                                  setSiLateTime(item.lateTime);
                                  setSiLateCount(item.lateCount);
                                  setSiLunchFrom("");
                                  setSiLunchTo("");
                                  setSiSortOrder(item.sortOrder);
                                  setSiIsActive(item.isActive);
                                  setSiIsRotate(item.isRotate);
                                  setSiRotationCriteria(item.rotationCriteria);
                                  setSiShiftChangeDay(item.shiftChangeDay || "Select..");
                                  setSiIsLateDeduction(item.isLateDeduction);
                                  setSiStartTimeFrom(item.startTimeFrom);
                                  setSiEndTimeTo(item.endTimeTo);
                                  setIsShiftInfoOpen(true);
                                }}
                                className="text-purple-500 hover:text-purple-600 transition-colors"
                                title="Shift Information"
                              >
                                <SlidersHorizontal className="size-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-normal text-foreground font-medium">
                            {item.nameEng}
                          </td>
                          <td className="px-5 py-3.5 font-normal text-slate-800 dark:text-slate-200">
                            {item.nameBng || "—"}
                          </td>
                          <td className="px-5 py-3.5 font-normal font-mono">{item.startTime}</td>
                          <td className="px-5 py-3.5 font-normal font-mono">{item.endTime}</td>
                          <td className="px-5 py-3.5 font-normal font-mono">{item.lateTime}</td>
                          <td className="px-5 py-3.5 font-normal font-mono">
                            {item.startTimeFrom}
                          </td>
                          <td className="px-5 py-3.5 font-normal font-mono">{item.endTimeTo}</td>
                          <td className="px-5 py-3.5 text-center font-normal">{item.lateCount}</td>
                          <td className="px-5 py-3.5 text-center font-normal">{item.sortOrder}</td>
                          <td className="px-5 py-3.5 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}
                            >
                              {item.isActive}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-center font-normal">{item.isRotate}</td>
                          <td className="px-5 py-3.5 font-normal">
                            {item.rotationCriteria || "—"}
                          </td>
                          <td className="px-5 py-3.5 font-normal">{item.shiftChangeDay || "—"}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}

              {activeTab === "ot" && (
                <table
                  className="w-full text-left text-xs border-collapse whitespace-nowrap"
                  style={{ minWidth: "1200px" }}
                >
                  <thead className="bg-muted/30 text-muted-foreground uppercase font-semibold tracking-wider text-xs border-b border-border/40">
                    <tr className="bg-transparent">
                      <th className="sticky left-0 bg-transparent px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">
                        #
                      </th>
                      <th className="sticky left-[60px] bg-transparent px-5 py-4 w-[140px] text-center border-r border-border/30 z-20">
                        Actions
                      </th>
                      <th className="px-5 py-4 min-w-[150px]">Employee Type</th>
                      <th className="px-5 py-4 min-w-[150px]">Department</th>
                      <th className="px-5 py-4 min-w-[150px]">Section</th>
                      <th className="px-5 py-4 min-w-[150px]">Designation</th>
                      <th className="px-5 py-4 min-w-[100px]">Unit</th>
                      <th className="px-5 py-4 min-w-[155px]">OT Calculation Type</th>
                      <th className="px-5 py-4 w-[120px] text-center">Buffer Minutes</th>
                      <th className="px-5 py-4 w-[100px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {otConfigs
                      .filter(
                        (o) =>
                          (o.employeeType || "")
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          (o.department || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (o.section || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (o.designation || "").toLowerCase().includes(searchQuery.toLowerCase()),
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
                                className="text-red-500 hover:text-red-655 transition"
                                title="Delete"
                              >
                                <Trash2 className="size-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setOtInfoItem(item);
                                  setOiStartDate(item.startDate || "");
                                  setOiEndDate(item.endDate || "");
                                  setOiShift(item.shift || "General");
                                  setOiStartTime(item.startTime || "06:11:00");
                                  setOiEndTime(item.endTime || "11:59:00");
                                  setOiShiftStartTime(item.shiftStartTime || "08:00:00");
                                  setOiOtStartTime(item.otStartTime || "17:00:00");
                                  setOiOtToleranceUpTo(item.otToleranceUpTo || "");
                                  setOiTime2Min(item.time2Min !== undefined ? item.time2Min : 110);
                                  setOiTime2MaxOt(
                                    item.time2MaxOt !== undefined ? item.time2MaxOt : 2,
                                  );
                                  setOiTime3Min(item.time3Min !== undefined ? item.time3Min : 110);
                                  setOiTime3MaxOt(
                                    item.time3MaxOt !== undefined ? item.time3MaxOt : 2,
                                  );
                                  setOiTime4Min(item.time4Min !== undefined ? item.time4Min : 0);
                                  setOiTime4MaxOt(
                                    item.time4MaxOt !== undefined ? item.time4MaxOt : 0,
                                  );
                                  setOiOtAfterWH(item.otAfterWH || "No");
                                  setOiGeneralDeductHour(
                                    item.generalDeductHour !== undefined
                                      ? item.generalDeductHour
                                      : 0,
                                  );
                                  setOiHolidayDeductHour(
                                    item.holidayDeductHour !== undefined
                                      ? item.holidayDeductHour
                                      : 1,
                                  );
                                  setOiDeductAfter(
                                    item.deductAfter !== undefined ? item.deductAfter : 0,
                                  );
                                  setOiOtRound(item.otRound || "Yes");
                                  setOiRoundSlots(item.roundSlots || "0-49,0#50-59,1");
                                  setOiMinOt(item.minOt !== undefined ? item.minOt : 0);
                                  setOiMaxOt(item.maxOt !== undefined ? item.maxOt : 14);
                                  setOiOtType(item.otCalculationType || "General");
                                  setOiPrayerBreak(item.prayerBreak || "No");
                                  setOiDinnerBreak(item.dinnerBreak || "Yes");
                                  setOiDeductionFor(item.deductionFor || "Holiday");
                                  setOiTimeFrom(item.timeFrom || "14:00:00");
                                  setOiTimeTo(item.timeTo || "14:30:00");
                                  setOiDeductMin(
                                    item.deductMin !== undefined ? item.deductMin : 30,
                                  );
                                  setOiIsActive(item.isActive);
                                  setOiOtStartFromShift(item.otStartFromShift || "Yes");
                                  setOiEmployeeType(item.employeeType || "ALL");
                                  setOiDepartment(item.department || "All Departments");
                                  setOiSection(item.section || "ALL");
                                  setOiDesignation(item.designation || "ALL");
                                  setOiUnit(item.unit || "ALL");
                                  setEditSl(item.sl);
                                  setIsOtInfoOpen(true);
                                }}
                                className="text-purple-500 hover:text-purple-600 transition-colors"
                                title="OT Configuration Details"
                              >
                                <SlidersHorizontal className="size-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-normal text-foreground font-medium">
                            {item.employeeType}
                          </td>
                          <td className="px-5 py-3.5 font-normal text-slate-800 dark:text-slate-200">
                            {item.department}
                          </td>
                          <td className="px-5 py-3.5 font-normal text-slate-800 dark:text-slate-200">
                            {item.section}
                          </td>
                          <td className="px-5 py-3.5 font-normal text-slate-800 dark:text-slate-200">
                            {item.designation}
                          </td>
                          <td className="px-5 py-3.5 font-normal text-slate-800 dark:text-slate-200">
                            {item.unit}
                          </td>
                          <td className="px-5 py-3.5 font-normal text-slate-800 dark:text-slate-200">
                            {item.otCalculationType}
                          </td>
                          <td className="px-5 py-3.5 text-center font-normal font-mono">
                            {item.bufferMinutes} mins
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

              {activeTab === "abnormal" && (
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
                      <th className="px-5 py-4 min-w-[150px]">Shift Name</th>
                      <th className="px-5 py-4 w-[120px] text-center">Date From</th>
                      <th className="px-5 py-4 w-[120px] text-center">Date To</th>
                      <th className="px-5 py-4 w-[120px] text-center">Day For</th>
                      <th className="px-5 py-4 w-[120px] text-center">Min Out Time</th>
                      <th className="px-5 py-4 w-[120px] text-center">Max Out Time</th>
                      <th className="px-5 py-4 w-[120px] text-center">Prev Day In Time</th>
                      <th className="px-5 py-4 w-[120px] text-center">Split Out Time</th>
                      <th className="px-5 py-4 w-[100px] text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {abnormalShifts
                      .filter((a) =>
                        (a.shiftName || "").toLowerCase().includes(searchQuery.toLowerCase()),
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
                          <td className="px-5 py-3.5 font-bold text-foreground/90">
                            {item.shiftName}
                          </td>
                          <td className="px-5 py-3.5 text-center font-normal font-mono">
                            {item.dateFrom}
                          </td>
                          <td className="px-5 py-3.5 text-center font-normal font-mono">
                            {item.dateTo}
                          </td>
                          <td className="px-5 py-3.5 text-center font-semibold text-indigo-600 dark:text-indigo-400">
                            {item.dayFor}
                          </td>
                          <td className="px-5 py-3.5 text-center font-normal font-mono">
                            {item.minOutTime || "—"}
                          </td>
                          <td className="px-5 py-3.5 text-center font-normal font-mono">
                            {item.maxOutTime || "—"}
                          </td>
                          <td className="px-5 py-3.5 text-center font-normal font-mono">
                            {item.prevDayInTime || "—"}
                          </td>
                          <td className="px-5 py-3.5 text-center font-normal font-mono">
                            {item.splitOutTime || "—"}
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
                      <th className="px-5 py-4 min-w-[150px]">Employee Type</th>
                      <th className="px-5 py-4 min-w-[150px]">Department</th>
                      <th className="px-5 py-4 w-[120px] text-center">Max Leave</th>
                      <th className="px-5 py-4 w-[120px] text-center">Max Absent</th>
                      <th className="px-5 py-4 w-[150px] text-center">Calculate By</th>
                      <th className="px-5 py-4 w-[120px] text-right">Ratio/Amount</th>
                      <th className="px-5 py-4 w-[100px] text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {attnPolicies
                      .filter((b) =>
                        (b.name || "").toLowerCase().includes(searchQuery.toLowerCase()),
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
                          <td className="px-5 py-3.5 font-bold text-foreground/90">
                            {item.employeeType}
                          </td>
                          <td className="px-5 py-3.5 text-muted-foreground">{item.department}</td>
                          <td className="px-5 py-3.5 text-center font-mono">
                            {item.maxLeaveAllowed} Days
                          </td>
                          <td className="px-5 py-3.5 text-center font-mono">
                            {item.maxAbsentAllowed} Days
                          </td>
                          <td className="px-5 py-3.5 text-center">{item.calculateBy}</td>
                          <td className="px-5 py-3.5 text-right font-normal font-mono text-emerald-600">
                            {item.ratio}
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
              className={`bg-card border border-border/80 w-full rounded-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200 ${activeTab === "shift" || activeTab === "bonus" ? "max-w-5xl" : "max-w-2xl"}`}
            >
              {/* Modal Header */}
              <div className="px-6 py-4.5 border-b border-border/50 bg-transparent flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                    <Calendar className="size-5" />
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
                  className="size-8.5 rounded-xl hover:bg-muted/80 flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground border border-border/20"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Modal Form Body */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                {activeTab === "shift" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Name (Eng) *</label>
                      <input
                        type="text"
                        placeholder="Name (Eng)"
                        value={shiftNameEng}
                        onChange={(e) => setShiftNameEng(e.target.value)}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Name (Bng)</label>
                      <input
                        type="text"
                        placeholder="Name (Bng)"
                        value={shiftNameBng}
                        onChange={(e) => setShiftNameBng(e.target.value)}
                        className={insetInputClass}
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Start Time *</label>
                      <input
                        type="text"
                        placeholder="e.g. 08:00:00"
                        value={shiftStart}
                        onChange={(e) => setShiftStart(e.target.value)}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>End Time *</label>
                      <input
                        type="text"
                        placeholder="e.g. 17:00:00"
                        value={shiftEnd}
                        onChange={(e) => setShiftEnd(e.target.value)}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Late Time *</label>
                      <input
                        type="text"
                        placeholder="e.g. 08:05:00"
                        value={shiftLate}
                        onChange={(e) => setShiftLate(e.target.value)}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Late Count *</label>
                      <select
                        value={shiftLateCount}
                        onChange={(e) => setShiftLateCount(e.target.value as any)}
                        className={insetSelectClass}
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Start Time From *</label>
                      <input
                        type="text"
                        placeholder="e.g. 06:00:00"
                        value={shiftStartFrom}
                        onChange={(e) => setShiftStartFrom(e.target.value)}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>End Time To *</label>
                      <input
                        type="text"
                        placeholder="e.g. 12:00:00"
                        value={shiftEndTo}
                        onChange={(e) => setShiftEndTo(e.target.value)}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Sort Order *</label>
                      <input
                        type="number"
                        placeholder="Sort Order"
                        value={shiftSort}
                        onChange={(e) => setShiftSort(Number(e.target.value))}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Is Rotate?</label>
                      <select
                        value={shiftIsRotate}
                        onChange={(e) => setShiftIsRotate(e.target.value as any)}
                        className={insetSelectClass}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Rotation Criteria</label>
                      <input
                        type="text"
                        placeholder="Criteria"
                        value={shiftRotation}
                        onChange={(e) => setShiftRotation(e.target.value)}
                        className={insetInputClass}
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Shift Change Day</label>
                      <select
                        value={shiftChangeDay}
                        onChange={(e) => setShiftChangeDay(e.target.value)}
                        className={insetSelectClass}
                      >
                        <option value="Select..">Select..</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Is Late Deduction?</label>
                      <select
                        value={shiftIsLateDeduct}
                        onChange={(e) => setShiftIsLateDeduct(e.target.value as any)}
                        className={insetSelectClass}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Deduction From</label>
                      <input
                        type="text"
                        value={shiftDeductFrom}
                        onChange={(e) => setShiftDeductFrom(e.target.value)}
                        className={insetInputClass}
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Deduction Per</label>
                      <input
                        type="text"
                        value={shiftDeductPer}
                        onChange={(e) => setShiftDeductPer(e.target.value)}
                        className={insetInputClass}
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Deduction After Day</label>
                      <input
                        type="text"
                        value={shiftDeductAfterDay}
                        onChange={(e) => setShiftDeductAfterDay(e.target.value)}
                        className={insetInputClass}
                      />
                    </div>
                    <div className={`${insetWrapperClass} sm:col-span-2`}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select
                        value={shiftIsActive}
                        onChange={(e) => setShiftIsActive(e.target.value as any)}
                        className={insetSelectClass}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "ot" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Employee Type *</label>
                      <input
                        type="text"
                        placeholder="e.g. ALL, Permanent"
                        value={otEmpType}
                        onChange={(e) => setOtEmpType(e.target.value)}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>OT Calculation Type *</label>
                      <select
                        value={otCalcType}
                        onChange={(e) => setOtCalcType(e.target.value)}
                        className={insetSelectClass}
                      >
                        <option value="Fixed Hour">Fixed Hour</option>
                        <option value="Basic Ratio">Basic Ratio</option>
                        <option value="Gross Ratio">Gross Ratio</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Buffer Minutes *</label>
                      <input
                        type="number"
                        value={otBuffer}
                        onChange={(e) => setOtBuffer(Number(e.target.value))}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select
                        value={otIsActive}
                        onChange={(e) => setOtIsActive(e.target.value as any)}
                        className={insetSelectClass}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "abnormal" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Shift Name *</label>
                      <input
                        type="text"
                        placeholder="Abnormal Shift Name"
                        value={abShiftName}
                        onChange={(e) => setAbShiftName(e.target.value)}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Day For *</label>
                      <select
                        value={abDayFor}
                        onChange={(e) => setAbDayFor(e.target.value)}
                        className={insetSelectClass}
                        required
                      >
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Date From *</label>
                      <input
                        type="date"
                        value={abDateFrom}
                        onChange={(e) => setAbDateFrom(e.target.value)}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Date To *</label>
                      <input
                        type="date"
                        value={abDateTo}
                        onChange={(e) => setAbDateTo(e.target.value)}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Min Out Time</label>
                      <input
                        type="text"
                        placeholder="e.g. 09:00:00"
                        value={abMinOutTime}
                        onChange={(e) => setAbMinOutTime(e.target.value)}
                        className={insetInputClass}
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Max Out Time</label>
                      <input
                        type="text"
                        placeholder="e.g. 15:00:00"
                        value={abMaxOutTime}
                        onChange={(e) => setAbMaxOutTime(e.target.value)}
                        className={insetInputClass}
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Prev Day In Time</label>
                      <input
                        type="text"
                        placeholder="e.g. 06:00:00"
                        value={abPrevDayInTime}
                        onChange={(e) => setAbPrevDayInTime(e.target.value)}
                        className={insetInputClass}
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Split Out Time</label>
                      <input
                        type="text"
                        placeholder="e.g. 06:00:00"
                        value={abSplitOutTime}
                        onChange={(e) => setAbSplitOutTime(e.target.value)}
                        className={insetInputClass}
                      />
                    </div>
                    <div className={`${insetWrapperClass} sm:col-span-2`}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select
                        value={abIsActive}
                        onChange={(e) => setAbIsActive(e.target.value as any)}
                        className={insetSelectClass}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "bonus" && (
                  <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Row 1 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Employee Type</label>
                        <select
                          value={policyEmployeeType}
                          onChange={(e) => setPolicyEmployeeType(e.target.value)}
                          className={insetSelectClass}
                        >
                          <option value="ALL">ALL</option>
                          <option value="Permanent">Permanent</option>
                          <option value="Probation">Probation</option>
                        </select>
                      </div>
                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Department</label>
                        <select
                          value={policyDepartment}
                          onChange={(e) => setPolicyDepartment(e.target.value)}
                          className={insetSelectClass}
                        >
                          <option value="All Departments">All Departments</option>
                          <option value="Production">Production</option>
                          <option value="HR & Admin">HR & Admin</option>
                        </select>
                      </div>
                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Section</label>
                        <select
                          value={policySection}
                          onChange={(e) => setPolicySection(e.target.value)}
                          className={insetSelectClass}
                        >
                          <option value="ALL">ALL</option>
                        </select>
                      </div>
                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Designation</label>
                        <select
                          value={policyDesignation}
                          onChange={(e) => setPolicyDesignation(e.target.value)}
                          className={insetSelectClass}
                        >
                          <option value="ALL">ALL</option>
                        </select>
                      </div>
                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Unit</label>
                        <select
                          value={policyUnit}
                          onChange={(e) => setPolicyUnit(e.target.value)}
                          className={insetSelectClass}
                        >
                          <option value="ALL">ALL</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border/40 pt-6">
                      <div className="space-y-4">
                        {/* Leave/Absent limits */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className={insetWrapperClass}>
                            <label className={insetLabelClass}>
                              Max Leave Allowed <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              value={policyMaxLeave}
                              onChange={(e) => setPolicyMaxLeave(Number(e.target.value))}
                              className={insetInputClass}
                            />
                          </div>
                          <div className={insetWrapperClass}>
                            <label className={insetLabelClass}>
                              Max Absent Allowed <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              value={policyMaxAbsent}
                              onChange={(e) => setPolicyMaxAbsent(Number(e.target.value))}
                              className={insetInputClass}
                            />
                          </div>
                        </div>

                        {/* Late conditions */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className={insetWrapperClass}>
                            <label className={insetLabelClass}>
                              Late Based On <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={policyLateBasedOn}
                              onChange={(e) => setPolicyLateBasedOn(e.target.value)}
                              className={insetSelectClass}
                            >
                              <option value="Both">Both</option>
                              <option value="Count">Count</option>
                              <option value="Minutes">Minutes</option>
                            </select>
                          </div>
                          <div className={insetWrapperClass}>
                            <label className={insetLabelClass}>
                              Max Late Allowed <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              value={policyMaxLateAllowed}
                              onChange={(e) => setPolicyMaxLateAllowed(Number(e.target.value))}
                              className={insetInputClass}
                            />
                          </div>
                          <div className={insetWrapperClass}>
                            <label className={insetLabelClass}>
                              Max Late Min <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              value={policyMaxLateMin}
                              onChange={(e) => setPolicyMaxLateMin(Number(e.target.value))}
                              className={insetInputClass}
                            />
                          </div>
                          <div className={insetWrapperClass}>
                            <label className={insetLabelClass}>
                              Late Auth Count <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              value={policyLateAuthCount}
                              onChange={(e) => setPolicyLateAuthCount(Number(e.target.value))}
                              className={insetInputClass}
                            />
                          </div>
                        </div>

                        {/* Early Out conditions */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className={`${insetWrapperClass} col-span-2`}>
                            <label className={insetLabelClass}>
                              Max Early Out Allowed <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={policyMaxEarlyOutAllowed}
                              onChange={(e) => setPolicyMaxEarlyOutAllowed(e.target.value)}
                              className={insetSelectClass}
                            >
                              <option value="Both">Both</option>
                              <option value="Count">Count</option>
                              <option value="Minutes">Minutes</option>
                            </select>
                          </div>
                          <div className={insetWrapperClass}>
                            <label className={insetLabelClass}>
                              Max Early Out Min <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              value={policyMaxEarlyOutMin}
                              onChange={(e) => setPolicyMaxEarlyOutMin(Number(e.target.value))}
                              className={insetInputClass}
                            />
                          </div>
                          <div className={insetWrapperClass}>
                            <label className={insetLabelClass}>
                              EarlyOut Auth Count <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              value={policyEarlyOutAuthCount}
                              onChange={(e) => setPolicyEarlyOutAuthCount(Number(e.target.value))}
                              className={insetInputClass}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Combined conditions */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className={insetWrapperClass}>
                            <label className={insetLabelClass}>Combined(L/E) Status</label>
                            <select
                              value={policyCombinedStatus}
                              onChange={(e) => setPolicyCombinedStatus(e.target.value as any)}
                              className={insetSelectClass}
                            >
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>
                          <div className={insetWrapperClass}>
                            <label className={insetLabelClass}>Based On</label>
                            <select
                              value={policyCombinedBasedOn}
                              onChange={(e) => setPolicyCombinedBasedOn(e.target.value)}
                              className={insetSelectClass}
                            >
                              <option value="Min">Min</option>
                              <option value="Count">Count</option>
                            </select>
                          </div>
                          <div className={insetWrapperClass}>
                            <label className={insetLabelClass}>
                              Max Min <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              value={policyCombinedMaxMin}
                              onChange={(e) => setPolicyCombinedMaxMin(Number(e.target.value))}
                              className={insetInputClass}
                            />
                          </div>
                          <div className={insetWrapperClass}>
                            <label className={insetLabelClass}>
                              Combined Auth <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              value={policyCombinedAuth}
                              onChange={(e) => setPolicyCombinedAuth(Number(e.target.value))}
                              className={insetInputClass}
                            />
                          </div>
                        </div>

                        {/* Reward definition */}
                        <div className="grid grid-cols-2 gap-4 border-t border-border/40 pt-4 mt-4">
                          <div className={`${insetWrapperClass} col-span-2`}>
                            <label className={insetLabelClass}>
                              Calculate By <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={policyCalculateBy}
                              onChange={(e) => setPolicyCalculateBy(e.target.value)}
                              className={insetSelectClass}
                            >
                              <option value="Percentage (%)">Percentage (%)</option>
                              <option value="Fixed Amount">Fixed Amount</option>
                            </select>
                          </div>
                          <div className={insetWrapperClass}>
                            <label className={insetLabelClass}>
                              Ratio <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              value={policyRatio}
                              onChange={(e) => setPolicyRatio(Number(e.target.value))}
                              className={insetInputClass}
                            />
                          </div>
                          <div className={insetWrapperClass}>
                            <label className={insetLabelClass}>
                              IsActive <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={policyIsActive}
                              onChange={(e) => setPolicyIsActive(e.target.value as any)}
                              className={insetSelectClass}
                            >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                          </div>
                        </div>
                      </div>
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

        {/* Shift Info Modal */}
        {isShiftInfoOpen && shiftInfoItem && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-4xl rounded-lg shadow-2xl flex flex-col max-h-[96vh] overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="px-6 py-4 border-b border-border/50 bg-transparent flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600 border border-purple-500/20">
                    <SlidersHorizontal className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black tracking-tight text-foreground">
                      Update Shift Information
                    </h2>
                    <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                      {shiftInfoItem.nameEng}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsShiftInfoOpen(false)}
                  className="size-8 rounded-xl hover:bg-muted/80 flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground border border-border/20"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>Start Date *</label>
                    <input
                      type="date"
                      value={siStartDate}
                      onChange={(e) => setSiStartDate(e.target.value)}
                      className={insetInputClass}
                    />
                  </div>

                  {/* End Date */}
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>End Date *</label>
                    <input
                      type="date"
                      value={siEndDate}
                      onChange={(e) => setSiEndDate(e.target.value)}
                      className={insetInputClass}
                    />
                  </div>

                  {/* Name Eng */}
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>Name (Eng) *</label>
                    <input
                      type="text"
                      value={siNameEng}
                      onChange={(e) => setSiNameEng(e.target.value)}
                      className={insetInputClass}
                    />
                  </div>

                  {/* Name Bng */}
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>Name (Bng)</label>
                    <input
                      type="text"
                      value={siNameBng}
                      onChange={(e) => setSiNameBng(e.target.value)}
                      className={insetInputClass}
                    />
                  </div>

                  {/* Start Time */}
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>Start Time *</label>
                    <input
                      type="text"
                      value={siStartTime}
                      onChange={(e) => setSiStartTime(e.target.value)}
                      className={insetInputClass}
                      placeholder="HH:MM:SS"
                    />
                  </div>

                  {/* End Time */}
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>End Time *</label>
                    <input
                      type="text"
                      value={siEndTime}
                      onChange={(e) => setSiEndTime(e.target.value)}
                      className={insetInputClass}
                      placeholder="HH:MM:SS"
                    />
                  </div>

                  {/* Late Time */}
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>Late Time *</label>
                    <input
                      type="text"
                      value={siLateTime}
                      onChange={(e) => setSiLateTime(e.target.value)}
                      className={insetInputClass}
                      placeholder="HH:MM:SS"
                    />
                  </div>

                  {/* Late Count */}
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>Late Count *</label>
                    <select
                      value={siLateCount}
                      onChange={(e) => setSiLateCount(e.target.value as "Yes" | "No")}
                      className={insetSelectClass}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  {/* Lunch Break From */}
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>Lunch Break From *</label>
                    <input
                      type="text"
                      value={siLunchFrom}
                      onChange={(e) => setSiLunchFrom(e.target.value)}
                      className={insetInputClass}
                      placeholder="HH:MM:SS"
                    />
                  </div>

                  {/* Lunch Break To */}
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>Lunch Break To *</label>
                    <input
                      type="text"
                      value={siLunchTo}
                      onChange={(e) => setSiLunchTo(e.target.value)}
                      className={insetInputClass}
                      placeholder="HH:MM:SS"
                    />
                  </div>

                  {/* Sort Order */}
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>Sort Order *</label>
                    <input
                      type="number"
                      value={siSortOrder}
                      onChange={(e) => setSiSortOrder(Number(e.target.value))}
                      className={insetInputClass}
                    />
                  </div>

                  {/* IsActive */}
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>IsActive *</label>
                    <select
                      value={siIsActive}
                      onChange={(e) => setSiIsActive(e.target.value as "Active" | "Inactive")}
                      className={insetSelectClass}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Is Rotate */}
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>Is Rotate?</label>
                    <select
                      value={siIsRotate}
                      onChange={(e) => setSiIsRotate(e.target.value as "Yes" | "No")}
                      className={insetSelectClass}
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>

                  {/* Rotation Criteria */}
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>Rotation Criteria</label>
                    <input
                      type="text"
                      value={siRotationCriteria}
                      onChange={(e) => setSiRotationCriteria(e.target.value)}
                      className={insetInputClass}
                      placeholder="e.g. Weekly"
                    />
                  </div>

                  {/* Shift Change Day */}
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>Shift Change Day</label>
                    <select
                      value={siShiftChangeDay}
                      onChange={(e) => setSiShiftChangeDay(e.target.value)}
                      className={insetSelectClass}
                    >
                      <option value="Select..">Select..</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                    </select>
                  </div>

                  {/* Is Late Deduction */}
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>Is Late Deduction?</label>
                    <select
                      value={siIsLateDeduction}
                      onChange={(e) => setSiIsLateDeduction(e.target.value as "Yes" | "No")}
                      className={insetSelectClass}
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>

                  {/* Start Time From */}
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>Start Time From *</label>
                    <input
                      type="text"
                      value={siStartTimeFrom}
                      onChange={(e) => setSiStartTimeFrom(e.target.value)}
                      className={insetInputClass}
                      placeholder="HH:MM:SS"
                    />
                  </div>

                  {/* End Time To */}
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>End Time To *</label>
                    <input
                      type="text"
                      value={siEndTimeTo}
                      onChange={(e) => setSiEndTimeTo(e.target.value)}
                      className={insetInputClass}
                      placeholder="HH:MM:SS"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-border/50 flex items-center justify-between gap-3 bg-transparent px-6 py-4">
                <button
                  type="button"
                  onClick={() => setIsShiftInfoOpen(false)}
                  className="h-10 px-6 rounded-lg bg-[#f39c12] hover:bg-[#e67e22] text-white font-black text-xs transition-all uppercase tracking-wider shadow-sm hover:shadow"
                >
                  CLOSE
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const updated = shifts.map((s) =>
                      s.sl === shiftInfoItem.sl
                        ? {
                          ...s,
                          nameEng: siNameEng,
                          nameBng: siNameBng,
                          startTime: siStartTime,
                          endTime: siEndTime,
                          lateTime: siLateTime,
                          lateCount: siLateCount,
                          startTimeFrom: siStartTimeFrom,
                          endTimeTo: siEndTimeTo,
                          sortOrder: siSortOrder,
                          isActive: siIsActive,
                          isRotate: siIsRotate,
                          rotationCriteria: siRotationCriteria,
                          shiftChangeDay: siShiftChangeDay === "Select.." ? "" : siShiftChangeDay,
                          isLateDeduction: siIsLateDeduction,
                        }
                        : s,
                    );
                    setShifts(updated);
                    localStorage.setItem("hris_shifts", JSON.stringify(updated));
                    toast.success("Shift information updated successfully!");
                    setIsShiftInfoOpen(false);
                  }}
                  className="h-10 px-8 rounded-lg bg-[#27ae60] hover:bg-[#219a52] text-white font-black text-xs shadow-md hover:shadow-lg transition-all uppercase tracking-wider"
                >Create</button>
              </div>
            </div>
          </div>
        )}

        {/* OT Configuration Info Modal */}
        {isOtInfoOpen && otInfoItem && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-5xl rounded-lg shadow-2xl flex flex-col max-h-[96vh] overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="px-6 py-4 border-b border-border/50 bg-transparent flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600 border border-purple-500/20">
                    <SlidersHorizontal className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black tracking-tight text-foreground">
                      OT Configuration
                    </h2>
                    <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                      {otInfoItem.employeeType}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOtInfoOpen(false)}
                  className="size-8 rounded-xl hover:bg-muted/80 flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground border border-border/20"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Tab Navigation Removed */}

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-muted/5">
                {/* Target & Scope Block */}
                <div className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-foreground border-b border-border/50 pb-2 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-primary rounded-full"></span> Target & Scope
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Employee Type *</label>
                        <select
                          value={oiEmployeeType}
                          onChange={(e) => setOiEmployeeType(e.target.value)}
                          className={insetSelectClass}
                        >
                          <option value="ALL">ALL</option>
                          <option value="Operator">Operator</option>
                          <option value="Supervisor">Supervisor</option>
                          <option value="Helper">Helper</option>
                          <option value="Admin staff">Admin staff</option>
                          <option value="Permanent Worker">Permanent Worker</option>
                          <option value="Casual Worker">Casual Worker</option>
                        </select>
                      </div>
                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Department *</label>
                        <select
                          value={oiDepartment}
                          onChange={(e) => setOiDepartment(e.target.value)}
                          className={insetSelectClass}
                        >
                          <option value="All Departments">All Departments</option>
                          <option value="Production Dept">Production Dept</option>
                          <option value="HR & Admin">HR & Admin</option>
                          <option value="Quality Assurance">Quality Assurance</option>
                          <option value="Maintenance">Maintenance</option>
                        </select>
                      </div>
                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Section *</label>
                        <select
                          value={oiSection}
                          onChange={(e) => setOiSection(e.target.value)}
                          className={insetSelectClass}
                        >
                          <option value="ALL">ALL</option>
                          <option value="Sewing Section">Sewing Section</option>
                          <option value="Finishing Section">Finishing Section</option>
                          <option value="Cutting Section">Cutting Section</option>
                          <option value="Inspection">Inspection</option>
                        </select>
                      </div>
                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Designation *</label>
                        <select
                          value={oiDesignation}
                          onChange={(e) => setOiDesignation(e.target.value)}
                          className={insetSelectClass}
                        >
                          <option value="ALL">ALL</option>
                          <option value="Operator">Operator</option>
                          <option value="Supervisor">Supervisor</option>
                          <option value="Helper">Helper</option>
                          <option value="QC Inspector">QC Inspector</option>
                          <option value="Executive">Executive</option>
                        </select>
                      </div>
                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Unit *</label>
                        <select
                          value={oiUnit}
                          onChange={(e) => setOiUnit(e.target.value)}
                          className={insetSelectClass}
                        >
                          <option value="ALL">ALL</option>
                          <option value="Unit 1">Unit 1</option>
                          <option value="Unit 2">Unit 2</option>
                          <option value="Unit 3">Unit 3</option>
                        </select>
                      </div>
                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>IsActive *</label>
                        <select
                          value={oiIsActive}
                          onChange={(e) => setOiIsActive(e.target.value as any)}
                          className={insetSelectClass}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Start Date *</label>
                        <input
                          type="date"
                          value={oiStartDate}
                          onChange={(e) => setOiStartDate(e.target.value)}
                          className={insetInputClass}
                        />
                      </div>
                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>End Date *</label>
                        <input
                          type="date"
                          value={oiEndDate}
                          onChange={(e) => setOiEndDate(e.target.value)}
                          className={insetInputClass}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shift & Timings Block */}
                <div className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-foreground border-b border-border/50 pb-2 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-primary rounded-full"></span> Shift & Timings
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Shift</label>
                        <select
                          value={oiShift}
                          onChange={(e) => setOiShift(e.target.value)}
                          className={insetSelectClass}
                        >
                          <option value="General">General</option>
                          <option value="Morning Roster">Morning Roster</option>
                          <option value="Evening Roster">Evening Roster</option>
                          <option value="Night Roster">Night Roster</option>
                          <option value="ALL">ALL</option>
                        </select>
                      </div>
                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Start Time *</label>
                        <input
                          type="text"
                          value={oiStartTime}
                          onChange={(e) => setOiStartTime(e.target.value)}
                          className={insetInputClass}
                          placeholder="HH:MM:SS"
                        />
                      </div>
                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>End Time *</label>
                        <input
                          type="text"
                          value={oiEndTime}
                          onChange={(e) => setOiEndTime(e.target.value)}
                          className={insetInputClass}
                          placeholder="HH:MM:SS"
                        />
                      </div>
                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Shift Start Time *</label>
                        <input
                          type="text"
                          value={oiShiftStartTime}
                          onChange={(e) => setOiShiftStartTime(e.target.value)}
                          className={insetInputClass}
                          placeholder="HH:MM:SS"
                        />
                      </div>
                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>OT Start Time *</label>
                        <input
                          type="text"
                          value={oiOtStartTime}
                          onChange={(e) => setOiOtStartTime(e.target.value)}
                          className={insetInputClass}
                          placeholder="HH:MM:SS"
                        />
                      </div>
                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>OT Tolerance Up To</label>
                        <input
                          type="text"
                          value={oiOtToleranceUpTo}
                          onChange={(e) => setOiOtToleranceUpTo(e.target.value)}
                          className={insetInputClass}
                          placeholder="HH:MM:SS"
                        />
                      </div>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>OT Start Time From Shift *</label>
                      <select
                        value={oiOtStartFromShift}
                        onChange={(e) => setOiOtStartFromShift(e.target.value as "Yes" | "No")}
                        className={insetSelectClass}
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Overtime Slabs Block */}
                <div className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-foreground border-b border-border/50 pb-2 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-primary rounded-full"></span> Overtime Slabs
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-muted/10 p-4 rounded-xl border border-border/60">
                      <h4 className="text-xs font-black uppercase text-foreground mb-3">
                        Slab 2 Rules
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className={insetWrapperClass}>
                          <label className={insetLabelClass}>Time-2 (Min) *</label>
                          <input
                            type="number"
                            value={oiTime2Min}
                            onChange={(e) => setOiTime2Min(Number(e.target.value))}
                            className={insetInputClass}
                          />
                        </div>
                        <div className={insetWrapperClass}>
                          <label className={insetLabelClass}>Time-2 Max OT (Min) *</label>
                          <input
                            type="number"
                            value={oiTime2MaxOt}
                            onChange={(e) => setOiTime2MaxOt(Number(e.target.value))}
                            className={insetInputClass}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/10 p-4 rounded-xl border border-border/60">
                      <h4 className="text-xs font-black uppercase text-foreground mb-3">
                        Slab 3 Rules
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className={insetWrapperClass}>
                          <label className={insetLabelClass}>Time-3 (Min) *</label>
                          <input
                            type="number"
                            value={oiTime3Min}
                            onChange={(e) => setOiTime3Min(Number(e.target.value))}
                            className={insetInputClass}
                          />
                        </div>
                        <div className={insetWrapperClass}>
                          <label className={insetLabelClass}>Time-3 Max OT (Min) *</label>
                          <input
                            type="number"
                            value={oiTime3MaxOt}
                            onChange={(e) => setOiTime3MaxOt(Number(e.target.value))}
                            className={insetInputClass}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/10 p-4 rounded-xl border border-border/60">
                      <h4 className="text-xs font-black uppercase text-foreground mb-3">
                        Slab 4 Rules
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className={insetWrapperClass}>
                          <label className={insetLabelClass}>Time-4 (Min) *</label>
                          <input
                            type="number"
                            value={oiTime4Min}
                            onChange={(e) => setOiTime4Min(Number(e.target.value))}
                            className={insetInputClass}
                          />
                        </div>
                        <div className={insetWrapperClass}>
                          <label className={insetLabelClass}>Time-4 Max OT (Min) *</label>
                          <input
                            type="number"
                            value={oiTime4MaxOt}
                            onChange={(e) => setOiTime4MaxOt(Number(e.target.value))}
                            className={insetInputClass}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rounding & Rules Block */}
                <div className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-foreground border-b border-border/50 pb-2 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-primary rounded-full"></span> Rounding & Rules
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>OT After WH *</label>
                        <select
                          value={oiOtAfterWH}
                          onChange={(e) => setOiOtAfterWH(e.target.value as "Yes" | "No")}
                          className={insetSelectClass}
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>
                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>OT Round *</label>
                        <select
                          value={oiOtRound}
                          onChange={(e) => setOiOtRound(e.target.value as "Yes" | "No")}
                          className={insetSelectClass}
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div className={`${insetWrapperClass} sm:col-span-2`}>
                        <label className={insetLabelClass}>
                          Round Slots (Use number &amp; Comma) *
                        </label>
                        <input
                          type="text"
                          value={oiRoundSlots}
                          onChange={(e) => setOiRoundSlots(e.target.value)}
                          className={insetInputClass}
                          placeholder="0-49,0#50-59,1"
                        />
                      </div>
                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Min OT *</label>
                        <input
                          type="number"
                          value={oiMinOt}
                          onChange={(e) => setOiMinOt(Number(e.target.value))}
                          className={insetInputClass}
                        />
                      </div>
                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Max OT *</label>
                        <input
                          type="number"
                          value={oiMaxOt}
                          onChange={(e) => setOiMaxOt(Number(e.target.value))}
                          className={insetInputClass}
                        />
                      </div>
                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>OT Type *</label>
                        <select
                          value={oiOtType}
                          onChange={(e) => setOiOtType(e.target.value)}
                          className={insetSelectClass}
                        >
                          <option value="General">General</option>
                          <option value="Fixed Hour">Fixed Hour</option>
                          <option value="Basic Ratio">Basic Ratio</option>
                          <option value="Gross Ratio">Gross Ratio</option>
                        </select>
                      </div>
                    </div>
                    <div className="bg-muted/10 p-4 rounded-xl border border-border/60">
                      <h4 className="text-xs font-black uppercase text-foreground mb-3">
                        OT Deductions
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className={insetWrapperClass}>
                          <label className={insetLabelClass}>General Deduct Hour *</label>
                          <input
                            type="number"
                            value={oiGeneralDeductHour}
                            onChange={(e) => setOiGeneralDeductHour(Number(e.target.value))}
                            className={insetInputClass}
                          />
                        </div>
                        <div className={insetWrapperClass}>
                          <label className={insetLabelClass}>Holiday Deduct Hour *</label>
                          <input
                            type="number"
                            value={oiHolidayDeductHour}
                            onChange={(e) => setOiHolidayDeductHour(Number(e.target.value))}
                            className={insetInputClass}
                          />
                        </div>
                        <div className={insetWrapperClass}>
                          <label className={insetLabelClass}>Deduct After *</label>
                          <input
                            type="number"
                            value={oiDeductAfter}
                            onChange={(e) => setOiDeductAfter(Number(e.target.value))}
                            className={insetInputClass}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Breaks & Deductions Block */}
                <div className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-foreground border-b border-border/50 pb-2 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-primary rounded-full"></span> Breaks & Deductions
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Prayer Break</label>
                        <select
                          value={oiPrayerBreak}
                          onChange={(e) => setOiPrayerBreak(e.target.value as "Yes" | "No")}
                          className={insetSelectClass}
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>
                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Dinner/Others Break</label>
                        <select
                          value={oiDinnerBreak}
                          onChange={(e) => setOiDinnerBreak(e.target.value as "Yes" | "No")}
                          className={insetSelectClass}
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-muted/10 p-4 rounded-xl border border-border/60">
                      <h4 className="text-xs font-black uppercase text-foreground mb-3">
                        Dinner / General Break Deduction details
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div className={insetWrapperClass}>
                          <label className={insetLabelClass}>Deduction For</label>
                          <select
                            value={oiDeductionFor}
                            onChange={(e) => setOiDeductionFor(e.target.value)}
                            className={insetSelectClass}
                          >
                            <option value="Holiday">Holiday</option>
                            <option value="Weekday">Weekday</option>
                            <option value="All">All</option>
                          </select>
                        </div>
                        <div className={insetWrapperClass}>
                          <label className={insetLabelClass}>Time From *</label>
                          <input
                            type="text"
                            value={oiTimeFrom}
                            onChange={(e) => setOiTimeFrom(e.target.value)}
                            className={insetInputClass}
                            placeholder="HH:MM:SS"
                          />
                        </div>
                        <div className={insetWrapperClass}>
                          <label className={insetLabelClass}>Time To *</label>
                          <input
                            type="text"
                            value={oiTimeTo}
                            onChange={(e) => setOiTimeTo(e.target.value)}
                            className={insetInputClass}
                            placeholder="HH:MM:SS"
                          />
                        </div>
                        <div className={insetWrapperClass}>
                          <label className={insetLabelClass}>Deduct Min *</label>
                          <input
                            type="number"
                            value={oiDeductMin}
                            onChange={(e) => setOiDeductMin(Number(e.target.value))}
                            className={insetInputClass}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-border/50 flex items-center justify-between gap-3 bg-transparent px-6 py-4">
                <button
                  type="button"
                  onClick={() => setIsOtInfoOpen(false)}
                  className="h-10 px-6 rounded-lg bg-[#f39c12] hover:bg-[#e67e22] text-white font-black text-xs transition-all uppercase tracking-wider shadow-sm hover:shadow"
                >
                  CLOSE
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const isNew = !otInfoItem.sl || otInfoItem.sl === 0;
                      const sl = isNew
                        ? otConfigs.length > 0
                          ? Math.max(...otConfigs.map((o) => o.sl)) + 1
                          : 1
                        : otInfoItem.sl;

                      const updatedItem: OtConfig = {
                        sl,
                        employeeType: oiEmployeeType,
                        department: oiDepartment,
                        section: oiSection,
                        designation: oiDesignation,
                        unit: oiUnit,
                        otCalculationType: oiOtType,
                        bufferMinutes: 15,
                        isActive: oiIsActive,
                        startDate: oiStartDate,
                        endDate: oiEndDate,
                        shift: oiShift,
                        startTime: oiStartTime,
                        endTime: oiEndTime,
                        shiftStartTime: oiShiftStartTime,
                        otStartTime: oiOtStartTime,
                        otToleranceUpTo: oiOtToleranceUpTo,
                        time2Min: oiTime2Min,
                        time2MaxOt: oiTime2MaxOt,
                        time3Min: oiTime3Min,
                        time3MaxOt: oiTime3MaxOt,
                        time4Min: oiTime4Min,
                        time4MaxOt: oiTime4MaxOt,
                        otAfterWH: oiOtAfterWH,
                        generalDeductHour: oiGeneralDeductHour,
                        holidayDeductHour: oiHolidayDeductHour,
                        deductAfter: oiDeductAfter,
                        otRound: oiOtRound,
                        roundSlots: oiRoundSlots,
                        minOt: oiMinOt,
                        maxOt: oiMaxOt,
                        prayerBreak: oiPrayerBreak,
                        dinnerBreak: oiDinnerBreak,
                        deductionFor: oiDeductionFor,
                        timeFrom: oiTimeFrom,
                        timeTo: oiTimeTo,
                        deductMin: oiDeductMin,
                        otStartFromShift: oiOtStartFromShift,
                      };

                      let nextList = [...otConfigs];
                      if (isNew) {
                        nextList.push(updatedItem);
                      } else {
                        nextList = otConfigs.map((o) => (o.sl === sl ? updatedItem : o));
                      }
                      setOtConfigs(nextList);
                      localStorage.setItem("hris_ot_config", JSON.stringify(nextList));
                      toast.success(
                        isNew
                          ? "OT Configuration created successfully!"
                          : "OT Configuration updated successfully!",
                      );
                      setIsOtInfoOpen(false);
                    }}
                    className="h-10 px-8 rounded-lg bg-[#27ae60] hover:bg-[#219a52] text-white font-black text-xs shadow-md hover:shadow-lg transition-all uppercase tracking-wider"
                  >
                    {!otInfoItem.sl || otInfoItem.sl === 0 ? "CREATE" : "UPDATE"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
