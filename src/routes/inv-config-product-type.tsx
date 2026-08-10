import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import { 
  Package, 
  Search, 
  Plus, 
  Settings, 
  Edit3, 
  FileSpreadsheet, 
  Printer, 
  FileText,
  X,
  ArrowRight,
  Check
} from "lucide-react";

export const Route = createFileRoute("/inv-config-product-type")({
  component: ProductTypeConfigPage,
});

// --- Types & Mock Data ---

type ProductType = {
  id: string;
  code: string;
  name: string;
  shortName: string;
  sortOrder: number;
  status: "Active" | "Inactive";
  baseType: string;
  parameters: string[];
};

const initialProductTypes: ProductType[] = [
  { id: "1", code: "101", name: "General Items", shortName: "GI", sortOrder: 1, status: "Active", baseType: "Product Base", parameters: ["Product Name", "Default UOM", "Fixed Assets"] },
  { id: "2", code: "107", name: "Yarn", shortName: "YN", sortOrder: 2, status: "Active", baseType: "Product Base", parameters: ["Product Name", "Default UOM"] },
  { id: "3", code: "105", name: "Greige Fabrics", shortName: "GF", sortOrder: 3, status: "Active", baseType: "Product Base", parameters: ["Product Name"] },
  { id: "4", code: "103", name: "Finish Fabrics", shortName: "FF", sortOrder: 4, status: "Active", baseType: "Product Base", parameters: [] },
  { id: "5", code: "104", name: "Dyes & Chemicals", shortName: "DC", sortOrder: 5, status: "Active", baseType: "Product Base", parameters: [] },
  { id: "6", code: "106", name: "Garments", shortName: "GM", sortOrder: 6, status: "Active", baseType: "Product Base", parameters: [] },
  { id: "7", code: "102", name: "Accessories", shortName: "ACC", sortOrder: 7, status: "Active", baseType: "Product Base", parameters: [] },
  { id: "8", code: "108", name: "ETP & WTP Chemicals", shortName: "ETP", sortOrder: 8, status: "Active", baseType: "Product Base", parameters: [] },
  { id: "9", code: "100", name: "IT", shortName: "IT", sortOrder: 9, status: "Active", baseType: "Product Base", parameters: [] },
  { id: "10", code: "108", name: "Sales Regular", shortName: "SR", sortOrder: 10, status: "Active", baseType: "Product Base", parameters: [] },
  { id: "11", code: "110", name: "MDF Items", shortName: "MDF", sortOrder: 11, status: "Active", baseType: "Product Base", parameters: [] },
];

const ALL_PARAMETERS = [
  "Product Description",
  "Unit Conversion",
  "Calculation Parameter",
  "Brand Name",
  "Model Name",
  "Manufacturer Name",
  "Origin Name",
  "Size Name",
  "Factor Name",
  "Product Name",
  "Default UOM",
  "Fixed Assets",
  "Minimum Stock",
  "Re-Order Level"
];

