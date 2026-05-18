import { useState } from "react";
import {
  User, Gift, DollarSign, Camera, GraduationCap, History, Award, BookOpen, Users,
  PhoneCall, FileSignature, Heart, Baby, FileText, FileDown, ShieldCheck, Laptop,
  ChevronDown, Check, MapPin, Briefcase, UserCog, Clock, FileClock, ArrowUpRight, UserPlus
} from "lucide-react";

export const DETAIL_TABS = [
  { id: "basic", label: "Basic Info", icon: User },
  { id: "allowance", label: "Allowance", icon: Gift },
  { id: "salary_others", label: "Salary & others", icon: DollarSign },
  { id: "picture_upload", label: "Picture Upload", icon: Camera },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "job_experience", label: "Job Experience", icon: History },
  { id: "professional_certificate", label: "Professional Certificate", icon: Award },
  { id: "training", label: "Training", icon: BookOpen },
  { id: "involvement", label: "Involvement", icon: Users },
  { id: "emergency_contact", label: "Emergency Contact", icon: PhoneCall },
  { id: "nominee_form", label: "Nominee Form", icon: FileSignature },
  { id: "reference", label: "Reference", icon: Heart },
  { id: "dependent", label: "Dependent", icon: Baby },
  { id: "job_description", label: "Job Description", icon: FileText },
  { id: "others_docx", label: "Others Docx", icon: FileDown },
  { id: "employee_verification", label: "Employee Verification", icon: ShieldCheck },
  { id: "employee_equipment", label: "Employee Equipment", icon: Laptop },
];

interface EmployeeDetailTabsProps {
  selectedEmp: any;
}

