import { useState, useMemo, useEffect, useRef } from "react";
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
  ChevronDown,
  Gift,
  HelpCircle,
  Shield,
} from "lucide-react";
import { CADENCE_CONFIG, calculateInstallmentCount } from "./zakat-list";

export const Route = createFileRoute("/zakat-and-financial-aid")({
  head: () => ({
    meta: [
      { title: "Zakat and Financial Aid — CRIPTON" },
      {
        name: "description",
        content:
          "Unified Corporate Welfare and Support dashboard for Zakat allocations and Financial Aid disbursements, multi-channel grants, and automated recurring assistance.",
      },
    ],
  }),
  component: ZakatAndFinancialAidPage,
});

// ==========================================
// 1. TYPES & DATA ARCHITECTURE
// ==========================================

export type FundType = "Zakat" | "Financial Aid";

export type ZakatPurposeCategory =
  | "Mosque/Madrasa"
  | "Medical Treatment"
  | "Vehicle"
  | "Farm Animal"
  | "Business Setup"
  | "Others";

export type ZakatDisbursementChannel =
  | "Direct Employee"
  | "Via Employee Agent";

export type ZakatDisbursementMode =
  | "Cash Grant"
  | "Asset Purchased";

export type DisbursementSettlementType = "Periodic Installments" | "1-Year Full Advance";

export interface ZakatAssetItem {
  id: string;
  assetMasterId?: string;
  assetType?: string;
  assetName: string;
  quantity?: string;
  amount?: number;
}

export interface DirectAssetInputItem {
  id: string;
  assetMasterId: string;
  assetName: string;
  assetQty: string;
  amount: string;
}

export interface ZakatAssetDetails {
  assetType?: string;
  assetName: string;
  assetQuantity?: string;
  vendorOrMarket?: string;
  invoiceRef?: string;
  remarks?: string;
  items?: ZakatAssetItem[];
}

export interface ZakatAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
  dataUrl?: string;
  uploadedAt: string;
}

export interface ZakatAssetMasterItem {
  id: string;
  category: string;
  assetType: string;
  defaultQty: string;
  defaultVendorLocation?: string;
  suggestedPurpose: ZakatPurposeCategory;
}

export function getActiveAssetMasterList(): ZakatAssetMasterItem[] {
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
  return DEFAULT_ASSET_MASTER_DATA;
}

export const DEFAULT_ASSET_MASTER_DATA: ZakatAssetMasterItem[] = [
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
    id: "AST-BIZ-01",
    category: "Micro-Business Setup",
    assetType: "Street Tea Stall & Snack Kiosk Fabrication Setup",
    defaultQty: "1 Complete Kiosk Setup",
    defaultVendorLocation: "Sreepur Steel Workshop",
    suggestedPurpose: "Business Setup",
  },
  {
    id: "AST-BIZ-02",
    category: "Micro-Business Setup",
    assetType: "Industrial Heavy-Duty Sewing Machine with Electric Motor Table",
    defaultQty: "1 Machine Set",
    defaultVendorLocation: "Tongi Machinery Market",
    suggestedPurpose: "Business Setup",
  },
  {
    id: "AST-BIZ-03",
    category: "Micro-Business Setup",
    assetType: "Grocery Store Initial Inventory & Shelving Lot",
    defaultQty: "1 Complete Retail Lot",
    defaultVendorLocation: "Joydebpur Wholesalers",
    suggestedPurpose: "Business Setup",
  },
  {
    id: "AST-MED-01",
    category: "Medical & Mobility Assistive",
    assetType: "Ergonomic Folding Wheelchair & Orthopedic Cushion",
    defaultQty: "1 Wheelchair Set",
    defaultVendorLocation: "Dhaka Surgical Market",
    suggestedPurpose: "Medical Treatment",
  },
];

export type RecurringScheduleStatus = "Active" | "Paused" | "Completed" | "Cancelled";
export type DisbursementCadence = "Monthly" | "Quarterly" | "Bi-Annual" | "Annual Lump Sum";

export interface UnifiedRecurringSchedule {
  id: string;
  fundType: FundType;
  title: string;
  disbursementChannel: ZakatDisbursementChannel;
  disbursementMode: ZakatDisbursementMode;
  assetDetails?: ZakatAssetDetails;
  purposeCategory: ZakatPurposeCategory;
  otherPurposeDetails?: string;
  purposeDescription: string;
  cadence: DisbursementCadence;
  employeeId?: string;
  employeeName?: string;
  employeeDept?: string;
  employeeDesignation?: string;
  beneficiaryName: string;
  beneficiaryPhone?: string;
  beneficiaryAddress?: string;
  institutionName?: string;
  institutionRepresentative?: string;
  institutionContactPhone?: string;
  asnafCategory?: "Al-Fuqara" | "Al-Masakin" | "Al-Gharimin" | "Fi Sabilillah" | "Ibnus-Sabil";
  monthlyAmount: number;
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
  attachments?: ZakatAttachment[];
}

export interface UnifiedAidRecord {
  id: string;
  fundType: FundType; // Zakat vs Financial Aid
  budgetYear: number;
  assignedDate: string;
  distributionDeadline: string;
  amount: number;

  disbursementChannel: ZakatDisbursementChannel;
  disbursementMode: ZakatDisbursementMode;
  purposeCategory: ZakatPurposeCategory;

  assetDetails?: ZakatAssetDetails;
  otherPurposeDetails?: string;
  purposeSpecificDescription?: string;

  isRecurring?: boolean;
  recurringScheduleId?: string;
  cadence?: DisbursementCadence;
  installmentNumber?: number;
  installmentTotal?: number;

  employeeId?: string;
  employeeName?: string;
  employeeDept?: string;
  employeeDesignation?: string;
  beneficiaryName: string;
  beneficiaryPhone?: string;
  beneficiaryNid?: string;
  beneficiaryAddress?: string;
  institutionName?: string;
  institutionRepresentative?: string;
  institutionContactPhone?: string;

  // Asnaf is STRICTLY for Zakat (omitted / undefined for Financial Aid)
  asnafCategory?: "Al-Fuqara" | "Al-Masakin" | "Al-Gharimin" | "Fi Sabilillah" | "Ibnus-Sabil";
  justificationDetails: string;
  agencyStatus: "Assigned" | "Acknowledged" | "Distributed" | "Verified";

  batchRecipientInfo?: string; // e.g. "Recipient 1 of 4"
  batchDriveTitle?: string;     // e.g. "Trishal Livelihood Drive"

  proofDetails?: {
    receiptRef?: string;
    witnessName?: string;
    witnessPhone?: string;
    notes?: string;
    submittedAt?: string;
  };
  attachments?: ZakatAttachment[];
}

