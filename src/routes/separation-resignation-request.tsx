import { useState, useMemo, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { ResignationApprovalModal } from "@/components/ssp/ResignationApprovalModal";
import {
  ChevronRight,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  X,
  Send,
  Mail,
  Paperclip,
  UserCheck,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  ChevronDown,
  Check,
  Printer,
  FileText,
  Building,
  User,
  Calendar,
  Award,
} from "lucide-react";

export const Route = createFileRoute("/separation-resignation-request")({
  head: () => ({
    meta: [
      { title: "Resignation Request — Separation Module | CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Employee self-service resignation portal with searchable separation reasons and rich text resignation letter editor.",
      },
    ],
  }),
  component: ResignationRequestPage,
});

export const COMPREHENSIVE_SEPARATION_REASONS = [
  "Better Career Opportunity / Higher Compensation",
  "Personal & Family Responsibilities",
  "Relocation / Moving to Different City or Country",
  "Higher Studies / Further Education & Research",
  "Health & Medical Issues",
  "Career Pivot / Change of Industry or Profession",
  "Work-Life Balance & Long Commute Distance",
  "Contract Completion / Mutual Separation",
  "Retirement / Superannuation",
  "Entrepreneurship / Starting Own Business",
  "Spouse / Family Relocation",
  "Childcare & Domestic Care Transition",
  "Dissatisfaction with Current Role & Scope",
  "Workplace Culture & Management Alignment",
  "Company Restructuring / Department Changes",
  "Maternity / Paternity Leave Transition",
  "Sabbatical / Extended Personal Career Break",
  "Other Personal Reasons",
];

export interface ResignationItem {
  id: string;
  empId: string;
  empName: string;
  department: string;
  designation: string;
  joiningDate: string;
  subject: string;
  noticeDate: string;
  intendedLastWorkingDate: string;
  noticePeriodDays: number;
  reason: string;
  letterBody: string;
  attachedFileName?: string;
  status: "Submitted (Pending Clearance)" | "Notice Period Active" | "Cleared & Released";
  submittedDate: string;
}

const loggedInEmployee = {
  empId: "2021051280",
  empName: "Farhana Akter",
  department: "Human Resource & Admin",
  designation: "HR Officer",
  joiningDate: "01/06/2021",
};

const initialResignations: ResignationItem[] = [
  {
    id: "RES-2026-041",
    empId: "2021051280",
    empName: "Farhana Akter",
    department: "Human Resource & Admin",
    designation: "HR Officer",
    joiningDate: "01/06/2021",
    subject: "Formal Resignation Letter - Farhana Akter (2021051280)",
    noticeDate: "15/08/2026",
    intendedLastWorkingDate: "15/09/2026",
    noticePeriodDays: 30,
    reason: "Better Career Opportunity / Higher Compensation",
    letterBody: `Dear Management & HR Team,\n\nPlease accept this letter as formal notification that I am resigning from my position as HR Officer at Pakiza Knit Composite Ltd. My last working day will be September 15, 2026.\n\nKey handover points:\n• Complete personnel audit documentation handed over\n• Employee file verification records updated\n• Active recruitment queues transitioned\n\nThank you for the opportunities during my time with the organization.\n\nSincerely,\nFarhana Akter\nHR Officer (Emp ID: 2021051280)`,
    attachedFileName: "Farhana_Signed_Resignation_Letter.pdf",
    status: "Notice Period Active",
    submittedDate: "15/08/2026 09:30 AM",
  },
];

function ResignationRequestPage() {
  const [resignations, setResignations] = useState<ResignationItem[]>(initialResignations);
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  // Large Email-Style Composer Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjectInput, setSubjectInput] = useState(`Formal Resignation Letter - ${loggedInEmployee.empName} (${loggedInEmployee.empId})`);
  const [noticeDateInput, setNoticeDateInput] = useState(new Date().toISOString().slice(0, 10));
  const [lastWorkingDateInput, setLastWorkingDateInput] = useState("");
  
  // Searchable Reasons Dropdown state
  const [reasonInput, setReasonInput] = useState(COMPREHENSIVE_SEPARATION_REASONS[0]);
  const [isReasonDropdownOpen, setIsReasonDropdownOpen] = useState(false);
  const [reasonSearchTerm, setReasonSearchTerm] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const defaultLetterTemplate = `Dear Management & HR Team,

Please accept this letter as formal notification that I am resigning from my position as ${loggedInEmployee.designation} at Pakiza Knit Composite Ltd. 

I request my intended last working day to be [Select Date Above], fulfilling my standard 30-day notice period requirements.

Key Handover Highlights:
• Transition of active projects and key tasks
• Handover of file documentation and departmental assets
• Support in training designated replacement staff

I am truly grateful for the professional growth and supportive environment I have experienced since joining on ${loggedInEmployee.joiningDate}.

Thank you once again for the opportunities during my time with the organization.

Sincerely,
${loggedInEmployee.empName}
${loggedInEmployee.designation}
Employee ID: ${loggedInEmployee.empId}`;

  const [letterBodyInput, setLetterBodyInput] = useState(defaultLetterTemplate);
  const [attachedFileName, setAttachedFileName] = useState("");

  // View Modal
  const [viewItem, setViewItem] = useState<ResignationItem | null>(null);

  const filteredReasons = useMemo(() => {
    return COMPREHENSIVE_SEPARATION_REASONS.filter((r) =>
      r.toLowerCase().includes(reasonSearchTerm.toLowerCase())
    );
  }, [reasonSearchTerm]);

  const filteredItems = useMemo(() => {
    return resignations.filter((item) => {
      const q = searchTerm.toLowerCase().trim();
      return (
        !q ||
        item.subject.toLowerCase().includes(q) ||
        item.reason.toLowerCase().includes(q) ||
        item.intendedLastWorkingDate.includes(q)
      );
    });
  }, [resignations, searchTerm]);

  const applyTextFormatting = (type: "bold" | "italic" | "underline" | "bullet" | "number") => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selectedText = letterBodyInput.substring(start, end);

    let replacement = "";
    if (type === "bold") {
      replacement = `**${selectedText || "bold text"}**`;
    } else if (type === "italic") {
      replacement = `*${selectedText || "italic text"}*`;
    } else if (type === "underline") {
      replacement = `<u>${selectedText || "underlined text"}</u>`;
    } else if (type === "bullet") {
      replacement = `\n• ${selectedText || "Bullet point item"}`;
    } else if (type === "number") {
      replacement = `\n1. ${selectedText || "Numbered list item"}`;
    }

    const newText =
      letterBodyInput.substring(0, start) + replacement + letterBodyInput.substring(end);
    setLetterBodyInput(newText);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };

  const handleOpenComposer = () => {
    setSubjectInput(`Formal Resignation Letter - ${loggedInEmployee.empName} (${loggedInEmployee.empId})`);
    setNoticeDateInput(new Date().toISOString().slice(0, 10));
    setLastWorkingDateInput("");
    setReasonInput(COMPREHENSIVE_SEPARATION_REASONS[0]);
    setReasonSearchTerm("");
    setLetterBodyInput(defaultLetterTemplate);
    setAttachedFileName("");
    setIsModalOpen(true);
  };

  const handleSendResignation = () => {
    if (!lastWorkingDateInput) {
      alert("Please select your Intended Last Working Date!");
      return;
    }

    if (!letterBodyInput.trim()) {
      alert("Please write your Resignation Letter Body text!");
      return;
    }

    const newRes: ResignationItem = {
      id: `RES-2026-${String(resignations.length + 42).padStart(3, "0")}`,
      empId: loggedInEmployee.empId,
      empName: loggedInEmployee.empName,
      department: loggedInEmployee.department,
      designation: loggedInEmployee.designation,
      joiningDate: loggedInEmployee.joiningDate,
      subject: subjectInput,
      noticeDate: noticeDateInput,
      intendedLastWorkingDate: lastWorkingDateInput,
      noticePeriodDays: 30,
      reason: reasonInput,
      letterBody: letterBodyInput,
      attachedFileName: attachedFileName || "Resignation_Notice.pdf",
      status: "Submitted (Pending Clearance)",
      submittedDate: new Date().toLocaleString(),
    };

    setResignations([newRes, ...resignations]);
    setToastMsg(`Your Resignation Request has been submitted successfully.`);
    setTimeout(() => setToastMsg(""), 5000);
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-sans font-['Inter'] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Topbar />

        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-500">Separation</span>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Resignation Request
            </span>
          </div>

          <button
            type="button"
            onClick={handleOpenComposer}
            className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2 transition-all uppercase tracking-wider"
          >
            <Mail size={16} />
            <span>Compose Resignation Request</span>
          </button>
        </div>

        {/* Workspace */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {toastMsg && (
            <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-sm animate-fadeIn text-xs font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600" />
                {toastMsg}
              </div>
              <button onClick={() => setToastMsg("")} className="font-bold text-emerald-600 hover:underline">
                Dismiss
              </button>
            </div>
          )}

          {/* Logged In Employee Banner */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-black text-sm flex items-center justify-center border border-blue-200">
                FA
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {loggedInEmployee.empName} <span className="font-mono text-xs text-slate-400">({loggedInEmployee.empId})</span>
                </div>
                <div className="text-xs text-slate-500">
                  {loggedInEmployee.designation} • {loggedInEmployee.department} | Joining: {loggedInEmployee.joiningDate}
                </div>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 font-bold border border-blue-200">
                <UserCheck size={14} /> Employee Self-Service Portal
              </span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <label className="text-slate-500 font-medium">Search My Requests:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search subject, reason, date..."
                className="h-8 px-2.5 w-72 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="text-slate-400 italic">
              Showing submitted resignation records
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs min-w-[900px]">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                    <th className="py-3 px-3">Request ID</th>
                    <th className="py-3 px-3">Subject</th>
                    <th className="py-3 px-3">Notice Date</th>
                    <th className="py-3 px-3">Intended Last Working Day</th>
                    <th className="py-3 px-3">Separation Reason</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-slate-100">{item.id}</td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">{item.subject}</td>
                      <td className="py-3 px-3 font-medium">{item.noticeDate}</td>
                      <td className="py-3 px-3 font-bold text-blue-700 dark:text-blue-400">{item.intendedLastWorkingDate}</td>
                      <td className="py-3 px-3">{item.reason}</td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            item.status === "Cleared & Released"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : item.status === "Notice Period Active"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => setViewItem(item)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 mx-auto shadow-xs"
                        >
                          <Eye size={13} /> View Letter
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* LARGE EMAIL-STYLE RESIGNATION COMPOSER MODAL (max-w-4xl) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-fadeIn font-['Inter']">
            
            {/* Header */}
            <div className="px-6 py-3.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold text-sm">
                <Mail size={18} className="text-blue-600" />
                <span>Compose Resignation Notice &amp; Letter</span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Inputs */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              
              {/* Employee Metadata */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3 font-medium">
                <div>
                  <span className="text-[11px] text-slate-400 block">Employee ID</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-slate-100">{loggedInEmployee.empId}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Employee Name</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{loggedInEmployee.empName}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Department</span>
                  <span className="text-slate-700 dark:text-slate-300">{loggedInEmployee.department}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Designation</span>
                  <span className="text-slate-700 dark:text-slate-300">{loggedInEmployee.designation}</span>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  Subject Line <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  className="w-full h-9 px-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Notice Date & Last Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-medium text-slate-600 dark:text-slate-400">Notice Date</label>
                  <input
                    type="date"
                    value={noticeDateInput}
                    onChange={(e) => setNoticeDateInput(e.target.value)}
                    className="w-full h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    Intended Last Working Day <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={lastWorkingDateInput}
                    onChange={(e) => setLastWorkingDateInput(e.target.value)}
                    className="w-full h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 font-bold outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* SEARCHABLE SEPARATION REASON COMBOBOX */}
              <div className="space-y-1 relative">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  Separation Reason (Search &amp; Select) <span className="text-rose-500">*</span>
                </label>
                
                <div
                  onClick={() => setIsReasonDropdownOpen(!isReasonDropdownOpen)}
                  className="w-full h-9 px-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-between cursor-pointer font-semibold text-slate-800 dark:text-slate-100"
                >
                  <span className="truncate">{reasonInput}</span>
                  <ChevronDown size={16} className="text-slate-400" />
                </div>

                {isReasonDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-xl p-2 space-y-2 max-h-60 overflow-y-auto">
                    <div className="relative sticky top-0 bg-white dark:bg-slate-800 pt-1 pb-2">
                      <input
                        type="text"
                        value={reasonSearchTerm}
                        onChange={(e) => setReasonSearchTerm(e.target.value)}
                        placeholder="Type to filter reasons..."
                        autoFocus
                        className="w-full h-8 pl-8 pr-2.5 border border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Search size={14} className="absolute left-2.5 top-3.5 text-slate-400" />
                    </div>

                    <div className="space-y-0.5">
                      {filteredReasons.length === 0 ? (
                        <div className="py-2 text-center text-slate-400 italic">No matching reasons found</div>
                      ) : (
                        filteredReasons.map((r) => {
                          const isSelected = r === reasonInput;
                          return (
                            <button
                              key={r}
                              type="button"
                              onClick={() => {
                                setReasonInput(r);
                                setIsReasonDropdownOpen(false);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                                isSelected
                                  ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold"
                                  : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                              }`}
                            >
                              <span>{r}</span>
                              {isSelected && <Check size={14} className="text-blue-600" />}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* RICH TEXT FORMATTING TOOLBAR & LETTER BODY EDITOR */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    Formal Resignation Letter Body <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Inter Font • Rich Text Controls</span>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-t-lg border border-slate-300 dark:border-slate-700 border-b-0">
                  <button
                    type="button"
                    onClick={() => applyTextFormatting("bold")}
                    title="Bold (**text**)"
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold flex items-center gap-1 text-xs"
                  >
                    <Bold size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => applyTextFormatting("italic")}
                    title="Italic (*text*)"
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-italic flex items-center gap-1 text-xs"
                  >
                    <Italic size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => applyTextFormatting("underline")}
                    title="Underline (<u>text</u>)"
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1 text-xs"
                  >
                    <UnderlineIcon size={14} />
                  </button>

                  <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

                  <button
                    type="button"
                    onClick={() => applyTextFormatting("bullet")}
                    title="Bullet List"
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1 text-xs"
                  >
                    <List size={14} />
                    <span>Bullet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyTextFormatting("number")}
                    title="Numbered List"
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1 text-xs"
                  >
                    <ListOrdered size={14} />
                    <span>Numbered</span>
                  </button>
                </div>

                <textarea
                  ref={textareaRef}
                  rows={10}
                  value={letterBodyInput}
                  onChange={(e) => setLetterBodyInput(e.target.value)}
                  className="w-full p-3.5 border border-slate-300 dark:border-slate-700 rounded-b-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-sans font-['Inter'] text-xs leading-relaxed outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Attachment Input */}
              <div className="space-y-1">
                <label className="block font-medium text-slate-600 dark:text-slate-400">
                  Attach Signed Resignation Copy (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={attachedFileName}
                    onChange={(e) => setAttachedFileName(e.target.value)}
                    placeholder="e.g. Signed_Resignation_Letter.pdf"
                    className="flex-1 h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-xs"
                  />
                  <label className="h-8 px-3 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer">
                    <Paperclip size={14} /> Browse
                  </label>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="text-[11px] text-slate-400 italic">
                Submitting will notify HR &amp; initiate multi-departmental clearance workflows
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 font-bold text-xs"
                >
                  Discard Draft
                </button>
                <button
                  type="button"
                  onClick={handleSendResignation}
                  className="px-5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Send size={15} /> Submit Resignation Request
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ULTRA-LUCRATIVE EXECUTIVE RESIGNATION LETTER VIEW MODAL */}
      <ResignationApprovalModal
        open={!!viewItem}
        onOpenChange={(open) => !open && setViewItem(null)}
        data={viewItem as any}
        onApprove={(id) => {
          setResignations((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, status: "Cleared & Released" } : item
            )
          );
          if (viewItem && viewItem.id === id) {
            setViewItem({ ...viewItem, status: "Cleared & Released" });
          }
        }}
        onReject={(id) => {
          setResignations((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, status: "Rejected" as any } : item
            )
          );
          if (viewItem && viewItem.id === id) {
            setViewItem({ ...viewItem, status: "Rejected" });
          }
        }}
      />
    </div>
  );
}
