import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  FileText,
  Save,
  Send,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  Printer,
  Sparkles,
  Info,
  Check,
  ChevronRight,
  Eye,
  Scissors,
  FileSpreadsheet,
  Layers,
  HelpCircle,
  Maximize2,
  Download,
  Upload,
  X,
  DollarSign,
  Percent,
  TrendingUp,
  TrendingDown,
  Calculator,
  RefreshCw,
  Copy,
  Building2,
  Shirt,
  Calendar,
  Tag,
  Palette,
  Activity,
  Droplets,
  Sliders,
  ShieldCheck,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import {
  MM_BUYERS_MASTER,
  MM_MERCHANTS_MASTER,
  MMRepository,
  MMSeasonMasterItem,
} from "../../lib/marketing-merchandising-data";
import {
  MMMasterDataRepository,
  MMFabricSetupRecord,
  MMAccessoriesSetupRecord,
  MMAopProcessRateRecord,
  MMKnittingRate,
  MMDyeingRate,
  MMYarnCount,
  MMYarnRateWeeklyRecord,
  MMColorRecord,
} from "../../lib/merchandising-master-data";
import { SearchableSelect } from "../ui/searchable-select";

// ── Models & Types ──────────────────────────────────────────────────────────

export interface GarmentCostRow {
  id: string;
  particulars: string;
  usedIn: string;
  consumption: number; // For accessories/embellishment/washing/other: Dozen basis
  unit: string;
  rate: number; // in USD
  cost: number; // Cons × Rate
  head?: "Sewing Trims" | "Finishing Trims" | "Fabric" | "Embellishment" | "Wash" | "Other";
}

export interface FabricationEntry {
  id: string;
  fabricName: string;
}

export interface ColorEntry {
  id: string;
  colorName: string;
}

export interface AopProcessEntry {
  id: string;
  aopType: string;
  cost: number; // COST (USD)
}

export interface YarnPriceRow {
  id: string;
  yarnItem: string;
  rate: number; // $/kg
  ratio: number; // %
  cost: number; // Rate × Ratio / 100
}

export interface KnittingChargeRow {
  id: string;
  processName: string;
  colorType?: string;
  feederType?: string;
  rate: number; // $/kg
}

export interface DyeingFinishingRow {
  id: string;
  processName: string;
  rate: number; // $/kg
}

export interface BuyerCostingRecordData {
  id: string;
  costingNo: string;
  date: string;
  buyer: string;
  department: string;
  season: string;
  styleName: string;
  styleDescription: string;
  shipmentDate: string;
  sizeRange: string;
  fabrications?: FabricationEntry[];
  fabrication1: string;
  fabrication2: string;
  actualFabricConsumptionCad: number;
  consumptionCuttingWastage: number;
  cuttingWastagePct: number;
  // Right-side Style & Order Information
  styleImage: string | null;
  colors?: ColorEntry[];
  color1: string;
  color2: string;
  garmentQuantity: number;
  buyerTargetFob: number;
  // Tables
  fabricCosts: GarmentCostRow[];
  accessoriesCosts: GarmentCostRow[];
  embellishmentCosts: GarmentCostRow[];
  washingCosts: GarmentCostRow[];
  otherCosts: GarmentCostRow[];
  // Fabric Price Calculation
  yarnRows: YarnPriceRow[];
  knittingRows: KnittingChargeRow[];
  dyeingFinishingRows: DyeingFinishingRow[];
  fabricProcessLossPct: number;
  aopApplicable: boolean;
  aopType: string;
  aopRate: number;
  aopProcesses?: AopProcessEntry[];
  aopProcessLossPct: number;
  aopProcessLossAmount?: number;
  finalFabricPricePerKg?: number;
  // Production
  cmPerDozen: number;
  workingMinutesPerDay: number;
  efficiencyPct: number;
  smv: number;
  availableProductionDays: number;
  // Final Pricing Configuration
  gmtWastagePct: number;
  bankDeferredCostPct: number;
  commercialCostPct: number;
  profitPct: number;
  // Status
  status: "Draft" | "Pending Approval" | "Approved" | "Rejected";
  createdDate: string;
  updatedDate: string;
}

export interface BuyerCostingSheetFormProps {
  initialRecordId?: string;
  initialMode?: "create" | "edit" | "view";
  onBackToList: () => void;
  onSaved?: (recordId: string) => void;
}

// ── Default Seed Rows ────────────────────────────────────────────────────────

const INITIAL_FABRIC_ROWS: GarmentCostRow[] = [
  { id: "fab-1", particulars: "MAIN FABRIC", usedIn: "Shell", consumption: 10.5, unit: "KG", rate: 120.038, cost: 1260.402, head: "Fabric" },
  { id: "fab-2", particulars: "SECONDARY FABRIC", usedIn: "Secondary", consumption: 10.5, unit: "KG", rate: 4.0, cost: 42.0, head: "Fabric" },
  { id: "fab-3", particulars: "THIRD FABRIC", usedIn: "Collar", consumption: 4.0, unit: "KG", rate: 4.0, cost: 16.0, head: "Fabric" },
  { id: "fab-4", particulars: "RIB FABRIC", usedIn: "Rib", consumption: 10.5, unit: "KG", rate: 2.0, cost: 21.0, head: "Fabric" },
];

const INITIAL_ACCESSORIES_ROWS: GarmentCostRow[] = [
  { id: "acc-1", particulars: "Basic Accessories Cost", usedIn: "Main", consumption: 1, unit: "Dzn", rate: 38.0, cost: 38.0, head: "Sewing Trims" },
  { id: "acc-2", particulars: "Elastic", usedIn: "Waist", consumption: 1, unit: "Dzn", rate: 24.0, cost: 24.0, head: "Sewing Trims" },
  { id: "acc-3", particulars: "Eyelet", usedIn: "Hood/Pocket", consumption: 1, unit: "Dzn", rate: 38.0, cost: 38.0, head: "Sewing Trims" },
  { id: "acc-4", particulars: "Sewing Thread", usedIn: "All Seams", consumption: 1, unit: "Dzn", rate: 20.0, cost: 20.0, head: "Sewing Trims" },
  { id: "acc-5", particulars: "Baggage Tag", usedIn: "Packaging", consumption: 1, unit: "Dzn", rate: 28.0, cost: 28.0, head: "Finishing Trims" },
  { id: "acc-6", particulars: "Care Label, Main Label, Size Label", usedIn: "Inside Neck", consumption: 1, unit: "Dzn", rate: 24.0, cost: 24.0, head: "Sewing Trims" },
  { id: "acc-7", particulars: "Tagpin, Draw Cord", usedIn: "Hood/Waist", consumption: 1, unit: "Dzn", rate: 45.0, cost: 45.0, head: "Finishing Trims" },
  { id: "acc-8", particulars: "Hang Tag, Price Tag", usedIn: "Neck/Waist", consumption: 1, unit: "Dzn", rate: 60.0, cost: 60.0, head: "Finishing Trims" },
  { id: "acc-9", particulars: "Poly, Blister Poly", usedIn: "Individual Pack", consumption: 1, unit: "Dzn", rate: 72.0, cost: 72.0, head: "Finishing Trims" },
  { id: "acc-10", particulars: "Master Carton Top/Bottom", usedIn: "Bulk Carton", consumption: 1, unit: "Dzn", rate: 35.0, cost: 35.0, head: "Finishing Trims" },
  { id: "acc-11", particulars: "Lace", usedIn: "Decoration", consumption: 1, unit: "Dzn", rate: 24.0, cost: 24.0, head: "Sewing Trims" },
  { id: "acc-12", particulars: "All Item", usedIn: "Assorted", consumption: 1, unit: "Dzn", rate: 24.0, cost: 24.0, head: "Sewing Trims" },
];

const INITIAL_EMBELLISHMENT_ROWS: GarmentCostRow[] = [
  { id: "emb-1", particulars: "Print (HD)", usedIn: "Front Chest", consumption: 1, unit: "Dzn", rate: 28.0, cost: 28.0, head: "Embellishment" },
  { id: "emb-2", particulars: "Embroidery", usedIn: "Left Sleeve", consumption: 1, unit: "Dzn", rate: 48.0, cost: 48.0, head: "Embellishment" },
  { id: "emb-3", particulars: "Sequins", usedIn: "Front Body", consumption: 1, unit: "Dzn", rate: 24.0, cost: 24.0, head: "Embellishment" },
  { id: "emb-4", particulars: "Applique", usedIn: "Chest Graphic", consumption: 1, unit: "Dzn", rate: 24.0, cost: 24.0, head: "Embellishment" },
  { id: "emb-5", particulars: "3D Attachment", usedIn: "Badge", consumption: 1, unit: "Dzn", rate: 60.0, cost: 60.0, head: "Embellishment" },
];

const INITIAL_WASHING_ROWS: GarmentCostRow[] = [
  { id: "wsh-1", particulars: "Pigment Dye", usedIn: "Garment", consumption: 1, unit: "Dzn", rate: 24.0, cost: 24.0, head: "Wash" },
  { id: "wsh-2", particulars: "Acid Wash", usedIn: "Garment", consumption: 1, unit: "Dzn", rate: 38.0, cost: 38.0, head: "Wash" },
  { id: "wsh-3", particulars: "Garment Wash", usedIn: "Garment", consumption: 1, unit: "Dzn", rate: 24.0, cost: 24.0, head: "Wash" },
];

const INITIAL_OTHER_ROWS: GarmentCostRow[] = [
  { id: "oth-1", particulars: "Lab Test", usedIn: "Inspection", consumption: 1, unit: "Dzn", rate: 24.0, cost: 24.0, head: "Other" },
  { id: "oth-2", particulars: "Inspection Charge", usedIn: "QA Verification", consumption: 1, unit: "Dzn", rate: 35.0, cost: 35.0, head: "Other" },
  { id: "oth-3", particulars: "Financing Cost", usedIn: "Bank Charges", consumption: 1, unit: "Dzn", rate: 24.0, cost: 24.0, head: "Other" },
  { id: "oth-4", particulars: "Commission", usedIn: "Agent", consumption: 1, unit: "Dzn", rate: 24.0, cost: 24.0, head: "Other" },
];

const INITIAL_YARN_ROWS: YarnPriceRow[] = [
  { id: "yrn-1", yarnItem: "34/1 Cotton", rate: 2.0, ratio: 4, cost: 0.08 },
  { id: "yrn-2", yarnItem: "20/1 Cotton", rate: 4.0, ratio: 3, cost: 0.12 },
];

const INITIAL_KNITTING_ROWS: KnittingChargeRow[] = [
  { id: "knt-1", processName: "LYCRA SINGLE JERSEY", rate: 4.0 },
];

const INITIAL_DYEING_ROWS: DyeingFinishingRow[] = [
  { id: "dye-1", processName: "AVG Color Dyeing", rate: 0.0 },
  { id: "dye-2", processName: "YARN DYEING", rate: 4.0 },
  { id: "dye-3", processName: "HEAT SET", rate: 2.0 },
  { id: "dye-4", processName: "BRUSHING", rate: 2.0 },
  { id: "dye-5", processName: "SUEDING", rate: 3.0 },
  { id: "dye-6", processName: "Normal Wash", rate: 3.0 },
  { id: "dye-7", processName: "Tumble Dryer", rate: 4.0 },
];

