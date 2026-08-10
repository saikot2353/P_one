import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import { 
  FolderTree, 
  Search, 
  Plus, 
  Edit3, 
  Trash2,
  FileSpreadsheet, 
  Printer, 
  FileText,
  X
} from "lucide-react";

export const Route = createFileRoute("/inv-config-brand")({
  component: BrandConfigPage,
});

// --- Types & Mock Data ---

type BrandData = {
  id: string;
  brandName: string;
  code: string;
  sortOrder: string;
};

const initialBrands: BrandData[] = [
  { id: "1", brandName: "Apple", code: "APL", sortOrder: "1" },
  { id: "2", brandName: "Samsung", code: "SAM", sortOrder: "2" },
  { id: "3", brandName: "Sony", code: "SNY", sortOrder: "3" },
];

function BrandConfigPage() {
  const [brands, setBrands] = useState<BrandData[]>(initialBrands);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<BrandData | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<BrandData>>({});

  const filteredData = useMemo(() => {
    return brands.filter((item) => {
      return item.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
             item.code.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [brands, searchQuery]);

  const openCreateModal = () => {
    setFormData({});
    setEditItem(null);
    setIsFormOpen(true);
  };

  const openEditModal = (item: BrandData) => {
    setFormData({ ...item });
    setEditItem(item);
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
    setEditItem(null);
    setFormData({});
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this Brand?")) {
      setBrands(prev => prev.filter(g => g.id !== id));
    }
  };

  const handleSaveForm = () => {
    if (editItem) {
      setBrands(prev => prev.map(p => p.id === editItem.id ? { ...p, ...formData } as BrandData : p));
    } else {
      const newId = (Math.max(0, ...brands.map(p => parseInt(p.id))) + 1).toString();
      const newBrand: BrandData = {
        id: newId,
        brandName: formData.brandName || "",
        code: formData.code || "",
        sortOrder: formData.sortOrder || "",
      };
      setBrands(prev => [...prev, newBrand]);
    }
    closeFormModal();
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
                <FolderTree className="size-6 text-primary" />
                Brand Configuration
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage brand names.
              </p>
            </div>
          </div>

          {/* Data Table Area */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
            
            {/* Toolbar */}
            <div className="p-4 border-b border-border/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/10">
              
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
                <button className="h-9 px-3 bg-background border border-border hover:bg-muted text-foreground font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0">
                  <FileSpreadsheet className="size-3.5 text-emerald-600" /> EXCEL
                </button>
                <button className="h-9 px-3 bg-background border border-border hover:bg-muted text-foreground font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0">
                  <Printer className="size-3.5 text-blue-600" /> PRINT
                </button>
                <button className="h-9 px-3 bg-background border border-border hover:bg-muted text-foreground font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0">
                  <FileText className="size-3.5 text-red-600" /> PDF
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-64 shrink-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  />
                </div>
                <button 
                  onClick={openCreateModal}
                  className="h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 shrink-0 w-full sm:w-auto justify-center"
                >
                  <Plus className="size-4" />
                  Add New
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-muted/40 border-b border-border/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                    <th className="px-4 py-2.5 font-semibold w-24 text-center">Actions</th>
                    <th className="px-4 py-2.5 font-semibold w-16 text-center">SL</th>
                    <th className="px-4 py-2.5 font-semibold min-w-[200px]">Brand Name</th>
                    <th className="px-4 py-2.5 font-semibold w-32">Code</th>
                    <th className="px-4 py-2.5 font-semibold w-24 text-right">Sort Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {filteredData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-muted/40 transition duration-150">
                      <td className="px-4 py-2">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="size-6 rounded-md bg-transparent text-amber-600 border border-transparent hover:bg-amber-50 hover:border-amber-200 inline-flex items-center justify-center transition-colors shadow-sm"
                            title="Edit"
                          >
                            <Edit3 className="size-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="size-6 rounded-md bg-transparent text-red-600 border border-transparent hover:bg-red-50 hover:border-red-200 inline-flex items-center justify-center transition-colors shadow-sm"
                            title="Delete"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center font-mono text-muted-foreground font-semibold text-[11px]">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 font-medium text-foreground text-xs">
                        {item.brandName}
                      </td>
                      <td className="px-4 py-2 font-mono font-semibold text-muted-foreground text-[11px]">
                        {item.code}
                      </td>
                      <td className="px-4 py-2 font-mono font-semibold text-muted-foreground text-right text-[11px]">
                        {item.sortOrder}
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-muted-foreground text-sm font-semibold">
                        No brands found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-border/50 bg-muted/10 text-xs text-muted-foreground font-semibold flex justify-between items-center">
              <span>Showing 1 to {filteredData.length} of {brands.length} entries</span>
            </div>
          </div>
        </div>
      </main>

      {/* CREATE / EDIT MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-xl rounded-2xl shadow-xl border border-border/50 overflow-hidden flex flex-col h-[90vh] md:h-auto md:max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-border/40 bg-muted/20 shrink-0">
              <h2 className="text-lg font-black text-foreground">
                {editItem ? "Update Brand" : "Create Brand"}
              </h2>
              <button onClick={closeFormModal} className="text-muted-foreground hover:bg-muted p-1.5 rounded-full transition">
                <X className="size-4" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground tracking-wider">Brand Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold"
                  value={formData.brandName || ""}
                  onChange={e => setFormData({...formData, brandName: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground tracking-wider">Code <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
                  value={formData.code || ""}
                  onChange={e => setFormData({...formData, code: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground tracking-wider">Sort Order</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.sortOrder || ""}
                  onChange={e => setFormData({...formData, sortOrder: e.target.value})}
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-border/40 bg-muted/10 flex justify-between shrink-0">
              <button 
                onClick={closeFormModal}
                className="px-6 py-2.5 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-sm transition shadow-sm"
              >
                CLOSE
              </button>
              <button 
                onClick={handleSaveForm}
                className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-sm shadow-sm transition-all"
              >
                CREATE
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
