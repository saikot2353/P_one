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
  X,
  ChevronDown
} from "lucide-react";

export const Route = createFileRoute("/inv-config-uom")({
  component: UoMConfigPage,
});

// --- Types & Mock Data ---

type UoMData = {
  id: string;
  unitGroupName: string;
  unitName: string;
  shortName: string;
  sortOrder: string;
  relativeFactor: string;
  isBaseUnit: boolean;
};

const UNIT_GROUPS = ["Linear", "MKS", "-Select-"];

const initialUoMs: UoMData[] = [
  { id: "1", unitGroupName: "Linear", unitName: "GG", shortName: "gg", sortOrder: "4", relativeFactor: "1728.00", isBaseUnit: true },
  { id: "2", unitGroupName: "Linear", unitName: "PKT", shortName: "1001", sortOrder: "", relativeFactor: "1.00", isBaseUnit: true },
  { id: "3", unitGroupName: "Linear", unitName: "Job", shortName: "Job", sortOrder: "", relativeFactor: "1.00", isBaseUnit: true },
  { id: "4", unitGroupName: "", unitName: "S.Inches", shortName: "1002", sortOrder: "", relativeFactor: "", isBaseUnit: true },
  { id: "5", unitGroupName: "", unitName: "Than", shortName: "1000", sortOrder: "", relativeFactor: "", isBaseUnit: true },
  { id: "6", unitGroupName: "", unitName: "Bundle", shortName: "1003", sortOrder: "", relativeFactor: "", isBaseUnit: true },
  { id: "7", unitGroupName: "Linear", unitName: "Dzn", shortName: "1036", sortOrder: "3", relativeFactor: "12.00", isBaseUnit: true },
  { id: "8", unitGroupName: "Linear", unitName: "ROLL", shortName: "1004", sortOrder: "", relativeFactor: "1.00", isBaseUnit: true },
];

