import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Fingerprint, Search, FileSpreadsheet, Printer, FileDown, X, SlidersHorizontal,
  ChevronDown, ChevronRight, ChevronLeft, LayoutGrid, Check, Plus, Trash2, Calendar, Clock, AlertCircle, RefreshCw
} from "lucide-react";

export const Route = createFileRoute("/manual-attendance")({
  head: () => ({
    meta: [
      { title: "Manual Attendance Workspace — CRIPTON" },
      { name: "description", content: "Professional manual attendance roster dashboard, live dynamic OT calculations, and bulk-processing worksheets." },
    ],
  }),
  component: ManualAttendancePage,
});

// Complete, authentic 25 employee dataset copied exactly from your reference image text!
const initialEmployees = [
  { id: "2023043910", name: "Tahmid Afsar Shapno", dept: "Business Innovation", title: "Asst. Manager", unit: "PSL", line: "N/A", shift: "General Shift", inDate: "17/05/2026", inTime: "", outDate: "17/05/2026", outTime: "", ot: "0.00", status: "Absent", reason: "" },
  { id: "2022035599", name: "Dipon Saha", dept: "Core Development (HR)", title: "Manager", unit: "PSL", line: "N/A", shift: "Exe-Ptvl", inDate: "17/05/2026", inTime: "", outDate: "17/05/2026", outTime: "", ot: "0.00", status: "Absent", reason: "" },
  { id: "2025057309", name: "Bani Amin Jwel", dept: "Core Development (HR)", title: "Sr. Manager", unit: "PSL", line: "N/A", shift: "General Shift", inDate: "17/05/2026", inTime: "", outDate: "17/05/2026", outTime: "", ot: "0.00", status: "Absent", reason: "" },
  { id: "2021032646", name: "Sadiqul Islam", dept: "Core Sales", title: "Deputy Manager", unit: "PSL", line: "N/A", shift: "Exe-Ptvl", inDate: "17/05/2026", inTime: "", outDate: "17/05/2026", outTime: "", ot: "0.00", status: "Absent", reason: "" },
  { id: "2023044012", name: "Tanver Rahman Shaon", dept: "Core Sales", title: "Asst. Manager", unit: "PSL", line: "N/A", shift: "General Shift", inDate: "17/05/2026", inTime: "", outDate: "17/05/2026", outTime: "", ot: "0.00", status: "Absent", reason: "" },
  { id: "2025053377", name: "Md. Maruf Hossen", dept: "Core Sales", title: "Asst. Manager", unit: "PSL", line: "N/A", shift: "General Shift", inDate: "17/05/2026", inTime: "", outDate: "17/05/2026", outTime: "", ot: "0.00", status: "Absent", reason: "" },
  { id: "2025053380", name: "Miraz Uddin", dept: "Core Sales", title: "Jr. Executive", unit: "PSL", line: "N/A", shift: "General Shift", inDate: "17/05/2026", inTime: "", outDate: "17/05/2026", outTime: "", ot: "0.00", status: "Absent", reason: "" },
  { id: "2025054315", name: "Md. Shahinur Alahi Khan", dept: "Core Sales", title: "Asst. Manager", unit: "PSL", line: "N/A", shift: "General Shift", inDate: "17/05/2026", inTime: "", outDate: "17/05/2026", outTime: "", ot: "0.00", status: "Absent", reason: "" },
  { id: "2025054548", name: "Md Rahat Hossain", dept: "DBA", title: "Asst. Manager", unit: "PSL", line: "N/A", shift: "General Shift", inDate: "17/05/2026", inTime: "", outDate: "17/05/2026", outTime: "", ot: "0.00", status: "Absent", reason: "" },
  { id: "2024051509", name: "Irfan Hossain", dept: "ERP Team", title: "Jr. Executive", unit: "—", line: "—", shift: "General Shift", inDate: "17/05/2026", inTime: "", outDate: "17/05/2026", outTime: "", ot: "0.00", status: "Absent", reason: "" },
  { id: "2024051508", name: "Pabitra Khasnabish Druba", dept: "ERP Team", title: "Sr. Executive", unit: "PSL", line: "—", shift: "Day", inDate: "17/05/2026", inTime: "", outDate: "17/05/2026", outTime: "", ot: "0.00", status: "Absent", reason: "" },
  { id: "2023046543", name: "Md. Abdulla- Al- Mamun", dept: "ERP Team", title: "Asst. Manager", unit: "PSL", line: "N/A", shift: "General Shift", inDate: "17/05/2026", inTime: "", outDate: "17/05/2026", outTime: "", ot: "0.00", status: "Absent", reason: "" },
  { id: "2025054614", name: "Md. Rana Miah", dept: "General ERP (Com, A/C, Fixed Asset, Vat)", title: "Sr. Executive", unit: "PSL", line: "N/A", shift: "General Shift", inDate: "17/05/2026", inTime: "", outDate: "17/05/2026", outTime: "", ot: "0.00", status: "Absent", reason: "" },
  { id: "2022041203", name: "Khairul Bashar Masum", dept: "HR Team", title: "Asst. Manager", unit: "PSL", line: "N/A", shift: "Exe-Ptvl", inDate: "17/05/2026", inTime: "", outDate: "17/05/2026", outTime: "", ot: "0.00", status: "Absent", reason: "" },
  { id: "2021028542", name: "Zakir Hossain", dept: "Implementation & Support (HR)", title: "Executive", unit: "PSL", line: "N/A", shift: "Exe-Ptvl", inDate: "17/05/2026", inTime: "", outDate: "17/05/2026", outTime: "", ot: "0.00", status: "Absent", reason: "" },
  { id: "2023044017", name: "Md. Rejaul Karim", dept: "Implementation & Support (HR)", title: "Deputy Manager", unit: "PSL", line: "N/A", shift: "General Shift", inDate: "17/05/2026", inTime: "", outDate: "17/05/2026", outTime: "", ot: "0.00", status: "Absent", reason: "" },
  { id: "2025055045", name: "Md. Mahfuzur Rahman", dept: "Implementation & Support (HR)", title: "Jr. Executive", unit: "PSL", line: "N/A", shift: "General Shift", inDate: "17/05/2026", inTime: "", outDate: "17/05/2026", outTime: "", ot: "0.00", status: "Absent", reason: "" },
  { id: "2025054609", name: "Md Mahir Shahriyar", dept: "Project Resource & Strategy", title: "Jr. Executive", unit: "PSL", line: "N/A", shift: "General Shift", inDate: "17/05/2026", inTime: "", outDate: "17/05/2026", outTime: "", ot: "0.00", status: "Absent", reason: "" },
  { id: "2024049166", name: "MD Maimoon Hossain Shomoy", dept: "WEB-Team", title: "Sr. Executive", unit: "PSL", line: "—", shift: "General Shift", inDate: "17/05/2026", inTime: "", outDate: "17/05/2026", outTime: "", ot: "0.00", status: "Absent", reason: "" },
  { id: "2025053125", name: "Al Riyad Karim", dept: "WEB-Team", title: "Sr. Executive", unit: "PSL", line: "N/A", shift: "General Shift", inDate: "17/05/2026", inTime: "", outDate: "17/05/2026", outTime: "", ot: "0.00", status: "Absent", reason: "" },
  { id: "2019013884", name: "Javed Mia", dept: "Admin", title: "Helper (Cook)", unit: "N/A", line: "N/A", shift: "Exe-Ptvl", inDate: "17/05/2026", inTime: "", outDate: "17/05/2026", outTime: "", ot: "0.00", status: "Absent", reason: "" },
  { id: "2026059284", name: "Istiak Ahmed", dept: "Admin", title: "Office Boy", unit: "PSL", line: "N/A", shift: "General Shift", inDate: "17/05/2026", inTime: "", outDate: "17/05/2026", outTime: "", ot: "0.00", status: "Absent", reason: "" },
  { id: "2022040132", name: "Md. Sakil", dept: "Admin", title: "Asst. Cook", unit: "PTVL", line: "N/A", shift: "Exe-Ptvl", inDate: "17/05/2026", inTime: "", outDate: "17/05/2026", outTime: "", ot: "0.00", status: "Absent", reason: "" },
  { id: "2021023079", name: "Md. Monjur Alam", dept: "Admin", title: "Driver", unit: "—", line: "N/A", shift: "General-Transport", inDate: "17/05/2026", inTime: "", outDate: "17/05/2026", outTime: "", ot: "0.00", status: "Absent", reason: "" },
  { id: "2024052336", name: "Md. Badal Mia", dept: "Admin", title: "Driver", unit: "PSL", line: "N/A", shift: "General-Transport", inDate: "17/05/2026", inTime: "", outDate: "17/05/2026", outTime: "", ot: "0.00", status: "Absent", reason: "" },
];

