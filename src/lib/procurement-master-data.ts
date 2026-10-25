// Procurement Master Data Types & Initial Data Storage

// -------------------------------------------------------------
// Form 01: Warehouse / Store
// -------------------------------------------------------------
export type StoreType =
  | "Central Store"
  | "Regional Store"
  | "Branch Store"
  | "Raw Material Store"
  | "Spare Parts Store"
  | "General Store"
  | "Finished Goods Store"
  | "Other";

export type StockValuationMethod =
  | "FIFO"
  | "LIFO"
  | "Weighted Average"
  | "Moving Average"
  | "Standard Cost";

export interface StorePermissionEmployee {
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
}

export interface WarehouseStore {
  id: string;
  storeCode: string;
  storeName: string;
  name?: string;
  storeType?: StoreType;
  organization: string;
  companyAreaSection?: string;
  businessUnit?: string;
  branchLocation?: string;
  storeManager: string;
  contactNumber: string;
  email?: string;
  address?: string;
  status: "Active" | "Inactive";
  remarks?: string;
  // Inventory Configuration
  allowNegativeStock?: boolean;
  batchTrackingRequired: boolean;
  serialNumberTrackingRequired: boolean; // Location Tracking
  expiryTrackingRequired?: boolean;
  stockValuationMethod: StockValuationMethod;
  transactionModificationDays?: number;
  // Store Wise Permission
  permissions?: StorePermissionEmployee[];
}

// -------------------------------------------------------------
// Form 02: Store Location / Batch Configuration
// -------------------------------------------------------------
export type LocationType = "Rack" | "Shelf" | "Bin" | "Floor" | "Other";

export interface StoreLocation {
  id: string;
  trackingMode: "Location" | "Batch";
  // Location Configuration
  locationTrackingEnabled: boolean;
  store: string;
  locationCode: string;
  locationName: string;
  locationType: LocationType;
  locationStatus: "Active" | "Inactive";
  defaultLocationName?: boolean;
  // Batch Configuration
  batchTrackingEnabled: boolean;
  batchNumbering: string;
  createDate: string;
  expireDate: string;
  batchStatus: "Active" | "Inactive";
  // Common
  status: "Active" | "Inactive";
  warehouseCode?: string;
  capacity?: number;
  capacityUOM?: string;
  remarks?: string;
}

// -------------------------------------------------------------
// Form 03: Vendor Category
// -------------------------------------------------------------
export interface VendorCategory {
  id: string;
  categoryCode: string;
  categoryName: string;
  description: string;
  status: "Active" | "Inactive";
}

// -------------------------------------------------------------
// Form 03B: Business Type
// -------------------------------------------------------------
export interface BusinessType {
  id: string;
  typeCode: string;
  businessTypeName: string;
  description?: string;
  status: "Active" | "Inactive";
}


// -------------------------------------------------------------
// Form 04: Supplier / Vendor Master
// -------------------------------------------------------------
export type VendorType =
  | "Company"
  | "Individual"
  | "Manufacturer"
  | "Distributor"
  | "Dealer"
  | "Service Provider"
  | "Contractor"
  | "Other";

export type VendorApprovalStatus = "Approved" | "Pending Verification" | "On-Hold" | "Blacklisted";

export interface VendorDocument {
  id: string;
  docType: string;
  docNumber?: string;
  expiryDate?: string;
  fileUrl?: string;
  fileName?: string;
}

export interface SupplierVendor {
  id: string;
  vendorCode: string;
  vendorName: string; // Supplier / Vendor Name
  supplierName?: string;
  vendorType?: VendorType;
  vendorCategory: string;
  businessType: string;
  tradeLicenseNo: string;
  tin: string;
  bin: string;
  registrationNo: string;
  country: string;
  localForeignStatus?: "Local" | "Foreign";
  status: "Active" | "Inactive";
  createDate: string;
  remarks?: string;
  // Address
  address: string;
  division?: string;
  district?: string;
  upazila?: string;
  city?: string;
  postalCode?: string;
  // Contact Information
  contactPersonName: string;
  designation: string;
  mobileNumber: string;
  emailAddress: string;
  website: string;
  // Bank Information
  bankName: string;
  branchName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  swiftCode: string;
  // Procurement Terms
  termsConditionsDescription: string;
  // Legacy compatibility fields
  approvalStatus?: VendorApprovalStatus;
  productServiceCategory?: string;
  preferredVendor?: boolean;
  documents?: VendorDocument[];
}

export type SupplierVendorMaster = SupplierVendor;

export interface PaymentTermsMaster {
  id: string;
  termsCode?: string;
  termsName?: string;
  description?: string;
  days?: number;
  status?: string;
  [key: string]: any;
}

// -------------------------------------------------------------
// Form 05: Vendor Contact & Bank Information
// -------------------------------------------------------------
export interface VendorContact {
  id: string;
  vendorId: string;
  contactPerson: string;
  designation: string;
  mobile: string;
  phone?: string;
  email: string;
  alternativeEmail?: string;
  address?: string;
  isPrimary: boolean;
  status: "Active" | "Inactive";
}

export interface VendorBank {
  id: string;
  vendorId: string;
  bankName: string;
  branchName: string;
  accountName: string;
  accountNumber: string;
  accountType: "Current" | "Savings" | "Escrow" | "Foreign Currency";
  routingNumber: string;
  swiftCode: string;
  paymentMethod: "BEFTN" | "RTGS" | "Cheque" | "Wire Transfer" | "Cash";
  defaultBankAccount: boolean;
  status: "Active" | "Inactive";
}

// -------------------------------------------------------------
// Form: Origin Master
// -------------------------------------------------------------
export interface Origin {
  id: string;
  originCode: string;
  originName: string;
  status: "Active" | "Inactive";
  description?: string;
}

// -------------------------------------------------------------
// Form 06: Item Group Management
// -------------------------------------------------------------
export interface ItemGroup {
  id: string;
  groupCode: string;
  groupName: string;
  description: string;
  status: "Active" | "Inactive";
  parentGroupId?: string;
  serviceFlag?: boolean;
}

// -------------------------------------------------------------
// Dynamic Item Sub Group Management (Tree-based Hierarchy)
// -------------------------------------------------------------
export interface ItemSubGroup {
  id: string;
  subGroupCode: string;
  subGroupName: string;
  itemGroupId: string; // Parent Item Group ID
  parentSubGroupId?: string | null; // Parent Sub Group ID (null if root under item group)
  description?: string;
  status: "Active" | "Inactive";
  serviceFlag?: boolean;
}

// -------------------------------------------------------------
// Form 07: Item Category
// -------------------------------------------------------------
export interface ItemCategory {
  id: string;
  categoryCode: string;
  categoryName: string;
  parentCategoryId?: string;
  categoryType?: "Direct Material" | "Indirect Material" | "Capex" | "Service" | string;
  isInventoryItem: boolean;
  isAssetItem: boolean;
  isConsumable: boolean;
  isService: boolean;
  status: "Active" | "Inactive";
  description: string;
}

// -------------------------------------------------------------
// Form 08: Brand Master
// -------------------------------------------------------------
export interface Brand {
  id: string;
  brandCode: string;
  brandName: string;
  manufacturer: string;
  countryOfOrigin: string;
  website: string;
  description: string;
  status: "Active" | "Inactive";
}

// -------------------------------------------------------------
// Form 09: Unit of Measurement (UOM)
// -------------------------------------------------------------
export interface UOMConversion {
  fromUOM: string;
  toUOM: string;
  factor: number;
}

export interface UOM {
  id: string;
  uomCode: string;
  uomName: string;
  uomType: "Count" | "Weight" | "Volume" | "Length" | "Area" | "Packaging";
  decimalAllowed: boolean;
  baseUOM?: string;
  conversionFactor: number;
  status: "Active" | "Inactive";
  description: string;
  conversions?: UOMConversion[];
}

// -------------------------------------------------------------
// Form 10: Item Specification
// -------------------------------------------------------------
export type SpecDataType = "Text" | "Number" | "Decimal" | "Dropdown" | "Boolean" | "Date";

export interface ItemSpecification {
  id: string;
  specificationCode: string;
  specificationName: string;
  specificationType: "Technical" | "Physical" | "Electrical" | "Chemical" | "General";
  dataType: SpecDataType;
  unit?: string;
  dropdownOptions?: string[];
  mandatory: boolean;
  status: "Active" | "Inactive";
  description: string;
}

// -------------------------------------------------------------
// Form 11: Item / Product Master
// -------------------------------------------------------------
export interface ItemSpecValue {
  specCode: string;
  specName: string;
  value: string;
}

export interface ItemProductMaster {
  id: string;
  itemCode: string;
  hsCode?: string;
  itemName: string;
  itemGroupId?: string;
  groupId?: string;
  itemGroupName?: string;
  subGroupId?: string;
  subGroupName?: string;
  subGroupBreadcrumb?: string;
  itemCategoryId: string;
  itemCategory: string;
  specification?: string;
  itemType?: "Goods" | "Service" | "Asset" | string;
  brand?: string;
  model?: string;
  partNumber?: string;
  origin?: string;
  serviceFlag?: boolean;
  valuationMethod?: "FIFO" | "LIFO" | "Weighted Average";
  status: "Active" | "Inactive";
  createDate?: string;
  // Legacy / tab fallbacks
  itemGroup?: string;
  shortName?: string;
  subCategory?: string;
  manufacturer?: string;
  barcode?: string;
  description?: string;
  // UOM
  purchaseUOM: string;
  stockUOM: string;
  stockUom?: string;
  categoryName?: string;
  standardCost?: number;
  lastPurchasePrice?: number;
  conversionFactor?: number;
  uomRelationship?: string;
  issueUOM?: string;
  // Inventory
  minimumStock: number;
  maximumStock: number;
  reorderLevel: number;
  safetyStock: number;
  leadTimeDays?: number;
  batchTrackingRequired: boolean;
  serialNumberTrackingRequired: boolean;
  expiryTrackingRequired?: boolean;
  defaultWarehouse?: string;
  defaultBin?: string;
  warehouses?: Array<{ id: string; warehouseName: string; binLocation?: string; isPrimary?: boolean }>;
  preferredSupplier?: string;
  standardPurchasePrice?: number;
  currency?: string;
  specifications?: ItemSpecValue[];
  warrantyPeriod?: string;
  image?: string;
  attachments?: string[];
}

