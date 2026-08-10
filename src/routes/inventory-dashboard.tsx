import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import { Store, Laptop, Settings, ArrowRight, Package, Search } from "lucide-react";

export const Route = createFileRoute("/inventory-dashboard")({
  component: InventoryDashboard,
});

function InventoryDashboard() {
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("inventory_active_store");
    if (saved) {
      setSelectedStore(saved);
    } else {
      setIsModalOpen(true);
    }
  }, []);

  const handleSelectStore = (store: string) => {
    setSelectedStore(store);
    localStorage.setItem("inventory_active_store", store);
    setIsModalOpen(false);
  };

  const stores = [
    { id: "general", name: "General Store", icon: Store, desc: "Office supplies, furniture, and generic materials." },
    { id: "ict", name: "ICT Store", icon: Laptop, desc: "Computers, networking gears, and electronic accessories." },
    { id: "maintenance", name: "Maintenance Store", icon: Settings, desc: "Tools, spare parts, and facility equipment." },
  ];

  const filteredStores = stores.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300 relative">
      <InventorySidebar />
      <main className={`flex-1 min-w-0 flex flex-col transition-all duration-300 ${isModalOpen ? 'blur-sm pointer-events-none' : ''}`}>
        <InventoryTopbar />
        
        <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-5">
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
                <Package className="size-6 text-primary" />
                Inventory Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Currently managing: <span className="font-bold text-primary">{selectedStore || "None"}</span>
              </p>
            </div>
            
            {selectedStore && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="h-9 px-4 bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs rounded-lg transition-colors border border-border"
              >
                Switch Store
              </button>
            )}
          </div>
          
          {/* Placeholder Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-sm text-muted-foreground mb-4">Total Items</h3>
              <p className="text-3xl font-black">1,245</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-sm text-muted-foreground mb-4">Low Stock Alerts</h3>
              <p className="text-3xl font-black text-rose-500">12</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-sm text-muted-foreground mb-4">Pending Issues</h3>
              <p className="text-3xl font-black text-amber-500">5</p>
            </div>
          </div>
        </div>
      </main>

      {/* Store Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 p-4">
          <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border/50 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-border/40 bg-muted/30">
              <h2 className="text-lg font-black text-foreground">Select Operating Store</h2>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Choose a store to manage its inventory, purchases, and issuances.
              </p>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search stores..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="p-5 overflow-y-auto bg-muted/10">
              {filteredStores.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No stores found matching "{searchQuery}"
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredStores.map((store) => (
                    <button
                      key={store.id}
                      onClick={() => handleSelectStore(store.name)}
                      className="group relative flex items-center text-left bg-background border border-border hover:border-primary/50 hover:bg-primary/5 rounded-xl p-3 transition-all duration-200"
                    >
                      <div className="shrink-0 size-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mr-3 group-hover:scale-105 transition-transform">
                        <store.icon className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0 pr-6">
                        <h3 className="font-bold text-foreground text-sm truncate">{store.name}</h3>
                        <p className="text-[11px] text-muted-foreground leading-snug line-clamp-1 mt-0.5">
                          {store.desc}
                        </p>
                      </div>
                      
                      <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="size-4 text-primary" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
