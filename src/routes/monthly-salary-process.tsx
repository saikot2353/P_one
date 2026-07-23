import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  FileText, 
  Printer, 
  FileDown, 
  Play, 
  ChevronRight, 
  AlertCircle, 
  Database,
  Building,
  MapPin,
  UserCheck,
  Building2,
  ListFilter
} from "lucide-react";

export const Route = createFileRoute("/monthly-salary-process")({
  head: () => ({
    meta: [
      { title: "Monthly Salary Process — CRIPTON" },
      { name: "description", content: "Process and preview monthly staff salaries with diagnostic logs." },
    ],
  }),
  component: MonthlySalaryProcessPage,
});

function MonthlySalaryProcessPage() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Mock comprehensive employee data based on screenshot
  const mockData = [
    {
      id: 1,
      empId: "2023043910",
      name: "Tahmid Afsar",
      wd: 27,
      present: 14,
      absent: 1,
      leave: 1,
      holiday: 4,
      basic: 31200,
      gross: 52000,
      ot: "0",
      otPay: "0",
      attBonus: "0",
      allowance: "0",
      lunchDeduct: "0",
      pf: "0",
      tax: "0",
      absentDeduct: "1040",
      advance: "0",
      adjust: "0.00",
      wagelyAdv: "0.00",
      loan: "0"
    },
    {
      id: 2,
      empId: "2023044078",
      name: "Md. Anik Islam",
      wd: 30,
      present: 5,
      absent: 1,
      leave: 0,
      holiday: 1,
      basic: 47400,
      gross: 79000,
      ot: "0.00",
      otPay: "0",
      attBonus: "0",
      allowance: "0",
      lunchDeduct: "0",
      pf: "0",
      tax: "0",
      absentDeduct: "1580",
      advance: "0",
      adjust: "0.00",
      wagelyAdv: "0.00",
      loan: "10"
    },
    {
      id: 3,
      empId: "2026058686",
      name: "Md. Abdur Rahaman",
      wd: 12,
      present: 8,
      absent: 0,
      leave: 1,
      holiday: 3,
      basic: 30000,
      gross: 50000,
      ot: "0.00",
      otPay: "0",
      attBonus: "0",
      allowance: "0",
      lunchDeduct: "1250",
      pf: "0",
      tax: "0",
      absentDeduct: "0",
      advance: "0",
      adjust: "0.00",
      wagelyAdv: "0.00",
      loan: "0"
    },
  ];

  const handleFetchData = () => {
    setIsDataLoaded(true);
  };

  return (
    <div className="min-h-screen flex bg-slate-50/70 text-slate-800 font-sans">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-5 md:p-8 space-y-6 w-full max-w-[1600px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span className="hover:text-blue-600 transition-colors cursor-pointer">Home</span>
            <ChevronRight className="size-3 text-slate-300" />
            <span>Payroll</span>
            <ChevronRight className="size-3 text-slate-300" />
            <span className="text-slate-600">Salary Process</span>
          </div>

          {/* Header Description */}
          <div className="relative bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-blue-50/40 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Monthly Salary Process
              </h1>
              <p className="text-sm text-slate-500 max-w-4xl leading-relaxed">
                Run salary batches, evaluate attendance deductions, calculate overtime values, and review payroll statistics. Calibrate filter properties before clicking process parameters.
              </p>
            </div>
          </div>

          {/* Dynamic Configuration Controls Form */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
            
            {/* Form row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="col-span-2">
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5 tracking-wider">Year</label>
                <select className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all cursor-pointer font-sans">
                  <option>2026</option>
                  <option>2025</option>
                  <option>2024</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5 tracking-wider">Month</label>
                <select className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all cursor-pointer font-sans">
                  <option>Jul</option>
                  <option>Aug</option>
                  <option>Sep</option>
                  <option>Oct</option>
                  <option>Nov</option>
                  <option>Dec</option>
                </select>
              </div>

              <div className="col-span-3">
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5 tracking-wider">Process Type</label>
                <select className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all cursor-pointer font-sans">
                  <option>Final</option>
                  <option>Advance</option>
                  <option>Bonus</option>
                </select>
              </div>

              <div className="col-span-3">
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5 tracking-wider">Salary Type</label>
                <select className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all cursor-pointer font-sans">
                  <option>ALL</option>
                  <option>Regular</option>
                  <option>Contractual</option>
                </select>
              </div>

              <div className="col-span-2 flex justify-start">
                <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold h-10 rounded-xl transition-all shadow-md shadow-rose-500/10 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
                  <Play className="size-4 shrink-0" />
                  PROCESS
                </Button>
              </div>
            </div>

            {/* Form row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="col-span-4">
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5 tracking-wider flex items-center gap-1">
                  <Building className="size-3 text-slate-400" /> Company
                </label>
                <select className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all cursor-pointer font-sans">
                  <option>Pakiza Software Limited</option>
                </select>
              </div>

              <div className="col-span-4">
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5 tracking-wider flex items-center gap-1">
                  <MapPin className="size-3 text-slate-400" /> Area Name
                </label>
                <select className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all cursor-pointer font-sans">
                  <option>PSL-Operation</option>
                </select>
              </div>

              <div className="col-span-4">
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5 tracking-wider flex items-center gap-1">
                  <UserCheck className="size-3 text-slate-400" /> Employee Type
                </label>
                <select className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all cursor-pointer font-sans">
                  <option>ALL</option>
                  <option>Permanent</option>
                  <option>Contractual</option>
                </select>
              </div>
            </div>

            {/* Form row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="col-span-3">
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5 tracking-wider flex items-center gap-1">
                  <Building2 className="size-3 text-slate-400" /> Department
                </label>
                <select className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all cursor-pointer font-sans">
                  <option>ALL</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5 tracking-wider flex items-center gap-1">
                  <ListFilter className="size-3 text-slate-400" /> Unit
                </label>
                <select className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all cursor-pointer font-sans">
                  <option>ALL</option>
                </select>
              </div>

              <div className="col-span-3">
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5 tracking-wider">Employee Id</label>
                <input
                  type="text"
                  placeholder="Use comma as separator"
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold placeholder:text-slate-350 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>

              <div className="col-span-4 flex justify-start">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  onClick={handleFetchData}
                >
                  <Database className="size-4 shrink-0" />
                  GET PROCESSED DATA
                </Button>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm flex flex-col min-h-[500px] overflow-hidden">
            
            {/* Top Action Bar */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <div className="flex bg-slate-100/80 border border-slate-200/50 rounded-xl p-1 w-fit shadow-xs">
                <Button variant="ghost" size="sm" className="h-8 px-4 text-xs font-bold text-slate-600 hover:bg-white hover:text-slate-800 rounded-lg transition-all flex items-center gap-1.5">
                  <FileDown className="size-4 text-emerald-600" />
                  EXCEL
                </Button>
                <div className="w-px bg-slate-200 my-1.5" />
                <Button variant="ghost" size="sm" className="h-8 px-4 text-xs font-bold text-slate-600 hover:bg-white hover:text-slate-800 rounded-lg transition-all flex items-center gap-1.5">
                  <Printer className="size-4 text-blue-600" />
                  PRINT
                </Button>
                <div className="w-px bg-slate-200 my-1.5" />
                <Button variant="ghost" size="sm" className="h-8 px-4 text-xs font-bold text-slate-600 hover:bg-white hover:text-slate-800 rounded-lg transition-all flex items-center gap-1.5">
                  <FileText className="size-4 text-rose-600" />
                  PDF
                </Button>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search processed data..."
                    className="h-10 w-64 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-450"
                  />
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="flex-1 overflow-x-auto relative">
              <table className="w-full text-left text-xs whitespace-nowrap min-w-[1800px] border-collapse">
                <thead className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500 bg-slate-50/50 border-b border-slate-200/80 sticky top-0 z-10">
                  <tr>
                    {/* Fixed CSS layout: we wrap the flex styling in a div inside the cell instead of using flex directly on th */}
                    <th className="px-3 py-3.5 border-r border-slate-100">
                      <div className="flex items-center gap-1">SL <span className="text-[9px] opacity-40">▼</span></div>
                    </th>
                    <th className="px-3 py-3.5 border-r border-slate-100 text-center w-12">Action</th>
                    <th className="px-3 py-3.5 border-r border-slate-100">
                      <div className="flex items-center gap-1">Emp Id <span className="text-[9px] opacity-40">▼</span></div>
                    </th>
                    <th className="px-3 py-3.5 border-r border-slate-100 min-w-[180px]">
                      <div className="flex items-center gap-1">Name <span className="text-[9px] opacity-40">▼</span></div>
                    </th>
                    <th className="px-3 py-3.5 border-r border-slate-100">
                      <div className="flex items-center gap-1">WD <span className="text-[9px] opacity-40">▼</span></div>
                    </th>
                    <th className="px-3 py-3.5 border-r border-slate-100">
                      <div className="flex items-center gap-1">Present <span className="text-[9px] opacity-40">▼</span></div>
                    </th>
                    <th className="px-3 py-3.5 border-r border-slate-100">
                      <div className="flex items-center gap-1">Absent <span className="text-[9px] opacity-40">▼</span></div>
                    </th>
                    <th className="px-3 py-3.5 border-r border-slate-100">
                      <div className="flex items-center gap-1">Leave <span className="text-[9px] opacity-40">▼</span></div>
                    </th>
                    <th className="px-3 py-3.5 border-r border-slate-100">
                      <div className="flex items-center gap-1">Holiday <span className="text-[9px] opacity-40">▼</span></div>
                    </th>
                    <th className="px-3 py-3.5 border-r border-slate-100">
                      <div className="flex items-center gap-1">Basic <span className="text-[9px] opacity-40">▼</span></div>
                    </th>
                    <th className="px-3 py-3.5 border-r border-slate-100">
                      <div className="flex items-center gap-1">Gross <span className="text-[9px] opacity-40">▼</span></div>
                    </th>
                    <th className="px-3 py-3.5 border-r border-slate-100">
                      <div className="flex items-center gap-1">OT <span className="text-[9px] opacity-40">▼</span></div>
                    </th>
                    <th className="px-3 py-3.5 border-r border-slate-100">
                      <div className="flex items-center gap-1">OT Pay <span className="text-[9px] opacity-40">▼</span></div>
                    </th>
                    <th className="px-3 py-3.5 border-r border-slate-100">
                      <div className="flex items-center gap-1">Att. Bonus <span className="text-[9px] opacity-40">▼</span></div>
                    </th>
                    <th className="px-3 py-3.5 border-r border-slate-100">
                      <div className="flex items-center gap-1">Allowance <span className="text-[9px] opacity-40">▼</span></div>
                    </th>
                    <th className="px-3 py-3.5 border-r border-slate-100">
                      <div className="flex items-center gap-1">Lunch Deduct <span className="text-[9px] opacity-40">▼</span></div>
                    </th>
                    <th className="px-3 py-3.5 border-r border-slate-100">
                      <div className="flex items-center gap-1">PF <span className="text-[9px] opacity-40">▼</span></div>
                    </th>
                    <th className="px-3 py-3.5 border-r border-slate-100">
                      <div className="flex items-center gap-1">Tax <span className="text-[9px] opacity-40">▼</span></div>
                    </th>
                    <th className="px-3 py-3.5 border-r border-slate-100">
                      <div className="flex items-center gap-1">Absent Deduction <span className="text-[9px] opacity-40">▼</span></div>
                    </th>
                    <th className="px-3 py-3.5 border-r border-slate-100">
                      <div className="flex items-center gap-1">Advance <span className="text-[9px] opacity-40">▼</span></div>
                    </th>
                    <th className="px-3 py-3.5 border-r border-slate-100">
                      <div className="flex items-center gap-1">Adjust <span className="text-[9px] opacity-40">▼</span></div>
                    </th>
                    <th className="px-3 py-3.5 border-r border-slate-100">
                      <div className="flex items-center gap-1">Wagely Adv <span className="text-[9px] opacity-40">▼</span></div>
                    </th>
                    <th className="px-3 py-3.5 border-r border-slate-100">
                      <div className="flex items-center gap-1">Loan <span className="text-[9px] opacity-40">▼</span></div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                  {!isDataLoaded ? (
                    <tr>
                      <td colSpan={23} className="px-6 py-16 text-center text-slate-400 font-medium">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <AlertCircle className="size-6 text-slate-300" />
                          <span>Click "GET PROCESSED DATA" to load the monthly salary report.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    mockData.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-3 py-3 font-semibold text-slate-400 text-center border-r border-slate-100">{row.id}</td>
                        <td className="px-3 py-3 text-center border-r border-slate-100">
                          <button className="bg-blue-50 text-blue-600 p-1.5 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer shadow-xs" title="Search Record">
                            <Search className="size-3.5" strokeWidth={2.5} />
                          </button>
                        </td>
                        <td className="px-3 py-3 font-semibold text-slate-800 border-r border-slate-100">{row.empId}</td>
                        <td className="px-3 py-3 font-bold text-slate-800 border-r border-slate-100 min-w-[180px] group-hover:text-blue-600 transition-colors">{row.name}</td>
                        <td className="px-3 py-3 font-medium border-r border-slate-100">{row.wd}</td>
                        <td className="px-3 py-3 font-medium text-emerald-600 border-r border-slate-100">{row.present}</td>
                        <td className="px-3 py-3 font-medium text-rose-500 border-r border-slate-100">{row.absent}</td>
                        <td className="px-3 py-3 font-medium text-amber-600 border-r border-slate-100">{row.leave}</td>
                        <td className="px-3 py-3 font-medium text-blue-600 border-r border-slate-100">{row.holiday}</td>
                        <td className="px-3 py-3 font-mono font-bold text-slate-900 border-r border-slate-100">৳{row.basic.toLocaleString()}</td>
                        <td className="px-3 py-3 font-mono font-bold text-slate-900 border-r border-slate-100">৳{row.gross.toLocaleString()}</td>
                        <td className="px-3 py-3 border-r border-slate-100">{row.ot}</td>
                        <td className="px-3 py-3 font-mono border-r border-slate-100">৳{row.otPay}</td>
                        <td className="px-3 py-3 border-r border-slate-100">{row.attBonus}</td>
                        <td className="px-3 py-3 border-r border-slate-100">{row.allowance}</td>
                        <td className="px-3 py-3 font-mono border-r border-slate-100">{Number(row.lunchDeduct) > 0 ? `৳${row.lunchDeduct}` : "0"}</td>
                        <td className="px-3 py-3 border-r border-slate-100">{row.pf}</td>
                        <td className="px-3 py-3 border-r border-slate-100">{row.tax}</td>
                        <td className="px-3 py-3 font-mono text-rose-600 border-r border-slate-100">{Number(row.absentDeduct) > 0 ? `৳${row.absentDeduct}` : "0"}</td>
                        <td className="px-3 py-3 border-r border-slate-100">{row.advance}</td>
                        <td className="px-3 py-3 border-r border-slate-100">৳{row.adjust}</td>
                        <td className="px-3 py-3 border-r border-slate-100">৳{row.wagelyAdv}</td>
                        <td className="px-3 py-3 border-r border-slate-100">{row.loan}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {isDataLoaded && (
              <div className="p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/30 text-xs font-bold text-slate-400">
                <div>
                  Showing 1 to {mockData.length} of {mockData.length} entries
                </div>
                <div className="flex gap-2 items-center">
                  <span className="cursor-not-allowed opacity-50 mr-2">Previous</span>
                  <button className="h-7 w-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-extrabold shadow-sm shadow-blue-500/10">1</button>
                  <span className="cursor-not-allowed opacity-50 ml-2">Next</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
