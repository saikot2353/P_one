import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Search,
  Check,
  X,
  FileText,
  FileImage,
  Clock,
  ShieldCheck,
  Building,
  User,
  AlertTriangle,
  Download,
  Printer,
  ChevronRight,
  Filter,
  CheckCircle2,
  FolderOpen,
  Info,
  XCircle,
  FileCheck,
  UserCheck,
  ScanEye,
  ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/employee-doc-verification")({
  head: () => ({
    meta: [
      { title: "Employee Doc Verification — CRIPTON HRIS" },
      {
        name: "description",
        content: "Verify uploaded employee credentials and supporting documents individually.",
      },
    ],
  }),
  component: EmployeeDocVerificationPage,
});

// Types & Interfaces
interface OCRFields {
  [key: string]: string;
}

interface UploadedDocument {
  id: string;
  title: string;
  type: "PDF" | "IMAGE" | "DOCX";
  file: string;
  size: string;
  uploadedAt: string;
  status: "Pending" | "Verified" | "Rejected";
  rejectionReason?: string;
  ocrFields: OCRFields;
}

interface VerificationEmployee {
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
  documents: UploadedDocument[];
}

// Initial Mock Dataset matching approvals count and standard profiles
const initialEmployees: VerificationEmployee[] = [
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
        status: "Rejected",
        rejectionReason:
          "The bottom margin and seal of the controller of examinations are cropped. Please re-upload.",
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

function EmployeeDocVerificationPage() {
  const [employees, setEmployees] = useState<VerificationEmployee[]>(initialEmployees);
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Selection & Modal States
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingDocId, setViewingDocId] = useState<string | null>(null);

  // Rejection Details State
  const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);
  const [rejectionInput, setRejectionInput] = useState("");
  const [showInlineRejectForm, setShowInlineRejectForm] = useState(false);

  // Get active employee details for the modal
  const activeEmployee = useMemo(() => {
    return employees.find((emp) => emp.id === selectedEmpId) || null;
  }, [employees, selectedEmpId]);

  // Get active document for the OCR viewer
  const activeDocument = useMemo(() => {
    if (!activeEmployee || !viewingDocId) return null;
    return activeEmployee.documents.find((doc) => doc.id === viewingDocId) || null;
  }, [activeEmployee, viewingDocId]);

  // Departments for filter dropdown
  const departments = useMemo(() => {
    const set = new Set(employees.map((emp) => emp.dept));
    return ["All", ...Array.from(set)];
  }, [employees]);

  // Handle Verify Action for a single document
  const handleVerifyDoc = (docId: string, empId: string) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === empId) {
          return {
            ...emp,
            documents: emp.documents.map((doc) => {
              if (doc.id === docId) {
                toast.success(`"${doc.title}" verified successfully!`);
                return { ...doc, status: "Verified", rejectionReason: undefined };
              }
              return doc;
            }),
          };
        }
        return emp;
      }),
    );
    // Reset inline rejection form state
    setShowInlineRejectForm(false);
  };

  // Initiate rejection input
  const handleStartReject = (docId: string) => {
    setRejectingDocId(docId);
    setRejectionInput("");
    setShowInlineRejectForm(true);
  };

  // Cancel rejection
  const handleCancelReject = () => {
    setRejectingDocId(null);
    setRejectionInput("");
    setShowInlineRejectForm(false);
  };

  // Confirm Rejection
  const handleConfirmReject = (docId: string, empId: string) => {
    if (!rejectionInput.trim()) {
      toast.error("Please enter a rejection reason.");
      return;
    }

    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === empId) {
          return {
            ...emp,
            documents: emp.documents.map((doc) => {
              if (doc.id === docId) {
                toast.warning(`"${doc.title}" has been rejected.`);
                return { ...doc, status: "Rejected", rejectionReason: rejectionInput };
              }
              return doc;
            }),
          };
        }
        return emp;
      }),
    );

    setRejectingDocId(null);
    setRejectionInput("");
    setShowInlineRejectForm(false);
  };

  // Verify All Pending Documents for current selected user
  const handleVerifyAllDocs = (empId: string) => {
    let verifiedCount = 0;
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === empId) {
          return {
            ...emp,
            documents: emp.documents.map((doc) => {
              if (doc.status === "Pending") {
                verifiedCount++;
                return { ...doc, status: "Verified", rejectionReason: undefined };
              }
              return doc;
            }),
          };
        }
        return emp;
      }),
    );

    if (verifiedCount > 0) {
      toast.success(`Successfully verified ${verifiedCount} pending document(s)!`);
    } else {
      toast.info("No pending documents to verify.");
    }
  };

  // Complete Overall Profile Verification
  const handleCompleteVerification = (empId: string, name: string) => {
    const emp = employees.find((e) => e.id === empId);
    if (!emp) return;

    const unverifiedDocs = emp.documents.filter((doc) => doc.status !== "Verified");
    if (unverifiedDocs.length > 0) {
      const pending = unverifiedDocs.filter((d) => d.status === "Pending").length;
      const rejected = unverifiedDocs.filter((d) => d.status === "Rejected").length;

      toast.error(
        `Cannot finalize. Employee has ${pending} pending and ${rejected} rejected document(s) remaining.`,
      );
      return;
    }

    toast.success(`Employee ${name}'s documents and credentials fully verified and approved!`);
    setIsModalOpen(false);
  };

  // Filter Employees for the main table list
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // 1. Text Search query
      const matchesSearch =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.id.includes(searchQuery) ||
        emp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.dept.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Department filter
      if (deptFilter !== "All" && emp.dept !== deptFilter) return false;

      // 3. Status filter
      if (statusFilter !== "All") {
        const hasPending = emp.documents.some((d) => d.status === "Pending");
        const hasRejected = emp.documents.some((d) => d.status === "Rejected");
        const allVerified = emp.documents.every((d) => d.status === "Verified");

        if (statusFilter === "Pending" && !hasPending) return false;
        if (statusFilter === "Issues" && !hasRejected) return false;
        if (statusFilter === "Verified" && !allVerified) return false;
      }

      return true;
    });
  }, [employees, searchQuery, deptFilter, statusFilter]);

  // Overall Global Counts
  const globalStats = useMemo(() => {
    let pendingDocs = 0;
    let rejectedDocs = 0;
    let verifiedDocs = 0;
    let totalDocs = 0;

    employees.forEach((emp) => {
      emp.documents.forEach((doc) => {
        totalDocs++;
        if (doc.status === "Pending") pendingDocs++;
        if (doc.status === "Rejected") rejectedDocs++;
        if (doc.status === "Verified") verifiedDocs++;
      });
    });

    return { pendingDocs, rejectedDocs, verifiedDocs, totalDocs };
  }, [employees]);

  // Open details modal
  const handleOpenReviewModal = (empId: string) => {
    setSelectedEmpId(empId);
    setViewingDocId(null);
    setShowInlineRejectForm(false);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-800 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        {/* Main List Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header Panel */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs shrink-0">
            <div>
              <h1 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="size-5.5 text-blue-600" /> Employee Doc Verification
              </h1>
              <p className="text-xs font-semibold text-slate-400 mt-1">
                List of employee-submitted profiles, academic credentials, and security clearance
                documents.
              </p>
            </div>

            {/* Action Metrics Summary */}
            <div className="flex items-center gap-4 shrink-0 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800/80 text-[10px] font-bold text-slate-500">
              <div className="text-center px-3 border-r border-slate-200 dark:border-slate-800">
                <span className="block text-slate-400 uppercase tracking-wider text-[8px]">
                  Pending Files
                </span>
                <span className="block text-xs font-black text-amber-600 dark:text-amber-400 mt-0.5">
                  {globalStats.pendingDocs}
                </span>
              </div>
              <div className="text-center px-3 border-r border-slate-200 dark:border-slate-800">
                <span className="block text-slate-400 uppercase tracking-wider text-[8px]">
                  Rejected / Issues
                </span>
                <span className="block text-xs font-black text-rose-600 dark:text-rose-400 mt-0.5">
                  {globalStats.rejectedDocs}
                </span>
              </div>
              <div className="text-center px-3">
                <span className="block text-slate-400 uppercase tracking-wider text-[8px]">
                  Verified / Ok
                </span>
                <span className="block text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {globalStats.verifiedDocs}
                </span>
              </div>
            </div>
          </div>

          {/* Filtering & Toolbar Row */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by ID, Name, Job title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-semibold"
              />
            </div>

            {/* Department dropdown */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <span className="text-[10px] font-black uppercase text-slate-400 whitespace-nowrap">
                Dept:
              </span>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="h-8.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 dark:text-slate-200"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d === "All" ? "All Departments" : d}
                  </option>
                ))}
              </select>
            </div>

            {/* Status filters */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <span className="text-[10px] font-black uppercase text-slate-400 whitespace-nowrap">
                Status:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 dark:text-slate-200"
              >
                <option value="All">All Verification Statuses</option>
                <option value="Pending">Has Pending Documents</option>
                <option value="Issues">Has Issues / Rejected Documents</option>
                <option value="Verified">Fully Approved & Verified</option>
              </select>
            </div>
          </div>

          {/* Core Table Grid layout */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-950/30 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-5 py-4 w-12 text-center">SL</th>
                    <th className="px-5 py-4 w-28">Employee ID</th>
                    <th className="px-5 py-4">Employee Name</th>
                    <th className="px-5 py-4 w-52">Department</th>
                    <th className="px-5 py-4 w-48">Designation</th>
                    <th className="px-5 py-4 text-center w-28">Pending Files</th>
                    <th className="px-5 py-4 text-center w-28">Rejected Files</th>
                    <th className="px-5 py-4 text-center w-28">Approved Files</th>
                    <th className="px-5 py-4 text-center w-36">Overall Status</th>
                    <th className="px-5 py-4 text-right w-36">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td
                        colSpan={10}
                        className="py-12 text-center text-slate-400 dark:text-slate-500 font-bold"
                      >
                        <Info className="size-8 mx-auto text-slate-300 mb-2" />
                        No employee document records match current filters
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((emp, index) => {
                      const totalDocs = emp.documents.length;
                      const pending = emp.documents.filter((d) => d.status === "Pending").length;
                      const rejected = emp.documents.filter((d) => d.status === "Rejected").length;
                      const verified = emp.documents.filter((d) => d.status === "Verified").length;

                      return (
                        <tr
                          key={emp.id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group cursor-pointer"
                          onClick={() => handleOpenReviewModal(emp.id)}
                        >
                          {/* Index */}
                          <td className="px-5 py-3.5 text-center text-slate-400 font-mono">
                            {index + 1}
                          </td>

                          {/* ID */}
                          <td className="px-5 py-3.5 font-mono text-slate-500 font-bold">
                            {emp.id}
                          </td>

                          {/* Name */}
                          <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {emp.name}
                          </td>

                          {/* Dept */}
                          <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">
                            {emp.dept}
                          </td>

                          {/* Designation */}
                          <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">
                            {emp.title}
                          </td>

                          {/* Pending Docs */}
                          <td className="px-5 py-3.5 text-center">
                            {pending > 0 ? (
                              <Badge className="bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 font-mono text-[10px] font-black px-2 py-0.5">
                                {pending} files
                              </Badge>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-700">—</span>
                            )}
                          </td>

                          {/* Rejected Docs */}
                          <td className="px-5 py-3.5 text-center">
                            {rejected > 0 ? (
                              <Badge className="bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 font-mono text-[10px] font-black px-2 py-0.5">
                                {rejected} issue{rejected > 1 ? "s" : ""}
                              </Badge>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-700">—</span>
                            )}
                          </td>

                          {/* Approved Docs */}
                          <td className="px-5 py-3.5 text-center">
                            {verified > 0 ? (
                              <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 font-mono text-[10px] font-black px-2 py-0.5">
                                {verified}/{totalDocs}
                              </Badge>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-700">—</span>
                            )}
                          </td>

                          {/* Overall Status */}
                          <td className="px-5 py-3.5 text-center">
                            {rejected > 0 ? (
                              <Badge className="bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300 border border-rose-200 text-[8.5px] py-0.5 font-extrabold uppercase tracking-wide">
                                Issues Found
                              </Badge>
                            ) : pending > 0 ? (
                              <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 border border-amber-200 text-[8.5px] py-0.5 font-extrabold uppercase tracking-wide">
                                Action Required
                              </Badge>
                            ) : (
                              <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 border border-emerald-200 text-[8.5px] py-0.5 font-extrabold uppercase tracking-wide">
                                Fully Approved
                              </Badge>
                            )}
                          </td>

                          {/* Action Button */}
                          <td
                            className="px-5 py-3.5 text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => handleOpenReviewModal(emp.id)}
                              className="px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 hover:border-blue-200 transition-all dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/60 dark:hover:bg-blue-950/40 shadow-xs flex items-center gap-1 ml-auto"
                            >
                              Verify Docs <ChevronRight className="size-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* CORE VERIFICATION MODAL OVERLAY */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className={`p-0 overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl transition-all duration-300 ${
            viewingDocId
              ? "max-w-6xl w-full h-[650px] flex flex-col md:flex-row"
              : "max-w-4xl w-full h-[600px] flex flex-col"
          }`}
        >
          {activeEmployee && (
            <>
              {/* VIEW 1: Document Table & Basic Details (Default View) */}
              {viewingDocId === null ? (
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Modal Header */}
                  <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-4 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-base shadow-xs shrink-0">
                        {activeEmployee.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                            Verify documents: {activeEmployee.name}
                          </h2>
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase border bg-slate-100 dark:bg-slate-850 text-slate-500 border-slate-200 dark:border-slate-750">
                            {activeEmployee.empStatus}
                          </span>
                        </div>
                        <p className="text-[10px] font-semibold text-slate-400 mt-1">
                          Emp ID: <span className="font-mono font-bold">{activeEmployee.id}</span> |{" "}
                          {activeEmployee.title} | {activeEmployee.dept}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVerifyAllDocs(activeEmployee.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-black border border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900"
                      >
                        <CheckCircle2 className="size-3.5" /> Verify All Pending
                      </button>
                      <button
                        onClick={() =>
                          handleCompleteVerification(activeEmployee.id, activeEmployee.name)
                        }
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black"
                      >
                        <UserCheck className="size-3.5" /> Complete verification
                      </button>
                    </div>
                  </div>

                  {/* Scrollable details wrapper */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-5">
                    {/* Basic details grid */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                        <Info className="size-3.5 text-blue-500" /> Reference Basic Info
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-2xs text-[11px]">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 block uppercase">
                            NID Card Number
                          </span>
                          <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
                            {activeEmployee.nid}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 block uppercase">
                            Date of Birth
                          </span>
                          <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
                            {activeEmployee.dob}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 block uppercase">
                            Father's Name
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                            {activeEmployee.fatherName}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 block uppercase">
                            Mother's Name
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                            {activeEmployee.motherName}
                          </span>
                        </div>
                        <div className="mt-2 border-t border-slate-100 dark:border-slate-800 pt-2 col-span-2 md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 block uppercase">
                              Gender & Blood
                            </span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {activeEmployee.gender} / {activeEmployee.blood}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 block uppercase">
                              Village / District
                            </span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {activeEmployee.village}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 block uppercase">
                              Official Mobile
                            </span>
                            <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
                              {activeEmployee.phone}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 block uppercase">
                              Email Address
                            </span>
                            <span className="font-bold font-mono text-slate-800 dark:text-slate-200 truncate block">
                              {activeEmployee.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Uploaded files grid list */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                        <FolderOpen className="size-3.5 text-blue-500" /> Attached Credential Scans
                      </div>

                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-950/20 text-[9px] font-extrabold uppercase text-slate-400 dark:text-slate-500 border-b border-slate-200/60 dark:border-slate-800/80">
                              <th className="px-4 py-2.5">Document Details</th>
                              <th className="px-4 py-2.5 w-28">Type</th>
                              <th className="px-4 py-2.5 w-32 text-center">Status</th>
                              <th className="px-4 py-2.5 w-52 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-350">
                            {activeEmployee.documents.map((doc) => {
                              const isPdf = doc.type === "PDF";
                              return (
                                <tr
                                  key={doc.id}
                                  className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10"
                                >
                                  <td className="px-4 py-2.5">
                                    <div className="flex items-center gap-2">
                                      <div
                                        className={`p-1.5 rounded ${isPdf ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20" : "bg-purple-50 text-purple-600 dark:bg-purple-950/20"}`}
                                      >
                                        {isPdf ? (
                                          <FileText className="size-4" />
                                        ) : (
                                          <FileImage className="size-4" />
                                        )}
                                      </div>
                                      <div>
                                        <p className="font-extrabold text-[11px] text-slate-900 dark:text-white">
                                          {doc.title}
                                        </p>
                                        <p className="text-[9px] font-mono text-slate-400 mt-0.5">
                                          {doc.file} ({doc.size})
                                        </p>
                                      </div>
                                    </div>
                                    {doc.status === "Rejected" && doc.rejectionReason && (
                                      <p className="text-[9px] text-rose-500 bg-rose-50/30 border border-rose-100 rounded px-2 py-1 mt-1 font-semibold dark:bg-rose-950/10 dark:border-rose-950/40">
                                        Rejection reason: {doc.rejectionReason}
                                      </p>
                                    )}
                                  </td>
                                  <td className="px-4 py-2.5 text-[9px] font-mono text-slate-400">
                                    {doc.type} Document
                                  </td>
                                  <td className="px-4 py-2.5 text-center">
                                    {doc.status === "Verified" ? (
                                      <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 font-black text-[8px] py-0 uppercase">
                                        Verified
                                      </Badge>
                                    ) : doc.status === "Rejected" ? (
                                      <Badge className="bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 font-black text-[8px] py-0 uppercase">
                                        Rejected
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 font-black text-[8px] py-0 uppercase">
                                        Pending
                                      </Badge>
                                    )}
                                  </td>
                                  <td className="px-4 py-2.5 text-right">
                                    <div className="flex justify-end gap-1">
                                      <button
                                        onClick={() => setViewingDocId(doc.id)}
                                        className="px-2 py-1 text-[9px] font-bold border border-slate-200 hover:bg-slate-50 text-slate-600 rounded dark:border-slate-800 dark:text-slate-450 dark:hover:bg-slate-900"
                                      >
                                        <ScanEye className="size-3 mr-0.5 inline" /> View Scan
                                      </button>
                                      <button
                                        onClick={() => handleVerifyDoc(doc.id, activeEmployee.id)}
                                        disabled={doc.status === "Verified"}
                                        className={`px-2 py-1 text-[9px] font-bold border rounded ${doc.status === "Verified" ? "text-slate-300 border-slate-100 cursor-not-allowed bg-slate-50 dark:border-slate-800 dark:text-slate-800" : "border-emerald-100 text-emerald-700 hover:bg-emerald-50 bg-emerald-50/20 dark:border-emerald-950 dark:text-emerald-450"}`}
                                      >
                                        Verify
                                      </button>
                                      <button
                                        onClick={() => handleStartReject(doc.id)}
                                        disabled={doc.status === "Rejected"}
                                        className={`px-2 py-1 text-[9px] font-bold border rounded ${doc.status === "Rejected" ? "text-slate-300 border-slate-100 cursor-not-allowed bg-slate-50 dark:border-slate-800 dark:text-slate-800" : "border-rose-100 text-rose-700 hover:bg-rose-50 bg-rose-50/20 dark:border-rose-950 dark:text-rose-450"}`}
                                      >
                                        Reject
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
                  </div>

                  {/* Dialog Footer Actions */}
                  <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end shrink-0">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:bg-slate-50 text-xs font-bold transition-all"
                    >
                      Close Review Panel
                    </button>
                  </div>
                </div>
              ) : (
                /* VIEW 2: Side-by-side OCR Preview Screen (Toggled inline in the modal!) */
                <div className="flex-1 flex flex-col md:flex-row min-h-0 bg-slate-50 dark:bg-slate-950">
                  {/* LEFT PANE: Document scan preview */}
                  <div className="flex-1 bg-slate-900 flex flex-col min-h-0 relative select-none">
                    {/* Top subheader toolbar */}
                    <div className="h-12 border-b border-slate-800 bg-slate-950/80 px-4 flex items-center justify-between text-[11px] text-slate-400 shrink-0 z-10">
                      <button
                        onClick={() => {
                          setViewingDocId(null);
                          setShowInlineRejectForm(false);
                        }}
                        className="flex items-center gap-1 text-slate-200 hover:text-white font-bold bg-slate-800 px-2.5 py-1 rounded"
                      >
                        <ArrowLeft className="size-3.5" /> Back to Files List
                      </button>
                      <span className="font-mono text-[10px] text-slate-400">
                        File: {activeDocument?.file}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toast.success("File sent to printing spooler")}
                          className="p-1 rounded hover:bg-slate-800 hover:text-white"
                          title="Print Document"
                        >
                          <Printer className="size-3.5" />
                        </button>
                        <button
                          onClick={() => toast.success(`Downloaded: ${activeDocument?.file}`)}
                          className="p-1 rounded hover:bg-slate-800 hover:text-white"
                          title="Download Scan"
                        >
                          <Download className="size-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Rendering canvas */}
                    <div className="flex-1 overflow-auto flex items-center justify-center p-6 bg-slate-950/60">
                      {activeDocument && (
                        <>
                          {/* NID Card Mockup */}
                          {activeDocument.title.includes("NID") && (
                            <div className="w-[360px] h-[220px] rounded-xl bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-900 border border-emerald-700 shadow-2xl p-4 flex flex-col justify-between text-white relative font-mono uppercase scale-90 sm:scale-100">
                              <div className="flex items-center justify-between border-b border-white/20 pb-1">
                                <div className="size-6 rounded-full bg-orange-600 flex items-center justify-center text-[5px] shrink-0 font-sans">
                                  GOVT
                                </div>
                                <div className="text-center flex-1 mx-2">
                                  <p className="text-[5.5px] font-black leading-none text-emerald-200">
                                    People's Republic of Bangladesh
                                  </p>
                                  <p className="text-[7.5px] font-black text-amber-300 leading-normal tracking-wide">
                                    National ID Card / জাতীয় পরিচয় পত্র
                                  </p>
                                </div>
                                <div className="size-5 bg-amber-400 rounded-sm text-slate-950 flex items-center justify-center font-black text-[5px]">
                                  CHIP
                                </div>
                              </div>
                              <div className="flex-1 flex gap-3 mt-3 overflow-hidden text-[7.5px] normal-case font-sans text-slate-100">
                                <div className="w-16 h-20 bg-slate-800 rounded border border-white/10 flex flex-col items-center justify-center text-[6px] text-slate-500 shrink-0 font-bold">
                                  👨‍💼 PHOTO
                                </div>
                                <div className="flex-1 space-y-1 mt-0.5">
                                  <div>
                                    <span className="text-[6px] text-emerald-200 block font-semibold">
                                      Name:
                                    </span>
                                    <span className="font-extrabold uppercase text-[8px] text-white tracking-wide">
                                      {activeEmployee.name}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-[6px] text-emerald-200 block font-semibold">
                                      Father's Name:
                                    </span>
                                    <span className="font-bold text-white text-[7.5px]">
                                      {activeEmployee.fatherName}
                                    </span>
                                  </div>
                                  <div className="flex justify-between gap-1">
                                    <div>
                                      <span className="text-[6px] text-emerald-200 block font-semibold">
                                        DOB:
                                      </span>
                                      <span className="font-bold font-mono text-white text-[7.5px]">
                                        {activeEmployee.dob}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-[6px] text-emerald-200 block font-semibold">
                                        Blood:
                                      </span>
                                      <span className="font-bold text-rose-400 text-[7.5px]">
                                        {activeEmployee.blood}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-between items-end border-t border-white/10 pt-1 mt-1">
                                <div>
                                  <span className="text-[6px] text-emerald-200 block font-semibold">
                                    NID NO:
                                  </span>
                                  <span className="font-mono text-amber-300 font-extrabold text-[9.5px] tracking-wider">
                                    {activeEmployee.nid}
                                  </span>
                                </div>
                                <div className="text-[5.5px] text-slate-400 italic">Signature</div>
                              </div>
                            </div>
                          )}

                          {/* Academic Certificate Mockup */}
                          {activeDocument.title.includes("Academic") && (
                            <div className="w-[360px] h-[450px] rounded bg-[#fffff9] border border-amber-900/10 shadow-2xl p-6 flex flex-col justify-between text-slate-800 scale-90 sm:scale-100 font-serif relative">
                              <div className="absolute inset-1.5 border border-dashed border-amber-700/20 rounded pointer-events-none" />
                              <div className="text-center space-y-1 mt-2">
                                <div className="size-8 mx-auto rounded-full border border-amber-700 bg-amber-50 flex items-center justify-center font-bold text-[9px] text-amber-900">
                                  IIT
                                </div>
                                <h3 className="text-[12px] font-black text-amber-900 tracking-wide uppercase">
                                  {activeDocument.ocrFields["Institute"] || "Dhaka University"}
                                </h3>
                                <p className="text-[7.5px] uppercase font-sans font-bold tracking-widest text-slate-400">
                                  Office of the Controller of Exams
                                </p>
                              </div>
                              <div className="text-center my-6 space-y-2">
                                <p className="text-[8.5px] italic text-slate-500">
                                  This is to certify that
                                </p>
                                <h4 className="text-[13px] font-extrabold text-slate-900 uppercase underline decoration-amber-600/30 decoration-wavy decoration-1 underline-offset-4">
                                  {activeEmployee.name}
                                </h4>
                                <p className="text-[8.5px] italic text-slate-500">
                                  has successfully completed curriculum requirements and is
                                  conferred the degree of
                                </p>
                                <h5 className="text-[11px] font-black text-amber-950 uppercase">
                                  {activeDocument.ocrFields["Degree"] || "Bachelor of Science"}
                                </h5>
                              </div>
                              <div className="flex-1 my-3 px-4 font-sans text-[8.5px] space-y-2">
                                <div className="bg-amber-50/40 p-2.5 rounded border border-amber-900/10">
                                  <span className="block font-bold text-[7px] text-amber-900 uppercase tracking-wider pb-0.5 border-b border-amber-900/5 mb-1.5">
                                    OCR Extracted Grades
                                  </span>
                                  <div className="grid grid-cols-2 gap-2 text-slate-600 font-semibold">
                                    <div>
                                      GPA / CGPA:{" "}
                                      <span className="font-bold text-slate-900 font-mono">
                                        {activeDocument.ocrFields["GPA / CGPA"] || "3.85"}
                                      </span>
                                    </div>
                                    <div>
                                      Passing Year:{" "}
                                      <span className="font-bold text-slate-900 font-mono">
                                        {activeDocument.ocrFields["Passing Year"] || "2022"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-between items-end mt-4 border-t border-slate-100 pt-3 text-[7px] font-sans">
                                <div>
                                  Date:{" "}
                                  <span className="font-mono font-bold text-slate-600">
                                    12/03/2023
                                  </span>
                                </div>
                                <div className="text-center font-serif">
                                  <span className="italic block opacity-70">R. Rahman</span>
                                  <span className="border-t border-slate-200 block text-[5px] uppercase font-sans tracking-widest text-slate-400 font-bold mt-0.5">
                                    Controller of Examinations
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Standard Registry / Experience Mockup */}
                          {!activeDocument.title.includes("NID") &&
                            !activeDocument.title.includes("Academic") && (
                              <div className="w-[360px] h-[430px] bg-slate-50 border border-slate-200 shadow-2xl p-6 flex flex-col justify-between text-slate-800 scale-90 sm:scale-100 font-sans">
                                <div className="flex justify-between border-b border-slate-200 pb-2">
                                  <div>
                                    <h4 className="text-[9px] font-black text-slate-900 tracking-wider">
                                      OFFICIAL TRANSCRIPT SCAN
                                    </h4>
                                    <span className="text-[7.5px] text-slate-400 font-mono font-semibold">
                                      Doc Ref: {activeDocument.id.toUpperCase()}
                                    </span>
                                  </div>
                                  <span className="h-5 px-2 bg-blue-600 rounded text-white flex items-center justify-center text-[6px] font-extrabold uppercase tracking-wide">
                                    SECURE SCAN
                                  </span>
                                </div>
                                <div className="flex-1 my-4 space-y-3 font-serif text-[10px] leading-relaxed">
                                  <span className="block text-[8.5px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                                    TO WHOM IT MAY CONCERN
                                  </span>
                                  <p>
                                    This serves to confirm that document submissions matching
                                    profile registration name
                                    <strong className="font-sans font-black text-slate-950 mx-1">
                                      {activeEmployee.name}
                                    </strong>
                                    have been extracted for verification processing.
                                  </p>
                                  <div className="bg-white p-2.5 rounded border border-slate-100 font-sans text-[8.5px] space-y-1.5 leading-normal">
                                    <span className="block text-[7px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-1">
                                      Extracted Metadata
                                    </span>
                                    {Object.entries(activeDocument.ocrFields).map(([k, v]) => (
                                      <div key={k} className="flex justify-between">
                                        <span className="font-semibold text-slate-400">{k}:</span>
                                        <span className="font-bold text-slate-800">{v}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex justify-between items-end border-t border-slate-100 pt-3">
                                  <div className="w-20 bg-slate-200/50 p-0.5 rounded flex items-center justify-center">
                                    {/* Barcode representation */}
                                    <div className="flex gap-[1px] h-4 w-full">
                                      {[1, 2, 1, 3, 1, 4, 1, 2, 3, 1, 1, 2].map((w, idx) => (
                                        <div
                                          key={idx}
                                          className="bg-slate-700"
                                          style={{ flexGrow: w }}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <span className="text-[6.5px] uppercase font-bold text-slate-400 tracking-wider">
                                    Office of Verification Registry
                                  </span>
                                </div>
                              </div>
                            )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* RIGHT PANE: Comparison & Decisions */}
                  <div className="w-full md:w-96 border-l border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-950 flex flex-col overflow-hidden shrink-0">
                    <div className="shrink-0 space-y-1 border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                          Match Console
                        </span>
                        {activeDocument?.status === "Verified" ? (
                          <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 text-[8px] font-black uppercase">
                            Verified
                          </Badge>
                        ) : activeDocument?.status === "Rejected" ? (
                          <Badge className="bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 text-[8px] font-black uppercase">
                            Rejected
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 text-[8px] font-black uppercase">
                            Pending
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase leading-normal tracking-wide">
                        {activeDocument?.title}
                      </h3>
                      <p className="text-[9.5px] text-slate-400 font-semibold leading-normal">
                        Verify if the OCR scan results match the official database profile record.
                      </p>
                    </div>

                    {/* Field Comparison scrolling list */}
                    <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
                      {activeDocument &&
                        Object.entries(activeDocument.ocrFields).map(([fieldKey, ocrVal]) => {
                          let profileVal = "—";
                          let matches = false;

                          if (fieldKey === "Document No" || fieldKey === "Certificate No") {
                            profileVal = activeEmployee.nid;
                          } else if (fieldKey === "Name") {
                            profileVal = activeEmployee.name;
                          } else if (fieldKey === "DOB") {
                            profileVal = activeEmployee.dob;
                          } else if (fieldKey === "Father Name") {
                            profileVal = activeEmployee.fatherName;
                          } else {
                            profileVal = "Metadata Verified";
                            matches = true;
                          }

                          if (
                            profileVal.toLowerCase().trim() === ocrVal.toLowerCase().trim() ||
                            matches
                          ) {
                            matches = true;
                          }

                          return (
                            <div
                              key={fieldKey}
                              className="p-2.5 border border-slate-100 dark:border-slate-800/80 rounded-lg bg-slate-50/50 dark:bg-slate-900/10 space-y-1.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                                  {fieldKey}
                                </span>
                                {matches ? (
                                  <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold text-[8px] py-0">
                                    Matches
                                  </Badge>
                                ) : (
                                  <Badge className="bg-amber-50 text-amber-700 border border-amber-200 font-extrabold text-[8px] py-0">
                                    No Match
                                  </Badge>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-[10px] leading-tight">
                                <div>
                                  <span className="text-[8px] text-slate-400 block font-semibold">
                                    Profile Value:
                                  </span>
                                  <span className="font-extrabold text-slate-700 dark:text-slate-200 block truncate">
                                    {profileVal}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[8px] text-slate-400 block font-semibold">
                                    OCR Scan:
                                  </span>
                                  <span className="font-extrabold text-slate-950 dark:text-white block truncate">
                                    {ocrVal}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                      {/* Display inline Rejection Reason if doc rejected */}
                      {activeDocument?.status === "Rejected" && activeDocument.rejectionReason && (
                        <div className="p-2.5 bg-rose-50/30 border border-rose-100 dark:bg-rose-950/10 dark:border-rose-950/40 rounded-lg space-y-1">
                          <span className="text-[8px] font-black uppercase text-rose-500 tracking-wider block">
                            Rejection log note
                          </span>
                          <p className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold leading-relaxed">
                            {activeDocument.rejectionReason}
                          </p>
                        </div>
                      )}

                      {/* Inline Rejection Reason Form */}
                      {showInlineRejectForm && rejectingDocId === activeDocument?.id && (
                        <div className="p-3 border border-rose-200 dark:border-rose-900 bg-rose-50/10 dark:bg-rose-950/10 rounded-xl space-y-2">
                          <label className="text-[9px] font-black uppercase text-rose-600 dark:text-rose-400 tracking-wider block">
                            Specify Rejection Reason:
                          </label>
                          <textarea
                            rows={3}
                            placeholder="e.g. Scanned image is too blurry. Please upload a clear high-resolution file."
                            value={rejectionInput}
                            onChange={(e) => setRejectionInput(e.target.value)}
                            className="w-full p-2 text-[10px] rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 font-semibold resize-none"
                          />
                          <div className="flex justify-end gap-1.5 text-[9px]">
                            <button
                              onClick={handleCancelReject}
                              className="px-2.5 py-1 font-bold text-slate-500 hover:bg-slate-50 rounded"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() =>
                                handleConfirmReject(activeDocument.id, activeEmployee.id)
                              }
                              className="px-3 py-1 font-black bg-rose-600 text-white rounded shadow-xs"
                            >
                              Reject File
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action buttons inside viewer */}
                    <div className="shrink-0 border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2">
                      {activeDocument && !showInlineRejectForm && (
                        <>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                handleVerifyDoc(activeDocument.id, activeEmployee.id);
                                setViewingDocId(null);
                              }}
                              disabled={activeDocument.status === "Verified"}
                              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-black border transition-all ${activeDocument.status === "Verified" ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed dark:bg-slate-900 dark:border-slate-800/80" : "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-xs"}`}
                            >
                              <Check className="size-3.5" /> Verify OK
                            </button>
                            <button
                              onClick={() => handleStartReject(activeDocument.id)}
                              disabled={activeDocument.status === "Rejected"}
                              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-black border transition-all ${activeDocument.status === "Rejected" ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed dark:bg-slate-900 dark:border-slate-800/80" : "bg-white hover:bg-rose-50 text-rose-600 border-rose-200 shadow-xs"}`}
                            >
                              <X className="size-3.5" /> Reject Doc
                            </button>
                          </div>
                          <button
                            onClick={() => {
                              setViewingDocId(null);
                              setShowInlineRejectForm(false);
                            }}
                            className="w-full text-center py-1 text-slate-400 hover:text-slate-600 text-[9px] font-bold"
                          >
                            Back to Files list
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
