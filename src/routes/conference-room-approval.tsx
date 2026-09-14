import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  DoorOpen,
  CheckCircle2,
  XCircle,
  Clock3,
  Calendar,
  Clock,
  User,
  Building2,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Send,
  MessageSquare,
  Sparkles,
  ArrowRightLeft,
  Filter,
  CheckSquare,
  RefreshCw,
  SlidersHorizontal,
  Search,
} from "lucide-react";

export const Route = createFileRoute("/conference-room-approval")({
  head: () => ({
    meta: [
      { title: "Conference Room Approval — CRIPTON" },
      {
        name: "description",
        content: "Facility Manager portal for time-slot based booking approval, conflict resolution, room reallocation, and cancellation management.",
      },
    ],
  }),
  component: ConferenceRoomApprovalPage,
});

interface ApprovalRequest {
  id: string;
  roomName: string;
  floor: string;
  meetingTitle: string;
  organizer: string;
  employeeId: string;
  department: string;
  date: string;
  timeSlot: string; // Individual requested slot e.g. "10:00 AM - 11:00 AM"
  startTimeMin: number;
  endTimeMin: number;
  attendees: number;
  priority: "Normal" | "High" | "Executive";
  status: "Pending" | "Approved" | "Rescheduled" | "Rejected" | "Cancelled";
  conflictDetected: boolean;
  remarks: string;
  amenities: string[];
}

const INITIAL_REQUESTS: ApprovalRequest[] = [
  // Already Approved Bookings (Eligible for Reschedule & Cancel)
  {
    id: "CRB-90199",
    roomName: "Conference Room A",
    floor: "3rd Floor",
    meetingTitle: "Weekly Executive Leadership Standup",
    organizer: "Syed Golam Kibria",
    employeeId: "2018021104",
    department: "Executive Committee",
    date: "2026-09-15",
    timeSlot: "08:30 AM - 09:30 AM",
    startTimeMin: 510,
    endTimeMin: 570,
    attendees: 10,
    priority: "Executive",
    status: "Approved",
    conflictDetected: false,
    remarks: "Approved by Facility Manager.",
    amenities: ["4K Display", "Coffee Service"],
  },
  {
    id: "CRB-90205",
    roomName: "Executive Boardroom",
    floor: "5th Floor (HQ)",
    meetingTitle: "Foreign Investors Video Conference",
    organizer: "Anisur Rahman",
    employeeId: "2019034412",
    department: "International Business",
    date: "2026-09-15",
    timeSlot: "02:00 PM - 03:30 PM",
    startTimeMin: 840,
    endTimeMin: 930,
    attendees: 6,
    priority: "Executive",
    status: "Approved",
    conflictDetected: false,
    remarks: "Confirmed & locked for Zoom Teleconference.",
    amenities: ["Polycom Video Conf", "Tea & Snacks"],
  },

  // Conflict Group 1: 3 Overlapping Requests for Executive Boardroom on 2026-09-15
  {
    id: "CRB-90214",
    roomName: "Executive Boardroom",
    floor: "5th Floor (HQ)",
    meetingTitle: "Q3 Strategic HR & Payroll Roadmap Review",
    organizer: "Tahmid Afsar Shapno",
    employeeId: "2023043910",
    department: "Software & IT",
    date: "2026-09-15",
    timeSlot: "10:00 AM - 11:00 AM",
    startTimeMin: 600,
    endTimeMin: 660,
    attendees: 12,
    priority: "Executive",
    status: "Pending",
    conflictDetected: true,
    remarks: "Requires Boardroom setup with 4K Display.",
    amenities: ["4K Display", "Video Conf", "Tea & Snacks"],
  },
  {
    id: "CRB-90218",
    roomName: "Executive Boardroom",
    floor: "5th Floor (HQ)",
    meetingTitle: "Merchandising Buyer Briefing & Order Review",
    organizer: "Farhana Ahmed",
    employeeId: "2021088921",
    department: "Merchandising",
    date: "2026-09-15",
    timeSlot: "10:30 AM - 11:00 AM",
    startTimeMin: 630,
    endTimeMin: 660,
    attendees: 15,
    priority: "High",
    status: "Pending",
    conflictDetected: true,
    remarks: "Overseas buyers joining via Video Conf.",
    amenities: ["Polycom Video Conf", "Coffee Service"],
  },
  {
    id: "CRB-90222",
    roomName: "Executive Boardroom",
    floor: "5th Floor (HQ)",
    meetingTitle: "Accounts & Financial Audit Compliance",
    organizer: "Kamrul Hasan",
    employeeId: "2019012300",
    department: "Accounts & Finance",
    date: "2026-09-15",
    timeSlot: "10:50 AM - 11:30 AM",
    startTimeMin: 650,
    endTimeMin: 690,
    attendees: 8,
    priority: "Normal",
    status: "Pending",
    conflictDetected: true,
    remarks: "Urgent audit review before Q3 closing.",
    amenities: ["Whiteboard", "Wi-Fi"],
  },

  // Single Non-conflicting Requests
  {
    id: "CRB-90215",
    roomName: "Innovation Lab",
    floor: "4th Floor",
    meetingTitle: "UI/UX & Mobile App Architecture Demo",
    organizer: "Dipon Saha",
    employeeId: "2022035599",
    department: "Core Development",
    date: "2026-09-15",
    timeSlot: "02:00 PM - 03:30 PM",
    startTimeMin: 840,
    endTimeMin: 930,
    attendees: 8,
    priority: "Normal",
    status: "Pending",
    conflictDetected: false,
    remarks: "Requires Smart Screen and high speed Wi-Fi setup.",
    amenities: ["Smart Screen", "Wi-Fi"],
  },
  {
    id: "CRB-90220",
    roomName: "Grand Auditorium",
    floor: "Ground Floor",
    meetingTitle: "Safety & Compliance Orientation Workshop",
    organizer: "Rakibul Hasan",
    employeeId: "2020054410",
    department: "EHS & Compliance",
    date: "2026-09-17",
    timeSlot: "10:00 AM - 01:00 PM",
    startTimeMin: 600,
    endTimeMin: 780,
    attendees: 45,
    priority: "Normal",
    status: "Pending",
    conflictDetected: false,
    remarks: "Full audio/visual setup needed with mic support.",
    amenities: ["Dual Projectors", "Surround Sound Audio", "Podium Mic"],
  },
];

