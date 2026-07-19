import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  FileText,
  Upload,
  Save,
  Mail,
  Briefcase,
  Award,
  LogOut,
  CheckCircle,
  FileSignature,
  Building,
  Banknote,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/configure-letter")({
  head: () => ({
    meta: [
      { title: "Letter Setup — CRIPTON HRIS" },
      {
        name: "description",
        content: "Configure dynamic templates for various HR letters and certificates.",
      },
    ],
  }),
  component: LetterSetupPage,
});

type LetterType = 
  | "offer"
  | "joining"
  | "appointment"
  | "resignation"
  | "confirmation"
  | "experience"
  | "noc"
  | "salary";

interface LetterConfig {
  headerImage: string | null;
  footerImage: string | null;
  title: string;
  body: string;
  isActive: boolean;
}

const DEFAULT_CONFIGS: Record<LetterType, LetterConfig> = {
  offer: { headerImage: null, footerImage: null, title: "Offer Letter", body: "Dear {{EmployeeName}},\n\nWe are pleased to offer you the position of {{Designation}}...", isActive: true },
  joining: { headerImage: null, footerImage: null, title: "Joining Letter", body: "Dear {{EmployeeName}},\n\nWelcome to the company! Your joining date is {{JoiningDate}}...", isActive: true },
  appointment: { headerImage: null, footerImage: null, title: "Appointment Letter", body: "Dear {{EmployeeName}},\n\nThis is to confirm your appointment as {{Designation}}...", isActive: true },
  resignation: { headerImage: null, footerImage: null, title: "Resignation Acceptance", body: "Dear {{EmployeeName}},\n\nWe accept your resignation effective from {{LastDate}}...", isActive: true },
  confirmation: { headerImage: null, footerImage: null, title: "Confirmation Letter", body: "Dear {{EmployeeName}},\n\nCongratulations! Your employment is confirmed...", isActive: true },
  experience: { headerImage: null, footerImage: null, title: "Experience Certificate", body: "To Whom It May Concern,\n\nThis is to certify that {{EmployeeName}} worked as {{Designation}}...", isActive: true },
  noc: { headerImage: null, footerImage: null, title: "NOC Letter", body: "To Whom It May Concern,\n\nThis is a No Objection Certificate for {{EmployeeName}}...", isActive: true },
  salary: { headerImage: null, footerImage: null, title: "Salary Certificate", body: "To Whom It May Concern,\n\nThis is to certify that {{EmployeeName}}'s gross salary is {{Salary}}...", isActive: true },
};

const TABS: { type: LetterType; label: string; icon: any }[] = [
  { type: "offer", label: "Offer Letter", icon: Mail },
  { type: "joining", label: "Joining Letter", icon: Briefcase },
  { type: "appointment", label: "Appointment Letter", icon: FileSignature },
  { type: "resignation", label: "Resignation Letter", icon: LogOut },
  { type: "confirmation", label: "Confirmation Letter", icon: CheckCircle },
  { type: "experience", label: "Experience Certificate", icon: Award },
  { type: "noc", label: "NOC Letter", icon: Building },
  { type: "salary", label: "Salary Certificate", icon: Banknote },
];

