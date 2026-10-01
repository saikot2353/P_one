import os
import re

files = [
    "src/routes/hr-report-absent-counseling.tsx",
    "src/routes/hr-report-attendance-and-overtime.tsx",
    "src/routes/hr-report-attendance-details-prevabsent.tsx",
    "src/routes/hr-report-attendance-details.tsx",
    "src/routes/hr-report-night-card.tsx",
    "src/routes/hr-report-separation-list.tsx",
    "src/routes/hr-report-tiffin-allowance-all.tsx",
    "src/routes/hr-report-tiffin-card.tsx",
    "src/routes/hr-report-without-in-out-attendance.tsx"
]

def replace_modal(match):
    modal_content = match.group(0)
    modal_content = re.sub(r'(\s+)title=(["{])', r'\1reportTitle=\2', modal_content)
    modal_content = re.sub(r'\s+subtitle=\{.*?\}', '', modal_content, flags=re.DOTALL)
    modal_content = re.sub(r'\s+subtitle=".*?"', '', modal_content, flags=re.DOTALL)
    modal_content = re.sub(r'\s+filters=\{.*?\}', '', modal_content, flags=re.DOTALL)
    modal_content = re.sub(r'\s+landscape=\{.*?\}', '', modal_content, flags=re.DOTALL)
    return modal_content

for filepath in files:
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r') as f:
        content = f.read()

    content = re.sub(r'<HRReportPdfModal\b.*?\/>', replace_modal, content, flags=re.DOTALL)
    
    with open(filepath, 'w') as f:
        f.write(content)
        
    print(f"Fixed {filepath}")
