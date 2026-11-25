import React, { useMemo, useState } from "react";
import {
  ChevronRight,
  ArrowLeft,
  X,
  Search,
  Crown,
  ShieldCheck,
} from "lucide-react";
import {
  DashboardWidgetConfig,
  DASHBOARD_COMPONENTS_CATALOG,
} from "./dashboard-maker-types";

export type HierarchyLevel =
  | "company"
  | "region"
  | "department"
  | "section"
  | "unit"
  | "line"
  | "line_detail";

export type AccessPerspective = "management" | "head_3_depts";

interface HierarchyNode {
  id: string;
  name: string;
  code: string;
  headName: string;
  manpower: number;
  present: number;
  absent: number;
  late: number;
  otReqHrs: number;
  otUtilHrs: number;
  efficiency: number;
  fobValue: number; // in $K
  orderPcs: number; // in K
  stockValue: number; // in Lakhs
  managedByHead?: boolean;
}

interface HierarchyDrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  widget: DashboardWidgetConfig;
}

const LEVEL_ORDER: HierarchyLevel[] = [
  "company",
  "region",
  "department",
  "section",
  "unit",
  "line",
  "line_detail",
];

const LEVEL_LABELS: Record<HierarchyLevel, string> = {
  company: "Company",
  region: "Region",
  department: "Department",
  section: "Section",
  unit: "Unit",
  line: "Line",
  line_detail: "Line Roster",
};

