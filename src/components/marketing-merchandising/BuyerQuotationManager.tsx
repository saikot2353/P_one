import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Plus, Search, FileText, ArrowLeft, Save, Printer,
  Eye, X, CheckCircle, Clock, AlertCircle, Download,
  FileSpreadsheet, GitBranch, History, Check, ShieldCheck,
  Send, RotateCcw, AlertTriangle, Layers, Trash2, ArrowRight,
  Upload, Paperclip, File, Image as ImageIcon, Info, ExternalLink,
  Scissors, DollarSign, Percent, Sparkles, Disc, RefreshCw, Hash,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Tag, BookmarkCheck, Link2,
  Palette, Activity, Droplets, Sliders
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
  MMFabricSetupRecord,
  MMAopProcessRateRecord,
  MM_MASTER_STORAGE_KEYS,
  MMYarnRateWeeklyRecord,
  PREDEFINED_YARN_COMPOSITIONS,
} from "../../lib/merchandising-master-data";
import { SearchableSelect } from "../ui/searchable-select";
import { BuyerQuotationReport } from "./BuyerQuotationReport";

export interface BuyerQuotationManagerProps {
  initialTab?: "register" | "create" | "compare" | "report";
  initialRecordId?: string;
  onTabChange?: (tab: "register" | "create" | "compare" | "report", recordId?: string) => void;
}
export type BuyerQuotationProps = BuyerQuotationManagerProps;
export type PreCostingKnitManagerProps = BuyerQuotationManagerProps;
export type PreCostingManagerProps = BuyerQuotationManagerProps;

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
  wastagePct?: number;
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
  feederType?: string;
  washType?: string;
  finishType?: string;
  otherSpecs: string;
  fabricCategory: string;
}

export interface KnitYarnDetailRow {
  id: string;
  sl?: number;
  grade: "A" | "B" | "Grade A" | "Grade B" | string;
  colorType?: "Solid" | "Y/D" | string;
  yarnCount: string;
  yarnComposition: string;
  spinningType?: string;
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
  uom?: "KG" | "YDS" | string;
  effectedQtyPcs: number;
  effectedQtyDz?: number;
  consumptionKgDz: number;
  estimatedFinishQty: number;
  rmgProcessLossPct: number;
  requiredFinishedQty: number;
  // Fabric Source & Color Type
  fabricSource?: string;
  colorType?: string;
  // Fabric Master Specification references
  fabricSetupId?: string;
  fabricComposition?: string;
  fabricType?: string;
  gsm?: number;
  spinningType?: string;
  feederType?: string;
  washType?: string;
  finishType?: string;
  otherSpecs?: string;
  fabricCategory?: string;
  // Dyeing
  colorShade: string;
  dyeingMethod: string;
  dyeingProcessLossPct: number;
  dyeingRate: number;
  dyeingCost: number;
  requiredGreigeQty: number;
  // Knitting
  knittingProcessLossPct: number;
  requiredYarnKg: number;
  knittingRate: number;
  knittingCost: number;
  // Yarn Dyeing
  ydType?: string;
  ydProcessLossPct?: number;
  requiredDyedYarnKg?: number;
  ydRate?: number;
  ydCost?: number;
  // AOP
  aopType?: string;
  aopProcessLossPct?: number;
  requiredDyedQty?: number;
  aopRate?: number;
  aopCost?: number;
  // Finishing
  washingRate?: number;
  washingCost?: number;
  finishingRate?: number;
  finishingCost?: number;
  // Cost Totals
  yarnCost: number;
  totalYarnCost?: number;
  totalAmount: number;
  yarnDetails: KnitYarnDetailRow[];
}

export const KNIT_FABRIC_SOURCES = [
  "Production",
  "Grey Purchase",
  "Finish Purchase",
  "Buyer Supplied",
  "Stock",
] as const;

export const KNIT_COLOR_TYPES = [
  "Solid",
  "AOP",
  "Y/D",
  "N/A",
] as const;

export const YD_TYPES = [
  "Feeder Stripe",
  "Engineering Stripe",
] as const;

export const YD_DYEING_METHODS = [
  "Reactive",
  "Dispersed",
  "2 Part Dye",
  "Normal Wash",
  "White Dyeing",
  "N/A",
] as const;

export const AOP_TYPES = [
  "Reactive",
  "Digital",
  "Flock",
  "Discharge",
  "Pigment",
  "Burn Out",
  "Glitter",
  "Foil",
  "Puff Print",
] as const;

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
  costPercent?: number;
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
  "Testing Cost",
  "Courier Cost",
  "Commercial Cost",
  "Freight Cost",
  "Inspection Cost",
  "Commission",
  "Development",
] as const;

export const EMBELLISHMENT_COST_HEADS = [
  "Print",
  "Embroidery",
  "GMT Wash",
] as const;

export const EMBELLISHMENT_SOURCES = [
  "In-house",
  "Sub-Contract",
] as const;

export const KNIT_SPINNING_TYPES = [
  "Slub",
  "N/A",
  "Carded",
  "Filament",
  "Ring",
  "Rotor",
  "Vortex",
  "Airjet",
] as const;

export const KNIT_FEEDER_TYPES = [
  "Half Feeder",
  "Full Feeder",
  "",
] as const;

export const KNIT_WASH_TYPES = [
  "Acid Wash",
  "Stone Wash",
  "Enzyme Wash",
  "Panel Wash",
  "Hydrophilic Softener Wash",
] as const;

export const KNIT_FINISH_TYPES = [
  "Heatset Finish",
  "Brush Finish",
  "Peach Finish",
  "Peach-Brush Finish",
  "Shearing Finish",
  "Moisture Wicking Finish",
  "Teflon Finish",
] as const;

export interface KnitEmbellishmentCostRow {
  id: string;
  sl: number;
  costHead: "Print" | "Embroidery" | "GMT Wash" | string;
  description: string;
  source: "In-house" | "Sub-Contract" | string;
  gmtQty: number;
  qtyInDz: number;
  unitRateDz: number;
  amount: number;
}

export const CALC_BASIS_OPTIONS = [
  "Percentage of Order Value",
  "Per Piece",
  "Per Dozen",
  "Fixed Lump Sum",
] as const;

export interface PreCostingRecord {
  id: string;
  preCostId: string; // e.g. JOB-KT-2026-0001
  preCostNo: string; // e.g. QT-2026-0001
  quotationNo?: string;
  totalOrderQty?: number;
  ratePerPc?: number;
  totalOrderValue?: number;
  gmtItem?: string;
  category?: string;
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
  cmDz?: number;
  note: string;
  // Multiple Purchase Orders
  poRows: MMPreCostPO[];
  // Item-wise costing details
  items: PreCostingItemRow[];
  fabricEntry?: KnitFabricEntryData;
  knitFabricItems?: KnitFabricCostItemRow[];
  accessoriesItems?: PreCostingItemRow[];
  embellishmentItems?: KnitEmbellishmentCostRow[];
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
];
export const ACCESSORY_HEADS = ACCESSORIES_HEADS;

// Conditional item lists per Head
export const SEWING_TRIMS_ITEMS = [
  "Sewing Thread",
  "Main Label",
  "Size Label",
  "Zipper",
  "Button",
  "Elastic",
  "Drawstring",
  "Fusing",
  "Interlining",
] as const;

export const FINISHING_TRIMS_ITEMS = [
  "Carton",
  "Single Poly",
  "Blister Poly",
  "Hang Tag",
  "Price Tag",
  "Barcode Sticker",
  "Tissue Paper",
] as const;

export const ACCESSORY_ITEM_DEFAULTS: Record<string, { unit: string; description: string; defaultRate: number }> = {
  "Sewing Thread": { unit: "Cone", description: "100% Spun Polyester Sewing Thread", defaultRate: 0.15 },
  "Main Label": { unit: "Pcs", description: "Woven Main Brand Neck Label", defaultRate: 0.045 },
  "Size Label": { unit: "Pcs", description: "Woven / Printed Size Label", defaultRate: 0.02 },
  "Zipper": { unit: "Pcs", description: "Nylon / Metal Zipper with Puller", defaultRate: 0.28 },
  "Button": { unit: "Pcs", description: "4-Hole Pearl Garment Button", defaultRate: 0.015 },
  "Elastic": { unit: "Yds", description: "Woven / Braided Elastic Tape", defaultRate: 0.18 },
  "Drawstring": { unit: "Yds", description: "Braided Cotton Drawcord", defaultRate: 0.12 },
  "Fusing": { unit: "Yds", description: "Collar & Placket Fusible Interlining", defaultRate: 0.35 },
  "Interlining": { unit: "Yds", description: "Fusible Microdot Interlining", defaultRate: 0.45 },
  "Carton": { unit: "Carton", description: "7-Ply Export Master Carton", defaultRate: 1.65 },
  "Single Poly": { unit: "Pcs", description: "Self-Adhesive Transparent Poly Bag", defaultRate: 0.035 },
  "Blister Poly": { unit: "Pcs", description: "Master Blister Pack Poly Bag", defaultRate: 0.075 },
  "Hang Tag": { unit: "Pcs", description: "FSC Certified Recycled Hang Tag", defaultRate: 0.065 },
  "Price Tag": { unit: "Pcs", description: "Barcode / Retail Price Ticket", defaultRate: 0.025 },
  "Barcode Sticker": { unit: "Pcs", description: "Thermal Printed Barcode Sticker", defaultRate: 0.015 },
  "Tissue Paper": { unit: "Pkt", description: "Acid-Free Interleaving Tissue Paper", defaultRate: 0.02 },
};

// Exact two selectable values for N. Status
export const NOMINEE_STATUSES = [
  "Nominated",
  "Own Source",
] as const;

export const GMT_ITEM_OPTIONS = [
  "Basic T-Shirt",
  "T-Shirt",
  "Polo Shirt",
  "Shirt",
  "Formal Shirt",
  "Casual Shirt",
  "Trouser",
  "Denim Pant / Jeans",
  "Shorts",
  "Jogger",
  "Sweatshirt",
  "Hoodie",
  "Jacket",
  "Blazer",
  "Waistcoat",
  "Vest",
  "Tank Top",
  "Top",
  "Tunic",
  "Leggings",
  "Skirt",
  "Dress",
  "Nightwear",
  "Pajama Set",
  "Baby Romper",
  "Baby Bodysuit",
  "Kids T-Shirt",
  "Kids Shorts",
  "Sportswear",
  "Tracksuit",
  "Activewear",
] as const;

export const GMT_CATEGORY_OPTIONS = [
  "Men",
  "Women",
  "Kids",
  "Boys",
  "Girls",
  "Baby",
  "Infant",
  "Unisex",
  "Men's Plus Size",
  "Women's Plus Size",
  "Maternity",
  "Newborn",
] as const;

// ── Persistent Storage Helpers & Compression for Images & Attachments ─
export function isQuotaExceededError(err: unknown): boolean {
  if (!err) return false;
  if (err instanceof DOMException) {
    return (
      err.code === 22 ||
      err.code === 1014 ||
      err.name === "QuotaExceededError" ||
      err.name === "NS_ERROR_DOM_QUOTA_REACHED"
    );
  }
  const str = String(err).toLowerCase();
  return str.includes("quota") || str.includes("storage");
}

export function formatByteSize(bytes: number): string {
  if (bytes <= 0) return "0 KB";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Compresses an image file client-side using HTML5 Canvas.
 * Shrinks multi-megabyte photos down to lightweight ~30-60 KB data URLs
 * preventing LocalStorage QuotaExceededError while keeping crisp display quality.
 */
export async function compressImageFile(
  file: File,
  maxWidth = 1024,
  maxHeight = 1024,
  quality = 0.72
): Promise<{ dataUrl: string; sizeBytes: number; sizeFormatted: string }> {
  return new Promise((resolve) => {
    // If not an image or is SVG, read directly as data URL
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        resolve({
          dataUrl,
          sizeBytes: file.size,
          sizeFormatted: formatByteSize(file.size),
        });
      };
      reader.onerror = () => {
        resolve({ dataUrl: "", sizeBytes: 0, sizeFormatted: "0 KB" });
      };
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          resolve({
            dataUrl,
            sizeBytes: file.size,
            sizeFormatted: formatByteSize(file.size),
          });
        };
        reader.readAsDataURL(file);
        return;
      }

      // Draw with white background for transparency handling in JPEG
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Export as JPEG with controlled quality
      let dataUrl = canvas.toDataURL("image/jpeg", quality);
      let sizeBytes = Math.round((dataUrl.length * 3) / 4);

      // If still larger than 120 KB, do a second compression pass at 800px / 0.6 quality
      if (sizeBytes > 120 * 1024) {
        const canvas2 = document.createElement("canvas");
        const scale = Math.min(1, 800 / Math.max(width, height));
        const w2 = Math.max(1, Math.round(width * scale));
        const h2 = Math.max(1, Math.round(height * scale));
        canvas2.width = w2;
        canvas2.height = h2;
        const ctx2 = canvas2.getContext("2d");
        if (ctx2) {
          ctx2.fillStyle = "#FFFFFF";
          ctx2.fillRect(0, 0, w2, h2);
          ctx2.drawImage(canvas, 0, 0, w2, h2);
          dataUrl = canvas2.toDataURL("image/jpeg", 0.6);
          sizeBytes = Math.round((dataUrl.length * 3) / 4);
        }
      }

      resolve({
        dataUrl,
        sizeBytes,
        sizeFormatted: formatByteSize(sizeBytes),
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        resolve({
          dataUrl,
          sizeBytes: file.size,
          sizeFormatted: formatByteSize(file.size),
        });
      };
      reader.onerror = () => resolve({ dataUrl: "", sizeBytes: 0, sizeFormatted: "0 KB" });
      reader.readAsDataURL(file);
    };

    img.src = objectUrl;
  });
}

/**
 * Safely persists the full master records list to Local Storage.
 * If quota is constrained, prunes embedded dataUrls on older inactive records
 * (which remain securely preserved in their own dedicated keys) to ensure zero write failure.
 */
export function safeSaveMasterRecords(list: PreCostingRecord[]): { success: boolean; error?: string } {
  if (typeof window === "undefined") return { success: false };
  try {
    localStorage.setItem("cripton_buyer_quotations_master_v1", JSON.stringify(list));
    return { success: true };
  } catch (err: any) {
    if (isQuotaExceededError(err)) {
      console.warn("Storage quota exceeded on master list. Pruning duplicate embedded dataUrls from non-active records...");
      try {
        const pruned = list.map((rec, index) => {
          if (index === 0) return rec; // keep active record intact
          if (!Array.isArray(rec.attachments)) return rec;
          return {
            ...rec,
            attachments: rec.attachments.map((att) => ({
              ...att,
              dataUrl: att.dataUrl ? att.dataUrl.substring(0, 80) + "..." : undefined,
            })),
          };
        });
        localStorage.setItem("cripton_buyer_quotations_master_v1", JSON.stringify(pruned));
        return { success: true };
      } catch (err2: any) {
        return {
          success: false,
          error: "Browser Local Storage quota (5 MB) exceeded. Please delete unused drafts or style images.",
        };
      }
    }
    return { success: false, error: err?.message || "Storage error" };
  }
}

export function getStoredAttachmentsForRecord(recordId?: string, preCostId?: string): MMPreCostAttachmentRecord[] {
  if (typeof window === "undefined") return [];
  const map = new Map<string, MMPreCostAttachmentRecord>();

  const ingest = (item: MMPreCostAttachmentRecord) => {
    if (!item || !item.id) return;
    const existing = map.get(item.id);
    if (!existing) {
      map.set(item.id, item);
    } else if (!existing.dataUrl && item.dataUrl) {
      map.set(item.id, item);
    }
  };

  try {
    // 1. Dedicated storage by recordId
    if (recordId) {
      const byRec = localStorage.getItem(`cripton_buyer_quotation_images_${recordId}`);
      if (byRec) {
        const parsed = JSON.parse(byRec);
        if (Array.isArray(parsed)) parsed.forEach(ingest);
      }
    }
    // 2. Dedicated storage by preCostId
    if (preCostId) {
      const byJob = localStorage.getItem(`cripton_buyer_quotation_images_${preCostId}`);
      if (byJob) {
        const parsed = JSON.parse(byJob);
        if (Array.isArray(parsed)) parsed.forEach(ingest);
      }
    }
    // 3. Master records list
    const stored = localStorage.getItem("cripton_buyer_quotations_master_v1");
    if (stored) {
      const list: PreCostingRecord[] = JSON.parse(stored);
      if (Array.isArray(list)) {
        const match = list.find((x) => (recordId && x.id === recordId) || (preCostId && x.preCostId === preCostId));
        if (match && Array.isArray(match.attachments)) {
          match.attachments.forEach(ingest);
        }
      }
    }
    // 4. MMRepository library
    if (preCostId) {
      const repoAtts = MMRepository.getPreCostingAttachments(preCostId);
      if (Array.isArray(repoAtts)) repoAtts.forEach(ingest);
    }
  } catch (e) {
    console.error("Failed to load stored attachments:", e);
  }

  return Array.from(map.values());
}

export function saveStoredAttachmentsForRecord(
  recordId: string,
  preCostId: string,
  attachments: MMPreCostAttachmentRecord[]
): { success: boolean; error?: string } {
  if (typeof window === "undefined") return { success: false };

  let quotaErrorOccurred = false;

  // 1. Primary dedicated key by recordId
  if (recordId) {
    try {
      localStorage.setItem(`cripton_buyer_quotation_images_${recordId}`, JSON.stringify(attachments));
    } catch (e: any) {
      if (isQuotaExceededError(e)) {
        quotaErrorOccurred = true;
      }
    }
  }

  // 2. Secondary alias key by preCostId (only if different from recordId)
  if (preCostId && preCostId !== recordId) {
    try {
      localStorage.setItem(`cripton_buyer_quotation_images_${preCostId}`, JSON.stringify(attachments));
    } catch (e: any) {
      if (isQuotaExceededError(e)) {
        quotaErrorOccurred = true;
      }
    }
  }

  // 3. Keep index of image keys in localStorage
  try {
    const rawIdx = localStorage.getItem("cripton_buyer_quotation_image_index_v1");
    const idxList: string[] = rawIdx ? JSON.parse(rawIdx) : [];
    const set = new Set(idxList);
    if (recordId) set.add(recordId);
    if (preCostId) set.add(preCostId);
    localStorage.setItem("cripton_buyer_quotation_image_index_v1", JSON.stringify(Array.from(set)));
  } catch {}

  // 4. Merge into MMRepository PreCosting Attachments library
  try {
    const currentRepo = MMRepository.getPreCostingAttachments();
    const otherAtts = currentRepo.filter((a) => a.preCostId !== preCostId && a.preCostId !== recordId);
    MMRepository.savePreCostingAttachments([...attachments, ...otherAtts]);
  } catch (e: any) {
    if (isQuotaExceededError(e)) {
      quotaErrorOccurred = true;
    }
  }

  if (quotaErrorOccurred) {
    return {
      success: false,
      error: "Local Storage quota reached. Some image data could not be saved to browser storage. Please remove unused images or drafts.",
    };
  }

  return { success: true };
}

export const FABRIC_UOM_OPTIONS = ["KG", "YDS"] as const;

export const ACCESSORY_UOM_OPTIONS = [
  "Pcs",
  "Dzn",
  "Gross",
  "Cone",
  "Yds",
  "Mtr",
  "Roll",
  "Set",
  "Thousand",
  "Box",
  "Pkt",
  "Carton",
  "Lbs",
  "Kg",
] as const;

export const isFinishingTrimItem = (item: { itemName?: string; category?: string; description?: string }): boolean => {
  const cat = (item.category || "").toLowerCase();
  const name = (item.itemName || "").toLowerCase();
  const desc = (item.description || "").toLowerCase();
  const text = `${cat} ${name} ${desc}`;
  if (cat.includes("finish")) return true;
  return (
    text.includes("carton") ||
    text.includes("poly") ||
    text.includes("blister") ||
    text.includes("hang tag") ||
    text.includes("hangtag") ||
    text.includes("label") ||
    text.includes("sticker") ||
    text.includes("tissue") ||
    text.includes("silica") ||
    text.includes("desiccant") ||
    text.includes("backboard") ||
    text.includes("back board") ||
    text.includes("collar stay") ||
    text.includes("butterfly") ||
    text.includes("gum tape") ||
    text.includes("price ticket")
  );
};

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

