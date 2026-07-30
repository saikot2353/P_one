import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import MerchandisingLayout from "../components/merchandising/MerchandisingLayout";

// ── Costing Configuration Types & Initial Data ──────────────────────────────
interface CostingConfig {
  id: string;
  setupDate: string;
  year: number;
  month: string;
  cmExpense: number;
  noOfResource: number;
  workingHour: number;
  workingDay: number;
  cpm: number;
  appliedCpm: number;
  currency: string;
  status: "Active" | "Inactive";
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const initialCostingConfigs: CostingConfig[] = [
  { id: "cc-1", setupDate: "03/03/2025", year: 2025, month: "October",  cmExpense: 80000000, noOfResource: 12000, workingHour: 10, workingDay: 26, cpm: 0.4274, appliedCpm: 0.0450, currency: "USD", status: "Active" },
  { id: "cc-2", setupDate: "23/12/2025", year: 2025, month: "December", cmExpense: 80000000, noOfResource: 12000, workingHour: 10, workingDay: 25, cpm: 0.4444, appliedCpm: 0.0450, currency: "USD", status: "Active" },
  { id: "cc-3", setupDate: "23/12/2025", year: 2025, month: "November", cmExpense: 80000000, noOfResource: 12000, workingHour: 10, workingDay: 25, cpm: 0.4444, appliedCpm: 0.0450, currency: "USD", status: "Active" },
  { id: "cc-4", setupDate: "01/01/2026", year: 2026, month: "June",    cmExpense: 80000000, noOfResource: 12000, workingHour: 10, workingDay: 26, cpm: 0.4274, appliedCpm: 0.0450, currency: "USD", status: "Active" },
  { id: "cc-5", setupDate: "17/02/2026", year: 2026, month: "May",     cmExpense: 86875741, noOfResource: 1684,  workingHour:  8, workingDay: 19, cpm: 5.6567, appliedCpm: 0.0389, currency: "USD", status: "Active" },
];

// ── Payment Terms Types & Initial Data ────────────────────────────────────
interface PaymentTerm {
  id: string;
  shortName: string;
  status: "Active" | "Inactive";
}

const initialPaymentTerms: PaymentTerm[] = [
  { id: "pt-1",  shortName: "120 Days BBLC",  status: "Active" },
  { id: "pt-2",  shortName: "180 Days BBLC",  status: "Active" },
  { id: "pt-3",  shortName: "30 Days BBLC",   status: "Active" },
  { id: "pt-4",  shortName: "60 Days BBLC",   status: "Active" },
  { id: "pt-5",  shortName: "90 Days BBLC",   status: "Active" },
  { id: "pt-6",  shortName: "At Sight",        status: "Active" },
  { id: "pt-7",  shortName: "Cash",            status: "Active" },
  { id: "pt-8",  shortName: "FOD",             status: "Active" },
  { id: "pt-9",  shortName: "Others",          status: "Active" },
  { id: "pt-10", shortName: "TT",              status: "Active" },
];

// ── Buying House Types & Initial Data ─────────────────────────────────
interface BuyingHouse {
  id: string;
  shortName: string;
  fullName: string;
  contactPerson: string;
  address: string;
  phone: string;
  email: string;
  fax: string;
  status: "Active" | "Inactive";
}

const initialBuyingHouses: BuyingHouse[] = [
  { id: "bh-1", shortName: "ITPS",      fullName: "ITPS",       contactPerson: "",      address: "",                     phone: "",            email: "",               fax: "", status: "Active" },
  { id: "bh-2", shortName: "JMS Buyer", fullName: "JMS Buyer",  contactPerson: "",      address: "",                     phone: "",            email: "",               fax: "", status: "Active" },
  { id: "bh-3", shortName: "KLD",       fullName: "KL Design",  contactPerson: "--",    address: "Banchara",             phone: "",            email: "",               fax: "", status: "Active" },
  { id: "bh-4", shortName: "PFD",       fullName: "PFD",        contactPerson: "Mamun", address: "Khan ABC Trade place.", phone: "01833504887", email: "qwer@gmail.com", fax: "", status: "Active" },
];

// ── Buyer Brand Types & Initial Data ──────────────────────────────────────
interface BuyerWiseBrand {
  id: string;
  buyerName: string;
  brand: string;
  status: "Active" | "Inactive";
}

const initialBuyerWiseBrands: BuyerWiseBrand[] = [
  { id: "bwb-1", buyerName: "A-M-London Fashion Ltd", brand: "ASOS", status: "Active" },
  { id: "bwb-2", buyerName: "ARDENE", brand: "ARDENE", status: "Active" },
  { id: "bwb-3", buyerName: "JMS", brand: "JMS Brand", status: "Active" },
  { id: "bwb-4", buyerName: "MOUNTAIN WAREHOUSE LTD.", brand: "ANIMAL", status: "Active" },
  { id: "bwb-5", buyerName: "Next", brand: "Next", status: "Active" },
];

// ── Buying Agent Types & Initial Data ─────────────────────────────────────
interface BuyingAgent {
  id: string;
  shortName: string;
  fullName: string;
  address: string;
  phone: string;
  email: string;
  fax: string;
  status: "Active" | "Inactive";
}

const initialBuyingAgents: BuyingAgent[] = [
  { id: "ba-1", shortName: "JMS Buyer Agent", fullName: "JMS Buyer Agent", address: "", phone: "", email: "", fax: "", status: "Active" },
];

// ── Item Department Types & Initial Data ─────────────────────────────────
interface ItemDepartment {
  id: string;
  departmentName: string;
  buyerName: string;
  teamName: string;
  status: "Active" | "Inactive";
}

const defaultTeams = [
  "Marketing Team A",
  "Marketing Team B",
  "Merchandising Team Gold",
  "Merchandising Team Silver",
  "RMG Design Crew"
];

const initialItemDepartments: ItemDepartment[] = [
  { id: "idp-1", departmentName: "Adults", buyerName: "", teamName: "", status: "Active" },
  { id: "idp-2", departmentName: "Boys", buyerName: "", teamName: "", status: "Active" },
  { id: "idp-3", departmentName: "Girls", buyerName: "", teamName: "", status: "Active" },
  { id: "idp-4", departmentName: "Kids", buyerName: "", teamName: "", status: "Active" },
  { id: "idp-5", departmentName: "Ladies", buyerName: "", teamName: "", status: "Active" },
  { id: "idp-6", departmentName: "Mens", buyerName: "", teamName: "", status: "Active" },
  { id: "idp-7", departmentName: "Unisex", buyerName: "", teamName: "", status: "Active" },
  { id: "idp-8", departmentName: "Womens", buyerName: "", teamName: "", status: "Active" },
];

// ── Garment Item Types & Initial Data ──────────────────────────────────────
interface GarmentItem {
  id: string;
  itemName: string;
  commercialName: string;
  productType: string;
  standardEfficiency: string;
  smv: string;
  buyerName: string;
  bodyPart: string;
  status: "Active" | "Inactive";
}

const initialGarmentItems: GarmentItem[] = [
  { id: "gmt-1", itemName: "Apron", commercialName: "Apron", productType: "Top", standardEfficiency: "", smv: "", buyerName: "", bodyPart: "", status: "Active" },
  { id: "gmt-2", itemName: "Blouson/Jacket", commercialName: "Fresh Market Blouson", productType: "Top", standardEfficiency: "", smv: "", buyerName: "", bodyPart: "", status: "Active" },
  { id: "gmt-3", itemName: "Boyes Sweat Cardigan", commercialName: "Boyes Sweat Cardigan", productType: "Top", standardEfficiency: "", smv: "", buyerName: "", bodyPart: "", status: "Active" },
  { id: "gmt-4", itemName: "Boyes T-Shirts - Short Sleeves", commercialName: "Boyes T-Shirts - Short Sleeves", productType: "Top", standardEfficiency: "", smv: "", buyerName: "", bodyPart: "", status: "Active" },
  { id: "gmt-5", itemName: "Boy's Short", commercialName: "Boy's Short", productType: "Top", standardEfficiency: "", smv: "", buyerName: "", bodyPart: "", status: "Active" },
  { id: "gmt-6", itemName: "Boys Sweat Cardigan", commercialName: "Boys Sweat Cardigan", productType: "Top", standardEfficiency: "", smv: "", buyerName: "GARCIA", bodyPart: "", status: "Active" },
  { id: "gmt-7", itemName: "Boy's T-Shirt Ls", commercialName: "Boy's T-Shirt Ls", productType: "Top", standardEfficiency: "", smv: "", buyerName: "GARCIA", bodyPart: "", status: "Active" },
  { id: "gmt-8", itemName: "Floral Shirt", commercialName: "Floral Shirt", productType: "", standardEfficiency: "", smv: "", buyerName: "GOR FACTORY SA", bodyPart: "Body", status: "Active" },
  { id: "gmt-9", itemName: "Girl's Short", commercialName: "Girl's Short", productType: "Top", standardEfficiency: "", smv: "", buyerName: "", bodyPart: "", status: "Active" },
  { id: "gmt-10", itemName: "Girls T-Shirt Long Sleeve", commercialName: "Girls T-Shirt LS", productType: "Top", standardEfficiency: "", smv: "", buyerName: "", bodyPart: "", status: "Active" },
  { id: "gmt-11", itemName: "Girl's T-Shirt Ls", commercialName: "Girl's T-Shirt Ls", productType: "Top", standardEfficiency: "", smv: "", buyerName: "GARCIA", bodyPart: "", status: "Active" },
  { id: "gmt-12", itemName: "Hoodie", commercialName: "Hoodie", productType: "Top", standardEfficiency: "", smv: "", buyerName: "", bodyPart: "", status: "Active" },
  { id: "gmt-13", itemName: "Jacket", commercialName: "", productType: "", standardEfficiency: "", smv: "", buyerName: "", bodyPart: "", status: "Active" },
  { id: "gmt-14", itemName: "Jeans Shirt", commercialName: "", productType: "", standardEfficiency: "", smv: "", buyerName: "", bodyPart: "Body", status: "Active" },
  { id: "gmt-15", itemName: "Ladies Knitted S/S V Neck T-Shirt", commercialName: "Ladies Knitted S/S V Neck T-Shirt", productType: "Top", standardEfficiency: "", smv: "", buyerName: "", bodyPart: "Body", status: "Active" },
  { id: "gmt-16", itemName: "Ladies/L Tee Shirt", commercialName: "Ladies/L Tee Shirt", productType: "Top", standardEfficiency: "", smv: "", buyerName: "A-M-London Fashion Ltd", bodyPart: "", status: "Active" },
  { id: "gmt-17", itemName: "Ladis T-Shirt Long Sleeve", commercialName: "Ladis T-Shirt Long Sleeve", productType: "Top", standardEfficiency: "", smv: "", buyerName: "GARCIA", bodyPart: "", status: "Active" },
  { id: "gmt-18", itemName: "Ladis T-Shirt Long Sleeve", commercialName: "Ladis T-Shirt LS", productType: "Top", standardEfficiency: "", smv: "", buyerName: "GARCIA", bodyPart: "", status: "Active" },
  { id: "gmt-19", itemName: "Main Fabric Bottom", commercialName: "", productType: "", standardEfficiency: "", smv: "", buyerName: "", bodyPart: "", status: "Active" },
  { id: "gmt-20", itemName: "Mens Polo Crosswell 3PK", commercialName: "", productType: "Top", standardEfficiency: "", smv: "", buyerName: "A-M-London Fashion Ltd", bodyPart: "", status: "Active" },
];

// ── Body Part Types & Initial Data ──────────────────────────────────────
interface BodyPartSpec {
  id: string;
  name: string;
  shortName: string;
  bodyFor: string;
  nature: string;
  status: "Active" | "Inactive";
}

const initialBodyParts: BodyPartSpec[] = [
  { id: "bp-1", name: "Collar", shortName: "Collar", bodyFor: "Collar", nature: "Production", status: "Active" },
  { id: "bp-2", name: "Long Sleeves", shortName: "", bodyFor: "Others", nature: "Production", status: "Active" },
  { id: "bp-3", name: "Placket", shortName: "Placket", bodyFor: "Others", nature: "Production", status: "Active" },
  { id: "bp-4", name: "Chest", shortName: "Chest", bodyFor: "Bottom", nature: "Production", status: "Active" },
  { id: "bp-5", name: "Sleeve", shortName: "Sleeve", bodyFor: "Bottom", nature: "Production", status: "Active" },
  { id: "bp-6", name: "Front & Back Body Part", shortName: "Main Body", bodyFor: "Body", nature: "", status: "Active" },
  { id: "bp-7", name: "Cuff", shortName: "Cuff", bodyFor: "Cuff", nature: "Production", status: "Active" },
  { id: "bp-8", name: "Main Body", shortName: "Main Body", bodyFor: "Body", nature: "Production", status: "Active" },
  { id: "bp-9", name: "Body", shortName: "Contrast Body Part", bodyFor: "Body", nature: "Production", status: "Active" },
  { id: "bp-10", name: "Short Sleeves", shortName: "", bodyFor: "Others", nature: "Production", status: "Active" },
  { id: "bp-11", name: "Lining", shortName: "Lining", bodyFor: "", nature: "Cost Head", status: "Active" },
  { id: "bp-12", name: "Zipper Piping", shortName: "", bodyFor: "Top", nature: "", status: "Active" },
  { id: "bp-13", name: "Neck Binding", shortName: "Neck Binding", bodyFor: "Others", nature: "Production", status: "Active" },
  { id: "bp-14", name: "Front Right part", shortName: "", bodyFor: "Bottom", nature: "", status: "Active" },
  { id: "bp-15", name: "Back Top Part", shortName: "", bodyFor: "Top", nature: "Production", status: "Active" },
  { id: "bp-16", name: "Non-Cuff", shortName: "Non-cuff", bodyFor: "FlatKnit", nature: "Production", status: "Active" },
  { id: "bp-17", name: "Rib", shortName: "Rib", bodyFor: "RIB", nature: "Production", status: "Active" },
  { id: "bp-18", name: "Main Fabric Top", shortName: "Main Fabric Top", bodyFor: "Top", nature: "Production", status: "Active" },
  { id: "bp-19", name: "Body Front Part", shortName: "", bodyFor: "Body", nature: "Cost Head", status: "Active" },
  { id: "bp-20", name: "Shell", shortName: "Shell", bodyFor: "Body", nature: "Cost Head", status: "Active" },
  { id: "bp-21", name: "Aplick part", shortName: "Aplick part", bodyFor: "Body", nature: "Production", status: "Active" },
  { id: "bp-22", name: "Neck Tape", shortName: "", bodyFor: "Others", nature: "", status: "Active" },
];

// ── Supplier Types & Initial Data ──────────────────────────────────────
interface Supplier {
  id: string;
  companyName: string;
  contactName: string;
  designation: string;
  address: string;
  email: string;
  cell: string;
  status: "Active" | "Inactive";
}

const initialSuppliers: Supplier[] = [
  { id: "sup-1",  companyName: "A. Rashid Sikder Ind. Limited.", contactName: "Md. Shahidul Haque", designation: "xyz",     address: "210,212,Deshipara,Gazipursadar,Gazipur,Bangladesh.", email: "s.haque1967@yahoo.com",     cell: "01600000001", status: "Active" },
  { id: "sup-2",  companyName: "A.B.M Knitwear",                 contactName: "Mr. Sabuj",           designation: "Manager", address: "Mosharaf Trade Center, Rajabari,Konabari",          email: "abmknitwear2022@gmail.com", cell: "01775-707184",  status: "Active" },
  { id: "sup-3",  companyName: "ABIR ABDULLAH KNIT FABRICS",     contactName: "Mr",                  designation: "Manager", address: "BSCIC, Industrial Area, Konabari,Gazipur",          email: "@",                         cell: "0123456789",    status: "Active" },
  { id: "sup-4",  companyName: "ANISA'S APPARELS LTD.",          contactName: "N/A",                 designation: "N/A",     address: "Hatimara, Kashimpur,Gazipur",                       email: "N/A",                       cell: "01897865479",   status: "Active" },
  { id: "sup-5",  companyName: "Arif Knitspin Limited",          contactName: "Arif Knitspin Limited", designation: "Xyz",   address: "Jamirdia, Masterbari, Valuka, Mymensingh",          email: "@gmail.com",                cell: "098765",        status: "Active" },
  { id: "sup-6",  companyName: "Armada Spinning Mills Limited",  contactName: "Tareq",               designation: "AGM",     address: "Sreepur,Gazipur 1740, Dhaka, Bangladesh",           email: "abc",                       cell: "01634846",      status: "Active" },
  { id: "sup-7",  companyName: "ARS KNIT FABRICE",               contactName: "Mr",                  designation: "Manager", address: "Bsicc Konabari, Gazipur",                           email: "",                          cell: "",              status: "Active" },
  { id: "sup-8",  companyName: "B.B Fashion",                    contactName: "xyz",                 designation: "Manager", address: "Molla Market,(2nd Floor)Board Bazar,Gazipur",       email: "@",                         cell: "01725642370",   status: "Active" },
  { id: "sup-9",  companyName: "Changzhou Shenghongjing Textile",contactName: "Jeery",               designation: "chains",  address: "chaina",                                            email: "chaina",                    cell: "0987654",       status: "Active" },
  { id: "sup-10", companyName: "DULALI KNIT WEAR",               contactName: "N/A",                 designation: "N/A",     address: "Konabari Gazipur",                                  email: "N/A",                       cell: "N/A",           status: "Active" },
];
import {
  Settings,
  Plus,
  Search,
  Users,
  Layers,
  Percent,
  Package,
  CheckCircle,
  Pencil,
  Trash2,
  Save,
  Filter,
  X,
  Building2,
  Globe,
  DollarSign,
  FileText,
  AlertTriangle,
  Ruler,
  Calculator,
  Briefcase,
  Printer,
  Download,
  AlignLeft,
  Folder,
  Tag,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/merchandising-master-settings")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tab: (search.tab as string) || "company-wise-merc-setting",
    };
  },
  head: () => ({
    meta: [
      { title: "Master Settings — RMG Merchandising" },
      { name: "description", content: "Master setup for RMG buyers, fabric library, yarn specs, and process loss percentages." },
    ],
  }),
  component: MerchandisingMasterSettingsPage,
});

// Interfaces
interface BuyerSetting {
  id: string;
  shortCode: string;
  buyerName: string;
  fullName: string;
  buyingHouse: string;
  country: string;
  aqlStandard: string;
  payTerms: string;
  currency: string;
  contactEmail: string;
  phone: string;
  address: string;
  prdLeadDays: number;
  defPayDays: number;
  exfactLeadDays: number;
  status: "Active" | "Inactive";
}

interface FabricSpec {
  id: string;
  fabricType: string;
  construction: string;
  yarnCount: string;
  composition: string;
  gsm: number;
  spandexPct: number;
  shrinkagePct: string;
}

interface ProcessLoss {
  id: string;
  garmentType: string;
  knittingLossPct: number;
  dyeingLossPct: number;
  cuttingLossPct: number;
  printWashLossPct: number;
}

interface TrimsMaster {
  id: string;
  itemCode: string;
  itemName: string;
  category: "Sewing Trims" | "Packing Trims";
  subCategory: string;
  uom: string;
  unitPriceUsd: number;
  nominatedSupplier: string;
}

interface SpecParameter {
  id: string;
  paramName: string;
  category: "Body Part" | "Size Group" | "Special Requirement";
  defaultValue: string;
}

// Initial Mock Data
const initialBuyers: BuyerSetting[] = [
  { id: "b-1", shortCode: "A-M-London Fashion Ltd", buyerName: "A-M-London Fashion Ltd", fullName: "A-M-London Fashion Ltd", country: "Afghanistan", aqlStandard: "AQL 2.5", payTerms: "120 Days BBLC", currency: "USD", contactEmail: "info@am-london.com", phone: "", address: "", prdLeadDays: 0, defPayDays: 0, exfactLeadDays: 0, buyingHouse: "Direct", status: "Active" },
  { id: "b-2", shortCode: "ARDENE", buyerName: "ARDENE", fullName: "ARDENE", country: "Canada", aqlStandard: "AQL 2.5", payTerms: "120 Days BBLC", currency: "USD", contactEmail: "info@ardene.com", phone: "", address: "", prdLeadDays: 0, defPayDays: 0, exfactLeadDays: 0, buyingHouse: "Direct", status: "Active" },
  { id: "b-3", shortCode: "AS COLOUR LTD.", buyerName: "AS COLOUR LTD.", fullName: "AS COLOUR LTD.", country: "Australia", aqlStandard: "AQL 2.5", payTerms: "120 Days BBLC", currency: "USD", contactEmail: "info@ascolour.com", phone: "", address: "USA, 1234", prdLeadDays: 0, defPayDays: 0, exfactLeadDays: 0, buyingHouse: "Direct", status: "Active" },
  { id: "b-4", shortCode: "Chasin", buyerName: "Chasin", fullName: "Chasin", country: "Netherlands", aqlStandard: "AQL 2.5", payTerms: "120 Days BBLC", currency: "USD", contactEmail: "info@chasin.com", phone: "", address: "", prdLeadDays: 0, defPayDays: 0, exfactLeadDays: 0, buyingHouse: "Direct", status: "Active" },
  { id: "b-5", shortCode: "COPPEL CORPORATION", buyerName: "COPPEL CORPORATION", fullName: "COPPEL CORPORATION", country: "Mexico", aqlStandard: "AQL 2.5", payTerms: "120 Days BBLC", currency: "USD", contactEmail: "info@coppel.com", phone: "", address: "", prdLeadDays: 0, defPayDays: 0, exfactLeadDays: 0, buyingHouse: "Direct", status: "Active" },
  { id: "b-6", shortCode: "DEFACTO", buyerName: "DEFACTO", fullName: "DEFACTO", country: "Kazakhstan", aqlStandard: "AQL 2.5", payTerms: "120 Days BBLC", currency: "USD", contactEmail: "info@defacto.com", phone: "", address: "", prdLeadDays: 0, defPayDays: 0, exfactLeadDays: 0, buyingHouse: "Direct", status: "Active" },
  { id: "b-7", shortCode: "DHL", buyerName: "DHL", fullName: "DHL", country: "Afghanistan", aqlStandard: "AQL 2.5", payTerms: "120 Days BBLC", currency: "USD", contactEmail: "info@dhl.com", phone: "", address: "", prdLeadDays: 0, defPayDays: 0, exfactLeadDays: 0, buyingHouse: "Direct", status: "Active" },
  { id: "b-8", shortCode: "DOUR", buyerName: "DOUR", fullName: "DOUR", country: "Bangladesh", aqlStandard: "AQL 2.5", payTerms: "120 Days BBLC", currency: "USD", contactEmail: "info@dour.com", phone: "", address: "", prdLeadDays: 0, defPayDays: 0, exfactLeadDays: 0, buyingHouse: "Direct", status: "Active" },
  { id: "b-9", shortCode: "GARCIA", buyerName: "GARCIA", fullName: "GARCIA", country: "Netherlands", aqlStandard: "AQL 2.5", payTerms: "120 Days BBLC", currency: "USD", contactEmail: "info@garcia.com", phone: "", address: "", prdLeadDays: 0, defPayDays: 0, exfactLeadDays: 0, buyingHouse: "Direct", status: "Active" },
  { id: "b-10", shortCode: "GOR FACTORY SA", buyerName: "GOR FACTORY SA", fullName: "GOR FACTORY SA", country: "Netherlands", aqlStandard: "AQL 2.5", payTerms: "120 Days BBLC", currency: "USD", contactEmail: "info@gorfactory.com", phone: "", address: "", prdLeadDays: 0, defPayDays: 0, exfactLeadDays: 0, buyingHouse: "Direct", status: "Active" },
  { id: "b-11", shortCode: "ITPS", buyerName: "ITPS", fullName: "ITPS", country: "Belgium", aqlStandard: "AQL 2.5", payTerms: "120 Days BBLC", currency: "USD", contactEmail: "info@itps.com", phone: "", address: "", prdLeadDays: 0, defPayDays: 0, exfactLeadDays: 0, buyingHouse: "Direct", status: "Active" },
  { id: "b-12", shortCode: "JMS", buyerName: "JMS", fullName: "JMS", country: "Germany", aqlStandard: "AQL 2.5", payTerms: "120 Days BBLC", currency: "USD", contactEmail: "OPQ@gmail.com", phone: "016773242342", address: "USA", prdLeadDays: 0, defPayDays: 0, exfactLeadDays: 0, buyingHouse: "Direct", status: "Active" },
  { id: "b-13", shortCode: "JOMO FASHION", buyerName: "JOMO FASHION", fullName: "JOMO FASHION", country: "Netherlands", aqlStandard: "AQL 2.5", payTerms: "120 Days BBLC", currency: "USD", contactEmail: "info@jomofashion.com", phone: "", address: "", prdLeadDays: 0, defPayDays: 0, exfactLeadDays: 0, buyingHouse: "Direct", status: "Active" },
  { id: "b-14", shortCode: "M & A Sourcing (DHL)", buyerName: "M & A Sourcing (DHL)", fullName: "M & A Sourcing (DHL)", country: "Germany", aqlStandard: "AQL 2.5", payTerms: "120 Days BBLC", currency: "USD", contactEmail: "info@masourcing.com", phone: "", address: "", prdLeadDays: 0, defPayDays: 0, exfactLeadDays: 0, buyingHouse: "Direct", status: "Active" },
  { id: "b-15", shortCode: "MADE BY GREEN", buyerName: "MADE BY GREEN", fullName: "MADE BY GREEN", country: "Australia", aqlStandard: "AQL 2.5", payTerms: "120 Days BBLC", currency: "USD", contactEmail: "info@madebygreen.com", phone: "", address: "", prdLeadDays: 0, defPayDays: 0, exfactLeadDays: 0, buyingHouse: "Direct", status: "Active" },
];