function UoMConfigPage() {
  const [uoms, setUoMs] = useState<UoMData[]>(initialUoMs);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<UoMData | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<UoMData>>({ isBaseUnit: false });

  const filteredData = useMemo(() => {
    return uoms.filter((item) => {
      const matchesSearch = 
        item.unitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.unitGroupName.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });
  }, [uoms, searchQuery]);

  const openCreateModal = () => {
    setFormData({ isBaseUnit: false });
    setEditItem(null);
    setIsFormOpen(true);
  };

  const openEditModal = (item: UoMData) => {
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
    if (confirm("Are you sure you want to delete this UoM?")) {
      setUoMs(prev => prev.filter(g => g.id !== id));
    }
  };

  const handleSaveForm = () => {
    if (editItem) {
      setUoMs(prev => prev.map(p => p.id === editItem.id ? { ...p, ...formData } as UoMData : p));
    } else {
      const newId = (Math.max(0, ...uoms.map(p => parseInt(p.id))) + 1).toString();
      const newUoM: UoMData = {
        id: newId,
        unitGroupName: formData.unitGroupName || "",
        unitName: formData.unitName || "",
        shortName: formData.shortName || "",
        sortOrder: formData.sortOrder || "",
        relativeFactor: formData.relativeFactor || "",
        isBaseUnit: formData.isBaseUnit || false,
      };
      setUoMs(prev => [...prev, newUoM]);
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
                <FolderTree className="size-6 text-primary" />
                Unit of Measurement (UoM) Configuration
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage unit of measurement for inventory items.
              </p>
            </div>
          </div>

          {/* Data Table Area */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
            
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white">
              
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
                <button className="h-[32px] px-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[10px] uppercase rounded flex items-center gap-1.5 shrink-0 transition-colors shadow-sm">
                  <FileSpreadsheet className="size-3.5 text-emerald-600" /> EXCEL
                </button>
                <button className="h-[32px] px-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[10px] uppercase rounded flex items-center gap-1.5 shrink-0 transition-colors shadow-sm">
                  <Printer className="size-3.5 text-blue-600" /> PRINT
                </button>
                <button className="h-[32px] px-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[10px] uppercase rounded flex items-center gap-1.5 shrink-0 transition-colors shadow-sm">
                  <FileText className="size-3.5 text-red-600" /> PDF
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-64 shrink-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 h-[32px] bg-[#f2f4f7] border border-transparent hover:border-slate-200 focus:bg-white focus:border-blue-500 rounded-md text-[11px] font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
                  />
                </div>
                <button 
                  onClick={openCreateModal}
                  className="h-[32px] px-4 bg-[#0d6efd] hover:bg-blue-700 text-white font-bold text-[11px] rounded flex items-center gap-1.5 shrink-0 shadow-sm transition-colors"
                >
                  <Plus className="size-3.5" strokeWidth={3} />
                  Add New
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    <th className="px-4 py-2.5 font-semibold w-24 text-center">Actions</th>
                    <th className="px-4 py-2.5 font-semibold w-16 text-center">SL</th>
                    <th className="px-4 py-2.5 font-semibold w-32">Unit GroupName</th>
                    <th className="px-4 py-2.5 font-semibold min-w-[200px]">Unit Name</th>
                    <th className="px-4 py-2.5 font-semibold w-32">Short Name</th>
                    <th className="px-4 py-2.5 font-semibold w-24 text-right">Sort Order</th>
                    <th className="px-4 py-2.5 font-semibold w-32 text-right">Relative Factor</th>
                    <th className="px-4 py-2.5 font-semibold w-24 text-center">IsBaseUnit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {filteredData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50 border-b border-slate-100 transition duration-150">
                      <td className="px-4 py-2">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="size-[26px] rounded-md bg-white border border-slate-200 text-amber-500 hover:bg-amber-50 inline-flex items-center justify-center transition-colors shadow-sm"
                            title="Edit"
                          >
                            <Edit3 className="size-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="size-[26px] rounded-md bg-white border border-slate-200 text-red-500 hover:bg-red-50 inline-flex items-center justify-center transition-colors shadow-sm"
                            title="Delete"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center font-mono text-muted-foreground font-semibold text-[11px]">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 font-medium text-foreground text-[11px] whitespace-nowrap">
                        {item.unitGroupName}
                      </td>
                      <td className="px-4 py-2 font-medium text-foreground text-[11px]">
                        {item.unitName}
                      </td>
                      <td className="px-4 py-2 font-medium text-muted-foreground text-[11px] whitespace-nowrap">
                        {item.shortName}
                      </td>
                      <td className="px-4 py-2 font-mono font-semibold text-muted-foreground text-right text-[11px]">
                        {item.sortOrder}
                      </td>
                      <td className="px-4 py-2 font-mono font-semibold text-muted-foreground text-right text-[11px]">
                        {item.relativeFactor}
                      </td>
                      <td className="px-4 py-2 font-medium text-foreground text-center text-[11px] whitespace-nowrap">
                        {item.isBaseUnit ? "Yes" : "No"}
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-muted-foreground text-sm font-semibold">
                        No UoMs found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-border/50 bg-muted/10 text-[11px] text-muted-foreground font-semibold flex justify-between items-center">
              <span>Showing 1 to {filteredData.length} of {uoms.length} entries</span>
            </div>
          </div>
        </div>
      </main>

      {/* CREATE / EDIT MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-2xl rounded-2xl shadow-xl border border-border/50 overflow-hidden flex flex-col h-[90vh] md:h-auto md:max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-border/40 bg-muted/20 shrink-0">
              <h2 className="text-lg font-black text-foreground">
                {editItem ? "Update Unit of Measurement" : "Product Type"}
              </h2>
              <button onClick={closeFormModal} className="text-muted-foreground hover:bg-muted p-1.5 rounded-full transition">
                <X className="size-4" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground tracking-wider">Unit Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold"
                  value={formData.unitName || ""}
                  onChange={e => setFormData({...formData, unitName: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground tracking-wider">Short Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.shortName || ""}
                  onChange={e => setFormData({...formData, shortName: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground tracking-wider">Unit Group</label>
                <div className="relative">
                  <select 
                    className="w-full pl-3 pr-8 py-2.5 bg-background border border-border rounded-lg text-sm font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={formData.unitGroupName || ""}
                    onChange={e => setFormData({...formData, unitGroupName: e.target.value})}
                  >
                    {UNIT_GROUPS.map(pt => (
                      <option key={pt} value={pt}>{pt}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground tracking-wider">Sort Order <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.sortOrder || ""}
                  onChange={e => setFormData({...formData, sortOrder: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground tracking-wider">Relative Factor <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
                  value={formData.relativeFactor || ""}
                  onChange={e => setFormData({...formData, relativeFactor: e.target.value})}
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-bold text-muted-foreground tracking-wider">Is Base Unit? :</label>
                <input 
                  type="checkbox" 
                  className="size-5 border-border rounded text-primary focus:ring-primary"
                  checked={formData.isBaseUnit || false}
                  onChange={e => setFormData({...formData, isBaseUnit: e.target.checked})}
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
