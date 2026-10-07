import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import { Printer, FileSpreadsheet, FileText, FileDown, Search, X, Filter, ChevronDown, Calendar } from "lucide-react";
import pakizaLogo from "@/components/Pakiza-Software-bgless-e1692258364537.webp";


export const Route = createFileRoute("/inv-receive-list")({
  component: InvReceiveListPage,
});

type ReceiveRecord = {
  id: string;
  mrr: string;
  mrrDate: string;
  supplier: string;
  challan: string;
  chDate: string;
  billNo: string;
  remark: string;
};

const mockData: ReceiveRecord[] = [
  { id: "1", mrr: "592", mrrDate: "10/08/2026", supplier: "UNKNOWN", challan: "00", chDate: "10/08/2026", billNo: "00", remark: "ok" },
  { id: "2", mrr: "590", mrrDate: "27/07/2026", supplier: "Anisha Packaging Store", challan: "00", chDate: "16/07/2026", billNo: "00", remark: "" },
  { id: "3", mrr: "589", mrrDate: "27/07/2026", supplier: "Glass Tower", challan: "1934", chDate: "29/06/2026", billNo: "1934", remark: "" },
  { id: "4", mrr: "588", mrrDate: "27/07/2026", supplier: "Khayer Hardware & Electric", challan: "476", chDate: "22/06/2026", billNo: "476", remark: "" },
  { id: "5", mrr: "587", mrrDate: "27/07/2026", supplier: "Amin Law Book Publications", challan: "1470", chDate: "17/05/2026", billNo: "1470", remark: "" },
  { id: "6", mrr: "586", mrrDate: "27/07/2026", supplier: "Mac Computer's", challan: "00", chDate: "06/07/2026", billNo: "00", remark: "" },
  { id: "7", mrr: "585", mrrDate: "27/07/2026", supplier: "UNKNOWN", challan: "00", chDate: "28/06/2026", billNo: "00", remark: "" },
  { id: "8", mrr: "584", mrrDate: "27/07/2026", supplier: "UNKNOWN", challan: "00", chDate: "01/07/2026", billNo: "00", remark: "" },
  { id: "9", mrr: "583", mrrDate: "12/07/2026", supplier: "Noor Motors", challan: "1829", chDate: "19/05/2026", billNo: "1404", remark: "" },
];


// ─── Smart UI Components ──────────────────────────────────────────────────

