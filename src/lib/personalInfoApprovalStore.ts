// Store and utility for Personal Information Change Requests and HR Approval Workflow

export interface FieldChange {
  field: string;
  fieldLabel: string;
  oldValue: string;
  newValue: string;
}

export interface PersonalInfoApprovalRequest {
  id: string;
  empId: string;
  empName: string;
  department: string;
  designation: string;
  avatar?: string;
  requestDate: string;
  requestTime: string;
  requestedBy: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  changes: FieldChange[];
  actionDate?: string;
  actionBy?: string;
  actionRemarks?: string;
  rejectionReason?: string;
}

const STORAGE_KEY = "personal_info_approval_requests";
const EMPLOYEES_STORAGE_KEY = "recruitment_synced_employees";

// Initial seed requests demonstrating realistic personal info changes
const initialSeedRequests: PersonalInfoApprovalRequest[] = [
  {
    id: "PIA-20261001",
    empId: "2023043910",
    empName: "Tahmid Afsar Shapno",
    department: "Business Innovation",
    designation: "Asst. Manager",
    requestDate: "18/10/2026",
    requestTime: "02:45 PM",
    requestedBy: "Tahmid Afsar Shapno (Self / HR Ops)",
    reason: "Updated personal contact number and updated residential village address after house relocation.",
    status: "Pending",
    changes: [
      {
        field: "officeMob",
        fieldLabel: "Office Mobile",
        oldValue: "01750021154",
        newValue: "01711998822",
      },
      {
        field: "village",
        fieldLabel: "Present Address / Village",
        oldValue: "Bhola",
        newValue: "Plot #14, Sector 7, Uttara, Dhaka",
      },
      {
        field: "personalContact",
        fieldLabel: "Personal Contact",
        oldValue: "—",
        newValue: "01912345678",
      },
    ],
  },
  {
    id: "PIA-20261002",
    empId: "2023046001",
    empName: "Sohanur Rahman Sohan",
    department: "HR, Admin and Compliance",
    designation: "Executive",
    requestDate: "17/10/2026",
    requestTime: "11:20 AM",
    requestedBy: "Sohanur Rahman Sohan",
    reason: "Correction of Blood Group based on recent medical diagnostic report and addition of emergency contact.",
    status: "Pending",
    changes: [
      {
        field: "blood",
        fieldLabel: "Blood Group",
        oldValue: "A (+ve)",
        newValue: "O (+ve)",
      },
      {
        field: "phone",
        fieldLabel: "Emergency Phone",
        oldValue: "6615",
        newValue: "01811223344",
      },
    ],
  },
  {
    id: "PIA-20260989",
    empId: "2026059411",
    empName: "Jannatul Maowa",
    department: "HR, Admin and Compliance",
    designation: "Jr. Executive",
    requestDate: "12/10/2026",
    requestTime: "04:15 PM",
    requestedBy: "Head of HR Admin",
    reason: "Confirmation salary adjustment and designation promotion after successful completion of probation.",
    status: "Approved",
    actionDate: "13/10/2026 10:00 AM",
    actionBy: "Head of HR",
    actionRemarks: "Approved based on department head recommendation letter.",
    changes: [
      {
        field: "title",
        fieldLabel: "Designation / Title",
        oldValue: "Jr. Executive",
        newValue: "Executive",
      },
      {
        field: "basic",
        fieldLabel: "Basic Salary",
        oldValue: "12000.00",
        newValue: "15000.00",
      },
      {
        field: "gross",
        fieldLabel: "Gross Salary",
        oldValue: "20000.00",
        newValue: "25000.00",
      },
      {
        field: "empStatus",
        fieldLabel: "Employment Status",
        oldValue: "Probation",
        newValue: "Permanent",
      },
    ],
  },
];

export function getPersonalInfoApprovalRequests(): PersonalInfoApprovalRequest[] {
  if (typeof window === "undefined") return initialSeedRequests;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSeedRequests));
      return initialSeedRequests;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return initialSeedRequests;
  } catch (err) {
    console.error("Failed to load personal info approval requests:", err);
    return initialSeedRequests;
  }
}

