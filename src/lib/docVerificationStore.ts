// Shared store and types for Employee Document Verification and Document Issues

export interface OCRFields {
  [key: string]: string;
}

export interface UploadedDocument {
  id: string;
  title: string;
  type: "PDF" | "IMAGE" | "DOCX";
  file: string;
  size: string;
  uploadedAt: string;
  status: "Pending" | "Verified" | "Flagged" | "Re-uploaded";
  issueDescription?: string;
  issueCategory?: string;
  flaggedAt?: string;
  flaggedBy?: string;
  reuploadNote?: string;
  reuploadedAt?: string;
  reuploadedFile?: string;
  reuploadedSize?: string;
  reuploadedType?: "PDF" | "IMAGE" | "DOCX";
  ocrFields: OCRFields;
}

export interface VerificationEmployee {
  id: string;
  name: string;
  title: string;
  dept: string;
  joinDate: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  blood: string;
  nid: string;
  fatherName: string;
  motherName: string;
  village: string;
  empStatus: string;
  workingStatus: string;
  company: string;
  area: string;
  documents: UploadedDocument[];
}

export interface HRDocIssueNotification {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeTitle: string;
  docId: string;
  docTitle: string;
  issueDescription: string;
  raisedAt: string; // ISO string
  read: boolean;
}

