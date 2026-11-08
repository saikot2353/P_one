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

export type FeederTypeOption = "Half Feeder" | "Full Feeder";
export const FEEDER_TYPES: FeederTypeOption[] = ["Half Feeder", "Full Feeder"];

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
    name: "60% Cotton / 40% Polyester",
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
    name: "95% Cotton / 5% Spandex",
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
    name: "60% Cotton / 35% Polyester / 5% Spandex",
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
    name: "80% Cotton / 20% Polyester",
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

// ----------------------------------------------------------------------------
// LocalStorage Persistence Keys & Master Repository
// ----------------------------------------------------------------------------

export const MM_MASTER_STORAGE_KEYS = {
  FABRIC_COMPOSITION: "cripton_mm_master_fabric_composition_v1",
  FABRIC_TYPE: "cripton_mm_master_fabric_type_v1",
  SPINNING_TYPE: "cripton_mm_master_spinning_type_v1",
  DYEING_RATE: "cripton_mm_master_dyeing_rate_v1",
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

  // 1. Fabric Composition
  static getFabricCompositions(): MMFabricComposition[] {
    return this.get(MM_MASTER_STORAGE_KEYS.FABRIC_COMPOSITION, INITIAL_FABRIC_COMPOSITIONS);
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
