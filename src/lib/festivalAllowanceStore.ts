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

export interface FestivalPayCheckRow {
  id: string;
  sl: number;
  empId: string;
  name: string;
  type: string;
  department: string;
  section: string;
  designation: string;
  basic: number;
  gross: number;
  totalDay: number;
  perDayRate: number;
  payableAmt: number;
  otHour: number;
  rate: number;
  otAmount: number;
  lunchBill: number;
  netPay: number;
  bankName: string;
  unit: string;
  systemOffice: "System" | "Office";
  year: string;
  month: string;
  status: "Pending" | "Approved" | "Reject";
  batchId?: string;
}

const STORAGE_KEY = "hris_festival_allowance_batches_v1";
const CHECK_HR_STORAGE_KEY = "hris_festival_allowance_check_hr_records_v1";
const FA_RECORDS_KEY = "hris_festival_allowance_records_v1";

export const INITIAL_CHECK_RECORDS: FestivalPayCheckRow[] = [
  {
    id: "fpc-1",
    sl: 1,
    empId: "2025053380",
    name: "Miraz Uddin",
    type: "Office Executive",
    department: "Business Development",
    section: "Core Sales",
    designation: "Jr. Executive",
    basic: 14400.0,
    gross: 24000.0,
    totalDay: 1,
    perDayRate: 2000.0,
    payableAmt: 2000.0,
    otHour: 0.0,
    rate: 0.0,
    otAmount: 0.0,
    lunchBill: 0.0,
    netPay: 2000.0,
    bankName: "Dutch-Bangla Bank Ltd.",
    unit: "Unit-01",
    systemOffice: "Office",
    year: "2026",
    month: "Oct",
    status: "Pending",
  },
  {
    id: "fpc-2",
    sl: 2,
    empId: "2025054315",
    name: "Md. Shahinur Alahi Khan",
    type: "Office Executive",
    department: "Business Development",
    section: "Core Sales",
    designation: "Asst. Manager",
    basic: 31800.0,
    gross: 53000.0,
    totalDay: 1,
    perDayRate: 3000.0,
    payableAmt: 3000.0,
    otHour: 0.0,
    rate: 0.0,
    otAmount: 0.0,
    lunchBill: 0.0,
    netPay: 3000.0,
    bankName: "Dutch-Bangla Bank Ltd.",
    unit: "Unit-01",
    systemOffice: "Office",
    year: "2026",
    month: "Oct",
    status: "Pending",
  },
  {
    id: "fpc-3",
    sl: 3,
    empId: "2026058686",
    name: "Md. Abdur Rahaman",
    type: "Office Executive",
    department: "Business Innovation",
    section: "Business Innovation",
    designation: "Executive",
    basic: 30000.0,
    gross: 50000.0,
    totalDay: 1,
    perDayRate: 2500.0,
    payableAmt: 2500.0,
    otHour: 0.0,
    rate: 0.0,
    otAmount: 0.0,
    lunchBill: 0.0,
    netPay: 2500.0,
    bankName: "Rocket-Dutch-Bangla Bank Ltd.",
    unit: "Unit-02",
    systemOffice: "System",
    year: "2026",
    month: "Oct",
    status: "Pending",
  },
  {
    id: "fpc-4",
    sl: 4,
    empId: "2025054707",
    name: "Allama Bakhtiyar Nafis",
    type: "Office Executive",
    department: "Business Innovation",
    section: "WEB-Team",
    designation: "Jr. Executive",
    basic: 15000.0,
    gross: 25000.0,
    totalDay: 1,
    perDayRate: 2000.0,
    payableAmt: 2000.0,
    otHour: 0.0,
    rate: 0.0,
    otAmount: 0.0,
    lunchBill: 0.0,
    netPay: 2000.0,
    bankName: "Dutch-Bangla Bank Ltd.",
    unit: "Unit-02",
    systemOffice: "Office",
    year: "2026",
    month: "Oct",
    status: "Pending",
  },
  {
    id: "fpc-5",
    sl: 5,
    empId: "2023045146",
    name: "Asif Hossain",
    type: "Worker",
    department: "HR, Admin and Compliance",
    section: "Admin",
    designation: "Driver",
    basic: 12500.0,
    gross: 21200.0,
    totalDay: 1,
    perDayRate: 1250.0,
    payableAmt: 1250.0,
    otHour: 0.0,
    rate: 0.0,
    otAmount: 0.0,
    lunchBill: 0.0,
    netPay: 1250.0,
    bankName: "Rocket-Dutch-Bangla Bank Ltd.",
    unit: "Unit-01",
    systemOffice: "Office",
    year: "2026",
    month: "Oct",
    status: "Approved",
  },
  {
    id: "fpc-6",
    sl: 6,
    empId: "2023046544",
    name: "Mazharul Haque",
    type: "Office Executive",
    department: "Implementation & Business Analysis",
    section: "ERP Team",
    designation: "Deputy Manager",
    basic: 40800.0,
    gross: 68000.0,
    totalDay: 1,
    perDayRate: 3000.0,
    payableAmt: 3000.0,
    otHour: 0.0,
    rate: 0.0,
    otAmount: 0.0,
    lunchBill: 0.0,
    netPay: 3000.0,
    bankName: "Dutch-Bangla Bank Ltd.",
    unit: "Unit-03",
    systemOffice: "System",
    year: "2026",
    month: "Oct",
    status: "Pending",
  },
];

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

  // Synchronize submitted items into the HR Check pool
  try {
    const existingCheckRecords = getFestivalAllowanceCheckRecords();
    const newCheckItems: FestivalPayCheckRow[] = data.items.map((it, idx) => ({
      id: it.id || `fpc-sub-${Date.now()}-${idx}`,
      sl: existingCheckRecords.length + idx + 1,
      empId: it.empId,
      name: it.name,
      type: it.type,
      department: it.department,
      section: it.section,
      designation: it.designation,
      basic: it.basic,
      gross: it.gross,
      totalDay: it.totalDay,
      perDayRate: it.perDayRate,
      payableAmt: it.payableAmt,
      otHour: it.otHour,
      rate: it.rate,
      otAmount: it.otAmount,
      lunchBill: it.lunchBill,
      netPay: it.netPay,
      bankName: "Dutch-Bangla Bank Ltd.",
      unit: "Unit-01",
      systemOffice: "Office" as const,
      year: data.year || "2026",
      month: data.month || "Aug",
      status: "Pending" as const,
      batchId: newId,
    }));
    saveFestivalAllowanceCheckRecords([...newCheckItems, ...existingCheckRecords]);
  } catch (err) {
    console.error("Failed to sync submitted items to HR Check:", err);
  }

  return newBatch;
}