function getNodesForLevel(
  level: HierarchyLevel,
  parentNode: HierarchyNode | null,
  accessMode: AccessPerspective,
  managedDepts: string[]
): HierarchyNode[] {
  const scale = parentNode ? Math.max(0.18, parentNode.manpower / 1248) : 1;

  if (level === "company") {
    return [
      {
        id: "comp_1",
        name: "Cripton Apparels Ltd.",
        code: "CAL-HQ",
        headName: "Tahmid Hasan",
        manpower: 1248,
        present: 1196,
        absent: 42,
        late: 73,
        otReqHrs: 14800,
        otUtilHrs: 13920,
        efficiency: 94.1,
        fobValue: 14850,
        orderPcs: 1820,
        stockValue: 428,
        managedByHead: true,
      },
      {
        id: "comp_2",
        name: "Cripton Knitwear & Spinning",
        code: "CKS-02",
        headName: "Rashedul Islam",
        manpower: 860,
        present: 812,
        absent: 34,
        late: 41,
        otReqHrs: 9200,
        otUtilHrs: 8480,
        efficiency: 92.2,
        fobValue: 9420,
        orderPcs: 1150,
        stockValue: 315,
        managedByHead: true,
      },
      {
        id: "comp_3",
        name: "Cripton Denim & Wash Ltd.",
        code: "CDW-03",
        headName: "Farhana Yasmin",
        manpower: 640,
        present: 584,
        absent: 44,
        late: 38,
        otReqHrs: 7400,
        otUtilHrs: 6420,
        efficiency: 86.8,
        fobValue: 6840,
        orderPcs: 790,
        stockValue: 264,
        managedByHead: false,
      },
    ];
  }

  if (level === "region") {
    const baseMp = parentNode?.manpower || 1248;
    return [
      {
        id: "reg_gazipur",
        name: "Dhaka North / Gazipur Zone",
        code: "REG-GZP",
        headName: "Kamrul Hasan",
        manpower: Math.round(baseMp * 0.52),
        present: Math.round(baseMp * 0.52 * 0.962),
        absent: Math.round(baseMp * 0.52 * 0.028),
        late: Math.round(baseMp * 0.52 * 0.052),
        otReqHrs: Math.round(7800 * scale),
        otUtilHrs: Math.round(7420 * scale),
        efficiency: 95.1,
        fobValue: Math.round(8200 * scale),
        orderPcs: Math.round(980 * scale),
        stockValue: Math.round(230 * scale),
        managedByHead: true,
      },
      {
        id: "reg_ashulia",
        name: "Ashulia / Savar Zone",
        code: "REG-ASH",
        headName: "Nusrat Jahan",
        manpower: Math.round(baseMp * 0.31),
        present: Math.round(baseMp * 0.31 * 0.945),
        absent: Math.round(baseMp * 0.31 * 0.041),
        late: Math.round(baseMp * 0.31 * 0.064),
        otReqHrs: Math.round(4500 * scale),
        otUtilHrs: Math.round(4180 * scale),
        efficiency: 92.9,
        fobValue: Math.round(4450 * scale),
        orderPcs: Math.round(540 * scale),
        stockValue: Math.round(125 * scale),
        managedByHead: true,
      },
      {
        id: "reg_ctg",
        name: "Chattogram EPZ Zone",
        code: "REG-CTG",
        headName: "Sajid Mahmud",
        manpower: Math.round(baseMp * 0.17),
        present: Math.round(baseMp * 0.17 * 0.908),
        absent: Math.round(baseMp * 0.17 * 0.072),
        late: Math.round(baseMp * 0.17 * 0.085),
        otReqHrs: Math.round(2500 * scale),
        otUtilHrs: Math.round(2320 * scale),
        efficiency: 88.4,
        fobValue: Math.round(2200 * scale),
        orderPcs: Math.round(300 * scale),
        stockValue: Math.round(73 * scale),
        managedByHead: false,
      },
    ];
  }

  if (level === "department") {
    const allDepts: HierarchyNode[] = [
      {
        id: "dept_sewing",
        name: "Sewing Floor",
        code: "DEPT-SEW",
        headName: "Md. Shafiqul Alam",
        manpower: Math.round(680 * scale),
        present: Math.round(654 * scale),
        absent: Math.round(20 * scale),
        late: Math.round(34 * scale),
        otReqHrs: Math.round(8200 * scale),
        otUtilHrs: Math.round(7840 * scale),
        efficiency: 95.6,
        fobValue: Math.round(7900 * scale),
        orderPcs: Math.round(950 * scale),
        stockValue: Math.round(140 * scale),
        managedByHead: managedDepts.some((d) => d.toLowerCase().includes("sewing")),
      },
      {
        id: "dept_cutting",
        name: "Cutting Unit",
        code: "DEPT-CUT",
        headName: "Tariqul Islam",
        manpower: Math.round(140 * scale),
        present: Math.round(134 * scale),
        absent: Math.round(4 * scale),
        late: Math.round(7 * scale),
        otReqHrs: Math.round(2350 * scale),
        otUtilHrs: Math.round(2210 * scale),
        efficiency: 94.0,
        fobValue: Math.round(2150 * scale),
        orderPcs: Math.round(320 * scale),
        stockValue: Math.round(115 * scale),
        managedByHead: managedDepts.some((d) => d.toLowerCase().includes("cutting")),
      },
      {
        id: "dept_finishing",
        name: "Finishing & Packing",
        code: "DEPT-FIN",
        headName: "Anisur Rahman",
        manpower: Math.round(210 * scale),
        present: Math.round(192 * scale),
        absent: Math.round(12 * scale),
        late: Math.round(18 * scale),
        otReqHrs: Math.round(2000 * scale),
        otUtilHrs: Math.round(1750 * scale),
        efficiency: 87.5,
        fobValue: Math.round(2400 * scale),
        orderPcs: Math.round(310 * scale),
        stockValue: Math.round(85 * scale),
        managedByHead: managedDepts.some((d) => d.toLowerCase().includes("finishing")),
      },
      {
        id: "dept_qa",
        name: "Quality Assurance",
        code: "DEPT-QA",
        headName: "Sabina Yasmin",
        manpower: Math.round(95 * scale),
        present: Math.round(92 * scale),
        absent: Math.round(2 * scale),
        late: Math.round(5 * scale),
        otReqHrs: Math.round(1100 * scale),
        otUtilHrs: Math.round(1045 * scale),
        efficiency: 95.0,
        fobValue: Math.round(980 * scale),
        orderPcs: Math.round(120 * scale),
        stockValue: Math.round(22 * scale),
        managedByHead: managedDepts.some((d) => d.toLowerCase().includes("quality")),
      },
      {
        id: "dept_merch",
        name: "Merchandising",
        code: "DEPT-MM",
        headName: "Nadia Chowdhury",
        manpower: Math.round(42 * scale),
        present: Math.round(41 * scale),
        absent: Math.round(1 * scale),
        late: Math.round(2 * scale),
        otReqHrs: Math.round(450 * scale),
        otUtilHrs: Math.round(430 * scale),
        efficiency: 95.5,
        fobValue: Math.round(1420 * scale),
        orderPcs: Math.round(120 * scale),
        stockValue: Math.round(18 * scale),
        managedByHead: managedDepts.some((d) => d.toLowerCase().includes("merchandising")),
      },
      {
        id: "dept_hr",
        name: "HR & Compliance",
        code: "DEPT-HRC",
        headName: "Mahmudul Hasan",
        manpower: Math.round(48 * scale),
        present: Math.round(47 * scale),
        absent: Math.round(1 * scale),
        late: Math.round(2 * scale),
        otReqHrs: Math.round(300 * scale),
        otUtilHrs: Math.round(290 * scale),
        efficiency: 96.7,
        fobValue: 0,
        orderPcs: 0,
        stockValue: Math.round(12 * scale),
        managedByHead: managedDepts.some((d) => d.toLowerCase().includes("hr")),
      },
    ];

    if (accessMode === "head_3_depts") {
      const filtered = allDepts.filter((d) => d.managedByHead);
      return filtered.length > 0 ? filtered : allDepts.slice(0, 3);
    }
    return allDepts;
  }

  if (level === "section") {
    const deptName = parentNode?.name || "Sewing Floor";
    const sectionTemplates: Record<string, string[]> = {
      "Sewing Floor": ["Knit Tops Section", "Woven Bottoms Section", "Sample & Pilot Section"],
      "Cutting Unit": ["CAD & Marker Section", "Spreading & Cutting Section", "Numbering & Bundling"],
      "Finishing & Packing": ["Ironing & Steam Press", "Poly & Carton Packing", "Spot & Stain Removal"],
      "Quality Assurance": ["Inline & End-line QC", "AQL Final Audit Section"],
      Merchandising: ["European Buyers Desk", "US & UK Buyers Desk"],
      "HR & Compliance": ["Attendance & Payroll Ops", "Safety & Compliance Audit"],
    };
    const names = sectionTemplates[deptName] || ["Main Operations Section", "Support Section"];
    return names.map((secName, i) => {
      const ratio = i === 0 ? 0.45 : i === 1 ? 0.35 : 0.2;
      const mp = Math.max(12, Math.round((parentNode?.manpower || 200) * ratio));
      const eff = i === 2 ? 89.2 : 95.4 - i * 1.4;
      return {
        id: `sec_${i}_${secName.slice(0, 4)}`,
        name: secName,
        code: `SEC-0${i + 1}`,
        headName: ["Engr. Rakib Hasan", "Mst. Farida Begum", "Sohel Rana"][i % 3],
        manpower: mp,
        present: Math.round(mp * (eff / 100)),
        absent: Math.max(1, Math.round(mp * ((100 - eff) / 140))),
        late: Math.max(1, Math.round(mp * 0.04)),
        otReqHrs: Math.max(80, Math.round((parentNode?.otReqHrs || 1000) * ratio)),
        otUtilHrs: Math.max(70, Math.round((parentNode?.otUtilHrs || 920) * ratio)),
        efficiency: Number(eff.toFixed(1)),
        fobValue: Math.round((parentNode?.fobValue || 1000) * ratio),
        orderPcs: Math.round((parentNode?.orderPcs || 200) * ratio),
        stockValue: Math.round((parentNode?.stockValue || 50) * ratio),
      };
    });
  }

  if (level === "unit") {
    const units = [
      { name: "Unit-A (Main Building, Floor 1)", code: "UNIT-A1", ratio: 0.55, eff: 95.8, head: "Jahangir Alam" },
      { name: "Unit-B (Extension Wing, Floor 2)", code: "UNIT-B2", ratio: 0.45, eff: 91.4, head: "Moniruzzaman" },
    ];
    return units.map((u, i) => {
      const mp = Math.max(8, Math.round((parentNode?.manpower || 100) * u.ratio));
      return {
        id: `unit_${i}`,
        name: u.name,
        code: u.code,
        headName: u.head,
        manpower: mp,
        present: Math.round(mp * 0.95),
        absent: Math.max(0, Math.round(mp * 0.03)),
        late: Math.max(1, Math.round(mp * 0.05)),
        otReqHrs: Math.max(40, Math.round((parentNode?.otReqHrs || 400) * u.ratio)),
        otUtilHrs: Math.max(36, Math.round((parentNode?.otUtilHrs || 370) * u.ratio)),
        efficiency: u.eff,
        fobValue: Math.round((parentNode?.fobValue || 400) * u.ratio),
        orderPcs: Math.round((parentNode?.orderPcs || 100) * u.ratio),
        stockValue: Math.round((parentNode?.stockValue || 25) * u.ratio),
      };
    });
  }

  if (level === "line") {
    const lines = [
      { name: "Line-01 (H&M Basic Tee)", code: "LN-01", ratio: 0.36, eff: 96.8, chief: "Abdul Karim" },
      { name: "Line-02 (Zara Polo Knit)", code: "LN-02", ratio: 0.34, eff: 94.5, chief: "Nasrin Akter" },
      { name: "Line-03 (Target Fleece Hoodie)", code: "LN-03", ratio: 0.30, eff: 88.2, chief: "Babul Hossain" },
    ];
    return lines.map((l, i) => {
      const mp = Math.max(6, Math.round((parentNode?.manpower || 60) * l.ratio));
      return {
        id: `line_${i}`,
        name: l.name,
        code: l.code,
        headName: l.chief,
        manpower: mp,
        present: Math.round(mp * (l.eff / 100)),
        absent: Math.max(0, mp - Math.round(mp * (l.eff / 100))),
        late: i === 2 ? 3 : 1,
        otReqHrs: Math.max(20, Math.round((parentNode?.otReqHrs || 200) * l.ratio)),
        otUtilHrs: Math.max(18, Math.round((parentNode?.otUtilHrs || 185) * l.ratio * (l.eff / 95))),
        efficiency: l.eff,
        fobValue: Math.round((parentNode?.fobValue || 200) * l.ratio),
        orderPcs: Math.round((parentNode?.orderPcs || 50) * l.ratio),
        stockValue: Math.round((parentNode?.stockValue || 12) * l.ratio),
      };
    });
  }

  return [];
}

