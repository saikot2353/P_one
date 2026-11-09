import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Plus, Search, FileText, ArrowLeft, Save, Printer,
  Eye, X, CheckCircle, Clock, AlertCircle, Download,
  FileSpreadsheet, GitBranch, History, Check, ShieldCheck,
  Send, RotateCcw, AlertTriangle, Layers, Trash2, ArrowRight,
  Upload, Paperclip, File, Image as ImageIcon, Info, ExternalLink,
  Scissors, DollarSign, Percent, Sparkles, Disc, RefreshCw, Hash,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Tag, BookmarkCheck, Link2
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
  MMYarnBookingTagRecord,
} from "../../lib/marketing-merchandising-data";
import {
  MMMasterDataRepository,
  MMFabricComposition,
  MMFabricType,
  MMSpinningType,
  MMYarnCount,
  MMDyeingRate,
  MMKnittingRate,
} from "../../lib/merchandising-master-data";
import { SearchableSelect } from "../ui/searchable-select";
import { PreCostingKnitReport } from "./PreCostingKnitReport";

export interface PreCostingKnitManagerProps {
  initialTab?: "register" | "create" | "compare" | "report";
  initialRecordId?: string;
  onTabChange?: (tab: "register" | "create" | "compare" | "report", recordId?: string) => void;
}
export type PreCostingManagerProps = PreCostingKnitManagerProps;

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

// ── Knit Pre-Costing Specialized Models (from Knit Fabric Pre cost Excel) ─
export interface KnitFabricEntryData {
  fabricComposition: string;
  composition?: string;
  fabricType: string;
  gsm: number | string;
  spinningType: string;
  otherSpecs: string;
  fabricCategory: string;
}

export interface KnitYarnDetailRow {
  id: string;
  sl?: number;
  grade: "A" | "B" | "Grade A" | "Grade B" | string;
  colorType: "Solid" | "Y/D" | string;
  yarnCount: string;
  yarnComposition: string;
  yarnItem: string;
  ratioPct: number;
  finalQtyKg: number;
  ratePerKg: number;
  yarnCost: number;
  brand: string;
  vendor?: string;
  bookingTag?: MMYarnBookingTagRecord;
}

export interface KnitFabricCostItemRow {
  id: string;
  sl: number;
  head: string;
  item: string;
  effectedQtyPcs: number;
  effectedQtyDz?: number;
  consumptionKgDz: number;
  estimatedFinishQty: number;
  rmgProcessLossPct: number;
  requiredFinishedQty: number;
  colorShade: string;
  dyeingMethod: string;
  dyeingProcessLossPct: number;
  dyeingRate: number;
  dyeingCost: number;
  requiredGreigeQty: number;
  knittingProcessLossPct: number;
  requiredYarnKg: number;
  knittingRate: number;
  knittingCost: number;
  yarnCost: number;
  totalYarnCost?: number;
  totalAmount: number;
  yarnDetails: KnitYarnDetailRow[];
}

export interface KnitOtherCostRow {
  id: string;
  sl: number;
  head?: string;
  costHead?: string;
  description: string;
  supplier?: string;
  quantity?: number;
  currency?: string;
  calcBasis: "Percentage of Order Value" | "Per Piece" | "Per Dozen" | "Fixed Lump Sum" | string;
  basisValue: number;
  rateOrPct?: number;
  gmtQty?: number;
  qtyInDz?: number;
  unitRateDz?: number;
  amount: number;
}

export const FABRIC_CATEGORIES = [
  "Knit Fabric",
  "Woven Fabric",
] as const;

export const COLOR_SHADES = [
  "Medium",
  "White",
  "Light",
  "Dark",
  "Extra Dark",
] as const;

export const DYEING_METHODS = [
  "Reactive",
  "Dispersed",
  "2 Part Dye",
  "Normal Wash",
  "White Dyeing",
  "N/A",
] as const;

export const YARN_GRADES = ["A", "B"] as const;
export const YARN_COLOR_TYPES = ["Solid", "Y/D"] as const;

export const OTHER_COST_HEADS = [
  "Commercial Cost",
  "Freight & Transport",
  "Testing & Inspection",
  "Buying House Commission",
  "Printing & Embellishment",
  "Courier & Postage",
  "Finance & Bank Charge",
  "Sample Development Cost",
  "Factory Overhead & Miscellaneous",
] as const;

export const CALC_BASIS_OPTIONS = [
  "Percentage of Order Value",
  "Per Piece",
  "Per Dozen",
  "Fixed Lump Sum",
] as const;

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
  consumptionUnit?: "PCS" | "DZ";
  smv: number;
  cpm: number;
  efficiencyPct: number;
  note: string;
  // Multiple Purchase Orders
  poRows: MMPreCostPO[];
  // Item-wise costing details
  items: PreCostingItemRow[];
  fabricEntry?: KnitFabricEntryData;
  knitFabricItems?: KnitFabricCostItemRow[];
  accessoriesItems?: PreCostingItemRow[];
  otherCostItems?: KnitOtherCostRow[];
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
export const ACCESSORY_HEADS = ACCESSORIES_HEADS;

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

// ── Calculation Utilities for Knit Pre Costing Tabs ──────────────
export function computeKnitFabricRow(
  row: Partial<KnitFabricCostItemRow>,
  consumptionUnit: "PCS" | "DZ" = "DZ"
): KnitFabricCostItemRow {
  const effectedQtyPcs = Number(row.effectedQtyPcs) || 0;
  const effectedQtyDz = Number((effectedQtyPcs / 12).toFixed(4));
  const consumptionKgDz = Number(row.consumptionKgDz) || 0;
  const baseQty = consumptionUnit === "PCS" ? effectedQtyPcs : effectedQtyDz;
  const estimatedFinishQty = Number((baseQty * consumptionKgDz).toFixed(2));
  const rmgProcessLossPct = Number(row.rmgProcessLossPct) || 0;
  const requiredFinishedQty = Number((estimatedFinishQty * (1 + rmgProcessLossPct / 100)).toFixed(2));

  const dyeingProcessLossPct = Number(row.dyeingProcessLossPct) || 0;
  const requiredGreigeQty = Number((requiredFinishedQty * (1 + dyeingProcessLossPct / 100)).toFixed(2));
  const dyeingRate = Number(row.dyeingRate) || 0;
  const dyeingCost = Number((requiredGreigeQty * dyeingRate).toFixed(2));

  const knittingProcessLossPct = Number(row.knittingProcessLossPct) || 0;
  const requiredYarnKg = Number((requiredGreigeQty * (1 + knittingProcessLossPct / 100)).toFixed(2));
  const knittingRate = Number(row.knittingRate) || 0;
  const knittingCost = Number((requiredYarnKg * knittingRate).toFixed(2));

  const rawYarn = Array.isArray(row.yarnDetails) ? row.yarnDetails : [];
  const updatedYarn: KnitYarnDetailRow[] = rawYarn.map((yd) => {
    const ratioPct = Number(yd.ratioPct) || 0;
    const finalQtyKg = Number(((requiredYarnKg * ratioPct) / 100).toFixed(2));
    const ratePerKg = Number(yd.ratePerKg) || 0;
    const yarnCost = Number((finalQtyKg * ratePerKg).toFixed(2));
    return {
      ...yd,
      ratioPct,
      finalQtyKg,
      ratePerKg,
      yarnCost,
    };
  });

  const yarnCost = Number(updatedYarn.reduce((s, y) => s + y.yarnCost, 0).toFixed(2));
  const totalAmount = Number((yarnCost + dyeingCost + knittingCost).toFixed(2));

  return {
    id: row.id || `kfi-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    sl: row.sl || 1,
    head: row.head || "Shell",
    item: row.item || "100% Cotton 2x2 Rib Fabric 220 GSM",
    effectedQtyPcs,
    effectedQtyDz,
    consumptionKgDz,
    estimatedFinishQty,
    rmgProcessLossPct,
    requiredFinishedQty,
    colorShade: row.colorShade || "Medium",
    dyeingMethod: row.dyeingMethod || "Reactive",
    dyeingProcessLossPct,
    dyeingRate,
    dyeingCost,
    requiredGreigeQty,
    knittingProcessLossPct,
    requiredYarnKg,
    knittingRate,
    knittingCost,
    yarnCost,
    totalYarnCost: yarnCost,
    totalAmount,
    yarnDetails: updatedYarn,
  };
}

export function computeOtherCostRow(
  row: Partial<KnitOtherCostRow>,
  orderValue: number = 0,
  gmtOrderQty: number = 0
): KnitOtherCostRow {
  const gmtQty =
    row.gmtQty !== undefined && row.gmtQty !== null && row.gmtQty > 0
      ? Number(row.gmtQty)
      : gmtOrderQty > 0
      ? gmtOrderQty
      : 20000;
  const qtyInDz = Number((gmtQty / 12).toFixed(2));
  let unitRateDz = row.unitRateDz !== undefined ? Number(row.unitRateDz) : undefined;
  let amount = 0;

  if (unitRateDz !== undefined) {
    amount = Number((qtyInDz * unitRateDz).toFixed(2));
  } else if (Number(row.amount) > 0) {
    amount = Number(row.amount);
    unitRateDz = qtyInDz > 0 ? Number((amount / qtyInDz).toFixed(4)) : 0;
  } else {
    unitRateDz = 0.5;
    amount = Number((qtyInDz * unitRateDz).toFixed(2));
  }

  const calcBasis = row.calcBasis || "Per Dozen";
  const basisValue = Number(row.basisValue) || 0;
  const rateOrPct = Number(row.rateOrPct) || 0;

  return {
    id: row.id || `oc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    sl: row.sl || 1,
    head: row.head || row.costHead || "Commercial Cost",
    costHead: row.costHead || row.head || "Commercial Cost",
    description: row.description || "",
    supplier: row.supplier || "",
    calcBasis,
    basisValue,
    rateOrPct,
    gmtQty,
    qtyInDz,
    unitRateDz: unitRateDz ?? 0,
    amount,
    quantity: gmtQty,
    currency: row.currency || "USD",
  };
}

export function syncAllCostingItems(
  knitFabricItems: KnitFabricCostItemRow[] = [],
  accessoriesItems: PreCostingItemRow[] = [],
  otherCostItems: KnitOtherCostRow[] = []
): PreCostingItemRow[] {
  let sl = 1;
  const fabricRows: PreCostingItemRow[] = knitFabricItems.map((f) => ({
    id: f.id,
    sl: sl++,
    head: f.head,
    item: f.item,
    description: `Dyeing: $${f.dyeingCost.toFixed(2)} | Knitting: $${f.knittingCost.toFixed(2)} | Yarn: $${f.yarnCost.toFixed(2)}`,
    nStatus: "Own Source",
    supplier: "In-House Knit & Dyeing",
    effectedQty: f.effectedQtyPcs,
    consumption: f.consumptionKgDz,
    unit: "Kg",
    requiredQty: f.requiredFinishedQty,
    finalQty: f.requiredYarnKg,
    rate: f.requiredYarnKg > 0 ? Number((f.totalAmount / f.requiredYarnKg).toFixed(4)) : 0,
    amount: f.totalAmount,
    preCostPct: 0,
  }));

  const accRows: PreCostingItemRow[] = accessoriesItems.map((a) => ({
    ...a,
    sl: sl++,
  }));

  const otherRows: PreCostingItemRow[] = otherCostItems.map((o) => ({
    id: o.id,
    sl: sl++,
    head: o.costHead || o.head || "Commercial Cost",
    item: o.description || o.costHead || o.head || "Other Cost",
    description: `${o.calcBasis}: ${o.rateOrPct}${o.calcBasis.includes("Percentage") ? "%" : "$"}`,
    nStatus: "Nominated",
    supplier: o.supplier || "Agency / Vendor",
    effectedQty: o.basisValue || 1,
    consumption: 1,
    unit: "LS",
    requiredQty: o.basisValue || 1,
    finalQty: o.basisValue || 1,
    rate: o.basisValue > 0 ? Number((o.amount / o.basisValue).toFixed(4)) : o.amount,
    amount: o.amount,
    preCostPct: 0,
  }));

  const combined = [...fabricRows, ...accRows, ...otherRows];
  const grandTotal = combined.reduce((s, it) => s + (Number(it.amount) || 0), 0);
  return combined.map((it) => ({
    ...it,
    preCostPct: grandTotal > 0 ? Number((((Number(it.amount) || 0) / grandTotal) * 100).toFixed(2)) : 0,
  }));
}

