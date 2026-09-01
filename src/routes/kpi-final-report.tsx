import { useState, useMemo, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  FileText,
  Printer,
  Search,
  Eye,
  ChevronRight,
  ArrowLeft,
  Award,
  Download,
  Building2,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";

export const Route = createFileRoute("/kpi-final-report")({
  head: () => ({
    meta: [
      { title: "Assessment Final Report — CRIPTON HRIS" },
      {
        name: "description",
        content: "Employee Performance Evaluation & Appraisal Form Final Report.",
      },
    ],
  }),
  component: KpiFinalReportPage,
});

export interface AppraisalRecord {
  empId: string;
  fullName: string;
  photoUrl: string;
  joiningDate: string;
  completedTenure: string;
  designation: string;
  department: string;
  lastIncAmount: number;
  lastIncDate: string;
  lastPromDate: string;
  grossSalary: number;
  basicSalary: number;
  effectiveDate: string;
  evalDate: string;
  evalPeriodFrom: string;
  evalPeriodTo: string;
  hodRec: string;
  hodPlanImprovement: string;
  hodComments: string;
  hodJd: string;
  hrStrength: string;
  hrPlanImprovement: string;
  hrComments: string;
  salaryIncProposed: number;
  promotionStatus: string;
  proposedDesignation: string;
  totalJobExp: string;
  education: string;
  pkclService: string;
  softwareScore: number;
  hodJobScore: number;
  hodOtherScore: number;
  hrdOtherScore: number;
  showcaseDeduction: number;
  totalMark: number;
  grade: string;
  criteriaScores: {
    sl: number;
    criteria: string;
    description: string;
    hodMax: number;
    hodScore: number;
    hrdMax?: number;
    hrdScore?: number;
    type?: "auto" | "manual" | "kpi";
  }[];
}

const mockAppraisalList: AppraisalRecord[] = [
  {
    empId: "2019013884",
    fullName: "Javed Mia",
    photoUrl: "https://bpm.pakizaknit.com/Photo/EmpPicture/b314987a-a621-4906-9a64-2a18104da3e6.jpg",
    joiningDate: "12/01/2019",
    completedTenure: "7 Years 7 Months",
    designation: "Helper (Cook)",
    department: "Admin",
    lastIncAmount: 1500,
    lastIncDate: "01/01/2026",
    lastPromDate: "01/01/2026",
    grossSalary: 21200.0,
    basicSalary: 12720.0,
    effectiveDate: "01/01/2026",
    evalDate: "01/01/2026",
    evalPeriodFrom: "01/01/2025",
    evalPeriodTo: "31/12/2025",
    hodRec: "Highly dependable worker. Recommended for salary enhancement.",
    hodPlanImprovement: "Skills upgrade training in food safety.",
    hodComments: "Regular in attendance and obedient.",
    hodJd: "Standard Canteen Kitchen Operations.",
    hrStrength: "Good team player and disciplined.",
    hrPlanImprovement: "Complete hygiene certification.",
    hrComments: "Endorsed for increment.",
    salaryIncProposed: 1000.0,
    promotionStatus: "Incremented",
    proposedDesignation: "Helper (Cook)",
    totalJobExp: "7 Years 7 Months",
    education: "SSC",
    pkclService: "7 Years 7 Months",
    softwareScore: 0,
    hodJobScore: 32,
    hodOtherScore: 35,
    hrdOtherScore: 11,
    showcaseDeduction: 0,
    totalMark: 78,
    grade: "B",
    criteriaScores: [
      {
        sl: 1,
        criteria: "Attendance",
        description: "Knowledge and understanding of all phases of the job and those requiring improved skills and/ or experience.",
        hodMax: 0,
        hodScore: 0,
        type: "auto",
      },
      {
        sl: 2,
        criteria: "Target Achievement",
        description: "context reffers to how much of a set goal or target has been accomplished within a specific time frame.",
        hodMax: 0,
        hodScore: 0,
        type: "auto",
      },
      {
        sl: 3,
        criteria: "Job Knowledge/Quality & efficiency",
        description: "context reffers to how much of a set goal or target has been accomplished within a specific time frame.",
        hodMax: 0,
        hodScore: 0,
        type: "manual",
      },
      {
        sl: 1,
        criteria: "Loyalty of company",
        description: "KPI measures how committed an employee is to the organization’s mission, values, and long-term success.",
        hodMax: 5,
        hodScore: 5,
        hrdMax: 5,
        hrdScore: 0,
        type: "kpi",
      },
      {
        sl: 2,
        criteria: "Decision Making/ Problem Solving",
        description: "Measures effectiveness in understanding problems and making timely practical decisions, best suited for the business.",
        hodMax: 5,
        hodScore: 5,
        hrdMax: 5,
        hrdScore: 0,
        type: "kpi",
      },
      {
        sl: 3,
        criteria: "Leadership",
        description: "influence, guide, and support others toward achieving goals — whether in a formal leadership role or through informal influence.",
        hodMax: 5,
        hodScore: 5,
        hrdMax: 5,
        hrdScore: 0,
        type: "kpi",
      },
      {
        sl: 4,
        criteria: "Verbal & Written Communication",
        description: "The ability to communicate effectively & efficiently within the organization & out of organization.",
        hodMax: 5,
        hodScore: 5,
        hrdMax: 5,
        hrdScore: 0,
        type: "kpi",
      },
      {
        sl: 5,
        criteria: "Teamwork",
        description: "The ability to inspire subordinates & others with collaboration effort to achieve a common goal / complete a task.",
        hodMax: 5,
        hodScore: 5,
        hrdMax: 5,
        hrdScore: 0,
        type: "kpi",
      },
      {
        sl: 6,
        criteria: "Knowledge of law & SOP",
        description: "KPI evaluates how well an employee understands and applies relevant legal regulations, industry standards, and internal procedures in their daily work.",
        hodMax: 5,
        hodScore: 5,
        hrdMax: 5,
        hrdScore: 0,
        type: "kpi",
      },
      {
        sl: 7,
        criteria: "Dependability",
        description: "Delivers quality work on time, can be trusted to follow instructions accurately, requires minimal supervision, Is consistent and reliable in their duties, s accountable for their actions and mistakes",
        hodMax: 5,
        hodScore: 5,
        hrdMax: 5,
        hrdScore: 0,
        type: "kpi",
      },
      {
        sl: 8,
        criteria: "Independent Action",
        description: "Takes initiative, solves problems independently, makes decisions without needing step-by-step guidance, seeks solutions instead of waiting for instructions, accepts responsibility for actions taken.",
        hodMax: 5,
        hodScore: 5,
        hrdMax: 5,
        hrdScore: 0,
        type: "kpi",
      },
    ],
  },
  {
    empId: "2022120145",
    fullName: "Khairul Bashar Masum",
    photoUrl: "https://bpm.pakizaknit.com/Photo/EmpPicture/b314987a-a621-4906-9a64-2a18104da3e6.jpg",
    joiningDate: "01/12/2022",
    completedTenure: "3 Years 8 Months",
    designation: "Asst. Manager",
    department: "HR Team",
    lastIncAmount: 4500,
    lastIncDate: "01/01/2025",
    lastPromDate: "01/01/2025",
    grossSalary: 46500.0,
    basicSalary: 27900.0,
    effectiveDate: "01/01/2026",
    evalDate: "01/01/2026",
    evalPeriodFrom: "01/01/2025",
    evalPeriodTo: "31/12/2025",
    hodRec: "Excellent HR operations management and compliance execution.",
    hodPlanImprovement: "Advanced HR analytics certification.",
    hodComments: "Very proactive and trustworthy officer.",
    hodJd: "Managerial HR Operations.",
    hrStrength: "Great team coordination & compliance knowledge.",
    hrPlanImprovement: "Leadership coaching.",
    hrComments: "Strongly recommended for increment.",
    salaryIncProposed: 1000.0,
    promotionStatus: "Incremented",
    proposedDesignation: "Asst. Manager",
    totalJobExp: "3 Years 8 Months",
    education: "MBA in HR",
    pkclService: "3 Years 8 Months",
    softwareScore: 0,
    hodJobScore: 35,
    hodOtherScore: 36,
    hrdOtherScore: 12,
    showcaseDeduction: 0,
    totalMark: 83,
    grade: "A",
    criteriaScores: [
      {
        sl: 1,
        criteria: "Attendance",
        description: "Knowledge and understanding of all phases of the job and those requiring improved skills and/ or experience.",
        hodMax: 0,
        hodScore: 0,
        type: "auto",
      },
      {
        sl: 2,
        criteria: "Target Achievement",
        description: "context reffers to how much of a set goal or target has been accomplished within a specific time frame.",
        hodMax: 0,
        hodScore: 0,
        type: "auto",
      },
      {
        sl: 3,
        criteria: "Job Knowledge/Quality & efficiency",
        description: "context reffers to how much of a set goal or target has been accomplished within a specific time frame.",
        hodMax: 0,
        hodScore: 0,
        type: "manual",
      },
      {
        sl: 1,
        criteria: "Loyalty of company",
        description: "KPI measures how committed an employee is to the organization’s mission, values, and long-term success.",
        hodMax: 5,
        hodScore: 4,
        hrdMax: 5,
        hrdScore: 4,
        type: "kpi",
      },
      {
        sl: 2,
        criteria: "Decision Making/ Problem Solving",
        description: "Measures effectiveness in understanding problems and making timely practical decisions, best suited for the business.",
        hodMax: 5,
        hodScore: 4,
        hrdMax: 5,
        hrdScore: 4,
        type: "kpi",
      },
      {
        sl: 3,
        criteria: "Leadership",
        description: "influence, guide, and support others toward achieving goals — whether in a formal leadership role or through informal influence.",
        hodMax: 5,
        hodScore: 4,
        hrdMax: 5,
        hrdScore: 4,
        type: "kpi",
      },
      {
        sl: 4,
        criteria: "Verbal & Written Communication",
        description: "The ability to communicate effectively & efficiently within the organization & out of organization.",
        hodMax: 5,
        hodScore: 4,
        hrdMax: 5,
        hrdScore: 4,
        type: "kpi",
      },
      {
        sl: 5,
        criteria: "Teamwork",
        description: "The ability to inspire subordinates & others with collaboration effort to achieve a common goal / complete a task.",
        hodMax: 5,
        hodScore: 5,
        hrdMax: 5,
        hrdScore: 4,
        type: "kpi",
      },
      {
        sl: 6,
        criteria: "Knowledge of law & SOP",
        description: "KPI evaluates how well an employee understands and applies relevant legal regulations, industry standards, and internal procedures in their daily work.",
        hodMax: 5,
        hodScore: 4,
        hrdMax: 5,
        hrdScore: 3,
        type: "kpi",
      },
      {
        sl: 7,
        criteria: "Dependability",
        description: "Delivers quality work on time, can be trusted to follow instructions accurately, requires minimal supervision, Is consistent and reliable in their duties, s accountable for their actions and mistakes",
        hodMax: 5,
        hodScore: 4,
        hrdMax: 5,
        hrdScore: 4,
        type: "kpi",
      },
      {
        sl: 8,
        criteria: "Independent Action",
        description: "Takes initiative, solves problems independently, makes decisions without needing step-by-step guidance, seeks solutions instead of waiting for instructions, accepts responsibility for actions taken.",
        hodMax: 5,
        hodScore: 4,
        hrdMax: 5,
        hrdScore: 4,
        type: "kpi",
      },
    ],
  },
];

function KpiFinalReportPage() {
  const [records] = useState<AppraisalRecord[]>(mockAppraisalList);
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>("2019013884"); // Default to Javed Mia for instant preview!
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");

  const reportRef = useRef<HTMLDivElement>(null);

  const activeRecord = useMemo(() => {
    return records.find((r) => r.empId === selectedEmpId) || records[0];
  }, [records, selectedEmpId]);

  const computedTotalMark = useMemo(() => {
    if (!activeRecord) return 0;
    return (
      (activeRecord.softwareScore || 0) +
      (activeRecord.hodJobScore || 0) +
      (activeRecord.hodOtherScore || 0) +
      (activeRecord.hrdOtherScore || 0) -
      (activeRecord.showcaseDeduction || 0)
    );
  }, [activeRecord]);

  const computedGrade = useMemo(() => {
    if (computedTotalMark >= 91) return "A+";
    if (computedTotalMark >= 81) return "A";
    if (computedTotalMark >= 71) return "B";
    if (computedTotalMark >= 61) return "C";
    if (computedTotalMark >= 51) return "D";
    return "E";
  }, [computedTotalMark]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (departmentFilter !== "ALL" && r.department !== departmentFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.fullName.toLowerCase().includes(q) ||
          r.empId.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q) ||
          r.designation.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [records, departmentFilter, searchQuery]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 overflow-hidden font-sans print:bg-white print:h-auto print:overflow-visible">
      {/* Global CSS for A4 print optimization */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          body {
            background-color: #ffffff !important;
            font-family: "Times New Roman", Times, Georgia, serif !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .print-page-break-before {
            break-before: page !important;
            page-break-before: always !important;
          }
        }
      `}</style>

      {/* Hide Sidebar & Topbar during print */}
      <div className="print:hidden">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden print:overflow-visible">
        <div className="print:hidden">
          <Topbar />
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 print:p-0 print:overflow-visible">
          {/* Breadcrumb Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm print:hidden">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <Link to="/" className="hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
                <ChevronRight size={13} />
                <span>KPI Performance</span>
                <ChevronRight size={13} />
                <span className="font-medium text-slate-800">Assesment Final Report</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 font-sans">
                <Award className="size-5 text-emerald-600" />
                Employee Performance Evaluation & Appraisal Form Report (A4 Print Ready)
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {selectedEmpId && (
                <>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-all"
                  >
                    <Printer size={15} />
                    Print / Export A4 PDF
                  </button>
                  <button
                    onClick={() => setSelectedEmpId(null)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
                  >
                    <ArrowLeft size={15} />
                    Back to List
                  </button>
                </>
              )}
            </div>
          </div>

          {!selectedEmpId ? (
            /* ─────────────────────────────────────────────────────────────
               LIST VIEW OF APPRAISAL FINAL REPORTS
            ───────────────────────────────────────────────────────────── */
            <div className="space-y-5 print:hidden">
              {/* Filters Bar */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 flex-1">
                  <div className="relative flex-1 min-w-[240px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by Employee Name, ID, Designation..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                    />
                  </div>

                  <div className="w-48">
                    <SearchableSelect
                      options={[
                        { value: "ALL", label: "Dept: All Departments" },
                        { value: "Admin", label: "Admin" },
                        { value: "HR Team", label: "HR Team" },
                        { value: "Software Development", label: "Software Development" },
                      ]}
                      value={departmentFilter}
                      onChange={setDepartmentFilter}
                      placeholder="Filter Department"
                    />
                  </div>
                </div>
              </div>

              {/* Appraisal Records Data Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                    <FileText size={16} className="text-emerald-600" />
                    Assesment Final Reports Register ({filteredRecords.length})
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100/80 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[11px] font-semibold">
                        <th className="py-3 px-4">SL</th>
                        <th className="py-3 px-4">Emp ID</th>
                        <th className="py-3 px-4">Full Name</th>
                        <th className="py-3 px-4">Designation</th>
                        <th className="py-3 px-4">Department</th>
                        <th className="py-3 px-4">Gross Salary</th>
                        <th className="py-3 px-4">Grade</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700 font-medium">
                      {filteredRecords.map((item, idx) => (
                        <tr key={item.empId} className="hover:bg-emerald-50/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-slate-400">{idx + 1}</td>
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{item.empId}</td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={item.photoUrl}
                                alt={item.fullName}
                                className="size-8 rounded-full object-cover border border-slate-300"
                              />
                              <span className="font-bold text-slate-800">{item.fullName}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">{item.designation}</td>
                          <td className="py-3.5 px-4 text-slate-600">{item.department}</td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                            ৳{item.grossSalary.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge className="bg-blue-100 text-blue-800 border-blue-300 font-bold">
                              Grade {item.grade}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedEmpId(item.empId)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold transition-all shadow-xs"
                            >
                              <Eye size={14} />
                              View A4 Appraisal Form
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* ─────────────────────────────────────────────────────────────
               A4 PAGE PRINT FORM — TIMES NEW ROMAN FONT & CLEAN DATA LAYOUT
            ───────────────────────────────────────────────────────────── */
            activeRecord && (
              <div className="flex justify-center pb-10">
                {/* A4 Container Box */}
                <div
                  ref={reportRef}
                  className="bg-white p-6 sm:p-8 rounded-none border border-slate-400 shadow-xl w-[210mm] min-h-[297mm] text-black font-['Times_New_Roman',Times,'Georgia',serif] text-[11px] leading-snug space-y-3 print:p-0 print:border-none print:shadow-none print:w-full print:min-h-0"
                >
                  {/* Header Title Section with Company Logo & Employee Photo */}
                  <div className="relative pb-2 border-b border-black">
                    {/* Top Row: Logo & Photo */}
                    <div className="flex items-center justify-between mb-1">
                      {/* Company Logo / Emblem */}
                      <div className="flex items-center gap-2">
                        <div className="border border-black px-2 py-0.5 text-center font-bold tracking-widest text-xs uppercase bg-slate-50">
                          PAKIZA GROUP
                        </div>
                      </div>

                      {/* Header Center Title */}
                      <div className="text-center flex-1 mx-2">
                        <h2 className="text-sm font-bold uppercase tracking-tight text-black font-serif">
                          Employee Performance Evaluation & Appraisal Form
                        </h2>
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-black font-serif mt-0.5">
                          INCREMENT / PROMOTION/CONFIRMATION/ SPECIAL REVIEW
                        </h3>
                      </div>

                      {/* Employee Photo Slot */}
                      <div className="shrink-0">
                        <img
                          src={activeRecord.photoUrl}
                          alt={activeRecord.fullName}
                          className="w-16 h-20 object-cover border border-black p-0.5 bg-white shadow-xs"
                        />
                      </div>
                    </div>

                    <div className="text-right text-[10px] font-bold text-black pt-0.5 font-serif">
                      Date: <span className="underline">{activeRecord.effectiveDate}</span>
                    </div>
                  </div>

                  {/* Employee Information Table 1 */}
                  <table className="w-full border-collapse border border-black text-[11px] font-serif">
                    <tbody>
                      <tr className="border-b border-black">
                        <td className="w-24 p-1 font-bold bg-slate-100 border-r border-black">Full Name</td>
                        <td className="p-1 font-bold border-r border-black">{activeRecord.fullName}</td>
                        <td className="w-32 p-1 font-bold bg-slate-100 border-r border-black">Date of Joining</td>
                        <td className="p-1">{activeRecord.joiningDate}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-1 font-bold bg-slate-100 border-r border-black">Emp. ID</td>
                        <td className="p-1 font-bold border-r border-black">{activeRecord.empId}</td>
                        <td className="p-1 font-bold bg-slate-100 border-r border-black">Completed Year / Month</td>
                        <td className="p-1">{activeRecord.completedTenure}</td>
                      </tr>
                      <tr>
                        <td className="p-1 font-bold bg-slate-100 border-r border-black">Designation</td>
                        <td className="p-1 font-semibold border-r border-black">{activeRecord.designation}</td>
                        <td className="p-1 font-bold bg-slate-100 border-r border-black">Department</td>
                        <td className="p-1">{activeRecord.department}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Employee Compensation Information Table 2 */}
                  <table className="w-full border-collapse border border-black text-[11px] font-serif">
                    <tbody>
                      <tr className="border-b border-black">
                        <td className="w-36 p-1 font-bold bg-slate-100 border-r border-black">Amount of Last Increment</td>
                        <td className="p-1 border-r border-black">{activeRecord.lastIncAmount}</td>
                        <td className="w-32 p-1 font-bold bg-slate-100 border-r border-black">Date of Last Increment</td>
                        <td className="p-1 border-r border-black">{activeRecord.lastIncDate}</td>
                        <td className="w-32 p-1 font-bold bg-slate-100 border-r border-black">Date of Last Promotion</td>
                        <td className="p-1">{activeRecord.lastPromDate}</td>
                      </tr>
                      <tr>
                        <td className="p-1 font-bold bg-slate-100 border-r border-black">Gross Salary</td>
                        <td className="p-1 font-bold border-r border-black">{activeRecord.grossSalary.toFixed(2)}</td>
                        <td className="p-1 font-bold bg-slate-100 border-r border-black">Basic Salary</td>
                        <td className="p-1 border-r border-black">{activeRecord.basicSalary.toFixed(2)}</td>
                        <td className="p-1 font-bold bg-slate-100 border-r border-black">Salary Increment Effective Date</td>
                        <td className="p-1">{activeRecord.effectiveDate}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Evaluation Period Table */}
                  <table className="w-full border-collapse border border-black text-[11px] font-serif">
                    <tbody>
                      <tr>
                        <td className="w-24 p-1 font-bold bg-slate-100 border-r border-black">Evaluation Date</td>
                        <td className="p-1 border-r border-black">{activeRecord.evalDate}</td>
                        <td className="w-24 p-1 font-bold bg-slate-100 border-r border-black">Evaluation Period</td>
                        <td className="w-10 p-1 font-bold bg-slate-100 border-r border-black">From</td>
                        <td className="p-1 border-r border-black">{activeRecord.evalPeriodFrom}</td>
                        <td className="w-10 p-1 font-bold bg-slate-100 border-r border-black">To</td>
                        <td className="p-1">{activeRecord.evalPeriodTo}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Assessment Criteria Table */}
                  <table className="w-full border-collapse border border-black text-[10.5px] font-serif">
                    <thead>
                      <tr className="bg-slate-100 border-b border-black font-bold text-center">
                        <td rowSpan={2} className="w-6 p-1 border-r border-black">SL</td>
                        <td rowSpan={2} className="w-44 p-1 border-r border-black text-left">Assessment Criteria</td>
                        <td rowSpan={2} className="p-1 border-r border-black text-left">Description / Context</td>
                        <td colSpan={2} className="p-1 border-r border-black text-center border-b border-black">Department Head (HOD)</td>
                        <td colSpan={2} className="p-1 text-center border-b border-black">Human Resources (HRD)</td>
                      </tr>
                      <tr className="bg-slate-100 font-bold border-b border-black text-center text-[9.5px]">
                        <td className="w-12 p-0.5 border-r border-black bg-slate-200/50">Max</td>
                        <td className="w-14 p-0.5 border-r border-black bg-emerald-50 text-emerald-900 font-bold">Given Score</td>
                        <td className="w-12 p-0.5 border-r border-black bg-slate-200/50">Max</td>
                        <td className="w-14 p-0.5 bg-blue-50 text-blue-900 font-bold">Given Score</td>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black">
                      {/* Top 3 Auto / Manual Items */}
                      <tr className="border-b border-black bg-slate-50/80">
                        <td className="p-1 text-center border-r border-black font-bold">1</td>
                        <td className="p-1 font-bold border-r border-black">
                          Attendance
                          <div className="text-[9px] text-slate-600 font-normal italic mt-0.5">[System Auto Generated]</div>
                        </td>
                        <td className="p-1 border-r border-black text-slate-800">
                          Knowledge and understanding of all phases of the job and those requiring improved skills and/ or experience.
                        </td>
                        <td colSpan={4} className="p-1 text-center font-bold bg-slate-100/80 text-black border-r border-black">
                          Software Auto Generate : <span className="font-bold">0</span>
                        </td>
                      </tr>
                      <tr className="border-b border-black bg-slate-50/80">
                        <td className="p-1 text-center border-r border-black font-bold">2</td>
                        <td className="p-1 font-bold border-r border-black">
                          Target Achievement
                          <div className="text-[9px] text-slate-600 font-normal italic mt-0.5">[System Auto Generated]</div>
                        </td>
                        <td className="p-1 border-r border-black text-slate-800">
                          context reffers to how much of a set goal or target has been accomplished within a specific time frame.
                        </td>
                        <td colSpan={4} className="p-1 text-center font-bold bg-slate-100/80 text-black border-r border-black">
                          Software Auto Generate : <span className="font-bold">0</span>
                        </td>
                      </tr>
                      <tr className="border-b border-black bg-slate-50/80">
                        <td className="p-1 text-center border-r border-black font-bold">3</td>
                        <td className="p-1 font-bold border-r border-black">
                          Job Knowledge/Quality & efficiency
                          <div className="text-[9px] text-slate-600 font-normal italic mt-0.5">[System / Fixed Criteria]</div>
                        </td>
                        <td className="p-1 border-r border-black text-slate-800">
                          context reffers to how much of a set goal or target has been accomplished within a specific time frame.
                        </td>
                        <td colSpan={4} className="p-1 text-center font-bold bg-slate-100/80 text-black border-r border-black">
                          Manually only HOD : <span className="font-bold">0</span>
                        </td>
                      </tr>

                      {/* Criteria 1-8 */}
                      {activeRecord.criteriaScores
                        .filter((c) => c.type === "kpi")
                        .map((c) => (
                          <tr key={c.sl} className="border-b border-black">
                            <td className="p-1 text-center border-r border-black">{c.sl}</td>
                            <td className="p-1 font-bold border-r border-black">{c.criteria}</td>
                            <td className="p-1 border-r border-black text-slate-800">{c.description}</td>
                            <td className="p-1 text-center border-r border-black bg-slate-50/50">{c.hodMax}</td>
                            <td className="p-1 text-center font-bold border-r border-black bg-emerald-50/30 text-emerald-950">{c.hodScore}</td>
                            <td className="p-1 text-center border-r border-black bg-slate-50/50">{c.hrdMax || 5}</td>
                            <td className="p-1 text-center font-bold bg-blue-50/30 text-blue-950">{c.hrdScore || 0}</td>
                          </tr>
                        ))}

                      {/* Total Score Row */}
                      <tr className="bg-slate-100 font-bold border-t-2 border-black">
                        <td colSpan={3} className="p-1 text-right border-r border-black">Total Score</td>
                        <td className="p-1 text-center border-r border-black text-xs">40</td>
                        <td className="p-1 text-center text-xs font-bold border-r border-black text-emerald-900">{activeRecord.totalMark > 0 ? activeRecord.hodOtherScore : 32}</td>
                        <td className="p-1 text-center border-r border-black text-xs">40</td>
                        <td className="p-1 text-center text-xs font-bold text-blue-900">0</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Recommendation By Reporting HOD */}
                  <div className="border border-black overflow-hidden font-serif">
                    <div className="bg-slate-100 p-1 font-bold border-b border-black uppercase text-[10.5px]">
                      Recommendation By Reporting HOD
                    </div>
                    <table className="w-full text-[10.5px]">
                      <tbody>
                        <tr className="border-b border-black">
                          <td className="w-44 p-1 font-bold bg-slate-50 border-r border-black">HOD Recommendation</td>
                          <td className="p-1">{activeRecord.hodRec}</td>
                        </tr>
                        <tr className="border-b border-black">
                          <td className="p-1 font-bold bg-slate-50 border-r border-black">Plan For Improvement</td>
                          <td className="p-1">{activeRecord.hodPlanImprovement}</td>
                        </tr>
                        <tr className="border-b border-black">
                          <td className="p-1 font-bold bg-slate-50 border-r border-black">Special Comments</td>
                          <td className="p-1">{activeRecord.hodComments}</td>
                        </tr>
                        <tr>
                          <td className="p-1 font-bold bg-slate-50 border-r border-black">Existing & New JD</td>
                          <td className="p-1">{activeRecord.hodJd}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Recommendation By HRD */}
                  <div className="border border-black overflow-hidden font-serif print:break-before-page print-page-break-before">
                    <div className="bg-slate-100 p-1 font-bold border-b border-black uppercase text-[10.5px]">
                      Recommendation By HRD
                    </div>
                    <table className="w-full text-[10.5px]">
                      <tbody>
                        <tr className="border-b border-black">
                          <td className="w-44 p-1 font-bold bg-slate-50 border-r border-black">Strength</td>
                          <td className="p-1">{activeRecord.hrStrength}</td>
                        </tr>
                        <tr className="border-b border-black">
                          <td className="p-1 font-bold bg-slate-50 border-r border-black">Plan For Improvement</td>
                          <td className="p-1">{activeRecord.hrPlanImprovement}</td>
                        </tr>
                        <tr>
                          <td className="p-1 font-bold bg-slate-50 border-r border-black">Special Comments</td>
                          <td className="p-1">{activeRecord.hrComments}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Assessment Gradings & Average Assessment Point Tables (Side by Side) */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 font-serif">
                    {/* Left: Assessment Gradings Reference Table */}
                    <div className="md:col-span-7 space-y-2">
                      <table className="w-full border-collapse border border-black text-[9.5px]">
                        <thead>
                          <tr className="bg-slate-100 font-bold border-b border-black text-center">
                            <td className="p-1 border-r border-black">Marks</td>
                            <td className="p-1 border-r border-black">Grades</td>
                            <td className="p-1 border-r border-black">Standard</td>
                            <td className="p-1 text-left">Recommendation for Probationary & Confirmed Staff</td>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black">
                          <tr>
                            <td className="p-1 text-center border-r border-black">91-100</td>
                            <td className="p-1 text-center font-bold border-r border-black">A+</td>
                            <td className="p-1 text-center border-r border-black">Outstanding</td>
                            <td className="p-1">Promotion + Midterm Salary Enhancement</td>
                          </tr>
                          <tr>
                            <td className="p-1 text-center border-r border-black">81-90</td>
                            <td className="p-1 text-center font-bold border-r border-black">A</td>
                            <td className="p-1 text-center border-r border-black">Excellent</td>
                            <td className="p-1">Confirmation Highly Desired + Promotion & Yearly Salary Enhancement</td>
                          </tr>
                          <tr>
                            <td className="p-1 text-center border-r border-black">71-80</td>
                            <td className="p-1 text-center font-bold border-r border-black">B</td>
                            <td className="p-1 text-center border-r border-black">Very Good</td>
                            <td className="p-1">Confirmation Desired + Yearly Salary Enhancement</td>
                          </tr>
                          <tr>
                            <td className="p-1 text-center border-r border-black">61-70</td>
                            <td className="p-1 text-center font-bold border-r border-black">C</td>
                            <td className="p-1 text-center border-r border-black">Good</td>
                            <td className="p-1">Confirmation + Yearly Salary Enhancement</td>
                          </tr>
                          <tr>
                            <td className="p-1 text-center border-r border-black">51-60</td>
                            <td className="p-1 text-center font-bold border-r border-black">D</td>
                            <td className="p-1 text-center border-r border-black">Average</td>
                            <td className="p-1">Extension of Probation Period + Retain for Development</td>
                          </tr>
                          <tr>
                            <td className="p-1 text-center border-r border-black">&lt; 50</td>
                            <td className="p-1 text-center font-bold border-r border-black">E</td>
                            <td className="p-1 text-center border-r border-black">Not Acceptable</td>
                            <td className="p-1">Discontinuation</td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Sub-table for Tenure & Performance Standard */}
                      <div className="grid grid-cols-2 gap-2 text-[9.5px]">
                        <table className="w-full border-collapse border border-black">
                          <tbody>
                            <tr className="border-b border-black">
                              <td className="p-1 font-bold bg-slate-50 border-r border-black">Total Job Experience</td>
                              <td className="p-1">{activeRecord.totalJobExp}</td>
                            </tr>
                            <tr className="border-b border-black">
                              <td className="p-1 font-bold bg-slate-50 border-r border-black">Educational Qualification</td>
                              <td className="p-1">{activeRecord.education}</td>
                            </tr>
                            <tr>
                              <td className="p-1 font-bold bg-slate-50 border-r border-black">Length of Service at PKCL</td>
                              <td className="p-1">{activeRecord.pkclService}</td>
                            </tr>
                          </tbody>
                        </table>

                        <table className="w-full border-collapse border border-black text-center">
                          <thead>
                            <tr className="bg-slate-100 font-bold border-b border-black">
                              <td className="p-1 border-r border-black">Performance Standard with Score</td>
                              <td className="p-1">Grade</td>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-black">
                            <tr>
                              <td className="p-1 border-r border-black">Outstanding</td>
                              <td className="p-1 font-bold">A+</td>
                            </tr>
                            <tr>
                              <td className="p-1 border-r border-black">Excellent</td>
                              <td className="p-1 font-bold">A</td>
                            </tr>
                            <tr>
                              <td className="p-1 border-r border-black">Very Good</td>
                              <td className="p-1 font-bold">B</td>
                            </tr>
                            <tr>
                              <td className="p-1 border-r border-black">Good</td>
                              <td className="p-1 font-bold">C</td>
                            </tr>
                            <tr>
                              <td className="p-1 border-r border-black">Average</td>
                              <td className="p-1 font-bold">D</td>
                            </tr>
                            <tr>
                              <td className="p-1 border-r border-black">Not Acceptable</td>
                              <td className="p-1 font-bold">E</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Right: Average Assessment Point Box */}
                    <div className="md:col-span-5 border border-black p-1.5 space-y-1.5 text-[9.5px]">
                      <div className="font-bold text-center border-b border-black pb-0.5 uppercase">
                        Average Assessment Point
                      </div>
                      <table className="w-full border-collapse border border-black text-center">
                        <thead>
                          <tr className="bg-slate-100 font-bold border-b border-black">
                            <td className="p-0.5 border-r border-black">Software Auto Generate</td>
                            <td className="p-0.5 border-r border-black">Hod Job Related</td>
                            <td className="p-0.5 border-r border-black">HOD Others</td>
                            <td className="p-0.5">HRD Others</td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-1 border-r border-black">{activeRecord.softwareScore}</td>
                            <td className="p-1 border-r border-black">{activeRecord.hodJobScore}</td>
                            <td className="p-1 border-r border-black">{activeRecord.hodOtherScore}</td>
                            <td className="p-1">{activeRecord.hrdOtherScore}</td>
                          </tr>
                        </tbody>
                      </table>

                      <table className="w-full border-collapse border border-black text-[10.5px] mt-1">
                        <tbody>
                          <tr className="border-b border-black">
                            <td className="p-1 font-bold bg-slate-50 border-r border-black">Show Case Deduction</td>
                            <td className="p-1 text-center">{activeRecord.showcaseDeduction}</td>
                          </tr>
                          <tr className="border-b border-black">
                            <td className="p-1 font-bold bg-slate-50 border-r border-black">Total Mark</td>
                            <td className="p-1 font-bold text-center text-black text-xs">
                              {computedTotalMark}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-1 font-bold bg-slate-50 border-r border-black">Grade</td>
                            <td className="p-1 font-bold text-center text-black text-xs">
                              {computedGrade}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Proposed / Final Recommendation by Department Head, HR, Management, MD SIR */}
                  <div className="border border-black overflow-hidden font-serif">
                    <table className="w-full border-collapse text-[10px]">
                      <thead>
                        <tr className="bg-slate-100 font-bold border-b border-black text-center">
                          <td className="w-1/4 p-1 border-r border-black">Proposed by Department Head</td>
                          <td className="w-1/4 p-1 border-r border-black">Human Resources Department</td>
                          <td className="w-1/4 p-1 border-r border-black">Final Recommendation by Management</td>
                          <td className="w-1/4 p-1">Final Recommendation by MD SIR</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="align-top h-14">
                          <td className="p-1.5 border-r border-black space-y-0.5">
                            <div>
                              Salary Increment (Tk.): <span className="font-bold">{activeRecord.salaryIncProposed.toFixed(2)}</span>
                            </div>
                            <div>
                              Promotion – <span className="font-bold">{activeRecord.promotionStatus}</span>
                            </div>
                            <div>Designation: {activeRecord.proposedDesignation}</div>
                          </td>
                          <td className="p-1.5 border-r border-black"></td>
                          <td className="p-1.5 border-r border-black"></td>
                          <td className="p-1.5"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Signatures Block (4 Boxes) */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 text-[10.5px] font-serif">
                    <div className="text-center space-y-1">
                      <div className="border-t border-black pt-1 font-bold">Head Of Department</div>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="border-t border-black pt-1 font-bold">Checked By HR</div>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="border-t border-black pt-1 font-bold">Head Of Hr</div>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="border-t border-black pt-1 font-bold">Managing Director</div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
}
