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
  LayoutTemplate,
  ArrowLeft,
  Image as ImageIcon,
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
  {
    id: "1",
    type: "offer",
    title: "Standard Offer Letter",
    body: "<p>Dear <strong>{{EmployeeName}}</strong>,</p><p><br></p><p>We are pleased to offer you the position of <strong>{{Designation}}</strong> in the <strong>{{Department}}</strong> department at <strong>{{CompanyName}}</strong>.</p><p><br></p><p>Your gross monthly salary will be <strong>{{GrossSalary}}</strong>. Your date of joining will be <strong>{{JoiningDate}}</strong>.</p><p><br></p><p>Please sign and return a copy of this letter to confirm your acceptance.</p><p><br></p><p>Sincerely,</p><p><strong>{{AuthorizedSignatory}}</strong></p>",
    isActive: true,
  },
];

const TABS: { type: LetterType; label: string; icon: any }[] = [
  { type: "global", label: "Global Header & Footer", icon: Globe2 },
  { type: "offer", label: "Offer Letter", icon: Mail },
  { type: "joining", label: "Joining Letter", icon: Briefcase },
  { type: "appointment", label: "Appointment Letter", icon: FileSignature },
  { type: "resignation", label: "Resignation Letter", icon: LogOut },
  { type: "confirmation", label: "Confirmation Letter", icon: CheckCircle },
  { type: "experience", label: "Experience Certificate", icon: Award },
  { type: "noc", label: "NOC Letter", icon: Building },
  { type: "salary", label: "Salary Certificate", icon: Banknote },
];

const PLACEHOLDER_CATEGORIES = [
  { name: "Employee Info", items: ["{{EmployeeName}}", "{{EmployeeID}}", "{{Designation}}", "{{Department}}", "{{Grade}}"] },
  { name: "Salary & Comp", items: ["{{BasicSalary}}", "{{GrossSalary}}", "{{HouseRent}}", "{{Medical}}", "{{Conveyance}}"] },
  { name: "Dates", items: ["{{CurrentDate}}", "{{JoiningDate}}", "{{ConfirmationDate}}", "{{LastDate}}"] },
  { name: "Company", items: ["{{CompanyName}}", "{{CompanyAddress}}", "{{AuthorizedSignatory}}"] },
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
  "{{CurrentDate}}": new Date().toLocaleDateString("en-GB"),
  "{{JoiningDate}}": "15-Aug-2024",
  "{{ConfirmationDate}}": "15-Feb-2025",
  "{{LastDate}}": "31-Dec-2024",
  "{{CompanyName}}": "CRIPTON Technologies Ltd.",
  "{{CompanyAddress}}": "Level 4, Tech Park, Banani, Dhaka",
  "{{AuthorizedSignatory}}": "Jane Smith, HR Director",
};

const insetWrapperClass =
  "group relative rounded-xl border border-border/80 focus-within:border-primary px-3.5 py-2 bg-muted/15 focus-within:bg-card transition-all duration-200";
const insetLabelClass =
  "text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-0.5";
