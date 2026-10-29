import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { employeesData } from "@/routes/personnel-list";
import { rawIncrementRecords } from "@/routes/-increment-history-data";
import {
  User,
  Gift,
  DollarSign,
  Camera,
  GraduationCap,
  History,
  Award,
  BookOpen,
  Users,
  PhoneCall,
  FileSignature,
  Heart,
  Baby,
  FileText,
  FileDown,
  ShieldCheck,
  Laptop,
  Check,
  MapPin,
  Briefcase,
  UserCog,
  Clock,
  FileClock,
  ArrowUpRight,
  UserPlus,
  TrendingUp,
  ChevronRight,
  ArrowLeft,
  CalendarRange,
  Info,
  Power,
  HelpCircle,
  QrCode,
  ExternalLink,
  Globe,
} from "lucide-react";
import {
  SocialMediaIcon,
  getSafeExternalUrl,
  getPlatformDisplayName,
  SocialMediaLink,
} from "@/components/social-media/SocialMediaUtils";
import { getCardByEmployeeId } from "@/lib/digital-business-card-service";

export const Route = createFileRoute("/employee-detail/$id")({
  component: EmployeeDetailPage,
});

function EmployeeDetailPage() {
  const { id } = Route.useParams();

  const [employees, setEmployees] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const synced = localStorage.getItem("recruitment_synced_employees");
      if (synced) {
        try {
          const parsed = JSON.parse(synced);
          if (parsed && parsed.length > 0) {
            const merged = [...parsed];
            employeesData.forEach((d) => {
              if (!merged.some((m) => m.id === d.id)) {
                merged.push(d);
              }
            });
            return merged;
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    return employeesData;
  });

  const selectedEmp = useMemo(() => {
    return employees.find((e) => e.id === id) || employees[0];
  }, [id, employees]);

  const incRecord = useMemo(() => {
    return rawIncrementRecords.find((r) => r.empId === selectedEmp.id);
  }, [selectedEmp.id]);

  const careerTimeline = useMemo(() => {
    const timeline: any[] = [];

    timeline.push({
      id: selectedEmp.id,
      title: selectedEmp.title,
      dept: selectedEmp.dept,
      status: selectedEmp.status || "Working",
      joinDate: selectedEmp.joinDate,
      resignDate: selectedEmp.resignDate || "Active",
      isCurrent: true,
    });

    let refId = selectedEmp.rejoinRef;
    let visited = new Set<string>([selectedEmp.id]);
    while (refId) {
      if (visited.has(refId)) break;
      visited.add(refId);

      const prevEmp = employees.find((e) => e.id === refId);
      if (prevEmp) {
        timeline.push({
          id: prevEmp.id,
          title: prevEmp.title,
          dept: prevEmp.dept,
          status: prevEmp.status || "Resigned",
          joinDate: prevEmp.joinDate,
          resignDate: prevEmp.resignDate || "—",
          isCurrent: false,
        });
        refId = prevEmp.rejoinRef;
      } else {
        timeline.push({
          id: refId,
          title: "Previous Position",
          dept: selectedEmp.dept,
          status: "Resigned",
          joinDate: "—",
          resignDate: selectedEmp.joinDate,
          isCurrent: false,
        });
        break;
      }
    }

    let forwardEmp = employees.find((e) => e.rejoinRef === selectedEmp.id);
    while (forwardEmp) {
      if (visited.has(forwardEmp.id)) break;
      visited.add(forwardEmp.id);

      timeline.unshift({
        id: forwardEmp.id,
        title: forwardEmp.title,
        dept: forwardEmp.dept,
        status: forwardEmp.status || "Working",
        joinDate: forwardEmp.joinDate,
        resignDate: forwardEmp.resignDate || "Active",
        isCurrent: false,
      });
      forwardEmp = employees.find((e) => e.rejoinRef === forwardEmp.id);
    }

    return timeline;
  }, [selectedEmp, employees]);

  const TABS = [
    { id: "personal", label: "Personal & Identity", icon: User },
    { id: "financial", label: "Financial & Employment", icon: DollarSign },
    { id: "qualification", label: "Qualification & Experience", icon: GraduationCap },
    { id: "family", label: "Family & Dependents", icon: Users },
    { id: "docs", label: "Verification & Docs", icon: ShieldCheck },
    { id: "increment", label: "Increment History", icon: TrendingUp },
  ];
  const [activeTab, setActiveTab] = useState("personal");

  const grossNum = parseFloat(selectedEmp.gross) || 30000;
  const basicVal = (grossNum * 0.6).toFixed(2);
  const houseRentVal = (grossNum * 0.25).toFixed(2);
  const medicalVal = (grossNum * 0.08).toFixed(2);
  const conveyanceVal = (grossNum * 0.04).toFixed(2);
  const foodVal = (grossNum * 0.03).toFixed(2);
  const pfVal = (grossNum * 0.6 * 0.1).toFixed(2);
  const festivalBonusVal = basicVal;

  const getAllowanceVal = (val: any, fallback: number) => {
    return (val !== undefined && val !== null && val !== "") ? parseFloat(val) : fallback;
  };

  const specialAllowanceVal = getAllowanceVal(selectedEmp.specialAllowance, 5000);
  const mobileAllowanceVal = getAllowanceVal(selectedEmp.mobileAllowance, 1000);
  const internetAllowanceVal = getAllowanceVal(selectedEmp.internetAllowance, 1500);
  const utilityAllowanceVal = getAllowanceVal(selectedEmp.utilityAllowance, 2000);
  const transportAllowanceVal = getAllowanceVal(selectedEmp.transportAllowance, 0);
  const lunchAllowanceVal = getAllowanceVal(selectedEmp.lunchAllowance, 0);
  const taxDeductionVal = getAllowanceVal(selectedEmp.taxDeduction, 0);
  const gratuityVal = getAllowanceVal(selectedEmp.gratuity, 0);

  const totalAllowanceVal = specialAllowanceVal + mobileAllowanceVal + internetAllowanceVal + utilityAllowanceVal + transportAllowanceVal + lunchAllowanceVal;
  const netPayableVal = grossNum + totalAllowanceVal - taxDeductionVal;

  const nameBngVal =
    selectedEmp.name === "Tahmid Afsar Shapno"
      ? "তাহমিদ আফসার স্বপন"
      : selectedEmp.name === "Sohanur Rahman Sohan"
        ? "সোহানুর রহমান সোহান"
        : selectedEmp.name === "Easin Mia"
          ? "ইয়াসিন মিয়া"
          : selectedEmp.name === "Jannatul Maowa"
            ? "জান্নাতুল মাওয়া"
            : selectedEmp.name + " (বাংলা)";

  const fatherNameEng = "Mohammad Abdur Rahman";
  const motherNameEng = "Sultana Begum";
  const spouseNameEng = selectedEmp.gender === "Female" ? "Mohammad Karim" : "—";
  const nomineeName = selectedEmp.gender === "Female" ? "Abdur Rahman" : "Fatema Begum";

  const laptopAsset = `COMP-${selectedEmp.id.slice(0, 4)}-992`;
  const accessCard = `RFID-${selectedEmp.id.slice(6)}`;

  return (
    <div className="min-h-screen flex bg-slate-50/50 text-slate-900 transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-hidden">
        <Topbar />

        {/* FIXED HEADER ZONE - Glassmorphic */}
        <div className="shrink-0 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200/60 z-20 px-4 md:px-6 xl:px-8 pt-4 pb-4">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">
              <Link
                to="/personnel-list"
                className="hover:text-indigo-600 transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="size-3" /> Personnel List
              </Link>
              <ChevronRight className="size-3 opacity-50" />
              <span className="text-slate-600">Digital File</span>
            </div>

            {/* Premium Floating Profile Card */}
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-5 md:p-6 flex flex-col md:flex-row gap-6 md:items-center transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              {/* Avatar */}
              <div className="size-20 md:size-24 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-center text-slate-400 shadow-sm shrink-0 relative overflow-hidden group">
                {selectedEmp.image ? (
                  <img src={selectedEmp.image} alt={selectedEmp.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <img
                    src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&auto=format&fit=crop`}
                    alt="Demo Profile"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                  <Camera className="size-6 text-white drop-shadow-md" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                  {/* Core Info */}
                  <div className="space-y-1.5">
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
                      {selectedEmp.name}
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${selectedEmp.acStatus === "Active"
                          ? "bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-600/20"
                          : "bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-600/20"
                          }`}
                      >
                        {selectedEmp.acStatus || "Active"}
                      </span>
                    </h1>

                    <div className="text-sm font-medium text-slate-500 flex items-center gap-2.5 flex-wrap">
                      <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">
                        <Briefcase className="size-3.5 text-indigo-500" />
                        {selectedEmp.title}
                      </div>
                      <span className="text-slate-300">•</span>
                      <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">
                        <MapPin className="size-3.5 text-rose-400" />
                        {selectedEmp.dept}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-5 pt-4 border-t border-slate-100">
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employee ID</div>
                        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-700 font-semibold">
                          <User className="size-3.5 text-slate-400" />
                          {selectedEmp.id}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Phone</div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                          <PhoneCall className="size-3.5 text-slate-400" />
                          {selectedEmp.phone || "+880 1XXX-XXXXXX"}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Joined Date</div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                          <Clock className="size-3.5 text-slate-400" />
                          {selectedEmp.joinDate}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 flex-wrap shrink-0 sm:self-start">
                    <Link
                      to="/digital-business-card/$id"
                      params={{ id: getCardByEmployeeId(selectedEmp.id)?.publicToken || selectedEmp.id }}
                      target="_blank"
                      className="h-9 px-3.5 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 hover:shadow-md hover:-translate-y-0.5"
                    >
                      <QrCode className="size-3.5 text-sky-600" /> Digital Business Card
                    </Link>
                    <button className="h-9 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-all flex items-center gap-2 hover:shadow-md hover:-translate-y-0.5">
                      <FileDown className="size-3.5 text-slate-400" /> Download PDF
                    </button>
                    <Link
                      to="/add-employee"
                      search={{ id: selectedEmp.id } as any}
                      className="h-9 px-4 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm hover:bg-indigo-700 hover:shadow-[0_4px_12px_rgba(79,70,229,0.2)] transition-all flex items-center gap-2 hover:-translate-y-0.5"
                    >
                      <UserCog className="size-3.5 text-indigo-200" /> Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SCROLLABLE TABS CONTENT */}
        <div className="flex-1 overflow-y-auto scrollbar-thin bg-slate-50/30">
          <div className="max-w-7xl mx-auto p-4 md:p-6 xl:p-8 space-y-6 pb-24">

            {/* Rejoined Employee Banner Notification */}
            {(selectedEmp.rejoinRef || selectedEmp.rejoinedTo || careerTimeline.length > 1) && (
              <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-200">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                    <CalendarRange className="size-5 shrink-0" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      Rejoined Employee History
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      This profile is connected to multiple career periods. Viewing:{" "}
                      <span className="font-semibold text-foreground font-mono">
                        ID: {selectedEmp.id}
                      </span>{" "}
                      ({selectedEmp.joinDate} to{" "}
                      {selectedEmp.status === "Working" ? "Present" : selectedEmp.resignDate || "—"}).
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {careerTimeline.map((period, idx) => (
                    <Link
                      key={period.id}
                      to="/employee-detail/$id"
                      params={{ id: period.id }}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border transition duration-150 ${period.id === selectedEmp.id
                        ? "bg-indigo-500 border-indigo-500 text-white font-medium"
                        : "bg-card border-border/80 hover:bg-muted text-foreground"
                        }`}
                    >
                      Period {careerTimeline.length - idx}: {period.id}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* TABS NAVIGATION */}
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 overflow-hidden mb-6">
              <div className="flex overflow-x-auto scrollbar-none p-2 gap-2 bg-slate-50/50 border-b border-slate-100">
                {TABS.map((tab) => {
                  const TabIcon = tab.icon;
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 py-2.5 px-5 rounded-xl text-xs font-bold transition-all duration-300 shrink-0 ${isSelected
                        ? "bg-white text-indigo-600 shadow-[0_2px_10px_rgb(0,0,0,0.06)] ring-1 ring-slate-100/50"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                    >
                      <TabIcon className={`size-4 shrink-0 transition-transform duration-300 ${isSelected ? "scale-110" : ""}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="p-5 md:p-6 min-h-[500px]">
                {/* 1. PERSONAL & IDENTITY */}
                {activeTab === "personal" && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    {/* 1. Primary Information */}
                    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 p-5 md:p-6 transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
                      <h4 className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 mb-5 flex items-center gap-2">
                        <User className="size-4" /> Primary Information
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Name (English)
                          </div>
                          <div className="text-sm font-bold text-slate-900">{selectedEmp.name}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Name (Bengali)
                          </div>
                          <div className="text-sm font-bold text-slate-700">{nameBngVal}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Date of Birth
                          </div>
                          <div className="text-sm font-bold text-slate-700">{selectedEmp.dob}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Gender
                          </div>
                          <div className="text-sm font-bold text-slate-700">{selectedEmp.gender}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Religion
                          </div>
                          <div className="text-sm font-bold text-slate-700">Islam</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Blood Group
                          </div>
                          <div className="text-sm font-extrabold text-rose-500">{selectedEmp.blood}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Marital Status
                          </div>
                          <div className="text-sm font-bold text-slate-700">Single</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Education Level
                          </div>
                          <div className="text-sm font-bold text-slate-700">Bachelor of Science (B.Sc)</div>
                        </div>
                      </div>
                    </div>

                    {/* 2. Corporate Information */}
                    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 p-5 md:p-6 transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
                      <h4 className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 mb-5 flex items-center gap-2">
                        <Briefcase className="size-4" /> Corporate Information
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Emp ID (System)
                          </div>
                          <div className="text-sm font-extrabold text-slate-900">
                            {selectedEmp.id}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Emp ID (Company)
                          </div>
                          <div className="text-sm font-bold text-slate-700">{selectedEmp.offcId || "—"}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Joining Date
                          </div>
                          <div className="text-sm font-bold text-slate-700">{selectedEmp.joinDate}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Confirmation Date
                          </div>
                          <div className="text-sm font-bold text-slate-700">{selectedEmp.confirmDate || "—"}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Department
                          </div>
                          <div className="text-sm font-extrabold text-slate-900">{selectedEmp.dept}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Designation
                          </div>
                          <div className="text-sm font-extrabold text-slate-900">{selectedEmp.title}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Employee Type
                          </div>
                          <div className="text-sm font-bold text-slate-700">{selectedEmp.type}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Working Area
                          </div>
                          <div className="text-sm font-bold text-slate-700">PSL-Operation</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Section
                          </div>
                          <div className="text-sm font-bold text-slate-700">{selectedEmp.sect}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Job Nature
                          </div>
                          <div className="text-sm font-bold text-slate-700">ALL</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Unit
                          </div>
                          <div className="text-sm font-bold text-slate-700">{selectedEmp.unit}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Line
                          </div>
                          <div className="text-sm font-bold text-slate-700">{selectedEmp.line}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Grade
                          </div>
                          <div className="text-sm font-bold font-mono text-indigo-500">
                            {selectedEmp.grade}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Shift
                          </div>
                          <div className="text-sm font-bold text-slate-700">{selectedEmp.shift}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Employment Status
                          </div>
                          <div className="text-sm font-bold text-emerald-600">
                            {selectedEmp.empStatus}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Probation Period
                          </div>
                          <div className="text-sm font-bold text-slate-700">N/A</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Default Holiday
                          </div>
                          <div className="text-sm font-bold text-slate-700">{selectedEmp.holiday}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Set Manager
                          </div>
                          <div className="text-sm font-bold text-slate-700 truncate">Mamunoor Rashid (DGM)</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Recruitment Type
                          </div>
                          <div className="text-sm font-bold text-slate-700">New</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            RC Notes
                          </div>
                          <div className="text-sm font-bold text-slate-700 truncate">Hired via Campus Drive</div>
                        </div>
                      </div>
                    </div>

                    {/* Re-employment & Career Timeline History */}
                    {careerTimeline.length > 1 && (
                      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 p-5 md:p-6 transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 mb-5 flex items-center gap-2">
                          <History className="size-4" /> Re-employment & Career Timeline
                        </h4>
                        <div className="relative border-l-2 border-indigo-100 ml-4 pl-6 space-y-6">
                          {careerTimeline.map((period, idx) => (
                            <div key={period.id} className="relative">
                              {/* Timeline indicator circle */}
                              <div
                                className={`absolute -left-[33px] top-0.5 size-5 rounded-full border-2 flex items-center justify-center ${period.id === selectedEmp.id
                                  ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/30"
                                  : "bg-white border-indigo-200 text-indigo-400"
                                  }`}
                              >
                                <span className="text-[9px] leading-none font-bold">
                                  {careerTimeline.length - idx}
                                </span>
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-900 text-sm">
                                      ID: {period.id}
                                    </span>
                                    {period.id === selectedEmp.id && (
                                      <span className="text-[9px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded uppercase tracking-wide font-bold">
                                        Currently Viewing
                                      </span>
                                    )}
                                    <span
                                      className={`text-[9px] px-2 py-0.5 rounded uppercase tracking-wide font-bold ${period.status === "Working"
                                        ? "bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-600/20"
                                        : "bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-600/20"
                                        }`}
                                    >
                                      {period.status}
                                    </span>
                                  </div>
                                  <p className="text-xs font-medium text-slate-500 mt-1">
                                    {period.title} <span className="text-slate-300 mx-1">•</span> {period.dept}
                                  </p>
                                </div>
                                <div className="sm:text-right">
                                  <div className="text-xs text-slate-500 font-medium">
                                    Joined: <span className="text-slate-700 font-bold">{period.joinDate}</span>
                                  </div>
                                  <div className="text-xs text-slate-500 font-medium">
                                    Left: <span className="text-slate-700 font-bold">{period.resignDate}</span>
                                  </div>
                                </div>
                                {period.id !== selectedEmp.id && (
                                  <Link
                                    to="/employee-detail/$id"
                                    params={{ id: period.id }}
                                    className="text-xs text-indigo-600 hover:text-indigo-700 font-bold hover:underline transition self-start sm:self-center"
                                  >
                                    Switch Profile &rarr;
                                  </Link>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 3. Legal Information */}
                    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 p-5 md:p-6 transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
                      <h4 className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 mb-5 flex items-center gap-2">
                        <ShieldCheck className="size-4" /> Legal Information
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            National ID (NID)
                          </div>
                          <div className="text-sm font-bold text-slate-900 font-mono">1928374659201</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Birth Reg No
                          </div>
                          <div className="text-sm font-bold text-slate-400 font-mono italic">Not Provided</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Passport No
                          </div>
                          <div className="text-sm font-bold text-slate-400 font-mono italic">Not Provided</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Driving License No
                          </div>
                          <div className="text-sm font-bold text-slate-400 font-mono italic">Not Provided</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Prof. Membership No
                          </div>
                          <div className="text-sm font-bold text-slate-900 font-mono">IEB-92812</div>
                        </div>
                      </div>
                    </div>

                    {/* 4. Parental Information */}
                    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 p-5 md:p-6 transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
                      <h4 className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 mb-5 flex items-center gap-2">
                        <Users className="size-4" /> Parental Information
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              Father Name (English)
                            </div>
                            <div className="text-sm font-bold text-slate-900">{fatherNameEng}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              Father Name (Bengali)
                            </div>
                            <div className="text-sm font-bold text-slate-700">মোহাম্মদ আবদুর রহমান</div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              Mother Name (English)
                            </div>
                            <div className="text-sm font-bold text-slate-900">{motherNameEng}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              Mother Name (Bengali)
                            </div>
                            <div className="text-sm font-bold text-slate-700">সুলতানা বেগম</div>
                          </div>
                        </div>
                        <div className="col-span-1 sm:col-span-2 pt-4 border-t border-slate-100">
                          <div className="text-xs font-semibold text-slate-400 italic">
                            Spouse information fields are hidden because Marital Status is set to Single.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 5. Residential Address */}
                    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 p-5 md:p-6 transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
                      <h4 className="text-[11px] font-bold uppercase tracking-widest text-amber-600 mb-5 flex items-center gap-2">
                        <MapPin className="size-4" /> Residential Address
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Present Address */}
                        <div className="space-y-4">
                          <div className="text-[10px] font-extrabold uppercase text-amber-600 border-b border-slate-100 pb-2">
                            Present Address
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Division</div>
                              <div className="font-bold text-slate-900">Dhaka</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">District</div>
                              <div className="font-bold text-slate-900">Dhaka</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Upazila</div>
                              <div className="font-bold text-slate-900">Mirpur</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Post Office</div>
                              <div className="font-bold text-slate-900">Mirpur-12</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Village/House (Eng)</div>
                              <div className="font-bold text-slate-900">Vill # Dhopapara</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Village/House (Bng)</div>
                              <div className="font-bold text-slate-700">গ্রাম # ধোপাপাড়া</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Road</div>
                              <div className="font-bold text-slate-900">Road # 12</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Country</div>
                              <div className="font-bold text-slate-900">Bangladesh</div>
                            </div>
                          </div>
                          <div className="pt-3 border-t border-slate-100">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Mailing Dispatch Preview</div>
                            <div className="text-xs font-medium italic mt-1 text-slate-600">
                              Vill # Dhopapara, Road # 12, Mirpur, Dhaka, Bangladesh
                            </div>
                          </div>
                        </div>

                        {/* Permanent Address */}
                        <div className="space-y-4">
                          <div className="text-[10px] font-extrabold uppercase text-slate-600 border-b border-slate-100 pb-2">
                            Permanent Address
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Division</div>
                              <div className="font-bold text-slate-900">Dhaka</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">District</div>
                              <div className="font-bold text-slate-900">Dhaka</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Upazila</div>
                              <div className="font-bold text-slate-900">Mirpur</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Post Office</div>
                              <div className="font-bold text-slate-900">Mirpur-12</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Village/House (Eng)</div>
                              <div className="font-bold text-slate-900">Vill # Dhopapara</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Village/House (Bng)</div>
                              <div className="font-bold text-slate-700">গ্রাম # ধোপাপাড়া</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Road</div>
                              <div className="font-bold text-slate-900">Road # 12</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Country</div>
                              <div className="font-bold text-slate-900">Bangladesh</div>
                            </div>
                          </div>
                          <div className="pt-3 border-t border-slate-100">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Legal Dossier Dispatch Preview</div>
                            <div className="text-xs font-medium italic mt-1 text-slate-600">
                              Vill # Dhopapara, Road # 12, Mirpur, Dhaka, Bangladesh
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 6. Contact Information */}
                    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 p-5 md:p-6 transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)] space-y-5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                          <PhoneCall className="size-4" /> Contact Information
                        </h4>
                        <Link
                          to="/digital-business-card/$id"
                          params={{ id: getCardByEmployeeId(selectedEmp.id)?.publicToken || selectedEmp.id }}
                          target="_blank"
                          className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                        >
                          <QrCode className="size-3.5" />
                          <span>View Public Business Card</span>
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Office Email</div>
                          <div className="text-sm font-bold text-indigo-600 truncate">{selectedEmp.email || "employee@pakizasoftware.com"}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Office Mobile</div>
                          <div className="text-sm font-bold text-slate-900 font-mono">{selectedEmp.officeMob || "017500XXXXX"}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Office Extension</div>
                          <div className="text-sm font-bold text-slate-900 font-mono">102</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Personal Email</div>
                          <div className="text-sm font-bold text-slate-600 truncate">personal@gmail.com</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Personal Contact No</div>
                          <div className="text-sm font-bold text-slate-900 font-mono">{selectedEmp.phone !== "—" ? selectedEmp.phone : selectedEmp.personalContact || "017130XXXXX"}</div>
                        </div>
                      </div>

                      {/* Social Media Links display */}
                      <div className="pt-4 border-t border-slate-100 space-y-2.5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Globe className="size-3.5 text-sky-500" />
                          Social Media Links & Digital Profiles
                        </div>

                        {Array.isArray(selectedEmp.socialMediaLinks) && selectedEmp.socialMediaLinks.length > 0 ? (
                          <div className="flex flex-wrap gap-2.5">
                            {selectedEmp.socialMediaLinks.map((link: SocialMediaLink, i: number) => {
                              const safeHref = getSafeExternalUrl(link.url);
                              const displayName = getPlatformDisplayName(link);
                              return (
                                <a
                                  key={link.id || i}
                                  href={safeHref}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-sky-300 text-xs font-semibold text-slate-700 transition shadow-2xs"
                                >
                                  <SocialMediaIcon platform={link.platform} className="size-3.5" />
                                  <span>{displayName}</span>
                                  <ExternalLink className="size-3 text-slate-400" />
                                </a>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 italic flex items-center gap-2">
                            <span>No social media links published yet.</span>
                            <Link
                              to="/add-employee"
                              search={{ id: selectedEmp.id } as any}
                              className="text-xs text-indigo-600 hover:underline font-semibold not-italic"
                            >
                              + Add Social Links
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 7. Documents */}
                    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 p-5 md:p-6 transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
                      <h4 className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 mb-5 flex items-center gap-2">
                        <FileDown className="size-4" /> Documents
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-5 flex flex-col items-center text-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md">
                          <div className="size-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                            <User className="size-6" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">Employee Portrait</div>
                            <div className="text-[10px] text-slate-500 mt-1">Premium front portrait</div>
                          </div>
                          <span className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full ring-1 ring-inset ring-emerald-600/20">
                            <Check className="size-3" /> Uploaded
                          </span>
                        </div>
                        <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-5 flex flex-col items-center text-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md">
                          <div className="size-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                            <FileSignature className="size-6" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">Authorized Signature</div>
                            <div className="text-[10px] text-slate-500 mt-1">Clean white sheet</div>
                          </div>
                          <span className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full ring-1 ring-inset ring-emerald-600/20">
                            <Check className="size-3" /> Uploaded
                          </span>
                        </div>
                        <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-5 flex flex-col items-center text-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md">
                          <div className="size-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm">
                            <FileText className="size-6" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">National ID Card</div>
                            <div className="text-[10px] text-slate-500 mt-1">Both sides JPG/PDF</div>
                          </div>
                          <span className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full ring-1 ring-inset ring-emerald-600/20">
                            <Check className="size-3" /> Uploaded
                          </span>
                        </div>
                        <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-5 flex flex-col items-center text-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md">
                          <div className="size-14 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shadow-sm">
                            <GraduationCap className="size-6" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">Degree Certificate</div>
                            <div className="text-[10px] text-slate-500 mt-1">Academic graduation</div>
                          </div>
                          <span className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full ring-1 ring-inset ring-emerald-600/20">
                            <Check className="size-3" /> Uploaded
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* 8. Emergency Contact & Reachability */}
                      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 p-5 md:p-6 transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-rose-500 mb-5 flex items-center gap-2">
                          <PhoneCall className="size-4" /> Emergency Contact
                        </h4>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Contact Person</div>
                              <div className="font-bold text-slate-900">Mohammad Abdur Rahman</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Relationship</div>
                              <div className="font-bold text-slate-700">Father</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Primary Mobile No</div>
                              <div className="font-bold text-slate-900 font-mono">+880 1750-021154</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Alternative Contact</div>
                              <div className="font-bold text-slate-900 font-mono">01911-223344</div>
                            </div>
                            <div className="col-span-2 space-y-1">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Email Address</div>
                              <div className="font-bold text-indigo-600">parent@gmail.com</div>
                            </div>
                          </div>
                          <div className="pt-3 border-t border-slate-100">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Detailed Address</div>
                            <div className="text-xs font-medium italic mt-1 text-slate-600">Vill # Dhopapara, Road # 12, Mirpur, Dhaka, Bangladesh</div>
                          </div>
                        </div>
                      </div>

                      {/* 9. Professional & Corporate References */}
                      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 p-5 md:p-6 transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)] h-full">
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 mb-5 flex items-center gap-2">
                          <Briefcase className="size-4" /> Professional References
                        </h4>
                        <div className="space-y-5">
                          <div className="space-y-3">
                            <div className="text-[10px] font-extrabold uppercase text-indigo-600 border-b border-slate-100 pb-1.5">Primary Reference</div>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div className="space-y-1">
                                <div className="text-[10px] font-bold text-slate-400 uppercase">Referee Name</div>
                                <div className="font-bold text-slate-900">Dr. Selim Reza</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-[10px] font-bold text-slate-400 uppercase">Contact Number</div>
                                <div className="font-bold text-slate-900 font-mono">01711-223344</div>
                              </div>
                              <div className="col-span-2 space-y-1">
                                <div className="text-[10px] font-bold text-slate-400 uppercase">Designation & Org</div>
                                <div className="font-bold text-slate-700">Professor, University of Dhaka</div>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3 pt-4 border-t border-slate-100">
                            <div className="text-[10px] font-extrabold uppercase text-indigo-600 border-b border-slate-100 pb-1.5">Secondary Reference</div>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div className="space-y-1">
                                <div className="text-[10px] font-bold text-slate-400 uppercase">Referee Name</div>
                                <div className="font-bold text-slate-900">Ahmed Kabir</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-[10px] font-bold text-slate-400 uppercase">Contact Number</div>
                                <div className="font-bold text-slate-900 font-mono">01822-334455</div>
                              </div>
                              <div className="col-span-2 space-y-1">
                                <div className="text-[10px] font-bold text-slate-400 uppercase">Designation & Org</div>
                                <div className="font-bold text-slate-700">Director, Tech Ltd</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "financial" && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    {/* 1. Compensation Structure & Financials */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 border-b border-border/20 pb-1.5">
                        Salary Breakdown
                      </h4>
                      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2 font-mono text-xs pr-4">
                            <div className="flex justify-between items-center pb-2 border-b border-emerald-500/20">
                              <span className="text-muted-foreground font-sans font-bold uppercase tracking-wider text-[10px]">
                                Gross Salary
                              </span>
                              <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                                ৳{grossNum.toLocaleString("en-IN")}
                              </span>
                            </div>
                            <div className="flex justify-between items-center pt-1">
                              <span className="text-muted-foreground font-sans font-bold">
                                Basic Salary (60%)
                              </span>
                              <span className="font-bold text-foreground">
                                ৳{parseFloat(basicVal).toLocaleString("en-IN")}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground font-sans font-bold">
                                House Rent (25%)
                              </span>
                              <span className="font-bold text-foreground">
                                ৳{parseFloat(houseRentVal).toLocaleString("en-IN")}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground font-sans font-bold">
                                Medical (8%)
                              </span>
                              <span className="font-bold text-foreground">
                                ৳{parseFloat(medicalVal).toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2 font-mono text-xs md:pl-4 md:border-l border-emerald-500/20 pt-2 md:pt-0">
                            <div className="flex justify-between items-center pb-2 border-b border-transparent md:border-emerald-500/20 hidden md:flex">
                              <span className="text-transparent font-sans font-bold uppercase tracking-wider text-[10px]">
                                -
                              </span>
                              <span className="text-transparent font-black text-sm">-</span>
                            </div>
                            <div className="flex justify-between items-center pt-1">
                              <span className="text-muted-foreground font-sans font-bold">
                                Conveyance (4%)
                              </span>
                              <span className="font-bold text-foreground">
                                ৳{(grossNum * 0.04).toLocaleString("en-IN")}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground font-sans font-bold">
                                Food (3%)
                              </span>
                              <span className="font-bold text-foreground">
                                ৳{(grossNum * 0.03).toLocaleString("en-IN")}
                              </span>
                            </div>
                            <div className="flex justify-between items-center pt-1 mt-1 border-t border-emerald-500/10">
                              <span className="text-emerald-600 font-sans font-bold">
                                Provident Fund (10% of Basic)
                              </span>
                              <span className="font-bold text-emerald-600">
                                ৳{parseFloat(pfVal).toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                      {/* 2. Supplementary Allowances & Taxes */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500 border-b border-border/20 pb-1.5">
                          Supplementary Allowances & Taxes
                        </h4>
                        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-2 text-xs font-mono">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground font-sans font-bold">
                              Special Allowance
                            </span>
                            <span className="font-bold text-foreground">
                              ৳{specialAllowanceVal.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground font-sans font-bold">
                              Mobile Allowance
                            </span>
                            <span className="font-bold text-foreground">
                              ৳{mobileAllowanceVal.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground font-sans font-bold">
                              Internet Allowance
                            </span>
                            <span className="font-bold text-foreground">
                              ৳{internetAllowanceVal.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground font-sans font-bold">
                              Utility Allowance
                            </span>
                            <span className="font-bold text-foreground">
                              ৳{utilityAllowanceVal.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-amber-500/20 text-rose-500">
                            <span className="font-sans font-bold">Tax Deduction</span>
                            <span className="font-bold">
                              ৳{taxDeductionVal.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-rose-500">
                            <span className="font-sans font-bold">Gratuity Contribution</span>
                            <span className="font-bold">
                              ৳{gratuityVal.toLocaleString("en-IN")}
                            </span>
                          </div>

                          <div className="flex justify-between items-center pt-3 mt-1 border-t border-amber-500/20">
                            <span className="font-sans font-extrabold text-foreground uppercase text-[10px]">
                              Total Allowance
                            </span>
                            <span className="font-black text-foreground">
                              ৳{totalAllowanceVal.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-1">
                            <span className="font-sans font-extrabold text-emerald-600 uppercase text-[10px]">
                              Est. Net Payable
                            </span>
                            <span className="font-black text-emerald-600">
                              ৳{netPayableVal.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 2.5. Overtime & Bonus Allowance settings */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#7cb342] border-b border-border/20 pb-1.5">
                          Overtime & Bonus Allowance
                        </h4>
                        <div className="bg-[#7cb342]/5 border border-[#7cb342]/20 rounded-xl p-4 space-y-2 text-xs font-mono">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground font-sans font-bold">
                              Allowance Option
                            </span>
                            <span className="font-bold text-foreground">
                              {selectedEmp.allowanceOption || "OverTime"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground font-sans font-bold">
                              Attendance Bonus Rate
                            </span>
                            <span className="font-bold text-[#7cb342]">
                              ৳{parseFloat(selectedEmp.attendanceBonusRate || "425").toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground font-sans font-bold">
                              Holiday Rate
                            </span>
                            <span className="font-bold text-foreground">
                              ৳{parseFloat(selectedEmp.holidayRate || "0").toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground font-sans font-bold">
                              Behavior Bonus
                            </span>
                            <span className="font-bold text-[#7cb342]">
                              ৳{parseFloat(selectedEmp.behaviorBonus || "100").toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground font-sans font-bold">
                              Transport Allowance
                            </span>
                            <span className="font-bold text-foreground">
                              ৳{parseFloat(selectedEmp.transportAllowance || "0").toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground font-sans font-bold">
                              Mobile Allowance (Alt)
                            </span>
                            <span className="font-bold text-foreground">
                              ৳{parseFloat(selectedEmp.mobileAllowance || "0").toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground font-sans font-bold">
                              Lunch Allowance
                            </span>
                            <span className="font-bold text-foreground">
                              ৳{parseFloat(selectedEmp.lunchAllowance || "0").toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 3. Disbursement Routing & Bank details */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-500 border-b border-border/20 pb-1.5">
                          Disbursement Routing & Bank Details
                        </h4>
                        <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 space-y-3 h-full">
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="space-y-0.5">
                              <div className="text-[9px] font-bold text-muted-foreground uppercase">
                                Bank Pay
                              </div>
                              <div className="font-bold text-indigo-600 font-mono">
                                ৳{parseFloat(selectedEmp.bankPay || "0").toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                              </div>
                            </div>
                            <div className="space-y-0.5">
                              <div className="text-[9px] font-bold text-muted-foreground uppercase">
                                Cash Pay
                              </div>
                              <div className="font-bold text-emerald-600 font-mono">
                                ৳{parseFloat(selectedEmp.cashPay || "0").toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                              </div>
                            </div>
                            <div className="space-y-0.5">
                              <div className="text-[9px] font-bold text-muted-foreground uppercase">
                                Bank Name
                              </div>
                              <div className="font-bold">
                                {selectedEmp.bankName || "Dutch-Bangla Bank Limited"}
                              </div>
                            </div>
                            <div className="space-y-0.5">
                              <div className="text-[9px] font-bold text-muted-foreground uppercase">
                                Account Number
                              </div>
                              <div className="font-bold font-mono">
                                {selectedEmp.bankAccount || "102.120.99827"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. QUALIFICATION & EXPERIENCE */}
                {activeTab === "qualification" &&
                  (() => {
                    const eduList = selectedEmp.educationList || [
                      {
                        degree: "Bachelor of Science (B.Sc)",
                        institute: "IIT University of Dhaka",
                        passingYear: "2022",
                        resultGpa: "3.85",
                        attachment: "Certificate.pdf",
                      },
                    ];
                    const trainList = selectedEmp.trainingList || [
                      {
                        trainingTitle: "Advanced System Architecture",
                        institution: "Coursera / Pakiza Software",
                        duration: "12 Weeks",
                        completionDate: "10/03/2024",
                      },
                    ];
                    const expList = selectedEmp.experienceList || [
                      {
                        company: "Pakiza Software Limited",
                        designation: "Software Engineer",
                        fromDate: "01/01/2023",
                        toDate: "28/02/2025",
                        leavingReason: "Career Growth",
                        attachment: "NOC.pdf",
                      },
                    ];
                    const certList = selectedEmp.certifications || [
                      {
                        certificateName: "AWS Certified Solutions Architect",
                        organization: "Amazon Web Services",
                        credentialId: "AWS-102938",
                        issueDate: "15/06/2024",
                      },
                    ];
                    const involList = selectedEmp.involvements || [
                      {
                        activityName: "HRIS Standardization Committee",
                        role: "Technical Lead",
                        duration: "6 Months",
                        description: "Led database migration and performance optimizations",
                      },
                    ];

                    return (
                      <>
                        <div className="space-y-6 animate-in fade-in duration-300">
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* LEFT COLUMN: Career timeline & Involvements (7 Cols) */}
                            <div className="lg:col-span-7 space-y-6">
                              {/* Professional Career & Job History */}
                              <div className="bg-card border border-border/80 rounded-xl p-5 shadow-xs space-y-5">
                                <div className="flex items-center gap-2.5 border-b border-border/30 pb-3">
                                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Briefcase className="size-4.5" />
                                  </div>
                                  <div>
                                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-foreground">
                                      Professional Career Timeline
                                    </h3>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">
                                      Chronological record of verified industrial and job history.
                                    </p>
                                  </div>
                                </div>

                                <div className="relative border-l-2 border-border/50 ml-4.5 pl-6 space-y-6">
                                  {expList.map((exp: any, index: number) => (
                                    <div key={index} className="relative group">
                                      {/* Timeline Node Icon */}
                                      <div className="absolute -left-[33px] top-1.5 size-5 rounded-full border-2 border-primary bg-card flex items-center justify-center shadow-xs transition duration-200 group-hover:scale-110">
                                        <History className="size-3 text-primary" />
                                      </div>

                                      <div className="bg-muted/10 border border-border/40 hover:border-primary/20 rounded-xl p-4.5 transition-all duration-300 hover:shadow-2xs space-y-3 relative overflow-hidden">
                                        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/30 pb-2.5">
                                          <div>
                                            <h4 className="text-sm font-extrabold text-foreground">
                                              {exp.designation}
                                            </h4>
                                            <p className="text-xs font-bold text-muted-foreground mt-0.5">
                                              {exp.company}
                                            </p>
                                          </div>
                                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-primary font-mono shrink-0">
                                            {exp.fromDate} — {exp.toDate}
                                          </span>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] pt-1">
                                          <div className="space-y-0.5">
                                            <span className="text-[9px] font-bold text-muted-foreground/60 uppercase block">
                                              Reason for leaving
                                            </span>
                                            <p className="font-semibold text-foreground/80">
                                              {exp.leavingReason || "—"}
                                            </p>
                                          </div>
                                          {exp.attachment && (
                                            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-2.5 py-1 rounded-lg self-start sm:self-center">
                                              <Check className="size-3 shrink-0" />
                                              <span className="text-[10px] font-black uppercase tracking-wider font-mono">
                                                NOC Verified
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}

                                  {expList.length === 0 && (
                                    <div className="text-center py-6 text-muted-foreground text-xs italic">
                                      No prior work experience documented.
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Special Committee Involvements */}
                              <div className="bg-card border border-border/80 rounded-xl p-5 shadow-xs space-y-5">
                                <div className="flex items-center gap-2.5 border-b border-border/30 pb-3">
                                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                                    <Users className="size-4.5" />
                                  </div>
                                  <div>
                                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-foreground">
                                      Committee Commitments
                                    </h3>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">
                                      Internal panel technical leadership and operational duties.
                                    </p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                  {involList.map((invol: any, index: number) => (
                                    <div
                                      key={index}
                                      className="bg-amber-500/2 border border-amber-500/15 rounded-xl p-4.5 space-y-3 relative overflow-hidden group"
                                    >
                                      <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/3 rounded-bl-full pointer-events-none group-hover:bg-amber-500/6 transition-colors duration-300" />
                                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/20 pb-2.5">
                                        <div>
                                          <h4 className="text-xs font-extrabold text-foreground">
                                            {invol.activityName}
                                          </h4>
                                          <span className="inline-block text-[9px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded mt-1">
                                            {invol.role}
                                          </span>
                                        </div>
                                        <span className="text-[10px] font-extrabold font-mono text-muted-foreground shrink-0">
                                          {invol.duration}
                                        </span>
                                      </div>
                                      <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-muted-foreground/60 uppercase block">
                                          Deliverables / remarks
                                        </span>
                                        <p className="text-xs font-semibold text-foreground/80 leading-relaxed">
                                          {invol.description}
                                        </p>
                                      </div>
                                    </div>
                                  ))}

                                  {involList.length === 0 && (
                                    <div className="text-center py-6 text-muted-foreground text-xs italic">
                                      No committee commitments documented.
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* RIGHT COLUMN: Academics, Certifications & Trainings (5 Cols) */}
                            <div className="lg:col-span-5 space-y-6">
                              {/* Academic Qualifications */}
                              <div className="bg-card border border-border/80 rounded-xl p-5 shadow-xs space-y-5">
                                <div className="flex items-center gap-2.5 border-b border-border/30 pb-3">
                                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                                    <GraduationCap className="size-4.5" />
                                  </div>
                                  <div>
                                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-foreground">
                                      Educational Qualifications
                                    </h3>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">
                                      Verified educational degree qualifications.
                                    </p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                  {eduList.map((edu: any, index: number) => (
                                    <div
                                      key={index}
                                      className="bg-indigo-500/2 border border-indigo-500/10 hover:border-indigo-500/25 rounded-xl p-4 transition-all duration-300 hover:shadow-2xs relative overflow-hidden group"
                                    >
                                      <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/3 rounded-bl-full pointer-events-none group-hover:bg-indigo-500/6 transition-colors duration-300" />
                                      <div className="flex items-start gap-3">
                                        <div className="space-y-2 flex-1 min-w-0">
                                          <div className="flex items-center justify-between gap-2">
                                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-indigo-500">
                                              Education Degree
                                            </span>
                                            <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase flex items-center gap-1 shrink-0">
                                              <Check className="size-2.5" /> Verified
                                            </span>
                                          </div>
                                          <div>
                                            <h4 className="text-xs font-black text-foreground truncate">
                                              {edu.degree}
                                            </h4>
                                            <p className="text-[11px] font-bold text-muted-foreground truncate mt-0.5">
                                              {edu.institute}
                                            </p>
                                          </div>
                                          <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground font-mono pt-1">
                                            <span className="flex items-center gap-1">
                                              Year:{" "}
                                              <span className="text-foreground">{edu.passingYear}</span>
                                            </span>
                                            <span className="flex items-center gap-1">
                                              Result:{" "}
                                              <span className="text-foreground">{edu.resultGpa}</span>
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}

                                  {eduList.length === 0 && (
                                    <div className="text-center py-6 text-muted-foreground text-xs italic">
                                      No Educational Qualifications documented.
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Professional Certifications */}
                              <div className="bg-card border border-border/80 rounded-xl p-5 shadow-xs space-y-5">
                                <div className="flex items-center gap-2.5 border-b border-border/30 pb-3">
                                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                                    <ShieldCheck className="size-4.5" />
                                  </div>
                                  <div>
                                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-foreground">
                                      Certifications
                                    </h3>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">
                                      Professional credentials & technical licenses.
                                    </p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                  {certList.map((cert: any, index: number) => (
                                    <div
                                      key={index}
                                      className="bg-emerald-500/2 border border-emerald-500/10 hover:border-emerald-500/25 rounded-xl p-4 transition-all duration-300 hover:shadow-2xs relative overflow-hidden group"
                                    >
                                      <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/3 rounded-bl-full pointer-events-none group-hover:bg-emerald-500/6 transition-colors duration-300" />
                                      <div className="space-y-2 flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-600">
                                            {cert.organization}
                                          </span>
                                          <span className="text-[9px] font-bold font-mono text-muted-foreground shrink-0">
                                            {cert.issueDate}
                                          </span>
                                        </div>
                                        <div>
                                          <h4 className="text-xs font-black text-foreground truncate">
                                            {cert.certificateName}
                                          </h4>
                                          <p className="text-[10px] font-bold text-muted-foreground font-mono mt-1 bg-muted/40 px-2 py-0.5 rounded truncate max-w-max">
                                            ID: {cert.credentialId}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}

                                  {certList.length === 0 && (
                                    <div className="text-center py-6 text-muted-foreground text-xs italic">
                                      No professional certifications documented.
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Professional Training History */}
                              <div className="bg-card border border-border/80 rounded-xl p-5 shadow-xs space-y-5">
                                <div className="flex items-center gap-2.5 border-b border-border/30 pb-3">
                                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                                    <BookOpen className="size-4.5" />
                                  </div>
                                  <div>
                                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-foreground">
                                      Training History
                                    </h3>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">
                                      Industrial training & program development.
                                    </p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                  {trainList.map((train: any, index: number) => (
                                    <div
                                      key={index}
                                      className="bg-indigo-500/2 border border-indigo-500/10 hover:border-indigo-500/25 rounded-xl p-4 transition-all duration-300 hover:shadow-2xs relative overflow-hidden group"
                                    >
                                      <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/3 rounded-bl-full pointer-events-none group-hover:bg-indigo-500/6 transition-colors duration-300" />
                                      <div className="space-y-2 flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-indigo-500">
                                            {train.institution}
                                          </span>
                                          <span className="text-[9px] font-extrabold font-mono text-muted-foreground shrink-0">
                                            {train.duration}
                                          </span>
                                        </div>
                                        <div>
                                          <h4 className="text-xs font-black text-foreground truncate">
                                            {train.trainingTitle}
                                          </h4>
                                          <p className="text-[9px] font-bold text-muted-foreground mt-1">
                                            Completed:{" "}
                                            <span className="font-mono text-foreground">
                                              {train.completionDate}
                                            </span>
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}

                                  {trainList.length === 0 && (
                                    <div className="text-center py-6 text-muted-foreground text-xs italic">
                                      No training programs documented.
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Corporate Job Description & Assets Assignment shifted to Qualification tab */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                          {/* 4. Job Description */}
                          <div className="space-y-3">
                            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary border-b border-border/20 pb-1.5">
                              Job Description
                            </h4>
                            <div className="bg-muted/5 border border-border/40 rounded-xl p-4 space-y-4">
                              <div className="space-y-1.5">
                                <div className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                                  <Briefcase className="size-3" /> Key Roles & Responsibilities
                                </div>
                                <div className="text-xs font-semibold leading-relaxed">
                                  {selectedEmp.jobDescription || "Senior Software Engineer responsible for building high-scale payroll and HR modules using modern web technologies."}
                                </div>
                              </div>
                              <div className="space-y-1.5 pt-2 border-t border-border/20">
                                <div className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                                  <TrendingUp className="size-3" /> KPIs / Deliverables
                                </div>
                                <div className="text-xs font-semibold leading-relaxed">
                                  {selectedEmp.keyDeliverables || "Fullstack web app development, Git source code management, DB schema optimization."}
                                </div>
                              </div>
                              <div className="space-y-1.5 pt-2 border-t border-border/20">
                                <div className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                                  <Users className="size-3" /> Reporting Structure
                                </div>
                                <div className="text-xs font-semibold space-y-1">
                                  <div>
                                    <span className="text-muted-foreground/80">Primary:</span>{" "}
                                    <span className="font-bold text-primary">{selectedEmp.primaryManager || "Tahmid Afsar Shapno"}</span>{" "}
                                    (Head Of Department)
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground/80">Alternate:</span>{" "}
                                    <span className="font-bold">{selectedEmp.alternateManager || "Chief Operations Officer"}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 5. Assigned Equipment & Assets */}
                          <div className="space-y-3">
                            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 border-b border-border/20 pb-1.5">
                              Assigned Equipment & Assets
                            </h4>
                            <div className="bg-slate-500/5 border border-slate-500/20 rounded-xl p-4 space-y-4 h-full">
                              <div className="grid grid-cols-2 gap-4 text-xs">
                                <div className="space-y-2">
                                  <div className="space-y-0.5">
                                    <div className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                                      <Laptop className="size-3" /> Laptop Brand/Model
                                    </div>
                                    <div className="font-bold">{selectedEmp.laptopBrand || 'Apple MacBook Pro 16"'}</div>
                                  </div>
                                  <div className="space-y-0.5">
                                    <div className="text-[9px] font-bold text-muted-foreground uppercase">
                                      Asset Tag
                                    </div>
                                    <div className="font-bold font-mono text-slate-600 bg-slate-500/10 px-2 py-0.5 rounded w-fit border border-slate-500/20">
                                      {selectedEmp.laptopAssetTag || "COMP-2026-089"}
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="space-y-0.5">
                                    <div className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                                      <PhoneCall className="size-3" /> Mobile Asset Model
                                    </div>
                                    <div className="font-bold">{selectedEmp.mobileAssetModel || "iPhone 15"}</div>
                                  </div>
                                  <div className="space-y-0.5">
                                    <div className="text-[9px] font-bold text-muted-foreground uppercase">
                                      Asset ID
                                    </div>
                                    <div className="font-bold font-mono text-slate-600 bg-slate-500/10 px-2 py-0.5 rounded w-fit border border-slate-500/20">
                                      {selectedEmp.mobileAssetId || "MOB-2026-112"}
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2 col-span-2 pt-2 border-t border-slate-500/20">
                                  <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                      <div className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                                        <ShieldCheck className="size-3" /> Access Card Tag ID
                                      </div>
                                      <div className="font-bold font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded w-fit border border-emerald-500/20">
                                        {selectedEmp.accessCardId || "AC-559021"}
                                      </div>
                                    </div>
                                    <div className="space-y-0.5 text-right">
                                      <div className="text-[9px] font-bold text-muted-foreground uppercase">
                                        Issuance Date
                                      </div>
                                      <div className="font-bold font-mono">{selectedEmp.equipmentIssuedDate || "19/05/2026"}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}

                {/* 4. FAMILY & DEPENDENTS */}
                {activeTab === "family" && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Nominee Information */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 border-b border-border/20 pb-1.5">
                          Nominee Information
                        </h4>
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-0.5">
                              <div className="text-sm font-black text-foreground">Fatema Begum</div>
                              <div className="text-[10px] font-bold text-emerald-600 uppercase">
                                Mother
                              </div>
                            </div>
                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black font-mono">
                              100% SHARE
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-emerald-500/20">
                            <div className="space-y-0.5">
                              <div className="text-[9px] font-bold text-muted-foreground uppercase">
                                Nominee NID / Birth Reg
                              </div>
                              <div className="font-bold font-mono">1952093847120</div>
                            </div>
                            <div className="space-y-0.5">
                              <div className="text-[9px] font-bold text-muted-foreground uppercase">
                                Nominee Contact No
                              </div>
                              <div className="font-bold font-mono">+880 1711-002233</div>
                            </div>
                            <div className="space-y-0.5 col-span-2">
                              <div className="text-[9px] font-bold text-muted-foreground uppercase">
                                Permanent Address
                              </div>
                              <div className="font-semibold text-foreground/80">
                                Vill # Dhopapara, Road # 12, Mirpur, Dhaka
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Emergency Contact */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-rose-500 border-b border-border/20 pb-1.5">
                          Emergency Contact
                        </h4>
                        <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 space-y-2 h-full flex flex-col justify-center">
                          <div className="text-xs font-extrabold text-foreground">
                            Mohammad Abdur Rahman
                          </div>
                          <div className="text-[10px] font-bold text-muted-foreground uppercase">
                            Father
                          </div>
                          <div className="text-[10px] font-mono text-muted-foreground pt-1">
                            +880 1750-021154
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dependents Information */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary border-b border-border/20 pb-1.5">
                        Dependents Information
                      </h4>
                      <table className="w-full text-left text-xs border border-border/40 rounded-lg overflow-hidden">
                        <thead className="bg-muted/40 text-[9px] uppercase font-bold text-muted-foreground">
                          <tr>
                            <th className="p-3">Dependent Name</th>
                            <th className="p-3">Relationship</th>
                            <th className="p-3">Date of Birth</th>
                            <th className="p-3 text-right">NID / Birth Cert No</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20 font-semibold bg-card">
                          <tr className="hover:bg-muted/5">
                            <td className="p-3 font-bold text-foreground">Anisur Rahman</td>
                            <td className="p-3 text-primary">Child (Son/Daughter)</td>
                            <td className="p-3 font-mono">12/08/1965</td>
                            <td className="p-3 font-mono text-right">1928374650</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 5. VERIFICATION & DOCS */}
                {activeTab === "docs" && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    {/* Identity & Background Check */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 border-b border-border/20 pb-1.5">
                        Identity & Background Check
                      </h4>
                      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="size-8 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center">
                              <ShieldCheck className="size-4" />
                            </div>
                            <div>
                              <div className="text-xs font-black text-emerald-600 uppercase tracking-wide">
                                Verified & Cleared
                              </div>
                              <div className="text-[9px] font-bold text-muted-foreground uppercase">
                                Background Check Status
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-bold font-mono">19/05/2026</div>
                            <div className="text-[9px] font-bold text-muted-foreground uppercase">
                              Verification Date
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-emerald-500/20 text-xs">
                          <div className="space-y-0.5">
                            <div className="text-[9px] font-bold text-muted-foreground uppercase">
                              Audited / Verified By
                            </div>
                            <div className="font-bold text-foreground">HR Compliance Team</div>
                          </div>
                          <div className="space-y-0.5">
                            <div className="text-[9px] font-bold text-muted-foreground uppercase">
                              Auditor Notes & Findings
                            </div>
                            <div className="font-semibold text-muted-foreground/80 leading-relaxed italic">
                              "All background verification checks cleared successfully, including
                              academic credential validation and police clearance."
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Supporting Documents */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary border-b border-border/20 pb-1.5">
                        Supporting Documents
                      </h4>
                      <table className="w-full text-left text-xs border border-border/40 rounded-lg overflow-hidden">
                        <thead className="bg-muted/40 text-[9px] uppercase font-bold text-muted-foreground">
                          <tr>
                            <th className="p-3">Document Title</th>
                            <th className="p-3">Document Type</th>
                            <th className="p-3">Attached File Name</th>
                            <th className="p-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20 font-semibold bg-card">
                          <tr className="hover:bg-muted/5">
                            <td className="p-3 font-bold text-foreground">
                              Police Clearance Certificate
                            </td>
                            <td className="p-3 text-indigo-500">PDF Document</td>
                            <td className="p-3 font-mono text-muted-foreground">
                              police_clearance_shapno.pdf
                            </td>
                            <td className="p-3 text-right">
                              <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center justify-end gap-1">
                                <Check className="size-3" /> Secure
                              </span>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/5">
                            <td className="p-3 font-bold text-foreground">
                              National ID Card (Both Sides)
                            </td>
                            <td className="p-3 text-indigo-500">JPG Image</td>
                            <td className="p-3 font-mono text-muted-foreground">
                              nid_scan_front_back.jpg
                            </td>
                            <td className="p-3 text-right">
                              <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center justify-end gap-1">
                                <Check className="size-3" /> Secure
                              </span>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/5">
                            <td className="p-3 font-bold text-foreground">
                              B.Sc Academic Certificate
                            </td>
                            <td className="p-3 text-indigo-500">PDF Document</td>
                            <td className="p-3 font-mono text-muted-foreground">
                              bsc_certificate_dhaka_uni.pdf
                            </td>
                            <td className="p-3 text-right">
                              <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center justify-end gap-1">
                                <Check className="size-3" /> Secure
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Connected Documents from Previous Employment Periods */}
                    {careerTimeline.length > 1 && (
                      <div className="space-y-3 pt-2">
                        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-500 border-b border-border/20 pb-1.5">
                          Connected Documents from Previous Employment Periods
                        </h4>
                        <div className="border border-border/40 rounded-lg overflow-hidden bg-card divide-y divide-border/20">
                          {careerTimeline
                            .filter((period) => period.id !== selectedEmp.id)
                            .map((period) => (
                              <div
                                key={period.id}
                                className="p-3 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-muted/5 transition"
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className="size-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                                    <FileClock className="size-4 shrink-0" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-foreground">
                                      Archive Dossier for ID: {period.id}
                                    </div>
                                    <div className="text-[9px] text-muted-foreground uppercase font-mono mt-0.5">
                                      Joined: {period.joinDate} | Left: {period.resignDate}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 self-end sm:self-center">
                                  <span className="text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded-sm uppercase tracking-wide leading-none font-medium">
                                    3 Files Attached
                                  </span>
                                  <Link
                                    to="/employee-detail/$id"
                                    params={{ id: period.id }}
                                    className="text-[10px] text-indigo-500 hover:text-indigo-600 font-medium hover:underline flex items-center gap-1"
                                  >
                                    Open Dossier &rarr;
                                  </Link>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Visual Scans Recap */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary border-b border-border/20 pb-1.5">
                        Profile Image & Signature
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="border border-border/50 bg-card rounded-xl p-4 flex flex-col items-center text-center gap-3 shadow-xs">
                          <div className="size-16 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                            <User className="size-8" />
                          </div>
                          <div className="text-[10px] font-bold">Portrait Scan</div>
                          <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            <Check className="size-3" /> Uploaded
                          </span>
                        </div>
                        <div className="border border-border/50 bg-card rounded-xl p-4 flex flex-col items-center text-center gap-3 shadow-xs">
                          <div className="size-16 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center">
                            <FileSignature className="size-8" />
                          </div>
                          <div className="text-[10px] font-bold">Signature</div>
                          <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            <Check className="size-3" /> Uploaded
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. INCREMENT HISTORY */}
                {activeTab === "increment" && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 border-b border-border/20 pb-1.5">
                        Financial & Increment Timeline
                      </h4>
                      {!incRecord ? (
                        <div className="p-8 text-center bg-muted/10 rounded-xl border border-border/40">
                          <History className="size-8 mx-auto text-muted-foreground/40 mb-3" />
                          <p className="text-xs font-semibold text-muted-foreground">
                            No increment history found for this employee.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-5">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-muted/10 border border-border/30 rounded-xl p-3 text-center">
                              <div className="text-[9px] font-black uppercase text-muted-foreground mb-1">
                                Joining Salary
                              </div>
                              <div className="text-sm font-black font-mono">
                                ৳
                                {incRecord.salaryJoining.toLocaleString("en-IN", {
                                  minimumFractionDigits: 2,
                                })}
                              </div>
                            </div>
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
                              <div className="text-[9px] font-black uppercase text-emerald-600 mb-1">
                                Current Gross
                              </div>
                              <div className="text-sm font-black font-mono text-emerald-600">
                                ৳
                                {incRecord.salaryGross.toLocaleString("en-IN", {
                                  minimumFractionDigits: 2,
                                })}
                              </div>
                            </div>
                            <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-center">
                              <div className="text-[9px] font-black uppercase text-primary mb-1">
                                Total Inc.
                              </div>
                              <div className="text-sm font-black font-mono text-primary">
                                ৳
                                {(incRecord.salaryGross - incRecord.salaryJoining).toLocaleString(
                                  "en-IN",
                                  { minimumFractionDigits: 2 },
                                )}
                              </div>
                            </div>
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-center">
                              <div className="text-[9px] font-black uppercase text-amber-600 mb-1">
                                Promotions
                              </div>
                              <div className="text-sm font-black font-mono text-amber-600">
                                {incRecord.total.includes("(P)") ? "Yes" : "0"}
                              </div>
                            </div>
                          </div>
                          <div className="mt-8">
                            {(() => {
                              const rawTimeline = [
                                { year: "2014", inc: incRecord.inc2014 },
                                { year: "2015", inc: incRecord.inc2015 },
                                { year: "2016", inc: incRecord.inc2016 },
                                { year: "2017", inc: incRecord.inc2017 },
                                { year: "2018", inc: incRecord.inc2018 },
                                { year: "2019", inc: incRecord.inc2019 },
                                { year: "2020", inc: incRecord.inc2020 },
                                { year: "2021", inc: incRecord.inc2021 },
                                { year: "2022", inc: incRecord.inc2022 },
                                { year: "2023", inc: incRecord.inc2023 },
                                { year: "2024", inc: incRecord.inc2024 },
                                { year: "2025", inc: incRecord.inc2025 },
                              ]
                                .filter((y) => y.inc && y.inc !== "0" && y.inc.trim() !== "")
                                .map((item, index, arr) => {
                                  const isPromo = item.inc.includes("(P)");
                                  const val =
                                    parseFloat(item.inc.replace("(P)", "").replace(/,/g, "")) || 0;
                                  let rGross = incRecord.salaryJoining;
                                  for (let i = 0; i <= index; i++) {
                                    rGross +=
                                      parseFloat(arr[i].inc.replace("(P)", "").replace(/,/g, "")) ||
                                      0;
                                  }
                                  return { ...item, isPromo, val, rGross };
                                })
                                .reverse();

                              const allNodes = [
                                ...rawTimeline.map((item) => ({
                                  type: "increment" as const,
                                  key: item.year,
                                  year: item.year,
                                  isPromo: item.isPromo,
                                  val: item.val,
                                  rGross: item.rGross,
                                })),
                                {
                                  type: "join" as const,
                                  key: "join",
                                  year: incRecord.joiningDate
                                    ? incRecord.joiningDate.split("/")[2]
                                    : "Joining",
                                  isPromo: false,
                                  val: 0,
                                  rGross: incRecord.salaryJoining,
                                },
                              ];

                              return (
                                <div className="relative w-full py-6 md:py-10">
                                  {/* Central Timeline Line */}
                                  <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border/60 -translate-x-1/2 pointer-events-none" />

                                  {allNodes.map((node, index) => {
                                    const isLeft = index % 2 === 0;

                                    // 1. Unified Card Content
                                    const cardJSX = (
                                      <div className="w-full max-w-md">
                                        {node.type === "join" ? (
                                          <div className="bg-gradient-to-br from-primary/5 via-card to-card border border-primary/20 hover:border-primary/45 rounded-xl p-5 shadow-xs hover:shadow-md transition-all duration-300 relative text-left">
                                            {/* Subtle top decoration */}
                                            <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-xl" />
                                            <div className="flex items-center justify-between mb-3.5">
                                              <div className="flex items-center gap-2">
                                                <span className="font-extrabold text-sm text-foreground">
                                                  Joined Company
                                                </span>
                                                <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                                                  {node.year}
                                                </span>
                                              </div>
                                              <Briefcase className="size-4 text-primary" />
                                            </div>
                                            <div className="flex justify-between items-center text-xs pt-3.5 border-t border-border/40">
                                              <span className="text-muted-foreground font-semibold uppercase text-[10px] tracking-wider">
                                                Joining Salary
                                              </span>
                                              <span className="font-mono font-black text-foreground text-sm">
                                                ৳{node.rGross.toLocaleString("en-IN")}
                                              </span>
                                            </div>
                                          </div>
                                        ) : (
                                          <div
                                            className={`bg-gradient-to-br border rounded-xl p-5 shadow-xs hover:shadow-md transition-all duration-300 relative text-left ${node.isPromo
                                              ? "from-amber-500/5 via-card to-card border-amber-500/25 hover:border-amber-500/50"
                                              : "from-emerald-500/5 via-card to-card border-emerald-500/20 hover:border-emerald-500/40"
                                              }`}
                                          >
                                            {/* Subtle top decoration */}
                                            <div
                                              className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${node.isPromo ? "bg-amber-500" : "bg-emerald-500"
                                                }`}
                                            />
                                            <div className="flex items-center justify-between mb-3.5">
                                              <div className="flex items-center gap-2">
                                                <span className="font-extrabold text-sm text-foreground">
                                                  Increment {node.year}
                                                </span>
                                                {node.isPromo && (
                                                  <span className="text-[9px] bg-amber-500/10 text-amber-600 border border-amber-500/25 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider animate-pulse">
                                                    Promoted
                                                  </span>
                                                )}
                                              </div>
                                              <div
                                                className={`font-mono font-black text-xs px-2.5 py-1 rounded-lg border ${node.isPromo
                                                  ? "bg-amber-500/10 border-amber-500/20 text-amber-600"
                                                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                                                  }`}
                                              >
                                                +৳{node.val.toLocaleString("en-IN")}
                                              </div>
                                            </div>
                                            <div className="flex justify-between items-center text-xs pt-3.5 border-t border-border/40">
                                              <span className="text-muted-foreground font-semibold uppercase text-[10px] tracking-wider">
                                                Running Gross Salary
                                              </span>
                                              <span className="font-mono font-black text-primary text-sm">
                                                ৳{node.rGross.toLocaleString("en-IN")}
                                              </span>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );

                                    // 2. Unified Balancer Metadata
                                    const balancerJSX = (
                                      <div className="flex flex-col gap-1 select-none">
                                        <span className="text-2xl font-black text-muted-foreground/15 font-mono leading-none">
                                          {node.year}
                                        </span>
                                        <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider leading-none">
                                          {node.type === "join"
                                            ? "Corporate Onboarding"
                                            : node.isPromo
                                              ? "Career Advancement"
                                              : "Annual Raise"}
                                        </span>
                                      </div>
                                    );

                                    // 3. Unified Dot indicator
                                    const dotJSX = (
                                      <div
                                        className={`size-5.5 rounded-full border-4 bg-background flex items-center justify-center shadow-md transition duration-300 ${node.type === "join"
                                          ? "border-primary text-primary"
                                          : node.isPromo
                                            ? "border-amber-500 text-amber-500 ring-4 ring-amber-500/10"
                                            : "border-emerald-500 text-emerald-500 ring-4 ring-emerald-500/10"
                                          }`}
                                      >
                                        <div
                                          className={`size-1.5 rounded-full ${node.type === "join"
                                            ? "bg-primary"
                                            : node.isPromo
                                              ? "bg-amber-500 animate-pulse"
                                              : "bg-emerald-500"
                                            }`}
                                        />
                                      </div>
                                    );

                                    return (
                                      <div key={node.key}>
                                        {/* Mobile-only Layout */}
                                        <div className="md:hidden relative pl-12 pb-8 last:pb-0 w-full text-left">
                                          <div className="absolute left-4 -translate-x-1/2 top-1.5 z-20">
                                            {dotJSX}
                                          </div>
                                          {cardJSX}
                                        </div>

                                        {/* Desktop symmetric Grid Layout */}
                                        <div className="hidden md:grid grid-cols-[1fr_40px_1fr] items-center w-full mb-12 last:mb-0">
                                          {/* Left half */}
                                          <div
                                            className={`flex w-full justify-end text-right ${isLeft ? "" : "pr-8"}`}
                                          >
                                            {isLeft ? cardJSX : balancerJSX}
                                          </div>

                                          {/* Central Dot */}
                                          <div className="flex justify-center items-center z-20">
                                            {dotJSX}
                                          </div>

                                          {/* Right half */}
                                          <div
                                            className={`flex w-full justify-start text-left ${isLeft ? "pl-8" : ""}`}
                                          >
                                            {isLeft ? balancerJSX : cardJSX}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}

                                  {rawTimeline.length === 0 && (
                                    <div className="pl-12 md:pl-0 md:text-center py-6">
                                      <p className="text-xs font-semibold text-muted-foreground italic">
                                        No increments received yet.
                                      </p>
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