// -------------------------------------------------------------
// Form 12: Tax / VAT Configuration
// -------------------------------------------------------------
export interface TaxVatConfig {
  id: string;
  taxCode: string;
  taxName: string;
  taxType: "VAT" | "AIT" | "Withholding Tax" | "Other";
  rate: number;
  calculationMethod: "Percentage" | "Fixed Amount";
  applicableOn: "Base Amount" | "Gross Amount" | "Net of Discount";
  effectiveFrom: string;
  effectiveTo: string;
  recoverable: boolean;
  glAccount: string;
  status: "Active" | "Inactive";
  remarks?: string;
}

// -------------------------------------------------------------
// Form 13: Payment Terms
// -------------------------------------------------------------
export interface PaymentTerm {
  id: string;
  termCode: string;
  termName: string;
  paymentType?: "Immediate" | "Advance" | "Credit" | "LC" | "Installment" | string;
  creditDays?: number;
  advancePercentage?: number;
  retentionPercentage?: number;
  dueDateRule?: "Invoice Date" | "Delivery Date" | "GRN Date" | "Month End" | string;
  description: string;
  status: "Active" | "Inactive";
}

// -------------------------------------------------------------
// Form 14: Delivery Terms
// -------------------------------------------------------------
export interface DeliveryTerm {
  id: string;
  termCode: string;
  termName: string;
  deliveryMethod:
    | "Supplier Delivery"
    | "Buyer Pickup"
    | "Courier"
    | "Transport"
    | "Sea"
    | "Air"
    | "Ex-Factory"
    | "FOB";
  deliveryLocation: string;
  leadTimeDays: number;
  transportationResponsibility: "Supplier" | "Buyer" | "Third-Party";
  deliveryCostResponsibility: "Supplier" | "Buyer" | "Shared";
  partialDeliveryAllowed: boolean;
  status: "Active" | "Inactive";
  description: string;
}

// -------------------------------------------------------------
// Form 15: Currency Master
// -------------------------------------------------------------
export interface Currency {
  id: string;
  currencyCode: string;
  currencyName: string;
  symbol: string;
  decimalPlaces: number;
  exchangeRate: number;
  rateDate: string;
  baseCurrency: boolean;
  isBaseCurrency?: boolean;
  subUnit?: string;
  amountFormat?: string;
  status: "Active" | "Inactive";
}
export type CurrencyMaster = Currency;

// -------------------------------------------------------------
// Form 16: Budget Management
// -------------------------------------------------------------
export interface BudgetLine {
  id: string;
  budgetHead?: string;
  itemCategory: string;
  itemCode?: string;
  allocatedAmount: number;
  monthlyAllocation?: number;
  remarks?: string;
}

export interface Budget {
  id: string;
  budgetCode: string; // Budget ID
  budgetName?: string;
  // Header Section
  employeeName?: string;
  department: string;
  designation?: string;
  createDate: string;
  currency: string; // Default: BDT
  budgetPeriod?: "Monthly" | "Yearly" | "Custom" | string;
  periodYear?: number | string;
  periodMonth?: string;
  budgetYear?: string;
  budgetType?: "Operating Budget" | "Capital Budget" | "Project Budget" | "Departmental Budget" | string;
  costCenter?: string;
  project?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  description?: string;
  attachment?: string;
  budgetLines: BudgetLine[];
  // Calculated Fields (non-editable manually)
  originalBudget?: number;
  additionalAllocation?: number;
  budgetReduction?: number;
  revisedBudget?: number;
  actualUtilized?: number;
  committedAmount?: number;
  availableBudget?: number;
  totalBudget?: number;
  status: "Draft" | "Submitted" | "Under Review" | "Approved" | "Rejected";
}

// -------------------------------------------------------------
// Form 17: Budget Approval
// -------------------------------------------------------------
export type ApprovalDecision =
  | "Draft"
  | "Submitted"
  | "Under Review"
  | "Approved"
  | "Rejected"
  | "Returned"
  | "Cancelled";

export interface BudgetApproval {
  id: string;
  budgetId: string;
  budgetCode: string;
  budgetYear: string;
  department: string;
  totalBudget: number;
  submittedBy: string;
  submittedDate: string;
  approvalLevel: string;
  reviewer: string;
  decision: ApprovalDecision;
  remarks: string;
  approvalDate?: string;
}

// -------------------------------------------------------------
// Form 18: Approval Authority
// -------------------------------------------------------------
export interface ApprovalAuthority {
  id: string;
  authorityCode: string;
  authorityName: string;
  organization: string;
  department: string;
  roleDesignation: string;
  approvalType:
    | "Purchase Requisition"
    | "Purchase Order"
    | "Budget"
    | "Supplier Bill"
    | "Payment Voucher";
  minimumAmount: number;
  maximumAmount: number;
  approvalLevel: number;
  effectiveFrom: string;
  effectiveTo: string;
  status: "Active" | "Inactive";
}

// -------------------------------------------------------------
// Form 19: Document Type / Number Series
// -------------------------------------------------------------
export type DocumentTypeCode =
  | "PR"
  | "RFQ"
  | "Quotation"
  | "PO"
  | "GRN"
  | "Material Requisition"
  | "Stock Issue"
  | "Stock Transfer"
  | "Supplier Invoice"
  | "Bill"
  | "Payment Request"
  | "Payment Voucher"
  | "Budget"
  | "Debit Note"
  | "Credit Note"
  | string;

export type DocumentDateFormat =
  | "None"
  | "Month + Year"
  | "Year + Month"
  | "Year-Month"
  | "Year"
  | "Month"
  | "Year + Number"
  | "Month + Number";

export interface DocumentNumberSeries {
  id: string;
  company?: string;
  documentType: string;
  numberingMethod: "Auto" | string;
  prefix: string;
  separator: "/" | "-" | "." | "None" | string;
  dateFormat?: DocumentDateFormat | string;
  resetFrequency: "Never" | "Yearly" | "Monthly" | "Daily" | "Annually";
  startingNumber: number;
  numberLength: number;
  status: "Active" | "Inactive";
  currentNumber?: number;
  documentCode?: string;
  numberFormat?: string;
  financialYearWise?: boolean;
  branchWise?: boolean;
  departmentWise?: boolean;
  effectiveFrom?: string;
  effectiveTo?: string;
}

export const AVAILABLE_DOCUMENT_TYPES = [
  { value: "Purchase Requisition", label: "Purchase Requisition (PR)", defaultPrefix: "PR" },
  { value: "Request for Quotation", label: "Request for Quotation (RFQ)", defaultPrefix: "RFQ" },
  { value: "Supplier Quotation", label: "Supplier Quotation (SQ)", defaultPrefix: "SQ" },
  { value: "Comparative Statement", label: "Comparative Statement (CS)", defaultPrefix: "CS" },
  { value: "Purchase Order", label: "Purchase Order (PO)", defaultPrefix: "PO" },
  { value: "Goods Receipt Note", label: "Goods Receipt Note (GRN / MRR)", defaultPrefix: "GRN" },
  { value: "Store Issue Voucher", label: "Store Issue Voucher (SIV)", defaultPrefix: "SIV" },
  { value: "Store Return Voucher", label: "Store Return Voucher (SRV)", defaultPrefix: "SRV" },
  { value: "Material Requisition", label: "Material Requisition (MR)", defaultPrefix: "MR" },
  { value: "Supplier Bill", label: "Supplier Bill / Invoice", defaultPrefix: "BILL" },
  { value: "Payment Request", label: "Payment Request (PRQ)", defaultPrefix: "PRQ" },
  { value: "Payment Voucher", label: "Payment Voucher (PV)", defaultPrefix: "PV" },
  { value: "Budget Requisition", label: "Budget Requisition", defaultPrefix: "BDG" },
  { value: "Debit Note", label: "Debit Note", defaultPrefix: "DN" },
  { value: "Credit Note", label: "Credit Note", defaultPrefix: "CN" },
  { value: "Item Code Series", label: "Item Creation / Code Series", defaultPrefix: "ITM" },
  { value: "Supplier Registration", label: "Supplier / Vendor Registration", defaultPrefix: "SUP" },
  { value: "Warehouse Code Series", label: "Warehouse / Store Series", defaultPrefix: "WH" },
];

// =============================================================
// INITIAL DATA
// =============================================================

export const DEFAULT_ORIGINS: Origin[] = [
  { id: "org-1", originCode: "ORG-001", originName: "Bangladesh", status: "Active" },
  { id: "org-2", originCode: "ORG-002", originName: "China", status: "Active" },
  { id: "org-3", originCode: "ORG-003", originName: "India", status: "Active" },
  { id: "org-4", originCode: "ORG-004", originName: "Germany", status: "Active" },
  { id: "org-5", originCode: "ORG-005", originName: "United States", status: "Active" },
  { id: "org-6", originCode: "ORG-006", originName: "Japan", status: "Active" },
  { id: "org-7", originCode: "ORG-007", originName: "Vietnam", status: "Active" },
  { id: "org-8", originCode: "ORG-008", originName: "United Kingdom", status: "Active" },
];

