import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  DoorOpen,
  Calendar,
  Clock,
  Users,
  Building2,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  FileText,
  RotateCcw,
  Send,
  Sparkles,
  Info,
  Clock3,
  Search,
  Filter,
} from "lucide-react";

export const Route = createFileRoute("/conference-room-booking")({
  head: () => ({
    meta: [
      { title: "Conference Room Booking — CRIPTON" },
      {
        name: "description",
        content: "Reserve corporate conference rooms, view real-time booked slots, and manage room requisitions.",
      },
    ],
  }),
  component: ConferenceRoomBookingPage,
});

interface RoomOption {
  id: string;
  name: string;
  capacity: number;
  floor: string;
}

const ROOM_OPTIONS: RoomOption[] = [
  { id: "RM-101", name: "Executive Boardroom", capacity: 24, floor: "5th Floor (HQ)" },
  { id: "RM-102", name: "Innovation Lab", capacity: 14, floor: "4th Floor (Tech Wing)" },
  { id: "RM-103", name: "Conference Room A", capacity: 10, floor: "3rd Floor (Admin)" },
  { id: "RM-104", name: "Grand Auditorium & Training Hall", capacity: 60, floor: "Ground Floor" },
];

const DEPARTMENT_OPTIONS = [
  "ALL",
  "Software & IT",
  "Executive Committee",
  "Merchandising",
  "Accounts & Finance",
  "Human Resources",
  "Operations & Supply Chain",
  "EHS & Compliance",
  "Procurement",
];

const TIME_SLOTS = [
  "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM",
];

interface BookedSlot {
  id: string;
  start: string;
  end: string;
  bookedBy: string;
  department: string;
  meetingAgenda: string;
  room: string;
  date: string;
  status: "Approved" | "Pending" | "In Progress" | "Completed";
}

const INITIAL_BOOKED_SLOTS: BookedSlot[] = [
  {
    id: "SLOT-101",
    start: "09:30 AM",
    end: "11:00 AM",
    bookedBy: "Kamrul Hasan",
    department: "Accounts & Finance",
    meetingAgenda: "Monthly Audit & Cash Flow Reconciliation",
    room: "Conference Room A",
    date: new Date().toISOString().split("T")[0],
    status: "Completed",
  },
  {
    id: "SLOT-102",
    start: "10:00 AM",
    end: "11:30 AM",
    bookedBy: "Tahmid Afsar Shapno",
    department: "Software & IT",
    meetingAgenda: "Q3 Strategic HR & ERP Architecture Review",
    room: "Executive Boardroom",
    date: new Date().toISOString().split("T")[0],
    status: "Approved",
  },
  {
    id: "SLOT-103",
    start: "02:00 PM",
    end: "03:30 PM",
    bookedBy: "Dipon Saha",
    department: "Core Development",
    meetingAgenda: "UI/UX Component System & Mobile App Demo",
    room: "Innovation Lab",
    date: new Date().toISOString().split("T")[0],
    status: "Pending",
  },
  {
    id: "SLOT-104",
    start: "04:00 PM",
    end: "05:30 PM",
    bookedBy: "Farhana Ahmed",
    department: "Merchandising",
    meetingAgenda: "Buyer Order Briefing & Garments Sample Review",
    room: "Executive Boardroom",
    date: new Date().toISOString().split("T")[0],
    status: "Pending",
  },
];

