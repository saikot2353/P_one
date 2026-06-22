import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  ChevronRight, Users, ShieldAlert, ShieldCheck, Plus, Search,
  Pencil, Trash2, X, Check, HelpCircle, Info, Shield, Key, Eye,
  Lock, Settings
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/permission-management")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tab: (search.tab as string) || "permissions",
    };
  },
  head: () => ({
    meta: [
      { title: "Permission Management — CRIPTON" },
      { name: "description", content: "Configure role-based access control, system roles, and user permission overrides." },
    ],
  }),
  component: PermissionManagementPage,
});

interface UserItem {
  sl: number;
  name: string;
  email: string;
  empId: string;
  userId: string;
  role: string;
  department: string;
  lastLogin: string;
  isActive: "Active" | "Inactive";
  phone?: string;
  password?: string;
  redirectUrl?: string;
  companyAccess?: string[];
}

interface RoleItem {
  sl: number;
  name: string;
  isActive: "Active" | "Inactive";
}

interface PermissionRow {
  sl: number;
  role: string;
  menu: string;
  read: boolean;
  write: boolean;
  full: boolean;
  sync: boolean;
  prevDate: boolean;
}

interface UserOverrideRow {
  sl: number;
  empId: string;
  menu: string;
  read: boolean;
  write: boolean;
  full: boolean;
  sync: boolean;
  prevDate: boolean;
}

// ----------------------------------------------------
// Mock Seeds
// ----------------------------------------------------
const SEED_USERS: UserItem[] = [
  { sl: 1, name: "Tahmid Afsar", email: "tahmid.bd@pakizasoftware.com", empId: "2023043910", userId: "2023043910", role: "Admin", department: "Business Innovation", lastLogin: "—", isActive: "Active", password: "password123", companyAccess: ["All"] },
  { sl: 2, name: "Tahsin Ahmed", email: "tahsin.cmr@pakizaknit.com", empId: "2021026991", userId: "2021026991", role: "employee", department: "Procurement and Supply Chain - (Procurement and Supply Chain)", lastLogin: "—", isActive: "Active", password: "password123", companyAccess: ["Pakiza Knit Composite Ltd"] },
  { sl: 3, name: "Shanewas Hossen", email: "shahnewas.account@pakizaknit.com", empId: "2019016666", userId: "2019016666", role: "employee", department: "Accounts & Finance - (Accounts & Finance)", lastLogin: "—", isActive: "Active", password: "password123", companyAccess: ["Pakiza Knit Composite Ltd"] },
  { sl: 4, name: "Suman Mazumder", email: "suman@pfd-global.com", empId: "2024050708", userId: "2024050708", role: "employee", department: "Marketing and Merchandising - (Marketing and Merchandising)", lastLogin: "—", isActive: "Active", password: "password123", companyAccess: ["Pakiza Knit Composite Ltd"] },
  { sl: 5, name: "Sultan Ahmed", email: "sultan.ba@pakizasoftware.com", empId: "2023045044", userId: "2023045044", role: "employee", department: "Implementation & Business Analysis - (Business Analysis)", lastLogin: "2026-05-12 15:48:06", isActive: "Active", password: "password123", companyAccess: ["Pakiza Software Limited"] },
  { sl: 6, name: "Md. Jamshed Alam", email: "jamshed.alam@pakizaknit.com", empId: "2014001017", userId: "2014001017", role: "HOD", department: "Management", lastLogin: "—", isActive: "Active", password: "password123", companyAccess: ["All"] },
  { sl: 7, name: "Md. Tuhin Hosen", email: "mdtuhin.dyeing@pakizaknit.com", empId: "2021028128", userId: "2021028128", role: "employee", department: "Fabrics Department - (Finish Fabric Store (MCD))", lastLogin: "—", isActive: "Active", password: "password123", companyAccess: ["Pakiza Knit Composite Ltd"] },
  { sl: 8, name: "Md. Shameem", email: "shamim.ahmed@pakizaknit.com", empId: "2018012755", userId: "2018012755", role: "HOD", department: "RMG Operations - (Embroidery)", lastLogin: "—", isActive: "Active", password: "password123", companyAccess: ["Pakiza Knit Composite Ltd"] },
  { sl: 9, name: "Tushar Kanti Das", email: "tushar.kanti@pakizaknit.com", empId: "2016005888", userId: "2016005888", role: "HOD", department: "Admin", lastLogin: "2026-04-02 13:11:13", isActive: "Active", password: "password123", companyAccess: ["Pakiza Knit Composite Ltd", "Pakiza Software Limited"] },
  { sl: 10, name: "Kanak Das", email: "kanakdas01914@gmail.com", empId: "2019016183", userId: "2019016183", role: "employee", department: "—", lastLogin: "—", isActive: "Active", password: "password123", companyAccess: ["Pakiza Knit Composite Ltd"] },
  { sl: 11, name: "Md. Saeid Maruf", email: "syed.maruf@pakizaknit.com", empId: "2014001111", userId: "2014001111", role: "HOD", department: "Production Planning - (Production Planning)", lastLogin: "—", isActive: "Active", password: "password123", companyAccess: ["Pakiza Knit Composite Ltd"] },
  { sl: 12, name: "Md. Tariql Islam", email: "tariqul.rmg@pakizaknit.com", empId: "2021027208", userId: "2021027208", role: "employee", department: "Finishing Department - (Finishing)", lastLogin: "—", isActive: "Active", password: "password123", companyAccess: ["Pakiza Knit Composite Ltd"] },
  { sl: 13, name: "Md. Ruhul Amin Chowdhury", email: "faysal.amin@pakizaknit.com", empId: "2016001098", userId: "2016001098", role: "HOD", department: "Marketing and Merchandising - (Marketing and Merchandising)", lastLogin: "—", isActive: "Active", password: "password123", companyAccess: ["Pakiza Knit Composite Ltd"] },
  { sl: 14, name: "Admin User", email: "admin@pakiza.com", empId: "ADMIN01", userId: "admin", role: "Admin", department: "IT Department", lastLogin: "—", isActive: "Active", password: "admin", companyAccess: ["All"] }
];