export function ensureKnitCostingStructure(r: any, totalPoVal: number = 0): PreCostingRecord {
  const fabricEntry: KnitFabricEntryData = r.fabricEntry || {
    fabricComposition: r.fabricEntry?.fabricComposition || r.fabricEntry?.composition || "100% Cotton",
    composition: r.fabricEntry?.composition || "100% Cotton",
    fabricType: "2x2 Rib",
    gsm: 220,
    spinningType: "Combed",
    otherSpecs: "Bio-washed combed cotton",
    fabricCategory: r.fabricEntry?.fabricCategory === "Woven Fabric" ? "Woven Fabric" : "Knit Fabric",
  };

  const consumptionUnit: "PCS" | "DZ" = r.consumptionUnit || "DZ";
  const hasExplicitFabric = Array.isArray(r.knitFabricItems);
  const hasExplicitAcc = Array.isArray(r.accessoriesItems);
  const hasExplicitOthers = Array.isArray(r.otherCostItems);

  let knitFabricItems: KnitFabricCostItemRow[] = hasExplicitFabric ? r.knitFabricItems : [];
  let accessoriesItems: PreCostingItemRow[] = hasExplicitAcc ? r.accessoriesItems : [];
  let otherCostItems: KnitOtherCostRow[] = hasExplicitOthers ? r.otherCostItems : [];

  if (!hasExplicitFabric && !hasExplicitAcc && Array.isArray(r.items) && r.items.length > 0) {
    const rawItems: PreCostingItemRow[] = r.items;
    const fabRows = rawItems.filter((it) => FABRIC_HEADS.includes(it.head) || it.head === "Fabric" || it.head === "Yarn");
    const accRows = rawItems.filter((it) => ACCESSORIES_HEADS.includes(it.head) || it.head === "Accessories");
    const otherRows = rawItems.filter((it) => !fabRows.includes(it) && !accRows.includes(it));

    if (fabRows.length > 0) {
      knitFabricItems = fabRows.map((it, idx) =>
        computeKnitFabricRow({
          id: it.id || `kfi-mig-${idx + 1}`,
          sl: idx + 1,
          head: it.head === "Fabric" ? "Shell" : it.head,
          item: it.item,
          effectedQtyPcs: it.effectedQty || 39024,
          consumptionKgDz: it.consumption ? Number((it.consumption * 12).toFixed(4)) : 2.4,
          rmgProcessLossPct: 4,
          colorShade: "Medium",
          dyeingMethod: "Reactive",
          dyeingProcessLossPct: 4,
          dyeingRate: 0.85,
          knittingProcessLossPct: 3,
          knittingRate: 0.45,
          yarnDetails: [
            {
              id: `yd-mig-${idx + 1}-1`,
              grade: "A",
              colorType: "Solid",
              yarnCount: "30/1",
              yarnComposition: "100% Cotton",
              yarnItem: "30/1 Combed Cotton",
              ratioPct: 100,
              finalQtyKg: it.finalQty || 5000,
              ratePerKg: 3.45,
              yarnCost: Number(((it.finalQty || 5000) * 3.45).toFixed(2)),
              brand: "Square Textiles",
            },
          ],
        }),
      );
    }

    if (accRows.length > 0) {
      accessoriesItems = accRows.map((it, idx) => ({ ...it, sl: idx + 1 }));
    }

    if (otherRows.length > 0) {
      otherCostItems = otherRows.map((it, idx) =>
        computeOtherCostRow(
          {
            id: it.id || `oc-mig-${idx + 1}`,
            sl: idx + 1,
            head: it.head || "Commercial Cost",
            description: it.description || it.item,
            supplier: it.supplier,
            calcBasis: "Percentage of Order Value",
            basisValue: totalPoVal,
            rateOrPct: 1.5,
            amount: it.amount || 0,
          },
          totalPoVal,
        ),
      );
    }
  }

  if (!hasExplicitFabric && knitFabricItems.length === 0) {
    knitFabricItems = [
      computeKnitFabricRow({
        id: "kfi-def-1",
        sl: 1,
        head: "Shell",
        item: "100% Cotton 2x2 Rib Fabric 220 GSM",
        effectedQtyPcs: 20000,
        consumptionKgDz: 2.4,
        rmgProcessLossPct: 4,
        colorShade: "Medium",
        dyeingMethod: "Reactive",
        dyeingProcessLossPct: 4,
        dyeingRate: 0.85,
        knittingProcessLossPct: 3,
        knittingRate: 0.45,
        yarnDetails: [
          {
            id: "yd-def-1",
            grade: "A",
            colorType: "Solid",
            yarnCount: "30/1",
            yarnComposition: "100% Cotton",
            yarnItem: "100% Combed Cotton Ring Spun",
            ratioPct: 100,
            finalQtyKg: 4400,
            ratePerKg: 3.45,
            yarnCost: 15180,
            brand: "Square Textiles",
          },
        ],
      }),
    ];
  }

  if (!hasExplicitAcc && accessoriesItems.length === 0) {
    accessoriesItems = [
      {
        id: "acc-def-1",
        sl: 1,
        preCostItemId: "PCIK-ACC-01",
        head: "Sewing Trims",
        item: "Sewing Thread 40/2 5000M",
        description: "100% Spun Polyester matching thread",
        nStatus: "Nominated",
        supplier: "Coats Bangladesh Ltd",
        effectedQty: 20000,
        consumption: 1,
        unit: "Cone",
        requiredQty: 20000,
        finalQty: 21000,
        rate: 0.05,
        amount: 1050,
        preCostPct: 0,
      },
    ];
  }

  if (!hasExplicitOthers && otherCostItems.length === 0) {
    otherCostItems = [
      computeOtherCostRow(
        {
          id: "oc-def-1",
          sl: 1,
          head: "Commercial Cost",
          description: "Bank charge, LC transmission, & documentation",
          supplier: "Commercial Bank",
          calcBasis: "Percentage of Order Value",
          basisValue: totalPoVal,
          rateOrPct: 1.25,
          amount: Number(((totalPoVal * 1.25) / 100).toFixed(2)),
        },
        totalPoVal,
      ),
    ];
  }

  // Hydrate yarn booking tags on every yarn detail row
  if (Array.isArray(knitFabricItems)) {
    knitFabricItems = knitFabricItems.map((f) => ({
      ...f,
      yarnDetails: (f.yarnDetails || []).map((y) => ({
        ...y,
        bookingTag: y.bookingTag || MMRepository.getYarnBookingTagByRowId(y.id),
      })),
    }));
  }

  const items = syncAllCostingItems(knitFabricItems, accessoriesItems, otherCostItems);

  return {
    ...r,
    consumptionUnit,
    fabricEntry,
    knitFabricItems,
    accessoriesItems,
    otherCostItems,
    items,
  };
}

