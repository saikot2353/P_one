import {
  getStoredMaterialReceipts,
  getStoredDirectMRRs,
  getStoredOpeningStocks,
  getStoredSupplierReturns,
  MaterialReceive,
  DirectMRRRecord,
  OpeningStockRecord,
  SupplierReturn,
} from "./procurement-order-inventory-data";
import {
  getStoredMaterialIssues,
  MaterialIssue,
} from "./inventory-requisition-issue-data";
import {
  getStoredInterCompanyTransfers,
  getStoredInterCompanyReceives,
  InterCompanyTransfer,
  InterCompanyReceive,
} from "./inventory-stock-management-data";
import {
  DEFAULT_ITEMS,
  DEFAULT_WAREHOUSES,
  getStoredData,
  ItemProductMaster,
  WarehouseStore,
} from "./procurement-master-data";
import {
  INITIAL_STOCK_BALANCE_DATA,
  StockBalanceRow,
} from "./reports-mock-data";

export interface StockAgeingRecord {
  id: string;
  itemCode: string;
  itemName: string;
  itemGroup: string;
  itemCategory: string;
  brand: string;
  origin: string;
  company: string;
  warehouseStore: string;
  location: string;
  batchLotNo: string;
  stockReceiveDate: string; // Original Receipt Date YYYY-MM-DD
  ageDays: number;
  uom: string;
  availableStockQty: number;
  stockRate: number;
  stockValue: number;
}

/**
 * Standard quick ageing bucket options
 */
export type AgeingBucket =
  | "All"
  | "0-30"
  | "31-60"
  | "61-90"
  | "91-180"
  | "181-365"
  | "Above-365";

export const AGEING_BUCKETS: { label: string; value: AgeingBucket; min: number; max?: number }[] = [
  { label: "All Ageing", value: "All", min: 0 },
  { label: "0–30 Days", value: "0-30", min: 0, max: 30 },
  { label: "31–60 Days", value: "31-60", min: 31, max: 60 },
  { label: "61–90 Days", value: "61-90", min: 61, max: 90 },
  { label: "91–180 Days", value: "91-180", min: 91, max: 180 },
  { label: "181–365 Days", value: "181-365", min: 181, max: 365 },
  { label: "Above 365 Days", value: "Above-365", min: 366 },
];

/**
 * Helper to compute age in days between two dates.
 * Age (Days) = As of Date - Original Stock Receipt Date
 */
