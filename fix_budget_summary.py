import re

file_path = "/Volumes/Office Files/1. Projects/criptonhris/src/routes/merchandising-quotation.tsx"

with open(file_path, "r") as f:
    content = f.read()

# Find the budget summary block
start_str = "                  {/* ── BUDGET SUMMARY ── */}"
end_str = "                  })()}\n"
start_idx = content.find(start_str)
end_idx = content.find(end_str, start_idx) + len(end_str)

block = content[start_idx:end_idx]

# Perform replacements to fix spacing and card size
block = block.replace(
    'className="mt-8 mb-4 border border-slate-200 shadow-sm rounded-xl overflow-hidden max-w-2xl mx-auto print:max-w-none print:shadow-none print:border-slate-300"',
    'className="border border-slate-300 shadow-sm rounded-lg overflow-hidden w-full print:max-w-none print:shadow-none print:border-slate-300"'
)

block = block.replace(
    'className="bg-white border-b border-slate-200 px-5 py-3.5 flex items-center gap-2.5"',
    'className="bg-white border-b border-slate-300 px-3 py-2.5 flex items-center gap-2"'
)

block = block.replace('text-[10.5px]', 'text-[9.5px]')
block = block.replace('text-[12px]', 'text-[10.5px]')
block = block.replace('text-[11px]', 'text-[9.5px]')
block = block.replace('px-5 py-3.5', 'px-3 py-1.5')
block = block.replace('px-5 py-3', 'px-3 py-1.5')
block = block.replace('px-5 py-2.5', 'px-3 py-1.5')
block = block.replace('px-5 py-2', 'px-3 py-1')
block = block.replace('px-5 pt-4 pb-1.5', 'px-3 pt-2.5 pb-1')

# Replace the block
final_content = content[:start_idx] + block + content[end_idx:]

with open(file_path, "w") as f:
    f.write(final_content)
print("Done")