export const DEFAULT_WAREHOUSES: WarehouseStore[] = [
  {
    id: "wh-1",
    storeCode: "WH-PKCL-01",
    storeName: "PKCL Central Raw Material Warehouse",
    name: "PKCL Central Raw Material Warehouse",
    organization: "Pakiza Knit Composite Ltd",
    storeManager: "Tahmid Afsar Shapno",
    contactNumber: "01750021154",
    status: "Active",
    batchTrackingRequired: true,
    serialNumberTrackingRequired: false,
    stockValuationMethod: "Weighted Average",
    permissions: [
      {
        employeeId: "2023043910",
        employeeName: "Tahmid Afsar Shapno",
        department: "Business Innovation",
        designation: "Asst. Manager",
      },
      {
        employeeId: "2023046001",
        employeeName: "Sohanur Rahman Sohan",
        department: "HR, Admin and Compliance",
        designation: "Executive",
      },
    ],
  },
  {
    id: "wh-2",
    storeCode: "WH-PSML-02",
    storeName: "Spinning Spare Parts & Consumables Store",
    name: "Spinning Spare Parts & Consumables Store",
    organization: "Pakiza Spinning Mills Ltd",
    storeManager: "Sohanur Rahman Sohan",
    contactNumber: "01321-175928",
    status: "Active",
    batchTrackingRequired: false,
    serialNumberTrackingRequired: true,
    stockValuationMethod: "Weighted Average",
    permissions: [
      {
        employeeId: "2023043021",
        employeeName: "Easin Mia",
        department: "HR, Admin and Compliance",
        designation: "Receptionist",
      },
    ],
  },
  {
    id: "wh-3",
    storeCode: "WH-PTL-03",
    storeName: "Pakiza Technovation Central IT & Hardware Depot",
    name: "Pakiza Technovation Central IT & Hardware Depot",
    organization: "Pakiza Technovation Limited",
    storeManager: "Tahmid Afsar Shapno",
    contactNumber: "01750021154",
    status: "Active",
    batchTrackingRequired: true,
    serialNumberTrackingRequired: true,
    stockValuationMethod: "Weighted Average",
    permissions: [
      {
        employeeId: "2023043910",
        employeeName: "Tahmid Afsar Shapno",
        department: "Business Innovation",
        designation: "Asst. Manager",
      },
    ],
  },
  {
    id: "wh-4",
    storeCode: "WH-PGL-04",
    storeName: "Finished Goods Export Transit Store",
    name: "Finished Goods Export Transit Store",
    organization: "Pakiza Garments Ltd",
    storeManager: "Easin Mia",
    contactNumber: "01750021154",
    status: "Active",
    batchTrackingRequired: true,
    serialNumberTrackingRequired: false,
    stockValuationMethod: "Weighted Average",
    permissions: [
      {
        employeeId: "2023046001",
        employeeName: "Sohanur Rahman Sohan",
        department: "HR, Admin and Compliance",
        designation: "Executive",
      },
    ],
  },
];

export const DEFAULT_STORE_LOCATIONS: StoreLocation[] = [
  {
    id: "loc-1",
    trackingMode: "Location",
    locationTrackingEnabled: true,
    store: "WH-PKCL-01",
    warehouseCode: "WH-PKCL-01",
    locationCode: "LOC-RCK-01",
    locationName: "Rack A1 - Raw Cotton Pallet",
    locationType: "Rack",
    locationStatus: "Active",
    defaultLocationName: true,
    batchTrackingEnabled: false,
    batchNumbering: "",
    createDate: "2026-09-01",
    expireDate: "",
    batchStatus: "Inactive",
    status: "Active",
  },
  {
    id: "loc-2",
    trackingMode: "Location",
    locationTrackingEnabled: true,
    store: "WH-PTL-03",
    warehouseCode: "WH-PTL-03",
    locationCode: "LOC-SHF-02",
    locationName: "Shelf B - Laptop Storage Units",
    locationType: "Shelf",
    locationStatus: "Active",
    defaultLocationName: false,
    batchTrackingEnabled: false,
    batchNumbering: "",
    createDate: "2026-09-05",
    expireDate: "",
    batchStatus: "Active",
    status: "Active",
  },
  {
    id: "loc-3",
    trackingMode: "Batch",
    locationTrackingEnabled: false,
    store: "WH-PKCL-01",
    warehouseCode: "WH-PKCL-01",
    locationCode: "LOC-GEN-03",
    locationName: "",
    locationType: "Bin",
    locationStatus: "Inactive",
    batchTrackingEnabled: true,
    batchNumbering: "BAT-YRN-2026-09A",
    createDate: "2026-09-10",
    expireDate: "2027-09-10",
    batchStatus: "Active",
    status: "Active",
  },
  {
    id: "loc-4",
    trackingMode: "Batch",
    locationTrackingEnabled: false,
    store: "WH-PSML-02",
    warehouseCode: "WH-PSML-02",
    locationCode: "LOC-GEN-04",
    locationName: "",
    locationType: "Floor",
    locationStatus: "Inactive",
    batchTrackingEnabled: true,
    batchNumbering: "BAT-CHM-2026-Q3",
    createDate: "2026-09-12",
    expireDate: "2027-03-31",
    batchStatus: "Active",
    status: "Active",
  },
];

export const DEFAULT_VENDOR_CATEGORIES: VendorCategory[] = [
  {
    id: "vc-1",
    categoryCode: "VCAT-LOCAL",
    categoryName: "Local Supplier",
    description: "Domestic vendors providing general raw materials and items",
    status: "Active",
  },
  {
    id: "vc-2",
    categoryCode: "VCAT-MFG",
    categoryName: "Manufacturer",
    description: "Direct OEM/Industrial machinery and fabric manufacturers",
    status: "Active",
  },
  {
    id: "vc-3",
    categoryCode: "VCAT-IT",
    categoryName: "IT Supplier",
    description: "Hardware, software licenses, network peripherals and cloud services",
    status: "Active",
  },
  {
    id: "vc-4",
    categoryCode: "VCAT-STAT",
    categoryName: "Stationery Supplier",
    description: "Office supplies, printing, and administrative consumable vendors",
    status: "Active",
  },
  {
    id: "vc-5",
    categoryCode: "VCAT-CONST",
    categoryName: "Construction Supplier",
    description: "Civil work materials, electrical cables, cement and hardware",
    status: "Active",
  },
  {
    id: "vc-6",
    categoryCode: "VCAT-SERV",
    categoryName: "Service Provider",
    description: "Security, transport, canteen, cleaning and logistics services",
    status: "Active",
  },
  {
    id: "vc-7",
    categoryCode: "VCAT-CNSLT",
    categoryName: "Consultant",
    description: "Tax, legal, audit, environmental compliance and ISO auditors",
    status: "Active",
  },
  {
    id: "vc-8",
    categoryCode: "VCAT-RAW",
    categoryName: "Raw Material Supplier",
    description: "Raw cotton, viscose fiber, elastane, dyestuff and chemical suppliers",
    status: "Active",
  },
];

export const DEFAULT_BUSINESS_TYPES: BusinessType[] = [
  {
    id: "bt-1",
    typeCode: "BT-MFG",
    businessTypeName: "Manufacturing",
    description: "Industrial plants, factories and direct product manufacturers",
    status: "Active",
  },
  {
    id: "bt-2",
    typeCode: "BT-DIST",
    businessTypeName: "Distributor",
    description: "Authorized wholesale and countrywide commercial distributors",
    status: "Active",
  },
  {
    id: "bt-3",
    typeCode: "BT-TRD",
    businessTypeName: "Trader / Indentor",
    description: "Commercial trading agencies, indentors and merchant suppliers",
    status: "Active",
  },
  {
    id: "bt-4",
    typeCode: "BT-SRV",
    businessTypeName: "Service Provider",
    description: "Technical, engineering, maintenance and consulting service providers",
    status: "Active",
  },
  {
    id: "bt-5",
    typeCode: "BT-CON",
    businessTypeName: "Contractor",
    description: "Civil, electrical, mechanical and turnkey project contractors",
    status: "Active",
  },
];

export const DEFAULT_SUPPLIERS: SupplierVendor[] = [
  {
    id: "sup-1",
    vendorCode: "SUP-2026-001",
    vendorName: "Apex Textile Chemical & Dyestuffs Ltd",
    supplierName: "Apex Textile Chemical & Dyestuffs Ltd",
    vendorType: "Manufacturer",
    vendorCategory: "Raw Material Supplier",
    businessType: "Public Limited",
    tradeLicenseNo: "TRAD/DNCC/021948/2024",
    tin: "518293401928",
    bin: "001829304-0101",
    registrationNo: "C-94820/2012",
    country: "Bangladesh",
    status: "Active",
    createDate: "2026-08-15",
    remarks: "Key contract supplier for eco-friendly reactive dyes and sizing chemicals",
    address: "Apex House, 12 Tejgaon I/A",
    city: "Dhaka",
    // Contact Information
    contactPersonName: "Md. Nazmul Huda",
    designation: "Head of Corporate Sales",
    mobileNumber: "+880 1711-998811",
    emailAddress: "nazmul.sales@apexchem.com",
    website: "https://www.apexchem.com",
    // Bank Information
    bankName: "Eastern Bank PLC",
    branchName: "Gulshan Corporate Branch",
    accountName: "Apex Textile Chemical & Dyestuffs Ltd",
    accountNumber: "1041060293841",
    routingNumber: "095261483",
    swiftCode: "EBLDBDDH",
    // Procurement Terms
    termsConditionsDescription: "Net 30 days invoice settlement with supplier delivery directly to PKCL Central Store upon quality inspection certificate.",
  },
  {
    id: "sup-2",
    vendorCode: "SUP-2026-002",
    vendorName: "Zhejiang Yarn Spinning Machinery Co.",
    supplierName: "Zhejiang Yarn Spinning Machinery Co.",
    vendorType: "Manufacturer",
    vendorCategory: "Manufacturer",
    businessType: "Foreign Entity",
    tradeLicenseNo: "CN-ZJ-93821094",
    tin: "91330100789012345X",
    bin: "N/A - Foreign",
    registrationNo: "ZJ-IND-44910",
    country: "China",
    status: "Active",
    createDate: "2026-08-20",
    remarks: "Global supplier of rotor spinning frames and spare spindles",
    address: "Hangzhou Industrial Park, Building 4",
    city: "Hangzhou",
    // Contact Information
    contactPersonName: "David Zhang",
    designation: "Overseas Sales Director",
    mobileNumber: "+86 138-0011-2233",
    emailAddress: "david.zhang@zhejiangyarn.cn",
    website: "https://www.zhejiangyarn.cn",
    // Bank Information
    bankName: "Bank of China",
    branchName: "Hangzhou Binjiang Branch",
    accountName: "Zhejiang Yarn Spinning Machinery Co., Ltd.",
    accountNumber: "3892019482019482",
    routingNumber: "104331000109",
    swiftCode: "BKCHCNBJ920",
    // Procurement Terms
    termsConditionsDescription: "Letter of Credit (LC) 90 days with CIF Chittagong seaport delivery terms and 12-month manufacturer parts warranty.",
  },
  {
    id: "sup-3",
    vendorCode: "SUP-2026-003",
    vendorName: "Dacca Accessories & Thread Industries",
    supplierName: "Dacca Accessories & Thread Industries",
    vendorType: "Company",
    vendorCategory: "Local Supplier",
    businessType: "Private Limited",
    tradeLicenseNo: "TRAD/DSCC/109482/2023",
    tin: "482019385712",
    bin: "002948192-0203",
    registrationNo: "C-112948/2016",
    country: "Bangladesh",
    status: "Active",
    createDate: "2026-09-02",
    remarks: "Zippers, polybags, buttons, sewing threads, and barcode stickers",
    address: "Section 7, Block B, Mirpur",
    city: "Dhaka",
    // Contact Information
    contactPersonName: "Farhan Tanvir",
    designation: "Sales Executive",
    mobileNumber: "+880 1819-223344",
    emailAddress: "farhan@daccaaccessories.com",
    website: "https://www.daccaaccessories.com",
    // Bank Information
    bankName: "Standard Chartered Bank",
    branchName: "Principal Branch, Motijheel",
    accountName: "Dacca Accessories & Thread Industries",
    accountNumber: "011129384910",
    routingNumber: "215260193",
    swiftCode: "SCBLBDDX",
    // Procurement Terms
    termsConditionsDescription: "Net 15 days payment via BEFTN/Account Payee Cheque with next-day direct factory delivery.",
  },
  {
    id: "sup-4",
    vendorCode: "SUP-2026-004",
    vendorName: "Smart Solution Technologies BD",
    supplierName: "Smart Solution Technologies BD",
    vendorType: "Distributor",
    vendorCategory: "IT Supplier",
    businessType: "Private Limited",
    tradeLicenseNo: "TRAD/DNCC/55291/2022",
    tin: "671029481923",
    bin: "003192847-0104",
    registrationNo: "C-88192/2014",
    country: "Bangladesh",
    status: "Active",
    createDate: "2026-09-08",
    remarks: "Authorized enterprise distributor for Dell, HP, and Cisco equipment",
    address: "BCS Computer City, IDB Bhaban, Agargaon",
    city: "Dhaka",
    // Contact Information
    contactPersonName: "Kazi Ashiqur Rahman",
    designation: "Enterprise Relationship Manager",
    mobileNumber: "+880 1712-334455",
    emailAddress: "enterprise@smartsolutionbd.com",
    website: "https://www.smartsolutionbd.com",
    // Bank Information
    bankName: "Dutch-Bangla Bank PLC",
    branchName: "Kawran Bazar Branch",
    accountName: "Smart Solution Technologies BD",
    accountNumber: "1161200084920",
    routingNumber: "090262145",
    swiftCode: "DBBLBDDH",
    // Procurement Terms
    termsConditionsDescription: "30% advance on purchase order with remaining 70% upon successful delivery, hardware testing and OEM warranty registration.",
  },
];