// Initial Demo Records
const INITIAL_UNIFIED_RECORDS: UnifiedAidRecord[] = [
  {
    id: "ZK-2026-01",
    fundType: "Zakat",
    budgetYear: 2026,
    assignedDate: "2026-06-15",
    distributionDeadline: "2026-07-15",
    amount: 15000,
    isRecurring: false,
    disbursementChannel: "Direct Employee",
    disbursementMode: "Cash Grant",
    purposeCategory: "Medical Treatment",
    purposeSpecificDescription: "Critical cardiac surgery co-pay assistance for technician's parent",
    employeeId: "2023043021",
    employeeName: "Shakil Ahmed",
    employeeDept: "Maintenance",
    employeeDesignation: "Sr. Electrician",
    beneficiaryName: "Shakil Ahmed (Staff Self)",
    beneficiaryPhone: "01711-223344",
    beneficiaryAddress: "Sreepur, Gazipur",
    asnafCategory: "Al-Masakin",
    justificationDetails: "Verified medical bills for urgent valve repair surgery at NICVD.",
    agencyStatus: "Verified",
    proofDetails: {
      receiptRef: "REC-NICVD-9921",
      witnessName: "Dr. A. Rahman",
      witnessPhone: "01711-009988",
      notes: "Hospital discharge voucher verified directly with admin desk.",
      submittedAt: "2026-06-25",
    },
    attachments: [
      {
        id: "att-1",
        name: "nicvd_discharge_clearance.pdf",
        size: "620 KB",
        type: "application/pdf",
        uploadedAt: "2026-06-15",
      },
    ],
  },
  {
    id: "FA-2026-01",
    fundType: "Financial Aid",
    budgetYear: 2026,
    assignedDate: "2026-06-18",
    distributionDeadline: "2026-07-18",
    amount: 25000,
    isRecurring: false,
    disbursementChannel: "Direct Employee",
    disbursementMode: "Cash Grant",
    purposeCategory: "Others",
    otherPurposeDetails: "Flash Flooding House Reconstruction",
    purposeSpecificDescription: "Urgent emergency home repair grant following roof collapse in monsoon flood",
    employeeId: "2023046001",
    employeeName: "Salma Khatun",
    employeeDept: "Sewing (Line-04)",
    employeeDesignation: "Sr. Sewing Operator",
    beneficiaryName: "Salma Khatun (Staff Self)",
    beneficiaryPhone: "01822-445566",
    beneficiaryAddress: "Sunamganj Sadar",
    // Notice: asnafCategory is omitted for Financial Aid!
    justificationDetails: "Employee village homestead was inundated by flash floods; roof and mud walls collapsed. General emergency hardship grant.",
    agencyStatus: "Verified",
    proofDetails: {
      receiptRef: "FA-VOUCH-01",
      witnessName: "Kabir Hossain (UP Member)",
      witnessPhone: "01822-998877",
      notes: "Union Parishad emergency flood damage certificate attached.",
      submittedAt: "2026-06-22",
    },
    attachments: [
      {
        id: "att-2",
        name: "union_parishad_flood_certificate.pdf",
        size: "410 KB",
        type: "application/pdf",
        uploadedAt: "2026-06-18",
      },
    ],
  },
  {
    id: "ZK-2026-02",
    fundType: "Zakat",
    budgetYear: 2026,
    assignedDate: "2026-06-20",
    distributionDeadline: "2026-07-20",
    amount: 60000,
    isRecurring: false,
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Asset Purchased",
    purposeCategory: "Vehicle",
    assetDetails: {
      assetType: "Battery Electric Auto-Van / Easy Bike",
      assetName: "Heavy Duty 48V Battery Cargo Auto-Van",
      assetQuantity: "1 Unit",
    },
    purposeSpecificDescription: "Asset: Heavy Duty 48V Battery Cargo Auto-Van (1 Unit)",
    employeeId: "2019003881",
    employeeName: "Mizanur Rahman",
    employeeDept: "Quality Assurance",
    employeeDesignation: "Sr. QA Inspector",
    beneficiaryName: "Mokbul Hossain",
    beneficiaryPhone: "01933-778899",
    beneficiaryAddress: "Bhaluka, Mymensingh",
    asnafCategory: "Al-Fuqara",
    justificationDetails: "Approved corporate Zakat asset grant via QA inspector Mizanur Rahman for disabled village farmer Mokbul Hossain.",
    agencyStatus: "Assigned",
    attachments: [
      {
        id: "att-3",
        name: "van_purchase_voucher_gazipur.pdf",
        size: "890 KB",
        type: "application/pdf",
        uploadedAt: "2026-06-20",
      },
    ],
  },
  {
    id: "FA-2026-02",
    fundType: "Financial Aid",
    budgetYear: 2026,
    assignedDate: "2026-07-01",
    distributionDeadline: "2026-07-25",
    amount: 35000,
    isRecurring: false,
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Cash Grant",
    purposeCategory: "Medical Treatment",
    purposeSpecificDescription: "Community pediatric treatment camp co-sponsorship grant",
    employeeId: "2018001090",
    employeeName: "Anisur Rahman",
    employeeDept: "Admin & Compliance",
    employeeDesignation: "Compliance Officer",
    beneficiaryName: "Al-Razi Child Care Trust",
    beneficiaryPhone: "01755-334455",
    beneficiaryAddress: "Kashimpur, Gazipur",
    // No Asnaf for Financial Aid
    justificationDetails: "Corporate social responsibility and company employee family medical subsidy for pediatric thalassemia patients.",
    agencyStatus: "Distributed",
  },
  {
    id: "ZK-2026-03",
    fundType: "Zakat",
    budgetYear: 2026,
    assignedDate: "2026-07-05",
    distributionDeadline: "2026-08-05",
    amount: 40000,
    isRecurring: false,
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Asset Purchased",
    purposeCategory: "Farm Animal",
    assetDetails: {
      assetType: "Breeding Goats / Sheep Pair",
      assetName: "2 Black Bengal Breeding Goats with Fodder Kit",
      assetQuantity: "2 Goats",
    },
    purposeSpecificDescription: "Asset: 2 Black Bengal Breeding Goats with Fodder Kit (2 Goats)",
    employeeId: "2021008812",
    employeeName: "Faridul Islam",
    employeeDept: "Finishing",
    employeeDesignation: "Assistant Supervisor",
    beneficiaryName: "Rokeya Begum",
    beneficiaryPhone: "01644-889900",
    beneficiaryAddress: "Gafargaon, Mymensingh",
    asnafCategory: "Al-Masakin",
    justificationDetails: "Sustainable livelihood gift of livestock for widow Rokeya Begum in agent's native village.",
    agencyStatus: "Distributed",
  },
  {
    id: "FA-2026-03",
    fundType: "Financial Aid",
    budgetYear: 2026,
    assignedDate: "2026-07-10",
    distributionDeadline: "2026-07-30",
    amount: 18000,
    isRecurring: false,
    disbursementChannel: "Direct Employee",
    disbursementMode: "Cash Grant",
    purposeCategory: "Others",
    otherPurposeDetails: "Children Education Assistance",
    purposeSpecificDescription: "Annual college admission fee support for female operator's daughter",
    employeeId: "2022001144",
    employeeName: "Nasima Akter",
    employeeDept: "Cutting",
    employeeDesignation: "Pattern Cutter",
    beneficiaryName: "Nasima Akter (Staff Self)",
    beneficiaryPhone: "01799-556677",
    beneficiaryAddress: "Gazipur",
    justificationDetails: "Staff daughter scored GPA-5 in SSC and qualified for Government Women's College; assistance provided for admission expenses.",
    agencyStatus: "Verified",
  },
  {
    id: "ZK-2026-04",
    fundType: "Zakat",
    budgetYear: 2026,
    assignedDate: "2026-07-15",
    distributionDeadline: "2026-08-15",
    amount: 32000,
    isRecurring: false,
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Asset Purchased",
    purposeCategory: "Business Setup",
    assetDetails: {
      assetType: "Street Tea Stall & Snack Kiosk Fabrication Setup",
      assetName: "Complete Street Tea Stall Counter with Gas Stove & Initial Retail Stock",
      assetQuantity: "1 Kiosk Set",
    },
    purposeSpecificDescription: "Complete street tea stall setup built and furnished for fire victim",
    employeeId: "2019001155",
    employeeName: "Md. Tariqul Islam",
    employeeDept: "Production",
    employeeDesignation: "Sr. Executive",
    beneficiaryName: "Jamil Mia",
    beneficiaryPhone: "01788-112233",
    beneficiaryAddress: "Sreepur, Gazipur",
    asnafCategory: "Al-Gharimin",
    justificationDetails: "Destitute shopkeeper who lost his livelihood in market fire; gifted physical business setup via staff agent instead of cash.",
    agencyStatus: "Acknowledged",
  },
  {
    id: "FA-2026-04",
    fundType: "Financial Aid",
    budgetYear: 2026,
    assignedDate: "2026-07-20",
    distributionDeadline: "2026-08-10",
    amount: 50000,
    isRecurring: false,
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Asset Purchased",
    purposeCategory: "Business Setup",
    assetDetails: {
      assetType: "Industrial Heavy-Duty Sewing Machine with Electric Motor Table",
      assetName: "2 Juki Industrial Sewing Machines & Motorized Work Tables",
      assetQuantity: "2 Sets",
    },
    purposeSpecificDescription: "Asset: 2 Juki Industrial Sewing Machines & Motorized Work Tables (2 Sets)",
    employeeId: "2018001090",
    employeeName: "Anisur Rahman",
    employeeDept: "Admin & Compliance",
    employeeDesignation: "Compliance Officer",
    beneficiaryName: "Fatema Khatun",
    beneficiaryPhone: "01855-667788",
    beneficiaryAddress: "Trishal, Mymensingh",
    justificationDetails: "Company welfare assistance providing self-reliance micro-tailoring equipment to destitute rural family.",
    agencyStatus: "Assigned",
  },

  // =========================================================================
  // MULTI-BENEFICIARY DEMO BATCH 1: ZAKAT VILLAGE SELF-RELIANCE LIVESTOCK DRIVE
  // Agent: Tahmid Afsar Shapno (4 Beneficiaries in Trishal, Mymensingh)
  // =========================================================================
  {
    id: "ZK-2026-05",
    fundType: "Zakat",
    budgetYear: 2026,
    assignedDate: "2026-08-12",
    distributionDeadline: "2026-09-10",
    amount: 35000,
    isRecurring: false,
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Asset Purchased",
    purposeCategory: "Farm Animal",
    assetDetails: {
      assetType: "High-Yield Milking Dairy Cow with Calf",
      assetName: "1 Milking Dairy Cow with Healthy Calf",
      assetQuantity: "1 Cow + 1 Calf",
    },
    purposeSpecificDescription: "Milking cow gifted to provide daily milk selling income for widower's family",
    employeeId: "2023043910",
    employeeName: "Tahmid Afsar Shapno",
    employeeDept: "Business Innovation",
    employeeDesignation: "Asst. Manager",
    beneficiaryName: "Mokhlesur Rahman",
    beneficiaryPhone: "01744-889901",
    beneficiaryAddress: "Trishal, Mymensingh",
    asnafCategory: "Al-Fuqara",
    justificationDetails: "Approved corporate Zakat asset grant via staff agent Tahmid Afsar Shapno for Mokhlesur Rahman (Recipient 1 of 4 in Trishal village dairy drive).",
    agencyStatus: "Verified",
    batchRecipientInfo: "Recipient 1 of 4",
    batchDriveTitle: "Trishal Livelihood Drive",
  },
  {
    id: "ZK-2026-06",
    fundType: "Zakat",
    budgetYear: 2026,
    assignedDate: "2026-08-12",
    distributionDeadline: "2026-09-10",
    amount: 25000,
    isRecurring: false,
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Asset Purchased",
    purposeCategory: "Farm Animal",
    assetDetails: {
      assetType: "Breeding Goats / Sheep Pair",
      assetName: "2 Black Bengal Breeding Goats with Fodder Supply Kit",
      assetQuantity: "2 Goats",
    },
    purposeSpecificDescription: "Breeding goat pair gifted to destitute widow for home-based sustainable livestock rearing",
    employeeId: "2023043910",
    employeeName: "Tahmid Afsar Shapno",
    employeeDept: "Business Innovation",
    employeeDesignation: "Asst. Manager",
    beneficiaryName: "Ayesha Siddiqua (Destitute Widow)",
    beneficiaryPhone: "01744-889902",
    beneficiaryAddress: "Trishal, Mymensingh",
    asnafCategory: "Al-Masakin",
    justificationDetails: "Approved corporate Zakat asset grant via staff agent Tahmid Afsar Shapno for Ayesha Siddiqua (Recipient 2 of 4 in Trishal village dairy drive).",
    agencyStatus: "Verified",
    batchRecipientInfo: "Recipient 2 of 4",
    batchDriveTitle: "Trishal Livelihood Drive",
  },
  {
    id: "ZK-2026-07",
    fundType: "Zakat",
    budgetYear: 2026,
    assignedDate: "2026-08-12",
    distributionDeadline: "2026-09-10",
    amount: 30000,
    isRecurring: false,
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Asset Purchased",
    purposeCategory: "Vehicle",
    assetDetails: {
      assetType: "Battery Electric Auto-Van / Easy Bike",
      assetName: "Battery Electric Cargo Auto-Van (Easy Van)",
      assetQuantity: "1 Unit",
    },
    purposeSpecificDescription: "Electric cargo transport van delivered to disabled rural farmer to earn daily transport livelihood",
    employeeId: "2023043910",
    employeeName: "Tahmid Afsar Shapno",
    employeeDept: "Business Innovation",
    employeeDesignation: "Asst. Manager",
    beneficiaryName: "Abdul Khaleque (Disabled Farmer)",
    beneficiaryPhone: "01744-889903",
    beneficiaryAddress: "Trishal, Mymensingh",
    asnafCategory: "Al-Fuqara",
    justificationDetails: "Approved corporate Zakat asset grant via staff agent Tahmid Afsar Shapno for Abdul Khaleque (Recipient 3 of 4 in Trishal village dairy drive).",
    agencyStatus: "Distributed",
    batchRecipientInfo: "Recipient 3 of 4",
    batchDriveTitle: "Trishal Livelihood Drive",
  },
  {
    id: "ZK-2026-08",
    fundType: "Zakat",
    budgetYear: 2026,
    assignedDate: "2026-08-12",
    distributionDeadline: "2026-09-10",
    amount: 20000,
    isRecurring: false,
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Cash Grant",
    purposeCategory: "Medical Treatment",
    purposeSpecificDescription: "Immediate cash grant for elderly orthopedic surgery and post-operative medications",
    employeeId: "2023043910",
    employeeName: "Tahmid Afsar Shapno",
    employeeDept: "Business Innovation",
    employeeDesignation: "Asst. Manager",
    beneficiaryName: "Nurjahan Begum (Elderly Care)",
    beneficiaryPhone: "01744-889904",
    beneficiaryAddress: "Trishal, Mymensingh",
    asnafCategory: "Al-Masakin",
    justificationDetails: "Approved corporate Zakat cash grant via staff agent Tahmid Afsar Shapno for Nurjahan Begum (Recipient 4 of 4 in Trishal village dairy drive).",
    agencyStatus: "Distributed",
    batchRecipientInfo: "Recipient 4 of 4",
    batchDriveTitle: "Trishal Livelihood Drive",
  },

  // =========================================================================
  // MULTI-BENEFICIARY DEMO BATCH 2: FINANCIAL AID MONSOON FLOOD RELIEF
  // Agent: Anisur Rahman (3 Beneficiaries in Sunamganj Sadar)
  // =========================================================================
  {
    id: "FA-2026-05",
    fundType: "Financial Aid",
    budgetYear: 2026,
    assignedDate: "2026-08-18",
    distributionDeadline: "2026-09-05",
    amount: 20000,
    isRecurring: false,
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Cash Grant",
    purposeCategory: "Others",
    otherPurposeDetails: "Flash Flood Homestead Reconstruction",
    purposeSpecificDescription: "Emergency cash grant for mud wall rebuilding and CI sheet roof installation after flash flood",
    employeeId: "2018001090",
    employeeName: "Anisur Rahman",
    employeeDept: "Admin & Compliance",
    employeeDesignation: "Compliance Officer",
    beneficiaryName: "Kabir Hossain & Family",
    beneficiaryPhone: "01822-771122",
    beneficiaryAddress: "Sunamganj Sadar",
    justificationDetails: "Approved corporate Financial Aid emergency grant via staff agent Anisur Rahman for Kabir Hossain (Recipient 1 of 3 in Sunamganj flood relief drive).",
    agencyStatus: "Verified",
    batchRecipientInfo: "Recipient 1 of 3",
    batchDriveTitle: "Sunamganj Flood Relief Drive",
  },
  {
    id: "FA-2026-06",
    fundType: "Financial Aid",
    budgetYear: 2026,
    assignedDate: "2026-08-18",
    distributionDeadline: "2026-09-05",
    amount: 25000,
    isRecurring: false,
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Cash Grant",
    purposeCategory: "Others",
    otherPurposeDetails: "Emergency Shelter Rebuilding",
    purposeSpecificDescription: "Urgent living and sanitation restoration support for flood-displaced single mother",
    employeeId: "2018001090",
    employeeName: "Anisur Rahman",
    employeeDept: "Admin & Compliance",
    employeeDesignation: "Compliance Officer",
    beneficiaryName: "Morium Begum (Single Mother)",
    beneficiaryPhone: "01822-771123",
    beneficiaryAddress: "Sunamganj Sadar",
    justificationDetails: "Approved corporate Financial Aid emergency grant via staff agent Anisur Rahman for Morium Begum (Recipient 2 of 3 in Sunamganj flood relief drive).",
    agencyStatus: "Verified",
    batchRecipientInfo: "Recipient 2 of 3",
    batchDriveTitle: "Sunamganj Flood Relief Drive",
  },
  {
    id: "FA-2026-07",
    fundType: "Financial Aid",
    budgetYear: 2026,
    assignedDate: "2026-08-18",
    distributionDeadline: "2026-09-05",
    amount: 20000,
    isRecurring: false,
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Asset Purchased",
    purposeCategory: "Business Setup",
    assetDetails: {
      assetType: "Country Boat & Fishing Gear Setup",
      assetName: "Commercial Fishing Net Roll & Country Wooden Boat Repair Kit",
      assetQuantity: "1 Complete Set",
    },
    purposeSpecificDescription: "Fishing gear and net replacement delivered to rural fisherman who lost boat in flood",
    employeeId: "2018001090",
    employeeName: "Anisur Rahman",
    employeeDept: "Admin & Compliance",
    employeeDesignation: "Compliance Officer",
    beneficiaryName: "Al-Amin Mia (Rural Fisherman)",
    beneficiaryPhone: "01822-771124",
    beneficiaryAddress: "Sunamganj Sadar",
    justificationDetails: "Approved corporate Financial Aid emergency grant via staff agent Anisur Rahman for Al-Amin Mia (Recipient 3 of 3 in Sunamganj flood relief drive).",
    agencyStatus: "Distributed",
    batchRecipientInfo: "Recipient 3 of 3",
    batchDriveTitle: "Sunamganj Flood Relief Drive",
  },

  // =========================================================================
  // MULTI-BENEFICIARY DEMO BATCH 3: ZAKAT WOMEN MICRO-TAILORING EMPOWERMENT
  // Agent: Farid Hossain (3 Beneficiaries in Bhaluka, Mymensingh)
  // =========================================================================
  {
    id: "ZK-2026-09",
    fundType: "Zakat",
    budgetYear: 2026,
    assignedDate: "2026-08-25",
    distributionDeadline: "2026-09-15",
    amount: 28000,
    isRecurring: false,
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Asset Purchased",
    purposeCategory: "Business Setup",
    assetDetails: {
      assetType: "Industrial Heavy-Duty Sewing Machine with Electric Motor Table",
      assetName: "1 Juki Industrial Direct-Drive Sewing Machine & Table Setup",
      assetQuantity: "1 Unit",
    },
    purposeSpecificDescription: "Industrial sewing machine provided to enable home boutique tailoring income",
    employeeId: "2020002130",
    employeeName: "Farid Hossain",
    employeeDept: "Medical & Welfare",
    employeeDesignation: "Welfare Officer",
    beneficiaryName: "Fatema Khatun (Widow)",
    beneficiaryPhone: "01633-112233",
    beneficiaryAddress: "Bhaluka, Mymensingh",
    asnafCategory: "Al-Masakin",
    justificationDetails: "Approved corporate Zakat asset grant via staff agent Farid Hossain for Fatema Khatun (Recipient 1 of 3 in Bhaluka micro-tailoring drive).",
    agencyStatus: "Verified",
    batchRecipientInfo: "Recipient 1 of 3",
    batchDriveTitle: "Women Tailoring Empowerment",
  },
  {
    id: "ZK-2026-10",
    fundType: "Zakat",
    budgetYear: 2026,
    assignedDate: "2026-08-25",
    distributionDeadline: "2026-09-15",
    amount: 28000,
    isRecurring: false,
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Asset Purchased",
    purposeCategory: "Business Setup",
    assetDetails: {
      assetType: "Industrial Heavy-Duty Sewing Machine with Electric Motor Table",
      assetName: "1 Juki Industrial Direct-Drive Sewing Machine & Table Setup",
      assetQuantity: "1 Unit",
    },
    purposeSpecificDescription: "Commercial sewing machine provided to support resident orphan children's mother",
    employeeId: "2020002130",
    employeeName: "Farid Hossain",
    employeeDept: "Medical & Welfare",
    employeeDesignation: "Welfare Officer",
    beneficiaryName: "Hasna Banu (Orphan Caregiver)",
    beneficiaryPhone: "01633-112234",
    beneficiaryAddress: "Bhaluka, Mymensingh",
    asnafCategory: "Al-Masakin",
    justificationDetails: "Approved corporate Zakat asset grant via staff agent Farid Hossain for Hasna Banu (Recipient 2 of 3 in Bhaluka micro-tailoring drive).",
    agencyStatus: "Verified",
    batchRecipientInfo: "Recipient 2 of 3",
    batchDriveTitle: "Women Tailoring Empowerment",
  },
  {
    id: "ZK-2026-11",
    fundType: "Zakat",
    budgetYear: 2026,
    assignedDate: "2026-08-25",
    distributionDeadline: "2026-09-15",
    amount: 28000,
    isRecurring: false,
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Asset Purchased",
    purposeCategory: "Business Setup",
    assetDetails: {
      assetType: "Industrial Heavy-Duty Sewing Machine with Electric Motor Table",
      assetName: "1 Juki Industrial Direct-Drive Sewing Machine & Table Setup",
      assetQuantity: "1 Unit",
    },
    purposeSpecificDescription: "Micro-tailoring equipment provided to deserted mother to achieve sustainable living",
    employeeId: "2020002130",
    employeeName: "Farid Hossain",
    employeeDept: "Medical & Welfare",
    employeeDesignation: "Welfare Officer",
    beneficiaryName: "Rashida Begum (Deserted Mother)",
    beneficiaryPhone: "01633-112235",
    beneficiaryAddress: "Bhaluka, Mymensingh",
    asnafCategory: "Al-Fuqara",
    justificationDetails: "Approved corporate Zakat asset grant via staff agent Farid Hossain for Rashida Begum (Recipient 3 of 3 in Bhaluka micro-tailoring drive).",
    agencyStatus: "Acknowledged",
    batchRecipientInfo: "Recipient 3 of 3",
    batchDriveTitle: "Women Tailoring Empowerment",
  },

  // =========================================================================
  // MULTI-BENEFICIARY DEMO BATCH 4: FINANCIAL AID COMMUNITY HARDSHIP DRIVE
  // Agent: Mizanur Rahman (3 Beneficiaries in Sreepur, Gazipur)
  // =========================================================================
  {
    id: "FA-2026-08",
    fundType: "Financial Aid",
    budgetYear: 2026,
    assignedDate: "2026-09-02",
    distributionDeadline: "2026-09-25",
    amount: 15000,
    isRecurring: false,
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Cash Grant",
    purposeCategory: "Others",
    otherPurposeDetails: "Special Needs Educational Assistive Grant",
    purposeSpecificDescription: "Educational textbook, tuition and assistive wheelchair stipend for disabled teen",
    employeeId: "2019003881",
    employeeName: "Mizanur Rahman",
    employeeDept: "Quality Assurance",
    employeeDesignation: "Sr. QA Inspector",
    beneficiaryName: "Sumon Mia (Polio Disabled Teen)",
    beneficiaryPhone: "01933-445566",
    beneficiaryAddress: "Sreepur, Gazipur",
    justificationDetails: "Approved corporate Financial Aid educational assistance via staff agent Mizanur Rahman for Sumon Mia (Recipient 1 of 3 in Sreepur welfare drive).",
    agencyStatus: "Verified",
    batchRecipientInfo: "Recipient 1 of 3",
    batchDriveTitle: "Sreepur Community Hardship Drive",
  },
  {
    id: "FA-2026-09",
    fundType: "Financial Aid",
    budgetYear: 2026,
    assignedDate: "2026-09-02",
    distributionDeadline: "2026-09-25",
    amount: 15000,
    isRecurring: false,
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Cash Grant",
    purposeCategory: "Others",
    otherPurposeDetails: "Higher Secondary College Admission Aid",
    purposeSpecificDescription: "College admission, uniform and examination fee support for brilliant orphan student",
    employeeId: "2019003881",
    employeeName: "Mizanur Rahman",
    employeeDept: "Quality Assurance",
    employeeDesignation: "Sr. QA Inspector",
    beneficiaryName: "Rina Akter (Orphan SSC Candidate)",
    beneficiaryPhone: "01933-445567",
    beneficiaryAddress: "Sreepur, Gazipur",
    justificationDetails: "Approved corporate Financial Aid educational assistance via staff agent Mizanur Rahman for Rina Akter (Recipient 2 of 3 in Sreepur welfare drive).",
    agencyStatus: "Distributed",
    batchRecipientInfo: "Recipient 2 of 3",
    batchDriveTitle: "Sreepur Community Hardship Drive",
  },
  {
    id: "FA-2026-10",
    fundType: "Financial Aid",
    budgetYear: 2026,
    assignedDate: "2026-09-02",
    distributionDeadline: "2026-09-25",
    amount: 15000,
    isRecurring: false,
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Cash Grant",
    purposeCategory: "Medical Treatment",
    purposeSpecificDescription: "Co-pay assistance for specialist audiology assessment and digital hearing aid procurement",
    employeeId: "2019003881",
    employeeName: "Mizanur Rahman",
    employeeDept: "Quality Assurance",
    employeeDesignation: "Sr. QA Inspector",
    beneficiaryName: "Tofazzal Hossain (Hearing Impaired Boy)",
    beneficiaryPhone: "01933-445568",
    beneficiaryAddress: "Sreepur, Gazipur",
    justificationDetails: "Approved corporate Financial Aid medical co-pay grant via staff agent Mizanur Rahman for Tofazzal Hossain (Recipient 3 of 3 in Sreepur welfare drive).",
    agencyStatus: "Assigned",
    batchRecipientInfo: "Recipient 3 of 3",
    batchDriveTitle: "Sreepur Community Hardship Drive",
  },

  // ========================================================
  // RECURRING DEMO RECORDS - ZAKAT (MONTHLY, QUARTERLY, BI-ANNUAL, ANNUAL)
  // ========================================================
  {
    id: "ZK-REC-2026-M01",
    fundType: "Zakat",
    budgetYear: 2026,
    assignedDate: "2026-07-10",
    distributionDeadline: "2026-07-20",
    amount: 12000,
    isRecurring: true,
    recurringScheduleId: "REC-ZK-2026-01",
    cadence: "Monthly",
    installmentNumber: 7,
    installmentTotal: 12,
    disbursementChannel: "Direct Employee",
    disbursementMode: "Cash Grant",
    purposeCategory: "Medical Treatment",
    purposeSpecificDescription: "Monthly Dialysis & Medicine Grant (Installment #7 of 12)",
    employeeId: "2020004510",
    employeeName: "Abdur Rashid",
    employeeDept: "Logistics",
    employeeDesignation: "Forklift Operator",
    beneficiaryName: "Abdur Rashid (Staff Self)",
    beneficiaryPhone: "01722-113355",
    beneficiaryAddress: "Tongi, Gazipur",
    asnafCategory: "Al-Masakin",
    justificationDetails: "Monthly corporate Zakat medical stipend for recurring hemodialysis and erythropoietin injections.",
    agencyStatus: "Verified",
  },
  {
    id: "ZK-REC-2026-Q01",
    fundType: "Zakat",
    budgetYear: 2026,
    assignedDate: "2026-06-15",
    distributionDeadline: "2026-06-25",
    amount: 35000,
    isRecurring: true,
    recurringScheduleId: "REC-ZK-2026-02",
    cadence: "Quarterly",
    installmentNumber: 2,
    installmentTotal: 4,
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Cash Grant",
    purposeCategory: "Mosque/Madrasa",
    purposeSpecificDescription: "Quarterly Quran Madrasa Resident Orphan Food & Tuition Grant (Installment #2 of 4)",
    employeeId: "2018001090",
    employeeName: "Anisur Rahman",
    employeeDept: "Admin & Compliance",
    beneficiaryName: "Darul Uloom Hussainia Madrasa & Yateemkhana",
    beneficiaryPhone: "01711-998877",
    beneficiaryAddress: "Valuka, Mymensingh",
    asnafCategory: "Fi Sabilillah",
    justificationDetails: "Quarterly stipend covering food rations, books, and Islamic boarding care for 10 resident orphan students.",
    agencyStatus: "Verified",
  },
  {
    id: "ZK-REC-2026-B01",
    fundType: "Zakat",
    budgetYear: 2026,
    assignedDate: "2026-05-20",
    distributionDeadline: "2026-05-30",
    amount: 50000,
    isRecurring: true,
    recurringScheduleId: "REC-ZK-2026-03",
    cadence: "Bi-Annual",
    installmentNumber: 1,
    installmentTotal: 2,
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Asset Purchased",
    purposeCategory: "Vehicle",
    assetDetails: {
      assetType: "Battery Electric Auto-Van / Easy Bike",
      assetName: "Cargo Auto-Van with Motor & Battery Pack",
      assetQuantity: "1 Unit",
      vendorOrMarket: "Gazipur City Auto Market",
    },
    purposeSpecificDescription: "Bi-Annual Livelihood Vehicle Grant (Installment #1 of 2)",
    employeeId: "2019003881",
    employeeName: "Mizanur Rahman",
    employeeDept: "Quality Assurance",
    employeeDesignation: "Sr. QA Inspector",
    beneficiaryName: "Nurul Islam (Disabled Village Artisan)",
    beneficiaryPhone: "01933-776655",
    beneficiaryAddress: "Bhaluka, Mymensingh",
    asnafCategory: "Al-Fuqara",
    justificationDetails: "Bi-annual sustainable livelihood vehicle procurement for disabled village artisan to transport and market goods.",
    agencyStatus: "Distributed",
  },
  {
    id: "ZK-REC-2026-A01",
    fundType: "Zakat",
    budgetYear: 2026,
    assignedDate: "2026-04-10",
    distributionDeadline: "2026-04-20",
    amount: 120000,
    isRecurring: true,
    recurringScheduleId: "REC-ZK-2026-04",
    cadence: "Annual Lump Sum",
    installmentNumber: 1,
    installmentTotal: 1,
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Cash Grant",
    purposeCategory: "Business Setup",
    purposeSpecificDescription: "Annual Destitute Family Self-Reliance & Asset Rehabilitation (Installment #1 of 1)",
    employeeId: "2018001090",
    employeeName: "Anisur Rahman",
    employeeDept: "Admin & Compliance",
    beneficiaryName: "Kulsum Bibi & Family",
    beneficiaryPhone: "01755-667788",
    beneficiaryAddress: "Fulbaria, Mymensingh",
    asnafCategory: "Al-Masakin",
    justificationDetails: "Annual corporate Zakat grant providing micro-poultry farm setup and grocery kiosk startup capital for destitute widow's household.",
    agencyStatus: "Verified",
  },

  // ========================================================
  // RECURRING DEMO RECORDS - FINANCIAL AID (MONTHLY, QUARTERLY, BI-ANNUAL, ANNUAL)
  // ========================================================
  {
    id: "FA-REC-2026-M01",
    fundType: "Financial Aid",
    budgetYear: 2026,
    assignedDate: "2026-07-05",
    distributionDeadline: "2026-07-15",
    amount: 15000,
    isRecurring: true,
    recurringScheduleId: "REC-FA-2026-01",
    cadence: "Monthly",
    installmentNumber: 6,
    installmentTotal: 24,
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Cash Grant",
    purposeCategory: "Others",
    otherPurposeDetails: "Family Hardship Living Allowance",
    purposeSpecificDescription: "Monthly Deceased Operator Family Welfare Subsidy (Installment #6 of 24)",
    employeeId: "2020002130",
    employeeName: "Farid Hossain",
    employeeDept: "Medical & Welfare",
    beneficiaryName: "Hasna Hena (Widow of late Rafiqul Islam)",
    beneficiaryPhone: "01819-334455",
    beneficiaryAddress: "Sreepur, Gazipur",
    justificationDetails: "Continuous monthly welfare grant for widow and school-going dependents of deceased worker late Rafiqul Islam.",
    agencyStatus: "Verified",
  },
  {
    id: "FA-REC-2026-Q01",
    fundType: "Financial Aid",
    budgetYear: 2026,
    assignedDate: "2026-06-25",
    distributionDeadline: "2026-07-05",
    amount: 25000,
    isRecurring: true,
    recurringScheduleId: "REC-FA-2026-02",
    cadence: "Quarterly",
    installmentNumber: 2,
    installmentTotal: 4,
    disbursementChannel: "Direct Employee",
    disbursementMode: "Cash Grant",
    purposeCategory: "Others",
    otherPurposeDetails: "Staff Dependent Higher Education",
    purposeSpecificDescription: "Quarterly Higher Secondary Tuition & Books Co-Pay (Installment #2 of 4)",
    employeeId: "2023043021",
    employeeName: "Jalal Uddin",
    employeeDept: "Maintenance",
    employeeDesignation: "Sr. Technician",
    beneficiaryName: "Tanvir Ahmed (Son of Jalal Uddin)",
    beneficiaryPhone: "01711-223399",
    beneficiaryAddress: "Sreepur, Gazipur",
    justificationDetails: "Quarterly scholarship supporting university entrance and polytechnic tuition for technician's merit student son.",
    agencyStatus: "Verified",
  },
  {
    id: "FA-REC-2026-B01",
    fundType: "Financial Aid",
    budgetYear: 2026,
    assignedDate: "2026-05-15",
    distributionDeadline: "2026-05-25",
    amount: 40000,
    isRecurring: true,
    recurringScheduleId: "REC-FA-2026-03",
    cadence: "Bi-Annual",
    installmentNumber: 1,
    installmentTotal: 2,
    disbursementChannel: "Direct Employee",
    disbursementMode: "Cash Grant",
    purposeCategory: "Medical Treatment",
    purposeSpecificDescription: "Bi-Annual Chronic Chemotherapy Co-Payment Grant (Installment #1 of 2)",
    employeeId: "2023046001",
    employeeName: "Morium Begum",
    employeeDept: "Finishing (Line-02)",
    employeeDesignation: "Line Ironer",
    beneficiaryName: "Morium Begum (Staff Self)",
    beneficiaryPhone: "01822-445588",
    beneficiaryAddress: "Gazipur Sadar",
    justificationDetails: "Bi-annual oncology financial assistance subsidizing specialized targeted therapy medication.",
    agencyStatus: "Distributed",
  },
  {
    id: "FA-REC-2026-A01",
    fundType: "Financial Aid",
    budgetYear: 2026,
    assignedDate: "2026-03-30",
    distributionDeadline: "2026-04-10",
    amount: 80000,
    isRecurring: true,
    recurringScheduleId: "REC-FA-2026-04",
    cadence: "Annual Lump Sum",
    installmentNumber: 1,
    installmentTotal: 1,
    disbursementChannel: "Direct Employee",
    disbursementMode: "Cash Grant",
    purposeCategory: "Others",
    otherPurposeDetails: "River Erosion Disaster Relief",
    purposeSpecificDescription: "Annual River Erosion Homestead Relocation Grant (Installment #1 of 1)",
    employeeId: "2019003881",
    employeeName: "Monirul Haque",
    employeeDept: "Quality Assurance",
    employeeDesignation: "Sr. QA Inspector",
    beneficiaryName: "Monirul Haque (Staff Self)",
    beneficiaryPhone: "01933-778844",
    beneficiaryAddress: "Sirajganj Sadar",
    justificationDetails: "Annual hardship relief grant assisting employee in purchasing high-ground homestead land following riverbank erosion.",
    agencyStatus: "Verified",
  },
];

