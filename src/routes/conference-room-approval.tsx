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
  Layers,
  CheckSquare,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";

export const Route = createFileRoute("/conference-room-approval")({
  head: () => ({
    meta: [
      { title: "Conference Room Approval — CRIPTON" },
      {
        name: "description",
        content: "Facility Manager portal for time-slot based booking approval, conflict resolution, and room reallocation.",
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
  timeSlot: string;
  attendees: number;
  priority: "Normal" | "High" | "Executive";
  status: "Pending" | "Approved" | "Rescheduled" | "Rejected";
  conflictDetected: boolean;
  remarks: string;
  amenities: string[];
}

const INITIAL_REQUESTS: ApprovalRequest[] = [
  // Conflict Group 1: 3 Competing Requests for Executive Boardroom at 10:00 AM - 11:30 AM on 2026-09-15
  {
    id: "CRB-90214",
    roomName: "Executive Boardroom",
    floor: "5th Floor (HQ)",
    meetingTitle: "Q3 Strategic HR & Payroll Roadmap Review",
    organizer: "Tahmid Afsar Shapno",
    employeeId: "2023043910",
    department: "Software & IT",
    date: "2026-09-15",
    timeSlot: "10:00 AM - 11:30 AM",
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
    timeSlot: "10:00 AM - 11:30 AM",
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
    timeSlot: "10:00 AM - 11:30 AM",
    attendees: 8,
    priority: "Normal",
    status: "Pending",
    conflictDetected: true,
    remarks: "Urgent audit review before Q3 closing.",
    amenities: ["Whiteboard", "Wi-Fi"],
  },

  // Single Requests
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

function ConferenceRoomApprovalPage() {
  const [requests, setRequests] = useState<ApprovalRequest[]>(INITIAL_REQUESTS);
  const [viewMode, setViewMode] = useState<"conflict" | "all">("conflict");
  const [selectedDate, setSelectedDate] = useState("2026-09-15");

  // Reassignment Modal State
  const [reschedulingItem, setReschedulingItem] = useState<ApprovalRequest | null>(null);
  const [newRoom, setNewRoom] = useState("");
  const [newSlot, setNewSlot] = useState("");
  const [rescheduleNote, setRescheduleNote] = useState("");

  // Rejection Modal State
  const [rejectingItem, setRejectingItem] = useState<ApprovalRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 5000);
  };

  // Group Pending Requests by Date + Room + TimeSlot for Smart Conflict Matrix
  const conflictGroups = useMemo(() => {
    const pendingList = requests.filter((r) => r.status === "Pending");
    const map = new Map<string, ApprovalRequest[]>();

    pendingList.forEach((req) => {
      const key = `${req.date}__${req.roomName}__${req.timeSlot}`;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(req);
    });

    const groups: { key: string; date: string; room: string; timeSlot: string; items: ApprovalRequest[] }[] = [];
    map.forEach((items, key) => {
      const [date, room, timeSlot] = key.split("__");
      groups.push({ key, date, room, timeSlot, items });
    });

    return groups;
  }, [requests]);

  const pendingCount = useMemo(() => {
    return requests.filter((r) => r.status === "Pending").length;
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

  // Open Reschedule Modal
  const handleOpenReschedule = (item: ApprovalRequest) => {
    setReschedulingItem(item);
    setNewRoom("Innovation Lab (4th Floor)");
    setNewSlot("11:30 AM - 01:00 PM");
    setRescheduleNote("Slot clash resolved. Reassigned to alternate available room/time.");
  };

  // Confirm Reschedule & Approve with Alternate Slot
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
      `Requisition ${reschedulingItem.id} successfully Rescheduled & Allocated to ${newRoom.split(" (")[0]} (${newSlot})!`
    );
    setReschedulingItem(null);
  };

  // Confirm Rejection
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

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1700px] w-full mx-auto">
          {/* Breadcrumb Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                <span>Facility Management</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span>Conference Room</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-primary">Approvals Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-primary" />
                Conference Room Approval Portal
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Evaluate time-slot booking requests, resolve room clashes, approve primary requisitions, or reassign alternate slots.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1.5 shadow-sm">
                <Clock3 className="w-4 h-4" />
                {pendingCount} Pending Requisitions
              </span>
              {totalConflicts > 0 && (
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1.5 shadow-sm animate-pulse">
                  <AlertTriangle className="w-4 h-4" />
                  {totalConflicts} Slot Conflict Groups
                </span>
              )}
            </div>
          </div>

          {/* Toast Notification Banner */}
          {toastMessage && (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 flex items-center gap-3 shadow-lg animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-xs font-bold">{toastMessage}</span>
            </div>
          )}

          {/* View Mode Toggle Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("conflict")}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                  viewMode === "conflict"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <Layers className="w-4 h-4" />
                Time Slot Conflict Groups ({conflictGroups.length})
              </button>
              <button
                onClick={() => setViewMode("all")}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                  viewMode === "all"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <Filter className="w-4 h-4" />
                All Requisitions List ({requests.length})
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-muted-foreground">Target Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-border bg-background font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          {/* VIEW MODE 1: SMART TIME SLOT CONFLICT GROUPS */}
          {viewMode === "conflict" && (
            <div className="space-y-6">
              {conflictGroups.length === 0 ? (
                <div className="p-12 text-center border border-border rounded-2xl bg-card text-muted-foreground space-y-2 shadow-sm">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h3 className="font-bold text-foreground text-base">All Pending Requisitions Processed!</h3>
                  <p className="text-xs">There are no pending room booking requisitions or time slot conflicts at this time.</p>
                </div>
              ) : (
                conflictGroups.map((group) => {
                  const hasConflict = group.items.length > 1;
                  return (
                    <div
                      key={group.key}
                      className={`p-5 rounded-2xl border transition-all space-y-4 shadow-sm ${
                        hasConflict
                          ? "border-amber-500/40 bg-amber-500/5 ring-1 ring-amber-500/20"
                          : "border-border bg-card"
                      }`}
                    >
                      {/* Conflict Group Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-primary/10 text-primary border border-primary/20">
                              {group.room}
                            </span>
                            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-muted text-muted-foreground">
                              {group.timeSlot}
                            </span>
                            <span className="text-xs font-semibold text-muted-foreground">
                              • {group.date}
                            </span>
                          </div>
                          {hasConflict && (
                            <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                              <AlertTriangle className="w-4 h-4 shrink-0" />
                              <span>
                                {group.items.length} Competing Requisitions for the SAME Room & Time Slot! Approve 1 request and reassign/reschedule the rest.
                              </span>
                            </div>
                          )}
                        </div>

                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-muted text-foreground border border-border self-start sm:self-auto">
                          {group.items.length} {group.items.length === 1 ? "Requisition" : "Competing Requests"}
                        </span>
                      </div>

                      {/* Competing Requisitions Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {group.items.map((item) => (
                          <div
                            key={item.id}
                            className="p-4 rounded-xl border border-border bg-background shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between space-y-3"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-mono font-bold text-primary">{item.id}</span>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    item.priority === "Executive"
                                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                      : item.priority === "High"
                                      ? "bg-red-500/10 text-red-600 border border-red-500/20"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {item.priority} Priority
                                </span>
                              </div>

                              <h4 className="font-bold text-xs text-foreground line-clamp-2">{item.meetingTitle}</h4>

                              <div className="p-2.5 rounded-lg bg-muted/50 border border-border/40 text-[11px] space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Organizer:</span>
                                  <span className="font-bold text-foreground">{item.organizer}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Department:</span>
                                  <span className="font-mono text-foreground">{item.department}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Participants:</span>
                                  <span className="font-semibold text-foreground">{item.attendees} Seats</span>
                                </div>
                              </div>

                              {item.remarks && (
                                <p className="text-[11px] text-muted-foreground italic line-clamp-2">
                                  &quot;{item.remarks}&quot;
                                </p>
                              )}
                            </div>

                            {/* Action Buttons for Approver */}
                            <div className="pt-2 border-t border-border flex flex-col gap-2">
                              {/* Direct Approve */}
                              <button
                                onClick={() => handleApprove(item.id, item.roomName, item.timeSlot)}
                                className="w-full py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Approve This Booking
                              </button>

                              <div className="flex items-center gap-2">
                                {/* Reschedule / Offer Alternate Slot */}
                                <button
                                  onClick={() => handleOpenReschedule(item)}
                                  className="flex-1 py-1.5 text-[11px] font-bold rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 transition-all flex items-center justify-center gap-1"
                                >
                                  <ArrowRightLeft className="w-3 h-3" />
                                  Reschedule Slot
                                </button>
                                {/* Reject */}
                                <button
                                  onClick={() => setRejectingItem(item)}
                                  className="py-1.5 px-3 text-[11px] font-bold rounded-lg border border-red-500/30 bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-all flex items-center justify-center gap-1"
                                >
                                  <XCircle className="w-3 h-3" />
                                  Reject
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* VIEW MODE 2: ALL REQUISITIONS LIST */}
          {viewMode === "all" && (
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden space-y-4 p-4 sm:p-6">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                All Requisitions Status & Allocation Log
              </h3>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/70 text-muted-foreground font-bold border-b border-border uppercase text-[11px]">
                      <tr>
                        <th className="p-3.5">Requisition ID</th>
                        <th className="p-3.5">Meeting & Room</th>
                        <th className="p-3.5">Organizer & Dept</th>
                        <th className="p-3.5">Date & Time Slot</th>
                        <th className="p-3.5 text-center">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {requests.map((record) => (
                        <tr key={record.id} className="hover:bg-accent/40 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-primary">{record.id}</td>
                          <td className="p-3.5">
                            <div className="font-bold text-foreground">{record.meetingTitle}</div>
                            <div className="text-[11px] text-muted-foreground">{record.roomName}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-semibold text-foreground">{record.organizer}</div>
                            <div className="text-[11px] text-muted-foreground font-mono">{record.department}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-medium text-foreground">{record.date}</div>
                            <div className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">{record.timeSlot}</div>
                          </td>
                          <td className="p-3.5 text-center whitespace-nowrap">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                record.status === "Approved"
                                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : record.status === "Rescheduled"
                                  ? "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400"
                                  : record.status === "Pending"
                                  ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                  : "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                              }`}
                            >
                              {record.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            {record.status === "Pending" && (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleApprove(record.id, record.roomName, record.timeSlot)}
                                  className="px-2.5 py-1 text-[11px] font-bold rounded bg-emerald-600 text-white hover:bg-emerald-700"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleOpenReschedule(record)}
                                  className="px-2.5 py-1 text-[11px] font-bold rounded bg-purple-600 text-white hover:bg-purple-700"
                                >
                                  Reschedule
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RESCHEDULE & ALLOCATE ALTERNATE SLOT MODAL */}
        {reschedulingItem && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <form onSubmit={handleConfirmReschedule} className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-extrabold text-base text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5" /> Reschedule & Allocate Alternate Slot
                </h3>
                <button
                  type="button"
                  onClick={() => setReschedulingItem(null)}
                  className="text-muted-foreground hover:text-foreground text-sm font-bold px-2 py-1 rounded bg-muted"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                  <span className="text-muted-foreground font-semibold">Current Requested Booking:</span>
                  <p className="font-bold text-foreground text-sm">{reschedulingItem.meetingTitle}</p>
                  <p className="text-[11px] text-muted-foreground">
                    By <span className="font-bold text-foreground">{reschedulingItem.organizer}</span> ({reschedulingItem.department})
                  </p>
                  <p className="text-[11px] font-mono text-amber-600 dark:text-amber-400">
                    Requested: {reschedulingItem.roomName} • {reschedulingItem.timeSlot}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-muted-foreground">
                    Allocate Alternate Conference Room *
                  </label>
                  <select
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  >
                    {ALTERNATE_ROOMS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-muted-foreground">
                    Allocate Alternate Time Slot *
                  </label>
                  <select
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/40 font-mono"
                  >
                    {ALTERNATE_TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-muted-foreground">
                    Reschedule Justification / Note to Requester
                  </label>
                  <textarea
                    rows={2}
                    value={rescheduleNote}
                    onChange={(e) => setRescheduleNote(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setReschedulingItem(null)}
                  className="px-4 py-2 text-xs font-bold rounded-lg border border-border bg-background hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-purple-600 text-white hover:bg-purple-700 shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve with Alternate Slot
                </button>
              </div>
            </form>
          </div>
        )}

        {/* REJECTION MODAL */}
        {rejectingItem && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <form onSubmit={handleConfirmReject} className="bg-card border border-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
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

              <div className="space-y-2 text-xs">
                <p className="text-muted-foreground">
                  You are rejecting requisition <span className="font-mono font-bold text-foreground">{rejectingItem.id}</span> for &quot;{rejectingItem.meetingTitle}&quot;.
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
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-red-500/40"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectingItem(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-border bg-background hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-md"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
