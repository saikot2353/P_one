import re

file_path = "/Volumes/Office Files/1. Projects/criptonhris/src/routes/merchandising-order-profile.tsx"

with open(file_path, "r") as f:
    content = f.read()

# We want to replace everything from <div className="overflow-x-auto"> to </section> 
# that follows Style Master Data.

start_str = '          <div className="overflow-x-auto">'
end_str = '        </section>'

start_idx = content.find(start_str)
if start_idx == -1:
    print("Could not find start string")
    exit(1)

end_idx = content.find(end_str, start_idx)
if end_idx == -1:
    print("Could not find end string")
    exit(1)

replacement = """          <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
            {/* Main Style Card */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
              {/* Header row (Summary) */}
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/60 flex flex-wrap gap-6 justify-between items-start bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-black text-sm w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-500/30">
                    #1
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">ABC <span className="text-slate-400 dark:text-slate-500 font-medium text-sm ml-2">01 White</span></h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-0.5">Boyes T-Shirts - Short Sleeves</p>
                  </div>
                </div>
                
                <div className="flex gap-8">
                  <div className="text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Order Qty</p>
                    <p className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">7,000</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Unit Price</p>
                    <p className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">$ 5.00</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Delivery</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">31 Jul 2026</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors" title="Edit Style">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors" title="Delete Style">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>

              {/* Attributes (Tags) */}
              <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700/60 bg-white dark:bg-slate-800 flex flex-wrap gap-2 items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2">Attributes:</span>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">Size: XS-3XL</span>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-500/20">Print: Pigment</span>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-100 dark:border-fuchsia-500/20">Embroidery: Plain</span>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-500/20">Wash: Garment Dyed</span>
              </div>

              {/* Nested Tables for BOM */}
              <div className="p-4 bg-slate-50/30 dark:bg-slate-900/20 space-y-4">
                
                {/* Fabric Table */}
                <div className="border border-emerald-200 dark:border-emerald-500/30 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2.5 flex justify-between items-center border-b border-emerald-100 dark:border-emerald-500/20">
                    <h4 className="text-xs font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-3 bg-emerald-500 rounded-sm"></div>
                      Fabric Requirements
                    </h4>
                    <button onClick={() => setShowFabricModal(true)} className="px-3 py-1 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 rounded-md shadow-sm transition-colors flex items-center gap-1">
                      <Plus size={12} strokeWidth={3} /> Add Fabric
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[10px] whitespace-nowrap text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800">
                      <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                        <tr>
                          <th className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50">GMT Item</th>
                          <th className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50">Body Part</th>
                          <th className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50">Construction</th>
                          <th className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50">Composition</th>
                          <th className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50 text-right">GSM</th>
                          <th className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50">Dyeing/Finish</th>
                          <th className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50 text-right">Cons/Qty</th>
                          <th className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50 text-right">Total Fab</th>
                          <th className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50 text-center w-12">Act</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-3 py-2">Boyes T-Shirts</td>
                          <td className="px-3 py-2"><span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-medium text-slate-700 dark:text-slate-300">Body</span></td>
                          <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-200">Single Jersey</td>
                          <td className="px-3 py-2 truncate max-w-[150px]">98% Cotton 2% Spandex</td>
                          <td className="px-3 py-2 text-right font-mono font-medium">160</td>
                          <td className="px-3 py-2 truncate max-w-[120px]">Heat Set, Stenter</td>
                          <td className="px-3 py-2 text-right font-mono">2.805</td>
                          <td className="px-3 py-2 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400">1,718.06</td>
                          <td className="px-3 py-2 text-center">
                            <button className="text-slate-400 hover:text-rose-500 transition-colors"><X size={14}/></button>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-3 py-2">Boyes T-Shirts</td>
                          <td className="px-3 py-2"><span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-medium text-slate-700 dark:text-slate-300">Rib</span></td>
                          <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-200">2X2 Lycra Rib</td>
                          <td className="px-3 py-2 truncate max-w-[150px]">98% Cotton 2% Spandex</td>
                          <td className="px-3 py-2 text-right font-mono font-medium">240</td>
                          <td className="px-3 py-2 truncate max-w-[120px]">Brushing, Compacting</td>
                          <td className="px-3 py-2 text-right font-mono">0.589</td>
                          <td className="px-3 py-2 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400">360.79</td>
                          <td className="px-3 py-2 text-center">
                            <button className="text-slate-400 hover:text-rose-500 transition-colors"><X size={14}/></button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Yarn Table */}
                <div className="border border-purple-200 dark:border-purple-500/30 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-purple-50 dark:bg-purple-500/10 px-4 py-2.5 flex justify-between items-center border-b border-purple-100 dark:border-purple-500/20">
                    <h4 className="text-xs font-black text-purple-800 dark:text-purple-400 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-3 bg-purple-500 rounded-sm"></div>
                      Yarn Requirements
                    </h4>
                    <button onClick={() => setShowYarnModal(true)} className="px-3 py-1 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-slate-700 text-[10px] font-bold text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30 rounded-md shadow-sm transition-colors flex items-center gap-1">
                      <Plus size={12} strokeWidth={3} /> Add Yarn
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[10px] whitespace-nowrap text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800">
                      <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                        <tr>
                          <th className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50">Body Part</th>
                          <th className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50">Yarn Type</th>
                          <th className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50">Composition</th>
                          <th className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50 text-right">Count</th>
                          <th className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50 text-right">Yarn %</th>
                          <th className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50 text-right">Spandex %</th>
                          <th className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50 text-right">Total Yarn</th>
                          <th className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50 text-center w-12">Act</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-3 py-2">Body</td>
                          <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-200">Combed Cotton</td>
                          <td className="px-3 py-2">100% Cotton</td>
                          <td className="px-3 py-2 text-right font-mono font-medium">30/1</td>
                          <td className="px-3 py-2 text-right font-mono">98%</td>
                          <td className="px-3 py-2 text-right font-mono text-slate-400">2%</td>
                          <td className="px-3 py-2 text-right font-mono font-bold text-purple-700 dark:text-purple-400">1,683.70</td>
                          <td className="px-3 py-2 text-center">
                            <button className="text-slate-400 hover:text-rose-500 transition-colors"><X size={14}/></button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Trims Table */}
                <div className="border border-amber-200 dark:border-amber-500/30 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-amber-50 dark:bg-amber-500/10 px-4 py-2.5 flex justify-between items-center border-b border-amber-100 dark:border-amber-500/20">
                    <h4 className="text-xs font-black text-amber-800 dark:text-amber-400 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-3 bg-amber-500 rounded-sm"></div>
                      Trims & Accessories
                    </h4>
                    <button onClick={() => setShowTrimsModal(true)} className="px-3 py-1 bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 text-[10px] font-bold text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 rounded-md shadow-sm transition-colors flex items-center gap-1">
                      <Plus size={12} strokeWidth={3} /> Add Trims
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[10px] whitespace-nowrap text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800">
                      <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                        <tr>
                          <th className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50">Trim Name</th>
                          <th className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50">Color Sense</th>
                          <th className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50 text-right">Req/Dzn</th>
                          <th className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50">UOM</th>
                          <th className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50 text-right">Buffer</th>
                          <th className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50 text-right">Total Qty</th>
                          <th className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50 text-right">Unit Rate</th>
                          <th className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50 text-right">Total Price</th>
                          <th className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50 text-center w-12">Act</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-200">Main Label</td>
                          <td className="px-3 py-2">Matching</td>
                          <td className="px-3 py-2 text-right font-mono">12.00</td>
                          <td className="px-3 py-2">Pcs</td>
                          <td className="px-3 py-2 text-right font-mono text-slate-400">3%</td>
                          <td className="px-3 py-2 text-right font-mono font-medium">7,210</td>
                          <td className="px-3 py-2 text-right font-mono">$ 0.015</td>
                          <td className="px-3 py-2 text-right font-mono font-bold text-amber-700 dark:text-amber-400">$ 108.15</td>
                          <td className="px-3 py-2 text-center">
                            <button className="text-slate-400 hover:text-rose-500 transition-colors"><X size={14}/></button>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-200">Care Label</td>
                          <td className="px-3 py-2">White</td>
                          <td className="px-3 py-2 text-right font-mono">12.00</td>
                          <td className="px-3 py-2">Pcs</td>
                          <td className="px-3 py-2 text-right font-mono text-slate-400">3%</td>
                          <td className="px-3 py-2 text-right font-mono font-medium">7,210</td>
                          <td className="px-3 py-2 text-right font-mono">$ 0.010</td>
                          <td className="px-3 py-2 text-right font-mono font-bold text-amber-700 dark:text-amber-400">$ 72.10</td>
                          <td className="px-3 py-2 text-center">
                            <button className="text-slate-400 hover:text-rose-500 transition-colors"><X size={14}/></button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Add New Style Button */}
            <button className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 font-bold hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-center gap-2 mb-2">
              <Plus size={16} strokeWidth={3} /> Add New Style
            </button>
          </div>
        </section>"""

new_content = content[:start_idx] + replacement + content[end_idx + len(end_str):]

with open(file_path, "w") as f:
    f.write(new_content)

print("Done")
