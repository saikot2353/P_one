import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import { Package, Plus, Trash2, ArrowRight, ChevronDown, Calendar } from "lucide-react";

export const Route = createFileRoute("/inv-receive-direct")({
  component: InvReceiveDirectPage,
});

type ReceiveProductData = {
  id: string;
  productName: string;
  uom: string;
  availableQuantity: string;
  quantity: string;
  specifications: string;
  unitPrice: string;
  totalPrice: string;
};

function InvReceiveDirectPage() {
  // Form State
  const [mrrType, setMrrType] = useState("Receive Regular");
  const [mrrDate, setMrrDate] = useState(new Date().toISOString().slice(0, 10));
  const [mrrNo, setMrrNo] = useState("");
  const [lcNo, setLcNo] = useState("");
  const [lcDate, setLcDate] = useState("");
  const [piNo, setPiNo] = useState("");
  const [piDate, setPiDate] = useState("");
  const [challanNo, setChallanNo] = useState("");
  const [challanDate, setChallanDate] = useState("");
  const [supplierName, setSupplierName] = useState("M.B. Trade Corporation");
  const [billNo, setBillNo] = useState("");
  const [billDate, setBillDate] = useState("");
  const [remarks, setRemarks] = useState("");

  // Product Table State
  const [products, setProducts] = useState<ReceiveProductData[]>([]);
  
  // New Product Entry State
  const [newProductName, setNewProductName] = useState("");
  const [newSpecifications, setNewSpecifications] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newUnitPrice, setNewUnitPrice] = useState("");
  
  // Auto-calculated total price for new entry
  const newTotalPrice = (parseFloat(newQuantity || "0") * parseFloat(newUnitPrice || "0")).toFixed(2);

  const handleAddProduct = () => {
    if (!newProductName || !newQuantity) return;
    
    const newProduct: ReceiveProductData = {
      id: Math.random().toString(36).substring(7),
      productName: newProductName,
      uom: "Pcs", // Mock default
      availableQuantity: "150", // Mock available quantity
      quantity: newQuantity,
      specifications: newSpecifications,
      unitPrice: newUnitPrice || "0.00",
      totalPrice: newTotalPrice,
    };

    setProducts([...products, newProduct]);
    
    // Reset entry fields
    setNewProductName("");
    setNewSpecifications("");
    setNewQuantity("");
    setNewUnitPrice("");
  };

  const handleRemoveProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <InventorySidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <InventoryTopbar />
        
        <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-border/40">
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
                <Package className="size-6 text-primary" />
                Direct Receive
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Receive materials directly into the store without MRR process.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            
            {/* Top Row - Logical Grouping */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column: General Information */}
              <div className="bg-card border border-border/50 rounded-lg shadow-sm flex flex-col">
                <div className="px-5 py-3.5 border-b border-border/50 bg-muted/10">
                  <h2 className="text-[11px] font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <div className="size-2 bg-blue-500 rounded-full"></div>
                    General Information
                  </h2>
                </div>
                <div className="p-6 flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="relative group sm:col-span-2">
                      <label className="block text-[10.5px] font-semibold text-muted-foreground/80 mb-1.5">Supplier Name</label>
                      <select 
                        className="w-full bg-background border border-border/60 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded px-2.5 py-1.5 text-[10.5px] font-medium text-foreground transition-all outline-none shadow-sm appearance-none cursor-pointer"
                        value={supplierName}
                        onChange={(e) => setSupplierName(e.target.value)}
                      >
                        <option value="">Select Supplier...</option>
                        <option value="M.B. Trade Corporation">M.B. Trade Corporation</option>
                        <option value="Rahman Fabrics">Rahman Fabrics</option>
                        <option value="Global Accessories Ltd">Global Accessories Ltd</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/70 pointer-events-none" />
                    </div>

                    <div className="relative group">
                      <label className="block text-[10.5px] font-semibold text-muted-foreground/80 mb-1.5">MRR Type</label>
                      <select 
                        className="w-full bg-background border border-border/60 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded px-2.5 py-1.5 text-[10.5px] font-medium text-foreground transition-all outline-none shadow-sm appearance-none cursor-pointer"
                        value={mrrType}
                        onChange={(e) => setMrrType(e.target.value)}
                      >
                        <option value="Receive Regular">Receive Regular</option>
                        <option value="Receive Without PO">Receive Without PO</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/70 pointer-events-none" />
                    </div>
                    
                    <div className="relative group">
                      <label className="block text-[10.5px] font-semibold text-muted-foreground/80 mb-1.5">MRR Date</label>
                      <div className="relative">
                        <input 
                          type="date" 
                          className="w-full bg-background border border-border/60 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded px-2.5 py-1.5 text-[10.5px] font-medium text-foreground transition-all outline-none shadow-sm [&::-webkit-calendar-picker-indicator]:opacity-0 relative z-10"
                          value={mrrDate}
                          onChange={(e) => setMrrDate(e.target.value)}
                        />
                        <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/70 pointer-events-none z-0" />
                      </div>
                    </div>
                    
                    <div className="relative group">
                      <label className="block text-[10.5px] font-semibold text-muted-foreground/80 mb-1.5">MRR No</label>
                      <input 
                        type="text" 
                        className="w-full bg-muted/30 border border-border/40 rounded px-2.5 py-1.5 text-[10.5px] font-medium text-muted-foreground focus:outline-none cursor-not-allowed shadow-sm"
                        value={mrrNo}
                        readOnly
                        placeholder="Auto Generated"
                      />
                    </div>

                    <div className="relative group">
                      <label className="block text-[10.5px] font-semibold text-muted-foreground/80 mb-1.5">Remarks</label>
                      <input 
                        type="text" 
                        className="w-full bg-background border border-border/60 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded px-2.5 py-1.5 text-[10.5px] font-medium text-foreground transition-all outline-none shadow-sm"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Enter remarks..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Reference Documents */}
              <div className="bg-card border border-border/50 rounded-lg shadow-sm flex flex-col">
                <div className="px-5 py-3.5 border-b border-border/50 bg-muted/10">
                  <h2 className="text-[11px] font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <div className="size-2 bg-amber-500 rounded-full"></div>
                    Reference Documents
                  </h2>
                </div>
                <div className="p-6 flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                    
                    <div className="relative group">
                      <label className="block text-[10.5px] font-semibold text-muted-foreground/80 mb-1.5">Challan No</label>
                      <input 
                        type="text" 
                        className="w-full bg-background border border-border/60 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded px-2.5 py-1.5 text-[10.5px] font-medium text-foreground transition-all outline-none shadow-sm"
                        value={challanNo}
                        onChange={(e) => setChallanNo(e.target.value)}
                        placeholder="Enter Challan No"
                      />
                    </div>

                    <div className="relative group">
                      <label className="block text-[10.5px] font-semibold text-muted-foreground/80 mb-1.5">Challan Date</label>
                      <div className="relative">
                        <input 
                          type="date" 
                          className="w-full bg-background border border-border/60 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded px-2.5 py-1.5 text-[10.5px] font-medium text-foreground transition-all outline-none shadow-sm [&::-webkit-calendar-picker-indicator]:opacity-0 relative z-10"
                          value={challanDate}
                          onChange={(e) => setChallanDate(e.target.value)}
                        />
                        <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/70 pointer-events-none z-0" />
                      </div>
                    </div>

                    <div className="relative group">
                      <label className="block text-[10.5px] font-semibold text-muted-foreground/80 mb-1.5">Bill No</label>
                      <input 
                        type="text" 
                        className="w-full bg-background border border-border/60 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded px-2.5 py-1.5 text-[10.5px] font-medium text-foreground transition-all outline-none shadow-sm"
                        value={billNo}
                        onChange={(e) => setBillNo(e.target.value)}
                        placeholder="Enter Bill No"
                      />
                    </div>

                    <div className="relative group">
                      <label className="block text-[10.5px] font-semibold text-muted-foreground/80 mb-1.5">Bill Date</label>
                      <div className="relative">
                        <input 
                          type="date" 
                          className="w-full bg-background border border-border/60 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded px-2.5 py-1.5 text-[10.5px] font-medium text-foreground transition-all outline-none shadow-sm [&::-webkit-calendar-picker-indicator]:opacity-0 relative z-10"
                          value={billDate}
                          onChange={(e) => setBillDate(e.target.value)}
                        />
                        <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/70 pointer-events-none z-0" />
                      </div>
                    </div>

                    <div className="relative group">
                      <label className="block text-[10.5px] font-semibold text-muted-foreground/80 mb-1.5">LC No</label>
                      <input 
                        type="text" 
                        className="w-full bg-background border border-border/60 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded px-2.5 py-1.5 text-[10.5px] font-medium text-foreground transition-all outline-none shadow-sm"
                        value={lcNo}
                        onChange={(e) => setLcNo(e.target.value)}
                        placeholder="Enter LC No"
                      />
                    </div>

                    <div className="relative group">
                      <label className="block text-[10.5px] font-semibold text-muted-foreground/80 mb-1.5">LC Date</label>
                      <div className="relative">
                        <input 
                          type="date" 
                          className="w-full bg-background border border-border/60 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded px-2.5 py-1.5 text-[10.5px] font-medium text-foreground transition-all outline-none shadow-sm [&::-webkit-calendar-picker-indicator]:opacity-0 relative z-10"
                          value={lcDate}
                          onChange={(e) => setLcDate(e.target.value)}
                        />
                        <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/70 pointer-events-none z-0" />
                      </div>
                    </div>

                    <div className="relative group">
                      <label className="block text-[10.5px] font-semibold text-muted-foreground/80 mb-1.5">PI No</label>
                      <input 
                        type="text" 
                        className="w-full bg-background border border-border/60 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded px-2.5 py-1.5 text-[10.5px] font-medium text-foreground transition-all outline-none shadow-sm"
                        value={piNo}
                        onChange={(e) => setPiNo(e.target.value)}
                        placeholder="Enter PI No"
                      />
                    </div>
                    
                    <div className="relative group">
                      <label className="block text-[10.5px] font-semibold text-muted-foreground/80 mb-1.5">PI Date</label>
                      <div className="relative">
                        <input 
                          type="date" 
                          className="w-full bg-background border border-border/60 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded px-2.5 py-1.5 text-[10.5px] font-medium text-foreground transition-all outline-none shadow-sm [&::-webkit-calendar-picker-indicator]:opacity-0 relative z-10"
                          value={piDate}
                          onChange={(e) => setPiDate(e.target.value)}
                        />
                        <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/70 pointer-events-none z-0" />
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section - Product Table */}
            <div className="bg-card border border-border/50 rounded-lg shadow-sm overflow-hidden flex flex-col">
              <div className="px-5 py-3.5 border-b border-border/50 bg-muted/10">
                <h2 className="text-[11px] font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <div className="size-2 bg-green-500 rounded-full"></div>
                  Product Details
                </h2>
              </div>
              
              <div className="p-6">
                
                {/* Entry Form */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-6 pb-6 mb-6 border-b border-border/50">
                  <div className="md:col-span-3 relative group">
                    <label className="block text-[10.5px] font-semibold text-muted-foreground/80 mb-1.5">Product Name</label>
                    <input 
                      type="text"
                      className="w-full bg-background border border-border/60 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded px-2.5 py-1.5 text-[10.5px] font-medium text-foreground transition-all outline-none shadow-sm"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      placeholder="Enter product..."
                    />
                  </div>
                  <div className="md:col-span-3 relative group">
                    <label className="block text-[10.5px] font-semibold text-muted-foreground/80 mb-1.5">Specifications</label>
                    <input 
                      type="text"
                      className="w-full bg-background border border-border/60 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded px-2.5 py-1.5 text-[10.5px] font-medium text-foreground transition-all outline-none shadow-sm"
                      value={newSpecifications}
                      onChange={(e) => setNewSpecifications(e.target.value)}
                      placeholder="Details..."
                    />
                  </div>
                  <div className="md:col-span-2 relative group">
                    <label className="block text-[10.5px] font-semibold text-muted-foreground/80 mb-1.5">Quantity</label>
                    <input 
                      type="number"
                      className="w-full bg-background border border-border/60 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded px-2.5 py-1.5 text-[10.5px] font-medium text-foreground transition-all outline-none shadow-sm"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="md:col-span-2 relative group">
                    <label className="block text-[10.5px] font-semibold text-muted-foreground/80 mb-1.5">Unit Price</label>
                    <input 
                      type="number"
                      className="w-full bg-background border border-border/60 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded px-2.5 py-1.5 text-[10.5px] font-medium text-foreground transition-all outline-none shadow-sm"
                      value={newUnitPrice}
                      onChange={(e) => setNewUnitPrice(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="md:col-span-2 relative group">
                    <label className="block text-[10.5px] font-semibold text-muted-foreground/80 mb-1.5">Total Price</label>
                    <input 
                      type="text"
                      readOnly
                      className="w-full bg-muted/30 border border-border/40 rounded px-2.5 py-1.5 text-[10.5px] font-bold text-muted-foreground focus:outline-none cursor-not-allowed shadow-sm"
                      value={newTotalPrice === "0.00" ? "" : newTotalPrice}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="md:col-span-12 flex justify-end">
                    <button 
                      onClick={handleAddProduct}
                      className="px-8 py-2 bg-[#1F8CF5] hover:bg-blue-600 text-white font-bold text-[10.5px] tracking-widest rounded transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!newProductName || !newQuantity}
                    >
                      <Plus className="size-3" strokeWidth={3} />
                      ADD TO LIST
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="border border-border/50 rounded-lg overflow-hidden bg-background">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border/60 text-[10.5px] font-semibold text-foreground/70 bg-muted/20">
                          <th className="py-2.5 px-4 w-12 font-semibold text-center">SL</th>
                          <th className="py-2.5 px-4 font-semibold">Product Name</th>
                          <th className="py-2.5 px-4 w-20 font-semibold">Uom</th>
                          <th className="py-2.5 px-4 w-32 font-semibold">Available Qty</th>
                          <th className="py-2.5 px-4 w-28 font-semibold">Quantity</th>
                          <th className="py-2.5 px-4 font-semibold">Specifications</th>
                          <th className="py-2.5 px-4 w-28 text-right font-semibold">Unit Price</th>
                          <th className="py-2.5 px-4 w-32 text-right font-semibold">Total Price</th>
                          <th className="py-2.5 px-4 w-12 text-center font-semibold"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40 text-[10.5px]">
                        {products.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="py-12 text-center text-muted-foreground/60 text-[10.5px] italic">
                              No products added yet. Start by entering product details above.
                            </td>
                          </tr>
                        ) : (
                          products.map((product, index) => (
                            <tr key={product.id} className="hover:bg-muted/30 transition-colors group">
                              <td className="py-2.5 px-4 text-muted-foreground font-mono text-center">{index + 1}</td>
                              <td className="py-2.5 px-4 font-semibold text-foreground">{product.productName}</td>
                              <td className="py-2.5 px-4 text-muted-foreground">{product.uom}</td>
                              <td className="py-2.5 px-4 text-muted-foreground font-mono">{product.availableQuantity}</td>
                              <td className="py-2.5 px-4 font-mono font-medium">{product.quantity}</td>
                              <td className="py-2.5 px-4 text-muted-foreground">{product.specifications || "-"}</td>
                              <td className="py-2.5 px-4 text-right font-mono text-muted-foreground">{product.unitPrice}</td>
                              <td className="py-2.5 px-4 text-right font-mono font-bold text-foreground">{product.totalPrice}</td>
                              <td className="py-2.5 px-4 text-center">
                                <button 
                                  onClick={() => handleRemoveProduct(product.id)}
                                  className="text-muted-foreground/40 hover:text-rose-500 transition-colors"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Page Footer Action */}
            <div className="flex justify-end pt-4 pb-10">
              <button className="px-12 py-3 bg-[#1F8CF5] hover:bg-blue-600 text-white font-bold text-[10.5px] tracking-widest rounded transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                SUBMIT DIRECT RECEIVE
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
