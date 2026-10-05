// src/lib/item-tracking-utils.ts
// Unified item-level tracking configuration and master location/batch helpers

import { getStoredData, setStoredData, DEFAULT_ITEMS, DEFAULT_STORE_LOCATIONS, ItemProductMaster, StoreLocation } from "./procurement-master-data";

export type ItemTrackingMode = "Batch" | "Location" | "None";

/**
 * Determine whether an item has Batch Tracking enabled, Location Tracking enabled, or None.
 * An item can only have one configuration enabled (Batch or Location).
 */
export function getItemTrackingMode(itemCodeOrId: string, itemsList?: ItemProductMaster[]): ItemTrackingMode {
  if (!itemCodeOrId) return "None";
  const list = itemsList && itemsList.length > 0 ? itemsList : getStoredData<ItemProductMaster[]>("proc_items_v2", DEFAULT_ITEMS);
  const it = list.find((item) =>
    item.itemCode === itemCodeOrId ||
    item.id === itemCodeOrId ||
    item.itemName?.toLowerCase() === itemCodeOrId.toLowerCase() ||
    item.itemCode?.toLowerCase() === itemCodeOrId.toLowerCase() ||
    itemCodeOrId.toLowerCase().includes(item.itemCode.toLowerCase()) ||
    item.itemCode.toLowerCase().includes(itemCodeOrId.toLowerCase())
  );
  
  if (it) {
    if (it.batchTrackingRequired) return "Batch";
    if (it.serialNumberTrackingRequired || (it as any).locationTrackingEnabled || it.defaultBin) return "Location";
  }

  // Fallback search in DEFAULT_ITEMS if custom list didn't match
  const fallback = DEFAULT_ITEMS.find((item) =>
    item.itemCode === itemCodeOrId ||
    item.id === itemCodeOrId ||
    item.itemName?.toLowerCase() === itemCodeOrId.toLowerCase() ||
    item.itemCode?.toLowerCase() === itemCodeOrId.toLowerCase() ||
    itemCodeOrId.toLowerCase().includes(item.itemCode.toLowerCase()) ||
    item.itemCode.toLowerCase().includes(itemCodeOrId.toLowerCase())
  );
  if (fallback) {
    if (fallback.batchTrackingRequired) return "Batch";
    if (fallback.serialNumberTrackingRequired || (fallback as any).locationTrackingEnabled || fallback.defaultBin) return "Location";
  }

  // Fallback heuristics for known demo catalog / pattern items so demo items never show N/A
  const norm = itemCodeOrId.toLowerCase();
  if (
    norm.includes("yrn") ||
    norm.includes("yarn") ||
    norm.includes("bat") ||
    norm.includes("batch") ||
    norm.includes("dye") ||
    norm.includes("cotton") ||
    norm.includes("fab") ||
    norm.includes("knit")
  ) {
    return "Batch";
  }

  // Strict rule: Every inventory item is tracked by either Batch (B) or Location (L), never N/A or None
  return "Location";
}

/**
 * Get available locations from Location Configuration for a specific store/warehouse.
 */
export function getLocationsForStore(storeNameOrCode: string): StoreLocation[] {
  const allLocations = getStoredData<StoreLocation[]>("proc_locations_v2", DEFAULT_STORE_LOCATIONS);
  const locationList = allLocations.filter((l) => l.trackingMode === "Location" || l.locationTrackingEnabled);
  
  if (!storeNameOrCode) return locationList;
  const storeNormalized = storeNameOrCode.trim().toLowerCase();
  
  const matched = locationList.filter((l) => {
    const lStore = (l.store || "").trim().toLowerCase();
    const lWh = (l.warehouseCode || "").trim().toLowerCase();
    return lStore === storeNormalized || lWh === storeNormalized || storeNormalized.includes(lStore) || lStore.includes(storeNormalized);
  });

  return matched.length > 0 ? matched : locationList;
}

/**
 * Get available batches from Batch/Location Configuration for a specific store/warehouse.
 */
export function getBatchesForStore(storeNameOrCode: string, itemCode?: string): StoreLocation[] {
  const allLocations = getStoredData<StoreLocation[]>("proc_locations_v2", DEFAULT_STORE_LOCATIONS);
  const batchList = allLocations.filter((l) => l.trackingMode === "Batch" || l.batchTrackingEnabled || Boolean(l.batchNumbering));
  
  if (!storeNameOrCode) return batchList;
  const storeNormalized = storeNameOrCode.trim().toLowerCase();
  
  const matched = batchList.filter((b) => {
    const bStore = (b.store || "").trim().toLowerCase();
    const bWh = (b.warehouseCode || "").trim().toLowerCase();
    return bStore === storeNormalized || bWh === storeNormalized || storeNormalized.includes(bStore) || bStore.includes(storeNormalized);
  });

  return matched.length > 0 ? matched : batchList;
}

/**
 * Create and persist a new Location against the active Store/Warehouse into Location Configuration.
 */
export function createAndSaveNewLocation(params: {
  store: string;
  locationName: string;
  locationCode?: string;
  locationType?: "Rack" | "Shelf" | "Bin" | "Floor" | "Other";
}): StoreLocation {
  const all = getStoredData<StoreLocation[]>("proc_locations_v2", DEFAULT_STORE_LOCATIONS);
  const newLocation: StoreLocation = {
    id: `loc-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    trackingMode: "Location",
    locationTrackingEnabled: true,
    batchTrackingEnabled: false,
    store: params.store,
    warehouseCode: params.store,
    locationCode: params.locationCode?.trim() || `LOC-${Math.floor(100 + Math.random() * 900)}`,
    locationName: params.locationName.trim(),
    locationType: params.locationType || "Rack",
    locationStatus: "Active",
    batchNumbering: "",
    createDate: new Date().toISOString().slice(0, 10),
    expireDate: "",
    batchStatus: "Inactive",
    status: "Active",
  };

  const updated = [newLocation, ...all];
  setStoredData("proc_locations_v2", updated);
  return newLocation;
}

/**
 * Create and persist a new Batch against the active Store/Warehouse and Item into Batch Configuration.
 */
export function createAndSaveNewBatch(params: {
  store: string;
  itemCode?: string;
  itemName?: string;
  batchNumber: string;
  createDate?: string;
  expireDate?: string;
}): StoreLocation {
  const all = getStoredData<StoreLocation[]>("proc_locations_v2", DEFAULT_STORE_LOCATIONS);
  const today = new Date().toISOString().slice(0, 10);
  const nextYear = `${new Date().getFullYear() + 1}-12-31`;
  
  const newBatch: StoreLocation = {
    id: `batch-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    trackingMode: "Batch",
    locationTrackingEnabled: false,
    batchTrackingEnabled: true,
    store: params.store,
    warehouseCode: params.store,
    locationCode: "",
    locationName: "",
    locationType: "Bin",
    locationStatus: "Inactive",
    batchNumbering: params.batchNumber.trim(),
    createDate: params.createDate || today,
    expireDate: params.expireDate || nextYear,
    batchStatus: "Active",
    status: "Active",
  };

  const updated = [newBatch, ...all];
  setStoredData("proc_locations_v2", updated);
  return newBatch;
}
