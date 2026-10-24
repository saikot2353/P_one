import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  HeartHandshake,
  ChevronRight,
  Plus,
  Search,
  Printer,
  X,
  Trash2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Settings,
  Download,
  Landmark,
  Activity,
  Truck,
  Store,
  Layers,
  Repeat,
  Calendar,
  Building,
  User,
  Check,
  Play,
  Pause,
  Eye,
  FileText,
  DollarSign,
  TrendingUp,
  Sparkles,
  Info,
  CalendarClock,
  ShoppingBag,
  Banknote,
  Users,
  Filter,
  CheckSquare,
  MapPin,
  ArrowRight,
  ExternalLink,
  Paperclip,
  Upload,
  FileUp,
  Zap,
  CreditCard,
} from "lucide-react";

export const Route = createFileRoute("/zakat-list")({
  head: () => ({
    meta: [
      { title: "Zakat Management — CRIPTON" },
      {
        name: "description",
        content:
          "Oversee corporate Zakat allocations, purpose categorization, internal vs external segregation, in-kind asset purchase tracking, and automated recurring stipends.",
      },
    ],
  }),
  component: ZakatManagementPage,
});

// ==========================================
// 1. TYPES & DATA ARCHITECTURE
// ==========================================

// 1. Purpose Category (Management Directive)
export type ZakatPurposeCategory =
  | "Mosque/Madrasa"
  | "Medical Treatment"
  | "Vehicle"
  | "Farm Animal"
  | "Business Setup"
  | "Others";

// 2. Beneficiary Channel (Direct Staff vs. Via Agent vs. Direct External)
export type ZakatDisbursementChannel =
  | "Direct Employee"       // Direct Company Staff Beneficiary
  | "Via Employee Agent"    // Via Staff Representative
  | "Direct External";      // Direct Outside Person or Institution

// 3. Disbursement Mode (Cash vs. In-Kind Asset Purchased)
export type ZakatDisbursementMode =
  | "Cash Grant"            // Cash or Bank Transfer
  | "Asset Purchased";      // In-Kind Asset Purchased (Vehicle, Livestock, Store Setup)

// 4. Asset Details (when mode === "Asset Purchased")
export interface ZakatAssetDetails {
  assetType?: string;         // from master data / dropdown e.g. "Battery Electric Auto-Van / Easy Bike", "Dairy Cow"
  assetName: string;          // specific title / description
  assetQuantity?: string;     // e.g. "1 Unit", "2 Goats"
  vendorOrMarket?: string;    // e.g. "Sreepur Bazar", "Gafargaon Cattle Hat"
  invoiceRef?: string;        // Purchase voucher/receipt
  remarks?: string;           // Asset condition, warranty, handover location notes
}

// 5. Global Attachment Interface (Prescriptions, Vouchers, NID, Applications)
export interface ZakatAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
  dataUrl?: string;
  uploadedAt: string;
}

// 6. Master Data Catalog for Physical Assets
export interface ZakatAssetMasterItem {
  id: string;
  category: string;
  assetType: string;
  defaultQty: string;
  defaultVendorLocation?: string;
  suggestedPurpose: ZakatPurposeCategory;
}

export function getActiveZakatAssetMasterList(): ZakatAssetMasterItem[] {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("zakat_asset_master_items");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((it: any) => ({
            id: it.id,
            category: it.categoryName || it.category || "General Asset",
            assetType: it.assetType,
            defaultQty: it.defaultQty,
            defaultVendorLocation: it.defaultVendorLocation,
            suggestedPurpose: (it.suggestedPurpose as ZakatPurposeCategory) || "Business Setup",
          }));
        }
      } catch (e) {}
    }
  }
  return ZAKAT_ASSET_MASTER_DATA;
}

export const ZAKAT_ASSET_MASTER_DATA: ZakatAssetMasterItem[] = [
  // 1. Vehicle / Transport
  {
    id: "AST-VEH-01",
    category: "Vehicle / Transport",
    assetType: "Battery Electric Auto-Van / Easy Bike",
    defaultQty: "1 Unit",
    defaultVendorLocation: "Gazipur Auto Showroom",
    suggestedPurpose: "Vehicle",
  },
  {
    id: "AST-VEH-02",
    category: "Vehicle / Transport",
    assetType: "Manual Passenger Rickshaw",
    defaultQty: "1 Unit",
    defaultVendorLocation: "Sreepur Rickshaw Workshop",
    suggestedPurpose: "Vehicle",
  },
  {
    id: "AST-VEH-03",
    category: "Vehicle / Transport",
    assetType: "Flatbed Wooden Cargo Van (Pedaled)",
    defaultQty: "1 Unit",
    defaultVendorLocation: "Bhaluka Haat",
    suggestedPurpose: "Vehicle",
  },
  {
    id: "AST-VEH-04",
    category: "Vehicle / Transport",
    assetType: "Motorized 3-Wheeler Delivery Van",
    defaultQty: "1 Unit",
    defaultVendorLocation: "Mymensingh Motor Market",
    suggestedPurpose: "Vehicle",
  },

  // 2. Farm Animal / Livestock
  {
    id: "AST-ANI-01",
    category: "Farm Animal / Livestock",
    assetType: "Milch Dairy Cow / Heifer",
    defaultQty: "1 Cow",
    defaultVendorLocation: "Gafargaon Cattle Market",
    suggestedPurpose: "Farm Animal",
  },
  {
    id: "AST-ANI-02",
    category: "Farm Animal / Livestock",
    assetType: "Breeding Goats / Sheep Pair",
    defaultQty: "2 Goats",
    defaultVendorLocation: "Gafargaon Cattle Hat",
    suggestedPurpose: "Farm Animal",
  },
  {
    id: "AST-ANI-03",
    category: "Farm Animal / Livestock",
    assetType: "Beef Fattening Bull / Ox",
    defaultQty: "1 Bull",
    defaultVendorLocation: "Gafargaon Cattle Market",
    suggestedPurpose: "Farm Animal",
  },
  {
    id: "AST-ANI-04",
    category: "Farm Animal / Livestock",
    assetType: "Poultry Farming Starter Kit (Chicks & Feeder)",
    defaultQty: "25 Birds + Feeder Set",
    defaultVendorLocation: "Sreepur Poultry Feed Hub",
    suggestedPurpose: "Farm Animal",
  },

  // 3. Business Setup / Micro-Enterprise
  {
    id: "AST-BIZ-01",
    category: "Business Setup / Livelihood",
    assetType: "Tea Stall & Snack Kiosk Setup",
    defaultQty: "1 Complete Kiosk Set",
    defaultVendorLocation: "Gazipur Chowrasta Market",
    suggestedPurpose: "Business Setup",
  },
  {
    id: "AST-BIZ-02",
    category: "Business Setup / Livelihood",
    assetType: "Grocery Store Wholesale Initial Inventory",
    defaultQty: "1 Wholesale Inventory Lot",
    defaultVendorLocation: "Moulvibazar Wholesale Hub, Dhaka",
    suggestedPurpose: "Business Setup",
  },
  {
    id: "AST-BIZ-03",
    category: "Business Setup / Livelihood",
    assetType: "Mobile Vegetable & Fruit Pushcart",
    defaultQty: "1 Pushcart + Weighing Scale",
    defaultVendorLocation: "Bhaluka Bazar",
    suggestedPurpose: "Business Setup",
  },
  {
    id: "AST-BIZ-04",
    category: "Business Setup / Livelihood",
    assetType: "Heavy-Duty Sewing Machine & Tailoring Kit",
    defaultQty: "1 Machine Set + Motor",
    defaultVendorLocation: "Mirpur Sewing Machinery Showroom",
    suggestedPurpose: "Business Setup",
  },
  {
    id: "AST-BIZ-05",
    category: "Business Setup / Livelihood",
    assetType: "Carpentry & Electrical Hand Tools Workshop Kit",
    defaultQty: "1 Professional Toolkit",
    defaultVendorLocation: "Nawabpur Tools Hardware Market",
    suggestedPurpose: "Business Setup",
  },

  // 4. Medical & Assistive Equipment
  {
    id: "AST-MED-01",
    category: "Medical & Assistive Equipment",
    assetType: "Chemotherapy & Oncology Specialized Medicine Package",
    defaultQty: "3 Cycles + Specialized Drugs",
    defaultVendorLocation: "Labaid Cancer Hospital Specialized Pharmacy",
    suggestedPurpose: "Medical Treatment",
  },
  {
    id: "AST-MED-02",
    category: "Medical & Assistive Equipment",
    assetType: "Foldable Wheelchair & Orthopedic Assistive Device",
    defaultQty: "1 Unit",
    defaultVendorLocation: "BMA Bhaban Surgical Market, Dhaka",
    suggestedPurpose: "Medical Treatment",
  },
  {
    id: "AST-MED-03",
    category: "Medical & Assistive Equipment",
    assetType: "Medical Oxygen Concentrator / Cylinder Setup",
    defaultQty: "1 Unit (5L/10L)",
    defaultVendorLocation: "Dhanmondi Medical Supply",
    suggestedPurpose: "Medical Treatment",
  },
  {
    id: "AST-MED-04",
    category: "Medical & Assistive Equipment",
    assetType: "Surgical Implant & Post-Operative Recovery Equipment",
    defaultQty: "1 Implant Package",
    defaultVendorLocation: "National Heart Foundation Pharmacy",
    suggestedPurpose: "Medical Treatment",
  },

  // 5. Community & Rehabilitation
  {
    id: "AST-REL-01",
    category: "Shelter & Community Equipment",
    assetType: "Corrugated Roofing Tin & Reconstruction Timber Package",
    defaultQty: "2 Bundles Tin + Wood Posts",
    defaultVendorLocation: "Gafargaon Timber & Tin Depot",
    suggestedPurpose: "Others",
  },
  {
    id: "AST-REL-02",
    category: "Shelter & Community Equipment",
    assetType: "Deep Tube-Well & Safe Drinking Water Installation Set",
    defaultQty: "1 Tube-Well Unit",
    defaultVendorLocation: "Sreepur Sanitary & Pipe Store",
    suggestedPurpose: "Others",
  },
  {
    id: "AST-REL-03",
    category: "Shelter & Community Equipment",
    assetType: "Madrasa Quran & Comprehensive Study Textbooks Curriculum Pack",
    defaultQty: "50 Books Curriculum Pack",
    defaultVendorLocation: "Banglabazar Islamic Book Market",
    suggestedPurpose: "Mosque/Madrasa",
  },
];

export type RecurringScheduleStatus = "Active" | "Paused" | "Completed" | "Cancelled";
export type DisbursementCadence = "Monthly" | "Quarterly" | "Bi-Annual" | "Annual Lump Sum";
export type DisbursementSettlementType = "Periodic Installments" | "1-Year Full Advance";

export interface RecurringZakatSchedule {
  id: string; // e.g. "REC-ZK-2026-01"
  title: string;
  disbursementChannel: ZakatDisbursementChannel;
  disbursementMode: ZakatDisbursementMode;
  assetDetails?: ZakatAssetDetails;
  purposeCategory: ZakatPurposeCategory;
  otherPurposeDetails?: string;
  purposeDescription: string;
  
  // Cadence & Advance Settlement
  cadence?: DisbursementCadence; // Monthly, Quarterly, Bi-Annual, Annual Lump Sum
  settlementType?: DisbursementSettlementType; // Periodic Installments vs 1-Year Full Advance
  isUpfrontFullYearPaid?: boolean;
  disbursementMethod?: "Bank Transfer" | "Mobile Financial Service" | "Cash Handover" | "In-Kind Delivery";
  paymentDetails?: string;
  
  // Beneficiary Identity
  employeeId?: string;
  employeeName?: string;
  employeeDept?: string;
  employeeDesignation?: string;
  beneficiaryName: string;
  beneficiaryPhone?: string;
  beneficiaryAddress?: string;
  institutionName?: string;
  institutionType?: "Madrasa" | "Mosque" | "Orphanage" | "Hospital" | "Trust/NGO" | "Other";
  institutionRepresentative?: string;
  institutionContactPhone?: string;
  
  asnafCategory: "Al-Fuqara" | "Al-Masakin" | "Al-Gharimin" | "Fi Sabilillah" | "Ibnus-Sabil";
  monthlyAmount: number; // Fully flexible (not hardcoded to 10k)
  disbursementDayOfMonth: number;
  startDate: string;
  endDate?: string;
  totalPlannedMonths?: number;
  status: RecurringScheduleStatus;
  installmentsGenerated: number;
  totalAmountDisbursed: number;
  lastGeneratedDate?: string;
  nextDueDate: string;
  createdAt: string;
  notes?: string;
  attachments?: ZakatAttachment[]; // Uploaded supporting documents
}

export interface ZakatRecord {
  id: string;
  budgetYear: number;
  assignedDate: string;
  distributionDeadline: string;
  amount: number;
  
  // Three Core Governance Axes:
  disbursementChannel: ZakatDisbursementChannel;
  disbursementMode: ZakatDisbursementMode;
  purposeCategory: ZakatPurposeCategory;
  
  // Asset specifications (when mode === "Asset Purchased")
  assetDetails?: ZakatAssetDetails;
  
  // Custom purpose text (when purposeCategory === "Others")
  otherPurposeDetails?: string;
  purposeSpecificDescription?: string;
  
  // Recurring linkage & Advance Settlement
  isRecurring?: boolean;
  recurringScheduleId?: string;
  installmentNumber?: number;
  installmentTotal?: number;
  isAdvanceLumpSum?: boolean;
  advancePeriodCovered?: string;
  
  // Beneficiary & Agent Identity
  employeeId?: string;
  employeeName?: string;
  employeeDept?: string;
  employeeDesignation?: string;
  beneficiaryName: string;
  beneficiaryPhone?: string;
  beneficiaryNid?: string;
  beneficiaryAddress?: string;
  institutionName?: string;
  institutionType?: "Madrasa" | "Mosque" | "Orphanage" | "Hospital" | "Trust/NGO" | "Other";
  institutionRepresentative?: string;
  institutionContactPhone?: string;
  
  asnafCategory: "Al-Fuqara" | "Al-Masakin" | "Al-Gharimin" | "Fi Sabilillah" | "Ibnus-Sabil";
  justificationDetails: string;
  agencyStatus: "Assigned" | "Acknowledged" | "Distributed" | "Verified";
  proofDetails?: {
    receiptRef: string;
    witnessName: string;
    witnessPhone: string;
    notes: string;
    submittedAt: string;
  };
  attachments?: ZakatAttachment[]; // Uploaded supporting documents
  
  // Legacy compatibility fields
  recipientType?: string;
  recipientName?: string;
  recipientDetails?: string;
}

// ==========================================
// 2. BASELINE SAMPLE RECORDS
// ==========================================

const defaultZakatRecords: ZakatRecord[] = [
  {
    id: "ZK-2026-01",
    budgetYear: 2026,
    assignedDate: "2026-06-15",
    distributionDeadline: "2026-07-10",
    amount: 15000,
    isRecurring: false,
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Asset Purchased",
    purposeCategory: "Farm Animal",
    assetDetails: {
      assetType: "Breeding Goats / Sheep Pair",
      assetName: "2 Dairy Breeding Goats",
      assetQuantity: "2 Goats",
      vendorOrMarket: "Gafargaon Cattle Market",
      invoiceRef: "HAT-VOUCHER-088",
      remarks: "Purchased healthy vaccinated dairy goats from rural livestock market; verified with local veterinary health certificate.",
    },
    purposeSpecificDescription: "2 Breeding goats bought and handed over to set up home dairy farming",
    employeeName: "Tahmid Afsar Shapno",
    employeeId: "2023043910",
    employeeDept: "Business Innovation",
    employeeDesignation: "Asst. Manager",
    beneficiaryName: "Abdul Rahim",
    beneficiaryPhone: "01712-345678",
    beneficiaryAddress: "Bhaluka, Mymensingh",
    asnafCategory: "Al-Fuqara",
    justificationDetails:
      "Disabled head of family in employee's village, gifted livestock for sustainable daily income.",
    agencyStatus: "Verified",
    proofDetails: {
      receiptRef: "REC-99812-ZK",
      witnessName: "Maulana Kashem (Local Imam)",
      witnessPhone: "01712-345678",
      notes: "Cash handed over in presence of mosque committee. Goats inspected and received in good health.",
      submittedAt: "2026-06-18",
    },
    attachments: [
      {
        id: "att-zk-01-1",
        name: "cattle_hat_receipt_088.pdf",
        size: "420 KB",
        type: "application/pdf",
        uploadedAt: "2026-06-15",
      },
      {
        id: "att-zk-01-2",
        name: "beneficiary_nid_abdul_rahim.jpg",
        size: "1.2 MB",
        type: "image/jpeg",
        uploadedAt: "2026-06-15",
      },
    ],
  },
  {
    id: "ZK-2026-02",
    budgetYear: 2026,
    assignedDate: "2026-06-18",
    distributionDeadline: "2026-07-15",
    amount: 25000,
    isRecurring: false,
    disbursementChannel: "Direct Employee",
    disbursementMode: "Cash Grant",
    purposeCategory: "Medical Treatment",
    purposeSpecificDescription: "Emergency gallbladder stone surgery and 3 months prescribed medications",
    employeeName: "Sohanur Rahman Sohan",
    employeeId: "2023046001",
    employeeDept: "HR, Admin and Compliance",
    employeeDesignation: "Executive",
    beneficiaryName: "Sohanur Rahman Sohan (Staff Self)",
    beneficiaryPhone: "01819-876543",
    beneficiaryAddress: "Gazipur Sadar",
    asnafCategory: "Al-Masakin",
    justificationDetails:
      "Acute medical emergency requiring urgent hospitalization billing clearance for our company executive.",
    agencyStatus: "Distributed",
    proofDetails: {
      receiptRef: "REC-44321-ZK",
      witnessName: "Dr. K. Alam (Surgeon)",
      witnessPhone: "01819-876543",
      notes: "Hospital bill receipt verified directly with clinical billing counter.",
      submittedAt: "2026-06-20",
    },
    attachments: [
      {
        id: "att-zk-02-1",
        name: "labaid_hospital_bill_summary.pdf",
        size: "850 KB",
        type: "application/pdf",
        uploadedAt: "2026-06-18",
      },
      {
        id: "att-zk-02-2",
        name: "surgeon_prescription_advice.pdf",
        size: "310 KB",
        type: "application/pdf",
        uploadedAt: "2026-06-18",
      },
    ],
  },
  {
    id: "ZK-2026-03",
    budgetYear: 2026,
    assignedDate: "2026-06-21",
    distributionDeadline: "2026-07-20",
    amount: 30000,
    isRecurring: false,
    disbursementChannel: "Direct External",
    disbursementMode: "Asset Purchased",
    purposeCategory: "Business Setup",
    assetDetails: {
      assetType: "Tea Stall & Snack Kiosk Setup",
      assetName: "Tea Stall Counter, Gas Cylinder, Stove & Retail Stock",
      assetQuantity: "Full Retail Set",
      vendorOrMarket: "Sreepur Steel & Stove Works",
      invoiceRef: "INV-STALL-492",
      remarks: "Full physical kiosk structure with burner and gas cylinder delivered on-site; includes 6-month burner warranty.",
    },
    purposeSpecificDescription: "Complete street tea stall setup built and furnished for fire victim",
    beneficiaryName: "Jamil Mia",
    beneficiaryPhone: "01788-112233",
    beneficiaryAddress: "Sreepur, Gazipur",
    asnafCategory: "Al-Gharimin",
    justificationDetails:
      "Destitute shopkeeper who lost his livelihood in market fire; gifted physical business setup instead of cash.",
    agencyStatus: "Acknowledged",
    attachments: [
      {
        id: "att-zk-03-1",
        name: "tea_stall_fabrication_invoice.pdf",
        size: "540 KB",
        type: "application/pdf",
        uploadedAt: "2026-06-21",
      },
    ],
  },
  {
    id: "ZK-2026-04",
    budgetYear: 2026,
    assignedDate: "2026-07-02",
    distributionDeadline: "2026-07-25",
    amount: 55000,
    isRecurring: false,
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Asset Purchased",
    purposeCategory: "Vehicle",
    assetDetails: {
      assetType: "Battery Electric Auto-Van / Easy Bike",
      assetName: "Electric Battery Cargo Van",
      assetQuantity: "1 Unit",
      vendorOrMarket: "Rahim Electric Auto Center, Kaliakair",
      invoiceRef: "AUTO-VAN-771",
      remarks: "Includes 48V rechargeable dry cell battery pack, heavy duty chassis, and 1-year battery maintenance guarantee.",
    },
    purposeSpecificDescription: "Brand new battery cargo van purchased to enable self-reliant daily transport income",
    employeeName: "Easin Mia",
    employeeId: "2023043021",
    employeeDept: "HR, Admin and Compliance",
    employeeDesignation: "Receptionist",
    beneficiaryName: "Kalam Sheikh (Easin's Neighbor)",
    beneficiaryPhone: "01912-998877",
    beneficiaryAddress: "Kaliakair, Gazipur",
    asnafCategory: "Al-Fuqara",
    justificationDetails:
      "Unemployed father of 4 children, provided an electric cargo van through employee supervision.",
    agencyStatus: "Verified",
    proofDetails: {
      receiptRef: "REC-VAN-0091",
      witnessName: "Abdul Gafur (UP Member)",
      witnessPhone: "01912-000111",
      notes: "Van registration papers and handover photograph filed with company welfare desk.",
      submittedAt: "2026-07-10",
    },
    attachments: [
      {
        id: "att-zk-04-1",
        name: "electric_van_purchase_voucher.pdf",
        size: "1.1 MB",
        type: "application/pdf",
        uploadedAt: "2026-07-02",
      },
    ],
  },
  {
    id: "ZK-2026-05",
    budgetYear: 2026,
    assignedDate: "2026-07-15",
    distributionDeadline: "2026-07-30",
    amount: 40000,
    isRecurring: false,
    disbursementChannel: "Direct External",
    disbursementMode: "Cash Grant",
    purposeCategory: "Mosque/Madrasa",
    purposeSpecificDescription: "Living allowance, food and clothing sponsorship for 15 orphan Hifz students",
    institutionName: "Darul Uloom Islamia Madrasa & Orphanage",
    institutionType: "Madrasa",
    institutionRepresentative: "Maulana Mufti Harun",
    institutionContactPhone: "01722-554433",
    beneficiaryName: "Darul Uloom Madrasa (15 Orphan Students)",
    beneficiaryAddress: "Tongi, Gazipur",
    asnafCategory: "Fi Sabilillah",
    justificationDetails:
      "Direct institutional grant transferred to madrasa committee account for destitute students' meals.",
    agencyStatus: "Verified",
    proofDetails: {
      receiptRef: "MAD-REC-2026-44",
      witnessName: "Hafez Siraj (Principal)",
      witnessPhone: "01722-554433",
      notes: "Official institutional receipt stamped by managing committee.",
      submittedAt: "2026-07-20",
    },
  },
  {
    id: "ZK-2026-REC-01-OCT",
    budgetYear: 2026,
    assignedDate: "2026-10-01",
    distributionDeadline: "2026-10-10",
    amount: 8000,
    isRecurring: true,
    recurringScheduleId: "REC-ZK-2026-01",
    installmentNumber: 1,
    installmentTotal: 12,
    disbursementChannel: "Direct Employee",
    disbursementMode: "Cash Grant",
    purposeCategory: "Medical Treatment",
    purposeSpecificDescription: "Monthly chemotherapy & insulin allowance (Month 1 of 12)",
    employeeName: "Easin Mia",
    employeeId: "2023043021",
    employeeDept: "HR, Admin and Compliance",
    employeeDesignation: "Receptionist",
    beneficiaryName: "Easin Mia (Staff - Chronic Care)",
    beneficiaryPhone: "01711-223344",
    asnafCategory: "Al-Masakin",
    justificationDetails:
      "Automated monthly recurring financial grant for ongoing vital medications.",
    agencyStatus: "Verified",
    proofDetails: {
      receiptRef: "REC-MED-M1-2026",
      witnessName: "HR Welfare Officer",
      witnessPhone: "01700-112233",
      notes: "Monthly stipend credited to employee salary bank account.",
      submittedAt: "2026-10-05",
    },
  },
  {
    id: "ZK-2026-06",
    budgetYear: 2026,
    assignedDate: "2026-08-04",
    distributionDeadline: "2026-08-20",
    amount: 45000,
    isRecurring: false,
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Asset Purchased",
    purposeCategory: "Medical Treatment",
    assetDetails: {
      assetName: "Chemotherapy & Oncology Medicine Package (Cycle 1-3)",
      assetQuantity: "3 Cycles + Specialized Drugs",
      vendorOrMarket: "Labaid Cancer Hospital Specialized Pharmacy, Dhanmondi, Dhaka",
      invoiceRef: "PHARM-88219-LAB",
    },
    purposeSpecificDescription: "Purchased specialist chemotherapy cancer drugs directly from hospital pharmacy counter",
    employeeName: "Jahangir Alam",
    employeeId: "2023041109",
    employeeDept: "Transport & Logistics",
    employeeDesignation: "Senior Driver",
    beneficiaryName: "Kulsum Bibi (Driver Jahangir's Mother)",
    beneficiaryPhone: "01733-445566",
    beneficiaryAddress: "Kaoraid, Sreepur, Gazipur (Treatment at Labaid, Dhaka)",
    asnafCategory: "Al-Masakin",
    justificationDetails:
      "Advanced oncological treatment costs paid directly to pharmacy on behalf of low-income transport staff's mother.",
    agencyStatus: "Verified",
    proofDetails: {
      receiptRef: "LAB-PHARM-88219",
      witnessName: "Dr. A. K. M. Shamsuddin (Oncologist)",
      witnessPhone: "01733-445566",
      notes: "Direct diagnostic bill voucher and official clinical receipt verified with accounts.",
      submittedAt: "2026-08-10",
    },
  },
  {
    id: "ZK-2026-07",
    budgetYear: 2026,
    assignedDate: "2026-08-18",
    distributionDeadline: "2026-09-05",
    amount: 30000,
    isRecurring: false,
    disbursementChannel: "Direct External",
    disbursementMode: "Cash Grant",
    purposeCategory: "Medical Treatment",
    purposeSpecificDescription: "Financial assistance for emergency pediatric open-heart valve surgery",
    beneficiaryName: "Baby Arif (7-year-old orphan)",
    beneficiaryPhone: "01855-667788",
    beneficiaryAddress: "National Heart Foundation & Hospital, Mirpur-2, Dhaka",
    asnafCategory: "Al-Fuqara",
    justificationDetails:
      "Life-saving congenital cardiac surgery support for destitute orphan child referred by hospital social welfare unit.",
    agencyStatus: "Distributed",
    proofDetails: {
      receiptRef: "NICVD-WEL-4410",
      witnessName: "Prof. Dr. Farhana Yasmin (Pediatric Cardiologist)",
      witnessPhone: "01855-667788",
      notes: "Surgical deposit receipt acknowledged by hospital accounts department.",
      submittedAt: "2026-08-25",
    },
  },
  {
    id: "ZK-2026-08",
    budgetYear: 2026,
    assignedDate: "2026-08-22",
    distributionDeadline: "2026-09-10",
    amount: 60000,
    isRecurring: false,
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Asset Purchased",
    purposeCategory: "Farm Animal",
    assetDetails: {
      assetName: "1 High-Yield Milking Dairy Cow with Calf",
      assetQuantity: "1 Cow + 1 Calf",
      vendorOrMarket: "Gafargaon Livestock Cattle Haat",
      invoiceRef: "HAT-0091-COW",
    },
    purposeSpecificDescription: "Healthy milking cow purchased to provide daily milk selling income for destitute rural family",
    employeeName: "Tahmid Afsar Shapno",
    employeeId: "2023043910",
    employeeDept: "Business Innovation",
    employeeDesignation: "Asst. Manager",
    beneficiaryName: "Mokhlesur Rahman (Widower with 3 school-going daughters)",
    beneficiaryPhone: "01744-889900",
    beneficiaryAddress: "Village: Trishal, District: Mymensingh",
    asnafCategory: "Al-Fuqara",
    justificationDetails:
      "Sustainable livelihood empowerment through dairy cattle ownership in employee's native village.",
    agencyStatus: "Verified",
    proofDetails: {
      receiptRef: "HAAT-VOUCHER-COW-91",
      witnessName: "Upazila Livestock Officer",
      witnessPhone: "01744-889900",
      notes: "Animal health clearance verified by veterinary doctor. Cow and calf delivered to recipient's home.",
      submittedAt: "2026-08-26",
    },
  },
  {
    id: "ZK-2026-09",
    budgetYear: 2026,
    assignedDate: "2026-09-02",
    distributionDeadline: "2026-09-20",
    amount: 25000,
    isRecurring: false,
    disbursementChannel: "Direct External",
    disbursementMode: "Asset Purchased",
    purposeCategory: "Business Setup",
    assetDetails: {
      assetName: "Industrial Heavy Duty Tailoring Machine + 100 Yards Fabric Stock",
      assetQuantity: "1 Juki Machine + Fabric Rolls",
      vendorOrMarket: "Singer Sewing Center, Joydebpur Bazar, Gazipur",
      invoiceRef: "SINGER-SEW-7712",
    },
    purposeSpecificDescription: "Commercial sewing machine and fabric inventory provided to establish home tailoring boutique",
    beneficiaryName: "Morium Begum (Destitute Widow)",
    beneficiaryPhone: "01622-334455",
    beneficiaryAddress: "Konabari, Gazipur",
    asnafCategory: "Al-Masakin",
    justificationDetails:
      "Gifted physical capital asset for micro-enterprise to prevent begging and achieve dignified financial independence.",
    agencyStatus: "Verified",
    proofDetails: {
      receiptRef: "INV-SEW-7712",
      witnessName: "Haji Nurul Islam (Konabari Bazar Committee President)",
      witnessPhone: "01622-334455",
      notes: "Sewing machine delivered and installed. Recipient tested machine on-site.",
      submittedAt: "2026-09-08",
    },
  },
  {
    id: "ZK-2026-10",
    budgetYear: 2026,
    assignedDate: "2026-09-12",
    distributionDeadline: "2026-09-30",
    amount: 35000,
    isRecurring: false,
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Asset Purchased",
    purposeCategory: "Others",
    otherPurposeDetails: "Emergency Cyclone Flood Roof Reconstruction",
    assetDetails: {
      assetName: "Corrugated Galvanized Iron (CI) Roofing Sheets & Heavy Timber Pillars",
      assetQuantity: "4 Bundles CI Sheet + 12 Wooden Pillars",
      vendorOrMarket: "Gazipur Tin & Building Material Mart, Sreepur",
      invoiceRef: "TIN-MART-4411",
    },
    purposeSpecificDescription: "Building materials procured to rebuild cyclone-damaged house roof for elderly destitute couple",
    employeeName: "Easin Mia",
    employeeId: "2023043021",
    employeeDept: "HR, Admin and Compliance",
    employeeDesignation: "Receptionist",
    beneficiaryName: "Rustam Ali & Joynab Bibi",
    beneficiaryPhone: "01933-778899",
    beneficiaryAddress: "Village: Mawna, Sreepur, Gazipur",
    asnafCategory: "Al-Gharimin",
    justificationDetails:
      "House destroyed during seasonal cyclone. Physical building materials provided directly to contractor for roof reconstruction.",
    agencyStatus: "Verified",
    proofDetails: {
      receiptRef: "REC-TIN-4411",
      witnessName: "Mawna Union Council Chairman",
      witnessPhone: "01933-778899",
      notes: "Roof reconstruction inspected and completed before monsoon onset.",
      submittedAt: "2026-09-22",
    },
  },
  {
    id: "ZK-2026-11",
    budgetYear: 2026,
    assignedDate: "2026-10-01",
    distributionDeadline: "2026-10-10",
    amount: 120000,
    isRecurring: true,
    recurringScheduleId: "REC-ZK-2026-03",
    installmentNumber: 1,
    installmentTotal: 1,
    isAdvanceLumpSum: true,
    advancePeriodCovered: "Full 1-Year Advance (12 Months Prepaid)",
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Cash Grant",
    purposeCategory: "Others",
    otherPurposeDetails: "Higher Education Tuition Assistance",
    purposeSpecificDescription: "Full 1-Year Advance Annual Zakat Stipend (12 Months @ ৳10,000/mo) for Medical Tuition Assistance",
    employeeName: "Tahmid Afsar Shapno",
    employeeId: "2023043910",
    employeeDept: "Business Innovation",
    employeeDesignation: "Asst. Manager",
    beneficiaryName: "Fatema Begum (Medical Student in Village)",
    beneficiaryPhone: "01755-667788",
    beneficiaryAddress: "Bhaluka, Mymensingh",
    asnafCategory: "Fi Sabilillah",
    justificationDetails:
      "Management approved paying the entire 12-month educational Zakat stipend (৳120,000) upfront in a single advance lump sum to clear medical university admission and semester tuition fees.",
    agencyStatus: "Verified",
    proofDetails: {
      receiptRef: "REC-ADV-TUITION-01",
      witnessName: "Prof. Dr. M. R. Karim (Dean of Academic Affairs)",
      witnessPhone: "01755-001122",
      notes: "Full 1-year tuition bank clearance slip and acknowledgment receipt verified.",
      submittedAt: "2026-10-02",
    },
    attachments: [
      {
        id: "att-zk-11-1",
        name: "university_tuition_voucher_annual.pdf",
        size: "920 KB",
        type: "application/pdf",
        uploadedAt: "2026-10-01",
      },
    ],
  },
];

