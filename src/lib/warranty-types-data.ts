export interface WarrantyTypeRecord {
  id: string;
  warrantyType: string;
  description: string;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt?: string;
}

export const STORAGE_KEY_WARRANTY_TYPES = "cripton_warranty_types";

export const DEFAULT_WARRANTY_TYPES: WarrantyTypeRecord[] = [
  {
    id: "wt-1",
    warrantyType: "Standard Manufacturer Warranty",
    description: "Factory original warranty covering mechanical and operational defects under standard operating conditions.",
    status: "Active",
    createdAt: "2026-01-10",
  },
  {
    id: "wt-2",
    warrantyType: "Extended Service Warranty",
    description: "Extended coverage after standard warranty expiry including routine bi-monthly service checkups.",
    status: "Active",
    createdAt: "2026-02-15",
  },
  {
    id: "wt-3",
    warrantyType: "On-site Labor & Maintenance Warranty",
    description: "Comprehensive on-site troubleshooting, breakdown repairs, and technician labor without callout charges.",
    status: "Active",
    createdAt: "2026-03-01",
  },
  {
    id: "wt-4",
    warrantyType: "Replacement Warranty",
    description: "Direct 1-to-1 immediate replacement of critical units in case of unrepairable component failure.",
    status: "Active",
    createdAt: "2026-04-12",
  },
  {
    id: "wt-5",
    warrantyType: "Defects Liability Warranty",
    description: "Civil and mechanical contractor liability during the designated 12-month defect notification period.",
    status: "Active",
    createdAt: "2026-05-20",
  },
  {
    id: "wt-6",
    warrantyType: "Legacy Equipment Warranty",
    description: "Discontinued coverage model for phased-out machinery and legacy workshop equipment.",
    status: "Inactive",
    createdAt: "2025-11-05",
  },
];

export function getStoredWarrantyTypes(): WarrantyTypeRecord[] {
  if (typeof window === "undefined") return DEFAULT_WARRANTY_TYPES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WARRANTY_TYPES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_WARRANTY_TYPES, JSON.stringify(DEFAULT_WARRANTY_TYPES));
      return DEFAULT_WARRANTY_TYPES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_WARRANTY_TYPES;
  } catch {
    return DEFAULT_WARRANTY_TYPES;
  }
}

export function saveStoredWarrantyTypes(records: WarrantyTypeRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_WARRANTY_TYPES, JSON.stringify(records));
  } catch (err) {
    console.error("Failed to save warranty types to localStorage", err);
  }
}

export function getActiveWarrantyTypes(): WarrantyTypeRecord[] {
  return getStoredWarrantyTypes().filter((w) => w.status === "Active");
}

