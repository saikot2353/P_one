import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  ChevronRight, Users, ShieldAlert, ShieldCheck, Plus, Search,
  Pencil, Trash2, X, Check, Eye, EyeOff, HelpCircle, Info, Printer,
  FileSpreadsheet, FileText, CheckCircle2, UserCheck, Shield,
  User, Mail, Phone, Lock
} from "lucide-react";
import { toast } from "sonner";
import { employeesData } from "@/routes/personnel-list";

export const Route = createFileRoute("/user-management")({
  head: () => ({
    meta: [
      { title: "User Management — CRIPTON" },
      { name: "description", content: "Manage system directory users, status, and company access." },
    ],
  }),
  component: UserManagementPage,
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
  avatar?: string;
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
// Mock Databases
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

function UserManagementPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [permissions, setPermissions] = useState<PermissionRow[]>([]);
  const [overrides, setOverrides] = useState<UserOverrideRow[]>([]);

  // State loading
  useEffect(() => {
    const safeLoad = (key: string, seed: any) => {
      if (typeof window !== "undefined") {
        const data = localStorage.getItem(key);
        if (data) {
          try { return JSON.parse(data); } catch (e) { return seed; }
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

  // State variables for list logic
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("Admin");
  const [selectedMainMenu, setSelectedMainMenu] = useState("Select Main Menu");

  // User list overrides/wise selections
  const [selectedOverrideUser, setSelectedOverrideUser] = useState("2023043910");

  // Modals state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserSl, setEditingUserSl] = useState<number | null>(null);

  // Form inputs - User
  const [createMode, setCreateMode] = useState<"with_id" | "without_id">("with_id");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userEmpId, setUserEmpId] = useState("");
  const [userUserId, setUserUserId] = useState("");
  const [userRole, setUserRole] = useState("employee");
  const [userDepartment, setUserDepartment] = useState("");
  const [userIsActive, setUserIsActive] = useState<"Active" | "Inactive">("Active");
  const [userPassword, setUserPassword] = useState("");
  const [userRedirectUrl, setUserRedirectUrl] = useState("Select Main Menu");
  const [showPassword, setShowPassword] = useState(false);
  const [userCompanyAccess, setUserCompanyAccess] = useState<string[]>([]);
  const [userAvatar, setUserAvatar] = useState("");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserAvatar(reader.result as string);
        toast.success("Profile image loaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  // Synced employee list
  const [employees, setEmployees] = useState<any[]>([]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("recruitment_synced_employees");
      if (data) {
        try {
          setEmployees(JSON.parse(data));
        } catch (e) {
          setEmployees(employeesData);
        }
      } else {
        setEmployees(employeesData);
      }
    }
  }, []);

  // Form inputs - Role
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRoleSl, setEditingRoleSl] = useState<number | null>(null);
  const [roleName, setRoleName] = useState("");
  const [roleIsActive, setRoleIsActive] = useState<"Active" | "Inactive">("Active");

  // User modal open trigger
  const openUserForm = (sl: number | null) => {
    setEditingUserSl(sl);
    setShowPassword(false);
    if (sl !== null) {
      const user = users.find(u => u.sl === sl);
      if (user) {
        const nameParts = (user.name || "").trim().split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";
        
        setUserFirstName(firstName);
        setUserLastName(lastName);
        setUserEmail(user.email || "");
        setUserPhone(user.phone || "");
        setUserEmpId(user.empId || "");
        setUserUserId(user.userId || user.empId || "");
        setUserRole(user.role || "employee");
        setUserDepartment(user.department || "");
        setUserIsActive(user.isActive || "Active");
        setUserPassword(user.password || "");
        setUserRedirectUrl(user.redirectUrl || "Select Main Menu");
        setUserCompanyAccess(user.companyAccess || []);
        setUserAvatar(user.avatar || "");

        const hasMatchingEmp = employees.some(e => e.id === user.empId);
        if (hasMatchingEmp && user.empId !== "N/A" && user.empId !== "") {
          setCreateMode("with_id");
          setSelectedEmployeeId(user.empId);
        } else {
          setCreateMode("without_id");
          setSelectedEmployeeId("");
        }
      }
    } else {
      setCreateMode("with_id");
      setSelectedEmployeeId("");
      setUserFirstName("");
      setUserLastName("");
      setUserEmail("");
      setUserPhone("");
      setUserEmpId("");
      setUserUserId("");
      setUserRole("employee");
      setUserDepartment("");
      setUserIsActive("Active");
      setUserPassword("");
      setUserRedirectUrl("Select Main Menu");
      setUserCompanyAccess([]);
      setUserAvatar("");
    }
    setIsUserModalOpen(true);
  };

  // User select / autocompletion handler
  const handleSelectEmployee = (empId: string) => {
    setSelectedEmployeeId(empId);
    const emp = employees.find(e => e.id === empId);
    if (emp) {
      const nameParts = (emp.name || "").trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      
      setUserFirstName(firstName);
      setUserLastName(lastName);
      setUserEmail(emp.email || "");
      setUserPhone(emp.officeMob || emp.phone || "");
      setUserDepartment(emp.dept || "");
      setUserEmpId(emp.id);
      setUserUserId(emp.id);
      setUserAvatar("");
    }
  };

  // User submit handler
  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFirstName || !userEmail) {
      toast.error("Required fields missing");
      return;
    }
    if (createMode === "with_id" && !userEmpId) {
      toast.error("Please select an Employee ID");
      return;
    }

    const finalUserId = userUserId.trim();
    if (!finalUserId) {
      toast.error("User ID is required");
      return;
    }

    // Check for duplicate User ID
    const userIdExists = users.some(u => u.sl !== editingUserSl && u.userId.toLowerCase() === finalUserId.toLowerCase());
    if (userIdExists) {
      toast.error(`User ID "${finalUserId}" is already taken.`);
      return;
    }

    let finalEmpId = userEmpId.trim();
    if (createMode === "without_id") {
      if (!finalEmpId) {
        const num = Math.floor(1000 + Math.random() * 9000);
        finalEmpId = `USR${num}`;
      }
    }

    const fullName = `${userFirstName.trim()} ${userLastName.trim()}`.trim();

    let updatedUsers = [...users];
    if (editingUserSl !== null) {
      updatedUsers = users.map(u => u.sl === editingUserSl ? {
        ...u, 
        name: fullName, 
        email: userEmail, 
        empId: finalEmpId, 
        userId: finalUserId,
        role: userRole, 
        department: userDepartment, 
        isActive: userIsActive,
        phone: userPhone,
        password: userPassword,
        redirectUrl: userRedirectUrl,
        companyAccess: userCompanyAccess,
        avatar: userAvatar
      } : u);
      toast.success("User profile updated successfully");
    } else {
      const nextSl = users.length > 0 ? Math.max(...users.map(u => u.sl)) + 1 : 1;
      updatedUsers.push({
        sl: nextSl, 
        name: fullName, 
        email: userEmail, 
        empId: finalEmpId, 
        userId: finalUserId,
        role: userRole, 
        department: userDepartment, 
        lastLogin: "—", 
        isActive: userIsActive,
        phone: userPhone,
        password: userPassword,
        redirectUrl: userRedirectUrl,
        companyAccess: userCompanyAccess,
        avatar: userAvatar
      });
      toast.success("New user registered successfully");
    }
    saveUsers(updatedUsers);
    setIsUserModalOpen(false);
  };

  const handleDeleteUser = (sl: number) => {
    if (confirm("Are you sure you want to de-register this user?")) {
      const updated = users.filter(u => u.sl !== sl).map((u, idx) => ({ ...u, sl: idx + 1 }));
      saveUsers(updated);
      toast.success("User deleted successfully");
    }
  };

  // Role modal open trigger
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

  // Role submit handler
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
      // Cascade rename in permissions list
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

  // Permission logic additions
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
        // Logic constraint: if Full is set true, enable read/write automatically
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

  // Combine active override user's base role permissions with override overrides
  const userWisePermissionsData = useMemo(() => {
    if (!activeOverrideUser) return [];
    const baseRole = activeOverrideUser.role;
    
    // Base permissions for this user's role
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
      // Add custom override copy matching base role values
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
      // Remove custom override row
      const nextOverrides = overrides.filter(o => !(o.empId === activeOverrideUser.empId && o.menu === menu));
      saveOverrides(nextOverrides);
      toast.info(`Reverted "${menu}" to system role defaults`);
    }
  };

  const handleUpdateOverrideValue = (menu: string, field: keyof Omit<UserOverrideRow, "sl" | "empId" | "menu">, value: boolean) => {
    if (!activeOverrideUser) return;
    const updated = overrides.map(o => {
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
    saveOverrides(updated);
  };

  // Filtered lists
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = !searchQuery.trim() ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.empId.includes(searchQuery) ||
        u.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [users, searchQuery]);

  const activeRolePermissions = useMemo(() => {
    return permissions.filter(p => p.role === selectedRoleFilter);
  }, [permissions, selectedRoleFilter]);

  // Dropdown mapping options
  const roleSelectOptions = useMemo(() => {
    return roles.filter(r => r.isActive === "Active").map(r => ({ value: r.name, label: r.name }));
  }, [roles]);

  const menuSelectOptions = useMemo(() => {
    return AVAILABLE_MENUS.filter(m => m !== "All").map(m => ({ value: m, label: m }));
  }, []);

  const userSelectOptions = useMemo(() => {
    return users.map(u => ({ value: u.empId, label: `${u.empId} - ${u.name} (${u.role})` }));
  }, [users]);

  const employeeOptions = useMemo(() => {
    return employees.map(e => ({
      value: e.id,
      label: `${e.id} - ${e.name} (${e.title || "Employee"})`
    }));
  }, [employees]);

  const departmentsList = useMemo(() => {
    const list = Array.from(new Set(employees.map(e => e.dept).filter(Boolean)));
    return list.length > 0 ? list : ["Procurement and Supply Chain", "Accounts & Finance", "Marketing and Merchandising", "Admin", "HR, Admin and Compliance", "Management"];
  }, [employees]);

  // Role colors mapping helper
  const getRoleBadgeStyle = (roleName: string) => {
    const clean = roleName.toLowerCase();
    if (clean === "admin") return "bg-purple-500/10 text-purple-600 border-purple-500/20";
    if (clean === "hod") return "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";
    if (clean === "management") return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    if (clean === "reception") return "bg-rose-500/10 text-rose-600 border-rose-500/20";
    return "bg-slate-500/10 text-slate-600 border-slate-500/20";
  };

  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Topbar />

        {/* Content Panel */}
        <div className="flex-1 overflow-hidden flex flex-col px-6 py-4 gap-4 bg-[#f8fafc] dark:bg-[#090d16]">
          
          {/* Breadcrumbs Banner */}
          <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="size-3 text-muted-foreground/60" />
              <span className="text-muted-foreground font-semibold">Administration</span>
              <ChevronRight className="size-3 text-muted-foreground/60" />
              <span className="text-foreground font-semibold">User Management</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-primary bg-primary/10 border border-primary/20 rounded-xl px-3 py-1.5 font-semibold uppercase tracking-wider">
                System Command Center
              </span>
            </div>
          </div>

          {/* Master Tab Container */}
          <div className="flex-1 bg-card border border-border rounded-2xl shadow-xs flex flex-col overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary to-indigo-500" />
            
            {/* Page Title & Section Headers */}
            <div className="px-6 pt-5 pb-3 border-b border-border bg-muted/10 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <Shield className="size-5 text-primary" /> User Management
                </h2>
                <p className="text-[9.5px] font-medium text-muted-foreground/80 leading-none mt-1">
                  Manage directory access control structures and user credentials.
                </p>
              </div>

              <button
                onClick={() => openUserForm(null)}
                className="h-9 px-4 bg-primary hover:bg-primary/95 text-white font-semibold text-[11px] rounded-xl uppercase tracking-wider flex items-center gap-1.5 transition shadow-2xs"
              >
                <Plus className="size-4" /> Add New User
              </button>
            </div>

            {/* USER LIST DATAGRID */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-card">
              
              {/* Search / Filters Bar */}
              <div className="px-6 py-4 border-b border-border shrink-0 flex items-center justify-between gap-4">
                <span className="text-[10px] font-semibold uppercase text-muted-foreground/75 tracking-wider flex items-center gap-1.5">
                  <Search className="size-3.5" /> Search Directory
                </span>
                
                <div className="relative w-80">
                  <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by name, email, employee ID..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full h-8.5 pl-8 pr-3 text-[11px] font-medium bg-muted/10 border border-border/80 rounded-xl outline-none focus:border-primary/60 transition"
                  />
                </div>
              </div>

              {/* Table Data */}
              <div className="flex-1 overflow-auto min-h-0">
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap min-w-[1000px]">
                  <thead className="text-muted-foreground uppercase font-semibold tracking-wider text-[9.5px] border-b border-border/50 bg-[#f8fafc] dark:bg-[#0f172a] sticky top-0 z-10">
                    <tr>
                      <th className="px-5 py-4 w-[60px] text-center">#</th>
                      <th className="px-5 py-4 min-w-[150px]">Name</th>
                      <th className="px-5 py-4 min-w-[120px] text-center">User ID</th>
                      <th className="px-5 py-4 min-w-[180px]">Email</th>
                      <th className="px-5 py-4 w-[110px] text-center">Emp Id</th>
                      <th className="px-5 py-4 w-[100px] text-center">Role</th>
                      <th className="px-5 py-4 min-w-[130px]">Company Access</th>
                      <th className="px-5 py-4 min-w-[200px]">Department</th>
                      <th className="px-5 py-4 w-[130px] text-center">Last Login</th>
                      <th className="px-5 py-4 w-[100px] text-center">Status</th>
                      <th className="px-5 py-4 w-[100px] text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="py-12 text-center text-[12px] font-medium text-muted-foreground/60">
                          No registered users match the search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((item, idx) => (
                        <tr key={item.sl} className="group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all">
                          <td className="px-5 py-3.5 text-center font-mono text-slate-500 font-semibold">{idx + 1}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              {item.avatar ? (
                                <img src={item.avatar} alt={item.name} className="size-7.5 rounded-full object-cover border border-border shadow-3xs" />
                              ) : (
                                <div className="size-7.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-[10px] uppercase shadow-3xs">
                                  {item.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                </div>
                              )}
                              <span className="font-semibold text-foreground/95">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-center font-mono font-semibold text-slate-600">{item.userId || "—"}</td>
                          <td className="px-5 py-3.5 font-medium text-slate-500">{item.email}</td>
                          <td className="px-5 py-3.5 text-center font-mono font-semibold text-slate-600">{item.empId}</td>
                          <td className="px-5 py-3.5 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase border tracking-wider ${getRoleBadgeStyle(item.role)}`}>
                              {item.role}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 font-medium">
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {(!item.companyAccess || item.companyAccess.length === 0) ? (
                                <span className="text-[10px] text-muted-foreground">—</span>
                              ) : item.companyAccess.includes("All") ? (
                                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 border border-blue-500/20 text-[9px] font-semibold uppercase">All Companies</span>
                              ) : (
                                item.companyAccess.map(c => {
                                  let short = c;
                                  if (c === "Pakiza Software Limited") short = "PSL";
                                  if (c === "Pakiza Knit Composite Ltd") short = "PKCL";
                                  if (c === "Pakiza Group") short = "Group";
                                  return (
                                    <span key={c} className="px-2 py-0.5 rounded bg-slate-500/10 text-slate-600 border border-slate-500/20 text-[9px] font-semibold" title={c}>
                                      {short}
                                    </span>
                                  );
                                })
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-medium truncate max-w-xs" title={item.department}>{item.department}</td>
                          <td className="px-5 py-3.5 text-center font-medium text-slate-400 font-mono text-[10.5px]">{item.lastLogin}</td>
                          <td className="px-5 py-3.5 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-semibold border uppercase tracking-wider ${
                              item.isActive === "Active" 
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                                : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                            }`}>
                              {item.isActive}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                type="button"
                                onClick={() => openUserForm(item.sl)}
                                className="text-orange-500 hover:text-orange-600 transition"
                                title="Edit User Info"
                              >
                                <Pencil className="size-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(item.sl)}
                                className="text-rose-500 hover:text-rose-600 transition"
                                title="De-register User"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* MODAL 1: REGISTER / EDIT USER */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-card border border-border/80 w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border/50 bg-[#f8fafc] dark:bg-[#0f172a] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="size-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 shadow-3xs">
                  <UserCheck className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-medium tracking-tight text-foreground">
                    {editingUserSl ? "Edit User Profile" : "Register New User"}
                  </h2>
                  <p className="text-[10px] text-muted-foreground/80 font-normal -mt-0.5">
                    {editingUserSl ? "Update user settings, role credentials and company directories" : "Create new credentials and assign specific organizational permissions"}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsUserModalOpen(false)}
                className="size-8.5 rounded-xl hover:bg-muted/80 flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground border border-border/20"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUserSubmit} className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Left Column (md:col-span-4) - Identity Toggle & Basic Account Details */}
                <div className="md:col-span-4 space-y-5 md:border-r border-slate-100 dark:border-slate-800/80 md:pr-6">
                  
                  {/* Creation Mode Toggle */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Creation Mode</label>
                    <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => {
                          setCreateMode("with_id");
                          setSelectedEmployeeId("");
                          setUserFirstName("");
                          setUserLastName("");
                          setUserEmail("");
                          setUserPhone("");
                          setUserEmpId("");
                          setUserDepartment("");
                          setUserUserId("");
                          setUserAvatar("");
                        }}
                        className={`flex-1 py-2 text-[9px] font-medium uppercase tracking-wider rounded-lg transition-all duration-200 whitespace-nowrap px-1.5 ${
                          createMode === "with_id" 
                            ? "bg-white dark:bg-slate-800 text-primary shadow-xs border border-slate-200/10" 
                            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                      >
                        With Employee ID
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCreateMode("without_id");
                          setSelectedEmployeeId("");
                          setUserFirstName("");
                          setUserLastName("");
                          setUserEmail("");
                          setUserPhone("");
                          setUserEmpId("");
                          setUserDepartment("");
                          setUserUserId("");
                          setUserAvatar("");
                        }}
                        className={`flex-1 py-2 text-[9px] font-medium uppercase tracking-wider rounded-lg transition-all duration-200 whitespace-nowrap px-1.5 ${
                          createMode === "without_id" 
                            ? "bg-white dark:bg-slate-800 text-primary shadow-xs border border-slate-200/10" 
                            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                      >
                        Without Employee ID
                      </button>
                    </div>
                  </div>

                  {/* Image Upload Area (Shown in without_id mode) */}
                  {createMode === "without_id" && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">User Photo</label>
                      <div className="flex flex-col items-center justify-center p-6 bg-slate-50/50 dark:bg-slate-900/30 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl group transition hover:border-primary/50 relative overflow-hidden">
                        {userAvatar ? (
                          <div className="relative size-24 rounded-full overflow-hidden border-2 border-primary/20 shadow-md group-hover:scale-105 transition-transform duration-200">
                            <img src={userAvatar} alt="Preview" className="size-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setUserAvatar("")}
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[9px] font-medium transition-opacity"
                            >
                              Remove Photo
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center justify-center text-center">
                            <div className="size-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-2 group-hover:scale-105 transition-transform duration-200 shadow-2xs">
                              <Users className="size-7" />
                            </div>
                            <span className="text-[11px] font-medium text-primary group-hover:underline">Upload Photo</span>
                            <span className="text-[9px] text-muted-foreground mt-0.5 font-normal">Max 2MB (JPG, PNG)</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarChange}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Employee Information Card (Shown in with_id mode when employee is selected) */}
                  {createMode === "with_id" && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Employee ID Selection</label>
                      <SearchableSelect
                        options={employeeOptions}
                        value={selectedEmployeeId}
                        onChange={handleSelectEmployee}
                        placeholder="Select Employee..."
                      />
                      
                      {selectedEmployeeId && (
                        <div className="p-3.5 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-950 dark:to-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 rounded-xl flex items-center gap-3 animate-in fade-in duration-200 shadow-3xs">
                          <div className="size-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase shadow-3xs">
                            {userFirstName[0] || ""}{userLastName[0] || ""}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{userFirstName} {userLastName}</div>
                            <div className="text-[9.5px] text-slate-500 truncate font-normal">{userDepartment || "No Department"}</div>
                            <div className="text-[9px] font-mono text-primary font-normal mt-0.5">ID: {selectedEmployeeId}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Core Login Details */}
                  <div className="space-y-3.5 pt-2">
                    {/* User ID Field */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        User ID * 
                        <span className="text-[8.5px] font-normal text-slate-400 dark:text-slate-500 lowercase italic ml-1">(login handle)</span>
                      </label>
                      <div className="relative">
                        <User className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={userUserId}
                          onChange={e => setUserUserId(e.target.value)}
                          placeholder="Enter unique login User ID"
                          className="w-full h-10 pl-9.5 pr-3.5 text-xs font-normal bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Password *</label>
                      <div className="relative">
                        <Lock className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={userPassword}
                          onChange={e => setUserPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full h-10 pl-9.5 pr-10 text-xs font-normal bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 dark:hover:text-slate-350 transition"
                        >
                          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Status *</label>
                      <select
                        value={userIsActive}
                        onChange={e => setUserIsActive(e.target.value as any)}
                        className="w-full h-10 px-3.5 text-xs font-normal bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition cursor-pointer"
                        required
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                </div>

                {/* Right Column (md:col-span-8) - Personal Profile Information & System Directory Access */}
                <div className="md:col-span-8 space-y-5">
                  
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-850 pb-1.5 shrink-0">
                    Profile & Directory Access Details
                  </div>

                  {/* Personal Name Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">First Name *</label>
                      <div className="relative">
                        <User className="size-3.5 text-slate-455 dark:text-slate-505 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={userFirstName}
                          onChange={e => setUserFirstName(e.target.value)}
                          placeholder="Enter first name"
                          className={`w-full h-10 pl-9.5 pr-3.5 text-xs font-normal bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition ${
                            createMode === "with_id" ? "bg-slate-100 dark:bg-slate-900 cursor-not-allowed opacity-75 border-slate-200/50" : ""
                          }`}
                          readOnly={createMode === "with_id"}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Last Name *</label>
                      <div className="relative">
                        <User className="size-3.5 text-slate-455 dark:text-slate-505 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={userLastName}
                          onChange={e => setUserLastName(e.target.value)}
                          placeholder="Enter last name"
                          className={`w-full h-10 pl-9.5 pr-3.5 text-xs font-normal bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition ${
                            createMode === "with_id" ? "bg-slate-100 dark:bg-slate-900 cursor-not-allowed opacity-75 border-slate-200/50" : ""
                          }`}
                          readOnly={createMode === "with_id"}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone & Email Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Phone *</label>
                      <div className="relative">
                        <Phone className="size-3.5 text-slate-455 dark:text-slate-550 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={userPhone}
                          onChange={e => setUserPhone(e.target.value)}
                          placeholder="Enter phone number"
                          className={`w-full h-10 pl-9.5 pr-3.5 text-xs font-normal bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition ${
                            createMode === "with_id" ? "bg-slate-100 dark:bg-slate-900 cursor-not-allowed opacity-75 border-slate-200/50" : ""
                          }`}
                          readOnly={createMode === "with_id"}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Email *</label>
                      <div className="relative">
                        <Mail className="size-3.5 text-slate-455 dark:text-slate-550 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={userEmail}
                          onChange={e => setUserEmail(e.target.value)}
                          placeholder="Enter email address"
                          className={`w-full h-10 pl-9.5 pr-3.5 text-xs font-normal bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition ${
                            createMode === "with_id" ? "bg-slate-100 dark:bg-slate-900 cursor-not-allowed opacity-75 border-slate-200/50" : ""
                          }`}
                          readOnly={createMode === "with_id"}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* System Role & Corporate Department Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Role *</label>
                      <select
                        value={userRole}
                        onChange={e => setUserRole(e.target.value)}
                        className="w-full h-10 px-3.5 text-xs font-normal bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition cursor-pointer"
                        required
                      >
                        <option value="">Select Role</option>
                        {roles.map(r => (
                          <option key={r.name} value={r.name}>{r.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Department *</label>
                      {createMode === "with_id" ? (
                        <div className="relative">
                          <Users className="size-3.5 text-slate-455 dark:text-slate-550 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={userDepartment}
                            placeholder="Select Department"
                            className="w-full h-10 pl-9.5 pr-3.5 text-xs font-normal bg-slate-100 dark:bg-slate-900 cursor-not-allowed opacity-75 border-slate-200/50 dark:border-slate-800 rounded-xl outline-none"
                            readOnly
                            required
                          />
                        </div>
                      ) : (
                        <select
                          value={userDepartment}
                          onChange={e => setUserDepartment(e.target.value)}
                          className="w-full h-10 px-3.5 text-xs font-normal bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition cursor-pointer"
                          required
                        >
                          <option value="">Select Department</option>
                          {departmentsList.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  {/* Redirect URL Selection */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Redirect URL *</label>
                    <select
                      value={userRedirectUrl}
                      onChange={e => setUserRedirectUrl(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs font-normal bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition cursor-pointer"
                      required
                    >
                      <option value="Select Main Menu">Select Main Menu</option>
                      {AVAILABLE_MENUS.filter(m => m !== "All").map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  {/* Company Access Checklist Cards */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Company Access *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      
                      {/* All Companies Option Card */}
                      <label className={`flex items-start gap-3.5 p-3 rounded-xl border cursor-pointer select-none transition ${
                        userCompanyAccess.includes("All")
                          ? "bg-primary/5 border-primary text-primary"
                          : "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100/50"
                      }`}>
                        <input
                          type="checkbox"
                          checked={userCompanyAccess.includes("All")}
                          onChange={e => {
                            if (e.target.checked) {
                              setUserCompanyAccess(["All", "Pakiza Software Limited", "Pakiza Knit Composite Ltd", "Pakiza Group"]);
                            } else {
                              setUserCompanyAccess([]);
                            }
                          }}
                          className="size-4.5 rounded border-slate-300 dark:border-slate-700 text-primary cursor-pointer transition focus:ring-0 mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-medium">All Companies</div>
                          <div className="text-[9px] text-slate-500 dark:text-slate-400 font-normal">Full, unrestricted administrative directory visibility</div>
                        </div>
                      </label>
                      
                      {/* Individual Companies Card List */}
                      {[
                        { value: "Pakiza Software Limited", label: "Pakiza Software Ltd", desc: "Access software ops & setup divisions" },
                        { value: "Pakiza Knit Composite Ltd", label: "Pakiza Knit Composite Ltd", desc: "Access factory systems & operations" },
                        { value: "Pakiza Group", label: "Pakiza Group", desc: "Access group-wide central systems" }
                      ].map(c => {
                        const isChecked = userCompanyAccess.includes(c.value) || userCompanyAccess.includes("All");
                        const isDisabled = userCompanyAccess.includes("All");
                        return (
                          <label key={c.value} className={`flex items-start gap-3.5 p-3 rounded-xl border transition ${
                            isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer select-none"
                          } ${
                            isChecked
                              ? "bg-primary/5 border-primary/50 text-primary"
                              : "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100/50"
                          }`}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              disabled={isDisabled}
                              onChange={e => {
                                if (e.target.checked) {
                                  const next = [...userCompanyAccess, c.value];
                                  const allIndividually = ["Pakiza Software Limited", "Pakiza Knit Composite Ltd", "Pakiza Group"].every(co => next.includes(co));
                                  if (allIndividually) {
                                    setUserCompanyAccess(["All", "Pakiza Software Limited", "Pakiza Knit Composite Ltd", "Pakiza Group"]);
                                  } else {
                                    setUserCompanyAccess(next);
                                  }
                                } else {
                                  setUserCompanyAccess(userCompanyAccess.filter(v => v !== c.value && v !== "All"));
                                }
                              }}
                              className="size-4.5 rounded border-slate-300 dark:border-slate-700 text-primary cursor-pointer transition focus:ring-0 mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-[11px] font-medium">{c.label}</div>
                              <div className="text-[9px] text-slate-500 dark:text-slate-400 font-normal">{c.desc}</div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-border/50 pt-5 flex items-center justify-end gap-3 bg-[#f8fafc] dark:bg-[#0f172a] -mx-6 -mb-6 p-6 mt-6 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="h-10 px-6 rounded-lg bg-white dark:bg-slate-800 border border-border text-foreground hover:bg-muted font-medium text-xs transition-all uppercase tracking-wider shadow-3xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-8 rounded-lg bg-primary hover:bg-primary/95 text-white font-medium text-xs shadow-xs transition-all uppercase tracking-wider"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REGISTER / EDIT ROLE */}
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
                    placeholder="e.g. employee"
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
