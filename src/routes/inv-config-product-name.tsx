import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import { 
  Package, 
  Search, 
  Plus, 
  Edit3, 
  FileSpreadsheet, 
  Printer, 
  FileText,
  X,
  ChevronDown
} from "lucide-react";

export const Route = createFileRoute("/inv-config-product-name")({
  component: ManageProductNamePage,
});

// --- Types & Mock Data ---

type Product = {
  id: string;
  subStoreName: string;
  code: string;
  name: string;
  desc?: string;
  basicName: string;
  unitName: string;
  rate: number;
  factor: number;
};

const SUB_STORES = [
  "Kitchen Items & Equipment_FixedAssets",
  "IT Equipments_FixedAssets",
  "Office Furniture_FixedAssets",
  "Stationery Items",
];

const initialProducts: Product[] = [
  { id: "1", subStoreName: "Kitchen Items & Equipment_FixedAssets", code: "00000", name: "Coffee Machine", basicName: "", unitName: "PCS", rate: 0, factor: 1 },
  { id: "2", subStoreName: "Kitchen Items & Equipment_FixedAssets", code: "00000", name: "Electric Katley", basicName: "", unitName: "PCS", rate: 0, factor: 1 },
  { id: "3", subStoreName: "Kitchen Items & Equipment_FixedAssets", code: "00000", name: "Refrigerator", basicName: "", unitName: "PCS", rate: 0, factor: 1 },
  { id: "4", subStoreName: "Kitchen Items & Equipment_FixedAssets", code: "00000", name: "Refrigerator Deep", basicName: "", unitName: "PCS", rate: 0, factor: 1 },
  { id: "5", subStoreName: "Kitchen Items & Equipment_FixedAssets", code: "00000", name: "Water Filter", basicName: "", unitName: "PCS", rate: 0, factor: 1 },
  { id: "6", subStoreName: "Kitchen Items & Equipment_FixedAssets", code: "00000", name: "Woven", basicName: "", unitName: "PCS", rate: 0, factor: 1 },
];

