import re

filepath = "src/routes/inv-dashboard.tsx"
with open(filepath, "r") as f:
    content = f.read()

# Make KPI numbers smaller
content = content.replace('className="text-2xl font-black text-slate-800"', 'className="text-xl font-black text-slate-800"')

# Make Chart titles smaller (text-sm -> text-xs to match Table titles)
content = content.replace('className="text-sm font-black text-slate-800 uppercase tracking-widest"', 'className="text-xs font-black text-slate-800 uppercase tracking-widest"')

with open(filepath, "w") as f:
    f.write(content)
