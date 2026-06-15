import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { employeesData } from "@/routes/personnel-list";
import { rawIncrementRecords } from "@/routes/increment-history-data";
import {
  User, Gift, DollarSign, Camera, GraduationCap, History, Award, BookOpen, Users,
  PhoneCall, FileSignature, Heart, Baby, FileText, FileDown, ShieldCheck, Laptop,
  Check, MapPin, Briefcase, UserCog, Clock, FileClock, ArrowUpRight, UserPlus, TrendingUp,
  ChevronRight, ArrowLeft, CalendarRange, Info, Power, HelpCircle
} from "lucide-react";

export const Route = createFileRoute('/employee-detail/$id')({
  component: EmployeeDetailPage,
})

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
            employeesData.forEach(d => {
              if (!merged.some(m => m.id === d.id)) {
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
    return employees.find(e => e.id === id) || employees[0];
  }, [id, employees]);

  const incRecord = useMemo(() => {
    return rawIncrementRecords.find(r => r.empId === selectedEmp.id);
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
      isCurrent: true
    });

    let refId = selectedEmp.rejoinRef;
    let visited = new Set<string>([selectedEmp.id]);
    while (refId) {
      if (visited.has(refId)) break;
      visited.add(refId);

      const prevEmp = employees.find(e => e.id === refId);
      if (prevEmp) {
        timeline.push({
          id: prevEmp.id,
          title: prevEmp.title,
          dept: prevEmp.dept,
          status: prevEmp.status || "Resigned",
          joinDate: prevEmp.joinDate,
          resignDate: prevEmp.resignDate || "—",
          isCurrent: false
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
          isCurrent: false
        });
        break;
      }
    }

    let forwardEmp = employees.find(e => e.rejoinRef === selectedEmp.id);
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
        isCurrent: false
      });
      forwardEmp = employees.find(e => e.rejoinRef === forwardEmp.id);
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
  const basicVal = (grossNum * 0.60).toFixed(2);
  const houseRentVal = (grossNum * 0.25).toFixed(2);
  const medicalVal = (grossNum * 0.08).toFixed(2);
  const conveyanceVal = (grossNum * 0.04).toFixed(2);
  const foodVal = (grossNum * 0.03).toFixed(2);
  const pfVal = (grossNum * 0.60 * 0.10).toFixed(2);
  const festivalBonusVal = basicVal;

  const nameBngVal = selectedEmp.name === "Tahmid Afsar Shapno" ? "তাহমিদ আফসার স্বপন" :
    selectedEmp.name === "Sohanur Rahman Sohan" ? "সোহানুর রহমান সোহান" :
      selectedEmp.name === "Easin Mia" ? "ইয়াসিন মিয়া" :
        selectedEmp.name === "Jannatul Maowa" ? "জান্নাতুল মাওয়া" :
          selectedEmp.name + " (বাংলা)";

  const fatherNameEng = "Mohammad Abdur Rahman";
  const motherNameEng = "Sultana Begum";
  const spouseNameEng = selectedEmp.gender === "Female" ? "Mohammad Karim" : "—";
  const nomineeName = selectedEmp.gender === "Female" ? "Abdur Rahman" : "Fatema Begum";

  const laptopAsset = `COMP-${selectedEmp.id.slice(0, 4)}-992`;
  const accessCard = `RFID-${selectedEmp.id.slice(6)}`;

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-hidden">
        <Topbar />

        <div className="p-4 md:p-6 xl:p-8 space-y-6 overflow-y-auto h-full scrollbar-thin pb-24">

          {/* Top Breadcrumb & Actions */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/personnel-list" className="hover:text-primary transition-colors flex items-center gap-1">
                  <ArrowLeft className="size-3" /> Personnel List
                </Link>
                <ChevronRight className="size-2.5" />
                <span className="text-foreground">Digital File</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-extrabold text-xl shadow-sm">
                  {selectedEmp.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
                    {selectedEmp.name}
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest border px-2 py-0.5 rounded ${selectedEmp.acStatus === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                      }`}>
                      {selectedEmp.acStatus || "Active"}
                    </span>
                  </h1>
                  <p className="text-xs font-semibold text-muted-foreground">{selectedEmp.title} — {selectedEmp.dept}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button className="h-9.5 px-4 rounded-xl border border-border/80 bg-card hover:bg-muted text-xs font-semibold shadow-xs transition duration-200 flex items-center gap-2">
                <FileDown className="size-3.5 text-primary" /> Download PDF
              </button>
              <button className="h-9.5 px-4 rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-xs font-semibold shadow-xs hover:shadow-sm hover:opacity-95 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2">
                <UserCog className="size-3.5" /> Edit Profile
              </button>
            </div>
          </div>

          {/* Rejoined Employee Banner Notification */}
          {(selectedEmp.rejoinRef || selectedEmp.rejoinedTo || careerTimeline.length > 1) && (
            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <CalendarRange className="size-5 shrink-0" />
                </div>
                <div>
                  <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Rejoined Employee Dossier Link</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    This profile is connected to multiple career periods. Viewing: <span className="font-semibold text-foreground font-mono">ID: {selectedEmp.id}</span> ({selectedEmp.joinDate} to {selectedEmp.status === "Working" ? "Present" : selectedEmp.resignDate || "—"}).
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
          <div className="bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden">
            <div className="flex overflow-x-auto scrollbar-none border-b border-border/40 p-1.5 gap-1 bg-muted/10">
              {TABS.map(tab => {
                const TabIcon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shrink-0 ${isSelected
                      ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]"
                      : "text-muted-foreground/80 hover:bg-muted hover:text-foreground"
                      }`}
                  >
                    <TabIcon className={`size-4 shrink-0 ${isSelected ? "animate-pulse" : ""}`} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            <div className="p-5 md:p-6 min-h-[500px]">

              {/* 1. PERSONAL & IDENTITY */}
              {activeTab === "personal" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* 1. Primary & Demographic Dossier */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary border-b border-border/20 pb-1.5">Primary & Demographic Dossier</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-muted/5 border border-border/40 rounded-xl p-4">
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Name (English)</div><div className="text-xs font-extrabold">{selectedEmp.name}</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Name (Bengali)</div><div className="text-xs font-bold">{nameBngVal}</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Date of Birth</div><div className="text-xs font-bold">{selectedEmp.dob}</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Gender</div><div className="text-xs font-bold">{selectedEmp.gender}</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Religion</div><div className="text-xs font-bold">Islam</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Blood Group</div><div className="text-xs font-bold text-rose-500">{selectedEmp.blood}</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Marital Status</div><div className="text-xs font-bold">Single</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Education Level</div><div className="text-xs font-bold">Bachelor of Science (B.Sc)</div></div>
                    </div>
                  </div>

                  {/* 2. Corporate Placement & Mapping */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 border-b border-border/20 pb-1.5">Corporate Placement & Mapping</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Emp ID (System)</div><div className="text-xs font-extrabold text-foreground">{selectedEmp.id}</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Emp ID (Company)</div><div className="text-xs font-bold">{selectedEmp.offcId || "—"}</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Joining Date</div><div className="text-xs font-bold">{selectedEmp.joinDate}</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Confirmation Date</div><div className="text-xs font-bold">{selectedEmp.confirmDate || "—"}</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Department</div><div className="text-xs font-extrabold">{selectedEmp.dept}</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Designation</div><div className="text-xs font-extrabold">{selectedEmp.title}</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Employee Type</div><div className="text-xs font-bold">{selectedEmp.type}</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Working Area</div><div className="text-xs font-bold">PSL-Operation</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Section</div><div className="text-xs font-bold">{selectedEmp.sect}</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Job Nature</div><div className="text-xs font-bold">ALL</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Unit</div><div className="text-xs font-bold">{selectedEmp.unit}</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Line</div><div className="text-xs font-bold">{selectedEmp.line}</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Grade</div><div className="text-xs font-bold font-mono text-indigo-500">{selectedEmp.grade}</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Shift</div><div className="text-xs font-bold">{selectedEmp.shift}</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Employment Status</div><div className="text-xs font-bold text-emerald-600">{selectedEmp.empStatus}</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Probation Period</div><div className="text-xs font-bold">N/A</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Default Holiday</div><div className="text-xs font-bold">{selectedEmp.holiday}</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Set Manager</div><div className="text-xs font-bold truncate">Mamunoor Rashid (DGM)</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Recruitment Type</div><div className="text-xs font-bold">New</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">RC Notes</div><div className="text-xs font-bold truncate">Hired via Campus Drive</div></div>
                    </div>
                  </div>

                  {/* Re-employment & Career Timeline History */}
                  {careerTimeline.length > 1 && (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-500 border-b border-border/20 pb-1.5">Re-employment & Connected Career Timeline</h4>
                      <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4">
                        <div className="relative border-l-2 border-indigo-500/30 ml-4 pl-6 space-y-4 text-xs">
                          {careerTimeline.map((period, idx) => (
                            <div key={period.id} className="relative">
                              {/* Timeline indicator circle */}
                              <div className={`absolute -left-[31px] top-0.5 size-4.5 rounded-full border-2 flex items-center justify-center ${period.id === selectedEmp.id
                                  ? "bg-indigo-500 border-indigo-500 text-white animate-pulse"
                                  : "bg-card border-indigo-500/30 text-indigo-500"
                                }`}>
                                <span className="text-[8px] leading-none font-medium">{careerTimeline.length - idx}</span>
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-foreground">ID: {period.id}</span>
                                    {period.id === selectedEmp.id && (
                                      <span className="text-[8px] bg-indigo-500/15 text-indigo-600 border border-indigo-500/35 px-1 rounded-sm uppercase tracking-wide leading-none font-medium">Currently Viewing</span>
                                    )}
                                    <span className={`text-[8px] px-1 rounded-sm uppercase tracking-wide leading-none font-medium ${period.status === "Working" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                      }`}>
                                      {period.status}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground mt-0.5">{period.title} — {period.dept}</p>
                                </div>
                                <div className="sm:text-right">
                                  <div className="text-[10px] text-muted-foreground font-mono">Joined: {period.joinDate}</div>
                                  <div className="text-[10px] text-muted-foreground font-mono">Left: {period.resignDate}</div>
                                </div>
                                {period.id !== selectedEmp.id && (
                                  <Link
                                    to="/employee-detail/$id"
                                    params={{ id: period.id }}
                                    className="text-[10px] text-indigo-500 hover:text-indigo-600 font-medium hover:underline transition self-start sm:self-center"
                                  >
                                    Switch Profile &rarr;
                                  </Link>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. Legal Identification Credentials */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-500 border-b border-border/20 pb-1.5">Legal Identification Credentials</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 font-mono">
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase font-sans">National ID (NID)</div><div className="text-xs font-bold text-foreground">1928374659201</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase font-sans">Birth Reg No</div><div className="text-xs font-bold text-foreground">Not Provided</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase font-sans">Passport No</div><div className="text-xs font-bold text-foreground">Not Provided</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase font-sans">Driving License No</div><div className="text-xs font-bold text-foreground">Not Provided</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase font-sans">Prof. Membership No</div><div className="text-xs font-bold text-foreground">IEB-92812</div></div>
                    </div>
                  </div>

                  {/* 4. Parental & Kinship Context */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary border-b border-border/20 pb-1.5">Parental & Kinship Context</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/5 border border-border/40 rounded-xl p-4">
                      <div className="space-y-2">
                        <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase font-sans">Father Name (English)</div><div className="text-xs font-bold">{fatherNameEng}</div></div>
                        <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase font-sans">Father Name (Bengali)</div><div className="text-xs font-bold">মোহাম্মদ আবদুর রহমান</div></div>
                      </div>
                      <div className="space-y-2">
                        <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase font-sans">Mother Name (English)</div><div className="text-xs font-bold">{motherNameEng}</div></div>
                        <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase font-sans">Mother Name (Bengali)</div><div className="text-xs font-bold">সুলতানা বেগম</div></div>
                      </div>
                      <div className="col-span-1 sm:col-span-2 pt-2 border-t border-border/20">
                        <div className="text-[10px] font-semibold text-muted-foreground/80 italic">Spouse information fields are hidden because Marital Status is set to Single.</div>
                      </div>
                    </div>
                  </div>

                  {/* 5. Residential Address Directory */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500 border-b border-border/20 pb-1.5">Residential Address Directory</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      {/* Present Address */}
                      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-3">
                        <div className="text-[10px] font-extrabold uppercase text-amber-600 border-b border-amber-500/20 pb-1">Present Address</div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Division</div><div className="font-semibold">Dhaka</div></div>
                          <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">District</div><div className="font-semibold">Dhaka</div></div>
                          <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Upazila</div><div className="font-semibold">Mirpur</div></div>
                          <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Post Office</div><div className="font-semibold">Mirpur-12</div></div>
                          <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Village/House (Eng)</div><div className="font-semibold">Vill # Dhopapara</div></div>
                          <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Village/House (Bng)</div><div className="font-semibold">গ্রাম # ধোপাপাড়া</div></div>
                          <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Road</div><div className="font-semibold">Road # 12</div></div>
                          <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Country</div><div className="font-semibold">Bangladesh</div></div>
                        </div>
                        <div className="pt-2 border-t border-amber-500/20">
                          <div className="text-[9px] font-bold text-muted-foreground uppercase">Mailing Dispatch Preview</div>
                          <div className="text-xs font-medium italic mt-1 text-foreground/80">Vill # Dhopapara, Road # 12, Mirpur, Dhaka, Bangladesh</div>
                        </div>
                      </div>

                      {/* Permanent Address */}
                      <div className="bg-muted/10 border border-border/30 rounded-xl p-4 space-y-3">
                        <div className="text-[10px] font-extrabold uppercase text-foreground/80 border-b border-border/20 pb-1">Permanent Address</div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Division</div><div className="font-semibold">Dhaka</div></div>
                          <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">District</div><div className="font-semibold">Dhaka</div></div>
                          <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Upazila</div><div className="font-semibold">Mirpur</div></div>
                          <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Post Office</div><div className="font-semibold">Mirpur-12</div></div>
                          <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Village/House (Eng)</div><div className="font-semibold">Vill # Dhopapara</div></div>
                          <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Village/House (Bng)</div><div className="font-semibold">গ্রাম # ধোপাপাড়া</div></div>
                          <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Road</div><div className="font-semibold">Road # 12</div></div>
                          <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Country</div><div className="font-semibold">Bangladesh</div></div>
                        </div>
                        <div className="pt-2 border-t border-border/20">
                          <div className="text-[9px] font-bold text-muted-foreground uppercase">Legal Dossier Dispatch Preview</div>
                          <div className="text-xs font-medium italic mt-1 text-foreground/80">Vill # Dhopapara, Road # 12, Mirpur, Dhaka, Bangladesh</div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* 6. Contact & Reachability Channels */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary border-b border-border/20 pb-1.5">Contact & Reachability Channels</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 bg-muted/5 border border-border/40 rounded-xl p-4">
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Office Email</div><div className="text-xs font-bold text-primary truncate">{selectedEmp.email || "employee@pakizasoftware.com"}</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Office Mobile</div><div className="text-xs font-bold font-mono">{selectedEmp.officeMob || "017500XXXXX"}</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Office Extension</div><div className="text-xs font-bold font-mono">102</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Personal Email</div><div className="text-xs font-bold text-primary truncate">personal@gmail.com</div></div>
                      <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Personal Contact No</div><div className="text-xs font-bold font-mono">{selectedEmp.phone !== "—" ? selectedEmp.phone : selectedEmp.personalContact || "017130XXXXX"}</div></div>
                    </div>
                  </div>

                  {/* 7. Document & Image Upload Center */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary border-b border-border/20 pb-1.5">Document & Image Upload Center</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="border border-border/50 bg-card rounded-xl p-4 flex flex-col items-center text-center gap-3 shadow-xs">
                        <div className="size-12 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center"><User className="size-6" /></div>
                        <div>
                          <div className="text-[10px] font-bold">Employee Portrait</div>
                          <div className="text-[8px] text-muted-foreground">Premium front portrait</div>
                        </div>
                        <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full"><Check className="size-3" /> Uploaded</span>
                      </div>
                      <div className="border border-border/50 bg-card rounded-xl p-4 flex flex-col items-center text-center gap-3 shadow-xs">
                        <div className="size-12 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center"><FileSignature className="size-6" /></div>
                        <div>
                          <div className="text-[10px] font-bold">Authorized Signature</div>
                          <div className="text-[8px] text-muted-foreground">Clean white sheet</div>
                        </div>
                        <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full"><Check className="size-3" /> Uploaded</span>
                      </div>
                      <div className="border border-border/50 bg-card rounded-xl p-4 flex flex-col items-center text-center gap-3 shadow-xs">
                        <div className="size-12 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center"><FileText className="size-6" /></div>
                        <div>
                          <div className="text-[10px] font-bold">National ID Card</div>
                          <div className="text-[8px] text-muted-foreground">Both sides JPG/PDF</div>
                        </div>
                        <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full"><Check className="size-3" /> Uploaded</span>
                      </div>
                      <div className="border border-border/50 bg-card rounded-xl p-4 flex flex-col items-center text-center gap-3 shadow-xs">
                        <div className="size-12 rounded-full bg-slate-500/10 text-slate-500 border border-slate-500/20 flex items-center justify-center"><GraduationCap className="size-6" /></div>
                        <div>
                          <div className="text-[10px] font-bold">Degree Certificate</div>
                          <div className="text-[8px] text-muted-foreground">Academic graduation</div>
                        </div>
                        <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full"><Check className="size-3" /> Uploaded</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {/* 8. Emergency Contact & Reachability */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-rose-500 border-b border-border/20 pb-1.5">Emergency Contact & Reachability</h4>
                      <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Contact Person</div><div className="font-extrabold text-foreground">Mohammad Abdur Rahman</div></div>
                          <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Relationship</div><div className="font-bold">Father</div></div>
                          <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Primary Mobile No</div><div className="font-bold font-mono">+880 1750-021154</div></div>
                          <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Alternative Contact</div><div className="font-bold font-mono">01911-223344</div></div>
                          <div className="col-span-2 space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Email Address</div><div className="font-bold text-primary">parent@gmail.com</div></div>
                        </div>
                        <div className="pt-2 border-t border-rose-500/20">
                          <div className="text-[9px] font-bold text-muted-foreground uppercase">Detailed Address</div>
                          <div className="text-xs font-medium italic mt-1 text-foreground/80">Vill # Dhopapara, Road # 12, Mirpur, Dhaka, Bangladesh</div>
                        </div>
                      </div>
                    </div>

                    {/* 9. Professional & Corporate References */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-500 border-b border-border/20 pb-1.5">Professional & Corporate References</h4>
                      <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 space-y-4 h-full">
                        <div className="space-y-2">
                          <div className="text-[10px] font-extrabold uppercase text-indigo-600 border-b border-indigo-500/20 pb-1">Primary Reference</div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Referee Name</div><div className="font-bold">Dr. Selim Reza</div></div>
                            <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Contact Number</div><div className="font-bold font-mono">01711-223344</div></div>
                            <div className="col-span-2 space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Designation & Org</div><div className="font-bold">Professor, University of Dhaka</div></div>
                          </div>
                        </div>
                        <div className="space-y-2 pt-2 border-t border-indigo-500/20">
                          <div className="text-[10px] font-extrabold uppercase text-indigo-600 border-b border-indigo-500/20 pb-1">Secondary Reference</div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Referee Name</div><div className="font-bold">Ahmed Kabir</div></div>
                            <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Contact Number</div><div className="font-bold font-mono">01822-334455</div></div>
                            <div className="col-span-2 space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Designation & Org</div><div className="font-bold">Director, Tech Ltd</div></div>
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
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 border-b border-border/20 pb-1.5">Compensation Structure & Financials (Base Salary & Standard Splits)</h4>
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 font-mono text-xs pr-4">
                          <div className="flex justify-between items-center pb-2 border-b border-emerald-500/20"><span className="text-muted-foreground font-sans font-bold uppercase tracking-wider text-[10px]">Gross Salary</span><span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">৳{grossNum.toLocaleString("en-IN")}</span></div>
                          <div className="flex justify-between items-center pt-1"><span className="text-muted-foreground font-sans font-bold">Basic Salary (60%)</span><span className="font-bold text-foreground">৳{parseFloat(basicVal).toLocaleString("en-IN")}</span></div>
                          <div className="flex justify-between items-center"><span className="text-muted-foreground font-sans font-bold">House Rent (25%)</span><span className="font-bold text-foreground">৳{parseFloat(houseRentVal).toLocaleString("en-IN")}</span></div>
                          <div className="flex justify-between items-center"><span className="text-muted-foreground font-sans font-bold">Medical (8%)</span><span className="font-bold text-foreground">৳{parseFloat(medicalVal).toLocaleString("en-IN")}</span></div>
                        </div>
                        <div className="space-y-2 font-mono text-xs md:pl-4 md:border-l border-emerald-500/20 pt-2 md:pt-0">
                          <div className="flex justify-between items-center pb-2 border-b border-transparent md:border-emerald-500/20 hidden md:flex"><span className="text-transparent font-sans font-bold uppercase tracking-wider text-[10px]">-</span><span className="text-transparent font-black text-sm">-</span></div>
                          <div className="flex justify-between items-center pt-1"><span className="text-muted-foreground font-sans font-bold">Conveyance (4%)</span><span className="font-bold text-foreground">৳{(grossNum * 0.04).toLocaleString("en-IN")}</span></div>
                          <div className="flex justify-between items-center"><span className="text-muted-foreground font-sans font-bold">Food (3%)</span><span className="font-bold text-foreground">৳{(grossNum * 0.03).toLocaleString("en-IN")}</span></div>
                          <div className="flex justify-between items-center pt-1 mt-1 border-t border-emerald-500/10"><span className="text-emerald-600 font-sans font-bold">Provident Fund (10% of Basic)</span><span className="font-bold text-emerald-600">৳{parseFloat(pfVal).toLocaleString("en-IN")}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {/* 2. Supplementary Allowances & Taxes */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500 border-b border-border/20 pb-1.5">Supplementary Allowances & Taxes</h4>
                      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-2 text-xs font-mono">
                        <div className="flex justify-between items-center"><span className="text-muted-foreground font-sans font-bold">Special Allowance</span><span className="font-bold text-foreground">৳5,000</span></div>
                        <div className="flex justify-between items-center"><span className="text-muted-foreground font-sans font-bold">Mobile Allowance</span><span className="font-bold text-foreground">৳1,000</span></div>
                        <div className="flex justify-between items-center"><span className="text-muted-foreground font-sans font-bold">Internet Allowance</span><span className="font-bold text-foreground">৳1,500</span></div>
                        <div className="flex justify-between items-center"><span className="text-muted-foreground font-sans font-bold">Utility Allowance</span><span className="font-bold text-foreground">৳2,000</span></div>
                        <div className="flex justify-between items-center pt-2 border-t border-amber-500/20 text-rose-500"><span className="font-sans font-bold">Tax Deduction</span><span className="font-bold">৳0</span></div>
                        <div className="flex justify-between items-center text-rose-500"><span className="font-sans font-bold">Gratuity Contribution</span><span className="font-bold">৳0</span></div>

                        <div className="flex justify-between items-center pt-3 mt-1 border-t border-amber-500/20">
                          <span className="font-sans font-extrabold text-foreground uppercase text-[10px]">Total Allowance</span><span className="font-black text-foreground">৳9,500</span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <span className="font-sans font-extrabold text-emerald-600 uppercase text-[10px]">Est. Net Payable</span><span className="font-black text-emerald-600">৳{(grossNum + 9500).toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>

                    {/* 3. Disbursement Routing & Bank details */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-500 border-b border-border/20 pb-1.5">Disbursement Routing & Bank Details</h4>
                      <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 space-y-3 h-full">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Payment Mode</div><div className="font-bold text-indigo-600">Bank Transfer</div></div>
                          <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Bank Name</div><div className="font-bold">Dutch-Bangla Bank Limited</div></div>
                          <div className="space-y-0.5 col-span-2"><div className="text-[9px] font-bold text-muted-foreground uppercase">Account Number</div><div className="font-bold font-mono text-sm tracking-widest bg-indigo-500/10 px-3 py-2 rounded border border-indigo-500/20 w-fit">102.120.99827</div></div>
                          <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Branch Name</div><div className="font-bold">Mirpur Circle-10</div></div>
                          <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Routing Number</div><div className="font-bold font-mono">090261987</div></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {/* 4. Corporate Job Description & Charter */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary border-b border-border/20 pb-1.5">Corporate Job Description & Charter</h4>
                      <div className="bg-muted/5 border border-border/40 rounded-xl p-4 space-y-4">
                        <div className="space-y-1.5">
                          <div className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1.5"><Briefcase className="size-3" /> Key Roles & Responsibilities</div>
                          <div className="text-xs font-semibold leading-relaxed">Senior Software Engineer responsible for building high-scale payroll and HR modules using modern web technologies.</div>
                        </div>
                        <div className="space-y-1.5 pt-2 border-t border-border/20">
                          <div className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1.5"><TrendingUp className="size-3" /> KPIs / Deliverables</div>
                          <div className="text-xs font-semibold leading-relaxed">Fullstack web app development, Git source code management, DB schema optimization.</div>
                        </div>
                        <div className="space-y-1.5 pt-2 border-t border-border/20">
                          <div className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1.5"><Users className="size-3" /> Reporting Structure</div>
                          <div className="text-xs font-semibold space-y-1">
                            <div><span className="text-muted-foreground/80">Primary:</span> <span className="font-bold text-primary">Tahmid Afsar Shapno</span> (Head Of Department)</div>
                            <div><span className="text-muted-foreground/80">Alternate:</span> <span className="font-bold">Chief Operations Officer</span></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 5. Corporate Equipment & Asset Assignment */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 border-b border-border/20 pb-1.5">Corporate Equipment & Asset Assignment</h4>
                      <div className="bg-slate-500/5 border border-slate-500/20 rounded-xl p-4 space-y-4 h-full">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="space-y-2">
                            <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1"><Laptop className="size-3" /> Laptop Brand/Model</div><div className="font-bold">Apple MacBook Pro 16"</div></div>
                            <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Asset Tag</div><div className="font-bold font-mono text-slate-600 bg-slate-500/10 px-2 py-0.5 rounded w-fit border border-slate-500/20">COMP-2026-089</div></div>
                          </div>
                          <div className="space-y-2">
                            <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1"><PhoneCall className="size-3" /> Mobile Asset Model</div><div className="font-bold">iPhone 15</div></div>
                            <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Asset ID</div><div className="font-bold font-mono text-slate-600 bg-slate-500/10 px-2 py-0.5 rounded w-fit border border-slate-500/20">MOB-2026-112</div></div>
                          </div>
                          <div className="space-y-2 col-span-2 pt-2 border-t border-slate-500/20">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1"><ShieldCheck className="size-3" /> Access Card Tag ID</div><div className="font-bold font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded w-fit border border-emerald-500/20">AC-559021</div></div>
                              <div className="space-y-0.5 text-right"><div className="text-[9px] font-bold text-muted-foreground uppercase">Issuance Date</div><div className="font-bold font-mono">19/05/2026</div></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. QUALIFICATION & EXPERIENCE */}
              {activeTab === "qualification" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  {/* Category 1: Academic Portfolio */}
                  <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-lg p-5 space-y-6">
                    <div className="flex items-center gap-2.5 border-b border-indigo-500/20 pb-3">
                      <div className="size-8 rounded-full bg-indigo-500/15 text-indigo-500 flex items-center justify-center"><GraduationCap className="size-4.5" /></div>
                      <div>
                        <h3 className="text-xs font-black uppercase text-indigo-600 tracking-wider">I. Academic Portfolio</h3>
                        <p className="text-[10px] text-muted-foreground">Certified academic credentials and structured training programs.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      {/* Academic Credentials */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase text-foreground/80 flex items-center gap-1.5"><BookOpen className="size-3.5 text-indigo-500" /> Academic Qualifications</h4>
                        <div className="border border-border/40 rounded-xl overflow-hidden shadow-xs">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-muted/40 text-[9px] uppercase font-bold text-muted-foreground border-b border-border/20">
                              <tr><th className="p-3">Degree / Exam Title</th><th className="p-3">Institution Name</th><th className="p-3">Passing Year</th><th className="p-3">Result / CGPA</th><th className="p-3 text-right">Attachment</th></tr>
                            </thead>
                            <tbody className="divide-y divide-border/20 font-semibold bg-card">
                              <tr className="hover:bg-muted/5">
                                <td className="p-3 text-indigo-500 font-bold">Bachelor of Science (B.Sc)</td><td className="p-3">IIT University of Dhaka</td><td className="p-3 font-mono">2022</td><td className="p-3 font-mono">3.85</td><td className="p-3 text-right"><span className="text-[9px] font-black text-emerald-500 uppercase flex items-center justify-end gap-1"><Check className="size-3" /> Verified</span></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Professional Training Programs */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase text-foreground/80 flex items-center gap-1.5"><Award className="size-3.5 text-indigo-500" /> Professional Training Programs</h4>
                        <div className="border border-border/40 rounded-xl overflow-hidden shadow-xs">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-muted/40 text-[9px] uppercase font-bold text-muted-foreground border-b border-border/20">
                              <tr><th className="p-3">Training Title</th><th className="p-3">Institution / Provider</th><th className="p-3">Duration</th><th className="p-3 text-right">Completion Date</th></tr>
                            </thead>
                            <tbody className="divide-y divide-border/20 font-semibold bg-card">
                              <tr className="hover:bg-muted/5">
                                <td className="p-3 text-indigo-500 font-bold">Advanced System Architecture</td><td className="p-3">Coursera / Pakiza Software</td><td className="p-3">12 Weeks</td><td className="p-3 font-mono text-right">10/03/2024</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category 2: Career History & Tracks */}
                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-5 space-y-6">
                    <div className="flex items-center gap-2.5 border-b border-primary/20 pb-3">
                      <div className="size-8 rounded-full bg-primary/15 text-primary flex items-center justify-center"><Briefcase className="size-4.5" /></div>
                      <div>
                        <h3 className="text-xs font-black uppercase text-primary tracking-wider">II. Professional Career & Job History</h3>
                        <p className="text-[10px] text-muted-foreground">Prior industrial background, designations, and verified certificates.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      {/* Prior Job Experience */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase text-foreground/80 flex items-center gap-1.5"><History className="size-3.5 text-primary" /> Career History</h4>
                        <div className="border border-border/40 rounded-xl overflow-hidden shadow-xs">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-muted/40 text-[9px] uppercase font-bold text-muted-foreground border-b border-border/20">
                              <tr><th className="p-3">Organization / Company</th><th className="p-3">Designation</th><th className="p-3">From Date</th><th className="p-3">To Date</th><th className="p-3">Reason for Leaving</th><th className="p-3 text-right">Attachment</th></tr>
                            </thead>
                            <tbody className="divide-y divide-border/20 font-semibold bg-card">
                              <tr className="hover:bg-muted/5">
                                <td className="p-3 font-bold">Pakiza Software Limited</td><td className="p-3 text-primary">Software Engineer</td><td className="p-3 font-mono">01/01/2023</td><td className="p-3 font-mono">28/02/2025</td><td className="p-3">Career Growth</td><td className="p-3 text-right"><span className="text-[9px] font-black text-emerald-500 uppercase flex items-center justify-end gap-1"><Check className="size-3" /> NOC</span></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Professional Certifications */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase text-foreground/80 flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-primary" /> Professional Certifications & Credentials</h4>
                        <div className="border border-border/40 rounded-xl overflow-hidden shadow-xs">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-muted/40 text-[9px] uppercase font-bold text-muted-foreground border-b border-border/20">
                              <tr><th className="p-3">Certificate Title</th><th className="p-3">Issuing Authority / Organization</th><th className="p-3">Credential ID</th><th className="p-3 text-right">Issue Date</th></tr>
                            </thead>
                            <tbody className="divide-y divide-border/20 font-semibold bg-card">
                              <tr className="hover:bg-muted/5">
                                <td className="p-3 text-primary font-bold">AWS Certified Solutions Architect</td><td className="p-3">Amazon Web Services</td><td className="p-3 font-mono text-slate-500">AWS-102938</td><td className="p-3 font-mono text-right">15/06/2024</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category 3: Special Involvements */}
                  <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-5 space-y-6">
                    <div className="flex items-center gap-2.5 border-b border-amber-500/20 pb-3">
                      <div className="size-8 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center"><Users className="size-4.5" /></div>
                      <div>
                        <h3 className="text-xs font-black uppercase text-amber-600 tracking-wider">III. Committee Commitments & Involvements</h3>
                        <p className="text-[10px] text-muted-foreground">Internal panels, audit commissions, and technical leadership roles.</p>
                      </div>
                    </div>

                    {/* Organizational Involvements */}
                    <div className="space-y-3">
                      <div className="border border-border/40 rounded-xl overflow-hidden shadow-xs">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-muted/40 text-[9px] uppercase font-bold text-muted-foreground border-b border-border/20">
                            <tr><th className="p-3">Committee / Group Name</th><th className="p-3">Role Played</th><th className="p-3">Duration</th><th className="p-3 text-right">Key Deliverable / Remarks</th></tr>
                          </thead>
                          <tbody className="divide-y divide-border/20 font-semibold bg-card">
                            <tr className="hover:bg-muted/5">
                              <td className="p-3 font-extrabold text-foreground">HRIS Standardization Committee</td><td className="p-3 text-amber-600 font-bold">Technical Lead</td><td className="p-3 font-mono">6 Months</td><td className="p-3 text-right text-muted-foreground font-medium">Led database migration and performance optimizations</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. FAMILY & DEPENDENTS */}
              {activeTab === "family" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nominee Declaration Dossier */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 border-b border-border/20 pb-1.5">Nominee Declaration Dossier</h4>
                      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-0.5">
                            <div className="text-sm font-black text-foreground">Fatema Begum</div>
                            <div className="text-[10px] font-bold text-emerald-600 uppercase">Mother</div>
                          </div>
                          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black font-mono">100% SHARE</div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-emerald-500/20">
                          <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Nominee NID / Birth Reg</div><div className="font-bold font-mono">1952093847120</div></div>
                          <div className="space-y-0.5"><div className="text-[9px] font-bold text-muted-foreground uppercase">Nominee Contact No</div><div className="font-bold font-mono">+880 1711-002233</div></div>
                          <div className="space-y-0.5 col-span-2"><div className="text-[9px] font-bold text-muted-foreground uppercase">Permanent Address</div><div className="font-semibold text-foreground/80">Vill # Dhopapara, Road # 12, Mirpur, Dhaka</div></div>
                        </div>
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-rose-500 border-b border-border/20 pb-1.5">Emergency Contact</h4>
                      <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 space-y-2 h-full flex flex-col justify-center">
                        <div className="text-xs font-extrabold text-foreground">Mohammad Abdur Rahman</div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase">Father</div>
                        <div className="text-[10px] font-mono text-muted-foreground pt-1">+880 1750-021154</div>
                      </div>
                    </div>
                  </div>

                  {/* Family Dependents Registry */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary border-b border-border/20 pb-1.5">Family Dependents Registry</h4>
                    <table className="w-full text-left text-xs border border-border/40 rounded-lg overflow-hidden">
                      <thead className="bg-muted/40 text-[9px] uppercase font-bold text-muted-foreground">
                        <tr><th className="p-3">Dependent Name</th><th className="p-3">Relationship</th><th className="p-3">Date of Birth</th><th className="p-3 text-right">NID / Birth Cert No</th></tr>
                      </thead>
                      <tbody className="divide-y divide-border/20 font-semibold bg-card">
                        <tr className="hover:bg-muted/5">
                          <td className="p-3 font-bold text-foreground">Anisur Rahman</td><td className="p-3 text-primary">Child (Son/Daughter)</td><td className="p-3 font-mono">12/08/1965</td><td className="p-3 font-mono text-right">1928374650</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 5. VERIFICATION & DOCS */}
              {activeTab === "docs" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Official Auditor Background Verification */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 border-b border-border/20 pb-1.5">Official Auditor Background Verification</h4>
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="size-8 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center"><ShieldCheck className="size-4" /></div>
                          <div>
                            <div className="text-xs font-black text-emerald-600 uppercase tracking-wide">Verified & Cleared</div>
                            <div className="text-[9px] font-bold text-muted-foreground uppercase">Background Check Status</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold font-mono">19/05/2026</div>
                          <div className="text-[9px] font-bold text-muted-foreground uppercase">Verification Date</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-emerald-500/20 text-xs">
                        <div className="space-y-0.5">
                          <div className="text-[9px] font-bold text-muted-foreground uppercase">Audited / Verified By</div>
                          <div className="font-bold text-foreground">HR Compliance Team</div>
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-[9px] font-bold text-muted-foreground uppercase">Auditor Notes & Findings</div>
                          <div className="font-semibold text-muted-foreground/80 leading-relaxed italic">"All background verification checks cleared successfully, including academic credential validation and police clearance."</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Supporting Documents & PDF Annexes */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary border-b border-border/20 pb-1.5">Supporting Documents & PDF Annexes</h4>
                    <table className="w-full text-left text-xs border border-border/40 rounded-lg overflow-hidden">
                      <thead className="bg-muted/40 text-[9px] uppercase font-bold text-muted-foreground">
                        <tr><th className="p-3">Document Title</th><th className="p-3">Document Type</th><th className="p-3">Attached File Name</th><th className="p-3 text-right">Status</th></tr>
                      </thead>
                      <tbody className="divide-y divide-border/20 font-semibold bg-card">
                        <tr className="hover:bg-muted/5">
                          <td className="p-3 font-bold text-foreground">Police Clearance Certificate</td><td className="p-3 text-indigo-500">PDF Document</td><td className="p-3 font-mono text-muted-foreground">police_clearance_shapno.pdf</td><td className="p-3 text-right"><span className="text-[9px] font-black text-emerald-500 uppercase flex items-center justify-end gap-1"><Check className="size-3" /> Secure</span></td>
                        </tr>
                        <tr className="hover:bg-muted/5">
                          <td className="p-3 font-bold text-foreground">National ID Card (Both Sides)</td><td className="p-3 text-indigo-500">JPG Image</td><td className="p-3 font-mono text-muted-foreground">nid_scan_front_back.jpg</td><td className="p-3 text-right"><span className="text-[9px] font-black text-emerald-500 uppercase flex items-center justify-end gap-1"><Check className="size-3" /> Secure</span></td>
                        </tr>
                        <tr className="hover:bg-muted/5">
                          <td className="p-3 font-bold text-foreground">B.Sc Academic Certificate</td><td className="p-3 text-indigo-500">PDF Document</td><td className="p-3 font-mono text-muted-foreground">bsc_certificate_dhaka_uni.pdf</td><td className="p-3 text-right"><span className="text-[9px] font-black text-emerald-500 uppercase flex items-center justify-end gap-1"><Check className="size-3" /> Secure</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Connected Documents from Previous Employment Periods */}
                  {careerTimeline.length > 1 && (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-500 border-b border-border/20 pb-1.5">Connected Documents from Previous Employment Periods</h4>
                      <div className="border border-border/40 rounded-lg overflow-hidden bg-card divide-y divide-border/20">
                        {careerTimeline
                          .filter(period => period.id !== selectedEmp.id)
                          .map(period => (
                            <div key={period.id} className="p-3 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-muted/5 transition">
                              <div className="flex items-center gap-2.5">
                                <div className="size-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                                  <FileClock className="size-4 shrink-0" />
                                </div>
                                <div>
                                  <div className="font-medium text-foreground">Archive Dossier for ID: {period.id}</div>
                                  <div className="text-[9px] text-muted-foreground uppercase font-mono mt-0.5">Joined: {period.joinDate} | Left: {period.resignDate}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 self-end sm:self-center">
                                <span className="text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded-sm uppercase tracking-wide leading-none font-medium">3 Files Attached</span>
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
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary border-b border-border/20 pb-1.5">Visual Identity Vault</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="border border-border/50 bg-card rounded-xl p-4 flex flex-col items-center text-center gap-3 shadow-xs">
                        <div className="size-16 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center"><User className="size-8" /></div>
                        <div className="text-[10px] font-bold">Portrait Scan</div>
                        <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full"><Check className="size-3" /> Uploaded</span>
                      </div>
                      <div className="border border-border/50 bg-card rounded-xl p-4 flex flex-col items-center text-center gap-3 shadow-xs">
                        <div className="size-16 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center"><FileSignature className="size-8" /></div>
                        <div className="text-[10px] font-bold">Signature</div>
                        <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full"><Check className="size-3" /> Uploaded</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. INCREMENT HISTORY */}
              {activeTab === "increment" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 border-b border-border/20 pb-1.5">Financial & Increment Timeline</h4>
                    {!incRecord ? (
                      <div className="p-8 text-center bg-muted/10 rounded-xl border border-border/40">
                        <History className="size-8 mx-auto text-muted-foreground/40 mb-3" />
                        <p className="text-xs font-semibold text-muted-foreground">No increment history found for this employee.</p>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-muted/10 border border-border/30 rounded-xl p-3 text-center">
                            <div className="text-[9px] font-black uppercase text-muted-foreground mb-1">Joining Salary</div>
                            <div className="text-sm font-black font-mono">৳{incRecord.salaryJoining.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                          </div>
                          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
                            <div className="text-[9px] font-black uppercase text-emerald-600 mb-1">Current Gross</div>
                            <div className="text-sm font-black font-mono text-emerald-600">৳{incRecord.salaryGross.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                          </div>
                          <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-center">
                            <div className="text-[9px] font-black uppercase text-primary mb-1">Total Inc.</div>
                            <div className="text-sm font-black font-mono text-primary">৳{(incRecord.salaryGross - incRecord.salaryJoining).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                          </div>
                          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-center">
                            <div className="text-[9px] font-black uppercase text-amber-600 mb-1">Promotions</div>
                            <div className="text-sm font-black font-mono text-amber-600">{incRecord.total.includes("(P)") ? "Yes" : "0"}</div>
                          </div>
                        </div>
                        <div className="mt-8">
                          {(() => {
                            const timelineData = [
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
                              .filter(y => y.inc && y.inc !== "0" && y.inc.trim() !== "")
                              .map((item, index, arr) => {
                                const isPromo = item.inc.includes("(P)");
                                const val = parseFloat(item.inc.replace("(P)", "").replace(/,/g, "")) || 0;
                                let rGross = incRecord.salaryJoining;
                                for (let i = 0; i <= index; i++) rGross += parseFloat(arr[i].inc.replace("(P)", "").replace(/,/g, "")) || 0;
                                return { ...item, isPromo, val, rGross };
                              })
                              .reverse();

                            return (
                              <div className="relative border-l-2 border-border/40 ml-4 space-y-8 pb-4">
                                {timelineData.map((item) => (
                                  <div key={item.year} className="relative pl-6">
                                    {/* Timeline Dot */}
                                    <div className="absolute -left-[9px] top-1.5 size-4 rounded-full bg-emerald-500 ring-4 ring-background flex items-center justify-center">
                                      <div className="size-1.5 bg-background rounded-full"></div>
                                    </div>

                                    {/* Content Card */}
                                    <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm relative -top-1.5 hover:border-emerald-500/30 transition-colors">
                                      <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                          <span className="font-black text-sm text-foreground">Increment {item.year}</span>
                                          {item.isPromo && <span className="text-[9px] bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">Promoted</span>}
                                        </div>
                                        <div className="text-emerald-600 font-mono font-bold text-xs bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">
                                          +৳{item.val.toLocaleString("en-IN")}
                                        </div>
                                      </div>
                                      <div className="flex justify-between items-center text-xs pt-3 border-t border-border/40">
                                        <span className="text-muted-foreground font-semibold uppercase text-[10px] tracking-wider">Running Gross Salary</span>
                                        <span className="font-mono font-black text-primary text-sm">৳{item.rGross.toLocaleString("en-IN")}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                {(!incRecord.total || incRecord.total.startsWith("0")) && (
                                  <div className="pl-6 pb-4">
                                    <p className="text-xs font-semibold text-muted-foreground italic">No increments received yet.</p>
                                  </div>
                                )}

                                {/* Joining Point */}
                                <div className="relative pl-6">
                                  <div className="absolute -left-[9px] top-1.5 size-4 rounded-full bg-primary ring-4 ring-background flex items-center justify-center">
                                    <div className="size-1.5 bg-background rounded-full"></div>
                                  </div>
                                  <div className="bg-muted/10 border border-border/40 rounded-xl p-4 relative -top-1.5">
                                    <div className="font-black text-sm text-primary mb-3">Joined Company</div>
                                    <div className="flex justify-between items-center text-xs pt-3 border-t border-border/40">
                                      <span className="text-muted-foreground font-semibold uppercase text-[10px] tracking-wider">Joining Salary</span>
                                      <span className="font-mono font-black text-foreground text-sm">৳{incRecord.salaryJoining.toLocaleString("en-IN")}</span>
                                    </div>
                                  </div>
                                </div>
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
      </main>
    </div>
  );
}
