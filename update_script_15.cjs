const fs = require('fs');

const updateFile = (path, replaceFn) => {
  try {
    let content = fs.readFileSync(path, 'utf-8');
    content = content.replace(/\r\n/g, '\n');
    const updatedContent = replaceFn(content);
    if (updatedContent !== content) {
      fs.writeFileSync(path, updatedContent, 'utf-8');
      console.log("Successfully updated " + path);
    } else {
      console.log("No changes made to " + path);
    }
  } catch (err) {
    console.log("Error updating " + path + ": " + err.message);
  }
};

updateFile('src/components/dashboard/Sidebar.tsx', (content) => {
  const target = '      { label: "Absenteeism Summary", to: "/hr-report-absenteeism-summary" },';
  const replacement = '      { label: "Absenteeism Summary", to: "/hr-report-absenteeism-summary" },\n      { label: "Attendance Details PrevAbsent", to: "/hr-report-attendance-details-prevabsent" },';
  return content.includes(target) ? content.replace(target, replacement) : content;
});

updateFile('src/routes/hr-reports.tsx', (content) => {
  const target = '        {\n          title: "Absenteeism Summary",\n          icon: UserX,\n          desc: "Overview of unexcused absences and attendance compliance.",\n          to: "/hr-report-absenteeism-summary",\n        },';
  const replacement = '        {\n          title: "Absenteeism Summary",\n          icon: UserX,\n          desc: "Overview of unexcused absences and attendance compliance.",\n          to: "/hr-report-absenteeism-summary",\n        },\n        {\n          title: "Attendance Details PrevAbsent",\n          icon: Clock,\n          desc: "Generate and export attendance details for previously absent employees.",\n          to: "/hr-report-attendance-details-prevabsent",\n        },';
  return content.includes(target) ? content.replace(target, replacement) : content;
});

updateFile('src/routes/-changes-data.ts', (content) => {
  const newRecord = '  {\n    "id": "534",\n    "date": "' + new Date().toISOString().slice(0, 16) + '",\n    "type": "New Feature",\n    "module": "HR Reports (Attendance Details PrevAbsent)",\n    "link": "/hr-report-attendance-details-prevabsent",\n    "descriptionEn": "Implemented a new Attendance Details PrevAbsent report page in the HR Reports section, allowing users to view, filter, and export detailed in/out times for previously absent employees.",\n    "descriptionBn": "এইচআর রিপোর্টস সেকশনে নতুন Attendance Details PrevAbsent রিপোর্ট পেজ যুক্ত করা হয়েছে, যেখান থেকে ব্যবহারকারীরা পূর্বে অনুপস্থিত থাকা কর্মীদের নির্দিষ্ট দিনের প্রবেশ ও প্রস্থানের সময় দেখতে ও এক্সপোর্ট করতে পারবেন।"\n  },\n';
  const target = 'export const DEFAULT_CHANGE_RECORDS: ChangeRecord[] = [\n';
  return content.includes(target) ? content.replace(target, target + newRecord) : content;
});

updateFile('src/routes/changes.tsx', (content) => {
  return content.replace(/system_changes_v548/g, 'system_changes_v549');
});
