import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import { Printer, FileSpreadsheet, Search, Filter, ChevronDown, Calendar, X, FileText, CheckCircle2, ListTodo, ArrowLeft, ChevronRight, Bell } from "lucide-react";
import pakizaLogo from "@/components/Pakiza-Software-bgless-e1692258364537.webp";


export const Route = createFileRoute("/inv-issue-mrr-return")({
  component: InvMrrReturnIssuePage,
});

type MrrRecord = {
  id: string;
  mrr: string;
  mrrDate: string;
  supplier: string;
  challan: string;
  chDate: string;
  billNo: string;
  remark: string;
};

const mockData: MrrRecord[] = [
  { id: "1", mrr: "592", mrrDate: "10/08/2026", supplier: "UNKNOWN", challan: "00", chDate: "10/08/2026", billNo: "00", remark: "ok" },
  { id: "2", mrr: "591", mrrDate: "09/08/2026", supplier: "B. BARIA BELT GALLERY", challan: "014", chDate: "20/07/2026", billNo: "", remark: "" },
];

// ─── Smart UI Components ──────────────────────────────────────────────────

function SmartInput({ label, value, onChange, placeholder, type = "text", readOnly = false, icon: Icon, disabled = false }: any) {
  return (
    <div className="flex flex-col gap-1.5 relative group">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">
        {label}
      </label>
      <div className="relative">
        <input 
          type={type}
          readOnly={readOnly}
          disabled={disabled}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full h-[36px] rounded-lg px-3 text-[11px] font-medium transition-all duration-200 outline-none ${
            readOnly || disabled
              ? "bg-slate-50 text-slate-400 cursor-not-allowed border border-transparent" 
              : "bg-slate-100/80 hover:bg-slate-200/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border focus:border-blue-500/30 text-slate-700 placeholder:text-slate-400 border border-transparent"
          } ${type === 'date' ? '[&::-webkit-calendar-picker-indicator]:opacity-0 relative z-10' : ''} ${Icon ? 'pl-8' : ''}`}
        />
        {type === 'date' && (
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none z-0" />
        )}
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none z-10" />
        )}
      </div>
    </div>
  )
}

function SmartSelect({ label, value, onChange, options, defaultOption, icon: Icon, disabled = false }: any) {
  return (
    <div className="flex flex-col gap-1.5 relative group">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">
        {label}
      </label>
      <div className="relative">
        <select 
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full h-[36px] rounded-lg px-3 text-[11px] font-medium transition-all duration-200 outline-none appearance-none ${
            disabled
              ? "bg-slate-50 text-slate-400 cursor-not-allowed border border-transparent" 
              : "bg-slate-100/80 hover:bg-slate-200/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border focus:border-blue-500/30 text-slate-700 cursor-pointer border border-transparent"
          } ${Icon ? 'pl-8' : ''}`}
        >
          {defaultOption && <option value="" disabled>{defaultOption}</option>}
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 size-3.5 ${disabled ? 'text-slate-300' : 'text-slate-400'} pointer-events-none`} />
        {Icon && (
          <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 size-3.5 ${disabled ? 'text-slate-300' : 'text-slate-400'} pointer-events-none z-10`} />
        )}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────

