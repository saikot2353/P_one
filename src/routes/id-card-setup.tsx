import { useState, useMemo, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { employeesData } from "@/routes/personnel-list";
import { 
  UserRound, Printer, Upload, Palette, FileText, 
  Check, RefreshCcw, Sparkles, Info, Eye
} from "lucide-react";

export const Route = createFileRoute("/id-card-setup")({
  head: () => ({
    meta: [
      { title: "ID Card Setup — CRIPTON" },
      { name: "description", content: "Design, configure, and generate dynamic employee ID cards with live preview and print layout." },
    ],
  }),
  component: IDCardSetupPage,
});

// Preset colors for the ID Card theme
const PRESET_COLORS = [
  { name: "Corporate Blue", value: "#1e88e5" },
  { name: "Emerald Green", value: "#10b981" },
  { name: "Indigo Velvet", value: "#6366f1" },
  { name: "Crimson Red", value: "#ef4444" },
  { name: "Slate Charcoal", value: "#374151" },
];

// Default base64 placeholders so the UI looks complete out-of-the-box
const DEFAULT_LOGO_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="40" stroke="%231e88e5" stroke-width="8"/><path d="M35 50 L45 60 L65 40" stroke="%231e88e5" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const DEFAULT_SIGNATURE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" fill="none"><path d="M20 50 C 40 20, 50 70, 70 30 C 90 10, 100 60, 120 45 C 140 30, 150 50, 180 35" stroke="%231a1a1a" stroke-width="4" stroke-linecap="round" fill="none"/></svg>`;

function IDCardSetupPage() {
  // State for card configuration
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employeesData[0]?.id || "");
  const [orientation, setOrientation] = useState<"vertical" | "horizontal">("vertical");
  const [themeColor, setThemeColor] = useState<string>("#1e88e5");
  const [companyName, setCompanyName] = useState<string>("CRIPTON GROUP");
  const [logoUrl, setLogoUrl] = useState<string>(DEFAULT_LOGO_SVG);
  const [signatureUrl, setSignatureUrl] = useState<string>(DEFAULT_SIGNATURE_SVG);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  
  // Toggle visible elements
  const [showBloodGroup, setShowBloodGroup] = useState<boolean>(true);
  const [showJoinDate, setShowJoinDate] = useState<boolean>(true);
  const [showDepartment, setShowDepartment] = useState<boolean>(true);
  const [showDesignation, setShowDesignation] = useState<boolean>(true);
  const [showBarcode, setShowBarcode] = useState<boolean>(true);
  
  // Custom text on back side
  const [backText, setBackText] = useState<string>(
    "This card is the property of CRIPTON GROUP.\nIf found, please return to the nearest HR Department or mail to:\nHouse 12, Road 5, Sector 3, Uttara, Dhaka-1230.\nTel: +880 2 8901234 | Email: hr@cripton.com"
  );

  // References for image uploads
  const logoInputRef = useRef<HTMLInputElement>(null);
  const sigInputRef = useRef<HTMLInputElement>(null);

  // Get selected employee details
  const selectedEmployee = useMemo(() => {
    return employeesData.find(emp => emp.id === selectedEmpId) || employeesData[0];
  }, [selectedEmpId]);

  // Map employees for the SearchableSelect
  const employeeOptions = useMemo(() => {
    return employeesData.map(emp => ({
      value: emp.id,
      label: `${emp.name} (${emp.id}) - ${emp.title}`
    }));
  }, []);

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

  // Reset all configuration to default
  const handleReset = () => {
    setSelectedEmpId(employeesData[0]?.id || "");
    setOrientation("vertical");
    setThemeColor("#1e88e5");
    setCompanyName("CRIPTON GROUP");
    setLogoUrl(DEFAULT_LOGO_SVG);
    setSignatureUrl(DEFAULT_SIGNATURE_SVG);
    setBackText(
      "This card is the property of CRIPTON GROUP.\nIf found, please return to the nearest HR Department or mail to:\nHouse 12, Road 5, Sector 3, Uttara, Dhaka-1230.\nTel: +880 2 8901234 | Email: hr@cripton.com"
    );
    setShowBloodGroup(true);
    setShowJoinDate(true);
    setShowDepartment(true);
    setShowDesignation(true);
    setShowBarcode(true);
    setIsFlipped(false);
  };

  // SVG Barcode Generator based on Employee ID
  const renderBarcode = (id: string) => {
    if (!id) return null;
    const bars: React.ReactNode[] = [];
    let currentX = 10;
    const height = 40;
    
    // Seeded sequence from ID digits
    const idDigits = id.replace(/\D/g, "") || "123456789";
    const pattern = idDigits.split("").map(d => parseInt(d, 10));
    
    for (let i = 0; i < 35; i++) {
      const digit = pattern[i % pattern.length];
      const width = (digit % 3 === 0) ? 3 : (digit % 2 === 0) ? 1.5 : 0.8;
      const isSpace = i % 2 === 1;
      
      if (!isSpace) {
        bars.push(
          <rect 
            key={i} 
            x={currentX} 
            y={0} 
            width={width} 
            height={height} 
            fill="black" 
          />
        );
      }
      currentX += width + 1.2;
    }
    
    return (
      <div className="flex flex-col items-center justify-center mt-2 font-mono text-[9px] text-gray-800">
        <svg width={currentX + 10} height={height} className="overflow-visible">
          {bars}
        </svg>
        <span className="mt-1 tracking-[0.25em]">{id}</span>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#090d16] text-foreground font-sans overflow-hidden">
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
                <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                  ID Card Setup & Designer
                </h1>
              </div>
              <p className="text-xs text-muted-foreground mt-1 max-w-xl">
                Configure brand assets, custom layouts, and employee credentials to produce professional, print-ready identification cards.
              </p>
            </div>
            
            <div className="flex items-center gap-2.5 self-start md:self-auto">
              <button
                onClick={handleReset}
                className="h-10 px-4 rounded-xl border border-border/60 hover:bg-muted/60 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <RefreshCcw className="size-3.5" />
                Reset Layout
              </button>
              <button
                onClick={handlePrint}
                className="h-10 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-extrabold shadow-lg shadow-primary/25 hover:shadow-primary/35 transition flex items-center gap-2 cursor-pointer"
              >
                <Printer className="size-3.5" />
                Print Card
              </button>
            </div>
          </div>

          {/* Designer Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Configuration Forms (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Step 1: Select Employee */}
              <div className="p-5 rounded-2xl bg-card border border-border/40 space-y-4 shadow-sm">
                <div className="flex items-center gap-2.5 pb-3 border-b border-border/20">
                  <span className="flex items-center justify-center size-6 rounded-lg bg-primary/10 text-primary text-xs font-extrabold">1</span>
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
                      <span className="text-muted-foreground block text-[10px] font-semibold uppercase tracking-wide">Name</span>
                      <span className="font-bold text-foreground">{selectedEmployee.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px] font-semibold uppercase tracking-wide">ID Number</span>
                      <span className="font-bold text-foreground">{selectedEmployee.id}</span>
                    </div>
                    <div className="mt-1.5">
                      <span className="text-muted-foreground block text-[10px] font-semibold uppercase tracking-wide">Designation</span>
                      <span className="font-bold text-foreground">{selectedEmployee.title}</span>
                    </div>
                    <div className="mt-1.5">
                      <span className="text-muted-foreground block text-[10px] font-semibold uppercase tracking-wide">Department</span>
                      <span className="font-bold text-foreground">{selectedEmployee.dept}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Branding & Color Theme */}
              <div className="p-5 rounded-2xl bg-card border border-border/40 space-y-5 shadow-sm">
                <div className="flex items-center gap-2.5 pb-3 border-b border-border/20">
                  <span className="flex items-center justify-center size-6 rounded-lg bg-primary/10 text-primary text-xs font-extrabold">2</span>
                  <h3 className="text-sm font-bold text-foreground">Brand & Color Configuration</h3>
                </div>

                {/* Company Name */}
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Company Name / Header</label>
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
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Card Layout Style</label>
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
                        {PRESET_COLORS.map(color => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() => setThemeColor(color.value)}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                            className={`size-6 rounded-full border-2 transition-transform cursor-pointer hover:scale-110 flex items-center justify-center ${
                              themeColor === color.value ? "border-foreground" : "border-transparent"
                            }`}
                          >
                            {themeColor === color.value && (
                              <Check className="size-3 text-white mix-blend-difference" />
                            )}
                          </button>
                        ))}
                      </div>
                      
                      {/* Color Picker for Custom Color */}
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
                  {/* Logo Upload */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Company Logo</label>
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
                          title="Reset to Default Logo"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Signature Upload */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Authorized Signature</label>
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
                          title="Reset to Default Signature"
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
                  <span className="flex items-center justify-center size-6 rounded-lg bg-primary/10 text-primary text-xs font-extrabold">3</span>
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
                    placeholder="Enter terms, conditions, or return address to print on the back..."
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
                  className="relative select-none"
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
                      className="absolute inset-0 w-full h-full bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col justify-between"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                    >
                      {/* Vertical Front */}
                      {orientation === "vertical" ? (
                        <>
                          {/* Header Decorator */}
                          <div className="relative h-20 flex flex-col justify-center px-4 overflow-hidden" style={{ backgroundColor: themeColor }}>
                            {/* SVG Waves Background */}
                            <svg className="absolute inset-0 opacity-15 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                              <path d="M0,50 C30,40 70,60 100,50 L100,100 L0,100 Z" fill="black" />
                              <path d="M0,30 C50,60 50,30 100,60 L100,0 L0,0 Z" fill="white" />
                            </svg>
                            
                            <div className="relative z-10 flex items-center gap-2">
                              {logoUrl && (
                                <img src={logoUrl} alt="Logo" className="size-8.5 rounded-lg bg-white/95 p-1 border border-white/20 shadow-xs object-contain" />
                              )}
                              <span className="text-white font-black text-xs tracking-wider truncate uppercase">
                                {companyName}
                              </span>
                            </div>
                          </div>

                          {/* Accent Band */}
                          <div className="h-1.5 w-full" style={{ backgroundColor: themeColor + "40" }} />

                          {/* Profile Details Content */}
                          <div className="flex-1 flex flex-col items-center justify-center px-5 pt-3.5 pb-2.5">
                            {/* Photo Container */}
                            <div className="relative group">
                              <div className="absolute -inset-1 rounded-2xl opacity-40 blur-xs transition duration-300" style={{ backgroundColor: themeColor }} />
                              <div className="relative size-25 rounded-2xl bg-slate-100 border-2 overflow-hidden flex items-center justify-center shadow-md" style={{ borderColor: themeColor }}>
                                <UserRound className="size-14 text-slate-400" />
                              </div>
                            </div>

                            {/* Employee Identity */}
                            <div className="text-center mt-3.5 w-full">
                              <h4 className="font-extrabold text-slate-900 text-[15px] leading-snug truncate">
                                {selectedEmployee.name}
                              </h4>
                              {showDesignation && (
                                <p className="text-[11px] font-bold mt-0.5 uppercase tracking-wide" style={{ color: themeColor }}>
                                  {selectedEmployee.title}
                                </p>
                              )}
                            </div>

                            {/* Metadata Grid */}
                            <div className="w-full mt-4 bg-slate-50 border border-slate-100 rounded-xl p-2.5 space-y-1.5 text-[10px]">
                              <div className="flex justify-between">
                                <span className="text-slate-500 font-semibold uppercase">ID Number</span>
                                <span className="font-bold text-slate-800">{selectedEmployee.id}</span>
                              </div>
                              {showDepartment && (
                                <div className="flex justify-between">
                                  <span className="text-slate-500 font-semibold uppercase">Department</span>
                                  <span className="font-bold text-slate-800 truncate max-w-[130px]">{selectedEmployee.dept}</span>
                                </div>
                              )}
                              {showJoinDate && (
                                <div className="flex justify-between">
                                  <span className="text-slate-500 font-semibold uppercase">Join Date</span>
                                  <span className="font-bold text-slate-800">{selectedEmployee.joinDate}</span>
                                </div>
                              )}
                              {showBloodGroup && (
                                <div className="flex justify-between">
                                  <span className="text-slate-500 font-semibold uppercase">Blood Group</span>
                                  <span className="font-extrabold text-red-600">{selectedEmployee.blood || "—"}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Footer Sign-off */}
                          <div className="px-5 pb-4 pt-1 border-t border-slate-100 flex items-end justify-between">
                            <div className="text-[7px] text-slate-400 font-extrabold tracking-widest uppercase pb-1">
                              SECURE ID CARD
                            </div>
                            <div className="flex flex-col items-center">
                              {signatureUrl && (
                                <img src={signatureUrl} alt="Signature" className="h-6.5 w-18 object-contain mix-blend-multiply" />
                              )}
                              <span className="text-[8px] text-slate-500 font-bold border-t border-slate-300 pt-0.5 w-18 text-center mt-0.5">
                                Authorized Sign
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        /* Horizontal Front */
                        <div className="flex size-full">
                          {/* Left Band decor */}
                          <div className="w-4.5 h-full flex-none" style={{ backgroundColor: themeColor }} />
                          
                          <div className="flex-1 flex flex-col justify-between p-4.5">
                            {/* Horizontal Header */}
                            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                              <div className="flex items-center gap-2">
                                {logoUrl && (
                                  <img src={logoUrl} alt="Logo" className="size-7.5 rounded bg-slate-50 p-0.5 object-contain" />
                                )}
                                <span className="font-black text-xs tracking-wider uppercase text-slate-800">
                                  {companyName}
                                </span>
                              </div>
                              <span className="text-[8px] font-extrabold tracking-wider text-slate-400 uppercase">
                                Staff Identification
                              </span>
                            </div>

                            {/* Main horizontal content */}
                            <div className="flex-1 flex gap-4.5 items-center py-2">
                              {/* Photo */}
                              <div className="size-22.5 rounded-xl bg-slate-100 border overflow-hidden flex items-center justify-center shrink-0 shadow-sm" style={{ borderColor: themeColor }}>
                                <UserRound className="size-12 text-slate-400" />
                              </div>

                              {/* Details */}
                              <div className="flex-1 min-w-0 space-y-2">
                                <div>
                                  <h4 className="font-extrabold text-slate-900 text-[14px] leading-tight truncate">
                                    {selectedEmployee.name}
                                  </h4>
                                  {showDesignation && (
                                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: themeColor }}>
                                      {selectedEmployee.title}
                                    </p>
                                  )}
                                </div>

                                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[9px] bg-slate-50/70 p-2 rounded-lg border border-slate-100/50">
                                  <div>
                                    <span className="text-slate-400 font-semibold block uppercase text-[7px] leading-none mb-0.5">Emp ID</span>
                                    <span className="font-bold text-slate-800">{selectedEmployee.id}</span>
                                  </div>
                                  {showDepartment && (
                                    <div className="truncate">
                                      <span className="text-slate-400 font-semibold block uppercase text-[7px] leading-none mb-0.5">Dept</span>
                                      <span className="font-bold text-slate-800 truncate block">{selectedEmployee.dept}</span>
                                    </div>
                                  )}
                                  {showJoinDate && (
                                    <div className="mt-0.5">
                                      <span className="text-slate-400 font-semibold block uppercase text-[7px] leading-none mb-0.5">Join Date</span>
                                      <span className="font-bold text-slate-800">{selectedEmployee.joinDate}</span>
                                    </div>
                                  )}
                                  {showBloodGroup && (
                                    <div className="mt-0.5">
                                      <span className="text-slate-400 font-semibold block uppercase text-[7px] leading-none mb-0.5">Blood</span>
                                      <span className="font-extrabold text-red-600">{selectedEmployee.blood || "—"}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Horizontal Footer */}
                            <div className="flex justify-between items-end border-t border-slate-100 pt-2.5">
                              <span className="text-[7px] font-extrabold tracking-widest text-slate-400 uppercase">
                                SECURE ID
                              </span>
                              <div className="flex items-center gap-2">
                                {signatureUrl && (
                                  <img src={signatureUrl} alt="Signature" className="h-5.5 w-14 object-contain mix-blend-multiply" />
                                )}
                                <span className="text-[7px] text-slate-500 font-bold border-l border-slate-300 pl-2 py-0.5">
                                  Authorized Sign
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CARD BACK */}
                    <div 
                      className="absolute inset-0 w-full h-full bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col justify-between"
                      style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                    >
                      {/* Vertical Back */}
                      {orientation === "vertical" ? (
                        <>
                          {/* Accent bar */}
                          <div className="h-3 w-full" style={{ backgroundColor: themeColor }} />

                          {/* Back details */}
                          <div className="flex-1 flex flex-col justify-between p-5 text-center">
                            
                            {/* Logo and title */}
                            <div className="flex flex-col items-center gap-1 pt-1">
                              {logoUrl && (
                                <img src={logoUrl} alt="Logo" className="size-8 object-contain opacity-75 grayscale" />
                              )}
                              <span className="text-[10px] font-black text-slate-700 tracking-wider uppercase">
                                {companyName}
                              </span>
                            </div>

                            {/* Custom Back Text */}
                            <div className="text-[9px] font-bold text-slate-500 leading-relaxed px-1 my-3 text-center whitespace-pre-line">
                              {backText}
                            </div>

                            {/* Separator / Emergency Info */}
                            <div className="border-t border-slate-150 pt-2 pb-1 text-[8px] font-bold text-slate-400">
                              EMERGENCY CONTACT: <span className="text-slate-800 font-black">+8801750021154</span>
                            </div>

                            {/* Barcode */}
                            {showBarcode && (
                              <div className="pb-1.5 flex justify-center">
                                {renderBarcode(selectedEmployee.id)}
                              </div>
                            )}

                          </div>

                          {/* Footer bar */}
                          <div className="h-1.5 w-full bg-slate-100" />
                        </>
                      ) : (
                        /* Horizontal Back */
                        <div className="flex size-full flex-col justify-between p-4.5">
                          {/* Top accent */}
                          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                            <span className="text-[9px] font-black text-slate-700 tracking-wider uppercase flex items-center gap-1.5 font-sans">
                              {logoUrl && (
                                <img src={logoUrl} alt="Logo" className="size-5 object-contain grayscale" />
                              )}
                              {companyName}
                            </span>
                            <span className="text-[8px] font-bold text-slate-400">
                              Emergency: +8801750021154
                            </span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 flex gap-4 items-center py-3">
                            <div className="flex-1 text-[8.5px] font-bold text-slate-500 leading-relaxed whitespace-pre-line text-left">
                              {backText}
                            </div>

                            {showBarcode && (
                              <div className="shrink-0 scale-90 origin-right border-l border-slate-100 pl-3">
                                {renderBarcode(selectedEmployee.id)}
                              </div>
                            )}
                          </div>

                          {/* Bottom decor */}
                          <div className="h-2 w-full rounded-full" style={{ backgroundColor: themeColor }} />
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* Flip Hint */}
                <div className="mt-5 flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 px-3.5 py-1.5 rounded-xl border border-border/20">
                  <Info className="size-3.5 text-primary shrink-0" />
                  <span>Click on the card to flip it and view the other side</span>
                </div>
              </div>

              {/* Design Tips Card */}
              <div className="p-5 rounded-2xl bg-card border border-border/40 space-y-3.5 shadow-sm">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Sparkles className="size-4 text-amber-500" />
                  Printing Instructions
                </h4>
                <ul className="space-y-2 text-xs text-muted-foreground font-medium">
                  <li className="flex gap-2">
                    <Check className="size-4 text-green-500 shrink-0 mt-0.5" />
                    <span>For CR80 plastic card printers, choose <strong>54mm x 86mm</strong> card size in print settings.</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="size-4 text-green-500 shrink-0 mt-0.5" />
                    <span>To ensure background colors and waves print correctly, enable <strong>Background graphics</strong> in your browser's print options.</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="size-4 text-green-500 shrink-0 mt-0.5" />
                    <span>Use the <strong>authorized signature upload</strong> option to automatically sign cards digitally during generation.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* ==================== PRINT ONLY LAYOUT ==================== */}
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
              height: 100%;
              background: white !important;
              color: black !important;
              padding: 0;
              margin: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .print-card-wrapper {
              display: flex !important;
              flex-direction: row !important;
              gap: 20px !important;
              padding: 40px !important;
              justify-content: center !important;
              align-items: center !important;
              background: white !important;
            }
            .print-card {
              box-shadow: none !important;
              border: 1px solid #ddd !important;
              background-color: white !important;
              page-break-inside: avoid !important;
            }
          }
        `}</style>

        <div className="print-card-wrapper">
          {/* FRONT CARD (PRINT) */}
          <div 
            className="print-card bg-white text-slate-900 rounded-2xl overflow-hidden flex flex-col justify-between"
            style={{
              width: orientation === "vertical" ? "54mm" : "86mm",
              height: orientation === "vertical" ? "86mm" : "54mm",
              minWidth: orientation === "vertical" ? "54mm" : "86mm",
              minHeight: orientation === "vertical" ? "86mm" : "54mm",
              border: "1px solid #d1d5db",
            }}
          >
            {orientation === "vertical" ? (
              <>
                <div className="relative h-20 flex flex-col justify-center px-4 overflow-hidden" style={{ backgroundColor: themeColor }}>
                  <svg className="absolute inset-0 opacity-15 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0,50 C30,40 70,60 100,50 L100,100 L0,100 Z" fill="black" />
                    <path d="M0,30 C50,60 50,30 100,60 L100,0 L0,0 Z" fill="white" />
                  </svg>
                  <div className="relative z-10 flex items-center gap-2">
                    {logoUrl && (
                      <img src={logoUrl} alt="Logo" className="size-8.5 rounded-lg bg-white/95 p-1 object-contain" />
                    )}
                    <span className="text-white font-black text-xs tracking-wider truncate uppercase">
                      {companyName}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full" style={{ backgroundColor: themeColor + "40" }} />
                
                <div className="flex-1 flex flex-col items-center justify-center px-5 pt-3.5 pb-2.5">
                  <div className="relative size-24 rounded-2xl bg-slate-100 border-2 overflow-hidden flex items-center justify-center" style={{ borderColor: themeColor }}>
                    <UserRound className="size-14 text-slate-400" />
                  </div>
                  <div className="text-center mt-3 w-full">
                    <h4 className="font-extrabold text-slate-900 text-[13px] leading-snug truncate">
                      {selectedEmployee.name}
                    </h4>
                    {showDesignation && (
                      <p className="text-[10px] font-bold mt-0.5 uppercase tracking-wide" style={{ color: themeColor }}>
                        {selectedEmployee.title}
                      </p>
                    )}
                  </div>
                  <div className="w-full mt-3 bg-slate-50 border border-slate-100 rounded-xl p-2.5 space-y-1 text-[9px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold uppercase">ID Number</span>
                      <span className="font-bold text-slate-800">{selectedEmployee.id}</span>
                    </div>
                    {showDepartment && (
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-semibold uppercase">Department</span>
                        <span className="font-bold text-slate-800 truncate max-w-[110px]">{selectedEmployee.dept}</span>
                      </div>
                    )}
                    {showJoinDate && (
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-semibold uppercase">Join Date</span>
                        <span className="font-bold text-slate-800">{selectedEmployee.joinDate}</span>
                      </div>
                    )}
                    {showBloodGroup && (
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-semibold uppercase">Blood Group</span>
                        <span className="font-extrabold text-red-600">{selectedEmployee.blood || "—"}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-5 pb-4 pt-1 border-t border-slate-100 flex items-end justify-between">
                  <div className="text-[6px] text-slate-400 font-extrabold tracking-widest uppercase pb-1">
                    SECURE ID CARD
                  </div>
                  <div className="flex flex-col items-center">
                    {signatureUrl && (
                      <img src={signatureUrl} alt="Signature" className="h-6 w-16 object-contain" />
                    )}
                    <span className="text-[7px] text-slate-500 font-bold border-t border-slate-350 pt-0.5 w-16 text-center mt-0.5">
                      Authorized Sign
                    </span>
                  </div>
                </div>
              </>
            ) : (
              /* Horizontal Print Front */
              <div className="flex size-full">
                <div className="w-4 h-full flex-none" style={{ backgroundColor: themeColor }} />
                <div className="flex-1 flex flex-col justify-between p-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      {logoUrl && (
                        <img src={logoUrl} alt="Logo" className="size-7 rounded bg-slate-50 p-0.5 object-contain" />
                      )}
                      <span className="font-black text-xs tracking-wider uppercase text-slate-800">
                        {companyName}
                      </span>
                    </div>
                    <span className="text-[8px] font-extrabold tracking-wider text-slate-400 uppercase">
                      Staff ID
                    </span>
                  </div>
                  <div className="flex-1 flex gap-4 items-center py-2">
                    <div className="size-20 rounded-xl bg-slate-100 border overflow-hidden flex items-center justify-center shrink-0" style={{ borderColor: themeColor }}>
                      <UserRound className="size-11 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-[13px] leading-tight truncate">
                          {selectedEmployee.name}
                        </h4>
                        {showDesignation && (
                          <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: themeColor }}>
                            {selectedEmployee.title}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[8.5px] bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                        <div>
                          <span className="text-slate-400 font-semibold block uppercase text-[6.5px]">Emp ID</span>
                          <span className="font-bold text-slate-800">{selectedEmployee.id}</span>
                        </div>
                        {showDepartment && (
                          <div className="truncate">
                            <span className="text-slate-400 font-semibold block uppercase text-[6.5px]">Dept</span>
                            <span className="font-bold text-slate-800 truncate block">{selectedEmployee.dept}</span>
                          </div>
                        )}
                        {showJoinDate && (
                          <div>
                            <span className="text-slate-400 font-semibold block uppercase text-[6.5px]">Join Date</span>
                            <span className="font-bold text-slate-800">{selectedEmployee.joinDate}</span>
                          </div>
                        )}
                        {showBloodGroup && (
                          <div>
                            <span className="text-slate-400 font-semibold block uppercase text-[6.5px]">Blood</span>
                            <span className="font-extrabold text-red-600">{selectedEmployee.blood || "—"}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-end border-t border-slate-100 pt-2">
                    <span className="text-[6px] font-extrabold tracking-widest text-slate-400 uppercase">
                      SECURE ID
                    </span>
                    <div className="flex items-center gap-2">
                      {signatureUrl && (
                        <img src={signatureUrl} alt="Signature" className="h-5.5 w-14 object-contain" />
                      )}
                      <span className="text-[7px] text-slate-500 font-bold border-l border-slate-300 pl-2 py-0.5">
                        Authorized Sign
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* BACK CARD (PRINT) */}
          <div 
            className="print-card bg-white text-slate-900 rounded-2xl overflow-hidden flex flex-col justify-between"
            style={{
              width: orientation === "vertical" ? "54mm" : "86mm",
              height: orientation === "vertical" ? "86mm" : "54mm",
              minWidth: orientation === "vertical" ? "54mm" : "86mm",
              minHeight: orientation === "vertical" ? "86mm" : "54mm",
              border: "1px solid #d1d5db",
            }}
          >
            {orientation === "vertical" ? (
              <>
                <div className="h-3 w-full" style={{ backgroundColor: themeColor }} />
                <div className="flex-1 flex flex-col justify-between p-5 text-center">
                  <div className="flex flex-col items-center gap-1 pt-1">
                    {logoUrl && (
                      <img src={logoUrl} alt="Logo" className="size-8 object-contain opacity-75 grayscale" />
                    )}
                    <span className="text-[9px] font-black text-slate-700 tracking-wider uppercase">
                      {companyName}
                    </span>
                  </div>
                  <div className="text-[8px] font-bold text-slate-550 leading-relaxed px-1 my-3 text-center whitespace-pre-line">
                    {backText}
                  </div>
                  <div className="border-t border-slate-150 pt-2 pb-1 text-[7.5px] font-bold text-slate-400">
                    EMERGENCY CONTACT: <span className="text-slate-800 font-black">+8801750021154</span>
                  </div>
                  {showBarcode && (
                    <div className="pb-1.5 flex justify-center">
                      {renderBarcode(selectedEmployee.id)}
                    </div>
                  )}
                </div>
                <div className="h-1.5 w-full bg-slate-100" />
              </>
            ) : (
              /* Horizontal Print Back */
              <div className="flex size-full flex-col justify-between p-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-[9px] font-black text-slate-700 tracking-wider uppercase flex items-center gap-1.5">
                    {logoUrl && (
                      <img src={logoUrl} alt="Logo" className="size-5 object-contain grayscale" />
                    )}
                    {companyName}
                  </span>
                  <span className="text-[8px] font-bold text-slate-400">
                    Emergency: +8801750021154
                  </span>
                </div>
                <div className="flex-1 flex gap-4 items-center py-2">
                  <div className="flex-1 text-[8px] font-bold text-slate-550 leading-relaxed whitespace-pre-line text-left">
                    {backText}
                  </div>
                  {showBarcode && (
                    <div className="shrink-0 scale-90 origin-right border-l border-slate-100 pl-3">
                      {renderBarcode(selectedEmployee.id)}
                    </div>
                  )}
                </div>
                <div className="h-2 w-full rounded-full" style={{ backgroundColor: themeColor }} />
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
