// ============================================================================
// Merchandising Master Data Layer & Storage Services
// Isolated Marketing & Merchandising Master Configuration
// ============================================================================

export interface CompositionEntry {
  ratio: number;
  fiberName: string;
  number?: number;
  cottonSpandex?: string; // "Cotton" | "Spandex" | "Cotton/Spandex" | "Polyester" | "Other"
}

export interface MMFabricComposition {
  id: string;
  code: string;
  name: string; // e.g. "60% Cotton / 35% Polyester / 5% Spandex"
  entries: [CompositionEntry, CompositionEntry, CompositionEntry];
  totalRatio: number;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

export interface MMFabricType {
  id: string;
  code: string;
  name: string; // e.g. "Single Jersey", "1x1 Rib", "Fleece"
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

export interface MMSpinningType {
  id: string;
  code: string;
  name: string; // e.g. "Ring Spun", "Rotor / Open End", "Vortex"
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

export type DyeingColorShade = "Medium" | "White" | "Light" | "Dark" | "Extra Dark";
export const DYEING_COLOR_SHADES: DyeingColorShade[] = [
  "Medium",
  "White",
  "Light",
  "Dark",
  "Extra Dark",
];

export type DyeingMethodOption =
  "Reactive" | "Dispersed" | "2 Part Dye" | "Normal Wash" | "White Dyeing" | "N/A";
export const DYEING_METHODS: DyeingMethodOption[] = [
  "Reactive",
  "Dispersed",
  "2 Part Dye",
  "Normal Wash",
  "White Dyeing",
  "N/A",
];

export interface MMDyeingRate {
  id: string;
  code: string;
  colorShade: DyeingColorShade;
  dyeingMethod: DyeingMethodOption;
  processLoss: number; // Dyeing Process Loss (%)
  rate: number; // USD / kg
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

export type YDTypeOption = "Feeder Stripe" | "Engineering Stripe";
export const YD_TYPES_OPTIONS: YDTypeOption[] = ["Feeder Stripe", "Engineering Stripe"];

export type YDColorShadeOption = "Medium" | "White" | "Light" | "Dark" | "Extra Dark";
export const YD_COLOR_SHADES: YDColorShadeOption[] = ["Medium", "White", "Light", "Dark", "Extra Dark"];

export type YDDyeingMethodOption =
  | "Reactive"
  | "Dispersed"
  | "2 Part Dye"
  | "Normal Wash"
  | "White Wash"
  | "N/A";
export const YD_DYEING_METHODS_OPTIONS: YDDyeingMethodOption[] = [
  "Reactive",
  "Dispersed",
  "2 Part Dye",
  "Normal Wash",
  "White Wash",
  "N/A",
];

export interface MMYarnDyeingRate {
  id: string;
  code: string;
  ydType: YDTypeOption;
  colorShade: YDColorShadeOption;
  dyeingMethod: YDDyeingMethodOption;
  processLoss: number; // Y/D Process Loss (%)
  rate: number; // USD / kg
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

export type FeederTypeOption = "" | "Half Feeder" | "Full Feeder";
export const FEEDER_TYPES: FeederTypeOption[] = ["", "Half Feeder", "Full Feeder"];

// Legacy compatibility alias
export type FitterTypeOption = FeederTypeOption | "Half Fitter" | "Full Fitter";
export const FITTER_TYPES = FEEDER_TYPES;

export type ColorTypeOption = "Solid" | "Y/D";
export const COLOR_TYPES: ColorTypeOption[] = ["Solid", "Y/D"];

export interface MMKnittingRate {
  id: string;
  code: string;
  fabricTypeId: string;
  fabricTypeName: string;
  colorType: ColorTypeOption; // "Solid" | "Y/D"
  feederType: FeederTypeOption; // "Half Feeder" | "Full Feeder"
  fitterType?: string; // Legacy compatibility
  processLossPct: number; // Percentage, e.g. 3.5
  knittingRate: number; // Rate (USD / kg)
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

export interface MMYarnCount {
  id: string;
  code: string;
  yarnCount: string; // e.g. "20/1", "26/1", "30/1"
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

export interface YarnRateEntryRow {
  id: string;
  date: string;
  grade: "A" | "B";
  count: string;
  composition: string;
  rate: number; // USD
}

export interface YarnTypeUpchargeRow {
  id: string;
  yarnType: string;
  upcharge: number; // USD
}

export interface MMBuyerDepartment {
  id: string;
  departmentName: string;
  accountHolder: string; // Searchable dropdown populated with employee records
  sizes: string[]; // Department-wise GMT Sizes
}

export interface MMBuyerMasterRecord {
  id: string;
  code: string; // e.g. "BYR-001"
  buyerName: string; // with duplicate validation
  country: string; // Searchable dropdown populated with available country list
  address: string; // Text field for buyer-specific address
  accountHolder: string; // Searchable dropdown populated with employee records (main account holder)
  buyerSizes: string[]; // Buyer-wise GMT Size
  departments: MMBuyerDepartment[];
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

export interface MMBuyerSeasonRecord {
  id: string;
  code: string;
  buyerId: string;
  buyerName: string;
  season: string;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

export interface MMBuyerStyleRecord {
  id: string;
  code: string;
  buyerId: string;
  buyerName: string;
  style: string;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

export interface MMGmtItemRecord {
  id: string;
  code: string;
  name: string;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

export interface MMCategoryRecord {
  id: string;
  code: string;
  name: string;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

export interface MMColorRecord {
  id: string;
  code: string;
  name: string;
  hexCode?: string;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

export type CostHeadCategory = "Fabric" | "Accessorie" | "Embellishment" | "Others";
export const COST_HEAD_CATEGORIES: CostHeadCategory[] = [
  "Fabric",
  "Accessorie",
  "Embellishment",
  "Others",
];

export interface MMCostHeadRecord {
  id: string;
  code: string;
  category: CostHeadCategory;
  costHead: string;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

export interface MMFabricSetupRecord {
  id: string;
  code: string;
  fabricName: string;
  fabricComposition: string;
  fabricType: string;
  gsm: number;
  spinningType: string;
  feederType: string;
  washType: string;
  finishType: string;
  colorType: "Solid" | "Y/D";
  otherSpecs: string;
  fabricCategory: string;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

export function generateFabricName(data: {
  fabricComposition?: string;
  fabricType?: string;
  gsm?: number | string;
  spinningType?: string;
  feederType?: string;
  washType?: string;
  finishType?: string;
  colorType?: string;
  otherSpecs?: string;
  fabricCategory?: string;
}): string {
  const parts: string[] = ["Fabric"];

  if (data.fabricComposition && data.fabricComposition.trim()) {
    parts.push(data.fabricComposition.trim());
  }
  if (data.fabricType && data.fabricType.trim()) {
    parts.push(data.fabricType.trim());
  }
  const gsmNum = Number(data.gsm);
  if (gsmNum && gsmNum > 0) {
    parts.push(`${gsmNum} GSM`);
  }
  if (data.spinningType && data.spinningType.trim()) {
    parts.push(data.spinningType.trim());
  }
  if (data.feederType && data.feederType.trim()) {
    parts.push(data.feederType.trim());
  }
  if (data.washType && data.washType.trim()) {
    parts.push(data.washType.trim());
  }
  if (data.finishType && data.finishType.trim()) {
    parts.push(data.finishType.trim());
  }
  if (data.colorType && data.colorType.trim()) {
    parts.push(data.colorType.trim());
  }
  if (data.otherSpecs && data.otherSpecs.trim()) {
    parts.push(data.otherSpecs.trim());
  }
  if (data.fabricCategory && data.fabricCategory.trim()) {
    parts.push(data.fabricCategory.trim());
  }

  return parts.join(" ");
}

export interface MMAccessoriesSetupRecord {
  id: string;
  code: string;
  accessoriesName: string;
  uom: string;
  marketUnit: string;
  relationFactor: number;
  head: "Sewing Trims" | "Finishing Trims";
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

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

export type AopTypeOption = (typeof AOP_TYPES)[number];

export interface MMAopProcessRateRecord {
  id: string;
  code: string;
  aopType: string;
  processLoss: number;
  rate: number;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

export interface MMYarnRateWeeklyRecord {
  id: string;
  recordNo: string; // e.g. "YR-2026-W45"
  effectiveDate: string;
  weekNumber: number;
  year: number;
  weekLabel: string;
  entries: YarnRateEntryRow[];
  upcharges: YarnTypeUpchargeRow[];
  status: "Active" | "Inactive";
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

// ----------------------------------------------------------------------------
// Predefined Constant Dictionaries
// ----------------------------------------------------------------------------

export const STANDARD_FIBER_NAMES = [
  "Cotton",
  "Polyester",
  "Spandex",
  "Viscose",
  "Modal",
  "Linen",
  "Wool",
  "Nylon",
  "Acrylic",
  "Bamboo",
  "Silk",
  "Elastane",
  "Tencel",
  "Recycle Polyester",
  "Organic Cotton",
  "Modal Blend",
  "CVC",
  "TC",
];

export const COTTON_SPANDEX_OPTIONS = [
  "Cotton",
  "Spandex",
  "Cotton/Spandex",
  "Polyester",
  "Modal",
  "Other",
];

export const PREDEFINED_YARN_COMPOSITIONS = [
  "100% Cotton",
  "60% Cotton 40% Polyester",
  "80% Cotton 20% Polyester",
  "65% Cotton 35% Polyester",
];

export const DEFAULT_YARN_TYPES_UPCHARGE: { yarnType: string; defaultUpcharge: number }[] = [
  { yarnType: "Organic Cotton", defaultUpcharge: 1.0 },
  { yarnType: "Regenagri Yarn", defaultUpcharge: 0.65 },
  { yarnType: "Combed Yarn", defaultUpcharge: 0.45 },
  { yarnType: "Slub Yarn", defaultUpcharge: 0.35 },
  { yarnType: "CMIA Yarn", defaultUpcharge: 0.1 },
  { yarnType: "Compact Yarn", defaultUpcharge: 0.1 },
  { yarnType: "White Yarn", defaultUpcharge: 0.1 },
  { yarnType: "BCI Cotton", defaultUpcharge: 0.1 },
  { yarnType: "Physical BCI", defaultUpcharge: 0.2 },
  { yarnType: "GRS / RCS (Recycle Yarn)", defaultUpcharge: 0.2 },
  { yarnType: "US Cotton with TG", defaultUpcharge: 0.25 },
];

// ----------------------------------------------------------------------------
// Initial Baseline Data
// ----------------------------------------------------------------------------

export const INITIAL_FABRIC_COMPOSITIONS: MMFabricComposition[] = [
  {
    id: "fc-1",
    code: "FC-001",
    name: "100% Cotton",
    entries: [
      { ratio: 100, fiberName: "Cotton", number: 1, cottonSpandex: "Cotton" },
      { ratio: 0, fiberName: "", number: 0, cottonSpandex: "" },
      { ratio: 0, fiberName: "", number: 0, cottonSpandex: "" },
    ],
    totalRatio: 100,
    status: "Active",
    createdAt: "2026-10-15 10:00",
    updatedAt: "2026-10-15 10:00",
  },
  {
    id: "fc-2",
    code: "FC-002",
    name: "60% Cotton 40% Polyester",
    entries: [
      { ratio: 60, fiberName: "Cotton", number: 1, cottonSpandex: "Cotton" },
      { ratio: 40, fiberName: "Polyester", number: 2, cottonSpandex: "Polyester" },
      { ratio: 0, fiberName: "", number: 0, cottonSpandex: "" },
    ],
    totalRatio: 100,
    status: "Active",
    createdAt: "2026-10-16 11:30",
    updatedAt: "2026-10-16 11:30",
  },
  {
    id: "fc-3",
    code: "FC-003",
    name: "95% Cotton 5% Spandex",
    entries: [
      { ratio: 95, fiberName: "Cotton", number: 1, cottonSpandex: "Cotton" },
      { ratio: 5, fiberName: "Spandex", number: 2, cottonSpandex: "Spandex" },
      { ratio: 0, fiberName: "", number: 0, cottonSpandex: "" },
    ],
    totalRatio: 100,
    status: "Active",
    createdAt: "2026-10-18 09:15",
    updatedAt: "2026-10-18 09:15",
  },
  {
    id: "fc-4",
    code: "FC-004",
    name: "60% Cotton 35% Polyester 5% Spandex",
    entries: [
      { ratio: 60, fiberName: "Cotton", number: 1, cottonSpandex: "Cotton" },
      { ratio: 35, fiberName: "Polyester", number: 2, cottonSpandex: "Polyester" },
      { ratio: 5, fiberName: "Spandex", number: 3, cottonSpandex: "Spandex" },
    ],
    totalRatio: 100,
    status: "Active",
    createdAt: "2026-10-20 14:20",
    updatedAt: "2026-10-20 14:20",
  },
  {
    id: "fc-5",
    code: "FC-005",
    name: "80% Cotton 20% Polyester",
    entries: [
      { ratio: 80, fiberName: "Cotton", number: 1, cottonSpandex: "Cotton" },
      { ratio: 20, fiberName: "Polyester", number: 2, cottonSpandex: "Polyester" },
      { ratio: 0, fiberName: "", number: 0, cottonSpandex: "" },
    ],
    totalRatio: 100,
    status: "Active",
    createdAt: "2026-10-22 16:45",
    updatedAt: "2026-10-22 16:45",
  },
];

export const INITIAL_FABRIC_TYPES: MMFabricType[] = [
  {
    id: "ft-1",
    code: "FT-001",
    name: "Single Jersey",
    status: "Active",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
  {
    id: "ft-2",
    code: "FT-002",
    name: "1x1 Rib",
    status: "Active",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
  {
    id: "ft-3",
    code: "FT-003",
    name: "2x2 Rib",
    status: "Active",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
  {
    id: "ft-4",
    code: "FT-004",
    name: "Interlock",
    status: "Active",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
  {
    id: "ft-5",
    code: "FT-005",
    name: "Fleece (Brushed)",
    status: "Active",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
  {
    id: "ft-6",
    code: "FT-006",
    name: "French Terry",
    status: "Active",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
  {
    id: "ft-7",
    code: "FT-007",
    name: "Pique",
    status: "Active",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
  {
    id: "ft-8",
    code: "FT-008",
    name: "Lacoste",
    status: "Active",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
  {
    id: "ft-9",
    code: "FT-009",
    name: "Waffle",
    status: "Active",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
  {
    id: "ft-10",
    code: "FT-010",
    name: "Jacquard Knit",
    status: "Inactive",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
];

export const INITIAL_SPINNING_TYPES: MMSpinningType[] = [
  {
    id: "st-1",
    code: "ST-001",
    name: "Ring Spun",
    status: "Active",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
  {
    id: "st-2",
    code: "ST-002",
    name: "Rotor / Open End (OE)",
    status: "Active",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
  {
    id: "st-3",
    code: "ST-003",
    name: "Vortex / Air Jet",
    status: "Active",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
  {
    id: "st-4",
    code: "ST-004",
    name: "Compact Ring Spun",
    status: "Active",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
  {
    id: "st-5",
    code: "ST-005",
    name: "Siro Spun",
    status: "Active",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
  {
    id: "st-6",
    code: "ST-006",
    name: "Slub Yarn Spun",
    status: "Active",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
];

export const INITIAL_DYEING_RATES: MMDyeingRate[] = [
  {
    id: "dr-1",
    code: "DR-001",
    colorShade: "White",
    dyeingMethod: "White Dyeing",
    processLoss: 2.5,
    rate: 0.85,
    status: "Active",
    createdAt: "2026-10-12",
    updatedAt: "2026-10-12",
  },
  {
    id: "dr-2",
    code: "DR-002",
    colorShade: "Light",
    dyeingMethod: "Reactive",
    processLoss: 3.0,
    rate: 1.15,
    status: "Active",
    createdAt: "2026-10-12",
    updatedAt: "2026-10-12",
  },
  {
    id: "dr-3",
    code: "DR-003",
    colorShade: "Medium",
    dyeingMethod: "Reactive",
    processLoss: 3.0,
    rate: 1.35,
    status: "Active",
    createdAt: "2026-10-12",
    updatedAt: "2026-10-12",
  },
  {
    id: "dr-4",
    code: "DR-004",
    colorShade: "Dark",
    dyeingMethod: "Reactive",
    processLoss: 3.5,
    rate: 1.65,
    status: "Active",
    createdAt: "2026-10-12",
    updatedAt: "2026-10-12",
  },
  {
    id: "dr-5",
    code: "DR-005",
    colorShade: "Extra Dark",
    dyeingMethod: "Reactive",
    processLoss: 4.0,
    rate: 1.95,
    status: "Active",
    createdAt: "2026-10-12",
    updatedAt: "2026-10-12",
  },
  {
    id: "dr-6",
    code: "DR-006",
    colorShade: "Medium",
    dyeingMethod: "Dispersed",
    processLoss: 3.5,
    rate: 1.45,
    status: "Active",
    createdAt: "2026-10-12",
    updatedAt: "2026-10-12",
  },
  {
    id: "dr-7",
    code: "DR-007",
    colorShade: "Dark",
    dyeingMethod: "2 Part Dye",
    processLoss: 4.5,
    rate: 2.1,
    status: "Active",
    createdAt: "2026-10-12",
    updatedAt: "2026-10-12",
  },
  {
    id: "dr-8",
    code: "DR-008",
    colorShade: "Light",
    dyeingMethod: "Normal Wash",
    processLoss: 2.0,
    rate: 0.65,
    status: "Active",
    createdAt: "2026-10-12",
    updatedAt: "2026-10-12",
  },
  {
    id: "dr-9",
    code: "DR-009",
    colorShade: "White",
    dyeingMethod: "N/A",
    processLoss: 0.0,
    rate: 0.0,
    status: "Active",
    createdAt: "2026-10-12",
    updatedAt: "2026-10-12",
  },
];

export const INITIAL_YARN_DYEING_RATES: MMYarnDyeingRate[] = [
  {
    id: "ydr-1",
    code: "YDR-001",
    ydType: "Feeder Stripe",
    colorShade: "Medium",
    dyeingMethod: "Reactive",
    processLoss: 3.0,
    rate: 0.75,
    status: "Active",
    createdAt: "2026-10-14",
    updatedAt: "2026-10-14",
  },
  {
    id: "ydr-2",
    code: "YDR-002",
    ydType: "Feeder Stripe",
    colorShade: "White",
    dyeingMethod: "White Wash",
    processLoss: 2.0,
    rate: 0.60,
    status: "Active",
    createdAt: "2026-10-14",
    updatedAt: "2026-10-14",
  },
  {
    id: "ydr-3",
    code: "YDR-003",
    ydType: "Feeder Stripe",
    colorShade: "Light",
    dyeingMethod: "Reactive",
    processLoss: 2.8,
    rate: 0.70,
    status: "Active",
    createdAt: "2026-10-14",
    updatedAt: "2026-10-14",
  },
  {
    id: "ydr-4",
    code: "YDR-004",
    ydType: "Feeder Stripe",
    colorShade: "Dark",
    dyeingMethod: "Reactive",
    processLoss: 3.5,
    rate: 0.85,
    status: "Active",
    createdAt: "2026-10-14",
    updatedAt: "2026-10-14",
  },
  {
    id: "ydr-5",
    code: "YDR-005",
    ydType: "Feeder Stripe",
    colorShade: "Extra Dark",
    dyeingMethod: "Reactive",
    processLoss: 4.0,
    rate: 0.95,
    status: "Active",
    createdAt: "2026-10-14",
    updatedAt: "2026-10-14",
  },
  {
    id: "ydr-6",
    code: "YDR-006",
    ydType: "Engineering Stripe",
    colorShade: "Medium",
    dyeingMethod: "Reactive",
    processLoss: 3.5,
    rate: 0.95,
    status: "Active",
    createdAt: "2026-10-14",
    updatedAt: "2026-10-14",
  },
  {
    id: "ydr-7",
    code: "YDR-007",
    ydType: "Engineering Stripe",
    colorShade: "Light",
    dyeingMethod: "Reactive",
    processLoss: 3.2,
    rate: 0.90,
    status: "Active",
    createdAt: "2026-10-14",
    updatedAt: "2026-10-14",
  },
  {
    id: "ydr-8",
    code: "YDR-008",
    ydType: "Engineering Stripe",
    colorShade: "Dark",
    dyeingMethod: "Reactive",
    processLoss: 4.0,
    rate: 1.10,
    status: "Active",
    createdAt: "2026-10-14",
    updatedAt: "2026-10-14",
  },
  {
    id: "ydr-9",
    code: "YDR-009",
    ydType: "Engineering Stripe",
    colorShade: "Extra Dark",
    dyeingMethod: "Reactive",
    processLoss: 4.5,
    rate: 1.25,
    status: "Active",
    createdAt: "2026-10-14",
    updatedAt: "2026-10-14",
  },
  {
    id: "ydr-10",
    code: "YDR-010",
    ydType: "Feeder Stripe",
    colorShade: "Medium",
    dyeingMethod: "Dispersed",
    processLoss: 3.5,
    rate: 0.90,
    status: "Active",
    createdAt: "2026-10-14",
    updatedAt: "2026-10-14",
  },
  {
    id: "ydr-11",
    code: "YDR-011",
    ydType: "Feeder Stripe",
    colorShade: "Medium",
    dyeingMethod: "2 Part Dye",
    processLoss: 4.0,
    rate: 1.15,
    status: "Active",
    createdAt: "2026-10-14",
    updatedAt: "2026-10-14",
  },
  {
    id: "ydr-12",
    code: "YDR-012",
    ydType: "Feeder Stripe",
    colorShade: "Medium",
    dyeingMethod: "Normal Wash",
    processLoss: 2.0,
    rate: 0.50,
    status: "Active",
    createdAt: "2026-10-14",
    updatedAt: "2026-10-14",
  },
];

export const INITIAL_KNITTING_RATES: MMKnittingRate[] = [
  {
    id: "kr-1",
    code: "KR-001",
    colorType: "Solid",
    feederType: "Half Feeder",
    fitterType: "Half Feeder",
    fabricTypeId: "ft-1",
    fabricTypeName: "Single Jersey",
    processLossPct: 3.0,
    knittingRate: 0.35,
    status: "Active",
    createdAt: "2026-10-14",
    updatedAt: "2026-10-14",
  },
  {
    id: "kr-2",
    code: "KR-002",
    colorType: "Solid",
    feederType: "Full Feeder",
    fitterType: "Full Feeder",
    fabricTypeId: "ft-1",
    fabricTypeName: "Single Jersey",
    processLossPct: 3.5,
    knittingRate: 0.42,
    status: "Active",
    createdAt: "2026-10-14",
    updatedAt: "2026-10-14",
  },
  {
    id: "kr-3",
    code: "KR-003",
    colorType: "Y/D",
    feederType: "Half Feeder",
    fitterType: "Half Feeder",
    fabricTypeId: "ft-2",
    fabricTypeName: "1x1 Rib",
    processLossPct: 4.0,
    knittingRate: 0.48,
    status: "Active",
    createdAt: "2026-10-14",
    updatedAt: "2026-10-14",
  },
  {
    id: "kr-4",
    code: "KR-004",
    colorType: "Solid",
    feederType: "Full Feeder",
    fitterType: "Full Feeder",
    fabricTypeId: "ft-3",
    fabricTypeName: "2x2 Rib",
    processLossPct: 4.5,
    knittingRate: 0.52,
    status: "Active",
    createdAt: "2026-10-14",
    updatedAt: "2026-10-14",
  },
  {
    id: "kr-5",
    code: "KR-005",
    colorType: "Y/D",
    feederType: "Full Feeder",
    fitterType: "Full Feeder",
    fabricTypeId: "ft-4",
    fabricTypeName: "Interlock",
    processLossPct: 5.0,
    knittingRate: 0.58,
    status: "Active",
    createdAt: "2026-10-14",
    updatedAt: "2026-10-14",
  },
  {
    id: "kr-6",
    code: "KR-006",
    colorType: "Solid",
    feederType: "Full Feeder",
    fitterType: "Full Feeder",
    fabricTypeId: "ft-6",
    fabricTypeName: "French Terry",
    processLossPct: 4.5,
    knittingRate: 0.55,
    status: "Active",
    createdAt: "2026-10-14",
    updatedAt: "2026-10-14",
  },
  {
    id: "kr-7",
    code: "KR-007",
    colorType: "Y/D",
    feederType: "Half Feeder",
    fitterType: "Half Feeder",
    fabricTypeId: "ft-7",
    fabricTypeName: "Pique",
    processLossPct: 3.5,
    knittingRate: 0.44,
    status: "Active",
    createdAt: "2026-10-14",
    updatedAt: "2026-10-14",
  },
];

export const INITIAL_YARN_COUNTS: MMYarnCount[] = [
  {
    id: "yc-1",
    code: "YC-001",
    yarnCount: "10/1",
    status: "Active",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
  {
    id: "yc-2",
    code: "YC-002",
    yarnCount: "16/1",
    status: "Active",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
  {
    id: "yc-3",
    code: "YC-003",
    yarnCount: "20/1",
    status: "Active",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
  {
    id: "yc-4",
    code: "YC-004",
    yarnCount: "24/1",
    status: "Active",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
  {
    id: "yc-5",
    code: "YC-005",
    yarnCount: "26/1",
    status: "Active",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
  {
    id: "yc-6",
    code: "YC-006",
    yarnCount: "30/1",
    status: "Active",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
  {
    id: "yc-7",
    code: "YC-007",
    yarnCount: "32/1",
    status: "Active",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
  {
    id: "yc-8",
    code: "YC-008",
    yarnCount: "34/1",
    status: "Active",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
  {
    id: "yc-9",
    code: "YC-009",
    yarnCount: "40/1",
    status: "Active",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
  {
    id: "yc-10",
    code: "YC-010",
    yarnCount: "20/2",
    status: "Active",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
  {
    id: "yc-11",
    code: "YC-011",
    yarnCount: "30/2",
    status: "Active",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
  {
    id: "yc-12",
    code: "YC-012",
    yarnCount: "40/2",
    status: "Active",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
];

export const INITIAL_YARN_RATES: MMYarnRateWeeklyRecord[] = [
  {
    id: "yr-w45",
    recordNo: "YR-2026-W45",
    effectiveDate: "2026-11-02",
    weekNumber: 45,
    year: 2026,
    weekLabel: "Week 45, 2026 (Nov 02 - Nov 08)",
    status: "Active",
    remarks: "Current weekly benchmark yarn price for spinning mills & booking comparison.",
    entries: [
      {
        id: "yr-e1",
        date: "2026-11-02",
        grade: "A",
        count: "30/1",
        composition: "100% Cotton",
        rate: 3.45,
      },
      {
        id: "yr-e2",
        date: "2026-11-02",
        grade: "A",
        count: "26/1",
        composition: "100% Cotton",
        rate: 3.35,
      },
      {
        id: "yr-e3",
        date: "2026-11-02",
        grade: "A",
        count: "20/1",
        composition: "60% Cotton 40% Polyester",
        rate: 2.95,
      },
      {
        id: "yr-e4",
        date: "2026-11-02",
        grade: "A",
        count: "34/1",
        composition: "100% Cotton",
        rate: 3.65,
      },
      {
        id: "yr-e5",
        date: "2026-11-02",
        grade: "B",
        count: "30/1",
        composition: "100% Cotton",
        rate: 3.15,
      },
      {
        id: "yr-e6",
        date: "2026-11-02",
        grade: "B",
        count: "20/1",
        composition: "60% Cotton 40% Polyester",
        rate: 2.75,
      },
      {
        id: "yr-e7",
        date: "2026-11-02",
        grade: "B",
        count: "26/1",
        composition: "100% Cotton",
        rate: 3.05,
      },
    ],
    upcharges: [
      { id: "up-1", yarnType: "Organic Cotton", upcharge: 1.0 },
      { id: "up-2", yarnType: "Regenagri Yarn", upcharge: 0.65 },
      { id: "up-3", yarnType: "Combed Yarn", upcharge: 0.45 },
      { id: "up-4", yarnType: "Slub Yarn", upcharge: 0.35 },
      { id: "up-5", yarnType: "BCI Cotton", upcharge: 0.1 },
    ],
    createdAt: "2026-11-02 08:30",
    updatedAt: "2026-11-02 08:30",
  },
  {
    id: "yr-w44",
    recordNo: "YR-2026-W44",
    effectiveDate: "2026-10-26",
    weekNumber: 44,
    year: 2026,
    weekLabel: "Week 44, 2026 (Oct 26 - Nov 01)",
    status: "Active",
    remarks: "Previous week price index.",
    entries: [
      {
        id: "yr-e8",
        date: "2026-10-26",
        grade: "A",
        count: "30/1",
        composition: "100% Cotton",
        rate: 3.42,
      },
      {
        id: "yr-e9",
        date: "2026-10-26",
        grade: "A",
        count: "26/1",
        composition: "100% Cotton",
        rate: 3.32,
      },
      {
        id: "yr-e10",
        date: "2026-10-26",
        grade: "A",
        count: "20/1",
        composition: "60% Cotton 40% Polyester",
        rate: 2.92,
      },
      {
        id: "yr-e11",
        date: "2026-10-26",
        grade: "B",
        count: "30/1",
        composition: "100% Cotton",
        rate: 3.12,
      },
      {
        id: "yr-e12",
        date: "2026-10-26",
        grade: "B",
        count: "26/1",
        composition: "100% Cotton",
        rate: 3.02,
      },
    ],
    upcharges: [
      { id: "up-6", yarnType: "Organic Cotton", upcharge: 1.0 },
      { id: "up-7", yarnType: "Combed Yarn", upcharge: 0.45 },
      { id: "up-8", yarnType: "Slub Yarn", upcharge: 0.35 },
    ],
    createdAt: "2026-10-26 09:00",
    updatedAt: "2026-10-26 09:00",
  },
];

export const BUYER_COUNTRIES = [
  "Bangladesh",
  "United States",
  "United Kingdom",
  "Germany",
  "Spain",
  "France",
  "Italy",
  "Netherlands",
  "Sweden",
  "Canada",
  "Australia",
  "Japan",
  "Poland",
  "Denmark",
  "Belgium",
  "Turkey",
  "Portugal",
  "Norway",
  "Switzerland",
  "United Arab Emirates",
  "China",
  "India",
  "Singapore",
  "South Africa",
  "Brazil",
  "Mexico",
  "Saudi Arabia",
  "South Korea",
  "Austria",
  "Finland",
  "Ireland",
  "New Zealand",
];

export const BUYER_ACCOUNT_HOLDERS = [
  "Rashidul Islam (Head of Merchandising)",
  "Md Zubayer Hossain Khan (Senior Merchant)",
  "Hanif Uddin (Merchandising Manager)",
  "Nafis Imtiaz (Senior Merchandiser)",
  "Tanvir Ahmed (Key Account Manager)",
  "Kazi Farhan (Senior Account Lead)",
  "Parvej Mahmud (Assistant Merchant)",
  "Mahmud Hasan (Commercial Director)",
  "Shahidul Alam (Senior Merchandiser)",
  "Farhana Yasmin (Accounts Executive)",
  "Rezaul Karim (Merchant Lead)",
  "Asif Iqbal (Assistant Merchandiser)",
];

export const INITIAL_BUYERS: MMBuyerMasterRecord[] = [
  {
    id: "byr-01",
    code: "BYR-001",
    buyerName: "H&M Hennes & Mauritz",
    country: "Sweden",
    address: "Mäster Samuelsgatan 46A, SE-106 38 Stockholm, Sweden",
    accountHolder: "Rashidul Islam (Head of Merchandising)",
    buyerSizes: ["XS", "S", "M", "L", "XL", "XXL"],
    departments: [
      {
        id: "dept-hm-01",
        departmentName: "Ladies Casual & Tops",
        accountHolder: "Md Zubayer Hossain Khan (Senior Merchant)",
        sizes: ["XS", "S", "M", "L", "XL"],
      },
      {
        id: "dept-hm-02",
        departmentName: "Mens Wear",
        accountHolder: "Rashidul Islam (Head of Merchandising)",
        sizes: ["S", "M", "L", "XL", "XXL", "3XL"],
      },
      {
        id: "dept-hm-03",
        departmentName: "Kids & Baby",
        accountHolder: "Parvej Mahmud (Assistant Merchant)",
        sizes: ["68", "74", "80", "86", "92", "98", "104"],
      },
    ],
    status: "Active",
    createdAt: "2026-10-15 10:00",
    updatedAt: "2026-10-15 10:00",
  },
  {
    id: "byr-02",
    code: "BYR-002",
    buyerName: "Zara (Inditex)",
    country: "Spain",
    address: "Avenida de la Diputación, Edificio Inditex, 15142 Arteixo, A Coruña, Spain",
    accountHolder: "Nafis Imtiaz (Senior Merchandiser)",
    buyerSizes: ["30", "32", "34", "36", "38", "XS", "S", "M", "L", "XL", "XXL"],
    departments: [
      {
        id: "dept-zr-01",
        departmentName: "Man Basic & Casual",
        accountHolder: "Nafis Imtiaz (Senior Merchandiser)",
        sizes: ["S", "M", "L", "XL", "XXL"],
      },
      {
        id: "dept-zr-02",
        departmentName: "TRF Collection",
        accountHolder: "Nafis Imtiaz (Senior Merchandiser)",
        sizes: ["XS", "S", "M", "L"],
      },
      {
        id: "dept-zr-03",
        departmentName: "Kids Outerwear",
        accountHolder: "Hanif Uddin (Merchandising Manager)",
        sizes: ["4-5Y", "6-7Y", "8-9Y", "10-12Y"],
      },
    ],
    status: "Active",
    createdAt: "2026-10-16 11:30",
    updatedAt: "2026-10-16 11:30",
  },
  {
    id: "byr-03",
    code: "BYR-003",
    buyerName: "Marks & Spencer",
    country: "United Kingdom",
    address: "Waterside House, 35 North Wharf Road, London W2 1NW, United Kingdom",
    accountHolder: "Tanvir Ahmed (Key Account Manager)",
    buyerSizes: ["8", "10", "12", "14", "16", "18", "20", "S", "M", "L", "XL"],
    departments: [
      {
        id: "dept-ms-01",
        departmentName: "Formal Menswear",
        accountHolder: "Tanvir Ahmed (Key Account Manager)",
        sizes: ["15", "15.5", "16", "16.5", "17", "17.5"],
      },
      {
        id: "dept-ms-02",
        departmentName: "Casualwear",
        accountHolder: "Parvej Mahmud (Assistant Merchant)",
        sizes: ["S", "M", "L", "XL", "2XL"],
      },
    ],
    status: "Active",
    createdAt: "2026-10-18 14:15",
    updatedAt: "2026-10-18 14:15",
  },
  {
    id: "byr-04",
    code: "BYR-004",
    buyerName: "MARLIN MEDIA",
    country: "United States",
    address: "1440 Broadway, 15th Floor, New York, NY 10018, USA",
    accountHolder: "Tanvir Ahmed (Key Account Manager)",
    buyerSizes: ["S", "M", "L", "XL", "XXL"],
    departments: [
      {
        id: "dept-mm-01",
        departmentName: "Mens Outerwear & Casual",
        accountHolder: "Tanvir Ahmed (Key Account Manager)",
        sizes: ["S", "M", "L", "XL", "XXL"],
      },
      {
        id: "dept-mm-02",
        departmentName: "Sportswear & Jackets",
        accountHolder: "Kazi Farhan (Senior Account Lead)",
        sizes: ["M", "L", "XL", "2XL"],
      },
    ],
    status: "Active",
    createdAt: "2026-10-20 09:40",
    updatedAt: "2026-10-20 09:40",
  },
  {
    id: "byr-05",
    code: "BYR-005",
    buyerName: "Next Retail Ltd",
    country: "United Kingdom",
    address: "Desford Road, Enderby, Leicester LE19 4AT, United Kingdom",
    accountHolder: "Kazi Farhan (Senior Account Lead)",
    buyerSizes: ["XS", "S", "M", "L", "XL", "XXL"],
    departments: [
      {
        id: "dept-nx-01",
        departmentName: "Men Jersey & Knits",
        accountHolder: "Kazi Farhan (Senior Account Lead)",
        sizes: ["S", "M", "L", "XL", "XXL"],
      },
      {
        id: "dept-nx-02",
        departmentName: "Childrenswear",
        accountHolder: "Parvej Mahmud (Assistant Merchant)",
        sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"],
      },
    ],
    status: "Active",
    createdAt: "2026-10-22 16:00",
    updatedAt: "2026-10-22 16:00",
  },
];

export const INITIAL_BUYER_SEASONS: MMBuyerSeasonRecord[] = [
  { id: "bs-01", code: "BS-001", buyerId: "byr-01", buyerName: "H&M Hennes & Mauritz", season: "Spring/Summer 2026", status: "Active", createdAt: "2026-10-15 10:00", updatedAt: "2026-10-15 10:00" },
  { id: "bs-02", code: "BS-002", buyerId: "byr-01", buyerName: "H&M Hennes & Mauritz", season: "Autumn/Winter 2026", status: "Active", createdAt: "2026-10-15 10:00", updatedAt: "2026-10-15 10:00" },
  { id: "bs-03", code: "BS-003", buyerId: "byr-01", buyerName: "H&M Hennes & Mauritz", season: "Summer 2027", status: "Active", createdAt: "2026-10-15 10:00", updatedAt: "2026-10-15 10:00" },
  { id: "bs-04", code: "BS-004", buyerId: "byr-02", buyerName: "Zara (Inditex)", season: "SS-26", status: "Active", createdAt: "2026-10-16 11:30", updatedAt: "2026-10-16 11:30" },
  { id: "bs-05", code: "BS-005", buyerId: "byr-02", buyerName: "Zara (Inditex)", season: "AW-26", status: "Active", createdAt: "2026-10-16 11:30", updatedAt: "2026-10-16 11:30" },
  { id: "bs-06", code: "BS-006", buyerId: "byr-02", buyerName: "Zara (Inditex)", season: "Pre-Fall 2026", status: "Active", createdAt: "2026-10-16 11:30", updatedAt: "2026-10-16 11:30" },
  { id: "bs-07", code: "BS-007", buyerId: "byr-03", buyerName: "Marks & Spencer", season: "Spring 2026", status: "Active", createdAt: "2026-10-18 14:15", updatedAt: "2026-10-18 14:15" },
  { id: "bs-08", code: "BS-008", buyerId: "byr-03", buyerName: "Marks & Spencer", season: "High Summer 2026", status: "Active", createdAt: "2026-10-18 14:15", updatedAt: "2026-10-18 14:15" },
  { id: "bs-09", code: "BS-009", buyerId: "byr-03", buyerName: "Marks & Spencer", season: "Autumn 2026", status: "Active", createdAt: "2026-10-18 14:15", updatedAt: "2026-10-18 14:15" },
  { id: "bs-10", code: "BS-010", buyerId: "byr-04", buyerName: "MARLIN MEDIA", season: "Fall/Winter 2026", status: "Active", createdAt: "2026-10-20 09:40", updatedAt: "2026-10-20 09:40" },
  { id: "bs-11", code: "BS-011", buyerId: "byr-04", buyerName: "MARLIN MEDIA", season: "Spring 2027", status: "Active", createdAt: "2026-10-20 09:40", updatedAt: "2026-10-20 09:40" },
  { id: "bs-12", code: "BS-012", buyerId: "byr-05", buyerName: "Next Retail Ltd", season: "SS-26", status: "Active", createdAt: "2026-10-22 16:00", updatedAt: "2026-10-22 16:00" },
  { id: "bs-13", code: "BS-013", buyerId: "byr-05", buyerName: "Next Retail Ltd", season: "AW-26", status: "Active", createdAt: "2026-10-22 16:00", updatedAt: "2026-10-22 16:00" },
];

export const INITIAL_BUYER_STYLES: MMBuyerStyleRecord[] = [
  { id: "bst-01", code: "BST-001", buyerId: "byr-01", buyerName: "H&M Hennes & Mauritz", style: "HM-KT-8841 (Ladies Ribbed Henley Neck T-Shirt)", status: "Active", createdAt: "2026-10-15 10:00", updatedAt: "2026-10-15 10:00" },
  { id: "bst-02", code: "BST-002", buyerId: "byr-01", buyerName: "H&M Hennes & Mauritz", style: "HM-KT-9022 (Basic Crewneck T-Shirt)", status: "Active", createdAt: "2026-10-15 10:00", updatedAt: "2026-10-15 10:00" },
  { id: "bst-03", code: "BST-003", buyerId: "byr-01", buyerName: "H&M Hennes & Mauritz", style: "HM-WV-3104 (Ladies Denim Jacket)", status: "Active", createdAt: "2026-10-15 10:00", updatedAt: "2026-10-15 10:00" },
  { id: "bst-04", code: "BST-004", buyerId: "byr-02", buyerName: "Zara (Inditex)", style: "ZR-WV-4019 (Men Slim Fit Cotton Twill Chino)", status: "Active", createdAt: "2026-10-16 11:30", updatedAt: "2026-10-16 11:30" },
  { id: "bst-05", code: "BST-005", buyerId: "byr-02", buyerName: "Zara (Inditex)", style: "ZR-KT-1120 (Men Oversized Heavyweight Tee)", status: "Active", createdAt: "2026-10-16 11:30", updatedAt: "2026-10-16 11:30" },
  { id: "bst-06", code: "BST-006", buyerId: "byr-03", buyerName: "Marks & Spencer", style: "MS-KT-5520 (Men Pique Polo Shirt)", status: "Active", createdAt: "2026-10-18 14:15", updatedAt: "2026-10-18 14:15" },
  { id: "bst-07", code: "BST-007", buyerId: "byr-03", buyerName: "Marks & Spencer", style: "MS-WV-7710 (Non-Iron Formal Shirt)", status: "Active", createdAt: "2026-10-18 14:15", updatedAt: "2026-10-18 14:15" },
  { id: "bst-08", code: "BST-008", buyerId: "byr-04", buyerName: "MARLIN MEDIA", style: "APEROL-BASEBALL-JACKET", status: "Active", createdAt: "2026-10-20 09:40", updatedAt: "2026-10-20 09:40" },
  { id: "bst-09", code: "BST-009", buyerId: "byr-04", buyerName: "MARLIN MEDIA", style: "MM-JK-402 (Varsity Wool Bomber)", status: "Active", createdAt: "2026-10-20 09:40", updatedAt: "2026-10-20 09:40" },
  { id: "bst-10", code: "BST-010", buyerId: "byr-05", buyerName: "Next Retail Ltd", style: "NX-KT-1020 (Men Slim Polo)", status: "Active", createdAt: "2026-10-22 16:00", updatedAt: "2026-10-22 16:00" },
  { id: "bst-11", code: "BST-011", buyerId: "byr-05", buyerName: "Next Retail Ltd", style: "NX-KT-3011 (Kids Raglan Tee)", status: "Active", createdAt: "2026-10-22 16:00", updatedAt: "2026-10-22 16:00" },
];

export const INITIAL_GMT_ITEMS: MMGmtItemRecord[] = [
  { id: "gmt-01", code: "GMT-001", name: "Basic T-Shirt", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "gmt-02", code: "GMT-002", name: "Polo Shirt", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "gmt-03", code: "GMT-003", name: "Formal Shirt", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "gmt-04", code: "GMT-004", name: "Casual Shirt", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "gmt-05", code: "GMT-005", name: "Hoodie", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "gmt-06", code: "GMT-006", name: "Sweatshirt", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "gmt-07", code: "GMT-007", name: "Jacket", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "gmt-08", code: "GMT-008", name: "Denim Pant / Jeans", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "gmt-09", code: "GMT-009", name: "Trouser / Chino", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "gmt-10", code: "GMT-010", name: "Jogger", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "gmt-11", code: "GMT-011", name: "Shorts", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "gmt-12", code: "GMT-012", name: "Tank Top", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "gmt-13", code: "GMT-013", name: "Baby Romper", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "gmt-14", code: "GMT-014", name: "Leggings", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
];

export const INITIAL_CATEGORIES: MMCategoryRecord[] = [
  { id: "cat-01", code: "CAT-001", name: "Men", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "cat-02", code: "CAT-002", name: "Women", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "cat-03", code: "CAT-003", name: "Kids", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "cat-04", code: "CAT-004", name: "Boys", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "cat-05", code: "CAT-005", name: "Girls", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "cat-06", code: "CAT-006", name: "Baby", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "cat-07", code: "CAT-007", name: "Infant", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "cat-08", code: "CAT-008", name: "Unisex", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "cat-09", code: "CAT-009", name: "Men's Plus Size", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "cat-10", code: "CAT-010", name: "Women's Plus Size", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "cat-11", code: "CAT-011", name: "Maternity", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "cat-12", code: "CAT-012", name: "Newborn", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
];

export const INITIAL_COLORS: MMColorRecord[] = [
  { id: "clr-01", code: "CLR-001", name: "Black", hexCode: "#000000", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "clr-02", code: "CLR-002", name: "White", hexCode: "#FFFFFF", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "clr-03", code: "CLR-003", name: "Navy Blue", hexCode: "#000080", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "clr-04", code: "CLR-004", name: "Heather Grey", hexCode: "#B2BEB5", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "clr-05", code: "CLR-005", name: "Charcoal", hexCode: "#36454F", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "clr-06", code: "CLR-006", name: "Olive Green", hexCode: "#808000", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "clr-07", code: "CLR-007", name: "Burgundy", hexCode: "#800020", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "clr-08", code: "CLR-008", name: "Royal Blue", hexCode: "#4169E1", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "clr-09", code: "CLR-009", name: "Beige", hexCode: "#F5F5DC", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "clr-10", code: "CLR-010", name: "Coral", hexCode: "#FF7F50", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "clr-11", code: "CLR-011", name: "Dusty Pink", hexCode: "#DCAE96", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "clr-12", code: "CLR-012", name: "Sky Blue", hexCode: "#87CEEB", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
];

export const INITIAL_COST_HEADS: MMCostHeadRecord[] = [
  // Fabric Category
  { id: "ch-01", code: "CH-001", category: "Fabric", costHead: "Main Fabric", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "ch-02", code: "CH-002", category: "Fabric", costHead: "Contrast Fabric", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "ch-03", code: "CH-003", category: "Fabric", costHead: "Rib Fabric", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "ch-04", code: "CH-004", category: "Fabric", costHead: "Collar & Cuff", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "ch-05", code: "CH-005", category: "Fabric", costHead: "Pocketing Fabric", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "ch-06", code: "CH-006", category: "Fabric", costHead: "Interlining / Fusing", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  // Accessorie Category
  { id: "ch-07", code: "CH-007", category: "Accessorie", costHead: "Sewing Thread", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "ch-08", code: "CH-008", category: "Accessorie", costHead: "Main Label", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "ch-09", code: "CH-009", category: "Accessorie", costHead: "Care & Wash Label", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "ch-10", code: "CH-010", category: "Accessorie", costHead: "Size Label", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "ch-11", code: "CH-011", category: "Accessorie", costHead: "Zipper", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "ch-12", code: "CH-012", category: "Accessorie", costHead: "Button", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "ch-13", code: "CH-013", category: "Accessorie", costHead: "Elastic", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "ch-14", code: "CH-014", category: "Accessorie", costHead: "Drawstring / Cord", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "ch-15", code: "CH-015", category: "Accessorie", costHead: "Polybag / Single Poly", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "ch-16", code: "CH-016", category: "Accessorie", costHead: "Hang Tag & Price Tag", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "ch-17", code: "CH-017", category: "Accessorie", costHead: "Master Carton", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  // Embellishment Category
  { id: "ch-18", code: "CH-018", category: "Embellishment", costHead: "Chest Print", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "ch-19", code: "CH-019", category: "Embellishment", costHead: "All Over Print (AOP)", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "ch-20", code: "CH-020", category: "Embellishment", costHead: "Embroidery", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "ch-21", code: "CH-021", category: "Embellishment", costHead: "Heat Transfer Foil", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "ch-22", code: "CH-022", category: "Embellishment", costHead: "Badge / Patch", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  // Others Category
  { id: "ch-23", code: "CH-023", category: "Others", costHead: "Commercial / Bank Cost", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "ch-24", code: "CH-024", category: "Others", costHead: "Lab Test / Inspection Charges", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "ch-25", code: "CH-025", category: "Others", costHead: "Freight / Transport", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "ch-26", code: "CH-026", category: "Others", costHead: "Washing / Dyeing Treatment", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "ch-27", code: "CH-027", category: "Others", costHead: "Factory Overhead (CM)", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
];

export const INITIAL_FABRIC_SETUPS: MMFabricSetupRecord[] = [
  {
    id: "fs-01",
    code: "FAB-001",
    fabricName: "Fabric 100% Combed Cotton Single Jersey 180 GSM Ring Half Feeder Hydrophilic Softener Wash Heatset Finish Solid Bio-washed combed cotton Knit Fabric",
    fabricComposition: "100% Combed Cotton",
    fabricType: "Single Jersey",
    gsm: 180,
    spinningType: "Ring",
    feederType: "Half Feeder",
    washType: "Hydrophilic Softener Wash",
    finishType: "Heatset Finish",
    colorType: "Solid",
    otherSpecs: "Bio-washed combed cotton",
    fabricCategory: "Knit Fabric",
    status: "Active",
    createdAt: "2026-10-15",
    updatedAt: "2026-10-15",
  },
  {
    id: "fs-02",
    code: "FAB-002",
    fabricName: "Fabric 100% Cotton 2x2 Rib 220 GSM Combed Hydrophilic Softener Wash Heatset Finish Y/D Bio-washed combed cotton Knit Fabric",
    fabricComposition: "100% Cotton",
    fabricType: "2x2 Rib",
    gsm: 220,
    spinningType: "Combed",
    feederType: "",
    washType: "Hydrophilic Softener Wash",
    finishType: "Heatset Finish",
    colorType: "Y/D",
    otherSpecs: "Bio-washed combed cotton",
    fabricCategory: "Knit Fabric",
    status: "Active",
    createdAt: "2026-10-16",
    updatedAt: "2026-10-16",
  },
  {
    id: "fs-03",
    code: "FAB-003",
    fabricName: "Fabric 95% Cotton 5% Spandex 1x1 Rib 200 GSM Ring Half Feeder Enzyme Wash Peach Finish Solid Knit Fabric",
    fabricComposition: "95% Cotton 5% Spandex",
    fabricType: "1x1 Rib",
    gsm: 200,
    spinningType: "Ring",
    feederType: "Half Feeder",
    washType: "Enzyme Wash",
    finishType: "Peach Finish",
    colorType: "Solid",
    otherSpecs: "",
    fabricCategory: "Knit Fabric",
    status: "Active",
    createdAt: "2026-10-17",
    updatedAt: "2026-10-17",
  },
  {
    id: "fs-04",
    code: "FAB-004",
    fabricName: "Fabric 60% Cotton 40% Polyester French Terry 260 GSM Carded Full Feeder Stone Wash Brush Finish Solid Brushed inside for softness Knit Fabric",
    fabricComposition: "60% Cotton 40% Polyester",
    fabricType: "French Terry",
    gsm: 260,
    spinningType: "Carded",
    feederType: "Full Feeder",
    washType: "Stone Wash",
    finishType: "Brush Finish",
    colorType: "Solid",
    otherSpecs: "Brushed inside for softness",
    fabricCategory: "Knit Fabric",
    status: "Active",
    createdAt: "2026-10-18",
    updatedAt: "2026-10-18",
  },
  {
    id: "fs-05",
    code: "FAB-005",
    fabricName: "Fabric 100% Cotton Pique 210 GSM Combed Panel Wash Moisture Wicking Finish Y/D Knit Fabric",
    fabricComposition: "100% Cotton",
    fabricType: "Pique",
    gsm: 210,
    spinningType: "Combed",
    feederType: "",
    washType: "Panel Wash",
    finishType: "Moisture Wicking Finish",
    colorType: "Y/D",
    otherSpecs: "",
    fabricCategory: "Knit Fabric",
    status: "Active",
    createdAt: "2026-10-20",
    updatedAt: "2026-10-20",
  },
];

export const INITIAL_ACCESSORIES_SETUPS: MMAccessoriesSetupRecord[] = [
  { id: "acc-01", code: "ACC-001", accessoriesName: "Sewing Thread", uom: "CONE", marketUnit: "CONE", relationFactor: 1, head: "Sewing Trims", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "acc-02", code: "ACC-002", accessoriesName: "Button", uom: "PCS", marketUnit: "Gross", relationFactor: 144, head: "Sewing Trims", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "acc-03", code: "ACC-003", accessoriesName: "Zipper", uom: "PCS", marketUnit: "DZN", relationFactor: 12, head: "Sewing Trims", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "acc-04", code: "ACC-004", accessoriesName: "Main Label", uom: "PCS", marketUnit: "DZN", relationFactor: 12, head: "Sewing Trims", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "acc-05", code: "ACC-005", accessoriesName: "Size Label", uom: "PCS", marketUnit: "DZN", relationFactor: 12, head: "Sewing Trims", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "acc-06", code: "ACC-006", accessoriesName: "Care Label", uom: "PCS", marketUnit: "DZN", relationFactor: 12, head: "Sewing Trims", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "acc-07", code: "ACC-007", accessoriesName: "Elastic", uom: "YDS", marketUnit: "ROLL", relationFactor: 50, head: "Sewing Trims", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "acc-08", code: "ACC-008", accessoriesName: "Hang Tag", uom: "PCS", marketUnit: "DZN", relationFactor: 12, head: "Finishing Trims", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "acc-09", code: "ACC-009", accessoriesName: "Price Tag", uom: "PCS", marketUnit: "DZN", relationFactor: 12, head: "Finishing Trims", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "acc-10", code: "ACC-010", accessoriesName: "Single Poly", uom: "PCS", marketUnit: "THS", relationFactor: 1000, head: "Finishing Trims", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "acc-11", code: "ACC-011", accessoriesName: "Blister Poly", uom: "PCS", marketUnit: "THS", relationFactor: 1000, head: "Finishing Trims", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "acc-12", code: "ACC-012", accessoriesName: "Master Carton", uom: "PCS", marketUnit: "PCS", relationFactor: 1, head: "Finishing Trims", status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
];

export const INITIAL_AOP_RATES: MMAopProcessRateRecord[] = [
  { id: "aop-01", code: "AOP-001", aopType: "Reactive", processLoss: 4.0, rate: 0.75, status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "aop-02", code: "AOP-002", aopType: "Digital", processLoss: 3.5, rate: 1.20, status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "aop-03", code: "AOP-003", aopType: "Flock", processLoss: 5.0, rate: 0.95, status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "aop-04", code: "AOP-004", aopType: "Discharge", processLoss: 4.5, rate: 0.85, status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "aop-05", code: "AOP-005", aopType: "Pigment", processLoss: 3.0, rate: 0.60, status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "aop-06", code: "AOP-006", aopType: "Burn Out", processLoss: 5.5, rate: 0.90, status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "aop-07", code: "AOP-007", aopType: "Glitter", processLoss: 4.0, rate: 0.80, status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "aop-08", code: "AOP-008", aopType: "Foil", processLoss: 4.5, rate: 0.88, status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "aop-09", code: "AOP-009", aopType: "Puff Print", processLoss: 4.0, rate: 0.78, status: "Active", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
];

// ----------------------------------------------------------------------------
// LocalStorage Persistence Keys & Master Repository
// ----------------------------------------------------------------------------

export const MM_MASTER_STORAGE_KEYS = {
  BUYER_NAME: "cripton_mm_buyer_master_v1",
  BUYER_SEASON: "cripton_mm_master_buyer_season_v1",
  BUYER_STYLE: "cripton_mm_master_buyer_style_v1",
  GMT_ITEM: "cripton_mm_master_gmt_item_v1",
  CATEGORY: "cripton_mm_master_category_v1",
  COLOR: "cripton_mm_master_color_v1",
  COST_HEAD: "cripton_mm_master_cost_head_v1",
  FABRIC_SETUP: "cripton_mm_master_fabric_setup_v1",
  ACCESSORIES_SETUP: "cripton_mm_master_accessories_setup_v1",
  AOP_PROCESS_RATE: "cripton_mm_master_aop_rate_v1",
  FABRIC_COMPOSITION: "cripton_mm_master_fabric_composition_v1",
  FABRIC_TYPE: "cripton_mm_master_fabric_type_v1",
  SPINNING_TYPE: "cripton_mm_master_spinning_type_v1",
  DYEING_RATE: "cripton_mm_master_dyeing_rate_v1",
  YARN_DYEING_RATE: "cripton_mm_yarn_dyeing_rates_v1",
  KNITTING_RATE: "cripton_mm_master_knitting_rate_v1",
  YARN_COUNT: "cripton_mm_master_yarn_count_v1",
  YARN_RATE: "cripton_mm_master_yarn_rate_v1",
};

export class MMMasterDataRepository {
  private static get<T>(key: string, defaultValue: T): T {
    if (typeof window === "undefined") return defaultValue;
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("Failed to save to localStorage:", key, e);
    }
  }

  // 0. Buyer Master
  static getBuyers(): MMBuyerMasterRecord[] {
    return this.get(MM_MASTER_STORAGE_KEYS.BUYER_NAME, INITIAL_BUYERS);
  }
  static saveBuyers(list: MMBuyerMasterRecord[]): void {
    this.set(MM_MASTER_STORAGE_KEYS.BUYER_NAME, list);
  }

  // 0.1 Buyer Season
  static getBuyerSeasons(): MMBuyerSeasonRecord[] {
    return this.get(MM_MASTER_STORAGE_KEYS.BUYER_SEASON, INITIAL_BUYER_SEASONS);
  }
  static saveBuyerSeasons(list: MMBuyerSeasonRecord[]): void {
    this.set(MM_MASTER_STORAGE_KEYS.BUYER_SEASON, list);
  }

  // 0.2 Buyer Style
  static getBuyerStyles(): MMBuyerStyleRecord[] {
    return this.get(MM_MASTER_STORAGE_KEYS.BUYER_STYLE, INITIAL_BUYER_STYLES);
  }
  static saveBuyerStyles(list: MMBuyerStyleRecord[]): void {
    this.set(MM_MASTER_STORAGE_KEYS.BUYER_STYLE, list);
  }

  // 0.3 GMT Item
  static getGmtItems(): MMGmtItemRecord[] {
    return this.get(MM_MASTER_STORAGE_KEYS.GMT_ITEM, INITIAL_GMT_ITEMS);
  }
  static saveGmtItems(list: MMGmtItemRecord[]): void {
    this.set(MM_MASTER_STORAGE_KEYS.GMT_ITEM, list);
  }

  // 0.4 Category
  static getCategories(): MMCategoryRecord[] {
    return this.get(MM_MASTER_STORAGE_KEYS.CATEGORY, INITIAL_CATEGORIES);
  }
  static saveCategories(list: MMCategoryRecord[]): void {
    this.set(MM_MASTER_STORAGE_KEYS.CATEGORY, list);
  }

  // 0.5 Color
  static getColors(): MMColorRecord[] {
    return this.get(MM_MASTER_STORAGE_KEYS.COLOR, INITIAL_COLORS);
  }
  static saveColors(list: MMColorRecord[]): void {
    this.set(MM_MASTER_STORAGE_KEYS.COLOR, list);
  }

  // 0.6 Cost Head
  static getCostHeads(): MMCostHeadRecord[] {
    return this.get(MM_MASTER_STORAGE_KEYS.COST_HEAD, INITIAL_COST_HEADS);
  }
  static saveCostHeads(list: MMCostHeadRecord[]): void {
    this.set(MM_MASTER_STORAGE_KEYS.COST_HEAD, list);
  }

  // 0.7 Fabric Setup
  static getFabricSetups(): MMFabricSetupRecord[] {
    const list = this.get(MM_MASTER_STORAGE_KEYS.FABRIC_SETUP, INITIAL_FABRIC_SETUPS);
    return list.map((fs) => ({
      ...fs,
      fabricName: fs.fabricName ? fs.fabricName.replace(/\s*\/\s*/g, " ") : fs.fabricName,
      fabricComposition: fs.fabricComposition ? fs.fabricComposition.replace(/\s*\/\s*/g, " ") : fs.fabricComposition,
    }));
  }
  static saveFabricSetups(list: MMFabricSetupRecord[]): void {
    this.set(MM_MASTER_STORAGE_KEYS.FABRIC_SETUP, list);
  }

  // 0.8 Accessories Setup
  static getAccessoriesSetups(): MMAccessoriesSetupRecord[] {
    return this.get(MM_MASTER_STORAGE_KEYS.ACCESSORIES_SETUP, INITIAL_ACCESSORIES_SETUPS);
  }
  static saveAccessoriesSetups(list: MMAccessoriesSetupRecord[]): void {
    this.set(MM_MASTER_STORAGE_KEYS.ACCESSORIES_SETUP, list);
  }

  // 0.9 AOP Process Rate
  static getAopProcessRates(): MMAopProcessRateRecord[] {
    return this.get(MM_MASTER_STORAGE_KEYS.AOP_PROCESS_RATE, INITIAL_AOP_RATES);
  }
  static saveAopProcessRates(list: MMAopProcessRateRecord[]): void {
    this.set(MM_MASTER_STORAGE_KEYS.AOP_PROCESS_RATE, list);
  }

  // 1. Fabric Composition
  static getFabricCompositions(): MMFabricComposition[] {
    const list = this.get(MM_MASTER_STORAGE_KEYS.FABRIC_COMPOSITION, INITIAL_FABRIC_COMPOSITIONS);
    return list.map((fc) => ({
      ...fc,
      name: fc.name ? fc.name.replace(/\s*\/\s*/g, " ") : fc.name,
    }));
  }
  static saveFabricCompositions(list: MMFabricComposition[]): void {
    this.set(MM_MASTER_STORAGE_KEYS.FABRIC_COMPOSITION, list);
  }

  // 2. Fabric Type
  static getFabricTypes(): MMFabricType[] {
    return this.get(MM_MASTER_STORAGE_KEYS.FABRIC_TYPE, INITIAL_FABRIC_TYPES);
  }
  static saveFabricTypes(list: MMFabricType[]): void {
    this.set(MM_MASTER_STORAGE_KEYS.FABRIC_TYPE, list);
  }

  // 3. Spinning Type
  static getSpinningTypes(): MMSpinningType[] {
    return this.get(MM_MASTER_STORAGE_KEYS.SPINNING_TYPE, INITIAL_SPINNING_TYPES);
  }
  static saveSpinningTypes(list: MMSpinningType[]): void {
    this.set(MM_MASTER_STORAGE_KEYS.SPINNING_TYPE, list);
  }

  // 4. Dyeing Rate
  static getDyeingRates(): MMDyeingRate[] {
    return this.get(MM_MASTER_STORAGE_KEYS.DYEING_RATE, INITIAL_DYEING_RATES);
  }
  static saveDyeingRates(list: MMDyeingRate[]): void {
    this.set(MM_MASTER_STORAGE_KEYS.DYEING_RATE, list);
  }

  // 4.1 Yarn Dyeing (Y/D) Rate
  static getYarnDyeingRates(): MMYarnDyeingRate[] {
    return this.get(MM_MASTER_STORAGE_KEYS.YARN_DYEING_RATE, INITIAL_YARN_DYEING_RATES);
  }
  static saveYarnDyeingRates(list: MMYarnDyeingRate[]): void {
    this.set(MM_MASTER_STORAGE_KEYS.YARN_DYEING_RATE, list);
  }

  // 5. Knitting Rate
  static getKnittingRates(): MMKnittingRate[] {
    return this.get(MM_MASTER_STORAGE_KEYS.KNITTING_RATE, INITIAL_KNITTING_RATES);
  }
  static saveKnittingRates(list: MMKnittingRate[]): void {
    this.set(MM_MASTER_STORAGE_KEYS.KNITTING_RATE, list);
  }

  // 6. Yarn Count
  static getYarnCounts(): MMYarnCount[] {
    return this.get(MM_MASTER_STORAGE_KEYS.YARN_COUNT, INITIAL_YARN_COUNTS);
  }
  static saveYarnCounts(list: MMYarnCount[]): void {
    this.set(MM_MASTER_STORAGE_KEYS.YARN_COUNT, list);
  }

  // 7. Yarn Rate
  static getYarnRates(): MMYarnRateWeeklyRecord[] {
    return this.get(MM_MASTER_STORAGE_KEYS.YARN_RATE, INITIAL_YARN_RATES);
  }
  static saveYarnRates(list: MMYarnRateWeeklyRecord[]): void {
    this.set(MM_MASTER_STORAGE_KEYS.YARN_RATE, list);
  }
}

/**
 * Helper to find matching Yarn Dyeing (Y/D) rate from master records.
 * Matches by Y/D Type, Color Shade, and Dyeing Method (case-insensitive, normalized).
 */
export function findMatchingYarnDyeingRate(
  rates: MMYarnDyeingRate[],
  ydType: string,
  colorShade: string,
  dyeingMethod: string
): MMYarnDyeingRate | undefined {
  if (!rates || rates.length === 0) return undefined;

  const tNorm = (ydType || "").trim().toLowerCase();
  const sNorm = (colorShade || "").trim().toLowerCase();
  const mNorm = (dyeingMethod || "").trim().toLowerCase();

  const normalizeMethod = (m: string) => {
    const l = m.toLowerCase().trim();
    if (l === "white dyeing") return "white wash";
    return l;
  };

  const normMethodVal = normalizeMethod(mNorm);

  return rates.find((r) => {
    if (r.status !== "Active") return false;
    const rType = r.ydType.trim().toLowerCase();
    const rShade = r.colorShade.trim().toLowerCase();
    const rMethod = normalizeMethod(r.dyeingMethod);
    return rType === tNorm && rShade === sNorm && rMethod === normMethodVal;
  });
}

