// Store and workflow manager for Lunce Requisition & Lunce Requisition Approval

export interface LunchRequisitionEmployeeItem {
  id: string;
  sl: number;
  empId: string;
  name: string;
  employeeType: string;
  department: string;
  designation: string;
  unit: string;
  line: string;
  inDate: string;
  inTime: string;
  outDate: string;
  outTime: string;
  ot: number;
  status: string;
}

export interface LunchRequisitionBatch {
  id: string; // e.g. "LR-20261019-001"
  requisitionDate: string; // "19/10/2026"
  submittedDate: string; // "19/10/2026 09:30 AM"
  submittedBy: string; // "Md. Babul Mia"
  department: string; // "Accounts & Finance"
  employeeCount: number;
  totalOt: number;
  status: "Pending" | "Approved" | "Rejected";
  remarks?: string;
  actionDate?: string;
  actionBy?: string;
  actionRemarks?: string;
  items: LunchRequisitionEmployeeItem[];
}

const STORAGE_KEY = "hris_lunch_requisition_batches_v1";

const INITIAL_BATCHES: LunchRequisitionBatch[] = [
  {
    id: "LR-20261019-001",
    requisitionDate: "19/10/2026",
    submittedDate: "19/10/2026 09:15 AM",
    submittedBy: "Md. Babul Mia (Deputy Manager)",
    department: "Accounts & Finance",
    employeeCount: 9,
    totalOt: 0.0,
    status: "Pending",
    remarks: "Overtime & Festival duty lunch requisition for Accounts closing team.",
    items: [
      {
        id: "lre-1",
        sl: 1,
        empId: "2016001065",
        name: "Md. Babul Mia",
        employeeType: "Office Executive",
        department: "Accounts & Finance",
        designation: "Deputy Manager",
        unit: "N/A",
        line: "N/A",
        inDate: "19/10/2026",
        inTime: "08:55:35",
        outDate: "19/10/2026",
        outTime: "",
        ot: 0.0,
        status: "Present",
      },
      {
        id: "lre-2",
        sl: 2,
        empId: "2017007795",
        name: "Md. Abdullah Al- Mamun",
        employeeType: "Office Executive",
        department: "Accounts & Finance",
        designation: "Deputy Manager",
        unit: "N/A",
        line: "N/A",
        inDate: "19/10/2026",
        inTime: "08:56:05",
        outDate: "19/10/2026",
        outTime: "",
        ot: 0.0,
        status: "Present",
      },
      {
        id: "lre-3",
        sl: 3,
        empId: "2017008164",
        name: "Hasan Ahammad",
        employeeType: "Office Executive",
        department: "Accounts & Finance",
        designation: "Deputy Manager",
        unit: "N/A",
        line: "N/A",
        inDate: "19/10/2026",
        inTime: "08:55:34",
        outDate: "19/10/2026",
        outTime: "",
        ot: 0.0,
        status: "Present",
      },
      {
        id: "lre-4",
        sl: 4,
        empId: "2018011220",
        name: "Md. Samiul Alam",
        employeeType: "Office Staff",
        department: "Accounts & Finance",
        designation: "Messenger",
        unit: "N/A",
        line: "N/A",
        inDate: "19/10/2026",
        inTime: "09:03:34",
        outDate: "19/10/2026",
        outTime: "",
        ot: 0.0,
        status: "Present",
      },
      {
        id: "lre-5",
        sl: 5,
        empId: "2019014166",
        name: "Shahriar Mustafiz",
        employeeType: "Office Executive",
        department: "Accounts & Finance",
        designation: "Sr. Officer",
        unit: "N/A",
        line: "N/A",
        inDate: "19/10/2026",
        inTime: "08:56:22",
        outDate: "19/10/2026",
        outTime: "",
        ot: 0.0,
        status: "Present",
      },
      {
        id: "lre-6",
        sl: 6,
        empId: "2020018602",
        name: "Md. Anowar Hossain",
        employeeType: "Office Staff",
        department: "Accounts & Finance",
        designation: "Office Asst",
        unit: "N/A",
        line: "N/A",
        inDate: "19/10/2026",
        inTime: "09:01:20",
        outDate: "19/10/2026",
        outTime: "",
        ot: 0.0,
        status: "Present",
      },
      {
        id: "lre-7",
        sl: 7,
        empId: "2021031739",
        name: "Bilas Roy",
        employeeType: "Office Executive",
        department: "Accounts & Finance",
        designation: "Officer",
        unit: "N/A",
        line: "N/A",
        inDate: "19/10/2026",
        inTime: "08:59:14",
        outDate: "19/10/2026",
        outTime: "",
        ot: 0.0,
        status: "Present",
      },
      {
        id: "lre-8",
        sl: 8,
        empId: "2022034743",
        name: "Md.Amir Hossain",
        employeeType: "Office Executive",
        department: "Accounts & Finance",
        designation: "Officer",
        unit: "N/A",
        line: "N/A",
        inDate: "19/10/2026",
        inTime: "08:56:26",
        outDate: "19/10/2026",
        outTime: "",
        ot: 0.0,
        status: "Present",
      },
      {
        id: "lre-9",
        sl: 9,
        empId: "2025057429",
        name: "Md. Rubel Hossain",
        employeeType: "Office Executive",
        department: "Accounts & Finance",
        designation: "Asst. Officer",
        unit: "Unit-01",
        line: "N/A",
        inDate: "19/10/2026",
        inTime: "07:49:17",
        outDate: "19/10/2026",
        outTime: "",
        ot: 0.0,
        status: "Present",
      },
    ],
  },
  {
    id: "LR-20261018-002",
    requisitionDate: "18/10/2026",
    submittedDate: "18/10/2026 10:45 AM",
    submittedBy: "Engr. Zahirul Islam",
    department: "Maintenance",
    employeeCount: 14,
    totalOt: 28.0,
    status: "Pending",
    remarks: "Weekend maintenance and boiler inspection duty lunch.",
    items: [
      {
        id: "lre-101",
        sl: 1,
        empId: "2019034112",
        name: "Md. Kamal Hossain",
        employeeType: "Worker",
        department: "Maintenance",
        designation: "Maintenance Electrician",
        unit: "Unit-01",
        line: "N/A",
        inDate: "18/10/2026",
        inTime: "08:00:15",
        outDate: "18/10/2026",
        outTime: "17:30:00",
        ot: 2.0,
        status: "Present",
      },
      {
        id: "lre-102",
        sl: 2,
        empId: "2020045118",
        name: "Sajjad Hossain",
        employeeType: "Worker",
        department: "Maintenance",
        designation: "Boiler Operator",
        unit: "Unit-02",
        line: "N/A",
        inDate: "18/10/2026",
        inTime: "07:45:00",
        outDate: "18/10/2026",
        outTime: "17:00:00",
        ot: 2.0,
        status: "Present",
      },
    ],
  },
  {
    id: "LR-20261017-003",
    requisitionDate: "17/10/2026",
    submittedDate: "17/10/2026 08:30 AM",
    submittedBy: "Sohanur Rahman Sohan",
    department: "HR, Admin & Comp.",
    employeeCount: 6,
    totalOt: 12.0,
    status: "Approved",
    remarks: "Auditing preparation duty lunch for Compliance team.",
    actionDate: "17/10/2026 01:15 PM",
    actionBy: "Head of HR & Admin",
    actionRemarks: "Approved as per festival allowance and duty roster policy.",
    items: [],
  },
];

