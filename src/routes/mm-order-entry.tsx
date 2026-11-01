import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect, useMemo, useRef, Fragment } from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import {
  MMRepository,
  MMMainOrder,
  MMColorQty,
  MMSizeQty,
  MMPOQty,
  MMLotQty,
  MMCountryQty,
  MMDeliveryLotRow,
  MMPODetailRow,
  MMPoBreakdownHeader,
  MMPoColorBreakdown,
  MMPoSizeRow,
  MMPreCosting,
  MMProcessTemplate,
  DEFAULT_PROCESS_TEMPLATES,
  MM_BUYERS_MASTER,
  MMBuyerMaster,
  MM_GMT_ITEMS_MASTER,
  MM_DEST_COUNTRIES_MASTER,
  MM_MERCHANTS_MASTER,
  MMMerchantMaster,
  MMSCLCMaster,
  MM_SC_LC_MASTER,
  MMFabricEstimationRecord,
  MMFabricEstimationRow,
  MMFabricColorMapping,
  MMFabricMasterItem,
  MMSupplierMasterItem,
  INITIAL_MM_FABRIC_MASTER,
  INITIAL_MM_SUPPLIERS_MASTER,
} from "../lib/marketing-merchandising-data";
import {
  ShoppingCart,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Edit,
  Save,
  Check,
  X,
  Layers,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Scissors,
  ShieldAlert,
  Copy,
  Trash2,
  Printer,
  Download,
  Eye,
  FileText,
  Package,
  Sliders,
  Calendar,
  DollarSign,
  Globe,
  Building2,
  Sparkles,
  RefreshCw,
  FileSpreadsheet,
  Paperclip,
  Palette,
  Info,
  Calculator,
  ChevronDown,
  User,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/mm-order-entry")({
  head: () => ({
    meta: [
      { title: "New Confirm Order — Marketing & Merchandising | CriptonHRIS" },
      {
        name: "description",
        content:
          "Enterprise New Confirm Order form with Pre-Costing integration, searchable master lookups, process templates, and PO-wise quantity breakdown.",
      },
    ],
  }),
  component: MMOrderEntryPage,
});

// Master Available Garment Colors
const AVAILABLE_GARMENT_COLORS = [
  "Black",
  "Melange Grey",
  "Olive Green",
  "Navy Blue",
  "Khaki Tan",
  "Red",
  "White",
  "Charcoal",
  "Sun Yellow",
  "Sky Blue",
  "Royal Blue",
  "Burgundy",
  "Heather Grey",
  "Forest Green",
  "Dusty Rose",
];

// Preset Standard Size Sets for Buyer Dept
const BUYER_DEPT_SIZE_SETS: Record<string, string[]> = {
  "UK Tailored Ladies (8S, 8R, 8L, 10S, 10R, 10L, 12S, 12R, 12L, 14S)": [
    "8S",
    "8R",
    "8L",
    "10S",
    "10R",
    "10L",
    "12S",
    "12R",
    "12L",
    "14S",
  ],
  "Standard Adult (S, M, L)": ["S", "M", "L"],
  "Extended Adult (XS, S, M, L, XL, XXL)": ["XS", "S", "M", "L", "XL", "XXL"],
  "Denim Waist (28, 30, 32, 34, 36, 38)": ["28", "30", "32", "34", "36", "38"],
  "Kids (2Y, 4Y, 6Y, 8Y, 10Y)": ["2Y", "4Y", "6Y", "8Y", "10Y"],
  "Baby & Infant (0-3M, 3-6M, 6-9M, 9-12M)": ["0-3M", "3-6M", "6-9M", "9-12M"],
};

// Enterprise Copy Templates
const ENTERPRISE_TEMPLATES = [
  {
    name: "Basic Crew T-Shirt (Knit)",
    gmtItem: "Henley T-Shirt",
    style: "HM-KT-8841",
    processName: "Knit-Dye-Sew-Wash",
    packType: "Single Poly Pack",
    place: "Front Chest / Garment Body",
    payTerm: "LC at Sight",
    cm: 1.25,
    pcs: 1,
    extraCuttingPct: 3.0,
    smv: 14.5,
    unitPrice: 4.85,
    destCountry: "Germany",
    delMode: "Sea",
    destPort: "Hamburg Port",
    note: "100% Combed Cotton Single Jersey 160 GSM. Strict color fastness required.",
    instructionDetail: "Needle detector clearance certificate required prior to export packing.",
    fabricReq: "Single Jersey 100% Combed Cotton 160 GSM (7,344 Kgs) — Approved Ha-Meem Mills",
    accReq: "4-hole chalk buttons (93,600 pcs), Woven main label & satin care label",
  },
  {
    name: "Denim Chino Trouser (Woven)",
    gmtItem: "Chino Trouser",
    style: "ZR-WV-4019",
    processName: "Cut-Sew-Wash-Finish",
    packType: "Hanger Pack",
    place: "Waistband & Back Pocket",
    payTerm: "TT 30 Days",
    cm: 2.2,
    pcs: 1,
    extraCuttingPct: 3.0,
    smv: 18.2,
    unitPrice: 8.75,
    destCountry: "Spain",
    delMode: "Sea",
    destPort: "Valencia Port",
    note: "Cotton Stretch Twill 98% Cotton 2% Spandex 240 GSM. Vintage wash appearance.",
    instructionDetail: "Zara nominated metal shank button and YKK antique brass zipper mandatory.",
    fabricReq: "Cotton Stretch Twill 240 GSM (13,056 Yds) — Square Textiles",
    accReq: "YKK Antique Brass #4 Zipper (32,640 Pcs), Genuine Leather Back Patch (32,640 Pcs)",
  },
  {
    name: "Fleece Zip Hoodie (Knit)",
    gmtItem: "Fleece Hoodie",
    style: "CA-KT-9021",
    processName: "Knit-Brushed-Sew-Finish",
    packType: "Ratio Pack 1:2:2:1",
    place: "Chest & Kangaroo Pocket",
    payTerm: "Deferred LC 60 Days",
    cm: 2.8,
    pcs: 1,
    extraCuttingPct: 3.5,
    smv: 22.0,
    unitPrice: 11.5,
    destCountry: "United States",
    delMode: "Sea",
    destPort: "New York Port",
    note: "CVC 3-End Fleece 280 GSM. Brushed inside for ultra-soft hand feel.",
    instructionDetail: "Pre-shrink fabric before cutting. Hood drawstring must meet safety standards.",
    fabricReq: "CVC 3-End Fleece 280 GSM (18,500 Kgs) — Pakiza Knit Composite Plant",
    accReq: "Heavy duty plastic zipper #5, Flat braided cotton drawstring, Eyelets",
  },
];

// ────────────────────────────────────────────────────────────────────────────
// Searchable Filter Dropdown Component for Register
// ────────────────────────────────────────────────────────────────────────────
interface SearchableDropdownFilterProps {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  placeholder?: string;
  icon?: React.ElementType;
}

