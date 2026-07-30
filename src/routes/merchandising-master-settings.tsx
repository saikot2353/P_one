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
  buyingHouse: string;
  country: string;
  aqlStandard: string;
  payTerms: string;
  currency: string;
  contactEmail: string;
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
  { id: "b-1", shortCode: "ITPS", buyerName: "ITPS Sourcing Group", buyingHouse: "ITPS BD Sourcing", country: "United Kingdom", aqlStandard: "AQL 2.5", payTerms: "120 Days BBLC", currency: "USD", contactEmail: "buyer@itps-uk.com", status: "Active" },
  { id: "b-2", shortCode: "AML", buyerName: "A-M-London Fashion Ltd", buyingHouse: "London Buying Group", country: "United Kingdom", aqlStandard: "AQL 1.5", payTerms: "90 Days LC", currency: "USD", contactEmail: "sourcing@am-london.co.uk", status: "Active" },
  { id: "b-3", shortCode: "NORD", buyerName: "Nordic Wear AS", buyingHouse: "Scandi Trading Ltd", country: "Norway", aqlStandard: "AQL 2.5", payTerms: "At Sight LC", currency: "EUR", contactEmail: "po@nordicwear.no", status: "Active" },
  { id: "b-4", shortCode: "ZARA", buyerName: "Inditex Zara BD", buyingHouse: "Inditex Dhaka Office", country: "Spain", aqlStandard: "AQL 1.5", payTerms: "90 Days BBLC", currency: "EUR", contactEmail: "zara-bd@inditex.es", status: "Active" },
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
    const data = genericDb[subTabId] || [];
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<{ id: string; name: string; desc: string; status: "Active" | "Inactive" } | null>(null);
    const [formName, setFormName] = useState("");
    const [formDesc, setFormDesc] = useState("");
    const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");

    const handleOpenModal = (item?: typeof editItem) => {
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
        // Edit
        setGenericDb(prev => ({
          ...prev,
          [subTabId]: prev[subTabId].map(i => i.id === editItem.id ? { ...i, name: formName, desc: formDesc, status: formStatus } : i)
        }));
        toast.success(`${label} updated successfully`);
      } else {
        // Add
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

  // Data states
  const [buyers, setBuyers] = useState<BuyerSetting[]>(initialBuyers);
  const [fabrics, setFabrics] = useState<FabricSpec[]>(initialFabrics);
  const [processLosses, setProcessLosses] = useState<ProcessLoss[]>(initialProcessLoss);
  const [trims, setTrims] = useState<TrimsMaster[]>(initialTrims);
  const [specs, setSpecs] = useState<SpecParameter[]>(initialSpecs);

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
    buyingHouse: "",
    country: "United Kingdom",
    aqlStandard: "AQL 2.5",
    payTerms: "120 Days BBLC",
    currency: "USD",
    contactEmail: "",
    status: "Active",
  });

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

    if (buyerModal.item) {
      setBuyers(prev => prev.map(b => b.id === buyerModal.item!.id ? ({ ...b, ...buyerForm } as BuyerSetting) : b));
      toast.success(`Buyer ${buyerForm.buyerName} updated successfully!`);
    } else {
      const newB: BuyerSetting = {
        id: `b-${Date.now()}`,
        shortCode: buyerForm.shortCode || buyerForm.buyerName.substring(0, 4).toUpperCase(),
        buyerName: buyerForm.buyerName,
        buyingHouse: buyerForm.buyingHouse || "Direct Buyer",
        country: buyerForm.country || "Bangladesh",
        aqlStandard: buyerForm.aqlStandard || "AQL 2.5",
        payTerms: buyerForm.payTerms || "120 Days BBLC",
        currency: buyerForm.currency || "USD",
        contactEmail: buyerForm.contactEmail || "info@buyer.com",
        status: buyerForm.status || "Active",
      };
      setBuyers([newB, ...buyers]);
      toast.success(`New Buyer ${newB.buyerName} registered!`);
    }
    setBuyerModal({ open: false });
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
              ) : (
                renderDynamicMasterDB(searchTab, tabLabel)
              )}
        </div>

        {searchTab === "buyer-name" ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Registered RMG Buyers ({filteredBuyers.length})</span>
                    <button
                      onClick={() => handleOpenBuyerModal()}
                      className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus size={14} /> Register New Buyer
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-4 py-3">Code</th>
                          <th className="px-4 py-3">Buyer Name</th>
                          <th className="px-4 py-3">Buying House / Agent</th>
                          <th className="px-4 py-3">Country</th>
                          <th className="px-4 py-3">AQL Standard</th>
                          <th className="px-4 py-3">Payment Term</th>
                          <th className="px-4 py-3">Currency</th>
                          <th className="px-4 py-3 text-center">Status</th>
                          <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold">
                        {filteredBuyers.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="px-4 py-3 font-mono font-bold text-slate-400">{b.shortCode}</td>
                            <td className="px-4 py-3 font-bold text-teal-600 dark:text-teal-400">{b.buyerName}</td>
                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{b.buyingHouse}</td>
                            <td className="px-4 py-3">{b.country}</td>
                            <td className="px-4 py-3 font-mono">{b.aqlStandard}</td>
                            <td className="px-4 py-3">{b.payTerms}</td>
                            <td className="px-4 py-3 font-mono font-bold">{b.currency}</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                                b.status === "Active" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-slate-500/10 text-slate-500"
                              }`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => handleOpenBuyerModal(b)}
                                  className="p-1 text-slate-500 hover:text-teal-500 hover:bg-slate-100 rounded transition cursor-pointer"
                                  title="Edit"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteBuyer(b.id)}
                                  className="p-1 text-rose-500 hover:bg-rose-500/10 rounded transition cursor-pointer"
                                  title="Delete"
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

        {/* MODAL 1: BUYER MODAL */}
        {buyerModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                  <Users className="size-4 text-teal-500" />
                  {buyerModal.item ? "Edit Buyer Configuration" : "Register New Buyer"}
                </h3>
                <button onClick={() => setBuyerModal({ open: false })} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
              </div>

              <div className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Buyer Short Code</label>
                    <input
                      type="text"
                      placeholder="e.g. ZARA"
                      value={buyerForm.shortCode}
                      onChange={(e) => setBuyerForm({ ...buyerForm, shortCode: e.target.value })}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Buyer Name *</label>
                    <input
                      type="text"
                      placeholder="Full Buyer Name"
                      value={buyerForm.buyerName}
                      onChange={(e) => setBuyerForm({ ...buyerForm, buyerName: e.target.value })}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Buying House / Agent</label>
                    <input
                      type="text"
                      placeholder="Agent or Direct"
                      value={buyerForm.buyingHouse}
                      onChange={(e) => setBuyerForm({ ...buyerForm, buyingHouse: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Country</label>
                    <input
                      type="text"
                      placeholder="Country of Origin"
                      value={buyerForm.country}
                      onChange={(e) => setBuyerForm({ ...buyerForm, country: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">AQL Standard</label>
                    <select
                      value={buyerForm.aqlStandard}
                      onChange={(e) => setBuyerForm({ ...buyerForm, aqlStandard: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    >
                      <option value="AQL 1.5">AQL 1.5 Strict</option>
                      <option value="AQL 2.5">AQL 2.5 Standard</option>
                      <option value="AQL 4.0">AQL 4.0 Relaxed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Pay Terms</label>
                    <select
                      value={buyerForm.payTerms}
                      onChange={(e) => setBuyerForm({ ...buyerForm, payTerms: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    >
                      <option value="120 Days BBLC">120 Days BBLC</option>
                      <option value="90 Days BBLC">90 Days BBLC</option>
                      <option value="At Sight LC">At Sight LC</option>
                      <option value="TT Transfer">TT Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Currency</label>
                    <select
                      value={buyerForm.currency}
                      onChange={(e) => setBuyerForm({ ...buyerForm, currency: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="BDT">BDT (৳)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Contact Email</label>
                  <input
                    type="email"
                    placeholder="buyer@domain.com"
                    value={buyerForm.contactEmail}
                    onChange={(e) => setBuyerForm({ ...buyerForm, contactEmail: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-2">
                <button
                  onClick={() => setBuyerModal({ open: false })}
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-sm transition cursor-pointer"
                >
                  CLOSE
                </button>
                <button
                  onClick={handleSaveBuyer}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-sm transition cursor-pointer"
                >
                  SAVE BUYER
                </button>
              </div>
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
