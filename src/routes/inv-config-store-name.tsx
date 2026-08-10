import { useState, useMemo, useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import { 
  Store, 
  Search, 
  Plus, 
  Edit3, 
  FileSpreadsheet, 
  Printer, 
  FileText,
  X,
  ChevronDown
} from "lucide-react";

export const Route = createFileRoute("/inv-config-store-name")({
  component: StoreNameConfigPage,
});

// --- Types & Mock Data ---

type StoreData = {
  id: string;
  status: "Active" | "Inactive";
  code: string;
  codeName: string;
  name: string;
  productType: string;
  locations: string[];
  // Form specific fields
  storeType: string;
  storeModuleArea: string;
  storeTableSet: string;
};

const ALL_LOCATIONS = [
  "Attire-HQ", "LNE-Factory", "Head Office", "PAL-HO",
  "Woven Garments-HO", "PGL-HO", "PBB-Firm", "PWFL-HO",
  "PTVL-Operation", "PWFL-Nowpara", "PSL-Operation", "PKCL-Savar",
  "RnD", "PWFL-Woven Garments", "Tripti-HO", "PSL-Head Office",
  "Tripti-Savar", "PGL-Factory", "Enorsia", "PBB-HO",
  "PAL-Fabric Dyeing", "PAL-AOP", "PFD-BD-", "PFD-HO",
  "PTVL-Head Office", "Tripti-PiP", "PFD-BD", "PWFL-Washing"
];

const PRODUCT_TYPES = ["General Items", "Yarn", "Garments", "Accessories", "Greige Fabrics", "Finish Fabrics", "Dyes & Chemicals", "ETP & WTP Chemicals", "IT", "Sales Regular", "MDF Items"];

const initialStores: StoreData[] = [
  { id: "1", status: "Active", code: "1", codeName: "GIS", name: "General Item Store", productType: "General Items", locations: ["Woven Garments-HO", "Tripti-Savar", "Tripti-PiP", "Tripti-HO", "RnD"], storeType: "Main Store", storeModuleArea: "Inventory Module Area", storeTableSet: "Common Inventory Tables Set" },
  { id: "2", status: "Active", code: "1", codeName: "YS", name: "Yarn Store", productType: "Yarn", locations: ["PWFL-Washing", "PWFL-Nowpara", "PKCL-Savar", "PAL-Fabric Dyeing", "PAL-AOP", "Head Office"], storeType: "Main Store", storeModuleArea: "Inventory Module Area", storeTableSet: "Common Inventory Tables Set" },
  { id: "3", status: "Active", code: "2", codeName: "GS", name: "Garments Store", productType: "Garments", locations: ["Woven Garments-HO", "Tripti-Savar", "Tripti-PiP", "Tripti-HO", "RnD"], storeType: "Main Store", storeModuleArea: "Inventory Module Area", storeTableSet: "Common Inventory Tables Set" },
  { id: "4", status: "Active", code: "2", codeName: "YSIn", name: "Yarn Store(Inbound)", productType: "Yarn", locations: ["Woven Garments-HO", "Tripti-Savar", "Tripti-PiP", "Tripti-HO", "Tongi-PGL", "Tongi-Knit", "RnD"], storeType: "Main Store", storeModuleArea: "Inventory Module Area", storeTableSet: "Common Inventory Tables Set" },
  { id: "5", status: "Active", code: "3", codeName: "YS", name: "Yarn Store --", productType: "Yarn", locations: ["PWFL-Nowpara", "PKCL-Savar", "PAL-Fabric Dyeing", "PAL-AOP", "Head Office"], storeType: "Main Store", storeModuleArea: "Inventory Module Area", storeTableSet: "Common Inventory Tables Set" },
  { id: "6", status: "Active", code: "4", codeName: "Accs", name: "Accessories", productType: "Accessories", locations: ["Woven Garments-HO", "Tripti-Savar", "Tripti-PiP", "Tripti-HO", "RnD"], storeType: "Main Store", storeModuleArea: "Inventory Module Area", storeTableSet: "Common Inventory Tables Set" },
  { id: "7", status: "Active", code: "4", codeName: "GFSIn", name: "Greige Fabrics Store(Inbound)", productType: "Greige Fabrics", locations: ["Woven Garments-HO", "Tripti-Savar", "Tripti-PiP", "Tripti-HO", "Tongi-PGL", "Tongi-Knit", "RnD"], storeType: "Main Store", storeModuleArea: "Inventory Module Area", storeTableSet: "Common Inventory Tables Set" },
  { id: "8", status: "Active", code: "5", codeName: "FFS", name: "Finish Fabrics Store", productType: "Finish Fabrics", locations: ["Woven Garments-HO", "Tripti-Savar", "Tripti-PiP", "Tripti-HO", "Tongi-PGL", "Tongi-Knit", "RnD"], storeType: "Main Store", storeModuleArea: "Inventory Module Area", storeTableSet: "Common Inventory Tables Set" },
  { id: "9", status: "Active", code: "6", codeName: "DCS", name: "Dyes & Chemical Store", productType: "Dyes & Chemicals", locations: ["Woven Garments-HO", "Tripti-Savar", "Tripti-PiP", "Tripti-HO", "RnD"], storeType: "Main Store", storeModuleArea: "Inventory Module Area", storeTableSet: "Common Inventory Tables Set" },
  { id: "10", status: "Active", code: "8", codeName: "ETP", name: "ETP & WTP Chemical Store", productType: "ETP & WTP Chemicals", locations: ["Woven Garments-HO", "Tripti-Savar", "Tripti-PiP", "Tripti-HO", "RnD"], storeType: "Main Store", storeModuleArea: "Inventory Module Area", storeTableSet: "Common Inventory Tables Set" },
  { id: "11", status: "Active", code: "9", codeName: "IT", name: "IT", productType: "IT", locations: ["Woven Garments-HO", "Tripti-Savar", "Tripti-PiP", "Tripti-HO", "RnD"], storeType: "Main Store", storeModuleArea: "Inventory Module Area", storeTableSet: "Common Inventory Tables Set" },
  { id: "12", status: "Active", code: "10", codeName: "SS", name: "Sales Store", productType: "Sales Regular", locations: ["Woven Garments-HO", "Tripti-Savar", "Tripti-PiP", "Tripti-HO", "Tongi-PGL", "Tongi-Knit", "RnD"], storeType: "Main Store", storeModuleArea: "Inventory Module Area", storeTableSet: "Common Inventory Tables Set" },
];

function StoreNameConfigPage() {
  const [stores, setStores] = useState<StoreData[]>(initialStores);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<StoreData | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<StoreData>>({});

  // Location Selector state
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredData = useMemo(() => {
    return stores.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.codeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [stores, searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openCreateModal = () => {
    setFormData({ 
      storeType: "Main Store", 
      status: "Active", 
      storeModuleArea: "Inventory Module Area",
      storeTableSet: "Common Inventory Tables Set",
      locations: []
    });
    setEditItem(null);
    setIsFormOpen(true);
  };

  const openEditModal = (item: StoreData) => {
    setFormData({ ...item, locations: [...item.locations] });
    setEditItem(item);
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
    setEditItem(null);
    setFormData({});
    setIsLocationDropdownOpen(false);
  };

  const handleSaveForm = () => {
    if (editItem) {
      setStores(prev => prev.map(p => p.id === editItem.id ? { ...p, ...formData } as StoreData : p));
    } else {
      const newId = (Math.max(0, ...stores.map(p => parseInt(p.id))) + 1).toString();
      const newStore: StoreData = {
        id: newId,
        storeType: formData.storeType || "Main Store",
        productType: formData.productType || PRODUCT_TYPES[0],
        name: formData.name || "",
        code: formData.code || "",
        codeName: formData.codeName || "",
        status: formData.status as any || "Active",
        storeModuleArea: formData.storeModuleArea || "Inventory Module Area",
        storeTableSet: formData.storeTableSet || "Common Inventory Tables Set",
        locations: formData.locations || [],
      };
      setStores(prev => [...prev, newStore]);
    }
    closeFormModal();
  };

  const toggleLocation = (loc: string) => {
    const currentLocs = formData.locations || [];
    if (currentLocs.includes(loc)) {
      setFormData({ ...formData, locations: currentLocs.filter(l => l !== loc) });
    } else {
      setFormData({ ...formData, locations: [...currentLocs, loc] });
    }
  };

  const removeLocation = (loc: string) => {
    const currentLocs = formData.locations || [];
    setFormData({ ...formData, locations: currentLocs.filter(l => l !== loc) });
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
                <Store className="size-6 text-primary" />
                Store Name Configuration
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage store entries, types, and their assigned locations.
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
                    <th className="px-4 py-2.5 font-semibold w-16 text-center">Actions</th>
                    <th className="px-4 py-2.5 font-semibold w-20 text-center">Status</th>
                    <th className="px-4 py-2.5 font-semibold w-16">Code</th>
                    <th className="px-4 py-2.5 font-semibold w-24">Code Name</th>
                    <th className="px-4 py-2.5 font-semibold min-w-[200px]">Store Name</th>
                    <th className="px-4 py-2.5 font-semibold w-40">Product Type</th>
                    <th className="px-4 py-2.5 font-semibold">Locations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {filteredData.map((item) => (
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
                      <td className="px-4 py-2 text-center">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-background border border-border">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 font-mono font-semibold text-muted-foreground text-[11px]">
                        {item.code}
                      </td>
                      <td className="px-4 py-2 font-medium text-foreground text-[11px] whitespace-nowrap">
                        {item.codeName}
                      </td>
                      <td className="px-4 py-2 font-medium text-foreground text-[11px] whitespace-nowrap">
                        {item.name}
                      </td>
                      <td className="px-4 py-2 font-medium text-muted-foreground text-[11px] whitespace-nowrap">
                        {item.productType}
                      </td>
                      <td className="px-4 py-2">
                        <p className="text-[11px] text-muted-foreground line-clamp-2 md:line-clamp-none max-w-xl leading-relaxed">
                          {item.locations.join(", ")}
                        </p>
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-muted-foreground text-sm font-semibold">
                        No stores found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-border/50 bg-muted/10 text-[11px] text-muted-foreground font-semibold flex justify-between items-center">
              <span>Showing 1 to {filteredData.length} of {stores.length} entries</span>
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
                {editItem ? "Update Store Entry" : "Create Store Entry"}
              </h2>
              <button onClick={closeFormModal} className="text-muted-foreground hover:bg-muted p-1.5 rounded-full transition">
                <X className="size-4" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Store Type <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    className="w-full pl-3 pr-8 py-2.5 bg-background border border-border rounded-lg text-sm font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={formData.storeType || ""}
                    onChange={e => setFormData({...formData, storeType: e.target.value})}
                  >
                    <option value="Main Store">Main Store</option>
                    <option value="Sub Store">Sub Store</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Product Type <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    className="w-full pl-3 pr-8 py-2.5 bg-background border border-border rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Store Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold"
                  value={formData.name || ""}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Code No</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.code || ""}
                  onChange={e => setFormData({...formData, code: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Code Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.codeName || ""}
                  onChange={e => setFormData({...formData, codeName: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Status</label>
                <div className="relative">
                  <select 
                    className="w-full pl-3 pr-8 py-2.5 bg-background border border-border rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={formData.status || "Active"}
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Store Module Area <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    className="w-full pl-3 pr-8 py-2.5 bg-background border border-border rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={formData.storeModuleArea || ""}
                    onChange={e => setFormData({...formData, storeModuleArea: e.target.value})}
                  >
                    <option value="Inventory Module Area">Inventory Module Area</option>
                    <option value="Sales Module Area">Sales Module Area</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Store Table Set <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    className="w-full pl-3 pr-8 py-2.5 bg-background border border-border rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={formData.storeTableSet || ""}
                    onChange={e => setFormData({...formData, storeTableSet: e.target.value})}
                  >
                    <option value="Common Inventory Tables Set">Common Inventory Tables Set</option>
                    <option value="Unique Inventory Tables Set">Unique Inventory Tables Set</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Custom Multi-Select for Assign Location */}
              <div className="space-y-2 pb-10">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Assign Location <span className="text-red-500">*</span></label>
                <div 
                  className="min-h-[100px] w-full p-2 bg-background border border-border rounded-lg text-sm focus-within:ring-2 focus-within:ring-primary/50 flex flex-wrap gap-2 items-start transition-all relative"
                  ref={dropdownRef}
                >
                  {(formData.locations || []).map(loc => (
                    <div key={loc} className="flex items-center gap-1.5 bg-muted/60 text-foreground text-[11px] font-bold px-2 py-1.5 rounded border border-border/50 group">
                      {loc}
                      <button 
                        onClick={() => removeLocation(loc)}
                        className="text-muted-foreground hover:text-red-500 transition-colors focus:outline-none"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                    className="px-3 py-1.5 text-[11px] font-bold text-muted-foreground bg-muted hover:bg-muted/80 rounded border border-dashed border-border/80 flex items-center gap-1 transition-colors ml-auto"
                  >
                    <Plus className="size-3" /> Add Location
                  </button>

                  {/* Dropdown Menu */}
                  {isLocationDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-full max-h-60 overflow-y-auto bg-card border border-border rounded-xl shadow-lg z-10 p-2 grid grid-cols-2 sm:grid-cols-3 gap-1">
                      {ALL_LOCATIONS.map(loc => {
                        const isSelected = (formData.locations || []).includes(loc);
                        return (
                          <button
                            key={loc}
                            onClick={() => toggleLocation(loc)}
                            className={`text-left px-3 py-2 text-[11px] font-medium rounded-lg transition-colors flex justify-between items-center ${isSelected ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted text-foreground'}`}
                          >
                            <span className="truncate">{loc}</span>
                            {isSelected && <X className="size-3 opacity-50 shrink-0" />}
                          </button>
                        )
                      })}
                    </div>
                  )}
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