function ManageProductNamePage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStoreFilter, setSelectedStoreFilter] = useState(SUB_STORES[0]);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({});

  const filteredData = useMemo(() => {
    return products.filter((item) => {
      const matchesStore = selectedStoreFilter ? item.subStoreName === selectedStoreFilter : true;
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStore && matchesSearch;
    });
  }, [products, searchQuery, selectedStoreFilter]);

  const existingProductsInFormStore = useMemo(() => {
    const storeToMatch = formData.subStoreName || SUB_STORES[0];
    return products.filter(p => p.subStoreName === storeToMatch);
  }, [products, formData.subStoreName]);

  const openCreateModal = () => {
    setFormData({ subStoreName: selectedStoreFilter, unitName: "PCS", factor: 1 });
    setEditItem(null);
    setIsFormOpen(true);
  };

  const openEditModal = (item: Product) => {
    setFormData({ ...item });
    setEditItem(item);
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
    setEditItem(null);
    setFormData({});
  };

  const handleSaveForm = () => {
    if (editItem) {
      setProducts(prev => prev.map(p => p.id === editItem.id ? { ...p, ...formData } as Product : p));
    } else {
      const newId = (Math.max(0, ...products.map(p => parseInt(p.id))) + 1).toString();
      const newProduct: Product = {
        id: newId,
        subStoreName: formData.subStoreName || SUB_STORES[0],
        code: formData.code || "00000",
        name: formData.name || "",
        desc: formData.desc || "",
        basicName: formData.basicName || "",
        unitName: formData.unitName || "PCS",
        rate: formData.rate || 0,
        factor: formData.factor || 1,
      };
      setProducts(prev => [...prev, newProduct]);
    }
    closeFormModal();
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <InventorySidebar />
      <main className="flex-1 min-w-0 flex flex-col transition-all duration-300">
        <InventoryTopbar />
        
        <div className="p-4 sm:p-6 lg:p-7 space-y-6 w-full max-w-[1550px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
                <Package className="size-6 text-primary" />
                Product Name Configuration
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage specific products within your sub-stores.
              </p>
            </div>
          </div>

          {/* Data Table Area */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
            
            {/* Toolbar (Store Filter & Actions) */}
            <div className="p-4 border-b border-border/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/10">
              
              {/* Left Side: Store Filter */}
              <div className="flex flex-col space-y-1 w-full max-w-sm">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sub Store Name</label>
                <div className="relative">
                  <select 
                    className="w-full pl-3 pr-8 py-2 bg-background border border-border rounded-lg text-sm font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={selectedStoreFilter}
                    onChange={(e) => setSelectedStoreFilter(e.target.value)}
                  >
                    {SUB_STORES.map(store => (
                      <option key={store} value={store}>{store}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Right Side: Buttons & Search */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
                  <button className="h-9 px-3 bg-background border border-border hover:bg-muted text-foreground font-semibold text-[11px] rounded-lg transition-colors flex items-center gap-1.5 shrink-0">
                    <FileSpreadsheet className="size-3.5 text-emerald-600" /> EXCEL
                  </button>
                  <button className="h-9 px-3 bg-background border border-border hover:bg-muted text-foreground font-semibold text-[11px] rounded-lg transition-colors flex items-center gap-1.5 shrink-0">
                    <Printer className="size-3.5 text-blue-600" /> PRINT
                  </button>
                  <button className="h-9 px-3 bg-background border border-border hover:bg-muted text-foreground font-semibold text-[11px] rounded-lg transition-colors flex items-center gap-1.5 shrink-0">
                    <FileText className="size-3.5 text-red-600" /> PDF
                  </button>
                  
                  <div className="w-px h-6 bg-border mx-1 hidden sm:block"></div>
                  
                  <button 
                    onClick={openCreateModal}
                    className="h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-[11px] rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 shrink-0"
                  >
                    <Plus className="size-4" />
                    Add New
                  </button>
                </div>

                <div className="relative w-full sm:w-64 shrink-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-muted/40 border-b border-border/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="px-4 py-2.5 font-semibold w-20 text-center">Actions</th>
                    <th className="px-4 py-2.5 font-semibold text-center w-16">SL</th>
                    <th className="px-4 py-2.5 font-semibold">Sub Store Name</th>
                    <th className="px-4 py-2.5 font-semibold w-32">Product Code</th>
                    <th className="px-4 py-2.5 font-semibold">Product Name</th>
                    <th className="px-4 py-2.5 font-semibold">Basic Name</th>
                    <th className="px-4 py-2.5 font-semibold w-24">Unit Name</th>
                    <th className="px-4 py-2.5 font-semibold w-24 text-right">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {filteredData.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50 border-b border-slate-100 transition duration-150">
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => openEditModal(item)}
                          className="size-[26px] rounded-md bg-white border border-slate-200 text-amber-500 hover:bg-amber-50 inline-flex items-center justify-center transition-colors shadow-sm"
                          title="Edit"
                        >
                          <Edit3 className="size-3" />
                        </button>
                      </td>
                      <td className="px-4 py-2 text-center font-mono text-muted-foreground font-semibold text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-2 font-medium text-foreground text-[11px] whitespace-nowrap">
                        {item.subStoreName}
                      </td>
                      <td className="px-4 py-2 font-mono font-semibold text-muted-foreground text-[11px]">
                        {item.code}
                      </td>
                      <td className="px-4 py-2 font-medium text-foreground text-[11px]">
                        {item.name}
                      </td>
                      <td className="px-4 py-2 font-medium text-muted-foreground text-[11px]">
                        {item.basicName}
                      </td>
                      <td className="px-4 py-2 font-medium text-muted-foreground text-[11px]">
                        {item.unitName}
                      </td>
                      <td className="px-4 py-2 font-mono font-semibold text-muted-foreground text-right text-[11px]">
                        {item.rate}
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-muted-foreground text-sm font-semibold">
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-border/50 bg-muted/10 text-[11px] text-muted-foreground font-semibold flex justify-between items-center">
              <span>Showing 1 to {filteredData.length} of {products.length} entries</span>
            </div>
          </div>
        </div>
      </main>

      {/* CREATE / EDIT MODAL (Dual Column Layout) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-4xl rounded-2xl shadow-xl border border-border/50 overflow-hidden flex flex-col h-[90vh] md:h-auto md:max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-border/40 bg-muted/20 shrink-0">
              <h2 className="text-lg font-black text-foreground">
                {editItem ? "Update Product Name" : "Create Product Name"}
              </h2>
              <button onClick={closeFormModal} className="text-muted-foreground hover:bg-muted p-1.5 rounded-full transition">
                <X className="size-4" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto flex flex-col md:flex-row p-6 gap-8">
              
              {/* Left Column: Form Fields */}
              <div className="flex-1 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Sub Store Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      className="w-full pl-3 pr-8 py-2.5 bg-background border border-border rounded-lg text-sm font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={formData.subStoreName || ""}
                      onChange={e => setFormData({...formData, subStoreName: e.target.value})}
                    >
                      {SUB_STORES.map(store => (
                        <option key={store} value={store}>{store}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Product Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold"
                    value={formData.name || ""}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Product Description</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={formData.desc || ""}
                    onChange={e => setFormData({...formData, desc: e.target.value})}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Unit Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      className="w-full pl-3 pr-8 py-2.5 bg-background border border-border rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={formData.unitName || ""}
                      onChange={e => setFormData({...formData, unitName: e.target.value})}
                    >
                      <option value="PCS">PCS</option>
                      <option value="KG">KG</option>
                      <option value="LTR">LTR</option>
                      <option value="BOX">BOX</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Factor</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={formData.factor || ""}
                    onChange={e => setFormData({...formData, factor: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              {/* Right Column: Existing Products Context */}
              <div className="w-full md:w-80 shrink-0 flex flex-col bg-muted/10 border border-border/50 rounded-xl overflow-hidden">
                <div className="bg-muted/40 p-3 border-b border-border/50 flex items-center justify-between">
                  <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Existing Products
                  </h3>
                  <span className="text-[10px] font-bold bg-background border border-border/50 px-2 py-0.5 rounded-full">
                    {existingProductsInFormStore.length}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                  <ul className="space-y-1">
                    {existingProductsInFormStore.map(p => (
                      <li key={p.id} className="text-sm font-semibold text-foreground px-3 py-2 hover:bg-background rounded-lg border border-transparent hover:border-border/50 transition-colors">
                        {p.name}
                      </li>
                    ))}
                    {existingProductsInFormStore.length === 0 && (
                      <div className="text-center text-[11px] text-muted-foreground py-10 font-medium">
                        No existing products in this store.
                      </div>
                    )}
                  </ul>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-border/40 bg-muted/10 flex justify-between shrink-0">
              <button 
                onClick={closeFormModal}
                className="px-6 py-2.5 text-sm font-bold text-muted-foreground bg-background border border-border hover:bg-muted rounded-lg transition shadow-sm"
              >
                CLOSE
              </button>
              <button 
                onClick={handleSaveForm}
                className="px-6 py-2.5 text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg shadow-sm hover:shadow transition-all"
              >
                {editItem ? "UPDATE" : "CREATE"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
