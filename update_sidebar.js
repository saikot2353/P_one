const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/InventorySidebar.tsx', 'utf8');

// Replace imports
code = code.replace(/import \{[\s\S]*?\} from "lucide-react";/, `import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FileText,
  Blocks,
  Settings,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  LifeBuoy,
} from "lucide-react";`);

// Replace nav array
code = code.replace(/export const nav: NavItem\[\] = \[[\s\S]*?\];/m, `export const nav: NavItem[] = [
  { label: "Dashboard", to: "/inventory-dashboard", icon: LayoutDashboard },
  {
    label: "Items & Catalog",
    icon: Blocks,
    subitems: [
      { label: "Item Master", to: "/inventory-items" },
      { label: "Categories", to: "/inventory-categories" },
    ],
  },
  {
    label: "Purchases",
    icon: ShoppingCart,
    subitems: [
      { label: "Purchase Orders", to: "/inventory-po" },
      { label: "Good Receive Notes", to: "/inventory-grn" },
    ],
  },
  {
    label: "Inventory Operations",
    icon: Package,
    subitems: [
      { label: "Stock Adjustment", to: "/inventory-adjustment" },
      { label: "Issue Materials", to: "/inventory-issue" },
      { label: "Return Materials", to: "/inventory-return" },
    ],
  },
  {
    label: "Reports",
    icon: FileText,
    subitems: [
      { label: "Stock Ledger", to: "/inventory-ledger" },
      { label: "Low Stock Alerts", to: "/inventory-low-stock" },
    ],
  },
  {
    label: "Settings",
    icon: Settings,
    to: "/inventory-settings",
  }
];`);

// Replace Sidebar function name
code = code.replace("export function Sidebar() {", "export function InventorySidebar() {");

fs.writeFileSync('src/components/dashboard/InventorySidebar.tsx', code);