export const DEFAULT_VENDOR_CONTACTS: VendorContact[] = [
  {
    id: "con-1",
    vendorId: "sup-1",
    contactPerson: "Md. Nazmul Huda",
    designation: "Head of Corporate Sales",
    mobile: "+880 1711-998811",
    phone: "+880 2 9884433",
    email: "nazmul.sales@apexchem.com",
    alternativeEmail: "support@apexchem.com",
    address: "Tejgaon I/A, Dhaka",
    isPrimary: true,
    status: "Active",
  },
  {
    id: "con-2",
    vendorId: "sup-1",
    contactPerson: "Shirin Akhter",
    designation: "Billing & Accounts Officer",
    mobile: "+880 1819-223344",
    email: "shirin.accts@apexchem.com",
    isPrimary: false,
    status: "Active",
  },
  {
    id: "con-3",
    vendorId: "sup-2",
    contactPerson: "David Zhang",
    designation: "Overseas Sales Director",
    mobile: "+86 138-0011-2233",
    phone: "+86 571-8899-7766",
    email: "david.zhang@zhejiangyarn.cn",
    isPrimary: true,
    status: "Active",
  },
  {
    id: "con-4",
    vendorId: "sup-4",
    contactPerson: "Farhan Tanvir",
    designation: "Enterprise Relationship Manager",
    mobile: "+880 1712-334455",
    email: "farhan@smartsolutionbd.com",
    isPrimary: true,
    status: "Active",
  },
];

export const DEFAULT_VENDOR_BANKS: VendorBank[] = [
  {
    id: "bnk-1",
    vendorId: "sup-1",
    bankName: "Eastern Bank PLC",
    branchName: "Gulshan Corporate Branch",
    accountName: "Apex Textile Chemical & Dyestuffs Ltd",
    accountNumber: "1041060293841",
    accountType: "Current",
    routingNumber: "095261483",
    swiftCode: "EBLDBDDH",
    paymentMethod: "BEFTN",
    defaultBankAccount: true,
    status: "Active",
  },
  {
    id: "bnk-2",
    vendorId: "sup-1",
    bankName: "Standard Chartered Bank",
    branchName: "Principal Branch, Motijheel",
    accountName: "Apex Textile Chemical Ltd",
    accountNumber: "011129384910",
    accountType: "Current",
    routingNumber: "215260193",
    swiftCode: "SCBLBDDX",
    paymentMethod: "RTGS",
    defaultBankAccount: false,
    status: "Active",
  },
  {
    id: "bnk-3",
    vendorId: "sup-2",
    bankName: "Bank of China",
    branchName: "Hangzhou Binjiang Branch",
    accountName: "Zhejiang Yarn Spinning Machinery Co., Ltd.",
    accountNumber: "3892019482019482",
    accountType: "Foreign Currency",
    routingNumber: "104331000109",
    swiftCode: "BKCHCNBJ920",
    paymentMethod: "Wire Transfer",
    defaultBankAccount: true,
    status: "Active",
  },
  {
    id: "bnk-4",
    vendorId: "sup-4",
    bankName: "Dutch-Bangla Bank PLC",
    branchName: "Kawran Bazar Branch",
    accountName: "Smart Solution Technologies BD",
    accountNumber: "1161200084920",
    accountType: "Current",
    routingNumber: "090262145",
    swiftCode: "DBBLBDDH",
    paymentMethod: "BEFTN",
    defaultBankAccount: true,
    status: "Active",
  },
];

export const DEFAULT_ITEM_GROUPS: ItemGroup[] = [
  {
    id: "grp-it",
    groupCode: "GRP-IT",
    groupName: "IT Equipment",
    description: "Enterprise computing hardware, laptops, servers, and active network peripherals",
    status: "Active",
  },
  {
    id: "grp-office",
    groupCode: "GRP-OFF",
    groupName: "Office Supplies",
    description: "Printing papers, desk accessories, pantry essentials, and stationery",
    status: "Active",
  },
  {
    id: "grp-raw",
    groupCode: "GRP-RAW",
    groupName: "Raw Materials",
    description: "Spinning cotton, synthetic fibers, textile auxiliaries, and dyestuffs",
    status: "Active",
  },
  {
    id: "grp-spare",
    groupCode: "GRP-SPR",
    groupName: "Spare Parts",
    description: "Industrial machine spares, looms, belts, motors, and electrical components",
    status: "Active",
  },
  {
    id: "grp-fg",
    groupCode: "GRP-FG",
    groupName: "Finished Goods",
    description: "Manufactured knitwear, retail apparel, and export garment shipments",
    status: "Active",
  },
  {
    id: "grp-service",
    groupCode: "GRP-SRV",
    groupName: "Services & Logistical Charges",
    description: "Freight, transportation, loading/unloading, equipment maintenance and repair services",
    status: "Active",
    serviceFlag: true,
  },
];

