import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  DollarSign,
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
  FileSpreadsheet,
  Printer,
  FileText,
  X,
  Layers,
  Coins,
} from "lucide-react";
import { toast } from "sonner";

export interface SalaryComponent {
  id: string;
  code: string;
  name: string;
  type: "Formula" | "Percentage" | "Fixed Amount";
  basedOn: string;
  valueFormula: string;
  percentage?: number;
  fixedAmount?: number;
}

export interface SalaryScaleStructure {
  sl: number;
  scaleName: string;
  empType: string;
  inputType: "gross" | "basic" | "ctc";
  calculationMethod: "mixed" | "percentage" | "formula";
  effectiveFrom: string;
  effectiveTo?: string;
  status: "Active" | "Inactive";
  description: string;
  components: SalaryComponent[];
}

export const DEFAULT_SALARY_STRUCTURES: SalaryScaleStructure[] = [
  {
    sl: 1,
    scaleName: "Worker",
    empType: "Worker",
    inputType: "gross",
    calculationMethod: "mixed",
    effectiveFrom: "2026-09-25",
    status: "Active",
    description: "Default salary structure for worker",
    components: [
      {
        id: "s1",
        code: "BASIC",
        name: "Basic Salary",
        type: "Formula",
        basedOn: "-",
        valueFormula: "(GROSS - MED - CONV - FOOD) / 1.5",
      },
      {
        id: "s2",
        code: "HRA",
        name: "House Rent",
        type: "Percentage",
        basedOn: "BASIC",
        valueFormula: "BASIC  50 %",
        percentage: 50,
      },
      {
        id: "s3",
        code: "MED",
        name: "Medical Allowance",
        type: "Fixed Amount",
        basedOn: "-",
        valueFormula: "750",
        fixedAmount: 750,
      },
      {
        id: "s4",
        code: "CONV",
        name: "Conveyance",
        type: "Fixed Amount",
        basedOn: "-",
        valueFormula: "450",
        fixedAmount: 450,
      },
      {
        id: "s5",
        code: "FOOD",
        name: "Food Allowance",
        type: "Fixed Amount",
        basedOn: "-",
        valueFormula: "1,250",
        fixedAmount: 1250,
      },
      {
        id: "s6",
        code: "PF",
        name: "Provident Fund",
        type: "Fixed Amount",
        basedOn: "-",
        valueFormula: "0",
        fixedAmount: 0,
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
    status: "Active",
    description: "Salary breakdown for executive staff",
    components: [
      {
        id: "s21",
        code: "BASIC",
        name: "Basic Salary",
        type: "Percentage",
        basedOn: "GROSS",
        valueFormula: "GROSS  60 %",
        percentage: 60,
      },
      {
        id: "s22",
        code: "HRA",
        name: "House Rent",
        type: "Percentage",
        basedOn: "BASIC",
        valueFormula: "BASIC  50 %",
        percentage: 50,
      },
      {
        id: "s23",
        code: "MED",
        name: "Medical Allowance",
        type: "Fixed Amount",
        basedOn: "-",
        valueFormula: "1,500",
        fixedAmount: 1500,
      },
      {
        id: "s24",
        code: "CONV",
        name: "Conveyance",
        type: "Fixed Amount",
        basedOn: "-",
        valueFormula: "2,000",
        fixedAmount: 2000,
      },
      {
        id: "s25",
        code: "FOOD",
        name: "Food Allowance",
        type: "Fixed Amount",
        basedOn: "-",
        valueFormula: "2,000",
        fixedAmount: 2000,
      },
      {
        id: "s26",
        code: "PF",
        name: "Provident Fund",
        type: "Percentage",
        basedOn: "BASIC",
        valueFormula: "BASIC  8.33 %",
        percentage: 8.33,
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
    status: "Active",
    description: "Standard structure for office staff",
    components: [
      {
        id: "s31",
        code: "BASIC",
        name: "Basic Salary",
        type: "Formula",
        basedOn: "-",
        valueFormula: "(GROSS - MED - CONV - FOOD) / 1.5",
      },
      {
        id: "s32",
        code: "HRA",
        name: "House Rent",
        type: "Percentage",
        basedOn: "BASIC",
        valueFormula: "BASIC  50 %",
        percentage: 50,
      },
      {
        id: "s33",
        code: "MED",
        name: "Medical Allowance",
        type: "Fixed Amount",
        basedOn: "-",
        valueFormula: "1,000",
        fixedAmount: 1000,
      },
      {
        id: "s34",
        code: "CONV",
        name: "Conveyance",
        type: "Fixed Amount",
        basedOn: "-",
        valueFormula: "800",
        fixedAmount: 800,
      },
      {
        id: "s35",
        code: "FOOD",
        name: "Food Allowance",
        type: "Fixed Amount",
        basedOn: "-",
        valueFormula: "1,500",
        fixedAmount: 1500,
      },
      {
        id: "s36",
        code: "PF",
        name: "Provident Fund",
        type: "Fixed Amount",
        basedOn: "-",
        valueFormula: "0",
        fixedAmount: 0,
      },
    ],
  },
];

interface SalaryStructureTabProps {
  searchQuery: string;
  empTypesList?: { nameEng: string }[];
}

export function SalaryStructureTab({ searchQuery, empTypesList = [] }: SalaryStructureTabProps) {
  const [structures, setStructures] = useState<SalaryScaleStructure[]>(() => {
    try {
      const saved = localStorage.getItem("hris_salary_structures_v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_SALARY_STRUCTURES;
  });

  useEffect(() => {
    localStorage.setItem("hris_salary_structures_v2", JSON.stringify(structures));
  }, [structures]);

  // Modal State (Screenshot 2)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScale, setEditingScale] = useState<SalaryScaleStructure | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formEmpType, setFormEmpType] = useState("Worker");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");
  const [formInputType, setFormInputType] = useState<"gross" | "basic" | "ctc">("gross");
  const [formCalcMethod, setFormCalcMethod] = useState<"mixed" | "percentage" | "formula">("mixed");
  const [formEffectiveFrom, setFormEffectiveFrom] = useState("2026-09-25");
  const [formEffectiveTo, setFormEffectiveTo] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formComponents, setFormComponents] = useState<SalaryComponent[]>([]);

  // Submodal State (Screenshot 3)
  const [isCompModalOpen, setIsCompModalOpen] = useState(false);
  const [editingComp, setEditingComp] = useState<SalaryComponent | null>(null);
  const [compCode, setCompCode] = useState("BASIC");
  const [compName, setCompName] = useState("Basic Salary");
  const [compType, setCompType] = useState<"Formula" | "Percentage" | "Fixed Amount">("Formula");
  const [compFormula, setCompFormula] = useState("(GROSS - MED - CONV - FOOD) / 1.5");
  const [compBasedOn, setCompBasedOn] = useState("-");
  const [compPct, setCompPct] = useState(50);
  const [compFixed, setCompFixed] = useState(750);

  const formulaInputRef = useRef<HTMLInputElement>(null);

  const filteredStructures = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return structures;
    return structures.filter(
      (s) =>
        s.scaleName.toLowerCase().includes(q) ||
        s.empType.toLowerCase().includes(q) ||
        s.calculationMethod.toLowerCase().includes(q),
    );
  }, [structures, searchQuery]);

  const openScaleModal = (scale: SalaryScaleStructure | null) => {
    if (scale) {
      setEditingScale(scale);
      setFormName(scale.scaleName);
      setFormEmpType(scale.empType);
      setFormStatus(scale.status);
      setFormInputType(scale.inputType);
      setFormCalcMethod(scale.calculationMethod);
      setFormEffectiveFrom(scale.effectiveFrom);
      setFormEffectiveTo(scale.effectiveTo || "");
      setFormDescription(scale.description);
      setFormComponents([...scale.components]);
    } else {
      setEditingScale(null);
      setFormName("");
      setFormEmpType("Worker");
      setFormStatus("Active");
      setFormInputType("gross");
      setFormCalcMethod("mixed");
      setFormEffectiveFrom("2026-09-25");
      setFormEffectiveTo("");
      setFormDescription("Default salary structure for worker");
      setFormComponents([...DEFAULT_SALARY_STRUCTURES[0].components]);
    }
    setIsModalOpen(true);
  };

  const openEditComp = (comp: SalaryComponent | null) => {
    if (comp) {
      setEditingComp(comp);
      setCompCode(comp.code);
      setCompName(comp.name);
      setCompType(comp.type);
      setCompFormula(comp.valueFormula);
      setCompBasedOn(comp.basedOn);
      setCompPct(comp.percentage || 50);
      setCompFixed(comp.fixedAmount || 0);
    } else {
      setEditingComp(null);
      setCompCode("OTHER");
      setCompName("Other Allowance");
      setCompType("Fixed Amount");
      setCompFormula("500");
      setCompBasedOn("-");
      setCompPct(10);
      setCompFixed(500);
    }
    setIsCompModalOpen(true);
  };

  const insertToken = (token: string) => {
    setCompFormula((prev) => (prev ? `${prev} ${token}` : token));
  };

  const handleSaveComp = () => {
    let finalFormula = compFormula;
    if (compType === "Percentage") {
      finalFormula = `${compBasedOn !== "-" ? compBasedOn : "BASIC"}  ${compPct} %`;
    } else if (compType === "Fixed Amount") {
      finalFormula = String(compFixed);
    }

    const updated: SalaryComponent = {
      id: editingComp ? editingComp.id : `s_${Date.now()}`,
      code: compCode,
      name: compName,
      type: compType,
      basedOn: compType === "Percentage" ? compBasedOn : "-",
      valueFormula: finalFormula,
      percentage: compType === "Percentage" ? compPct : undefined,
      fixedAmount: compType === "Fixed Amount" ? compFixed : undefined,
    };

    if (editingComp) {
      setFormComponents((prev) => prev.map((c) => (c.id === editingComp.id ? updated : c)));
      toast.success(`Component "${compName}" updated.`);
    } else {
      setFormComponents((prev) => [...prev, updated]);
      toast.success(`Component "${compName}" added.`);
    }
    setIsCompModalOpen(false);
  };

  const handleSaveScale = () => {
    if (!formName.trim()) {
      toast.error("Salary Scale Name is required.");
      return;
    }

    if (editingScale) {
      setStructures((prev) =>
        prev.map((s) =>
          s.sl === editingScale.sl
            ? {
                ...s,
                scaleName: formName,
                empType: formEmpType,
                status: formStatus,
                inputType: formInputType,
                calculationMethod: formCalcMethod,
                effectiveFrom: formEffectiveFrom,
                effectiveTo: formEffectiveTo,
                description: formDescription,
                components: formComponents,
              }
            : s,
        ),
      );
      toast.success("Salary scale updated successfully!");
    } else {
      const newSl = structures.length > 0 ? Math.max(...structures.map((s) => s.sl)) + 1 : 1;
      setStructures((prev) => [
        ...prev,
        {
          sl: newSl,
          scaleName: formName,
          empType: formEmpType,
          status: formStatus,
          inputType: formInputType,
          calculationMethod: formCalcMethod,
          effectiveFrom: formEffectiveFrom,
          effectiveTo: formEffectiveTo,
          description: formDescription,
          components: formComponents,
        },
      ]);
      toast.success("Salary scale created successfully!");
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Table (Screenshot 1) */}
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
                <th className="sticky left-[60px] bg-inherit px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">
                  ACTIONS
                </th>
                <th className="px-5 py-4 min-w-[200px]">SCALE NAME</th>
                <th className="px-5 py-4 min-w-[160px]">EMPLOYEE TYPE</th>
                <th className="px-5 py-4 min-w-[120px]">INPUT TYPE</th>
                <th className="px-5 py-4 min-w-[170px]">CALCULATION METHOD</th>
                <th className="px-5 py-4 min-w-[140px]">COMPONENTS</th>
                <th className="px-5 py-4 min-w-[160px]">EFFECTIVE FROM</th>
                <th className="px-5 py-4 w-[120px] text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30 text-foreground">
              {filteredStructures.map((row, idx) => (
                <tr key={row.sl} className="group hover:bg-muted/50 transition-all">
                  <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">
                    {idx + 1}
                  </td>
                  <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                    <div className="flex items-center justify-center gap-2.5">
                      <button
                        onClick={() => openScaleModal(row)}
                        className="text-orange-500 hover:text-orange-600 transition p-1 cursor-pointer"
                        title="Edit"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this salary structure?")) {
                            setStructures((prev) => prev.filter((s) => s.sl !== row.sl));
                            toast.success("Deleted");
                          }
                        }}
                        className="text-red-500 hover:text-red-650 transition p-1 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-foreground">{row.scaleName}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-muted/60 border border-border/60">
                      {row.empType}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 lowercase">
                      {row.inputType}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-normal text-muted-foreground lowercase">
                    {row.calculationMethod}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => openScaleModal(row)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/25 cursor-pointer"
                    >
                      {row.components.length} Items
                    </button>
                  </td>
                  <td className="px-5 py-3.5 font-normal text-muted-foreground flex items-center gap-2">
                    <Calendar className="size-3.5 text-muted-foreground/70" />
                    <span>{row.effectiveFrom}</span>
                  </td>
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
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3.5 bg-muted/20 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="cursor-pointer font-medium">‹ Previous</span>
            <span className="size-7 rounded-lg bg-card border border-border/60 text-foreground font-bold flex items-center justify-center">
              1
            </span>
            <span className="cursor-pointer font-medium">Next ›</span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold">
            <FileText className="size-3.5" />
            <span>{filteredStructures.length} Records</span>
          </div>
        </div>
      </div>

      {/* Modal: Update Salary Scale (Screenshot 2) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden border border-border/70 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border/50 bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-9 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 border border-blue-500/20">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight text-foreground">
                    Update Salary Scale
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="size-8 rounded-xl hover:bg-muted/80 flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground border border-border/30 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                    SALARY SCALE NAME <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-background text-xs font-semibold text-foreground outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                    EMPLOYEE TYPE <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formEmpType}
                    onChange={(e) => setFormEmpType(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-background text-xs font-semibold text-foreground outline-none cursor-pointer"
                  >
                    <option value="Worker">Worker</option>
                    <option value="Office Executive">Office Executive</option>
                    <option value="Office Staff">Office Staff</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                    STATUS <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-background text-xs font-semibold text-foreground outline-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                    SALARY INPUT TYPE <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-3 pt-2 text-xs font-medium text-foreground">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={formInputType === "gross"}
                        onChange={() => setFormInputType("gross")}
                        className="text-primary size-3.5"
                      />
                      <span>Gross Salary</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={formInputType === "basic"}
                        onChange={() => setFormInputType("basic")}
                        className="text-primary size-3.5"
                      />
                      <span>Basic Salary</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={formInputType === "ctc"}
                        onChange={() => setFormInputType("ctc")}
                        className="text-primary size-3.5"
                      />
                      <span>CTC</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                    CALCULATION METHOD <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formCalcMethod}
                    onChange={(e) => setFormCalcMethod(e.target.value as any)}
                    className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-background text-xs font-semibold text-foreground outline-none cursor-pointer"
                  >
                    <option value="mixed">Mixed (Fixed + Percentage + Formula)</option>
                    <option value="percentage">Percentage Based</option>
                    <option value="formula">Formula Based</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                    EFFECTIVE FROM <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formEffectiveFrom}
                    onChange={(e) => setFormEffectiveFrom(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-background text-xs font-semibold text-foreground outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                    EFFECTIVE TO
                  </label>
                  <input
                    type="date"
                    value={formEffectiveTo}
                    onChange={(e) => setFormEffectiveTo(e.target.value)}
                    placeholder="Pick a date"
                    className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-background text-xs font-semibold text-foreground outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                  DESCRIPTION
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="e.g. Default salary structure for worker"
                  className="w-full p-3 rounded-xl border border-border/80 bg-background text-xs text-foreground outline-none"
                />
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Salary Components</h3>
                    <p className="text-[11px] text-muted-foreground">
                      Define all earnings, deductions and benefits here.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openEditComp(null)}
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
                      {formComponents.map((comp, idx) => (
                        <tr key={comp.id} className="hover:bg-muted/30 transition">
                          <td className="px-4 py-3 text-center text-muted-foreground font-mono">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-foreground">
                            {comp.code}
                          </td>
                          <td className="px-4 py-3 font-medium text-foreground">{comp.name}</td>
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
                            {comp.valueFormula}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => openEditComp(comp)}
                                className="text-orange-500 hover:text-orange-600 transition p-1 cursor-pointer"
                                title="Edit"
                              >
                                <Pencil className="size-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setFormComponents((prev) => prev.filter((c) => c.id !== comp.id))
                                }
                                className="text-red-500 hover:text-red-650 transition p-1 cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="border-t border-border/50 px-6 py-4 bg-muted/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-10 px-6 rounded-xl border border-border/80 hover:bg-muted font-bold text-xs text-muted-foreground hover:text-foreground transition cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleSaveScale}
                className="h-10 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs shadow-md transition cursor-pointer"
              >
                UPDATE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submodal: Edit Component (Screenshot 3) */}
      {isCompModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden border border-border/80 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4.5 border-b border-border/50 bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-9 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 border border-blue-500/20">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight text-foreground">
                    Edit Component: {compName}
                  </h2>
                  <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                    Update component details
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

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                    COMPONENT CODE <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={compCode}
                    onChange={(e) => setCompCode(e.target.value.toUpperCase())}
                    className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-background text-xs font-mono font-bold text-foreground outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                    COMPONENT NAME <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={compName}
                    onChange={(e) => setCompName(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-background text-xs font-medium text-foreground outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                    COMPONENT TYPE <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={compType}
                    onChange={(e) => setCompType(e.target.value as any)}
                    className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-background text-xs font-semibold text-foreground outline-none cursor-pointer"
                  >
                    <option value="Formula">Formula</option>
                    <option value="Percentage">Percentage</option>
                    <option value="Fixed Amount">Fixed Amount</option>
                  </select>
                </div>
              </div>

              {compType === "Formula" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-1.5">
                      FORMULA
                    </label>
                    <input
                      ref={formulaInputRef}
                      type="text"
                      value={compFormula}
                      onChange={(e) => setCompFormula(e.target.value)}
                      className="w-full h-12 px-3.5 rounded-xl border border-border/80 bg-background text-sm font-mono text-foreground outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {(["GROSS", "BASIC", "HRA", "MED", "CONV", "FOOD", "PF"] as const).map(
                      (token) => (
                        <button
                          key={token}
                          type="button"
                          onClick={() => insertToken(token)}
                          className="px-3 py-1.5 rounded-lg border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-mono font-semibold transition cursor-pointer"
                        >
                          {token}
                        </button>
                      ),
                    )}
                    <span className="text-muted-foreground/40 font-light px-1">|</span>
                    {(["+", "-", "*", "/", "%", "(", ")"] as const).map((op) => (
                      <button
                        key={op}
                        type="button"
                        onClick={() => insertToken(op)}
                        className="size-8 rounded-lg border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-mono font-bold flex items-center justify-center transition cursor-pointer"
                      >
                        {op}
                      </button>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-blue-500/25 bg-blue-500/5 dark:bg-blue-950/20 p-4 space-y-2 text-xs">
                    <div className="flex items-start gap-2.5 text-blue-700 dark:text-blue-300 font-semibold">
                      <Info className="size-4.5 shrink-0 mt-0.5 text-blue-600" />
                      <span>
                        Formula supports basic math operators (+, -, *, /, %) and component variables.
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 pl-7 text-[11px]">
                      <span className="text-muted-foreground font-semibold">Variables:</span>
                      {(["GROSS", "BASIC", "HRA", "MED", "CONV", "FOOD", "PF"] as const).map((v) => (
                        <span
                          key={v}
                          onClick={() => insertToken(v)}
                          className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-700 dark:text-blue-300 font-mono font-bold cursor-pointer hover:bg-blue-500/25 transition"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                    <div className="pl-7 text-[11px] text-muted-foreground">
                      <span className="font-semibold text-foreground">Example: </span>
                      <code className="px-2 py-0.5 rounded bg-muted font-mono font-bold text-foreground">
                        (GROSS - MED - CONV - FOOD) / 1.5
                      </code>
                    </div>
                  </div>
                </div>
              )}

              {compType === "Percentage" && (
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl border border-border/70 bg-muted/10">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                      BASED ON
                    </label>
                    <select
                      value={compBasedOn}
                      onChange={(e) => setCompBasedOn(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-border/80 bg-background text-xs cursor-pointer"
                    >
                      <option value="BASIC">BASIC</option>
                      <option value="GROSS">GROSS</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                      PERCENTAGE (%)
                    </label>
                    <input
                      type="number"
                      value={compPct}
                      onChange={(e) => setCompPct(Number(e.target.value) || 0)}
                      className="w-full h-10 px-3 rounded-xl border border-border/80 bg-background text-xs font-bold"
                    />
                  </div>
                </div>
              )}

              {compType === "Fixed Amount" && (
                <div className="p-4 rounded-xl border border-border/70 bg-muted/10 space-y-1">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                    AMOUNT (৳)
                  </label>
                  <input
                    type="number"
                    value={compFixed}
                    onChange={(e) => setCompFixed(Number(e.target.value) || 0)}
                    className="w-full h-10 px-3 rounded-xl border border-border/80 bg-background text-xs font-bold"
                  />
                </div>
              )}
            </div>

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
                onClick={handleSaveComp}
                className="h-10 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs shadow-md transition cursor-pointer"
              >
                UPDATE COMPONENT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
