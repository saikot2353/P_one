import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import { toast } from "sonner";
import {
  Building2,
  Layers,
  Users,
  Tags,
  FolderTree,
  ListTree,
  Award,
  Ruler,
  Package,
  Clock,
  Coins,
  Calculator,
  CheckCircle2,
  ShieldCheck,
  Hash,
  Globe,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  FileSpreadsheet,
  ChevronRight,
  ChevronDown,
  X,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  ArrowUpDown,
  Sliders,
} from "lucide-react";
import { ProcurementConfigurationForm } from "@/components/procurement/ProcurementConfigurationForm";
import {
  DEFAULT_WAREHOUSES,
  DEFAULT_STORE_LOCATIONS,
  DEFAULT_VENDOR_CATEGORIES,
  DEFAULT_SUPPLIERS,
  DEFAULT_ITEM_GROUPS,
  DEFAULT_ITEM_SUB_GROUPS,
  DEFAULT_ITEM_CATEGORIES,
  DEFAULT_BRANDS,
  DEFAULT_ORIGINS,
  DEFAULT_UOMS,
  DEFAULT_ITEMS,
  DEFAULT_PAYMENT_TERMS,
  DEFAULT_CURRENCIES,
  DEFAULT_BUDGETS,
  DEFAULT_BUDGET_APPROVALS,
  DEFAULT_APPROVAL_AUTHORITIES,
  DEFAULT_DOCUMENT_SERIES,
  formatDocumentNumber,
  getStoredData,
  setStoredData,
  WarehouseStore,
  StoreLocation,
  VendorCategory,
  SupplierVendor,
  ItemGroup,
  ItemSubGroup,
  ItemCategory,
  Brand,
  Origin,
  UOM,
  ItemProductMaster,
  PaymentTerm,
  Currency,
  Budget,
  BudgetApproval,
  ApprovalAuthority,
  DocumentNumberSeries,
  BusinessType,
  DEFAULT_BUSINESS_TYPES,
} from "@/lib/procurement-master-data";
import { employeesData } from "@/routes/personnel-list";

// Import dedicated page forms
import { WarehouseStorePageForm } from "@/components/procurement/master-data/WarehouseStorePageForm";
import { SupplierVendorPageForm } from "@/components/procurement/master-data/SupplierVendorPageForm";
import { BusinessTypePageForm } from "@/components/procurement/master-data/BusinessTypePageForm";
import { ItemCreationPageForm } from "@/components/procurement/master-data/ItemCreationPageForm";
import { ItemGroupModal } from "@/components/procurement/master-data/ItemGroupModal";
import { BudgetManagementPageForm } from "@/components/procurement/master-data/BudgetManagementPageForm";
import { BudgetApprovalPageForm } from "@/components/procurement/master-data/BudgetApprovalPageForm";
import { ApprovalAuthorityPageForm } from "@/components/procurement/master-data/ApprovalAuthorityPageForm";
import { OriginMasterPageForm } from "@/components/procurement/master-data/OriginMasterPageForm";
import { DocumentSeriesPageForm } from "@/components/procurement/master-data/DocumentSeriesPageForm";
import { CurrencyMasterPageForm } from "@/components/procurement/master-data/CurrencyMasterPageForm";
import { UOMMasterPageForm } from "@/components/procurement/master-data/UOMMasterPageForm";
import { PaymentTermsPageForm } from "@/components/procurement/master-data/PaymentTermsPageForm";
import { ItemGroupPageForm } from "@/components/procurement/master-data/ItemGroupPageForm";
import { VendorCategoryPageForm } from "@/components/procurement/master-data/VendorCategoryPageForm";
import { ItemCategoryPageForm } from "@/components/procurement/master-data/ItemCategoryPageForm";
import { BrandMasterPageForm } from "@/components/procurement/master-data/BrandMasterPageForm";
import { StoreLocationPageForm } from "@/components/procurement/master-data/StoreLocationPageForm";
import {
  ExcelDataUploadModal,
  MasterUploadEntityType,
} from "@/components/procurement/master-data/ExcelDataUploadModal";

export type MasterDataTab =
  | "warehouse-store"
  | "store-location"
  | "vendor-category"
  | "supplier-vendor"
  | "business-type"
  | "item-group"
  | "item-sub-group"
  | "item-category"
  | "brand"
  | "origin"
  | "uom"
  | "payment-terms"
  | "currency"
  | "budget" // Budget Management
  | "budget-approval"
  | "approval-authority"
  | "document-type-number-series"
  | "procurement-configuration";

interface MasterDataSearch {
  tab?: MasterDataTab;
  action?: "list" | "create" | "edit" | "view";
  id?: string;
  subGroupId?: string;
}

export const Route = createFileRoute("/procurement-master-data")({
  validateSearch: (search: Record<string, unknown>): MasterDataSearch => {
    return {
      tab: (search.tab as MasterDataTab) || "vendor-category",
      action: search.action as any,
      id: search.id as string | undefined,
      subGroupId: search.subGroupId as string | undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Master Data Management — Local Procurement ERP" },
      {
        name: "description",
        content:
          "Enterprise Local Procurement Master Data Management, Catalogs, Suppliers, and Approval Rules.",
      },
    ],
  }),
  component: ProcurementMasterDataPage,
});

// Recursive tree node interface for Dynamic Item Sub Groups
export interface SubGroupTreeNode extends ItemSubGroup {
  children: SubGroupTreeNode[];
  depth: number;
}

export function buildSubGroupTreeNodes(
  allSubGroups: ItemSubGroup[],
  groupId?: string,
  parentId: string | null = null,
  depth = 0,
): SubGroupTreeNode[] {
  const filtered = allSubGroups.filter(
    (sg) =>
      (!groupId || sg.itemGroupId === groupId) &&
      (parentId === null ? !sg.parentSubGroupId : sg.parentSubGroupId === parentId),
  );

  return filtered.map((sg) => ({
    ...sg,
    depth,
    children: buildSubGroupTreeNodes(allSubGroups, groupId, sg.id, depth + 1),
  }));
}

export function getSubGroupBreadcrumb(
  subGroupId: string | null | undefined,
  allSubGroups: ItemSubGroup[],
  allItemGroups: ItemGroup[],
): string {
  if (!subGroupId) return "";
  const trail: string[] = [];
  let current = allSubGroups.find((s) => s.id === subGroupId);
  const visited = new Set<string>();

  while (current && !visited.has(current.id)) {
    visited.add(current.id);
    trail.unshift(current.subGroupName);
    if (!current.parentSubGroupId) {
      const parentGroup = allItemGroups.find((g) => g.id === current?.itemGroupId);
      if (parentGroup) trail.unshift(parentGroup.groupName);
      break;
    }
    current = allSubGroups.find((s) => s.id === current?.parentSubGroupId);
  }

  return trail.join(" → ");
}

interface TabGroup {
  groupName: string;
  tabs: {
    id: MasterDataTab;
    label: string;
    icon: any;
    countKey: string;
    desc: string;
  }[];
}

const TAB_GROUPS: TabGroup[] = [
  {
    groupName: "Vendors & Suppliers",
    tabs: [
      {
        id: "vendor-category",
        label: "Vendor Category",
        icon: Tags,
        countKey: "vendorCategories",
        desc: "Supplier categories and classifications",
      },
      {
        id: "supplier-vendor",
        label: "Supplier / Vendor",
        icon: Users,
        countKey: "suppliers",
        desc: "Supplier directory, contacts, banking, and terms",
      },
      {
        id: "business-type",
        label: "Business Type",
        icon: Building2,
        countKey: "businessTypes",
        desc: "Commercial business classifications and vendor trade types",
      },
    ],
  },
  {
    groupName: "Product Catalog & Hierarchy",
    tabs: [
      {
        id: "item-sub-group",
        label: "Item Creation",
        icon: Package,
        countKey: "itemSubGroups",
        desc: "Item catalog, dynamic group & sub-group hierarchy, and item creation",
      },
      {
        id: "item-category",
        label: "Item Category",
        icon: Tags,
        countKey: "itemCategories",
        desc: "Product categories with inventory, asset, consumable classifications",
      },
      {
        id: "brand",
        label: "Brand Master",
        icon: Award,
        countKey: "brands",
        desc: "Manufacturer brands, origin countries and official websites",
      },
      {
        id: "origin",
        label: "Origin Master",
        icon: Globe,
        countKey: "origins",
        desc: "Country of origin master codes and names",
      },
      {
        id: "uom",
        label: "Unit of Measurement (UOM)",
        icon: Ruler,
        countKey: "uoms",
        desc: "Measurement units and multi-level conversion factors",
      },
    ],
  },
  {
    groupName: "Warehouse & Storage",
    tabs: [
      {
        id: "warehouse-store",
        label: "Warehouse / Store",
        icon: Building2,
        countKey: "warehouses",
        desc: "Warehouse facilities, managers, valuation & permissions",
      },
      {
        id: "store-location",
        label: "Store Location / Batch Configuration",
        icon: Layers,
        countKey: "locations",
        desc: "Location tracking and batch configuration rules",
      },
    ],
  },
  {
    groupName: "Commercial & Terms",
    tabs: [
      {
        id: "payment-terms",
        label: "Payment Terms",
        icon: Clock,
        countKey: "paymentTerms",
        desc: "Payment conditions and terms",
      },
      {
        id: "currency",
        label: "Currency Master",
        icon: Coins,
        countKey: "currencies",
        desc: "Currencies, symbols and base exchange rates",
      },
    ],
  },
  {
    groupName: "Budget & Approvals",
    tabs: [
      {
        id: "budget",
        label: "Budget Requisition",
        icon: Calculator,
        countKey: "budgets",
        desc: "Header info and category-wise budget allocations",
      },
      {
        id: "budget-approval",
        label: "Budget Approval",
        icon: CheckCircle2,
        countKey: "budgetApprovals",
        desc: "Multi-level budget workflow reviews",
      },
      {
        id: "approval-authority",
        label: "Approval Authority",
        icon: ShieldCheck,
        countKey: "authorities",
        desc: "Configurable monetary approval tiers",
      },
      {
        id: "document-type-number-series",
        label: "Document Type / Number Series",
        icon: Hash,
        countKey: "docSeries",
        desc: "Searchable form numbering schemes & prefixes",
      },
    ],
  },
  {
    groupName: "System & Operations Configuration",
    tabs: [
      {
        id: "procurement-configuration",
        label: "Procurement Configuration",
        icon: Sliders,
        countKey: "procConfig",
        desc: "Company-level multi-category rules and Comparative Statement settings",
      },
    ],
  },
];

