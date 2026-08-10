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

export const Route = createFileRoute("/inv-config-group-name")({
  component: GroupNameConfigPage,
});

// --- Types & Mock Data ---

type GroupData = {
  id: string;
  productType: string;
  code: string;
  groupName: string;
  shortName: string;
  sortOrder: string;
};

const PRODUCT_TYPES = ["General Items", "Yarn", "Garments", "Accessories", "Greige Fabrics", "Finish Fabrics"];

const initialGroups: GroupData[] = [
  { id: "1", productType: "General Items", code: "", groupName: "Kitchen Items & Equipment_FixedAssets", shortName: "", sortOrder: "" },
  { id: "2", productType: "General Items", code: "", groupName: "Furniture_FixedAssets", shortName: "", sortOrder: "" },
  { id: "3", productType: "General Items", code: "100", groupName: "Electronics Items", shortName: "Electronics Items", sortOrder: "100" },
  { id: "4", productType: "General Items", code: "", groupName: "Air Controlling Equipment_FixedAssets", shortName: "", sortOrder: "" },
  { id: "5", productType: "General Items", code: "1001", groupName: "Lab", shortName: "", sortOrder: "" },
  { id: "6", productType: "General Items", code: "1002", groupName: "Security, Fire & Safety Instrument", shortName: "FIR", sortOrder: "3" },
  { id: "7", productType: "General Items", code: "", groupName: "Safety & Security Equipment_FixedAssets", shortName: "", sortOrder: "" },
  { id: "8", productType: "General Items", code: "", groupName: "Earthing System Installation_FixedAssets", shortName: "", sortOrder: "" },
  { id: "9", productType: "General Items", code: "", groupName: "Floor Washing Machine_FixedAssets", shortName: "", sortOrder: "" },
  { id: "10", productType: "General Items", code: "", groupName: "Oil Tank_FixedAssets", shortName: "", sortOrder: "" },
  { id: "11", productType: "General Items", code: "1122", groupName: "Feed", shortName: "Feed", sortOrder: "123" },
  { id: "12", productType: "General Items", code: "", groupName: "Lighting Fixtures_FixedAssets", shortName: "", sortOrder: "" },
  { id: "13", productType: "General Items", code: "", groupName: "Embroidery Machineries_FixedAssets", shortName: "", sortOrder: "" },
  { id: "14", productType: "General Items", code: "1004", groupName: "ISO Items", shortName: "ISO", sortOrder: "12" },
];

function GroupNameConfigPage() {
  const [groups, setGroups] = useState<GroupData[]>(initialGroups);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductType, setSelectedProductType] = useState(PRODUCT_TYPES[0]);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<GroupData | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<GroupData>>({});

  const filteredData = useMemo(() => {
    return groups.filter((item) => {
      const matchesType = selectedProductType ? item.productType === selectedProductType : true;
      const matchesSearch = 
        item.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shortName.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesType && matchesSearch;
    });
  }, [groups, searchQuery, selectedProductType]);

  const openCreateModal = () => {
    setFormData({ productType: selectedProductType });
    setEditItem(null);
    setIsFormOpen(true);
  };

  const openEditModal = (item: GroupData) => {
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
    if (confirm("Are you sure you want to delete this group?")) {
      setGroups(prev => prev.filter(g => g.id !== id));
    }
  };

  const handleSaveForm = () => {
    if (editItem) {
      setGroups(prev => prev.map(p => p.id === editItem.id ? { ...p, ...formData } as GroupData : p));
    } else {
      const newId = (Math.max(0, ...groups.map(p => parseInt(p.id))) + 1).toString();
      const newGroup: GroupData = {
        id: newId,
        productType: formData.productType || PRODUCT_TYPES[0],
        code: formData.code || "",
        groupName: formData.groupName || "",
        shortName: formData.shortName || "",
        sortOrder: formData.sortOrder || "",
      };
      setGroups(prev => [...prev, newGroup]);
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
                Group Name Configuration
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage group names categorized by product type.
              </p>
            </div>
          </div>

          {/* Top Filter Section */}
          <div className="bg-card border border-border rounded-xl shadow-sm p-5 flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-80 space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Product Type <span className="text-red-500">*</span></label>
              <div className="relative">
                <select 
                  className="w-full pl-3 pr-8 py-2.5 bg-background border border-border rounded-lg text-sm font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={selectedProductType}
                  onChange={(e) => setSelectedProductType(e.target.value)}
                >
                  {PRODUCT_TYPES.map(pt => (
                    <option key={pt} value={pt}>{pt}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <button className="h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg shadow-sm hover:shadow transition-all shrink-0">
              SEARCH
            </button>
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
                    <th className="px-4 py-2.5 font-semibold w-40">Product Type</th>
                    <th className="px-4 py-2.5 font-semibold w-24">Code</th>
                    <th className="px-4 py-2.5 font-semibold min-w-[300px]">Group Name</th>
                    <th className="px-4 py-2.5 font-semibold w-40">Short Name</th>
                    <th className="px-4 py-2.5 font-semibold w-24 text-right">Sort Order</th>
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
                        {item.productType}
                      </td>
                      <td className="px-4 py-2 font-mono font-semibold text-muted-foreground text-[11px]">
                        {item.code}
                      </td>
                      <td className="px-4 py-2 font-medium text-foreground text-[11px]">
                        {item.groupName}
                      </td>
                      <td className="px-4 py-2 font-medium text-muted-foreground text-[11px] whitespace-nowrap">
                        {item.shortName}
                      </td>
                      <td className="px-4 py-2 font-mono font-semibold text-muted-foreground text-right text-[11px]">
                        {item.sortOrder}
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-muted-foreground text-sm font-semibold">
                        No groups found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-border/50 bg-muted/10 text-[11px] text-muted-foreground font-semibold flex justify-between items-center">
              <span>Showing 1 to {filteredData.length} of {groups.length} entries</span>
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
                {editItem ? "Update Group Name" : "Create Group Name"}
              </h2>
              <button onClick={closeFormModal} className="text-muted-foreground hover:bg-muted p-1.5 rounded-full transition">
                <X className="size-4" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Product Type <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    className="w-full pl-3 pr-8 py-2.5 bg-background border border-border rounded-lg text-sm font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={formData.productType || ""}
                    onChange={e => setFormData({...formData, productType: e.target.value})}
                  >
                    {PRODUCT_TYPES.map(pt => (
                      <option key={pt} value={pt}>{pt}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Code <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold font-mono"
                  value={formData.code || ""}
                  onChange={e => setFormData({...formData, code: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Group Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold"
                  value={formData.groupName || ""}
                  onChange={e => setFormData({...formData, groupName: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Short Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.shortName || ""}
                  onChange={e => setFormData({...formData, shortName: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Sort Order <span className="text-red-500">*</span></label>
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
