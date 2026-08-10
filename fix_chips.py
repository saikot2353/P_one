import re

filepath = "src/routes/inv-dashboard.tsx"
with open(filepath, "r") as f:
    content = f.read()

# Fix Alert Status Chip
content = content.replace('text-[10px] uppercase tracking-widest font-black border', 'text-[9px] uppercase tracking-widest font-bold border')

# Fix Velocity Chip
content = content.replace('text-[10px] font-black uppercase tracking-widest border', 'text-[9px] font-bold uppercase tracking-widest border')

with open(filepath, "w") as f:
    f.write(content)