function SearchableDropdownFilter({
  label,
  value,
  options,
  onChange,
  placeholder,
  icon: Icon,
}: SearchableDropdownFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase();
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, searchQuery]);

  return (
    <div className="relative flex-1 min-w-[200px]" ref={dropdownRef}>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
          {Icon && <Icon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
          <span>{label}</span>
        </label>
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="text-[10px] text-rose-500 hover:text-rose-700 font-semibold cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearchQuery("");
        }}
        className={`w-full px-3 py-2 text-xs rounded-xl border flex items-center justify-between transition-all bg-white dark:bg-slate-800 text-left cursor-pointer ${
          value
            ? "border-teal-500 ring-1 ring-teal-500 text-slate-900 dark:text-white font-semibold"
            : "border-slate-300 dark:border-slate-700 text-slate-500 hover:border-slate-400"
        }`}
      >
        <span className="truncate pr-2">{value || placeholder || `All ${label}s`}</span>
        <div className="flex items-center gap-1 shrink-0 text-slate-400">
          {value ? (
            <Check className="w-3.5 h-3.5 text-teal-600" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder={`Search ${label}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto p-1 divide-y divide-slate-100/50 dark:divide-slate-800/50">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                !value
                  ? "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span>All {label}s</span>
              {!value && <Check className="w-3.5 h-3.5 text-teal-600" />}
            </button>
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400">
                No matching {label.toLowerCase()} found
              </div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                    value === opt
                      ? "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-bold"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="truncate pr-2">{opt}</span>
                  {value === opt && <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MMOrderEntryPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<MMMainOrder[]>([]);
  const [preCostings, setPreCostings] = useState<MMPreCosting[]>(() => MMRepository.getPreCostings());
  const [policy, setPolicy] = useState(MMRepository.getPolicy());
  const [activeTab, setActiveTab] = useState<"register" | "entry" | "fabric-estimation">("register");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  // Searchable Filters for Register
  const [filterBuyer, setFilterBuyer] = useState<string>("");
  const [filterStyle, setFilterStyle] = useState<string>("");
  const [filterJobId, setFilterJobId] = useState<string>("");
  const [filterMerchant, setFilterMerchant] = useState<string>("");
  const [registerPage, setRegisterPage] = useState<number>(1);
  const registerPageSize = 10;

  // Secondary Modals & Dialogs (Section 13 Actions)
  const [showReportModal, setShowReportModal] = useState(false);
  const [showViewOrderModal, setShowViewOrderModal] = useState(false);
  const [showAllDataModal, setShowAllDataModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showSizeListModal, setShowSizeListModal] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [showOrderColorModal, setShowOrderColorModal] = useState(false);
  const [showFabricReqModal, setShowFabricReqModal] = useState(false);
  const [showAccReqModal, setShowAccReqModal] = useState(false);
  const [selectedReportOrder, setSelectedReportOrder] = useState<MMMainOrder | null>(null);

  // ==========================================================================
  // FABRIC ESTIMATION STATE (PRIDESYS SYNERGY ERP ARCHITECTURE)
  // ==========================================================================
  const [feEstimationId, setFeEstimationId] = useState<string>("");
  const [feFindQtn, setFeFindQtn] = useState<string>("");
  const [feFindBudget, setFeFindBudget] = useState<string>("");
  const [feFindOurRef, setFeFindOurRef] = useState<string>("");
  const [feOrderDate, setFeOrderDate] = useState<string>("");
  const [feOurRef, setFeOurRef] = useState<string>("");
  const [feBuyerRef, setFeBuyerRef] = useState<string>("");
  const [feBuyer, setFeBuyer] = useState<string>("");
  const [feItemName, setFeItemName] = useState<string>("");
  const [fePackingType, setFePackingType] = useState<string>("");
  const [feLcBasis, setFeLcBasis] = useState<string>("FOB");
  const [feQuantity, setFeQuantity] = useState<number>(0);
  const [feRate, setFeRate] = useState<number>(0);
  const [feUnit, setFeUnit] = useState<string>("Pcs");
  const [fePlace, setFePlace] = useState<string>("Body & Trims");
  const [feNote, setFeNote] = useState<string>("");
  const [feBookingNo, setFeBookingNo] = useState<string>("");
  const [fePiNo, setFePiNo] = useState<string>("");
  const [feBblcNo, setFeBblcNo] = useState<string>("");
  const [feSourceType, setFeSourceType] = useState<"job" | "pre-costing" | "manual">("job");

  const [feFabricRows, setFeFabricRows] = useState<MMFabricEstimationRow[]>([]);
  const [feSelectedRowIndex, setFeSelectedRowIndex] = useState<number>(0);

  // Fabric Color Entry Modal State
  const [showColorEntryModal, setShowColorEntryModal] = useState<boolean>(false);
  const [colorEntryRowIndex, setColorEntryRowIndex] = useState<number | null>(null);
  const [modalColorMappings, setModalColorMappings] = useState<MMFabricColorMapping[]>([]);
  const [modalColorType, setModalColorType] = useState<"DTM" | "Contrast" | "Single Color">("DTM");
  const [modalSingleColor, setModalSingleColor] = useState<string>("");

  // Auxiliary Fabric Estimation Modals & Search States
  const [showFeListModal, setShowFeListModal] = useState<boolean>(false);
  const [showReqSheetModal, setShowReqSheetModal] = useState<boolean>(false);
  const [showReqSummaryModal, setShowReqSummaryModal] = useState<boolean>(false);
  const [showFindQtnModal, setShowFindQtnModal] = useState<boolean>(false);
  const [showFindBudgetModal, setShowFindBudgetModal] = useState<boolean>(false);
  const [showFindOurRefModal, setShowFindOurRefModal] = useState<boolean>(false);
  const [showSizeConsModal, setShowSizeConsModal] = useState<boolean>(false);

  // Searchable Master Modals
  const [showFabricMasterModal, setShowFabricMasterModal] = useState<boolean>(false);
  const [fabricMasterRowIndex, setFabricMasterRowIndex] = useState<number | null>(null);
  const [fabricMasterSearchQuery, setFabricMasterSearchQuery] = useState<string>("");

  const [showSupplierModal, setShowSupplierModal] = useState<boolean>(false);
  const [supplierRowIndex, setSupplierRowIndex] = useState<number | null>(null);
  const [supplierSearchQuery, setSupplierSearchQuery] = useState<string>("");

  const [jobIdSearchQuery, setJobIdSearchQuery] = useState<string>("");
  const [preCostingSearchQuery, setPreCostingSearchQuery] = useState<string>("");
  const [confirmOverwriteModal, setConfirmOverwriteModal] = useState<{ open: boolean; message: string; onConfirm: () => void }>({ open: false, message: "", onConfirm: () => {} });

  // Searchable Pre Costing Item Selection Modal State (Section 4.3)
  const [showPreCostItemModal, setShowPreCostItemModal] = useState<boolean>(false);
  const [preCostItemRowIndex, setPreCostItemRowIndex] = useState<number | null>(null);
  const [preCostItemSearchQuery, setPreCostItemSearchQuery] = useState<string>("");

  // Fabric Row Booking Modal State (Section 4.5)
  const [showRowBookingModal, setShowRowBookingModal] = useState<boolean>(false);
  const [rowBookingContext, setRowBookingContext] = useState<{ row: MMFabricEstimationRow; rowIndex: number } | null>(null);

  // FOB Authorized Edit Modal State
  const [fobEditOrder, setFobEditOrder] = useState<MMMainOrder | null>(null);
  const [newFobValue, setNewFobValue] = useState<number>(0);
  const [fobChangeReason, setFobChangeReason] = useState("");

  // ==========================================================================
  // SECTION 1 to 7: MAIN ORDER ENTRY FORM STATE (REVISED SPECIFICATION)
  // ==========================================================================
  // Section 1: Order Type and Reference Information
  const [entryMode, setEntryMode] = useState<"New Order" | "Pre Costing Ref.">("New Order");
  const [formPreCostId, setFormPreCostId] = useState<string>("");
  const [formOrderType, setFormOrderType] = useState<string>("Regular");
  const [formOrderStatus, setFormOrderStatus] = useState<string>("Active"); // Strictly: Active | Inactive | Closed
  const [formJobNo, setFormJobNo] = useState<string>("JOB-2026-0001");
  const [formOurRef, setFormOurRef] = useState<string>("JOB-2026-0001");
  const [formOrderSl, setFormOrderSl] = useState<string>("SL-0041");
  const [formCopyFromOurRef, setFormCopyFromOurRef] = useState<string>("");

  // Helper to dynamically obtain merchant from current logged-in user without hardcoding
  const getLoggedInUserMerchant = (): string => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("cripton_current_user");
        if (stored) {
          const user = JSON.parse(stored);
          if (user && user.name) {
            const matched = MM_MERCHANTS_MASTER.find(
              (m) => m.name.toLowerCase() === user.name.toLowerCase()
            );
            if (matched) {
              return `${matched.name} (${matched.designation})`;
            }
            const role = user.role || user.department || "Merchant";
            return `${user.name} (${role})`;
          }
        }
      } catch (e) {
        // ignore
      }
    }
    return `${MM_MERCHANTS_MASTER[0].name} (${MM_MERCHANTS_MASTER[0].designation})`;
  };

  // Section 2: Company and Buyer Information
  const [formBeneficiaryCompany, setFormBeneficiaryCompany] = useState<string>("Pakiza Knit Composite Ltd");
  const [formBuyer, setFormBuyer] = useState<string>("H&M Hennes & Mauritz");
  const [formBuyerDept, setFormBuyerDept] = useState<string>("Ladies Casual & Tops");
  const [formLocalAgent, setFormLocalAgent] = useState<string>("Li & Fung (Bangladesh)");
  const [formMerchant, setFormMerchant] = useState<string>(getLoggedInUserMerchant);
  const [formMerchan, setFormMerchan] = useState<string>(getLoggedInUserMerchant);
  const [showMerchantModal, setShowMerchantModal] = useState(false);
  const [merchantSearch, setMerchantSearch] = useState("");
  const [formSeason, setFormSeason] = useState<string>("Autumn / Winter 2026");
  const [formAcHolder, setFormAcHolder] = useState<string>("Rashidul Islam (Head of Merchandising)");
  const [formDeptCode, setFormDeptCode] = useState<string>("DEPT-88");
  const [formCompany, setFormCompany] = useState<string>("Pakiza Knit Composite Ltd");

  // Section 3: Style and Garment Information
  const [formStyle, setFormStyle] = useState<string>("HM-KT-8841");
  const [formGmtItem, setFormGmtItem] = useState<string>("Henley T-Shirt");
  const [formPlace, setFormPlace] = useState<"Top" | "Bottom" | "Top&Bottom">("Top");
  const [formPackType, setFormPackType] = useState<string>("Single Poly Pack");
  const [processList, setProcessList] = useState<{ sl: number; processName: string }[]>([
    { sl: 1, processName: "Knitting" },
    { sl: 2, processName: "Dyeing" },
    { sl: 3, processName: "Cutting" },
    { sl: 4, processName: "Sewing" },
    { sl: 5, processName: "Finishing" },
    { sl: 6, processName: "Packing" },
  ]);
  const [newProcessInput, setNewProcessInput] = useState<string>("");

  // Process Templates Management
  const [availableProcessTemplates, setAvailableProcessTemplates] = useState<MMProcessTemplate[]>(() => {
    if (typeof window !== "undefined") {
      return MMRepository.getProcessTemplates();
    }
    return DEFAULT_PROCESS_TEMPLATES;
  });
  const [showNewProcessModal, setShowNewProcessModal] = useState(false);
  const [modalTemplateName, setModalTemplateName] = useState("");
  const [modalProcessRows, setModalProcessRows] = useState<{ sl: number; processName: string }[]>([
    { sl: 1, processName: "" },
    { sl: 2, processName: "" },
  ]);

  // Section 4: Commercial Information
  const [formUnitPrice, setFormUnitPrice] = useState<number>(4.85);
  const [formPriceType, setFormPriceType] = useState<string>("FOB");
  const [formCurrency, setFormCurrency] = useState<string>("USD");
  const [formPayTerm, setFormPayTerm] = useState<string>("LC at Sight");
  const [formCm, setFormCm] = useState<number>(1.25);
  const [formCmUnit, setFormCmUnit] = useState<"PCS" | "DZ">("PCS");
  const [formPcs, setFormPcs] = useState<number>(1);

  // Currency symbol helper
  const currencySymbol = useMemo(() => {
    switch (formCurrency) {
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      case "BDT":
        return "৳";
      case "USD":
      default:
        return "$";
    }
  }, [formCurrency]);

  // Searchable Lookups & Selection Modals State
  const [showPreCostingModal, setShowPreCostingModal] = useState(false);
  const [preCostingSearch, setPreCostingSearch] = useState("");
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [buyerSearch, setBuyerSearch] = useState("");
  const [showBuyerDeptModal, setShowBuyerDeptModal] = useState(false);
  const [deptSearch, setDeptSearch] = useState("");
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [styleSearch, setStyleSearch] = useState("");
  const [showGmtItemModal, setShowGmtItemModal] = useState(false);
  const [gmtItemSearch, setGmtItemSearch] = useState("");
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [countryModalTargetPoIndex, setCountryModalTargetPoIndex] = useState<number | null>(null);
  const [showSaveProcessTemplateModal, setShowSaveProcessTemplateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");

  // Section 5: Order Quantity and Delivery Information
  const [formFirstDelDt, setFormFirstDelDt] = useState<string>("2026-12-05");
  const [formConfirmDt, setFormConfirmDt] = useState<string>("2026-09-20");
  const [formExtraCuttingPct, setFormExtraCuttingPct] = useState<number>(3.0);
  const [formSmv, setFormSmv] = useState<number>(14.5);
  const [formOrderQty, setFormOrderQty] = useState<number>(45000);
  const [formDelDt, setFormDelDt] = useState<string>("2026-12-15");
  const [formPcd, setFormPcd] = useState<string>("2026-11-10");
  const [formDestCountry, setFormDestCountry] = useState<string>("Germany");
  const [formDelMode, setFormDelMode] = useState<string>("Sea");
  const [formDelPort, setFormDelPort] = useState<string>("Hamburg Port");
  const [formDeliveryPlace, setFormDeliveryPlace] = useState<string>("Unit 2 Garments Factory");

  // Section 6: Fabric and Accessories Requirement Details
  const [formFabricReq, setFormFabricReq] = useState<string>(
    "Single Jersey 100% Combed Cotton 160 GSM (7,344 Kgs) — Approved Ha-Meem Mills Lot #H-992"
  );
  const [formAccReq, setFormAccReq] = useState<string>(
    "Engraved 4-hole chalk buttons (93,600 pcs), Woven main label & satin care label (46,800 sets)"
  );

  // Section 7: Instructions and Notes
  const [formNote, setFormNote] = useState<string>(
    "Approved gold seal sample dispatched. Strictly follow pre-costing supplier nominees."
  );
  const [formInstructionDetail, setFormInstructionDetail] = useState<string>(
    "Ensure strict color fastness to washing (Grade 4 minimum). Needle detector certificate required for export packing."
  );

  // ==========================================================================
  // SECTION 8: DELIVERY LOT DETAILS (TABLE)
  // ==========================================================================
  const [deliveryLots, setDeliveryLots] = useState<MMDeliveryLotRow[]>([
    { id: "lot-1", lotNumber: "LOT-01", quantity: 25000, deliveryDate: "2026-12-05" },
    { id: "lot-2", lotNumber: "LOT-02", quantity: 20000, deliveryDate: "2026-12-15" },
  ]);

  // ==========================================================================
  // SECTION 9: PO / ORDER DETAILS (TABLE)
  // ==========================================================================
  const [poDetails, setPoDetails] = useState<MMPODetailRow[]>([
    {
      id: "po-1",
      no: 1,
      projection: "Confirmed",
      po: "Main",
      qty: 25000,
      lot: "LOT-01",
      poNumber: "PO-HM-99881-A",
      poDesc: "EU Retail Store Replenishment",
      rate: 4.85,
      value: 121250,
      delDate: "2026-12-10",
      pcd: "2026-11-10",
      destCountry: "Germany",
      delMode: "Sea",
      destPort: "Hamburg Port",
      v: "V1",
      s: "FOB",
      size: "S-L",
      scLcNo: "SC-HM-2026-081",
      breakdown: {
        poId: "po-1",
        poNumber: "PO-HM-99881-A",
        poQty: 25000,
        lotNo: "LOT-01",
        ratioWiseQtyChange: false,
        sizeFromBuyerDept: "Standard Adult (S, M, L)",
        countryBreakdown: "Germany",
        note: "Lot 1 direct shipment to Hamburg Seaport",
        company: "Pakiza Knit Composite Ltd",
        lineName: "Line 01 - Sewing",
        startDate: "2026-10-01",
        finishDate: "2026-11-15",
        planQty: 25000,
        colorBreakdowns: [
          {
            id: "cb-1",
            color: "Black",
            rate: 4.85,
            assrtStatus: "Solid",
            quantity: 15000,
            sizeRows: [
              { id: "sr-1", size: "S", ratio: 1, quantity: 5000, rate: 4.85, total: 24250 },
              { id: "sr-2", size: "M", ratio: 2, quantity: 6000, rate: 4.85, total: 29100 },
              { id: "sr-3", size: "L", ratio: 1, quantity: 4000, rate: 4.85, total: 19400 },
            ],
          },
          {
            id: "cb-2",
            color: "Melange Grey",
            rate: 4.85,
            assrtStatus: "Solid",
            quantity: 10000,
            sizeRows: [
              { id: "sr-4", size: "S", ratio: 1, quantity: 3000, rate: 4.85, total: 14550 },
              { id: "sr-5", size: "M", ratio: 2, quantity: 4500, rate: 4.85, total: 21825 },
              { id: "sr-6", size: "L", ratio: 1, quantity: 2500, rate: 4.85, total: 12125 },
            ],
          },
        ],
      },
    },
    {
      id: "po-2",
      no: 2,
      projection: "Confirmed",
      po: "Sub",
      qty: 20000,
      lot: "LOT-02",
      poNumber: "PO-HM-99881-B",
      poDesc: "Nordic Distribution Hub",
      rate: 4.85,
      value: 97000,
      delDate: "2026-12-15",
      pcd: "2026-11-20",
      destCountry: "Sweden",
      delMode: "Sea",
      destPort: "Gothenburg Port",
      v: "V1",
      s: "FOB",
      size: "S-L",
      scLcNo: "LC-HM-2026-902",
      breakdown: {
        poId: "po-2",
        poNumber: "PO-HM-99881-B",
        poQty: 20000,
        lotNo: "LOT-02",
        ratioWiseQtyChange: false,
        sizeFromBuyerDept: "Standard Adult (S, M, L)",
        countryBreakdown: "Sweden",
        note: "Lot 2 direct shipment to Gothenburg",
        company: "Pakiza Knit Composite Ltd",
        lineName: "Line 02 - Sewing",
        startDate: "2026-10-15",
        finishDate: "2026-11-25",
        planQty: 20000,
        colorBreakdowns: [
          {
            id: "cb-3",
            color: "Melange Grey",
            rate: 4.85,
            assrtStatus: "Solid",
            quantity: 5000,
            sizeRows: [
              { id: "sr-7", size: "S", ratio: 1, quantity: 1500, rate: 4.85, total: 7275 },
              { id: "sr-8", size: "M", ratio: 2, quantity: 2500, rate: 4.85, total: 12125 },
              { id: "sr-9", size: "L", ratio: 1, quantity: 1000, rate: 4.85, total: 4850 },
            ],
          },
          {
            id: "cb-4",
            color: "Olive Green",
            rate: 4.85,
            assrtStatus: "Solid",
            quantity: 15000,
            sizeRows: [
              { id: "sr-10", size: "S", ratio: 1, quantity: 5500, rate: 4.85, total: 26675 },
              { id: "sr-11", size: "M", ratio: 2, quantity: 6000, rate: 4.85, total: 29100 },
              { id: "sr-12", size: "L", ratio: 1, quantity: 3500, rate: 4.85, total: 16975 },
            ],
          },
        ],
      },
    },
  ]);

  // ==========================================================================
  // SECTION 10 to 12: PO-WISE SIZE & COLOR BREAKDOWN MODAL STATE
  // ==========================================================================
  const [activePoForBreakdown, setActivePoForBreakdown] = useState<MMPODetailRow | null>(null);
  const [modalBreakdownData, setModalBreakdownData] = useState<MMPoBreakdownHeader | null>(null);
  const [isModalDirty, setIsModalDirty] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [selectedBreakdownColorIds, setSelectedBreakdownColorIds] = useState<string[]>([]);

  // Ratio Wise Qty Change dialog state (Section 5)
  const [showRatioModal, setShowRatioModal] = useState(false);
  const [ratioTargetColorIndex, setRatioTargetColorIndex] = useState(0);
  const [ratioTargetQty, setRatioTargetQty] = useState(0);
  const [ratioWorkingValues, setRatioWorkingValues] = useState<Record<string, number>>({});

  // Dynamic Custom Size Management (Section 5)
  const [showAddSizeModal, setShowAddSizeModal] = useState(false);
  const [newCustomSizeInput, setNewCustomSizeInput] = useState("");

  // S.C / LC Selection Modal state (Section 8)
  const [showScLcModal, setShowScLcModal] = useState(false);
  const [scLcTargetPoIndex, setScLcTargetPoIndex] = useState<number | null>(null);
  const [scLcSearchTerm, setScLcSearchTerm] = useState("");
  const [scLcTypeFilter, setScLcTypeFilter] = useState<"All" | "Sales Contract" | "LC">("All");
  const [scLcBuyerFilterOnly, setScLcBuyerFilterOnly] = useState(true);
  const [scLcRecords, setScLcRecords] = useState<MMSCLCMaster[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("mm_sclc_master_records_v1");
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return MM_SC_LC_MASTER;
  });

  const handleEditOrder = (o: MMMainOrder) => {
    setEditingOrderId(o.id);
    setEntryMode(o.entryMode || "New Order");
    setFormPreCostId(o.preCostId || "");
    const job = o.jobNo || o.ourRef || o.merchandisingRef || `JOB-2026-${o.orderNo.replace(/\D/g, "")}`;
    setFormJobNo(job);
    setFormOurRef(job);
    setFormOrderType(o.orderType || "Regular");
    setFormOrderStatus(o.orderStatus === "Draft" ? "Inactive" : o.orderStatus === "Closed" ? "Closed" : "Active");
    setFormBeneficiaryCompany(o.beneficiaryCompany || o.companyName || "Pakiza Knit Composite Ltd");
    setFormBuyer(o.buyerName);
    setFormBuyerDept(o.buyerDepartment);
    setFormLocalAgent(o.localAgent || "Li & Fung (Bangladesh)");
    setFormMerchant(o.merchan || "Rashidul Islam (Head of Merchandising)");
    setFormMerchan(o.merchan || "Rashidul Islam (Head of Merchandising)");
    setFormSeason(o.season);
    const buyerMatch = MM_BUYERS_MASTER.find((b) => b.name.toLowerCase() === o.buyerName.toLowerCase());
    setFormAcHolder(buyerMatch?.accountHolder || o.acHolder || "Rashidul Islam (Head of Merchandising)");
    setFormDeptCode(o.deptCode || "DEPT-88");
    setFormCompany(o.companyName);
    setFormStyle(o.styleNo);
    setFormGmtItem(o.garmentItem);
    setFormPlace((o.place as any) || "Top");
    setFormPackType(o.packType || "Single Poly Pack");
    if (o.processList && o.processList.length > 0) {
      setProcessList(o.processList);
    } else if (o.processName) {
      setProcessList(o.processName.split("-").map((p, i) => ({ sl: i + 1, processName: p })));
    }
    setFormUnitPrice(o.fobUnitPrice);
    setFormPriceType(o.priceType || "FOB");
    setFormCurrency(o.currency || "USD");
    setFormPayTerm(o.payTerm || "LC at Sight");
    setFormCm(o.cm || 1.25);
    setFormCmUnit(o.cmUnit || "PCS");
    setFormPcs(o.pcs || 1);
    setFormFirstDelDt(o.firstDelDate || o.orderDate || "2026-12-05");
    setFormConfirmDt(o.confirmDate || o.buyerPoDate || "2026-09-20");
    setFormExtraCuttingPct(o.extraCuttingPct || 3.0);
    setFormSmv(o.smv || 14.5);
    setFormOrderQty(o.orderQuantity);
    setFormDelDt(o.delDate || o.shipmentDate || "2026-12-15");
    setFormPcd(o.pcd || "2026-11-10");
    setFormDestCountry(o.destinationCountry);
    setFormDelMode(o.deliveryMode);
    setFormDelPort(o.destinationPort);
    setFormNote(o.notes);
    setFormInstructionDetail(o.instructionDetail || "");
    setFormFabricReq(o.fabricRequirementDetails || "");
    setFormAccReq(o.accessoriesRequirementDetails || "");

    if (o.deliveryLots && o.deliveryLots.length > 0) {
      setDeliveryLots(o.deliveryLots);
    } else {
      setDeliveryLots([]);
    }
    if (o.poDetails && o.poDetails.length > 0) {
      setPoDetails(o.poDetails);
    } else {
      setPoDetails([]);
    }
    setActiveTab("entry");
    MMRepository.saveOrderEntryUiState({ activeTab: "entry", editingOrderId: o.id });
  };

  const handleStartNewOrder = () => {
    setEditingOrderId(null);
    const newJob = MMRepository.generateJobNo();
    const today = new Date().toISOString().slice(0, 10);
    setEntryMode("New Order");
    setFormPreCostId("");
    setFormOrderType("Regular");
    setFormOrderStatus("Active");
    setFormJobNo(newJob);
    setFormOurRef(newJob);
    setFormOrderSl("SL-0041");
    setFormCopyFromOurRef("");
    setFormBeneficiaryCompany("Pakiza Knit Composite Ltd");
    setFormBuyer("H&M Hennes & Mauritz");
    setFormBuyerDept("Ladies Casual & Tops");
    setFormLocalAgent("Li & Fung (Bangladesh)");
    setFormMerchant(getLoggedInUserMerchant());
    setFormMerchan(getLoggedInUserMerchant());
    setFormSeason("Autumn / Winter 2026");
    setFormAcHolder("Rashidul Islam (Head of Merchandising)");
    setFormDeptCode("DEPT-88");
    setFormCompany("Pakiza Knit Composite Ltd");
    setFormStyle("");
    setFormGmtItem("Henley T-Shirt");
    setFormPlace("Top");
    setFormPackType("Single Poly Pack");
    setProcessList([
      { sl: 1, processName: "Knitting" },
      { sl: 2, processName: "Dyeing" },
      { sl: 3, processName: "Cutting" },
      { sl: 4, processName: "Sewing" },
      { sl: 5, processName: "Finishing" },
      { sl: 6, processName: "Packing" },
    ]);
    setFormUnitPrice(4.85);
    setFormPriceType("FOB");
    setFormCurrency("USD");
    setFormPayTerm("LC at Sight");
    setFormCm(1.25);
    setFormCmUnit("PCS");
    setFormPcs(1);
    setFormFirstDelDt(today);
    setFormConfirmDt(today);
    setFormExtraCuttingPct(3.0);
    setFormSmv(14.5);
    setFormOrderQty(0);
    setFormDelDt(today);
    setFormPcd(today);
    setFormDestCountry("Germany");
    setFormDelMode("Sea");
    setFormDelPort("Hamburg Port");
    setFormDeliveryPlace("Unit 2 Garments Factory");
    setFormFabricReq("");
    setFormAccReq("");
    setFormNote("");
    setFormInstructionDetail("");
    setDeliveryLots([]);
    setPoDetails([]);
    setActiveTab("entry");
    MMRepository.saveOrderEntryDraft(null);
    MMRepository.saveOrderEntryUiState({ activeTab: "entry", editingOrderId: null });
  };

  const restoreDraft = (draft: any) => {
    if (!draft) return;
    if (draft.editingOrderId !== undefined) setEditingOrderId(draft.editingOrderId);
    if (draft.entryMode !== undefined) setEntryMode(draft.entryMode);
    if (draft.formPreCostId !== undefined) setFormPreCostId(draft.formPreCostId);
    if (draft.formOrderType !== undefined) setFormOrderType(draft.formOrderType);
    if (draft.formOrderStatus !== undefined) setFormOrderStatus(draft.formOrderStatus);
    if (draft.formJobNo !== undefined) setFormJobNo(draft.formJobNo);
    if (draft.formOurRef !== undefined) setFormOurRef(draft.formOurRef);
    if (draft.formOrderSl !== undefined) setFormOrderSl(draft.formOrderSl);
    if (draft.formCopyFromOurRef !== undefined) setFormCopyFromOurRef(draft.formCopyFromOurRef);
    if (draft.formBeneficiaryCompany !== undefined) setFormBeneficiaryCompany(draft.formBeneficiaryCompany);
    if (draft.formBuyer !== undefined) setFormBuyer(draft.formBuyer);
    if (draft.formBuyerDept !== undefined) setFormBuyerDept(draft.formBuyerDept);
    if (draft.formLocalAgent !== undefined) setFormLocalAgent(draft.formLocalAgent);
    if (draft.formMerchant !== undefined) setFormMerchant(draft.formMerchant);
    if (draft.formMerchan !== undefined) setFormMerchan(draft.formMerchan);
    if (draft.formSeason !== undefined) setFormSeason(draft.formSeason);
    if (draft.formAcHolder !== undefined) setFormAcHolder(draft.formAcHolder);
    if (draft.formDeptCode !== undefined) setFormDeptCode(draft.formDeptCode);
    if (draft.formCompany !== undefined) setFormCompany(draft.formCompany);
    if (draft.formStyle !== undefined) setFormStyle(draft.formStyle);
    if (draft.formGmtItem !== undefined) setFormGmtItem(draft.formGmtItem);
    if (draft.formPlace !== undefined) setFormPlace(draft.formPlace);
    if (draft.formPackType !== undefined) setFormPackType(draft.formPackType);
    if (draft.processList !== undefined) setProcessList(draft.processList);
    if (draft.formUnitPrice !== undefined) setFormUnitPrice(draft.formUnitPrice);
    if (draft.formPriceType !== undefined) setFormPriceType(draft.formPriceType);
    if (draft.formCurrency !== undefined) setFormCurrency(draft.formCurrency);
    if (draft.formPayTerm !== undefined) setFormPayTerm(draft.formPayTerm);
    if (draft.formCm !== undefined) setFormCm(draft.formCm);
    if (draft.formCmUnit !== undefined) setFormCmUnit(draft.formCmUnit);
    if (draft.formPcs !== undefined) setFormPcs(draft.formPcs);
    if (draft.formFirstDelDt !== undefined) setFormFirstDelDt(draft.formFirstDelDt);
    if (draft.formConfirmDt !== undefined) setFormConfirmDt(draft.formConfirmDt);
    if (draft.formExtraCuttingPct !== undefined) setFormExtraCuttingPct(draft.formExtraCuttingPct);
    if (draft.formSmv !== undefined) setFormSmv(draft.formSmv);
    if (draft.formOrderQty !== undefined) setFormOrderQty(draft.formOrderQty);
    if (draft.formDelDt !== undefined) setFormDelDt(draft.formDelDt);
    if (draft.formPcd !== undefined) setFormPcd(draft.formPcd);
    if (draft.formDestCountry !== undefined) setFormDestCountry(draft.formDestCountry);
    if (draft.formDelMode !== undefined) setFormDelMode(draft.formDelMode);
    if (draft.formDelPort !== undefined) setFormDelPort(draft.formDelPort);
    if (draft.formDeliveryPlace !== undefined) setFormDeliveryPlace(draft.formDeliveryPlace);
    if (draft.formFabricReq !== undefined) setFormFabricReq(draft.formFabricReq);
    if (draft.formAccReq !== undefined) setFormAccReq(draft.formAccReq);
    if (draft.formNote !== undefined) setFormNote(draft.formNote);
    if (draft.formInstructionDetail !== undefined) setFormInstructionDetail(draft.formInstructionDetail);
    if (draft.deliveryLots !== undefined) setDeliveryLots(draft.deliveryLots);
    if (draft.poDetails !== undefined) setPoDetails(draft.poDetails);
  };

  // Initial load & restore UI state / draft from Local Storage
  useEffect(() => {
    const loaded = MMRepository.getOrders();
    setOrders(loaded);
    setPreCostings(MMRepository.getPreCostings());
    setPolicy(MMRepository.getPolicy());

    // Restore UI state and in-progress form/editing state
    const savedUi = MMRepository.getOrderEntryUiState();
    if (savedUi) {
      if (savedUi.activeTab === "entry") {
        if (savedUi.editingOrderId) {
          const match = loaded.find((o) => o.id === savedUi.editingOrderId);
          if (match) {
            handleEditOrder(match);
            return;
          }
        }
        const draft = MMRepository.getOrderEntryDraft();
        if (draft) {
          restoreDraft(draft);
          setActiveTab("entry");
          return;
        }
      } else if (savedUi.activeTab === "fabric-estimation") {
        setActiveTab("fabric-estimation");
      } else {
        setActiveTab("register");
      }
    }
  }, []);

  // Auto-save form draft to localStorage whenever fields change in entry mode
  useEffect(() => {
    if (activeTab !== "entry") return;
    const draft = {
      editingOrderId,
      entryMode,
      formPreCostId,
      formOrderType,
      formOrderStatus,
      formJobNo,
      formOurRef,
      formOrderSl,
      formCopyFromOurRef,
      formBeneficiaryCompany,
      formBuyer,
      formBuyerDept,
      formLocalAgent,
      formMerchant,
      formMerchan,
      formSeason,
      formAcHolder,
      formDeptCode,
      formCompany,
      formStyle,
      formGmtItem,
      formPlace,
      formPackType,
      processList,
      formUnitPrice,
      formPriceType,
      formCurrency,
      formPayTerm,
      formCm,
      formCmUnit,
      formPcs,
      formFirstDelDt,
      formConfirmDt,
      formExtraCuttingPct,
      formSmv,
      formOrderQty,
      formDelDt,
      formPcd,
      formDestCountry,
      formDelMode,
      formDelPort,
      formDeliveryPlace,
      formFabricReq,
      formAccReq,
      formNote,
      formInstructionDetail,
      deliveryLots,
      poDetails,
    };
    MMRepository.saveOrderEntryDraft(draft);
    MMRepository.saveOrderEntryUiState({ activeTab: "entry", editingOrderId });
  }, [
    activeTab,
    editingOrderId,
    entryMode,
    formPreCostId,
    formOrderType,
    formOrderStatus,
    formJobNo,
    formOurRef,
    formOrderSl,
    formCopyFromOurRef,
    formBeneficiaryCompany,
    formBuyer,
    formBuyerDept,
    formLocalAgent,
    formMerchant,
    formMerchan,
    formSeason,
    formAcHolder,
    formDeptCode,
    formCompany,
    formStyle,
    formGmtItem,
    formPlace,
    formPackType,
    processList,
    formUnitPrice,
    formPriceType,
    formCurrency,
    formPayTerm,
    formCm,
    formCmUnit,
    formPcs,
    formFirstDelDt,
    formConfirmDt,
    formExtraCuttingPct,
    formSmv,
    formOrderQty,
    formDelDt,
    formPcd,
    formDestCountry,
    formDelMode,
    formDelPort,
    formDeliveryPlace,
    formFabricReq,
    formAccReq,
    formNote,
    formInstructionDetail,
    deliveryLots,
    poDetails,
  ]);

  // Helper to extract Job ID safely without combining other identifiers
  const getOrderJobId = (o: MMMainOrder): string => {
    if (o.jobNo && o.jobNo.trim()) return o.jobNo.trim();
    if (o.preCostId) {
      const pc = preCostings.find((p) => p.preCostId === o.preCostId);
      if (pc?.jobNo) return pc.jobNo.trim();
    }
    if (o.ourRef && o.ourRef.startsWith("JOB-")) return o.ourRef.trim();
    if (o.merchandisingRef && o.merchandisingRef.startsWith("JOB-")) return o.merchandisingRef.trim();
    const num = (o.orderNo || "").replace(/\D/g, "");
    return num ? `JOB-2026-${num.padStart(4, "0")}` : "JOB-2026-0001";
  };

  const getOrderMerchant = (o: MMMainOrder): string => {
    return (o.merchan || o.createdBy || "").trim();
  };

  // Dynamic filter options derived from actual order records
  const availableBuyers = useMemo(() => {
    const set = new Set<string>();
    orders.forEach((o) => {
      if (o.buyerName && o.buyerName.trim()) set.add(o.buyerName.trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [orders]);

  const availableStyles = useMemo(() => {
    const set = new Set<string>();
    orders.forEach((o) => {
      if (o.styleNo && o.styleNo.trim()) set.add(o.styleNo.trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [orders]);

  const availableJobIds = useMemo(() => {
    const set = new Set<string>();
    orders.forEach((o) => {
      const jId = getOrderJobId(o);
      if (jId && jId.trim()) set.add(jId.trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [orders, preCostings]);

  const availableMerchants = useMemo(() => {
    const set = new Set<string>();
    orders.forEach((o) => {
      const m = getOrderMerchant(o);
      if (m && m.trim()) set.add(m.trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [orders]);

  // Combined AND-based filtering across all selected criteria
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (filterBuyer && o.buyerName !== filterBuyer) return false;
      if (filterStyle && o.styleNo !== filterStyle) return false;
      if (filterJobId && getOrderJobId(o) !== filterJobId) return false;
      if (filterMerchant && getOrderMerchant(o) !== filterMerchant) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const jId = getOrderJobId(o).toLowerCase();
        const oNo = (o.orderNo || "").toLowerCase();
        const sNo = (o.styleNo || "").toLowerCase();
        const bNm = (o.buyerName || "").toLowerCase();
        const oRef = (o.ourRef || "").toLowerCase();
        const merch = getOrderMerchant(o).toLowerCase();
        if (
          !jId.includes(q) &&
          !oNo.includes(q) &&
          !sNo.includes(q) &&
          !bNm.includes(q) &&
          !oRef.includes(q) &&
          !merch.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [orders, filterBuyer, filterStyle, filterJobId, filterMerchant, searchTerm, preCostings]);

  // Reset page when filter criteria change
  useEffect(() => {
    setRegisterPage(1);
  }, [filterBuyer, filterStyle, filterJobId, filterMerchant, searchTerm]);

  const totalRegisterPages = Math.max(1, Math.ceil(filteredOrders.length / registerPageSize));
  const paginatedOrders = useMemo(() => {
    const start = (registerPage - 1) * registerPageSize;
    return filteredOrders.slice(start, start + registerPageSize);
  }, [filteredOrders, registerPage, registerPageSize]);

  const hasActiveFilters = Boolean(filterBuyer || filterStyle || filterJobId || filterMerchant || searchTerm);
  const activeFilterCount = [filterBuyer, filterStyle, filterJobId, filterMerchant].filter(Boolean).length;

  const handleResetFilters = () => {
    setFilterBuyer("");
    setFilterStyle("");
    setFilterJobId("");
    setFilterMerchant("");
    setSearchTerm("");
    setRegisterPage(1);
  };

  // Total sums
  const totalLotQty = useMemo(
    () => deliveryLots.reduce((acc, l) => acc + (Number(l.quantity) || 0), 0),
    [deliveryLots]
  );

  const totalPoQty = useMemo(
    () => poDetails.reduce((acc, p) => acc + (Number(p.qty) || 0), 0),
    [poDetails]
  );

  // Total Order Value automatically calculated from all associated PO records (Part A)
  const orderValue = useMemo(() => {
    return poDetails.reduce((acc, p) => acc + (Number(p.qty) || 0) * (Number(p.rate) || 0), 0);
  }, [poDetails]);

  // Overall order reconciliation check
  const isLotMatched = totalLotQty === formOrderQty;
  const isPoMatched = totalPoQty === formOrderQty;

  // Check if every PO has its breakdown matched (Overall PO and all Color Qtys)
  const allPoBreakdownsMatched = useMemo(() => {
    return poDetails.every((p) => {
      if (!p.breakdown) return false;
      const bSum = p.breakdown.colorBreakdowns.reduce((cAcc, c) => {
        return cAcc + c.sizeRows.reduce((sAcc, s) => sAcc + (Number(s.quantity) || 0), 0);
      }, 0);
      const allColorsMatch = p.breakdown.colorBreakdowns.every(
        (c) =>
          (Number(c.quantity) || 0) ===
          c.sizeRows.reduce((sAcc, s) => sAcc + (Number(s.quantity) || 0), 0)
      );
      return bSum === Number(p.qty) && Number(p.qty) > 0 && allColorsMatch;
    });
  }, [poDetails]);

  // Combined reconciliation status
  const isOrderFullyReconciled = isLotMatched && isPoMatched && allPoBreakdownsMatched;

  // ==========================================================================
  // RATIO DISTRIBUTION (LARGEST REMAINDER METHOD) & DERIVED GRID VALUES
  // ==========================================================================
  const distributeQtyByRatio = (
    targetQty: number,
    ratios: { size: string; ratio: number }[]
  ): { size: string; quantity: number }[] => {
    const sumRatio = ratios.reduce((acc, r) => acc + Math.max(0, Number(r.ratio) || 0), 0);
    if (sumRatio <= 0 || targetQty <= 0) {
      return ratios.map((r) => ({ size: r.size, quantity: 0 }));
    }

    const rawAllocations = ratios.map((r) => {
      const raw = ((Number(r.ratio) || 0) / sumRatio) * targetQty;
      return {
        size: r.size,
        floor: Math.floor(raw),
        fraction: raw - Math.floor(raw),
      };
    });

    const totalFloor = rawAllocations.reduce((acc, a) => acc + a.floor, 0);
    const remainder = Math.round(targetQty - totalFloor);

    // Sort by fraction descending to distribute remainder 1 piece at a time
    const sortedByFraction = [...rawAllocations].sort((a, b) => b.fraction - a.fraction);
    const extraMap: Record<string, number> = {};
    for (let i = 0; i < remainder; i++) {
      const s = sortedByFraction[i % sortedByFraction.length].size;
      extraMap[s] = (extraMap[s] || 0) + 1;
    }

    return rawAllocations.map((a) => ({
      size: a.size,
      quantity: a.floor + (extraMap[a.size] || 0),
    }));
  };

  // Dynamic size columns for Right Panel
  const gridSizes = useMemo(() => {
    if (!modalBreakdownData || modalBreakdownData.colorBreakdowns.length === 0) return [];
    const list: string[] = [];
    const seen = new Set<string>();
    modalBreakdownData.colorBreakdowns.forEach((c) => {
      c.sizeRows.forEach((s) => {
        if (!seen.has(s.size)) {
          seen.add(s.size);
          list.push(s.size);
        }
      });
    });
    return list.length > 0 ? list : ["8S", "8R", "8L", "10S", "10R", "10L"];
  }, [modalBreakdownData]);

  // Aggregate quantity for each size column across all colors
  const sizeTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    gridSizes.forEach((sz) => {
      totals[sz] = 0;
    });
    if (!modalBreakdownData) return totals;
    modalBreakdownData.colorBreakdowns.forEach((c) => {
      c.sizeRows.forEach((s) => {
        if (totals[s.size] !== undefined) {
          totals[s.size] += Number(s.quantity) || 0;
        }
      });
    });
    return totals;
  }, [modalBreakdownData, gridSizes]);

  // Grand total across all sizes (Total Size Qty - Section 6)
  const totalSizeQty = useMemo(() => {
    return Object.values(sizeTotals).reduce((a, b) => a + (Number(b) || 0), 0);
  }, [sizeTotals]);
  const totalActualSizeQty = totalSizeQty;

  // Total Target Color Quantity (Sum of user-entered Color Qty across all colors - Section 6)
  const totalTargetColorQty = useMemo(() => {
    if (!modalBreakdownData) return 0;
    return modalBreakdownData.colorBreakdowns.reduce((acc, c) => acc + (Number(c.quantity) || 0), 0);
  }, [modalBreakdownData]);

  // Live breakdown total for the modal (= Total Size Qty)
  const modalBreakdownTotal = useMemo(() => {
    return totalSizeQty;
  }, [totalSizeQty]);

  // Remaining balance = PO Qty - Total Size Qty (Section 6)
  const modalRemainingQty = useMemo(() => {
    if (!activePoForBreakdown) return 0;
    return Number(activePoForBreakdown.qty) - modalBreakdownTotal;
  }, [activePoForBreakdown, modalBreakdownTotal]);

  // Color-wise mismatch detection (Section 6, Scenario B)
  const colorMismatches = useMemo(() => {
    if (!modalBreakdownData) return [];
    const list: { color: string; colorQty: number; sizeTotal: number; diff: number }[] = [];
    modalBreakdownData.colorBreakdowns.forEach((c) => {
      const cTarget = Number(c.quantity) || 0;
      const cSizeTot = c.sizeRows.reduce((acc, s) => acc + (Number(s.quantity) || 0), 0);
      if (cTarget !== cSizeTot) {
        list.push({
          color: c.color,
          colorQty: cTarget,
          sizeTotal: cSizeTot,
          diff: Math.abs(cTarget - cSizeTot),
        });
      }
    });
    return list;
  }, [modalBreakdownData]);

  // ==========================================================================
  // PO ROW ACTIONS & MODAL HANDLERS
  // ==========================================================================
  const handleOpenBreakdownModal = (poRow: MMPODetailRow) => {
    setActivePoForBreakdown(poRow);
    const existing = poRow.breakdown;
    if (existing && existing.colorBreakdowns && existing.colorBreakdowns.length > 0) {
      const cloned: MMPoBreakdownHeader = JSON.parse(JSON.stringify(existing));
      cloned.colorBreakdowns = cloned.colorBreakdowns.map((c) => {
        const sizeSum = c.sizeRows.reduce((a, s) => a + (Number(s.quantity) || 0), 0);
        return {
          ...c,
          quantity: c.quantity !== undefined && c.quantity !== null && Number(c.quantity) > 0 ? Number(c.quantity) : sizeSum,
        };
      });
      setModalBreakdownData(cloned);
    } else {
      const defaultSizes = ["8S", "8R", "8L", "10S", "10R", "10L"];
      const initialBreakdown: MMPoBreakdownHeader = {
        poId: poRow.id,
        poNumber: poRow.poNumber,
        poQty: poRow.qty,
        lotNo: poRow.lot || deliveryLots[0]?.lotNumber || "LOT-01",
        ratioWiseQtyChange: false,
        sizeFromBuyerDept: "UK Tailored Ladies (8S, 8R, 8L, 10S, 10R, 10L, 12S, 12R, 12L, 14S)",
        countryBreakdown: poRow.destCountry || formDestCountry,
        note: `Size & Color Breakdown for ${poRow.poNumber}`,
        company: formBeneficiaryCompany,
        lineName: "Line 01 - Sewing",
        startDate: formConfirmDt,
        finishDate: poRow.delDate || formDelDt,
        planQty: poRow.qty,
        colorBreakdowns: [
          {
            id: `cb-${Date.now()}-1`,
            color: "Black",
            rate: poRow.rate || formUnitPrice,
            assrtStatus: "Solid",
            quantity: poRow.qty,
            sizeRows: defaultSizes.map((sz, idx) => ({
              id: `sr-${Date.now()}-1-${idx}`,
              size: sz,
              ratio: 1,
              quantity: 0,
              rate: poRow.rate || formUnitPrice,
              total: 0,
            })),
          },
        ],
      };

      // Default distribute 1:1:1:1:1:1
      const allocated = distributeQtyByRatio(
        poRow.qty,
        defaultSizes.map((s) => ({ size: s, ratio: 1 }))
      );
      allocated.forEach((a, idx) => {
        initialBreakdown.colorBreakdowns[0].sizeRows[idx].quantity = a.quantity;
        initialBreakdown.colorBreakdowns[0].sizeRows[idx].total =
          a.quantity * (initialBreakdown.colorBreakdowns[0].rate || 0);
      });

      setModalBreakdownData(initialBreakdown);
    }
    setSelectedBreakdownColorIds([]);
    setIsModalDirty(false);
  };

  const handleColorQtyChange = (colorIndex: number, newQty: number) => {
    if (!modalBreakdownData) return;
    const updatedColors = [...modalBreakdownData.colorBreakdowns];
    updatedColors[colorIndex] = {
      ...updatedColors[colorIndex],
      quantity: Math.max(0, newQty),
    };
    setModalBreakdownData({
      ...modalBreakdownData,
      colorBreakdowns: updatedColors,
    });
    setIsModalDirty(true);
  };

  const handleDistributeColorByRatio = (colorIndex: number) => {
    if (!modalBreakdownData || !activePoForBreakdown) return;
    const updatedColors = [...modalBreakdownData.colorBreakdowns];
    const targetColor = { ...updatedColors[colorIndex] };
    const targetQty = Number(targetColor.quantity) || 0;

    if (targetQty <= 0) {
      toast.warning(`Please specify a Color Qty greater than 0 for '${targetColor.color}' first.`);
      return;
    }

    const hasManual = targetColor.sizeRows.some((s) => (Number(s.quantity) || 0) > 0);
    if (hasManual) {
      if (
        !confirm(
          `Color '${targetColor.color}' already has size quantities entered. Are you sure you want to replace them with ratio-based allocation?`
        )
      ) {
        return;
      }
    }

    const ratiosArr = gridSizes.map((sz) => {
      const sRow = targetColor.sizeRows.find((s) => s.size === sz);
      return {
        size: sz,
        ratio: sRow ? Math.max(0, Number(sRow.ratio) || 0) : 1,
      };
    });

    const allocated = distributeQtyByRatio(targetQty, ratiosArr);
    const allocMap = new Map(allocated.map((a) => [a.size, a.quantity]));

    targetColor.sizeRows = targetColor.sizeRows.map((sr) => {
      const q = allocMap.get(sr.size) || 0;
      return {
        ...sr,
        quantity: q,
        total: q * (Number(sr.rate) || Number(targetColor.rate) || 0),
      };
    });

    updatedColors[colorIndex] = targetColor;
    setModalBreakdownData({
      ...modalBreakdownData,
      colorBreakdowns: updatedColors,
    });
    setIsModalDirty(true);
    toast.success(
      `Distributed ${targetQty.toLocaleString()} pcs for '${targetColor.color}' based on size ratios.`
    );
  };

  const handleUpdateSizeCell = (
    colorIndex: number,
    sizeName: string,
    field: "ratio" | "quantity" | "rate",
    value: number
  ) => {
    if (!modalBreakdownData) return;
    const updatedColors = [...modalBreakdownData.colorBreakdowns];
    const targetColor = { ...updatedColors[colorIndex] };
    const sizeRows = [...targetColor.sizeRows];
    const sIdx = sizeRows.findIndex((s) => s.size === sizeName);

    if (sIdx >= 0) {
      const cur = { ...sizeRows[sIdx] };
      if (field === "ratio") {
        cur.ratio = Math.max(0, value);
      } else if (field === "quantity") {
        cur.quantity = Math.max(0, Math.floor(value));
        cur.total = cur.quantity * (cur.rate || targetColor.rate || 0);
      } else if (field === "rate") {
        cur.rate = Math.max(0, value);
        cur.total = (cur.quantity || 0) * cur.rate;
      }
      sizeRows[sIdx] = cur;
    } else {
      const newRow: MMPoSizeRow = {
        id: `sr-${Date.now()}-${sizeName}`,
        size: sizeName,
        ratio: field === "ratio" ? Math.max(0, value) : 1,
        quantity: field === "quantity" ? Math.max(0, Math.floor(value)) : 0,
        rate: field === "rate" ? Math.max(0, value) : targetColor.rate || activePoForBreakdown?.rate || formUnitPrice,
        total: 0,
      };
      if (field === "quantity") {
        newRow.total = newRow.quantity * newRow.rate;
      }
      sizeRows.push(newRow);
    }

    targetColor.sizeRows = sizeRows;
    // NOTE: Preserving targetColor.quantity so user-entered Color Qty is not overwritten by manual size entry
    updatedColors[colorIndex] = targetColor;

    setModalBreakdownData({
      ...modalBreakdownData,
      colorBreakdowns: updatedColors,
    });
    setIsModalDirty(true);
  };

  const handleAddColor = () => {
    if (!modalBreakdownData) return;
    const existingColors = modalBreakdownData.colorBreakdowns.map((c) => c.color);
    const nextColorName =
      AVAILABLE_GARMENT_COLORS.find((c) => !existingColors.includes(c)) ||
      `Color ${modalBreakdownData.colorBreakdowns.length + 1}`;

    const newSizeRows: MMPoSizeRow[] = gridSizes.map((sz, idx) => ({
      id: `sr-${Date.now()}-${idx}-${sz}`,
      size: sz,
      ratio: 1,
      quantity: 0,
      rate: activePoForBreakdown?.rate || formUnitPrice,
      total: 0,
    }));

    const suggestedQty = Math.max(0, modalRemainingQty);

    const newColor: MMPoColorBreakdown = {
      id: `cb-${Date.now()}`,
      color: nextColorName,
      rate: activePoForBreakdown?.rate || formUnitPrice,
      assrtStatus: "Solid",
      quantity: suggestedQty,
      sizeRows: newSizeRows,
    };

    setModalBreakdownData({
      ...modalBreakdownData,
      colorBreakdowns: [...modalBreakdownData.colorBreakdowns, newColor],
    });
    setIsModalDirty(true);
    toast.success(`Added color '${nextColorName}' to breakdown.`);
  };

  const handleRemoveColor = (cIdx: number) => {
    if (!modalBreakdownData) return;
    if (modalBreakdownData.colorBreakdowns.length <= 1) {
      toast.error("At least one garment color must remain in the breakdown.");
      return;
    }
    const colorToRemove = modalBreakdownData.colorBreakdowns[cIdx];
    const colorQty = colorToRemove.sizeRows.reduce((a, s) => a + (Number(s.quantity) || 0), 0);

    if (colorQty > 0) {
      if (
        !confirm(
          `Color '${colorToRemove.color}' has ${colorQty.toLocaleString()} pcs allocated. Are you sure you want to remove it?`
        )
      ) {
        return;
      }
    }

    const updated = modalBreakdownData.colorBreakdowns.filter((_, idx) => idx !== cIdx);
    setModalBreakdownData({
      ...modalBreakdownData,
      colorBreakdowns: updated,
    });
    setIsModalDirty(true);
    toast.info(`Removed color '${colorToRemove.color}'.`);
  };

  // Helper: Parse bulk size names supporting commas, spaces, mixed, and quotes
  const parseBulkSizes = (input: string): string[] => {
    if (!input || !input.trim()) return [];

    // 1. Extract quoted strings: "..." or '...'
    const quotesMap: string[] = [];
    let sanitized = input.replace(/(["'])(.*?)\1/g, (_, _quote, content) => {
      const trimmedContent = content.trim();
      if (trimmedContent) {
        quotesMap.push(trimmedContent);
        return ` __QUOTED_TOKEN_${quotesMap.length - 1}__ `;
      }
      return " ";
    });

    // 2. Tokenize by commas or spaces
    const rawTokens = sanitized
      .replace(/,/g, " ")
      .split(/\s+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // 3. Restore quoted tokens and standardize
    const result: string[] = [];
    const seenUpper = new Set<string>();

    for (const token of rawTokens) {
      let resolved = token;
      const match = token.match(/^__QUOTED_TOKEN_(\d+)__$/);
      if (match) {
        const idx = parseInt(match[1]);
        resolved = quotesMap[idx] || token;
      }

      const trimmed = resolved.trim();
      if (!trimmed) continue;

      const upper = trimmed.toUpperCase();
      if (!seenUpper.has(upper)) {
        seenUpper.add(upper);
        result.push(upper);
      }
    }

    return result;
  };

  // Section 5: Dynamic Custom Size Management (Bulk Size Entry)
  const handleAddCustomSizes = (sizeNamesInput: string) => {
    const parsed = parseBulkSizes(sizeNamesInput);
    if (parsed.length === 0) {
      toast.error("Please enter at least one size name.");
      return false;
    }
    if (!modalBreakdownData) return false;

    // Check duplicates against current gridSizes
    const existingSizesUpper = new Set(gridSizes.map((sz) => sz.trim().toUpperCase()));

    const added: string[] = [];
    const skipped: string[] = [];

    parsed.forEach((sz) => {
      if (existingSizesUpper.has(sz)) {
        skipped.push(sz);
      } else {
        added.push(sz);
        existingSizesUpper.add(sz);
      }
    });

    if (added.length === 0) {
      toast.error(`All entered sizes already exist: ${skipped.join(", ")}`);
      return false;
    }

    // Add new size columns across all colors
    let updatedColors = [...modalBreakdownData.colorBreakdowns];
    added.forEach((trimmed) => {
      updatedColors = updatedColors.map((c, cIdx) => {
        const newSizeRow: MMPoSizeRow = {
          id: `sr-${Date.now()}-${cIdx}-${trimmed}`,
          size: trimmed,
          ratio: 1,
          quantity: 0,
          rate: c.rate || activePoForBreakdown?.rate || formUnitPrice,
          total: 0,
        };
        return {
          ...c,
          sizeRows: [...c.sizeRows, newSizeRow],
        };
      });
    });

    setModalBreakdownData({
      ...modalBreakdownData,
      colorBreakdowns: updatedColors,
    });
    setIsModalDirty(true);
    setNewCustomSizeInput("");
    setShowAddSizeModal(false);

    if (skipped.length > 0) {
      toast.info(
        `✓ Added ${added.length} size(s): ${added.join(", ")}. Skipped existing: ${skipped.join(", ")}.`
      );
    } else {
      toast.success(`✓ Added ${added.length} size(s): ${added.join(", ")} across all colors.`);
    }
    return true;
  };

  // Retain handleAddCustomSize as an alias for single/legacy invocation
  const handleAddCustomSize = (sizeNameInput: string) => {
    return handleAddCustomSizes(sizeNameInput);
  };

  const handleRemoveCustomSize = (sizeNameToRemove: string) => {
    if (!modalBreakdownData) return;
    if (gridSizes.length <= 1) {
      toast.error("At least one size column must remain in the breakdown.");
      return;
    }

    let totalQtyForSize = 0;
    modalBreakdownData.colorBreakdowns.forEach((c) => {
      const s = c.sizeRows.find((row) => row.size === sizeNameToRemove);
      if (s) totalQtyForSize += Number(s.quantity) || 0;
    });

    if (totalQtyForSize > 0) {
      if (
        !confirm(
          `Size '${sizeNameToRemove}' has ${totalQtyForSize.toLocaleString()} pcs entered across colors. Are you sure you want to remove this size column?`
        )
      ) {
        return;
      }
    }

    const updatedColors = modalBreakdownData.colorBreakdowns.map((c) => {
      const filtered = c.sizeRows.filter((s) => s.size !== sizeNameToRemove);
      return {
        ...c,
        sizeRows: filtered,
      };
    });

    setModalBreakdownData({
      ...modalBreakdownData,
      colorBreakdowns: updatedColors,
    });
    setIsModalDirty(true);
    toast.info(`Removed size column '${sizeNameToRemove}'.`);
  };

  // Section 8: S.C / LC Selection Handlers
  const handleSelectScLc = (scLcRecord: MMSCLCMaster) => {
    if (scLcTargetPoIndex === null || scLcTargetPoIndex < 0) return;
    const updated = [...poDetails];
    const targetPo = updated[scLcTargetPoIndex];
    targetPo.scLcNo = scLcRecord.scLcNo;
    setPoDetails(updated);
    setShowScLcModal(false);
    setScLcTargetPoIndex(null);
    toast.success(`Linked ${scLcRecord.type} '${scLcRecord.scLcNo}' to PO ${targetPo.poNumber}.`);
  };

  const handleClearScLc = () => {
    if (scLcTargetPoIndex === null || scLcTargetPoIndex < 0) return;
    const updated = [...poDetails];
    const targetPo = updated[scLcTargetPoIndex];
    targetPo.scLcNo = undefined;
    setPoDetails(updated);
    setShowScLcModal(false);
    setScLcTargetPoIndex(null);
    toast.info(`Removed S.C/LC link from PO ${targetPo.poNumber}.`);
  };

  // Section 5: Ratio Wise Qty Change dialog controls
  const handleOpenRatioModal = (defaultColorIdx = 0) => {
    if (!modalBreakdownData || modalBreakdownData.colorBreakdowns.length === 0) return;
    const cIdx = Math.max(0, Math.min(defaultColorIdx, modalBreakdownData.colorBreakdowns.length - 1));
    setRatioTargetColorIndex(cIdx);
    const targetCol = modalBreakdownData.colorBreakdowns[cIdx];
    const targetQ =
      targetCol.quantity > 0
        ? targetCol.quantity
        : modalRemainingQty > 0
        ? modalRemainingQty
        : Number(activePoForBreakdown?.qty || 1000);
    setRatioTargetQty(targetQ);

    const initRatios: Record<string, number> = {};
    gridSizes.forEach((sz) => {
      const sRow = targetCol.sizeRows.find((s) => s.size === sz);
      initRatios[sz] = sRow && sRow.ratio !== undefined ? sRow.ratio : 1;
    });
    setRatioWorkingValues(initRatios);
    setShowRatioModal(true);
  };

  const handleApplyRatioModal = () => {
    if (!modalBreakdownData || !activePoForBreakdown) return;
    const updatedColors = [...modalBreakdownData.colorBreakdowns];
    const targetColor = { ...updatedColors[ratioTargetColorIndex] };

    const hasManualQuantities = targetColor.sizeRows.some((s) => (Number(s.quantity) || 0) > 0);
    if (hasManualQuantities) {
      if (
        !confirm(
          `Color '${targetColor.color}' already has size quantities entered. Are you sure you want to replace them with ratio-based allocation?`
        )
      ) {
        return;
      }
    }

    const ratiosArr = gridSizes.map((sz) => ({
      size: sz,
      ratio: Math.max(0, Number(ratioWorkingValues[sz]) || 0),
    }));

    const allocated = distributeQtyByRatio(ratioTargetQty, ratiosArr);
    const allocMap = new Map(allocated.map((a) => [a.size, a.quantity]));

    const nextSizeRows: MMPoSizeRow[] = gridSizes.map((sz) => {
      const existing = targetColor.sizeRows.find((s) => s.size === sz);
      const qty = allocMap.get(sz) || 0;
      const ratio = Math.max(0, Number(ratioWorkingValues[sz]) || 0);
      const rate = existing?.rate || targetColor.rate || activePoForBreakdown.rate || formUnitPrice;
      return {
        id: existing?.id || `sr-${Date.now()}-${sz}`,
        size: sz,
        ratio,
        quantity: qty,
        rate,
        total: qty * rate,
      };
    });

    targetColor.sizeRows = nextSizeRows;
    targetColor.quantity = ratioTargetQty;
    updatedColors[ratioTargetColorIndex] = targetColor;

    setModalBreakdownData({
      ...modalBreakdownData,
      colorBreakdowns: updatedColors,
    });
    setIsModalDirty(true);
    setShowRatioModal(false);
    toast.success(
      `Distributed ${ratioTargetQty.toLocaleString()} pcs across sizes for '${targetColor.color}' based on ratio.`
    );
  };

  const handleModalSaveBreakdown = () => {
    if (!activePoForBreakdown || !modalBreakdownData) return;

    const poTargetQty = Number(activePoForBreakdown.qty) || 0;

    // Check negative quantities
    for (const c of modalBreakdownData.colorBreakdowns) {
      for (const s of c.sizeRows) {
        if (Number(s.quantity) < 0) {
          toast.error(`Negative quantity is not allowed in Color '${c.color}', Size '${s.size}'.`);
          return;
        }
      }
    }

    // MANDATORY BUSINESS RULE (Scenario D): Total size-wise quantity cannot exceed the PO quantity!
    if (totalActualSizeQty > poTargetQty) {
      toast.error(
        `⛔ Total size-wise quantity cannot exceed the PO quantity. Total: ${totalActualSizeQty.toLocaleString()} pcs, PO Qty: ${poTargetQty.toLocaleString()} pcs.`
      );
      return;
    }
    if (totalTargetColorQty > poTargetQty) {
      toast.error(
        `⛔ Total Color Qty cannot exceed the PO quantity. Total: ${totalTargetColorQty.toLocaleString()} pcs, PO Qty: ${poTargetQty.toLocaleString()} pcs.`
      );
      return;
    }

    // Calculate subtotal per color while preserving target quantity
    const finalizedBreakdown: MMPoBreakdownHeader = {
      ...modalBreakdownData,
      poQty: poTargetQty,
      colorBreakdowns: modalBreakdownData.colorBreakdowns.map((c) => ({
        ...c,
        quantity: Number(c.quantity) || 0,
        sizeRows: c.sizeRows.map((s) => ({
          ...s,
          total: (Number(s.quantity) || 0) * (Number(s.rate) || Number(c.rate) || 0),
        })),
      })),
    };

    // Update the PO in the parent table
    setPoDetails((prev) =>
      prev.map((p) => {
        if (p.id === activePoForBreakdown.id) {
          return {
            ...p,
            breakdown: finalizedBreakdown,
          };
        }
        return p;
      })
    );

    // Scenario A: All quantities match
    if (
      totalActualSizeQty === poTargetQty &&
      totalTargetColorQty === poTargetQty &&
      colorMismatches.length === 0
    ) {
      toast.success(
        `✓ Breakdown matched exactly to PO ${activePoForBreakdown.poNumber} (${totalActualSizeQty.toLocaleString()} pcs)!`
      );
    } else if (colorMismatches.length > 0) {
      // Scenario B: Color-wise mismatch
      const first = colorMismatches[0];
      toast.warning(
        `⚠ ${first.color}: Color Qty is ${first.colorQty.toLocaleString()} pcs, but size-wise total is ${first.sizeTotal.toLocaleString()} pcs (Difference: ${first.diff.toLocaleString()} pcs). Breakdown saved as Draft.`
      );
    } else {
      // Scenario C: Less than PO Qty
      toast.warning(
        `⚠ Breakdown saved as Draft (Remaining balance: ${(poTargetQty - totalActualSizeQty).toLocaleString()} pcs of ${poTargetQty.toLocaleString()} pcs).`
      );
    }

    setActivePoForBreakdown(null);
    setModalBreakdownData(null);
    setIsModalDirty(false);
  };

  const handleModalCloseAttempt = () => {
    if (isModalDirty) {
      setShowDiscardConfirm(true);
    } else {
      setActivePoForBreakdown(null);
      setModalBreakdownData(null);
    }
  };

  // Section 6: Populate Sizes action across all colors
  const handlePopulateSizes = () => {
    if (!modalBreakdownData) return;
    const sizePresetKey = modalBreakdownData.sizeFromBuyerDept;
    const newSizes = BUYER_DEPT_SIZE_SETS[sizePresetKey] || ["S", "M", "L", "XL"];

    const hasExistingQuantities = modalBreakdownData.colorBreakdowns.some((c) =>
      c.sizeRows.some((s) => Number(s.quantity) > 0)
    );

    if (hasExistingQuantities) {
      if (
        !confirm(
          `Switching to '${sizePresetKey}' will update size columns for all colors in this breakdown. Existing quantities for matched sizes will be preserved. Continue?`
        )
      ) {
        return;
      }
    }

    const updatedColors = modalBreakdownData.colorBreakdowns.map((c) => {
      const existingSizeMap = new Map(c.sizeRows.map((s) => [s.size, s]));
      const nextSizeRows: MMPoSizeRow[] = newSizes.map((sz, idx) => {
        const existing = existingSizeMap.get(sz);
        if (existing) {
          return { ...existing };
        }
        return {
          id: `sr-${Date.now()}-${idx}-${sz}`,
          size: sz,
          ratio: 1,
          quantity: 0,
          rate: c.rate || activePoForBreakdown?.rate || formUnitPrice,
          total: 0,
        };
      });

      return {
        ...c,
        sizeRows: nextSizeRows,
        quantity: nextSizeRows.reduce((acc, s) => acc + (Number(s.quantity) || 0), 0),
      };
    });

    setModalBreakdownData({
      ...modalBreakdownData,
      colorBreakdowns: updatedColors,
    });
    setIsModalDirty(true);
    toast.success(`Populated ${newSizes.length} sizes from '${sizePresetKey}' across all colors.`);
  };

  // Section 11: Copy From another PO's Breakdown
  const handleCopyBreakdownFromPo = (sourcePoId: string) => {
    if (!modalBreakdownData || !sourcePoId) return;
    const sourcePo = poDetails.find((p) => p.id === sourcePoId);
    if (!sourcePo || !sourcePo.breakdown) {
      toast.error("Selected PO has no saved breakdown to copy from.");
      return;
    }

    if (
      isModalDirty &&
      !confirm(
        `Copying breakdown from PO ${sourcePo.poNumber} will replace current color and size allocations. Continue?`
      )
    ) {
      return;
    }

    // Deep clone source breakdown with new unique IDs
    const clonedColors: MMPoColorBreakdown[] = sourcePo.breakdown.colorBreakdowns.map((c, cIdx) => ({
      id: `cb-copy-${Date.now()}-${cIdx}`,
      color: c.color,
      rate: c.rate,
      assrtStatus: c.assrtStatus,
      quantity: c.quantity,
      sizeRows: c.sizeRows.map((s, sIdx) => ({
        id: `sr-copy-${Date.now()}-${cIdx}-${sIdx}`,
        size: s.size,
        ratio: s.ratio,
        quantity: s.quantity,
        rate: s.rate,
        total: s.total,
      })),
    }));

    setModalBreakdownData({
      ...modalBreakdownData,
      lotNo: sourcePo.breakdown.lotNo,
      sizeFromBuyerDept: sourcePo.breakdown.sizeFromBuyerDept,
      countryBreakdown: sourcePo.breakdown.countryBreakdown,
      note: `Copied from ${sourcePo.poNumber}`,
      lineName: sourcePo.breakdown.lineName,
      colorBreakdowns: clonedColors,
    });
    setIsModalDirty(true);
    toast.success(`Copied breakdown structure and rows from ${sourcePo.poNumber}!`);
  };

  // ==========================================================================
  // COPY FROM OUR REF & TEMPLATES
  // ==========================================================================
  const handleCopyFromOurRef = (refVal: string) => {
    if (!refVal) return;
    const sourceOrder = orders.find((o) => o.ourRef === refVal || o.orderNo === refVal);
    if (!sourceOrder) {
      toast.error(`Order reference '${refVal}' not found.`);
      return;
    }

    setFormBuyer(sourceOrder.buyerName);
    setFormBuyerDept(sourceOrder.buyerDepartment);
    setFormBeneficiaryCompany(sourceOrder.companyName);
    setFormStyle(sourceOrder.styleNo);
    setFormGmtItem(sourceOrder.garmentItem);
    setFormSeason(sourceOrder.season);
    setFormUnitPrice(sourceOrder.fobUnitPrice);
    setFormOrderQty(sourceOrder.orderQuantity);
    setFormDestCountry(sourceOrder.destinationCountry);
    setFormDelMode(sourceOrder.deliveryMode);
    setFormDelPort(sourceOrder.destinationPort);

    if (sourceOrder.localAgent) setFormLocalAgent(sourceOrder.localAgent);
    if (sourceOrder.merchan) setFormMerchan(sourceOrder.merchan);
    if (sourceOrder.acHolder) setFormAcHolder(sourceOrder.acHolder);
    if (sourceOrder.deptCode) setFormDeptCode(sourceOrder.deptCode);
    if (sourceOrder.place) setFormPlace((sourceOrder.place as any) || "Top");
    if (sourceOrder.packType) setFormPackType(sourceOrder.packType);
    if (sourceOrder.processName) setProcessList(sourceOrder.processName.split("-").map((p, i) => ({ sl: i + 1, processName: p })));
    if (sourceOrder.payTerm) setFormPayTerm(sourceOrder.payTerm);
    if (sourceOrder.cm) setFormCm(sourceOrder.cm);
    if (sourceOrder.pcs) setFormPcs(sourceOrder.pcs);
    if (sourceOrder.extraCuttingPct) setFormExtraCuttingPct(sourceOrder.extraCuttingPct);
    if (sourceOrder.smv) setFormSmv(sourceOrder.smv);
    if (sourceOrder.notes) setFormNote(sourceOrder.notes);
    if (sourceOrder.instructionDetail) setFormInstructionDetail(sourceOrder.instructionDetail);
    if (sourceOrder.fabricRequirementDetails) setFormFabricReq(sourceOrder.fabricRequirementDetails);
    if (sourceOrder.accessoriesRequirementDetails) setFormAccReq(sourceOrder.accessoriesRequirementDetails);

    // Copy delivery lots with new IDs
    if (sourceOrder.deliveryLots && sourceOrder.deliveryLots.length > 0) {
      setDeliveryLots(
        sourceOrder.deliveryLots.map((l, i) => ({
          ...l,
          id: `lot-copy-${Date.now()}-${i}`,
        }))
      );
    }

    // Copy PO details with new IDs
    if (sourceOrder.poDetails && sourceOrder.poDetails.length > 0) {
      setPoDetails(
        sourceOrder.poDetails.map((p, i) => ({
          ...p,
          id: `po-copy-${Date.now()}-${i}`,
          poNumber: `${p.poNumber}-NEW`,
          breakdown: p.breakdown
            ? {
                ...p.breakdown,
                poId: `po-copy-${Date.now()}-${i}`,
                poNumber: `${p.poNumber}-NEW`,
                colorBreakdowns: p.breakdown.colorBreakdowns.map((c, cIdx) => ({
                  ...c,
                  id: `cb-copy-${Date.now()}-${cIdx}`,
                  sizeRows: c.sizeRows.map((s, sIdx) => ({
                    ...s,
                    id: `sr-copy-${Date.now()}-${cIdx}-${sIdx}`,
                  })),
                })),
              }
            : undefined,
        }))
      );
    }

    toast.success(`Copied particulars from '${refVal}'. Review fields before saving.`);
  };

  const handleCopyLatestOfBuyer = () => {
    const buyerOrders = orders.filter((o) => o.buyerName === formBuyer);
    if (buyerOrders.length === 0) {
      toast.warning(`No previous orders found for buyer '${formBuyer}'.`);
      return;
    }
    const latest = buyerOrders[0];
    handleCopyFromOurRef(latest.ourRef || latest.orderNo);
  };

  // ==========================================================================
  // HANDLERS FOR NEW CONFIRM ORDER (REVISED SPECIFICATION)
  // ==========================================================================

  // Buyer-wise Account Holder auto-population (Requirement 3.7)
  useEffect(() => {
    const buyer = MM_BUYERS_MASTER.find((b) => b.name.toLowerCase() === formBuyer.toLowerCase());
    if (buyer) {
      setFormAcHolder(buyer.accountHolder);
    } else {
      setFormAcHolder("—");
    }
  }, [formBuyer]);

  // Handler for New Order radio selection (Requirement 2.2 A)
  const handleSelectNewOrder = () => {
    setEntryMode("New Order");
    setFormPreCostId("");
    const newJob = MMRepository.generateJobNo();
    setFormJobNo(newJob);
    setFormOurRef(newJob);
    setFormStyle("");
    setFormOrderQty(0);
    setFormUnitPrice(0);
    setFormCm(0);
    setFormNote("");
    setFormInstructionDetail("");
    setPoDetails([
      {
        id: `po-${Date.now()}`,
        no: 1,
        projection: "Confirmed",
        po: "Main",
        qty: 0,
        lot: "LOT-01",
        poNumber: `PO-${formBuyer.slice(0, 2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
        poDesc: "General Production PO",
        rate: 0,
        value: 0,
        delDate: formDelDt,
        pcd: formPcd,
        destCountry: formDestCountry,
        delMode: formDelMode,
        destPort: formDelPort,
        v: "V1",
        s: "FOB",
        size: "M",
      },
    ]);
    toast.info("Switched to New Order entry mode. Unique Job No. generated.");
  };

  // Handler for Pre Costing Ref. radio selection (Requirement 2.2 B)
  const handleSelectPreCostingRef = () => {
    setEntryMode("Pre Costing Ref.");
    setShowPreCostingModal(true);
  };

  // Handler when selecting a Pre Costing record from searchable table (Requirement 2.2 B)
  const handleApplyPreCosting = (pc: MMPreCosting) => {
    setFormPreCostId(pc.preCostId);
    if (pc.jobNo) {
      setFormJobNo(pc.jobNo);
      setFormOurRef(pc.jobNo);
    }
    if (pc.buyerName) {
      setFormBuyer(pc.buyerName);
      const bMatch = MM_BUYERS_MASTER.find((b) => b.name.toLowerCase() === pc.buyerName.toLowerCase());
      if (bMatch) {
        setFormAcHolder(bMatch.accountHolder);
        if (bMatch.departments.length > 0) {
          setFormBuyerDept(bMatch.departments[0].name);
        }
      }
    }
    if (pc.styleNo) {
      setFormStyle(pc.styleNo);
    }
    if (pc.styleDescription) {
      setFormGmtItem(pc.styleDescription);
    }
    if (pc.currency) {
      setFormCurrency(pc.currency);
    }
    if (pc.season) {
      setFormSeason(pc.season);
    }
    if (pc.orderQuantity) {
      setFormOrderQty(pc.orderQuantity);
    }
    if (pc.offeredFobPerPc) {
      setFormUnitPrice(pc.offeredFobPerPc);
    }
    if (pc.cmCostPerDzn) {
      setFormCm(Number((pc.cmCostPerDzn / 12).toFixed(2)));
      setFormCmUnit("PCS");
    }
    // Update first PO row
    const targetQty = pc.orderQuantity || formOrderQty || 10000;
    const targetRate = pc.offeredFobPerPc || formUnitPrice;
    setPoDetails([
      {
        id: `po-${Date.now()}`,
        no: 1,
        projection: "Confirmed",
        po: "Main",
        qty: targetQty,
        lot: "LOT-01",
        poNumber: `PO-${(pc.buyerName || "ORD").slice(0, 2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
        poDesc: pc.styleDescription || "Bulk Production PO",
        rate: targetRate,
        value: targetQty * targetRate,
        delDate: formDelDt,
        pcd: formPcd,
        destCountry: formDestCountry,
        delMode: formDelMode,
        destPort: formDelPort,
        v: "V1",
        s: "FOB",
        size: "M",
      },
    ]);
    setShowPreCostingModal(false);
    toast.success(`Populated fields from Pre-Costing ${pc.preCostId} (${pc.styleNo}). All fields remain editable.`);
  };

  // Process list handlers (Requirement 4.5)
  const handleAddProcess = () => {
    if (!newProcessInput.trim()) return;
    const nextSl = processList.length + 1;
    setProcessList([...processList, { sl: nextSl, processName: newProcessInput.trim() }]);
    setNewProcessInput("");
  };

  const handleRemoveProcess = (idx: number) => {
    const updated = processList.filter((_, i) => i !== idx).map((p, i) => ({ ...p, sl: i + 1 }));
    setProcessList(updated);
  };

  const handleLoadProcessTemplate = (templateId: string) => {
    if (!templateId) return;
    const templates = MMRepository.getProcessTemplates();
    const tmpl = templates.find((t) => t.id === templateId);
    if (tmpl) {
      setProcessList(tmpl.processes.map((p, i) => ({ sl: i + 1, processName: p })));
      toast.success(`Loaded process template "${tmpl.name}" (${tmpl.processes.length} steps)`);
    }
  };

  const handleOpenNewProcessModal = () => {
    setModalTemplateName("");
    setModalProcessRows([
      { sl: 1, processName: "" },
      { sl: 2, processName: "" },
    ]);
    setShowNewProcessModal(true);
  };

  const handleAddModalRow = () => {
    setModalProcessRows((prev) => [
      ...prev,
      { sl: prev.length + 1, processName: "" },
    ]);
  };

  const handleRemoveModalRow = (idx: number) => {
    setModalProcessRows((prev) => {
      const updated = prev.filter((_, i) => i !== idx);
      return updated.map((r, i) => ({ ...r, sl: i + 1 }));
    });
  };

  const handleSaveNewProcessTemplate = () => {
    if (!modalTemplateName.trim()) {
      toast.error("Template Name is required.");
      return;
    }
    const validProcesses = modalProcessRows
      .map((r) => r.processName.trim())
      .filter((p) => p.length > 0);
    if (validProcesses.length === 0) {
      toast.error("Please enter at least one valid Process Name.");
      return;
    }
    const newTmpl: MMProcessTemplate = {
      id: `tmpl-${Date.now()}`,
      name: modalTemplateName.trim(),
      processes: validProcesses,
    };
    MMRepository.saveProcessTemplate(newTmpl);
    const updated = MMRepository.getProcessTemplates();
    setAvailableProcessTemplates(updated);
    setShowNewProcessModal(false);
    toast.success(`Process template "${newTmpl.name}" saved to Local Storage!`);
  };

  const handleSaveProcessTemplate = () => {
    if (!newTemplateName.trim()) {
      toast.error("Template name is required.");
      return;
    }
    const newTmpl: MMProcessTemplate = {
      id: `tmpl-${Date.now()}`,
      name: newTemplateName.trim(),
      processes: processList.map((p) => p.processName),
    };
    MMRepository.saveProcessTemplate(newTmpl);
    setAvailableProcessTemplates(MMRepository.getProcessTemplates());
    setShowSaveProcessTemplateModal(false);
    setNewTemplateName("");
    toast.success(`Saved template "${newTmpl.name}" to Local Storage`);
  };

  // ==========================================================================
  // SAVE MAIN ORDER & AUDIT
  // ==========================================================================
  const handleSaveMainOrder = (isDraft: boolean = false) => {
    // Basic field validation
    if (!formBuyer.trim()) {
      toast.error("Buyer is mandatory.");
      return;
    }
    if (!formStyle.trim()) {
      toast.error("Style is mandatory.");
      return;
    }
    if (formOrderQty <= 0) {
      toast.error("Total Order Quantity must be greater than zero.");
      return;
    }

    // Auto generate Job No. if empty
    let jobNoToSave = formJobNo;
    if (!jobNoToSave || !jobNoToSave.trim()) {
      jobNoToSave = MMRepository.generateJobNo();
      setFormJobNo(jobNoToSave);
      setFormOurRef(jobNoToSave);
    }

    // If confirming (not draft), strictly validate PO reconciliation
    if (!isDraft) {
      if (!isPoMatched) {
        toast.error(
          `PO Details sum (${totalPoQty.toLocaleString()} pcs) does not match Total Order Quantity (${formOrderQty.toLocaleString()} pcs).`
        );
        return;
      }
      if (!allPoBreakdownsMatched) {
        toast.error(
          "One or more POs have incomplete or unmatched Size & Color Breakdowns. Please reconcile all PO breakdowns before confirming."
        );
        return;
      }
    }

    // Build colorWiseBreakdown and sizeWiseBreakdown aggregates from all PO breakdowns
    const aggColors: Record<string, number> = {};
    const aggSizes: Record<string, number> = {};
    poDetails.forEach((p) => {
      p.breakdown?.colorBreakdowns.forEach((c) => {
        aggColors[c.color] = (aggColors[c.color] || 0) + (Number(c.quantity) || 0);
        c.sizeRows.forEach((s) => {
          aggSizes[s.size] = (aggSizes[s.size] || 0) + (Number(s.quantity) || 0);
        });
      });
    });

    const colorWiseList: MMColorQty[] = Object.entries(aggColors).map(([color, quantity]) => ({
      color,
      quantity,
    }));
    const sizeWiseList: MMSizeQty[] = Object.entries(aggSizes).map(([size, quantity]) => ({
      size,
      quantity,
    }));
    const poWiseList: MMPOQty[] = poDetails.map((p) => ({
      poNumber: p.poNumber,
      poDate: formConfirmDt,
      shipmentDate: p.delDate,
      quantity: Number(p.qty),
      destinationCountry: p.destCountry,
    }));

    // Use user-defined deliveryLots if available, or generate default lot
    const activeDeliveryLots: MMDeliveryLotRow[] =
      deliveryLots && deliveryLots.length > 0
        ? deliveryLots
        : [
            {
              id: `lot-${Date.now()}`,
              lotNumber: "LOT-01",
              quantity: formOrderQty,
              deliveryDate: formDelDt,
            },
          ];

    const lotWiseList: MMLotQty[] = activeDeliveryLots.map((l) => ({
      lotNumber: l.lotNumber,
      deliveryDate: l.deliveryDate,
      quantity: l.quantity,
      deliveryMode: (formDelMode as any) || "Sea",
      destinationPort: formDelPort,
    }));

    const countryWiseList: MMCountryQty[] = Array.from(new Set(poDetails.map((p) => p.destCountry))).map((ctry) => ({
      country: ctry,
      quantity: poDetails.filter((p) => p.destCountry === ctry).reduce((acc, p) => acc + (Number(p.qty) || 0), 0),
    }));

    const orderIdToSave = editingOrderId || `ord-${Date.now()}`;
    const nextOrderNumber = editingOrderId
      ? orders.find((o) => o.id === editingOrderId)?.orderNo || "ORD-2026-0099"
      : MMRepository.generateOrderNo();

    const orderRecord: MMMainOrder = {
      id: orderIdToSave,
      orderNo: nextOrderNumber,
      orderType: formOrderType,
      buyerName: formBuyer,
      buyerDepartment: formBuyerDept,
      companyName: formBeneficiaryCompany,
      businessUnit: "Unit 2 - Garments",
      styleNo: formStyle,
      garmentItem: formGmtItem,
      season: formSeason,
      merchandisingRef: jobNoToSave,
      buyerPoNumber: poDetails[0]?.poNumber || "PO-BULK-01",
      buyerPoDate: formConfirmDt,
      preCostId: formPreCostId || "PC-2026-001",
      preCostVersion: 1,
      orderQuantity: formOrderQty,
      fobUnitPrice: formUnitPrice,
      totalOrderValue: orderValue > 0 ? orderValue : formOrderQty * formUnitPrice,
      currency: formCurrency,
      orderDate: formConfirmDt,
      shipmentDate: formDelDt,
      destinationCountry: formDestCountry,
      deliveryMode: formDelMode,
      destinationPort: formDelPort,
      orderStatus: formOrderStatus === "Active" ? "Open" : formOrderStatus === "Closed" ? "Closed" : isDraft ? "Draft" : "Open",

      // Detailed specifications
      entryMode: entryMode,
      jobNo: jobNoToSave,
      priceType: formPriceType,
      cmUnit: formCmUnit,
      processList: processList,
      newOrderRepeatOrder: "New Order",
      referenceStatus: formOrderStatus,
      ourRef: jobNoToSave,
      orderSl: formOrderSl,
      copyFromOurRef: formCopyFromOurRef,
      beneficiaryCompany: formBeneficiaryCompany,
      localAgent: formLocalAgent,
      merchan: formMerchant,
      acHolder: formAcHolder,
      deptCode: formDeptCode,
      place: formPlace,
      packType: formPackType,
      processName: processList.map((p) => p.processName).join("-"),
      size: "S-L",
      payTerm: formPayTerm,
      cm: formCm,
      pcs: formPcs,
      firstDelDate: formFirstDelDt,
      confirmDate: formConfirmDt,
      extraCuttingPct: formExtraCuttingPct,
      smv: formSmv,
      delDate: formDelDt,
      pcd: formPcd,
      instructionDetail: formInstructionDetail,
      fabricRequirementDetails: formFabricReq,
      accessoriesRequirementDetails: formAccReq,

      // Tables
      deliveryLots: activeDeliveryLots,
      poDetails: poDetails,

      // Aggregates for backward compatibility
      colorWiseBreakdown: colorWiseList,
      sizeWiseBreakdown: sizeWiseList,
      poWiseBreakdown: poWiseList,
      lotWiseBreakdown: lotWiseList,
      countryWiseBreakdown: countryWiseList,
      notes: formNote,
      createdBy: formMerchant,
      createdDate: new Date().toISOString().slice(0, 10),
      fobAuditLog: [],
      closureAuditLog: [],
    };

    MMRepository.saveOrder(orderRecord);
    MMRepository.saveOrderEntryDraft(null);
    setOrders(MMRepository.getOrders());
    MMRepository.saveOrderEntryUiState({ activeTab: "register", editingOrderId: null });
    setActiveTab("register");
    setEditingOrderId(null);
    MMRepository.addAuditLog({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      entityType: "MainOrder",
      entityId: orderRecord.orderNo,
      action: editingOrderId ? "Update" : "Create",
      userId: "USR-004",
      userName: formMerchant,
      comments: `${editingOrderId ? "Updated" : "Created"} Confirm Order ${orderRecord.orderNo} (Job No: ${jobNoToSave}, Buyer: ${formBuyer}, ${orderRecord.orderQuantity.toLocaleString()} pcs, ${currencySymbol}${orderRecord.fobUnitPrice.toFixed(2)} ${formPriceType}). Status: ${formOrderStatus}`,
    });

    toast.success(
      `Confirm Order ${orderRecord.orderNo} ${editingOrderId ? "updated" : "saved"} successfully (${
        isDraft ? "Saved as Draft" : "Confirmed & Reconciled"
      })!`
    );
  };

  const handleDeleteOrder = (orderId: string, orderNo: string) => {
    if (confirm(`Are you sure you want to delete Order '${orderNo}'? This action cannot be undone.`)) {
      MMRepository.deleteOrder(orderId);
      setOrders(MMRepository.getOrders());
      if (editingOrderId === orderId) {
        setEditingOrderId(null);
        MMRepository.saveOrderEntryDraft(null);
        MMRepository.saveOrderEntryUiState({ activeTab: "register", editingOrderId: null });
        setActiveTab("register");
      }
      toast.success(`Order '${orderNo}' deleted successfully.`);
    }
  };

  // FOB Update Handler
  const handleFobUpdate = () => {
    if (!fobEditOrder) return;
    if (newFobValue <= 0) {
      toast.error("Please enter a valid FOB unit price.");
      return;
    }
    if (!fobChangeReason.trim()) {
      toast.error("Mandatory business reason is required to update FOB.");
      return;
    }

    const previousFob = fobEditOrder.fobUnitPrice;
    const updatedOrder: MMMainOrder = {
      ...fobEditOrder,
      fobUnitPrice: newFobValue,
      totalOrderValue: fobEditOrder.orderQuantity * newFobValue,
      fobAuditLog: [
        {
          timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
          user: "Rashidul Islam (Head of Merchandising)",
          previousFob: previousFob,
          newFob: newFobValue,
          reason: fobChangeReason.trim(),
        },
        ...fobEditOrder.fobAuditLog,
      ],
    };

    MMRepository.saveOrder(updatedOrder);
    setOrders(MMRepository.getOrders());
    MMRepository.addAuditLog({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      entityType: "MainOrder",
      entityId: fobEditOrder.orderNo,
      action: "FOB_Change",
      userId: "USR-004",
      userName: "Rashidul Islam (Head of Merchandising)",
      comments: `Updated FOB on ${fobEditOrder.orderNo} from $${previousFob.toFixed(2)} to $${newFobValue.toFixed(2)}. Reason: ${fobChangeReason.trim()}`,
    });

    setFobEditOrder(null);
    setFobChangeReason("");
    toast.success(`FOB updated from $${previousFob.toFixed(2)} to $${newFobValue.toFixed(2)} with audit entry.`);
  };

  // ==========================================================================
  // FABRIC ESTIMATION HANDLERS (PRIDESYS SYNERGY ERP SPECIFICATION)
  // ==========================================================================
  const handleOpenFabricEstimation = () => {
    const orderKey = formJobNo || formOurRef || editingOrderId || "JOB-2026-0001";
    const saved = MMRepository.getFabricEstimationByOrderId(orderKey);

    if (saved) {
      setFeEstimationId(saved.id);
      setFeFindQtn(saved.findQtn || "");
      setFeFindBudget(saved.findBudget || "");
      setFeFindOurRef(saved.ourRef || orderKey);
      setFeOrderDate(saved.orderDate || formConfirmDt || new Date().toISOString().slice(0, 10));
      setFeOurRef(saved.ourRef || orderKey);
      setFeBuyerRef(saved.buyerRef || "");
      setFeBuyer(saved.buyer || formBuyer || "H&M European Retail");
      setFeItemName(saved.itemName || formGmtItem || "Men's Basic Crew Neck T-Shirt");
      setFePackingType(saved.packingType || formPackType || "Flat Pack (1/1 Poly)");
      setFeLcBasis(saved.lcBasis || formPriceType || "FOB");
      setFeQuantity(saved.quantity || (totalPoQty > 0 ? totalPoQty : (formOrderQty || 20000)));
      setFeRate(saved.rate || (formUnitPrice > 0 ? formUnitPrice : 4.50));
      setFeUnit(saved.unit || "Pcs");
      setFePlace(saved.place || "Body & Trims");
      setFeNote(saved.note || formInstructionDetail || formNote || "");
      const allSavedBookings = MMRepository.getFabricBookings();
      const isGenuineBooking = Boolean(saved.bookingNo && allSavedBookings.some((b) => b.bookingNo === saved.bookingNo));
      setFeBookingNo(isGenuineBooking && saved.bookingNo ? saved.bookingNo : "");
      setFePiNo(saved.piNo || "");
      setFeBblcNo(saved.bblcNo || "");
      setFeFabricRows(saved.fabricRows && saved.fabricRows.length > 0 ? saved.fabricRows : []);
      setFeSelectedRowIndex(0);
    } else {
      setFeEstimationId(`fe-${Date.now()}`);
      setFeFindQtn("");
      setFeFindBudget("");
      setFeFindOurRef(orderKey);
      setFeOrderDate(formConfirmDt || new Date().toISOString().slice(0, 10));
      setFeOurRef(orderKey);
      setFeBuyerRef("");
      setFeBuyer(formBuyer || "H&M European Retail");
      setFeItemName(formGmtItem || "Men's Basic Crew Neck T-Shirt");
      setFePackingType(formPackType || "Flat Pack (1/1 Poly)");
      setFeLcBasis(formPriceType || "FOB");
      const orderQtyVal = totalPoQty > 0 ? totalPoQty : (formOrderQty > 0 ? formOrderQty : 20000);
      setFeQuantity(orderQtyVal);
      const rateVal = formUnitPrice > 0 ? formUnitPrice : 4.50;
      setFeRate(rateVal);
      setFeUnit("Pcs");
      setFePlace("Body & Trims");
      setFeNote(formInstructionDetail || formNote || "");
      setFeBookingNo("");
      setFePiNo("");
      setFeBblcNo("");

      const extractedColors: string[] = [];
      poDetails.forEach((p) => {
        p.breakdown?.colorBreakdowns?.forEach((c) => {
          if (c.color && !extractedColors.includes(c.color)) extractedColors.push(c.color);
        });
      });
      const orderColors = extractedColors.length > 0 ? extractedColors : ["Navy Blue", "Black", "Melange Grey"];

      const defaultRow1: MMFabricEstimationRow = {
        id: `fab-${Date.now()}-1`,
        inhouse: false,
        fabricNo: "FAB-001",
        usedPlace: "Shell",
        budgetItemName: "Single Jersey",
        code: "FAB-001",
        fabricDescription: "100% Cotton Single Jersey 160 GSM",
        sku: "Kg",
        sizeWiseConsumption: "Standard Yield",
        colorType: "DTM",
        colorMappings: orderColors.map((c, i) => ({ id: `cm-${i + 1}`, garmentsColor: c, itemColor: c })),
        width: '68/70"',
        marketUnit: "Kg",
        rate: 4.20,
        nomineeStatus: "Nominated",
        supplier: "Ha-Meem Textile Mills",
        supplierId: "sup-002",
        bookingRef: "",
        per: "Dzn",
        consum: 2.65,
        unit: "Kg",
        wPct: 6.0,
        consPerPc: 0.234,
        consPerDz: 2.809,
        costPerPc: 0.983,
        costPerDz: 11.798,
        orderQty: orderQtyVal,
        requireQty: Math.round(0.234 * orderQtyVal),
      };

      const defaultRow2: MMFabricEstimationRow = {
        id: `fab-${Date.now()}-2`,
        inhouse: false,
        fabricNo: "FAB-002",
        usedPlace: "Collar & Cuff",
        budgetItemName: "1x1 Rib",
        code: "FAB-003",
        fabricDescription: "95% Cotton 5% Spandex 1x1 Rib 240 GSM",
        sku: "Kg",
        sizeWiseConsumption: "Standard Yield",
        colorType: "DTM",
        colorMappings: orderColors.map((c, i) => ({ id: `cm-rib-${i + 1}`, garmentsColor: c, itemColor: c })),
        width: '36/38" Tubular',
        marketUnit: "Kg",
        rate: 4.60,
        nomineeStatus: "Nominated",
        supplier: "Square Textiles Ltd.",
        supplierId: "sup-004",
        bookingRef: "",
        per: "Dzn",
        consum: 0.35,
        unit: "Kg",
        wPct: 8.0,
        consPerPc: 0.0315,
        consPerDz: 0.378,
        costPerPc: 0.145,
        costPerDz: 1.739,
        orderQty: orderQtyVal,
        requireQty: Math.round(0.0315 * orderQtyVal),
      };

      setFeFabricRows([defaultRow1, defaultRow2]);
      setFeSelectedRowIndex(0);
    }
    setFeSourceType("job");
    setActiveTab("fabric-estimation");
    toast.info(`Opened Fabric Estimation for Order: ${orderKey}`);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const tabParam = sp.get("tab");
      const jobParam = sp.get("jobId") || sp.get("ref") || sp.get("orderId");
      if (tabParam === "fabric-estimation" || tabParam === "fabric") {
        if (jobParam) {
          handleSelectJobId(jobParam);
        } else {
          handleOpenFabricEstimation();
        }
      }
    }
  }, []);

  const handleSelectJobId = (selectedJobId: string) => {
    const doLoad = () => {
      const order = orders.find(
        (o) =>
          (o.jobNo && o.jobNo === selectedJobId) ||
          (o.ourRef && o.ourRef === selectedJobId) ||
          o.orderNo === selectedJobId
      );
      setFeFindOurRef(selectedJobId);
      setFeOurRef(selectedJobId);
      setFeSourceType("job");

      if (order) {
        setFeBuyer(order.buyerName || formBuyer || "");
        setFeItemName(order.garmentItem || formGmtItem || "");
        setFeQuantity(order.orderQuantity || 20000);
        if (order.fobUnitPrice) setFeRate(order.fobUnitPrice);
      }

      // Retrieve fabric estimation records previously saved against that job
      const saved = MMRepository.getFabricEstimationByOrderId(selectedJobId);
      if (saved && saved.fabricRows && saved.fabricRows.length > 0) {
        setFeEstimationId(saved.id);
        setFeFabricRows(saved.fabricRows);
        setFeSelectedRowIndex(0);
        const allSavedBookings = MMRepository.getFabricBookings();
        const isGenuineBooking = Boolean(saved.bookingNo && allSavedBookings.some((b) => b.bookingNo === saved.bookingNo));
        setFeBookingNo(isGenuineBooking && saved.bookingNo ? saved.bookingNo : "");
        if (saved.piNo) setFePiNo(saved.piNo);
        if (saved.bblcNo) setFeBblcNo(saved.bblcNo);
        toast.success(`Loaded ${saved.fabricRows.length} fabric estimation records for Job: ${selectedJobId}`);
      } else {
        // No saved records: show empty state, allow adding new records
        setFeFabricRows([]);
        setFeSelectedRowIndex(-1);
        toast.info(`No saved fabric estimation records found for Job ${selectedJobId}. You can now add new fabric items.`);
      }
      setShowFindOurRefModal(false);
    };

    if (feFabricRows.length > 0) {
      setConfirmOverwriteModal({
        open: true,
        message: `Loading Job ${selectedJobId} will update the grid to that job's saved fabric estimation records. Proceed?`,
        onConfirm: () => {
          setConfirmOverwriteModal({ open: false, message: "", onConfirm: () => {} });
          doLoad();
        },
      });
    } else {
      doLoad();
    }
  };

  const handleSelectPreCosting = (preCostId: string) => {
    const doLoad = () => {
      const preCostings = MMRepository.getPreCostings();
      const pc = preCostings.find((p) => p.preCostId === preCostId || p.id === preCostId);
      if (!pc) {
        toast.error(`Pre-Costing record ${preCostId} not found.`);
        return;
      }

      setFeFindBudget(pc.preCostId);
      setFeSourceType("pre-costing");
      if (pc.jobNo) {
        setFeOurRef(pc.jobNo);
        setFeFindOurRef(pc.jobNo);
      }
      if (pc.buyerName) setFeBuyer(pc.buyerName);
      if (pc.styleDescription || pc.styleNo) setFeItemName(pc.styleDescription || pc.styleNo);
      if (pc.orderQuantity) setFeQuantity(pc.orderQuantity);

      // Filter category === "Fabric"
      const fabricItems = pc.items.filter((item) => item.category === "Fabric");
      if (fabricItems.length === 0) {
        toast.warning(`No fabric items found in Pre-Costing ${pc.preCostId}. Current estimation data preserved.`);
        setShowFindBudgetModal(false);
        return;
      }

      const extractedColors: string[] = [];
      poDetails.forEach((p) => {
        p.breakdown?.colorBreakdowns?.forEach((c) => {
          if (c.color && !extractedColors.includes(c.color)) extractedColors.push(c.color);
        });
      });
      const orderColors = extractedColors.length > 0 ? extractedColors : ["Navy Blue", "Black", "Melange Grey"];

      const loadedRows: MMFabricEstimationRow[] = fabricItems.map((fi, idx) => {
        const orderQty = pc.orderQuantity || feQuantity || 20000;
        const consPerPc = fi.consumptionPerPc || 0.25;
        const wPct = fi.wastagePct || 5.0;
        const consPerDz = consPerPc * 12 * (1 + wPct / 100);
        const rate = fi.unitRate || 4.20;
        const finalConsPerPc = consPerPc * (1 + wPct / 100);
        const reqQty = Math.round(finalConsPerPc * orderQty);

        return {
          id: `fab-pc-${fi.preCostItemId}-${Date.now()}-${idx}`,
          inhouse: false, // Default unchecked per 6.1
          fabricNo: fi.itemCode || `FAB-${String(idx + 1).padStart(3, "0")}`,
          usedPlace: fi.bodyPartOrUsedPlace?.toLowerCase().includes("rib") || fi.bodyPartOrUsedPlace?.toLowerCase().includes("cuff") ? "Collar & Cuff" : "Shell",
          budgetItemName: fi.itemDescription || "Single Jersey",
          preCostItemId: fi.preCostItemId,
          code: fi.itemCode || `FAB-00${idx + 1}`,
          fabricDescription: fi.specification ? `${fi.itemDescription} (${fi.specification})` : fi.itemDescription,
          sku: fi.unit || "Kg", // SKU auto-population per Section 8
          colorType: "DTM",
          colorMappings: orderColors.map((c, i) => ({ id: `cm-pc-${idx}-${i + 1}`, garmentsColor: c, itemColor: c })),
          width: '68/70"',
          marketUnit: fi.unit || "Kg",
          rate: rate,
          nomineeStatus: fi.supplierNominee ? "Nominated" : "Open",
          supplier: fi.supplierNominee || "Pakiza Knitting & Dyeing",
          bookingRef: "",
          per: "Dzn",
          consum: Number((consPerPc * 12).toFixed(3)),
          unit: fi.unit || "Kg",
          wPct: wPct,
          consPerPc: Number(finalConsPerPc.toFixed(4)),
          consPerDz: Number(consPerDz.toFixed(3)),
          costPerPc: Number(((finalConsPerPc) * rate).toFixed(3)),
          costPerDz: Number((consPerDz * rate).toFixed(2)),
          orderQty: orderQty,
          requireQty: reqQty,
        };
      });

      setFeFabricRows(loadedRows);
      setFeSelectedRowIndex(0);
      toast.success(`Loaded ${loadedRows.length} fabric items from Pre-Costing ${pc.preCostId}`);
      setShowFindBudgetModal(false);
    };

    if (feFabricRows.length > 0) {
      setConfirmOverwriteModal({
        open: true,
        message: `Loading fabric items from Pre-Costing ${preCostId} will populate the grid with records from that Pre-Costing. Proceed?`,
        onConfirm: () => {
          setConfirmOverwriteModal({ open: false, message: "", onConfirm: () => {} });
          doLoad();
        },
      });
    } else {
      doLoad();
    }
  };

  const handleSelectFabricMaster = (fabric: MMFabricMasterItem) => {
    if (fabricMasterRowIndex === null) return;
    setFeFabricRows((prev) => {
      const updated = [...prev];
      if (!updated[fabricMasterRowIndex]) return prev;
      const row = { ...updated[fabricMasterRowIndex] };
      row.code = fabric.fabricCode;
      row.fabricCodeId = fabric.id;
      row.fabricDescription = fabric.fabricDescription;
      row.width = fabric.width;
      row.sku = fabric.unit; // SKU populated with fabric unit per Section 7.3 & 8
      row.marketUnit = fabric.unit;
      row.unit = fabric.unit;
      updated[fabricMasterRowIndex] = row;
      return updated;
    });
    setShowFabricMasterModal(false);
    toast.success(`Selected Fabric Master: ${fabric.fabricCode} — SKU updated to ${fabric.unit}`);
  };

  const handleSelectSupplier = (supplier: MMSupplierMasterItem) => {
    if (supplierRowIndex === null) return;
    setFeFabricRows((prev) => {
      const updated = [...prev];
      if (!updated[supplierRowIndex]) return prev;
      const row = { ...updated[supplierRowIndex] };
      row.supplier = supplier.supplierName;
      row.supplierId = supplier.id;
      updated[supplierRowIndex] = row;
      return updated;
    });
    setShowSupplierModal(false);
    toast.success(`Selected Supplier: ${supplier.supplierName}`);
  };

  const handleApplySingleColorP = () => {
    if (!modalSingleColor.trim()) {
      toast.warning("Please enter a Color Name before clicking 'P'.");
      return;
    }
    const colorName = modalSingleColor.trim();

    if (modalColorMappings.length === 0) {
      setModalColorMappings([
        {
          id: `cm-${Date.now()}-1`,
          garmentsColor: "All Garments",
          itemColor: colorName,
        },
      ]);
    } else {
      setModalColorMappings((prev) =>
        prev.map((cm) => ({
          ...cm,
          itemColor: colorName,
        }))
      );
    }
    toast.success(`Item Color populated with "${colorName}".`);
  };

  const handleOpenPreCostItemModal = (rowIndex: number) => {
    setPreCostItemRowIndex(rowIndex);
    setPreCostItemSearchQuery("");
    setShowPreCostItemModal(true);
  };

  const handleSelectPreCostItem = (fi: any) => {
    if (preCostItemRowIndex === null) return;
    setFeFabricRows((prev) => {
      const updated = [...prev];
      if (!updated[preCostItemRowIndex]) return prev;
      const row = { ...updated[preCostItemRowIndex] };
      row.budgetItemName = fi.itemDescription || fi.budgetItemName;
      row.preCostItemId = fi.preCostItemId;
      if (fi.bodyPartOrUsedPlace) {
        if (fi.bodyPartOrUsedPlace.toLowerCase().includes("rib") || fi.bodyPartOrUsedPlace.toLowerCase().includes("cuff")) {
          row.usedPlace = "Collar & Cuff";
        } else if (fi.bodyPartOrUsedPlace.toLowerCase().includes("shell")) {
          row.usedPlace = "Shell";
        } else if (fi.bodyPartOrUsedPlace.toLowerCase().includes("body")) {
          row.usedPlace = "Body";
        }
      }
      if (fi.unitRate && (!row.rate || row.rate === 0)) {
        row.rate = fi.unitRate;
      }
      if (fi.supplierNominee) {
        row.supplier = fi.supplierNominee;
        const suppMatch = INITIAL_MM_SUPPLIERS_MASTER.find(
          (s) => s.supplierName.toLowerCase() === fi.supplierNominee.toLowerCase()
        );
        if (suppMatch) {
          row.supplierId = suppMatch.id;
        }
      }
      updated[preCostItemRowIndex] = row;
      return updated;
    });
    setShowPreCostItemModal(false);
    toast.success(`Selected Pre-Costing Item: ${fi.itemDescription}`);
  };

  const handleOpenBookingForRow = (row: MMFabricEstimationRow, rowIndex: number) => {
    // 1. Persist current Fabric Estimation to maintain relationships and unsaved work
    const orderKey = feOurRef || formJobNo || editingOrderId || "JOB-2026-0001";
    const estimationRecord: MMFabricEstimationRecord = {
      id: feEstimationId || `fe-${Date.now()}`,
      orderId: editingOrderId || formJobNo || orderKey,
      jobNo: formJobNo || orderKey,
      ourRef: feOurRef || formJobNo || orderKey,
      buyer: feBuyer || formBuyer || "H&M European Retail",
      buyerRef: feBuyerRef || "",
      style: formStyle || "HM-KT-8841",
      itemName: feItemName || formGmtItem || "Men's Basic Crew Neck T-Shirt",
      packingType: fePackingType || formPackType || "Flat Pack (1/1 Poly)",
      lcBasis: feLcBasis || formPriceType || "FOB",
      quantity: feQuantity || (totalPoQty > 0 ? totalPoQty : formOrderQty || 20000),
      rate: feRate || formUnitPrice || 4.50,
      unit: feUnit || "Pcs",
      place: fePlace || "Body & Trims",
      note: feNote || formInstructionDetail || formNote || "",
      orderDate: feOrderDate || formConfirmDt || new Date().toISOString().slice(0, 10),
      findQtn: feFindQtn,
      findBudget: feFindBudget,
      fabricRows: feFabricRows,
      bookingNo: feBookingNo,
      piNo: fePiNo,
      bblcNo: feBblcNo,
      savedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MMRepository.saveFabricEstimation(estimationRecord);

    // 2. Package all relevant estimation and order data for Fabric Booking form
    const suppMatch = INITIAL_MM_SUPPLIERS_MASTER.find(
      (s) =>
        (row.supplierId && s.id === row.supplierId) ||
        (row.supplier && s.supplierName.toLowerCase() === row.supplier.toLowerCase())
    );
    const finalSupplierId = row.supplierId || suppMatch?.id || "sup-001";
    const finalSupplierName = row.supplier || suppMatch?.supplierName || "Pakiza Knitting & Dyeing";

    const transferPayload = {
      jobId: orderKey,
      orderId: editingOrderId || formJobNo || "ord-001",
      buyer: feBuyer || formBuyer || "H&M European Retail",
      style: formStyle || "HM-KT-8841",
      preCostId: feFindBudget || formPreCostId || "",
      preCostItemId: row.preCostItemId || "",
      fabricEstimationId: estimationRecord.id,
      fabricEstimationItemId: row.id,
      fabricCode: row.code || row.fabricNo || "FAB-001",
      fabricCodeId: row.fabricCodeId || "",
      fabricDescription: row.fabricDescription,
      width: row.width,
      usedPlace: row.usedPlace,
      fabricColor: row.singleColorName || (row.colorMappings && row.colorMappings[0]?.itemColor) || "Solid DTM",
      requiredQuantity: row.requireQty || 0,
      unit: row.unit || row.sku || "Kg",
      rate: row.rate || 0,
      estimatedFabricValue: (row.requireQty || 0) * (row.rate || 0),
      supplier: finalSupplierName,
      supplierId: finalSupplierId,
      orderQuantity: feQuantity || formOrderQty || 20000,
      colorMappings: row.colorMappings || [],
      poDetails: poDetails.map((p) => ({
        id: p.id,
        poNumber: p.poNumber,
        qty: p.qty,
        lot: p.lot,
        delDate: p.delDate,
        destCountry: p.destCountry,
        colorBreakdowns: p.breakdown?.colorBreakdowns || [],
      })),
      consum: row.consum || 0,
      wPct: row.wPct || 0,
      per: row.per || "Dzn",
    };

    try {
      localStorage.setItem("cripton_mm_fabric_booking_transfer_v1", JSON.stringify(transferPayload));
      sessionStorage.setItem("cripton_mm_fabric_booking_transfer_v1", JSON.stringify(transferPayload));
    } catch (e) {
      console.error("Storage error:", e);
    }

    toast.success(`Opening Fabric Booking for ${row.budgetItemName} (${row.code})...`);
    navigate({
      to: "/mm-fabric-booking",
      search: {
        source: "estimation",
        jobId: orderKey,
        rowId: row.id,
      } as any,
    });
  };

  const handleOpenAccessoriesEstimation = () => {
    const orderKey = formJobNo || formOurRef || editingOrderId || (orders.length > 0 ? orders[0].jobNo : "JOB-2026-0001");
    toast.info(`Opening Accessories Estimation (GR_1308) for ${orderKey}...`);
    navigate({
      to: "/mm-accessories-estimation",
      search: {
        orderId: orderKey,
      } as any,
    });
  };

  const handleSubmitFabricEstimation = () => {
    // 1. Validate Job ID
    if (!feOurRef && !formJobNo) {
      toast.error("Validation Error: Job ID is required to submit fabric estimation.");
      return;
    }

    // 2. Validate at least one fabric row
    if (feFabricRows.length === 0) {
      toast.error("Validation Error: Please add at least one fabric item in the Fabric Details Info grid.");
      return;
    }

    // 3. Validate each fabric row
    for (let i = 0; i < feFabricRows.length; i++) {
      const r = feFabricRows[i];
      const rowNum = i + 1;

      if (!r.budgetItemName || !r.budgetItemName.trim()) {
        toast.error(`Row ${rowNum}: Pre Costing Item is required.`);
        setFeSelectedRowIndex(i);
        return;
      }

      if (!r.code || !r.code.trim()) {
        toast.error(`Row ${rowNum}: Fabric Code is required. Click the Fabric Code field to select from Fabric Master.`);
        setFeSelectedRowIndex(i);
        return;
      }

      if (!r.fabricDescription || !r.fabricDescription.trim()) {
        toast.error(`Row ${rowNum}: Fabric Description is required.`);
        setFeSelectedRowIndex(i);
        return;
      }

      if (!r.supplier || !r.supplier.trim()) {
        toast.error(`Row ${rowNum}: Supplier selection is required. Click the Supplier field to select a nominated supplier.`);
        setFeSelectedRowIndex(i);
        return;
      }

      if (!r.consum || r.consum <= 0) {
        toast.error(`Row ${rowNum}: Base Consumption must be greater than zero.`);
        setFeSelectedRowIndex(i);
        return;
      }

      if (!r.rate || r.rate <= 0) {
        toast.error(`Row ${rowNum}: Rate ($) must be greater than zero.`);
        setFeSelectedRowIndex(i);
        return;
      }

      if (r.colorMappings && r.colorMappings.length > 0) {
        for (let cIdx = 0; cIdx < r.colorMappings.length; cIdx++) {
          const cm = r.colorMappings[cIdx];
          if (!cm.itemColor || !cm.itemColor.trim()) {
            toast.error(`Row ${rowNum}: Item Color mapping #${cIdx + 1} is empty. Open Color entry to specify.`);
            setFeSelectedRowIndex(i);
            return;
          }
        }
      }
    }

    const orderKey = feOurRef || formJobNo || editingOrderId || "JOB-2026-0001";
    const allSavedBookings = MMRepository.getFabricBookings();
    const isGenuineBooking = Boolean(feBookingNo && allSavedBookings.some((b) => b.bookingNo === feBookingNo));
    const validBookingNos = new Set(allSavedBookings.map((b) => b.bookingNo).filter(Boolean));

    const sanitizedRows = feFabricRows.map((r) => ({
      ...r,
      bookingRef: r.bookingRef && validBookingNos.has(r.bookingRef) ? r.bookingRef : "",
    }));

    const estRecord: MMFabricEstimationRecord = {
      id: feEstimationId || `fe-${Date.now()}`,
      orderId: editingOrderId || orderKey,
      jobNo: orderKey,
      ourRef: orderKey,
      buyer: feBuyer,
      buyerRef: feBuyerRef,
      style: formStyle || "Crew Neck T-Shirt",
      itemName: feItemName,
      packingType: fePackingType,
      lcBasis: feLcBasis,
      quantity: feQuantity,
      rate: feRate,
      unit: feUnit,
      place: fePlace,
      note: feNote,
      orderDate: feOrderDate,
      findBudget: feFindBudget,
      preCostId: feFindBudget,
      bookingNo: isGenuineBooking ? feBookingNo : "",
      piNo: fePiNo,
      bblcNo: feBblcNo,
      sourceType: feSourceType,
      fabricRows: sanitizedRows,
      savedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    MMRepository.saveFabricEstimation(estRecord);

    // Update parent order entry's Fabric Requirement Details summary
    const summaryLines = feFabricRows.map(
      (r) => `${r.code} - ${r.budgetItemName} (${r.usedPlace}): Req ${r.requireQty.toLocaleString()} ${r.unit}`
    );
    setFormFabricReq(summaryLines.join(" | "));

    toast.success(`Fabric Estimation submitted and persisted successfully for Job ID: ${orderKey}!`);
  };

  const handleSaveFabricEstimation = () => {
    handleSubmitFabricEstimation();
  };

  const handleBackFromFabricEstimation = () => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get("from") === "register" || sp.get("source") === "register") {
        navigate({ to: "/mm-fabric-estimation-register" });
        return;
      }
    }
    setActiveTab("entry");
    toast.info("Returned to Order Entry. All unsaved and saved order data preserved.");
  };

  const updateFabricRowField = <K extends keyof MMFabricEstimationRow>(
    rowIndex: number,
    field: K,
    value: MMFabricEstimationRow[K]
  ) => {
    setFeFabricRows((prev) => {
      const updated = [...prev];
      if (!updated[rowIndex]) return prev;
      const row = { ...updated[rowIndex], [field]: value };

      const per = row.per || "Dzn";
      const consum = Number(row.consum) || 0;
      const wPct = Number(row.wPct) || 0;
      const rate = Number(row.rate) || 0;
      const orderQty = Number(row.orderQty) || feQuantity || 20000;

      let consPerPc = 0;
      let consPerDz = 0;
      if (per === "Dzn") {
        consPerDz = consum * (1 + wPct / 100);
        consPerPc = consPerDz / 12;
      } else {
        consPerPc = consum * (1 + wPct / 100);
        consPerDz = consPerPc * 12;
      }
      row.consPerPc = Number(consPerPc.toFixed(4));
      row.consPerDz = Number(consPerDz.toFixed(3));
      row.costPerPc = Number((row.consPerPc * rate).toFixed(3));
      row.costPerDz = Number((row.consPerDz * rate).toFixed(2));
      row.requireQty = Math.round(row.consPerPc * orderQty);

      updated[rowIndex] = row;
      return updated;
    });
  };

  const handleAddFabricRow = () => {
    const nextIdx = feFabricRows.length + 1;
    const padNum = String(nextIdx).padStart(3, "0");
    const extractedColors: string[] = [];
    poDetails.forEach((p) => {
      p.breakdown?.colorBreakdowns?.forEach((c) => {
        if (c.color && !extractedColors.includes(c.color)) extractedColors.push(c.color);
      });
    });
    const orderColors = extractedColors.length > 0 ? extractedColors : ["Navy Blue", "Black", "Melange Grey"];

    const newRow: MMFabricEstimationRow = {
      id: `fab-${Date.now()}-${nextIdx}`,
      inhouse: false, // Default unchecked per Section 6.1
      fabricNo: `FAB-${padNum}`,
      usedPlace: "Shell", // Replaced Trim with Shell per Section 6.3
      budgetItemName: "Single Jersey",
      code: `FAB-001`,
      fabricDescription: "100% Cotton Single Jersey 160 GSM",
      sku: "Kg", // Auto-populated per Section 8
      sizeWiseConsumption: "Standard Yield",
      colorType: "DTM",
      colorMappings: orderColors.map((c, i) => ({ id: `cm-new-${i + 1}`, garmentsColor: c, itemColor: c })),
      width: '68/70"',
      marketUnit: "Kg",
      rate: 4.20,
      nomineeStatus: "Nominated",
      supplier: "Ha-Meem Textile Mills",
      supplierId: "sup-002",
      bookingRef: "",
      per: "Dzn",
      consum: 2.50,
      unit: "Kg",
      wPct: 5.0,
      consPerPc: 0.2188,
      consPerDz: 2.625,
      costPerPc: 0.919,
      costPerDz: 11.025,
      orderQty: feQuantity || 20000,
      requireQty: Math.round(0.2188 * (feQuantity || 20000)),
    };

    setFeFabricRows((prev) => [...prev, newRow]);
    setFeSelectedRowIndex(feFabricRows.length);
    toast.success(`Added new fabric row`);
  };

  const handleDeleteFabricRow = (idx: number) => {
    if (feFabricRows.length <= 1) {
      toast.error("At least one fabric specification row must be retained.");
      return;
    }
    const removedRow = feFabricRows[idx];
    setFeFabricRows((prev) => prev.filter((_, i) => i !== idx));
    setFeSelectedRowIndex((prev) => (prev >= idx && prev > 0 ? prev - 1 : 0));
    toast.info(`Removed fabric row: ${removedRow.budgetItemName || removedRow.code}`);
  };

  const handleOpenColorEntry = (rowIndex: number) => {
    const row = feFabricRows[rowIndex];
    if (!row) return;
    setColorEntryRowIndex(rowIndex);
    setModalColorMappings(row.colorMappings && row.colorMappings.length > 0 ? JSON.parse(JSON.stringify(row.colorMappings)) : []);
    setModalColorType(row.colorType || "DTM");
    setModalSingleColor(row.singleColorName || (row.colorMappings?.[0]?.itemColor || ""));
    setShowColorEntryModal(true);
  };

  const handleAddColorMappingRow = () => {
    setModalColorMappings((prev) => [
      ...prev,
      {
        id: `cm-${Date.now()}-${prev.length + 1}`,
        garmentsColor: "Navy Blue",
        itemColor: "Navy Blue",
      },
    ]);
  };

  const handleRemoveColorMappingRow = (idx: number) => {
    setModalColorMappings((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveColorMappings = () => {
    if (colorEntryRowIndex === null) return;
    setFeFabricRows((prev) => {
      const updated = [...prev];
      if (updated[colorEntryRowIndex]) {
        updated[colorEntryRowIndex] = {
          ...updated[colorEntryRowIndex],
          colorType: modalColorType,
          singleColorName: modalColorType === "Single Color" ? modalSingleColor : undefined,
          colorMappings: modalColorMappings,
        };
      }
      return updated;
    });
    setShowColorEntryModal(false);
    toast.success(`Color mapping updated for ${feFabricRows[colorEntryRowIndex]?.budgetItemName || "Fabric Row"}`);
  };

  const handleImportColorsFromPO = () => {
    const extractedColors: string[] = [];
    poDetails.forEach((p) => {
      p.breakdown?.colorBreakdowns?.forEach((c) => {
        if (c.color && !extractedColors.includes(c.color)) extractedColors.push(c.color);
      });
    });
    const orderColors = extractedColors.length > 0 ? extractedColors : AVAILABLE_GARMENT_COLORS.slice(0, 4);
    setModalColorMappings(
      orderColors.map((c, i) => ({
        id: `cm-imp-${i + 1}`,
        garmentsColor: c,
        itemColor: c,
      }))
    );
    toast.success(`Imported ${orderColors.length} color(s) from order breakdowns.`);
  };

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-order-entry"
      breadcrumbs={
        activeTab === "fabric-estimation"
          ? [
              { label: "Marketing & Merchandising" },
              { label: "New Confirm Order", to: "/mm-order-entry" },
              { label: "Fabric Estimation" },
            ]
          : [{ label: "Marketing & Merchandising" }, { label: "New Confirm Order" }]
      }
      title={activeTab === "fabric-estimation" ? "Fabric Estimation" : "New Confirm Order"}
      subtitle={
        activeTab === "fabric-estimation"
          ? undefined
          : "Enterprise Order Confirmation, PO particulars, and PO-wise Size & Color-wise Quantity Breakdown."
      }
      actions={
        <div className="flex items-center gap-2">
          {activeTab === "fabric-estimation" ? (
            <>
              <button
                type="button"
                onClick={handleBackFromFabricEstimation}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-teal-600" />
                <span>Back to Order Entry</span>
              </button>
              <button
                type="button"
                onClick={handleSaveFabricEstimation}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-sm flex items-center gap-1.5 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Estimation</span>
              </button>
            </>
          ) : (
            <>
              {/* Main Tab Controls */}
              <button
                onClick={() => {
                  setActiveTab("register");
                  setEditingOrderId(null);
                  MMRepository.saveOrderEntryUiState({ activeTab: "register", editingOrderId: null });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "register"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                }`}
              >
                Order Register
              </button>
              <button
                onClick={() => {
                  handleStartNewOrder();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "entry" && !editingOrderId
                    ? "bg-teal-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Confirm Order</span>
              </button>
            </>
          )}
        </div>
      }
    >
      <div className="space-y-5">
        {/* ================================================================== */}
        {/* TAB 1: ORDER REGISTER (TABLE OF SAVED ORDERS)                      */}
        {/* ================================================================== */}
        {activeTab === "register" && (
          <div className="space-y-4">
            {/* Searchable Filters Section Above Register */}
            <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Filter Orders
                  </span>
                  {activeFilterCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                      {activeFilterCount} active
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Filters</span>
                    </button>
                  )}
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-500 font-semibold">Orders:</span>
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                      {filteredOrders.length} of {orders.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Searchable Dropdown Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <SearchableDropdownFilter
                  label="Buyer"
                  value={filterBuyer}
                  options={availableBuyers}
                  onChange={setFilterBuyer}
                  placeholder="Select Buyer..."
                  icon={Building2}
                />
                <SearchableDropdownFilter
                  label="Style"
                  value={filterStyle}
                  options={availableStyles}
                  onChange={setFilterStyle}
                  placeholder="Select Style..."
                  icon={Scissors}
                />
                <SearchableDropdownFilter
                  label="Job ID"
                  value={filterJobId}
                  options={availableJobIds}
                  onChange={setFilterJobId}
                  placeholder="Select Job ID..."
                  icon={FileText}
                />
                <SearchableDropdownFilter
                  label="Merchant"
                  value={filterMerchant}
                  options={availableMerchants}
                  onChange={setFilterMerchant}
                  placeholder="Select Merchant..."
                  icon={User}
                />
              </div>

              {/* Keyword Search Input */}
              <div className="relative pt-1">
                <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by keywords (Order No, Style, Buyer, Job ID, or Our Ref)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Register Table */}
            <div className="rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-3">Job ID</th>
                      <th className="py-3 px-3">Buyer & Dept</th>
                      <th className="py-3 px-3">Style / Item</th>
                      <th className="py-3 px-3 text-right">Order Qty</th>
                      <th className="py-3 px-3 text-right">Unit Price</th>
                      <th className="py-3 px-3 text-right">Total Value</th>
                      <th className="py-3 px-3">Del DT</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {paginatedOrders.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center">
                          <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                            <AlertTriangle className="w-8 h-8 text-amber-500" />
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                              No orders found matching the selected filters.
                            </p>
                            <p className="text-xs text-slate-400">
                              Try clearing or adjusting your filter criteria to view orders.
                            </p>
                            {hasActiveFilters && (
                              <button
                                type="button"
                                onClick={handleResetFilters}
                                className="mt-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Reset All Filters</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-teal-600 dark:text-teal-400">
                            {getOrderJobId(o)}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-semibold block">{o.buyerName}</span>
                            <span className="text-[10px] text-slate-400">{o.buyerDepartment}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-semibold block">{o.styleNo}</span>
                            <span className="text-[10px] text-slate-400">{o.garmentItem}</span>
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold">
                            {o.orderQuantity.toLocaleString()} pcs
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">
                            ${o.fobUnitPrice.toFixed(2)}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                            ${(o.totalOrderValue || o.orderQuantity * o.fobUnitPrice).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px]">{o.delDate || o.shipmentDate}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                o.orderStatus === "Open" || (o.orderStatus as string) === "Confirmed"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                  : o.orderStatus === "Draft"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                  : "bg-slate-200 text-slate-700"
                              }`}
                            >
                              {o.orderStatus}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedReportOrder(o);
                                  setShowReportModal(true);
                                }}
                                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600"
                                title="Print / Export Report"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEditOrder(o)}
                                className="px-2 py-1 rounded bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-bold text-[11px] flex items-center gap-1 border border-teal-200 dark:border-teal-800 cursor-pointer"
                              >
                                <Edit className="w-3 h-3" /> Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteOrder(o.id, o.orderNo)}
                                className="p-1 rounded hover:bg-rose-50 text-rose-500 hover:text-rose-700"
                                title="Delete Order"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination */}
              {filteredOrders.length > 0 && (
                <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-slate-500">
                    Showing{" "}
                    <strong className="font-semibold text-slate-700 dark:text-slate-200">
                      {(registerPage - 1) * registerPageSize + 1}
                    </strong>{" "}
                    to{" "}
                    <strong className="font-semibold text-slate-700 dark:text-slate-200">
                      {Math.min(registerPage * registerPageSize, filteredOrders.length)}
                    </strong>{" "}
                    of{" "}
                    <strong className="font-semibold text-slate-700 dark:text-slate-200">
                      {filteredOrders.length}
                    </strong>{" "}
                    orders
                  </span>
                  {totalRegisterPages > 1 && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setRegisterPage((p) => Math.max(1, p - 1))}
                        disabled={registerPage === 1}
                        className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 font-semibold cursor-pointer"
                      >
                        Previous
                      </button>
                      <span className="px-2 font-mono font-semibold text-slate-600 dark:text-slate-400">
                        {registerPage} / {totalRegisterPages}
                      </span>
                      <button
                        type="button"
                        onClick={() => setRegisterPage((p) => Math.min(totalRegisterPages, p + 1))}
                        disabled={registerPage === totalRegisterPages}
                        className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 font-semibold cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 2: MAIN ORDER ENTRY FORM (PARTS B, C, D)                       */}
        {/* ================================================================== */}
        {activeTab === "entry" && (
          <div className="space-y-6 pb-12 overflow-y-auto">
            {/* Form Top Title and Actions (Replaces previous reconciliation banner) */}
            <div className="p-3.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-600 border border-teal-200 dark:border-teal-800">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{editingOrderId ? `Edit Confirm Order: ${orders.find((o) => o.id === editingOrderId)?.orderNo || ""}` : "New Confirm Order"}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                      {entryMode}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Marketing & Merchandising — Enterprise Order Confirmation, Commercials & PO Particulars
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveMainOrder(true)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 shadow-sm transition-all"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveMainOrder(false)}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Confirm Order Entry</span>
                </button>
              </div>
            </div>

            {/* ────────────────────────────────────────────────────────────── */}
            {/* SECTION 1: ORDER TYPE AND REFERENCE INFORMATION               */}
            {/* ────────────────────────────────────────────────────────────── */}
            <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                  ORDER TYPE AND REFERENCE INFORMATION
                </h3>
              </div>

              {/* Requirement 1.1: Pre Costing Ref. beside radio group on the same line */}
              <div className="flex flex-wrap items-center gap-4 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center gap-3">
                  <label className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                    Order Mode:
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-800 dark:text-slate-200 text-xs">
                    <input
                      type="radio"
                      name="orderEntryMode"
                      checked={entryMode === "New Order"}
                      onChange={handleSelectNewOrder}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span>New Order</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-800 dark:text-slate-200 text-xs">
                    <input
                      type="radio"
                      name="orderEntryMode"
                      checked={entryMode === "Pre Costing Ref."}
                      onChange={handleSelectPreCostingRef}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span>Pre Costing Ref.</span>
                  </label>
                </div>

                {/* Compact Pre Costing Ref. Input immediately beside on the same line */}
                {entryMode === "Pre Costing Ref." && (
                  <div className="flex items-center gap-2 flex-1 max-w-sm">
                    <label className="font-bold text-slate-700 dark:text-slate-300 text-xs shrink-0">
                      Pre Costing Ref. *
                    </label>
                    <div className="flex items-center gap-1 flex-1">
                      <input
                        type="text"
                        readOnly
                        placeholder="Click Search..."
                        value={formPreCostId ? `${formPreCostId} (${formStyle})` : ""}
                        onClick={() => setShowPreCostingModal(true)}
                        className="w-full p-1.5 rounded border border-teal-300 dark:border-teal-700 bg-teal-50/50 dark:bg-teal-950/30 text-xs font-mono font-bold text-teal-800 dark:text-teal-300 cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPreCostingModal(true)}
                        className="px-2.5 py-1.5 rounded bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1 shrink-0 shadow-sm"
                        title="Search and select Pre-Costing"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>Search</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Requirement 1.2: Display Three Fields on One Line: Job No.*, Order Type*, Order Status* */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* 1. Job No. * (Read-only when Pre Costing Ref. is selected per Section 7) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700 dark:text-slate-300">
                      Job No. *
                    </label>
                    {entryMode === "Pre Costing Ref." && (
                      <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800/60">
                        <Lock className="w-2.5 h-2.5" /> Read-only (Pre Costing)
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={formJobNo}
                    readOnly={entryMode === "Pre Costing Ref."}
                    onChange={(e) => {
                      if (entryMode !== "Pre Costing Ref.") {
                        setFormJobNo(e.target.value);
                        setFormOurRef(e.target.value);
                      }
                    }}
                    title={
                      entryMode === "Pre Costing Ref."
                        ? "Job No. is read-only and automatically populated from the selected Pre-Costing record."
                        : "Enter or generate unique Job No."
                    }
                    className={`w-full p-1.5 rounded border font-mono font-bold text-xs ${
                      entryMode === "Pre Costing Ref."
                        ? "bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 cursor-not-allowed select-none"
                        : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-teal-700 dark:text-teal-400"
                    }`}
                    required
                  />
                </div>

                {/* 2. Order Type * */}
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                    Order Type *
                  </label>
                  <select
                    value={formOrderType}
                    onChange={(e) => setFormOrderType(e.target.value)}
                    className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-xs"
                  >
                    <option value="Regular">Regular</option>
                    <option value="Sample">Sample</option>
                    <option value="Repeat">Repeat</option>
                  </select>
                </div>

                {/* 3. Order Status * */}
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                    Order Status *
                  </label>
                  <select
                    value={formOrderStatus}
                    onChange={(e) => setFormOrderStatus(e.target.value)}
                    className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-xs"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ────────────────────────────────────────────────────────────── */}
            {/* SECTION 2: COMPANY AND BUYER INFORMATION                       */}
            {/* ────────────────────────────────────────────────────────────── */}
            <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                COMPANY AND BUYER INFORMATION
              </h3>

              {/* Requirement 2.1: Six Fields in One Row on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 text-xs">
                {/* 1. Beneficiary Company */}
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300 truncate" title="Beneficiary Company">
                    Beneficiary Company *
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formBeneficiaryCompany}
                    className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold text-xs cursor-not-allowed truncate"
                    title="Beneficiary Company is fixed based on user/company context"
                  />
                </div>

                {/* 2. Buyer */}
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Buyer *</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      readOnly
                      value={formBuyer}
                      onClick={() => setShowBuyerModal(true)}
                      className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-xs text-teal-700 dark:text-teal-400 cursor-pointer truncate"
                    />
                    <button
                      type="button"
                      onClick={() => setShowBuyerModal(true)}
                      className="px-2 py-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 shrink-0"
                      title="Select Buyer from Master Table"
                    >
                      <Search className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 3. Buyer Dept */}
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Buyer Dept. *</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      readOnly
                      value={formBuyerDept}
                      onClick={() => setShowBuyerDeptModal(true)}
                      className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs cursor-pointer truncate"
                    />
                    <button
                      type="button"
                      onClick={() => setShowBuyerDeptModal(true)}
                      className="px-2 py-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 shrink-0"
                      title="Select Department for Buyer"
                    >
                      <Search className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 4. Merchant (Requirement 2.3: Selectable List / Modal) */}
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Merchant *</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      readOnly
                      value={formMerchant}
                      onClick={() => setShowMerchantModal(true)}
                      className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold cursor-pointer truncate"
                      title="Click to select Merchant from list"
                    />
                    <button
                      type="button"
                      onClick={() => setShowMerchantModal(true)}
                      className="px-2 py-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 shrink-0"
                      title="Select Merchant from Master List"
                    >
                      <Search className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 5. Season */}
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Season *</label>
                  <select
                    value={formSeason}
                    onChange={(e) => setFormSeason(e.target.value)}
                    className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs truncate"
                  >
                    <option value="Autumn / Winter 2026">Autumn / Winter 2026</option>
                    <option value="Spring / Summer 2027">Spring / Summer 2027</option>
                    <option value="Winter 2027">Winter 2027</option>
                    <option value="Summer 2026">Summer 2026</option>
                  </select>
                </div>

                {/* 6. A/C Holder */}
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">A/C Holder *</label>
                  <input
                    type="text"
                    readOnly
                    value={formAcHolder}
                    className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs truncate"
                    title="Auto-populated according to selected Buyer"
                  />
                </div>
              </div>
            </div>

            {/* ────────────────────────────────────────────────────────────── */}
            {/* THREE MAIN SECTIONS SIDE BY SIDE (Requirement 6)               */}
            {/* 1. Style & Garment Info | 2. Commercial Info | 3. Process Seq  */}
            {/* ────────────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
              {/* Left Column: STYLE AND GARMENT INFORMATION (Requirement 3.1) */}
              <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                    STYLE AND GARMENT INFORMATION
                  </h3>

                  {/* Vertical Single Column Layout */}
                  <div className="space-y-3 pt-2 text-xs">
                    {/* 1. Style * */}
                    <div>
                      <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Style *</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={formStyle}
                          onChange={(e) => setFormStyle(e.target.value)}
                          className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-xs"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowStyleModal(true)}
                          className="px-2 py-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 shrink-0"
                          title="Select Style from Buyer Catalog"
                        >
                          <Search className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* 2. GMT Item * */}
                    <div>
                      <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">GMT Item *</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={formGmtItem}
                          onChange={(e) => setFormGmtItem(e.target.value)}
                          className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                        />
                        <button
                          type="button"
                          onClick={() => setShowGmtItemModal(true)}
                          className="px-2 py-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 shrink-0"
                          title="Select GMT Item"
                        >
                          <Search className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* 3. Place * */}
                    <div>
                      <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Place *</label>
                      <select
                        value={formPlace}
                        onChange={(e) => setFormPlace(e.target.value as any)}
                        className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      >
                        <option value="Top">Top</option>
                        <option value="Bottom">Bottom</option>
                        <option value="Top&Bottom">Top&Bottom</option>
                      </select>
                    </div>

                    {/* 4. Pack Type * */}
                    <div>
                      <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Pack Type *</label>
                      <select
                        value={formPackType}
                        onChange={(e) => setFormPackType(e.target.value)}
                        className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      >
                        <option value="Single Poly Pack">Single Poly Pack</option>
                        <option value="Flat Pack">Flat Pack</option>
                        <option value="Blister Pack">Blister Pack</option>
                        <option value="Ratio Pack 1:2:2:1">Ratio Pack 1:2:2:1</option>
                        <option value="Hanger Pack">Hanger Pack</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Column: COMMERCIAL INFORMATION (Requirement 4.1) */}
              <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    COMMERCIAL INFORMATION
                  </h3>

                  {/* Vertical Single Column Layout */}
                  <div className="space-y-3 pt-2 text-xs">
                    {/* 1. Unit Price ($) * */}
                    <div>
                      <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                        Unit Price ({currencySymbol}) *
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.01"
                          value={formUnitPrice}
                          onChange={(e) => setFormUnitPrice(parseFloat(e.target.value) || 0)}
                          className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-emerald-600 text-xs"
                          required
                        />
                        <select
                          value={formPriceType}
                          onChange={(e) => setFormPriceType(e.target.value)}
                          className="p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs shrink-0"
                          title="Price Type"
                        >
                          <option value="FOB">FOB</option>
                          <option value="CIF">CIF</option>
                          <option value="CFR">CFR</option>
                          <option value="Ex-Factory">Ex-Factory</option>
                        </select>
                      </div>
                    </div>

                    {/* 2. Currency * */}
                    <div>
                      <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Currency *</label>
                      <select
                        value={formCurrency}
                        onChange={(e) => setFormCurrency(e.target.value)}
                        className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-xs text-teal-700 dark:text-teal-400"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="BDT">BDT (৳)</option>
                      </select>
                    </div>

                    {/* 3. Pay Term * */}
                    <div>
                      <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Pay Term *</label>
                      <select
                        value={formPayTerm}
                        onChange={(e) => setFormPayTerm(e.target.value)}
                        className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                      >
                        <option value="LC at Sight">LC at Sight</option>
                        <option value="TT 30 Days">TT 30 Days</option>
                        <option value="Deferred LC 60 Days">Deferred LC 60 Days</option>
                        <option value="CAD">CAD</option>
                        <option value="Irrevocable LC 90 Days">Irrevocable LC 90 Days</option>
                      </select>
                    </div>

                    {/* 4. CM ($) * */}
                    <div>
                      <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                        CM ({currencySymbol}) *
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.01"
                          value={formCm}
                          onChange={(e) => setFormCm(parseFloat(e.target.value) || 0)}
                          className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs"
                        />
                        <select
                          value={formCmUnit}
                          onChange={(e) => setFormCmUnit(e.target.value as any)}
                          className="p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs shrink-0"
                          title="Costing Unit"
                        >
                          <option value="PCS">PCS</option>
                          <option value="DZ">DZ</option>
                        </select>
                      </div>
                    </div>

                    {/* 5. Order Value (Read-only, derived from associated PO records) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300">
                          Order Value ({currencySymbol})
                        </label>
                        <span className="text-[10px] font-semibold text-slate-400">Sum of PO Values</span>
                      </div>
                      <input
                        type="text"
                        readOnly
                        value={`${currencySymbol}${orderValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        className="w-full p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 font-mono font-bold text-slate-900 dark:text-white text-xs cursor-not-allowed select-all"
                        title="Non-editable. Automatically calculated as Sum of all PO Values (PO Qty × PO Unit Rate)"
                      />
                    </div>
                  </div>
                </div>

                {/* Total Order Value Calculation Display */}
                <div className="mt-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-600 dark:text-slate-400 font-semibold block">Order Value (From POs):</span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {poDetails.length} PO{poDetails.length === 1 ? "" : "s"} ({totalPoQty.toLocaleString()} pcs)
                    </span>
                  </div>
                  <span className="font-mono font-extrabold text-sm text-teal-700 dark:text-teal-400">
                    {currencySymbol}
                    {orderValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Right Column: MANUFACTURING PROCESS SEQUENCE (Requirements 5 & 6) */}
              <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                      MANUFACTURING PROCESS SEQUENCE
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {processList.length} Steps
                    </span>
                  </div>

                  {/* Toolbar: + New Process Button (Req 5.1) and Load Process Template dropdown (Req 5.3) */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleOpenNewProcessModal}
                      className="px-2.5 py-1.5 rounded bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm shrink-0"
                      title="Create a new Manufacturing Process Template"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ New Process</span>
                    </button>

                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value) handleLoadProcessTemplate(e.target.value);
                      }}
                      className="flex-1 min-w-[140px] text-xs p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      <option value="">Load Process Template...</option>
                      {availableProcessTemplates.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.processes.length} steps)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Process Sequence Table */}
                  <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 mt-3 max-h-52 overflow-y-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px] sticky top-0">
                        <tr>
                          <th className="py-1.5 px-2.5 w-12">SL</th>
                          <th className="py-1.5 px-2.5">Process Name</th>
                          <th className="py-1.5 px-2 w-10 text-right"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {processList.map((proc, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                            <td className="py-1.5 px-2.5 font-mono font-bold text-slate-400">{proc.sl}</td>
                            <td className="py-1.5 px-2.5">
                              <input
                                type="text"
                                value={proc.processName}
                                onChange={(e) => {
                                  const updated = [...processList];
                                  updated[idx].processName = e.target.value;
                                  setProcessList(updated);
                                }}
                                className="w-full p-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                              />
                            </td>
                            <td className="py-1.5 px-2 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveProcess(idx)}
                                className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                title="Delete Process"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Quick Add Step */}
                <div className="flex items-center gap-1.5 pt-2">
                  <input
                    type="text"
                    placeholder="Add process step..."
                    value={newProcessInput}
                    onChange={(e) => setNewProcessInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddProcess();
                      }
                    }}
                    className="flex-1 p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddProcess}
                    className="px-2.5 py-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1 shrink-0 border border-slate-300 dark:border-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ────────────────────────────────────────────────────────────── */}
            {/* SECTION 4: ORDER QUANTITY AND DELIVERY INFORMATION (Req 7)     */}
            {/* 6 fields removed: Del DT, PCD, Dest Country, Del Mode,         */}
            {/* Del port, Place (Factory/Delivery)                             */}
            {/* ────────────────────────────────────────────────────────────── */}
            <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                ORDER QUANTITY AND DELIVERY INFORMATION
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
                {/* 1. Order Qty */}
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Order Qty *</label>
                  <input
                    type="number"
                    value={formOrderQty}
                    onChange={(e) => setFormOrderQty(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-extrabold text-sm text-teal-700 dark:text-teal-400"
                    required
                  />
                </div>

                {/* 2. First Del Dt */}
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">First Del Dt *</label>
                  <input
                    type="date"
                    value={formFirstDelDt}
                    onChange={(e) => setFormFirstDelDt(e.target.value)}
                    className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>

                {/* 3. Confirm Dt */}
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Confirm Dt *</label>
                  <input
                    type="date"
                    value={formConfirmDt}
                    onChange={(e) => setFormConfirmDt(e.target.value)}
                    className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>

                {/* 4. Extra Cutting % */}
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Extra Cutting % *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formExtraCuttingPct}
                    onChange={(e) => setFormExtraCuttingPct(parseFloat(e.target.value) || 0)}
                    className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs"
                  />
                </div>

                {/* 5. SMV */}
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">SMV *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formSmv}
                    onChange={(e) => setFormSmv(parseFloat(e.target.value) || 0)}
                    className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* ────────────────────────────────────────────────────────────── */}
            {/* INSTRUCTIONS AND NOTES (Requirement 7)                         */}
            {/* ────────────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Requirements Details */}
              <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-600"></span>
                  REQUIREMENT DETAILS
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Fabric Requirement Details</label>
                      <button
                        type="button"
                        onClick={handleOpenFabricEstimation}
                        className="text-[11px] font-bold text-teal-600 hover:text-teal-700 hover:underline flex items-center gap-1 px-2 py-0.5 rounded hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-all"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>View Specs</span>
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={formFabricReq}
                      onChange={(e) => setFormFabricReq(e.target.value)}
                      className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Accessories Requirement Details</label>
                      <button
                        type="button"
                        onClick={handleOpenAccessoriesEstimation}
                        className="text-[11px] font-bold text-teal-600 hover:underline flex items-center gap-1"
                        title="Open Accessories Estimation Form (GR_1308)"
                      >
                        <FileText className="w-3 h-3" /> View Trims
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={formAccReq}
                      onChange={(e) => setFormAccReq(e.target.value)}
                      className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Instructions and Notes */}
              <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  INSTRUCTIONS AND NOTES
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Note</label>
                    <textarea
                      rows={2}
                      value={formNote}
                      onChange={(e) => setFormNote(e.target.value)}
                      className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      placeholder="General order remarks, packaging requirements, sampling comments..."
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Instruction Detail</label>
                    <textarea
                      rows={2}
                      value={formInstructionDetail}
                      onChange={(e) => setFormInstructionDetail(e.target.value)}
                      className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      placeholder="Detailed manufacturing guidelines, inspection standards, needle detection rules..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Note: Section 8 (Delivery Lot Details) is completely removed per Requirement 8 */}

            {/* ────────────────────────────────────────────────────────────── */}
            {/* PO / ORDER DETAILS (Requirement 9)                             */}
            {/* ────────────────────────────────────────────────────────────── */}
            <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                    PO / ORDER DETAILS
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isPoMatched
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {isPoMatched
                      ? `✓ POs Matched (${totalPoQty.toLocaleString()} / ${formOrderQty.toLocaleString()} pcs)`
                      : `⚠ PO Mismatch: ${totalPoQty.toLocaleString()} of ${formOrderQty.toLocaleString()} pcs (Δ ${
                          totalPoQty - formOrderQty
                        })`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newPoNo = `PO-${formBuyer.slice(0, 2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
                    const nextNo = poDetails.length + 1;
                    setPoDetails([
                      ...poDetails,
                      {
                        id: `po-${Date.now()}`,
                        no: nextNo,
                        projection: "Confirmed",
                        po: "Main",
                        qty: 0,
                        lot: "LOT-01",
                        poNumber: newPoNo,
                        poDesc: "General Production PO",
                        rate: formUnitPrice,
                        value: 0,
                        delDate: formDelDt,
                        pcd: formPcd,
                        destCountry: formDestCountry,
                        delMode: formDelMode,
                        destPort: formDelPort,
                        v: "V1",
                        s: "FOB",
                        size: "M",
                        scLcNo: undefined,
                      },
                    ]);
                  }}
                  className="px-2.5 py-1 rounded text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add PO Row
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">PO Number *</th>
                      <th className="py-2.5 px-3">PO Desc</th>
                      {/* Repositioned Qty immediately to the left of RATE (Requirement 9.3) */}
                      <th className="py-2.5 px-3">Qty *</th>
                      <th className="py-2.5 px-3">RATE ({currencySymbol})</th>
                      <th className="py-2.5 px-3">Value ({currencySymbol})</th>
                      <th className="py-2.5 px-3">Del DT</th>
                      <th className="py-2.5 px-3">PCD</th>
                      <th className="py-2.5 px-3">Dest Country</th>
                      <th className="py-2.5 px-3">Del Mode</th>
                      {/* S.C/LC No. Column immediately before Breakdown (Requirement 1) */}
                      <th className="py-2.5 px-3">S.C/LC No.</th>
                      {/* Breakdown button column (Requirement 9.9) */}
                      <th className="py-2.5 px-3 text-center">Breakdown</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {poDetails.map((po, idx) => {
                      const breakdownSum =
                        po.breakdown?.colorBreakdowns.reduce((acc, c) => {
                          return acc + c.sizeRows.reduce((sAcc, s) => sAcc + (Number(s.quantity) || 0), 0);
                        }, 0) || 0;

                      const allColorsMatched =
                        po.breakdown?.colorBreakdowns.every(
                          (c) =>
                            (Number(c.quantity) || 0) ===
                            c.sizeRows.reduce((sAcc, s) => sAcc + (Number(s.quantity) || 0), 0)
                        ) ?? false;

                      const isBreakdownMatched =
                        breakdownSum === Number(po.qty) && Number(po.qty) > 0 && allColorsMatched;
                      const isBreakdownOverrun = breakdownSum > Number(po.qty);
                      const isBreakdownEmpty = breakdownSum === 0;

                      return (
                        <tr key={po.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          {/* 1. PO Number */}
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={po.poNumber}
                              onChange={(e) => {
                                const updated = [...poDetails];
                                updated[idx].poNumber = e.target.value;
                                if (updated[idx].breakdown) {
                                  updated[idx].breakdown!.poNumber = e.target.value;
                                }
                                setPoDetails(updated);
                              }}
                              className="p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-xs w-36"
                              required
                            />
                          </td>

                          {/* 2. PO Desc */}
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={po.poDesc}
                              onChange={(e) => {
                                const updated = [...poDetails];
                                updated[idx].poDesc = e.target.value;
                                setPoDetails(updated);
                              }}
                              className="p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] w-36"
                            />
                          </td>

                          {/* 3. Qty (Repositioned immediately left of RATE per Requirement 9.3) */}
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={po.qty}
                              onChange={(e) => {
                                const newQty = Math.max(0, parseInt(e.target.value) || 0);
                                const updated = [...poDetails];
                                updated[idx].qty = newQty;
                                updated[idx].value = newQty * (updated[idx].rate || formUnitPrice);

                                if (breakdownSum > 0 && newQty < breakdownSum) {
                                  toast.warning(
                                    `PO Qty (${newQty.toLocaleString()}) is now less than saved Breakdown total (${breakdownSum.toLocaleString()}). Please adjust the breakdown before final save.`
                                  );
                                }

                                setPoDetails(updated);
                              }}
                              className="p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-xs w-24 text-teal-700 dark:text-teal-400"
                              required
                            />
                          </td>

                          {/* 4. RATE */}
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              step="0.01"
                              value={po.rate}
                              onChange={(e) => {
                                const rateVal = parseFloat(e.target.value) || 0;
                                const updated = [...poDetails];
                                updated[idx].rate = rateVal;
                                updated[idx].value = (updated[idx].qty || 0) * rateVal;
                                setPoDetails(updated);
                              }}
                              className="p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs w-20"
                            />
                          </td>

                          {/* 5. Value */}
                          <td className="py-2 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                            {currencySymbol}
                            {(po.qty * po.rate).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </td>

                          {/* 6. Del DT */}
                          <td className="py-2 px-3">
                            <input
                              type="date"
                              value={po.delDate}
                              onChange={(e) => {
                                const updated = [...poDetails];
                                updated[idx].delDate = e.target.value;
                                setPoDetails(updated);
                              }}
                              className="p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] w-32"
                            />
                          </td>

                          {/* 7. PCD */}
                          <td className="py-2 px-3">
                            <input
                              type="date"
                              value={po.pcd}
                              onChange={(e) => {
                                const updated = [...poDetails];
                                updated[idx].pcd = e.target.value;
                                setPoDetails(updated);
                              }}
                              className="p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] w-32"
                            />
                          </td>

                          {/* 8. Dest Country (Searchable selection field per Requirement 9.4) */}
                          <td className="py-2 px-3">
                            <button
                              type="button"
                              onClick={() => {
                                setCountryModalTargetPoIndex(idx);
                                setShowCountryModal(true);
                              }}
                              className="flex items-center gap-1.5 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200"
                              title="Select Destination Country"
                            >
                              <Globe className="w-3 h-3 text-teal-600" />
                              <span>{po.destCountry || "Select Country..."}</span>
                            </button>
                          </td>

                          {/* 9. Del Mode */}
                          <td className="py-2 px-3">
                            <select
                              value={po.delMode}
                              onChange={(e) => {
                                const updated = [...poDetails];
                                updated[idx].delMode = e.target.value;
                                setPoDetails(updated);
                              }}
                              className="p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px]"
                            >
                              <option value="Sea">Sea</option>
                              <option value="Air">Air</option>
                              <option value="Road">Road</option>
                              <option value="Sea-Air">Sea-Air</option>
                            </select>
                          </td>

                          {/* 10. S.C/LC No. Selection Trigger (Immediately before Breakdown - Requirement 1) */}
                          <td className="py-2 px-3">
                            <button
                              type="button"
                              onClick={() => {
                                setScLcTargetPoIndex(idx);
                                setScLcSearchTerm("");
                                setShowScLcModal(true);
                              }}
                              className={`flex items-center gap-1.5 px-2 py-1 rounded border text-[11px] font-mono font-semibold w-36 truncate transition-all text-left ${
                                po.scLcNo
                                  ? "bg-teal-50 dark:bg-teal-950/40 border-teal-300 dark:border-teal-700 text-teal-800 dark:text-teal-300 hover:bg-teal-100"
                                  : "bg-white dark:bg-slate-800 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:border-teal-400 hover:text-teal-600"
                              }`}
                              title={
                                po.scLcNo
                                  ? `Linked to S.C/LC: ${po.scLcNo}. Click to change or clear.`
                                  : "Click to select Sales Contract or Letter of Credit"
                              }
                            >
                              <FileText className="w-3 h-3 text-teal-600 flex-shrink-0" />
                              <span className="truncate">{po.scLcNo || "Select S.C/LC..."}</span>
                            </button>
                          </td>

                          {/* 11. Breakdown Button (STRICT LABEL: "Breakdown" per Requirement 9.9) */}
                          <td className="py-2 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleOpenBreakdownModal(po)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 mx-auto ${
                                isBreakdownMatched
                                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                  : isBreakdownOverrun
                                  ? "bg-rose-600 hover:bg-rose-700 text-white animate-pulse"
                                  : isBreakdownEmpty
                                  ? "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700"
                                  : "bg-amber-500 hover:bg-amber-600 text-white"
                              }`}
                              title={`Open Breakdown for PO ${po.poNumber}`}
                            >
                              <Layers className="w-3.5 h-3.5" />
                              <span>Breakdown</span>
                            </button>
                          </td>

                          {/* 12. Actions */}
                          <td className="py-2 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                if (poDetails.length <= 1) {
                                  toast.error("At least one PO is required.");
                                  return;
                                }
                                setPoDetails(poDetails.filter((_, i) => i !== idx));
                                toast.info("PO row removed.");
                              }}
                              className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                              title="Delete PO Row"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-slate-50 dark:bg-slate-800/80 font-bold border-t border-slate-200 dark:border-slate-800 text-[11px]">
                    <tr>
                      <td colSpan={2} className="py-2.5 px-3 text-right text-slate-500">
                        Total PO Quantity & Value:
                      </td>
                      <td className="py-2.5 px-3 font-mono text-teal-700 dark:text-teal-400">
                        {totalPoQty.toLocaleString()} pcs
                      </td>
                      <td></td>
                      <td className="py-2.5 px-3 font-mono text-slate-900 dark:text-white">
                        {currencySymbol}
                        {poDetails
                          .reduce((acc, p) => acc + (p.qty || 0) * (p.rate || 0), 0)
                          .toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td colSpan={7} className="py-2.5 px-3 text-right text-xs">
                        {isPoMatched ? (
                          <span className="text-emerald-600">✓ Reconciled with Order Qty</span>
                        ) : (
                          <span className="text-amber-600">
                            Δ {(totalPoQty - formOrderQty).toLocaleString()} pcs vs Order Qty
                          </span>
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Final Form Action Buttons */}
            <div className="flex items-center justify-between p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("register");
                  setEditingOrderId(null);
                  MMRepository.saveOrderEntryUiState({ activeTab: "register", editingOrderId: null });
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                Cancel
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSaveMainOrder(true)}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 shadow-sm"
                >
                  Save as Incomplete Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveMainOrder(false)}
                  className="px-6 py-2 rounded-lg text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Confirm Main Order</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 3: DEDICATED FULL-PAGE FABRIC ESTIMATION SCREEN                */}
        {/* ================================================================== */}
        {activeTab === "fabric-estimation" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Top Order Context Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-900 via-slate-900 to-cyan-950 text-white border border-teal-800/40 shadow-lg flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Job ID:</span>
                  <strong className="text-sm font-mono text-teal-300">{feOurRef || formJobNo}</strong>
                  {feSourceType === "pre-costing" && feFindBudget && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Pre-Costing: {feFindBudget}
                    </span>
                  )}
                </div>
                <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                  <Layers className="w-5 h-5 text-teal-400" />
                  <span>Fabric Estimation</span>
                </h2>
                <p className="text-xs text-slate-300">
                  Buyer: <strong className="text-white">{feBuyer}</strong> | Style:{" "}
                  <strong className="text-white">{formStyle || "Crew Neck T-Shirt"}</strong> | GMT Item:{" "}
                  <strong className="text-white">{feItemName}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-slate-800/80 rounded-xl p-2.5 px-3.5 border border-slate-700/60 text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Order Quantity</span>
                  <span className="text-sm font-bold text-white font-mono">{feQuantity.toLocaleString()} {feUnit}</span>
                </div>
                <div className="bg-slate-800/80 rounded-xl p-2.5 px-3.5 border border-slate-700/60 text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Order Value</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    ${orderValue > 0 ? orderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : (feQuantity * feRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleBackFromFabricEstimation}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <ArrowLeft className="w-4 h-4 text-teal-400" />
                  <span>Back to Order Entry</span>
                </button>
              </div>
            </div>

            {/* 2-Column Responsive Layout for Reference & Commercial Reference (Sections 3, 4, 5) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* SECTION 1: REFERENCE AND SEARCH INFORMATION */}
              <div className="p-4 sm:p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                    Reference &amp; Search Information
                  </h3>
                  <span className="text-[11px] text-slate-400">Searchable Job ID and Pre-Costing selection lookups</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Find Job ID (Old: Find Our Ref) */}
                  <div>
                    <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Find Job ID</label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={feOurRef}
                        onClick={() => {
                          setJobIdSearchQuery("");
                          setShowFindOurRefModal(true);
                        }}
                        placeholder="Click to search Job ID..."
                        className="w-full pr-8 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold cursor-pointer hover:border-teal-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setJobIdSearchQuery("");
                          setShowFindOurRefModal(true);
                        }}
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-teal-600"
                        title="Search Job ID records"
                      >
                        <Search className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Find Pre Costing (Old: Find Budget) */}
                  <div>
                    <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Find Pre Costing</label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={feFindBudget}
                        onClick={() => {
                          setPreCostingSearchQuery("");
                          setShowFindBudgetModal(true);
                        }}
                        placeholder="Click to search Pre-Costing..."
                        className="w-full pr-8 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold cursor-pointer hover:border-teal-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreCostingSearchQuery("");
                          setShowFindBudgetModal(true);
                        }}
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-teal-600"
                        title="Search Pre-Costing records"
                      >
                        <Search className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: COMMERCIAL REFERENCE (Section 5) */}
              <div className="p-4 sm:p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-600"></span>
                    Commercial Reference
                  </h3>
                  <span className="text-[11px] text-slate-400">Commercial references, proforma invoices and export L/Cs</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* Booking No. (Read-only, assigned strictly via Fabric Booking workflow) */}
                  <div>
                    <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Booking No.</label>
                    <input
                      type="text"
                      value={feBookingNo}
                      readOnly
                      placeholder="Assigned on Fabric Booking"
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 text-xs font-mono font-semibold cursor-not-allowed select-none"
                      title="Booking Number is assigned automatically only after creating and saving an actual Fabric Booking."
                    />
                  </div>

                  {/* PI No. */}
                  <div>
                    <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">PI No.</label>
                    <input
                      type="text"
                      value={fePiNo}
                      onChange={(e) => setFePiNo(e.target.value)}
                      placeholder="e.g. PI-2026-102"
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-semibold"
                    />
                  </div>

                  {/* BBLC No. */}
                  <div>
                    <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">BBLC No.</label>
                    <input
                      type="text"
                      value={feBblcNo}
                      onChange={(e) => setFeBblcNo(e.target.value)}
                      placeholder="e.g. BBLC-9872"
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: FABRIC DETAILS INFO (Sections 6, 7, 8, 9, 10, 11) */}
            <div className="p-4 sm:p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                    Fabric Details Info
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Define fabric specifications, searchable fabric master codes, color mappings, and nominated suppliers. Click row to review consumption below.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddFabricRow}
                    className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Fab</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Table */}
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs whitespace-nowrap min-w-[1200px]">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-[11px] font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-2.5 px-2 text-center w-10">Select</th>
                      <th className="py-2.5 px-2 text-center w-16">Inhouse?</th>
                      <th className="py-2.5 px-2.5 w-28">Used Place</th>
                      <th className="py-2.5 px-2.5 w-44">Pre Costing Item</th>
                      <th className="py-2.5 px-2.5 w-36">Fabric Code</th>
                      <th className="py-2.5 px-3 min-w-[220px]">Fabric Description</th>
                      <th className="py-2.5 px-2.5 w-20">SKU</th>
                      <th className="py-2.5 px-2.5 text-center w-28">Color</th>
                      <th className="py-2.5 px-2.5 w-24">Width</th>
                      <th className="py-2.5 px-2.5 w-20 text-right">Rate ($)</th>
                      <th className="py-2.5 px-2.5 w-28">Nominee Status</th>
                      <th className="py-2.5 px-3 min-w-[180px]">Supplier</th>
                      <th className="py-2.5 px-3 text-center sticky right-0 bg-slate-50 dark:bg-slate-800 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)] w-36">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {feFabricRows.length === 0 ? (
                      <tr>
                        <td colSpan={13} className="py-8 text-center text-xs text-slate-400">
                          No fabric specification records found for this Job. Click <strong className="text-teal-600">&quot;+ Add Fab&quot;</strong> or select a Pre-Costing record above.
                        </td>
                      </tr>
                    ) : (
                      feFabricRows.map((row, idx) => {
                        const isSelected = feSelectedRowIndex === idx;

                        return (
                          <tr
                            key={row.id || idx}
                            onClick={() => setFeSelectedRowIndex(idx)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-teal-50/70 dark:bg-teal-950/40 border-l-4 border-l-teal-600"
                                : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                            }`}
                          >
                            {/* Radio Selector */}
                            <td className="py-2 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="radio"
                                name="selectedFabricRow"
                                checked={isSelected}
                                onChange={() => setFeSelectedRowIndex(idx)}
                                className="text-teal-600 focus:ring-teal-500 w-3.5 h-3.5 cursor-pointer"
                              />
                            </td>

                            {/* Inhouse? (Unchecked by default per Section 6.1) */}
                            <td className="py-2 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={row.inhouse}
                                onChange={(e) => updateFabricRowField(idx, "inhouse", e.target.checked)}
                                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                              />
                            </td>

                            {/* Used Place (Option Shell instead of Trim per Section 6.3) */}
                            <td className="py-2 px-2.5" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={row.usedPlace}
                                onChange={(e) => updateFabricRowField(idx, "usedPlace", e.target.value)}
                                className="w-full p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                              >
                                <option value="Shell">Shell</option>
                                <option value="Body">Body</option>
                                <option value="Collar & Cuff">Collar &amp; Cuff</option>
                                <option value="Collar">Collar</option>
                                <option value="Cuff">Cuff</option>
                                <option value="Pocket">Pocket</option>
                                <option value="Hood">Hood</option>
                                <option value="Lining">Lining</option>
                                <option value="Waistband">Waistband</option>
                              </select>
                            </td>

                            {/* Pre Costing Item (Searchable List Field per Section 4.3) */}
                            <td className="py-2 px-2.5" onClick={(e) => e.stopPropagation()}>
                              <div className="relative">
                                <input
                                  type="text"
                                  readOnly
                                  value={row.budgetItemName}
                                  onClick={() => handleOpenPreCostItemModal(idx)}
                                  placeholder="Select Pre Costing Item..."
                                  className="w-full pr-7 p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium cursor-pointer hover:border-teal-500 transition-colors"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleOpenPreCostItemModal(idx)}
                                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-teal-600 hover:text-teal-700"
                                  title="Search Pre Costing Items"
                                >
                                  <Search className="w-3 h-3" />
                                </button>
                              </div>
                            </td>

                            {/* Fabric Code (Searchable Master Selection per Section 7) */}
                            <td className="py-2 px-2.5" onClick={(e) => e.stopPropagation()}>
                              <div className="relative">
                                <input
                                  type="text"
                                  readOnly
                                  value={row.code}
                                  onClick={() => {
                                    setFabricMasterRowIndex(idx);
                                    setFabricMasterSearchQuery("");
                                    setShowFabricMasterModal(true);
                                  }}
                                  placeholder="Select Code..."
                                  className="w-full pr-7 p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs font-bold cursor-pointer hover:border-teal-500 transition-colors"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFabricMasterRowIndex(idx);
                                    setFabricMasterSearchQuery("");
                                    setShowFabricMasterModal(true);
                                  }}
                                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-teal-600 hover:text-teal-700"
                                  title="Search Fabric Master"
                                >
                                  <Search className="w-3 h-3" />
                                </button>
                              </div>
                            </td>

                            {/* Fabric Description (Read-Only Auto-Populated per Section 4.4) */}
                            <td className="py-2 px-3" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="text"
                                readOnly
                                value={row.fabricDescription}
                                placeholder="Auto-populated from Fabric Code..."
                                title="Auto-populated from Fabric Code (Read-only)"
                                className="w-full p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 font-medium text-slate-800 dark:text-slate-200 text-xs cursor-not-allowed"
                              />
                            </td>

                            {/* SKU (Auto-populated from Unit per Section 8) */}
                            <td className="py-2 px-2.5" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="text"
                                readOnly
                                value={row.sku}
                                title="Auto-populated from Fabric Master Unit"
                                className="w-full p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 font-mono text-xs font-bold text-teal-700 dark:text-teal-300 cursor-not-allowed"
                              />
                            </td>

                            {/* Color Field: D. Color Button Only (Section 4.2) */}
                            <td className="py-2 px-2.5 text-center" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => handleOpenColorEntry(idx)}
                                className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-800 text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95"
                                title="Define fabric colors"
                              >
                                <Palette className="w-3.5 h-3.5 text-teal-600" />
                                <span>D. Color</span>
                                {row.colorMappings && row.colorMappings.length > 0 && (
                                  <span className="px-1.5 py-0.2 rounded-full bg-teal-200 dark:bg-teal-800 text-[10px] font-mono">
                                    {row.colorMappings.length}
                                  </span>
                                )}
                              </button>
                            </td>

                            {/* Width (Auto-populated from Fabric Master) */}
                            <td className="py-2 px-2.5" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="text"
                                value={row.width}
                                onChange={(e) => updateFabricRowField(idx, "width", e.target.value)}
                                className="w-full p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                              />
                            </td>

                            {/* Rate */}
                            <td className="py-2 px-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="number"
                                step="0.01"
                                value={row.rate}
                                onChange={(e) => updateFabricRowField(idx, "rate", Number(e.target.value) || 0)}
                                className="w-20 p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono font-bold text-xs"
                              />
                            </td>

                            {/* Nominee Status */}
                            <td className="py-2 px-2.5" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={row.nomineeStatus}
                                onChange={(e) => updateFabricRowField(idx, "nomineeStatus", e.target.value)}
                                className="w-full p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                              >
                                <option value="Nominated">Nominated</option>
                                <option value="In-House">In-House</option>
                                <option value="Open">Open</option>
                              </select>
                            </td>

                            {/* Supplier (Searchable Supplier Master Selection per Section 11) */}
                            <td className="py-2 px-3" onClick={(e) => e.stopPropagation()}>
                              <div className="relative">
                                <input
                                  type="text"
                                  readOnly
                                  value={row.supplier}
                                  onClick={() => {
                                    setSupplierRowIndex(idx);
                                    setSupplierSearchQuery("");
                                    setShowSupplierModal(true);
                                  }}
                                  placeholder="Select Supplier..."
                                  className="w-full pr-7 p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium cursor-pointer hover:border-teal-500 transition-colors"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSupplierRowIndex(idx);
                                    setSupplierSearchQuery("");
                                    setShowSupplierModal(true);
                                  }}
                                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-teal-600 hover:text-teal-700"
                                  title="Search Supplier Master"
                                >
                                  <Search className="w-3 h-3" />
                                </button>
                              </div>
                            </td>

                            {/* Sticky Action Column with Booking Button (Section 4.5) & Delete */}
                            <td
                              className="py-2 px-3 text-center sticky right-0 bg-white dark:bg-slate-900 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenBookingForRow(row, idx)}
                                  className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all hover:scale-105 active:scale-95"
                                  title={`Open Fabric Booking for ${row.budgetItemName} (${row.code})`}
                                >
                                  <Scissors className="w-3 h-3" />
                                  <span>Booking</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteFabricRow(idx)}
                                  disabled={feFabricRows.length <= 1}
                                  className={`p-1.5 rounded transition-all ${
                                    feFabricRows.length <= 1
                                      ? "text-slate-300 dark:text-slate-700 cursor-not-allowed"
                                      : "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                  }`}
                                  title={feFabricRows.length <= 1 ? "At least one row required" : "Delete Row"}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 3: CONSUMPTION AND COST CALCULATION (Section 5 - Unit Removed, Clean Balanced Layout) */}
            {feFabricRows[feSelectedRowIndex] && (
              <div className="p-4 sm:p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-teal-600" />
                      <span>Consumption &amp; Cost Calculation</span>
                      <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 font-mono text-[11px] font-bold">
                        {feFabricRows[feSelectedRowIndex]?.budgetItemName} ({feFabricRows[feSelectedRowIndex]?.code})
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Synchronized consumption and cost derivations based on active order quantity.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-semibold">Active Row Rate:</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono font-bold text-xs">
                      ${feFabricRows[feSelectedRowIndex]?.rate.toFixed(2)} / {feFabricRows[feSelectedRowIndex]?.sku || feFabricRows[feSelectedRowIndex]?.unit}
                    </span>
                  </div>
                </div>

                {/* Calculation Inputs and Outputs Grid (Unit Field Removed per Section 5) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
                  {/* Per */}
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Per</label>
                    <select
                      value={feFabricRows[feSelectedRowIndex]?.per}
                      onChange={(e) => updateFabricRowField(feSelectedRowIndex, "per", e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                    >
                      <option value="Dzn">Dzn (12 Pcs)</option>
                      <option value="Pcs">Pcs (1 Pc)</option>
                    </select>
                  </div>

                  {/* Consum */}
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Consum</label>
                    <input
                      type="number"
                      step="0.001"
                      value={feFabricRows[feSelectedRowIndex]?.consum}
                      onChange={(e) => updateFabricRowField(feSelectedRowIndex, "consum", Number(e.target.value) || 0)}
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-xs"
                    />
                  </div>

                  {/* W% */}
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">W% (Wastage)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={feFabricRows[feSelectedRowIndex]?.wPct}
                      onChange={(e) => updateFabricRowField(feSelectedRowIndex, "wPct", Number(e.target.value) || 0)}
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-xs"
                    />
                  </div>

                  {/* Order Qty (Non-editable per Section 12.1) */}
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center justify-between">
                      <span>Order Qty</span>
                      <span className="text-[10px] text-slate-400 font-normal">Non-editable</span>
                    </label>
                    <input
                      type="number"
                      readOnly
                      value={feQuantity}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 font-mono font-bold text-slate-700 dark:text-slate-300 cursor-not-allowed text-xs"
                      title="Automatically populated from current order/job quantity"
                    />
                  </div>

                  {/* Require Qty (Normal Derived) */}
                  <div>
                    <label className="font-semibold text-slate-500 block mb-1">Require Qty</label>
                    <div className="w-full p-2 rounded-lg border border-teal-200 dark:border-teal-900 bg-teal-50 dark:bg-teal-950/40 font-mono font-bold text-teal-800 dark:text-teal-200 text-xs">
                      {feFabricRows[feSelectedRowIndex]?.requireQty.toLocaleString()} {feFabricRows[feSelectedRowIndex]?.unit}
                    </div>
                  </div>

                  {/* Cons/Pc (Derived) */}
                  <div>
                    <label className="font-semibold text-slate-500 block mb-1">Cons/Pc</label>
                    <input
                      type="text"
                      readOnly
                      value={feFabricRows[feSelectedRowIndex]?.consPerPc.toFixed(4)}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 font-mono font-bold text-slate-800 dark:text-slate-200 cursor-not-allowed text-xs"
                    />
                  </div>

                  {/* Cons/Dz (Derived) */}
                  <div>
                    <label className="font-semibold text-slate-500 block mb-1">Cons/Dz</label>
                    <input
                      type="text"
                      readOnly
                      value={feFabricRows[feSelectedRowIndex]?.consPerDz.toFixed(3)}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 font-mono font-bold text-slate-800 dark:text-slate-200 cursor-not-allowed text-xs"
                    />
                  </div>

                  {/* Cost/Pc (Derived) */}
                  <div>
                    <label className="font-semibold text-slate-500 block mb-1">Cost/Pc ($)</label>
                    <input
                      type="text"
                      readOnly
                      value={`$${feFabricRows[feSelectedRowIndex]?.costPerPc.toFixed(3)}`}
                      className="w-full p-2 rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/30 font-mono font-bold text-emerald-700 dark:text-emerald-300 cursor-not-allowed text-xs"
                    />
                  </div>

                  {/* Cost/Dz (Derived) */}
                  <div>
                    <label className="font-semibold text-slate-500 block mb-1">Cost/Dz ($)</label>
                    <input
                      type="text"
                      readOnly
                      value={`$${feFabricRows[feSelectedRowIndex]?.costPerDz.toFixed(2)}`}
                      className="w-full p-2 rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/30 font-mono font-bold text-emerald-700 dark:text-emerald-300 cursor-not-allowed text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 4: BOTTOM ACTION BUTTONS (Section 13 - Unwanted buttons removed, Submit added) */}
            <div className="p-4 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3 sticky bottom-3 z-20 backdrop-blur-md bg-white/95 dark:bg-slate-900/95">
              {/* Back Button */}
              <button
                type="button"
                onClick={handleBackFromFabricEstimation}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-all shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 text-teal-600" />
                <span>Back</span>
              </button>

              {/* Action Buttons Group */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Submit Button (Primary Action per Section 13.1) */}
                <button
                  type="button"
                  onClick={handleSubmitFabricEstimation}
                  className="px-7 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Check className="w-4 h-4" />
                  <span>Submit</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* PART E — PO-WISE SIZE & COLOR BREAKDOWN MODAL                       */}
        {/* ================================================================== */}
        {activePoForBreakdown && modalBreakdownData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-[97vw] 2xl:max-w-7xl w-full p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col my-3 max-h-[94vh] overflow-hidden animate-in fade-in zoom-in-95">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-600" />
                    <span>Size Detail Information — PO-wise Size &amp; Color-wise Quantity Breakdown</span>
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Parent Order: <strong className="text-slate-700 dark:text-slate-300">{formOurRef}</strong> | Style:{" "}
                    <strong>{formStyle}</strong> ({formGmtItem})
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleModalCloseAttempt}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* ──────────────────────────────────────────────────────────── */}
              {/* SECTION 2: SIMPLIFIED PO IDENTIFICATION HEADER BAR           */}
              {/* ──────────────────────────────────────────────────────────── */}
              <div className="py-2.5 px-3.5 rounded-xl border bg-slate-50/90 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 my-2 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Retained Field: PO No. */}
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-600 dark:text-slate-400 text-xs">PO No.:</span>
                    <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 font-mono font-bold text-slate-900 dark:text-white text-xs shadow-sm">
                      {activePoForBreakdown.poNumber}
                    </span>
                  </div>

                  {/* Retained Field: PO Qty */}
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-600 dark:text-slate-400 text-xs">PO Qty:</span>
                    <span className="px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 font-mono font-extrabold text-teal-700 dark:text-teal-300 text-xs shadow-sm">
                      {Number(activePoForBreakdown.qty).toLocaleString()} pcs
                    </span>
                  </div>
                </div>

                {/* Status Indicator in Header */}
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 ${
                      modalBreakdownTotal === Number(activePoForBreakdown.qty)
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                        : modalBreakdownTotal > Number(activePoForBreakdown.qty)
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                    }`}
                  >
                    <span>
                      Allocation: {modalBreakdownTotal.toLocaleString()} /{" "}
                      {Number(activePoForBreakdown.qty).toLocaleString()} pcs
                    </span>
                    {modalRemainingQty !== 0 && (
                      <span className="font-mono text-[11px]">
                        ({modalRemainingQty > 0 ? `Remaining: ${modalRemainingQty.toLocaleString()}` : `Over: ${Math.abs(modalRemainingQty).toLocaleString()}`})
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* ──────────────────────────────────────────────────────────── */}
              {/* ACTION & SELECTION CONTROLS BAR (SECTIONS 5 & 6)             */}
              {/* ──────────────────────────────────────────────────────────── */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Color</span>
                  </button>

                  {/* Section 5: Add Custom Size Button (Single plus icon per Requirement 3) */}
                  <button
                    type="button"
                    onClick={() => {
                      setNewCustomSizeInput("");
                      setShowAddSizeModal(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    title="Add new size columns to the breakdown"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Size</span>
                  </button>

                  <span className="text-xs text-slate-500 font-medium ml-1">
                    ({modalBreakdownData.colorBreakdowns.length} Garment{" "}
                    {modalBreakdownData.colorBreakdowns.length === 1 ? "Color" : "Colors"} | {gridSizes.length} Sizes)
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Ratio Wise Qty Change button */}
                  <button
                    type="button"
                    onClick={() => handleOpenRatioModal(0)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    title="Open Ratio-based quantity allocation dialog"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Ratio Wise Qty Change</span>
                  </button>

                  {/* Size Selection and Population Controls */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    <label className="text-[11px] font-semibold text-slate-500 pl-2">Size From Buyer Dept.:</label>
                    <select
                      value={modalBreakdownData.sizeFromBuyerDept}
                      onChange={(e) => {
                        setModalBreakdownData({ ...modalBreakdownData, sizeFromBuyerDept: e.target.value });
                        setIsModalDirty(true);
                      }}
                      className="p-1 rounded bg-white dark:bg-slate-700 text-xs font-medium border-0 focus:ring-1 focus:ring-teal-500 max-w-[200px] truncate"
                    >
                      {Object.keys(BUYER_DEPT_SIZE_SETS).map((key) => (
                        <option key={key} value={key}>
                          {key}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handlePopulateSizes}
                      className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs whitespace-nowrap shadow-sm transition-all"
                      title="Populate size columns across all colors"
                    >
                      Populate &gt;&gt;
                    </button>
                  </div>
                </div>
              </div>

              {/* ──────────────────────────────────────────────────────────── */}
              {/* UNIFIED SYNCHRONIZED BREAKDOWN TABLE (SECTIONS 3, 4, 6)      */}
              {/* Left Color Columns rowSpan={2} lock Ratio & Qty rows         */}
              {/* ──────────────────────────────────────────────────────────── */}
              <div className="flex-1 min-h-0 border border-slate-300 dark:border-slate-700 rounded-xl overflow-auto bg-white dark:bg-slate-900 shadow-inner">
                <table className="w-full border-collapse text-xs">
                  {/* Table Header */}
                  <thead className="sticky top-0 z-30 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider shadow-sm">
                    <tr>
                      {/* Left Frozen / Sticky Columns: 6 columns (Total width 518px) */}
                      <th className="w-9 min-w-[36px] max-w-[36px] py-2.5 px-1 text-center sticky left-0 z-40 bg-slate-100 dark:bg-slate-800 border-b border-r border-slate-300 dark:border-slate-700">
                        Sel
                      </th>
                      <th className="w-9 min-w-[36px] max-w-[36px] py-2.5 px-1 text-center sticky left-[36px] z-40 bg-slate-100 dark:bg-slate-800 border-b border-r border-slate-300 dark:border-slate-700">
                        Del
                      </th>
                      <th className="w-40 min-w-[160px] py-2.5 px-2 text-left sticky left-[72px] z-40 bg-slate-100 dark:bg-slate-800 border-b border-r border-slate-300 dark:border-slate-700">
                        Garments Color *
                      </th>
                      <th className="w-20 min-w-[80px] py-2.5 px-1 text-center sticky left-[232px] z-40 bg-slate-100 dark:bg-slate-800 border-b border-r border-slate-300 dark:border-slate-700">
                        Rate ($) *
                      </th>
                      {/* Color Qty Column (Editable per Requirement 4) */}
                      <th className="w-28 min-w-[110px] py-2.5 px-2 text-right sticky left-[312px] z-40 bg-slate-100 dark:bg-slate-800 border-b border-r border-slate-300 dark:border-slate-700">
                        Color Qty *
                      </th>
                      <th className="w-24 min-w-[96px] py-2.5 px-2 text-center sticky left-[422px] z-40 bg-slate-100 dark:bg-slate-800 border-b border-r border-slate-300 dark:border-slate-700">
                        Row Type
                      </th>

                      {/* Dynamic Size Columns */}
                      {gridSizes.map((sz) => (
                        <th
                          key={sz}
                          className="w-20 min-w-[80px] py-2.5 px-1 text-center font-mono font-bold text-xs border-b border-r border-slate-200 dark:border-slate-700/60 bg-slate-100 dark:bg-slate-800 group"
                        >
                          <div className="flex items-center justify-center gap-1">
                            <span>{sz}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCustomSize(sz)}
                              className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-all"
                              title={`Remove size '${sz}' column`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </th>
                      ))}

                      {/* Row Total */}
                      <th className="w-28 min-w-[112px] py-2.5 px-2 text-center border-b border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {modalBreakdownData.colorBreakdowns.map((c, cIdx) => {
                      const sizeWiseTotal = c.sizeRows.reduce((a, s) => a + (Number(s.quantity) || 0), 0);
                      const isSelected = selectedBreakdownColorIds.includes(c.id);
                      const totalRatioForColor = gridSizes.reduce((acc, sz) => {
                        const r = c.sizeRows.find((s) => s.size === sz);
                        return acc + (r ? Math.max(0, Number(r.ratio) || 0) : 1);
                      }, 0);

                      const colorTargetQty = Number(c.quantity) || 0;
                      const isColorMatched = colorTargetQty === sizeWiseTotal && colorTargetQty > 0;
                      const hasDiscrepancy = colorTargetQty > 0 && colorTargetQty !== sizeWiseTotal;

                      const colorBorderAccent =
                        cIdx % 4 === 0
                          ? "border-l-4 border-l-teal-500"
                          : cIdx % 4 === 1
                          ? "border-l-4 border-l-blue-500"
                          : cIdx % 4 === 2
                          ? "border-l-4 border-l-purple-500"
                          : "border-l-4 border-l-amber-500";

                      return (
                        <Fragment key={c.id}>
                          {/* Row 1: Ratio Row */}
                          <tr className="hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10">
                            {/* 1. Select Checkbox (rowSpan 2) */}
                            <td
                              rowSpan={2}
                              className={`w-9 min-w-[36px] max-w-[36px] p-1 text-center align-middle sticky left-0 z-20 bg-white dark:bg-slate-900 border-r border-b border-slate-200 dark:border-slate-800 ${colorBorderAccent}`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedBreakdownColorIds([...selectedBreakdownColorIds, c.id]);
                                  } else {
                                    setSelectedBreakdownColorIds(
                                      selectedBreakdownColorIds.filter((id) => id !== c.id)
                                    );
                                  }
                                }}
                                className="rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                              />
                            </td>

                            {/* 2. Delete Color Button (rowSpan 2) */}
                            <td
                              rowSpan={2}
                              className="w-9 min-w-[36px] max-w-[36px] p-1 text-center align-middle sticky left-[36px] z-20 bg-white dark:bg-slate-900 border-r border-b border-slate-200 dark:border-slate-800"
                            >
                              <button
                                type="button"
                                onClick={() => handleRemoveColor(cIdx)}
                                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                                title={`Remove color '${c.color}'`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>

                            {/* 3. Garments Color (rowSpan 2) */}
                            <td
                              rowSpan={2}
                              className="w-40 min-w-[160px] p-2 align-middle sticky left-[72px] z-20 bg-white dark:bg-slate-900 border-r border-b border-slate-200 dark:border-slate-800"
                            >
                              <select
                                value={c.color}
                                onChange={(e) => {
                                  const updated = [...modalBreakdownData.colorBreakdowns];
                                  updated[cIdx] = { ...updated[cIdx], color: e.target.value };
                                  setModalBreakdownData({ ...modalBreakdownData, colorBreakdowns: updated });
                                  setIsModalDirty(true);
                                }}
                                className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-xs text-slate-800 dark:text-slate-100 shadow-sm"
                              >
                                {AVAILABLE_GARMENT_COLORS.map((colName) => (
                                  <option key={colName} value={colName}>
                                    {colName}
                                  </option>
                                ))}
                              </select>
                            </td>

                            {/* 4. Color-Level Rate ($) (rowSpan 2 - Retained per Section 3 & 4) */}
                            <td
                              rowSpan={2}
                              className="w-20 min-w-[80px] p-2 align-middle sticky left-[232px] z-20 bg-white dark:bg-slate-900 border-r border-b border-slate-200 dark:border-slate-800"
                            >
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={c.rate}
                                onChange={(e) => {
                                  const val = Math.max(0, parseFloat(e.target.value) || 0);
                                  const updated = [...modalBreakdownData.colorBreakdowns];
                                  const updatedRows = updated[cIdx].sizeRows.map((sr) => ({
                                    ...sr,
                                    rate: val,
                                    total: (Number(sr.quantity) || 0) * val,
                                  }));
                                  updated[cIdx] = { ...updated[cIdx], rate: val, sizeRows: updatedRows };
                                  setModalBreakdownData({ ...modalBreakdownData, colorBreakdowns: updated });
                                  setIsModalDirty(true);
                                }}
                                className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-center text-xs shadow-sm font-semibold"
                              />
                            </td>

                            {/* 5. Color Qty (EDITABLE per Requirement 4) */}
                            <td
                              rowSpan={2}
                              className="w-28 min-w-[110px] p-2 align-middle sticky left-[312px] z-20 bg-white dark:bg-slate-900 border-r border-b border-slate-200 dark:border-slate-800"
                            >
                              <div className="space-y-1">
                                <input
                                  type="number"
                                  min="0"
                                  value={c.quantity}
                                  onChange={(e) => handleColorQtyChange(cIdx, parseInt(e.target.value) || 0)}
                                  className="w-full py-1 px-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-extrabold text-xs text-right text-slate-900 dark:text-slate-100 shadow-sm focus:ring-2 focus:ring-teal-500"
                                  title={`Enter target Color Qty for ${c.color}`}
                                />
                                <div className="text-[10px] leading-tight flex flex-col items-end">
                                  <div className="flex items-center gap-1 font-mono">
                                    <span className="text-slate-400">Size:</span>
                                    <span
                                      className={`font-bold ${
                                        isColorMatched
                                          ? "text-emerald-600 dark:text-emerald-400"
                                          : hasDiscrepancy
                                          ? "text-amber-600 dark:text-amber-400"
                                          : "text-slate-500"
                                      }`}
                                    >
                                      {sizeWiseTotal.toLocaleString()}
                                    </span>
                                  </div>
                                  {hasDiscrepancy && (
                                    <span
                                      className="text-[9px] font-bold text-rose-500 font-mono"
                                      title={`Color Qty is ${colorTargetQty.toLocaleString()} pcs, but size-wise total is ${sizeWiseTotal.toLocaleString()} pcs (Diff: ${Math.abs(colorTargetQty - sizeWiseTotal).toLocaleString()} pcs)`}
                                    >
                                      Δ {sizeWiseTotal < colorTargetQty ? `-${(colorTargetQty - sizeWiseTotal).toLocaleString()}` : `+${(sizeWiseTotal - colorTargetQty).toLocaleString()}`}
                                    </span>
                                  )}
                                  {isColorMatched && (
                                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                                      ✓ Matched
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* 6. Row Type: Ratio */}
                            <td className="w-24 min-w-[96px] p-1.5 text-center sticky left-[422px] z-20 bg-indigo-50/50 dark:bg-indigo-950/30 border-r border-b border-slate-200 dark:border-slate-800">
                              <div className="flex items-center justify-between px-1">
                                <span className="px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px]">
                                  Ratio
                                </span>
                                <div className="flex items-center gap-0.5">
                                  <button
                                    type="button"
                                    onClick={() => handleDistributeColorByRatio(cIdx)}
                                    className="p-1 text-teal-600 hover:text-teal-800 dark:text-teal-400 rounded hover:bg-teal-100 dark:hover:bg-teal-900/40"
                                    title={`Distribute ${colorTargetQty.toLocaleString()} pcs by ratio for ${c.color}`}
                                  >
                                    <Sparkles className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenRatioModal(cIdx)}
                                    className="p-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
                                    title={`Adjust ratio dialog for ${c.color}`}
                                  >
                                    <Calculator className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </td>

                            {/* Size Ratio Inputs */}
                            {gridSizes.map((sz) => {
                              const sizeRow = c.sizeRows.find((s) => s.size === sz);
                              const ratioVal = sizeRow ? sizeRow.ratio : 1;

                              return (
                                <td
                                  key={`ratio-${sz}`}
                                  className="w-20 min-w-[80px] p-1 border-r border-b border-slate-100 dark:border-slate-800/80 bg-indigo-50/20 dark:bg-indigo-950/10"
                                >
                                  <input
                                    type="number"
                                    min="0"
                                    value={ratioVal}
                                    onChange={(e) =>
                                      handleUpdateSizeCell(
                                        cIdx,
                                        sz,
                                        "ratio",
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    className="w-full text-center p-1 rounded border border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-slate-800 font-mono text-xs text-indigo-900 dark:text-indigo-200"
                                  />
                                </td>
                              );
                            })}

                            {/* Row Total: Ratio Sum */}
                            <td className="w-28 min-w-[112px] p-2 text-center font-mono font-bold text-xs text-indigo-700 dark:text-indigo-300 border-b border-slate-200 dark:border-slate-800 bg-indigo-50/20 dark:bg-indigo-950/10">
                              {totalRatioForColor} (Σ)
                            </td>
                          </tr>

                          {/* Row 2: Qty Row (Left 5 cells spanned from Row 1) */}
                          <tr className="hover:bg-teal-50/20 dark:hover:bg-teal-950/10">
                            {/* Row Type: Qty */}
                            <td className="w-24 min-w-[96px] p-1.5 text-center sticky left-[422px] z-20 bg-teal-50/50 dark:bg-teal-950/30 border-r border-b border-slate-200 dark:border-slate-800">
                              <span className="px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold text-[10px]">
                                Qty
                              </span>
                            </td>

                            {/* Size Qty Inputs */}
                            {gridSizes.map((sz) => {
                              const sizeRow = c.sizeRows.find((s) => s.size === sz);
                              const qtyVal = sizeRow ? sizeRow.quantity : 0;

                              return (
                                <td
                                  key={`qty-${sz}`}
                                  className="w-20 min-w-[80px] p-1 border-r border-b border-slate-100 dark:border-slate-800/80 bg-teal-50/20 dark:bg-teal-950/10"
                                >
                                  <input
                                    type="number"
                                    min="0"
                                    value={qtyVal}
                                    onChange={(e) =>
                                      handleUpdateSizeCell(
                                        cIdx,
                                        sz,
                                        "quantity",
                                        parseInt(e.target.value) || 0
                                      )
                                    }
                                    className="w-full text-center p-1 rounded border border-teal-300 dark:border-teal-700 bg-white dark:bg-slate-800 font-mono font-bold text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-teal-500"
                                  />
                                </td>
                              );
                            })}

                            {/* Row Total: Size Total for this color */}
                            <td className="w-28 min-w-[112px] p-2 text-center font-mono font-extrabold text-xs text-teal-700 dark:text-teal-300 border-b border-slate-200 dark:border-slate-800 bg-teal-50/20 dark:bg-teal-950/10">
                              {sizeWiseTotal.toLocaleString()} pcs
                            </td>
                          </tr>
                        </Fragment>
                      );
                    })}
                  </tbody>

                  {/* Table Footer: Column totals */}
                  <tfoot className="sticky bottom-0 z-30 bg-slate-100 dark:bg-slate-800 border-t-2 border-slate-300 dark:border-slate-700 font-bold text-xs shadow-md">
                    <tr>
                      <td
                        colSpan={5}
                        className="py-2.5 px-3 sticky left-0 z-40 bg-slate-100 dark:bg-slate-800 border-r border-slate-300 dark:border-slate-700 text-right uppercase tracking-wider text-[11px] text-slate-700 dark:text-slate-300"
                      >
                        <span>TOTAL COLOR QTY:</span>
                        <span className="font-mono font-extrabold text-sm text-teal-700 dark:text-teal-300 ml-2">
                          {totalTargetColorQty.toLocaleString()} pcs
                        </span>
                      </td>

                      <td className="py-2.5 px-2 text-center sticky left-[422px] z-40 bg-slate-100 dark:bg-slate-800 border-r border-slate-300 dark:border-slate-700 uppercase tracking-wider text-[10px] text-slate-600 dark:text-slate-400">
                        TOTAL SIZE
                      </td>

                      {gridSizes.map((sz) => (
                        <td
                          key={`tot-${sz}`}
                          className="py-2.5 px-1 text-center font-mono font-extrabold text-xs text-teal-700 dark:text-teal-300 border-r border-slate-200 dark:border-slate-700/60"
                        >
                          {(sizeTotals[sz] || 0).toLocaleString()}
                        </td>
                      ))}

                      <td className="py-2.5 px-2 text-center font-mono font-extrabold text-xs text-teal-700 dark:text-teal-300">
                        {totalSizeQty.toLocaleString()} pcs
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* ──────────────────────────────────────────────────────────── */}
              {/* SECTION 9: QUANTITY RECONCILIATION SUMMARY BAR               */}
              {/* ──────────────────────────────────────────────────────────── */}
              <div
                className={`py-2 px-3 rounded-xl border flex flex-col gap-2 text-xs my-2 ${
                  totalActualSizeQty === Number(activePoForBreakdown.qty) &&
                  totalTargetColorQty === Number(activePoForBreakdown.qty) &&
                  colorMismatches.length === 0
                    ? "bg-emerald-50 border-emerald-300 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300"
                    : totalActualSizeQty > Number(activePoForBreakdown.qty) || totalTargetColorQty > Number(activePoForBreakdown.qty)
                    ? "bg-rose-50 border-rose-300 text-rose-900 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300"
                    : "bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider opacity-70">Selected PO</span>
                      <span className="font-mono font-bold text-xs">{activePoForBreakdown.poNumber}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider opacity-70">Target PO Qty</span>
                      <span className="font-mono font-bold text-xs">
                        {Number(activePoForBreakdown.qty).toLocaleString()} pcs
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider opacity-70">
                        Total Color Qty
                      </span>
                      <span className="font-mono font-extrabold text-xs">{totalTargetColorQty.toLocaleString()} pcs</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider opacity-70">
                        Total Size Qty
                      </span>
                      <span className="font-mono font-extrabold text-xs">{totalSizeQty.toLocaleString()} pcs</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider opacity-70">
                        Remaining Balance
                      </span>
                      <span className="font-mono font-bold text-xs">
                        {modalRemainingQty >= 0
                          ? `${modalRemainingQty.toLocaleString()} pcs`
                          : `OVERRUN by ${Math.abs(modalRemainingQty).toLocaleString()} pcs`}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        totalActualSizeQty === Number(activePoForBreakdown.qty) &&
                        totalTargetColorQty === Number(activePoForBreakdown.qty) &&
                        colorMismatches.length === 0
                          ? "bg-emerald-200 text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100"
                          : totalActualSizeQty > Number(activePoForBreakdown.qty) || totalTargetColorQty > Number(activePoForBreakdown.qty)
                          ? "bg-rose-200 text-rose-900 dark:bg-rose-800 dark:text-rose-100"
                          : "bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100"
                      }`}
                    >
                      {totalActualSizeQty === Number(activePoForBreakdown.qty) &&
                      totalTargetColorQty === Number(activePoForBreakdown.qty) &&
                      colorMismatches.length === 0
                        ? "✓ 100% Fully Reconciled"
                        : totalActualSizeQty > Number(activePoForBreakdown.qty) || totalTargetColorQty > Number(activePoForBreakdown.qty)
                        ? "⛔ Over-allocation Blocked"
                        : colorMismatches.length > 0
                        ? `⚠ Color Qty Mismatch (${colorMismatches.length} color${colorMismatches.length > 1 ? "s" : ""})`
                        : `⚠ Incomplete Allocation (Remaining: ${modalRemainingQty.toLocaleString()} pcs)`}
                    </span>
                  </div>
                </div>

                {/* Scenario B: Detailed Color Mismatch Breakdown Notice */}
                {colorMismatches.length > 0 && (
                  <div className="pt-2 border-t border-amber-200/80 dark:border-amber-800/80 text-[11px]">
                    <span className="font-bold text-amber-900 dark:text-amber-200 block mb-0.5">
                      ⚠ Color-wise Quantity Discrepancy (Scenario B):
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-amber-800 dark:text-amber-300 font-mono">
                      {colorMismatches.map((m) => (
                        <li key={m.color}>
                          <strong>{m.color}:</strong> Color Qty is {m.colorQty.toLocaleString()} pcs, but the size-wise total is {m.sizeTotal.toLocaleString()} pcs. Difference: {m.diff.toLocaleString()} pcs.
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* ──────────────────────────────────────────────────────────── */}
              {/* SECTION 12: SAVE AND BACK BUTTONS                            */}
              {/* ──────────────────────────────────────────────────────────── */}
              <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-2.5">
                <button
                  type="button"
                  onClick={handleModalCloseAttempt}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-colors"
                >
                  Back / Discard
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">
                    Allocated: <strong>{totalSizeQty.toLocaleString()}</strong> of{" "}
                    <strong>{Number(activePoForBreakdown.qty).toLocaleString()} pcs</strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleModalSaveBreakdown}
                    disabled={totalActualSizeQty > Number(activePoForBreakdown.qty) || totalTargetColorQty > Number(activePoForBreakdown.qty)}
                    className={`px-5 py-2 rounded-lg text-xs font-bold text-white shadow-sm flex items-center gap-1.5 transition-all ${
                      totalActualSizeQty > Number(activePoForBreakdown.qty) || totalTargetColorQty > Number(activePoForBreakdown.qty)
                        ? "bg-slate-400 cursor-not-allowed opacity-60"
                        : totalActualSizeQty === Number(activePoForBreakdown.qty) && colorMismatches.length === 0
                        ? "bg-teal-600 hover:bg-teal-700 cursor-pointer shadow-teal-500/20"
                        : "bg-amber-600 hover:bg-amber-700 cursor-pointer shadow-amber-500/20"
                    }`}
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>
                      {modalBreakdownTotal === Number(activePoForBreakdown.qty)
                        ? "Save Breakdown (Matched ✓)"
                        : "Save Breakdown (Draft ⚠)"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* RATIO WISE QTY CHANGE MODAL DIALOG (SECTION 5)                     */}
        {/* ────────────────────────────────────────────────────────────────── */}
        {showRatioModal && modalBreakdownData && activePoForBreakdown && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-indigo-600" />
                  <span>Ratio-wise Quantity Allocation</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowRatioModal(false)}
                  className="p-1 rounded hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {/* 1. Target Color */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Target Garment Color:
                  </label>
                  <select
                    value={ratioTargetColorIndex}
                    onChange={(e) => {
                      const idx = parseInt(e.target.value) || 0;
                      setRatioTargetColorIndex(idx);
                      const col = modalBreakdownData.colorBreakdowns[idx];
                      if (col) {
                        setRatioTargetQty(
                          col.quantity > 0
                            ? col.quantity
                            : modalRemainingQty > 0
                            ? modalRemainingQty
                            : Number(activePoForBreakdown.qty)
                        );
                        const initR: Record<string, number> = {};
                        gridSizes.forEach((sz) => {
                          const sRow = col.sizeRows.find((s) => s.size === sz);
                          initR[sz] = sRow && sRow.ratio !== undefined ? sRow.ratio : 1;
                        });
                        setRatioWorkingValues(initR);
                      }
                    }}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  >
                    {modalBreakdownData.colorBreakdowns.map((col, idx) => (
                      <option key={col.id} value={idx}>
                        {col.color} ({col.sizeRows.reduce((a, s) => a + (Number(s.quantity) || 0), 0).toLocaleString()} pcs)
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Total Quantity to Distribute */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Total Quantity to Allocate (pcs):
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={ratioTargetQty}
                    onChange={(e) => setRatioTargetQty(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full p-2 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-800 font-mono font-extrabold text-sm text-indigo-700 dark:text-indigo-300"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    PO Qty: <strong>{Number(activePoForBreakdown.qty).toLocaleString()} pcs</strong> | Remaining:{" "}
                    <strong>{modalRemainingQty.toLocaleString()} pcs</strong>
                  </p>
                </div>

                {/* 3. Size Ratios Inputs */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Configure Size Ratios:</label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          const reset: Record<string, number> = {};
                          gridSizes.forEach((sz) => (reset[sz] = 1));
                          setRatioWorkingValues(reset);
                        }}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600"
                      >
                        All 1
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const custom: Record<string, number> = {};
                          gridSizes.forEach((sz, idx) => {
                            if (idx === 0 || idx === gridSizes.length - 1) custom[sz] = 1;
                            else custom[sz] = 2;
                          });
                          setRatioWorkingValues(custom);
                        }}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600"
                      >
                        1:2:1 Curve
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-800/40 max-h-36 overflow-y-auto">
                    {gridSizes.map((sz) => (
                      <div key={sz} className="text-center">
                        <span className="block font-bold text-slate-600 dark:text-slate-400 text-[11px] mb-0.5">
                          {sz}
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={ratioWorkingValues[sz] !== undefined ? ratioWorkingValues[sz] : 1}
                          onChange={(e) => {
                            setRatioWorkingValues({
                              ...ratioWorkingValues,
                              [sz]: Math.max(0, parseFloat(e.target.value) || 0),
                            });
                          }}
                          className="w-full text-center p-1 rounded border border-slate-300 dark:border-slate-600 font-mono font-bold text-xs bg-white dark:bg-slate-800"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Live Calculation Preview */}
                <div className="p-2.5 rounded-lg border bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/40">
                  <span className="font-bold text-indigo-900 dark:text-indigo-200 text-[11px] block mb-1">
                    Calculated Proportional Allocation (Whole Pieces):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {distributeQtyByRatio(
                      ratioTargetQty,
                      gridSizes.map((sz) => ({
                        size: sz,
                        ratio: Math.max(0, Number(ratioWorkingValues[sz]) || 0),
                      }))
                    ).map((alloc) => (
                      <span
                        key={alloc.size}
                        className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-[11px] font-mono"
                      >
                        <strong>{alloc.size}:</strong> {alloc.quantity.toLocaleString()} pcs
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowRatioModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyRatioModal}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply &amp; Recalculate</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Discard Confirmation Guard */}
        {showDiscardConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-sm w-full p-4 border shadow-xl space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Unsaved Changes in PO Breakdown
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                You have modified size or color quantities in this breakdown. Closing now will discard those edits.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowDiscardConfirm(false)}
                  className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Continue Editing
                </button>
                <button
                  onClick={() => {
                    setShowDiscardConfirm(false);
                    setActivePoForBreakdown(null);
                    setModalBreakdownData(null);
                    setIsModalDirty(false);
                  }}
                  className="px-3 py-1.5 rounded text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
                >
                  Discard Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* SECONDARY MODALS (SECTION 13 SCREENSHOT ACTIONS)                   */}
        {/* ================================================================== */}

        {/* 1. REPORT MODAL */}
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-3xl w-full p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Printer className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-bold">Commercial Order Entry Specification & Spec Sheet</h3>
                </div>
                <button onClick={() => setShowReportModal(false)} className="p-1 rounded hover:bg-slate-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border text-xs space-y-3 font-sans">
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white block">
                      {formBeneficiaryCompany}
                    </span>
                    <span className="text-slate-500">Commercial Merchandising Division — Production Order Card</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-teal-600 text-sm block">{editingOrderId ? "EDIT-ORDER" : "NEW-ORDER"}</span>
                    <span className="text-[10px] text-slate-400">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">BUYER:</span>
                    <span className="font-bold">{formBuyer}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">BUYER DEPT:</span>
                    <span className="font-bold">{formBuyerDept}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">LOCAL AGENT:</span>
                    <span className="font-bold">{formLocalAgent}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">STYLE NO:</span>
                    <span className="font-bold font-mono">{formStyle}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">GMT ITEM:</span>
                    <span className="font-bold">{formGmtItem}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">ORDER QUANTITY:</span>
                    <span className="font-bold font-mono text-teal-700">{formOrderQty.toLocaleString()} pcs</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">UNIT PRICE (FOB):</span>
                    <span className="font-bold font-mono text-emerald-600">${formUnitPrice.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">TOTAL VALUE:</span>
                    <span className="font-bold font-mono text-slate-900 dark:text-white">
                      ${(formOrderQty * formUnitPrice).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">SHIPMENT DATE:</span>
                    <span className="font-bold font-mono">{formDelDt}</span>
                  </div>
                </div>

                <div className="border-t pt-2">
                  <span className="font-bold block mb-1">PO Details Breakdown:</span>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px] text-left">
                      <thead className="bg-slate-200 dark:bg-slate-700 font-bold">
                        <tr>
                          <th className="p-1">PO No</th>
                          <th className="p-1 text-right">PO Qty</th>
                          <th className="p-1">LOT#</th>
                          <th className="p-1">Country</th>
                          <th className="p-1">Shipment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {poDetails.map((p) => (
                          <tr key={p.id} className="border-b">
                            <td className="p-1 font-mono font-bold">{p.poNumber}</td>
                            <td className="p-1 text-right font-mono">{p.qty.toLocaleString()} pcs</td>
                            <td className="p-1 font-mono">{p.lot}</td>
                            <td className="p-1">{p.destCountry}</td>
                            <td className="p-1 font-mono">{p.delDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-3 py-1.5 rounded text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Report
                </button>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. VIEW ORDER MODAL */}
        {showViewOrderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-500" />
                  Order Master Summary Card ({formOurRef})
                </h3>
                <button onClick={() => setShowViewOrderModal(false)} className="p-1 rounded hover:bg-slate-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/50 border">
                  <span className="text-[10px] text-slate-400 block font-bold">ORDER TYPE</span>
                  <span className="font-bold">{formOrderType} ({entryMode})</span>
                </div>
                <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/50 border">
                  <span className="text-[10px] text-slate-400 block font-bold">ORDER STATUS</span>
                  <span className="font-bold text-emerald-600">{formOrderStatus}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/50 border">
                  <span className="text-[10px] text-slate-400 block font-bold">MERCHAN.</span>
                  <span className="font-bold">{formMerchan}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/50 border">
                  <span className="text-[10px] text-slate-400 block font-bold">PAY TERM</span>
                  <span className="font-bold">{formPayTerm}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/50 border">
                  <span className="text-[10px] text-slate-400 block font-bold">EXTRA CUTTING</span>
                  <span className="font-bold">{formExtraCuttingPct}%</span>
                </div>
                <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/50 border">
                  <span className="text-[10px] text-slate-400 block font-bold">PACK TYPE</span>
                  <span className="font-bold">{formPackType}</span>
                </div>
              </div>

              <div className="p-3 rounded bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-xs">
                <span className="font-bold text-teal-800 dark:text-teal-300 block mb-1">Production Guidelines:</span>
                <p className="text-slate-600 dark:text-slate-400">{formInstructionDetail}</p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowViewOrderModal(false)}
                  className="px-4 py-1.5 rounded text-xs font-bold bg-teal-600 text-white"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. ALL DATA MODAL */}
        {showAllDataModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-5xl w-full p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  All Data — Consolidated Commercial Orders Grid
                </h3>
                <button onClick={() => setShowAllDataModal(false)} className="p-1 rounded hover:bg-slate-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] uppercase font-bold text-slate-500">
                    <tr>
                      <th className="p-2">Order No</th>
                      <th className="p-2">Our Ref</th>
                      <th className="p-2">Buyer</th>
                      <th className="p-2">Dept</th>
                      <th className="p-2">Style</th>
                      <th className="p-2 text-right">Order Qty</th>
                      <th className="p-2 text-right">FOB Price</th>
                      <th className="p-2">Country</th>
                      <th className="p-2">Del DT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-xs font-mono">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-2 font-bold text-teal-600">{o.orderNo}</td>
                        <td className="p-2">{o.ourRef || o.merchandisingRef}</td>
                        <td className="p-2 font-sans font-semibold">{o.buyerName}</td>
                        <td className="p-2 font-sans">{o.buyerDepartment}</td>
                        <td className="p-2 font-bold">{o.styleNo}</td>
                        <td className="p-2 text-right font-bold">{o.orderQuantity.toLocaleString()}</td>
                        <td className="p-2 text-right text-emerald-600">${o.fobUnitPrice.toFixed(2)}</td>
                        <td className="p-2 font-sans">{o.destinationCountry}</td>
                        <td className="p-2">{o.delDate || o.shipmentDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. STATUS MODAL */}
        {showStatusModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-xs font-bold flex items-center gap-2">
                  <Info className="w-4 h-4 text-teal-500" /> Order Lifecycle Status Guide
                </h3>
                <button onClick={() => setShowStatusModal(false)} className="p-1 rounded hover:bg-slate-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 block">Quantity Matched / Confirmed:</span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">
                    All Color, Size, PO, Delivery Lot, and Country breakdown totals strictly equal the Order Quantity.
                  </span>
                </div>
                <div className="p-2 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200">
                  <span className="font-bold text-amber-800 dark:text-amber-300 block">Draft / Incomplete:</span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">
                    Breakdowns are under-allocated during initial data entry. Allowed as Draft, but blocked from final confirmation.
                  </span>
                </div>
                <div className="p-2 rounded bg-rose-50 dark:bg-rose-950/30 border border-rose-200">
                  <span className="font-bold text-rose-800 dark:text-rose-300 block">Over-allocation (Blocked):</span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">
                    Breakdown sum strictly cannot exceed PO Quantity. Active barrier actively rejects overruns.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. SIZE LIST MASTER MODAL */}
        {showSizeListModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-xs font-bold flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-500" /> Buyer Department Size Master Sets
                </h3>
                <button onClick={() => setShowSizeListModal(false)} className="p-1 rounded hover:bg-slate-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {Object.entries(BUYER_DEPT_SIZE_SETS).map(([name, sizeArr]) => (
                  <div key={name} className="p-2.5 rounded border bg-slate-50 dark:bg-slate-800/40">
                    <span className="font-bold block text-slate-900 dark:text-white mb-1">{name}</span>
                    <div className="flex flex-wrap gap-1">
                      {sizeArr.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border text-[11px] font-mono font-bold"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. ATTACHMENT MODAL */}
        {showAttachmentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-xs font-bold flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-amber-500" /> Order Documents & Attachments
                </h3>
                <button onClick={() => setShowAttachmentModal(false)} className="p-1 rounded hover:bg-slate-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded border border-dashed text-center bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100">
                  <Paperclip className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="font-bold block">Upload Tech Pack / Buyer PO PDF</span>
                  <span className="text-[10px] text-slate-400">PDF, JPG, PNG up to 25MB</span>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="p-2 rounded border bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-xs">
                    <span className="font-medium">Tech_Pack_Spec_Sheet_v2.pdf</span>
                    <span className="text-[10px] text-slate-400">4.2 MB</span>
                  </div>
                  <div className="p-2 rounded border bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-xs">
                    <span className="font-medium">Gold_Seal_Sample_Approval.jpg</span>
                    <span className="text-[10px] text-slate-400">1.8 MB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. ORDER COLOR MODAL */}
        {showOrderColorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-xs font-bold flex items-center gap-2">
                  <Palette className="w-4 h-4 text-rose-500" /> Order Color Allocation Distribution
                </h3>
                <button onClick={() => setShowOrderColorModal(false)} className="p-1 rounded hover:bg-slate-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {poDetails.flatMap((p) => p.breakdown?.colorBreakdowns || []).length === 0 ? (
                  <p className="text-slate-400 text-center py-4">No color breakdown records entered yet.</p>
                ) : (
                  poDetails.flatMap((p) => p.breakdown?.colorBreakdowns || []).map((c, i) => (
                    <div key={i} className="p-2 rounded border bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                      <span className="font-bold">{c.color}</span>
                      <span className="font-mono font-bold text-teal-600">
                        {c.sizeRows.reduce((a, s) => a + (Number(s.quantity) || 0), 0).toLocaleString()} pcs
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* 8. FABRIC REQUIREMENT DETAILS MODAL */}
        {showFabricReqModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-xs font-bold flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-600" /> Fabric Requirement Details
                </h3>
                <button onClick={() => setShowFabricReqModal(false)} className="p-1 rounded hover:bg-slate-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/50 border text-xs space-y-2">
                <p className="font-medium text-slate-700 dark:text-slate-300">{formFabricReq}</p>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t text-[11px]">
                  <div>
                    <span className="text-slate-400 block">ESTIMATED YIELD:</span>
                    <span className="font-bold">4.20 kg / dozen</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">NOMINATED MILL:</span>
                    <span className="font-bold">Ha-Meem Mills / Square</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 9. ACCESSORIES REQUIREMENT DETAILS MODAL */}
        {showAccReqModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-xs font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-600" /> Accessories Requirement Details
                </h3>
                <button onClick={() => setShowAccReqModal(false)} className="p-1 rounded hover:bg-slate-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/50 border text-xs space-y-2">
                <p className="font-medium text-slate-700 dark:text-slate-300">{formAccReq}</p>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t text-[11px]">
                  <div>
                    <span className="text-slate-400 block">ZIPPER NOMINEE:</span>
                    <span className="font-bold">YKK Fastening BD</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">LABEL NOMINEE:</span>
                    <span className="font-bold">Avery Dennison BD</span>
                  </div>
                </div>

                <div className="pt-3 border-t flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Form: <strong>GR_1308: Accessories Estimation</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAccReqModal(false);
                      handleOpenAccessoriesEstimation();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Open Accessories Estimation (GR_1308) →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 10. MODAL: FOB UPDATE BY AUTHORIZED ROLE */}
        {fobEditOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <Lock className="w-4 h-4 text-amber-500" />
                <span>Authorized FOB Modification ({fobEditOrder.orderNo})</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Current FOB:{" "}
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ${fobEditOrder.fobUnitPrice.toFixed(2)}
                </span>
                . FOB changes are strictly tracked in the order audit log.
              </p>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  New FOB Unit Price ($):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newFobValue}
                  onChange={(e) => setNewFobValue(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 font-mono font-bold text-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mandatory Commercial Justification Reason:
                </label>
                <textarea
                  rows={3}
                  value={fobChangeReason}
                  onChange={(e) => setFobChangeReason(e.target.value)}
                  placeholder="e.g. Revised buyer price agreed after air freight concession..."
                  className="w-full text-xs p-2.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setFobEditOrder(null)}
                  className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFobUpdate}
                  className="px-4 py-1.5 rounded text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white"
                >
                  Save FOB with Audit Entry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODAL 1: PRE-COSTING SELECTION TABLE MODAL (Requirement 2.2 B)    */}
        {/* ================================================================= */}
        {showPreCostingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-600/10 text-teal-600 flex items-center justify-center font-bold">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Select Pre-Costing Reference
                    </h3>
                    <p className="text-xs text-slate-500">
                      Select an approved pre-costing record to auto-populate order particulars
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPreCostingModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search bar */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={preCostingSearch}
                    onChange={(e) => setPreCostingSearch(e.target.value)}
                    placeholder="Search by Costing No., Job No., Style, Buyer..."
                    className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="flex-1 overflow-auto p-4">
                <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-semibold">
                    <tr>
                      <th className="p-2.5 border-b">Costing No.</th>
                      <th className="p-2.5 border-b">Job No.</th>
                      <th className="p-2.5 border-b">Buyer</th>
                      <th className="p-2.5 border-b">Style</th>
                      <th className="p-2.5 border-b text-right">Order Qty</th>
                      <th className="p-2.5 border-b text-right">Value</th>
                      <th className="p-2.5 border-b text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {MMRepository.getPreCostings()
                      .filter((pc) => {
                        const q = preCostingSearch.toLowerCase();
                        return (
                          pc.preCostId.toLowerCase().includes(q) ||
                          (pc.jobNo && pc.jobNo.toLowerCase().includes(q)) ||
                          pc.buyerName.toLowerCase().includes(q) ||
                          pc.styleNo.toLowerCase().includes(q)
                        );
                      })
                      .map((pc) => (
                        <tr
                          key={pc.preCostId}
                          className="hover:bg-teal-50/50 dark:hover:bg-teal-950/20 transition-colors"
                        >
                          <td className="p-2.5 font-mono font-bold text-teal-600 dark:text-teal-400">
                            {pc.preCostId}
                          </td>
                          <td className="p-2.5 font-mono">{pc.jobNo || "—"}</td>
                          <td className="p-2.5 font-medium">{pc.buyerName}</td>
                          <td className="p-2.5">{pc.styleNo}</td>
                          <td className="p-2.5 text-right font-mono">
                            {(pc.orderQuantity || 0).toLocaleString()} pcs
                          </td>
                          <td className="p-2.5 text-right font-mono font-bold text-emerald-600">
                            {currencySymbol}{(pc.totalOrderValue || 0).toLocaleString()}
                          </td>
                          <td className="p-2.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleApplyPreCosting(pc)}
                              className="px-3 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white font-semibold text-[11px] shadow-sm transition-all"
                            >
                              Select
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPreCostingModal(false)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODAL 2: SEARCHABLE BUYER MODAL (Requirement 3.3 & 3.7)           */}
        {/* ================================================================= */}
        {showBuyerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-600" />
                  Select Buyer
                </h3>
                <button
                  type="button"
                  onClick={() => setShowBuyerModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={buyerSearch}
                    onChange={(e) => setBuyerSearch(e.target.value)}
                    placeholder="Search by Buyer Name, Country, Account Holder..."
                    className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-auto p-4">
                <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-semibold">
                    <tr>
                      <th className="p-2.5 border-b">Buyer Name</th>
                      <th className="p-2.5 border-b">A/C Holder</th>
                      <th className="p-2.5 border-b text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {MM_BUYERS_MASTER.filter(
                      (b) =>
                        b.name.toLowerCase().includes(buyerSearch.toLowerCase()) ||
                        b.accountHolder.toLowerCase().includes(buyerSearch.toLowerCase())
                    ).map((b) => (
                      <tr
                        key={b.id}
                        className="hover:bg-teal-50/50 dark:hover:bg-teal-950/20 transition-colors"
                      >
                        <td className="p-2.5 font-bold text-slate-900 dark:text-white">{b.name}</td>
                        <td className="p-2.5 font-mono text-teal-600 dark:text-teal-400">
                          {b.accountHolder}
                        </td>
                        <td className="p-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setFormBuyer(b.name);
                              setFormAcHolder(b.accountHolder);
                              if (b.departments.length > 0) {
                                setFormBuyerDept(b.departments[0].name);
                              }
                              setShowBuyerModal(false);
                              toast.info(`Selected ${b.name}. A/C Holder set to ${b.accountHolder}.`);
                            }}
                            className="px-3 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white font-semibold text-[11px]"
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowBuyerModal(false)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODAL: SEARCHABLE MERCHANT MODAL (Requirement 2.3)               */}
        {/* ================================================================= */}
        {showMerchantModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-600" />
                  Select Merchant
                </h3>
                <button
                  type="button"
                  onClick={() => setShowMerchantModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={merchantSearch}
                    onChange={(e) => setMerchantSearch(e.target.value)}
                    placeholder="Search by Merchant Name, Designation, Email..."
                    className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-auto p-4">
                <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-semibold">
                    <tr>
                      <th className="p-2.5 border-b">Merchant Name</th>
                      <th className="p-2.5 border-b">Designation</th>
                      <th className="p-2.5 border-b">Contact / Email</th>
                      <th className="p-2.5 border-b text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {MM_MERCHANTS_MASTER.filter(
                      (m) =>
                        m.name.toLowerCase().includes(merchantSearch.toLowerCase()) ||
                        m.designation.toLowerCase().includes(merchantSearch.toLowerCase()) ||
                        m.email.toLowerCase().includes(merchantSearch.toLowerCase())
                    ).map((m) => {
                      const displayName = `${m.name} (${m.designation})`;
                      const isSelected = formMerchant.includes(m.name);
                      return (
                        <tr
                          key={m.id}
                          className={`hover:bg-teal-50/50 dark:hover:bg-teal-950/20 transition-colors ${
                            isSelected ? "bg-teal-50/60 dark:bg-teal-950/40" : ""
                          }`}
                        >
                          <td className="p-2.5 font-bold text-slate-900 dark:text-white">
                            {m.name}
                            {isSelected && (
                              <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300">
                                Current
                              </span>
                            )}
                          </td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-400 font-medium">
                            {m.designation}
                          </td>
                          <td className="p-2.5 text-slate-500 font-mono text-[11px]">
                            {m.email}
                          </td>
                          <td className="p-2.5 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setFormMerchant(displayName);
                                setFormMerchan(displayName);
                                setShowMerchantModal(false);
                                toast.info(`Selected Merchant: ${m.name}`);
                              }}
                              className="px-3 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white font-semibold text-[11px]"
                            >
                              Select
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowMerchantModal(false)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODAL 3: SEARCHABLE BUYER DEPT MODAL (Requirement 3.4)             */}
        {/* ================================================================= */}
        {showBuyerDeptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[75vh] overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Select Department ({formBuyer || "All"})
                </h3>
                <button
                  type="button"
                  onClick={() => setShowBuyerDeptModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={deptSearch}
                    onChange={(e) => setDeptSearch(e.target.value)}
                    placeholder="Search departments..."
                    className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-auto p-4">
                <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-semibold">
                    <tr>
                      <th className="p-2.5 border-b">Department Name</th>
                      <th className="p-2.5 border-b text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {(() => {
                      const matchedBuyer = MM_BUYERS_MASTER.find(
                        (b) => b.name.toLowerCase() === formBuyer.toLowerCase()
                      );
                      const depts = matchedBuyer
                        ? matchedBuyer.departments.map((d) => d.name)
                        : ["Menswear Outerwear", "Ladies Woven", "Denim Casuals", "Kids Performance", "General Garments"];
                      const filtered = depts.filter((d) =>
                        d.toLowerCase().includes(deptSearch.toLowerCase())
                      );
                      return filtered.map((d, i) => (
                        <tr
                          key={i}
                          className="hover:bg-teal-50/50 dark:hover:bg-teal-950/20 transition-colors"
                        >
                          <td className="p-2.5 font-medium">{d}</td>
                          <td className="p-2.5 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setFormBuyerDept(d);
                                setShowBuyerDeptModal(false);
                              }}
                              className="px-3 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white font-semibold text-[11px]"
                            >
                              Select
                            </button>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>

              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowBuyerDeptModal(false)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODAL 4: SEARCHABLE STYLE MODAL (Requirement 4.2)                 */}
        {/* ================================================================= */}
        {showStyleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-teal-600" />
                  Select Style ({formBuyer || "All Buyers"})
                </h3>
                <button
                  type="button"
                  onClick={() => setShowStyleModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={styleSearch}
                    onChange={(e) => setStyleSearch(e.target.value)}
                    placeholder="Search styles by style number, garment item..."
                    className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-auto p-4">
                <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-semibold">
                    <tr>
                      <th className="p-2.5 border-b">Style No.</th>
                      <th className="p-2.5 border-b">Buyer</th>
                      <th className="p-2.5 border-b text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {(() => {
                      const matchedBuyer = MM_BUYERS_MASTER.find(
                        (b) => b.name.toLowerCase() === formBuyer.toLowerCase()
                      );
                      const styles = matchedBuyer
                        ? matchedBuyer.styles.map((s) => ({ ...s, buyer: matchedBuyer.name }))
                        : MM_BUYERS_MASTER.flatMap((b) =>
                            b.styles.map((s) => ({ ...s, buyer: b.name }))
                          );
                      const filtered = styles.filter(
                        (s) =>
                          s.styleNo.toLowerCase().includes(styleSearch.toLowerCase()) ||
                          s.garmentItem.toLowerCase().includes(styleSearch.toLowerCase())
                      );
                      return filtered.map((s, i) => (
                        <tr
                          key={i}
                          className="hover:bg-teal-50/50 dark:hover:bg-teal-950/20 transition-colors"
                        >
                          <td className="p-2.5 font-bold font-mono text-teal-600 dark:text-teal-400">
                            {s.styleNo}
                          </td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-400">{s.buyer}</td>
                          <td className="p-2.5 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setFormStyle(s.styleNo);
                                if (s.garmentItem) setFormGmtItem(s.garmentItem);
                                setShowStyleModal(false);
                              }}
                              className="px-3 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white font-semibold text-[11px]"
                            >
                              Select
                            </button>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>

              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowStyleModal(false)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODAL 5: SEARCHABLE GMT ITEM MODAL (Requirement 3.3)              */}
        {/* ================================================================= */}
        {showGmtItemModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[75vh] overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Select Garment Item (GMT Item)
                </h3>
                <button
                  type="button"
                  onClick={() => setShowGmtItemModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={gmtItemSearch}
                    onChange={(e) => setGmtItemSearch(e.target.value)}
                    placeholder="Search garment item..."
                    className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-auto p-4">
                <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-semibold">
                    <tr>
                      <th className="p-2.5 border-b">GMT Item</th>
                      <th className="p-2.5 border-b text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {MM_GMT_ITEMS_MASTER.filter((item) =>
                      item.name.toLowerCase().includes(gmtItemSearch.toLowerCase()) ||
                      item.category.toLowerCase().includes(gmtItemSearch.toLowerCase())
                    ).map((item, i) => (
                      <tr
                        key={i}
                        className="hover:bg-teal-50/50 dark:hover:bg-teal-950/20 transition-colors"
                      >
                        {/* Requirement 3.3: Knit and Woven labels removed from visible list */}
                        <td className="p-2.5 font-medium">
                          {item.name}
                        </td>
                        <td className="p-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setFormGmtItem(item.name);
                              setShowGmtItemModal(false);
                            }}
                            className="px-3 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white font-semibold text-[11px]"
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowGmtItemModal(false)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODAL 6: SEARCHABLE DEST COUNTRY MODAL (Requirement 8.1)          */}
        {/* ================================================================= */}
        {showCountryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-teal-600" />
                  Select Destination Country
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCountryModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    placeholder="Search country..."
                    className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-auto p-4">
                <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-semibold">
                    <tr>
                      <th className="p-2.5 border-b">Country</th>
                      <th className="p-2.5 border-b">Code</th>
                      <th className="p-2.5 border-b text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {MM_DEST_COUNTRIES_MASTER.filter(
                      (c) =>
                        c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
                        c.code.toLowerCase().includes(countrySearch.toLowerCase())
                    ).map((c) => (
                      <tr
                        key={c.code}
                        className="hover:bg-teal-50/50 dark:hover:bg-teal-950/20 transition-colors"
                      >
                        <td className="p-2.5 font-bold">{c.name}</td>
                        <td className="p-2.5 font-mono text-slate-500">{c.code}</td>
                        <td className="p-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              if (countryModalTargetPoIndex !== null && countryModalTargetPoIndex >= 0) {
                                const updated = [...poDetails];
                                updated[countryModalTargetPoIndex].destCountry = c.name;
                                updated[countryModalTargetPoIndex].destPort = c.defaultPort;
                                setPoDetails(updated);
                              } else {
                                setFormDestCountry(c.name);
                                setFormDelPort(c.defaultPort);
                              }
                              setShowCountryModal(false);
                            }}
                            className="px-3 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white font-semibold text-[11px]"
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowCountryModal(false)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODAL 7: PROCESS TEMPLATE MODAL (Requirements 5.1, 5.2, 5.3)       */}
        {/* ================================================================= */}
        {showNewProcessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-teal-600" />
                  New Manufacturing Process Template
                </h3>
                <button
                  type="button"
                  onClick={() => setShowNewProcessModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={modalTemplateName}
                  onChange={(e) => setModalTemplateName(e.target.value)}
                  placeholder="e.g. Denim Wash Sequence, Knitwear Standard..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Process Steps ({modalProcessRows.length} rows)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddModalRow}
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Row</span>
                  </button>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-semibold text-[10px] sticky top-0">
                      <tr>
                        <th className="p-2 w-12 text-center">SL</th>
                        <th className="p-2">Process Name</th>
                        <th className="p-2 w-12 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {modalProcessRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="p-2 text-center font-mono font-bold text-slate-400">
                            {row.sl}
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={row.processName}
                              onChange={(e) => {
                                const updated = [...modalProcessRows];
                                updated[idx].processName = e.target.value;
                                setModalProcessRows(updated);
                              }}
                              placeholder={`Enter process #${row.sl} (e.g. Cutting, Washing, Sewing)...`}
                              className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveModalRow(idx)}
                              disabled={modalProcessRows.length <= 1}
                              className={`p-1 rounded ${
                                modalProcessRows.length <= 1
                                  ? "text-slate-300 cursor-not-allowed"
                                  : "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                              }`}
                              title={modalProcessRows.length <= 1 ? "At least one row required" : "Remove Row"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewProcessModal(false)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNewProcessTemplate}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Template</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Optional Save Process Template Modal for backward compatibility */}
        {showSaveProcessTemplateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Save className="w-4 h-4 text-teal-600" />
                  Save Process Template
                </h3>
                <button
                  type="button"
                  onClick={() => setShowSaveProcessTemplateModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Template Name:
                </label>
                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="e.g. Knitwear Standard Sequence"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Current Process Sequence ({processList.length} steps):
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  {processList.map((p) => (
                    <span
                      key={p.sl}
                      className="px-2 py-0.5 rounded text-[11px] font-medium bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
                    >
                      {p.sl}. {p.processName}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSaveProcessTemplateModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProcessTemplate}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
                >
                  Save to Local Storage
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODAL 8: DYNAMIC ADD CUSTOM SIZES MODAL (Bulk Entry Support)      */}
        {/* ================================================================= */}
        {showAddSizeModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Add Custom Sizes
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Add one or multiple size columns in a single operation
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddSizeModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Size Names *
                </label>
                <input
                  type="text"
                  autoFocus
                  value={newCustomSizeInput}
                  onChange={(e) => setNewCustomSizeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomSizes(newCustomSizeInput);
                    }
                  }}
                  placeholder="e.g. XXL, 3XL, 4XL, 5XL"
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-xs uppercase focus:ring-2 focus:ring-teal-500"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                  Enter multiple sizes separated by commas or spaces. Example: XXL, 3XL, 4XL, 5XL
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 italic">
                  Tip: For size names containing spaces, wrap them in quotes like &quot;ONE SIZE&quot;.
                </p>
              </div>

              {/* Quick suggestion presets */}
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Suggested Size Presets (Click to append):
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                  {["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL", "8S", "8R", "8L", "10S", "10R", "10L", "12S", "12R", "12L", "14S", "14R", "14L"].map(
                    (preset) => {
                      const exists = gridSizes.some(
                        (sz) => sz.trim().toLowerCase() === preset.toLowerCase()
                      );
                      return (
                        <button
                          key={preset}
                          type="button"
                          disabled={exists}
                          onClick={() => {
                            setNewCustomSizeInput((prev) => {
                              const trimmed = prev.trim();
                              if (!trimmed) return preset;
                              if (trimmed.endsWith(",")) return `${trimmed} ${preset}`;
                              return `${trimmed}, ${preset}`;
                            });
                          }}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold transition-all ${
                            exists
                              ? "bg-slate-100 dark:bg-slate-800 text-slate-400 line-through cursor-not-allowed"
                              : "bg-slate-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-teal-950 text-slate-700 dark:text-slate-200 hover:text-teal-700 border border-slate-200 dark:border-slate-700 cursor-pointer"
                          }`}
                        >
                          {preset}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddSizeModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleAddCustomSizes(newCustomSizeInput)}
                  className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Sizes</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODAL 9: SEARCHABLE S.C / LC SELECTION MODAL (Section 8)          */}
        {/* ================================================================= */}
        {showScLcModal && scLcTargetPoIndex !== null && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Select Sales Contract / Letter of Credit (LC)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Assigning to PO:{" "}
                      <strong className="text-slate-700 dark:text-slate-300 font-mono">
                        {poDetails[scLcTargetPoIndex]?.poNumber}
                      </strong>{" "}
                      | Buyer: <strong>{formBuyer || "All Buyers"}</strong>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowScLcModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Filters */}
              <div className="py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800">
                {/* Search */}
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={scLcSearchTerm}
                    onChange={(e) => setScLcSearchTerm(e.target.value)}
                    placeholder="Search by S.C/LC No, Bank, Currency, Buyer..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                  />
                </div>

                {/* Type pills */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                  {(["All", "Sales Contract", "LC"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setScLcTypeFilter(t)}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                        scLcTypeFilter === t
                          ? "bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-sm"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Buyer Filter Toggle (Section 8.3) */}
                {formBuyer && (
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={scLcBuyerFilterOnly}
                      onChange={(e) => setScLcBuyerFilterOnly(e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>Filter by buyer &apos;{formBuyer}&apos;</span>
                  </label>
                )}
              </div>

              {/* Table */}
              <div className="flex-1 overflow-y-auto min-h-0 my-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px] sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="py-2.5 px-3">S.C/LC No.</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Buyer</th>
                      <th className="py-2.5 px-3">Bank / Amount</th>
                      <th className="py-2.5 px-3">Expiry Date</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {scLcRecords
                      .filter((rec) => {
                        if (scLcTypeFilter !== "All" && rec.type !== scLcTypeFilter) return false;
                        if (
                          scLcBuyerFilterOnly &&
                          formBuyer &&
                          !rec.buyer.toLowerCase().includes(formBuyer.toLowerCase()) &&
                          !formBuyer.toLowerCase().includes(rec.buyer.toLowerCase())
                        ) {
                          return false;
                        }
                        if (scLcSearchTerm.trim()) {
                          const q = scLcSearchTerm.toLowerCase();
                          return (
                            rec.scLcNo.toLowerCase().includes(q) ||
                            rec.bankName.toLowerCase().includes(q) ||
                            rec.buyer.toLowerCase().includes(q) ||
                            rec.currency.toLowerCase().includes(q)
                          );
                        }
                        return true;
                      })
                      .map((rec) => {
                        const isCurrent = poDetails[scLcTargetPoIndex]?.scLcNo === rec.scLcNo;
                        return (
                          <tr
                            key={rec.id}
                            className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors ${
                              isCurrent ? "bg-teal-50/40 dark:bg-teal-950/20" : ""
                            }`}
                          >
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                              {rec.scLcNo}
                            </td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  rec.type === "Sales Contract"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                                    : "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                                }`}
                              >
                                {rec.type}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">
                              {rec.buyer}
                            </td>
                            <td className="py-2.5 px-3 text-[11px] text-slate-500">
                              <div className="font-semibold text-slate-700 dark:text-slate-200">
                                {rec.currency} {rec.amount.toLocaleString()}
                              </div>
                              <div className="text-[10px] text-slate-400">{rec.bankName}</div>
                            </td>
                            <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                              {rec.expiryDate}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  rec.status === "Active"
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                    : rec.status === "Pending"
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                }`}
                              >
                                {rec.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              {isCurrent ? (
                                <span className="px-2.5 py-1 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold text-xs inline-flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Selected
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSelectScLc(rec)}
                                  className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all"
                                >
                                  Select
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  {poDetails[scLcTargetPoIndex]?.scLcNo && (
                    <button
                      type="button"
                      onClick={handleClearScLc}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs font-semibold"
                    >
                      Clear / Unlink S.C/LC
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowScLcModal(false)}
                  className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* PART E — FABRIC COLOR ENTRY MODAL                                  */}
        {/* ================================================================== */}
        {showColorEntryModal && colorEntryRowIndex !== null && feFabricRows[colorEntryRowIndex] && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 my-4">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Palette className="w-4 h-4 text-teal-600" />
                    <span>Fabric Color Entry &amp; Item Color Mapping</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Row: <strong className="text-teal-700 dark:text-teal-300">{feFabricRows[colorEntryRowIndex]?.fabricNo}</strong> ({feFabricRows[colorEntryRowIndex]?.budgetItemName}) | Order: <strong className="text-slate-700 dark:text-slate-300">{feOurRef}</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowColorEntryModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Reference Information Summary (Section 9) */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Buyer</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{feBuyer}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Our Ref</span>
                  <span className="font-mono font-bold text-teal-600 dark:text-teal-400 truncate block">{feOurRef}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Style</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{formStyle || "Basic Crew Neck"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Used Place</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{feFabricRows[colorEntryRowIndex]?.usedPlace}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Code</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate block">{feFabricRows[colorEntryRowIndex]?.code}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Fabric Description</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate block">{feFabricRows[colorEntryRowIndex]?.fabricDescription}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Width</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate block">{feFabricRows[colorEntryRowIndex]?.width}</span>
                </div>
              </div>

              {/* Color Type Selector & Single Color Entry (Section 10) */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/60">
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <label className="font-bold text-teal-900 dark:text-teal-200">Color Type:</label>
                    <select
                      value={modalColorType}
                      onChange={(e) => setModalColorType(e.target.value as "DTM" | "Contrast" | "Single Color")}
                      className="p-1.5 px-3 rounded-lg border border-teal-300 dark:border-teal-800 bg-white dark:bg-slate-800 text-xs font-bold text-teal-800 dark:text-teal-200"
                    >
                      <option value="DTM">DTM (Dye-To-Match)</option>
                      <option value="Contrast">Contrast</option>
                      <option value="Single Color">Single Color</option>
                    </select>
                  </div>

                  {/* Single Color: Color Name & P Button (Requirements 10.2 & 10.3) */}
                  {modalColorType === "Single Color" && (
                    <div className="flex items-center gap-2 animate-in fade-in">
                      <label className="font-bold text-teal-900 dark:text-teal-200">Color Name:</label>
                      <input
                        type="text"
                        value={modalSingleColor}
                        onChange={(e) => setModalSingleColor(e.target.value)}
                        placeholder="e.g. Black"
                        className="p-1.5 px-3 rounded-lg border border-teal-300 dark:border-teal-800 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 w-36 sm:w-44 focus:ring-1 focus:ring-teal-500"
                      />
                      <button
                        type="button"
                        onClick={handleApplySingleColorP}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-mono font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95"
                        title="Click P to populate Item Color with this color name"
                      >
                        P
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleImportColorsFromPO}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:bg-teal-50 text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all"
                  >
                    <Sparkles className="w-3 h-3 text-teal-500" />
                    <span>Import Order Breakdown Colors</span>
                  </button>
                </div>
              </div>

              {/* Garments Color and Item Color Mapping Grid (2-column editable table) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Garments Color &amp; Item Color Mapping
                  </h4>
                  <span className="text-[11px] text-slate-400">{modalColorMappings.length} Mappings Configured</span>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-[11px] font-bold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-2 px-3 w-12 text-center">SL</th>
                        <th className="py-2 px-3">Garments Color</th>
                        <th className="py-2 px-3">Item Color</th>
                        <th className="py-2 px-3 w-16 text-center">Remove</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {modalColorMappings.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-xs text-slate-400">
                            No color mappings added yet. Click &quot;Import Order Breakdown Colors&quot;.
                          </td>
                        </tr>
                      ) : (
                        modalColorMappings.map((cm, idx) => (
                          <tr key={cm.id || idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                            <td className="py-2 px-3 text-center font-mono text-slate-400 text-[11px]">
                              {idx + 1}
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={cm.garmentsColor}
                                readOnly
                                placeholder="System garment color"
                                className="w-full p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-not-allowed select-none"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={cm.itemColor}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setModalColorMappings((prev) =>
                                    prev.map((c, i) => (i === idx ? { ...c, itemColor: val } : c))
                                  );
                                }}
                                placeholder="Corresponding fabric item color"
                                className="w-full p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                              />
                            </td>
                            <td className="py-2 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveColorMappingRow(idx)}
                                className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                                title="Remove Color Mapping"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowColorEntryModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveColorMappings}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Apply &amp; Save Color Mappings</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* VIEW LIST MODAL (SAVED FABRIC ESTIMATIONS)                          */}
        {/* ================================================================== */}
        {showFeListModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 my-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-600" />
                    <span>Saved Fabric Estimations Library</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Open previously saved fabric estimation records or switch between order profiles.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFeListModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto max-h-[60vh]">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-[11px] font-bold border-b border-slate-200 dark:border-slate-700 sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">Our Ref / Job No</th>
                      <th className="py-2.5 px-3">Buyer</th>
                      <th className="py-2.5 px-3">Garment Item</th>
                      <th className="py-2.5 px-3 text-center">Fabric Rows</th>
                      <th className="py-2.5 px-3 text-right">Order Qty</th>
                      <th className="py-2.5 px-3">Last Saved</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {MMRepository.getFabricEstimations().length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-xs text-slate-400">
                          No saved fabric estimations found in local storage. Save your current estimation to list it here.
                        </td>
                      </tr>
                    ) : (
                      MMRepository.getFabricEstimations().map((est) => {
                        const isCurrent = est.ourRef === feOurRef;
                        return (
                          <tr
                            key={est.id}
                            className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                              isCurrent ? "bg-teal-50/50 dark:bg-teal-950/30" : ""
                            }`}
                          >
                            <td className="py-2.5 px-3 font-mono font-bold text-teal-700 dark:text-teal-300">
                              {est.ourRef}
                            </td>
                            <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-200">{est.buyer}</td>
                            <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{est.itemName}</td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-[10px]">
                                {est.fabricRows?.length || 0} Fabrics
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold">
                              {est.quantity?.toLocaleString()} {est.unit}
                            </td>
                            <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                              {est.updatedAt ? new Date(est.updatedAt).toLocaleDateString() : "Just now"}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setFeEstimationId(est.id);
                                  setFeFindQtn(est.findQtn || "");
                                  setFeFindBudget(est.findBudget || "");
                                  setFeFindOurRef(est.ourRef);
                                  setFeOrderDate(est.orderDate || "");
                                  setFeOurRef(est.ourRef);
                                  setFeBuyerRef(est.buyerRef || "");
                                  setFeBuyer(est.buyer || "");
                                  setFeItemName(est.itemName || "");
                                  setFePackingType(est.packingType || "");
                                  setFeLcBasis(est.lcBasis || "FOB");
                                  setFeQuantity(est.quantity || 20000);
                                  setFeRate(est.rate || 4.5);
                                  setFeUnit(est.unit || "Pcs");
                                  setFePlace(est.place || "Body & Trims");
                                  setFeNote(est.note || "");
                                  const allSavedBookings = MMRepository.getFabricBookings();
                                  const isGenuineBooking = Boolean(est.bookingNo && allSavedBookings.some((b) => b.bookingNo === est.bookingNo));
                                  setFeBookingNo(isGenuineBooking && est.bookingNo ? est.bookingNo : "");
                                  setFePiNo(est.piNo || "");
                                  setFeBblcNo(est.bblcNo || "");
                                  setFeFabricRows(est.fabricRows || []);
                                  setFeSelectedRowIndex(0);
                                  setShowFeListModal(false);
                                  toast.success(`Loaded Fabric Estimation: ${est.ourRef}`);
                                }}
                                className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all"
                              >
                                {isCurrent ? "Reload Record" : "Open Record"}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowFeListModal(false)}
                  className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* REQ. SHEET MODAL (PRINTABLE SPECIFICATION SHEET)                   */}
        {/* ================================================================== */}
        {showReqSheetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 my-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Printer className="w-4 h-4 text-purple-600" />
                    <span>Fabric Requirement Specification Sheet</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Official technical yield sheet for merchandising, CAD, and knitting/dyeing mill issuance.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Sheet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReqSheetModal(false)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Printable Content Block */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 text-xs">
                {/* Header Information */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b pb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Job / Our Ref</span>
                    <strong className="text-sm font-mono text-teal-700 dark:text-teal-300">{feOurRef}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Buyer</span>
                    <strong>{feBuyer}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Style / Item</span>
                    <strong>{formStyle} ({feItemName})</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Total Order Qty</span>
                    <strong className="font-mono">{feQuantity.toLocaleString()} {feUnit}</strong>
                  </div>
                </div>

                {/* Table of Fabrics */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold border-b">
                      <tr>
                        <th className="py-2 px-2.5">Fab #</th>
                        <th className="py-2 px-2.5">Place</th>
                        <th className="py-2 px-2.5">Code</th>
                        <th className="py-2 px-3">Description</th>
                        <th className="py-2 px-2.5">Color Type</th>
                        <th className="py-2 px-2.5">Width</th>
                        <th className="py-2 px-2.5 text-right">Cons/Pc</th>
                        <th className="py-2 px-2.5 text-right">Require Qty</th>
                        <th className="py-2 px-2.5 text-right">Rate ($)</th>
                        <th className="py-2 px-2.5 text-right">Total Cost ($)</th>
                        <th className="py-2 px-3">Nominated Mill</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {feFabricRows.map((row, idx) => {
                        const totalCost = row.requireQty * (row.rate || 0);
                        return (
                          <tr key={row.id || idx}>
                            <td className="py-2 px-2.5 font-mono font-bold text-teal-700 dark:text-teal-300">{row.fabricNo}</td>
                            <td className="py-2 px-2.5">{row.usedPlace}</td>
                            <td className="py-2 px-2.5 font-mono">{row.code}</td>
                            <td className="py-2 px-3">{row.fabricDescription}</td>
                            <td className="py-2 px-2.5">
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-[10px]">
                                {row.colorType || "DTM"} ({row.colorMappings?.length || 0})
                              </span>
                            </td>
                            <td className="py-2 px-2.5">{row.width}</td>
                            <td className="py-2 px-2.5 text-right font-mono">{row.consPerPc.toFixed(4)} {row.unit}</td>
                            <td className="py-2 px-2.5 text-right font-mono font-bold text-teal-600">
                              {row.requireQty.toLocaleString()} {row.unit}
                            </td>
                            <td className="py-2 px-2.5 text-right font-mono">${row.rate.toFixed(2)}</td>
                            <td className="py-2 px-2.5 text-right font-mono font-bold">
                              ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{row.supplier}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-slate-50 dark:bg-slate-800/80 font-bold border-t">
                      <tr>
                        <td colSpan={7} className="py-2.5 px-3 text-right">Total Fabric Requirement &amp; Cost:</td>
                        <td className="py-2.5 px-2.5 text-right font-mono text-teal-700 dark:text-teal-300">
                          {feFabricRows.reduce((a, b) => a + (b.requireQty || 0), 0).toLocaleString()} Kgs
                        </td>
                        <td></td>
                        <td className="py-2.5 px-2.5 text-right font-mono text-emerald-700 dark:text-emerald-300">
                          ${feFabricRows
                            .reduce((a, b) => a + (b.requireQty || 0) * (b.rate || 0), 0)
                            .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowReqSheetModal(false)}
                  className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* REQ. SUMMARY MODAL (CONCISE FABRIC SUMMARY)                        */}
        {/* ================================================================== */}
        {showReqSummaryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 my-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-500" />
                    <span>Fabric Requirement Summary — {feOurRef}</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    High-level consumption summary for production scheduling.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowReqSummaryModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {feFabricRows.map((row, idx) => (
                  <div
                    key={row.id || idx}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-teal-700 dark:text-teal-300">{row.fabricNo}</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{row.budgetItemName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-700 font-mono">{row.code}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{row.fabricDescription}</p>
                      <p className="text-[11px] text-slate-400">
                        Mill: <strong>{row.supplier}</strong> | Width: <strong>{row.width}</strong> | Color Type: <strong>{row.colorType}</strong> ({row.colorMappings?.length || 0} colors)
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Total Required</span>
                      <span className="text-base font-bold font-mono text-teal-600 dark:text-teal-400">
                        {row.requireQty.toLocaleString()} {row.unit}
                      </span>
                      <span className="text-[11px] text-slate-500 block font-mono">
                        ${(row.requireQty * (row.rate || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowReqSummaryModal(false)}
                  className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* FIND QTN MODAL (QUOTATION LOOKUP)                                  */}
        {/* ================================================================== */}
        {showFindQtnModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 my-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Search className="w-4 h-4 text-teal-600" />
                  <span>Select Buyer Quotation Reference</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowFindQtnModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-[11px] font-bold border-b">
                    <tr>
                      <th className="py-2.5 px-3">Quotation No</th>
                      <th className="py-2.5 px-3">Buyer</th>
                      <th className="py-2.5 px-3">Style / Item</th>
                      <th className="py-2.5 px-3 text-right">FOB Rate</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {[
                      { qtnNo: "QTN-2026-0089", buyer: "H&M European Retail", style: "Crew Neck T-Shirt", rate: 4.50, qty: 25000 },
                      { qtnNo: "QTN-2026-0094", buyer: "Zara Inditex Group", style: "Vintage Heavy Hoodie", rate: 12.80, qty: 15000 },
                      { qtnNo: "QTN-2026-0102", buyer: "Marks & Spencer UK", style: "Pique Polo Shirt", rate: 6.20, qty: 30000 },
                    ].map((q) => (
                      <tr key={q.qtnNo} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-mono font-bold text-teal-700 dark:text-teal-300">{q.qtnNo}</td>
                        <td className="py-2.5 px-3">{q.buyer}</td>
                        <td className="py-2.5 px-3">{q.style}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold">${q.rate.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setFeFindQtn(q.qtnNo);
                              setFeBuyer(q.buyer);
                              setFeItemName(q.style);
                              setFeRate(q.rate);
                              setFeQuantity(q.qty);
                              setShowFindQtnModal(false);
                              toast.success(`Populated from Quotation: ${q.qtnNo}`);
                            }}
                            className="px-3 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* FIND PRE COSTING MODAL (Searchable Table per Section 3.4)          */}
        {/* ================================================================== */}
        {showFindBudgetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 my-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Search className="w-4 h-4 text-teal-600" />
                    <span>Find Pre Costing — Select Pre-Costing Record</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Search by Pre Costing ID, Job ID, Buyer, or Style to load corresponding fabric budget items.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFindBudgetModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={preCostingSearchQuery}
                  onChange={(e) => setPreCostingSearchQuery(e.target.value)}
                  placeholder="Search by Pre Costing ID, Job ID, Buyer, or Style..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:ring-1 focus:ring-teal-500"
                  autoFocus
                />
              </div>

              {/* Table per Section 3.4: Pre Costing ID, JOB ID, Buyer, Style, Order QTY */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs max-h-[55vh] overflow-y-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold border-b sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">Pre Costing ID</th>
                      <th className="py-2.5 px-3">JOB ID</th>
                      <th className="py-2.5 px-3">Buyer</th>
                      <th className="py-2.5 px-3">Style</th>
                      <th className="py-2.5 px-3 text-right">Order QTY</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {(() => {
                      const allPcs = MMRepository.getPreCostings();
                      const query = preCostingSearchQuery.toLowerCase().trim();
                      const filtered = allPcs.filter((pc) => {
                        if (!query) return true;
                        const matchId = pc.preCostId?.toLowerCase().includes(query);
                        const matchJob = pc.jobNo?.toLowerCase().includes(query);
                        const matchBuyer = pc.buyerName?.toLowerCase().includes(query);
                        const matchStyle = pc.styleNo?.toLowerCase().includes(query) || pc.styleDescription?.toLowerCase().includes(query);
                        return matchId || matchJob || matchBuyer || matchStyle;
                      });

                      if (filtered.length === 0) {
                        return (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                              No Pre-Costing records found matching &quot;{preCostingSearchQuery}&quot;.
                            </td>
                          </tr>
                        );
                      }

                      return filtered.map((pc) => {
                        const isSelected = pc.preCostId === feFindBudget;
                        return (
                          <tr
                            key={pc.id || pc.preCostId}
                            onClick={() => handleSelectPreCosting(pc.preCostId)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-teal-50 dark:bg-teal-950/50 font-bold"
                                : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                            }`}
                          >
                            <td className="py-2.5 px-3 font-mono font-bold text-teal-700 dark:text-teal-300">
                              {pc.preCostId}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                              {pc.jobNo || "—"}
                            </td>
                            <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200">{pc.buyerName}</td>
                            <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{pc.styleNo || pc.styleDescription}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold">
                              {(pc.orderQuantity || 0).toLocaleString()} Pcs
                            </td>
                            <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => handleSelectPreCosting(pc.preCostId)}
                                className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all"
                              >
                                {isSelected ? "Selected" : "Select"}
                              </button>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* FIND JOB ID MODAL (Searchable Table per Section 3.3)               */}
        {/* ================================================================== */}
        {showFindOurRefModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 my-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Search className="w-4 h-4 text-teal-600" />
                    <span>Find Job ID — Select Job Record</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Search by Job ID, Buyer, or Style to load corresponding fabric estimation records.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFindOurRefModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={jobIdSearchQuery}
                  onChange={(e) => setJobIdSearchQuery(e.target.value)}
                  placeholder="Search by Job ID, Buyer, or Style..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:ring-1 focus:ring-teal-500"
                  autoFocus
                />
              </div>

              {/* Table per Section 3.3: JOB ID, Buyer, Style, Order QTY */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs max-h-[55vh] overflow-y-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold border-b sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">JOB ID</th>
                      <th className="py-2.5 px-3">Buyer</th>
                      <th className="py-2.5 px-3">Style</th>
                      <th className="py-2.5 px-3 text-right">Order QTY</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {(() => {
                      const query = jobIdSearchQuery.toLowerCase().trim();
                      const filtered = orders.filter((o) => {
                        if (!query) return true;
                        const jId = (o.jobNo || o.ourRef || o.orderNo || "").toLowerCase();
                        const buyer = (o.buyerName || "").toLowerCase();
                        const style = (o.styleNo || "").toLowerCase();
                        return jId.includes(query) || buyer.includes(query) || style.includes(query);
                      });

                      if (filtered.length === 0) {
                        return (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-xs text-slate-400">
                              No Job ID records found matching &quot;{jobIdSearchQuery}&quot;.
                            </td>
                          </tr>
                        );
                      }

                      return filtered.map((o) => {
                        const currentJobId = o.jobNo || o.ourRef || o.orderNo;
                        const isSelected = currentJobId === feOurRef;
                        return (
                          <tr
                            key={o.id}
                            onClick={() => handleSelectJobId(currentJobId)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-teal-50 dark:bg-teal-950/50 font-bold"
                                : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                            }`}
                          >
                            <td className="py-2.5 px-3 font-mono font-bold text-teal-700 dark:text-teal-300">
                              {currentJobId}
                            </td>
                            <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200">{o.buyerName}</td>
                            <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{o.styleNo}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold">
                              {o.orderQuantity.toLocaleString()} Pcs
                            </td>
                            <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => handleSelectJobId(currentJobId)}
                                className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all"
                              >
                                {isSelected ? "Selected" : "Select"}
                              </button>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* FABRIC MASTER SELECTION MODAL (Searchable Table per Section 7 & 8)  */}
        {/* ================================================================== */}
        {showFabricMasterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 my-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-600" />
                    <span>Fabric Master Selection — Search Master Fabric Data</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Selecting a fabric will auto-populate Fabric Code, Description, Width, and SKU (set from Unit).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFabricMasterModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={fabricMasterSearchQuery}
                  onChange={(e) => setFabricMasterSearchQuery(e.target.value)}
                  placeholder="Search by Fabric Code or Description..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:ring-1 focus:ring-teal-500"
                  autoFocus
                />
              </div>

              {/* Table per Section 7.2: Fabric Code, Fabric Description, Width, Unit */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs max-h-[55vh] overflow-y-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold border-b sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">Fabric Code</th>
                      <th className="py-2.5 px-3 min-w-[260px]">Fabric Description</th>
                      <th className="py-2.5 px-3 w-28">Width</th>
                      <th className="py-2.5 px-3 w-24">Unit (SKU)</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {(() => {
                      const allFabrics = MMRepository.getFabricMaster();
                      const query = fabricMasterSearchQuery.toLowerCase().trim();
                      const filtered = allFabrics.filter((fab) => {
                        if (!query) return true;
                        return (
                          fab.fabricCode.toLowerCase().includes(query) ||
                          fab.fabricDescription.toLowerCase().includes(query)
                        );
                      });

                      if (filtered.length === 0) {
                        return (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-xs text-slate-400">
                              No fabric master records found matching &quot;{fabricMasterSearchQuery}&quot;.
                            </td>
                          </tr>
                        );
                      }

                      const activeRow = fabricMasterRowIndex !== null ? feFabricRows[fabricMasterRowIndex] : null;

                      return filtered.map((fab) => {
                        const isSelected = activeRow?.code === fab.fabricCode;
                        return (
                          <tr
                            key={fab.id || fab.fabricCode}
                            onClick={() => handleSelectFabricMaster(fab)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-teal-50 dark:bg-teal-950/50 font-bold"
                                : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                            }`}
                          >
                            <td className="py-2.5 px-3 font-mono font-bold text-teal-700 dark:text-teal-300">
                              {fab.fabricCode}
                            </td>
                            <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200">{fab.fabricDescription}</td>
                            <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{fab.width}</td>
                            <td className="py-2.5 px-3 font-mono font-bold text-teal-600 dark:text-teal-400">
                              {fab.unit}
                            </td>
                            <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => handleSelectFabricMaster(fab)}
                                className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all"
                              >
                                {isSelected ? "Selected" : "Select"}
                              </button>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* SUPPLIER MASTER SELECTION MODAL (Searchable Table per Section 11)   */}
        {/* ================================================================== */}
        {showSupplierModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 my-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Search className="w-4 h-4 text-teal-600" />
                    <span>Supplier Selection — Search Nominated Suppliers</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Select a nominated fabric supplier from registered master records.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSupplierModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={supplierSearchQuery}
                  onChange={(e) => setSupplierSearchQuery(e.target.value)}
                  placeholder="Search by Supplier Code, Name, Category, or Contact..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:ring-1 focus:ring-teal-500"
                  autoFocus
                />
              </div>

              {/* Table: Supplier Code, Supplier Name, Category, Contact Person, Status */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs max-h-[55vh] overflow-y-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold border-b sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">Supplier Code</th>
                      <th className="py-2.5 px-3 min-w-[200px]">Supplier Name</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Contact Person</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {(() => {
                      const allSuppliers = MMRepository.getSuppliers();
                      const query = supplierSearchQuery.toLowerCase().trim();
                      const filtered = allSuppliers.filter((s) => {
                        if (!query) return true;
                        return (
                          s.supplierCode.toLowerCase().includes(query) ||
                          s.supplierName.toLowerCase().includes(query) ||
                          s.category.toLowerCase().includes(query) ||
                          (s.contactPerson && s.contactPerson.toLowerCase().includes(query))
                        );
                      });

                      if (filtered.length === 0) {
                        return (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                              No supplier records found matching &quot;{supplierSearchQuery}&quot;.
                            </td>
                          </tr>
                        );
                      }

                      const activeRow = supplierRowIndex !== null ? feFabricRows[supplierRowIndex] : null;

                      return filtered.map((s) => {
                        const isSelected = activeRow?.supplier === s.supplierName;
                        return (
                          <tr
                            key={s.id || s.supplierCode}
                            onClick={() => handleSelectSupplier(s)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-teal-50 dark:bg-teal-950/50 font-bold"
                                : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                            }`}
                          >
                            <td className="py-2.5 px-3 font-mono font-bold text-teal-700 dark:text-teal-300">
                              {s.supplierCode}
                            </td>
                            <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200 font-semibold">
                              {s.supplierName}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{s.category}</td>
                            <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{s.contactPerson || "—"}</td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300">
                                {s.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => handleSelectSupplier(s)}
                                className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all"
                              >
                                {isSelected ? "Selected" : "Select"}
                              </button>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* PRE COSTING ITEM SELECTION MODAL (Section 4.3)                     */}
        {/* ================================================================== */}
        {showPreCostItemModal && preCostItemRowIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 my-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Search className="w-4 h-4 text-teal-600" />
                    <span>Select Pre Costing Fabric Item</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Showing applicable fabric budget items from Pre-Costing ({feFindBudget || "Active Job Style"}).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPreCostItemModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={preCostItemSearchQuery}
                  onChange={(e) => setPreCostItemSearchQuery(e.target.value)}
                  placeholder="Search by Item Description, Code, or Body Part..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:ring-1 focus:ring-teal-500"
                  autoFocus
                />
              </div>

              {/* Table of Pre Costing Fabric Items */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs max-h-[55vh] overflow-y-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold border-b sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">Item Code</th>
                      <th className="py-2.5 px-3 min-w-[200px]">Pre Costing Item</th>
                      <th className="py-2.5 px-3">Used Place</th>
                      <th className="py-2.5 px-3 text-right">Rate ($)</th>
                      <th className="py-2.5 px-3">Nominee Supplier</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {(() => {
                      const preCostings = MMRepository.getPreCostings();
                      const matchingPc = preCostings.find(
                        (p) =>
                          p.preCostId === feFindBudget ||
                          (p.jobNo && p.jobNo === feOurRef) ||
                          (p.styleNo && p.styleNo === formStyle)
                      );
                      let items = matchingPc?.items.filter((item) => item.category === "Fabric") || [];
                      
                      // If no matching Pre-Costing items, fallback to any available Pre-Costing fabric items
                      if (items.length === 0) {
                        const allFabricItems: any[] = [];
                        preCostings.forEach((p) => {
                          p.items.forEach((it) => {
                            if (it.category === "Fabric") allFabricItems.push(it);
                          });
                        });
                        items = allFabricItems.length > 0 ? allFabricItems : [
                          { preCostItemId: "pc-fab-01", itemCode: "FAB-001", itemDescription: "100% Cotton Single Jersey", bodyPartOrUsedPlace: "Shell", unitRate: 4.20, supplierNominee: "Pakiza Knitting & Dyeing" },
                          { preCostItemId: "pc-fab-02", itemCode: "FAB-002", itemDescription: "95% Cotton 5% Spandex 1x1 Rib", bodyPartOrUsedPlace: "Collar & Cuff", unitRate: 4.80, supplierNominee: "Ha-Meem Textiles Ltd" },
                          { preCostItemId: "pc-fab-03", itemCode: "FAB-003", itemDescription: "CVC 60/40 3-End Fleece 280 GSM", bodyPartOrUsedPlace: "Shell", unitRate: 5.40, supplierNominee: "Square Fashions Ltd" },
                          { preCostItemId: "pc-fab-04", itemCode: "FAB-004", itemDescription: "100% Cotton Lacoste Pique Knit", bodyPartOrUsedPlace: "Shell", unitRate: 4.60, supplierNominee: "Beximco Textiles Ltd" },
                          { preCostItemId: "pc-fab-05", itemCode: "FAB-005", itemDescription: "French Terry 260 GSM Solid Dyed", bodyPartOrUsedPlace: "Shell", unitRate: 5.10, supplierNominee: "Envoy Textiles Ltd" },
                        ];
                      }

                      const query = preCostItemSearchQuery.toLowerCase().trim();
                      const filtered = items.filter((it) => {
                        if (!query) return true;
                        return (
                          it.itemDescription?.toLowerCase().includes(query) ||
                          it.itemCode?.toLowerCase().includes(query) ||
                          it.bodyPartOrUsedPlace?.toLowerCase().includes(query)
                        );
                      });

                      if (filtered.length === 0) {
                        return (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                              No Pre-Costing fabric items match &quot;{preCostItemSearchQuery}&quot;.
                            </td>
                          </tr>
                        );
                      }

                      const activeBudgetItem = feFabricRows[preCostItemRowIndex]?.budgetItemName;

                      return filtered.map((fi, fIdx) => {
                        const isSelected = activeBudgetItem === fi.itemDescription;
                        return (
                          <tr
                            key={fi.preCostItemId || fIdx}
                            onClick={() => handleSelectPreCostItem(fi)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-teal-50 dark:bg-teal-950/50 font-bold"
                                : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                            }`}
                          >
                            <td className="py-2.5 px-3 font-mono font-bold text-teal-700 dark:text-teal-300">
                              {fi.itemCode || "FAB-ITEM"}
                            </td>
                            <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200 font-semibold">
                              {fi.itemDescription}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                              {fi.bodyPartOrUsedPlace || "Shell"}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              ${fi.unitRate?.toFixed(2) || "4.20"}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                              {fi.supplierNominee || "Pakiza Knitting & Dyeing"}
                            </td>
                            <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => handleSelectPreCostItem(fi)}
                                className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all"
                              >
                                {isSelected ? "Selected" : "Select"}
                              </button>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* FABRIC ROW BOOKING CONTEXT MODAL (Section 4.5)                     */}
        {/* ================================================================== */}
        {showRowBookingModal && rowBookingContext && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 my-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-teal-600" />
                    <span>Fabric Item Booking Interface</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Booking context for row #{rowBookingContext.rowIndex + 1}: <strong className="text-teal-700 dark:text-teal-300">{rowBookingContext.row.budgetItemName}</strong> ({rowBookingContext.row.code})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRowBookingModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Context Summary Cards */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Job ID &amp; Pre-Costing</span>
                  <div className="font-mono font-bold text-slate-800 dark:text-slate-200">{feOurRef || formJobNo}</div>
                  <div className="text-[11px] text-teal-600 font-medium">Pre-Costing: {feFindBudget || "None"}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Buyer &amp; Style</span>
                  <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{feBuyer || "Pakiza Garments"}</div>
                  <div className="text-[11px] text-slate-500 truncate">{formStyle || "Crew Neck T-Shirt"}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1 col-span-2">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Fabric Specification</span>
                  <div className="font-bold text-teal-700 dark:text-teal-300">{rowBookingContext.row.code} — {rowBookingContext.row.fabricDescription}</div>
                  <div className="text-[11px] text-slate-500">
                    Width: {rowBookingContext.row.width} | SKU: {rowBookingContext.row.sku} | Used Place: {rowBookingContext.row.usedPlace}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-1">
                  <span className="text-[10px] text-teal-700 dark:text-teal-300 block uppercase font-semibold">Require Booking Qty</span>
                  <div className="font-mono text-base font-extrabold text-teal-800 dark:text-teal-200">
                    {rowBookingContext.row.requireQty?.toLocaleString() || "0"} {rowBookingContext.row.unit || rowBookingContext.row.sku}
                  </div>
                  <div className="text-[10px] text-teal-600">Rate: ${rowBookingContext.row.rate?.toFixed(2)} / {rowBookingContext.row.sku}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Nominated Supplier</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">{rowBookingContext.row.supplier || "Pakiza Knitting & Dyeing"}</div>
                  <div className="text-[10px] text-slate-500">Status: {rowBookingContext.row.nomineeStatus || "Nominated"}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRowBookingModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 text-xs font-semibold"
                >
                  Close
                </button>
                <div className="flex items-center gap-2">
                  <Link
                    to="/mm-fabric-booking"
                    onClick={() => {
                      setShowRowBookingModal(false);
                      toast.success(`Opening Fabric Booking register with context: ${rowBookingContext.row.budgetItemName}`);
                    }}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Open Fabric Booking Register</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* CONFIRM OVERWRITE MODAL (Section 3.5 & Data Integrity)            */}
        {/* ================================================================== */}
        {confirmOverwriteModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-3 text-amber-600">
                <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Confirm Data Replacement</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {confirmOverwriteModal.message}
              </p>
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setConfirmOverwriteModal({ open: false, message: "", onConfirm: () => {} })}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => confirmOverwriteModal.onConfirm()}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all"
                >
                  Proceed &amp; Replace
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* SIZE WISE CONSUMPTION MODAL                                        */}
        {/* ================================================================== */}
        {showSizeConsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 my-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-teal-600" />
                  <span>Size-Wise Consumption Breakdown</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowSizeConsModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-2 border">
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  Fabric: {feFabricRows[feSelectedRowIndex]?.budgetItemName} ({feFabricRows[feSelectedRowIndex]?.code})
                </p>
                <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
                  <div className="p-2 rounded bg-white dark:bg-slate-900 border">
                    <span className="text-[10px] text-slate-400 block font-bold">SIZE S</span>
                    <span className="font-mono font-bold text-teal-600">2.45 kg/dz</span>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-slate-900 border">
                    <span className="text-[10px] text-slate-400 block font-bold">SIZE M</span>
                    <span className="font-mono font-bold text-teal-600">2.65 kg/dz</span>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-slate-900 border">
                    <span className="text-[10px] text-slate-400 block font-bold">SIZE L</span>
                    <span className="font-mono font-bold text-teal-600">2.80 kg/dz</span>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-slate-900 border">
                    <span className="text-[10px] text-slate-400 block font-bold">SIZE XL</span>
                    <span className="font-mono font-bold text-teal-600">2.95 kg/dz</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t text-[11px] font-bold">
                  <span>Weighted Average Consumption:</span>
                  <span className="font-mono text-teal-700 dark:text-teal-300">{feFabricRows[feSelectedRowIndex]?.consum} {feFabricRows[feSelectedRowIndex]?.unit} / {feFabricRows[feSelectedRowIndex]?.per}</span>
                </div>
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowSizeConsModal(false)}
                  className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MarketingMerchandisingLayout>
  );
}
