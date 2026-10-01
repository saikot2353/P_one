const fs = require('fs');
let content = fs.readFileSync('src/routes/hr-reports.tsx', 'utf-8');
content = content.replace(/\r\n/g, '\n');

const target = `        {
          title: "New Joining Info",
          icon: UserPlus,
          desc: "Detailed report of newly onboarded employees and joining dates.",
          to: "/hr-report-new-joining-info",
        },`;

const replacement = `        {
          title: "New Joining Info",
          icon: UserPlus,
          desc: "Detailed report of newly onboarded employees and joining dates.",
          to: "/hr-report-new-joining-info",
        },
        {
          title: "Separation List",
          icon: UserMinus,
          desc: "Detailed report of separated employees.",
          to: "/hr-report-separation-list",
        },`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  
  // also add UserMinus import
  if (!content.includes('UserMinus')) {
    content = content.replace('UserPlus,', 'UserPlus,\n  UserMinus,');
  }

  fs.writeFileSync('src/routes/hr-reports.tsx', content, 'utf-8');
  console.log("hr-reports.tsx updated successfully");
} else {
  console.log("Target not found in hr-reports.tsx");
}