const INITIAL_RECURRING_SCHEDULES: UnifiedRecurringSchedule[] = [
  {
    id: "REC-ZK-2026-01",
    fundType: "Zakat",
    title: "Permanent Dialysis Kidney Patient Monthly Medicine Grant",
    disbursementChannel: "Direct Employee",
    disbursementMode: "Cash Grant",
    purposeCategory: "Medical Treatment",
    purposeDescription: "Subsidizing 4 hemodialysis sessions and erythropoietin injections each month.",
    cadence: "Monthly",
    employeeId: "2020004510",
    employeeName: "Abdur Rashid",
    employeeDept: "Logistics",
    employeeDesignation: "Forklift Operator",
    beneficiaryName: "Abdur Rashid (Staff Self)",
    beneficiaryPhone: "01722-113355",
    beneficiaryAddress: "Tongi, Gazipur",
    asnafCategory: "Al-Masakin",
    monthlyAmount: 12000,
    disbursementDayOfMonth: 10,
    startDate: "2026-01-10",
    totalPlannedMonths: 12,
    status: "Active",
    installmentsGenerated: 7,
    totalAmountDisbursed: 84000,
    lastGeneratedDate: "2026-07-10",
    nextDueDate: "2026-08-10",
    createdAt: "2025-12-28",
    notes: "Requires quarterly nephrologist prescription review.",
  },
  {
    id: "REC-ZK-2026-02",
    fundType: "Zakat",
    title: "Quarterly Quran Madrasa Resident Orphan Food & Tuition Grant",
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Cash Grant",
    purposeCategory: "Mosque/Madrasa",
    purposeDescription: "Quarterly food grain, oil, and textbook allowance for resident orphan students.",
    cadence: "Quarterly",
    employeeId: "2018001090",
    employeeName: "Anisur Rahman",
    employeeDept: "Admin & Compliance",
    beneficiaryName: "Darul Uloom Hussainia Madrasa & Yateemkhana",
    beneficiaryPhone: "01711-998877",
    beneficiaryAddress: "Valuka, Mymensingh",
    asnafCategory: "Fi Sabilillah",
    monthlyAmount: 35000,
    disbursementDayOfMonth: 15,
    startDate: "2026-01-15",
    totalPlannedMonths: 12,
    status: "Active",
    installmentsGenerated: 2,
    totalAmountDisbursed: 70000,
    lastGeneratedDate: "2026-06-15",
    nextDueDate: "2026-09-15",
    createdAt: "2025-12-20",
    notes: "Continuous quarterly welfare support committed for academic calendar.",
  },
  {
    id: "REC-ZK-2026-03",
    fundType: "Zakat",
    title: "Bi-Annual Disabled Village Artisan Subsistence & Tool Grant",
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Asset Purchased",
    purposeCategory: "Vehicle",
    assetDetails: {
      assetType: "Battery Electric Auto-Van / Easy Bike",
      assetName: "Cargo Auto-Van with Motor & Battery Pack",
      assetQuantity: "1 Unit",
    },
    purposeDescription: "Bi-annual sustainable equipment and van grant for disabled artisan.",
    cadence: "Bi-Annual",
    employeeId: "2019003881",
    employeeName: "Mizanur Rahman",
    employeeDept: "Quality Assurance",
    employeeDesignation: "Sr. QA Inspector",
    beneficiaryName: "Nurul Islam (Disabled Village Artisan)",
    beneficiaryPhone: "01933-776655",
    beneficiaryAddress: "Bhaluka, Mymensingh",
    asnafCategory: "Al-Fuqara",
    monthlyAmount: 50000,
    disbursementDayOfMonth: 20,
    startDate: "2026-01-20",
    totalPlannedMonths: 12,
    status: "Active",
    installmentsGenerated: 1,
    totalAmountDisbursed: 50000,
    lastGeneratedDate: "2026-05-20",
    nextDueDate: "2026-11-20",
    createdAt: "2026-01-05",
    notes: "Bi-annual installments for disabled artisan livelihood.",
  },
  {
    id: "REC-ZK-2026-04",
    fundType: "Zakat",
    title: "Annual Destitute Family Self-Reliance & Asset Rehabilitation Grant",
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Cash Grant",
    purposeCategory: "Business Setup",
    purposeDescription: "Annual capital grant for micro-poultry farm and homestead kiosk setup.",
    cadence: "Annual Lump Sum",
    employeeId: "2018001090",
    employeeName: "Anisur Rahman",
    employeeDept: "Admin & Compliance",
    beneficiaryName: "Kulsum Bibi & Family",
    beneficiaryPhone: "01755-667788",
    beneficiaryAddress: "Fulbaria, Mymensingh",
    asnafCategory: "Al-Masakin",
    monthlyAmount: 120000,
    disbursementDayOfMonth: 10,
    startDate: "2026-04-10",
    totalPlannedMonths: 12,
    status: "Completed",
    installmentsGenerated: 1,
    totalAmountDisbursed: 120000,
    lastGeneratedDate: "2026-04-10",
    nextDueDate: "2027-04-10",
    createdAt: "2026-03-25",
    notes: "Single annual grant for full-year family rehabilitation.",
  },

  {
    id: "REC-FA-2026-01",
    fundType: "Financial Aid",
    title: "Monthly Deceased Operator Family Subsidy",
    disbursementChannel: "Via Employee Agent",
    disbursementMode: "Cash Grant",
    purposeCategory: "Others",
    otherPurposeDetails: "Family Hardship Living Allowance",
    purposeDescription: "Living stipend for the widow and school-going children of deceased sewing operator late Rafiqul Islam.",
    cadence: "Monthly",
    employeeId: "2020002130",
    employeeName: "Farid Hossain",
    employeeDept: "Medical & Welfare",
    beneficiaryName: "Hasna Hena (Widow of late Rafiqul Islam)",
    beneficiaryPhone: "01819-334455",
    beneficiaryAddress: "Sreepur, Gazipur",
    monthlyAmount: 15000,
    disbursementDayOfMonth: 5,
    startDate: "2026-02-01",
    totalPlannedMonths: 24,
    status: "Active",
    installmentsGenerated: 6,
    totalAmountDisbursed: 90000,
    lastGeneratedDate: "2026-07-05",
    nextDueDate: "2026-08-05",
    createdAt: "2026-01-25",
    notes: "Approved 2-year welfare commitment following tragic road accident.",
  },
  {
    id: "REC-FA-2026-02",
    fundType: "Financial Aid",
    title: "Quarterly Higher Secondary Tuition & Books Co-Pay Grant",
    disbursementChannel: "Direct Employee",
    disbursementMode: "Cash Grant",
    purposeCategory: "Others",
    otherPurposeDetails: "Staff Dependent Education",
    purposeDescription: "Quarterly tuition and academic co-payment for technician's son.",
    cadence: "Quarterly",
    employeeId: "2023043021",
    employeeName: "Jalal Uddin",
    employeeDept: "Maintenance",
    employeeDesignation: "Sr. Technician",
    beneficiaryName: "Tanvir Ahmed (Son of Jalal Uddin)",
    beneficiaryPhone: "01711-223399",
    beneficiaryAddress: "Sreepur, Gazipur",
    monthlyAmount: 25000,
    disbursementDayOfMonth: 25,
    startDate: "2026-01-25",
    totalPlannedMonths: 12,
    status: "Active",
    installmentsGenerated: 2,
    totalAmountDisbursed: 50000,
    lastGeneratedDate: "2026-06-25",
    nextDueDate: "2026-09-25",
    createdAt: "2026-01-10",
    notes: "Quarterly academic support through 2026.",
  },
  {
    id: "REC-FA-2026-03",
    fundType: "Financial Aid",
    title: "Bi-Annual Chronic Chemotherapy Co-Payment Grant",
    disbursementChannel: "Direct Employee",
    disbursementMode: "Cash Grant",
    purposeCategory: "Medical Treatment",
    purposeDescription: "Bi-annual oncology financial assistance for line ironer staff.",
    cadence: "Bi-Annual",
    employeeId: "2023046001",
    employeeName: "Morium Begum",
    employeeDept: "Finishing (Line-02)",
    employeeDesignation: "Line Ironer",
    beneficiaryName: "Morium Begum (Staff Self)",
    beneficiaryPhone: "01822-445588",
    beneficiaryAddress: "Gazipur Sadar",
    monthlyAmount: 40000,
    disbursementDayOfMonth: 15,
    startDate: "2026-01-15",
    totalPlannedMonths: 12,
    status: "Active",
    installmentsGenerated: 1,
    totalAmountDisbursed: 40000,
    lastGeneratedDate: "2026-05-15",
    nextDueDate: "2026-11-15",
    createdAt: "2026-01-05",
    notes: "Bi-annual oncology grant support.",
  },
  {
    id: "REC-FA-2026-04",
    fundType: "Financial Aid",
    title: "Annual River Erosion Homestead Relocation & Disaster Grant",
    disbursementChannel: "Direct Employee",
    disbursementMode: "Cash Grant",
    purposeCategory: "Others",
    otherPurposeDetails: "River Erosion Relief",
    purposeDescription: "Annual single grant assisting employee family relocation.",
    cadence: "Annual Lump Sum",
    employeeId: "2019003881",
    employeeName: "Monirul Haque",
    employeeDept: "Quality Assurance",
    employeeDesignation: "Sr. QA Inspector",
    beneficiaryName: "Monirul Haque (Staff Self)",
    beneficiaryPhone: "01933-778844",
    beneficiaryAddress: "Sirajganj Sadar",
    monthlyAmount: 80000,
    disbursementDayOfMonth: 30,
    startDate: "2026-03-30",
    totalPlannedMonths: 12,
    status: "Completed",
    installmentsGenerated: 1,
    totalAmountDisbursed: 80000,
    lastGeneratedDate: "2026-03-30",
    nextDueDate: "2027-03-30",
    createdAt: "2026-03-15",
    notes: "Single annual grant for homestead reconstruction.",
  },
];