export const DEFAULT_ITEM_SUB_GROUPS: ItemSubGroup[] = [
  // IT Equipment Tree
  {
    id: "sub-comp",
    subGroupCode: "SUB-COMP",
    subGroupName: "Computer Equipment",
    itemGroupId: "grp-it",
    parentSubGroupId: null,
    description: "Workstations, personal computers, and portable computing equipment",
    status: "Active",
  },
  {
    id: "sub-laptop",
    subGroupCode: "SUB-LAP",
    subGroupName: "Laptop",
    itemGroupId: "grp-it",
    parentSubGroupId: "sub-comp",
    description: "Portable laptops, ultrabooks, and notebooks",
    status: "Active",
  },
  {
    id: "sub-biz-lap",
    subGroupCode: "SUB-BIZ-LAP",
    subGroupName: "Business Laptop",
    itemGroupId: "grp-it",
    parentSubGroupId: "sub-laptop",
    description: "Corporate enterprise laptops with hardware TPM security",
    status: "Active",
  },
  {
    id: "sub-dell-series",
    subGroupCode: "SUB-DELL-SER",
    subGroupName: "Dell Series",
    itemGroupId: "grp-it",
    parentSubGroupId: "sub-biz-lap",
    description: "Dell commercial computing models",
    status: "Active",
  },
  {
    id: "sub-latitude",
    subGroupCode: "SUB-LATITUDE",
    subGroupName: "Latitude",
    itemGroupId: "grp-it",
    parentSubGroupId: "sub-dell-series",
    description: "Latitude 5000 & 7000 enterprise series",
    status: "Active",
  },
  {
    id: "sub-game-lap",
    subGroupCode: "SUB-GAME-LAP",
    subGroupName: "Gaming Laptop",
    itemGroupId: "grp-it",
    parentSubGroupId: "sub-laptop",
    description: "High-spec workstations with discrete GPU acceleration",
    status: "Active",
  },
  {
    id: "sub-desktop",
    subGroupCode: "SUB-DESK",
    subGroupName: "Desktop",
    itemGroupId: "grp-it",
    parentSubGroupId: "sub-comp",
    description: "Tower, SFF, and all-in-one workstations",
    status: "Active",
  },
  {
    id: "sub-net",
    subGroupCode: "SUB-NET",
    subGroupName: "Networking Equipment",
    itemGroupId: "grp-it",
    parentSubGroupId: null,
    description: "Switches, routers, APs, and network distribution gear",
    status: "Active",
  },
  {
    id: "sub-router",
    subGroupCode: "SUB-ROUTER",
    subGroupName: "Router",
    itemGroupId: "grp-it",
    parentSubGroupId: "sub-net",
    description: "Edge and core network routing devices",
    status: "Active",
  },
  {
    id: "sub-switch",
    subGroupCode: "SUB-SWITCH",
    subGroupName: "Switch",
    itemGroupId: "grp-it",
    parentSubGroupId: "sub-net",
    description: "Managed Layer 2/3 PoE distribution switches",
    status: "Active",
  },
  {
    id: "sub-ap",
    subGroupCode: "SUB-AP",
    subGroupName: "Access Point",
    itemGroupId: "grp-it",
    parentSubGroupId: "sub-net",
    description: "Wi-Fi 6 enterprise wireless access points",
    status: "Active",
  },

  // Office Supplies Tree
  {
    id: "sub-paper",
    subGroupCode: "SUB-PAP",
    subGroupName: "Paper Products",
    itemGroupId: "grp-office",
    parentSubGroupId: null,
    description: "Printing papers, notebooks, and packaging board",
    status: "Active",
  },
  {
    id: "sub-a4",
    subGroupCode: "SUB-A4",
    subGroupName: "A4 Printing Paper",
    itemGroupId: "grp-office",
    parentSubGroupId: "sub-paper",
    description: "80 GSM premium white photocopy paper reams",
    status: "Active",
  },

  // Raw Materials Tree
  {
    id: "sub-yarn",
    subGroupCode: "SUB-YARN",
    subGroupName: "Yarn & Fibers",
    itemGroupId: "grp-raw",
    parentSubGroupId: null,
    description: "Spun yarns, filaments, and natural cotton fibers",
    status: "Active",
  },
  {
    id: "sub-cotton",
    subGroupCode: "SUB-COTTON",
    subGroupName: "Cotton Yarn",
    itemGroupId: "grp-raw",
    parentSubGroupId: "sub-yarn",
    description: "Combed and carded ring spun cotton yarns",
    status: "Active",
  },
  {
    id: "sub-comb-30",
    subGroupCode: "SUB-COMB-30",
    subGroupName: "Combed 30s/1",
    itemGroupId: "grp-raw",
    parentSubGroupId: "sub-cotton",
    description: "Single jersey knitting yarn Ne 30/1 combed",
    status: "Active",
  },
  {
    id: "sub-freight",
    subGroupCode: "SUB-FRT",
    subGroupName: "Freight & Transport Charges",
    itemGroupId: "grp-service",
    parentSubGroupId: null,
    description: "Inward & outward shipping, carriage and transport",
    status: "Active",
    serviceFlag: true,
  },
  {
    id: "sub-loading",
    subGroupCode: "SUB-LOAD",
    subGroupName: "Loading & Handling Services",
    itemGroupId: "grp-service",
    parentSubGroupId: null,
    description: "Loading, unloading, and warehouse porter handling services",
    status: "Active",
    serviceFlag: true,
  },
  {
    id: "sub-srv-maint",
    subGroupCode: "SUB-MAINT",
    subGroupName: "Maintenance & Repair Services",
    itemGroupId: "grp-service",
    parentSubGroupId: null,
    description: "Equipment overhaul, repair and contract service jobs",
    status: "Active",
    serviceFlag: true,
  },
];

export const DEFAULT_ITEM_CATEGORIES: ItemCategory[] = [
  {
    id: "cat-1",
    categoryCode: "CAT-COTTON-YARN",
    categoryName: "Cotton Yarn",
    parentCategoryId: "grp-2",
    categoryType: "Direct Material",
    isInventoryItem: true,
    isAssetItem: false,
    isConsumable: false,
    isService: false,
    status: "Active",
    description: "Pure combed and carded cotton yarns of diverse counts",
  },
  {
    id: "cat-2",
    categoryCode: "CAT-REACTIVE-DYES",
    categoryName: "Reactive Dyestuffs",
    parentCategoryId: "grp-3",
    categoryType: "Direct Material",
    isInventoryItem: true,
    isAssetItem: false,
    isConsumable: false,
    isService: false,
    status: "Active",
    description: "Cold and hot reactive dyes for cotton and viscose dyeing",
  },
  {
    id: "cat-3",
    categoryCode: "CAT-MACH-SPARE",
    categoryName: "Knitting Spares",
    parentCategoryId: "grp-4",
    categoryType: "Indirect Material",
    isInventoryItem: true,
    isAssetItem: false,
    isConsumable: true,
    isService: false,
    status: "Active",
    description: "Needles, sinkers, yarn feeders and ceramic guides",
  },
  {
    id: "cat-4",
    categoryCode: "CAT-IT-LAPTOP",
    categoryName: "Laptops & Notebooks",
    parentCategoryId: "grp-5",
    categoryType: "Capex",
    isInventoryItem: true,
    isAssetItem: true,
    isConsumable: false,
    isService: false,
    status: "Active",
    description: "Corporate notebooks, workstations, and thin laptops",
  },
  {
    id: "cat-5",
    categoryCode: "CAT-OFFICE-PAPER",
    categoryName: "A4 Printing Paper",
    parentCategoryId: "grp-6",
    categoryType: "Indirect Material",
    isInventoryItem: true,
    isAssetItem: false,
    isConsumable: true,
    isService: false,
    status: "Active",
    description: "Standard 80 GSM and 70 GSM white paper reams",
  },
];

export const DEFAULT_BRANDS: Brand[] = [
  {
    id: "brd-1",
    brandCode: "BRD-GROZ",
    brandName: "Groz-Beckert",
    manufacturer: "Groz-Beckert KG",
    countryOfOrigin: "Germany",
    website: "https://www.groz-beckert.com",
    description: "World-leading manufacturer of industrial knitting and sewing machine needles",
    status: "Active",
  },
  {
    id: "brd-2",
    brandCode: "BRD-DELL",
    brandName: "Dell Technologies",
    manufacturer: "Dell Inc.",
    countryOfOrigin: "United States",
    website: "https://www.dell.com",
    description: "Enterprise latitude laptops, optiplex desktops and poweredge servers",
    status: "Active",
  },
  {
    id: "brd-3",
    brandCode: "BRD-HUNTS",
    brandName: "Huntsman",
    manufacturer: "Huntsman Textile Effects",
    countryOfOrigin: "Switzerland",
    website: "https://www.huntsman.com",
    description: "High-grade certified textile dyes and chemical treatments",
    status: "Active",
  },
  {
    id: "brd-4",
    brandCode: "BRD-HP",
    brandName: "HP",
    manufacturer: "HP Inc.",
    countryOfOrigin: "United States",
    website: "https://www.hp.com",
    description: "LaserJet printers, toner cartridges, and enterprise computers",
    status: "Active",
  },
  {
    id: "brd-5",
    brandCode: "BRD-DOUBLEA",
    brandName: "Double A",
    manufacturer: "Double A Paper Co.",
    countryOfOrigin: "Thailand",
    website: "https://www.doubleapaper.com",
    description: "Premium copy paper with high opacity and smoothness",
    status: "Active",
  },
];

export const DEFAULT_UOMS: UOM[] = [
  {
    id: "uom-1",
    uomCode: "PCS",
    uomName: "Piece",
    uomType: "Count",
    decimalAllowed: false,
    conversionFactor: 1,
    status: "Active",
    description: "Single individual unit count",
  },
  {
    id: "uom-2",
    uomCode: "KG",
    uomName: "Kilogram",
    uomType: "Weight",
    decimalAllowed: true,
    conversionFactor: 1,
    status: "Active",
    description: "Standard SI unit of weight",
  },
  {
    id: "uom-3",
    uomCode: "LTR",
    uomName: "Liter",
    uomType: "Volume",
    decimalAllowed: true,
    conversionFactor: 1,
    status: "Active",
    description: "Liquid volume measure",
  },
  {
    id: "uom-4",
    uomCode: "METER",
    uomName: "Meter",
    uomType: "Length",
    decimalAllowed: true,
    conversionFactor: 1,
    status: "Active",
    description: "Linear measure for fabric and cables",
  },
  {
    id: "uom-5",
    uomCode: "BOX",
    uomName: "Box",
    uomType: "Packaging",
    decimalAllowed: false,
    baseUOM: "PCS",
    conversionFactor: 12,
    status: "Active",
    description: "Box container holding sub-items",
    conversions: [{ fromUOM: "BOX", toUOM: "PCS", factor: 12 }],
  },
  {
    id: "uom-6",
    uomCode: "CARTON",
    uomName: "Carton",
    uomType: "Packaging",
    decimalAllowed: false,
    baseUOM: "BOX",
    conversionFactor: 10,
    status: "Active",
    description: "Shipping master carton",
    conversions: [{ fromUOM: "CARTON", toUOM: "BOX", factor: 10 }],
  },
  {
    id: "uom-7",
    uomCode: "TON",
    uomName: "Metric Ton",
    uomType: "Weight",
    decimalAllowed: true,
    baseUOM: "KG",
    conversionFactor: 1000,
    status: "Active",
    description: "1,000 Kilograms bulk metric weight",
    conversions: [{ fromUOM: "TON", toUOM: "KG", factor: 1000 }],
  },
  {
    id: "uom-8",
    uomCode: "REAM",
    uomName: "Ream (500 Sheets)",
    uomType: "Count",
    decimalAllowed: false,
    conversionFactor: 500,
    status: "Active",
    description: "Paper package consisting of 500 sheets",
  },
  {
    id: "uom-9",
    uomCode: "SET",
    uomName: "Set",
    uomType: "Count",
    decimalAllowed: false,
    conversionFactor: 1,
    status: "Active",
    description: "Combination set of complementary components",
  },
];

