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
  ShoppingCart
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const Route = createFileRoute("/inv-dashboard")({
  component: InvDashboardPage,
});

// --- Mock Data for Charts ---
const movementData = [
  { name: "Mon", issued: 120, received: 400 },
  { name: "Tue", issued: 300, received: 300 },
  { name: "Wed", issued: 250, received: 600 },
  { name: "Thu", issued: 400, received: 200 },
  { name: "Fri", issued: 150, received: 800 },
  { name: "Sat", issued: 90, received: 150 },
  { name: "Sun", issued: 50, received: 100 },
];

const categoryData = [
  { name: "Stationary", value: 400, color: "#3b82f6" },
  { name: "Electronics", value: 300, color: "#10b981" },
  { name: "Raw Materials", value: 300, color: "#f59e0b" },
  { name: "Hardware", value: 200, color: "#6366f1" },
];

const recentAlerts = [
  { id: 1, item: "A4 Paper Rim", category: "Stationary", stock: 5, status: "Critical" },
  { id: 2, item: "Wireless Mouse", category: "Electronics", stock: 12, status: "Low" },
  { id: 3, item: "Blue Ink Cartridge", category: "Stationary", stock: 8, status: "Critical" },
  { id: 4, item: "HDMI Cable (2m)", category: "Hardware", stock: 15, status: "Low" },
];

const recentActivity = [
  { id: 1, action: "Issue Processed", ref: "IS-1112", user: "Tahmid Afsar", time: "10 mins ago", type: "out" },
  { id: 2, action: "MRR Received", ref: "MRR-592", user: "Rajon", time: "1 hour ago", type: "in" },
  { id: 3, action: "Issue Returned", ref: "RT-884", user: "Sohan", time: "2 hours ago", type: "in" },
  { id: 4, action: "Stock Adjustment", ref: "ADJ-102", user: "System", time: "3 hours ago", type: "neutral" },
];

function InvDashboardPage() {
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      <InventorySidebar />
      <main className="flex-1 min-w-0 flex flex-col relative pb-10">
        <InventoryTopbar />
        
        <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full max-w-[1600px] mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-800 flex items-center gap-2">
                <Activity className="size-7 text-blue-600" />
                Inventory Overview
              </h1>
              <p className="text-[13px] text-slate-500 font-medium mt-1">
                Real-time metrics and alerts for your warehouse operations
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-[11px] font-bold text-slate-600 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                LIVE UPDATES ACTIVE
              </div>
            </div>
          </div>

          {/* KPI Cards (Compact Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-colors">
              <div className="absolute -right-4 -top-4 size-24 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Items in Stock</div>
                  <div className="text-2xl font-black text-slate-800">24,592</div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-2">
                    <ArrowUpRight className="size-3.5" />
                    <span>+12.5% from last month</span>
                  </div>
                </div>
                <div className="size-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
                  <Package className="size-5" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-amber-300 transition-colors">
              <div className="absolute -right-4 -top-4 size-24 bg-amber-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Low Stock Alerts</div>
                  <div className="text-2xl font-black text-slate-800">14</div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 mt-2">
                    <ArrowUpRight className="size-3.5" />
                    <span>+3 requiring action</span>
                  </div>
                </div>
                <div className="size-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-sm">
                  <AlertTriangle className="size-5" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-colors">
              <div className="absolute -right-4 -top-4 size-24 bg-emerald-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Stock Value</div>
                  <div className="text-2xl font-black text-slate-800">৳ 1.45M</div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-red-500 mt-2">
                    <ArrowDownRight className="size-3.5" />
                    <span>-2.4% from last month</span>
                  </div>
                </div>
                <div className="size-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
                  <Wallet className="size-5" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-purple-300 transition-colors">
              <div className="absolute -right-4 -top-4 size-24 bg-purple-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Pending Returns</div>
                  <div className="text-2xl font-black text-slate-800">8</div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mt-2">
                    <TrendingUp className="size-3.5" />
                    <span>Across 3 different sites</span>
                  </div>
                </div>
                <div className="size-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-sm">
                  <ShoppingCart className="size-5" />
                </div>
              </div>
            </div>

          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Area Chart: Movements */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-[13px] font-black text-slate-800 uppercase tracking-wide">Stock Movement</h2>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">Issues vs Receives (Last 7 Days)</p>
                </div>
                <select className="h-8 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 px-2 outline-none">
                  <option>Last 7 Days</option>
                  <option>This Month</option>
                  <option>This Year</option>
                </select>
              </div>
              <div className="flex-1 min-h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={movementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIssued" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: 'bold' }}
                      itemStyle={{ padding: '2px 0' }}
                    />
                    <Area type="monotone" dataKey="issued" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorIssued)" name="Issued Qty" />
                    <Area type="monotone" dataKey="received" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorReceived)" name="Received Qty" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart: Distribution */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col">
              <div className="mb-2">
                <h2 className="text-[13px] font-black text-slate-800 uppercase tracking-wide">Category Distribution</h2>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Stock value by group</p>
              </div>
              <div className="flex-1 min-h-[200px] w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</div>
                  <div className="text-xl font-black text-slate-800">1.2K</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {categoryData.map((cat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="size-2.5 rounded-sm" style={{ backgroundColor: cat.color }}></div>
                    <span className="text-[10px] font-bold text-slate-600 truncate">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Row: Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Low Stock Alerts Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-[12px] font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
                  <AlertTriangle className="size-4 text-amber-500" />
                  Action Required
                </h2>
                <button className="text-[10px] font-bold text-blue-600 hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-2.5 px-4">Item Name</th>
                      <th className="py-2.5 px-4">Category</th>
                      <th className="py-2.5 px-4 text-center">Stock</th>
                      <th className="py-2.5 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-[11px] font-semibold text-slate-700 divide-y divide-slate-50">
                    {recentAlerts.map(alert => (
                      <tr key={alert.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-800">{alert.item}</td>
                        <td className="py-3 px-4 text-slate-500">{alert.category}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">{alert.stock}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`px-2 py-1 rounded-md text-[9px] font-black tracking-widest uppercase ${
                            alert.status === 'Critical' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
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
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-[12px] font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
                  <Box className="size-4 text-blue-500" />
                  Recent Activity
                </h2>
                <button className="text-[10px] font-bold text-blue-600 hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-2.5 px-4 w-10"></th>
                      <th className="py-2.5 px-2">Action</th>
                      <th className="py-2.5 px-4 text-center">Ref</th>
                      <th className="py-2.5 px-4">User</th>
                      <th className="py-2.5 px-4 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="text-[11px] font-semibold text-slate-700 divide-y divide-slate-50">
                    {recentActivity.map(activity => (
                      <tr key={activity.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 pl-4 pr-2 text-center">
                          {activity.type === 'out' && <TrendingDown className="size-3.5 text-blue-500 inline" />}
                          {activity.type === 'in' && <TrendingUp className="size-3.5 text-emerald-500 inline" />}
                          {activity.type === 'neutral' && <Activity className="size-3.5 text-slate-400 inline" />}
                        </td>
                        <td className="py-3 px-2 font-bold text-slate-800">{activity.action}</td>
                        <td className="py-3 px-4 text-center text-blue-600 underline cursor-pointer">{activity.ref}</td>
                        <td className="py-3 px-4 text-slate-500">{activity.user}</td>
                        <td className="py-3 px-4 text-right text-slate-400 italic text-[10px]">{activity.time}</td>
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
