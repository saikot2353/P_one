import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import { 
  Package, 
  Search, 
  Filter, 
  FileDown, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  FileSpreadsheet, 
  Printer, 
  FileText 
} from "lucide-react";

export const Route = createFileRoute("/inv-yarn-opening-stock")({
  component: YarnOpeningStockPage,
});

// --- Types & Mock Data ---

type OpeningStockData = {
  id: string;
  stockDate: string;
  productName: string;
  quantity: string;
  unitPrice: string;
  totalPrice: string;
};

const initialStock: OpeningStockData[] = [
  { id: "1", stockDate: "2026-08-10", productName: "Cotton Yarn 30/1 Combed", quantity: "5000", unitPrice: "3.50", totalPrice: "17500.00" },
  { id: "2", stockDate: "2026-08-10", productName: "Polyester Spun 20/2", quantity: "2500", unitPrice: "2.10", totalPrice: "5250.00" },
  { id: "3", stockDate: "2026-08-09", productName: "Viscose Rayon 40s", quantity: "1200", unitPrice: "4.20", totalPrice: "5040.00" },
  { id: "4", stockDate: "2026-08-08", productName: "Denim Slub Yarn 10/1", quantity: "8000", unitPrice: "2.80", totalPrice: "22400.00" },
];

function YarnOpeningStockPage() {
  const [stock, setStock] = useState<OpeningStockData[]>(initialStock);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form State for multiple rows
  const [stockDate, setStockDate] = useState(new Date().toISOString().slice(0,10));
  const [productRows, setProductRows] = useState<Partial<OpeningStockData>[]>([
    { productName: "", quantity: "", unitPrice: "", totalPrice: "" }
  ]);

  const filteredData = useMemo(() => {
    return stock.filter((item) => {
      return item.productName.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [stock, searchQuery]);

  const openCreateModal = () => {
    setStockDate(new Date().toISOString().slice(0,10));
    setProductRows([{ productName: "", quantity: "", unitPrice: "", totalPrice: "" }]);
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
  };

  const handleAddRow = () => {
    setProductRows([...productRows, { productName: "", quantity: "", unitPrice: "", totalPrice: "" }]);
  };

  const handleRemoveRow = (index: number) => {
    setProductRows(productRows.filter((_, i) => i !== index));
  };

  const handleRowChange = (index: number, field: keyof OpeningStockData, value: string) => {
    const newRows = [...productRows];
    newRows[index] = { ...newRows[index], [field]: value };
    
    // Auto-calculate Total Price if Quantity and Unit Price are valid numbers
    if (field === 'quantity' || field === 'unitPrice') {
       const qty = parseFloat(newRows[index].quantity || "0");
       const price = parseFloat(newRows[index].unitPrice || "0");
       if (!isNaN(qty) && !isNaN(price)) {
         newRows[index].totalPrice = (qty * price).toFixed(2);
       } else {
         newRows[index].totalPrice = "0";
       }
    }
    
    setProductRows(newRows);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this stock entry?")) {
      setStock(prev => prev.filter(g => g.id !== id));
    }
  };

  const handleSaveForm = () => {
    const newEntries: OpeningStockData[] = [];
    let maxId = Math.max(0, ...stock.map(p => parseInt(p.id)));

    productRows.forEach(row => {
      if (row.productName && row.quantity && row.unitPrice) {
        maxId++;
        newEntries.push({
          id: maxId.toString(),
          stockDate: stockDate,
          productName: row.productName || "",
          quantity: row.quantity || "0",
          unitPrice: row.unitPrice || "0",
          totalPrice: row.totalPrice || "0",
        });
      }
    });

    if (newEntries.length > 0) {
      setStock(prev => [...prev, ...newEntries]);
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
                <Package className="size-6 text-primary" />
                Yarn Opening Stock
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage and add starting balances for yarn stock items
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
                  Add New Stock
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-red-50/50 dark:bg-red-950/20 border-b border-border/50 text-[11px] font-bold text-muted-foreground tracking-wider whitespace-nowrap">
                    <th className="px-4 py-3 font-semibold w-24 text-center">Action</th>
                    <th className="px-4 py-3 font-semibold w-16 text-center">SL No</th>
                    <th className="px-4 py-3 font-semibold min-w-[200px]">Product Name</th>
                    <th className="px-4 py-3 font-semibold w-32 text-right">Quantity</th>
                    <th className="px-4 py-3 font-semibold w-32 text-right">Unit Price</th>
                    <th className="px-4 py-3 font-semibold w-32 text-right">Total Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {filteredData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-muted/40 transition duration-150">
                      <td className="px-4 py-2">
                        <div className="flex items-center justify-center gap-2">
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
                        {item.productName}
                      </td>
                      <td className="px-4 py-2 font-mono font-semibold text-muted-foreground text-right text-[11px]">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-2 font-mono font-semibold text-muted-foreground text-right text-[11px]">
                        {item.unitPrice}
                      </td>
                      <td className="px-4 py-2 font-mono font-bold text-foreground text-right text-[11px]">
                        {item.totalPrice}
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-muted-foreground text-sm font-semibold">
                        No data available in table
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-border/50 bg-muted/10 text-xs text-muted-foreground font-semibold flex justify-between items-center">
              <span>Showing 1 to {filteredData.length} of {stock.length} entries</span>
            </div>
            
          </div>
        </div>
      </main>

      {/* CREATE MULTIPLE PRODUCT MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-5xl rounded-2xl shadow-2xl border border-border/50 overflow-hidden flex flex-col h-[90vh] md:h-auto md:max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-border/40 bg-muted/10 shrink-0">
              <div>
                <h2 className="text-lg font-black text-foreground">Opening Stock Add</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Record new initial balances for your yarn inventory.</p>
              </div>
              <button onClick={closeFormModal} className="text-muted-foreground hover:bg-muted hover:text-foreground p-1.5 rounded-full transition">
                <X className="size-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Top Section */}
              <div className="w-56 space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground tracking-wider uppercase">Stock Date</label>
                <div className="relative">
                  <input 
                    type="date" 
                    className="w-full pl-3 pr-10 py-2.5 bg-muted/20 border border-border/60 hover:border-border focus:bg-background rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                    value={stockDate}
                    onChange={e => setStockDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Product Details Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Package className="size-4 text-primary" />
                    Product Details
                  </h3>
                </div>
                
                <div className="border border-border/60 rounded-xl overflow-hidden bg-background">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-muted/30 border-b border-border/60 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                          <th className="py-3 pl-4 pr-2 w-10 text-center">#</th>
                          <th className="py-3 px-3 min-w-[280px]">Product Name</th>
                          <th className="py-3 px-3 w-40">Quantity</th>
                          <th className="py-3 px-3 w-40">Unit Price</th>
                          <th className="py-3 px-3 w-48">Total Price</th>
                          <th className="py-3 pr-4 pl-2 w-12 text-center"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {productRows.map((row, index) => (
                          <tr key={index} className="group hover:bg-muted/10 transition-colors">
                            <td className="py-3 pl-4 pr-2 text-center text-xs font-mono text-muted-foreground">
                              {index + 1}
                            </td>
                            <td className="py-3 px-3">
                              <input 
                                type="text" 
                                placeholder="Enter product name..."
                                className="w-full px-3 py-2 bg-muted/20 border border-border/50 rounded-md text-sm font-medium focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/60"
                                value={row.productName || ""}
                                onChange={e => handleRowChange(index, 'productName', e.target.value)}
                              />
                            </td>
                            <td className="py-3 px-3">
                              <input 
                                type="number" 
                                placeholder="0"
                                className="w-full px-3 py-2 bg-muted/20 border border-border/50 rounded-md text-sm font-mono focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/60"
                                value={row.quantity || ""}
                                onChange={e => handleRowChange(index, 'quantity', e.target.value)}
                              />
                            </td>
                            <td className="py-3 px-3">
                              <input 
                                type="number" 
                                placeholder="0.00"
                                className="w-full px-3 py-2 bg-muted/20 border border-border/50 rounded-md text-sm font-mono focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/60"
                                value={row.unitPrice || ""}
                                onChange={e => handleRowChange(index, 'unitPrice', e.target.value)}
                              />
                            </td>
                            <td className="py-3 px-3">
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">৳</span>
                                <input 
                                  type="text" 
                                  readOnly
                                  placeholder="0.00"
                                  className="w-full pl-7 pr-3 py-2 bg-muted/50 border border-transparent rounded-md text-sm font-mono font-bold text-foreground focus:outline-none cursor-default"
                                  value={row.totalPrice || ""}
                                />
                              </div>
                            </td>
                            <td className="py-3 pr-4 pl-2 text-center">
                              <button 
                                onClick={() => handleRemoveRow(index)}
                                disabled={productRows.length === 1}
                                className="size-8 rounded-md bg-transparent text-muted-foreground/50 hover:text-red-500 hover:bg-red-50 border border-transparent inline-flex items-center justify-center transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground/50 disabled:cursor-not-allowed"
                                title="Remove Product"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Add Row Button inside the table container */}
                  <div className="p-3 border-t border-border/60 bg-muted/10">
                    <button 
                      onClick={handleAddRow}
                      className="w-full py-2.5 bg-background hover:bg-muted text-muted-foreground hover:text-foreground font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 border border-dashed border-border hover:border-primary/50"
                    >
                      <Plus className="size-4" />
                      Add Another Product Line
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-border/40 bg-muted/10 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setProductRows([{ productName: "", quantity: "", unitPrice: "", totalPrice: "" }])}
                className="px-6 py-2.5 text-sm font-bold text-muted-foreground bg-background border border-border hover:bg-muted rounded-lg transition shadow-sm"
              >
                Reset Fields
              </button>
              <button 
                onClick={handleSaveForm}
                className="px-6 py-2.5 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-sm transition-all flex items-center gap-2"
              >
                Save Stock Entries
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
