import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { 
  ChevronRight, Search, Plus, Pencil, Trash2, X,
  FileSpreadsheet, Printer, FileText, Calendar, ShieldAlert
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/configure-policies")({
  head: () => ({
    meta: [
      { title: "Leave & Policies Setup — CRIPTON HRIS" },
      { name: "description", content: "Configure company rules, guidelines, leave structures, and policy names." },
    ],
  }),
  component: PoliciesSetupPage,
});

type TabType = "leave" | "policyName";

// ----------------------------------------------------
// Interfaces
// ----------------------------------------------------
interface LeaveSetting {
  sl: number;
  company: string;
  leaveType: string;
  isEarnLeave: "Yes" | "No";
  leaveQty: number;
  cfQty: number;
  countBasedOnJoinDate: "Yes" | "No";
  holidayCount: "Yes" | "No";
  leaveOnPresent: "Yes" | "No";
  splitMonthly: "Yes" | "No";
  maxLeaveInMonth: string;
  isActive: "Active" | "Inactive";
}

interface PolicyNameItem {
  sl: number;
  name: string;
  description: string;
  isActive: "Active" | "Inactive";
}

// ----------------------------------------------------
// Defaults
// ----------------------------------------------------
const DEFAULT_LEAVES: LeaveSetting[] = [
  { sl: 1, company: "Pakiza Knit Composite Ltd", leaveType: "Casual Leave (CL)", isEarnLeave: "No", leaveQty: 10, cfQty: 0, countBasedOnJoinDate: "No", holidayCount: "No", leaveOnPresent: "No", splitMonthly: "No", maxLeaveInMonth: "", isActive: "Active" },
  { sl: 2, company: "Pakiza Knit Composite Ltd", leaveType: "Earn Leave (EL)", isEarnLeave: "Yes", leaveQty: 18, cfQty: 0, countBasedOnJoinDate: "No", holidayCount: "No", leaveOnPresent: "No", splitMonthly: "No", maxLeaveInMonth: "", isActive: "Active" },
  { sl: 3, company: "Pakiza Knit Composite Ltd", leaveType: "Sick Leave (SL)", isEarnLeave: "No", leaveQty: 14, cfQty: 0, countBasedOnJoinDate: "No", holidayCount: "No", leaveOnPresent: "No", splitMonthly: "No", maxLeaveInMonth: "", isActive: "Active" },
  { sl: 4, company: "Pakiza Knit Composite Ltd", leaveType: "Maternity Leave (ML)", isEarnLeave: "No", leaveQty: 112, cfQty: 0, countBasedOnJoinDate: "No", holidayCount: "Yes", leaveOnPresent: "No", splitMonthly: "No", maxLeaveInMonth: "", isActive: "Active" },
  { sl: 5, company: "Pakiza Knit Composite Ltd", leaveType: "Paternity Leave (PL)", isEarnLeave: "No", leaveQty: 7, cfQty: 0, countBasedOnJoinDate: "No", holidayCount: "No", leaveOnPresent: "No", splitMonthly: "No", maxLeaveInMonth: "", isActive: "Active" },
  { sl: 6, company: "Pakiza Knit Composite Ltd", leaveType: "Compensatory Leave", isEarnLeave: "No", leaveQty: 5, cfQty: 0, countBasedOnJoinDate: "No", holidayCount: "No", leaveOnPresent: "No", splitMonthly: "No", maxLeaveInMonth: "", isActive: "Active" },
  { sl: 7, company: "Pakiza Knit Composite Ltd", leaveType: "Special Leave", isEarnLeave: "No", leaveQty: 10, cfQty: 0, countBasedOnJoinDate: "No", holidayCount: "No", leaveOnPresent: "No", splitMonthly: "No", maxLeaveInMonth: "", isActive: "Active" },
  { sl: 8, company: "Pakiza Knit Composite Ltd", leaveType: "Study Leave", isEarnLeave: "No", leaveQty: 30, cfQty: 0, countBasedOnJoinDate: "No", holidayCount: "No", leaveOnPresent: "No", splitMonthly: "No", maxLeaveInMonth: "", isActive: "Active" },
  { sl: 9, company: "Pakiza Knit Composite Ltd", leaveType: "Unpaid Leave (LWP)", isEarnLeave: "No", leaveQty: 90, cfQty: 0, countBasedOnJoinDate: "No", holidayCount: "No", leaveOnPresent: "No", splitMonthly: "No", maxLeaveInMonth: "", isActive: "Active" },
  { sl: 10, company: "Pakiza Knit Composite Ltd", leaveType: "Festival Special Leave", isEarnLeave: "No", leaveQty: 3, cfQty: 0, countBasedOnJoinDate: "No", holidayCount: "No", leaveOnPresent: "No", splitMonthly: "No", maxLeaveInMonth: "", isActive: "Active" },
  { sl: 11, company: "Pakiza Knit Composite Ltd", leaveType: "Hajj Leave", isEarnLeave: "No", leaveQty: 40, cfQty: 0, countBasedOnJoinDate: "No", holidayCount: "Yes", leaveOnPresent: "No", splitMonthly: "No", maxLeaveInMonth: "", isActive: "Active" },
  { sl: 12, company: "Pakiza Knit Composite Ltd", leaveType: "Marriage Leave", isEarnLeave: "No", leaveQty: 5, cfQty: 0, countBasedOnJoinDate: "No", holidayCount: "No", leaveOnPresent: "No", splitMonthly: "No", maxLeaveInMonth: "", isActive: "Active" },
  { sl: 13, company: "Pakiza Knit Composite Ltd", leaveType: "Bereavement Leave", isEarnLeave: "No", leaveQty: 3, cfQty: 0, countBasedOnJoinDate: "No", holidayCount: "No", leaveOnPresent: "No", splitMonthly: "No", maxLeaveInMonth: "", isActive: "Active" },
  { sl: 14, company: "Pakiza Knit Composite Ltd", leaveType: "Injury Leave", isEarnLeave: "No", leaveQty: 45, cfQty: 0, countBasedOnJoinDate: "No", holidayCount: "No", leaveOnPresent: "No", splitMonthly: "No", maxLeaveInMonth: "", isActive: "Active" },
  { sl: 15, company: "Pakiza Knit Composite Ltd", leaveType: "Quarantine Leave", isEarnLeave: "No", leaveQty: 14, cfQty: 0, countBasedOnJoinDate: "No", holidayCount: "No", leaveOnPresent: "No", splitMonthly: "No", maxLeaveInMonth: "", isActive: "Active" },
  { sl: 16, company: "Pakiza Knit Composite Ltd", leaveType: "Emergency Medical", isEarnLeave: "No", leaveQty: 10, cfQty: 0, countBasedOnJoinDate: "No", holidayCount: "No", leaveOnPresent: "No", splitMonthly: "No", maxLeaveInMonth: "", isActive: "Active" },
  { sl: 17, company: "Pakiza Knit Composite Ltd", leaveType: "Advance Leave", isEarnLeave: "No", leaveQty: 5, cfQty: 0, countBasedOnJoinDate: "No", holidayCount: "No", leaveOnPresent: "No", splitMonthly: "No", maxLeaveInMonth: "", isActive: "Active" },
  { sl: 18, company: "Pakiza Knit Composite Ltd", leaveType: "Annual Leave", isEarnLeave: "Yes", leaveQty: 15, cfQty: 5, countBasedOnJoinDate: "Yes", holidayCount: "No", leaveOnPresent: "No", splitMonthly: "No", maxLeaveInMonth: "", isActive: "Active" },
  { sl: 19, company: "Pakiza Knit Composite Ltd", leaveType: "Pooja Special Leave", isEarnLeave: "No", leaveQty: 3, cfQty: 0, countBasedOnJoinDate: "No", holidayCount: "No", leaveOnPresent: "No", splitMonthly: "No", maxLeaveInMonth: "", isActive: "Active" },
  { sl: 20, company: "Pakiza Knit Composite Ltd", leaveType: "Christmas Leave", isEarnLeave: "No", leaveQty: 3, cfQty: 0, countBasedOnJoinDate: "No", holidayCount: "No", leaveOnPresent: "No", splitMonthly: "No", maxLeaveInMonth: "", isActive: "Active" }
];

