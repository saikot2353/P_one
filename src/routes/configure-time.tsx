import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { 
  ChevronRight, Search, Plus, Pencil, Trash2, X,
  FileSpreadsheet, Printer, FileText, Calendar, Clock, AlertTriangle, Coins
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/configure-time")({
  head: () => ({
    meta: [
      { title: "Time & Shift Setup — CRIPTON HRIS" },
      { name: "description", content: "Manage and configure standard shifts, abnormal shifts, attendance bonus rules, and OT config." },
    ],
  }),
  component: TimeSetupPage,
});

type TabType = "shift" | "ot" | "abnormal" | "bonus";

// ----------------------------------------------------
// Interfaces
// ----------------------------------------------------
interface Shift {
  sl: number;
  nameEng: string;
  nameBng: string;
  startTime: string;
  endTime: string;
  lateTime: string;
  startTimeFrom: string;
  endTimeTo: string;
  lateCount: "Yes" | "No";
  sortOrder: number;
  isActive: "Active" | "Inactive";
  isRotate: "Yes" | "No";
  rotationCriteria: string;
  shiftChangeDay: string;
  isLateDeduction: "Yes" | "No";
  deductionFrom: string;
  deductionPer: string;
  deductionAfterDay: string;
}

interface OtConfig {
  sl: number;
  employeeType: string;
  otCalculationType: string;
  bufferMinutes: number;
  isActive: "Active" | "Inactive";
}

interface AbnormalShift {
  sl: number;
  shiftName: string;
  date: string;
  reason: string;
  isActive: "Active" | "Inactive";
}

interface AttendanceBonusPolicy {
  sl: number;
  name: string;
  allowedLateDays: number;
  allowedAbsentDays: number;
  bonusAmount: number;
  isActive: "Active" | "Inactive";
}

// ----------------------------------------------------
// Defaults
// ----------------------------------------------------
const DEFAULT_SHIFTS: Shift[] = [
  { sl: 1, nameEng: "RMG-PIP", nameBng: "আরএমজি-পিআইপি", startTime: "08:00:00", endTime: "17:00:00", lateTime: "08:05:00", startTimeFrom: "06:30:00", endTimeTo: "10:30:00", lateCount: "Yes", sortOrder: 33, isActive: "Active", isRotate: "No", rotationCriteria: "", shiftChangeDay: "", isLateDeduction: "No", deductionFrom: "", deductionPer: "", deductionAfterDay: "" }
];

const DEFAULT_OT_CONFIGS: OtConfig[] = [
  { sl: 1, employeeType: "ALL", otCalculationType: "Flat Hour", bufferMinutes: 15, isActive: "Active" }
];

const DEFAULT_ABNORMAL_SHIFTS: AbnormalShift[] = [
  { sl: 1, shiftName: "Night Shift Extra", date: "2026-06-20", reason: "Product Launch", isActive: "Active" }
];

const DEFAULT_ATTN_BONUS_POLICIES: AttendanceBonusPolicy[] = [
  { sl: 1, name: "General Worker Policy", allowedLateDays: 3, allowedAbsentDays: 0, bonusAmount: 500, isActive: "Active" }
];

