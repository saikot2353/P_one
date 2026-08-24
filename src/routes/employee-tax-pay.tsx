import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  FileSpreadsheet,
  Printer,
  FileText,
} from "lucide-react";

export const Route = createFileRoute("/employee-tax-pay")({
  head: () => ({
    meta: [
      { title: "Employee Tax Pay — CRIPTON HRIS" },
      { name: "description", content: "Update and process employee tax payments and chalans." },
    ],
  }),
  component: EmployeeTaxPayPage,
});

interface TaxRow {
  id: string;
  empId: string;
  name: string;
  totalPerson: string;
  totalAmount: string;
  bank: string;
  branch: string;
  chalanNo: string;
  chalanDate: string;
  taxAmount: string;
  serviceBenefit: string;
}

const initialRows: TaxRow[] = [
  { id: "1", empId: "009017", name: "Mohammad Ruhul Amin", totalPerson: "434334", totalAmount: "90000000", bank: "Select...", branch: "Narayanganj", chalanNo: "54545454545", chalanDate: "26/08/2026", taxAmount: "417", serviceBenefit: "0" },
  { id: "2", empId: "014101", name: "Shamim Hossain Bhuiyan", totalPerson: "434334", totalAmount: "90000000", bank: "Select...", branch: "Narayanganj", chalanNo: "54545454545", chalanDate: "26/08/2026", taxAmount: "0", serviceBenefit: "0" },
  { id: "3", empId: "120460", name: "Md. Raizulhaque Molla", totalPerson: "434334", totalAmount: "90000000", bank: "Select...", branch: "Narayanganj", chalanNo: "54545454545", chalanDate: "26/08/2026", taxAmount: "0", serviceBenefit: "0" },
  { id: "4", empId: "161705", name: "Atikur Rahman", totalPerson: "434334", totalAmount: "90000000", bank: "Select...", branch: "Narayanganj", chalanNo: "54545454545", chalanDate: "26/08/2026", taxAmount: "0", serviceBenefit: "0" },
  { id: "5", empId: "100904", name: "Md. Shahin Alam", totalPerson: "434334", totalAmount: "90000000", bank: "Select...", branch: "Narayanganj", chalanNo: "54545454545", chalanDate: "26/08/2026", taxAmount: "0", serviceBenefit: "0" },
  { id: "6", empId: "1617252", name: "Md. Maynul Islam", totalPerson: "434334", totalAmount: "90000000", bank: "Select...", branch: "Narayanganj", chalanNo: "54545454545", chalanDate: "26/08/2026", taxAmount: "0", serviceBenefit: "0" },
  { id: "7", empId: "001519", name: "Md. Abdur Rahman ( Fahim )", totalPerson: "434334", totalAmount: "90000000", bank: "Select...", branch: "Narayanganj", chalanNo: "54545454545", chalanDate: "26/08/2026", taxAmount: "0", serviceBenefit: "0" },
  { id: "8", empId: "1610029", name: "Md. Omar Faroque Tanzell", totalPerson: "434334", totalAmount: "90000000", bank: "Select...", branch: "Narayanganj", chalanNo: "54545454545", chalanDate: "26/08/2026", taxAmount: "417", serviceBenefit: "0" },
  { id: "9", empId: "026447", name: "Md. Rabiul Islam", totalPerson: "434334", totalAmount: "90000000", bank: "Select...", branch: "Narayanganj", chalanNo: "54545454545", chalanDate: "26/08/2026", taxAmount: "780", serviceBenefit: "0" },
  { id: "10", empId: "001376", name: "Md. Ali Hossen", totalPerson: "434334", totalAmount: "90000000", bank: "Select...", branch: "Narayanganj", chalanNo: "54545454545", chalanDate: "26/08/2026", taxAmount: "0", serviceBenefit: "0" },
  { id: "11", empId: "1608704", name: "Md. Abdur Rahman Manik", totalPerson: "434334", totalAmount: "90000000", bank: "Select...", branch: "Narayanganj", chalanNo: "54545454545", chalanDate: "26/08/2026", taxAmount: "0", serviceBenefit: "0" },
  { id: "12", empId: "092587", name: "Md. Milon", totalPerson: "434334", totalAmount: "90000000", bank: "Select...", branch: "Narayanganj", chalanNo: "54545454545", chalanDate: "26/08/2026", taxAmount: "0", serviceBenefit: "0" },
  { id: "13", empId: "023431", name: "Md. Tanvir Ahmmad", totalPerson: "434334", totalAmount: "90000000", bank: "Select...", branch: "Narayanganj", chalanNo: "54545454545", chalanDate: "26/08/2026", taxAmount: "0", serviceBenefit: "0" }
];