const initialFabrics: FabricSpec[] = [
  { id: "f-1", fabricType: "Single Jersey", construction: "28 Gauge", yarnCount: "30s/1 Combed", composition: "100% Cotton", gsm: 160, spandexPct: 0, shrinkagePct: "L: -3%, W: -2%" },
  { id: "f-2", fabricType: "1x1 Rib", construction: "18 Gauge", yarnCount: "30s/1 Carded", composition: "95% Cotton 5% Spandex", gsm: 220, spandexPct: 5, shrinkagePct: "L: -4%, W: -3%" },
  { id: "f-3", fabricType: "2/1 Twill Woven", construction: "133 x 72", yarnCount: "40s x 40s", composition: "98% Cotton 2% Spandex", gsm: 240, spandexPct: 2, shrinkagePct: "L: -2%, W: -1%" },
  { id: "f-4", fabricType: "Heavy Fleece (Brushed)", construction: "20 Gauge", yarnCount: "20s/1 + 10s/1 Poly", composition: "80% Cotton 20% Polyester", gsm: 300, spandexPct: 0, shrinkagePct: "L: -3%, W: -3%" },
];

const initialProcessLoss: ProcessLoss[] = [
  { id: "pl-1", garmentType: "Basic T-Shirt (Knit)", knittingLossPct: 3.0, dyeingLossPct: 4.5, cuttingLossPct: 2.5, printWashLossPct: 2.0 },
  { id: "pl-2", garmentType: "Polo Shirt (Pique Knit)", knittingLossPct: 3.5, dyeingLossPct: 5.0, cuttingLossPct: 3.0, printWashLossPct: 2.5 },
  { id: "pl-3", garmentType: "Chino Pants (Woven)", knittingLossPct: 0.0, dyeingLossPct: 3.0, cuttingLossPct: 4.0, printWashLossPct: 3.5 },
  { id: "pl-4", garmentType: "Hooded Sweatshirt (Heavy Knit)", knittingLossPct: 3.5, dyeingLossPct: 5.5, cuttingLossPct: 3.0, printWashLossPct: 3.0 },
];

const initialTrims: TrimsMaster[] = [
  { id: "t-1", itemCode: "TRM-THD-01", itemName: "100% Spun Polyester Thread 40/2", category: "Sewing Trims", subCategory: "Sewing Thread", uom: "Cone (4000m)", unitPriceUsd: 1.45, nominatedSupplier: "Coats Bangladesh" },
  { id: "t-2", itemCode: "TRM-LBL-02", itemName: "Woven Main Label (Damask HD)", category: "Sewing Trims", subCategory: "Labels", uom: "Pcs", unitPriceUsd: 0.035, nominatedSupplier: "Avery Dennison BD" },
  { id: "t-3", itemCode: "TRM-PLY-03", itemName: "Self-Seal Polybag (12x18 inch)", category: "Packing Trims", subCategory: "Polybags", uom: "Pcs", unitPriceUsd: 0.042, nominatedSupplier: "Kazi Poly Ltd" },
  { id: "t-4", itemCode: "TRM-CTN-04", itemName: "7-Ply Master Shipping Carton", category: "Packing Trims", subCategory: "Cartons", uom: "Pcs", unitPriceUsd: 0.85, nominatedSupplier: "Mir Carton Ltd" },
  { id: "t-5", itemCode: "TRM-ZIP-05", itemName: "#5 Nylon Open-End Metal Zipper", category: "Sewing Trims", subCategory: "Zippers", uom: "Pcs", unitPriceUsd: 0.28, nominatedSupplier: "YKK Bangladesh Ltd" },
];

const initialSpecs: SpecParameter[] = [
  { id: "sp-1", paramName: "Chest Width (1/2 Chest)", category: "Body Part", defaultValue: "54.0 cm" },
  { id: "sp-2", paramName: "Body Length from HPS", category: "Body Part", defaultValue: "72.0 cm" },
  { id: "sp-3", paramName: "Standard Adult Size Range", category: "Size Group", defaultValue: "S, M, L, XL, XXL" },
  { id: "sp-4", paramName: "OEKO-TEX Standard 100 Certified", category: "Special Requirement", defaultValue: "Mandatory Class 1" },
];

const subTabsForMainTab = {
  company: [
    { id: "company-wise-merc-setting", label: "Company Wise MERC Setting" },
    { id: "costing-configuration-cpm", label: "Costing Configuration (CPM)" },
    { id: "payment-terms", label: "Payment Terms" },
  ],
  partners: [
    { id: "buying-house", label: "Buying House" },
    { id: "buyer-name", label: "Buyer" },
    { id: "buyer-wise-brand", label: "Buyer Brand" },
    { id: "buying-agent", label: "Buying Agent" },
    { id: "supplier", label: "Supplier" },
  ],
  product: [
    { id: "item-department", label: "Item Department" },
    { id: "gmt-item-name", label: "Garment Item" },
    { id: "body-part", label: "Body Part" },
    { id: "season", label: "Season" },
    { id: "sample-type", label: "Sample Type" },
    { id: "size-group", label: "Size Group" },
    { id: "uom", label: "UOM" },
  ],
  fabric: [
    { id: "fabric-gsm", label: "Fabric GSM" },
    { id: "fabric-nature", label: "Fabric Nature" },
    { id: "fabric-construction", label: "Fabric Construction" },
    { id: "fabric-yarn-composotion", label: "Fabric Composition" },
    { id: "dyeing", label: "Dyeing" },
    { id: "finishing", label: "Finishing" },
    { id: "shade-range", label: "Shade Range" },
  ],
  yarn: [
    { id: "yarn-brand", label: "Yarn Brand" },
    { id: "yarn-type", label: "Yarn Type" },
    { id: "yarn-count", label: "Yarn Count" },
    { id: "yarn-po-type", label: "Yarn PO Type" },
    { id: "yarn-po-settings", label: "Yarn PO Settings" },
  ],
  color: [
    { id: "gmt-fabric-color-name", label: "Garment & Fabric Color" },
    { id: "fabric-print-color-type", label: "Print/Color Type" },
    { id: "print-emb-wash-special-type", label: "Print/Embroidery/Wash Type" },
    { id: "aop-process", label: "AOP Process" },
  ],
  costing: [
    { id: "additional-cost-entry", label: "Additional Cost" },
    { id: "rmg-process-loss", label: "Process Loss" },
  ],
  quality: [
    { id: "quality-label", label: "Quality Label" },
  ],
};

const genericMockData: Record<string, { id: string; name: string; desc: string; status: "Active" | "Inactive" }[]> = {
  "company-wise-merc-setting": [
    { id: "CWM-01", name: "Pole Star Knit Settings", desc: "Default layout set to Knit. Allow SMV overrides.", status: "Active" },
    { id: "CWM-02", name: "A-M-London Settings", desc: "Auto-approve target margin limit at 10.5%.", status: "Active" },
  ],
  "payment-terms": [
    { id: "PAY-01", name: "120 Days BBLC", desc: "Back-to-back Letter of Credit with 120 days maturity", status: "Active" },
    { id: "PAY-02", name: "60 Days Sight LC", desc: "At sight Letter of Credit with 60 days duration", status: "Active" },
    { id: "PAY-03", name: "Cash Against Documents (CAD)", desc: "Direct documentary collection payment terms", status: "Active" },
  ],
  "buying-house": [
    { id: "BH-01", name: "H&M Liaison Office", desc: "Direct liaison office for Sweden H&M buyer", status: "Active" },
    { id: "BH-02", name: "Li & Fung", desc: "Global sourcing agent for USA/EU buyers", status: "Active" },
    { id: "BH-03", name: "ZXY Sourcing", desc: "Third-party buying house in Dhaka", status: "Active" },
  ],
  "buyer-wise-brand": [
    { id: "BWB-01", name: "Zara Basic", desc: "Brand Zara under Inditex Group", status: "Active" },
    { id: "BWB-02", name: "Zara Woman", desc: "Zara premium female collection", status: "Active" },
    { id: "BWB-03", name: "H&M Divided", desc: "H&M young adult streetwear segment", status: "Active" },
  ],
  "buying-agent": [
    { id: "BA-01", name: "Euro Sourcing BD", desc: "Agent representing European retail brands", status: "Active" },
    { id: "BA-02", name: "Tex-Styles International", desc: "Agent for Knitwear distribution in USA", status: "Active" },
  ],
  "supplier": [
    { id: "SUP-01", name: "Pacific Denim Mills Ltd.", desc: "Woven fabrics supplier in Gazipur", status: "Active" },
    { id: "SUP-02", name: "Noman Spinning Mills", desc: "Yarn supplier (Karded/Combed Cotton)", status: "Active" },
    { id: "SUP-03", name: "Aman Packaging & Accessories", desc: "Trims, cartons and polybags supplier", status: "Active" },
  ],
  "fabric-print-color-type": [
    { id: "FPC-01", name: "Solid Dyeing", desc: "Standard reactive or disperse single solid dye", status: "Active" },
    { id: "FPC-02", name: "Yarn Dyed Stripe", desc: "Striped pattern built during knitting", status: "Active" },
    { id: "FPC-03", name: "Rotary Pigment Print", desc: "All-over printing using rotary screens", status: "Active" },
  ],
  "fabric-gsm": [
    { id: "GSM-01", name: "160 GSM", desc: "Standard lightweight fabric for t-shirts", status: "Active" },
    { id: "GSM-02", name: "180 GSM", desc: "Medium weight jersey fabric", status: "Active" },
    { id: "GSM-03", name: "220 GSM", desc: "Heavy weight pique/interlock fabric", status: "Active" },
  ],
  "yarn-brand": [
    { id: "YB-01", name: "Vardhman Spinning", desc: "Premium Indian yarn brand", status: "Active" },
    { id: "YB-02", name: "Nassa Spinning", desc: "Local Bangladeshi high-quality combed yarn", status: "Active" },
  ],
  "yarn-type": [
    { id: "YT-01", name: "Combed Cotton", desc: "100% Cotton combed yarn (high quality)", status: "Active" },
    { id: "YT-02", name: "Carded Cotton", desc: "100% Cotton carded yarn (rougher texture)", status: "Active" },
    { id: "YT-03", name: "Slub Yarn", desc: "Yarn with intentional thick/thin spots for texture", status: "Active" },
  ],
  "yarn-count": [
    { id: "YC-01", name: "26/1 Ne Single Carded", desc: "Knitting yarn for single jersey fabrics", status: "Active" },
    { id: "YC-02", name: "30/1 Ne Combed Cotton", desc: "Premium grade knitting yarn", status: "Active" },
    { id: "YC-03", name: "40/1 Ne Combed Cotton", desc: "Ultra-fine yarn for lightweight tees", status: "Active" },
  ],
  "fabric-nature": [
    { id: "FN-01", name: "Knit", desc: "Interlooping yarns (stretchable)", status: "Active" },
    { id: "FN-02", name: "Woven", desc: "Interlacing warp & weft (rigid)", status: "Active" },
    { id: "FN-03", name: "Sweater", desc: "Flat-bed fully fashioned knitting", status: "Active" },
  ],
  "fabric-yarn-composotion": [
    { id: "FYC-01", name: "100% Combed Cotton", desc: "Pure natural cotton fibres", status: "Active" },
    { id: "FYC-02", name: "60% Cotton / 40% Polyester", desc: "CVC blend for strength and durability", status: "Active" },
    { id: "FYC-03", name: "95% Cotton / 5% Elastane", desc: "Stretchy spandex blend", status: "Active" },
  ],
  "dyeing": [
    { id: "DYE-01", name: "Reactive Dyeing", desc: "For cotton cellulose fibres (wash fastness)", status: "Active" },
    { id: "DYE-02", name: "Disperse Dyeing", desc: "For polyester synthetic fibres", status: "Active" },
  ],
  "shade-range": [
    { id: "SR-01", name: "Light Shade", desc: "White, Off-white, Pastel shades", status: "Active" },
    { id: "SR-02", name: "Medium Shade", desc: "Pink, Sky Blue, Yellow, Melange", status: "Active" },
    { id: "SR-03", name: "Dark/Extra Dark Shade", desc: "Black, Navy, Royal, Bottle Green", status: "Active" },
  ],
  "finishing": [
    { id: "FIN-01", name: "Peach Finish", desc: "Micro-sanded soft fuzzy surface texture", status: "Active" },
    { id: "FIN-02", name: "Enzyme Bio-Polish", desc: "Cellulase enzyme treatment to remove hairiness", status: "Active" },
  ],
  "item-department": [
    { id: "DEP-01", name: "Mens", desc: "Adult males sizing and fits", status: "Active" },
    { id: "DEP-02", name: "Womens", desc: "Adult females apparel settings", status: "Active" },
    { id: "DEP-03", name: "Kids / Boys", desc: "Youth sizes 4 to 14 years", status: "Active" },
  ],
  "body-part": [
    { id: "BP-01", name: "Front Panel", desc: "Main front body section", status: "Active" },
    { id: "BP-02", name: "Back Panel", desc: "Main back body section", status: "Active" },
    { id: "BP-03", name: "Sleeve", desc: "Left and right arm covers", status: "Active" },
    { id: "BP-04", name: "Neck Rib", desc: "Ribbed collar binding", status: "Active" },
  ],
  "gmt-item-name": [
    { id: "GIN-01", name: "Basic T-Shirt", desc: "Crew neck short sleeve jersey tee", status: "Active" },
    { id: "GIN-02", name: "Polo Shirt", desc: "Collared shirt with placket", status: "Active" },
    { id: "GIN-03", name: "Hoodie Sweatshirt", desc: "Fleece hooded pullover with front pocket", status: "Active" },
  ],
  "season": [
    { id: "SEA-01", name: "Spring/Summer 2027", desc: "SS27 buying collection parameters", status: "Active" },
    { id: "SEA-02", name: "Autumn/Winter 2026", desc: "AW26 current production collection", status: "Active" },
  ],
  "size-group": [
    { id: "SG-01", name: "S-XXL (Standard)", desc: "S, M, L, XL, XXL", status: "Active" },
    { id: "SG-02", name: "Kids 2Y-8Y", desc: "Toddler & child sizes", status: "Active" },
  ],
  "uom": [
    { id: "UOM-01", name: "Pcs", desc: "Single piece unit", status: "Active" },
    { id: "UOM-02", name: "Dzn", desc: "Dozen (12 pieces) unit", status: "Active" },
    { id: "UOM-03", name: "Kg", desc: "Kilograms unit (fabrics/yarns)", status: "Active" },
  ],
  "gmt-fabric-color-name": [
    { id: "COL-01", name: "Jet Black", desc: "Pantone 19-0303 TCX", status: "Active" },
    { id: "COL-02", name: "Optic White", desc: "Pantone 11-0601 TCX", status: "Active" },
    { id: "COL-03", name: "Navy Blazer", desc: "Pantone 19-3920 TCX", status: "Active" },
  ],
  "print-emb-wash-special-type": [
    { id: "PEW-01", name: "Plastisol Print", desc: "Standard PVC based screen printing", status: "Active" },
    { id: "PEW-02", name: "Rubber Print", desc: "Highly opaque water-based elastic ink", status: "Active" },
    { id: "PEW-03", name: "Silicone Print", desc: "Premium 3D raised printing texture", status: "Active" },
  ],
  "aop-process": [
    { id: "AOP-01", name: "Reactive AOP", desc: "Reactive all-over rotary print", status: "Active" },
    { id: "AOP-02", name: "Discharge AOP", desc: "Discharge print for dark background cottons", status: "Active" },
  ],
  "sample-type": [
    { id: "SMP-01", name: "Proto Sample", desc: "First design trial mockups", status: "Active" },
    { id: "SMP-02", name: "Size Set Sample", desc: "Full grade review sample set", status: "Active" },
    { id: "SMP-03", name: "PP Sample", desc: "Pre-Production sign-off sample", status: "Active" },
  ],
  "yarn-po-type": [
    { id: "YPT-01", name: "Local Yarn Purchase PO", desc: "Bought from domestic spinning mills", status: "Active" },
    { id: "YPT-02", name: "Import Yarn PO", desc: "L/C based import from India/China", status: "Active" },
  ],
  "yarn-po-settings": [
    { id: "YPS-01", name: "Allow 5% Tolerance", desc: "Allow up to 5% excess yarn receipt", status: "Active" },
    { id: "YPS-02", name: "Require Buyer L/C", desc: "Yarn PO requires active buyer L/C tag", status: "Active" },
  ],
};

interface GenericDbItem {
  id: string;
  name: string;
  desc: string;
  status: "Active" | "Inactive";
}

