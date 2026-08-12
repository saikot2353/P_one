import re

file_path = "/Volumes/Office Files/1. Projects/criptonhris/src/routes/merchandising-pre-costing.tsx"

with open(file_path, "r") as f:
    content = f.read()

right_aligned = [
    'Order Qty', 'Unit Price', 'Total Price',
    'GSM', 'Order Qty (Dzn)', 'Cons/Dzn', 'Fabric Qty', 'Rate', 'Cost',
    'Yarn Qty (Kg)', 'Rate ($/Kg)',
    'Quantity', 'Pr.Qty (Kg)', 'Prs.Loss %', 'Quantity (Dzn)', 'Rate per Dzn',
    'CM / Pcs', 'CM / Dzn', 'CM Cost', 'Commission (%)', 'Commission Value',
    'Qty (Dzn)', 'Rate/Dzn', 'Percentage (%)', 'Sample Fabric Qty (Kg)', 'Sample Fabric Rate',
    'CPM ($)', 'SMV', 'Efficiency %', 'GMT/PC', 'GMT/UOM', 'SAM/PC', 'CM/DOZEN'
]

# We need to format the list as a javascript array
js_array = str(right_aligned)

def replacer(match):
    padding = match.group(1) # e.g. "px-4 py-2.5" or "px-3 py-2.5"
    return f'className={{`{padding} font-black text-slate-500 uppercase tracking-wider text-[8.5px] ${{{js_array}.includes(h) ? "text-right" : "text-left"}}`}}'

pattern = r'className="(px-[34] py-2\.5) text-left font-black text-slate-500 uppercase tracking-wider text-\[8\.5px\]"'

new_content = re.sub(pattern, replacer, content)

with open(file_path, "w") as f:
    f.write(new_content)
    
print("Done")