const DEFAULT_POLICIES: PolicyNameItem[] = [
  { sl: 1, name: "Attendance Standard Policy", description: "Late-in and early-out guidelines", isActive: "Active" },
  { sl: 2, name: "Code of Conduct", description: "Standard ethical behavioral rules", isActive: "Active" },
  { sl: 3, name: "Overtime (OT) Policy", description: "Regulations regarding extra hours calculation", isActive: "Active" },
  { sl: 4, name: "Safety & Fire Protection", description: "Emergency exit and safety procedures", isActive: "Active" },
  { sl: 5, name: "Anti-Harassment Policy", description: "Preventing workplace harassment and bullying", isActive: "Active" },
  { sl: 6, name: "Mobile Phone Usage Policy", description: "Rules regarding personal devices on shop floor", isActive: "Active" },
  { sl: 7, name: "Shift Rotation Policy", description: "Rules for roster schedule changing", isActive: "Active" },
  { sl: 8, name: "Deduction and Fine Policy", description: "Guidelines for unauthorized absence", isActive: "Active" },
  { sl: 9, name: "Uniform & Dress Code", description: "Standard company attire rules", isActive: "Active" },
  { sl: 10, name: "Maternity Benefit Policy", description: "Legal leave and payment benefits guide", isActive: "Active" },
  { sl: 11, name: "Performance Bonus Rules", description: "Incentive parameters based on efficiency", isActive: "Active" },
  { sl: 12, name: "Data Security Policy", description: "Handling of company confidential files", isActive: "Active" },
  { sl: 13, name: "Leave Encashment Rules", description: "Rules to convert unused EL to cash", isActive: "Active" },
  { sl: 14, name: "Substance Abuse Policy", description: "Zero tolerance for drugs and alcohol", isActive: "Active" },
  { sl: 15, name: "IT Assets Policy", description: "Proper usage guidelines for laptop/PCs", isActive: "Active" },
  { sl: 16, name: "Grievance Redressal", description: "Standard mechanism for worker complaints", isActive: "Active" },
  { sl: 17, name: "Welfare Fund Policy", description: "Rules regarding worker emergency financial aid", isActive: "Active" },
  { sl: 18, name: "Festival Bonus Policy", description: "Eligibility criteria for festive allowances", isActive: "Active" },
  { sl: 19, name: "Environmental & Waste Policy", description: "Sustainability guidelines for disposal", isActive: "Active" },
  { sl: 20, name: "Workplace Health & Hygiene", description: "Medical center and washroom hygiene standard", isActive: "Active" }
];