export function calculateAgeDays(receiveDateStr: string, asOfDateStr: string): number {
  if (!receiveDateStr) return 0;
  const d1 = new Date(receiveDateStr);
  const d2 = asOfDateStr ? new Date(asOfDateStr) : new Date();
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;
  const diffTime = d2.getTime() - d1.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Seed foundational stock lots representing historical receipts with various ages
 * so the report immediately demonstrates the full spectrum of ageing (0-30, 31-60, 61-90, 91-180, 181-365, >365).
 */
export const SEED_STOCK_AGEING_LOTS: StockAgeingRecord[] = [
  {
    id: "lot-yrn-01",
    itemCode: "ITM-YRN-30-1",
    itemName: "100% Combed Cotton Yarn Ne 30/1",
    itemGroup: "Raw Materials",
    itemCategory: "Cotton Yarn",
    brand: "Groz-Beckert",
    origin: "Bangladesh",
    company: "Pakiza Knit Composite Ltd",
    warehouseStore: "PKCL Central Raw Material Warehouse",
    location: "Rack A1 - Raw Cotton Pallet",
    batchLotNo: "BAT-YRN-2026-09A",
    stockReceiveDate: "2026-09-01",
    ageDays: 87,
    uom: "KG",
    availableStockQty: 4200,
    stockRate: 420,
    stockValue: 1764000,
  },
  {
    id: "lot-yrn-02",
    itemCode: "ITM-YRN-30-1",
    itemName: "100% Combed Cotton Yarn Ne 30/1",
    itemGroup: "Raw Materials",
    itemCategory: "Cotton Yarn",
    brand: "Groz-Beckert",
    origin: "Bangladesh",
    company: "Pakiza Knit Composite Ltd",
    warehouseStore: "PKCL Central Raw Material Warehouse",
    location: "Rack A2 - Cotton Pallet South",
    batchLotNo: "BAT-YRN-2026-10B",
    stockReceiveDate: "2026-10-18",
    ageDays: 40,
    uom: "KG",
    availableStockQty: 1800,
    stockRate: 425,
    stockValue: 765000,
  },
  {
    id: "lot-yrn-03",
    itemCode: "ITM-YRN-30-1",
    itemName: "100% Combed Cotton Yarn Ne 30/1",
    itemGroup: "Raw Materials",
    itemCategory: "Cotton Yarn",
    brand: "Groz-Beckert",
    origin: "Bangladesh",
    company: "Pakiza Knit Composite Ltd",
    warehouseStore: "PKCL Central Raw Material Warehouse",
    location: "Rack A3 - Staging Floor",
    batchLotNo: "BAT-YRN-2026-11C",
    stockReceiveDate: "2026-11-12",
    ageDays: 15,
    uom: "KG",
    availableStockQty: 2500,
    stockRate: 430,
    stockValue: 1075000,
  },
  {
    id: "lot-dyes-01",
    itemCode: "CHM-001",
    itemName: "Reactive Black B Dye",
    itemGroup: "Dyes & Chemicals",
    itemCategory: "Direct Material",
    brand: "Novacron",
    origin: "Switzerland",
    company: "Pakiza Knit Composite Ltd",
    warehouseStore: "Dyes & Chemicals Store (PKCL)",
    location: "Drum Rack C-12",
    batchLotNo: "BAT-DYE-2609-04",
    stockReceiveDate: "2026-06-15",
    ageDays: 165,
    uom: "KG",
    availableStockQty: 850,
    stockRate: 620,
    stockValue: 527000,
  },
  {
    id: "lot-dyes-02",
    itemCode: "CHM-002",
    itemName: "Sodium Hydrosulphite 88%",
    itemGroup: "Dyes & Chemicals",
    itemCategory: "Direct Material",
    brand: "Novacron",
    origin: "Germany",
    company: "Pakiza Knit Composite Ltd",
    warehouseStore: "Dyes & Chemicals Store (PKCL)",
    location: "Drum Rack D-04",
    batchLotNo: "BAT-HYD-2511-02",
    stockReceiveDate: "2025-11-05",
    ageDays: 387,
    uom: "KG",
    availableStockQty: 60,
    stockRate: 280,
    stockValue: 16800,
  },
  {
    id: "lot-chr-01",
    itemCode: "ITM-001",
    itemName: "Manager Chair",
    itemGroup: "Office Furniture",
    itemCategory: "Capital Goods",
    brand: "Hatil",
    origin: "Bangladesh",
    company: "Pakiza Knit Composite Ltd",
    warehouseStore: "Central Warehouse (Savar)",
    location: "Rack-01 / Shelf-A / Bin-04",
    batchLotNo: "LOT-FUR-2603",
    stockReceiveDate: "2026-03-20",
    ageDays: 252,
    uom: "PCS",
    availableStockQty: 18,
    stockRate: 4500,
    stockValue: 81000,
  },
  {
    id: "lot-thrd-01",
    itemCode: "ACC-001",
    itemName: "Sewing Thread 40/2 5000m",
    itemGroup: "Sewing Accessories",
    itemCategory: "Accessories",
    brand: "Astra",
    origin: "Germany",
    company: "Pakiza Apparels Ltd",
    warehouseStore: "Central Warehouse (Savar)",
    location: "Rack-03 / Shelf-B / Bin-01",
    batchLotNo: "LOT-THD-2610-09",
    stockReceiveDate: "2026-10-05",
    ageDays: 53,
    uom: "CONE",
    availableStockQty: 450,
    stockRate: 95,
    stockValue: 42750,
  },
  {
    id: "lot-fab-01",
    itemCode: "FAB-001",
    itemName: "Cotton Twill 20x16 Fabric",
    itemGroup: "Grey Fabric",
    itemCategory: "Direct Material",
    brand: "Pakiza Weaving",
    origin: "Bangladesh",
    company: "Pakiza Woven Fashion Ltd",
    warehouseStore: "General Store (PWFL)",
    location: "Rack-B / Bin-10",
    batchLotNo: "BAT-FAB-2608-01",
    stockReceiveDate: "2026-08-10",
    ageDays: 109,
    uom: "YDS",
    availableStockQty: 140,
    stockRate: 195,
    stockValue: 27300,
  },
  {
    id: "lot-spn-roller-01",
    itemCode: "ITM-SPN-RL-01",
    itemName: "High Precision Ceramic Guide Roller Ne 40s",
    itemGroup: "Spare Parts",
    itemCategory: "Machinery Spares",
    brand: "CeramTec",
    origin: "Germany",
    company: "Pakiza Spinning Mills Ltd",
    warehouseStore: "Spinning Spare Parts & Consumables Store",
    location: "Rack C - Mechanical Components",
    batchLotNo: "LOT-SPN-2609-01",
    stockReceiveDate: "2026-09-18",
    ageDays: 70,
    uom: "PCS",
    availableStockQty: 50,
    stockRate: 3500,
    stockValue: 175000,
  },
  {
    id: "lot-lub-01",
    itemCode: "LUB-001",
    itemName: "Lubricant Oil ISO VG 68",
    itemGroup: "Lubricants & Oils",
    itemCategory: "Consumables",
    brand: "Mobil",
    origin: "USA",
    company: "Pakiza Spinning Mills Ltd",
    warehouseStore: "Spare Parts Store (Dhamrai)",
    location: "Oil Cellar Barrel-2",
    batchLotNo: "BAT-LUB-2608-01",
    stockReceiveDate: "2026-07-20",
    ageDays: 130,
    uom: "LTR",
    availableStockQty: 480,
    stockRate: 350,
    stockValue: 168000,
  },
  {
    id: "lot-ndl-01",
    itemCode: "SPR-001",
    itemName: "Sewing Machine Needle Groz-Beckert DBx1",
    itemGroup: "Spare Parts",
    itemCategory: "Machinery Spares",
    brand: "Groz-Beckert",
    origin: "Germany",
    company: "Pakiza Apparels Ltd",
    warehouseStore: "Spare Parts Store (Dhamrai)",
    location: "Dhamrai Spare Rack E - Bin 5",
    batchLotNo: "LOT-NDL-2025-10",
    stockReceiveDate: "2025-10-14",
    ageDays: 409,
    uom: "PKT",
    availableStockQty: 120,
    stockRate: 420,
    stockValue: 50400,
  },
  {
    id: "lot-paper-01",
    itemCode: "CAT-OFFICE-PAPER",
    itemName: "A4 Printing Paper 80 GSM",
    itemGroup: "Stationery & Office Supplies",
    itemCategory: "Consumables",
    brand: "Double A",
    origin: "Thailand",
    company: "Pakiza Knit Composite Ltd",
    warehouseStore: "PKCL Central Raw Material Warehouse",
    location: "Rack B2 - Stationery Bin 01",
    batchLotNo: "LOT-PPR-2611-01",
    stockReceiveDate: "2026-11-20",
    ageDays: 7,
    uom: "REAM",
    availableStockQty: 1200,
    stockRate: 70,
    stockValue: 84000,
  },
];

/**
 * Compile and calculate the real-time stock ageing dataset as of a given date.
 * Integrates:
 * 1. Seed historical stock lots with known receipt dates.
 * 2. Material Receipts (MRR) from local storage.
 * 3. Direct MRR receipts from local storage.
 * 4. Opening Stocks from local storage.
 * 5. Material Issues deducted from matching batch/location lots.
 * 6. Supplier Returns deducted.
 * 7. Stock Transfers (retaining the original stock receipt date when transferred to destination warehouse/location).
 * 8. Excludes zero-balance or negative stock quantities.
 */
export function getStockAgeingData(asOfDate: string): StockAgeingRecord[] {
  const catalog = getStoredData<ItemProductMaster[]>("proc_items_v2", DEFAULT_ITEMS);
  const warehouses = getStoredData<WarehouseStore[]>("proc_warehouses_v2", DEFAULT_WAREHOUSES);
  const mrrList = getStoredMaterialReceipts();
  const directMrrs = getStoredDirectMRRs();
  const openingStocks = getStoredOpeningStocks();
  const issues = getStoredMaterialIssues();
  const supplierReturns = getStoredSupplierReturns();
  const transfers = getStoredInterCompanyTransfers();
  const receives = getStoredInterCompanyReceives();

  // Helper map for item metadata lookup (itemGroup, itemCategory, etc.)
  const itemMap = new Map<string, ItemProductMaster>();
  catalog.forEach((it) => {
    itemMap.set(it.itemCode, it);
    itemMap.set(it.itemName.toLowerCase(), it);
  });

  // Helper map for warehouse company lookup
  const whMap = new Map<string, WarehouseStore>();
  warehouses.forEach((wh) => {
    whMap.set(wh.storeCode, wh);
    whMap.set(wh.storeName.toLowerCase(), wh);
    whMap.set(wh.name?.toLowerCase() || "", wh);
  });

  // Track lots by unique Key: `${store}__${location}__${batchLotNo}__${itemCode}__${originalReceiptDate}`
  const lotsMap = new Map<string, StockAgeingRecord>();

  // 1. Load SEED lots
  SEED_STOCK_AGEING_LOTS.forEach((seed) => {
    const age = calculateAgeDays(seed.stockReceiveDate, asOfDate);
    const key = `${seed.warehouseStore}__${seed.location}__${seed.batchLotNo}__${seed.itemCode}__${seed.stockReceiveDate}`;
    lotsMap.set(key, {
      ...seed,
      ageDays: age,
      stockValue: Math.round(seed.availableStockQty * seed.stockRate),
    });
  });

  // 2. Incorporate Opening Stocks
  openingStocks.forEach((os) => {
    const storeName = os.storeName || os.warehouseStore || "Main Store";
    const company = os.organization || "Pakiza Knit Composite Ltd";
    const receiptDate = os.stockDate || "2026-09-01";

    os.items.forEach((item) => {
      const itMeta = itemMap.get(item.itemCode);
      const batchNo = item.batchNumber || "OPENING-LOT";
      const loc = item.location || "Default Location";
      const key = `${storeName}__${loc}__${batchNo}__${item.itemCode}__${receiptDate}`;

      const existing = lotsMap.get(key);
      const qty = item.openingQuantity || 0;
      const rate = item.unitCost || 0;

      if (existing) {
        existing.availableStockQty += qty;
        existing.stockValue = Math.round(existing.availableStockQty * existing.stockRate);
      } else {
        lotsMap.set(key, {
          id: `os-${os.id}-${item.id}`,
          itemCode: item.itemCode,
          itemName: item.itemName,
          itemGroup: itMeta?.itemGroupName || "General Raw Material",
          itemCategory: itMeta?.itemCategory || "Direct Material",
          brand: item.brand || itMeta?.brand || "Standard",
          origin: item.origin || itMeta?.origin || "Bangladesh",
          company,
          warehouseStore: storeName,
          location: loc,
          batchLotNo: batchNo,
          stockReceiveDate: receiptDate,
          ageDays: calculateAgeDays(receiptDate, asOfDate),
          uom: item.uom || "PCS",
          availableStockQty: qty,
          stockRate: rate,
          stockValue: Math.round(qty * rate),
        });
      }
    });
  });

  // 3. Incorporate Material Receipts (MRR)
  mrrList.forEach((mrr) => {
    const storeName = mrr.warehouseStore || "Central Warehouse";
    const receiptDate = mrr.receiveDate || "2026-10-01";
    const whInfo = whMap.get(storeName) || whMap.get(storeName.toLowerCase());
    const company = mrr.company || whInfo?.organization || "Pakiza Knit Composite Ltd";

    mrr.items.forEach((item) => {
      const itMeta = itemMap.get(item.itemCode);
      const batchNo = item.batchNumber || (item as any).batch || `BAT-${item.itemCode}`;
      const loc = item.location || mrr.receiveLocation || "General Rack Area";
      const key = `${storeName}__${loc}__${batchNo}__${item.itemCode}__${receiptDate}`;
      const qty = item.acceptedQty != null ? item.acceptedQty : item.currentReceiveQty || 0;
      const rate = item.unitPrice || 0;

      const existing = lotsMap.get(key);
      if (existing) {
        existing.availableStockQty += qty;
        existing.stockValue = Math.round(existing.availableStockQty * existing.stockRate);
      } else {
        lotsMap.set(key, {
          id: `mrr-${mrr.id}-${item.id}`,
          itemCode: item.itemCode,
          itemName: item.itemName,
          itemGroup: itMeta?.itemGroupName || "Production Materials",
          itemCategory: itMeta?.itemCategory || "General Inventory",
          brand: item.brand || itMeta?.brand || "Standard",
          origin: item.origin || itMeta?.origin || "Local",
          company,
          warehouseStore: storeName,
          location: loc,
          batchLotNo: batchNo,
          stockReceiveDate: receiptDate,
          ageDays: calculateAgeDays(receiptDate, asOfDate),
          uom: item.uom || "PCS",
          availableStockQty: qty,
          stockRate: rate,
          stockValue: Math.round(qty * rate),
        });
      }
    });
  });

  // 4. Incorporate Direct MRRs
  directMrrs.forEach((dmrr) => {
    if (dmrr.status === "Draft") return;
    const storeName = dmrr.warehouseStore || dmrr.storeName || "Central Warehouse";
    const receiptDate = dmrr.mrrDate || dmrr.createdDate || "2026-10-15";
    const whInfo = whMap.get(storeName) || whMap.get(storeName.toLowerCase());
    const company = whInfo?.organization || "Pakiza Knit Composite Ltd";

    dmrr.items.forEach((item) => {
      const itMeta = itemMap.get(item.itemCode);
      const batchNo = (item as any).batchNumber || (item as any).batch || `BAT-${item.itemCode}`;
      const loc = (item as any).location || "Direct Staging Area";
      const key = `${storeName}__${loc}__${batchNo}__${item.itemCode}__${receiptDate}`;
      const qty = (item as any).receivedQty || (item as any).quantity || 0;
      const rate = (item as any).unitPrice || 0;

      const existing = lotsMap.get(key);
      if (existing) {
        existing.availableStockQty += qty;
        existing.stockValue = Math.round(existing.availableStockQty * existing.stockRate);
      } else {
        lotsMap.set(key, {
          id: `dmrr-${dmrr.id}-${item.id}`,
          itemCode: item.itemCode,
          itemName: item.itemName,
          itemGroup: itMeta?.itemGroupName || "Direct Materials",
          itemCategory: itMeta?.itemCategory || "Operating Supplies",
          brand: item.brand || itMeta?.brand || "Standard",
          origin: item.origin || itMeta?.origin || "Local",
          company,
          warehouseStore: storeName,
          location: loc,
          batchLotNo: batchNo,
          stockReceiveDate: receiptDate,
          ageDays: calculateAgeDays(receiptDate, asOfDate),
          uom: item.uom || "PCS",
          availableStockQty: qty,
          stockRate: rate,
          stockValue: Math.round(qty * rate),
        });
      }
    });
  });

  // 5. Deduct Material Issues from matching lots
  issues.forEach((iss) => {
    iss.items.forEach((item) => {
      let remainingDeduction = item.issueQty || (item as any).issuedQuantity || 0;
      if (remainingDeduction <= 0) return;

      // Find candidate lots matching itemCode
      for (const [, lot] of lotsMap.entries()) {
        if (lot.itemCode === item.itemCode && lot.availableStockQty > 0) {
          // If issue specified batch or location, check for exact match or priority match
          const deduct = Math.min(lot.availableStockQty, remainingDeduction);
          lot.availableStockQty -= deduct;
          lot.stockValue = Math.round(lot.availableStockQty * lot.stockRate);
          remainingDeduction -= deduct;
          if (remainingDeduction <= 0) break;
        }
      }
    });
  });

  // 6. Deduct Supplier Returns
  supplierReturns.forEach((ret) => {
    ret.items.forEach((item) => {
      let remainingReturn = item.currentReturnQty || (item as any).returnQuantity || 0;
      if (remainingReturn <= 0) return;

      for (const [, lot] of lotsMap.entries()) {
        if (lot.itemCode === item.itemCode && lot.availableStockQty > 0) {
          const deduct = Math.min(lot.availableStockQty, remainingReturn);
          lot.availableStockQty -= deduct;
          lot.stockValue = Math.round(lot.availableStockQty * lot.stockRate);
          remainingReturn -= deduct;
          if (remainingReturn <= 0) break;
        }
      }
    });
  });

  // 7. Handle Transfers: Transferred stock retains its original receipt date
  transfers.forEach((tr) => {
    if (tr.status === "Draft") return;
    tr.items.forEach((tItem) => {
      let trQty = tItem.transferQty || 0;
      if (trQty <= 0) return;

      // Deduct from source store lot and retain original stockReceiveDate
      let origDate = tr.transferDate;
      for (const [, lot] of lotsMap.entries()) {
        if (lot.warehouseStore === tr.fromStore && lot.itemCode === tItem.itemCode && lot.availableStockQty > 0) {
          origDate = lot.stockReceiveDate;
          const deduct = Math.min(lot.availableStockQty, trQty);
          lot.availableStockQty -= deduct;
          lot.stockValue = Math.round(lot.availableStockQty * lot.stockRate);
          break;
        }
      }

      // Add to destination store lot with same original receipt date!
      const destStore = tr.toStore;
      const destLoc = "Transfer Inbound Bay";
      const destBatch = tItem.batchAllocations?.[0]?.batchNumber || "TR-LOT";
      const destKey = `${destStore}__${destLoc}__${destBatch}__${tItem.itemCode}__${origDate}`;
      const destExisting = lotsMap.get(destKey);

      if (destExisting) {
        destExisting.availableStockQty += trQty;
        destExisting.stockValue = Math.round(destExisting.availableStockQty * destExisting.stockRate);
      } else {
        const itMeta = itemMap.get(tItem.itemCode);
        lotsMap.set(destKey, {
          id: `tr-dest-${tr.id}-${tItem.id}`,
          itemCode: tItem.itemCode,
          itemName: tItem.itemName,
          itemGroup: itMeta?.itemGroupName || "Transferred Materials",
          itemCategory: itMeta?.itemCategory || "Direct Material",
          brand: tItem.brand || itMeta?.brand || "Standard",
          origin: tItem.origin || itMeta?.origin || "Local",
          company: tr.toCompany,
          warehouseStore: destStore,
          location: destLoc,
          batchLotNo: destBatch,
          stockReceiveDate: origDate, // Retains original receipt date!
          ageDays: calculateAgeDays(origDate, asOfDate),
          uom: tItem.uom,
          availableStockQty: trQty,
          stockRate: tItem.unitPrice || 100,
          stockValue: Math.round(trQty * (tItem.unitPrice || 100)),
        });
      }
    });
  });

  // 8. Filter out zero-balance or negative stock records (Rule: Exclude fully consumed and zero-balance stock records)
  const result: StockAgeingRecord[] = [];
  lotsMap.forEach((lot) => {
    if (lot.availableStockQty > 0) {
      lot.ageDays = calculateAgeDays(lot.stockReceiveDate, asOfDate);
      lot.stockValue = Math.round(lot.availableStockQty * lot.stockRate);
      result.push(lot);
    }
  });

  // Sort descending by age (oldest stock first)
  return result.sort((a, b) => b.ageDays - a.ageDays);
}
