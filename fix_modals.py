import re
import os

files = [
    "src/routes/monthly-salary-process.tsx",
    "src/routes/advance-salary-process.tsx",
    "src/routes/yearly-bonus-process.tsx",
    "src/routes/check-approve-salary.tsx"
]

def update_modal(content):
    # DialogContent styling
    content = re.sub(
        r'<DialogContent className="sm:max-w-\[800px\] max-h-\[90vh\] overflow-y-auto.*?>',
        r'<DialogContent className="sm:max-w-[850px] max-h-[90vh] overflow-y-auto bg-slate-50 border-slate-200 shadow-2xl p-6">',
        content
    )
    
    # DialogHeader styling
    content = re.sub(
        r'<DialogHeader>\s*<DialogTitle.*?>(.*?)</DialogTitle>\s*</DialogHeader>',
        r'<DialogHeader className="mb-4">\n                      <DialogTitle className="flex items-center gap-2 text-slate-700 text-lg font-semibold">\n                        <Search className="size-5 text-slate-400" />\n                        \1\n                      </DialogTitle>\n                    </DialogHeader>',
        content,
        flags=re.DOTALL
    )
    
    # Label styling
    content = re.sub(
        r'<label className="text-xs font-medium text-muted-foreground">',
        r'<label className="text-xs font-semibold text-slate-500 mb-1.5 block">',
        content
    )
    
    # Select/Input styling (the standard ones)
    content = re.sub(
        r'className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring.*?"',
        r'className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"',
        content
    )
    
    # DialogFooter styling
    # We replace from DialogFooter to its end
    content = re.sub(
        r'<DialogFooter.*?</DialogFooter>',
        r'<DialogFooter className="pt-6 mt-4 border-t border-slate-200/60">\n                      <Button variant="outline" className="h-10 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-100 font-medium px-6" onClick={() => setIsFilterModalOpen(false)}>Cancel</Button>\n                      <Button variant="default" className="h-10 rounded-lg bg-[#279863] hover:bg-[#208050] text-white font-medium px-6 shadow-sm" onClick={handleFetchData}>\n                        <Search className="size-4 mr-1.5" />\n                        FETCH DATA\n                      </Button>\n                    </DialogFooter>',
        content,
        flags=re.DOTALL
    )

    # Some headers had a bottom border on the title, we want to strip it
    content = re.sub(
        r'<Search className="size-5 text-muted-foreground" />',
        r'',
        content
    )
    
    # For radio buttons next to label
    content = re.sub(
        r'<div className="flex items-center justify-between">\s*<label className="text-xs font-medium text-muted-foreground">Employee ID</label>',
        r'<div className="flex items-center justify-between mb-1.5">\n                          <label className="text-xs font-semibold text-slate-500">EmpId</label>',
        content
    )

    return content

for file_path in files:
    full_path = "/Volumes/Office Files/1. Projects/criptonhris/" + file_path
    if os.path.exists(full_path):
        with open(full_path, "r") as f:
            content = f.read()
            
        new_content = update_modal(content)
        
        with open(full_path, "w") as f:
            f.write(new_content)
        print(f"Updated {file_path}")
    else:
        print(f"File not found: {file_path}")

