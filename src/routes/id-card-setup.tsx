import { useState, useMemo, useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { employeesData } from "@/routes/personnel-list";
import {
  UserRound,
  Printer,
  Upload,
  Palette,
  FileText,
  Check,
  RefreshCcw,
  Sparkles,
  Info,
  Eye,
  Plus,
  Trash2,
  Layers,
  Users,
  Search,
  SlidersHorizontal,
  ChevronRight,
  GripVertical,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export const Route = createFileRoute("/id-card-setup")({
  head: () => ({
    meta: [
      { title: "ID Card Setup — CRIPTON" },
      {
        name: "description",
        content: "Design, configure, save templates, and bulk-print employee ID cards.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",
      },
    ],
  }),
  component: IDCardSetupPage,
});

interface CardTemplate {
  id: string;
  name: string;
  themeColor: string;
  companyName: string;
  logoUrl: string;
  signatureUrl: string;
  orientation: "vertical" | "horizontal";
  showBloodGroup: boolean;
  showJoinDate: boolean;
  showDepartment: boolean;
  showDesignation: boolean;
  showBarcode: boolean;
  backText: string;
  elementOrder: string[];
  isSystem?: boolean;
}

// Preset colors for the ID Card theme
const PRESET_COLORS = [
  { name: "Corporate Blue", value: "#1e88e5" },
  { name: "Emerald Green", value: "#10b981" },
  { name: "Indigo Velvet", value: "#6366f1" },
  { name: "Crimson Red", value: "#ef4444" },
  { name: "Slate Charcoal", value: "#374151" },
];

// Default base64 placeholders
const DEFAULT_LOGO_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="40" stroke="%231e88e5" stroke-width="8"/><path d="M35 50 L45 60 L65 40" stroke="%231e88e5" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const DEFAULT_SIGNATURE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" fill="none"><path d="M20 50 C 40 20, 50 70, 70 30 C 90 10, 100 60, 120 45 C 140 30, 150 50, 180 35" stroke="%231a1a1a" stroke-width="4" stroke-linecap="round" fill="none"/></svg>`;

const SYSTEM_TEMPLATES: CardTemplate[] = [
  {
    id: "sys-corporate",
    name: "Standard Corporate (System)",
    themeColor: "#1e88e5",
    companyName: "CRIPTON GROUP",
    logoUrl: DEFAULT_LOGO_SVG,
    signatureUrl: DEFAULT_SIGNATURE_SVG,
    orientation: "vertical",
    showBloodGroup: true,
    showJoinDate: true,
    showDepartment: true,
    showDesignation: true,
    showBarcode: true,
    backText:
      "This card is the property of CRIPTON GROUP.\nIf found, please return to the nearest HR Department or mail to:\nHouse 12, Road 5, Sector 3, Uttara, Dhaka-1230.\nTel: +880 2 8901234 | Email: hr@cripton.com",
    elementOrder: ["header", "photo", "identity", "details", "footer"],
    isSystem: true,
  },
  {
    id: "sys-factory",
    name: "Factory Operations (System)",
    themeColor: "#10b981",
    companyName: "PAKIZA TEXTILE UNIT",
    logoUrl: DEFAULT_LOGO_SVG,
    signatureUrl: DEFAULT_SIGNATURE_SVG,
    orientation: "vertical",
    showBloodGroup: true,
    showJoinDate: true,
    showDepartment: true,
    showDesignation: true,
    showBarcode: true,
    backText:
      "If found, please return to:\nPakiza Textile Factory, Savar, Dhaka.\nIn case of emergency, contact factory admin office.",
    elementOrder: ["header", "photo", "identity", "details", "footer"],
    isSystem: true,
  },
  {
    id: "sys-creative",
    name: "Creative Horizontal (System)",
    themeColor: "#6366f1",
    companyName: "PAKIZA SOFTWARE",
    logoUrl: DEFAULT_LOGO_SVG,
    signatureUrl: DEFAULT_SIGNATURE_SVG,
    orientation: "horizontal",
    showBloodGroup: true,
    showJoinDate: true,
    showDepartment: true,
    showDesignation: true,
    showBarcode: true,
    backText:
      "This card is the property of Pakiza Software.\nUnauthorized use is strictly prohibited and subject to disciplinary action.\nWeb: www.pakizasoftware.com",
    elementOrder: ["header", "photo", "identity", "details", "footer"],
    isSystem: true,
  },
];

function IDCardSetupPage() {
  // Navigation Tabs: "design" or "bulk"
  const [activeTab, setActiveTab] = useState<"design" | "bulk">("design");

  // State for card design configuration
  const [orientation, setOrientation] = useState<"vertical" | "horizontal">("vertical");
  const [themeColor, setThemeColor] = useState<string>("#1e88e5");
  const [companyName, setCompanyName] = useState<string>("PAKIZA SOFTWARE");
  const [logoUrl, setLogoUrl] = useState<string>(DEFAULT_LOGO_SVG);
  const [signatureUrl, setSignatureUrl] = useState<string>(DEFAULT_SIGNATURE_SVG);

  // Drag and Drop Layout Elements Order
  const [elementOrder, setElementOrder] = useState<string[]>([
    "header",
    "photo",
    "identity",
    "details",
    "footer",
  ]);

  // Toggle visible elements
  const [showBloodGroup, setShowBloodGroup] = useState<boolean>(true);
  const [showJoinDate, setShowJoinDate] = useState<boolean>(true);
  const [showDepartment, setShowDepartment] = useState<boolean>(true);
  const [showDesignation, setShowDesignation] = useState<boolean>(true);
  const [showBarcode, setShowBarcode] = useState<boolean>(true);

  // Custom text on back side
  const [backText, setBackText] = useState<string>(
    "This card is the property of PAKIZA SOFTWARE.\nIf found, please return to the nearest HR Department or mail to:\nHouse 12, Road 5, Sector 3, Uttara, Dhaka-1230.\nTel: +880 2 8901234 | Email: hr@cripton.com",
  );

  // Single Designer Specific state
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employeesData[0]?.id || "");
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Template Management state
  const [savedTemplates, setSavedTemplates] = useState<CardTemplate[]>([]);
  const [newTemplateName, setNewTemplateName] = useState<string>("");
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState<boolean>(false);

  // Bulk Print Specific state
  const [bulkSearchQuery, setBulkSearchQuery] = useState<string>("");
  const [bulkDeptFilter, setBulkDeptFilter] = useState<string>("ALL");
  const [bulkSelectedEmpIds, setBulkSelectedEmpIds] = useState<string[]>([]);
  const [bulkPrintMode, setBulkPrintMode] = useState<"both" | "front" | "back">("both");

  // Drag and drop refs
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // References for image uploads
  const logoInputRef = useRef<HTMLInputElement>(null);
  const sigInputRef = useRef<HTMLInputElement>(null);

  // Load templates from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cripton_id_card_templates");
      if (saved) {
        try {
          setSavedTemplates(JSON.parse(saved));
        } catch (e) {
          console.error("Error loading templates", e);
        }
      }
    }
  }, []);

  // Save templates to localStorage
  const saveTemplatesToStorage = (templates: CardTemplate[]) => {
    setSavedTemplates(templates);
    localStorage.setItem("cripton_id_card_templates", JSON.stringify(templates));
  };

  // Create/Save current design as a new template
  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateName.trim()) return;

    const newTemplate: CardTemplate = {
      id: "template-" + Date.now(),
      name: newTemplateName.trim(),
      themeColor,
      companyName,
      logoUrl,
      signatureUrl,
      orientation,
      showBloodGroup,
      showJoinDate,
      showDepartment,
      showDesignation,
      showBarcode,
      backText,
      elementOrder,
    };

    const updated = [...savedTemplates, newTemplate];
    saveTemplatesToStorage(updated);
    setNewTemplateName("");
    setShowSaveTemplateModal(false);
  };

  // Load a selected template
  const handleLoadTemplate = (template: CardTemplate) => {
    setThemeColor(template.themeColor);
    setCompanyName(template.companyName);
    setLogoUrl(template.logoUrl);
    setSignatureUrl(template.signatureUrl);
    setOrientation(template.orientation);
    setShowBloodGroup(template.showBloodGroup);
    setShowJoinDate(template.showJoinDate);
    setShowDepartment(template.showDepartment);
    setShowDesignation(template.showDesignation);
    setShowBarcode(template.showBarcode);
    setBackText(template.backText);
    if (template.elementOrder) {
      setElementOrder(template.elementOrder);
    } else {
      setElementOrder(["header", "photo", "identity", "details", "footer"]);
    }
  };

  // Delete a template
  const handleDeleteTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedTemplates.filter((t) => t.id !== id);
    saveTemplatesToStorage(updated);
  };

  // Get selected employee details for single view
  const selectedEmployee = useMemo(() => {
    return employeesData.find((emp) => emp.id === selectedEmpId) || employeesData[0];
  }, [selectedEmpId]);

  // Map employees for the SearchableSelect
  const employeeOptions = useMemo(() => {
    return employeesData.map((emp) => ({
      value: emp.id,
      label: `${emp.name} (${emp.id}) - ${emp.title}`,
    }));
  }, []);

  // Filtered employees list for bulk printing
  const filteredEmployees = useMemo(() => {
    return employeesData.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(bulkSearchQuery.toLowerCase()) ||
        emp.id.includes(bulkSearchQuery) ||
        emp.title.toLowerCase().includes(bulkSearchQuery.toLowerCase());

      const matchesDept = bulkDeptFilter === "ALL" || emp.dept === bulkDeptFilter;

      return matchesSearch && matchesDept;
    });
  }, [bulkSearchQuery, bulkDeptFilter]);

  // Unique departments for filtering
  const departmentsList = useMemo(() => {
    const depts = new Set<string>();
    employeesData.forEach((emp) => {
      if (emp.dept) depts.add(emp.dept);
    });
    return Array.from(depts);
  }, []);

  // Handle Bulk Selection
  const toggleSelectAllBulk = () => {
    const filteredIds = filteredEmployees.map((emp) => emp.id);
    const allSelected = filteredIds.every((id) => bulkSelectedEmpIds.includes(id));

    if (allSelected) {
      setBulkSelectedEmpIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setBulkSelectedEmpIds((prev) => {
        const union = new Set([...prev, ...filteredIds]);
        return Array.from(union);
      });
    }
  };

  const toggleSelectEmployeeBulk = (id: string) => {
    setBulkSelectedEmpIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Handle Drag & Drop Sorting
  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const copyListItems = [...elementOrder];
      const dragItemContent = copyListItems[dragItem.current];
      copyListItems.splice(dragItem.current, 1);
      copyListItems.splice(dragOverItem.current, 0, dragItemContent);
      dragItem.current = null;
      dragOverItem.current = null;
      setElementOrder(copyListItems);
    }
  };

  const moveElement = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= elementOrder.length) return;

    const copy = [...elementOrder];
    const temp = copy[index];
    copy[index] = copy[newIndex];
    copy[newIndex] = temp;
    setElementOrder(copy);
  };

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setLogoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Signature Upload
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setSignatureUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger print dialog
  const handlePrint = () => {
    window.print();
  };

  // Reset current design to default
  const handleReset = () => {
    setOrientation("vertical");
    setThemeColor("#1e88e5");
    setCompanyName("PAKIZA SOFTWARE");
    setLogoUrl(DEFAULT_LOGO_SVG);
    setSignatureUrl(DEFAULT_SIGNATURE_SVG);
    setBackText(
      "This card is the property of PAKIZA SOFTWARE.\nIf found, please return to the nearest HR Department or mail to:\nHouse 12, Road 5, Sector 3, Uttara, Dhaka-1230.\nTel: +880 2 8901234 | Email: hr@cripton.com",
    );
    setShowBloodGroup(true);
    setShowJoinDate(true);
    setShowDepartment(true);
    setShowDesignation(true);
    setShowBarcode(true);
    setElementOrder(["header", "photo", "identity", "details", "footer"]);
    setIsFlipped(false);
  };

  // SVG Barcode Generator based on Employee ID
  const renderBarcode = (id: string) => {
    if (!id) return null;
    const bars: React.ReactNode[] = [];
    let currentX = 10;
    const height = 24;

    const idDigits = id.replace(/\D/g, "") || "123456789";
    const pattern = idDigits.split("").map((d) => parseInt(d, 10));

    for (let i = 0; i < 28; i++) {
      const digit = pattern[i % pattern.length];
      const width = digit % 3 === 0 ? 2.0 : digit % 2 === 0 ? 1.0 : 0.5;
      const isSpace = i % 2 === 1;

      if (!isSpace) {
        bars.push(<rect key={i} x={currentX} y={0} width={width} height={height} fill="black" />);
      }
      currentX += width + 0.8;
    }

    return (
      <div className="flex flex-col items-center justify-center mt-1 font-mono text-[7.5px] text-gray-800">
        <svg width={currentX + 10} height={height} className="overflow-visible">
          {bars}
        </svg>
        <span className="mt-0.5 tracking-[0.2em]">{id}</span>
      </div>
    );
  };

  // Render Vector QR Code SVG
  const renderQRCodeSVG = () => {
    return (
      <svg viewBox="0 0 29 29" className="size-full text-slate-800">
        {/* QR Code Finder Patterns (Top-Left, Top-Right, Bottom-Left) */}
        <path d="M0,0 h7 v7 h-7 z M1,1 h5 v5 h-5 z M2,2 h3 v3 h-3 z" fill="currentColor" />
        <path d="M22,0 h7 v7 h-7 z M23,1 h5 v5 h-5 z M24,2 h3 v3 h-3 z" fill="currentColor" />
        <path d="M0,22 h7 v7 h-7 z M1,23 h5 v5 h-5 z M2,24 h3 v3 h-3 z" fill="currentColor" />
        {/* Alignment Pattern */}
        <path d="M22,22 h5 v5 h-5 z M23,23 h3 v3 h-3 z" fill="currentColor" />
        {/* Timing Patterns */}
        <path d="M8,6 h13 M6,8 v13" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1,1" />
        {/* Simulated data blocks for premium look */}
        <path
          d="M9,0 h2 v2 h-2 z M13,0 h1 v3 h-1 z M16,1 h3 v1 h-3 z M20,2 h1 v2 h-1 z"
          fill="currentColor"
        />
        <path
          d="M8,9 h3 v1 h-3 z M12,8 h2 v3 h-2 z M16,9 h1 v2 h-1 z M19,8 h2 v2 h-2 z"
          fill="currentColor"
        />
        <path
          d="M9,13 h1 v2 h-1 z M11,12 h3 v1 h-3 z M15,14 h3 v1 h-3 z M19,12 h1 v3 h-1 z"
          fill="currentColor"
        />
        <path
          d="M8,17 h2 v1 h-2 z M11,16 h1 v3 h-1 z M13,18 h2 v1 h-2 z M17,16 h3 v2 h-3 z"
          fill="currentColor"
        />
        <path
          d="M9,20 h3 v1 h-3 z M13,20 h2 v1 h-2 z M16,21 h1 v1 h-1 z M18,20 h2 v2 h-2 z"
          fill="currentColor"
        />
        <path
          d="M10,23 h2 v1 h-2 z M13,24 h1 v3 h-1 z M16,23 h3 v1 h-3 z M20,25 h1 v1 h-1 z"
          fill="currentColor"
        />
        <path
          d="M8,26 h3 v1 h-3 z M12,28 h2 v1 h-2 z M16,27 h1 v2 h-1 z M19,26 h2 v2 h-2 z"
          fill="currentColor"
        />
      </svg>
    );
  };

  // Render Front Side of ID Card (Vertical)
  const renderVerticalFront = (emp: (typeof employeesData)[0]) => {
    return (
      <div
        className="size-full flex flex-col justify-between relative bg-gradient-to-b from-[#ffffff] via-[#fbfcfd] to-[#f6f8fb] overflow-hidden"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Holographic security seal in the top-right corner */}
        <div className="absolute right-4.5 top-4.5 size-7 rounded-full opacity-[0.12] bg-gradient-to-tr from-cyan-400 via-pink-400 to-yellow-400 mix-blend-overlay border border-white/50 flex items-center justify-center pointer-events-none z-30">
          <svg
            className="size-4 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <path d="M2 12h20" />
          </svg>
        </div>

        {/* Subtle decorative background network lines */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0 overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="10" y1="20" x2="30" y2="50" stroke="black" strokeWidth="0.8" />
            <line x1="30" y1="50" x2="85" y2="25" stroke="black" strokeWidth="0.8" />
            <line x1="85" y1="25" x2="90" y2="70" stroke="black" strokeWidth="0.8" />
            <line x1="90" y1="70" x2="20" y2="85" stroke="black" strokeWidth="0.8" />
            <line x1="20" y1="85" x2="10" y2="20" stroke="black" strokeWidth="0.8" />
            <circle cx="10" cy="20" r="1.5" fill="black" />
            <circle cx="30" cy="50" r="2.5" fill="black" />
            <circle cx="85" cy="25" r="2.0" fill="black" />
            <circle cx="90" cy="70" r="1.5" fill="black" />
            <circle cx="20" cy="85" r="2.5" fill="black" />
          </svg>
        </div>

        {/* Outer Accent Border */}
        <div
          className="absolute inset-0 border-[1.5px] rounded-2xl pointer-events-none z-45"
          style={{ borderColor: themeColor }}
        />

        {/* Map through ordered layout elements */}
        {elementOrder.map((elementId, index) => {
          switch (elementId) {
            case "header":
              return (
                <div
                  key="header"
                  className="relative z-10 pt-6 pb-8 px-5 flex items-center justify-between shrink-0 rounded-b-[24px]"
                  style={{
                    background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}dd 100%)`,
                  }}
                >
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,white_0%,transparent_60%)] pointer-events-none" />
                  <div className="flex items-center gap-2.5 z-10">
                    {logoUrl && (
                      <img
                        src={logoUrl}
                        alt="Logo"
                        className="h-9 w-9 object-contain bg-white/95 rounded-lg p-1 border border-white/20 shadow-2xs"
                      />
                    )}
                    <div className="min-w-0 leading-none">
                      <span className="text-[12.5px] font-black tracking-wider text-white uppercase block">
                        {companyName}
                      </span>
                      <span className="text-[5.5px] font-extrabold text-white/75 tracking-widest uppercase block mt-0.5">
                        Excellence • Intelligence
                      </span>
                    </div>
                  </div>
                </div>
              );

            case "photo":
              const isAfterHeader = index > 0 && elementOrder[index - 1] === "header";
              return (
                <div
                  key="photo"
                  className={`relative z-20 flex justify-center shrink-0 ${isAfterHeader ? "-mt-7" : "py-3"}`}
                >
                  <div className="relative">
                    <div
                      className="size-30 rounded-[22px] bg-slate-100 border-[3.5px] overflow-hidden flex items-center justify-center shadow-lg relative z-10"
                      style={{ borderColor: themeColor }}
                    >
                      <UserRound className="size-16 text-slate-300" />
                    </div>
                    <div className="absolute -inset-[3.5px] rounded-[24px] border-[2px] border-white z-20 pointer-events-none" />
                    <div className="absolute -inset-[5.5px] rounded-[26px] border border-slate-200/50 z-0 pointer-events-none" />
                  </div>
                </div>
              );

            case "identity":
              return (
                <div key="identity" className="relative z-10 px-5 text-center shrink-0 mt-3">
                  <h4 className="font-black text-slate-800 text-[18px] tracking-tight leading-tight uppercase">
                    {emp.name}
                  </h4>
                  {showDesignation && (
                    <div className="mt-2 flex justify-center">
                      <span
                        className="text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest leading-none shadow-3xs border border-current/15"
                        style={{
                          color: themeColor,
                          backgroundColor: themeColor + "0d",
                        }}
                      >
                        {emp.title}
                      </span>
                    </div>
                  )}
                </div>
              );

            case "details":
              if (!showDepartment && !showJoinDate && !showBloodGroup) return null;
              return (
                <div key="details" className="relative z-10 px-5 shrink-0 my-1">
                  <div className="bg-white/90 border border-slate-200/50 rounded-2xl p-3.5 space-y-2.5 text-[9.5px] font-medium shadow-sm">
                    <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                      <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                        <svg
                          className="size-3.5 text-slate-400/80"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="3" y="4" width="18" height="16" rx="2" />
                          <circle cx="9" cy="10" r="2" />
                          <path d="M15 8h2M15 12h2M15 16h2" />
                        </svg>
                        Emp ID
                      </span>
                      <span className="font-extrabold text-slate-700">{emp.id}</span>
                    </div>
                    {showDepartment && (
                      <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                        <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                          <svg
                            className="size-3.5 text-slate-400/80"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 9h6M9 13h6M9 17h6" />
                          </svg>
                          Dept
                        </span>
                        <span className="font-extrabold text-slate-700 truncate max-w-[125px]">
                          {emp.dept}
                        </span>
                      </div>
                    )}
                    {showJoinDate && (
                      <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                        <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                          <svg
                            className="size-3.5 text-slate-400/80"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          Joined
                        </span>
                        <span className="font-extrabold text-slate-700">{emp.joinDate}</span>
                      </div>
                    )}
                    {showBloodGroup && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                          <svg
                            className="size-3.5 text-red-500/90"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                          Blood
                        </span>
                        <span className="font-black text-red-600 bg-red-500/5 px-2 py-0.5 rounded border border-red-500/10">
                          {emp.blood || "—"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );

            case "footer":
              return (
                <div key="footer" className="relative z-10 shrink-0">
                  {/* Elegant dark charcoal footer bar */}
                  <div className="w-full py-3 text-center text-[9px] font-black text-white tracking-[0.2em] uppercase flex items-center justify-center gap-1.5 bg-slate-900 shadow-lg">
                    <svg
                      className="size-3.5 text-white/80"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                      <path d="M2 12h20" />
                    </svg>
                    www.pakizasoftware.com
                  </div>
                </div>
              );

            default:
              return null;
          }
        })}
      </div>
    );
  };

  // Render Front Side of ID Card (Horizontal)
  const renderHorizontalFront = (emp: (typeof employeesData)[0]) => {
    return (
      <div
        className="size-full flex justify-between relative bg-gradient-to-r from-white via-[#fbfcfd] to-[#f6f8fb] p-5 overflow-hidden"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Outer Border */}
        <div
          className="absolute inset-0 border-[1.5px] rounded-2xl pointer-events-none z-40"
          style={{ borderColor: themeColor }}
        />

        {/* Left Side: Photo and Footer info */}
        <div className="w-[30%] flex flex-col justify-between items-center z-10 h-full py-1">
          <div className="relative">
            <div
              className="size-24 rounded-[18px] bg-slate-100 border-[2.5px] overflow-hidden flex items-center justify-center shadow-md relative z-10"
              style={{ borderColor: themeColor }}
            >
              <UserRound className="size-13 text-slate-300" />
            </div>
            <div className="absolute -inset-[2.5px] rounded-[20px] border-[1.5px] border-white z-20 pointer-events-none" />
          </div>

          <div className="text-[8.5px] font-bold text-slate-800 tracking-wider mt-2 flex items-center gap-1">
            <svg
              className="size-2.5 text-slate-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
            www.pakizasoftware.com
          </div>
        </div>

        {/* Right Side: Header, Identity, and Details */}
        <div className="w-[70%] pl-5 flex flex-col justify-between z-10 h-full py-1">
          {/* Logo Header */}
          <div className="flex items-center gap-2">
            {logoUrl && (
              <img
                src={logoUrl}
                alt="Logo"
                className="h-8.5 w-8.5 object-contain bg-white rounded-md p-0.5 border"
              />
            )}
            <div className="min-w-0 leading-tight">
              <span className="text-[12px] font-black text-slate-850 uppercase block">
                {companyName}
              </span>
              <span className="text-[5.5px] font-bold text-slate-400 tracking-wider uppercase block mt-0.5">
                Excellence | Intelligence | Automation
              </span>
            </div>
          </div>

          {/* Identity */}
          <div className="my-1.5">
            <h4 className="font-extrabold text-slate-900 text-[14.5px] leading-tight truncate uppercase">
              {emp.name}
            </h4>
            {showDesignation && (
              <div className="mt-1 flex">
                <span
                  className="text-[7.5px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{
                    color: themeColor,
                    backgroundColor: themeColor + "15",
                  }}
                >
                  {emp.title}
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[8.5px] bg-white border border-slate-200/50 p-2.5 rounded-xl shadow-3xs">
            <div>
              <span className="text-slate-400 font-bold block uppercase text-[6.5px]">Emp ID</span>
              <span className="font-extrabold text-slate-700">{emp.id}</span>
            </div>
            {showDepartment && (
              <div className="truncate">
                <span className="text-slate-400 font-bold block uppercase text-[6.5px]">Dept</span>
                <span className="font-extrabold text-slate-700 truncate block">{emp.dept}</span>
              </div>
            )}
            {showJoinDate && (
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[6.5px]">
                  Join Date
                </span>
                <span className="font-extrabold text-slate-700">{emp.joinDate}</span>
              </div>
            )}
            {showBloodGroup && (
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[6.5px]">Blood</span>
                <span className="font-black text-red-600">{emp.blood || "—"}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render Back Side of ID Card (Vertical)
  const renderVerticalBack = (emp: (typeof employeesData)[0]) => {
    return (
      <div
        className="size-full flex flex-col justify-between relative bg-gradient-to-b from-white via-[#fbfcfd] to-[#f6f8fb] overflow-hidden"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Outer Accent Border */}
        <div
          className="absolute inset-0 border-[1.5px] rounded-2xl pointer-events-none z-45"
          style={{ borderColor: themeColor }}
        />

        {/* Subtle background network lines graphic */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <line x1="0" y1="25" x2="100" y2="25" stroke="black" strokeWidth="0.8" />
            <line x1="0" y1="75" x2="100" y2="75" stroke="black" strokeWidth="0.8" />
            <line x1="25" y1="0" x2="25" y2="100" stroke="black" strokeWidth="0.8" />
            <line x1="75" y1="0" x2="75" y2="100" stroke="black" strokeWidth="0.8" />
            <circle cx="25" cy="25" r="1.5" fill="black" />
            <circle cx="75" cy="25" r="1.5" fill="black" />
            <circle cx="25" cy="75" r="1.5" fill="black" />
            <circle cx="75" cy="75" r="1.5" fill="black" />
          </svg>
        </div>

        {/* Top Header Block */}
        <div className="pt-6 px-5 shrink-0 z-10">
          <div
            className="w-full py-2 rounded-lg text-center font-extrabold text-white text-[11.5px] uppercase tracking-[0.25em] shadow-xs"
            style={{ backgroundColor: themeColor }}
          >
            IDENTITY CARD
          </div>
        </div>

        {/* Middle Two-Column Grid - Perfectly Aligned */}
        <div className="flex-1 px-5 py-4 flex items-center justify-between gap-5 z-10">
          {/* Left Column: QR Code Container + Left Details */}
          <div className="w-[47%] flex flex-col justify-between h-full py-1">
            {/* Elegant QR Code Frame */}
            <div className="relative size-20 bg-white border border-slate-200 rounded-2xl p-2.5 flex items-center justify-center self-center shadow-sm">
              {renderQRCodeSVG()}
              {/* Inner white ring for QR frame */}
              <div className="absolute -inset-[1px] rounded-2xl border-[1.5px] border-white pointer-events-none" />
            </div>

            {/* Left Details */}
            <div className="space-y-2 text-[9.5px] mt-3">
              <div>
                <span className="text-slate-400 font-extrabold block text-[7px] uppercase tracking-wider">
                  D O B
                </span>
                <span className="font-bold text-slate-800">{emp.dob || "22/12/1999"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-extrabold block text-[7px] uppercase tracking-wider">
                  Gender
                </span>
                <span className="font-bold text-slate-800">{emp.gender || "Male"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-extrabold block text-[7px] uppercase tracking-wider">
                  Joining Date
                </span>
                <span className="font-bold text-slate-800">{emp.joinDate}</span>
              </div>
            </div>
          </div>

          {/* Center Divider Line */}
          <div className="w-[1px] bg-slate-200/80 self-stretch my-2 shrink-0" />

          {/* Right Column: Decorative Graphic + Right Details */}
          <div className="w-[47%] flex flex-col justify-between h-full py-1 relative pl-2.5">
            {/* Embedded vector pattern inside the column */}
            <div className="absolute right-0 top-2 size-20 opacity-[0.04] pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 100 100">
                <line x1="10" y1="10" x2="60" y2="40" stroke="black" strokeWidth="2" />
                <line x1="60" y1="40" x2="80" y2="80" stroke="black" strokeWidth="2" />
                <line x1="10" y1="10" x2="80" y2="80" stroke="black" strokeWidth="2" />
                <circle cx="10" cy="10" r="5" fill="black" />
                <circle cx="60" cy="40" r="8" fill="black" />
                <circle cx="80" cy="80" r="6" fill="black" />
              </svg>
            </div>

            {/* Right Details */}
            <div className="space-y-4 text-[9.5px] mt-1 z-10 flex-1 flex flex-col justify-center">
              <div>
                <span className="text-slate-400 font-extrabold block text-[7px] uppercase tracking-wider">
                  Employee No.
                </span>
                <span className="font-extrabold text-slate-800 text-[11px] mt-0.5 block">
                  {emp.id}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-extrabold block text-[7px] uppercase tracking-wider">
                  Blood Group
                </span>
                <span className="font-black text-red-600 bg-red-500/5 px-2 py-0.5 rounded border border-red-500/10 mt-1 inline-block">
                  {emp.blood || "—"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Signature Block with Line */}
        <div className="px-5 text-center shrink-0 z-10 flex flex-col items-center py-1">
          {signatureUrl && (
            <img
              src={signatureUrl}
              alt="Signature"
              className="h-7.5 w-18 object-contain mix-blend-multiply filter contrast-125"
            />
          )}
          <div className="w-24 h-[1px] bg-slate-300 my-1" />
          <span className="text-[7px] text-slate-400 font-extrabold tracking-widest uppercase">
            Authorized Signature
          </span>
        </div>

        {/* Dynamic Back Notice Text */}
        <div className="px-5 pt-3 pb-2.5 text-center shrink-0 z-10 border-t border-slate-100 bg-slate-50/30">
          <p className="text-[8px] font-semibold text-slate-500 leading-relaxed whitespace-pre-line max-w-[240px] mx-auto">
            {backText}
          </p>
        </div>

        {/* Solid Colored Footer Notice */}
        <div
          className="w-full py-2.5 text-center text-[7.5px] font-black text-white uppercase tracking-[0.18em] shrink-0"
          style={{ backgroundColor: themeColor }}
        >
          If found unattended, please return to below address
        </div>
      </div>
    );
  };

  // Render Back Side of ID Card (Horizontal)
  const renderHorizontalBack = (emp: (typeof employeesData)[0]) => {
    return (
      <div
        className="size-full flex flex-col justify-between relative bg-gradient-to-b from-white via-[#fbfcfd] to-[#f6f8fb] p-4 overflow-hidden"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Outer Border */}
        <div
          className="absolute inset-0 border-[1.5px] rounded-2xl pointer-events-none z-40"
          style={{ borderColor: themeColor }}
        />

        {/* Top bar */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-100 z-10">
          <span className="text-[9px] font-black text-slate-850 tracking-wider uppercase flex items-center gap-1.5">
            {logoUrl && (
              <img src={logoUrl} alt="Logo" className="h-5 w-6 object-contain grayscale" />
            )}
            {companyName}
          </span>
          <div
            className="px-2.5 py-0.5 rounded-md text-white text-[7.5px] font-extrabold uppercase tracking-wider"
            style={{ backgroundColor: themeColor }}
          >
            IDENTITY CARD
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex gap-5 items-center py-2 z-10">
          {/* QR Code */}
          <div className="size-15 bg-white border border-slate-200 p-1.5 rounded-xl flex items-center justify-center shrink-0 shadow-3xs">
            {renderQRCodeSVG()}
          </div>

          {/* Details Grid */}
          <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[8.5px] leading-tight">
            <div>
              <span className="text-slate-400 font-extrabold block text-[6px] uppercase tracking-wider">
                Employee No
              </span>
              <span className="font-bold text-slate-800">{emp.id}</span>
            </div>
            <div>
              <span className="text-slate-400 font-extrabold block text-[6px] uppercase tracking-wider">
                Blood Group
              </span>
              <span className="font-extrabold text-red-600">{emp.blood || "—"}</span>
            </div>
            <div>
              <span className="text-slate-400 font-extrabold block text-[6px] uppercase tracking-wider">
                D O B
              </span>
              <span className="font-bold text-slate-800">{emp.dob || "22/12/1999"}</span>
            </div>
            <div>
              <span className="text-slate-400 font-extrabold block text-[6px] uppercase tracking-wider">
                Joining Date
              </span>
              <span className="font-bold text-slate-800">{emp.joinDate}</span>
            </div>
          </div>

          {/* Signature */}
          <div className="shrink-0 flex flex-col items-center justify-center pl-3 border-l border-slate-150 h-14">
            {signatureUrl && (
              <img
                src={signatureUrl}
                alt="Signature"
                className="h-5.5 w-14 object-contain mix-blend-multiply"
              />
            )}
            <div className="w-14 h-[1px] bg-slate-300 my-0.5" />
            <span className="text-[6px] text-slate-400 font-extrabold tracking-wider uppercase">
              Auth Sign
            </span>
          </div>
        </div>

        {/* Bottom Address / Notice text */}
        <div className="flex justify-between items-center border-t border-slate-100 pt-2 z-10 text-[7px] text-slate-400 font-semibold">
          <span className="truncate max-w-[220px]">
            {backText.split("\n")[0] || "If found, please return to office."}
          </span>
          <span className="text-[7.5px] font-extrabold text-slate-700">
            info@pakizasoftware.com
          </span>
        </div>
      </div>
    );
  };

  const renderCardFront = (emp: (typeof employeesData)[0], sizeStyle = {}) => {
    if (orientation === "vertical") {
      return renderVerticalFront(emp);
    } else {
      return renderHorizontalFront(emp);
    }
  };

  const renderCardBack = (emp: (typeof employeesData)[0], sizeStyle = {}) => {
    if (orientation === "vertical") {
      return renderVerticalBack(emp);
    } else {
      return renderHorizontalBack(emp);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Topbar Nav */}
        <Topbar />

        {/* Main Content Container */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-5">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <UserRound className="size-5" />
                </div>
                <h1 className="text-2xl font-black tracking-tight text-foreground">
                  ID Card Setup & Designer
                </h1>
              </div>
              <p className="text-xs text-muted-foreground mt-1 max-w-xl">
                Configure brand templates, design custom cards, and print individual or bulk
                employee badges in high-resolution.
              </p>
            </div>

            {/* Tab Swapping Controls */}
            <div className="flex items-center p-1 bg-muted/80 rounded-xl border border-border/30 self-start md:self-auto">
              <button
                onClick={() => setActiveTab("design")}
                className={`h-9 px-4.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "design"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <SlidersHorizontal className="size-3.5" />
                Card Designer
              </button>
              <button
                onClick={() => setActiveTab("bulk")}
                className={`h-9 px-4.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "bulk"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Users className="size-3.5" />
                Bulk Card Printer
                {bulkSelectedEmpIds.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary-foreground text-primary text-[10px] font-extrabold">
                    {bulkSelectedEmpIds.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Core App View */}
          {activeTab === "design" ? (
            /* ==================== CARD DESIGNER VIEW ==================== */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Configuration Forms (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Save & Load Templates Section */}
                <div className="p-5 rounded-2xl bg-card border border-border/40 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-border/20">
                    <div className="flex items-center gap-2.5">
                      <Layers className="size-4.5 text-primary" />
                      <h3 className="text-sm font-bold text-foreground">Design Templates</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSaveTemplateModal(true)}
                      className="h-8 px-3 rounded-lg bg-primary/15 hover:bg-primary/20 text-primary text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="size-3.5" />
                      Create Template
                    </button>
                  </div>

                  {/* System & User Templates Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Render System Templates */}
                    {SYSTEM_TEMPLATES.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => handleLoadTemplate(t)}
                        className="p-3 rounded-xl border border-border/40 hover:border-primary/50 hover:bg-muted/30 cursor-pointer transition flex items-center justify-between group"
                      >
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-foreground block truncate">
                            {t.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">
                            {t.orientation} • {t.themeColor}
                          </span>
                        </div>
                        <span className="text-[9px] font-extrabold text-primary bg-primary/10 px-1.5 py-0.5 rounded uppercase">
                          System
                        </span>
                      </div>
                    ))}

                    {/* Render User Templates */}
                    {savedTemplates.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => handleLoadTemplate(t)}
                        className="p-3 rounded-xl border border-border/40 hover:border-primary/50 hover:bg-muted/30 cursor-pointer transition flex items-center justify-between group"
                      >
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-foreground block truncate">
                            {t.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">
                            {t.orientation} • {t.themeColor}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteTemplate(t.id, e)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition cursor-pointer"
                          title="Delete Template"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    ))}

                    {savedTemplates.length === 0 && (
                      <div className="md:col-span-2 text-center p-3 rounded-xl border border-dashed border-border/40 text-xs text-muted-foreground font-medium">
                        No custom templates saved. Configure a style and click "Create Template" to
                        store it.
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 1: Select Employee */}
                <div className="p-5 rounded-2xl bg-card border border-border/40 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-border/20">
                    <span className="flex items-center justify-center size-6 rounded-lg bg-primary/10 text-primary text-xs font-extrabold">
                      1
                    </span>
                    <h3 className="text-sm font-bold text-foreground">Select Employee Profile</h3>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                      Search and Choose Staff
                    </label>
                    <SearchableSelect
                      options={employeeOptions}
                      value={selectedEmpId}
                      onChange={setSelectedEmpId}
                      placeholder="Search employee by name, ID or title..."
                    />
                  </div>

                  {selectedEmployee && (
                    <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/30 text-xs font-sans">
                      <div>
                        <span className="text-muted-foreground block text-[10px] font-semibold uppercase tracking-wide">
                          Name
                        </span>
                        <span className="font-bold text-foreground">{selectedEmployee.name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] font-semibold uppercase tracking-wide">
                          ID Number
                        </span>
                        <span className="font-bold text-foreground">{selectedEmployee.id}</span>
                      </div>
                      <div className="mt-1.5">
                        <span className="text-muted-foreground block text-[10px] font-semibold uppercase tracking-wide">
                          Designation
                        </span>
                        <span className="font-bold text-foreground">{selectedEmployee.title}</span>
                      </div>
                      <div className="mt-1.5">
                        <span className="text-muted-foreground block text-[10px] font-semibold uppercase tracking-wide">
                          Department
                        </span>
                        <span className="font-bold text-foreground">{selectedEmployee.dept}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Drag and Drop Layout Manager */}
                <div className="p-5 rounded-2xl bg-card border border-border/40 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-border/20">
                    <div className="flex items-center gap-2.5">
                      <GripVertical className="size-4.5 text-primary" />
                      <h3 className="text-sm font-bold text-foreground">
                        Card Elements Layout (Drag & Drop)
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground font-medium">
                    Drag and drop items to rearrange their vertical order on the front side of the
                    ID card, or use the up/down arrows.
                  </p>

                  <div className="space-y-2">
                    {elementOrder.map((elementId, index) => {
                      const labelMap: Record<string, string> = {
                        header: "Header (Logo & Tagline)",
                        photo: "Employee Photo",
                        identity: "Identity (Name & Designation)",
                        details: "Details Block (ID, Dept, Blood, Join Date)",
                        footer: "Footer (Website Link)",
                      };

                      return (
                        <div
                          key={elementId}
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragEnter={() => handleDragEnter(index)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => e.preventDefault()}
                          className="flex items-center justify-between p-3.5 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/40 transition duration-150 cursor-grab active:cursor-grabbing group select-none"
                        >
                          <div className="flex items-center gap-3">
                            <GripVertical className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="text-xs font-bold text-foreground">
                              {labelMap[elementId]}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => moveElement(index, "up")}
                              className="p-1.5 rounded-lg border border-border/20 hover:bg-card text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                              title="Move Up"
                            >
                              <ArrowUp className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={index === elementOrder.length - 1}
                              onClick={() => moveElement(index, "down")}
                              className="p-1.5 rounded-lg border border-border/20 hover:bg-card text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                              title="Move Down"
                            >
                              <ArrowDown className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Branding & Color Theme */}
                <div className="p-5 rounded-2xl bg-card border border-border/40 space-y-5 shadow-sm">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-border/20">
                    <span className="flex items-center justify-center size-6 rounded-lg bg-primary/10 text-primary text-xs font-extrabold">
                      2
                    </span>
                    <h3 className="text-sm font-bold text-foreground">
                      Brand & Color Configuration
                    </h3>
                  </div>

                  {/* Company Name */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                      Company Name / Header
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl bg-muted border border-border/40 text-xs font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                      placeholder="Enter company name..."
                    />
                  </div>

                  {/* Orientation & Theme Accent */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                    {/* Orientation */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                        Card Layout Style
                      </label>
                      <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl border border-border/30">
                        <button
                          type="button"
                          onClick={() => setOrientation("vertical")}
                          className={`h-8 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            orientation === "vertical"
                              ? "bg-card text-foreground shadow-xs border border-border/40"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Vertical
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrientation("horizontal")}
                          className={`h-8 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            orientation === "horizontal"
                              ? "bg-card text-foreground shadow-xs border border-border/40"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Horizontal
                        </button>
                      </div>
                    </div>

                    {/* Theme Accent Color */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1 font-sans">
                        <Palette className="size-3.5 text-primary" /> Accent Color
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          {PRESET_COLORS.map((color) => (
                            <button
                              key={color.value}
                              type="button"
                              onClick={() => setThemeColor(color.value)}
                              style={{ backgroundColor: color.value }}
                              title={color.name}
                              className={`size-6 rounded-full border-2 transition-transform cursor-pointer hover:scale-110 flex items-center justify-center ${
                                themeColor === color.value
                                  ? "border-foreground"
                                  : "border-transparent"
                              }`}
                            >
                              {themeColor === color.value && (
                                <Check className="size-3 text-white mix-blend-difference" />
                              )}
                            </button>
                          ))}
                        </div>

                        <div className="relative size-6 rounded-full overflow-hidden border border-border/60 hover:scale-105 transition cursor-pointer">
                          <input
                            type="color"
                            value={themeColor}
                            onChange={(e) => setThemeColor(e.target.value)}
                            className="absolute inset-0 size-full p-0 border-0 opacity-0 cursor-pointer"
                          />
                          <div
                            className="size-full bg-gradient-to-tr from-red-500 via-green-500 to-blue-500"
                            style={{ backgroundColor: themeColor }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upload Logo & Signature */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    <div className="space-y-2">
                      <label className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                        Company Logo
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          ref={logoInputRef}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          className="flex-1 h-10 px-3 rounded-xl border border-border/60 hover:bg-muted/60 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Upload className="size-3.5 text-muted-foreground" />
                          Upload Logo
                        </button>
                        {logoUrl !== DEFAULT_LOGO_SVG && (
                          <button
                            type="button"
                            onClick={() => setLogoUrl(DEFAULT_LOGO_SVG)}
                            className="h-10 px-3 rounded-xl border border-border/40 hover:bg-red-500/10 hover:text-red-500 text-xs font-bold transition cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                        Authorized Signature
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSignatureUpload}
                          ref={sigInputRef}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => sigInputRef.current?.click()}
                          className="flex-1 h-10 px-3 rounded-xl border border-border/60 hover:bg-muted/60 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Upload className="size-3.5 text-muted-foreground" />
                          Upload Sign
                        </button>
                        {signatureUrl !== DEFAULT_SIGNATURE_SVG && (
                          <button
                            type="button"
                            onClick={() => setSignatureUrl(DEFAULT_SIGNATURE_SVG)}
                            className="h-10 px-3 rounded-xl border border-border/40 hover:bg-red-500/10 hover:text-red-500 text-xs font-bold transition cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Card Content & Fields */}
                <div className="p-5 rounded-2xl bg-card border border-border/40 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-border/20">
                    <span className="flex items-center justify-center size-6 rounded-lg bg-primary/10 text-primary text-xs font-extrabold">
                      3
                    </span>
                    <h3 className="text-sm font-bold text-foreground">Content Customization</h3>
                  </div>

                  {/* Display Field Toggles */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground block">
                      Show/Hide Card Info Fields
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <label className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/30 border border-border/20 cursor-pointer hover:bg-muted/50 transition">
                        <input
                          type="checkbox"
                          checked={showDesignation}
                          onChange={(e) => setShowDesignation(e.target.checked)}
                          className="rounded border-border text-primary focus:ring-primary/25 size-4"
                        />
                        <span className="text-xs font-bold text-foreground">Designation</span>
                      </label>

                      <label className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/30 border border-border/20 cursor-pointer hover:bg-muted/50 transition">
                        <input
                          type="checkbox"
                          checked={showDepartment}
                          onChange={(e) => setShowDepartment(e.target.checked)}
                          className="rounded border-border text-primary focus:ring-primary/25 size-4"
                        />
                        <span className="text-xs font-bold text-foreground">Department</span>
                      </label>

                      <label className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/30 border border-border/20 cursor-pointer hover:bg-muted/50 transition">
                        <input
                          type="checkbox"
                          checked={showBloodGroup}
                          onChange={(e) => setShowBloodGroup(e.target.checked)}
                          className="rounded border-border text-primary focus:ring-primary/25 size-4"
                        />
                        <span className="text-xs font-bold text-foreground">Blood Group</span>
                      </label>

                      <label className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/30 border border-border/20 cursor-pointer hover:bg-muted/50 transition">
                        <input
                          type="checkbox"
                          checked={showJoinDate}
                          onChange={(e) => setShowJoinDate(e.target.checked)}
                          className="rounded border-border text-primary focus:ring-primary/25 size-4"
                        />
                        <span className="text-xs font-bold text-foreground">Join Date</span>
                      </label>

                      <label className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/30 border border-border/20 cursor-pointer hover:bg-muted/50 transition">
                        <input
                          type="checkbox"
                          checked={showBarcode}
                          onChange={(e) => setShowBarcode(e.target.checked)}
                          className="rounded border-border text-primary focus:ring-primary/25 size-4"
                        />
                        <span className="text-xs font-bold text-foreground">Barcode (Back)</span>
                      </label>
                    </div>
                  </div>

                  {/* Back-side Text */}
                  <div className="space-y-2 pt-2">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <FileText className="size-3.5 text-primary" /> Back Side Notice Text
                    </label>
                    <textarea
                      rows={4}
                      value={backText}
                      onChange={(e) => setBackText(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-muted border border-border/40 text-xs font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition resize-y font-sans leading-relaxed"
                      placeholder="Enter terms..."
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive 3D Preview Panel (5 cols) */}
              <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
                <div className="p-5 rounded-2xl bg-card border border-border/40 shadow-sm flex flex-col items-center">
                  <div className="w-full flex items-center justify-between pb-4 border-b border-border/20 mb-6">
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <Eye className="size-4 text-primary" /> Live 3D Preview
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="h-8 px-3 rounded-lg bg-muted border border-border/30 text-xs font-bold hover:bg-muted/80 text-foreground transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCcw className="size-3" />
                      Flip Card ({isFlipped ? "Front" : "Back"})
                    </button>
                  </div>

                  {/* 3D Card Scene */}
                  <div
                    className="relative select-none animate-in fade-in zoom-in-95 duration-200"
                    style={{
                      perspective: "1200px",
                      width: orientation === "vertical" ? "280px" : "420px",
                      height: orientation === "vertical" ? "440px" : "280px",
                    }}
                  >
                    <div
                      className="relative w-full h-full transition-transform duration-700 ease-out cursor-pointer"
                      style={{
                        transformStyle: "preserve-3d",
                        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                      }}
                      onClick={() => setIsFlipped(!isFlipped)}
                    >
                      {/* CARD FRONT */}
                      <div
                        className="absolute inset-0 w-full h-full bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
                        style={{
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                        }}
                      >
                        {renderCardFront(selectedEmployee)}
                      </div>

                      {/* CARD BACK */}
                      <div
                        className="absolute inset-0 w-full h-full bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
                        style={{
                          transform: "rotateY(180deg)",
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                        }}
                      >
                        {renderCardBack(selectedEmployee)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 px-3.5 py-1.5 rounded-xl border border-border/20">
                    <Info className="size-3.5 text-primary shrink-0" />
                    <span>Click on the card to flip it and view the other side</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-card border border-border/40 space-y-3.5 shadow-sm">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Sparkles className="size-4 text-amber-500" />
                    Printing Instructions
                  </h4>
                  <ul className="space-y-2 text-xs text-muted-foreground font-medium">
                    <li className="flex gap-2">
                      <Check className="size-4 text-green-500 shrink-0 mt-0.5" />
                      <span>
                        For CR80 plastic card printers, choose <strong>54mm x 86mm</strong> card
                        size in print settings.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <Check className="size-4 text-green-500 shrink-0 mt-0.5" />
                      <span>
                        To ensure background colors and waves print correctly, enable{" "}
                        <strong>Background graphics</strong> in your browser's print options.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            /* ==================== BULK CARD PRINTER VIEW ==================== */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Filter and select (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Bulk Controls */}
                <div className="p-5 rounded-2xl bg-card border border-border/40 space-y-5 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-border/20">
                    <div className="flex items-center gap-2.5">
                      <Users className="size-4.5 text-primary" />
                      <h3 className="text-sm font-bold text-foreground">
                        Filter Employee Profiles
                      </h3>
                    </div>

                    <button
                      onClick={handlePrint}
                      disabled={bulkSelectedEmpIds.length === 0}
                      className="h-9 px-4 rounded-xl bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground text-xs font-extrabold transition flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Printer className="size-3.5" />
                      Print Selected ({bulkSelectedEmpIds.length})
                    </button>
                  </div>

                  {/* Filters Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search query */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                        Search Staff
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/75" />
                        <input
                          type="text"
                          value={bulkSearchQuery}
                          onChange={(e) => setBulkSearchQuery(e.target.value)}
                          placeholder="Search by name, ID, or designation..."
                          className="w-full h-10 pl-10 pr-3.5 rounded-xl bg-muted border border-border/40 text-xs font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                        />
                      </div>
                    </div>

                    {/* Department Filter */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                        Department
                      </label>
                      <select
                        value={bulkDeptFilter}
                        onChange={(e) => setBulkDeptFilter(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition cursor-pointer text-foreground"
                      >
                        <option value="ALL">All Departments</option>
                        {departmentsList.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Template Filter */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                        Card Template
                      </label>
                      <select
                        onChange={(e) => {
                          const val = e.target.value;
                          const t = [...SYSTEM_TEMPLATES, ...savedTemplates].find(
                            (temp) => temp.id === val,
                          );
                          if (t) handleLoadTemplate(t);
                        }}
                        className="w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition cursor-pointer text-foreground"
                      >
                        <option value="">Select Template...</option>
                        <optgroup label="System Templates">
                          {SYSTEM_TEMPLATES.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name}
                            </option>
                          ))}
                        </optgroup>
                        {savedTemplates.length > 0 && (
                          <optgroup label="Custom Templates">
                            {savedTemplates.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name}
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Print Layout Mode Toggle */}
                  <div className="space-y-2 pt-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                      Bulk Print Layout Mode
                    </label>
                    <div className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-xl border border-border/30">
                      <button
                        onClick={() => setBulkPrintMode("both")}
                        className={`h-8 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                          bulkPrintMode === "both"
                            ? "bg-card text-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Front & Back
                      </button>
                      <button
                        onClick={() => setBulkPrintMode("front")}
                        className={`h-8 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                          bulkPrintMode === "front"
                            ? "bg-card text-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Fronts Only
                      </button>
                      <button
                        onClick={() => setBulkPrintMode("back")}
                        className={`h-8 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                          bulkPrintMode === "back"
                            ? "bg-card text-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Backs Only
                      </button>
                    </div>
                  </div>
                </div>

                {/* Employee List Table */}
                <div className="p-5 rounded-2xl bg-card border border-border/40 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-foreground">
                      Showing {filteredEmployees.length} of {employeesData.length} employees
                    </div>

                    <button
                      type="button"
                      onClick={toggleSelectAllBulk}
                      className="text-xs text-primary font-bold hover:underline cursor-pointer"
                    >
                      {filteredEmployees.every((emp) => bulkSelectedEmpIds.includes(emp.id))
                        ? "Deselect All Filtered"
                        : "Select All Filtered"}
                    </button>
                  </div>

                  <div className="border border-border/30 rounded-xl overflow-hidden divide-y divide-border/20 max-h-96 overflow-y-auto">
                    {filteredEmployees.map((emp) => {
                      const isSelected = bulkSelectedEmpIds.includes(emp.id);
                      return (
                        <div
                          key={emp.id}
                          onClick={() => toggleSelectEmployeeBulk(emp.id)}
                          className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${
                            isSelected ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/30"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded border-border text-primary focus:ring-primary/25 size-4"
                          />

                          <div className="size-8 rounded-lg bg-slate-850/10 border flex items-center justify-center shrink-0">
                            <UserRound className="size-4.5 text-muted-foreground" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-foreground truncate">
                                {emp.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-semibold">
                                {emp.id}
                              </span>
                            </div>
                            <div className="flex justify-between text-[10px] text-muted-foreground font-semibold mt-0.5">
                              <span className="truncate">{emp.title}</span>
                              <span className="truncate">{emp.dept}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {filteredEmployees.length === 0 && (
                      <div className="p-8 text-center text-xs text-muted-foreground font-medium">
                        No employees found matching the filters.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Bulk Print Preview (5 cols) */}
              <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
                <div className="p-5 rounded-2xl bg-card border border-border/40 shadow-sm space-y-4 flex flex-col">
                  <div className="pb-3 border-b border-border/20">
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <Printer className="size-4 text-primary" />
                      Bulk Preview ({bulkSelectedEmpIds.length} Cards)
                    </h3>
                  </div>

                  {bulkSelectedEmpIds.length > 0 ? (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                      <div className="grid grid-cols-2 gap-4">
                        {bulkSelectedEmpIds.map((id) => {
                          const emp = employeesData.find((e) => e.id === id);
                          if (!emp) return null;
                          return (
                            <div
                              key={emp.id}
                              className="border border-border/30 rounded-xl overflow-hidden aspect-[1.58] bg-white relative shadow-sm"
                              style={{
                                height: orientation === "vertical" ? "210px" : "135px",
                                width: orientation === "vertical" ? "210px" : "135px",
                                margin: "0 auto",
                              }}
                            >
                              {/* Scale down the card to fit the preview grid */}
                              <div
                                className="absolute origin-top-left scale-[0.48]"
                                style={{
                                  width: orientation === "vertical" ? "280px" : "440px",
                                  height: orientation === "vertical" ? "440px" : "280px",
                                }}
                              >
                                {renderCardFront(emp)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 px-4 border border-dashed border-border/40 rounded-xl text-xs text-muted-foreground font-medium">
                      Select employees from the list to see their card previews.
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground bg-muted/40 p-3.5 rounded-xl border border-border/20 flex gap-2">
                    <Info className="size-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      The bulk preview shows the card fronts. Clicking{" "}
                      <strong>Print Selected</strong> will print all fronts and backs based on your
                      layout mode.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ==================== SAVE TEMPLATE MODAL ==================== */}
      {showSaveTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-border/50 rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-black text-foreground">Save ID Card Template</h3>

            <form onSubmit={handleSaveTemplate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  Template Name
                </label>
                <input
                  type="text"
                  required
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="e.g. Standard Blue Portal,Savannah Factory..."
                  className="w-full h-10 px-3.5 rounded-xl bg-muted border border-border/40 text-xs font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition text-foreground"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setNewTemplateName("");
                    setShowSaveTemplateModal(false);
                  }}
                  className="h-10 px-4 rounded-xl border border-border/60 hover:bg-muted text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-extrabold transition cursor-pointer"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== BULK PRINT ONLY LAYOUT ==================== */}
      <div id="id-card-print-layout" className="hidden print:block print:bg-white print:text-black">
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #id-card-print-layout, #id-card-print-layout * {
              visibility: visible;
            }
            #id-card-print-layout {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: auto;
              background: white !important;
              color: black !important;
              padding: 0 !important;
              margin: 0 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .print-grid-container {
              display: grid !important;
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 20px 15px !important;
              padding: 15mm !important;
              background: white !important;
            }
            
            .print-card-pair-wrapper {
              display: flex !important;
              flex-direction: row !important;
              gap: 10px !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              margin-bottom: 5px !important;
            }

            .print-card-item {
              box-shadow: none !important;
              border: 1px solid #94a3b8 !important;
              background-color: white !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              border-radius: 8px !important;
              overflow: hidden !important;
            }
          }
        `}</style>

        <div className="print-grid-container">
          {activeTab === "design" ? (
            /* Single Card Print Layout */
            <div className="print-card-pair-wrapper col-span-2 justify-center">
              {/* Front */}
              {(bulkPrintMode === "both" || bulkPrintMode === "front") && (
                <div
                  className="print-card-item"
                  style={{
                    width: orientation === "vertical" ? "54mm" : "86mm",
                    height: orientation === "vertical" ? "86mm" : "54mm",
                  }}
                >
                  {renderCardFront(selectedEmployee)}
                </div>
              )}

              {/* Back */}
              {(bulkPrintMode === "both" || bulkPrintMode === "back") && (
                <div
                  className="print-card-item"
                  style={{
                    width: orientation === "vertical" ? "54mm" : "86mm",
                    height: orientation === "vertical" ? "86mm" : "54mm",
                  }}
                >
                  {renderCardBack(selectedEmployee)}
                </div>
              )}
            </div>
          ) : (
            /* Bulk Cards Print Layout */
            bulkSelectedEmpIds.map((id) => {
              const emp = employeesData.find((e) => e.id === id);
              if (!emp) return null;
              return (
                <div key={emp.id} className="print-card-pair-wrapper">
                  {/* Front */}
                  {(bulkPrintMode === "both" || bulkPrintMode === "front") && (
                    <div
                      className="print-card-item"
                      style={{
                        width: orientation === "vertical" ? "54mm" : "86mm",
                        height: orientation === "vertical" ? "86mm" : "54mm",
                      }}
                    >
                      {renderCardFront(emp)}
                    </div>
                  )}

                  {/* Back */}
                  {(bulkPrintMode === "both" || bulkPrintMode === "back") && (
                    <div
                      className="print-card-item"
                      style={{
                        width: orientation === "vertical" ? "54mm" : "86mm",
                        height: orientation === "vertical" ? "86mm" : "54mm",
                      }}
                    >
                      {renderCardBack(emp)}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
