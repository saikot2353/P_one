import { useState } from "react";
import {
  User, Gift, DollarSign, Camera, GraduationCap, History, Award, BookOpen, Users,
  PhoneCall, FileSignature, Heart, Baby, FileText, FileDown, ShieldCheck, Laptop,
  ChevronDown, Check, MapPin, Briefcase, UserCog, Clock, FileClock, ArrowUpRight, UserPlus, TrendingUp
} from "lucide-react";
import { rawIncrementRecords } from "@/routes/-increment-history-data";

export const DETAIL_TABS = [
  { id: "personal_identity", label: "Personal & Identity", icon: User },
  { id: "qualifications_experience", label: "Qualifications & Experience", icon: GraduationCap },
  { id: "allowance_salary", label: "Allowance & Salary Details", icon: DollarSign },
  { id: "statutory_nominee", label: "Statutory Nominee Hub", icon: FileSignature },
  { id: "corporate_assets", label: "Corporate Assets Vault", icon: Laptop },
  { id: "hr_verification", label: "HR Verification & Audit", icon: ShieldCheck },
  { id: "increment_history", label: "Increment History", icon: TrendingUp },
];

interface EmployeeDetailTabsProps {
  selectedEmp: any;
}

export function EmployeeDetailTabs({ selectedEmp }: EmployeeDetailTabsProps) {
  const [activeDetailTab, setActiveDetailTab] = useState("personal_identity");
  const [isDetailDropdownOpen, setIsDetailDropdownOpen] = useState(false);
  const [subSection, setSubSection] = useState("primary_placement");

  const incRecord = rawIncrementRecords.find(r => r.empId === selectedEmp.id);

  // Dynamic fields calculated realistically from available employee properties
  const grossNum = parseFloat(selectedEmp.gross) || 30000;
  const basicVal = (grossNum * 0.60).toFixed(2);
  const houseRentVal = (grossNum * 0.25).toFixed(2);
  const medicalVal = (grossNum * 0.08).toFixed(2);
  const conveyanceVal = (grossNum * 0.04).toFixed(2);
  const foodVal = (grossNum * 0.03).toFixed(2);
  const pfVal = (grossNum * 0.60 * 0.10).toFixed(2);
  const festivalBonusVal = basicVal;

  const getSubSectionCompletionPercentage = (subId: string): number => {
    switch (subId) {
      case "primary_placement": {
        const fields = [
          selectedEmp.name,
          selectedEmp.gender,
          selectedEmp.dob,
          selectedEmp.blood,
        ];
        const filled = fields.filter(Boolean).length;
        return Math.round((filled / fields.length) * 100);
      }
      case "legal_kinship":
        return 100;
      case "address_contact": {
        const fields = [
          selectedEmp.email,
          selectedEmp.officeMob || "—",
        ];
        const filled = fields.filter(val => val && val !== "—").length;
        return Math.round((filled / fields.length) * 100);
      }
      case "picture_uploads":
        return 100;
      case "emergency_contact":
        return 100;
      case "references":
        return 100;
      default:
        return 0;
    }
  };

  const nameBngVal = selectedEmp.name === "Tahmid Afsar Shapno" ? "তাহমিদ আফসার স্বপন" :
    selectedEmp.name === "Sohanur Rahman Sohan" ? "সোহানুর রহমান সোহান" :
      selectedEmp.name === "Easin Mia" ? "ইয়াসিন মিয়া" :
        selectedEmp.name === "Jannatul Maowa" ? "জান্নাতুল মাওয়া" :
          selectedEmp.name + " (বাংলা)";

  const fatherNameEng = "Mohammad Abdur Rahman";
  const fatherNameBng = "মোহাম্মদ আবদুর রহমান";
  const motherNameEng = "Sultana Begum";
  const motherNameBng = "সুলতানা বেগম";
  const spouseNameEng = selectedEmp.gender === "Female" ? "Mohammad Karim" : "—";
  const spouseNameBng = selectedEmp.gender === "Female" ? "মোহাম্মদ করিম" : "—";

  const nomineeName = selectedEmp.gender === "Female" ? "Abdur Rahman" : "Fatema Begum";
  const ref1Name = "Dr. Mohammad Kaykobad";
  const ref1Designation = "Professor Emeritus, CSE";
  const ref1Org = "BUET";
  const ref1Contact = "+880 1711-223344";

  const laptopAsset = `COMP-${selectedEmp.id.slice(0, 4)}-992`;
  const accessCard = `RFID-${selectedEmp.id.slice(6)}`;

  return (
    <div className="flex flex-col w-full">
      {/* Quick macOS styled Dropdown Switcher (Mobile Only) */}
      <div className="px-6 py-4 bg-muted/10 border-b border-border/20 flex flex-col md:hidden justify-between gap-4 relative">
        <div className="w-full md:max-w-xs relative z-30">
          <label className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/60 block mb-1">Select Directory</label>
          <button
            type="button"
            onClick={() => setIsDetailDropdownOpen(!isDetailDropdownOpen)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-foreground transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              {(() => {
                const ActiveIcon = DETAIL_TABS.find(t => t.id === activeDetailTab)?.icon || User;
                return <ActiveIcon className="size-4 text-primary" />;
              })()}
              <span className="text-xs font-extrabold">{DETAIL_TABS.find(t => t.id === activeDetailTab)?.label}</span>
            </div>
            <ChevronDown className="size-3.5 text-muted-foreground/60 transition-transform duration-200" style={{ transform: isDetailDropdownOpen ? 'rotate(180deg)' : 'none' }} />
          </button>

          {isDetailDropdownOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setIsDetailDropdownOpen(false)} />
              <div className="absolute left-0 right-0 mt-1 rounded-xl bg-card border border-border shadow-lg py-1.5 z-30 max-h-60 overflow-y-auto scrollbar-thin">
                {DETAIL_TABS.map((tab, idx) => {
                  const TabIcon = tab.icon;
                  const isSelected = activeDetailTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveDetailTab(tab.id);
                        setIsDetailDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-muted/75 text-left text-xs font-semibold transition-all ${isSelected
                          ? "text-primary bg-primary/5 font-extrabold"
                          : "text-foreground/80"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <TabIcon className={`size-3.5 ${isSelected ? "text-primary animate-pulse" : "text-muted-foreground/60"}`} />
                        <span>{idx + 1}. {tab.label}</span>
                      </div>
                      {isSelected && <Check className="size-3.5 text-primary stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Quick summary badges */}
        <div className="flex gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-extrabold uppercase border border-primary/10">
            <Briefcase className="size-3" /> {selectedEmp.dept}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/5 text-indigo-500 text-[10px] font-extrabold uppercase border border-indigo-500/10">
            <UserCog className="size-3" /> {selectedEmp.title}
          </span>
        </div>
      </div>

      {/* Horizontal Directory Tabs for Desktop - STUNNING PILL DESIGN */}
      <div className="hidden md:block px-6 py-3 border-b border-border/40 bg-gradient-to-r from-muted/20 via-background to-muted/20">
        <div className="flex bg-card/60 backdrop-blur-md border border-border/60 rounded-xl p-1.5 overflow-x-auto whitespace-nowrap scrollbar-none gap-1 shadow-sm">
          {DETAIL_TABS.map((tab, idx) => {
            const TabIcon = tab.icon;
            const isSelected = activeDetailTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDetailTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-4 rounded-lg text-[11px] font-extrabold transition-all duration-300 shrink-0 ${isSelected
                    ? "bg-primary text-primary-foreground shadow-md ring-1 ring-primary/20 scale-[1.02]"
                    : "bg-transparent text-muted-foreground/80 hover:bg-muted hover:text-foreground"
                  }`}
              >
                <TabIcon className={`size-3.5 shrink-0 ${isSelected ? "animate-pulse" : ""}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. PERSONAL & IDENTITY TAB (CONSOLIDATED WITH PROGRESS STEPPER) */}
      {activeDetailTab === "personal_identity" && (
        <div className="p-6 overflow-y-auto space-y-6 max-h-[62vh] scrollbar-thin">

          {/* Stepper Navigation */}
          <div className="bg-card border border-border/60 rounded-lg p-4 shadow-xs overflow-x-auto scrollbar-thin">
            <div className="min-w-[580px] relative flex items-center justify-between px-6 py-2">
              <div className="absolute top-[22px] left-[45px] right-[45px] h-[3px] bg-muted/60 border-t border-b border-border/20 z-0" />

              {[
                { id: "primary_placement", label: "Placement", icon: User },
                { id: "legal_kinship", label: "Kinship", icon: Users },
                { id: "address_contact", label: "Contact", icon: MapPin },
                { id: "picture_uploads", label: "Scans", icon: Camera },
                { id: "emergency_contact", label: "Emergency", icon: PhoneCall },
                { id: "references", label: "References", icon: Heart },
              ].map((step, idx) => {
                const StepIcon = step.icon;
                const isSelected = subSection === step.id;
                const subPercentage = getSubSectionCompletionPercentage(step.id);
                const isCompleted = subPercentage === 100;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setSubSection(step.id)}
                    className="relative z-10 flex flex-col items-center gap-1.5 group transition-all duration-300 focus:outline-none shrink-0"
                    style={{ width: "80px" }}
                  >
                    <div className={`size-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative ${isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-[0_0_12px_var(--primary)] scale-110"
                        : isCompleted
                          ? "bg-emerald-500 text-white border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                          : "bg-card text-muted-foreground border-border/80 hover:border-muted-foreground/60"
                      }`}>
                      {isCompleted ? (
                        <Check className="size-4 stroke-[3]" />
                      ) : (
                        <StepIcon className="size-4" />
                      )}
                      {isSelected && (
                        <div className="absolute inset-[-3px] rounded-full border border-primary/40 animate-ping opacity-60 pointer-events-none" />
                      )}
                    </div>
                    <div className="text-center space-y-1 w-full min-w-[100px]">
                      <span className={`text-[9px] font-black uppercase tracking-wide block transition-colors duration-200 ${isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                        }`}>
                        {idx + 1}. {step.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-panels */}
          {subSection === "primary_placement" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-muted/10 border border-border/30 rounded-xl p-4 space-y-3">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-border/20 pb-1.5">
                  <User className="size-3.5" /> Primary Identity & Placement Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-0.5">
                    <div className="text-[9px] font-bold text-muted-foreground uppercase">Emp ID (System)</div>
                    <div className="text-xs font-extrabold text-foreground">{selectedEmp.id}</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[9px] font-bold text-muted-foreground uppercase">Emp ID (Comp.)</div>
                    <div className="text-xs font-extrabold text-foreground">{selectedEmp.offcId || "—"}</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[9px] font-bold text-muted-foreground uppercase">Name (English)</div>
                    <div className="text-xs font-extrabold text-foreground">{selectedEmp.name}</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[9px] font-bold text-muted-foreground uppercase">Name (Bangla)</div>
                    <div className="text-xs font-bold text-foreground">{nameBngVal}</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[9px] font-bold text-muted-foreground uppercase">Gender</div>
                    <div className="text-xs font-bold text-foreground">{selectedEmp.gender}</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[9px] font-bold text-muted-foreground uppercase">Marital Status</div>
                    <div className="text-xs font-bold text-foreground">{selectedEmp.maritalStatus || "Single"}</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[9px] font-bold text-muted-foreground uppercase">Date of Birth</div>
                    <div className="text-xs font-bold text-foreground">{selectedEmp.dob}</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[9px] font-bold text-muted-foreground uppercase">Blood Group</div>
                    <div className="text-xs font-bold text-foreground">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
                        {selectedEmp.blood}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[9px] font-bold text-muted-foreground uppercase">Religion</div>
                    <div className="text-xs font-bold text-foreground">Islam</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {subSection === "legal_kinship" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-muted/10 border border-border/30 rounded-xl p-4 space-y-4">
                <div>
                  <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-border/20 pb-1.5 mb-3">
                    <FileText className="size-3.5" /> Legal Documents & Parents' Names
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
                    <div className="space-y-0.5">
                      <div className="text-[9px] font-bold text-muted-foreground uppercase font-sans">National ID (NID)</div>
                      <div className="text-xs font-bold text-foreground">1928374659201</div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[9px] font-bold text-muted-foreground uppercase font-sans">Passport Number</div>
                      <div className="text-xs font-bold text-foreground">DC-0928371</div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[9px] font-bold text-muted-foreground uppercase font-sans">Driving License</div>
                      <div className="text-xs font-bold text-foreground">DL-9921-X3</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/20 pt-3">
                  <h5 className="text-[9px] font-extrabold uppercase text-muted-foreground mb-3 tracking-wide">Family Lineage Details</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-0.5">
                      <div className="text-[9px] font-bold text-muted-foreground uppercase">Father Name</div>
                      <div className="text-xs font-bold text-foreground">{fatherNameEng}</div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[9px] font-bold text-muted-foreground uppercase">Mother Name</div>
                      <div className="text-xs font-bold text-foreground">{motherNameEng}</div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[9px] font-bold text-muted-foreground uppercase">Spouse Name</div>
                      <div className="text-xs font-bold text-foreground">{spouseNameEng}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {subSection === "address_contact" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/10 border border-border/30 rounded-xl p-4 space-y-3">
                  <div className="text-xs font-extrabold uppercase text-primary tracking-wider flex items-center gap-1 border-b border-border/20 pb-1">
                    <MapPin className="size-3.5" /> Present Address
                  </div>
                  <div className="text-xs space-y-1.5 font-semibold text-foreground/80 leading-relaxed">
                    <div><span className="text-[9px] font-bold text-muted-foreground uppercase mr-1">Division:</span> Dhaka</div>
                    <div><span className="text-[9px] font-bold text-muted-foreground uppercase mr-1">District:</span> Dhaka</div>
                    <div><span className="text-[9px] font-bold text-muted-foreground uppercase mr-1">Upazila:</span> Mirpur</div>
                    <div><span className="text-[9px] font-bold text-muted-foreground uppercase mr-1">Village:</span> Vill # Dhopapara, Road # 12</div>
                  </div>
                </div>

                <div className="bg-muted/10 border border-border/30 rounded-xl p-4 space-y-3">
                  <div className="text-xs font-extrabold uppercase text-primary tracking-wider flex items-center gap-1 border-b border-border/20 pb-1">
                    <MapPin className="size-3.5" /> Permanent Address
                  </div>
                  <div className="text-xs space-y-1.5 font-semibold text-foreground/80 leading-relaxed">
                    <div><span className="text-[9px] font-bold text-muted-foreground uppercase mr-1">Division:</span> Dhaka</div>
                    <div><span className="text-[9px] font-bold text-muted-foreground uppercase mr-1">District:</span> Dhaka</div>
                    <div><span className="text-[9px] font-bold text-muted-foreground uppercase mr-1">Upazila:</span> Mirpur</div>
                    <div><span className="text-[9px] font-bold text-muted-foreground uppercase mr-1">Village:</span> Vill # Dhopapara, Road # 12</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {subSection === "picture_uploads" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="border border-border/50 bg-card rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2">
                  <div className="size-14 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                    <User className="size-7" />
                  </div>
                  <div className="text-[10px] font-bold text-foreground">Portrait Photo</div>
                  <span className="text-[8px] font-extrabold text-emerald-500 uppercase font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Uploaded</span>
                </div>
                <div className="border border-border/50 bg-card rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2">
                  <div className="size-14 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center">
                    <FileSignature className="size-7" />
                  </div>
                  <div className="text-[10px] font-bold text-foreground">Signature Scan</div>
                  <span className="text-[8px] font-extrabold text-emerald-500 uppercase font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Uploaded</span>
                </div>
                <div className="border border-border/50 bg-card rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2">
                  <div className="size-14 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
                    <FileText className="size-7" />
                  </div>
                  <div className="text-[10px] font-bold text-foreground">NID scan (PDF)</div>
                  <span className="text-[8px] font-extrabold text-emerald-500 uppercase font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Uploaded</span>
                </div>
                <div className="border border-border/50 bg-card rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2">
                  <div className="size-14 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
                    <GraduationCap className="size-7" />
                  </div>
                  <div className="text-[10px] font-bold text-foreground">Graduation Cert</div>
                  <span className="text-[8px] font-extrabold text-emerald-500 uppercase font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Uploaded</span>
                </div>
              </div>
            </div>
          )}

          {subSection === "emergency_contact" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-muted/10 border border-border/30 rounded-xl p-4">
                <div className="space-y-0.5">
                  <div className="text-[9px] font-bold text-muted-foreground uppercase">Contact Person</div>
                  <div className="text-xs font-extrabold text-foreground">Mohammad Abdur Rahman</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[9px] font-bold text-muted-foreground uppercase">Relationship</div>
                  <div className="text-xs font-bold text-foreground">Father</div>
                </div>
                <div className="space-y-0.5 font-mono">
                  <div className="text-[9px] font-bold text-muted-foreground uppercase font-sans">Primary Phone</div>
                  <div className="text-xs font-extrabold text-foreground">+880 1750-021154</div>
                </div>
                <div className="space-y-0.5 sm:col-span-3">
                  <div className="text-[9px] font-bold text-muted-foreground uppercase">Residential Address</div>
                  <div className="text-xs font-semibold text-foreground/80 leading-relaxed">House 12, Road 4, Sector 6, Uttara, Dhaka</div>
                </div>
              </div>
            </div>
          )}

          {subSection === "references" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-border bg-card rounded-xl space-y-2">
                  <div className="text-[9px] font-extrabold uppercase text-primary tracking-wider border-b border-border/10 pb-1">Referee 1</div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-extrabold text-foreground">{ref1Name}</h4>
                    <div className="text-[10px] font-bold text-muted-foreground">{ref1Designation} | {ref1Org}</div>
                    <div className="text-[10px] font-semibold text-muted-foreground/60 font-mono">{ref1Contact}</div>
                  </div>
                </div>
                <div className="p-4 border border-border bg-card rounded-xl space-y-2">
                  <div className="text-[9px] font-extrabold uppercase text-indigo-500 tracking-wider border-b border-border/10 pb-1">Referee 2</div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-extrabold text-foreground">Easin Mia</h4>
                    <div className="text-[10px] font-bold text-indigo-500">Senior Operations Lead | Pakiza Group</div>
                    <div className="text-[10px] font-semibold text-muted-foreground/60 font-mono">+880 1324-726766</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 2. QUALIFICATIONS & EXPERIENCE TAB */}
      {activeDetailTab === "qualifications_experience" && (
        <div className="p-6 overflow-y-auto space-y-6 max-h-[62vh] scrollbar-thin">

          {/* Section A: Academic Credentials */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-border/30 pb-1.5">
              <GraduationCap className="size-3.5" /> Academic Credentials & Qualifications
            </h4>
            <div className="border border-border/40 rounded-xl overflow-hidden text-xs">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-muted/40 text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40">
                    <th className="px-4 py-3">Degree Title</th>
                    <th className="px-4 py-3">Institution Name</th>
                    <th className="px-4 py-3 font-mono">Passing Year</th>
                    <th className="px-4 py-3 text-center font-mono">GPA / Result</th>
                    <th className="px-4 py-3 text-center font-mono">Uploaded Document</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 font-semibold text-foreground/80">
                  {selectedEmp.name === "Tahmid Afsar Shapno" ? (
                    <>
                      <tr className="hover:bg-muted/5">
                        <td className="px-4 py-3 text-primary">Master of Science (M.Sc)</td>
                        <td className="px-4 py-3">IIT University of Dhaka</td>
                        <td className="px-4 py-3 font-mono">2022</td>
                        <td className="px-4 py-3 text-center font-mono">3.92</td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] font-bold">
                            <Check className="size-3" /> msc_certificate.pdf
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-muted/5">
                        <td className="px-4 py-3 text-primary">Bachelor of Science (B.Sc)</td>
                        <td className="px-4 py-3">University of Dhaka</td>
                        <td className="px-4 py-3 font-mono">2020</td>
                        <td className="px-4 py-3 text-center font-mono">3.85</td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] font-bold">
                            <Check className="size-3" /> bsc_certificate.pdf
                          </span>
                        </td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr className="hover:bg-muted/5">
                        <td className="px-4 py-3 text-primary">Bachelor of Business Admin (BBA)</td>
                        <td className="px-4 py-3">National University</td>
                        <td className="px-4 py-3 font-mono">2021</td>
                        <td className="px-4 py-3 text-center font-mono">3.45</td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] font-bold">
                            <Check className="size-3" /> bba_degree_scan.pdf
                          </span>
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section B: Job Experiences */}
          <div className="space-y-3 pt-2">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-border/30 pb-1.5">
              <History className="size-3.5" /> Prior Job Experiences
            </h4>
            <div className="grid grid-cols-1 gap-3.5">
              {selectedEmp.name === "Tahmid Afsar Shapno" ? (
                <>
                  <div className="flex items-center justify-between p-4 border border-border bg-card rounded-xl">
                    <div className="flex gap-4">
                      <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                        <Briefcase className="size-4.5" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-extrabold text-foreground">Asst. Manager — Business Innovation</h4>
                        <div className="text-[10px] font-bold text-primary uppercase">Pakiza Software Limited</div>
                        <div className="text-[9px] font-semibold text-muted-foreground/60 font-mono">2023-08-01 — Present</div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] font-bold">
                      <Check className="size-3" /> pakiza_noc.pdf
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border bg-card rounded-xl">
                    <div className="flex gap-4">
                      <div className="size-10 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 border border-indigo-500/20">
                        <Briefcase className="size-4.5" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-extrabold text-foreground">Senior Software Engineer</h4>
                        <div className="text-[10px] font-bold text-indigo-500 uppercase">Brain Station 23 Ltd</div>
                        <div className="text-[9px] font-semibold text-muted-foreground/60 font-mono">2021-03-15 — 2023-07-31</div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] font-bold">
                      <Check className="size-3" /> bs23_experience_letter.pdf
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between p-4 border border-border bg-card rounded-xl">
                  <div className="flex gap-4">
                    <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                      <Briefcase className="size-4.5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-extrabold text-foreground">{selectedEmp.title} — Admin Operations</h4>
                      <div className="text-[10px] font-bold text-primary uppercase">Pakiza Software Limited</div>
                      <div className="text-[9px] font-semibold text-muted-foreground/60 font-mono">{selectedEmp.joinDate} — Present</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] font-bold">
                    <Check className="size-3" /> experience_letter.pdf
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Section C: Professional Certificates & Trainings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 border border-border bg-card rounded-xl space-y-2">
              <h5 className="text-[10px] font-extrabold uppercase text-primary tracking-wider border-b border-border/10 pb-1 flex items-center gap-1">
                <Award className="size-3.5" /> Professional Certifications
              </h5>
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-foreground">AWS Certified Solutions Architect</h4>
                <div className="text-[10px] font-bold text-muted-foreground">Amazon Web Services</div>
                <div className="text-[9px] font-semibold text-muted-foreground/60 font-mono">ID: AWS-9928173</div>
              </div>
            </div>
            <div className="p-4 border border-border bg-card rounded-xl space-y-2">
              <h5 className="text-[10px] font-extrabold uppercase text-primary tracking-wider border-b border-border/10 pb-1 flex items-center gap-1">
                <BookOpen className="size-3.5" /> In-Service Corporate Trainings
              </h5>
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-foreground">Information Security & ISO 27001 Auditor</h4>
                <div className="text-[10px] font-bold text-muted-foreground">Pakiza Internal Audit Team</div>
                <div className="text-[9px] font-semibold text-muted-foreground/60 font-mono">Completed: 12/04/2024</div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 3. ALLOWANCE & SALARY DETAILS */}
      {activeDetailTab === "allowance_salary" && (
        <div className="p-6 overflow-y-auto space-y-6 max-h-[62vh] scrollbar-thin">

          {/* Allowances */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 flex items-center gap-1.5 border-b border-emerald-500/30 pb-1.5">
              <Gift className="size-3.5" /> Active Allowances & Compensation Pools
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
              <div className="space-y-0.5">
                <div className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Gross Salary</div>
                <div className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300 font-mono">
                  ৳{grossNum.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[9px] font-bold text-muted-foreground uppercase">House Rent (25%)</div>
                <div className="text-xs font-bold text-foreground font-mono">
                  ৳{parseFloat(houseRentVal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[9px] font-bold text-muted-foreground uppercase">Medical (8%)</div>
                <div className="text-xs font-bold text-foreground font-mono">
                  ৳{parseFloat(medicalVal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[9px] font-bold text-muted-foreground uppercase">Conveyance (4%)</div>
                <div className="text-xs font-bold text-foreground font-mono">
                  ৳{parseFloat(conveyanceVal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[9px] font-bold text-muted-foreground uppercase">Food (3%)</div>
                <div className="text-xs font-bold text-foreground font-mono">
                  ৳{parseFloat(foodVal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[9px] font-bold text-muted-foreground uppercase">Special Perks Pool</div>
                <div className="text-xs font-bold text-foreground font-mono">৳5,000.00</div>
              </div>
            </div>
          </div>

          {/* Core Salary Configurations & Bank Mapping */}
          <div className="space-y-4 pt-2">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-border/30 pb-1.5">
              <DollarSign className="size-3.5" /> Core Salary Configurations & Bank Mapping
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-muted/10 border border-border/30 rounded-xl p-4">
              <div className="space-y-0.5">
                <div className="text-[9px] font-bold text-muted-foreground uppercase">Basic Salary (60%)</div>
                <div className="text-xs font-bold text-foreground font-mono">
                  ৳{parseFloat(basicVal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[9px] font-bold text-muted-foreground uppercase">Provident Fund (10%)</div>
                <div className="text-xs font-bold text-foreground font-mono">
                  ৳{parseFloat(pfVal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[9px] font-bold text-muted-foreground uppercase">Festival Bonus Pool</div>
                <div className="text-xs font-bold text-foreground font-mono">
                  ৳{parseFloat(festivalBonusVal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <h5 className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground">Corporate Banking Details</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-primary/5 border border-primary/10 rounded-xl p-4 font-mono text-xs">
                <div>
                  <div className="text-[9px] font-bold text-muted-foreground uppercase font-sans">Bank Name</div>
                  <div className="font-extrabold text-foreground font-sans">Dutch-Bangla Bank Ltd</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold text-muted-foreground uppercase font-sans">Account No</div>
                  <div className="font-extrabold text-primary">102.120.9928173</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold text-muted-foreground uppercase font-sans">Branch</div>
                  <div className="font-bold text-foreground font-sans">Mirpur-10 Circle</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold text-muted-foreground uppercase font-sans">Routing Number</div>
                  <div className="font-bold text-foreground">090261987</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 4. STATUTORY NOMINEE HUB */}
      {activeDetailTab === "statutory_nominee" && (
        <div className="p-6 overflow-y-auto space-y-6 max-h-[62vh] scrollbar-thin">

          {/* Nominee details */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-border/30 pb-1.5">
              <FileSignature className="size-3.5" /> Legal Nominee Declarations
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-muted/10 border border-border/30 rounded-xl p-4">
              <div className="space-y-0.5">
                <div className="text-[9px] font-bold text-muted-foreground uppercase">Nominee Name</div>
                <div className="text-xs font-extrabold text-foreground">{nomineeName}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[9px] font-bold text-muted-foreground uppercase">Relationship</div>
                <div className="text-xs font-bold text-foreground">{selectedEmp.gender === "Female" ? "Father" : "Mother"}</div>
              </div>
              <div className="space-y-0.5 font-mono">
                <div className="text-[9px] font-bold text-muted-foreground uppercase font-sans">Share Percentage</div>
                <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">100% Share</div>
              </div>
              <div className="space-y-0.5 font-mono">
                <div className="text-[9px] font-bold text-muted-foreground uppercase font-sans">NID / Birth Cert</div>
                <div className="text-xs font-bold text-foreground">19658293740291</div>
              </div>
              <div className="space-y-0.5 sm:col-span-4">
                <div className="text-[9px] font-bold text-muted-foreground uppercase">Permanent Address</div>
                <div className="text-xs font-semibold text-foreground/80 leading-relaxed">Village: Voroshakathi, Post: Hawlader, Barishal, Bangladesh</div>
              </div>
            </div>
          </div>

          {/* Dependents list */}
          <div className="space-y-3 pt-2">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-border/30 pb-1.5">
              <Baby className="size-3.5" /> Family Dependents Registry
            </h4>
            <div className="border border-border/40 rounded-xl overflow-hidden text-xs">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-muted/40 text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40">
                    <th className="px-4 py-3">Dependent Name</th>
                    <th className="px-4 py-3">Relationship</th>
                    <th className="px-4 py-3 font-mono">DOB</th>
                    <th className="px-4 py-3 font-mono">NID / Birth Cert No</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 font-semibold text-foreground/80">
                  {selectedEmp.maritalStatus === "Married" ? (
                    <tr className="hover:bg-muted/5">
                      <td className="px-4 py-3 text-primary">Sara Afsar</td>
                      <td className="px-4 py-3">Spouse</td>
                      <td className="px-4 py-3 font-mono">12/04/2001</td>
                      <td className="px-4 py-3 font-mono">1988273645021</td>
                    </tr>
                  ) : (
                    <tr className="hover:bg-muted/5">
                      <td className="px-4 py-3 text-primary">Mohammad Abdur Rahman</td>
                      <td className="px-4 py-3">Parent</td>
                      <td className="px-4 py-3 font-mono">15/08/1960</td>
                      <td className="px-4 py-3 font-mono">1938472619802</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 5. CORPORATE ASSETS VAULT */}
      {activeDetailTab === "corporate_assets" && (
        <div className="p-6 overflow-y-auto space-y-6 max-h-[62vh] scrollbar-thin">

          <div className="space-y-3">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-border/30 pb-1.5">
              <Laptop className="size-3.5" /> Corporate Assets Assignment
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-muted/10 border border-border/30 rounded-xl p-4">
              <div className="space-y-0.5">
                <div className="text-[9px] font-bold text-muted-foreground uppercase">Assigned Device</div>
                <div className="text-xs font-extrabold text-foreground">Apple MacBook Pro 16"</div>
              </div>
              <div className="space-y-0.5 font-mono">
                <div className="text-[9px] font-bold text-muted-foreground uppercase font-sans">Laptop Asset ID</div>
                <div className="text-xs font-extrabold text-primary font-mono text-emerald-600 dark:text-emerald-400">{laptopAsset}</div>
              </div>
              <div className="space-y-0.5 font-mono">
                <div className="text-[9px] font-bold text-muted-foreground uppercase font-sans">Access Card RFID</div>
                <div className="text-xs font-extrabold text-foreground font-mono">{accessCard}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[9px] font-bold text-muted-foreground uppercase">Corporate Mobile Device</div>
                <div className="text-xs font-semibold text-foreground">iPhone 15 Pro (Asset MOB-2026)</div>
              </div>
              <div className="space-y-0.5 font-mono">
                <div className="text-[9px] font-bold text-muted-foreground uppercase font-sans">SIM/Number Allocated</div>
                <div className="text-xs font-bold text-foreground font-sans">+880 1750-021154</div>
              </div>
              <div className="space-y-0.5 font-mono">
                <div className="text-[9px] font-bold text-muted-foreground uppercase font-sans">Issued Date</div>
                <div className="text-xs font-bold text-foreground">{selectedEmp.joinDate}</div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 6. HR VERIFICATION & AUDIT */}
      {activeDetailTab === "hr_verification" && (
        <div className="p-6 overflow-y-auto space-y-6 max-h-[62vh] scrollbar-thin">

          <div className="space-y-3">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 flex items-center gap-1.5 border-b border-emerald-500/30 pb-1.5">
              <ShieldCheck className="size-3.5" /> Official HR Audit Clearance
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-muted/10 border border-border/30 rounded-xl p-4">
              <div className="space-y-0.5">
                <div className="text-[9px] font-bold text-muted-foreground uppercase">Background Status</div>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-extrabold border border-emerald-500/25">
                    <span className="size-1 rounded-full bg-emerald-500 animate-ping" /> Verified & Cleared
                  </span>
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[9px] font-bold text-muted-foreground uppercase">Cleared By Auditor</div>
                <div className="text-xs font-extrabold text-foreground">HR Compliance Team</div>
              </div>
              <div className="space-y-0.5 font-mono">
                <div className="text-[9px] font-bold text-muted-foreground uppercase font-sans">Clearance Date</div>
                <div className="text-xs font-bold text-foreground">{selectedEmp.joinDate}</div>
              </div>
              <div className="space-y-0.5 sm:col-span-3 pt-2 border-t border-border/20 mt-2">
                <div className="text-[9px] font-bold text-muted-foreground uppercase">Verification Findings</div>
                <p className="text-xs font-semibold text-foreground/80 leading-relaxed mt-1">All academic credentials validated. National ID and background databases checked. Corporate reference verification reports cleared successfully with no flags raised.</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 7. INCREMENT HISTORY */}
      {activeDetailTab === "increment_history" && (
        <div className="p-6 overflow-y-auto space-y-6 max-h-[62vh] scrollbar-thin">

          <div className="space-y-4">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-border/30 pb-1.5">
              <TrendingUp className="size-3.5" /> Increment & Promotion History
            </h4>

            {!incRecord ? (
              <div className="p-8 text-center border border-border/40 rounded-xl bg-muted/10">
                <History className="size-8 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-xs font-semibold text-muted-foreground">No increment history found for this employee.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Summary Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] font-black uppercase text-primary/80 mb-1 tracking-widest">Joining Salary</span>
                    <span className="text-base font-black text-primary font-mono">৳{incRecord.salaryJoining.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 mb-1 tracking-widest">Current Gross</span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">৳{incRecord.salaryGross.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] font-black uppercase text-indigo-600 dark:text-indigo-400 mb-1 tracking-widest">Total Increment</span>
                    <span className="text-base font-black text-indigo-600 dark:text-indigo-400 font-mono">৳{(incRecord.salaryGross - incRecord.salaryJoining).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] font-black uppercase text-amber-600 dark:text-amber-400 mb-1 tracking-widest">Promotions</span>
                    <span className="text-base font-black text-amber-600 dark:text-amber-400 font-mono">{incRecord.total.includes("(P)") || incRecord.total.split("(")[1]?.replace(")", "") || "0"}</span>
                  </div>
                </div>

                {/* Yearly Timeline Table */}
                <div className="border border-border/40 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead>
                      <tr className="bg-muted/40 border-b border-border/40 text-[9px] font-black uppercase tracking-wider text-muted-foreground/80">
                        <th className="px-4 py-3">Year</th>
                        <th className="px-4 py-3 text-right">Increment Amount</th>
                        <th className="px-4 py-3 text-center">Promotion Status</th>
                        <th className="px-4 py-3 text-right">Running Gross</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20 font-semibold">
                      {[
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

                          // Calculate running gross (simplified assumption)
                          let runningGross = incRecord.salaryJoining;
                          for (let i = 0; i <= index; i++) {
                            const pastVal = parseFloat(arr[i].inc.replace("(P)", "").replace(/,/g, "")) || 0;
                            runningGross += pastVal;
                          }

                          return (
                            <tr key={item.year} className="hover:bg-muted/10 transition-colors group">
                              <td className="px-4 py-3 font-black text-foreground">
                                {item.year}
                              </td>
                              <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                                +৳{val.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {isPromo ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[9px] font-black uppercase">
                                    <Award className="size-3" /> Promoted
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-muted-foreground/50">-</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-primary">
                                ৳{runningGross.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                              </td>
                            </tr>
                          );
                        })}
                      {(!incRecord.total || incRecord.total.startsWith("0")) && (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground text-xs font-semibold">
                            No increments received yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