const defaultRecurringSchedules: RecurringZakatSchedule[] = [
  {
    id: "REC-ZK-2026-01",
    title: "Monthly Medical Treatment Stipend for Easin Mia",
    disbursementChannel: "Direct Employee",
    disbursementMode: "Cash Grant",
    cadence: "Monthly",
    settlementType: "Periodic Installments",
    disbursementMethod: "Mobile Financial Service",
    paymentDetails: "bKash: 01711-223344",
    employeeId: "2023043021",
    employeeName: "Easin Mia",
    employeeDept: "HR, Admin and Compliance",
    employeeDesignation: "Receptionist",
    beneficiaryName: "Easin Mia",
    beneficiaryPhone: "01711-223344",
    purposeCategory: "Medical Treatment",
    purposeDescription: "Monthly medical support of ৳8,000 for regular insulin and specialist consultation.",
    asnafCategory: "Al-Masakin",
    monthlyAmount: 8000,
    disbursementDayOfMonth: 1,
    startDate: "2026-10-01",
    endDate: "2027-09-30",
    totalPlannedMonths: 12,
    status: "Active",
    installmentsGenerated: 1,
    totalAmountDisbursed: 8000,
    lastGeneratedDate: "2026-10-01",
    nextDueDate: "2026-11-01",
    createdAt: "2026-09-28",
    notes: "Approved by Management for 1 full year support.",
    attachments: [
      {
        id: "att-rec-01-1",
        name: "easin_mia_medical_board_summary.pdf",
        size: "620 KB",
        type: "application/pdf",
        uploadedAt: "2026-09-28",
      },
      {
        id: "att-rec-01-2",
        name: "management_approval_letter.pdf",
        size: "340 KB",
        type: "application/pdf",
        uploadedAt: "2026-09-28",
      },
    ],
  },
  {
    id: "REC-ZK-2026-02",
    title: "Monthly Orphan Students Welfare Grant",
    disbursementChannel: "Direct External",
    disbursementMode: "Cash Grant",
    cadence: "Monthly",
    settlementType: "Periodic Installments",
    disbursementMethod: "Bank Transfer",
    paymentDetails: "Islami Bank A/C: 2050-1199-002",
    institutionName: "Jamia Qasimul Uloom Madrasa",
    institutionType: "Madrasa",
    institutionRepresentative: "Maulana Zakaria",
    institutionContactPhone: "01822-778899",
    beneficiaryName: "Jamia Qasimul Uloom (Orphan Care)",
    beneficiaryAddress: "Joydebpur, Gazipur",
    purposeCategory: "Mosque/Madrasa",
    purposeDescription: "Monthly stipend of ৳12,000 supporting 3 orphan students' meals and textbooks.",
    asnafCategory: "Fi Sabilillah",
    monthlyAmount: 12000,
    disbursementDayOfMonth: 5,
    startDate: "2026-10-05",
    totalPlannedMonths: 12,
    status: "Active",
    installmentsGenerated: 0,
    totalAmountDisbursed: 0,
    nextDueDate: "2026-10-05",
    createdAt: "2026-10-01",
    notes: "Continuous welfare grant for destitute students.",
    attachments: [
      {
        id: "att-rec-02-1",
        name: "madrasa_trust_appeal_and_charter.pdf",
        size: "1.4 MB",
        type: "application/pdf",
        uploadedAt: "2026-10-01",
      },
    ],
  },
  {
    id: "REC-ZK-2026-03",
    title: "Annual Education & Tuition Welfare Stipend (1-Year Lump Sum Advance)",
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Cash Grant",
    cadence: "Annual Lump Sum",
    settlementType: "1-Year Full Advance",
    isUpfrontFullYearPaid: true,
    disbursementMethod: "Bank Transfer",
    paymentDetails: "Sonali Bank A/C: 3401-291882",
    employeeName: "Tahmid Afsar Shapno",
    employeeId: "2023043910",
    employeeDept: "Business Innovation",
    employeeDesignation: "Asst. Manager",
    beneficiaryName: "Fatema Begum (Medical Student in Village)",
    beneficiaryPhone: "01755-667788",
    beneficiaryAddress: "Bhaluka, Mymensingh",
    purposeCategory: "Others",
    otherPurposeDetails: "Higher Education Tuition Assistance",
    purposeDescription: "Full 1-year annual Zakat stipend of ৳120,000 (৳10,000/mo × 12 months) paid upfront in single advance installment.",
    asnafCategory: "Fi Sabilillah",
    monthlyAmount: 10000,
    disbursementDayOfMonth: 1,
    startDate: "2026-10-01",
    endDate: "2027-09-30",
    totalPlannedMonths: 12,
    status: "Completed",
    installmentsGenerated: 12,
    totalAmountDisbursed: 120000,
    lastGeneratedDate: "2026-10-01",
    nextDueDate: "2027-10-01",
    createdAt: "2026-09-30",
    notes: "1-Year Advance Lump Sum paid in full upon management committee approval.",
    attachments: [
      {
        id: "att-rec-03-1",
        name: "university_tuition_voucher_annual.pdf",
        size: "920 KB",
        type: "application/pdf",
        uploadedAt: "2026-09-30",
      },
    ],
  },
];

// Helper to convert BDT amounts to words for formal receipts
function numberToWordsBDT(amount: number): string {
  if (!amount || isNaN(amount)) return "Zero Taka Only";
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  function convertBelowThousand(n: number): string {
    if (n === 0) return "";
    if (n < 20) return ones[n];
    const t = tens[Math.floor(n / 10)];
    const o = ones[n % 10];
    return (t + (o ? "-" + o : "")).trim();
  }

  function convertSection(n: number): string {
    let str = "";
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n > 0) {
      str += convertBelowThousand(n);
    }
    return str.trim();
  }

  const crore = Math.floor(amount / 10000000);
  const remCrore = amount % 10000000;
  const lakh = Math.floor(remCrore / 100000);
  const remLakh = remCrore % 100000;
  const thousand = Math.floor(remLakh / 1000);
  const remainder = remLakh % 1000;

  const parts: string[] = [];
  if (crore > 0) parts.push(convertSection(crore) + " Crore");
  if (lakh > 0) parts.push(convertSection(lakh) + " Lakh");
  if (thousand > 0) parts.push(convertSection(thousand) + " Thousand");
  if (remainder > 0) parts.push(convertSection(remainder));

  return (parts.join(" ") + " Taka Only").trim();
}

// Helper to normalize legacy records
function normalizeRecords(raw: any[]): ZakatRecord[] {
  if (!Array.isArray(raw) || raw.length === 0) return defaultZakatRecords;
  const parsed = raw.map((r, idx) => {
    const beneficiary = r.beneficiaryName || r.recipientName || "Beneficiary";
    const justification = r.justificationDetails || r.recipientDetails || "Zakat support";
    
    // Resolve channel
    let channel: ZakatDisbursementChannel = "Direct External";
    if (r.disbursementChannel) {
      channel = r.disbursementChannel;
    } else if (r.recipientType === "Internal Employee") {
      channel = "Direct Employee";
    } else if (r.recipientType === "Employee Agent") {
      channel = "Via Employee Agent";
    } else if (r.employeeName && !r.recipientType) {
      channel = "Via Employee Agent";
    }

    // Resolve mode
    let mode: ZakatDisbursementMode = r.disbursementMode || "Cash Grant";
    if (!r.disbursementMode && (r.purposeCategory === "Vehicle" || r.purposeCategory === "Farm Animal" || r.purposeCategory === "Business Setup")) {
      mode = "Asset Purchased";
    }

    return {
      id: r.id || `ZK-2026-${String(idx + 1).padStart(2, "0")}`,
      budgetYear: r.budgetYear || (r.assignedDate ? parseInt(r.assignedDate.slice(0, 4)) : 2026),
      assignedDate: r.assignedDate || "2026-06-15",
      distributionDeadline: r.distributionDeadline || "2026-07-15",
      amount: typeof r.amount === "number" ? r.amount : 10000,
      isRecurring: !!r.isRecurring,
      recurringScheduleId: r.recurringScheduleId,
      installmentNumber: r.installmentNumber,
      installmentTotal: r.installmentTotal,
      isAdvanceLumpSum: !!r.isAdvanceLumpSum || defaultZakatRecords.find((d) => d.id === r.id)?.isAdvanceLumpSum,
      advancePeriodCovered: r.advancePeriodCovered || defaultZakatRecords.find((d) => d.id === r.id)?.advancePeriodCovered,
      disbursementChannel: channel,
      disbursementMode: mode,
      assetDetails: r.assetDetails ? {
        ...r.assetDetails,
        remarks: r.assetDetails.remarks || defaultZakatRecords.find((d) => d.id === r.id)?.assetDetails?.remarks,
        assetType: r.assetDetails.assetType || defaultZakatRecords.find((d) => d.id === r.id)?.assetDetails?.assetType,
      } : undefined,
      purposeCategory: r.purposeCategory || "Medical Treatment",
      otherPurposeDetails: r.otherPurposeDetails,
      purposeSpecificDescription: r.purposeSpecificDescription || justification,
      employeeId: r.employeeId,
      employeeName: r.employeeName,
      employeeDept: r.employeeDept,
      employeeDesignation: r.employeeDesignation,
      beneficiaryName: beneficiary,
      beneficiaryPhone: r.beneficiaryPhone,
      beneficiaryNid: r.beneficiaryNid,
      beneficiaryAddress: r.beneficiaryAddress,
      institutionName: r.institutionName,
      institutionType: r.institutionType,
      institutionRepresentative: r.institutionRepresentative,
      institutionContactPhone: r.institutionContactPhone,
      asnafCategory: r.asnafCategory || "Al-Fuqara",
      justificationDetails: justification,
      agencyStatus: r.agencyStatus || "Assigned",
      proofDetails: r.proofDetails,
      attachments: Array.isArray(r.attachments) && r.attachments.length > 0
        ? r.attachments
        : (defaultZakatRecords.find((d) => d.id === r.id)?.attachments || []),
    };
  });

  // Ensure default mock records exist so drill-down always has rich demo cases
  const existingIds = new Set(parsed.map((r) => r.id));
  const missingDefaults = defaultZakatRecords.filter((def) => !existingIds.has(def.id));
  return [...parsed, ...missingDefaults];
}

function normalizeSchedules(data: any[]): RecurringZakatSchedule[] {
  if (!Array.isArray(data)) return defaultRecurringSchedules;
  const parsed = data.map((s) => {
    const def = defaultRecurringSchedules.find((d) => d.id === s.id);
    return {
      ...s,
      cadence: s.cadence || def?.cadence || "Monthly",
      settlementType: s.settlementType || def?.settlementType || "Periodic Installments",
      isUpfrontFullYearPaid: s.isUpfrontFullYearPaid ?? def?.isUpfrontFullYearPaid ?? false,
      disbursementMethod: s.disbursementMethod || def?.disbursementMethod || "Bank Transfer",
      paymentDetails: s.paymentDetails || def?.paymentDetails || "",
      attachments:
        Array.isArray(s.attachments) && s.attachments.length > 0
          ? s.attachments
          : def?.attachments || [],
    };
  });
  const existingIds = new Set(parsed.map((s) => s.id));
  const missingDefaults = defaultRecurringSchedules.filter((def) => !existingIds.has(def.id));
  return [...parsed, ...missingDefaults];
}