function ManualAttendancePage() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  // Bulk Inputs (Right Card)
  const [bulkInTime, setBulkInTime] = useState("");
  const [bulkOutDate, setBulkOutDate] = useState("17/05/2026");
  const [bulkOutTime, setBulkOutTime] = useState("");
  const [bulkAdjustMin, setBulkAdjustMin] = useState("0");
  const [autoAddMinutes, setAutoAddMinutes] = useState(false);

  // Left Filter Panel Values
  const [filterSearching, setFilterSearching] = useState("Other");
  const [filterStatus, setFilterStatus] = useState("Absent");
  const [filterDate, setFilterDate] = useState("17/05/2026");
  const [filterEmpType, setFilterEmpType] = useState("ALL");
  const [filterDept, setFilterDept] = useState("ALL");
  const [filterUnit, setFilterUnit] = useState("ALL");
  const [filterLine, setFilterLine] = useState("ALL");
  const [filterAttType, setFilterAttType] = useState("ALL");
  const [filterReason, setFilterReason] = useState("Input Reason");

  // Add Attendance Modal States (Matches your popup layout perfectly!)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState("17/05/2026");
  const [modalEmpId, setModalEmpId] = useState("");
  const [modalInTime, setModalInTime] = useState("");
  const [modalOutDate, setModalOutDate] = useState("17/05/2026");
  const [modalOutTime, setModalOutTime] = useState("");
  const [modalRemarks, setModalRemarks] = useState("");

  // Custom Calendar & Clock Popover triggers!
  const [activeDatePicker, setActiveDatePicker] = useState<{ id: string; field: string } | null>(null);
  const [activeTimePicker, setActiveTimePicker] = useState<{ id: string; field: string } | null>(null);

  // Calendar Utility month/year navigation state
  const [calendarMonth, setCalendarMonth] = useState(4); // May (0-indexed: 4)
  const [calendarYear, setCalendarYear] = useState(2026);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Self-cleaning clickaway listener for popover panels
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".date-picker-trigger") && !target.closest(".date-picker-popover")) {
        setActiveDatePicker(null);
      }
      if (!target.closest(".time-picker-trigger") && !target.closest(".time-picker-popover")) {
        setActiveTimePicker(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Dynamic Lookup for Employee ID validation and text autocomplete
  const lookupEmployee = useMemo(() => {
    if (!modalEmpId.trim()) return null;
    return employees.find(e => e.id === modalEmpId.trim()) || null;
  }, [employees, modalEmpId]);

  // Global Checkbox Handler
  const isAllSelected = useMemo(() => {
    return employees.length > 0 && selectedIds.size === employees.length;
  }, [employees, selectedIds]);

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(employees.map(e => e.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Helper to calculate OT dynamically based on standard 8hr work + 1hr break (9hrs total)
  const calculateOTValue = (inTime: string, outTime: string): string => {
    if (!inTime || !outTime) return "0.00";
    try {
      const [inH, inM] = inTime.split(":").map(Number);
      const [outH, outM] = outTime.split(":").map(Number);
      if (isNaN(inH) || isNaN(outH)) return "0.00";
      const totalMinutes = (outH * 60 + (outM || 0)) - (inH * 60 + (inM || 0));
      const standardMinutes = 9 * 60; // 8 hours work + 1 hour lunch break
      if (totalMinutes > standardMinutes) {
        const otMinutes = totalMinutes - standardMinutes;
        return (otMinutes / 60).toFixed(2);
      }
    } catch (e) {
      // quiet fail
    }
    return "0.00";
  };

  // Inline Row Attribute Editor
  const updateRowValue = (id: string, field: string, value: any) => {
    setEmployees(prev =>
      prev.map(e => {
        if (e.id !== id) return e;
        const updated = { ...e, [field]: value };
        // If times are updated, recalculate OT & update status!
        if (field === "inTime" || field === "outTime") {
          updated.ot = calculateOTValue(updated.inTime, updated.outTime);
          updated.status = updated.inTime ? "Present" : "Absent";
        }
        return updated;
      })
    );
  };

  // Bulk configuration apply logic!
  const handleBulkApply = () => {
    if (selectedIds.size === 0) {
      alert("Please select at least one employee in the checkbox checklist to bulk-apply parameters!");
      return;
    }

    setEmployees(prev => {
      let minuteOffset = 0;
      return prev.map(e => {
        if (!selectedIds.has(e.id)) return e;

        let computedInTime = bulkInTime;
        if (bulkInTime && autoAddMinutes) {
          const [h, m] = bulkInTime.split(":").map(Number);
          const dateObj = new Date();
          dateObj.setHours(h);
          dateObj.setMinutes(m + minuteOffset);
          const computedH = String(dateObj.getHours()).padStart(2, "0");
          const computedM = String(dateObj.getMinutes()).padStart(2, "0");
          computedInTime = `${computedH}:${computedM}`;
          minuteOffset += 5; // Sequential increment by 5 mins!
        }

        const adjustMinNum = parseInt(bulkAdjustMin) || 0;
        let computedOutTime = bulkOutTime;
        if (bulkOutTime && adjustMinNum !== 0) {
          const [h, m] = bulkOutTime.split(":").map(Number);
          const dateObj = new Date();
          dateObj.setHours(h);
          dateObj.setMinutes(m + adjustMinNum);
          const computedH = String(dateObj.getHours()).padStart(2, "0");
          const computedM = String(dateObj.getMinutes()).padStart(2, "0");
          computedOutTime = `${computedH}:${computedM}`;
        }

        const updated = {
          ...e,
          inTime: computedInTime || e.inTime,
          outDate: bulkOutDate || e.outDate,
          outTime: computedOutTime || e.outTime,
          reason: filterReason !== "Input Reason" ? filterReason : e.reason
        };

        updated.ot = calculateOTValue(updated.inTime, updated.outTime);
        updated.status = updated.inTime ? "Present" : "Absent";
        return updated;
      });
    });

    // Reset selection after dynamic propagation!
    setSelectedIds(new Set());
  };

  // Modal Submit Logic
  const handleModalSubmit = () => {
    if (!modalEmpId.trim()) {
      alert("Employee ID is a mandatory required field!");
      return;
    }
    if (!modalInTime.trim()) {
      alert("In Time is a mandatory required field!");
      return;
    }
    if (!modalOutTime.trim()) {
      alert("Out Time is a mandatory required field!");
      return;
    }

    const empId = modalEmpId.trim();
    const existingEmp = employees.find(e => e.id === empId);

    if (existingEmp) {
      // Update existing employee roster log
      setEmployees(prev =>
        prev.map(e => {
          if (e.id !== empId) return e;
          const updated = {
            ...e,
            inDate: modalDate,
            inTime: modalInTime,
            outDate: modalOutDate,
            outTime: modalOutTime,
            reason: modalRemarks || e.reason,
            status: "Present",
          };
          updated.ot = calculateOTValue(updated.inTime, updated.outTime);
          return updated;
        })
      );
      alert(` Roster log for Employee ID ${empId} successfully updated!`);
    } else {
      // Create new employee attendance roster entry
      const newEmp = {
        id: empId,
        name: lookupEmployee ? lookupEmployee.name : "Custom Roster Member",
        dept: lookupEmployee ? lookupEmployee.dept : "Core Sales",
        title: lookupEmployee ? lookupEmployee.title : "Executive",
        unit: lookupEmployee ? lookupEmployee.unit : "PSL",
        line: "N/A",
        shift: "General Shift",
        inDate: modalDate,
        inTime: modalInTime,
        outDate: modalOutDate,
        outTime: modalOutTime,
        ot: calculateOTValue(modalInTime, modalOutTime),
        status: "Present",
        reason: modalRemarks
      };
      setEmployees(prev => [newEmp, ...prev]);
      alert(` Roster log successfully created for new Employee ID ${empId}!`);
    }

    // Reset values and close
    setIsModalOpen(false);
    setModalEmpId("");
    setModalInTime("");
    setModalOutTime("");
    setModalRemarks("");
  };

  // Quick Action: Delete/Discard row
  const handleDeleteRow = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  // Real-time table query matching!
  const filteredEmployees = useMemo(() => {
    return employees.filter(e => {
      // 1. Text Search Box matching
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesQuery =
          e.name.toLowerCase().includes(query) ||
          e.id.includes(query) ||
          e.dept.toLowerCase().includes(query) ||
          e.title.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }
      // 2. Department filter
      if (filterDept !== "ALL" && e.dept !== filterDept) return false;
      // 3. Unit filter
      if (filterUnit !== "ALL" && e.unit !== filterUnit) return false;
      return true;
    });
  }, [employees, searchQuery, filterDept, filterUnit]);

  // Dynamic Date Picker Selection Handler
  const handleSelectDate = (dateString: string) => {
    if (!activeDatePicker) return;
    const { id, field } = activeDatePicker;

    if (id === "modal") {
      if (field === "date") setModalDate(dateString);
      if (field === "outDate") setModalOutDate(dateString);
    } else if (id === "bulk") {
      if (field === "outDate") setBulkOutDate(dateString);
    } else if (id === "filter") {
      if (field === "date") setFilterDate(dateString);
    } else {
      updateRowValue(id, field, dateString);
    }
    setActiveDatePicker(null);
  };

  // Dynamic Time Picker Selection Handler
  const handleSelectTime = (timeString: string) => {
    if (!activeTimePicker) return;
    const { id, field } = activeTimePicker;

    if (id === "modal") {
      if (field === "inTime") setModalInTime(timeString);
      if (field === "outTime") setModalOutTime(timeString);
    } else if (id === "bulk") {
      if (field === "inTime") setBulkInTime(timeString);
      if (field === "outTime") setBulkOutTime(timeString);
    } else {
      updateRowValue(id, field, timeString);
    }
    setActiveTimePicker(null);
  };

  // Pre-calculate days matrix for Calendar Popover
  const renderCalendarDays = useMemo(() => {
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay(); // Sunday=0

    const days = [];
    // Render blank paddings for previous month's ending
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="size-8" />);
    }
    // Render actual day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = String(day).padStart(2, "0");
      const monthStr = String(calendarMonth + 1).padStart(2, "0");
      const fullDate = `${dayStr}/${monthStr}/${calendarYear}`;

      days.push(
        <button
          key={`day-${day}`}
          onClick={(ev) => {
            ev.stopPropagation();
            handleSelectDate(fullDate);
          }}
          className="size-8 rounded-lg hover:bg-primary hover:text-white flex items-center justify-center text-[11px] font-bold text-foreground/80 transition duration-100"
        >
          {day}
        </button>
      );
    }
    return days;
  }, [calendarMonth, calendarYear, activeDatePicker]);

  // Reusable Calendar UI block
  const renderCalendarMarkup = () => {
    return (
      <div className="w-56 select-none bg-card">
        <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-2">
          <button
            onClick={(ev) => {
              ev.stopPropagation();
              if (calendarMonth === 0) {
                setCalendarMonth(11);
                setCalendarYear(prev => prev - 1);
              } else {
                setCalendarMonth(prev => prev - 1);
              }
            }}
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition duration-100"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <span className="text-[10px] font-black uppercase text-foreground tracking-wider">
            {monthNames[calendarMonth]} {calendarYear}
          </span>
          <button
            onClick={(ev) => {
              ev.stopPropagation();
              if (calendarMonth === 11) {
                setCalendarMonth(0);
                setCalendarYear(prev => prev + 1);
              } else {
                setCalendarMonth(prev => prev + 1);
              }
            }}
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition duration-100"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1 text-[9px] font-bold text-center text-muted-foreground uppercase pb-1 tracking-wider border-b border-border/30 mb-1">
          <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
        </div>

        <div className="grid grid-cols-7 gap-0.5 text-center">
          {renderCalendarDays}
        </div>
      </div>
    );
  };

  // Reusable Clock UI block with dynamic presets and matrices
  const renderTimeClockMarkup = () => {
    const hours = ["08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21"];
    const minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

    // Determine active values to highlight currently selected
    let activeVal = "";
    if (activeTimePicker) {
      const { id, field } = activeTimePicker;
      if (id === "modal") {
        if (field === "inTime") activeVal = modalInTime;
        if (field === "outTime") activeVal = modalOutTime;
      } else if (id === "bulk") {
        if (field === "inTime") activeVal = bulkInTime;
        if (field === "outTime") activeVal = bulkOutTime;
      } else {
        const emp = employees.find(e => e.id === id);
        if (emp) {
          activeVal = field === "inTime" ? emp.inTime : emp.outTime;
        }
      }
    }

    const [currHr, currMin] = activeVal ? activeVal.split(":") : ["09", "00"];

    return (
      <div className="w-[260px] select-none space-y-3">
        {/* Header Display */}
        <div className="flex items-center justify-between border-b border-border/40 pb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Clock Selector</span>
          <div className="px-2.5 py-0.5 rounded bg-primary/10 text-primary font-mono font-bold text-xs">
            {currHr || "09"}:{currMin || "00"}
          </div>
        </div>

        {/* Quick HR Presets */}
        <div className="space-y-1">
          <span className="text-[8.5px] font-extrabold text-primary uppercase tracking-wider">Quick Presets</span>
          <div className="grid grid-cols-4 gap-1">
            {[
              { label: "09:00 IN", val: "09:00" },
              { label: "10:00 IN", val: "10:00" },
              { label: "18:00 OUT", val: "18:00" },
              { label: "20:00 OUT", val: "20:00" }
            ].map(p => (
              <button
                key={p.val}
                onClick={(ev) => {
                  ev.stopPropagation();
                  handleSelectTime(p.val);
                }}
                className="py-1 px-1 bg-muted hover:bg-primary hover:text-white rounded text-[8.5px] font-black uppercase border border-border/40 text-foreground/80 transition duration-150"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selector Matrices */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          {/* Hours Grid */}
          <div className="space-y-1">
            <span className="text-[8px] font-extrabold text-muted-foreground/75 uppercase tracking-wider">Hours (24h)</span>
            <div className="grid grid-cols-3 gap-1 h-32 overflow-y-auto border border-border/40 rounded-lg p-1 bg-muted/40 scrollbar-none">
              {hours.map(hr => {
                const isSelected = currHr === hr;
                return (
                  <button
                    key={`hr-${hr}`}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      // Only update selector layout, apply handles closure
                      const finalTime = `${hr}:${currMin || "00"}`;
                      if (activeTimePicker) {
                        const { id, field } = activeTimePicker;
                        if (id === "modal") {
                          if (field === "inTime") setModalInTime(finalTime);
                          if (field === "outTime") setModalOutTime(finalTime);
                        } else if (id === "bulk") {
                          if (field === "inTime") setBulkInTime(finalTime);
                          if (field === "outTime") setBulkOutTime(finalTime);
                        } else {
                          updateRowValue(id, field, finalTime);
                        }
                      }
                    }}
                    className={[
                      "py-1 rounded text-[9.5px] font-bold font-mono transition duration-100",
                      isSelected ? "bg-primary text-white" : "hover:bg-muted bg-card border border-border/20 text-foreground/70"
                    ].join(" ")}
                  >
                    {hr}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Minutes Grid */}
          <div className="space-y-1">
            <span className="text-[8px] font-extrabold text-muted-foreground/75 uppercase tracking-wider">Minutes</span>
            <div className="grid grid-cols-3 gap-1 h-32 overflow-y-auto border border-border/40 rounded-lg p-1 bg-muted/40 scrollbar-none">
              {minutes.map(min => {
                const isSelected = currMin === min;
                return (
                  <button
                    key={`min-${min}`}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      const finalTime = `${currHr || "09"}:${min}`;
                      if (activeTimePicker) {
                        const { id, field } = activeTimePicker;
                        if (id === "modal") {
                          if (field === "inTime") setModalInTime(finalTime);
                          if (field === "outTime") setModalOutTime(finalTime);
                        } else if (id === "bulk") {
                          if (field === "inTime") setBulkInTime(finalTime);
                          if (field === "outTime") setBulkOutTime(finalTime);
                        } else {
                          updateRowValue(id, field, finalTime);
                        }
                      }
                    }}
                    className={[
                      "py-1 rounded text-[9.5px] font-bold font-mono transition duration-100",
                      isSelected ? "bg-primary text-white" : "hover:bg-muted bg-card border border-border/20 text-foreground/70"
                    ].join(" ")}
                  >
                    {min}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Custom Actions */}
        <div className="pt-1.5 border-t border-border/30">
          <button
            onClick={(ev) => {
              ev.stopPropagation();
              handleSelectTime(`${currHr || "09"}:${currMin || "00"}`);
            }}
            className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded text-white font-extrabold text-[11px] transition duration-150 uppercase shadow-xs tracking-wider"
          >
            Apply Time Punch
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 xl:p-8 space-y-6">
          {/* Breadcrumb and Header */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground/75">Human Resource</span>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-semibold">Manual Attendance</span>
              </div>
              <h1 className="text-xl font-black text-foreground flex items-center gap-2">
                <Fingerprint className="size-5.5 text-primary" />
                <span>Manual Attendance Workspace</span>
              </h1>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setEmployees(initialEmployees)}
                className="h-10 px-4 rounded-xl border border-border hover:bg-muted text-xs font-bold text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition duration-200"
              >
                <RefreshCw className="size-3.5 text-primary" />
                <span>Reset Workspace</span>
              </button>
            </div>
          </div>

          {/* Upper Panels / Filters Block */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* CARD 1: Filters & Criteria (Left Panel - Span 2 Columns) */}
            <div className="xl:col-span-2 bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary"> Roster Criteria Selection</span>
                <span className="text-[9px] font-bold text-muted-foreground/50">Core HRIS Engine</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* 1. Searching Option */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Searching</label>
                  <div className="relative">
                    <select
                      value={filterSearching}
                      onChange={(e) => setFilterSearching(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary transition duration-150 appearance-none pr-8 cursor-pointer"
                    >
                      <option>Other</option>
                      <option>Employee ID</option>
                      <option>Name Search</option>
                    </select>
                    <ChevronDown className="size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 2. Status */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Status</label>
                  <div className="relative">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary transition duration-150 appearance-none pr-8 cursor-pointer"
                    >
                      <option>Absent</option>
                      <option>Present</option>
                      <option>Late</option>
                    </select>
                    <ChevronDown className="size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 3. Date */}
                <div className="space-y-1.5 relative">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Date</label>
                  <div className="relative date-picker-trigger">
                    <input
                      type="text"
                      readOnly
                      value={filterDate}
                      onClick={() => setActiveDatePicker({ id: "filter", field: "date" })}
                      className="w-full h-9 px-3 pl-8.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none cursor-pointer text-primary"
                    />
                    <Calendar className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-primary" />

                    {/* Inline Calendar Popover exactly under field! */}
                    {activeDatePicker?.id === "filter" && activeDatePicker?.field === "date" && (
                      <div className="absolute z-50 bg-card border border-border/70 rounded-lg p-4 shadow-2xl space-y-3 date-picker-popover top-full mt-1.5 left-0 animate-in fade-in duration-100">
                        {renderCalendarMarkup()}
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Employee Type */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Employee Type</label>
                  <input
                    type="text"
                    value={filterEmpType}
                    onChange={(e) => setFilterEmpType(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary transition duration-150"
                  />
                </div>

                {/* 5. Department */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Department</label>
                  <div className="relative">
                    <select
                      value={filterDept}
                      onChange={(e) => setFilterDept(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary transition duration-150 appearance-none pr-8 cursor-pointer"
                    >
                      <option value="ALL">ALL</option>
                      <option value="Accounts & Vat">Accounts & Vat</option>
                      <option value="Core Development (HR)">Core Development (HR)</option>
                      <option value="Core Sales">Core Sales</option>
                      <option value="DBA">DBA</option>
                      <option value="ERP Team">ERP Team</option>
                      <option value="Admin">Admin</option>
                    </select>
                    <ChevronDown className="size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 6. Unit */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Unit</label>
                  <div className="relative">
                    <select
                      value={filterUnit}
                      onChange={(e) => setFilterUnit(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary transition duration-150 appearance-none pr-8 cursor-pointer"
                    >
                      <option value="ALL">ALL</option>
                      <option value="PSL">PSL</option>
                      <option value="PTVL">PTVL</option>
                      <option value="N/A">N/A</option>
                    </select>
                    <ChevronDown className="size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 7. Line */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Line</label>
                  <input
                    type="text"
                    value={filterLine}
                    onChange={(e) => setFilterLine(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary transition duration-150"
                  />
                </div>

                {/* 8. Attendance Type */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Attendance Type</label>
                  <div className="relative">
                    <select
                      value={filterAttType}
                      onChange={(e) => setFilterAttType(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary transition duration-150 appearance-none pr-8 cursor-pointer"
                    >
                      <option>ALL</option>
                      <option>Fingerprint</option>
                      <option>Manual Override</option>
                    </select>
                    <ChevronDown className="size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 9. Reason Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Reason</label>
                  <input
                    type="text"
                    value={filterReason}
                    onChange={(e) => setFilterReason(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary transition duration-150"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button className="h-9.5 px-6 rounded-lg bg-primary hover:bg-primary-glow text-white font-extrabold text-xs shadow-md transition duration-150 tracking-wider">
                  SHOW WORKSPACE
                </button>
              </div>
            </div>

            {/* CARD 2 & 3: Bulk and Search Configs (Right Side Panels) */}
            <div className="flex flex-col gap-6">

              {/* Green-Border Roster Bulk Action Card */}
              <div className="bg-card rounded-lg border-2 border-emerald-500/30 p-5 shadow-sm space-y-4.5 relative overflow-hidden">
                {/* Dynamic corner splash */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none" />

                <div className="flex items-center gap-2 border-b border-border/40 pb-2.5">
                  <div className="size-5 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-[10px]">✔</div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Roster Bulk Setup</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* In Time */}
                  <div className="space-y-1 relative">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase">In Time *</label>
                    <div className="relative time-picker-trigger">
                      <input
                        type="text"
                        readOnly
                        value={bulkInTime}
                        onClick={() => setActiveTimePicker({ id: "bulk", field: "inTime" })}
                        placeholder="Select Time"
                        className="w-full h-8 pl-8 px-2 rounded bg-muted border border-border/40 text-[11px] font-mono outline-none cursor-pointer text-emerald-600 dark:text-emerald-400 font-bold"
                      />
                      <Clock className="size-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-500" />

                      {/* Inline TimePicker exactly under bulk In Time! */}
                      {activeTimePicker?.id === "bulk" && activeTimePicker?.field === "inTime" && (
                        <div className="absolute z-50 bg-card border border-border/70 rounded-lg p-4 shadow-2xl space-y-3 time-picker-popover top-full mt-1.5 left-0 animate-in fade-in duration-100">
                          {renderTimeClockMarkup()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Out Date */}
                  <div className="space-y-1 relative">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase">Out Date *</label>
                    <div className="relative date-picker-trigger">
                      <input
                        type="text"
                        readOnly
                        value={bulkOutDate}
                        onClick={() => setActiveDatePicker({ id: "bulk", field: "outDate" })}
                        className="w-full h-8 pl-8 px-2 rounded bg-muted border border-border/40 text-[11px] font-mono outline-none cursor-pointer text-emerald-600 dark:text-emerald-400 font-bold"
                      />
                      <Calendar className="size-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-500" />

                      {/* Inline Calendar exactly under bulk Out Date! */}
                      {activeDatePicker?.id === "bulk" && activeDatePicker?.field === "outDate" && (
                        <div className="absolute z-50 bg-card border border-border/70 rounded-lg p-4 shadow-2xl space-y-3 date-picker-popover top-full mt-1.5 left-0 animate-in fade-in duration-100">
                          {renderCalendarMarkup()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Out Time */}
                  <div className="space-y-1 relative">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase">Out Time *</label>
                    <div className="relative time-picker-trigger">
                      <input
                        type="text"
                        readOnly
                        value={bulkOutTime}
                        onClick={() => setActiveTimePicker({ id: "bulk", field: "outTime" })}
                        placeholder="Select Time"
                        className="w-full h-8 pl-8 px-2 rounded bg-muted border border-border/40 text-[11px] font-mono outline-none cursor-pointer text-emerald-600 dark:text-emerald-400 font-bold"
                      />
                      <Clock className="size-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-500" />

                      {/* Inline TimePicker exactly under bulk Out Time! */}
                      {activeTimePicker?.id === "bulk" && activeTimePicker?.field === "outTime" && (
                        <div className="absolute z-50 bg-card border border-border/70 rounded-lg p-4 shadow-2xl space-y-3 time-picker-popover top-full mt-1.5 left-0 animate-in fade-in duration-100">
                          {renderTimeClockMarkup()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Adjust Minutes */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase">Adjust Minutes</label>
                    <input
                      type="text"
                      value={bulkAdjustMin}
                      onChange={(e) => setBulkAdjustMin(e.target.value)}
                      className="w-full h-8 px-2.5 rounded bg-muted border border-border/40 text-[11px] font-mono outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition duration-150"
                    />
                  </div>
                </div>

                {/* Random addition toggle helper */}
                <div className="flex items-center justify-between gap-2 pt-1 text-[10px]">
                  <label className="flex items-center gap-2 cursor-pointer text-muted-foreground font-semibold">
                    <input
                      type="checkbox"
                      checked={autoAddMinutes}
                      onChange={(e) => setAutoAddMinutes(e.target.checked)}
                      className="rounded border-border text-emerald-500 focus:ring-emerald-500/10 cursor-pointer"
                    />
                    <span>Add sequential +5 mins randomizer</span>
                  </label>
                  <span className="text-[9px] font-bold text-emerald-500 uppercase">Auto Mode</span>
                </div>

                <div className="pt-1.5">
                  <button
                    onClick={handleBulkApply}
                    className="w-full h-8.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] tracking-wider transition duration-150 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Check className="size-3.5" />
                    <span>BULK APPLY TO SELECTED ({selectedIds.size})</span>
                  </button>
                </div>
              </div>

              {/* Purple-Border Card: Search Configuration */}
              <div className="bg-card rounded-lg border-2 border-indigo-500/30 p-5 shadow-sm space-y-3 relative overflow-hidden">
                {/* Dynamic corner splash */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none" />

                <div className="flex items-center gap-2 border-b border-border/40 pb-2.5">
                  <div className="size-5 rounded bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-[10px]">🔍</div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Search Configuration</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase">Search For</label>
                  <div className="relative">
                    <select
                      className="w-full h-8.5 px-3 rounded bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-indigo-500 appearance-none pr-8 cursor-pointer"
                    >
                      <option>All</option>
                      <option>Filter Present</option>
                      <option>Filter Absent</option>
                    </select>
                    <ChevronDown className="size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Action Utilities & Datagrid Block */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4 relative">

            {/* Utilities Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/30 pb-4">
              <div className="flex items-center gap-1.5">
                <button className="h-8.5 px-3.5 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition">
                  <FileSpreadsheet className="size-3.5 text-emerald-500" />
                  <span>Excel</span>
                </button>
                <button className="h-8.5 px-3.5 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition">
                  <Printer className="size-3.5 text-blue-500" />
                  <span>Print Roster</span>
                </button>
                <button className="h-8.5 px-3.5 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition">
                  <FileDown className="size-3.5 text-rose-500" />
                  <span>PDF Report</span>
                </button>
              </div>

              {/* Text Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ID, Name, Department..."
                  className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-muted border border-border/40 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200"
                />
              </div>
            </div>

            {/* Attendance Datagrid Spreadsheet */}
            <div className="overflow-x-auto border border-border/50 rounded-xl max-h-[58vh]">
              <table className="min-w-[1750px] w-full border-collapse text-[11px] text-left">
                <thead>
                  <tr className="bg-[#f1f5f9] dark:bg-[#0f172a] text-foreground font-bold border-b border-border/50 select-none whitespace-nowrap">
                    {/* Fixed Sticky Headers */}
                    <th className="sticky left-0 bg-[#f1f5f9] dark:bg-[#0f172a] px-4 py-3 text-center border-r border-border/30 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[40px] min-w-[40px] max-w-[40px]">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        className="rounded border-border/60 text-primary focus:ring-primary/15 cursor-pointer"
                      />
                    </th>
                    <th className="sticky left-[40px] bg-[#f1f5f9] dark:bg-[#0f172a] px-3 py-3 font-extrabold text-center border-r border-border/30 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[40px] min-w-[40px] max-w-[40px]">SL</th>
                    <th className="sticky left-[80px] bg-[#f1f5f9] dark:bg-[#0f172a] px-4 py-3 font-extrabold border-r border-border/30 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[140px] min-w-[140px] max-w-[140px]">Reason</th>
                    <th className="sticky left-[220px] bg-[#f1f5f9] dark:bg-[#0f172a] px-3 py-3 font-extrabold border-r border-border/30 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[100px] min-w-[100px] max-w-[100px]">Emp ID</th>
                    <th className="sticky left-[320px] bg-[#f1f5f9] dark:bg-[#0f172a] px-4 py-3 font-extrabold border-r border-border/40 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] w-[160px] min-w-[160px] max-w-[160px]">Name</th>

                    {/* Horizontal Scrolling Headers */}
                    <th className="px-4 py-3 font-extrabold w-40 bg-[#f1f5f9] dark:bg-[#0f172a]">Department</th>
                    <th className="px-4 py-3 font-extrabold w-36 bg-[#f1f5f9] dark:bg-[#0f172a]">Designation</th>
                    <th className="px-3 py-3 font-extrabold text-center w-16 bg-[#f1f5f9] dark:bg-[#0f172a]">Unit</th>
                    <th className="px-3 py-3 font-extrabold text-center w-16 bg-[#f1f5f9] dark:bg-[#0f172a]">Line</th>
                    <th className="px-4 py-3 font-extrabold w-32 bg-[#f1f5f9] dark:bg-[#0f172a]">Shift</th>
                    <th className="px-1.5 py-3 font-extrabold w-[115px] min-w-[115px] bg-[#f1f5f9] dark:bg-[#0f172a]">In Date</th>
                    <th className="px-1.5 py-3 font-extrabold w-[95px] min-w-[95px] bg-[#f1f5f9] dark:bg-[#0f172a]">In Time</th>
                    <th className="px-1.5 py-3 font-extrabold w-[115px] min-w-[115px] bg-[#f1f5f9] dark:bg-[#0f172a]">Out Date</th>
                    <th className="px-1.5 py-3 font-extrabold w-[95px] min-w-[95px] bg-[#f1f5f9] dark:bg-[#0f172a]">Out Time</th>
                    <th className="px-3 py-3 font-extrabold text-right w-16 bg-[#f1f5f9] dark:bg-[#0f172a]">OT</th>
                    <th className="px-3 py-3 font-extrabold text-center w-20 bg-[#f1f5f9] dark:bg-[#0f172a]">Status</th>
                    <th className="px-3 py-3 font-extrabold text-center w-14 bg-[#f1f5f9] dark:bg-[#0f172a]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredEmployees.map((e, idx) => {
                    const isSelected = selectedIds.has(e.id);
                    const stickyCellBgClass = isSelected
                      ? "bg-[#f1f5f9] dark:bg-[#1e293b] group-hover:bg-[#e2e8f0] dark:group-hover:bg-[#334155]"
                      : "bg-card group-hover:bg-[#f8fafc] dark:group-hover:bg-[#1e293b]";

                    return (
                      <tr
                        key={e.id}
                        className={[
                          "group hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] transition duration-150 whitespace-nowrap",
                          isSelected ? "bg-[#f1f5f9] dark:bg-[#1e293b]" : ""
                        ].join(" ")}
                      >
                        {/* 1. Selector Checkbox (Sticky Left) */}
                        <td className={`sticky left-0 ${stickyCellBgClass} px-4 py-2.5 text-center border-r border-border/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[40px] min-w-[40px] max-w-[40px] transition-all`}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectRow(e.id)}
                            className="rounded border-border/60 text-primary focus:ring-primary/15 cursor-pointer"
                          />
                        </td>

                        {/* 2. SL (Sticky Left) */}
                        <td className={`sticky left-[40px] ${stickyCellBgClass} px-3 py-2.5 text-center font-bold text-muted-foreground/60 border-r border-border/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[40px] min-w-[40px] max-w-[40px] transition-all`}>{idx + 1}</td>

                        {/* 3. Reason Input Cell (Sticky Left) */}
                        <td className={`sticky left-[80px] ${stickyCellBgClass} px-4 py-2.5 border-r border-border/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[140px] min-w-[140px] max-w-[140px] transition-all`}>
                          <input
                            type="text"
                            value={e.reason}
                            onChange={(ev) => updateRowValue(e.id, "reason", ev.target.value)}
                            placeholder="Input Reason"
                            className="w-full h-7 px-2 rounded border border-border/30 bg-muted/40 font-medium outline-none focus:border-primary text-[10px] transition"
                          />
                        </td>

                        {/* 4. Emp ID (Sticky Left) */}
                        <td className={`sticky left-[220px] ${stickyCellBgClass} px-3 py-2.5 font-bold text-foreground/90 font-mono border-r border-border/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[100px] min-w-[100px] max-w-[100px] transition-all`}>{e.id}</td>

                        {/* 5. Name (Sticky Left) */}
                        <td className={`sticky left-[320px] ${stickyCellBgClass} px-4 py-2.5 font-semibold text-foreground border-r border-border/40 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] w-[160px] min-w-[160px] max-w-[160px] transition-all`}>{e.name}</td>

                        {/* 6. Department */}
                        <td className="px-4 py-2.5 text-foreground/80 font-medium">{e.dept}</td>

                        {/* 7. Designation */}
                        <td className="px-4 py-2.5 text-foreground/70 font-medium">{e.title}</td>

                        {/* 8. Unit */}
                        <td className="px-3 py-2.5 text-center text-muted-foreground font-bold">{e.unit}</td>

                        {/* 9. Line */}
                        <td className="px-3 py-2.5 text-center text-muted-foreground font-semibold">{e.line}</td>

                        {/* 10. Shift */}
                        <td className="px-4 py-2.5 text-foreground/75 font-semibold">{e.shift}</td>

                        {/* 11. In Date Input Cell */}
                        <td className="px-1 py-2.5">
                          <div className="relative date-picker-trigger">
                            <input
                              type="text"
                              readOnly
                              value={e.inDate}
                              onClick={() => setActiveDatePicker({ id: e.id, field: "inDate" })}
                              className="w-full h-7 px-1 rounded border border-border/30 bg-muted/40 font-mono outline-none focus:border-primary text-[10.5px] text-center cursor-pointer hover:bg-muted"
                            />

                            {/* Inline Calendar popover centered strictly close to this row's In Date input! */}
                            {activeDatePicker?.id === e.id && activeDatePicker?.field === "inDate" && (
                              <div className="absolute z-50 bg-card border border-border/70 rounded-lg p-4 shadow-2xl space-y-3 date-picker-popover top-full mt-1.5 left-0 animate-in fade-in duration-100">
                                {renderCalendarMarkup()}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 12. In Time Input Cell */}
                        <td className="px-1 py-2.5">
                          <div className="relative time-picker-trigger">
                            <input
                              type="text"
                              readOnly
                              value={e.inTime}
                              onClick={() => setActiveTimePicker({ id: e.id, field: "inTime" })}
                              placeholder="--:--"
                              className="w-full h-7 px-1 rounded border border-border/30 bg-muted/40 font-mono outline-none focus:border-primary text-[10.5px] text-center cursor-pointer hover:bg-muted text-primary font-bold"
                            />

                            {/* Inline TimePicker exactly close to this row's In Time input! */}
                            {activeTimePicker?.id === e.id && activeTimePicker?.field === "inTime" && (
                              <div className="absolute z-50 bg-card border border-border/70 rounded-lg p-4 shadow-2xl space-y-3 time-picker-popover top-full mt-1.5 left-0 animate-in fade-in duration-100">
                                {renderTimeClockMarkup()}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 13. Out Date Input Cell */}
                        <td className="px-1 py-2.5">
                          <div className="relative date-picker-trigger">
                            <input
                              type="text"
                              readOnly
                              value={e.outDate}
                              onClick={() => setActiveDatePicker({ id: e.id, field: "outDate" })}
                              className="w-full h-7 px-1 rounded border border-border/30 bg-muted/40 font-mono outline-none focus:border-primary text-[10.5px] text-center cursor-pointer hover:bg-muted"
                            />

                            {/* Inline Calendar exactly close to this row's Out Date input! */}
                            {activeDatePicker?.id === e.id && activeDatePicker?.field === "outDate" && (
                              <div className="absolute z-50 bg-card border border-border/70 rounded-lg p-4 shadow-2xl space-y-3 date-picker-popover top-full mt-1.5 left-0 animate-in fade-in duration-100">
                                {renderCalendarMarkup()}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 14. Out Time Input Cell */}
                        <td className="px-1 py-2.5">
                          <div className="relative time-picker-trigger">
                            <input
                              type="text"
                              readOnly
                              value={e.outTime}
                              onClick={() => setActiveTimePicker({ id: e.id, field: "outTime" })}
                              placeholder="--:--"
                              className="w-full h-7 px-1 rounded border border-border/30 bg-muted/40 font-mono outline-none focus:border-primary text-[10.5px] text-center cursor-pointer hover:bg-muted text-primary font-bold"
                            />

                            {/* Inline TimePicker exactly close to this row's Out Time input! */}
                            {activeTimePicker?.id === e.id && activeTimePicker?.field === "outTime" && (
                              <div className="absolute z-50 bg-card border border-border/70 rounded-lg p-4 shadow-2xl space-y-3 time-picker-popover top-full mt-1.5 left-0 animate-in fade-in duration-100">
                                {renderTimeClockMarkup()}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 15. Dynamic calculated OT */}
                        <td className="px-3 py-2.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {e.ot}
                        </td>

                        {/* 16. Dynamic Status Badge */}
                        <td className="px-3 py-2.5 text-center">
                          <span
                            className={[
                              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase",
                              e.status === "Present"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-rose-500/10 text-rose-500"
                            ].join(" ")}
                          >
                            <span className={["size-1 rounded-full", e.status === "Present" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"].join(" ")} />
                            {e.status}
                          </span>
                        </td>

                        {/* 17. Action Drop/Delete */}
                        <td className="px-3 py-2.5 text-center">
                          <button
                            onClick={() => handleDeleteRow(e.id)}
                            className="size-6.5 rounded-md border border-border/50 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 hover:text-rose-600 flex items-center justify-center transition"
                            title="Remove Employee"
                          >
                            <X className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan={20} className="px-4 py-12 text-center text-muted-foreground font-semibold">
                        No employees found matching the filter query parameters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Datagrid Footer / Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 select-none">
              <span className="text-[10px] font-bold text-muted-foreground/75 uppercase tracking-wider">
                Showing 1 to {filteredEmployees.length} of {employees.length} entries
              </span>
              <div className="flex items-center gap-1.5">
                <button className="h-8.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-xs transition duration-150">
                  Bulk Save Present
                </button>
                <button className="h-8.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-xs transition duration-150">
                  Bulk Save Absent
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Floating Green Circle Add Button - Fires the gorgeous popup modal! */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 size-12.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg flex items-center justify-center transition duration-200 hover:scale-110 z-40"
          title="Add Manual Attendance Entry"
        >
          <Plus className="size-6" />
        </button>

        {/* High-Fidelity Manual Attendance Popup Modal Overlay (Matches your layout precisely!) */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-card text-foreground rounded-lg border border-border shadow-2xl max-w-4xl w-full overflow-hidden animate-in zoom-in-95 duration-200">

              {/* Modal Header */}
              <div className="px-6 py-4.5 border-b border-border/60 flex items-center justify-between bg-muted/30">
                <h2 className="text-sm font-black text-foreground flex items-center gap-2 tracking-wide uppercase">
                  <Fingerprint className="size-4.5 text-primary animate-pulse" />
                  <span>Manual Attendance Entry</span>
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="size-7 rounded-lg hover:bg-muted text-muted-foreground/60 hover:text-foreground flex items-center justify-center transition"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Left Column */}
                <div className="space-y-4">
                  {/* Date Input */}
                  <div className="space-y-1.5 relative">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/75 flex items-center gap-0.5">
                      Date <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative date-picker-trigger">
                      <input
                        type="text"
                        readOnly
                        value={modalDate}
                        onClick={() => setActiveDatePicker({ id: "modal", field: "date" })}
                        className="w-full h-9.5 pl-8.5 px-3 rounded-lg bg-muted border border-border/60 text-xs font-semibold outline-none cursor-pointer text-primary"
                      />
                      <Calendar className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-primary" />

                      {/* Inline Calendar inside modal field relative container! */}
                      {activeDatePicker?.id === "modal" && activeDatePicker?.field === "date" && (
                        <div className="absolute z-50 bg-card border border-border/70 rounded-lg p-4 shadow-2xl space-y-3 date-picker-popover top-full mt-1.5 left-0 animate-in fade-in duration-100">
                          {renderCalendarMarkup()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Employee ID Input (Orange Label!) */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500 flex items-center gap-0.5">
                      Employee Id <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={modalEmpId}
                      onChange={(e) => setModalEmpId(e.target.value)}
                      placeholder="Enter ID (e.g. 2025057068)"
                      className="w-full h-9.5 px-3 rounded-lg bg-muted border border-border/60 text-xs font-bold outline-none focus:border-amber-500 focus:bg-card focus:ring-2 focus:ring-amber-500/10 text-amber-600 dark:text-amber-400 transition duration-150"
                    />
                  </div>

                  {/* Employee Details Auto-lookup Panel */}
                  <div className="bg-muted/30 rounded-xl p-4.5 border border-border/40 space-y-3 mt-4">
                    <div className="flex items-center justify-between border-b border-border/30 pb-2 mb-1.5">
                      <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">Roster Match lookup</span>
                      <span className={`inline-flex items-center gap-1 text-[8px] font-black uppercase px-2 py-0.5 rounded ${lookupEmployee ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                        {lookupEmployee ? 'Active Match' : 'Unregistered'}
                      </span>
                    </div>

                    <div className="grid grid-cols-12 text-[11px] items-center">
                      <span className="col-span-4 font-bold text-muted-foreground">Employee Name</span>
                      <span className="col-span-1 font-bold text-muted-foreground/40 text-center">:</span>
                      <span className="col-span-7 font-black text-foreground truncate">
                        {lookupEmployee ? lookupEmployee.name : <span className="text-muted-foreground/30 font-medium italic">Pending ID match...</span>}
                      </span>
                    </div>

                    <div className="grid grid-cols-12 text-[11px] items-center">
                      <span className="col-span-4 font-bold text-muted-foreground">Designation</span>
                      <span className="col-span-1 font-bold text-muted-foreground/40 text-center">:</span>
                      <span className="col-span-7 font-semibold text-foreground/80 truncate">
                        {lookupEmployee ? lookupEmployee.title : <span className="text-muted-foreground/20">—</span>}
                      </span>
                    </div>

                    <div className="grid grid-cols-12 text-[11px] items-center">
                      <span className="col-span-4 font-bold text-muted-foreground">Section</span>
                      <span className="col-span-1 font-bold text-muted-foreground/40 text-center">:</span>
                      <span className="col-span-7 font-semibold text-foreground/75 truncate">
                        {lookupEmployee ? lookupEmployee.dept : <span className="text-muted-foreground/20">—</span>}
                      </span>
                    </div>

                    <div className="grid grid-cols-12 text-[11px] items-center">
                      <span className="col-span-4 font-bold text-muted-foreground">Company</span>
                      <span className="col-span-1 font-bold text-muted-foreground/40 text-center">:</span>
                      <span className="col-span-7 font-semibold text-foreground/70 truncate">
                        {lookupEmployee ? lookupEmployee.unit : <span className="text-muted-foreground/20">—</span>}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* In Time */}
                  <div className="space-y-1.5 relative">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/75 flex items-center gap-0.5">
                      In Time <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative time-picker-trigger">
                      <input
                        type="text"
                        readOnly
                        value={modalInTime}
                        onClick={() => setActiveTimePicker({ id: "modal", field: "inTime" })}
                        placeholder="Select In Time"
                        className="w-full h-9.5 pl-8.5 px-3 rounded-lg bg-muted border border-border/60 text-xs font-semibold outline-none cursor-pointer text-emerald-600 dark:text-emerald-400 font-bold"
                      />
                      <Clock className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />

                      {/* Inline TimePicker inside modal In Time! */}
                      {activeTimePicker?.id === "modal" && activeTimePicker?.field === "inTime" && (
                        <div className="absolute z-50 bg-card border border-border/70 rounded-lg p-4 shadow-2xl space-y-3 time-picker-popover top-full mt-1.5 left-0 animate-in fade-in duration-100">
                          {renderTimeClockMarkup()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Out Date */}
                  <div className="space-y-1.5 relative">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/75 flex items-center gap-0.5">
                      Out Date <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative date-picker-trigger">
                      <input
                        type="text"
                        readOnly
                        value={modalOutDate}
                        onClick={() => setActiveDatePicker({ id: "modal", field: "outDate" })}
                        className="w-full h-9.5 pl-8.5 px-3 rounded-lg bg-muted border border-border/60 text-xs font-semibold outline-none cursor-pointer text-primary"
                      />
                      <Calendar className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-primary" />

                      {/* Inline Calendar inside modal Out Date! */}
                      {activeDatePicker?.id === "modal" && activeDatePicker?.field === "outDate" && (
                        <div className="absolute z-50 bg-card border border-border/70 rounded-lg p-4 shadow-2xl space-y-3 date-picker-popover top-full mt-1.5 left-0 animate-in fade-in duration-100">
                          {renderCalendarMarkup()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Out Time */}
                  <div className="space-y-1.5 relative">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/75 flex items-center gap-0.5">
                      Out Time <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative time-picker-trigger">
                      <input
                        type="text"
                        readOnly
                        value={modalOutTime}
                        onClick={() => setActiveTimePicker({ id: "modal", field: "outTime" })}
                        placeholder="Select Out Time"
                        className="w-full h-9.5 pl-8.5 px-3 rounded-lg bg-muted border border-border/60 text-xs font-semibold outline-none cursor-pointer text-emerald-600 dark:text-emerald-400 font-bold"
                      />
                      <Clock className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />

                      {/* Inline TimePicker inside modal Out Time! */}
                      {activeTimePicker?.id === "modal" && activeTimePicker?.field === "outTime" && (
                        <div className="absolute z-50 bg-card border border-border/70 rounded-lg p-4 shadow-2xl space-y-3 time-picker-popover top-full mt-1.5 left-0 animate-in fade-in duration-100">
                          {renderTimeClockMarkup()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Remarks */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/75 flex items-center gap-0.5">
                      Remarks <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={modalRemarks}
                      onChange={(e) => setModalRemarks(e.target.value)}
                      placeholder="Input Remarks..."
                      className="w-full h-9.5 px-3 rounded-lg bg-muted border border-border/60 text-xs font-semibold outline-none focus:border-primary focus:bg-card transition duration-150"
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-border/60 flex items-center justify-between bg-muted/20">
                {/* Close Button (Left side, neutral!) */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="h-9 px-5 bg-card border border-border/50 hover:bg-muted text-muted-foreground font-semibold text-xs rounded-lg transition duration-150 uppercase tracking-wider"
                >
                  Close
                </button>

                {/* Reset & Submit Buttons (Right side, text & primary!) */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setModalEmpId("");
                      setModalInTime("");
                      setModalOutTime("");
                      setModalRemarks("");
                    }}
                    className="h-9 px-4 text-xs font-bold text-muted-foreground hover:text-foreground transition duration-150 uppercase tracking-wider"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleModalSubmit}
                    className="h-9 px-5 bg-primary hover:bg-primary-glow text-primary-foreground font-semibold text-xs rounded-lg transition duration-150 uppercase tracking-wider shadow-sm"
                  >
                    Submit
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
