const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/Sidebar.tsx', 'utf-8');
content = content.replace(/\r\n/g, '\n');

const target = `    subitems: [
      { label: "New Joining Info", to: "/hr-report-new-joining-info" },
      { label: "Employee Info (Compliance)", to: "/hr-report-employee-info-compliance" },
      { label: "Employee Count", to: "/hr-report-employee-count" },`;

const replacement = `    subitems: [
      { label: "New Joining Info", to: "/hr-report-new-joining-info" },
      { label: "Employee Info (Compliance)", to: "/hr-report-employee-info-compliance" },
      { label: "Separation List", to: "/hr-report-separation-list" },
      { label: "Employee Count", to: "/hr-report-employee-count" },`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/components/dashboard/Sidebar.tsx', content, 'utf-8');
  console.log("Sidebar.tsx updated successfully");
} else {
  console.log("Target not found in Sidebar.tsx");
}
