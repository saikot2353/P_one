import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Calculator,
  Plus,
  Pencil,
  Trash2,
  Copy,
  Sparkles,
  Info,
  Calendar,
  Check,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  X,
  FileSpreadsheet,
  Printer,
  FileText,
  Clock,
  Layers,
  ChevronDown,
  Percent,
  Coins,
  ShieldAlert,
  Zap,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

// ----------------------------------------------------
// Interfaces
// ----------------------------------------------------
export interface OtFormulaComponent {
  id: string;
  code: string; // e.g. "REG_OT", "HOLIDAY_OT", "FEST_OT", "NIGHT_OT", "TIFFIN_OT", "CONV_OT"
  name: string; // e.g. "Regular Overtime Rate", "Weekly Holiday OT", "Tiffin Allowance"
  type: "Formula" | "Percentage" | "Fixed Amount";
  basedOn: string; // "BASIC", "GROSS", "REG_OT", "-"
  valueFormula: string; // e.g. "(BASIC / 208) * 2", "REG_OT * 1.5", "50", "(GROSS - MED - CONV - FOOD) / 104"
  multiplierPct?: number;
  fixedAmount?: number;
}

export interface OtRateConfiguration {
  sl: number;
  scaleName: string; // e.g. "Worker", "Office Executive", "Office Staff"
  empType: string; // e.g. "Worker", "Office Executive", "Office Staff"
  inputType: "gross" | "basic" | "ctc";
  calculationMethod: "mixed" | "formula" | "percentage" | "labour_law";
  effectiveFrom: string; // e.g. "2026-09-25"
  effectiveTo?: string;
  status: "Active" | "Inactive";
  description: string;
  components: OtFormulaComponent[];
}

// ----------------------------------------------------
// Default Mock Data (Matching Screenshot 1 & BD Labour Standards)
// ----------------------------------------------------
export const DEFAULT_OT_CONFIGURATIONS: OtRateConfiguration[] = [
  {
    sl: 1,
    scaleName: "Worker",
    empType: "Worker",
    inputType: "gross",
    calculationMethod: "mixed",
    effectiveFrom: "2026-09-25",
    effectiveTo: "",
    status: "Active",
    description: "Default overtime structure for factory worker complying with Bangladesh Labour Act 2006 (2x hourly basic).",
    components: [
      {
        id: "c1",
        code: "BASIC",
        name: "Basic Salary Reference",
        type: "Formula",
        basedOn: "-",
        valueFormula: "(GROSS - MED - CONV - FOOD) / 1.5",
      },
      {
        id: "c2",
        code: "REG_OT",
        name: "General Overtime Rate (2x)",
        type: "Formula",
        basedOn: "BASIC",
        valueFormula: "(BASIC / 208) * 2",
      },
      {
        id: "c3",
        code: "HOLIDAY_OT",
        name: "Weekly Holiday / Friday OT",
        type: "Formula",
        basedOn: "REG_OT",
        valueFormula: "REG_OT * 1.5",
      },
      {
        id: "c4",
        code: "FEST_OT",
        name: "Festival Holiday OT Rate",
        type: "Formula",
        basedOn: "BASIC",
        valueFormula: "(BASIC / 208) * 3",
      },
      {
        id: "c5",
        code: "NIGHT_OT",
        name: "Night Shift Extra OT Allowance",
        type: "Formula",
        basedOn: "BASIC",
        valueFormula: "(BASIC / 208) * 0.5",
      },
      {
        id: "c6",
        code: "TIFFIN_OT",
        name: "Tiffin Allowance (4h+ OT)",
        type: "Fixed Amount",
        basedOn: "-",
        valueFormula: "50",
        fixedAmount: 50,
      },
    ],
  },
  {
    sl: 2,
    scaleName: "Office Executive",
    empType: "Office Executive",
    inputType: "gross",
    calculationMethod: "percentage",
    effectiveFrom: "2026-09-25",
    effectiveTo: "",
    status: "Active",
    description: "Executive overtime & extended assignment allowance policy.",
    components: [
      {
        id: "c21",
        code: "EXEC_OT",
        name: "Executive Extra Duty Flat Rate",
        type: "Fixed Amount",
        basedOn: "-",
        valueFormula: "250",
        fixedAmount: 250,
      },
      {
        id: "c22",
        code: "HOL_EXEC",
        name: "Holiday Extended Duty Allowance",
        type: "Percentage",
        basedOn: "BASIC",
        valueFormula: "BASIC  10 %",
        multiplierPct: 10,
      },
      {
        id: "c23",
        code: "MEAL_OT",
        name: "Late Stay Dinner Bill",
        type: "Fixed Amount",
        basedOn: "-",
        valueFormula: "200",
        fixedAmount: 200,
      },
      {
        id: "c24",
        code: "NIGHT_DROP",
        name: "Night Drop Conveyance Support",
        type: "Fixed Amount",
        basedOn: "-",
        valueFormula: "350",
        fixedAmount: 350,
      },
    ],
  },
  {
    sl: 3,
    scaleName: "Office Staff",
    empType: "Office Staff",
    inputType: "gross",
    calculationMethod: "mixed",
    effectiveFrom: "2026-09-25",
    effectiveTo: "",
    status: "Active",
    description: "Office and utility staff hourly overtime structure.",
    components: [
      {
        id: "c31",
        code: "BASIC",
        name: "Basic Salary Reference",
        type: "Formula",
        basedOn: "-",
        valueFormula: "(GROSS - 2450) / 1.5",
      },
      {
        id: "c32",
        code: "STAFF_OT",
        name: "Staff General OT Hourly",
        type: "Formula",
        basedOn: "-",
        valueFormula: "(BASIC / 208) * 1.5",
      },
      {
        id: "c33",
        code: "STAFF_HOL",
        name: "Staff Weekend / Holiday OT",
        type: "Formula",
        basedOn: "STAFF_OT",
        valueFormula: "STAFF_OT * 1.5",
      },
      {
        id: "c34",
        code: "STAFF_FOOD",
        name: "Overtime Refreshment Bill",
        type: "Fixed Amount",
        basedOn: "-",
        valueFormula: "60",
        fixedAmount: 60,
      },
    ],
  },
];

