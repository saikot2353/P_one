import re

with open('src/routes/changes.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('system_changes_v206', 'system_changes_v207')

with open('src/routes/changes.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/routes/-changes-data.ts', 'r', encoding='utf-8') as f:
    data_content = f.read()

from datetime import datetime
now = datetime.now()
timestamp = now.strftime('%Y-%m-%dT%H:%M')
new_id = "191"

new_record = f"""  {{
    id: "{new_id}",
    date: "{timestamp}",
    type: "Feature Update",
    module: "Payroll Advance",
    link: "/payroll-advance",
    descriptionEn: "Added detailed requisition view modal mimicking the salary advance requisition layout. Allows comprehensive view of employee info, requested amount, advance history, and multi-level approval workflows.",
    descriptionBn: "Payroll Advance-এ বিস্তারিত রিকুইজিশন ভিউ মোডাল যুক্ত করা হয়েছে, যেখানে এমপ্লয়ির তথ্য, হিস্ট্রি এবং অ্যাপ্রুভাল ওয়ার্কফ্লো দেখা যায়।",
  }},
"""

data_content = data_content.replace('];', new_record + '];')

with open('src/routes/-changes-data.ts', 'w', encoding='utf-8') as f:
    f.write(data_content)