function ZakatManagementPage() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"ledger" | "recurring">("ledger");

  // LocalStorage Persistence
  const [records, setRecords] = useState<ZakatRecord[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cripton_zakat_records");
      if (saved) {
        try {
          return normalizeRecords(JSON.parse(saved));
        } catch (e) {}
      }
    }
    return defaultZakatRecords;
  });

  const [recurringSchedules, setRecurringSchedules] = useState<RecurringZakatSchedule[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cripton_zakat_recurring_schedules");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return normalizeSchedules(parsed);
        } catch (e) {}
      }
    }
    return defaultRecurringSchedules;
  });

  const [budgetPools, setBudgetPools] = useState<{ year: number; amount: number }[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cripton_zakat_budgets");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return [{ year: new Date().getFullYear(), amount: 800000 }];
  });

  const [selectedBudgetYear, setSelectedBudgetYear] = useState<number>(new Date().getFullYear());
  const [autoGenNotice, setAutoGenNotice] = useState<string | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem("cripton_zakat_records", JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem("cripton_zakat_recurring_schedules", JSON.stringify(recurringSchedules));
  }, [recurringSchedules]);

  useEffect(() => {
    localStorage.setItem("cripton_zakat_budgets", JSON.stringify(budgetPools));
  }, [budgetPools]);

  // ==========================================
  // 3. AUTOMATED MONTHLY RECURRING ENGINE
  // ==========================================
  const executeDueRecurringBatch = () => {
    const today = new Date();
    const currentMonthStr = today.toISOString().slice(0, 7); // e.g. "2026-10"
    const todayStr = today.toISOString().slice(0, 10);

    let generatedCount = 0;
    const newRecordsToAppend: ZakatRecord[] = [];

    const updatedSchedules = recurringSchedules.map((schedule) => {
      if (schedule.status !== "Active" || schedule.isUpfrontFullYearPaid) return schedule;

      const alreadyHasThisMonth = records.some(
        (r) =>
          r.recurringScheduleId === schedule.id &&
          r.assignedDate &&
          r.assignedDate.startsWith(currentMonthStr)
      );

      if (!alreadyHasThisMonth) {
        const nextInstallmentNum = schedule.installmentsGenerated + 1;
        const newRecordId = `ZK-${today.getFullYear()}-REC-${schedule.id.slice(-2)}-${today.toLocaleString("en-US", { month: "short" }).toUpperCase()}`;

        const newRec: ZakatRecord = {
          id: newRecordId,
          budgetYear: today.getFullYear(),
          assignedDate: todayStr,
          distributionDeadline: new Date(today.getTime() + 10 * 86400000).toISOString().slice(0, 10),
          amount: schedule.monthlyAmount,
          isRecurring: true,
          recurringScheduleId: schedule.id,
          installmentNumber: nextInstallmentNum,
          installmentTotal: schedule.totalPlannedMonths || 12,
          disbursementChannel: schedule.disbursementChannel,
          disbursementMode: schedule.disbursementMode,
          assetDetails: schedule.assetDetails,
          purposeCategory: schedule.purposeCategory,
          otherPurposeDetails: schedule.otherPurposeDetails,
          purposeSpecificDescription: `${schedule.purposeDescription} (Installment #${nextInstallmentNum})`,
          employeeId: schedule.employeeId,
          employeeName: schedule.employeeName,
          employeeDept: schedule.employeeDept,
          employeeDesignation: schedule.employeeDesignation,
          beneficiaryName: schedule.beneficiaryName,
          beneficiaryPhone: schedule.beneficiaryPhone,
          beneficiaryAddress: schedule.beneficiaryAddress,
          institutionName: schedule.institutionName,
          institutionType: schedule.institutionType,
          institutionRepresentative: schedule.institutionRepresentative,
          institutionContactPhone: schedule.institutionContactPhone,
          asnafCategory: schedule.asnafCategory,
          justificationDetails: `Automated recurring monthly Zakat allowance for ${schedule.title}.`,
          agencyStatus: "Assigned",
          attachments: schedule.attachments,
        };

        newRecordsToAppend.push(newRec);
        generatedCount++;

        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, schedule.disbursementDayOfMonth);
        const nextDueDateStr = nextMonth.toISOString().slice(0, 10);

        return {
          ...schedule,
          installmentsGenerated: nextInstallmentNum,
          totalAmountDisbursed: schedule.totalAmountDisbursed + schedule.monthlyAmount,
          lastGeneratedDate: todayStr,
          nextDueDate: nextDueDateStr,
          status:
            schedule.totalPlannedMonths && nextInstallmentNum >= schedule.totalPlannedMonths
              ? ("Completed" as RecurringScheduleStatus)
              : schedule.status,
        };
      }
      return schedule;
    });

    if (generatedCount > 0) {
      setRecords((prev) => [...newRecordsToAppend, ...prev]);
      setRecurringSchedules(updatedSchedules);
      setAutoGenNotice(`Successfully generated ${generatedCount} automated recurring Zakat monthly installment(s).`);
      setTimeout(() => setAutoGenNotice(null), 6000);
    } else {
      setAutoGenNotice("All active recurring schedules are already up-to-date for the current month.");
      setTimeout(() => setAutoGenNotice(null), 4000);
    }
  };

  // Run on mount once
  useEffect(() => {
    const today = new Date();
    const currentMonthStr = today.toISOString().slice(0, 7);
    const hasPendingDue = recurringSchedules.some(
      (s) =>
        s.status === "Active" &&
        !records.some((r) => r.recurringScheduleId === s.id && r.assignedDate.startsWith(currentMonthStr))
    );
    if (hasPendingDue) {
      executeDueRecurringBatch();
    }
  }, []);

  // ==========================================
  // 4. FILTER STATES
  // ==========================================
  const [searchQuery, setSearchQuery] = useState("");
  const [filterChannel, setFilterChannel] = useState<string>("ALL");
  const [filterMode, setFilterMode] = useState<string>("ALL");
  const [filterPurpose, setFilterPurpose] = useState<string>("ALL");
  const [filterEntryType, setFilterEntryType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Detail Drawer
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  // Modal 1: Assign Zakat Case
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [modalChannel, setModalChannel] = useState<ZakatDisbursementChannel>("Direct Employee");
  const [modalMode, setModalMode] = useState<ZakatDisbursementMode>("Cash Grant");
  
  // Asset Fields (when modalMode === "Asset Purchased")
  const [modalAssetMasterId, setModalAssetMasterId] = useState("");
  const [modalAssetType, setModalAssetType] = useState("");
  const [modalAssetName, setModalAssetName] = useState("");
  const [modalAssetQty, setModalAssetQty] = useState("");
  const [modalAssetVendor, setModalAssetVendor] = useState("");
  const [modalAssetInvoice, setModalAssetInvoice] = useState("");
  const [modalAssetRemarks, setModalAssetRemarks] = useState("");
  const [modalAttachments, setModalAttachments] = useState<ZakatAttachment[]>([]);

  // Recipient Fields
  const [newEmpId, setNewEmpId] = useState("");
  const [newEmpName, setNewEmpName] = useState("");
  const [newBeneficiaryName, setNewBeneficiaryName] = useState("");
  const [newBeneficiaryPhone, setNewBeneficiaryPhone] = useState("");
  const [newBeneficiaryAddress, setNewBeneficiaryAddress] = useState("");
  const [newInstitutionName, setNewInstitutionName] = useState("");
  const [newInstitutionType, setNewInstitutionType] = useState<"Madrasa" | "Mosque" | "Orphanage" | "Hospital" | "Trust/NGO" | "Other">("Madrasa");
  const [newInstitutionRep, setNewInstitutionRep] = useState("");
  const [newInstitutionPhone, setNewInstitutionPhone] = useState("");
  
  // Purpose & Financials
  const [newPurposeCategory, setNewPurposeCategory] = useState<ZakatPurposeCategory>("Medical Treatment");
  const [newOtherPurposeDetails, setNewOtherPurposeDetails] = useState("");
  const [newPurposeDescription, setNewPurposeDescription] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newAsnaf, setNewAsnaf] = useState<ZakatRecord["asnafCategory"]>("Al-Fuqara");
  const [newJustification, setNewJustification] = useState("");

  // Searchable Employee Dropdown
  const [empSearchInput, setEmpSearchInput] = useState("");
  const [isEmpDropdownOpen, setIsEmpDropdownOpen] = useState(false);

  // Modal 2: Recurring Schedule Setup (Flexible Amount)
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const [recTitle, setRecTitle] = useState("");
  const [recChannel, setRecChannel] = useState<ZakatDisbursementChannel>("Direct Employee");
  const [recMode, setRecMode] = useState<ZakatDisbursementMode>("Cash Grant");
  const [recAssetMasterId, setRecAssetMasterId] = useState("");
  const [recAssetType, setRecAssetType] = useState("");
  const [recAssetName, setRecAssetName] = useState("");
  const [recAssetQty, setRecAssetQty] = useState("");
  const [recAssetVendor, setRecAssetVendor] = useState("");
  const [recAssetInvoice, setRecAssetInvoice] = useState("");
  const [recAssetRemarks, setRecAssetRemarks] = useState("");
  const [recAttachments, setRecAttachments] = useState<ZakatAttachment[]>([]);
  const [recEmpId, setRecEmpId] = useState("");
  const [recEmpName, setRecEmpName] = useState("");
  const [recBeneficiaryName, setRecBeneficiaryName] = useState("");
  const [recBeneficiaryPhone, setRecBeneficiaryPhone] = useState("");
  const [recInstitutionName, setRecInstitutionName] = useState("");
  const [recPurposeCategory, setRecPurposeCategory] = useState<ZakatPurposeCategory>("Medical Treatment");
  const [recOtherPurpose, setRecOtherPurpose] = useState("");
  const [recPurposeDesc, setRecPurposeDesc] = useState("");
  const [recMonthlyAmount, setRecMonthlyAmount] = useState("10000"); // Default starter, but fully editable
  const [recDisbursementDay, setRecDisbursementDay] = useState("1");
  const [recStartDate, setRecStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [recTotalMonths, setRecTotalMonths] = useState("12");
  const [recAsnaf, setRecAsnaf] = useState<ZakatRecord["asnafCategory"]>("Al-Masakin");
  const [recNotes, setRecNotes] = useState("");

  // Dynamic Cadence & 1-Year Advance Settlement
  const [recCadence, setRecCadence] = useState<DisbursementCadence>("Monthly");
  const [recSettlementType, setRecSettlementType] = useState<DisbursementSettlementType>("Periodic Installments");
  const [recPaymentMethod, setRecPaymentMethod] = useState<
    "Bank Transfer" | "Mobile Financial Service" | "Cash Handover" | "In-Kind Delivery"
  >("Bank Transfer");
  const [recPaymentAccount, setRecPaymentAccount] = useState("");
  const [recBeneficiaryAddress, setRecBeneficiaryAddress] = useState("");

  // Instant 1-Year Advance Settle Modal for Active Schedules
  const [advanceSettleSchedule, setAdvanceSettleSchedule] = useState<RecurringZakatSchedule | null>(null);
  const [advanceSettleMonths, setAdvanceSettleMonths] = useState(12);
  const [advanceSettleMethod, setAdvanceSettleMethod] = useState<
    "Bank Transfer" | "Mobile Financial Service" | "Cash Handover" | "In-Kind Delivery"
  >("Bank Transfer");
  const [advanceSettleAccount, setAdvanceSettleAccount] = useState("");
  const [advanceSettleNotes, setAdvanceSettleNotes] = useState("");

  // Attachment upload and management helpers
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "modal" | "recurring"
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const sizeStr =
          file.size > 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
            : `${Math.round(file.size / 1024)} KB`;
        const att: ZakatAttachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: file.name,
          size: sizeStr,
          type: file.type || "application/octet-stream",
          dataUrl,
          uploadedAt: new Date().toISOString().slice(0, 10),
        };
        if (target === "modal") {
          setModalAttachments((prev) => [...prev, att]);
        } else {
          setRecAttachments((prev) => [...prev, att]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeAttachment = (id: string, target: "modal" | "recurring") => {
    if (target === "modal") {
      setModalAttachments((prev) => prev.filter((a) => a.id !== id));
    } else {
      setRecAttachments((prev) => prev.filter((a) => a.id !== id));
    }
  };

  // Master asset catalog selection handlers
  const handleSelectMasterAsset = (selectedId: string) => {
    setModalAssetMasterId(selectedId);
    if (!selectedId) {
      setModalAssetType("");
      return;
    }
    const item = getActiveZakatAssetMasterList().find((m) => m.id === selectedId);
    if (item) {
      setModalAssetType(item.assetType);
      setModalAssetName(item.assetType);
      setModalAssetQty(item.defaultQty);
      if (item.defaultVendorLocation) {
        setModalAssetVendor(item.defaultVendorLocation);
      }
      if (item.suggestedPurpose) {
        setNewPurposeCategory(item.suggestedPurpose);
      }
    }
  };

  const handleSelectRecMasterAsset = (selectedId: string) => {
    setRecAssetMasterId(selectedId);
    if (!selectedId) {
      setRecAssetType("");
      return;
    }
    const item = getActiveZakatAssetMasterList().find((m) => m.id === selectedId);
    if (item) {
      setRecAssetType(item.assetType);
      setRecAssetName(item.assetType);
      setRecAssetQty(item.defaultQty);
      if (item.defaultVendorLocation) {
        setRecAssetVendor(item.defaultVendorLocation);
      }
      if (item.suggestedPurpose) {
        setRecPurposeCategory(item.suggestedPurpose);
      }
    }
  };

  // Modal 3: Submit Proof
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [proofReceiptRef, setProofReceiptRef] = useState("");
  const [proofWitnessName, setProofWitnessName] = useState("");
  const [proofWitnessPhone, setProofWitnessPhone] = useState("");
  const [proofNotes, setProofNotes] = useState("");

  // Modal 4: Itemized Drill-Down Report Modal (Clickable Audit Trail)
  const [drillDownState, setDrillDownState] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    purpose?: ZakatPurposeCategory | "ALL";
    channel?: ZakatDisbursementChannel | "ALL";
    mode?: ZakatDisbursementMode | "ALL";
  }>({
    isOpen: false,
    title: "",
    subtitle: "",
    purpose: "ALL",
    channel: "ALL",
    mode: "ALL",
  });
  const [drillDownSearch, setDrillDownSearch] = useState("");
  const [drillDownModeFilter, setDrillDownModeFilter] = useState<"ALL" | ZakatDisbursementMode>("ALL");
  const [drillDownChannelFilter, setDrillDownChannelFilter] = useState<"ALL" | ZakatDisbursementChannel>("ALL");

  const openDrillDownForPurpose = (purpose: ZakatPurposeCategory, mode: "ALL" | ZakatDisbursementMode = "ALL") => {
    setDrillDownState({
      isOpen: true,
      title: `${purpose} — Itemized Distribution Details`,
      subtitle: `Complete audit trail of all allocations and cases for ${purpose} (${selectedBudgetYear})`,
      purpose,
      channel: "ALL",
      mode,
    });
    setDrillDownModeFilter(mode);
    setDrillDownChannelFilter("ALL");
    setDrillDownSearch("");
  };

  const openDrillDownForChannel = (channel: ZakatDisbursementChannel, mode: "ALL" | ZakatDisbursementMode = "ALL") => {
    setDrillDownState({
      isOpen: true,
      title: `${channel} — Itemized Distribution Details`,
      subtitle: `Complete audit trail of all allocations through ${channel} (${selectedBudgetYear})`,
      purpose: "ALL",
      channel,
      mode,
    });
    setDrillDownModeFilter(mode);
    setDrillDownChannelFilter(channel);
    setDrillDownSearch("");
  };

  // Standard employee list
  const employeesList = useMemo(() => {
    if (typeof window !== "undefined") {
      const synced = localStorage.getItem("recruitment_synced_employees");
      if (synced) {
        try {
          const parsed = JSON.parse(synced);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
    }
    return [
      {
        id: "2023043910",
        name: "Tahmid Afsar Shapno",
        dept: "Business Innovation",
        sect: "Project Resource & Strategy",
        title: "Asst. Manager",
        joinDate: "01/08/2023",
        gross: "152000.00",
      },
      {
        id: "2023046001",
        name: "Sohanur Rahman Sohan",
        dept: "HR, Admin and Compliance",
        sect: "Admin",
        title: "Executive",
        joinDate: "01/11/2023",
        gross: "27000.00",
      },
      {
        id: "2023043021",
        name: "Easin Mia",
        dept: "HR, Admin and Compliance",
        sect: "Admin",
        title: "Receptionist",
        joinDate: "01/02/2023",
        gross: "19000.00",
      },
      {
        id: "2026059411",
        name: "Jannatul Maowa",
        dept: "HR, Admin and Compliance",
        sect: "Admin",
        title: "Jr. Executive",
        joinDate: "10/05/2026",
        gross: "20000.00",
      },
      {
        id: "2024049326",
        name: "Hanif Uddin",
        dept: "Business Innovation",
        sect: "APPS Team",
        title: "Sr. Executive",
        joinDate: "01/06/2024",
        gross: "50000.00",
      },
      {
        id: "2026058726",
        name: "Parvej Mahmud",
        dept: "Business Innovation",
        sect: "APPS Team",
        title: "Executive",
        joinDate: "22/02/2026",
        gross: "40000.00",
      },
      {
        id: "2023045044",
        name: "Sultan Ahmed",
        dept: "Implementation & Business Analysis",
        sect: "Business Analysis",
        title: "Manager",
        joinDate: "01/10/2023",
        gross: "81000.00",
      },
    ];
  }, []);

  const filteredEmployeesForDropdown = useMemo(() => {
    if (!empSearchInput.trim()) return [];
    const q = empSearchInput.toLowerCase();
    return employeesList.filter(
      (emp) => emp.name.toLowerCase().includes(q) || emp.id.toLowerCase().includes(q)
    );
  }, [employeesList, empSearchInput]);

  const selectedEmpDetails = useMemo(() => {
    return employeesList.find((emp) => emp.id === newEmpId) || null;
  }, [employeesList, newEmpId]);

  // Compute help totals historically for an employee
  const getPreviousHelpTotals = (empId: string) => {
    let totalZakat = 0;
    let totalAid = 0;

    if (typeof window !== "undefined") {
      const savedZakat = localStorage.getItem("cripton_zakat_records");
      if (savedZakat) {
        try {
          const parsed = JSON.parse(savedZakat);
          if (Array.isArray(parsed)) {
            totalZakat = parsed
              .filter((r: any) => r.employeeId === empId && r.agencyStatus === "Verified")
              .reduce((sum, r) => sum + (r.amount || 0), 0);
          }
        } catch (e) {}
      }

      const savedAid = localStorage.getItem("cripton_financial_aid");
      if (savedAid) {
        try {
          const parsed = JSON.parse(savedAid);
          if (Array.isArray(parsed)) {
            totalAid = parsed
              .filter((r: any) => r.employeeId === empId && r.status === "Approved")
              .reduce((sum, r) => sum + (r.amount || 0), 0);
          }
        } catch (e) {}
      }
    }
    return { totalZakat, totalAid };
  };

  // ==========================================
  // 5. ANALYTICAL CALCULATIONS & STATS
  // ==========================================
  const stats = useMemo(() => {
    const yearRecords = records.filter(
      (r) => r.budgetYear === selectedBudgetYear || r.assignedDate.startsWith(selectedBudgetYear.toString())
    );

    let totalAssigned = 0;
    let totalDistributed = 0;

    // Channel Segregation (3-way)
    let totalDirectEmployee = 0;
    let countDirectEmployee = 0;
    let totalViaAgent = 0;
    let countViaAgent = 0;
    let totalDirectExternal = 0;
    let countDirectExternal = 0;

    // Mode Segregation (2-way: Cash vs Asset)
    let totalCashGrants = 0;
    let countCashGrants = 0;
    let totalAssetPurchased = 0;
    let countAssetPurchased = 0;

    const purposeBreakdown: Record<ZakatPurposeCategory, { total: number; count: number; cash: number; asset: number }> = {
      "Mosque/Madrasa": { total: 0, count: 0, cash: 0, asset: 0 },
      "Medical Treatment": { total: 0, count: 0, cash: 0, asset: 0 },
      Vehicle: { total: 0, count: 0, cash: 0, asset: 0 },
      "Farm Animal": { total: 0, count: 0, cash: 0, asset: 0 },
      "Business Setup": { total: 0, count: 0, cash: 0, asset: 0 },
      Others: { total: 0, count: 0, cash: 0, asset: 0 },
    };

    yearRecords.forEach((r) => {
      totalAssigned += r.amount;
      if (r.agencyStatus === "Distributed" || r.agencyStatus === "Verified") {
        totalDistributed += r.amount;
      }

      // Channel Segregation
      if (r.disbursementChannel === "Direct Employee") {
        totalDirectEmployee += r.amount;
        countDirectEmployee++;
      } else if (r.disbursementChannel === "Via Employee Agent") {
        totalViaAgent += r.amount;
        countViaAgent++;
      } else {
        totalDirectExternal += r.amount;
        countDirectExternal++;
      }

      // Mode Segregation
      if (r.disbursementMode === "Asset Purchased") {
        totalAssetPurchased += r.amount;
        countAssetPurchased++;
      } else {
        totalCashGrants += r.amount;
        countCashGrants++;
      }

      // Purpose breakdown
      const targetCat = purposeBreakdown[r.purposeCategory] ? r.purposeCategory : "Others";
      purposeBreakdown[targetCat].total += r.amount;
      purposeBreakdown[targetCat].count += 1;
      if (r.disbursementMode === "Asset Purchased") {
        purposeBreakdown[targetCat].asset += r.amount;
      } else {
        purposeBreakdown[targetCat].cash += r.amount;
      }
    });

    const activeMonthlyCommitment = recurringSchedules
      .filter((s) => s.status === "Active")
      .reduce((sum, s) => sum + s.monthlyAmount, 0);

    const currentBudget = budgetPools.find((b) => b.year === selectedBudgetYear)?.amount || 0;
    const remainingBudget = currentBudget - totalAssigned;

    return {
      currentBudget,
      totalAssigned,
      totalDistributed,
      remainingBudget,
      // Channels
      totalDirectEmployee,
      countDirectEmployee,
      totalViaAgent,
      countViaAgent,
      totalDirectExternal,
      countDirectExternal,
      // Modes
      totalCashGrants,
      countCashGrants,
      totalAssetPurchased,
      countAssetPurchased,
      // Recurring
      activeMonthlyCommitment,
      activeSchedulesCount: recurringSchedules.filter((s) => s.status === "Active").length,
      // Purpose breakdown
      purposeBreakdown,
      totalRecords: yearRecords.length,
      pendingDisbursementCount: yearRecords.filter((r) => r.agencyStatus !== "Verified").length,
    };
  }, [records, recurringSchedules, budgetPools, selectedBudgetYear]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (r.budgetYear && r.budgetYear !== selectedBudgetYear && !r.assignedDate.startsWith(selectedBudgetYear.toString())) {
        return false;
      }
      if (filterStatus !== "ALL" && r.agencyStatus !== filterStatus) return false;
      if (filterPurpose !== "ALL" && r.purposeCategory !== filterPurpose) return false;
      if (filterChannel !== "ALL" && r.disbursementChannel !== filterChannel) return false;
      if (filterMode !== "ALL" && r.disbursementMode !== filterMode) return false;
      if (filterEntryType === "RECURRING" && !r.isRecurring) return false;
      if (filterEntryType === "ONE_TIME" && r.isRecurring) return false;
      if (dateFrom && r.assignedDate < dateFrom) return false;
      if (dateTo && r.assignedDate > dateTo) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.id.toLowerCase().includes(q) ||
          r.beneficiaryName.toLowerCase().includes(q) ||
          (r.employeeName && r.employeeName.toLowerCase().includes(q)) ||
          (r.employeeId && r.employeeId.toLowerCase().includes(q)) ||
          (r.institutionName && r.institutionName.toLowerCase().includes(q)) ||
          (r.assetDetails?.assetName && r.assetDetails.assetName.toLowerCase().includes(q)) ||
          (r.purposeSpecificDescription && r.purposeSpecificDescription.toLowerCase().includes(q)) ||
          (r.otherPurposeDetails && r.otherPurposeDetails.toLowerCase().includes(q)) ||
          r.purposeCategory.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [records, selectedBudgetYear, filterStatus, filterPurpose, filterChannel, filterMode, filterEntryType, dateFrom, dateTo, searchQuery]);

  const activeRecord = useMemo(() => {
    return records.find((r) => r.id === selectedRecordId) || null;
  }, [records, selectedRecordId]);

  // ==========================================
  // 6. ACTION HANDLERS
  // ==========================================

  // Save One-Time Zakat Record
  const handleAssignZakat = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newAmount || parseFloat(newAmount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (modalChannel === "Direct Employee" && (!newEmpId || !newEmpName)) {
      alert("Please select an internal employee from the search dropdown.");
      return;
    }

    if (modalChannel === "Via Employee Agent" && (!newEmpId || !newBeneficiaryName.trim())) {
      alert("Please select the agent employee AND provide the beneficiary's name in their village.");
      return;
    }

    if (modalChannel === "Direct External" && !newInstitutionName.trim() && !newBeneficiaryName.trim()) {
      alert("Please enter the outside beneficiary person or institution name.");
      return;
    }

    if (modalMode === "Asset Purchased" && !modalAssetName.trim()) {
      alert("Please specify the asset/item being purchased (e.g. Van, Cow, Tea Stall Setup).");
      return;
    }

    if (newPurposeCategory === "Others" && !newOtherPurposeDetails.trim()) {
      alert("Please specify the custom purpose in the 'Others' details field.");
      return;
    }

    const amountNum = parseFloat(newAmount);
    if (amountNum > stats.remainingBudget) {
      if (
        !confirm(
          `Warning: The requested amount (৳${amountNum.toLocaleString()}) exceeds the remaining budget pool (৳${stats.remainingBudget.toLocaleString()}). Do you still wish to proceed?`
        )
      ) {
        return;
      }
    }

    const today = new Date().toISOString().slice(0, 10);
    const resolvedBeneficiary =
      modalChannel === "Direct Employee"
        ? `${newEmpName} (Staff Self)`
        : modalChannel === "Direct External" && newInstitutionName.trim()
        ? newInstitutionName
        : newBeneficiaryName;

    const newRecord: ZakatRecord = {
      id: `ZK-${selectedBudgetYear}-${String(records.length + 1).padStart(2, "0")}`,
      budgetYear: selectedBudgetYear,
      assignedDate: today,
      distributionDeadline: newDeadline || today,
      amount: amountNum,
      isRecurring: false,
      disbursementChannel: modalChannel,
      disbursementMode: modalMode,
      assetDetails:
        modalMode === "Asset Purchased"
          ? {
              assetType: modalAssetType || undefined,
              assetName: modalAssetName,
              assetQuantity: modalAssetQty || "1 Unit",
              vendorOrMarket: modalAssetVendor,
              invoiceRef: modalAssetInvoice,
              remarks: modalAssetRemarks || undefined,
            }
          : undefined,
      purposeCategory: newPurposeCategory,
      otherPurposeDetails: newPurposeCategory === "Others" ? newOtherPurposeDetails : undefined,
      purposeSpecificDescription:
        newPurposeDescription.trim() ||
        (modalMode === "Asset Purchased"
          ? `Asset: ${modalAssetName}`
          : newPurposeCategory === "Others"
          ? newOtherPurposeDetails
          : `${newPurposeCategory} Grant`),
      employeeId: modalChannel === "Direct Employee" || modalChannel === "Via Employee Agent" ? newEmpId : undefined,
      employeeName: modalChannel === "Direct Employee" || modalChannel === "Via Employee Agent" ? newEmpName : undefined,
      employeeDept: selectedEmpDetails?.dept,
      employeeDesignation: selectedEmpDetails?.title,
      beneficiaryName: resolvedBeneficiary,
      beneficiaryPhone: newBeneficiaryPhone,
      beneficiaryAddress: newBeneficiaryAddress,
      institutionName: modalChannel === "Direct External" && newInstitutionName ? newInstitutionName : undefined,
      institutionType: modalChannel === "Direct External" && newInstitutionName ? newInstitutionType : undefined,
      institutionRepresentative: modalChannel === "Direct External" && newInstitutionName ? newInstitutionRep : undefined,
      institutionContactPhone: modalChannel === "Direct External" && newInstitutionName ? newInstitutionPhone : undefined,
      asnafCategory: newAsnaf,
      justificationDetails: newJustification || "Approved corporate Zakat disbursement.",
      agencyStatus: "Assigned",
      attachments: modalAttachments.length > 0 ? modalAttachments : undefined,
    };

    setRecords((prev) => [newRecord, ...prev]);
    setIsAssignModalOpen(false);

    // Reset Form
    setNewEmpId("");
    setNewEmpName("");
    setEmpSearchInput("");
    setNewBeneficiaryName("");
    setNewBeneficiaryPhone("");
    setNewBeneficiaryAddress("");
    setNewInstitutionName("");
    setNewInstitutionRep("");
    setNewInstitutionPhone("");
    setModalAssetMasterId("");
    setModalAssetType("");
    setModalAssetName("");
    setModalAssetQty("");
    setModalAssetVendor("");
    setModalAssetInvoice("");
    setModalAssetRemarks("");
    setModalAttachments([]);
    setNewAmount("");
    setNewPurposeCategory("Medical Treatment");
    setNewOtherPurposeDetails("");
    setNewPurposeDescription("");
    setNewDeadline("");
    setNewJustification("");
  };

  // Save Recurring Schedule
  const handleSaveRecurringSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recTitle.trim() || !recMonthlyAmount || parseFloat(recMonthlyAmount) <= 0) {
      alert("Please provide a title and valid monthly amount.");
      return;
    }

    const monthlyAmt = parseFloat(recMonthlyAmount);
    const resolvedBeneficiary =
      recChannel === "Direct Employee"
        ? `${recEmpName} (Staff)`
        : recChannel === "Direct External" && recInstitutionName
        ? recInstitutionName
        : recBeneficiaryName;

    const isAdvance = recSettlementType === "1-Year Full Advance";
    const plannedMonths = isAdvance ? (parseInt(recTotalMonths) || 12) : (parseInt(recTotalMonths) || undefined);
    const totalAdvanceAmt = isAdvance ? monthlyAmt * (plannedMonths || 12) : 0;
    const scheduleId = `REC-ZK-${selectedBudgetYear}-${String(recurringSchedules.length + 1).padStart(2, "0")}`;

    const newSchedule: RecurringZakatSchedule = {
      id: scheduleId,
      title: recTitle,
      disbursementChannel: recChannel,
      disbursementMode: recMode,
      assetDetails:
        recMode === "Asset Purchased"
          ? {
              assetType: recAssetType || undefined,
              assetName: recAssetName || recTitle,
              assetQuantity: recAssetQty || "1 Unit",
              vendorOrMarket: recAssetVendor,
              invoiceRef: recAssetInvoice,
              remarks: recAssetRemarks || undefined,
            }
          : undefined,
      employeeId: recChannel === "Direct Employee" || recChannel === "Via Employee Agent" ? recEmpId : undefined,
      employeeName: recChannel === "Direct Employee" || recChannel === "Via Employee Agent" ? recEmpName : undefined,
      beneficiaryName: resolvedBeneficiary || "Beneficiary",
      beneficiaryPhone: recBeneficiaryPhone,
      beneficiaryAddress: recBeneficiaryAddress || undefined,
      institutionName: recChannel === "Direct External" ? recInstitutionName : undefined,
      purposeCategory: recPurposeCategory,
      otherPurposeDetails: recPurposeCategory === "Others" ? recOtherPurpose : undefined,
      purposeDescription: recPurposeDesc || `${recPurposeCategory} ${isAdvance ? "Full 1-Year Advance Stipend" : "regular monthly stipend"}`,
      asnafCategory: recAsnaf,
      monthlyAmount: monthlyAmt,
      cadence: recCadence,
      settlementType: recSettlementType,
      isUpfrontFullYearPaid: isAdvance,
      disbursementMethod: recPaymentMethod,
      paymentDetails: recPaymentAccount || undefined,
      disbursementDayOfMonth: parseInt(recDisbursementDay) || 1,
      startDate: recStartDate,
      totalPlannedMonths: plannedMonths,
      status: isAdvance ? "Completed" : "Active",
      installmentsGenerated: isAdvance ? (plannedMonths || 12) : 0,
      totalAmountDisbursed: isAdvance ? totalAdvanceAmt : 0,
      nextDueDate: isAdvance ? "Fully Settled Upfront" : recStartDate,
      createdAt: new Date().toISOString().slice(0, 10),
      notes: isAdvance
        ? `1-Year Full Advance Upfront Disbursement (৳${totalAdvanceAmt.toLocaleString()} covering ${plannedMonths || 12} consecutive months). ${recNotes}`
        : recNotes,
      attachments: recAttachments.length > 0 ? recAttachments : undefined,
    };

    setRecurringSchedules((prev) => [newSchedule, ...prev]);

    // If 1-Year Advance, immediately post single advance record into main ledger
    if (isAdvance) {
      const advanceLedgerRecord: ZakatRecord = {
        id: `ZK-${selectedBudgetYear}-${String(records.length + 1).padStart(2, "0")}`,
        budgetYear: selectedBudgetYear,
        assignedDate: recStartDate,
        distributionDeadline: recStartDate,
        amount: totalAdvanceAmt,
        isRecurring: true,
        recurringScheduleId: scheduleId,
        installmentNumber: 1,
        installmentTotal: 1,
        isAdvanceLumpSum: true,
        advancePeriodCovered: `Full 1-Year Advance (${plannedMonths || 12} Months Upfront: ${recStartDate} to +12 Months)`,
        disbursementChannel: recChannel,
        disbursementMode: recMode,
        assetDetails: newSchedule.assetDetails,
        purposeCategory: recPurposeCategory,
        otherPurposeDetails: recPurposeCategory === "Others" ? recOtherPurpose : undefined,
        purposeSpecificDescription: `Full 1-Year Advance Stipend (${plannedMonths || 12} Months Upfront): ${recTitle}`,
        employeeId: newSchedule.employeeId,
        employeeName: newSchedule.employeeName,
        beneficiaryName: resolvedBeneficiary || "Beneficiary",
        beneficiaryPhone: recBeneficiaryPhone,
        beneficiaryAddress: recBeneficiaryAddress || undefined,
        institutionName: recChannel === "Direct External" ? recInstitutionName : undefined,
        asnafCategory: recAsnaf,
        justificationDetails: `Full 1-Year upfront advance Zakat stipend for ${recTitle}. Total ৳${totalAdvanceAmt.toLocaleString()} covering ${plannedMonths || 12} months at ৳${monthlyAmt.toLocaleString()}/mo via ${recPaymentMethod} ${recPaymentAccount ? `(${recPaymentAccount})` : ""}.`,
        agencyStatus: "Distributed",
        attachments: recAttachments.length > 0 ? recAttachments : undefined,
      };

      setRecords((prev) => [advanceLedgerRecord, ...prev]);
    }

    setIsRecurringModalOpen(false);

    // Reset Form
    setRecTitle("");
    setRecAssetMasterId("");
    setRecAssetType("");
    setRecAssetName("");
    setRecAssetQty("");
    setRecAssetVendor("");
    setRecAssetInvoice("");
    setRecAssetRemarks("");
    setRecAttachments([]);
    setRecEmpId("");
    setRecEmpName("");
    setRecBeneficiaryName("");
    setRecBeneficiaryPhone("");
    setRecBeneficiaryAddress("");
    setRecInstitutionName("");
    setRecMonthlyAmount("10000");
    setRecCadence("Monthly");
    setRecSettlementType("Periodic Installments");
    setRecPaymentMethod("Bank Transfer");
    setRecPaymentAccount("");
    setRecPurposeDesc("");
    setRecNotes("");

    // Trigger auto-check immediately if periodic
    if (!isAdvance) {
      setTimeout(() => executeDueRecurringBatch(), 200);
    }
  };

  // Instant 1-Year Advance Settlement for Existing Schedule
  const handleExecuteAdvanceSettlement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advanceSettleSchedule) return;

    const remainingMonths = Math.max(
      1,
      (advanceSettleSchedule.totalPlannedMonths || 12) - advanceSettleSchedule.installmentsGenerated
    );
    const settleMonths = Math.min(advanceSettleMonths || 12, remainingMonths > 0 ? remainingMonths : 12);
    const advanceTotal = advanceSettleSchedule.monthlyAmount * settleMonths;
    const todayStr = new Date().toISOString().slice(0, 10);

    const advanceRecord: ZakatRecord = {
      id: `ZK-${selectedBudgetYear}-${String(records.length + 1).padStart(2, "0")}`,
      budgetYear: selectedBudgetYear,
      assignedDate: todayStr,
      distributionDeadline: todayStr,
      amount: advanceTotal,
      isRecurring: true,
      recurringScheduleId: advanceSettleSchedule.id,
      installmentNumber: advanceSettleSchedule.installmentsGenerated + 1,
      installmentTotal: advanceSettleSchedule.totalPlannedMonths || 12,
      isAdvanceLumpSum: true,
      advancePeriodCovered: `Full ${settleMonths}-Month Advance Settlement (${todayStr} to +${settleMonths} Months)`,
      disbursementChannel: advanceSettleSchedule.disbursementChannel,
      disbursementMode: advanceSettleSchedule.disbursementMode,
      assetDetails: advanceSettleSchedule.assetDetails,
      purposeCategory: advanceSettleSchedule.purposeCategory,
      otherPurposeDetails: advanceSettleSchedule.otherPurposeDetails,
      purposeSpecificDescription: `Full ${settleMonths}-Month Advance Settlement: ${advanceSettleSchedule.title}`,
      employeeId: advanceSettleSchedule.employeeId,
      employeeName: advanceSettleSchedule.employeeName,
      employeeDept: advanceSettleSchedule.employeeDept,
      employeeDesignation: advanceSettleSchedule.employeeDesignation,
      beneficiaryName: advanceSettleSchedule.institutionName || advanceSettleSchedule.beneficiaryName,
      beneficiaryPhone: advanceSettleSchedule.beneficiaryPhone,
      beneficiaryAddress: advanceSettleSchedule.beneficiaryAddress,
      institutionName: advanceSettleSchedule.institutionName,
      asnafCategory: advanceSettleSchedule.asnafCategory,
      justificationDetails: `Upfront advance settlement covering ${settleMonths} months at ৳${advanceSettleSchedule.monthlyAmount.toLocaleString()}/mo via ${advanceSettleMethod} ${advanceSettleAccount ? `(${advanceSettleAccount})` : ""}. ${advanceSettleNotes}`,
      agencyStatus: "Distributed",
      attachments: advanceSettleSchedule.attachments,
    };

    setRecords((prev) => [advanceRecord, ...prev]);

    setRecurringSchedules((prev) =>
      prev.map((s) => {
        if (s.id === advanceSettleSchedule.id) {
          const newGen = s.installmentsGenerated + settleMonths;
          const newDisbursed = s.totalAmountDisbursed + advanceTotal;
          const isDone = s.totalPlannedMonths ? newGen >= s.totalPlannedMonths : true;
          return {
            ...s,
            installmentsGenerated: newGen,
            totalAmountDisbursed: newDisbursed,
            isUpfrontFullYearPaid: true,
            settlementType: "1-Year Full Advance",
            status: isDone ? "Completed" : "Active",
            disbursementMethod: advanceSettleMethod,
            paymentDetails: advanceSettleAccount || s.paymentDetails,
            nextDueDate: "Fully Settled Upfront",
            notes:
              (s.notes ? s.notes + "\n" : "") +
              `Settled ${settleMonths} months advance of ৳${advanceTotal.toLocaleString()} on ${todayStr}.`,
          };
        }
        return s;
      })
    );

    setAdvanceSettleSchedule(null);
    setAdvanceSettleAccount("");
    setAdvanceSettleNotes("");
  };

  const handleToggleScheduleStatus = (scheduleId: string, currentStatus: RecurringScheduleStatus) => {
    const nextStatus = currentStatus === "Active" ? "Paused" : "Active";
    setRecurringSchedules((prev) =>
      prev.map((s) => (s.id === scheduleId ? { ...s, status: nextStatus } : s))
    );
  };

  const handleDeleteRecord = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this Zakat record?")) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      if (selectedRecordId === id) setSelectedRecordId(null);
    }
  };

  const handleUpdateStatus = (id: string, nextStatus: ZakatRecord["agencyStatus"]) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, agencyStatus: nextStatus } : r))
    );
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofReceiptRef || !proofWitnessName) {
      alert("Receipt reference and witness name are required.");
      return;
    }
    if (!selectedRecordId) return;

    const today = new Date().toISOString().slice(0, 10);
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === selectedRecordId) {
          return {
            ...r,
            agencyStatus: "Distributed",
            proofDetails: {
              receiptRef: proofReceiptRef,
              witnessName: proofWitnessName,
              witnessPhone: proofWitnessPhone,
              notes: proofNotes,
              submittedAt: today,
            },
          };
        }
        return r;
      })
    );
    setIsProofModalOpen(false);
  };

  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      alert("No records to export.");
      return;
    }
    const headers = [
      "Record ID",
      "Type",
      "Channel",
      "Aid Mode",
      "Asset Purchased / Details",
      "Beneficiary / Institution",
      "Staff Agent (if any)",
      "Purpose Category",
      "Amount (BDT)",
      "Assigned Date",
      "Deadline",
      "Asnaf Category",
      "Status",
    ];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.isRecurring ? `Recurring (#${r.installmentNumber || 1}/${r.installmentTotal || 12})` : "One-Time",
      `"${r.disbursementChannel}"`,
      `"${r.disbursementMode}"`,
      `"${(r.assetDetails?.assetName || r.purposeSpecificDescription || "N/A").replace(/"/g, '""')}"`,
      `"${r.beneficiaryName.replace(/"/g, '""')}"`,
      `"${(r.employeeName || "N/A").replace(/"/g, '""')}"`,
      r.purposeCategory,
      r.amount,
      r.assignedDate,
      r.distributionDeadline,
      r.asnafCategory,
      r.agencyStatus,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `zakat_governance_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Matching records for the interactive Drill-Down Details Modal
  const matchingDrillDownRecords = useMemo(() => {
    if (!drillDownState.isOpen) return [];
    return records.filter((r) => {
      // Budget Year filter
      const inYear = r.budgetYear === selectedBudgetYear || r.assignedDate.startsWith(selectedBudgetYear.toString());
      if (!inYear) return false;

      // Purpose filter
      if (drillDownState.purpose && drillDownState.purpose !== "ALL" && r.purposeCategory !== drillDownState.purpose) {
        return false;
      }

      // Channel filter
      if (drillDownChannelFilter !== "ALL" && r.disbursementChannel !== drillDownChannelFilter) {
        return false;
      }

      // Mode filter
      if (drillDownModeFilter !== "ALL" && r.disbursementMode !== drillDownModeFilter) {
        return false;
      }

      // Live search filter
      if (drillDownSearch.trim()) {
        const q = drillDownSearch.toLowerCase();
        const match =
          r.id.toLowerCase().includes(q) ||
          r.beneficiaryName.toLowerCase().includes(q) ||
          (r.employeeName && r.employeeName.toLowerCase().includes(q)) ||
          (r.institutionName && r.institutionName.toLowerCase().includes(q)) ||
          (r.beneficiaryAddress && r.beneficiaryAddress.toLowerCase().includes(q)) ||
          (r.beneficiaryPhone && r.beneficiaryPhone.toLowerCase().includes(q)) ||
          (r.assetDetails?.assetName && r.assetDetails.assetName.toLowerCase().includes(q)) ||
          (r.assetDetails?.vendorOrMarket && r.assetDetails.vendorOrMarket.toLowerCase().includes(q)) ||
          (r.assetDetails?.invoiceRef && r.assetDetails.invoiceRef.toLowerCase().includes(q)) ||
          (r.purposeSpecificDescription && r.purposeSpecificDescription.toLowerCase().includes(q)) ||
          (r.justificationDetails && r.justificationDetails.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [records, selectedBudgetYear, drillDownState, drillDownChannelFilter, drillDownModeFilter, drillDownSearch]);

  const drillDownStats = useMemo(() => {
    const totalAmount = matchingDrillDownRecords.reduce((acc, r) => acc + r.amount, 0);
    const cashAmount = matchingDrillDownRecords
      .filter((r) => r.disbursementMode !== "Asset Purchased")
      .reduce((acc, r) => acc + r.amount, 0);
    const assetAmount = matchingDrillDownRecords
      .filter((r) => r.disbursementMode === "Asset Purchased")
      .reduce((acc, r) => acc + r.amount, 0);
    return {
      totalAmount,
      cashAmount,
      assetAmount,
      totalCount: matchingDrillDownRecords.length,
    };
  }, [matchingDrillDownRecords]);

  const handleExportDrillDownCSV = () => {
    if (matchingDrillDownRecords.length === 0) {
      alert("No records to export.");
      return;
    }
    const headers = [
      "Record ID",
      "Type",
      "Channel",
      "Aid Mode",
      "What Was Given (Asset / Purpose)",
      "Vendor / Showroom / Hospital",
      "Invoice Ref",
      "Beneficiary / Institution",
      "Phone",
      "Location / Village / Hospital Address",
      "Staff Agent / Rep",
      "Purpose Category",
      "Amount (BDT)",
      "Assigned Date",
      "Deadline",
      "Asnaf Category",
      "Status",
    ];
    const rows = matchingDrillDownRecords.map((r) => [
      r.id,
      r.isRecurring ? `Recurring (#${r.installmentNumber || 1})` : "One-Time",
      `"${r.disbursementChannel}"`,
      `"${r.disbursementMode}"`,
      `"${(r.assetDetails?.assetName || r.purposeSpecificDescription || "N/A").replace(/"/g, '""')}"`,
      `"${(r.assetDetails?.vendorOrMarket || "N/A").replace(/"/g, '""')}"`,
      `"${(r.assetDetails?.invoiceRef || "N/A").replace(/"/g, '""')}"`,
      `"${(r.institutionName || r.beneficiaryName).replace(/"/g, '""')}"`,
      `"${(r.beneficiaryPhone || "N/A").replace(/"/g, '""')}"`,
      `"${(r.beneficiaryAddress || "N/A").replace(/"/g, '""')}"`,
      `"${(r.employeeName || "N/A").replace(/"/g, '""')}"`,
      r.purposeCategory,
      r.amount,
      r.assignedDate,
      r.distributionDeadline,
      r.asnafCategory,
      r.agencyStatus,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const cleanTag = (drillDownState.purpose || drillDownState.channel || "report").toLowerCase().replace(/[^a-z0-9]/g, "_");
    link.setAttribute("download", `zakat_drilldown_${cleanTag}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-slate-800 transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 space-y-4 max-w-[1700px] mx-auto w-full">
          {/* Header Console */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4 print:hidden">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                <Link to="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2.5" />
                <span>Welfare & Support</span>
                <ChevronRight className="size-2.5" />
                <span className="text-emerald-600 font-bold">Zakat Management</span>
              </div>
              <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <HeartHandshake className="size-5" />
                </div>
                <span>Zakat Governance & Multi-Dimensional Tracker</span>
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Channel segregation (Direct Employee vs. Via Employee Agent vs. Outside Public) &middot; Aid Mode (Cash vs. Asset Purchased: Dokan, Rickshaw, Cow/Goat) &middot; Flexible Monthly Stipends.
              </p>
            </div>

            {/* Top Toolbar Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase px-2">Pool Year:</span>
                <select
                  value={selectedBudgetYear}
                  onChange={(e) => setSelectedBudgetYear(parseInt(e.target.value))}
                  className="h-7 px-2.5 rounded-lg bg-white text-xs font-bold text-slate-800 border-0 outline-none shadow-xs"
                >
                  {budgetPools.map((b) => (
                    <option key={b.year} value={b.year}>
                      {b.year}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setModalChannel("Direct Employee");
                  setModalMode("Cash Grant");
                  setNewEmpId("");
                  setNewEmpName("");
                  setEmpSearchInput("");
                  setNewAmount("");
                  setIsAssignModalOpen(true);
                }}
                className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>Assign Zakat Case</span>
              </button>

              <button
                onClick={() => setIsRecurringModalOpen(true)}
                className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Repeat className="size-3.5" />
                <span>+ Setup Recurring Stipend</span>
              </button>
            </div>
          </div>

          {/* Auto-Gen Notification Banner */}
          {autoGenNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top-1 print:hidden">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-emerald-600 animate-spin" />
                <span>{autoGenNotice}</span>
              </div>
              <button onClick={() => setAutoGenNotice(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">
                <X className="size-3.5" />
              </button>
            </div>
          )}

          {/* Tier 1: Macro Budget & 3-Way Channel Segregation Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 print:hidden">
            {/* Total Budget */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                {selectedBudgetYear} Budget Pool
              </span>
              <div className="text-lg font-black text-slate-900 mt-1 font-mono">
                ৳ {stats.currentBudget.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Corporate Allocation</div>
            </div>

            {/* Channel 1: Direct Employee */}
            <div 
              onClick={() => openDrillDownForChannel("Direct Employee", "ALL")}
              className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/80 shadow-xs flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-purple-300 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-purple-700 uppercase tracking-widest group-hover:underline">
                  1. Direct Employee
                </span>
              </div>
              <div className="text-lg font-black text-purple-800 mt-1 font-mono">
                ৳ {stats.totalDirectEmployee.toLocaleString()}
              </div>
              <div className="text-[10px] text-purple-600 font-medium mt-0.5">
                {stats.countDirectEmployee} Staff Beneficiaries &rarr;
              </div>
            </div>

            {/* Channel 2: Via Employee Agent */}
            <div 
              onClick={() => openDrillDownForChannel("Via Employee Agent", "ALL")}
              className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 shadow-xs flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-blue-700 uppercase tracking-widest group-hover:underline">
                  2. Via Staff Agent
                </span>
              </div>
              <div className="text-lg font-black text-blue-800 mt-1 font-mono">
                ৳ {stats.totalViaAgent.toLocaleString()}
              </div>
              <div className="text-[10px] text-blue-600 font-medium mt-0.5">
                {stats.countViaAgent} Distributed in Villages &rarr;
              </div>
            </div>

            {/* Channel 3: Direct External */}
            <div 
              onClick={() => openDrillDownForChannel("Direct External", "ALL")}
              className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 shadow-xs flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-amber-300 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-amber-700 uppercase tracking-widest group-hover:underline">
                  3. Direct External
                </span>
              </div>
              <div className="text-lg font-black text-amber-800 mt-1 font-mono">
                ৳ {stats.totalDirectExternal.toLocaleString()}
              </div>
              <div className="text-[10px] text-amber-600 font-medium mt-0.5">
                {stats.countDirectExternal} Madrasa / Public &rarr;
              </div>
            </div>

            {/* Mode Split: Cash vs. Asset Purchased */}
            <div 
              onClick={() => {
                setDrillDownState({
                  isOpen: true,
                  title: "All Aid Modes — Cash & Asset Distribution Portfolio",
                  subtitle: `Complete breakdown of in-kind asset purchases vs. cash grants (${selectedBudgetYear})`,
                  purpose: "ALL",
                  channel: "ALL",
                  mode: "ALL",
                });
                setDrillDownModeFilter("ALL");
                setDrillDownChannelFilter("ALL");
                setDrillDownSearch("");
              }}
              className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 shadow-xs flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-indigo-300 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest group-hover:underline">
                  Asset vs. Cash Split
                </span>
              </div>
              <div className="text-xs font-black text-indigo-900 mt-1 font-mono space-y-0.5">
                <div>Asset: ৳{stats.totalAssetPurchased.toLocaleString()}</div>
                <div className="text-slate-600 font-medium">Cash: ৳{stats.totalCashGrants.toLocaleString()}</div>
              </div>
              <div className="text-[10px] text-indigo-600 font-semibold mt-0.5">
                {stats.countAssetPurchased} Assets (Van, Cow, Dokan) &rarr;
              </div>
            </div>

            {/* Remaining Balance */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 shadow-xs flex flex-col justify-between">
              <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest">
                Remaining Balance
              </span>
              <div className="text-lg font-black text-emerald-800 mt-1 font-mono">
                ৳ {stats.remainingBudget.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                {stats.totalAssigned > 0
                  ? `${((stats.totalAssigned / stats.currentBudget) * 100).toFixed(1)}% disbursed`
                  : "0% disbursed"}
              </div>
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 print:hidden">
            <button
              onClick={() => setActiveTab("ledger")}
              className={`h-9 px-4 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === "ledger"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>All Detailed Report</span>
              <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-white font-bold">
                {filteredRecords.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("recurring")}
              className={`h-9 px-4 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === "recurring"
                  ? "bg-emerald-700 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>Monthly Recurring Stipends</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                {stats.activeSchedulesCount} Active (৳{stats.activeMonthlyCommitment.toLocaleString()}/mo)
              </span>
            </button>

            <Link
              to="/zakat-executive-report"
              className="h-9 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              title="Open Executive Multi-Dimensional Report sub-menu"
            >
              <span>Executive Multi-Dimensional Report</span>
              <ExternalLink className="size-3 text-blue-600" />
            </Link>
          </div>

          {/* ========================================================= */}
          {/* TAB 1: ALL DETAILED REPORT / DISTRIBUTIONS LEDGER         */}
          {/* ========================================================= */}
          {activeTab === "ledger" && (
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 space-y-4">
              {/* Comprehensive Filter Toolbar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 print:hidden">
                <div className="flex flex-wrap items-center gap-2 flex-1">
                  {/* Channel Filter (3-way) */}
                  <select
                    value={filterChannel}
                    onChange={(e) => setFilterChannel(e.target.value)}
                    className="h-8 px-2.5 rounded bg-white border border-slate-300 text-xs text-slate-700 outline-none"
                  >
                    <option value="ALL">All Beneficiary Channels</option>
                    <option value="Direct Employee">Direct Employee (Company Staff)</option>
                    <option value="Via Employee Agent">Via Staff Agent (Village Handover)</option>
                    <option value="Direct External">Direct External (Outside Person / Org)</option>
                  </select>

                  {/* Mode Filter (Cash vs Asset) */}
                  <select
                    value={filterMode}
                    onChange={(e) => setFilterMode(e.target.value)}
                    className="h-8 px-2.5 rounded bg-white border border-slate-300 text-xs text-slate-700 outline-none"
                  >
                    <option value="ALL">All Aid Modes (Cash & Assets)</option>
                    <option value="Cash Grant">Cash / Bank Grant</option>
                    <option value="Asset Purchased">In-Kind Asset Purchased</option>
                  </select>

                  {/* Purpose Category */}
                  <select
                    value={filterPurpose}
                    onChange={(e) => setFilterPurpose(e.target.value)}
                    className="h-8 px-2.5 rounded bg-white border border-slate-300 text-xs text-slate-700 outline-none"
                  >
                    <option value="ALL">All Purposes</option>
                    <option value="Mosque/Madrasa">Mosque / Madrasa</option>
                    <option value="Medical Treatment">Medical Treatment</option>
                    <option value="Vehicle">Vehicle / Transport</option>
                    <option value="Farm Animal">Farm Animal</option>
                    <option value="Business Setup">Business Setup</option>
                    <option value="Others">Others</option>
                  </select>

                  {/* Type Filter */}
                  <select
                    value={filterEntryType}
                    onChange={(e) => setFilterEntryType(e.target.value)}
                    className="h-8 px-2.5 rounded bg-white border border-slate-300 text-xs text-slate-700 outline-none"
                  >
                    <option value="ALL">All Grant Types</option>
                    <option value="ONE_TIME">One-Time Only</option>
                    <option value="RECURRING">Recurring Monthly Only</option>
                  </select>

                  {/* Status */}
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="h-8 px-2.5 rounded bg-white border border-slate-300 text-xs text-slate-700 outline-none"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="Assigned">Assigned (Dispatched)</option>
                    <option value="Acknowledged">Acknowledged</option>
                    <option value="Distributed">Distributed (Pending HR)</option>
                    <option value="Verified">Verified & Completed</option>
                  </select>

                  {/* Search */}
                  <div className="relative min-w-[220px] flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search beneficiary, employee, asset, ID..."
                      className="w-full h-8 px-3 rounded bg-white border border-slate-300 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-slate-500"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handleExportCSV}
                    className="h-8 px-3 rounded border border-slate-300 hover:bg-slate-50 font-medium text-xs transition-colors text-slate-700 cursor-pointer"
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={handlePrint}
                    className="h-8 px-3 rounded border border-slate-300 hover:bg-slate-50 font-medium text-xs transition-colors text-slate-700 cursor-pointer"
                  >
                    Print
                  </button>
                </div>
              </div>

              {/* Date Filters */}
              <div className="flex flex-wrap gap-2.5 items-center pt-0.5 text-xs print:hidden">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  Disbursed Date:
                </span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-7 px-2 rounded bg-white border border-slate-300 text-xs text-slate-700"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-7 px-2 rounded bg-white border border-slate-300 text-xs text-slate-700"
                />
                {(dateFrom || dateTo) && (
                  <button
                    onClick={() => {
                      setDateFrom("");
                      setDateTo("");
                    }}
                    className="text-[11px] text-blue-600 font-medium hover:underline cursor-pointer"
                  >
                    Clear Dates
                  </button>
                )}
              </div>

              {/* Regular, Simple, Professional Corporate Table */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                        <th className="px-4 py-3 text-center w-12">SL</th>
                        <th className="px-4 py-3">Case ID & Date</th>
                        <th className="px-4 py-3">Beneficiary & Channel</th>
                        <th className="px-4 py-3">Aid Mode & Specifics</th>
                        <th className="px-4 py-3">Staff Agent / Proxy</th>
                        <th className="px-4 py-3 text-right">Amount (৳)</th>
                        <th className="px-4 py-3 text-center">Deadline</th>
                        <th className="px-4 py-3 text-center">Status</th>
                        <th className="px-4 py-3 text-center print:hidden">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {filteredRecords.map((row, index) => {
                        const isSelected = row.id === selectedRecordId;
                        return (
                          <tr
                            key={row.id}
                            onClick={() => setSelectedRecordId(row.id)}
                            className={`cursor-pointer transition-colors hover:bg-slate-50/75 ${
                              isSelected ? "bg-slate-100/60" : ""
                            }`}
                          >
                            <td className="px-4 py-3 text-xs text-slate-400 text-center font-medium">
                              {index + 1}
                            </td>

                            {/* ID & Type */}
                            <td className="px-4 py-3 align-top whitespace-nowrap">
                              <div className="font-mono font-bold text-slate-900">{row.id}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5">{row.assignedDate}</div>
                              {row.isRecurring ? (
                                <div className="text-[10px] text-blue-700 font-medium mt-0.5">
                                  Recurring #{row.installmentNumber || 1}
                                </div>
                              ) : (
                                <div className="text-[10px] text-slate-400 mt-0.5">One-Time</div>
                              )}
                            </td>

                            {/* Beneficiary & Channel */}
                            <td className="px-4 py-3 align-top min-w-[200px]">
                              <div className="font-semibold text-slate-900">
                                {row.institutionName || row.beneficiaryName}
                              </div>
                              <div className="text-[11px] text-slate-600 mt-0.5">
                                {row.disbursementChannel}
                              </div>
                              {row.beneficiaryPhone && (
                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                  {row.beneficiaryPhone}
                                </div>
                              )}
                            </td>

                            {/* Aid Mode & Asset / Spec */}
                            <td className="px-4 py-3 align-top min-w-[240px]">
                              <div className="font-semibold text-slate-900">
                                {row.disbursementMode === "Asset Purchased" ? "Asset Purchased" : "Cash Grant"} &middot;{" "}
                                <span className="font-normal text-slate-600">{row.purposeCategory}</span>
                              </div>
                              {row.disbursementMode === "Asset Purchased" ? (
                                <div className="text-xs text-slate-700 mt-0.5">
                                  Item: <strong className="text-slate-800">{row.assetDetails?.assetName || "Physical Asset"}</strong>{" "}
                                  ({row.assetDetails?.assetQuantity || "1 Unit"})
                                  {row.assetDetails?.vendorOrMarket && (
                                    <span className="text-slate-500"> &middot; {row.assetDetails.vendorOrMarket}</span>
                                  )}
                                </div>
                              ) : (
                                <div className="text-xs text-slate-600 mt-0.5 leading-snug line-clamp-2">
                                  {row.purposeSpecificDescription || row.justificationDetails}
                                </div>
                              )}
                              {row.attachments && row.attachments.length > 0 && (
                                <div className="text-[10px] text-blue-600 font-medium mt-0.5">
                                  {row.attachments.length} attachment{row.attachments.length > 1 ? "s" : ""}
                                </div>
                              )}
                            </td>

                            {/* Staff Agent */}
                            <td className="px-4 py-3 align-top min-w-[160px]">
                              {row.employeeName ? (
                                <div>
                                  <div className="font-medium text-slate-800">{row.employeeName}</div>
                                  <div className="text-[11px] text-slate-400 mt-0.5">
                                    EMP-{row.employeeId?.slice(-4)} &middot; {row.employeeDept || "Staff"}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-slate-400 text-xs">Direct Dispatched</span>
                              )}
                            </td>

                            {/* Amount */}
                            <td className="px-4 py-3 align-top font-mono font-bold text-slate-900 text-xs text-right whitespace-nowrap">
                              ৳ {row.amount.toLocaleString()}
                            </td>

                            {/* Date / Deadline */}
                            <td className="px-4 py-3 align-top text-center whitespace-nowrap">
                              <div className="text-xs text-slate-700 font-mono">{row.distributionDeadline}</div>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3 align-top text-center whitespace-nowrap">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${
                                  row.agencyStatus === "Verified"
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                    : row.agencyStatus === "Distributed"
                                    ? "bg-amber-50 text-amber-800 border-amber-200"
                                    : "bg-slate-100 text-slate-700 border-slate-200"
                                }`}
                              >
                                {row.agencyStatus}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3 align-top text-center whitespace-nowrap print:hidden" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedRecordId(row.id)}
                                  className="px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer transition-colors"
                                >
                                  Inspect
                                </button>
                                {row.agencyStatus !== "Verified" && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedRecordId(row.id);
                                      setIsProofModalOpen(true);
                                    }}
                                    className="px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-50 text-emerald-700 text-xs font-medium cursor-pointer transition-colors"
                                  >
                                    Proof
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteRecord(row.id, e)}
                                  className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-red-50 text-red-600 text-xs font-medium cursor-pointer transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {filteredRecords.length === 0 && (
                        <tr>
                          <td colSpan={9} className="px-4 py-8 text-center text-slate-500 text-xs">
                            No matching Zakat distribution cases found for this criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer Summary */}
                <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2">
                  <div>
                    Showing <strong className="text-slate-900">{filteredRecords.length}</strong> of{" "}
                    <strong className="text-slate-900">{records.length}</strong> total distribution cases
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-600">Total Filtered Disbursed:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      ৳ {filteredRecords.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: MONTHLY RECURRING STIPENDS (FLEXIBLE AMOUNTS)      */}
          {/* ========================================================= */}
          {activeTab === "recurring" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                    <Repeat className="size-4.5 text-emerald-600" />
                    <span>Automated Monthly Recurring Zakat Stipends</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Continuous regular welfare support with fully flexible monthly sums (e.g. ৳5k, ৳8k, ৳10k, ৳15k). Automatically generates each month's ledger entry.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={executeDueRecurringBatch}
                    className="h-9 px-3.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <CalendarClock className="size-3.5 text-emerald-400" />
                    <span>Run Monthly Due Batch</span>
                  </button>

                  <button
                    onClick={() => setIsRecurringModalOpen(true)}
                    className="h-9 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    <span>+ New Recurring Schedule</span>
                  </button>
                </div>
              </div>

              {/* Recurring Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {recurringSchedules.map((schedule) => {
                  const isActive = schedule.status === "Active";
                  const isUpfrontPaid = schedule.isUpfrontFullYearPaid || schedule.settlementType === "1-Year Full Advance";
                  return (
                    <div
                      key={schedule.id}
                      className={`bg-white rounded-2xl p-4 border shadow-xs space-y-3 relative hover:border-slate-300 transition-colors ${
                        isUpfrontPaid ? "border-emerald-300/80 bg-gradient-to-br from-white via-emerald-50/20 to-white" : "border-slate-200/80"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-mono text-[10px] font-bold text-slate-400">{schedule.id}</span>
                            {isUpfrontPaid ? (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                                <span>1-Year Advance Paid</span>
                              </span>
                            ) : (
                              <>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                    isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {schedule.status}
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-800">
                                  {schedule.cadence || "Monthly"}
                                </span>
                              </>
                            )}
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-700">
                              {schedule.purposeCategory}
                            </span>
                            {schedule.disbursementMethod && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-slate-50 text-slate-600 border border-slate-200">
                                {schedule.disbursementMethod}
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-slate-900 text-sm mt-1.5">{schedule.title}</h3>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-base font-black text-emerald-700 font-mono">
                            ৳ {schedule.monthlyAmount.toLocaleString()}
                            <span className="text-[10px] text-slate-400 font-sans font-medium"> / mo</span>
                          </div>
                          <span className="text-[9px] text-slate-400">
                            {isUpfrontPaid ? "Full Advance Settled" : `Day #${schedule.disbursementDayOfMonth} of month`}
                          </span>
                        </div>
                      </div>

                      {/* Beneficiary Details */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Beneficiary:</span>
                          <span className="font-bold text-slate-800">
                            {schedule.institutionName || schedule.beneficiaryName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Channel:</span>
                          <span className="font-medium text-slate-700">{schedule.disbursementChannel}</span>
                        </div>
                        {schedule.paymentDetails && (
                          <div className="flex justify-between">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Transfer Info:</span>
                            <span className="font-medium text-emerald-800 font-mono">{schedule.paymentDetails}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Purpose Spec:</span>
                          <span className="text-slate-700 font-medium truncate max-w-[260px]">
                            {schedule.purposeDescription}
                          </span>
                        </div>
                        {schedule.attachments && schedule.attachments.length > 0 && (
                          <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Mandate Proof:</span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700">
                              <Paperclip className="size-3" />
                              <span>{schedule.attachments.length} Document(s) Attached</span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Progress */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-slate-500">
                            {isUpfrontPaid
                              ? `12 of 12 Months Settled Upfront in Full`
                              : `Generated: ${schedule.installmentsGenerated} of ${schedule.totalPlannedMonths || "∞"} months`}
                          </span>
                          <span className="text-emerald-700 font-mono font-bold">
                            Disbursed: ৳ {schedule.totalAmountDisbursed.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                            style={{
                              width: `${
                                isUpfrontPaid
                                  ? 100
                                  : schedule.totalPlannedMonths
                                  ? Math.min(100, (schedule.installmentsGenerated / schedule.totalPlannedMonths) * 100)
                                  : 50
                              }%`,
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-[9px] text-slate-400">
                          <span>Start: {schedule.startDate}</span>
                          <span>
                            {isUpfrontPaid ? "1-Year Advance Settlement" : `Next Due: ${schedule.nextDueDate}`}
                          </span>
                        </div>
                      </div>

                      {/* Schedule Actions */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {!isUpfrontPaid ? (
                            <>
                              <button
                                onClick={() => handleToggleScheduleStatus(schedule.id, schedule.status)}
                                className={`h-7 px-2.5 rounded-lg font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors ${
                                  isActive
                                    ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                    : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                }`}
                              >
                                {isActive ? <Pause className="size-3" /> : <Play className="size-3" />}
                                <span>{isActive ? "Pause" : "Resume"}</span>
                              </button>

                              <button
                                onClick={() => {
                                  setAdvanceSettleSchedule(schedule);
                                  const rem = Math.max(
                                    1,
                                    (schedule.totalPlannedMonths || 12) - schedule.installmentsGenerated
                                  );
                                  setAdvanceSettleMonths(rem > 0 ? rem : 12);
                                }}
                                className="h-7 px-2.5 rounded-lg font-bold text-[10px] bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                                title="Disburse remaining stipend in advance upfront now"
                              >
                                <span>Settle 1-Yr Advance</span>
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="size-3.5 text-emerald-600" />
                              <span>Mandate Settled Upfront</span>
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            setFilterEntryType("RECURRING");
                            setSearchQuery(schedule.id);
                            setActiveTab("ledger");
                          }}
                          className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <span>View Generated Ledger</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: EXECUTIVE MULTI-DIMENSIONAL AUDIT REPORT           */}
          {/* ========================================================= */}
          {activeTab === "audit" && (
            <div className="space-y-5">
              {/* Report Header */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Executive Multi-Dimensional Zakat Governance Report ({selectedBudgetYear})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Audited cross-tabulation of funds disbursed by Beneficiary Channel (Direct Staff vs. Agent vs. Outside) and Aid Mode (Cash vs. Asset Purchases).
                  </p>
                </div>
                <div className="flex items-center gap-2 print:hidden">
                  <button
                    onClick={() => {
                      setDrillDownState({
                        isOpen: true,
                        title: "All Purpose Categories — Complete Portfolio Breakdown",
                        subtitle: `Complete audit trail of all allocations and cases across all channels and categories (${selectedBudgetYear})`,
                        purpose: "ALL",
                        channel: "ALL",
                        mode: "ALL",
                      });
                      setDrillDownModeFilter("ALL");
                      setDrillDownChannelFilter("ALL");
                      setDrillDownSearch("");
                    }}
                    className="h-8 px-3.5 bg-slate-900 hover:bg-black text-white font-medium text-xs rounded border border-slate-900 transition-colors cursor-pointer shadow-xs"
                  >
                    View All Detailed Report
                  </button>
                  <button
                    onClick={handlePrint}
                    className="h-8 px-3.5 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs rounded border border-slate-300 transition-colors cursor-pointer shadow-xs"
                  >
                    Print Executive Statement
                  </button>
                </div>
              </div>

              {/* REPORT 1: CHANNEL SEGREGATION MATRIX */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Report 1: Beneficiary Channel Segregation (Staff vs. Agent vs. Outside)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Segregates funds distributed directly to staff, channeled through staff proxies for village handovers, or paid to external parties.
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider self-start sm:self-auto">
                    Staff vs. Staff Agent vs. Outside
                  </span>
                </div>

                {/* Explanatory Notice */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs text-slate-700">
                  <div>
                    <strong>Clickable Audit Trail:</strong> Click any channel row or disbursement figure to view the itemized list of beneficiaries, locations, agent handover chains, and receipts.
                  </div>
                  <span className="hidden md:inline-block text-[10px] font-semibold uppercase tracking-wider text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded">
                    Clickable Drill-Down
                  </span>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                        <th className="px-4 py-3">Disbursement Channel</th>
                        <th className="px-4 py-3 text-right">Cash Grants (৳)</th>
                        <th className="px-4 py-3 text-right">Asset Purchased (৳)</th>
                        <th className="px-4 py-3 text-right font-bold text-slate-900">Total Disbursed (৳)</th>
                        <th className="px-4 py-3 text-center">Cases</th>
                        <th className="px-4 py-3 text-right">Share of Zakat (%)</th>
                        <th className="px-4 py-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {[
                        {
                          channel: "Direct Employee" as ZakatDisbursementChannel,
                          label: "Direct Employee (Company Staff)",
                          desc: "Disbursed directly to eligible company staff in need",
                        },
                        {
                          channel: "Via Employee Agent" as ZakatDisbursementChannel,
                          label: "Via Staff Agent (Village Handover)",
                          desc: "Handed to employee to distribute to verified village poor",
                        },
                        {
                          channel: "Direct External" as ZakatDisbursementChannel,
                          label: "Direct External (Outside Person / Madrasa)",
                          desc: "Given directly to outside needy people, mosques, or madrasas",
                        },
                      ].map((item) => {
                        const channelRecords = records.filter(
                          (r) =>
                            (r.budgetYear === selectedBudgetYear || r.assignedDate.startsWith(selectedBudgetYear.toString())) &&
                            r.disbursementChannel === item.channel
                        );

                        const cashTotal = channelRecords
                          .filter((r) => r.disbursementMode !== "Asset Purchased")
                          .reduce((sum, r) => sum + r.amount, 0);

                        const assetTotal = channelRecords
                          .filter((r) => r.disbursementMode === "Asset Purchased")
                          .reduce((sum, r) => sum + r.amount, 0);

                        const total = cashTotal + assetTotal;
                        const share =
                          stats.totalAssigned > 0 ? ((total / stats.totalAssigned) * 100).toFixed(1) : "0.0";

                        return (
                          <tr key={item.channel} className="hover:bg-slate-50/75 transition-colors">
                            <td 
                              onClick={() => openDrillDownForChannel(item.channel, "ALL")}
                              className="px-4 py-3 cursor-pointer"
                            >
                              <div className="font-semibold text-slate-900 hover:text-blue-700 transition-colors">{item.label}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                            </td>
                            <td 
                              onClick={() => openDrillDownForChannel(item.channel, "Cash Grant")}
                              title="Click to view Cash Grants for this channel"
                              className="px-4 py-3 font-mono text-right text-slate-900 font-medium cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                              ৳ {cashTotal.toLocaleString()}
                            </td>
                            <td 
                              onClick={() => openDrillDownForChannel(item.channel, "Asset Purchased")}
                              title="Click to view Assets Purchased for this channel"
                              className="px-4 py-3 font-mono text-right text-slate-900 font-medium cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                              ৳ {assetTotal.toLocaleString()}
                            </td>
                            <td 
                              onClick={() => openDrillDownForChannel(item.channel, "ALL")}
                              title="Click to view all cases for this channel"
                              className="px-4 py-3 font-mono text-right font-bold text-slate-900 cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                              ৳ {total.toLocaleString()}
                            </td>
                            <td 
                              onClick={() => openDrillDownForChannel(item.channel, "ALL")}
                              className="px-4 py-3 text-center font-medium text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                              {channelRecords.length}
                            </td>
                            <td className="px-4 py-3 text-right font-mono font-medium text-slate-700">
                              {share}%
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                type="button"
                                onClick={() => openDrillDownForChannel(item.channel, "ALL")}
                                className="px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                              >
                                Inspect ({channelRecords.length})
                              </button>
                            </td>
                          </tr>
                        );
                      })}

                      {/* Total Row */}
                      <tr 
                        onClick={() => {
                          setDrillDownState({
                            isOpen: true,
                            title: "All Disbursement Channels — Executive Breakdown",
                            subtitle: `Audited breakdown of all cases across all channels (${selectedBudgetYear})`,
                            purpose: "ALL",
                            channel: "ALL",
                            mode: "ALL",
                          });
                          setDrillDownModeFilter("ALL");
                          setDrillDownChannelFilter("ALL");
                          setDrillDownSearch("");
                        }}
                        className="bg-slate-100/80 font-bold border-t-2 border-slate-300 hover:bg-slate-200/70 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3 uppercase text-slate-800">
                          Total All Channels
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-slate-900 font-bold">
                          ৳ {stats.totalCashGrants.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-slate-900 font-bold">
                          ৳ {stats.totalAssetPurchased.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-slate-900 font-bold text-sm">
                          ৳ {stats.totalAssigned.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center text-slate-900">{stats.totalRecords}</td>
                        <td className="px-4 py-3 text-right font-mono text-slate-900">100.0%</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium cursor-pointer"
                          >
                            View All
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* REPORT 2: PURPOSE & ASSET PURCHASE MATRIX */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Report 2: Purpose & Asset Purchase Matrix (Cash Grants vs. Physical Assets Purchased)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Cross-tabulates funds by objective (Medical, Mosque/Madrasa, Vehicle, Cow/Goat, Tea stall/Store) and aid medium (Direct Cash vs. Physical Asset Purchased).
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider self-start sm:self-auto">
                    Cash vs. Physical Assets
                  </span>
                </div>

                {/* Explanatory Notice */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs text-slate-700">
                  <div>
                    <strong>Clickable Purpose Breakdown:</strong> Click any category or amount below to inspect individual cases, vendors, equipment, and receipts.
                  </div>
                  <span className="hidden md:inline-block text-[10px] font-semibold uppercase tracking-wider text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded">
                    Detailed Breakdown
                  </span>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                        <th className="px-4 py-3">Purpose Category</th>
                        <th className="px-4 py-3 text-right">Cash Given (৳)</th>
                        <th className="px-4 py-3 text-right">Asset / Item Bought (৳)</th>
                        <th className="px-4 py-3 text-right font-bold text-slate-900">Total (৳)</th>
                        <th className="px-4 py-3 text-center">Cases</th>
                        <th className="px-4 py-3">Sample Physical Assets Provided</th>
                        <th className="px-4 py-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {(
                        [
                          "Mosque/Madrasa",
                          "Medical Treatment",
                          "Vehicle",
                          "Farm Animal",
                          "Business Setup",
                          "Others",
                        ] as ZakatPurposeCategory[]
                      ).map((purpose) => {
                        const purposeRecords = records.filter(
                          (r) =>
                            (r.budgetYear === selectedBudgetYear || r.assignedDate.startsWith(selectedBudgetYear.toString())) &&
                            r.purposeCategory === purpose
                        );

                        const cashAmt = purposeRecords
                          .filter((r) => r.disbursementMode !== "Asset Purchased")
                          .reduce((sum, r) => sum + r.amount, 0);

                        const assetAmt = purposeRecords
                          .filter((r) => r.disbursementMode === "Asset Purchased")
                          .reduce((sum, r) => sum + r.amount, 0);

                        const total = cashAmt + assetAmt;

                        const sampleAssets = purposeRecords
                          .filter((r) => r.assetDetails?.assetName)
                          .map((r) => r.assetDetails!.assetName)
                          .slice(0, 2)
                          .join(", ");

                        return (
                          <tr key={purpose} className="hover:bg-slate-50/75 transition-colors">
                            <td 
                              onClick={() => openDrillDownForPurpose(purpose, "ALL")}
                              className="px-4 py-3 font-semibold text-slate-900 cursor-pointer hover:text-blue-700 transition-colors"
                            >
                              {purpose}
                            </td>
                            <td 
                              onClick={() => openDrillDownForPurpose(purpose, "Cash Grant")}
                              title={`Click to inspect Cash Grants for ${purpose}`}
                              className="px-4 py-3 font-mono text-right text-slate-900 font-medium cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                              ৳ {cashAmt.toLocaleString()}
                            </td>
                            <td 
                              onClick={() => openDrillDownForPurpose(purpose, "Asset Purchased")}
                              title={`Click to inspect Assets Purchased for ${purpose}`}
                              className="px-4 py-3 font-mono text-right text-slate-900 font-medium cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                              ৳ {assetAmt.toLocaleString()}
                            </td>
                            <td 
                              onClick={() => openDrillDownForPurpose(purpose, "ALL")}
                              title={`Click to inspect all ${purpose} cases`}
                              className="px-4 py-3 font-mono text-right font-bold text-slate-900 cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                              ৳ {total.toLocaleString()}
                            </td>
                            <td 
                              onClick={() => openDrillDownForPurpose(purpose, "ALL")}
                              className="px-4 py-3 text-center font-medium text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                              {purposeRecords.length}
                            </td>
                            <td className="px-4 py-3 text-slate-600 text-xs">
                              {sampleAssets || (purpose === "Mosque/Madrasa" ? "Quran & Madrasa food grant" : "Direct financial grant")}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                type="button"
                                onClick={() => openDrillDownForPurpose(purpose, "ALL")}
                                className="px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                              >
                                Inspect ({purposeRecords.length})
                              </button>
                            </td>
                          </tr>
                        );
                      })}

                      {/* Total Row */}
                      <tr 
                        onClick={() => {
                          setDrillDownState({
                            isOpen: true,
                            title: "All Purpose Categories — Complete Portfolio Breakdown",
                            subtitle: `Audited breakdown of all cases across all purposes (${selectedBudgetYear})`,
                            purpose: "ALL",
                            channel: "ALL",
                            mode: "ALL",
                          });
                          setDrillDownModeFilter("ALL");
                          setDrillDownChannelFilter("ALL");
                          setDrillDownSearch("");
                        }}
                        className="bg-slate-100/80 font-bold border-t-2 border-slate-300 hover:bg-slate-200/70 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3 uppercase text-slate-800">
                          Total All Purposes
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-slate-900 font-bold">
                          ৳ {stats.totalCashGrants.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-slate-900 font-bold">
                          ৳ {stats.totalAssetPurchased.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-slate-900 font-bold text-sm">
                          ৳ {stats.totalAssigned.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center text-slate-900">{stats.totalRecords}</td>
                        <td className="px-4 py-3 text-slate-600 text-xs">All portfolio grants and physical assets</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium cursor-pointer"
                          >
                            View All
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ========================================================= */}
      {/* MODAL 1: ASSIGN ZAKAT CASE (ONE-TIME)                     */}
      {/* ========================================================= */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-5xl xl:max-w-6xl rounded-[24px] shadow-2xl border border-slate-200 flex flex-col my-6 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 md:px-8 py-4.5 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white size-10 rounded-xl flex items-center justify-center shadow-xs">
                  <HeartHandshake className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Assign Zakat Handover Case</h3>
                  <p className="text-xs text-slate-500 font-medium">Channel &middot; Aid Mode &middot; Beneficiary Details &middot; Purpose &middot; Financials</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAssignZakat} className="flex flex-col">
              <div className="p-6 md:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                {/* 1. Beneficiary Channel Selector (3-way) */}
                <div className="space-y-2.5">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1 whitespace-nowrap">
                    <span>1. Beneficiary Channel (Internal Staff, Village Proxy, or External)</span> <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      {
                        type: "Direct Employee" as ZakatDisbursementChannel,
                        label: "Direct Employee",
                        subTitle: "Internal Company Staff",
                        sub: "Direct Staff Beneficiary in Need",
                        icon: User,
                      },
                      {
                        type: "Via Employee Agent" as ZakatDisbursementChannel,
                        label: "Via Staff Agent",
                        subTitle: "Staff Village Handover",
                        sub: "Employee Acts as Local Proxy",
                        icon: HeartHandshake,
                      },
                      {
                        type: "Direct External" as ZakatDisbursementChannel,
                        label: "Direct External",
                        subTitle: "Outside Person / Institution",
                        sub: "Madrasa, Mosque, or Destitute Public",
                        icon: Building,
                      },
                    ].map((c) => {
                      const isSel = modalChannel === c.type;
                      const Icon = c.icon;
                      return (
                        <button
                          type="button"
                          key={c.type}
                          onClick={() => setModalChannel(c.type)}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between h-full ${
                            isSel
                              ? "bg-blue-50/80 border-blue-600 ring-2 ring-blue-600/20 shadow-xs"
                              : "bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60"
                          }`}
                        >
                          <div>
                            <div className={`flex items-center gap-2 font-bold text-xs ${isSel ? "text-blue-700" : "text-slate-800"}`}>
                              <Icon className="size-4 shrink-0" />
                              <span className="text-sm font-black">{c.label}</span>
                            </div>
                            <div className="text-xs font-semibold text-slate-700 mt-1.5">{c.subTitle}</div>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-200/60">{c.sub}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Disbursement Mode Selector (Cash vs Asset) */}
                <div className="space-y-2.5">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1 whitespace-nowrap">
                    <span>2. Aid Mode / Form (Cash Grant vs. Physical Asset Purchase)</span> <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setModalMode("Cash Grant")}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between h-full ${
                        modalMode === "Cash Grant"
                          ? "bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-600/20 shadow-xs"
                          : "bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60"
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                        <Banknote className="size-4.5 shrink-0 text-emerald-600" />
                        <span>Direct Cash / Financial Grant</span>
                      </div>
                      <div className="text-xs text-slate-600 mt-2">
                        Cash, bank transfer, or mobile financial service handed over directly to the recipient.
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setModalMode("Asset Purchased")}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between h-full ${
                        modalMode === "Asset Purchased"
                          ? "bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-600/20 shadow-xs"
                          : "bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60"
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-sm text-indigo-800">
                        <ShoppingBag className="size-4.5 shrink-0 text-indigo-600" />
                        <span>In-Kind Asset / Item Purchased</span>
                      </div>
                      <div className="text-xs text-slate-600 mt-2">
                        Procuring productive items: auto-van, rickshaw, cattle/livestock, tea stall setup, or medical gear.
                      </div>
                    </button>
                  </div>
                </div>

                {/* Conditional Asset Purchase Fields */}
                {modalMode === "Asset Purchased" && (
                  <div className="p-5 bg-indigo-50/40 rounded-2xl border border-indigo-200 space-y-4 animate-in fade-in duration-150">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-indigo-100 pb-2">
                      <div className="text-[11px] font-black text-indigo-900 uppercase tracking-wide flex items-center gap-1.5">
                        <ShoppingBag className="size-4 text-indigo-600" />
                        <span>Physical Asset Purchase Details</span>
                      </div>
                      <span className="text-[10px] text-indigo-700 font-bold bg-indigo-100/70 px-2 py-0.5 rounded-full border border-indigo-200">
                        Master Catalog Linked
                      </span>
                    </div>

                    {/* Master Data Catalog Dropdown */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-bold text-slate-700 uppercase whitespace-nowrap">
                          Asset Type (Master Data Catalog) <span className="text-red-500">*</span>
                        </label>
                        <Link
                          to="/zakat-asset-master"
                          target="_blank"
                          className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold hover:underline flex items-center gap-0.5"
                        >
                          <span>Manage Catalog</span>
                          <ExternalLink className="size-2.5" />
                        </Link>
                      </div>
                      <select
                        value={modalAssetMasterId}
                        onChange={(e) => handleSelectMasterAsset(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-indigo-300 bg-white text-xs font-bold text-slate-800 outline-none focus:border-indigo-600 shadow-xs"
                      >
                        <option value="">-- Choose Asset from Master Data (or enter custom title below) --</option>
                        {Array.from(new Set(getActiveZakatAssetMasterList().map((m) => m.category))).map((cat) => (
                          <optgroup key={cat} label={cat}>
                            {getActiveZakatAssetMasterList().filter((m) => m.category === cat).map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.assetType} ({item.defaultQty})
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Selecting an asset type auto-populates description, default quantity, market hub, and automatically switches the Purpose Category.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      <div className="lg:col-span-2">
                        <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1 whitespace-nowrap">
                          Asset / Item Description <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={modalAssetName}
                          onChange={(e) => setModalAssetName(e.target.value)}
                          placeholder="e.g. Battery Electric Cargo Auto-Van / 2 Dairy Breeding Goats"
                          className="w-full h-10 px-3 rounded-lg border border-indigo-200 bg-white text-xs font-semibold outline-none focus:border-indigo-600 text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1 whitespace-nowrap">
                          Vendor / Market Location
                        </label>
                        <input
                          type="text"
                          value={modalAssetVendor}
                          onChange={(e) => setModalAssetVendor(e.target.value)}
                          placeholder="e.g. Gafargaon Cattle Hat / Sreepur"
                          className="w-full h-10 px-3 rounded-lg border border-indigo-200 bg-white text-xs outline-none focus:border-indigo-600 text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1 whitespace-nowrap">
                          Quantity / Unit
                        </label>
                        <input
                          type="text"
                          value={modalAssetQty}
                          onChange={(e) => setModalAssetQty(e.target.value)}
                          placeholder="e.g. 1 Unit / 2 Goats"
                          className="w-full h-10 px-3 rounded-lg border border-indigo-200 bg-white text-xs outline-none focus:border-indigo-600 text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1 whitespace-nowrap">
                          Invoice / Receipt No.
                        </label>
                        <input
                          type="text"
                          value={modalAssetInvoice}
                          onChange={(e) => setModalAssetInvoice(e.target.value)}
                          placeholder="e.g. VOUCHER-9981"
                          className="w-full h-10 px-3 rounded-lg border border-indigo-200 bg-white text-xs font-mono outline-none focus:border-indigo-600 text-slate-800"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1 whitespace-nowrap">
                          Asset Remarks & Handover Notes <span className="text-slate-400 font-normal">(Condition, Warranty, Location)</span>
                        </label>
                        <input
                          type="text"
                          value={modalAssetRemarks}
                          onChange={(e) => setModalAssetRemarks(e.target.value)}
                          placeholder="e.g. Verified 1-year battery warranty; inspected healthy condition at handover."
                          className="w-full h-10 px-3 rounded-lg border border-indigo-200 bg-white text-xs outline-none focus:border-indigo-600 text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Conditional Staff Agent / Employee Selection */}
                {(modalChannel === "Direct Employee" || modalChannel === "Via Employee Agent") && (
                  <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block">
                      {modalChannel === "Direct Employee"
                        ? "Select Beneficiary Employee *"
                        : "Select Employee Agent (Staff Representative) *"}
                    </label>
                    <div className="relative">
                      <Search className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search employee name or ID..."
                        value={empSearchInput}
                        onChange={(e) => {
                          setEmpSearchInput(e.target.value);
                          setIsEmpDropdownOpen(true);
                          if (!e.target.value) {
                            setNewEmpId("");
                            setNewEmpName("");
                          }
                        }}
                        onFocus={() => setIsEmpDropdownOpen(true)}
                        className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-300 bg-white text-xs font-medium outline-none focus:border-blue-500 text-slate-800 shadow-xs"
                      />
                      {isEmpDropdownOpen && filteredEmployeesForDropdown.length > 0 && (
                        <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl z-50 divide-y divide-slate-100">
                          {filteredEmployeesForDropdown.map((emp) => {
                            const totals = getPreviousHelpTotals(emp.id);
                            return (
                              <div
                                key={emp.id}
                                onClick={() => {
                                  setNewEmpId(emp.id);
                                  setNewEmpName(emp.name);
                                  setEmpSearchInput(`${emp.name} (${emp.id})`);
                                  setIsEmpDropdownOpen(false);
                                }}
                                className="p-2.5 cursor-pointer hover:bg-blue-50 flex items-center justify-between text-xs"
                              >
                                <div>
                                  <div className="font-bold text-slate-800">
                                    {emp.name} <span className="text-slate-500">({emp.id})</span>
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    {emp.dept} &middot; {emp.title}
                                  </div>
                                </div>
                                {(totals.totalZakat > 0 || totals.totalAid > 0) && (
                                  <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                    Prior Zakat: ৳{totals.totalZakat.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {newEmpId && selectedEmpDetails && (
                      <div className="p-3.5 bg-white rounded-xl border border-emerald-200 text-xs flex items-center gap-3.5 shadow-xs">
                        <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm">
                          {newEmpName.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                          <div>
                            <span className="text-slate-400 font-bold uppercase block text-[9px]">Employee</span>
                            <span className="font-bold text-slate-900">{newEmpName}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold uppercase block text-[9px]">Designation</span>
                            <span className="text-slate-700 font-medium">{selectedEmpDetails.title}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold uppercase block text-[9px]">Department</span>
                            <span className="text-slate-700 font-medium">{selectedEmpDetails.dept}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold uppercase block text-[9px]">Salary</span>
                            <span className="font-bold text-emerald-700 font-mono">
                              ৳ {parseFloat(selectedEmpDetails.gross).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Conditional Outside Beneficiary Details (for Via Agent or Direct External) */}
                {(modalChannel === "Via Employee Agent" || modalChannel === "Direct External") && (
                  <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block">
                      {modalChannel === "Via Employee Agent"
                        ? "Village Beneficiary Details (Recipient in Employee's Village) *"
                        : "External Beneficiary / Institution *"}
                    </label>

                    {modalChannel === "Direct External" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1 whitespace-nowrap">
                            Madrasa / Mosque / Org (If Institution)
                          </label>
                          <input
                            type="text"
                            value={newInstitutionName}
                            onChange={(e) => setNewInstitutionName(e.target.value)}
                            placeholder="e.g. Darul Uloom Madrasa"
                            className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs outline-none focus:border-blue-500 text-slate-800 shadow-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1 whitespace-nowrap">
                            Representative / Imam
                          </label>
                          <input
                            type="text"
                            value={newInstitutionRep}
                            onChange={(e) => setNewInstitutionRep(e.target.value)}
                            placeholder="e.g. Maulana Mufti Harun"
                            className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs outline-none focus:border-blue-500 text-slate-800 shadow-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1 whitespace-nowrap">
                            Beneficiary Person Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={newBeneficiaryName}
                            onChange={(e) => setNewBeneficiaryName(e.target.value)}
                            placeholder="e.g. Jamil Mia / Ayesha Begum"
                            className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-semibold outline-none focus:border-blue-500 text-slate-800 shadow-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1 whitespace-nowrap">
                            Beneficiary Contact Phone
                          </label>
                          <input
                            type="text"
                            value={newBeneficiaryPhone}
                            onChange={(e) => setNewBeneficiaryPhone(e.target.value)}
                            placeholder="e.g. 01712-345678"
                            className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs outline-none focus:border-blue-500 text-slate-800 shadow-xs"
                          />
                        </div>
                        <div className="md:col-span-2 lg:col-span-4">
                          <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1 whitespace-nowrap">
                            Village / Address Location
                          </label>
                          <input
                            type="text"
                            value={newBeneficiaryAddress}
                            onChange={(e) => setNewBeneficiaryAddress(e.target.value)}
                            placeholder="e.g. Village: Bhaluka, District: Mymensingh"
                            className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs outline-none focus:border-blue-500 text-slate-800 shadow-xs"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1 whitespace-nowrap">
                            Village Beneficiary Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={newBeneficiaryName}
                            onChange={(e) => setNewBeneficiaryName(e.target.value)}
                            placeholder="e.g. Jamil Mia"
                            className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-semibold outline-none focus:border-blue-500 text-slate-800 shadow-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1 whitespace-nowrap">
                            Beneficiary Contact Phone
                          </label>
                          <input
                            type="text"
                            value={newBeneficiaryPhone}
                            onChange={(e) => setNewBeneficiaryPhone(e.target.value)}
                            placeholder="e.g. 01712-345678"
                            className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs outline-none focus:border-blue-500 text-slate-800 shadow-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1 whitespace-nowrap">
                            Village / Location Address
                          </label>
                          <input
                            type="text"
                            value={newBeneficiaryAddress}
                            onChange={(e) => setNewBeneficiaryAddress(e.target.value)}
                            placeholder="e.g. Village: Bhaluka, District: Mymensingh"
                            className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs outline-none focus:border-blue-500 text-slate-800 shadow-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Purpose Category */}
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1 whitespace-nowrap">
                    <span>3. Purpose Category</span> <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                    {[
                      { cat: "Mosque/Madrasa" as ZakatPurposeCategory, label: "Mosque / Madrasa", subTitle: "Islamic Education", icon: Landmark },
                      { cat: "Medical Treatment" as ZakatPurposeCategory, label: "Medical Treatment", subTitle: "Healthcare & Surgery", icon: Activity },
                      { cat: "Vehicle" as ZakatPurposeCategory, label: "Vehicle / Van", subTitle: "Transport Livelihood", icon: Truck },
                      { cat: "Farm Animal" as ZakatPurposeCategory, label: "Farm Animal", subTitle: "Livestock & Dairy", icon: HeartHandshake },
                      { cat: "Business Setup" as ZakatPurposeCategory, label: "Business Setup", subTitle: "Micro-Enterprise", icon: Store },
                      { cat: "Others" as ZakatPurposeCategory, label: "Others", subTitle: "Custom Relief", icon: Layers },
                    ].map((p) => {
                      const isSel = newPurposeCategory === p.cat;
                      const Icon = p.icon;
                      return (
                        <button
                          type="button"
                          key={p.cat}
                          onClick={() => setNewPurposeCategory(p.cat)}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between h-full ${
                            isSel
                              ? "bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-600/20 shadow-xs"
                              : "bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60"
                          }`}
                        >
                          <div className={`flex items-center gap-1.5 font-bold text-xs ${isSel ? "text-emerald-800" : "text-slate-800"}`}>
                            <Icon className="size-4 shrink-0" />
                            <span className="truncate">{p.label}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">{p.subTitle}</div>
                        </button>
                      );
                    })}
                  </div>

                  {newPurposeCategory === "Others" && (
                    <div className="animate-in fade-in space-y-1">
                      <label className="text-[11px] font-bold text-purple-700 uppercase tracking-wide block whitespace-nowrap">
                        Specify Custom Purpose <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newOtherPurposeDetails}
                        onChange={(e) => setNewOtherPurposeDetails(e.target.value)}
                        placeholder="e.g. House flood damage reconstruction / Education scholarship"
                        className="w-full h-10 px-3 rounded-lg border border-purple-300 bg-purple-50/30 text-xs font-bold text-slate-800 outline-none focus:border-purple-600"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide block mb-1 whitespace-nowrap">
                      Specific Purpose Notes / Justification
                    </label>
                    <textarea
                      value={newPurposeDescription}
                      onChange={(e) => setNewPurposeDescription(e.target.value)}
                      placeholder="Add any specific context or remarks regarding this disbursement..."
                      rows={2}
                      className="w-full p-3 rounded-lg border border-slate-300 bg-white text-xs font-medium outline-none focus:border-blue-500 resize-none text-slate-800 shadow-xs"
                    ></textarea>
                  </div>
                </div>

                {/* 4. Financials & Asnaf (Strictly Aligned Grid) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-slate-50/90 rounded-2xl border border-slate-200 items-start">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1 whitespace-nowrap">
                      <span>Disbursement Amount (BDT ৳)</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      placeholder="e.g. 25000"
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-sm font-bold font-mono outline-none focus:border-blue-500 text-slate-900 shadow-xs"
                    />
                    <div className="flex items-center gap-1.5 pt-0.5">
                      {[5000, 10000, 20000, 50000, 100000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setNewAmount(amt.toString())}
                          className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white hover:bg-slate-200 border border-slate-200 text-slate-600 cursor-pointer transition-colors"
                        >
                          ৳{amt >= 1000 ? `${amt / 1000}k` : amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1 whitespace-nowrap">
                      <span>Asnaf Category</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newAsnaf}
                      onChange={(e) => setNewAsnaf(e.target.value as any)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-700 outline-none focus:border-blue-500 shadow-xs"
                    >
                      <option value="Al-Fuqara">Al-Fuqara (The Destitute / Extreme Poor)</option>
                      <option value="Al-Masakin">Al-Masakin (The Needy / Low Income)</option>
                      <option value="Al-Gharimin">Al-Gharimin (Those in Involuntary Debt)</option>
                      <option value="Fi Sabilillah">Fi Sabilillah (In the Cause of Allah)</option>
                      <option value="Ibnus-Sabil">Ibnus-Sabil (The Stranded Traveler)</option>
                    </select>
                    <div className="text-[10px] text-slate-400 font-medium pt-0.5">
                      Islamic eligibility compliance
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1 whitespace-nowrap">
                      <span>Handover Deadline</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium outline-none focus:border-blue-500 shadow-xs text-slate-800"
                    />
                    <div className="text-[10px] text-slate-400 font-medium pt-0.5">
                      Target distribution completion date
                    </div>
                  </div>
                </div>

                {/* 5. Supporting Attachments & Documents */}
                <div className="p-5 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5 whitespace-nowrap">
                      <Paperclip className="size-3.5 text-blue-600" />
                      <span>5. Supporting Attachments & Verification Documents (Optional)</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Attach medical bills, hospital estimates, NID cards, invoices or application forms
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <label className="h-10 px-4 rounded-xl border border-dashed border-blue-400 bg-blue-50/60 hover:bg-blue-100/60 text-blue-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs">
                      <Upload className="size-4" />
                      <span>Upload Supporting Document</span>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xlsx"
                        onChange={(e) => handleFileUpload(e, "modal")}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Supported: PDF, JPG, PNG, DOCX, XLSX (Direct in-browser storage)
                    </span>
                  </div>

                  {modalAttachments.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                      {modalAttachments.map((file) => (
                        <div
                          key={file.id}
                          className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs group hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="size-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                              <FileText className="size-3.5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate max-w-[150px]">{file.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{file.size}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(file.id, "modal")}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remove attachment"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between px-6 md:px-8 py-4.5 border-t border-slate-200 bg-slate-50 rounded-b-[24px]">
                <div className="text-xs font-bold text-slate-600">
                  Remaining Pool Balance: <span className="text-emerald-700 font-black font-mono ml-1 text-sm">৳ {stats.remainingBudget.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAssignModalOpen(false)}
                    className="h-10 px-5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-7 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
                  >
                    Confirm & Save Case
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: SETUP RECURRING MONTHLY STIPEND (FLEXIBLE)       */}
      {/* ========================================================= */}
      {isRecurringModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl lg:max-w-5xl rounded-[24px] shadow-2xl border border-slate-200 flex flex-col my-6 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 md:px-8 py-4.5 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white size-10 rounded-xl flex items-center justify-center shadow-xs">
                  <Repeat className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Configure Recurring Zakat Stipend & Advance Grants</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Flexible Engine
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Continuous monthly welfare allowances or upfront 1-year advance lump-sum settlement (1 bochorer ta ekbare)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRecurringModalOpen(false)}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRecurringSchedule} className="flex flex-col">
              <div className="p-6 md:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                {/* 1. Mandate Name */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-1 whitespace-nowrap">
                    Stipend Title / Mandate Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={recTitle}
                    onChange={(e) => setRecTitle(e.target.value)}
                    placeholder="e.g. Monthly Medical Allowance for Easin Mia / 1-Year Orphan Madrasa Tuition Advance"
                    className="w-full h-10 px-3.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-800 outline-none focus:border-emerald-600 shadow-xs"
                  />
                </div>

                {/* 2. Channel & Purpose */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-1 whitespace-nowrap">
                      Beneficiary Channel <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={recChannel}
                      onChange={(e) => setRecChannel(e.target.value as any)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-700 outline-none focus:border-emerald-600 shadow-xs"
                    >
                      <option value="Direct Employee">Direct Employee (Company Staff)</option>
                      <option value="Via Employee Agent">Via Staff Agent (Village Handover)</option>
                      <option value="Direct External">Direct External (Outside Person / Organization)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-1 whitespace-nowrap">
                      Purpose Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={recPurposeCategory}
                      onChange={(e) => setRecPurposeCategory(e.target.value as any)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-700 outline-none focus:border-emerald-600 shadow-xs"
                    >
                      <option value="Medical Treatment">Medical Treatment (Healthcare / Care)</option>
                      <option value="Mosque/Madrasa">Mosque / Madrasa (Educational / Meals)</option>
                      <option value="Business Setup">Business Setup / Livelihood</option>
                      <option value="Farm Animal">Farm Animal Maintenance</option>
                      <option value="Vehicle">Vehicle Upkeep</option>
                      <option value="Others">Others (Custom Welfare)</option>
                    </select>
                  </div>
                </div>

                {recPurposeCategory === "Others" && (
                  <div className="animate-in fade-in space-y-1">
                    <label className="text-[11px] font-bold text-purple-700 uppercase tracking-wide block whitespace-nowrap">
                      Specify Custom Purpose Details <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={recOtherPurpose}
                      onChange={(e) => setRecOtherPurpose(e.target.value)}
                      placeholder="e.g. Higher Education Tuition Assistance / Winter Blanket Provision"
                      className="w-full h-10 px-3.5 rounded-lg border border-purple-300 bg-purple-50/30 text-xs font-semibold outline-none focus:border-purple-600 text-slate-800 shadow-xs"
                    />
                  </div>
                )}

                {/* Beneficiary Details based on Channel */}
                {recChannel === "Direct Employee" ? (
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-1 whitespace-nowrap">
                      Select Internal Employee <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={recEmpId}
                      onChange={(e) => {
                        setRecEmpId(e.target.value);
                        const emp = employeesList.find((em) => em.id === e.target.value);
                        if (emp) setRecEmpName(emp.name);
                      }}
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 outline-none focus:border-emerald-600 shadow-xs"
                    >
                      <option value="">-- Choose Employee --</option>
                      {employeesList.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} ({emp.id}) &middot; {emp.dept}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : recChannel === "Via Employee Agent" ? (
                  <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3">
                    <p className="text-[11px] font-black uppercase tracking-wide text-slate-700 flex items-center gap-1.5">
                      <Users className="size-3.5 text-blue-600" />
                      <span>Staff Agent & Village Recipient Particulars</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                          Staff Representative / Agent <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={recEmpId}
                          onChange={(e) => {
                            setRecEmpId(e.target.value);
                            const emp = employeesList.find((em) => em.id === e.target.value);
                            if (emp) setRecEmpName(emp.name);
                          }}
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium outline-none focus:border-emerald-600 shadow-xs text-slate-800"
                        >
                          <option value="">-- Choose Staff Agent --</option>
                          {employeesList.map((emp) => (
                            <option key={emp.id} value={emp.id}>
                              {emp.name} ({emp.dept})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                          End Recipient Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={recBeneficiaryName}
                          onChange={(e) => setRecBeneficiaryName(e.target.value)}
                          placeholder="e.g. Fatema Begum / Jamil Mia"
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-semibold outline-none focus:border-emerald-600 shadow-xs text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                          Recipient Contact Phone
                        </label>
                        <input
                          type="text"
                          value={recBeneficiaryPhone}
                          onChange={(e) => setRecBeneficiaryPhone(e.target.value)}
                          placeholder="e.g. 01712-345678"
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs outline-none focus:border-emerald-600 shadow-xs text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                          Village / Location Address
                        </label>
                        <input
                          type="text"
                          value={recBeneficiaryAddress}
                          onChange={(e) => setRecBeneficiaryAddress(e.target.value)}
                          placeholder="e.g. Village: Bhaluka, District: Mymensingh"
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs outline-none focus:border-emerald-600 shadow-xs text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-1 whitespace-nowrap">
                        Outside Beneficiary / Institution Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={recBeneficiaryName}
                        onChange={(e) => {
                          setRecBeneficiaryName(e.target.value);
                          setRecInstitutionName(e.target.value);
                        }}
                        placeholder="e.g. Jamia Qasimul Uloom Madrasa / Rahima Begum"
                        className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-semibold outline-none focus:border-emerald-600 shadow-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-1 whitespace-nowrap">
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        value={recBeneficiaryPhone}
                        onChange={(e) => setRecBeneficiaryPhone(e.target.value)}
                        placeholder="e.g. 01822-778899"
                        className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs outline-none focus:border-emerald-600 shadow-xs text-slate-800"
                      />
                    </div>
                  </div>
                )}

                {/* 3. Disbursement Mode (Cash Grant vs In-Kind Asset) */}
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block whitespace-nowrap">
                    Disbursement Mode <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRecMode("Cash Grant")}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                        recMode === "Cash Grant"
                          ? "bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-600/20 shadow-xs"
                          : "bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Banknote className={`size-4 ${recMode === "Cash Grant" ? "text-emerald-700" : "text-slate-500"}`} />
                        <div>
                          <p className={`text-xs font-bold ${recMode === "Cash Grant" ? "text-emerald-900" : "text-slate-800"}`}>
                            Cash / Bank Transfer
                          </p>
                          <p className="text-[10px] text-slate-400">Direct monetary grant or account transfer</p>
                        </div>
                      </div>
                      {recMode === "Cash Grant" && <CheckCircle2 className="size-4 text-emerald-600" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setRecMode("Asset Purchased")}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                        recMode === "Asset Purchased"
                          ? "bg-purple-50/80 border-purple-600 ring-2 ring-purple-600/20 shadow-xs"
                          : "bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ShoppingBag className={`size-4 ${recMode === "Asset Purchased" ? "text-purple-700" : "text-slate-500"}`} />
                        <div>
                          <p className={`text-xs font-bold ${recMode === "Asset Purchased" ? "text-purple-900" : "text-slate-800"}`}>
                            In-Kind Asset Provisioning
                          </p>
                          <p className="text-[10px] text-slate-400">Physical item purchasing & handover</p>
                        </div>
                      </div>
                      {recMode === "Asset Purchased" && <CheckCircle2 className="size-4 text-purple-600" />}
                    </button>
                  </div>
                </div>

                {/* If In-Kind Asset: Catalog Selector */}
                {recMode === "Asset Purchased" && (
                  <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-200 space-y-3 animate-in fade-in">
                    <p className="text-[11px] font-black uppercase tracking-wide text-purple-900 flex items-center gap-1.5">
                      <ShoppingBag className="size-3.5 text-purple-600" />
                      <span>Physical Asset Purchase Details & Master Catalog</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                          Select from Master Asset Catalog
                        </label>
                        <select
                          value={recAssetMasterId}
                          onChange={(e) => {
                            const chosenId = e.target.value;
                            setRecAssetMasterId(chosenId);
                            const found = getActiveZakatAssetMasterList().find((item) => item.id === chosenId);
                            if (found) {
                              setRecAssetType(found.assetType);
                              setRecAssetName(found.assetType);
                              if (found.defaultQty) setRecAssetQty(found.defaultQty);
                              if (found.defaultVendorLocation) setRecAssetVendor(found.defaultVendorLocation);
                              if (found.suggestedPurpose) setRecPurposeCategory(found.suggestedPurpose);
                            }
                          }}
                          className="w-full h-9 px-3 rounded-lg border border-purple-300 bg-white text-xs font-semibold outline-none focus:border-purple-600 text-slate-800 shadow-xs"
                        >
                          <option value="">-- Choose Standard Asset from Master Catalog --</option>
                          {Array.from(new Set(getActiveZakatAssetMasterList().map((m) => m.category))).map((cat) => (
                            <optgroup key={cat} label={cat}>
                              {getActiveZakatAssetMasterList().filter((a) => a.category === cat).map((a) => (
                                <option key={a.id} value={a.id}>{a.assetType}</option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                          Asset Title / Description <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={recAssetName}
                          onChange={(e) => setRecAssetName(e.target.value)}
                          placeholder="e.g. Easy Bike / Milch Cow"
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-semibold outline-none focus:border-purple-600 text-slate-800 shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                          Quantity & Units
                        </label>
                        <input
                          type="text"
                          value={recAssetQty}
                          onChange={(e) => setRecAssetQty(e.target.value)}
                          placeholder="e.g. 1 Unit / 2 Goats"
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs outline-none focus:border-purple-600 text-slate-800 shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                          Vendor / Market Location
                        </label>
                        <input
                          type="text"
                          value={recAssetVendor}
                          onChange={(e) => setRecAssetVendor(e.target.value)}
                          placeholder="e.g. Bhaluka Bazar / Gafargaon Cattle Hat"
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs outline-none focus:border-purple-600 text-slate-800 shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                          Delivery / Warranty Remarks
                        </label>
                        <input
                          type="text"
                          value={recAssetRemarks}
                          onChange={(e) => setRecAssetRemarks(e.target.value)}
                          placeholder="e.g. 1-year battery warranty included, inspected by vet"
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs outline-none focus:border-purple-600 text-slate-800 shadow-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. ⚡ SETTLEMENT MODE & CADENCE (DYNAMIC) */}
                <div className="p-5 bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-slate-50 rounded-2xl border-2 border-emerald-300/80 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded-md bg-emerald-600 text-white shadow-2xs">
                          <Zap className="size-3.5 fill-white" />
                        </span>
                        <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                          Settlement Mode & Cadence Configuration
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Choose whether to disburse on a recurring automated schedule or pay the full 1-year entitlement upfront in advance.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 self-start sm:self-auto">
                      Dynamic Mandate Engine
                    </span>
                  </div>

                  {/* Two Main Settlement Mode Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Option 1: Periodic Installments */}
                    <button
                      type="button"
                      onClick={() => setRecSettlementType("Periodic Installments")}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                        recSettlementType === "Periodic Installments"
                          ? "bg-white border-emerald-600 ring-2 ring-emerald-600/20 shadow-sm"
                          : "bg-white/60 border-slate-200 hover:border-slate-300 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CalendarClock
                            className={`size-4 ${
                              recSettlementType === "Periodic Installments" ? "text-emerald-600" : "text-slate-400"
                            }`}
                          />
                          <span className="font-bold text-xs text-slate-900">Periodic Scheduled Batches</span>
                        </div>
                        {recSettlementType === "Periodic Installments" && (
                          <CheckCircle2 className="size-4 text-emerald-600" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2">
                        Installments are generated and disbursed automatically per cadence (e.g. ৳{parseFloat(recMonthlyAmount || "0").toLocaleString()} each month).
                      </p>
                    </button>

                    {/* Option 2: 1-Year Full Advance Lump Sum */}
                    <button
                      type="button"
                      onClick={() => {
                        setRecSettlementType("1-Year Full Advance");
                        setRecCadence("Annual Lump Sum");
                        setRecTotalMonths("12");
                      }}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden ${
                        recSettlementType === "1-Year Full Advance"
                          ? "bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-500/40 shadow-sm"
                          : "bg-white/60 border-emerald-300/80 hover:border-emerald-400 hover:bg-emerald-50/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap
                            className={`size-4 ${
                              recSettlementType === "1-Year Full Advance"
                                ? "text-amber-300 animate-pulse fill-amber-300"
                                : "text-emerald-600 fill-emerald-600"
                            }`}
                          />
                          <span
                            className={`font-bold text-xs ${
                              recSettlementType === "1-Year Full Advance" ? "text-white" : "text-emerald-950"
                            }`}
                          >
                            1-Year Full Advance (Upfront Lump Sum)
                          </span>
                        </div>
                        {recSettlementType === "1-Year Full Advance" ? (
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/20 text-white">
                            Active Selection
                          </span>
                        ) : (
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                            Upfront Lump Sum
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-[11px] mt-2 ${
                          recSettlementType === "1-Year Full Advance" ? "text-emerald-100" : "text-slate-600"
                        }`}
                      >
                        Pay all 12 months upfront in a single advance lump sum of ৳{((parseFloat(recMonthlyAmount) || 0) * 12).toLocaleString()}. Posts immediately to the disbursement ledger today!
                      </p>
                    </button>
                  </div>

                  {/* Dynamic Sub-Controls depending on Settlement Type */}
                  {recSettlementType === "Periodic Installments" ? (
                    <div className="space-y-3 pt-2 border-t border-emerald-200/60">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wide block mb-1">
                            Payment Cadence
                          </label>
                          <select
                            value={recCadence}
                            onChange={(e) => setRecCadence(e.target.value as DisbursementCadence)}
                            className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-800 outline-none focus:border-emerald-600 shadow-xs"
                          >
                            <option value="Monthly">Monthly (12 Disb./Year)</option>
                            <option value="Quarterly">Quarterly (Every 3 Months)</option>
                            <option value="Bi-Annual">Bi-Annual (Every 6 Months)</option>
                            <option value="Annual Lump Sum">Annual (Once a Year)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wide block mb-1">
                            Disbursement Day
                          </label>
                          <select
                            value={recDisbursementDay}
                            onChange={(e) => setRecDisbursementDay(e.target.value)}
                            className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-800 outline-none focus:border-emerald-600 shadow-xs"
                          >
                            <option value="1">1st of Month</option>
                            <option value="5">5th of Month</option>
                            <option value="10">10th of Month</option>
                            <option value="15">15th of Month</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wide block mb-1">
                            Total Mandate Duration
                          </label>
                          <select
                            value={recTotalMonths}
                            onChange={(e) => setRecTotalMonths(e.target.value)}
                            className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-800 outline-none focus:border-emerald-600 shadow-xs"
                          >
                            <option value="6">6 Months</option>
                            <option value="12">12 Months (1 Full Year)</option>
                            <option value="24">24 Months (2 Years)</option>
                            <option value="0">Indefinite / Ongoing</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200/90 space-y-3 pt-2">
                      <div className="flex items-center gap-2 text-xs font-black text-emerald-900">
                        <Sparkles className="size-4 text-emerald-700" />
                        <span>1-Year Advance Lump Sum Parameters</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wide block mb-1">
                            Advance Duration Covered
                          </label>
                          <select
                            value={recTotalMonths}
                            onChange={(e) => setRecTotalMonths(e.target.value)}
                            className="w-full h-9 px-3 rounded-lg border border-emerald-300 bg-white text-xs font-bold text-emerald-900 outline-none focus:border-emerald-600 shadow-xs"
                          >
                            <option value="12">12 Months (Full 1-Year Advance - Standard)</option>
                            <option value="6">6 Months (Half-Year Advance)</option>
                            <option value="24">24 Months (2-Year Full Advance)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wide block mb-1">
                            Immediate Disbursement Date
                          </label>
                          <input
                            type="date"
                            value={recStartDate}
                            onChange={(e) => setRecStartDate(e.target.value)}
                            className="w-full h-9 px-3 rounded-lg border border-emerald-300 bg-white text-xs font-bold text-slate-800 outline-none focus:border-emerald-600 shadow-xs"
                          />
                        </div>
                      </div>
                      <p className="text-[11px] text-emerald-800 font-medium">
                        <strong>Automatic Ledger Posting:</strong> Submitting this form will immediately generate a single advance transaction of{" "}
                        <span className="font-mono font-bold text-emerald-950">
                          ৳ {((parseFloat(recMonthlyAmount) || 0) * (parseInt(recTotalMonths) || 12)).toLocaleString()}
                        </span>{" "}
                        in the main ledger with the 1-Year Advance badge, deducting from the current year's Zakat fund pool without requiring monthly repetitive actions.
                      </p>
                    </div>
                  )}
                </div>

                {/* 5. Flexible Monthly Amount with Quick Chips */}
                <div className="p-5 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1 whitespace-nowrap">
                      <span>Monthly Stipend Base Commitment Rate (৳)</span> <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">Quick selection amount chips:</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[3000, 5000, 8000, 10000, 15000, 20000, 25000].map((chip) => (
                      <button
                        type="button"
                        key={chip}
                        onClick={() => setRecMonthlyAmount(chip.toString())}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          recMonthlyAmount === chip.toString()
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-100"
                        }`}
                      >
                        ৳{chip.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    required
                    value={recMonthlyAmount}
                    onChange={(e) => setRecMonthlyAmount(e.target.value)}
                    placeholder="Enter custom monthly rate (e.g. 10000)"
                    className="w-full h-11 px-3.5 rounded-lg border border-emerald-300 bg-white text-sm font-black font-mono text-emerald-800 outline-none focus:border-emerald-600 shadow-xs"
                  />
                </div>

                {/* 6. Payment Transfer Method & Account Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-1 whitespace-nowrap">
                      Disbursement Payment Method <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={recPaymentMethod}
                      onChange={(e) => setRecPaymentMethod(e.target.value as any)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-700 outline-none focus:border-emerald-600 shadow-xs"
                    >
                      <option value="Bank Transfer">Bank Transfer (IBBL / SCB / City Bank)</option>
                      <option value="Mobile Financial Service">Mobile Financial Service (bKash / Nagad / Rocket)</option>
                      <option value="Cash Handover">Cash Handover / Physical Envelope</option>
                      <option value="In-Kind Delivery">In-Kind Delivery / Asset Supplier Direct</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-1 whitespace-nowrap">
                      Payment Account / Wallet / Cheque Ref
                    </label>
                    <input
                      type="text"
                      value={recPaymentAccount}
                      onChange={(e) => setRecPaymentAccount(e.target.value)}
                      placeholder="e.g. IBBL A/C: 2050-112233 or bKash: 01711-223344"
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-semibold outline-none focus:border-emerald-600 shadow-xs text-slate-800"
                    />
                  </div>
                </div>

                {/* 7. Asnaf Category & Instructions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-1 whitespace-nowrap">
                      Asnaf Shariah Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={recAsnaf}
                      onChange={(e) => setRecAsnaf(e.target.value as any)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-700 outline-none focus:border-emerald-600 shadow-xs"
                    >
                      <option value="Al-Masakin">Al-Masakin (The Destitute / Needy)</option>
                      <option value="Al-Fuqara">Al-Fuqara (The Poor / Low-Income)</option>
                      <option value="Fi Sabilillah">Fi Sabilillah (In Cause of Allah / Education)</option>
                      <option value="Al-Gharimin">Al-Gharimin (Debtors in Distress)</option>
                      <option value="Ibnus-Sabil">Ibnus-Sabil (Stranded Travelers)</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-1 whitespace-nowrap">
                      Mandate Purpose Instructions & Justification
                    </label>
                    <textarea
                      value={recPurposeDesc}
                      onChange={(e) => setRecPurposeDesc(e.target.value)}
                      placeholder="e.g. Approved 1-year continuous medical support for chemotherapy or orphan education."
                      rows={2}
                      className="w-full p-3 rounded-lg border border-slate-300 bg-white text-xs font-medium outline-none focus:border-emerald-600 resize-none text-slate-800 shadow-xs"
                    ></textarea>
                  </div>
                </div>

                {/* 8. Supporting Attachments & Mandate Documents */}
                <div className="p-5 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5 whitespace-nowrap">
                      <Paperclip className="size-3.5 text-emerald-600" />
                      <span>Supporting Attachments & Mandate Documents (Optional)</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Attach medical prescriptions, approval letters, or monthly verification proof
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <label className="h-10 px-4 rounded-xl border border-dashed border-emerald-400 bg-emerald-50/60 hover:bg-emerald-100/60 text-emerald-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs">
                      <Upload className="size-4" />
                      <span>Upload Supporting Document</span>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xlsx"
                        onChange={(e) => handleFileUpload(e, "recurring")}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Supported: PDF, JPG, PNG, DOCX, XLSX (Direct in-browser storage)
                    </span>
                  </div>

                  {recAttachments.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                      {recAttachments.map((file) => (
                        <div
                          key={file.id}
                          className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs group hover:border-emerald-300 transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="size-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                              <FileText className="size-3.5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate max-w-[150px]">{file.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{file.size}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(file.id, "recurring")}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remove attachment"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 9. ⚡ Live Financial Simulator Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-4 text-emerald-400" />
                      <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                        Live Financial Commitment Simulator
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        recSettlementType === "1-Year Full Advance"
                          ? "bg-amber-400 text-slate-950 font-black"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {recSettlementType === "1-Year Full Advance"
                        ? "1-Year Advance Lump Sum"
                        : `Periodic ${recCadence}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center sm:text-left">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Monthly Commitment</p>
                      <p className="text-base font-black font-mono text-emerald-400">
                        ৳ {(parseFloat(recMonthlyAmount) || 0).toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Duration</p>
                      <p className="text-base font-black font-mono text-white">
                        {recTotalMonths === "0" ? "Indefinite" : `${recTotalMonths} Months`}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        {recSettlementType === "1-Year Full Advance" ? "Upfront Advance Total" : "Annual Commitment"}
                      </p>
                      <p className="text-lg font-black font-mono text-amber-400">
                        ৳ {((parseFloat(recMonthlyAmount) || 0) * (parseInt(recTotalMonths) || 12)).toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Pool After Settlement</p>
                      <p
                        className={`text-sm font-black font-mono ${
                          stats.remainingBudget -
                            ((parseFloat(recMonthlyAmount) || 0) * (parseInt(recTotalMonths) || 12)) <
                          0
                            ? "text-rose-400"
                            : "text-emerald-300"
                        }`}
                      >
                        ৳ {Math.max(
                          0,
                          stats.remainingBudget -
                            (recSettlementType === "1-Year Full Advance"
                              ? (parseFloat(recMonthlyAmount) || 0) * (parseInt(recTotalMonths) || 12)
                              : 0)
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between px-6 md:px-8 py-4.5 border-t border-slate-200 bg-slate-50 rounded-b-[24px]">
                <div className="text-xs font-bold text-emerald-800">
                  {recSettlementType === "1-Year Full Advance" ? "1-Year Advance Payout:" : "Annual Commitment:"}{" "}
                  <span className="font-mono font-black text-sm ml-1 text-emerald-950">
                    ৳ {((parseFloat(recMonthlyAmount) || 0) * (parseInt(recTotalMonths) || 12)).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRecurringModalOpen(false)}
                    className="h-10 px-5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`h-10 px-7 rounded-xl text-xs font-black text-white shadow-sm transition-all cursor-pointer flex items-center gap-2 ${
                      recSettlementType === "1-Year Full Advance"
                        ? "bg-emerald-700 hover:bg-emerald-800"
                        : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                  >
                    {recSettlementType === "1-Year Full Advance" ? (
                      <span>Disburse 1-Year Advance Now</span>
                    ) : (
                      <>
                        <Check className="size-4" />
                        <span>Save & Activate Schedule</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: SUBMIT HANDOVER PROOF                            */}
      {/* ========================================================= */}
      {isProofModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-[24px] shadow-2xl border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white rounded-t-[24px]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">Submit Handover Proof & Verification</h3>
              </div>
              <button
                onClick={() => setIsProofModalOpen(false)}
                className="p-1 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitProof} className="p-6 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-1">
                  Receipt / Voucher Reference ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={proofReceiptRef}
                  onChange={(e) => setProofReceiptRef(e.target.value)}
                  placeholder="e.g. REC-55234-ZK"
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-mono font-bold outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-1">
                    Witness Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={proofWitnessName}
                    onChange={(e) => setProofWitnessName(e.target.value)}
                    placeholder="e.g. Maulana Ibrahim"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-1">
                    Witness Contact Phone
                  </label>
                  <input
                    type="text"
                    value={proofWitnessPhone}
                    onChange={(e) => setProofWitnessPhone(e.target.value)}
                    placeholder="01700-000000"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-1">
                  Handover Remarks / Evidence Notes
                </label>
                <textarea
                  value={proofNotes}
                  onChange={(e) => setProofNotes(e.target.value)}
                  placeholder="Provide context regarding the handover meeting..."
                  rows={3}
                  className="w-full p-3 rounded-lg border border-slate-200 text-xs font-medium outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProofModalOpen(false)}
                  className="h-9 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Proof & Mark Distributed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: INSTANT 1-YEAR ADVANCE SETTLEMENT DIALOG           */}
      {/* ========================================================= */}
      {advanceSettleSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[24px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200 bg-gradient-to-r from-emerald-900 to-teal-900 text-white">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-xs">
                  <Zap className="size-5 fill-slate-950" />
                </div>
                <div>
                  <h3 className="text-base font-black">Disburse 1-Year Advance Settlement</h3>
                  <p className="text-xs text-emerald-200 font-medium">
                    Pay remaining stipend months upfront in a single advance lump sum
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAdvanceSettleSchedule(null)}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteAdvanceSettlement} className="p-6 space-y-4 text-slate-800">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-bold uppercase">Mandate Schedule:</span>
                  <span className="font-bold text-slate-900">{advanceSettleSchedule.title}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-bold uppercase">Beneficiary:</span>
                  <span className="font-bold text-emerald-800">
                    {advanceSettleSchedule.institutionName || advanceSettleSchedule.beneficiaryName}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-bold uppercase">Monthly Rate:</span>
                  <span className="font-mono font-bold text-slate-900">
                    ৳ {advanceSettleSchedule.monthlyAmount.toLocaleString()} / mo
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-bold uppercase">Installments Completed:</span>
                  <span className="font-bold text-slate-700">
                    {advanceSettleSchedule.installmentsGenerated} of {advanceSettleSchedule.totalPlannedMonths || 12} Months
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-1">
                  Number of Months to Settle Upfront <span className="text-red-500">*</span>
                </label>
                <select
                  value={advanceSettleMonths}
                  onChange={(e) => setAdvanceSettleMonths(parseInt(e.target.value) || 12)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-800 outline-none focus:border-emerald-600 shadow-xs"
                >
                  <option value="12">Full 12 Months (1 Full Year Advance - 1 Bochorer Ta Ekbare)</option>
                  <option value="6">6 Months (Half-Year Advance)</option>
                  <option
                    value={Math.max(
                      1,
                      (advanceSettleSchedule.totalPlannedMonths || 12) - advanceSettleSchedule.installmentsGenerated
                    )}
                  >
                    Remaining{" "}
                    {Math.max(
                      1,
                      (advanceSettleSchedule.totalPlannedMonths || 12) - advanceSettleSchedule.installmentsGenerated
                    )}{" "}
                    Months to Close Mandate
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-1">
                    Payment Method
                  </label>
                  <select
                    value={advanceSettleMethod}
                    onChange={(e) => setAdvanceSettleMethod(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-800 outline-none focus:border-emerald-600 shadow-xs"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Mobile Financial Service">Mobile Financial Service</option>
                    <option value="Cash Handover">Cash Handover</option>
                    <option value="In-Kind Delivery">In-Kind Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-1">
                    Account / Mobile / Cheque No
                  </label>
                  <input
                    type="text"
                    value={advanceSettleAccount}
                    onChange={(e) => setAdvanceSettleAccount(e.target.value)}
                    placeholder="e.g. IBBL A/C or bKash"
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-semibold outline-none focus:border-emerald-600 shadow-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-1">
                  Advance Settlement Remarks
                </label>
                <input
                  type="text"
                  value={advanceSettleNotes}
                  onChange={(e) => setAdvanceSettleNotes(e.target.value)}
                  placeholder="e.g. Paid in advance per executive approval for medical surgery / admission"
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-semibold outline-none focus:border-emerald-600 shadow-xs text-slate-800"
                />
              </div>

              {/* Live Calculation Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase text-emerald-800">Total Upfront Advance Amount:</p>
                  <p className="text-xl font-black font-mono text-emerald-950">
                    ৳ {(advanceSettleSchedule.monthlyAmount * (advanceSettleMonths || 12)).toLocaleString()}
                  </p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-600 text-white shadow-2xs">
                  Instant Ledger Post
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAdvanceSettleSchedule(null)}
                  className="h-10 px-5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-6 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Confirm & Disburse Advance Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: ITEMIZED DRILL-DOWN REPORT MODAL (CLICKABLE)     */}
      {/* ========================================================= */}
      {drillDownState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 md:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-6xl xl:max-w-7xl rounded-xl shadow-2xl border border-slate-200 flex flex-col my-4 max-h-[92vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 border-b border-slate-200 bg-white gap-3 shrink-0">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {drillDownState.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">
                    FY {selectedBudgetYear}
                  </span>
                  {drillDownState.purpose && drillDownState.purpose !== "ALL" && (
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-800">
                      {drillDownState.purpose}
                    </span>
                  )}
                  {drillDownModeFilter !== "ALL" && (
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-800">
                      {drillDownModeFilter}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {drillDownState.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleExportDrillDownCSV}
                  className="h-8 px-3 rounded border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
                >
                  Export CSV
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="h-8 px-3 rounded border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
                >
                  Print Report
                </button>
                <button
                  type="button"
                  onClick={() => setDrillDownState((prev) => ({ ...prev, isOpen: false }))}
                  className="h-8 px-3 rounded border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
              {/* Executive Metrics Ribbon */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-lg bg-white border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                    Total In Scope
                  </span>
                  <div className="text-lg font-bold text-slate-900 font-mono mt-1">
                    ৳ {drillDownStats.totalAmount.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Aggregated allocation
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-white border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                    Cash Grants
                  </span>
                  <div className="text-lg font-bold text-slate-900 font-mono mt-1">
                    ৳ {drillDownStats.cashAmount.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Direct cash assistance
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-white border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                    In-Kind Assets Purchased
                  </span>
                  <div className="text-lg font-bold text-slate-900 font-mono mt-1">
                    ৳ {drillDownStats.assetAmount.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Physical stores, vans, goods
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-white border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                    Total Cases
                  </span>
                  <div className="text-lg font-bold text-slate-900 font-mono mt-1">
                    {drillDownStats.totalCount} Beneficiaries
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Matching active filters
                  </div>
                </div>
              </div>

              {/* Filter Toolbar */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5 flex-1">
                  {/* Search */}
                  <div className="relative min-w-[240px] flex-1">
                    <input
                      type="text"
                      value={drillDownSearch}
                      onChange={(e) => setDrillDownSearch(e.target.value)}
                      placeholder="Search beneficiary, location, asset, invoice..."
                      className="w-full h-8 px-3 rounded bg-white border border-slate-300 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-slate-500"
                    />
                    {drillDownSearch && (
                      <button
                        onClick={() => setDrillDownSearch("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Mode Filter Pills */}
                  <div className="flex items-center rounded border border-slate-200 bg-slate-50 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setDrillDownModeFilter("ALL")}
                      className={`h-7 px-3 rounded transition-colors cursor-pointer ${
                        drillDownModeFilter === "ALL"
                          ? "bg-white text-slate-900 font-semibold shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      All Modes
                    </button>
                    <button
                      type="button"
                      onClick={() => setDrillDownModeFilter("Cash Grant")}
                      className={`h-7 px-3 rounded transition-colors cursor-pointer ${
                        drillDownModeFilter === "Cash Grant"
                          ? "bg-white text-slate-900 font-semibold shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Cash Grants
                    </button>
                    <button
                      type="button"
                      onClick={() => setDrillDownModeFilter("Asset Purchased")}
                      className={`h-7 px-3 rounded transition-colors cursor-pointer ${
                        drillDownModeFilter === "Asset Purchased"
                          ? "bg-white text-slate-900 font-semibold shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Assets Purchased
                    </button>
                  </div>

                  {/* Channel Dropdown */}
                  <select
                    value={drillDownChannelFilter}
                    onChange={(e) => setDrillDownChannelFilter(e.target.value as any)}
                    className="h-8 px-2.5 rounded bg-white border border-slate-300 text-xs text-slate-700 outline-none"
                  >
                    <option value="ALL">All Beneficiary Channels</option>
                    <option value="Direct Employee">Direct Employee (Company Staff)</option>
                    <option value="Via Employee Agent">Via Staff Agent (Village Handover)</option>
                    <option value="Direct External">Direct External (Outside Person / Org)</option>
                  </select>

                  {/* Purpose Dropdown */}
                  <select
                    value={drillDownState.purpose || "ALL"}
                    onChange={(e) => {
                      const newPurpose = e.target.value as ZakatPurposeCategory | "ALL";
                      setDrillDownState((prev) => ({
                        ...prev,
                        purpose: newPurpose,
                        title:
                          newPurpose === "ALL"
                            ? "All Purpose Categories — Complete Portfolio Breakdown"
                            : `${newPurpose} — Itemized Distribution Details`,
                        subtitle:
                          newPurpose === "ALL"
                            ? `Audited breakdown of all cases across all purposes (${selectedBudgetYear})`
                            : `Complete audit trail of all allocations and cases for ${newPurpose} (${selectedBudgetYear})`,
                      }));
                    }}
                    className="h-8 px-2.5 rounded bg-white border border-slate-300 text-xs text-slate-700 outline-none"
                  >
                    <option value="ALL">All Purposes</option>
                    <option value="Mosque/Madrasa">Mosque / Madrasa</option>
                    <option value="Medical Treatment">Medical Treatment</option>
                    <option value="Vehicle">Vehicle / Transport</option>
                    <option value="Farm Animal">Farm Animal</option>
                    <option value="Business Setup">Business Setup</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              {/* Itemized Table - Regular, Simple, Professional */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                        <th className="px-4 py-3">Case ID & Date</th>
                        <th className="px-4 py-3">Beneficiary & Location</th>
                        <th className="px-4 py-3">Channel / Handover</th>
                        <th className="px-4 py-3">Aid Mode & Specifics</th>
                        <th className="px-4 py-3 text-center">Asnaf / Status</th>
                        <th className="px-4 py-3 text-right">Disbursed (৳)</th>
                        <th className="px-4 py-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {matchingDrillDownRecords.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                            <div className="font-semibold text-slate-700 text-sm">
                              No matching disbursement records found
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              Try clearing your search query or switching the Aid Mode / Channel filter.
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setDrillDownSearch("");
                                setDrillDownModeFilter("ALL");
                                setDrillDownChannelFilter("ALL");
                              }}
                              className="mt-2.5 text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                            >
                              Reset filters
                            </button>
                          </td>
                        </tr>
                      ) : (
                        matchingDrillDownRecords.map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50/75 transition-colors">
                            {/* Case ID & Date */}
                            <td className="px-4 py-3 align-top whitespace-nowrap">
                              <div className="font-mono font-bold text-slate-900">{row.id}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5">{row.assignedDate}</div>
                              <div className="text-[11px] text-slate-700 font-medium mt-1">{row.purposeCategory}</div>
                              {row.isRecurring && (
                                <div className="text-[10px] text-blue-700 font-medium mt-0.5">
                                  Recurring #{row.installmentNumber || 1}
                                </div>
                              )}
                            </td>

                            {/* Beneficiary & Location */}
                            <td className="px-4 py-3 align-top min-w-[200px]">
                              <div className="font-semibold text-slate-900">{row.institutionName || row.beneficiaryName}</div>
                              {row.beneficiaryPhone && (
                                <div className="text-[11px] text-slate-500 font-mono mt-0.5">{row.beneficiaryPhone}</div>
                              )}
                              <div className="text-xs text-slate-600 mt-1">
                                {row.beneficiaryAddress || "Local Residence"}
                              </div>
                            </td>

                            {/* Channel / Handover */}
                            <td className="px-4 py-3 align-top min-w-[180px]">
                              {row.disbursementChannel === "Direct Employee" && (
                                <div>
                                  <div className="font-semibold text-slate-900">Direct Staff</div>
                                  <div className="text-[11px] text-slate-600 mt-0.5">{row.employeeName || row.beneficiaryName}</div>
                                  {row.employeeId && <div className="text-[10px] text-slate-400">ID: {row.employeeId}</div>}
                                </div>
                              )}
                              {row.disbursementChannel === "Via Employee Agent" && (
                                <div>
                                  <div className="font-semibold text-slate-900">Via Staff Agent</div>
                                  <div className="text-[11px] text-slate-600 mt-0.5">Agent: {row.employeeName}</div>
                                  {row.employeeId && <div className="text-[10px] text-slate-400">ID: {row.employeeId}</div>}
                                </div>
                              )}
                              {row.disbursementChannel === "Direct External" && (
                                <div>
                                  <div className="font-semibold text-slate-900">Direct External</div>
                                  <div className="text-[11px] text-slate-600 mt-0.5">{row.institutionName || row.beneficiaryName}</div>
                                  {row.institutionRepresentative && (
                                    <div className="text-[10px] text-slate-400">Rep: {row.institutionRepresentative}</div>
                                  )}
                                </div>
                              )}
                            </td>

                            {/* Aid Mode & Specifics */}
                            <td className="px-4 py-3 align-top min-w-[240px]">
                              <div className="font-semibold text-slate-900">
                                {row.disbursementMode === "Asset Purchased" ? "Asset Purchased" : "Cash Grant"}
                              </div>
                              {row.disbursementMode === "Asset Purchased" ? (
                                <div className="text-xs text-slate-600 mt-1 space-y-0.5">
                                  <div>
                                    <span className="text-slate-500">Item:</span>{" "}
                                    <strong className="text-slate-800">{row.assetDetails?.assetName || "Physical Asset"}</strong>{" "}
                                    ({row.assetDetails?.assetQuantity || "1 Unit"})
                                  </div>
                                  {row.assetDetails?.vendorOrMarket && (
                                    <div className="text-[11px] text-slate-500">
                                      Vendor: {row.assetDetails.vendorOrMarket}
                                    </div>
                                  )}
                                  {row.assetDetails?.invoiceRef && (
                                    <div className="text-[11px] font-mono text-slate-500">
                                      Invoice: {row.assetDetails.invoiceRef}
                                    </div>
                                  )}
                                  {row.assetDetails?.remarks && (
                                    <div className="text-[11px] text-slate-600">
                                      Note: {row.assetDetails.remarks}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                                  {row.purposeSpecificDescription || row.justificationDetails || "Direct cash assistance disbursed."}
                                </div>
                              )}
                              {row.attachments && row.attachments.length > 0 && (
                                <div className="text-[10px] text-blue-600 font-medium mt-1">
                                  {row.attachments.length} attachment{row.attachments.length > 1 ? "s" : ""}
                                </div>
                              )}
                            </td>

                            {/* Asnaf / Status */}
                            <td className="px-4 py-3 align-top text-center whitespace-nowrap">
                              <div className="text-xs font-medium text-slate-700">{row.asnafCategory}</div>
                              <div className="mt-1">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${
                                    row.agencyStatus === "Verified"
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : row.agencyStatus === "Assigned"
                                      ? "bg-blue-50 text-blue-700 border-blue-200"
                                      : "bg-slate-100 text-slate-700 border-slate-200"
                                  }`}
                                >
                                  {row.agencyStatus}
                                </span>
                              </div>
                              {row.proofDetails?.receiptRef && (
                                <div className="text-[10px] font-mono text-slate-400 mt-1">
                                  Ref: {row.proofDetails.receiptRef}
                                </div>
                              )}
                            </td>

                            {/* Disbursed Amount */}
                            <td className="px-4 py-3 align-top text-right font-mono font-bold text-slate-900 text-xs whitespace-nowrap">
                              ৳ {row.amount.toLocaleString()}
                            </td>

                            {/* Action */}
                            <td className="px-4 py-3 align-top text-center whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => setSelectedRecordId(row.id)}
                                className="px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                              >
                                Inspect
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2">
                  <div>
                    Showing <strong className="text-slate-900">{matchingDrillDownRecords.length}</strong> of{" "}
                    <strong className="text-slate-900">{records.length}</strong> total corporate cases
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-600">In-Scope Total:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      ৳ {drillDownStats.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 bg-white">
              <div className="text-xs text-slate-500">
                Click <strong className="text-slate-800">Inspect</strong> on any row to view full details and receipts.
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setDrillDownState((prev) => ({ ...prev, isOpen: false }))}
                  className="h-8 px-4 rounded border border-slate-300 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: OFFICIAL ZAKAT MONEY RECEIPT & DISBURSEMENT VOUCHER */}
      {/* ========================================================= */}
      {activeRecord && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 md:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-slate-300 flex flex-col my-auto max-h-[94vh] overflow-hidden">
            {/* Modal Top Header (print:hidden) */}
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-white print:hidden shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">
                  Zakat Money Receipt & Disbursement Voucher
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-100 text-slate-800">
                  VR-{activeRecord.id}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="h-8 px-3 rounded border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
                >
                  Print Receipt
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRecordId(null)}
                  className="h-8 px-3 rounded border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Modal Body / Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-100/60">
              {/* PRINTABLE RECEIPT CARD CANVAS */}
              <div id="zakat-official-receipt" className="bg-white p-6 md:p-8 rounded-lg border border-slate-300 shadow-xs space-y-6 text-slate-800">
                {/* 1. Header with Company Name & Voucher Details */}
                <div className="flex flex-col md:flex-row md:items-start justify-between pb-5 border-b border-slate-300 gap-4">
                  <div>
                    <div className="text-xl font-bold tracking-tight text-slate-900">
                      PAKIZA KNIT COMPOSITE LTD.
                    </div>
                    <div className="text-xs font-semibold text-slate-600 mt-0.5">
                      Corporate Welfare, CSR & Shariah Zakat Fund
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Factory: Mawna, Sreepur, Gazipur &middot; Corporate Head Office: Dhaka, Bangladesh
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                      Audit Desk: audit@pakizaknit.com &middot; Central Zakat Register
                    </div>
                  </div>

                  <div className="text-left md:text-right shrink-0">
                    <div className="inline-block border border-slate-300 bg-slate-50 p-2.5 rounded text-xs text-left">
                      <div className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-center border-b border-slate-200 pb-1 mb-1.5">
                        ZAKAT MONEY RECEIPT
                      </div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px]">
                        <span className="text-slate-500">Voucher No:</span>
                        <span className="font-mono font-bold text-slate-900 text-right">VR-{activeRecord.id}</span>
                        <span className="text-slate-500">Case ID:</span>
                        <span className="font-mono text-slate-700 text-right">{activeRecord.id}</span>
                        <span className="text-slate-500">Date:</span>
                        <span className="font-mono text-slate-900 text-right">{activeRecord.assignedDate}</span>
                        <span className="text-slate-500">Fiscal Year:</span>
                        <span className="text-slate-900 text-right font-medium">FY {activeRecord.budgetYear}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Stamp Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 py-1">
                  <div className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Shariah Asnaf Category:</span>{" "}
                    <span className="font-bold text-slate-900">{activeRecord.asnafCategory}</span>{" "}
                    <span className="text-slate-400">
                      ({activeRecord.asnafCategory === "Al-Gharimin" ? "Debt-burdened welfare recipient" :
                        activeRecord.asnafCategory === "Al-Masakin" ? "Destitute with insufficient livelihood" :
                        activeRecord.asnafCategory === "Al-Fuqara" ? "Extreme needy impoverished" :
                        activeRecord.asnafCategory === "Fi Sabilillah" ? "Religious & educational sponsorship" :
                        "Emergency welfare support"})
                    </span>
                  </div>

                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border ${
                        activeRecord.agencyStatus === "Verified"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : activeRecord.agencyStatus === "Distributed"
                          ? "bg-amber-50 text-amber-800 border-amber-300"
                          : activeRecord.agencyStatus === "Acknowledged"
                          ? "bg-blue-50 text-blue-800 border-blue-300"
                          : "bg-slate-100 text-slate-700 border-slate-300"
                      }`}
                    >
                      {activeRecord.agencyStatus === "Verified" && "VERIFIED & AUDITED COMPLIANT"}
                      {activeRecord.agencyStatus === "Distributed" && "DISTRIBUTED — PENDING FINAL AUDIT"}
                      {activeRecord.agencyStatus === "Acknowledged" && "DISPATCHED & ACKNOWLEDGED BY TRUSTEE"}
                      {activeRecord.agencyStatus === "Assigned" && "ALLOCATED IN DISPATCH PIPELINE"}
                    </span>
                  </div>
                </div>

                {/* 2. Beneficiary & Handover Parties Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Beneficiary Details Box */}
                  <div className="border border-slate-300 rounded p-3.5 bg-slate-50/50 space-y-2">
                    <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wider border-b border-slate-200 pb-1">
                      1. Beneficiary Information (গ্রহীতার বিবরণ)
                    </div>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Name / Institution:</span>
                        <strong className="text-slate-900">{activeRecord.institutionName || activeRecord.beneficiaryName}</strong>
                      </div>
                      {activeRecord.institutionRepresentative && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Representative:</span>
                          <span className="text-slate-800">{activeRecord.institutionRepresentative}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-500">Contact Number:</span>
                        <span className="font-mono text-slate-800">{activeRecord.beneficiaryPhone || activeRecord.institutionContactPhone || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">National ID / Proof:</span>
                        <span className="font-mono text-slate-800">{activeRecord.beneficiaryNid || "Verified by Welfare Assessment"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Present Address:</span>
                        <span className="text-slate-800 text-right max-w-[220px]">{activeRecord.beneficiaryAddress || "Local Residence, Gazipur"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Recipient Type:</span>
                        <span className="text-slate-800">
                          {activeRecord.institutionType ? `${activeRecord.institutionType} Institution` : "Individual Poor / Needy"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Channel & Trustee Box */}
                  <div className="border border-slate-300 rounded p-3.5 bg-slate-50/50 space-y-2">
                    <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wider border-b border-slate-200 pb-1">
                      2. Delivery Channel & Trustee (বিতরণ মাধ্যম ও প্রতিনিধি)
                    </div>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Disbursement Channel:</span>
                        <strong className="text-slate-900">{activeRecord.disbursementChannel}</strong>
                      </div>
                      {activeRecord.employeeName ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Trustee / Staff Proxy:</span>
                            <span className="text-slate-900 font-semibold">{activeRecord.employeeName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Employee ID:</span>
                            <span className="font-mono text-slate-800">EMP-{activeRecord.employeeId?.slice(-4)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Department / Role:</span>
                            <span className="text-slate-800">{activeRecord.employeeDept || "Staff Trustee"}</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Handover Mode:</span>
                          <span className="text-slate-800">Directly Dispatched to Recipient</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-500">Target Deadline:</span>
                        <span className="font-mono text-slate-800">{activeRecord.distributionDeadline}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Disbursement Method:</span>
                        <span className="text-slate-800 font-medium">
                          {activeRecord.disbursementMode === "Asset Purchased" ? "Direct Physical Asset Handover" : "Cash / Bank Grant Handover"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Itemized Aid Particulars (The Core Receipt Table) */}
                <div className="space-y-2">
                  <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                    3. Itemized Particulars of Aid Granted (প্রদত্ত সহায়তার বিস্তারিত বিবরণ)
                  </div>
                  <table className="w-full text-left border-collapse border border-slate-300 text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300 text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                        <th className="px-3 py-2.5 text-center border-r border-slate-300 w-10">SL</th>
                        <th className="px-3 py-2.5 border-r border-slate-300">Description / Particulars</th>
                        <th className="px-3 py-2.5 border-r border-slate-300 w-36">Aid Form</th>
                        <th className="px-3 py-2.5 border-r border-slate-300 w-32">Asnaf Category</th>
                        <th className="px-3 py-2.5 text-right w-36">Amount (BDT)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300 bg-white">
                      <tr>
                        <td className="px-3 py-3 text-center align-top font-medium text-slate-500 border-r border-slate-300">
                          01
                        </td>
                        <td className="px-3 py-3 align-top border-r border-slate-300 space-y-1.5">
                          <div>
                            <strong className="text-slate-900 text-xs block">{activeRecord.purposeCategory}</strong>
                            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                              {activeRecord.purposeSpecificDescription || activeRecord.justificationDetails}
                            </p>
                          </div>

                          {/* In-Kind Asset Specifications */}
                          {activeRecord.disbursementMode === "Asset Purchased" && activeRecord.assetDetails && (
                            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px] space-y-0.5 mt-1.5">
                              <div className="font-semibold text-slate-900">
                                Physical Asset: {activeRecord.assetDetails.assetName} ({activeRecord.assetDetails.assetQuantity || "1 Unit"})
                              </div>
                              {activeRecord.assetDetails.assetType && (
                                <div className="text-slate-600">Type / Classification: {activeRecord.assetDetails.assetType}</div>
                              )}
                              {activeRecord.assetDetails.vendorOrMarket && (
                                <div className="text-slate-600">Purchased From: {activeRecord.assetDetails.vendorOrMarket}</div>
                              )}
                              {activeRecord.assetDetails.invoiceRef && (
                                <div className="text-slate-600 font-mono">Invoice / Cash Memo No: {activeRecord.assetDetails.invoiceRef}</div>
                              )}
                              {activeRecord.assetDetails.remarks && (
                                <div className="text-slate-600 italic">Officer Notes: {activeRecord.assetDetails.remarks}</div>
                              )}
                            </div>
                          )}

                          {/* Recurring Details */}
                          {activeRecord.isRecurring && (
                            <div className="p-2 bg-blue-50/60 rounded border border-blue-200 text-[11px] text-blue-900 mt-1">
                              <strong>Monthly Recurring Stipend:</strong> Installment #{activeRecord.installmentNumber || 1} of {activeRecord.installmentTotal || 12}
                              {activeRecord.recurringScheduleId && ` · Schedule ID: ${activeRecord.recurringScheduleId}`}
                              {activeRecord.advancePeriodCovered && ` · ${activeRecord.advancePeriodCovered}`}
                            </div>
                          )}
                        </td>

                        <td className="px-3 py-3 align-top border-r border-slate-300 font-medium text-slate-800 text-[11px]">
                          {activeRecord.disbursementMode === "Asset Purchased" ? "Physical Asset Purchased" : "Direct Cash Grant"}
                        </td>

                        <td className="px-3 py-3 align-top border-r border-slate-300 text-slate-700 text-[11px]">
                          {activeRecord.asnafCategory}
                        </td>

                        <td className="px-3 py-3 align-top text-right font-mono font-bold text-slate-900 text-xs whitespace-nowrap">
                          ৳ {activeRecord.amount.toLocaleString()}
                        </td>
                      </tr>

                      {/* Total Row */}
                      <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
                        <td colSpan={4} className="px-3 py-2.5 text-right uppercase text-slate-800 border-r border-slate-300">
                          Total Disbursed Sum (সর্বমোট বিতরণকৃত অর্থ):
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-slate-900 text-sm whitespace-nowrap">
                          ৳ {activeRecord.amount.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Amount in words banner */}
                  <div className="p-2.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-600 uppercase text-[10px] tracking-wide block">Amount in Words (কথায়):</span>
                      <span className="font-bold text-slate-900 text-[11px]">{numberToWordsBDT(activeRecord.amount)}</span>
                    </div>
                    <div className="text-right font-mono text-xs text-slate-600">
                      BDT {activeRecord.amount.toLocaleString()}/-
                    </div>
                  </div>
                </div>

                {/* 4. Verification Dossier, Handover Proof & Supporting Documents */}
                <div className="space-y-3">
                  <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                    4. Verification Dossier & Handover Proof (প্রমাণক ও সাক্ষী)
                  </div>

                  {activeRecord.proofDetails ? (
                    <div className="border border-slate-300 rounded p-3 bg-slate-50/50 space-y-1 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-1 mb-1">
                        <span className="font-bold text-emerald-800 text-[11px]">✓ Handover Proof Formally Verified & Registered</span>
                        <span className="text-[10px] text-slate-500 font-mono">Date: {activeRecord.proofDetails.submittedAt}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-500">Official Receipt Reference:</span>{" "}
                          <span className="font-mono font-bold text-slate-800">{activeRecord.proofDetails.receiptRef}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Witness Name & Contact:</span>{" "}
                          <span className="text-slate-800 font-medium">{activeRecord.proofDetails.witnessName} ({activeRecord.proofDetails.witnessPhone || "N/A"})</span>
                        </div>
                      </div>
                      {activeRecord.proofDetails.notes && (
                        <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                          <span className="text-slate-500 font-medium">Auditor Notes:</span> "{activeRecord.proofDetails.notes}"
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="border border-amber-300 bg-amber-50/60 rounded p-3 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <strong>Handover Proof Notice:</strong> Handover proof document has not been verified yet. Handover trustee must provide a signed money receipt or photographic evidence.
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsProofModalOpen(true)}
                        className="px-3 py-1 bg-amber-800 hover:bg-amber-900 text-white font-medium text-xs rounded transition-colors cursor-pointer shrink-0 print:hidden"
                      >
                        Submit Handover Proof
                      </button>
                    </div>
                  )}

                  {/* Supporting Documents List */}
                  {activeRecord.attachments && activeRecord.attachments.length > 0 && (
                    <div className="border border-slate-300 rounded p-3 bg-white space-y-2 text-xs">
                      <div className="font-semibold text-slate-800 text-[11px] border-b border-slate-200 pb-1">
                        Attached Supporting Documents ({activeRecord.attachments.length} Files):
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeRecord.attachments.map((att) => (
                          <div key={att.id} className="p-2 rounded border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                            <div className="min-w-0 pr-2">
                              <p className="font-medium text-slate-900 text-[11px] truncate">{att.name}</p>
                              <p className="text-[10px] text-slate-400">{att.size} &middot; {att.uploadedAt}</p>
                            </div>
                            {att.dataUrl ? (
                              <a
                                href={att.dataUrl}
                                download={att.name}
                                className="px-2 py-0.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-[10px] font-medium rounded shrink-0 cursor-pointer"
                              >
                                Download
                              </a>
                            ) : (
                              <span className="text-[10px] text-slate-400">Archived</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. Official Signature & Audit Endorsement Row (Four Columns) */}
                <div className="pt-8 pb-3 border-t border-slate-300">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="border-b border-slate-400 w-32 mx-auto mb-2"></div>
                      <div className="font-bold text-slate-900 text-xs">Received By</div>
                      <div className="text-[10px] text-slate-500">(Beneficiary Signature)</div>
                      <div className="text-[10px] font-medium text-slate-700">{activeRecord.beneficiaryName}</div>
                    </div>

                    <div className="space-y-1">
                      <div className="border-b border-slate-400 w-32 mx-auto mb-2"></div>
                      <div className="font-bold text-slate-900 text-xs">Handover Trustee</div>
                      <div className="text-[10px] text-slate-500">(Staff Agent / Proxy)</div>
                      <div className="text-[10px] font-medium text-slate-700">{activeRecord.employeeName || "Direct Welfare Officer"}</div>
                    </div>

                    <div className="space-y-1">
                      <div className="border-b border-slate-400 w-32 mx-auto mb-2"></div>
                      <div className="font-bold text-slate-900 text-xs">Verified By</div>
                      <div className="text-[10px] text-slate-500">(HR & Shariah Auditor)</div>
                      <div className="text-[10px] font-medium text-slate-700">Corporate Welfare Desk</div>
                    </div>

                    <div className="space-y-1">
                      <div className="border-b border-slate-400 w-32 mx-auto mb-2"></div>
                      <div className="font-bold text-slate-900 text-xs">Approved By</div>
                      <div className="text-[10px] text-slate-500">(Managing Director / Board)</div>
                      <div className="text-[10px] font-medium text-slate-700">Board of Trustees</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Legal Disclaimer */}
                <div className="pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400">
                  Official audited Zakat disbursement document generated by Pakiza Knit Composite Ltd. Corporate Welfare & Zakat Management System. Shariah compliance strictly observed under corporate welfare governance.
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions (print:hidden) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-t border-slate-200 bg-white gap-2 shrink-0 print:hidden">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleDeleteRecord(activeRecord.id, e)}
                  className="px-3 py-1.5 rounded border border-slate-200 bg-white hover:bg-red-50 text-red-600 font-medium text-xs cursor-pointer transition-colors"
                >
                  Delete Record
                </button>
              </div>

              <div className="flex items-center gap-2">
                {activeRecord.agencyStatus !== "Verified" ? (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(activeRecord.id, "Verified")}
                    className="h-8 px-3.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs cursor-pointer transition-colors shadow-xs"
                  >
                    Verify & Complete
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                    Fully Verified
                  </span>
                )}

                <button
                  type="button"
                  onClick={handlePrint}
                  className="h-8 px-3.5 rounded border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
                >
                  Print Voucher
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRecordId(null)}
                  className="h-8 px-3.5 rounded border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