// Helper to safely evaluate formula with sample variables
export function evaluateFormulaSafe(
  formula: string,
  variables: Record<string, number>,
): { result: number | null; error: string | null } {
  try {
    if (!formula || !formula.trim()) return { result: null, error: "Formula is empty" };

    let parsed = formula.toUpperCase();

    // Remove comma separators in numbers e.g. 2,000 -> 2000
    parsed = parsed.replace(/,/g, "");

    // Convert percentage patterns like 50% or 50 % to (50 / 100)
    parsed = parsed.replace(/(\d+(?:\.\d+)?)\s*%/g, "($1 / 100)");

    // Replace known variables
    const sortedKeys = Object.keys(variables).sort((a, b) => b.length - a.length);
    for (const key of sortedKeys) {
      const reg = new RegExp(`\\b${key}\\b`, "g");
      parsed = parsed.replace(reg, String(variables[key]));
    }

    // Check if there are unresolved letters/variables
    const remainingLetters = parsed.replace(/[\d\s+\-*/().]/g, "");
    if (remainingLetters.length > 0) {
      return { result: null, error: `Unrecognized variable or symbol: ${remainingLetters}` };
    }

    // Safe math evaluation
    // eslint-disable-next-line no-new-func
    const fn = new Function(`"use strict"; return (${parsed});`);
    const val = fn();
    if (typeof val === "number" && !isNaN(val) && isFinite(val)) {
      return { result: Math.round(val * 100) / 100, error: null };
    }
    return { result: null, error: "Invalid math expression" };
  } catch (err: any) {
    return { result: null, error: err?.message || "Syntax error" };
  }
}

// ----------------------------------------------------
// Main Component
// ----------------------------------------------------
interface OtFormulaTabProps {
  searchQuery: string;
  empTypesList?: { nameEng: string }[];
  hideToolbar?: boolean;
  triggerAdd?: number;
  onOpenCreateTrigger?: () => void;
}