function PoliciesSetupPage() {
  const [activeTab, setActiveTab] = useState<TabType>("leave");
  const [searchQuery, setSearchQuery] = useState("");

  // Lists state
  const [leaves, setLeaves] = useState<LeaveSetting[]>([]);
  const [policies, setPolicies] = useState<PolicyNameItem[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as TabType;
      if (tabParam && ["leave", "policyName"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }

    const safeParse = (key: string, defaultVal: any) => {
      const saved = localStorage.getItem(key);
      if (!saved) return defaultVal;
      try {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) return defaultVal;
        // Override if stored array is shorter than default to force load expanded mock data
        if (parsed.length < defaultVal.length) {
          return defaultVal;
        }
        return parsed;
      } catch (e) {
        return defaultVal;
      }
    };

    // Leave Settings
    const leavesData = safeParse("hris_leave_settings", DEFAULT_LEAVES);
    setLeaves(leavesData);
    localStorage.setItem("hris_leave_settings", JSON.stringify(leavesData));

    // Policy Names
    const policiesData = safeParse("hris_policy_names", DEFAULT_POLICIES);
    setPolicies(policiesData);
    localStorage.setItem("hris_policy_names", JSON.stringify(policiesData));
  }, []);

  // Modal controls
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editSl, setEditSl] = useState<number | null>(null);

  // Form states - Leave Setting
  const [leaveCompany, setLeaveCompany] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [isEarnLeave, setIsEarnLeave] = useState<"Yes" | "No">("No");
  const [leaveQty, setLeaveQty] = useState<number>(0);
  const [cfQty, setCfQty] = useState<number>(0);
  const [countBasedOnJoinDate, setCountBasedOnJoinDate] = useState<"Yes" | "No">("No");
  const [holidayCount, setHolidayCount] = useState<"Yes" | "No">("No");
  const [leaveOnPresent, setLeaveOnPresent] = useState<"Yes" | "No">("No");
  const [splitMonthly, setSplitMonthly] = useState<"Yes" | "No">("No");
  const [maxLeaveInMonth, setMaxLeaveInMonth] = useState("");
  const [leaveIsActive, setLeaveIsActive] = useState<"Active" | "Inactive">("Active");

  // Form states - Policy Name
  const [polName, setPolName] = useState("");
  const [polDesc, setPolDesc] = useState("");
  const [polIsActive, setPolIsActive] = useState<"Active" | "Inactive">("Active");

  const openForm = (sl: number | null) => {
    setEditSl(sl);
    if (activeTab === "leave") {
      const item = leaves.find(l => l.sl === sl);
      setLeaveCompany(item?.company || "");
      setLeaveType(item?.leaveType || "");
      setIsEarnLeave(item?.isEarnLeave || "No");
      setLeaveQty(item?.leaveQty || 0);
      setCfQty(item?.cfQty || 0);
      setCountBasedOnJoinDate(item?.countBasedOnJoinDate || "No");
      setHolidayCount(item?.holidayCount || "No");
      setLeaveOnPresent(item?.leaveOnPresent || "No");
      setSplitMonthly(item?.splitMonthly || "No");
      setMaxLeaveInMonth(item?.maxLeaveInMonth || "");
      setLeaveIsActive(item?.isActive || "Active");
    } else if (activeTab === "policyName") {
      const item = policies.find(p => p.sl === sl);
      setPolName(item?.name || "");
      setPolDesc(item?.description || "");
      setPolIsActive(item?.isActive || "Active");
    }
    setIsFormOpen(true);
  };

  const handleDelete = (sl: number) => {
    if (!confirm("Are you sure you want to delete this setting?")) return;

    if (activeTab === "leave") {
      const updated = leaves.filter(l => l.sl !== sl).map((l, idx) => ({ ...l, sl: idx + 1 }));
      setLeaves(updated);
      localStorage.setItem("hris_leave_settings", JSON.stringify(updated));
    } else if (activeTab === "policyName") {
      const updated = policies.filter(p => p.sl !== sl).map((p, idx) => ({ ...p, sl: idx + 1 }));
      setPolicies(updated);
      localStorage.setItem("hris_policy_names", JSON.stringify(updated));
    }

    toast.success("Deleted successfully");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "leave") {
      if (!leaveType) { toast.error("Leave Type is required."); return; }
      let nextList = [...leaves];
      if (editSl !== null) {
        nextList = leaves.map(l => l.sl === editSl ? { ...l, company: leaveCompany, leaveType, isEarnLeave, leaveQty: Number(leaveQty), cfQty: Number(cfQty), countBasedOnJoinDate, holidayCount, leaveOnPresent, splitMonthly, maxLeaveInMonth, isActive: leaveIsActive } : l);
      } else {
        const sl = leaves.length > 0 ? Math.max(...leaves.map(l => l.sl)) + 1 : 1;
        nextList.push({ sl, company: leaveCompany, leaveType, isEarnLeave, leaveQty: Number(leaveQty), cfQty: Number(cfQty), countBasedOnJoinDate, holidayCount, leaveOnPresent, splitMonthly, maxLeaveInMonth, isActive: leaveIsActive });
      }
      setLeaves(nextList);
      localStorage.setItem("hris_leave_settings", JSON.stringify(nextList));
    } else if (activeTab === "policyName") {
      if (!polName) { toast.error("Policy Name is required."); return; }
      let nextList = [...policies];
      if (editSl !== null) {
        nextList = policies.map(p => p.sl === editSl ? { ...p, name: polName, description: polDesc, isActive: polIsActive } : p);
      } else {
        const sl = policies.length > 0 ? Math.max(...policies.map(p => p.sl)) + 1 : 1;
        nextList.push({ sl, name: polName, description: polDesc, isActive: polIsActive });
      }
      setPolicies(nextList);
      localStorage.setItem("hris_policy_names", JSON.stringify(nextList));
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
    { type: "leave", label: "Leave Setting", icon: Calendar },
    { type: "policyName", label: "Policy Name", icon: ShieldAlert }
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
                <span className="text-primary font-black">Leave & Policies</span>
              </div>
              <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                <ShieldAlert className="size-5.5 text-primary" />
                Leave & Policies Configuration
              </h1>
            </div>
            <button 
              onClick={() => openForm(null)}
              className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-black text-xs hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center gap-2 uppercase tracking-wide"
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
          </div>          {/* Master Table Router */}
          <div className="bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              
              {activeTab === "leave" && (
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap" style={{ minWidth: "1200px" }}>
                  <thead className="text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                    <tr className="bg-[#f8fafc] dark:bg-[#0f172a]">
                      <th className="sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">#</th>
                      <th className="sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">Actions</th>
                      <th className="px-5 py-4 min-w-[200px]">Company</th>
                      <th className="px-5 py-4 w-[120px]">Leave Type</th>
                      <th className="px-5 py-4 w-[120px] text-center">Is Earn Leave</th>
                      <th className="px-5 py-4 w-[120px] text-center">Leave Quantity</th>
                      <th className="px-5 py-4 w-[120px] text-center">CF Quantity</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {leaves.filter(l => (l.leaveType || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                      <tr key={item.sl} className="group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all">
                        <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">{idx + 1}</td>
                        <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => openForm(item.sl)} className="text-orange-500 hover:text-orange-600 transition"><Pencil className="size-4" /></button>
                            <button onClick={() => handleDelete(item.sl)} className="text-red-500 hover:text-red-650 transition"><Trash2 className="size-4" /></button>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100">{item.company || "—"}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">{item.leaveType}</td>
                        <td className="px-5 py-3.5 text-center font-normal">{item.isEarnLeave}</td>
                        <td className="px-5 py-3.5 text-center font-normal font-mono">{item.leaveQty}</td>
                        <td className="px-5 py-3.5 text-center font-normal font-mono">{item.cfQty}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}>{item.isActive}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "policyName" && (
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap" style={{ minWidth: "800px" }}>
                  <thead className="text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                    <tr className="bg-[#f8fafc] dark:bg-[#0f172a]">
                      <th className="sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">#</th>
                      <th className="sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">Actions</th>
                      <th className="px-5 py-4 min-w-[200px]">Policy Name</th>
                      <th className="px-5 py-4 min-w-[300px]">Description</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {policies.filter(p => (p.name || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                      <tr key={item.sl} className="group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all">
                        <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">{idx + 1}</td>
                        <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => openForm(item.sl)} className="text-orange-500 hover:text-orange-600 transition"><Pencil className="size-4" /></button>
                            <button onClick={() => handleDelete(item.sl)} className="text-red-500 hover:text-red-650 transition"><Trash2 className="size-4" /></button>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100">{item.name}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">{item.description || "—"}</td>
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
                    <ShieldAlert className="size-5" />
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
                
                {activeTab === "leave" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Company</label>
                      <input type="text" placeholder="Company" value={leaveCompany} onChange={e => setLeaveCompany(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Leave Type *</label>
                      <input type="text" placeholder="e.g. CL, EL, SL" value={leaveType} onChange={e => setLeaveType(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Is Earn Leave *</label>
                      <select value={isEarnLeave} onChange={e => setIsEarnLeave(e.target.value as any)} className={insetSelectClass}>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Leave Quantity *</label>
                      <input type="number" value={leaveQty} onChange={e => setLeaveQty(Number(e.target.value))} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>CF Quantity *</label>
                      <input type="number" value={cfQty} onChange={e => setCfQty(Number(e.target.value))} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Count Base On Join Date *</label>
                      <select value={countBasedOnJoinDate} onChange={e => setCountBasedOnJoinDate(e.target.value as any)} className={insetSelectClass}>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Holiday Count *</label>
                      <select value={holidayCount} onChange={e => setHolidayCount(e.target.value as any)} className={insetSelectClass}>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Leave On Present *</label>
                      <select value={leaveOnPresent} onChange={e => setLeaveOnPresent(e.target.value as any)} className={insetSelectClass}>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Split Monthly *</label>
                      <select value={splitMonthly} onChange={e => setSplitMonthly(e.target.value as any)} className={insetSelectClass}>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Max Leave in Month</label>
                      <input type="text" value={maxLeaveInMonth} onChange={e => setMaxLeaveInMonth(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={`${insetWrapperClass} sm:col-span-2`}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select value={leaveIsActive} onChange={e => setLeaveIsActive(e.target.value as any)} className={insetSelectClass}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "policyName" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Policy Name *</label>
                      <input type="text" placeholder="Policy Name" value={polName} onChange={e => setPolName(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Description</label>
                      <input type="text" placeholder="Description details" value={polDesc} onChange={e => setPolDesc(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select value={polIsActive} onChange={e => setPolIsActive(e.target.value as any)} className={insetSelectClass}>
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