function TimeSetupPage() {
  const [activeTab, setActiveTab] = useState<TabType>("shift");
  const [searchQuery, setSearchQuery] = useState("");

  // Lists state
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [otConfigs, setOtConfigs] = useState<OtConfig[]>([]);
  const [abnormalShifts, setAbnormalShifts] = useState<AbnormalShift[]>([]);
  const [attnPolicies, setAttnPolicies] = useState<AttendanceBonusPolicy[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as TabType;
      if (tabParam && ["shift", "ot", "abnormal", "bonus"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }

    const safeParse = (key: string, defaultVal: any) => {
      const saved = localStorage.getItem(key);
      if (!saved) return defaultVal;
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : defaultVal;
      } catch (e) {
        return defaultVal;
      }
    };

    // Shifts
    const shiftsData = safeParse("hris_shifts", DEFAULT_SHIFTS);
    setShifts(shiftsData);
    localStorage.setItem("hris_shifts", JSON.stringify(shiftsData));

    // OT Config
    const otData = safeParse("hris_ot_config", DEFAULT_OT_CONFIGS);
    setOtConfigs(otData);
    localStorage.setItem("hris_ot_config", JSON.stringify(otData));

    // Abnormal Shifts
    const abData = safeParse("hris_abnormal_shifts", DEFAULT_ABNORMAL_SHIFTS);
    setAbnormalShifts(abData);
    localStorage.setItem("hris_abnormal_shifts", JSON.stringify(abData));

    // Attendance Policies
    const policiesData = safeParse("hris_attendance_bonus_policy", DEFAULT_ATTN_BONUS_POLICIES);
    setAttnPolicies(policiesData);
    localStorage.setItem("hris_attendance_bonus_policy", JSON.stringify(policiesData));
  }, []);

  // Modal controls
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editSl, setEditSl] = useState<number | null>(null);

  // Form states - Shift
  const [shiftNameEng, setShiftNameEng] = useState("");
  const [shiftNameBng, setShiftNameBng] = useState("");
  const [shiftStart, setShiftStart] = useState("08:00:00");
  const [shiftEnd, setShiftEnd] = useState("17:00:00");
  const [shiftLate, setShiftLate] = useState("08:05:00");
  const [shiftLateCount, setShiftLateCount] = useState<"Yes" | "No">("Yes");
  const [shiftStartFrom, setShiftStartFrom] = useState("06:00:00");
  const [shiftEndTo, setShiftEndTo] = useState("12:00:00");
  const [shiftSort, setShiftSort] = useState<number>(1);
  const [shiftIsActive, setShiftIsActive] = useState<"Active" | "Inactive">("Active");
  const [shiftIsRotate, setShiftIsRotate] = useState<"Yes" | "No">("No");
  const [shiftRotation, setShiftRotation] = useState("");
  const [shiftChangeDay, setShiftChangeDay] = useState("Select..");
  const [shiftIsLateDeduct, setShiftIsLateDeduct] = useState<"Yes" | "No">("No");
  const [shiftDeductFrom, setShiftDeductFrom] = useState("");
  const [shiftDeductPer, setShiftDeductPer] = useState("");
  const [shiftDeductAfterDay, setShiftDeductAfterDay] = useState("");

  // Form states - OT Configuration
  const [otEmpType, setOtEmpType] = useState("ALL");
  const [otCalcType, setOtCalcType] = useState("Flat Hour");
  const [otBuffer, setOtBuffer] = useState<number>(15);
  const [otIsActive, setOtIsActive] = useState<"Active" | "Inactive">("Active");

  // Form states - Abnormal Shift
  const [abShiftName, setAbShiftName] = useState("");
  const [abDate, setAbDate] = useState("");
  const [abReason, setAbReason] = useState("");
  const [abIsActive, setAbIsActive] = useState<"Active" | "Inactive">("Active");

  // Form states - Attendance Bonus Policy
  const [policyName, setPolicyName] = useState("");
  const [policyLate, setPolicyLate] = useState<number>(3);
  const [policyAbsent, setPolicyAbsent] = useState<number>(0);
  const [policyAmount, setPolicyAmount] = useState<number>(500);
  const [policyIsActive, setPolicyIsActive] = useState<"Active" | "Inactive">("Active");

  const openForm = (sl: number | null) => {
    setEditSl(sl);
    if (activeTab === "shift") {
      const item = shifts.find(s => s.sl === sl);
      setShiftNameEng(item?.nameEng || "");
      setShiftNameBng(item?.nameBng || "");
      setShiftStart(item?.startTime || "08:00:00");
      setShiftEnd(item?.endTime || "17:00:00");
      setShiftLate(item?.lateTime || "08:05:00");
      setShiftLateCount(item?.lateCount || "Yes");
      setShiftStartFrom(item?.startTimeFrom || "06:00:00");
      setShiftEndTo(item?.endTimeTo || "12:00:00");
      setShiftSort(item?.sortOrder || shifts.length + 1);
      setShiftIsActive(item?.isActive || "Active");
      setShiftIsRotate(item?.isRotate || "No");
      setShiftRotation(item?.rotationCriteria || "");
      setShiftChangeDay(item?.shiftChangeDay || "Select..");
      setShiftIsLateDeduct(item?.isLateDeduction || "No");
      setShiftDeductFrom(item?.deductionFrom || "");
      setShiftDeductPer(item?.deductionPer || "");
      setShiftDeductAfterDay(item?.deductionAfterDay || "");
    } else if (activeTab === "ot") {
      const item = otConfigs.find(o => o.sl === sl);
      setOtEmpType(item?.employeeType || "ALL");
      setOtCalcType(item?.otCalculationType || "Flat Hour");
      setOtBuffer(item?.bufferMinutes || 15);
      setOtIsActive(item?.isActive || "Active");
    } else if (activeTab === "abnormal") {
      const item = abnormalShifts.find(a => a.sl === sl);
      setAbShiftName(item?.shiftName || "");
      setAbDate(item?.date || "");
      setAbReason(item?.reason || "");
      setAbIsActive(item?.isActive || "Active");
    } else if (activeTab === "bonus") {
      const item = attnPolicies.find(b => b.sl === sl);
      setPolicyName(item?.name || "");
      setPolicyLate(item?.allowedLateDays || 3);
      setPolicyAbsent(item?.allowedAbsentDays || 0);
      setPolicyAmount(item?.bonusAmount || 500);
      setPolicyIsActive(item?.isActive || "Active");
    }
    setIsFormOpen(true);
  };

  const handleDelete = (sl: number) => {
    if (!confirm("Are you sure you want to delete this setting?")) return;

    if (activeTab === "shift") {
      const updated = shifts.filter(s => s.sl !== sl).map((s, idx) => ({ ...s, sl: idx + 1 }));
      setShifts(updated);
      localStorage.setItem("hris_shifts", JSON.stringify(updated));
    } else if (activeTab === "ot") {
      const updated = otConfigs.filter(o => o.sl !== sl).map((o, idx) => ({ ...o, sl: idx + 1 }));
      setOtConfigs(updated);
      localStorage.setItem("hris_ot_config", JSON.stringify(updated));
    } else if (activeTab === "abnormal") {
      const updated = abnormalShifts.filter(a => a.sl !== sl).map((a, idx) => ({ ...a, sl: idx + 1 }));
      setAbnormalShifts(updated);
      localStorage.setItem("hris_abnormal_shifts", JSON.stringify(updated));
    } else if (activeTab === "bonus") {
      const updated = attnPolicies.filter(b => b.sl !== sl).map((b, idx) => ({ ...b, sl: idx + 1 }));
      setAttnPolicies(updated);
      localStorage.setItem("hris_attendance_bonus_policy", JSON.stringify(updated));
    }
    toast.success("Deleted successfully");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "shift") {
      if (!shiftNameEng) { toast.error("Shift Name is required."); return; }
      let nextList = [...shifts];
      if (editSl !== null) {
        nextList = shifts.map(s => s.sl === editSl ? { ...s, nameEng: shiftNameEng, nameBng: shiftNameBng, startTime: shiftStart, endTime: shiftEnd, lateTime: shiftLate, startTimeFrom: shiftStartFrom, endTimeTo: shiftEndTo, lateCount: shiftLateCount, sortOrder: Number(shiftSort), isActive: shiftIsActive, isRotate: shiftIsRotate, rotationCriteria: shiftRotation, shiftChangeDay, isLateDeduction: shiftIsLateDeduct, deductionFrom: shiftDeductFrom, deductionPer: shiftDeductPer, deductionAfterDay: shiftDeductAfterDay } : s);
      } else {
        const sl = shifts.length > 0 ? Math.max(...shifts.map(s => s.sl)) + 1 : 1;
        nextList.push({ sl, nameEng: shiftNameEng, nameBng: shiftNameBng, startTime: shiftStart, endTime: shiftEnd, lateTime: shiftLate, startTimeFrom: shiftStartFrom, endTimeTo: shiftEndTo, lateCount: shiftLateCount, sortOrder: Number(shiftSort), isActive: shiftIsActive, isRotate: shiftIsRotate, rotationCriteria: shiftRotation, shiftChangeDay, isLateDeduction: shiftIsLateDeduct, deductionFrom: shiftDeductFrom, deductionPer: shiftDeductPer, deductionAfterDay: shiftDeductAfterDay });
      }
      setShifts(nextList);
      localStorage.setItem("hris_shifts", JSON.stringify(nextList));
    } else if (activeTab === "ot") {
      let nextList = [...otConfigs];
      if (editSl !== null) {
        nextList = otConfigs.map(o => o.sl === editSl ? { ...o, employeeType: otEmpType, otCalculationType: otCalcType, bufferMinutes: Number(otBuffer), isActive: otIsActive } : o);
      } else {
        const sl = otConfigs.length > 0 ? Math.max(...otConfigs.map(o => o.sl)) + 1 : 1;
        nextList.push({ sl, employeeType: otEmpType, otCalculationType: otCalcType, bufferMinutes: Number(otBuffer), isActive: otIsActive });
      }
      setOtConfigs(nextList);
      localStorage.setItem("hris_ot_config", JSON.stringify(nextList));
    } else if (activeTab === "abnormal") {
      if (!abShiftName) { toast.error("Shift Name is required."); return; }
      let nextList = [...abnormalShifts];
      if (editSl !== null) {
        nextList = abnormalShifts.map(a => a.sl === editSl ? { ...a, shiftName: abShiftName, date: abDate, reason: abReason, isActive: abIsActive } : a);
      } else {
        const sl = abnormalShifts.length > 0 ? Math.max(...abnormalShifts.map(a => a.sl)) + 1 : 1;
        nextList.push({ sl, shiftName: abShiftName, date: abDate, reason: abReason, isActive: abIsActive });
      }
      setAbnormalShifts(nextList);
      localStorage.setItem("hris_abnormal_shifts", JSON.stringify(nextList));
    } else if (activeTab === "bonus") {
      if (!policyName) { toast.error("Policy Name is required."); return; }
      let nextList = [...attnPolicies];
      if (editSl !== null) {
        nextList = attnPolicies.map(b => b.sl === editSl ? { ...b, name: policyName, allowedLateDays: Number(policyLate), allowedAbsentDays: Number(policyAbsent), bonusAmount: Number(policyAmount), isActive: policyIsActive } : b);
      } else {
        const sl = attnPolicies.length > 0 ? Math.max(...attnPolicies.map(b => b.sl)) + 1 : 1;
        nextList.push({ sl, name: policyName, allowedLateDays: Number(policyLate), allowedAbsentDays: Number(policyAbsent), bonusAmount: Number(policyAmount), isActive: policyIsActive });
      }
      setAttnPolicies(nextList);
      localStorage.setItem("hris_attendance_bonus_policy", JSON.stringify(nextList));
    }

    toast.success("Saved successfully");
    setIsFormOpen(false);
  };

  const insetWrapperClass = "group relative rounded-xl border border-border/80 focus-within:border-primary px-3.5 py-1.5 bg-muted/15 focus-within:bg-card transition-all duration-200";
  const insetLabelClass = "text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-0.5";
  const insetInputClass = "w-full bg-transparent border-0 outline-none text-xs font-normal text-foreground focus:ring-0 p-0";
  const insetSelectClass = "w-full bg-transparent border-0 outline-none text-xs font-normal text-foreground focus:ring-0 p-0 cursor-pointer";

  // Tab Header Items
  const tabsList: { type: TabType; label: string; icon: any }[] = [
    { type: "shift", label: "Standard Shift", icon: Calendar },
    { type: "ot", label: "OT Configuration", icon: Clock },
    { type: "abnormal", label: "Abnormal Shift", icon: AlertTriangle },
    { type: "bonus", label: "Attendance Bonus Policy", icon: Coins }
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-2 max-w-[1800px] mx-auto w-full">
          {/* Breadcrumb & Header */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-3" />
                <span>Configure</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-black">Time & Shift Setup</span>
              </div>
              <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                <Calendar className="size-5.5 text-primary" />
                Time & Shift Configuration
              </h1>
            </div>
            <button 
              onClick={() => openForm(null)}
              className="h-10 px-5 rounded-lg bg-primary text-primary-foreground font-black text-xs hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center gap-2 uppercase tracking-wide"
            >
              <Plus className="size-4 animate-bounce" /> Add New Record
            </button>
          </div>

          {/* Horizontal Master Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-border/50 pb-2">
            {tabsList.map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.type;
              return (
                <button
                  key={tab.type}
                  onClick={() => {
                    setActiveTab(tab.type);
                    setSearchQuery("");
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card border border-border/85 hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <TabIcon className="size-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search bar & Actions toolbar */}
          <div className="bg-card rounded-lg border border-border/80 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex items-center gap-2 bg-muted/65 border border-border/40 rounded-lg px-3 py-1.5 w-full md:w-80">
              <Search className="size-4 text-muted-foreground/70" />
              <input 
                type="text" 
                placeholder={`Search ${tabsList.find(t => t.type === activeTab)?.label}...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent border-0 outline-none text-xs w-full text-foreground placeholder:text-muted-foreground/60 font-semibold"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button 
                onClick={() => toast.success("Exporting to Excel...")}
                className="h-9.5 px-3 rounded-lg border border-border/60 hover:bg-muted font-bold text-xs text-muted-foreground flex items-center gap-1.5 transition-all uppercase"
              >
                <FileSpreadsheet className="size-4 text-emerald-600" /> EXCEL
              </button>
              <button 
                onClick={() => window.print()}
                className="h-9.5 px-3 rounded-lg border border-border/60 hover:bg-muted font-bold text-xs text-muted-foreground flex items-center gap-1.5 transition-all uppercase"
              >
                <Printer className="size-4 text-blue-600" /> PRINT
              </button>
              <button 
                onClick={() => toast.success("Generating PDF...")}
                className="h-9.5 px-3 rounded-lg border border-border/60 hover:bg-muted font-bold text-xs text-muted-foreground flex items-center gap-1.5 transition-all uppercase"
              >
                <FileText className="size-4 text-red-600" /> PDF
              </button>
            </div>
          </div>

          {/* Master Table Router */}
          <div className="bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              
              {activeTab === "shift" && (
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap" style={{ minWidth: "1600px" }}>
                  <thead className="text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                    <tr className="bg-[#f8fafc] dark:bg-[#0f172a]">
                      <th className="sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">#</th>
                      <th className="sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">Actions</th>
                      <th className="px-5 py-4 min-w-[150px]">Name (Eng)</th>
                      <th className="px-5 py-4 min-w-[150px]">Name (Bng)</th>
                      <th className="px-5 py-4 w-[100px]">Start Time</th>
                      <th className="px-5 py-4 w-[100px]">End Time</th>
                      <th className="px-5 py-4 w-[100px]">Late Time</th>
                      <th className="px-5 py-4 w-[100px]">Start Time From</th>
                      <th className="px-5 py-4 w-[100px]">End Time To</th>
                      <th className="px-5 py-4 w-[100px] text-center">Late Count</th>
                      <th className="px-5 py-4 w-[100px] text-center">Sort Order</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                      <th className="px-5 py-4 w-[100px] text-center">IsRotate</th>
                      <th className="px-5 py-4 min-w-[150px]">Rotation Criteria</th>
                      <th className="px-5 py-4 w-[120px]">Shift Change Day</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {shifts.filter(s => (s.nameEng || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                      <tr key={item.sl} className="group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all">
                        <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">{idx + 1}</td>
                        <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => openForm(item.sl)} className="text-orange-500 hover:text-orange-600 transition"><Pencil className="size-4" /></button>
                            <button onClick={() => handleDelete(item.sl)} className="text-red-500 hover:text-red-650 transition"><Trash2 className="size-4" /></button>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100">{item.nameEng}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-800 dark:text-slate-200">{item.nameBng || "—"}</td>
                        <td className="px-5 py-3.5 font-normal font-mono">{item.startTime}</td>
                        <td className="px-5 py-3.5 font-normal font-mono">{item.endTime}</td>
                        <td className="px-5 py-3.5 font-normal font-mono">{item.lateTime}</td>
                        <td className="px-5 py-3.5 font-normal font-mono">{item.startTimeFrom}</td>
                        <td className="px-5 py-3.5 font-normal font-mono">{item.endTimeTo}</td>
                        <td className="px-5 py-3.5 text-center font-normal">{item.lateCount}</td>
                        <td className="px-5 py-3.5 text-center font-normal">{item.sortOrder}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}>{item.isActive}</span>
                        </td>
                        <td className="px-5 py-3.5 text-center font-normal">{item.isRotate}</td>
                        <td className="px-5 py-3.5 font-normal">{item.rotationCriteria || "—"}</td>
                        <td className="px-5 py-3.5 font-normal">{item.shiftChangeDay || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "ot" && (
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap" style={{ minWidth: "800px" }}>
                  <thead className="text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                    <tr className="bg-[#f8fafc] dark:bg-[#0f172a]">
                      <th className="sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">#</th>
                      <th className="sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">Actions</th>
                      <th className="px-5 py-4 min-w-[200px]">Employee Type</th>
                      <th className="px-5 py-4 min-w-[200px]">OT Calculation Type</th>
                      <th className="px-5 py-4 w-[150px] text-center">Buffer Minutes</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {otConfigs.filter(o => (o.employeeType || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                      <tr key={item.sl} className="group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all">
                        <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">{idx + 1}</td>
                        <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => openForm(item.sl)} className="text-orange-500 hover:text-orange-600 transition"><Pencil className="size-4" /></button>
                            <button onClick={() => handleDelete(item.sl)} className="text-red-500 hover:text-red-650 transition"><Trash2 className="size-4" /></button>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100">{item.employeeType}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-800 dark:text-slate-200">{item.otCalculationType}</td>
                        <td className="px-5 py-3.5 text-center font-normal font-mono">{item.bufferMinutes} mins</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}>{item.isActive}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "abnormal" && (
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap" style={{ minWidth: "800px" }}>
                  <thead className="text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                    <tr className="bg-[#f8fafc] dark:bg-[#0f172a]">
                      <th className="sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">#</th>
                      <th className="sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">Actions</th>
                      <th className="px-5 py-4 min-w-[200px]">Shift Name</th>
                      <th className="px-5 py-4 w-[150px] text-center">Date</th>
                      <th className="px-5 py-4 min-w-[250px]">Reason</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {abnormalShifts.filter(a => (a.shiftName || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                      <tr key={item.sl} className="group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all">
                        <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">{idx + 1}</td>
                        <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => openForm(item.sl)} className="text-orange-500 hover:text-orange-600 transition"><Pencil className="size-4" /></button>
                            <button onClick={() => handleDelete(item.sl)} className="text-red-500 hover:text-red-650 transition"><Trash2 className="size-4" /></button>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100">{item.shiftName}</td>
                        <td className="px-5 py-3.5 text-center font-normal font-mono">{item.date}</td>
                        <td className="px-5 py-3.5 font-normal">{item.reason || "—"}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}>{item.isActive}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "bonus" && (
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap" style={{ minWidth: "800px" }}>
                  <thead className="text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                    <tr className="bg-[#f8fafc] dark:bg-[#0f172a]">
                      <th className="sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">#</th>
                      <th className="sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">Actions</th>
                      <th className="px-5 py-4 min-w-[200px]">Policy Name</th>
                      <th className="px-5 py-4 w-[150px] text-center">Allowed Late Days</th>
                      <th className="px-5 py-4 w-[150px] text-center">Allowed Absent Days</th>
                      <th className="px-5 py-4 w-[150px] text-right">Bonus Amount</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {attnPolicies.filter(b => (b.name || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                      <tr key={item.sl} className="group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all">
                        <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">{idx + 1}</td>
                        <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => openForm(item.sl)} className="text-orange-500 hover:text-orange-600 transition"><Pencil className="size-4" /></button>
                            <button onClick={() => handleDelete(item.sl)} className="text-red-500 hover:text-red-650 transition"><Trash2 className="size-4" /></button>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100">{item.name}</td>
                        <td className="px-5 py-3.5 text-center font-normal font-mono">{item.allowedLateDays} days</td>
                        <td className="px-5 py-3.5 text-center font-normal font-mono">{item.allowedAbsentDays} days</td>
                        <td className="px-5 py-3.5 text-right font-normal font-mono text-emerald-600">{item.bonusAmount} BDT</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}>{item.isActive}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

            </div>
          </div>
        </div>

        {/* Master Modal Router */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-card border border-border/80 w-full max-w-xl rounded-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="px-6 py-4.5 border-b border-border/50 bg-[#f8fafc] dark:bg-[#0f172a] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                    <Calendar className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black tracking-tight text-foreground">
                      {editSl ? "Update" : "Create"} {tabsList.find(t => t.type === activeTab)?.label}
                    </h2>
                  </div>
                </div>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="size-8.5 rounded-xl hover:bg-muted/80 flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground border border-border/20"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Modal Form Body */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                
                {activeTab === "shift" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Name (Eng) *</label>
                      <input type="text" placeholder="Name (Eng)" value={shiftNameEng} onChange={e => setShiftNameEng(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Name (Bng)</label>
                      <input type="text" placeholder="Name (Bng)" value={shiftNameBng} onChange={e => setShiftNameBng(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Start Time *</label>
                      <input type="text" placeholder="e.g. 08:00:00" value={shiftStart} onChange={e => setShiftStart(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>End Time *</label>
                      <input type="text" placeholder="e.g. 17:00:00" value={shiftEnd} onChange={e => setShiftEnd(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Late Time *</label>
                      <input type="text" placeholder="e.g. 08:05:00" value={shiftLate} onChange={e => setShiftLate(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Late Count *</label>
                      <select value={shiftLateCount} onChange={e => setShiftLateCount(e.target.value as any)} className={insetSelectClass}>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Start Time From *</label>
                      <input type="text" placeholder="e.g. 06:00:00" value={shiftStartFrom} onChange={e => setShiftStartFrom(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>End Time To *</label>
                      <input type="text" placeholder="e.g. 12:00:00" value={shiftEndTo} onChange={e => setShiftEndTo(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Sort Order *</label>
                      <input type="number" placeholder="Sort Order" value={shiftSort} onChange={e => setShiftSort(Number(e.target.value))} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Is Rotate?</label>
                      <select value={shiftIsRotate} onChange={e => setShiftIsRotate(e.target.value as any)} className={insetSelectClass}>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Rotation Criteria</label>
                      <input type="text" placeholder="Criteria" value={shiftRotation} onChange={e => setShiftRotation(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Shift Change Day</label>
                      <select value={shiftChangeDay} onChange={e => setShiftChangeDay(e.target.value)} className={insetSelectClass}>
                        <option value="Select..">Select..</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Is Late Deduction?</label>
                      <select value={shiftIsLateDeduct} onChange={e => setShiftIsLateDeduct(e.target.value as any)} className={insetSelectClass}>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Deduction From</label>
                      <input type="text" value={shiftDeductFrom} onChange={e => setShiftDeductFrom(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Deduction Per</label>
                      <input type="text" value={shiftDeductPer} onChange={e => setShiftDeductPer(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Deduction After Day</label>
                      <input type="text" value={shiftDeductAfterDay} onChange={e => setShiftDeductAfterDay(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={`${insetWrapperClass} sm:col-span-2`}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select value={shiftIsActive} onChange={e => setShiftIsActive(e.target.value as any)} className={insetSelectClass}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "ot" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Employee Type *</label>
                      <input type="text" placeholder="e.g. ALL, Permanent" value={otEmpType} onChange={e => setOtEmpType(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>OT Calculation Type *</label>
                      <select value={otCalcType} onChange={e => setOtCalcType(e.target.value)} className={insetSelectClass}>
                        <option value="Flat Hour">Flat Hour</option>
                        <option value="Basic Ratio">Basic Ratio</option>
                        <option value="Gross Ratio">Gross Ratio</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Buffer Minutes *</label>
                      <input type="number" value={otBuffer} onChange={e => setOtBuffer(Number(e.target.value))} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select value={otIsActive} onChange={e => setOtIsActive(e.target.value as any)} className={insetSelectClass}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "abnormal" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Shift Name *</label>
                      <input type="text" placeholder="Abnormal Shift Name" value={abShiftName} onChange={e => setAbShiftName(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Date *</label>
                      <input type="date" value={abDate} onChange={e => setAbDate(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Reason</label>
                      <input type="text" placeholder="Reason details" value={abReason} onChange={e => setAbReason(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select value={abIsActive} onChange={e => setAbIsActive(e.target.value as any)} className={insetSelectClass}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "bonus" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Policy Name *</label>
                      <input type="text" placeholder="Policy Name" value={policyName} onChange={e => setPolicyName(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Allowed Late Days *</label>
                      <input type="number" value={policyLate} onChange={e => setPolicyLate(Number(e.target.value))} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Allowed Absent Days *</label>
                      <input type="number" value={policyAbsent} onChange={e => setPolicyAbsent(Number(e.target.value))} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Bonus Amount (BDT) *</label>
                      <input type="number" value={policyAmount} onChange={e => setPolicyAmount(Number(e.target.value))} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select value={policyIsActive} onChange={e => setPolicyIsActive(e.target.value as any)} className={insetSelectClass}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Modal Footer Actions */}
                <div className="border-t border-border/50 pt-5 flex items-center justify-between gap-3 bg-[#f8fafc] dark:bg-[#0f172a] -mx-6 -mb-6 p-6">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="h-10 px-6 rounded-lg bg-[#f39c12] hover:bg-[#e67e22] text-white font-black text-xs transition-all uppercase tracking-wider shadow-sm hover:shadow"
                  >
                    CLOSE
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-8 rounded-lg text-white font-black text-xs shadow-md hover:shadow-lg transition-all uppercase tracking-wider flex items-center gap-1.5 bg-[#2ecc71] hover:bg-[#27ae60]"
                  >
                    {editSl ? "UPDATE" : "CREATE"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
