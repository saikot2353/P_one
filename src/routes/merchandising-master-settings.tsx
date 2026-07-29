import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import MerchandisingLayout from "../components/merchandising/MerchandisingLayout";
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
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/merchandising-master-settings")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tab: (search.tab as string) || "buyers",
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
  const searchTab = search?.tab || "buyers";

  const [activeTab, setActiveTab] = useState<"company" | "partners" | "product" | "fabric" | "yarn" | "color" | "costing" | "quality">(
    (searchTab as any) || "company"
  );

  const [activeSubTab, setActiveSubTab] = useState<string>("company-wise-merc-setting");
  const [genericDb, setGenericDb] = useState<Record<string, { id: string; name: string; desc: string; status: "Active" | "Inactive" }[]>>(genericMockData);

  useEffect(() => {
    if (searchTab) {
      if (searchTab === "trims") {
        setActiveTab("costing");
        setActiveSubTab("additional-cost-entry");
      } else if (["company", "partners", "product", "fabric", "yarn", "color", "costing", "quality"].includes(searchTab)) {
        setActiveTab(searchTab as any);
        if (searchTab === "company") setActiveSubTab("company-wise-merc-setting");
        if (searchTab === "partners") setActiveSubTab("buying-house");
        if (searchTab === "product") setActiveSubTab("item-department");
        if (searchTab === "fabric") setActiveSubTab("fabric-gsm");
        if (searchTab === "yarn") setActiveSubTab("yarn-brand");
        if (searchTab === "color") setActiveSubTab("gmt-fabric-color-name");
        if (searchTab === "costing") setActiveSubTab("additional-cost-entry");
        if (searchTab === "quality") setActiveSubTab("quality-label");
      } else {
        const tabMapping: Record<string, "company" | "partners" | "product" | "fabric" | "yarn" | "color" | "costing" | "quality"> = {
          "company-wise-merc-setting": "company",
          "costing-configuration-cpm": "company",
          "payment-terms": "company",
          "buying-house": "partners",
          "buyer-name": "partners",
          "buyer-wise-brand": "partners",
          "buying-agent": "partners",
          "supplier": "partners",
          "item-department": "product",
          "gmt-item-name": "product",
          "body-part": "product",
          "season": "product",
          "sample-type": "product",
          "size-group": "product",
          "uom": "product",
          "fabric-gsm": "fabric",
          "fabric-nature": "fabric",
          "fabric-construction": "fabric",
          "fabric-yarn-composotion": "fabric",
          "dyeing": "fabric",
          "finishing": "fabric",
          "shade-range": "fabric",
          "yarn-brand": "yarn",
          "yarn-type": "yarn",
          "yarn-count": "yarn",
          "yarn-po-type": "yarn",
          "yarn-po-settings": "yarn",
          "gmt-fabric-color-name": "color",
          "fabric-print-color-type": "color",
          "print-emb-wash-special-type": "color",
          "aop-process": "color",
          "additional-cost-entry": "costing",
          "rmg-process-loss": "costing",
          "quality-label": "quality",
        };
        const mapped = tabMapping[searchTab];
        if (mapped) {
          setActiveTab(mapped);
          setActiveSubTab(searchTab);
        }
      }
    }
  }, [searchTab]);

  useEffect(() => {
    const validSubs = subTabsForMainTab[activeTab].map(s => s.id);
    if (!validSubs.includes(activeSubTab)) {
      setActiveSubTab(validSubs[0]);
    }
  }, [activeTab]);

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

  // Financial Config States
  const [cpmRateUsd, setCpmRateUsd] = useState(0.085); // Cost per minute ($)
  const [commercialLossPct, setCommercialLossPct] = useState(2.5); // %
  const [bankInterestPct, setBankInterestPct] = useState(4.0); // %
  const [targetMarginPct, setTargetMarginPct] = useState(12.0); // %

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
      breadcrumbs={[{ label: "Master Settings" }, { label: activeTab.toUpperCase() }]}
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

        {/* Tab Selection Navigation & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "company", label: "Company Config", icon: Building2, count: 3 },
              { id: "partners", label: "Business Partners", icon: Users, count: 5 },
              { id: "product", label: "Product Masters", icon: Package, count: 7 },
              { id: "fabric", label: "Fabric Masters", icon: Layers, count: 7 },
              { id: "yarn", label: "Yarn Masters", icon: Ruler, count: 5 },
              { id: "color", label: "Color & Processing", icon: Settings, count: 4 },
              { id: "costing", label: "Costing", icon: Calculator, count: 2 },
              { id: "quality", label: "Quality", icon: CheckCircle, count: 1 },
            ].map((t) => {
              const Icon = t.icon;
              const isSel = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTab(t.id as any);
                    setSearchQuery("");
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition cursor-pointer ${
                    isSel
                      ? "bg-teal-500 text-white shadow-md shadow-teal-500/15 animate-all"
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={14} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-semibold pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            />
          </div>
        </div>

        {/* TAB 1: BUYER SETUP */}
        {/* TAB 1: COMPANY CONFIGURATION */}
        {activeTab === "company" && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-3 lg:col-span-2.5 flex flex-col gap-1 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs h-fit">
              <div className="px-2 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/80 mb-2">
                Sub Categories
              </div>
              {subTabsForMainTab.company.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSubTab(s.id);
                    setSearchQuery("");
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all duration-155 flex items-center justify-between cursor-pointer ${
                    activeSubTab === s.id
                      ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-extrabold border border-teal-500/15"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <span>{s.label}</span>
                </button>
              ))}
            </div>

            <div className="col-span-12 md:col-span-9 lg:col-span-9.5">
              {activeSubTab === "costing-configuration-cpm" ? (
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Calculator className="size-4 text-teal-500" /> Costing Configuration (CPM & Commercial Overhead)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Cost Per Minute (CPM USD)</label>
                      <input
                        type="number"
                        step="0.005"
                        value={cpmRateUsd}
                        onChange={(e) => setCpmRateUsd(Number(e.target.value))}
                        className="w-full text-sm font-black px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-teal-600 dark:text-teal-400 font-mono animate-all"
                      />
                      <span className="text-[9px] text-slate-400">Used for factory CM pricing formula</span>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Commercial Overhead %</label>
                      <input
                        type="number"
                        step="0.5"
                        value={commercialLossPct}
                        onChange={(e) => setCommercialLossPct(Number(e.target.value))}
                        className="w-full text-sm font-black px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 font-mono animate-all"
                      />
                      <span className="text-[9px] text-slate-400">Default BBLC & port clearance %</span>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Bank Interest & L/C %</label>
                      <input
                        type="number"
                        step="0.5"
                        value={bankInterestPct}
                        onChange={(e) => setBankInterestPct(Number(e.target.value))}
                        className="w-full text-sm font-black px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 font-mono animate-all"
                      />
                      <span className="text-[9px] text-slate-400">LC opening charge & interest</span>
                    </div>

                    <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl space-y-1">
                      <label className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase">Target Net Profit Margin %</label>
                      <input
                        type="number"
                        step="0.5"
                        value={targetMarginPct}
                        onChange={(e) => setTargetMarginPct(Number(e.target.value))}
                        className="w-full text-sm font-black px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-teal-500/30 rounded-lg text-teal-600 dark:text-teal-400 font-mono animate-all"
                      />
                      <span className="text-[9px] text-teal-600/70 font-semibold">Minimum profit margin rule</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => toast.success("Financial CPM & Commercial Overhead parameters saved!")}
                      className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save size={14} /> SAVE FINANCIAL PARAMETERS
                    </button>
                  </div>
                </div>
              ) : (
                renderDynamicMasterDB(activeSubTab, subTabsForMainTab.company.find(s => s.id === activeSubTab)?.label || "")
              )}
            </div>
          </div>
        )}

        {/* TAB 2: BUSINESS PARTNERS */}
        {activeTab === "partners" && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-3 lg:col-span-2.5 flex flex-col gap-1 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs h-fit">
              <div className="px-2 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/80 mb-2">
                Sub Categories
              </div>
              {subTabsForMainTab.partners.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSubTab(s.id);
                    setSearchQuery("");
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all duration-155 flex items-center justify-between cursor-pointer ${
                    activeSubTab === s.id
                      ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-extrabold border border-teal-500/15"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <span>{s.label}</span>
                </button>
              ))}
            </div>

            <div className="col-span-12 md:col-span-9 lg:col-span-9.5">
              {activeSubTab === "buyer-name" ? (
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
              ) : (
                renderDynamicMasterDB(activeSubTab, subTabsForMainTab.partners.find(s => s.id === activeSubTab)?.label || "")
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCT MASTERS */}
        {activeTab === "product" && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-3 lg:col-span-2.5 flex flex-col gap-1 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs h-fit">
              <div className="px-2 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/80 mb-2">
                Sub Categories
              </div>
              {subTabsForMainTab.product.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSubTab(s.id);
                    setSearchQuery("");
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all duration-155 flex items-center justify-between cursor-pointer ${
                    activeSubTab === s.id
                      ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-extrabold border border-teal-500/15"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <span>{s.label}</span>
                </button>
              ))}
            </div>

            <div className="col-span-12 md:col-span-9 lg:col-span-9.5">
              {renderDynamicMasterDB(activeSubTab, subTabsForMainTab.product.find(s => s.id === activeSubTab)?.label || "")}
            </div>
          </div>
        )}

        {/* TAB 4: FABRIC MASTERS */}
        {activeTab === "fabric" && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-3 lg:col-span-2.5 flex flex-col gap-1 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs h-fit">
              <div className="px-2 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/80 mb-2">
                Sub Categories
              </div>
              {subTabsForMainTab.fabric.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSubTab(s.id);
                    setSearchQuery("");
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all duration-155 flex items-center justify-between cursor-pointer ${
                    activeSubTab === s.id
                      ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-extrabold border border-teal-500/15"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <span>{s.label}</span>
                </button>
              ))}
            </div>

            <div className="col-span-12 md:col-span-9 lg:col-span-9.5">
              {activeSubTab === "fabric-construction" ? (
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
              ) : (
                renderDynamicMasterDB(activeSubTab, subTabsForMainTab.fabric.find(s => s.id === activeSubTab)?.label || "")
              )}
            </div>
          </div>
        )}

        {/* TAB 5: YARN MASTERS */}
        {activeTab === "yarn" && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-3 lg:col-span-2.5 flex flex-col gap-1 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs h-fit">
              <div className="px-2 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/80 mb-2">
                Sub Categories
              </div>
              {subTabsForMainTab.yarn.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSubTab(s.id);
                    setSearchQuery("");
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all duration-155 flex items-center justify-between cursor-pointer ${
                    activeSubTab === s.id
                      ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-extrabold border border-teal-500/15"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <span>{s.label}</span>
                </button>
              ))}
            </div>

            <div className="col-span-12 md:col-span-9 lg:col-span-9.5">
              {renderDynamicMasterDB(activeSubTab, subTabsForMainTab.yarn.find(s => s.id === activeSubTab)?.label || "")}
            </div>
          </div>
        )}

        {/* TAB 6: COLOR & PROCESSING */}
        {activeTab === "color" && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-3 lg:col-span-2.5 flex flex-col gap-1 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs h-fit">
              <div className="px-2 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/80 mb-2">
                Sub Categories
              </div>
              {subTabsForMainTab.color.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSubTab(s.id);
                    setSearchQuery("");
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all duration-155 flex items-center justify-between cursor-pointer ${
                    activeSubTab === s.id
                      ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-extrabold border border-teal-500/15"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <span>{s.label}</span>
                </button>
              ))}
            </div>

            <div className="col-span-12 md:col-span-9 lg:col-span-9.5">
              {renderDynamicMasterDB(activeSubTab, subTabsForMainTab.color.find(s => s.id === activeSubTab)?.label || "")}
            </div>
          </div>
        )}

        {/* TAB 7: COSTING */}
        {activeTab === "costing" && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-3 lg:col-span-2.5 flex flex-col gap-1 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs h-fit">
              <div className="px-2 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/80 mb-2">
                Sub Categories
              </div>
              {subTabsForMainTab.costing.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSubTab(s.id);
                    setSearchQuery("");
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all duration-155 flex items-center justify-between cursor-pointer ${
                    activeSubTab === s.id
                      ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-extrabold border border-teal-500/15"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <span>{s.label}</span>
                </button>
              ))}
            </div>

            <div className="col-span-12 md:col-span-9 lg:col-span-9.5">
              {activeSubTab === "additional-cost-entry" && (
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

              {activeSubTab === "rmg-process-loss" && (
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
            </div>
          </div>
        )}

        {/* TAB 8: QUALITY */}
        {activeTab === "quality" && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-3 lg:col-span-2.5 flex flex-col gap-1 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs h-fit">
              <div className="px-2 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/80 mb-2">
                Sub Categories
              </div>
              {subTabsForMainTab.quality.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSubTab(s.id);
                    setSearchQuery("");
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all duration-155 flex items-center justify-between cursor-pointer ${
                    activeSubTab === s.id
                      ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-extrabold border border-teal-500/15"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <span>{s.label}</span>
                </button>
              ))}
            </div>

            <div className="col-span-12 md:col-span-9 lg:col-span-9.5">
              {activeSubTab === "quality-label" && (
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
