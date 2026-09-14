import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
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
} from "lucide-react";

export const Route = createFileRoute("/conference-room-booking-list")({
  head: () => ({
    meta: [
      { title: "Conference Room Booking List — CRIPTON" },
      {
        name: "description",
        content: "View, search, edit, and track corporate conference room bookings.",
      },
    ],
  }),
  component: ConferenceRoomBookingListPage,
});

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

        {/* VIEW BOOKING MODAL (Matching Screenshot 2) */}
        {viewingBooking && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl max-w-3xl w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-extrabold text-lg text-foreground flex items-center gap-2">
                  <Eye className="w-5 h-5 text-amber-500" />
                  View Booking
                </h3>
                <button
                  onClick={() => setViewingBooking(null)}
                  className="p-1 rounded bg-muted text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground font-bold block mb-1">
                    Meeting Room <span className="text-red-500">*</span>
                  </span>
                  <p className="font-bold text-foreground text-sm">{viewingBooking.meetingRoom}</p>
                </div>
                <div>
                  <span className="text-muted-foreground font-bold block mb-1">
                    Date <span className="text-red-500">*</span>
                  </span>
                  <p className="font-bold text-foreground text-sm">{viewingBooking.date}</p>
                </div>
                <div>
                  <span className="text-muted-foreground font-bold block mb-1">
                    Start Time <span className="text-red-500">*</span>
                  </span>
                  <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">{viewingBooking.startTime}</p>
                </div>
                <div>
                  <span className="text-muted-foreground font-bold block mb-1">
                    End Time <span className="text-red-500">*</span>
                  </span>
                  <p className="font-mono font-bold text-muted-foreground text-sm">{viewingBooking.endTime}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs pt-2">
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground font-bold block mb-1">
                    Agenda <span className="text-red-500">*</span>
                  </span>
                  <p className="font-medium text-foreground">{viewingBooking.agenda}</p>
                </div>
                <div>
                  <span className="text-muted-foreground font-bold block mb-1">
                    Total Participants <span className="text-red-500">*</span>
                  </span>
                  <p className="font-bold text-foreground">{viewingBooking.totalParticipants}</p>
                </div>
                <div>
                  <span className="text-muted-foreground font-bold block mb-1">
                    Status <span className="text-red-500">*</span>
                  </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{viewingBooking.status}</span>
                </div>
              </div>

              {/* Responsible Persons Table */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                  Responsible Persons
                </h4>
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/70 text-muted-foreground font-bold border-b border-border text-[11px] uppercase">
                      <tr>
                        <th className="p-3">Name</th>
                        <th className="p-3">Designation</th>
                        <th className="p-3">Department</th>
                        <th className="p-3">Company</th>
                        <th className="p-3">Phone</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 font-medium">
                      {viewingBooking.responsiblePersons.map((person, i) => (
                        <tr key={i} className="hover:bg-accent/40">
                          <td className="p-3 font-bold text-foreground">{person.name}</td>
                          <td className="p-3">{person.designation}</td>
                          <td className="p-3 font-semibold text-primary">{person.department}</td>
                          <td className="p-3">{person.company}</td>
                          <td className="p-3 font-mono">{person.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom CLOSE button matching Screenshot 2 */}
              <div className="pt-3 border-t border-border flex justify-start">
                <button
                  type="button"
                  onClick={() => setViewingBooking(null)}
                  className="px-6 py-2 text-xs font-bold rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-all shadow-md uppercase tracking-wider"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        )}

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