const SEED_ROLES: RoleItem[] = [
  { sl: 1, name: "Admin", isActive: "Active" },
  { sl: 2, name: "employee", isActive: "Active" },
  { sl: 3, name: "Reception", isActive: "Active" },
  { sl: 4, name: "management", isActive: "Active" },
  { sl: 5, name: "HOD", isActive: "Active" }
];

const SEED_PERMISSIONS: PermissionRow[] = [
  // Admin permissions for all 40 menus
  { sl: 1, role: "Admin", menu: "Dashboard", read: true, write: true, full: true, sync: true, prevDate: true },
  { sl: 2, role: "Admin", menu: "SSP - New Requisition", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 3, role: "Admin", menu: "SSP - My Requisition", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 4, role: "Admin", menu: "SSP - Approval", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 5, role: "Admin", menu: "SSP - Attendance", read: true, write: true, full: true, sync: true, prevDate: false },
  { sl: 6, role: "Admin", menu: "Configure - Structure Setup", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 7, role: "Admin", menu: "Configure - Job & Employee Setup", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 8, role: "Admin", menu: "Configure - Shift & Time Rules", read: true, write: true, full: true, sync: true, prevDate: true },
  { sl: 9, role: "Admin", menu: "Configure - Allowances & Bonuses", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 10, role: "Admin", menu: "Configure - Education & Training", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 11, role: "Admin", menu: "Configure - Leave & Policies", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 12, role: "Admin", menu: "Personnel Info - Personnel List", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 13, role: "Admin", menu: "Personnel Info - Approval", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 14, role: "Admin", menu: "Attendance - Manual Attendance", read: true, write: true, full: true, sync: true, prevDate: true },
  { sl: 15, role: "Admin", menu: "Attendance - Manual Attendance Approval", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 16, role: "Admin", menu: "Attendance - Employee Job Card", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 17, role: "Admin", menu: "Roster - Create Roster", read: true, write: true, full: true, sync: true, prevDate: false },
  { sl: 18, role: "Admin", menu: "Roster - Company Holiday", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 19, role: "Admin", menu: "Leave - Leave Application", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 20, role: "Admin", menu: "Leave - Leave Approve", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 21, role: "Admin", menu: "Leave - Leave List", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 22, role: "Admin", menu: "KPI Performance - Dashboard", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 23, role: "Admin", menu: "KPI Performance - Cycles", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 24, role: "Admin", menu: "KPI Performance - Criteria Setup", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 25, role: "Admin", menu: "KPI Performance - My Self-Assessment", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 26, role: "Admin", menu: "KPI Performance - 360° Peer Review", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 27, role: "Admin", menu: "KPI Performance - Assessment Workflow", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 28, role: "Admin", menu: "KPI Performance - KPI Reports", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 29, role: "Admin", menu: "Evaluation - Increment Configurator", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 30, role: "Admin", menu: "Evaluation - Evaluation Propose", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 31, role: "Admin", menu: "Evaluation - Propose Increment", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 32, role: "Admin", menu: "Evaluation - Increment Summary", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 33, role: "Admin", menu: "Evaluation - Approve Increment", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 34, role: "Admin", menu: "Evaluation - Increment List", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 35, role: "Admin", menu: "Evaluation - Increment History", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 36, role: "Admin", menu: "Transfer - Transfer History", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 37, role: "Admin", menu: "Transfer - Approve Transfer", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 38, role: "Admin", menu: "HR Policy - JD List", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 39, role: "Admin", menu: "HR Policy - JD Approvals", read: true, write: true, full: true, sync: false, prevDate: false },
  { sl: 40, role: "Admin", menu: "User Management", read: true, write: true, full: true, sync: false, prevDate: false },

  // employee permissions - subset of menus
  { sl: 41, role: "employee", menu: "Dashboard", read: true, write: false, full: false, sync: false, prevDate: false },
  { sl: 42, role: "employee", menu: "SSP - New Requisition", read: true, write: true, full: false, sync: false, prevDate: false },
  { sl: 43, role: "employee", menu: "SSP - My Requisition", read: true, write: true, full: false, sync: false, prevDate: false },
  { sl: 44, role: "employee", menu: "SSP - Attendance", read: true, write: false, full: false, sync: false, prevDate: false },
  { sl: 45, role: "employee", menu: "Leave - Leave Application", read: true, write: true, full: false, sync: false, prevDate: false },
  { sl: 46, role: "employee", menu: "Leave - Leave List", read: true, write: false, full: false, sync: false, prevDate: false },
  { sl: 47, role: "employee", menu: "KPI Performance - My Self-Assessment", read: true, write: true, full: false, sync: false, prevDate: false },

  // HOD permissions - subset of menus
  { sl: 48, role: "HOD", menu: "Dashboard", read: true, write: true, full: false, sync: true, prevDate: false },
  { sl: 49, role: "HOD", menu: "SSP - Approval", read: true, write: true, full: false, sync: false, prevDate: false },
  { sl: 50, role: "HOD", menu: "Personnel Info - Personnel List", read: true, write: false, full: false, sync: false, prevDate: false },
  { sl: 51, role: "HOD", menu: "Leave - Leave Approve", read: true, write: true, full: false, sync: false, prevDate: false },
  { sl: 52, role: "HOD", menu: "KPI Performance - 360° Peer Review", read: true, write: true, full: false, sync: false, prevDate: false },
  { sl: 53, role: "HOD", menu: "KPI Performance - Assessment Workflow", read: true, write: true, full: false, sync: false, prevDate: false }
];