export const INITIAL_VERIFICATION_EMPLOYEES: VerificationEmployee[] = [
  {
    id: "2023043910",
    name: "Tahmid Afsar Shapno",
    title: "Asst. Manager",
    dept: "Business Innovation",
    joinDate: "01/08/2023",
    email: "tahmid.bd@pakizasoftware.com",
    phone: "01750021154",
    gender: "Male",
    dob: "12/07/1999",
    blood: "AB (+ve)",
    nid: "1999827394852",
    fatherName: "Md. Afsar Ali",
    motherName: "Hamida Begum",
    village: "Bhola",
    empStatus: "Permanent",
    workingStatus: "Working",
    company: "Pakiza Software Ltd.",
    area: "Head Office",
    documents: [
      {
        id: "doc-101",
        title: "National ID (NID) Card",
        type: "IMAGE",
        file: "nid_card_shapno.png",
        size: "1.4 MB",
        uploadedAt: "2026-08-10 09:15 AM",
        status: "Pending",
        ocrFields: {
          "Document No": "1999827394852",
          Name: "Tahmid Afsar Shapno",
          DOB: "12/07/1999",
          "Father Name": "Md. Afsar Ali",
        },
      },
      {
        id: "doc-102",
        title: "Academic Transcript (B.Sc in CSE)",
        type: "PDF",
        file: "bsc_transcript_shapno.pdf",
        size: "3.2 MB",
        uploadedAt: "2026-08-10 09:18 AM",
        status: "Verified",
        ocrFields: {
          Degree: "Bachelor of Science",
          Institute: "IIT University of Dhaka",
          "GPA / CGPA": "3.85",
          "Passing Year": "2022",
        },
      },
      {
        id: "doc-103",
        title: "Nominee ID Card",
        type: "IMAGE",
        file: "nominee_nid_shapno.png",
        size: "1.1 MB",
        uploadedAt: "2026-08-10 09:20 AM",
        status: "Pending",
        ocrFields: {
          "Document No": "1990123456789",
          Name: "Anisur Rahman",
          Relationship: "Father",
        },
      },
      {
        id: "doc-104",
        title: "Police Clearance Certificate",
        type: "PDF",
        file: "police_clearance_shapno.pdf",
        size: "2.1 MB",
        uploadedAt: "2026-08-12 02:30 PM",
        status: "Pending",
        ocrFields: {
          "Certificate No": "PC-2026-88123",
          "Issue Date": "05/08/2026",
          Result: "No Criminal Record",
        },
      },
    ],
  },
  {
    id: "20260481",
    name: "Fahim Faisal",
    title: "Software Engineer",
    dept: "Business Innovation",
    joinDate: "15/05/2026",
    email: "fahim@pakizasoftware.com",
    phone: "01827394852",
    gender: "Male",
    dob: "22/10/2001",
    blood: "O (+ve)",
    nid: "2001739284752",
    fatherName: "Md. Faisal Ahmed",
    motherName: "Rokeya Begum",
    village: "Dhaka",
    empStatus: "Probation",
    workingStatus: "Working",
    company: "Pakiza Knit Ltd.",
    area: "Factory — Floor A",
    documents: [
      {
        id: "doc-201",
        title: "National ID (NID) Card",
        type: "IMAGE",
        file: "nid_card_fahim.png",
        size: "1.5 MB",
        uploadedAt: "2026-08-11 10:00 AM",
        status: "Verified",
        ocrFields: {
          "Document No": "2001739284752",
          Name: "Fahim Faisal",
          DOB: "22/10/2001",
        },
      },
      {
        id: "doc-202",
        title: "Academic Transcript (B.Sc in CSE)",
        type: "PDF",
        file: "cse_transcript_fahim.pdf",
        size: "2.8 MB",
        uploadedAt: "2026-08-11 10:05 AM",
        status: "Flagged",
        issueDescription: "The bottom margin and seal of the controller of examinations are cropped. Please re-upload a clear, complete scan.",
        issueCategory: "Cropped or Incomplete Scan",
        flaggedAt: "2026-08-12 11:30 AM",
        flaggedBy: "HR Compliance Officer",
        ocrFields: {
          Degree: "B.Sc in CSE",
          Institute: "BUET",
          "GPA / CGPA": "3.67",
        },
      },
      {
        id: "doc-203",
        title: "Experience Release Letter",
        type: "PDF",
        file: "experience_release_fahim.pdf",
        size: "1.9 MB",
        uploadedAt: "2026-08-11 10:08 AM",
        status: "Pending",
        ocrFields: {
          Company: "Brain Station 23",
          Designation: "Junior Developer",
          Duration: "1 Year 6 Months",
        },
      },
    ],
  },
  {
    id: "20260273",
    name: "Nusrat Jahan",
    title: "HR Officer",
    dept: "Operations & HR",
    joinDate: "01/06/2026",
    email: "nusrat@pakizasoftware.com",
    phone: "01928374650",
    gender: "Female",
    dob: "05/04/1998",
    blood: "A (+ve)",
    nid: "1998374619283",
    fatherName: "A. K. M. Jahangir",
    motherName: "Shamima Nasrin",
    village: "Comilla",
    empStatus: "Probation",
    workingStatus: "Working",
    company: "Pakiza Software Ltd.",
    area: "Head Office",
    documents: [
      {
        id: "doc-301",
        title: "National ID (NID) Card",
        type: "IMAGE",
        file: "nid_nusrat.jpg",
        size: "1.1 MB",
        uploadedAt: "2026-08-12 11:20 AM",
        status: "Verified",
        ocrFields: {
          "Document No": "1998374619283",
          Name: "Nusrat Jahan",
          DOB: "05/04/1998",
        },
      },
      {
        id: "doc-302",
        title: "Nominee Passport Page",
        type: "IMAGE",
        file: "nominee_passport_nusrat.jpg",
        size: "1.3 MB",
        uploadedAt: "2026-08-12 11:22 AM",
        status: "Verified",
        ocrFields: {
          "Document No": "EG0837492",
          Name: "Shamima Nasrin",
          DOB: "18/02/1974",
        },
      },
    ],
  },
  {
    id: "2024091802",
    name: "Md. Anik Islam",
    title: "Business Analyst",
    dept: "Business Innovation",
    joinDate: "01/06/2024",
    email: "anik@pakizasoftware.com",
    phone: "01711223344",
    gender: "Male",
    dob: "14/09/1997",
    blood: "O (+ve)",
    nid: "1997382710394",
    fatherName: "Md. Rafiqul Islam",
    motherName: "Salma Begum",
    village: "Rajshahi",
    empStatus: "Permanent",
    workingStatus: "Working",
    company: "Pakiza Knit Ltd.",
    area: "Factory — Floor B",
    documents: [
      {
        id: "doc-401",
        title: "National ID (NID) Card",
        type: "IMAGE",
        file: "nid_anik.png",
        size: "1.2 MB",
        uploadedAt: "2026-08-14 04:10 PM",
        status: "Pending",
        ocrFields: {
          "Document No": "1997382710394",
          Name: "Md. Anik Islam",
          DOB: "14/09/1997",
        },
      },
      {
        id: "doc-402",
        title: "Academic Transcript (MBA)",
        type: "PDF",
        file: "mba_transcript_anik.pdf",
        size: "3.5 MB",
        uploadedAt: "2026-08-14 04:15 PM",
        status: "Pending",
        ocrFields: {
          Degree: "Master of Business Administration",
          Institute: "Dhaka University",
          "GPA / CGPA": "3.75",
        },
      },
      {
        id: "doc-403",
        title: "Previous Experience Letter (Pathao)",
        type: "PDF",
        file: "experience_pathao_anik.pdf",
        size: "1.8 MB",
        uploadedAt: "2026-08-14 04:18 PM",
        status: "Pending",
        ocrFields: {
          Company: "Pathao Ltd",
          Designation: "Business Analyst",
          Duration: "2 Years",
        },
      },
    ],
  },
];

