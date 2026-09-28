import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DoorOpen,
  Calendar,
  Clock,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Clock3,
  ChevronRight,
  Plus,
  Eye,
  Pencil,
  FileSpreadsheet,
  Printer,
  FileText,
  X,
  SearchIcon,
  RotateCcw,
  User,
  FileCheck,
  MessageSquare,
  Check,
  ShieldCheck,
  Laptop,
  Tv,
  Wifi,
  Mic,
  Video,
  History,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface ScheduleHistory {
  changed: boolean;
  changedBy?: string;
  changedAt?: string;
  original: {
    meetingRoom: string;
    date: string;
    startTime: string;
    endTime: string;
  };
  updated: {
    meetingRoom: string;
    date: string;
    startTime: string;
    endTime: string;
  };
}

interface ResponsiblePerson {
  name: string;
  designation: string;
  department: string;
  company: string;
  phone: string;
}

interface BookingItem {
  id: string;
  meetingRoom: string;
  date: string;
  startTime: string;
  endTime: string;
  agenda: string;
  totalParticipants: number;
  responsibleDepts: string;
  responsiblePersons: ResponsiblePerson[];
  status: "Pending" | "Approved" | "Rejected" | "Completed";
  scheduleHistory?: ScheduleHistory;
}

const INITIAL_BOOKINGS: BookingItem[] = [
  {
    id: "CRB-1001",
    meetingRoom: "Conference Room 1",
    date: "2026-09-14",
    startTime: "17:30:00",
    endTime: "18:30:00",
    agenda: "Monthly ERP System Architecture & UI Progress Review",
    totalParticipants: 10,
    responsibleDepts: "WEB-Team (Business Innovation)",
    status: "Pending",
    responsiblePersons: [
      {
        name: "Md. Anik Islam",
        designation: "Deputy Manager",
        department: "WEB-Team",
        company: "Pakiza Software Limited",
        phone: "01324726844",
      },
      {
        name: "Tahmid Afsar Shapno",
        designation: "Asst. Manager",
        department: "Project Resource",
        company: "Pakiza Software Limited",
        phone: "01700000000",
      },
    ],
  },
  {
    id: "CRB-1002",
    meetingRoom: "Executive Boardroom",
    date: "2026-09-14",
    startTime: "10:00:00",
    endTime: "11:30:00",
    agenda: "Q3 Strategic HR & Payroll Operations",
    totalParticipants: 15,
    responsibleDepts: "HR & Talent Management",
    status: "Approved",
    scheduleHistory: {
      changed: true,
      changedBy: "Rajebul Hasan Rajon (Facility Manager)",
      changedAt: "14 Sep 2026 · 09:30 AM",
      original: {
        meetingRoom: "Conference Room 1",
        date: "2026-09-14",
        startTime: "09:00:00",
        endTime: "10:30:00",
      },
      updated: {
        meetingRoom: "Executive Boardroom",
        date: "2026-09-14",
        startTime: "10:00:00",
        endTime: "11:30:00",
      },
    },
    responsiblePersons: [
      {
        name: "Md. Zahidul Islam",
        designation: "Chief Operating Officer",
        department: "Executive Committee",
        company: "Pakiza Software Limited",
        phone: "01811112222",
      },
    ],
  },
  {
    id: "CRB-1003",
    meetingRoom: "Innovation Lab",
    date: "2026-09-15",
    startTime: "14:00:00",
    endTime: "15:30:00",
    agenda: "Merchandising Buyer Briefing & Sample Review",
    totalParticipants: 8,
    responsibleDepts: "Merchandising",
    status: "Pending",
    responsiblePersons: [
      {
        name: "Farhana Ahmed",
        designation: "Senior Merchandiser",
        department: "Merchandising",
        company: "Pakiza Knit Group",
        phone: "01922223333",
      },
    ],
  },
  {
    id: "CRB-1004",
    meetingRoom: "Conference Room A",
    date: "2026-09-14",
    startTime: "09:30:00",
    endTime: "11:00:00",
    agenda: "Accounts & Financial Audit Settlement",
    totalParticipants: 6,
    responsibleDepts: "Accounts & Finance",
    status: "Completed",
    responsiblePersons: [
      {
        name: "Kamrul Hasan",
        designation: "Manager Accounts",
        department: "Accounts",
        company: "Pakiza Group",
        phone: "01733334444",
      },
    ],
  },
];

