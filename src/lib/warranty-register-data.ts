// src/lib/warranty-register-data.ts
// Direct Integration Layer & Calculation Utilities for Warranty Register

import {
  getStoredMaterialReceipts,
  getStoredDirectMRRs,
  MaterialReceive,
  DirectMRRRecord,
} from "./procurement-order-inventory-data";

export interface WarrantyAttachment {
  name: string;
  fileType: string;
  size?: string;
  uploadDate: string;
  dataUrl?: string;
}

export type WarrantyStatusType = "Active" | "Expiring Soon" | "Expired" | "Upcoming";

export interface WarrantyRegisterItem {
  id: string; // Unique combination of MRR + Item + Warranty Entry ID
  mrrId: string;
  itemId: string;
  warrantyEntryId: string;

  // Item Info (Mapped from MRR Transaction Item / Master)
  itemCode: string;
  itemName: string;
  brand: string;
  origin: string;
  uom: string;
  itemGroup: string;
  itemCategory: string;
  specification?: string;

  // Procurement & Receiving Info
  company: string;
  warehouseStore: string;
  supplier: string;
  supplierCode?: string;
  poWoNo: string;
  mrrNo: string;
  receiveDate: string;
  receivedQty: number;
  acceptedQty: number;
  challanNo: string;
  receiveType: "Purchase Order" | "Work Order" | "Direct Receive";

  // Warranty Details (Entered in MRR)
  warrantyType: string;
  warrantyStartDate: string;
  warrantyEndDate: string;
  totalWarrantyPeriod: string;
  remarks?: string;

  // Associated Attachments
  attachments: WarrantyAttachment[];
  attachment?: WarrantyAttachment | null;
  createdAt?: string;
}

/**
 * Calculates warranty status, remaining days, and total days dynamically against today's date.
 */
export function calculateWarrantyStatus(
  startDateStr: string,
  endDateStr: string
): {
  status: WarrantyStatusType;
  remainingDays: number;
  totalDays: number;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDateStr);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDateStr);
  end.setHours(0, 0, 0, 0);

  const diffTime = end.getTime() - today.getTime();
  const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const totalDiffTime = end.getTime() - start.getTime();
  const totalDays = Math.max(1, Math.ceil(totalDiffTime / (1000 * 60 * 60 * 24)));

  let status: WarrantyStatusType;

  if (today < start) {
    status = "Upcoming";
  } else if (today > end || remainingDays < 0) {
    status = "Expired";
  } else if (remainingDays <= 30) {
    status = "Expiring Soon";
  } else {
    status = "Active";
  }

  return { status, remainingDays, totalDays };
}

/**
 * Formats the remaining days according to the enterprise specification:
 * - "1023 Days Left"
 * - "35 Days Left"
 * - "18 Days Left"
 * - "Expired 45 Days Ago"
 * - "Starts in 15 Days"
 */
export function formatRemainingDaysText(
  remainingDays: number,
  status: WarrantyStatusType
): string {
  if (status === "Upcoming") {
    const days = Math.abs(remainingDays);
    return `Starts in ${days} Day${days === 1 ? "" : "s"}`;
  }
  if (status === "Expired" || remainingDays < 0) {
    const days = Math.abs(remainingDays);
    return `Expired ${days} Day${days === 1 ? "" : "s"} Ago`;
  }
  return `${remainingDays} Day${remainingDays === 1 ? "" : "s"} Left`;
}

/**
 * Computes human-friendly period string (e.g. "1 Year (12 Months)", "24 Months")
 */