export const EMP_DOC_STORAGE_KEY = "cripton_emp_doc_verification_store_v1";
export const HR_NOTIF_KEY = "hr_doc_issue_notifications_v1";

// ── Store Helpers ────────────────────────────────────────────────────────────

export function getVerificationEmployees(): VerificationEmployee[] {
  try {
    const raw = localStorage.getItem(EMP_DOC_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(EMP_DOC_STORAGE_KEY, JSON.stringify(INITIAL_VERIFICATION_EMPLOYEES));
      return INITIAL_VERIFICATION_EMPLOYEES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_VERIFICATION_EMPLOYEES;
  }
}

export function saveVerificationEmployees(list: VerificationEmployee[]) {
  localStorage.setItem(EMP_DOC_STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("employee-doc-store-updated"));
}

export function updateDocumentStatus(
  empId: string,
  docId: string,
  status: "Pending" | "Verified" | "Flagged" | "Re-uploaded",
  issueDescription?: string,
  issueCategory?: string,
  flaggedBy = "HR Compliance"
) {
  const list = getVerificationEmployees();
  const next = list.map((emp) => {
    if (emp.id !== empId) return emp;
    return {
      ...emp,
      documents: emp.documents.map((doc) => {
        if (doc.id !== docId) return doc;
        return {
          ...doc,
          status,
          issueDescription: status === "Flagged" ? issueDescription : status === "Verified" ? undefined : doc.issueDescription,
          issueCategory: status === "Flagged" ? issueCategory : status === "Verified" ? undefined : doc.issueCategory,
          flaggedAt: status === "Flagged" ? new Date().toISOString() : doc.flaggedAt,
          flaggedBy: status === "Flagged" ? flaggedBy : doc.flaggedBy,
        };
      }),
    };
  });
  saveVerificationEmployees(next);
}

export function reuploadEmployeeDocument(
  empId: string,
  docId: string,
  reuploadData: {
    fileName: string;
    fileSize: string;
    fileType: "PDF" | "IMAGE" | "DOCX";
    note?: string;
  }
) {
  const list = getVerificationEmployees();
  const next = list.map((emp) => {
    if (emp.id !== empId) return emp;
    return {
      ...emp,
      documents: emp.documents.map((doc) => {
        if (doc.id !== docId) return doc;
        return {
          ...doc,
          status: "Re-uploaded" as const,
          reuploadedFile: reuploadData.fileName,
          reuploadedSize: reuploadData.fileSize,
          reuploadedType: reuploadData.fileType,
          reuploadNote: reuploadData.note || "Revised document re-uploaded by employee.",
          reuploadedAt: new Date().toISOString(),
        };
      }),
    };
  });
  saveVerificationEmployees(next);
}

// ── Notifications Helper ─────────────────────────────────────────────────────

export function getHRNotifications(): HRDocIssueNotification[] {
  try {
    return JSON.parse(localStorage.getItem(HR_NOTIF_KEY) || "[]");
  } catch {
    return [];
  }
}

export function pushHRNotification(n: Omit<HRDocIssueNotification, "id" | "raisedAt" | "read">) {
  const existing = getHRNotifications();
  const next: HRDocIssueNotification = {
    ...n,
    id: `hr-notif-${Date.now()}`,
    raisedAt: new Date().toISOString(),
    read: false,
  };
  localStorage.setItem(HR_NOTIF_KEY, JSON.stringify([next, ...existing]));
  window.dispatchEvent(new Event("hr-notif-update"));
}

export function getDocIssueSummary() {
  const employees = getVerificationEmployees();
  let totalIssues = 0;
  let awaitingReupload = 0;
  let reuploadedAwaitingVerification = 0;
  let verified = 0;
  let totalDocs = 0;

  employees.forEach((emp) => {
    emp.documents.forEach((d) => {
      totalDocs++;
      if (d.status === "Flagged") {
        totalIssues++;
        awaitingReupload++;
      } else if (d.status === "Re-uploaded") {
        totalIssues++;
        reuploadedAwaitingVerification++;
      } else if (d.status === "Verified") {
        verified++;
      }
    });
  });

  return {
    totalIssues,
    awaitingReupload,
    reuploadedAwaitingVerification,
    verified,
    totalDocs,
  };
}
