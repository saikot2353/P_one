const fs = require('fs');

// 1. Sidebar.tsx
let sidebar = fs.readFileSync('src/components/dashboard/Sidebar.tsx', 'utf-8');
const sidebarTarget1 = '        { label: "Continuous Absent", to: "/hr-report-continuous-absent" },\r\n';
const sidebarTarget2 = '        { label: "Continuous Absent", to: "/hr-report-continuous-absent" },\n';
sidebar = sidebar.replace(sidebarTarget1, '').replace(sidebarTarget2, '');
fs.writeFileSync('src/components/dashboard/Sidebar.tsx', sidebar, 'utf-8');

// 2. hr-reports.tsx
let hrReports = fs.readFileSync('src/routes/hr-reports.tsx', 'utf-8');
hrReports = hrReports.replace(/\r\n/g, '\n');

const hrReportsTarget = `          {
            title: "Continuous Absent",
            icon: UserX,
            desc: "Report on employees absent continuously beyond policy limits.",
            to: "/hr-report-continuous-absent",
          },
`;
hrReports = hrReports.replace(hrReportsTarget, '');
fs.writeFileSync('src/routes/hr-reports.tsx', hrReports, 'utf-8');

// 3. Update changes.tsx
let changes = fs.readFileSync('src/routes/changes.tsx', 'utf-8');
changes = changes.replace(/system_changes_v554/g, 'system_changes_v555');
fs.writeFileSync('src/routes/changes.tsx', changes, 'utf-8');
console.log("Removed the duplicate Continuous Absent submenu.");
