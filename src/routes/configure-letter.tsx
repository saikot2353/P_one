import { useState, useEffect, useRef } from "react";
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
  AlertTriangle,
  Search,
  Filter,
  CopyPlus,
  Printer,
  FileDown,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/configure-letter")({
  head: () => ({
    meta: [
      { title: "Letter Setup — CRIPTON HRIS" },
      { name: "description", content: "Configure dynamic templates for various HR letters and certificates." },
    ],
  }),
  component: LetterSetupPage,
});

type LetterType = "global" | "offer" | "joining" | "appointment" | "resignation" | "confirmation" | "experience" | "noc" | "salary";

interface PageMargins { top: number; bottom: number; left: number; right: number; }

interface GlobalConfig {
  headerImage: string | null;
  footerImage: string | null;
  watermarkImage: string | null;
  watermarkOpacity: number;
  watermarkSize: number;
  watermarkRotate: boolean;
  margins: PageMargins;
}

interface LetterTemplate {
  id: string;
  type: LetterType;
  title: string;
  body: string;
  isActive: boolean;
  orientation: "portrait" | "landscape";
  showHeader: boolean;
  showFooter: boolean;
  showWatermark: boolean;
  description: string;
}

const DEFAULT_MARGINS: PageMargins = { top: 40, bottom: 40, left: 40, right: 40 };

const DEFAULT_GLOBAL: GlobalConfig = {
  headerImage: null,
  footerImage: null,
  watermarkImage: null,
  watermarkOpacity: 0.08,
  watermarkSize: 55,
  watermarkRotate: true,
  margins: DEFAULT_MARGINS,
};

const DEFAULT_TEMPLATES: LetterTemplate[] = [
  {
    id: "1",
    type: "offer",
    title: "Standard Offer Letter",
    body: `
      <p>Date: {{CurrentDate}}</p>
      <p>To,<br><strong>{{EmployeeName}}</strong><br>Employee ID: {{EmployeeID}}</p>
      <p><br></p>
      <p>Subject: <strong>Letter of Offer for Employment</strong></p>
      <p><br></p>
      <p>Dear {{EmployeeName}},</p>
      <p>We are pleased to offer you the position of <strong>{{Designation}}</strong> in the <strong>{{Department}}</strong> department at <strong>{{CompanyName}}</strong>. Below are the terms and conditions of your employment:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tbody>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px; width: 40%;"><strong>Designation</strong></td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">{{Designation}}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px;"><strong>Department</strong></td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">{{Department}}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px;"><strong>Joining Date</strong></td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">{{JoiningDate}}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px;"><strong>Gross Monthly Salary</strong></td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">{{GrossSalary}}</td>
          </tr>
        </tbody>
      </table>
      <p>Please confirm your acceptance of this offer by signing and returning a copy of this letter.</p>
      <p><br></p>
      <p>Sincerely,</p>
      <p><strong>{{AuthorizedSignatory}}</strong><br>{{CompanyName}}</p>
    `,
    isActive: true,
    orientation: "portrait",
    showHeader: true,
    showFooter: true,
    showWatermark: true,
    description: "Standard corporate offer template with a compensation terms table.",
  },
  {
    id: "2",
    type: "experience",
    title: "Appreciation Experience Certificate",
    body: `
      <p style="text-align: center;"><br></p>
      <p style="text-align: center;"><span style="font-size: 24px; font-weight: bold;">EXPERIENCE CERTIFICATE</span></p>
      <p style="text-align: center;"><br></p>
      <p>Date: {{CurrentDate}}</p>
      <p>This is to certify that <strong>{{EmployeeName}}</strong> has been employed with <strong>{{CompanyName}}</strong> as a <strong>{{Designation}}</strong> in the <strong>{{Department}}</strong> department from {{JoiningDate}} to {{LastDate}}.</p>
      <p>During his tenure with us, {{EmployeeName}} has demonstrated excellent technical skills and high dedication. He has been a valuable asset to the team, and we wish him all the best in his future endeavors.</p>
      <p><br></p>
      <p><br></p>
      <table style="width: 100%; border-collapse: collapse; border: 0px none;">
        <tbody>
          <tr style="border: none;">
            <td style="width: 50%; border: none; padding: 8px;">
              <p>_______________________</p>
              <p><strong>HR Manager Signature</strong></p>
            </td>
            <td style="width: 50%; border: none; padding: 8px; text-align: right;">
              <p>_______________________</p>
              <p><strong>Authorized Signatory</strong></p>
            </td>
          </tr>
        </tbody>
      </table>
    `,
    isActive: true,
    orientation: "portrait",
    showHeader: true,
    showFooter: false,
    showWatermark: true,
    description: "Experience certificate with a signature table layout (borders hidden).",
  }
];

