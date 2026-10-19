// Store and workflow manager for Festival Allowance & Festival Allowance Approval

export interface FestivalAllowanceEmployeeItem {
  id: string;
  sl: number;
  empId: string;
  name: string;
  type: string;
  department: string;
  section: string;
  designation: string;
  gross: number;
  basic: number;
  totalDay: number;
  perDayRate: number;
  payableAmt: number;
  otHour: number;
  rate: number;
  otAmount: number;
  lunchBill: number;
  netPay: number;
  status: string;
}

export interface FestivalAllowanceBatch {
  id: string; // e.g. "FA-202608-001"
  basedOn: string; // "Month Wise"
  year: string; // "2026"
  month: string; // "Aug"
  processFor: string; // "Festival Holiday"
  submittedDate: string; // "19/10/2026 11:20 AM"
  submittedBy: string; // "Abdul Motaleb (Sr. Manager)"
  department: string; // "Admin & Compliance"
  employeeCount: number;
  totalPayable: number;
  status: "Pending" | "Approved" | "Rejected";
  remarks?: string;
  actionDate?: string;
  actionBy?: string;
  actionRemarks?: string;
  items: FestivalAllowanceEmployeeItem[];
}

const STORAGE_KEY = "hris_festival_allowance_batches_v1";

const INITIAL_BATCHES: FestivalAllowanceBatch[] = [
  {
    id: "FA-202608-001",
    basedOn: "Month Wise",
    year: "2026",
    month: "Aug",
    processFor: "Festival Holiday",
    submittedDate: "19/10/2026 10:15 AM",
    submittedBy: "Abdul Motaleb (Sr. Manager)",
    department: "Admin and Compliance",
    employeeCount: 9,
    totalPayable: 19563,
    status: "Pending",
    remarks: "Festival holiday duty allowance for August 2026 festival roster.",
    items: [
      {
        id: "fae-1",
        sl: 1,
        empId: "2023046676",
        name: "Abdul Motaleb",
        type: "Office Executive",
        department: "Admin",
        section: "Admin",
        designation: "Sr. Manager",
        gross: 77500,
        basic: 46500,
        totalDay: 1,
        perDayRate: 3500,
        payableAmt: 3500,
        otHour: 0.0,
        rate: 0,
        otAmount: 0,
        lunchBill: 0,
        netPay: 3500,
        status: "Saved",
      },
      {
        id: "fae-2",
        sl: 2,
        empId: "2017009679",
        name: "Md. Ehsan Uddin",
        type: "Office Executive",
        department: "Civil Engineering",
        section: "Civil Engineering",
        designation: "Deputy Manager",
        gross: 68600,
        basic: 41160,
        totalDay: 1,
        perDayRate: 3000,
        payableAmt: 3000,
        otHour: 0.0,
        rate: 0,
        otAmount: 0,
        lunchBill: 0,
        netPay: 3000,
        status: "Saved",
      },
      {
        id: "fae-3",
        sl: 3,
        empId: "2024051919",
        name: "Md. Jasim Uddin",
        type: "Office Executive",
        department: "Internal Audit",
        section: "Internal Audit",
        designation: "Asst. Officer",
        gross: 23800,
        basic: 14280,
        totalDay: 1,
        perDayRate: 2000,
        payableAmt: 2000,
        otHour: 0.0,
        rate: 0,
        otAmount: 0,
        lunchBill: 0,
        netPay: 2000,
        status: "Saved",
      },
      {
        id: "fae-4",
        sl: 4,
        empId: "2024047891",
        name: "Md. Biplob Hossain",
        type: "Worker",
        department: "Admin and Compliance",
        section: "Office Admin",
        designation: "Driver",
        gross: 24700,
        basic: 14833,
        totalDay: 1,
        perDayRate: 1483,
        payableAmt: 1483,
        otHour: 0.0,
        rate: 0,
        otAmount: 0,
        lunchBill: 0,
        netPay: 1483,
        status: "Saved",
      },
      {
        id: "fae-5",
        sl: 5,
        empId: "2022037540",
        name: "Md. Altaf Hossen",
        type: "Worker",
        department: "Admin and Compliance",
        section: "Office Admin",
        designation: "Driver",
        gross: 22400,
        basic: 13300,
        totalDay: 1,
        perDayRate: 1330,
        payableAmt: 1330,
        otHour: 0.0,
        rate: 0,
        otAmount: 0,
        lunchBill: 0,
        netPay: 1330,
        status: "Saved",
      },
      {
        id: "fae-6",
        sl: 6,
        empId: "2023046608",
        name: "Md. Ruhul Amin",
        type: "Office Executive",
        department: "Internal Audit",
        section: "Internal Audit",
        designation: "Asst. Officer",
        gross: 28300,
        basic: 16980,
        totalDay: 1,
        perDayRate: 2000,
        payableAmt: 2000,
        otHour: 0.0,
        rate: 0,
        otAmount: 0,
        lunchBill: 0,
        netPay: 2000,
        status: "Saved",
      },
      {
        id: "fae-7",
        sl: 7,
        empId: "2023046846",
        name: "Md. Mahmudul Hassan",
        type: "Office Executive",
        department: "Internal Audit",
        section: "Internal Audit",
        designation: "Asst. Officer",
        gross: 30300,
        basic: 18180,
        totalDay: 1,
        perDayRate: 2000,
        payableAmt: 2000,
        otHour: 0.0,
        rate: 0,
        otAmount: 0,
        lunchBill: 0,
        netPay: 2000,
        status: "Saved",
      },
      {
        id: "fae-8",
        sl: 8,
        empId: "2023046582",
        name: "Ali Mohammad",
        type: "Office Executive",
        department: "Internal Audit",
        section: "Internal Audit",
        designation: "Asst. Officer",
        gross: 27300,
        basic: 16380,
        totalDay: 1,
        perDayRate: 2000,
        payableAmt: 2000,
        otHour: 0.0,
        rate: 0,
        otAmount: 0,
        lunchBill: 0,
        netPay: 2000,
        status: "Saved",
      },
      {
        id: "fae-9",
        sl: 9,
        empId: "2024048662",
        name: "Kawsar Islam",
        type: "Worker",
        department: "Admin and Compliance",
        section: "Office Admin",
        designation: "Driver",
        gross: 21200,
        basic: 12500,
        totalDay: 1,
        perDayRate: 1250,
        payableAmt: 1250,
        otHour: 0.0,
        rate: 0,
        otAmount: 0,
        lunchBill: 0,
        netPay: 1250,
        status: "Saved",
      },
    ],
  },
  {
    id: "FA-202607-002",
    basedOn: "Month Wise",
    year: "2026",
    month: "Jul",
    processFor: "Special Duty",
    submittedDate: "15/07/2026 03:45 PM",
    submittedBy: "Engr. Zahirul Islam",
    department: "Maintenance",
    employeeCount: 5,
    totalPayable: 11500,
    status: "Approved",
    remarks: "Maintenance boiler & generator inspection during holiday closure.",
    actionDate: "16/07/2026 11:30 AM",
    actionBy: "Head of HR",
    actionRemarks: "Approved as per duty roster and management approval.",
    items: [],
  },
];