export function EmployeeDetailTabs({ selectedEmp }: EmployeeDetailTabsProps) {
  const [activeDetailTab, setActiveDetailTab] = useState("basic");
  const [isDetailDropdownOpen, setIsDetailDropdownOpen] = useState(false);

  // Dynamic fields calculated realistically from available employee properties
  const grossNum = parseFloat(selectedEmp.gross) || 30000;
  const basicVal = (grossNum * 0.60).toFixed(2);
  const houseRentVal = (grossNum * 0.25).toFixed(2);
  const medicalVal = (grossNum * 0.08).toFixed(2);
  const conveyanceVal = (grossNum * 0.04).toFixed(2);
  const foodVal = (grossNum * 0.03).toFixed(2);
  const pfVal = (grossNum * 0.60 * 0.10).toFixed(2);
  const festivalBonusVal = basicVal;

  // Helper to parse dates in DD/MM/YYYY or YYYY-MM-DD format
  const parseEmpDate = (dateStr: string) => {
    if (!dateStr) return new Date();
    if (dateStr.includes("-")) return new Date(dateStr);
    const [d, m, y] = dateStr.split("/");
    return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const joinDateObj = parseEmpDate(selectedEmp.joinDate);
  
  // Salary configuration date (1 month after join)
  const salaryDate = new Date(joinDateObj);
  salaryDate.setMonth(salaryDate.getMonth() + 1);

  // Increment date (6 months after join)
  const incrementDate = new Date(joinDateObj);
  incrementDate.setMonth(incrementDate.getMonth() + 6);

  // Promotion date (12 months after join)
  const promotionDate = new Date(joinDateObj);
  promotionDate.setMonth(promotionDate.getMonth() + 12);

  const timelineMilestones = [
    {
      type: "Join",
      title: "Join",
      date: formatDate(joinDateObj),
      icon: UserPlus,
      iconColor: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      badge: "Join",
      description: `Officially joined CRIPTON HRIS as ${selectedEmp.title} in the ${selectedEmp.dept} department.`,
      metaLabel: "Primary Assignment",
      metaValue: selectedEmp.type
    },
    {
      type: "Salary",
      title: "Salary Setup",
      date: formatDate(salaryDate),
      icon: DollarSign,
      iconColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      badge: "Salary",
      description: `Initial gross salary package successfully allocated and payroll ledger created.`,
      metaLabel: "Gross Wage",
      metaValue: `৳${grossNum.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
    },
    {
      type: "Increment",
      title: "Increment",
      date: formatDate(incrementDate),
      icon: ArrowUpRight,
      iconColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      badge: "Increment",
      description: `Granted a 12% performance-based salary increment following the mid-year lifecycle audit.`,
      metaLabel: "New Gross",
      metaValue: `৳${(grossNum * 1.12).toLocaleString("en-IN", { minimumFractionDigits: 0 })} (+৳${(grossNum * 0.12).toLocaleString("en-IN", { minimumFractionDigits: 0 })})`
    },
    {
      type: "Promotion",
      title: "Promotion",
      date: formatDate(promotionDate),
      icon: Briefcase,
      iconColor: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
      badge: "Promotion",
      description: `Formally elevated in corporate rank for exceptional leadership and core operational deliverables.`,
      metaLabel: "New Designation",
      metaValue: `Senior ${selectedEmp.title}`
    }
  ];

  const emailLocal = selectedEmp.email || "employee@pakizasoftware.com";
  const personalEmailVal = emailLocal.replace("pakizasoftware.com", "gmail.com").replace("pakizatvl.com", "gmail.com");

  // Derived personal details
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
  const spouseNid = spouseNameEng !== "—" ? "4401928374" : "—";
  const spouseContact = spouseNameEng !== "—" ? "+880 1712-998877" : "—";

  const nomineeName = selectedEmp.gender === "Female" ? "Abdur Rahman" : "Fatema Begum";
  const ref1Name = "Dr. Mohammad Kaykobad";
  const ref1Designation = "Professor Emeritus, CSE";
  const ref1Org = "BUET";
  const ref1Contact = "+880 1711-223344";

  const jobDesc = `Primary roles encompass corporate planning, database schemas, payroll system scalability, and technical team coordination inside ${selectedEmp.dept}.`;

  const otherDocsList = [
    { docTitle: "Police Clearance Certificate", docType: "PDF", docFile: "police_clearance.pdf" },
    { docTitle: "NDA & Compliance Declaration", docType: "PDF", docFile: "nda_signed.pdf" }
  ];

  const laptopAsset = `COMP-${selectedEmp.id.slice(0,4)}-992`;
  const accessCard = `RFID-${selectedEmp.id.slice(6)}`;

  return (
    <div className="flex flex-col w-full">
      {/* Quick macOS styled Dropdown Switcher (just like screenshot!) */}
      <div className="px-6 py-4 bg-muted/10 border-b border-border/20 flex flex-col md:flex-row md:items-center justify-between gap-4 relative">
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
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-muted/75 text-left text-xs font-semibold transition-all ${
                        isSelected
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

      {/* Horizontal Directory Tabs for Desktop */}
      <div className="flex border-b border-border/40 bg-muted/20 px-6 overflow-x-auto whitespace-nowrap scrollbar-none gap-2">
        {DETAIL_TABS.map((tab, idx) => {
          const TabIcon = tab.icon;
          const isSelected = activeDetailTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveDetailTab(tab.id);
              }}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold transition-all border-b-2 -mb-[1px] shrink-0 ${
                isSelected
                  ? "border-primary text-primary font-extrabold"
                  : "border-transparent text-muted-foreground/80 hover:text-foreground"
              }`}
            >
              <TabIcon className="size-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      {activeDetailTab === "basic" && (
        <div className="p-6 overflow-y-auto space-y-6 max-h-[62vh]">
          {/* Primary Identity */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-border/30 pb-1.5">
              <User className="size-3.5" /> Primary Identity
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-muted/10 border border-border/30 rounded-xl p-4">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Emp ID (System)</div>
                <div className="text-xs font-extrabold text-foreground">{selectedEmp.id}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Emp ID (Comp.)</div>
                <div className="text-xs font-extrabold text-foreground">{selectedEmp.offcId || "—"}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Name (English)</div>
                <div className="text-xs font-extrabold text-foreground">{selectedEmp.name}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Name (Bangla)</div>
                <div className="text-xs font-bold text-foreground">{nameBngVal}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Gender</div>
                <div className="text-xs font-bold text-foreground">{selectedEmp.gender}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Marital Status</div>
                <div className="text-xs font-bold text-foreground">{selectedEmp.maritalStatus || "Single"}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Date of Birth</div>
                <div className="text-xs font-bold text-foreground">{selectedEmp.dob}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Blood Group</div>
                <div className="text-xs font-bold text-foreground">
                  <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
                    {selectedEmp.blood}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Religion</div>
                <div className="text-xs font-bold text-foreground">Islam</div>
              </div>
            </div>
          </div>

          {/* Legal Documents */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-border/30 pb-1.5">
              <FileText className="size-3.5" /> Legal Documents & NIDs
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-muted/10 border border-border/30 rounded-xl p-4 font-mono">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase font-sans">National ID (NID)</div>
                <div className="text-xs font-bold text-foreground">1928374659201</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase font-sans">Passport Number</div>
                <div className="text-xs font-bold text-foreground font-mono">DC-0928371</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase font-sans">Driving License</div>
                <div className="text-xs font-bold text-foreground font-mono">DL-9921-X3</div>
              </div>
            </div>
          </div>

          {/* Family details */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-border/30 pb-1.5">
              <Heart className="size-3.5" /> Family & Spousal Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-muted/10 border border-border/30 rounded-xl p-4">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Father Name</div>
                <div className="text-xs font-bold text-foreground">{fatherNameEng} ({fatherNameBng})</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Mother Name</div>
                <div className="text-xs font-bold text-foreground">{motherNameEng} ({motherNameBng})</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Spouse Name</div>
                <div className="text-xs font-bold text-foreground">{spouseNameEng} ({spouseNameBng})</div>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-muted/5 border border-border/30 rounded-xl p-4 space-y-3">
              <div className="text-xs font-extrabold uppercase text-primary tracking-wider flex items-center gap-1 border-b border-border/20 pb-1">
                <MapPin className="size-3.5" /> Present Address
              </div>
              <div className="text-xs space-y-1.5 font-medium text-foreground/80 leading-relaxed">
                <div><span className="text-[9px] font-bold text-muted-foreground uppercase mr-1">Division:</span> Dhaka</div>
                <div><span className="text-[9px] font-bold text-muted-foreground uppercase mr-1">District:</span> Dhaka</div>
                <div><span className="text-[9px] font-bold text-muted-foreground uppercase mr-1">Upazila:</span> Mirpur</div>
                <div><span className="text-[9px] font-bold text-muted-foreground uppercase mr-1">Village:</span> Vill # Dhopapara, Road # 12</div>
              </div>
            </div>

            <div className="bg-muted/5 border border-border/30 rounded-xl p-4 space-y-3">
              <div className="text-xs font-extrabold uppercase text-primary tracking-wider flex items-center gap-1 border-b border-border/20 pb-1">
                <MapPin className="size-3.5" /> Permanent Address
              </div>
              <div className="text-xs space-y-1.5 font-medium text-foreground/80 leading-relaxed">
                <div><span className="text-[9px] font-bold text-muted-foreground uppercase mr-1">Division:</span> Dhaka</div>
                <div><span className="text-[9px] font-bold text-muted-foreground uppercase mr-1">District:</span> Dhaka</div>
                <div><span className="text-[9px] font-bold text-muted-foreground uppercase mr-1">Upazila:</span> Mirpur</div>
                <div><span className="text-[9px] font-bold text-muted-foreground uppercase mr-1">Village:</span> Vill # Dhopapara, Road # 12</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ALLOWANCE TAB */}
      {activeDetailTab === "allowance" && (
        <div className="p-6 overflow-y-auto space-y-6 max-h-[62vh]">
          <div className="space-y-3">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 flex items-center gap-1.5 border-b border-emerald-500/30 pb-1.5">
              <Gift className="size-3.5" /> Active Allowances & Compensation Pools
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Gross Salary</div>
                <div className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300 font-mono">
                  ৳{grossNum.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">House Rent Allowance</div>
                <div className="text-xs font-bold text-foreground font-mono">
                  ৳{parseFloat(houseRentVal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Medical Allowance</div>
                <div className="text-xs font-bold text-foreground font-mono">
                  ৳{parseFloat(medicalVal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Conveyance Allowance</div>
                <div className="text-xs font-bold text-foreground font-mono">
                  ৳{parseFloat(conveyanceVal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Food Allowance</div>
                <div className="text-xs font-bold text-foreground font-mono">
                  ৳{parseFloat(foodVal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Special Perks Pool</div>
                <div className="text-xs font-bold text-foreground font-mono">৳5,000.00</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SALARY & OTHERS TAB */}
      {activeDetailTab === "salary_others" && (
        <div className="p-6 overflow-y-auto space-y-6 max-h-[62vh]">
          <div className="space-y-4">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-border/30 pb-1.5">
              <DollarSign className="size-3.5" /> Core Salary Configurations & Bank Mapping
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-muted/10 border border-border/30 rounded-xl p-4">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Basic Salary (60%)</div>
                <div className="text-xs font-bold text-foreground font-mono">
                  ৳{parseFloat(basicVal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Provident Fund (10%)</div>
                <div className="text-xs font-bold text-foreground font-mono">
                  ৳{parseFloat(pfVal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Festival Bonus Pool</div>
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

      {/* 4. PICTURE UPLOAD TAB */}
      {activeDetailTab === "picture_upload" && (
        <div className="p-6 overflow-y-auto space-y-6 max-h-[62vh]">
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-border/30 pb-1.5">
            <Camera className="size-3.5" /> Employee Image Dossier
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="border border-border/50 bg-card rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2">
              <div className="size-16 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                <User className="size-8" />
              </div>
              <div className="text-[10px] font-bold text-foreground">Portrait Photo</div>
              <span className="text-[8px] font-extrabold text-emerald-500 uppercase font-mono">Uploaded</span>
            </div>
            <div className="border border-border/50 bg-card rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2">
              <div className="size-16 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center">
                <FileSignature className="size-8" />
              </div>
              <div className="text-[10px] font-bold text-foreground">Signature Scan</div>
              <span className="text-[8px] font-extrabold text-emerald-500 uppercase font-mono">Uploaded</span>
            </div>
            <div className="border border-border/50 bg-card rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2">
              <div className="size-16 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
                <FileText className="size-8" />
              </div>
              <div className="text-[10px] font-bold text-foreground">NID scan (PDF)</div>
              <span className="text-[8px] font-extrabold text-emerald-500 uppercase font-mono">Uploaded</span>
            </div>
            <div className="border border-border/50 bg-card rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2">
              <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
                <GraduationCap className="size-8" />
              </div>
              <div className="text-[10px] font-bold text-foreground">Graduation Cert</div>
              <span className="text-[8px] font-extrabold text-emerald-500 uppercase font-mono">Uploaded</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. EDUCATION TAB */}
      {activeDetailTab === "education" && (
        <div className="p-6 overflow-y-auto space-y-6 max-h-[62vh]">
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
                    </tr>
                    <tr className="hover:bg-muted/5">
                      <td className="px-4 py-3 text-primary">Bachelor of Science (B.Sc)</td>
                      <td className="px-4 py-3">University of Dhaka</td>
                      <td className="px-4 py-3 font-mono">2020</td>
                      <td className="px-4 py-3 text-center font-mono">3.85</td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr className="hover:bg-muted/5">
                      <td className="px-4 py-3 text-primary">Bachelor of Business Admin (BBA)</td>
                      <td className="px-4 py-3">National University</td>
                      <td className="px-4 py-3 font-mono">2021</td>
                      <td className="px-4 py-3 text-center font-mono">3.45</td>
                    </tr>
                    <tr className="hover:bg-muted/5">
                      <td className="px-4 py-3 text-primary">Higher Secondary Certificate (HSC)</td>
                      <td className="px-4 py-3">Dhaka College</td>
                      <td className="px-4 py-3 font-mono">2017</td>
                      <td className="px-4 py-3 text-center font-mono">4.80</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. JOB EXPERIENCE TAB */}
      {activeDetailTab === "job_experience" && (
        <div className="p-6 overflow-y-auto space-y-6 max-h-[62vh]">
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-border/30 pb-1.5">
            <History className="size-3.5" /> Career History & Timeline
          </h4>
          <div className="space-y-4">
            {selectedEmp.name === "Tahmid Afsar Shapno" ? (
              <>
                <div className="flex gap-4 p-4 border border-border bg-card rounded-xl">
                  <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                    <Briefcase className="size-4.5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-extrabold text-foreground">Asst. Manager — Business Innovation</h4>
                    <div className="text-[10px] font-bold text-primary uppercase">Pakiza Software Limited</div>
                    <div className="text-[9px] font-bold text-muted-foreground/60 font-mono">2023-08-01 — Present</div>
                  </div>
                </div>
                <div className="flex gap-4 p-4 border border-border bg-card rounded-xl">
                  <div className="size-10 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 border border-indigo-500/20">
                    <Briefcase className="size-4.5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-extrabold text-foreground">Senior Software Engineer</h4>
                    <div className="text-[10px] font-bold text-indigo-500 uppercase">Brain Station 23 Ltd</div>
                    <div className="text-[9px] font-bold text-muted-foreground/60 font-mono">2021-03-15 — 2023-07-31</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex gap-4 p-4 border border-border bg-card rounded-xl">
                <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                  <Briefcase className="size-4.5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold text-foreground">{selectedEmp.title} — Admin Operations</h4>
                  <div className="text-[10px] font-bold text-primary uppercase font-mono">Pakiza Software Limited</div>
                  <div className="text-[9px] font-bold text-muted-foreground/60 font-mono">{selectedEmp.joinDate} — Present</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. PROFESSIONAL CERTIFICATE */}
      {activeDetailTab === "professional_certificate" && (
        <div className="p-6 overflow-y-auto space-y-6 max-h-[62vh]">
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-border/30 pb-1.5">
            <Award className="size-3.5" /> Professional Certifications
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border border-border bg-card rounded-xl space-y-1 relative">
              <div className="inline-flex px-2 py-0.5 rounded bg-primary/10 text-primary text-[9px] font-extrabold uppercase font-mono">Verified</div>
              <h4 className="text-xs font-extrabold text-foreground">AWS Certified Solutions Architect</h4>
              <div className="text-[10px] font-bold text-muted-foreground">Amazon Web Services</div>
              <div className="text-[9px] font-semibold text-muted-foreground/60 font-mono">ID: AWS-9928173</div>
            </div>
            <div className="p-4 border border-border bg-card rounded-xl space-y-1 relative">
              <div className="inline-flex px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 text-[9px] font-extrabold uppercase font-mono">Verified</div>
              <h4 className="text-xs font-extrabold text-foreground">HR Management Professional (PHRi)</h4>
              <div className="text-[10px] font-bold text-indigo-500">HR Certification Institute</div>
              <div className="text-[9px] font-semibold text-muted-foreground/60 font-mono">ID: HRCI-8819028</div>
            </div>
          </div>
        </div>
      )}

      {/* 8. TRAINING TAB */}
      {activeDetailTab === "training" && (
        <div className="p-6 overflow-y-auto space-y-6 max-h-[62vh]">
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-border/30 pb-1.5">
            <BookOpen className="size-3.5" /> Professional Corporate Trainings
          </h4>
          <div className="border border-border/40 rounded-xl overflow-hidden text-xs">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-muted/40 text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40">
                  <th className="px-4 py-3">Training Title</th>
                  <th className="px-4 py-3">Institution Name</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3 font-mono">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 font-semibold text-foreground/80">
                <tr className="hover:bg-muted/5">
                  <td className="px-4 py-3 text-primary">Information Security & ISO 27001 Auditor</td>
                  <td className="px-4 py-3">Pakiza Internal Audit Team</td>
                  <td className="px-4 py-3">1 Week</td>
                  <td className="px-4 py-3 font-mono">12/04/2024</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 9. INVOLVEMENT TAB */}
      {activeDetailTab === "involvement" && (
        <div className="p-6 overflow-y-auto space-y-6 max-h-[62vh]">
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-border/30 pb-1.5">
            <Users className="size-3.5" /> Organizational Committees & Involvements
          </h4>
          <div className="p-4 border border-border bg-card rounded-xl space-y-1.5">
            <h4 className="text-xs font-extrabold text-foreground">ISO 27001 Certification Task Force</h4>
            <div className="text-[10px] font-bold text-primary uppercase">Technical Lead | 6 Months</div>
            <p className="text-[11px] text-muted-foreground/80 leading-relaxed">Assigned to configure the enterprise digital dossier access vaults and ensure total credential security protocols.</p>
          </div>
        </div>
      )}

      {/* 10. EMERGENCY CONTACT TAB */}
      {activeDetailTab === "emergency_contact" && (
        <div className="p-6 overflow-y-auto space-y-6 max-h-[62vh]">
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-rose-500 flex items-center gap-1.5 border-b border-rose-500/30 pb-1.5">
            <PhoneCall className="size-3.5 animate-pulse" /> Emergency Contact Info
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-muted/10 border border-border/30 rounded-xl p-4">
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Contact Person</div>
              <div className="text-xs font-extrabold text-foreground">Mohammad Abdur Rahman</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Relationship</div>
              <div className="text-xs font-bold text-foreground">Father</div>
            </div>
            <div className="space-y-1 font-mono">
              <div className="text-[10px] font-bold text-muted-foreground uppercase font-sans">Primary Phone</div>
              <div className="text-xs font-extrabold text-foreground">+880 1750-021154</div>
            </div>
            <div className="space-y-1 sm:col-span-2 md:col-span-3">
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Residential Address</div>
              <div className="text-xs font-semibold text-foreground/80 leading-relaxed">House 12, Road 4, Sector 6, Uttara, Dhaka</div>
            </div>
          </div>
        </div>
      )}

      {/* 11. NOMINEE TAB */}
      {activeDetailTab === "nominee_form" && (
        <div className="p-6 overflow-y-auto space-y-6 max-h-[62vh]">
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-border/30 pb-1.5">
            <FileSignature className="size-3.5" /> Legal Nominee Declarations
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-muted/10 border border-border/30 rounded-xl p-4">
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Nominee Name</div>
              <div className="text-xs font-extrabold text-foreground">{nomineeName}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Relationship</div>
              <div className="text-xs font-bold text-foreground">{selectedEmp.gender === "Female" ? "Father" : "Mother"}</div>
            </div>
            <div className="space-y-1 font-mono">
              <div className="text-[10px] font-bold text-muted-foreground uppercase font-sans">Share Percentage</div>
              <div className="text-xs font-extrabold text-primary font-mono text-emerald-600 dark:text-emerald-400">100% Share</div>
            </div>
            <div className="space-y-1 font-mono">
              <div className="text-[10px] font-bold text-muted-foreground uppercase font-sans">NID / Birth Cert</div>
              <div className="text-xs font-bold text-foreground">19658293740291</div>
            </div>
            <div className="space-y-1 sm:col-span-2 md:col-span-3">
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Permanent Address</div>
              <div className="text-xs font-semibold text-foreground/80 leading-relaxed">Village: Voroshakathi, Post: Hawlader, Barishal, Bangladesh</div>
            </div>
          </div>
        </div>
      )}

      {/* 12. REFERENCE TAB */}
      {activeDetailTab === "reference" && (
        <div className="p-6 overflow-y-auto space-y-6 max-h-[62vh]">
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-border/30 pb-1.5">
            <Heart className="size-3.5" /> Corporate References Check
          </h4>
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

      {/* 13. DEPENDENT TAB */}
      {activeDetailTab === "dependent" && (
        <div className="p-6 overflow-y-auto space-y-6 max-h-[62vh]">
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
      )}

      {/* 14. JOB DESCRIPTION TAB */}
      {activeDetailTab === "job_description" && (
        <div className="p-6 overflow-y-auto space-y-6 max-h-[62vh]">
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-border/30 pb-1.5">
            <FileText className="size-3.5" /> Corporate Job Description & Charter
          </h4>
          <div className="space-y-4 bg-muted/10 border border-border/30 rounded-xl p-4 text-xs font-semibold leading-relaxed text-foreground/90">
            <div>
              <div className="text-[9px] font-extrabold uppercase text-muted-foreground mb-1">Key Duties & Responsibilities</div>
              <div>{jobDesc}</div>
            </div>
            <div className="border-t border-border/20 pt-3">
              <div className="text-[9px] font-extrabold uppercase text-muted-foreground mb-1">Primary Deliverables (KPIs)</div>
              <div>Scalable backend coding, Git repository sync, secure corporate asset protection, DB query normalization.</div>
            </div>
            <div className="border-t border-border/20 pt-3">
              <div className="text-[9px] font-extrabold uppercase text-muted-foreground mb-1">Primary Reporting Authority</div>
              <div className="text-primary font-extrabold">Tahmid Afsar Shapno (Director of Engineering)</div>
            </div>
          </div>
        </div>
      )}

      {/* 15. OTHERS DOCX TAB */}
      {activeDetailTab === "others_docx" && (
        <div className="p-6 overflow-y-auto space-y-6 max-h-[62vh]">
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-border/30 pb-1.5">
            <FileDown className="size-3.5" /> Supporting PDFs & Digital Attachments
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {otherDocsList.map((doc, idx) => (
              <div key={idx} className="p-4 border border-border/60 bg-muted/5 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                    <FileText className="size-4.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-foreground truncate max-w-[120px]">{doc.docTitle}</h4>
                    <span className="text-[8px] font-extrabold text-primary uppercase font-mono">{doc.docType} File</span>
                  </div>
                </div>
                <span className="text-[8px] font-extrabold text-emerald-500 uppercase font-mono">Linked</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 16. EMPLOYEE VERIFICATION TAB */}
      {activeDetailTab === "employee_verification" && (
        <div className="p-6 overflow-y-auto space-y-6 max-h-[62vh]">
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 flex items-center gap-1.5 border-b border-emerald-500/30 pb-1.5">
            <ShieldCheck className="size-3.5 animate-pulse" /> Official HR Audit Clearance
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-muted/10 border border-border/30 rounded-xl p-4">
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Background Status</div>
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-extrabold border border-emerald-500/25">
                  <span className="size-1 rounded-full bg-emerald-500 animate-ping" /> Verified & Cleared
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Cleared By Auditor</div>
              <div className="text-xs font-extrabold text-foreground">HR Compliance Team</div>
            </div>
            <div className="space-y-1 font-mono">
              <div className="text-[10px] font-bold text-muted-foreground uppercase font-sans">Clearance Date</div>
              <div className="text-xs font-bold text-foreground">{selectedEmp.joinDate}</div>
            </div>
            <div className="space-y-1 sm:col-span-2 md:col-span-3">
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Verification Findings</div>
              <p className="text-xs font-semibold text-foreground/80 leading-relaxed">All academic credentials validated. National ID and background databases checked. Corporate reference verification reports cleared successfully with no flags raised.</p>
            </div>
          </div>
        </div>
      )}

      {/* 17. EMPLOYEE EQUIPMENT TAB */}
      {activeDetailTab === "employee_equipment" && (
        <div className="p-6 overflow-y-auto space-y-6 max-h-[62vh]">
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-border/30 pb-1.5">
            <Laptop className="size-3.5" /> Corporate Assets Assignment
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-muted/10 border border-border/30 rounded-xl p-4">
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Assigned Device</div>
              <div className="text-xs font-extrabold text-foreground">Apple MacBook Pro 16"</div>
            </div>
            <div className="space-y-1 font-mono">
              <div className="text-[10px] font-bold text-muted-foreground uppercase font-sans">Laptop Asset ID</div>
              <div className="text-xs font-extrabold text-primary font-mono text-emerald-600 dark:text-emerald-400">{laptopAsset}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Access Card RFID</div>
              <div className="text-xs font-extrabold text-foreground font-mono">{accessCard}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Corporate Mobile Device</div>
              <div className="text-xs font-semibold text-foreground">iPhone 15 Pro (Asset MOB-2026)</div>
            </div>
            <div className="space-y-1 font-mono">
              <div className="text-[10px] font-bold text-muted-foreground uppercase font-sans">SIM/Number Allocated</div>
              <div className="text-xs font-bold text-foreground font-sans">+880 1750-021154</div>
            </div>
            <div className="space-y-1 font-mono">
              <div className="text-[10px] font-bold text-muted-foreground uppercase font-sans">Issued Date</div>
              <div className="text-xs font-bold text-foreground">{selectedEmp.joinDate}</div>
            </div>
          </div>
        </div>
      )}

      {/* 18. TIMELINE TAB (fallback / special render) */}
      {activeDetailTab === "timeline" && (
        <div className="p-6 overflow-y-auto max-h-[62vh] relative">
          <div className="absolute left-[30px] md:left-1/2 top-8 bottom-8 w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary/80 via-primary/30 to-border/30" />
          <div className="space-y-8 relative">
            {timelineMilestones.map((milestone, idx) => {
              const IconComponent = milestone.icon;
              const isEven = idx % 2 === 0;

              return (
                <div key={idx} className="flex flex-col md:flex-row items-start md:items-center relative">
                  <div className="absolute left-3.5 md:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                    <div className={`size-8 rounded-full border flex items-center justify-center bg-card shadow-xs ${milestone.iconColor}`}>
                      <IconComponent className="size-4 animate-pulse" />
                    </div>
                  </div>

                  <div className="w-full md:flex">
                    <div className={`hidden md:flex md:w-1/2 pr-10 justify-end ${!isEven ? "opacity-0 pointer-events-none select-none" : ""}`}>
                      {isEven && (
                        <div className="bg-card border border-border/80 rounded-xl p-4 shadow-2xs max-w-md w-full relative group hover:border-primary/40 transition duration-200">
                          <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 size-2.5 rotate-45 bg-card border-t border-r border-border/80 group-hover:border-primary/40 transition duration-200" />
                          <div className="flex items-center justify-between gap-2 border-b border-border/20 pb-2 mb-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                              {milestone.badge}
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground/80">{milestone.date}</span>
                          </div>
                          <h4 className="text-xs font-extrabold text-foreground">{milestone.title}</h4>
                          <p className="text-[11px] text-muted-foreground/90 mt-1.5 leading-relaxed">
                            {milestone.description}
                          </p>
                          {milestone.metaValue && (
                            <div className="mt-3 pt-2.5 border-t border-border/30 flex items-center justify-between text-[10px]">
                              <span className="text-muted-foreground font-semibold uppercase">{milestone.metaLabel}:</span>
                              <span className="font-extrabold text-foreground bg-muted/40 px-2 py-0.5 rounded">{milestone.metaValue}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className={`w-full md:w-1/2 pl-12 md:pl-10 flex justify-start ${isEven ? "md:hidden" : ""}`}>
                      <div className="bg-card border border-border/80 rounded-xl p-4 shadow-2xs max-w-md w-full relative group hover:border-primary/40 transition duration-200">
                        <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 size-2.5 rotate-45 bg-card border-b border-l border-border/80 group-hover:border-primary/40 transition duration-200" />
                        <div className="flex items-center justify-between gap-2 border-b border-border/20 pb-2 mb-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {milestone.badge}
                          </span>
                          <span className="text-[10px] font-bold text-muted-foreground/80">{milestone.date}</span>
                        </div>
                        <h4 className="text-xs font-extrabold text-foreground">{milestone.title}</h4>
                        <p className="text-[11px] text-muted-foreground/90 mt-1.5 leading-relaxed">
                          {milestone.description}
                        </p>
                        {milestone.metaValue && (
                          <div className="mt-3 pt-2.5 border-t border-border/30 flex items-center justify-between text-[10px]">
                            <span className="text-muted-foreground font-semibold uppercase">{milestone.metaLabel}:</span>
                            <span className="font-extrabold text-foreground bg-muted/40 px-2 py-0.5 rounded">{milestone.metaValue}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