export const DEFAULT_SPECIFICATIONS: ItemSpecification[] = [
  {
    id: "sp-1",
    specificationCode: "SPEC-PROC",
    specificationName: "Processor Model",
    specificationType: "Technical",
    dataType: "Dropdown",
    dropdownOptions: [
      "Intel Core i5-1340P",
      "Intel Core i7-1370P",
      "AMD Ryzen 5 7530U",
      "Apple M3",
    ],
    mandatory: true,
    status: "Active",
    description: "CPU processor model and generation",
  },
  {
    id: "sp-2",
    specificationCode: "SPEC-RAM",
    specificationName: "RAM Capacity",
    specificationType: "Technical",
    dataType: "Dropdown",
    dropdownOptions: ["8 GB", "16 GB", "32 GB", "64 GB"],
    unit: "GB",
    mandatory: true,
    status: "Active",
    description: "System installed memory size",
  },
  {
    id: "sp-3",
    specificationCode: "SPEC-STORAGE",
    specificationName: "SSD Storage Capacity",
    specificationType: "Technical",
    dataType: "Dropdown",
    dropdownOptions: ["256 GB NVMe", "512 GB NVMe", "1 TB NVMe", "2 TB NVMe"],
    unit: "GB",
    mandatory: true,
    status: "Active",
    description: "High speed solid state storage",
  },
  {
    id: "sp-4",
    specificationCode: "SPEC-DISPLAY",
    specificationName: "Display Size & Panel",
    specificationType: "Physical",
    dataType: "Dropdown",
    dropdownOptions: ["14.0 inch FHD IPS", "15.6 inch FHD IPS", "16.0 inch QHD IPS"],
    unit: "inch",
    mandatory: false,
    status: "Active",
    description: "Screen visual dimension and resolution",
  },
  {
    id: "sp-5",
    specificationCode: "SPEC-OS",
    specificationName: "Operating System",
    specificationType: "General",
    dataType: "Dropdown",
    dropdownOptions: [
      "Windows 11 Pro 64-Bit",
      "Windows 11 Home",
      "Ubuntu Linux 24.04",
      "macOS Sonoma",
    ],
    mandatory: true,
    status: "Active",
    description: "Factory preinstalled operating system",
  },
  {
    id: "sp-6",
    specificationCode: "SPEC-GSM",
    specificationName: "Fabric Weight / GSM",
    specificationType: "Physical",
    dataType: "Number",
    unit: "GSM",
    mandatory: true,
    status: "Active",
    description: "Grams per square meter fabric density",
  },
  {
    id: "sp-7",
    specificationCode: "SPEC-COMPOSITION",
    specificationName: "Fiber Composition",
    specificationType: "Chemical",
    dataType: "Text",
    mandatory: true,
    status: "Active",
    description: "Percentage ratio of cotton, polyester, elastane",
  },
];

export const DEFAULT_ITEMS: ItemProductMaster[] = [
  {
    id: "itm-1",
    itemCode: "ITM-YRN-30-1",
    itemName: "100% Combed Cotton Yarn Ne 30/1",
    itemGroupId: "grp-raw",
    itemGroupName: "Raw Materials",
    subGroupId: "sub-comb-30",
    subGroupName: "Combed 30s/1",
    subGroupBreadcrumb: "Raw Materials > Yarn & Fibers > Cotton Yarn > Combed 30s/1",
    itemCategoryId: "cat-1",
    itemCategory: "Cotton Yarn",
    itemType: "Goods",
    specification: "100% Combed Cotton, Ne 30/1 ring spun, Auto coned, high tensile strength",
    brand: "Groz-Beckert",
    model: "Ne 30/1 Ring Spun",
    partNumber: "YRN-COT-301",
    origin: "Bangladesh",
    status: "Active",
    createDate: "2026-08-25",
    purchaseUOM: "KG",
    stockUOM: "KG",
    issueUOM: "KG",
    conversionFactor: 1,
    minimumStock: 5000,
    maximumStock: 50000,
    reorderLevel: 10000,
    safetyStock: 3000,
    leadTimeDays: 7,
    batchTrackingRequired: true,
    serialNumberTrackingRequired: false,
    expiryTrackingRequired: false,
    defaultWarehouse: "WH-PKCL-01",
    defaultBin: "BIN-A1-01",
    preferredSupplier: "Apex Textile Chemical & Dyestuffs Ltd",
    standardPurchasePrice: 420,
    currency: "BDT",
    specifications: [
      { specCode: "SPEC-COMPOSITION", specName: "Fiber Composition", value: "100% Combed Cotton" },
    ],
  },
  {
    id: "itm-2",
    itemCode: "ITM-IT-LAT-5440",
    itemName: "Dell Latitude 5440 Core i7 Business Laptop",
    itemGroupId: "grp-it",
    itemGroupName: "IT Equipment",
    subGroupId: "sub-latitude",
    subGroupName: "Latitude",
    subGroupBreadcrumb: "IT Equipment > Computer Equipment > Laptop > Business Laptop > Dell Series > Latitude",
    itemCategoryId: "cat-4",
    itemCategory: "Laptops & Notebooks",
    itemType: "Asset",
    specification: "13th Gen Intel Core i7-1370P, 16GB DDR5, 512GB NVMe SSD, 14 FHD Anti-Glare IPS, Windows 11 Pro",
    brand: "Dell Technologies",
    model: "Latitude 5440",
    partNumber: "DELL-LAT-5440-I7",
    origin: "Malaysia",
    status: "Active",
    createDate: "2026-09-02",
    purchaseUOM: "PCS",
    stockUOM: "PCS",
    issueUOM: "PCS",
    conversionFactor: 1,
    minimumStock: 5,
    maximumStock: 40,
    reorderLevel: 10,
    safetyStock: 3,
    leadTimeDays: 3,
    batchTrackingRequired: false,
    serialNumberTrackingRequired: true,
    expiryTrackingRequired: false,
    defaultWarehouse: "WH-PTL-03",
    defaultBin: "BIN-IT-04",
    preferredSupplier: "Smart Solution Technologies BD",
    standardPurchasePrice: 125000,
    currency: "BDT",
    warrantyPeriod: "36 Months ProSupport",
    specifications: [
      { specCode: "SPEC-PROC", specName: "Processor Model", value: "Intel Core i7-1370P" },
      { specCode: "SPEC-RAM", specName: "RAM Capacity", value: "16 GB" },
      { specCode: "SPEC-STORAGE", specName: "SSD Storage Capacity", value: "512 GB NVMe" },
      { specCode: "SPEC-DISPLAY", specName: "Display Size & Panel", value: "14.0 inch FHD IPS" },
      { specCode: "SPEC-OS", specName: "Operating System", value: "Windows 11 Pro 64-Bit" },
    ],
  },
  {
    id: "itm-3",
    itemCode: "ITM-PAP-A4-80",
    itemName: "Double A Premium A4 Printing Paper 80 GSM",
    itemGroupId: "grp-office",
    itemGroupName: "Office Supplies",
    subGroupId: "sub-a4",
    subGroupName: "A4 Printing Paper",
    subGroupBreadcrumb: "Office Supplies > Paper Products > A4 Printing Paper",
    itemCategoryId: "cat-6",
    itemCategory: "Paper & Stationery",
    itemType: "Goods",
    specification: "80 GSM high brightness multi-purpose photocopy & laser printing paper, 500 sheets/ream",
    brand: "Double A",
    model: "Standard 80 GSM",
    partNumber: "DA-A4-80-500",
    origin: "Thailand",
    status: "Active",
    createDate: "2026-09-10",
    purchaseUOM: "BOX",
    stockUOM: "REAM",
    issueUOM: "REAM",
    conversionFactor: 5,
    minimumStock: 20,
    maximumStock: 200,
    reorderLevel: 50,
    safetyStock: 15,
    leadTimeDays: 2,
    batchTrackingRequired: false,
    serialNumberTrackingRequired: false,
    expiryTrackingRequired: false,
    defaultWarehouse: "WH-PTL-03",
    preferredSupplier: "Dacca Accessories & Thread Industries",
    standardPurchasePrice: 480,
    currency: "BDT",
    specifications: [{ specCode: "SPEC-GSM", specName: "Fabric Weight / GSM", value: "80" }],
  },
  {
    id: "itm-srv-frt",
    itemCode: "SRV-FRT-01",
    itemName: "Freight & Carriage Inward (Road Transport)",
    itemGroupId: "grp-service",
    itemGroupName: "Services & Logistical Charges",
    subGroupId: "sub-freight",
    subGroupName: "Freight & Transport Charges",
    subGroupBreadcrumb: "Services & Logistical Charges > Freight & Transport Charges",
    itemCategoryId: "cat-1",
    itemCategory: "General Service",
    itemType: "Service",
    serviceFlag: true,
    specification: "Standard overland freight transportation and delivery charges per vehicle trip",
    origin: "Bangladesh",
    status: "Active",
    createDate: "2026-09-01",
    purchaseUOM: "Trip",
    stockUOM: "Trip",
    conversionFactor: 1,
    minimumStock: 0,
    maximumStock: 0,
    reorderLevel: 0,
    safetyStock: 0,
    batchTrackingRequired: false,
    serialNumberTrackingRequired: false,
    standardPurchasePrice: 4500,
    currency: "BDT",
    valuationMethod: "FIFO",
  },
  {
    id: "itm-srv-load",
    itemCode: "SRV-LOAD-02",
    itemName: "Loading & Unloading / Labour Handling",
    itemGroupId: "grp-service",
    itemGroupName: "Services & Logistical Charges",
    subGroupId: "sub-loading",
    subGroupName: "Loading & Handling Services",
    subGroupBreadcrumb: "Services & Logistical Charges > Loading & Handling Services",
    itemCategoryId: "cat-1",
    itemCategory: "General Service",
    itemType: "Service",
    serviceFlag: true,
    specification: "Manual cargo loading, unloading and warehouse handling operations",
    origin: "Bangladesh",
    status: "Active",
    createDate: "2026-09-01",
    purchaseUOM: "Job",
    stockUOM: "Job",
    conversionFactor: 1,
    minimumStock: 0,
    maximumStock: 0,
    reorderLevel: 0,
    safetyStock: 0,
    batchTrackingRequired: false,
    serialNumberTrackingRequired: false,
    standardPurchasePrice: 2500,
    currency: "BDT",
    valuationMethod: "FIFO",
  },
  {
    id: "itm-srv-maint",
    itemCode: "SRV-MAINT-03",
    itemName: "Machinery Preventive Maintenance & Overhaul",
    itemGroupId: "grp-service",
    itemGroupName: "Services & Logistical Charges",
    subGroupId: "sub-srv-maint",
    subGroupName: "Maintenance & Repair Services",
    subGroupBreadcrumb: "Services & Logistical Charges > Maintenance & Repair Services",
    itemCategoryId: "cat-1",
    itemCategory: "Technical Service",
    itemType: "Service",
    serviceFlag: true,
    specification: "Comprehensive mechanical diagnostic, calibration, servicing and motor overhaul",
    origin: "Bangladesh",
    status: "Active",
    createDate: "2026-09-01",
    purchaseUOM: "Job",
    stockUOM: "Job",
    conversionFactor: 1,
    minimumStock: 0,
    maximumStock: 0,
    reorderLevel: 0,
    safetyStock: 0,
    batchTrackingRequired: false,
    serialNumberTrackingRequired: false,
    standardPurchasePrice: 35000,
    currency: "BDT",
    valuationMethod: "LIFO",
  },
  {
    id: "itm-srv-qa",
    itemCode: "SRV-QA-04",
    itemName: "Laboratory QA & Textile Fabric Testing Service",
    itemGroupId: "grp-service",
    itemGroupName: "Services & Logistical Charges",
    subGroupId: "sub-srv-maint",
    subGroupName: "Maintenance & Repair Services",
    subGroupBreadcrumb: "Services & Logistical Charges > Maintenance & Repair Services",
    itemCategoryId: "cat-1",
    itemCategory: "Technical Service",
    itemType: "Service",
    serviceFlag: true,
    specification: "GSM, shrinkage, colorfastness, and tensile strength laboratory testing batch",
    origin: "Bangladesh",
    status: "Active",
    createDate: "2026-09-01",
    purchaseUOM: "Batch",
    stockUOM: "Batch",
    conversionFactor: 1,
    minimumStock: 0,
    maximumStock: 0,
    reorderLevel: 0,
    safetyStock: 0,
    batchTrackingRequired: false,
    serialNumberTrackingRequired: false,
    standardPurchasePrice: 8500,
    currency: "BDT",
    valuationMethod: "FIFO",
  },
];