export function getLunchRequisitionBatches(): LunchRequisitionBatch[] {
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
    console.error("Error reading lunch requisition batches:", err);
    return INITIAL_BATCHES;
  }
}

export function saveLunchRequisitionBatches(batches: LunchRequisitionBatch[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(batches));
    window.dispatchEvent(new Event("lunch_requisitions_changed"));
  } catch (err) {
    console.error("Error saving lunch requisition batches:", err);
  }
}

export function submitLunchRequisitionBatch(
  data: Omit<LunchRequisitionBatch, "id" | "submittedDate" | "status">
): LunchRequisitionBatch {
  const current = getLunchRequisitionBatches();
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB"); // DD/MM/YYYY
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const ymd = now.toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = String(Math.floor(100 + Math.random() * 900));
  const newId = `LR-${ymd}-${randomSuffix}`;

  const newBatch: LunchRequisitionBatch = {
    ...data,
    id: newId,
    submittedDate: `${dateStr} ${timeStr}`,
    status: "Pending",
  };

  const updated = [newBatch, ...current];
  saveLunchRequisitionBatches(updated);
  return newBatch;
}

export function approveLunchRequisitionBatch(
  id: string,
  actionBy: string = "HR Approver",
  actionRemarks: string = "Approved"
): boolean {
  const current = getLunchRequisitionBatches();
  const target = current.find((b) => b.id === id);
  if (!target) return false;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB");
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  target.status = "Approved";
  target.actionDate = `${dateStr} ${timeStr}`;
  target.actionBy = actionBy;
  target.actionRemarks = actionRemarks;

  saveLunchRequisitionBatches([...current]);
  return true;
}

export function rejectLunchRequisitionBatch(
  id: string,
  actionBy: string = "HR Approver",
  reason: string = "Rejected"
): boolean {
  const current = getLunchRequisitionBatches();
  const target = current.find((b) => b.id === id);
  if (!target) return false;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB");
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  target.status = "Rejected";
  target.actionDate = `${dateStr} ${timeStr}`;
  target.actionBy = actionBy;
  target.actionRemarks = reason;

  saveLunchRequisitionBatches([...current]);
  return true;
}

export function getPendingLunchRequisitionsCount(): number {
  const batches = getLunchRequisitionBatches();
  return batches.filter((b) => b.status === "Pending").length;
}
