// ============================================================================
// Marketing Planning & Performance — Data Layer & Calculations
// Primary Business Reference: Marketing Target vs Achievement status summary-2027.xlsx
// ============================================================================

import SEED_DATA from "./marketing-performance-seed.json";
import { MM_BUYERS_MASTER } from "./marketing-merchandising-data";

export interface MasterBuyerItem {
  id: string;
  name: string;
  hod?: string;
  country?: string;
}

export interface MonthlyAchievement {
  achieveQty: number | null;
  achieveFob: number | null;
}

export interface BuyerTargetRecord {
  id: string;
  rowIdx?: number;
  buyer: string;
  hod: string;
  targetQty: number | null; // Monthly recurring baseline
  targetFob: number | null; // Monthly base FOB target
  targetFobExtra: number | null; // Target FOB with 15% Extra (targetFob * 1.15)
  achievements: Record<string, MonthlyAchievement>; // "jan" .. "dec"
}

export interface MarketingTargetPlan {
  id: string;
  year: number;
  planName: string;
  status: "Draft" | "Active" | "Approved";
  createdDate: string;
  createdBy: string;
  lastUpdated: string;
  buyers: BuyerTargetRecord[];
}

export type CalculationBasis = "extra" | "base" | "sideBySide";

export const MONTH_KEYS = [
  { key: "jan", label: "January", shortLabel: "Jan" },
  { key: "feb", label: "February", shortLabel: "Feb" },
  { key: "mar", label: "March", shortLabel: "Mar" },
  { key: "apr", label: "April", shortLabel: "Apr" },
  { key: "may", label: "May", shortLabel: "May" },
  { key: "jun", label: "June", shortLabel: "Jun" },
  { key: "jul", label: "July", shortLabel: "Jul" },
  { key: "aug", label: "August", shortLabel: "Aug" },
  { key: "sep", label: "September", shortLabel: "Sep" },
  { key: "oct", label: "October", shortLabel: "Oct" },
  { key: "nov", label: "November", shortLabel: "Nov" },
  { key: "dec", label: "December", shortLabel: "Dec" },
] as const;

export const KNOWN_HODS = [
  "Mr.Alfaz",
  "Mr.Faysal",
  "Mr.Kadry",
  "Mr.Rokon",
  "Mr.Saddam",
  "Mr.Sadik",
];

const STORAGE_KEY_PREFIX = "cripton_mm_marketing_plan_";

// Helper: Calculate Target FOB with 15% Extra
export function calculateTargetFobExtra(targetFob: number | null): number | null {
  if (targetFob === null || targetFob === undefined || isNaN(targetFob)) return null;
  return Math.round(targetFob * 1.15 * 100) / 100;
}

// Convert raw seed item to BuyerTargetRecord
function createSeedPlan2027(): MarketingTargetPlan {
  const buyers: BuyerTargetRecord[] = (SEED_DATA as any[]).map((d, index) => {
    return {
      id: `rec-2027-${index + 1}`,
      rowIdx: d.rowIdx,
      buyer: d.buyer,
      hod: d.hod,
      targetQty: d.targetQty,
      targetFob: d.targetFob,
      targetFobExtra: d.targetFobExtra ?? calculateTargetFobExtra(d.targetFob),
      achievements: d.achievements || {},
    };
  });

  return {
    id: "plan-2027-annual",
    year: 2027,
    planName: "Marketing Target Plan — 2027 (Annual Recurring)",
    status: "Active",
    createdDate: "2026-10-15",
    createdBy: "Corporate Marketing Planning",
    lastUpdated: "2026-10-27 12:00",
    buyers,
  };
}

