import re
from datetime import datetime
import os

# Read changes.tsx to update version
with open('src/routes/changes.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find current version
match = re.search(r'system_changes_v(\d+)', content)
if match:
    old_ver = int(match.group(1))
    new_ver = old_ver + 1
    content = content.replace(f'system_changes_v{old_ver}', f'system_changes_v{new_ver}')
    with open('src/routes/changes.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Updated version to v{new_ver}')

# Update -changes-data.ts
with open('src/routes/-changes-data.ts', 'r', encoding='utf-8') as f:
    data = f.read()

# find highest id
id_match = re.findall(r'id:\s*\"(\d+)\"', data)
new_id = str(int(max(id_match, key=int)) + 1) if id_match else '100'

timestamp = datetime.now().strftime('%Y-%m-%dT%H:%M')

new_record = f"""  {{
    id: "{new_id}",
    date: "{timestamp}",
    type: "Design Update",
    module: "All Approvals",
    link: "/all-approvals",
    descriptionEn: "Copied the detailed Advance requisition view modal from Payroll Advance to the All Approvals page for a consistent and premium approval experience across the app.",
    descriptionBn: "পে-রোল অ্যাডভান্স থেকে বিস্তারিত রিকুইজিশন ভিউ মোডালটি অল অ্যাপ্রুভালস পেজেও কপি করা হয়েছে, যাতে অ্যাপ্রুভালের অভিজ্ঞতা সব জায়গায় একই রকম এবং উন্নত হয়।",
  }},
"""

data = data.replace('];', new_record + '];')

with open('src/routes/-changes-data.ts', 'w', encoding='utf-8') as f:
    f.write(data)
print(f'Added change record {new_id}')