const TABS: { type: LetterType; label: string; icon: any }[] = [
  { type: "global", label: "Global Settings", icon: Globe2 },
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
  "{{EmployeeName}}": "John Doe", "{{EmployeeID}}": "EMP-2024-001",
  "{{Designation}}": "Senior Software Engineer", "{{Department}}": "Engineering",
  "{{Grade}}": "Grade 4", "{{BasicSalary}}": "BDT 50,000", "{{GrossSalary}}": "BDT 90,000",
  "{{HouseRent}}": "BDT 25,000", "{{Medical}}": "BDT 5,000", "{{Conveyance}}": "BDT 10,000",
  "{{CurrentDate}}": new Date().toLocaleDateString("en-GB"), "{{JoiningDate}}": "15-Aug-2024",
  "{{ConfirmationDate}}": "15-Feb-2025", "{{LastDate}}": "31-Dec-2024",
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

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft">("all");

  // Client-side Editor State
  const [JoditEditorComponent, setJoditEditorComponent] = useState<any>(null);
  const [editorError, setEditorError] = useState<string | null>(null);
  const editorRef = useRef<any>(null);

  // Load configs & dynamically import JoditEditor to support SSR
  useEffect(() => {
    const savedGlobal = localStorage.getItem("hris_letter_global_config");
    const savedTemplates = localStorage.getItem("hris_letter_templates");
    if (savedGlobal) try { setGlobalConfig(JSON.parse(savedGlobal)); } catch {}
    if (savedTemplates) try { setTemplates(JSON.parse(savedTemplates)); } catch {}

    if (typeof window !== "undefined") {
      import("jodit-react")
        .then((module) => {
          if (!module.default) {
            throw new Error("Module loaded, but Jodit default export was missing.");
          }
          setJoditEditorComponent(() => module.default);
        })
        .catch((err) => {
          console.error("Failed to load JoditEditor component dynamically:", err);
          setEditorError(err.message || String(err));
          toast.error("Failed to load rich text editor: " + (err.message || String(err)));
        });
    }
  }, []);

  const handleGlobalImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: "headerImage" | "footerImage" | "watermarkImage") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setGlobalConfig(p => ({ ...p, [field]: reader.result as string }));
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
      updated = updated.map(t => t.id === editingTemplateId ? currentEditConfig : t);
    } else {
      updated.push(currentEditConfig);
    }
    setTemplates(updated);
    localStorage.setItem("hris_letter_templates", JSON.stringify(updated));
    setEditingTemplateId(null);
    setCurrentEditConfig(null);
    toast.success("Template saved!");
  };

  const handleDeleteTemplate = (id: string) => {
    if (!confirm("Delete this template?")) return;
    const updated = templates.filter(t => t.id !== id);
    setTemplates(updated);
    localStorage.setItem("hris_letter_templates", JSON.stringify(updated));
    toast.success("Template deleted!");
  };

  const handleCloneTemplate = (tpl: LetterTemplate) => {
    const newTpl: LetterTemplate = {
      ...tpl,
      id: Date.now().toString(),
      title: `${tpl.title} (Copy)`,
      isActive: false, // Cloned template defaults to Draft
    };
    const updated = [...templates, newTpl];
    setTemplates(updated);
    localStorage.setItem("hris_letter_templates", JSON.stringify(updated));
    toast.success(`Cloned: ${tpl.title}`);
  };

  const createNewTemplate = () => {
    setEditingTemplateId("");
    setCurrentEditConfig({
      id: Date.now().toString(),
      type: activeTab,
      title: "Untitled Template",
      body: "",
      isActive: true,
      orientation: "portrait",
      showHeader: true,
      showFooter: true,
      showWatermark: true,
      description: "",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPlaceholder(text);
    setTimeout(() => setCopiedPlaceholder(null), 1500);
    toast.success(`Copied ${text}`);
  };

  const getPreviewBody = (html: string) => {
    let result = html || "";
    Object.keys(dummyData).forEach(k => { result = result.replace(new RegExp(k, "g"), dummyData[k]); });
    return result;
  };

  const handlePrint = () => {
    window.print();
  };

  const activeTemplates = templates.filter(t => t.type === activeTab);

  // Search & Status Filtering
  const filteredTemplates = activeTemplates.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || 
                          (statusFilter === "active" && t.isActive) || 
                          (statusFilter === "draft" && !t.isActive);
    return matchesSearch && matchesStatus;
  });

  // Jodit Editor Configuration
  const joditConfig = {
    readonly: false,
    placeholder: "Start writing the letter content here...",
    toolbarAdaptive: false,
    buttons: [
      "bold", "italic", "underline", "strikethrough", "|",
      "font", "fontsize", "brush", "paragraph", "|",
      "align", "ul", "ol", "|",
      "table", "link", "hr", "|",
      "undo", "redo", "eraser", "source"
    ],
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: "insert_clear_html",
    height: 550,
    theme: "default",
  };

  const insetWrapperClass = "group relative rounded-xl border border-border/80 focus-within:border-primary px-3.5 py-2 bg-muted/15 focus-within:bg-card transition-all duration-200";
  const insetLabelClass = "text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-0.5";
  const insetInputClass = "w-full bg-transparent border-0 outline-none text-xs font-medium text-foreground focus:ring-0 p-0";
  const insetSelectClass = "w-full bg-transparent border-0 outline-none text-xs font-semibold text-foreground focus:ring-0 p-0 cursor-pointer";

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        {/* Global Stylesheet for accurate letterhead/watermark/table preview */}
        <style dangerouslySetInnerHTML={{ __html: `
          .letter-preview-content {
            width: 100%;
            color: #000000;
          }
          .letter-preview-content p {
            margin-bottom: 0.85em;
            line-height: 1.6;
          }
          .letter-preview-content ul {
            list-style-type: disc !important;
            margin-left: 1.75rem !important;
            margin-bottom: 1rem !important;
            padding-left: 0.25rem !important;
          }
          .letter-preview-content ol {
            list-style-type: decimal !important;
            margin-left: 1.75rem !important;
            margin-bottom: 1rem !important;
            padding-left: 0.25rem !important;
          }
          .letter-preview-content li {
            margin-bottom: 0.35rem;
          }
          .letter-preview-content table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin-top: 1rem !important;
            margin-bottom: 1rem !important;
          }
          .letter-preview-content table td,
          .letter-preview-content table th {
            padding: 8px 12px !important;
            min-width: 60px;
            vertical-align: top;
            box-sizing: border-box;
          }
          /* Custom Table Border Toggle compatibility */
          .letter-preview-content table td:not([style*="border"]),
          .letter-preview-content table th:not([style*="border"]),
          .letter-preview-content table:not([style*="border"]) td,
          .letter-preview-content table:not([style*="border"]) th {
            border: 1px solid #94a3b8;
          }
          /* Hidden table borders explicitly requested */
          .letter-preview-content table[style*="border: 0px"],
          .letter-preview-content table[style*="border: none"],
          .letter-preview-content table[style*="border-style: none"] td,
          .letter-preview-content table[style*="border-style: none"] th,
          .letter-preview-content table[style*="border: 0px"] td,
          .letter-preview-content table[style*="border: 0px"] th,
          .letter-preview-content table[style*="border:none"] td,
          .letter-preview-content table[style*="border:none"] th {
            border: none !important;
          }

          /* ── CSS Print Override (window.print()) ── */
          @media print {
            body * {
              visibility: hidden !important;
            }
            #letter-print-area, #letter-print-area * {
              visibility: visible !important;
            }
            #letter-print-area {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
              border: none !important;
              ring: none !important;
            }
          }
        `}} />

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
            {activeTab === "global" && (
              <button onClick={handleSaveGlobal} className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2">
                <Save className="size-4" /> Save Global Settings
              </button>
            )}
            {activeTab !== "global" && !currentEditConfig && (
              <button onClick={createNewTemplate} className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2">
                <Plus className="size-4" /> New Template
              </button>
            )}
            {activeTab !== "global" && currentEditConfig && (
              <div className="flex items-center gap-3">
                <button onClick={() => { setPreviewTemplate(currentEditConfig); setIsPreviewOpen(true); }} className="h-10 px-4 rounded-xl border border-border/40 hover:bg-muted font-semibold text-xs text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors">
                  <Eye className="size-4" /> Preview
                </button>
                <button onClick={handleSaveTemplate} className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2">
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
                <button key={tab.type} onClick={() => { setActiveTab(tab.type); setEditingTemplateId(null); setCurrentEditConfig(null); }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${isActive ? "bg-primary text-primary-foreground shadow-sm" : "bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground"}`}>
                  <TabIcon className="size-4" />
                  {tab.label}
                  {count !== null && (
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${isActive ? "bg-white/20" : "bg-muted-foreground/10"}`}>{count}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ════ VIEW 1: GLOBAL SETTINGS ════ */}
          {activeTab === "global" && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-6">
                
                {/* 3 Upload columns inside one box */}
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-border/40 flex items-center gap-3">
                    <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary"><ImageIcon className="size-4.5" /></div>
                    <div>
                      <h2 className="font-bold text-sm text-foreground">Global Print Media Assets</h2>
                      <p className="text-[11px] text-muted-foreground font-medium">Upload logos and stationary formats used globally.</p>
                    </div>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Header Upload */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Header Letterhead</label>
                      <div className="group relative rounded-xl border-2 border-dashed border-border/60 hover:border-primary/50 bg-muted/10 hover:bg-primary/5 transition-all min-h-[160px] flex items-center justify-center overflow-hidden cursor-pointer">
                        <input type="file" accept="image/*" onChange={e => handleGlobalImageUpload(e, "headerImage")} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                        {globalConfig.headerImage ? (
                          <>
                            <img src={globalConfig.headerImage} alt="Header" className="max-h-[140px] max-w-full object-contain p-2 z-10 relative" />
                            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all z-30 flex items-center justify-center gap-2">
                              <button onClick={e => { e.preventDefault(); e.stopPropagation(); setGlobalConfig(p => ({ ...p, headerImage: null })); }} className="p-2 bg-rose-500 text-white rounded-lg z-40"><Trash2 className="size-3.5" /></button>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-center p-4 pointer-events-none">
                            <Upload className="size-5 text-muted-foreground" />
                            <span className="text-xs font-semibold text-muted-foreground">Header Image</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Watermark Upload */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Watermark Logo</label>
                      <div className="group relative rounded-xl border-2 border-dashed border-border/60 hover:border-primary/50 bg-muted/10 hover:bg-primary/5 transition-all min-h-[160px] flex items-center justify-center overflow-hidden cursor-pointer">
                        <input type="file" accept="image/*" onChange={e => handleGlobalImageUpload(e, "watermarkImage")} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                        {globalConfig.watermarkImage ? (
                          <>
                            <img src={globalConfig.watermarkImage} alt="Watermark" className="max-h-[140px] max-w-full object-contain p-2 z-10 relative opacity-40" />
                            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all z-30 flex items-center justify-center gap-2">
                              <button onClick={e => { e.preventDefault(); e.stopPropagation(); setGlobalConfig(p => ({ ...p, watermarkImage: null })); }} className="p-2 bg-rose-500 text-white rounded-lg z-40"><Trash2 className="size-3.5" /></button>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-center p-4 pointer-events-none">
                            <Upload className="size-5 text-muted-foreground" />
                            <span className="text-xs font-semibold text-muted-foreground">Watermark</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Upload */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Footer Signatures</label>
                      <div className="group relative rounded-xl border-2 border-dashed border-border/60 hover:border-primary/50 bg-muted/10 hover:bg-primary/5 transition-all min-h-[160px] flex items-center justify-center overflow-hidden cursor-pointer">
                        <input type="file" accept="image/*" onChange={e => handleGlobalImageUpload(e, "footerImage")} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                        {globalConfig.footerImage ? (
                          <>
                            <img src={globalConfig.footerImage} alt="Footer" className="max-h-[140px] max-w-full object-contain p-2 z-10 relative" />
                            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all z-30 flex items-center justify-center gap-2">
                              <button onClick={e => { e.preventDefault(); e.stopPropagation(); setGlobalConfig(p => ({ ...p, footerImage: null })); }} className="p-2 bg-rose-500 text-white rounded-lg z-40"><Trash2 className="size-3.5" /></button>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-center p-4 pointer-events-none">
                            <Upload className="size-5 text-muted-foreground" />
                            <span className="text-xs font-semibold text-muted-foreground">Footer Image</span>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Watermark Detailed Controls */}
                {globalConfig.watermarkImage && (
                  <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden p-5 space-y-4">
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                      <Settings2 className="size-4.5 text-primary" /> Watermark Configurations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-muted-foreground">
                          <span>Opacity</span>
                          <span>{Math.round(globalConfig.watermarkOpacity * 100)}%</span>
                        </div>
                        <input type="range" min="0.01" max="0.30" step="0.01" value={globalConfig.watermarkOpacity}
                          onChange={e => setGlobalConfig({ ...globalConfig, watermarkOpacity: parseFloat(e.target.value) })}
                          className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-muted-foreground">
                          <span>Scaling Size</span>
                          <span>{globalConfig.watermarkSize}%</span>
                        </div>
                        <input type="range" min="30" max="90" step="5" value={globalConfig.watermarkSize}
                          onChange={e => setGlobalConfig({ ...globalConfig, watermarkSize: parseInt(e.target.value) })}
                          className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" />
                      </div>

                      <div className="flex items-center gap-3 justify-between border border-border/60 bg-muted/20 p-2.5 rounded-xl">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-foreground">Rotate Diagonally</span>
                          <span className="text-[10px] text-muted-foreground">Standard -45° tilt</span>
                        </div>
                        <button onClick={() => setGlobalConfig({ ...globalConfig, watermarkRotate: !globalConfig.watermarkRotate })}
                          className={`relative inline-flex h-5 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${globalConfig.watermarkRotate ? "bg-primary" : "bg-muted-foreground/30"}`}>
                          <span className={`inline-block size-3.5 rounded-full bg-white shadow transform transition-transform ${globalConfig.watermarkRotate ? "translate-x-2" : "-translate-x-2"}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Margins */}
              <div className="xl:col-span-1">
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden sticky top-6">
                  <div className="px-5 py-4 border-b border-border/40 flex items-center gap-3">
                    <div className="size-8 bg-muted rounded-lg flex items-center justify-center text-foreground"><Settings2 className="size-4.5" /></div>
                    <div>
                      <h2 className="font-bold text-sm text-foreground">Print Margins</h2>
                      <p className="text-[11px] text-muted-foreground font-medium">Spacing in pixels for physical prints.</p>
                    </div>
                  </div>
                  <div className="p-5 grid grid-cols-2 gap-4">
                    {(["top", "bottom", "left", "right"] as const).map(dir => (
                      <div key={dir} className={insetWrapperClass}>
                        <label className={insetLabelClass}>{dir} (px)</label>
                        <input type="number" value={globalConfig.margins[dir]}
                          onChange={e => setGlobalConfig({ ...globalConfig, margins: { ...globalConfig.margins, [dir]: parseInt(e.target.value) || 0 } })}
                          className={insetInputClass} />
                      </div>
                    ))}
                  </div>
                  <div className="px-5 pb-5">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 rounded-xl p-3.5">
                      <p className="text-[11px] text-blue-700 dark:text-blue-300 font-medium leading-relaxed">Adjust margins so your body text prints correctly within the blank space of your physical letterhead.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════ VIEW 2: TEMPLATE LIST ════ */}
          {activeTab !== "global" && !currentEditConfig && (
            <div className="space-y-4">
              
              {/* Filter & Toolbar */}
              <div className="bg-card rounded-2xl border border-border/50 p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="w-full md:w-80 h-10 px-3.5 rounded-lg border border-border/60 bg-muted/10 focus-within:bg-background focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all flex items-center gap-2.5 shadow-sm">
                  <Search className="size-4.5 text-muted-foreground/70" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-0 outline-none text-sm w-full text-foreground placeholder:text-muted-foreground/50 font-medium"
                  />
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                  <div className="flex items-center gap-1.5 border border-border/40 p-1 rounded-xl bg-muted/30">
                    {(["all", "active", "draft"] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => setStatusFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${statusFilter === f ? "bg-background text-foreground shadow-xs border border-border/30" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {filteredTemplates.length === 0 ? (
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center py-20 px-6 text-center">
                  <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-5"><LayoutTemplate className="size-8" /></div>
                  <h2 className="text-xl font-bold text-foreground mb-2">No templates match filters</h2>
                  <p className="text-sm text-muted-foreground font-medium max-w-sm mb-4">Try clearing your filters or create a new template.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                  {filteredTemplates.map(template => (
                    <div key={template.id} className="bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 flex flex-col overflow-hidden group">
                      <div className="h-1.5 w-full bg-gradient-to-r from-primary/60 to-primary rounded-t-2xl" />
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">{template.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${template.isActive ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-muted text-muted-foreground border-border"}`}>
                            {template.isActive ? "Active" : "Draft"}
                          </span>
                        </div>
                        {template.description && (
                          <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed italic line-clamp-1">
                            📄 {template.description}
                          </p>
                        )}
                        <div className="text-[11px] text-muted-foreground line-clamp-4 leading-relaxed flex-1 mb-4" dangerouslySetInnerHTML={{ __html: template.body || "<em>No content...</em>" }} />
                        <div className="grid grid-cols-4 gap-1.5 pt-4 border-t border-border/40">
                          <button onClick={() => { setEditingTemplateId(template.id); setCurrentEditConfig(template); }} className="flex items-center justify-center gap-1 py-2 rounded-lg bg-primary/5 hover:bg-primary hover:text-primary-foreground text-primary text-[10px] font-bold transition-all">
                            <Pencil className="size-3" /> Edit
                          </button>
                          <button onClick={() => { setPreviewTemplate(template); setIsPreviewOpen(true); }} className="flex items-center justify-center gap-1 py-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground text-[10px] font-bold transition-all">
                            <Eye className="size-3" /> View
                          </button>
                          <button onClick={() => handleCloneTemplate(template)} className="flex items-center justify-center gap-1 py-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground text-[10px] font-bold transition-all" title="Duplicate Template">
                            <CopyPlus className="size-3" /> Clone
                          </button>
                          <button onClick={() => handleDeleteTemplate(template.id)} className="flex items-center justify-center gap-1 py-2 rounded-lg bg-muted/50 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 text-[10px] font-bold transition-all">
                            <Trash2 className="size-3" /> Del
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={createNewTemplate} className="bg-card rounded-2xl border-2 border-dashed border-border/50 hover:border-primary/50 shadow-sm hover:bg-primary/5 transition-all duration-200 flex flex-col items-center justify-center gap-3 p-8 min-h-[220px] text-muted-foreground hover:text-primary group">
                    <div className="size-12 rounded-full bg-background shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform"><Plus className="size-6" /></div>
                    <span className="text-sm font-bold">New Template</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ════ VIEW 3: TEMPLATE EDITOR ════ */}
          {activeTab !== "global" && currentEditConfig && (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              
              {/* Left Column: Editor Workspace */}
              <div className="xl:col-span-3 space-y-4">

                {/* Title & Status Bar */}
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-4 flex items-center gap-3">
                  <button onClick={() => { setEditingTemplateId(null); setCurrentEditConfig(null); }}
                    className="size-9 rounded-xl border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0" title="Back to templates">
                    <ArrowLeft className="size-4" />
                  </button>
                  <input type="text" value={currentEditConfig.title}
                    onChange={e => setCurrentEditConfig({ ...currentEditConfig, title: e.target.value })}
                    className="flex-1 bg-transparent border-0 outline-none text-base font-bold text-foreground placeholder:text-muted-foreground/40"
                    placeholder="Template title..." />
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Status</span>
                    <button onClick={() => setCurrentEditConfig(p => p ? { ...p, isActive: !p.isActive } : null)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${currentEditConfig.isActive ? "bg-emerald-500" : "bg-muted-foreground/30"}`}>
                      <span className={`inline-block size-3.5 rounded-full bg-white shadow transform transition-transform ${currentEditConfig.isActive ? "translate-x-4" : "translate-x-0.5"}`} />
                    </button>
                    <span className={`text-xs font-bold ${currentEditConfig.isActive ? "text-emerald-600" : "text-muted-foreground"}`}>
                      {currentEditConfig.isActive ? "Active" : "Draft"}
                    </span>
                  </div>
                </div>

                {/* Jodit Rich Editor */}
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden editor-host">
                  {editorError ? (
                    <div className="p-8 text-center text-rose-500 bg-rose-500/5 h-[550px] flex flex-col items-center justify-center gap-3">
                      <AlertTriangle className="size-10 text-rose-500" />
                      <h3 className="font-bold text-base">Failed to load rich text editor</h3>
                      <p className="text-xs text-muted-foreground max-w-md">{editorError}</p>
                      <button onClick={() => window.location.reload()} className="mt-2 h-9 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-xs transition-all hover:scale-[1.02]">Reload Page</button>
                    </div>
                  ) : JoditEditorComponent ? (
                    <JoditEditorComponent
                      ref={editorRef}
                      value={currentEditConfig.body}
                      config={joditConfig}
                      onBlur={(newContent: string) => setCurrentEditConfig(p => p ? { ...p, body: newContent } : null)}
                    />
                  ) : (
                    <div className="p-8 text-center text-muted-foreground text-sm font-medium animate-pulse bg-muted/10 h-[550px] flex items-center justify-center">
                      Loading Rich Text Editor...
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Template Printing Layout & Dynamic Tags */}
              <div className="xl:col-span-1 space-y-4">
                
                {/* Print Layout Configurations per Template */}
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-border/40 flex items-center gap-3 bg-muted/15">
                    <Settings2 className="size-4 text-foreground" />
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Print Settings</h3>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Per-Template layout</p>
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    {/* Orientation Toggler */}
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Page Orientation</label>
                      <select value={currentEditConfig.orientation}
                        onChange={e => setCurrentEditConfig({ ...currentEditConfig, orientation: e.target.value as any })}
                        className={insetSelectClass}>
                        <option value="portrait">Portrait (Vertical)</option>
                        <option value="landscape">Landscape (Horizontal)</option>
                      </select>
                    </div>

                    {/* Meta Description */}
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Usage Notes / Description</label>
                      <textarea value={currentEditConfig.description || ""}
                        onChange={e => setCurrentEditConfig({ ...currentEditConfig, description: e.target.value })}
                        className="w-full bg-transparent border-0 outline-none text-xs font-semibold text-foreground focus:ring-0 p-0 resize-none min-h-[50px]"
                        placeholder="Explain when to use this template..." />
                    </div>

                    {/* Visibility Flags */}
                    <div className="space-y-3.5 pt-2 border-t border-border/40">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-muted-foreground">Show Letterhead Header</span>
                        <button onClick={() => setCurrentEditConfig({ ...currentEditConfig, showHeader: !currentEditConfig.showHeader })}
                          className={`relative inline-flex h-5 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${currentEditConfig.showHeader ? "bg-primary" : "bg-muted-foreground/30"}`}>
                          <span className={`inline-block size-3.5 rounded-full bg-white shadow transform transition-transform ${currentEditConfig.showHeader ? "translate-x-2" : "-translate-x-2"}`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-muted-foreground">Show Signatures Footer</span>
                        <button onClick={() => setCurrentEditConfig({ ...currentEditConfig, showFooter: !currentEditConfig.showFooter })}
                          className={`relative inline-flex h-5 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${currentEditConfig.showFooter ? "bg-primary" : "bg-muted-foreground/30"}`}>
                          <span className={`inline-block size-3.5 rounded-full bg-white shadow transform transition-transform ${currentEditConfig.showFooter ? "translate-x-2" : "-translate-x-2"}`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-muted-foreground">Show Watermark Background</span>
                        <button onClick={() => setCurrentEditConfig({ ...currentEditConfig, showWatermark: !currentEditConfig.showWatermark })}
                          className={`relative inline-flex h-5 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${currentEditConfig.showWatermark ? "bg-primary" : "bg-muted-foreground/30"}`}>
                          <span className={`inline-block size-3.5 rounded-full bg-white shadow transform transition-transform ${currentEditConfig.showWatermark ? "translate-x-2" : "-translate-x-2"}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Tags */}
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col max-h-[400px]">
                  <div className="px-5 py-4 border-b border-border/45 flex items-center gap-3">
                    <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary"><Copy className="size-4" /></div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Dynamic Tags</h3>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Click to copy</p>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {PLACEHOLDER_CATEGORIES.map(category => (
                      <div key={category.name} className="space-y-2.5">
                        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">{category.name}</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {category.items.map(ph => (
                            <button key={ph} onClick={() => copyToClipboard(ph)}
                              className={`text-[10px] px-2 py-1 rounded-lg font-mono transition-all border ${copiedPlaceholder === ph ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30"}`}>
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
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-muted w-full max-w-5xl h-fit rounded-2xl shadow-2xl flex flex-col overflow-hidden my-8">
              
              {/* Preview Controls Header */}
              <div className="bg-card px-5 py-4 flex items-center justify-between border-b border-border/50 shrink-0">
                <div>
                  <h3 className="font-bold text-sm flex items-center gap-2"><Eye className="size-4 text-primary" /> Letter Preview</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 capitalize">Orientation: {previewTemplate.orientation}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={handlePrint} className="h-9 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-sm hover:bg-primary/90 transition-all flex items-center gap-1.5">
                    <Printer className="size-4" /> Print / Export PDF
                  </button>
                  <button onClick={() => setIsPreviewOpen(false)} className="size-9 rounded-xl hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground border border-border/20 transition-colors">
                    <X className="size-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 p-4 md:p-8 flex justify-center bg-[#525659] overflow-x-auto">
                {/* A4 Paper Container with max width based on Portrait (210mm) or Landscape (297mm) */}
                <div
                  id="letter-print-area"
                  className="bg-white shadow-2xl w-full flex flex-col relative overflow-hidden shrink-0 border border-neutral-300 transition-all duration-300"
                  style={{
                    maxWidth: previewTemplate.orientation === "landscape" ? "297mm" : "210mm",
                    minHeight: previewTemplate.orientation === "landscape" ? "210mm" : "297mm",
                    paddingTop: `${globalConfig.margins.top}px`,
                    paddingBottom: `${globalConfig.margins.bottom}px`,
                    paddingLeft: `${globalConfig.margins.left}px`,
                    paddingRight: `${globalConfig.margins.right}px`,
                  }}
                >
                  
                  {/* Watermark Overlay */}
                  {previewTemplate.showWatermark && globalConfig.watermarkImage && (
                    <div
                      className="absolute inset-0 pointer-events-none flex items-center justify-center z-0"
                      style={{
                        opacity: globalConfig.watermarkOpacity,
                      }}
                    >
                      <img
                        src={globalConfig.watermarkImage}
                        alt="Watermark Logo"
                        className="object-contain transition-transform"
                        style={{
                          maxWidth: `${globalConfig.watermarkSize}%`,
                          maxHeight: `${globalConfig.watermarkSize}%`,
                          transform: globalConfig.watermarkRotate ? "rotate(-45deg)" : "none",
                        }}
                      />
                    </div>
                  )}

                  {/* Header */}
                  {previewTemplate.showHeader && globalConfig.headerImage && (
                    <div className="w-full mb-6 shrink-0 flex justify-center relative z-10">
                      <img src={globalConfig.headerImage} alt="Header" className="max-w-full max-h-[150px] object-contain" />
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="flex-1 w-full text-black text-sm relative z-10 letter-preview-content" style={{ padding: 0 }}
                    dangerouslySetInnerHTML={{ __html: getPreviewBody(previewTemplate.body) }} />

                  {/* Footer */}
                  {previewTemplate.showFooter && globalConfig.footerImage && (
                    <div className="w-full mt-auto pt-10 shrink-0 flex justify-center relative z-10">
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