const SEED_OVERRIDES: UserOverrideRow[] = [
  { sl: 1, empId: "2023043910", menu: "Configure - Structure Setup", read: true, write: false, full: false, sync: false, prevDate: false },
  { sl: 2, empId: "2023043910", menu: "User Management", read: true, write: true, full: true, sync: true, prevDate: true }
];

const AVAILABLE_MENUS = [
  "Dashboard",
  "SSP - New Requisition",
  "SSP - My Requisition",
  "SSP - Approval",
  "SSP - Attendance",
  "Configure - Structure Setup",
  "Configure - Job & Employee Setup",
  "Configure - Shift & Time Rules",
  "Configure - Allowances & Bonuses",
  "Configure - Education & Training",
  "Configure - Leave & Policies",
  "Personnel Info - Personnel List",
  "Personnel Info - Approval",
  "Attendance - Manual Attendance",
  "Attendance - Manual Attendance Approval",
  "Attendance - Employee Job Card",
  "Roster - Create Roster",
  "Roster - Company Holiday",
  "Leave - Leave Application",
  "Leave - Leave Approve",
  "Leave - Leave List",
  "KPI Performance - Dashboard",
  "KPI Performance - Cycles",
  "KPI Performance - Criteria Setup",
  "KPI Performance - My Self-Assessment",
  "KPI Performance - 360° Peer Review",
  "KPI Performance - Assessment Workflow",
  "KPI Performance - KPI Reports",
  "Evaluation - Increment Configurator",
  "Evaluation - Evaluation Propose",
  "Evaluation - Propose Increment",
  "Evaluation - Increment Summary",
  "Evaluation - Approve Increment",
  "Evaluation - Increment List",
  "Evaluation - Increment History",
  "Transfer - Transfer History",
  "Transfer - Approve Transfer",
  "HR Policy - JD List",
  "HR Policy - JD Approvals",
  "User Management"
];