export function OtFormulaTab({
  searchQuery,
  empTypesList = [],
  hideToolbar = false,
  triggerAdd,
}: OtFormulaTabProps) {
  // Configurations list from LocalStorage
  const [configurations, setConfigurations] = useState<OtRateConfiguration[]>(() => {
    try {
      const saved = localStorage.getItem("hris_ot_rate_formulas");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      // fallback
    }
    return DEFAULT_OT_CONFIGURATIONS;
  });

  // Save to LocalStorage whenever configurations change
  useEffect(() => {
    localStorage.setItem("hris_ot_rate_formulas", JSON.stringify(configurations));
  }, [configurations]);

  // Master Modal State (Screenshot 2: Update OT Configuration)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<OtRateConfiguration | null>(null);

  // Form Fields inside Master Modal
  const [formScaleName, setFormScaleName] = useState("");
  const [formEmpType, setFormEmpType] = useState("Worker");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");
  const [formInputType, setFormInputType] = useState<"gross" | "basic" | "ctc">("gross");
  const [formCalcMethod, setFormCalcMethod] = useState<
    "mixed" | "formula" | "percentage" | "labour_law"
  >("mixed");
  const [formEffectiveFrom, setFormEffectiveFrom] = useState("2026-09-25");
  const [formEffectiveTo, setFormEffectiveTo] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formComponents, setFormComponents] = useState<OtFormulaComponent[]>([]);

  // Submodal State (Screenshot 3: Edit Component Formula)
  const [isCompModalOpen, setIsCompModalOpen] = useState(false);
  const [editingComp, setEditingComp] = useState<OtFormulaComponent | null>(null);
  const [compCode, setCompCode] = useState("");
  const [compName, setCompName] = useState("");
  const [compType, setCompType] = useState<"Formula" | "Percentage" | "Fixed Amount">("Formula");
  const [compBasedOn, setCompBasedOn] = useState("-");
  const [compFormula, setCompFormula] = useState("");
  const [compPctValue, setCompPctValue] = useState<number>(50);
  const [compFixedAmount, setCompFixedAmount] = useState<number>(100);

  // Test employee values for real-time validation preview
  const [testGross, setTestGross] = useState<number>(15000);
  const [testBasic, setTestBasic] = useState<number>(9000);
  const [testMed, setTestMed] = useState<number>(750);
  const [testConv, setTestConv] = useState<number>(450);
  const [testFood, setTestFood] = useState<number>(1250);
  const [testPf, setTestPf] = useState<number>(0);
  const formulaInputRef = useRef<HTMLTextAreaElement>(null);

  // Direct scale formula editing (from master table 1-click action)
  const [directScaleForFormula, setDirectScaleForFormula] = useState<OtRateConfiguration | null>(null);

  // Inline editing state for components table in the scale modal
  const [inlineEditingCompId, setInlineEditingCompId] = useState<string | null>(null);
  const [inlineFormulaText, setInlineFormulaText] = useState<string>("");

  // Auto-focus formula input when submodal opens
  useEffect(() => {
    if (isCompModalOpen && compType === "Formula") {
      const timer = setTimeout(() => {
        if (formulaInputRef.current) {
          formulaInputRef.current.focus();
          const len = formulaInputRef.current.value.length;
          formulaInputRef.current.setSelectionRange(len, len);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isCompModalOpen, compType]);

  // Filter configurations by search query
  const filteredConfigs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return configurations;
    return configurations.filter(
      (c) =>
        c.scaleName.toLowerCase().includes(q) ||
        c.empType.toLowerCase().includes(q) ||
        c.calculationMethod.toLowerCase().includes(q) ||
        c.inputType.toLowerCase().includes(q) ||
        c.components.some(
          (comp) =>
            comp.code.toLowerCase().includes(q) ||
            comp.name.toLowerCase().includes(q) ||
            comp.valueFormula.toLowerCase().includes(q),
        ),
    );
  }, [configurations, searchQuery]);

  // Open Create / Edit Configuration Modal
  const openConfigModal = (config: OtRateConfiguration | null) => {
    if (config) {
      setEditingConfig(config);
      setFormScaleName(config.scaleName);
      setFormEmpType(config.empType);
      setFormStatus(config.status);
      setFormInputType(config.inputType);
      setFormCalcMethod(config.calculationMethod);
      setFormEffectiveFrom(config.effectiveFrom);
      setFormEffectiveTo(config.effectiveTo || "");
      setFormDescription(config.description || "");
      setFormComponents([...config.components]);
    } else {
      setEditingConfig(null);
      setFormScaleName("");
      setFormEmpType("Worker");
      setFormStatus("Active");
      setFormInputType("gross");
      setFormCalcMethod("mixed");
      setFormEffectiveFrom(new Date().toISOString().split("T")[0]);
      setFormEffectiveTo("");
      setFormDescription("Default overtime structure for worker");
      // Default initial components
      setFormComponents([
        {
          id: "new_1",
          code: "REG_OT",
          name: "Regular Overtime Rate",
          type: "Formula",
          basedOn: "BASIC",
          valueFormula: "(BASIC / 208) * 2",
        },
        {
          id: "new_2",
          code: "HOLIDAY_OT",
          name: "Weekly Holiday OT",
          type: "Formula",
          basedOn: "REG_OT",
          valueFormula: "REG_OT * 1.5",
        },
      ]);
    }
    setIsConfigModalOpen(true);
  };

  // Duplicate an existing configuration
  const handleDuplicateConfig = (config: OtRateConfiguration) => {
    const newSl =
      configurations.length > 0 ? Math.max(...configurations.map((c) => c.sl)) + 1 : 1;
    const duplicated: OtRateConfiguration = {
      ...config,
      sl: newSl,
      scaleName: `${config.scaleName} (Copy)`,
      description: `Copy of ${config.scaleName} overtime formula configuration.`,
      components: config.components.map((c) => ({
        ...c,
        id: `comp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      })),
    };
    setConfigurations((prev) => [...prev, duplicated]);
    toast.success(`Duplicated "${config.scaleName}" successfully!`);
  };

  // Delete configuration
  const handleDeleteConfig = (sl: number) => {
    if (!confirm("Are you sure you want to delete this OT configuration scale?")) return;
    setConfigurations((prev) =>
      prev.filter((c) => c.sl !== sl).map((c, idx) => ({ ...c, sl: idx + 1 })),
    );
    toast.success("OT configuration removed successfully.");
  };

  // Save / Update Master Configuration
  const handleSaveConfig = () => {
    if (!formScaleName.trim()) {
      toast.error("OT Scale Name is required.");
      return;
    }
    if (!formEmpType.trim()) {
      toast.error("Employee Type is required.");
      return;
    }

    if (editingConfig) {
      // Update
      const updatedList = configurations.map((c) =>
        c.sl === editingConfig.sl
          ? {
              ...c,
              scaleName: formScaleName,
              empType: formEmpType,
              status: formStatus,
              inputType: formInputType,
              calculationMethod: formCalcMethod,
              effectiveFrom: formEffectiveFrom,
              effectiveTo: formEffectiveTo,
              description: formDescription,
              components: formComponents,
            }
          : c,
      );
      setConfigurations(updatedList);
      toast.success(`OT Scale "${formScaleName}" updated successfully!`);
    } else {
      // Create new
      const newSl =
        configurations.length > 0 ? Math.max(...configurations.map((c) => c.sl)) + 1 : 1;
      const newConfig: OtRateConfiguration = {
        sl: newSl,
        scaleName: formScaleName,
        empType: formEmpType,
        status: formStatus,
        inputType: formInputType,
        calculationMethod: formCalcMethod,
        effectiveFrom: formEffectiveFrom,
        effectiveTo: formEffectiveTo,
        description: formDescription,
        components: formComponents,
      };
      setConfigurations((prev) => [...prev, newConfig]);
      toast.success(`OT Scale "${formScaleName}" created successfully!`);
    }

    setIsConfigModalOpen(false);
  };

  // Open Submodal (Add / Edit Component)
  const openCompModal = (comp: OtFormulaComponent | null) => {
    setDirectScaleForFormula(null);
    if (comp) {
      setEditingComp(comp);
      setCompCode(comp.code);
      setCompName(comp.name);
      setCompType(comp.type);
      setCompBasedOn(comp.basedOn || "-");
      setCompFormula(comp.valueFormula || "");
      setCompPctValue(comp.multiplierPct || 50);
      setCompFixedAmount(comp.fixedAmount || 100);
    } else {
      setEditingComp(null);
      setCompCode("");
      setCompName("");
      setCompType("Formula");
      setCompBasedOn("-");
      setCompFormula("(BASIC / 208) * 2");
      setCompPctValue(50);
      setCompFixedAmount(100);
    }
    setIsCompModalOpen(true);
  };

  // Open Direct Formula Editor from Master Table (1-Click Action)
  const openDirectFormulaModal = (scale: OtRateConfiguration, comp: OtFormulaComponent) => {
    setDirectScaleForFormula(scale);
    setEditingComp(comp);
    setCompCode(comp.code);
    setCompName(comp.name);
    setCompType(comp.type);
    setCompBasedOn(comp.basedOn || "-");
    setCompFormula(comp.valueFormula || "");
    setCompPctValue(comp.multiplierPct || 50);
    setCompFixedAmount(comp.fixedAmount || 100);
    setIsCompModalOpen(true);
  };

  // Inline Formula Editing Handlers (Direct Table Row Edit)
  const handleStartInlineEdit = (comp: OtFormulaComponent) => {
    setInlineEditingCompId(comp.id);
    setInlineFormulaText(comp.valueFormula);
  };

  const handleSaveInlineEdit = (compId: string) => {
    if (!inlineFormulaText.trim()) {
      toast.error("Formula or value cannot be empty.");
      return;
    }
    setFormComponents((prev) =>
      prev.map((c) => (c.id === compId ? { ...c, valueFormula: inlineFormulaText.trim() } : c)),
    );
    setInlineEditingCompId(null);
    toast.success("Formula updated inline!");
  };

  const handleCancelInlineEdit = () => {
    setInlineEditingCompId(null);
    setInlineFormulaText("");
  };

  // Insert token into formula textarea
  const insertTokenIntoFormula = (token: string) => {
    if (!formulaInputRef.current) {
      setCompFormula((prev) => (prev ? `${prev} ${token}` : token));
      return;
    }
    const textarea = formulaInputRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = compFormula;
    const before = current.substring(0, start);
    const after = current.substring(end);

    const spaceBefore = before.length > 0 && !before.endsWith(" ") && !before.endsWith("(") ? " " : "";
    const spaceAfter = after.length > 0 && !after.startsWith(" ") && !after.startsWith(")") ? " " : "";

    const insertion = `${spaceBefore}${token}${spaceAfter}`;
    const nextText = `${before}${insertion}${after}`;
    setCompFormula(nextText);

    setTimeout(() => {
      textarea.focus();
      const nextPos = start + insertion.length;
      textarea.setSelectionRange(nextPos, nextPos);
    }, 0);
  };

  // Save Component from Submodal
  const handleSaveComponent = () => {
    if (!compCode.trim()) {
      toast.error("Component Code is required.");
      return;
    }
    if (!compName.trim()) {
      toast.error("Component Name is required.");
      return;
    }

    let finalValueFormula = compFormula;
    if (compType === "Percentage") {
      finalValueFormula = `${compBasedOn !== "-" ? compBasedOn : "BASIC"}  ${compPctValue} %`;
    } else if (compType === "Fixed Amount") {
      finalValueFormula = String(compFixedAmount);
    } else {
      if (!compFormula.trim()) {
        toast.error("Formula cannot be empty.");
        return;
      }
    }

    const updatedComp: OtFormulaComponent = {
      id: editingComp ? editingComp.id : `comp_${Date.now()}`,
      code: compCode.toUpperCase().trim(),
      name: compName.trim(),
      type: compType,
      basedOn: compType === "Percentage" ? compBasedOn : compBasedOn,
      valueFormula: finalValueFormula,
      multiplierPct: compType === "Percentage" ? compPctValue : undefined,
      fixedAmount: compType === "Fixed Amount" ? compFixedAmount : undefined,
    };

    if (directScaleForFormula) {
      const targetScale = directScaleForFormula;
      setConfigurations((prev) =>
        prev.map((cfg) =>
          cfg.sl === targetScale.sl
            ? {
                ...cfg,
                components: cfg.components.map((c) =>
                  c.id === updatedComp.id ? updatedComp : c,
                ),
              }
            : cfg,
        ),
      );
      setDirectScaleForFormula(null);
      toast.success(
        `Formula for "${compName}" updated directly in scale "${targetScale.scaleName}"!`,
      );
    } else {
      if (editingComp) {
        setFormComponents((prev) =>
          prev.map((c) => (c.id === editingComp.id ? updatedComp : c)),
        );
        toast.success(`Component "${compName}" updated.`);
      } else {
        setFormComponents((prev) => [...prev, updatedComp]);
        toast.success(`Component "${compName}" added.`);
      }
    }

    setIsCompModalOpen(false);
  };

  // Duplicate component inside modal
  const handleDuplicateComponent = (comp: OtFormulaComponent) => {
    const copyComp: OtFormulaComponent = {
      ...comp,
      id: `comp_${Date.now()}`,
      code: `${comp.code}_COPY`,
      name: `${comp.name} (Copy)`,
    };
    setFormComponents((prev) => [...prev, copyComp]);
    toast.success(`Duplicated component "${comp.name}"`);
  };

  // Remove component from modal
  const handleRemoveComponent = (id: string) => {
    setFormComponents((prev) => prev.filter((c) => c.id !== id));
    toast.success("Component removed.");
  };

  // Calculated hourly rate for the live submodal formula evaluator
  const evaluatedSubmodalFormula = useMemo(() => {
    if (compType !== "Formula") return null;
    const testVars: Record<string, number> = {
      GROSS: testGross,
      BASIC: testBasic,
      HRA: testBasic * 0.5,
      MED: testMed,
      CONV: testConv,
      FOOD: testFood,
      PF: testPf,
      MONTH_HOURS: 208,
      DAY_HOURS: 8,
      WORK_DAYS: 26,
      "208": 208,
      "104": 104,
      REG_OT: (testBasic / 208) * 2,
    };
    return evaluateFormulaSafe(compFormula, testVars);
  }, [compType, compFormula, testGross, testBasic, testMed, testConv, testFood, testPf]);

  // Overall hourly OT rate for regular worker in simulator
  const regularHourlyRate = useMemo(() => {
    const regComp = formComponents.find(
      (c) => c.code === "REG_OT" || c.name.toLowerCase().includes("regular"),
    );
    if (!regComp) {
      return (testBasic / 208) * 2;
    }
    if (regComp.type === "Fixed Amount") return regComp.fixedAmount || 0;
    const testVars: Record<string, number> = {
      GROSS: testGross,
      BASIC: testBasic,
      HRA: testBasic * 0.5,
      MED: testMed,
      CONV: testConv,
      FOOD: testFood,
      PF: testPf,
      "208": 208,
      REG_OT: (testBasic / 208) * 2,
    };
    const res = evaluateFormulaSafe(regComp.valueFormula, testVars);
    return res.result ?? (testBasic / 208) * 2;
  }, [formComponents, testGross, testBasic, testMed, testConv, testFood, testPf]);

  // Export handlers
  const handleExportExcel = () => {
    toast.success("Exporting OT Rate Configurations to Excel...");
  };
  const handlePrint = () => {
    window.print();
  };
  const handleExportPdf = () => {
    toast.success("Generating OT Rate Formulas PDF document...");
  };

  // Listen to external add triggers from parent header button
  useEffect(() => {
    if (triggerAdd && triggerAdd > 0) {
      openConfigModal(null);
    }
  }, [triggerAdd]);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Search Bar & Export Actions Toolbar (Rendered if not hidden by parent) */}
      {!hideToolbar && (
        <div className="bg-card rounded-2xl border border-border/50 p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="w-full md:w-96 h-10 px-3.5 rounded-lg border border-border/60 bg-muted/10 hover:bg-muted/20 focus-within:bg-background focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all flex items-center gap-2.5 shadow-sm">
            <Calculator className="size-4.5 text-muted-foreground/70" />
            <input
              type="text"
              placeholder="Search OT Scales, Formulas, Employee Types..."
              value={searchQuery}
              readOnly={true}
              className="bg-transparent border-0 outline-none text-sm w-full text-foreground placeholder:text-muted-foreground/50 font-medium"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
            <button
              onClick={() => openConfigModal(null)}
              className="h-10 px-5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs transition-all shadow-sm flex items-center gap-2 uppercase tracking-wide cursor-pointer"
            >
              <Plus className="size-4" /> Add OT Formula Scale
            </button>
            <button
              onClick={handleExportExcel}
              className="h-10 px-4 rounded-xl border border-border/40 hover:bg-muted font-semibold text-xs text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors shadow-sm"
            >
              <FileSpreadsheet className="size-4.5 text-emerald-600" /> Excel
            </button>
            <button
              onClick={handlePrint}
              className="h-10 px-4 rounded-xl border border-border/40 hover:bg-muted font-semibold text-xs text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors shadow-sm"
            >
              <Printer className="size-4.5 text-blue-600" /> Print
            </button>
            <button
              onClick={handleExportPdf}
              className="h-10 px-4 rounded-xl border border-border/40 hover:bg-muted font-semibold text-xs text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors shadow-sm"
            >
              <FileText className="size-4.5 text-red-600" /> PDF
            </button>
          </div>
        </div>
      )}

      {/* Highlights / Quick Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-card border border-border/60 rounded-xl p-3.5 shadow-xs flex items-center gap-3">
          <div className="size-10 rounded-lg bg-blue-500/10 text-blue-600 border border-blue-500/20 flex items-center justify-center">
            <Calculator className="size-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Total OT Scales
            </div>
            <div className="text-xl font-black text-foreground">
              {configurations.length} Records
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-3.5 shadow-xs flex items-center gap-3">
          <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Active Configurations
            </div>
            <div className="text-xl font-black text-emerald-600">
              {configurations.filter((c) => c.status === "Active").length} Active
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-3.5 shadow-xs flex items-center gap-3">
          <div className="size-10 rounded-lg bg-purple-500/10 text-purple-600 border border-purple-500/20 flex items-center justify-center">
            <Zap className="size-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Formula Rules
            </div>
            <div className="text-xl font-black text-purple-600">
              {configurations.reduce(
                (sum, c) => sum + c.components.filter((x) => x.type === "Formula").length,
                0,
              )}{" "}
              Rules
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-3.5 shadow-xs flex items-center gap-3">
          <div className="size-10 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center">
            <Clock className="size-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Labour Law Basis
            </div>
            <div className="text-xs font-black text-amber-700 dark:text-amber-400">
              (BASIC / 208) × 2
            </div>
          </div>
        </div>
      </div>

      {/* Master Table Router (Exact match to Screenshot 1) */}
      <div className="bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table
            className="w-full text-left text-xs border-collapse whitespace-nowrap"
            style={{ minWidth: "1100px" }}
          >
            <thead className="bg-muted/30 text-muted-foreground uppercase font-semibold tracking-wider text-xs border-b border-border/40">
              <tr className="bg-transparent">
                <th className="sticky left-0 bg-inherit px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">
                  SL
                </th>
                <th className="sticky left-[60px] bg-inherit px-5 py-4 w-[130px] text-center border-r border-border/30 z-20">
                  ACTIONS
                </th>
                <th className="px-5 py-4 min-w-[200px]">SCALE NAME</th>
                <th className="px-5 py-4 min-w-[150px]">EMPLOYEE TYPE</th>
                <th className="px-5 py-4 min-w-[110px]">INPUT TYPE</th>
                <th className="px-5 py-4 min-w-[160px]">CALCULATION METHOD</th>
                <th className="px-5 py-4 min-w-[130px]">COMPONENTS</th>
                <th className="px-5 py-4 min-w-[230px]">PRIMARY OT FORMULA</th>
                <th className="px-5 py-4 min-w-[150px]">EFFECTIVE FROM</th>
                <th className="px-5 py-4 w-[110px] text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30 text-foreground">
              {filteredConfigs.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-muted-foreground">
                    <Calculator className="size-8 mx-auto mb-2 text-muted-foreground/40" />
                    No OT configurations match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredConfigs.map((row, idx) => (
                  <tr
                    key={row.sl}
                    className="group hover:bg-muted/50 transition-all duration-150"
                  >
                    {/* SL */}
                    <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">
                      {idx + 1}
                    </td>

                    {/* Actions */}
                    <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            const primary =
                              row.components.find((c) => c.code === "REG_OT") ||
                              row.components.find((c) => c.type === "Formula") ||
                              row.components[0];
                            if (primary) openDirectFormulaModal(row, primary);
                            else openConfigModal(row);
                          }}
                          className="text-purple-600 hover:text-purple-700 transition p-1 hover:bg-purple-500/10 rounded-md cursor-pointer"
                          title="Quick Edit Formula"
                        >
                          <Calculator className="size-4" />
                        </button>
                        <button
                          onClick={() => openConfigModal(row)}
                          className="text-orange-500 hover:text-orange-600 transition p-1 hover:bg-orange-500/10 rounded-md cursor-pointer"
                          title="Edit OT Scale"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicateConfig(row)}
                          className="text-blue-500 hover:text-blue-600 transition p-1 hover:bg-blue-500/10 rounded-md cursor-pointer"
                          title="Duplicate / Clone"
                        >
                          <Copy className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteConfig(row.sl)}
                          className="text-red-500 hover:text-red-650 transition p-1 hover:bg-red-500/10 rounded-md cursor-pointer"
                          title="Delete OT Scale"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>

                    {/* Scale Name */}
                    <td className="px-5 py-3.5 font-bold text-foreground">
                      <div className="flex items-center gap-2">
                        <span>{row.scaleName}</span>
                      </div>
                    </td>

                    {/* Employee Type */}
                    <td className="px-5 py-3.5">
                      <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-muted/60 border border-border/60 text-foreground">
                        {row.empType}
                      </span>
                    </td>

                    {/* Input Type */}
                    <td className="px-5 py-3.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 capitalize">
                        {row.inputType}
                      </span>
                    </td>

                    {/* Calculation Method */}
                    <td className="px-5 py-3.5 font-normal text-muted-foreground lowercase">
                      {row.calculationMethod}
                    </td>

                    {/* Components (Purple Pill) */}
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => openConfigModal(row)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/25 hover:bg-purple-500/20 transition cursor-pointer"
                      >
                        <span>{row.components.length} Items</span>
                      </button>
                    </td>

                    {/* Primary OT Formula (Clickable Direct Formula Edit) */}
                    <td className="px-5 py-3.5">
                      {(() => {
                        const primary =
                          row.components.find((c) => c.code === "REG_OT") ||
                          row.components.find((c) => c.type === "Formula") ||
                          row.components[0];
                        if (!primary)
                          return <span className="text-muted-foreground font-mono">—</span>;
                        return (
                          <button
                            type="button"
                            onClick={() => openDirectFormulaModal(row, primary)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 hover:border-purple-500/60 text-xs font-mono font-bold transition group cursor-pointer shadow-2xs"
                            title={`Click to edit formula for "${row.scaleName}"`}
                          >
                            <span className="truncate max-w-[210px]">{primary.valueFormula}</span>
                            <ExternalLink className="size-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition shrink-0" />
                          </button>
                        );
                      })()}
                    </td>

                    {/* Effective From */}
                    <td className="px-5 py-3.5 font-normal text-muted-foreground flex items-center gap-2">
                      <Calendar className="size-3.5 text-muted-foreground/70" />
                      <span>{row.effectiveFrom}</span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                          row.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-red-500/10 text-red-600 border-red-500/20"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination & Records Count (Matches Screenshot 1 bottom footer) */}
        <div className="px-5 py-3.5 bg-muted/20 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="cursor-pointer hover:text-foreground font-medium">‹ Previous</span>
            <span className="size-7 rounded-lg bg-card border border-border/60 text-foreground font-bold flex items-center justify-center shadow-xs">
              1
            </span>
            <span className="cursor-pointer hover:text-foreground font-medium">Next ›</span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold">
            <FileText className="size-3.5" />
            <span>{filteredConfigs.length} Records</span>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MASTER MODAL: Update OT Configuration (Exact match to Screenshot 2) */}
      {/* ==================================================================== */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden border border-border/70 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border/50 bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-9 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 border border-blue-500/20 shadow-xs">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight text-foreground">
                    {editingConfig ? "Update OT Rate Scale" : "Create OT Rate Scale"}
                  </h2>
                  <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                    Define overtime calculation basis, type rules, and formula components
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="size-8 rounded-xl hover:bg-muted/80 flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground border border-border/30 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Row 1: Scale Name, Employee Type, Status, Salary Input Type */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Scale Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                    OT Scale Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Worker"
                    value={formScaleName}
                    onChange={(e) => setFormScaleName(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-background text-xs font-semibold text-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition"
                  />
                </div>

                {/* Employee Type */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                    Employee Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formEmpType}
                    onChange={(e) => setFormEmpType(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-background text-xs font-semibold text-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition cursor-pointer"
                  >
                    <option value="Worker">Worker</option>
                    <option value="Office Executive">Office Executive</option>
                    <option value="Office Staff">Office Staff</option>
                    <option value="Security">Security Guard</option>
                    <option value="Contractual">Contractual</option>
                    <option value="ALL">ALL Employee Types</option>
                    {empTypesList.map((t) => (
                      <option key={t.nameEng} value={t.nameEng}>
                        {t.nameEng}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-background text-xs font-semibold text-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Salary Input Type (Radio buttons exactly as in Screenshot 2) */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                    Salary Input Type <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-3 pt-2 text-xs font-medium text-foreground">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="salaryInputType"
                        value="gross"
                        checked={formInputType === "gross"}
                        onChange={() => setFormInputType("gross")}
                        className="text-primary focus:ring-primary size-3.5"
                      />
                      <span>Gross Salary</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="salaryInputType"
                        value="basic"
                        checked={formInputType === "basic"}
                        onChange={() => setFormInputType("basic")}
                        className="text-primary focus:ring-primary size-3.5"
                      />
                      <span>Basic Salary</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="salaryInputType"
                        value="ctc"
                        checked={formInputType === "ctc"}
                        onChange={() => setFormInputType("ctc")}
                        className="text-primary focus:ring-primary size-3.5"
                      />
                      <span>CTC</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Row 2: Calculation Method, Effective From, Effective To */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                    Calculation Method <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formCalcMethod}
                    onChange={(e) => setFormCalcMethod(e.target.value as any)}
                    className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-background text-xs font-semibold text-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition cursor-pointer"
                  >
                    <option value="mixed">Mixed (Fixed + Percentage + Formula)</option>
                    <option value="formula">Formula Based (Dynamic Expression)</option>
                    <option value="labour_law">Standard Labour Law ((Basic / 208) × 2)</option>
                    <option value="percentage">Percentage of Basic / Gross</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                    Effective From <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formEffectiveFrom}
                    onChange={(e) => setFormEffectiveFrom(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-background text-xs font-semibold text-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                    Effective To
                  </label>
                  <input
                    type="date"
                    value={formEffectiveTo}
                    onChange={(e) => setFormEffectiveTo(e.target.value)}
                    placeholder="Pick a date"
                    className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-background text-xs font-semibold text-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition"
                  />
                </div>
              </div>

              {/* Row 3: Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Default overtime structure for worker"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-border/80 bg-background text-xs text-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition"
                />
              </div>

              {/* OT Rate Components & Rules Table (Matching Screenshot 2 Table) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">OT Rate Components</h3>
                    <p className="text-[11px] text-muted-foreground">
                      Define hourly rates, holiday multipliers, tiffin, and overtime allowances here.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openCompModal(null)}
                    className="h-9 px-4 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="size-4" /> Add Component
                  </button>
                </div>

                <div className="border border-border/70 rounded-xl overflow-hidden bg-card shadow-xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-muted/40 text-muted-foreground uppercase font-semibold text-[10px] border-b border-border/40 tracking-wider">
                      <tr>
                        <th className="px-4 py-3 w-[50px] text-center">SL</th>
                        <th className="px-4 py-3 min-w-[100px]">CODE</th>
                        <th className="px-4 py-3 min-w-[200px]">COMPONENT NAME</th>
                        <th className="px-4 py-3 w-[120px]">TYPE</th>
                        <th className="px-4 py-3 w-[100px]">BASED ON</th>
                        <th className="px-4 py-3 min-w-[240px]">VALUE / FORMULA</th>
                        <th className="px-4 py-3 w-[110px] text-center">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {formComponents.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-muted-foreground">
                            No components added. Click "+ Add Component" to add overtime rate rules.
                          </td>
                        </tr>
                      ) : (
                        formComponents.map((comp, idx) => (
                          <tr key={comp.id} className="hover:bg-muted/30 transition">
                            <td className="px-4 py-3 text-center text-muted-foreground font-mono">
                              {idx + 1}
                            </td>
                            <td className="px-4 py-3 font-mono font-bold text-foreground">
                              {comp.code}
                            </td>
                            <td className="px-4 py-3 font-medium text-foreground">
                              {comp.name}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                                  comp.type === "Formula"
                                    ? "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30"
                                    : comp.type === "Percentage"
                                      ? "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30"
                                      : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                                }`}
                              >
                                {comp.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-mono text-muted-foreground">
                              {comp.basedOn !== "-" ? (
                                <span className="inline-block px-2 py-0.5 rounded bg-muted/60 text-foreground font-semibold text-[10px]">
                                  {comp.basedOn}
                                </span>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                              {inlineEditingCompId === comp.id ? (
                                <div className="flex items-center gap-1.5 min-w-[260px]">
                                  <input
                                    type="text"
                                    value={inlineFormulaText}
                                    onChange={(e) => setInlineFormulaText(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") handleSaveInlineEdit(comp.id);
                                      if (e.key === "Escape") handleCancelInlineEdit();
                                    }}
                                    autoFocus
                                    placeholder="Enter formula or value"
                                    className="h-8 px-2.5 rounded-lg border border-primary bg-background text-xs font-mono font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none w-full"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleSaveInlineEdit(comp.id)}
                                    className="size-7 shrink-0 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 flex items-center justify-center transition cursor-pointer"
                                    title="Save Formula (Enter)"
                                  >
                                    <Check className="size-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleCancelInlineEdit}
                                    className="size-7 shrink-0 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 flex items-center justify-center transition cursor-pointer"
                                    title="Cancel (Esc)"
                                  >
                                    <X className="size-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <div
                                  onDoubleClick={() => handleStartInlineEdit(comp)}
                                  className="flex items-center gap-2 group/cell"
                                >
                                  <button
                                    type="button"
                                    onClick={() => openCompModal(comp)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 hover:border-purple-500/60 text-xs font-mono font-bold transition group cursor-pointer shadow-2xs max-w-[290px]"
                                    title="Click to edit formula in Formula Builder"
                                  >
                                    <span className="truncate">{comp.valueFormula}</span>
                                    <ExternalLink className="size-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition shrink-0" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleStartInlineEdit(comp)}
                                    className="opacity-0 group-hover/cell:opacity-100 p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
                                    title="Edit formula inline (or double-click cell)"
                                  >
                                    <Pencil className="size-3" />
                                  </button>
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => openCompModal(comp)}
                                  className="text-orange-500 hover:text-orange-600 transition p-1.5 hover:bg-orange-500/10 rounded-md cursor-pointer"
                                  title="Edit Formula / Details"
                                >
                                  <Pencil className="size-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDuplicateComponent(comp)}
                                  className="text-blue-500 hover:text-blue-600 transition p-1.5 hover:bg-blue-500/10 rounded-md cursor-pointer"
                                  title="Duplicate"
                                >
                                  <Copy className="size-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveComponent(comp.id)}
                                  className="text-red-500 hover:text-red-650 transition p-1.5 hover:bg-red-500/10 rounded-md cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Live OT Sandbox Simulator Card */}
              <div className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl border border-blue-500/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-blue-600" />
                    <span className="text-xs font-bold text-blue-900 dark:text-blue-300">
                      Live Overtime Calculation Simulator
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-700/70 dark:text-blue-400">
                    Calculated against 208 Monthly Hours
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                      Gross Salary (৳)
                    </label>
                    <input
                      type="number"
                      value={testGross}
                      onChange={(e) => setTestGross(Number(e.target.value) || 0)}
                      className="w-full h-8 px-2.5 rounded-lg border border-border/80 bg-card text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                      Basic Salary (৳)
                    </label>
                    <input
                      type="number"
                      value={testBasic}
                      onChange={(e) => setTestBasic(Number(e.target.value) || 0)}
                      className="w-full h-8 px-2.5 rounded-lg border border-border/80 bg-card text-xs font-mono font-bold"
                    />
                  </div>
                  <div className="bg-card/70 rounded-xl p-2 border border-blue-500/20 flex flex-col justify-center">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">
                      Single Hourly Basic
                    </span>
                    <span className="text-sm font-black font-mono text-foreground">
                      ৳{(testBasic / 208).toFixed(2)} / hr
                    </span>
                  </div>
                  <div className="bg-primary/10 rounded-xl p-2 border border-primary/25 flex flex-col justify-center">
                    <span className="text-[9px] font-bold text-primary uppercase">
                      Regular OT Rate (2x)
                    </span>
                    <span className="text-base font-black font-mono text-primary">
                      ৳{regularHourlyRate.toFixed(2)} / hr
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-border/50 px-6 py-4 bg-muted/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsConfigModalOpen(false)}
                className="h-10 px-6 rounded-xl border border-border/80 hover:bg-muted font-bold text-xs text-muted-foreground hover:text-foreground transition cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleSaveConfig}
                className="h-10 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs shadow-md hover:shadow-lg transition flex items-center gap-2 uppercase tracking-wide cursor-pointer"
              >
                <Check className="size-4" />
                {editingConfig ? "UPDATE" : "SAVE SCALE"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUBMODAL: Edit Component Formula (Exact match to Screenshot 3)       */}
      {/* ==================================================================== */}
      {isCompModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden border border-border/80 animate-in zoom-in-95 duration-200">
            {/* Header (Screenshot 3 style) */}
            <div className="px-6 py-4.5 border-b border-border/50 bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-9 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 border border-blue-500/20 shadow-xs">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight text-foreground">
                    {editingComp ? `Edit Component: ${compName || compCode}` : "Add OT Rate Component"}
                  </h2>
                  <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                    Update component details and overtime calculation formula
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCompModalOpen(false)}
                className="size-8 rounded-xl hover:bg-muted/80 flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground border border-border/30 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Row 1: Code, Name, Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                    COMPONENT CODE <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. REG_OT"
                    value={compCode}
                    onChange={(e) => setCompCode(e.target.value.toUpperCase())}
                    className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-background text-xs font-mono font-bold text-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                    COMPONENT NAME <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Regular Overtime Rate"
                    value={compName}
                    onChange={(e) => setCompName(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-background text-xs font-medium text-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                    COMPONENT TYPE <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={compType}
                    onChange={(e) => setCompType(e.target.value as any)}
                    className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-background text-xs font-semibold text-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition cursor-pointer"
                  >
                    <option value="Formula">Formula</option>
                    <option value="Percentage">Percentage / Multiplier</option>
                    <option value="Fixed Amount">Fixed Amount</option>
                  </select>
                </div>
              </div>

              {/* If Type == "Percentage" */}
              {compType === "Percentage" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-border/70 bg-muted/10">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                      BASED ON
                    </label>
                    <select
                      value={compBasedOn}
                      onChange={(e) => setCompBasedOn(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-background text-xs font-semibold text-foreground focus:border-primary outline-none cursor-pointer"
                    >
                      <option value="BASIC">BASIC (Basic Salary)</option>
                      <option value="GROSS">GROSS (Gross Salary)</option>
                      <option value="REG_OT">REG_OT (Regular OT Rate)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                      PERCENTAGE (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={compPctValue}
                        onChange={(e) => setCompPctValue(Number(e.target.value) || 0)}
                        className="w-full h-10 px-3.5 pr-8 rounded-xl border border-border/80 bg-background text-xs font-bold text-foreground focus:border-primary outline-none"
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-bold text-muted-foreground">
                        %
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* If Type == "Fixed Amount" */}
              {compType === "Fixed Amount" && (
                <div className="p-4 rounded-xl border border-border/70 bg-muted/10 space-y-1">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                    FIXED HOURLY RATE OR ALLOWANCE (৳)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={compFixedAmount}
                      onChange={(e) => setCompFixedAmount(Number(e.target.value) || 0)}
                      className="w-full h-10 px-3.5 pr-10 rounded-xl border border-border/80 bg-background text-xs font-bold text-foreground focus:border-primary outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-muted-foreground">
                      ৳
                    </span>
                  </div>
                </div>
              )}

              {/* If Type == "Formula" (Exact match to Screenshot 3 layout with Quick Presets) */}
              {compType === "Formula" && (
                <div className="space-y-3.5">
                  {/* Quick Preset Formulas */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                        QUICK PRESET FORMULAS:
                      </span>
                      <button
                        type="button"
                        onClick={() => setCompFormula("")}
                        className="text-[10px] font-bold text-muted-foreground hover:text-red-500 transition cursor-pointer uppercase"
                      >
                        Clear Formula
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {[
                        { label: "Labour Law 2x: (BASIC / 208) * 2", val: "(BASIC / 208) * 2" },
                        { label: "1.5x OT: (BASIC / 208) * 1.5", val: "(BASIC / 208) * 1.5" },
                        { label: "1x Hourly: BASIC / 208", val: "BASIC / 208" },
                        { label: "Festival 3x: (BASIC / 208) * 3", val: "(BASIC / 208) * 3" },
                        {
                          label: "Gross Deducted: (GROSS - MED - CONV - FOOD) / 104",
                          val: "(GROSS - MED - CONV - FOOD) / 104",
                        },
                        { label: "Night Shift: (BASIC / 208) * 0.2", val: "(BASIC / 208) * 0.2" },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setCompFormula(preset.val);
                            toast.info(`Preset applied: ${preset.val}`);
                          }}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-border/80 bg-muted/40 hover:bg-muted text-foreground transition active:scale-95 cursor-pointer shadow-2xs"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                        FORMULA <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] text-muted-foreground">
                        Type directly or click variables / operators below
                      </span>
                    </div>
                    <textarea
                      ref={formulaInputRef}
                      rows={3}
                      value={compFormula}
                      onChange={(e) => setCompFormula(e.target.value)}
                      placeholder="e.g. (BASIC / 208) * 2"
                      className="w-full p-3.5 rounded-2xl border border-border/80 bg-background text-sm font-mono font-bold text-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition"
                    />
                  </div>

                  {/* Variable & Operator Buttons Toolbar (Screenshot 3 style) */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {/* Variable Pills */}
                    {(
                      [
                        "GROSS",
                        "BASIC",
                        "HRA",
                        "MED",
                        "CONV",
                        "FOOD",
                        "PF",
                        "208",
                        "104",
                        "WORK_DAYS",
                        "DAY_HOURS",
                        "REG_OT",
                      ] as const
                    ).map((token) => (
                      <button
                        key={token}
                        type="button"
                        onClick={() => insertTokenIntoFormula(token)}
                        className="px-3 py-1.5 rounded-lg border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-mono font-semibold transition active:scale-95 shadow-2xs cursor-pointer"
                      >
                        {token}
                      </button>
                    ))}

                    <span className="text-muted-foreground/40 font-light px-1">|</span>

                    {/* Operator Pills */}
                    {(["+", "-", "*", "/", "%", "(", ")"] as const).map((op) => (
                      <button
                        key={op}
                        type="button"
                        onClick={() => insertTokenIntoFormula(op)}
                        className="size-8 rounded-lg border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-mono font-bold flex items-center justify-center transition active:scale-95 shadow-2xs cursor-pointer"
                      >
                        {op}
                      </button>
                    ))}
                  </div>

                  {/* Blue Info Callout (Exact replica of Screenshot 3 info callout) */}
                  <div className="rounded-2xl border border-blue-500/25 bg-blue-500/5 dark:bg-blue-950/20 p-4 space-y-2 text-xs">
                    <div className="flex items-start gap-2.5 text-blue-700 dark:text-blue-300 font-semibold">
                      <Info className="size-4.5 shrink-0 mt-0.5 text-blue-600" />
                      <span>
                        Formula supports basic math operators (+, -, *, /, %) and component variables.
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pl-7 text-[11px]">
                      <span className="text-muted-foreground font-semibold">Variables:</span>
                      {(
                        [
                          "GROSS",
                          "BASIC",
                          "HRA",
                          "MED",
                          "CONV",
                          "FOOD",
                          "PF",
                          "208",
                          "104",
                          "REG_OT",
                        ] as const
                      ).map((v) => (
                        <span
                          key={v}
                          onClick={() => insertTokenIntoFormula(v)}
                          className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-700 dark:text-blue-300 font-mono font-bold cursor-pointer hover:bg-blue-500/25 transition"
                        >
                          {v}
                        </span>
                      ))}
                    </div>

                    <div className="pl-7 text-[11px] text-muted-foreground">
                      <span className="font-semibold text-foreground">Example: </span>
                      <code className="px-2 py-0.5 rounded bg-muted font-mono font-bold text-foreground">
                        (BASIC / 208) * 2
                      </code>{" "}
                      or{" "}
                      <code className="px-2 py-0.5 rounded bg-muted font-mono font-bold text-foreground">
                        (GROSS - MED - CONV - FOOD) / 104
                      </code>
                    </div>
                  </div>

                  {/* Real-time Syntax & Value Preview Result with Interactive Tester */}
                  <div className="p-4 rounded-xl border border-border/70 bg-card space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        {evaluatedSubmodalFormula?.error ? (
                          <>
                            <AlertCircle className="size-4 text-red-500 shrink-0" />
                            <span className="font-semibold text-red-500">
                              {evaluatedSubmodalFormula.error}
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              Valid formula! Evaluates to:
                            </span>
                          </>
                        )}
                      </div>
                      {evaluatedSubmodalFormula?.result !== null && (
                        <span className="text-base font-mono font-black text-primary">
                          ৳{evaluatedSubmodalFormula?.result?.toFixed(2)} / hr
                        </span>
                      )}
                    </div>

                    {/* Interactive Tester Inputs */}
                    <div className="pt-2 border-t border-border/40 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
                      <div>
                        <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                          Basic (৳)
                        </span>
                        <input
                          type="number"
                          value={testBasic}
                          onChange={(e) => setTestBasic(Number(e.target.value) || 0)}
                          className="w-full h-7 px-2 rounded-md border border-border/70 bg-background font-mono font-bold text-xs"
                        />
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                          Gross (৳)
                        </span>
                        <input
                          type="number"
                          value={testGross}
                          onChange={(e) => setTestGross(Number(e.target.value) || 0)}
                          className="w-full h-7 px-2 rounded-md border border-border/70 bg-background font-mono font-bold text-xs"
                        />
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                          Hours / Mo
                        </span>
                        <span className="h-7 px-2 flex items-center font-mono font-bold text-xs text-muted-foreground">
                          208 hrs
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                          Live OT Rate
                        </span>
                        <span className="h-7 px-2 flex items-center font-mono font-black text-xs text-primary">
                          ৳
                          {evaluatedSubmodalFormula?.result !== null
                            ? evaluatedSubmodalFormula?.result?.toFixed(2)
                            : "0.00"}{" "}
                          / hr
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border/50 px-6 py-4 bg-muted/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCompModalOpen(false)}
                className="h-10 px-6 rounded-xl border border-border/80 hover:bg-muted font-bold text-xs text-muted-foreground hover:text-foreground transition cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleSaveComponent}
                className="h-10 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs shadow-md hover:shadow-lg transition flex items-center gap-2 uppercase tracking-wide cursor-pointer"
              >
                <Check className="size-4" />
                UPDATE COMPONENT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
