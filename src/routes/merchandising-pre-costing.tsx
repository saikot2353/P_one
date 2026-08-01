import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import MerchandisingLayout from "../components/merchandising/MerchandisingLayout";
import {
  TrendingUp,
  Plus,
  Search,
  Download,
  Printer,
  FileSpreadsheet,
  Edit2,
  Trash2,
  Save,
  ChevronDown,
  ArrowLeft,
  Calculator,
  Image as ImageIcon,
  Check,
  PlusCircle,
  List,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/merchandising-pre-costing")({
  head: () => ({
    meta: [
      { title: "Prepare Pre-Costing — RMG Merchandising" },
      { name: "description", content: "Garments Pre-Costing Sheets, FOB calculations, process loss, and style costing registry." },
    ],
  }),
  component: PreCostingPage,
});

// Types & Interfaces
interface PreCostingStyleItem {
  id: string;
  styleNo: string;
  colour: string;
  itemName: string;
  orderQty: number;
  sizeGroup: string;
  sizes: string;
  sizesQty: number;
  print: boolean;
  embroidery: boolean;
  wash: boolean;
  special: boolean;
  unitPrice: number;
  deliveryDate: string;
  commissionPct: number;
  commissionAmt: number;
}

interface PreCostingRecord {
  id: string;
  queryNo: string;
  queryType: string;
  refNo: string;
  queryDate: string;
  deliveryDate: string;
  customerBuyingHouse: string;
  buyerName: string;
  department: string;
  orderType: string;
  buyerAgent: string;
  buyerBrand: string;
  qualityLevel: string;
  inspectionType: string;
  season: string;
  currency: string;
  exchangeRate: number;
  shippingMode: string;
  payTerm: string;
  tenor: string;
  specialInstructions: string;
  penaltyClauses: string;
  status: "Draft" | "Approved" | "Pending";
  styles: PreCostingStyleItem[];
  processLoss: {
    cutting: number;
    print: number;
    embroidery: number;
    sewing: number;
    wash: number;
    finishing: number;
    extra: number;
  };
  hasAdditionalCosting: boolean;
  additionalCosting: {
    commercialCostPct: number;
    financeCostPct: number;
    buyingCommissionPct: number;
    sampleFabricQty: number;
    sampleFabricRate: number;
  };
  totalOrderQty: number;
  quotedFOB: number;
}

// Initial mockup data
const INITIAL_PRE_COSTINGS: PreCostingRecord[] = [
  {
    id: "PC-2026-001",
    queryNo: "Q-9812",
    queryType: "Regular",
    refNo: "REF-HM-901",
    queryDate: "2026-08-01",
    deliveryDate: "2026-11-20",
    buyerName: "H&M",
    customerBuyingHouse: "Li & Fung",
    department: "Men's Knit",
    orderType: "Regular",
    buyerAgent: "L&F Agent",
    buyerBrand: "H&M Basic",
    qualityLevel: "AQL 2.5",
    inspectionType: "Final Inspection",
    season: "Winter 2026",
    currency: "USD",
    exchangeRate: 120,
    shippingMode: "Sea",
    payTerm: "At Sight",
    tenor: "90 Days",
    specialInstructions: "Use certified organic cotton only.",
    penaltyClauses: "Standard late shipment charge 1.5% weekly.",
    status: "Approved",
    processLoss: { cutting: 2, print: 1, embroidery: 0, sewing: 3, wash: 2, finishing: 1, extra: 0.5 },
    hasAdditionalCosting: true,
    additionalCosting: {
      commercialCostPct: 1.5,
      financeCostPct: 2.0,
      buyingCommissionPct: 3.0,
      sampleFabricQty: 50,
      sampleFabricRate: 4.5
    },
    totalOrderQty: 12000,
    quotedFOB: 4.85,
    styles: [
      {
        id: "style-1",
        styleNo: "ST-8810",
        colour: "Navy Blue",
        itemName: "Men's Basic Tee",
        orderQty: 12000,
        sizeGroup: "S-XXL",
        sizes: "M, L, XL",
        sizesQty: 12000,
        print: true,
        embroidery: false,
        wash: false,
        special: false,
        unitPrice: 4.85,
        deliveryDate: "2026-11-20",
        commissionPct: 3.0,
        commissionAmt: 1746
      }
    ]
  },
  {
    id: "PC-2026-002",
    queryNo: "Q-9815",
    queryType: "Regular",
    refNo: "REF-ZR-502",
    queryDate: "2026-07-28",
    deliveryDate: "2026-12-15",
    buyerName: "Zara",
    customerBuyingHouse: "Synergy",
    department: "Ladies Woven",
    orderType: "Regular",
    buyerAgent: "Synergy Agent",
    buyerBrand: "Zara Trafaluc",
    qualityLevel: "AQL 1.5",
    inspectionType: "Inline & Final",
    season: "Winter 2026",
    currency: "USD",
    exchangeRate: 120,
    shippingMode: "Sea",
    payTerm: "LC",
    tenor: "60 Days",
    specialInstructions: "Confirm shade matching under D65 light source.",
    penaltyClauses: "",
    status: "Pending",
    processLoss: { cutting: 3, print: 0, embroidery: 2, sewing: 4, wash: 3, finishing: 2, extra: 1 },
    hasAdditionalCosting: false,
    additionalCosting: {
      commercialCostPct: 0,
      financeCostPct: 0,
      buyingCommissionPct: 0,
      sampleFabricQty: 0,
      sampleFabricRate: 0
    },
    totalOrderQty: 8500,
    quotedFOB: 7.20,
    styles: [
      {
        id: "style-2",
        styleNo: "ST-4402",
        colour: "Jet Black",
        itemName: "Ladies Blouse",
        orderQty: 8500,
        sizeGroup: "XS-XL",
        sizes: "S, M, L",
        sizesQty: 8500,
        print: false,
        embroidery: true,
        wash: true,
        special: false,
        unitPrice: 7.20,
        deliveryDate: "2026-12-15",
        commissionPct: 0,
        commissionAmt: 0
      }
    ]
  }
];

