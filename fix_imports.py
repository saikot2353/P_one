import re
with open('src/routes/all-approvals.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find lucide-react imports block
match = re.search(r'import\s+\{([^}]+)\}\s+from\s+[\'"]lucide-react[\'"];', content)
if match:
    imports_str = match.group(1)
    # Split by comma and strip whitespace
    items = [i.strip() for i in imports_str.split(',') if i.strip()]
    
    # Use a set to deduplicate, but keep 'Calendar as CalendarIcon' format
    unique_items = []
    seen = set()
    for item in items:
        # If it's an alias 'A as B', the identifier is 'B'
        ident = item.split(' as ')[-1].strip()
        if ident not in seen:
            seen.add(ident)
            unique_items.append(item)
    
    new_imports_str = ',\n  '.join(unique_items)
    new_block = f'import {{\n  {new_imports_str}\n}} from "lucide-react";'
    
    content = content.replace(match.group(0), new_block)
    
    with open('src/routes/all-approvals.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Imports deduplicated successfully!')
else:
    print('lucide-react import block not found.')