export function getFestivalAllowanceCheckRecords(): FestivalPayCheckRow[] {
  if (typeof window === "undefined") {
    return INITIAL_CHECK_RECORDS;
  }
  try {
    const raw = localStorage.getItem(CHECK_HR_STORAGE_KEY);
    if (!raw) {
      // Seed with initial check records plus sample batch items from August 2026
      const augItems: FestivalPayCheckRow[] = INITIAL_BATCHES[0].items.map((it, idx) => ({
        id: it.id,
        sl: INITIAL_CHECK_RECORDS.length + idx + 1,
        empId: it.empId,
        name: it.name,
        type: it.type,
        department: it.department,
        section: it.section,
        designation: it.designation,
        basic: it.basic,
        gross: it.gross,
        totalDay: it.totalDay,
        perDayRate: it.perDayRate,
        payableAmt: it.payableAmt,
        otHour: it.otHour,
        rate: it.rate,
        otAmount: it.otAmount,
        lunchBill: it.lunchBill,
        netPay: it.netPay,
        bankName: "Dutch-Bangla Bank Ltd.",
        unit: "Unit-01",
        systemOffice: "Office" as const,
        year: "2026",
        month: "Aug",
        status: "Pending" as const,
        batchId: INITIAL_BATCHES[0].id,
      }));
      const combined = [...INITIAL_CHECK_RECORDS, ...augItems];
      localStorage.setItem(CHECK_HR_STORAGE_KEY, JSON.stringify(combined));
      return combined;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_CHECK_RECORDS;
  } catch (err) {
    console.error("Error reading festival check records:", err);
    return INITIAL_CHECK_RECORDS;
  }
}

export function saveFestivalAllowanceCheckRecords(records: FestivalPayCheckRow[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CHECK_HR_STORAGE_KEY, JSON.stringify(records));
    window.dispatchEvent(new Event("festival_allowances_changed"));
  } catch (err) {
    console.error("Error saving festival check records:", err);
  }
}

export function updateFestivalCheckRecordStatus(
  id: string,
  newStatus: "Approved" | "Reject"
): boolean {
  const records = getFestivalAllowanceCheckRecords();
  const target = records.find((r) => r.id === id);
  if (!target) return false;

  target.status = newStatus;
  saveFestivalAllowanceCheckRecords(records);

  // Sync back to local table records if matching empId
  if (typeof window !== "undefined") {
    try {
      const rawFa = localStorage.getItem(FA_RECORDS_KEY);
      if (rawFa) {
        const faList = JSON.parse(rawFa);
        if (Array.isArray(faList)) {
          const updatedFa = faList.map((item: any) =>
            item.empId === target.empId || item.id === target.id
              ? { ...item, status: newStatus === "Approved" ? "Approved" : "Saved" }
              : item
          );
          localStorage.setItem(FA_RECORDS_KEY, JSON.stringify(updatedFa));
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  return true;
}

export function bulkUpdateFestivalCheckRecordStatus(
  ids: string[],
  newStatus: "Approved" | "Reject"
): number {
  const records = getFestivalAllowanceCheckRecords();
  const idSet = new Set(ids);
  let updatedCount = 0;

  const targetEmpIds = new Set<string>();
  records.forEach((r) => {
    if (idSet.has(r.id)) {
      r.status = newStatus;
      targetEmpIds.add(r.empId);
      updatedCount++;
    }
  });

  saveFestivalAllowanceCheckRecords(records);

  // Sync back to local table store
  if (typeof window !== "undefined") {
    try {
      const rawFa = localStorage.getItem(FA_RECORDS_KEY);
      if (rawFa) {
        const faList = JSON.parse(rawFa);
        if (Array.isArray(faList)) {
          const updatedFa = faList.map((item: any) =>
            idSet.has(item.id) || targetEmpIds.has(item.empId)
              ? { ...item, status: newStatus === "Approved" ? "Approved" : "Saved" }
              : item
          );
          localStorage.setItem(FA_RECORDS_KEY, JSON.stringify(updatedFa));
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  return updatedCount;
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