function InvMrrReturnIssuePage() {
  const [dateFrom, setDateFrom] = useState("2026-08-03");
  const [dateTo, setDateTo] = useState("2026-08-10");
  const [supplier, setSupplier] = useState("All");
  const [mrrNumbers, setMrrNumbers] = useState("");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  
  // Modal states
  const [printIssue, setPrintIssue] = useState<MrrRecord | null>(null);
  const [returnIssue, setReturnIssue] = useState<MrrRecord | null>(null);
  
  const [returnDate, setReturnDate] = useState("2026-08-10");
  const [gatePass, setGatePass] = useState("");
  const [returnChallan, setReturnChallan] = useState("");
  const [comment, setComment] = useState("");
  const [returnQtys, setReturnQtys] = useState<Record<string, string>>({});

  const filteredData = mockData.filter(row => 
    Object.values(row).some(val => val.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleReturnQtyChange = (id: string, value: string) => {
    setReturnQtys(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-foreground">
      <InventorySidebar />
      <main className="flex-1 min-w-0 flex flex-col relative pb-20">
        <InventoryTopbar />
        
        <div className="p-4 md:p-6 space-y-6 w-full max-w-[1400px] mx-auto mt-4">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-200/60">
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-800 flex items-center gap-2">
                <FileText className="size-6 text-emerald-500" />
                MRR Return Issue
              </h1>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-medium">
                Manage Material Receiving & Inspection Report Returns
              </p>
            </div>
          </div>

          {/* Filter Section Accordion */}
          <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-200/60 overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
            
            <button 
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors border-b border-slate-100 focus:outline-none"
            >
              <div className="flex items-center gap-2.5">
                <Filter className="size-4 text-amber-500" />
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Filter Options</span>
              </div>
              <ChevronDown className={`size-4 text-slate-400 transition-transform duration-300 ${isFiltersOpen ? "rotate-180" : ""}`} />
            </button>
            
            <div className={`transition-all duration-300 ease-in-out ${isFiltersOpen ? "opacity-100 max-h-[1000px]" : "opacity-0 max-h-0 overflow-hidden"}`}>
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-6 items-end">
                  
                  <div className="md:col-span-2">
                    <SmartInput label="MRR DATE FROM" type="date" value={dateFrom} onChange={(e: any) => setDateFrom(e.target.value)} />
                  </div>
                  
                  <div className="md:col-span-2">
                    <SmartInput label="MRR DATE TO" type="date" value={dateTo} onChange={(e: any) => setDateTo(e.target.value)} />
                  </div>
                  
                  <div className="md:col-span-3">
                    <SmartSelect 
                      label="SUPPLIER NAME" 
                      value={supplier} 
                      onChange={(e: any) => setSupplier(e.target.value)} 
                      options={[
                        {value: "All", label: "ALL SUPPLIER"},
                        {value: "UNKNOWN", label: "UNKNOWN"},
                        {value: "B. BARIA BELT GALLERY", label: "B. BARIA BELT GALLERY"},
                      ]} 
                    />
                  </div>
                  
                  <div className="md:col-span-3">
                    <SmartInput label="MRR NUMBERS (COMMA SEPARATED)" value={mrrNumbers} onChange={(e: any) => setMrrNumbers(e.target.value)} />
                  </div>

                  <div className="md:col-span-2 flex justify-end">
                    <button className="w-full h-[36px] bg-blue-500 hover:bg-blue-600 text-white font-bold text-[11px] tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm">
                      SEARCH
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-200/60 overflow-hidden relative">
            <div className="absolute left-0 top-4 bottom-4 w-1 bg-emerald-500 rounded-r-md"></div>
            
            {/* Table Toolbar */}
            <div className="p-6 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button className="flex items-center gap-1.5 h-[32px] px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold tracking-wider uppercase rounded-lg transition-colors shadow-sm">
                  <FileSpreadsheet className="size-3.5 text-emerald-600" />
                  EXCEL
                </button>
                <button className="flex items-center gap-1.5 h-[32px] px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold tracking-wider uppercase rounded-lg transition-colors shadow-sm">
                  <Printer className="size-3.5 text-slate-600" />
                  PRINT
                </button>
                <button className="flex items-center gap-1.5 h-[32px] px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold tracking-wider uppercase rounded-lg transition-colors shadow-sm">
                  <FileText className="size-3.5 text-red-500" />
                  PDF
                </button>
              </div>
              
              <div className="w-full sm:w-auto relative group">
                <div className="relative">
                  <input 
                    type="text"
                    className="w-full sm:w-64 h-[32px] rounded-lg bg-slate-100/80 border border-slate-200 hover:border-blue-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 pl-9 pr-3 text-[10.5px] font-semibold text-slate-700 transition-all duration-200 outline-none placeholder:text-slate-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search records..."
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none group-focus-within:text-blue-500 transition-colors" />
                </div>
              </div>
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto p-6 pt-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/50 text-[9.5px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">
                    <th className="py-3 px-4 w-24">ACTION</th>
                    <th className="py-3 px-4 w-28 text-center">MRR</th>
                    <th className="py-3 px-4 w-32 text-center">MRR DATE</th>
                    <th className="py-3 px-4">SUPPLIER</th>
                    <th className="py-3 px-4 w-28 text-center">CHALLAN</th>
                    <th className="py-3 px-4 w-32 text-center">CH DATE</th>
                    <th className="py-3 px-4 w-28 text-center">BILL NO</th>
                    <th className="py-3 px-4">REMARK</th>
                  </tr>
                </thead>
                <tbody className="text-[11px]">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        No records found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row) => (
                      <tr 
                        key={row.id} 
                        className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setPrintIssue(row)}
                              className="text-blue-500 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50"
                              title="Print Report"
                            >
                              <Printer className="size-4" strokeWidth={2.5} />
                            </button>
                            <button 
                              onClick={() => setReturnIssue(row)}
                              className="text-amber-500 hover:text-amber-600 transition-colors p-1 rounded hover:bg-amber-50"
                              title="Process MRR Return"
                            >
                              <ListTodo className="size-4" strokeWidth={2.5} />
                            </button>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-center font-bold text-slate-700">{row.mrr}</td>
                        <td className="py-2.5 px-4 text-center text-slate-600">{row.mrrDate}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-700">{row.supplier}</td>
                        <td className="py-2.5 px-4 text-center font-medium text-slate-600">{row.challan || "00"}</td>
                        <td className="py-2.5 px-4 text-center text-slate-600">{row.chDate}</td>
                        <td className="py-2.5 px-4 text-center text-slate-500">{row.billNo || "00"}</td>
                        <td className="py-2.5 px-4 text-slate-500">{row.remark}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Placeholder */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs text-slate-500 font-medium">
              <div>Showing {filteredData.length} of {mockData.length} entries</div>
              <div className="flex gap-1.5">
                <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-white hover:text-slate-800 transition-colors disabled:opacity-50">Previous</button>
                <button className="px-3 py-1.5 border border-slate-200 bg-emerald-500 text-white rounded-md font-bold shadow-sm">1</button>
                <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-white hover:text-slate-800 transition-colors disabled:opacity-50">Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Process Return Modal */}
      {returnIssue && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 backdrop-blur-sm overflow-y-auto p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white text-slate-800 w-full max-w-5xl rounded-xl shadow-2xl relative my-auto border border-slate-200 flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="h-14 bg-slate-50 border-b border-slate-200 flex items-center justify-between px-6">
              <div className="text-[13px] font-bold text-slate-800 tracking-wide flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                MRR Details - Process Return
              </div>
              <button 
                onClick={() => setReturnIssue(null)} 
                className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors text-slate-500"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 flex flex-col flex-1">
              
              {/* MRR Top Information */}
              <div className="rounded-xl border border-slate-200 overflow-hidden mb-6 bg-slate-50/50">
                <div className="grid grid-cols-3 divide-x divide-slate-200">
                  <div className="flex flex-col divide-y divide-slate-200">
                    <div className="flex px-4 py-2.5">
                      <span className="w-28 text-[9px] font-bold text-slate-500 uppercase tracking-widest">CHALLAN NO</span>
                      <span className="text-[11px] font-bold text-slate-800">{returnIssue.challan || "00"}</span>
                    </div>
                    <div className="flex px-4 py-2.5">
                      <span className="w-28 text-[9px] font-bold text-slate-500 uppercase tracking-widest">CHALLAN DATE</span>
                      <span className="text-[11px] font-bold text-slate-800">{returnIssue.chDate}</span>
                    </div>
                    <div className="flex px-4 py-2.5">
                      <span className="w-28 text-[9px] font-bold text-slate-500 uppercase tracking-widest">BILL NO</span>
                      <span className="text-[11px] font-bold text-slate-800">{returnIssue.billNo || "00"}</span>
                    </div>
                    <div className="flex px-4 py-2.5">
                      <span className="w-28 text-[9px] font-bold text-slate-500 uppercase tracking-widest">BILL DATE</span>
                      <span className="text-[11px] font-bold text-slate-800">{returnIssue.chDate}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col divide-y divide-slate-200">
                    <div className="flex px-4 py-2.5">
                      <span className="w-20 text-[9px] font-bold text-slate-500 uppercase tracking-widest">PO NO</span>
                      <span className="text-[11px] font-bold text-slate-800">PO/PSL/2026/000230</span>
                    </div>
                    <div className="flex px-4 py-2.5">
                      <span className="w-20 text-[9px] font-bold text-slate-500 uppercase tracking-widest">PO DATE</span>
                      <span className="text-[11px] font-bold text-slate-800">{returnIssue.mrrDate}</span>
                    </div>
                    <div className="flex px-4 py-2.5">
                      <span className="w-20 text-[9px] font-bold text-slate-500 uppercase tracking-widest">LC NO</span>
                      <span className="text-[11px] font-bold text-slate-800"></span>
                    </div>
                    <div className="flex px-4 py-2.5">
                      <span className="w-20 text-[9px] font-bold text-slate-500 uppercase tracking-widest">LC DATE</span>
                      <span className="text-[11px] font-bold text-slate-800"></span>
                    </div>
                  </div>

                  <div className="flex flex-col divide-y divide-slate-200">
                    <div className="flex px-4 py-2.5">
                      <span className="w-24 text-[9px] font-bold text-slate-500 uppercase tracking-widest">REVISION</span>
                      <span className="text-[11px] font-bold text-slate-800">00</span>
                    </div>
                    <div className="flex px-4 py-2.5 border-b-0 h-full">
                      <span className="w-24 text-[9px] font-bold text-slate-500 uppercase tracking-widest">SUPPLIER</span>
                      <span className="text-[11px] font-bold text-slate-800 leading-snug">{returnIssue.supplier}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="rounded-xl border border-slate-200 overflow-hidden mb-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-emerald-50/50 text-[9.5px] font-bold text-slate-600 uppercase tracking-widest border-b border-slate-200">
                      <th className="py-3 px-4 w-12 text-center">SL</th>
                      <th className="py-3 px-4">ITEM</th>
                      <th className="py-3 px-4">SPECIFICATION</th>
                      <th className="py-3 px-4 w-24">QUANTITY</th>
                      <th className="py-3 px-4 w-20 text-right">RATE</th>
                      <th className="py-3 px-4 w-24 text-center">REQ. NO</th>
                      <th className="py-3 px-4 w-20 text-center">STOCK</th>
                      <th className="py-3 px-4 w-24 text-center">RETURNED</th>
                      <th className="py-3 px-4 w-28 text-center bg-slate-50">NEW RETURN</th>
                    </tr>
                  </thead>
                  <tbody className="text-[11px]">
                    <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 text-center font-medium text-slate-400">1</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-700">Item: Gel Pen (Yellow)</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Cat.: General Stationary</div>
                      </td>
                      <td className="py-3 px-4 text-slate-500">Test Purpose.</td>
                      <td className="py-3 px-4 font-bold text-slate-700">3 (PCS)</td>
                      <td className="py-3 px-4 text-right text-slate-500"></td>
                      <td className="py-3 px-4 text-center text-slate-500"></td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-600">2</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-700">1</td>
                      <td className="py-3 px-4 text-center bg-slate-50/50">
                        <input 
                          type="number"
                          min="0"
                          value={returnQtys["item1"] || ""}
                          onChange={(e) => handleReturnQtyChange("item1", e.target.value)}
                          placeholder="0"
                          className="w-full h-[30px] rounded-md px-2 text-[11px] font-bold text-center border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
                        />
                      </td>
                    </tr>
                    <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 text-center font-medium text-slate-400">2</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-700">Item: Ball Pen Black</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Cat.: General Stationary</div>
                      </td>
                      <td className="py-3 px-4 text-slate-500">Test Purpose.</td>
                      <td className="py-3 px-4 font-bold text-slate-700">4 (PCS)</td>
                      <td className="py-3 px-4 text-right text-slate-500"></td>
                      <td className="py-3 px-4 text-center text-slate-500"></td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-600">52</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-700">0</td>
                      <td className="py-3 px-4 text-center bg-slate-50/50">
                        <input 
                          type="number"
                          min="0"
                          value={returnQtys["item2"] || ""}
                          onChange={(e) => handleReturnQtyChange("item2", e.target.value)}
                          placeholder="0"
                          className="w-full h-[30px] rounded-md px-2 text-[11px] font-bold text-center border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Form Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SmartInput 
                  label="RETURN DATE *" 
                  type="date" 
                  value={returnDate} 
                  onChange={(e: any) => setReturnDate(e.target.value)} 
                />
                <SmartInput 
                  label="GATE PASS NO" 
                  value={gatePass} 
                  onChange={(e: any) => setGatePass(e.target.value)} 
                />
                <SmartInput 
                  label="RETURN CHALLAN NO" 
                  value={returnChallan} 
                  onChange={(e: any) => setReturnChallan(e.target.value)} 
                />
                <div className="md:col-span-3">
                  <SmartInput 
                    label="COMMENT *" 
                    value={comment} 
                    onChange={(e: any) => setComment(e.target.value)} 
                    placeholder="Add comment..."
                  />
                </div>
              </div>

            </div>
            
            {/* Modal Footer */}
            <div className="h-16 bg-slate-50 border-t border-slate-200 flex items-center justify-between px-6 mt-auto">
              <button 
                onClick={() => setReturnIssue(null)}
                className="h-[36px] px-6 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-[11px] tracking-wider rounded-lg transition-colors"
              >
                CLOSE
              </button>
              <button 
                onClick={() => setReturnIssue(null)}
                className="h-[36px] px-8 bg-blue-500 hover:bg-blue-600 text-white font-bold text-[11px] tracking-wider rounded-lg transition-all shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 className="size-4" />
                SUBMIT
              </button>
            </div>
            
          </div>
        </div>
      )}


      {/* Print Preview Modal */}
      {printIssue && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white text-black w-full max-w-5xl rounded-sm shadow-2xl relative my-auto border border-gray-300">
            
            {/* Print action bar (not printable) */}
            <div className="absolute top-0 inset-x-0 h-12 bg-gray-100 border-b border-gray-300 flex items-center justify-between px-4 print:hidden rounded-t-sm z-10">
              <div className="text-sm font-bold text-gray-700">Print Preview</div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-sm flex items-center gap-1.5"
                >
                  <Printer className="size-3.5" />
                  Print Document
                </button>
                <button 
                  onClick={() => setPrintIssue(null)} 
                  className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Print Content */}
            <div className="p-8 sm:p-12 mt-12 print:mt-0 font-sans relative z-0">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <img src={pakizaLogo} alt="Pakiza Software" className="h-10 object-contain mb-2" />
                  <div className="text-[10px] text-slate-700 font-medium leading-snug max-w-xs space-y-0.5">
                    <p>Khan ABC Tradeplex House#37, Floor#11 (B-11), Road#2, Dhaka-1205</p>
                    <p>PSL/REC/STR/04</p>
                    <p>PSL/REC/STR/03</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <h2 className="text-[17px] text-slate-500 font-bold tracking-[0.15em] uppercase mb-4 mt-2">Receive Details</h2>
                  
                  <div className="inline-block border border-slate-400 text-[10px]">
                    <div className="flex border-b border-slate-400">
                      <div className="px-3 py-1 font-semibold w-24 text-right border-r border-slate-400 uppercase">MRR NO :</div>
                      <div className="px-3 py-1 font-semibold w-32 text-left">{printIssue.mrr}</div>
                    </div>
                    <div className="flex border-b border-slate-400">
                      <div className="px-3 py-1 font-semibold w-24 text-right border-r border-slate-400 uppercase">MRR DATE :</div>
                      <div className="px-3 py-1 font-semibold w-32 text-left">{printIssue.mrrDate}</div>
                    </div>
                    <div className="flex">
                      <div className="px-3 py-1 font-semibold w-24 text-right border-r border-slate-400">Revision :</div>
                      <div className="px-3 py-1 font-semibold w-32 text-left">00</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mb-6">
                <h1 className="text-[15px] font-bold underline decoration-slate-600 underline-offset-4 tracking-wide text-slate-700">
                  Material Receiving & Inspection Report (MRIR)
                </h1>
              </div>

              {/* Grid Details */}
              <table className="w-full text-[9px] border-collapse border-2 border-slate-500 mb-6 font-semibold text-slate-800">
                <tbody>
                  <tr className="border-b border-slate-500">
                    <td className="p-1.5 border-r border-slate-500 w-28 uppercase">CHALLAN NO</td>
                    <td className="p-1.5 border-r border-slate-500 w-32">{printIssue.challan || "00"}</td>
                    <td className="p-1.5 border-r border-slate-500 w-24 uppercase">PO/WO</td>
                    <td className="p-1.5 border-r border-slate-500 text-blue-500 font-bold">PO/PSL/2026/000230</td>
                    <td className="p-1.5 border-r border-slate-500 w-24 uppercase">SUPPLIER</td>
                    <td className="p-1.5 uppercase">{printIssue.supplier}</td>
                  </tr>
                  <tr className="border-b border-slate-500">
                    <td className="p-1.5 border-r border-slate-500 uppercase">CHALLAN DATE</td>
                    <td className="p-1.5 border-r border-slate-500">{printIssue.chDate}</td>
                    <td className="p-1.5 border-r border-slate-500 uppercase">PO/WO DATE</td>
                    <td className="p-1.5 border-r border-slate-500">{printIssue.mrrDate}</td>
                    <td className="p-1.5 border-r border-slate-500"></td>
                    <td className="p-1.5"></td>
                  </tr>
                  <tr className="border-b border-slate-500">
                    <td className="p-1.5 border-r border-slate-500 uppercase">BILL NO</td>
                    <td className="p-1.5 border-r border-slate-500">{printIssue.billNo || "00"}</td>
                    <td className="p-1.5 border-r border-slate-500 uppercase">LC NO</td>
                    <td className="p-1.5 border-r border-slate-500"></td>
                    <td className="p-1.5 border-r border-slate-500"></td>
                    <td className="p-1.5"></td>
                  </tr>
                  <tr>
                    <td className="p-1.5 border-r border-slate-500 uppercase">BILL DATE</td>
                    <td className="p-1.5 border-r border-slate-500">{printIssue.chDate}</td>
                    <td className="p-1.5 border-r border-slate-500 uppercase">LC DATE</td>
                    <td className="p-1.5 border-r border-slate-500"></td>
                    <td className="p-1.5 border-r border-slate-500"></td>
                    <td className="p-1.5"></td>
                  </tr>
                </tbody>
              </table>

              {/* Items Table */}
              <table className="w-full text-[9px] border-collapse border-2 border-slate-500 mb-6 font-semibold">
                <thead>
                  <tr className="bg-[#e4e4fc] border-b border-slate-500">
                    <th className="p-2 text-left border-r border-slate-500 w-10">SL</th>
                    <th className="p-2 text-left border-r border-slate-500">Item</th>
                    <th className="p-2 text-left border-r border-slate-500 w-[25%]">Specification</th>
                    <th className="p-2 text-left border-r border-slate-500 w-24">Quantity</th>
                    <th className="p-2 text-left w-24">Req. Number</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-400">
                    <td className="p-2 border-r border-slate-400">1</td>
                    <td className="p-2 border-r border-slate-400 leading-tight">
                      <div>Item: Gel Pen (Yellow)</div>
                      <div className="font-normal">Cat.: General Stationary</div>
                    </td>
                    <td className="p-2 border-r border-slate-400 font-normal">Test Purpose.</td>
                    <td className="p-2 border-r border-slate-400">3.00 (PCS)</td>
                    <td className="p-2"></td>
                  </tr>
                  <tr className="border-b border-slate-500">
                    <td className="p-2 border-r border-slate-400">2</td>
                    <td className="p-2 border-r border-slate-400 leading-tight">
                      <div>Item: Ball Pen Black</div>
                      <div className="font-normal">Cat.: General Stationary</div>
                    </td>
                    <td className="p-2 border-r border-slate-400 font-normal">Test Purpose.</td>
                    <td className="p-2 border-r border-slate-400">4.00 (PCS)</td>
                    <td className="p-2"></td>
                  </tr>
                </tbody>
              </table>

              {/* Totals Section */}
              <table className="w-full text-[9px] border-collapse border-2 border-slate-500 mb-6 font-semibold">
                <tbody>
                  <tr className="border-b border-slate-400">
                    <td className="p-1.5 text-right border-r border-slate-400">Total Quantity</td>
                    <td className="p-1.5 w-48 border-r border-slate-500">7</td>
                    <td className="p-1.5 text-right border-r border-slate-400">Total Amount</td>
                    <td className="p-1.5 w-32">0</td>
                  </tr>
                  <tr className="border-b border-slate-400">
                    <td colSpan={2} className="border-r border-slate-500"></td>
                    <td className="p-1.5 text-right border-r border-slate-400">Discount(-)</td>
                    <td className="p-1.5 w-32">0</td>
                  </tr>
                  <tr className="border-b border-slate-400">
                    <td colSpan={2} className="border-r border-slate-500"></td>
                    <td className="p-1.5 text-right border-r border-slate-400">VAT(+)</td>
                    <td className="p-1.5 w-32">0</td>
                  </tr>
                  <tr className="border-b border-slate-500">
                    <td colSpan={2} className="border-r border-slate-500"></td>
                    <td className="p-1.5 text-right border-r border-slate-400">TAX(+)</td>
                    <td className="p-1.5 w-32">0</td>
                  </tr>
                  <tr className="border-b border-slate-500 bg-[#f1f3f5]">
                    <td colSpan={2} className="border-r border-slate-500"></td>
                    <td className="p-1.5 text-right border-r border-slate-500">Grand Total</td>
                    <td className="p-1.5 w-32 text-[10px]">0</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 border-r border-slate-400 w-24">In word:</td>
                    <td colSpan={3} className="p-1.5 italic font-normal">Zero Only</td>
                  </tr>
                </tbody>
              </table>

              {/* Remarks Box */}
              <table className="w-full text-[10px] border-collapse border-2 border-slate-500 mb-16 font-semibold">
                <tbody>
                  <tr className="border-b border-slate-400">
                    <td className="p-1.5 border-r border-slate-400 w-48">Remarks (MCD)</td>
                    <td className="p-1.5 font-normal">{printIssue.remark}</td>
                  </tr>
                  <tr className="border-b border-slate-400">
                    <td className="p-1.5 border-r border-slate-400">Check Note (MCD)</td>
                    <td className="p-1.5 font-normal">{printIssue.remark}</td>
                  </tr>
                  <tr className="border-b border-slate-400">
                    <td className="p-1.5 border-r border-slate-400">Quality Note</td>
                    <td className="p-1.5 font-normal">{printIssue.remark}</td>
                  </tr>
                  <tr className="border-b border-slate-500">
                    <td className="p-1.5 border-r border-slate-400">Approve Note (MCD)</td>
                    <td className="p-1.5 font-normal">{printIssue.remark}</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 border-r border-slate-400">Remark (Procurement)</td>
                    <td className="p-1.5 font-normal"></td>
                  </tr>
                </tbody>
              </table>

              {/* Signatures */}
              <div className="grid grid-cols-6 gap-2 text-center text-[9px] font-semibold">
                <div className="flex flex-col items-center">
                  <div className="w-full border-b border-slate-400 border-dashed mb-1"></div>
                  <div>MCD Prepared By</div>
                  <div className="font-normal mt-1">Sohanur Rahman Sohan</div>
                  <div className="font-normal">Executive</div>
                  <div className="font-normal text-slate-500 mt-1">{printIssue.mrrDate}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-full border-b border-slate-400 border-dashed mb-1"></div>
                  <div>MCD Checked By</div>
                  <div className="font-normal mt-1">Sohanur Rahman Sohan</div>
                  <div className="font-normal">Executive</div>
                  <div className="font-normal text-slate-500 mt-1">{printIssue.mrrDate} 14:12:18</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-full border-b border-slate-400 border-dashed mb-1"></div>
                  <div>Quality Inspected By</div>
                  <div className="font-normal mt-1">Rajebul Hasan Rajon</div>
                  <div className="font-normal">Deputy Manager</div>
                  <div className="font-normal text-slate-500 mt-1">{printIssue.mrrDate} 15:03:01</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-full border-b border-slate-400 border-dashed mb-1"></div>
                  <div>MCD Approved By</div>
                  <div className="font-normal mt-1">Rajebul Hasan Rajon</div>
                  <div className="font-normal">Deputy Manager</div>
                  <div className="font-normal text-slate-500 mt-1">{printIssue.mrrDate} 15:03:09</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-full border-b border-slate-400 border-dashed mb-1"></div>
                  <div>Billing Info Inputed By</div>
                  <div className="font-normal mt-1">Rajebul Hasan Rajon</div>
                  <div className="font-normal">Deputy Manager</div>
                  <div className="font-normal text-slate-500 mt-1">{printIssue.mrrDate} 15:12:47</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-full border-b border-slate-400 border-dashed mb-1"></div>
                  <div>Billing Info Approved By</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