export const DEFAULT_TAX_CONFIGS: TaxVatConfig[] = [
  {
    id: "tax-1",
    taxCode: "VAT-STD-15",
    taxName: "Standard VAT 15%",
    taxType: "VAT",
    rate: 15.0,
    calculationMethod: "Percentage",
    applicableOn: "Base Amount",
    effectiveFrom: "2024-07-01",
    effectiveTo: "2030-06-30",
    recoverable: true,
    glAccount: "2040-VAT-Output-Payable",
    status: "Active",
    remarks: "Standard input tax rebate available for manufacturers",
  },
  {
    id: "tax-2",
    taxCode: "AIT-SUP-03",
    taxName: "Advance Income Tax (AIT) on Goods 3%",
    taxType: "AIT",
    rate: 3.0,
    calculationMethod: "Percentage",
    applicableOn: "Gross Amount",
    effectiveFrom: "2024-07-01",
    effectiveTo: "2030-06-30",
    recoverable: false,
    glAccount: "2045-AIT-Payable-Deduction",
    status: "Active",
    remarks: "Deducted at source under section 52 of Income Tax Act 2023",
  },
  {
    id: "tax-3",
    taxCode: "VDS-SERV-10",
    taxName: "VAT Deducted at Source (VDS) Services 10%",
    taxType: "Withholding Tax",
    rate: 10.0,
    calculationMethod: "Percentage",
    applicableOn: "Base Amount",
    effectiveFrom: "2024-07-01",
    effectiveTo: "2030-06-30",
    recoverable: false,
    glAccount: "2048-VDS-Payable-Services",
    status: "Active",
    remarks: "Applicable on transport, consultancy and IT service invoices",
  },
];

export const DEFAULT_PAYMENT_TERMS: PaymentTerm[] = [
  {
    id: "pt-1",
    termCode: "IMMEDIATE",
    termName: "Immediate Cash / Cheque",
    paymentType: "Immediate",
    creditDays: 0,
    advancePercentage: 0,
    retentionPercentage: 0,
    dueDateRule: "Invoice Date",
    description: "Payment released upon invoice handover",
    status: "Active",
  },
  {
    id: "pt-2",
    termCode: "COD",
    termName: "Cash On Delivery (COD)",
    paymentType: "Immediate",
    creditDays: 0,
    advancePercentage: 0,
    retentionPercentage: 0,
    dueDateRule: "Delivery Date",
    description: "Payment upon goods receipt and verification",
    status: "Active",
  },
  {
    id: "pt-3",
    termCode: "ADV-30",
    termName: "Advance 30% - Balance upon Delivery",
    paymentType: "Advance",
    creditDays: 0,
    advancePercentage: 30,
    retentionPercentage: 0,
    dueDateRule: "Delivery Date",
    description: "30% upfront booking deposit, balance on delivery",
    status: "Active",
  },
  {
    id: "pt-4",
    termCode: "NET-15",
    termName: "Net 15 Days",
    paymentType: "Credit",
    creditDays: 15,
    advancePercentage: 0,
    retentionPercentage: 0,
    dueDateRule: "GRN Date",
    description: "Payment due within 15 calendar days of GRN",
    status: "Active",
  },
  {
    id: "pt-5",
    termCode: "NET-30",
    termName: "Net 30 Days",
    paymentType: "Credit",
    creditDays: 30,
    advancePercentage: 0,
    retentionPercentage: 0,
    dueDateRule: "GRN Date",
    description: "Standard commercial credit of 30 days",
    status: "Active",
  },
  {
    id: "pt-6",
    termCode: "NET-60",
    termName: "Net 60 Days",
    paymentType: "Credit",
    creditDays: 60,
    advancePercentage: 0,
    retentionPercentage: 0,
    dueDateRule: "GRN Date",
    description: "Extended supplier credit period",
    status: "Active",
  },
  {
    id: "pt-7",
    termCode: "LC-90",
    termName: "Letter of Credit (LC 90 Days)",
    paymentType: "LC",
    creditDays: 90,
    advancePercentage: 0,
    retentionPercentage: 0,
    dueDateRule: "Delivery Date",
    description: "Back-to-back LC sight or deferred 90 days",
    status: "Active",
  },
];

export const DEFAULT_DELIVERY_TERMS: DeliveryTerm[] = [
  {
    id: "dt-1",
    termCode: "SUP-DELIVERY",
    termName: "Supplier Delivery to Factory",
    deliveryMethod: "Supplier Delivery",
    deliveryLocation: "Buyer Factory Gate",
    leadTimeDays: 3,
    transportationResponsibility: "Supplier",
    deliveryCostResponsibility: "Supplier",
    partialDeliveryAllowed: true,
    status: "Active",
    description: "Vendor delivers directly to our factory premises at their cost",
  },
  {
    id: "dt-2",
    termCode: "BUYER-PICKUP",
    termName: "Buyer Ex-Warehouse Pickup",
    deliveryMethod: "Buyer Pickup",
    deliveryLocation: "Supplier Depot",
    leadTimeDays: 1,
    transportationResponsibility: "Buyer",
    deliveryCostResponsibility: "Buyer",
    partialDeliveryAllowed: true,
    status: "Active",
    description: "Our logistics team collects goods from vendor warehouse",
  },
  {
    id: "dt-3",
    termCode: "COURIER",
    termName: "Expedited Express Courier",
    deliveryMethod: "Courier",
    deliveryLocation: "Head Office Reception",
    leadTimeDays: 2,
    transportationResponsibility: "Third-Party",
    deliveryCostResponsibility: "Supplier",
    partialDeliveryAllowed: false,
    status: "Active",
    description: "Fast courier delivery for samples, emergency parts and documents",
  },
  {
    id: "dt-4",
    termCode: "CIF-CTG",
    termName: "CIF Chittagong Port (Incoterms 2020)",
    deliveryMethod: "Sea",
    deliveryLocation: "Chittagong Sea Port",
    leadTimeDays: 30,
    transportationResponsibility: "Supplier",
    deliveryCostResponsibility: "Supplier",
    partialDeliveryAllowed: true,
    status: "Active",
    description: "Cost, Insurance and Freight paid up to Chittagong Port",
  },
];

export const DEFAULT_CURRENCIES: Currency[] = [
  {
    id: "cur-1",
    currencyCode: "BDT",
    currencyName: "Bangladeshi Taka",
    symbol: "৳",
    decimalPlaces: 2,
    exchangeRate: 1.0,
    rateDate: "2026-09-20",
    baseCurrency: true,
    status: "Active",
  },
  {
    id: "cur-2",
    currencyCode: "USD",
    currencyName: "United States Dollar",
    symbol: "$",
    decimalPlaces: 2,
    exchangeRate: 122.5,
    rateDate: "2026-09-20",
    baseCurrency: false,
    status: "Active",
  },
  {
    id: "cur-3",
    currencyCode: "EUR",
    currencyName: "Euro",
    symbol: "€",
    decimalPlaces: 2,
    exchangeRate: 133.2,
    rateDate: "2026-09-20",
    baseCurrency: false,
    status: "Active",
  },
  {
    id: "cur-4",
    currencyCode: "GBP",
    currencyName: "British Pound Sterling",
    symbol: "£",
    decimalPlaces: 2,
    exchangeRate: 156.4,
    rateDate: "2026-09-20",
    baseCurrency: false,
    status: "Active",
  },
  {
    id: "cur-5",
    currencyCode: "CNY",
    currencyName: "Chinese Yuan Renminbi",
    symbol: "¥",
    decimalPlaces: 2,
    exchangeRate: 17.15,
    rateDate: "2026-09-20",
    baseCurrency: false,
    status: "Active",
  },
];

