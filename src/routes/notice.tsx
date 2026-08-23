import { useState, useEffect, useRef, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  Search,
  FileSpreadsheet,
  Printer,
  X,
  Plus,
  Settings,
  AlertCircle,
  Building,
  Save,
  Megaphone,
  Eye,
  Edit,
  Trash2,
  Download,
  Calendar,
  User,
  CheckCircle,
  BookOpen,
  Paperclip,
  Share2
} from "lucide-react";

export const Route = createFileRoute("/notice")({
  head: () => ({
    meta: [
      { title: "Notice Board — CRIPTON" },
      { name: "description", content: "Manage and publish company announcements." }
    ],
  }),
  component: NoticePage,
});

interface NoticeRecord {
  id: string;
  title: string;
  summary: string;
  details: string;
  category: "POLICY" | "HOLIDAY" | "MEETING" | "GENERAL";
  author: string;
  role: string;
  date: string; // Stored formatted e.g., "Aug 22, 2026"
  status: "Published" | "Draft";
  attachmentName?: string;
  circularNo: string;
}

const initialNoticesList: NoticeRecord[] = [
  {
    id: "ntc-1",
    title: "Test",
    summary: "Test notice checking circular configurations.",
    details: "<p>This is a test announcement to verify the formatting, layout, and editing functionalities of the Cripton Notice Board circular system.</p>",
    category: "POLICY",
    author: "Rajebul Hasan Rajon",
    role: "Placeholder Designation",
    date: "Aug 22, 2026",
    status: "Published",
    circularNo: "PSL/HR/2026/0012"
  },
  {
    id: "ntc-2",
    title: "Holiday Notice",
    summary: "Pakiza Software Limited issued a holiday notice for an office closure from Wednesday, August 5, 2026, to Saturday.",
    details: `
      <h2>Office Closure Announcement</h2>
      <p>Dear Employees,</p>
      <p>Please note that Pakiza Software Limited will remain closed from <strong>Wednesday, August 5, 2026</strong> to <strong>Saturday, August 8, 2026</strong> on account of the upcoming national public holidays.</p>
      <p>Key Instructions:</p>
      <ul>
        <li>All departments will resume normal operations on Sunday, August 9, 2026.</li>
        <li>Emergency support staff in operations should coordinate shift coverages with their respective supervisors.</li>
      </ul>
      <p>We wish you a safe and restful holiday.</p>
    `,
    category: "HOLIDAY",
    author: "Shishir",
    role: "Hrr",
    date: "Aug 16, 2026",
    status: "Published",
    attachmentName: "Holiday_Calendar_2026.pdf",
    circularNo: "PSL/HR/2026/0010"
  }
];

// Helper to convert date string "Aug 22, 2026" or YYYY-MM-DD to YYYY-MM-DD
function toYYYYMMDD(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }
  return d.toISOString().slice(0, 10);
}