function ProductTypeConfigPage() {
  const [productTypes, setProductTypes] = useState<ProductType[]>(initialProductTypes);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<ProductType | null>(null);
  const [paramsItem, setParamsItem] = useState<ProductType | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<ProductType>>({});

  const filteredData = useMemo(() => {
    return productTypes.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shortName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [productTypes, searchQuery]);

  const openCreateModal = () => {
    setFormData({ status: "Active", baseType: "Product Base" });
    setIsCreateOpen(true);
  };

  const openEditModal = (item: ProductType) => {
    setFormData({ ...item });
    setEditItem(item);
  };

  const closeFormModal = () => {
    setIsCreateOpen(false);
    setEditItem(null);
    setFormData({});
  };

  const handleSaveForm = () => {
    if (editItem) {
      setProductTypes(prev => prev.map(p => p.id === editItem.id ? { ...p, ...formData } as ProductType : p));
    } else {
      const newId = (Math.max(...productTypes.map(p => parseInt(p.id))) + 1).toString();
      setProductTypes(prev => [...prev, { ...formData, id: newId, parameters: [] } as ProductType]);
    }
    closeFormModal();
  };

  // --- Parameters Modal Logic ---
  const [tempParams, setTempParams] = useState<string[]>([]);
  
  const openParamsModal = (item: ProductType) => {
    setTempParams([...item.parameters]);
    setParamsItem(item);
  };

  const toggleParam = (param: string) => {
    setTempParams(prev => 
      prev.includes(param) ? prev.filter(p => p !== param) : [...prev, param]
    );
  };

  const saveParams = () => {
    if (paramsItem) {
      setProductTypes(prev => prev.map(p => p.id === paramsItem.id ? { ...p, parameters: tempParams } : p));
    }
    setParamsItem(null);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <InventorySidebar />
      <main className="flex-1 min-w-0 flex flex-col transition-all duration-300">
        <InventoryTopbar />
        
        <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
                <Settings className="size-6 text-primary" />
                Product Type Configuration
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your base product classifications and their configurations.
              </p>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <button className="h-9 px-3 bg-background border border-border hover:bg-muted text-foreground font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0">
                <FileSpreadsheet className="size-3.5 text-emerald-600" /> EXCEL
              </button>
              <button className="h-9 px-3 bg-background border border-border hover:bg-muted text-foreground font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0">
                <Printer className="size-3.5 text-blue-600" /> PRINT
              </button>
              <button className="h-9 px-3 bg-background border border-border hover:bg-muted text-foreground font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0">
                <FileText className="size-3.5 text-red-600" /> PDF
              </button>
              
              <div className="w-px h-6 bg-border mx-1"></div>
              
              <button 
                onClick={openCreateModal}
                className="h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 shrink-0"
              >
                <Plus className="size-4" />
                Add New
              </button>
            </div>
          </div>

          {/* Data Table Area */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
            
            {/* Toolbar */}
            <div className="p-4 border-b border-border/50 flex justify-end items-center bg-muted/10">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search types..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-muted/40 border-b border-border/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="px-4 py-2.5 font-semibold w-24 text-center">Actions</th>
                    <th className="px-4 py-2.5 font-semibold text-center w-16">SL</th>
                    <th className="px-4 py-2.5 font-semibold w-24">Code</th>
                    <th className="px-4 py-2.5 font-semibold">Product Type Name</th>
                    <th className="px-4 py-2.5 font-semibold w-32">Short Name</th>
                    <th className="px-4 py-2.5 font-semibold w-28 text-center">Sort Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {filteredData.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-muted/40 transition duration-150">
                      <td className="px-4 py-2">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openEditModal(item)}
                            className="size-6 rounded-md bg-transparent text-amber-600 border border-transparent hover:bg-amber-50 hover:border-amber-200 inline-flex items-center justify-center transition-colors shadow-sm"
                            title="Edit"
                          >
                            <Edit3 className="size-3" />
                          </button>
                          <button
                            onClick={() => openParamsModal(item)}
                            className="size-6 rounded-md bg-transparent text-blue-600 border border-transparent hover:bg-blue-50 hover:border-blue-200 inline-flex items-center justify-center transition-colors shadow-sm"
                            title="Configure Parameters"
                          >
                            <Settings className="size-3" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center font-mono text-muted-foreground font-semibold text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-2 font-mono font-semibold text-muted-foreground text-[11px]">
                        {item.code}
                      </td>
                      <td className="px-4 py-2 font-medium text-foreground text-xs">
                        {item.name}
                      </td>
                      <td className="px-4 py-2 font-medium text-muted-foreground text-xs">
                        {item.shortName}
                      </td>
                      <td className="px-4 py-2 font-mono font-semibold text-muted-foreground text-center text-[11px]">
                        {item.sortOrder}
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-muted-foreground text-sm font-semibold">
                        No product types found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-border/50 bg-muted/10 text-xs text-muted-foreground font-semibold flex justify-between items-center">
              <span>Showing 1 to {filteredData.length} of {productTypes.length} entries</span>
            </div>
          </div>
        </div>
      </main>

      {/* CREATE / EDIT MODAL */}
      {(isCreateOpen || editItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl border border-border/50 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-border/40 bg-muted/20">
              <h2 className="text-lg font-black text-foreground">
                {editItem ? "Update Product Type" : "Create Product Type"}
              </h2>
              <button onClick={closeFormModal} className="text-muted-foreground hover:bg-muted p-1.5 rounded-full transition">
                <X className="size-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Base Type <span className="text-red-500">*</span></label>
                <select 
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.baseType || ""}
                  onChange={e => setFormData({...formData, baseType: e.target.value})}
                >
                  <option value="Product Base">Product Base</option>
                  <option value="Service Base">Service Base</option>
                </select>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Code <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.code || ""}
                  onChange={e => setFormData({...formData, code: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Product Type Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.name || ""}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Short Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.shortName || ""}
                  onChange={e => setFormData({...formData, shortName: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sort Order <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.sortOrder || ""}
                  onChange={e => setFormData({...formData, sortOrder: parseInt(e.target.value)})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Status <span className="text-red-500">*</span></label>
                <select 
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.status || ""}
                  onChange={e => setFormData({...formData, status: e.target.value as any})}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="p-5 border-t border-border/40 bg-muted/10 flex justify-between">
              <button 
                onClick={closeFormModal}
                className="px-5 py-2 text-sm font-bold text-muted-foreground bg-background border border-border hover:bg-muted rounded-lg transition"
              >
                Close
              </button>
              <button 
                onClick={handleSaveForm}
                className="px-5 py-2 text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition"
              >
                {editItem ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PARAMETERS CONFIG MODAL */}
      {paramsItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-5xl rounded-2xl shadow-xl border border-border/50 overflow-hidden flex flex-col h-[85vh]">
            <div className="flex justify-between items-center p-5 border-b border-border/40 bg-muted/20">
              <div>
                <h2 className="text-lg font-black text-foreground">
                  Configure Parameters
                </h2>
                <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                  Type: <span className="text-primary">{paramsItem.name}</span>
                </p>
              </div>
              <button onClick={() => setParamsItem(null)} className="text-muted-foreground hover:bg-muted p-1.5 rounded-full transition">
                <X className="size-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row p-6 gap-6 bg-muted/5">
              
              {/* Left Column: Available */}
              <div className="flex-1 bg-background border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
                <div className="bg-amber-100/50 text-amber-800 font-black text-xs tracking-wider uppercase p-3 border-b border-border">
                  Product Parameters
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {ALL_PARAMETERS.filter(p => !tempParams.includes(p)).map(param => (
                    <button 
                      key={param}
                      onClick={() => toggleParam(param)}
                      className="w-full text-left px-4 py-2.5 bg-yellow-500/90 hover:bg-yellow-500 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-between group transition-all"
                    >
                      {param.toUpperCase()}
                      <ArrowRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                  {ALL_PARAMETERS.filter(p => !tempParams.includes(p)).length === 0 && (
                    <div className="text-center text-xs text-muted-foreground py-10 font-medium">
                      All parameters selected.
                    </div>
                  )}
                </div>
              </div>

              {/* Middle Divider (Visual) */}
              <div className="hidden md:flex flex-col items-center justify-center px-2 gap-4">
                <div className="flex gap-2">
                  <ArrowRight className="size-6 text-muted-foreground/30" />
                </div>
                <button 
                  onClick={saveParams}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm rounded-lg shadow-md transition w-full whitespace-nowrap"
                >
                  SUBMIT
                </button>
              </div>

              {/* Mobile Submit */}
              <div className="md:hidden flex justify-center">
                 <button 
                  onClick={saveParams}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm rounded-lg shadow-md transition w-full"
                >
                  SUBMIT
                </button>
              </div>

              {/* Right Column: Selected */}
              <div className="flex-1 bg-background border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
                <div className="bg-amber-100/50 text-amber-800 font-black text-xs tracking-wider uppercase p-3 border-b border-border">
                  Selected Parameters
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {tempParams.map(param => (
                    <div key={param} className="flex items-center justify-between group border-b border-border/50 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="size-5 rounded bg-blue-500 text-white flex items-center justify-center shrink-0">
                          <Check className="size-3.5" />
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground font-semibold leading-tight">{param}</p>
                          <p className="text-sm font-bold text-foreground leading-tight">{param}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleParam(param)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ))}
                  {tempParams.length === 0 && (
                    <div className="text-center text-xs text-muted-foreground py-10 font-medium">
                      No parameters selected.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