// Storage keys
const STORAGE_KEY_MASTER = "cripton_buyer_quotations_master_v1";
const STORAGE_KEY_ACTIVE_ID = "cripton_buyer_quotations_active_id_v1";

export function BuyerCostingSheetForm({
  initialRecordId,
  initialMode = "create",
  onBackToList,
  onSaved,
}: BuyerCostingSheetFormProps) {
  const [mode, setMode] = useState<"create" | "edit" | "view">(initialMode);
  const [recordId, setRecordId] = useState<string>(initialRecordId || `bcost-${Date.now()}`);

  // ── Header State ──────────────────────────────────────────────────────────
  const [costingNo, setCostingNo] = useState<string>("BCOST-2026-0001");
  const [date, setDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [buyer, setBuyer] = useState<string>("A Fish Named Fred");
  const [department, setDepartment] = useState<string>("Men's Long sleeve");
  const [season, setSeason] = useState<string>("S23 Winter");
  const [styleName, setStyleName] = useState<string>("Skinny");
  const [styleDescription, setStyleDescription] = useState<string>("tee");
  const [shipmentDate, setShipmentDate] = useState<string>("2027-03-20");
  const [sizeRange, setSizeRange] = useState<string>("S, M, L, XL, XXL");
  const [fabrications, setFabrications] = useState<FabricationEntry[]>([
    { id: "fab-1", fabricName: "100% Cotton" },
  ]);
  const [actualFabricConsumptionCad, setActualFabricConsumptionCad] = useState<number>(10.0);
  const [consumptionCuttingWastage, setConsumptionCuttingWastage] = useState<number>(10.8);
  const [cuttingWastagePct, setCuttingWastagePct] = useState<number>(5.0);

  // Right-side Header: Style Image & Commercials
  const [styleImage, setStyleImage] = useState<string | null>(null);
  const [colors, setColors] = useState<ColorEntry[]>([
    { id: "col-1", colorName: "White" },
  ]);
  const [garmentQuantity, setGarmentQuantity] = useState<number>(200000);
  const [buyerTargetFob, setBuyerTargetFob] = useState<number>(900000.0);
  const [status, setStatus] = useState<"Draft" | "Pending Approval" | "Approved" | "Rejected">("Draft");

  // Dynamic Fabrication handlers
  const handleAddFabrication = () => {
    setFabrications((prev) => [
      ...prev,
      { id: `fab-${Date.now()}-${prev.length + 1}`, fabricName: "" },
    ]);
  };

  const handleUpdateFabrication = (index: number, val: string) => {
    setFabrications((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], fabricName: val };
      return copy;
    });
  };

  const handleRemoveFabrication = (index: number) => {
    setFabrications((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  // Dynamic Color handlers
  const handleAddColor = () => {
    setColors((prev) => [
      ...prev,
      { id: `col-${Date.now()}-${prev.length + 1}`, colorName: "" },
    ]);
  };

  const handleUpdateColor = (index: number, val: string) => {
    setColors((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], colorName: val };
      return copy;
    });
  };

  const handleRemoveColor = (index: number) => {
    setColors((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  // ── Garment Cost Breakdown Tables State ────────────────────────────────────
  const [fabricCosts, setFabricCosts] = useState<GarmentCostRow[]>(INITIAL_FABRIC_ROWS);
  const [accessoriesCosts, setAccessoriesCosts] = useState<GarmentCostRow[]>(INITIAL_ACCESSORIES_ROWS);
  const [embellishmentCosts, setEmbellishmentCosts] = useState<GarmentCostRow[]>(INITIAL_EMBELLISHMENT_ROWS);
  const [washingCosts, setWashingCosts] = useState<GarmentCostRow[]>(INITIAL_WASHING_ROWS);
  const [otherCosts, setOtherCosts] = useState<GarmentCostRow[]>(INITIAL_OTHER_ROWS);

  // ── Fabric Price Calculation State (Right Panel) ──────────────────────────
  const [yarnRows, setYarnRows] = useState<YarnPriceRow[]>(INITIAL_YARN_ROWS);
  const [knittingRows, setKnittingRows] = useState<KnittingChargeRow[]>(INITIAL_KNITTING_ROWS);
  const [dyeingFinishingRows, setDyeingFinishingRows] = useState<DyeingFinishingRow[]>(INITIAL_DYEING_ROWS);
  const [fabricProcessLossPct, setFabricProcessLossPct] = useState<number>(5.0); // default in screenshot: 5% (or 2%)
  const [aopApplicable, setAopApplicable] = useState<boolean>(true);
  const [aopProcesses, setAopProcesses] = useState<AopProcessEntry[]>([
    { id: "aop-1", aopType: "Pigment AOP", cost: 92.0 },
  ]);
  const [aopProcessLossPct, setAopProcessLossPct] = useState<number>(5.0);

  const handleAddAopProcess = () => {
    setAopProcesses((prev) => [
      ...prev,
      { id: `aop-${Date.now()}-${prev.length + 1}`, aopType: "AOP Process", cost: 0 },
    ]);
  };

  const handleUpdateAopProcess = (index: number, field: keyof AopProcessEntry, val: any) => {
    setAopProcesses((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleRemoveAopProcess = (index: number) => {
    setAopProcesses((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  // ── Production & Machine Income Calculation State ──────────────────────────
  const [cmPerDozen, setCmPerDozen] = useState<number>(5.0);
  const [workingMinutesPerDay, setWorkingMinutesPerDay] = useState<number>(480);
  const [efficiencyPct, setEfficiencyPct] = useState<number>(60);
  const [smv, setSmv] = useState<number>(15);
  const [availableProductionDays, setAvailableProductionDays] = useState<number>(25);

  // ── Final Pricing Summary State ───────────────────────────────────────────
  const [gmtWastagePct, setGmtWastagePct] = useState<number>(2.0);
  const [bankDeferredCostPct, setBankDeferredCostPct] = useState<number>(3.0);
  const [commercialCostPct, setCommercialCostPct] = useState<number>(5.0);
  const [profitPct, setProfitPct] = useState<number>(2.0); // 2% in screenshot

  // Preview Image Modal
  const [previewZoom, setPreviewZoom] = useState<string | null>(null);

  // ── Master Data Sources ───────────────────────────────────────────────────
  const buyerOptions = useMemo(() => {
    return MM_BUYERS_MASTER.map((b) => ({ value: b.name, label: `${b.name} (${b.country})` }));
  }, []);

  const currentBuyerObj = useMemo(() => {
    return MM_BUYERS_MASTER.find((b) => b.name === buyer);
  }, [buyer]);

  const departmentOptions = useMemo(() => {
    if (!currentBuyerObj) return [];
    return currentBuyerObj.departments.map((d) => ({ value: d.name, label: `${d.name} (${d.code})` }));
  }, [currentBuyerObj]);

  const seasonOptions = useMemo(() => {
    try {
      const allSeasons = MMRepository.getSeasons();
      if (allSeasons.length > 0) {
        return allSeasons.map((s) => ({ value: s.seasonName, label: s.seasonName }));
      }
    } catch {}
    return ["S23 Winter", "S24 Summer", "Spring 2026", "Autumn 2026", "Fall 2026"].map((s) => ({ value: s, label: s }));
  }, []);

  const styleOptions = useMemo(() => {
    if (!currentBuyerObj) return [];
    return currentBuyerObj.styles.map((s) => ({ value: s.styleNo, label: `${s.styleNo} — ${s.description}` }));
  }, [currentBuyerObj]);

  // Dynamic Size Range Options from Buyer Master & Buyer Department Master
  const sizeRangeOptions = useMemo(() => {
    const optsSet = new Set<string>();

    // 1. Check MMMasterDataRepository Buyer Master & Department Master
    try {
      const mmBuyers = MMMasterDataRepository.getBuyers();
      const matchedMmBuyer = mmBuyers.find(
        (b) =>
          b.buyerName?.toLowerCase() === buyer?.toLowerCase() ||
          b.id === buyer ||
          b.code?.toLowerCase() === buyer?.toLowerCase()
      );
      if (matchedMmBuyer) {
        // Buyer-wide GMT sizes
        if (Array.isArray(matchedMmBuyer.buyerSizes) && matchedMmBuyer.buyerSizes.length > 0) {
          matchedMmBuyer.buyerSizes.forEach((s) => s && optsSet.add(s.trim()));
          if (matchedMmBuyer.buyerSizes.length > 1) {
            optsSet.add(matchedMmBuyer.buyerSizes.join(", "));
            optsSet.add(matchedMmBuyer.buyerSizes.join(" - "));
          }
        }
        // Selected department sizes
        if (Array.isArray(matchedMmBuyer.departments)) {
          const matchedDept = matchedMmBuyer.departments.find(
            (d) =>
              d.departmentName?.toLowerCase() === department?.toLowerCase() ||
              d.id === department
          );
          if (matchedDept && Array.isArray(matchedDept.sizes) && matchedDept.sizes.length > 0) {
            matchedDept.sizes.forEach((s) => s && optsSet.add(s.trim()));
            if (matchedDept.sizes.length > 1) {
              optsSet.add(matchedDept.sizes.join(", "));
              optsSet.add(matchedDept.sizes.join(" - "));
            }
          }
          // Also include other department size ranges for flexibility
          matchedMmBuyer.departments.forEach((d) => {
            if (Array.isArray(d.sizes) && d.sizes.length > 0) {
              optsSet.add(`${d.departmentName}: ${d.sizes.join(", ")}`);
            }
          });
        }
      }
    } catch (e) {
      console.error("Error reading sizes from MMMasterDataRepository:", e);
    }

    // 2. Check MM_BUYERS_MASTER
    try {
      const bObj = MM_BUYERS_MASTER.find(
        (b) =>
          b.name?.toLowerCase() === buyer?.toLowerCase() ||
          b.id === buyer ||
          b.buyerName?.toLowerCase() === buyer?.toLowerCase()
      );
      if (bObj) {
        if (Array.isArray(bObj.sizeRanges)) {
          bObj.sizeRanges.forEach((sr) => sr && optsSet.add(sr.trim()));
        }
        if (Array.isArray(bObj.configuredSizes) && bObj.configuredSizes.length > 0) {
          bObj.configuredSizes.forEach((cs) => cs && optsSet.add(cs.trim()));
          if (bObj.configuredSizes.length > 1) {
            optsSet.add(bObj.configuredSizes.join(", "));
            optsSet.add(bObj.configuredSizes.join(" - "));
          }
        }
      }
    } catch {}

    // Fallbacks if nothing configured yet for the selected buyer
    if (optsSet.size === 0) {
      [
        "S, M, L, XL, XXL",
        "XS, S, M, L, XL",
        "S - M - L - XL",
        "XS TO XXL",
        "28, 30, 32, 34, 36, 38",
        "12345678",
      ].forEach((s) => optsSet.add(s));
    }

    return Array.from(optsSet).map((s) => ({ value: s, label: s }));
  }, [buyer, department]);

  const colorOptions = useMemo(() => {
    try {
      const colors = MMMasterDataRepository.getColors();
      return colors.map((c) => ({ value: c.name, label: c.name }));
    } catch {
      return ["White", "Black", "Navy", "Heather Grey", "Olive", "Red"].map((c) => ({ value: c, label: c }));
    }
  }, []);

  const fabricRegisterOptions = useMemo(() => {
    try {
      const setups = MMMasterDataRepository.getFabricSetups();
      return setups.map((f) => ({
        value: f.fabricName,
        label: `${f.fabricName}${f.fabricComposition ? ` (${f.fabricComposition})` : ""}`,
      }));
    } catch {
      return ["100% Cotton", "100% Polyester", "95% Cotton 5% Spandex"].map((f) => ({ value: f, label: f }));
    }
  }, []);

  const accessoriesMasterOptions = useMemo(() => {
    try {
      const acc = MMMasterDataRepository.getAccessoriesSetups();
      return acc.map((a) => ({ value: a.accessoriesName, label: `${a.accessoriesName} [${a.head}]` }));
    } catch {
      return [];
    }
  }, []);

  const yarnMasterOptions = useMemo(() => {
    try {
      const weekly = MMMasterDataRepository.getYarnRates();
      if (weekly.length > 0) {
        const flatEntries = weekly.flatMap((w) => w.entries || []);
        if (flatEntries.length > 0) {
          return flatEntries.map((y) => ({
            value: `${y.count} ${y.composition}`,
            label: `${y.count} ${y.composition} — $${y.rate.toFixed(2)}/kg`,
          }));
        }
      }
      const counts = MMMasterDataRepository.getYarnCounts();
      if (counts && counts.length > 0) {
        return counts.map((c) => ({ value: `${c.yarnCount} Cotton`, label: `${c.yarnCount} Cotton` }));
      }
    } catch {}
    return ["34/1 Cotton", "20/1 Cotton", "30/1 Cotton", "26/1 Cotton", "40/1 Cotton"].map((y) => ({ value: y, label: y }));
  }, []);

  // ── Dependencies On Buyer Selection ───────────────────────────────────────
  const handleBuyerChange = (newBuyer: string) => {
    setBuyer(newBuyer);
    const b = MM_BUYERS_MASTER.find((item) => item.name === newBuyer);
    if (b) {
      if (b.departments.length > 0) setDepartment(b.departments[0].name);
      if (b.styles.length > 0) {
        setStyleName(b.styles[0].styleNo);
        setStyleDescription(b.styles[0].description || "");
      }
    }
  };

  const handleStyleChange = (newStyleNo: string) => {
    setStyleName(newStyleNo);
    if (currentBuyerObj) {
      const match = currentBuyerObj.styles.find((s) => s.styleNo === newStyleNo);
      if (match) {
        setStyleDescription(match.description || "");
      }
    }
  };

  // ── Restore or Initialize Record on Mount ─────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY_MASTER);
      if (stored) {
        const list: any[] = JSON.parse(stored);
        const match = list.find((r) => r.id === initialRecordId || r.preCostId === initialRecordId || r.costingNo === initialRecordId);
        if (match) {
          if (match.buyerCostingData) {
            loadFromSavedData(match.buyerCostingData);
          } else {
            // Populate from top-level fields
            setRecordId(match.id);
            setCostingNo(match.preCostNo || match.preCostId || match.costingNo || "BCOST-2026-0001");
            if (match.buyer) setBuyer(match.buyer);
            if (match.department) setDepartment(match.department);
            if (match.season) setSeason(match.season);
            if (match.styleNo || match.styleName) setStyleName(match.styleNo || match.styleName);
            if (match.styleDescription) setStyleDescription(match.styleDescription);
            if (match.date) setDate(match.date);
            if (match.status) setStatus(match.status);
            if (match.sizeRange) setSizeRange(match.sizeRange);
            if (Array.isArray(match.fabrications) && match.fabrications.length > 0) {
              setFabrications(match.fabrications.map((f: any, i: number) => typeof f === "string" ? { id: `fab-${i+1}`, fabricName: f } : f));
            }
            if (Array.isArray(match.colors) && match.colors.length > 0) {
              setColors(match.colors.map((c: any, i: number) => typeof c === "string" ? { id: `col-${i+1}`, colorName: c } : c));
            }
            if (Array.isArray(match.poRows) && match.poRows[0]) {
              setGarmentQuantity(Number(match.poRows[0].poQuantity) || 200000);
            }
          }
          return;
        }
      }

      // Generate a new Costing No. if creating brand new
      if (!initialRecordId || initialMode === "create") {
        const list: any[] = stored ? JSON.parse(stored) : [];
        const nextIdx = list.length + 1;
        setCostingNo(`BCOST-2026-${String(nextIdx).padStart(4, "0")}`);
      }
    } catch (err) {
      console.warn("Could not load stored buyer quotation data:", err);
    }
  }, [initialRecordId]);

  const loadFromSavedData = (data: BuyerCostingRecordData) => {
    setRecordId(data.id);
    setCostingNo(data.costingNo || "BCOST-2026-0001");
    setDate(data.date || new Date().toISOString().substring(0, 10));
    setBuyer(data.buyer || "A Fish Named Fred");
    setDepartment(data.department || "");
    setSeason(data.season || "");
    setStyleName(data.styleName || "");
    setStyleDescription(data.styleDescription || "");
    setShipmentDate(data.shipmentDate || "");
    setSizeRange(data.sizeRange || "S, M, L, XL, XXL");

    if (Array.isArray(data.fabrications) && data.fabrications.length > 0) {
      setFabrications(data.fabrications);
    } else if (data.fabrication1) {
      const initFabs: FabricationEntry[] = [{ id: "fab-1", fabricName: data.fabrication1 }];
      if (data.fabrication2) initFabs.push({ id: "fab-2", fabricName: data.fabrication2 });
      setFabrications(initFabs);
    }

    setActualFabricConsumptionCad(Number(data.actualFabricConsumptionCad) || 0);
    setConsumptionCuttingWastage(Number(data.consumptionCuttingWastage) || 0);
    setCuttingWastagePct(Number(data.cuttingWastagePct) || 5);
    setStyleImage(data.styleImage || null);

    if (Array.isArray(data.colors) && data.colors.length > 0) {
      setColors(data.colors);
    } else if (data.color1) {
      const initCols: ColorEntry[] = [{ id: "col-1", colorName: data.color1 }];
      if (data.color2) initCols.push({ id: "col-2", colorName: data.color2 });
      setColors(initCols);
    }

    setGarmentQuantity(Number(data.garmentQuantity) || 0);
    setBuyerTargetFob(Number(data.buyerTargetFob) || 0);
    setStatus(data.status || "Draft");

    if (Array.isArray(data.fabricCosts) && data.fabricCosts.length > 0) setFabricCosts(data.fabricCosts);
    if (Array.isArray(data.accessoriesCosts) && data.accessoriesCosts.length > 0) setAccessoriesCosts(data.accessoriesCosts);
    if (Array.isArray(data.embellishmentCosts) && data.embellishmentCosts.length > 0) setEmbellishmentCosts(data.embellishmentCosts);
    if (Array.isArray(data.washingCosts) && data.washingCosts.length > 0) setWashingCosts(data.washingCosts);
    if (Array.isArray(data.otherCosts) && data.otherCosts.length > 0) setOtherCosts(data.otherCosts);

    if (Array.isArray(data.yarnRows) && data.yarnRows.length > 0) setYarnRows(data.yarnRows);
    if (Array.isArray(data.knittingRows) && data.knittingRows.length > 0) setKnittingRows(data.knittingRows);
    if (Array.isArray(data.dyeingFinishingRows) && data.dyeingFinishingRows.length > 0) setDyeingFinishingRows(data.dyeingFinishingRows);

    setFabricProcessLossPct(Number(data.fabricProcessLossPct) ?? 5);
    setAopApplicable(Boolean(data.aopApplicable));
    if (Array.isArray(data.aopProcesses) && data.aopProcesses.length > 0) {
      setAopProcesses(data.aopProcesses);
    } else if (data.aopType || data.aopRate) {
      setAopProcesses([
        { id: "aop-1", aopType: data.aopType || "Pigment AOP", cost: Number(data.aopRate) || 92.0 },
      ]);
    }
    setAopProcessLossPct(Number(data.aopProcessLossPct) ?? 5);

    setCmPerDozen(Number(data.cmPerDozen) || 5);
    setWorkingMinutesPerDay(Number(data.workingMinutesPerDay) || 480);
    setEfficiencyPct(Number(data.efficiencyPct) || 60);
    setSmv(Number(data.smv) || 15);
    setAvailableProductionDays(Number(data.availableProductionDays) || 25);

    setGmtWastagePct(Number(data.gmtWastagePct) ?? 2);
    setBankDeferredCostPct(Number(data.bankDeferredCostPct) ?? 3);
    setCommercialCostPct(Number(data.commercialCostPct) ?? 5);
    setProfitPct(Number(data.profitPct) ?? 2);
  };

  // ── Image Upload Handling with Compression ────────────────────────────────
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 800;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          setStyleImage(canvas.toDataURL("image/jpeg", 0.8));
          toast.success("Style sketch/photo uploaded successfully.");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // ── Dynamic Row Handlers (Garment Breakdown) ──────────────────────────────
  const handleUpdateRow = (
    setter: React.Dispatch<React.SetStateAction<GarmentCostRow[]>>,
    index: number,
    field: keyof GarmentCostRow,
    value: any
  ) => {
    setter((prev) => {
      const copy = [...prev];
      const target = { ...copy[index], [field]: value };
      if (field === "consumption" || field === "rate") {
        const cons = field === "consumption" ? Number(value) || 0 : Number(target.consumption) || 0;
        const rate = field === "rate" ? Number(value) || 0 : Number(target.rate) || 0;
        target.cost = Number((cons * rate).toFixed(3));
      }
      copy[index] = target;
      return copy;
    });
  };

  // Used In handler for Fabric Cost table (auto-populates consumption from Consumption with Cutting Wastage)
  const handleUsedInChange = (index: number, val: string) => {
    setFabricCosts((prev) => {
      const copy = [...prev];
      const target = { ...copy[index], usedIn: val };
      if (val.trim() !== "" && consumptionCuttingWastage > 0) {
        target.consumption = consumptionCuttingWastage;
        target.cost = Number((consumptionCuttingWastage * target.rate).toFixed(3));
      }
      copy[index] = target;
      return copy;
    });
  };

  const handleAddRow = (
    setter: React.Dispatch<React.SetStateAction<GarmentCostRow[]>>,
    defaultName: string,
    defaultUnit: string = "Dzn",
    defaultHead?: GarmentCostRow["head"]
  ) => {
    setter((prev) => [
      ...prev,
      {
        id: `row-${Date.now()}-${prev.length + 1}`,
        particulars: defaultName,
        usedIn: "General",
        consumption: 1,
        unit: defaultUnit,
        rate: 0,
        cost: 0,
        head: defaultHead,
      },
    ]);
  };

  const handleRemoveRow = (
    setter: React.Dispatch<React.SetStateAction<GarmentCostRow[]>>,
    index: number
  ) => {
    setter((prev) => {
      if (prev.length <= 1) {
        toast.error("At least one row is required.");
        return prev;
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  // ── Subtotal Calculations (Section 2) ─────────────────────────────────────
  const totalFabricCost = useMemo(() => {
    return fabricCosts.reduce((s, r) => s + (Number(r.cost) || 0), 0);
  }, [fabricCosts]);

  const totalAccessoriesCost = useMemo(() => {
    return accessoriesCosts.reduce((s, r) => s + (Number(r.cost) || 0), 0);
  }, [accessoriesCosts]);

  const totalEmbellishmentCost = useMemo(() => {
    return embellishmentCosts.reduce((s, r) => s + (Number(r.cost) || 0), 0);
  }, [embellishmentCosts]);

  const totalWashingCost = useMemo(() => {
    return washingCosts.reduce((s, r) => s + (Number(r.cost) || 0), 0);
  }, [washingCosts]);

  const totalOtherCost = useMemo(() => {
    return otherCosts.reduce((s, r) => s + (Number(r.cost) || 0), 0);
  }, [otherCosts]);

  // ── Fabric Price Calculation (Section 3) ──────────────────────────────────
  const totalYarnCost = useMemo(() => {
    return yarnRows.reduce((s, y) => s + (Number(y.cost) || 0), 0);
  }, [yarnRows]);

  const totalKnittingCost = useMemo(() => {
    return knittingRows.reduce((s, k) => s + (Number(k.rate) || 0), 0);
  }, [knittingRows]);

  const totalDyeingFinishingCost = useMemo(() => {
    return dyeingFinishingRows.reduce((s, d) => s + (Number(d.rate) || 0), 0);
  }, [dyeingFinishingRows]);

  const fabricSubtotal = useMemo(() => {
    return Number((totalYarnCost + totalKnittingCost + totalDyeingFinishingCost).toFixed(3));
  }, [totalYarnCost, totalKnittingCost, totalDyeingFinishingCost]);

  const fabricProcessLossAmount = useMemo(() => {
    return Number(((fabricSubtotal * fabricProcessLossPct) / 100).toFixed(3));
  }, [fabricSubtotal, fabricProcessLossPct]);

  const fabricPricePerKg = useMemo(() => {
    return Number((fabricSubtotal + fabricProcessLossAmount).toFixed(3));
  }, [fabricSubtotal, fabricProcessLossAmount]);

  // Total AOP Process Cost (USD)
  const totalAopCost = useMemo(() => {
    if (!aopApplicable) return 0;
    return Number(aopProcesses.reduce((s, p) => s + (Number(p.cost) || 0), 0).toFixed(3));
  }, [aopApplicable, aopProcesses]);

  // AOP Process Loss Amount = (FABRIC PRICE PER KG + Total AOP Cost) × AOP PROCESS LOSS (%) / 100
  const aopProcessLossAmount = useMemo(() => {
    if (!aopApplicable) return 0;
    return Number((((fabricPricePerKg + totalAopCost) * aopProcessLossPct) / 100).toFixed(3));
  }, [aopApplicable, fabricPricePerKg, totalAopCost, aopProcessLossPct]);

  // Final Fabric Price Per KG
  const finalFabricPricePerKg = useMemo(() => {
    if (!aopApplicable) return fabricPricePerKg;
    return Number((fabricPricePerKg + totalAopCost + aopProcessLossAmount).toFixed(3));
  }, [aopApplicable, fabricPricePerKg, totalAopCost, aopProcessLossAmount]);

  // Automatically keep MAIN FABRIC row Rate in sync with finalFabricPricePerKg
  useEffect(() => {
    if (finalFabricPricePerKg > 0) {
      setFabricCosts((prev) => {
        const copy = [...prev];
        const mainIdx = copy.findIndex(
          (r, i) => i === 0 || r.particulars.trim().toUpperCase() === "MAIN FABRIC"
        );
        if (mainIdx >= 0 && copy[mainIdx].rate !== finalFabricPricePerKg) {
          copy[mainIdx] = {
            ...copy[mainIdx],
            rate: finalFabricPricePerKg,
            cost: Number((copy[mainIdx].consumption * finalFabricPricePerKg).toFixed(3)),
          };
          return copy;
        }
        return prev;
      });
    }
  }, [finalFabricPricePerKg]);

  // Handler to apply the calculated Fabric Price to Main Fabric in Cost Breakdown
  const handleApplyCalculatedFabricPrice = () => {
    setFabricCosts((prev) => {
      const copy = [...prev];
      if (copy[0]) {
        copy[0] = {
          ...copy[0],
          rate: finalFabricPricePerKg,
          cost: Number((copy[0].consumption * finalFabricPricePerKg).toFixed(3)),
        };
      }
      return copy;
    });
    toast.success(`Applied calculated fabric price ($${finalFabricPricePerKg.toFixed(3)}/kg) to Main Fabric.`);
  };

  // ── Production & Machine Income Calculation (Section 4) ───────────────────
  // Productivity Per Day Per Machine = (Working Minutes Per Day × Efficiency %) / SMV
  const productivityPerDayPerMachine = useMemo(() => {
    if (smv <= 0) return 0;
    return Number(((workingMinutesPerDay * (efficiencyPct / 100)) / smv).toFixed(2));
  }, [workingMinutesPerDay, efficiencyPct, smv]);

  // No. of Machine Required = Total Order Quantity / (Productivity Per Day Per Machine × Available Production Days)
  const machinesRequired = useMemo(() => {
    const denom = productivityPerDayPerMachine * availableProductionDays;
    if (denom <= 0) return 0;
    return Math.ceil(garmentQuantity / denom);
  }, [garmentQuantity, productivityPerDayPerMachine, availableProductionDays]);

  // Machine Income Per Day = (Productivity Per Day Per Machine / 12) × CM Per Dozen
  const machineIncomePerDay = useMemo(() => {
    return Number(((productivityPerDayPerMachine / 12) * cmPerDozen).toFixed(2));
  }, [productivityPerDayPerMachine, cmPerDozen]);

  // Total Machine Income = Machine Income Per Day × Available Production Days × No. of Machine Required
  const totalMachineIncome = useMemo(() => {
    return Number((machineIncomePerDay * availableProductionDays * machinesRequired).toFixed(2));
  }, [machineIncomePerDay, availableProductionDays, machinesRequired]);

  // ── Final Costing & Pricing Summary (Section 5) ───────────────────────────
  // 5.1 Total Cost Per Dozen = Fabric + Acc + Emb + Wash + Other + CM
  const totalCostPerDozen = useMemo(() => {
    return Number(
      (
        totalFabricCost +
        totalAccessoriesCost +
        totalEmbellishmentCost +
        totalWashingCost +
        totalOtherCost +
        cmPerDozen
      ).toFixed(3)
    );
  }, [totalFabricCost, totalAccessoriesCost, totalEmbellishmentCost, totalWashingCost, totalOtherCost, cmPerDozen]);

  // 5.2 GMT Wastage Amount = Total Cost Per Dozen × Wastage (%) / 100
  const gmtWastageAmount = useMemo(() => {
    return Number(((totalCostPerDozen * gmtWastagePct) / 100).toFixed(3));
  }, [totalCostPerDozen, gmtWastagePct]);

  // 5.3 Sub Total Cost / Dozen = Total Cost Per Dozen + GMT Wastage Amount
  const subTotalCostPerDozen = useMemo(() => {
    return Number((totalCostPerDozen + gmtWastageAmount).toFixed(3));
  }, [totalCostPerDozen, gmtWastageAmount]);

  // 5.4 Bank Deferred Cost = Sub Total Cost / Dozen × Bank Deferred Cost (%) / 100
  const bankDeferredCostAmount = useMemo(() => {
    return Number(((subTotalCostPerDozen * bankDeferredCostPct) / 100).toFixed(3));
  }, [subTotalCostPerDozen, bankDeferredCostPct]);

  // 5.5 Commercial Cost = Sub Total Cost / Dozen × Commercial Cost (%) / 100 (Independent on Sub Total)
  const commercialCostAmount = useMemo(() => {
    return Number(((subTotalCostPerDozen * commercialCostPct) / 100).toFixed(3));
  }, [subTotalCostPerDozen, commercialCostPct]);

  // 5.6 Garment Price / Pcs = (Sub Total Cost / Dozen + Bank Deferred Cost + Commercial Cost) / 12
  const garmentPricePerPcs = useMemo(() => {
    return Number(
      ((subTotalCostPerDozen + bankDeferredCostAmount + commercialCostAmount) / 12).toFixed(3)
    );
  }, [subTotalCostPerDozen, bankDeferredCostAmount, commercialCostAmount]);

  // 5.7 Profit Amount = Garment Price / Pcs × Profit (%) / 100
  const profitAmount = useMemo(() => {
    return Number(((garmentPricePerPcs * profitPct) / 100).toFixed(3));
  }, [garmentPricePerPcs, profitPct]);

  // Final Price Per Pcs = Garment Price / Pcs + Profit Amount
  const finalPricePerPcs = useMemo(() => {
    return Number((garmentPricePerPcs + profitAmount).toFixed(3));
  }, [garmentPricePerPcs, profitAmount]);

  // Target Per Pcs (derived from Buyer's Target FOB / Garment Quantity if quantity > 0, or directly target FOB if under 100)
  const targetPerPcs = useMemo(() => {
    if (garmentQuantity > 0 && buyerTargetFob > 1000) {
      return Number((buyerTargetFob / garmentQuantity).toFixed(3));
    }
    return Number(buyerTargetFob.toFixed(3));
  }, [buyerTargetFob, garmentQuantity]);

  // Price GAP = Target Per Pcs − Price Per Pcs
  const priceGap = useMemo(() => {
    return Number((targetPerPcs - finalPricePerPcs).toFixed(3));
  }, [targetPerPcs, finalPricePerPcs]);

  // ── Transaction Persistence in Local Storage ──────────────────────────────
  const handleSaveQuotation = (saveAsStatus: "Draft" | "Pending Approval") => {
    if (!buyer.trim()) {
      toast.error("Please select a Buyer.");
      return;
    }
    if (!styleName.trim()) {
      toast.error("Please enter or select a Style Name.");
      return;
    }

    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const newStatus = saveAsStatus;

    const costingDataToSave: BuyerCostingRecordData = {
      id: recordId,
      costingNo,
      date,
      buyer,
      department,
      season,
      styleName,
      styleDescription,
      shipmentDate,
      sizeRange,
      fabrications,
      fabrication1: fabrications[0]?.fabricName || "",
      fabrication2: fabrications[1]?.fabricName || "",
      actualFabricConsumptionCad,
      consumptionCuttingWastage,
      cuttingWastagePct,
      styleImage,
      colors,
      color1: colors[0]?.colorName || "",
      color2: colors[1]?.colorName || "",
      garmentQuantity,
      buyerTargetFob,
      fabricCosts,
      accessoriesCosts,
      embellishmentCosts,
      washingCosts,
      otherCosts,
      yarnRows,
      knittingRows,
      dyeingFinishingRows,
      fabricProcessLossPct,
      aopApplicable,
      aopType: aopProcesses[0]?.aopType || "Pigment AOP",
      aopRate: aopProcesses[0]?.cost || 0,
      aopProcesses,
      aopProcessLossPct,
      aopProcessLossAmount,
      finalFabricPricePerKg,
      cmPerDozen,
      workingMinutesPerDay,
      efficiencyPct,
      smv,
      availableProductionDays,
      gmtWastagePct,
      bankDeferredCostPct,
      commercialCostPct,
      profitPct,
      status: newStatus,
      createdDate: date,
      updatedDate: now,
    };

    // Save into cripton_buyer_quotations_master_v1 format for full register compatibility
    try {
      const stored = localStorage.getItem(STORAGE_KEY_MASTER);
      let list: any[] = stored ? JSON.parse(stored) : [];

      // Build unified record
      const unifiedRecord: any = {
        id: recordId,
        preCostId: costingNo,
        preCostNo: costingNo,
        buyer,
        department,
        season,
        styleNo: styleName,
        styleDescription,
        currency: "USD",
        date,
        createdDate: date,
        status: newStatus,
        version: 1,
        isCurrentActive: true,
        fabrications: fabrications.map((f) => f.fabricName),
        colors: colors.map((c) => c.colorName),
        sizeRange,
        poRows: [
          {
            poNumber: "PO-BULK-01",
            poQuantity: garmentQuantity,
            unitRate: finalPricePerPcs,
            value: Number((garmentQuantity * finalPricePerPcs).toFixed(2)),
          },
        ],
        items: [
          { head: "Fabric", amount: Number((totalFabricCost * (garmentQuantity / 12)).toFixed(2)) },
          { head: "Accessories", amount: Number((totalAccessoriesCost * (garmentQuantity / 12)).toFixed(2)) },
          { head: "Embellishment", amount: Number((totalEmbellishmentCost * (garmentQuantity / 12)).toFixed(2)) },
          { head: "Wash", amount: Number((totalWashingCost * (garmentQuantity / 12)).toFixed(2)) },
          { head: "Other", amount: Number((totalOtherCost * (garmentQuantity / 12)).toFixed(2)) },
          { head: "CM", amount: Number((cmPerDozen * (garmentQuantity / 12)).toFixed(2)) },
        ],
        buyerCostingData: costingDataToSave,
      };

      const existingIdx = list.findIndex((r) => r.id === recordId || r.preCostId === costingNo);
      if (existingIdx >= 0) {
        list[existingIdx] = unifiedRecord;
      } else {
        list.unshift(unifiedRecord);
      }

      localStorage.setItem(STORAGE_KEY_MASTER, JSON.stringify(list));
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, recordId);
      setStatus(newStatus);

      if (saveAsStatus === "Draft") {
        toast.success(`Buyer Quotation "${costingNo}" saved as Draft successfully!`);
      } else {
        toast.success(`Buyer Quotation "${costingNo}" submitted for Approval!`);
      }

      onSaved?.(recordId);
    } catch (err: any) {
      console.error("Storage error:", err);
      toast.error("Could not save to Local Storage. Storage quota might be constrained.");
    }
  };

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-100 pb-20 font-sans selection:bg-[#4169E1] selection:text-white">
      {/* ── TOP ACTION & TITLE BAR ────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToList}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
            title="Back to Quotation Register"
          >
            <ArrowLeft className="size-4.5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4169E1]" />
              <h1 className="text-lg font-black tracking-tight text-[#172554] dark:text-white uppercase">
                Buyer Costing Sheet (New)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-50 text-[#4169E1] border border-blue-200 dark:bg-blue-950/40 dark:border-blue-900">
                {costingNo}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  status === "Approved"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300"
                    : status === "Pending Approval"
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300"
                }`}
              >
                ● {status}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Enterprise Garments Cost Breakdown, Fabric Pricing Engine, Machine Income & FOB Gap Analysis
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="size-3.5 text-slate-500" />
            <span>Print Sheet</span>
          </button>
          <button
            type="button"
            onClick={() => handleSaveQuotation("Draft")}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Save className="size-3.5 text-slate-600" />
            <span>Save as Draft</span>
          </button>
          <button
            type="button"
            onClick={() => handleSaveQuotation("Pending Approval")}
            className="px-5 py-2 rounded-xl bg-[#4169E1] hover:bg-[#2347B5] text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20 active:scale-[0.99]"
          >
            <Send className="size-3.5" />
            <span>Submit Quotation</span>
          </button>
        </div>
      </div>

      {/* ── SECTION 1: ORDER HEADER INFORMATION ────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="bg-gradient-to-r from-[#172554] via-[#1e3a8a] to-[#2563eb] px-5 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-6 rounded-lg bg-white/15 flex items-center justify-center font-black text-xs text-white">
              P
            </div>
            <span className="text-xs font-black tracking-wider uppercase">
              Order Specification & Costing Header
            </span>
          </div>
          <span className="text-[11px] font-mono text-blue-200">
            Confidential Pre-Production Costing
          </span>
        </div>

        <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Costing Details Form (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {/* Costing No */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Costing No.
                </label>
                <input
                  type="text"
                  readOnly
                  value={costingNo}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 font-mono font-bold text-slate-700 dark:text-slate-300 cursor-not-allowed text-xs"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-xs focus:ring-2 focus:ring-[#4169E1]"
                />
              </div>

              {/* Buyer */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Buyer <span className="text-rose-500">*</span>
                </label>
                <SearchableSelect
                  options={buyerOptions}
                  value={buyer}
                  onChange={handleBuyerChange}
                  placeholder="Select Buyer..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {/* Department */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Department <span className="text-rose-500">*</span>
                </label>
                <SearchableSelect
                  options={departmentOptions.length > 0 ? departmentOptions : ["Men's Long sleeve", "Ladies Top", "Kids wear", "Basic Tee"]}
                  value={department}
                  onChange={setDepartment}
                  placeholder="Select Dept..."
                  allowCustom={true}
                />
              </div>

              {/* Season */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Season <span className="text-rose-500">*</span>
                </label>
                <SearchableSelect
                  options={seasonOptions.length > 0 ? seasonOptions : ["S23 Winter", "Summer 2026", "Autumn 2026", "Spring 2027"]}
                  value={season}
                  onChange={setSeason}
                  placeholder="Select Season..."
                  allowCustom={true}
                />
              </div>

              {/* Style Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Style Name <span className="text-rose-500">*</span>
                </label>
                <SearchableSelect
                  options={styleOptions.length > 0 ? styleOptions : ["Skinny", "Slim Fit", "Classic Tee", "Oversized Polo"]}
                  value={styleName}
                  onChange={handleStyleChange}
                  placeholder="Select Style..."
                  allowCustom={true}
                />
              </div>

              {/* Shipment Date */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Shipment Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={shipmentDate}
                  onChange={(e) => setShipmentDate(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-xs focus:ring-2 focus:ring-[#4169E1]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {/* Style Description */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Style Description
                </label>
                <input
                  type="text"
                  value={styleDescription}
                  onChange={(e) => setStyleDescription(e.target.value)}
                  placeholder="e.g. Mens long sleeve single jersey tee"
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-xs focus:ring-2 focus:ring-[#4169E1]"
                />
              </div>

              {/* Size Range: Dynamic from Buyer Master & Department Master */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Size Range
                </label>
                <SearchableSelect
                  options={sizeRangeOptions}
                  value={sizeRange}
                  onChange={setSizeRange}
                  placeholder="Select or type size range..."
                  allowCustom={true}
                />
              </div>
            </div>

            {/* Fabrications & CAD Consumption */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] uppercase font-bold text-slate-500">
                    Fabrication <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddFabrication}
                    className="text-[11px] font-bold text-[#4169E1] hover:text-[#2347B5] flex items-center gap-1 cursor-pointer transition"
                  >
                    <Plus className="size-3" /> Add Fabric
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {fabrications.map((fab, fIdx) => (
                    <div key={fab.id} className="relative flex items-center gap-1.5">
                      <div className="flex-1">
                        <SearchableSelect
                          options={fabricRegisterOptions}
                          value={fab.fabricName}
                          onChange={(val) => handleUpdateFabrication(fIdx, val)}
                          placeholder={`Fabrication ${fIdx + 1}...`}
                          allowCustom={true}
                        />
                      </div>
                      {fabrications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFabrication(fIdx)}
                          className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                          title="Remove fabrication"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs pt-1">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                    Actual Fabric Consumption from CAD (KG)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={actualFabricConsumptionCad}
                    onChange={(e) => setActualFabricConsumptionCad(Number(e.target.value) || 0)}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-800 dark:text-slate-100 text-xs focus:ring-2 focus:ring-[#4169E1]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                    Cutting Wastage (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={cuttingWastagePct}
                      onChange={(e) => {
                        const w = Number(e.target.value) || 0;
                        setCuttingWastagePct(w);
                        setConsumptionCuttingWastage(Number((actualFabricConsumptionCad * (1 + w / 100)).toFixed(3)));
                      }}
                      className="w-full h-9 px-3 pr-7 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-800 dark:text-slate-100 text-xs focus:ring-2 focus:ring-[#4169E1]"
                    />
                    <Percent className="size-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                    Consumption with Cutting Wastage (KG)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={consumptionCuttingWastage}
                    onChange={(e) => setConsumptionCuttingWastage(Number(e.target.value) || 0)}
                    className="w-full h-9 px-3 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/20 font-mono font-bold text-[#172554] dark:text-blue-300 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Style Image & Commercials Card (4 cols) */}
          <div className="lg:col-span-4 bg-slate-50/60 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4 flex flex-col justify-between">
            {/* Style Image Area */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Style Visual Reference
                </span>
                {styleImage && (
                  <button
                    type="button"
                    onClick={() => setStyleImage(null)}
                    className="text-[11px] text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="size-3" /> Remove
                  </button>
                )}
              </div>

              {styleImage ? (
                <div className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 h-44 flex items-center justify-center p-2">
                  <img
                    src={styleImage}
                    alt="Garment Style"
                    className="max-h-full max-w-full object-contain cursor-pointer"
                    onClick={() => setPreviewZoom(styleImage)}
                  />
                  <div
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1 cursor-pointer"
                    onClick={() => setPreviewZoom(styleImage)}
                  >
                    <Maximize2 className="size-4" /> Click to Zoom
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl h-44 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#4169E1] hover:bg-blue-50/20 transition-all p-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="p-2.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#4169E1] mb-1.5">
                    <Upload className="size-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Upload Style Image / Sketch
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WEBP</span>
                </label>
              )}
            </div>

            {/* Dynamic Colors & Order Quantities */}
            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] uppercase font-bold text-slate-500">
                    Color(s)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="text-[11px] font-bold text-[#4169E1] hover:text-[#2347B5] flex items-center gap-1 cursor-pointer transition"
                  >
                    <Plus className="size-3" /> Add Color
                  </button>
                </div>
                <div className="space-y-2">
                  {colors.map((c, cIdx) => (
                    <div key={c.id} className="flex items-center gap-1.5">
                      <div className="flex-1">
                        <SearchableSelect
                          options={colorOptions}
                          value={c.colorName}
                          onChange={(val) => handleUpdateColor(cIdx, val)}
                          placeholder={`Color ${cIdx + 1}...`}
                          allowCustom={true}
                        />
                      </div>
                      {colors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(cIdx)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                          title="Remove color"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                  Garment Quantity (Pcs) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={garmentQuantity}
                    onChange={(e) => setGarmentQuantity(Number(e.target.value) || 0)}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-black text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#4169E1]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400">
                    {(garmentQuantity / 12).toFixed(1)} Dzn
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                  Buyer's Target / FOB Total ($)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={buyerTargetFob}
                    onChange={(e) => setBuyerTargetFob(Number(e.target.value) || 0)}
                    className="w-full h-9 px-3 pl-6 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20 font-mono font-black text-emerald-900 dark:text-emerald-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-600">
                    $
                  </span>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-emerald-600">
                    ${targetPerPcs.toFixed(2)}/pc
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MIDDLE TWO-COLUMN AREA: GARMENT BREAKDOWN (LEFT) & FABRIC/PRODUCTION (RIGHT) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── LEFT AREA (7 COLS): GARMENT COST BREAKDOWN TABLES ── */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-4 bg-[#4169E1] rounded-full inline-block" />
              <h2 className="text-sm font-black uppercase tracking-wider text-[#172554] dark:text-white">
                Garment Cost Breakdown
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-[#4169E1]">
              Subtotal: ${(totalCostPerDozen - cmPerDozen).toFixed(3)} / Dzn
            </span>
          </div>

          {/* 2.1 Fabric Cost Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800/60 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scissors className="size-4 text-[#4169E1]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  2.1 Fabric Cost
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black text-blue-700 dark:text-blue-300">
                  Total: ${totalFabricCost.toFixed(3)}
                </span>
                <button
                  type="button"
                  onClick={() => handleAddRow(setFabricCosts, "Additional Fabric", "KG", "Fabric")}
                  className="px-2.5 py-1 rounded-lg bg-[#4169E1] hover:bg-[#2347B5] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition shadow-xs"
                >
                  <Plus className="size-3" /> Add Fabric
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500">
                  <tr>
                    <th className="py-2 px-3 w-8 text-center">#</th>
                    <th className="py-2 px-3 min-w-[150px]">Particulars</th>
                    <th className="py-2 px-3 min-w-[100px]">Used In</th>
                    <th className="py-2 px-3 text-right w-20">Cons.</th>
                    <th className="py-2 px-2 text-center w-14">Unit</th>
                    <th className="py-2 px-3 text-right w-24">Rate ($)</th>
                    <th className="py-2 px-3 text-right w-28 font-black text-[#172554] dark:text-blue-300">
                      Cost (USD)
                    </th>
                    <th className="py-2 px-2 text-center w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {fabricCosts.map((row, idx) => {
                    const isMainFabric = idx === 0 || row.particulars.trim().toUpperCase() === "MAIN FABRIC";
                    return (
                      <tr key={row.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-2 px-3 text-center text-slate-400 font-mono text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-1 px-3">
                          <input
                            type="text"
                            value={row.particulars}
                            onChange={(e) => handleUpdateRow(setFabricCosts, idx, "particulars", e.target.value)}
                            className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-xs"
                          />
                        </td>
                        <td className="py-1 px-3">
                          <input
                            type="text"
                            value={row.usedIn}
                            onChange={(e) => handleUsedInChange(idx, e.target.value)}
                            placeholder="e.g. Shell"
                            className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                          />
                        </td>
                        <td className="py-1 px-3 text-right">
                          <input
                            type="number"
                            step="0.001"
                            value={row.consumption}
                            onChange={(e) => handleUpdateRow(setFabricCosts, idx, "consumption", e.target.value)}
                            className="w-full h-8 px-2 text-right rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
                          />
                        </td>
                        <td className="py-1 px-2 text-center">
                          <span className="font-mono text-[11px] font-bold text-slate-500">{row.unit}</span>
                        </td>
                        <td className="py-1 px-3 text-right">
                          <input
                            type="number"
                            step="0.001"
                            value={isMainFabric ? finalFabricPricePerKg : row.rate}
                            readOnly={isMainFabric}
                            onChange={(e) => {
                              if (!isMainFabric) {
                                handleUpdateRow(setFabricCosts, idx, "rate", e.target.value);
                              }
                            }}
                            className={`w-full h-8 px-2 text-right rounded-lg border font-mono text-xs font-semibold ${
                              isMainFabric
                                ? "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-[#4169E1] font-bold cursor-not-allowed"
                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                            }`}
                            title={isMainFabric ? "Automatically populated with Final Fabric Price Per KG" : undefined}
                          />
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-black text-blue-800 dark:text-blue-300 bg-blue-50/20 dark:bg-blue-950/10">
                          {row.cost.toFixed(3)}
                        </td>
                        <td className="py-1 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(setFabricCosts, idx)}
                            className="text-slate-400 hover:text-rose-500 cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2.2 Accessories Cost Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800/60 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="size-4 text-emerald-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  2.2 Accessories Cost (Dozen Basis)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black text-emerald-700 dark:text-emerald-400">
                  Total: ${totalAccessoriesCost.toFixed(3)}
                </span>
                <button
                  type="button"
                  onClick={() => handleAddRow(setAccessoriesCosts, "New Accessory", "Dzn", "Sewing Trims")}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition shadow-xs"
                >
                  <Plus className="size-3" /> Add Item
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-72 overflow-y-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500 sticky top-0 z-10">
                  <tr>
                    <th className="py-2 px-3 w-8 text-center">#</th>
                    <th className="py-2 px-3 min-w-[170px]">Particulars</th>
                    <th className="py-2 px-3 w-28">Head</th>
                    <th className="py-2 px-3 text-right w-20">Cons. (Dzn)</th>
                    <th className="py-2 px-2 text-center w-14">Unit</th>
                    <th className="py-2 px-3 text-right w-24">Rate ($)</th>
                    <th className="py-2 px-3 text-right w-28 font-black text-emerald-800 dark:text-emerald-300">
                      Cost (USD)
                    </th>
                    <th className="py-2 px-2 text-center w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {accessoriesCosts.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-1.5 px-3 text-center text-slate-400 font-mono text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="py-1 px-3">
                        <input
                          type="text"
                          value={row.particulars}
                          onChange={(e) => handleUpdateRow(setAccessoriesCosts, idx, "particulars", e.target.value)}
                          className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-xs"
                        />
                      </td>
                      <td className="py-1 px-3">
                        <select
                          value={row.head || "Sewing Trims"}
                          onChange={(e) => handleUpdateRow(setAccessoriesCosts, idx, "head", e.target.value)}
                          className="w-full h-8 px-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[11px] font-semibold"
                        >
                          <option value="Sewing Trims">Sewing Trims</option>
                          <option value="Finishing Trims">Finishing Trims</option>
                        </select>
                      </td>
                      <td className="py-1 px-3 text-right">
                        <input
                          type="number"
                          step="0.01"
                          value={row.consumption}
                          onChange={(e) => handleUpdateRow(setAccessoriesCosts, idx, "consumption", e.target.value)}
                          className="w-full h-8 px-2 text-right rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
                        />
                      </td>
                      <td className="py-1 px-2 text-center">
                        <span className="font-mono text-[11px] font-bold text-slate-500">{row.unit}</span>
                      </td>
                      <td className="py-1 px-3 text-right">
                        <input
                          type="number"
                          step="0.001"
                          value={row.rate}
                          onChange={(e) => handleUpdateRow(setAccessoriesCosts, idx, "rate", e.target.value)}
                          className="w-full h-8 px-2 text-right rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs font-semibold"
                        />
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono font-black text-emerald-800 dark:text-emerald-300 bg-emerald-50/20 dark:bg-emerald-950/10">
                        {row.cost.toFixed(3)}
                      </td>
                      <td className="py-1 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(setAccessoriesCosts, idx)}
                          className="text-slate-400 hover:text-rose-500 cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2.3 Embellishment Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800/60 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="size-4 text-indigo-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  2.3 Embellishment Cost
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black text-indigo-700 dark:text-indigo-400">
                  Total: ${totalEmbellishmentCost.toFixed(3)}
                </span>
                <button
                  type="button"
                  onClick={() => handleAddRow(setEmbellishmentCosts, "New Print/Artwork", "Dzn", "Embellishment")}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition shadow-xs"
                >
                  <Plus className="size-3" /> Add Item
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500">
                  <tr>
                    <th className="py-2 px-3 w-8 text-center">#</th>
                    <th className="py-2 px-3 min-w-[180px]">Embellishment Item</th>
                    <th className="py-2 px-3 text-right w-20">Cons. (Dzn)</th>
                    <th className="py-2 px-2 text-center w-14">Unit</th>
                    <th className="py-2 px-3 text-right w-24">Rate ($)</th>
                    <th className="py-2 px-3 text-right w-28 font-black text-indigo-800 dark:text-indigo-300">
                      Cost (USD)
                    </th>
                    <th className="py-2 px-2 text-center w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {embellishmentCosts.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-1.5 px-3 text-center text-slate-400 font-mono text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="py-1 px-3">
                        <input
                          type="text"
                          value={row.particulars}
                          onChange={(e) => handleUpdateRow(setEmbellishmentCosts, idx, "particulars", e.target.value)}
                          className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-xs"
                        />
                      </td>
                      <td className="py-1 px-3 text-right">
                        <input
                          type="number"
                          step="0.01"
                          value={row.consumption}
                          onChange={(e) => handleUpdateRow(setEmbellishmentCosts, idx, "consumption", e.target.value)}
                          className="w-full h-8 px-2 text-right rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
                        />
                      </td>
                      <td className="py-1 px-2 text-center">
                        <span className="font-mono text-[11px] font-bold text-slate-500">{row.unit}</span>
                      </td>
                      <td className="py-1 px-3 text-right">
                        <input
                          type="number"
                          step="0.001"
                          value={row.rate}
                          onChange={(e) => handleUpdateRow(setEmbellishmentCosts, idx, "rate", e.target.value)}
                          className="w-full h-8 px-2 text-right rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs font-semibold"
                        />
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono font-black text-indigo-800 dark:text-indigo-300 bg-indigo-50/20 dark:bg-indigo-950/10">
                        {row.cost.toFixed(3)}
                      </td>
                      <td className="py-1 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(setEmbellishmentCosts, idx)}
                          className="text-slate-400 hover:text-rose-500 cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2.4 Washing & Garment Dye + 2.5 Other Costs (Side-by-side or stacked) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 2.4 Washing & Garment Dye */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Droplets className="size-4 text-cyan-600" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    2.4 Washing / Dye
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono font-black text-cyan-700 dark:text-cyan-400">
                    ${totalWashingCost.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddRow(setWashingCosts, "New Wash", "Dzn", "Wash")}
                    className="p-1 rounded bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer"
                  >
                    <Plus className="size-3" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {washingCosts.map((row, idx) => (
                      <tr key={row.id}>
                        <td className="py-1 px-2">
                          <input
                            type="text"
                            value={row.particulars}
                            onChange={(e) => handleUpdateRow(setWashingCosts, idx, "particulars", e.target.value)}
                            className="w-full h-7 px-1.5 rounded border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                          />
                        </td>
                        <td className="py-1 px-2 text-right w-16">
                          <input
                            type="number"
                            step="0.01"
                            value={row.rate}
                            onChange={(e) => handleUpdateRow(setWashingCosts, idx, "rate", e.target.value)}
                            className="w-full h-7 px-1 text-right rounded border border-slate-200 dark:border-slate-700 font-mono text-xs font-semibold"
                          />
                        </td>
                        <td className="py-1 px-2 text-right font-mono font-black text-cyan-800 dark:text-cyan-300 w-16">
                          {row.cost.toFixed(2)}
                        </td>
                        <td className="py-1 px-1 text-center w-6">
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(setWashingCosts, idx)}
                            className="text-slate-400 hover:text-rose-500"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2.5 Other Costs */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="size-4 text-amber-600" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    2.5 Other Costs
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono font-black text-amber-700 dark:text-amber-400">
                    ${totalOtherCost.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddRow(setOtherCosts, "Other Expense", "Dzn", "Other")}
                    className="p-1 rounded bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
                  >
                    <Plus className="size-3" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {otherCosts.map((row, idx) => (
                      <tr key={row.id}>
                        <td className="py-1 px-2">
                          <input
                            type="text"
                            value={row.particulars}
                            onChange={(e) => handleUpdateRow(setOtherCosts, idx, "particulars", e.target.value)}
                            className="w-full h-7 px-1.5 rounded border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                          />
                        </td>
                        <td className="py-1 px-2 text-right w-16">
                          <input
                            type="number"
                            step="0.01"
                            value={row.rate}
                            onChange={(e) => handleUpdateRow(setOtherCosts, idx, "rate", e.target.value)}
                            className="w-full h-7 px-1 text-right rounded border border-slate-200 dark:border-slate-700 font-mono text-xs font-semibold"
                          />
                        </td>
                        <td className="py-1 px-2 text-right font-mono font-black text-amber-800 dark:text-amber-300 w-16">
                          {row.cost.toFixed(2)}
                        </td>
                        <td className="py-1 px-1 text-center w-6">
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(setOtherCosts, idx)}
                            className="text-slate-400 hover:text-rose-500"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT AREA (5 COLS): FABRIC PRICE CALCULATION & PRODUCTION ── */}
        <div className="lg:col-span-5 space-y-6">
          {/* Section 3 Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-4 bg-purple-600 rounded-full inline-block" />
              <h2 className="text-sm font-black uppercase tracking-wider text-[#172554] dark:text-white">
                Fabric Price Calculation
              </h2>
            </div>
            <button
              type="button"
              onClick={handleApplyCalculatedFabricPrice}
              className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 text-[11px] font-bold border border-purple-200 dark:border-purple-800 transition flex items-center gap-1 cursor-pointer"
              title="Apply final calculated price to Main Fabric cost row"
            >
              <Copy className="size-3" /> Apply to Fabric Row
            </button>
          </div>

          {/* 3.1 Yarn, 3.2 Knitting & 3.3 Dyeing Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 space-y-4">
            {/* Yarn Rows */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">
                  3.1 Yarn Cost
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setYarnRows((prev) => [
                      ...prev,
                      { id: `yrn-${Date.now()}`, yarnItem: "30/1 Cotton", rate: 3.5, ratio: 5, cost: 0.175 },
                    ])
                  }
                  className="text-[11px] text-[#4169E1] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus className="size-3" /> Add Yarn
                </button>
              </div>

              {/* Yarn Table with Required Headings: Yarn | Rate | % | COST (USD) */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-3">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-wider">
                      <th className="py-2 px-2 text-left">Yarn</th>
                      <th className="py-2 px-2 text-right w-20">Rate</th>
                      <th className="py-2 px-2 text-right w-16">%</th>
                      <th className="py-2 px-2 text-right w-24">COST (USD)</th>
                      <th className="py-2 px-1 w-7 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {yarnRows.map((y, idx) => (
                      <tr key={y.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="p-1">
                          <input
                            type="text"
                            value={y.yarnItem}
                            onChange={(e) => {
                              const v = e.target.value;
                              setYarnRows((prev) => {
                                const c = [...prev];
                                c[idx] = { ...c[idx], yarnItem: v };
                                return c;
                              });
                            }}
                            className="w-full h-7 px-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                            placeholder="Yarn count..."
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="number"
                            step="0.01"
                            value={y.rate}
                            onChange={(e) => {
                              const r = Number(e.target.value) || 0;
                              setYarnRows((prev) => {
                                const c = [...prev];
                                c[idx] = { ...c[idx], rate: r, cost: Number(((r * c[idx].ratio) / 100).toFixed(3)) };
                                return c;
                              });
                            }}
                            placeholder="Rate"
                            className="w-full h-7 px-1 text-right rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-medium"
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="number"
                            step="0.1"
                            value={y.ratio}
                            onChange={(e) => {
                              const rat = Number(e.target.value) || 0;
                              setYarnRows((prev) => {
                                const c = [...prev];
                                c[idx] = { ...c[idx], ratio: rat, cost: Number(((c[idx].rate * rat) / 100).toFixed(3)) };
                                return c;
                              });
                            }}
                            placeholder="%"
                            className="w-full h-7 px-1 text-right rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-medium"
                          />
                        </td>
                        <td className="p-1 text-right font-mono font-bold text-slate-800 dark:text-slate-200 pr-2">
                          ${y.cost.toFixed(3)}
                        </td>
                        <td className="p-1 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              if (yarnRows.length <= 1) {
                                toast.error("At least one Yarn row is required.");
                                return;
                              }
                              setYarnRows((prev) => prev.filter((_, i) => i !== idx));
                            }}
                            className="text-slate-400 hover:text-rose-500 cursor-pointer"
                          >
                            <X className="size-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Knitting Charge */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">
                  3.2 Knitting Charge
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setKnittingRows((prev) => [
                      ...prev,
                      { id: `knt-${Date.now()}`, processName: "RIB KNITTING", rate: 2.0 },
                    ])
                  }
                  className="text-[11px] text-[#4169E1] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus className="size-3" /> Add Knitting
                </button>
              </div>

              <div className="space-y-1.5">
                {knittingRows.map((k, idx) => (
                  <div key={k.id} className="grid grid-cols-12 gap-1.5 items-center text-xs">
                    <div className="col-span-8">
                      <input
                        type="text"
                        value={k.processName}
                        onChange={(e) => {
                          const v = e.target.value;
                          setKnittingRows((prev) => {
                            const c = [...prev];
                            c[idx] = { ...c[idx], processName: v };
                            return c;
                          });
                        }}
                        className="w-full h-7 px-2 rounded border border-slate-200 dark:border-slate-700 text-xs font-semibold uppercase"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        step="0.01"
                        value={k.rate}
                        onChange={(e) => {
                          const r = Number(e.target.value) || 0;
                          setKnittingRows((prev) => {
                            const c = [...prev];
                            c[idx] = { ...c[idx], rate: r };
                            return c;
                          });
                        }}
                        className="w-full h-7 px-2 text-right rounded border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold"
                      />
                    </div>
                    <div className="col-span-1 text-center">
                      <button
                        type="button"
                        onClick={() => setKnittingRows((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dyeing & Finishing Charge */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">
                  3.3 Dyeing & Finishing Charge
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setDyeingFinishingRows((prev) => [
                      ...prev,
                      { id: `dye-${Date.now()}`, processName: "Special Finish", rate: 1.5 },
                    ])
                  }
                  className="text-[11px] text-[#4169E1] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus className="size-3" /> Add Process
                </button>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {dyeingFinishingRows.map((d, idx) => (
                  <div key={d.id} className="grid grid-cols-12 gap-1.5 items-center text-xs">
                    <div className="col-span-8">
                      <input
                        type="text"
                        value={d.processName}
                        onChange={(e) => {
                          const v = e.target.value;
                          setDyeingFinishingRows((prev) => {
                            const c = [...prev];
                            c[idx] = { ...c[idx], processName: v };
                            return c;
                          });
                        }}
                        className="w-full h-7 px-2 rounded border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        step="0.01"
                        value={d.rate}
                        onChange={(e) => {
                          const r = Number(e.target.value) || 0;
                          setDyeingFinishingRows((prev) => {
                            const c = [...prev];
                            c[idx] = { ...c[idx], rate: r };
                            return c;
                          });
                        }}
                        className="w-full h-7 px-2 text-right rounded border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold"
                      />
                    </div>
                    <div className="col-span-1 text-center">
                      <button
                        type="button"
                        onClick={() => setDyeingFinishingRows((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subtotal & Process Loss */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2 text-xs bg-purple-50/40 dark:bg-purple-950/20 p-3 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase text-slate-700 dark:text-slate-300">
                  Sub-Total (Yarn + Knit + Dye):
                </span>
                <span className="font-mono font-black text-slate-900 dark:text-white">
                  ${fabricSubtotal.toFixed(3)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="font-bold uppercase text-slate-700 dark:text-slate-300">
                  Fabric Process Loss (%):
                </span>
                <div className="flex items-center gap-2">
                  <div className="relative w-20">
                    <input
                      type="number"
                      step="0.1"
                      value={fabricProcessLossPct}
                      onChange={(e) => setFabricProcessLossPct(Number(e.target.value) || 0)}
                      className="w-full h-7 px-2 pr-5 text-right rounded border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold"
                    />
                    <Percent className="size-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    = ${fabricProcessLossAmount.toFixed(3)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-purple-200 dark:border-purple-800 pt-1.5">
                <span className="font-black uppercase text-purple-900 dark:text-purple-300 text-[11px]">
                  Fabric Price Per KG:
                </span>
                <span className="font-mono font-black text-sm text-purple-800 dark:text-purple-200">
                  ${fabricPricePerKg.toFixed(3)}
                </span>
              </div>
            </div>

            {/* 3.5 AOP Cost (If Applicable) */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aopApplicable}
                    onChange={(e) => setAopApplicable(e.target.checked)}
                    className="size-4 rounded text-[#4169E1] focus:ring-[#4169E1]"
                  />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    3.5 AOP Cost (If Applicable)
                  </span>
                </label>
                {aopApplicable && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAddAopProcess}
                      className="text-[11px] font-bold text-[#4169E1] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="size-3" /> Add AOP Process
                    </button>
                    <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400">
                      +${(totalAopCost + aopProcessLossAmount).toFixed(3)}/kg
                    </span>
                  </div>
                )}
              </div>

              {aopApplicable && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  {/* AOP Process Table with Column heading: COST (USD) */}
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase text-slate-500">
                        <th className="py-1 px-1 text-left">AOP Process</th>
                        <th className="py-1 px-1 text-right w-28">COST (USD)</th>
                        <th className="py-1 px-1 w-7 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {aopProcesses.map((proc, pIdx) => (
                        <tr key={proc.id}>
                          <td className="py-1 px-1">
                            <input
                              type="text"
                              value={proc.aopType}
                              onChange={(e) => handleUpdateAopProcess(pIdx, "aopType", e.target.value)}
                              className="w-full h-7 px-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                              placeholder="e.g. Pigment AOP"
                            />
                          </td>
                          <td className="py-1 px-1">
                            <input
                              type="number"
                              step="0.01"
                              value={proc.cost}
                              onChange={(e) => handleUpdateAopProcess(pIdx, "cost", Number(e.target.value) || 0)}
                              className="w-full h-7 px-2 text-right rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs font-bold"
                            />
                          </td>
                          <td className="py-1 px-1 text-center">
                            {aopProcesses.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveAopProcess(pIdx)}
                                className="text-slate-400 hover:text-rose-500 cursor-pointer"
                              >
                                <X className="size-3" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}

                      {/* AOP Process Loss Row: (FABRIC PRICE PER KG + Total AOP Cost) × AOP PROCESS LOSS (%) / 100 */}
                      <tr className="bg-amber-50/50 dark:bg-amber-950/20">
                        <td className="py-1.5 px-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold uppercase text-[11px] text-amber-900 dark:text-amber-300">
                              AOP Process Loss:
                            </span>
                            <div className="relative w-16">
                              <input
                                type="number"
                                step="0.1"
                                value={aopProcessLossPct}
                                onChange={(e) => setAopProcessLossPct(Number(e.target.value) || 0)}
                                className="w-full h-6 px-1.5 pr-4 text-right rounded border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 font-mono text-xs font-bold"
                              />
                              <Percent className="size-2.5 text-slate-400 absolute right-1 top-1/2 -translate-y-1/2" />
                            </div>
                          </div>
                        </td>
                        <td className="py-1.5 px-1 text-right font-mono font-bold text-amber-900 dark:text-amber-300">
                          ${aopProcessLossAmount.toFixed(3)}
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-2">
                    <span className="font-black uppercase text-blue-900 dark:text-blue-300 text-[11px]">
                      Final Fabric Price / KG:
                    </span>
                    <span className="font-mono font-black text-sm text-[#4169E1] dark:text-blue-400">
                      ${finalFabricPricePerKg.toFixed(3)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── SECTION 4: PRODUCTION & MACHINE INCOME CALCULATION ── */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-emerald-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  4. Production & Machine Income
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Independent of Selling Price
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                  CM Per Dozen ($) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={cmPerDozen}
                  onChange={(e) => setCmPerDozen(Number(e.target.value) || 0)}
                  className="w-full h-8 px-2 text-right rounded-lg border border-slate-200 dark:border-slate-700 font-mono font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                  Working Min / Day
                </label>
                <input
                  type="number"
                  value={workingMinutesPerDay}
                  onChange={(e) => setWorkingMinutesPerDay(Number(e.target.value) || 0)}
                  className="w-full h-8 px-2 text-right rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                  Efficiency (%)
                </label>
                <input
                  type="number"
                  value={efficiencyPct}
                  onChange={(e) => setEfficiencyPct(Number(e.target.value) || 0)}
                  className="w-full h-8 px-2 text-right rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                  SMV (Standard Min Value)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={smv}
                  onChange={(e) => setSmv(Number(e.target.value) || 0)}
                  className="w-full h-8 px-2 text-right rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-xs"
                />
              </div>
            </div>

            {/* Production Results Banner */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Productivity / Day / Machine:</span>
                <span className="font-mono font-black text-slate-900 dark:text-white">
                  {productivityPerDayPerMachine} pcs
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Available Production Days:</span>
                <input
                  type="number"
                  value={availableProductionDays}
                  onChange={(e) => setAvailableProductionDays(Number(e.target.value) || 0)}
                  className="w-16 h-6 px-1 text-right rounded border border-slate-200 dark:border-slate-700 font-mono text-xs"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">No. of Machines Required:</span>
                <span className="font-mono font-black text-indigo-700 dark:text-indigo-400">
                  {machinesRequired} Machines
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-1.5">
                <span className="font-black text-slate-800 dark:text-slate-200">
                  Estimated Machine Income:
                </span>
                <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                  ${totalMachineIncome.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 5: FINAL COSTING & PRICING SUMMARY (FULL-WIDTH BOTTOM) ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#172554] to-[#1e3a8a] px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calculator className="size-5 text-blue-300" />
            <h2 className="text-sm font-black uppercase tracking-wider">
              5. Final Costing & Pricing Summary
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span>
              Target Price: <strong className="text-blue-200">${targetPerPcs.toFixed(2)}</strong>
            </span>
            <span>
              Final FOB: <strong className="text-emerald-300 font-black">${finalPricePerPcs.toFixed(2)}</strong>
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary Chips Breakdown Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center">
            <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
              <span className="block text-[10px] uppercase font-bold text-blue-700 dark:text-blue-400 mb-0.5">
                Fabric Cost
              </span>
              <span className="font-mono font-black text-xs text-[#172554] dark:text-blue-200">
                ${totalFabricCost.toFixed(3)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
              <span className="block text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 mb-0.5">
                Accessories
              </span>
              <span className="font-mono font-black text-xs text-emerald-900 dark:text-emerald-200">
                ${totalAccessoriesCost.toFixed(3)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900">
              <span className="block text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-400 mb-0.5">
                Embellishment
              </span>
              <span className="font-mono font-black text-xs text-indigo-900 dark:text-indigo-200">
                ${totalEmbellishmentCost.toFixed(3)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900">
              <span className="block text-[10px] uppercase font-bold text-cyan-700 dark:text-cyan-400 mb-0.5">
                Wash & Dye
              </span>
              <span className="font-mono font-black text-xs text-cyan-900 dark:text-cyan-200">
                ${totalWashingCost.toFixed(3)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
              <span className="block text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 mb-0.5">
                Other Costs
              </span>
              <span className="font-mono font-black text-xs text-amber-900 dark:text-amber-200">
                ${totalOtherCost.toFixed(3)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900">
              <span className="block text-[10px] uppercase font-bold text-purple-700 dark:text-purple-400 mb-0.5">
                CM Cost (Dzn)
              </span>
              <span className="font-mono font-black text-xs text-purple-900 dark:text-purple-200">
                ${cmPerDozen.toFixed(3)}
              </span>
            </div>
          </div>

          {/* Pricing Progression Formula Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            {/* Left Column: Subtotal & Overheads Calculation */}
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Total Cost Per Dozen (Sum of Components):
                </span>
                <span className="font-mono font-black text-sm text-[#172554] dark:text-white">
                  ${totalCostPerDozen.toFixed(3)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 p-2">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Adding GMT Wastage for Print/Wash (%):
                  </span>
                  <span className="text-[10px] text-slate-400">Calculated on Total Cost Per Dozen</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-20">
                    <input
                      type="number"
                      step="0.1"
                      value={gmtWastagePct}
                      onChange={(e) => setGmtWastagePct(Number(e.target.value) || 0)}
                      className="w-full h-8 px-2 pr-5 text-right rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold"
                    />
                    <Percent className="size-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300 w-24 text-right">
                    = ${gmtWastageAmount.toFixed(3)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900">
                <span className="font-black text-blue-900 dark:text-blue-200">
                  Sub Total Cost / Dozen:
                </span>
                <span className="font-mono font-black text-sm text-[#4169E1] dark:text-blue-300">
                  ${subTotalCostPerDozen.toFixed(3)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 p-2">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Bank Deferred Cost (%):
                  </span>
                  <span className="text-[10px] text-slate-400">Independent basis on Sub Total Cost</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-20">
                    <input
                      type="number"
                      step="0.1"
                      value={bankDeferredCostPct}
                      onChange={(e) => setBankDeferredCostPct(Number(e.target.value) || 0)}
                      className="w-full h-8 px-2 pr-5 text-right rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold"
                    />
                    <Percent className="size-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300 w-24 text-right">
                    = ${bankDeferredCostAmount.toFixed(3)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 p-2">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Commercial Cost (%):
                  </span>
                  <span className="text-[10px] text-slate-400">Independent basis on Sub Total Cost</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-20">
                    <input
                      type="number"
                      step="0.1"
                      value={commercialCostPct}
                      onChange={(e) => setCommercialCostPct(Number(e.target.value) || 0)}
                      className="w-full h-8 px-2 pr-5 text-right rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold"
                    />
                    <Percent className="size-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300 w-24 text-right">
                    = ${commercialCostAmount.toFixed(3)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Per-Piece FOB, Profit Margin & Gap Analysis */}
            <div className="space-y-3.5 text-xs bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">
                    Garment Cost / Pcs (Base FOB):
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    (Subtotal + Deferred + Commercial) ÷ 12
                  </span>
                </div>
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                  ${garmentPricePerPcs.toFixed(3)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">
                    Profit Margin (%):
                  </span>
                  <span className="text-[10px] text-slate-400">Markup on Garment Base Price</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-20">
                    <input
                      type="number"
                      step="0.1"
                      value={profitPct}
                      onChange={(e) => setProfitPct(Number(e.target.value) || 0)}
                      className="w-full h-8 px-2 pr-5 text-right rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-xs font-black text-emerald-600"
                    />
                    <Percent className="size-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <span className="font-mono font-bold text-emerald-600 w-24 text-right">
                    = +${profitAmount.toFixed(3)}
                  </span>
                </div>
              </div>

              {/* Final Selling Price Per Pcs */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border-2 border-[#4169E1] shadow-xs">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#4169E1] block">
                    Calculated Price Per Pcs (FOB):
                  </span>
                  <span className="text-xs text-slate-500">Official quoted garment price</span>
                </div>
                <span className="font-mono font-black text-xl text-[#172554] dark:text-white">
                  ${finalPricePerPcs.toFixed(3)}
                </span>
              </div>

              {/* Target Price & Price GAP */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">
                    Buyer Target FOB / Pcs:
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    ${targetPerPcs.toFixed(3)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <div>
                    <span className="font-black text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 block">
                      Price GAP (Target − Quoted):
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {priceGap > 0
                        ? "Target price is higher than calculated price"
                        : priceGap < 0
                        ? "Calculated selling price exceeds buyer target"
                        : "Target and selling price are equal"}
                    </span>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1 font-mono font-black text-base px-3 py-1 rounded-xl shadow-xs ${
                        priceGap >= 0
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300"
                      }`}
                    >
                      {priceGap >= 0 ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
                      {priceGap >= 0 ? `+$${priceGap.toFixed(3)}` : `-$${Math.abs(priceGap).toFixed(3)}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── IMAGE ZOOM MODAL ──────────────────────────────────────────────── */}
      {previewZoom && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewZoom(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 border border-white/20 rounded-2xl p-2 flex flex-col items-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between px-3 py-2 text-white border-b border-white/10">
              <span className="text-xs font-bold truncate">Style Sketch Preview — {styleName}</span>
              <button
                type="button"
                onClick={() => setPreviewZoom(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-white transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[80vh] flex items-center justify-center">
              <img src={previewZoom} alt="Zoom Preview" className="max-w-full max-h-[75vh] object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuyerCostingSheetForm;