function LetterSetupPage() {
  const [activeTab, setActiveTab] = useState<LetterType>("offer");
  const [configs, setConfigs] = useState<Record<LetterType, LetterConfig>>(DEFAULT_CONFIGS);

  // Form state for current tab
  const [currentConfig, setCurrentConfig] = useState<LetterConfig>(DEFAULT_CONFIGS["offer"]);

  useEffect(() => {
    const saved = localStorage.getItem("hris_letter_configs");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfigs(parsed);
        setCurrentConfig(parsed[activeTab] || DEFAULT_CONFIGS[activeTab]);
      } catch (e) {
        console.error("Failed to load letter configs");
      }
    } else {
      setCurrentConfig(DEFAULT_CONFIGS[activeTab]);
    }
  }, []);

  useEffect(() => {
    setCurrentConfig(configs[activeTab] || DEFAULT_CONFIGS[activeTab]);
  }, [activeTab, configs]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: "headerImage" | "footerImage") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentConfig(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedConfigs = { ...configs, [activeTab]: currentConfig };
    setConfigs(updatedConfigs);
    localStorage.setItem("hris_letter_configs", JSON.stringify(updatedConfigs));
    toast.success(`${TABS.find(t => t.type === activeTab)?.label} configuration saved successfully!`);
  };

  const insetWrapperClass =
    "group relative rounded-xl border border-border/80 focus-within:border-primary px-3.5 py-2.5 bg-muted/15 focus-within:bg-card transition-all duration-200";
  const insetLabelClass =
    "text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-1";
  const insetInputClass =
    "w-full bg-transparent border-0 outline-none text-sm font-medium text-foreground focus:ring-0 p-0";
  const insetTextareaClass =
    "w-full bg-transparent border-0 outline-none text-sm font-medium text-foreground focus:ring-0 p-0 resize-none min-h-[250px] leading-relaxed";

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-4 max-w-[1400px] mx-auto w-full">
          {/* Breadcrumb & Header */}
          <div className="bg-card rounded-2xl border border-border/50 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-3.5" />
                <span>Configure</span>
                <ChevronRight className="size-3.5" />
                <span className="text-primary font-bold">Letter Setup</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <FileText className="size-6 text-primary" />
                Dynamic Letter Configuration
              </h1>
            </div>
            <button
              onClick={handleSave}
              className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <Save className="size-4.5" /> Save Configuration
            </button>
          </div>

          {/* Configuration Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Tabs */}
            <div className="lg:col-span-1 bg-card rounded-2xl border border-border/50 shadow-sm p-3 h-fit flex flex-col gap-1">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-2 px-2 pt-2">
                Letter Types
              </h3>
              {TABS.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.type;
                return (
                  <button
                    key={tab.type}
                    onClick={() => setActiveTab(tab.type)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all ${
                      isActive
                        ? "bg-primary/10 text-primary font-bold shadow-xs border border-primary/20"
                        : "bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium border border-transparent"
                    }`}
                  >
                    <TabIcon className={`size-4.5 ${isActive ? "text-primary" : "text-muted-foreground/70"}`} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Editor Area */}
            <div className="lg:col-span-3 bg-card rounded-2xl border border-border/50 shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <FileText className="size-5 text-primary" />
                  {TABS.find(t => t.type === activeTab)?.label} Settings
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">Status:</span>
                  <button
                    onClick={() => setCurrentConfig(prev => ({ ...prev, isActive: !prev.isActive }))}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${currentConfig.isActive ? 'bg-emerald-500' : 'bg-muted'}`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${currentConfig.isActive ? 'translate-x-2' : '-translate-x-2'}`} />
                  </button>
                  <span className={`text-xs font-bold ${currentConfig.isActive ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                    {currentConfig.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Title & Placeholders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={insetWrapperClass}>
                  <label className={insetLabelClass}>Letter Title / Subject</label>
                  <input
                    type="text"
                    value={currentConfig.title}
                    onChange={(e) => setCurrentConfig({ ...currentConfig, title: e.target.value })}
                    className={insetInputClass}
                    placeholder="Enter letter title..."
                  />
                </div>
                
                <div className="bg-primary/5 rounded-xl border border-primary/20 p-3">
                  <label className="text-[10px] font-extrabold text-primary uppercase tracking-wider block mb-1.5">
                    Dynamic Placeholders
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {["{{EmployeeName}}", "{{Designation}}", "{{Department}}", "{{JoiningDate}}", "{{Salary}}"].map(ph => (
                      <span key={ph} className="bg-background border border-border text-[10px] px-2 py-0.5 rounded-md font-mono text-muted-foreground shadow-sm">
                        {ph}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Header Upload */}
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Header Image (Letterhead)
                </label>
                <div className="flex items-start gap-4">
                  <div className="flex-1 border-2 border-dashed border-border/80 rounded-xl p-4 flex flex-col items-center justify-center bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer relative min-h-[100px]">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "headerImage")}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="size-6 text-muted-foreground mb-2" />
                    <span className="text-xs font-semibold text-muted-foreground">Click or drag image to upload header</span>
                  </div>
                  {currentConfig.headerImage && (
                    <div className="w-[150px] h-[100px] rounded-xl border border-border/80 overflow-hidden relative shrink-0">
                      <img src={currentConfig.headerImage} alt="Header Preview" className="w-full h-full object-contain bg-white" />
                      <button 
                        onClick={() => setCurrentConfig(prev => ({ ...prev, headerImage: null }))}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-md hover:bg-red-600 shadow-sm"
                      >
                        <LogOut className="size-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Body Content */}
              <div className={insetWrapperClass}>
                <label className={insetLabelClass}>Body Content (Dynamic)</label>
                <textarea
                  value={currentConfig.body}
                  onChange={(e) => setCurrentConfig({ ...currentConfig, body: e.target.value })}
                  className={insetTextareaClass}
                  placeholder="Start writing the letter content here. Use placeholders like {{EmployeeName}}..."
                />
              </div>

              {/* Footer Upload */}
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Footer Image (Signatures / Info)
                </label>
                <div className="flex items-start gap-4">
                  <div className="flex-1 border-2 border-dashed border-border/80 rounded-xl p-4 flex flex-col items-center justify-center bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer relative min-h-[100px]">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "footerImage")}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="size-6 text-muted-foreground mb-2" />
                    <span className="text-xs font-semibold text-muted-foreground">Click or drag image to upload footer</span>
                  </div>
                  {currentConfig.footerImage && (
                    <div className="w-[150px] h-[100px] rounded-xl border border-border/80 overflow-hidden relative shrink-0">
                      <img src={currentConfig.footerImage} alt="Footer Preview" className="w-full h-full object-contain bg-white" />
                      <button 
                        onClick={() => setCurrentConfig(prev => ({ ...prev, footerImage: null }))}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-md hover:bg-red-600 shadow-sm"
                      >
                        <LogOut className="size-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