function ProcurementMasterDataPage() {
  const searchParams = Route.useSearch();
  const rawTab: MasterDataTab = searchParams.tab || "vendor-category";
  // Route legacy/direct item-group tab to item-sub-group (Item Creation)
  const activeTab = (rawTab === "item-group" ? "item-sub-group" : rawTab) as MasterDataTab;

  // Master Data State with LocalStorage backing
  const [warehouses, setWarehouses] = useState<WarehouseStore[]>(() =>
    getStoredData("proc_warehouses_v2", DEFAULT_WAREHOUSES),
  );
  const [locations, setLocations] = useState<StoreLocation[]>(() =>
    getStoredData("proc_locations_v2", DEFAULT_STORE_LOCATIONS),
  );
  const [vendorCategories, setVendorCategories] = useState<VendorCategory[]>(() =>
    getStoredData("proc_vendor_categories", DEFAULT_VENDOR_CATEGORIES),
  );
  const [suppliers, setSuppliers] = useState<SupplierVendor[]>(() =>
    getStoredData("proc_suppliers_v2", DEFAULT_SUPPLIERS),
  );
  const [itemGroups, setItemGroups] = useState<ItemGroup[]>(() =>
    getStoredData("proc_item_groups", DEFAULT_ITEM_GROUPS),
  );
  const [itemSubGroups, setItemSubGroups] = useState<ItemSubGroup[]>(() =>
    getStoredData("proc_item_sub_groups_v2", DEFAULT_ITEM_SUB_GROUPS),
  );
  const [itemCategories, setItemCategories] = useState<ItemCategory[]>(() =>
    getStoredData("proc_item_categories", DEFAULT_ITEM_CATEGORIES),
  );
  const [brands, setBrands] = useState<Brand[]>(() => getStoredData("proc_brands", DEFAULT_BRANDS));
  const [origins, setOrigins] = useState<Origin[]>(() =>
    getStoredData("proc_origins", DEFAULT_ORIGINS),
  );
  const [uoms, setUoms] = useState<UOM[]>(() => getStoredData("proc_uoms", DEFAULT_UOMS));
  const [items, setItems] = useState<ItemProductMaster[]>(() =>
    getStoredData("proc_items_v2", DEFAULT_ITEMS),
  );
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>(() =>
    getStoredData("proc_payment_terms", DEFAULT_PAYMENT_TERMS),
  );
  const [currencies, setCurrencies] = useState<Currency[]>(() =>
    getStoredData("proc_currencies", DEFAULT_CURRENCIES),
  );
  const [budgets, setBudgets] = useState<Budget[]>(() =>
    getStoredData("proc_budgets", DEFAULT_BUDGETS),
  );
  const [budgetApprovals, setBudgetApprovals] = useState<BudgetApproval[]>(() =>
    getStoredData("proc_budget_approvals", DEFAULT_BUDGET_APPROVALS),
  );
  const [authorities, setAuthorities] = useState<ApprovalAuthority[]>(() =>
    getStoredData("proc_authorities", DEFAULT_APPROVAL_AUTHORITIES),
  );
  const [docSeries, setDocSeries] = useState<DocumentNumberSeries[]>(() =>
    getStoredData("proc_doc_series", DEFAULT_DOCUMENT_SERIES),
  );
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>(() =>
    getStoredData("proc_business_types", DEFAULT_BUSINESS_TYPES),
  );

  // Sync to local storage
  useEffect(() => setStoredData("proc_warehouses_v2", warehouses), [warehouses]);
  useEffect(() => setStoredData("proc_locations_v2", locations), [locations]);
  useEffect(() => setStoredData("proc_vendor_categories", vendorCategories), [vendorCategories]);
  useEffect(() => setStoredData("proc_suppliers_v2", suppliers), [suppliers]);
  useEffect(() => setStoredData("proc_business_types", businessTypes), [businessTypes]);
  useEffect(() => setStoredData("proc_item_groups", itemGroups), [itemGroups]);
  useEffect(() => setStoredData("proc_item_sub_groups_v2", itemSubGroups), [itemSubGroups]);
  useEffect(() => setStoredData("proc_item_categories", itemCategories), [itemCategories]);
  useEffect(() => setStoredData("proc_brands", brands), [brands]);
  useEffect(() => setStoredData("proc_origins", origins), [origins]);
  useEffect(() => setStoredData("proc_uoms", uoms), [uoms]);
  useEffect(() => setStoredData("proc_items_v2", items), [items]);
  useEffect(() => setStoredData("proc_payment_terms", paymentTerms), [paymentTerms]);
  useEffect(() => setStoredData("proc_currencies", currencies), [currencies]);
  useEffect(() => setStoredData("proc_budgets", budgets), [budgets]);
  useEffect(() => setStoredData("proc_budget_approvals", budgetApprovals), [budgetApprovals]);
  useEffect(() => setStoredData("proc_authorities", authorities), [authorities]);
  useEffect(() => setStoredData("proc_doc_series", docSeries), [docSeries]);

  // Page View Mode (List vs Dedicated Form Page)
  const [pageMode, setPageMode] = useState<"list" | "create" | "edit" | "view">("list");
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [activeTargetSubGroup, setActiveTargetSubGroup] = useState<ItemSubGroup | null>(null);

  // Item Group Modal for adding/editing root item groups
  const [isItemGroupModalOpen, setIsItemGroupModalOpen] = useState(false);
  const [itemGroupModalMode, setItemGroupModalMode] = useState<"create" | "edit">("create");
  const [itemGroupModalData, setItemGroupModalData] = useState<Partial<ItemGroup> | null>(null);

  // SubGroup Modal for adding/editing dynamic sub-groups in tree
  const [isSubGroupModalOpen, setIsSubGroupModalOpen] = useState(false);
  const [subGroupModalMode, setSubGroupModalMode] = useState<"create" | "edit">("create");
  const [subGroupFormValues, setSubGroupFormValues] = useState<Partial<ItemSubGroup>>({});
  const [subGroupFormErrors, setSubGroupFormErrors] = useState<Record<string, string>>({});

  // Delete Confirmation State
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  // Filters and Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Sub Group Tree Interactive State - initially collapsed
  const [expandedSubGroupIds, setExpandedSubGroupIds] = useState<Record<string, boolean>>({});
  const [subGroupSearchQuery, setSubGroupSearchQuery] = useState("");
  const [selectedSubGroupTreeId, setSelectedSubGroupTreeId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [catalogItemSearchQuery, setCatalogItemSearchQuery] = useState("");
  const [isExcelUploadOpen, setIsExcelUploadOpen] = useState(false);

  // Auto-expand matching nodes & ancestors during Sub Group search
  useEffect(() => {
    if (!subGroupSearchQuery.trim()) return;
    const q = subGroupSearchQuery.toLowerCase();
    const matching = itemSubGroups.filter(
      (sg) =>
        sg.subGroupName.toLowerCase().includes(q) ||
        sg.subGroupCode.toLowerCase().includes(q),
    );
    if (matching.length > 0) {
      const toExpand: Record<string, boolean> = {};
      matching.forEach((m) => {
        toExpand[m.id] = true;
        let curr = m.parentSubGroupId;
        while (curr) {
          toExpand[curr] = true;
          const parentNode = itemSubGroups.find((s) => s.id === curr);
          curr = parentNode ? parentNode.parentSubGroupId : null;
        }
      });
      setExpandedSubGroupIds((prev) => ({ ...prev, ...toExpand }));
    }
  }, [subGroupSearchQuery, itemSubGroups]);

  // Master Data Tabs supported by Excel Upload
  const EXCEL_UPLOAD_SUPPORTED_TABS: Record<string, MasterUploadEntityType> = {
    "warehouse-store": "warehouse-store",
    "supplier-vendor": "supplier-vendor",
    "item-group": "item-group",
    "item-sub-group": "item-creation",
    "item-category": "item-category",
    "brand": "brand",
    "origin": "origin",
    "uom": "uom",
    "payment-terms": "payment-terms",
  };

  const handleExcelImport = (entityType: MasterUploadEntityType, importedRows: any[]) => {
    switch (entityType) {
      case "item-creation":
        setItems((prev) => [...importedRows, ...prev]);
        break;
      case "warehouse-store":
        setWarehouses((prev) => [...importedRows, ...prev]);
        break;
      case "supplier-vendor":
        setSuppliers((prev) => [...importedRows, ...prev]);
        break;
      case "item-group":
        setItemGroups((prev) => [...importedRows, ...prev]);
        break;
      case "item-category":
        setItemCategories((prev) => [...importedRows, ...prev]);
        break;
      case "brand":
        setBrands((prev) => [...importedRows, ...prev]);
        break;
      case "origin":
        setOrigins((prev) => [...importedRows, ...prev]);
        break;
      case "uom":
        setUoms((prev) => [...importedRows, ...prev]);
        break;
      case "payment-terms":
        setPaymentTerms((prev) => [...importedRows, ...prev]);
        break;
    }
  };

  // Reset page and query on tab switch
  useEffect(() => {
    setSearchQuery("");
    setStatusFilter("All");
    setCurrentPage(1);
    setPageMode("list");
    setSelectedRecord(null);
  }, [activeTab]);

  // Company list loaded from hris_organizations or defaults
  const companyList = useMemo(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("hris_organizations");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const names = parsed
              .map((org: any) => org.nameEng || org.name || String(org))
              .filter(Boolean);
            if (names.length > 0) return names;
          }
        }
      } catch (e) {}
    }
    return [
      "Pakiza Knit Composite Ltd",
      "Pakiza Apparels Ltd",
      "Pakiza Spinning Mills Ltd",
      "Pakiza Dyeing & Printing Industries Ltd",
      "Pakiza Textiles Ltd",
    ];
  }, []);

  // Employee list
  const employeeList = useMemo(() => {
    if (Array.isArray(employeesData) && employeesData.length > 0) {
      return employeesData.map((e) => ({
        id: e.id,
        name: e.name,
        dept: (e as any).department || e.dept || "General",
        title: (e as any).designation || e.title || "Staff",
        mobile: (e as any).mobile || "01750021154",
      }));
    }
    return [
      {
        id: "2023043910",
        name: "Tahmid Afsar Shapno",
        dept: "Business Innovation",
        title: "Asst. Manager",
        mobile: "01750021154",
      },
      {
        id: "2023046001",
        name: "Nazmul Huda",
        dept: "Supply Chain",
        title: "Store Officer",
        mobile: "01711223344",
      },
    ];
  }, []);

  // Counts for badge tabs
  const recordCounts: Record<string, number> = useMemo(
    () => ({
      warehouses: warehouses.length,
      locations: locations.length,
      vendorCategories: vendorCategories.length,
      suppliers: suppliers.length,
      businessTypes: businessTypes.length,
      itemGroups: itemGroups.length,
      itemSubGroups: itemSubGroups.length,
      itemCategories: itemCategories.length,
      brands: brands.length,
      origins: origins.length,
      uoms: uoms.length,
      items: items.length,
      paymentTerms: paymentTerms.length,
      currencies: currencies.length,
      budgets: budgets.length,
      budgetApprovals: budgetApprovals.length,
      authorities: authorities.length,
      docSeries: docSeries.length,
      procConfig: 1,
    }),
    [
      warehouses,
      locations,
      vendorCategories,
      suppliers,
      businessTypes,
      itemGroups,
      itemSubGroups,
      itemCategories,
      brands,
      origins,
      uoms,
      items,
      paymentTerms,
      currencies,
      budgets,
      budgetApprovals,
      authorities,
      docSeries,
    ],
  );

  // Active Tab Metadata
  const currentTabMeta = useMemo(() => {
    for (const group of TAB_GROUPS) {
      const found = group.tabs.find((t) => t.id === activeTab);
      if (found) return found;
    }
    return TAB_GROUPS[0].tabs[0];
  }, [activeTab]);

  // List data filtering
  const filteredRecords = useMemo(() => {
    let list: any[] = [];
    switch (activeTab) {
      case "warehouse-store":
        list = warehouses;
        break;
      case "store-location":
        list = locations;
        break;
      case "vendor-category":
        list = vendorCategories;
        break;
      case "supplier-vendor":
        list = suppliers;
        break;
      case "business-type":
        list = businessTypes;
        break;
      case "item-group":
        list = itemGroups;
        break;
      case "item-sub-group":
        list = itemSubGroups;
        break;
      case "item-category":
        list = itemCategories;
        break;
      case "brand":
        list = brands;
        break;
      case "origin":
        list = origins;
        break;
      case "uom":
        list = uoms;
        break;
      case "payment-terms":
        list = paymentTerms;
        break;
      case "currency":
        list = currencies;
        break;
      case "budget":
        list = budgets;
        break;
      case "budget-approval":
        list = budgetApprovals;
        break;
      case "approval-authority":
        list = authorities;
        break;
      case "document-type-number-series":
        list = docSeries;
        break;
      default:
        list = [];
    }

    return list.filter((item) => {
      // Status Filter
      if (statusFilter !== "All") {
        const itemStatus = item.status || item.locationStatus || item.decision;
        if (itemStatus && itemStatus !== statusFilter) return false;
      }
      // Query search
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.storeName?.toLowerCase().includes(q) ||
        item.storeCode?.toLowerCase().includes(q) ||
        item.vendorName?.toLowerCase().includes(q) ||
        item.vendorCode?.toLowerCase().includes(q) ||
        item.typeCode?.toLowerCase().includes(q) ||
        item.businessTypeName?.toLowerCase().includes(q) ||
        item.groupName?.toLowerCase().includes(q) ||
        item.subGroupName?.toLowerCase().includes(q) ||
        item.categoryName?.toLowerCase().includes(q) ||
        item.brandName?.toLowerCase().includes(q) ||
        item.originName?.toLowerCase().includes(q) ||
        item.originCode?.toLowerCase().includes(q) ||
        item.uomName?.toLowerCase().includes(q) ||
        item.uomCode?.toLowerCase().includes(q) ||
        item.termName?.toLowerCase().includes(q) ||
        item.currencyCode?.toLowerCase().includes(q) ||
        item.currencyName?.toLowerCase().includes(q) ||
        item.budgetCode?.toLowerCase().includes(q) ||
        item.department?.toLowerCase().includes(q) ||
        item.authorityCode?.toLowerCase().includes(q) ||
        item.documentType?.toLowerCase().includes(q) ||
        item.prefix?.toLowerCase().includes(q)
      );
    });
  }, [
    activeTab,
    warehouses,
    locations,
    vendorCategories,
    suppliers,
    businessTypes,
    itemGroups,
    itemSubGroups,
    itemCategories,
    brands,
    origins,
    uoms,
    paymentTerms,
    currencies,
    budgets,
    budgetApprovals,
    authorities,
    docSeries,
    searchQuery,
    statusFilter,
  ]);

  const totalRecords = filteredRecords.length;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  // Standard Page Actions
  const handleOpenCreate = () => {
    setSelectedRecord(null);
    if (activeTab === "item-sub-group") {
      // Find selected or first subgroup
      const target = itemSubGroups.find((s) => s.id === selectedSubGroupTreeId) || itemSubGroups[0] || null;
      setActiveTargetSubGroup(target);
    }
    setPageMode("create");
  };

  const handleOpenEdit = (record: any) => {
    setSelectedRecord(record);
    if (activeTab === "item-sub-group") {
      const target = itemSubGroups.find((s) => s.id === record.subGroupId) || null;
      setActiveTargetSubGroup(target);
    }
    setPageMode("edit");
  };

  const handleOpenView = (record: any) => {
    setSelectedRecord(record);
    if (activeTab === "item-sub-group") {
      const target = itemSubGroups.find((s) => s.id === record.subGroupId) || null;
      setActiveTargetSubGroup(target);
    }
    setPageMode("view");
  };

  const handleToggleStatus = (record: any) => {
    const newStatus = record.status === "Active" ? "Inactive" : "Active";
    switch (activeTab) {
      case "warehouse-store":
        setWarehouses((prev) => prev.map((w) => (w.id === record.id ? { ...w, status: newStatus } : w)));
        break;
      case "store-location":
        setLocations((prev) => prev.map((l) => (l.id === record.id ? { ...l, status: newStatus } : l)));
        break;
      case "vendor-category":
        setVendorCategories((prev) => prev.map((c) => (c.id === record.id ? { ...c, status: newStatus } : c)));
        break;
      case "supplier-vendor":
        setSuppliers((prev) => prev.map((s) => (s.id === record.id ? { ...s, status: newStatus } : s)));
        break;
      case "business-type":
        setBusinessTypes((prev) =>
          prev.map((b) => (b.id === record.id ? { ...b, status: newStatus } : b)),
        );
        break;
      case "item-group":
        setItemGroups((prev) => prev.map((g) => (g.id === record.id ? { ...g, status: newStatus } : g)));
        break;
      case "item-sub-group":
        setItemSubGroups((prev) => prev.map((sg) => (sg.id === record.id ? { ...sg, status: newStatus } : sg)));
        break;
      case "item-category":
        setItemCategories((prev) => prev.map((c) => (c.id === record.id ? { ...c, status: newStatus } : c)));
        break;
      case "brand":
        setBrands((prev) => prev.map((b) => (b.id === record.id ? { ...b, status: newStatus } : b)));
        break;
      case "origin":
        setOrigins((prev) => prev.map((o) => (o.id === record.id ? { ...o, status: newStatus } : o)));
        break;
      case "uom":
        setUoms((prev) => prev.map((u) => (u.id === record.id ? { ...u, status: newStatus } : u)));
        break;
      case "payment-terms":
        setPaymentTerms((prev) => prev.map((p) => (p.id === record.id ? { ...p, status: newStatus } : p)));
        break;
      case "currency":
        setCurrencies((prev) => prev.map((c) => (c.id === record.id ? { ...c, status: newStatus } : c)));
        break;
      case "approval-authority":
        setAuthorities((prev) => prev.map((a) => (a.id === record.id ? { ...a, status: newStatus } : a)));
        break;
      case "document-type-number-series":
        setDocSeries((prev) => prev.map((d) => (d.id === record.id ? { ...d, status: newStatus } : d)));
        break;
    }
    toast.success(`Record marked as ${newStatus}`);
  };

  const handleOpenDelete = (record: any) => {
    setItemToDelete(record);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    const id = itemToDelete.id;

    if (itemToDelete._type === "item-group") {
      setItemGroups((prev) => prev.filter((g) => g.id !== id));
      setIsDeleteConfirmOpen(false);
      setItemToDelete(null);
      toast.success("Item Group deleted successfully.");
      return;
    }

    switch (activeTab) {
      case "warehouse-store":
        setWarehouses((prev) => prev.filter((r) => r.id !== id));
        break;
      case "store-location":
        setLocations((prev) => prev.filter((r) => r.id !== id));
        break;
      case "vendor-category":
        setVendorCategories((prev) => prev.filter((r) => r.id !== id));
        break;
      case "supplier-vendor":
        setSuppliers((prev) => prev.filter((r) => r.id !== id));
        break;
      case "business-type":
        setBusinessTypes((prev) => prev.filter((r) => r.id !== id));
        break;
      case "item-group":
        setItemGroups((prev) => prev.filter((r) => r.id !== id));
        break;
      case "item-sub-group":
        setItemSubGroups((prev) => prev.filter((r) => r.id !== id));
        break;
      case "item-category":
        setItemCategories((prev) => prev.filter((r) => r.id !== id));
        break;
      case "brand":
        setBrands((prev) => prev.filter((r) => r.id !== id));
        break;
      case "origin":
        setOrigins((prev) => prev.filter((r) => r.id !== id));
        break;
      case "uom":
        setUoms((prev) => prev.filter((r) => r.id !== id));
        break;
      case "payment-terms":
        setPaymentTerms((prev) => prev.filter((r) => r.id !== id));
        break;
      case "currency":
        setCurrencies((prev) => prev.filter((r) => r.id !== id));
        break;
      case "budget":
        setBudgets((prev) => prev.filter((r) => r.id !== id));
        break;
      case "budget-approval":
        setBudgetApprovals((prev) => prev.filter((r) => r.id !== id));
        break;
      case "approval-authority":
        setAuthorities((prev) => prev.filter((r) => r.id !== id));
        break;
      case "document-type-number-series":
        setDocSeries((prev) => prev.filter((r) => r.id !== id));
        break;
    }

    setIsDeleteConfirmOpen(false);
    setItemToDelete(null);
    toast.success("Record deleted successfully.");
  };

  // Item Group Handlers
  const handleOpenAddItemGroup = () => {
    setItemGroupModalMode("create");
    setItemGroupModalData(null);
    setIsItemGroupModalOpen(true);
  };

  const handleOpenEditItemGroup = (grp: ItemGroup) => {
    setItemGroupModalMode("edit");
    setItemGroupModalData(grp);
    setIsItemGroupModalOpen(true);
  };

  const handleSaveItemGroup = (savedGroup: ItemGroup) => {
    if (itemGroupModalMode === "create") {
      setItemGroups((prev) => [savedGroup, ...prev]);
      setExpandedSubGroupIds((prev) => ({ ...prev, [savedGroup.id]: true }));
      toast.success("Main Item Group created successfully.");
    } else {
      setItemGroups((prev) => prev.map((g) => (g.id === savedGroup.id ? savedGroup : g)));
      toast.success("Item Group updated successfully.");
    }
    setIsItemGroupModalOpen(false);
  };

  const handleOpenDeleteItemGroup = (grp: ItemGroup) => {
    const hasSub = itemSubGroups.some((sg) => sg.itemGroupId === grp.id);
    const hasItem = items.some((it) => {
      const sg = itemSubGroups.find((s) => s.id === it.subGroupId);
      return (it.itemGroupId || (it as any).groupId) === grp.id || sg?.itemGroupId === grp.id;
    });
    if (hasSub || hasItem) {
      toast.error(`Cannot delete "${grp.groupName}" because it contains sub-groups or items.`);
      return;
    }
    setItemToDelete({ ...grp, _type: "item-group" });
    setIsDeleteConfirmOpen(true);
  };

  // Create Item button next to Add Child in Tree
  const handleOpenCreateItemForSubGroup = (node: ItemSubGroup) => {
    setSelectedRecord(null);
    setActiveTargetSubGroup(node);
    setPageMode("create");
  };

  const handleOpenCreateItem = (node: ItemSubGroup) => {
    handleOpenCreateItemForSubGroup(node);
  };

  // Sub Group modal handling (Add/Edit tree node)
  const handleOpenAddSubGroupChild = (parentSubId: string, parentGroupId: string) => {
    const parentSub = itemSubGroups.find((s) => s.id === parentSubId);
    const parentGroup = itemGroups.find((g) => g.id === parentGroupId);
    const isService = !!parentSub?.serviceFlag || !!parentGroup?.serviceFlag;

    setSubGroupModalMode("create");
    setSubGroupFormValues({
      subGroupCode: `SUB-${Math.floor(100 + Math.random() * 900)}`,
      subGroupName: "",
      itemGroupId: parentGroupId,
      parentSubGroupId: parentSubId,
      description: "",
      status: "Active",
      serviceFlag: isService,
    });
    setSubGroupFormErrors({});
    setIsSubGroupModalOpen(true);
  };

  const handleOpenAddChildSubGroup = (node: ItemSubGroup) => {
    handleOpenAddSubGroupChild(node.id, node.itemGroupId);
  };

  const handleOpenAddRootSubGroup = () => {
    const defaultGroup = itemGroups[0];
    setSubGroupModalMode("create");
    setSubGroupFormValues({
      subGroupCode: `SUB-${Math.floor(100 + Math.random() * 900)}`,
      subGroupName: "",
      itemGroupId: defaultGroup?.id || "",
      parentSubGroupId: null,
      description: "",
      status: "Active",
      serviceFlag: !!defaultGroup?.serviceFlag,
    });
    setSubGroupFormErrors({});
    setIsSubGroupModalOpen(true);
  };

  const handleOpenAddSubGroupUnderGroup = (grp: ItemGroup) => {
    setSubGroupModalMode("create");
    setSubGroupFormValues({
      subGroupCode: `SUB-${Math.floor(100 + Math.random() * 900)}`,
      subGroupName: "",
      itemGroupId: grp.id,
      parentSubGroupId: null,
      description: "",
      status: "Active",
      serviceFlag: !!grp.serviceFlag,
    });
    setSubGroupFormErrors({});
    setIsSubGroupModalOpen(true);
  };

  const handleSaveSubGroupModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subGroupFormValues.subGroupName?.trim()) {
      setSubGroupFormErrors({ subGroupName: "Sub Group Name is required" });
      return;
    }

    const parentGroup = itemGroups.find((g) => g.id === subGroupFormValues.itemGroupId);
    const parentSub = subGroupFormValues.parentSubGroupId
      ? itemSubGroups.find((s) => s.id === subGroupFormValues.parentSubGroupId)
      : null;
    const isParentMandatoryService = !!parentGroup?.serviceFlag || !!parentSub?.serviceFlag;

    if (subGroupModalMode === "create") {
      const newSub: ItemSubGroup = {
        id: `sub-${Date.now()}`,
        subGroupCode: subGroupFormValues.subGroupCode || `SUB-${Date.now()}`,
        subGroupName: subGroupFormValues.subGroupName || "",
        itemGroupId: subGroupFormValues.itemGroupId || itemGroups[0]?.id || "",
        parentSubGroupId: subGroupFormValues.parentSubGroupId || null,
        description: subGroupFormValues.description || "",
        status: (subGroupFormValues.status as any) || "Active",
        serviceFlag: isParentMandatoryService ? true : !!subGroupFormValues.serviceFlag,
      };
      setItemSubGroups((prev) => [...prev, newSub]);
      toast.success("Sub Group created successfully.");
    } else {
      setItemSubGroups((prev) =>
        prev.map((sg) =>
          sg.id === subGroupFormValues.id
            ? ({
                ...sg,
                ...subGroupFormValues,
                serviceFlag: isParentMandatoryService ? true : !!subGroupFormValues.serviceFlag,
              } as ItemSubGroup)
            : sg,
        ),
      );
      toast.success("Sub Group updated successfully.");
    }
    setIsSubGroupModalOpen(false);
  };

  // Delete item from items list
  const handleDeleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    toast.success("Item deleted successfully.");
  };

  // Toggle item status
  const handleToggleItemStatus = (item: ItemProductMaster) => {
    const newStatus = item.status === "Active" ? "Inactive" : "Active";
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: newStatus } : i)));
    toast.success(`Item marked as ${newStatus}`);
  };

  return (
    <div className="flex h-screen bg-background font-sans antialiased text-foreground overflow-hidden">
      <ProcurementSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ProcurementTopbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
          {/* Breadcrumb / Top Indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border/80 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <currentTabMeta.icon className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                    {activeTab === "budget" || activeTab === "budget-approval"
                      ? "Procurement Budget"
                      : "Master Data Management"}
                  </span>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="text-xs text-muted-foreground font-semibold">
                    {pageMode === "list" ? "List Overview" : "Dedicated Form View"}
                  </span>
                </div>
                <h1 className="text-xl font-black text-foreground tracking-tight">
                  {currentTabMeta.label}
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">{currentTabMeta.desc}</p>
              </div>
            </div>

            {pageMode === "list" && activeTab !== "procurement-configuration" && (
              <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                {EXCEL_UPLOAD_SUPPORTED_TABS[activeTab] && (
                  <button
                    type="button"
                    onClick={() => setIsExcelUploadOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-600/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <FileSpreadsheet className="size-4" />
                    <span>Upload Excel</span>
                  </button>
                )}

                {activeTab !== "item-sub-group" && (
                  <button
                    type="button"
                    onClick={handleOpenCreate}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <Plus className="size-4" />
                    <span>
                      {activeTab === "budget"
                        ? "Create Budget"
                        : `Create ${currentTabMeta.label.split("/")[0].trim()}`}
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* DEDICATED FORM PAGE VIEWS (Step 2 & 3: Not Modals, except vendor-category which is a modal) */}
          {pageMode !== "list" && activeTab !== "vendor-category" && activeTab !== "procurement-configuration" && (
            <div className="bg-card rounded-2xl border border-border/80 p-5 lg:p-7 shadow-xs">
              {activeTab === "warehouse-store" && (
                <WarehouseStorePageForm
                  mode={pageMode}
                  initialData={selectedRecord}
                  companyList={companyList}
                  employeeList={employeeList}
                  onSave={(saved) => {
                    if (pageMode === "create") {
                      setWarehouses((prev) => [saved, ...prev]);
                      toast.success("Warehouse created successfully.");
                    } else {
                      setWarehouses((prev) => prev.map((w) => (w.id === saved.id ? saved : w)));
                      toast.success("Warehouse updated successfully.");
                    }
                    setPageMode("list");
                  }}
                  onCancel={() => setPageMode("list")}
                  onSwitchToEdit={() => setPageMode("edit")}
                />
              )}

              {activeTab === "supplier-vendor" && (
                <SupplierVendorPageForm
                  mode={pageMode}
                  initialData={selectedRecord}
                  vendorCategories={vendorCategories}
                  businessTypes={businessTypes}
                  origins={origins}
                  onSave={(saved) => {
                    if (pageMode === "create") {
                      setSuppliers((prev) => [saved, ...prev]);
                      toast.success("Supplier created successfully.");
                    } else {
                      setSuppliers((prev) => prev.map((s) => (s.id === saved.id ? saved : s)));
                      toast.success("Supplier updated successfully.");
                    }
                    setPageMode("list");
                  }}
                  onCancel={() => setPageMode("list")}
                  onSwitchToEdit={() => setPageMode("edit")}
                />
              )}

              {activeTab === "business-type" && (
                <BusinessTypePageForm
                  mode={pageMode}
                  initialData={selectedRecord}
                  onSave={(saved) => {
                    if (pageMode === "create") {
                      setBusinessTypes((prev) => [saved, ...prev]);
                      toast.success("Business Type created successfully.");
                    } else {
                      setBusinessTypes((prev) =>
                        prev.map((b) => (b.id === saved.id ? saved : b)),
                      );
                      toast.success("Business Type updated successfully.");
                    }
                    setPageMode("list");
                  }}
                  onCancel={() => setPageMode("list")}
                  onSwitchToEdit={() => setPageMode("edit")}
                />
              )}

              {activeTab === "item-sub-group" && (
                <ItemCreationPageForm
                  mode={pageMode}
                  initialData={selectedRecord}
                  targetSubGroup={activeTargetSubGroup}
                  subGroupBreadcrumb={
                    activeTargetSubGroup
                      ? getSubGroupBreadcrumb(activeTargetSubGroup.id, itemSubGroups, itemGroups)
                      : ""
                  }
                  allItemGroups={itemGroups}
                  allSubGroups={itemSubGroups}
                  onItemGroupsChange={setItemGroups}
                  onItemSubGroupsChange={setItemSubGroups}
                  itemCategories={itemCategories}
                  brands={brands}
                  origins={origins}
                  uoms={uoms}
                  warehouses={warehouses}
                  onSave={(saved) => {
                    if (pageMode === "create") {
                      setItems((prev) => [saved, ...prev]);
                      toast.success("Item created successfully.");
                    } else {
                      setItems((prev) => prev.map((i) => (i.id === saved.id ? saved : i)));
                      toast.success("Item updated successfully.");
                    }
                    setPageMode("list");
                  }}
                  onCancel={() => setPageMode("list")}
                  onSwitchToEdit={() => setPageMode("edit")}
                />
              )}

              {activeTab === "budget" && (
                <BudgetManagementPageForm
                  mode={pageMode}
                  initialData={selectedRecord}
                  itemCategories={itemCategories}
                  employeeList={employeeList}
                  onSave={(saved, isSubmit) => {
                    if (pageMode === "create") {
                      setBudgets((prev) => [saved, ...prev]);
                      toast.success(
                        isSubmit ? "Budget submitted for approval!" : "Budget draft saved.",
                      );
                    } else {
                      setBudgets((prev) => prev.map((b) => (b.id === saved.id ? saved : b)));
                      toast.success(
                        isSubmit ? "Budget submitted for approval!" : "Budget updated.",
                      );
                    }
                    setPageMode("list");
                  }}
                  onCancel={() => setPageMode("list")}
                  onSwitchToEdit={() => setPageMode("edit")}
                />
              )}

              {activeTab === "budget-approval" && (
                <BudgetApprovalPageForm
                  mode={pageMode}
                  initialData={selectedRecord}
                  onSave={(saved) => {
                    setBudgetApprovals((prev) =>
                      prev.map((b) => (b.id === saved.id ? saved : b)),
                    );
                    toast.success("Approval decision recorded successfully.");
                    setPageMode("list");
                  }}
                  onCancel={() => setPageMode("list")}
                  onSwitchToEdit={() => setPageMode("edit")}
                />
              )}

              {activeTab === "approval-authority" && (
                <ApprovalAuthorityPageForm
                  mode={pageMode}
                  initialData={selectedRecord}
                  companyList={companyList}
                  onSave={(saved) => {
                    if (pageMode === "create") {
                      setAuthorities((prev) => [saved, ...prev]);
                      toast.success("Approval Authority tier created.");
                    } else {
                      setAuthorities((prev) => prev.map((a) => (a.id === saved.id ? saved : a)));
                      toast.success("Approval Authority tier updated.");
                    }
                    setPageMode("list");
                  }}
                  onCancel={() => setPageMode("list")}
                  onSwitchToEdit={() => setPageMode("edit")}
                />
              )}

              {activeTab === "origin" && (
                <OriginMasterPageForm
                  mode={pageMode}
                  initialData={selectedRecord}
                  onSave={(saved) => {
                    if (pageMode === "create") {
                      setOrigins((prev) => [saved, ...prev]);
                      toast.success("Origin created successfully.");
                    } else {
                      setOrigins((prev) => prev.map((o) => (o.id === saved.id ? saved : o)));
                      toast.success("Origin updated successfully.");
                    }
                    setPageMode("list");
                  }}
                  onCancel={() => setPageMode("list")}
                  onSwitchToEdit={() => setPageMode("edit")}
                />
              )}

              {activeTab === "document-type-number-series" && (
                <DocumentSeriesPageForm
                  mode={pageMode}
                  initialData={selectedRecord}
                  companyList={companyList}
                  onSave={(saved) => {
                    if (pageMode === "create") {
                      setDocSeries((prev) => [saved, ...prev]);
                      toast.success("Document series created.");
                    } else {
                      setDocSeries((prev) => prev.map((d) => (d.id === saved.id ? saved : d)));
                      toast.success("Document series updated.");
                    }
                    setPageMode("list");
                  }}
                  onCancel={() => setPageMode("list")}
                  onSwitchToEdit={() => setPageMode("edit")}
                />
              )}

              {activeTab === "currency" && (
                <CurrencyMasterPageForm
                  mode={pageMode}
                  initialData={selectedRecord}
                  onSave={(saved) => {
                    if (pageMode === "create") {
                      setCurrencies((prev) => [saved, ...prev]);
                      toast.success("Currency added successfully.");
                    } else {
                      setCurrencies((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));
                      toast.success("Currency updated successfully.");
                    }
                    setPageMode("list");
                  }}
                  onCancel={() => setPageMode("list")}
                  onSwitchToEdit={() => setPageMode("edit")}
                />
              )}

              {activeTab === "uom" && (
                <UOMMasterPageForm
                  mode={pageMode}
                  initialData={selectedRecord}
                  onSave={(saved) => {
                    if (pageMode === "create") {
                      setUoms((prev) => [saved, ...prev]);
                      toast.success("UOM created successfully.");
                    } else {
                      setUoms((prev) => prev.map((u) => (u.id === saved.id ? saved : u)));
                      toast.success("UOM updated successfully.");
                    }
                    setPageMode("list");
                  }}
                  onCancel={() => setPageMode("list")}
                  onSwitchToEdit={() => setPageMode("edit")}
                />
              )}

              {activeTab === "payment-terms" && (
                <PaymentTermsPageForm
                  mode={pageMode}
                  initialData={selectedRecord}
                  onSave={(saved) => {
                    if (pageMode === "create") {
                      setPaymentTerms((prev) => [saved, ...prev]);
                      toast.success("Payment Term created successfully.");
                    } else {
                      setPaymentTerms((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
                      toast.success("Payment Term updated successfully.");
                    }
                    setPageMode("list");
                  }}
                  onCancel={() => setPageMode("list")}
                  onSwitchToEdit={() => setPageMode("edit")}
                />
              )}

              {activeTab === "item-group" && (
                <ItemGroupPageForm
                  mode={pageMode}
                  initialData={selectedRecord}
                  onSave={(saved) => {
                    if (pageMode === "create") {
                      setItemGroups((prev) => [saved, ...prev]);
                      toast.success("Item Group created successfully.");
                    } else {
                      setItemGroups((prev) => prev.map((g) => (g.id === saved.id ? saved : g)));
                      toast.success("Item Group updated successfully.");
                    }
                    setPageMode("list");
                  }}
                  onCancel={() => setPageMode("list")}
                  onSwitchToEdit={() => setPageMode("edit")}
                />
              )}

              {activeTab === "item-category" && (
                <ItemCategoryPageForm
                  mode={pageMode}
                  initialData={selectedRecord}
                  onSave={(saved) => {
                    if (pageMode === "create") {
                      setItemCategories((prev) => [saved, ...prev]);
                      toast.success("Item Category created.");
                    } else {
                      setItemCategories((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));
                      toast.success("Item Category updated.");
                    }
                    setPageMode("list");
                  }}
                  onCancel={() => setPageMode("list")}
                  onSwitchToEdit={() => setPageMode("edit")}
                />
              )}

              {activeTab === "brand" && (
                <BrandMasterPageForm
                  mode={pageMode}
                  initialData={selectedRecord}
                  origins={origins}
                  onSave={(saved) => {
                    if (pageMode === "create") {
                      setBrands((prev) => [saved, ...prev]);
                      toast.success("Brand created.");
                    } else {
                      setBrands((prev) => prev.map((b) => (b.id === saved.id ? saved : b)));
                      toast.success("Brand updated.");
                    }
                    setPageMode("list");
                  }}
                  onCancel={() => setPageMode("list")}
                  onSwitchToEdit={() => setPageMode("edit")}
                />
              )}

              {activeTab === "store-location" && (
                <StoreLocationPageForm
                  mode={pageMode}
                  initialData={selectedRecord}
                  warehouses={warehouses}
                  onSave={(saved) => {
                    if (pageMode === "create") {
                      setLocations((prev) => [saved, ...prev]);
                      toast.success("Location / Batch created.");
                    } else {
                      setLocations((prev) => prev.map((l) => (l.id === saved.id ? saved : l)));
                      toast.success("Location / Batch updated.");
                    }
                    setPageMode("list");
                  }}
                  onCancel={() => setPageMode("list")}
                  onSwitchToEdit={() => setPageMode("edit")}
                />
              )}
            </div>
          )}

          {/* VENDOR CATEGORY MODAL DIALOG */}
          {activeTab === "vendor-category" && pageMode !== "list" && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-card w-full max-w-xl rounded-2xl border border-border shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                <VendorCategoryPageForm
                  mode={pageMode}
                  initialData={selectedRecord}
                  onSave={(saved) => {
                    if (pageMode === "create") {
                      setVendorCategories((prev) => [saved, ...prev]);
                      toast.success("Vendor Category created.");
                    } else {
                      setVendorCategories((prev) =>
                        prev.map((c) => (c.id === saved.id ? saved : c)),
                      );
                      toast.success("Vendor Category updated.");
                    }
                    setPageMode("list");
                  }}
                  onCancel={() => setPageMode("list")}
                  onSwitchToEdit={() => setPageMode("edit")}
                />
              </div>
            </div>
          )}

          {/* PROCUREMENT CONFIGURATION DIRECT TAB */}
          {activeTab === "procurement-configuration" && (
            <ProcurementConfigurationForm />
          )}

          {/* STEP 1: LIST PAGE */}
          {(pageMode === "list" || activeTab === "vendor-category") && activeTab !== "procurement-configuration" && (
            <div className="bg-card rounded-2xl border border-border/80 shadow-xs overflow-hidden">
              {/* Filter / Search Console */}
              <div className="p-4 border-b border-border/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder={`Search ${currentTabMeta.label.toLowerCase()}...`}
                      className="w-full pl-8.5 pr-8 h-8.5 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <X className="size-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/60">
                    {(["All", "Active", "Inactive"] as const).map((st) => (
                      <button
                        type="button"
                        key={st}
                        onClick={() => {
                          setStatusFilter(st);
                          setCurrentPage(1);
                        }}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                          statusFilter === st
                            ? "bg-card text-amber-500 shadow-2xs font-extrabold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground font-medium ml-auto">
                  Showing{" "}
                  <span className="font-bold text-foreground">
                    {totalRecords > 0 ? (currentPage - 1) * pageSize + 1 : 0}
                  </span>{" "}
                  to{" "}
                  <span className="font-bold text-foreground">
                    {Math.min(currentPage * pageSize, totalRecords)}
                  </span>{" "}
                  of <span className="font-bold text-foreground">{totalRecords}</span> entries
                </div>
              </div>

              {/* ITEM CREATION DYNAMIC TREE EXPLORER */}
              {activeTab === "item-sub-group" ? (
                <div className="p-4 space-y-6">

                  {/* Tree Toolbar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-muted/20 p-3 rounded-xl border border-border/70">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          const allExp: Record<string, boolean> = {};
                          itemSubGroups.forEach((s) => (allExp[s.id] = true));
                          setExpandedSubGroupIds(allExp);
                        }}
                        className="px-2.5 py-1 rounded-md text-[11px] font-bold border border-border/80 bg-card hover:bg-muted text-foreground transition cursor-pointer"
                      >
                        Expand All
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpandedSubGroupIds({})}
                        className="px-2.5 py-1 rounded-md text-[11px] font-bold border border-border/80 bg-card hover:bg-muted text-foreground transition cursor-pointer"
                      >
                        Collapse All
                      </button>

                      <div className="relative w-52 sm:w-64">
                        <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          value={subGroupSearchQuery}
                          onChange={(e) => setSubGroupSearchQuery(e.target.value)}
                          placeholder="Search within dynamic tree..."
                          className="w-full pl-8 pr-7 h-7.5 rounded-md border border-border/80 bg-background text-[11px] font-medium outline-none focus:border-amber-500"
                        />
                        {subGroupSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setSubGroupSearchQuery("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            <X className="size-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-auto flex-wrap">
                      <button
                        type="button"
                        onClick={handleOpenAddItemGroup}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-2xs cursor-pointer"
                      >
                        <Plus className="size-3.5" />
                        <span>+ Add Item Group</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenAddRootSubGroup}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold transition shadow-2xs cursor-pointer"
                      >
                        <Plus className="size-3.5" />
                        <span>+ Add Sub Group</span>
                      </button>
                    </div>
                  </div>

                  {/* Selected Node Path Breadcrumbs */}
                  {selectedSubGroupTreeId ? (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-bold text-amber-700 dark:text-amber-400">
                          Selected Hierarchy:
                        </span>
                        <span className="font-mono text-[11px] font-bold text-foreground truncate">
                          {getSubGroupBreadcrumb(selectedSubGroupTreeId, itemSubGroups, itemGroups)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedSubGroupTreeId(null)}
                        className="text-muted-foreground hover:text-foreground text-[10.5px] font-semibold cursor-pointer shrink-0"
                      >
                        Clear Selection
                      </button>
                    </div>
                  ) : selectedGroupId ? (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-bold text-amber-700 dark:text-amber-400">
                          Selected Root Item Group:
                        </span>
                        <span className="font-mono text-[11px] font-bold text-foreground truncate">
                          {itemGroups.find((g) => g.id === selectedGroupId)?.groupName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedGroupId(null)}
                        className="text-muted-foreground hover:text-foreground text-[10.5px] font-semibold cursor-pointer shrink-0"
                      >
                        Clear Selection
                      </button>
                    </div>
                  ) : null}

                  {/* Dynamic Recursive Tree with Main/Root Parent Item Group */}
                  <div className="rounded-xl border border-border/70 p-3 bg-card space-y-2 overflow-x-auto min-h-[300px]">
                    {(() => {
                      const renderSubGroupTree = (nodes: SubGroupTreeNode[]) => {
                        return (
                          <div className="space-y-1">
                            {nodes.map((node) => {
                              const hasChildren = node.children && node.children.length > 0;
                              const isExpanded = !!expandedSubGroupIds[node.id];
                              const isSelected = selectedSubGroupTreeId === node.id;
                              const isQueryMatch =
                                Boolean(subGroupSearchQuery.trim()) &&
                                (node.subGroupName
                                  .toLowerCase()
                                  .includes(subGroupSearchQuery.toLowerCase()) ||
                                  node.subGroupCode
                                    .toLowerCase()
                                    .includes(subGroupSearchQuery.toLowerCase()));

                              return (
                                <div key={node.id} className="space-y-1">
                                  <div
                                    style={{ paddingLeft: `${node.depth * 20 + 8}px` }}
                                    className={`flex items-center justify-between p-2 rounded-lg transition-all text-xs border ${
                                      isSelected
                                        ? "bg-amber-500/15 border-amber-500/60 shadow-2xs"
                                        : isQueryMatch
                                          ? "bg-amber-500/15 border-amber-500 ring-1 ring-amber-500/30"
                                          : "hover:bg-muted/40 border-border/40 bg-background"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                      {hasChildren ? (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setExpandedSubGroupIds((prev) => ({
                                              ...prev,
                                              [node.id]: !prev[node.id],
                                            }))
                                          }
                                          className="size-5 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                                        >
                                          {isExpanded ? (
                                            <ChevronDown className="size-3.5 text-amber-500" />
                                          ) : (
                                            <ChevronRight className="size-3.5" />
                                          )}
                                        </button>
                                      ) : (
                                        <span className="w-5 text-center text-muted-foreground/40 font-mono shrink-0">
                                          ─
                                        </span>
                                      )}

                                      <FolderTree
                                        className={`size-4 shrink-0 ${
                                          node.depth === 1
                                            ? "text-blue-500"
                                            : node.depth === 2
                                              ? "text-emerald-500"
                                              : "text-purple-500"
                                        }`}
                                      />

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedSubGroupTreeId(node.id);
                                          setSelectedGroupId(node.itemGroupId);
                                        }}
                                        className="font-bold text-foreground hover:text-amber-500 text-left truncate flex items-center gap-2 cursor-pointer"
                                      >
                                        <span>{node.subGroupName}</span>
                                        {node.serviceFlag && (
                                          <span className="text-[9px] px-1.5 py-0.2 rounded font-extrabold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 shrink-0">
                                            SERVICE
                                          </span>
                                        )}
                                      </button>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1 shrink-0 ml-2">
                                      {items.filter((it) => it.subGroupId === node.id).length > 0 && (
                                        <span className="text-[10px] font-semibold text-muted-foreground px-1.5 py-0.5 rounded bg-background border border-border/60">
                                          C:{items.filter((it) => it.subGroupId === node.id).length}
                                        </span>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => handleOpenAddChildSubGroup(node)}
                                        title="Add Child Sub Group"
                                        className="size-6 rounded flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
                                      >
                                        <Plus className="size-3" />
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleOpenCreateItem(node)}
                                        title={`Create item under ${node.subGroupName}`}
                                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-white transition cursor-pointer"
                                      >
                                        Create Item
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          const parentGroup = itemGroups.find(
                                            (g) => g.id === node.itemGroupId,
                                          );
                                          const parentSub = node.parentSubGroupId
                                            ? itemSubGroups.find(
                                                (s) => s.id === node.parentSubGroupId,
                                              )
                                            : null;
                                          const isMandatory =
                                            !!parentGroup?.serviceFlag ||
                                            !!parentSub?.serviceFlag;

                                          setSubGroupModalMode("edit");
                                          setSubGroupFormValues({
                                            ...node,
                                            serviceFlag: isMandatory ? true : !!node.serviceFlag,
                                          });
                                          setIsSubGroupModalOpen(true);
                                        }}
                                        title="Edit Sub Group"
                                        className="p-1 rounded hover:bg-muted text-amber-500 hover:text-amber-600 cursor-pointer"
                                      >
                                        <Edit className="size-3.5" />
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleOpenDelete(node)}
                                        title="Delete Sub Group"
                                        className="p-1 rounded hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 cursor-pointer"
                                      >
                                        <Trash2 className="size-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  {hasChildren && isExpanded && (
                                    <div className="border-l-2 border-amber-500/20 ml-5 pl-1 space-y-1">
                                      {renderSubGroupTree(node.children)}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      };

                      return (
                        <div className="space-y-2">
                          {itemGroups.map((grp) => {
                            const rootSubNodes = buildSubGroupTreeNodes(itemSubGroups, grp.id, null, 1);
                            const isGrpExpanded = expandedSubGroupIds[grp.id] !== false;
                            const isGrpSelected = selectedGroupId === grp.id && !selectedSubGroupTreeId;
                            const grpItemCount = items.filter((it) => {
                              const sg = itemSubGroups.find((s) => s.id === it.subGroupId);
                              return sg?.itemGroupId === grp.id;
                            }).length;

                            return (
                              <div key={grp.id} className="space-y-1">
                                {/* Root Parent Item Group Node */}
                                <div
                                  className={`flex items-center justify-between p-2.5 rounded-xl transition-all text-xs border ${
                                    isGrpSelected
                                      ? "bg-amber-500/20 border-amber-500 shadow-2xs ring-1 ring-amber-500/40"
                                      : "bg-muted/40 hover:bg-muted/70 border-border/80"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setExpandedSubGroupIds((prev) => ({
                                          ...prev,
                                          [grp.id]: !isGrpExpanded,
                                        }))
                                      }
                                      className="size-5 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                                    >
                                      {isGrpExpanded ? (
                                        <ChevronDown className="size-4 text-amber-500" />
                                      ) : (
                                        <ChevronRight className="size-4" />
                                      )}
                                    </button>

                                    <div className="p-1 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
                                      <Layers className="size-4" />
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedGroupId(grp.id);
                                        setSelectedSubGroupTreeId(null);
                                      }}
                                      className="font-extrabold text-foreground hover:text-amber-500 text-left truncate flex items-center gap-2 cursor-pointer"
                                    >
                                      <span className="font-bold">{grp.groupName}</span>
                                      {grp.serviceFlag && (
                                        <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                                          SERVICE GROUP
                                        </span>
                                      )}
                                    </button>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                    <span className="text-[10px] font-semibold text-muted-foreground px-2 py-0.5 rounded bg-background border border-border/60">
                                      {grpItemCount} items
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenAddSubGroupUnderGroup(grp)}
                                      title={`Add sub group under ${grp.groupName}`}
                                      className="size-6 rounded flex items-center justify-center bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-white transition cursor-pointer"
                                    >
                                      <Plus className="size-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditItemGroup(grp)}
                                      title={`Edit group ${grp.groupName}`}
                                      className="size-6 rounded flex items-center justify-center hover:bg-muted text-amber-500 hover:text-amber-600 transition cursor-pointer"
                                    >
                                      <Edit className="size-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenDeleteItemGroup(grp)}
                                      title={`Delete group ${grp.groupName}`}
                                      className="size-6 rounded flex items-center justify-center hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition cursor-pointer"
                                    >
                                      <Trash2 className="size-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Child Sub Groups under this Item Group */}
                                {isGrpExpanded && rootSubNodes.length > 0 && (
                                  <div className="pl-4 border-l-2 border-amber-500/30 ml-3.5 my-1 space-y-1">
                                    {renderSubGroupTree(rootSubNodes)}
                                  </div>
                                )}
                                {isGrpExpanded && rootSubNodes.length === 0 && (
                                  <div className="pl-9 py-1 text-[11px] text-muted-foreground italic">
                                    No sub groups configured under this group yet.
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                  

                  {/* ITEMS LIST UNDER SELECTED SUB GROUP (Catalog Explorer) */}
                  <div className="pt-4 border-t border-border/70 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                          <Package className="size-4 text-amber-500" />
                          <span>
                            {selectedSubGroupTreeId
                              ? `Items under: ${itemSubGroups.find((s) => s.id === selectedSubGroupTreeId)?.subGroupName}`
                              : selectedGroupId
                                ? `Items under Group: ${itemGroups.find((g) => g.id === selectedGroupId)?.groupName}`
                                : "All Catalog Items"}
                          </span>
                        </h3>
                        <p className="text-[11px] text-muted-foreground">
                          {selectedSubGroupTreeId
                            ? "Filtered by active tree node. To create an item, click 'Create Item' on the relevant node above."
                            : "Showing all items in master catalog. Select a tree node above or search below."}
                        </p>
                      </div>

                      {/* Item Search Input (Requirement: Item Search) */}
                      <div className="relative w-full sm:w-72">
                        <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          value={catalogItemSearchQuery}
                          onChange={(e) => setCatalogItemSearchQuery(e.target.value)}
                          placeholder="Search items by code, name, category, brand..."
                          className="w-full pl-8.5 pr-8 h-8 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none"
                        />
                        {catalogItemSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setCatalogItemSearchQuery("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            <X className="size-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/70 overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-muted/50 border-b border-border/70 text-[11px] font-bold text-muted-foreground uppercase">
                          <tr>
                            <th className="py-2.5 px-3">Item Code</th>
                            <th className="py-2.5 px-3">Item Name</th>
                            <th className="py-2.5 px-3">Category</th>
                            <th className="py-2.5 px-3">Brand</th>
                            <th className="py-2.5 px-3">Origin</th>
                            <th className="py-2.5 px-3">Stock UOM</th>
                            <th className="py-2.5 px-3">Safety Stock</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {(() => {
                            const subGroupItems = items.filter((it) => {
                              const matchesGroup = selectedGroupId
                                ? itemSubGroups.some((sg) => sg.id === it.subGroupId && sg.itemGroupId === selectedGroupId)
                                : true;
                              const matchesSub = selectedSubGroupTreeId ? it.subGroupId === selectedSubGroupTreeId : true;
                              if (!matchesGroup || !matchesSub) return false;
                              if (!catalogItemSearchQuery.trim()) return true;
                              const q = catalogItemSearchQuery.toLowerCase();
                              return (
                                it.itemCode.toLowerCase().includes(q) ||
                                it.itemName.toLowerCase().includes(q) ||
                                (it.itemCategory && it.itemCategory.toLowerCase().includes(q)) ||
                                (it.brand && it.brand.toLowerCase().includes(q)) ||
                                (it.origin && it.origin.toLowerCase().includes(q)) ||
                                it.stockUOM.toLowerCase().includes(q)
                              );
                            });

                            if (subGroupItems.length === 0) {
                              return (
                                <tr>
                                  <td colSpan={9} className="py-8 text-center text-muted-foreground">
                                    No items found. Select a Sub Group node in the tree above and click &quot;Create Item&quot;.
                                  </td>
                                </tr>
                              );
                            }

                            return subGroupItems.map((item) => (
                              <tr key={item.id} className="hover:bg-muted/30">
                                <td className="py-2.5 px-3 font-mono font-bold text-foreground">
                                  {item.itemCode}
                                </td>
                                <td className="py-2.5 px-3 font-bold text-foreground">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span>{item.itemName}</span>
                                    {item.serviceFlag && (
                                      <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                                        SERVICE
                                      </span>
                                    )}
                                    {item.valuationMethod && (
                                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                        {item.valuationMethod}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-2.5 px-3">{item.itemCategory}</td>
                                <td className="py-2.5 px-3">{item.brand || "—"}</td>
                                <td className="py-2.5 px-3">{item.origin || "Bangladesh"}</td>
                                <td className="py-2.5 px-3 font-mono">{item.stockUOM}</td>
                                <td className="py-2.5 px-3 font-mono font-bold text-amber-600 dark:text-amber-400">
                                  {item.safetyStock ?? 10}
                                </td>
                                <td className="py-2.5 px-3">
                                  <span
                                    className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border ${
                                      item.status === "Active"
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedRecord(item);
                                        setActiveTargetSubGroup(
                                          itemSubGroups.find((s) => s.id === item.subGroupId) || null,
                                        );
                                        setPageMode("view");
                                      }}
                                      title="View Item Details"
                                      className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                                    >
                                      <Eye className="size-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedRecord(item);
                                        setActiveTargetSubGroup(
                                          itemSubGroups.find((s) => s.id === item.subGroupId) || null,
                                        );
                                        setPageMode("edit");
                                      }}
                                      title="Edit Item"
                                      className="p-1 rounded hover:bg-muted text-amber-500 hover:text-amber-600 cursor-pointer"
                                    >
                                      <Edit className="size-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleToggleItemStatus(item)}
                                      title="Toggle Active/Inactive"
                                      className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                                    >
                                      {item.status === "Active" ? (
                                        <ToggleRight className="size-3.5 text-emerald-500" />
                                      ) : (
                                        <ToggleLeft className="size-3.5 text-slate-400" />
                                      )}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteItem(item.id)}
                                      title="Delete Item"
                                      className="p-1 rounded hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 cursor-pointer"
                                    >
                                      <Trash2 className="size-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                /* STANDARD DATA TABLE FOR OTHER TABS */
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/50 border-b border-border/70 text-[11px] font-bold text-muted-foreground uppercase">
                      <tr>
                        {/* WAREHOUSE STORE */}
                        {activeTab === "warehouse-store" && (
                          <>
                            <th className="py-3 px-3.5">Store Code</th>
                            <th className="py-3 px-3.5">Store Name</th>
                            <th className="py-3 px-3.5">Store Manager</th>
                            <th className="py-3 px-3.5">Contact No</th>
                            <th className="py-3 px-3.5">Valuation</th>
                            <th className="py-3 px-3.5">Permissions</th>
                            <th className="py-3 px-3.5">Status</th>
                          </>
                        )}

                        {/* STORE LOCATION */}
                        {activeTab === "store-location" && (
                          <>
                            <th className="py-3 px-3.5">Mode</th>
                            <th className="py-3 px-3.5">Target Store</th>
                            <th className="py-3 px-3.5">Company Area/Section</th>
                            <th className="py-3 px-3.5">Code / Numbering</th>
                            <th className="py-3 px-3.5">Details</th>
                            <th className="py-3 px-3.5">Status</th>
                          </>
                        )}

                        {/* VENDOR CATEGORY (Type / Category column REMOVED) */}
                        {activeTab === "vendor-category" && (
                          <>
                            <th className="py-3 px-3.5">Category Code</th>
                            <th className="py-3 px-3.5">Category Name</th>
                            <th className="py-3 px-3.5">Status</th>
                          </>
                        )}

                        {/* SUPPLIER / VENDOR */}
                        {activeTab === "supplier-vendor" && (
                          <>
                            <th className="py-3 px-3.5">Supplier Code</th>
                            <th className="py-3 px-3.5">Supplier / Vendor Name</th>
                            <th className="py-3 px-3.5">Category</th>
                            <th className="py-3 px-3.5">Contact Person</th>
                            <th className="py-3 px-3.5">Mobile</th>
                            <th className="py-3 px-3.5">Country</th>
                            <th className="py-3 px-3.5">Origin Type</th>
                            <th className="py-3 px-3.5">Status</th>
                          </>
                        )}

                        {/* BUSINESS TYPE */}
                        {activeTab === "business-type" && (
                          <>
                            <th className="py-3 px-3.5">Type Code</th>
                            <th className="py-3 px-3.5">Business Type Name</th>
                            <th className="py-3 px-3.5">Status</th>
                          </>
                        )}

                        {/* ITEM GROUP (Type / Category column REMOVED) */}
                        {activeTab === "item-group" && (
                          <>
                            <th className="py-3 px-3.5">Group Code</th>
                            <th className="py-3 px-3.5">Group Name</th>
                            <th className="py-3 px-3.5">Description</th>
                            <th className="py-3 px-3.5">Status</th>
                          </>
                        )}

                        {/* ITEM SUB GROUP TABLE VIEW */}
                        {(activeTab as string) === "item-sub-group" && (
                          <>
                            <th className="py-3 px-3.5">Sub Group Code</th>
                            <th className="py-3 px-3.5">Sub Group Name</th>
                            <th className="py-3 px-3.5">Parent Sub Group</th>
                            <th className="py-3 px-3.5">Status</th>
                          </>
                        )}

                        {/* ITEM CATEGORY */}
                        {activeTab === "item-category" && (
                          <>
                            <th className="py-3 px-3.5">Category Code</th>
                            <th className="py-3 px-3.5">Category Name</th>
                            <th className="py-3 px-3.5">Classification</th>
                            <th className="py-3 px-3.5">Status</th>
                          </>
                        )}

                        {/* BRAND (Type / Category column REMOVED) */}
                        {activeTab === "brand" && (
                          <>
                            <th className="py-3 px-3.5">Brand Code</th>
                            <th className="py-3 px-3.5">Brand Name</th>
                            <th className="py-3 px-3.5">Manufacturer</th>
                            <th className="py-3 px-3.5">Origin Country</th>
                            <th className="py-3 px-3.5">Website</th>
                            <th className="py-3 px-3.5">Status</th>
                          </>
                        )}

                        {/* ORIGIN (NEW!) */}
                        {activeTab === "origin" && (
                          <>
                            <th className="py-3 px-3.5">Origin Code</th>
                            <th className="py-3 px-3.5">Origin Name</th>
                            <th className="py-3 px-3.5">Status</th>
                          </>
                        )}

                        {/* UOM (Type / Category column REMOVED) */}
                        {activeTab === "uom" && (
                          <>
                            <th className="py-3 px-3.5">UOM Name</th>
                            <th className="py-3 px-3.5">Status</th>
                          </>
                        )}

                        {/* PAYMENT TERMS */}
                        {activeTab === "payment-terms" && (
                          <>
                            <th className="py-3 px-3.5">Term Code</th>
                            <th className="py-3 px-3.5">Term Name</th>
                            <th className="py-3 px-3.5">Status</th>
                          </>
                        )}

                        {/* CURRENCY (Type/Category REMOVED, Details/Configurations REMOVED, Symbol ADDED) */}
                        {activeTab === "currency" && (
                          <>
                            <th className="py-3 px-3.5">Currency Code</th>
                            <th className="py-3 px-3.5">Currency Name</th>
                            <th className="py-3 px-3.5">Symbol</th>
                            <th className="py-3 px-3.5">Cur. Sub Unit</th>
                            <th className="py-3 px-3.5">Amount Format</th>
                            <th className="py-3 px-3.5">Exchange Rate</th>
                            <th className="py-3 px-3.5">Rate Date</th>
                            <th className="py-3 px-3.5">Status</th>
                          </>
                        )}

                        {/* BUDGET MANAGEMENT */}
                        {activeTab === "budget" && (
                          <>
                            <th className="py-3 px-3.5">Budget ID</th>
                            <th className="py-3 px-3.5">Employee Name</th>
                            <th className="py-3 px-3.5">Department</th>
                            <th className="py-3 px-3.5">Period</th>
                            <th className="py-3 px-3.5">Total Budget</th>
                            <th className="py-3 px-3.5">Status</th>
                          </>
                        )}

                        {/* BUDGET APPROVAL */}
                        {activeTab === "budget-approval" && (
                          <>
                            <th className="py-3 px-3.5">Budget Code</th>
                            <th className="py-3 px-3.5">Department</th>
                            <th className="py-3 px-3.5">Total Budget</th>
                            <th className="py-3 px-3.5">Submitted By</th>
                            <th className="py-3 px-3.5">Approval Level</th>
                            <th className="py-3 px-3.5">Decision</th>
                          </>
                        )}

                        {/* APPROVAL AUTHORITY */}
                        {activeTab === "approval-authority" && (
                          <>
                            <th className="py-3 px-3.5">Authority Code</th>
                            <th className="py-3 px-3.5">Role / Designation</th>
                            <th className="py-3 px-3.5">Department</th>
                            <th className="py-3 px-3.5">Approval Type</th>
                            <th className="py-3 px-3.5">Amount Range</th>
                            <th className="py-3 px-3.5">Level</th>
                            <th className="py-3 px-3.5">Status</th>
                          </>
                        )}

                        {/* DOCUMENT NUMBER SERIES */}
                        {activeTab === "document-type-number-series" && (
                          <>
                            <th className="py-3 px-3.5">Document Type</th>
                            <th className="py-3 px-3.5">Company</th>
                            <th className="py-3 px-3.5">Prefix</th>
                            <th className="py-3 px-3.5">Date Format</th>
                            <th className="py-3 px-3.5">Separator</th>
                            <th className="py-3 px-3.5">Reset Frequency</th>
                            <th className="py-3 px-3.5">Preview / Format</th>
                            <th className="py-3 px-3.5">Status</th>
                          </>
                        )}

                        <th className="py-3 px-3.5 text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-border/60">
                      {paginatedRecords.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="py-12 text-center text-muted-foreground">
                            <div className="font-bold text-foreground">No records found</div>
                            <p className="text-xs mt-1">Try adjusting your search or filters.</p>
                          </td>
                        </tr>
                      ) : (
                        paginatedRecords.map((item) => (
                          <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                            {/* WAREHOUSE STORE */}
                            {activeTab === "warehouse-store" && (
                              <>
                                <td className="py-2.5 px-3.5 font-mono font-bold text-foreground">
                                  {item.storeCode}
                                </td>
                                <td className="py-2.5 px-3.5 font-bold text-foreground">
                                  {item.storeName}
                                </td>
                                <td className="py-2.5 px-3.5 font-medium">{item.storeManager || "—"}</td>
                                <td className="py-2.5 px-3.5 font-mono">{item.contactNumber || "—"}</td>
                                <td className="py-2.5 px-3.5 font-mono text-[11px]">
                                  {item.stockValuationMethod || "FIFO"}
                                </td>
                                <td className="py-2.5 px-3.5">
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                    {item.permissions?.length || 0} Staff
                                  </span>
                                </td>
                                <td className="py-2.5 px-3.5">
                                  <span
                                    className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border ${
                                      item.status === "Active"
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </td>
                              </>
                            )}

                            {/* STORE LOCATION */}
                            {activeTab === "store-location" && (
                              <>
                                <td className="py-2.5 px-3.5 font-bold text-amber-600 dark:text-amber-400">
                                  {item.trackingMode || "Location"}
                                </td>
                                <td className="py-2.5 px-3.5 font-medium">{item.store}</td>
                                <td className="py-2.5 px-3.5 font-medium text-foreground">
                                  {item.companyAreaSectionName || item.companyAreaSection || "Central Warehouse Area"}
                                </td>
                                <td className="py-2.5 px-3.5 font-mono font-bold">
                                  {item.locationCode || item.batchNumbering}
                                </td>
                                <td className="py-2.5 px-3.5">
                                  <div className="flex items-center gap-1.5">
                                    <span>{item.locationName || `Expires: ${item.expireDate || "N/A"}`}</span>
                                    {item.defaultLocationName && item.trackingMode === "Location" && (
                                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 shrink-0">
                                        Default
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-2.5 px-3.5">
                                  <span
                                    className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border ${
                                      item.status === "Active"
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </td>
                              </>
                            )}

                            {/* VENDOR CATEGORY (Type / Category column REMOVED) */}
                            {activeTab === "vendor-category" && (
                              <>
                                <td className="py-2.5 px-3.5 font-mono font-bold text-foreground">
                                  {item.categoryCode}
                                </td>
                                <td className="py-2.5 px-3.5 font-bold text-foreground">
                                  {item.categoryName}
                                </td>
                                <td className="py-2.5 px-3.5">
                                  <span
                                    className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border ${
                                      item.status === "Active"
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </td>
                              </>
                            )}

                            {/* SUPPLIER / VENDOR */}
                            {activeTab === "supplier-vendor" && (
                              <>
                                <td className="py-2.5 px-3.5 font-mono font-bold text-foreground">
                                  {item.vendorCode}
                                </td>
                                <td className="py-2.5 px-3.5 font-bold text-foreground">
                                  {item.vendorName || item.supplierName}
                                </td>
                                <td className="py-2.5 px-3.5">{item.vendorCategory}</td>
                                <td className="py-2.5 px-3.5">{item.contactPersonName || "—"}</td>
                                <td className="py-2.5 px-3.5 font-mono">{item.mobileNumber || "—"}</td>
                                <td className="py-2.5 px-3.5">{item.country || "Bangladesh"}</td>
                                <td className="py-2.5 px-3.5">
                                  <span
                                    className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border ${
                                      (item.localForeignStatus || (item.country?.toLowerCase() === "bangladesh" ? "Local" : "Foreign")) === "Local"
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                        : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                                    }`}
                                  >
                                    {item.localForeignStatus || (item.country?.toLowerCase() === "bangladesh" ? "Local" : "Foreign")}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3.5">
                                  <span
                                    className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border ${
                                      item.status === "Active"
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </td>
                              </>
                            )}

                            {/* BUSINESS TYPE */}
                            {activeTab === "business-type" && (
                              <>
                                <td className="py-2.5 px-3.5 font-mono font-bold text-foreground">
                                  {item.typeCode}
                                </td>
                                <td className="py-2.5 px-3.5 font-bold text-foreground">
                                  {item.businessTypeName}
                                </td>
                                <td className="py-2.5 px-3.5">
                                  <span
                                    className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border ${
                                      item.status === "Active"
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </td>
                              </>
                            )}

                            {/* ITEM GROUP (Type / Category column REMOVED) */}
                            {activeTab === "item-group" && (
                              <>
                                <td className="py-2.5 px-3.5 font-mono font-bold text-foreground">
                                  {item.groupCode}
                                </td>
                                <td className="py-2.5 px-3.5 font-bold text-foreground">
                                  {item.groupName}
                                </td>
                                <td className="py-2.5 px-3.5 text-muted-foreground truncate max-w-xs">
                                  {item.description || "—"}
                                </td>
                                <td className="py-2.5 px-3.5">
                                  <span
                                    className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border ${
                                      item.status === "Active"
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </td>
                              </>
                            )}

                            {/* ITEM SUB GROUP TABLE */}
                            {(activeTab as string) === "item-sub-group" && (
                              <>
                                <td className="py-2.5 px-3.5 font-mono font-bold text-foreground">
                                  {item.subGroupCode}
                                </td>
                                <td className="py-2.5 px-3.5 font-bold text-foreground">
                                  {item.subGroupName}
                                </td>
                                <td className="py-2.5 px-3.5 text-muted-foreground">
                                  {item.parentSubGroupId || "Root"}
                                </td>
                                <td className="py-2.5 px-3.5">
                                  <span
                                    className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border ${
                                      item.status === "Active"
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </td>
                              </>
                            )}

                            {/* ITEM CATEGORY */}
                            {activeTab === "item-category" && (
                              <>
                                <td className="py-2.5 px-3.5 font-mono font-bold text-foreground">
                                  {item.categoryCode}
                                </td>
                                <td className="py-2.5 px-3.5 font-bold text-foreground">
                                  {item.categoryName}
                                </td>
                                <td className="py-2.5 px-3.5">{item.categoryType}</td>
                                <td className="py-2.5 px-3.5">
                                  <span
                                    className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border ${
                                      item.status === "Active"
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </td>
                              </>
                            )}

                            {/* BRAND (Type / Category column REMOVED) */}
                            {activeTab === "brand" && (
                              <>
                                <td className="py-2.5 px-3.5 font-mono font-bold text-foreground">
                                  {item.brandCode}
                                </td>
                                <td className="py-2.5 px-3.5 font-bold text-foreground">
                                  {item.brandName}
                                </td>
                                <td className="py-2.5 px-3.5">{item.manufacturer || "—"}</td>
                                <td className="py-2.5 px-3.5">{item.countryOfOrigin || "—"}</td>
                                <td className="py-2.5 px-3.5 text-muted-foreground truncate max-w-xs">
                                  {item.website || "—"}
                                </td>
                                <td className="py-2.5 px-3.5">
                                  <span
                                    className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border ${
                                      item.status === "Active"
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </td>
                              </>
                            )}

                            {/* ORIGIN (NEW!) */}
                            {activeTab === "origin" && (
                              <>
                                <td className="py-2.5 px-3.5 font-mono font-bold text-foreground">
                                  {item.originCode}
                                </td>
                                <td className="py-2.5 px-3.5 font-bold text-foreground">
                                  {item.originName}
                                </td>
                                <td className="py-2.5 px-3.5">
                                  <span
                                    className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border ${
                                      item.status === "Active"
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </td>
                              </>
                            )}

                            {/* UOM (Type / Category column REMOVED) */}
                            {activeTab === "uom" && (
                              <>
                                <td className="py-2.5 px-3.5 font-bold text-foreground">
                                  {item.uomName}
                                </td>
                                <td className="py-2.5 px-3.5">
                                  <span
                                    className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border ${
                                      item.status === "Active"
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </td>
                              </>
                            )}

                            {/* PAYMENT TERMS */}
                            {activeTab === "payment-terms" && (
                              <>
                                <td className="py-2.5 px-3.5 font-mono font-bold text-foreground">
                                  {item.termCode}
                                </td>
                                <td className="py-2.5 px-3.5 font-bold text-foreground">
                                  {item.termName}
                                </td>
                                <td className="py-2.5 px-3.5">
                                  <span
                                    className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border ${
                                      item.status === "Active"
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </td>
                              </>
                            )}

                            {/* CURRENCY (Type/Category REMOVED, Details/Configurations REMOVED, Symbol ADDED) */}
                            {activeTab === "currency" && (
                              <>
                                <td className="py-2.5 px-3.5 font-mono font-bold text-foreground">
                                  {item.currencyCode}
                                </td>
                                <td className="py-2.5 px-3.5 font-bold text-foreground">
                                  {item.currencyName}
                                </td>
                                <td className="py-2.5 px-3.5 font-bold text-amber-600 dark:text-amber-400 text-sm">
                                  {item.symbol || "$"}
                                </td>
                                <td className="py-2.5 px-3.5 text-xs text-muted-foreground font-medium">
                                  {item.subUnit || "—"}
                                </td>
                                <td className="py-2.5 px-3.5 font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                  {item.amountFormat || "1,00,000.00"}
                                </td>
                                <td className="py-2.5 px-3.5 font-mono font-bold">
                                  {item.exchangeRate ?? 1.0}
                                </td>
                                <td className="py-2.5 px-3.5 font-mono text-[11px] text-muted-foreground">
                                  {item.rateDate || "—"}
                                </td>
                                <td className="py-2.5 px-3.5">
                                  <span
                                    className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border ${
                                      item.status === "Active"
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </td>
                              </>
                            )}

                            {/* BUDGET MANAGEMENT */}
                            {activeTab === "budget" && (
                              <>
                                <td className="py-2.5 px-3.5 font-mono font-bold text-foreground">
                                  {item.budgetCode}
                                </td>
                                <td className="py-2.5 px-3.5 font-bold text-foreground">
                                  {item.employeeName || "Tahmid Afsar Shapno"}
                                </td>
                                <td className="py-2.5 px-3.5">{item.department}</td>
                                <td className="py-2.5 px-3.5">{item.budgetPeriod || "Yearly"}</td>
                                <td className="py-2.5 px-3.5 font-mono font-black text-amber-600 dark:text-amber-400">
                                  {(
                                    item.totalBudget ||
                                    item.originalBudget ||
                                    0
                                  ).toLocaleString()}{" "}
                                  {item.currency || "BDT"}
                                </td>
                                <td className="py-2.5 px-3.5">
                                  <span
                                    className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border ${
                                      item.status === "Approved"
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        : item.status === "Submitted"
                                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                                          : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                    }`}
                                  >
                                    {item.status || "Draft"}
                                  </span>
                                </td>
                              </>
                            )}

                            {/* BUDGET APPROVAL */}
                            {activeTab === "budget-approval" && (
                              <>
                                <td className="py-2.5 px-3.5 font-mono font-bold text-foreground">
                                  {item.budgetCode}
                                </td>
                                <td className="py-2.5 px-3.5">{item.department}</td>
                                <td className="py-2.5 px-3.5 font-mono font-bold">
                                  {(item.totalBudget || 0).toLocaleString()} ৳
                                </td>
                                <td className="py-2.5 px-3.5">{item.submittedBy}</td>
                                <td className="py-2.5 px-3.5">{item.approvalLevel}</td>
                                <td className="py-2.5 px-3.5">
                                  <span
                                    className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border ${
                                      item.decision === "Approved"
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        : item.decision === "Under Review"
                                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                                          : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                                    }`}
                                  >
                                    {item.decision}
                                  </span>
                                </td>
                              </>
                            )}

                            {/* APPROVAL AUTHORITY */}
                            {activeTab === "approval-authority" && (
                              <>
                                <td className="py-2.5 px-3.5 font-mono font-bold text-foreground">
                                  {item.authorityCode}
                                </td>
                                <td className="py-2.5 px-3.5 font-bold text-foreground">
                                  {item.roleDesignation || item.authorityName}
                                </td>
                                <td className="py-2.5 px-3.5">{item.department}</td>
                                <td className="py-2.5 px-3.5 font-medium">{item.approvalType}</td>
                                <td className="py-2.5 px-3.5 font-mono text-[11px]">
                                  {(item.minimumAmount || 0).toLocaleString()} -{" "}
                                  {(item.maximumAmount || 0).toLocaleString()} ৳
                                </td>
                                <td className="py-2.5 px-3.5 font-mono">Tier {item.approvalLevel}</td>
                                <td className="py-2.5 px-3.5">
                                  <span
                                    className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border ${
                                      item.status === "Active"
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </td>
                              </>
                            )}

                            {/* DOCUMENT NUMBER SERIES */}
                            {activeTab === "document-type-number-series" && (
                              <>
                                <td className="py-2.5 px-3.5 font-bold text-foreground">
                                  {item.documentType}
                                </td>
                                <td className="py-2.5 px-3.5 text-xs text-muted-foreground">
                                  {item.company || "All Companies"}
                                </td>
                                <td className="py-2.5 px-3.5 font-mono font-bold text-amber-600 dark:text-amber-400">
                                  {item.prefix}
                                </td>
                                <td className="py-2.5 px-3.5 text-xs font-medium">
                                  {item.dateFormat || "Year + Month"}
                                </td>
                                <td className="py-2.5 px-3.5 font-mono">
                                  {item.separator === "None" ? "—" : item.separator || "-"}
                                </td>
                                <td className="py-2.5 px-3.5">{item.resetFrequency || "Yearly"}</td>
                                <td className="py-2.5 px-3.5 font-mono font-bold">
                                  {formatDocumentNumber(item)}
                                </td>
                                <td className="py-2.5 px-3.5">
                                  <span
                                    className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border ${
                                      item.status === "Active"
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </td>
                              </>
                            )}

                            {/* Standard Row Actions (Step 3: View, Edit, Active/Inactive, Delete) */}
                            <td className="py-2.5 px-3.5 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleOpenView(item)}
                                  title="View Record (Read-Only)"
                                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
                                >
                                  <Eye className="size-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(item)}
                                  title="Edit Record"
                                  className="p-1.5 rounded-lg hover:bg-muted text-amber-500 hover:text-amber-600 transition cursor-pointer"
                                >
                                  <Edit className="size-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(item)}
                                  title="Toggle Active / Inactive"
                                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
                                >
                                  {item.status === "Active" || item.locationStatus === "Active" ? (
                                    <ToggleRight className="size-3.5 text-emerald-500" />
                                  ) : (
                                    <ToggleLeft className="size-3.5 text-slate-400" />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenDelete(item)}
                                  title="Delete Record"
                                  className="p-1.5 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition cursor-pointer"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Bar */}
              {activeTab !== "item-sub-group" && totalRecords > pageSize && (
                <div className="p-3.5 border-t border-border/70 flex items-center justify-between text-xs text-muted-foreground">
                  <div>
                    Page <span className="font-bold text-foreground">{currentPage}</span> of{" "}
                    <span className="font-bold text-foreground">
                      {Math.ceil(totalRecords / pageSize)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      className="px-2.5 py-1 rounded-md border border-border/80 disabled:opacity-40 hover:bg-muted cursor-pointer"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={currentPage >= Math.ceil(totalRecords / pageSize)}
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className="px-2.5 py-1 rounded-md border border-border/80 disabled:opacity-40 hover:bg-muted cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* SUB GROUP CREATION / EDIT MODAL */}
      {isSubGroupModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <h3 className="text-sm font-bold text-foreground">
                {subGroupModalMode === "create" ? "Add Item Sub Group" : "Edit Item Sub Group"}
              </h3>
              <button
                type="button"
                onClick={() => setIsSubGroupModalOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSubGroupModal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">Sub Group Code *</label>
                <input
                  type="text"
                  value={subGroupFormValues.subGroupCode || ""}
                  onChange={(e) =>
                    setSubGroupFormValues({ ...subGroupFormValues, subGroupCode: e.target.value })
                  }
                  className="w-full h-8.5 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">Sub Group Name *</label>
                <input
                  type="text"
                  value={subGroupFormValues.subGroupName || ""}
                  onChange={(e) =>
                    setSubGroupFormValues({ ...subGroupFormValues, subGroupName: e.target.value })
                  }
                  placeholder="e.g. Cotton Yarn, Laptops, Circuit Breakers"
                  className="w-full h-8.5 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none"
                />
                {subGroupFormErrors.subGroupName && (
                  <p className="text-[10px] text-rose-500 mt-1">{subGroupFormErrors.subGroupName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">Parent Item Group</label>
                <select
                  value={subGroupFormValues.itemGroupId || ""}
                  onChange={(e) => {
                    const newGroupId = e.target.value;
                    const newParentGroup = itemGroups.find((g) => g.id === newGroupId);
                    const parentSub = subGroupFormValues.parentSubGroupId
                      ? itemSubGroups.find((s) => s.id === subGroupFormValues.parentSubGroupId)
                      : null;
                    const isMandatory = !!newParentGroup?.serviceFlag || !!parentSub?.serviceFlag;

                    setSubGroupFormValues({
                      ...subGroupFormValues,
                      itemGroupId: newGroupId,
                      serviceFlag: isMandatory ? true : false,
                    });
                  }}
                  className="w-full h-8.5 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none"
                >
                  {itemGroups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.groupName} ({g.groupCode}){g.serviceFlag ? " [Service]" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">Description</label>
                <textarea
                  rows={2}
                  value={subGroupFormValues.description || ""}
                  onChange={(e) =>
                    setSubGroupFormValues({ ...subGroupFormValues, description: e.target.value })
                  }
                  className="w-full p-2.5 rounded-lg border border-border/80 bg-background text-xs resize-none focus:border-amber-500 outline-none"
                />
              </div>

              {(() => {
                const parentGroup = itemGroups.find((g) => g.id === subGroupFormValues.itemGroupId);
                const parentSub = subGroupFormValues.parentSubGroupId
                  ? itemSubGroups.find((s) => s.id === subGroupFormValues.parentSubGroupId)
                  : null;
                const isParentMandatoryService =
                  !!parentGroup?.serviceFlag || !!parentSub?.serviceFlag;

                return (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="procSubGroupServiceFlag"
                      disabled={isParentMandatoryService}
                      checked={isParentMandatoryService ? true : !!subGroupFormValues.serviceFlag}
                      onChange={(e) =>
                        setSubGroupFormValues({
                          ...subGroupFormValues,
                          serviceFlag: e.target.checked,
                        })
                      }
                      className="size-4 rounded border-border text-amber-500 focus:ring-amber-500/20 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    />
                    <label
                      htmlFor="procSubGroupServiceFlag"
                      className={`text-xs font-semibold text-foreground ${
                        isParentMandatoryService ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                    >
                      Service Item Group (Non-physical goods or external services)
                    </label>
                    {isParentMandatoryService && (
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        Inherited from Parent
                      </span>
                    )}
                  </div>
                );
              })()}

              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">Status</label>
                <select
                  value={subGroupFormValues.status || "Active"}
                  onChange={(e) =>
                    setSubGroupFormValues({ ...subGroupFormValues, status: e.target.value as any })
                  }
                  className="w-full h-8.5 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubGroupModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  {subGroupModalMode === "create" ? "Create Sub Group" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-sm rounded-2xl border border-border shadow-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600">
                <AlertCircle className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Confirm Record Deletion</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Are you sure you want to delete this master data entry? This action cannot be
                  undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setItemToDelete(null);
                }}
                className="px-4 py-2 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXCEL DATA UPLOAD MODAL */}
      {isExcelUploadOpen && EXCEL_UPLOAD_SUPPORTED_TABS[activeTab] && (
        <ExcelDataUploadModal
          isOpen={isExcelUploadOpen}
          onClose={() => setIsExcelUploadOpen(false)}
          entityType={EXCEL_UPLOAD_SUPPORTED_TABS[activeTab]}
          entityLabel={currentTabMeta?.label || "Data"}
          onImport={(rows) => handleExcelImport(EXCEL_UPLOAD_SUPPORTED_TABS[activeTab], rows)}
        />
      )}

      {/* ITEM GROUP MODAL */}
      <ItemGroupModal
        isOpen={isItemGroupModalOpen}
        mode={itemGroupModalMode}
        initialData={itemGroupModalData}
        onSave={handleSaveItemGroup}
        onClose={() => setIsItemGroupModalOpen(false)}
      />
    </div>
  );
}