export function savePersonalInfoApprovalRequests(requests: PersonalInfoApprovalRequest[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    window.dispatchEvent(new CustomEvent("personal_info_approvals_changed"));
  } catch (err) {
    console.error("Failed to save personal info approval requests:", err);
  }
}

export function createPersonalInfoApprovalRequest(
  data: Omit<PersonalInfoApprovalRequest, "id" | "requestDate" | "requestTime" | "status"> & {
    id?: string;
  }
): PersonalInfoApprovalRequest {
  const all = getPersonalInfoApprovalRequests();
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB"); // DD/MM/YYYY
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const newRequest: PersonalInfoApprovalRequest = {
    id: data.id || `PIA-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(Math.floor(1000 + Math.random() * 9000))}`,
    empId: data.empId,
    empName: data.empName,
    department: data.department,
    designation: data.designation,
    avatar: data.avatar,
    requestDate: dateStr,
    requestTime: timeStr,
    requestedBy: data.requestedBy || "Current User (HR Dept)",
    reason: data.reason || "Profile details revision submitted from Personnel List",
    status: "Pending",
    changes: data.changes,
  };

  const updated = [newRequest, ...all];
  savePersonalInfoApprovalRequests(updated);
  return newRequest;
}

export function approvePersonalInfoRequest(
  requestId: string,
  approverName: string = "Head of HR",
  remarks?: string
): { success: boolean; message: string; updatedEmployee?: any } {
  const requests = getPersonalInfoApprovalRequests();
  const idx = requests.findIndex((r) => r.id === requestId);
  if (idx === -1) {
    return { success: false, message: "Approval request not found." };
  }

  const req = requests[idx];
  if (req.status === "Approved") {
    return { success: false, message: "Request has already been approved." };
  }

  const now = new Date();
  const actionDateStr = `${now.toLocaleDateString("en-GB")} ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

  // 1. Mark request as approved
  requests[idx] = {
    ...req,
    status: "Approved",
    actionDate: actionDateStr,
    actionBy: approverName,
    actionRemarks: remarks || "Approved and applied to personnel master record.",
  };
  savePersonalInfoApprovalRequests(requests);

  // 2. Apply changes directly into recruitment_synced_employees in localStorage!
  let updatedEmployee: any = null;
  if (typeof window !== "undefined") {
    try {
      const rawEmps = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
      if (rawEmps) {
        const emps = JSON.parse(rawEmps);
        if (Array.isArray(emps)) {
          const empIdx = emps.findIndex((e: any) => e.id === req.empId);
          if (empIdx !== -1) {
            const currentEmp = { ...emps[empIdx] };
            // Apply all changed fields
            req.changes.forEach((ch) => {
              currentEmp[ch.field] = ch.newValue;
            });
            emps[empIdx] = currentEmp;
            updatedEmployee = currentEmp;
            localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(emps));
            // Dispatch event to notify personal-list and other listening components
            window.dispatchEvent(new CustomEvent("employee_info_updated", { detail: { empId: req.empId } }));
          }
        }
      }
    } catch (e) {
      console.error("Error applying approved changes to employee storage:", e);
    }
  }

  return {
    success: true,
    message: `Changes for ${req.empName} have been approved and updated in the Personnel List.`,
    updatedEmployee,
  };
}

export function rejectPersonalInfoRequest(
  requestId: string,
  rejectorName: string = "Head of HR",
  rejectionReason: string = "Declined by approver"
): { success: boolean; message: string } {
  const requests = getPersonalInfoApprovalRequests();
  const idx = requests.findIndex((r) => r.id === requestId);
  if (idx === -1) {
    return { success: false, message: "Approval request not found." };
  }

  const req = requests[idx];
  const now = new Date();
  const actionDateStr = `${now.toLocaleDateString("en-GB")} ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

  requests[idx] = {
    ...req,
    status: "Rejected",
    actionDate: actionDateStr,
    actionBy: rejectorName,
    rejectionReason: rejectionReason,
  };
  savePersonalInfoApprovalRequests(requests);

  return {
    success: true,
    message: `Request for ${req.empName} has been rejected. No changes were applied to Personnel List.`,
  };
}
