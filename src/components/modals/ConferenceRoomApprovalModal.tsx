import React, { useState, useEffect } from "react";
import {
  X,
  DoorOpen,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  Building2,
  MapPin,
  MessageSquare,
  AlertCircle,
  Calendar,
  Users,
  User,
  Check,
  BuildingIcon,
  LayersIcon,
  CalendarDays,
  FileCheck,
  Edit3,
  History,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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

export interface ConferenceRoomApprovalModalData {
  id: string;
  reqNo: string;
  applicationDate: string;
  submittedTime: string;
  status: "Pending" | "Approved" | "Rejected";
  employee: {
    name: string;
    id: string;
    designation: string;
    department: string;
    section?: string;
    location?: string;
    joiningDate?: string;
    businessUnit?: string;
  };
  bookingDetails: {
    meetingRoom: string;
    date: string;
    startTime: string;
    endTime: string;
    agenda: string;
    totalParticipants: number;
    responsibleDepts: string;
    responsiblePersons?: Array<{
      name: string;
      designation: string;
      department: string;
      company: string;
      phone: string;
    }>;
  };
  scheduleHistory?: ScheduleHistory;
  timeline?: Array<{
    stage: string;
    roleLabel: string;
    approverName: string;
    approverDesignation: string;
    status: "approved" | "pending" | "rejected";
    date: string;
  }>;
  comments?: Array<{
    id: string;
    authorName: string;
    authorRole: string;
    timestamp: string;
    comment: string;
    initials: string;
  }>;
}

interface ConferenceRoomApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ConferenceRoomApprovalModalData | null;
  onStatusChange?: (
    id: string,
    newStatus: "Approved" | "Rejected",
    updatedBooking?: Partial<ConferenceRoomApprovalModalData["bookingDetails"]>,
    scheduleHistory?: ScheduleHistory
  ) => void;
}

const ROOM_OPTIONS = [
  "Conference Room 1",
  "Executive Boardroom",
  "Innovation Lab",
  "Conference Room A",
  "Grand Auditorium",
  "Meeting Room B",
];