function SmartInput({ label, value, onChange, placeholder, type = "text", readOnly = false, subLabel }: any) {
  return (
    <div className="flex flex-col gap-1.5 relative group">
      <label className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-0.5">
        {label} {subLabel && <span className="font-normal normal-case tracking-normal opacity-60 ml-1">{subLabel}</span>}
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

function InvReceiveListPage() {
  const [dateFrom, setDateFrom] = useState("2026-07-10");
  const [dateTo, setDateTo] = useState("2026-08-10");
  const [mrrType, setMrrType] = useState("Receive Regular");
  const [supplier, setSupplier] = useState("ALL SUPPLIER");
  const [product, setProduct] = useState("All Product");
  const [mrrNumbers, setMrrNumbers] = useState("");
  const [challanNumbers, setChallanNumbers] = useState("");
  const [sspReqNum, setSspReqNum] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  
  const [selectedMRR, setSelectedMRR] = useState<ReceiveRecord | null>(null);

  const filteredData = mockData.filter(row => 
    Object.values(row).some(val => val.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <InventorySidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <InventoryTopbar />
        
        <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-border/40">
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
                <FileText className="size-6 text-primary" />
                Receive List
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                View and manage your material receiving records and inspection reports.
              </p>
            </div>
          </div>

          {/* Filter Section */}
          <div className="bg-card border border-border/50 rounded-lg shadow-sm overflow-hidden">
            <div className="h-1 w-full bg-blue-500"></div>
            
            <button 
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="w-full px-6 py-4 flex items-center justify-between bg-muted/10 hover:bg-muted/30 transition-colors border-b border-border/40 focus:outline-none"
            >
              <div className="flex items-center gap-2.5">
                <Filter className="size-4 text-blue-500" />
                <span className="text-[11px] font-bold text-foreground uppercase tracking-wider">Filter Options</span>
              </div>
              <ChevronDown className={`size-4 text-muted-foreground transition-transform duration-300 ${isFiltersOpen ? "rotate-180" : ""}`} />
            </button>
            
            <div className={`transition-all duration-300 ease-in-out ${isFiltersOpen ? "opacity-100 max-h-[2000px]" : "opacity-0 max-h-0 overflow-hidden"}`}>
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-8">
                
                <SmartInput label="MRR Date From" type="date" value={dateFrom} onChange={(e: any) => setDateFrom(e.target.value)} />
                <SmartInput label="MRR Date To" type="date" value={dateTo} onChange={(e: any) => setDateTo(e.target.value)} />
                
                <SmartSelect 
                  label="MRR Type" 
                  value={mrrType} 
                  onChange={(e: any) => setMrrType(e.target.value)} 
                  options={[
                    {value: "Receive Regular", label: "Receive Regular"},
                    {value: "Direct Receive", label: "Direct Receive"},
                  ]} 
                />
                
                <SmartSelect 
                  label="Supplier Name" 
                  value={supplier} 
                  onChange={(e: any) => setSupplier(e.target.value)} 
                  options={[
                    {value: "ALL SUPPLIER", label: "ALL SUPPLIER"},
                    {value: "M.B. Trade Corporation", label: "M.B. Trade Corporation"},
                  ]} 
                />

                <SmartSelect 
                  label="Product Name" 
                  value={product} 
                  onChange={(e: any) => setProduct(e.target.value)} 
                  options={[
                    {value: "All Product", label: "All Product"},
                    {value: "Yarn", label: "Yarn"},
                  ]} 
                />

                <SmartInput label="MRR Numbers" subLabel="(Comma Separator)" value={mrrNumbers} onChange={(e: any) => setMrrNumbers(e.target.value)} />
                <SmartInput label="Challan Numbers" subLabel="(Comma Separator)" value={challanNumbers} onChange={(e: any) => setChallanNumbers(e.target.value)} />
                <SmartInput label="SSP ReqNum" subLabel="(Comma Separator)" value={sspReqNum} onChange={(e: any) => setSspReqNum(e.target.value)} />
                
              </div>

              {/* Show Button */}
              <div className="mt-8 flex justify-end lg:justify-start lg:col-start-4">
                <button className="px-8 py-2.5 bg-[#1F8CF5] hover:bg-blue-600 text-white font-bold text-[10.5px] tracking-widest rounded transition-all shadow-sm hover:shadow flex items-center gap-2">
                  SHOW
                </button>
              </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-card border border-border/50 rounded-lg shadow-sm overflow-hidden">
            
            {/* Table Toolbar */}
            <div className="p-6 pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button className="flex items-center gap-2 px-3 py-1.5 border border-border hover:bg-muted text-foreground text-[10.5px] font-bold rounded transition-colors shadow-sm">
                  <FileSpreadsheet className="size-3.5 text-green-600" />
                  EXCEL
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-border hover:bg-muted text-foreground text-[10.5px] font-bold rounded transition-colors shadow-sm">
                  <Printer className="size-3.5 text-foreground/70" />
                  PRINT
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-border hover:bg-muted text-foreground text-[10.5px] font-bold rounded transition-colors shadow-sm">
                  <FileDown className="size-3.5 text-red-500" />
                  PDF
                </button>
              </div>
              
              <div className="w-full sm:w-auto relative group">
                <div className="relative">
                  <input 
                    type="text"
                    className="w-full sm:w-64 rounded-lg bg-slate-100 border border-slate-200 hover:border-blue-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 pl-9 pr-3 py-2 text-[10.5px] font-semibold text-foreground transition-all duration-200 outline-none shadow-sm shadow-black/[0.02]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search records..."
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none group-focus-within:text-blue-500 transition-colors" />
                </div>
              </div>
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto p-6 pt-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-muted text-[10.5px] font-semibold text-foreground/70">
                    <th className="pb-3 px-2 font-semibold w-16">Action</th>
                    <th className="pb-3 px-2 font-semibold relative group cursor-pointer hover:text-foreground transition-colors">
                      <div className="flex items-center justify-between">
                        MRR
                        <svg className="size-3.5 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
                      </div>
                    </th>
                    <th className="pb-3 px-2 font-semibold relative group cursor-pointer hover:text-foreground transition-colors">
                      <div className="flex items-center justify-between">
                        MRRDate
                        <svg className="size-3.5 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
                      </div>
                    </th>
                    <th className="pb-3 px-2 font-semibold relative group cursor-pointer hover:text-foreground transition-colors">
                      <div className="flex items-center justify-between">
                        Supplier
                        <svg className="size-3.5 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
                      </div>
                    </th>
                    <th className="pb-3 px-2 font-semibold relative group cursor-pointer hover:text-foreground transition-colors">
                      <div className="flex items-center justify-between">
                        Challan
                        <svg className="size-3.5 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
                      </div>
                    </th>
                    <th className="pb-3 px-2 font-semibold relative group cursor-pointer hover:text-foreground transition-colors">
                      <div className="flex items-center justify-between">
                        ChDate
                        <svg className="size-3.5 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
                      </div>
                    </th>
                    <th className="pb-3 px-2 font-semibold relative group cursor-pointer hover:text-foreground transition-colors">
                      <div className="flex items-center justify-between">
                        BillNo
                        <svg className="size-3.5 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
                      </div>
                    </th>
                    <th className="pb-3 px-2 font-semibold relative group cursor-pointer hover:text-foreground transition-colors">
                      <div className="flex items-center justify-between">
                        Remark
                        <svg className="size-3.5 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[10.5px]">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-muted-foreground">
                        No records found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row, idx) => (
                      <tr 
                        key={row.id} 
                        className={`border-b border-muted/50 hover:bg-muted/30 transition-colors group ${idx === 2 ? 'bg-muted/40' : ''}`}
                      >
                        <td className="py-2.5 px-2">
                          <button 
                            onClick={() => setSelectedMRR(row)}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                            title="Print MRIR Details"
                          >
                            <Printer className="size-[14px]" strokeWidth={2.5} />
                          </button>
                        </td>
                        <td className="py-2.5 px-2 text-foreground">{row.mrr}</td>
                        <td className="py-2.5 px-2 text-foreground">{row.mrrDate}</td>
                        <td className="py-2.5 px-2 text-foreground">{row.supplier}</td>
                        <td className="py-2.5 px-2 text-foreground">{row.challan}</td>
                        <td className="py-2.5 px-2 text-foreground">{row.chDate}</td>
                        <td className="py-2.5 px-2 text-foreground">{row.billNo}</td>
                        <td className="py-2.5 px-2 text-foreground">{row.remark || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Placeholder */}
            <div className="p-4 border-t border-border/40 bg-muted/10 flex justify-between items-center text-xs text-muted-foreground">
              <div>Showing {filteredData.length} of {mockData.length} records</div>
              <div className="flex gap-1">
                <button className="px-3 py-1.5 border border-border rounded-md hover:bg-background bg-background shadow-sm disabled:opacity-50">Previous</button>
                <button className="px-3 py-1.5 border border-border rounded-md hover:bg-background bg-background shadow-sm disabled:opacity-50">Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MRR Print Details Modal */}
      {selectedMRR && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white text-black w-full max-w-5xl rounded-sm shadow-2xl relative my-auto border border-gray-300">
            
            {/* Print action bar (not printable) */}
            <div className="absolute top-0 inset-x-0 h-12 bg-gray-100 border-b border-gray-300 flex items-center justify-between px-4 print:hidden rounded-t-sm">
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
                  onClick={() => setSelectedMRR(null)} 
                  className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Print Content */}
            <div className="p-8 sm:p-12 mt-12 print:mt-0 font-sans">
              
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <img src={pakizaLogo} alt="Pakiza Software" className="h-10 object-contain mb-2" />
                  
                  <div className="text-[10px] text-gray-800 space-y-0.5">
                    <p>Khan ABC Tradeplex House#37, Floor#11 (B-11), Road#2, Dhaka-1205</p>
                    <p>PSL/REC/STR/04</p>
                    <p>PSL/REC/STR/03</p>
                  </div>
                </div>
                
                <div className="text-right w-[300px]">
                  <h2 className="text-xl tracking-[0.2em] text-gray-600 font-bold mb-2">RECEIVE DETAILS</h2>
                  <div className="border border-black text-[11px]">
                    <div className="flex border-b border-black">
                      <div className="w-1/3 p-1 border-r border-black font-semibold text-left flex items-center">MRR NO :</div>
                      <div className="w-2/3 p-1 font-mono text-left">{selectedMRR.mrr}</div>
                    </div>
                    <div className="flex">
                      <div className="w-1/3 p-1 border-r border-black font-semibold text-left flex items-center">MRR DATE :</div>
                      <div className="w-2/3 p-1 font-mono text-left">{selectedMRR.mrrDate}</div>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-center font-bold text-sm underline underline-offset-2 mb-4 tracking-wide">
                Material Receiving & Inspection Report (MRIR)
              </h3>

              {/* Grid Info */}
              <table className="w-full text-[10px] border-collapse border border-black mb-1">
                <tbody>
                  <tr className="border-b border-black">
                    <td className="border-r border-black font-bold p-1 w-[12%]">CHALLAN NO</td>
                    <td className="border-r border-black p-1 w-[20%]">{selectedMRR.challan}</td>
                    <td className="border-r border-black font-bold p-1 w-[12%]">PO/WO</td>
                    <td className="border-r border-black p-1 w-[25%] text-blue-600 underline">PO/PSL/2026/000230</td>
                    <td className="border-r border-black font-bold p-1 w-[12%]">SUPPLIER</td>
                    <td className="p-1 w-[19%]">{selectedMRR.supplier}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-r border-black font-bold p-1">CHALLAN DATE</td>
                    <td className="border-r border-black p-1">{selectedMRR.chDate}</td>
                    <td className="border-r border-black font-bold p-1">PO/WO DATE</td>
                    <td className="border-r border-black p-1">10/08/2026</td>
                    <td className="border-r border-black font-bold p-1"></td>
                    <td className="p-1"></td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-r border-black font-bold p-1">BILL NO</td>
                    <td className="border-r border-black p-1">{selectedMRR.billNo}</td>
                    <td className="border-r border-black font-bold p-1">LC NO</td>
                    <td className="border-r border-black p-1"></td>
                    <td className="border-r border-black font-bold p-1"></td>
                    <td className="p-1"></td>
                  </tr>
                  <tr>
                    <td className="border-r border-black font-bold p-1">BILL DATE</td>
                    <td className="border-r border-black p-1">{selectedMRR.mrrDate}</td>
                    <td className="border-r border-black font-bold p-1">LC DATE</td>
                    <td className="border-r border-black p-1"></td>
                    <td className="border-r border-black font-bold p-1"></td>
                    <td className="p-1"></td>
                  </tr>
                </tbody>
              </table>

              {/* Items Table */}
              <table className="w-full text-[10px] border-collapse border border-black mt-4">
                <thead>
                  <tr className="bg-[#E6E6FA] border-b border-black">
                    <th className="border-r border-black p-1 text-left w-10 font-bold">SL</th>
                    <th className="border-r border-black p-1 text-left font-bold">Item</th>
                    <th className="border-r border-black p-1 text-left font-bold w-[20%]">Specification</th>
                    <th className="border-r border-black p-1 text-left font-bold w-[15%]">Quantity</th>
                    <th className="p-1 text-left font-bold w-[20%]">Req. Number</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-black align-top h-12">
                    <td className="border-r border-black p-1">1</td>
                    <td className="border-r border-black p-1">
                      <div className="font-semibold">Item: Gel Pen (Yellow)</div>
                      <div className="text-[9px] text-gray-700">Cat.: General Stationary</div>
                    </td>
                    <td className="border-r border-black p-1">Test Purpose.</td>
                    <td className="border-r border-black p-1">3.00 (PCS)</td>
                    <td className="p-1"></td>
                  </tr>
                  <tr className="border-b border-black align-top h-12">
                    <td className="border-r border-black p-1">2</td>
                    <td className="border-r border-black p-1">
                      <div className="font-semibold">Item: Ball Pen Black</div>
                      <div className="text-[9px] text-gray-700">Cat.: General Stationary</div>
                    </td>
                    <td className="border-r border-black p-1">Test Purpose.</td>
                    <td className="border-r border-black p-1">4.00 (PCS)</td>
                    <td className="p-1"></td>
                  </tr>
                </tbody>
              </table>

              {/* Summary Block */}
              <table className="w-full text-[10px] border-collapse border-l border-r border-b border-black mt-4">
                <tbody>
                  <tr className="border-b border-black">
                    <td className="border-r border-black p-1 w-1/2 text-right pr-4 font-bold">Total Quantity</td>
                    <td className="border-r border-black p-1 w-12 text-left font-bold">7</td>
                    <td className="border-r border-black p-1 w-[38%] text-right pr-4 font-bold">Total Amount</td>
                    <td className="p-1 text-left">0</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td colSpan={2} className="border-r border-black p-1"></td>
                    <td className="border-r border-black p-1 text-right pr-4 font-bold">Discount(-)</td>
                    <td className="p-1 text-left">0</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td colSpan={2} className="border-r border-black p-1"></td>
                    <td className="border-r border-black p-1 text-right pr-4 font-bold">VAT(-)</td>
                    <td className="p-1 text-left">0</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td colSpan={2} className="border-r border-black p-1"></td>
                    <td className="border-r border-black p-1 text-right pr-4 font-bold">TAX(-)</td>
                    <td className="p-1 text-left">0</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td colSpan={2} className="border-r border-black p-1"></td>
                    <td className="border-r border-black p-1 text-right pr-4 font-bold">Grand Total</td>
                    <td className="p-1 text-left">0</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="p-1.5 font-bold">In word:</td>
                  </tr>
                </tbody>
              </table>

              {/* Notes Block */}
              <table className="w-full text-[10px] border-collapse border border-black mt-4">
                <tbody>
                  <tr className="border-b border-black">
                    <td className="border-r border-black p-1 w-[25%] font-bold">Remarks (MCD)</td>
                    <td className="p-1">{selectedMRR.remark || "ok"}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-r border-black p-1 font-bold">Check Note (MCD)</td>
                    <td className="p-1">ok</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-r border-black p-1 font-bold">Quality Note</td>
                    <td className="p-1">ok</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-r border-black p-1 font-bold">Approve Note (MCD)</td>
                    <td className="p-1">ok</td>
                  </tr>
                  <tr>
                    <td className="border-r border-black p-1 font-bold">Remark (Procurement)</td>
                    <td className="p-1"></td>
                  </tr>
                </tbody>
              </table>

              {/* Signatures */}
              <div className="grid grid-cols-6 gap-2 mt-12 text-[9px] text-center">
                <div className="flex flex-col items-center">
                  <div className="border-b border-dashed border-gray-600 w-full mb-1"></div>
                  <div className="font-bold">MCD Prepared By</div>
                  <div className="text-gray-800 mt-1">Sohanur Rahman Sohan</div>
                  <div className="text-gray-800">Executive</div>
                  <div className="text-gray-800">{selectedMRR.mrrDate}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="border-b border-dashed border-gray-600 w-full mb-1"></div>
                  <div className="font-bold">MCD Checked By</div>
                  <div className="text-gray-800 mt-1">Sohanur Rahman Sohan</div>
                  <div className="text-gray-800">Executive</div>
                  <div className="text-gray-800">{selectedMRR.mrrDate} 14:12:18</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="border-b border-dashed border-gray-600 w-full mb-1"></div>
                  <div className="font-bold">Quality Inspected By</div>
                  <div className="text-gray-800 mt-1">Rajebul Hasan Rajon</div>
                  <div className="text-gray-800">Deputy Manager</div>
                  <div className="text-gray-800">{selectedMRR.mrrDate} 15:03:01</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="border-b border-dashed border-gray-600 w-full mb-1"></div>
                  <div className="font-bold">MCD Approved By</div>
                  <div className="text-gray-800 mt-1">Rajebul Hasan Rajon</div>
                  <div className="text-gray-800">Deputy Manager</div>
                  <div className="text-gray-800">{selectedMRR.mrrDate} 15:03:09</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="border-b border-dashed border-gray-600 w-full mb-1"></div>
                  <div className="font-bold">Billing Info Inputed By</div>
                  <div className="text-gray-800 mt-1">Rajebul Hasan Rajon</div>
                  <div className="text-gray-800">Deputy Manager</div>
                  <div className="text-gray-800">{selectedMRR.mrrDate} 15:12:47</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="border-b border-dashed border-gray-600 w-full mb-1"></div>
                  <div className="font-bold">Billing Info Approved By</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
