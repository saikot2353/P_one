import os
import re

files = [
    "src/routes/inv-config-product-type.tsx",
    "src/routes/inv-config-store-name.tsx",
    "src/routes/inv-config-group-name.tsx",
    "src/routes/inv-config-product-name.tsx",
    "src/routes/inv-config-uom.tsx",
    "src/routes/inv-config-brand.tsx",
    "src/routes/inv-config-model.tsx"
]

def update_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Update the entire Toolbar div block
    # We will find `<div className="p-4 border-b border-border/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/10">`
    # and replace down to the `</div>` just before `{/* Table */}`
    
    toolbar_start_idx = content.find('{/* Toolbar */}')
    table_start_idx = content.find('{/* Table */}')
    
    if toolbar_start_idx != -1 and table_start_idx != -1:
        toolbar_block = content[toolbar_start_idx:table_start_idx]
        
        # Replace the buttons block inside the toolbar block with regex or just direct replacement
        new_toolbar = """{/* Toolbar */}
            <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white">
              
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
                <button className="h-[32px] px-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[10px] uppercase rounded flex items-center gap-1.5 shrink-0 transition-colors shadow-sm">
                  <FileSpreadsheet className="size-3.5 text-emerald-600" /> EXCEL
                </button>
                <button className="h-[32px] px-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[10px] uppercase rounded flex items-center gap-1.5 shrink-0 transition-colors shadow-sm">
                  <Printer className="size-3.5 text-blue-600" /> PRINT
                </button>
                <button className="h-[32px] px-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[10px] uppercase rounded flex items-center gap-1.5 shrink-0 transition-colors shadow-sm">
                  <FileText className="size-3.5 text-red-600" /> PDF
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-64 shrink-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 h-[32px] bg-[#f2f4f7] border border-transparent hover:border-slate-200 focus:bg-white focus:border-blue-500 rounded-md text-[11px] font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
                  />
                </div>
                <button 
                  onClick={openCreateModal}
                  className="h-[32px] px-4 bg-[#0d6efd] hover:bg-blue-700 text-white font-bold text-[11px] rounded flex items-center gap-1.5 shrink-0 shadow-sm transition-colors"
                >
                  <Plus className="size-3.5" strokeWidth={3} />
                  Add New
                </button>
              </div>
            </div>

            """
        content = content[:toolbar_start_idx] + new_toolbar + content[table_start_idx:]
    
    # 2. Update Table Header Tr
    content = re.sub(
        r'<tr className="bg-muted/40 border-b border-border/50 text-\[11px\] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">',
        r'<tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">',
        content
    )
    
    # Update tr hover colors
    content = re.sub(
        r'<tr key=\{item\.id\} className="hover:bg-muted/40 transition duration-150">',
        r'<tr key={item.id} className="hover:bg-slate-50 border-b border-slate-100 transition duration-150">',
        content
    )
    
    # Update action buttons
    content = re.sub(
        r'className="size-6 rounded-md bg-transparent text-amber-600 border border-transparent hover:bg-amber-50 hover:border-amber-200 inline-flex items-center justify-center transition-colors shadow-sm"',
        r'className="size-[26px] rounded-md bg-white border border-slate-200 text-amber-500 hover:bg-amber-50 inline-flex items-center justify-center transition-colors shadow-sm"',
        content
    )
    content = re.sub(
        r'className="size-6 rounded-md bg-transparent text-red-600 border border-transparent hover:bg-red-50 hover:border-red-200 inline-flex items-center justify-center transition-colors shadow-sm"',
        r'className="size-[26px] rounded-md bg-white border border-slate-200 text-red-500 hover:bg-red-50 inline-flex items-center justify-center transition-colors shadow-sm"',
        content
    )
    
    # Update text sizes inside td
    content = re.sub(r'text-xs', 'text-[11px]', content)
    content = re.sub(r'text-\[11px\] font-semibold', 'text-[11px] font-bold', content)
    
    # Update pagination footer
    pagination_pattern = r'<div className="p-4 border-t border-border/50 bg-muted/10 text-xs text-muted-foreground font-semibold flex justify-between items-center">.*?</div>'
    def replace_pagination(m):
        return m.group(0).replace('bg-muted/10 text-xs text-muted-foreground font-semibold', 'bg-white text-[11px] text-slate-500 font-semibold').replace('border-border/50', 'border-slate-200').replace('text-xs', 'text-[11px]')
        
    content = re.sub(pagination_pattern, replace_pagination, content, flags=re.DOTALL)
    
    with open(filepath, 'w') as f:
        f.write(content)
        print(f"Updated {filepath}")

for f in files:
    update_file(f)