// ── Master Rate Matching Utilities ──────────────────────────────
export function findMatchingKnittingRate(
  rates: MMKnittingRate[],
  fabricTypes: MMFabricType[],
  fabricType: string,
  colorType: string,
  feederType: string
): MMKnittingRate | undefined {
  if (!fabricType) return undefined;
  const ftObj = fabricTypes.find(
    (ft) =>
      ft.name.toLowerCase() === fabricType.toLowerCase() ||
      ft.id.toLowerCase() === fabricType.toLowerCase()
  );

  return rates.find((kr) => {
    // 1. Match Fabric Type
    const matchesFabric =
      (kr.fabricTypeName && kr.fabricTypeName.toLowerCase() === fabricType.toLowerCase()) ||
      (ftObj && kr.fabricTypeId === ftObj.id) ||
      kr.fabricTypeId?.toLowerCase() === fabricType.toLowerCase();

    // 2. Match Color Type (Solid or Y/D)
    const normKrColor = (kr.colorType || "Solid").trim().toLowerCase();
    const normTargetColor = (colorType || "Solid").trim().toLowerCase();
    const matchesColor = normKrColor === normTargetColor;

    // 3. Match Feeder Type
    const krFeeder = (kr.feederType !== undefined ? kr.feederType : kr.fitterType || "").trim().toLowerCase();
    const targetFeeder = (feederType || "").trim().toLowerCase();
    const matchesFeeder = krFeeder === targetFeeder;

    return matchesFabric && matchesColor && matchesFeeder;
  });
}

export function findMatchingDyeingRate(
  rates: MMDyeingRate[],
  colorShade: string,
  dyeingMethod: string
): MMDyeingRate | undefined {
  const shadeNorm = (colorShade || "Medium").trim().toLowerCase();
  const methodNorm = (dyeingMethod || "Reactive").trim().toLowerCase();
  return rates.find(
    (dr) =>
      dr.colorShade.trim().toLowerCase() === shadeNorm &&
      dr.dyeingMethod.trim().toLowerCase() === methodNorm
  );
}

export function findMatchingAopRate(
  rates: MMAopProcessRateRecord[],
  aopType: string
): MMAopProcessRateRecord | undefined {
  const typeNorm = (aopType || "Reactive").trim().toLowerCase();
  return rates.find(
    (ar) => ar.aopType.trim().toLowerCase() === typeNorm
  );
}

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

  const fabricSource = row.fabricSource || "Production";
  const colorType = row.colorType || "Solid";

  const dyeingProcessLossPct = Number(row.dyeingProcessLossPct) || 0;
  const dyeingRate = Number(row.dyeingRate) || 0;
  const knittingProcessLossPct = Number(row.knittingProcessLossPct) || 0;
  const knittingRate = Number(row.knittingRate) || 0;

  const ydType = row.ydType || "Feeder Stripe";
  const ydProcessLossPct = Number(row.ydProcessLossPct) || 0;
  const ydRate = Number(row.ydRate) || 0;

  const aopType = row.aopType || "Reactive";
  const aopProcessLossPct = Number(row.aopProcessLossPct) || 0;
  const aopRate = Number(row.aopRate) || 0;

  const washingRate = Number(row.washingRate) || 0;
  const finishingRate = Number(row.finishingRate) || 0;

  let requiredGreigeQty = 0;
  let dyeingCost = 0;
  let requiredYarnKg = 0;
  let knittingCost = 0;
  let requiredDyedYarnKg = 0;
  let ydCost = 0;
  let requiredDyedQty = 0;
  let aopCost = 0;

  if (fabricSource === "Finish Purchase" || colorType === "N/A") {
    // Finish Purchase: No in-house processing costs
    requiredGreigeQty = 0;
    dyeingCost = 0;
    requiredYarnKg = 0;
    knittingCost = 0;
    requiredDyedYarnKg = 0;
    ydCost = 0;
    requiredDyedQty = 0;
    aopCost = 0;
  } else if (fabricSource === "Production") {
    if (colorType === "Y/D") {
      // A. Production + Y/D:
      // Knitting: Required Yarn (kg) = Previous Required QTY (Req. Finished) × (1 + Knitting Loss % / 100)
      requiredYarnKg = Number((requiredFinishedQty * (1 + knittingProcessLossPct / 100)).toFixed(2));
      knittingCost = Number((requiredYarnKg * knittingRate).toFixed(2));
      // Yarn Dyeing: Req. Dyed Yarn QTY = Knitting Required Yarn × (1 + Y/D Loss % / 100)
      requiredDyedYarnKg = Number((requiredYarnKg * (1 + ydProcessLossPct / 100)).toFixed(2));
      ydCost = Number((requiredDyedYarnKg * ydRate).toFixed(2));
      requiredGreigeQty = 0;
      dyeingCost = 0;
    } else if (colorType === "AOP") {
      // C. Production + AOP:
      // AOP: Req. Dyed QTY (AOP) = Req. Finished (Cuttable) QTY × (1 + AOP Loss % / 100)
      requiredDyedQty = Number((requiredFinishedQty * (1 + aopProcessLossPct / 100)).toFixed(2));
      aopCost = Number((requiredDyedQty * aopRate).toFixed(2));
      // Dyeing: Required Greige QTY = Previous (Req. Dyed QTY) × (1 + Dyeing Loss % / 100)
      requiredGreigeQty = Number((requiredDyedQty * (1 + dyeingProcessLossPct / 100)).toFixed(2));
      dyeingCost = Number((requiredGreigeQty * dyeingRate).toFixed(2));
      // Knitting: Required Yarn (kg) = Previous (Required Greige QTY) × (1 + Knitting Loss % / 100)
      requiredYarnKg = Number((requiredGreigeQty * (1 + knittingProcessLossPct / 100)).toFixed(2));
      knittingCost = Number((requiredYarnKg * knittingRate).toFixed(2));
    } else {
      // B. Production + Solid (default):
      // Dyeing: Required Greige QTY = Previous (Req. Finished) × (1 + Dyeing Loss % / 100)
      requiredGreigeQty = Number((requiredFinishedQty * (1 + dyeingProcessLossPct / 100)).toFixed(2));
      dyeingCost = Number((requiredGreigeQty * dyeingRate).toFixed(2));
      // Knitting: Required Yarn (kg) = Previous (Required Greige QTY) × (1 + Knitting Loss % / 100)
      requiredYarnKg = Number((requiredGreigeQty * (1 + knittingProcessLossPct / 100)).toFixed(2));
      knittingCost = Number((requiredYarnKg * knittingRate).toFixed(2));
    }
  } else {
    // D & E: Grey Purchase / Buyer Supplied / Stock:
    if (colorType === "AOP") {
      // E. Grey Purchase / Buyer Supplied / Stock + AOP:
      // AOP: Req. Dyed QTY = Req. Finished × (1 + AOP Loss % / 100)
      requiredDyedQty = Number((requiredFinishedQty * (1 + aopProcessLossPct / 100)).toFixed(2));
      aopCost = Number((requiredDyedQty * aopRate).toFixed(2));
      // Dyeing: Required Greige QTY = Req. Dyed QTY × (1 + Dyeing Loss % / 100)
      requiredGreigeQty = Number((requiredDyedQty * (1 + dyeingProcessLossPct / 100)).toFixed(2));
      dyeingCost = Number((requiredGreigeQty * dyeingRate).toFixed(2));
      requiredYarnKg = 0;
      knittingCost = 0;
    } else if (colorType === "Y/D") {
      requiredDyedYarnKg = Number((requiredFinishedQty * (1 + ydProcessLossPct / 100)).toFixed(2));
      ydCost = Number((requiredDyedYarnKg * ydRate).toFixed(2));
      requiredGreigeQty = 0;
      dyeingCost = 0;
      requiredYarnKg = 0;
      knittingCost = 0;
    } else {
      // D. Grey Purchase / Buyer Supplied / Stock + Solid:
      // Dyeing: Required Greige QTY = Req. Finished × (1 + Dyeing Loss % / 100)
      requiredGreigeQty = Number((requiredFinishedQty * (1 + dyeingProcessLossPct / 100)).toFixed(2));
      dyeingCost = Number((requiredGreigeQty * dyeingRate).toFixed(2));
      requiredYarnKg = 0;
      knittingCost = 0;
    }
  }

  // Finishing Costs:
  // Washing Cost = Required Finished (Cuttable) QTY × Washing Rate
  // Finishing Cost = Required Finished (Cuttable) QTY × Finishing Rate
  const washingCost = Number((requiredFinishedQty * washingRate).toFixed(2));
  const finishingCost = Number((requiredFinishedQty * finishingRate).toFixed(2));

  // Yarn Breakdown update based on required yarn
  const yarnBaseQty = (colorType === "Y/D" && requiredDyedYarnKg > 0) ? requiredDyedYarnKg : requiredYarnKg;
  const rawYarn = Array.isArray(row.yarnDetails) ? row.yarnDetails : [];
  const updatedYarn: KnitYarnDetailRow[] = rawYarn.map((yd) => {
    const ratioPct = Number(yd.ratioPct) || 0;
    const finalQtyKg = Number(((yarnBaseQty * ratioPct) / 100).toFixed(2));
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
  const totalAmount = Number((
    yarnCost +
    dyeingCost +
    knittingCost +
    ydCost +
    aopCost +
    washingCost +
    finishingCost
  ).toFixed(2));

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
    fabricSource,
    colorType,
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
    ydType,
    ydProcessLossPct,
    requiredDyedYarnKg,
    ydRate,
    ydCost,
    aopType,
    aopProcessLossPct,
    requiredDyedQty,
    aopRate,
    aopCost,
    washingRate,
    washingCost,
    finishingRate,
    finishingCost,
    yarnCost,
    totalYarnCost: yarnCost,
    totalAmount,
    uom: row.uom || "KG",
    yarnDetails: updatedYarn,
  };
}

export function computeOtherCostRow(
  row: Partial<KnitOtherCostRow>,
  orderValue: number = 0,
  gmtOrderQty: number = 0
): KnitOtherCostRow {
  const costHead = row.costHead || row.head || "Testing Cost";
  const isPercentage = costHead === "Commercial Cost" || costHead === "Commission";

  const gmtQty =
    row.gmtQty !== undefined && row.gmtQty !== null && row.gmtQty > 0
      ? Number(row.gmtQty)
      : gmtOrderQty > 0
      ? gmtOrderQty
      : 20000;
  const qtyInDz = Number((gmtQty / 12).toFixed(2));

  let amount = 0;
  let unitRateDz = row.unitRateDz !== undefined ? Number(row.unitRateDz) : undefined;
  let costPercent =
    row.costPercent !== undefined
      ? Number(row.costPercent)
      : row.rateOrPct !== undefined
      ? Number(row.rateOrPct)
      : undefined;

  if (isPercentage) {
    const effectivePct = costPercent !== undefined ? costPercent : (costHead === "Commercial Cost" ? 1.25 : 1.5);
    costPercent = effectivePct;
    amount = Number(((orderValue * effectivePct) / 100).toFixed(2));
    unitRateDz = qtyInDz > 0 ? Number((amount / qtyInDz).toFixed(4)) : 0;
  } else {
    if (unitRateDz !== undefined) {
      amount = Number((qtyInDz * unitRateDz).toFixed(2));
    } else if (Number(row.amount) > 0) {
      amount = Number(row.amount);
      unitRateDz = qtyInDz > 0 ? Number((amount / qtyInDz).toFixed(4)) : 0;
    } else {
      unitRateDz = 0.5;
      amount = Number((qtyInDz * unitRateDz).toFixed(2));
    }
  }

  const calcBasis = isPercentage ? "Percentage of Order Value" : (row.calcBasis || "Per Dozen");
  const basisValue = isPercentage ? orderValue : (Number(row.basisValue) || qtyInDz);
  const rateOrPct = isPercentage ? (costPercent ?? 0) : (unitRateDz ?? 0);

  return {
    id: row.id || `oc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    sl: row.sl || 1,
    head: costHead,
    costHead,
    description: row.description || "",
    supplier: row.supplier || "",
    calcBasis,
    basisValue,
    rateOrPct,
    costPercent,
    gmtQty,
    qtyInDz,
    unitRateDz: unitRateDz ?? 0,
    amount,
    quantity: gmtQty,
    currency: row.currency || "USD",
  };
}

export function computeEmbellishmentCostRow(
  row: Partial<KnitEmbellishmentCostRow>,
  gmtOrderQty: number = 0
): KnitEmbellishmentCostRow {
  const gmtQty =
    row.gmtQty !== undefined && row.gmtQty !== null
      ? Number(row.gmtQty)
      : gmtOrderQty > 0
      ? gmtOrderQty
      : 20000;
  const qtyInDz = Number((gmtQty / 12).toFixed(2));
  const unitRateDz = Number(row.unitRateDz) || 0;
  const amount = Number((qtyInDz * unitRateDz).toFixed(2));

  return {
    id: row.id || `emb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    sl: row.sl || 1,
    costHead: row.costHead || "Print",
    description: row.description || "",
    source: row.source || "In-house",
    gmtQty,
    qtyInDz,
    unitRateDz,
    amount,
  };
}

export function syncAllCostingItems(
  knitFabricItems: KnitFabricCostItemRow[] = [],
  accessoriesItems: PreCostingItemRow[] = [],
  otherCostItems: KnitOtherCostRow[] = [],
  embellishmentItems: KnitEmbellishmentCostRow[] = []
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

  const embRows: PreCostingItemRow[] = embellishmentItems.map((e) => ({
    id: e.id,
    sl: sl++,
    head: e.costHead || "Print",
    item: e.costHead || "Print",
    description: `${e.source}${e.description ? ` - ${e.description}` : ""}`,
    nStatus: e.source === "In-house" ? "Own Source" : "Nominated",
    supplier: e.source === "In-house" ? "In-House Unit" : "Sub-Contractor",
    effectedQty: e.gmtQty,
    consumption: 1,
    unit: "DZ",
    requiredQty: e.qtyInDz,
    finalQty: e.qtyInDz,
    rate: e.unitRateDz,
    amount: e.amount,
    preCostPct: 0,
  }));

  const otherRows: PreCostingItemRow[] = otherCostItems.map((o) => {
    const isPct = o.costHead === "Commercial Cost" || o.costHead === "Commission";
    return {
      id: o.id,
      sl: sl++,
      head: o.costHead || o.head || "Commercial Cost",
      item: o.description || o.costHead || o.head || "Other Cost",
      description: isPct
        ? `Cost (%): ${o.costPercent ?? o.rateOrPct ?? 0}%`
        : `${o.calcBasis}: $${(Number(o.unitRateDz) || 0).toFixed(3)}/DZ`,
      nStatus: "Nominated",
      supplier: o.supplier || "Agency / Vendor",
      effectedQty: isPct ? (o.basisValue || 1) : (o.gmtQty || 1),
      consumption: 1,
      unit: isPct ? "%" : "DZ",
      requiredQty: isPct ? 1 : (o.qtyInDz || 1),
      finalQty: isPct ? 1 : (o.qtyInDz || 1),
      rate: isPct ? (o.costPercent ?? o.rateOrPct ?? 0) : (o.unitRateDz || 0),
      amount: o.amount,
      preCostPct: 0,
    };
  });

  const combined = [...fabricRows, ...accRows, ...embRows, ...otherRows];
  const grandTotal = combined.reduce((s, it) => s + (Number(it.amount) || 0), 0);
  return combined.map((it) => ({
    ...it,
    preCostPct: grandTotal > 0 ? Number((((Number(it.amount) || 0) / grandTotal) * 100).toFixed(2)) : 0,
  }));
}

export function getLatestYarnRate(
  count: string,
  composition: string,
  grade: "A" | "B" | string = "A"
): number | null {
  if (!count || !composition) return null;
  try {
    const weeklyRecords = MMMasterDataRepository.getYarnRates();
    if (!Array.isArray(weeklyRecords) || weeklyRecords.length === 0) return null;

    // Sort by effectiveDate / createdAt descending to get the latest week first
    const sorted = [...weeklyRecords].sort((a, b) => {
      const dateA = a.effectiveDate || a.createdAt || "";
      const dateB = b.effectiveDate || b.createdAt || "";
      return dateB.localeCompare(dateA);
    });

    const normalizeCount = (c: string) =>
      (c || "").trim().toLowerCase().replace(/[\/\s]/g, "").replace(/s$/i, "1");
    const normalizeComp = (cp: string) =>
      (cp || "").trim().toLowerCase().replace(/\s+/g, " ");

    const targetCountNorm = normalizeCount(count);
    const targetCompNorm = normalizeComp(composition);
    const targetGradeNorm = (grade || "A").toUpperCase().replace("GRADE ", "");

    for (const rec of sorted) {
      if (rec.status === "Inactive") continue;

      // 1. Exact match with Grade
      const matchWithGrade = (rec.entries || []).find((e) => {
        const eCountNorm = normalizeCount(e.count);
        const eCompNorm = normalizeComp(e.composition);
        const eGradeNorm = (e.grade || "A").toUpperCase();
        return (
          (eCountNorm === targetCountNorm || e.count.toLowerCase() === count.toLowerCase()) &&
          (eCompNorm === targetCompNorm || e.composition.toLowerCase() === composition.toLowerCase()) &&
          eGradeNorm === targetGradeNorm &&
          Number(e.rate) > 0
        );
      });
      if (matchWithGrade) return Number(matchWithGrade.rate);

      // 2. Match without Grade restriction
      const matchAnyGrade = (rec.entries || []).find((e) => {
        const eCountNorm = normalizeCount(e.count);
        const eCompNorm = normalizeComp(e.composition);
        return (
          (eCountNorm === targetCountNorm || e.count.toLowerCase() === count.toLowerCase()) &&
          (eCompNorm === targetCompNorm || e.composition.toLowerCase() === composition.toLowerCase()) &&
          Number(e.rate) > 0
        );
      });
      if (matchAnyGrade) return Number(matchAnyGrade.rate);
    }
  } catch (err) {
    console.error("Failed to fetch latest yarn rate:", err);
  }
  return null;
}