export const MarketingPerformanceRepository = {
  getAvailableYears(): number[] {
    return [2026, 2027, 2028, 2029];
  },

  getTargetPlan(year: number): MarketingTargetPlan {
    const key = `${STORAGE_KEY_PREFIX}${year}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Error reading marketing plan from localStorage", e);
    }

    // Default seed for 2027
    if (year === 2027) {
      const plan = createSeedPlan2027();
      this.saveTargetPlan(plan);
      return plan;
    }

    // Default template for other years
    const basePlan = createSeedPlan2027();
    const blankPlan: MarketingTargetPlan = {
      id: `plan-${year}-annual`,
      year,
      planName: `Marketing Target Plan — ${year} (Annual Recurring)`,
      status: "Draft",
      createdDate: new Date().toISOString().slice(0, 10),
      createdBy: "Tanvir Ahmed (Merchandiser)",
      lastUpdated: new Date().toISOString().slice(0, 16).replace("T", " "),
      buyers: basePlan.buyers.map((b, idx) => ({
        ...b,
        id: `rec-${year}-${idx + 1}`,
        achievements: {
          jan: { achieveQty: null, achieveFob: null },
          feb: { achieveQty: null, achieveFob: null },
          mar: { achieveQty: null, achieveFob: null },
          apr: { achieveQty: null, achieveFob: null },
          may: { achieveQty: null, achieveFob: null },
          jun: { achieveQty: null, achieveFob: null },
          jul: { achieveQty: null, achieveFob: null },
          aug: { achieveQty: null, achieveFob: null },
          sep: { achieveQty: null, achieveFob: null },
          oct: { achieveQty: null, achieveFob: null },
          nov: { achieveQty: null, achieveFob: null },
          dec: { achieveQty: null, achieveFob: null },
        },
      })),
    };
    this.saveTargetPlan(blankPlan);
    return blankPlan;
  },

  saveTargetPlan(plan: MarketingTargetPlan): void {
    const key = `${STORAGE_KEY_PREFIX}${plan.year}`;
    try {
      localStorage.setItem(key, JSON.stringify(plan));
    } catch (e) {
      console.error("Error saving marketing plan to localStorage", e);
    }
  },

  resetPlanToSeed(year: number): MarketingTargetPlan {
    if (year === 2027) {
      const plan = createSeedPlan2027();
      this.saveTargetPlan(plan);
      return plan;
    }
    return this.getTargetPlan(year);
  },

  updateMonthlyAchievement(
    year: number,
    buyerId: string,
    monthKey: string,
    achieveQty: number | null,
    achieveFob: number | null
  ): MarketingTargetPlan {
    const plan = this.getTargetPlan(year);
    const buyer = plan.buyers.find((b) => b.id === buyerId);
    if (buyer) {
      buyer.achievements = buyer.achievements || {};
      buyer.achievements[monthKey] = {
        achieveQty,
        achieveFob,
      };
      plan.lastUpdated = new Date().toISOString().slice(0, 16).replace("T", " ");
      this.saveTargetPlan(plan);
    }
    return plan;
  },

  getAvailableBuyers(): string[] {
    const plan = this.getTargetPlan(2027);
    return Array.from(new Set(plan.buyers.map((b) => b.buyer).filter(Boolean)));
  },

  getAvailableHODs(): string[] {
    return KNOWN_HODS;
  },

  getBuyerMasterList(): MasterBuyerItem[] {
    const map = new Map<string, MasterBuyerItem>();

    // 1. From MM_BUYERS_MASTER (System Master)
    if (Array.isArray(MM_BUYERS_MASTER)) {
      MM_BUYERS_MASTER.forEach((b) => {
        if (b && b.name) {
          map.set(b.name.trim().toLowerCase(), {
            id: b.id,
            name: b.name.trim(),
            country: b.country,
          });
        }
      });
    }

    // 2. From SEED_DATA (with canonical HOD mapping from Marketing Target vs Achievement workbook)
    if (Array.isArray(SEED_DATA)) {
      (SEED_DATA as any[]).forEach((s, idx) => {
        if (s && s.buyer) {
          const key = s.buyer.trim().toLowerCase();
          const existing = map.get(key);
          if (existing) {
            if (s.hod) existing.hod = s.hod;
          } else {
            map.set(key, {
              id: `seed-b-${idx + 1}`,
              name: s.buyer.trim(),
              hod: s.hod,
            });
          }
        }
      });
    }

    // 3. Known canonical corporate buyer HOD alignments
    const corporateHodMappings: Record<string, string> = {
      "zara (inditex)": "Mr.Saddam",
      "h&m hennes & mauritz": "Mr.Sadik",
      "marks & spencer": "Mr.Kadry",
      "next plc": "Mr.Sadik",
      "target corporation": "Mr.Kadry",
      "marlin media": "Mr.Alfaz",
    };

    Object.entries(corporateHodMappings).forEach(([k, hod]) => {
      const item = map.get(k);
      if (item && !item.hod) {
        item.hod = hod;
      }
    });

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  },

  getMappedHODForBuyer(buyerName: string): string {
    if (!buyerName || !buyerName.trim()) return "";
    const clean = buyerName.trim();
    const q = clean.toLowerCase();
    const master = this.getBuyerMasterList();

    // Exact match
    const exact = master.find((m) => m.name.toLowerCase() === q);
    if (exact && exact.hod) return exact.hod;

    // Substring / partial match (e.g., "Zara" vs "Zara (Inditex)", "Next" vs "NEXT(KNITTEX)")
    const partial = master.find(
      (m) =>
        m.hod &&
        (m.name.toLowerCase().startsWith(q) ||
          q.startsWith(m.name.toLowerCase()) ||
          m.name.toLowerCase().includes(q))
    );
    if (partial && partial.hod) return partial.hod;

    return "";
  },
};

export const getBuyerMasterList = () => MarketingPerformanceRepository.getBuyerMasterList();
export const getMappedHODForBuyer = (buyerName: string) => MarketingPerformanceRepository.getMappedHODForBuyer(buyerName);

// ============================================================================
// Math & Calculation Functions matching Summary-2027 and Summary-2027 Extra
// ============================================================================

export interface MetricCalculationResult {
  achieveQty: number | null;
  achieveFob: number | null;
  targetQty: number | null;
  targetFob: number | null;
  targetFobExtra: number | null;
  qtyVariance: number | null; // Excess / Less (Qty) = Achieve Qty - Target Qty
  fobVariance: number | null; // Excess / Less (FOB)
  achievePercent: number | null; // (Achieve FOB / Base Target FOB) * 100
}

export function computeMonthlyMetrics(
  targetQty: number | null,
  targetFob: number | null,
  targetFobExtra: number | null,
  achieveQty: number | null,
  achieveFob: number | null,
  basis: CalculationBasis = "extra"
): MetricCalculationResult {
  // If achievement is missing or not yet recorded
  const hasAchieve = achieveQty !== null || achieveFob !== null;
  const actualQty = achieveQty ?? 0;
  const actualFob = achieveFob ?? 0;

  // Quantity variance: Total Achieve Qty - Target Qty
  const qtyVariance = targetQty !== null ? actualQty - targetQty : (hasAchieve ? actualQty : null);

  // FOB variance:
  // Base: Total Achieve Value $ FOB - Target FOB $
  // Extra: Total Achieve Value $ FOB - Target FOB with 15% Extra
  let fobVariance: number | null = null;
  if (basis === "extra") {
    if (targetFobExtra !== null && targetFobExtra !== undefined) {
      fobVariance = actualFob - targetFobExtra;
    } else if (hasAchieve) {
      fobVariance = actualFob;
    }
  } else {
    // basis === "base"
    if (targetFob !== null && targetFob !== undefined) {
      fobVariance = actualFob - targetFob;
    } else if (hasAchieve) {
      fobVariance = actualFob;
    }
  }

  // Achievement Percentage:
  // Both Summary-2027 and Summary-2027 Extra compute: Actual FOB / Base Target FOB * 100
  let achievePercent: number | null = null;
  if (targetFob && targetFob > 0) {
    achievePercent = (actualFob / targetFob) * 100;
  }

  return {
    achieveQty,
    achieveFob,
    targetQty,
    targetFob,
    targetFobExtra,
    qtyVariance,
    fobVariance,
    achievePercent,
  };
}

// Compute Yearly summary for a buyer across 12 months
export function computeYearlySummary(
  buyer: BuyerTargetRecord,
  applicableMonths: number = 12,
  basis: CalculationBasis = "extra"
) {
  // Recurring monthly baseline * 12
  const totalTargetQty = buyer.targetQty !== null ? buyer.targetQty * applicableMonths : null;
  const totalTargetValue = buyer.targetFob !== null ? buyer.targetFob * applicableMonths : null;
  const totalTargetExtra = buyer.targetFobExtra !== null ? buyer.targetFobExtra * applicableMonths : null;

  let totalAchieveQty = 0;
  let totalAchieveFob = 0;
  let hasAnyAchieve = false;

  MONTH_KEYS.forEach((m) => {
    const ach = buyer.achievements[m.key];
    if (ach?.achieveQty !== null && ach?.achieveQty !== undefined) {
      totalAchieveQty += ach.achieveQty;
      hasAnyAchieve = true;
    }
    if (ach?.achieveFob !== null && ach?.achieveFob !== undefined) {
      totalAchieveFob += ach.achieveFob;
      hasAnyAchieve = true;
    }
  });

  const qtyVariance = totalTargetQty !== null ? totalAchieveQty - totalTargetQty : (hasAnyAchieve ? totalAchieveQty : null);

  let fobVariance: number | null = null;
  if (basis === "extra") {
    if (totalTargetExtra !== null) {
      fobVariance = totalAchieveFob - totalTargetExtra;
    } else if (hasAnyAchieve) {
      fobVariance = totalAchieveFob;
    }
  } else {
    if (totalTargetValue !== null) {
      fobVariance = totalAchieveFob - totalTargetValue;
    } else if (hasAnyAchieve) {
      fobVariance = totalAchieveFob;
    }
  }

  let achievePercent: number | null = null;
  if (totalTargetValue && totalTargetValue > 0) {
    achievePercent = (totalAchieveFob / totalTargetValue) * 100;
  }

  return {
    totalTargetQty,
    totalTargetValue,
    totalTargetExtra,
    totalAchieveQty: hasAnyAchieve ? totalAchieveQty : 0,
    totalAchieveFob: hasAnyAchieve ? totalAchieveFob : 0,
    qtyVariance,
    fobVariance,
    achievePercent,
  };
}
