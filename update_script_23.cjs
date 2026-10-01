const fs = require('fs');

// 1. Sidebar.tsx
let sidebar = fs.readFileSync('src/components/dashboard/Sidebar.tsx', 'utf-8');
const sidebarTarget = '        { label: "Continous Absent", to: "/hr-report-continuous-absent" },\n';
const sidebarTargetWin = '        { label: "Continous Absent", to: "/hr-report-continuous-absent" },\r\n';
sidebar = sidebar.replace(sidebarTarget, '').replace(sidebarTargetWin, '');
fs.writeFileSync('src/components/dashboard/Sidebar.tsx', sidebar, 'utf-8');

// 2. hr-reports.tsx
let hrReports = fs.readFileSync('src/routes/hr-reports.tsx', 'utf-8');
hrReports = hrReports.replace(/\r\n/g, '\n');

const hrReportsTarget = `          {
            title: "Continous Absent",
            icon: Clock,
            desc: "Generate and export continuous absentee records and durations for all employees.",
            to: "/hr-report-continuous-absent",
          },
`;
hrReports = hrReports.replace(hrReportsTarget, '');
fs.writeFileSync('src/routes/hr-reports.tsx', hrReports, 'utf-8');

// 3. Update changes.tsx
let changes = fs.readFileSync('src/routes/changes.tsx', 'utf-8');
changes = changes.replace(/system_changes_v555/g, 'system_changes_v556');
fs.writeFileSync('src/routes/changes.tsx', changes, 'utf-8');
console.log("Completely removed Continous Absent from menus.");
