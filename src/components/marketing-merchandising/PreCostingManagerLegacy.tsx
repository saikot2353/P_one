import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Plus, Search, FileText, ArrowLeft, Save, Printer,
  Eye, X, CheckCircle, Clock, AlertCircle, Download,
  FileSpreadsheet, GitBranch, History, Check, ShieldCheck,
  Send, RotateCcw, AlertTriangle, Layers, Trash2, ArrowRight,
  Upload, Paperclip, File, Image as ImageIcon, Info, ExternalLink,
  Scissors
} from "lucide-react";
import { toast } from "sonner";
import {
  MM_BUYERS_MASTER,
  MM_MERCHANTS_MASTER,
  MMRepository,
  MMPreCostPO,
  MMPreCostItem,
  MMPreCostVersionSnapshot,
  MMPreCostAuditEntry,
  MMPreCostAttachmentRecord,
  MMSeasonMasterItem,
  MMFabricMasterItem,
  MMAccessoriesMasterItem,
  ApprovalStatus,
} from "../../lib/marketing-merchandising-data";
import { SearchableSelect } from "../ui/searchable-select";

export interface PreCostingManagerProps {
  initialTab?: "register" | "create" | "compare" | "report";
  onTabChange?: (tab: "register" | "create" | "compare" | "report") => void;
}

// ── Models & Interfaces ──────────────────────────────────────────
export interface PreCostingItemRow {
  id?: string;
  sl: number;
  preCostItemId?: string;
  head: string;
  item: string;
  description: string;
  usedPlace?: string;
  color?: string;
  codeNo?: string;
  nStatus: string;
  supplier: string;
  effectedQty: number;
  consumption: number;
  unit: string;
  requiredQty: number;
  finalQty: number;
  rate: number;
  amount: number;
  preCostPct?: number;
}

export interface PreCostingRecord {
  id: string;
  preCostId: string; // e.g. JOB-2026-0001
  preCostNo: string; // e.g. 26918
  preCostDate: string;
  contractNo?: string;
  ourRef?: string;
  acHolder: string;
  buyer: string;
  merchandiser: string;
  style: string;
  styleDescription: string;
  season: string;
  currency: string;
  smv: number;
  cpm: number;
  efficiencyPct: number;
  note: string;
  // Multiple Purchase Orders
  poRows: MMPreCostPO[];
  // Item-wise costing details
  items: PreCostingItemRow[];
  // Attachments (Documents & Images)
  attachments?: MMPreCostAttachmentRecord[];
  // Status & Workflow
  status: ApprovalStatus;
  version: number;
  isCurrentActive: boolean;
  amendmentReason?: string;
  // Audit & Decision
  createdBy: string;
  createdDate: string;
  submittedBy?: string;
  submittedDate?: string;
  approvedBy?: string;
  approvalDate?: string;
  rejectedBy?: string;
  rejectionDate?: string;
  decisionComments?: string;
  // Version Snapshots & Audit Trail
  versions: MMPreCostVersionSnapshot[];
  auditHistory: MMPreCostAuditEntry[];
}

// 12 Standard Head Options
export const PRE_COSTING_HEADS = [
  "Shell",
  "Rib",
  "Body",
  "Collar & Cuff",
  "Collar",
  "Cuff",
  "Pocket",
  "Hood",
  "Lining",
  "Sewing Trims",
  "Finishing Trims",
  "Wash",
] as const;

// Fabric-related heads: show only Fabric Items from Fabric Master
export const FABRIC_HEADS = [
  "Shell",
  "Rib",
  "Body",
  "Collar & Cuff",
  "Collar",
  "Cuff",
  "Pocket",
  "Hood",
  "Lining",
];

// Accessories-related heads: show only Accessories Items from Accessories Master
export const ACCESSORIES_HEADS = [
  "Sewing Trims",
  "Finishing Trims",
  "Wash",
];

// Exact two selectable values for N. Status
export const NOMINEE_STATUSES = [
  "Nominated",
  "Own Source",
] as const;

const UOM_OPTIONS = ["Kg", "Pcs", "Dzn", "Yards", "Mtr", "Cone", "Gross", "Set"];

const DEFAULT_SUPPLIERS = [
  "Pakiza Knitting & Dyeing Ltd",
  "Pakiza Spinning Mills Ltd",
  "Pakiza Woven Composite Ltd",
  "Dekko Buttons Ltd",
  "Avery Dennison BD",
  "Coats Bangladesh Ltd",
  "YKK Bangladesh Ltd",
  "Local Sourced Vendor",
];

// ── Reference Baseline Sample Data ───────────────────────────────
const INITIAL_RECORDS: PreCostingRecord[] = [
  {
    id: "pc-rec-1",
    preCostId: "PC-2026-001",
    preCostNo: "26918",
    preCostDate: "2026-09-15",
    contractNo: "CT-PKCL-2026-881",
    ourRef: "REF-99238",
    acHolder: "Md. Rashidul Islam",
    buyer: "H&M Hennes & Mauritz",
    merchandiser: "Tanvir Ahmed",
    style: "HM-KT-8841",
    styleDescription: "Ladies Ribbed Henley Neck T-Shirt",
    season: "Autumn / Winter 2026",
    currency: "USD",
    smv: 4.62,
    cpm: 0.065,
    efficiencyPct: 65,
    note: "Style Pre Costing based on confirmed tech pack v2. Fabric production scheduled in Mirzapur unit.",
    poRows: [
      { id: "po-1", sl: 1, poNumber: "PO-HM-99881-A", poQuantity: 25000, rate: 4.15, value: 103750, remarks: "Main Lot Delivery" },
      { id: "po-2", sl: 2, poNumber: "PO-HM-99881-B", poQuantity: 14024, rate: 4.15, value: 58199.6, remarks: "Repeat Shipment Lot" },
    ],
    items: [
      {
        id: "item-1",
        sl: 1,
        preCostItemId: "PCI-101",
        head: "Fabric",
        item: "100% Cotton 2x2 Rib Fabric 220 GSM",
        description: "2x2 Rib, Bio-washed combed cotton",
        usedPlace: "Main Body & Sleeves",
        color: "Verdant Green",
        codeNo: "FAB-KT-001",
        nStatus: "Nominated",
        supplier: "Pakiza Knitting & Dyeing Ltd",
        effectedQty: 39024,
        consumption: 0.28,
        unit: "Kg",
        requiredQty: 10926.72,
        finalQty: 11473.06,
        rate: 4.20,
        amount: 48186.85,
        preCostPct: 41.25,
      },
      {
        id: "item-2",
        sl: 2,
        preCostItemId: "PCI-102",
        head: "Fabric",
        item: "1x1 Cotton Spandex Rib 240 GSM",
        description: "95% Cotton 5% Spandex matching color",
        usedPlace: "Neckband & Placket Facing",
        color: "Verdant Green",
        codeNo: "FAB-KT-002",
        nStatus: "Nominated",
        supplier: "Pakiza Knitting & Dyeing Ltd",
        effectedQty: 39024,
        consumption: 0.04,
        unit: "Kg",
        requiredQty: 1560.96,
        finalQty: 1654.62,
        rate: 5.10,
        amount: 8438.56,
        preCostPct: 7.22,
      },
      {
        id: "item-3",
        sl: 3,
        preCostItemId: "PCI-103",
        head: "Yarn",
        item: "24/1 Combed Cotton Ring Spun",
        description: "Virgin staple 30mm cotton yarn",
        usedPlace: "Knitting Yarn",
        color: "Raw White",
        codeNo: "YRN-CT-24",
        nStatus: "Self Source",
        supplier: "Pakiza Spinning Mills Ltd",
        effectedQty: 39024,
        consumption: 0.31,
        unit: "Kg",
        requiredQty: 12097.44,
        finalQty: 12823.29,
        rate: 2.75,
        amount: 35264.05,
        preCostPct: 30.19,
      },
      {
        id: "item-4",
        sl: 4,
        preCostItemId: "PCI-104",
        head: "Accessories",
        item: "Natural Shell 4-Hole Button 18L",
        description: "Engraved rim, DTM polished",
        usedPlace: "Front Placket (3 pcs/garment)",
        color: "DTM Green",
        codeNo: "ACC-BTN-18L",
        nStatus: "Buyer Nominee",
        supplier: "Dekko Buttons Ltd",
        effectedQty: 39024,
        consumption: 3,
        unit: "Pcs",
        requiredQty: 117072,
        finalQty: 120584,
        rate: 0.035,
        amount: 4220.44,
        preCostPct: 3.61,
      },
      {
        id: "item-5",
        sl: 5,
        preCostItemId: "PCI-105",
        head: "Trims",
        item: "Woven Main Brand Tag 45x20mm",
        description: "High definition damask ultrasonic cut",
        usedPlace: "Inside Back Neck Center",
        color: "White / Black Logo",
        codeNo: "TRM-LBL-01",
        nStatus: "Buyer Nominee",
        supplier: "Avery Dennison BD",
        effectedQty: 39024,
        consumption: 1,
        unit: "Pcs",
        requiredQty: 39024,
        finalQty: 39804,
        rate: 0.045,
        amount: 1791.18,
        preCostPct: 1.53,
      },
      {
        id: "item-6",
        sl: 6,
        preCostItemId: "PCI-106",
        head: "CM Cost",
        item: "Cutting, Making & Finishing Cost",
        description: "Standard sewing line operation",
        usedPlace: "Garment Sewing Line",
        color: "All",
        codeNo: "CM-RMG-01",
        nStatus: "Self Source",
        supplier: "Pakiza Knit Composite Ltd",
        effectedQty: 39024,
        consumption: 1,
        unit: "Pcs",
        requiredQty: 39024,
        finalQty: 39024,
        rate: 0.48,
        amount: 18731.52,
        preCostPct: 16.03,
      },
    ],
    status: "Approved",
    version: 1,
    isCurrentActive: true,
    createdBy: "Tanvir Ahmed (Merchandiser)",
    createdDate: "2026-09-15 10:30",
    submittedBy: "Tanvir Ahmed",
    submittedDate: "2026-09-16 14:15",
    approvedBy: "Rashidul Islam (Head of Merchandising)",
    approvalDate: "2026-09-18 16:45",
    decisionComments: "Approved within target margin. Proceed with BOM and raw material booking.",
    versions: [],
    auditHistory: [
      {
        versionNumber: 1,
        createdBy: "Tanvir Ahmed (Merchandiser)",
        createdDate: "2026-09-15 10:30",
        submittedBy: "Tanvir Ahmed",
        submittedDate: "2026-09-16 14:15",
        approvedBy: "Rashidul Islam (Head of Merchandising)",
        approvalDate: "2026-09-18 16:45",
        decisionComments: "Approved within target margin. Proceed with BOM and raw material booking.",
        status: "Approved",
      },
    ],
  },
];

// Helper to snapshot a record into MMPreCostVersionSnapshot
function createVersionSnapshot(r: PreCostingRecord): MMPreCostVersionSnapshot {
  const poRows = Array.isArray(r.poRows) ? r.poRows : [];
  const items = Array.isArray(r.items) ? r.items : [];
  const orderQty = poRows.reduce((sum, p) => sum + (Number(p.poQuantity) || 0), 0);
  const totalPoValue = poRows.reduce((sum, p) => sum + (Number(p.value) || 0), 0);
  const avgRate = orderQty > 0 ? totalPoValue / orderQty : 0;
  const totalCost = items.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  const surplus = totalPoValue - totalCost;
  const surplusPcs = orderQty > 0 ? surplus / orderQty : 0;
  const eff = Number(r.efficiencyPct) || 65;
  const smvCost = eff > 0 ? ((Number(r.cpm) || 0.065) * (Number(r.smv) || 0)) / (eff / 100) : 0;

  return {
    versionNumber: r.version || 1,
    previousVersionNumber: (r.version || 1) > 1 ? (r.version || 1) - 1 : undefined,
    amendmentReason: r.amendmentReason || "",
    createdBy: r.createdBy || "Tanvir Ahmed",
    createdDate: r.createdDate || new Date().toISOString().replace("T", " ").substring(0, 16),
    submittedBy: r.submittedBy,
    submittedDate: r.submittedDate,
    approvedBy: r.approvedBy,
    approvalDate: r.approvalDate,
    rejectedBy: r.rejectedBy,
    rejectionDate: r.rejectionDate,
    decisionComments: r.decisionComments,
    status: r.status || "Draft",
    header: {
      preCostId: r.preCostId || "JOB-2026-0001",
      preCostNo: r.preCostNo || "26918",
      preCostDate: r.preCostDate || new Date().toISOString().split("T")[0],
      contractNo: r.contractNo || "",
      ourRef: r.ourRef || "",
      acHolder: r.acHolder || "",
      buyer: r.buyer || "",
      merchandiser: r.merchandiser || "",
      style: r.style || "",
      note: r.note || "",
      smv: Number(r.smv) || 0,
      currency: r.currency || "USD",
    },
    poRows: poRows.map((p) => ({ ...p })),
    items: items.map((i) => ({ ...i })) as any,
    summary: {
      gmtQty: orderQty,
      rate: avgRate,
      value: totalPoValue,
      smv: Number(r.smv) || 0,
      orderQty,
      remarks: r.note || "",
      totalGmtQty: orderQty,
      totalGmtValue: totalPoValue,
      totalCost,
      surplus,
      surplusPcs,
      smvCost,
    },
  };
}