export function calculatePeriodString(startDateStr: string, endDateStr: string): string {
  try {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    if (months >= 12 && months % 12 === 0) {
      const years = months / 12;
      return `${years} Year${years > 1 ? "s" : ""} (${months} Months)`;
    }
    if (months > 0) {
      return `${months} Months`;
    }
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} Days`;
  } catch {
    return "12 Months";
  }
}

/**
 * Determines MIME / display type for attachment badge
 */
export function getAttachmentTypeCategory(fileName: string): "pdf" | "word" | "image" | "zip" | "generic" {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".pdf")) return "pdf";
  if (lower.endsWith(".doc") || lower.endsWith(".docx")) return "word";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png") || lower.endsWith(".webp")) return "image";
  if (lower.endsWith(".zip") || lower.endsWith(".rar") || lower.endsWith(".7z")) return "zip";
  return "generic";
}

/**
 * Retrieves ALL Warranty records dynamically from actual Material Receive (MRR) transactions.
 * Supported Workflows:
 * 1. PO-based Material Receive / MRR
 * 2. WO-based Material Receive / MRR
 * 3. Direct MRR
 *
 * Each warranty entry on an item is surfaced as a distinct row.
 * No dummy or hardcoded records are used.
 */
export function getStoredWarrantyRegisterItems(): WarrantyRegisterItem[] {
  if (typeof window === "undefined") return [];

  const mrrList: MaterialReceive[] = getStoredMaterialReceipts();
  const directMrrList: DirectMRRRecord[] = getStoredDirectMRRs();

  const registerItems: WarrantyRegisterItem[] = [];
  const seenIds = new Set<string>();

  // 1. Process Material Receipts (PO-based MRRs, WO-based MRRs, and Direct MRRs in material receipts list)
  mrrList.forEach((mrr) => {
    // Collect MRR attachments
    const mrrAttachments: WarrantyAttachment[] = (mrr.attachments || []).map((att: any) => ({
      name: att.name || att.fileName || att.title || "Warranty_Document.pdf",
      fileType: att.fileType || (att.name?.endsWith(".pdf") ? "application/pdf" : "application/octet-stream"),
      size: att.fileSize || att.size || "1.8 MB",
      uploadDate: att.uploadTime ? att.uploadTime.slice(0, 10) : mrr.receiveDate,
      dataUrl: att.dataUrl,
    }));

    (mrr.items || []).forEach((item) => {
      if (item.warranties && item.warranties.length > 0) {
        item.warranties.forEach((w, wIndex) => {
          const uniqueId = `warr-reg-${mrr.receiveNumber}-${item.itemCode || item.id}-${w.id || wIndex}`;
          if (!seenIds.has(uniqueId)) {
            seenIds.add(uniqueId);

            // Determine all associated documents for this transaction/item
            const itemAttachments: WarrantyAttachment[] = [
              ...((w as any).attachment ? [(w as any).attachment] : []),
              ...mrrAttachments,
            ];
            const associatedAttachment: WarrantyAttachment | null =
              itemAttachments[0] || null;

            // Determine receive type
            let receiveType: "Purchase Order" | "Work Order" | "Direct Receive" = "Purchase Order";
            if (mrr.receiveType === "Work Order" || mrr.poNumber?.startsWith("WO-")) {
              receiveType = "Work Order";
            } else if (mrr.receiveSource === "Direct MRR" || mrr.receiveNumber.startsWith("DMRR-")) {
              receiveType = "Direct Receive";
            }

            registerItems.push({
              id: uniqueId,
              mrrId: mrr.id,
              itemId: item.id,
              warrantyEntryId: w.id || `w-${wIndex}`,
              itemCode: item.itemCode || "N/A",
              itemName: item.itemName || "Material Item",
              brand: item.brand || "-",
              origin: item.origin || "-",
              uom: item.uom || "PCS",
              itemGroup: (item as any).itemGroup || (item as any).category || "General Inventory",
              itemCategory: (item as any).category || (item as any).itemGroup || "Standard",
              specification: item.specification,
              company: mrr.company || "Pakiza Knit Composite Ltd",
              warehouseStore: mrr.warehouseStore || "Central Warehouse",
              supplier: mrr.supplierName || "Supplier",
              supplierCode: mrr.supplierCode,
              poWoNo: mrr.poNumber || "-",
              mrrNo: mrr.receiveNumber,
              receiveDate: mrr.receiveDate || new Date().toISOString().slice(0, 10),
              receivedQty: item.currentReceiveQty || item.orderedQty || 1,
              acceptedQty: item.acceptedQty || item.currentReceiveQty || 1,
              challanNo: mrr.challanNo || "-",
              receiveType,
              warrantyType: w.warrantyType,
              warrantyStartDate: w.startDate,
              warrantyEndDate: w.endDate,
              totalWarrantyPeriod: calculatePeriodString(w.startDate, w.endDate),
              remarks: w.remarks,
              attachments: itemAttachments,
              attachment: associatedAttachment,
              createdAt: mrr.receiveDate,
            });
          }
        });
      }
    });
  });

  // 2. Process Direct MRRs (from direct MRR collection)
  directMrrList.forEach((dmrr) => {
    const dmrrNumber = dmrr.mrrNumber || dmrr.directMrrNumber || "DMRR";
    const dmrrAttachments: WarrantyAttachment[] = ((dmrr as any).attachments || []).map((att: any) => ({
      name: att.name || att.fileName || "Direct_MRR_Warranty.pdf",
      fileType: att.fileType || "application/pdf",
      size: att.fileSize || att.size || "1.2 MB",
      uploadDate: att.uploadTime ? att.uploadTime.slice(0, 10) : dmrr.mrrDate,
      dataUrl: att.dataUrl,
    }));

    (dmrr.items || []).forEach((item: any) => {
      if (item.warranties && item.warranties.length > 0) {
        item.warranties.forEach((w: any, wIndex: number) => {
          const uniqueId = `warr-reg-${dmrrNumber}-${item.itemCode || item.id}-${w.id || wIndex}`;
          if (!seenIds.has(uniqueId)) {
            seenIds.add(uniqueId);

            const itemAttachments: WarrantyAttachment[] = [
              ...(w.attachment ? [w.attachment] : []),
              ...dmrrAttachments,
            ];
            const associatedAttachment: WarrantyAttachment | null =
              itemAttachments[0] || null;

            registerItems.push({
              id: uniqueId,
              mrrId: dmrr.id,
              itemId: item.id,
              warrantyEntryId: w.id || `dmw-${wIndex}`,
              itemCode: item.itemCode || "N/A",
              itemName: item.itemName || "Direct Material Item",
              brand: item.brand || "-",
              origin: item.origin || "-",
              uom: item.uom || "PCS",
              itemGroup: item.itemGroup || "Direct Inventory",
              itemCategory: item.category || "Direct",
              specification: item.specification,
              company: (dmrr as any).company || "Pakiza Knit Composite Ltd",
              warehouseStore: dmrr.warehouseStore || (dmrr as any).storeName || "Central Warehouse",
              supplier: dmrr.supplierName || (dmrr as any).supplier || "Supplier",
              supplierCode: dmrr.supplierCode,
              poWoNo: dmrr.directMrrNumber || dmrr.mrrNumber || "-",
              mrrNo: dmrrNumber,
              receiveDate: dmrr.mrrDate || new Date().toISOString().slice(0, 10),
              receivedQty: item.receiveQuantity || item.receivedQuantity || 1,
              acceptedQty: item.acceptedQuantity || item.receiveQuantity || 1,
              challanNo: dmrr.challanNo || (dmrr as any).challanNumber || "-",
              receiveType: "Direct Receive",
              warrantyType: w.warrantyType,
              warrantyStartDate: w.startDate,
              warrantyEndDate: w.endDate,
              totalWarrantyPeriod: calculatePeriodString(w.startDate, w.endDate),
              remarks: w.remarks,
              attachments: itemAttachments,
              attachment: associatedAttachment,
              createdAt: dmrr.mrrDate,
            });
          }
        });
      }
    });
  });

  return registerItems;
}