function PermissionManagementPage() {
  const { tab = "permissions" } = Route.useSearch();
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [permissions, setPermissions] = useState<PermissionRow[]>([]);
  const [overrides, setOverrides] = useState<UserOverrideRow[]>([]);

  // LocalStorage state loading
  useEffect(() => {
    const safeLoad = (key: string, seed: any) => {
      if (typeof window !== "undefined") {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            return JSON.parse(data);
          } catch (e) {
            return seed;
          }
        }
        localStorage.setItem(key, JSON.stringify(seed));
      }
      return seed;
    };

    setUsers(safeLoad("cripton_user_list", SEED_USERS));
    setRoles(safeLoad("cripton_role_list", SEED_ROLES));
    setPermissions(safeLoad("cripton_permissions_list", SEED_PERMISSIONS));
    setOverrides(safeLoad("cripton_overrides_list", SEED_OVERRIDES));
  }, []);

  const saveUsers = (updated: UserItem[]) => {
    setUsers(updated);
    localStorage.setItem("cripton_user_list", JSON.stringify(updated));
  };

  const saveRoles = (updated: RoleItem[]) => {
    setRoles(updated);
    localStorage.setItem("cripton_role_list", JSON.stringify(updated));
  };

  const savePermissions = (updated: PermissionRow[]) => {
    setPermissions(updated);
    localStorage.setItem("cripton_permissions_list", JSON.stringify(updated));
  };

  const saveOverrides = (updated: UserOverrideRow[]) => {
    setOverrides(updated);
    localStorage.setItem("cripton_overrides_list", JSON.stringify(updated));
  };

  const [selectedRoleFilter, setSelectedRoleFilter] = useState("Admin");
  const [selectedMainMenu, setSelectedMainMenu] = useState("Select Main Menu");
  const [selectedOverrideUser, setSelectedOverrideUser] = useState("2023043910");

  // Role Form Modal State
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRoleSl, setEditingRoleSl] = useState<number | null>(null);
  const [roleName, setRoleName] = useState("");
  const [roleIsActive, setRoleIsActive] = useState<"Active" | "Inactive">("Active");

  // Role form actions
  const openRoleForm = (sl: number | null) => {
    setEditingRoleSl(sl);
    if (sl !== null) {
      const role = roles.find(r => r.sl === sl);
      setRoleName(role?.name || "");
      setRoleIsActive(role?.isActive || "Active");
    } else {
      setRoleName("");
      setRoleIsActive("Active");
    }
    setIsRoleModalOpen(true);
  };

  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName) {
      toast.error("Role Name is required");
      return;
    }
    let updatedRoles = [...roles];
    if (editingRoleSl !== null) {
      const oldRole = roles.find(r => r.sl === editingRoleSl);
      updatedRoles = roles.map(r => r.sl === editingRoleSl ? { ...r, name: roleName, isActive: roleIsActive } : r);
      // Renames mapping
      if (oldRole) {
        const nextPerms = permissions.map(p => p.role === oldRole.name ? { ...p, role: roleName } : p);
        savePermissions(nextPerms);
      }
      toast.success("Role updated successfully");
    } else {
      const nextSl = roles.length > 0 ? Math.max(...roles.map(r => r.sl)) + 1 : 1;
      updatedRoles.push({ sl: nextSl, name: roleName, isActive: roleIsActive });
      toast.success("New role added successfully");
    }
    saveRoles(updatedRoles);
    setIsRoleModalOpen(false);
  };

  const handleDeleteRole = (sl: number) => {
    const target = roles.find(r => r.sl === sl);
    if (!target) return;
    if (confirm(`Delete the role "${target.name}"? This deletes all associated page permission mappings.`)) {
      const updated = roles.filter(r => r.sl !== sl).map((r, idx) => ({ ...r, sl: idx + 1 }));
      const nextPerms = permissions.filter(p => p.role !== target.name);
      saveRoles(updated);
      savePermissions(nextPerms);
      toast.success("Role and modular permission configs deleted");
    }
  };

  // Permission binds actions
  const handleAddPermissionRoute = () => {
    if (selectedMainMenu === "Select Main Menu") {
      toast.error("Please select a route menu to register mapping");
      return;
    }

    const exists = permissions.some(p => p.role === selectedRoleFilter && p.menu === selectedMainMenu);
    if (exists) {
      toast.error("This menu route is already assigned to this role");
      return;
    }

    const nextSl = permissions.length > 0 ? Math.max(...permissions.map(p => p.sl)) + 1 : 1;
    const newPerm: PermissionRow = {
      sl: nextSl,
      role: selectedRoleFilter,
      menu: selectedMainMenu,
      read: true,
      write: false,
      full: false,
      sync: false,
      prevDate: false
    };

    savePermissions([...permissions, newPerm]);
    toast.success(`Registered route "${selectedMainMenu}" to "${selectedRoleFilter}" permissions`);
  };

  const handleUpdatePermissionValue = (sl: number, field: keyof Omit<PermissionRow, "sl" | "role" | "menu">, value: boolean) => {
    const updated = permissions.map(p => {
      if (p.sl === sl) {
        const next = { ...p, [field]: value };
        if (field === "full" && value) {
          next.read = true;
          next.write = true;
        }
        return next;
      }
      return p;
    });
    savePermissions(updated);
  };

  const handleDeletePermission = (sl: number) => {
    const updated = permissions.filter(p => p.sl !== sl).map((p, idx) => ({ ...p, sl: idx + 1 }));
    savePermissions(updated);
    toast.success("Permission record removed");
  };

  // User Wise overrides logic
  const activeOverrideUser = useMemo(() => {
    return users.find(u => u.empId === selectedOverrideUser) || null;
  }, [users, selectedOverrideUser]);

  const userWisePermissionsData = useMemo(() => {
    if (!activeOverrideUser) return [];
    const baseRole = activeOverrideUser.role;
    const baseRolePerms = permissions.filter(p => p.role === baseRole);

    return baseRolePerms.map((base, idx) => {
      const userCustom = overrides.find(o => o.empId === activeOverrideUser.empId && o.menu === base.menu);
      return {
        sl: idx + 1,
        menu: base.menu,
        hasOverride: !!userCustom,
        read: userCustom ? userCustom.read : base.read,
        write: userCustom ? userCustom.write : base.write,
        full: userCustom ? userCustom.full : base.full,
        sync: userCustom ? userCustom.sync : base.sync,
        prevDate: userCustom ? userCustom.prevDate : base.prevDate
      };
    });
  }, [activeOverrideUser, permissions, overrides]);

  const handleToggleOverride = (menu: string, checkState: boolean) => {
    if (!activeOverrideUser) return;
    if (checkState) {
      const baseMatch = permissions.find(p => p.role === activeOverrideUser.role && p.menu === menu);
      const nextSl = overrides.length > 0 ? Math.max(...overrides.map(o => o.sl)) + 1 : 1;
      const newOverride: UserOverrideRow = {
        sl: nextSl,
        empId: activeOverrideUser.empId,
        menu,
        read: baseMatch ? baseMatch.read : true,
        write: baseMatch ? baseMatch.write : false,
        full: baseMatch ? baseMatch.full : false,
        sync: baseMatch ? baseMatch.sync : false,
        prevDate: baseMatch ? baseMatch.prevDate : false
      };
      saveOverrides([...overrides, newOverride]);
      toast.success(`Activated user override settings for "${menu}"`);
    } else {
      const nextOverrides = overrides.filter(o => !(o.empId === activeOverrideUser.empId && o.menu === menu));
      saveOverrides(nextOverrides);
      toast.info(`Reverted "${menu}" to system role defaults`);
    }
  };

  const handleDeleteOverride = (menu: string) => {
    if (!activeOverrideUser) return;
    const nextOverrides = overrides.filter(o => !(o.empId === activeOverrideUser.empId && o.menu === menu));
    saveOverrides(nextOverrides);
    toast.info(`Reverted "${menu}" to system role defaults`);
  };

  const handleUpdateOverrideValue = (menu: string, field: keyof Omit<UserOverrideRow, "sl" | "empId" | "menu">, value: boolean) => {
    if (!activeOverrideUser) return;
    const exists = overrides.some(o => o.empId === activeOverrideUser.empId && o.menu === menu);
    let updated: UserOverrideRow[];

    if (exists) {
      updated = overrides.map(o => {
        if (o.empId === activeOverrideUser.empId && o.menu === menu) {
          const next = { ...o, [field]: value };
          if (field === "full" && value) {
            next.read = true;
            next.write = true;
          }
          return next;
        }
        return o;
      });
    } else {
      const baseMatch = permissions.find(p => p.role === activeOverrideUser.role && p.menu === menu);
      const nextSl = overrides.length > 0 ? Math.max(...overrides.map(o => o.sl)) + 1 : 1;
      const newOverride: UserOverrideRow = {
        sl: nextSl,
        empId: activeOverrideUser.empId,
        menu,
        read: baseMatch ? baseMatch.read : false,
        write: baseMatch ? baseMatch.write : false,
        full: baseMatch ? baseMatch.full : false,
        sync: baseMatch ? baseMatch.sync : false,
        prevDate: baseMatch ? baseMatch.prevDate : false
      };
      newOverride[field] = value;
      if (field === "full" && value) {
        newOverride.read = true;
        newOverride.write = true;
      }
      updated = [...overrides, newOverride];
      toast.success(`Custom override activated for "${menu}"`);
    }
    saveOverrides(updated);
  };

  const activeRolePermissions = useMemo(() => {
    return permissions.filter(p => p.role === selectedRoleFilter);
  }, [permissions, selectedRoleFilter]);

  const roleSelectOptions = useMemo(() => {
    return roles.filter(r => r.isActive === "Active").map(r => ({ value: r.name, label: r.name }));
  }, [roles]);

  const menuSelectOptions = useMemo(() => {
    return AVAILABLE_MENUS.map(m => ({ value: m, label: m }));
  }, []);

  const userSelectOptions = useMemo(() => {
    return users.map(u => ({ value: u.empId, label: `${u.empId} - ${u.name} (${u.role})` }));
  }, [users]);

  const setTab = (newTab: string) => {
    navigate({ search: { tab: newTab } as any });
  };

  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Topbar />

        {/* Content Container */}
        <div className="flex-1 overflow-hidden flex flex-col px-6 py-4 gap-4 bg-[#f8fafc] dark:bg-[#090d16]">
          
          {/* Breadcrumbs Banner */}
          <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/80 uppercase tracking-widest font-semibold">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="size-3 text-muted-foreground/60" />
              <span className="text-muted-foreground font-semibold">Administration</span>
              <ChevronRight className="size-3 text-muted-foreground/60" />
              <span className="text-foreground font-semibold">Permission Management</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-primary bg-primary/10 border border-primary/20 rounded-xl px-3 py-1.5 font-semibold uppercase tracking-wider">
                Access Controls
              </span>
            </div>
          </div>

          {/* Master Panel Container */}
          <div className="flex-1 bg-card border border-border rounded-2xl shadow-xs flex flex-col overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 to-primary" />

            {/* Page Header */}
            <div className="px-6 pt-5 pb-3 border-b border-border bg-muted/10 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <Lock className="size-5 text-indigo-500" /> Permission Management
                </h2>
                <p className="text-[9.5px] font-medium text-muted-foreground/80 leading-none mt-1">
                  Configure security privileges, custom roles, and specific user permission overrides.
                </p>
              </div>

              {tab === "roles" && (
                <button
                  onClick={() => openRoleForm(null)}
                  className="h-9 px-4 bg-primary hover:bg-primary/95 text-white font-semibold text-[11px] rounded-xl uppercase tracking-wider flex items-center gap-1.5 transition shadow-2xs"
                >
                  <Plus className="size-4" /> Add Custom Role
                </button>
              )}
            </div>

            {/* Sub Tabs Toggle */}
            <div className="px-6 py-2 border-b border-border bg-[#f8fafc]/50 dark:bg-[#0f172a]/50 shrink-0 flex gap-2">
              {[
                { id: "permissions", label: "Permission Matrix", icon: Shield },
                { id: "roles", label: "Role Directory", icon: Users },
                { id: "user-permissions", label: "User Wise Override", icon: Key }
              ].map(t => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`h-9 px-4 flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider font-semibold transition-all border rounded-xl ${
                      active
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-white dark:bg-slate-900 text-muted-foreground border-border hover:bg-muted"
                    }`}
                  >
                    <Icon className="size-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT PANELS */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-card">
              
              {/* TAB 1: PERMISSION MATRIX SETUP */}
              {tab === "permissions" && (
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  
                  {/* Filter & Assignment Bar */}
                  <div className="px-6 py-4 border-b border-border bg-[#f8fafc]/30 dark:bg-[#0f172a]/30 shrink-0 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-72">
                      <span className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider shrink-0">
                        Access Role:
                      </span>
                      <div className="flex-1">
                        <SearchableSelect
                          options={roleSelectOptions}
                          value={selectedRoleFilter}
                          onChange={setSelectedRoleFilter}
                          placeholder="Select access role..."
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-80">
                        <SearchableSelect
                          options={menuSelectOptions}
                          value={selectedMainMenu}
                          onChange={setSelectedMainMenu}
                          placeholder="Select menu route path..."
                        />
                      </div>
                      <button
                        onClick={handleAddPermissionRoute}
                        className="h-8.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[10px] rounded-xl uppercase tracking-wider flex items-center gap-1.5 transition"
                      >
                        <Plus className="size-3.5" /> Assign Route
                      </button>
                    </div>
                  </div>

                  {/* Permissions Datagrid */}
                  <div className="flex-1 overflow-auto min-h-0">
                    <table className="w-full text-left text-xs border-collapse whitespace-nowrap min-w-[900px]">
                      <thead className="text-muted-foreground uppercase font-semibold tracking-wider text-[9.5px] border-b border-border/50 bg-[#f8fafc] dark:bg-[#0f172a] sticky top-0 z-10">
                        <tr>
                          <th className="px-5 py-4 w-[60px] text-center">#</th>
                          <th className="px-5 py-4 min-w-[250px]">Menu Route Path</th>
                          <th className="px-5 py-4 w-[110px] text-center">Read Only</th>
                          <th className="px-5 py-4 w-[110px] text-center">Write Access</th>
                          <th className="px-5 py-4 w-[110px] text-center">Full Control</th>
                          <th className="px-5 py-4 w-[110px] text-center">Sync Log</th>
                          <th className="px-5 py-4 w-[110px] text-center">Back Date</th>
                          <th className="px-5 py-4 w-[100px] text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30 text-foreground">
                        {activeRolePermissions.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-12 text-center text-[12px] font-medium text-muted-foreground/60">
                              No route permissions assigned to role "{selectedRoleFilter}". Assign a route above.
                            </td>
                          </tr>
                        ) : (
                          activeRolePermissions.map((row, idx) => (
                            <tr key={row.sl} className="group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all">
                              <td className="px-5 py-3.5 text-center font-mono text-slate-500 font-semibold">{idx + 1}</td>
                              <td className="px-5 py-3.5 font-semibold text-foreground/95">{row.menu}</td>
                              <td className="px-5 py-3.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={row.read}
                                  onChange={e => handleUpdatePermissionValue(row.sl, "read", e.target.checked)}
                                  className="size-4 rounded border-border text-primary cursor-pointer transition focus:ring-0"
                                />
                              </td>
                              <td className="px-5 py-3.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={row.write}
                                  onChange={e => handleUpdatePermissionValue(row.sl, "write", e.target.checked)}
                                  className="size-4 rounded border-border text-primary cursor-pointer transition focus:ring-0"
                                />
                              </td>
                              <td className="px-5 py-3.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={row.full}
                                  onChange={e => handleUpdatePermissionValue(row.sl, "full", e.target.checked)}
                                  className="size-4 rounded border-border text-primary cursor-pointer transition focus:ring-0"
                                />
                              </td>
                              <td className="px-5 py-3.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={row.sync}
                                  onChange={e => handleUpdatePermissionValue(row.sl, "sync", e.target.checked)}
                                  className="size-4 rounded border-border text-primary cursor-pointer transition focus:ring-0"
                                />
                              </td>
                              <td className="px-5 py-3.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={row.prevDate}
                                  onChange={e => handleUpdatePermissionValue(row.sl, "prevDate", e.target.checked)}
                                  className="size-4 rounded border-border text-primary cursor-pointer transition focus:ring-0"
                                />
                              </td>
                              <td className="px-5 py-3.5 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleDeletePermission(row.sl)}
                                  className="text-rose-500 hover:text-rose-600 transition"
                                  title="Remove route bindings"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: ROLE MANAGEMENT DIRECTORY */}
              {tab === "roles" && (
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  <div className="flex-1 overflow-auto">
                    <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
                      <thead className="text-muted-foreground uppercase font-semibold tracking-wider text-[9.5px] border-b border-border/50 bg-[#f8fafc] dark:bg-[#0f172a] sticky top-0 z-10">
                        <tr>
                          <th className="px-5 py-4 w-[60px] text-center">#</th>
                          <th className="px-5 py-4 min-w-[200px]">Role Designation</th>
                          <th className="px-5 py-4 w-[150px] text-center">Active Status</th>
                          <th className="px-5 py-4 w-[110px] text-center">Action Controls</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30 text-foreground">
                        {roles.map((r, idx) => (
                          <tr key={r.sl} className="group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all">
                            <td className="px-5 py-3.5 text-center font-mono text-slate-500 font-semibold">{idx + 1}</td>
                            <td className="px-5 py-3.5 font-semibold text-foreground/95">{r.name}</td>
                            <td className="px-5 py-3.5 text-center">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-semibold border uppercase tracking-wider ${
                                r.isActive === "Active"
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                  : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                              }`}>
                                {r.isActive}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <div className="flex items-center justify-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => openRoleForm(r.sl)}
                                  className="text-orange-500 hover:text-orange-600 transition"
                                  title="Rename role designation"
                                >
                                  <Pencil className="size-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteRole(r.sl)}
                                  className="text-rose-500 hover:text-rose-600 transition"
                                  title="Delete role designation"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: USER WISE OVERRIDES MATRIX */}
              {tab === "user-permissions" && (
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  
                  {/* Select User Override Row */}
                  <div className="px-6 py-4 border-b border-border bg-[#f8fafc]/30 dark:bg-[#0f172a]/30 shrink-0 flex items-center gap-4">
                    <div className="flex items-center gap-3 w-96">
                      <span className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider shrink-0">
                        Target User:
                      </span>
                      <div className="flex-1">
                        <SearchableSelect
                          options={userSelectOptions}
                          value={selectedOverrideUser}
                          onChange={setSelectedOverrideUser}
                          placeholder="Search target user..."
                        />
                      </div>
                    </div>

                    {activeOverrideUser && (
                      <div className="flex items-center gap-2 bg-indigo-500/5 border border-indigo-500/10 px-3 py-1.5 rounded-xl">
                        <Shield className="size-3.5 text-indigo-500" />
                        <span className="text-[10.5px] font-medium text-indigo-500/90">
                          Base Role: <strong className="uppercase">{activeOverrideUser.role}</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Overrides Table */}
                  <div className="flex-1 overflow-auto min-h-0">
                    <table className="w-full text-left text-xs border-collapse whitespace-nowrap min-w-[900px]">
                      <thead className="text-muted-foreground uppercase font-semibold tracking-wider text-[9.5px] border-b border-border/50 bg-[#f8fafc] dark:bg-[#0f172a] sticky top-0 z-10">
                        <tr>
                          <th className="px-5 py-4 w-[60px] text-center">#</th>
                          <th className="px-5 py-4 min-w-[250px]">Menu Route Path</th>
                          <th className="px-5 py-4 w-[110px] text-center">Read Only</th>
                          <th className="px-5 py-4 w-[110px] text-center">Write Access</th>
                          <th className="px-5 py-4 w-[110px] text-center">Full Control</th>
                          <th className="px-5 py-4 w-[110px] text-center">Sync Log</th>
                          <th className="px-5 py-4 w-[110px] text-center">Back Date</th>
                          <th className="px-5 py-4 w-[100px] text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30 text-foreground">
                        {userWisePermissionsData.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-12 text-center text-[12px] font-medium text-muted-foreground/60">
                              No permissions associated with this user's base role configuration. Ensure the base role has active permissions.
                            </td>
                          </tr>
                        ) : (
                          userWisePermissionsData.map((row, idx) => (
                            <tr key={row.menu} className={`group transition-all ${
                              row.hasOverride 
                                ? "bg-amber-500/[0.03] dark:bg-amber-500/[0.02] hover:bg-amber-500/[0.08] dark:hover:bg-amber-500/[0.05]" 
                                : "hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d]"
                            }`}>
                              <td className="px-5 py-3.5 text-center font-mono text-slate-500 font-semibold">{idx + 1}</td>
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-foreground/95">{row.menu}</span>
                                  {row.hasOverride && (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-450 border border-amber-500/20 text-[8.5px] font-black uppercase tracking-wider scale-90">
                                      Custom
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-5 py-3.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={row.read}
                                  onChange={e => handleUpdateOverrideValue(row.menu, "read", e.target.checked)}
                                  className="size-4 rounded border-border text-primary cursor-pointer transition focus:ring-0"
                                />
                              </td>
                              <td className="px-5 py-3.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={row.write}
                                  onChange={e => handleUpdateOverrideValue(row.menu, "write", e.target.checked)}
                                  className="size-4 rounded border-border text-primary cursor-pointer transition focus:ring-0"
                                />
                              </td>
                              <td className="px-5 py-3.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={row.full}
                                  onChange={e => handleUpdateOverrideValue(row.menu, "full", e.target.checked)}
                                  className="size-4 rounded border-border text-primary cursor-pointer transition focus:ring-0"
                                />
                              </td>
                              <td className="px-5 py-3.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={row.sync}
                                  onChange={e => handleUpdateOverrideValue(row.menu, "sync", e.target.checked)}
                                  className="size-4 rounded border-border text-primary cursor-pointer transition focus:ring-0"
                                />
                              </td>
                              <td className="px-5 py-3.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={row.prevDate}
                                  onChange={e => handleUpdateOverrideValue(row.menu, "prevDate", e.target.checked)}
                                  className="size-4 rounded border-border text-primary cursor-pointer transition focus:ring-0"
                                />
                              </td>
                              <td className="px-5 py-3.5 text-center">
                                {row.hasOverride ? (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteOverride(row.menu)}
                                    className="text-amber-600 hover:text-amber-700 transition"
                                    title="Revert custom overrides to base role defaults"
                                  >
                                    <Trash2 className="size-4" />
                                  </button>
                                ) : (
                                  <span className="text-slate-300 dark:text-slate-700 font-mono select-none">—</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </main>

      {/* ROLE DICTIONARY MODAL */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-card border border-border/80 w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border/50 bg-[#f8fafc] dark:bg-[#0f172a] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="size-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                  <ShieldAlert className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold tracking-tight text-foreground">
                    {editingRoleSl ? "Edit Access Role" : "Create System Role"}
                  </h2>
                </div>
              </div>
              <button 
                onClick={() => setIsRoleModalOpen(false)}
                className="size-8.5 rounded-xl hover:bg-muted/80 flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground border border-border/20"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleRoleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Role Name *</label>
                  <input
                    type="text"
                    value={roleName}
                    onChange={e => setRoleName(e.target.value)}
                    placeholder="e.g. manager"
                    className="w-full h-10 px-3.5 text-xs font-semibold bg-muted/40 border border-border rounded-xl focus:outline-none focus:border-primary transition"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Status *</label>
                  <select
                    value={roleIsActive}
                    onChange={e => setRoleIsActive(e.target.value as any)}
                    className="w-full h-10 px-3.5 text-xs font-semibold bg-muted/40 border border-border rounded-xl focus:outline-none focus:border-primary transition cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-border/50 pt-5 flex items-center justify-between gap-3 bg-[#f8fafc] dark:bg-[#0f172a] -mx-6 -mb-6 p-6">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="h-10 px-6 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold text-xs transition-all uppercase tracking-wider border border-border shadow-2xs"
                >
                  CLOSE
                </button>
                <button
                  type="submit"
                  className="h-10 px-8 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-xs hover:shadow-sm transition-all uppercase tracking-wider flex items-center gap-1.5"
                >
                  {editingRoleSl ? "UPDATE" : "CREATE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