const DynamicMasterDBManager = ({
  subTabId,
  label,
  genericDb,
  setGenericDb,
  searchQuery,
}: {
  subTabId: string;
  label: string;
  genericDb: Record<string, GenericDbItem[]>;
  setGenericDb: React.Dispatch<React.SetStateAction<Record<string, GenericDbItem[]>>>;
  searchQuery: string;
}) => {
  const data = genericDb[subTabId] || [];
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<GenericDbItem | null>(null);
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");

  const handleOpenModal = (item?: GenericDbItem | null) => {
    if (item) {
      setEditItem(item);
      setFormName(item.name);
      setFormDesc(item.desc);
      setFormStatus(item.status);
    } else {
      setEditItem(null);
      setFormName("");
      setFormDesc("");
      setFormStatus("Active");
    }
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Name is required");
      return;
    }

    if (editItem) {
      setGenericDb(prev => ({
        ...prev,
        [subTabId]: prev[subTabId].map(i => i.id === editItem.id ? { ...i, name: formName, desc: formDesc, status: formStatus } : i)
      }));
      toast.success(`${label} updated successfully`);
    } else {
      const newId = `${subTabId.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
      const newItem = {
        id: newId,
        name: formName,
        desc: formDesc,
        status: formStatus
      };
      setGenericDb(prev => ({
        ...prev,
        [subTabId]: [...(prev[subTabId] || []), newItem]
      }));
      toast.success(`New ${label} added successfully`);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setGenericDb(prev => ({
      ...prev,
      [subTabId]: prev[subTabId].filter(i => i.id !== id)
    }));
    toast.success(`${label} deleted successfully`);
  };

  const filteredGeneric = data.filter(i =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {label} Registry ({filteredGeneric.length})
        </span>
        <button
          onClick={() => handleOpenModal()}
          className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm animate-all active:scale-95 duration-100"
        >
          <Plus size={14} /> Add New Entry
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-4 py-3">Code / ID</th>
              <th className="px-4 py-3">Name / Title</th>
              <th className="px-4 py-3">Description / Comments</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold">
            {filteredGeneric.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500 italic">
                  No records found. Click "Add New Entry" to create one.
                </td>
              </tr>
            ) : (
              filteredGeneric.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-mono font-bold text-slate-400">{item.id}</td>
                  <td className="px-4 py-3 font-bold text-teal-600 dark:text-teal-400">{item.name}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.desc}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                      item.status === "Active" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-slate-500/10 text-slate-500"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="p-1 text-slate-500 hover:text-teal-500 hover:bg-slate-100 rounded transition cursor-pointer"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-rose-500 hover:bg-rose-500/10 rounded transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Backdrop modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[100] p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                {editItem ? `Edit ${label}` : `Add New ${label}`}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 transition cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-1.5">
                  Name / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  placeholder={`e.g. ${label} Option`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-1.5">
                  Description / Comments
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30 resize-none"
                  placeholder="Enter additional details..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-1.5">
                  Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

function MerchandisingMasterSettingsPage() {
  const search = Route.useSearch();
  const searchTab = search?.tab || "company-wise-merc-setting";

  const [genericDb, setGenericDb] = useState<Record<string, { id: string; name: string; desc: string; status: "Active" | "Inactive" }[]>>(genericMockData);

  // Flat label lookup from all sub-tabs
  const allSubTabs = Object.values(subTabsForMainTab).flat();
  const tabLabel = allSubTabs.find(s => s.id === searchTab)?.label
    || searchTab.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());


  const [searchQuery, setSearchQuery] = useState("");

  // Dynamic Master DB Manager
  const renderDynamicMasterDB = (subTabId: string, label: string) => {
    return (
      <DynamicMasterDBManager
        subTabId={subTabId}
        label={label}
        genericDb={genericDb}
        setGenericDb={setGenericDb}
        searchQuery={searchQuery}
      />
    );
  };

  // Data states
  const [buyers, setBuyers] = useState<BuyerSetting[]>(initialBuyers);
  const [fabrics, setFabrics] = useState<FabricSpec[]>(initialFabrics);
  const [processLosses, setProcessLosses] = useState<ProcessLoss[]>(initialProcessLoss);
  const [trims, setTrims] = useState<TrimsMaster[]>(initialTrims);
  const [specs, setSpecs] = useState<SpecParameter[]>(initialSpecs);

  // Item Department States
  const [itemDepartments, setItemDepartments] = useState<ItemDepartment[]>(initialItemDepartments);
  const [itemDeptModal, setItemDeptModal] = useState<{ open: boolean; item?: ItemDepartment }>({ open: false });
  const [itemDeptForm, setItemDeptForm] = useState<Partial<ItemDepartment>>({
    departmentName: "",
    buyerName: "",
    teamName: "",
    status: "Active"
  });
  const [itemDeptSearch, setItemDeptSearch] = useState("");

  const handleOpenItemDeptModal = (item?: ItemDepartment) => {
    if (item) {
      setItemDeptForm(item);
      setItemDeptModal({ open: true, item });
    } else {
      setItemDeptForm({
        departmentName: "",
        buyerName: "",
        teamName: "",
        status: "Active"
      });
      setItemDeptModal({ open: true });
    }
  };

  const handleSaveItemDept = () => {
    if (!itemDeptForm.departmentName?.trim()) {
      toast.error("Department Name is required!");
      return;
    }

    if (itemDeptModal.item) {
      // Edit mode
      setItemDepartments(prev => prev.map(d => d.id === itemDeptModal.item!.id ? { ...d, ...itemDeptForm } as ItemDepartment : d));
      toast.success("Department updated successfully!");
    } else {
      // Add mode
      const newId = `idp-${Date.now()}`;
      setItemDepartments(prev => [...prev, { ...itemDeptForm, id: newId } as ItemDepartment]);
      toast.success("Department created successfully!");
    }
    setItemDeptModal({ open: false });
  };

  // Garment Item States
  const [garmentItems, setGarmentItems] = useState<GarmentItem[]>(initialGarmentItems);
  const [gmtItemModal, setGmtItemModal] = useState<{ open: boolean; item?: GarmentItem }>({ open: false });
  const [gmtItemForm, setGmtItemForm] = useState<Partial<GarmentItem>>({
    itemName: "",
    commercialName: "",
    productType: "",
    standardEfficiency: "",
    smv: "",
    buyerName: "",
    bodyPart: "ALL",
    status: "Active"
  });
  const [gmtItemSearch, setGmtItemSearch] = useState("");
  const [gmtItemBuyerFilter, setGmtItemBuyerFilter] = useState("All");

  const handleOpenGmtItemModal = (item?: GarmentItem) => {
    if (item) {
      setGmtItemForm(item);
      setGmtItemModal({ open: true, item });
    } else {
      setGmtItemForm({
        itemName: "",
        commercialName: "",
        productType: "",
        standardEfficiency: "",
        smv: "",
        buyerName: "",
        bodyPart: "ALL",
        status: "Active"
      });
      setGmtItemModal({ open: true });
    }
  };

  const handleSaveGmtItem = () => {
    if (!gmtItemForm.itemName?.trim()) {
      toast.error("Item Name is required!");
      return;
    }

    if (gmtItemModal.item) {
      // Edit mode
      setGarmentItems(prev => prev.map(i => i.id === gmtItemModal.item!.id ? { ...i, ...gmtItemForm } as GarmentItem : i));
      toast.success("Garment Item updated successfully!");
    } else {
      // Add mode
      const newId = `gmt-${Date.now()}`;
      setGarmentItems(prev => [...prev, { ...gmtItemForm, id: newId } as GarmentItem]);
      toast.success("Garment Item created successfully!");
    }
    setGmtItemModal({ open: false });
  };

  // Body Part States
  const [bodyParts, setBodyParts] = useState<BodyPartSpec[]>(initialBodyParts);
  const [bodyPartModal, setBodyPartModal] = useState<{ open: boolean; item?: BodyPartSpec }>({ open: false });
  const [bodyPartForm, setBodyPartForm] = useState<Partial<BodyPartSpec>>({
    name: "",
    shortName: "",
    bodyFor: "",
    nature: "",
    status: "Active"
  });
  const [bodyPartSearch, setBodyPartSearch] = useState("");

  const handleOpenBodyPartModal = (item?: BodyPartSpec) => {
    if (item) {
      setBodyPartForm(item);
      setBodyPartModal({ open: true, item });
    } else {
      setBodyPartForm({
        name: "",
        shortName: "",
        bodyFor: "",
        nature: "",
        status: "Active"
      });
      setBodyPartModal({ open: true });
    }
  };

  const handleSaveBodyPart = () => {
    if (!bodyPartForm.name?.trim()) {
      toast.error("Name is required!");
      return;
    }

    if (bodyPartModal.item) {
      // Edit mode
      setBodyParts(prev => prev.map(p => p.id === bodyPartModal.item!.id ? { ...p, ...bodyPartForm } as BodyPartSpec : p));
      toast.success("Body Part updated successfully!");
    } else {
      // Add mode
      const newId = `bp-${Date.now()}`;
      setBodyParts(prev => [...prev, { ...bodyPartForm, id: newId } as BodyPartSpec]);
      toast.success("Body Part created successfully!");
    }
    setBodyPartModal({ open: false });
  };

  // Costing Configuration States
  const [costingConfigs, setCostingConfigs] = useState<CostingConfig[]>(initialCostingConfigs);
  const [costingModal, setCostingModal] = useState<{ open: boolean; item?: CostingConfig }>({ open: false });
  const [costingForm, setCostingForm] = useState<Partial<CostingConfig>>({
    setupDate: new Date().toLocaleDateString("en-GB").replace(/\//g, "/"),
    year: new Date().getFullYear(),
    month: "",
    cmExpense: 0,
    noOfResource: 0,
    workingHour: 8,
    workingDay: 26,
    cpm: 0,
    appliedCpm: 0,
    currency: "USD",
    status: "Active",
  });

  const calcCpm = (f: Partial<CostingConfig>) => {
    const denom = (f.noOfResource || 0) * (f.workingHour || 0) * (f.workingDay || 0) * 60;
    return denom > 0 ? Number(((f.cmExpense || 0) / denom).toFixed(4)) : 0;
  };

  const handleOpenCostingModal = (item?: CostingConfig) => {
    if (item) {
      setCostingForm(item);
      setCostingModal({ open: true, item });
    } else {
      const blank: Partial<CostingConfig> = {
        setupDate: new Date().toLocaleDateString("en-GB").replace(/\//g, "/"),
        year: new Date().getFullYear(), month: "", cmExpense: 0,
        noOfResource: 0, workingHour: 8, workingDay: 26,
        cpm: 0, appliedCpm: 0, currency: "USD", status: "Active",
      };
      setCostingForm(blank);
      setCostingModal({ open: true });
    }
  };

  const handleSaveCosting = () => {
    if (!costingForm.month) { toast.error("Month is required"); return; }
    if (!costingForm.cmExpense) { toast.error("CM Expense is required"); return; }
    const computed = calcCpm(costingForm);
    if (costingModal.item) {
      setCostingConfigs(prev => prev.map(c => c.id === costingModal.item!.id ? { ...c, ...costingForm, cpm: computed } as CostingConfig : c));
      toast.success("Costing Configuration updated!");
    } else {
      const newC: CostingConfig = {
        id: `cc-${Date.now()}`,
        setupDate: costingForm.setupDate || new Date().toLocaleDateString("en-GB"),
        year: costingForm.year || new Date().getFullYear(),
        month: costingForm.month!,
        cmExpense: costingForm.cmExpense || 0,
        noOfResource: costingForm.noOfResource || 0,
        workingHour: costingForm.workingHour || 8,
        workingDay: costingForm.workingDay || 26,
        cpm: computed,
        appliedCpm: costingForm.appliedCpm || 0,
        currency: costingForm.currency || "USD",
        status: costingForm.status || "Active",
      };
      setCostingConfigs(prev => [newC, ...prev]);
      toast.success("New Costing Configuration added!");
    }
    setCostingModal({ open: false });
  };

  const handleDeleteCosting = (id: string) => {
    setCostingConfigs(prev => prev.filter(c => c.id !== id));
    toast.success("Configuration removed");
  };

  // ── Payment Terms State & Handlers ──────────────────────────────────
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>(initialPaymentTerms);
  const [paymentTermModal, setPaymentTermModal] = useState<{ open: boolean; item?: PaymentTerm }>({ open: false });
  const [paymentTermForm, setPaymentTermForm] = useState<Partial<PaymentTerm>>({ shortName: "", status: "Active" });

  const handleOpenPaymentTermModal = (item?: PaymentTerm) => {
    if (item) {
      setPaymentTermForm(item);
      setPaymentTermModal({ open: true, item });
    } else {
      setPaymentTermForm({ shortName: "", status: "Active" });
      setPaymentTermModal({ open: true });
    }
  };

  const handleSavePaymentTerm = () => {
    if (!paymentTermForm.shortName?.trim()) { toast.error("Short Name is required"); return; }
    if (paymentTermModal.item) {
      setPaymentTerms(prev => prev.map(p => p.id === paymentTermModal.item!.id ? { ...p, ...paymentTermForm } as PaymentTerm : p));
      toast.success("Payment Term updated!");
    } else {
      const newP: PaymentTerm = { id: `pt-${Date.now()}`, shortName: paymentTermForm.shortName!, status: paymentTermForm.status || "Active" };
      setPaymentTerms(prev => [...prev, newP]);
      toast.success("Payment Term added!");
    }
    setPaymentTermModal({ open: false });
  };

  const handleDeletePaymentTerm = (id: string) => {
    setPaymentTerms(prev => prev.filter(p => p.id !== id));
    toast.success("Payment Term removed");
  };

  const filteredPaymentTerms = paymentTerms.filter(p =>
    p.shortName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Buying House State & Handlers ───────────────────────────────
  const [buyingHouses, setBuyingHouses] = useState<BuyingHouse[]>(initialBuyingHouses);
  const [buyingHouseModal, setBuyingHouseModal] = useState<{ open: boolean; item?: BuyingHouse }>({ open: false });
  const [buyingHouseForm, setBuyingHouseForm] = useState<Partial<BuyingHouse>>({
    shortName: "", fullName: "", contactPerson: "", address: "", phone: "", email: "", fax: "", status: "Active",
  });

  const handleOpenBuyingHouseModal = (item?: BuyingHouse) => {
    if (item) {
      setBuyingHouseForm(item);
      setBuyingHouseModal({ open: true, item });
    } else {
      setBuyingHouseForm({ shortName: "", fullName: "", contactPerson: "", address: "", phone: "", email: "", fax: "", status: "Active" });
      setBuyingHouseModal({ open: true });
    }
  };

  const handleSaveBuyingHouse = () => {
    if (!buyingHouseForm.shortName?.trim()) { toast.error("Short Name is required"); return; }
    if (!buyingHouseForm.fullName?.trim()) { toast.error("Full Name is required"); return; }
    if (buyingHouseModal.item) {
      setBuyingHouses(prev => prev.map(b => b.id === buyingHouseModal.item!.id ? { ...b, ...buyingHouseForm } as BuyingHouse : b));
      toast.success("Buying House updated!");
    } else {
      const newB: BuyingHouse = {
        id: `bh-${Date.now()}`,
        shortName: buyingHouseForm.shortName!,
        fullName: buyingHouseForm.fullName!,
        contactPerson: buyingHouseForm.contactPerson || "",
        address: buyingHouseForm.address || "",
        phone: buyingHouseForm.phone || "",
        email: buyingHouseForm.email || "",
        fax: buyingHouseForm.fax || "",
        status: buyingHouseForm.status || "Active",
      };
      setBuyingHouses(prev => [...prev, newB]);
      toast.success("Buying House added!");
    }
    setBuyingHouseModal({ open: false });
  };

  const filteredBuyingHouses = buyingHouses.filter(b =>
    b.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Buyer Wise Brand State & Handlers ───────────────────────────
  const [buyerWiseBrands, setBuyerWiseBrands] = useState<BuyerWiseBrand[]>(initialBuyerWiseBrands);
  const [buyerWiseBrandModal, setBuyerWiseBrandModal] = useState<{ open: boolean; item?: BuyerWiseBrand }>({ open: false });
  const [buyerWiseBrandForm, setBuyerWiseBrandForm] = useState<Partial<BuyerWiseBrand>>({
    buyerName: "", brand: "", status: "Active",
  });

  const handleOpenBuyerWiseBrandModal = (item?: BuyerWiseBrand) => {
    if (item) {
      setBuyerWiseBrandForm(item);
      setBuyerWiseBrandModal({ open: true, item });
    } else {
      setBuyerWiseBrandForm({ buyerName: "", brand: "", status: "Active" });
      setBuyerWiseBrandModal({ open: true });
    }
  };

  const handleSaveBuyerWiseBrand = () => {
    if (!buyerWiseBrandForm.buyerName?.trim()) { toast.error("Buyer Name is required"); return; }
    if (!buyerWiseBrandForm.brand?.trim()) { toast.error("Brand is required"); return; }
    if (buyerWiseBrandModal.item) {
      setBuyerWiseBrands(prev => prev.map(b => b.id === buyerWiseBrandModal.item!.id ? { ...b, ...buyerWiseBrandForm } as BuyerWiseBrand : b));
      toast.success("Buyer Wise Brand updated!");
    } else {
      const newB: BuyerWiseBrand = {
        id: `bwb-${Date.now()}`,
        buyerName: buyerWiseBrandForm.buyerName!,
        brand: buyerWiseBrandForm.brand!,
        status: buyerWiseBrandForm.status || "Active",
      };
      setBuyerWiseBrands(prev => [...prev, newB]);
      toast.success("Buyer Wise Brand added!");
    }
    setBuyerWiseBrandModal({ open: false });
  };

  const filteredBuyerWiseBrands = buyerWiseBrands.filter(b =>
    b.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Buying Agent State & Handlers ──────────────────────────────
  const [buyingAgents, setBuyingAgents] = useState<BuyingAgent[]>(initialBuyingAgents);
  const [buyingAgentModal, setBuyingAgentModal] = useState<{ open: boolean; item?: BuyingAgent }>({ open: false });
  const [buyingAgentForm, setBuyingAgentForm] = useState<Partial<BuyingAgent>>({
    shortName: "", fullName: "", address: "", phone: "", email: "", fax: "", status: "Active",
  });

  const handleOpenBuyingAgentModal = (item?: BuyingAgent) => {
    if (item) {
      setBuyingAgentForm(item);
      setBuyingAgentModal({ open: true, item });
    } else {
      setBuyingAgentForm({ shortName: "", fullName: "", address: "", phone: "", email: "", fax: "", status: "Active" });
      setBuyingAgentModal({ open: true });
    }
  };

  const handleSaveBuyingAgent = () => {
    if (!buyingAgentForm.shortName?.trim()) { toast.error("Short Name is required"); return; }
    if (!buyingAgentForm.fullName?.trim()) { toast.error("Full Name is required"); return; }
    if (buyingAgentModal.item) {
      setBuyingAgents(prev => prev.map(a => a.id === buyingAgentModal.item!.id ? { ...a, ...buyingAgentForm } as BuyingAgent : a));
      toast.success("Buying Agent updated!");
    } else {
      const newA: BuyingAgent = {
        id: `ba-${Date.now()}`,
        shortName: buyingAgentForm.shortName!,
        fullName: buyingAgentForm.fullName!,
        address: buyingAgentForm.address || "",
        phone: buyingAgentForm.phone || "",
        email: buyingAgentForm.email || "",
        fax: buyingAgentForm.fax || "",
        status: buyingAgentForm.status || "Active",
      };
      setBuyingAgents(prev => [...prev, newA]);
      toast.success("Buying Agent added!");
    }
    setBuyingAgentModal({ open: false });
  };

  const filteredBuyingAgents = buyingAgents.filter(a =>
    a.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Supplier State & Handlers ───────────────────────────────────
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [supplierModal, setSupplierModal] = useState<{ open: boolean; item?: Supplier }>({ open: false });
  const [supplierForm, setSupplierForm] = useState<Partial<Supplier>>({
    companyName: "", contactName: "", designation: "", address: "", email: "", cell: "", status: "Active",
  });

  const handleOpenSupplierModal = (item?: Supplier) => {
    if (item) {
      setSupplierForm(item);
      setSupplierModal({ open: true, item });
    } else {
      setSupplierForm({ companyName: "", contactName: "", designation: "", address: "", email: "", cell: "", status: "Active" });
      setSupplierModal({ open: true });
    }
  };

  const handleSaveSupplier = () => {
    if (!supplierForm.companyName?.trim()) { toast.error("Company Name is required"); return; }
    if (!supplierForm.contactName?.trim()) { toast.error("Contact Name is required"); return; }
    if (!supplierForm.designation?.trim()) { toast.error("Designation is required"); return; }
    if (!supplierForm.address?.trim()) { toast.error("Address is required"); return; }
    if (!supplierForm.email?.trim()) { toast.error("E-mail is required"); return; }
    if (!supplierForm.cell?.trim()) { toast.error("Cell is required"); return; }

    if (supplierModal.item) {
      setSuppliers(prev => prev.map(s => s.id === supplierModal.item!.id ? { ...s, ...supplierForm } as Supplier : s));
      toast.success("Supplier updated!");
    } else {
      const newS: Supplier = {
        id: `sup-${Date.now()}`,
        companyName: supplierForm.companyName!,
        contactName: supplierForm.contactName!,
        designation: supplierForm.designation!,
        address: supplierForm.address!,
        email: supplierForm.email!,
        cell: supplierForm.cell!,
        status: supplierForm.status || "Active",
      };
      setSuppliers(prev => [newS, ...prev]);
      toast.success("Supplier registered!");
    }
    setSupplierModal({ open: false });
  };

  const filteredSuppliersList = suppliers.filter(s =>
    s.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Modal States
  const [buyerModal, setBuyerModal] = useState<{ open: boolean; item?: BuyerSetting }>({ open: false });
  const [fabricModal, setFabricModal] = useState<{ open: boolean; item?: FabricSpec }>({ open: false });
  const [lossModal, setLossModal] = useState<{ open: boolean; item?: ProcessLoss }>({ open: false });
  const [trimsModal, setTrimsModal] = useState<{ open: boolean; item?: TrimsMaster }>({ open: false });
  const [specModal, setSpecModal] = useState<{ open: boolean; item?: SpecParameter }>({ open: false });

  // Form Field States
  const [buyerForm, setBuyerForm] = useState<Partial<BuyerSetting>>({
    shortCode: "",
    buyerName: "",
    fullName: "",
    buyingHouse: "",
    country: "Bangladesh",
    aqlStandard: "AQL 2.5",
    payTerms: "120 Days BBLC",
    currency: "USD",
    contactEmail: "",
    phone: "",
    address: "",
    prdLeadDays: 0,
    defPayDays: 0,
    exfactLeadDays: 0,
    status: "Active",
  });

  // ── Buyer Profile Accordion states & sub-tables ───────────────────────────
  const [profileViewMode, setProfileViewMode] = useState<boolean>(false);
  const [profileBuyerId, setProfileBuyerId] = useState<string | null>(null);
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>("basic-info");
  const [countryFilter, setCountryFilter] = useState<string>("All");

  // Accordion form inputs & listing states
  const [contactPersons, setContactPersons] = useState<{ id: string; name: string; designation: string; phone: string; email: string; status: string }[]>([
    { id: "cp-1", name: "John Doe", designation: "Merchant Head", phone: "01712345678", email: "john@am-london.com", status: "Active" }
  ]);
  const [contactPersonForm, setContactPersonForm] = useState({ name: "", designation: "", phone: "", email: "", status: "Active" });

  const [applicants, setApplicants] = useState<{ id: string; name: string }[]>([
    { id: "ap-1", name: "London Retail Sourcing" }
  ]);
  const [applicantForm, setApplicantForm] = useState({ name: "" });

  const [notifyingParties, setNotifyingParties] = useState<{ id: string; name: string }[]>([
    { id: "np-1", name: "DHL Logistics BD" }
  ]);
  const [notifyingPartyForm, setNotifyingPartyForm] = useState({ name: "" });

  const [consignees, setConsignees] = useState<{ id: string; name: string }[]>([
    { id: "cs-1", name: "A-M-London Logistics Depot" }
  ]);
  const [consigneeForm, setConsigneeForm] = useState({ name: "" });

  const [banks, setBanks] = useState<{ id: string; bank: string; branch: string; address: string; cpName: string; phone: string; email: string; status: string }[]>([
    { id: "bk-1", bank: "Standard Chartered", branch: "Dhaka Branch", address: "Gulshan, Dhaka", cpName: "Rahman", phone: "017555666", email: "rahman@sc.com", status: "Active" }
  ]);
  const [bankForm, setBankForm] = useState({ bank: "Standard Chartered", branch: "", address: "", cpName: "", phone: "", email: "", status: "Active" });

  const [departments, setDepartments] = useState<{ id: string; department: string; teamName: string; status: string }[]>([
    { id: "dp-1", department: "Merchandising", teamName: "Team Gold", status: "Active" }
  ]);
  const [departmentForm, setDepartmentForm] = useState({ department: "Merchandising", teamName: "Team Gold", status: "Active" });

  const [nominatedSuppliers, setNominatedSuppliers] = useState<{ id: string; supplier: string; person: string; address: string; phone: string; email: string }[]>([
    { id: "ns-1", supplier: "Pacific Denim Mills Ltd.", person: "Mr. Karim", address: "Gazipur", phone: "017222333", email: "karim@pacific.com" }
  ]);
  const [nominatedSupplierForm, setNominatedSupplierForm] = useState({ supplier: "Pacific Denim Mills Ltd.", person: "", address: "", phone: "", email: "" });

  const [sizeBreakdowns, setSizeBreakdowns] = useState<{ id: string; sizeGroup: string; sizeBreakdown: string; sizeRatio: string }[]>([
    { id: "sz-1", sizeGroup: "Men's Knit", sizeBreakdown: "S, M, L, XL", sizeRatio: "1:2:2:1" }
  ]);
  const [sizeForm, setSizeForm] = useState({ sizeGroup: "Men's Knit", sizeBreakdown: "", sizeRatio: "" });

  const [seasons, setSeasons] = useState<{ id: string; seasonName: string; status: string }[]>([
    { id: "ss-1", seasonName: "Autumn/Winter 2026", status: "Active" }
  ]);
  const [seasonForm, setSeasonForm] = useState({ seasonName: "", status: "Active" });

  const [shippings, setShippings] = useState<{ id: string; country: string; code: string; shippingAddr: string; destPort: string; portCode: string; shippingMark: string; consigneeAddr: string; cargoShipAddr: string; status: string }[]>([
    { id: "sh-1", country: "Afghanistan", code: "AFG", shippingAddr: "Kabul Depot", destPort: "Chittagong", portCode: "CGP", shippingMark: "AML-AFG-01", consigneeAddr: "Kabul Main", cargoShipAddr: "Kabul Main", status: "Active" }
  ]);
  const [shippingForm, setShippingForm] = useState({ country: "Afghanistan", code: "", shippingAddr: "", destPort: "", portCode: "", shippingMark: "", consigneeAddr: "", cargoShipAddr: "", status: "Active" });

  const [costingInfo, setCostingInfo] = useState({ cmp: 0.09, smv: 5.0, efficiency: 0.0, commercialCost: 0.0, financialCost: 0.0, commission: 0.0 });

  const [fabricForm, setFabricForm] = useState<Partial<FabricSpec>>({
    fabricType: "Single Jersey",
    construction: "",
    yarnCount: "",
    composition: "100% Cotton",
    gsm: 180,
    spandexPct: 0,
    shrinkagePct: "L: -3%, W: -2%",
  });

  const [lossForm, setLossForm] = useState<Partial<ProcessLoss>>({
    garmentType: "",
    knittingLossPct: 3.0,
    dyeingLossPct: 4.5,
    cuttingLossPct: 2.5,
    printWashLossPct: 2.0,
  });

  const [trimsForm, setTrimsForm] = useState<Partial<TrimsMaster>>({
    itemCode: "",
    itemName: "",
    category: "Sewing Trims",
    subCategory: "Sewing Thread",
    uom: "Pcs",
    unitPriceUsd: 0.05,
    nominatedSupplier: "",
  });

  const [specForm, setSpecForm] = useState<Partial<SpecParameter>>({
    paramName: "",
    category: "Body Part",
    defaultValue: "",
  });

  // --- BUYER ACTIONS ---
  const handleOpenBuyerModal = (item?: BuyerSetting) => {
    if (item) {
      setBuyerForm(item);
      setBuyerModal({ open: true, item });
    } else {
      setBuyerForm({
        shortCode: "",
        buyerName: "",
        buyingHouse: "",
        country: "United Kingdom",
        aqlStandard: "AQL 2.5",
        payTerms: "120 Days BBLC",
        currency: "USD",
        contactEmail: "",
        status: "Active",
      });
      setBuyerModal({ open: true });
    }
  };

  const handleSaveBuyer = () => {
    if (!buyerForm.buyerName?.trim()) {
      toast.error("Buyer Name is required");
      return;
    }

    if (profileBuyerId) {
      setBuyers(prev => prev.map(b => b.id === profileBuyerId ? ({ ...b, ...buyerForm } as BuyerSetting) : b));
      toast.success(`Buyer ${buyerForm.buyerName} updated successfully!`);
    } else {
      const newB: BuyerSetting = {
        id: `b-${Date.now()}`,
        shortCode: buyerForm.shortCode || buyerForm.buyerName.substring(0, 4).toUpperCase(),
        buyerName: buyerForm.buyerName,
        fullName: buyerForm.fullName || buyerForm.buyerName,
        buyingHouse: buyerForm.buyingHouse || "Direct",
        country: buyerForm.country || "Bangladesh",
        aqlStandard: buyerForm.aqlStandard || "AQL 2.5",
        payTerms: buyerForm.payTerms || "120 Days BBLC",
        currency: buyerForm.currency || "USD",
        contactEmail: buyerForm.contactEmail || "info@buyer.com",
        phone: buyerForm.phone || "",
        address: buyerForm.address || "",
        prdLeadDays: Number(buyerForm.prdLeadDays || 0),
        defPayDays: Number(buyerForm.defPayDays || 0),
        exfactLeadDays: Number(buyerForm.exfactLeadDays || 0),
        status: buyerForm.status || "Active",
      };
      setBuyers([newB, ...buyers]);
      setProfileBuyerId(newB.id); // set ID so other accordion lists work with this new buyer
      toast.success(`New Buyer ${newB.buyerName} registered!`);
    }
  };

  const handleDeleteBuyer = (id: string) => {
    setBuyers(prev => prev.filter(b => b.id !== id));
    toast.success("Buyer removed from master database");
  };

  // --- FABRIC SPEC ACTIONS ---
  const handleOpenFabricModal = (item?: FabricSpec) => {
    if (item) {
      setFabricForm(item);
      setFabricModal({ open: true, item });
    } else {
      setFabricForm({ fabricType: "Single Jersey", construction: "", yarnCount: "", composition: "100% Cotton", gsm: 180, spandexPct: 0, shrinkagePct: "L: -3%, W: -2%" });
      setFabricModal({ open: true });
    }
  };

  const handleSaveFabric = () => {
    if (!fabricForm.fabricType?.trim()) {
      toast.error("Fabric Type is required");
      return;
    }
    if (fabricModal.item) {
      setFabrics(prev => prev.map(f => f.id === fabricModal.item!.id ? ({ ...f, ...fabricForm } as FabricSpec) : f));
      toast.success("Fabric Spec updated!");
    } else {
      const newF: FabricSpec = {
        id: `f-${Date.now()}`,
        fabricType: fabricForm.fabricType || "Single Jersey",
        construction: fabricForm.construction || "28 Gauge",
        yarnCount: fabricForm.yarnCount || "30s/1 Combed",
        composition: fabricForm.composition || "100% Cotton",
        gsm: Number(fabricForm.gsm) || 180,
        spandexPct: Number(fabricForm.spandexPct) || 0,
        shrinkagePct: fabricForm.shrinkagePct || "L: -3%, W: -2%",
      };
      setFabrics([newF, ...fabrics]);
      toast.success("New Fabric Spec registered!");
    }
    setFabricModal({ open: false });
  };

  const handleDeleteFabric = (id: string) => {
    setFabrics(prev => prev.filter(f => f.id !== id));
    toast.success("Fabric Spec deleted");
  };

  // --- PROCESS LOSS ACTIONS ---
  const handleOpenLossModal = (item?: ProcessLoss) => {
    if (item) {
      setLossForm(item);
      setLossModal({ open: true, item });
    } else {
      setLossForm({ garmentType: "", knittingLossPct: 3.0, dyeingLossPct: 4.5, cuttingLossPct: 2.5, printWashLossPct: 2.0 });
      setLossModal({ open: true });
    }
  };

  const handleSaveLoss = () => {
    if (!lossForm.garmentType?.trim()) {
      toast.error("Garment Category is required");
      return;
    }
    if (lossModal.item) {
      setProcessLosses(prev => prev.map(l => l.id === lossModal.item!.id ? ({ ...l, ...lossForm } as ProcessLoss) : l));
      toast.success("Process Loss matrix updated!");
    } else {
      const newL: ProcessLoss = {
        id: `pl-${Date.now()}`,
        garmentType: lossForm.garmentType,
        knittingLossPct: Number(lossForm.knittingLossPct) || 0,
        dyeingLossPct: Number(lossForm.dyeingLossPct) || 0,
        cuttingLossPct: Number(lossForm.cuttingLossPct) || 0,
        printWashLossPct: Number(lossForm.printWashLossPct) || 0,
      };
      setProcessLosses([newL, ...processLosses]);
      toast.success("New Process Loss rule added!");
    }
    setLossModal({ open: false });
  };

  const handleDeleteLoss = (id: string) => {
    setProcessLosses(prev => prev.filter(l => l.id !== id));
    toast.success("Process Loss rule removed");
  };

  // --- TRIMS ACTIONS ---
  const handleOpenTrimsModal = (item?: TrimsMaster) => {
    if (item) {
      setTrimsForm(item);
      setTrimsModal({ open: true, item });
    } else {
      setTrimsForm({ itemCode: "", itemName: "", category: "Sewing Trims", subCategory: "Sewing Thread", uom: "Pcs", unitPriceUsd: 0.05, nominatedSupplier: "" });
      setTrimsModal({ open: true });
    }
  };

  const handleSaveTrims = () => {
    if (!trimsForm.itemName?.trim()) {
      toast.error("Trims Item Name is required");
      return;
    }
    if (trimsModal.item) {
      setTrims(prev => prev.map(t => t.id === trimsModal.item!.id ? ({ ...t, ...trimsForm } as TrimsMaster) : t));
      toast.success("Trims item updated!");
    } else {
      const newT: TrimsMaster = {
        id: `t-${Date.now()}`,
        itemCode: trimsForm.itemCode || `TRM-${Math.floor(100 + Math.random() * 900)}`,
        itemName: trimsForm.itemName,
        category: trimsForm.category || "Sewing Trims",
        subCategory: trimsForm.subCategory || "General",
        uom: trimsForm.uom || "Pcs",
        unitPriceUsd: Number(trimsForm.unitPriceUsd) || 0.05,
        nominatedSupplier: trimsForm.nominatedSupplier || "Local Nominated",
      };
      setTrims([newT, ...trims]);
      toast.success("New Trims item added to catalog!");
    }
    setTrimsModal({ open: false });
  };

  const handleDeleteTrims = (id: string) => {
    setTrims(prev => prev.filter(t => t.id !== id));
    toast.success("Trims item deleted");
  };

  // --- SPECS ACTIONS ---
  const handleOpenSpecModal = (item?: SpecParameter) => {
    if (item) {
      setSpecForm(item);
      setSpecModal({ open: true, item });
    } else {
      setSpecForm({ paramName: "", category: "Body Part", defaultValue: "" });
      setSpecModal({ open: true });
    }
  };

  const handleSaveSpec = () => {
    if (!specForm.paramName?.trim()) {
      toast.error("Parameter Name is required");
      return;
    }
    if (specModal.item) {
      setSpecs(prev => prev.map(s => s.id === specModal.item!.id ? ({ ...s, ...specForm } as SpecParameter) : s));
      toast.success("Specification Parameter updated!");
    } else {
      const newS: SpecParameter = {
        id: `sp-${Date.now()}`,
        paramName: specForm.paramName,
        category: specForm.category || "Body Part",
        defaultValue: specForm.defaultValue || "-",
      };
      setSpecs([newS, ...specs]);
      toast.success("New Spec Parameter added!");
    }
    setSpecModal({ open: false });
  };

  const handleDeleteSpec = (id: string) => {
    setSpecs(prev => prev.filter(s => s.id !== id));
    toast.success("Parameter removed");
  };

  // Filtered queries
  const filteredBuyers = buyers.filter(b =>
    b.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.buyingHouse.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.shortCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFabrics = fabrics.filter(f =>
    f.fabricType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.yarnCount.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.composition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLosses = processLosses.filter(l =>
    l.garmentType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTrims = trims.filter(t =>
    t.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.nominatedSupplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSpecs = specs.filter(s =>
    s.paramName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MerchandisingLayout
      activePath="masterSettings"
      breadcrumbs={[{ label: "Master Settings" }, { label: tabLabel }]}
      title="RMG Master Configurations Suite"
    >
      <div className="p-4 md:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 min-h-full font-sans space-y-6">
        
        {/* Header Banner */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span className="p-1.5 bg-teal-500/10 text-teal-500 rounded-lg"><Settings className="size-5" /></span>
              RMG Master Database & Parameters
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage global configurations for Buyers, Material Specs, Measurement Parameters, Process Loss, and Financial CPM</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-xl">
              ✓ Merchandising Master DB Live
            </span>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex justify-end">
          <div className="relative w-56">
            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-semibold pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            />
          </div>
        </div>

        {/* Content - rendered directly based on URL tab param */}
        <div>
              {searchTab === "costing-configuration-cpm" ? (
                <div className="space-y-0">
                  {/* Table Header */}
                  <div className="bg-white dark:bg-slate-900 rounded-t-2xl border border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Calculator className="size-4 text-teal-500" /> Costing Configuration (CPM) — {costingConfigs.length} Record{costingConfigs.length !== 1 ? "s" : ""}
                    </span>
                    <button
                      onClick={() => handleOpenCostingModal()}
                      className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 duration-100"
                    >
                      <Plus size={14} /> Add Configuration
                    </button>
                  </div>

                  {/* Table */}
                  <div className="bg-white dark:bg-slate-900 rounded-b-2xl border border-t-0 border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-3 py-3 text-center w-10">SL</th>
                          <th className="px-3 py-3 text-center">Actions</th>
                          <th className="px-3 py-3">Setup Date</th>
                          <th className="px-3 py-3">Year</th>
                          <th className="px-3 py-3">Month</th>
                          <th className="px-3 py-3 text-right">CM Expense</th>
                          <th className="px-3 py-3 text-right">No of Resource</th>
                          <th className="px-3 py-3 text-right">Working Hour</th>
                          <th className="px-3 py-3 text-right">Working Day</th>
                          <th className="px-3 py-3 text-right">CPM</th>
                          <th className="px-3 py-3 text-right">Applied CPM</th>
                          <th className="px-3 py-3">Currency</th>
                          <th className="px-3 py-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                        {costingConfigs.map((c, idx) => (
                          <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="px-3 py-2.5 text-center text-slate-500">{idx + 1}</td>
                            <td className="px-3 py-2.5 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => handleOpenCostingModal(c)}
                                  className="p-1 text-amber-500 hover:bg-amber-500/10 rounded transition cursor-pointer"
                                  title="Edit"
                                >
                                  <Pencil size={13} />
                                </button>
                                <button
                                  onClick={() => handleDeleteCosting(c.id)}
                                  className="p-1 text-rose-500 hover:bg-rose-500/10 rounded transition cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                            <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300">{c.setupDate}</td>
                            <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300">{c.year}</td>
                            <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300">{c.month}</td>
                            <td className="px-3 py-2.5 text-right font-mono text-slate-800 dark:text-slate-200">{c.cmExpense.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                            <td className="px-3 py-2.5 text-right font-mono text-slate-700 dark:text-slate-300">{c.noOfResource.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                            <td className="px-3 py-2.5 text-right font-mono text-slate-700 dark:text-slate-300">{c.workingHour.toFixed(2)}</td>
                            <td className="px-3 py-2.5 text-right font-mono text-slate-700 dark:text-slate-300">{c.workingDay.toFixed(2)}</td>
                            <td className="px-3 py-2.5 text-right font-mono text-teal-600 dark:text-teal-400 font-bold">{c.cpm.toFixed(4)}</td>
                            <td className="px-3 py-2.5 text-right font-mono text-teal-700 dark:text-teal-300 font-bold">{c.appliedCpm.toFixed(4)}</td>
                            <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300">{c.currency}</td>
                            <td className="px-3 py-2.5 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                c.status === "Active"
                                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                  : "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                              }`}>{c.status}</span>
                            </td>
                          </tr>
                        ))}
                        {costingConfigs.length === 0 && (
                          <tr>
                            <td colSpan={13} className="px-4 py-8 text-center text-slate-400 text-xs">
                              No costing configurations found. Click "Add Configuration" to create one.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Showing count footer */}
                  <p className="text-[11px] text-slate-400 pt-1">
                    Showing 1 to {costingConfigs.length} of {costingConfigs.length} entries
                  </p>

                  {/* Costing Config Modal */}
                  {costingModal.open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
                      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                          <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                            <Calculator className="size-4 text-teal-500" />
                            {costingModal.item ? "Update Costing Configuration" : "Costing Configuration"}
                          </h3>
                          <button onClick={() => setCostingModal({ open: false })} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16} /></button>
                        </div>

                        <div className="p-5 space-y-3 max-h-[75vh] overflow-y-auto">
                          <div className="grid grid-cols-2 gap-3">
                            {/* Setup Date */}
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Setup Date <span className="text-rose-500">*</span></label>
                              <input
                                type="text"
                                value={costingForm.setupDate || ""}
                                onChange={(e) => setCostingForm({ ...costingForm, setupDate: e.target.value })}
                                placeholder="DD/MM/YYYY"
                                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                              />
                            </div>
                            {/* Year */}
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Year <span className="text-rose-500">*</span></label>
                              <select
                                value={costingForm.year || ""}
                                onChange={(e) => setCostingForm({ ...costingForm, year: Number(e.target.value) })}
                                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                              >
                                <option value="">Select Year...</option>
                                {[2023,2024,2025,2026,2027,2028].map(y => <option key={y} value={y}>{y}</option>)}
                              </select>
                            </div>
                            {/* Month */}
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Month <span className="text-rose-500">*</span></label>
                              <select
                                value={costingForm.month || ""}
                                onChange={(e) => setCostingForm({ ...costingForm, month: e.target.value })}
                                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                              >
                                <option value="">Select...</option>
                                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                              </select>
                            </div>
                            {/* CM Expense */}
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">CM Expense <span className="text-rose-500">*</span></label>
                              <input
                                type="number"
                                value={costingForm.cmExpense || ""}
                                onChange={(e) => {
                                  const v = Number(e.target.value);
                                  const f = { ...costingForm, cmExpense: v };
                                  setCostingForm({ ...f, cpm: calcCpm(f) });
                                }}
                                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                              />
                            </div>
                            {/* No Of Resource */}
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">No Of Resource <span className="text-rose-500">*</span></label>
                              <input
                                type="number"
                                value={costingForm.noOfResource || ""}
                                onChange={(e) => {
                                  const v = Number(e.target.value);
                                  const f = { ...costingForm, noOfResource: v };
                                  setCostingForm({ ...f, cpm: calcCpm(f) });
                                }}
                                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                              />
                            </div>
                            {/* Working Hour */}
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Working Hour <span className="text-rose-500">*</span></label>
                              <input
                                type="number"
                                value={costingForm.workingHour || ""}
                                onChange={(e) => {
                                  const v = Number(e.target.value);
                                  const f = { ...costingForm, workingHour: v };
                                  setCostingForm({ ...f, cpm: calcCpm(f) });
                                }}
                                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                              />
                            </div>
                            {/* Working Day */}
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Working Day <span className="text-rose-500">*</span></label>
                              <input
                                type="number"
                                value={costingForm.workingDay || ""}
                                onChange={(e) => {
                                  const v = Number(e.target.value);
                                  const f = { ...costingForm, workingDay: v };
                                  setCostingForm({ ...f, cpm: calcCpm(f) });
                                }}
                                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                              />
                            </div>
                            {/* CPM (auto-calculated) */}
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">CPM <span className="text-rose-500">*</span> <span className="text-[10px] text-teal-500 font-normal">(auto-calculated)</span></label>
                              <input
                                type="text"
                                readOnly
                                value={costingForm.cpm?.toFixed(4) || "0.0000"}
                                className="w-full text-xs px-3 py-2 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/50 rounded-lg text-teal-700 dark:text-teal-300 font-mono font-bold cursor-not-allowed"
                              />
                            </div>
                            {/* Applied CPM */}
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Applied CPM <span className="text-rose-500">*</span></label>
                              <input
                                type="number"
                                step="0.0001"
                                value={costingForm.appliedCpm || ""}
                                onChange={(e) => setCostingForm({ ...costingForm, appliedCpm: Number(e.target.value) })}
                                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                              />
                            </div>
                            {/* Currency */}
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Currency <span className="text-rose-500">*</span></label>
                              <select
                                value={costingForm.currency || "USD"}
                                onChange={(e) => setCostingForm({ ...costingForm, currency: e.target.value })}
                                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                              >
                                <option value=""></option>
                                {["USD","EUR","GBP","BDT","JPY","CAD"].map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>
                          </div>

                          {/* Status — full width */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Status <span className="text-rose-500">*</span></label>
                            <select
                              value={costingForm.status || "Active"}
                              onChange={(e) => setCostingForm({ ...costingForm, status: e.target.value as "Active" | "Inactive" })}
                              className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                            >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                          </div>
                        </div>

                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                          <button
                            onClick={() => setCostingModal({ open: false })}
                            className="px-4 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-sm transition cursor-pointer"
                          >
                            CLOSE
                          </button>
                          <button
                            onClick={handleSaveCosting}
                            className="px-5 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-sm transition cursor-pointer"
                          >
                            {costingModal.item ? "UPDATE" : "CREATE"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : searchTab === "company-wise-merc-setting" ? (
                <CompanyWiseMercSettingView />
              ) : searchTab === "payment-terms" ? (
                <div className="space-y-0">
                  {/* Table Header */}
                  <div className="bg-white dark:bg-slate-900 rounded-t-2xl border border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <DollarSign className="size-4 text-teal-500" /> Payment Terms — {filteredPaymentTerms.length} Record{filteredPaymentTerms.length !== 1 ? "s" : ""}
                    </span>
                    <button
                      onClick={() => handleOpenPaymentTermModal()}
                      className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 duration-100"
                    >
                      <Plus size={14} /> Add New
                    </button>
                  </div>

                  {/* Table */}
                  <div className="bg-white dark:bg-slate-900 rounded-b-2xl border border-t-0 border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-4 py-3 text-center w-20">Actions</th>
                          <th className="px-4 py-3 text-center w-16">SL</th>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">IsActive</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                        {filteredPaymentTerms.map((p, idx) => (
                          <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="px-4 py-2.5 text-center">
                              <button
                                onClick={() => handleOpenPaymentTermModal(p)}
                                className="p-1 text-amber-500 hover:bg-amber-500/10 rounded transition cursor-pointer"
                                title="Edit"
                              >
                                <Pencil size={13} />
                              </button>
                            </td>
                            <td className="px-4 py-2.5 text-center text-slate-500">{idx + 1}</td>
                            <td className="px-4 py-2.5 text-slate-800 dark:text-slate-200">{p.shortName}</td>
                            <td className="px-4 py-2.5">
                              <span className={`text-xs font-semibold ${
                                p.status === "Active" ? "text-emerald-600" : "text-slate-400"
                              }`}>{p.status}</span>
                            </td>
                          </tr>
                        ))}
                        {filteredPaymentTerms.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-slate-400 text-xs">
                              No payment terms found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer count */}
                  <p className="text-[11px] text-slate-400 pt-1">
                    Showing 1 to {filteredPaymentTerms.length} of {paymentTerms.length} entries
                  </p>

                  {/* Modal */}
                  {paymentTermModal.open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
                      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                          <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                            <DollarSign className="size-4 text-teal-500" />
                            {paymentTermModal.item ? "Update PaymentTerms Information" : "Add New PaymentTerms"}
                          </h3>
                          <button onClick={() => setPaymentTermModal({ open: false })} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16} /></button>
                        </div>

                        <div className="p-5 space-y-4">
                          {/* Short Name */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Short Name <span className="text-rose-500">*</span></label>
                            <input
                              type="text"
                              value={paymentTermForm.shortName || ""}
                              onChange={(e) => setPaymentTermForm({ ...paymentTermForm, shortName: e.target.value })}
                              className="w-full text-xs px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                              placeholder="e.g. 120 Days BBLC"
                            />
                          </div>

                          {/* IsActive */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">IsActive <span className="text-rose-500">*</span></label>
                            <select
                              value={paymentTermForm.status || ""}
                              onChange={(e) => setPaymentTermForm({ ...paymentTermForm, status: e.target.value as "Active" | "Inactive" })}
                              className="w-full text-xs px-3 py-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                            >
                              <option value=""></option>
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                          </div>
                        </div>

                        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                          <button
                            onClick={() => setPaymentTermModal({ open: false })}
                            className="px-4 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-sm transition cursor-pointer"
                          >
                            CLOSE
                          </button>
                          <button
                            onClick={handleSavePaymentTerm}
                            className="px-5 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-sm transition cursor-pointer"
                          >
                            {paymentTermModal.item ? "UPDATE" : "CREATE"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : searchTab === "buying-house" ? (
                <div className="space-y-0">
                  {/* Table Header */}
                  <div className="bg-white dark:bg-slate-900 rounded-t-2xl border border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Building2 className="size-4 text-teal-500" /> Buying House — {filteredBuyingHouses.length} Record{filteredBuyingHouses.length !== 1 ? "s" : ""}
                    </span>
                    <button
                      onClick={() => handleOpenBuyingHouseModal()}
                      className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 duration-100"
                    >
                      <Plus size={14} /> Add New
                    </button>
                  </div>

                  {/* Table */}
                  <div className="bg-white dark:bg-slate-900 rounded-b-2xl border border-t-0 border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-4 py-3 text-center w-20">Actions</th>
                          <th className="px-4 py-3 text-center w-12">SL</th>
                          <th className="px-4 py-3">Short Name</th>
                          <th className="px-4 py-3">Full Name</th>
                          <th className="px-4 py-3">Contact Person</th>
                          <th className="px-4 py-3">Address</th>
                          <th className="px-4 py-3">Phone</th>
                          <th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3">Fax</th>
                          <th className="px-4 py-3">IsActive</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                        {filteredBuyingHouses.map((b, idx) => (
                          <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="px-4 py-2.5 text-center">
                              <button
                                onClick={() => handleOpenBuyingHouseModal(b)}
                                className="p-1 text-amber-500 hover:bg-amber-500/10 rounded transition cursor-pointer"
                                title="Edit"
                              >
                                <Pencil size={13} />
                              </button>
                            </td>
                            <td className="px-4 py-2.5 text-center text-slate-500">{idx + 1}</td>
                            <td className="px-4 py-2.5 font-bold text-slate-800 dark:text-slate-200">{b.shortName}</td>
                            <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300">{b.fullName}</td>
                            <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{b.contactPerson}</td>
                            <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{b.address}</td>
                            <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{b.phone}</td>
                            <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{b.email}</td>
                            <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{b.fax}</td>
                            <td className="px-4 py-2.5">
                              <span className={`text-xs font-semibold ${
                                b.status === "Active" ? "text-emerald-600" : "text-slate-400"
                              }`}>{b.status}</span>
                            </td>
                          </tr>
                        ))}
                        {filteredBuyingHouses.length === 0 && (
                          <tr>
                            <td colSpan={10} className="px-4 py-8 text-center text-slate-400 text-xs">No buying houses found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-[11px] text-slate-400 pt-1">
                    Showing 1 to {filteredBuyingHouses.length} of {buyingHouses.length} entries
                  </p>

                  {/* Modal */}
                  {buyingHouseModal.open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
                      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                          <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                            <Building2 className="size-4 text-teal-500" />
                            {buyingHouseModal.item ? "Update Buyinghouse Information" : "Add New Buyinghouse"}
                          </h3>
                          <button onClick={() => setBuyingHouseModal({ open: false })} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16} /></button>
                        </div>

                        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                          {/* Short Name */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Short Name <span className="text-rose-500">*</span></label>
                            <input type="text" value={buyingHouseForm.shortName || ""}
                              onChange={(e) => setBuyingHouseForm({ ...buyingHouseForm, shortName: e.target.value })}
                              className="w-full text-xs px-3 py-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                            />
                          </div>
                          {/* Full Name */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Full Name <span className="text-rose-500">*</span></label>
                            <input type="text" value={buyingHouseForm.fullName || ""}
                              onChange={(e) => setBuyingHouseForm({ ...buyingHouseForm, fullName: e.target.value })}
                              className="w-full text-xs px-3 py-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                            />
                          </div>
                          {/* Contact Person */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Contact Person</label>
                            <input type="text" value={buyingHouseForm.contactPerson || ""}
                              onChange={(e) => setBuyingHouseForm({ ...buyingHouseForm, contactPerson: e.target.value })}
                              className="w-full text-xs px-3 py-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                            />
                          </div>
                          {/* Address */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Address</label>
                            <input type="text" value={buyingHouseForm.address || ""}
                              onChange={(e) => setBuyingHouseForm({ ...buyingHouseForm, address: e.target.value })}
                              className="w-full text-xs px-3 py-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                            />
                          </div>
                          {/* Phone */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Phone</label>
                            <input type="text" value={buyingHouseForm.phone || ""}
                              onChange={(e) => setBuyingHouseForm({ ...buyingHouseForm, phone: e.target.value })}
                              className="w-full text-xs px-3 py-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                            />
                          </div>
                          {/* Email */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Email</label>
                            <input type="email" value={buyingHouseForm.email || ""}
                              onChange={(e) => setBuyingHouseForm({ ...buyingHouseForm, email: e.target.value })}
                              className="w-full text-xs px-3 py-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                            />
                          </div>
                          {/* Fax */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Fax</label>
                            <input type="text" value={buyingHouseForm.fax || ""}
                              onChange={(e) => setBuyingHouseForm({ ...buyingHouseForm, fax: e.target.value })}
                              className="w-full text-xs px-3 py-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                            />
                          </div>
                          {/* IsActive */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">IsActive <span className="text-rose-500">*</span></label>
                            <select
                              value={buyingHouseForm.status || "Active"}
                              onChange={(e) => setBuyingHouseForm({ ...buyingHouseForm, status: e.target.value as "Active" | "Inactive" })}
                              className="w-full text-xs px-3 py-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                            >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                          </div>
                        </div>

                        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                          <button
                            onClick={() => setBuyingHouseModal({ open: false })}
                            className="px-4 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-sm transition cursor-pointer"
                          >
                            CLOSE
                          </button>
                          <button
                            onClick={handleSaveBuyingHouse}
                            className="px-5 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-sm transition cursor-pointer"
                          >
                            {buyingHouseModal.item ? "UPDATE" : "CREATE"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : searchTab === "buyer-wise-brand" ? (
                <div className="space-y-0">
                  {/* Table Header */}
                  <div className="bg-white dark:bg-slate-900 rounded-t-2xl border border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Tag className="size-4 text-teal-500" /> Buyer Brand — {filteredBuyerWiseBrands.length} Record{filteredBuyerWiseBrands.length !== 1 ? "s" : ""}
                    </span>
                    <button
                      onClick={() => handleOpenBuyerWiseBrandModal()}
                      className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 duration-100"
                    >
                      <Plus size={14} /> Add New
                    </button>
                  </div>

                  {/* Table */}
                  <div className="bg-white dark:bg-slate-900 rounded-b-2xl border border-t-0 border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-4 py-3 text-center w-20">Actions</th>
                          <th className="px-4 py-3 text-center w-16">SL</th>
                          <th className="px-4 py-3">BuyerName</th>
                          <th className="px-4 py-3">Brand</th>
                          <th className="px-4 py-3">IsActive</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                        {filteredBuyerWiseBrands.map((b, idx) => (
                          <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="px-4 py-2.5 text-center">
                              <button
                                onClick={() => handleOpenBuyerWiseBrandModal(b)}
                                className="p-1 text-amber-500 hover:bg-amber-500/10 rounded transition cursor-pointer"
                                title="Edit"
                              >
                                <Pencil size={13} />
                              </button>
                            </td>
                            <td className="px-4 py-2.5 text-center text-slate-500">{idx + 1}</td>
                            <td className="px-4 py-2.5 text-slate-800 dark:text-slate-200">{b.buyerName}</td>
                            <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300">{b.brand}</td>
                            <td className="px-4 py-2.5">
                              <span className={`text-xs font-semibold ${
                                b.status === "Active" ? "text-emerald-600" : "text-slate-400"
                              }`}>{b.status}</span>
                            </td>
                          </tr>
                        ))}
                        {filteredBuyerWiseBrands.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-xs">No buyer brands found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-[11px] text-slate-400 pt-1">
                    Showing 1 to {filteredBuyerWiseBrands.length} of {buyerWiseBrands.length} entries
                  </p>

                  {/* Modal */}
                  {buyerWiseBrandModal.open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
                      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                          <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                            <Tag className="size-4 text-teal-500" />
                            {buyerWiseBrandModal.item ? "Update BuyerWise Brand Information" : "Add New BuyerWise Brand"}
                          </h3>
                          <button onClick={() => setBuyerWiseBrandModal({ open: false })} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16} /></button>
                        </div>

                        <div className="p-5 space-y-4">
                          {/* Buyer Dropdown */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Buyer <span className="text-rose-500">*</span></label>
                            <select
                              value={buyerWiseBrandForm.buyerName || ""}
                              onChange={(e) => setBuyerWiseBrandForm({ ...buyerWiseBrandForm, buyerName: e.target.value })}
                              className="w-full text-xs px-3 py-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                            >
                              <option value=""></option>
                              {buyers.map(b => (
                                <option key={b.id} value={b.buyerName}>{b.buyerName}</option>
                              ))}
                              {Array.from(new Set(buyerWiseBrands.map(b => b.buyerName)))
                                .filter(name => !buyers.some(b => b.buyerName === name))
                                .map(name => (
                                  <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                          </div>

                          {/* Brand Input */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Brand <span className="text-rose-500">*</span></label>
                            <input
                              type="text"
                              value={buyerWiseBrandForm.brand || ""}
                              onChange={(e) => setBuyerWiseBrandForm({ ...buyerWiseBrandForm, brand: e.target.value })}
                              className="w-full text-xs px-3 py-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                              placeholder="e.g. ASOS"
                            />
                          </div>

                          {/* IsActive */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">IsActive <span className="text-rose-500">*</span></label>
                            <select
                              value={buyerWiseBrandForm.status || "Active"}
                              onChange={(e) => setBuyerWiseBrandForm({ ...buyerWiseBrandForm, status: e.target.value as "Active" | "Inactive" })}
                              className="w-full text-xs px-3 py-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                            >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                          </div>
                        </div>

                        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                          <button
                            onClick={() => setBuyerWiseBrandModal({ open: false })}
                            className="px-4 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-sm transition cursor-pointer"
                          >
                            CLOSE
                          </button>
                          <button
                            onClick={handleSaveBuyerWiseBrand}
                            className="px-5 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-sm transition cursor-pointer"
                          >
                            {buyerWiseBrandModal.item ? "UPDATE" : "CREATE"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : searchTab === "buying-agent" ? (
                <div className="space-y-0">
                  {/* Table Header */}
                  <div className="bg-white dark:bg-slate-900 rounded-t-2xl border border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Briefcase className="size-4 text-teal-500" /> Buying Agent — {filteredBuyingAgents.length} Record{filteredBuyingAgents.length !== 1 ? "s" : ""}
                    </span>
                    <button
                      onClick={() => handleOpenBuyingAgentModal()}
                      className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 duration-100"
                    >
                      <Plus size={14} /> Add New
                    </button>
                  </div>

                  {/* Table */}
                  <div className="bg-white dark:bg-slate-900 rounded-b-2xl border border-t-0 border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-4 py-3 text-center w-20">Actions</th>
                          <th className="px-4 py-3 text-center w-16">SL</th>
                          <th className="px-4 py-3">Short Name</th>
                          <th className="px-4 py-3">Full Name</th>
                          <th className="px-4 py-3">Address</th>
                          <th className="px-4 py-3">Phone</th>
                          <th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3">Fax</th>
                          <th className="px-4 py-3">IsActive</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                        {filteredBuyingAgents.map((a, idx) => (
                          <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="px-4 py-2.5 text-center">
                              <button
                                onClick={() => handleOpenBuyingAgentModal(a)}
                                className="p-1 text-amber-500 hover:bg-amber-500/10 rounded transition cursor-pointer"
                                title="Edit"
                              >
                                <Pencil size={13} />
                              </button>
                            </td>
                            <td className="px-4 py-2.5 text-center text-slate-500">{idx + 1}</td>
                            <td className="px-4 py-2.5 text-slate-800 dark:text-slate-200 font-bold">{a.shortName}</td>
                            <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300">{a.fullName}</td>
                            <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{a.address}</td>
                            <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{a.phone}</td>
                            <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{a.email}</td>
                            <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{a.fax}</td>
                            <td className="px-4 py-2.5">
                              <span className={`text-xs font-semibold ${
                                a.status === "Active" ? "text-emerald-600" : "text-slate-400"
                              }`}>{a.status}</span>
                            </td>
                          </tr>
                        ))}
                        {filteredBuyingAgents.length === 0 && (
                          <tr>
                            <td colSpan={9} className="px-4 py-8 text-center text-slate-400 text-xs">No buying agents found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-[11px] text-slate-400 pt-1">
                    Showing 1 to {filteredBuyingAgents.length} of {buyingAgents.length} entries
                  </p>

                  {/* Modal */}
                  {buyingAgentModal.open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
                      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                          <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                            <Briefcase className="size-4 text-teal-500" />
                            {buyingAgentModal.item ? "Update Buying Agent Information" : "Add New Buying Agent"}
                          </h3>
                          <button onClick={() => setBuyingAgentModal({ open: false })} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16} /></button>
                        </div>

                        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                          {/* Short Name */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Short Name <span className="text-rose-500">*</span></label>
                            <input
                              type="text"
                              value={buyingAgentForm.shortName || ""}
                              onChange={(e) => setBuyingAgentForm({ ...buyingAgentForm, shortName: e.target.value })}
                              className="w-full text-xs px-3 py-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                              placeholder="e.g. JMS Buyer Agent"
                            />
                          </div>

                          {/* Full Name */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Full Name <span className="text-rose-500">*</span></label>
                            <input
                              type="text"
                              value={buyingAgentForm.fullName || ""}
                              onChange={(e) => setBuyingAgentForm({ ...buyingAgentForm, fullName: e.target.value })}
                              className="w-full text-xs px-3 py-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                              placeholder="e.g. JMS Buyer Agent"
                            />
                          </div>

                          {/* Address */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Address</label>
                            <input
                              type="text"
                              value={buyingAgentForm.address || ""}
                              onChange={(e) => setBuyingAgentForm({ ...buyingAgentForm, address: e.target.value })}
                              className="w-full text-xs px-3 py-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                            />
                          </div>

                          {/* Phone / Email Grid */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Phone</label>
                              <input
                                type="text"
                                value={buyingAgentForm.phone || ""}
                                onChange={(e) => setBuyingAgentForm({ ...buyingAgentForm, phone: e.target.value })}
                                className="w-full text-xs px-3 py-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Email</label>
                              <input
                                type="email"
                                value={buyingAgentForm.email || ""}
                                onChange={(e) => setBuyingAgentForm({ ...buyingAgentForm, email: e.target.value })}
                                className="w-full text-xs px-3 py-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                              />
                            </div>
                          </div>

                          {/* Fax / IsActive Grid */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Fax</label>
                              <input
                                type="text"
                                value={buyingAgentForm.fax || ""}
                                onChange={(e) => setBuyingAgentForm({ ...buyingAgentForm, fax: e.target.value })}
                                className="w-full text-xs px-3 py-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">IsActive</label>
                              <select
                                value={buyingAgentForm.status || "Active"}
                                onChange={(e) => setBuyingAgentForm({ ...buyingAgentForm, status: e.target.value as "Active" | "Inactive" })}
                                className="w-full text-xs px-3 py-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                              >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                          <button
                            onClick={() => setBuyingAgentModal({ open: false })}
                            className="px-4 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-sm transition cursor-pointer"
                          >
                            CLOSE
                          </button>
                          <button
                            onClick={handleSaveBuyingAgent}
                            className="px-5 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-sm transition cursor-pointer"
                          >
                            {buyingAgentModal.item ? "UPDATE" : "CREATE"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : searchTab === "supplier" ? (
                <div className="space-y-0">
                  {/* Table Header */}
                  <div className="bg-white dark:bg-slate-900 rounded-t-2xl border border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Briefcase className="size-4 text-teal-500" /> Supplier — {filteredSuppliersList.length} Record{filteredSuppliersList.length !== 1 ? "s" : ""}
                    </span>
                    <button
                      onClick={() => handleOpenSupplierModal()}
                      className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 duration-100"
                    >
                      <Plus size={14} /> Add New
                    </button>
                  </div>

                  {/* Table */}
                  <div className="bg-white dark:bg-slate-900 rounded-b-2xl border border-t-0 border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-4 py-3 text-center w-20">Actions</th>
                          <th className="px-4 py-3 text-center w-16">SL</th>
                          <th className="px-4 py-3">Company Name</th>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Designation</th>
                          <th className="px-4 py-3">Address</th>
                          <th className="px-4 py-3">E-mail</th>
                          <th className="px-4 py-3">Cell</th>
                          <th className="px-4 py-3">IsActive</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                        {filteredSuppliersList.map((s, idx) => (
                          <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="px-4 py-2.5 text-center">
                              <button
                                onClick={() => handleOpenSupplierModal(s)}
                                className="p-1 text-amber-500 hover:bg-amber-500/10 rounded transition cursor-pointer"
                                title="Edit"
                              >
                                <Pencil size={13} />
                              </button>
                            </td>
                            <td className="px-4 py-2.5 text-center text-slate-500">{idx + 1}</td>
                            <td className="px-4 py-2.5 text-slate-800 dark:text-slate-200 font-bold">{s.companyName}</td>
                            <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300">{s.contactName}</td>
                            <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{s.designation}</td>
                            <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{s.address}</td>
                            <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{s.email}</td>
                            <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{s.cell}</td>
                            <td className="px-4 py-2.5">
                              <span className={`text-xs font-semibold ${
                                s.status === "Active" ? "text-emerald-600" : "text-slate-400"
                              }`}>{s.status}</span>
                            </td>
                          </tr>
                        ))}
                        {filteredSuppliersList.length === 0 && (
                          <tr>
                            <td colSpan={9} className="px-4 py-8 text-center text-slate-400 text-xs">No suppliers found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-[11px] text-slate-400 pt-1">
                    Showing 1 to {filteredSuppliersList.length} of {suppliers.length} entries
                  </p>

                  {/* Modal */}
                  {supplierModal.open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
                      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                          <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                            <Briefcase className="size-4 text-teal-500" />
                            {supplierModal.item ? "Update Supplier Information" : "Add New Supplier"}
                          </h3>
                          <button onClick={() => setSupplierModal({ open: false })} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16} /></button>
                        </div>

                        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                          {/* Company Name */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Company Name <span className="text-rose-500">*</span></label>
                            <input
                              type="text"
                              value={supplierForm.companyName || ""}
                              onChange={(e) => setSupplierForm({ ...supplierForm, companyName: e.target.value })}
                              className="w-full text-xs px-3 py-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                              placeholder="e.g. A. Rashid Sikder Ind. Limited."
                            />
                          </div>

                          {/* Name */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Name <span className="text-rose-500">*</span></label>
                            <input
                              type="text"
                              value={supplierForm.contactName || ""}
                              onChange={(e) => setSupplierForm({ ...supplierForm, contactName: e.target.value })}
                              className="w-full text-xs px-3 py-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                              placeholder="e.g. Md. Shahidul Haque"
                            />
                          </div>

                          {/* Designation */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Designation <span className="text-rose-500">*</span></label>
                            <input
                              type="text"
                              value={supplierForm.designation || ""}
                              onChange={(e) => setSupplierForm({ ...supplierForm, designation: e.target.value })}
                              className="w-full text-xs px-3 py-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                              placeholder="e.g. Manager"
                            />
                          </div>

                          {/* Address */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Address <span className="text-rose-500">*</span></label>
                            <input
                              type="text"
                              value={supplierForm.address || ""}
                              onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
                              className="w-full text-xs px-3 py-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                            />
                          </div>

                          {/* E-mail */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">E-mail <span className="text-rose-500">*</span></label>
                            <input
                              type="text"
                              value={supplierForm.email || ""}
                              onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                              className="w-full text-xs px-3 py-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                            />
                          </div>

                          {/* Cell */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Cell <span className="text-rose-500">*</span></label>
                            <input
                              type="text"
                              value={supplierForm.cell || ""}
                              onChange={(e) => setSupplierForm({ ...supplierForm, cell: e.target.value })}
                              className="w-full text-xs px-3 py-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                            />
                          </div>

                          {/* IsActive */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">IsActive <span className="text-rose-500">*</span></label>
                            <select
                              value={supplierForm.status || "Active"}
                              onChange={(e) => setSupplierForm({ ...supplierForm, status: e.target.value as "Active" | "Inactive" })}
                              className="w-full text-xs px-3 py-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                            >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                          </div>
                        </div>

                        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                          <button
                            onClick={() => setSupplierModal({ open: false })}
                            className="px-4 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-sm transition cursor-pointer"
                          >
                            CLOSE
                          </button>
                          <button
                            onClick={handleSaveSupplier}
                            className="px-5 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-sm transition cursor-pointer"
                          >
                            {supplierModal.item ? "UPDATE" : "CREATE"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : ["buyer-name", "fabric-construction", "additional-cost-entry", "rmg-process-loss", "item-department", "gmt-item-name", "body-part"].includes(searchTab) ? null : (
                renderDynamicMasterDB(searchTab, tabLabel)
              )}
        </div>

        {/* ITEM DEPARTMENT REGISTRY */}
        {searchTab === "item-department" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Action Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-t-2xl border border-slate-200 dark:border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toast.success("Exported to Excel")}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer uppercase tracking-wider"
                >
                  Excel
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer uppercase tracking-wider"
                >
                  Print
                </button>
                <button
                  onClick={() => toast.success("Exported to PDF")}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer uppercase tracking-wider"
                >
                  PDF
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={itemDeptSearch}
                    onChange={(e) => setItemDeptSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 w-48 text-slate-800 dark:text-slate-100"
                  />
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <button
                  onClick={() => handleOpenItemDeptModal()}
                  className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-sm active:scale-95 duration-100 cursor-pointer"
                >
                  <Plus size={14} /> Add New
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-b-2xl border border-t-0 border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3 text-center w-20">Actions</th>
                    <th className="px-4 py-3 text-center w-16">SL</th>
                    <th className="px-4 py-3">Department Name</th>
                    <th className="px-4 py-3">Buyer Name</th>
                    <th className="px-4 py-3">Team Name</th>
                    <th className="px-4 py-3 text-center w-24">IsActive</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                  {itemDepartments
                    .filter(d => 
                      d.departmentName.toLowerCase().includes(itemDeptSearch.toLowerCase()) ||
                      d.buyerName.toLowerCase().includes(itemDeptSearch.toLowerCase()) ||
                      d.teamName.toLowerCase().includes(itemDeptSearch.toLowerCase())
                    )
                    .map((d, idx) => (
                      <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-2.5 text-center">
                          <button
                            onClick={() => handleOpenItemDeptModal(d)}
                            className="p-1 text-amber-500 hover:bg-amber-500/10 rounded transition cursor-pointer"
                            title="Edit"
                          >
                            <Pencil size={13} />
                          </button>
                        </td>
                        <td className="px-4 py-2.5 text-center text-slate-500">{idx + 1}</td>
                        <td className="px-4 py-2.5 text-slate-800 dark:text-slate-200 font-bold">{d.departmentName}</td>
                        <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300">{d.buyerName || <span className="text-slate-300 dark:text-slate-700">—</span>}</td>
                        <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{d.teamName || <span className="text-slate-300 dark:text-slate-700">—</span>}</td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                            d.status === "Active" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-slate-500/10 text-slate-500"
                          }`}>
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination / Footer */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>Showing 1 to {itemDepartments.length} of {itemDepartments.length} entries</span>
              <div className="flex items-center gap-1.5 font-bold">
                <button className="px-2 py-1 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 cursor-pointer disabled:opacity-50" disabled>Previous</button>
                <button className="px-2.5 py-1 rounded bg-teal-500 text-white shadow-sm">1</button>
                <button className="px-2 py-1 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 cursor-pointer disabled:opacity-50" disabled>Next</button>
              </div>
            </div>

            {/* Modal */}
            {itemDeptModal.open && (
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                  <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-850 flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      {itemDeptModal.item ? "Update Department" : "Add New Department"}
                    </h3>
                    <button onClick={() => setItemDeptModal({ open: false })} className="p-1 rounded-lg hover:bg-slate-250 dark:hover:bg-slate-800 text-slate-400 transition cursor-pointer">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Department Name */}
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-1.5">Department Name <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        value={itemDeptForm.departmentName || ""}
                        onChange={(e) => setItemDeptForm({ ...itemDeptForm, departmentName: e.target.value })}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        placeholder="e.g. Adults"
                      />
                    </div>

                    {/* Buyer Name */}
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-1.5">Buyer Name</label>
                      <select
                        value={itemDeptForm.buyerName || ""}
                        onChange={(e) => setItemDeptForm({ ...itemDeptForm, buyerName: e.target.value })}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      >
                        <option value="">Select Buyer...</option>
                        {buyers.map(b => (
                          <option key={b.id} value={b.buyerName}>{b.buyerName}</option>
                        ))}
                      </select>
                    </div>

                    {/* Team Name */}
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-1.5">Team Name</label>
                      <select
                        value={itemDeptForm.teamName || ""}
                        onChange={(e) => setItemDeptForm({ ...itemDeptForm, teamName: e.target.value })}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      >
                        <option value="">Select Team...</option>
                        {defaultTeams.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    {/* IsActive */}
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-1.5">IsActive <span className="text-rose-500">*</span></label>
                      <select
                        value={itemDeptForm.status || "Active"}
                        onChange={(e) => setItemDeptForm({ ...itemDeptForm, status: e.target.value as "Active" | "Inactive" })}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <button
                        type="button"
                        onClick={() => setItemDeptModal({ open: false })}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        CLOSE
                      </button>
                      <button
                        onClick={handleSaveItemDept}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        {itemDeptModal.item ? "UPDATE" : "CREATE"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* GARMENT ITEM NAME REGISTRY */}
        {searchTab === "gmt-item-name" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Top Filter Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-wrap items-end gap-3 shadow-xs">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-505">Buyer Name</span>
                <select
                  value={gmtItemBuyerFilter}
                  onChange={(e) => setGmtItemBuyerFilter(e.target.value)}
                  className="text-xs px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:border-teal-500 w-56 font-semibold text-slate-800 dark:text-slate-100"
                >
                  <option value="All">All Buyers...</option>
                  {buyers.map(b => (
                    <option key={b.id} value={b.buyerName}>{b.buyerName}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => toast.success("Filtered successfully")}
                className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-lg transition shadow-sm active:scale-95 cursor-pointer uppercase tracking-wider"
              >
                Search
              </button>
            </div>

            {/* Main Registry */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/20">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toast.success("Exported to Excel")}
                    className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer uppercase tracking-wider"
                  >
                    Excel
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer uppercase tracking-wider"
                  >
                    Print
                  </button>
                  <button
                    onClick={() => toast.success("Exported to PDF")}
                    className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer uppercase tracking-wider"
                  >
                    PDF
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={gmtItemSearch}
                      onChange={(e) => setGmtItemSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 w-48 text-slate-800 dark:text-slate-100"
                    />
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  <button
                    onClick={() => handleOpenGmtItemModal()}
                    className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-sm active:scale-95 duration-100 cursor-pointer"
                  >
                    <Plus size={14} /> Add New Item
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-3 text-center w-20">Actions</th>
                      <th className="px-4 py-3 text-center w-16">SL</th>
                      <th className="px-4 py-3">Item Name</th>
                      <th className="px-4 py-3">Commercial Name</th>
                      <th className="px-4 py-3">Product Type</th>
                      <th className="px-4 py-3 text-right">Standard Efficiency</th>
                      <th className="px-4 py-3 text-right">SMV</th>
                      <th className="px-4 py-3">Buyer Name</th>
                      <th className="px-4 py-3">Body Part</th>
                      <th className="px-4 py-3 text-center w-24">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                    {garmentItems
                      .filter(i => {
                        const matchesSearch = 
                          i.itemName.toLowerCase().includes(gmtItemSearch.toLowerCase()) ||
                          i.commercialName.toLowerCase().includes(gmtItemSearch.toLowerCase()) ||
                          i.buyerName.toLowerCase().includes(gmtItemSearch.toLowerCase());
                        const matchesBuyer = gmtItemBuyerFilter === "All" || i.buyerName === gmtItemBuyerFilter;
                        return matchesSearch && matchesBuyer;
                      })
                      .map((i, idx) => (
                        <tr key={i.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="px-4 py-2.5 text-center">
                            <button
                              onClick={() => handleOpenGmtItemModal(i)}
                              className="p-1 text-amber-500 hover:bg-amber-500/10 rounded transition cursor-pointer"
                              title="Edit"
                            >
                              <Pencil size={13} />
                            </button>
                          </td>
                          <td className="px-4 py-2.5 text-center text-slate-500">{idx + 1}</td>
                          <td className="px-4 py-2.5 text-slate-800 dark:text-slate-200 font-bold">{i.itemName}</td>
                          <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300">{i.commercialName || <span className="text-slate-300">—</span>}</td>
                          <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{i.productType || <span className="text-slate-300">—</span>}</td>
                          <td className="px-4 py-2.5 text-right font-mono">{i.standardEfficiency || <span className="text-slate-300">—</span>}</td>
                          <td className="px-4 py-2.5 text-right font-mono">{i.smv || <span className="text-slate-300">—</span>}</td>
                          <td className="px-4 py-2.5 text-slate-750 dark:text-slate-300">{i.buyerName || <span className="text-slate-300">—</span>}</td>
                          <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{i.bodyPart || <span className="text-slate-300">—</span>}</td>
                          <td className="px-4 py-2.5 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                              i.status === "Active" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-slate-500/10 text-slate-500"
                            }`}>
                              {i.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination / Footer */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>Showing 1 to {garmentItems.length} of {garmentItems.length} entries</span>
              <div className="flex items-center gap-1.5 font-bold">
                <button className="px-2 py-1 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 cursor-pointer disabled:opacity-50" disabled>Previous</button>
                <button className="px-2.5 py-1 rounded bg-teal-500 text-white shadow-sm">1</button>
                <button className="px-2 py-1 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 cursor-pointer disabled:opacity-50" disabled>Next</button>
              </div>
            </div>

            {/* Modal */}
            {gmtItemModal.open && (
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                  <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-850 flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      {gmtItemModal.item ? "Update Item Name Information" : "Add New Item"}
                    </h3>
                    <button onClick={() => setGmtItemModal({ open: false })} className="p-1 rounded-lg hover:bg-slate-250 dark:hover:bg-slate-800 text-slate-400 transition cursor-pointer">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* Item Name */}
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-505 mb-1.5">Item Name <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        value={gmtItemForm.itemName || ""}
                        onChange={(e) => setGmtItemForm({ ...gmtItemForm, itemName: e.target.value })}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        placeholder="e.g. Apron"
                      />
                    </div>

                    {/* Commercial Name */}
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-505 mb-1.5">Commercial Name</label>
                      <input
                        type="text"
                        value={gmtItemForm.commercialName || ""}
                        onChange={(e) => setGmtItemForm({ ...gmtItemForm, commercialName: e.target.value })}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        placeholder="e.g. Apron"
                      />
                    </div>

                    {/* Product Type */}
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-505 mb-1.5">Product Type</label>
                      <select
                        value={gmtItemForm.productType || ""}
                        onChange={(e) => setGmtItemForm({ ...gmtItemForm, productType: e.target.value })}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      >
                        <option value="">Select Product Type...</option>
                        <option value="Top">Top</option>
                        <option value="Bottom">Bottom</option>
                        <option value="Innerwear">Innerwear</option>
                        <option value="Outwear">Outwear</option>
                      </select>
                    </div>

                    {/* Body Part */}
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-505 mb-1.5">Body Part</label>
                      <input
                        type="text"
                        value={gmtItemForm.bodyPart || ""}
                        onChange={(e) => setGmtItemForm({ ...gmtItemForm, bodyPart: e.target.value })}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        placeholder="ALL"
                      />
                    </div>

                    {/* Standard Efficiency */}
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-505 mb-1.5">Standard Efficiency</label>
                      <input
                        type="text"
                        value={gmtItemForm.standardEfficiency || ""}
                        onChange={(e) => setGmtItemForm({ ...gmtItemForm, standardEfficiency: e.target.value })}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      />
                    </div>

                    {/* SMV */}
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-505 mb-1.5">SMV</label>
                      <input
                        type="text"
                        value={gmtItemForm.smv || ""}
                        onChange={(e) => setGmtItemForm({ ...gmtItemForm, smv: e.target.value })}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      />
                    </div>

                    {/* Buyer Name */}
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-505 mb-1.5">Buyer Name</label>
                      <select
                        value={gmtItemForm.buyerName || ""}
                        onChange={(e) => setGmtItemForm({ ...gmtItemForm, buyerName: e.target.value })}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      >
                        <option value="">Select Buyer...</option>
                        {buyers.map(b => (
                          <option key={b.id} value={b.buyerName}>{b.buyerName}</option>
                        ))}
                      </select>
                    </div>

                    {/* IsActive */}
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-505 mb-1.5">IsActive <span className="text-rose-500">*</span></label>
                      <select
                        value={gmtItemForm.status || "Active"}
                        onChange={(e) => setGmtItemForm({ ...gmtItemForm, status: e.target.value as "Active" | "Inactive" })}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <button
                        type="button"
                        onClick={() => setGmtItemModal({ open: false })}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        CLOSE
                      </button>
                      <button
                        onClick={handleSaveGmtItem}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        {gmtItemModal.item ? "UPDATE" : "CREATE"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* BODY PART REGISTRY */}
        {searchTab === "body-part" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Action Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-t-2xl border border-slate-200 dark:border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toast.success("Exported to Excel")}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer uppercase tracking-wider"
                >
                  Excel
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer uppercase tracking-wider"
                >
                  Print
                </button>
                <button
                  onClick={() => toast.success("Exported to PDF")}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer uppercase tracking-wider"
                >
                  PDF
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={bodyPartSearch}
                    onChange={(e) => setBodyPartSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 w-48 text-slate-800 dark:text-slate-100"
                  />
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <button
                  onClick={() => handleOpenBodyPartModal()}
                  className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-sm active:scale-95 duration-100 cursor-pointer"
                >
                  <Plus size={14} /> Add New
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-b-2xl border border-t-0 border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3 text-center w-20">Actions</th>
                    <th className="px-4 py-3 text-center w-16">SL</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">ShortName</th>
                    <th className="px-4 py-3">Body For</th>
                    <th className="px-4 py-3">Nature</th>
                    <th className="px-4 py-3 text-center w-24">IsActive</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                  {bodyParts
                    .filter(p => 
                      p.name.toLowerCase().includes(bodyPartSearch.toLowerCase()) ||
                      p.shortName.toLowerCase().includes(bodyPartSearch.toLowerCase()) ||
                      p.bodyFor.toLowerCase().includes(bodyPartSearch.toLowerCase())
                    )
                    .map((p, idx) => (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-2.5 text-center">
                          <button
                            onClick={() => handleOpenBodyPartModal(p)}
                            className="p-1 text-amber-500 hover:bg-amber-500/10 rounded transition cursor-pointer"
                            title="Edit"
                          >
                            <Pencil size={13} />
                          </button>
                        </td>
                        <td className="px-4 py-2.5 text-center text-slate-500">{idx + 1}</td>
                        <td className="px-4 py-2.5 text-slate-800 dark:text-slate-200 font-bold">{p.name}</td>
                        <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300">{p.shortName || <span className="text-slate-300 dark:text-slate-750">—</span>}</td>
                        <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{p.bodyFor || <span className="text-slate-300 dark:text-slate-750">—</span>}</td>
                        <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{p.nature || <span className="text-slate-300 dark:text-slate-750">—</span>}</td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                            p.status === "Active" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-slate-500/10 text-slate-500"
                          }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination / Footer */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>Showing 1 to {bodyParts.length} of {bodyParts.length} entries</span>
              <div className="flex items-center gap-1.5 font-bold">
                <button className="px-2 py-1 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 cursor-pointer disabled:opacity-50" disabled>Previous</button>
                <button className="px-2.5 py-1 rounded bg-teal-500 text-white shadow-sm">1</button>
                <button className="px-2 py-1 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 cursor-pointer disabled:opacity-50" disabled>Next</button>
              </div>
            </div>

            {/* Modal */}
            {bodyPartModal.open && (
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                  <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-850 flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      {bodyPartModal.item ? "Update Body Part Information" : "Add New Body Part"}
                    </h3>
                    <button onClick={() => setBodyPartModal({ open: false })} className="p-1 rounded-lg hover:bg-slate-250 dark:hover:bg-slate-800 text-slate-400 transition cursor-pointer">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-1.5">Name <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        value={bodyPartForm.name || ""}
                        onChange={(e) => setBodyPartForm({ ...bodyPartForm, name: e.target.value })}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        placeholder="e.g. Collar"
                      />
                    </div>

                    {/* Short Name */}
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-1.5">Short Name</label>
                      <input
                        type="text"
                        value={bodyPartForm.shortName || ""}
                        onChange={(e) => setBodyPartForm({ ...bodyPartForm, shortName: e.target.value })}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        placeholder="e.g. Collar"
                      />
                    </div>

                    {/* Body For */}
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-1.5">Body For</label>
                      <select
                        value={bodyPartForm.bodyFor || ""}
                        onChange={(e) => setBodyPartForm({ ...bodyPartForm, bodyFor: e.target.value })}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      >
                        <option value="">--Select--</option>
                        <option value="Collar">Collar</option>
                        <option value="Body">Body</option>
                        <option value="Bottom">Bottom</option>
                        <option value="Top">Top</option>
                        <option value="Cuff">Cuff</option>
                        <option value="FlatKnit">FlatKnit</option>
                        <option value="RIB">RIB</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>

                    {/* Nature */}
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-1.5">Nature</label>
                      <select
                        value={bodyPartForm.nature || ""}
                        onChange={(e) => setBodyPartForm({ ...bodyPartForm, nature: e.target.value })}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      >
                        <option value="">Select Nature...</option>
                        <option value="Production">Production</option>
                        <option value="Cost Head">Cost Head</option>
                      </select>
                    </div>

                    {/* IsActive */}
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-1.5">IsActive <span className="text-rose-500">*</span></label>
                      <select
                        value={bodyPartForm.status || "Active"}
                        onChange={(e) => setBodyPartForm({ ...bodyPartForm, status: e.target.value as "Active" | "Inactive" })}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <button
                        type="button"
                        onClick={() => setBodyPartModal({ open: false })}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        CLOSE
                      </button>
                      <button
                        type="submit"
                        onClick={handleSaveBodyPart}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        {bodyPartModal.item ? "UPDATE" : "CREATE"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {searchTab === "buyer-name" ? (
          profileViewMode ? (
            /* ────────────────────────────────────────────────────────── */
            /* BUYER PROFILE ACCORDION VIEW                               */
            /* ────────────────────────────────────────────────────────── */
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-800 dark:text-white">Buyer Profile</h2>
                  <p className="text-xs text-slate-400">Configure comprehensive details for registered buyers</p>
                </div>
                <button
                  onClick={() => setProfileViewMode(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition cursor-pointer"
                >
                  ← Back to List
                </button>
              </div>

              <div className="space-y-3">
                {/* 1. Basic Information */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedAccordion(expandedAccordion === "basic-info" ? null : "basic-info")}
                    className={`w-full text-left px-5 py-3.5 font-bold text-xs flex justify-between items-center transition ${
                      expandedAccordion === "basic-info" ? "bg-purple-50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-300" : "bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>Basic Information</span>
                    <span className="text-lg">{expandedAccordion === "basic-info" ? "−" : "+"}</span>
                  </button>
                  {expandedAccordion === "basic-info" && (
                    <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Name <span className="text-rose-500">*</span></label>
                          <input type="text" value={buyerForm.buyerName || ""}
                            onChange={(e) => setBuyerForm({ ...buyerForm, buyerName: e.target.value })}
                            className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-teal-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Short Name</label>
                          <input type="text" value={buyerForm.shortCode || ""}
                            onChange={(e) => setBuyerForm({ ...buyerForm, shortCode: e.target.value })}
                            className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-teal-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Full Name <span className="text-rose-500">*</span></label>
                          <input type="text" value={buyerForm.fullName || ""}
                            onChange={(e) => setBuyerForm({ ...buyerForm, fullName: e.target.value })}
                            className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-teal-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Cut-Off Use <span className="text-rose-500">*</span></label>
                          <select className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-teal-500">
                            <option>No</option>
                            <option>Yes</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Currency <span className="text-rose-500">*</span></label>
                          <select value={buyerForm.currency || "USD"}
                            onChange={(e) => setBuyerForm({ ...buyerForm, currency: e.target.value })}
                            className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-teal-500"
                          >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="BDT">BDT</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">BuyerType <span className="text-rose-500">*</span></label>
                          <select className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-teal-500">
                            <option>Buyer</option>
                            <option>Agent</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Partial Realization <span className="text-rose-500">*</span></label>
                          <select className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-teal-500">
                            <option>No</option>
                            <option>Yes</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Country</label>
                          <select value={buyerForm.country || "Bangladesh"}
                            onChange={(e) => setBuyerForm({ ...buyerForm, country: e.target.value })}
                            className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-teal-500"
                          >
                            <option value="Afghanistan">Afghanistan</option>
                            <option value="Bangladesh">Bangladesh</option>
                            <option value="Canada">Canada</option>
                            <option value="Australia">Australia</option>
                            <option value="Netherlands">Netherlands</option>
                            <option value="Germany">Germany</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">CreditLimit</label>
                          <input type="text" className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-teal-500" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">VAT No</label>
                          <input type="text" className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-teal-500" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">BIN No</label>
                          <input type="text" className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-teal-500" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">TIN No</label>
                          <input type="text" className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-teal-500" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Registration No</label>
                          <input type="text" className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-teal-500" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Quality Level</label>
                          <select className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-teal-500">
                            <option>AQL 2.5</option>
                            <option>AQL 1.5</option>
                            <option>AQL 4.0</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Status <span className="text-rose-500">*</span></label>
                          <select value={buyerForm.status || "Active"}
                            onChange={(e) => setBuyerForm({ ...buyerForm, status: e.target.value as "Active" | "Inactive" })}
                            className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-teal-500"
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                        <div>{/* Empty column for alignment */}</div>
                      </div>

                      <button
                        onClick={handleSaveBuyer}
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-lg transition shadow cursor-pointer"
                      >
                        SUBMIT
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Accounts Information */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedAccordion(expandedAccordion === "accounts" ? null : "accounts")}
                    className={`w-full text-left px-5 py-3.5 font-bold text-xs flex justify-between items-center transition ${
                      expandedAccordion === "accounts" ? "bg-purple-50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-300" : "bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>Accounts Information</span>
                    <span className="text-lg">{expandedAccordion === "accounts" ? "−" : "+"}</span>
                  </button>
                  {expandedAccordion === "accounts" && (
                    <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        {["Account Name", "Discount Account", "Commission Account", "Fraction Account", "Sales Account", "Return Account", "AIT Account", "VAT Account", "VAT Offset", "Others Account", "Other Offset"].map((field) => (
                          <div key={field}>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">{field}</label>
                            <input type="text" className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none" />
                          </div>
                        ))}
                      </div>
                      <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-lg transition shadow">Submit</button>
                    </div>
                  )}
                </div>

                {/* 3. Contact Information */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedAccordion(expandedAccordion === "contact-info" ? null : "contact-info")}
                    className={`w-full text-left px-5 py-3.5 font-bold text-xs flex justify-between items-center transition ${
                      expandedAccordion === "contact-info" ? "bg-purple-50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-300" : "bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>Contact Information</span>
                    <span className="text-lg">{expandedAccordion === "contact-info" ? "−" : "+"}</span>
                  </button>
                  {expandedAccordion === "contact-info" && (
                    <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        {["Address 1", "Address 2", "Address 3", "Phone/Cell No", "Email Address", "Fax", "Website Address"].map((field) => (
                          <div key={field}>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">{field}</label>
                            <input type="text" className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-teal-500" />
                          </div>
                        ))}
                      </div>
                      <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-lg transition shadow">Submit</button>
                    </div>
                  )}
                </div>

                {/* 4. Contact Person */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedAccordion(expandedAccordion === "contact-person" ? null : "contact-person")}
                    className={`w-full text-left px-5 py-3.5 font-bold text-xs flex justify-between items-center transition ${
                      expandedAccordion === "contact-person" ? "bg-purple-50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-300" : "bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>Contact Person</span>
                    <span className="text-lg">{expandedAccordion === "contact-person" ? "−" : "+"}</span>
                  </button>
                  {expandedAccordion === "contact-person" && (
                    <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Person Name <span className="text-rose-500">*</span></label>
                          <input type="text" value={contactPersonForm.name} onChange={(e) => setContactPersonForm({ ...contactPersonForm, name: e.target.value })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Designations</label>
                          <input type="text" value={contactPersonForm.designation} onChange={(e) => setContactPersonForm({ ...contactPersonForm, designation: e.target.value })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Phone/Cell No <span className="text-rose-500">*</span></label>
                          <input type="text" value={contactPersonForm.phone} onChange={(e) => setContactPersonForm({ ...contactPersonForm, phone: e.target.value })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Email Address</label>
                          <input type="text" value={contactPersonForm.email} onChange={(e) => setContactPersonForm({ ...contactPersonForm, email: e.target.value })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (!contactPersonForm.name || !contactPersonForm.phone) { toast.error("Required fields missing"); return; }
                            setContactPersons([...contactPersons, { ...contactPersonForm, id: `cp-${Date.now()}` }]);
                            setContactPersonForm({ name: "", designation: "", phone: "", email: "", status: "Active" });
                            toast.success("Contact added");
                          }}
                          className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg transition"
                        >
                          Submit
                        </button>
                        <button onClick={() => setContactPersonForm({ name: "", designation: "", phone: "", email: "", status: "Active" })} className="px-5 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition">Reset</button>
                      </div>

                      {/* Mini Table */}
                      <table className="w-full text-xs text-left border border-slate-100 mt-2">
                        <thead className="bg-slate-50 uppercase text-[9px] font-extrabold text-slate-400">
                          <tr>
                            <th className="px-3 py-2">Sl</th>
                            <th className="px-3 py-2">Name</th>
                            <th className="px-3 py-2">Desi</th>
                            <th className="px-3 py-2">Phone</th>
                            <th className="px-3 py-2">Email</th>
                            <th className="px-3 py-2">Status</th>
                            <th className="px-3 py-2 text-center">∇</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold">
                          {contactPersons.map((cp, idx) => (
                            <tr key={cp.id}>
                              <td className="px-3 py-2 text-slate-400">{idx + 1}</td>
                              <td className="px-3 py-2 font-bold">{cp.name}</td>
                              <td className="px-3 py-2">{cp.designation}</td>
                              <td className="px-3 py-2 font-mono">{cp.phone}</td>
                              <td className="px-3 py-2">{cp.email}</td>
                              <td className="px-3 py-2 text-emerald-600">{cp.status}</td>
                              <td className="px-3 py-2 text-center">
                                <button onClick={() => setContactPersons(contactPersons.filter(c => c.id !== cp.id))} className="text-rose-500 hover:bg-rose-50 rounded p-1">×</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 5. Applicant Information */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedAccordion(expandedAccordion === "applicant" ? null : "applicant")}
                    className={`w-full text-left px-5 py-3.5 font-bold text-xs flex justify-between items-center transition ${
                      expandedAccordion === "applicant" ? "bg-purple-50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-300" : "bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>Applicant Information</span>
                    <span className="text-lg">{expandedAccordion === "applicant" ? "−" : "+"}</span>
                  </button>
                  {expandedAccordion === "applicant" && (
                    <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Applicant Name <span className="text-rose-500">*</span></label>
                        <input type="text" value={applicantForm.name} onChange={(e) => setApplicantForm({ name: e.target.value })} className="w-full max-w-sm text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg" />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (!applicantForm.name) return;
                            setApplicants([...applicants, { id: `ap-${Date.now()}`, name: applicantForm.name }]);
                            setApplicantForm({ name: "" });
                          }}
                          className="px-5 py-2 bg-orange-500 text-white font-bold text-xs rounded-lg"
                        >Submit</button>
                        <button onClick={() => setApplicantForm({ name: "" })} className="px-5 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-lg">Reset</button>
                      </div>

                      <table className="w-full text-xs text-left border border-slate-100 mt-2">
                        <thead className="bg-slate-50 uppercase text-[9px] font-extrabold text-slate-400">
                          <tr>
                            <th className="px-3 py-2 w-12">Sl</th>
                            <th className="px-3 py-2">Applicant Name</th>
                            <th className="px-3 py-2 text-center w-12">∇</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold">
                          {applicants.map((ap, idx) => (
                            <tr key={ap.id}>
                              <td className="px-3 py-2 text-slate-400">{idx + 1}</td>
                              <td className="px-3 py-2 font-bold">{ap.name}</td>
                              <td className="px-3 py-2 text-center">
                                <button onClick={() => setApplicants(applicants.filter(a => a.id !== ap.id))} className="text-rose-500">×</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 6. Notifying Party Information */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedAccordion(expandedAccordion === "notifying-party" ? null : "notifying-party")}
                    className={`w-full text-left px-5 py-3.5 font-bold text-xs flex justify-between items-center transition ${
                      expandedAccordion === "notifying-party" ? "bg-purple-50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-300" : "bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>Notifying Party Information</span>
                    <span className="text-lg">{expandedAccordion === "notifying-party" ? "−" : "+"}</span>
                  </button>
                  {expandedAccordion === "notifying-party" && (
                    <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Notifying Party <span className="text-rose-500">*</span></label>
                        <input type="text" value={notifyingPartyForm.name} onChange={(e) => setNotifyingPartyForm({ name: e.target.value })} className="w-full max-w-sm text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg" />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (!notifyingPartyForm.name) return;
                            setNotifyingParties([...notifyingParties, { id: `np-${Date.now()}`, name: notifyingPartyForm.name }]);
                            setNotifyingPartyForm({ name: "" });
                          }}
                          className="px-5 py-2 bg-orange-500 text-white font-bold text-xs rounded-lg"
                        >Submit</button>
                        <button onClick={() => setNotifyingPartyForm({ name: "" })} className="px-5 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-lg">Reset</button>
                      </div>

                      <table className="w-full text-xs text-left border border-slate-100 mt-2">
                        <thead className="bg-slate-50 uppercase text-[9px] font-extrabold text-slate-400">
                          <tr>
                            <th className="px-3 py-2 w-12">Sl</th>
                            <th className="px-3 py-2">Notifying Party</th>
                            <th className="px-3 py-2 text-center w-12">∇</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold">
                          {notifyingParties.map((np, idx) => (
                            <tr key={np.id}>
                              <td className="px-3 py-2 text-slate-400">{idx + 1}</td>
                              <td className="px-3 py-2 font-bold">{np.name}</td>
                              <td className="px-3 py-2 text-center">
                                <button onClick={() => setNotifyingParties(notifyingParties.filter(n => n.id !== np.id))} className="text-rose-500">×</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 7. Consignee Information */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedAccordion(expandedAccordion === "consignee" ? null : "consignee")}
                    className={`w-full text-left px-5 py-3.5 font-bold text-xs flex justify-between items-center transition ${
                      expandedAccordion === "consignee" ? "bg-purple-50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-300" : "bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>Consignee Information</span>
                    <span className="text-lg">{expandedAccordion === "consignee" ? "−" : "+"}</span>
                  </button>
                  {expandedAccordion === "consignee" && (
                    <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Consignee <span className="text-rose-500">*</span></label>
                        <input type="text" value={consigneeForm.name} onChange={(e) => setConsigneeForm({ name: e.target.value })} className="w-full max-w-sm text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg" />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (!consigneeForm.name) return;
                            setConsignees([...consignees, { id: `cs-${Date.now()}`, name: consigneeForm.name }]);
                            setConsigneeForm({ name: "" });
                          }}
                          className="px-5 py-2 bg-orange-500 text-white font-bold text-xs rounded-lg"
                        >Submit</button>
                        <button onClick={() => setConsigneeForm({ name: "" })} className="px-5 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-lg">Reset</button>
                      </div>

                      <table className="w-full text-xs text-left border border-slate-100 mt-2">
                        <thead className="bg-slate-50 uppercase text-[9px] font-extrabold text-slate-400">
                          <tr>
                            <th className="px-3 py-2 w-12">Sl</th>
                            <th className="px-3 py-2">Consignee Party</th>
                            <th className="px-3 py-2 text-center w-12">∇</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold">
                          {consignees.map((cs, idx) => (
                            <tr key={cs.id}>
                              <td className="px-3 py-2 text-slate-400">{idx + 1}</td>
                              <td className="px-3 py-2 font-bold">{cs.name}</td>
                              <td className="px-3 py-2 text-center">
                                <button onClick={() => setConsignees(consignees.filter(c => c.id !== cs.id))} className="text-rose-500">×</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 8. Bank Information */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedAccordion(expandedAccordion === "bank" ? null : "bank")}
                    className={`w-full text-left px-5 py-3.5 font-bold text-xs flex justify-between items-center transition ${
                      expandedAccordion === "bank" ? "bg-purple-50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-300" : "bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>Bank Information</span>
                    <span className="text-lg">{expandedAccordion === "bank" ? "−" : "+"}</span>
                  </button>
                  {expandedAccordion === "bank" && (
                    <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Bank Name <span className="text-rose-500">*</span></label>
                          <select value={bankForm.bank} onChange={(e) => setBankForm({ ...bankForm, bank: e.target.value })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg">
                            <option>Standard Chartered</option>
                            <option>HSBC</option>
                            <option>Dhaka Bank</option>
                            <option>Islami Bank</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Branch Name</label>
                          <input type="text" value={bankForm.branch} onChange={(e) => setBankForm({ ...bankForm, branch: e.target.value })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Branch Address <span className="text-rose-500">*</span></label>
                          <input type="text" value={bankForm.address} onChange={(e) => setBankForm({ ...bankForm, address: e.target.value })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Contact Person</label>
                          <input type="text" value={bankForm.cpName} onChange={(e) => setBankForm({ ...bankForm, cpName: e.target.value })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Phone/Cell No</label>
                          <input type="text" value={bankForm.phone} onChange={(e) => setBankForm({ ...bankForm, phone: e.target.value })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Email Address</label>
                          <input type="text" value={bankForm.email} onChange={(e) => setBankForm({ ...bankForm, email: e.target.value })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Status</label>
                          <select value={bankForm.status} onChange={(e) => setBankForm({ ...bankForm, status: e.target.value })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (!bankForm.bank || !bankForm.address) return;
                            setBanks([...banks, { ...bankForm, id: `bk-${Date.now()}` }]);
                            setBankForm({ bank: "Standard Chartered", branch: "", address: "", cpName: "", phone: "", email: "", status: "Active" });
                          }}
                          className="px-5 py-2 bg-orange-500 text-white font-bold text-xs rounded-lg"
                        >Submit</button>
                        <button onClick={() => setBankForm({ bank: "Standard Chartered", branch: "", address: "", cpName: "", phone: "", email: "", status: "Active" })} className="px-5 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-lg">Reset</button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left border border-slate-100 mt-2">
                          <thead className="bg-slate-50 uppercase text-[9px] font-extrabold text-slate-400">
                            <tr>
                              <th className="px-3 py-2">Sl</th>
                              <th className="px-3 py-2">Bank</th>
                              <th className="px-3 py-2">Branch</th>
                              <th className="px-3 py-2">Address</th>
                              <th className="px-3 py-2">CPName</th>
                              <th className="px-3 py-2">Phone</th>
                              <th className="px-3 py-2">Email</th>
                              <th className="px-3 py-2">Status</th>
                              <th className="px-3 py-2 text-center">∇</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-semibold">
                            {banks.map((bk, idx) => (
                              <tr key={bk.id}>
                                <td className="px-3 py-2 text-slate-400">{idx + 1}</td>
                                <td className="px-3 py-2 font-bold">{bk.bank}</td>
                                <td className="px-3 py-2">{bk.branch}</td>
                                <td className="px-3 py-2">{bk.address}</td>
                                <td className="px-3 py-2">{bk.cpName}</td>
                                <td className="px-3 py-2 font-mono">{bk.phone}</td>
                                <td className="px-3 py-2">{bk.email}</td>
                                <td className="px-3 py-2 text-emerald-600">{bk.status}</td>
                                <td className="px-3 py-2 text-center">
                                  <button onClick={() => setBanks(banks.filter(b => b.id !== bk.id))} className="text-rose-500">×</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* 9. Team & Department */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedAccordion(expandedAccordion === "team" ? null : "team")}
                    className={`w-full text-left px-5 py-3.5 font-bold text-xs flex justify-between items-center transition ${
                      expandedAccordion === "team" ? "bg-purple-50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-300" : "bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>Team & Department</span>
                    <span className="text-lg">{expandedAccordion === "team" ? "−" : "+"}</span>
                  </button>
                  {expandedAccordion === "team" && (
                    <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Department <span className="text-rose-500">*</span></label>
                          <input type="text" value={departmentForm.department} onChange={(e) => setDepartmentForm({ ...departmentForm, department: e.target.value })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Merchan Team <span className="text-rose-500">*</span></label>
                          <select value={departmentForm.teamName} onChange={(e) => setDepartmentForm({ ...departmentForm, teamName: e.target.value })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg">
                            <option>Team Gold</option>
                            <option>Team Silver</option>
                            <option>Team Bronze</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Status</label>
                          <select value={departmentForm.status} onChange={(e) => setDepartmentForm({ ...departmentForm, status: e.target.value })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (!departmentForm.department) return;
                            setDepartments([...departments, { ...departmentForm, id: `dp-${Date.now()}` }]);
                            setDepartmentForm({ department: "Merchandising", teamName: "Team Gold", status: "Active" });
                          }}
                          className="px-5 py-2 bg-orange-500 text-white font-bold text-xs rounded-lg"
                        >Submit</button>
                        <button onClick={() => setDepartmentForm({ department: "Merchandising", teamName: "Team Gold", status: "Active" })} className="px-5 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-lg">Reset</button>
                      </div>

                      <table className="w-full text-xs text-left border border-slate-100 mt-2">
                        <thead className="bg-slate-50 uppercase text-[9px] font-extrabold text-slate-400">
                          <tr>
                            <th className="px-3 py-2">Sl</th>
                            <th className="px-3 py-2">Department</th>
                            <th className="px-3 py-2">Team Name</th>
                            <th className="px-3 py-2">Status</th>
                            <th className="px-3 py-2 text-center">∇</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold">
                          {departments.map((dp, idx) => (
                            <tr key={dp.id}>
                              <td className="px-3 py-2 text-slate-400">{idx + 1}</td>
                              <td className="px-3 py-2 font-bold">{dp.department}</td>
                              <td className="px-3 py-2">{dp.teamName}</td>
                              <td className="px-3 py-2 text-emerald-600">{dp.status}</td>
                              <td className="px-3 py-2 text-center">
                                <button onClick={() => setDepartments(departments.filter(d => d.id !== dp.id))} className="text-rose-500">×</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 10. Nominated Suppliers */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedAccordion(expandedAccordion === "nominated-suppliers" ? null : "nominated-suppliers")}
                    className={`w-full text-left px-5 py-3.5 font-bold text-xs flex justify-between items-center transition ${
                      expandedAccordion === "nominated-suppliers" ? "bg-purple-50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-300" : "bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>Nominated Suppliers</span>
                    <span className="text-lg">{expandedAccordion === "nominated-suppliers" ? "−" : "+"}</span>
                  </button>
                  {expandedAccordion === "nominated-suppliers" && (
                    <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Supplier Name <span className="text-rose-500">*</span></label>
                        <select value={nominatedSupplierForm.supplier}
                          onChange={(e) => {
                            const found = suppliers.find(s => s.companyName === e.target.value);
                            setNominatedSupplierForm({
                              supplier: e.target.value,
                              person: found?.contactName || "",
                              address: found?.address || "",
                              phone: found?.cell || "",
                              email: found?.email || ""
                            });
                          }}
                          className="w-full max-w-sm text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg"
                        >
                          {suppliers.map(s => <option key={s.id} value={s.companyName}>{s.companyName}</option>)}
                          {suppliers.length === 0 && <option>Pacific Denim Mills Ltd.</option>}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setNominatedSuppliers([...nominatedSuppliers, { ...nominatedSupplierForm, id: `ns-${Date.now()}` }]);
                            setNominatedSupplierForm({ supplier: suppliers[0]?.companyName || "Pacific Denim Mills Ltd.", person: "", address: "", phone: "", email: "" });
                          }}
                          className="px-5 py-2 bg-orange-500 text-white font-bold text-xs rounded-lg"
                        >Submit</button>
                        <button onClick={() => setNominatedSupplierForm({ supplier: "Pacific Denim Mills Ltd.", person: "", address: "", phone: "", email: "" })} className="px-5 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-lg">Reset</button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left border border-slate-100 mt-2">
                          <thead className="bg-slate-50 uppercase text-[9px] font-extrabold text-slate-400">
                            <tr>
                              <th className="px-3 py-2">Sl</th>
                              <th className="px-3 py-2">Supplier</th>
                              <th className="px-3 py-2">Person</th>
                              <th className="px-3 py-2">Address</th>
                              <th className="px-3 py-2">Phone</th>
                              <th className="px-3 py-2">Email</th>
                              <th className="px-3 py-2 text-center">∇</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-semibold">
                            {nominatedSuppliers.map((ns, idx) => (
                              <tr key={ns.id}>
                                <td className="px-3 py-2 text-slate-400">{idx + 1}</td>
                                <td className="px-3 py-2 font-bold">{ns.supplier}</td>
                                <td className="px-3 py-2">{ns.person}</td>
                                <td className="px-3 py-2">{ns.address}</td>
                                <td className="px-3 py-2 font-mono">{ns.phone}</td>
                                <td className="px-3 py-2">{ns.email}</td>
                                <td className="px-3 py-2 text-center">
                                  <button onClick={() => setNominatedSuppliers(nominatedSuppliers.filter(n => n.id !== ns.id))} className="text-rose-500">×</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* 11. Nominated Size Breakdown */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedAccordion(expandedAccordion === "sizes" ? null : "sizes")}
                    className={`w-full text-left px-5 py-3.5 font-bold text-xs flex justify-between items-center transition ${
                      expandedAccordion === "sizes" ? "bg-purple-50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-300" : "bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>Nominated Size Breakdown</span>
                    <span className="text-lg">{expandedAccordion === "sizes" ? "−" : "+"}</span>
                  </button>
                  {expandedAccordion === "sizes" && (
                    <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Size Group <span className="text-rose-500">*</span></label>
                          <select value={sizeForm.sizeGroup} onChange={(e) => setSizeForm({ ...sizeForm, sizeGroup: e.target.value })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg">
                            <option>Men's Knit</option>
                            <option>Boys Woven</option>
                            <option>Girls Basic</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Size Breakdown</label>
                          <input type="text" value={sizeForm.sizeBreakdown} placeholder="e.g. S, M, L" onChange={(e) => setSizeForm({ ...sizeForm, sizeBreakdown: e.target.value })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Size Ratio</label>
                          <input type="text" value={sizeForm.sizeRatio} placeholder="e.g. 1:2:1" onChange={(e) => setSizeForm({ ...sizeForm, sizeRatio: e.target.value })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (!sizeForm.sizeGroup) return;
                            setSizeBreakdowns([...sizeBreakdowns, { ...sizeForm, id: `sz-${Date.now()}` }]);
                            setSizeForm({ sizeGroup: "Men's Knit", sizeBreakdown: "", sizeRatio: "" });
                          }}
                          className="px-5 py-2 bg-orange-500 text-white font-bold text-xs rounded-lg"
                        >Submit</button>
                        <button onClick={() => setSizeForm({ sizeGroup: "Men's Knit", sizeBreakdown: "", sizeRatio: "" })} className="px-5 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-lg">Reset</button>
                      </div>

                      <table className="w-full text-xs text-left border border-slate-100 mt-2">
                        <thead className="bg-slate-50 uppercase text-[9px] font-extrabold text-slate-400">
                          <tr>
                            <th className="px-3 py-2">Sl</th>
                            <th className="px-3 py-2">Size Group</th>
                            <th className="px-3 py-2">Size Breakdown</th>
                            <th className="px-3 py-2">Size Ratio</th>
                            <th className="px-3 py-2 text-center">∇</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold">
                          {sizeBreakdowns.map((sz, idx) => (
                            <tr key={sz.id}>
                              <td className="px-3 py-2 text-slate-400">{idx + 1}</td>
                              <td className="px-3 py-2 font-bold">{sz.sizeGroup}</td>
                              <td className="px-3 py-2 font-mono">{sz.sizeBreakdown}</td>
                              <td className="px-3 py-2 font-mono">{sz.sizeRatio}</td>
                              <td className="px-3 py-2 text-center">
                                <button onClick={() => setSizeBreakdowns(sizeBreakdowns.filter(s => s.id !== sz.id))} className="text-rose-500">×</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 12. Season Information */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedAccordion(expandedAccordion === "season" ? null : "season")}
                    className={`w-full text-left px-5 py-3.5 font-bold text-xs flex justify-between items-center transition ${
                      expandedAccordion === "season" ? "bg-purple-50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-300" : "bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>Season Information</span>
                    <span className="text-lg">{expandedAccordion === "season" ? "−" : "+"}</span>
                  </button>
                  {expandedAccordion === "season" && (
                    <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Season Name <span className="text-rose-500">*</span></label>
                          <input type="text" value={seasonForm.seasonName} onChange={(e) => setSeasonForm({ ...seasonForm, seasonName: e.target.value })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Status</label>
                          <select value={seasonForm.status} onChange={(e) => setSeasonForm({ ...seasonForm, status: e.target.value })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (!seasonForm.seasonName) return;
                            setSeasons([...seasons, { ...seasonForm, id: `ss-${Date.now()}` }]);
                            setSeasonForm({ seasonName: "", status: "Active" });
                          }}
                          className="px-5 py-2 bg-orange-500 text-white font-bold text-xs rounded-lg"
                        >Submit</button>
                        <button onClick={() => setSeasonForm({ seasonName: "", status: "Active" })} className="px-5 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-lg">Reset</button>
                      </div>

                      <table className="w-full text-xs text-left border border-slate-100 mt-2">
                        <thead className="bg-slate-50 uppercase text-[9px] font-extrabold text-slate-400">
                          <tr>
                            <th className="px-3 py-2 w-12">Sl</th>
                            <th className="px-3 py-2">Season Name</th>
                            <th className="px-3 py-2">Status</th>
                            <th className="px-3 py-2 text-center w-12">∇</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold">
                          {seasons.map((ss, idx) => (
                            <tr key={ss.id}>
                              <td className="px-3 py-2 text-slate-400">{idx + 1}</td>
                              <td className="px-3 py-2 font-bold">{ss.seasonName}</td>
                              <td className="px-3 py-2 text-emerald-600">{ss.status}</td>
                              <td className="px-3 py-2 text-center">
                                <button onClick={() => setSeasons(seasons.filter(s => s.id !== ss.id))} className="text-rose-500">×</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 13. Shipping Information */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedAccordion(expandedAccordion === "shipping" ? null : "shipping")}
                    className={`w-full text-left px-5 py-3.5 font-bold text-xs flex justify-between items-center transition ${
                      expandedAccordion === "shipping" ? "bg-purple-50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-300" : "bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>Shipping Information</span>
                    <span className="text-lg">{expandedAccordion === "shipping" ? "−" : "+"}</span>
                  </button>
                  {expandedAccordion === "shipping" && (
                    <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Country Name <span className="text-rose-500">*</span></label>
                          <select value={shippingForm.country} onChange={(e) => setShippingForm({ ...shippingForm, country: e.target.value })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg">
                            <option value="Afghanistan">Afghanistan</option>
                            <option value="Bangladesh">Bangladesh</option>
                            <option value="Canada">Canada</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Code</label>
                          <input type="text" value={shippingForm.code} onChange={(e) => setShippingForm({ ...shippingForm, code: e.target.value })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Shipping Address</label>
                          <input type="text" value={shippingForm.shippingAddr} onChange={(e) => setShippingForm({ ...shippingForm, shippingAddr: e.target.value })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Dest Port <span className="text-rose-500">*</span></label>
                          <input type="text" value={shippingForm.destPort} onChange={(e) => setShippingForm({ ...shippingForm, destPort: e.target.value })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Dest Port Code <span className="text-rose-500">*</span></label>
                          <input type="text" value={shippingForm.portCode} onChange={(e) => setShippingForm({ ...shippingForm, portCode: e.target.value })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Shipping Mark</label>
                          <input type="text" value={shippingForm.shippingMark} onChange={(e) => setShippingForm({ ...shippingForm, shippingMark: e.target.value })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Status</label>
                          <select value={shippingForm.status} onChange={(e) => setShippingForm({ ...shippingForm, status: e.target.value })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (!shippingForm.country || !shippingForm.destPort) return;
                            setShippings([...shippings, { ...shippingForm, id: `sh-${Date.now()}`, consigneeAddr: "", cargoShipAddr: "" }]);
                            setShippingForm({ country: "Afghanistan", code: "", shippingAddr: "", destPort: "", portCode: "", shippingMark: "", consigneeAddr: "", cargoShipAddr: "", status: "Active" });
                          }}
                          className="px-5 py-2 bg-orange-500 text-white font-bold text-xs rounded-lg"
                        >Submit</button>
                        <button onClick={() => setShippingForm({ country: "Afghanistan", code: "", shippingAddr: "", destPort: "", portCode: "", shippingMark: "", consigneeAddr: "", cargoShipAddr: "", status: "Active" })} className="px-5 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-lg">Reset</button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left border border-slate-100 mt-2">
                          <thead className="bg-slate-50 uppercase text-[9px] font-extrabold text-slate-400">
                            <tr>
                              <th className="px-3 py-2">Sl</th>
                              <th className="px-3 py-2">Country</th>
                              <th className="px-3 py-2">Code</th>
                              <th className="px-3 py-2">ShippingAddr</th>
                              <th className="px-3 py-2">Dest Port</th>
                              <th className="px-3 py-2">Port Code</th>
                              <th className="px-3 py-2">Shipping Mark</th>
                              <th className="px-3 py-2 text-center">∇</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-semibold">
                            {shippings.map((sh, idx) => (
                              <tr key={sh.id}>
                                <td className="px-3 py-2 text-slate-400">{idx + 1}</td>
                                <td className="px-3 py-2 font-bold">{sh.country}</td>
                                <td className="px-3 py-2">{sh.code}</td>
                                <td className="px-3 py-2">{sh.shippingAddr}</td>
                                <td className="px-3 py-2">{sh.destPort}</td>
                                <td className="px-3 py-2 font-mono">{sh.portCode}</td>
                                <td className="px-3 py-2">{sh.shippingMark}</td>
                                <td className="px-3 py-2 text-center">
                                  <button onClick={() => setShippings(shippings.filter(s => s.id !== sh.id))} className="text-rose-500">×</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* 14. Buyer Costing Information */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedAccordion(expandedAccordion === "costing-info" ? null : "costing-info")}
                    className={`w-full text-left px-5 py-3.5 font-bold text-xs flex justify-between items-center transition ${
                      expandedAccordion === "costing-info" ? "bg-purple-50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-300" : "bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>Buyer Costing Information</span>
                    <span className="text-lg">{expandedAccordion === "costing-info" ? "−" : "+"}</span>
                  </button>
                  {expandedAccordion === "costing-info" && (
                    <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">CMP <span className="text-rose-500">*</span></label>
                          <input type="number" step="0.01" value={costingInfo.cmp} onChange={(e) => setCostingInfo({ ...costingInfo, cmp: Number(e.target.value) })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">SMV <span className="text-rose-500">*</span></label>
                          <input type="number" step="0.1" value={costingInfo.smv} onChange={(e) => setCostingInfo({ ...costingInfo, smv: Number(e.target.value) })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Efficiency <span className="text-rose-500">*</span></label>
                          <input type="number" step="0.01" value={costingInfo.efficiency} onChange={(e) => setCostingInfo({ ...costingInfo, efficiency: Number(e.target.value) })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Commercial Cost (%) <span className="text-rose-500">*</span></label>
                          <input type="number" step="0.01" value={costingInfo.commercialCost} onChange={(e) => setCostingInfo({ ...costingInfo, commercialCost: Number(e.target.value) })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Financial Cost (%) <span className="text-rose-500">*</span></label>
                          <input type="number" step="0.01" value={costingInfo.financialCost} onChange={(e) => setCostingInfo({ ...costingInfo, financialCost: Number(e.target.value) })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Commission (%) <span className="text-rose-500">*</span></label>
                          <input type="number" step="0.01" value={costingInfo.commission} onChange={(e) => setCostingInfo({ ...costingInfo, commission: Number(e.target.value) })} className="w-full text-xs px-3 py-2 bg-transparent border border-slate-300 rounded-lg" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { toast.success("Buyer costing updated!"); setProfileViewMode(false); }} className="px-5 py-2 bg-blue-500 text-white font-bold text-xs rounded-lg transition shadow">Submit</button>
                        <button onClick={() => setCostingInfo({ cmp: 0.09, smv: 5.0, efficiency: 0.0, commercialCost: 0.0, financialCost: 0.0, commission: 0.0 })} className="px-5 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-lg">Reset</button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ) : (
            /* ────────────────────────────────────────────────────────── */
            /* BUYERS LIST VIEW                                           */
            /* ────────────────────────────────────────────────────────── */
            <div className="space-y-4 relative">
              {/* Country Search Bar at top */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-wrap items-center gap-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Country Name</span>
                  <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="text-xs px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:border-teal-500"
                  >
                    <option value="All">All...</option>
                    <option value="Afghanistan">Afghanistan</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Germany">Germany</option>
                    <option value="Bangladesh">Bangladesh</option>
                  </select>
                </div>
                <button className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-lg transition active:scale-95 cursor-pointer">
                  SEARCH
                </button>
              </div>

              {/* Data Table */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-lg transition flex items-center gap-1 shadow-sm">
                      Excel
                    </button>
                    <button className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-lg transition flex items-center gap-1 shadow-sm">
                      Print
                    </button>
                    <button className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-lg transition flex items-center gap-1 shadow-sm">
                      PDF
                    </button>
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Registered RMG Buyers ({filteredBuyers.length})</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-3 py-3 text-center w-12">∇</th>
                        <th className="px-3 py-3 text-center w-24">Actions</th>
                        <th className="px-3 py-3">Full Name</th>
                        <th className="px-3 py-3">Short Name</th>
                        <th className="px-3 py-3">Name</th>
                        <th className="px-3 py-3">Phone</th>
                        <th className="px-3 py-3">Email</th>
                        <th className="px-3 py-3">Address</th>
                        <th className="px-3 py-3">Country</th>
                        <th className="px-3 py-3 text-center">IsActive</th>
                        <th className="px-3 py-3 text-right">PrdLeadDays</th>
                        <th className="px-3 py-3 text-right">DefPayDays</th>
                        <th className="px-3 py-3 text-right">ExfactLeadDays</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                      {filteredBuyers
                        .filter(b => countryFilter === "All" || b.country === countryFilter)
                        .map((b, idx) => (
                          <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="px-3 py-2 text-center text-slate-400 font-bold">{String(idx + 1).padStart(2, "0")}</td>
                            <td className="px-3 py-2 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setBuyerForm(b);
                                    setProfileBuyerId(b.id);
                                    setProfileViewMode(true);
                                    setExpandedAccordion("basic-info");
                                  }}
                                  className="p-1 text-amber-500 hover:bg-amber-500/10 rounded transition cursor-pointer"
                                  title="Edit Profile"
                                >
                                  <Pencil size={13} />
                                </button>
                                <button
                                  onClick={() => {
                                    setBuyerForm(b);
                                    setProfileBuyerId(b.id);
                                    setProfileViewMode(true);
                                    setExpandedAccordion("basic-info");
                                  }}
                                  className="p-1 text-blue-500 hover:bg-blue-500/10 rounded transition cursor-pointer"
                                  title="View Details"
                                >
                                  <Search size={13} />
                                </button>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-slate-800 dark:text-slate-200 font-bold">{b.fullName}</td>
                            <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{b.shortCode}</td>
                            <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{b.buyerName}</td>
                            <td className="px-3 py-2 text-slate-600 dark:text-slate-400 font-mono">{b.phone}</td>
                            <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{b.contactEmail}</td>
                            <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{b.address}</td>
                            <td className="px-3 py-2">{b.country}</td>
                            <td className="px-3 py-2 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                                b.status === "Active" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-slate-500/10 text-slate-500"
                              }`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-right font-mono">{b.prdLeadDays}</td>
                            <td className="px-3 py-2 text-right font-mono">{b.defPayDays}</td>
                            <td className="px-3 py-2 text-right font-mono">{b.exfactLeadDays}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-[11px] text-slate-400 p-3">
                  Showing 1 to {filteredBuyers.length} of {buyers.length} entries
                </p>
              </div>

              {/* Floating green plus button in bottom right corner */}
              <button
                onClick={() => {
                  setBuyerForm({
                    shortCode: "",
                    buyerName: "",
                    fullName: "",
                    buyingHouse: "",
                    country: "Bangladesh",
                    aqlStandard: "AQL 2.5",
                    payTerms: "120 Days BBLC",
                    currency: "USD",
                    contactEmail: "",
                    phone: "",
                    address: "",
                    prdLeadDays: 0,
                    defPayDays: 0,
                    exfactLeadDays: 0,
                    status: "Active",
                  });
                  setProfileBuyerId(null);
                  setProfileViewMode(true);
                  setExpandedAccordion("basic-info");
                }}
                className="fixed bottom-6 right-6 size-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer z-40"
              >
                <Plus size={24} />
              </button>
            </div>
          )
        ) : null}



        {searchTab === "fabric-construction" ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Fabric & Yarn Specification Master Library ({filteredFabrics.length})</span>
                    <button
                      onClick={() => handleOpenFabricModal()}
                      className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus size={14} /> Add Fabric Spec
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-4 py-3">Fabric Type</th>
                          <th className="px-4 py-3">Construction</th>
                          <th className="px-4 py-3">Yarn Count</th>
                          <th className="px-4 py-3">Composition</th>
                          <th className="px-4 py-3 text-right">Standard GSM</th>
                          <th className="px-4 py-3 text-right">Spandex %</th>
                          <th className="px-4 py-3">Shrinkage %</th>
                          <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold">
                        {filteredFabrics.map((f) => (
                          <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{f.fabricType}</td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{f.construction}</td>
                            <td className="px-4 py-3 font-mono text-teal-600 dark:text-teal-400 font-bold">{f.yarnCount}</td>
                            <td className="px-4 py-3">{f.composition}</td>
                            <td className="px-4 py-3 text-right font-mono font-bold">{f.gsm} gsm</td>
                            <td className="px-4 py-3 text-right font-mono">{f.spandexPct}%</td>
                            <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">{f.shrinkagePct}</td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => handleOpenFabricModal(f)}
                                  className="p-1 text-slate-500 hover:text-teal-500 hover:bg-slate-100 rounded transition cursor-pointer"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteFabric(f.id)}
                                  className="p-1 text-rose-500 hover:bg-rose-500/10 rounded transition cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
        ) : null}





        {searchTab === "additional-cost-entry" && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Trims & Accessories Master Catalog ({filteredTrims.length})</span>
                    <button
                      onClick={() => handleOpenTrimsModal()}
                      className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus size={14} /> Add Trims Item
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-4 py-3">Code</th>
                          <th className="px-4 py-3">Item Description</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">UOM</th>
                          <th className="px-4 py-3 text-right">Unit Price (USD)</th>
                          <th className="px-4 py-3">Nominated Supplier</th>
                          <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold">
                        {filteredTrims.map((t) => (
                          <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="px-4 py-3 font-mono font-bold text-slate-400">{t.itemCode}</td>
                            <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{t.itemName}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                                t.category === "Sewing Trims"
                                  ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                  : "bg-purple-500/10 text-purple-600 border-purple-500/20"
                              }`}>
                                {t.category}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-mono">{t.uom}</td>
                            <td className="px-4 py-3 text-right font-mono font-bold text-teal-600 dark:text-teal-400">${t.unitPriceUsd.toFixed(3)}</td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{t.nominatedSupplier}</td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => handleOpenTrimsModal(t)}
                                  className="p-1 text-slate-500 hover:text-teal-500 hover:bg-slate-100 rounded transition cursor-pointer"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteTrims(t.id)}
                                  className="p-1 text-rose-500 hover:bg-rose-500/10 rounded transition cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
        )}

        {searchTab === "rmg-process-loss" && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">Garment Process Loss Matrix %</span>
                      <span className="text-[10px] text-slate-400">Default wastage margins for material requirement calculations</span>
                    </div>
                    <button
                      onClick={() => handleOpenLossModal()}
                      className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus size={14} /> Add Garment Loss Rule
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-4 py-3">Garment Category</th>
                          <th className="px-4 py-3 text-right">Knitting Loss %</th>
                          <th className="px-4 py-3 text-right">Dyeing Loss %</th>
                          <th className="px-4 py-3 text-right">Cutting Loss %</th>
                          <th className="px-4 py-3 text-right">Print/Wash Loss %</th>
                          <th className="px-4 py-3 text-right">Total Est. Loss %</th>
                          <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold">
                        {filteredLosses.map((pl) => {
                          const totalLoss = pl.knittingLossPct + pl.dyeingLossPct + pl.cuttingLossPct + pl.printWashLossPct;
                          return (
                            <tr key={pl.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                              <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{pl.garmentType}</td>
                              <td className="px-4 py-3 text-right font-mono">{pl.knittingLossPct}%</td>
                              <td className="px-4 py-3 text-right font-mono">{pl.dyeingLossPct}%</td>
                              <td className="px-4 py-3 text-right font-mono">{pl.cuttingLossPct}%</td>
                              <td className="px-4 py-3 text-right font-mono">{pl.printWashLossPct}%</td>
                              <td className="px-4 py-3 text-right font-mono font-black text-rose-500">{totalLoss.toFixed(1)}%</td>
                              <td className="px-4 py-3 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => handleOpenLossModal(pl)}
                                    className="p-1 text-slate-500 hover:text-teal-500 hover:bg-slate-100 rounded transition cursor-pointer"
                                  >
                                    <Pencil size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteLoss(pl.id)}
                                    className="p-1 text-rose-500 hover:bg-rose-500/10 rounded transition cursor-pointer"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
        )}

        {/* TAB 8: QUALITY */}
        {false && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Garment Specifications & Size Groups Master ({filteredSpecs.length})</span>
                    <button
                      onClick={() => handleOpenSpecModal()}
                      className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus size={14} /> Add Parameter
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-4 py-3">Parameter / Part Name</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Default Standard Value</th>
                          <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold">
                        {filteredSpecs.map((s) => (
                          <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{s.paramName}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                                {s.category}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-mono text-teal-600 dark:text-teal-400 font-bold">{s.defaultValue}</td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => handleOpenSpecModal(s)}
                                  className="p-1 text-slate-500 hover:text-teal-500 hover:bg-slate-100 rounded transition cursor-pointer"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteSpec(s.id)}
                                  className="p-1 text-rose-500 hover:bg-rose-500/10 rounded transition cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
        )}


        {/* MODAL 2: FABRIC SPEC MODAL */}
        {fabricModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                  <Layers className="size-4 text-teal-500" />
                  {fabricModal.item ? "Edit Fabric Spec" : "Add New Fabric Spec"}
                </h3>
                <button onClick={() => setFabricModal({ open: false })} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
              </div>

              <div className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Fabric Type *</label>
                    <input
                      type="text"
                      placeholder="e.g. Single Jersey, 2/1 Twill"
                      value={fabricForm.fabricType}
                      onChange={(e) => setFabricForm({ ...fabricForm, fabricType: e.target.value })}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Construction / Gauge</label>
                    <input
                      type="text"
                      placeholder="e.g. 28 Gauge or 133x72"
                      value={fabricForm.construction}
                      onChange={(e) => setFabricForm({ ...fabricForm, construction: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Yarn Count</label>
                    <input
                      type="text"
                      placeholder="e.g. 30s/1 Combed"
                      value={fabricForm.yarnCount}
                      onChange={(e) => setFabricForm({ ...fabricForm, yarnCount: e.target.value })}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Composition</label>
                    <input
                      type="text"
                      placeholder="e.g. 100% Cotton"
                      value={fabricForm.composition}
                      onChange={(e) => setFabricForm({ ...fabricForm, composition: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Standard GSM</label>
                    <input
                      type="number"
                      value={fabricForm.gsm}
                      onChange={(e) => setFabricForm({ ...fabricForm, gsm: Number(e.target.value) })}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Spandex %</label>
                    <input
                      type="number"
                      value={fabricForm.spandexPct}
                      onChange={(e) => setFabricForm({ ...fabricForm, spandexPct: Number(e.target.value) })}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Shrinkage %</label>
                    <input
                      type="text"
                      value={fabricForm.shrinkagePct}
                      onChange={(e) => setFabricForm({ ...fabricForm, shrinkagePct: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-2">
                <button
                  onClick={() => setFabricModal({ open: false })}
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-sm transition cursor-pointer"
                >
                  CLOSE
                </button>
                <button
                  onClick={handleSaveFabric}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-sm transition cursor-pointer"
                >
                  SAVE SPEC
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: SPEC PARAMETER MODAL */}
        {specModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                  <Ruler className="size-4 text-teal-500" />
                  {specModal.item ? "Edit Specification Parameter" : "Add Specification Parameter"}
                </h3>
                <button onClick={() => setSpecModal({ open: false })} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Parameter / Part Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Chest Width (1/2 Chest)"
                    value={specForm.paramName}
                    onChange={(e) => setSpecForm({ ...specForm, paramName: e.target.value })}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Category</label>
                    <select
                      value={specForm.category}
                      onChange={(e) => setSpecForm({ ...specForm, category: e.target.value as any })}
                      className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    >
                      <option value="Body Part">Body Part</option>
                      <option value="Size Group">Size Group</option>
                      <option value="Special Requirement">Special Requirement</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Standard Value</label>
                    <input
                      type="text"
                      placeholder="e.g. 54.0 cm or S, M, L"
                      value={specForm.defaultValue}
                      onChange={(e) => setSpecForm({ ...specForm, defaultValue: e.target.value })}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-2">
                <button
                  onClick={() => setSpecModal({ open: false })}
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-sm transition cursor-pointer"
                >
                  CLOSE
                </button>
                <button
                  onClick={handleSaveSpec}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-sm transition cursor-pointer"
                >
                  SAVE PARAMETER
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 4: PROCESS LOSS MODAL */}
        {lossModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                  <Percent className="size-4 text-teal-500" />
                  {lossModal.item ? "Edit Process Loss Rule" : "Add Process Loss Rule"}
                </h3>
                <button onClick={() => setLossModal({ open: false })} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Garment Category Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Basic T-Shirt (Knit)"
                    value={lossForm.garmentType}
                    onChange={(e) => setLossForm({ ...lossForm, garmentType: e.target.value })}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Knitting/Weaving Loss %</label>
                    <input
                      type="number"
                      step="0.1"
                      value={lossForm.knittingLossPct}
                      onChange={(e) => setLossForm({ ...lossForm, knittingLossPct: Number(e.target.value) })}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Dyeing & Finish Loss %</label>
                    <input
                      type="number"
                      step="0.1"
                      value={lossForm.dyeingLossPct}
                      onChange={(e) => setLossForm({ ...lossForm, dyeingLossPct: Number(e.target.value) })}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Cutting Loss %</label>
                    <input
                      type="number"
                      step="0.1"
                      value={lossForm.cuttingLossPct}
                      onChange={(e) => setLossForm({ ...lossForm, cuttingLossPct: Number(e.target.value) })}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Print/Wash Loss %</label>
                    <input
                      type="number"
                      step="0.1"
                      value={lossForm.printWashLossPct}
                      onChange={(e) => setLossForm({ ...lossForm, printWashLossPct: Number(e.target.value) })}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-2">
                <button
                  onClick={() => setLossModal({ open: false })}
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-sm transition cursor-pointer"
                >
                  CLOSE
                </button>
                <button
                  onClick={handleSaveLoss}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-sm transition cursor-pointer"
                >
                  SAVE LOSS RULE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 5: TRIMS MODAL */}
        {trimsModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                  <Package className="size-4 text-teal-500" />
                  {trimsModal.item ? "Edit Trims Item" : "Add New Trims Item"}
                </h3>
                <button onClick={() => setTrimsModal({ open: false })} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
              </div>

              <div className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Item Code</label>
                    <input
                      type="text"
                      placeholder="e.g. TRM-THD-01"
                      value={trimsForm.itemCode}
                      onChange={(e) => setTrimsForm({ ...trimsForm, itemCode: e.target.value })}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Category</label>
                    <select
                      value={trimsForm.category}
                      onChange={(e) => setTrimsForm({ ...trimsForm, category: e.target.value as any })}
                      className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    >
                      <option value="Sewing Trims">Sewing Trims</option>
                      <option value="Packing Trims">Packing Trims</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Item Description *</label>
                  <input
                    type="text"
                    placeholder="Full Trims Description"
                    value={trimsForm.itemName}
                    onChange={(e) => setTrimsForm({ ...trimsForm, itemName: e.target.value })}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">UOM</label>
                    <input
                      type="text"
                      placeholder="e.g. Cone, Pcs, Dzn"
                      value={trimsForm.uom}
                      onChange={(e) => setTrimsForm({ ...trimsForm, uom: e.target.value })}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Unit Price ($)</label>
                    <input
                      type="number"
                      step="0.001"
                      value={trimsForm.unitPriceUsd}
                      onChange={(e) => setTrimsForm({ ...trimsForm, unitPriceUsd: Number(e.target.value) })}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Supplier</label>
                    <input
                      type="text"
                      placeholder="Nominated Supplier"
                      value={trimsForm.nominatedSupplier}
                      onChange={(e) => setTrimsForm({ ...trimsForm, nominatedSupplier: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-2">
                <button
                  onClick={() => setTrimsModal({ open: false })}
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-sm transition cursor-pointer"
                >
                  CLOSE
                </button>
                <button
                  onClick={handleSaveTrims}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-sm transition cursor-pointer"
                >
                  SAVE TRIMS ITEM
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </MerchandisingLayout>
  );
}

// ── CUSTOM COMPONENT: Company Wise MERC Setting ──────────────────────────────
interface CompanyMercSetting {
  id: string;
  companyName: string;
  address: string;
  status: "Active" | "Inactive";
  fabricSource: string[];
  printType: string[];
  fabricNature: string[];
  uom: string[];
  bodyPart: string[];
  mapDomKey: string[];
}

const initialCompanySettings: CompanyMercSetting[] = [
  {
    id: "CWM-01",
    companyName: "Pole Star Knit Composite Ltd.",
    address: "Naibari, Pubail, Gazipur City Corporation, Gazipur.",
    status: "Active",
    fabricSource: ["Finish Purchase", "Buyer Supplied", "Stock"],
    printType: ["Pigment Print", "Rubber Print", "Plastisol Print"],
    fabricNature: ["Knit"],
    uom: ["Pcs", "Dzn", "Set"],
    bodyPart: ["Front Part", "Back Part", "Sleeve"],
    mapDomKey: ["Company wise setup"]
  },
  {
    id: "CWM-02",
    companyName: "Pole Star Fashion Design Ltd.",
    address: "Sharifpur, National UniversityTongi, Gazipur, Bangladesh.",
    status: "Inactive",
    fabricSource: ["Finish Purchase", "Stock"],
    printType: ["Pigment Print", "Discharge Print"],
    fabricNature: ["Knit", "Woven"],
    uom: ["Pcs", "Kg"],
    bodyPart: ["Front Part", "Back Part"],
    mapDomKey: ["Default configuration"]
  },
  {
    id: "CWM-03",
    companyName: "Prime Sweater Ltd.",
    address: "Naibari, Pubail, Gazipur City Corporation, Gazipur.",
    status: "Active",
    fabricSource: ["Buyer Supplied", "Stock"],
    printType: ["Plastisol Print", "Discharge Print"],
    fabricNature: ["Sweater"],
    uom: ["Pcs", "Lbs"],
    bodyPart: ["Front Part", "Back Part", "Sleeve", "Collar"],
    mapDomKey: ["Custom key mapping"]
  }
];

const PREDEFINED_SUGGESTIONS: Record<string, string[]> = {
  fabricSource: ["Finish Purchase", "Buyer Supplied", "Stock", "Imported", "Local", "Sub-Contract"],
  printType: ["Pigment Print", "Rubber Print", "Plastisol Print", "Discharge Print", "High Density Print", "AOP Print WO", "Flock Print", "Foil Print"],
  fabricNature: ["Knit", "Woven", "Sweater", "Fleece", "Terry", "Interlock"],
  uom: ["Pcs", "Dzn", "Set", "Pack", "Kg", "Yds", "Lbs", "Mtr", "Roll"],
  bodyPart: ["Front Part", "Back Part", "Sleeve", "Collar", "Cuff", "Pocket", "Hood", "Bottom Rib", "Neck Rib"],
  mapDomKey: ["Company wise setup", "Default configuration", "Custom key mapping", "TNA Milestone", "Procurement Rule"]
};

function CompanyWiseMercSettingView() {
  const [companySettings, setCompanySettings] = useState<CompanyMercSetting[]>(initialCompanySettings);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Modal State
  const [activeModal, setActiveModal] = useState<{
    companyId: string;
    type: keyof Omit<CompanyMercSetting, "id" | "companyName" | "address" | "status">;
    label: string;
  } | null>(null);

  // Tag Editor Temporary State
  const [tempTags, setTempTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");

  // Populate temp tags when modal opens
  useEffect(() => {
    if (activeModal) {
      const comp = companySettings.find(c => c.id === activeModal.companyId);
      if (comp) {
        setTempTags(comp[activeModal.type] as string[] || []);
      }
      setNewTagInput("");
    }
  }, [activeModal, companySettings]);

  // Export handlers
  const handleExport = (format: "EXCEL" | "PRINT" | "PDF") => {
    toast.success(`Exporting Company Wise MERC Settings as ${format}...`);
  };

  // Filter list
  const filtered = companySettings.filter(c => 
    c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Tag actions
  const handleRemoveTag = (tagToRemove: string) => {
    setTempTags(prev => prev.filter(t => t !== tagToRemove));
  };

  const handleAddTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim();
    if (!trimmed) return;
    if (tempTags.includes(trimmed)) {
      toast.error("Tag already exists");
      return;
    }
    setTempTags(prev => [...prev, trimmed]);
    setNewTagInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(newTagInput);
    }
  };

  const handleSubmitModal = () => {
    if (!activeModal) return;
    setCompanySettings(prev => prev.map(c => 
      c.id === activeModal.companyId 
        ? { ...c, [activeModal.type]: tempTags } 
        : c
    ));
    toast.success(`${activeModal.label} updated successfully!`);
    setActiveModal(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border-l-4 border-l-amber-500 border-y border-r border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-6 select-none relative">
      
      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Export Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleExport("EXCEL")}
            className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 duration-100"
          >
            <Download size={13} className="text-slate-500" /> EXCEL
          </button>
          <button
            onClick={() => handleExport("PRINT")}
            className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 duration-100"
          >
            <Printer size={13} className="text-slate-500" /> PRINT
          </button>
          <button
            onClick={() => handleExport("PDF")}
            className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 duration-100"
          >
            <Download size={13} className="text-slate-500" /> PDF
          </button>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 w-full sm:w-72">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">Search:</span>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search by Company or Address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 pr-8"
            />
            <Search size={14} className="absolute right-2.5 top-2.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Settings Grid Table */}
      <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
        <table className="w-full text-xs text-left min-w-[700px]">
          <thead className="bg-[#FDF2E9] dark:bg-slate-950 text-[#A04000] dark:text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-4 py-3.5 w-16 text-center">Act</th>
              <th className="px-4 py-3.5 w-16 text-center">Sl</th>
              <th className="px-5 py-3.5 w-1/3">Company</th>
              <th className="px-5 py-3.5">Address</th>
              <th className="px-4 py-3.5 w-24 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400 italic">
                  No company records found matching search query.
                </td>
              </tr>
            ) : (
              filtered.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 relative">
                  
                  {/* Action Hamburger Column */}
                  <td className="px-4 py-3.5 text-center relative font-medium">
                    <div className="flex justify-center">
                      <button
                        onClick={() => setOpenDropdownId(prev => prev === item.id ? null : item.id)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-blue-500 cursor-pointer transition active:scale-95"
                      >
                        <AlignLeft size={16} />
                      </button>
                    </div>

                    {/* Action Dropdown Menu */}
                    {openDropdownId === item.id && (
                      <>
                        {/* Overlay backdrop to close dropdown */}
                        <div 
                          className="fixed inset-0 z-40"
                          onClick={() => setOpenDropdownId(null)}
                        />
                        <div className="absolute left-10 top-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl w-48 py-2 z-50 animate-scale-up text-left">
                          <button
                            onClick={() => {
                              setActiveModal({ companyId: item.id, type: "fabricSource", label: "Fabric Source" });
                              setOpenDropdownId(null);
                            }}
                            className="w-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer transition"
                          >
                            <FileText size={14} className="text-blue-500" /> Fabric Source
                          </button>
                          <button
                            onClick={() => {
                              setActiveModal({ companyId: item.id, type: "printType", label: "Print Type" });
                              setOpenDropdownId(null);
                            }}
                            className="w-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer transition"
                          >
                            <FileText size={14} className="text-blue-500" /> Print Type
                          </button>
                          <button
                            onClick={() => {
                              setActiveModal({ companyId: item.id, type: "fabricNature", label: "Fabric Nature" });
                              setOpenDropdownId(null);
                            }}
                            className="w-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer transition"
                          >
                            <Folder size={14} className="text-amber-500" /> Fabric Nature
                          </button>
                          <button
                            onClick={() => {
                              setActiveModal({ companyId: item.id, type: "uom", label: "UOM" });
                              setOpenDropdownId(null);
                            }}
                            className="w-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer transition"
                          >
                            <Folder size={14} className="text-amber-500" /> UOM
                          </button>
                          <button
                            onClick={() => {
                              setActiveModal({ companyId: item.id, type: "bodyPart", label: "Body Part" });
                              setOpenDropdownId(null);
                            }}
                            className="w-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer transition"
                          >
                            <Folder size={14} className="text-amber-500" /> Body Part
                          </button>
                          <button
                            onClick={() => {
                              setActiveModal({ companyId: item.id, type: "mapDomKey", label: "Map DOM Key" });
                              setOpenDropdownId(null);
                            }}
                            className="w-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer transition"
                          >
                            <Folder size={14} className="text-amber-500" /> Map DOM Key
                          </button>
                        </div>
                      </>
                    )}
                  </td>

                  {/* Serial Column */}
                  <td className="px-4 py-3.5 text-center text-slate-400 font-mono font-bold">{idx + 1}</td>

                  {/* Company Name Column */}
                  <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-white">{item.companyName}</td>

                  {/* Address Column */}
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 font-medium">{item.address}</td>

                  {/* Status Badge Column */}
                  <td className="px-4 py-3.5 text-center">
                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase inline-block ${
                      item.status === "Active" 
                        ? "bg-emerald-500 text-white" 
                        : "bg-rose-500 text-white"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-500 border-t border-slate-100 dark:border-slate-800/80 pt-4">
        <div>Showing 1 to {filtered.length} of {filtered.length} entries</div>
        <div className="flex items-center gap-1.5">
          <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400 font-medium cursor-not-allowed">Previous</button>
          <button className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg">1</button>
          <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400 font-medium cursor-not-allowed">Next</button>
        </div>
      </div>

      {/* MULTI-SELECT TAG MODAL EDITOR */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">{activeModal.label} Setup</h3>
              <button 
                onClick={() => setActiveModal(null)} 
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                {activeModal.label} <span className="text-rose-500">*</span>
              </label>

              {/* Tag Editor Box */}
              <div className="border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl p-3 min-h-[100px] flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500 transition duration-150">
                
                {/* Render Selected Tags */}
                {tempTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-200/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs px-2.5 py-1 rounded-md font-bold flex items-center gap-1.5 hover:bg-slate-300/80 dark:hover:bg-slate-700 transition"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="p-0.5 hover:bg-slate-300 dark:hover:bg-slate-600 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}

                {/* Tag Input */}
                <input
                  type="text"
                  placeholder={tempTags.length === 0 ? "Type and press Enter to add..." : "Add more..."}
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 min-w-[120px] text-xs font-semibold px-2 py-1 bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Suggestions Panel */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">Pre-Defined Suggestions:</span>
                <div className="flex flex-wrap gap-1.5">
                  {PREDEFINED_SUGGESTIONS[activeModal.type]?.map((suggestion) => {
                    const isSelected = tempTags.includes(suggestion);
                    return (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => isSelected ? handleRemoveTag(suggestion) : handleAddTag(suggestion)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition active:scale-95 duration-100 ${
                          isSelected
                            ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20"
                            : "bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        {isSelected ? `✓ ${suggestion}` : `+ ${suggestion}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
              <button
                onClick={() => setActiveModal(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition cursor-pointer uppercase tracking-wider"
              >
                CLOSE
              </button>
              <button
                onClick={handleSubmitModal}
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer active:scale-95"
              >
                SUBMIT
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
