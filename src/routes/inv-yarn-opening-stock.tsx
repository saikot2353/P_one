import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import { Plus, Search, Filter, Package, FileDown } from "lucide-react";

export const Route = createFileRoute("/inv-yarn-opening-stock")({
  component: YarnOpeningStockPage,
});

function YarnOpeningStockPage() {
  const [searchQuery, setSearchQuery] = useState("");

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
                <Package className="size-6 text-primary" />
                Yarn Opening Stock
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage and add starting balances for yarn stock items
              </p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button className="h-9 px-4 bg-background border border-border hover:bg-muted text-foreground font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 shrink-0">
                <FileDown className="size-4" />
                Export
              </button>
              {/* Add New Stock Button */}
              <button className="h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 shrink-0">
                <Plus className="size-4" />
                Add New Stock
              </button>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
            
            {/* Toolbar */}
            <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/10">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search yarn stock..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                />
              </div>
              <button className="h-9 px-3 bg-background border border-border hover:bg-muted text-foreground rounded-lg transition-colors flex items-center gap-2 text-sm w-full sm:w-auto justify-center">
                <Filter className="size-4" />
                Filters
              </button>
            </div>

            {/* Empty State / Table Placeholder */}
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Package className="size-8 text-primary opacity-80" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">No opening stock entries</h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-6">
                You haven't recorded any yarn opening stock yet. Click the button below to add your first stock entry.
              </p>
              <button className="h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2">
                <Plus className="size-4" />
                Add New Stock
              </button>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