export function getFestivalAllowanceBatches(): FestivalAllowanceBatch[] {
  if (typeof window === "undefined") {
    return INITIAL_BATCHES;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BATCHES));
      return INITIAL_BATCHES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_BATCHES;
  } catch (err) {
    console.error("Error reading festival allowance batches:", err);
    return INITIAL_BATCHES;
  }
}

export function saveFestivalAllowanceBatches(batches: FestivalAllowanceBatch[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(batches));
    window.dispatchEvent(new Event("festival_allowances_changed"));
  } catch (err) {
    console.error("Error saving festival allowance batches:", err);
  }
}

export function submitFestivalAllowanceBatch(
  data: Omit<FestivalAllowanceBatch, "id" | "submittedDate" | "status">
): FestivalAllowanceBatch {
  const current = getFestivalAllowanceBatches();
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB");
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const ymd = now.toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = String(Math.floor(100 + Math.random() * 900));
  const newId = `FA-${ymd}-${randomSuffix}`;

  const newBatch: FestivalAllowanceBatch = {
    ...data,
    id: newId,
    submittedDate: `${dateStr} ${timeStr}`,
    status: "Pending",
  };

  const updated = [newBatch, ...current];
  saveFestivalAllowanceBatches(updated);
  return newBatch;
}

export function approveFestivalAllowanceBatch(
  id: string,
  actionBy: string = "HR Approver",
  actionRemarks: string = "Approved"
): boolean {
  const current = getFestivalAllowanceBatches();
  const target = current.find((b) => b.id === id);
  if (!target) return false;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB");
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  target.status = "Approved";
  target.actionDate = `${dateStr} ${timeStr}`;
  target.actionBy = actionBy;
  target.actionRemarks = actionRemarks;

  saveFestivalAllowanceBatches([...current]);
  return true;
}

export function rejectFestivalAllowanceBatch(
  id: string,
  actionBy: string = "HR Approver",
  reason: string = "Rejected"
): boolean {
  const current = getFestivalAllowanceBatches();
  const target = current.find((b) => b.id === id);
  if (!target) return false;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB");
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  target.status = "Rejected";
  target.actionDate = `${dateStr} ${timeStr}`;
  target.actionBy = actionBy;
  target.actionRemarks = reason;

  saveFestivalAllowanceBatches([...current]);
  return true;
}

export function getPendingFestivalAllowanceCount(): number {
  const batches = getFestivalAllowanceBatches();
  return batches.filter((b) => b.status === "Pending").length;
}