function ConferenceRoomBookingListPage() {
  const [bookings, setBookings] = useState<BookingItem[]>(INITIAL_BOOKINGS);
  const [fromDate, setFromDate] = useState("2026-09-14");
  const [toDate, setToDate] = useState("2026-09-14");
  const [tableSearch, setTableSearch] = useState("");

  // Modals state
  const [viewingBooking, setViewingBooking] = useState<BookingItem | null>(null);
  const [editingBooking, setEditingBooking] = useState<BookingItem | null>(null);

  // Edit Form Fields state
  const [editMeetingRoom, setEditMeetingRoom] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [editAgenda, setEditAgenda] = useState("");
  const [editTotalParticipants, setEditTotalParticipants] = useState<number>(0);
  const [editDept, setEditDept] = useState("");
  const [editPersons, setEditPersons] = useState("");

  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  // Open Edit Modal & populate
  const handleOpenEdit = (item: BookingItem) => {
    setEditingBooking(item);
    setEditMeetingRoom(item.meetingRoom);
    setEditDate(item.date);
    setEditStartTime(item.startTime);
    setEditEndTime(item.endTime);
    setEditAgenda(item.agenda);
    setEditTotalParticipants(item.totalParticipants);
    setEditDept(item.responsibleDepts);
    setEditPersons(
      item.responsiblePersons.map((p) => `${p.name} (${p.designation}), ${p.department}`).join(", ")
    );
  };

  // Submit Edit Form
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === editingBooking.id
          ? {
              ...b,
              meetingRoom: editMeetingRoom,
              date: editDate,
              startTime: editStartTime,
              endTime: editEndTime,
              agenda: editAgenda,
              totalParticipants: Number(editTotalParticipants),
              responsibleDepts: editDept,
            }
          : b
      )
    );

    showToast(`Booking ${editingBooking.id} updated successfully!`);
    setEditingBooking(null);
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((item) => {
      const matchesSearch =
        item.meetingRoom.toLowerCase().includes(tableSearch.toLowerCase()) ||
        item.agenda.toLowerCase().includes(tableSearch.toLowerCase()) ||
        item.responsibleDepts.toLowerCase().includes(tableSearch.toLowerCase()) ||
        item.status.toLowerCase().includes(tableSearch.toLowerCase());

      return matchesSearch;
    });
  }, [bookings, tableSearch]);

  const handleExportCSV = () => {
    const headers = ["Meeting Room", "Date", "Start Time", "End Time", "Agenda", "Total Participants", "Responsible Depts", "Status"];
    const rows = filteredBookings.map((b) => [
      b.meetingRoom,
      b.date,
      b.startTime,
      b.endTime,
      b.agenda,
      b.totalParticipants,
      b.responsibleDepts,
      b.status,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Conference_Room_Bookings_${dateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const dateString = () => new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1700px] w-full mx-auto">
          {/* Breadcrumb & Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                <span>Facility Management</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span>Conference Room</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-primary">Booking List</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
                <DoorOpen className="w-8 h-8 text-primary" />
                Conference Room Booking List
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage, search, view details, edit, and export corporate conference room bookings.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/conference-room-booking"
                className="px-4 py-2.5 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md"
              >
                <Plus className="w-4 h-4" />
                New Room Booking
              </Link>
            </div>
          </div>

          {/* Toast Notice */}
          {toastMsg && (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 flex items-center gap-3 shadow-lg animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="flex-1 text-xs font-bold">{toastMsg}</div>
            </div>
          )}

          {/* TOP FILTER CONSOLE BOX (Matching Screenshot 1 Top Console) */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-end gap-4">
              <div className="w-full sm:w-64">
                <label className="block text-xs font-bold mb-1 text-muted-foreground">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-background font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="w-full sm:w-64">
                <label className="block text-xs font-bold mb-1 text-muted-foreground">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-background font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => showToast(`Filtered records from ${fromDate} to ${toDate}`)}
                  className="w-full sm:w-auto px-6 py-2 text-xs font-bold rounded-xl bg-lime-600 text-white hover:bg-lime-700 dark:bg-lime-700 dark:hover:bg-lime-800 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <SearchIcon className="w-3.5 h-3.5" />
                  SEARCH
                </button>
              </div>
            </div>
          </div>

          {/* MAIN TABLE CARD BOX (Matching Screenshot 1 Table Console) */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden space-y-4 p-4 sm:p-6">
            {/* Toolbar Row: Excel, Print, PDF & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
              {/* Export Buttons (EXCEL, PRINT, PDF) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 text-xs font-bold rounded-lg border border-border bg-background hover:bg-accent text-foreground transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  EXCEL
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 text-xs font-bold rounded-lg border border-border bg-background hover:bg-accent text-foreground transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5 text-blue-600" />
                  PRINT
                </button>
                <button
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 text-xs font-bold rounded-lg border border-border bg-background hover:bg-accent text-foreground transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5 text-red-600" />
                  PDF
                </button>
              </div>

              {/* Search Bar Right */}
              <div className="flex items-center gap-2 w-full sm:w-72">
                <span className="text-xs font-bold text-muted-foreground">Search:</span>
                <input
                  type="text"
                  placeholder="Filter table entries..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-border bg-background font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            {/* High Density Table */}
            <div className="rounded-xl border border-border/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  {/* Pink/Soft Accent Header matching Screenshot 1 */}
                  <thead className="bg-rose-50 dark:bg-rose-950/30 text-foreground font-extrabold border-b border-rose-200 dark:border-rose-900/40 text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5 text-center">Action</th>
                      <th className="p-3.5">Meeting Room</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Start Time</th>
                      <th className="p-3.5">End Time</th>
                      <th className="p-3.5">Agenda</th>
                      <th className="p-3.5 text-center">Total Participants</th>
                      <th className="p-3.5">Responsible Depts.</th>
                      <th className="p-3.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-muted-foreground">
                          No conference room booking entries found matching search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-accent/40 transition-colors">
                          {/* Action Column: View (Eye) & Edit (Pencil) */}
                          <td className="p-3.5 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setViewingBooking(b)}
                                className="p-1.5 rounded-md hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 transition-all"
                                title="View Booking Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleOpenEdit(b)}
                                className="p-1.5 rounded-md hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 transition-all"
                                title="Edit Booking Details"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            </div>
                          </td>

                          <td className="p-3.5 font-bold text-foreground whitespace-nowrap">
                            {b.meetingRoom}
                          </td>
                          <td className="p-3.5 font-medium whitespace-nowrap">
                            {b.date}
                          </td>
                          <td className="p-3.5 font-mono font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                            {b.startTime}
                          </td>
                          <td className="p-3.5 font-mono font-semibold text-muted-foreground whitespace-nowrap">
                            {b.endTime}
                          </td>
                          <td className="p-3.5 max-w-[220px]">
                            <div className="font-medium text-foreground truncate" title={b.agenda}>
                              {b.agenda}
                            </div>
                          </td>
                          <td className="p-3.5 text-center font-bold text-foreground">
                            {b.totalParticipants}
                          </td>
                          <td className="p-3.5 font-semibold text-foreground max-w-[180px] truncate">
                            {b.responsibleDepts}
                          </td>
                          <td className="p-3.5 text-center whitespace-nowrap">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                b.status === "Approved"
                                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : b.status === "Pending"
                                  ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                  : b.status === "Completed"
                                  ? "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                  : "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table Footer: Entries Text & Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground pt-2">
              <div>
                Showing 1 to {filteredBookings.length} of {filteredBookings.length} entries
              </div>

              {/* Pagination matching Screenshot 1 */}
              <div className="flex items-center gap-1 font-semibold">
                <button className="px-2.5 py-1 rounded border border-border hover:bg-accent text-xs">
                  Previous
                </button>
                <button className="px-3 py-1 rounded bg-lime-600 text-white font-bold text-xs shadow-sm">
                  1
                </button>
                <button className="px-2.5 py-1 rounded border border-border hover:bg-accent text-xs">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* VIEW BOOKING MODAL (Matching Requisition View Modal Design) */}
        <Dialog open={!!viewingBooking} onOpenChange={(open) => !open && setViewingBooking(null)}>
          {viewingBooking && (
            <DialogContent className="max-w-7xl p-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-xl overflow-hidden gap-0 max-h-[92vh] flex flex-col [&>button]:hidden text-slate-700 dark:text-slate-200">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-[#fbfcfd] dark:bg-slate-950/30 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-rose-50 dark:bg-slate-800 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-100 dark:border-slate-700 shadow-3xs">
                    <DoorOpen className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 leading-none">
                        Conference Room Booking Requisition
                      </h2>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider border ${
                          viewingBooking.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900"
                            : viewingBooking.status === "Pending"
                            ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900"
                            : viewingBooking.status === "Completed"
                            ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900"
                            : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900"
                        }`}
                      >
                        • {viewingBooking.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1">
                      # Booking ID: {viewingBooking.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right border-r border-slate-100 dark:border-slate-800 pr-4">
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 block uppercase tracking-widest font-extrabold">
                      BOOKING DATE & TIME
                    </span>
                    <span className="text-xs font-black text-slate-700 dark:text-slate-200 block mt-0.5">
                      {viewingBooking.date}
                    </span>
                    <span className="text-[9.5px] text-emerald-600 dark:text-emerald-400 block mt-0.5 font-bold font-mono">
                      {viewingBooking.startTime} – {viewingBooking.endTime}
                    </span>
                  </div>
                  <button
                    onClick={() => setViewingBooking(null)}
                    className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all shrink-0 shadow-3xs cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#f8fafc]/40 dark:bg-slate-950/20">
                <div className="grid grid-cols-1 gap-5">
                  {/* Requester & Booking Details Card */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
                    <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800/60">
                      <div className="w-6 h-6 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-100 dark:border-slate-900 shadow-3xs">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Request For & Meeting Overview
                      </span>
                    </div>

                    <div className="pl-1 text-xs flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                      {/* Employee Avatar */}
                      <div className="w-[91px] h-[91px] shrink-0 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center shadow-3xs">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80"
                          alt="Md. Anik Islam"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details Grid */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-12 font-semibold text-slate-700 dark:text-slate-200 w-full max-w-3xl">
                        <div className="flex items-start gap-1">
                          <span className="text-slate-400 dark:text-slate-500 font-normal w-[120px] shrink-0">
                            Requisition By:
                          </span>
                          <span className="text-slate-700 dark:text-slate-200 font-bold">
                            {viewingBooking.responsiblePersons[0]?.name || "Md. Anik Islam"}
                          </span>
                        </div>

                        <div className="flex items-start gap-1">
                          <span className="text-slate-400 dark:text-slate-500 font-normal w-[120px] shrink-0">
                            Employee ID:
                          </span>
                          <span className="text-slate-700 dark:text-slate-200 font-bold font-mono">
                            2023044078
                          </span>
                        </div>

                        <div className="flex items-start gap-1">
                          <span className="text-slate-400 dark:text-slate-500 font-normal w-[120px] shrink-0">
                            Designation:
                          </span>
                          <span className="text-slate-700 dark:text-slate-200 font-bold">
                            {viewingBooking.responsiblePersons[0]?.designation || "Deputy Manager"}
                          </span>
                        </div>

                        <div className="flex items-start gap-1">
                          <span className="text-slate-400 dark:text-slate-500 font-normal w-[120px] shrink-0">
                            Department:
                          </span>
                          <span className="text-slate-700 dark:text-slate-200 font-bold">
                            {viewingBooking.responsiblePersons[0]?.department || "WEB-Team"}
                          </span>
                        </div>

                        <div className="flex items-start gap-1">
                          <span className="text-slate-400 dark:text-slate-500 font-normal w-[120px] shrink-0">
                            Meeting Room:
                          </span>
                          <span className="text-rose-600 dark:text-rose-400 font-extrabold text-xs">
                            {viewingBooking.meetingRoom}
                          </span>
                        </div>

                        <div className="flex items-start gap-1">
                          <span className="text-slate-400 dark:text-slate-500 font-normal w-[120px] shrink-0">
                            Booking Date:
                          </span>
                          <span className="text-slate-700 dark:text-slate-200 font-bold font-mono">
                            {viewingBooking.date}
                          </span>
                        </div>

                        <div className="flex items-start gap-1">
                          <span className="text-slate-400 dark:text-slate-500 font-normal w-[120px] shrink-0">
                            Time Duration:
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                            {viewingBooking.startTime} – {viewingBooking.endTime}
                          </span>
                        </div>

                        <div className="flex items-start gap-1">
                          <span className="text-slate-400 dark:text-slate-500 font-normal w-[120px] shrink-0">
                            Total Participants:
                          </span>
                          <span className="text-slate-700 dark:text-slate-200 font-bold">
                            {viewingBooking.totalParticipants} Persons
                          </span>
                        </div>

                        <div className="flex items-start gap-1">
                          <span className="text-slate-400 dark:text-slate-500 font-normal w-[120px] shrink-0">
                            Responsible Depts:
                          </span>
                          <span className="text-slate-700 dark:text-slate-200 font-bold">
                            {viewingBooking.responsibleDepts}
                          </span>
                        </div>

                        <div className="flex items-start gap-1">
                          <span className="text-slate-400 dark:text-slate-500 font-normal w-[120px] shrink-0">
                            Business Unit:
                          </span>
                          <span className="text-slate-700 dark:text-slate-200 font-bold">
                            Pakiza Software Limited
                          </span>
                        </div>

                        <div className="flex items-start gap-1 sm:col-span-2 mt-1 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                          <span className="text-slate-400 dark:text-slate-500 font-normal w-[120px] shrink-0">
                            Agenda / Purpose:
                          </span>
                          <span className="text-slate-800 dark:text-slate-100 font-bold italic">
                            "{viewingBooking.agenda}"
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SCHEDULE & ROOM REALLOCATION HISTORY CARD */}
                {viewingBooking.scheduleHistory && viewingBooking.scheduleHistory.changed && (
                  <div className="bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/60 p-5 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-amber-200/60 dark:border-amber-900/40">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-3xs">
                          <History className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h3 className="text-xs font-black text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                            Requisition Schedule & Room Reallocation History
                          </h3>
                          <p className="text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                            Schedule was modified by {viewingBooking.scheduleHistory.changedBy || "Approval Authority"} on {viewingBooking.scheduleHistory.changedAt || "Approval"}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-amber-600 text-white border-none font-extrabold text-[10px] uppercase">
                        Modified Schedule Approved
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      {/* Original Requester Schedule */}
                      <div className="bg-white/80 dark:bg-slate-900/80 p-3.5 rounded-xl border border-amber-200/80 dark:border-slate-800 space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                          <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Original Requested Schedule
                          </span>
                          <span className="text-[9.5px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900">
                            Requester Draft
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-xs">
                          <div>
                            <span className="text-[9.5px] text-slate-400 block font-bold">MEETING ROOM</span>
                            <span className="font-extrabold text-slate-700 dark:text-slate-300 line-through decoration-rose-400">
                              {viewingBooking.scheduleHistory.original.meetingRoom}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9.5px] text-slate-400 block font-bold">BOOKING DATE</span>
                            <span className="font-bold text-slate-700 dark:text-slate-300 font-mono line-through decoration-rose-400">
                              {viewingBooking.scheduleHistory.original.date}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9.5px] text-slate-400 block font-bold">START TIME</span>
                            <span className="font-bold text-slate-700 dark:text-slate-300 font-mono line-through decoration-rose-400">
                              {viewingBooking.scheduleHistory.original.startTime}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9.5px] text-slate-400 block font-bold">END TIME</span>
                            <span className="font-bold text-slate-700 dark:text-slate-300 font-mono line-through decoration-rose-400">
                              {viewingBooking.scheduleHistory.original.endTime}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Changed / Approved Schedule */}
                      <div className="bg-emerald-50/60 dark:bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 space-y-2">
                        <div className="flex items-center justify-between border-b border-emerald-200/50 dark:border-emerald-900/40 pb-2">
                          <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                            Approved Final Schedule
                          </span>
                          <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                            Approver Revised
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-xs">
                          <div>
                            <span className="text-[9.5px] text-emerald-600 dark:text-emerald-400 block font-bold">MEETING ROOM</span>
                            <span className="font-extrabold text-emerald-800 dark:text-emerald-200">
                              {viewingBooking.scheduleHistory.updated.meetingRoom}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9.5px] text-emerald-600 dark:text-emerald-400 block font-bold">BOOKING DATE</span>
                            <span className="font-bold text-emerald-800 dark:text-emerald-200 font-mono">
                              {viewingBooking.scheduleHistory.updated.date}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9.5px] text-emerald-600 dark:text-emerald-400 block font-bold">START TIME</span>
                            <span className="font-bold text-emerald-800 dark:text-emerald-200 font-mono">
                              {viewingBooking.scheduleHistory.updated.startTime}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9.5px] text-emerald-600 dark:text-emerald-400 block font-bold">END TIME</span>
                            <span className="font-bold text-emerald-800 dark:text-emerald-200 font-mono">
                              {viewingBooking.scheduleHistory.updated.endTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Responsible Persons Table */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs">
                  <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-[#fcfdfd] dark:bg-slate-950/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-100 dark:border-slate-900">
                        <Users className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Responsible Persons & Delegates List
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">
                      Total: {viewingBooking.responsiblePersons.length} Assigned
                    </span>
                  </div>

                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-[#fcfdfd] dark:bg-slate-950/20 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <tr>
                        <th className="px-3 py-2.5 w-10 text-center whitespace-nowrap">SL</th>
                        <th className="px-3 py-2.5 whitespace-nowrap">NAME</th>
                        <th className="px-3 py-2.5 whitespace-nowrap">DESIGNATION</th>
                        <th className="px-3 py-2.5 whitespace-nowrap">DEPARTMENT</th>
                        <th className="px-3 py-2.5 whitespace-nowrap">COMPANY</th>
                        <th className="px-3 py-2.5 whitespace-nowrap">PHONE NUMBER</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                      {viewingBooking.responsiblePersons.map((person, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-3 py-2.5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="size-3.5 rounded border border-emerald-300 dark:border-emerald-700 bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                                <Check className="size-2.5 stroke-[3.5]" />
                              </div>
                              <span className="text-slate-800 dark:text-slate-200 font-mono font-bold">{i + 1}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 font-bold text-slate-850 dark:text-slate-100">
                            {person.name}
                          </td>
                          <td className="px-3 py-2.5">{person.designation}</td>
                          <td className="px-3 py-2.5 font-semibold text-rose-600 dark:text-rose-400">
                            {person.department}
                          </td>
                          <td className="px-3 py-2.5">{person.company}</td>
                          <td className="px-3 py-2.5 font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200">
                            {person.phone}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Approval Workflow & Signatures */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2 pb-1.5">
                    <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-slate-900 shadow-3xs">
                      <FileCheck className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Approval Workflow & Signatures
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        role: "Dept. Manager",
                        name: viewingBooking.responsiblePersons[0]?.name || "Md. Anik Islam",
                        title: "Deputy Manager",
                        date: `${viewingBooking.date} · 09:25`,
                        status: "Approved",
                      },
                      {
                        role: "Facility Manager",
                        name: "Rajebul Hasan Rajon",
                        title: "Deputy Manager (Admin)",
                        date: `${viewingBooking.date} · 09:30`,
                        status: viewingBooking.status === "Pending" ? "Pending" : "Approved",
                      },
                      {
                        role: "Operations Head",
                        name: "Tahmid Afsar",
                        title: "Asst. Manager (Operations)",
                        date: `${viewingBooking.date} · 09:45`,
                        status: viewingBooking.status === "Pending" ? "Pending" : viewingBooking.status,
                      },
                    ].map((sig, idx) => {
                      const isSigApproved = sig.status === "Approved" || sig.status === "Completed";
                      return (
                        <div
                          key={idx}
                          className={`p-3 border rounded-xl flex flex-col justify-between h-[105px] relative text-slate-700 dark:text-slate-300 transition-colors ${
                            isSigApproved
                              ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10"
                              : "border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1.5">
                              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                                {sig.role}
                              </span>
                              <span
                                className={`inline-flex items-center gap-0.5 text-[8.5px] font-black uppercase ${
                                  isSigApproved ? "text-emerald-600" : "text-amber-600"
                                }`}
                              >
                                {isSigApproved ? "✓ Approved" : "⏳ Pending"}
                              </span>
                            </div>
                            <p
                              className={`text-[11.5px] font-extrabold leading-snug truncate ${
                                isSigApproved
                                  ? "text-slate-800 dark:text-slate-100"
                                  : "text-slate-500 dark:text-slate-400 italic"
                              }`}
                            >
                              {sig.name}
                            </p>
                            <p className="text-[9.5px] text-slate-400 dark:text-slate-500 font-semibold truncate leading-tight">
                              {sig.title}
                            </p>
                          </div>
                          <div
                            className={`mt-2 pt-1.5 border-t flex justify-between items-center text-[8.5px] font-mono ${
                              isSigApproved
                                ? "border-emerald-200/50 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400"
                                : "border-amber-200/50 dark:border-amber-800/50 text-amber-600 dark:text-amber-500"
                            }`}
                          >
                            <span>{sig.date.split(" · ")[1]}</span>
                            <span>{sig.date.split(" · ")[0]}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Comments & Approval Notes */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2 pb-1.5">
                    <div className="w-6 h-6 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-100 dark:border-slate-900 shadow-3xs">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Comments History & Approval Notes
                    </span>
                  </div>

                  <div className="space-y-3 pr-1">
                    <div className="flex gap-3 items-start bg-slate-50/40 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 p-3 rounded-xl text-slate-750 dark:text-slate-250">
                      <div className="w-8 h-8 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        AI
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[11.5px] font-extrabold text-slate-800 dark:text-slate-100">
                            {viewingBooking.responsiblePersons[0]?.name || "Md. Anik Islam"} <span className="text-slate-400 font-semibold">· Deputy Manager</span>
                          </span>
                          <span className="text-[9.5px] text-slate-400 font-semibold font-mono">
                            {viewingBooking.date} · {viewingBooking.startTime}
                          </span>
                        </div>
                        <p className="text-[11.5px] font-semibold text-slate-650 dark:text-slate-350 leading-relaxed">
                          "{viewingBooking.agenda}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-[#fbfcfd] dark:bg-slate-950/30 flex justify-between items-center shrink-0">
                <button
                  onClick={() => window.print()}
                  className="h-8.5 px-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="size-3.5" />
                  <span>Print Slip</span>
                </button>

                <button
                  onClick={() => setViewingBooking(null)}
                  className="h-8.5 px-5 bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            </DialogContent>
          )}
        </Dialog>

        {/* EDIT BOOKING MODAL (Matching Screenshot 3) */}
        {editingBooking && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <form onSubmit={handleSaveEdit} className="bg-card border border-border rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-extrabold text-lg text-foreground flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-blue-500" />
                  Edit Booking
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="p-1 rounded bg-muted text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Grid matching Screenshot 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1 text-muted-foreground">
                    Meeting Room <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editMeetingRoom}
                    onChange={(e) => setEditMeetingRoom(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="Conference Room 1">Conference Room 1</option>
                    <option value="Executive Boardroom">Executive Boardroom</option>
                    <option value="Innovation Lab">Innovation Lab</option>
                    <option value="Conference Room A">Conference Room A</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-muted-foreground">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-muted-foreground">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editStartTime}
                    onChange={(e) => setEditStartTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-muted-foreground">
                    End Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editEndTime}
                    onChange={(e) => setEditEndTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
                  />
                </div>

                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold mb-1 text-muted-foreground">
                      Agenda <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editAgenda}
                      onChange={(e) => setEditAgenda(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 text-muted-foreground">
                      Total Participants <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={editTotalParticipants}
                      onChange={(e) => setEditTotalParticipants(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>

                {/* Tag Pills fields matching Screenshot 3 */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold mb-1 text-muted-foreground">
                    Responsible Department <span className="text-red-500">*</span>
                  </label>
                  <div className="p-2 rounded-xl border border-border bg-background flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-muted font-bold text-xs text-foreground flex items-center gap-1.5 border border-border">
                      {editDept}
                      <X className="w-3.5 h-3.5 cursor-pointer text-muted-foreground hover:text-foreground" />
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold mb-1 text-muted-foreground">
                    Responsible Persons <span className="text-red-500">*</span>
                  </label>
                  <div className="p-2 rounded-xl border border-border bg-background flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-muted font-bold text-xs text-foreground flex items-center gap-1.5 border border-border">
                      {editPersons}
                      <X className="w-3.5 h-3.5 cursor-pointer text-muted-foreground hover:text-foreground" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Buttons: CLOSE (left) & UPDATE (right) matching Screenshot 3 */}
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="px-6 py-2.5 text-xs font-bold rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-all shadow-md uppercase tracking-wider"
                >
                  CLOSE
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-all shadow-md uppercase tracking-wider"
                >
                  UPDATE
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
