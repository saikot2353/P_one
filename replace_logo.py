import os
import glob
import re

files = [
    "src/routes/inv-issue-list.tsx",
    "src/routes/inv-receive-list.tsx",
    "src/routes/inv-issue-return.tsx",
    "src/routes/inv-issue-mrr-return.tsx"
]

import_statement = 'import pakizaLogo from "@/components/Pakiza-Software-bgless-e1692258364537.webp";\n'

for fpath in files:
    if not os.path.exists(fpath):
        continue
    
    with open(fpath, "r") as f:
        content = f.read()
    
    # 1. Add import if not present
    if "Pakiza-Software-bgless-e1692258364537.webp" not in content:
        # Find the last import
        import_match = list(re.finditer(r'^import .*;', content, re.MULTILINE))
        if import_match:
            last_import = import_match[-1]
            content = content[:last_import.end()] + "\n" + import_statement + content[last_import.end():]
            
    # 2. Replace the HTML block
    # Pattern to match the whole P PAKIZA SOFTWARE block
    pattern_mrr = r'<div className="flex items-center gap-2 mb-3">\s*<div className="flex items-center justify-center size-10 bg-blue-900.*?Automation</div>\s*</div>\s*</div>'
    pattern_return = r'<div className="flex items-center gap-2">\s*<div className="flex items-center justify-center size-12 bg-blue-900.*?Automation</div>\s*</div>\s*</div>'
    pattern_issue = r'<div className="flex items-center gap-3">\s*<div className="flex items-center justify-center size-12 bg-blue-900.*?Automation</div>\s*</div>\s*</div>'
    pattern_receive = r'<div className="flex items-center gap-2\.5 mb-1\.5">\s*<div className="flex items-center justify-center w-12 h-12 bg-indigo-950.*?Automation</div>'

    replacement = '<img src={pakizaLogo} alt="Pakiza Software" className="h-10 object-contain mb-2" />'
    
    content = re.sub(pattern_mrr, replacement, content, flags=re.DOTALL)
    content = re.sub(pattern_return, replacement, content, flags=re.DOTALL)
    content = re.sub(pattern_issue, replacement, content, flags=re.DOTALL)
    content = re.sub(pattern_receive, replacement, content, flags=re.DOTALL)
    
    with open(fpath, "w") as f:
        f.write(content)