function PreCostingPage() {
  const [preCostings, setPreCostings] = useState<PreCostingRecord[]>(INITIAL_PRE_COSTINGS);
  const [viewMode, setViewMode] = useState<"list" | "prepare">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBuyer, setFilterBuyer] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // State for active pre-costing edit/create
  const [activeRecordId, setActiveRecordId] = useState<string | null>(null);

  // Form State parameters - Basic
  const [queryNo, setQueryNo] = useState("");
  const [queryType, setQueryType] = useState("Regular");
  const [refNo, setRefNo] = useState("");
  const [queryDate, setQueryDate] = useState("2026-08-01");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [customerBuyingHouse, setCustomerBuyingHouse] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [department, setDepartment] = useState("");
  const [orderType, setOrderType] = useState("Regular");
  const [buyerAgent, setBuyerAgent] = useState("");
  const [buyerBrand, setBuyerBrand] = useState("");
  const [qualityLevel, setQualityLevel] = useState("");
  const [inspectionType, setInspectionType] = useState("");
  const [season, setSeason] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [exchangeRate, setExchangeRate] = useState(120);
  const [shippingMode, setShippingMode] = useState("Sea");
  const [payTerm, setPayTerm] = useState("At Sight");
  const [tenor, setTenor] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [penaltyClauses, setPenaltyClauses] = useState("");
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [zipFileName, setZipFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Process Loss
  const [cuttingLoss, setCuttingLoss] = useState(0);
  const [printLoss, setPrintLoss] = useState(0);
  const [embroideryLoss, setEmbroideryLoss] = useState(0);
  const [sewingLoss, setSewingLoss] = useState(0);
  const [washLoss, setWashLoss] = useState(0);
  const [finishingLoss, setFinishingLoss] = useState(0);
  const [extraLoss, setExtraLoss] = useState(0);

  // Style input form parameters
  const [styleNo, setStyleNo] = useState("");
  const [styleColour, setStyleColour] = useState("");
  const [styleOrderQty, setStyleOrderQty] = useState<number>(0);
  const [styleItemType, setStyleItemType] = useState("Pcs");
  const [styleSizeGroup, setStyleSizeGroup] = useState("");
  const [styleSizes, setStyleSizes] = useState("");
  const [styleSizesQty, setStyleSizesQty] = useState<number>(0);
  const [styleUnitPrice, setStyleUnitPrice] = useState<number>(0);
  const [styleDeliveryDate, setStyleDeliveryDate] = useState("");
  const [styleCommissionPct, setStyleCommissionPct] = useState<number>(0);
  const [styleBuyerCosting, setStyleBuyerCosting] = useState("");
  const [styleHasPrint, setStyleHasPrint] = useState(false);
  const [styleHasEmbroidery, setStyleHasEmbroidery] = useState(false);
  const [styleHasWash, setStyleHasWash] = useState(false);
  const [styleHasSpecial, setStyleHasSpecial] = useState(false);

  // Array of style items added to the current sheet
  const [addedStyles, setAddedStyles] = useState<PreCostingStyleItem[]>([]);

  // Additional Costing
  const [hasAdditionalCosting, setHasAdditionalCosting] = useState(false);
  const [commercialCostPct, setCommercialCostPct] = useState(0.0000);
  const [financeCostPct, setFinanceCostPct] = useState(0.0000);
  const [buyingCommissionPct, setBuyingCommissionPct] = useState(0.0000);
  const [sampleFabricQty, setSampleFabricQty] = useState(0.0000);
  const [sampleFabricRate, setSampleFabricRate] = useState(0.0000);

  // Dynamic calculations
  const totalOrderQty = useMemo(() => {
    return addedStyles.reduce((sum, item) => sum + item.orderQty, 0);
  }, [addedStyles]);

  const totalSizesQty = useMemo(() => {
    return addedStyles.reduce((sum, item) => sum + item.sizesQty, 0);
  }, [addedStyles]);

  const totalCommissionAmt = useMemo(() => {
    return addedStyles.reduce((sum, item) => sum + item.commissionAmt, 0);
  }, [addedStyles]);

  const averageFOB = useMemo(() => {
    if (addedStyles.length === 0) return 0;
    const totalAmount = addedStyles.reduce((sum, item) => sum + (item.orderQty * item.unitPrice), 0);
    return totalAmount / totalOrderQty;
  }, [addedStyles, totalOrderQty]);

  // Plan Cut Quantity calculator
  const calculatedPlanCutQty = useMemo(() => {
    return Math.round(styleOrderQty * (1 + cuttingLoss / 100));
  }, [styleOrderQty, cuttingLoss]);

  // Commission Amount calculator
  const calculatedCommissionAmt = useMemo(() => {
    return (styleOrderQty * styleUnitPrice * styleCommissionPct) / 100;
  }, [styleOrderQty, styleUnitPrice, styleCommissionPct]);

  // Quick Mock Buyers/Buying Houses for select inputs
  const BUYERS = ["H&M", "Zara", "Walmart", "Target", "Levi's", "Gap", "Mango"];
  const BUYING_HOUSES = ["Li & Fung", "Synergy", "Apex Group", "Pearl Global", "Intertek", "Windsor"];
  const SEASONS = ["Summer 2026", "Winter 2026", "Spring 2027", "Autumn 2027"];
  const SIZE_GROUPS = ["S-XXL", "XS-XL", "Kids (2-8Y)", "Numeric (28-36)", "Standard Free"];
  const COLORS = ["Navy Blue", "Jet Black", "Off White", "Melange Gray", "Crimson Red", "Forest Green"];
  const DEPTS = ["Men's Knit", "Ladies Woven", "Kids Playwear", "Denim Department", "Activewear"];

  // Methods
  const handleAddNewPreCost = () => {
    setActiveRecordId(null);
    setQueryNo(`Q-${Math.floor(1000 + Math.random() * 9000)}`);
    setQueryType("Regular");
    setRefNo("");
    setQueryDate("2026-08-01");
    setDeliveryDate("");
    setCustomerBuyingHouse(BUYING_HOUSES[0]);
    setBuyerName(BUYERS[0]);
    setDepartment(DEPTS[0]);
    setOrderType("Regular");
    setBuyerAgent("L&F Agent");
    setBuyerBrand("H&M Basic");
    setQualityLevel("AQL 2.5");
    setInspectionType("Final Inspection");
    setSeason(SEASONS[1]);
    setCurrency("USD");
    setExchangeRate(120);
    setShippingMode("Sea");
    setPayTerm("At Sight");
    setTenor("");
    setSpecialInstructions("");
    setPenaltyClauses("");
    setImageFile(null);
    setZipFileName("");
    setUploadProgress(null);

    setCuttingLoss(0);
    setPrintLoss(0);
    setEmbroideryLoss(0);
    setSewingLoss(0);
    setWashLoss(0);
    setFinishingLoss(0);
    setExtraLoss(0);

    setStyleNo("");
    setStyleColour(COLORS[0]);
    setStyleOrderQty(0);
    setStyleItemType("Pcs");
    setStyleSizeGroup(SIZE_GROUPS[0]);
    setStyleSizes("");
    setStyleSizesQty(0);
    setStyleUnitPrice(0);
    setStyleDeliveryDate("");
    setStyleCommissionPct(0);
    setStyleBuyerCosting("");
    setStyleHasPrint(false);
    setStyleHasEmbroidery(false);
    setStyleHasWash(false);
    setStyleHasSpecial(false);
    setAddedStyles([]);

    setHasAdditionalCosting(false);
    setCommercialCostPct(0.0000);
    setFinanceCostPct(0.0000);
    setBuyingCommissionPct(0.0000);
    setSampleFabricQty(0.0000);
    setSampleFabricRate(0.0000);

    setViewMode("prepare");
  };

  const handleEditPreCost = (rec: PreCostingRecord) => {
    setActiveRecordId(rec.id);
    setQueryNo(rec.queryNo);
    setQueryType(rec.queryType);
    setRefNo(rec.refNo);
    setQueryDate(rec.queryDate);
    setDeliveryDate(rec.deliveryDate);
    setCustomerBuyingHouse(rec.customerBuyingHouse);
    setBuyerName(rec.buyerName);
    setDepartment(rec.department);
    setOrderType(rec.orderType);
    setBuyerAgent(rec.buyerAgent);
    setBuyerBrand(rec.buyerBrand);
    setQualityLevel(rec.qualityLevel);
    setInspectionType(rec.inspectionType);
    setSeason(rec.season);
    setCurrency(rec.currency);
    setExchangeRate(rec.exchangeRate);
    setShippingMode(rec.shippingMode);
    setPayTerm(rec.payTerm);
    setTenor(rec.tenor);
    setSpecialInstructions(rec.specialInstructions);
    setPenaltyClauses(rec.penaltyClauses);
    setAddedStyles(rec.styles);

    setCuttingLoss(rec.processLoss.cutting);
    setPrintLoss(rec.processLoss.print);
    setEmbroideryLoss(rec.processLoss.embroidery);
    setSewingLoss(rec.processLoss.sewing);
    setWashLoss(rec.processLoss.wash);
    setFinishingLoss(rec.processLoss.finishing);
    setExtraLoss(rec.processLoss.extra);

    setHasAdditionalCosting(rec.hasAdditionalCosting);
    if (rec.additionalCosting) {
      setCommercialCostPct(rec.additionalCosting.commercialCostPct);
      setFinanceCostPct(rec.additionalCosting.financeCostPct);
      setBuyingCommissionPct(rec.additionalCosting.buyingCommissionPct);
      setSampleFabricQty(rec.additionalCosting.sampleFabricQty);
      setSampleFabricRate(rec.additionalCosting.sampleFabricRate);
    }

    setViewMode("prepare");
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm("Are you sure you want to delete this pre-costing sheet?")) {
      setPreCostings(prev => prev.filter(p => p.id !== id));
      toast.success("Pre-Costing Sheet deleted successfully.");
    }
  };

  const handleBuyerChange = (buyer: string) => {
    setBuyerName(buyer);
    if (buyer === "H&M") {
      setBuyerAgent("L&F Agent");
      setBuyerBrand("H&M Basic");
      setCustomerBuyingHouse("Li & Fung");
    } else if (buyer === "Zara") {
      setBuyerAgent("Synergy Agent");
      setBuyerBrand("Zara Trafaluc");
      setCustomerBuyingHouse("Synergy");
    } else if (buyer === "Walmart") {
      setBuyerAgent("Apex Agent");
      setBuyerBrand("George");
      setCustomerBuyingHouse("Apex Group");
    } else if (buyer === "Target") {
      setBuyerAgent("Pearl Agent");
      setBuyerBrand("Target Denim");
      setCustomerBuyingHouse("Pearl Global");
    }
  };

  const handleStyleOrderQtyChange = (qty: number) => {
    setStyleOrderQty(qty);
    if (styleSizesQty === 0 || styleSizesQty === qty) {
      setStyleSizesQty(qty);
    }
  };

  const handleAddStyleToList = () => {
    if (!styleNo) {
      toast.error("Please enter a Style Number.");
      return;
    }
    if (styleOrderQty <= 0) {
      toast.error("Please enter a valid Style Order Quantity.");
      return;
    }
    if (styleUnitPrice <= 0) {
      toast.error("Please enter a valid Style Unit Price.");
      return;
    }

    const newItem: PreCostingStyleItem = {
      id: `style-${Date.now()}`,
      styleNo,
      colour: styleColour,
      itemName: styleBuyerCosting || "Garments Item",
      orderQty: styleOrderQty,
      sizeGroup: styleSizeGroup,
      sizes: styleSizes,
      sizesQty: styleSizesQty || styleOrderQty,
      print: styleHasPrint,
      embroidery: styleHasEmbroidery,
      wash: styleHasWash,
      special: styleHasSpecial,
      unitPrice: styleUnitPrice,
      deliveryDate: styleDeliveryDate || deliveryDate || "2026-08-01",
      commissionPct: styleCommissionPct,
      commissionAmt: calculatedCommissionAmt
    };

    setAddedStyles(prev => [...prev, newItem]);
    toast.success(`Style ${styleNo} added to cost breakdown!`);

    // Reset style fields
    setStyleNo("");
    setStyleBuyerCosting("");
    setStyleOrderQty(0);
    setStyleUnitPrice(0);
    setStyleSizes("");
    setStyleSizesQty(0);
    setStyleCommissionPct(0);
    setStyleHasPrint(false);
    setStyleHasEmbroidery(false);
    setStyleHasWash(false);
    setStyleHasSpecial(false);
  };

  const handleRemoveStyle = (styleId: string) => {
    setAddedStyles(prev => prev.filter(s => s.id !== styleId));
    toast.success("Style removed from break-down list.");
  };

  const handleSaveSheet = () => {
    if (addedStyles.length === 0) {
      toast.error("Please add at least one style item in the cost breakdown.");
      return;
    }

    const payload: PreCostingRecord = {
      id: activeRecordId || `PC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      queryNo,
      queryType,
      refNo,
      queryDate,
      deliveryDate: deliveryDate || addedStyles[0]?.deliveryDate || "2026-08-01",
      customerBuyingHouse,
      buyerName,
      department,
      orderType,
      buyerAgent,
      buyerBrand,
      qualityLevel,
      inspectionType,
      season,
      currency,
      exchangeRate,
      shippingMode,
      payTerm,
      tenor,
      specialInstructions,
      penaltyClauses,
      status: activeRecordId ? (preCostings.find(p => p.id === activeRecordId)?.status || "Draft") : "Draft",
      styles: addedStyles,
      processLoss: {
        cutting: cuttingLoss,
        print: printLoss,
        embroidery: embroideryLoss,
        sewing: sewingLoss,
        wash: washLoss,
        finishing: finishingLoss,
        extra: extraLoss
      },
      hasAdditionalCosting,
      additionalCosting: {
        commercialCostPct,
        financeCostPct,
        buyingCommissionPct,
        sampleFabricQty,
        sampleFabricRate
      },
      totalOrderQty,
      quotedFOB: Number(averageFOB.toFixed(2))
    };

    if (activeRecordId) {
      setPreCostings(prev => prev.map(p => p.id === activeRecordId ? payload : p));
      toast.success("Pre-Costing Sheet updated successfully!");
    } else {
      setPreCostings(prev => [payload, ...prev]);
      toast.success("New Pre-Costing Sheet saved to database!");
    }

    setViewMode("list");
  };

  const filteredPreCostings = useMemo(() => {
    return preCostings.filter(p => {
      const matchBuyer = filterBuyer === "All" || p.buyerName === filterBuyer;
      const matchStatus = filterStatus === "All" || p.status === filterStatus;
      const s = searchQuery.toLowerCase();
      const matchSearch = searchQuery === "" ||
        p.queryNo.toLowerCase().includes(s) ||
        p.refNo.toLowerCase().includes(s) ||
        p.buyerName.toLowerCase().includes(s) ||
        p.department.toLowerCase().includes(s);
      return matchBuyer && matchStatus && matchSearch;
    });
  }, [preCostings, filterBuyer, filterStatus, searchQuery]);

  // CSS Styling matching standard Pakiza/Cripton portal looks
  const sectionContainerClass = "border-l-4 border-[#1e88e5] bg-white dark:bg-slate-900 rounded-r-xl border-y border-r border-slate-200/85 dark:border-slate-800 p-5 shadow-xs space-y-4 transition-all duration-200";
  const sectionTitleClass = "text-sm font-extrabold text-[#1e88e5] dark:text-[#42a5f5] pb-1 tracking-wide flex items-center gap-2";
  const labelClass = "block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1";
  const inputClass = "w-full h-8 px-2 text-xs border border-slate-200 dark:border-slate-700 rounded-sm bg-white dark:bg-slate-850 focus:outline-none focus:border-[#1e88e5] font-semibold text-slate-800 dark:text-slate-200 shadow-2xs";
  const selectClass = "w-full h-8 px-2 text-xs border border-slate-200 dark:border-slate-700 rounded-sm bg-white dark:bg-slate-850 focus:outline-none focus:border-[#1e88e5] font-semibold text-slate-800 dark:text-slate-200 cursor-pointer shadow-2xs appearance-none pr-7";

  return (
    <MerchandisingLayout
      activePath="pre-costing"
      breadcrumbs={[{ label: "Pre Costing" }, { label: "Prepare Pre-Cost" }]}
      title={viewMode === "list" ? "Pre-Costing Registry" : "Prepare Pre-Cost"}
    >
      <div className="p-4 md:p-6 bg-[#f4f6f9] dark:bg-slate-950 min-h-full font-sans space-y-6 transition-colors duration-200">
        
        {/* ── LIST MODE VIEW ── */}
        {viewMode === "list" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div>
                <h2 className="text-lg font-black tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
                  <span className="p-1.5 bg-[#1e88e5]/10 text-[#1e88e5] rounded-lg">
                    <TrendingUp className="size-4.5" />
                  </span>
                  Pre-Costing Registry
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Manage and prepare pre-costing FOB sheets for buyer style inquiries
                </p>
              </div>

              <button
                onClick={handleAddNewPreCost}
                className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="size-4.5" /> Prepare Pre-Cost
              </button>
            </div>

            {/* Filters Toolbar */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Query No, Ref, Buyer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800/80 focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-900/60 transition-all font-medium text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">Buyer:</span>
                  <div className="relative">
                    <select
                      value={filterBuyer}
                      onChange={(e) => setFilterBuyer(e.target.value)}
                      className="h-9 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-200 appearance-none pr-8 cursor-pointer"
                    >
                      <option value="All">All Buyers</option>
                      {BUYERS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                    <ChevronDown className="size-3 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">Status:</span>
                  <div className="relative">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="h-9 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-200 appearance-none pr-8 cursor-pointer"
                    >
                      <option value="All">All Status</option>
                      <option value="Draft">Draft</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                    </select>
                    <ChevronDown className="size-3 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="h-9 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>

                <div className="flex items-center gap-1.5">
                  <button className="h-9 px-3 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition">
                    <FileSpreadsheet className="size-4 text-emerald-600" /> Excel
                  </button>
                  <button className="h-9 px-3 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition">
                    <Printer className="size-4 text-sky-600" /> Print
                  </button>
                </div>
              </div>
            </div>

            {/* List Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200/60 dark:border-slate-800/80">
                    <tr>
                      <th className="px-5 py-4 w-12 text-center">#</th>
                      <th className="px-5 py-4">Query No</th>
                      <th className="px-5 py-4">Ref No</th>
                      <th className="px-5 py-4">Buyer</th>
                      <th className="px-5 py-4">Department</th>
                      <th className="px-5 py-4 text-right">Total Quantity</th>
                      <th className="px-5 py-4 text-right">Avg Quoted FOB ($)</th>
                      <th className="px-5 py-4">Delivery Date</th>
                      <th className="px-5 py-4 text-center">Status</th>
                      <th className="px-5 py-4 text-center w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                    {filteredPreCostings.map((rec, idx) => (
                      <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-3.5 text-center font-semibold text-slate-400">{idx + 1}</td>
                        <td className="px-5 py-3.5 font-bold text-[#1e88e5]">{rec.queryNo}</td>
                        <td className="px-5 py-3.5 font-semibold">{rec.refNo || "—"}</td>
                        <td className="px-5 py-3.5 font-semibold text-slate-950 dark:text-white">{rec.buyerName}</td>
                        <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{rec.department}</td>
                        <td className="px-5 py-3.5 text-right font-mono font-bold">{rec.totalOrderQty.toLocaleString()} pcs</td>
                        <td className="px-5 py-3.5 text-right font-mono font-extrabold text-indigo-600 dark:text-indigo-400">$ {rec.quotedFOB.toFixed(2)}</td>
                        <td className="px-5 py-3.5 font-semibold text-slate-600 dark:text-slate-400">{rec.deliveryDate}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              rec.status === "Approved"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : rec.status === "Pending"
                                ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                : "bg-slate-500/10 text-slate-600 border-slate-500/20"
                            }`}
                          >
                            {rec.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-2.5">
                            <button
                              onClick={() => handleEditPreCost(rec)}
                              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-amber-500 hover:text-amber-600 rounded-md transition cursor-pointer"
                              title="Edit Pre-Cost Sheet"
                            >
                              <Edit2 className="size-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRecord(rec.id)}
                              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-red-500 hover:text-red-650 rounded-md transition cursor-pointer"
                              title="Delete sheet"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredPreCostings.length === 0 && (
                      <tr>
                        <td colSpan={10} className="px-5 py-12 text-center text-slate-400 font-semibold">
                          No pre-costing configurations found. Click "+ Prepare Pre-Cost" to create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── PREPARE PRE-COST FORM WORKSPACE ── */}
        {viewMode === "prepare" && (
          <div className="space-y-6 animate-in slide-in-from-right-5 duration-200">
            {/* Form Header Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode("list")}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl transition cursor-pointer"
                >
                  <ArrowLeft className="size-5" />
                </button>
                <div>
                  <h2 className="text-lg font-black tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
                    Prepare Pre-Cost
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Query No: <span className="font-bold text-[#1e88e5]">{queryNo}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">Query:</span>
                <span className="text-xs font-black text-[#1e88e5] bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 px-3 py-1 rounded-lg">{queryNo || "—"}</span>
                {addedStyles.length > 0 && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 px-3 py-1 rounded-lg">
                    {addedStyles.length} style{addedStyles.length > 1 ? "s" : ""} added
                  </span>
                )}
              </div>
            </div>

            {/* Main Form Split Grid */}
            <div className="space-y-6">
              
              {/* 1. Order Basic Information Card */}
              <div className={sectionContainerClass}>
                <div className="border-b border-slate-100 dark:border-slate-800/60 pb-2 mb-2">
                  <h3 className={sectionTitleClass}>Order Basic Information</h3>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left Form Fields Grid */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div>
                      <label className={labelClass}>Query No</label>
                      <input
                        type="text"
                        value={queryNo}
                        onChange={(e) => setQueryNo(e.target.value)}
                        className={inputClass}
                        placeholder="e.g. Q-9012"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Order Quantity</label>
                      <input
                        type="number"
                        value={totalOrderQty || ""}
                        readOnly
                        className={`${inputClass} bg-slate-50 dark:bg-slate-800 cursor-not-allowed text-[#1e88e5] font-bold`}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className={`${labelClass} text-rose-500`}>Query Type *</label>
                      <div className="relative">
                        <select
                          value={queryType}
                          onChange={(e) => setQueryType(e.target.value)}
                          className={selectClass}
                        >
                          <option value="Regular">Regular</option>
                          <option value="Urgent">Urgent</option>
                          <option value="Promo">Promo</option>
                        </select>
                        <ChevronDown className="size-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Ref No</label>
                      <input
                        type="text"
                        value={refNo}
                        onChange={(e) => setRefNo(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={`${labelClass} text-rose-500`}>Query Date *</label>
                      <input
                        type="date"
                        value={queryDate}
                        onChange={(e) => setQueryDate(e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Delivery Date</label>
                      <input
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Customer/Buying House</label>
                      <div className="relative">
                        <select
                          value={customerBuyingHouse}
                          onChange={(e) => setCustomerBuyingHouse(e.target.value)}
                          className={selectClass}
                        >
                          <option value="">Select...</option>
                          {BUYING_HOUSES.map((h) => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                        <ChevronDown className="size-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className={`${labelClass} text-rose-500`}>Buyer Name *</label>
                      <div className="relative">
                        <select
                          value={buyerName}
                          onChange={(e) => handleBuyerChange(e.target.value)}
                          className={selectClass}
                          required
                        >
                          <option value="">select...</option>
                          {BUYERS.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                        <ChevronDown className="size-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className={`${labelClass} text-rose-500`}>Department *</label>
                      <div className="relative">
                        <select
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className={selectClass}
                          required
                        >
                          <option value="">Select...</option>
                          {DEPTS.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                        <ChevronDown className="size-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Order Type</label>
                      <div className="relative">
                        <select
                          value={orderType}
                          onChange={(e) => setOrderType(e.target.value)}
                          className={selectClass}
                        >
                          <option value="Regular">Regular</option>
                          <option value="Promo">Promo</option>
                        </select>
                        <ChevronDown className="size-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Buyer Agent</label>
                      <input
                        type="text"
                        value={buyerAgent}
                        onChange={(e) => setBuyerAgent(e.target.value)}
                        className={inputClass}
                        placeholder="Agent Name"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Buyer Brand</label>
                      <input
                        type="text"
                        value={buyerBrand}
                        onChange={(e) => setBuyerBrand(e.target.value)}
                        className={inputClass}
                        placeholder="Brand Name"
                      />
                    </div>
                    <div>
                      <label className={`${labelClass} text-rose-500`}>Quality Level *</label>
                      <div className="relative">
                        <select
                          value={qualityLevel}
                          onChange={(e) => setQualityLevel(e.target.value)}
                          className={selectClass}
                        >
                          <option value="">Select...</option>
                          <option value="AQL 1.5">AQL 1.5</option>
                          <option value="AQL 2.5">AQL 2.5</option>
                          <option value="AQL 4.0">AQL 4.0</option>
                        </select>
                        <ChevronDown className="size-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className={`${labelClass} text-rose-500`}>Inspection Type *</label>
                      <div className="relative">
                        <select
                          value={inspectionType}
                          onChange={(e) => setInspectionType(e.target.value)}
                          className={selectClass}
                        >
                          <option value="">Select...</option>
                          <option value="Final Inspection">Final Inspection</option>
                          <option value="Inline & Final">Inline & Final</option>
                        </select>
                        <ChevronDown className="size-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className={`${labelClass} text-rose-500`}>Season *</label>
                      <div className="relative">
                        <select
                          value={season}
                          onChange={(e) => setSeason(e.target.value)}
                          className={selectClass}
                          required
                        >
                          <option value="">Select...</option>
                          {SEASONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <ChevronDown className="size-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Currency</label>
                      <div className="relative">
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className={selectClass}
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="BDT">BDT</option>
                        </select>
                        <ChevronDown className="size-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Exchange Rate</label>
                      <input
                        type="number"
                        value={exchangeRate}
                        onChange={(e) => setExchangeRate(Number(e.target.value))}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Shipping Mode</label>
                      <div className="relative">
                        <select
                          value={shippingMode}
                          onChange={(e) => setShippingMode(e.target.value)}
                          className={selectClass}
                        >
                          <option value="Sea">Sea</option>
                          <option value="Air">Air</option>
                        </select>
                        <ChevronDown className="size-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Pay Term</label>
                      <div className="relative">
                        <select
                          value={payTerm}
                          onChange={(e) => setPayTerm(e.target.value)}
                          className={selectClass}
                        >
                          <option value="At Sight">At Sight</option>
                          <option value="LC">LC</option>
                          <option value="TT">TT</option>
                        </select>
                        <ChevronDown className="size-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Tenor</label>
                      <input
                        type="text"
                        value={tenor}
                        onChange={(e) => setTenor(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Special Instructions</label>
                      <input
                        type="text"
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Penalty Clauses</label>
                      <input
                        type="text"
                        value={penaltyClauses}
                        onChange={(e) => setPenaltyClauses(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Zip File Upload</label>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            onChange={(e) => {
                              const name = e.target.files?.[0]?.name || "";
                              setZipFileName(name);
                              setUploadProgress(10);
                              const interval = setInterval(() => {
                                setUploadProgress((prev) => {
                                  if (prev === null) return null;
                                  if (prev >= 100) {
                                    clearInterval(interval);
                                    toast.success("Design pack uploaded successfully!");
                                    return 100;
                                  }
                                  return prev + 30;
                                });
                              }, 150);
                            }}
                            className="hidden"
                            id="zip-upload"
                          />
                          <label
                            htmlFor="zip-upload"
                            className="h-8 px-4 rounded-sm bg-slate-100 hover:bg-slate-200 border border-slate-350 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer shadow-2xs"
                          >
                            Choose File
                          </label>
                          <span className="text-xs text-slate-500 font-medium truncate max-w-xs">
                            {zipFileName || "No file chosen"}
                          </span>
                        </div>
                        {uploadProgress !== null && (
                          <div className="w-full max-w-xs flex items-center gap-2">
                            <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                            <span className="text-[9px] font-bold text-slate-500">{uploadProgress}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Photo Frame on the right */}
                  <div className="w-full lg:w-44 flex flex-col items-center justify-center shrink-0 border border-slate-200 p-3 rounded-lg bg-slate-50/50">
                    <div className="w-full h-32 bg-[#e9ecef] border border-slate-350/40 flex items-center justify-center text-slate-400 overflow-hidden shadow-2xs relative">
                      {imageLoading ? (
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <Loader2 className="size-6 text-[#1e88e5] animate-spin" />
                          <span className="text-[8px] font-bold text-slate-500">UPLOADING...</span>
                        </div>
                      ) : imageFile ? (
                        <img src={imageFile} alt="Preview" className="size-full object-cover" />
                      ) : (
                        <div className="text-center p-2 flex flex-col items-center justify-center h-full">
                          <ImageIcon className="size-8 text-slate-400 mb-1" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">NO IMAGE</span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">AVAILABLE</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-2.5 w-full">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setImageLoading(true);
                            setTimeout(() => {
                              setImageFile(URL.createObjectURL(file));
                              setImageLoading(false);
                              toast.success("Image preview loaded!");
                            }, 600);
                          }
                        }}
                        className="hidden"
                        id="style-img-upload"
                      />
                      <label
                        htmlFor="style-img-upload"
                        className="h-7 w-full rounded-sm bg-white border border-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        Choose File
                      </label>
                      <span className="text-[9px] text-slate-400 text-center block mt-1">No file chosen</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Operation Process Loss (RMG) */}
              <div className={sectionContainerClass}>
                <div className="border-b border-slate-100 dark:border-slate-800/60 pb-2 mb-2">
                  <h3 className={sectionTitleClass}>Operation Process Loss (RMG)</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Cutting (%)", val: cuttingLoss, set: setCuttingLoss },
                    { label: "Print (%)", val: printLoss, set: setPrintLoss },
                    { label: "Embroidery (%)", val: embroideryLoss, set: setEmbroideryLoss },
                    { label: "Sewing (%)", val: sewingLoss, set: setSewingLoss },
                    { label: "Garment Wash/Dye (%)", val: washLoss, set: setWashLoss },
                    { label: "Finishing (%)", val: finishingLoss, set: setFinishingLoss },
                    { label: "Extra (%)", val: extraLoss, set: setExtraLoss },
                  ].map((itm) => (
                    <div key={itm.label}>
                      <label className={labelClass}>{itm.label}</label>
                      <input
                        type="number"
                        step="0.01"
                        value={itm.val}
                        onChange={(e) => itm.set(Number(e.target.value))}
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Order Style Information */}
              <div className={sectionContainerClass}>
                <div className="border-b border-slate-100 dark:border-slate-800/60 pb-2 mb-2">
                  <h3 className={sectionTitleClass}>Order Style Information</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className={`${labelClass} text-rose-500`}>Style No *</label>
                    <input
                      type="text"
                      value={styleNo}
                      onChange={(e) => setStyleNo(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Colour *</label>
                    <div className="flex items-center gap-1.5">
                      <div className="relative flex-1">
                        <select
                          value={styleColour}
                          onChange={(e) => setStyleColour(e.target.value)}
                          className={selectClass}
                        >
                          <option value="">Select...</option>
                          {COLORS.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <ChevronDown className="size-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const val = prompt("Enter new colour name:");
                          if (val) {
                            setStyleColour(val);
                            toast.success(`Colour "${val}" selected!`);
                          }
                        }}
                        className="h-8 w-8 rounded-sm border border-slate-200 bg-white flex items-center justify-center text-orange-500 hover:bg-slate-50 transition shadow-2xs"
                        title="Add Custom Colour"
                      >
                        <PlusCircle className="size-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={`${labelClass} text-rose-500`}>Style Order Qty *</label>
                    <input
                      type="number"
                      value={styleOrderQty || ""}
                      onChange={(e) => handleStyleOrderQtyChange(Number(e.target.value))}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={`${labelClass} text-rose-500`}>Item Type *</label>
                    <div className="flex items-center gap-1.5">
                      <div className="relative flex-1">
                        <select
                          value={styleItemType}
                          onChange={(e) => setStyleItemType(e.target.value)}
                          className={selectClass}
                          required
                        >
                          <option value="Pcs">Pcs</option>
                          <option value="Set">Set</option>
                          <option value="Dozen">Dozen</option>
                        </select>
                        <ChevronDown className="size-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      <button
                        type="button"
                        className="h-8 w-8 rounded-sm border border-slate-200 bg-white flex items-center justify-center text-[#1e88e5] hover:bg-slate-50 transition shadow-2xs"
                        title="Item Type List"
                      >
                        <List className="size-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={`${labelClass} text-rose-500`}>Size Group *</label>
                    <div className="flex items-center gap-1.5">
                      <div className="relative flex-1">
                        <select
                          value={styleSizeGroup}
                          onChange={(e) => setStyleSizeGroup(e.target.value)}
                          className={selectClass}
                          required
                        >
                          <option value="">Select...</option>
                          {SIZE_GROUPS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <ChevronDown className="size-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const val = prompt("Enter size details (e.g. S, M, L):");
                            if (val) setStyleSizes(val);
                          }}
                          className="h-8 px-2 rounded-sm bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[10px] tracking-wide uppercase transition shadow-2xs"
                        >
                          SIZE
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setStyleSizeGroup("");
                            setStyleSizes("");
                          }}
                          className="h-8 px-2 rounded-sm bg-[#5c6bc0] hover:bg-[#3f51b5] text-white font-extrabold text-[10px] tracking-wide uppercase transition shadow-2xs"
                        >
                          RESET
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Sizes</label>
                    <input
                      type="text"
                      value={styleSizes}
                      onChange={(e) => setStyleSizes(e.target.value)}
                      className={inputClass}
                      placeholder="e.g. S, M, L"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Sizes Qty</label>
                    <input
                      type="number"
                      value={styleSizesQty || ""}
                      onChange={(e) => setStyleSizesQty(Number(e.target.value))}
                      className={inputClass}
                      placeholder="Default matches Order Qty"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Buyer Costing</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={styleBuyerCosting}
                        onChange={(e) => setStyleBuyerCosting(e.target.value)}
                        className={inputClass}
                        placeholder="Select..."
                      />
                      <button
                        type="button"
                        className="h-8 w-8 rounded-sm border border-slate-200 bg-white flex items-center justify-center text-[#1e88e5] hover:bg-slate-55 transition shadow-2xs"
                      >
                        <Search className="size-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={`${labelClass} text-rose-500`}>Style Unit Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={styleUnitPrice || ""}
                      onChange={(e) => setStyleUnitPrice(Number(e.target.value))}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={`${labelClass} text-rose-500`}>Style Delivery Date *</label>
                    <input
                      type="date"
                      value={styleDeliveryDate}
                      onChange={(e) => setStyleDeliveryDate(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Plan Cut Qty</label>
                    <input
                      type="number"
                      value={calculatedPlanCutQty}
                      readOnly
                      className={`${inputClass} bg-slate-50 dark:bg-slate-800 cursor-not-allowed text-slate-500`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelClass}>Comm. (%)</label>
                      <input
                        type="number"
                        value={styleCommissionPct || ""}
                        onChange={(e) => setStyleCommissionPct(Number(e.target.value))}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Comm. AMT</label>
                      <input
                        type="number"
                        value={calculatedCommissionAmt}
                        readOnly
                        className={`${inputClass} bg-slate-50 dark:bg-slate-800 cursor-not-allowed text-slate-500`}
                      />
                    </div>
                  </div>
                </div>

                {/* Print/Embroidery/Wash buttons + ADD TO LIST */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 mt-1">
                  <div className="flex items-center gap-1 bg-[#ffcdd2]/20 p-1.5 rounded-md border border-[#ff8a80]/30">
                    {[
                      { label: "PRINT", val: styleHasPrint, set: setStyleHasPrint },
                      { label: "EMBROIDERY", val: styleHasEmbroidery, set: setStyleHasEmbroidery },
                      { label: "WASH", val: styleHasWash, set: setStyleHasWash },
                      { label: "SPECIAL", val: styleHasSpecial, set: setStyleHasSpecial },
                    ].map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => item.set(!item.val)}
                        className={`h-7 px-3.5 text-[9px] font-black tracking-wider rounded-md border transition-all ${
                          item.val
                            ? "bg-[#d32f2f] text-white border-[#d32f2f] shadow-xs"
                            : "bg-[#ffebee] hover:bg-[#ffcdd2] text-[#c62828] border-[#ffcdd2]/50"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddStyleToList}
                    className="h-8.5 px-6 bg-[#2196f3] hover:bg-[#1976d2] text-white font-extrabold text-xs rounded-sm transition tracking-wider uppercase shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    ADD TO LIST
                  </button>
                </div>
              </div>

              {/* 4. Styles breakdown table (Order Basic Information list) */}
              <div className={sectionContainerClass}>
                <div className="border-b border-slate-100 dark:border-slate-800/60 pb-2 mb-2 flex justify-between items-center">
                  <h3 className={sectionTitleClass}>Order Basic Information</h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    Breakdown Ledger
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-sm">
                  <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
                    <thead className="bg-[#cbd5e1] text-slate-700 font-bold uppercase tracking-wider text-[9px] border-b border-slate-350">
                      <tr>
                        <th className="border-r border-b border-slate-300 px-3 py-2 text-center w-10">#</th>
                        <th className="border-r border-b border-slate-300 px-3 py-2">Style No</th>
                        <th className="border-r border-b border-slate-300 px-3 py-2">Colour</th>
                        <th className="border-r border-b border-slate-300 px-3 py-2">Item Name</th>
                        <th className="border-r border-b border-slate-300 px-3 py-2 text-right">OrderQty</th>
                        <th className="border-r border-b border-slate-300 px-3 py-2">Size Group</th>
                        <th className="border-r border-b border-slate-300 px-3 py-2">Sizes</th>
                        <th className="border-r border-b border-slate-300 px-3 py-2 text-right">SizesQty</th>
                        <th className="border-r border-b border-slate-300 px-3 py-2 text-center">Print</th>
                        <th className="border-r border-b border-slate-300 px-3 py-2 text-center">Embroidery</th>
                        <th className="border-r border-b border-slate-300 px-3 py-2 text-center">Wash</th>
                        <th className="border-r border-b border-slate-300 px-3 py-2 text-center">Special</th>
                        <th className="border-r border-b border-slate-300 px-3 py-2 text-right">UnitPrice</th>
                        <th className="border-r border-b border-slate-300 px-3 py-2">DeliveryDate</th>
                        <th className="border-b border-slate-300 px-3 py-2 text-center w-10">🗑</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800 dark:text-slate-250 bg-white">
                      {addedStyles.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="border-r border-slate-200 px-3 py-2 text-center font-bold text-slate-400">{idx + 1}</td>
                          <td className="border-r border-slate-200 px-3 py-2 font-bold text-slate-800">{item.styleNo}</td>
                          <td className="border-r border-slate-200 px-3 py-2 font-semibold">{item.colour}</td>
                          <td className="border-r border-slate-200 px-3 py-2">{item.itemName}</td>
                          <td className="border-r border-slate-200 px-3 py-2 text-right font-mono font-bold">{item.orderQty.toLocaleString()}</td>
                          <td className="border-r border-slate-200 px-3 py-2">{item.sizeGroup}</td>
                          <td className="border-r border-slate-200 px-3 py-2 truncate max-w-[120px]">{item.sizes || "—"}</td>
                          <td className="border-r border-slate-200 px-3 py-2 text-right font-mono">{item.sizesQty.toLocaleString()}</td>
                          <td className="border-r border-slate-200 px-3 py-2 text-center">
                            {item.print ? <span className="inline-block px-1 bg-rose-50 text-rose-600 rounded-xs text-[8px] font-bold">Yes</span> : "—"}
                          </td>
                          <td className="border-r border-slate-200 px-3 py-2 text-center">
                            {item.embroidery ? <span className="inline-block px-1 bg-rose-50 text-rose-600 rounded-xs text-[8px] font-bold">Yes</span> : "—"}
                          </td>
                          <td className="border-r border-slate-200 px-3 py-2 text-center">
                            {item.wash ? <span className="inline-block px-1 bg-rose-50 text-rose-600 rounded-xs text-[8px] font-bold">Yes</span> : "—"}
                          </td>
                          <td className="border-r border-slate-200 px-3 py-2 text-center">
                            {item.special ? <span className="inline-block px-1 bg-rose-50 text-rose-600 rounded-xs text-[8px] font-bold">Yes</span> : "—"}
                          </td>
                          <td className="border-r border-slate-200 px-3 py-2 text-right font-mono font-bold">$ {item.unitPrice.toFixed(2)}</td>
                          <td className="border-r border-slate-200 px-3 py-2 text-slate-500">{item.deliveryDate}</td>
                          <td className="px-3 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveStyle(item.id)}
                              className="text-red-500 hover:text-red-750 transition cursor-pointer"
                              title="Delete row"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                      {addedStyles.length === 0 && (
                        <tr>
                          <td colSpan={15} className="px-3 py-8 text-center text-slate-400 font-semibold bg-slate-50/50">
                            No style items added yet. Click "ADD TO LIST" above.
                          </td>
                        </tr>
                      )}
                    </tbody>
                    {addedStyles.length > 0 && (
                      <tfoot className="bg-[#f8fafc] dark:bg-slate-800 font-bold border-t border-slate-300 text-slate-850 dark:text-slate-200 text-xs">
                        <tr>
                          <td colSpan={4} className="border-r border-slate-200 px-3 py-2 text-right uppercase tracking-wider text-[9px] font-extrabold text-slate-500">Total</td>
                          <td className="border-r border-slate-200 px-3 py-2 text-right font-mono text-[#1e88e5] font-black">{totalOrderQty.toLocaleString()}</td>
                          <td colSpan={2} className="border-r border-slate-200 px-3 py-2"></td>
                          <td className="border-r border-slate-200 px-3 py-2 text-right font-mono font-bold text-slate-700">{totalSizesQty.toLocaleString()}</td>
                          <td colSpan={4} className="border-r border-slate-200 px-3 py-2"></td>
                          <td className="border-r border-slate-200 px-3 py-2 text-right font-mono text-indigo-600 font-black">$ {averageFOB.toFixed(2)}</td>
                          <td colSpan={2} className="px-3 py-2"></td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>

              {/* 5. Additional Costing */}
              <div className={sectionContainerClass}>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2 mb-2">
                  <div className="text-xs font-extrabold uppercase tracking-widest text-[#1e88e5] flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="enable-additional-costing"
                      checked={hasAdditionalCosting}
                      onChange={(e) => setHasAdditionalCosting(e.target.checked)}
                      className="size-4 text-primary border-slate-350 rounded-sm focus:ring-[#1e88e5] cursor-pointer accent-[#1e88e5]"
                    />
                    <label htmlFor="enable-additional-costing" className="cursor-pointer font-bold">
                      Additional Costing
                    </label>
                  </div>
                </div>

                {hasAdditionalCosting ? (
                  <div className="overflow-x-auto border border-slate-250 rounded-sm animate-in fade-in duration-200">
                    <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
                      <thead className="bg-[#cbd5e1] text-slate-700 font-bold uppercase tracking-wider text-[9px] border-b border-slate-300">
                        <tr>
                          <th className="border-r border-slate-300 px-3 py-2 text-center w-10">#</th>
                          <th className="border-r border-slate-300 px-3 py-2 text-center">Commercial Cost (%)</th>
                          <th className="border-r border-slate-300 px-3 py-2 text-center">Finance Cost (%)</th>
                          <th className="border-r border-slate-300 px-3 py-2 text-center">Buying Commission (%)</th>
                          <th className="border-r border-slate-300 px-3 py-2 text-center">Sample Fabric Qty</th>
                          <th className="px-3 py-2 text-center">Sample Fabric Rate</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        <tr>
                          <td className="border-r border-slate-200 px-3 py-2 text-center font-bold text-slate-400">1</td>
                          <td className="border-r border-slate-200 px-2 py-1.5 text-center">
                            <input
                              type="number"
                              step="0.0001"
                              value={commercialCostPct}
                              onChange={(e) => setCommercialCostPct(Number(e.target.value))}
                              className="w-full max-w-[140px] mx-auto h-7 px-2 border border-slate-200 rounded-sm text-center text-xs focus:outline-none focus:border-[#1e88e5]"
                            />
                          </td>
                          <td className="border-r border-slate-200 px-2 py-1.5 text-center">
                            <input
                              type="number"
                              step="0.0001"
                              value={financeCostPct}
                              onChange={(e) => setFinanceCostPct(Number(e.target.value))}
                              className="w-full max-w-[140px] mx-auto h-7 px-2 border border-slate-200 rounded-sm text-center text-xs focus:outline-none focus:border-[#1e88e5]"
                            />
                          </td>
                          <td className="border-r border-slate-200 px-2 py-1.5 text-center">
                            <input
                              type="number"
                              step="0.0001"
                              value={buyingCommissionPct}
                              onChange={(e) => setBuyingCommissionPct(Number(e.target.value))}
                              className="w-full max-w-[140px] mx-auto h-7 px-2 border border-slate-200 rounded-sm text-center text-xs focus:outline-none focus:border-[#1e88e5]"
                            />
                          </td>
                          <td className="border-r border-slate-200 px-2 py-1.5 text-center">
                            <input
                              type="number"
                              step="0.0001"
                              value={sampleFabricQty}
                              onChange={(e) => setSampleFabricQty(Number(e.target.value))}
                              className="w-full max-w-[140px] mx-auto h-7 px-2 border border-slate-200 rounded-sm text-center text-xs focus:outline-none focus:border-[#1e88e5]"
                            />
                          </td>
                          <td className="px-2 py-1.5 text-center">
                            <input
                              type="number"
                              step="0.0001"
                              value={sampleFabricRate}
                              onChange={(e) => setSampleFabricRate(Number(e.target.value))}
                              className="w-full max-w-[140px] mx-auto h-7 px-2 border border-slate-200 rounded-sm text-center text-xs focus:outline-none focus:border-[#1e88e5]"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 font-semibold text-center py-4 bg-slate-50 dark:bg-slate-900/35 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                    Check the box to define Additional Costing parameters inside the spreadsheet cells.
                  </p>
                )}
              </div>
            </div>

            {/* Summary Footer Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              {/* Left — Key Metrics */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-indigo-50 dark:bg-indigo-950/40 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-900 text-center min-w-[110px]">
                  <span className="text-[8px] font-extrabold uppercase tracking-widest text-indigo-400 block leading-none">Avg Quoted FOB</span>
                  <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5 block font-mono">$ {averageFOB.toFixed(2)}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-center min-w-[100px]">
                  <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-400 block leading-none">Total Qty</span>
                  <span className="text-base font-black text-slate-800 dark:text-slate-200 mt-0.5 block font-mono">{totalOrderQty.toLocaleString()}<span className="text-[10px] font-bold text-slate-400 ml-1">pcs</span></span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-center min-w-[90px]">
                  <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-400 block leading-none">Styles</span>
                  <span className="text-base font-black text-slate-800 dark:text-slate-200 mt-0.5 block">{addedStyles.length}</span>
                </div>
                {hasAdditionalCosting && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-900">
                    <span className="text-[8px] font-extrabold uppercase tracking-widest text-emerald-500 block leading-none">Commission Total</span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block font-mono">$ {totalCommissionAmt.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Right — Actions */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className="h-9 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleSaveSheet}
                  className="h-9 px-7 bg-[#f08060] hover:bg-[#e07050] active:scale-95 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Save className="size-3.5" /> Save Sheet
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </MerchandisingLayout>
  );
}