export function ensureKnitCostingStructure(r: any, totalPoVal: number = 0): PreCostingRecord {
  const poRows = Array.isArray(r.poRows) ? r.poRows : [];
  const totalOrderQty =
    r.totalOrderQty !== undefined && Number(r.totalOrderQty) > 0
      ? Number(r.totalOrderQty)
      : poRows.reduce((acc: number, p: any) => acc + (Number(p.poQuantity) || 0), 0) ||
        (Number(r.orderQty) || 20000);
  const ratePerPc =
    r.ratePerPc !== undefined && Number(r.ratePerPc) >= 0
      ? Number(r.ratePerPc)
      : (poRows.length > 0 && poRows[0].rate ? Number(poRows[0].rate) : 4.25);
  const effectivePoVal =
    totalPoVal > 0
      ? totalPoVal
      : r.totalOrderValue !== undefined && Number(r.totalOrderValue) > 0
      ? Number(r.totalOrderValue)
      : poRows.reduce((acc: number, p: any) => acc + (Number(p.value) || 0), 0) ||
        Number((totalOrderQty * ratePerPc).toFixed(2));

  const fabricEntry: KnitFabricEntryData = r.fabricEntry || {
    fabricComposition: r.fabricEntry?.fabricComposition || r.fabricEntry?.composition || "100% Cotton",
    composition: r.fabricEntry?.composition || "100% Cotton",
    fabricType: r.fabricEntry?.fabricType || "2x2 Rib",
    gsm: r.fabricEntry?.gsm || 220,
    spinningType: r.fabricEntry?.spinningType || "Ring",
    feederType: r.fabricEntry?.feederType || "Half Feeder",
    washType: r.fabricEntry?.washType || "Enzyme Wash",
    finishType: r.fabricEntry?.finishType || "Heatset Finish",
    otherSpecs: r.fabricEntry?.otherSpecs || "Bio-washed combed cotton",
    fabricCategory: r.fabricEntry?.fabricCategory === "Woven Fabric" ? "Woven Fabric" : "Knit Fabric",
  };

  const consumptionUnit: "PCS" | "DZ" = r.consumptionUnit || "DZ";
  const hasExplicitFabric = Array.isArray(r.knitFabricItems);
  const hasExplicitAcc = Array.isArray(r.accessoriesItems);
  const hasExplicitOthers = Array.isArray(r.otherCostItems);

  let knitFabricItems: KnitFabricCostItemRow[] = hasExplicitFabric
    ? r.knitFabricItems.map((fi: any) =>
        computeKnitFabricRow(
          {
            fabricSource: "Production",
            colorType: "Solid",
            uom: fi.uom || "KG",
            ...fi,
          },
          consumptionUnit
        )
      )
    : [];
  let accessoriesItems: PreCostingItemRow[] = hasExplicitAcc
    ? r.accessoriesItems.map((it: PreCostingItemRow) => {
        const eff = Number(it.effectedQty || totalOrderQty);
        const cons = Number(it.consumption || 1);
        const wastage = it.wastagePct !== undefined ? Number(it.wastagePct) : 5;
        const baseQty = consumptionUnit === "PCS" ? eff : eff / 12;
        const req = Number((baseQty * cons * (1 + wastage / 100)).toFixed(2));
        return {
          ...it,
          unit: it.unit || "Pcs",
          wastagePct: wastage,
          requiredQty: it.requiredQty !== undefined ? it.requiredQty : req,
        };
      })
    : [];
  let otherCostItems: KnitOtherCostRow[] = hasExplicitOthers
    ? (r.otherCostItems || []).map((o: KnitOtherCostRow) => computeOtherCostRow(o, effectivePoVal, totalOrderQty))
    : [];

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
          costHead: "Commercial Cost",
          description: "Bank charge, LC transmission, & documentation",
          supplier: "Commercial Bank",
          calcBasis: "Percentage of Order Value",
          basisValue: effectivePoVal,
          rateOrPct: 1.25,
          costPercent: 1.25,
          amount: Number(((effectivePoVal * 1.25) / 100).toFixed(2)),
        },
        effectivePoVal,
        totalOrderQty
      ),
    ];
  }

  // Embellishments
  const hasExplicitEmb = Array.isArray(r.embellishmentItems);
  let embellishmentItems: KnitEmbellishmentCostRow[] = hasExplicitEmb ? r.embellishmentItems : [];
  if (!hasExplicitEmb && embellishmentItems.length === 0) {
    embellishmentItems = [
      computeEmbellishmentCostRow(
        {
          id: "emb-def-1",
          sl: 1,
          costHead: "Print",
          description: "Placement chest graphic print",
          source: "In-house",
          gmtQty: 20000,
          unitRateDz: 1.20,
        },
        20000
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

  const smvVal = Number(r.smv) || 4.25;
  const cpmVal = Number(r.cpm) || 0.065;
  const effVal = Number(r.efficiencyPct) || 65;
  const cmDzVal =
    r.cmDz !== undefined
      ? Number(r.cmDz)
      : effVal > 0
      ? Number((((cpmVal * smvVal) / (effVal / 100)) * 12).toFixed(2))
      : 0;

  const items = syncAllCostingItems(knitFabricItems, accessoriesItems, otherCostItems, embellishmentItems);

  const attachments =
    Array.isArray(r.attachments) && r.attachments.length > 0 && r.attachments.some((a: any) => Boolean(a.dataUrl))
      ? r.attachments
      : getStoredAttachmentsForRecord(r.id, r.preCostId);

  return {
    ...r,
    totalOrderQty,
    ratePerPc,
    totalOrderValue: effectivePoVal,
    gmtItem: r.gmtItem || "Basic T-Shirt",
    category: r.category || "Men",
    smv: smvVal,
    cpm: cpmVal,
    efficiencyPct: effVal,
    cmDz: cmDzVal,
    consumptionUnit,
    fabricEntry,
    knitFabricItems,
    accessoriesItems,
    embellishmentItems,
    otherCostItems,
    attachments,
    items,
  };
}

// ── Reference Baseline Sample Data (Knit) ────────────────────────
const INITIAL_RECORDS: PreCostingRecord[] = [
  {
    id: "qt-kt-rec-1",
    preCostId: "JOB-KT-2026-0001",
    quotationNo: "QT-2026-0001",
    preCostNo: "QT-2026-0001",
    totalOrderQty: 39024,
    ratePerPc: 4.15,
    totalOrderValue: 161949.60,
    gmtItem: "T-Shirt",
    category: "Women",
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
    cmDz: 5.54,
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
      gmtItem: r.gmtItem || "T-Shirt",
      category: r.category || "Men",
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


export function recalculateAllCostingDependencies(
  record: PreCostingRecord,
  newOrderQty: number,
  newOrderValue: number
): PreCostingRecord {
  const consumptionUnit = record.consumptionUnit || "DZ";

  // 1. Recalculate Knit Fabric items with newOrderQty
  const updatedFabric = (record.knitFabricItems || []).map((fab) => {
    return computeKnitFabricRow(
      {
        ...fab,
        effectedQtyPcs: newOrderQty,
      },
      consumptionUnit
    );
  });

  // 2. Recalculate Accessories items
  const updatedAccessories = (record.accessoriesItems || []).map((acc) => {
    const eff = newOrderQty;
    const cons = Number(acc.consumption) || 0;
    const wastage = Number(acc.wastagePct) || 0;
    const baseQty = consumptionUnit === "PCS" ? eff : eff / 12;
    const reqQty = Number((baseQty * cons * (1 + wastage / 100)).toFixed(2));
    const finQty = reqQty;
    const rt = Number(acc.rate) || 0;
    const amt = Number((finQty * rt).toFixed(2));
    return {
      ...acc,
      effectedQty: eff,
      requiredQty: reqQty,
      finalQty: finQty,
      amount: amt,
    };
  });

  // 3. Recalculate Embellishment items
  const updatedEmbellishments = (record.embellishmentItems || []).map((emb) => {
    return computeEmbellishmentCostRow(
      {
        ...emb,
        gmtQty: newOrderQty,
      },
      newOrderQty
    );
  });

  // 4. Recalculate Other Cost items (Commercial Cost & Commission depend on newOrderValue, per-dozen depend on newOrderQty)
  const updatedOthers = (record.otherCostItems || []).map((oth) => {
    return computeOtherCostRow(
      {
        ...oth,
        gmtQty: newOrderQty,
        basisValue: newOrderValue,
      },
      newOrderValue,
      newOrderQty
    );
  });

  // 5. Sync into master items array
  const syncedItems = syncAllCostingItems(
    updatedFabric,
    updatedAccessories,
    updatedOthers,
    updatedEmbellishments
  );

  return {
    ...record,
    totalOrderQty: newOrderQty,
    totalOrderValue: newOrderValue,
    knitFabricItems: updatedFabric,
    accessoriesItems: updatedAccessories,
    embellishmentItems: updatedEmbellishments,
    otherCostItems: updatedOthers,
    items: syncedItems,
  };
}

// ── Main Buyer Quotation Component ────────────────────────────
export function BuyerQuotationManager({
  initialTab = "register",
  initialRecordId,
  onTabChange,
}: BuyerQuotationManagerProps) {
  const [records, setRecords] = useState<PreCostingRecord[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("cripton_buyer_quotations_master_v1");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((r) => {
              const poVal = (r.poRows || []).reduce(
                (acc: number, p: any) => acc + (Number(p.value) || 0),
                0
              );
              const atts =
                Array.isArray(r.attachments) && r.attachments.length > 0 && r.attachments.some((a: any) => Boolean(a.dataUrl))
                  ? r.attachments
                  : getStoredAttachmentsForRecord(r.id, r.preCostId);
              const structured = ensureKnitCostingStructure({ ...r, attachments: atts }, poVal);
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
      safeSaveMasterRecords(records);
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

  const lastLoadedInitialRecordIdRef = useRef<string | null>(null);

  // Synchronize view with initialTab and initialRecordId changes
  useEffect(() => {
    if (initialTab === "create") {
      setView("form");
      if (initialRecordId && lastLoadedInitialRecordIdRef.current !== initialRecordId) {
        lastLoadedInitialRecordIdRef.current = initialRecordId;
        const found = records.find((r) => r.id === initialRecordId || r.preCostId === initialRecordId);
        if (found) {
          const poVal = (found.poRows || []).reduce((acc, p) => acc + (Number(p.value) || 0), 0);
          const atts =
            Array.isArray(found.attachments) && found.attachments.length > 0 && found.attachments.some((a: any) => Boolean(a.dataUrl))
              ? found.attachments
              : getStoredAttachmentsForRecord(found.id, found.preCostId);
          setFormData(ensureKnitCostingStructure({ ...found, attachments: atts }, poVal));
          setFormMode("edit");
          try {
            localStorage.setItem("cripton_buyer_quotations_active_id_v1", found.id);
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
  }, [initialTab, initialRecordId]);

  // Master Data sources from MMRepository
  const [seasonsMaster] = useState<MMSeasonMasterItem[]>(() => MMRepository.getSeasons());
  const [fabricMasterItems] = useState<MMFabricMasterItem[]>(() => MMRepository.getFabricMaster());
  const [fabricSetups, setFabricSetups] = useState<MMFabricSetupRecord[]>(() =>
    MMMasterDataRepository.getFabricSetups()
  );
  const [accessoriesMasterItems] = useState<MMAccessoriesMasterItem[]>(() => MMRepository.getAccessoriesMaster());
  const [suppliersMaster] = useState<any[]>(() => MMRepository.getSuppliers());

  // Merchandising Master Data sources for Knit Fabric & Yarn
  const [masterFabricCompositions, setMasterFabricCompositions] = useState<MMFabricComposition[]>(() => MMMasterDataRepository.getFabricCompositions());
  const [masterFabricTypes, setMasterFabricTypes] = useState<MMFabricType[]>(() => MMMasterDataRepository.getFabricTypes());
  const [masterSpinningTypes, setMasterSpinningTypes] = useState<MMSpinningType[]>(() => MMMasterDataRepository.getSpinningTypes());
  const [masterYarnCounts, setMasterYarnCounts] = useState<MMYarnCount[]>(() => MMMasterDataRepository.getYarnCounts());
  const [masterDyeingRates, setMasterDyeingRates] = useState<MMDyeingRate[]>(() => MMMasterDataRepository.getDyeingRates());
  const [masterKnittingRates, setMasterKnittingRates] = useState<MMKnittingRate[]>(() => MMMasterDataRepository.getKnittingRates());
  const [masterAopRates, setMasterAopRates] = useState<MMAopProcessRateRecord[]>(() => MMMasterDataRepository.getAopProcessRates());

  // Real-time synchronization with Local Storage when any Master Data changes
  useEffect(() => {
    const handleStorageUpdate = (e: StorageEvent) => {
      if (e.key === MM_MASTER_STORAGE_KEYS.FABRIC_SETUP) {
        setFabricSetups(MMMasterDataRepository.getFabricSetups());
      } else if (e.key === MM_MASTER_STORAGE_KEYS.FABRIC_COMPOSITION) {
        setMasterFabricCompositions(MMMasterDataRepository.getFabricCompositions());
      } else if (e.key === MM_MASTER_STORAGE_KEYS.FABRIC_TYPE) {
        setMasterFabricTypes(MMMasterDataRepository.getFabricTypes());
      } else if (e.key === MM_MASTER_STORAGE_KEYS.KNITTING_RATE) {
        setMasterKnittingRates(MMMasterDataRepository.getKnittingRates());
      } else if (e.key === MM_MASTER_STORAGE_KEYS.DYEING_RATE) {
        setMasterDyeingRates(MMMasterDataRepository.getDyeingRates());
      } else if (e.key === MM_MASTER_STORAGE_KEYS.AOP_PROCESS_RATE) {
        setMasterAopRates(MMMasterDataRepository.getAopProcessRates());
      }
    };
    window.addEventListener("storage", handleStorageUpdate);
    return () => window.removeEventListener("storage", handleStorageUpdate);
  }, []);

  // 4 Sub-tabs under Item-wise Pre Costing Details
  const [activeCostingTab, setActiveCostingTab] = useState<"fabric" | "accessories" | "embellishment" | "others">("fabric");

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
    spinningType: "Ring",
    feederType: "Half Feeder",
    washType: "Enzyme Wash",
    finishType: "Heatset Finish",
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

  // Dynamic Item Name options populated directly from Fabric Setup Master Register
  const fabricItemOptions = useMemo(() => {
    return fabricSetups.map((f) => ({
      value: f.fabricName,
      label: f.fabricName,
    }));
  }, [fabricSetups]);

  const getFabricItemOptions = (currentVal?: string) => {
    const opts = [...fabricItemOptions];
    if (currentVal && !opts.some((o) => o.value === currentVal)) {
      opts.unshift({ value: currentVal, label: currentVal });
    }
    return opts;
  };

  const yarnCountOptions = useMemo(() => {
    const counts = masterYarnCounts.length > 0
      ? masterYarnCounts.filter((yc) => yc.status !== "Inactive").map((yc) => yc.yarnCount)
      : ["10/1", "20/1", "20/S", "24/1", "26/1", "30/1", "30/S", "34/1", "40/1", "20/2", "30/2", "40/2"];
    const set = new Set<string>(counts);
    return Array.from(set).map((c) => ({
      value: c,
      label: c,
    }));
  }, [masterYarnCounts]);

  const getYarnCountOptions = (currentVal?: string) => {
    const opts = [...yarnCountOptions];
    if (currentVal && !opts.some((o) => o.value === currentVal)) {
      opts.unshift({ value: currentVal, label: currentVal });
    }
    return opts;
  };

  const yarnCompositionOptions = useMemo(() => {
    const compSet = new Set<string>();
    try {
      const weeklyRates = MMMasterDataRepository.getYarnRates();
      weeklyRates.forEach((rec) => {
        (rec.entries || []).forEach((e) => {
          if (e.composition && e.composition.trim()) {
            compSet.add(e.composition.trim());
          }
        });
      });
    } catch (e) {
      console.error("Failed to load yarn rates:", e);
    }
    PREDEFINED_YARN_COMPOSITIONS.forEach((c) => compSet.add(c));
    masterFabricCompositions.forEach((fc) => {
      if (fc.name && fc.status !== "Inactive") compSet.add(fc.name);
    });

    return Array.from(compSet).map((c) => ({
      value: c,
      label: c,
    }));
  }, [masterFabricCompositions]);

  const getYarnCompositionOptions = (currentVal?: string) => {
    const opts = [...yarnCompositionOptions];
    if (currentVal && !opts.some((o) => o.value === currentVal)) {
      opts.unshift({ value: currentVal, label: currentVal });
    }
    return opts;
  };

  const spinningTypeOptions = useMemo(() => {
    return KNIT_SPINNING_TYPES.map((st) => ({
      value: st,
      label: st,
    }));
  }, []);

  const getSpinningTypeOptions = (currentVal?: string) => {
    const opts = [...spinningTypeOptions];
    if (currentVal && !opts.some((o) => o.value === currentVal)) {
      opts.unshift({ value: currentVal, label: currentVal });
    }
    return opts;
  };

  const supplierOptions = useMemo(() => {
    const list: { value: string; label: string }[] = [];
    const seen = new Set<string>();

    const addSupplier = (name?: string, categoryOrCountry?: string) => {
      const trimmed = (name || "").trim();
      if (!trimmed || seen.has(trimmed.toLowerCase())) return;
      seen.add(trimmed.toLowerCase());
      list.push({
        value: trimmed,
        label: categoryOrCountry ? `${trimmed} (${categoryOrCountry})` : trimmed,
      });
    };

    if (Array.isArray(suppliersMaster)) {
      suppliersMaster.forEach((s) => {
        const sName = s.supplierName || s.name;
        const extra = s.category || s.country;
        addSupplier(sName, extra);
      });
    }

    DEFAULT_SUPPLIERS.forEach((name) => {
      addSupplier(name);
    });

    return list.sort((a, b) => a.value.localeCompare(b.value));
  }, [suppliersMaster]);

  const getSupplierOptions = (currentVal?: string) => {
    const opts = [...supplierOptions];
    if (currentVal && !opts.some((o) => o.value.toLowerCase() === currentVal.trim().toLowerCase())) {
      opts.unshift({ value: currentVal, label: currentVal });
    }
    return opts;
  };

  const vendorOptions = useMemo(() => {
    return supplierOptions;
  }, [supplierOptions]);

  const getVendorOptions = (currentVal?: string) => {
    return getSupplierOptions(currentVal);
  };

  const fabricSourceOptions = useMemo(() => {
    return KNIT_FABRIC_SOURCES.map((s) => ({ value: s, label: s }));
  }, []);

  const getFabricSourceOptions = (currentVal?: string) => {
    const opts = [...fabricSourceOptions];
    if (currentVal && !opts.some((o) => o.value === currentVal)) {
      opts.unshift({ value: currentVal, label: currentVal });
    }
    return opts;
  };

  const colorTypeOptions = useMemo(() => {
    return KNIT_COLOR_TYPES.map((c) => ({ value: c, label: c }));
  }, []);

  const getColorTypeOptions = (currentVal?: string) => {
    const opts = [...colorTypeOptions];
    if (currentVal && !opts.some((o) => o.value === currentVal)) {
      opts.unshift({ value: currentVal, label: currentVal });
    }
    return opts;
  };

  const ydTypeOptions = useMemo(() => {
    return YD_TYPES.map((t) => ({ value: t, label: t }));
  }, []);

  const getYdTypeOptions = (currentVal?: string) => {
    const opts = [...ydTypeOptions];
    if (currentVal && !opts.some((o) => o.value === currentVal)) {
      opts.unshift({ value: currentVal, label: currentVal });
    }
    return opts;
  };

  const aopTypeOptions = useMemo(() => {
    return AOP_TYPES.map((t) => ({ value: t, label: t }));
  }, []);

  const getAopTypeOptions = (currentVal?: string) => {
    const opts = [...aopTypeOptions];
    if (currentVal && !opts.some((o) => o.value === currentVal)) {
      opts.unshift({ value: currentVal, label: currentVal });
    }
    return opts;
  };

  // Fabric Process & Costing Details Modal State
  const [fabricDetailsModal, setFabricDetailsModal] = useState<{
    isOpen: boolean;
    rowIndex: number | null;
    tempRow: KnitFabricCostItemRow | null;
  }>({
    isOpen: false,
    rowIndex: null,
    tempRow: null,
  });

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
    let nextSl = records.length + 1;
    let pad = String(nextSl).padStart(4, "0");
    const jobYear = "2026";
    let quotId = `JOB-KT-${jobYear}-${pad}`;
    while (records.some((r) => r.preCostId === quotId || r.id === `qt-kt-${quotId.toLowerCase()}`)) {
      nextSl++;
      pad = String(nextSl).padStart(4, "0");
      quotId = `JOB-KT-${jobYear}-${pad}`;
    }
    const quotNo = `QT-${jobYear}-${pad}`;
    const defaultBuyer = MM_BUYERS_MASTER[0];
    const defaultStyle = defaultBuyer?.styles[0];
    const defaultSeason = seasonsMaster[0]?.seasonName || "Autumn / Winter 2026";
    const loggedInUser = getLoggedInUserMerchant();

    const initialQty = 20000;
    const initialRate = 4.25;
    const initialVal = Number((initialQty * initialRate).toFixed(2));

    const rawRecord: PreCostingRecord = {
      id: `qt-kt-${Date.now()}`,
      preCostId: quotId,
      preCostNo: quotNo,
      quotationNo: quotNo,
      totalOrderQty: initialQty,
      ratePerPc: initialRate,
      totalOrderValue: initialVal,
      gmtItem: "Basic T-Shirt",
      category: "Men",
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
      note: "Buyer price quotation inquiry and knit style costing breakdown.",
      poRows: [
        { id: `po-qt-new-${Date.now()}-1`, sl: 1, poNumber: `PO-${defaultStyle?.styleNo || "STYLE"}-001`, poQuantity: initialQty, rate: initialRate, value: initialVal, remarks: "Main Lot Delivery" },
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

    return ensureKnitCostingStructure(rawRecord, initialVal);
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
        localStorage.setItem("cripton_buyer_quotations_active_id_v1", newRec.id);
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
        const stored = localStorage.getItem("cripton_buyer_quotations_master_v1");
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
              const atts =
                Array.isArray(found.attachments) && found.attachments.length > 0 && found.attachments.some((a) => Boolean(a.dataUrl))
                  ? found.attachments
                  : getStoredAttachmentsForRecord(found.id, found.preCostId);
              return ensureKnitCostingStructure({ ...found, attachments: atts }, poVal);
            }
          }

          // 2. Active editing draft ID in localStorage
          const activeId = localStorage.getItem("cripton_buyer_quotations_active_id_v1");
          if (activeId && initialTab === "create") {
            const found = list.find((r) => r.id === activeId);
            if (found) {
              const poVal = (found.poRows || []).reduce(
                (acc, p) => acc + (Number(p.value) || 0),
                0
              );
              const atts =
                Array.isArray(found.attachments) && found.attachments.length > 0 && found.attachments.some((a) => Boolean(a.dataUrl))
                  ? found.attachments
                  : getStoredAttachmentsForRecord(found.id, found.preCostId);
              return ensureKnitCostingStructure({ ...found, attachments: atts }, poVal);
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
        copy[idx] = formData;
        return copy;
      } else {
        return [formData, ...prev];
      }
    });

    try {
      localStorage.setItem("cripton_buyer_quotations_active_id_v1", formData.id);
    } catch {}
  }, [formData, view]);

  // ── Pre Costing Identification Dropdown Options ────────────────
  const gmtItemSelectOptions = useMemo(
    () => GMT_ITEM_OPTIONS.map((item) => ({ value: item, label: item })),
    []
  );

  const categorySelectOptions = useMemo(
    () => GMT_CATEGORY_OPTIONS.map((cat) => ({ value: cat, label: cat })),
    []
  );

  // ── Available Yarn Item Dropdown Options ───────────────────────
  const availableYarnItemOptions = useMemo(() => {
    const itemSet = new Set<string>();

    // 1. From Block Yarn Bookings
    try {
      const bookings = MMRepository.getManualBookings();
      if (Array.isArray(bookings)) {
        bookings.forEach((b) => {
          if (Array.isArray(b.items)) {
            b.items.forEach((it) => {
              const name = (it.itemDescription || (it as any).itemName || "").trim();
              if (name && name !== "Yarn Item") itemSet.add(name);
            });
          }
        });
      }
    } catch (e) {
      console.warn("Could not load booking items for yarn dropdown:", e);
    }

    // 2. From Master Yarn Rates
    try {
      const rates = MMMasterDataRepository.getYarnRates();
      if (Array.isArray(rates)) {
        rates.forEach((r) => {
          if (Array.isArray(r.entries)) {
            r.entries.forEach((e) => {
              const count = (e.count || "").trim();
              const comp = (e.composition || "").trim();
              if (count && comp) itemSet.add(`${count} ${comp}`);
              else if (count) itemSet.add(count);
            });
          }
        });
      }
    } catch (e) {
      console.warn("Could not load yarn rates for yarn dropdown:", e);
    }

    // 3. Default standard knit yarn items
    const defaultKnitYarnItems = [
      "100% Combed Cotton Yarn Ne 30/1",
      "100% Combed Cotton Yarn Ne 26/1",
      "100% Combed Cotton Yarn Ne 20/1",
      "100% Carded Cotton Yarn Ne 24/1",
      "100% Combed Cotton Yarn Ne 34/1",
      "100% Combed Cotton Yarn Ne 40/1",
      "100% Cotton Grey Melange Yarn Ne 30/1",
      "60% Cotton 40% Polyester (CVC) Yarn Ne 26/1",
      "60% Cotton 40% Polyester (CVC) Yarn Ne 30/1",
      "65% Polyester 35% Cotton (PC) Yarn Ne 30/1",
      "95% Cotton 5% Spandex Yarn Ne 30/1",
      "100% Combed Cotton Ring Spun",
      "30/1 Combed Cotton",
      "26/1 Combed Cotton",
      "20/1 Combed Cotton",
      "24/1 Carded Cotton",
      "34/1 Combed Cotton",
      "40/1 Combed Cotton",
      "30/1 CVC 60/40",
      "26/1 CVC 60/40",
      "30/1 Grey Melange",
      "40D Spandex",
      "70D Spandex",
    ];
    defaultKnitYarnItems.forEach((it) => itemSet.add(it));

    // 4. Fabric composition + master yarn counts combinations
    const currentComp = formData?.fabricEntry?.fabricComposition;
    if (currentComp && Array.isArray(masterYarnCounts)) {
      masterYarnCounts.forEach((yc) => {
        if (yc.yarnCount) {
          itemSet.add(`${yc.yarnCount} ${currentComp}`);
        }
      });
    }

    return Array.from(itemSet).map((name) => ({
      value: name,
      label: name,
    }));
  }, [formData?.fabricEntry?.fabricComposition, masterYarnCounts]);

  const getYarnItemOptions = (currentVal?: string) => {
    const opts = [...availableYarnItemOptions];
    if (currentVal && !opts.some((o) => o.value === currentVal)) {
      opts.unshift({ value: currentVal, label: currentVal });
    }
    return opts;
  };

  // Calculate Consolidated Order Qty & Total PO Value
  const consolidatedOrderQty = useMemo(() => {
    if (formData.totalOrderQty !== undefined && formData.totalOrderQty !== null && Number(formData.totalOrderQty) > 0) {
      return Number(formData.totalOrderQty);
    }
    return (formData.poRows || []).reduce((acc, row) => acc + (Number(row.poQuantity) || 0), 0) || 20000;
  }, [formData.totalOrderQty, formData.poRows]);

  const averagePoRate = useMemo(() => {
    if (formData.ratePerPc !== undefined && formData.ratePerPc !== null && Number(formData.ratePerPc) >= 0) {
      return Number(formData.ratePerPc);
    }
    const poVal = (formData.poRows || []).reduce((acc, row) => acc + (Number(row.value) || 0), 0);
    const poQty = (formData.poRows || []).reduce((acc, row) => acc + (Number(row.poQuantity) || 0), 0);
    return poQty > 0 ? poVal / poQty : 4.25;
  }, [formData.ratePerPc, formData.poRows]);

  const totalPoValue = useMemo(() => {
    return Number((consolidatedOrderQty * averagePoRate).toFixed(2));
  }, [consolidatedOrderQty, averagePoRate]);

  // Handlers for Total Order QTY and Rate ($/pc) with automatic recalculation across costing items
  const handleOrderQtyChange = (qty: number) => {
    if (formMode === "view") return;
    const rate = formData.ratePerPc !== undefined ? formData.ratePerPc : averagePoRate;
    const val = Number((qty * rate).toFixed(2));
    setFormData((prev) => {
      const updatedPo = [
        {
          id: prev.poRows?.[0]?.id || `po-${Date.now()}`,
          sl: 1,
          poNumber: prev.poRows?.[0]?.poNumber || `PO-${prev.style || "QUOT"}-001`,
          poQuantity: qty,
          rate: rate,
          value: val,
          remarks: prev.poRows?.[0]?.remarks || "Quotation Order Qty",
        },
      ];
      const withBase = {
        ...prev,
        totalOrderQty: qty,
        ratePerPc: rate,
        totalOrderValue: val,
        poRows: updatedPo,
      };
      return recalculateAllCostingDependencies(withBase, qty, val);
    });
  };

  const handleRatePerPcChange = (rate: number) => {
    if (formMode === "view") return;
    const qty = formData.totalOrderQty !== undefined ? formData.totalOrderQty : consolidatedOrderQty;
    const val = Number((qty * rate).toFixed(2));
    setFormData((prev) => {
      const updatedPo = [
        {
          id: prev.poRows?.[0]?.id || `po-${Date.now()}`,
          sl: 1,
          poNumber: prev.poRows?.[0]?.poNumber || `PO-${prev.style || "QUOT"}-001`,
          poQuantity: qty,
          rate: rate,
          value: val,
          remarks: prev.poRows?.[0]?.remarks || "Quotation Order Qty",
        },
      ];
      const withBase = {
        ...prev,
        totalOrderQty: qty,
        ratePerPc: rate,
        totalOrderValue: val,
        poRows: updatedPo,
      };
      return recalculateAllCostingDependencies(withBase, qty, val);
    });
  };

  // Calculate Section 3 Sub-Totals & Overall Total
  const totalFabricCost = useMemo(() => {
    return (formData.knitFabricItems || []).reduce((acc, row) => acc + (Number(row.totalAmount) || 0), 0);
  }, [formData.knitFabricItems]);

  const totalAccessoriesCost = useMemo(() => {
    return (formData.accessoriesItems || []).reduce((acc, row) => acc + (Number(row.amount) || 0), 0);
  }, [formData.accessoriesItems]);

  const totalEmbellishmentCost = useMemo(() => {
    return (formData.embellishmentItems || []).reduce((acc, row) => acc + (Number(row.amount) || 0), 0);
  }, [formData.embellishmentItems]);

  const totalOthersCost = useMemo(() => {
    return (formData.otherCostItems || []).reduce((acc, row) => acc + (Number(row.amount) || 0), 0);
  }, [formData.otherCostItems]);

  // Calculate Total Cost & Surplus
  const totalCost = useMemo(() => {
    const sum = totalFabricCost + totalAccessoriesCost + totalEmbellishmentCost + totalOthersCost;
    if (sum > 0) return Number(sum.toFixed(2));
    return (formData.items || []).reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  }, [totalFabricCost, totalAccessoriesCost, totalEmbellishmentCost, totalOthersCost, formData.items]);

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
    setFormData((prev) => {
      const updatedPo = [...(prev.poRows || []), newPo];
      const newPoVal = updatedPo.reduce((acc, p) => acc + (Number(p.value) || 0), 0);
      const newPoQty = updatedPo.reduce((acc, p) => acc + (Number(p.poQuantity) || 0), 0);
      const updatedOthers = (prev.otherCostItems || []).map((row) =>
        computeOtherCostRow(row, newPoVal, newPoQty)
      );
      const syncedItems = syncAllCostingItems(
        prev.knitFabricItems || [],
        prev.accessoriesItems || [],
        updatedOthers,
        prev.embellishmentItems || []
      );
      return {
        ...prev,
        poRows: updatedPo,
        otherCostItems: updatedOthers,
        items: syncedItems,
      };
    });
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
      const newPoVal = copy.reduce((acc, p) => acc + (Number(p.value) || 0), 0);
      const newPoQty = copy.reduce((acc, p) => acc + (Number(p.poQuantity) || 0), 0);
      const updatedOthers = (prev.otherCostItems || []).map((row) =>
        computeOtherCostRow(row, newPoVal, newPoQty)
      );
      const syncedItems = syncAllCostingItems(
        prev.knitFabricItems || [],
        prev.accessoriesItems || [],
        updatedOthers,
        prev.embellishmentItems || []
      );
      return {
        ...prev,
        poRows: copy,
        otherCostItems: updatedOthers,
        items: syncedItems,
      };
    });
  };

  const handleRemovePoRow = (index: number) => {
    if (formMode === "view") return;
    setFormData((prev) => {
      const filtered = prev.poRows.filter((_, i) => i !== index);
      const reindexed = filtered.map((p, i) => ({ ...p, sl: i + 1 }));
      const newPoVal = reindexed.reduce((acc, p) => acc + (Number(p.value) || 0), 0);
      const newPoQty = reindexed.reduce((acc, p) => acc + (Number(p.poQuantity) || 0), 0);
      const updatedOthers = (prev.otherCostItems || []).map((row) =>
        computeOtherCostRow(row, newPoVal, newPoQty)
      );
      const syncedItems = syncAllCostingItems(
        prev.knitFabricItems || [],
        prev.accessoriesItems || [],
        updatedOthers,
        prev.embellishmentItems || []
      );
      return {
        ...prev,
        poRows: reindexed,
        otherCostItems: updatedOthers,
        items: syncedItems,
      };
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
        spinningType: "Ring",
        feederType: "Half Feeder",
        washType: "Hydrophilic Softener Wash",
        finishType: "Heatset Finish",
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
          spinningType: "Ring",
          feederType: "Half Feeder",
          washType: "Hydrophilic Softener Wash",
          finishType: "Heatset Finish",
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
    const defaultSpin = formData.fabricEntry?.spinningType || "Ring";
    const defaultColor = "Solid";
    const defaultRate = getLatestYarnRate(defaultCount, comp, "A") ?? 3.45;

    const defaultYarn: KnitYarnDetailRow = {
      id: `yd-${Date.now()}-1`,
      sl: 1,
      grade: "A",
      colorType: defaultColor,
      yarnCount: defaultCount,
      yarnComposition: comp,
      spinningType: defaultSpin,
      yarnItem: `${defaultCount} ${comp}`,
      ratioPct: 100,
      finalQtyKg: 0,
      ratePerKg: defaultRate,
      yarnCost: 0,
      brand: suppliersMaster[0]?.name || "Square Textiles Ltd",
    };

    const firstSetup = fabricSetups[0];
    const setupComp = firstSetup?.fabricComposition || formData.fabricEntry?.fabricComposition || "100% Cotton";
    const setupFType = firstSetup?.fabricType || formData.fabricEntry?.fabricType || "Single Jersey";
    const setupGsm = firstSetup?.gsm || formData.fabricEntry?.gsm || 180;
    const itemName = firstSetup?.fabricName || `${setupComp} ${setupFType} ${setupGsm} GSM`;
    const setupColor = firstSetup?.colorType || "Solid";
    const setupFeeder = firstSetup?.feederType || "";

    const matchedKnit = findMatchingKnittingRate(
      masterKnittingRates,
      masterFabricTypes,
      setupFType,
      setupColor,
      setupFeeder
    );
    const matchedDye = findMatchingDyeingRate(masterDyeingRates, "Medium", "Reactive");
    const matchedAop = findMatchingAopRate(masterAopRates, "Reactive");

    const newRow = computeKnitFabricRow({
      id: `kfi-${Date.now()}-${nextSl}`,
      sl: nextSl,
      head: nextSl === 1 ? "Shell" : nextSl === 2 ? "Rib / Trims" : "Shell",
      item: itemName,
      fabricSetupId: firstSetup?.id,
      fabricComposition: setupComp,
      fabricType: setupFType,
      gsm: setupGsm,
      spinningType: firstSetup?.spinningType || "Ring",
      feederType: setupFeeder,
      washType: firstSetup?.washType || "Hydrophilic Softener Wash",
      finishType: firstSetup?.finishType || "Heatset Finish",
      otherSpecs: firstSetup?.otherSpecs || "",
      fabricCategory: firstSetup?.fabricCategory || "Knit Fabric",
      effectedQtyPcs: orderPcs,
      consumptionKgDz: 2.45,
      rmgProcessLossPct: 3.0,
      fabricSource: "Production",
      colorType: setupColor,
      colorShade: "Medium",
      dyeingMethod: "Reactive",
      dyeingProcessLossPct: matchedDye ? matchedDye.processLoss : 4.0,
      dyeingRate: matchedDye ? matchedDye.rate : 1.65,
      knittingProcessLossPct: matchedKnit ? matchedKnit.processLossPct : 3.0,
      knittingRate: matchedKnit ? matchedKnit.knittingRate : 0.35,
      ydType: "Feeder Stripe",
      ydProcessLossPct: 3.0,
      ydRate: 0.75,
      aopType: "Reactive",
      aopProcessLossPct: matchedAop ? matchedAop.processLoss : 4.0,
      aopRate: matchedAop ? matchedAop.rate : 0.95,
      washingRate: 0,
      finishingRate: 0,
      yarnDetails: [defaultYarn],
    }, formData.consumptionUnit || "DZ");

    setFormData((prev) => {
      const updatedFabric = [...(prev.knitFabricItems || []), newRow];
      const syncedItems = syncAllCostingItems(updatedFabric, prev.accessoriesItems || [], prev.otherCostItems || [], prev.embellishmentItems || []);
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

      if (field === "fabricSource" && value === "Finish Purchase" && !target.colorType) {
        target.colorType = "N/A";
      }

      // Auto-populate all associated specifications and matching rates when selecting a Fabric Item
      if (field === "item") {
        const found = fabricSetups.find((f) => f.fabricName === value || f.id === value);
        if (found) {
          target.item = found.fabricName;
          target.fabricSetupId = found.id;
          target.fabricComposition = found.fabricComposition;
          target.fabricType = found.fabricType;
          target.gsm = found.gsm;
          target.spinningType = found.spinningType;
          target.feederType = found.feederType;
          target.washType = found.washType;
          target.finishType = found.finishType;
          target.otherSpecs = found.otherSpecs;
          target.fabricCategory = found.fabricCategory;
          target.colorType = found.colorType || target.colorType || "Solid";

          const matchedKnit = findMatchingKnittingRate(
            masterKnittingRates,
            masterFabricTypes,
            found.fabricType,
            target.colorType || found.colorType || "Solid",
            found.feederType || ""
          );
          if (matchedKnit) {
            target.knittingRate = matchedKnit.knittingRate;
            target.knittingProcessLossPct = matchedKnit.processLossPct;
          }
        }
      }

      // Re-evaluate knitting rate if colorType changes
      if (field === "colorType") {
        const matchedKnit = findMatchingKnittingRate(
          masterKnittingRates,
          masterFabricTypes,
          target.fabricType || "",
          value,
          target.feederType || ""
        );
        if (matchedKnit) {
          target.knittingRate = matchedKnit.knittingRate;
          target.knittingProcessLossPct = matchedKnit.processLossPct;
        }
      }

      // Auto-fill dyeing rate/loss if shade or method changed
      if (field === "colorShade" || field === "dyeingMethod") {
        const shade = field === "colorShade" ? value : target.colorShade;
        const method = field === "dyeingMethod" ? value : target.dyeingMethod;
        const matchedDye = findMatchingDyeingRate(masterDyeingRates, shade, method);
        if (matchedDye) {
          target.dyeingRate = matchedDye.rate;
          target.dyeingProcessLossPct = matchedDye.processLoss;
        }
      }

      // Auto-fill AOP rate/loss if AOP type changed
      if (field === "aopType") {
        const matchedAop = findMatchingAopRate(masterAopRates, value);
        if (matchedAop) {
          target.aopRate = matchedAop.rate;
          target.aopProcessLossPct = matchedAop.processLoss;
        }
      }

      copy[index] = computeKnitFabricRow(target, prev.consumptionUnit || "DZ");
      const syncedItems = syncAllCostingItems(copy, prev.accessoriesItems || [], prev.otherCostItems || [], prev.embellishmentItems || []);
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
      const syncedItems = syncAllCostingItems(reindexed, prev.accessoriesItems || [], prev.otherCostItems || [], prev.embellishmentItems || []);
      return {
        ...prev,
        knitFabricItems: reindexed,
        items: syncedItems,
      };
    });
  };

  // ── Fabric Processing & Costing Details Modal Handlers ─────────
  const handleOpenFabricDetailsModal = (idx: number) => {
    const row = (formData.knitFabricItems || [])[idx];
    if (!row) return;

    // Retrieve fabric setup from Fabric Register to guarantee live specifications
    const matchedSetup = fabricSetups.find(
      (s) => (row.fabricSetupId && s.id === row.fabricSetupId) || s.fabricName === row.item
    );

    const fabricType = row.fabricType || matchedSetup?.fabricType || formData.fabricEntry?.fabricType || "";
    const fabricColorType = matchedSetup?.colorType || (row.colorType === "Y/D" ? "Y/D" : "Solid");
    const feederType = row.feederType !== undefined
      ? row.feederType
      : (matchedSetup?.feederType !== undefined
          ? matchedSetup.feederType
          : (formData.fabricEntry?.feederType || ""));

    const matchedKnit = findMatchingKnittingRate(
      masterKnittingRates,
      masterFabricTypes,
      fabricType,
      fabricColorType,
      feederType
    );

    const matchedDye = findMatchingDyeingRate(
      masterDyeingRates,
      row.colorShade || "Medium",
      row.dyeingMethod || "Reactive"
    );

    const matchedAop = findMatchingAopRate(masterAopRates, row.aopType || "Reactive");

    const updatedRow: KnitFabricCostItemRow = {
      ...row,
      fabricSetupId: row.fabricSetupId || matchedSetup?.id,
      fabricComposition: row.fabricComposition || matchedSetup?.fabricComposition,
      fabricType,
      feederType,
      gsm: row.gsm || matchedSetup?.gsm,
      spinningType: row.spinningType || matchedSetup?.spinningType,
      washType: row.washType || matchedSetup?.washType,
      finishType: row.finishType || matchedSetup?.finishType,
      otherSpecs: row.otherSpecs || matchedSetup?.otherSpecs,
      fabricCategory: row.fabricCategory || matchedSetup?.fabricCategory,
    };

    if (matchedKnit) {
      updatedRow.knittingProcessLossPct = matchedKnit.processLossPct;
      updatedRow.knittingRate = matchedKnit.knittingRate;
    }

    if (matchedDye) {
      updatedRow.dyeingProcessLossPct = matchedDye.processLoss;
      updatedRow.dyeingRate = matchedDye.rate;
    }

    if (matchedAop) {
      updatedRow.aopProcessLossPct = matchedAop.processLoss;
      updatedRow.aopRate = matchedAop.rate;
    }

    const recomputed = computeKnitFabricRow(updatedRow, formData.consumptionUnit || "DZ");

    setFabricDetailsModal({
      isOpen: true,
      rowIndex: idx,
      tempRow: recomputed,
    });
  };

  const handleCloseFabricDetailsModal = () => {
    setFabricDetailsModal({
      isOpen: false,
      rowIndex: null,
      tempRow: null,
    });
  };

  const handleUpdateFabricDetailsModalField = (field: keyof KnitFabricCostItemRow, value: any) => {
    setFabricDetailsModal((prev) => {
      if (!prev.tempRow) return prev;
      const updated = { ...prev.tempRow, [field]: value };

      // Automatically update Dyeing Rate when Color Shade or Dyeing Method changes
      if (field === "colorShade" || field === "dyeingMethod") {
        const shade = field === "colorShade" ? value : updated.colorShade;
        const method = field === "dyeingMethod" ? value : updated.dyeingMethod;
        const matchedDye = findMatchingDyeingRate(masterDyeingRates, shade, method);
        if (matchedDye) {
          updated.dyeingProcessLossPct = matchedDye.processLoss;
          updated.dyeingRate = matchedDye.rate;
        }
      }

      // Automatically update AOP Rate when AOP Type changes
      if (field === "aopType") {
        const matchedAop = findMatchingAopRate(masterAopRates, value);
        if (matchedAop) {
          updated.aopProcessLossPct = matchedAop.processLoss;
          updated.aopRate = matchedAop.rate;
        }
      }

      const recomputed = computeKnitFabricRow(updated, formData.consumptionUnit || "DZ");
      return {
        ...prev,
        tempRow: recomputed,
      };
    });
  };

  const handleSaveFabricDetailsModal = () => {
    if (fabricDetailsModal.rowIndex === null || !fabricDetailsModal.tempRow) return;
    const idx = fabricDetailsModal.rowIndex;
    const finalRow = fabricDetailsModal.tempRow;
    setFormData((prev) => {
      const copy = [...(prev.knitFabricItems || [])];
      copy[idx] = finalRow;
      const syncedItems = syncAllCostingItems(copy, prev.accessoriesItems || [], prev.otherCostItems || [], prev.embellishmentItems || []);
      return {
        ...prev,
        knitFabricItems: copy,
        items: syncedItems,
      };
    });
    handleCloseFabricDetailsModal();
    toast.success("Fabric process details saved and costing updated.");
  };

  // ── Yarn Details Modal Handlers ────────────────────────────────
  const handleOpenYarnModal = (rowIndex: number) => {
    const row = (formData.knitFabricItems || [])[rowIndex];
    if (!row) return;

    const initialRows = (row.yarnDetails && row.yarnDetails.length > 0)
      ? row.yarnDetails.map((y) => {
          const c = y.yarnCount || masterYarnCounts[0]?.yarnCount || "30/1";
          const comp = y.yarnComposition || formData.fabricEntry?.fabricComposition || "100% Combed Cotton";
          const spin = y.spinningType || formData.fabricEntry?.spinningType || "Ring";
          const col = y.colorType || "Solid";
          const g = y.grade === "Grade B" ? "B" : y.grade === "B" ? "B" : "A";
          const savedTag = y.bookingTag || MMRepository.getYarnBookingTagByRowId(y.id);
          const computedItem = [c, comp].filter(Boolean).join(" ");
          const rate = Number(y.ratePerKg) > 0 ? Number(y.ratePerKg) : (getLatestYarnRate(c, comp, g) ?? 3.45);
          return {
            ...y,
            grade: g,
            yarnCount: c,
            yarnComposition: comp,
            spinningType: spin,
            colorType: col,
            yarnItem: y.yarnItem || computedItem,
            ratePerKg: rate,
            brand: y.brand || suppliersMaster[0]?.name || "Square Textiles Ltd",
            bookingTag: savedTag,
          };
        })
      : [
          (() => {
            const defaultCount = masterYarnCounts[0]?.yarnCount || "30/1";
            const defaultComp = formData.fabricEntry?.fabricComposition || "100% Combed Cotton";
            const defaultSpin = formData.fabricEntry?.spinningType || "Ring";
            const defaultRate = getLatestYarnRate(defaultCount, defaultComp, "A") ?? 3.45;
            return {
              id: `yd-${Date.now()}-1`,
              sl: 1,
              grade: "A" as const,
              colorType: "Solid",
              yarnCount: defaultCount,
              yarnComposition: defaultComp,
              spinningType: defaultSpin,
              yarnItem: `${defaultCount} ${defaultComp}`,
              ratioPct: 100,
              finalQtyKg: row.requiredYarnKg,
              ratePerKg: defaultRate,
              yarnCost: Number((row.requiredYarnKg * defaultRate).toFixed(2)),
              brand: suppliersMaster[0]?.name || "Square Textiles Ltd",
            };
          })(),
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
    const defaultCount = masterYarnCounts[0]?.yarnCount || "30/1";
    const defaultComp = formData.fabricEntry?.fabricComposition || "100% Combed Cotton";
    const defaultSpin = formData.fabricEntry?.spinningType || "Ring";
    const fetchedRate = getLatestYarnRate(defaultCount, defaultComp, "A");
    const rate = fetchedRate !== null ? fetchedRate : 3.45;
    const cost = Number((finalQty * rate).toFixed(2));
    const generatedItem = `${defaultCount} ${defaultComp}`;

    const newRow: KnitYarnDetailRow = {
      id: `yd-m-${Date.now()}-${nextSl}`,
      sl: nextSl,
      grade: "A",
      colorType: "Solid",
      yarnCount: defaultCount,
      yarnComposition: defaultComp,
      spinningType: defaultSpin,
      yarnItem: generatedItem,
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

      // When Yarn Count or Yarn Composition changes:
      // 1. Automatically update Yarn Item* (read-only combination of Yarn Count and Yarn Composition)
      // 2. Automatically fetch latest updated rate from Weekly Yarn Rate Master based on Yarn Count & Composition
      // 3. Recalculate Yarn Cost
      if (field === "yarnCount" || field === "yarnComposition") {
        const c = field === "yarnCount" ? String(value || "") : (target.yarnCount || "");
        const comp = field === "yarnComposition" ? String(value || "") : (target.yarnComposition || "");
        const g = target.grade || "A";

        // Generate Yarn Item read-only value
        target.yarnItem = [c, comp].filter(Boolean).join(" ");

        // Auto fetch latest rate
        const fetchedRate = getLatestYarnRate(c, comp, g);
        if (fetchedRate !== null) {
          target.ratePerKg = fetchedRate;
        }
      }

      if (field === "grade") {
        const g = String(value || "A");
        const c = target.yarnCount || "";
        const comp = target.yarnComposition || "";
        const fetchedRate = getLatestYarnRate(c, comp, g);
        if (fetchedRate !== null) {
          target.ratePerKg = fetchedRate;
        }
      }

      const ratio = Number(target.ratioPct) || 0;
      const rate = Number(target.ratePerKg) || 0;
      target.finalQtyKg = Number((prev.requiredYarnKg * (ratio / 100)).toFixed(2));
      target.yarnCost = Number((target.finalQtyKg * rate).toFixed(2));

      copy[idx] = target;
      return { ...prev, rows: copy };
    });
  };

  const handleRemoveYarnModalRow = (idx: number) => {
    setYarnModal((prev) => {
      const rowToRemove = prev.rows[idx];
      if (rowToRemove?.id) {
        MMRepository.removeYarnBookingTag(rowToRemove.id, formData.preCostId || formData.id);
      }
      const filtered = prev.rows.filter((_, i) => i !== idx);
      const reindexed = filtered.map((r, i) => ({ ...r, sl: i + 1 }));
      return { ...prev, rows: reindexed };
    });
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("storage"));
    }
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
      const syncedItems = syncAllCostingItems(copy, prev.accessoriesItems || [], prev.otherCostItems || [], prev.embellishmentItems || []);
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
    // Check if this yarn row already has a saved tag:
    const existingTag =
      yRow.bookingTag && (yRow.bookingTag.blockBookingNo || yRow.bookingTag.blockBookingId)
        ? yRow.bookingTag
        : MMRepository.getYarnBookingTagByRowId(yRow.id);

    const finalQty = Number(yRow.finalQtyKg) || 0;

    let initBookingNo = "";
    let initYarnItemId = "";

    // ONLY populate if there is an existing saved tag for this row (editing existing tag)
    // Do NOT automatically select an arbitrary Block Booking Number or Yarn Item!
    if (existingTag && (existingTag.blockBookingNo || existingTag.blockBookingId)) {
      initBookingNo = existingTag.blockBookingNo || existingTag.blockBookingId || "";
      initYarnItemId = existingTag.yarnItemId || "";
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
          (it as any).id === bookingTagModal.selectedYarnItemId ||
          it.itemDescription === bookingTagModal.selectedYarnItemId
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
    return allBookings.map((b) => {
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
  }, [bookingTagModal.yarnRowId]);

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
    // When changing the Block Booking Number, reload Yarn Item options and keep Yarn Item unselected
    setBookingTagModal((prev) => ({
      ...prev,
      selectedBookingNo: bNo,
      selectedYarnItemId: "", // Reset yarn item so user explicitly picks one
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
      "PC-2026-0001";

    const targetYarnRow =
      bookingTagModal.yarnRowIndex !== null && yarnModal.rows[bookingTagModal.yarnRowIndex]
        ? yarnModal.rows[bookingTagModal.yarnRowIndex]
        : undefined;

    const resolvedYarnItemName =
      activeYarnItem?.itemDescription ||
      (activeBooking?.items &&
        activeBooking.items.find(
          (it) =>
            it.bookingItemId === bookingTagModal.selectedYarnItemId ||
            (it as any).id === bookingTagModal.selectedYarnItemId ||
            it.itemDescription === bookingTagModal.selectedYarnItemId
        )?.itemDescription) ||
      "";

    const tagRecord: MMYarnBookingTagRecord = {
      id: `ytag-${preCostId}-${bookingTagModal.yarnRowId}`,
      preCostId: preCostId,
      preCostMasterId: formData.id,
      yarnRowId: bookingTagModal.yarnRowId,
      blockBookingNo: bookingTagModal.selectedBookingNo,
      blockBookingId: activeBooking?.id || bookingTagModal.selectedBookingNo,
      yarnItemId: bookingTagModal.selectedYarnItemId,
      yarnItemName: resolvedYarnItemName,
      supplierName: activeBooking?.supplierName || "",
      tagQtyKg: bookingTagModal.finalQtyKg,
      availableBalanceAtTag: tagBalanceInfo.availableKg,
      remainingBalanceAtTag: tagBalanceInfo.remainingKg,
      taggedAt: new Date().toISOString(),
      buyer: formData.buyer || "",
      season: formData.season || "",
      job: preCostId,
      yarnCount:
        targetYarnRow?.yarnCount ||
        (targetYarnRow?.yarnItem
          ? targetYarnRow.yarnItem.match(/\b(\d+[\/s]\d+|\d+D|\d+s)\b/i)?.[0] ||
            targetYarnRow.yarnItem.split(" ")[0]
          : ""),
      price: Number(targetYarnRow?.ratePerKg) || 0,
    };

    // 1. Save to dedicated persistent transaction ledger
    MMRepository.saveYarnBookingTag(tagRecord);

    // 2. Update yarn modal rows state
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

    // 3. Immediately update formData and persist to localStorage
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
        const updated = {
          ...prev,
          knitFabricItems: copyFabric,
        };

        try {
          const currentStored = localStorage.getItem("cripton_buyer_quotations_master_v1");
          const list: PreCostingRecord[] = currentStored ? JSON.parse(currentStored) : [];
          const idx = list.findIndex((r) => r.id === updated.id);
          if (idx >= 0) {
            list[idx] = updated;
          } else {
            list.unshift(updated);
          }
          localStorage.setItem("cripton_buyer_quotations_master_v1", JSON.stringify(list));
        } catch {}

        return updated;
      });
    }

    // 4. Trigger storage event for live multi-tab & route synchronization
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("storage"));
    }

    toast.success(
      `Yarn row tagged to Block Booking ${tagRecord.blockBookingNo} (${tagRecord.tagQtyKg.toLocaleString()} KG).`
    );
    setBookingTagModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleRemoveBookingTagModal = () => {
    if (bookingTagModal.yarnRowId) {
      MMRepository.removeYarnBookingTag(bookingTagModal.yarnRowId, formData.preCostId || formData.id);
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
        const updated = {
          ...prev,
          knitFabricItems: copyFabric,
        };

        try {
          const currentStored = localStorage.getItem("cripton_buyer_quotations_master_v1");
          const list: PreCostingRecord[] = currentStored ? JSON.parse(currentStored) : [];
          const idx = list.findIndex((r) => r.id === updated.id);
          if (idx >= 0) {
            list[idx] = updated;
          } else {
            list.unshift(updated);
          }
          localStorage.setItem("cripton_buyer_quotations_master_v1", JSON.stringify(list));
        } catch {}

        return updated;
      });
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("storage"));
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
    const wastage = 5;
    const reqQty = Number((baseQty * 1.0 * (1 + wastage / 100)).toFixed(2));
    const defaultHead = "Sewing Trims";
    const defaultItem = SEWING_TRIMS_ITEMS[0]; // "Sewing Thread"
    const def = ACCESSORY_ITEM_DEFAULTS[defaultItem];

    const newItem: PreCostingItemRow = {
      id: `acc-${Date.now()}-${nextSl}`,
      sl: nextSl,
      preCostItemId: `PCI-ACC-${formData.version}-${nextSl}`,
      head: defaultHead,
      item: defaultItem,
      description: def?.description || "100% Spun Polyester Sewing Thread",
      nStatus: "Nominated",
      supplier: suppliersMaster[0]?.name || DEFAULT_SUPPLIERS[0],
      effectedQty: defaultEffQty,
      consumption: 1.0,
      wastagePct: wastage,
      unit: def?.unit || "Cone",
      requiredQty: reqQty,
      finalQty: reqQty,
      rate: def?.defaultRate || 0.15,
      amount: Number((reqQty * (def?.defaultRate || 0.15)).toFixed(2)),
      preCostPct: 0,
    };

    setFormData((prev) => {
      const updatedAcc = [...(prev.accessoriesItems || []), newItem];
      const syncedItems = syncAllCostingItems(prev.knitFabricItems || [], updatedAcc, prev.otherCostItems || [], prev.embellishmentItems || []);
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
      if (field === "head") {
        if (value === "Finishing Trims") {
          if (!FINISHING_TRIMS_ITEMS.includes(target.item as any)) {
            const firstFin = FINISHING_TRIMS_ITEMS[0];
            target.item = firstFin;
            const def = ACCESSORY_ITEM_DEFAULTS[firstFin];
            if (def) {
              target.description = def.description;
              target.unit = def.unit;
              target.rate = def.defaultRate;
            }
          }
        } else {
          // Sewing Trims
          if (!SEWING_TRIMS_ITEMS.includes(target.item as any)) {
            const firstSew = SEWING_TRIMS_ITEMS[0];
            target.item = firstSew;
            const def = ACCESSORY_ITEM_DEFAULTS[firstSew];
            if (def) {
              target.description = def.description;
              target.unit = def.unit;
              target.rate = def.defaultRate;
            }
          }
        }
      }
      if (field === "item") {
        const itemDef = ACCESSORY_ITEM_DEFAULTS[value];
        if (itemDef) {
          target.description = itemDef.description;
          target.unit = itemDef.unit;
          if (itemDef.defaultRate) target.rate = itemDef.defaultRate;
        } else {
          const found = accessoriesMasterItems.find((a) => a.itemName === value || a.itemName.toLowerCase().includes(String(value).toLowerCase()));
          if (found) {
            target.description = `${found.category} - ${found.description}`;
            target.unit = found.unit || target.unit || "Pcs";
            if (found.defaultRate) {
              target.rate = found.defaultRate;
            }
          }
        }
      }
      if (
        field === "effectedQty" ||
        field === "consumption" ||
        field === "wastagePct" ||
        field === "finalQty" ||
        field === "rate" ||
        field === "item" ||
        field === "head"
      ) {
        const eff = field === "effectedQty" ? Number(value) || 0 : Number(target.effectedQty) || 0;
        const cons = field === "consumption" ? Number(value) || 0 : Number(target.consumption) || 0;
        const wastage = field === "wastagePct" ? Number(value) || 0 : Number(target.wastagePct ?? 5);
        target.wastagePct = wastage;
        const unit = prev.consumptionUnit || "DZ";
        const baseQty = unit === "PCS" ? eff : eff / 12;
        // Automatically calculate Required Qty based on Consumption and Wastage (%)
        target.requiredQty = Number((baseQty * cons * (1 + wastage / 100)).toFixed(2));
        if (field !== "finalQty") {
          target.finalQty = target.requiredQty;
        }
        const fin = Number(target.finalQty) || 0;
        const r = Number(target.rate) || 0;
        target.amount = Number((fin * r).toFixed(2));
      }
      copy[index] = target;
      const syncedItems = syncAllCostingItems(prev.knitFabricItems || [], copy, prev.otherCostItems || [], prev.embellishmentItems || []);
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
      const syncedItems = syncAllCostingItems(prev.knitFabricItems || [], reindexed, prev.otherCostItems || [], prev.embellishmentItems || []);
      return {
        ...prev,
        accessoriesItems: reindexed,
        items: syncedItems,
      };
    });
  };

  // ── Embellishment Cost Handlers ───────────────────────────────
  const handleAddEmbellishmentRow = () => {
    if (formMode === "view") return;
    const nextSl = (formData.embellishmentItems || []).length + 1;
    const defaultQty = consolidatedOrderQty > 0 ? consolidatedOrderQty : 20000;
    const newRow = computeEmbellishmentCostRow(
      {
        id: `emb-${Date.now()}-${nextSl}`,
        sl: nextSl,
        costHead: "Print",
        description: "",
        source: "In-house",
        gmtQty: defaultQty,
        unitRateDz: 1.20,
      },
      defaultQty
    );

    setFormData((prev) => {
      const updatedEmb = [...(prev.embellishmentItems || []), newRow];
      const syncedItems = syncAllCostingItems(
        prev.knitFabricItems || [],
        prev.accessoriesItems || [],
        prev.otherCostItems || [],
        updatedEmb
      );
      return {
        ...prev,
        embellishmentItems: updatedEmb,
        items: syncedItems,
      };
    });
  };

  const handleUpdateEmbellishmentRow = (
    index: number,
    field: keyof KnitEmbellishmentCostRow,
    value: any
  ) => {
    if (formMode === "view") return;
    setFormData((prev) => {
      const copy = [...(prev.embellishmentItems || [])];
      const target = { ...copy[index], [field]: value };
      copy[index] = computeEmbellishmentCostRow(target, consolidatedOrderQty);
      const syncedItems = syncAllCostingItems(
        prev.knitFabricItems || [],
        prev.accessoriesItems || [],
        prev.otherCostItems || [],
        copy
      );
      return {
        ...prev,
        embellishmentItems: copy,
        items: syncedItems,
      };
    });
  };

  const handleRemoveEmbellishmentRow = (index: number) => {
    if (formMode === "view") return;
    setFormData((prev) => {
      const filtered = (prev.embellishmentItems || []).filter((_, i) => i !== index);
      const reindexed = filtered.map((r, i) => ({ ...r, sl: i + 1 }));
      const syncedItems = syncAllCostingItems(
        prev.knitFabricItems || [],
        prev.accessoriesItems || [],
        prev.otherCostItems || [],
        reindexed
      );
      return {
        ...prev,
        embellishmentItems: reindexed,
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
        costHead: "Testing Cost",
        description: "",
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
      const syncedItems = syncAllCostingItems(
        prev.knitFabricItems || [],
        prev.accessoriesItems || [],
        updatedOthers,
        prev.embellishmentItems || []
      );
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
      if (field === "costHead") {
        if (value === "Commercial Cost" || value === "Commission") {
          target.calcBasis = "Percentage of Order Value";
          if (target.costPercent === undefined || target.costPercent === 0) {
            target.costPercent =
              target.rateOrPct && target.rateOrPct > 0
                ? target.rateOrPct
                : value === "Commercial Cost"
                ? 1.25
                : 1.5;
          }
        } else {
          target.calcBasis = "Per Dozen";
          if (!target.unitRateDz || target.unitRateDz === 0) {
            target.unitRateDz = 0.5;
          }
        }
      }
      copy[index] = computeOtherCostRow(target, totalPoValue, consolidatedOrderQty);
      const syncedItems = syncAllCostingItems(
        prev.knitFabricItems || [],
        prev.accessoriesItems || [],
        copy,
        prev.embellishmentItems || []
      );
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
      const syncedItems = syncAllCostingItems(
        prev.knitFabricItems || [],
        prev.accessoriesItems || [],
        reindexed,
        prev.embellishmentItems || []
      );
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
      const syncedItems = syncAllCostingItems(
        updatedFabric,
        updatedAccessories,
        updatedOthers,
        prev.embellishmentItems || []
      );
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

  const handleUploadAttachment = async () => {
    setUploadError(null);
    if (!selectedUploadFile) {
      setUploadError("Please select a file to upload.");
      return;
    }
    if (!uploadTitle.trim()) {
      setUploadError("Attachment Title is required.");
      return;
    }

    try {
      const isImg = selectedUploadFile.type.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg)$/i.test(selectedUploadFile.name);
      let dataUrl = "";
      let fileSize = "";
      let fileSizeBytes = selectedUploadFile.size;

      if (isImg) {
        const compressed = await compressImageFile(selectedUploadFile, 1024, 1024, 0.72);
        dataUrl = compressed.dataUrl;
        fileSize = compressed.sizeFormatted;
        fileSizeBytes = compressed.sizeBytes;
      } else {
        const reader = new FileReader();
        dataUrl = await new Promise((res, rej) => {
          reader.onload = () => res(reader.result as string);
          reader.onerror = () => rej(new Error("Failed to read file"));
          reader.readAsDataURL(selectedUploadFile);
        });
        fileSize = formatByteSize(selectedUploadFile.size);
      }

      const newRecord: MMPreCostAttachmentRecord = {
        id: `att-pc-${Date.now()}`,
        preCostId: formData.preCostId || "JOB-2026-0001",
        version: formData.version || 1,
        fileName: selectedUploadFile.name,
        title: uploadTitle.trim(),
        note: uploadNote.trim(),
        fileSize: fileSize,
        fileSizeBytes: fileSizeBytes,
        uploadedBy: formData.merchandiser || getLoggedInUserMerchant(),
        uploadTime: new Date().toISOString().replace("T", " ").substring(0, 16),
        storageType: isImg ? "image" : "file",
        dataUrl: dataUrl,
      };

      setFormData((prev) => {
        const nextAtts = [newRecord, ...(prev.attachments || [])];
        const saveRes = saveStoredAttachmentsForRecord(prev.id, prev.preCostId, nextAtts);
        if (!saveRes.success && saveRes.error) {
          toast.error(saveRes.error);
        }

        const updated = { ...prev, attachments: nextAtts };
        try {
          const currentStored = localStorage.getItem("cripton_buyer_quotations_master_v1");
          const list: PreCostingRecord[] = currentStored ? JSON.parse(currentStored) : [];
          const idx = list.findIndex((x) => x.id === updated.id || x.preCostId === updated.preCostId);
          if (idx >= 0) {
            list[idx] = updated;
          } else {
            list.unshift(updated);
          }
          safeSaveMasterRecords(list);
          localStorage.setItem("cripton_buyer_quotations_active_id_v1", updated.id);
        } catch (e) {
          console.error("Failed to persist attachment to localStorage:", e);
        }

        setRecords((recList) => {
          const idx = recList.findIndex((r) => r.id === updated.id || r.preCostId === updated.preCostId);
          if (idx >= 0) {
            const copy = [...recList];
            copy[idx] = updated;
            return copy;
          }
          return [updated, ...recList];
        });

        return updated;
      });

      setSelectedUploadFile(null);
      setUploadTitle("");
      setUploadNote("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success(`Attachment "${newRecord.title}" uploaded and saved.`);
    } catch (err: any) {
      setUploadError(err?.message || "Failed to upload file.");
    }
  };

  const handleDeleteAttachment = (id: string) => {
    if (formMode === "view") return;
    setFormData((prev) => {
      const nextAtts = (prev.attachments || []).filter((a) => a.id !== id);
      saveStoredAttachmentsForRecord(prev.id, prev.preCostId, nextAtts);
      const updated = { ...prev, attachments: nextAtts };
      try {
        const currentStored = localStorage.getItem("cripton_buyer_quotations_master_v1");
        const list: PreCostingRecord[] = currentStored ? JSON.parse(currentStored) : [];
        const idx = list.findIndex((x) => x.id === updated.id || x.preCostId === updated.preCostId);
        if (idx >= 0) {
          list[idx] = updated;
          safeSaveMasterRecords(list);
        }
      } catch (e) {}

      setRecords((recList) => {
        const idx = recList.findIndex((r) => r.id === updated.id || r.preCostId === updated.preCostId);
        if (idx >= 0) {
          const copy = [...recList];
          copy[idx] = updated;
          return copy;
        }
        return recList;
      });

      return updated;
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

  // Direct image file picker handler for Section 5 (Style & Pre Costing Images)
  const handleImageFilesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formMode === "view") return;
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    e.target.value = "";

    const compressPromises = fileList.map(async (file) => {
      try {
        const compressed = await compressImageFile(file, 1024, 1024, 0.72);
        if (!compressed.dataUrl) {
          toast.error(`Could not process image "${file.name}".`);
          return null;
        }
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
        const newRecord: MMPreCostAttachmentRecord = {
          id: `att-img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          preCostId: formData.preCostId || "JOB-2026-0001",
          version: formData.version || 1,
          fileName: file.name,
          title: nameWithoutExt,
          note: "Style Quotation Image",
          fileSize: compressed.sizeFormatted,
          fileSizeBytes: compressed.sizeBytes,
          uploadedBy: formData.merchandiser || getLoggedInUserMerchant(),
          uploadTime: new Date().toISOString().replace("T", " ").substring(0, 16),
          storageType: "image",
          dataUrl: compressed.dataUrl,
        };
        return newRecord;
      } catch (err) {
        toast.error(`Failed to process image "${file.name}".`);
        return null;
      }
    });

    const results = await Promise.all(compressPromises);
    const validNewAtts = results.filter((a): a is MMPreCostAttachmentRecord => a !== null && Boolean(a.dataUrl));
    if (validNewAtts.length === 0) return;

    setFormData((prev) => {
      const nextAtts = [...validNewAtts, ...(prev.attachments || [])];
      const saveRes = saveStoredAttachmentsForRecord(prev.id, prev.preCostId, nextAtts);
      if (!saveRes.success && saveRes.error) {
        toast.error(saveRes.error);
      } else {
        toast.success(`${validNewAtts.length} image(s) attached and saved to Local Storage.`);
      }

      const updated = { ...prev, attachments: nextAtts };
      try {
        const currentStored = localStorage.getItem("cripton_buyer_quotations_master_v1");
        const list: PreCostingRecord[] = currentStored ? JSON.parse(currentStored) : [];
        const idx = list.findIndex((x) => x.id === updated.id || x.preCostId === updated.preCostId);
        if (idx >= 0) {
          list[idx] = updated;
        } else {
          list.unshift(updated);
        }
        safeSaveMasterRecords(list);
        localStorage.setItem("cripton_buyer_quotations_active_id_v1", updated.id);
      } catch (err) {
        console.error("Failed to persist images to localStorage:", err);
      }

      setRecords((recList) => {
        const idx = recList.findIndex((r) => r.id === updated.id || r.preCostId === updated.preCostId);
        if (idx >= 0) {
          const copy = [...recList];
          copy[idx] = updated;
          return copy;
        }
        return [updated, ...recList];
      });

      return updated;
    });
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
    if (formData.efficiencyPct < 1 || formData.efficiencyPct > 100) {
      toast.error("Efficiency (%) must be between 1% and 100%.");
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

    const attachmentsToSave =
      Array.isArray(formData.attachments) && formData.attachments.length > 0
        ? formData.attachments
        : getStoredAttachmentsForRecord(formData.id, formData.preCostId);

    const currentSnapshot = createVersionSnapshot({
      ...formData,
      attachments: attachmentsToSave,
      status: "Draft",
    });

    const updatedRecord: PreCostingRecord = {
      ...formData,
      attachments: attachmentsToSave,
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

    setFormData(updatedRecord);

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
    const saveAttsResult = saveStoredAttachmentsForRecord(updatedRecord.id, updatedRecord.preCostId, attachmentsToSave);
    if (!saveAttsResult.success && saveAttsResult.error) {
      toast.warning(saveAttsResult.error);
    }

    try {
      const currentStored = localStorage.getItem("cripton_buyer_quotations_master_v1");
      const list: PreCostingRecord[] = currentStored ? JSON.parse(currentStored) : [];
      const idx = list.findIndex((r) => r.id === updatedRecord.id);
      if (idx >= 0) {
        list[idx] = updatedRecord;
      } else {
        list.unshift(updatedRecord);
      }
      const masterSaveRes = safeSaveMasterRecords(list);
      if (!masterSaveRes.success && masterSaveRes.error) {
        toast.error(masterSaveRes.error);
      }
      localStorage.setItem("cripton_buyer_quotations_active_id_v1", updatedRecord.id);

      // Synchronize yarn booking tags with latest pre-costing data
      if (Array.isArray(updatedRecord.knitFabricItems)) {
        const activeYarnRowIds = new Set<string>();
        updatedRecord.knitFabricItems.forEach((kfi) => {
          if (Array.isArray(kfi.yarnDetails)) {
            kfi.yarnDetails.forEach((yd) => {
              if (yd.bookingTag && (yd.bookingTag.blockBookingNo || yd.bookingTag.blockBookingId)) {
                const yRowId = yd.id || yd.bookingTag.yarnRowId;
                activeYarnRowIds.add(yRowId);
                const tagId = yd.bookingTag.id || `ytag-${updatedRecord.preCostId || updatedRecord.id}-${yRowId}`;
                MMRepository.saveYarnBookingTag({
                  ...yd.bookingTag,
                  id: tagId,
                  yarnRowId: yRowId,
                  preCostId: updatedRecord.preCostId || updatedRecord.id,
                  preCostMasterId: updatedRecord.id,
                  buyer: updatedRecord.buyer || yd.bookingTag.buyer,
                  season: updatedRecord.season || yd.bookingTag.season,
                  job: updatedRecord.preCostId || updatedRecord.ourRef || updatedRecord.id,
                  yarnCount: yd.yarnCount || yd.bookingTag.yarnCount,
                  price: Number(yd.ratePerKg) !== undefined ? Number(yd.ratePerKg) : yd.bookingTag.price || 0,
                  tagQtyKg: Number(yd.finalQtyKg) || Number(yd.bookingTag.tagQtyKg) || 0,
                });
              }
            });
          }
        });

        // Clean up any removed tags for this preCosting
        const allTags = MMRepository.getYarnBookingTags();
        const thisPcTags = allTags.filter(
          (t) => t.preCostId === (updatedRecord.preCostId || updatedRecord.id) || t.preCostMasterId === updatedRecord.id
        );
        thisPcTags.forEach((t) => {
          if (!activeYarnRowIds.has(t.yarnRowId)) {
            MMRepository.removeYarnBookingTag(t.yarnRowId, updatedRecord.preCostId || updatedRecord.id);
          }
        });
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("storage"));
      }
    } catch (e) {
      console.error("Failed to save draft to localStorage:", e);
    }

    toast.success(`Buyer Quotation ${updatedRecord.quotationNo || updatedRecord.preCostId} saved as Draft.`);
    setView("list");
    onTabChange?.("register");
  };

  // 2. Submit for Approval
  const handleSubmitForApproval = (recordToSubmit?: PreCostingRecord) => {
    const target = recordToSubmit || formData;
    if (!recordToSubmit && !validateForm()) return;

    const attachmentsToSave =
      Array.isArray(target.attachments) && target.attachments.length > 0
        ? target.attachments
        : getStoredAttachmentsForRecord(target.id, target.preCostId);

    const currentSnapshot = createVersionSnapshot({
      ...target,
      attachments: attachmentsToSave,
      status: "Pending Approval",
      submittedBy: "Tanvir Ahmed (Merchandiser)",
      submittedDate: new Date().toISOString().replace("T", " ").substring(0, 16),
    });

    const updatedRecord: PreCostingRecord = {
      ...target,
      attachments: attachmentsToSave,
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
    const saveAttsResult = saveStoredAttachmentsForRecord(updatedRecord.id, updatedRecord.preCostId, attachmentsToSave);
    if (!saveAttsResult.success && saveAttsResult.error) {
      toast.warning(saveAttsResult.error);
    }

    try {
      const currentStored = localStorage.getItem("cripton_buyer_quotations_master_v1");
      const list: PreCostingRecord[] = currentStored ? JSON.parse(currentStored) : [];
      const idx = list.findIndex((r) => r.id === updatedRecord.id);
      if (idx >= 0) {
        list[idx] = updatedRecord;
      } else {
        list.unshift(updatedRecord);
      }
      const masterSaveRes = safeSaveMasterRecords(list);
      if (!masterSaveRes.success && masterSaveRes.error) {
        toast.error(masterSaveRes.error);
      }
      localStorage.setItem("cripton_buyer_quotations_active_id_v1", updatedRecord.id);

      // Synchronize yarn booking tags with latest pre-costing data
      if (Array.isArray(updatedRecord.knitFabricItems)) {
        const activeYarnRowIds = new Set<string>();
        updatedRecord.knitFabricItems.forEach((kfi) => {
          if (Array.isArray(kfi.yarnDetails)) {
            kfi.yarnDetails.forEach((yd) => {
              if (yd.bookingTag && (yd.bookingTag.blockBookingNo || yd.bookingTag.blockBookingId)) {
                const yRowId = yd.id || yd.bookingTag.yarnRowId;
                activeYarnRowIds.add(yRowId);
                const tagId = yd.bookingTag.id || `ytag-${updatedRecord.preCostId || updatedRecord.id}-${yRowId}`;
                MMRepository.saveYarnBookingTag({
                  ...yd.bookingTag,
                  id: tagId,
                  yarnRowId: yRowId,
                  preCostId: updatedRecord.preCostId || updatedRecord.id,
                  preCostMasterId: updatedRecord.id,
                  buyer: updatedRecord.buyer || yd.bookingTag.buyer,
                  season: updatedRecord.season || yd.bookingTag.season,
                  job: updatedRecord.preCostId || updatedRecord.ourRef || updatedRecord.id,
                  yarnCount: yd.yarnCount || yd.bookingTag.yarnCount,
                  price: Number(yd.ratePerKg) !== undefined ? Number(yd.ratePerKg) : yd.bookingTag.price || 0,
                  tagQtyKg: Number(yd.finalQtyKg) || Number(yd.bookingTag.tagQtyKg) || 0,
                });
              }
            });
          }
        });

        // Clean up any removed tags for this preCosting
        const allTags = MMRepository.getYarnBookingTags();
        const thisPcTags = allTags.filter(
          (t) => t.preCostId === (updatedRecord.preCostId || updatedRecord.id) || t.preCostMasterId === updatedRecord.id
        );
        thisPcTags.forEach((t) => {
          if (!activeYarnRowIds.has(t.yarnRowId)) {
            MMRepository.removeYarnBookingTag(t.yarnRowId, updatedRecord.preCostId || updatedRecord.id);
          }
        });
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("storage"));
      }
    } catch (e) {
      console.error("Failed to submit to localStorage:", e);
    }

    toast.success(`Buyer Quotation ${updatedRecord.quotationNo || updatedRecord.preCostId} v${updatedRecord.version} submitted for approval.`);
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
    toast.success(`Buyer Quotation ${rec.quotationNo || rec.preCostId} v${rec.version} approved successfully.`);
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
    toast.error(`Buyer Quotation ${targetRejectRecord.quotationNo || targetRejectRecord.preCostId} was rejected.`);
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
      localStorage.setItem("cripton_buyer_quotations_active_id_v1", amendedRecord.id);
    } catch {}
    onTabChange?.("create", amendedRecord.id);
    toast.success(`Amendment Version v${newVersionNumber} initiated! Modify fields and submit for approval.`);
  };

  // Open Edit for Draft
  const handleOpenEdit = (rec: PreCostingRecord) => {
    const atts =
      Array.isArray(rec.attachments) && rec.attachments.length > 0 && rec.attachments.some((a) => Boolean(a.dataUrl))
        ? rec.attachments
        : getStoredAttachmentsForRecord(rec.id, rec.preCostId);
    const poVal = (rec.poRows || []).reduce((acc, r) => acc + (Number(r.value) || 0), 0);
    const structured = ensureKnitCostingStructure({ ...rec, attachments: atts }, poVal);
    setFormData({ ...structured, attachments: atts });
    setFormMode("edit");
    setView("form");
    try {
      localStorage.setItem("cripton_buyer_quotations_active_id_v1", rec.id);
    } catch {}
    onTabChange?.("create", rec.id);
  };

  // Open Read-Only View -> Opens Complete Pre-Cost Sheet Report per specification
  const handleOpenView = (rec: PreCostingRecord) => {
    const atts =
      Array.isArray(rec.attachments) && rec.attachments.length > 0 && rec.attachments.some((a) => Boolean(a.dataUrl))
        ? rec.attachments
        : getStoredAttachmentsForRecord(rec.id, rec.preCostId);
    const poVal = (rec.poRows || []).reduce((acc, r) => acc + (Number(r.value) || 0), 0);
    const structured = ensureKnitCostingStructure({ ...rec, attachments: atts }, poVal);
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
                    Buyer Quotation Register
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
                      localStorage.setItem("cripton_buyer_quotations_active_id_v1", newRec.id);
                    } catch {}
                    onTabChange?.("create", newRec.id);
                  }}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-xs cursor-pointer transition"
                >
                  <Plus className="size-3.5" /> New Buyer Quotation
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
                      <th className="py-3 px-3 text-right">Quotation Value ($)</th>
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
                          <p className="font-bold text-sm">No Buyer Quotation records found</p>
                          <p className="text-xs text-slate-400 mt-1">
                            Adjust your filters or create a new buyer quotation.
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
                  onClick={() => {
                    setView("list");
                    onTabChange?.("register");
                  }}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                  title="Back to Register"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <div>
                  <h1 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    {formMode === "create"
                      ? "Create New Buyer Quotation"
                      : formMode === "edit"
                      ? "Edit Buyer Quotation"
                      : "Buyer Quotation Details"}
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800">
                      v{formData.version} — {formData.status}
                    </span>
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Quotation No: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{formData.quotationNo || formData.preCostNo}</span> &bull; {formData.buyer || "Buyer Quotation Form"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 ml-2">
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
                    <Printer className="size-3.5" /> Print Buyer Quotation Sheet
                  </button>
                )}
              </div>
            </div>

            {/* SECTION 1: Buyer Quotation Identification & Order Basis */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="w-1.5 h-4 bg-indigo-600 rounded-full inline-block" />
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Buyer Quotation Identification & Order Basis
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3.5 text-xs">
                {/* 1. Job ID * (Automatically generated unique Job ID) */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Job ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.preCostId}
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 font-mono font-bold text-slate-600 dark:text-slate-400"
                  />
                </div>

                {/* 2. Quotation No. */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Quotation No. <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.quotationNo || formData.preCostNo}
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 font-mono font-bold text-slate-600 dark:text-slate-400"
                  />
                </div>

                {/* 3. GMT Item (Searchable dropdown) */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    GMT Item <span className="text-rose-500">*</span>
                  </label>
                  <SearchableSelect
                    options={gmtItemSelectOptions}
                    value={formData.gmtItem || "Basic T-Shirt"}
                    onChange={(val) => setFormData((prev) => ({ ...prev, gmtItem: val }))}
                    placeholder="Select GMT Item..."
                    disabled={formMode === "view"}
                  />
                </div>

                {/* 4. Category (Searchable dropdown) */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <SearchableSelect
                    options={categorySelectOptions}
                    value={formData.category || "Men"}
                    onChange={(val) => setFormData((prev) => ({ ...prev, category: val }))}
                    placeholder="Select Category..."
                    disabled={formMode === "view"}
                  />
                </div>

                {/* 5. Quotation Date */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Quotation Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    disabled={formMode === "view"}
                    value={formData.preCostDate}
                    onChange={(e) => setFormData({ ...formData, preCostDate: e.target.value })}
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                {/* 6. A/C Holder (Auto-populated from Buyer) */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    A/C Holder
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.acHolder}
                    placeholder="Auto-linked to Buyer"
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 font-semibold text-slate-600 dark:text-slate-400"
                  />
                </div>

                {/* 7. Buyer */}
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

                {/* 8. Merchandiser (Required dropdown) */}
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

                {/* 9. Style No. (Searchable dropdown, filtered by Buyer) */}
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

                {/* 10. Season (Searchable dropdown from Season master) */}
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

                {/* 11. Total Order QTY (Editable) */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Total Order QTY <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    disabled={formMode === "view"}
                    value={formData.totalOrderQty ?? consolidatedOrderQty}
                    onChange={(e) => handleOrderQtyChange(Number(e.target.value) || 0)}
                    placeholder="e.g. 20000"
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400"
                  />
                </div>

                {/* 12. Rate ($/pc) * (Editable, immediately to the right of Total Order QTY) */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Rate ($/pc) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.0001"
                    disabled={formMode === "view"}
                    value={formData.ratePerPc ?? averagePoRate}
                    onChange={(e) => handleRatePerPcChange(Number(e.target.value) || 0)}
                    placeholder="e.g. 4.25"
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400"
                  />
                </div>

                {/* 13. Total Order Value (Automatically calculated: Total Order QTY × Rate ($/pc)) */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Total Order Value
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`$${totalPoValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 font-mono font-bold text-indigo-600 dark:text-indigo-400 text-right"
                  />
                </div>

                {/* 14. SMV (Standard Minute Value) */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    SMV (Standard Minute Value)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    disabled={formMode === "view"}
                    value={formData.smv}
                    onChange={(e) => {
                      const smv = Number(e.target.value) || 0;
                      const eff = formData.efficiencyPct || 65;
                      const cpm = formData.cpm || 0.065;
                      const autoCm = eff > 0 ? Number((((cpm * smv) / (eff / 100)) * 12).toFixed(2)) : 0;
                      setFormData({ ...formData, smv, cmDz: autoCm });
                    }}
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono font-bold"
                  />
                </div>

                {/* 15. Efficiency (%) */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Efficiency (%) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    disabled={formMode === "view"}
                    value={formData.efficiencyPct || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "") {
                        setFormData((prev) => ({ ...prev, efficiencyPct: 0 }));
                        return;
                      }
                      const num = Number(val);
                      if (num > 100) return;
                      if (num < 0) return;
                      const cpm = formData.cpm || 0.065;
                      const smv = formData.smv || 0;
                      const autoCm = num > 0 ? Number((((cpm * smv) / (num / 100)) * 12).toFixed(2)) : 0;
                      setFormData((prev) => ({
                        ...prev,
                        efficiencyPct: num,
                        cmDz: autoCm,
                      }));
                    }}
                    onBlur={() => {
                      if (formData.efficiencyPct < 1) {
                        setFormData((prev) => ({ ...prev, efficiencyPct: 1 }));
                      }
                    }}
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono font-bold"
                    placeholder="1 - 100"
                  />
                </div>

                {/* 16. CM (DZ) */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    CM (DZ)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    disabled={formMode === "view"}
                    value={
                      formData.cmDz !== undefined
                        ? formData.cmDz
                        : smvCost * 12 > 0
                        ? Number((smvCost * 12).toFixed(2))
                        : 0
                    }
                    onChange={(e) => setFormData({ ...formData, cmDz: Number(e.target.value) || 0 })}
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400"
                    placeholder="0.00"
                  />
                </div>

                {/* 17. Note / Instructions (Spans 2 cols to fill exactly 6 cols on row 3) */}
                <div className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Note / Instructions
                  </label>
                  <input
                    type="text"
                    disabled={formMode === "view"}
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="Costing remarks, wash instructions, or buyer nominations..."
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: Item-wise Pre Costing Details (Fabric Cost, Accessories Cost, Others Cost) */}
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
                      onClick={() => setActiveCostingTab("embellishment")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeCostingTab === "embellishment"
                          ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <Palette className="size-3.5" />
                      <span>Embellishment</span>
                      <span className="ml-1 px-1.5 py-0.5 bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 rounded text-[10px] font-mono font-bold">
                        ${totalEmbellishmentCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                    {activeCostingTab === "embellishment" && (
                      <button
                        type="button"
                        onClick={handleAddEmbellishmentRow}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 font-bold text-xs border border-purple-200 dark:border-purple-800 hover:bg-purple-100 cursor-pointer"
                      >
                        <Plus className="size-3.5" /> Add Embellishment Item
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
                    <table className="w-full text-xs text-left whitespace-nowrap min-w-[1500px]">
                      <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[9.5px] uppercase font-black text-slate-500">
                        <tr>
                          <th className="py-2.5 px-2 text-center w-8">Sl.</th>
                          <th className="py-2.5 px-2 w-44 min-w-[175px]">Head *</th>
                          <th className="py-2.5 px-2.5 w-64 min-w-[250px]">Item Name *</th>
                          <th className="py-2.5 px-2 w-32 min-w-[120px]">UoM</th>
                          <th className="py-2.5 px-2 text-center w-28 bg-amber-50/50 dark:bg-amber-950/20">Yarn *</th>
                          <th className="py-2.5 px-2 text-right w-24">Effected Qty (pcs) *</th>
                          <th className="py-2.5 px-2 text-right w-24">Consumption (kg/{(formData.consumptionUnit || "DZ").toLowerCase()}) *</th>
                          <th className="py-2.5 px-2 text-right w-24">Estimated Finish Qty</th>
                          <th className="py-2.5 px-2 text-right w-20">RMG Loss (%)</th>
                          <th className="py-2.5 px-2 text-right w-28">Req. Finished (Cuttable)</th>
                          <th className="py-2.5 px-2 w-40 min-w-[150px]">Fabric Source *</th>
                          <th className="py-2.5 px-2 w-32 min-w-[120px]">Color Type *</th>
                          <th className="py-2.5 px-2 text-center w-20">Details</th>
                          <th className="py-2.5 px-2.5 text-right w-28 bg-indigo-50/40 dark:bg-indigo-950/20 font-black text-indigo-700 dark:text-indigo-300">Total Amount ($)</th>
                          {formMode !== "view" && <th className="py-2.5 px-2 text-center w-12">Action</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {(formData.knitFabricItems || []).length === 0 ? (
                          <tr>
                            <td colSpan={formMode !== "view" ? 15 : 14} className="py-8 text-center text-slate-400">
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

                                {/* 3b. UoM (KG / YDS) */}
                                <td className="py-2 px-2 w-32 min-w-[120px]">
                                  <select
                                    disabled={formMode === "view"}
                                    value={row.uom || "KG"}
                                    onChange={(e) => handleUpdateFabricItem(idx, "uom", e.target.value)}
                                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
                                  >
                                    <option value="KG">KG</option>
                                    <option value="YDS">YDS</option>
                                  </select>
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

                                {/* Fabric Source (Searchable dropdown) */}
                                <td className="py-2 px-2 w-40 min-w-[150px]">
                                  <SearchableSelect
                                    options={getFabricSourceOptions(row.fabricSource)}
                                    value={row.fabricSource || "Production"}
                                    onChange={(val) => handleUpdateFabricItem(idx, "fabricSource", val)}
                                    placeholder="Select Source..."
                                    disabled={formMode === "view"}
                                    className="text-xs h-8 px-2 font-semibold"
                                  />
                                </td>

                                {/* Color Type (Searchable dropdown) */}
                                <td className="py-2 px-2 w-32 min-w-[120px]">
                                  <SearchableSelect
                                    options={getColorTypeOptions(row.colorType)}
                                    value={row.colorType || "Solid"}
                                    onChange={(val) => handleUpdateFabricItem(idx, "colorType", val)}
                                    placeholder="Select Color..."
                                    disabled={formMode === "view"}
                                    className="text-xs h-8 px-2 font-semibold"
                                  />
                                </td>

                                {/* Details (D Button) */}
                                <td className="py-2 px-2 text-center w-20">
                                  {(() => {
                                    const source = row.fabricSource || "Production";
                                    const cType = row.colorType || "Solid";
                                    const isDetailsDisabled =
                                      (source === "Finish Purchase" && cType === "N/A") ||
                                      cType === "N/A" ||
                                      source === "Finish Purchase";
                                    return (
                                      <button
                                        type="button"
                                        disabled={isDetailsDisabled}
                                        onClick={() => handleOpenFabricDetailsModal(idx)}
                                        className={`size-7 rounded-lg font-black text-xs inline-flex items-center justify-center transition-all shadow-xs ${
                                          isDetailsDisabled
                                            ? "bg-slate-100 text-slate-300 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed border border-slate-200 dark:border-slate-700"
                                            : "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer ring-2 ring-indigo-200 dark:ring-indigo-900 active:scale-95"
                                        }`}
                                        title={
                                          isDetailsDisabled
                                            ? "Process Details disabled for Finish Purchase / N/A"
                                            : "Open Fabric Process & Costing Details (D)"
                                        }
                                      >
                                        D
                                      </button>
                                    );
                                  })()}
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
                          <td colSpan={5} className="py-3 px-3 uppercase text-[10px] tracking-wider text-right">
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
                          <td />
                          <td />
                          <td />
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
                          <th className="py-2.5 px-2 w-36 min-w-[140px]">UoM *</th>
                          <th className="py-2.5 px-2 w-44">Description</th>
                          <th className="py-2.5 px-2 w-32">N. Status *</th>
                          <th className="py-2.5 px-2.5 w-52">Supplier *</th>
                          <th className="py-2.5 px-2 text-right w-32">Effected Qty *</th>
                          <th className="py-2.5 px-2 text-right w-20">Consump.</th>
                          <th className="py-2.5 px-2 text-right w-24">Wastage (%)</th>
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
                            <td colSpan={formMode !== "view" ? 15 : 14} className="py-8 text-center text-slate-400">
                              No accessories items entered. Click "+ Add Accessory Item" to add sewing thread, buttons, zippers, trims, etc.
                            </td>
                          </tr>
                        ) : (
                          (formData.accessoriesItems || []).map((item, idx) => {
                            const isEffQtyInvalid = consolidatedOrderQty > 0 && (Number(item.effectedQty) || 0) > consolidatedOrderQty;
                            const isFinishingHead = item.head === "Finishing Trims" || (typeof item.head === "string" && item.head.toLowerCase().includes("finish"));
                            const targetList = isFinishingHead ? FINISHING_TRIMS_ITEMS : SEWING_TRIMS_ITEMS;
                            const itemOptions = targetList.map((name) => ({
                              value: name,
                              label: name,
                            }));
                            if (item.item && !targetList.includes(item.item as any)) {
                              itemOptions.unshift({ value: item.item, label: item.item });
                            }
                            const rowSupplierOptions = getSupplierOptions(item.supplier);

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

                                {/* 3b. UoM */}
                                <td className="py-2 px-2 w-36 min-w-[140px]">
                                  <select
                                    disabled={formMode === "view"}
                                    value={item.unit || "Pcs"}
                                    onChange={(e) => handleUpdateAccessoryRow(idx, "unit", e.target.value)}
                                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                                  >
                                    {ACCESSORY_UOM_OPTIONS.map((u) => (
                                      <option key={u} value={u}>
                                        {u}
                                      </option>
                                    ))}
                                  </select>
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
                                    options={rowSupplierOptions}
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

                                {/* 8b. Wastage (%) */}
                                <td className="py-2 px-2">
                                  <input
                                    type="number"
                                    step="0.1"
                                    disabled={formMode === "view"}
                                    value={item.wastagePct ?? 5}
                                    onChange={(e) => handleUpdateAccessoryRow(idx, "wastagePct", Number(e.target.value) || 0)}
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
                          <td colSpan={13} className="py-3 px-3 text-right uppercase text-[10px] tracking-wider">
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
                  TAB 3: EMBELLISHMENT COST (NEW)
                 ───────────────────────────────────────────────────────────── */}
              {activeCostingTab === "embellishment" && (
                <div className="space-y-4">
                  <div className="overflow-x-auto pb-2">
                    <table className="w-full text-xs text-left whitespace-nowrap min-w-[1000px]">
                      <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[9.5px] uppercase font-black text-slate-500">
                        <tr>
                          <th className="py-2.5 px-2 text-center w-8">SL.</th>
                          <th className="py-2.5 px-3 w-52">Cost Head *</th>
                          <th className="py-2.5 px-3 w-72">Description</th>
                          <th className="py-2.5 px-3 w-36">Source</th>
                          <th className="py-2.5 px-2.5 text-right w-28 min-w-[100px]">GMT Qty</th>
                          <th className="py-2.5 px-2.5 text-right w-28 min-w-[100px]">QTY in DZ</th>
                          <th className="py-2.5 px-2.5 text-right w-32 min-w-[110px]">Unit Rate (DZ) *</th>
                          <th className="py-2.5 px-3 text-right w-36">Amount ($)</th>
                          {formMode !== "view" && <th className="py-2.5 px-2 text-center w-12">Action</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {(formData.embellishmentItems || []).length === 0 ? (
                          <tr>
                            <td colSpan={formMode !== "view" ? 9 : 8} className="py-8 text-center text-slate-400">
                              No embellishment entries added. Click "+ Add Embellishment Item" to add printing, embroidery, or garment wash.
                            </td>
                          </tr>
                        ) : (
                          (formData.embellishmentItems || []).map((row, idx) => (
                            <tr key={row.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                              {/* 1. SL */}
                              <td className="py-2 px-2 text-center font-mono font-bold text-slate-400">
                                {idx + 1}
                              </td>

                              {/* 2. Cost Head (Searchable Dropdown) */}
                              <td className="py-2 px-3 w-52">
                                <SearchableSelect
                                  options={EMBELLISHMENT_COST_HEADS.map((h) => ({ value: h, label: h }))}
                                  value={row.costHead}
                                  onChange={(val) => handleUpdateEmbellishmentRow(idx, "costHead", val)}
                                  placeholder="Select Cost Head..."
                                  disabled={formMode === "view"}
                                  className="text-xs h-8 px-2"
                                />
                              </td>

                              {/* 3. Description (Manual text entry) */}
                              <td className="py-2 px-3">
                                <input
                                  type="text"
                                  disabled={formMode === "view"}
                                  value={row.description}
                                  onChange={(e) => handleUpdateEmbellishmentRow(idx, "description", e.target.value)}
                                  placeholder="e.g. Chest placement print or enzyme wash..."
                                  className="w-full h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                                />
                              </td>

                              {/* 4. Source (Dropdown: In-house / Sub-Contract) */}
                              <td className="py-2 px-3 w-36">
                                <select
                                  disabled={formMode === "view"}
                                  value={row.source}
                                  onChange={(e) => handleUpdateEmbellishmentRow(idx, "source", e.target.value)}
                                  className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                                >
                                  {EMBELLISHMENT_SOURCES.map((s) => (
                                    <option key={s} value={s}>
                                      {s}
                                    </option>
                                  ))}
                                </select>
                              </td>

                              {/* 5. GMT Qty (Quantity entry) */}
                              <td className="py-2 px-2.5 w-28 min-w-[100px]">
                                <input
                                  type="number"
                                  disabled={formMode === "view"}
                                  value={row.gmtQty ?? (consolidatedOrderQty || 20000)}
                                  onChange={(e) => handleUpdateEmbellishmentRow(idx, "gmtQty", Number(e.target.value) || 0)}
                                  className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono font-bold text-xs"
                                  placeholder="0"
                                />
                              </td>

                              {/* 6. QTY in DZ (Automatically calculated: GMT Qty ÷ 12) */}
                              <td className="py-2 px-2.5 text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                                {(row.qtyInDz ?? Number(((row.gmtQty ?? (consolidatedOrderQty || 20000)) / 12).toFixed(2))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>

                              {/* 7. Unit Rate (DZ) * (Rate per dozen) */}
                              <td className="py-2 px-2.5 w-32 min-w-[110px]">
                                <input
                                  type="number"
                                  step="0.001"
                                  disabled={formMode === "view"}
                                  value={row.unitRateDz ?? 0}
                                  onChange={(e) => handleUpdateEmbellishmentRow(idx, "unitRateDz", Number(e.target.value) || 0)}
                                  className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono font-bold text-xs"
                                  placeholder="0.00"
                                />
                              </td>

                              {/* 8. Amount ($) (Automatically calculated) */}
                              <td className="py-2 px-3 text-right font-mono font-bold text-purple-700 dark:text-purple-300">
                                ${Number(row.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>

                              {/* Action */}
                              {formMode !== "view" && (
                                <td className="py-2 px-2 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveEmbellishmentRow(idx)}
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
                          <td colSpan={7} className="py-3 px-3 text-right uppercase text-[10px] tracking-wider">
                            Total Embellishment Cost:
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-purple-700 dark:text-purple-300 text-sm">
                            ${totalEmbellishmentCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          {formMode !== "view" && <td />}
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  TAB 4: OTHERS COST (PRESERVED FUNCTIONALITY & COLUMNS)
                 ───────────────────────────────────────────────────────────── */}
              {activeCostingTab === "others" && (() => {
                const otherItems = formData.otherCostItems || [];
                const allPercentage =
                  otherItems.length > 0 &&
                  otherItems.every(
                    (r) => r.costHead === "Commercial Cost" || r.costHead === "Commission"
                  );

                return (
                  <div className="space-y-4">
                    <div className="overflow-x-auto pb-2">
                      <table className="w-full text-xs text-left whitespace-nowrap min-w-[1000px]">
                        <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[9.5px] uppercase font-black text-slate-500">
                          {allPercentage ? (
                            <tr>
                              <th className="py-2.5 px-2 text-center w-8">SL</th>
                              <th className="py-2.5 px-3 w-56">Cost Head *</th>
                              <th className="py-2.5 px-3 min-w-[280px]">Description</th>
                              <th className="py-2.5 px-3 text-right w-48">Cost (%) *</th>
                              <th className="py-2.5 px-3 text-right w-36">Amount ($)</th>
                              {formMode !== "view" && <th className="py-2.5 px-2 text-center w-12">Action</th>}
                            </tr>
                          ) : (
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
                          )}
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {otherItems.length === 0 ? (
                            <tr>
                              <td
                                colSpan={formMode !== "view" ? (allPercentage ? 6 : 8) : (allPercentage ? 5 : 7)}
                                className="py-8 text-center text-slate-400"
                              >
                                No other costing heads entered. Click "+ Add Other Cost Head" to add freight, testing, banking, commission, etc.
                              </td>
                            </tr>
                          ) : (
                            otherItems.map((row, idx) => {
                              const isPercentage =
                                row.costHead === "Commercial Cost" || row.costHead === "Commission";

                              return (
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

                                  {/* When Cost Head is Commercial Cost or Commission */}
                                  {isPercentage ? (
                                    allPercentage ? (
                                      <td className="py-2 px-3 text-right">
                                        <div className="relative w-36 ml-auto">
                                          <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="100"
                                            disabled={formMode === "view"}
                                            value={row.costPercent ?? row.rateOrPct ?? 0}
                                            onChange={(e) =>
                                              handleUpdateOtherCostRow(idx, "costPercent", Number(e.target.value) || 0)
                                            }
                                            className="w-full h-8 pl-3 pr-7 rounded-lg border border-amber-300 dark:border-amber-600 bg-amber-50/40 dark:bg-amber-950/20 text-right font-mono font-bold text-xs focus:ring-1 focus:ring-amber-500"
                                            placeholder="0.00"
                                          />
                                          <span className="absolute right-2.5 top-2 text-xs font-bold text-slate-400">%</span>
                                        </div>
                                      </td>
                                    ) : (
                                      /* Mixed table: Hide GMT Qty, QTY in DZ, Unit Rate (DZ)* and display Cost (%)* column instead spanning the 3 columns */
                                      <td colSpan={3} className="py-2 px-3 text-right">
                                        <div className="flex items-center justify-end gap-2.5">
                                          <span className="text-[10.5px] uppercase font-bold text-amber-700 dark:text-amber-400">
                                            Cost (%) *:
                                          </span>
                                          <div className="relative w-36">
                                            <input
                                              type="number"
                                              step="0.01"
                                              min="0"
                                              max="100"
                                              disabled={formMode === "view"}
                                              value={row.costPercent ?? row.rateOrPct ?? 0}
                                              onChange={(e) =>
                                                handleUpdateOtherCostRow(idx, "costPercent", Number(e.target.value) || 0)
                                              }
                                              className="w-full h-8 pl-3 pr-7 rounded-lg border border-amber-300 dark:border-amber-600 bg-amber-50/40 dark:bg-amber-950/20 text-right font-mono font-bold text-xs focus:ring-1 focus:ring-amber-500"
                                              placeholder="0.00"
                                            />
                                            <span className="absolute right-2.5 top-2 text-xs font-bold text-slate-400">%</span>
                                          </div>
                                          <span className="text-[10px] text-slate-400 font-normal hidden xl:inline">
                                            (of ${totalPoValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                                          </span>
                                        </div>
                                      </td>
                                    )
                                  ) : (
                                    /* For all other Cost Head options, keep existing columns and behavior */
                                    <>
                                      {/* 4. GMT Qty (Editable) */}
                                      <td className="py-2 px-2.5 w-28 min-w-[100px]">
                                        <input
                                          type="number"
                                          disabled={formMode === "view"}
                                          value={row.gmtQty ?? (consolidatedOrderQty || 20000)}
                                          onChange={(e) => handleUpdateOtherCostRow(idx, "gmtQty", Number(e.target.value) || 0)}
                                          className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono font-bold text-xs"
                                          placeholder="0"
                                        />
                                      </td>

                                      {/* 5. QTY in DZ (Automatically calculated: GMT Qty ÷ 12) */}
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
                                    </>
                                  )}

                                  {/* Amount ($) */}
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
                              );
                            })
                          )}
                        </tbody>
                        <tfoot>
                          <tr className="bg-slate-100 dark:bg-slate-800 font-black border-t border-slate-200 dark:border-slate-700">
                            <td colSpan={allPercentage ? 4 : 6} className="py-3 px-3 text-right uppercase text-[10px] tracking-wider">
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
                );
              })()}

              {/* ─────────────────────────────────────────────────────────────
                  CONSOLIDATED SECTION 3 BOTTOM SUMMARY CARD
                 ───────────────────────────────────────────────────────────── */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
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
                    <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 block">Total Embellishment</span>
                    <span className="text-base font-mono font-black text-slate-900 dark:text-white">
                      ${totalEmbellishmentCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {totalCost > 0 ? ((totalEmbellishmentCost / totalCost) * 100).toFixed(1) : 0}% of material & service cost
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
                    <span>Style & Quotation Images</span>
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
                    <Printer className="size-3.5" /> Print Buyer Quotation Sheet
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
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Quotation Value ($)</span>
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
          <BuyerQuotationReport
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
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
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

              {/* Modal Body: 3 fields per row */}
              <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
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

                {/* 4. Spinning Type (Searchable dropdown) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Spinning Type <span className="text-rose-500">*</span>
                  </label>
                  <SearchableSelect
                    options={getSpinningTypeOptions(tempFabricEntry.spinningType)}
                    value={tempFabricEntry.spinningType || "Ring"}
                    onChange={(val) => setTempFabricEntry((prev) => ({ ...prev, spinningType: val }))}
                    placeholder="Select Spinning Type..."
                    disabled={formMode === "view"}
                    className="h-9 text-xs"
                    allowCustom
                  />
                </div>

                {/* 5. Feeder Type (Dropdown: Half Feeder, Full Feeder) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Feeder Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    disabled={formMode === "view"}
                    value={tempFabricEntry.feederType ?? ""}
                    onChange={(e) => setTempFabricEntry((prev) => ({ ...prev, feederType: e.target.value }))}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  >
                    {KNIT_FEEDER_TYPES.map((ft) => (
                      <option key={ft} value={ft}>
                        {ft}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 6. Wash Type (Dropdown: Acid Wash, Stone Wash, Enzyme Wash, Panel Wash, Hydrophilic Softener Wash) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Wash Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    disabled={formMode === "view"}
                    value={tempFabricEntry.washType || "Hydrophilic Softener Wash"}
                    onChange={(e) => setTempFabricEntry((prev) => ({ ...prev, washType: e.target.value }))}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  >
                    {KNIT_WASH_TYPES.map((wt) => (
                      <option key={wt} value={wt}>
                        {wt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 7. Finish Type (Dropdown: Heatset Finish, Brush Finish, Peach Finish, Peach-Brush Finish, Shearing Finish, Moisture Wicking Finish, Teflon Finish) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Finish Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    disabled={formMode === "view"}
                    value={tempFabricEntry.finishType || "Heatset Finish"}
                    onChange={(e) => setTempFabricEntry((prev) => ({ ...prev, finishType: e.target.value }))}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  >
                    {KNIT_FINISH_TYPES.map((ft) => (
                      <option key={ft} value={ft}>
                        {ft}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 8. Other Specifications */}
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

                {/* 9. Fabric Category */}
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
            MODAL: FABRIC PROCESSING & COSTING DETAILS (D BUTTON)
           ════════════════════════════════════════════════════════════ */}
        {fabricDetailsModal.isOpen && fabricDetailsModal.tempRow && (() => {
          const tempRow = fabricDetailsModal.tempRow;
          const source = tempRow.fabricSource || "Production";
          const color = tempRow.colorType || "Solid";

          const isProd = source === "Production";
          const isGreyOrSuppliedOrStock = ["Grey Purchase", "Buyer Supplied", "Stock"].includes(source);

          let modalCase = "CASE_B";
          let caseBadge = "Production + Solid";
          if (isProd && color === "Y/D") {
            modalCase = "CASE_A";
            caseBadge = "Case A: Production + Y/D (Knitting, Yarn Dyeing, Finishing)";
          } else if (isProd && color === "AOP") {
            modalCase = "CASE_C";
            caseBadge = "Case C: Production + AOP (AOP, Dyeing, Knitting, Finishing)";
          } else if (isProd) {
            modalCase = "CASE_B";
            caseBadge = "Case B: Production + Solid (Dyeing, Knitting, Finishing)";
          } else if (isGreyOrSuppliedOrStock && color === "AOP") {
            modalCase = "CASE_E";
            caseBadge = "Case E: " + source + " + AOP (AOP, Dyeing, Finishing)";
          } else if (isGreyOrSuppliedOrStock && color === "Y/D") {
            modalCase = "CASE_A";
            caseBadge = source + " + Y/D (Yarn Dyeing, Finishing)";
          } else {
            modalCase = "CASE_D";
            caseBadge = "Case D: " + source + " + Solid (Dyeing, Finishing)";
          }

          const totalProcessCost = Number((
            (tempRow.knittingCost || 0) +
            (tempRow.dyeingCost || 0) +
            (tempRow.ydCost || 0) +
            (tempRow.aopCost || 0) +
            (tempRow.washingCost || 0) +
            (tempRow.finishingCost || 0)
          ).toFixed(2));

          // Retrieve active Fabric Master specifications and look up matching Master Data records
          const matchedSetup = fabricSetups.find(
            (s) => (tempRow.fabricSetupId && s.id === tempRow.fabricSetupId) || s.fabricName === tempRow.item
          );
          const currentFabricType = tempRow.fabricType || matchedSetup?.fabricType || formData.fabricEntry?.fabricType || "";
          const currentFabricColor = matchedSetup?.colorType || (tempRow.colorType === "Y/D" ? "Y/D" : "Solid");
          const currentFeeder = tempRow.feederType !== undefined
            ? tempRow.feederType
            : (matchedSetup?.feederType !== undefined
                ? matchedSetup.feederType
                : (formData.fabricEntry?.feederType || ""));

          const matchedKnit = findMatchingKnittingRate(
            masterKnittingRates,
            masterFabricTypes,
            currentFabricType,
            currentFabricColor,
            currentFeeder
          );

          const matchedDye = findMatchingDyeingRate(
            masterDyeingRates,
            tempRow.colorShade || "Medium",
            tempRow.dyeingMethod || "Reactive"
          );

          const matchedAop = findMatchingAopRate(
            masterAopRates,
            tempRow.aopType || "Reactive"
          );

          const renderKnittingCard = () => (
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                    <Activity className="size-3.5" />
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Knitting Process
                  </h4>
                  {matchedKnit ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      ✓ Master: {matchedKnit.code}
                    </span>
                  ) : null}
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                  Knitting Cost: ${Number(tempRow.knittingCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Knitting Process Loss (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    disabled={formMode === "view"}
                    value={tempRow.knittingProcessLossPct ?? 3}
                    onChange={(e) => handleUpdateFabricDetailsModalField("knittingProcessLossPct", Number(e.target.value) || 0)}
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-right"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Required Yarn (kg)
                  </label>
                  <div className="w-full h-8 px-2 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-xs font-mono font-bold text-amber-700 dark:text-amber-300 flex items-center justify-end select-all cursor-not-allowed" title="Calculated automatically per process loss formula">
                    {Number(tempRow.requiredYarnKg || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Knitting Rate ($/kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    disabled={formMode === "view"}
                    value={tempRow.knittingRate ?? 0.35}
                    onChange={(e) => handleUpdateFabricDetailsModalField("knittingRate", Number(e.target.value) || 0)}
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-right"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Knitting Cost ($)
                  </label>
                  <div className="w-full h-8 px-2 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center justify-end select-all cursor-not-allowed">
                    ${Number(tempRow.knittingCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {!matchedKnit && (
                <div className="mt-3 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <div>
                    <span className="font-bold">No Matching Record in Knitting Process Rate Master:</span>
                    <p className="mt-0.5 text-[11px] text-amber-700 dark:text-amber-400">
                      No configured rate found for Fabric Type: <strong>&quot;{currentFabricType || 'Single Jersey'}&quot;</strong>, Color: <strong>&quot;{currentFabricColor}&quot;</strong>, Feeder: <strong>&quot;{currentFeeder || 'Blank'}&quot;</strong>. Please configure it in Knitting Process Rate Master.
                    </p>
                  </div>
                </div>
              )}
            </div>
          );

          const renderDyeingCard = () => (
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                    <Droplets className="size-3.5" />
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Fabric Dyeing Process
                  </h4>
                  {matchedDye ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      ✓ Master: {matchedDye.code}
                    </span>
                  ) : null}
                </div>
                <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300">
                  Dyeing Cost: ${Number(tempRow.dyeingCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Color Shade
                  </label>
                  <select
                    disabled={formMode === "view"}
                    value={tempRow.colorShade || "Medium"}
                    onChange={(e) => handleUpdateFabricDetailsModalField("colorShade", e.target.value)}
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  >
                    {COLOR_SHADES.map((cs) => (
                      <option key={cs} value={cs}>{cs}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Dyeing Method
                  </label>
                  <select
                    disabled={formMode === "view"}
                    value={tempRow.dyeingMethod || "Reactive"}
                    onChange={(e) => handleUpdateFabricDetailsModalField("dyeingMethod", e.target.value)}
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  >
                    {DYEING_METHODS.map((dm) => (
                      <option key={dm} value={dm}>{dm}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Dyeing Process Loss (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    disabled={formMode === "view"}
                    value={tempRow.dyeingProcessLossPct ?? 4}
                    onChange={(e) => handleUpdateFabricDetailsModalField("dyeingProcessLossPct", Number(e.target.value) || 0)}
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-right"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Required Greige QTY (kg)
                  </label>
                  <div className="w-full h-8 px-2 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center justify-end select-all cursor-not-allowed" title="Previous Required QTY × (1 + Dyeing Loss %)">
                    {Number(tempRow.requiredGreigeQty || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Dyeing Rate ($/kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    disabled={formMode === "view"}
                    value={tempRow.dyeingRate ?? 0.85}
                    onChange={(e) => handleUpdateFabricDetailsModalField("dyeingRate", Number(e.target.value) || 0)}
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-right"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Dyeing Cost ($)
                  </label>
                  <div className="w-full h-8 px-2 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center justify-end select-all cursor-not-allowed">
                    ${Number(tempRow.dyeingCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {!matchedDye && (
                <div className="mt-3 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <div>
                    <span className="font-bold">No Matching Record in Dyeing Rate Master:</span>
                    <p className="mt-0.5 text-[11px] text-amber-700 dark:text-amber-400">
                      No configured rate found for Color Shade: <strong>&quot;{tempRow.colorShade || 'Medium'}&quot;</strong> and Method: <strong>&quot;{tempRow.dyeingMethod || 'Reactive'}&quot;</strong>. Please configure it in Dyeing Rate Master.
                    </p>
                  </div>
                </div>
              )}
            </div>
          );

          const renderYarnDyeingCard = () => (
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                    <Sparkles className="size-3.5" />
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Yarn Dyeing (Y/D) Process
                  </h4>
                </div>
                <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300">
                  Y/D Cost: ${Number(tempRow.ydCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Y/D Type
                  </label>
                  <select
                    disabled={formMode === "view"}
                    value={tempRow.ydType || "Feeder Stripe"}
                    onChange={(e) => handleUpdateFabricDetailsModalField("ydType", e.target.value)}
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  >
                    {YD_TYPES.map((yt) => (
                      <option key={yt} value={yt}>{yt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Color Shade
                  </label>
                  <select
                    disabled={formMode === "view"}
                    value={tempRow.colorShade || "Medium"}
                    onChange={(e) => handleUpdateFabricDetailsModalField("colorShade", e.target.value)}
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  >
                    {COLOR_SHADES.map((cs) => (
                      <option key={cs} value={cs}>{cs}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Dyeing Method
                  </label>
                  <select
                    disabled={formMode === "view"}
                    value={tempRow.dyeingMethod || "Reactive"}
                    onChange={(e) => handleUpdateFabricDetailsModalField("dyeingMethod", e.target.value)}
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  >
                    {YD_DYEING_METHODS.map((dm) => (
                      <option key={dm} value={dm}>{dm}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Y/D Process Loss (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    disabled={formMode === "view"}
                    value={tempRow.ydProcessLossPct ?? 3}
                    onChange={(e) => handleUpdateFabricDetailsModalField("ydProcessLossPct", Number(e.target.value) || 0)}
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-right"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Req. Dyed Yarn QTY (kg)
                  </label>
                  <div className="w-full h-8 px-2 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center justify-end select-all cursor-not-allowed" title="Knitting Required Yarn × (1 + Y/D Loss %)">
                    {Number(tempRow.requiredDyedYarnKg || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Y/D Rate ($/kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    disabled={formMode === "view"}
                    value={tempRow.ydRate ?? 0.75}
                    onChange={(e) => handleUpdateFabricDetailsModalField("ydRate", Number(e.target.value) || 0)}
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-right"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Y/D Cost ($)
                  </label>
                  <div className="w-full h-8 px-2 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center justify-end select-all cursor-not-allowed">
                    ${Number(tempRow.ydCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>
          );

          const renderAOPCard = () => (
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                    <Palette className="size-3.5" />
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    All Over Print (AOP) Process
                  </h4>
                  {matchedAop ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      ✓ Master: {matchedAop.code}
                    </span>
                  ) : null}
                </div>
                <span className="text-xs font-mono font-bold text-purple-700 dark:text-purple-300">
                  AOP Cost: ${Number(tempRow.aopCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    AOP Type
                  </label>
                  <select
                    disabled={formMode === "view"}
                    value={tempRow.aopType || "Reactive"}
                    onChange={(e) => handleUpdateFabricDetailsModalField("aopType", e.target.value)}
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  >
                    {AOP_TYPES.map((at) => (
                      <option key={at} value={at}>{at}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    AOP Process Loss (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    disabled={formMode === "view"}
                    value={tempRow.aopProcessLossPct ?? 4}
                    onChange={(e) => handleUpdateFabricDetailsModalField("aopProcessLossPct", Number(e.target.value) || 0)}
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-right"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Req. Dyed QTY (kg)
                  </label>
                  <div className="w-full h-8 px-2 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center justify-end select-all cursor-not-allowed" title="Req. Finished (Cuttable) QTY × (1 + AOP Loss %)">
                    {Number(tempRow.requiredDyedQty || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    AOP Rate ($/kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    disabled={formMode === "view"}
                    value={tempRow.aopRate ?? 0.95}
                    onChange={(e) => handleUpdateFabricDetailsModalField("aopRate", Number(e.target.value) || 0)}
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-right"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    AOP Cost ($)
                  </label>
                  <div className="w-full h-8 px-2 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center justify-end select-all cursor-not-allowed">
                    ${Number(tempRow.aopCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {!matchedAop && (
                <div className="mt-3 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <div>
                    <span className="font-bold">No Matching Record in AOP Process Rate Master:</span>
                    <p className="mt-0.5 text-[11px] text-amber-700 dark:text-amber-400">
                      No configured rate found for AOP Type: <strong>&quot;{tempRow.aopType || 'Reactive'}&quot;</strong>. Please configure it in AOP Process Rate Master.
                    </p>
                  </div>
                </div>
              )}
            </div>
          );

          const renderFinishingCard = () => (
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
                    <Sliders className="size-3.5" />
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Finishing & Washing
                  </h4>
                </div>
                <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-300">
                  Finishing Cost: ${((Number(tempRow.washingCost) || 0) + (Number(tempRow.finishingCost) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Washing Rate ($/kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    disabled={formMode === "view"}
                    value={tempRow.washingRate ?? 0}
                    onChange={(e) => handleUpdateFabricDetailsModalField("washingRate", Number(e.target.value) || 0)}
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-right"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Washing Cost ($)
                  </label>
                  <div className="w-full h-8 px-2 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center justify-end select-all cursor-not-allowed">
                    ${Number(tempRow.washingCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Finishing Rate ($/kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    disabled={formMode === "view"}
                    value={tempRow.finishingRate ?? 0}
                    onChange={(e) => handleUpdateFabricDetailsModalField("finishingRate", Number(e.target.value) || 0)}
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-right"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Finishing Cost ($)
                  </label>
                  <div className="w-full h-8 px-2 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center justify-end select-all cursor-not-allowed">
                    ${Number(tempRow.finishingCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>
          );

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-indigo-50/60 dark:bg-indigo-950/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                      D
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Fabric Processing & Costing Details</span>
                        <span className="text-[10.5px] px-2 py-0.5 rounded-full font-mono font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                          {source} • {color}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Item: <span className="font-semibold text-slate-800 dark:text-slate-200">{tempRow.head} — {tempRow.item}</span> | Required Finished (Cuttable):{" "}
                        <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">
                          {Number(tempRow.requiredFinishedQty || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kg
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseFabricDetailsModal}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                {/* Sub-bar: Fabric Source & Color Type Switcher */}
                <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Fabric Source:</span>
                      <select
                        disabled={formMode === "view"}
                        value={tempRow.fabricSource || "Production"}
                        onChange={(e) => handleUpdateFabricDetailsModalField("fabricSource", e.target.value)}
                        className="h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                      >
                        {KNIT_FABRIC_SOURCES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Color Type:</span>
                      <select
                        disabled={formMode === "view"}
                        value={tempRow.colorType || "Solid"}
                        onChange={(e) => handleUpdateFabricDetailsModalField("colorType", e.target.value)}
                        className="h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                      >
                        {KNIT_COLOR_TYPES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    {caseBadge}
                  </div>
                </div>

                {/* Modal Body: Sections arranged per requirement */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {/* Fabric Master Specifications Reference Card */}
                  <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Layers className="size-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="font-bold text-slate-800 dark:text-slate-200">Fabric Item:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{tempRow.item}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                        Type: <strong className="text-slate-900 dark:text-white">{currentFabricType || "Single Jersey"}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                        Color: <strong className="text-slate-900 dark:text-white">{currentFabricColor}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                        Feeder: <strong className="text-slate-900 dark:text-white">{currentFeeder || "Blank"}</strong>
                      </span>
                      {tempRow.gsm ? (
                        <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono">
                          GSM: <strong className="text-slate-900 dark:text-white">{tempRow.gsm}</strong>
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Case A: Production + Y/D -> Knitting, Yarn Dyeing, Finishing */}
                  {modalCase === "CASE_A" && (
                    <>
                      {renderKnittingCard()}
                      {renderYarnDyeingCard()}
                      {renderFinishingCard()}
                    </>
                  )}

                  {/* Case B: Production + Solid -> Dyeing, Knitting, Finishing */}
                  {modalCase === "CASE_B" && (
                    <>
                      {renderDyeingCard()}
                      {renderKnittingCard()}
                      {renderFinishingCard()}
                    </>
                  )}

                  {/* Case C: Production + AOP -> AOP, Dyeing, Knitting, Finishing */}
                  {modalCase === "CASE_C" && (
                    <>
                      {renderAOPCard()}
                      {renderDyeingCard()}
                      {renderKnittingCard()}
                      {renderFinishingCard()}
                    </>
                  )}

                  {/* Case D: Grey Purchase / Buyer Supplied / Stock + Solid -> Dyeing, Finishing */}
                  {modalCase === "CASE_D" && (
                    <>
                      {renderDyeingCard()}
                      {renderFinishingCard()}
                    </>
                  )}

                  {/* Case E: Grey Purchase / Buyer Supplied / Stock + AOP -> AOP, Dyeing, Finishing */}
                  {modalCase === "CASE_E" && (
                    <>
                      {renderAOPCard()}
                      {renderDyeingCard()}
                      {renderFinishingCard()}
                    </>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs text-slate-500 font-semibold">Total Process Cost:</span>
                    <span className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono font-bold text-xs border border-indigo-200 dark:border-indigo-800">
                      ${totalProcessCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold ml-2">Total Fabric Row Amount:</span>
                    <span className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs border border-emerald-200 dark:border-emerald-800">
                      ${Number(tempRow.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCloseFabricDetailsModal}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                    {formMode !== "view" && (
                      <button
                        type="button"
                        onClick={handleSaveFabricDetailsModal}
                        className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Save className="size-3.5" /> Save & Apply Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ════════════════════════════════════════════════════════════
            MODAL: YARN DETAILS BREAKDOWN (EXCEL MODEL REPLICATION)
           ════════════════════════════════════════════════════════════ */}
        {yarnModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-7xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
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
                        <table className="w-full text-xs text-left whitespace-nowrap min-w-[1450px]">
                          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[9.5px] uppercase font-black text-slate-500">
                            <tr>
                              <th className="py-2.5 px-2 text-center w-8">Sl.</th>
                              <th className="py-2.5 px-2 w-20 min-w-[70px]">Grade *</th>
                              <th className="py-2.5 px-2 w-36 min-w-[130px]">Yarn Count *</th>
                              <th className="py-2.5 px-2 w-52 min-w-[180px]">Yarn Composition *</th>
                              <th className="py-2.5 px-2 w-36 min-w-[130px]">Spinning Type</th>
                              <th className="py-2.5 px-2 w-56 min-w-[200px]">Yarn Item *</th>
                              <th className="py-2.5 px-2 text-right w-24 min-w-[90px]">Ratio (%) *</th>
                              <th className="py-2.5 px-2 text-right w-28 min-w-[100px]">Final Qty (Kg)</th>
                              <th className="py-2.5 px-2 text-right w-24 min-w-[90px]">Rate ($/kg) *</th>
                              <th className="py-2.5 px-2.5 text-right w-28 min-w-[100px]">Yarn Cost ($)</th>
                              <th className="py-2.5 px-2.5 w-52 min-w-[170px]">Vendor *</th>
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
                              yarnModal.rows.map((yRow, yIdx) => {
                                const currentYarnItem = yRow.yarnItem || [yRow.yarnCount, yRow.yarnComposition].filter(Boolean).join(" ");
                                return (
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

                                  {/* 3. Yarn Count (Searchable Dropdown populated from Yarn Count Master) */}
                                  <td className="py-2 px-2 w-36 min-w-[130px]">
                                    <SearchableSelect
                                      options={getYarnCountOptions(yRow.yarnCount)}
                                      value={yRow.yarnCount || ""}
                                      onChange={(val) => handleUpdateYarnModalRow(yIdx, "yarnCount", val)}
                                      placeholder="Select Count..."
                                      disabled={formMode === "view"}
                                      className="text-xs h-8 px-2"
                                      allowCustom
                                    />
                                  </td>

                                  {/* 4. Yarn Composition (Searchable Dropdown populated from Weekly Yarn Rate Master) */}
                                  <td className="py-2 px-2 w-52 min-w-[180px]">
                                    <SearchableSelect
                                      options={getYarnCompositionOptions(yRow.yarnComposition)}
                                      value={yRow.yarnComposition || ""}
                                      onChange={(val) => handleUpdateYarnModalRow(yIdx, "yarnComposition", val)}
                                      placeholder="Select Composition..."
                                      disabled={formMode === "view"}
                                      className="text-xs h-8 px-2"
                                      allowCustom
                                    />
                                  </td>

                                  {/* 5. Spinning Type (Searchable Dropdown) */}
                                  <td className="py-2 px-2 w-36 min-w-[130px]">
                                    <SearchableSelect
                                      options={getSpinningTypeOptions(yRow.spinningType)}
                                      value={yRow.spinningType || ""}
                                      onChange={(val) => handleUpdateYarnModalRow(yIdx, "spinningType", val)}
                                      placeholder="Select Spinning..."
                                      disabled={formMode === "view"}
                                      className="text-xs h-8 px-2"
                                      allowCustom
                                    />
                                  </td>

                                  {/* 6. Yarn Item (Read-only field, automatically generated by combining Yarn Count and Yarn Composition) */}
                                  <td className="py-2 px-2 w-56 min-w-[200px]">
                                    <input
                                      type="text"
                                      readOnly
                                      value={currentYarnItem}
                                      className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-not-allowed select-all"
                                      title={currentYarnItem}
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
                                  <td className="py-2 px-2 w-52 min-w-[170px]">
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
                              );
                              })
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

export default BuyerQuotationManager;