// Helper to format YYYY-MM-DD to "Aug 22, 2026"
function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function NoticePage() {
  const [notices, setNotices] = useState<NoticeRecord[]>(initialNoticesList);
  
  // Modals Toggles
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  // Selected Record States
  const [selectedNotice, setSelectedNotice] = useState<NoticeRecord | null>(null);
  const [editNoticeId, setEditNoticeId] = useState<string | null>(null);

  // Form Field States
  const [title, setTitle] = useState("");
  const [circularNo, setCircularNo] = useState("");
  const [dateVal, setDateVal] = useState(""); // Stores "YYYY-MM-DD"
  const [category, setCategory] = useState<NoticeRecord["category"]>("GENERAL");
  const [status, setStatus] = useState<NoticeRecord["status"]>("Published");
  const [summary, setSummary] = useState("");
  const [detailsHtml, setDetailsHtml] = useState("");
  const [attachment, setAttachment] = useState<string | undefined>(undefined);

  // Filter States
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Jodit Rich text editor setup
  const [JoditEditorComponent, setJoditEditorComponent] = useState<any>(null);
  const [editorError, setEditorError] = useState<string | null>(null);
  const editorRef = useRef<any>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("jodit-react")
        .then((module) => {
          if (!module.default) {
            throw new Error("Module loaded, but Jodit default export was missing.");
          }
          setJoditEditorComponent(() => module.default);
        })
        .catch((err) => {
          console.error("Failed to load JoditEditor component dynamically:", err);
          setEditorError(err.message || String(err));
        });
    }
  }, []);

  const joditConfig = {
    readonly: false,
    placeholder: "Write notice details here...",
    toolbarAdaptive: false,
    buttons: [
      "bold", "italic", "underline", "strikethrough", "|",
      "fontsize", "brush", "paragraph", "|",
      "align", "ul", "ol", "|",
      "table", "link", "hr", "|",
      "undo", "redo", "eraser", "source"
    ],
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: "insert_clear_html",
    height: 320,
    theme: "default"
  };

  // Filter notice records list
  const filteredNotices = useMemo(() => {
    return notices.filter((n) => {
      if (categoryFilter !== "ALL" && n.category !== categoryFilter) return false;
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        return (
          n.title.toLowerCase().includes(q) ||
          n.summary.toLowerCase().includes(q) ||
          n.author.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [notices, categoryFilter, searchText]);

  // Open Form modal to Add New Notice
  const handleOpenAddModal = () => {
    setEditNoticeId(null);
    setTitle("");
    setCircularNo(`PSL/HR/2026/00${notices.length + 11}`);
    setDateVal(new Date().toISOString().slice(0, 10));
    setCategory("GENERAL");
    setStatus("Published");
    setSummary("");
    setDetailsHtml("");
    setAttachment(undefined);
    setIsFormModalOpen(true);
  };

  // Open Form modal to Edit existing Notice
  const handleOpenEditModal = (notice: NoticeRecord) => {
    setEditNoticeId(notice.id);
    setTitle(notice.title);
    setCircularNo(notice.circularNo);
    setDateVal(toYYYYMMDD(notice.date));
    setCategory(notice.category);
    setStatus(notice.status);
    setSummary(notice.summary);
    setDetailsHtml(notice.details);
    setAttachment(notice.attachmentName);
    setIsFormModalOpen(true);
  };

  // Delete Notice Record
  const handleDeleteNotice = (id: string) => {
    if (confirm("Are you sure you want to delete this notice?")) {
      setNotices(notices.filter((n) => n.id !== id));
      showToast("Notice deleted successfully.");
    }
  };

  // Open Circular Preview Modal
  const handleOpenPreviewModal = (notice: NoticeRecord) => {
    setSelectedNotice(notice);
    setIsViewModalOpen(true);
  };

  // Save/Submit Notice
  const handleSaveNotice = () => {
    if (!title.trim() || !summary.trim() || !circularNo.trim() || !dateVal) {
      alert("Notice Title, Reference Number, Notice Date and Summary are required fields.");
      return;
    }

    const formattedDisplayDate = formatDateDisplay(dateVal);

    if (editNoticeId) {
      // Edit
      setNotices((prev) =>
        prev.map((n) =>
          n.id === editNoticeId
            ? {
                ...n,
                title,
                circularNo,
                date: formattedDisplayDate,
                category,
                status,
                summary,
                details: detailsHtml,
                attachmentName: attachment,
              }
            : n
        )
      );
      showToast("Notice updated successfully.");
    } else {
      // Add
      const newNotice: NoticeRecord = {
        id: `ntc-${Date.now()}`,
        title,
        summary,
        details: detailsHtml,
        category,
        author: "Tahmid Afsar Shapno",
        role: "HR Director",
        date: formattedDisplayDate,
        status,
        attachmentName: attachment,
        circularNo: circularNo,
      };
      setNotices([newNotice, ...notices]);
      showToast("Notice published successfully.");
    }
    setIsFormModalOpen(false);
  };

  const handlePrintCircular = () => {
    window.print();
  };

  const handleExcelExport = () => {
    const headers = ["SL", "Notice Title", "Summary", "Category", "Author", "Date", "Status"];
    const rows = filteredNotices.map((row, index) => [
      (index + 1).toString(),
      row.title,
      row.summary,
      row.category,
      row.author,
      row.date,
      row.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Notices_Export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300 font-sans">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative print:p-0">
        <div className="print:hidden">
          <Topbar />
        </div>

        <div className="p-4 md:p-6 lg:p-8 space-y-6 print:p-0 print:m-0">
          {/* Page Header */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2.5" />
                <span className="text-foreground">Notice</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-2.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)] animate-pulse" />
                <h1 className="text-xl font-extrabold tracking-tight text-foreground">
                  Notice Board Circulars
                </h1>
              </div>
              <p className="text-xs text-muted-foreground mt-1 ml-5 font-semibold">
                Publish internal notices, policy updates, and holiday circulars
              </p>
            </div>
            
            <button
              onClick={handleOpenAddModal}
              className="h-10 px-5 bg-primary hover:bg-primary-glow text-white text-xs font-extrabold rounded-xl shadow-xs transition duration-200 uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="size-4" /> Add Notice
            </button>
          </div>

          {/* Toast Notification Alert */}
          {toastMessage && (
            <div className="fixed bottom-5 right-5 z-50 bg-[#1e293b] text-white border border-primary/30 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 print:hidden">
              <div className="size-2 rounded-full bg-primary animate-ping" />
              <span className="text-xs font-semibold">{toastMessage}</span>
              <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white transition">
                <X className="size-3.5" />
              </button>
            </div>
          )}

          {/* NOTICE DIRECTORY VIEW */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4 print:hidden">
            {/* Toolbar row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Search Bar */}
                <div className="w-full sm:w-64 relative">
                  <input
                    type="text"
                    placeholder="Search notices..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full h-9 pl-8.5 pr-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                </div>

                {/* Category selector */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-9 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                >
                  <option value="ALL">All Categories</option>
                  <option value="POLICY">Policy</option>
                  <option value="HOLIDAY">Holiday</option>
                  <option value="MEETING">Meeting</option>
                  <option value="GENERAL">General</option>
                </select>
              </div>

              {/* Action utilities */}
              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
                <button
                  onClick={handleExcelExport}
                  className="h-9 px-4 border border-border/30 rounded-xl text-xs font-bold bg-muted hover:bg-muted/70 text-emerald-600 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="size-3.5" />
                  <span>EXCEL</span>
                </button>
                <button
                  onClick={handlePrintCircular}
                  className="h-9 px-4 border border-border/30 rounded-xl text-xs font-bold bg-muted hover:bg-muted/70 text-sky-600 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="size-3.5" />
                  <span>PRINT</span>
                </button>
                <button
                  onClick={handlePrintCircular}
                  className="h-9 px-4 border border-border/30 rounded-xl text-xs font-bold bg-muted hover:bg-muted/70 text-rose-600 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Building className="size-3.5" />
                  <span>PDF</span>
                </button>
              </div>
            </div>

            {/* Directory Spreadsheet Grid Table */}
            <div className="overflow-x-auto border border-border/60 rounded-xl bg-card">
              <table className="w-full text-left border-collapse text-xs border border-border/60">
                <thead>
                  <tr className="bg-muted border-b border-border/70 text-muted-foreground/90 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3 w-12 text-center font-bold border-r border-border/60">SL</th>
                    <th className="p-3 w-28 text-center font-bold border-r border-border/60">Actions</th>
                    <th className="p-3 border-r border-border/60">Notice Title & Summary</th>
                    <th className="p-3 w-32 text-center border-r border-border/60">Category</th>
                    <th className="p-3 border-r border-border/60">Author & Role</th>
                    <th className="p-3 border-r border-border/60">Date</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-foreground font-semibold">
                  {filteredNotices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-muted-foreground/60 font-medium">
                        <AlertCircle className="size-8 text-muted-foreground/40 mx-auto mb-2" />
                        No notices published matching query criteria
                      </td>
                    </tr>
                  ) : (
                    filteredNotices.map((n, index) => (
                      <tr key={n.id} className="hover:bg-muted/30 transition duration-150">
                        <td className="p-3 text-center border-r border-border/50">{index + 1}</td>
                        <td className="p-3 border-r border-border/50">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenPreviewModal(n)}
                              title="View Circular"
                              className="p-1 text-sky-600 hover:text-sky-800 hover:bg-sky-500/10 rounded transition cursor-pointer"
                            >
                              <Eye className="size-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(n)}
                              title="Edit Notice"
                              className="p-1 text-amber-600 hover:text-amber-800 hover:bg-amber-500/10 rounded transition cursor-pointer"
                            >
                              <Edit className="size-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteNotice(n.id)}
                              title="Delete Notice"
                              className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-500/10 rounded transition cursor-pointer"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                        <td className="p-3 border-r border-border/50">
                          <div className="font-extrabold text-foreground text-sm">{n.title}</div>
                          <div className="text-[11px] text-muted-foreground font-medium mt-0.5 max-w-[420px] truncate">
                            {n.summary}
                          </div>
                        </td>
                        <td className="p-3 text-center border-r border-border/50">
                          <span
                            className={`px-3 py-0.5 rounded text-[9px] font-black tracking-wider uppercase ${
                              n.category === "POLICY"
                                ? "bg-sky-500/15 text-sky-600"
                                : n.category === "HOLIDAY"
                                ? "bg-emerald-500/15 text-emerald-600"
                                : n.category === "MEETING"
                                ? "bg-purple-500/15 text-purple-600"
                                : "bg-slate-500/15 text-slate-600"
                            }`}
                          >
                            {n.category}
                          </span>
                        </td>
                        <td className="p-3 border-r border-border/50">
                          <span className="font-extrabold block text-foreground">{n.author}</span>
                          <span className="text-[10px] text-muted-foreground block font-medium mt-0.5">{n.role}</span>
                        </td>
                        <td className="p-3 font-medium text-muted-foreground border-r border-border/50">{n.date}</td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                              n.status === "Published"
                                ? "bg-success/15 text-success"
                                : "bg-muted text-muted-foreground/70"
                            }`}
                          >
                            {n.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>Previous</span>
                <button className="size-7 bg-primary text-white text-[10px] font-black rounded-lg">1</button>
                <span>Next</span>
              </div>
              <div className="text-xs text-muted-foreground font-bold flex items-center gap-1">
                <FileSpreadsheet className="size-3.5" />
                <span>{filteredNotices.length} records</span>
              </div>
            </div>
          </div>

          {/* PRINT-ONLY BULLET CIRCULAR DISPLAY FOR GENERAL BROWSER PRINT TRIGGERS */}
          <div className="hidden print:block font-serif bg-white text-black p-8 max-w-3xl mx-auto border-2 border-double border-slate-400">
            {selectedNotice ? (
              <div className="space-y-6">
                <div className="text-center border-b pb-4">
                  <h1 className="text-3xl font-black uppercase tracking-widest font-sans">Pakiza Software Limited</h1>
                  <p className="text-[10px] uppercase font-bold tracking-widest mt-1">Human Resources & Administration Division</p>
                  <p className="text-xs text-slate-500 mt-0.5">Circular Circular / Announcement Circular</p>
                </div>

                <div className="flex justify-between text-xs font-bold border-b pb-2">
                  <div>Circular No: <span className="font-mono">{selectedNotice.circularNo}</span></div>
                  <div>Date: {selectedNotice.date}</div>
                </div>

                <div className="space-y-4 pt-4">
                  <h2 className="text-xl font-bold text-center underline font-sans">{selectedNotice.title}</h2>
                  <div 
                    className="text-sm leading-relaxed prose prose-sm max-w-none" 
                    dangerouslySetInnerHTML={{ __html: selectedNotice.details || selectedNotice.summary }} 
                  />
                </div>

                <div className="pt-12 border-t mt-12 flex justify-between items-end text-xs">
                  <div>
                    <div className="font-bold underline">Attachment Reference:</div>
                    <div className="text-slate-500">{selectedNotice.attachmentName || "None"}</div>
                  </div>
                  <div className="text-right">
                    <div className="h-10" />
                    <div className="font-bold">{selectedNotice.author}</div>
                    <div className="text-slate-500 font-sans">{selectedNotice.role}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8">No circular selected for printing.</div>
            )}
          </div>
        </div>
      </main>

      {/* --- ADD / EDIT NOTICE CONFIGURATION MODAL (HEIGHT CONSTRAINED & SCROLLABLE) --- */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200 print:hidden">
          <div className="bg-card border border-border/85 w-full max-w-5xl mx-4 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/50 pb-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Megaphone className="size-4.5 text-primary" />
                <h3 className="text-sm font-extrabold text-foreground">
                  {editNoticeId ? "Edit Company Notice" : "Publish New Notice"}
                </h3>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Form Grid */}
            <div className="space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-extrabold text-muted-foreground uppercase">
                    Notice Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter clear, descriptive title..."
                    className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:outline-none"
                  />
                </div>

                {/* Reference Number (Required) */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-extrabold text-muted-foreground uppercase">
                    Ref No <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={circularNo}
                    onChange={(e) => setCircularNo(e.target.value)}
                    placeholder="e.g. PSL/HR/2026/0010"
                    className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:outline-none"
                  />
                </div>

                {/* Notice Publish Date (Required) */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-extrabold text-muted-foreground uppercase">
                    Notice Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={dateVal}
                    onChange={(e) => setDateVal(e.target.value)}
                    className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category (Notice Type - dropdown) */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-extrabold text-muted-foreground uppercase">
                    Notice Type (Category) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as NoticeRecord["category"])}
                    className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:outline-none cursor-pointer"
                  >
                    <option value="GENERAL">General Announcement</option>
                    <option value="POLICY">Policy Guideline</option>
                    <option value="HOLIDAY">Holiday Closure</option>
                    <option value="MEETING">Meeting Minutes</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-extrabold text-muted-foreground uppercase">
                    Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as NoticeRecord["status"])}
                    className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:outline-none cursor-pointer"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Short Summary */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-extrabold text-muted-foreground uppercase">
                  Short Summary <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Brief high-level summary of the notice circular..."
                  className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:outline-none"
                />
              </div>

              {/* Rich Text Editor */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-extrabold text-muted-foreground uppercase">
                  Notice Details <span className="text-rose-500">*</span>
                </label>
                <div className="border border-border/80 rounded-xl overflow-hidden min-h-[320px] bg-card">
                  {JoditEditorComponent ? (
                    <JoditEditorComponent
                      ref={editorRef}
                      value={detailsHtml}
                      config={joditConfig}
                      onBlur={(newContent: string) => setDetailsHtml(newContent)}
                    />
                  ) : (
                    <div className="h-72 flex items-center justify-center text-xs text-muted-foreground animate-pulse">
                      Loading Rich Editor Component...
                    </div>
                  )}
                </div>
              </div>

              {/* Attachment selector */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-extrabold text-muted-foreground uppercase">
                  Attachment Reference (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="None selected"
                    value={attachment || ""}
                    readOnly
                    className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold flex-1 outline-none text-muted-foreground"
                  />
                  <button
                    onClick={() => setAttachment("Official_Memo_Directive_2026.pdf")}
                    className="h-9 px-4 border border-border/40 rounded-lg text-xs font-bold hover:bg-muted transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Paperclip className="size-3.5 text-muted-foreground" /> Choose file
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/50 flex-shrink-0">
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="h-9 px-5 bg-card hover:bg-muted text-foreground border border-border rounded-xl text-xs font-bold transition cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={handleSaveNotice}
                className="h-9 px-5 bg-primary hover:bg-primary-glow text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="size-3.5" /> PUBLISH NOTICE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- PREMIUM PREVIEW MODAL (HEIGHT CONSTRAINED & SCROLLABLE) --- */}
      {isViewModalOpen && selectedNotice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200 print:hidden font-sans">
          <div className="bg-card border border-border/80 w-full max-w-4xl mx-4 rounded-2xl p-6 shadow-2xl flex flex-col gap-6 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            {/* Modal Actions Header */}
            <div className="flex items-center justify-between border-b border-border/40 pb-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <BookOpen className="size-4.5 text-primary" />
                <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Notice Circular Preview</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintCircular}
                  className="h-8.5 px-3 bg-muted hover:bg-muted/70 text-foreground border border-border/20 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="size-3.5 text-muted-foreground" /> Print
                </button>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Circular Paper Sheet layout (Lucrative Professional Template) */}
            <div className="bg-[#fcfcfc] dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl p-10 md:p-14 shadow-2xl space-y-6 relative overflow-hidden text-black dark:text-white leading-relaxed font-sans flex-shrink-0">
              {/* Top Corporate Gradient Accent Bar */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary/10 via-primary to-primary/10" />
              
              {/* Official Corporate Header Letterhead */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 dark:border-slate-100 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-black shadow-md">
                      P
                    </div>
                    <span className="font-extrabold text-xl uppercase tracking-wider text-slate-800 dark:text-slate-100">
                      PAKIZA GROUP
                    </span>
                  </div>
                  <div className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-10">
                    Pakiza Software Limited • HR & Operations Division
                  </div>
                </div>
                <div className="text-right text-[10px] font-semibold text-slate-500 dark:text-slate-400 leading-relaxed font-mono">
                  <div>Circular Registry Circular</div>
                  <div>Uttara Office, Dhaka, BD</div>
                  <div>info@pakizagroup.com</div>
                </div>
              </div>

              {/* Document Classification & Memo Meta */}
              <div className="text-center py-2">
                <div className="inline-block text-[11px] font-black tracking-widest text-primary bg-primary/10 px-4 py-1 rounded-full uppercase border border-primary/20">
                  OFFICIAL DIRECTIVE CIRCULAR
                </div>
              </div>

              {/* Reference and Date Details bar */}
              <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Ref No:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-100 font-extrabold">{selectedNotice.circularNo}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Date:</span>
                  <span className="text-slate-800 dark:text-slate-100 font-extrabold">{selectedNotice.date}</span>
                </div>
              </div>

              {/* Circular Title (middle aligned, big font) */}
              <div className="text-center py-4">
                <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white uppercase tracking-wide leading-tight font-sans">
                  {selectedNotice.title}
                </h1>
                <div className="h-[2px] w-24 bg-primary mx-auto mt-3" />
              </div>

              {/* circular body content */}
              <div className="pt-4 text-slate-800 dark:text-slate-200 text-sm leading-relaxed min-h-[220px]">
                <div 
                  className="prose prose-slate dark:prose-invert max-w-none prose-sm font-sans" 
                  dangerouslySetInnerHTML={{ __html: selectedNotice.details || `<p>${selectedNotice.summary}</p>` }} 
                />
              </div>

              {/* Attachment alert box */}
              {selectedNotice.attachmentName && (
                <div className="bg-muted/40 border border-border/30 rounded-xl p-3.5 flex items-center justify-between text-xs mt-8">
                  <div className="flex items-center gap-2">
                    <Paperclip className="size-4 text-slate-400" />
                    <div>
                      <div className="font-extrabold text-slate-700 dark:text-slate-300">Reference Attachment circular</div>
                      <div className="text-slate-500 text-[10px] font-semibold mt-0.5">{selectedNotice.attachmentName}</div>
                    </div>
                  </div>
                  <button className="h-8.5 px-3.5 bg-card hover:bg-muted text-foreground border border-border/50 rounded-lg transition font-bold flex items-center gap-1 cursor-pointer">
                    <Download className="size-3.5" /> Download
                  </button>
                </div>
              )}

              {/* Corporate digital stamp and signatures */}
              <div className="pt-10 border-t border-slate-200 dark:border-slate-800 mt-10 flex justify-between items-end text-xs text-slate-600 dark:text-slate-400">
                <div className="text-[10px] leading-relaxed">
                  <div className="font-extrabold uppercase text-slate-400">Security Clearance</div>
                  <div className="font-mono text-slate-400 mt-0.5">#SEC-NTC-{selectedNotice.id.toUpperCase()}</div>
                </div>
                
                {/* Signature box */}
                <div className="text-right flex flex-col items-end">
                  <div className="text-slate-500 italic mb-2 text-[11px] font-semibold">By Order of the Management,</div>
                  <div className="font-serif italic text-lg text-primary/80 tracking-wide pr-4">Tahmid Afsar</div>
                  <div className="h-[1px] w-28 bg-slate-300 dark:bg-slate-700 my-1" />
                  <div className="font-black text-slate-800 dark:text-slate-100">{selectedNotice.author}</div>
                  <div className="text-slate-500 text-[10px] font-semibold">{selectedNotice.role}</div>
                </div>
              </div>
            </div>

            {/* Close footer button */}
            <div className="flex justify-end flex-shrink-0">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="h-9 px-5 bg-muted hover:bg-muted/70 text-foreground font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Close circular
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
