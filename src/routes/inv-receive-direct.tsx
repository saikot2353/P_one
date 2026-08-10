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


// ─── Smart UI Components ──────────────────────────────────────────────────

function SmartInput({ label, value, onChange, placeholder, type = "text", readOnly = false }: any) {
  return (
    <div className="flex flex-col gap-1.5 relative group">
      <label className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-0.5">
        {label}
      </label>
      <div className="relative">
        <input 
          type={type}
          readOnly={readOnly}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-lg px-3 py-2 text-[10.5px] font-semibold text-foreground transition-all duration-200 outline-none shadow-sm shadow-black/[0.02] ${
            readOnly 
              ? "bg-slate-50 border border-slate-200/50 text-slate-400 cursor-not-allowed" 
              : "bg-slate-100 border border-slate-200 hover:border-blue-400 hover:bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          } ${type === 'date' ? '[&::-webkit-calendar-picker-indicator]:opacity-0 relative z-10' : ''}`}
        />
        {type === 'date' && (
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none z-0" />
        )}
      </div>
    </div>
  )
}

function SmartSelect({ label, value, onChange, options, defaultOption }: any) {
  return (
    <div className="flex flex-col gap-1.5 relative group">
      <label className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-0.5">
        {label}
      </label>
      <div className="relative">
        <select 
          value={value}
          onChange={onChange}
          className="w-full rounded-lg bg-slate-100 border border-slate-200 hover:border-blue-400 hover:bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 px-3 py-2 text-[10.5px] font-semibold text-foreground transition-all duration-200 outline-none appearance-none cursor-pointer shadow-sm shadow-black/[0.02]"
        >
          {defaultOption && <option value="">{defaultOption}</option>}
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
      </div>
    </div>
  )
}

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
                    <div className="sm:col-span-2">
                      <SmartSelect 
                        label="Supplier Name" 
                        value={supplierName} 
                        onChange={(e: any) => setSupplierName(e.target.value)} 
                        defaultOption="Select Supplier..."
                        options={[
                          {value: "M.B. Trade Corporation", label: "M.B. Trade Corporation"},
                          {value: "Rahman Fabrics", label: "Rahman Fabrics"},
                          {value: "Global Accessories Ltd", label: "Global Accessories Ltd"},
                        ]} 
                      />
                    </div>
                    <SmartSelect 
                      label="MRR Type" 
                      value={mrrType} 
                      onChange={(e: any) => setMrrType(e.target.value)} 
                      options={[
                        {value: "Receive Regular", label: "Receive Regular"},
                        {value: "Receive Without PO", label: "Receive Without PO"},
                      ]} 
                    />
                    <SmartInput label="MRR Date" type="date" value={mrrDate} onChange={(e: any) => setMrrDate(e.target.value)} />
                    <SmartInput label="MRR No" value={mrrNo} readOnly={true} placeholder="Auto Generated" />
                    <SmartInput label="Remarks" value={remarks} onChange={(e: any) => setRemarks(e.target.value)} placeholder="Enter remarks..." />
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
                    <SmartInput label="Challan No" value={challanNo} onChange={(e: any) => setChallanNo(e.target.value)} placeholder="Enter Challan No" />
                    <SmartInput label="Challan Date" type="date" value={challanDate} onChange={(e: any) => setChallanDate(e.target.value)} />
                    
                    <SmartInput label="Bill No" value={billNo} onChange={(e: any) => setBillNo(e.target.value)} placeholder="Enter Bill No" />
                    <SmartInput label="Bill Date" type="date" value={billDate} onChange={(e: any) => setBillDate(e.target.value)} />
                    
                    <SmartInput label="LC No" value={lcNo} onChange={(e: any) => setLcNo(e.target.value)} placeholder="Enter LC No" />
                    <SmartInput label="LC Date" type="date" value={lcDate} onChange={(e: any) => setLcDate(e.target.value)} />
                    
                    <SmartInput label="PI No" value={piNo} onChange={(e: any) => setPiNo(e.target.value)} placeholder="Enter PI No" />
                    <SmartInput label="PI Date" type="date" value={piDate} onChange={(e: any) => setPiDate(e.target.value)} />
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
                  <div className="md:col-span-3">
                    <SmartInput label="Product Name" value={newProductName} onChange={(e: any) => setNewProductName(e.target.value)} placeholder="Enter product..." />
                  </div>
                  <div className="md:col-span-3">
                    <SmartInput label="Specifications" value={newSpecifications} onChange={(e: any) => setNewSpecifications(e.target.value)} placeholder="Details..." />
                  </div>
                  <div className="md:col-span-2">
                    <SmartInput label="Quantity" type="number" value={newQuantity} onChange={(e: any) => setNewQuantity(e.target.value)} placeholder="0" />
                  </div>
                  <div className="md:col-span-2">
                    <SmartInput label="Unit Price" type="number" value={newUnitPrice} onChange={(e: any) => setNewUnitPrice(e.target.value)} placeholder="0.00" />
                  </div>
                  <div className="md:col-span-2">
                    <SmartInput label="Total Price" value={newTotalPrice === "0.00" ? "" : newTotalPrice} readOnly={true} placeholder="0.00" />
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