function getWidgetDomain(componentId: string, module?: string): "ot" | "attendance" | "merchandising" | "inventory" | "finance" {
  if (componentId.includes("ot_requisition") || componentId.includes("ot_")) return "ot";
  if (module === "merchandising" || componentId.startsWith("mm_")) return "merchandising";
  if (module === "inventory" || componentId.startsWith("inv_")) return "inventory";
  if (module === "accounts" || componentId.startsWith("acc_")) return "finance";
  return "attendance";
}

export const HierarchyDrillDownModal: React.FC<HierarchyDrillDownModalProps> = ({
  isOpen,
  onClose,
  widget,
}) => {
  const def = DASHBOARD_COMPONENTS_CATALOG.find((c) => c.id === widget.componentId);
  const displayTitle = widget.customTitle || def?.name || "Dashboard Metric";
  const domain = getWidgetDomain(widget.componentId, def?.module);

  const initialAccess: AccessPerspective =
    widget.settings?.scope === "managed_depts" ? "head_3_depts" : "management";

  const [accessMode, setAccessMode] = useState<AccessPerspective>(initialAccess);
  const [trail, setTrail] = useState<Array<{ level: HierarchyLevel; node: HierarchyNode }>>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const managedDepts = widget.settings?.managedDepartments || [
    "Sewing Floor",
    "Cutting Unit",
    "Finishing & Packing",
  ];

  const currentLevel: HierarchyLevel = useMemo(() => {
    if (trail.length === 0) return "company";
    const lastLevel = trail[trail.length - 1].level;
    const idx = LEVEL_ORDER.indexOf(lastLevel);
    return LEVEL_ORDER[Math.min(idx + 1, LEVEL_ORDER.length - 1)];
  }, [trail]);

  const currentParent = trail.length > 0 ? trail[trail.length - 1].node : null;

  const nodes = useMemo(() => {
    if (currentLevel === "line_detail") return [];
    const raw = getNodesForLevel(currentLevel, currentParent, accessMode, managedDepts);
    if (!searchTerm.trim()) return raw;
    const q = searchTerm.toLowerCase();
    return raw.filter(
      (n) =>
        n.name.toLowerCase().includes(q) ||
        n.code.toLowerCase().includes(q) ||
        n.headName.toLowerCase().includes(q)
    );
  }, [currentLevel, currentParent, accessMode, managedDepts, searchTerm]);

  const summary = useMemo(() => {
    if (currentParent) return currentParent;
    const list = nodes.length > 0 ? nodes : getNodesForLevel("company", null, accessMode, managedDepts);
    return {
      manpower: list.reduce((s, n) => s + n.manpower, 0),
      present: list.reduce((s, n) => s + n.present, 0),
      absent: list.reduce((s, n) => s + n.absent, 0),
      late: list.reduce((s, n) => s + n.late, 0),
      otReqHrs: list.reduce((s, n) => s + n.otReqHrs, 0),
      otUtilHrs: list.reduce((s, n) => s + n.otUtilHrs, 0),
      efficiency: Number((list.length > 0 ? list.reduce((s, n) => s + n.efficiency, 0) / list.length : 0).toFixed(1)),
      fobValue: list.reduce((s, n) => s + n.fobValue, 0),
      orderPcs: list.reduce((s, n) => s + n.orderPcs, 0),
      stockValue: list.reduce((s, n) => s + n.stockValue, 0),
    };
  }, [currentParent, nodes, accessMode, managedDepts]);

  if (!isOpen) return null;

  const handleDrillInto = (node: HierarchyNode) => {
    setTrail((prev) => [...prev, { level: currentLevel, node }]);
    setSearchTerm("");
  };

  const handleJumpToTrail = (index: number) => {
    setTrail((prev) => (index < 0 ? [] : prev.slice(0, index + 1)));
    setSearchTerm("");
  };

  const handleGoBack = () => {
    setTrail((prev) => prev.slice(0, -1));
    setSearchTerm("");
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Minimal Header */}
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-foreground truncate">{displayTitle}</h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
              {LEVEL_LABELS[currentLevel]}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="inline-flex rounded-lg border border-border bg-muted/30 p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setAccessMode("management");
                  setTrail([]);
                }}
                className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                  accessMode === "management"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ShieldCheck className="size-3" />
                Management
              </button>
              <button
                type="button"
                onClick={() => {
                  setAccessMode("head_3_depts");
                  setTrail([]);
                }}
                className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                  accessMode === "head_3_depts"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Crown className="size-3 text-amber-500" />
                Head (3 Depts)
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="size-7 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Clean Breadcrumb & Search Bar */}
        <div className="px-5 py-2.5 border-b border-border/60 bg-muted/20 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1 flex-wrap text-xs">
            {trail.length > 0 && (
              <button
                type="button"
                onClick={handleGoBack}
                className="mr-1 px-2 py-1 rounded border border-border bg-background hover:bg-muted text-foreground font-medium flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="size-3" />
              </button>
            )}

            <button
              type="button"
              onClick={() => handleJumpToTrail(-1)}
              className={`px-2 py-1 rounded font-semibold cursor-pointer ${
                trail.length === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Company
            </button>

            {trail.map((step, idx) => (
              <React.Fragment key={`${step.level}-${step.node.id}`}>
                <ChevronRight className="size-3.5 text-muted-foreground/50 shrink-0" />
                <button
                  type="button"
                  onClick={() => handleJumpToTrail(idx)}
                  className={`px-2 py-1 rounded font-semibold cursor-pointer truncate max-w-[150px] ${
                    idx === trail.length - 1
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {step.node.name}
                </button>
              </React.Fragment>
            ))}

            {trail.length > 0 && currentLevel !== "line_detail" && (
              <>
                <ChevronRight className="size-3.5 text-muted-foreground/50 shrink-0" />
                <span className="px-2 py-1 rounded bg-primary text-primary-foreground font-semibold">
                  {LEVEL_LABELS[currentLevel]}s
                </span>
              </>
            )}
          </div>

          {currentLevel !== "line_detail" && (
            <div className="relative w-full sm:w-52">
              <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full h-7 pl-8 pr-2.5 rounded-md border border-border bg-background text-xs outline-none focus:border-primary"
              />
            </div>
          )}
        </div>

        {/* Clean Summary Strip */}
        <div className="px-5 py-3 border-b border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-background text-xs">
          {domain === "ot" ? (
            <>
              <div>
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Requisition</span>
                <div className="text-sm font-bold text-foreground">{summary.otReqHrs.toLocaleString()} hrs</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Utilized</span>
                <div className="text-sm font-bold text-emerald-600">{summary.otUtilHrs.toLocaleString()} hrs</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Rate</span>
                <div className="text-sm font-bold text-foreground">
                  {summary.otReqHrs > 0 ? ((summary.otUtilHrs / summary.otReqHrs) * 100).toFixed(1) : summary.efficiency}%
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Idle / Saved</span>
                <div className="text-sm font-bold text-amber-600">{Math.max(0, summary.otReqHrs - summary.otUtilHrs).toLocaleString()} hrs</div>
              </div>
            </>
          ) : domain === "merchandising" ? (
            <>
              <div>
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Order Volume</span>
                <div className="text-sm font-bold text-foreground">{summary.orderPcs.toLocaleString()}K Pcs</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">FOB Value</span>
                <div className="text-sm font-bold text-blue-600">${(summary.fobValue / 1000).toFixed(2)}M</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">On-Time T&A</span>
                <div className="text-sm font-bold text-emerald-600">{summary.efficiency}%</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Manpower</span>
                <div className="text-sm font-bold text-foreground">{summary.manpower.toLocaleString()}</div>
              </div>
            </>
          ) : domain === "inventory" ? (
            <>
              <div>
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Stock Value</span>
                <div className="text-sm font-bold text-foreground">৳{summary.stockValue.toLocaleString()}L</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">In-House Ready</span>
                <div className="text-sm font-bold text-emerald-600">{summary.efficiency}%</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Orders</span>
                <div className="text-sm font-bold text-foreground">{summary.orderPcs.toLocaleString()}K</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Low Stock</span>
                <div className="text-sm font-bold text-rose-600">{Math.max(2, Math.round(summary.absent / 5))} SKUs</div>
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Total Manpower</span>
                <div className="text-sm font-bold text-foreground">{summary.manpower.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Present</span>
                <div className="text-sm font-bold text-emerald-600">
                  {summary.present.toLocaleString()} ({summary.manpower > 0 ? ((summary.present / summary.manpower) * 100).toFixed(1) : 0}%)
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Absent</span>
                <div className="text-sm font-bold text-rose-600">{summary.absent.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Late / Eff</span>
                <div className="text-sm font-bold text-amber-600">{summary.late} • {summary.efficiency}%</div>
              </div>
            </>
          )}
        </div>

        {/* Clean Table Body */}
        <div className="overflow-y-auto flex-1">
          {currentLevel === "line_detail" && currentParent ? (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-muted/40 sticky top-0 border-b border-border text-[11px] text-muted-foreground uppercase">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">ID</th>
                  <th className="py-2.5 px-4 font-semibold">Employee</th>
                  <th className="py-2.5 px-4 font-semibold">Designation</th>
                  <th className="py-2.5 px-4 font-semibold text-right">In Time</th>
                  <th className="py-2.5 px-4 font-semibold text-right">OT</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {[
                  { id: "OP-1042", name: "Rahima Khatun", role: "Sr. Sewing Operator", inTime: "07:54 AM", ot: "2.0h", status: "Present" },
                  { id: "OP-1088", name: "Md. Rubel Mia", role: "Flatlock Operator", inTime: "07:58 AM", ot: "2.0h", status: "Present" },
                  { id: "OP-1104", name: "Sumaiya Akter", role: "Lockstitch Operator", inTime: "08:14 AM", ot: "1.5h", status: "Late" },
                  { id: "OP-1129", name: "Jashim Uddin", role: "Quality Checker", inTime: "—", ot: "0.0h", status: "Absent" },
                  { id: "OP-1152", name: "Taslima Begum", role: "Helper", inTime: "07:51 AM", ot: "2.0h", status: "Present" },
                ].map((op) => (
                  <tr key={op.id} className="hover:bg-muted/30">
                    <td className="py-2.5 px-4 font-mono text-[11px] text-muted-foreground">{op.id}</td>
                    <td className="py-2.5 px-4 font-semibold text-foreground">{op.name}</td>
                    <td className="py-2.5 px-4 text-muted-foreground">{op.role}</td>
                    <td className="py-2.5 px-4 text-right font-medium">{op.inTime}</td>
                    <td className="py-2.5 px-4 text-right font-medium">{op.ot}</td>
                    <td className="py-2.5 px-4 text-right">
                      <span
                        className={`text-[11px] font-semibold ${
                          op.status === "Present"
                            ? "text-emerald-600"
                            : op.status === "Late"
                            ? "text-amber-600"
                            : "text-rose-600"
                        }`}
                      >
                        {op.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-muted/40 sticky top-0 border-b border-border text-[11px] text-muted-foreground uppercase">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">{LEVEL_LABELS[currentLevel]}</th>
                  <th className="py-2.5 px-4 font-semibold hidden sm:table-cell">Code</th>
                  <th className="py-2.5 px-4 font-semibold hidden md:table-cell">Lead</th>
                  {domain === "ot" ? (
                    <>
                      <th className="py-2.5 px-4 font-semibold text-right">Requisition</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Utilized</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Rate</th>
                    </>
                  ) : domain === "merchandising" ? (
                    <>
                      <th className="py-2.5 px-4 font-semibold text-right">Orders</th>
                      <th className="py-2.5 px-4 font-semibold text-right">FOB</th>
                      <th className="py-2.5 px-4 font-semibold text-right">On-Time</th>
                    </>
                  ) : domain === "inventory" ? (
                    <>
                      <th className="py-2.5 px-4 font-semibold text-right">Stock</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Ready</th>
                    </>
                  ) : (
                    <>
                      <th className="py-2.5 px-4 font-semibold text-right">Manpower</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Present</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Absent</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Rate</th>
                    </>
                  )}
                  <th className="py-2.5 px-3 w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {nodes.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted-foreground">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  nodes.map((node) => {
                    const attPct = node.manpower > 0 ? (node.present / node.manpower) * 100 : 0;
                    const otPct = node.otReqHrs > 0 ? (node.otUtilHrs / node.otReqHrs) * 100 : 0;

                    return (
                      <tr
                        key={node.id}
                        onClick={() => handleDrillInto(node)}
                        className="hover:bg-muted/40 cursor-pointer transition-colors group"
                      >
                        <td className="py-2.5 px-4 font-semibold text-foreground group-hover:text-primary">
                          {node.name}
                        </td>
                        <td className="py-2.5 px-4 font-mono text-[11px] text-muted-foreground hidden sm:table-cell">
                          {node.code}
                        </td>
                        <td className="py-2.5 px-4 text-muted-foreground hidden md:table-cell">
                          {node.headName}
                        </td>

                        {domain === "ot" ? (
                          <>
                            <td className="py-2.5 px-4 text-right font-medium">{node.otReqHrs.toLocaleString()}h</td>
                            <td className="py-2.5 px-4 text-right font-semibold text-emerald-600">{node.otUtilHrs.toLocaleString()}h</td>
                            <td className="py-2.5 px-4 text-right font-bold">{otPct.toFixed(1)}%</td>
                          </>
                        ) : domain === "merchandising" ? (
                          <>
                            <td className="py-2.5 px-4 text-right font-medium">{node.orderPcs}K</td>
                            <td className="py-2.5 px-4 text-right font-semibold text-blue-600">${(node.fobValue / 1000).toFixed(2)}M</td>
                            <td className="py-2.5 px-4 text-right font-bold">{node.efficiency}%</td>
                          </>
                        ) : domain === "inventory" ? (
                          <>
                            <td className="py-2.5 px-4 text-right font-semibold">৳{node.stockValue}L</td>
                            <td className="py-2.5 px-4 text-right font-bold text-emerald-600">{node.efficiency}%</td>
                          </>
                        ) : (
                          <>
                            <td className="py-2.5 px-4 text-right font-medium">{node.manpower.toLocaleString()}</td>
                            <td className="py-2.5 px-4 text-right font-semibold text-emerald-600">{node.present.toLocaleString()}</td>
                            <td className="py-2.5 px-4 text-right font-semibold text-rose-600">{node.absent.toLocaleString()}</td>
                            <td className="py-2.5 px-4 text-right font-bold">{attPct.toFixed(1)}%</td>
                          </>
                        )}

                        <td className="py-2.5 px-3 text-right text-muted-foreground group-hover:text-primary">
                          <ChevronRight className="size-4 inline" />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