// Fallback staff list for searching
const DEFAULT_COMPANY_EMPLOYEES = [
  { id: "2023043910", name: "Tahmid Afsar Shapno", dept: "Business Innovation", title: "Asst. Manager", gross: "65000" },
  { id: "2018001090", name: "Anisur Rahman", dept: "Admin & Compliance", title: "Compliance Officer", gross: "48000" },
  { id: "2019003881", name: "Mizanur Rahman", dept: "Quality Assurance", title: "Sr. QA Inspector", gross: "42000" },
  { id: "2020002130", name: "Farid Hossain", dept: "Medical & Welfare", title: "Welfare Officer", gross: "35000" },
  { id: "2023043021", name: "Shakil Ahmed", dept: "Maintenance", title: "Sr. Electrician", gross: "32500" },
  { id: "2023046001", name: "Salma Khatun", dept: "Sewing (Line-04)", title: "Sr. Sewing Operator", gross: "18500" },
  { id: "2021008812", name: "Faridul Islam", dept: "Finishing", title: "Assistant Supervisor", gross: "26000" },
  { id: "2022001144", name: "Nasima Akter", dept: "Cutting", title: "Pattern Cutter", gross: "21500" },
  { id: "2020004510", name: "Abdur Rashid", dept: "Logistics", title: "Forklift Operator", gross: "24500" },
  { id: "2024009931", name: "Jamil Mia", dept: "Security", title: "Security Guard", gross: "16000" },
  { id: "2022005521", name: "Taslima Parvin", dept: "HR & Welfare", title: "Welfare Assistant", gross: "28000" },
];

// ==========================================
// 2. MAIN COMPONENT
// ==========================================