export function ConferenceRoomApprovalModal({
  isOpen,
  onClose,
  data,
  onStatusChange,
}: ConferenceRoomApprovalModalProps) {
  if (!isOpen || !data) return null;

  const [approvalComment, setApprovalComment] = useState("");
  const [currentStatus, setCurrentStatus] = useState<"Pending" | "Approved" | "Rejected">(
    data.status
  );
  const [commentsList, setCommentsList] = useState(data.comments || []);
  const [scheduleHistory, setScheduleHistory] = useState<ScheduleHistory | undefined>(
    data.scheduleHistory
  );

  // Editable fields for Approver (Meeting room, Booking date, Start time, End time)
  const [editMeetingRoom, setEditMeetingRoom] = useState(data.bookingDetails.meetingRoom);
  const [editDate, setEditDate] = useState(data.bookingDetails.date);
  const [editStartTime, setEditStartTime] = useState(data.bookingDetails.startTime);
  const [editEndTime, setEditEndTime] = useState(data.bookingDetails.endTime);

  // Sync state when data changes
  useEffect(() => {
    if (data) {
      setCurrentStatus(data.status);
      setCommentsList(data.comments || []);
      setApprovalComment("");
      setEditMeetingRoom(data.bookingDetails.meetingRoom);
      setEditDate(data.bookingDetails.date);
      setEditStartTime(data.bookingDetails.startTime);
      setEditEndTime(data.bookingDetails.endTime);
      setScheduleHistory(data.scheduleHistory);
    }
  }, [data]);

  const handleApprove = () => {
    if (!editMeetingRoom.trim()) {
      toast.error("Please select a Meeting Room.");
      return;
    }
    if (!editDate.trim()) {
      toast.error("Please enter a valid Booking Date.");
      return;
    }
    if (!editStartTime.trim()) {
      toast.error("Please enter a Start Time.");
      return;
    }
    if (!editEndTime.trim()) {
      toast.error("Please enter an End Time.");
      return;
    }

    setCurrentStatus("Approved");

    const updatedBooking: Partial<ConferenceRoomApprovalModalData["bookingDetails"]> = {
      meetingRoom: editMeetingRoom,
      date: editDate,
      startTime: editStartTime,
      endTime: editEndTime,
    };

    // Check if schedule parameters were modified by the approver
    const isScheduleChanged =
      editMeetingRoom !== data.bookingDetails.meetingRoom ||
      editDate !== data.bookingDetails.date ||
      editStartTime !== data.bookingDetails.startTime ||
      editEndTime !== data.bookingDetails.endTime;

    const newHistory: ScheduleHistory | undefined = isScheduleChanged
      ? {
          changed: true,
          changedBy: "Facility Manager (Approver)",
          changedAt:
            new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }) +
            " · " +
            new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          original: {
            meetingRoom: data.bookingDetails.meetingRoom,
            date: data.bookingDetails.date,
            startTime: data.bookingDetails.startTime,
            endTime: data.bookingDetails.endTime,
          },
          updated: {
            meetingRoom: editMeetingRoom,
            date: editDate,
            startTime: editStartTime,
            endTime: editEndTime,
          },
        }
      : scheduleHistory;

    if (isScheduleChanged) {
      setScheduleHistory(newHistory);
    }

    const scheduleNote = isScheduleChanged
      ? `[Schedule modified from Room: ${data.bookingDetails.meetingRoom} (${data.bookingDetails.date} ${data.bookingDetails.startTime}-${data.bookingDetails.endTime}) to Room: ${editMeetingRoom} (${editDate} ${editStartTime}-${editEndTime})]`
      : `[Approved Schedule: ${editMeetingRoom}, Date: ${editDate}, Time: ${editStartTime} – ${editEndTime}]`;

    const fullComment = approvalComment.trim()
      ? `${approvalComment} ${scheduleNote}`
      : `Approved by Facility Authority. ${scheduleNote}`;

    setCommentsList((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        authorName: "Facility Manager",
        authorRole: "Facility & Admin Authority",
        timestamp: "Just now",
        comment: fullComment,
        initials: "FM",
      },
    ]);

    toast.success(`Conference Room Booking (${data.reqNo}) approved successfully!`);
    if (onStatusChange) {
      onStatusChange(data.id, "Approved", updatedBooking, newHistory);
    }
  };

  const handleReject = () => {
    setCurrentStatus("Rejected");
    const fullComment = approvalComment.trim()
      ? approvalComment
      : "Booking requisition rejected by approval authority.";

    setCommentsList((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        authorName: "Facility Manager",
        authorRole: "Facility & Admin Authority",
        timestamp: "Just now",
        comment: fullComment,
        initials: "FM",
      },
    ]);

    toast.error(`Conference Room Booking (${data.reqNo}) rejected.`);
    if (onStatusChange) {
      onStatusChange(data.id, "Rejected");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-bold px-3 py-1">
            Approved
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 font-bold px-3 py-1">
            Pending Review
          </Badge>
        );
      case "Rejected":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 font-bold px-3 py-1">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn font-sans">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-[#fbfcfd] dark:bg-slate-950/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-100 dark:border-rose-900 shadow-3xs">
              <DoorOpen className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 leading-none">
                  Conference Room Booking Requisition Approval
                </h2>
                {getStatusBadge(currentStatus)}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                  # Application No: {data.reqNo}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right border-r border-slate-100 dark:border-slate-800 pr-4 hidden sm:block">
              <span className="text-[9px] text-slate-400 dark:text-slate-500 block uppercase tracking-widest font-extrabold">
                APPLICATION DATE
              </span>
              <span className="text-xs font-black text-slate-700 dark:text-slate-200 block mt-0.5">
                {data.applicationDate}
              </span>
              <span className="text-[9.5px] text-slate-400 dark:text-slate-500 block mt-0.5 font-semibold">
                Submitted {data.submittedTime}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all shrink-0 cursor-pointer shadow-3xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/60 dark:bg-slate-950/20">
          {/* Employee Request For Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-2xs space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-4 flex items-center gap-4 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 pb-4 lg:pb-0 lg:pr-6">
                <div className="w-14 h-14 rounded-full bg-rose-600 text-white font-black flex items-center justify-center text-lg shadow-sm shadow-rose-500/20 shrink-0">
                  {data.employee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()}
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                    REQUEST FOR
                  </span>
                  <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 truncate">
                    {data.employee.name}
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                    Employee ID · {data.employee.id}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                      DESIGNATION
                    </p>
                    <p className="font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                      {data.employee.designation}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                      DEPARTMENT
                    </p>
                    <p className="font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                      {data.employee.department}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700">
                    <LayersIcon className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                      SECTION
                    </p>
                    <p className="font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                      {data.employee.section || "Business Innovation"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                      DATE OF JOINING
                    </p>
                    <p className="font-bold text-slate-700 dark:text-slate-200 mt-0.5 font-mono">
                      {data.employee.joiningDate || "16 Aug 2023"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700">
                    <BuildingIcon className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                      BUSINESS UNIT
                    </p>
                    <p className="font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                      {data.employee.businessUnit || "Pakiza Software Limited"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                      LOCATION
                    </p>
                    <p className="font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                      {data.employee.location || "PSL HQ - Executive Floor"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COMBINED SECTION: Booking Purpose & Details */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="w-6 h-6 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xs shrink-0">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                  Booking Purpose & Details
                </h3>
              </div>
            </div>

            {/* Purpose & Participants Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="sm:col-span-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold block mb-1">
                  AGENDA / PURPOSE
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-100 italic">
                  "{data.bookingDetails.agenda}"
                </p>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 font-bold block mb-1">
                  TOTAL PARTICIPANTS
                </span>
                <p className="font-extrabold text-slate-800 dark:text-slate-100">
                  {data.bookingDetails.totalParticipants} Persons
                </p>
              </div>
            </div>

            {/* Approver Schedule Controls inside Booking Purpose & Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Meeting Room <span className="text-rose-500">*</span>
                </label>
                <select
                  value={editMeetingRoom}
                  onChange={(e) => setEditMeetingRoom(e.target.value)}
                  disabled={currentStatus !== "Pending"}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/30 disabled:opacity-60 cursor-pointer"
                >
                  {ROOM_OPTIONS.map((room) => (
                    <option key={room} value={room}>
                      {room}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Booking Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  disabled={currentStatus !== "Pending"}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/30 disabled:opacity-60 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Start Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editStartTime}
                  onChange={(e) => setEditStartTime(e.target.value)}
                  disabled={currentStatus !== "Pending"}
                  placeholder="e.g. 10:00:00"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  End Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editEndTime}
                  onChange={(e) => setEditEndTime(e.target.value)}
                  disabled={currentStatus !== "Pending"}
                  placeholder="e.g. 11:30:00"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/30 disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          {/* SCHEDULE & ROOM REALLOCATION HISTORY CARD */}
          {scheduleHistory && scheduleHistory.changed && (
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
                      Schedule was modified by {scheduleHistory.changedBy || "Approval Authority"} on {scheduleHistory.changedAt || "Approval"}
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
                        {scheduleHistory.original.meetingRoom}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9.5px] text-slate-400 block font-bold">BOOKING DATE</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300 font-mono line-through decoration-rose-400">
                        {scheduleHistory.original.date}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9.5px] text-slate-400 block font-bold">START TIME</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300 font-mono line-through decoration-rose-400">
                        {scheduleHistory.original.startTime}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9.5px] text-slate-400 block font-bold">END TIME</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300 font-mono line-through decoration-rose-400">
                        {scheduleHistory.original.endTime}
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
                        {scheduleHistory.updated.meetingRoom}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9.5px] text-emerald-600 dark:text-emerald-400 block font-bold">BOOKING DATE</span>
                      <span className="font-bold text-emerald-800 dark:text-emerald-200 font-mono">
                        {scheduleHistory.updated.date}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9.5px] text-emerald-600 dark:text-emerald-400 block font-bold">START TIME</span>
                      <span className="font-bold text-emerald-800 dark:text-emerald-200 font-mono">
                        {scheduleHistory.updated.startTime}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9.5px] text-emerald-600 dark:text-emerald-400 block font-bold">END TIME</span>
                      <span className="font-bold text-emerald-800 dark:text-emerald-200 font-mono">
                        {scheduleHistory.updated.endTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Responsible Persons Table */}
          {data.bookingDetails.responsiblePersons &&
            data.bookingDetails.responsiblePersons.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
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
                    Total: {data.bookingDetails.responsiblePersons.length} Persons
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
                    {data.bookingDetails.responsiblePersons.map((person, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-3 py-2.5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="size-3.5 rounded border border-emerald-300 dark:border-emerald-700 bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                              <Check className="size-2.5 stroke-[3.5]" />
                            </div>
                            <span className="text-slate-800 dark:text-slate-200 font-mono font-bold">
                              {i + 1}
                            </span>
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
            )}

          {/* COMMENTS & APPROVAL ACTION PANEL (VERTICAL UP-AND-DOWN LAYOUT) */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-2xs space-y-5">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                Comments & Approval Action Panel
              </h3>
            </div>

            <div className="flex flex-col gap-5">
              {/* TOP: Comment History */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  COMMENT HISTORY & NOTES
                </h4>
                <div className="space-y-3">
                  {commentsList.map((c) => (
                    <div key={c.id} className="flex gap-3.5 group">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-white font-extrabold text-[10px] flex items-center justify-center shrink-0 shadow-sm border border-rose-500/20 z-10 relative">
                          {c.initials}
                        </div>
                        <div className="absolute top-8 bottom-[-16px] left-1/2 -translate-x-1/2 w-px bg-slate-200 dark:bg-slate-800 group-last:hidden" />
                      </div>
                      <div className="flex-1 bg-slate-50/80 dark:bg-slate-950/40 rounded-xl p-3.5 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex flex-col">
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                              {c.authorName}
                            </h4>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                              {c.authorRole}
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-400 font-bold bg-white dark:bg-slate-900 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-800">
                            {c.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                          {c.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                  {commentsList.length === 0 && (
                    <div className="text-center py-6 text-xs text-slate-400 font-medium bg-slate-50 dark:bg-slate-950/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                      No comments added yet.
                    </div>
                  )}
                </div>
              </div>

              {/* BOTTOM: Review & Decision Action */}
              {currentStatus === "Pending" ? (
                <div className="bg-slate-50/80 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-amber-100 text-amber-600 flex items-center justify-center">
                      <AlertCircle className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                      Review & Decision Action
                    </span>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                      Approval Remark / Note
                    </label>
                    <textarea
                      value={approvalComment}
                      onChange={(e) => setApprovalComment(e.target.value)}
                      placeholder="Type approval note or rejection explanation here..."
                      className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-300 transition-all resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-bold">
                      Decision Completed: {currentStatus}
                    </Badge>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-white text-xs font-bold"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* STICKY APPROVAL ACTION FOOTER (MATCHING SIM APPROVAL MODAL) */}
        <div className="px-6 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-lg shrink-0 z-20">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Requisition Status:
            </span>
            {getStatusBadge(currentStatus)}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReject}
              disabled={currentStatus === "Rejected"}
              className="px-5 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 disabled:opacity-50 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-95"
            >
              <XCircle className="size-4" /> Reject Request
            </button>
            <button
              onClick={handleApprove}
              disabled={currentStatus === "Approved"}
              className="px-6 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="size-4" /> Approve Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