const insetInputClass =
  "w-full bg-transparent border-0 outline-none text-xs font-medium text-foreground focus:ring-0 p-0";

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
    toast.success("Global settings saved successfully!");
  };

  const handleSaveTemplate = () => {
    if (!currentEditConfig) return;
    let updated = [...templates];
    if (editingTemplateId) {
      updated = updated.map(t => (t.id === editingTemplateId ? currentEditConfig : t));
    } else {
      updated.push(currentEditConfig);
    }
    setTemplates(updated);
    localStorage.setItem("hris_letter_templates", JSON.stringify(updated));
    setEditingTemplateId(null);
    setCurrentEditConfig(null);
    toast.success("Template saved successfully!");
  };

  const handleDeleteTemplate = (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    const updated = templates.filter(t => t.id !== id);
    setTemplates(updated);
    localStorage.setItem("hris_letter_templates", JSON.stringify(updated));
    toast.success("Template deleted!");
  };

  const createNewTemplate = () => {
    const newTpl: LetterTemplate = {
      id: Date.now().toString(),
      type: activeTab,
      title: "Untitled Template",
      body: "",
      isActive: true,
    };
    setEditingTemplateId("");
    setCurrentEditConfig(newTpl);
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
      result = result.replace(new RegExp(key, "g"), dummyData[key]);
    });
    return result;
  };

  const activeTemplates = templates.filter(t => t.type === activeTab);

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-2 max-w-[1800px] mx-auto w-full">

          {/* ── Breadcrumb & Header ── */}
          <div className="bg-card rounded-2xl border border-border/50 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-3.5" />
                <span>Configure</span>
                <ChevronRight className="size-3.5" />
                <span className="text-primary font-bold">Letter Setup</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <LayoutTemplate className="size-6 text-primary" />
                Letter Setup
              </h1>
            </div>

            {/* Context-aware action button */}
            {activeTab === "global" && (
              <button
                onClick={handleSaveGlobal}
                className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2"
              >
                <Save className="size-4" /> Save Global Settings
              </button>
            )}
            {activeTab !== "global" && !currentEditConfig && (
              <button
                onClick={createNewTemplate}
                className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2"
              >
                <Plus className="size-4" /> New Template
              </button>
            )}
            {activeTab !== "global" && currentEditConfig && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setPreviewTemplate(currentEditConfig); setIsPreviewOpen(true); }}
                  className="h-10 px-4 rounded-xl border border-border/40 hover:bg-muted font-semibold text-xs text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Eye className="size-4" /> Preview
                </button>
                <button
                  onClick={handleSaveTemplate}
                  className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2"
                >
                  <Save className="size-4" /> Save Template
                </button>
              </div>
            )}
          </div>

          {/* ── Tab Navigation ── */}
          <div className="flex flex-wrap gap-2 pt-2 pb-4 border-b border-border/40">
            {TABS.map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.type;
              const count = tab.type !== "global" ? templates.filter(t => t.type === tab.type).length : null;
              return (
                <button
                  key={tab.type}
                  onClick={() => { setActiveTab(tab.type); setEditingTemplateId(null); setCurrentEditConfig(null); }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <TabIcon className="size-4" />
                  {tab.label}
                  {count !== null && (
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${isActive ? "bg-white/20" : "bg-muted-foreground/10"}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ════════════════════════════════════════════════
              VIEW 1 ── GLOBAL SETTINGS
          ════════════════════════════════════════════════ */}
          {activeTab === "global" && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

              {/* Left: Upload cards */}
              <div className="xl:col-span-2 space-y-6">
                {/* Header Upload */}
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-border/40 flex items-center gap-3">
                    <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <ImageIcon className="size-4.5" />
                    </div>
                    <div>
                      <h2 className="font-bold text-sm text-foreground">Header Image (Letterhead)</h2>
                      <p className="text-[11px] text-muted-foreground font-medium">This will appear at the top of every generated letter.</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="group relative rounded-xl border-2 border-dashed border-border/60 hover:border-primary/50 bg-muted/10 hover:bg-primary/5 transition-all min-h-[180px] flex items-center justify-center overflow-hidden cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleGlobalImageUpload(e, "headerImage")}
                        className="absolute inset-0 opacity-0 cursor-pointer z-20"
                      />
                      {globalConfig.headerImage ? (
                        <>
                          <img src={globalConfig.headerImage} alt="Header" className="max-h-[160px] max-w-full object-contain z-10 relative" />
                          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all z-30 flex items-center justify-center gap-3">
                            <span className="text-sm font-bold">Click to change</span>
                            <button
                              onClick={e => { e.preventDefault(); e.stopPropagation(); setGlobalConfig(p => ({ ...p, headerImage: null })); }}
                              className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition z-40"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-3 text-center p-6 pointer-events-none">
                          <div className="size-12 rounded-full bg-background shadow-sm flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all">
                            <Upload className="size-5" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">Click or drag to upload header</p>
                            <p className="text-[11px] text-muted-foreground/60 mt-0.5">PNG with transparent background recommended</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Upload */}
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-border/40 flex items-center gap-3">
                    <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <FileText className="size-4.5" />
                    </div>
                    <div>
                      <h2 className="font-bold text-sm text-foreground">Footer Image (Signatures)</h2>
                      <p className="text-[11px] text-muted-foreground font-medium">This will appear at the bottom of every generated letter.</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="group relative rounded-xl border-2 border-dashed border-border/60 hover:border-primary/50 bg-muted/10 hover:bg-primary/5 transition-all min-h-[180px] flex items-center justify-center overflow-hidden cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleGlobalImageUpload(e, "footerImage")}
                        className="absolute inset-0 opacity-0 cursor-pointer z-20"
                      />
                      {globalConfig.footerImage ? (
                        <>
                          <img src={globalConfig.footerImage} alt="Footer" className="max-h-[160px] max-w-full object-contain z-10 relative" />
                          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all z-30 flex items-center justify-center gap-3">
                            <span className="text-sm font-bold">Click to change</span>
                            <button
                              onClick={e => { e.preventDefault(); e.stopPropagation(); setGlobalConfig(p => ({ ...p, footerImage: null })); }}
                              className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition z-40"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-3 text-center p-6 pointer-events-none">
                          <div className="size-12 rounded-full bg-background shadow-sm flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all">
                            <Upload className="size-5" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">Click or drag to upload footer</p>
                            <p className="text-[11px] text-muted-foreground/60 mt-0.5">PNG with transparent background recommended</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Margin settings */}
              <div className="xl:col-span-1">
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden sticky top-6">
                  <div className="px-5 py-4 border-b border-border/40 flex items-center gap-3">
                    <div className="size-8 bg-muted rounded-lg flex items-center justify-center text-foreground">
                      <Settings2 className="size-4.5" />
                    </div>
                    <div>
                      <h2 className="font-bold text-sm text-foreground">Print Margins</h2>
                      <p className="text-[11px] text-muted-foreground font-medium">Spacing in pixels for physical prints.</p>
                    </div>
                  </div>
                  <div className="p-5 grid grid-cols-2 gap-4">
                    {(["top", "bottom", "left", "right"] as const).map(dir => (
                      <div key={dir} className={insetWrapperClass}>
                        <label className={insetLabelClass}>{dir} (px)</label>
                        <input
                          type="number"
                          value={globalConfig.margins[dir]}
                          onChange={e => setGlobalConfig({ ...globalConfig, margins: { ...globalConfig.margins, [dir]: parseInt(e.target.value) || 0 } })}
                          className={insetInputClass}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="px-5 pb-5">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 rounded-xl p-3.5">
                      <p className="text-[11px] text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                        Adjust margins so your dynamic body text prints correctly within the blank space of your physical letterhead.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════
              VIEW 2 ── TEMPLATE LIST
          ════════════════════════════════════════════════ */}
          {activeTab !== "global" && !currentEditConfig && (
            <>
              {activeTemplates.length === 0 ? (
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center py-20 px-6 text-center">
                  <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-5">
                    <LayoutTemplate className="size-8" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">No templates yet</h2>
                  <p className="text-sm text-muted-foreground font-medium max-w-sm mb-8">
                    You haven't created any <strong>{TABS.find(t => t.type === activeTab)?.label}</strong> templates yet. Create your first one to get started.
                  </p>
                  <button
                    onClick={createNewTemplate}
                    className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02] flex items-center gap-2"
                  >
                    <Plus className="size-4" /> Create First Template
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                  {activeTemplates.map(template => (
                    <div
                      key={template.id}
                      className="bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 flex flex-col overflow-hidden group"
                    >
                      {/* Card header bar */}
                      <div className="h-1.5 w-full bg-gradient-to-r from-primary/60 to-primary rounded-t-2xl" />

                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                            {template.title}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 whitespace-nowrap ${
                            template.isActive
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : "bg-muted text-muted-foreground border-border"
                          }`}>
                            {template.isActive ? "Active" : "Draft"}
                          </span>
                        </div>

                        <div
                          className="text-[11px] text-muted-foreground line-clamp-4 leading-relaxed flex-1 mb-4"
                          dangerouslySetInnerHTML={{ __html: template.body || "<em>No content...</em>" }}
                        />

                        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/40">
                          <button
                            onClick={() => { setEditingTemplateId(template.id); setCurrentEditConfig(template); }}
                            className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary/5 hover:bg-primary hover:text-primary-foreground text-primary text-xs font-bold transition-all"
                          >
                            <Pencil className="size-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => { setPreviewTemplate(template); setIsPreviewOpen(true); }}
                            className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-bold transition-all"
                          >
                            <Eye className="size-3.5" /> View
                          </button>
                          <button
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-muted/50 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 text-xs font-bold transition-all"
                          >
                            <Trash2 className="size-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add new card */}
                  <button
                    onClick={createNewTemplate}
                    className="bg-card rounded-2xl border-2 border-dashed border-border/50 hover:border-primary/50 shadow-sm hover:bg-primary/5 transition-all duration-200 flex flex-col items-center justify-center gap-3 p-8 min-h-[220px] text-muted-foreground hover:text-primary group"
                  >
                    <div className="size-12 rounded-full bg-background shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus className="size-6" />
                    </div>
                    <span className="text-sm font-bold">New Template</span>
                  </button>
                </div>
              )}
            </>
          )}

          {/* ════════════════════════════════════════════════
              VIEW 3 ── TEMPLATE EDITOR
          ════════════════════════════════════════════════ */}
          {activeTab !== "global" && currentEditConfig && (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

              {/* Left: Editor */}
              <div className="xl:col-span-3 space-y-4">
                {/* Title bar */}
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-4 flex items-center gap-3">
                  <button
                    onClick={() => { setEditingTemplateId(null); setCurrentEditConfig(null); }}
                    className="size-9 rounded-xl border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                    title="Back to templates"
                  >
                    <ArrowLeft className="size-4" />
                  </button>
                  <input
                    type="text"
                    value={currentEditConfig.title}
                    onChange={e => setCurrentEditConfig({ ...currentEditConfig, title: e.target.value })}
                    className="flex-1 bg-transparent border-0 outline-none text-base font-bold text-foreground placeholder:text-muted-foreground/40"
                    placeholder="Template title..."
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Status</span>
                    <button
                      onClick={() => setCurrentEditConfig(p => p ? { ...p, isActive: !p.isActive } : null)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${currentEditConfig.isActive ? "bg-emerald-500" : "bg-muted-foreground/30"}`}
                    >
                      <span className={`inline-block size-3.5 rounded-full bg-white shadow transform transition-transform ${currentEditConfig.isActive ? "translate-x-4" : "translate-x-0.5"}`} />
                    </button>
                    <span className={`text-xs font-bold ${currentEditConfig.isActive ? "text-emerald-600" : "text-muted-foreground"}`}>
                      {currentEditConfig.isActive ? "Active" : "Draft"}
                    </span>
                  </div>
                </div>

                {/* Quill Editor */}
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden editor-host">
                  <style dangerouslySetInnerHTML={{ __html: `
                    .editor-host .ql-toolbar {
                      border: none !important;
                      border-bottom: 1px solid hsl(var(--border) / 0.5) !important;
                      background: hsl(var(--muted) / 0.4);
                      padding: 10px 16px !important;
                    }
                    .editor-host .ql-container { border: none !important; }
                    .editor-host .ql-editor {
                      min-height: 480px;
                      padding: 24px 28px;
                      font-size: 14px;
                      line-height: 1.75;
                      font-family: inherit;
                    }
                    .editor-host .ql-editor.ql-blank::before {
                      color: hsl(var(--muted-foreground) / 0.5);
                      font-style: italic;
                    }
                  `}} />
                  <ReactQuill
                    theme="snow"
                    value={currentEditConfig.body}
                    onChange={val => setCurrentEditConfig(p => p ? { ...p, body: val } : null)}
                    modules={quillModules}
                    placeholder="Write your letter content here. Use placeholders like {{EmployeeName}}..."
                  />
                </div>
              </div>

              {/* Right: Placeholder picker */}
              <div className="xl:col-span-1">
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden sticky top-6 max-h-[calc(100vh-120px)] flex flex-col">
                  <div className="px-5 py-4 border-b border-border/40 flex items-center gap-3">
                    <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <Copy className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Dynamic Tags</h3>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Click to copy</p>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-5">
                    {PLACEHOLDER_CATEGORIES.map(category => (
                      <div key={category.name} className="space-y-2.5">
                        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                          {category.name}
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {category.items.map(ph => (
                            <button
                              key={ph}
                              onClick={() => copyToClipboard(ph)}
                              className={`text-[10px] px-2 py-1 rounded-lg font-mono transition-all border ${
                                copiedPlaceholder === ph
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                                  : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                              }`}
                            >
                              {copiedPlaceholder === ph && <Check className="size-2.5 inline mr-1" />}
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

        {/* ── Live A4 Preview Modal ── */}
        {isPreviewOpen && previewTemplate && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-200">
            <div className="bg-muted w-full max-w-5xl h-full max-h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
              <div className="bg-card px-5 py-4 flex items-center justify-between border-b border-border/50 shrink-0 rounded-t-2xl">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Eye className="size-4 text-primary" />
                  Letter Preview — {previewTemplate.title}
                </h3>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="size-8 rounded-xl hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground border border-border/20 transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 flex justify-center">
                <div
                  className="bg-white shadow-2xl w-[210mm] min-h-[297mm] flex flex-col ring-1 ring-black/10"
                  style={{
                    paddingTop: `${globalConfig.margins.top}px`,
                    paddingBottom: `${globalConfig.margins.bottom}px`,
                    paddingLeft: `${globalConfig.margins.left}px`,
                    paddingRight: `${globalConfig.margins.right}px`,
                  }}
                >
                  {globalConfig.headerImage && (
                    <div className="w-full mb-6 shrink-0 flex justify-center">
                      <img src={globalConfig.headerImage} alt="Header" className="max-w-full max-h-[150px] object-contain" />
                    </div>
                  )}
                  <div
                    className="flex-1 w-full text-black text-sm leading-relaxed ql-editor"
                    style={{ padding: 0 }}
                    dangerouslySetInnerHTML={{ __html: getPreviewBody(previewTemplate.body) }}
                  />
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