function ZakatAndFinancialAidPage() {
  const [selectedBudgetYear, setSelectedBudgetYear] = useState<number>(2026);

  // Records state
  const [records, setRecords] = useState<UnifiedAidRecord[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cripton_unified_aid_records_v4");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length >= 10) {
            return parsed;
          }
        } catch (e) {}
      }
    }
    return INITIAL_UNIFIED_RECORDS;
  });

  // Recurring schedules state
  const [recurringSchedules, setRecurringSchedules] = useState<UnifiedRecurringSchedule[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cripton_unified_recurring_schedules_v4");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length >= 8) {
            return parsed;
          }
        } catch (e) {}
      }
    }
    return INITIAL_RECURRING_SCHEDULES;
  });

  // Synchronize with localStorage
  useEffect(() => {
    localStorage.setItem("cripton_unified_aid_records_v4", JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem("cripton_unified_recurring_schedules_v4", JSON.stringify(recurringSchedules));
  }, [recurringSchedules]);

  // Tabs State: All, Zakat Regular, Zakat Recurring, Financial Aid Regular, Financial Aid Recurring
  const [activeTab, setActiveTab] = useState<"ALL" | "ZAKAT_REGULAR" | "ZAKAT_RECURRING" | "FA_REGULAR" | "FA_RECURRING">("ALL");

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFundType, setFilterFundType] = useState<"ALL" | FundType>("ALL");
  const [filterChannel, setFilterChannel] = useState<"ALL" | ZakatDisbursementChannel>("ALL");
  const [filterMode, setFilterMode] = useState<"ALL" | ZakatDisbursementMode>("ALL");
  const [filterEntryType, setFilterEntryType] = useState<"ALL" | "ONE_TIME" | "RECURRING">("ALL");
  const [filterStatus, setFilterStatus] = useState<"ALL" | UnifiedAidRecord["agencyStatus"]>("ALL");
  const [filterPurpose, setFilterPurpose] = useState<"ALL" | ZakatPurposeCategory>("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Top Add Dropdown state
  const [isAddDropdownOpen, setIsAddDropdownOpen] = useState(false);
  const addDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (addDropdownRef.current && !addDropdownRef.current.contains(event.target as Node)) {
        setIsAddDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // One-Time Modal States
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [modalFundType, setModalFundType] = useState<FundType>("Zakat");
  const [modalChannel, setModalChannel] = useState<ZakatDisbursementChannel>("Direct Employee");
  const [modalMode, setModalMode] = useState<ZakatDisbursementMode>("Cash Grant");

  // Employee Dropdown
  const [empSearchInput, setEmpSearchInput] = useState("");
  const [isEmpDropdownOpen, setIsEmpDropdownOpen] = useState(false);
  const [newEmpId, setNewEmpId] = useState("");
  const [newEmpName, setNewEmpName] = useState("");

  // External / Beneficiary
  const [newBeneficiaryName, setNewBeneficiaryName] = useState("");
  const [newBeneficiaryPhone, setNewBeneficiaryPhone] = useState("");
  const [newBeneficiaryAddress, setNewBeneficiaryAddress] = useState("");
  const [newInstitutionName, setNewInstitutionName] = useState("");
  const [newInstitutionRep, setNewInstitutionRep] = useState("");
  const [newInstitutionPhone, setNewInstitutionPhone] = useState("");

  // Via Employee Agent Multi-Beneficiaries
  const [viaBeneficiaries, setViaBeneficiaries] = useState<Array<{
    id: string;
    name: string;
    phone: string;
    address: string;
    amount: string;
    assetMasterId?: string;
    assetType?: string;
    assetName: string;
    assetQty: string;
  }>>([
    {
      id: "vb-1",
      name: "",
      phone: "",
      address: "",
      amount: "",
      assetMasterId: "",
      assetType: "",
      assetName: "",
      assetQty: "1 Unit",
    },
  ]);

  const totalViaAmount = useMemo(() => {
    return viaBeneficiaries.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);
  }, [viaBeneficiaries]);

  const addViaBeneficiary = () => {
    setViaBeneficiaries((prev) => [
      ...prev,
      {
        id: `vb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: "",
        phone: "",
        address: "",
        amount: "",
        assetMasterId: "",
        assetType: "",
        assetName: "",
        assetQty: "1 Unit",
      },
    ]);
  };

  const updateViaBeneficiary = (
    id: string,
    field: "name" | "phone" | "address" | "amount" | "assetMasterId" | "assetType" | "assetName" | "assetQty",
    value: string
  ) => {
    setViaBeneficiaries((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );
  };

  const handleSelectBeneficiaryMasterAsset = (id: string, masterId: string) => {
    const item = getActiveAssetMasterList().find((m) => m.id === masterId);
    if (item) {
      setViaBeneficiaries((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                assetMasterId: masterId,
                assetType: item.assetType,
                assetName: item.assetType,
                assetQty: item.defaultQty || "1 Unit",
              }
            : b
        )
      );
    } else {
      setViaBeneficiaries((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                assetMasterId: "",
                assetType: "",
              }
            : b
        )
      );
    }
  };

  const removeViaBeneficiary = (id: string) => {
    setViaBeneficiaries((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((b) => b.id !== id);
    });
  };

  // Physical Asset Details (Global for Direct single disbursements with Multiple Items)
  const [modalAssetMasterId, setModalAssetMasterId] = useState("");
  const [modalAssetType, setModalAssetType] = useState("");
  const [modalAssetName, setModalAssetName] = useState("");
  const [modalAssetQty, setModalAssetQty] = useState("");

  const [directAssetItems, setDirectAssetItems] = useState<DirectAssetInputItem[]>([
    { id: "dai-1", assetMasterId: "", assetName: "", assetQty: "1 Unit", amount: "" },
  ]);

  const addDirectAssetItem = () => {
    setDirectAssetItems((prev) => [
      ...prev,
      {
        id: `dai-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        assetMasterId: "",
        assetName: "",
        assetQty: "1 Unit",
        amount: "",
      },
    ]);
  };

  const removeDirectAssetItem = (id: string) => {
    setDirectAssetItems((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((item) => item.id !== id);
    });
  };

  const updateDirectAssetItem = (id: string, field: keyof DirectAssetInputItem, value: string) => {
    setDirectAssetItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (field === "assetMasterId") {
          const masterItem = getActiveAssetMasterList().find((m) => m.id === value);
          if (masterItem && masterItem.suggestedPurpose) {
            setNewPurposeCategory(masterItem.suggestedPurpose);
          }
          return {
            ...item,
            assetMasterId: value,
            assetName: masterItem ? masterItem.assetType : item.assetName,
            assetQty: masterItem?.defaultQty || item.assetQty || "1 Unit",
          };
        }
        return { ...item, [field]: value };
      })
    );
  };

  const totalDirectAssetsAmount = directAssetItems.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );

  const handleSelectMasterAsset = (selectedId: string) => {
    setModalAssetMasterId(selectedId);
    if (!selectedId) {
      setModalAssetType("");
      return;
    }
    const item = getActiveAssetMasterList().find((m) => m.id === selectedId);
    if (item) {
      setModalAssetType(item.assetType);
      setModalAssetName(item.assetType);
      setModalAssetQty(item.defaultQty || "1 Unit");
      if (item.suggestedPurpose) {
        setNewPurposeCategory(item.suggestedPurpose);
      }
    }
  };

  // Financial, Purpose, and Asnaf
  const [newAmount, setNewAmount] = useState("");
  const [newPurposeCategory, setNewPurposeCategory] = useState<ZakatPurposeCategory>("Medical Treatment");
  const [newOtherPurposeDetails, setNewOtherPurposeDetails] = useState("");
  const [newPurposeDescription, setNewPurposeDescription] = useState("");
  const [newAsnaf, setNewAsnaf] = useState<"Al-Fuqara" | "Al-Masakin" | "Al-Gharimin" | "Fi Sabilillah" | "Ibnus-Sabil">("Al-Masakin");
  const [newDeadline, setNewDeadline] = useState("");
  const [newJustification, setNewJustification] = useState("");
  const [modalAttachments, setModalAttachments] = useState<ZakatAttachment[]>([]);

  // Recurring Schedule Modal States
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const [recFundType, setRecFundType] = useState<FundType>("Zakat");
  const [recTitle, setRecTitle] = useState("");
  const [recCadence, setRecCadence] = useState<DisbursementCadence>("Monthly");
  const [recSettlementType, setRecSettlementType] = useState<DisbursementSettlementType>("Periodic Installments");
  const [recDisbursementDay, setRecDisbursementDay] = useState("1");
  const [recMonthlyAmount, setRecMonthlyAmount] = useState("");
  const [recChannel, setRecChannel] = useState<ZakatDisbursementChannel>("Direct Employee");
  const [recMode, setRecMode] = useState<ZakatDisbursementMode>("Cash Grant");
  const [recBeneficiaryName, setRecBeneficiaryName] = useState("");
  const [recBeneficiaryPhone, setRecBeneficiaryPhone] = useState("");
  const [recBeneficiaryAddress, setRecBeneficiaryAddress] = useState("");
  const [recInstitutionName, setRecInstitutionName] = useState("");
  const [recInstitutionRep, setRecInstitutionRep] = useState("");
  const [recInstitutionPhone, setRecInstitutionPhone] = useState("");
  const [recAsnaf, setRecAsnaf] = useState<"Al-Fuqara" | "Al-Masakin" | "Al-Gharimin" | "Fi Sabilillah" | "Ibnus-Sabil">("Al-Masakin");
  const [recPurposeCategory, setRecPurposeCategory] = useState<ZakatPurposeCategory>("Medical Treatment");
  const [recOtherPurpose, setRecOtherPurpose] = useState("");
  const [recDescription, setRecDescription] = useState("");
  const [recStartDate, setRecStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [recDurationMonths, setRecDurationMonths] = useState("12");
  const [recAssetMasterId, setRecAssetMasterId] = useState("");
  const [recAssetType, setRecAssetType] = useState("");
  const [recAssetName, setRecAssetName] = useState("");
  const [recAssetQty, setRecAssetQty] = useState("1 Unit");
  const [recAssetVendor, setRecAssetVendor] = useState("");
  const [recPaymentMethod, setRecPaymentMethod] = useState<"Bank Transfer" | "Mobile Financial Service" | "Cash Handover" | "In-Kind Delivery">("Bank Transfer");
  const [recPaymentAccount, setRecPaymentAccount] = useState("");
  const [recAttachments, setRecAttachments] = useState<ZakatAttachment[]>([]);

  // Attachment upload and removal helpers
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

  // View Details Modal State
  const [viewRecord, setViewRecord] = useState<UnifiedAidRecord | null>(null);

  // Available employees
  const availableEmployees = useMemo(() => {
    if (typeof window !== "undefined") {
      const synced = localStorage.getItem("recruitment_synced_employees");
      if (synced) {
        try {
          const parsed = JSON.parse(synced);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((e: any) => ({
              id: e.id || e.empId,
              name: e.name || e.candidateName,
              dept: e.department || e.dept || "General",
              title: e.designation || e.title || "Staff",
              gross: e.grossSalary || e.gross || "25000",
            }));
          }
        } catch (e) {}
      }
    }
    return DEFAULT_COMPANY_EMPLOYEES;
  }, []);

  const filteredEmployeesForDropdown = useMemo(() => {
    if (!empSearchInput.trim()) return availableEmployees;
    const q = empSearchInput.toLowerCase();
    return availableEmployees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        e.dept.toLowerCase().includes(q) ||
        e.title.toLowerCase().includes(q)
    );
  }, [availableEmployees, empSearchInput]);

  const selectedEmpDetails = useMemo(() => {
    return availableEmployees.find((e) => e.id === newEmpId) || null;
  }, [availableEmployees, newEmpId]);

  // Statistics
  const stats = useMemo(() => {
    const yearRecords = records.filter(
      (r) => r.budgetYear === selectedBudgetYear || r.assignedDate.startsWith(selectedBudgetYear.toString())
    );

    const zakatRecords = yearRecords.filter((r) => r.fundType === "Zakat");
    const financialAidRecords = yearRecords.filter((r) => r.fundType === "Financial Aid");

    const totalZakatAmount = zakatRecords.reduce((sum, r) => sum + r.amount, 0);
    const totalFinancialAidAmount = financialAidRecords.reduce((sum, r) => sum + r.amount, 0);
    const totalCombinedAmount = totalZakatAmount + totalFinancialAidAmount;

    const activeRecurring = recurringSchedules.filter((s) => s.status === "Active");
    const activeMonthlyRunRate = activeRecurring.reduce((sum, s) => sum + s.monthlyAmount, 0);

    return {
      totalCombinedAmount,
      totalCombinedCount: yearRecords.length,
      totalZakatAmount,
      zakatCount: zakatRecords.length,
      totalFinancialAidAmount,
      financialAidCount: financialAidRecords.length,
      activeRecurringCount: activeRecurring.length,
      activeMonthlyRunRate,
    };
  }, [records, recurringSchedules, selectedBudgetYear]);

  // Tab Live Counts
  const tabCounts = useMemo(() => {
    const yearRecords = records.filter(
      (r) => !selectedBudgetYear || r.budgetYear === selectedBudgetYear || r.assignedDate.startsWith(selectedBudgetYear.toString())
    );
    return {
      all: yearRecords.length,
      zakatRegular: yearRecords.filter((r) => r.fundType === "Zakat" && !r.isRecurring).length,
      zakatRecurring: yearRecords.filter((r) => r.fundType === "Zakat" && r.isRecurring).length,
      faRegular: yearRecords.filter((r) => r.fundType === "Financial Aid" && !r.isRecurring).length,
      faRecurring: yearRecords.filter((r) => r.fundType === "Financial Aid" && r.isRecurring).length,
    };
  }, [records, selectedBudgetYear]);

  // Filtered records for table
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (r.budgetYear && r.budgetYear !== selectedBudgetYear && !r.assignedDate.startsWith(selectedBudgetYear.toString())) {
        return false;
      }

      // Tab Filtering
      if (activeTab === "ZAKAT_REGULAR") {
        if (r.fundType !== "Zakat" || r.isRecurring) return false;
      } else if (activeTab === "ZAKAT_RECURRING") {
        if (r.fundType !== "Zakat" || !r.isRecurring) return false;
      } else if (activeTab === "FA_REGULAR") {
        if (r.fundType !== "Financial Aid" || r.isRecurring) return false;
      } else if (activeTab === "FA_RECURRING") {
        if (r.fundType !== "Financial Aid" || !r.isRecurring) return false;
      }

      if (filterFundType !== "ALL" && r.fundType !== filterFundType) return false;
      if (filterChannel !== "ALL" && r.disbursementChannel !== filterChannel) return false;
      if (filterMode !== "ALL" && r.disbursementMode !== filterMode) return false;
      if (filterEntryType === "RECURRING" && !r.isRecurring) return false;
      if (filterEntryType === "ONE_TIME" && r.isRecurring) return false;
      if (filterStatus !== "ALL" && r.agencyStatus !== filterStatus) return false;
      if (filterPurpose !== "ALL" && r.purposeCategory !== filterPurpose) return false;
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
          (r.cadence && r.cadence.toLowerCase().includes(q)) ||
          r.purposeCategory.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [
    records,
    selectedBudgetYear,
    activeTab,
    filterFundType,
    filterChannel,
    filterMode,
    filterEntryType,
    filterStatus,
    filterPurpose,
    dateFrom,
    dateTo,
    searchQuery,
  ]);

  // Handler: Open One-Time Modal
  const openOneTimeModal = (type: FundType) => {
    setModalFundType(type);
    setIsAddDropdownOpen(false);
    setModalChannel("Direct Employee");
    setModalMode("Cash Grant");
    setNewEmpId("");
    setNewEmpName("");
    setEmpSearchInput("");
    setNewBeneficiaryName("");
    setNewBeneficiaryPhone("");
    setNewBeneficiaryAddress("");
    setViaBeneficiaries([
      {
        id: "vb-1",
        name: "",
        phone: "",
        address: "",
        amount: "",
        assetMasterId: "",
        assetType: "",
        assetName: "",
        assetQty: "1 Unit",
      },
    ]);
    setNewAmount("");
    setNewPurposeCategory("Medical Treatment");
    setNewOtherPurposeDetails("");
    setNewPurposeDescription("");
    setNewDeadline("");
    setNewJustification("");
    setModalAssetMasterId("");
    setModalAssetType("");
    setModalAssetName("");
    setModalAssetQty("");
    setDirectAssetItems([
      { id: "dai-1", assetMasterId: "", assetName: "", assetQty: "1 Unit", amount: "" },
    ]);
    setModalAttachments([]);
    setIsAssignModalOpen(true);
  };

  // Handler: Open Recurring Modal
  const openRecurringModal = (type: FundType) => {
    setRecFundType(type);
    setIsAddDropdownOpen(false);
    setRecTitle(type === "Zakat" ? "Corporate Zakat Monthly Stipend" : "Staff Hardship Monthly Allowance");
    setRecCadence("Monthly");
    setRecSettlementType("Periodic Installments");
    setRecDisbursementDay("1");
    setRecMonthlyAmount("");
    setRecChannel("Direct Employee");
    setRecMode("Cash Grant");
    setRecBeneficiaryName("");
    setRecBeneficiaryPhone("");
    setRecBeneficiaryAddress("");
    setRecInstitutionName("");
    setRecInstitutionRep("");
    setRecInstitutionPhone("");
    setRecPurposeCategory("Medical Treatment");
    setRecOtherPurpose("");
    setRecDescription("");
    setRecStartDate(new Date().toISOString().slice(0, 10));
    setRecDurationMonths("12");
    setRecAssetMasterId("");
    setRecAssetType("");
    setRecAssetName("");
    setRecAssetQty("1 Unit");
    setRecAssetVendor("");
    setRecPaymentMethod("Bank Transfer");
    setRecPaymentAccount("");
    setRecAttachments([]);
    setIsRecurringModalOpen(true);
  };

  // Handle Submit: One-Time Case
  const handleAssignCase = (e: React.FormEvent) => {
    e.preventDefault();

    if (modalChannel === "Via Employee Agent") {
      if (!newEmpId || !newEmpName) {
        alert("Please select the agent employee from the search dropdown.");
        return;
      }
      for (let i = 0; i < viaBeneficiaries.length; i++) {
        const b = viaBeneficiaries[i];
        if (!b.name.trim()) {
          alert(`Please enter the name for Beneficiary #${i + 1}.`);
          return;
        }
        if (modalMode === "Asset Purchased" && !b.assetName?.trim()) {
          alert(`Please specify the asset/item being purchased for Beneficiary #${i + 1} (${b.name || "Unnamed"}).`);
          return;
        }
        if (!b.amount || parseFloat(b.amount) <= 0) {
          alert(`Please enter a valid disbursement amount for Beneficiary #${i + 1} (${b.name || "Unnamed"}).`);
          return;
        }
      }
    } else {
      if (modalMode === "Asset Purchased") {
        const invalidItem = directAssetItems.find((item) => !item.assetName.trim());
        if (invalidItem) {
          alert("Please provide an Asset / Item Description for all items in the purchase list.");
          return;
        }
        const invalidAmount = directAssetItems.find(
          (item) => !item.amount || parseFloat(item.amount) <= 0 || isNaN(parseFloat(item.amount))
        );
        if (invalidAmount) {
          alert("Please enter a valid amount (BDT ৳) for all items in the purchase list.");
          return;
        }
      } else {
        if (!newAmount || parseFloat(newAmount) <= 0) {
          alert("Please enter a valid amount.");
          return;
        }
      }
    }

    if (modalChannel === "Direct Employee" && (!newEmpId || !newEmpName)) {
      alert("Please select an internal employee from the search dropdown.");
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const prefix = modalFundType === "Zakat" ? "ZK" : "FA";

    if (modalChannel === "Via Employee Agent") {
      const newRecordsToAdd: UnifiedAidRecord[] = viaBeneficiaries.map((b, idx) => {
        const itemDesc = b.assetName?.trim() || modalAssetName || "Physical Asset";
        return {
          id: `${prefix}-${selectedBudgetYear}-${String(records.length + idx + 1).padStart(2, "0")}`,
          fundType: modalFundType,
          budgetYear: selectedBudgetYear,
          assignedDate: today,
          distributionDeadline: newDeadline || today,
          amount: parseFloat(b.amount),
          isRecurring: false,
          disbursementChannel: "Via Employee Agent",
          disbursementMode: modalMode,
          assetDetails:
            modalMode === "Asset Purchased"
              ? {
                  assetType: b.assetType || modalAssetType || undefined,
                  assetName: itemDesc,
                  assetQuantity: b.assetQty?.trim() || "1 Unit",
                }
              : undefined,
          purposeCategory: newPurposeCategory,
          otherPurposeDetails: newPurposeCategory === "Others" ? newOtherPurposeDetails : undefined,
          purposeSpecificDescription:
            newPurposeDescription.trim() ||
            (modalMode === "Asset Purchased"
              ? `Asset: ${itemDesc} (${b.assetQty || "1 Unit"})`
              : newPurposeCategory === "Others"
                ? newOtherPurposeDetails
                : `${newPurposeCategory} Grant`),
          employeeId: newEmpId,
          employeeName: newEmpName,
          employeeDept: selectedEmpDetails?.dept,
          employeeDesignation: selectedEmpDetails?.title,
          beneficiaryName: b.name.trim(),
          beneficiaryPhone: b.phone.trim() || undefined,
          beneficiaryAddress: b.address.trim() || undefined,
          // Only Zakat gets Asnaf Category
          asnafCategory: modalFundType === "Zakat" ? newAsnaf : undefined,
          justificationDetails:
            newJustification ||
            `Approved corporate ${modalFundType} disbursement via staff agent ${newEmpName} for ${b.name.trim()}${
              viaBeneficiaries.length > 1 ? ` (${idx + 1} of ${viaBeneficiaries.length} recipients)` : ""
            }.`,
          agencyStatus: "Assigned",
          batchRecipientInfo: viaBeneficiaries.length > 1 ? `Recipient ${idx + 1} of ${viaBeneficiaries.length}` : undefined,
          batchDriveTitle: viaBeneficiaries.length > 1 ? `${newEmpName}'s Distribution Drive` : undefined,
          attachments: modalAttachments.length > 0 ? modalAttachments : undefined,
        };
      });

      setRecords((prev) => [...newRecordsToAdd, ...prev]);
    } else {
      const resolvedBeneficiary = `${newEmpName} (Staff Self)`;

      const effectiveDirectAmount =
        modalMode === "Asset Purchased" ? totalDirectAssetsAmount : parseFloat(newAmount);

      const assetItemsToSave: ZakatAssetItem[] = directAssetItems.map((item) => ({
        id: item.id,
        assetMasterId: item.assetMasterId || undefined,
        assetName: item.assetName.trim(),
        quantity: item.assetQty.trim() || "1 Unit",
        amount: parseFloat(item.amount) || 0,
      }));

      const combinedDirectAssetName =
        directAssetItems.length === 1
          ? directAssetItems[0].assetName.trim()
          : directAssetItems
              .map((i) => `${i.assetName.trim()} (${i.assetQty || "1 Unit"}) - ৳${parseFloat(i.amount || "0").toLocaleString()}`)
              .join("; ");

      const combinedDirectAssetQty =
        directAssetItems.length === 1
          ? directAssetItems[0].assetQty.trim() || "1 Unit"
          : `${directAssetItems.length} Items`;

      const newRecord: UnifiedAidRecord = {
        id: `${prefix}-${selectedBudgetYear}-${String(records.length + 1).padStart(2, "0")}`,
        fundType: modalFundType,
        budgetYear: selectedBudgetYear,
        assignedDate: today,
        distributionDeadline: newDeadline || today,
        amount: effectiveDirectAmount,
        isRecurring: false,
        disbursementChannel: "Direct Employee",
        disbursementMode: modalMode,
        assetDetails:
          modalMode === "Asset Purchased"
            ? {
                assetType: directAssetItems[0]?.assetMasterId ? "Master Catalog Asset" : undefined,
                assetName: combinedDirectAssetName,
                assetQuantity: combinedDirectAssetQty,
                items: assetItemsToSave,
              }
            : undefined,
        purposeCategory: newPurposeCategory,
        otherPurposeDetails: newPurposeCategory === "Others" ? newOtherPurposeDetails : undefined,
        purposeSpecificDescription:
          newPurposeDescription.trim() ||
          (modalMode === "Asset Purchased"
            ? `Assets: ${combinedDirectAssetName}`
            : newPurposeCategory === "Others"
              ? newOtherPurposeDetails
              : `${newPurposeCategory} Grant`),
        employeeId: newEmpId,
        employeeName: newEmpName,
        employeeDept: selectedEmpDetails?.dept,
        employeeDesignation: selectedEmpDetails?.title,
        beneficiaryName: resolvedBeneficiary,
        beneficiaryAddress: newBeneficiaryAddress.trim() || undefined,
        // Only Zakat gets Asnaf Category
        asnafCategory: modalFundType === "Zakat" ? newAsnaf : undefined,
        justificationDetails:
          newJustification.trim() ||
          `Approved ${modalFundType} allocation for ${resolvedBeneficiary}.`,
        agencyStatus: "Assigned",
        attachments: modalAttachments.length > 0 ? modalAttachments : undefined,
      };

      setRecords((prev) => [newRecord, ...prev]);
    }

    setIsAssignModalOpen(false);
  };

  // Handle Submit: Recurring Schedule
  const handleCreateRecurring = (e: React.FormEvent) => {
    e.preventDefault();

    if (!recMonthlyAmount || parseFloat(recMonthlyAmount) <= 0) {
      alert("Please enter a valid disbursement amount.");
      return;
    }

    const resolvedBeneficiary =
      recChannel === "Direct Employee"
        ? (newEmpName ? `${newEmpName} (Staff Self)` : "Internal Staff Beneficiary")
        : (recBeneficiaryName.trim() || "Beneficiary");

    const prefix = recFundType === "Zakat" ? "REC-ZK" : "REC-FA";
    const startDay = (recStartDate ? parseInt(recStartDate.split("-")[2], 10) : undefined) || parseInt(recDisbursementDay) || 1;
    const plannedInstallments = calculateInstallmentCount(recCadence, recDurationMonths);

    const newSchedule: UnifiedRecurringSchedule = {
      id: `${prefix}-${selectedBudgetYear}-${String(recurringSchedules.length + 1).padStart(2, "0")}`,
      fundType: recFundType,
      title: recTitle.trim() || `${recFundType} Commitment for ${resolvedBeneficiary}`,
      disbursementChannel: recChannel,
      disbursementMode: recMode,
      purposeCategory: recPurposeCategory,
      otherPurposeDetails: recPurposeCategory === "Others" ? recOtherPurpose : undefined,
      purposeDescription: recDescription.trim() || `${recFundType} automated stipend`,
      cadence: recCadence,
      employeeId: recChannel === "Direct Employee" ? newEmpId : undefined,
      employeeName: recChannel === "Direct Employee" ? newEmpName : undefined,
      beneficiaryName: resolvedBeneficiary,
      beneficiaryPhone: recBeneficiaryPhone || recInstitutionPhone || undefined,
      beneficiaryAddress: recBeneficiaryAddress || undefined,
      institutionName: recInstitutionName || undefined,
      institutionRepresentative: recInstitutionRep || undefined,
      institutionContactPhone: recInstitutionPhone || undefined,
      // Only Zakat gets Asnaf Category
      asnafCategory: recFundType === "Zakat" ? recAsnaf : undefined,
      monthlyAmount: parseFloat(recMonthlyAmount),
      disbursementDayOfMonth: startDay,
      startDate: recStartDate,
      totalPlannedMonths: parseInt(recDurationMonths, 10) || 12,
      status: "Active",
      installmentsGenerated: 1,
      totalAmountDisbursed: parseFloat(recMonthlyAmount),
      lastGeneratedDate: recStartDate,
      nextDueDate: recStartDate,
      createdAt: new Date().toISOString(),
    };

    setRecurringSchedules((prev) => [newSchedule, ...prev]);

    // Also generate the first installment record in the list
    const firstRecord: UnifiedAidRecord = {
      id: `${recFundType === "Zakat" ? "ZK" : "FA"}-${selectedBudgetYear}-${String(records.length + 1).padStart(2, "0")}`,
      fundType: recFundType,
      budgetYear: selectedBudgetYear,
      assignedDate: recStartDate,
      distributionDeadline: recStartDate,
      amount: parseFloat(recMonthlyAmount),
      isRecurring: true,
      recurringScheduleId: newSchedule.id,
      cadence: recCadence,
      installmentNumber: 1,
      installmentTotal: plannedInstallments,
      disbursementChannel: recChannel,
      disbursementMode: recMode,
      purposeCategory: recPurposeCategory,
      otherPurposeDetails: recOtherPurpose || undefined,
      purposeSpecificDescription: `Recurring Installment #1: ${newSchedule.title}`,
      beneficiaryName: resolvedBeneficiary,
      beneficiaryPhone: recBeneficiaryPhone || recInstitutionPhone || undefined,
      beneficiaryAddress: recBeneficiaryAddress || undefined,
      institutionName: recInstitutionName || undefined,
      asnafCategory: recFundType === "Zakat" ? recAsnaf : undefined,
      justificationDetails: `First installment auto-generated from active schedule: ${newSchedule.title}`,
      agencyStatus: "Assigned",
    };

    setRecords((prev) => [firstRecord, ...prev]);
    setIsRecurringModalOpen(false);
  };

  // Status progression
  const advanceRecordStatus = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const nextStatus: UnifiedAidRecord["agencyStatus"] =
          r.agencyStatus === "Assigned"
            ? "Acknowledged"
            : r.agencyStatus === "Acknowledged"
              ? "Distributed"
              : r.agencyStatus === "Distributed"
                ? "Verified"
                : "Verified";
        return { ...r, agencyStatus: nextStatus };
      })
    );
  };

  // Delete record
  const deleteRecord = (id: string) => {
    if (confirm("Are you sure you want to delete this disbursement record?")) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="flex h-screen bg-slate-50/50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 antialiased overflow-hidden">
      {/* 1. Global Navigation Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* 2. Topbar */}
        <Topbar />

        {/* 3. Main Dashboard Body */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 space-y-6">
          {/* Header & Breadcrumb & Action Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                <span>Welfare & Support</span>
                <ChevronRight className="size-3.5" />
                <span className="text-slate-900 dark:text-slate-100 font-bold">
                  Zakat and Financial Aid
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                <HeartHandshake className="size-6 text-emerald-600" />
                <span>Zakat and Financial Aid Management</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Unified corporate governance for Islamic Zakat allocations and general company Financial Aid disbursements.
              </p>
            </div>

            {/* Top Right Action Dropdown & Year Filter */}
            <div className="flex items-center gap-3">
              {/* Year Selector */}
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <Calendar className="size-3.5 text-slate-400" />
                <span className="text-xs font-bold text-slate-500">Year:</span>
                <select
                  value={selectedBudgetYear}
                  onChange={(e) => setSelectedBudgetYear(parseInt(e.target.value, 10))}
                  className="text-xs font-black text-slate-800 dark:text-slate-200 bg-transparent outline-none cursor-pointer"
                >
                  <option value={2026}>2026</option>
                  <option value={2025}>2025</option>
                  <option value={2024}>2024</option>
                </select>
              </div>

              {/* + ADD / NEW CASE DROPDOWN */}
              <div className="relative" ref={addDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsAddDropdownOpen((prev) => !prev)}
                  className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="size-4" />
                  <span>Assign / Add New Case</span>
                  <ChevronDown className={`size-3.5 transition-transform duration-200 ${isAddDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isAddDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Select Disbursement Mode
                    </div>

                    <div className="py-1 space-y-1">
                      {/* 1. Regular Zakat */}
                      <button
                        type="button"
                        onClick={() => openOneTimeModal("Zakat")}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors flex items-start gap-3 group cursor-pointer"
                      >
                        <div className="size-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                          <ShieldCheck className="size-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                            Regular Zakat
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            One-time grant with Islamic Asnaf eligibility
                          </div>
                        </div>
                      </button>

                      {/* 2. Regular Financial Aid */}
                      <button
                        type="button"
                        onClick={() => openOneTimeModal("Financial Aid")}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors flex items-start gap-3 group cursor-pointer"
                      >
                        <div className="size-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                          <Banknote className="size-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300">
                            Regular Financial Aid
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            General company relief (without Asnaf Category)
                          </div>
                        </div>
                      </button>
                    </div>

                    <div className="pt-1.5 space-y-1">
                      {/* 3. Recurring Zakat */}
                      <button
                        type="button"
                        onClick={() => openRecurringModal("Zakat")}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-colors flex items-start gap-3 group cursor-pointer"
                      >
                        <div className="size-8 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                          <Repeat className="size-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300">
                            Recurring Zakat
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            Monthly zakat stipends & schedule commitments
                          </div>
                        </div>
                      </button>

                      {/* 4. Recurring Financial Aid */}
                      <button
                        type="button"
                        onClick={() => openRecurringModal("Financial Aid")}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors flex items-start gap-3 group cursor-pointer"
                      >
                        <div className="size-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                          <CalendarClock className="size-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                            Recurring Financial Aid
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            Ongoing monthly hardship allowance (no Asnaf)
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. Executive KPI Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Combined */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
              <div className="size-11 rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 flex items-center justify-center shrink-0">
                <Landmark className="size-5.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                  Combined Total Disbursed
                </div>
                <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                  ৳ {stats.totalCombinedAmount.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {stats.totalCombinedCount} Total Approved Cases
                </div>
              </div>
            </div>

            {/* Zakat Disbursed */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/40 shadow-xs flex items-center gap-3.5">
              <div className="size-11 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="size-5.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                  Corporate Zakat Fund
                </div>
                <div className="text-lg font-black text-emerald-800 dark:text-emerald-300 font-mono">
                  ৳ {stats.totalZakatAmount.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {stats.zakatCount} Zakat Cases &bull; Asnaf Verified
                </div>
              </div>
            </div>

            {/* Financial Aid Disbursed */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-blue-200/80 dark:border-blue-900/40 shadow-xs flex items-center gap-3.5">
              <div className="size-11 rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 flex items-center justify-center shrink-0">
                <Banknote className="size-5.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                  Company Financial Aid
                </div>
                <div className="text-lg font-black text-blue-800 dark:text-blue-300 font-mono">
                  ৳ {stats.totalFinancialAidAmount.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {stats.financialAidCount} Staff Hardship Grants
                </div>
              </div>
            </div>

            {/* Recurring Commitments */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
              <div className="size-11 rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 flex items-center justify-center shrink-0">
                <Repeat className="size-5.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                  Active Recurring Commitments
                </div>
                <div className="text-lg font-black text-teal-800 dark:text-teal-300 font-mono">
                  ৳ {stats.activeMonthlyRunRate.toLocaleString()}/mo
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {stats.activeRecurringCount} Active Monthly Schedules
                </div>
              </div>
            </div>
          </div>

          {/* 5. Comprehensive Filter Console */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
            {/* Primary Category & Recurring Sub-Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setActiveTab("ALL")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "ALL"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span>All Disbursements</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    activeTab === "ALL" ? "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200" : "bg-slate-200/70 text-slate-600"
                  }`}>
                    {tabCounts.all}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("ZAKAT_REGULAR")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "ZAKAT_REGULAR"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/30"
                  }`}
                >
                  <ShieldCheck className="size-3.5" />
                  <span>Zakat Regular</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    activeTab === "ZAKAT_REGULAR" ? "bg-emerald-700 text-emerald-100" : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {tabCounts.zakatRegular}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("ZAKAT_RECURRING")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "ZAKAT_RECURRING"
                      ? "bg-teal-600 text-white shadow-xs"
                      : "text-teal-700 dark:text-teal-400 hover:bg-teal-50/70 dark:hover:bg-teal-950/30"
                  }`}
                >
                  <Repeat className="size-3.5" />
                  <span>Zakat Recurring</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    activeTab === "ZAKAT_RECURRING" ? "bg-teal-700 text-teal-100" : "bg-teal-100 text-teal-800"
                  }`}>
                    {tabCounts.zakatRecurring}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("FA_REGULAR")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "FA_REGULAR"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-blue-700 dark:text-blue-400 hover:bg-blue-50/70 dark:hover:bg-blue-950/30"
                  }`}
                >
                  <Banknote className="size-3.5" />
                  <span>Financial Aid Regular</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    activeTab === "FA_REGULAR" ? "bg-blue-700 text-blue-100" : "bg-blue-100 text-blue-800"
                  }`}>
                    {tabCounts.faRegular}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("FA_RECURRING")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "FA_RECURRING"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/30"
                  }`}
                >
                  <CalendarClock className="size-3.5" />
                  <span>Financial Aid Recurring</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    activeTab === "FA_RECURRING" ? "bg-indigo-700 text-indigo-100" : "bg-indigo-100 text-indigo-800"
                  }`}>
                    {tabCounts.faRecurring}
                  </span>
                </button>
              </div>

              {/* Matching Count */}
              <div className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                <span>Showing <strong className="text-slate-900 dark:text-slate-100">{filteredRecords.length}</strong> matching disbursements</span>
              </div>
            </div>

            {/* Search and Secondary Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
              {/* Search */}
              <div className="lg:col-span-2 relative">
                <Search className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search beneficiary, staff ID, item, notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-emerald-600 shadow-xs"
                />
              </div>

              {/* Channel */}
              <div>
                <select
                  value={filterChannel}
                  onChange={(e) => setFilterChannel(e.target.value as any)}
                  className="w-full h-9 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none"
                >
                  <option value="ALL">All Channels</option>
                  <option value="Direct Employee">Direct Employee</option>
                  <option value="Via Employee Agent">Via Staff Agent</option>
                </select>
              </div>

              {/* Mode */}
              <div>
                <select
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value as any)}
                  className="w-full h-9 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none"
                >
                  <option value="ALL">All Modes</option>
                  <option value="Cash Grant">Cash Grant</option>
                  <option value="Asset Purchased">In-Kind Asset</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="w-full h-9 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none"
                >
                  <option value="ALL">All Status</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Acknowledged">Acknowledged</option>
                  <option value="Distributed">Distributed</option>
                  <option value="Verified">Verified</option>
                </select>
              </div>

              {/* Purpose */}
              <div>
                <select
                  value={filterPurpose}
                  onChange={(e) => setFilterPurpose(e.target.value as any)}
                  className="w-full h-9 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none"
                >
                  <option value="ALL">All Purposes</option>
                  <option value="Medical Treatment">Medical Treatment</option>
                  <option value="Mosque/Madrasa">Mosque / Madrasa</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Farm Animal">Farm Animal</option>
                  <option value="Business Setup">Business Setup</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>
          </div>

          {/* 6. Unified Data Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 tracking-wider">
                    <th className="py-3 px-4 whitespace-nowrap w-[130px]">Fund Type & ID</th>
                    <th className="py-3 px-3 whitespace-nowrap w-[95px]">Date</th>
                    <th className="py-3 px-4 min-w-[190px]">Beneficiary / Recipient</th>
                    <th className="py-3 px-3 text-center whitespace-nowrap w-[110px]">Channel</th>
                    <th className="py-3 px-4 min-w-[210px]">Mode & Asset Item</th>
                    <th className="py-3 px-4 min-w-[160px]">Purpose</th>
                    <th className="py-3 px-3 text-center whitespace-nowrap w-[130px]">Asnaf Category</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap w-[115px]">Amount (BDT)</th>
                    <th className="py-3 px-3 text-center whitespace-nowrap w-[105px]">Status</th>
                    <th className="py-3 px-4 text-center whitespace-nowrap w-[80px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((r) => {
                      const isZakat = r.fundType === "Zakat";
                      return (
                        <tr
                          key={r.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          {/* Fund Type & ID */}
                          <td className="py-3.5 px-4 align-top whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                  isZakat
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                                    : "bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800"
                                }`}
                              >
                                {r.fundType}
                              </span>
                              {r.isRecurring ? (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800">
                                  {r.cadence === "Annual Lump Sum" ? "Annual" : (r.cadence || "Recurring")} #{r.installmentNumber || 1}{r.installmentTotal ? `/${r.installmentTotal}` : ""}
                                </span>
                              ) : (
                                <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
                                  Regular
                                </span>
                              )}
                            </div>
                            <div className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">
                              {r.id}
                            </div>
                          </td>

                          {/* Date */}
                          <td className="py-3.5 px-3 align-top text-slate-600 dark:text-slate-400 whitespace-nowrap font-mono text-xs">
                            {r.assignedDate}
                          </td>

                          {/* Beneficiary */}
                          <td className="py-3.5 px-4 align-top">
                            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 flex-wrap">
                              <span>{r.beneficiaryName}</span>
                              {r.batchRecipientInfo && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                  <Users className="size-2.5 shrink-0" />
                                  {r.batchRecipientInfo}
                                </span>
                              )}
                            </div>
                            {r.disbursementChannel === "Via Employee Agent" && r.employeeName && (
                              <div className="text-[11px] text-blue-600 dark:text-blue-400 flex items-center gap-1 font-medium mt-0.5">
                                <Users className="size-3 shrink-0" />
                                <span>Via Agent: {r.employeeName} {r.employeeDept ? `(${r.employeeDept})` : ""}</span>
                              </div>
                            )}
                            {r.batchDriveTitle && (
                              <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                                Drive: {r.batchDriveTitle}
                              </div>
                            )}
                            {r.beneficiaryPhone && (
                              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                                {r.beneficiaryPhone}
                              </div>
                            )}
                          </td>

                          {/* Channel */}
                          <td className="py-3.5 px-3 align-top text-center whitespace-nowrap">
                            <span
                              className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                r.disbursementChannel === "Direct Employee"
                                  ? "bg-sky-50 text-sky-800 border border-sky-200"
                                  : "bg-purple-50 text-purple-800 border border-purple-200"
                              }`}
                            >
                              {r.disbursementChannel === "Direct Employee"
                                ? "Direct Staff"
                                : "Via Agent"}
                            </span>
                          </td>

                          {/* Mode & Asset */}
                          <td className="py-3.5 px-4 align-top">
                            <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                              {r.disbursementMode === "Asset Purchased" ? (
                                <ShoppingBag className="size-3.5 text-indigo-600 shrink-0" />
                              ) : (
                                <Banknote className="size-3.5 text-emerald-600 shrink-0" />
                              )}
                              <span>{r.disbursementMode}</span>
                            </div>
                            {r.assetDetails?.assetName && (
                              <div className="text-xs text-indigo-700 dark:text-indigo-400 font-medium line-clamp-1 mt-0.5">
                                {r.assetDetails.assetName} {r.assetDetails.assetQuantity ? `(${r.assetDetails.assetQuantity})` : ""}
                              </div>
                            )}
                          </td>

                          {/* Purpose */}
                          <td className="py-3.5 px-4 align-top">
                            <div className="font-semibold text-slate-800 dark:text-slate-200">
                              {r.purposeCategory}
                            </div>
                            {r.otherPurposeDetails && (
                              <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                {r.otherPurposeDetails}
                              </div>
                            )}
                          </td>

                          {/* Asnaf Category */}
                          <td className="py-3.5 px-3 align-top text-center whitespace-nowrap">
                            {isZakat ? (
                              <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                                {r.asnafCategory || "Al-Masakin"}
                              </span>
                            ) : (
                              <span className="text-[11px] font-medium text-slate-400 italic">
                                &mdash; (General Aid)
                              </span>
                            )}
                          </td>

                          {/* Amount */}
                          <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                            <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                              ৳ {r.amount.toLocaleString()}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-3 align-top text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => advanceRecordStatus(r.id)}
                              title="Click to advance status"
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border cursor-pointer transition-colors ${
                                r.agencyStatus === "Verified"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300"
                                  : r.agencyStatus === "Distributed"
                                    ? "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/70 dark:text-blue-300"
                                    : r.agencyStatus === "Acknowledged"
                                      ? "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300"
                                      : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300"
                              }`}
                            >
                              {r.agencyStatus}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 align-top text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setViewRecord(r)}
                                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                                title="View Details"
                              >
                                <Eye className="size-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteRecord(r.id)}
                                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer transition-colors"
                                title="Delete Record"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-400 text-xs">
                        No disbursements found matching current search and filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* ========================================================= */}
      {/* 7. ONE-TIME CASE ASSIGNMENT MODAL                         */}
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
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    {modalFundType === "Zakat" ? "Assign Zakat Handover Case" : "Assign Financial Aid Handover Case"}
                  </h3>
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

            {/* Modal Form */}
            <form onSubmit={handleAssignCase} className="flex flex-col">
              <div className="p-6 md:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* 1 & 2: Channel & Mode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block mb-1.5">
                    1. Beneficiary Channel <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={modalChannel}
                    onChange={(e) => setModalChannel(e.target.value as ZakatDisbursementChannel)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-blue-600 shadow-xs"
                  >
                    <option value="Direct Employee">Direct Employee (Company Staff)</option>
                    <option value="Via Employee Agent">Via Staff Agent (Staff Village Handover)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block mb-1.5">
                    2. Aid Mode / Form <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={modalMode}
                    onChange={(e) => setModalMode(e.target.value as ZakatDisbursementMode)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-emerald-600 shadow-xs"
                  >
                    <option value="Cash Grant">Direct Cash / Financial Grant</option>
                    <option value="Asset Purchased">In-Kind Asset / Item Purchased</option>
                  </select>
                </div>
              </div>

              {/* Beneficiary Details based on Channel */}
              {modalChannel === "Direct Employee" && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block">
                    Select Internal Staff Beneficiary <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Search className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search employee by name, ID, or department..."
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
                      className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-blue-500"
                    />

                    {isEmpDropdownOpen && (
                      <div className="absolute left-0 right-0 mt-1 max-h-52 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredEmployeesForDropdown.map((emp) => (
                          <div
                            key={emp.id}
                            onClick={() => {
                              setNewEmpId(emp.id);
                              setNewEmpName(emp.name);
                              setEmpSearchInput(`${emp.name} (${emp.id})`);
                              setIsEmpDropdownOpen(false);
                            }}
                            className="p-2.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between"
                          >
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">
                                {emp.name} <span className="font-mono text-slate-400">({emp.id})</span>
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {emp.dept} &bull; {emp.title}
                              </div>
                            </div>
                            <div className="font-mono font-bold text-emerald-600">
                              ৳ {parseFloat(emp.gross).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {modalChannel === "Via Employee Agent" && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                  {/* Select Agent */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block mb-1">
                      Staff Representative / Agent <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Search className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search staff agent by name, ID, or department..."
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
                        className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-blue-500"
                      />

                      {isEmpDropdownOpen && (
                        <div className="absolute left-0 right-0 mt-1 max-h-52 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 divide-y divide-slate-100 dark:divide-slate-800">
                          {filteredEmployeesForDropdown.map((emp) => (
                            <div
                              key={emp.id}
                              onClick={() => {
                                setNewEmpId(emp.id);
                                setNewEmpName(emp.name);
                                setEmpSearchInput(`${emp.name} (${emp.id})`);
                                setIsEmpDropdownOpen(false);
                              }}
                              className="p-2.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between"
                            >
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white">
                                  {emp.name} <span className="font-mono text-slate-400">({emp.id})</span>
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  {emp.dept} &bull; {emp.title}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Beneficiaries Multi-List */}
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                        Village Beneficiaries via this Agent <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={addViaBeneficiary}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs"
                      >
                        <Plus className="size-3.5" />
                        <span>Add Beneficiary</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {viaBeneficiaries.map((b, index) => (
                        <div
                          key={b.id}
                          className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                              <span className="size-5 rounded-full bg-blue-50 text-blue-700 font-mono text-[10px] font-black flex items-center justify-center">
                                {index + 1}
                              </span>
                              <span>Beneficiary #{index + 1}</span>
                            </span>
                            {viaBeneficiaries.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeViaBeneficiary(b.id)}
                                className="text-slate-400 hover:text-red-600 p-1 text-xs cursor-pointer"
                                title="Remove recipient"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
                              <div className={modalMode === "Asset Purchased" ? "lg:col-span-4" : "lg:col-span-4"}>
                                <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                                  Beneficiary Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={b.name}
                                  onChange={(e) => updateViaBeneficiary(b.id, "name", e.target.value)}
                                  placeholder="e.g. Jamil Mia"
                                  className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-blue-500 shadow-xs"
                                />
                              </div>

                              <div className={modalMode === "Asset Purchased" ? "lg:col-span-3" : "lg:col-span-2"}>
                                <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                                  Contact Phone
                                </label>
                                <input
                                  type="text"
                                  value={b.phone}
                                  onChange={(e) => updateViaBeneficiary(b.id, "phone", e.target.value)}
                                  placeholder="01712-345678"
                                  className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-blue-500 shadow-xs"
                                />
                              </div>

                              <div className={modalMode === "Asset Purchased" ? "lg:col-span-5" : "lg:col-span-3"}>
                                <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                                  Village / Address
                                </label>
                                <input
                                  type="text"
                                  value={b.address}
                                  onChange={(e) => updateViaBeneficiary(b.id, "address", e.target.value)}
                                  placeholder="e.g. Bhaluka, Mymensingh"
                                  className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-blue-500 shadow-xs"
                                />
                              </div>

                              {modalMode === "Cash Grant" && (
                                <div className="lg:col-span-3">
                                  <label className="text-[10px] font-bold text-emerald-700 uppercase block mb-1">
                                    Disbursement Amount (BDT ৳) <span className="text-red-500">*</span>
                                  </label>
                                  <div className="relative">
                                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">৳</span>
                                    <input
                                      type="number"
                                      required
                                      value={b.amount}
                                      onChange={(e) => updateViaBeneficiary(b.id, "amount", e.target.value)}
                                      placeholder="e.g. 15000"
                                      className="w-full h-10 pl-6 pr-2 rounded-lg border border-emerald-300 bg-emerald-50/20 text-xs font-bold font-mono outline-none focus:border-emerald-600 shadow-xs"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Beneficiary-wise Physical Asset Purchase Details */}
                            {modalMode === "Asset Purchased" && (
                              <div className="mt-2.5 p-3.5 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-200 dark:border-indigo-900/50 space-y-3">
                                <div className="flex items-center justify-between border-b border-indigo-100 dark:border-indigo-900/40 pb-2">
                                  <div className="text-[11px] font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5 uppercase tracking-wide">
                                    <ShoppingBag className="size-3.5 text-indigo-600" />
                                    <span>Physical Asset Purchase Details &bull; Beneficiary #{index + 1}</span>
                                  </div>
                                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                                    Master Catalog Linked
                                  </span>
                                </div>

                                <div>
                                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">
                                    Asset Type (Master Catalog)
                                  </label>
                                  <select
                                    value={b.assetMasterId || ""}
                                    onChange={(e) => handleSelectBeneficiaryMasterAsset(b.id, e.target.value)}
                                    className="w-full h-9 px-3 rounded-lg border border-indigo-200 dark:border-indigo-900/50 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-indigo-600 shadow-xs"
                                  >
                                    <option value="">-- Choose Asset from Master Catalog (or specify manually below) --</option>
                                    {Array.from(new Set(getActiveAssetMasterList().map((m) => m.category))).map((cat) => (
                                      <optgroup key={cat} label={cat}>
                                        {getActiveAssetMasterList().filter((m) => m.category === cat).map((item) => (
                                          <option key={item.id} value={item.id}>
                                            {item.assetType} ({item.defaultQty})
                                          </option>
                                        ))}
                                      </optgroup>
                                    ))}
                                  </select>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                                  <div className="sm:col-span-6">
                                    <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                                      Asset / Item Description <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      required
                                      value={b.assetName}
                                      onChange={(e) => updateViaBeneficiary(b.id, "assetName", e.target.value)}
                                      placeholder="e.g. Battery Electric Cargo Auto-Van / Dairy Cow"
                                      className="w-full h-9 px-3 rounded-lg border border-indigo-200 dark:border-indigo-900/50 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-indigo-600 shadow-xs"
                                    />
                                  </div>

                                  <div className="sm:col-span-3">
                                    <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                                      Quantity / Unit
                                    </label>
                                    <input
                                      type="text"
                                      value={b.assetQty}
                                      onChange={(e) => updateViaBeneficiary(b.id, "assetQty", e.target.value)}
                                      placeholder="e.g. 1 Unit / 2 Goats"
                                      className="w-full h-9 px-3 rounded-lg border border-indigo-200 dark:border-indigo-900/50 bg-white dark:bg-slate-900 text-xs outline-none focus:border-indigo-600 shadow-xs"
                                    />
                                  </div>

                                  <div className="sm:col-span-3">
                                    <label className="text-[10px] font-bold text-emerald-700 uppercase block mb-1">
                                      Asset Cost / Amount (BDT ৳) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">৳</span>
                                      <input
                                        type="number"
                                        required
                                        value={b.amount}
                                        onChange={(e) => updateViaBeneficiary(b.id, "amount", e.target.value)}
                                        placeholder="e.g. 25000"
                                        className="w-full h-9 pl-6 pr-2 rounded-lg border border-emerald-300 bg-emerald-50/20 text-xs font-bold font-mono outline-none focus:border-emerald-600 shadow-xs"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total Summary */}
                    <div className="flex items-center justify-between p-3 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl text-xs font-medium text-blue-900 dark:text-blue-200">
                      <span>Total Beneficiaries: <b>{viaBeneficiaries.length}</b></span>
                      <span>Combined Amount: <b className="text-emerald-700 dark:text-emerald-300 font-mono text-sm">৳ {totalViaAmount.toLocaleString()}</b></span>
                    </div>
                  </div>
                </div>
              )}


              {/* Conditional Global Physical Asset Fields (for Direct single disbursements with MULTIPLE ITEMS support) */}
              {modalMode === "Asset Purchased" && modalChannel !== "Via Employee Agent" && (
                <div className="p-4.5 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-200 dark:border-indigo-900/50 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100 dark:border-indigo-900/40 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-indigo-600 text-white rounded-lg shadow-2xs">
                        <ShoppingBag className="size-4" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-wide flex items-center gap-2">
                          <span>Physical Asset Purchase Details</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 lowercase">
                            {directAssetItems.length} {directAssetItems.length === 1 ? "item" : "items"}
                          </span>
                        </span>
                        <p className="text-[10.5px] text-indigo-700/80 dark:text-indigo-300">
                          Add multiple items with individual quantity and purchase amount.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <Link
                        to="/zakat-asset-master"
                        target="_blank"
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold hover:underline flex items-center gap-1"
                      >
                        <span>Manage Master Catalog</span>
                        <ExternalLink className="size-3" />
                      </Link>
                    </div>
                  </div>

                  {/* Multiple Items List */}
                  <div className="space-y-3">
                    {directAssetItems.map((item, idx) => (
                      <div
                        key={item.id}
                        className="p-3.5 bg-white dark:bg-slate-900/90 rounded-xl border border-indigo-200/90 dark:border-indigo-900/60 shadow-2xs space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black text-indigo-950 dark:text-indigo-300 flex items-center gap-2">
                            <span className="size-5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 text-[10px] flex items-center justify-center font-mono font-bold">
                              #{idx + 1}
                            </span>
                            <span>Asset / In-Kind Item #{idx + 1}</span>
                          </span>
                          {directAssetItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeDirectAssetItem(item.id)}
                              className="text-slate-400 hover:text-rose-500 p-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Optional Quick Catalog Select */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase block mb-1">
                            Choose from Catalog (Optional Quick-Fill)
                          </label>
                          <select
                            value={item.assetMasterId}
                            onChange={(e) => updateDirectAssetItem(item.id, "assetMasterId", e.target.value)}
                            className="w-full h-8.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950 text-xs font-medium outline-none focus:border-indigo-600"
                          >
                            <option value="">-- Choose Asset from Master Data (or enter custom title below) --</option>
                            {Array.from(new Set(getActiveAssetMasterList().map((m) => m.category))).map((cat) => (
                              <optgroup key={cat} label={cat}>
                                {getActiveAssetMasterList()
                                  .filter((m) => m.category === cat)
                                  .map((mItem) => (
                                    <option key={mItem.id} value={mItem.id}>
                                      {mItem.assetType} ({mItem.defaultQty})
                                    </option>
                                  ))}
                              </optgroup>
                            ))}
                          </select>
                        </div>

                        {/* Item Description, Quantity, and Amount in 3 columns */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                          <div className="sm:col-span-6">
                            <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">
                              Asset / Item Description <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={item.assetName}
                              onChange={(e) => updateDirectAssetItem(item.id, "assetName", e.target.value)}
                              placeholder="e.g. Battery Electric Cargo Auto-Van / 2 Dairy Breeding Goats"
                              className="w-full h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-indigo-600"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">
                              Quantity / Unit <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={item.assetQty}
                              onChange={(e) => updateDirectAssetItem(item.id, "assetQty", e.target.value)}
                              placeholder="e.g. 1 Unit / 2 Goats"
                              className="w-full h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:border-indigo-600"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase block mb-1">
                              Item Amount (BDT ৳) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-600 font-bold text-xs">
                                ৳
                              </span>
                              <input
                                type="number"
                                min="1"
                                step="any"
                                required
                                value={item.amount}
                                onChange={(e) => updateDirectAssetItem(item.id, "amount", e.target.value)}
                                placeholder="e.g. 25000"
                                className="w-full h-9 pl-6 pr-2 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/20 text-xs font-bold font-mono outline-none focus:border-emerald-600 shadow-2xs"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Item Button & Subtotal Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <button
                      type="button"
                      onClick={addDirectAssetItem}
                      className="px-3.5 py-1.5 rounded-lg border border-indigo-300 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="size-3.5" />
                      <span>+ Add Another Asset / Item</span>
                    </button>

                    <div className="flex items-center gap-2.5 text-xs bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 self-end sm:self-auto">
                      <span className="text-slate-500 font-medium">Combined Asset Cost:</span>
                      <span className="font-mono font-black text-sm text-emerald-700 dark:text-emerald-400">
                        ৳ {totalDirectAssetsAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

                {/* 3. Purpose Category */}
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1 whitespace-nowrap">
                    <span>3. Purpose Category</span> <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newPurposeCategory}
                    onChange={(e) => setNewPurposeCategory(e.target.value as ZakatPurposeCategory)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 outline-none focus:border-emerald-600 shadow-xs"
                  >
                    <option value="Mosque/Madrasa">Mosque / Madrasa (Islamic Education & Reconstruction)</option>
                    <option value="Medical Treatment">Medical Treatment (Healthcare, Surgery & Specialized Medicine)</option>
                    <option value="Vehicle">Vehicle / Van (Electric Auto-Van, Rickshaw, Cargo Van)</option>
                    <option value="Farm Animal">Farm Animal (Dairy Cow, Goat Pair, Poultry Kit)</option>
                    <option value="Business Setup">Business Setup (Tea Stall, Grocery Lot, Sewing Machine)</option>
                    <option value="Others">Others (Custom Relief / Hardship / Education)</option>
                  </select>

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
                <div
                  className={`grid grid-cols-1 ${
                    modalFundType === "Zakat" ? "md:grid-cols-3" : "md:grid-cols-2"
                  } gap-4 p-5 bg-slate-50/90 rounded-2xl border border-slate-200 items-start`}
                >
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1 whitespace-nowrap">
                      <span>Disbursement Amount (BDT ৳)</span>
                      <span className="text-red-500">*</span>
                    </label>
                    {modalChannel === "Via Employee Agent" ? (
                      <div className="space-y-1">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 font-bold text-sm">৳</span>
                          <input
                            type="text"
                            readOnly
                            value={totalViaAmount > 0 ? totalViaAmount.toLocaleString() : ""}
                            placeholder="Enter amounts in recipients above"
                            className="w-full h-10 pl-7 pr-3 rounded-lg border border-emerald-300 bg-emerald-50/40 text-sm font-bold font-mono outline-none text-emerald-900 shadow-xs cursor-default"
                          />
                        </div>
                        <div className="text-[10px] text-emerald-700 font-medium">
                          Auto-summed from {viaBeneficiaries.length} recipient amount{viaBeneficiaries.length > 1 ? "s" : ""} above
                        </div>
                      </div>
                    ) : modalMode === "Asset Purchased" ? (
                      <div className="space-y-1">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 font-bold text-sm">৳</span>
                          <input
                            type="text"
                            readOnly
                            value={totalDirectAssetsAmount > 0 ? totalDirectAssetsAmount.toLocaleString() : ""}
                            placeholder="Auto-calculated from items above"
                            className="w-full h-10 pl-7 pr-3 rounded-lg border border-emerald-300 bg-emerald-50/40 text-sm font-bold font-mono outline-none text-emerald-900 shadow-xs cursor-default"
                          />
                        </div>
                        <div className="text-[10px] text-emerald-700 font-medium flex items-center justify-between">
                          <span>Auto-calculated from {directAssetItems.length} item{directAssetItems.length > 1 ? "s" : ""} above</span>
                          <span className="font-mono font-bold">৳ {totalDirectAssetsAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>

                  {/* STRICT RULE: Asnaf ONLY for Zakat, completely omitted for Financial Aid! */}
                  {modalFundType === "Zakat" && (
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
                    </div>
                  )}

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
                  </div>
                </div>

                {/* 5. Supporting Attachments & Documents */}
                <div className="p-5 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between gap-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5 whitespace-nowrap">
                      <Paperclip className="size-3.5 text-blue-600" />
                      <span>5. Supporting Attachments & Verification Documents (Optional)</span>
                    </label>
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
                  Remaining Pool Balance: <span className="text-emerald-700 font-black font-mono ml-1 text-sm">৳ {Math.max(0, 325000 - stats.totalCombinedAmount).toLocaleString()}</span>
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
      {/* 8. RECURRING SCHEDULE MODAL                               */}
      {/* ========================================================= */}
      {isRecurringModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col my-6 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-600 text-white size-10 rounded-xl flex items-center justify-center shadow-xs">
                  <Repeat className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {recFundType === "Zakat"
                      ? "Setup Recurring Zakat Stipend & Advance Grant"
                      : "Setup Recurring Financial Aid Stipend & Schedule"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure monthly stipend schedule or 1-year advance grant
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRecurringModalOpen(false)}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRecurring} className="flex flex-col">
              <div className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
                {/* SECTION 1: BENEFICIARY & MANDATE DETAILS */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <span className="size-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center">1</span>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Beneficiary Information</h4>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Title / Purpose Description <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={recTitle}
                      onChange={(e) => setRecTitle(e.target.value)}
                      placeholder="e.g. Monthly Medical Allowance / Tuition Support"
                      className="w-full h-9.5 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Beneficiary Channel <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={recChannel}
                        onChange={(e) => setRecChannel(e.target.value as any)}
                        className="w-full h-9.5 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all cursor-pointer"
                      >
                        <option value="Direct Employee">Direct Employee</option>
                        <option value="Via Employee Agent">Via Staff Agent (Village Handover)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Purpose Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={recPurposeCategory}
                        onChange={(e) => setRecPurposeCategory(e.target.value as any)}
                        className="w-full h-9.5 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all cursor-pointer"
                      >
                        <option value="Medical Treatment">Medical Treatment</option>
                        <option value="Mosque/Madrasa">Mosque / Madrasa</option>
                        <option value="Business Setup">Business Setup</option>
                        <option value="Farm Animal">Farm Animal</option>
                        <option value="Vehicle">Vehicle</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                  </div>

                  {recPurposeCategory === "Others" && (
                    <div className="animate-in fade-in">
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Specify Custom Purpose <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={recOtherPurpose}
                        onChange={(e) => setRecOtherPurpose(e.target.value)}
                        placeholder="e.g. Higher Education Assistance / Blanket Distribution"
                        className="w-full h-9.5 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none focus:border-emerald-600"
                      />
                    </div>
                  )}

                  {/* Beneficiary Details by Channel */}
                  {recChannel === "Direct Employee" ? (
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Select Employee <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newEmpId}
                        onChange={(e) => {
                          setNewEmpId(e.target.value);
                          const emp = availableEmployees.find((em) => em.id === e.target.value);
                          if (emp) setNewEmpName(emp.name);
                        }}
                        className="w-full h-9.5 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 outline-none focus:border-emerald-600 cursor-pointer"
                      >
                        <option value="">-- Choose Employee --</option>
                        {availableEmployees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name} ({emp.id}) &middot; {emp.dept}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50/70 rounded-xl border border-slate-200">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase">
                          Staff Agent <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={newEmpId}
                          onChange={(e) => {
                            setNewEmpId(e.target.value);
                            const emp = availableEmployees.find((em) => em.id === e.target.value);
                            if (emp) setNewEmpName(emp.name);
                          }}
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 outline-none focus:border-emerald-600"
                        >
                          <option value="">-- Choose Staff Agent --</option>
                          {availableEmployees.map((emp) => (
                            <option key={emp.id} value={emp.id}>
                              {emp.name} ({emp.dept})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase">
                          Recipient Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={recBeneficiaryName}
                          onChange={(e) => setRecBeneficiaryName(e.target.value)}
                          placeholder="e.g. Fatema Begum"
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={recBeneficiaryPhone}
                          onChange={(e) => setRecBeneficiaryPhone(e.target.value)}
                          placeholder="e.g. 01712-345678"
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase">
                          Address / Village
                        </label>
                        <input
                          type="text"
                          value={recBeneficiaryAddress}
                          onChange={(e) => setRecBeneficiaryAddress(e.target.value)}
                          placeholder="e.g. Bhaluka, Mymensingh"
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* SECTION 2: DISBURSEMENT & SCHEDULE */}
                <div className="space-y-4 pt-1">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <span className="size-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center">2</span>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Disbursement & Cadence</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Disbursement Mode <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={recMode}
                        onChange={(e) => setRecMode(e.target.value as any)}
                        className="w-full h-9.5 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none focus:border-emerald-600 cursor-pointer"
                      >
                        <option value="Cash Grant">Cash / Bank Transfer</option>
                        <option value="Asset Purchased">In-Kind Asset</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Settlement Mode <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={recSettlementType}
                        onChange={(e) => {
                          const val = e.target.value as DisbursementSettlementType;
                          setRecSettlementType(val);
                          if (val === "1-Year Full Advance") {
                            setRecCadence("Annual Lump Sum");
                            setRecDurationMonths("12");
                          } else {
                            setRecCadence("Monthly");
                          }
                        }}
                        className="w-full h-9.5 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none focus:border-emerald-600 cursor-pointer"
                      >
                        <option value="Periodic Installments">Periodic Schedule</option>
                        <option value="1-Year Full Advance">1-Year Advance</option>
                      </select>
                    </div>
                  </div>

                  {/* Schedule Details */}
                  {recSettlementType === "Periodic Installments" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Cadence <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={recCadence}
                          onChange={(e) => {
<<<<<<< HEAD
                            const val = e.target.value as DisbursementCadence;
                            setRecCadence(val);
                            if (val === "Annual Lump Sum") {
                              setRecDurationMonths("1");
                            } else if (recDurationMonths === "1" || recDurationMonths === "5" || recDurationMonths === "10") {
                              setRecDurationMonths("12");
=======
                            const nextCadence = e.target.value as DisbursementCadence;
                            setRecCadence(nextCadence);
                            const cfg = CADENCE_CONFIG[nextCadence] || CADENCE_CONFIG.Monthly;
                            const validValues = cfg.durationOptions.map((opt) => opt.value);
                            if (!validValues.includes(recDurationMonths)) {
                              setRecDurationMonths(cfg.defaultDuration);
>>>>>>> 3ad051e767a7cb43da165e4af4a200c038237ff0
                            }
                          }}
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none focus:border-emerald-600 cursor-pointer"
                        >
                          <option value="Monthly">Monthly</option>
                          <option value="Quarterly">Quarterly</option>
                          <option value="Bi-Annual">Bi-Annual</option>
                          <option value="Annual Lump Sum">Annual</option>
                        </select>
                      </div>

<<<<<<< HEAD
                      {recCadence === "Annual Lump Sum" ? (
                        <div>
                          <label className="text-xs font-semibold text-slate-700 block mb-1">
                            Disbursement Date
                          </label>
                          <input
                            type="date"
                            value={recStartDate}
                            onChange={(e) => {
                              setRecStartDate(e.target.value);
                              setRecDisbursementDay(e.target.value);
                            }}
                            className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none focus:border-emerald-600"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="text-xs font-semibold text-slate-700 block mb-1">
                            Disbursement Day
                          </label>
                          <select
                            value={recDisbursementDay}
                            onChange={(e) => setRecDisbursementDay(e.target.value)}
                            className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none focus:border-emerald-600 cursor-pointer"
                          >
                            <option value="1">1st of Month</option>
                            <option value="5">5th of Month</option>
                            <option value="10">10th of Month</option>
                            <option value="15">15th of Month</option>
                          </select>
                        </div>
                      )}
=======
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Disbursement Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={recStartDate}
                          onChange={(e) => {
                            const val = e.target.value;
                            setRecStartDate(val);
                            if (val) {
                              const parts = val.split("-");
                              const d = parts.length === 3 ? parseInt(parts[2], 10) : new Date(val).getDate();
                              if (!isNaN(d)) setRecDisbursementDay(d.toString());
                            }
                          }}
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none focus:border-emerald-600"
                        />
                        <span className="text-[10px] text-slate-500 mt-0.5 block font-medium">
                          Day #{recDisbursementDay || 1} • Repeats {CADENCE_CONFIG[recCadence]?.label.toLowerCase() || "monthly"}
                        </span>
                      </div>
>>>>>>> 3ad051e767a7cb43da165e4af4a200c038237ff0

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Duration ({CADENCE_CONFIG[recCadence]?.periodUnit}s)
                        </label>
<<<<<<< HEAD
                        {recCadence === "Annual Lump Sum" ? (
                          <select
                            value={recDurationMonths === "12" ? "1" : recDurationMonths}
                            onChange={(e) => setRecDurationMonths(e.target.value)}
                            className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none focus:border-emerald-600 cursor-pointer"
                          >
                            <option value="1">1 year</option>
                            <option value="5">5 year</option>
                            <option value="10">10 year</option>
                            <option value="0">Indefinite</option>
                          </select>
                        ) : (
                          <select
                            value={recDurationMonths === "1" ? "12" : recDurationMonths}
                            onChange={(e) => setRecDurationMonths(e.target.value)}
                            className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none focus:border-emerald-600 cursor-pointer"
                          >
                            <option value="6">6 Months</option>
                            <option value="12">12 Months (1 Year)</option>
                            <option value="24">24 Months (2 Years)</option>
                            <option value="0">Indefinite</option>
                          </select>
                        )}
=======
                        <select
                          value={recDurationMonths}
                          onChange={(e) => setRecDurationMonths(e.target.value)}
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none focus:border-emerald-600 cursor-pointer"
                        >
                          {(CADENCE_CONFIG[recCadence]?.durationOptions || CADENCE_CONFIG.Monthly.durationOptions).map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
>>>>>>> 3ad051e767a7cb43da165e4af4a200c038237ff0
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Advance Duration
                        </label>
                        <select
                          value={recDurationMonths}
                          onChange={(e) => setRecDurationMonths(e.target.value)}
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none focus:border-emerald-600 cursor-pointer"
                        >
                          <option value="12">12 Months (1 Year)</option>
                          <option value="6">6 Months</option>
                          <option value="24">24 Months</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Disbursement Date
                        </label>
                        <input
                          type="date"
                          value={recStartDate}
                          onChange={(e) => setRecStartDate(e.target.value)}
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>
                  )}

                  {/* If In-Kind Asset: Catalog Selector */}
                  {recMode === "Asset Purchased" && (
                    <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3 animate-in fade-in">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <ShoppingBag className="size-3.5 text-emerald-600" />
                        <span>Asset Details</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="sm:col-span-2 lg:col-span-3">
                          <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase">
                            Master Asset Catalog
                          </label>
                          <select
                            value={recAssetMasterId}
                            onChange={(e) => {
                              const chosenId = e.target.value;
                              setRecAssetMasterId(chosenId);
                              const found = getActiveAssetMasterList().find((item) => item.id === chosenId);
                              if (found) {
                                setRecAssetType(found.assetType);
                                setRecAssetName(found.assetType);
                                if (found.defaultQty) setRecAssetQty(found.defaultQty);
                                if (found.suggestedPurpose) setRecPurposeCategory(found.suggestedPurpose);
                              }
                            }}
                            className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none focus:border-emerald-600"
                          >
                            <option value="">-- Choose Standard Asset from Catalog --</option>
                            {Array.from(new Set(getActiveAssetMasterList().map((m) => m.category))).map((cat) => (
                              <optgroup key={cat} label={cat}>
                                {getActiveAssetMasterList().filter((a) => a.category === cat).map((a) => (
                                  <option key={a.id} value={a.id}>{a.assetType}</option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase">
                            Asset Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={recAssetName}
                            onChange={(e) => setRecAssetName(e.target.value)}
                            placeholder="e.g. Easy Bike / Milch Cow"
                            className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none focus:border-emerald-600"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase">
                            Quantity
                          </label>
                          <input
                            type="text"
                            value={recAssetQty}
                            onChange={(e) => setRecAssetQty(e.target.value)}
                            placeholder="e.g. 1 Unit / 2 Goats"
                            className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 outline-none focus:border-emerald-600"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase">
                            Vendor / Location
                          </label>
                          <input
                            type="text"
                            value={recAssetVendor}
                            onChange={(e) => setRecAssetVendor(e.target.value)}
                            placeholder="e.g. Bhaluka Bazar"
                            className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 outline-none focus:border-emerald-600"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Amount with Clean Dynamic Cadence Presets */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700">
                        {CADENCE_CONFIG[recCadence]?.amountLabel || "Monthly Amount (৳)"} <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-1">
                        {(CADENCE_CONFIG[recCadence]?.presets || CADENCE_CONFIG.Monthly.presets).map((amt) => (
                          <button
                            type="button"
                            key={amt}
                            onClick={() => setRecMonthlyAmount(amt.toString())}
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                              recMonthlyAmount === amt.toString()
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                            }`}
                          >
                            ৳{amt.toLocaleString()}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">৳</span>
                      <input
                        type="number"
                        required
                        value={recMonthlyAmount}
                        onChange={(e) => setRecMonthlyAmount(e.target.value)}
                        placeholder={CADENCE_CONFIG[recCadence]?.amountPlaceholder || "Enter amount (e.g. 10000)"}
                        className="w-full h-9.5 pl-8 pr-3 rounded-lg border border-slate-300 bg-white text-sm font-bold font-mono text-slate-900 outline-none focus:border-emerald-600 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 3: PAYMENT & REMARKS */}
                <div className="space-y-4 pt-1">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <span className="size-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center">3</span>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Payment & Governance</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Payment Method <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={recPaymentMethod}
                        onChange={(e) => setRecPaymentMethod(e.target.value as any)}
                        className="w-full h-9.5 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 outline-none focus:border-emerald-600 cursor-pointer"
                      >
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Mobile Financial Service">Mobile Banking (bKash / Nagad)</option>
                        <option value="Cash Handover">Cash</option>
                        <option value="In-Kind Delivery">In-Kind Delivery</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Account / Mobile / Cheque No
                      </label>
                      <input
                        type="text"
                        value={recPaymentAccount}
                        onChange={(e) => setRecPaymentAccount(e.target.value)}
                        placeholder="e.g. A/C: 2050-112233 or bKash: 01711-223344"
                        className="w-full h-9.5 px-3 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  {/* ASNAF CATEGORY: Only for Zakat! Omitted for Financial Aid */}
                  {recFundType === "Zakat" ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Asnaf Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={recAsnaf}
                          onChange={(e) => setRecAsnaf(e.target.value as any)}
                          className="w-full h-9.5 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 outline-none focus:border-emerald-600 cursor-pointer"
                        >
                          <option value="Al-Masakin">Al-Masakin (Destitute)</option>
                          <option value="Al-Fuqara">Al-Fuqara (Poor)</option>
                          <option value="Fi Sabilillah">Fi Sabilillah</option>
                          <option value="Al-Gharimin">Al-Gharimin (Debtors)</option>
                          <option value="Ibnus-Sabil">Ibnus-Sabil (Travelers)</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Remarks / Justification
                        </label>
                        <input
                          type="text"
                          value={recDescription}
                          onChange={(e) => setRecDescription(e.target.value)}
                          placeholder="e.g. Approved continuous medical stipend for chemotherapy"
                          className="w-full h-9.5 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Remarks / Justification
                      </label>
                      <input
                        type="text"
                        value={recDescription}
                        onChange={(e) => setRecDescription(e.target.value)}
                        placeholder="e.g. Approved continuous medical stipend / living allowance"
                        className="w-full h-9.5 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none focus:border-emerald-600"
                      />
                    </div>
                  )}

                  {/* Attachments - Compact & Clean */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50/70 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2">
                      <Paperclip className="size-4 text-slate-500" />
                      <span className="text-xs font-semibold text-slate-700">Supporting Attachments</span>
                      <span className="text-[10px] text-slate-400 font-medium">(PDF, PNG, JPG)</span>
                    </div>

                    <label className="h-8 px-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0">
                      <Upload className="size-3.5 text-slate-500" />
                      <span>Attach Files</span>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xlsx"
                        onChange={(e) => handleFileUpload(e, "recurring")}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {recAttachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {recAttachments.map((file) => (
                        <div
                          key={file.id}
                          className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-xs flex items-center gap-2 shadow-2xs"
                        >
                          <FileText className="size-3 text-emerald-600" />
                          <span className="font-medium text-slate-700 max-w-[140px] truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeAttachment(file.id, "recurring")}
                            className="text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* SUMMARY STATS BAR */}
                {(() => {
                  const installments = calculateInstallmentCount(recCadence, recDurationMonths);
                  const installmentAmt = parseFloat(recMonthlyAmount) || 0;
                  const totalCommitmentAmt = installmentAmt * installments;
                  const isIndefinite = recDurationMonths === "0";
                  return (
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-700">
                        <Sparkles className="size-4 text-emerald-600" />
                        <span>Summary</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-5">
                        <div>
                          <span className="text-slate-400 text-[11px] block">Rate / Cadence</span>
                          <span className="font-bold font-mono text-slate-800">
                            ৳{installmentAmt.toLocaleString()}
                            <span className="font-sans font-normal text-slate-500 text-[11px]">
                              {" "}
                              {CADENCE_CONFIG[recCadence]?.rateSuffix || "/ mo"}
                            </span>
                          </span>
                        </div>

<<<<<<< HEAD
                    <div>
                      <span className="text-slate-400 text-[11px] block">Duration</span>
                      <span className="font-bold text-slate-800">
                        {recDurationMonths === "0"
                          ? "Indefinite"
                          : recCadence === "Annual Lump Sum"
                            ? `${recDurationMonths === "12" ? "1" : recDurationMonths} Year${recDurationMonths === "1" || recDurationMonths === "12" ? "" : "s"}`
                            : `${recDurationMonths} Mos`}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] block">Total Commitment</span>
                      <span className="font-bold font-mono text-emerald-700 text-sm">
                        ৳{(
                          (parseFloat(recMonthlyAmount) || 0) *
                          (recCadence === "Annual Lump Sum"
                            ? (recDurationMonths === "0" ? 1 : (parseInt(recDurationMonths === "12" ? "1" : recDurationMonths) || 1))
                            : (recDurationMonths === "0" ? 1 : (parseInt(recDurationMonths) || 12)))
                        ).toLocaleString()}
                      </span>
                    </div>
=======
                        <div>
                          <span className="text-slate-400 text-[11px] block">Duration</span>
                          <span className="font-bold text-slate-800">
                            {isIndefinite ? "Indefinite" : `${recDurationMonths} Mos`}
                            <span className="font-sans font-normal text-slate-500 text-[11px] ml-1">
                              ({installments} {installments === 1 ? "inst." : "installments"})
                            </span>
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 text-[11px] block">
                            {isIndefinite ? "Est. Annual Commitment" : "Total Commitment"}
                          </span>
                          <span className="font-bold font-mono text-emerald-700 text-sm">
                            ৳{totalCommitmentAmt.toLocaleString()}
                          </span>
                        </div>
>>>>>>> 3ad051e767a7cb43da165e4af4a200c038237ff0

                        <div>
                          <span className="text-slate-400 text-[11px] block">Remaining Pool</span>
                          <span className="font-bold font-mono text-slate-800">
                            ৳{Math.max(
                              0,
                              (325000 - stats.totalCombinedAmount) -
                              (recSettlementType === "1-Year Full Advance"
                                ? totalCommitmentAmt
                                : 0)
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
                <div className="text-xs font-semibold text-slate-600">
                  {recDurationMonths === "0" ? "Est. Annual Grant:" : "Total Grant:"}{" "}
                  <span className="font-mono font-bold text-sm text-slate-900 ml-1">
                    ৳{(
                      (parseFloat(recMonthlyAmount) || 0) *
<<<<<<< HEAD
                      (recCadence === "Annual Lump Sum"
                        ? (recDurationMonths === "0" ? 1 : (parseInt(recDurationMonths === "12" ? "1" : recDurationMonths) || 1))
                        : (recDurationMonths === "0" ? 1 : (parseInt(recDurationMonths) || 12)))
                    ).toLocaleString()}
=======
                      calculateInstallmentCount(recCadence, recDurationMonths)
                    ).toLocaleString()}
                  </span>
                  <span className="text-slate-400 text-[11px] ml-1.5 font-normal">
                    ({calculateInstallmentCount(recCadence, recDurationMonths)} × ৳{(parseFloat(recMonthlyAmount) || 0).toLocaleString()})
>>>>>>> 3ad051e767a7cb43da165e4af4a200c038237ff0
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsRecurringModalOpen(false)}
                    className="h-9 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-9 px-5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors cursor-pointer"
                  >
                    Save & Activate Schedule
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 9. VIEW DOSSIER MODAL                                     */}
      {/* ========================================================= */}
      {viewRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto animate-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div
                  className={`size-10 rounded-xl flex items-center justify-center font-black ${
                    viewRecord.fundType === "Zakat"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {viewRecord.fundType === "Zakat" ? <ShieldCheck className="size-5" /> : <Banknote className="size-5" />}
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Disbursement Dossier
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {viewRecord.id} &bull; {viewRecord.fundType}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewRecord(null)}
                className="size-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div>
                  <span className="text-[9px] font-bold uppercase text-slate-400 block">Amount</span>
                  <span className="font-mono text-base font-black text-slate-900 dark:text-white">
                    ৳ {viewRecord.amount.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase text-slate-400 block">Channel</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {viewRecord.disbursementChannel}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase text-slate-400 block">Mode</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {viewRecord.disbursementMode}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase text-slate-400 block">Status</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    {viewRecord.agencyStatus}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Beneficiary</span>
                  {viewRecord.batchRecipientInfo && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      <Users className="size-3" />
                      {viewRecord.batchRecipientInfo} {viewRecord.batchDriveTitle ? `• ${viewRecord.batchDriveTitle}` : ""}
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {viewRecord.beneficiaryName}
                </div>
                {viewRecord.disbursementChannel === "Via Employee Agent" && viewRecord.employeeName && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                    <Users className="size-3" />
                    <span>Authorized Staff Agent: {viewRecord.employeeName} {viewRecord.employeeDept ? `(${viewRecord.employeeDept} - ${viewRecord.employeeDesignation || ""})` : ""}</span>
                  </div>
                )}
                {viewRecord.beneficiaryPhone && (
                  <div className="text-slate-500 font-mono text-xs">Phone: {viewRecord.beneficiaryPhone}</div>
                )}
                {viewRecord.beneficiaryAddress && (
                  <div className="text-slate-500 text-xs">Address: {viewRecord.beneficiaryAddress}</div>
                )}
              </div>

              {viewRecord.assetDetails && (
                <div className="p-3.5 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-900/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase block">Physical Asset Specs</span>
                    {viewRecord.assetDetails.items && viewRecord.assetDetails.items.length > 1 && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                        {viewRecord.assetDetails.items.length} Items Purchased
                      </span>
                    )}
                  </div>
                  {viewRecord.assetDetails.items && viewRecord.assetDetails.items.length > 0 ? (
                    <div className="space-y-1.5 pt-1">
                      {viewRecord.assetDetails.items.map((it, idx) => (
                        <div key={it.id || idx} className="flex items-center justify-between text-xs bg-white/80 dark:bg-slate-900/60 p-2 rounded-lg border border-indigo-100 dark:border-indigo-900/40">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">{it.assetName}</span>
                            <span className="text-slate-500 text-[11px] ml-1.5 font-medium">({it.quantity || "1 Unit"})</span>
                          </div>
                          {it.amount !== undefined && (
                            <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">
                              ৳ {it.amount.toLocaleString()}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {viewRecord.assetDetails.assetName}
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300">
                        Quantity: {viewRecord.assetDetails.assetQuantity || "1 Unit"}
                      </div>
                    </>
                  )}
                </div>
              )}

              {viewRecord.fundType === "Zakat" && viewRecord.asnafCategory && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-900/50 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">Quranic Asnaf Category</span>
                  <div className="font-bold text-emerald-900 dark:text-emerald-300">
                    {viewRecord.asnafCategory}
                  </div>
                </div>
              )}

              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Justification & Notes</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {viewRecord.justificationDetails}
                </p>
              </div>

              {viewRecord.attachments && viewRecord.attachments.length > 0 && (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Attached Documents</span>
                  <div className="space-y-1">
                    {viewRecord.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-between text-xs"
                      >
                        <span className="font-mono text-slate-700 dark:text-slate-300">{att.name}</span>
                        <span className="text-[10px] text-slate-400">{att.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setViewRecord(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-900 cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
