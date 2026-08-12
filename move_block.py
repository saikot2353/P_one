import re

file_path = "/Volumes/Office Files/1. Projects/criptonhris/src/routes/merchandising-quotation.tsx"

with open(file_path, "r") as f:
    content = f.read()

# Find the budget summary block
start_str = "              {/* ── BUDGET SUMMARY ── */}"
end_str = "              })()}\n"
start_idx = content.find(start_str)
end_idx = content.find(end_str, start_idx) + len(end_str)

block = content[start_idx:end_idx]

# Remove the block from its current position
new_content = content[:start_idx] + content[end_idx:]

# Find the target insertion point
target_str = "                    THIS QUOTATION &nbsp; &nbsp; &nbsp; &nbsp; $ {C.fob.toFixed(3)}\n                  </div>\n"
target_idx = new_content.find(target_str) + len(target_str)

# The block originally has indentation for 14 spaces. Let's adjust it to 18 spaces to match inside the col-span-5 div
lines = block.split('\n')
adjusted_lines = []
for line in lines:
    if line.startswith("              "):
        adjusted_lines.append("    " + line)
    else:
        adjusted_lines.append(line)
        
adjusted_block = '\n' + '\n'.join(adjusted_lines).rstrip() + '\n'

# Insert the adjusted block
final_content = new_content[:target_idx] + adjusted_block + new_content[target_idx:]

with open(file_path, "w") as f:
    f.write(final_content)
print("Done")
