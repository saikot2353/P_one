// src/lib/procurement-config-data.ts
// Persistent company-level Procurement Configuration rules

export interface ProcurementCompanyConfig {
  id: string;
  companyName: string;
  allowMultipleCategories: boolean; // Setting determines whether multiple item categories are allowed in PR & PO
  isCSRequired: boolean; // Setting determines whether a Comparative Statement (CS) is required for PO creation
  updatedAt?: string;
  updatedBy?: string;
}

const STORAGE_KEY = "cripton_procurement_company_config";

export const DEFAULT_PROCUREMENT_CONFIGS: ProcurementCompanyConfig[] = [
  {
    id: "cfg-pakiza-knit",
    companyName: "Pakiza Knit Composite Ltd",
    allowMultipleCategories: false, // Default: single category per requisition/order
    isCSRequired: true, // Default: CS is required
    updatedAt: "2026-10-29 10:00",
    updatedBy: "System Administrator",
  },
  {
    id: "cfg-pakiza-apparels",
    companyName: "Pakiza Apparels Ltd",
    allowMultipleCategories: true,
    isCSRequired: true,
    updatedAt: "2026-10-29 10:00",
    updatedBy: "System Administrator",
  },
  {
    id: "cfg-pakiza-spinning",
    companyName: "Pakiza Spinning Mills Ltd",
    allowMultipleCategories: false,
    isCSRequired: false,
    updatedAt: "2026-10-29 10:00",
    updatedBy: "System Administrator",
  },
];

export function getStoredProcurementConfigs(): ProcurementCompanyConfig[] {
  if (typeof window === "undefined") return DEFAULT_PROCUREMENT_CONFIGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROCUREMENT_CONFIGS));
      return DEFAULT_PROCUREMENT_CONFIGS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PROCUREMENT_CONFIGS;
  }
}

export function setStoredProcurementConfigs(configs: ProcurementCompanyConfig[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
    window.dispatchEvent(new Event("procurement_config_updated"));
  } catch (err) {
    console.error("Failed to persist procurement configs:", err);
  }
}

export function getEffectiveProcurementConfig(companyName?: string): ProcurementCompanyConfig {
  const configs = getStoredProcurementConfigs();
  if (companyName) {
    const found = configs.find(
      (c) => c.companyName.trim().toLowerCase() === companyName.trim().toLowerCase()
    );
    if (found) return found;
  }
  return configs[0] || DEFAULT_PROCUREMENT_CONFIGS[0];
}

export function updateProcurementConfig(
  companyName: string,
  updates: Partial<ProcurementCompanyConfig>
): ProcurementCompanyConfig {
  const configs = getStoredProcurementConfigs();
  const index = configs.findIndex(
    (c) => c.companyName.trim().toLowerCase() === companyName.trim().toLowerCase()
  );

  let updatedRecord: ProcurementCompanyConfig;
  if (index >= 0) {
    updatedRecord = {
      ...configs[index],
      ...updates,
      companyName,
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    configs[index] = updatedRecord;
  } else {
    updatedRecord = {
      id: `cfg-${Date.now()}`,
      companyName,
      allowMultipleCategories: updates.allowMultipleCategories ?? false,
      isCSRequired: updates.isCSRequired ?? true,
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      updatedBy: updates.updatedBy || "System Administrator",
      ...updates,
    };
    configs.unshift(updatedRecord);
  }

  setStoredProcurementConfigs(configs);
  return updatedRecord;
}
