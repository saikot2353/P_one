const fs = require('fs');

// Helper to write content back if modified
const updateFile = (path, replaceFn) => {
  try {
    let content = fs.readFileSync(path, 'utf-8');
    content = content.replace(/\r\n/g, '\n');
    const updatedContent = replaceFn(content);
    if (updatedContent !== content) {
      fs.writeFileSync(path, updatedContent, 'utf-8');
      console.log(\`✅ Successfully updated \${path}\`);
    } else {
      console.log(\`⚠️ No changes made to \${path}\`);
    }
  } catch (err) {
    console.log(\`❌ Error updating \${path}: \${err.message}\`);
  }
};

// 1. Sidebar.tsx
updateFile('src/components/dashboard/Sidebar.tsx', (content) => {
  const target = \`      { label: "Absenteeism Summary", to: "/hr-report-absenteeism-summary" },\`;
  const replacement = \`      { label: "Absenteeism Summary", to: "/hr-report-absenteeism-summary" },
      { label: "Attendance Details PrevAbsent", to: "/hr-report-attendance-details-prevabsent" },\`;
  return content.includes(target) ? content.replace(target, replacement) : content;
});

// 2. hr-reports.tsx
updateFile('src/routes/hr-reports.tsx', (content) => {
  const target = \`        {
          title: "Absenteeism Summary",
          icon: UserX,
          desc: "Overview of unexcused absences and attendance compliance.",
          to: "/hr-report-absenteeism-summary",
        },\`;
  const replacement = \`        {
          title: "Absenteeism Summary",
          icon: UserX,
          desc: "Overview of unexcused absences and attendance compliance.",
          to: "/hr-report-absenteeism-summary",
        },
        {
          title: "Attendance Details PrevAbsent",
          icon: Clock,
          desc: "Generate and export attendance details for previously absent employees.",
          to: "/hr-report-attendance-details-prevabsent",
        },\`;
  return content.includes(target) ? content.replace(target, replacement) : content;
});

// 3. -changes-data.ts
updateFile('src/routes/-changes-data.ts', (content) => {
  const newRecord = \`  {
    "id": "534",
    "date": "\${new Date().toISOString().slice(0, 16)}",
    "type": "New Feature",
    "module": "HR Reports (Attendance Details PrevAbsent)",
    "link": "/hr-report-attendance-details-prevabsent",
    "descriptionEn": "Implemented a new 'Attendance Details PrevAbsent' report page in the HR Reports section, allowing users to view, filter, and export detailed in/out times for previously absent employees.",
    "descriptionBn": "এইচআর রিপোর্টস সেকশনে নতুন 'Attendance Details PrevAbsent' রিপোর্ট পেজ যুক্ত করা হয়েছে, যেখান থেকে ব্যবহারকারীরা পূর্বে অনুপস্থিত থাকা কর্মীদের নির্দিষ্ট দিনের প্রবেশ ও প্রস্থানের সময় দেখতে ও এক্সপোর্ট করতে পারবেন।"
  },\n\`;
  const target = \`export const DEFAULT_CHANGE_RECORDS: ChangeRecord[] = [\n\`;
  return content.includes(target) ? content.replace(target, target + newRecord) : content;
});

// 4. changes.tsx (Bump v548 to v549)
updateFile('src/routes/changes.tsx', (content) => {
  let updated = content.replace(/system_changes_v548/g, 'system_changes_v549');
  return updated;
});
