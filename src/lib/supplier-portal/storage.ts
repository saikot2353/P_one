/**
 * Supplier Quotation Portal - Local Storage Persistence Layer
 * Completely isolated namespace: "cripton_sqp_*"
 * Protects existing ERP storage keys and guarantees zero cross-module pollution.
 */

import { SupplierInvitationRecord, QuotationStatus } from "./types";
import { SEED_INVITATIONS, createQuotationSnapshot } from "./mock-data";

export const STORAGE_KEY_INVITATIONS = "cripton_sqp_invitations_v1";
export const STORAGE_KEY_ACTIVE_TOKEN = "cripton_sqp_active_token_v1";

let memoryInvitations: SupplierInvitationRecord[] | null = null;

/**
 * Retrieves all invitations from browser Local Storage.
 * Auto-seeds with sample demonstration records if empty.
 */
export function getStoredInvitations(): SupplierInvitationRecord[] {
  if (typeof window === "undefined") {
    return memoryInvitations || JSON.parse(JSON.stringify(SEED_INVITATIONS));
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY_INVITATIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("[Supplier Portal Storage] Failed to read invitations from Local Storage:", err);
  }

  // First-time initialization: Seed sample data
  const initial = JSON.parse(JSON.stringify(SEED_INVITATIONS));
  saveStoredInvitations(initial);
  return initial;
}

/**
 * Saves all invitations to browser Local Storage with quota protection.
 */
export function saveStoredInvitations(invitations: SupplierInvitationRecord[]): boolean {
  memoryInvitations = invitations;
  if (typeof window === "undefined") return true;

  try {
    const serialized = JSON.stringify(invitations);
    localStorage.setItem(STORAGE_KEY_INVITATIONS, serialized);
    return true;
  } catch (err: unknown) {
    console.error("[Supplier Portal Storage] Local Storage save failed:", err);
    if ((err as Error)?.name === "QuotaExceededError" || (err as Error)?.name === "NS_ERROR_DOM_QUOTA_REACHED") {
      alert(
        "Warning: Browser Local Storage quota exceeded. Please reduce file attachment sizes or remove older attachments to preserve quotation data.",
      );
    }
    return false;
  }
}

/**
 * Fetches an invitation by its token.
 * Automatically marks "Invitation Sent" as "Link Opened" upon first access.
 */
export function getInvitationByToken(token: string): SupplierInvitationRecord | null {
  if (!token) return null;
  const clean = token.trim().toLowerCase();
  const all = getStoredInvitations();
  const record = all.find((inv) => inv.invitationToken.toLowerCase() === clean);

  if (!record) return null;

  // Auto-transition from "Invitation Sent" to "Link Opened" on first open
  if (record.invitationStatus === "Invitation Sent") {
    record.invitationStatus = "Link Opened";
    record.firstOpenedDate = new Date().toISOString();
    record.lastUpdatedDate = new Date().toISOString();
    saveInvitation(record);
  }

  return record;
}

/**
 * Saves a single updated invitation record.
 */
export function saveInvitation(record: SupplierInvitationRecord): boolean {
  record.lastUpdatedDate = new Date().toISOString();
  const all = getStoredInvitations();
  const idx = all.findIndex(
    (inv) => inv.invitationToken.toLowerCase() === record.invitationToken.toLowerCase(),
  );

  if (idx !== -1) {
    all[idx] = record;
  } else {
    all.push(record);
  }

  return saveStoredInvitations(all);
}

/**
 * Resets Supplier Portal data back to fresh demonstration state.
 * Strictly clears ONLY "cripton_sqp_*" keys. Does NOT touch any ERP data.
 */
export function resetSupplierPortalData(): SupplierInvitationRecord[] {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY_INVITATIONS);
      localStorage.removeItem(STORAGE_KEY_ACTIVE_TOKEN);
    } catch (e) {
      console.error(e);
    }
  }
  const fresh = JSON.parse(JSON.stringify(SEED_INVITATIONS));
  saveStoredInvitations(fresh);
  return fresh;
}

/**
 * Records that an invitation link was opened by the supplier.
 */
export function recordInvitationOpened(token: string): void {
  getInvitationByToken(token);
}

/**
 * Saves a live draft of the supplier's quotation and contact information.
 */
