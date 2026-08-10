import { createFileRoute } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Box,
  ShoppingCart,
  Users,
  Store,
  Clock
} from "lucide-react";
import { 
  AreaChart, Area, 
  BarChart, Bar,
  ComposedChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export const Route = createFileRoute("/inv-dashboard")({
  component: InvDashboardPage,
});

// --- Mock Data ---
const movementData = [
  { name: "Mon", issued: 120, received: 400 },
  { name: "Tue", issued: 300, received: 300 },
  { name: "Wed", issued: 250, received: 600 },
  { name: "Thu", issued: 400, received: 200 },
  { name: "Fri", issued: 150, received: 800 },
  { name: "Sat", issued: 90, received: 150 },
  { name: "Sun", issued: 50, received: 100 },
];

const deptConsumption = [
  { name: "IT", value: 45000 },
  { name: "HR", value: 12000 },
  { name: "Finance", value: 18000 },
  { name: "Ops", value: 65000 },
  { name: "Marketing", value: 8000 },
];

const monthlyTrend = [
  { month: "Jan", issues: 4000, receipts: 4500, value: 2400 },
  { month: "Feb", issues: 3000, receipts: 3200, value: 2210 },
  { month: "Mar", issues: 5000, receipts: 4800, value: 2290 },
  { month: "Apr", issues: 4780, receipts: 5000, value: 2000 },
  { month: "May", issues: 5890, receipts: 6100, value: 2181 },
  { month: "Jun", issues: 4390, receipts: 4300, value: 2500 },
];

const categoryData = [
  { name: "Stationary", value: 40, color: "#6366f1" },
  { name: "Electronics", value: 30, color: "#0ea5e9" },
  { name: "Raw Mat", value: 20, color: "#f43f5e" },
  { name: "Hardware", value: 10, color: "#8b5cf6" },
];

const recentAlerts = [
  { id: 1, item: "A4 Paper", category: "Stationary", stock: 5, status: "Critical" },
  { id: 2, item: "Mouse", category: "Electronics", stock: 12, status: "Low" },
  { id: 3, item: "Toner", category: "Stationary", stock: 2, status: "Critical" },
  { id: 4, item: "HDMI Cable", category: "Hardware", stock: 15, status: "Low" },
  { id: 5, item: "Keyboard", category: "Electronics", stock: 3, status: "Critical" },
];

const recentActivity = [
  { id: 1, action: "Issue Processed", ref: "IS-1112", user: "Tahmid", time: "10m ago", type: "out" },
  { id: 2, action: "MRR Received", ref: "MRR-592", user: "Rajon", time: "1h ago", type: "in" },
  { id: 3, action: "Return", ref: "RT-884", user: "Sohan", time: "2h ago", type: "in" },
  { id: 4, action: "Adjustment", ref: "ADJ-102", user: "System", time: "3h ago", type: "neutral" },
  { id: 5, action: "Issue Processed", ref: "IS-1113", user: "Tahmid", time: "4h ago", type: "out" },
];

const topMoving = [
  { id: 1, item: "A4 Paper Rim", code: "P-001", velocity: "High", trend: "+12%" },
  { id: 2, item: "Blue Pen", code: "P-005", velocity: "High", trend: "+8%" },
  { id: 3, item: "SSD 512GB", code: "E-102", velocity: "Med", trend: "-2%" },
  { id: 4, item: "Cat6 Cable", code: "E-145", velocity: "Med", trend: "+5%" },
  { id: 5, item: "Stapler", code: "S-088", velocity: "Low", trend: "-1%" },
];

function InvDashboardPage() {
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      <InventorySidebar />
      <main className="flex-1 min-w-0 flex flex-col relative pb-8">
        <InventoryTopbar />
        
        <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full max-w-[1800px] mx-auto overflow-x-hidden">
          
          {/* Header Row */}
          <div className="flex justify-between items-center bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="size-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="size-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-slate-800 uppercase">Inventory Command Center</h1>
                <p className="text-xs text-slate-500 font-bold tracking-widest uppercase mt-0.5">Live Metrics & Analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                Last Sync: Just Now
              </span>
            </div>
          </div>

          {/* 6 KPI Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
            
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start relative z-10">
                <div className="flex-1 min-w-0 pr-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 truncate">Total Stock Items</div>
                  <div className="text-2xl font-black text-slate-800">24,592</div>
                  <div className="text-[10px] font-bold text-emerald-500 mt-2 flex items-center gap-1 truncate"><ArrowUpRight className="size-3.5"/> +12% YoY</div>
                </div>
                <div className="size-10 shrink-0 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Package className="size-5" /></div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start relative z-10">
                <div className="flex-1 min-w-0 pr-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 truncate">Total Value (BDT)</div>
                  <div className="text-2xl font-black text-slate-800">1.45M</div>
                  <div className="text-[10px] font-bold text-red-500 mt-2 flex items-center gap-1 truncate"><ArrowDownRight className="size-3.5"/> -2.4% MoM</div>
                </div>
                <div className="size-10 shrink-0 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><Wallet className="size-5" /></div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start relative z-10">
                <div className="flex-1 min-w-0 pr-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 truncate">Low Stock Alerts</div>
                  <div className="text-2xl font-black text-slate-800">14</div>
                  <div className="text-[10px] font-bold text-amber-500 mt-2 flex items-center gap-1 truncate"><AlertTriangle className="size-3.5"/> 3 Critical</div>
                </div>
                <div className="size-10 shrink-0 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><AlertTriangle className="size-5" /></div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start relative z-10">
                <div className="flex-1 min-w-0 pr-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 truncate">Pending MRR</div>
                  <div className="text-2xl font-black text-slate-800">8</div>
                  <div className="text-[10px] font-bold text-slate-400 mt-2 flex items-center gap-1 truncate"><Clock className="size-3.5"/> Needs Approval</div>
                </div>
                <div className="size-10 shrink-0 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><ShoppingCart className="size-5" /></div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start relative z-10">
                <div className="flex-1 min-w-0 pr-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 truncate">Active Depts</div>
                  <div className="text-2xl font-black text-slate-800">22</div>
                  <div className="text-[10px] font-bold text-emerald-500 mt-2 flex items-center gap-1 truncate"><TrendingUp className="size-3.5"/> Issuing Actively</div>
                </div>
                <div className="size-10 shrink-0 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><Users className="size-5" /></div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start relative z-10">
                <div className="flex-1 min-w-0 pr-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 truncate">Total Stores</div>
                  <div className="text-2xl font-black text-slate-800">4</div>
                  <div className="text-[10px] font-bold text-slate-400 mt-2 flex items-center gap-1 truncate">Across Locations</div>
                </div>
                <div className="size-10 shrink-0 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center"><Store className="size-5" /></div>
              </div>
            </div>

          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[320px]">
            
            {/* Area Chart: 7-Day Movement */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col h-[320px] lg:h-full">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">7-Day Transaction Flow</h2>
                </div>
              </div>
              <div className="flex-1 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={movementData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="cIssue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="cRec" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }} />
                    <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '6px', fontWeight: 'bold', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="issued" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#cIssue)" name="Issued" />
                    <Area type="monotone" dataKey="received" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#cRec)" name="Received" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart: Dept Consumption */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col h-[320px] lg:h-full">
              <div className="mb-6">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Top Issuing Depts</h2>
              </div>
              <div className="flex-1 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptConsumption} margin={{ top: 0, right: 10, left: 0, bottom: 0 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 'bold' }} width={80} />
                    <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '6px', fontWeight: 'bold', border: '1px solid #e2e8f0' }} cursor={{fill: '#f8fafc'}}/>
                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} name="Cost (BDT)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[340px]">
            
            {/* Pie Chart: Distribution */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col h-[340px] lg:h-full">
              <div className="mb-4 text-center">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Inventory Composition</h2>
              </div>
              <div className="flex-1 w-full relative flex items-center justify-center min-h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none">
                      {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '6px', fontWeight: 'bold', border: '1px solid #e2e8f0' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total</div>
                  <div className="text-2xl font-black text-slate-800">100%</div>
                </div>
              </div>
              <div className="flex justify-center gap-x-4 gap-y-2 mt-4 flex-wrap">
                {categoryData.map((cat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="size-3 rounded-sm" style={{ backgroundColor: cat.color }}></div>
                    <span className="text-[11px] font-bold text-slate-600 whitespace-nowrap">{cat.name} ({cat.value}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Composed Chart: 6-Month Trend */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col h-[340px] lg:h-full">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">6-Month Macro Trends</h2>
                </div>
              </div>
              <div className="flex-1 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }} />
                    <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '6px', fontWeight: 'bold', border: '1px solid #e2e8f0' }} />
                    <Bar dataKey="receipts" barSize={20} fill="#94a3b8" radius={[4, 4, 0, 0]} name="Receipts" />
                    <Bar dataKey="issues" barSize={20} fill="#334155" radius={[4, 4, 0, 0]} name="Issues" />
                    <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} dot={{r: 5, fill: '#6366f1'}} name="Trend Index" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Bottom Row: 3 Compact Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Low Stock Alerts Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle className="size-4 text-amber-500" /> Action Required
                </h2>
                <button className="text-[11px] font-bold text-blue-600 hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <th className="py-3 px-5">Item Name</th>
                      <th className="py-3 px-5 text-center">Qty</th>
                      <th className="py-3 px-5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-semibold text-slate-600 divide-y divide-slate-50">
                    {recentAlerts.map(alert => (
                      <tr key={alert.id} className="hover:bg-slate-50">
                        <td className="py-4 px-5 text-slate-800 font-bold truncate max-w-[150px]">{alert.item}</td>
                        <td className="py-4 px-5 text-center">
                          <span className="bg-slate-100 px-3 py-1 rounded-md text-slate-700 font-bold">{alert.stock}</span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-widest font-black border ${
                            alert.status === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {alert.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Box className="size-4 text-blue-500" /> Recent Activity
                </h2>
                <button className="text-[11px] font-bold text-blue-600 hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <th className="py-3 px-5 w-10"></th>
                      <th className="py-3 px-2">Action</th>
                      <th className="py-3 px-5">Ref</th>
                      <th className="py-3 px-5 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-semibold text-slate-600 divide-y divide-slate-50">
                    {recentActivity.map(activity => (
                      <tr key={activity.id} className="hover:bg-slate-50">
                        <td className="py-4 pl-5 pr-2 text-center">
                          {activity.type === 'out' && <TrendingDown className="size-4 text-red-500 inline" />}
                          {activity.type === 'in' && <TrendingUp className="size-4 text-emerald-500 inline" />}
                          {activity.type === 'neutral' && <Activity className="size-4 text-slate-400 inline" />}
                        </td>
                        <td className="py-4 px-2 text-slate-800 font-bold">{activity.action}</td>
                        <td className="py-4 px-5 text-blue-600 font-bold">{activity.ref}</td>
                        <td className="py-4 px-5 text-right text-slate-400 italic text-[11px]">{activity.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Moving Items Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="size-4 text-emerald-500" /> Fast Movers
                </h2>
                <button className="text-[11px] font-bold text-blue-600 hover:underline">Analyze</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <th className="py-3 px-5">Item</th>
                      <th className="py-3 px-5 text-center">Velocity</th>
                      <th className="py-3 px-5 text-right">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-semibold text-slate-600 divide-y divide-slate-50">
                    {topMoving.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-4 px-5 text-slate-800 font-bold truncate max-w-[150px]">{item.item}</td>
                        <td className="py-4 px-5 text-center">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${
                            item.velocity === 'High' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            item.velocity === 'Med' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}>
                            {item.velocity}
                          </span>
                        </td>
                        <td className={`py-4 px-5 text-right font-black ${item.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                          {item.trend}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