const ALTERNATE_ROOMS = [
  "Executive Boardroom (5th Floor)",
  "Innovation Lab (4th Floor)",
  "Conference Room A (3rd Floor)",
  "Grand Auditorium & Training Hall (Ground Floor)",
];

const ALTERNATE_TIME_SLOTS = [
  "08:30 AM - 10:00 AM",
  "11:30 AM - 01:00 PM",
  "01:30 PM - 03:00 PM",
  "03:30 PM - 05:00 PM",
  "05:00 PM - 06:30 PM",
];

function formatMinToTime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h % 12 === 0 ? 12 : h % 12;
  const displayM = m < 10 ? `0${m}` : `${m}`;
  return `${displayH < 10 ? "0" + displayH : displayH}:${displayM} ${period}`;
}

function ConferenceRoomApprovalPage() {
  const [requests, setRequests] = useState<ApprovalRequest[]>(INITIAL_REQUESTS);
  const [selectedDate, setSelectedDate] = useState("2026-09-15");
  const [selectedRoomFilter, setSelectedRoomFilter] = useState("All");
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("All");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");

  // Reassignment / Reschedule Modal State
  const [reschedulingItem, setReschedulingItem] = useState<ApprovalRequest | null>(null);
  const [newRoom, setNewRoom] = useState("");
  const [newSlot, setNewSlot] = useState("");
  const [rescheduleNote, setRescheduleNote] = useState("");

  // Rejection Modal State
  const [rejectingItem, setRejectingItem] = useState<ApprovalRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Cancel Approved Booking Modal State
  const [cancellingItem, setCancellingItem] = useState<ApprovalRequest | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");

  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 5000);
  };

  // Group Pending Requests by Date + Room where time windows overlap continuously
  const conflictGroups = useMemo(() => {
    const pendingList = requests.filter((r) => {
      const matchesStatus = r.status === "Pending";
      const matchesDate = !selectedDate || r.date === selectedDate;
      const matchesRoom = selectedRoomFilter === "All" || r.roomName === selectedRoomFilter;
      const matchesTime = selectedTimeFilter === "All" || r.timeSlot.includes(selectedTimeFilter);
      const matchesConsoleStatus = selectedStatusFilter === "All" || selectedStatusFilter === "Pending";
      return matchesStatus && matchesDate && matchesRoom && matchesTime && matchesConsoleStatus;
    });
    
    const roomDateMap = new Map<string, ApprovalRequest[]>();
    pendingList.forEach((req) => {
      const key = `${req.date}__${req.roomName}`;
      if (!roomDateMap.has(key)) roomDateMap.set(key, []);
      roomDateMap.get(key)!.push(req);
    });

    const resultGroups: {
      key: string;
      date: string;
      room: string;
      mergedTimeSpan: string;
      items: ApprovalRequest[];
    }[] = [];

    roomDateMap.forEach((items, key) => {
      const [date, room] = key.split("__");
      const sorted = [...items].sort((a, b) => a.startTimeMin - b.startTimeMin);

      let currentCluster: ApprovalRequest[] = [];
      let minStart = Infinity;
      let maxEnd = -Infinity;

      sorted.forEach((item) => {
        if (currentCluster.length === 0) {
          currentCluster.push(item);
          minStart = item.startTimeMin;
          maxEnd = item.endTimeMin;
        } else {
          if (item.startTimeMin < maxEnd) {
            currentCluster.push(item);
            maxEnd = Math.max(maxEnd, item.endTimeMin);
          } else {
            const mergedSpan = `${formatMinToTime(minStart)} - ${formatMinToTime(maxEnd)}`;
            resultGroups.push({
              key: `${key}__${mergedSpan}`,
              date,
              room,
              mergedTimeSpan: mergedSpan,
              items: currentCluster,
            });

            currentCluster = [item];
            minStart = item.startTimeMin;
            maxEnd = item.endTimeMin;
          }
        }
      });

      if (currentCluster.length > 0) {
        const mergedSpan = `${formatMinToTime(minStart)} - ${formatMinToTime(maxEnd)}`;
        resultGroups.push({
          key: `${key}__${mergedSpan}`,
          date,
          room,
          mergedTimeSpan: mergedSpan,
          items: currentCluster,
        });
      }
    });

    return resultGroups;
  }, [requests, selectedDate, selectedRoomFilter, selectedTimeFilter, selectedStatusFilter]);

  // Approved & Rescheduled List for second section
  const approvedAndRescheduledList = useMemo(() => {
    return requests.filter((r) => {
      const isApprovedOrRescheduled = r.status === "Approved" || r.status === "Rescheduled";
      const matchesDate = !selectedDate || r.date === selectedDate;
      const matchesRoom = selectedRoomFilter === "All" || r.roomName === selectedRoomFilter;
      const matchesTime = selectedTimeFilter === "All" || r.timeSlot.includes(selectedTimeFilter);
      const matchesStatus =
        selectedStatusFilter === "All" ||
        (selectedStatusFilter === "Approved" && r.status === "Approved") ||
        (selectedStatusFilter === "Rescheduled" && r.status === "Rescheduled");
      return isApprovedOrRescheduled && matchesDate && matchesRoom && matchesTime && matchesStatus;
    });
  }, [requests, selectedDate, selectedRoomFilter, selectedTimeFilter, selectedStatusFilter]);

  const pendingCount = useMemo(() => {
    return requests.filter((r) => r.status === "Pending").length;
  }, [requests]);

  const approvedCount = useMemo(() => {
    return requests.filter((r) => r.status === "Approved" || r.status === "Rescheduled").length;
  }, [requests]);

  const totalConflicts = useMemo(() => {
    return conflictGroups.filter((g) => g.items.length > 1).length;
  }, [conflictGroups]);

  // Handle Direct Approval
  const handleApprove = (id: string, room: string, slot: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Approved" as const } : r))
    );
    showToast(`Requisition ${id} has been Approved for ${room} (${slot})!`);
  };

  // Open Reschedule Modal (Supports both Pending and Approved items)
  const handleOpenReschedule = (item: ApprovalRequest) => {
    setReschedulingItem(item);
    setNewRoom("Innovation Lab (4th Floor)");
    setNewSlot("11:30 AM - 01:00 PM");
    setRescheduleNote(
      item.status === "Approved"
        ? "Re-scheduling previously approved booking per manager request."
        : "Slot clash resolved. Reassigned to alternate available room/time."
    );
  };

  // Confirm Reschedule & Update Booking
  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingItem) return;

    setRequests((prev) =>
      prev.map((r) =>
        r.id === reschedulingItem.id
          ? {
              ...r,
              roomName: newRoom.split(" (")[0],
              timeSlot: newSlot,
              status: "Rescheduled" as const,
              conflictDetected: false,
              remarks: rescheduleNote,
            }
          : r
      )
    );

    showToast(
      `Booking ${reschedulingItem.id} successfully Rescheduled & Reallocated to ${newRoom.split(" (")[0]} (${newSlot})!`
    );
    setReschedulingItem(null);
  };

  // Confirm Rejection (for Pending items)
  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingItem) return;

    setRequests((prev) =>
      prev.map((r) => (r.id === rejectingItem.id ? { ...r, status: "Rejected" as const } : r))
    );

    showToast(`Requisition ${rejectingItem.id} has been Rejected.`);
    setRejectingItem(null);
    setRejectionReason("");
  };

  // Open Cancellation Modal for Approved Bookings
  const handleOpenCancelApproved = (item: ApprovalRequest) => {
    setCancellingItem(item);
    setCancellationReason("Booking cancelled after approval due to emergency schedule change.");
  };

  // Confirm Cancellation for Approved Bookings
  const handleConfirmCancelApproved = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingItem) return;

    setRequests((prev) =>
      prev.map((r) =>
        r.id === cancellingItem.id
          ? { ...r, status: "Cancelled" as const, remarks: `Cancelled post-approval: ${cancellationReason}` }
          : r
      )
    );

    showToast(`Approved booking ${cancellingItem.id} has been Cancelled. Room slot released.`);
    setCancellingItem(null);
    setCancellationReason("");
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300 font-sans">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto font-sans">
        <Topbar />

        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1750px] w-full mx-auto font-sans">
          {/* Breadcrumb Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                <span>Facility Management</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span>Conference Room</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-primary font-bold">Approvals Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                Conference Room Approval Portal
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Evaluate overlapping booking requests, resolve room clashes, approve primary requisitions, reschedule approved bookings, or cancel confirmed allocations.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1.5 shadow-sm font-sans">
                <Clock3 className="w-4 h-4" />
                {pendingCount} Pending Requisitions
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5 shadow-sm font-sans">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {approvedCount} Approved Bookings
              </span>
              {totalConflicts > 0 && (
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1.5 shadow-sm animate-pulse font-sans">
                  <AlertTriangle className="w-4 h-4" />
                  {totalConflicts} Overlapping Slot Window Groups
                </span>
              )}
            </div>
          </div>

          {/* Toast Notification Banner */}
          {toastMessage && (
            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 flex items-center gap-3 shadow-lg animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-xs font-bold font-sans">{toastMessage}</span>
            </div>
          )}

          {/* TOP FILTER CONSOLE BOX (DATE FILTER, TIME FILTER, ROOM WISE FILTER, STATUS FILTER) */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm space-y-3 font-sans">
            <div className="flex flex-col sm:flex-row items-end gap-4">
              
              {/* Date Filter */}
              <div className="w-full sm:w-56">
                <label className="block text-xs font-bold mb-1.5 text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Filter Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-background font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-sans"
                />
              </div>

              {/* Room Wise Filter */}
              <div className="w-full sm:w-56">
                <label className="block text-xs font-bold mb-1.5 text-muted-foreground flex items-center gap-1.5">
                  <DoorOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Room Wise Filter
                </label>
                <select
                  value={selectedRoomFilter}
                  onChange={(e) => setSelectedRoomFilter(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-background font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-sans"
                >
                  <option value="All">All Rooms</option>
                  <option value="Executive Boardroom">Executive Boardroom</option>
                  <option value="Innovation Lab">Innovation Lab</option>
                  <option value="Conference Room A">Conference Room A</option>
                  <option value="Grand Auditorium">Grand Auditorium</option>
                </select>
              </div>

              {/* Time Slot Filter */}
              <div className="w-full sm:w-56">
                <label className="block text-xs font-bold mb-1.5 text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Time Slot Filter
                </label>
                <select
                  value={selectedTimeFilter}
                  onChange={(e) => setSelectedTimeFilter(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-background font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-sans"
                >
                  <option value="All">All Time Slots</option>
                  <option value="08:30 AM">08:30 AM Window</option>
                  <option value="10:00 AM">10:00 AM Window</option>
                  <option value="10:30 AM">10:30 AM Window</option>
                  <option value="10:50 AM">10:50 AM Window</option>
                  <option value="02:00 PM">02:00 PM Window</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="w-full sm:w-48">
                <label className="block text-xs font-bold mb-1.5 text-muted-foreground flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Status Filter
                </label>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-background font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-sans"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending Only</option>
                  <option value="Approved">Approved Only</option>
                  <option value="Rescheduled">Rescheduled Only</option>
                </select>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => showToast(`Applied filters for ${selectedDate}`)}
                  className="w-full sm:w-auto px-6 py-2 text-xs font-extrabold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-md flex items-center justify-center gap-2 font-sans"
                >
                  <Search className="w-3.5 h-3.5" />
                  APPLY FILTERS
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 1: PENDING REQUISITIONS (GROUPED BY OVERLAPPING TIME SLOTS) */}
          {(selectedStatusFilter === "All" || selectedStatusFilter === "Pending") && (
            <div className="space-y-4 font-sans">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
                  <Clock3 className="w-5 h-5 text-amber-500" />
                  Pending Requisitions (Time Slot Overlap View)
                </h2>
                <span className="text-xs font-bold text-muted-foreground">
                  {conflictGroups.length} Slot Groups
                </span>
              </div>

              {conflictGroups.length === 0 ? (
                <div className="p-8 text-center border border-border rounded-2xl bg-card text-muted-foreground space-y-2 shadow-sm font-sans">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <h3 className="font-bold text-foreground text-sm">No Pending Requisitions</h3>
                  <p className="text-xs">There are no pending room booking requisitions matching the selected date and filters.</p>
                </div>
              ) : (
                conflictGroups.map((group) => {
                  const hasConflict = group.items.length > 1;
                  return (
                    <div
                      key={group.key}
                      className={`p-5 rounded-2xl border transition-all space-y-4 shadow-sm font-sans ${
                        hasConflict
                          ? "border-amber-500/40 bg-amber-500/5 ring-1 ring-amber-500/20"
                          : "border-border bg-card"
                      }`}
                    >
                      {/* Clean Merged Time Window Group Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3 font-sans">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-sans">
                            {group.room}
                          </span>
                          <span className="text-xs font-bold px-3 py-1 rounded-lg bg-muted text-foreground border border-border flex items-center gap-1.5 font-sans">
                            <Clock className="w-3.5 h-3.5 text-emerald-600" />
                            Merged Window: {group.mergedTimeSpan}
                          </span>
                          <span className="text-xs font-semibold text-muted-foreground font-sans">
                            • {group.date}
                          </span>
                        </div>

                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-muted text-foreground border border-border self-start sm:self-auto font-sans">
                          {group.items.length} {group.items.length === 1 ? "Requisition" : "Competing Requests"}
                        </span>
                      </div>

                      {/* HIGH-DENSITY TABLE LIST VIEW FOR INDIVIDUAL REQUESTED TIME SLOTS */}
                      <div className="rounded-xl border border-border/80 overflow-hidden bg-card shadow-sm font-sans">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs font-sans">
                            <thead className="bg-muted/70 text-muted-foreground font-bold border-b border-border uppercase tracking-wider text-[11px] font-sans">
                              <tr>
                                <th className="p-3.5">Req ID</th>
                                <th className="p-3.5">Individual Requested Time</th>
                                <th className="p-3.5">Meeting Subject & Agenda</th>
                                <th className="p-3.5">Organizer & Dept</th>
                                <th className="p-3.5 text-center">Attendees</th>
                                <th className="p-3.5 text-center">Priority</th>
                                <th className="p-3.5 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60 font-sans">
                              {group.items.map((item) => (
                                <tr key={item.id} className="hover:bg-accent/40 transition-colors">
                                  <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap font-sans">
                                    {item.id}
                                  </td>

                                  {/* Individual Requested Slot Column */}
                                  <td className="p-3.5 whitespace-nowrap">
                                    <div className="font-bold text-xs text-foreground px-2.5 py-1 rounded-lg bg-muted inline-block border border-border font-sans">
                                      {item.timeSlot}
                                    </div>
                                  </td>

                                  <td className="p-3.5 max-w-[280px]">
                                    <div className="font-bold text-foreground line-clamp-1">{item.meetingTitle}</div>
                                    {item.remarks && (
                                      <div className="text-[11px] text-muted-foreground italic truncate">
                                        &quot;{item.remarks}&quot;
                                      </div>
                                    )}
                                  </td>
                                  <td className="p-3.5 whitespace-nowrap">
                                    <div className="font-bold text-foreground">{item.organizer}</div>
                                    <div className="text-[11px] text-muted-foreground font-semibold font-sans">{item.department}</div>
                                  </td>
                                  <td className="p-3.5 text-center font-bold text-foreground whitespace-nowrap">
                                    {item.attendees} Seats
                                  </td>
                                  <td className="p-3.5 text-center whitespace-nowrap">
                                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-sans ${
                                      item.priority === "Executive"
                                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                        : item.priority === "High"
                                        ? "bg-red-500/10 text-red-600 border border-red-500/20"
                                        : "bg-muted text-muted-foreground"
                                    }`}>
                                      {item.priority}
                                    </span>
                                  </td>
                                  <td className="p-3.5 text-right whitespace-nowrap font-sans">
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        onClick={() => handleApprove(item.id, item.roomName, item.timeSlot)}
                                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition-all shadow-sm flex items-center gap-1 font-sans"
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                                      </button>
                                      <button
                                        onClick={() => handleOpenReschedule(item)}
                                        className="px-3 py-1.5 text-xs font-bold rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 transition-all flex items-center gap-1 font-sans"
                                      >
                                        <ArrowRightLeft className="w-3.5 h-3.5" /> Reschedule Slot
                                      </button>
                                      <button
                                        onClick={() => setRejectingItem(item)}
                                        className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-red-500/30 bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-all flex items-center gap-1 font-sans"
                                      >
                                        <XCircle className="w-3.5 h-3.5" /> Reject
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* SECTION 2: APPROVED & CONFIRMED BOOKINGS (SUPPORT RESCHEDULING & CANCELLATION) */}
          {(selectedStatusFilter === "All" || selectedStatusFilter === "Approved" || selectedStatusFilter === "Rescheduled") && (
            <div className="space-y-4 pt-4 font-sans">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Approved & Confirmed Bookings (Can be Rescheduled or Cancelled)
                </h2>
                <span className="text-xs font-bold text-muted-foreground">
                  {approvedAndRescheduledList.length} Active Bookings
                </span>
              </div>

              <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm font-sans">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-muted/70 text-muted-foreground font-bold border-b border-border uppercase tracking-wider text-[11px] font-sans">
                      <tr>
                        <th className="p-3.5">Req ID</th>
                        <th className="p-3.5">Allocated Room</th>
                        <th className="p-3.5">Date & Time Slot</th>
                        <th className="p-3.5">Meeting Title & Organizer</th>
                        <th className="p-3.5">Department</th>
                        <th className="p-3.5 text-center">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 font-sans">
                      {approvedAndRescheduledList.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-muted-foreground font-medium">
                            No approved bookings match the selected filter.
                          </td>
                        </tr>
                      ) : (
                        approvedAndRescheduledList.map((item) => (
                          <tr key={item.id} className="hover:bg-accent/40 transition-colors">
                            <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap font-sans">
                              {item.id}
                            </td>
                            <td className="p-3.5 whitespace-nowrap">
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/20 font-sans">
                                {item.roomName}
                              </span>
                            </td>
                            <td className="p-3.5 whitespace-nowrap font-sans">
                              <div className="font-bold text-foreground">{item.date}</div>
                              <div className="text-[11px] font-semibold text-muted-foreground">{item.timeSlot}</div>
                            </td>
                            <td className="p-3.5 max-w-[260px]">
                              <div className="font-bold text-foreground line-clamp-1">{item.meetingTitle}</div>
                              <div className="text-[11px] text-muted-foreground font-medium">By {item.organizer}</div>
                            </td>
                            <td className="p-3.5 whitespace-nowrap font-semibold text-muted-foreground">
                              {item.department}
                            </td>
                            <td className="p-3.5 text-center whitespace-nowrap">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center justify-center gap-1 font-sans ${
                                item.status === "Approved"
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                  : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                              }`}>
                                <CheckCircle2 className="w-3 h-3" />
                                {item.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right whitespace-nowrap font-sans">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenReschedule(item)}
                                  className="px-3 py-1.5 text-xs font-bold rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 transition-all flex items-center gap-1 font-sans"
                                >
                                  <ArrowRightLeft className="w-3.5 h-3.5" /> Reschedule Slot
                                </button>
                                <button
                                  onClick={() => handleOpenCancelApproved(item)}
                                  className="px-3 py-1.5 text-xs font-bold rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-all flex items-center gap-1 font-sans"
                                >
                                  <XCircle className="w-3.5 h-3.5" /> Cancel Booking
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RESCHEDULE & ALLOCATE ALTERNATE SLOT MODAL (FOR BOTH PENDING AND APPROVED BOOKINGS) */}
        {reschedulingItem && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
            <form onSubmit={handleConfirmReschedule} className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 font-sans">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-extrabold text-base text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5" /> Reschedule Booking & Reallocate Slot
                </h3>
                <button
                  type="button"
                  onClick={() => setReschedulingItem(null)}
                  className="text-muted-foreground hover:text-foreground text-sm font-bold px-2 py-1 rounded bg-muted"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs font-sans">
                <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">Target Booking:</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-foreground border border-border">
                      Current Status: {reschedulingItem.status}
                    </span>
                  </div>
                  <p className="font-bold text-foreground text-sm">{reschedulingItem.meetingTitle}</p>
                  <p className="text-[11px] text-muted-foreground">
                    By <span className="font-bold text-foreground">{reschedulingItem.organizer}</span> ({reschedulingItem.department})
                  </p>
                  <p className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
                    Currently Assigned: {reschedulingItem.roomName} • {reschedulingItem.timeSlot} ({reschedulingItem.date})
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-muted-foreground">
                    Reallocate Alternate Conference Room *
                  </label>
                  <select
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/40 font-sans"
                  >
                    {ALTERNATE_ROOMS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-muted-foreground">
                    Reallocate Alternate Time Slot *
                  </label>
                  <select
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/40 font-sans"
                  >
                    {ALTERNATE_TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-muted-foreground">
                    Reschedule Reason / Remarks for Requester
                  </label>
                  <textarea
                    rows={2}
                    value={rescheduleNote}
                    onChange={(e) => setRescheduleNote(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/40 font-sans"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between font-sans">
                <button
                  type="button"
                  onClick={() => setReschedulingItem(null)}
                  className="px-4 py-2 text-xs font-bold rounded-lg border border-border bg-background hover:bg-accent font-sans"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-purple-600 text-white hover:bg-purple-700 shadow-md flex items-center gap-1.5 font-sans"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Save Rescheduled Booking
                </button>
              </div>
            </form>
          </div>
        )}

        {/* REJECTION MODAL (FOR PENDING REQUISITIONS) */}
        {rejectingItem && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
            <form onSubmit={handleConfirmReject} className="bg-card border border-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 font-sans">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-base text-red-600 flex items-center gap-2">
                  <XCircle className="w-5 h-5" /> Reject Booking Requisition
                </h3>
                <button
                  type="button"
                  onClick={() => setRejectingItem(null)}
                  className="text-muted-foreground hover:text-foreground text-sm font-bold px-2 py-1 rounded bg-muted"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-xs font-sans">
                <p className="text-muted-foreground">
                  You are rejecting requisition <span className="font-bold text-foreground font-sans">{rejectingItem.id}</span> for &quot;{rejectingItem.meetingTitle}&quot;.
                </p>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                    Reason for Rejection *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide justification e.g. Room reserved for Executive Board / Slot unavailable..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-red-500/40 font-sans"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2 font-sans">
                <button
                  type="button"
                  onClick={() => setRejectingItem(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-border bg-background hover:bg-accent font-sans"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-md font-sans"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        )}

        {/* CANCEL APPROVED BOOKING MODAL */}
        {cancellingItem && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
            <form onSubmit={handleConfirmCancelApproved} className="bg-card border border-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 font-sans">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-base text-rose-600 flex items-center gap-2">
                  <XCircle className="w-5 h-5" /> Cancel Approved Booking
                </h3>
                <button
                  type="button"
                  onClick={() => setCancellingItem(null)}
                  className="text-muted-foreground hover:text-foreground text-sm font-bold px-2 py-1 rounded bg-muted"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs font-sans">
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-900 dark:text-rose-200">
                  <p className="font-bold">Are you sure you want to cancel this approved allocation?</p>
                  <p className="mt-1 text-[11px]">
                    Booking <span className="font-bold">{cancellingItem.id}</span> ({cancellingItem.meetingTitle}) for {cancellingItem.roomName} on {cancellingItem.date} ({cancellingItem.timeSlot}) will be revoked and room slot released.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-muted-foreground">
                    Reason for Cancellation *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Reason for revoking approved booking slot..."
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-rose-500/40 font-sans"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2 font-sans">
                <button
                  type="button"
                  onClick={() => setCancellingItem(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-border bg-background hover:bg-accent font-sans"
                >
                  Keep Booking
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-rose-600 text-white hover:bg-rose-700 shadow-md font-sans"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