// ── Reference Baseline Sample Data (Knit) ────────────────────────
const INITIAL_RECORDS: PreCostingRecord[] = [
  {
    id: "pc-kt-rec-1",
    preCostId: "PC-KT-2026-001",
    preCostNo: "KT-26918",
    preCostDate: "2026-09-15",
    contractNo: "CT-PKCL-2026-881",
    ourRef: "REF-99238",
    acHolder: "Md. Rashidul Islam",
    buyer: "H&M Hennes & Mauritz",
    merchandiser: "Tanvir Ahmed",
    style: "HM-KT-8841",
    styleDescription: "Ladies Ribbed Henley Neck Knit T-Shirt",
    season: "Autumn / Winter 2026",
    currency: "USD",
    smv: 4.62,
    cpm: 0.065,
    efficiencyPct: 65,
    note: "Style Pre Costing (Knit) based on confirmed tech pack v2. Fabric production scheduled in Mirzapur unit.",
    poRows: [
      { id: "po-kt-1", sl: 1, poNumber: "PO-HM-99881-A", poQuantity: 25000, rate: 4.15, value: 103750, remarks: "Main Lot Delivery" },
      { id: "po-kt-2", sl: 2, poNumber: "PO-HM-99881-B", poQuantity: 14024, rate: 4.15, value: 58199.6, remarks: "Repeat Shipment Lot" },
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
    fabricEntry: r.fabricEntry,
    knitFabricItems: r.knitFabricItems,
    accessoriesItems: r.accessoriesItems,
    otherCostItems: r.otherCostItems,
  } as any;
}

// ── Main Pre Costing (Knit) Component ────────────────────────────
export function PreCostingKnitManager({
  initialTab = "create",
  initialRecordId,
  onTabChange,
}: PreCostingKnitManagerProps) {
  const [records, setRecords] = useState<PreCostingRecord[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("cripton_pre_costings_knit_master_v1");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((r) => {
              const poVal = (r.poRows || []).reduce(
                (acc: number, p: any) => acc + (Number(p.value) || 0),
                0
              );
              const structured = ensureKnitCostingStructure(r, poVal);
              if (!structured.versions || structured.versions.length === 0) {
                structured.versions = [createVersionSnapshot(structured)];
              }
              return structured;
            });
          }
        }
      } catch (e) {
        console.error("Failed to load pre-costings from localStorage", e);
      }
    }
    // Initialize version snapshot for initial record
    const base = INITIAL_RECORDS.map((r) => {
      const poVal = (r.poRows || []).reduce(
        (acc: number, p: any) => acc + (Number(p.value) || 0),
        0
      );
      const structured = ensureKnitCostingStructure(r, poVal);
      const snap = createVersionSnapshot(structured);
      return { ...structured, versions: [snap] };
    });
    return base;
  });

  // Save to localStorage whenever records change
  useEffect(() => {
    try {
      localStorage.setItem("cripton_pre_costings_knit_master_v1", JSON.stringify(records));
    } catch (e) {
      console.error("Failed to persist pre-costings to localStorage", e);
    }
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

  // Synchronize view with initialTab and initialRecordId changes
  useEffect(() => {
    if (initialTab === "create") {
      setView("form");
      if (initialRecordId) {
        const found = records.find((r) => r.id === initialRecordId || r.preCostId === initialRecordId);
        if (found) {
          const poVal = (found.poRows || []).reduce((acc, p) => acc + (Number(p.value) || 0), 0);
          setFormData(ensureKnitCostingStructure(found, poVal));
          setFormMode("edit");
          try {
            localStorage.setItem("cripton_pre_costings_knit_active_id_v1", found.id);
          } catch {}
        } else {
          setFormMode("create");
        }
      }
    } else if (initialTab === "compare") {
      setView("compare");
    } else if (initialTab === "report") {
      setView("report");
    } else if (initialTab === "register") {
      setView("list");
    }
  }, [initialTab, initialRecordId, records]);

  // Master Data sources from MMRepository
  const [seasonsMaster] = useState<MMSeasonMasterItem[]>(() => MMRepository.getSeasons());
  const [fabricMasterItems] = useState<MMFabricMasterItem[]>(() => MMRepository.getFabricMaster());
  const [accessoriesMasterItems] = useState<MMAccessoriesMasterItem[]>(() => MMRepository.getAccessoriesMaster());
  const [suppliersMaster] = useState<any[]>(() => MMRepository.getSuppliers());

  // Merchandising Master Data sources for Knit Fabric & Yarn
  const [masterFabricCompositions] = useState<MMFabricComposition[]>(() => MMMasterDataRepository.getFabricCompositions());
  const [masterFabricTypes] = useState<MMFabricType[]>(() => MMMasterDataRepository.getFabricTypes());
  const [masterSpinningTypes] = useState<MMSpinningType[]>(() => MMMasterDataRepository.getSpinningTypes());
  const [masterYarnCounts] = useState<MMYarnCount[]>(() => MMMasterDataRepository.getYarnCounts());
  const [masterDyeingRates] = useState<MMDyeingRate[]>(() => MMMasterDataRepository.getDyeingRates());
  const [masterKnittingRates] = useState<MMKnittingRate[]>(() => MMMasterDataRepository.getKnittingRates());

  // 3 Sub-tabs under Item-wise Pre Costing Details
  const [activeCostingTab, setActiveCostingTab] = useState<"fabric" | "accessories" | "others">("fabric");

  // Yarn Details Modal State
  const [yarnModal, setYarnModal] = useState<{
    isOpen: boolean;
    rowIndex: number | null;
    requiredYarnKg: number;
    rows: KnitYarnDetailRow[];
    head: string;
    item: string;
  }>({
    isOpen: false,
    rowIndex: null,
    requiredYarnKg: 0,
    rows: [],
    head: "",
    item: "",
  });

  // Booking Tag Modal State
  const [bookingTagModal, setBookingTagModal] = useState<{
    isOpen: boolean;
    yarnRowIndex: number | null;
    yarnRowId: string;
    finalQtyKg: number;
    yarnItemName: string;
    selectedBookingNo: string;
    selectedYarnItemId: string;
  }>({
    isOpen: false,
    yarnRowIndex: null,
    yarnRowId: "",
    finalQtyKg: 0,
    yarnItemName: "",
    selectedBookingNo: "",
    selectedYarnItemId: "",
  });

  // Fabric Entry Specifications Modal State
  const [showFabricEntryModal, setShowFabricEntryModal] = useState<boolean>(false);
  const [tempFabricEntry, setTempFabricEntry] = useState<KnitFabricEntryData>({
    fabricComposition: "100% Combed Cotton",
    fabricType: "Single Jersey",
    gsm: 180,
    spinningType: "Ring Spun",
    otherSpecs: "",
    fabricCategory: "Knit Fabric",
  });

  // Options for Dropdowns
  const fabricCompositionOptions = useMemo(() => {
    return masterFabricCompositions
      .filter((fc) => fc.status === "Active")
      .map((fc) => ({
        value: fc.name,
        label: fc.name,
      }));
  }, [masterFabricCompositions]);

  const fabricItemOptions = useMemo(() => {
    return fabricMasterItems.map((f) => ({
      value: f.fabricDescription || f.fabricCode,
      label: `${f.fabricDescription || f.fabricCode}${f.gsm ? ` (${f.gsm} GSM)` : ""}`,
    }));
  }, [fabricMasterItems]);

  const getFabricItemOptions = (currentVal?: string) => {
    const opts = [...fabricItemOptions];
    if (currentVal && !opts.some((o) => o.value === currentVal)) {
      opts.unshift({ value: currentVal, label: currentVal });
    }
    return opts;
  };

  const yarnCountOptions = useMemo(() => {
    const active = masterYarnCounts.filter((yc) => yc.status === "Active");
    if (active.length > 0) {
      return active.map((yc) => ({
        value: yc.yarnCount,
        label: yc.yarnCount,
      }));
    }
    return [
      { value: "20/1 Ne", label: "20/1 Ne" },
      { value: "24/1 Ne", label: "24/1 Ne" },
      { value: "26/1 Ne", label: "26/1 Ne" },
      { value: "30/1 Ne", label: "30/1 Ne" },
      { value: "34/1 Ne", label: "34/1 Ne" },
      { value: "40/1 Ne", label: "40/1 Ne" },
    ];
  }, [masterYarnCounts]);

  const getYarnCountOptions = (currentVal?: string) => {
    const opts = [...yarnCountOptions];
    if (currentVal && !opts.some((o) => o.value === currentVal)) {
      opts.unshift({ value: currentVal, label: currentVal });
    }
    return opts;
  };

  const yarnCompositionOptions = useMemo(() => {
    return masterFabricCompositions
      .filter((fc) => fc.status === "Active")
      .map((fc) => ({
        value: fc.name,
        label: fc.name,
      }));
  }, [masterFabricCompositions]);

  const getYarnCompositionOptions = (currentVal?: string) => {
    const opts = [...yarnCompositionOptions];
    if (currentVal && !opts.some((o) => o.value === currentVal)) {
      opts.unshift({ value: currentVal, label: currentVal });
    }
    return opts;
  };

  const vendorOptions = useMemo(() => {
    return suppliersMaster.map((s) => ({
      value: s.name,
      label: s.country ? `${s.name} (${s.country})` : s.name,
    }));
  }, [suppliersMaster]);

  const getVendorOptions = (currentVal?: string) => {
    const opts = [...vendorOptions];
    if (currentVal && !opts.some((o) => o.value === currentVal)) {
      opts.unshift({ value: currentVal, label: currentVal });
    }
    return opts;
  };

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

    const rawRecord: PreCostingRecord = {
      id: `pc-kt-${Date.now()}`,
      preCostId: `JOB-KT-2026-${String(nextSl).padStart(4, "0")}`,
      preCostNo: `KT-${26920 + nextSl}`,
      preCostDate: new Date().toISOString().split("T")[0],
      contractNo: "",
      ourRef: "",
      acHolder: defaultBuyer?.accountHolder || "Md. Rashidul Islam",
      buyer: defaultBuyer?.name || "H&M Hennes & Mauritz",
      merchandiser: loggedInUser,
      style: defaultStyle?.styleNo || "HM-KT-8841",
      styleDescription: defaultStyle?.description || "Ladies Ribbed Henley Neck Knit T-Shirt",
      season: defaultSeason,
      currency: "USD",
      consumptionUnit: "DZ",
      smv: 4.25,
      cpm: 0.065,
      efficiencyPct: 65,
      note: "Initial knit style pre-costing estimation.",
      poRows: [
        { id: `po-kt-new-${Date.now()}-1`, sl: 1, poNumber: `PO-${defaultStyle?.styleNo || "STYLE"}-001`, poQuantity: 20000, rate: 4.25, value: 85000, remarks: "Main Lot Delivery" },
      ],
      items: [],
      attachments: [],
      status: "Draft",
      version: 1,
      isCurrentActive: false,
      createdBy: `${loggedInUser} (Merchandiser)`,
      createdDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      versions: [],
      auditHistory: [],
    };

    return ensureKnitCostingStructure(rawRecord, 85000);
  };

  const handleTabClick = (tabKey: "register" | "create" | "compare") => {
    if (tabKey === "register") {
      setView("list");
      onTabChange?.("register");
    } else if (tabKey === "create") {
      const newRec = createNewFormData();
      setFormData(newRec);
      setFormMode("create");
      setView("form");
      try {
        localStorage.setItem("cripton_pre_costings_knit_active_id_v1", newRec.id);
      } catch {}
      onTabChange?.("create", newRec.id);
    } else if (tabKey === "compare") {
      if (!compareRecord && records.length > 0) {
        setCompareRecord(records[0]);
      }
      setView("compare");
      onTabChange?.("compare");
    }
  };

  // ── Form State (Restores saved record or active draft on mount/refresh) ─────
  const [formData, setFormData] = useState<PreCostingRecord>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("cripton_pre_costings_knit_master_v1");
        const list: PreCostingRecord[] = stored ? JSON.parse(stored) : [];
        if (Array.isArray(list) && list.length > 0) {
          // 1. Explicit ID in search params or prop
          const urlParams = new URLSearchParams(window.location.search);
          const targetId = initialRecordId || urlParams.get("id");
          if (targetId) {
            const found = list.find((r) => r.id === targetId || r.preCostId === targetId);
            if (found) {
              const poVal = (found.poRows || []).reduce(
                (acc, p) => acc + (Number(p.value) || 0),
                0
              );
              return ensureKnitCostingStructure(found, poVal);
            }
          }

          // 2. Active editing draft ID in localStorage
          const activeId = localStorage.getItem("cripton_pre_costings_knit_active_id_v1");
          if (activeId && initialTab === "create") {
            const found = list.find((r) => r.id === activeId);
            if (found) {
              const poVal = (found.poRows || []).reduce(
                (acc, p) => acc + (Number(p.value) || 0),
                0
              );
              return ensureKnitCostingStructure(found, poVal);
            }
          }
        }
      } catch (e) {
        console.error("Failed to restore initial formData from localStorage:", e);
      }
    }
    return createNewFormData();
  });

  // Automatically persist formData to records & localStorage whenever formData changes in form view
  useEffect(() => {
    if (view !== "form") return;
    if (!formData || !formData.id) return;

    setRecords((prev) => {
      const idx = prev.findIndex((r) => r.id === formData.id);
      if (idx >= 0) {
        const existing = prev[idx];
        if (existing === formData) return prev;
        const copy = [...prev];
        copy[idx] = { ...formData };
        return copy;
      } else {
        return [{ ...formData }, ...prev];
      }
    });

    try {
      localStorage.setItem("cripton_pre_costings_knit_active_id_v1", formData.id);
    } catch {}
  }, [formData, view]);

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

  // Calculate Section 3 Sub-Totals & Overall Total
  const totalFabricCost = useMemo(() => {
    return (formData.knitFabricItems || []).reduce((acc, row) => acc + (Number(row.totalAmount) || 0), 0);
  }, [formData.knitFabricItems]);

  const totalAccessoriesCost = useMemo(() => {
    return (formData.accessoriesItems || []).reduce((acc, row) => acc + (Number(row.amount) || 0), 0);
  }, [formData.accessoriesItems]);

  const totalOthersCost = useMemo(() => {
    return (formData.otherCostItems || []).reduce((acc, row) => acc + (Number(row.amount) || 0), 0);
  }, [formData.otherCostItems]);

  // Calculate Total Cost & Surplus
  const totalCost = useMemo(() => {
    const sum = totalFabricCost + totalAccessoriesCost + totalOthersCost;
    if (sum > 0) return Number(sum.toFixed(2));
    return (formData.items || []).reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  }, [totalFabricCost, totalAccessoriesCost, totalOthersCost, formData.items]);

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

  // ── Knit Fabric Cost Handlers ──────────────────────────────────
  const handleOpenFabricEntryModal = () => {
    setTempFabricEntry(
      formData.fabricEntry || {
        fabricComposition: "100% Combed Cotton",
        fabricType: "Single Jersey",
        gsm: 180,
        spinningType: "Ring Spun",
        otherSpecs: "",
        fabricCategory: "Knit Fabric",
      }
    );
    setShowFabricEntryModal(true);
  };

  const handleSaveFabricEntryModal = () => {
    if (formMode === "view") {
      setShowFabricEntryModal(false);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      fabricEntry: { ...tempFabricEntry },
    }));
    setShowFabricEntryModal(false);
    toast.success("Fabric Entry Specifications saved.");
  };

  const handleFabricEntryChange = (field: keyof KnitFabricEntryData, value: any) => {
    if (formMode === "view") return;
    setFormData((prev) => ({
      ...prev,
      fabricEntry: {
        ...(prev.fabricEntry || {
          fabricComposition: "100% Combed Cotton",
          fabricType: "Single Jersey",
          gsm: 180,
          spinningType: "Ring Spun",
          otherSpecs: "Bio-washed combed cotton",
          fabricCategory: "Knit Fabric",
        }),
        [field]: value,
      },
    }));
  };

  const handleAddFabricItem = () => {
    if (formMode === "view") return;
    const nextSl = (formData.knitFabricItems || []).length + 1;
    const orderPcs = consolidatedOrderQty > 0 ? consolidatedOrderQty : 10000;
    const comp = formData.fabricEntry?.fabricComposition || "100% Combed Cotton";
    const fType = formData.fabricEntry?.fabricType || "Single Jersey";
    const gsm = formData.fabricEntry?.gsm || 180;
    const defaultCount = masterYarnCounts[0]?.yarnCount || "30/1";
    const defaultColor = "Solid";

    const defaultYarn: KnitYarnDetailRow = {
      id: `yd-${Date.now()}-1`,
      sl: 1,
      grade: "A",
      colorType: defaultColor,
      yarnCount: defaultCount,
      yarnComposition: comp,
      yarnItem: `${defaultCount} ${comp} ${defaultColor}`,
      ratioPct: 100,
      finalQtyKg: 0,
      ratePerKg: 3.45,
      yarnCost: 0,
      brand: suppliersMaster[0]?.name || "Square Textiles Ltd",
    };

    const newRow = computeKnitFabricRow({
      id: `kfi-${Date.now()}-${nextSl}`,
      sl: nextSl,
      head: nextSl === 1 ? "Shell" : nextSl === 2 ? "Rib / Trims" : "Shell",
      item: `${comp} ${fType} ${gsm} GSM`,
      effectedQtyPcs: orderPcs,
      consumptionKgDz: 2.45,
      rmgProcessLossPct: 3.0,
      colorShade: "Medium",
      dyeingMethod: "Reactive Dyeing",
      dyeingProcessLossPct: 4.0,
      dyeingRate: 1.65,
      knittingProcessLossPct: 3.0,
      knittingRate: 0.35,
      yarnDetails: [defaultYarn],
    }, formData.consumptionUnit || "DZ");

    setFormData((prev) => {
      const updatedFabric = [...(prev.knitFabricItems || []), newRow];
      const syncedItems = syncAllCostingItems(updatedFabric, prev.accessoriesItems || [], prev.otherCostItems || []);
      return {
        ...prev,
        knitFabricItems: updatedFabric,
        items: syncedItems,
      };
    });
  };

  const handleUpdateFabricItem = (index: number, field: keyof KnitFabricCostItemRow, value: any) => {
    if (formMode === "view") return;
    setFormData((prev) => {
      const copy = [...(prev.knitFabricItems || [])];
      const target = { ...copy[index], [field]: value };

      // Auto-fill dyeing rate/loss if shade or method changed
      if (field === "colorShade" || field === "dyeingMethod") {
        const shade = field === "colorShade" ? value : target.colorShade;
        const method = field === "dyeingMethod" ? value : target.dyeingMethod;
        const matchedDye = masterDyeingRates.find(
          (d) =>
            d.colorShade?.toLowerCase() === String(shade).toLowerCase() &&
            d.dyeingMethod?.toLowerCase() === String(method).toLowerCase()
        );
        if (matchedDye) {
          target.dyeingRate = matchedDye.rate;
          target.dyeingProcessLossPct = matchedDye.processLoss;
        }
      }

      // Auto-fill knitting rate if fabric type changed
      if (field === "head" || field === "item") {
        const textToMatch = String(target.item || formData.fabricEntry?.fabricType || "").toLowerCase();
        const matchedKnit = masterKnittingRates.find((k) =>
          textToMatch.includes((k.fabricTypeName || (k as any).fabricType || "").toLowerCase())
        );
        if (matchedKnit) {
          target.knittingRate = matchedKnit.knittingRate ?? (matchedKnit as any).rate ?? 0.35;
          target.knittingProcessLossPct = matchedKnit.processLossPct ?? (matchedKnit as any).processLoss ?? 3.0;
        }
      }

      copy[index] = computeKnitFabricRow(target, prev.consumptionUnit || "DZ");
      const syncedItems = syncAllCostingItems(copy, prev.accessoriesItems || [], prev.otherCostItems || []);
      return {
        ...prev,
        knitFabricItems: copy,
        items: syncedItems,
      };
    });
  };

  const handleRemoveFabricItem = (index: number) => {
    if (formMode === "view") return;
    setFormData((prev) => {
      const filtered = (prev.knitFabricItems || []).filter((_, i) => i !== index);
      const reindexed = filtered.map((row, i) => ({ ...row, sl: i + 1 }));
      const syncedItems = syncAllCostingItems(reindexed, prev.accessoriesItems || [], prev.otherCostItems || []);
      return {
        ...prev,
        knitFabricItems: reindexed,
        items: syncedItems,
      };
    });
  };

  // ── Yarn Details Modal Handlers ────────────────────────────────
  const handleOpenYarnModal = (rowIndex: number) => {
    const row = (formData.knitFabricItems || [])[rowIndex];
    if (!row) return;

    const initialRows = (row.yarnDetails && row.yarnDetails.length > 0)
      ? row.yarnDetails.map((y) => {
          const c = y.yarnCount || masterYarnCounts[0]?.yarnCount || "30/1";
          const comp = y.yarnComposition || formData.fabricEntry?.fabricComposition || "100% Combed Cotton";
          const col = y.colorType || "Solid";
          const g = y.grade === "Grade B" ? "B" : y.grade === "B" ? "B" : "A";
          const savedTag = y.bookingTag || MMRepository.getYarnBookingTagByRowId(y.id);
          return {
            ...y,
            grade: g,
            yarnCount: c,
            yarnComposition: comp,
            colorType: col,
            yarnItem: y.yarnItem || [c, comp, col].filter(Boolean).join(" "),
            brand: y.brand || suppliersMaster[0]?.name || "Square Textiles Ltd",
            bookingTag: savedTag,
          };
        })
      : [
          {
            id: `yd-${Date.now()}-1`,
            sl: 1,
            grade: "A",
            colorType: "Solid",
            yarnCount: masterYarnCounts[0]?.yarnCount || "30/1",
            yarnComposition: formData.fabricEntry?.fabricComposition || "100% Combed Cotton",
            yarnItem: `${masterYarnCounts[0]?.yarnCount || "30/1"} ${formData.fabricEntry?.fabricComposition || "100% Combed Cotton"} Solid`,
            ratioPct: 100,
            finalQtyKg: row.requiredYarnKg,
            ratePerKg: 3.45,
            yarnCost: Number((row.requiredYarnKg * 3.45).toFixed(2)),
            brand: suppliersMaster[0]?.name || "Square Textiles Ltd",
          },
        ];

    const recalculatedRows = initialRows.map((y, idx) => {
      const finalQty = Number((row.requiredYarnKg * ((Number(y.ratioPct) || 0) / 100)).toFixed(2));
      const yarnCost = Number((finalQty * (Number(y.ratePerKg) || 0)).toFixed(2));
      return { ...y, sl: idx + 1, finalQtyKg: finalQty, yarnCost };
    });

    setYarnModal({
      isOpen: true,
      rowIndex,
      requiredYarnKg: row.requiredYarnKg,
      rows: recalculatedRows,
      head: row.head,
      item: row.item,
    });
  };

  const handleAddYarnModalRow = () => {
    const nextSl = yarnModal.rows.length + 1;
    const currentSum = yarnModal.rows.reduce((s, y) => s + (Number(y.ratioPct) || 0), 0);
    const rem = Math.max(0, 100 - currentSum);
    const ratio = rem > 0 ? rem : 10;
    const finalQty = Number((yarnModal.requiredYarnKg * (ratio / 100)).toFixed(2));
    const rate = 3.50;
    const cost = Number((finalQty * rate).toFixed(2));
    const countVal = masterYarnCounts[0]?.yarnCount || "30/1";
    const compVal = formData.fabricEntry?.fabricComposition || "100% Combed Cotton";
    const colVal = "Solid";

    const newRow: KnitYarnDetailRow = {
      id: `yd-m-${Date.now()}-${nextSl}`,
      sl: nextSl,
      grade: "A",
      colorType: colVal,
      yarnCount: countVal,
      yarnComposition: compVal,
      yarnItem: `${countVal} ${compVal} ${colVal}`,
      ratioPct: ratio,
      finalQtyKg: finalQty,
      ratePerKg: rate,
      yarnCost: cost,
      brand: suppliersMaster[0]?.name || "Square Textiles Ltd",
    };

    setYarnModal((prev) => ({
      ...prev,
      rows: [...prev.rows, newRow],
    }));
  };

  const handleUpdateYarnModalRow = (idx: number, field: keyof KnitYarnDetailRow, value: any) => {
    setYarnModal((prev) => {
      const copy = [...prev.rows];
      const target = { ...copy[idx], [field]: value };
      if (field === "ratioPct" || field === "ratePerKg") {
        const ratio = field === "ratioPct" ? Number(value) || 0 : Number(target.ratioPct) || 0;
        const rate = field === "ratePerKg" ? Number(value) || 0 : Number(target.ratePerKg) || 0;
        target.finalQtyKg = Number((prev.requiredYarnKg * (ratio / 100)).toFixed(2));
        target.yarnCost = Number((target.finalQtyKg * rate).toFixed(2));
      }
      if (field === "yarnCount" || field === "yarnComposition" || field === "colorType") {
        const c = field === "yarnCount" ? value : target.yarnCount;
        const comp = field === "yarnComposition" ? value : target.yarnComposition;
        const col = field === "colorType" ? value : target.colorType;
        target.yarnItem = [c, comp, col].filter(Boolean).join(" ");
      }
      copy[idx] = target;
      return { ...prev, rows: copy };
    });
  };

  const handleRemoveYarnModalRow = (idx: number) => {
    setYarnModal((prev) => {
      const rowToRemove = prev.rows[idx];
      if (rowToRemove?.id) {
        MMRepository.removeYarnBookingTag(rowToRemove.id);
      }
      const filtered = prev.rows.filter((_, i) => i !== idx);
      const reindexed = filtered.map((r, i) => ({ ...r, sl: i + 1 }));
      return { ...prev, rows: reindexed };
    });
  };

  const handleSaveYarnModal = () => {
    if (yarnModal.rowIndex === null) return;
    const idx = yarnModal.rowIndex;
    const totalRatio = yarnModal.rows.reduce((s, y) => s + (Number(y.ratioPct) || 0), 0);
    if (Math.abs(totalRatio - 100) > 0.5) {
      toast.warning(`Total Yarn Ratio is ${totalRatio.toFixed(1)}%. Note: Expected ratio total is 100%.`);
    }

    setFormData((prev) => {
      const copy = [...(prev.knitFabricItems || [])];
      if (!copy[idx]) return prev;
      const target = { ...copy[idx], yarnDetails: yarnModal.rows };
      copy[idx] = computeKnitFabricRow(target, prev.consumptionUnit || "DZ");
      const syncedItems = syncAllCostingItems(copy, prev.accessoriesItems || [], prev.otherCostItems || []);
      return {
        ...prev,
        knitFabricItems: copy,
        items: syncedItems,
      };
    });

    setYarnModal((prev) => ({ ...prev, isOpen: false, rowIndex: null }));
    toast.success("Yarn details saved and fabric costing updated.");
  };

  // ── Booking Tag Modal Handlers & Dynamic Balance Calculations ──
  const handleOpenBookingTagModal = (yIdx: number, yRow: KnitYarnDetailRow) => {
    const existingTag = yRow.bookingTag || MMRepository.getYarnBookingTagByRowId(yRow.id);
    const finalQty = Number(yRow.finalQtyKg) || 0;

    let initBookingNo = existingTag?.blockBookingNo || "";
    let initYarnItemId = existingTag?.yarnItemId || "";

    const allBookings = MMRepository.getManualBookings();

    // If not tagged yet, find first available booking that has yarn items with available balance
    if (!initBookingNo && allBookings.length > 0) {
      const firstValidBooking = allBookings.find((b) =>
        (b.items || []).some((it) => {
          const bal = MMRepository.getAvailableYarnBookingBalance(
            b.bookingNo,
            it.bookingItemId,
            it.itemDescription,
            yRow.id
          );
          return bal.availableKg > 0;
        })
      );
      if (firstValidBooking) {
        initBookingNo = firstValidBooking.bookingNo;
        const validItem = (firstValidBooking.items || []).find((it) => {
          const bal = MMRepository.getAvailableYarnBookingBalance(
            firstValidBooking.bookingNo,
            it.bookingItemId,
            it.itemDescription,
            yRow.id
          );
          return bal.availableKg > 0;
        });
        if (validItem) {
          initYarnItemId = validItem.bookingItemId || (validItem as any).id || "";
        }
      }
    }

    setBookingTagModal({
      isOpen: true,
      yarnRowIndex: yIdx,
      yarnRowId: yRow.id,
      finalQtyKg: finalQty,
      yarnItemName: yRow.yarnItem || "",
      selectedBookingNo: initBookingNo,
      selectedYarnItemId: initYarnItemId,
    });
  };

  const activeBooking = useMemo(() => {
    if (!bookingTagModal.selectedBookingNo) return null;
    const allBookings = MMRepository.getManualBookings();
    return (
      allBookings.find(
        (b) =>
          b.bookingNo === bookingTagModal.selectedBookingNo ||
          b.id === bookingTagModal.selectedBookingNo
      ) || null
    );
  }, [bookingTagModal.selectedBookingNo]);

  const activeYarnItem = useMemo(() => {
    if (!activeBooking || !activeBooking.items) return null;
    return (
      activeBooking.items.find(
        (it) =>
          it.bookingItemId === bookingTagModal.selectedYarnItemId ||
          (it as any).id === bookingTagModal.selectedYarnItemId
      ) || null
    );
  }, [activeBooking, bookingTagModal.selectedYarnItemId]);

  const tagBalanceInfo = useMemo(() => {
    if (!bookingTagModal.selectedBookingNo || !bookingTagModal.selectedYarnItemId) {
      return { totalBookedKg: 0, consumedKg: 0, availableKg: 0, remainingKg: 0, isShortage: false };
    }
    const bal = MMRepository.getAvailableYarnBookingBalance(
      bookingTagModal.selectedBookingNo,
      bookingTagModal.selectedYarnItemId,
      activeYarnItem?.itemDescription,
      bookingTagModal.yarnRowId
    );
    const tagQty = Number(bookingTagModal.finalQtyKg) || 0;
    const remainingKg = Number((bal.availableKg - tagQty).toFixed(2));
    const isShortage = tagQty > bal.availableKg;

    return {
      totalBookedKg: bal.totalBookedKg,
      consumedKg: bal.consumedKg,
      availableKg: bal.availableKg,
      remainingKg,
      isShortage,
    };
  }, [
    bookingTagModal.selectedBookingNo,
    bookingTagModal.selectedYarnItemId,
    bookingTagModal.yarnRowId,
    bookingTagModal.finalQtyKg,
    activeYarnItem,
  ]);

  const blockBookingDropdownOptions = useMemo(() => {
    const allBookings = MMRepository.getManualBookings();
    return allBookings
      .filter((b) => {
        if (b.bookingNo === bookingTagModal.selectedBookingNo) return true;
        return (b.items || []).some((it) => {
          const bal = MMRepository.getAvailableYarnBookingBalance(
            b.bookingNo,
            it.bookingItemId,
            it.itemDescription,
            bookingTagModal.yarnRowId
          );
          return bal.availableKg > 0;
        });
      })
      .map((b) => {
        const totalAvail = (b.items || []).reduce((sum, it) => {
          const bal = MMRepository.getAvailableYarnBookingBalance(
            b.bookingNo,
            it.bookingItemId,
            it.itemDescription,
            bookingTagModal.yarnRowId
          );
          return sum + bal.availableKg;
        }, 0);
        return {
          value: b.bookingNo,
          label: `${b.bookingNo} — ${b.supplierName || "Mill"} (Available: ${totalAvail.toLocaleString()} KG)`,
        };
      });
  }, [bookingTagModal.yarnRowId, bookingTagModal.selectedBookingNo]);

  const yarnItemDropdownOptions = useMemo(() => {
    if (!activeBooking || !activeBooking.items) return [];
    return activeBooking.items.map((it) => {
      const bal = MMRepository.getAvailableYarnBookingBalance(
        activeBooking.bookingNo,
        it.bookingItemId,
        it.itemDescription,
        bookingTagModal.yarnRowId
      );
      const idVal = it.bookingItemId || (it as any).id || it.itemDescription;
      return {
        value: idVal,
        label: `${it.itemDescription} (Available: ${bal.availableKg.toLocaleString()} KG / Booked: ${bal.totalBookedKg.toLocaleString()} KG)`,
      };
    });
  }, [activeBooking, bookingTagModal.yarnRowId]);

  const handleSelectBookingNo = (bNo: string) => {
    const allBookings = MMRepository.getManualBookings();
    const b = allBookings.find((x) => x.bookingNo === bNo || x.id === bNo);
    let nextItemId = "";
    if (b && b.items && b.items.length > 0) {
      const itemWithBal = b.items.find((it) => {
        const bal = MMRepository.getAvailableYarnBookingBalance(
          b.bookingNo,
          it.bookingItemId,
          it.itemDescription,
          bookingTagModal.yarnRowId
        );
        return bal.availableKg > 0;
      });
      nextItemId = (itemWithBal || b.items[0]).bookingItemId || ((itemWithBal || b.items[0]) as any).id || "";
    }
    setBookingTagModal((prev) => ({
      ...prev,
      selectedBookingNo: bNo,
      selectedYarnItemId: nextItemId,
    }));
  };

  const handleSaveBookingTagModal = () => {
    if (!bookingTagModal.selectedBookingNo || !bookingTagModal.selectedYarnItemId) {
      toast.error("Please select a Block Booking No. and Yarn Item.");
      return;
    }
    if (tagBalanceInfo.isShortage) {
      toast.error("Tag QTY exceeds available booking balance.");
      return;
    }
    if (bookingTagModal.yarnRowIndex === null) return;

    const preCostId =
      formData.preCostId ||
      (formData as any).header?.preCostId ||
      formData.id ||
      "pre-cost";

    const tagRecord: MMYarnBookingTagRecord = {
      id: `ytag-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      preCostId: preCostId,
      yarnRowId: bookingTagModal.yarnRowId,
      blockBookingNo: bookingTagModal.selectedBookingNo,
      blockBookingId: activeBooking?.id || bookingTagModal.selectedBookingNo,
      yarnItemId: bookingTagModal.selectedYarnItemId,
      yarnItemName: activeYarnItem?.itemDescription || "",
      supplierName: activeBooking?.supplierName || "",
      tagQtyKg: bookingTagModal.finalQtyKg,
      availableBalanceAtTag: tagBalanceInfo.availableKg,
      remainingBalanceAtTag: tagBalanceInfo.remainingKg,
      taggedAt: new Date().toISOString(),
    };

    MMRepository.saveYarnBookingTag(tagRecord);

    setYarnModal((prev) => {
      const copy = [...prev.rows];
      if (bookingTagModal.yarnRowIndex !== null && copy[bookingTagModal.yarnRowIndex]) {
        copy[bookingTagModal.yarnRowIndex] = {
          ...copy[bookingTagModal.yarnRowIndex],
          bookingTag: tagRecord,
        };
      }
      return { ...prev, rows: copy };
    });

    // Also immediately update formData.knitFabricItems so the tag is persisted in the record
    if (yarnModal.rowIndex !== null) {
      const fIdx = yarnModal.rowIndex;
      setFormData((prev) => {
        const copyFabric = [...(prev.knitFabricItems || [])];
        if (!copyFabric[fIdx]) return prev;
        const copyYarn = [...(copyFabric[fIdx].yarnDetails || [])];
        if (bookingTagModal.yarnRowIndex !== null && copyYarn[bookingTagModal.yarnRowIndex]) {
          copyYarn[bookingTagModal.yarnRowIndex] = {
            ...copyYarn[bookingTagModal.yarnRowIndex],
            bookingTag: tagRecord,
          };
          copyFabric[fIdx] = {
            ...copyFabric[fIdx],
            yarnDetails: copyYarn,
          };
        }
        return {
          ...prev,
          knitFabricItems: copyFabric,
        };
      });
    }

    toast.success(
      `Yarn row tagged to Block Booking ${tagRecord.blockBookingNo} (${tagRecord.tagQtyKg.toLocaleString()} KG).`
    );
    setBookingTagModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleRemoveBookingTagModal = () => {
    if (bookingTagModal.yarnRowId) {
      MMRepository.removeYarnBookingTag(bookingTagModal.yarnRowId);
    }
    setYarnModal((prev) => {
      const copy = [...prev.rows];
      if (bookingTagModal.yarnRowIndex !== null && copy[bookingTagModal.yarnRowIndex]) {
        copy[bookingTagModal.yarnRowIndex] = {
          ...copy[bookingTagModal.yarnRowIndex],
          bookingTag: undefined,
        };
      }
      return { ...prev, rows: copy };
    });

    // Also immediately update formData.knitFabricItems
    if (yarnModal.rowIndex !== null) {
      const fIdx = yarnModal.rowIndex;
      setFormData((prev) => {
        const copyFabric = [...(prev.knitFabricItems || [])];
        if (!copyFabric[fIdx]) return prev;
        const copyYarn = [...(copyFabric[fIdx].yarnDetails || [])];
        if (bookingTagModal.yarnRowIndex !== null && copyYarn[bookingTagModal.yarnRowIndex]) {
          copyYarn[bookingTagModal.yarnRowIndex] = {
            ...copyYarn[bookingTagModal.yarnRowIndex],
            bookingTag: undefined,
          };
          copyFabric[fIdx] = {
            ...copyFabric[fIdx],
            yarnDetails: copyYarn,
          };
        }
        return {
          ...prev,
          knitFabricItems: copyFabric,
        };
      });
    }

    toast.success("Booking tag removed. Balance released back to block booking.");
    setBookingTagModal((prev) => ({ ...prev, isOpen: false }));
  };

  // ── Accessories Cost Handlers ──────────────────────────────────
  const handleAddAccessoryRow = () => {
    if (formMode === "view") return;
    const nextSl = (formData.accessoriesItems || []).length + 1;
    const defaultEffQty = consolidatedOrderQty > 0 ? consolidatedOrderQty : 20000;
    const unit = formData.consumptionUnit || "DZ";
    const baseQty = unit === "PCS" ? defaultEffQty : defaultEffQty / 12;
    const reqQty = Number((baseQty * 1.0).toFixed(2));
    const firstAcc = accessoriesMasterItems[0];

    const newItem: PreCostingItemRow = {
      id: `acc-${Date.now()}-${nextSl}`,
      sl: nextSl,
      preCostItemId: `PCI-ACC-${formData.version}-${nextSl}`,
      head: "Trim",
      item: firstAcc?.itemName || "Sewing Thread 100% Spun Polyester",
      description: firstAcc ? `${firstAcc.category} - ${firstAcc.description}` : "High tenacity sewing thread",
      nStatus: "Nominated",
      supplier: suppliersMaster[0]?.name || DEFAULT_SUPPLIERS[0],
      effectedQty: defaultEffQty,
      consumption: 1.0,
      unit: firstAcc?.unit || "Pcs",
      requiredQty: reqQty,
      finalQty: Number((reqQty * 1.05).toFixed(2)),
      rate: firstAcc?.defaultRate || 0.15,
      amount: Number((reqQty * 1.05 * (firstAcc?.defaultRate || 0.15)).toFixed(2)),
      preCostPct: 0,
    };

    setFormData((prev) => {
      const updatedAcc = [...(prev.accessoriesItems || []), newItem];
      const syncedItems = syncAllCostingItems(prev.knitFabricItems || [], updatedAcc, prev.otherCostItems || []);
      return {
        ...prev,
        accessoriesItems: updatedAcc,
        items: syncedItems,
      };
    });
  };

  const handleUpdateAccessoryRow = (index: number, field: keyof PreCostingItemRow, value: any) => {
    if (formMode === "view") return;
    setFormData((prev) => {
      const copy = [...(prev.accessoriesItems || [])];
      const target = { ...copy[index], [field]: value };
      if (field === "item") {
        const found = accessoriesMasterItems.find((a) => a.itemName === value);
        if (found) {
          target.description = `${found.category} - ${found.description}`;
          target.unit = found.unit || target.unit || "Pcs";
          if (found.defaultRate) {
            target.rate = found.defaultRate;
          }
        }
      }
      if (field === "effectedQty" || field === "consumption" || field === "finalQty" || field === "rate" || field === "item") {
        const eff = field === "effectedQty" ? Number(value) || 0 : Number(target.effectedQty) || 0;
        const cons = field === "consumption" ? Number(value) || 0 : Number(target.consumption) || 0;
        const unit = prev.consumptionUnit || "DZ";
        const baseQty = unit === "PCS" ? eff : eff / 12;
        target.requiredQty = Number((baseQty * cons).toFixed(2));
        if (field !== "finalQty") {
          target.finalQty = Number((target.requiredQty * 1.05).toFixed(2));
        }
        const fin = Number(target.finalQty) || 0;
        const r = Number(target.rate) || 0;
        target.amount = Number((fin * r).toFixed(2));
      }
      copy[index] = target;
      const syncedItems = syncAllCostingItems(prev.knitFabricItems || [], copy, prev.otherCostItems || []);
      return {
        ...prev,
        accessoriesItems: copy,
        items: syncedItems,
      };
    });
  };

  const handleRemoveAccessoryRow = (index: number) => {
    if (formMode === "view") return;
    setFormData((prev) => {
      const filtered = (prev.accessoriesItems || []).filter((_, i) => i !== index);
      const reindexed = filtered.map((r, i) => ({ ...r, sl: i + 1 }));
      const syncedItems = syncAllCostingItems(prev.knitFabricItems || [], reindexed, prev.otherCostItems || []);
      return {
        ...prev,
        accessoriesItems: reindexed,
        items: syncedItems,
      };
    });
  };

  // ── Others Cost Handlers ───────────────────────────────────────
  const handleAddOtherCostRow = () => {
    if (formMode === "view") return;
    const nextSl = (formData.otherCostItems || []).length + 1;
    const gmtQty = consolidatedOrderQty > 0 ? consolidatedOrderQty : 20000;
    const qtyInDz = Number((gmtQty / 12).toFixed(2));
    const unitRateDz = 0.5;
    const newRow = computeOtherCostRow(
      {
        id: `oth-${Date.now()}-${nextSl}`,
        sl: nextSl,
        costHead: "Commercial & Freight",
        description: "Sea freight forwarding and terminal handling charges",
        calcBasis: "Per Dozen",
        gmtQty,
        qtyInDz,
        unitRateDz,
        amount: Number((qtyInDz * unitRateDz).toFixed(2)),
        currency: "USD",
      },
      totalPoValue,
      gmtQty
    );

    setFormData((prev) => {
      const updatedOthers = [...(prev.otherCostItems || []), newRow];
      const syncedItems = syncAllCostingItems(prev.knitFabricItems || [], prev.accessoriesItems || [], updatedOthers);
      return {
        ...prev,
        otherCostItems: updatedOthers,
        items: syncedItems,
      };
    });
  };

  const handleUpdateOtherCostRow = (index: number, field: keyof KnitOtherCostRow, value: any) => {
    if (formMode === "view") return;
    setFormData((prev) => {
      const copy = [...(prev.otherCostItems || [])];
      const target = { ...copy[index], [field]: value };
      copy[index] = computeOtherCostRow(target, totalPoValue, consolidatedOrderQty);
      const syncedItems = syncAllCostingItems(prev.knitFabricItems || [], prev.accessoriesItems || [], copy);
      return {
        ...prev,
        otherCostItems: copy,
        items: syncedItems,
      };
    });
  };

  const handleRemoveOtherCostRow = (index: number) => {
    if (formMode === "view") return;
    setFormData((prev) => {
      const filtered = (prev.otherCostItems || []).filter((_, i) => i !== index);
      const reindexed = filtered.map((r, i) => ({ ...r, sl: i + 1 }));
      const syncedItems = syncAllCostingItems(prev.knitFabricItems || [], prev.accessoriesItems || [], reindexed);
      return {
        ...prev,
        otherCostItems: reindexed,
        items: syncedItems,
      };
    });
  };

  // ── Consumption Unit Toggle Handler ───────────────────────────
  const handleConsumptionUnitChange = (newUnit: "PCS" | "DZ") => {
    if (formMode === "view" || formData.consumptionUnit === newUnit) return;
    setFormData((prev) => {
      const updatedFabric = (prev.knitFabricItems || []).map((row) =>
        computeKnitFabricRow(row, newUnit)
      );
      const updatedAccessories = (prev.accessoriesItems || []).map((row) => {
        const eff = Number(row.effectedQty) || 0;
        const cons = Number(row.consumption) || 0;
        const baseQty = newUnit === "PCS" ? eff : eff / 12;
        const requiredQty = Number((baseQty * cons).toFixed(2));
        const finalQty = Number((requiredQty * 1.05).toFixed(2));
        const rate = Number(row.rate) || 0;
        const amount = Number((finalQty * rate).toFixed(2));
        return {
          ...row,
          requiredQty,
          finalQty,
          amount,
        };
      });
      const updatedOthers = (prev.otherCostItems || []).map((row) =>
        computeOtherCostRow(row, totalPoValue, consolidatedOrderQty)
      );
      const syncedItems = syncAllCostingItems(updatedFabric, updatedAccessories, updatedOthers);
      return {
        ...prev,
        consumptionUnit: newUnit,
        knitFabricItems: updatedFabric,
        accessoriesItems: updatedAccessories,
        otherCostItems: updatedOthers,
        items: syncedItems,
      };
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

    // Synchronous immediate LocalStorage persistence
    try {
      const currentStored = localStorage.getItem("cripton_pre_costings_knit_master_v1");
      const list: PreCostingRecord[] = currentStored ? JSON.parse(currentStored) : [];
      const idx = list.findIndex((r) => r.id === updatedRecord.id);
      if (idx >= 0) {
        list[idx] = updatedRecord;
      } else {
        list.unshift(updatedRecord);
      }
      localStorage.setItem("cripton_pre_costings_knit_master_v1", JSON.stringify(list));
      localStorage.setItem("cripton_pre_costings_knit_active_id_v1", updatedRecord.id);
    } catch (e) {
      console.error("Failed to save draft to localStorage:", e);
    }

    toast.success(`Pre Costing (Knit) ${updatedRecord.preCostId} saved as Draft.`);
    setView("list");
    onTabChange?.("register");
  };

  // 2. Submit for Approval
  const handleSubmitForApproval = (recordToSubmit?: PreCostingRecord) => {
    const target = recordToSubmit || formData;
    if (!recordToSubmit && !validateForm()) return;

    const currentSnapshot = createVersionSnapshot({
      ...target,
      status: "Pending Approval",
      submittedBy: "Tanvir Ahmed (Merchandiser)",
      submittedDate: new Date().toISOString().replace("T", " ").substring(0, 16),
    });

    const updatedRecord: PreCostingRecord = {
      ...target,
      status: "Pending Approval",
      isCurrentActive: false,
      submittedBy: "Tanvir Ahmed (Merchandiser)",
      submittedDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      versions: [
        ...(target.versions || []).filter((v) => v.versionNumber !== target.version),
        currentSnapshot,
      ],
      auditHistory: [
        ...(target.auditHistory || []),
        {
          versionNumber: target.version,
          createdBy: target.createdBy,
          createdDate: target.createdDate,
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

    // Synchronous immediate LocalStorage persistence
    try {
      const currentStored = localStorage.getItem("cripton_pre_costings_knit_master_v1");
      const list: PreCostingRecord[] = currentStored ? JSON.parse(currentStored) : [];
      const idx = list.findIndex((r) => r.id === updatedRecord.id);
      if (idx >= 0) {
        list[idx] = updatedRecord;
      } else {
        list.unshift(updatedRecord);
      }
      localStorage.setItem("cripton_pre_costings_knit_master_v1", JSON.stringify(list));
      localStorage.setItem("cripton_pre_costings_knit_active_id_v1", updatedRecord.id);
    } catch (e) {
      console.error("Failed to submit to localStorage:", e);
    }

    toast.success(`Pre Costing (Knit) ${updatedRecord.preCostId} v${updatedRecord.version} submitted for approval.`);
    setView("list");
    onTabChange?.("register");
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
    toast.success(`Pre Costing (Knit) ${rec.preCostId} v${rec.version} approved successfully.`);
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
    toast.error(`Pre Costing (Knit) ${targetRejectRecord.preCostId} v${targetRejectRecord.version} was rejected.`);
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
      fabricEntry: targetAmendRecord.fabricEntry ? { ...targetAmendRecord.fabricEntry } : undefined,
      knitFabricItems: (targetAmendRecord.knitFabricItems || []).map((f) => ({
        ...f,
        id: `kfi-${Date.now()}-${f.sl}`,
        yarnDetails: (f.yarnDetails || []).map((y) => ({ ...y, id: `yd-${Date.now()}-${y.sl}` })),
      })),
      accessoriesItems: (targetAmendRecord.accessoriesItems || []).map((a) => ({
        ...a,
        id: `acc-${Date.now()}-${a.sl}`,
      })),
      otherCostItems: (targetAmendRecord.otherCostItems || []).map((o) => ({
        ...o,
        id: `oth-${Date.now()}-${o.sl}`,
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
    try {
      localStorage.setItem("cripton_pre_costings_knit_active_id_v1", amendedRecord.id);
    } catch {}
    onTabChange?.("create", amendedRecord.id);
    toast.success(`Amendment Version v${newVersionNumber} initiated! Modify fields and submit for approval.`);
  };

  // Open Edit for Draft
  const handleOpenEdit = (rec: PreCostingRecord) => {
    const atts = rec.attachments || MMRepository.getPreCostingAttachments().filter((a) => a.preCostId === rec.preCostId);
    const poVal = (rec.poRows || []).reduce((acc, r) => acc + (Number(r.value) || 0), 0);
    const structured = ensureKnitCostingStructure(rec, poVal);
    setFormData({ ...structured, attachments: atts });
    setFormMode("edit");
    setView("form");
    try {
      localStorage.setItem("cripton_pre_costings_knit_active_id_v1", rec.id);
    } catch {}
    onTabChange?.("create", rec.id);
  };

  // Open Read-Only View -> Opens Complete Pre-Cost Sheet Report per specification
  const handleOpenView = (rec: PreCostingRecord) => {
    const atts = rec.attachments || MMRepository.getPreCostingAttachments().filter((a) => a.preCostId === rec.preCostId);
    const poVal = (rec.poRows || []).reduce((acc, r) => acc + (Number(r.value) || 0), 0);
    const structured = ensureKnitCostingStructure(rec, poVal);
    setActiveRecord({ ...structured, attachments: atts });
    setView("report");
    onTabChange?.("report", rec.id);
  };

  // Open Report View
  const handleOpenReport = (rec: PreCostingRecord) => {
    handleOpenView(rec);
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

  // Pagination for Register View
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterBuyer, filterStatus, fromDate, toDate]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-200">
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
                    Style Pre Costing Register (Knit)
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
                    const newRec = createNewFormData();
                    setFormData(newRec);
                    setFormMode("create");
                    setView("form");
                    try {
                      localStorage.setItem("cripton_pre_costings_knit_active_id_v1", newRec.id);
                    } catch {}
                    onTabChange?.("create", newRec.id);
                  }}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-xs cursor-pointer transition"
                >
                  <Plus className="size-3.5" /> New Style Pre Costing (Knit)
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
                      paginatedRecords.map((r) => {
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
                                      handleSubmitForApproval(r);
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

              {/* Pagination Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span>
                    Showing{" "}
                    <strong>
                      {filteredRecords.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                    </strong>{" "}
                    to{" "}
                    <strong>
                      {Math.min(currentPage * pageSize, filteredRecords.length)}
                    </strong>{" "}
                    of <strong>{filteredRecords.length}</strong> records
                  </span>
                  <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px]">Rows per page:</span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold cursor-pointer"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    title="First page"
                  >
                    <ChevronsLeft className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    title="Previous page"
                  >
                    <ChevronLeft className="size-3.5" />
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    title="Next page"
                  >
                    <ChevronRight className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    title="Last page"
                  >
                    <ChevronsRight className="size-3.5" />
                  </button>
                </div>
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
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800">
                    v{formData.version} — {formData.status}
                  </span>

                  {/* Consumption Unit Selector */}
                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 px-1.5 uppercase tracking-wider">
                      Consumption Unit:
                    </span>
                    <button
                      type="button"
                      disabled={formMode === "view"}
                      onClick={() => handleConsumptionUnitChange("PCS")}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        formData.consumptionUnit === "PCS"
                          ? "bg-teal-600 text-white shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 dark:hover:bg-slate-700"
                      }`}
                    >
                      PCS
                    </button>
                    <button
                      type="button"
                      disabled={formMode === "view"}
                      onClick={() => handleConsumptionUnitChange("DZ")}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        (formData.consumptionUnit || "DZ") === "DZ"
                          ? "bg-teal-600 text-white shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 dark:hover:bg-slate-700"
                      }`}
                    >
                      DZ
                    </button>
                  </div>
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
                  Pre Costing Identification & Order Basis
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
                    Purchase Order Details
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

            {/* SECTION 3: Item-wise Pre Costing Details (Fabric Cost, Accessories Cost, Others Cost) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 mr-1">
                    <span className="w-1.5 h-4 bg-indigo-600 rounded-full inline-block" />
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      Item-wise Pre Costing Details
                    </h2>
                  </div>
                  {/* Three Sub-Tabs */}
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl gap-1 border border-slate-200/60 dark:border-slate-700/60">
                    <button
                      type="button"
                      onClick={() => setActiveCostingTab("fabric")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeCostingTab === "fabric"
                          ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <Layers className="size-3.5" />
                      <span>Fabric Cost</span>
                      <span className="ml-1 px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 rounded text-[10px] font-mono font-bold">
                        ${totalFabricCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveCostingTab("accessories")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeCostingTab === "accessories"
                          ? "bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <Sparkles className="size-3.5" />
                      <span>Accessories Cost</span>
                      <span className="ml-1 px-1.5 py-0.5 bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 rounded text-[10px] font-mono font-bold">
                        ${totalAccessoriesCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveCostingTab("others")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeCostingTab === "others"
                          ? "bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-300 shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <DollarSign className="size-3.5" />
                      <span>Others Cost</span>
                      <span className="ml-1 px-1.5 py-0.5 bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 rounded text-[10px] font-mono font-bold">
                        ${totalOthersCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </button>
                  </div>
                </div>

                {formMode !== "view" && (
                  <div className="flex items-center gap-2">
                    {activeCostingTab === "fabric" && (
                      <button
                        type="button"
                        onClick={handleAddFabricItem}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold text-xs border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 cursor-pointer"
                      >
                        <Plus className="size-3.5" /> Add Fabric Item
                      </button>
                    )}
                    {activeCostingTab === "accessories" && (
                      <button
                        type="button"
                        onClick={handleAddAccessoryRow}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 font-bold text-xs border border-teal-200 dark:border-teal-800 hover:bg-teal-100 cursor-pointer"
                      >
                        <Plus className="size-3.5" /> Add Accessory Item
                      </button>
                    )}
                    {activeCostingTab === "others" && (
                      <button
                        type="button"
                        onClick={handleAddOtherCostRow}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold text-xs border border-amber-200 dark:border-amber-800 hover:bg-amber-100 cursor-pointer"
                      >
                        <Plus className="size-3.5" /> Add Other Cost Head
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  TAB 1: FABRIC COST (EXCEL MODEL STRUCTURE)
                 ───────────────────────────────────────────────────────────── */}
              {activeCostingTab === "fabric" && (
                <div className="space-y-4">
                  {/* Fabric Entry Section Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl bg-slate-50/90 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={handleOpenFabricEntryModal}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
                    >
                      <Plus className="size-3.5" />
                      <span>Fabric Create</span>
                    </button>
                  </div>

                  {/* Costing Item Entry Table (Replicated Model) */}
                  <div className="overflow-x-auto pb-2">
                    <table className="w-full text-xs text-left whitespace-nowrap min-w-[2100px]">
                      <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[9.5px] uppercase font-black text-slate-500">
                        <tr>
                          <th className="py-2.5 px-2 text-center w-8">Sl.</th>
                          <th className="py-2.5 px-2 w-44 min-w-[175px]">Head *</th>
                          <th className="py-2.5 px-2.5 w-64 min-w-[250px]">Item Name *</th>
                          <th className="py-2.5 px-2 text-center w-28 bg-amber-50/50 dark:bg-amber-950/20">Yarn *</th>
                          <th className="py-2.5 px-2 text-right w-24">Effected Qty (pcs) *</th>
                          <th className="py-2.5 px-2 text-right w-24">Consumption (kg/{(formData.consumptionUnit || "DZ").toLowerCase()}) *</th>
                          <th className="py-2.5 px-2 text-right w-24">Estimated Finish Qty</th>
                          <th className="py-2.5 px-2 text-right w-20">RMG Loss (%)</th>
                          <th className="py-2.5 px-2 text-right w-28">Req. Finished (Cuttable)</th>
                          <th className="py-2.5 px-2 w-28">Color Shade *</th>
                          <th className="py-2.5 px-2 w-32">Dyeing Method *</th>
                          <th className="py-2.5 px-2 text-right w-20">Dyeing Loss (%)</th>
                          <th className="py-2.5 px-2 text-right w-20">Dyeing Rate ($)</th>
                          <th className="py-2.5 px-2 text-right w-24">Dyeing Cost ($)</th>
                          <th className="py-2.5 px-2 text-right w-28">Req. Greige Qty</th>
                          <th className="py-2.5 px-2 text-right w-20">Knit Loss (%)</th>
                          <th className="py-2.5 px-2 text-right w-28">Req. Yarn (kg)</th>
                          <th className="py-2.5 px-2 text-right w-20">Knit Rate ($)</th>
                          <th className="py-2.5 px-2 text-right w-24">Knit Cost ($)</th>
                          <th className="py-2.5 px-2.5 text-right w-28 bg-indigo-50/40 dark:bg-indigo-950/20 font-black text-indigo-700 dark:text-indigo-300">Total Amount ($)</th>
                          {formMode !== "view" && <th className="py-2.5 px-2 text-center w-12">Action</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {(formData.knitFabricItems || []).length === 0 ? (
                          <tr>
                            <td colSpan={formMode !== "view" ? 21 : 20} className="py-8 text-center text-slate-400">
                              No knit fabric costing items added yet. Click "+ Add Fabric Item" to enter rows.
                            </td>
                          </tr>
                        ) : (
                          (formData.knitFabricItems || []).map((row, idx) => {
                            const yarnCount = row.yarnDetails?.length || 0;
                            return (
                              <tr key={row.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                {/* 1. Sl. */}
                                <td className="py-2 px-2 text-center font-mono font-bold text-slate-400">
                                  {idx + 1}
                                </td>

                                {/* 2. Head */}
                                <td className="py-2 px-2 w-44 min-w-[175px]">
                                  <select
                                    disabled={formMode === "view"}
                                    value={row.head}
                                    onChange={(e) => handleUpdateFabricItem(idx, "head", e.target.value)}
                                    className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                                  >
                                    <option value="Shell">Shell</option>
                                    <option value="Rib / Trims">Rib / Trims</option>
                                    <option value="Collar / Cuff">Collar / Cuff</option>
                                    <option value="Contrast Fabric">Contrast Fabric</option>
                                    <option value="Pocketing Fabric">Pocketing Fabric</option>
                                    <option value="Lining">Lining</option>
                                    <option value="Interlining">Interlining</option>
                                  </select>
                                </td>

                                {/* 3. Item Name */}
                                <td className="py-2 px-2.5 w-64 min-w-[250px]">
                                  <SearchableSelect
                                    options={getFabricItemOptions(row.item)}
                                    value={row.item}
                                    onChange={(val) => handleUpdateFabricItem(idx, "item", val)}
                                    placeholder="Select Fabric..."
                                    disabled={formMode === "view"}
                                    className="text-xs h-8 px-2"
                                    allowCustom
                                  />
                                </td>

                                {/* 4. Yarn Details Trigger Button */}
                                <td className="py-2 px-2 text-center bg-amber-50/30 dark:bg-amber-950/10">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenYarnModal(idx)}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100/80 dark:bg-amber-900/40 hover:bg-amber-200 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700 text-[11px] font-bold shadow-xs cursor-pointer transition-colors"
                                  >
                                    <Disc className="size-3" />
                                    <span>Yarn ({yarnCount})</span>
                                  </button>
                                </td>

                                {/* 5. Effected Qty (pcs) */}
                                <td className="py-2 px-2">
                                  <input
                                    type="number"
                                    disabled={formMode === "view"}
                                    value={row.effectedQtyPcs}
                                    onChange={(e) => handleUpdateFabricItem(idx, "effectedQtyPcs", Number(e.target.value) || 0)}
                                    className="w-full h-8 px-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono text-xs font-semibold"
                                  />
                                </td>

                                {/* Consumption (kg/dz) */}
                                <td className="py-2 px-2">
                                  <input
                                    type="number"
                                    step="0.01"
                                    disabled={formMode === "view"}
                                    value={row.consumptionKgDz}
                                    onChange={(e) => handleUpdateFabricItem(idx, "consumptionKgDz", Number(e.target.value) || 0)}
                                    className="w-full h-8 px-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono text-xs font-semibold"
                                  />
                                </td>

                                {/* 8. Estimated Finish Qty */}
                                <td className="py-2 px-2 text-right font-mono font-medium text-slate-700 dark:text-slate-300">
                                  {Number(row.estimatedFinishQty || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>

                                {/* 9. RMG Process Loss (%) */}
                                <td className="py-2 px-2">
                                  <input
                                    type="number"
                                    step="0.1"
                                    disabled={formMode === "view"}
                                    value={row.rmgProcessLossPct}
                                    onChange={(e) => handleUpdateFabricItem(idx, "rmgProcessLossPct", Number(e.target.value) || 0)}
                                    className="w-full h-8 px-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono text-xs font-semibold"
                                  />
                                </td>

                                {/* 10. Required Finished (Cuttable) Qty */}
                                <td className="py-2 px-2 text-right font-mono font-bold text-slate-900 dark:text-white">
                                  {Number(row.requiredFinishedQty || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>

                                {/* 11. Color Shade */}
                                <td className="py-2 px-2">
                                  <select
                                    disabled={formMode === "view"}
                                    value={row.colorShade}
                                    onChange={(e) => handleUpdateFabricItem(idx, "colorShade", e.target.value)}
                                    className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                                  >
                                    {COLOR_SHADES.map((cs) => (
                                      <option key={cs} value={cs}>
                                        {cs}
                                      </option>
                                    ))}
                                  </select>
                                </td>

                                {/* 12. Dyeing Method */}
                                <td className="py-2 px-2">
                                  <select
                                    disabled={formMode === "view"}
                                    value={row.dyeingMethod}
                                    onChange={(e) => handleUpdateFabricItem(idx, "dyeingMethod", e.target.value)}
                                    className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                                  >
                                    {DYEING_METHODS.map((dm) => (
                                      <option key={dm} value={dm}>
                                        {dm}
                                      </option>
                                    ))}
                                  </select>
                                </td>

                                {/* 13. Dyeing Process Loss (%) */}
                                <td className="py-2 px-2">
                                  <input
                                    type="number"
                                    step="0.1"
                                    disabled={formMode === "view"}
                                    value={row.dyeingProcessLossPct}
                                    onChange={(e) => handleUpdateFabricItem(idx, "dyeingProcessLossPct", Number(e.target.value) || 0)}
                                    className="w-full h-8 px-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono text-xs font-semibold"
                                  />
                                </td>

                                {/* 14. Dyeing Rate ($/kg) */}
                                <td className="py-2 px-2">
                                  <input
                                    type="number"
                                    step="0.01"
                                    disabled={formMode === "view"}
                                    value={row.dyeingRate}
                                    onChange={(e) => handleUpdateFabricItem(idx, "dyeingRate", Number(e.target.value) || 0)}
                                    className="w-full h-8 px-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono text-xs font-semibold"
                                  />
                                </td>

                                {/* 15. Dyeing Cost ($) */}
                                <td className="py-2 px-2 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                                  ${Number(row.dyeingCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>

                                {/* 16. Required Greige Qty (kg) */}
                                <td className="py-2 px-2 text-right font-mono font-medium text-slate-700 dark:text-slate-300">
                                  {Number(row.requiredGreigeQty || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>

                                {/* 17. Knitting Process Loss (%) */}
                                <td className="py-2 px-2">
                                  <input
                                    type="number"
                                    step="0.1"
                                    disabled={formMode === "view"}
                                    value={row.knittingProcessLossPct}
                                    onChange={(e) => handleUpdateFabricItem(idx, "knittingProcessLossPct", Number(e.target.value) || 0)}
                                    className="w-full h-8 px-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono text-xs font-semibold"
                                  />
                                </td>

                                {/* 18. Required Yarn (kg) */}
                                <td className="py-2 px-2 text-right font-mono font-black text-amber-700 dark:text-amber-300">
                                  {Number(row.requiredYarnKg || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>

                                {/* 19. Knitting Rate ($/kg) */}
                                <td className="py-2 px-2">
                                  <input
                                    type="number"
                                    step="0.01"
                                    disabled={formMode === "view"}
                                    value={row.knittingRate}
                                    onChange={(e) => handleUpdateFabricItem(idx, "knittingRate", Number(e.target.value) || 0)}
                                    className="w-full h-8 px-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono text-xs font-semibold"
                                  />
                                </td>

                                {/* 20. Knitting Cost ($) */}
                                <td className="py-2 px-2 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                                  ${Number(row.knittingCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>

                                {/* Total Amount ($) */}
                                <td className="py-2 px-2.5 text-right font-mono font-black text-indigo-700 dark:text-indigo-300 bg-indigo-50/30 dark:bg-indigo-950/10 text-[13px]">
                                  ${Number(row.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>

                                {/* Action */}
                                {formMode !== "view" && (
                                  <td className="py-2 px-2 text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveFabricItem(idx)}
                                      className="p-1 rounded hover:bg-rose-50 text-rose-500 cursor-pointer"
                                      title="Remove fabric row"
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
                        <tr className="bg-slate-100/80 dark:bg-slate-800 font-black border-t border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                          <td colSpan={4} className="py-3 px-3 uppercase text-[10px] tracking-wider text-right">
                            Fabric Totals:
                          </td>
                          <td className="py-3 px-2 text-right font-mono">
                            {(formData.knitFabricItems || []).reduce((s, r) => s + (Number(r.effectedQtyPcs) || 0), 0).toLocaleString()}
                          </td>
                          <td />
                          <td className="py-3 px-2 text-right font-mono">
                            {(formData.knitFabricItems || []).reduce((s, r) => s + (Number(r.estimatedFinishQty) || 0), 0).toFixed(2)}
                          </td>
                          <td />
                          <td className="py-3 px-2 text-right font-mono">
                            {(formData.knitFabricItems || []).reduce((s, r) => s + (Number(r.requiredFinishedQty) || 0), 0).toFixed(2)}
                          </td>
                          <td colSpan={4} />
                          <td className="py-3 px-2 text-right font-mono">
                            ${(formData.knitFabricItems || []).reduce((s, r) => s + (Number(r.dyeingCost) || 0), 0).toFixed(2)}
                          </td>
                          <td className="py-3 px-2 text-right font-mono">
                            {(formData.knitFabricItems || []).reduce((s, r) => s + (Number(r.requiredGreigeQty) || 0), 0).toFixed(2)}
                          </td>
                          <td />
                          <td className="py-3 px-2 text-right font-mono text-amber-600 dark:text-amber-400">
                            {(formData.knitFabricItems || []).reduce((s, r) => s + (Number(r.requiredYarnKg) || 0), 0).toFixed(2)}
                          </td>
                          <td />
                          <td className="py-3 px-2 text-right font-mono">
                            ${(formData.knitFabricItems || []).reduce((s, r) => s + (Number(r.knittingCost) || 0), 0).toFixed(2)}
                          </td>
                          <td className="py-3 px-2.5 text-right font-mono text-indigo-700 dark:text-indigo-300 text-sm">
                            ${totalFabricCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          {formMode !== "view" && <td />}
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  TAB 2: ACCESSORIES COST (PRESERVED FUNCTIONALITY & COLUMNS)
                 ───────────────────────────────────────────────────────────── */}
              {activeCostingTab === "accessories" && (
                <div className="space-y-4">
                  <div className="overflow-x-auto pb-2">
                    <table className="w-full text-xs text-left whitespace-nowrap min-w-[1250px]">
                      <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[9.5px] uppercase font-black text-slate-500">
                        <tr>
                          <th className="py-2.5 px-2 text-center w-8">SL</th>
                          <th className="py-2.5 px-2 w-44 min-w-[175px]">Head *</th>
                          <th className="py-2.5 px-2.5 w-64">Item Name *</th>
                          <th className="py-2.5 px-2 w-44">Description</th>
                          <th className="py-2.5 px-2 w-32">N. Status *</th>
                          <th className="py-2.5 px-2.5 w-52">Supplier *</th>
                          <th className="py-2.5 px-2 text-right w-32">Effected Qty *</th>
                          <th className="py-2.5 px-2 text-right w-20">Consump.</th>
                          <th className="py-2.5 px-2 text-right w-24">Required Qty</th>
                          <th className="py-2.5 px-2 text-right w-32 min-w-[120px]">Final Qty</th>
                          <th className="py-2.5 px-2 text-right w-28 min-w-[105px]">Rate ($)</th>
                          <th className="py-2.5 px-2.5 text-right w-28">Amount ($)</th>
                          {formMode !== "view" && <th className="py-2.5 px-2 text-center w-12">Action</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {(formData.accessoriesItems || []).length === 0 ? (
                          <tr>
                            <td colSpan={formMode !== "view" ? 13 : 12} className="py-8 text-center text-slate-400">
                              No accessories items entered. Click "+ Add Accessory Item" to add sewing thread, buttons, zippers, trims, etc.
                            </td>
                          </tr>
                        ) : (
                          (formData.accessoriesItems || []).map((item, idx) => {
                            const isEffQtyInvalid = consolidatedOrderQty > 0 && (Number(item.effectedQty) || 0) > consolidatedOrderQty;
                            const itemOptions = accessoriesMasterItems.map((a) => ({
                              value: a.itemName,
                              label: `${a.itemCode} — ${a.itemName} (${a.category})`,
                            }));
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

                                {/* 2. Head */}
                                <td className="py-2 px-2 w-44 min-w-[175px]">
                                  <select
                                    disabled={formMode === "view"}
                                    value={item.head}
                                    onChange={(e) => handleUpdateAccessoryRow(idx, "head", e.target.value)}
                                    className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                                  >
                                    {ACCESSORIES_HEADS.map((h: string) => (
                                      <option key={h} value={h}>
                                        {h}
                                      </option>
                                    ))}
                                  </select>
                                </td>

                                {/* 3. Item Name */}
                                <td className="py-2 px-2.5">
                                  <SearchableSelect
                                    options={itemOptions}
                                    value={item.item}
                                    onChange={(val) => handleUpdateAccessoryRow(idx, "item", val)}
                                    placeholder="Select Accessory Item..."
                                    disabled={formMode === "view"}
                                    className="text-xs"
                                  />
                                </td>

                                {/* 4. Description */}
                                <td className="py-2 px-2">
                                  <input
                                    type="text"
                                    disabled={formMode === "view"}
                                    value={item.description || ""}
                                    onChange={(e) => handleUpdateAccessoryRow(idx, "description", e.target.value)}
                                    className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                                    placeholder="Specifications..."
                                  />
                                </td>

                                {/* 5. N. Status */}
                                <td className="py-2 px-2">
                                  <select
                                    disabled={formMode === "view"}
                                    value={item.nStatus}
                                    onChange={(e) => handleUpdateAccessoryRow(idx, "nStatus", e.target.value)}
                                    className="w-full h-8 px-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                                  >
                                    <option value="Nominated">Nominated</option>
                                    <option value="Non-Nominated">Non-Nominated</option>
                                  </select>
                                </td>

                                {/* 6. Supplier */}
                                <td className="py-2 px-2.5">
                                  <SearchableSelect
                                    options={supplierOptions}
                                    value={item.supplier}
                                    onChange={(val) => handleUpdateAccessoryRow(idx, "supplier", val)}
                                    placeholder="Select Supplier..."
                                    disabled={formMode === "view"}
                                    className="text-xs"
                                  />
                                </td>

                                {/* 7. Effected Qty */}
                                <td className="py-2 px-2">
                                  <input
                                    type="number"
                                    disabled={formMode === "view"}
                                    value={item.effectedQty}
                                    onChange={(e) => handleUpdateAccessoryRow(idx, "effectedQty", Number(e.target.value) || 0)}
                                    className={`w-full h-8 px-1.5 rounded-lg border text-right font-mono font-bold text-xs ${
                                      isEffQtyInvalid
                                        ? "border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                                    }`}
                                  />
                                </td>

                                {/* 8. Consumption */}
                                <td className="py-2 px-2">
                                  <input
                                    type="number"
                                    step="0.001"
                                    disabled={formMode === "view"}
                                    value={item.consumption}
                                    onChange={(e) => handleUpdateAccessoryRow(idx, "consumption", Number(e.target.value) || 0)}
                                    className="w-full h-8 px-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono text-xs font-semibold"
                                  />
                                </td>

                                {/* 9. Required Qty */}
                                <td className="py-2 px-2 text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                                  {Number(item.requiredQty || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>

                                {/* 10. Final Qty */}
                                <td className="py-2 px-2 w-32 min-w-[120px]">
                                  <input
                                    type="number"
                                    step="0.01"
                                    disabled={formMode === "view"}
                                    value={item.finalQty}
                                    onChange={(e) => handleUpdateAccessoryRow(idx, "finalQty", Number(e.target.value) || 0)}
                                    className="w-full h-8 px-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono font-bold text-xs"
                                  />
                                </td>

                                {/* 11. Rate ($) */}
                                <td className="py-2 px-2 w-28 min-w-[105px]">
                                  <input
                                    type="number"
                                    step="0.001"
                                    disabled={formMode === "view"}
                                    value={item.rate}
                                    onChange={(e) => handleUpdateAccessoryRow(idx, "rate", Number(e.target.value) || 0)}
                                    className="w-full h-8 px-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono font-bold text-xs"
                                  />
                                </td>

                                {/* 12. Amount ($) */}
                                <td className="py-2 px-2.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                                  ${Number(item.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>

                                {/* Action */}
                                {formMode !== "view" && (
                                  <td className="py-2 px-2 text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveAccessoryRow(idx)}
                                      className="p-1 rounded hover:bg-rose-50 text-rose-500 cursor-pointer"
                                      title="Remove accessory item"
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
                          <td colSpan={10} className="py-3 px-3 text-right uppercase text-[10px] tracking-wider">
                            Total Accessories Cost:
                          </td>
                          <td className="py-3 px-2.5 text-right font-mono text-teal-700 dark:text-teal-300 text-sm">
                            ${totalAccessoriesCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          {formMode !== "view" && <td />}
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  TAB 3: OTHERS COST (PRESERVED FUNCTIONALITY & COLUMNS)
                 ───────────────────────────────────────────────────────────── */}
              {activeCostingTab === "others" && (
                <div className="space-y-4">
                  <div className="overflow-x-auto pb-2">
                    <table className="w-full text-xs text-left whitespace-nowrap min-w-[1000px]">
                      <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[9.5px] uppercase font-black text-slate-500">
                        <tr>
                          <th className="py-2.5 px-2 text-center w-8">SL</th>
                          <th className="py-2.5 px-3 w-52">Cost Head *</th>
                          <th className="py-2.5 px-3 w-72">Description</th>
                          <th className="py-2.5 px-2.5 text-right w-28 min-w-[100px]">GMT Qty</th>
                          <th className="py-2.5 px-2.5 text-right w-28 min-w-[100px]">QTY in DZ</th>
                          <th className="py-2.5 px-2.5 text-right w-32 min-w-[110px]">Unit Rate (DZ) *</th>
                          <th className="py-2.5 px-3 text-right w-36">Amount ($)</th>
                          {formMode !== "view" && <th className="py-2.5 px-2 text-center w-12">Action</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {(formData.otherCostItems || []).length === 0 ? (
                          <tr>
                            <td colSpan={formMode !== "view" ? 8 : 7} className="py-8 text-center text-slate-400">
                              No other costing heads entered. Click "+ Add Other Cost Head" to add freight, testing, banking, commission, etc.
                            </td>
                          </tr>
                        ) : (
                          (formData.otherCostItems || []).map((row, idx) => (
                            <tr key={row.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                              {/* 1. SL */}
                              <td className="py-2 px-2 text-center font-mono font-bold text-slate-400">
                                {idx + 1}
                              </td>

                              {/* 2. Cost Head */}
                              <td className="py-2 px-3">
                                <select
                                  disabled={formMode === "view"}
                                  value={row.costHead}
                                  onChange={(e) => handleUpdateOtherCostRow(idx, "costHead", e.target.value)}
                                  className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                                >
                                  {OTHER_COST_HEADS.map((h) => (
                                    <option key={h} value={h}>
                                      {h}
                                    </option>
                                  ))}
                                </select>
                              </td>

                              {/* 3. Description */}
                              <td className="py-2 px-3">
                                <input
                                  type="text"
                                  disabled={formMode === "view"}
                                  value={row.description}
                                  onChange={(e) => handleUpdateOtherCostRow(idx, "description", e.target.value)}
                                  placeholder="Terms or notes..."
                                  className="w-full h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                                />
                              </td>

                              {/* 4. GMT Qty */}
                              <td className="py-2 px-2.5 text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                                {(row.gmtQty ?? (consolidatedOrderQty || 20000)).toLocaleString()}
                              </td>

                              {/* 5. QTY in DZ */}
                              <td className="py-2 px-2.5 text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                                {(row.qtyInDz ?? Number(((row.gmtQty ?? (consolidatedOrderQty || 20000)) / 12).toFixed(2))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>

                              {/* 6. Unit Rate (DZ) */}
                              <td className="py-2 px-2.5 w-32 min-w-[110px]">
                                <input
                                  type="number"
                                  step="0.001"
                                  disabled={formMode === "view"}
                                  value={row.unitRateDz ?? 0}
                                  onChange={(e) => handleUpdateOtherCostRow(idx, "unitRateDz", Number(e.target.value) || 0)}
                                  className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono font-bold text-xs"
                                  placeholder="0.00"
                                />
                              </td>

                              {/* 7. Amount ($) */}
                              <td className="py-2 px-3 text-right font-mono font-bold text-amber-700 dark:text-amber-300">
                                ${Number(row.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>

                              {/* Action */}
                              {formMode !== "view" && (
                                <td className="py-2 px-2 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveOtherCostRow(idx)}
                                    className="p-1 rounded hover:bg-rose-50 text-rose-500 cursor-pointer"
                                    title="Remove row"
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
                        <tr className="bg-slate-100 dark:bg-slate-800 font-black border-t border-slate-200 dark:border-slate-700">
                          <td colSpan={6} className="py-3 px-3 text-right uppercase text-[10px] tracking-wider">
                            Total Others Cost:
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-amber-700 dark:text-amber-300 text-sm">
                            ${totalOthersCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          {formMode !== "view" && <td />}
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  CONSOLIDATED SECTION 3 BOTTOM SUMMARY CARD
                 ───────────────────────────────────────────────────────────── */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 block">Total Fabric Cost</span>
                    <span className="text-base font-mono font-black text-slate-900 dark:text-white">
                      ${totalFabricCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {totalCost > 0 ? ((totalFabricCost / totalCost) * 100).toFixed(1) : 0}% of material & service cost
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400 block">Total Accessories Cost</span>
                    <span className="text-base font-mono font-black text-slate-900 dark:text-white">
                      ${totalAccessoriesCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {totalCost > 0 ? ((totalAccessoriesCost / totalCost) * 100).toFixed(1) : 0}% of material & service cost
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block">Total Others Cost</span>
                    <span className="text-base font-mono font-black text-slate-900 dark:text-white">
                      ${totalOthersCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {totalCost > 0 ? ((totalOthersCost / totalCost) * 100).toFixed(1) : 0}% of material & service cost
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                    <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-300 block">Grand Total Pre Costing</span>
                    <span className="text-base font-mono font-black text-indigo-700 dark:text-indigo-300">
                      ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] font-mono text-indigo-600/80 dark:text-indigo-400/80 block mt-0.5">
                      ${(consolidatedOrderQty > 0 ? totalCost / consolidatedOrderQty : 0).toFixed(4)} / pc • ${(consolidatedOrderQty > 0 ? (totalCost / consolidatedOrderQty) * 12 : 0).toFixed(2)} / dz
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: Order and Costing Summary */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="w-1.5 h-4 bg-indigo-600 rounded-full inline-block" />
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Order and Costing Summary
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
                    <span>Style & Pre Costing Images</span>
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
          <PreCostingKnitReport
            record={activeRecord}
            onBack={() => {
              setView("list");
              onTabChange?.("register");
            }}
            onEdit={(rec) => {
              handleOpenEdit(rec);
            }}
          />
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
            MODAL: FABRIC ENTRY SPECIFICATIONS
           ════════════════════════════════════════════════════════════ */}
        {showFabricEntryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Layers className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Fabric Entry Specifications</h3>
                    <p className="text-[11px] text-slate-500">Applied to Knit Fabric Cost Items</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFabricEntryModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Fabric Composition */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Fabric Composition <span className="text-rose-500">*</span>
                  </label>
                  <SearchableSelect
                    options={getYarnCompositionOptions(tempFabricEntry.fabricComposition)}
                    value={tempFabricEntry.fabricComposition}
                    onChange={(val) => setTempFabricEntry((prev) => ({ ...prev, fabricComposition: val }))}
                    placeholder="Select Fabric Composition..."
                    disabled={formMode === "view"}
                    className="h-9 text-xs"
                    allowCustom
                  />
                </div>

                {/* 2. Fabric Type */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Fabric Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    disabled={formMode === "view"}
                    value={tempFabricEntry.fabricType}
                    onChange={(e) => setTempFabricEntry((prev) => ({ ...prev, fabricType: e.target.value }))}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  >
                    {masterFabricTypes.length > 0 ? (
                      masterFabricTypes.map((ft) => (
                        <option key={ft.id} value={ft.name}>
                          {ft.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Single Jersey">Single Jersey</option>
                        <option value="1x1 Rib">1x1 Rib</option>
                        <option value="2x2 Rib">2x2 Rib</option>
                        <option value="French Terry">French Terry</option>
                        <option value="Fleece">Fleece</option>
                        <option value="Interlock">Interlock</option>
                        <option value="Pique">Pique</option>
                        <option value="Lacoste">Lacoste</option>
                      </>
                    )}
                  </select>
                </div>

                {/* 3. GSM */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    GSM <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    disabled={formMode === "view"}
                    value={tempFabricEntry.gsm}
                    onChange={(e) => setTempFabricEntry((prev) => ({ ...prev, gsm: Number(e.target.value) || 0 }))}
                    placeholder="e.g. 180"
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold font-mono"
                  />
                </div>

                {/* 4. Spinning Type */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Spinning Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    disabled={formMode === "view"}
                    value={tempFabricEntry.spinningType}
                    onChange={(e) => setTempFabricEntry((prev) => ({ ...prev, spinningType: e.target.value }))}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  >
                    {masterSpinningTypes.length > 0 ? (
                      masterSpinningTypes.map((st) => (
                        <option key={st.id} value={st.name}>
                          {st.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Ring Spun">Ring Spun</option>
                        <option value="Open End">Open End</option>
                        <option value="Vortex">Vortex</option>
                        <option value="Compact">Compact</option>
                        <option value="Siro Spun">Siro Spun</option>
                      </>
                    )}
                  </select>
                </div>

                {/* 5. Other Specifications */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Other Specifications
                  </label>
                  <input
                    type="text"
                    disabled={formMode === "view"}
                    value={tempFabricEntry.otherSpecs || ""}
                    onChange={(e) => setTempFabricEntry((prev) => ({ ...prev, otherSpecs: e.target.value }))}
                    placeholder="e.g. Bio-washed, Peach finish"
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  />
                </div>

                {/* 6. Fabric Category */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Fabric Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    disabled={formMode === "view"}
                    value={tempFabricEntry.fabricCategory}
                    onChange={(e) => setTempFabricEntry((prev) => ({ ...prev, fabricCategory: e.target.value }))}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  >
                    {FABRIC_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFabricEntryModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                {formMode !== "view" && (
                  <button
                    type="button"
                    onClick={handleSaveFabricEntryModal}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="size-3.5" /> Save Specifications
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            MODAL: YARN DETAILS BREAKDOWN (EXCEL MODEL REPLICATION)
           ════════════════════════════════════════════════════════════ */}
        {yarnModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-6xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-amber-50/60 dark:bg-amber-950/30 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Disc className="size-4 text-amber-600" />
                    <span>Yarn Breakdown & Costing Details</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Item: <span className="font-semibold text-slate-800 dark:text-slate-200">{yarnModal.head} — {yarnModal.item}</span> | Required Total Yarn:{" "}
                    <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                      {yarnModal.requiredYarnKg.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kg
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setYarnModal((prev) => ({ ...prev, isOpen: false, rowIndex: null }))}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Sub-bar with Add Button & Ratio Tracker */}
              {(() => {
                const totalRatio = yarnModal.rows.reduce((s, y) => s + (Number(y.ratioPct) || 0), 0);
                const totalFinalQty = yarnModal.rows.reduce((s, y) => s + (Number(y.finalQtyKg) || 0), 0);
                const totalCostVal = yarnModal.rows.reduce((s, y) => s + (Number(y.yarnCost) || 0), 0);
                const avgRateVal = totalFinalQty > 0 ? totalCostVal / totalFinalQty : 0;
                const isRatioBalanced = Math.abs(totalRatio - 100) < 0.01;

                return (
                  <>
                    <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {formMode !== "view" && (
                          <button
                            type="button"
                            onClick={handleAddYarnModalRow}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                          >
                            <Plus className="size-3.5" /> Add Yarn Row
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">Total Ratio:</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-black border ${
                            isRatioBalanced
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300"
                          }`}
                        >
                          {totalRatio.toFixed(1)}% {isRatioBalanced ? "✓ Balanced" : "⚠️ Must = 100%"}
                        </span>
                      </div>
                    </div>

                    {/* Table of Yarn rows */}
                    <div className="flex-1 overflow-y-auto p-6">
                      <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                        <table className="w-full text-xs text-left whitespace-nowrap min-w-[1300px]">
                          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[9.5px] uppercase font-black text-slate-500">
                            <tr>
                              <th className="py-2.5 px-2 text-center w-8">Sl.</th>
                              <th className="py-2.5 px-2 w-20 min-w-[70px]">Grade *</th>
                              <th className="py-2.5 px-2 w-28 min-w-[100px]">Color Type *</th>
                              <th className="py-2.5 px-2 w-44 min-w-[150px]">Yarn Count *</th>
                              <th className="py-2.5 px-2 w-64 min-w-[220px]">Yarn Composition *</th>
                              <th className="py-2.5 px-2 w-64 min-w-[220px]">Yarn Item</th>
                              <th className="py-2.5 px-2 text-right w-24 min-w-[90px]">Ratio (%) *</th>
                              <th className="py-2.5 px-2 text-right w-28 min-w-[100px]">Final Qty (Kg)</th>
                              <th className="py-2.5 px-2 text-right w-24 min-w-[90px]">Rate ($/kg) *</th>
                              <th className="py-2.5 px-2.5 text-right w-28 min-w-[100px]">Yarn Cost ($)</th>
                              <th className="py-2.5 px-2.5 w-56 min-w-[180px]">Vendor *</th>
                              <th className="py-2.5 px-2.5 text-center w-28 min-w-[100px]">Booking Tag</th>
                              {formMode !== "view" && <th className="py-2.5 px-2 text-center w-12">Action</th>}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {yarnModal.rows.length === 0 ? (
                              <tr>
                                <td colSpan={formMode !== "view" ? 13 : 12} className="py-8 text-center text-slate-400">
                                  No yarn details entered. Click "Add Yarn Row" to define yarn components.
                                </td>
                              </tr>
                            ) : (
                              yarnModal.rows.map((yRow, yIdx) => (
                                <tr key={yRow.id || yIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                  {/* 1. Sl. */}
                                  <td className="py-2 px-2 text-center font-mono font-bold text-slate-400">
                                    {yIdx + 1}
                                  </td>

                                  {/* 2. Grade */}
                                  <td className="py-2 px-2 w-20 min-w-[70px]">
                                    <select
                                      disabled={formMode === "view"}
                                      value={yRow.grade === "Grade A" ? "A" : yRow.grade === "Grade B" ? "B" : yRow.grade || "A"}
                                      onChange={(e) => handleUpdateYarnModalRow(yIdx, "grade", e.target.value)}
                                      className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                                    >
                                      <option value="A">A</option>
                                      <option value="B">B</option>
                                    </select>
                                  </td>

                                  {/* 3. Color Type */}
                                  <td className="py-2 px-2 w-28 min-w-[100px]">
                                    <select
                                      disabled={formMode === "view"}
                                      value={yRow.colorType}
                                      onChange={(e) => handleUpdateYarnModalRow(yIdx, "colorType", e.target.value)}
                                      className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                                    >
                                      {YARN_COLOR_TYPES.map((ct) => (
                                        <option key={ct} value={ct}>
                                          {ct}
                                        </option>
                                      ))}
                                    </select>
                                  </td>

                                  {/* 4. Yarn Count */}
                                  <td className="py-2 px-2 w-44 min-w-[150px]">
                                    <SearchableSelect
                                      options={getYarnCountOptions(yRow.yarnCount)}
                                      value={yRow.yarnCount}
                                      onChange={(val) => handleUpdateYarnModalRow(yIdx, "yarnCount", val)}
                                      placeholder="Select Yarn Count..."
                                      disabled={formMode === "view"}
                                      className="text-xs h-8 px-2"
                                      allowCustom
                                    />
                                  </td>

                                  {/* 5. Yarn Composition */}
                                  <td className="py-2 px-2 w-64 min-w-[220px]">
                                    <SearchableSelect
                                      options={getYarnCompositionOptions(yRow.yarnComposition)}
                                      value={yRow.yarnComposition}
                                      onChange={(val) => handleUpdateYarnModalRow(yIdx, "yarnComposition", val)}
                                      placeholder="Select Composition..."
                                      disabled={formMode === "view"}
                                      className="text-xs h-8 px-2"
                                      allowCustom
                                    />
                                  </td>

                                  {/* 6. Yarn Item (Combined Count + Composition + Color Type) */}
                                  <td className="py-2 px-2 w-64 min-w-[220px]">
                                    <input
                                      type="text"
                                      readOnly
                                      value={yRow.yarnItem || [yRow.yarnCount, yRow.yarnComposition, yRow.colorType].filter(Boolean).join(" ")}
                                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-default select-all"
                                      placeholder="Combined Yarn Item"
                                    />
                                  </td>

                                  {/* 7. Ratio (%) */}
                                  <td className="py-2 px-2">
                                    <input
                                      type="number"
                                      step="0.1"
                                      disabled={formMode === "view"}
                                      value={yRow.ratioPct}
                                      onChange={(e) => handleUpdateYarnModalRow(yIdx, "ratioPct", Number(e.target.value) || 0)}
                                      className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono font-bold text-xs"
                                    />
                                  </td>

                                  {/* 8. Final Qty (Kg) */}
                                  <td className="py-2 px-2 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                                    {Number(yRow.finalQtyKg || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </td>

                                  {/* 9. Rate ($/kg) */}
                                  <td className="py-2 px-2">
                                    <input
                                      type="number"
                                      step="0.01"
                                      disabled={formMode === "view"}
                                      value={yRow.ratePerKg}
                                      onChange={(e) => handleUpdateYarnModalRow(yIdx, "ratePerKg", Number(e.target.value) || 0)}
                                      className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono font-bold text-xs"
                                    />
                                  </td>

                                  {/* 10. Yarn Cost ($) */}
                                  <td className="py-2 px-2.5 text-right font-mono font-bold text-amber-700 dark:text-amber-400">
                                    ${Number(yRow.yarnCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </td>

                                  {/* 11. Vendor (Searchable Dropdown) */}
                                  <td className="py-2 px-2 w-56 min-w-[180px]">
                                    <SearchableSelect
                                      options={getVendorOptions(yRow.brand)}
                                      value={yRow.brand || ""}
                                      onChange={(val) => handleUpdateYarnModalRow(yIdx, "brand", val)}
                                      placeholder="Select Vendor..."
                                      disabled={formMode === "view"}
                                      className="text-xs h-8 px-2"
                                      allowCustom
                                    />
                                  </td>

                                  {/* 12. Booking Tag Column */}
                                  <td className="py-2 px-2 text-center w-28 min-w-[100px]">
                                    <button
                                      type="button"
                                      onClick={() => handleOpenBookingTagModal(yIdx, yRow)}
                                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
                                        yRow.bookingTag
                                          ? "bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700 ring-2 ring-emerald-300 dark:ring-emerald-900"
                                          : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600"
                                      }`}
                                      title={
                                        yRow.bookingTag
                                          ? `Tagged: ${yRow.bookingTag.blockBookingNo} (${Number(yRow.bookingTag.tagQtyKg).toLocaleString()} KG) — Click to view/edit tag`
                                          : "Click to Tag yarn against Block Yarn Booking"
                                      }
                                    >
                                      <span className="font-black text-xs">B</span>
                                      {yRow.bookingTag ? (
                                        <span className="text-[9.5px] font-mono bg-emerald-800/50 px-1 py-0.5 rounded leading-none">
                                          ✓ Tagged
                                        </span>
                                      ) : (
                                        <span className="text-[9px] text-slate-400 font-normal">Tag</span>
                                      )}
                                    </button>
                                  </td>

                                  {/* 13. Action */}
                                  {formMode !== "view" && (
                                    <td className="py-2 px-2 text-center">
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveYarnModalRow(yIdx)}
                                        className="p-1 rounded hover:bg-rose-50 text-rose-500 cursor-pointer"
                                        title="Remove yarn row"
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
                            <tr className="bg-slate-100 dark:bg-slate-800 font-black border-t border-slate-200 dark:border-slate-700">
                              <td colSpan={6} className="py-3 px-3 uppercase text-[10px] tracking-wider text-right">
                                Yarn Breakdown Totals:
                              </td>
                              <td className="py-3 px-2 text-right font-mono">
                                {totalRatio.toFixed(1)}%
                              </td>
                              <td className="py-3 px-2 text-right font-mono text-amber-700 dark:text-amber-400">
                                {totalFinalQty.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kg
                              </td>
                              <td className="py-3 px-2 text-right font-mono text-slate-500 text-[11px]">
                                avg ${avgRateVal.toFixed(3)}
                              </td>
                              <td className="py-3 px-2.5 text-right font-mono text-amber-700 dark:text-amber-300 text-sm">
                                ${totalCostVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td colSpan={formMode !== "view" ? 3 : 2} />
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>

                    {/* Modal Footer Actions */}
                    <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
                      <div className="text-xs text-slate-500">
                        {yarnModal.rows.length} yarn component{yarnModal.rows.length === 1 ? "" : "s"} configured
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setYarnModal((prev) => ({ ...prev, isOpen: false, rowIndex: null }))}
                          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                        >
                          Cancel
                        </button>
                        {formMode !== "view" && (
                          <button
                            type="button"
                            onClick={handleSaveYarnModal}
                            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                          >
                            <Save className="size-3.5" /> Save & Apply Yarn Details
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            MODAL: BOOKING TAG MODAL (TAG YARN TO BLOCK YARN BOOKING)
           ════════════════════════════════════════════════════════════ */}
        {bookingTagModal.isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-amber-50/60 dark:bg-amber-950/30 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Tag className="size-4 text-amber-600" />
                    <span>Tag Yarn to Block Yarn Booking</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Component: <span className="font-semibold text-slate-800 dark:text-slate-200">{bookingTagModal.yarnItemName || "Yarn Breakdown Item"}</span>
                    {" • "}
                    Tag Qty: <span className="font-mono font-bold text-amber-700 dark:text-amber-400">{bookingTagModal.finalQtyKg.toLocaleString()} KG</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setBookingTagModal((prev) => ({ ...prev, isOpen: false }))}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
                {/* 1. Block Booking No. Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Block Booking No. <span className="text-rose-500">*</span>
                  </label>
                  <SearchableSelect
                    options={blockBookingDropdownOptions}
                    value={bookingTagModal.selectedBookingNo}
                    onChange={handleSelectBookingNo}
                    placeholder="Search and select Block Yarn Booking..."
                    disabled={formMode === "view"}
                    className="w-full text-xs font-semibold"
                  />
                  <p className="text-[11px] text-slate-400">
                    Showing active Block Yarn Bookings with available balances.
                  </p>
                </div>

                {/* 2. Yarn Item Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Yarn Item <span className="text-rose-500">*</span>
                  </label>
                  <SearchableSelect
                    options={yarnItemDropdownOptions}
                    value={bookingTagModal.selectedYarnItemId}
                    onChange={(val) => setBookingTagModal((prev) => ({ ...prev, selectedYarnItemId: val }))}
                    placeholder={
                      !bookingTagModal.selectedBookingNo
                        ? "Select a Block Booking No. first..."
                        : yarnItemDropdownOptions.length === 0
                        ? "No yarn items found in this booking"
                        : "Select Yarn Item in Booking..."
                    }
                    disabled={formMode === "view" || !bookingTagModal.selectedBookingNo}
                    className="w-full text-xs font-semibold"
                  />
                  <p className="text-[11px] text-slate-400">
                    Items sourced directly from selected Block Yarn Booking {bookingTagModal.selectedBookingNo || ""}.
                  </p>
                </div>

                {/* 3. Real-Time Balance Cards (Available Balance, Tag QTY, Remaining Balance) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {/* Available Balance */}
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
                    <span className="text-[10.5px] uppercase font-bold text-slate-500 block mb-1">
                      Available Balance
                    </span>
                    <div className="text-base font-mono font-black text-slate-900 dark:text-white">
                      {tagBalanceInfo.availableKg.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
                      <span className="text-xs font-sans font-bold text-slate-500">KG</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      {tagBalanceInfo.totalBookedKg > 0 ? (
                        <>
                          Booked: {(tagBalanceInfo.totalBookedKg / 1000).toFixed(2)} TON ({tagBalanceInfo.totalBookedKg.toLocaleString()} KG)
                        </>
                      ) : (
                        "Select a yarn item"
                      )}
                    </span>
                  </div>

                  {/* Tag QTY */}
                  <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20">
                    <span className="text-[10.5px] uppercase font-bold text-amber-700 dark:text-amber-400 block mb-1">
                      Tag QTY
                    </span>
                    <div className="text-base font-mono font-black text-amber-800 dark:text-amber-300">
                      {Number(bookingTagModal.finalQtyKg).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
                      <span className="text-xs font-sans font-bold text-amber-600 dark:text-amber-400">KG</span>
                    </div>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 block mt-1">
                      Auto-populated from Final Qty (Kg)
                    </span>
                  </div>

                  {/* Remaining Balance */}
                  <div
                    className={`p-3.5 rounded-xl border ${
                      tagBalanceInfo.isShortage
                        ? "border-rose-300 dark:border-rose-900 bg-rose-50/80 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300"
                        : "border-emerald-300 dark:border-emerald-900 bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300"
                    }`}
                  >
                    <span className="text-[10.5px] uppercase font-bold block mb-1">
                      Remaining Balance
                    </span>
                    <div className="text-base font-mono font-black">
                      {tagBalanceInfo.remainingKg.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
                      <span className="text-xs font-sans font-bold">KG</span>
                    </div>
                    <span className="text-[10px] block mt-1 opacity-80">
                      {tagBalanceInfo.isShortage ? "⚠️ Insufficient Balance" : "✓ Available Balance - Tag QTY"}
                    </span>
                  </div>
                </div>

                {/* Validation Warnings / Confirmation Messages */}
                {tagBalanceInfo.isShortage && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs animate-in fade-in">
                    <AlertCircle className="size-4 shrink-0 mt-0.5 text-rose-600" />
                    <div>
                      <span className="font-bold">Insufficient Booking Balance:</span> The Tag QTY ({bookingTagModal.finalQtyKg.toLocaleString()} KG) exceeds the available balance ({tagBalanceInfo.availableKg.toLocaleString()} KG) by {(bookingTagModal.finalQtyKg - tagBalanceInfo.availableKg).toLocaleString()} KG. Tagging cannot be saved against this yarn item.
                    </div>
                  </div>
                )}

                {!tagBalanceInfo.isShortage && bookingTagModal.selectedBookingNo && bookingTagModal.selectedYarnItemId && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 flex items-center gap-2.5 text-emerald-700 dark:text-emerald-300 text-xs animate-in fade-in">
                    <CheckCircle className="size-4 shrink-0 text-emerald-600" />
                    <div>
                      <span className="font-bold">Booking Balance Verified:</span> {tagBalanceInfo.remainingKg.toLocaleString()} KG will remain available in Block Booking {bookingTagModal.selectedBookingNo} after confirming this tag.
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
                <div>
                  {bookingTagModal.yarnRowIndex !== null &&
                    yarnModal.rows[bookingTagModal.yarnRowIndex]?.bookingTag &&
                    formMode !== "view" && (
                      <button
                        type="button"
                        onClick={handleRemoveBookingTagModal}
                        className="px-3.5 py-2 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Trash2 className="size-3.5" /> Remove Tag & Release Balance
                      </button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingTagModal((prev) => ({ ...prev, isOpen: false }))}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  {formMode !== "view" && (
                    <button
                      type="button"
                      disabled={
                        !bookingTagModal.selectedBookingNo ||
                        !bookingTagModal.selectedYarnItemId ||
                        tagBalanceInfo.isShortage
                      }
                      onClick={handleSaveBookingTagModal}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
                    >
                      <Check className="size-3.5" /> Confirm & Save Tag
                    </button>
                  )}
                </div>
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

export default PreCostingKnitManager;