export const DEFAULT_BUDGETS: Budget[] = [
  {
    id: "bgt-1",
    budgetCode: "BGT-2026-IT-01",
    budgetName: "Annual IT Infrastructure & Hardware Modernization",
    employeeName: "Tahmid Afsar Shapno",
    department: "Information Technology",
    designation: "Asst. Manager",
    createDate: "2026-07-01",
    currency: "BDT",
    budgetPeriod: "Yearly",
    budgetYear: "2026-2027",
    budgetType: "Capital Budget",
    costCenter: "CC-IT-901",
    project: "Digital Workplace Upgrade",
    effectiveFrom: "2026-07-01",
    effectiveTo: "2027-06-30",
    description:
      "Approved capital expenditure for employee laptops, core routers and cloud servers",
    budgetLines: [
      {
        id: "bl-1",
        budgetHead: "Laptops & Notebooks",
        itemCategory: "Laptops & Notebooks",
        itemCode: "ITM-IT-LAT-5440",
        allocatedAmount: 5000000,
        monthlyAllocation: 416666,
        remarks: "40 Dell Laptops replacement",
      },
      {
        id: "bl-2",
        budgetHead: "Network Switches & Access Points",
        itemCategory: "Network Devices",
        allocatedAmount: 1500000,
        monthlyAllocation: 125000,
        remarks: "Cisco Wi-Fi 6 APs for plants",
      },
      {
        id: "bl-3",
        budgetHead: "Stationery & IT Consumables",
        itemCategory: "A4 Printing Paper",
        allocatedAmount: 500000,
        monthlyAllocation: 41666,
        remarks: "Toners, cartridges and paper",
      },
    ],
    originalBudget: 7000000,
    additionalAllocation: 500000,
    budgetReduction: 0,
    revisedBudget: 7500000,
    actualUtilized: 2800000,
    committedAmount: 1200000,
    availableBudget: 3500000,
    status: "Approved",
  },
  {
    id: "bgt-2",
    budgetCode: "BGT-2026-PRD-02",
    budgetName: "Quarterly Spinning Maintenance & Chemical Allocation",
    employeeName: "Nazmul Huda",
    department: "Production & Maintenance",
    designation: "Sr. Executive",
    createDate: "2026-07-01",
    currency: "BDT",
    budgetPeriod: "Monthly",
    budgetYear: "2026-2027",
    budgetType: "Operating Budget",
    costCenter: "CC-PRD-401",
    effectiveFrom: "2026-07-01",
    effectiveTo: "2026-09-30",
    description: "Operational expenditure for spinning rings, lubricants and chemical auxiliaries",
    budgetLines: [
      {
        id: "bl-4",
        budgetHead: "Knitting Spares",
        itemCategory: "Knitting Spares",
        allocatedAmount: 2500000,
        monthlyAllocation: 833333,
        remarks: "Needles and sinkers replacement",
      },
      {
        id: "bl-5",
        budgetHead: "Dyes & Chemicals",
        itemCategory: "Reactive Dyestuffs",
        allocatedAmount: 4500000,
        monthlyAllocation: 1500000,
        remarks: "Reactive dyestuff replenishment",
      },
    ],
    originalBudget: 7000000,
    additionalAllocation: 0,
    budgetReduction: 200000,
    revisedBudget: 6800000,
    actualUtilized: 3100000,
    committedAmount: 900000,
    availableBudget: 2800000,
    status: "Approved",
  },
];

export const DEFAULT_BUDGET_APPROVALS: BudgetApproval[] = [
  {
    id: "bapp-1",
    budgetId: "bgt-1",
    budgetCode: "BGT-2026-IT-01",
    budgetYear: "2026-2027",
    department: "Information Technology",
    totalBudget: 7500000,
    submittedBy: "Kazi Ashiqur Rahman (Head of IT)",
    submittedDate: "2026-06-15",
    approvalLevel: "Level 3 - Managing Director",
    reviewer: "Rafiqul Islam (Managing Director)",
    decision: "Approved",
    remarks: "Approved as per strategic enterprise digitization roadmap.",
    approvalDate: "2026-06-25",
  },
  {
    id: "bapp-2",
    budgetId: "bgt-2",
    budgetCode: "BGT-2026-PRD-02",
    budgetYear: "2026-2027",
    department: "Production & Maintenance",
    totalBudget: 6800000,
    submittedBy: "Engr. Tanvir Ahmed (Plant Head)",
    submittedDate: "2026-06-18",
    approvalLevel: "Level 2 - CFO",
    reviewer: "A. K. Azad (Chief Financial Officer)",
    decision: "Approved",
    remarks: "Approved with 200k minor reduction on spares line.",
    approvalDate: "2026-06-28",
  },
];

export const DEFAULT_APPROVAL_AUTHORITIES: ApprovalAuthority[] = [
  {
    id: "auth-1",
    authorityCode: "AUTH-LVL-1",
    authorityName: "Department Head / Plant Manager Level 1",
    organization: "Pakiza Knit Composite Ltd",
    department: "All Departments",
    roleDesignation: "Department Head / General Manager",
    approvalType: "Purchase Requisition",
    minimumAmount: 0,
    maximumAmount: 50000,
    approvalLevel: 1,
    effectiveFrom: "2024-01-01",
    effectiveTo: "2030-12-31",
    status: "Active",
  },
  {
    id: "auth-2",
    authorityCode: "AUTH-LVL-2",
    authorityName: "Director / CFO Operational Approval Level 2",
    organization: "Pakiza Knit Composite Ltd",
    department: "Finance & Accounts",
    roleDesignation: "Chief Financial Officer / Director",
    approvalType: "Purchase Order",
    minimumAmount: 50001,
    maximumAmount: 500000,
    approvalLevel: 2,
    effectiveFrom: "2024-01-01",
    effectiveTo: "2030-12-31",
    status: "Active",
  },
  {
    id: "auth-3",
    authorityCode: "AUTH-LVL-3",
    authorityName: "Managing Director / Board Approval Level 3",
    organization: "Pakiza Knit Composite Ltd",
    department: "Executive Management",
    roleDesignation: "Managing Director",
    approvalType: "Budget",
    minimumAmount: 500001,
    maximumAmount: 999999999,
    approvalLevel: 3,
    effectiveFrom: "2024-01-01",
    effectiveTo: "2030-12-31",
    status: "Active",
  },
];

export const DEFAULT_DOCUMENT_SERIES: DocumentNumberSeries[] = [
  {
    id: "num-1",
    documentType: "Purchase Requisition",
    numberingMethod: "Auto",
    prefix: "PR",
    separator: "-",
    resetFrequency: "Yearly",
    startingNumber: 1,
    numberLength: 6,
    currentNumber: 142,
    documentCode: "DOC-PR",
    numberFormat: "{PREFIX}-{NUM}",
    status: "Active",
  },
  {
    id: "num-2",
    documentType: "Request for Quotation",
    numberingMethod: "Auto",
    prefix: "RFQ",
    separator: "-",
    resetFrequency: "Yearly",
    startingNumber: 1,
    numberLength: 6,
    currentNumber: 88,
    documentCode: "DOC-RFQ",
    numberFormat: "{PREFIX}-{NUM}",
    status: "Active",
  },
  {
    id: "num-3",
    documentType: "Supplier Quotation",
    numberingMethod: "Auto",
    prefix: "SQ",
    separator: "-",
    resetFrequency: "Yearly",
    startingNumber: 1,
    numberLength: 6,
    currentNumber: 74,
    documentCode: "DOC-SQ",
    numberFormat: "{PREFIX}-{NUM}",
    status: "Active",
  },
  {
    id: "num-4",
    documentType: "Purchase Order",
    numberingMethod: "Auto",
    prefix: "PO",
    separator: "-",
    resetFrequency: "Yearly",
    startingNumber: 1,
    numberLength: 6,
    currentNumber: 485,
    documentCode: "DOC-PO",
    numberFormat: "{PREFIX}-{NUM}",
    status: "Active",
  },
  {
    id: "num-5",
    documentType: "Goods Receipt Note",
    numberingMethod: "Auto",
    prefix: "GRN",
    separator: "-",
    resetFrequency: "Yearly",
    startingNumber: 1,
    numberLength: 6,
    currentNumber: 312,
    documentCode: "DOC-GRN",
    numberFormat: "{PREFIX}-{NUM}",
    status: "Active",
  },
  {
    id: "num-6",
    documentType: "Supplier Bill",
    numberingMethod: "Auto",
    prefix: "BILL",
    separator: "-",
    resetFrequency: "Yearly",
    startingNumber: 1,
    numberLength: 6,
    currentNumber: 198,
    documentCode: "DOC-BIL",
    numberFormat: "{PREFIX}-{NUM}",
    status: "Active",
  },
  {
    id: "num-7",
    documentType: "Payment Voucher",
    numberingMethod: "Auto",
    prefix: "PV",
    separator: "-",
    resetFrequency: "Yearly",
    startingNumber: 1,
    numberLength: 6,
    currentNumber: 95,
    documentCode: "DOC-PV",
    numberFormat: "{PREFIX}-{NUM}",
    status: "Active",
  },
  {
    id: "num-8",
    documentType: "Budget Requisition",
    numberingMethod: "Auto",
    prefix: "BDG",
    separator: "-",
    resetFrequency: "Yearly",
    startingNumber: 1,
    numberLength: 6,
    currentNumber: 12,
    documentCode: "DOC-BGT",
    numberFormat: "{PREFIX}-{NUM}",
    status: "Active",
  },
];

// Helper to format Document Number preview based on Date Format
export function formatDocumentNumber(series: DocumentNumberSeries, num?: number): string {
  const n = num ?? (series.currentNumber ?? series.startingNumber ?? 1);
  const padded = n.toString().padStart(series.numberLength || 6, "0");
  const sep = series.separator === "None" ? "" : (series.separator || "-");
  const prefix = series.prefix || "DOC";

  const now = new Date();
  const YY = String(now.getFullYear()).slice(-2);
  const MM = String(now.getMonth() + 1).padStart(2, "0");

  switch (series.dateFormat) {
    case "Month + Year":
      // Example: PR-260900001
      return `${prefix}${sep}${YY}${MM}${padded}`;
    case "Year + Month":
      // Example: PR-2609-00001
      return `${prefix}${sep}${YY}${MM}${sep}${padded}`;
    case "Year-Month":
      // Example: PR-26-09-00001
      return `${prefix}${sep}${YY}${sep}${MM}${sep}${padded}`;
    case "Year":
      // Example: PR-26-00001
      return `${prefix}${sep}${YY}${sep}${padded}`;
    case "Month":
      // Example: PR-09-00001
      return `${prefix}${sep}${MM}${sep}${padded}`;
    case "Year + Number":
      // Example: PR-2600001
      return `${prefix}${sep}${YY}${padded}`;
    case "Month + Number":
      // Example: PR-0900001
      return `${prefix}${sep}${MM}${padded}`;
    case "None":
    default:
      // Standard format: PR-000001
      return `${prefix}${sep}${padded}`;
  }
}

// LocalStorage Persistence Wrapper with Safe Fallbacks
export function getStoredData<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (err) {
    console.error(`Error parsing stored data for key ${key}:`, err);
    return defaultValue;
  }
}

export function setStoredData<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving stored data for key ${key}:`, err);
  }
}