function ConferenceRoomBookingPage() {
  // Form States matching the reference ERP layout
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [meetingRoom, setMeetingRoom] = useState("Executive Boardroom");
  const [startTime, setStartTime] = useState("10:00 AM");
  const [endTime, setEndTime] = useState("11:30 AM");
  const [totalParticipants, setTotalParticipants] = useState("10");
  const [agenda, setAgenda] = useState("");
  const [responsibleDepartment, setResponsibleDepartment] = useState("ALL");
  const [responsiblePersons, setResponsiblePersons] = useState("Tahmid Afsar Shapno (2023043910)");

  // Booked slots list & filter state
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>(INITIAL_BOOKED_SLOTS);
  const [slotRoomFilter, setSlotRoomFilter] = useState("All");
  const [successToast, setSuccessToast] = useState("");

  const handleReset = () => {
    setDate(new Date().toISOString().split("T")[0]);
    setMeetingRoom("Executive Boardroom");
    setStartTime("10:00 AM");
    setEndTime("11:30 AM");
    setTotalParticipants("10");
    setAgenda("");
    setResponsibleDepartment("ALL");
    setResponsiblePersons("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agenda.trim()) {
      alert("Please enter the Meeting Agenda!");
      return;
    }
    if (!meetingRoom || meetingRoom === "Select Room") {
      alert("Please select a valid Meeting Room!");
      return;
    }

    const newSlot: BookedSlot = {
      id: `SLOT-${Math.floor(100 + Math.random() * 900)}`,
      start: startTime,
      end: endTime,
      bookedBy: responsiblePersons || "Current User",
      department: responsibleDepartment,
      meetingAgenda: agenda,
      room: meetingRoom,
      date: date,
      status: "Pending",
    };

    setBookedSlots((prev) => [newSlot, ...prev]);

    setSuccessToast(
      `Room Booking Requisition for "${meetingRoom}" (${startTime} - ${endTime}) submitted successfully!`
    );

    setTimeout(() => {
      setSuccessToast("");
    }, 5000);

    setAgenda("");
  };

  const filteredBookedSlots = useMemo(() => {
    return bookedSlots.filter((slot) => {
      const matchesDate = slot.date === date;
      const matchesRoom = slotRoomFilter === "All" || slot.room === slotRoomFilter;
      return matchesDate && matchesRoom;
    });
  }, [bookedSlots, date, slotRoomFilter]);

  const selectedRoomObj = useMemo(() => {
    return ROOM_OPTIONS.find((r) => r.name === meetingRoom);
  }, [meetingRoom]);

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1700px] w-full mx-auto">
          {/* Top Breadcrumb & Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                <span>Facility Management</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-primary">Conference Room</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
                <DoorOpen className="w-8 h-8 text-primary" />
                Conference Room Booking
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Enterprise Room Reservation Console — Submit booking details and view live booked slots.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/conference-room-booking-list"
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-border bg-card hover:bg-accent text-foreground transition-all flex items-center gap-2 shadow-sm"
              >
                <FileText className="w-4 h-4 text-primary" />
                Booking List
              </Link>
              <Link
                to="/conference-room-approval"
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-primary/20 bg-primary/10 hover:bg-primary/20 text-primary transition-all flex items-center gap-2 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                Approvals
              </Link>
            </div>
          </div>

          {/* Success Toast Banner */}
          {successToast && (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 flex items-center gap-3 shadow-lg animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="flex-1 text-xs font-bold">{successToast}</div>
            </div>
          )}

          {/* Main 2-Column Split Layout matching Reference Image */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Panel: Booking Details (5 or 6 columns) */}
            <div className="lg:col-span-6 bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <h2 className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  Booking Details
                </h2>
                <span className="text-xs text-muted-foreground font-mono">
                  {date}
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Row 1: Date & Meeting Room */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1.5 text-foreground">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1.5 text-foreground">
                      Meeting Room <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={meetingRoom}
                      onChange={(e) => setMeetingRoom(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-semibold text-foreground"
                    >
                      <option value="Select Room" disabled>Select Room</option>
                      {ROOM_OPTIONS.map((r) => (
                        <option key={r.id} value={r.name}>
                          {r.name} ({r.floor} • Cap: {r.capacity})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 2: Start Time, End Time & Total Participants */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1.5 text-foreground">
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-semibold"
                    >
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1.5 text-foreground">
                      End Time <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-semibold"
                    >
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1.5 text-foreground">
                      Total Participants <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={selectedRoomObj?.capacity || 100}
                      value={totalParticipants}
                      onChange={(e) => setTotalParticipants(e.target.value)}
                      required
                      placeholder="e.g. 10"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-semibold"
                    />
                  </div>
                </div>

                {/* Row 3: Agenda */}
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-foreground">
                    Agenda <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Agenda..."
                    value={agenda}
                    onChange={(e) => setAgenda(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-medium"
                  />
                </div>

                {/* Row 4: Responsible Department */}
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-foreground">
                    Responsible Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={responsibleDepartment}
                    onChange={(e) => setResponsibleDepartment(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-semibold"
                  >
                    {DEPARTMENT_OPTIONS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Row 5: Responsible Persons */}
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-foreground">
                    Responsible Persons <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Responsible Person Name & ID..."
                    value={responsiblePersons}
                    onChange={(e) => setResponsiblePersons(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-medium"
                  />
                </div>

                {/* Action Buttons (Submit & Reset) at Bottom Left */}
                <div className="pt-4 border-t border-border flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition-all shadow-md flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    SUBMIT
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-5 py-2.5 text-xs font-bold rounded-xl bg-lime-600 text-white hover:bg-lime-700 dark:bg-lime-700 dark:hover:bg-lime-800 active:scale-95 transition-all shadow-sm flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    RESET
                  </button>
                </div>
              </form>
            </div>

            {/* Right Panel: Booked Slots Table (6 columns) */}
            <div className="lg:col-span-6 bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3">
                <div>
                  <h2 className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <Clock3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    Booked Slots
                  </h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Reserved slots for <span className="font-semibold text-foreground">{date}</span>
                  </p>
                </div>

                {/* Room Filter Dropdown */}
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                  <select
                    value={slotRoomFilter}
                    onChange={(e) => setSlotRoomFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background font-semibold focus:outline-none"
                  >
                    <option value="All">All Rooms</option>
                    {ROOM_OPTIONS.map((r) => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Booked Slots High-Density Table */}
              <div className="rounded-xl border border-border/70 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/70 text-muted-foreground font-bold border-b border-border uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-3">Start</th>
                        <th className="p-3">End</th>
                        <th className="p-3">Booked By</th>
                        <th className="p-3">Meeting Agenda</th>
                        <th className="p-3">Room</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredBookedSlots.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-muted-foreground">
                            <div className="space-y-1.5">
                              <DoorOpen className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                              <p className="font-semibold text-xs text-foreground">No Booked Slots Found</p>
                              <p className="text-[11px]">There are no conference room bookings registered for this date/room.</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredBookedSlots.map((slot) => (
                          <tr key={slot.id} className="hover:bg-accent/40 transition-colors">
                            <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                              {slot.start}
                            </td>
                            <td className="p-3 font-mono font-bold text-muted-foreground whitespace-nowrap">
                              {slot.end}
                            </td>
                            <td className="p-3">
                              <div className="font-bold text-foreground">{slot.bookedBy}</div>
                              <div className="text-[10px] text-muted-foreground">{slot.department}</div>
                            </td>
                            <td className="p-3 max-w-[200px]">
                              <div className="font-medium text-foreground truncate" title={slot.meetingAgenda}>
                                {slot.meetingAgenda}
                              </div>
                            </td>
                            <td className="p-3 whitespace-nowrap font-semibold text-foreground">
                              {slot.room}
                            </td>
                            <td className="p-3 text-center whitespace-nowrap">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                  slot.status === "Approved"
                                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : slot.status === "Pending"
                                    ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                    : slot.status === "In Progress"
                                    ? "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                    : "border-gray-500/30 bg-gray-500/10 text-gray-600 dark:text-gray-400"
                                }`}
                              >
                                {slot.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer Summary Notice */}
              <div className="p-3 rounded-xl bg-muted/40 border border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-primary" />
                  Showing {filteredBookedSlots.length} reserved slots for {date}
                </span>
                <span className="font-mono text-[11px] font-semibold text-foreground">
                  Updated Live
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