function EmployeeTaxPayPage() {
  const [tableData, setTableData] = useState<TaxRow[]>(initialRows);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Bulk Inputs State
  const [bulkBank, setBulkBank] = useState("Sonali Bank PLC");
  const [bulkBranch, setBulkBranch] = useState("Narayanganj");
  const [bulkChalanNo, setBulkChalanNo] = useState("54545454545");
  const [bulkChalanDate, setBulkChalanDate] = useState("26/08/2026");

  const filteredData = useMemo(() => {
    if (!isDataLoaded) return [];
    return tableData.filter(row =>
      row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.empId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tableData, searchQuery, isDataLoaded]);

  const handleCellChange = (id: string, key: keyof TaxRow, value: string) => {
    setTableData(prev =>
      prev.map(row => (row.id === id ? { ...row, [key]: value } : row))
    );
  };

  const handleSearch = () => {
    setIsDataLoaded(true);
  };

  const applyBulkData = () => {
    setTableData(prev =>
      prev.map(row => ({
        ...row,
        bank: bulkBank,
        branch: bulkBranch,
        chalanNo: bulkChalanNo,
        chalanDate: bulkChalanDate,
      }))
    );
  };

  const handleSave = () => {
    alert("Tax Pay Update submitted successfully!");
  };

  return (
    <div className="min-h-screen flex bg-slate-50/70 text-slate-800 font-sans">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-5 w-full max-w-[1600px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-slate-300" />
            <span>Payroll</span>
            <ChevronRight className="size-3 text-slate-300" />
            <span className="text-slate-600">Employee Tax Pay</span>
          </div>

          {/* Unified Compact Filters Bar */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex items-end gap-4">
            
            {/* Year Selector */}
            <div className="flex flex-col">
              <label className="text-[10px] text-slate-455 font-bold uppercase tracking-wider block mb-1">Year</label>
              <select className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 min-w-[100px] cursor-pointer transition-all">
                <option>2026</option>
                <option>2025</option>
              </select>
            </div>

            {/* Month Selector */}
            <div className="flex flex-col">
              <label className="text-[10px] text-slate-455 font-bold uppercase tracking-wider block mb-1">Month</label>
              <select className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 min-w-[100px] cursor-pointer transition-all">
                <option>Jul</option>
                <option>Aug</option>
                <option>Sep</option>
              </select>
            </div>

            {/* Search Button */}
            <button 
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 px-5 rounded-lg transition-all shadow-md shadow-blue-500/10 cursor-pointer self-end text-xs"
            >
              SEARCH
            </button>
          </div>

          {/* If data is not yet searched and loaded */}
          {!isDataLoaded && (
            <div className="bg-white border border-slate-200/80 rounded-xl p-12 text-center shadow-sm animate-in fade-in duration-300">
              <div className="max-w-md mx-auto space-y-3">
                <div className="mx-auto size-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
                  🗓️
                </div>
                <h3 className="text-sm font-bold text-slate-800">Select Payroll Period</h3>
                <p className="text-xs text-slate-400">
                  Please select the target Year and Month from the filters above, then click search to load the employee tax records.
                </p>
              </div>
            </div>
          )}

          {/* Conditional parameters and editable table grid */}
          {isDataLoaded && (
            <div className="space-y-5 animate-in fade-in duration-400">
              
              {/* Separate Card for Bank, Branch, Challan No and Date Bulk Fill */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex flex-wrap items-end gap-4">
                
                {/* Bank Selector */}
                <div className="flex flex-col flex-1 min-w-[150px]">
                  <label className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block mb-1">Bank (Bulk update)</label>
                  <select 
                    value={bulkBank}
                    onChange={(e) => setBulkBank(e.target.value)}
                    className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 w-full cursor-pointer transition-all"
                  >
                    <option>Select...</option>
                    <option>Sonali Bank PLC</option>
                    <option>Eastern Bank Ltd</option>
                  </select>
                </div>

                {/* Branch Selector */}
                <div className="flex flex-col flex-1 min-w-[150px]">
                  <label className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block mb-1">Branch (Bulk update)</label>
                  <select 
                    value={bulkBranch}
                    onChange={(e) => setBulkBranch(e.target.value)}
                    className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 w-full cursor-pointer transition-all"
                  >
                    <option>Narayanganj</option>
                    <option>Dhaka Main Branch</option>
                  </select>
                </div>

                {/* Chalan No Input */}
                <div className="flex flex-col flex-1 min-w-[140px]">
                  <label className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block mb-1">Chalan No (Bulk update)</label>
                  <input
                    type="text"
                    value={bulkChalanNo}
                    onChange={(e) => setBulkChalanNo(e.target.value)}
                    className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 w-full transition-all"
                  />
                </div>

                {/* Chalan Date Input */}
                <div className="flex flex-col flex-1 min-w-[120px]">
                  <label className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block mb-1">Chalan Date (Bulk update)</label>
                  <input
                    type="text"
                    value={bulkChalanDate}
                    onChange={(e) => setBulkChalanDate(e.target.value)}
                    className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 w-full transition-all"
                  />
                </div>

                {/* Bulk Apply Button */}
                <button
                  type="button"
                  onClick={applyBulkData}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 px-4 rounded-lg transition-all shadow-md shadow-blue-500/10 cursor-pointer self-end text-xs"
                >
                  Apply to All Rows
                </button>
              </div>

              {/* Compact Statistics Bar */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-3 px-4 shadow-sm flex items-center gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">Total Person:</span>
                  <span className="font-black text-slate-700">434,334</span>
                </div>
                <div className="h-4 w-px bg-slate-200" />
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">Total Amount:</span>
                  <span className="font-black text-slate-700">৳ 90,000,000</span>
                </div>
              </div>

              {/* Table Card */}
              <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm flex flex-col overflow-hidden">
                
                {/* Toolbar */}
                <div className="p-3.5 border-b border-slate-200/60 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/20">
                  
                  {/* Export buttons */}
                  <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                    <button className="h-[30px] px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-[11px] rounded-lg flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs font-sans">
                      <FileSpreadsheet className="size-3.5 text-emerald-600" /> Excel
                    </button>
                    <button className="h-[30px] px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-[11px] rounded-lg flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs font-sans">
                      <Printer className="size-3.5 text-blue-600" /> Print
                    </button>
                    <button className="h-[30px] px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-[11px] rounded-lg flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs font-sans">
                      <FileText className="size-3.5 text-red-600" /> PDF
                    </button>
                  </div>

                  {/* Compact Search Box with correct font sizes */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider select-none">Search:</span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-48 px-3 h-9 bg-white border border-slate-200 hover:border-slate-350 focus:bg-white focus:border-blue-500 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
                      placeholder="Filter..."
                    />
                  </div>

                </div>

                {/* Table Grid */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap bg-slate-50">
                        <th className="px-4 py-3 font-bold w-12 text-center border-r border-slate-100">SL</th>
                        <th className="px-4 py-3 font-bold w-20 border-r border-slate-100">Emp ID</th>
                        <th className="px-4 py-3 font-bold min-w-[150px] border-r border-slate-100">Employee Name</th>
                        <th className="px-4 py-3 font-bold border-r border-slate-100 text-center">Total Person</th>
                        <th className="px-4 py-3 font-bold border-r border-slate-100 text-center">Total Amount</th>
                        <th className="px-4 py-3 font-bold border-r border-slate-100">Bank</th>
                        <th className="px-4 py-3 font-bold border-r border-slate-100">Branch</th>
                        <th className="px-4 py-3 font-bold border-r border-slate-100 text-center">Chalan No</th>
                        <th className="px-4 py-3 font-bold border-r border-slate-100 text-center">Chalan Date</th>
                        <th className="px-4 py-3 font-bold border-r border-slate-100 text-right">Tax Amount</th>
                        <th className="px-4 py-3 font-bold text-right">Service Benefit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-normal text-slate-700 bg-white">
                      {filteredData.map((row, index) => (
                        <tr key={row.id} className="hover:bg-slate-50 border-b border-slate-100 transition-colors">
                          <td className="px-4 py-2.5 text-center border-r border-slate-100 text-slate-400 font-normal">
                            {index + 1}
                          </td>
                          <td className="px-4 py-2.5 border-r border-slate-100 font-mono font-normal">
                            {row.empId}
                          </td>
                          <td className="px-4 py-2.5 border-r border-slate-100 font-semibold text-slate-800 truncate max-w-[185px]">
                            {row.name}
                          </td>
                          <td className="px-4 py-2.5 border-r border-slate-100 text-center">
                            <input
                              type="text"
                              value={row.totalPerson}
                              onChange={(e) => handleCellChange(row.id, "totalPerson", e.target.value)}
                              className="w-20 px-2 py-1 border border-slate-200 rounded-lg text-center text-[10px] font-normal focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                            />
                          </td>
                          <td className="px-4 py-2.5 border-r border-slate-100 text-center">
                            <input
                              type="text"
                              value={row.totalAmount}
                              onChange={(e) => handleCellChange(row.id, "totalAmount", e.target.value)}
                              className="w-24 px-2 py-1 border border-slate-200 rounded-lg text-right text-[10px] font-normal focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                            />
                          </td>
                          <td className="px-4 py-2.5 border-r border-slate-100">
                            <select
                              value={row.bank}
                              onChange={(e) => handleCellChange(row.id, "bank", e.target.value)}
                              className="w-28 px-1.5 py-1 border border-slate-200 rounded-lg text-[10px] bg-white font-normal focus:outline-none cursor-pointer"
                            >
                              <option>Select...</option>
                              <option>Sonali Bank PLC</option>
                              <option>Eastern Bank Ltd</option>
                            </select>
                          </td>
                          <td className="px-4 py-2.5 border-r border-slate-100">
                            <select
                              value={row.branch}
                              onChange={(e) => handleCellChange(row.id, "branch", e.target.value)}
                              className="w-28 px-1.5 py-1 border border-slate-200 rounded-lg text-[10px] bg-white font-normal focus:outline-none cursor-pointer"
                            >
                              <option>Narayanganj</option>
                              <option>Dhaka Main</option>
                            </select>
                          </td>
                          <td className="px-4 py-2.5 border-r border-slate-100 text-center">
                            <input
                              type="text"
                              value={row.chalanNo}
                              onChange={(e) => handleCellChange(row.id, "chalanNo", e.target.value)}
                              className="w-28 px-2 py-1 border border-slate-200 rounded-lg text-center text-[10px] font-normal focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                            />
                          </td>
                          <td className="px-4 py-2.5 border-r border-slate-100 text-center">
                            <input
                              type="text"
                              value={row.chalanDate}
                              onChange={(e) => handleCellChange(row.id, "chalanDate", e.target.value)}
                              className="w-24 px-2 py-1 border border-slate-200 rounded-lg text-center text-[10px] font-normal focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                            />
                          </td>
                          <td className="px-4 py-2.5 border-r border-slate-100 text-right">
                            <input
                              type="text"
                              value={row.taxAmount}
                              onChange={(e) => handleCellChange(row.id, "taxAmount", e.target.value)}
                              className="w-16 px-2 py-1 border border-slate-200 rounded-lg text-right text-[10px] font-normal focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                            />
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <input
                              type="text"
                              value={row.serviceBenefit}
                              onChange={(e) => handleCellChange(row.id, "serviceBenefit", e.target.value)}
                              className="w-16 px-2 py-1 border border-slate-200 rounded-lg text-right text-[10px] font-normal focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer / Pagination stats */}
                <div className="p-4 border-t border-slate-100 bg-[#fcfdfd] text-[11px] text-muted-foreground font-normal flex flex-col sm:flex-row justify-between items-center gap-3">
                  <span>Showing 1 to {filteredData.length} of {tableData.length} entries</span>
                  <div className="flex items-center gap-1.5 font-sans">
                    <button className="px-2 py-1 text-slate-400 hover:text-slate-700 font-normal">Previous</button>
                    <button className="size-6 bg-blue-600 text-white font-semibold rounded flex items-center justify-center text-[10px]">1</button>
                    <button className="px-2 py-1 text-slate-400 hover:text-slate-700 font-normal">Next</button>
                  </div>
                </div>

              </div>

              {/* Bottom Submit Action aligned to the right */}
              <div className="flex justify-end">
                <button 
                  onClick={handleSave}
                  className="bg-[#0d6efd] hover:bg-blue-700 text-white font-bold h-9 px-5 rounded-lg transition-all shadow-md shadow-blue-550/10 cursor-pointer uppercase text-xs tracking-wider animate-in fade-in duration-200"
                >
                  SUBMIT
                </button>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}
