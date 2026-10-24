import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Package,
  Layers,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Tag,
  Building2,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  HeartHandshake,
  Filter,
  Check,
  X,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/zakat-asset-master")({
  component: ZakatAssetMasterPage,
});

export interface ZakatAssetCategory {
  id: string;
  code: string;
  name: string;
  description: string;
  suggestedPurpose: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

export interface ZakatAssetItem {
  id: string;
  categoryId: string;
  categoryName: string;
  itemCode: string;
  assetType: string;
  defaultQty: string;
  defaultVendorLocation: string;
  estimatedCostMin?: number;
  estimatedCostMax?: number;
  suggestedPurpose: string;
  status: "Active" | "Inactive";
  description?: string;
  createdAt: string;
}

export const INITIAL_ZAKAT_CATEGORIES: ZakatAssetCategory[] = [
  {
    id: "CAT-VEH",
    code: "VEH",
    name: "Vehicle / Transport",
    description: "Wheeled livelihood transportation, electric auto-vans, rickshaws, and delivery cargo vans.",
    suggestedPurpose: "Vehicle",
    status: "Active",
    createdAt: "2026-01-10",
  },
  {
    id: "CAT-ANI",
    code: "ANI",
    name: "Farm Animal / Livestock",
    description: "Dairy cows, breeding goats, sheep, and commercial poultry packages for rural income generation.",
    suggestedPurpose: "Farm Animal",
    status: "Active",
    createdAt: "2026-01-10",
  },
  {
    id: "CAT-BIZ",
    code: "BIZ",
    name: "Business Setup / Livelihood",
    description: "Micro-business kiosk setups, grocery wholesale stock, pushcarts, and sewing/tool kits.",
    suggestedPurpose: "Business Setup",
    status: "Active",
    createdAt: "2026-01-10",
  },
  {
    id: "CAT-MED",
    code: "MED",
    name: "Medical & Assistive Equipment",
    description: "Chemotherapy treatments, oxygen concentrators, wheelchairs, and orthopedic surgery implants.",
    suggestedPurpose: "Medical Treatment",
    status: "Active",
    createdAt: "2026-01-10",
  },
  {
    id: "CAT-REL",
    code: "REL",
    name: "Shelter & Community Equipment",
    description: "Corrugated roofing tin, house reconstruction timber, and disaster rehabilitation materials.",
    suggestedPurpose: "Disaster Relief",
    status: "Active",
    createdAt: "2026-01-10",
  },
];

export const INITIAL_ZAKAT_ITEMS: ZakatAssetItem[] = [
  // 1. Vehicle / Transport
  {
    id: "AST-VEH-01",
    categoryId: "CAT-VEH",
    categoryName: "Vehicle / Transport",
    itemCode: "VEH-01",
    assetType: "Battery Electric Auto-Van / Easy Bike",
    defaultQty: "1 Unit",
    defaultVendorLocation: "Gazipur Auto Showroom",
    estimatedCostMin: 120000,
    estimatedCostMax: 165000,
    suggestedPurpose: "Vehicle",
    status: "Active",
    createdAt: "2026-01-15",
  },
  {
    id: "AST-VEH-02",
    categoryId: "CAT-VEH",
    categoryName: "Vehicle / Transport",
    itemCode: "VEH-02",
    assetType: "Manual Passenger Rickshaw",
    defaultQty: "1 Unit",
    defaultVendorLocation: "Sreepur Rickshaw Workshop",
    estimatedCostMin: 32000,
    estimatedCostMax: 45000,
    suggestedPurpose: "Vehicle",
    status: "Active",
    createdAt: "2026-01-15",
  },
  {
    id: "AST-VEH-03",
    categoryId: "CAT-VEH",
    categoryName: "Vehicle / Transport",
    itemCode: "VEH-03",
    assetType: "Flatbed Wooden Cargo Van (Pedaled)",
    defaultQty: "1 Unit",
    defaultVendorLocation: "Bhaluka Haat",
    estimatedCostMin: 28000,
    estimatedCostMax: 38000,
    suggestedPurpose: "Vehicle",
    status: "Active",
    createdAt: "2026-01-15",
  },
  {
    id: "AST-VEH-04",
    categoryId: "CAT-VEH",
    categoryName: "Vehicle / Transport",
    itemCode: "VEH-04",
    assetType: "Motorized 3-Wheeler Delivery Van",
    defaultQty: "1 Unit",
    defaultVendorLocation: "Mymensingh Motor Market",
    estimatedCostMin: 140000,
    estimatedCostMax: 185000,
    suggestedPurpose: "Vehicle",
    status: "Active",
    createdAt: "2026-01-15",
  },

  // 2. Farm Animal / Livestock
  {
    id: "AST-ANI-01",
    categoryId: "CAT-ANI",
    categoryName: "Farm Animal / Livestock",
    itemCode: "ANI-01",
    assetType: "Milch Dairy Cow / Heifer",
    defaultQty: "1 Cow",
    defaultVendorLocation: "Gafargaon Cattle Market",
    estimatedCostMin: 85000,
    estimatedCostMax: 125000,
    suggestedPurpose: "Farm Animal",
    status: "Active",
    createdAt: "2026-01-15",
  },
  {
    id: "AST-ANI-02",
    categoryId: "CAT-ANI",
    categoryName: "Farm Animal / Livestock",
    itemCode: "ANI-02",
    assetType: "Breeding Goats / Sheep Pair",
    defaultQty: "2 Goats",
    defaultVendorLocation: "Gafargaon Cattle Hat",
    estimatedCostMin: 22000,
    estimatedCostMax: 35000,
    suggestedPurpose: "Farm Animal",
    status: "Active",
    createdAt: "2026-01-15",
  },
  {
    id: "AST-ANI-03",
    categoryId: "CAT-ANI",
    categoryName: "Farm Animal / Livestock",
    itemCode: "ANI-03",
    assetType: "Beef Fattening Bull / Ox",
    defaultQty: "1 Bull",
    defaultVendorLocation: "Gafargaon Cattle Market",
    estimatedCostMin: 70000,
    estimatedCostMax: 95000,
    suggestedPurpose: "Farm Animal",
    status: "Active",
    createdAt: "2026-01-15",
  },
  {
    id: "AST-ANI-04",
    categoryId: "CAT-ANI",
    categoryName: "Farm Animal / Livestock",
    itemCode: "ANI-04",
    assetType: "Poultry Farming Starter Kit (Chicks & Feeder)",
    defaultQty: "25 Birds + Feeder Set",
    defaultVendorLocation: "Sreepur Poultry Feed Hub",
    estimatedCostMin: 15000,
    estimatedCostMax: 24000,
    suggestedPurpose: "Farm Animal",
    status: "Active",
    createdAt: "2026-01-15",
  },

  // 3. Business Setup / Livelihood
  {
    id: "AST-BIZ-01",
    categoryId: "CAT-BIZ",
    categoryName: "Business Setup / Livelihood",
    itemCode: "BIZ-01",
    assetType: "Tea Stall & Snack Kiosk Setup",
    defaultQty: "1 Complete Kiosk Set",
    defaultVendorLocation: "Gazipur Chowrasta Market",
    estimatedCostMin: 25000,
    estimatedCostMax: 40000,
    suggestedPurpose: "Business Setup",
    status: "Active",
    createdAt: "2026-01-15",
  },
  {
    id: "AST-BIZ-02",
    categoryId: "CAT-BIZ",
    categoryName: "Business Setup / Livelihood",
    itemCode: "BIZ-02",
    assetType: "Grocery Store Wholesale Initial Inventory",
    defaultQty: "1 Wholesale Inventory Lot",
    defaultVendorLocation: "Moulvibazar Wholesale Hub, Dhaka",
    estimatedCostMin: 45000,
    estimatedCostMax: 70000,
    suggestedPurpose: "Business Setup",
    status: "Active",
    createdAt: "2026-01-15",
  },
  {
    id: "AST-BIZ-03",
    categoryId: "CAT-BIZ",
    categoryName: "Business Setup / Livelihood",
    itemCode: "BIZ-03",
    assetType: "Mobile Vegetable & Fruit Pushcart",
    defaultQty: "1 Pushcart + Weighing Scale",
    defaultVendorLocation: "Bhaluka Bazar",
    estimatedCostMin: 18000,
    estimatedCostMax: 28000,
    suggestedPurpose: "Business Setup",
    status: "Active",
    createdAt: "2026-01-15",
  },
  {
    id: "AST-BIZ-04",
    categoryId: "CAT-BIZ",
    categoryName: "Business Setup / Livelihood",
    itemCode: "BIZ-04",
    assetType: "Heavy-Duty Sewing Machine & Tailoring Kit",
    defaultQty: "1 Machine Set + Motor",
    defaultVendorLocation: "Mirpur Sewing Machinery Showroom",
    estimatedCostMin: 16000,
    estimatedCostMax: 25000,
    suggestedPurpose: "Business Setup",
    status: "Active",
    createdAt: "2026-01-15",
  },
  {
    id: "AST-BIZ-05",
    categoryId: "CAT-BIZ",
    categoryName: "Business Setup / Livelihood",
    itemCode: "BIZ-05",
    assetType: "Carpentry & Electrical Hand Tools Workshop Kit",
    defaultQty: "1 Professional Toolkit",
    defaultVendorLocation: "Nawabpur Tools Hardware Market",
    estimatedCostMin: 20000,
    estimatedCostMax: 35000,
    suggestedPurpose: "Business Setup",
    status: "Active",
    createdAt: "2026-01-15",
  },

  // 4. Medical & Assistive Equipment
  {
    id: "AST-MED-01",
    categoryId: "CAT-MED",
    categoryName: "Medical & Assistive Equipment",
    itemCode: "MED-01",
    assetType: "Chemotherapy & Oncology Specialized Medicine Package",
    defaultQty: "3 Cycles + Specialized Drugs",
    defaultVendorLocation: "Labaid Cancer Hospital Specialized Pharmacy",
    estimatedCostMin: 50000,
    estimatedCostMax: 90000,
    suggestedPurpose: "Medical Treatment",
    status: "Active",
    createdAt: "2026-01-15",
  },
  {
    id: "AST-MED-02",
    categoryId: "CAT-MED",
    categoryName: "Medical & Assistive Equipment",
    itemCode: "MED-02",
    assetType: "Foldable Wheelchair & Orthopedic Assistive Device",
    defaultQty: "1 Unit",
    defaultVendorLocation: "BMA Bhaban Surgical Market, Dhaka",
    estimatedCostMin: 12000,
    estimatedCostMax: 22000,
    suggestedPurpose: "Medical Treatment",
    status: "Active",
    createdAt: "2026-01-15",
  },
  {
    id: "AST-MED-03",
    categoryId: "CAT-MED",
    categoryName: "Medical & Assistive Equipment",
    itemCode: "MED-03",
    assetType: "Medical Oxygen Concentrator / Cylinder Setup",
    defaultQty: "1 Unit (5L/10L)",
    defaultVendorLocation: "Dhanmondi Medical Supply",
    estimatedCostMin: 40000,
    estimatedCostMax: 65000,
    suggestedPurpose: "Medical Treatment",
    status: "Active",
    createdAt: "2026-01-15",
  },
  {
    id: "AST-MED-04",
    categoryId: "CAT-MED",
    categoryName: "Medical & Assistive Equipment",
    itemCode: "MED-04",
    assetType: "Surgical Implant & Post-Operative Recovery Equipment",
    defaultQty: "1 Implant Package",
    defaultVendorLocation: "National Heart Foundation Pharmacy",
    estimatedCostMin: 45000,
    estimatedCostMax: 80000,
    suggestedPurpose: "Medical Treatment",
    status: "Active",
    createdAt: "2026-01-15",
  },

  // 5. Shelter & Community Equipment
  {
    id: "AST-REL-01",
    categoryId: "CAT-REL",
    categoryName: "Shelter & Community Equipment",
    itemCode: "REL-01",
    assetType: "Corrugated Roofing Tin & Reconstruction Timber Package",
    defaultQty: "1 Reconstruction Bundle",
    defaultVendorLocation: "Bhaluka Hardware & Timber Sawmill",
    estimatedCostMin: 35000,
    estimatedCostMax: 55000,
    suggestedPurpose: "Disaster Relief",
    status: "Active",
    createdAt: "2026-01-15",
  },
];

export const ZAKAT_STORAGE_CATEGORIES_KEY = "zakat_asset_master_categories";
export const ZAKAT_STORAGE_ITEMS_KEY = "zakat_asset_master_items";

export function getZakatMasterCategories(): ZakatAssetCategory[] {
  if (typeof window === "undefined") return INITIAL_ZAKAT_CATEGORIES;
  const raw = localStorage.getItem(ZAKAT_STORAGE_CATEGORIES_KEY);
  if (!raw) {
    localStorage.setItem(ZAKAT_STORAGE_CATEGORIES_KEY, JSON.stringify(INITIAL_ZAKAT_CATEGORIES));
    return INITIAL_ZAKAT_CATEGORIES;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_ZAKAT_CATEGORIES;
  }
}

export function getZakatMasterItems(): ZakatAssetItem[] {
  if (typeof window === "undefined") return INITIAL_ZAKAT_ITEMS;
  const raw = localStorage.getItem(ZAKAT_STORAGE_ITEMS_KEY);
  if (!raw) {
    localStorage.setItem(ZAKAT_STORAGE_ITEMS_KEY, JSON.stringify(INITIAL_ZAKAT_ITEMS));
    return INITIAL_ZAKAT_ITEMS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_ZAKAT_ITEMS;
  }
}

export function saveZakatMasterCategories(cats: ZakatAssetCategory[]) {
  localStorage.setItem(ZAKAT_STORAGE_CATEGORIES_KEY, JSON.stringify(cats));
}

export function saveZakatMasterItems(items: ZakatAssetItem[]) {
  localStorage.setItem(ZAKAT_STORAGE_ITEMS_KEY, JSON.stringify(items));
}

function ZakatAssetMasterPage() {
  const [activeTab, setActiveTab] = useState<"Category" | "Item">("Category");
  const [categories, setCategories] = useState<ZakatAssetCategory[]>([]);
  const [items, setItems] = useState<ZakatAssetItem[]>([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All");

  // Category Modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ZakatAssetCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    code: "",
    name: "",
    description: "",
    suggestedPurpose: "Business Setup",
    status: "Active" as "Active" | "Inactive",
  });

  // Item Modal
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ZakatAssetItem | null>(null);
  const [itemForm, setItemForm] = useState({
    categoryId: "",
    itemCode: "",
    assetType: "",
    defaultQty: "",
    defaultVendorLocation: "",
    estimatedCostMin: "",
    estimatedCostMax: "",
    suggestedPurpose: "Business Setup",
    status: "Active" as "Active" | "Inactive",
    description: "",
  });

  // Load data
  useEffect(() => {
    setCategories(getZakatMasterCategories());
    setItems(getZakatMasterItems());
  }, []);

  // Filtered Categories
  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.suggestedPurpose.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    });
  }, [categories, searchQuery]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedCategoryFilter !== "All" && item.categoryId !== selectedCategoryFilter) {
        return false;
      }
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        item.assetType.toLowerCase().includes(q) ||
        item.itemCode.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q) ||
        item.defaultQty.toLowerCase().includes(q) ||
        item.defaultVendorLocation.toLowerCase().includes(q) ||
        item.suggestedPurpose.toLowerCase().includes(q)
      );
    });
  }, [items, selectedCategoryFilter, searchQuery]);

  // Open Category Create
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      code: `CAT-${Date.now().toString().slice(-3)}`,
      name: "",
      description: "",
      suggestedPurpose: "Business Setup",
      status: "Active",
    });
    setShowCategoryModal(true);
  };

  // Open Category Edit
  const handleOpenEditCategory = (cat: ZakatAssetCategory) => {
    setEditingCategory(cat);
    setCategoryForm({
      code: cat.code,
      name: cat.name,
      description: cat.description,
      suggestedPurpose: cat.suggestedPurpose,
      status: cat.status,
    });
    setShowCategoryModal(true);
  };

  // Save Category
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    if (editingCategory) {
      const updated = categories.map((c) => {
        if (c.id === editingCategory.id) {
          return {
            ...c,
            code: categoryForm.code.trim().toUpperCase(),
            name: categoryForm.name.trim(),
            description: categoryForm.description.trim(),
            suggestedPurpose: categoryForm.suggestedPurpose,
            status: categoryForm.status,
          };
        }
        return c;
      });
      // also update categoryName on items
      const updatedItems = items.map((it) => {
        if (it.categoryId === editingCategory.id) {
          return { ...it, categoryName: categoryForm.name.trim() };
        }
        return it;
      });
      setCategories(updated);
      setItems(updatedItems);
      saveZakatMasterCategories(updated);
      saveZakatMasterItems(updatedItems);
      toast.success(`Category "${categoryForm.name}" updated successfully!`);
    } else {
      const newCat: ZakatAssetCategory = {
        id: `CAT-${Date.now()}`,
        code: categoryForm.code.trim().toUpperCase() || `CAT-${categories.length + 1}`,
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim(),
        suggestedPurpose: categoryForm.suggestedPurpose,
        status: categoryForm.status,
        createdAt: new Date().toISOString().split("T")[0],
      };
      const updated = [...categories, newCat];
      setCategories(updated);
      saveZakatMasterCategories(updated);
      toast.success(`Category "${newCat.name}" added successfully!`);
    }

    setShowCategoryModal(false);
  };

  // Delete Category
  const handleDeleteCategory = (catId: string, catName: string) => {
    const itemsCount = items.filter((it) => it.categoryId === catId).length;
    if (itemsCount > 0) {
      toast.error(`Cannot delete "${catName}" because it has ${itemsCount} asset items linked to it.`);
      return;
    }
    if (confirm(`Are you sure you want to delete category "${catName}"?`)) {
      const updated = categories.filter((c) => c.id !== catId);
      setCategories(updated);
      saveZakatMasterCategories(updated);
      toast.success(`Category "${catName}" deleted.`);
    }
  };

  // Open Item Create
  const handleOpenAddItem = () => {
    if (categories.length === 0) {
      toast.error("Please create at least one category first.");
      return;
    }
    setEditingItem(null);
    const defaultCat = categories[0];
    setItemForm({
      categoryId: defaultCat.id,
      itemCode: `AST-${Date.now().toString().slice(-4)}`,
      assetType: "",
      defaultQty: "1 Unit",
      defaultVendorLocation: "",
      estimatedCostMin: "",
      estimatedCostMax: "",
      suggestedPurpose: defaultCat.suggestedPurpose || "Business Setup",
      status: "Active",
      description: "",
    });
    setShowItemModal(true);
  };

  // Open Item Edit
  const handleOpenEditItem = (item: ZakatAssetItem) => {
    setEditingItem(item);
    setItemForm({
      categoryId: item.categoryId,
      itemCode: item.itemCode,
      assetType: item.assetType,
      defaultQty: item.defaultQty,
      defaultVendorLocation: item.defaultVendorLocation,
      estimatedCostMin: item.estimatedCostMin ? String(item.estimatedCostMin) : "",
      estimatedCostMax: item.estimatedCostMax ? String(item.estimatedCostMax) : "",
      suggestedPurpose: item.suggestedPurpose,
      status: item.status,
      description: item.description || "",
    });
    setShowItemModal(true);
  };

  // Save Item
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.assetType.trim()) {
      toast.error("Please enter the Asset / Item name.");
      return;
    }
    const cat = categories.find((c) => c.id === itemForm.categoryId);
    const catName = cat ? cat.name : "General Asset";

    if (editingItem) {
      const updated = items.map((it) => {
        if (it.id === editingItem.id) {
          return {
            ...it,
            categoryId: itemForm.categoryId,
            categoryName: catName,
            itemCode: itemForm.itemCode.trim().toUpperCase(),
            assetType: itemForm.assetType.trim(),
            defaultQty: itemForm.defaultQty.trim() || "1 Unit",
            defaultVendorLocation: itemForm.defaultVendorLocation.trim(),
            estimatedCostMin: itemForm.estimatedCostMin ? Number(itemForm.estimatedCostMin) : undefined,
            estimatedCostMax: itemForm.estimatedCostMax ? Number(itemForm.estimatedCostMax) : undefined,
            suggestedPurpose: itemForm.suggestedPurpose,
            status: itemForm.status,
            description: itemForm.description.trim(),
          };
        }
        return it;
      });
      setItems(updated);
      saveZakatMasterItems(updated);
      toast.success(`Asset item "${itemForm.assetType}" updated!`);
    } else {
      const newItem: ZakatAssetItem = {
        id: `AST-${Date.now()}`,
        categoryId: itemForm.categoryId,
        categoryName: catName,
        itemCode: itemForm.itemCode.trim().toUpperCase() || `AST-${items.length + 1}`,
        assetType: itemForm.assetType.trim(),
        defaultQty: itemForm.defaultQty.trim() || "1 Unit",
        defaultVendorLocation: itemForm.defaultVendorLocation.trim(),
        estimatedCostMin: itemForm.estimatedCostMin ? Number(itemForm.estimatedCostMin) : undefined,
        estimatedCostMax: itemForm.estimatedCostMax ? Number(itemForm.estimatedCostMax) : undefined,
        suggestedPurpose: itemForm.suggestedPurpose,
        status: itemForm.status,
        description: itemForm.description.trim(),
        createdAt: new Date().toISOString().split("T")[0],
      };
      const updated = [...items, newItem];
      setItems(updated);
      saveZakatMasterItems(updated);
      toast.success(`Asset item "${newItem.assetType}" added to catalog!`);
    }

    setShowItemModal(false);
  };

  // Delete Item
  const handleDeleteItem = (itemId: string, itemName: string) => {
    if (confirm(`Are you sure you want to delete asset "${itemName}" from master data?`)) {
      const updated = items.filter((it) => it.id !== itemId);
      setItems(updated);
      saveZakatMasterItems(updated);
      toast.success(`Asset item "${itemName}" deleted.`);
    }
  };

  // Reset to default master catalog
  const handleResetDefaults = () => {
    if (confirm("Reset master data categories and items to default Pakiza catalog?")) {
      setCategories(INITIAL_ZAKAT_CATEGORIES);
      setItems(INITIAL_ZAKAT_ITEMS);
      saveZakatMasterCategories(INITIAL_ZAKAT_CATEGORIES);
      saveZakatMasterItems(INITIAL_ZAKAT_ITEMS);
      toast.success("Master catalog reset to defaults.");
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Topbar />

        <main className="p-4 sm:p-5 lg:p-6 w-full space-y-5">
          {/* Breadcrumb & Navigation Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5 font-medium">
                <Link to="/" className="hover:text-primary transition">Home</Link>
                <span>/</span>
                <span>Welfare & Support</span>
                <span>/</span>
                <Link to="/zakat-list" className="hover:text-primary transition">Zakat Management</Link>
                <span>/</span>
                <span className="text-foreground font-semibold">Asset Master Data</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl border border-emerald-500/20">
                  <Package className="size-5" />
                </div>
                <span>Zakat Asset Master Data</span>
              </h1>
              <p className="text-xs text-muted-foreground mt-1 font-normal">
                Configure physical asset categories and item catalog used for Zakat procurement, auto-van kits, livestock, and livelihood disbursements.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                to="/zakat-list"
                className="h-9 px-3.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-xs font-medium flex items-center gap-1.5 transition"
              >
                <HeartHandshake className="size-4 text-emerald-600" />
                <span>Zakat Cases List</span>
              </Link>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="h-9 px-3 rounded-lg border border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                title="Restore default catalog data"
              >
                <RefreshCw className="size-3.5" />
                <span className="hidden sm:inline">Reset Defaults</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-card rounded-xl border border-border p-3.5 shadow-2xs">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                Total Categories
              </div>
              <div className="text-xl font-bold text-foreground mt-0.5">
                {categories.length}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
                <Layers className="size-3" />
                <span>{categories.filter((c) => c.status === "Active").length} Active</span>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-3.5 shadow-2xs">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                Total Catalog Items
              </div>
              <div className="text-xl font-bold text-foreground mt-0.5">
                {items.length}
              </div>
              <div className="text-[11px] text-indigo-600 font-medium mt-0.5 flex items-center gap-1">
                <Tag className="size-3" />
                <span>Master items linked</span>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-3.5 shadow-2xs">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                Vehicle & Livestock
              </div>
              <div className="text-xl font-bold text-foreground mt-0.5">
                {items.filter((it) => it.categoryId === "CAT-VEH" || it.categoryId === "CAT-ANI").length}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                High-impact livelihood
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-3.5 shadow-2xs">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                Business & Medical
              </div>
              <div className="text-xl font-bold text-foreground mt-0.5">
                {items.filter((it) => it.categoryId === "CAT-BIZ" || it.categoryId === "CAT-MED").length}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                Micro-enterprise & Health
              </div>
            </div>
          </div>

          {/* Master Tabs: Category vs Item */}
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-xs">
            <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20">
              {/* Tab Switcher */}
              <div className="flex items-center gap-1 bg-muted p-1 rounded-lg border border-border/60">
                <button
                  type="button"
                  onClick={() => setActiveTab("Category")}
                  className={`h-8 px-4 rounded-md text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                    activeTab === "Category"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Layers className="size-3.5" />
                  <span>Category ({categories.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("Item")}
                  className={`h-8 px-4 rounded-md text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                    activeTab === "Item"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Package className="size-3.5" />
                  <span>Item Catalog ({items.length})</span>
                </button>
              </div>

              {/* Actions & Filters */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Search */}
                <div className="relative">
                  <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${activeTab.toLowerCase()}...`}
                    className="h-8.5 pl-8 pr-3 w-48 sm:w-60 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>

                {/* Category filter dropdown on Item tab */}
                {activeTab === "Item" && (
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="h-8.5 px-2.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:border-primary"
                  >
                    <option value="All">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}

                {/* Add Button */}
                {activeTab === "Category" ? (
                  <button
                    type="button"
                    onClick={handleOpenAddCategory}
                    className="h-8.5 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    <span>New Category</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleOpenAddItem}
                    className="h-8.5 px-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    <span>New Asset Item</span>
                  </button>
                )}
              </div>
            </div>

            {/* TAB 1: CATEGORY VIEW */}
            {activeTab === "Category" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase border-b border-border">
                    <tr>
                      <th className="px-4 py-3">Category Code</th>
                      <th className="px-4 py-3">Category Name</th>
                      <th className="px-4 py-3">Suggested Purpose</th>
                      <th className="px-4 py-3">Linked Items</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 bg-card font-normal">
                    {filteredCategories.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground text-xs">
                          No categories found matching your query.
                        </td>
                      </tr>
                    ) : (
                      filteredCategories.map((cat) => {
                        const linkedItemsCount = items.filter((it) => it.categoryId === cat.id).length;
                        return (
                          <tr key={cat.id} className="hover:bg-muted/20 transition">
                            <td className="px-4 py-3 font-mono font-medium text-primary">
                              {cat.code}
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-semibold text-foreground text-xs">{cat.name}</div>
                              <div className="text-[10px] text-muted-foreground">ID: {cat.id}</div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[11px] font-medium">
                                {cat.suggestedPurpose}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-medium text-foreground">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCategoryFilter(cat.id);
                                  setActiveTab("Item");
                                }}
                                className="inline-flex items-center gap-1 text-primary hover:underline cursor-pointer"
                              >
                                <span>{linkedItemsCount} items</span>
                                <ArrowRight className="size-3" />
                              </button>
                            </td>
                            <td className="px-4 py-3 max-w-xs truncate text-muted-foreground" title={cat.description}>
                              {cat.description || "—"}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  cat.status === "Active"
                                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                                    : "bg-muted text-muted-foreground border border-border"
                                }`}
                              >
                                {cat.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="inline-flex items-center gap-1 justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditCategory(cat)}
                                  className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
                                  title="Edit Category"
                                >
                                  <Edit2 className="size-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCategory(cat.id, cat.name)}
                                  className="p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-600 transition cursor-pointer"
                                  title="Delete Category"
                                >
                                  <Trash2 className="size-3.5" />
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
            )}

            {/* TAB 2: ITEM CATALOG VIEW */}
            {activeTab === "Item" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase border-b border-border">
                    <tr>
                      <th className="px-4 py-3">Item Code</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Asset / Item Specification</th>
                      <th className="px-4 py-3">Default Qty / Unit</th>
                      <th className="px-4 py-3">Vendor / Market Hub</th>
                      <th className="px-4 py-3 text-right">Est. Budget Range</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 bg-card font-normal">
                    {filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground text-xs">
                          No asset items found. Try another search filter or click "+ New Asset Item".
                        </td>
                      </tr>
                    ) : (
                      filteredItems.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/20 transition">
                          <td className="px-4 py-3 font-mono font-medium text-indigo-600 dark:text-indigo-400">
                            {item.itemCode || item.id}
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-md bg-muted text-foreground border border-border text-[11px] font-medium">
                              {item.categoryName}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-foreground text-xs">
                              {item.assetType}
                            </div>
                            <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                              <span>Purpose: {item.suggestedPurpose}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-foreground font-medium">
                            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 text-[11px]">
                              {item.defaultQty}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground max-w-xs truncate" title={item.defaultVendorLocation}>
                            {item.defaultVendorLocation || "Local market"}
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-foreground">
                            {item.estimatedCostMin && item.estimatedCostMax ? (
                              <span>৳{item.estimatedCostMin.toLocaleString()} – ৳{item.estimatedCostMax.toLocaleString()}</span>
                            ) : (
                              <span className="text-muted-foreground italic">Market rate</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                item.status === "Active"
                                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                                  : "bg-muted text-muted-foreground border border-border"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="inline-flex items-center gap-1 justify-end">
                              <button
                                type="button"
                                onClick={() => handleOpenEditItem(item)}
                                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
                                title="Edit Item"
                              >
                                <Edit2 className="size-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteItem(item.id, item.assetType)}
                                className="p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-600 transition cursor-pointer"
                                title="Delete Item"
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
          </div>
        </main>

        {/* ─── MODAL 1: CREATE / EDIT CATEGORY ─────────────────────────── */}
        {showCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4">
            <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 sm:p-5 border-b border-border bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
                    <Layers className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {editingCategory ? "Edit Asset Category" : "Add New Asset Category"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Define asset grouping used in Zakat requisition & procurement.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="size-8 rounded-lg text-muted-foreground hover:bg-muted flex items-center justify-center cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Category Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={categoryForm.code}
                      onChange={(e) => setCategoryForm({ ...categoryForm, code: e.target.value })}
                      placeholder="e.g. VEH"
                      className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs font-mono uppercase text-foreground outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Status
                    </label>
                    <select
                      value={categoryForm.status}
                      onChange={(e) => setCategoryForm({ ...categoryForm, status: e.target.value as any })}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:border-primary"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="e.g. Vehicle / Transport"
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Suggested Purpose Category
                  </label>
                  <select
                    value={categoryForm.suggestedPurpose}
                    onChange={(e) => setCategoryForm({ ...categoryForm, suggestedPurpose: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:border-primary"
                  >
                    <option value="Vehicle">Vehicle</option>
                    <option value="Farm Animal">Farm Animal</option>
                    <option value="Business Setup">Business Setup</option>
                    <option value="Medical Treatment">Medical Treatment</option>
                    <option value="Disaster Relief">Disaster Relief</option>
                    <option value="General Grant">General Grant</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Description / Scope
                  </label>
                  <textarea
                    rows={2}
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    placeholder="Brief description of asset types included under this group..."
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(false)}
                    className="h-8.5 px-3.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-xs font-medium transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-8.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Check className="size-3.5 stroke-[2]" />
                    <span>{editingCategory ? "Update Category" : "Save Category"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL 2: CREATE / EDIT ASSET ITEM ─────────────────────────── */}
        {showItemModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4">
            <div className="bg-card w-full max-w-xl rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 sm:p-5 border-b border-border bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-lg">
                    <Package className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {editingItem ? "Edit Asset Item Catalog" : "Add Asset Item to Master Catalog"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      This will be available in the Zakat Case "Asset Type (Master Data Catalog)" dropdown.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="size-8 rounded-lg text-muted-foreground hover:bg-muted flex items-center justify-center cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Parent Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={itemForm.categoryId}
                      onChange={(e) => {
                        const selCat = categories.find((c) => c.id === e.target.value);
                        setItemForm({
                          ...itemForm,
                          categoryId: e.target.value,
                          suggestedPurpose: selCat ? selCat.suggestedPurpose : itemForm.suggestedPurpose,
                        });
                      }}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:border-primary"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Item Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={itemForm.itemCode}
                      onChange={(e) => setItemForm({ ...itemForm, itemCode: e.target.value })}
                      placeholder="e.g. VEH-01"
                      className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs font-mono uppercase text-foreground outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Asset / Item Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={itemForm.assetType}
                    onChange={(e) => setItemForm({ ...itemForm, assetType: e.target.value })}
                    placeholder="e.g. Battery Electric Auto-Van / Easy Bike"
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Default Quantity / Unit <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={itemForm.defaultQty}
                      onChange={(e) => setItemForm({ ...itemForm, defaultQty: e.target.value })}
                      placeholder="e.g. 1 Unit / 2 Goats"
                      className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Default Vendor / Market Hub
                    </label>
                    <input
                      type="text"
                      value={itemForm.defaultVendorLocation}
                      onChange={(e) => setItemForm({ ...itemForm, defaultVendorLocation: e.target.value })}
                      placeholder="e.g. Gazipur Auto Showroom"
                      className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Est. Min Cost (৳)
                    </label>
                    <input
                      type="number"
                      value={itemForm.estimatedCostMin}
                      onChange={(e) => setItemForm({ ...itemForm, estimatedCostMin: e.target.value })}
                      placeholder="e.g. 120000"
                      className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Est. Max Cost (৳)
                    </label>
                    <input
                      type="number"
                      value={itemForm.estimatedCostMax}
                      onChange={(e) => setItemForm({ ...itemForm, estimatedCostMax: e.target.value })}
                      placeholder="e.g. 165000"
                      className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Status
                    </label>
                    <select
                      value={itemForm.status}
                      onChange={(e) => setItemForm({ ...itemForm, status: e.target.value as any })}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:border-primary"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Suggested Purpose Category
                  </label>
                  <select
                    value={itemForm.suggestedPurpose}
                    onChange={(e) => setItemForm({ ...itemForm, suggestedPurpose: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:border-primary"
                  >
                    <option value="Vehicle">Vehicle</option>
                    <option value="Farm Animal">Farm Animal</option>
                    <option value="Business Setup">Business Setup</option>
                    <option value="Medical Treatment">Medical Treatment</option>
                    <option value="Disaster Relief">Disaster Relief</option>
                    <option value="General Grant">General Grant</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowItemModal(false)}
                    className="h-8.5 px-3.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-xs font-medium transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-8.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Check className="size-3.5 stroke-[2]" />
                    <span>{editingItem ? "Update Asset Item" : "Save Asset Item"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