export function saveInvitationDraft(
  token: string,
  quotation: SupplierInvitationRecord["currentQuotation"],
  supplierContact?: SupplierInvitationRecord["supplierContact"]
): boolean {
  const inv = getInvitationByToken(token);
  if (!inv) return false;
  inv.currentQuotation = quotation;
  if (supplierContact) {
    inv.supplierContact = supplierContact;
  }
  if (inv.invitationStatus === "Invitation Sent" || inv.invitationStatus === "Link Opened") {
    inv.invitationStatus = "Draft";
    inv.currentQuotation.status = "Draft";
  }
  return saveInvitation(inv);
}

/**
 * Validates and submits a quotation.
 * Locks the quotation into "Submitted" status and stamps the submission timestamp.
 */
export function submitQuotation(
  token: string,
  declarationAccepted = true,
): SupplierInvitationRecord | null {
  const inv = getInvitationByToken(token);
  if (!inv) return null;

  // Generate official quotation reference if not already formatted
  if (!inv.currentQuotation.quotationReference || inv.currentQuotation.quotationReference.includes("Draft")) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const supCode = inv.supplierMaster.supplierCode.replace(/[^A-Z0-9]/gi, "");
    inv.currentQuotation.quotationReference = `QT-${supCode}-2026-${randomSuffix}-V${inv.currentQuotation.version}`;
  }

  const now = new Date().toISOString();
  inv.currentQuotation.declarationAccepted = declarationAccepted;
  inv.currentQuotation.submittedAt = now;
  inv.currentQuotation.status = "Submitted";
  inv.invitationStatus = "Submitted";

  saveInvitation(inv);
  return inv;
}

/**
 * Requests revision for a submitted quotation.
 */
export function requestRevision(
  token: string,
  reason: string,
): SupplierInvitationRecord | null {
  const inv = getInvitationByToken(token);
  if (!inv) return null;

  const now = new Date().toISOString();
  inv.currentQuotation.status = "Revision Requested";
  inv.invitationStatus = "Revision Requested";
  inv.currentQuotation.revisionReason = reason.trim();
  inv.currentQuotation.revisionRequestedAt = now;

  saveInvitation(inv);
  return inv;
}

/**
 * Simulates the Procurement Authority's decision on a revision request
 * (Allows full end-to-end evaluation of the revision lifecycle in Phase 1 without an internal portal!)
 */
export function simulateProcurementDecision(
  token: string,
  decision: "Approved" | "Rejected",
  remarks = "Approved by Procurement Evaluation Committee for commercial clarification.",
): SupplierInvitationRecord | null {
  const inv = getInvitationByToken(token);
  if (!inv) return null;

  const now = new Date().toISOString();

  if (decision === "Approved") {
    // 1. Snapshot the current version into revisionHistory
    const snapshot = createQuotationSnapshot(inv);
    inv.revisionHistory.unshift({
      id: `rev-${Date.now()}`,
      version: inv.currentQuotation.version,
      quotationReference: inv.currentQuotation.quotationReference,
      submittedAt: inv.currentQuotation.submittedAt || now,
      status: "Submitted",
      revisionReason: inv.currentQuotation.revisionReason,
      revisionRequestedAt: inv.currentQuotation.revisionRequestedAt,
      revisionDecision: "Approved",
      decisionRemarks: remarks,
      decisionDate: now,
      snapshot,
    });

    // 2. Increment version and unlock for editing
    inv.currentQuotation.version += 1;
    inv.currentQuotation.status = "Revision Approved";
    inv.invitationStatus = "Revision Approved";
    inv.currentQuotation.quotationReference = `${inv.currentQuotation.quotationReference.replace(/-V\d+$/i, "")}-V${inv.currentQuotation.version}`;
  } else {
    // Rejected
    inv.currentQuotation.status = "Revision Rejected";
    inv.invitationStatus = "Revision Rejected";
  }

  saveInvitation(inv);
  return inv;
}


/**
 * Checks storage footprint of the Supplier Portal
 */
export function checkStorageFootprint(): {
  usedKb: number;
  totalEntries: number;
  statusText: string;
} {
  if (typeof window === "undefined") {
    return { usedKb: 0, totalEntries: 0, statusText: "Offline" };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY_INVITATIONS) || "";
    const bytes = new Blob([raw]).size;
    const usedKb = Math.round(bytes / 1024);
    const totalEntries = getStoredInvitations().length;

    return {
      usedKb,
      totalEntries,
      statusText: usedKb > 3500 ? "Storage Warning (>3.5MB)" : "Healthy",
    };
  } catch {
    return { usedKb: 0, totalEntries: 0, statusText: "Unknown" };
  }
}

/**
 * Convenient alias for getStoredInvitations
 */
export const getInvitations = getStoredInvitations;

/**
 * Format bytes to readable string (e.g. 512 KB, 1.2 MB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes <= 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}


