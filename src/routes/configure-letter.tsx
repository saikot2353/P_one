import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
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
  Building,
  Banknote,
  FileSignature,
  Eye,
  Settings2,
  X,
  Copy,
  Check,
  Plus,
  Pencil,
  Trash2,
  Globe2,
  Image as ImageIcon,
  LayoutTemplate
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
  | "global"
  | "offer"
  | "joining"
  | "appointment"
  | "resignation"
  | "confirmation"
  | "experience"
  | "noc"
  | "salary";

interface PageMargins {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface GlobalConfig {
  headerImage: string | null;
  footerImage: string | null;
  margins: PageMargins;
}

interface LetterTemplate {
  id: string;
  type: LetterType;
  title: string;
  body: string;
  isActive: boolean;
}

const DEFAULT_MARGINS: PageMargins = { top: 40, bottom: 40, left: 40, right: 40 };
const DEFAULT_GLOBAL: GlobalConfig = { headerImage: null, footerImage: null, margins: DEFAULT_MARGINS };
const DEFAULT_TEMPLATES: LetterTemplate[] = [
  { id: "1", type: "offer", title: "Standard Offer Letter", body: "<p>Dear <strong>{{EmployeeName}}</strong>,</p><p><br></p><p>We are pleased to offer you the position of <strong>{{Designation}}</strong> in the <strong>{{Department}}</strong> department.</p>", isActive: true },
];

const TABS: { type: LetterType; label: string; icon: any }[] = [
  { type: "global", label: "Global Config", icon: Globe2 },
  { type: "offer", label: "Offer", icon: Mail },
  { type: "joining", label: "Joining", icon: Briefcase },
  { type: "appointment", label: "Appointment", icon: FileSignature },
  { type: "resignation", label: "Resignation", icon: LogOut },
  { type: "confirmation", label: "Confirmation", icon: CheckCircle },
  { type: "experience", label: "Experience", icon: Award },
  { type: "noc", label: "NOC", icon: Building },
  { type: "salary", label: "Salary", icon: Banknote },
];

const PLACEHOLDER_CATEGORIES = [
  { name: "Employee", items: ["{{EmployeeName}}", "{{EmployeeID}}", "{{Designation}}", "{{Department}}", "{{Grade}}"] },
  { name: "Salary", items: ["{{BasicSalary}}", "{{GrossSalary}}", "{{HouseRent}}", "{{Medical}}", "{{Conveyance}}"] },
  { name: "Dates", items: ["{{CurrentDate}}", "{{JoiningDate}}", "{{ConfirmationDate}}", "{{LastDate}}"] },
  { name: "Company", items: ["{{CompanyName}}", "{{CompanyAddress}}", "{{AuthorizedSignatory}}"] }
];

const dummyData: Record<string, string> = {
  "{{EmployeeName}}": "John Doe",
  "{{EmployeeID}}": "EMP-2024-001",
  "{{Designation}}": "Senior Software Engineer",
  "{{Department}}": "Engineering",
  "{{Grade}}": "Grade 4",
  "{{BasicSalary}}": "BDT 50,000",
  "{{GrossSalary}}": "BDT 90,000",
  "{{HouseRent}}": "BDT 25,000",
  "{{Medical}}": "BDT 5,000",
  "{{Conveyance}}": "BDT 10,000",
  "{{CurrentDate}}": new Date().toLocaleDateString('en-GB'),
  "{{JoiningDate}}": "15-Aug-2024",
  "{{ConfirmationDate}}": "15-Feb-2025",
  "{{LastDate}}": "31-Dec-2024",
  "{{CompanyName}}": "CRIPTON Technologies Ltd.",
  "{{CompanyAddress}}": "Level 4, Tech Park, Banani, Dhaka",
  "{{AuthorizedSignatory}}": "Jane Smith, HR Director",
};

function LetterSetupPage() {
  const [activeTab, setActiveTab] = useState<LetterType>("global");
  const [globalConfig, setGlobalConfig] = useState<GlobalConfig>(DEFAULT_GLOBAL);
  const [templates, setTemplates] = useState<LetterTemplate[]>(DEFAULT_TEMPLATES);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [currentEditConfig, setCurrentEditConfig] = useState<LetterTemplate | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<LetterTemplate | null>(null);
  const [copiedPlaceholder, setCopiedPlaceholder] = useState<string | null>(null);

  useEffect(() => {
    const savedGlobal = localStorage.getItem("hris_letter_global_config");
    const savedTemplates = localStorage.getItem("hris_letter_templates");
    if (savedGlobal) try { setGlobalConfig(JSON.parse(savedGlobal)); } catch (e) {}
    if (savedTemplates) try { setTemplates(JSON.parse(savedTemplates)); } catch (e) {}
  }, []);

  const handleGlobalImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: "headerImage" | "footerImage") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setGlobalConfig(prev => ({ ...prev, [field]: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSaveGlobal = () => {
    localStorage.setItem("hris_letter_global_config", JSON.stringify(globalConfig));
    toast.success(`Global settings saved successfully!`);
  };

  const handleSaveTemplate = () => {
    if (!currentEditConfig) return;
    let updatedTemplates = [...templates];
    if (editingTemplateId) {
      updatedTemplates = updatedTemplates.map(t => t.id === editingTemplateId ? currentEditConfig : t);
    } else {
      updatedTemplates.push(currentEditConfig);
    }
    setTemplates(updatedTemplates);
    localStorage.setItem("hris_letter_templates", JSON.stringify(updatedTemplates));
    setEditingTemplateId(null);
    setCurrentEditConfig(null);
    toast.success(`Template saved successfully!`);
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      const updated = templates.filter(t => t.id !== id);
      setTemplates(updated);
      localStorage.setItem("hris_letter_templates", JSON.stringify(updated));
      toast.success("Template deleted!");
    }
  };

  const createNewTemplate = () => {
    const newTemplate: LetterTemplate = {
      id: Date.now().toString(),
      type: activeTab,
      title: "Untitled Template",
      body: "",
      isActive: true,
    };
    setEditingTemplateId("");
    setCurrentEditConfig(newTemplate);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPlaceholder(text);
    setTimeout(() => setCopiedPlaceholder(null), 1500);
    toast.success(`Copied ${text}`);
  };

  const getPreviewBody = (html: string) => {
    let result = html || "";
    Object.keys(dummyData).forEach(key => {
      result = result.replace(new RegExp(key, 'g'), dummyData[key]);
    });
    return result;
  };

  const activeTemplates = templates.filter(t => t.type === activeTab);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAFA] dark:bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-hidden">
        <Topbar />

        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 space-y-8 max-w-[1600px] mx-auto w-full">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-2">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-3" />
                <span>Configure</span>
                <ChevronRight className="size-3" />
                <span className="text-primary">Letter Setup</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
                  <LayoutTemplate className="size-7 md:size-8" />
                </div>
                Letter Templates
              </h1>
              <p className="text-muted-foreground text-sm max-w-2xl mt-2 font-medium">
                Design and manage beautiful, dynamic templates for all your HR communications. 
                Start by setting your global letterhead, then create specific templates.
              </p>
            </div>

            <div className="flex shrink-0">
              {activeTab === "global" ? (
                <button
                  onClick={handleSaveGlobal}
                  className="h-11 px-6 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-[0_8px_16px_-6px_rgba(var(--primary),0.4)] hover:shadow-[0_12px_20px_-6px_rgba(var(--primary),0.5)] transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                >
                  <Save className="size-4.5" /> Save Global Settings
                </button>
              ) : currentEditConfig ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setPreviewTemplate(currentEditConfig); setIsPreviewOpen(true); }}
                    className="h-11 px-6 rounded-2xl bg-white dark:bg-card border-2 border-border/50 text-foreground font-bold text-sm shadow-sm hover:border-primary/30 hover:bg-muted/50 transition-all flex items-center gap-2"
                  >
                    <Eye className="size-4.5" /> Preview
                  </button>
                  <button
                    onClick={handleSaveTemplate}
                    className="h-11 px-6 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-[0_8px_16px_-6px_rgba(var(--primary),0.4)] hover:-translate-y-0.5 transition-all flex items-center gap-2"
                  >
                    <Save className="size-4.5" /> Save Template
                  </button>
                </div>
              ) : (
                <button
                  onClick={createNewTemplate}
                  className="h-11 px-6 rounded-2xl bg-foreground text-background font-bold text-sm shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="size-4.5" /> New {TABS.find(t => t.type === activeTab)?.label}
                </button>
              )}
            </div>
          </div>

          {/* Horizontal Navigation Pills */}
          {!currentEditConfig && (
            <div className="flex overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4 md:mx-0 md:px-0">
              <div className="flex items-center gap-2 bg-white dark:bg-card p-1.5 rounded-2xl border border-border/40 shadow-sm w-max">
                {TABS.map((tab) => {
                  const TabIcon = tab.icon;
                  const isActive = activeTab === tab.type;
                  const isGlobal = tab.type === "global";
                  return (
                    <button
                      key={tab.type}
                      onClick={() => { setActiveTab(tab.type); setEditingTemplateId(null); setCurrentEditConfig(null); }}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap relative ${
                        isActive
                          ? isGlobal 
                            ? "bg-foreground text-background shadow-md" 
                            : "bg-primary text-primary-foreground shadow-md"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <TabIcon className={`size-4.5 ${isActive ? "" : "opacity-70"}`} />
                      {tab.label}
                      
                      {!isGlobal && (
                        <span className={`ml-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-black ${isActive ? 'bg-black/20 text-white' : 'bg-muted-foreground/10 text-muted-foreground'}`}>
                          {templates.filter(t => t.type === tab.type).length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Workspace Area */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* 1. GLOBAL SETTINGS */}
            {activeTab === "global" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                
                {/* Image Uploads */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white dark:bg-card rounded-3xl border border-border/40 shadow-xl shadow-black/5 overflow-hidden">
                    <div className="px-6 py-5 border-b border-border/40 bg-muted/20 flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <ImageIcon className="size-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-foreground">Official Stationeries</h2>
                        <p className="text-xs text-muted-foreground font-medium">Upload high-quality PNGs with transparent backgrounds.</p>
                      </div>
                    </div>
                    
                    <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Header Upload */}
                      <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-foreground/80 flex items-center gap-2">
                          Letterhead (Top)
                        </label>
                        <div className="group relative rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-colors bg-muted/10 hover:bg-primary/5 flex flex-col items-center justify-center min-h-[200px] overflow-hidden">
                          <input type="file" accept="image/*" onChange={(e) => handleGlobalImageUpload(e, "headerImage")} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                          
                          {globalConfig.headerImage ? (
                            <img src={globalConfig.headerImage} alt="Header" className="w-full h-full object-contain p-4 absolute inset-0 z-10" />
                          ) : (
                            <div className="flex flex-col items-center gap-3 p-6 text-center z-10 pointer-events-none">
                              <div className="size-12 rounded-full bg-background shadow-sm flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all">
                                <Upload className="size-5" />
                              </div>
                              <span className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">Drag & drop or click</span>
                            </div>
                          )}

                          {globalConfig.headerImage && (
                            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-30 flex items-center justify-center gap-3">
                              <span className="text-sm font-bold text-foreground pointer-events-none">Change</span>
                              <button onClick={(e) => { e.preventDefault(); setGlobalConfig(prev => ({...prev, headerImage: null}))}} className="p-2 bg-rose-500 text-white rounded-xl hover:scale-110 transition-transform relative z-40">
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer Upload */}
                      <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-foreground/80 flex items-center gap-2">
                          Signatures (Bottom)
                        </label>
                        <div className="group relative rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-colors bg-muted/10 hover:bg-primary/5 flex flex-col items-center justify-center min-h-[200px] overflow-hidden">
                          <input type="file" accept="image/*" onChange={(e) => handleGlobalImageUpload(e, "footerImage")} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                          
                          {globalConfig.footerImage ? (
                            <img src={globalConfig.footerImage} alt="Footer" className="w-full h-full object-contain p-4 absolute inset-0 z-10" />
                          ) : (
                            <div className="flex flex-col items-center gap-3 p-6 text-center z-10 pointer-events-none">
                              <div className="size-12 rounded-full bg-background shadow-sm flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all">
                                <Upload className="size-5" />
                              </div>
                              <span className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">Drag & drop or click</span>
                            </div>
                          )}

                          {globalConfig.footerImage && (
                            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-30 flex items-center justify-center gap-3">
                              <span className="text-sm font-bold text-foreground pointer-events-none">Change</span>
                              <button onClick={(e) => { e.preventDefault(); setGlobalConfig(prev => ({...prev, footerImage: null}))}} className="p-2 bg-rose-500 text-white rounded-xl hover:scale-110 transition-transform relative z-40">
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Print Margins */}
                <div className="lg:col-span-1">
                  <div className="bg-white dark:bg-card rounded-3xl border border-border/40 shadow-xl shadow-black/5 overflow-hidden sticky top-6">
                    <div className="px-6 py-5 border-b border-border/40 bg-muted/20 flex items-center gap-3">
                      <div className="p-2 bg-foreground text-background rounded-lg">
                        <Settings2 className="size-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-foreground">Print Margins</h2>
                        <p className="text-xs text-muted-foreground font-medium">Spacing for physical prints.</p>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-2 gap-5">
                        {['top', 'bottom', 'left', 'right'].map((dir) => (
                          <div key={dir} className="space-y-1.5 relative group">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{dir} (px)</label>
                            <input 
                              type="number" 
                              value={globalConfig.margins[dir as keyof PageMargins]}
                              onChange={(e) => setGlobalConfig({ ...globalConfig, margins: { ...globalConfig.margins, [dir]: parseInt(e.target.value) || 0 }})}
                              className="w-full h-11 px-4 rounded-xl border-2 border-border bg-muted/30 text-sm font-bold focus:border-primary focus:bg-background outline-none transition-all group-hover:border-primary/40"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium leading-relaxed">
                          Adjust these margins to ensure your dynamic body text perfectly fits between the physical pre-printed letterhead and footer when printing on A4 paper.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 2. TEMPLATE LIST VIEW */}
            {activeTab !== "global" && !currentEditConfig && (
              <div className="space-y-6">
                
                {activeTemplates.length === 0 ? (
                  <div className="bg-white dark:bg-card rounded-3xl border border-border/40 shadow-xl shadow-black/5 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                    <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                      <LayoutTemplate className="size-10" />
                    </div>
                    <h2 className="text-2xl font-black text-foreground mb-2">No Templates Yet</h2>
                    <p className="text-muted-foreground font-medium max-w-sm mb-8">
                      You haven't created any {TABS.find(t => t.type === activeTab)?.label} templates. Create one now to get started.
                    </p>
                    <button
                      onClick={createNewTemplate}
                      className="h-12 px-8 rounded-2xl bg-foreground text-background font-bold text-sm shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2"
                    >
                      <Plus className="size-5" /> Create First Template
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {activeTemplates.map(template => (
                      <div key={template.id} className="group bg-white dark:bg-card rounded-3xl border border-border/40 shadow-lg shadow-black/5 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">
                        
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex items-start justify-between mb-4 gap-4">
                            <h3 className="font-bold text-lg leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                              {template.title}
                            </h3>
                            <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase shrink-0 ${template.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                              {template.isActive ? 'Active' : 'Draft'}
                            </div>
                          </div>
                          
                          <div className="relative flex-1 mb-2">
                            <div className="text-xs text-muted-foreground line-clamp-4 leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity" dangerouslySetInnerHTML={{ __html: template.body || "<em>No content...</em>" }} />
                            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white dark:from-card to-transparent pointer-events-none" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 border-t border-border/40 bg-muted/10 divide-x divide-border/40">
                          <button onClick={() => { setEditingTemplateId(template.id); setCurrentEditConfig(template); }} className="p-4 flex flex-col items-center gap-1.5 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors font-semibold text-[11px] uppercase tracking-widest">
                            <Pencil className="size-4" /> Edit
                          </button>
                          <button onClick={() => { setPreviewTemplate(template); setIsPreviewOpen(true); }} className="p-4 flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors font-semibold text-[11px] uppercase tracking-widest">
                            <Eye className="size-4" /> Preview
                          </button>
                          <button onClick={() => handleDeleteTemplate(template.id)} className="p-4 flex flex-col items-center gap-1.5 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/5 transition-colors font-semibold text-[11px] uppercase tracking-widest">
                            <Trash2 className="size-4" /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. TEMPLATE EDITOR VIEW */}
            {activeTab !== "global" && currentEditConfig && (
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 md:gap-8">
                
                {/* Editor Container */}
                <div className="xl:col-span-3 space-y-6">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => { setEditingTemplateId(null); setCurrentEditConfig(null); }}
                      className="size-10 rounded-full bg-white dark:bg-card border border-border/50 text-foreground hover:bg-muted flex items-center justify-center shadow-sm transition-all"
                    >
                      <ChevronRight className="size-5 rotate-180" />
                    </button>
                    <div className="flex-1 bg-white dark:bg-card rounded-2xl border border-border/40 shadow-sm px-4 py-2 flex items-center focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                      <input
                        type="text"
                        value={currentEditConfig.title}
                        onChange={(e) => setCurrentEditConfig({ ...currentEditConfig, title: e.target.value })}
                        className="w-full bg-transparent border-0 outline-none text-xl font-bold text-foreground p-0 placeholder:text-muted-foreground/40"
                        placeholder="Template Title..."
                      />
                    </div>
                    <button
                      onClick={() => setCurrentEditConfig(prev => prev ? ({ ...prev, isActive: !prev.isActive }) : null)}
                      className={`relative flex items-center gap-3 px-4 h-12 rounded-2xl border transition-all ${currentEditConfig.isActive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' : 'bg-card border-border/40 text-muted-foreground hover:bg-muted'}`}
                    >
                      <div className={`relative inline-flex h-5 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${currentEditConfig.isActive ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`}>
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${currentEditConfig.isActive ? 'translate-x-2' : '-translate-x-2'}`} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider">{currentEditConfig.isActive ? 'Active' : 'Draft'}</span>
                    </button>
                  </div>

                  <div className="bg-white dark:bg-card rounded-3xl border border-border/40 shadow-xl shadow-black/5 overflow-hidden flex flex-col editor-wrapper relative">
                    
                    {/* Custom styling to make ReactQuill beautiful and borderless */}
                    <style dangerouslySetInnerHTML={{__html:`
                      .editor-wrapper .ql-toolbar {
                        border: none !important;
                        border-bottom: 1px solid hsl(var(--border) / 0.4) !important;
                        background: hsl(var(--muted) / 0.3);
                        padding: 12px 20px !important;
                        border-top-left-radius: 24px;
                        border-top-right-radius: 24px;
                      }
                      .editor-wrapper .ql-container {
                        border: none !important;
                        font-size: 15px;
                        font-family: inherit;
                      }
                      .editor-wrapper .ql-editor {
                        min-height: 550px;
                        padding: 32px 40px;
                        line-height: 1.7;
                      }
                      .editor-wrapper .ql-editor:focus {
                        box-shadow: inset 0 0 0 2px hsl(var(--primary) / 0.1);
                      }
                    `}} />
                    
                    <ReactQuill 
                      theme="snow" 
                      value={currentEditConfig.body} 
                      onChange={(val) => setCurrentEditConfig(prev => prev ? ({ ...prev, body: val }) : null)}
                      modules={modules}
                      placeholder="Start writing the letter content here..."
                    />
                  </div>
                </div>

                {/* Right sidebar: Placeholders */}
                <div className="xl:col-span-1">
                  <div className="bg-white dark:bg-card/80 backdrop-blur-xl rounded-3xl border border-border/40 shadow-xl shadow-black/5 overflow-hidden sticky top-6 max-h-[calc(100vh-120px)] flex flex-col">
                    <div className="px-6 py-5 border-b border-border/40 bg-primary/5 flex items-center gap-3">
                      <div className="p-2 bg-primary/20 text-primary rounded-lg">
                        <Copy className="size-4.5" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-foreground">Data Tags</h2>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black mt-0.5">Click to copy</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-5 space-y-6 hide-scrollbar">
                      {PLACEHOLDER_CATEGORIES.map((category) => (
                        <div key={category.name} className="space-y-3">
                          <h4 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <span className="h-px bg-border flex-1"></span>
                            {category.name}
                            <span className="h-px bg-border flex-1"></span>
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {category.items.map(ph => (
                              <button
                                key={ph}
                                onClick={() => copyToClipboard(ph)}
                                className={`text-[11px] px-3 py-1.5 rounded-xl font-mono transition-all border ${
                                  copiedPlaceholder === ph 
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-bold scale-105 shadow-sm"
                                  : "bg-muted/40 text-muted-foreground border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30 hover:-translate-y-0.5"
                                }`}
                              >
                                {copiedPlaceholder === ph && <Check className="size-3 inline mr-1" />}
                                {ph}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Live A4 Preview Modal */}
        {isPreviewOpen && previewTemplate && (
          <div className="fixed inset-0 z-[100] bg-foreground/20 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-muted/40 w-full max-w-5xl h-full max-h-[95vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden relative border border-white/20">
              
              {/* Modal Controls */}
              <div className="absolute top-6 right-6 z-10 flex gap-3">
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="size-12 rounded-full bg-white text-foreground hover:bg-muted flex items-center justify-center shadow-xl hover:scale-110 transition-all border border-border"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-10 flex items-start justify-center pt-24 md:pt-10">
                {/* A4 Paper Container - 210x297mm aspect ratio */}
                <div 
                  className="bg-white shadow-2xl relative w-[210mm] min-h-[297mm] flex flex-col mx-auto ring-1 ring-border/20"
                  style={{
                    paddingTop: `${globalConfig.margins.top}px`,
                    paddingBottom: `${globalConfig.margins.bottom}px`,
                    paddingLeft: `${globalConfig.margins.left}px`,
                    paddingRight: `${globalConfig.margins.right}px`,
                  }}
                >
                  {/* Header */}
                  {globalConfig.headerImage && (
                    <div className="w-full mb-6 shrink-0 flex justify-center">
                      <img src={globalConfig.headerImage} alt="Header" className="max-w-full max-h-[150px] object-contain" />
                    </div>
                  )}

                  {/* Body Content */}
                  <div 
                    className="flex-1 w-full text-black text-sm leading-[1.6] ql-editor px-0"
                    dangerouslySetInnerHTML={{ __html: getPreviewBody(previewTemplate.body) }}
                  />

                  {/* Footer */}
                  {globalConfig.footerImage && (
                    <div className="w-full mt-auto pt-10 shrink-0 flex justify-center">
                      <img src={globalConfig.footerImage} alt="Footer" className="max-w-full max-h-[100px] object-contain" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
