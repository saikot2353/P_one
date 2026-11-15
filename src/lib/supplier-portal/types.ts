/**
 * Supplier Quotation Portal - TypeScript Type Definitions
 * Phase 1 Standalone Architecture for CriptonHRIS
 */

export type QuotationStatus =
  | "Invitation Sent"
  | "Link Opened"
  | "Draft"
  | "Submitted"
  | "Revision Requested"
  | "Revision Approved"
  | "Revision Rejected"
  | "Revised"
  | "Under Review"
  | "Closed";

export type AttachmentCategory =
  | "Official Quotation (PDF)"
  | "Technical Specification"
  | "Product Catalogue"
  | "Company Profile"
  | "Warranty Certificate"
  | "Other Supporting Documents";

export interface CSItem {
  sl: number;
  itemId: string;
  itemCode: string;
  itemName: string;
  specification: string;
  requiredQuantity: number;
  uom: string;
  targetPrice?: number;
  category?: string;
}

export interface CSSupportingDoc {
  id: string;
  name: string;
  size: string;
  type: string;
  url?: string;
}

export interface CSInfo {
  csNumber: string;
  csDate: string;
  csSubject: string;
  department: string;
  deliveryLocation: string;
  currency: string;
  submissionDeadline: string; // ISO Datetime
  generalRequirements: string;
  invitationReference: string;
  supportingDocuments: CSSupportingDoc[];
}

export interface SupplierMasterInfo {
  supplierCode: string;
  supplierName: string;
}

export interface SupplierContactInfo {
  contactPerson: string;
  designation: string;
  email: string;
  mobile: string;
  officeAddress: string;
  country: string;
}

export interface ItemQuotationEntry {
  itemId: string;
  status: "Quoted" | "Not Quoted";
  offeredBrand: string;
  offeredOrigin: string;
  unitPrice: number;
  discountPercent: number;
  vatPercent: number;
  taxPercent: number;
  deliveryLeadTimeDays: number;
  warrantyPeriodMonths: number;
  remarks: string;
}

export interface CalculatedItemValues {
  requiredQuantity: number;
  unitPrice: number;
  grossAmount: number;
  discountAmount: number;
  taxableAmount: number;
  vatAmount: number;
  taxAmount: number;
  finalItemAmount: number;
}

export interface OverallQuotation {
  discountType: "Percentage" | "Amount";
  discountValue: number;
  vatPercent: number;
  taxPercent: number;
  transportationCharges: number;
  installationCharges: number;
  otherCharges: number;
  remarks: string;
}

export interface CommercialTerms {
  paymentTerms: string;
  deliveryTerms: string;
  overallLeadTimeDays: number;
  warrantyTerms: string;
  installationIncluded: boolean;
  transportationIncluded: boolean;
  afterSalesService: boolean;
  offerValidity: string;
  specialConditions: string;
  additionalNotes: string;
}

export interface PortalAttachment {
  id: string;
  category: AttachmentCategory;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileSizeFormatted: string;
  uploadedAt: string;
  dataUrl?: string; // Stored as base64 or text object for download/preview
}

export interface FinancialSummary {
  totalItems: number;
  quotedItemsCount: number;
  notQuotedItemsCount: number;
  itemWiseGrossTotal: number;
  itemWiseDiscountTotal: number;
  itemWiseTaxableTotal: number;
  itemWiseVatTotal: number;
  itemWiseTaxTotal: number;
  itemWiseFinalTotal: number;
  overallDiscountAmount: number;
  overallVatAmount: number;
  overallTaxAmount: number;
  transportationCharges: number;
  installationCharges: number;
  otherCharges: number;
  netQuotationAmount: number;
}

export interface QuotationSnapshot {
  quotationReference: string;
  version: number;
  submittedAt: string;
  status: QuotationStatus;
  itemQuotes: Record<string, ItemQuotationEntry>;
  overallQuote: OverallQuotation;
  commercialTerms: CommercialTerms;
  attachments: PortalAttachment[];
  supplierContact: SupplierContactInfo;
  financialSummary: FinancialSummary;
  declarationAccepted: boolean;
}

export interface RevisionRecord {
  id: string;
  version: number;
  quotationReference: string;
  submittedAt: string;
  status: QuotationStatus;
  revisionReason?: string;
  revisionRequestedAt?: string;
  revisionDecision?: "Approved" | "Rejected" | "Pending";
  decisionRemarks?: string;
  decisionDate?: string;
  snapshot: QuotationSnapshot;
}

export interface SupplierInvitationRecord {
  invitationToken: string;
  invitationStatus: QuotationStatus;
  invitationSentDate: string;
  firstOpenedDate?: string;
  lastUpdatedDate: string;
  csInfo: CSInfo;
  items: CSItem[];
  supplierMaster: SupplierMasterInfo;
  supplierContact: SupplierContactInfo;
  currentQuotation: {
    quotationReference: string;
    version: number;
    status: QuotationStatus;
    itemQuotes: Record<string, ItemQuotationEntry>;
    overallQuote: OverallQuotation;
    commercialTerms: CommercialTerms;
    attachments: PortalAttachment[];
    declarationAccepted: boolean;
    submittedAt?: string;
    revisionReason?: string;
    revisionRequestedAt?: string;
  };
  revisionHistory: RevisionRecord[];
}

export type PortalStep =
  | 1 // Invitation Overview
  | 2 // Supplier Information
  | 3 // Item-wise Quotation
  | 4 // Overall Quotation
  | 5 // Commercial Terms
  | 6 // Attachments
  | 7 // Review & Submit
  | 8; // Submission Status & Revision History

