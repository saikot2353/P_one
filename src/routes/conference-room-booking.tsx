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
  UserCheck,
  Tv,
  Wifi,
  Coffee,
  Video,
  Check,
  Layers,
  Activity,
  CalendarDays,
  Sparkle,
  Monitor,
  Mic,
  AlertCircle,
} from "lucide-react";

export const Route = createFileRoute("/conference-room-booking")({
  head: () => ({
    meta: [
      { title: "Conference Room Booking — CRIPTON" },
      {
        name: "description",
        content: "Executive room reservation console with real-time slot timeline matrix and facility metrics.",
      },
    ],
  }),
  component: ConferenceRoomBookingPage,
});

interface RoomSpec {
  id: string;
  name: string;
  capacity: number;
  floor: string;
  status: "Available" | "In Use" | "Maintenance";
  color: string;
  gradientBg: string;
  amenities: string[];
}

const ROOM_SPECS: RoomSpec[] = [
  {
    id: "RM-101",
    name: "Executive Boardroom",
    capacity: 24,
    floor: "5th Floor (HQ)",
    status: "Available",
    color: "amber",
    gradientBg: "from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/30",
    amenities: ["4K TV Display", "Polycom Video Conf", "Smart Whiteboard", "Tea & Coffee"],
  },
  {
    id: "RM-102",
    name: "Innovation Lab",
    capacity: 14,
    floor: "4th Floor (Tech Wing)",
    status: "Available",
    color: "blue",
    gradientBg: "from-blue-500/10 via-indigo-500/5 to-transparent border-blue-500/30",
    amenities: ["Interactive Screen", "Wireless Mic", "High-Speed Wi-Fi"],
  },
  {
    id: "RM-103",
    name: "Conference Room A",
    capacity: 10,
    floor: "3rd Floor (Admin)",
    status: "In Use",
    color: "emerald",
    gradientBg: "from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-500/30",
    amenities: ["HD Display", "Conference Phone", "Whiteboard"],
  },
  {
    id: "RM-104",
    name: "Grand Auditorium",
    capacity: 60,
    floor: "Ground Floor",
    status: "Available",
    color: "purple",
    gradientBg: "from-purple-500/10 via-violet-500/5 to-transparent border-purple-500/30",
    amenities: ["Dual Projectors", "Surround Audio", "Podium Mic", "Catering"],
  },
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
  // Form States
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedRoomId, setSelectedRoomId] = useState("RM-101");
  const [startTime, setStartTime] = useState("10:00 AM");
  const [endTime, setEndTime] = useState("11:30 AM");
  const [totalParticipants, setTotalParticipants] = useState("12");
  const [agenda, setAgenda] = useState("");
  const [responsibleDepartment, setResponsibleDepartment] = useState("Software & IT");
  const [responsiblePersons, setResponsiblePersons] = useState("Tahmid Afsar Shapno (2023043910)");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "4K TV Display",
    "Polycom Video Conf",
    "Tea & Coffee",
  ]);

  // Booked slots list & toast state
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>(INITIAL_BOOKED_SLOTS);
  const [slotRoomFilter, setSlotRoomFilter] = useState("All");
  const [successToast, setSuccessToast] = useState("");

  const activeRoom = useMemo(() => {
    return ROOM_SPECS.find((r) => r.id === selectedRoomId) || ROOM_SPECS[0];
  }, [selectedRoomId]);

  const toggleAmenity = (item: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleReset = () => {
    setDate(new Date().toISOString().split("T")[0]);
    setSelectedRoomId("RM-101");
    setStartTime("10:00 AM");
    setEndTime("11:30 AM");
    setTotalParticipants("12");
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

    const newSlot: BookedSlot = {
      id: `SLOT-${Math.floor(100 + Math.random() * 900)}`,
      start: startTime,
      end: endTime,
      bookedBy: responsiblePersons || "Current User",
      department: responsibleDepartment,
      meetingAgenda: agenda,
      room: activeRoom.name,
      date: date,
      status: "Pending",
    };

    setBookedSlots((prev) => [newSlot, ...prev]);

    setSuccessToast(
      `Requisition submitted for "${activeRoom.name}" (${startTime} - ${endTime})! Requisition ID: ${newSlot.id}`
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

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1750px] w-full mx-auto">
          {/* Executive Header & Navigation Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                <span>Facility Management</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-primary font-bold">Conference Room</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
                <DoorOpen className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                Conference Room Booking Terminal
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Enterprise Room Reservation Console — Select corporate meeting spaces, configure tech amenities, and review live schedule.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/conference-room-booking-list"
                className="px-4 py-2.5 text-xs font-bold rounded-xl border border-border bg-card hover:bg-accent text-foreground transition-all flex items-center gap-2 shadow-sm"
              >
                <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Booking List
              </Link>
              <Link
                to="/conference-room-approval"
                className="px-4 py-2.5 text-xs font-bold rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 transition-all flex items-center gap-2 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Approvals Portal
              </Link>
            </div>
          </div>

          {/* Toast Notification Banner */}
          {successToast && (
            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 flex items-center gap-3 shadow-lg animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="flex-1 text-xs font-bold">{successToast}</div>
            </div>
          )}

          {/* MAIN 2-COLUMN SPLIT LAYOUT (Reference ERP Layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT PANEL: BOOKING DETAILS FORM CARD (6 COLUMNS) */}
            <div className="lg:col-span-6 bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm space-y-6 relative overflow-hidden">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <h2 className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  Booking Details
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                    {date}
                  </span>
                </div>
              </div>

              {/* Active Room Information Banner */}
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-foreground">{activeRoom.name}</h4>
                      <p className="text-[11px] text-muted-foreground">{activeRoom.floor} • Seating Capacity: {activeRoom.capacity} Persons</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 font-mono bg-background px-2.5 py-1 rounded-lg border border-border">
                    Slot: {startTime} - {endTime}
                  </span>
                </div>

                <div className="pt-2 border-t border-emerald-500/20 flex flex-wrap gap-1.5">
                  {activeRoom.amenities.map((a, i) => (
                    <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      ✓ {a}
                    </span>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Row 1: Date & Meeting Room */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1.5 text-foreground flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-semibold transition-all shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1.5 text-foreground flex items-center gap-1.5">
                      <DoorOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Meeting Room <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={activeRoom.name}
                      onChange={(e) => {
                        const match = ROOM_SPECS.find((r) => r.name === e.target.value);
                        if (match) setSelectedRoomId(match.id);
                      }}
                      required
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-semibold text-foreground transition-all shadow-sm"
                    >
                      <option value="Select Room" disabled>Select Room</option>
                      {ROOM_SPECS.map((r) => (
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
                    <label className="block text-xs font-bold mb-1.5 text-foreground flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-semibold transition-all shadow-sm"
                    >
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1.5 text-foreground flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      End Time <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-semibold transition-all shadow-sm"
                    >
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1.5 text-foreground flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Total Participants <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={activeRoom.capacity}
                      value={totalParticipants}
                      onChange={(e) => setTotalParticipants(e.target.value)}
                      required
                      placeholder="e.g. 10"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-semibold transition-all shadow-sm"
                    />
                  </div>
                </div>

                {/* Row 3: Agenda */}
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-foreground flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Agenda <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Agenda..."
                    value={agenda}
                    onChange={(e) => setAgenda(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-medium transition-all shadow-sm"
                  />
                </div>

                {/* Row 4: Responsible Department */}
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-foreground flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Responsible Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={responsibleDepartment}
                    onChange={(e) => setResponsibleDepartment(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-semibold transition-all shadow-sm"
                  >
                    {DEPARTMENT_OPTIONS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Row 5: Responsible Persons */}
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-foreground flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Responsible Persons <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Responsible Person Name & ID..."
                    value={responsiblePersons}
                    onChange={(e) => setResponsiblePersons(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-medium transition-all shadow-sm"
                  />
                </div>

                {/* Action Buttons (Submit & Reset) at Bottom Left */}
                <div className="pt-4 border-t border-border flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-7 py-2.5 text-xs font-extrabold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 transition-all shadow-md flex items-center gap-2 tracking-wider uppercase"
                  >
                    <Send className="w-4 h-4" />
                    SUBMIT
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-2.5 text-xs font-extrabold rounded-xl bg-lime-600 hover:bg-lime-700 text-white dark:bg-lime-700 dark:hover:bg-lime-800 active:scale-95 transition-all shadow-sm flex items-center gap-2 tracking-wider uppercase"
                  >
                    <RotateCcw className="w-4 h-4" />
                    RESET
                  </button>
                </div>
              </form>
            </div>

            {/* RIGHT PANEL: BOOKED SLOTS TABLE CARD (6 COLUMNS) */}
            <div className="lg:col-span-6 bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3">
                <div>
                  <h2 className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <Clock3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    Booked Slots
                  </h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Reserved slots for <span className="font-bold text-foreground">{date}</span>
                  </p>
                </div>

                {/* Room Filter Dropdown */}
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                  <select
                    value={slotRoomFilter}
                    onChange={(e) => setSlotRoomFilter(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-xl border border-border bg-background font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    <option value="All">All Rooms</option>
                    {ROOM_SPECS.map((r) => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Booked Slots High-Density Data Table */}
              <div className="rounded-xl border border-border/80 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/70 text-muted-foreground font-bold border-b border-border uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-3.5">Start</th>
                        <th className="p-3.5">End</th>
                        <th className="p-3.5">Booked By</th>
                        <th className="p-3.5">Meeting Agenda</th>
                        <th className="p-3.5">Room</th>
                        <th className="p-3.5 text-center">Status</th>
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
                            <td className="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                              {slot.start}
                            </td>
                            <td className="p-3.5 font-mono font-bold text-muted-foreground whitespace-nowrap">
                              {slot.end}
                            </td>
                            <td className="p-3.5">
                              <div className="font-bold text-foreground">{slot.bookedBy}</div>
                              <div className="text-[10px] text-muted-foreground">{slot.department}</div>
                            </td>
                            <td className="p-3.5 max-w-[200px]">
                              <div className="font-medium text-foreground truncate" title={slot.meetingAgenda}>
                                {slot.meetingAgenda}
                              </div>
                            </td>
                            <td className="p-3.5 whitespace-nowrap font-semibold text-foreground">
                              {slot.room}
                            </td>
                            <td className="p-3.5 text-center whitespace-nowrap">
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
                  <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Showing {filteredBookedSlots.length} reserved slots for {date}
                </span>
                <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
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