// ── Main Pre Costing Component ───────────────────────────────────
export function PreCostingManager({ initialTab = "register", onTabChange }: PreCostingManagerProps) {
  const [records, setRecords] = useState<PreCostingRecord[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("cripton_pre_costings_master_v1");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((r) => {
              const poRows = Array.isArray(r.poRows) ? r.poRows : [];
              const items = Array.isArray(r.items) ? r.items : [];
              const normalized: PreCostingRecord = {
                ...r,
                preCostId: r.preCostId || "JOB-2026-0001",
                preCostNo: r.preCostNo || "26920",
                buyer: r.buyer || "H&M Hennes & Mauritz",
                style: r.style || "HM-KT-8841",
                merchandiser: r.merchandiser || "Tanvir Ahmed",
                status: r.status || "Draft",
                version: r.version || 1,
                poRows,
                items,
                attachments: Array.isArray(r.attachments) ? r.attachments : [],
                versions: Array.isArray(r.versions) && r.versions.length > 0 ? r.versions : [],
                auditHistory: Array.isArray(r.auditHistory) ? r.auditHistory : [],
              };
              if (normalized.versions.length === 0) {
                normalized.versions = [createVersionSnapshot(normalized)];
              }
              return normalized;
            });
          }
        }
      } catch (e) {}
    }
    // Initialize version snapshot for initial record
    const base = INITIAL_RECORDS.map((r) => {
      const snap = createVersionSnapshot(r);
      return { ...r, versions: [snap] };
    });
    return base;
  });

  // Save to localStorage whenever records change
  useEffect(() => {
    try {
      localStorage.setItem("cripton_pre_costings_master_v1", JSON.stringify(records));
    } catch (e) {}
  }, [records]);

  // View state: list | form | history | compare | report
  const [view, setView] = useState<"list" | "form" | "history" | "compare" | "report">(() => {
    if (initialTab === "create") return "form";
    if (initialTab === "compare") return "compare";
    if (initialTab === "report") return "report";
    return "list";
  });
  const [formMode, setFormMode] = useState<"create" | "edit" | "view">("create");

  // Selected record for view/edit/report
  const [activeRecord, setActiveRecord] = useState<PreCostingRecord | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBuyer, setFilterBuyer] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState<"ALL" | ApprovalStatus>("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Amendment Modal State
  const [amendModalOpen, setAmendModalOpen] = useState(false);
  const [targetAmendRecord, setTargetAmendRecord] = useState<PreCostingRecord | null>(null);
  const [amendmentReasonInput, setAmendmentReasonInput] = useState("");

  // Rejection Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [targetRejectRecord, setTargetRejectRecord] = useState<PreCostingRecord | null>(null);
  const [rejectionCommentsInput, setRejectionCommentsInput] = useState("");

  // Version Comparison State
  const [compareRecord, setCompareRecord] = useState<PreCostingRecord | null>(null);
  const [compareVersionA, setCompareVersionA] = useState<number>(1);
  const [compareVersionB, setCompareVersionB] = useState<number>(1);

  // Auto-initialize compareRecord if in compare view
  useEffect(() => {
    if (view === "compare" && !compareRecord && records.length > 0) {
      const target = records[0];
      setCompareRecord(target);
      const vers = target.versions || [];
      if (vers.length >= 2) {
        setCompareVersionA(vers[vers.length - 2].versionNumber);
        setCompareVersionB(vers[vers.length - 1].versionNumber);
      } else {
        setCompareVersionA(vers[0]?.versionNumber || 1);
        setCompareVersionB(vers[0]?.versionNumber || 1);
      }
    }
  }, [view, compareRecord, records]);

  // Synchronize view with initialTab changes
  useEffect(() => {
    if (initialTab === "create") {
      setView("form");
      setFormMode("create");
    } else if (initialTab === "compare") {
      setView("compare");
    } else if (initialTab === "report") {
      setView("report");
    } else if (initialTab === "register") {
      setView("list");
    }
  }, [initialTab]);

  // Master Data sources from MMRepository
  const [seasonsMaster] = useState<MMSeasonMasterItem[]>(() => MMRepository.getSeasons());
  const [fabricMasterItems] = useState<MMFabricMasterItem[]>(() => MMRepository.getFabricMaster());
  const [accessoriesMasterItems] = useState<MMAccessoriesMasterItem[]>(() => MMRepository.getAccessoriesMaster());
  const [suppliersMaster] = useState<any[]>(() => MMRepository.getSuppliers());

  // Helper to get currently logged-in user or default to first valid merchandiser
  const getLoggedInUserMerchant = (): string => {
    try {
      const raw = localStorage.getItem("cripton_current_user");
      if (raw) {
        const u = JSON.parse(raw);
        if (u.name) return u.name;
      }
    } catch {}
    return MM_MERCHANTS_MASTER[0]?.name || "Tanvir Ahmed";
  };

  // Attachment Modal & Lightbox Preview States
  const [showAttachmentModal, setShowAttachmentModal] = useState<boolean>(false);
  const [previewImageModal, setPreviewImageModal] = useState<string | null>(null);
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState<string>("");
  const [uploadNote, setUploadNote] = useState<string>("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const createNewFormData = (): PreCostingRecord => {
    const nextSl = records.length + 1;
    const defaultBuyer = MM_BUYERS_MASTER[0];
    const defaultStyle = defaultBuyer?.styles[0];
    const defaultSeason = seasonsMaster[0]?.seasonName || "Autumn / Winter 2026";
    const loggedInUser = getLoggedInUserMerchant();

    return {
      id: `pc-${Date.now()}`,
      preCostId: `JOB-2026-${String(nextSl).padStart(4, "0")}`,
      preCostNo: `${26920 + nextSl}`,
      preCostDate: new Date().toISOString().split("T")[0],
      contractNo: "",
      ourRef: "",
      acHolder: defaultBuyer?.accountHolder || "Md. Rashidul Islam",
      buyer: defaultBuyer?.name || "H&M Hennes & Mauritz",
      merchandiser: loggedInUser,
      style: defaultStyle?.styleNo || "HM-KT-8841",
      styleDescription: defaultStyle?.description || "Ladies Ribbed Henley Neck T-Shirt",
      season: defaultSeason,
      currency: "USD",
      smv: 4.25,
      cpm: 0.065,
      efficiencyPct: 65,
      note: "Initial style pre-costing estimation.",
      poRows: [
        { id: `po-new-${Date.now()}-1`, sl: 1, poNumber: `PO-${defaultStyle?.styleNo || "STYLE"}-001`, poQuantity: 20000, rate: 4.25, value: 85000, remarks: "Main Lot Delivery" },
      ],
      items: [
        {
          id: `item-new-${Date.now()}-1`,
          sl: 1,
          preCostItemId: "PCI-1-01",
          head: "Shell",
          item: fabricMasterItems[0]?.fabricDescription || "100% Combed Cotton 2x2 Rib Fabric 220 GSM",
          description: fabricMasterItems[0] ? `${fabricMasterItems[0].composition || ""}, ${fabricMasterItems[0].gsm || ""} GSM` : "100% Cotton combed",
          nStatus: "Nominated",
          supplier: suppliersMaster[0]?.name || DEFAULT_SUPPLIERS[0],
          effectedQty: 20000,
          consumption: 0.28,
          unit: "Kg",
          requiredQty: 5600,
          finalQty: 5880,
          rate: 4.20,
          amount: 24696,
          preCostPct: 100,
        },
      ],
      attachments: [],
      status: "Draft",
      version: 1,
      isCurrentActive: false,
      createdBy: `${loggedInUser} (Merchandiser)`,
      createdDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      versions: [],
      auditHistory: [],
    };
  };

  const handleTabClick = (tabKey: "register" | "create" | "compare") => {
    if (tabKey === "register") {
      setView("list");
      onTabChange?.("register");
    } else if (tabKey === "create") {
      setFormData(createNewFormData());
      setFormMode("create");
      setView("form");
      onTabChange?.("create");
    } else if (tabKey === "compare") {
      if (!compareRecord && records.length > 0) {
        setCompareRecord(records[0]);
      }
      setView("compare");
      onTabChange?.("compare");
    }
  };

  // ── Form State ─────────────────────────────────────────────────
  const [formData, setFormData] = useState<PreCostingRecord>(() => createNewFormData());

  // Calculate Consolidated Order Qty & Total PO Value
  const consolidatedOrderQty = useMemo(() => {
    return (formData.poRows || []).reduce((acc, row) => acc + (Number(row.poQuantity) || 0), 0);
  }, [formData.poRows]);

  const totalPoValue = useMemo(() => {
    return (formData.poRows || []).reduce((acc, row) => acc + (Number(row.value) || 0), 0);
  }, [formData.poRows]);

  const averagePoRate = useMemo(() => {
    return consolidatedOrderQty > 0 ? totalPoValue / consolidatedOrderQty : 0;
  }, [consolidatedOrderQty, totalPoValue]);

  // Calculate Total Cost & Surplus
  const totalCost = useMemo(() => {
    return (formData.items || []).reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  }, [formData.items]);

  const totalSurplus = useMemo(() => {
    return totalPoValue - totalCost;
  }, [totalPoValue, totalCost]);

  const surplusPerPcs = useMemo(() => {
    return consolidatedOrderQty > 0 ? totalSurplus / consolidatedOrderQty : 0;
  }, [consolidatedOrderQty, totalSurplus]);

  const smvCost = useMemo(() => {
    return formData.efficiencyPct > 0
      ? (formData.cpm * formData.smv) / (formData.efficiencyPct / 100)
      : 0;
  }, [formData.cpm, formData.smv, formData.efficiencyPct]);

  // ── Buyer & Account Holder & Style Dependencies ────────────────
  const handleBuyerChange = (newBuyerName: string) => {
    if (formMode === "view") return;
    const buyerObj = MM_BUYERS_MASTER.find((b) => b.name === newBuyerName);
    const newAcHolder = buyerObj?.accountHolder || "";
    const buyerStyles = buyerObj?.styles || [];
    const isStyleValid = buyerStyles.some((s) => s.styleNo === formData.style);

    setFormData((prev) => ({
      ...prev,
      buyer: newBuyerName,
      acHolder: newAcHolder,
      style: isStyleValid ? prev.style : "",
      styleDescription: isStyleValid ? prev.styleDescription : "",
    }));
  };

  const handleStyleChange = (newStyleNo: string) => {
    if (formMode === "view") return;
    const buyerObj = MM_BUYERS_MASTER.find((b) => b.name === formData.buyer);
    const styleObj = buyerObj?.styles.find((s) => s.styleNo === newStyleNo);
    setFormData((prev) => ({
      ...prev,
      style: newStyleNo,
      styleDescription: styleObj?.description || "",
    }));
  };

  // ── Purchase Order Row Handlers ────────────────────────────────
  const handleAddPoRow = () => {
    if (formMode === "view") return;
    const nextSl = (formData.poRows || []).length + 1;
    const newPo: MMPreCostPO = {
      id: `po-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sl: nextSl,
      poNumber: `PO-${formData.style || "STYLE"}-00${nextSl}`,
      poQuantity: 10000,
      rate: 4.15,
      value: 41500,
      remarks: "",
    };
    setFormData((prev) => ({
      ...prev,
      poRows: [...(prev.poRows || []), newPo],
    }));
  };

  const handleUpdatePoRow = (index: number, field: keyof MMPreCostPO, value: any) => {
    if (formMode === "view") return;
    setFormData((prev) => {
      const copy = [...prev.poRows];
      const target = { ...copy[index], [field]: value };
      if (field === "poQuantity" || field === "rate") {
        const qty = field === "poQuantity" ? Number(value) || 0 : Number(target.poQuantity) || 0;
        const rate = field === "rate" ? Number(value) || 0 : Number(target.rate) || 0;
        target.value = Number((qty * rate).toFixed(2));
      }
      copy[index] = target;
      return { ...prev, poRows: copy };
    });
  };

  const handleRemovePoRow = (index: number) => {
    if (formMode === "view") return;
    setFormData((prev) => {
      const filtered = prev.poRows.filter((_, i) => i !== index);
      const reindexed = filtered.map((p, i) => ({ ...p, sl: i + 1 }));
      return { ...prev, poRows: reindexed };
    });
  };

  // ── Item-Wise Pre Costing Detail Handlers ───────────────────────
  const handleAddItemRow = () => {
    if (formMode === "view") return;
    const nextSl = (formData.items || []).length + 1;
    const defaultEffQty = consolidatedOrderQty > 0 ? consolidatedOrderQty : 10000;
    const defaultCons = 0.25;
    const defaultReqQty = Number((defaultEffQty * defaultCons).toFixed(2));
    const defaultFinalQty = Number((defaultReqQty * 1.05).toFixed(2));
    const defaultRate = 4.2;
    const defaultAmt = Number((defaultFinalQty * defaultRate).toFixed(2));

    const newItem: PreCostingItemRow = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sl: nextSl,
      preCostItemId: `PCI-${formData.version}-${Math.floor(100 + Math.random() * 900)}`,
      head: "Shell",
      item: fabricMasterItems[0]?.fabricDescription || "100% Combed Cotton Knit Fabric",
      description: fabricMasterItems[0] ? `${fabricMasterItems[0].composition || ""}, ${fabricMasterItems[0].gsm || ""} GSM` : "Combed jersey fabric",
      nStatus: "Nominated",
      supplier: suppliersMaster[0]?.name || DEFAULT_SUPPLIERS[0],
      effectedQty: defaultEffQty,
      consumption: defaultCons,
      unit: "Kg",
      requiredQty: defaultReqQty,
      finalQty: defaultFinalQty,
      rate: defaultRate,
      amount: defaultAmt,
      preCostPct: 0,
    };

    setFormData((prev) => {
      const updatedItems = [...prev.items, newItem];
      const newTotalCost = updatedItems.reduce((s, it) => s + (Number(it.amount) || 0), 0);
      const recalculated = updatedItems.map((it) => ({
        ...it,
        preCostPct: newTotalCost > 0 ? Number((((Number(it.amount) || 0) / newTotalCost) * 100).toFixed(2)) : 0,
      }));
      return { ...prev, items: recalculated };
    });
  };

  // Head change handler with conditional item reset across fabric vs accessories boundaries
  const handleHeadChange = (index: number, newHead: string) => {
    if (formMode === "view") return;
    const currentItem = formData.items[index];
    const isOldFabric = FABRIC_HEADS.includes(currentItem?.head);
    const isNewFabric = FABRIC_HEADS.includes(newHead);

    setFormData((prev) => {
      const copy = [...prev.items];
      const target = { ...copy[index], head: newHead };

      // If category crossed (e.g. from fabric to accessories or vice versa), clear invalid item
      if (isOldFabric !== isNewFabric) {
        if (isNewFabric) {
          const firstFabric = fabricMasterItems[0];
          target.item = firstFabric ? (firstFabric.fabricDescription || firstFabric.fabricCode) : "";
          target.description = firstFabric ? `${firstFabric.composition || ""}, ${firstFabric.gsm || ""} GSM` : "";
          target.unit = firstFabric?.unit || "Kg";
        } else {
          const firstAcc = accessoriesMasterItems[0];
          target.item = firstAcc ? firstAcc.itemName : "";
          target.description = firstAcc ? `${firstAcc.category} - ${firstAcc.description}` : "";
          target.unit = firstAcc?.unit || "Pcs";
          if (firstAcc?.defaultRate) target.rate = firstAcc.defaultRate;
        }
        target.amount = Number(((target.finalQty || 0) * (target.rate || 0)).toFixed(2));
      }

      copy[index] = target;
      return { ...prev, items: copy };
    });
  };

  // Item selection handler
  const handleItemSelect = (index: number, selectedItemName: string) => {
    if (formMode === "view") return;
    setFormData((prev) => {
      const copy = [...prev.items];
      const target = { ...copy[index], item: selectedItemName };
      const isFabric = FABRIC_HEADS.includes(target.head);

      if (isFabric) {
        const found = fabricMasterItems.find((f) => (f.fabricDescription || f.fabricCode) === selectedItemName);
        if (found) {
          target.description = `${found.composition || ""}${found.gsm ? `, ${found.gsm} GSM` : ""}`;
          target.unit = found.unit || target.unit || "Kg";
        }
      } else {
        const found = accessoriesMasterItems.find((a) => a.itemName === selectedItemName);
        if (found) {
          target.description = `${found.category} - ${found.description}`;
          target.unit = found.unit || target.unit || "Pcs";
          if (found.defaultRate) {
            target.rate = found.defaultRate;
            target.amount = Number(((target.finalQty || 0) * found.defaultRate).toFixed(2));
          }
        }
      }

      copy[index] = target;
      return { ...prev, items: copy };
    });
  };

  const handleUpdateItemRow = (index: number, field: keyof PreCostingItemRow, value: any) => {
    if (formMode === "view") return;
    setFormData((prev) => {
      const copy = [...prev.items];
      const target = { ...copy[index], [field]: value };

      // Auto-recalculate Required Qty, Final Qty, and Amount
      if (
        field === "effectedQty" ||
        field === "consumption" ||
        field === "requiredQty" ||
        field === "finalQty" ||
        field === "rate"
      ) {
        const effQty = field === "effectedQty" ? Number(value) || 0 : Number(target.effectedQty) || 0;
        const cons = field === "consumption" ? Number(value) || 0 : Number(target.consumption) || 0;

        if (field === "effectedQty" || field === "consumption") {
          target.requiredQty = Number((effQty * cons).toFixed(2));
          target.finalQty = Number((target.requiredQty * 1.05).toFixed(2));
        }

        const finQty = field === "finalQty" ? Number(value) || 0 : Number(target.finalQty) || 0;
        const rt = field === "rate" ? Number(value) || 0 : Number(target.rate) || 0;
        target.amount = Number((finQty * rt).toFixed(2));
      }

      copy[index] = target;

      // Recalculate Pre Costing % across all items
      const newTotalCost = copy.reduce((s, it) => s + (Number(it.amount) || 0), 0);
      const itemsWithPct = copy.map((it) => ({
        ...it,
        preCostPct: newTotalCost > 0 ? Number((((Number(it.amount) || 0) / newTotalCost) * 100).toFixed(2)) : 0,
      }));

      return { ...prev, items: itemsWithPct };
    });
  };

  const handleRemoveItemRow = (index: number) => {
    if (formMode === "view") return;
    setFormData((prev) => {
      const filtered = prev.items.filter((_, i) => i !== index);
      const reindexed = filtered.map((it, i) => ({ ...it, sl: i + 1 }));
      const newTotalCost = reindexed.reduce((s, it) => s + (Number(it.amount) || 0), 0);
      const itemsWithPct = reindexed.map((it) => ({
        ...it,
        preCostPct: newTotalCost > 0 ? Number((((Number(it.amount) || 0) / newTotalCost) * 100).toFixed(2)) : 0,
      }));
      return { ...prev, items: itemsWithPct };
    });
  };

  // ── Attachment Handlers (Reusing PI Entry Form Pattern) ────────
  const currentRecordAttachments: MMPreCostAttachmentRecord[] = useMemo(() => {
    return formData.attachments || [];
  }, [formData.attachments]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate maximum file size: 3 MB
    const MAX_SIZE = 3 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError(`File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds maximum allowed limit of 3 MB.`);
      setSelectedUploadFile(null);
      e.target.value = "";
      return;
    }

    setSelectedUploadFile(file);
    if (!uploadTitle.trim()) {
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
      setUploadTitle(nameWithoutExt);
    }
  };

  const handleUploadAttachment = () => {
    setUploadError(null);
    if (!selectedUploadFile) {
      setUploadError("Please select a file to upload.");
      return;
    }
    if (!uploadTitle.trim()) {
      setUploadError("Attachment Title is required.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const isImg = selectedUploadFile.type.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg)$/i.test(selectedUploadFile.name);
      const newRecord: MMPreCostAttachmentRecord = {
        id: `att-pc-${Date.now()}`,
        preCostId: formData.preCostId || "JOB-2026-0001",
        version: formData.version || 1,
        fileName: selectedUploadFile.name,
        title: uploadTitle.trim(),
        note: uploadNote.trim(),
        fileSize:
          selectedUploadFile.size < 1024 * 1024
            ? `${(selectedUploadFile.size / 1024).toFixed(1)} KB`
            : `${(selectedUploadFile.size / (1024 * 1024)).toFixed(2)} MB`,
        fileSizeBytes: selectedUploadFile.size,
        uploadedBy: formData.merchandiser || getLoggedInUserMerchant(),
        uploadTime: new Date().toISOString().replace("T", " ").substring(0, 16),
        storageType: isImg ? "image" : "file",
        dataUrl: dataUrl,
      };

      setFormData((prev) => {
        const nextAtts = [newRecord, ...(prev.attachments || [])];
        MMRepository.savePreCostingAttachments(nextAtts);
        return { ...prev, attachments: nextAtts };
      });

      setSelectedUploadFile(null);
      setUploadTitle("");
      setUploadNote("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success(`Attachment "${newRecord.title}" uploaded successfully.`);
    };

    reader.onerror = () => {
      setUploadError("Failed to read file for upload.");
    };

    reader.readAsDataURL(selectedUploadFile);
  };

  const handleDeleteAttachment = (id: string) => {
    if (formMode === "view") return;
    setFormData((prev) => {
      const nextAtts = (prev.attachments || []).filter((a) => a.id !== id);
      MMRepository.savePreCostingAttachments(nextAtts);
      return { ...prev, attachments: nextAtts };
    });
    toast.success("Attachment removed.");
  };

  const handleDownloadAttachment = (att: MMPreCostAttachmentRecord) => {
    try {
      if (!att) {
        toast.error("Attachment record not found.");
        return;
      }
      const link = document.createElement("a");
      let objectUrlToRevoke: string | null = null;
      if (att.dataUrl && (att.dataUrl.startsWith("data:") || att.dataUrl.startsWith("blob:"))) {
        link.href = att.dataUrl;
      } else {
        const textContent = `Pre Costing Attachment\nFilename: ${att.fileName}\nTitle: ${att.title}\nJob ID: ${att.preCostId}\nUploaded By: ${att.uploadedBy}\nUpload Time: ${att.uploadTime}\nFile Size: ${att.fileSize}\nNote: ${att.note || "N/A"}`;
        const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
        objectUrlToRevoke = URL.createObjectURL(blob);
        link.href = objectUrlToRevoke;
      }
      link.download = att.fileName || `${att.title.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (objectUrlToRevoke) {
        setTimeout(() => URL.revokeObjectURL(objectUrlToRevoke!), 1000);
      }
      toast.success(`Downloading ${att.fileName || att.title}`);
    } catch (e) {
      console.error("Download failed:", e);
      toast.error("Failed to download file.");
    }
  };

  // Direct image file picker handler for Section 5
  const handleImageFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formMode === "view") return;
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const MAX_SIZE = 3 * 1024 * 1024;
    const fileList = Array.from(files);

    fileList.forEach((file) => {
      if (file.size > MAX_SIZE) {
        toast.error(`Image "${file.name}" exceeds 3 MB limit and was skipped.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
        const newRecord: MMPreCostAttachmentRecord = {
          id: `att-img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          preCostId: formData.preCostId || "JOB-2026-0001",
          version: formData.version || 1,
          fileName: file.name,
          title: nameWithoutExt,
          note: "Style Pre Costing Image",
          fileSize:
            file.size < 1024 * 1024
              ? `${(file.size / 1024).toFixed(1)} KB`
              : `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          fileSizeBytes: file.size,
          uploadedBy: formData.merchandiser || getLoggedInUserMerchant(),
          uploadTime: new Date().toISOString().replace("T", " ").substring(0, 16),
          storageType: "image",
          dataUrl: dataUrl,
        };

        setFormData((prev) => {
          const nextAtts = [newRecord, ...(prev.attachments || [])];
          MMRepository.savePreCostingAttachments(nextAtts);
          return { ...prev, attachments: nextAtts };
        });
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
    toast.success("Image(s) attached successfully.");
  };

  // ── Validation Rules ───────────────────────────────────────────
  const validateForm = (): boolean => {
    if (!formData.style?.trim()) {
      toast.error("Style Number is required.");
      return false;
    }
    if (!formData.buyer?.trim()) {
      toast.error("Buyer selection is required.");
      return false;
    }
    if (!formData.poRows || formData.poRows.length === 0) {
      toast.error("At least one Purchase Order (PO) row is required.");
      return false;
    }

    // Check for duplicate PO Numbers
    const poNumbers = new Set<string>();
    for (const po of formData.poRows) {
      const cleanNo = (po.poNumber || "").trim().toLowerCase();
      if (!cleanNo) {
        toast.error("All Purchase Order rows must have a valid PO Number.");
        return false;
      }
      if (poNumbers.has(cleanNo)) {
        toast.error(`Duplicate PO Number detected: "${po.poNumber}". PO numbers must be unique within this record.`);
        return false;
      }
      poNumbers.add(cleanNo);

      if ((Number(po.poQuantity) || 0) <= 0) {
        toast.error(`PO Quantity for ${po.poNumber} must be greater than 0.`);
        return false;
      }
      if ((Number(po.rate) || 0) <= 0) {
        toast.error(`PO Rate for ${po.poNumber} must be greater than 0.`);
        return false;
      }
    }

    if (!formData.items || formData.items.length === 0) {
      toast.error("At least one item-wise costing row is required.");
      return false;
    }

    for (const it of formData.items) {
      if (!it.item?.trim()) {
        toast.error(`Costing Item Name in row #${it.sl} is required.`);
        return false;
      }
      if ((Number(it.finalQty) || 0) <= 0) {
        toast.error(`Final Quantity for item in row #${it.sl} must be greater than 0.`);
        return false;
      }
      if ((Number(it.rate) || 0) < 0) {
        toast.error(`Rate for item in row #${it.sl} cannot be negative.`);
        return false;
      }

      // Mandatory validation: Effected Qty <= Total Order QTY
      if (consolidatedOrderQty > 0 && (Number(it.effectedQty) || 0) > consolidatedOrderQty) {
        toast.error(
          `Effected Qty (${Number(it.effectedQty).toLocaleString()}) in row #${it.sl} exceeds Total Order QTY (${consolidatedOrderQty.toLocaleString()}). Effected Qty must be ≤ Total Order QTY.`
        );
        return false;
      }
    }

    return true;
  };

  // ── Action Handlers ────────────────────────────────────────────
  // 1. Save as Draft
  const handleSaveDraft = () => {
    if (!formData.style?.trim() || !formData.buyer?.trim()) {
      toast.error("Style and Buyer are required to save a draft.");
      return;
    }

    // Effected Qty check in Draft save
    const invalidRow = (formData.items || []).find(
      (it) => consolidatedOrderQty > 0 && (Number(it.effectedQty) || 0) > consolidatedOrderQty
    );
    if (invalidRow) {
      toast.error(
        `Effected Qty (${Number(invalidRow.effectedQty).toLocaleString()}) in row #${invalidRow.sl} exceeds Total Order QTY (${consolidatedOrderQty.toLocaleString()}). Effected Qty must be ≤ Total Order QTY.`
      );
      return;
    }

    const currentSnapshot = createVersionSnapshot({
      ...formData,
      status: "Draft",
    });

    const updatedRecord: PreCostingRecord = {
      ...formData,
      status: "Draft",
      isCurrentActive: false,
      versions: [
        ...(formData.versions || []).filter((v) => v.versionNumber !== formData.version),
        currentSnapshot,
      ],
      auditHistory: [
        ...(formData.auditHistory || []),
        {
          versionNumber: formData.version,
          createdBy: formData.createdBy,
          createdDate: new Date().toISOString().replace("T", " ").substring(0, 16),
          status: "Draft",
        },
      ],
    };

    setRecords((prev) => {
      const idx = prev.findIndex((r) => r.id === updatedRecord.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updatedRecord;
        return copy;
      }
      return [updatedRecord, ...prev];
    });

    toast.success(`Pre Costing ${updatedRecord.preCostId} saved as Draft.`);
    setView("list");
  };

  // 2. Submit for Approval
  const handleSubmitForApproval = () => {
    if (!validateForm()) return;

    const currentSnapshot = createVersionSnapshot({
      ...formData,
      status: "Pending Approval",
      submittedBy: "Tanvir Ahmed (Merchandiser)",
      submittedDate: new Date().toISOString().replace("T", " ").substring(0, 16),
    });

    const updatedRecord: PreCostingRecord = {
      ...formData,
      status: "Pending Approval",
      isCurrentActive: false,
      submittedBy: "Tanvir Ahmed (Merchandiser)",
      submittedDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      versions: [
        ...(formData.versions || []).filter((v) => v.versionNumber !== formData.version),
        currentSnapshot,
      ],
      auditHistory: [
        ...(formData.auditHistory || []),
        {
          versionNumber: formData.version,
          createdBy: formData.createdBy,
          createdDate: formData.createdDate,
          submittedBy: "Tanvir Ahmed (Merchandiser)",
          submittedDate: new Date().toISOString().replace("T", " ").substring(0, 16),
          status: "Pending Approval",
        },
      ],
    };

    setRecords((prev) => {
      const idx = prev.findIndex((r) => r.id === updatedRecord.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updatedRecord;
        return copy;
      }
      return [updatedRecord, ...prev];
    });

    toast.success(`Pre Costing ${updatedRecord.preCostId} v${updatedRecord.version} submitted for approval.`);
    setView("list");
  };

  // 3. Approve Record
  const handleApproveRecord = (rec: PreCostingRecord, comments = "Approved without variance.") => {
    const approvalTimestamp = new Date().toISOString().replace("T", " ").substring(0, 16);
    const approverName = "Rashidul Islam (Head of Merchandising)";

    const approvedRecord: PreCostingRecord = {
      ...rec,
      status: "Approved",
      isCurrentActive: true,
      approvedBy: approverName,
      approvalDate: approvalTimestamp,
      decisionComments: comments,
    };

    const snapshot = createVersionSnapshot(approvedRecord);

    const updatedRecord: PreCostingRecord = {
      ...approvedRecord,
      versions: [
        ...(rec.versions || []).filter((v) => v.versionNumber !== rec.version),
        snapshot,
      ],
      auditHistory: [
        ...(rec.auditHistory || []),
        {
          versionNumber: rec.version,
          createdBy: rec.createdBy,
          createdDate: rec.createdDate,
          submittedBy: rec.submittedBy,
          submittedDate: rec.submittedDate,
          approvedBy: approverName,
          approvalDate: approvalTimestamp,
          decisionComments: comments,
          status: "Approved",
        },
      ],
    };

    setRecords((prev) => prev.map((r) => (r.id === updatedRecord.id ? updatedRecord : r)));
    toast.success(`Pre Costing ${rec.preCostId} v${rec.version} approved successfully.`);
  };

  // 4. Reject Record
  const handleRejectRecord = () => {
    if (!targetRejectRecord) return;
    if (!rejectionCommentsInput.trim()) {
      toast.error("Please enter a rejection reason or comments.");
      return;
    }

    const rejectionTimestamp = new Date().toISOString().replace("T", " ").substring(0, 16);
    const rejectorName = "Rashidul Islam (Head of Merchandising)";

    const rejectedRecord: PreCostingRecord = {
      ...targetRejectRecord,
      status: "Rejected",
      isCurrentActive: false,
      rejectedBy: rejectorName,
      rejectionDate: rejectionTimestamp,
      decisionComments: rejectionCommentsInput.trim(),
    };

    const snapshot = createVersionSnapshot(rejectedRecord);

    const updatedRecord: PreCostingRecord = {
      ...rejectedRecord,
      versions: [
        ...(targetRejectRecord.versions || []).filter((v) => v.versionNumber !== targetRejectRecord.version),
        snapshot,
      ],
      auditHistory: [
        ...(targetRejectRecord.auditHistory || []),
        {
          versionNumber: targetRejectRecord.version,
          createdBy: targetRejectRecord.createdBy,
          createdDate: targetRejectRecord.createdDate,
          submittedBy: targetRejectRecord.submittedBy,
          submittedDate: targetRejectRecord.submittedDate,
          rejectedBy: rejectorName,
          rejectionDate: rejectionTimestamp,
          decisionComments: rejectionCommentsInput.trim(),
          status: "Rejected",
        },
      ],
    };

    setRecords((prev) => prev.map((r) => (r.id === updatedRecord.id ? updatedRecord : r)));
    setRejectModalOpen(false);
    setTargetRejectRecord(null);
    setRejectionCommentsInput("");
    toast.error(`Pre Costing ${targetRejectRecord.preCostId} v${targetRejectRecord.version} was rejected.`);
  };

  // 5. Initiate Amendment (creates new version, keeps previous approved version unchanged)
  const handleInitiateAmendment = (rec: PreCostingRecord) => {
    setTargetAmendRecord(rec);
    setAmendmentReasonInput("");
    setAmendModalOpen(true);
  };

  const handleConfirmAmendment = () => {
    if (!targetAmendRecord) return;
    if (!amendmentReasonInput.trim()) {
      toast.error("Mandatory Amendment Reason is required before creating a revision.");
      return;
    }

    const newVersionNumber = targetAmendRecord.version + 1;
    const nowTimestamp = new Date().toISOString().replace("T", " ").substring(0, 16);

    // Deep copy previous version's data into the new amendment
    const amendedRecord: PreCostingRecord = {
      ...targetAmendRecord,
      id: `pc-${Date.now()}`,
      version: newVersionNumber,
      status: "Draft", // New amendment starts as Draft
      isCurrentActive: false, // Previous version remains active until approved!
      amendmentReason: amendmentReasonInput.trim(),
      createdBy: "Tanvir Ahmed (Merchandiser)",
      createdDate: nowTimestamp,
      submittedBy: undefined,
      submittedDate: undefined,
      approvedBy: undefined,
      approvalDate: undefined,
      rejectedBy: undefined,
      rejectionDate: undefined,
      decisionComments: undefined,
      // Deep clone child PO rows & Items
      poRows: targetAmendRecord.poRows.map((p) => ({ ...p, id: `po-${Date.now()}-${p.sl}` })),
      items: targetAmendRecord.items.map((it) => ({
        ...it,
        id: `item-${Date.now()}-${it.sl}`,
        preCostItemId: `PCI-${newVersionNumber}-${it.sl}`,
      })),
      attachments: (targetAmendRecord.attachments || []).map((a) => ({ ...a, version: newVersionNumber })),
      versions: [...targetAmendRecord.versions],
      auditHistory: [
        ...targetAmendRecord.auditHistory,
        {
          versionNumber: newVersionNumber,
          previousVersionNumber: targetAmendRecord.version,
          amendmentReason: amendmentReasonInput.trim(),
          createdBy: "Tanvir Ahmed (Merchandiser)",
          createdDate: nowTimestamp,
          status: "Draft",
        },
      ],
    };

    // Save initial snapshot of this new amendment version
    const newSnapshot = createVersionSnapshot(amendedRecord);
    amendedRecord.versions.push(newSnapshot);

    setRecords((prev) => [amendedRecord, ...prev]);
    setAmendModalOpen(false);
    setTargetAmendRecord(null);
    setAmendmentReasonInput("");

    // Open newly created amendment in edit mode
    setFormData(amendedRecord);
    setFormMode("edit");
    setView("form");
    toast.success(`Amendment Version v${newVersionNumber} initiated! Modify fields and submit for approval.`);
  };

  // Open Edit for Draft
  const handleOpenEdit = (rec: PreCostingRecord) => {
    const atts = rec.attachments || MMRepository.getPreCostingAttachments().filter((a) => a.preCostId === rec.preCostId);
    setFormData({ ...rec, attachments: atts });
    setFormMode("edit");
    setView("form");
  };

  // Open Read-Only View
  const handleOpenView = (rec: PreCostingRecord) => {
    const atts = rec.attachments || MMRepository.getPreCostingAttachments().filter((a) => a.preCostId === rec.preCostId);
    setFormData({ ...rec, attachments: atts });
    setFormMode("view");
    setView("form");
  };

  // Open Report View
  const handleOpenReport = (rec: PreCostingRecord) => {
    setActiveRecord(rec);
    setView("report");
  };

  // Open Version History
  const handleOpenHistory = (rec: PreCostingRecord) => {
    setCompareRecord(rec);
    const availableVersions = rec.versions || [];
    if (availableVersions.length > 0) {
      setCompareVersionA(availableVersions[availableVersions.length - 1]?.versionNumber || 1);
      setCompareVersionB(availableVersions[0]?.versionNumber || 1);
    }
    setView("history");
  };

  // Open Comparison
  const handleOpenComparison = (rec: PreCostingRecord, vA?: number, vB?: number) => {
    setCompareRecord(rec);
    const vers = rec.versions || [];
    if (vers.length >= 2) {
      setCompareVersionA(vA ?? vers[vers.length - 1].versionNumber);
      setCompareVersionB(vB ?? vers[vers.length - 2].versionNumber);
    } else {
      setCompareVersionA(vers[0]?.versionNumber || 1);
      setCompareVersionB(vers[0]?.versionNumber || 1);
    }
    setView("compare");
  };

  // ── Filter Records for Register ────────────────────────────────
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (r.preCostId || "").toLowerCase().includes(q) ||
        (r.preCostNo || "").toLowerCase().includes(q) ||
        (r.style || "").toLowerCase().includes(q) ||
        (r.buyer || "").toLowerCase().includes(q) ||
        Boolean(r.contractNo && r.contractNo.toLowerCase().includes(q)) ||
        (r.poRows || []).some((p) => (p?.poNumber || "").toLowerCase().includes(q));

      const matchBuyer = filterBuyer === "ALL" || r.buyer === filterBuyer;
      const matchStatus = filterStatus === "ALL" || r.status === filterStatus;

      const matchFrom = !fromDate || r.preCostDate >= fromDate;
      const matchTo = !toDate || r.preCostDate <= toDate;

      return matchSearch && matchBuyer && matchStatus && matchFrom && matchTo;
    });
  }, [records, searchQuery, filterBuyer, filterStatus, fromDate, toDate]);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-200">
      {/* ── Top Master Menu Navigation Strip ───────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 px-4 md:px-6 py-2.5">
        <div className="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => handleTabClick("register")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                view === "list"
                  ? "bg-teal-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <FileText className="size-3.5" />
              <span>Pre Costing Register</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  view === "list"
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                {records.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabClick("create")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                view === "form" && formMode === "create"
                  ? "bg-teal-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Plus className="size-3.5" />
              <span>Pre Costing Entry</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabClick("compare")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                view === "compare"
                  ? "bg-teal-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <GitBranch className="size-3.5" />
              <span>Amendment & Comparison</span>
            </button>

            <a
              href="/mm-fabric-consumption-cad"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <Scissors className="size-3.5 text-teal-600" />
              <span>Fabric Consumption (CAD)</span>
            </a>

            <a
              href="/mm-fabric-consumption-register"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="size-3.5 text-indigo-600" />
              <span>Fabric Consumption Register</span>
            </a>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Style Pre Costing Engine Active</span>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          VIEW 1: PRE COSTING REGISTER
         ════════════════════════════════════════════════════════════ */}
      {view === "list" && (
        <div className="p-4 md:p-6 space-y-5 max-w-[1700px] mx-auto">
          {/* Top Header Card */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-100 dark:border-indigo-900">
                  <FileText className="size-5" />
                </div>
                <div>
                  <h1 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    Style Pre Costing Register
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-400">
                      {records.length} records
                    </span>
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Multi-PO management, 17-column item-wise costing sheets, immutable approval workflow & version amendments.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setFormData(createNewFormData());
                    setFormMode("create");
                    setView("form");
                  }}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-xs cursor-pointer transition"
                >
                  <Plus className="size-3.5" /> New Style Pre Costing
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                {/* Search */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1">
                    Quick Search
                  </label>
                  <div className="relative">
                    <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Job ID, Style, PO..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Buyer Filter */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1">
                    Buyer
                  </label>
                  <select
                    value={filterBuyer}
                    onChange={(e) => setFilterBuyer(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:border-indigo-500"
                  >
                    <option value="ALL">All Buyers ({MM_BUYERS_MASTER.length})</option>
                    {MM_BUYERS_MASTER.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1">
                    Workflow Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:border-indigo-500"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="Draft">Draft</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {/* From Date */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
                  />
                </div>

                {/* To Date */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Pre Costing Register Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-black text-slate-500 tracking-wider">
                    <tr>
                      <th className="py-3 px-3.5">Job ID</th>
                      <th className="py-3 px-3 text-center">Version</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3.5">Buyer</th>
                      <th className="py-3 px-3.5">Style No.</th>
                      <th className="py-3 px-3 text-right">Consolidated Qty</th>
                      <th className="py-3 px-3 text-right">Pre Costing Value</th>
                      <th className="py-3 px-3 text-right">Total Cost</th>
                      <th className="py-3 px-3 text-right">Surplus ($)</th>
                      <th className="py-3 px-3.5 text-center">Status</th>
                      <th className="py-3 px-3 text-right sticky right-0 bg-slate-50 dark:bg-slate-800">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="py-12 text-center text-slate-500">
                          <p className="font-bold text-sm">No Style Pre Costing records found</p>
                          <p className="text-xs text-slate-400 mt-1">
                            Adjust your filters or create a new style pre-costing.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((r) => {
                        const orderQty = (r.poRows || []).reduce((s, p) => s + (Number(p?.poQuantity) || 0), 0);
                        const poVal = (r.poRows || [])?.reduce((s, p) => s + (Number(p?.value) || 0), 0);
                        const cost = (r.items || []).reduce((s, it) => s + (Number(it?.amount) || 0), 0);
                        const surplus = poVal - cost;

                        return (
                          <tr
                            key={r.id}
                            className="hover:bg-indigo-50/30 dark:hover:bg-slate-800/40 transition-colors"
                          >
                            <td className="py-3 px-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                              <button
                                onClick={() => handleOpenView(r)}
                                className="hover:underline cursor-pointer text-left font-bold"
                              >
                                {r.preCostId}
                              </button>
                              <span className="block text-[10px] text-slate-400 font-mono">
                                #{r.preCostNo}
                              </span>
                            </td>

                            <td className="py-3 px-3 text-center">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                v{r.version}
                              </span>
                              {r.isCurrentActive && (
                                <span className="block text-[8px] font-extrabold text-emerald-600 uppercase mt-0.5">
                                  ● Active
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                              {r.preCostDate}
                            </td>

                            <td className="py-3 px-3.5 font-bold text-slate-900 dark:text-white">
                              {r.buyer}
                            </td>

                            <td className="py-3 px-3.5">
                              <span className="font-bold block text-slate-900 dark:text-white">
                                {r.style}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {r.contractNo || "No Contract"}
                              </span>
                            </td>

                            <td className="py-3 px-3 text-right font-mono font-bold">
                              {orderQty.toLocaleString()} pcs
                            </td>

                            <td className="py-3 px-3 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                              ${poVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>

                            <td className="py-3 px-3 text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                              ${cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>

                            <td className="py-3 px-3 text-right font-mono font-bold">
                              <span
                                className={
                                  surplus >= 0
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-rose-600 dark:text-rose-400"
                                }
                              >
                                ${surplus.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </span>
                            </td>

                            <td className="py-3 px-3.5 text-center">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                  r.status === "Approved"
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                    : r.status === "Pending Approval"
                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                    : r.status === "Rejected"
                                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                                    : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20"
                                }`}
                              >
                                {r.status === "Approved" && <Check className="size-3" />}
                                {r.status === "Pending Approval" && <Clock className="size-3" />}
                                {r.status === "Rejected" && <X className="size-3" />}
                                {r.status}
                              </span>
                            </td>

                            <td className="py-3 px-3 text-right sticky right-0 bg-slate-50/90 dark:bg-slate-900/90 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                              <div className="flex items-center justify-end gap-1">
                                {/* View */}
                                <button
                                  onClick={() => handleOpenView(r)}
                                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                                  title="View Pre Costing Details"
                                >
                                  <Eye className="size-3.5" />
                                </button>

                                {/* Report Print */}
                                <button
                                  onClick={() => handleOpenReport(r)}
                                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                                  title="Pre Costing Report Print/Preview"
                                >
                                  <Printer className="size-3.5 text-indigo-500" />
                                </button>

                                {/* Edit (Draft) */}
                                {r.status === "Draft" && (
                                  <button
                                    onClick={() => handleOpenEdit(r)}
                                    className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-[11px] font-bold border border-amber-200 cursor-pointer"
                                    title="Edit Draft"
                                  >
                                    Edit
                                  </button>
                                )}

                                {/* Submit (Draft) */}
                                {r.status === "Draft" && (
                                  <button
                                    onClick={() => {
                                      setFormData(r);
                                      handleSubmitForApproval();
                                    }}
                                    className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold border border-indigo-200 cursor-pointer flex items-center gap-1"
                                    title="Submit for Approval"
                                  >
                                    <Send className="size-3" /> Submit
                                  </button>
                                )}

                                {/* Approve / Reject (Pending Approval) */}
                                {r.status === "Pending Approval" && (
                                  <>
                                    <button
                                      onClick={() => handleApproveRecord(r)}
                                      className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold border border-emerald-300 cursor-pointer"
                                      title="Approve Pre Costing"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => {
                                        setTargetRejectRecord(r);
                                        setRejectionCommentsInput("");
                                        setRejectModalOpen(true);
                                      }}
                                      className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold border border-rose-300 cursor-pointer"
                                      title="Reject Pre Costing"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}

                                {/* Amend (Approved) */}
                                {r.status === "Approved" && (
                                  <button
                                    onClick={() => handleInitiateAmendment(r)}
                                    className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-[11px] font-bold border border-amber-300 cursor-pointer flex items-center gap-1"
                                    title="Amend / Create Revision Version"
                                  >
                                    <GitBranch className="size-3" /> Amend
                                  </button>
                                )}

                                {/* History / Compare */}
                                <button
                                  onClick={() => handleOpenHistory(r)}
                                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                                  title="Version History & Comparison"
                                >
                                  <History className="size-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            VIEW 2: FORM (CREATE / EDIT / READ-ONLY VIEW)
           ════════════════════════════════════════════════════════════ */}
        {view === "form" && (
          <div className="p-4 md:p-6 space-y-6 max-w-[1700px] mx-auto">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                  title="Back to Register"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">
                      Marketing & Merchandising / Style Pre Costing
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                      v{formData.version} — {formData.status}
                    </span>
                  </div>
                  <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                    {formMode === "create"
                      ? "New Style Pre Costing"
                      : formMode === "edit"
                      ? `Edit Pre Costing — ${formData.preCostId} (v${formData.version})`
                      : `Pre Costing Details — ${formData.preCostId} (v${formData.version})`}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold hover:bg-slate-100 cursor-pointer"
                >
                  {formMode === "view" ? "Back to Register" : "Cancel"}
                </button>

                {formMode !== "view" && (
                  <>
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="size-3.5" /> Save as Draft
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitForApproval}
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <Send className="size-3.5" /> Submit for Approval
                    </button>
                  </>
                )}

                {formMode === "view" && (
                  <button
                    type="button"
                    onClick={() => handleOpenReport(formData)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <Printer className="size-3.5" /> Print Pre Costing Report
                  </button>
                )}
              </div>
            </div>

            {/* SECTION 1: Pre Costing Identification & Order Basis */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="w-1.5 h-4 bg-indigo-600 rounded-full inline-block" />
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  1. Pre Costing Identification & Order Basis
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3.5 text-xs">
                {/* 1. Job ID (Read-only) */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Job ID (Read-only)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.preCostId}
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 font-mono font-bold text-slate-600 dark:text-slate-400"
                  />
                </div>

                {/* 2. Pre Costing No. (Read-only / Non-editable) */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Pre Costing No. <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.preCostNo}
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 font-mono font-bold text-slate-600 dark:text-slate-400"
                  />
                </div>

                {/* Pre Costing Date */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Pre Costing Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    disabled={formMode === "view"}
                    value={formData.preCostDate}
                    onChange={(e) => setFormData({ ...formData, preCostDate: e.target.value })}
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                {/* 5. A/C Holder (Read-only, auto-populated from Buyer) */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    A/C Holder (Read-only)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.acHolder}
                    placeholder="Auto-linked to Buyer"
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 font-semibold text-slate-600 dark:text-slate-400"
                  />
                </div>

                {/* 6. Buyer */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Buyer <span className="text-rose-500">*</span>
                  </label>
                  <select
                    disabled={formMode === "view"}
                    value={formData.buyer}
                    onChange={(e) => handleBuyerChange(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  >
                    {MM_BUYERS_MASTER.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 7. Merchandiser (Required dropdown, defaults to logged-in user) */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Merchandiser <span className="text-rose-500">*</span>
                  </label>
                  <select
                    disabled={formMode === "view"}
                    value={formData.merchandiser}
                    onChange={(e) => setFormData({ ...formData, merchandiser: e.target.value })}
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                  >
                    {MM_MERCHANTS_MASTER.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} ({m.designation})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 8. Style No. (Searchable dropdown, filtered by selected Buyer) */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Style No. <span className="text-rose-500">*</span>
                  </label>
                  {(() => {
                    const currentBuyerObj = MM_BUYERS_MASTER.find((b) => b.name === formData.buyer);
                    const buyerStyles = currentBuyerObj?.styles || [];
                    const styleOptions = buyerStyles.map((s) => ({
                      value: s.styleNo,
                      label: `${s.styleNo} — ${s.description}`,
                    }));
                    return (
                      <SearchableSelect
                        options={styleOptions}
                        value={formData.style}
                        onChange={handleStyleChange}
                        placeholder={buyerStyles.length > 0 ? "Select Style..." : "No styles for buyer"}
                        disabled={formMode === "view"}
                      />
                    );
                  })()}
                </div>

                {/* 9. Season (Searchable dropdown from Season master) */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Season <span className="text-rose-500">*</span>
                  </label>
                  {(() => {
                    const seasonOptions = seasonsMaster.map((s) => ({
                      value: s.seasonName,
                      label: s.seasonName,
                    }));
                    return (
                      <SearchableSelect
                        options={seasonOptions}
                        value={formData.season}
                        onChange={(val) => setFormData({ ...formData, season: val })}
                        placeholder="Select Season..."
                        disabled={formMode === "view"}
                      />
                    );
                  })()}
                </div>

                {/* 10. Total Order QTY (Read-only calculated summary from Section 2 PO rows) */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Total Order QTY (Read-only)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${consolidatedOrderQty.toLocaleString()} pcs`}
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 font-mono font-bold text-indigo-600 dark:text-indigo-400 text-right"
                  />
                </div>

                {/* 11. Total Order Value (Read-only calculated summary from Section 2 PO rows) */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Total Order Value (Read-only)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`$${totalPoValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 font-mono font-bold text-indigo-600 dark:text-indigo-400 text-right"
                  />
                </div>

                {/* SMV */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    SMV (Standard Minute Value)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    disabled={formMode === "view"}
                    value={formData.smv}
                    onChange={(e) => setFormData({ ...formData, smv: Number(e.target.value) || 0 })}
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono font-bold"
                  />
                </div>

                {/* Note / Remarks */}
                <div className="sm:col-span-2 md:col-span-4 lg:col-span-6">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Note / Instructions
                  </label>
                  <input
                    type="text"
                    disabled={formMode === "view"}
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="Optional costing remarks, wash instructions, or buyer nominations..."
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: Purchase Order Details (Without hardcoded Style Number) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-indigo-600 rounded-full inline-block" />
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    2. Purchase Order Details
                  </h2>
                </div>
                {formMode !== "view" && (
                  <button
                    type="button"
                    onClick={handleAddPoRow}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold text-xs border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 cursor-pointer"
                  >
                    <Plus className="size-3.5" /> Add PO
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-black text-slate-500">
                    <tr>
                      <th className="py-2.5 px-3 w-10 text-center">SL</th>
                      <th className="py-2.5 px-3.5">PO Number *</th>
                      <th className="py-2.5 px-3.5 text-right w-36">PO Quantity *</th>
                      <th className="py-2.5 px-3.5 text-right w-32">Rate ($/pc) *</th>
                      <th className="py-2.5 px-3.5 text-right w-36">Value ($)</th>
                      <th className="py-2.5 px-3.5">Remarks</th>
                      {formMode !== "view" && (
                        <th className="py-2.5 px-3 text-center w-16">Action</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {(formData.poRows || []).length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-slate-400">
                          No Purchase Orders added. Click "Add PO" to enter purchase orders for this style.
                        </td>
                      </tr>
                    ) : (
                      (formData.poRows || []).map((po, idx) => (
                        <tr key={po.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-400">
                            {idx + 1}
                          </td>
                          <td className="py-2 px-3.5">
                            <input
                              type="text"
                              disabled={formMode === "view"}
                              value={po.poNumber}
                              onChange={(e) => handleUpdatePoRow(idx, "poNumber", e.target.value)}
                              placeholder="e.g. PO-HM-001"
                              className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-xs"
                            />
                          </td>
                          <td className="py-2 px-3.5">
                            <input
                              type="number"
                              disabled={formMode === "view"}
                              value={po.poQuantity}
                              onChange={(e) => handleUpdatePoRow(idx, "poQuantity", Number(e.target.value) || 0)}
                              className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono font-bold text-xs"
                            />
                          </td>
                          <td className="py-2 px-3.5">
                            <input
                              type="number"
                              step="0.0001"
                              disabled={formMode === "view"}
                              value={po.rate}
                              onChange={(e) => handleUpdatePoRow(idx, "rate", Number(e.target.value) || 0)}
                              className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono font-bold text-xs"
                            />
                          </td>
                          <td className="py-2 px-3.5 text-right font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                            ${Number(po.value || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2 px-3.5">
                            <input
                              type="text"
                              disabled={formMode === "view"}
                              value={po.remarks || ""}
                              onChange={(e) => handleUpdatePoRow(idx, "remarks", e.target.value)}
                              placeholder="Optional PO remarks..."
                              className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                            />
                          </td>
                          {formMode !== "view" && (
                            <td className="py-2 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemovePoRow(idx)}
                                className="p-1 rounded-lg hover:bg-rose-50 text-rose-500 cursor-pointer"
                                title="Remove PO row"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-indigo-50/50 dark:bg-indigo-950/30 border-t border-slate-200 dark:border-slate-800 font-black text-slate-900 dark:text-white">
                      <td colSpan={2} className="py-3 px-3.5 text-right uppercase text-[10px] tracking-wider">
                        Consolidated Order Totals:
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono text-indigo-700 dark:text-indigo-300">
                        {consolidatedOrderQty.toLocaleString()} pcs
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono text-slate-500 text-[11px]">
                        Avg: ${averagePoRate.toFixed(4)}
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono text-indigo-700 dark:text-indigo-300">
                        ${totalPoValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td colSpan={formMode !== "view" ? 2 : 1} className="py-3 px-3.5 text-[11px] text-slate-500">
                        Summed automatically across {(formData.poRows || []).length} purchase orders
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* SECTION 3: Item-wise Pre Costing Details */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-indigo-600 rounded-full inline-block" />
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    3. Item-wise Pre Costing Details
                  </h2>
                </div>
                {formMode !== "view" && (
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold text-xs border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 cursor-pointer"
                  >
                    <Plus className="size-3.5" /> Add Costing Item
                  </button>
                )}
              </div>

              <div className="overflow-x-auto pb-2">
                <table className="w-full text-xs text-left whitespace-nowrap min-w-[1250px]">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[9.5px] uppercase font-black text-slate-500">
                    <tr>
                      <th className="py-2.5 px-2 text-center w-8">SL</th>
                      <th className="py-2.5 px-2 w-32">Head *</th>
                      <th className="py-2.5 px-2.5 w-64">Item Name *</th>
                      <th className="py-2.5 px-2 w-44">Description</th>
                      <th className="py-2.5 px-2 w-32">N. Status *</th>
                      <th className="py-2.5 px-2.5 w-52">Supplier *</th>
                      <th className="py-2.5 px-2 text-right w-32">Effected Qty *</th>
                      <th className="py-2.5 px-2 text-right w-20">Consump.</th>
                      <th className="py-2.5 px-2 text-center w-16">Unit</th>
                      <th className="py-2.5 px-2 text-right w-24">Required Qty</th>
                      <th className="py-2.5 px-2 text-right w-24">Final Qty</th>
                      <th className="py-2.5 px-2 text-right w-20">Rate ($)</th>
                      <th className="py-2.5 px-2.5 text-right w-28">Amount ($)</th>
                      {formMode !== "view" && <th className="py-2.5 px-2 text-center w-12">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {(formData.items || []).length === 0 ? (
                      <tr>
                        <td colSpan={14} className="py-8 text-center text-slate-400">
                          No costing items entered. Click "Add Costing Item" to add fabric or accessories items.
                        </td>
                      </tr>
                    ) : (
                      (formData.items || []).map((item, idx) => {
                        const isFabric = FABRIC_HEADS.includes(item.head);
                        const isEffQtyInvalid = consolidatedOrderQty > 0 && (Number(item.effectedQty) || 0) > consolidatedOrderQty;

                        // Item options based on Head
                        const itemOptions = isFabric
                          ? fabricMasterItems.map((f) => ({
                              value: f.fabricDescription || f.fabricCode,
                              label: `${f.fabricCode} — ${f.fabricDescription} (${f.composition || ""}${f.gsm ? `, ${f.gsm} GSM` : ""})`,
                            }))
                          : accessoriesMasterItems.map((a) => ({
                              value: a.itemName,
                              label: `${a.itemCode} — ${a.itemName} (${a.category})`,
                            }));

                        // Supplier options from master
                        const supplierOptions = suppliersMaster.map((s) => ({
                          value: s.name,
                          label: s.country ? `${s.name} (${s.country})` : s.name,
                        }));

                        return (
                          <tr
                            key={item.id || idx}
                            className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/40 ${
                              isEffQtyInvalid ? "bg-rose-50/20 dark:bg-rose-950/20" : ""
                            }`}
                          >
                            {/* 1. SL */}
                            <td className="py-2 px-2 text-center font-mono font-bold text-slate-400">
                              {idx + 1}
                            </td>

                            {/* 2. Head (12 standard options) */}
                            <td className="py-2 px-2">
                              <select
                                disabled={formMode === "view"}
                                value={item.head}
                                onChange={(e) => handleHeadChange(idx, e.target.value)}
                                className="w-full h-8 px-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-[11px]"
                              >
                                {PRE_COSTING_HEADS.map((h) => (
                                  <option key={h} value={h}>
                                    {h}
                                  </option>
                                ))}
                              </select>
                            </td>

                            {/* 3. Item Name (Searchable, conditionally filtered by Head) */}
                            <td className="py-2 px-2.5">
                              <SearchableSelect
                                options={itemOptions}
                                value={item.item}
                                onChange={(val) => handleItemSelect(idx, val)}
                                placeholder={isFabric ? "Search Fabric..." : "Search Trims/Accessories..."}
                                disabled={formMode === "view"}
                              />
                            </td>

                            {/* 4. Description */}
                            <td className="py-2 px-2">
                              <input
                                type="text"
                                disabled={formMode === "view"}
                                value={item.description}
                                onChange={(e) => handleUpdateItemRow(idx, "description", e.target.value)}
                                placeholder="Specification..."
                                className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px]"
                              />
                            </td>

                            {/* 5. N. Status (Nominated | Own Source) */}
                            <td className="py-2 px-2">
                              <select
                                disabled={formMode === "view"}
                                value={item.nStatus}
                                onChange={(e) => handleUpdateItemRow(idx, "nStatus", e.target.value)}
                                className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-[11px]"
                              >
                                {NOMINEE_STATUSES.map((ns) => (
                                  <option key={ns} value={ns}>
                                    {ns}
                                  </option>
                                ))}
                              </select>
                            </td>

                            {/* 6. Supplier (Searchable from Supplier Master) */}
                            <td className="py-2 px-2.5">
                              <SearchableSelect
                                options={supplierOptions}
                                value={item.supplier}
                                onChange={(val) => handleUpdateItemRow(idx, "supplier", val)}
                                placeholder="Search Supplier..."
                                disabled={formMode === "view"}
                              />
                            </td>

                            {/* 7. Effected Qty (Validation: Effected Qty <= Total Order QTY) */}
                            <td className="py-2 px-2">
                              <input
                                type="number"
                                disabled={formMode === "view"}
                                value={item.effectedQty}
                                onChange={(e) => handleUpdateItemRow(idx, "effectedQty", Number(e.target.value) || 0)}
                                className={`w-full h-8 px-2 rounded-lg border text-right font-mono text-[11px] font-bold ${
                                  isEffQtyInvalid
                                    ? "border-rose-500 bg-rose-50/50 text-rose-700 focus:ring-rose-500 focus:border-rose-500"
                                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                                }`}
                              />
                              {isEffQtyInvalid && (
                                <span className="block text-[9.5px] font-bold text-rose-600 mt-0.5 leading-tight">
                                  Exceeds Total ({consolidatedOrderQty.toLocaleString()})
                                </span>
                              )}
                            </td>

                            {/* 8. Consumption */}
                            <td className="py-2 px-2">
                              <input
                                type="number"
                                step="0.0001"
                                disabled={formMode === "view"}
                                value={item.consumption}
                                onChange={(e) => handleUpdateItemRow(idx, "consumption", Number(e.target.value) || 0)}
                                className="w-full h-8 px-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono text-[11px]"
                              />
                            </td>

                            {/* 9. Unit */}
                            <td className="py-2 px-2">
                              <select
                                disabled={formMode === "view"}
                                value={item.unit}
                                onChange={(e) => handleUpdateItemRow(idx, "unit", e.target.value)}
                                className="w-full h-8 px-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-bold text-[11px]"
                              >
                                {UOM_OPTIONS.map((u) => (
                                  <option key={u} value={u}>
                                    {u}
                                  </option>
                                ))}
                              </select>
                            </td>

                            {/* 10. Required Qty (Read-only: Effected Qty * Consump) */}
                            <td className="py-2 px-2 text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                              {Number(item.requiredQty || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </td>

                            {/* 11. Final Qty */}
                            <td className="py-2 px-2">
                              <input
                                type="number"
                                step="0.01"
                                disabled={formMode === "view"}
                                value={item.finalQty}
                                onChange={(e) => handleUpdateItemRow(idx, "finalQty", Number(e.target.value) || 0)}
                                className="w-full h-8 px-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono font-bold text-[11px]"
                              />
                            </td>

                            {/* 12. Rate */}
                            <td className="py-2 px-2">
                              <input
                                type="number"
                                step="0.001"
                                disabled={formMode === "view"}
                                value={item.rate}
                                onChange={(e) => handleUpdateItemRow(idx, "rate", Number(e.target.value) || 0)}
                                className="w-full h-8 px-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono font-bold text-[11px]"
                              />
                            </td>

                            {/* 13. Amount */}
                            <td className="py-2 px-2.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                              ${Number(item.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>

                            {/* Action */}
                            {formMode !== "view" && (
                              <td className="py-2 px-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItemRow(idx)}
                                  className="p-1 rounded hover:bg-rose-50 text-rose-500 cursor-pointer"
                                  title="Remove item"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 dark:bg-slate-800 font-black border-t border-slate-200 dark:border-slate-700">
                      <td colSpan={12} className="py-3 px-3 text-right uppercase text-[10px] tracking-wider">
                        Total Pre Costing Material & Manufacturing Cost:
                      </td>
                      <td className="py-3 px-2.5 text-right font-mono text-indigo-700 dark:text-indigo-300 text-sm">
                        ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      {formMode !== "view" && <td />}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* SECTION 4: Order and Costing Summary */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="w-1.5 h-4 bg-indigo-600 rounded-full inline-block" />
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  4. Order and Costing Summary
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total GMT Qty</span>
                  <span className="text-base font-mono font-black text-slate-900 dark:text-white">
                    {consolidatedOrderQty.toLocaleString()}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Average Rate / Pc</span>
                  <span className="text-base font-mono font-black text-slate-900 dark:text-white">
                    ${averagePoRate.toFixed(4)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                  <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 block">Total GMT Value</span>
                  <span className="text-base font-mono font-black text-indigo-700 dark:text-indigo-300">
                    ${totalPoValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Cost</span>
                  <span className="text-base font-mono font-black text-slate-900 dark:text-white">
                    ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">Surplus Value</span>
                  <span className={`text-base font-mono font-black ${totalSurplus >= 0 ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}`}>
                    ${totalSurplus.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">Surplus / Pcs</span>
                  <span className={`text-base font-mono font-black ${surplusPerPcs >= 0 ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}`}>
                    ${surplusPerPcs.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 5: Style & Pre Costing Images */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-indigo-600 rounded-full inline-block" />
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                    <ImageIcon className="size-4 text-indigo-600" />
                    <span>5. Style & Pre Costing Images</span>
                  </h2>
                </div>

                {formMode !== "view" && (
                  <div>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageFilesSelect}
                      className="hidden"
                      id="section5-image-input"
                    />
                    <label
                      htmlFor="section5-image-input"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold text-xs border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 cursor-pointer transition-all"
                    >
                      <Upload className="size-3.5" /> Attach Images
                    </label>
                  </div>
                )}
              </div>

              {/* Images Grid */}
              {(() => {
                const imageAttachments = currentRecordAttachments.filter(
                  (a) => a.storageType === "image" || a.dataUrl?.startsWith("data:image/") || /\.(png|jpe?g|gif|webp|svg)$/i.test(a.fileName || "")
                );

                if (imageAttachments.length === 0) {
                  return (
                    <div className="py-8 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                      <ImageIcon className="size-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        No style images attached.
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {formMode !== "view"
                          ? 'Click "Attach Images" to upload garment photographs, flat sketches, or tech pack images (Max 3 MB).'
                          : "No images were uploaded for this pre costing record."}
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                    {imageAttachments.map((img) => (
                      <div
                        key={img.id}
                        className="group relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 overflow-hidden shadow-xs hover:border-indigo-300 transition-all"
                      >
                        <div
                          onClick={() => setPreviewImageModal(img.dataUrl || null)}
                          className="aspect-square w-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center overflow-hidden cursor-pointer"
                        >
                          {img.dataUrl ? (
                            <img
                              src={img.dataUrl}
                              alt={img.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <ImageIcon className="size-8 text-slate-300" />
                          )}
                        </div>

                        <div className="p-2">
                          <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate" title={img.title}>
                            {img.title}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                            <span className="font-mono">{img.fileSize}</span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setPreviewImageModal(img.dataUrl || null)}
                                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                                title="Enlarge preview"
                              >
                                <Eye className="size-3" />
                              </button>
                              {formMode !== "view" && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAttachment(img.id)}
                                  className="p-1 rounded hover:bg-rose-100 text-rose-500"
                                  title="Delete image"
                                >
                                  <Trash2 className="size-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* STICKY BOTTOM ACTION BAR WITH FOOTER ATTACHMENT BUTTON */}
            <div className="sticky bottom-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
                >
                  {formMode === "view" ? "Back to Register" : "Cancel"}
                </button>

                {/* Footer Attachment Button - Reusing PI Entry Form Pattern */}
                <button
                  type="button"
                  onClick={() => setShowAttachmentModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-xs"
                >
                  <Paperclip className="size-3.5 text-teal-600" />
                  <span>Attachment ({currentRecordAttachments.length})</span>
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {formMode !== "view" ? (
                  <>
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="size-3.5" /> Save as Draft
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitForApproval}
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <Send className="size-3.5" /> Submit for Approval
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenReport(formData)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <Printer className="size-3.5" /> Print Pre Costing Report
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            VIEW 3: VERSION HISTORY TIMELINE
           ════════════════════════════════════════════════════════════ */}
        {view === "history" && compareRecord && (
          <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setView("list")}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 cursor-pointer"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <div>
                  <h1 className="text-xl font-black text-slate-900 dark:text-white">
                    Version History & Amendments — {compareRecord.preCostId}
                  </h1>
                  <p className="text-xs text-slate-500">
                    Style: {compareRecord.style} • Buyer: {compareRecord.buyer} • Current Version: v{compareRecord.version}
                  </p>
                </div>
              </div>

              {(compareRecord.versions || []).length >= 2 && (
                <button
                  onClick={() => handleOpenComparison(compareRecord)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  <GitBranch className="size-3.5" /> Compare Versions Side-by-Side
                </button>
              )}
            </div>

            {/* Versions List */}
            <div className="space-y-4">
              {(compareRecord.versions || []).map((ver, idx) => (
                <div
                  key={ver.versionNumber || idx}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Version {ver.versionNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          ver.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : ver.status === "Pending Approval"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {ver.status}
                      </span>
                      {ver.versionNumber === compareRecord.version && (
                        <span className="text-[10px] font-bold text-slate-400">
                          (Latest Version)
                        </span>
                      )}
                    </div>

                    {ver.amendmentReason && (
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        <strong>Amendment Reason:</strong> "{ver.amendmentReason}"
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                      <span>Created By: <strong>{ver.createdBy}</strong> ({ver.createdDate})</span>
                      {ver.submittedBy && (
                        <span>Submitted By: <strong>{ver.submittedBy}</strong> ({ver.submittedDate})</span>
                      )}
                      {ver.approvedBy && (
                        <span className="text-emerald-600 font-semibold">
                          Approved By: <strong>{ver.approvedBy}</strong> ({ver.approvalDate})
                        </span>
                      )}
                    </div>

                    {ver.decisionComments && (
                      <p className="text-[11px] text-slate-500 italic">
                        Approval Notes: {ver.decisionComments}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        // Reconstruct record from this version's snapshot for read-only view
                        const restored: PreCostingRecord = {
                          ...compareRecord,
                          version: ver.versionNumber,
                          status: ver.status,
                          poRows: ver.poRows,
                          items: ver.items as any,
                          note: ver.header.note,
                          smv: ver.header.smv,
                        };
                        handleOpenView(restored);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold hover:bg-slate-100 cursor-pointer"
                    >
                      View Version
                    </button>

                    <button
                      onClick={() => {
                        handleOpenComparison(compareRecord, compareRecord.version, ver.versionNumber);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold hover:bg-indigo-100 cursor-pointer"
                    >
                      Compare with Latest
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            VIEW 4: SIDE-BY-SIDE VERSION COMPARISON WITH DIFF
           ════════════════════════════════════════════════════════════ */}
        {view === "compare" && (
          <div className="p-4 md:p-6 space-y-6 max-w-[1700px] mx-auto">
            {!compareRecord ? (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-xs">
                <GitBranch className="size-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  Select a Pre Costing to Compare Versions
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Select an existing Pre Costing Job to compare version amendments and side-by-side metric diffs.
                </p>
                {records.length > 0 ? (
                  <div className="mt-4 max-w-sm mx-auto">
                    <select
                      onChange={(e) => {
                        const found = records.find((r) => r.id === e.target.value);
                        if (found) handleOpenComparison(found);
                      }}
                      defaultValue=""
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                    >
                      <option value="" disabled>Select Pre Costing Job...</option>
                      {records.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.preCostId} — {r.buyer} ({r.style})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="mt-4">
                    <button
                      onClick={() => handleTabClick("create")}
                      className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700"
                    >
                      Create First Pre Costing
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setView("history")}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 cursor-pointer"
                    >
                      <ArrowLeft className="size-4" />
                    </button>
                    <div>
                      <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <GitBranch className="size-5 text-indigo-600" />
                        Version Comparison — {compareRecord.preCostId}
                      </h1>
                      <p className="text-xs text-slate-500">
                        Visual diff analysis: Comparing Version {compareVersionA} with Version {compareVersionB}
                      </p>
                    </div>
                  </div>

                  {/* Pre Costing Job & Version Pickers */}
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-500">Job:</span>
                      <select
                        value={compareRecord.id}
                        onChange={(e) => {
                          const found = records.find((r) => r.id === e.target.value);
                          if (found) handleOpenComparison(found);
                        }}
                        className="h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                      >
                        {records.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.preCostId} ({r.style})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-500">Version A:</span>
                      <select
                        value={compareVersionA}
                        onChange={(e) => setCompareVersionA(Number(e.target.value))}
                        className="h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                      >
                        {(compareRecord.versions || []).map((v) => (
                          <option key={v.versionNumber} value={v.versionNumber}>
                            Version {v.versionNumber} ({v.status})
                          </option>
                        ))}
                      </select>
                    </div>

                    <span className="font-black text-slate-400">vs</span>

                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-500">Version B:</span>
                      <select
                        value={compareVersionB}
                        onChange={(e) => setCompareVersionB(Number(e.target.value))}
                        className="h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                      >
                        {(compareRecord.versions || []).map((v) => (
                          <option key={v.versionNumber} value={v.versionNumber}>
                            Version {v.versionNumber} ({v.status})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Diff Legend */}
                <div className="flex flex-wrap items-center gap-4 text-xs p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-600 dark:text-slate-400">Diff Indicators:</span>
                  <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
                    <span className="size-3 rounded bg-emerald-100 border border-emerald-400" /> Added Row (Green)
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-600 font-bold text-[11px]">
                    <span className="size-3 rounded bg-amber-100 border border-amber-400" /> Modified Value (Amber)
                  </span>
                  <span className="flex items-center gap-1.5 text-rose-600 font-bold text-[11px]">
                    <span className="size-3 rounded bg-rose-100 border border-rose-400" /> Removed Row (Red)
                  </span>
                </div>

                {/* Version Snapshots side-by-side calculation */}
                {(() => {
                  const snapA = (compareRecord.versions || []).find((v) => v.versionNumber === compareVersionA);
                  const snapB = (compareRecord.versions || []).find((v) => v.versionNumber === compareVersionB);

                  if (!snapA || !snapB) {
                    return (
                      <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        Please select valid version snapshots for comparison.
                      </div>
                    );
                  }

                  const snapAOrderQty = Number(snapA.summary?.orderQty) || 0;
                  const snapBOrderQty = Number(snapB.summary?.orderQty) || 0;
                  const snapAGmtVal = Number(snapA.summary?.totalGmtValue) || 0;
                  const snapBGmtVal = Number(snapB.summary?.totalGmtValue) || 0;
                  const snapACost = Number(snapA.summary?.totalCost) || 0;
                  const snapBCost = Number(snapB.summary?.totalCost) || 0;
                  const snapASurplus = Number(snapA.summary?.surplus) || 0;
                  const snapBSurplus = Number(snapB.summary?.surplus) || 0;

                  return (
                    <div className="space-y-6">
                      {/* Summary Comparison Grid */}
                      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                          Summary Metrics Comparison
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {/* Order Qty */}
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Order Qty</span>
                            <div className="flex items-baseline justify-between mt-1">
                              <span className="text-xs font-mono">v{compareVersionA}: {snapAOrderQty.toLocaleString()}</span>
                              <span className="text-xs font-mono font-bold text-indigo-600">v{compareVersionB}: {snapBOrderQty.toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Total Value */}
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Pre Costing Value</span>
                            <div className="flex items-baseline justify-between mt-1">
                              <span className="text-xs font-mono">v{compareVersionA}: ${snapAGmtVal.toFixed(2)}</span>
                              <span className="text-xs font-mono font-bold text-indigo-600">v{compareVersionB}: ${snapBGmtVal.toFixed(2)}</span>
                            </div>
                          </div>

                          {/* Total Cost */}
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Cost</span>
                            <div className="flex items-baseline justify-between mt-1">
                              <span className="text-xs font-mono">v{compareVersionA}: ${snapACost.toFixed(2)}</span>
                              <span className="text-xs font-mono font-bold text-indigo-600">v{compareVersionB}: ${snapBCost.toFixed(2)}</span>
                            </div>
                          </div>

                          {/* Surplus */}
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Surplus</span>
                            <div className="flex items-baseline justify-between mt-1">
                              <span className="text-xs font-mono">v{compareVersionA}: ${snapASurplus.toFixed(2)}</span>
                              <span className="text-xs font-mono font-bold text-emerald-600">v{compareVersionB}: ${snapBSurplus.toFixed(2)}</span>
                            </div>
                          </div>

                          {/* Variance */}
                          <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200">
                            <span className="text-[10px] uppercase font-bold text-indigo-600 block">Cost Variance (Δ)</span>
                            <span className="text-sm font-mono font-black text-indigo-700 dark:text-indigo-300 mt-1 block">
                              ${(snapBCost - snapACost).toFixed(2)} USD
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Purchase Orders Comparison Table */}
                      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                          Purchase Order Rows Comparison
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left whitespace-nowrap">
                            <thead className="bg-slate-50 dark:bg-slate-800 font-black uppercase text-[10px] text-slate-500">
                              <tr>
                                <th className="py-2.5 px-3">PO Number</th>
                                <th className="py-2.5 px-3 text-right">v{compareVersionA} Qty</th>
                                <th className="py-2.5 px-3 text-right">v{compareVersionB} Qty</th>
                                <th className="py-2.5 px-3 text-right">v{compareVersionA} Rate</th>
                                <th className="py-2.5 px-3 text-right">v{compareVersionB} Rate</th>
                                <th className="py-2.5 px-3 text-right">v{compareVersionA} Value</th>
                                <th className="py-2.5 px-3 text-right">v{compareVersionB} Value</th>
                                <th className="py-2.5 px-3 text-center">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                              {(snapB.poRows || []).map((poB) => {
                                const poA = (snapA.poRows || []).find((p) => p.poNumber === poB.poNumber);
                                const isNew = !poA;
                                const isModified = poA && (poA.poQuantity !== poB.poQuantity || poA.rate !== poB.rate);

                                return (
                                  <tr
                                    key={poB.poNumber}
                                    className={
                                      isNew
                                        ? "bg-emerald-50/70 text-emerald-900 font-semibold"
                                        : isModified
                                        ? "bg-amber-50/70 text-amber-900 font-semibold"
                                        : "hover:bg-slate-50/40"
                                    }
                                  >
                                    <td className="py-2.5 px-3 font-mono font-bold">{poB.poNumber}</td>
                                    <td className="py-2.5 px-3 text-right font-mono">{poA ? (Number(poA.poQuantity) || 0).toLocaleString() : "—"}</td>
                                    <td className="py-2.5 px-3 text-right font-mono font-bold">{(Number(poB.poQuantity) || 0).toLocaleString()}</td>
                                    <td className="py-2.5 px-3 text-right font-mono">{poA ? `$${(Number(poA.rate) || 0).toFixed(4)}` : "—"}</td>
                                    <td className="py-2.5 px-3 text-right font-mono font-bold">${(Number(poB.rate) || 0).toFixed(4)}</td>
                                    <td className="py-2.5 px-3 text-right font-mono">{poA ? `$${(Number(poA.value) || 0).toFixed(2)}` : "—"}</td>
                                    <td className="py-2.5 px-3 text-right font-mono font-bold">${(Number(poB.value) || 0).toFixed(2)}</td>
                                    <td className="py-2.5 px-3 text-center">
                                      {isNew && <span className="text-[10px] font-black text-emerald-700 uppercase">+ Added</span>}
                                      {isModified && <span className="text-[10px] font-black text-amber-700 uppercase">Modified</span>}
                                      {!isNew && !isModified && <span className="text-[10px] text-slate-400">Unchanged</span>}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Item-wise Costing Comparison Table */}
                      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                          Item-wise Pre Costing Detail Comparison
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left whitespace-nowrap min-w-[1100px]">
                            <thead className="bg-slate-50 dark:bg-slate-800 font-black uppercase text-[10px] text-slate-500">
                              <tr>
                                <th className="py-2.5 px-3">Head / Item</th>
                                <th className="py-2.5 px-3">Used Place</th>
                                <th className="py-2.5 px-3 text-right">v{compareVersionA} Qty</th>
                                <th className="py-2.5 px-3 text-right">v{compareVersionB} Qty</th>
                                <th className="py-2.5 px-3 text-right">v{compareVersionA} Rate</th>
                                <th className="py-2.5 px-3 text-right">v{compareVersionB} Rate</th>
                                <th className="py-2.5 px-3 text-right">v{compareVersionA} Amount</th>
                                <th className="py-2.5 px-3 text-right">v{compareVersionB} Amount</th>
                                <th className="py-2.5 px-3 text-center">Variance / Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                              {(snapB.items || []).map((itB) => {
                                const itA = (snapA.items || []).find((i) => i.item === itB.item || i.codeNo === itB.codeNo);
                                const isNew = !itA;
                                const isModified = itA && (itA.finalQty !== itB.finalQty || itA.rate !== itB.rate || itA.amount !== itB.amount);

                                return (
                                  <tr
                                    key={itB.id || itB.item}
                                    className={
                                      isNew
                                        ? "bg-emerald-50/70 text-emerald-900 font-semibold"
                                        : isModified
                                        ? "bg-amber-50/70 text-amber-900 font-semibold"
                                        : "hover:bg-slate-50/40"
                                    }
                                  >
                                    <td className="py-2.5 px-3">
                                      <span className="font-bold block">{itB.item}</span>
                                      <span className="text-[10px] text-slate-400 font-mono">
                                        {itB.head} • {itB.codeNo}
                                      </span>
                                    </td>
                                    <td className="py-2.5 px-3">{itB.usedPlace}</td>
                                    <td className="py-2.5 px-3 text-right font-mono">{itA ? (Number(itA.finalQty) || 0).toLocaleString() : "—"}</td>
                                    <td className="py-2.5 px-3 text-right font-mono font-bold">{(Number(itB.finalQty) || 0).toLocaleString()}</td>
                                    <td className="py-2.5 px-3 text-right font-mono">{itA ? `$${(Number(itA.rate) || 0).toFixed(3)}` : "—"}</td>
                                    <td className="py-2.5 px-3 text-right font-mono font-bold">${(Number(itB.rate) || 0).toFixed(3)}</td>
                                    <td className="py-2.5 px-3 text-right font-mono">{itA ? `$${(Number(itA.amount) || 0).toFixed(2)}` : "—"}</td>
                                    <td className="py-2.5 px-3 text-right font-mono font-bold">${(Number(itB.amount) || 0).toFixed(2)}</td>
                                    <td className="py-2.5 px-3 text-center">
                                      {isNew && <span className="text-[10px] font-black text-emerald-700 uppercase">+ Added</span>}
                                      {isModified && (
                                        <span className="text-[10px] font-black text-amber-700 uppercase">
                                          Δ ${((Number(itB.amount) || 0) - (Number(itA?.amount) || 0)).toFixed(2)}
                                        </span>
                                      )}
                                      {!isNew && !isModified && <span className="text-[10px] text-slate-400">Unchanged</span>}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            VIEW 5: PRINTABLE PRE COSTING REPORT (MATCHES REFERENCE LAYOUT)
           ════════════════════════════════════════════════════════════ */}
        {view === "report" && (
          !activeRecord ? (
            <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg mx-auto my-12 shadow-xs">
              <FileText className="size-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="font-bold text-sm text-slate-800 dark:text-slate-200">No Pre Costing record selected for report</p>
              <p className="text-xs text-slate-400 mt-1">Please select a record from the register to generate the formal pre costing report.</p>
              <button
                onClick={() => setView("list")}
                className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 cursor-pointer"
              >
                Back to Pre Costing Register
              </button>
            </div>
          ) : (
            <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
            {/* Top Toolbar (Hidden on Print) */}
            <div className="print:hidden flex items-center justify-between pb-4 border-b border-slate-200">
              <button
                onClick={() => setView("list")}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border bg-white text-xs font-bold hover:bg-slate-100 cursor-pointer"
              >
                <ArrowLeft className="size-3.5" /> Back to Register
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">
                  Report Version: <strong>v{activeRecord.version}</strong> ({activeRecord.status})
                </span>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  <Printer className="size-3.5" /> Print Pre Costing Report
                </button>
              </div>
            </div>

            {/* The Formal Document */}
            <div className="bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-slate-900 print:border-none print:shadow-none print:p-0">
              {/* Company Header */}
              <div className="text-center pb-4 border-b-2 border-slate-800 space-y-1">
                <h1 className="text-xl font-black uppercase tracking-wider">
                  Pakiza Knit Composite Ltd.
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  Gorai, Mirzapur, Tangail, Bangladesh • Email: merchandising@pakizagroup.com
                </p>
                <div className="pt-2">
                  <span className="inline-block px-4 py-1 rounded bg-slate-100 text-xs font-black uppercase tracking-widest border border-slate-300">
                    Style-wise Pre Costing Report
                  </span>
                </div>
              </div>

              {/* Identification Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border border-slate-300 rounded-lg p-3.5 bg-slate-50/50">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Pre Costing No</span>
                  <span className="font-mono font-black text-indigo-700">{activeRecord.preCostNo}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Pre Costing ID</span>
                  <span className="font-mono font-bold">{activeRecord.preCostId}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Pre Costing Date</span>
                  <span className="font-bold">{activeRecord.preCostDate}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Version / Status</span>
                  <span className="font-bold">v{activeRecord.version} ({activeRecord.status})</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Buyer</span>
                  <span className="font-black">{activeRecord.buyer}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Style No</span>
                  <span className="font-black text-slate-900">{activeRecord.style}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Contract No</span>
                  <span className="font-mono font-bold">{activeRecord.contractNo || "—"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Our Ref / A/C</span>
                  <span className="font-bold">{activeRecord.ourRef || "—"} ({activeRecord.acHolder})</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Merchandiser</span>
                  <span className="font-bold">{activeRecord.merchandiser}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">SMV Value</span>
                  <span className="font-mono font-bold">{activeRecord.smv} min</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Season</span>
                  <span className="font-bold">{activeRecord.season}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Currency</span>
                  <span className="font-bold font-mono">{activeRecord.currency}</span>
                </div>
              </div>

              {/* Purchase Order Summary Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Purchase Order (PO) Details
                </h3>
                <div className="border border-slate-300 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 border-b border-slate-300 text-[9.5px] uppercase font-black text-slate-600">
                      <tr>
                        <th className="py-1.5 px-3 w-10 text-center">SL</th>
                        <th className="py-1.5 px-3">PO Number</th>
                        <th className="py-1.5 px-3 text-right">PO Quantity</th>
                        <th className="py-1.5 px-3 text-right">Rate ($)</th>
                        <th className="py-1.5 px-3 text-right">Value ($)</th>
                        <th className="py-1.5 px-3">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {(activeRecord.poRows || []).map((po, idx) => (
                        <tr key={po.id || idx}>
                          <td className="py-1.5 px-3 text-center font-mono">{idx + 1}</td>
                          <td className="py-1.5 px-3 font-mono font-bold">{po.poNumber}</td>
                          <td className="py-1.5 px-3 text-right font-mono font-bold">{(Number(po.poQuantity) || 0).toLocaleString()}</td>
                          <td className="py-1.5 px-3 text-right font-mono">${(Number(po.rate) || 0).toFixed(4)}</td>
                          <td className="py-1.5 px-3 text-right font-mono font-bold">${(Number(po.value) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          <td className="py-1.5 px-3 text-slate-500">{po.remarks || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      {(() => {
                        const totalQty = (activeRecord.poRows || []).reduce((s, p) => s + (Number(p.poQuantity) || 0), 0);
                        const totalVal = (activeRecord.poRows || []).reduce((s, p) => s + (Number(p.value) || 0), 0);
                        return (
                          <tr className="bg-slate-100 font-black border-t border-slate-300">
                            <td colSpan={2} className="py-2 px-3 text-right uppercase text-[10px]">Total Order Qty:</td>
                            <td className="py-2 px-3 text-right font-mono">{totalQty.toLocaleString()} pcs</td>
                            <td className="py-2 px-3 text-right font-mono text-[10px]">Avg: ${(totalQty > 0 ? totalVal / totalQty : 0).toFixed(4)}</td>
                            <td className="py-2 px-3 text-right font-mono text-indigo-700">${totalVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            <td />
                          </tr>
                        );
                      })()}
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Item-wise Costing Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Item-wise Pre Costing Specification & Consumption
                </h3>
                <div className="border border-slate-300 rounded-lg overflow-hidden">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-slate-100 border-b border-slate-300 text-[9px] uppercase font-black text-slate-600">
                      <tr>
                        <th className="py-2 px-2 text-center w-8">SL</th>
                        <th className="py-2 px-2">Head</th>
                        <th className="py-2 px-2">Item Description</th>
                        <th className="py-2 px-2">Used Place</th>
                        <th className="py-2 px-2">Color</th>
                        <th className="py-2 px-2">Supplier</th>
                        <th className="py-2 px-2 text-right">Consump.</th>
                        <th className="py-2 px-2 text-center">Unit</th>
                        <th className="py-2 px-2 text-right">Final Qty</th>
                        <th className="py-2 px-2 text-right">Rate ($)</th>
                        <th className="py-2 px-2.5 text-right">Amount ($)</th>
                        <th className="py-2 px-2 text-right">Cost %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {(activeRecord.items || []).map((it, idx) => (
                        <tr key={it.id || idx}>
                          <td className="py-1.5 px-2 text-center font-mono">{idx + 1}</td>
                          <td className="py-1.5 px-2 font-bold">{it.head}</td>
                          <td className="py-1.5 px-2">
                            <span className="font-semibold block">{it.item}</span>
                            <span className="text-[9.5px] text-slate-500">{it.description}</span>
                          </td>
                          <td className="py-1.5 px-2 text-slate-600">{it.usedPlace}</td>
                          <td className="py-1.5 px-2">{it.color}</td>
                          <td className="py-1.5 px-2 text-slate-600">{it.supplier}</td>
                          <td className="py-1.5 px-2 text-right font-mono">{it.consumption}</td>
                          <td className="py-1.5 px-2 text-center font-bold">{it.unit}</td>
                          <td className="py-1.5 px-2 text-right font-mono font-semibold">{(Number(it.finalQty) || 0).toLocaleString()}</td>
                          <td className="py-1.5 px-2 text-right font-mono">${(Number(it.rate) || 0).toFixed(3)}</td>
                          <td className="py-1.5 px-2.5 text-right font-mono font-bold">${(Number(it.amount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          <td className="py-1.5 px-2 text-right font-mono font-semibold text-indigo-700">{it.preCostPct}%</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      {(() => {
                        const totalCost = (activeRecord.items || []).reduce((s, it) => s + (Number(it.amount) || 0), 0);
                        const totalVal = (activeRecord.poRows || []).reduce((s, p) => s + (Number(p.value) || 0), 0);
                        const totalQty = (activeRecord.poRows || []).reduce((s, p) => s + (Number(p.poQuantity) || 0), 0);
                        const surplus = totalVal - totalCost;
                        return (
                          <tr className="bg-slate-100 font-black border-t-2 border-slate-400">
                            <td colSpan={10} className="py-2.5 px-3 text-right uppercase text-[10px]">
                              Total Pre Costing Value:
                            </td>
                            <td className="py-2.5 px-2.5 text-right font-mono text-indigo-700 text-xs">
                              ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-2.5 px-2 text-right font-mono">100.00%</td>
                          </tr>
                        );
                      })()}
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Order & Costing Summary Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border border-slate-300 rounded-lg p-3 bg-slate-50">
                {(() => {
                  const totalQty = (activeRecord.poRows || []).reduce((s, p) => s + (Number(p.poQuantity) || 0), 0);
                  const totalVal = (activeRecord.poRows || []).reduce((s, p) => s + (Number(p.value) || 0), 0);
                  const totalCost = (activeRecord.items || []).reduce((s, it) => s + (Number(it.amount) || 0), 0);
                  const surplus = totalVal - totalCost;
                  const surplusPcs = totalQty > 0 ? surplus / totalQty : 0;
                  return (
                    <>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Total GMT Qty</span>
                        <span className="font-mono font-bold text-sm">{totalQty.toLocaleString()} pcs</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Total GMT Value</span>
                        <span className="font-mono font-bold text-sm text-indigo-700">${totalVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Pre Costing Cost</span>
                        <span className="font-mono font-bold text-sm text-slate-800">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Surplus Value / (Pcs)</span>
                        <span className={`font-mono font-black text-sm ${surplus >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                          ${surplus.toLocaleString(undefined, { minimumFractionDigits: 2 })} (${surplusPcs.toFixed(4)}/pc)
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Formal Signature Blocks */}
              <div className="pt-12 grid grid-cols-4 gap-6 text-center text-xs text-slate-600">
                <div className="border-t border-slate-400 pt-1.5">
                  <p className="font-bold text-slate-800">{activeRecord.createdBy}</p>
                  <p className="text-[10px] text-slate-500">Prepared By</p>
                </div>
                <div className="border-t border-slate-400 pt-1.5">
                  <p className="font-bold text-slate-800">{activeRecord.merchandiser}</p>
                  <p className="text-[10px] text-slate-500">Merchandiser</p>
                </div>
                <div className="border-t border-slate-400 pt-1.5">
                  <p className="font-bold text-slate-800">Costing Dept.</p>
                  <p className="text-[10px] text-slate-500">Checked By</p>
                </div>
                <div className="border-t border-slate-400 pt-1.5">
                  <p className="font-bold text-slate-800">
                    {activeRecord.approvedBy || "Pending Authorization"}
                  </p>
                  <p className="text-[10px] text-slate-500">Authorized Signature</p>
                </div>
              </div>
            </div>
          </div>
        )
      )}

        {/* ════════════════════════════════════════════════════════════
            MODAL: MANDATORY AMENDMENT REASON
           ════════════════════════════════════════════════════════════ */}
        {amendModalOpen && targetAmendRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-2.5 text-slate-900 dark:text-white">
                <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
                  <GitBranch className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black">
                    Amend Style Pre Costing ({targetAmendRecord.preCostId})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Creating Version {targetAmendRecord.version + 1}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
                <AlertTriangle className="size-4 inline-block mr-1 text-amber-600 shrink-0" />
                <strong>Immutable Versioning Rule:</strong> Approved version v{targetAmendRecord.version} will remain operationally active and strictly immutable until the new revision v{targetAmendRecord.version + 1} is formally submitted and approved.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mandatory Amendment Justification Reason: <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={amendmentReasonInput}
                  onChange={(e) => setAmendmentReasonInput(e.target.value)}
                  placeholder="e.g. Yarn price escalation of $0.15/kg notified by spinning mill, added PO row for Europe store..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAmendModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAmendment}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer shadow-xs"
                >
                  Create Revision v{targetAmendRecord.version + 1}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            MODAL: REJECTION REASON CAPTURE
           ════════════════════════════════════════════════════════════ */}
        {rejectModalOpen && targetRejectRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-2.5 text-slate-900 dark:text-white">
                <div className="p-2 bg-rose-500/10 text-rose-600 rounded-xl">
                  <X className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black">
                    Reject Pre Costing ({targetRejectRecord.preCostId} v{targetRejectRecord.version})
                  </h3>
                  <p className="text-xs text-slate-500">Capture reason for decision audit</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Rejection Reason / Comments: <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={rejectionCommentsInput}
                  onChange={(e) => setRejectionCommentsInput(e.target.value)}
                  placeholder="e.g. CM rate is below minimum factory threshold. Consumption of pocketing fabric needs recalculation."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRejectRecord}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-xs"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
        {/* ════════════════════════════════════════════════════════════
            MODAL: DOCUMENT STORAGE ATTACHMENTS (PI ENTRY FORM REUSE)
           ════════════════════════════════════════════════════════════ */}
        {showAttachmentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-5xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Paperclip className="size-4 text-teal-600" />
                    <span>Document Storage — Pre Costing Attachments</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Job ID: <span className="font-mono font-bold text-teal-700 dark:text-teal-400">{formData.preCostId || "New Job"}</span> | Buyer: <span className="font-semibold text-slate-700 dark:text-slate-300">{formData.buyer || "N/A"}</span> | Style: <span className="font-mono font-bold text-indigo-600">{formData.style || "N/A"}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowAttachmentModal(false);
                    setUploadError(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                {/* Header status bar */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3.5 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-teal-600/30">
                      <File className="size-4" />
                      <span>File Storage</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded-full font-mono">
                        {currentRecordAttachments.length}
                      </span>
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Info className="size-3.5 text-teal-600" />
                    <span>Maximum File Size: <strong>3 MB</strong></span>
                  </div>
                </div>

                {/* Upload Error Banner */}
                {uploadError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="size-4 text-rose-600 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                    <button type="button" onClick={() => setUploadError(null)} className="p-0.5 text-rose-500 cursor-pointer">
                      <X className="size-3.5" />
                    </button>
                  </div>
                )}

                {/* File Selection and Upload Form */}
                {formMode !== "view" && (
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                      {/* File Selection Control */}
                      <div className="md:col-span-4">
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Choose Document or Image <span className="text-rose-500">*</span>
                        </label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.txt,image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="precost-attachment-file-upload-input"
                        />
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor="precost-attachment-file-upload-input"
                            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 text-xs font-semibold cursor-pointer text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5"
                          >
                            <Upload className="size-3.5 text-teal-600" />
                            <span>Choose File</span>
                          </label>
                          <span className="text-[11px] text-slate-500 truncate max-w-[160px]" title={selectedUploadFile ? selectedUploadFile.name : "No file chosen"}>
                            {selectedUploadFile ? selectedUploadFile.name : "No file chosen"}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <div className="md:col-span-4">
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Title <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={uploadTitle}
                          onChange={(e) => setUploadTitle(e.target.value)}
                          placeholder="e.g. Spec Sheet / Tech Pack / Booking"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                        />
                      </div>

                      {/* Note */}
                      <div className="md:col-span-3">
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Note
                        </label>
                        <input
                          type="text"
                          value={uploadNote}
                          onChange={(e) => setUploadNote(e.target.value)}
                          placeholder="Optional remarks"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                        />
                      </div>

                      {/* Upload Button */}
                      <div className="md:col-span-1">
                        <button
                          type="button"
                          onClick={handleUploadAttachment}
                          className="w-full px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                        >
                          <Upload className="size-3.5" />
                          <span>Upload</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7-column Attachment Table */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px]">
                        <th className="py-2.5 px-3 text-center w-12">Remove</th>
                        <th className="py-2.5 px-3 min-w-[160px]">Title</th>
                        <th className="py-2.5 px-3 min-w-[220px] max-w-sm">Note</th>
                        <th className="py-2.5 px-3 min-w-[130px]">Uploaded By</th>
                        <th className="py-2.5 px-3 min-w-[130px]">Upload Time</th>
                        <th className="py-2.5 px-3 min-w-[90px] text-right">File Size</th>
                        <th className="py-2.5 px-3 min-w-[110px] text-center">Download</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {currentRecordAttachments.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                            No documents or images stored for this Pre Costing record.
                          </td>
                        </tr>
                      ) : (
                        currentRecordAttachments.map((att) => (
                          <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                            {/* 1. Remove */}
                            <td className="py-2.5 px-3 text-center">
                              {formMode !== "view" ? (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAttachment(att.id)}
                                  title="Remove attachment"
                                  className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              ) : (
                                <span className="text-slate-300 dark:text-slate-600">—</span>
                              )}
                            </td>

                            {/* 2. Title & FileName */}
                            <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                              {att.title}
                              <span className="block text-[10px] font-mono text-slate-400 font-normal">
                                {att.fileName}
                              </span>
                            </td>

                            {/* 3. Note (Text wrapped) */}
                            <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 max-w-sm whitespace-normal break-words leading-relaxed">
                              {att.note || "—"}
                            </td>

                            {/* 4. Uploaded By */}
                            <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                              {att.uploadedBy}
                            </td>

                            {/* 5. Upload Time */}
                            <td className="py-2.5 px-3 font-mono text-slate-500">
                              {att.uploadTime}
                            </td>

                            {/* 6. File Size */}
                            <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                              {att.fileSize}
                            </td>

                            {/* 7. Download */}
                            <td className="py-2.5 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleDownloadAttachment(att)}
                                title={`Download ${att.fileName || att.title}`}
                                className="px-2.5 py-1 rounded bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 border border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300 font-semibold text-[11px] inline-flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                              >
                                <Download className="size-3.5" />
                                <span>Download</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Total Attachments: <strong>{currentRecordAttachments.length}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setShowAttachmentModal(false)}
                  className="px-4 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 cursor-pointer text-slate-700 dark:text-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            MODAL: IMAGE LIGHTBOX PREVIEW
           ════════════════════════════════════════════════════════════ */}
        {previewImageModal && (
          <div
            onClick={() => setPreviewImageModal(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl p-2 cursor-default"
            >
              <button
                type="button"
                onClick={() => setPreviewImageModal(null)}
                className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 cursor-pointer transition-all"
                title="Close Preview"
              >
                <X className="size-5" />
              </button>
              <img
                src={previewImageModal}
                alt="Enlarged Pre Costing Preview"
                className="max-h-[85vh] w-auto max-w-full object-contain mx-auto rounded-xl"
              />
            </div>
          </div>
        )}
      </div>
  );
}

export default PreCostingManager;
