import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Sparkles,
  Workflow,
  Pencil,
  Trash2,
  Eye,
  UserPlus,
  Plus,
  ChevronRight,
  X,
  Layers,
  Search,
  Check,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/work-flows")({
  head: () => ({
    meta: [
      { title: "Work Flows — Approvals | CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Configure and manage multi-level approval workflows, approval layers, points and designated approvers.",
      },
    ],
  }),
  component: WorkFlowsPage,
});

export interface ApproverUser {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  point: string;
  userType?: "Specific" | "Group (Role)" | "Department Head" | "Manager";
  action?: "Approve" | "Recommend" | "Verify" | "Acknowledge";
}

export interface WorkflowLayer {
  id: string;
  layerName: string;
  totalPoints: string;
  approvers: ApproverUser[];
  status: "Active" | "Inactive";
}

export interface WorkflowItem {
  id: string;
  sl: number;
  name: string;
  totalLayers: number;
  layers: WorkflowLayer[];
  departments: string[];
  sections: string[];
  lines: string[];
  description: string;
  permissionSetting?: string;
  status: "Active" | "Inactive";
}

// Sample Employee Database for autocomplete / autofill in Add Users modal
const KNOWN_EMPLOYEES = [
  { id: "2024051510", name: "Md. Sadmanur Islam Shishir", email: "sadmanur@cripton.com", dept: "Business Innovation" },
  { id: "2023044078", name: "Md. Anik Islam", email: "anik@cripton.com", dept: "Business Innovation" },
  { id: "2022019941", name: "Jahangir Alam", email: "jahangir@cripton.com", dept: "HR & Admin" },
  { id: "2021088234", name: "Md. Abdur Rahaman", email: "abdur@cripton.com", dept: "Factory Operations" },
  { id: "2020011502", name: "Sayed Ahmed", email: "sayed@cripton.com", dept: "Finance & Accounts" },
  { id: "2023091145", name: "Farhana Yasmin", email: "farhana@cripton.com", dept: "Implementation & BA" },
  { id: "2024010092", name: "Kamrul Hasan", email: "kamrul@cripton.com", dept: "MIS & IT" },
  { id: "2019001001", name: "Executive Managing Director", email: "md@cripton.com", dept: "Management" },
];

const INITIAL_WORKFLOWS: WorkflowItem[] = [
  {
    id: "wf-1",
    sl: 1,
    name: "Sim Requisition",
    totalLayers: 4,
    layers: [
      {
        id: "l-1-1",
        layerName: "Approved By HOD",
        totalPoints: "(100 pts)",
        status: "Active",
        approvers: [
          {
            id: "u-1-1",
            name: "Group (HOD)",
            email: "N/A",
            employeeId: "N/A",
            point: "100 pts",
            userType: "Group (Role)",
            action: "Approve",
          },
        ],
      },
      {
        id: "l-1-2",
        layerName: "Approved By HRD",
        totalPoints: "(100 pts)",
        status: "Active",
        approvers: [
          {
            id: "u-1-2",
            name: "Jahangir Alam",
            email: "jahangir@cripton.com",
            employeeId: "2022019941",
            point: "100 pts",
            userType: "Specific",
            action: "Approve",
          },
        ],
      },
      {
        id: "l-1-3",
        layerName: "Approved By MD",
        totalPoints: "(100 pts)",
        status: "Active",
        approvers: [
          {
            id: "u-1-3",
            name: "Executive Managing Director",
            email: "md@cripton.com",
            employeeId: "2019001001",
            point: "100 pts",
            userType: "Specific",
            action: "Approve",
          },
        ],
      },
      {
        id: "l-1-4",
        layerName: "Approved By ICT",
        totalPoints: "(100 pts)",
        status: "Active",
        approvers: [
          {
            id: "u-1-4",
            name: "Kamrul Hasan",
            email: "kamrul@cripton.com",
            employeeId: "2024010092",
            point: "100 pts",
            userType: "Specific",
            action: "Approve",
          },
        ],
      },
    ],
    departments: ["HR, Admin And Compliance", "Implementation & Business Analysis", "MIS"],
    sections: [],
    lines: [],
    description: "N/A",
    permissionSetting: "Approvals",
    status: "Active",
  },
  {
    id: "wf-2",
    sl: 2,
    name: "Resignation Approval",
    totalLayers: 2,
    layers: [
      {
        id: "l-2-1",
        layerName: "Approved By HOD",
        totalPoints: "(100 pts)",
        status: "Active",
        approvers: [
          {
            id: "u-2-1",
            name: "Group (HOD)",
            email: "N/A",
            employeeId: "N/A",
            point: "100 pts",
            userType: "Group (Role)",
            action: "Approve",
          },
        ],
      },
      {
        id: "l-2-2",
        layerName: "Approved By HR & Admin",
        totalPoints: "(100 pts)",
        status: "Active",
        approvers: [
          {
            id: "u-2-2",
            name: "Jahangir Alam",
            email: "jahangir@cripton.com",
            employeeId: "2022019941",
            point: "100 pts",
            userType: "Specific",
            action: "Approve",
          },
        ],
      },
    ],
    departments: ["HR, Admin And Compliance", "Management", "MIS"],
    sections: [],
    lines: [],
    description: "N/A",
    permissionSetting: "Approvals",
    status: "Active",
  },
  {
    id: "wf-3",
    sl: 3,
    name: "IOU - Requisition",
    totalLayers: 4,
    layers: [
      {
        id: "l-3-1",
        layerName: "Approved By Manager",
        totalPoints: "(100 pts)",
        status: "Active",
        approvers: [
          {
            id: "u-3-1",
            name: "Md. Anik Islam",
            email: "anik@cripton.com",
            employeeId: "2023044078",
            point: "100 pts",
            userType: "Specific",
            action: "Approve",
          },
        ],
      },
      {
        id: "l-3-2",
        layerName: "Approved By HOD",
        totalPoints: "(100 pts)",
        status: "Active",
        approvers: [
          {
            id: "u-3-2",
            name: "Group (HOD)",
            email: "N/A",
            employeeId: "N/A",
            point: "100 pts",
            userType: "Group (Role)",
            action: "Approve",
          },
        ],
      },
      {
        id: "l-3-3",
        layerName: "Approved By Accounts",
        totalPoints: "(100 pts)",
        status: "Active",
        approvers: [
          {
            id: "u-3-3",
            name: "Sayed Ahmed",
            email: "sayed@cripton.com",
            employeeId: "2020011502",
            point: "100 pts",
            userType: "Specific",
            action: "Approve",
          },
        ],
      },
      {
        id: "l-3-4",
        layerName: "Approved By MD",
        totalPoints: "(100 pts)",
        status: "Active",
        approvers: [
          {
            id: "u-3-4",
            name: "Executive Managing Director",
            email: "md@cripton.com",
            employeeId: "2019001001",
            point: "100 pts",
            userType: "Specific",
            action: "Approve",
          },
        ],
      },
    ],
    departments: ["HR, Admin And Compliance", "Management", "MIS"],
    sections: [],
    lines: [],
    description: "N/A",
    permissionSetting: "Approvals",
    status: "Active",
  },
  {
    id: "wf-4",
    sl: 4,
    name: "Loan Approval",
    totalLayers: 3,
    layers: [
      {
        id: "l-4-1",
        layerName: "Approved By HOD",
        totalPoints: "(100 pts)",
        status: "Active",
        approvers: [
          {
            id: "u-4-1",
            name: "Group (HOD)",
            email: "N/A",
            employeeId: "N/A",
            point: "100 pts",
            userType: "Group (Role)",
            action: "Approve",
          },
        ],
      },
      {
        id: "l-4-2",
        layerName: "Approved By HR & Admin",
        totalPoints: "(100 pts)",
        status: "Active",
        approvers: [
          {
            id: "u-4-2",
            name: "Jahangir Alam",
            email: "jahangir@cripton.com",
            employeeId: "2022019941",
            point: "100 pts",
            userType: "Specific",
            action: "Approve",
          },
        ],
      },
      {
        id: "l-4-3",
        layerName: "Approved By Accounts",
        totalPoints: "(100 pts)",
        status: "Active",
        approvers: [
          {
            id: "u-4-3",
            name: "Sayed Ahmed",
            email: "sayed@cripton.com",
            employeeId: "2020011502",
            point: "100 pts",
            userType: "Specific",
            action: "Approve",
          },
        ],
      },
    ],
    departments: ["HR, Admin And Compliance", "Management", "MIS"],
    sections: [],
    lines: [],
    description: "N/A",
    permissionSetting: "Approvals",
    status: "Active",
  },
  {
    id: "wf-5",
    sl: 5,
    name: "Leave Application (Admin dept)",
    totalLayers: 2,
    layers: [
      {
        id: "l-5-1",
        layerName: "Approved By Operation Head",
        totalPoints: "(100 pts)",
        status: "Active",
        approvers: [
          {
            id: "u-5-1",
            name: "Md. Abdur Rahaman",
            email: "abdur@cripton.com",
            employeeId: "2021088234",
            point: "100 pts",
            userType: "Specific",
            action: "Approve",
          },
        ],
      },
      {
        id: "l-5-2",
        layerName: "Approved By MD",
        totalPoints: "(100 pts)",
        status: "Active",
        approvers: [
          {
            id: "u-5-2",
            name: "Executive Managing Director",
            email: "md@cripton.com",
            employeeId: "2019001001",
            point: "100 pts",
            userType: "Specific",
            action: "Approve",
          },
        ],
      },
    ],
    departments: ["HR, Admin And Compliance"],
    sections: [],
    lines: [],
    description: "N/A",
    permissionSetting: "Leave Application",
    status: "Active",
  },
  {
    id: "wf-6",
    sl: 6,
    name: "Leave Application",
    totalLayers: 4,
    layers: [
      {
        id: "l-6-1",
        layerName: "Approved By Manager",
        totalPoints: "(100 pts)",
        status: "Active",
        approvers: [
          {
            id: "u-6-1",
            name: "Md. Anik Islam",
            email: "anik@cripton.com",
            employeeId: "2023044078",
            point: "100 pts",
            userType: "Specific",
            action: "Approve",
          },
        ],
      },
      {
        id: "l-6-2",
        layerName: "Approved By HOD",
        totalPoints: "(100 pts)",
        status: "Active",
        approvers: [
          {
            id: "u-6-2",
            name: "Group (HOD)",
            email: "N/A",
            employeeId: "N/A",
            point: "100 pts",
            userType: "Group (Role)",
            action: "Approve",
          },
        ],
      },
      {
        id: "l-6-3",
        layerName: "Approved By HR & Admin",
        totalPoints: "(100 pts)",
        status: "Active",
        approvers: [
          {
            id: "u-6-3",
            name: "Jahangir Alam",
            email: "jahangir@cripton.com",
            employeeId: "2022019941",
            point: "100 pts",
            userType: "Specific",
            action: "Approve",
          },
        ],
      },
      {
        id: "l-6-4",
        layerName: "Approved By Operations",
        totalPoints: "(100 pts)",
        status: "Active",
        approvers: [
          {
            id: "u-6-4",
            name: "Md. Abdur Rahaman",
            email: "abdur@cripton.com",
            employeeId: "2021088234",
            point: "100 pts",
            userType: "Specific",
            action: "Approve",
          },
        ],
      },
    ],
    departments: ["MIS", "E-Governance", "Business Development"],
    sections: ["Business Innovation", "Business Development"],
    lines: [],
    description: "N/A",
    permissionSetting: "Leave Application",
    status: "Active",
  },
];

function WorkFlowsPage() {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>(INITIAL_WORKFLOWS);

  // Expanded toggles for "Show More" in table badges
  const [expandedLayers, setExpandedLayers] = useState<Record<string, boolean>>({});
  const [expandedDepts, setExpandedDepts] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<WorkflowItem | null>(null);

  // Workflow Form State
  const [wfName, setWfName] = useState("");
  const [wfPermission, setWfPermission] = useState("");
  const [wfDepartment, setWfDepartment] = useState("");
  const [wfSection, setWfSection] = useState("");
  const [wfLine, setWfLine] = useState("");
  const [wfDescription, setWfDescription] = useState("");
  const [wfStatus, setWfStatus] = useState<"Active" | "Inactive">("Active");

  // Basic Approval Flow Modal State (Image 3)
  const [flowModalWorkflowId, setFlowModalWorkflowId] = useState<string | null>(null);

  // Add/Edit Layer Modal State (Submodal of Image 3)
  const [layerModalOpen, setLayerModalOpen] = useState(false);
  const [editingLayer, setEditingLayer] = useState<WorkflowLayer | null>(null);
  const [layerNameInput, setLayerNameInput] = useState("");
  const [layerPointsInput, setLayerPointsInput] = useState("100");
  const [layerStatusInput, setLayerStatusInput] = useState<"Active" | "Inactive">("Active");

  // Layer Users Modal State (Image 5)
  const [viewingLayerId, setViewingLayerId] = useState<string | null>(null);

  // Add Users Modal State (Image 4)
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [targetLayerId, setTargetLayerId] = useState<string | null>(null);
  const [userType, setUserType] = useState<"Specific" | "Group (Role)" | "Department Head" | "Manager">("Specific");
  const [employeeIdInput, setEmployeeIdInput] = useState("");
  const [employeeNameInput, setEmployeeNameInput] = useState("");
  const [requiredPointsInput, setRequiredPointsInput] = useState("100");
  const [userActionInput, setUserActionInput] = useState("Approve");

  // Active Flow Workflow
  const currentFlowWorkflow = useMemo(() => {
    return workflows.find((w) => w.id === flowModalWorkflowId) || null;
  }, [workflows, flowModalWorkflowId]);

  // Active Layer for Viewing Users (Image 5)
  const currentViewingLayer = useMemo(() => {
    if (!currentFlowWorkflow || !viewingLayerId) return null;
    return currentFlowWorkflow.layers.find((l) => l.id === viewingLayerId) || null;
  }, [currentFlowWorkflow, viewingLayerId]);

  // Open Create Workflow Modal
  const handleOpenCreateModal = () => {
    setEditingWorkflow(null);
    setWfName("");
    setWfPermission("");
    setWfDepartment("");
    setWfSection("");
    setWfLine("");
    setWfDescription("");
    setWfStatus("Active");
    setCreateModalOpen(true);
  };

  // Open Edit Workflow Modal
  const handleOpenEditModal = (wf: WorkflowItem) => {
    setEditingWorkflow(wf);
    setWfName(wf.name);
    setWfPermission(wf.permissionSetting || "Approvals");
    setWfDepartment(wf.departments[0] || "");
    setWfSection(wf.sections[0] || "");
    setWfLine(wf.lines[0] || "");
    setWfDescription(wf.description === "N/A" ? "" : wf.description);
    setWfStatus(wf.status);
    setCreateModalOpen(true);
  };

  // Save Workflow
  const handleSaveWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wfName.trim()) {
      toast.error("Please enter a workflow name");
      return;
    }
    if (!wfPermission) {
      toast.error("Please select permission setting (Main Menu)");
      return;
    }
    if (!wfDepartment) {
      toast.error("Please select a department");
      return;
    }

    if (editingWorkflow) {
      setWorkflows((prev) =>
        prev.map((item) =>
          item.id === editingWorkflow.id
            ? {
                ...item,
                name: wfName,
                permissionSetting: wfPermission,
                departments: wfDepartment ? [wfDepartment] : item.departments,
                sections: wfSection ? [wfSection] : [],
                lines: wfLine ? [wfLine] : [],
                description: wfDescription.trim() ? wfDescription : "N/A",
                status: wfStatus,
              }
            : item
        )
      );
      toast.success("Workflow updated successfully!");
    } else {
      const newWf: WorkflowItem = {
        id: `wf-${Date.now()}`,
        sl: workflows.length + 1,
        name: wfName,
        totalLayers: 1,
        layers: [
          {
            id: `l-${Date.now()}-1`,
            layerName: "Approved By HOD",
            totalPoints: "(100 pts)",
            status: "Active",
            approvers: [
              {
                id: `u-${Date.now()}-1`,
                name: "Group (HOD)",
                email: "N/A",
                employeeId: "N/A",
                point: "100 pts",
                userType: "Group (Role)",
                action: "Approve",
              },
            ],
          },
        ],
        departments: [wfDepartment],
        sections: wfSection ? [wfSection] : [],
        lines: wfLine ? [wfLine] : [],
        description: wfDescription.trim() ? wfDescription : "N/A",
        permissionSetting: wfPermission,
        status: wfStatus,
      };
      setWorkflows((prev) => [...prev, newWf]);
      toast.success("Workflow created successfully!");
    }

    setCreateModalOpen(false);
  };

  // Delete Workflow
  const handleDeleteWorkflow = (wfId: string) => {
    if (confirm("Are you sure you want to delete this workflow?")) {
      setWorkflows((prev) =>
        prev
          .filter((w) => w.id !== wfId)
          .map((w, idx) => ({ ...w, sl: idx + 1 }))
      );
      toast.success("Workflow deleted successfully!");
    }
  };

  // Open Add Layer Modal
  const handleOpenAddLayer = () => {
    setEditingLayer(null);
    setLayerNameInput("");
    setLayerPointsInput("100");
    setLayerStatusInput("Active");
    setLayerModalOpen(true);
  };

  // Open Edit Layer Modal
  const handleOpenEditLayer = (layer: WorkflowLayer) => {
    setEditingLayer(layer);
    setLayerNameInput(layer.layerName);
    setLayerPointsInput(layer.totalPoints.replace(/[^\d]/g, "") || "100");
    setLayerStatusInput(layer.status);
    setLayerModalOpen(true);
  };

  // Save Layer
  const handleSaveLayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!layerNameInput.trim()) {
      toast.error("Please enter layer name");
      return;
    }
    if (!currentFlowWorkflow) return;

    if (editingLayer) {
      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === currentFlowWorkflow.id
            ? {
                ...w,
                layers: w.layers.map((l) =>
                  l.id === editingLayer.id
                    ? {
                        ...l,
                        layerName: layerNameInput,
                        totalPoints: `(${layerPointsInput} pts)`,
                        status: layerStatusInput,
                      }
                    : l
                ),
              }
            : w
        )
      );
      toast.success("Layer updated successfully!");
    } else {
      const newLayer: WorkflowLayer = {
        id: `l-${Date.now()}`,
        layerName: layerNameInput,
        totalPoints: `(${layerPointsInput} pts)`,
        status: layerStatusInput,
        approvers: [],
      };
      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === currentFlowWorkflow.id
            ? {
                ...w,
                totalLayers: w.layers.length + 1,
                layers: [...w.layers, newLayer],
              }
            : w
        )
      );
      toast.success("New layer added successfully!");
    }

    setLayerModalOpen(false);
  };

  // Delete Layer
  const handleDeleteLayer = (layerId: string) => {
    if (!currentFlowWorkflow) return;
    if (confirm("Are you sure you want to delete this approval layer?")) {
      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === currentFlowWorkflow.id
            ? {
                ...w,
                totalLayers: Math.max(0, w.layers.length - 1),
                layers: w.layers.filter((l) => l.id !== layerId),
              }
            : w
        )
      );
      toast.success("Layer deleted successfully!");
    }
  };

  // Open Add User Modal for a specific layer
  const handleOpenAddUserModal = (layerId: string) => {
    setTargetLayerId(layerId);
    setUserType("Specific");
    setEmployeeIdInput("");
    setEmployeeNameInput("");
    setRequiredPointsInput("100");
    setUserActionInput("Approve");
    setAddUserModalOpen(true);
  };

  // Handle Employee ID lookup/change
  const handleEmployeeIdChange = (idVal: string) => {
    setEmployeeIdInput(idVal);
    const found = KNOWN_EMPLOYEES.find(
      (e) => e.id.toLowerCase() === idVal.trim().toLowerCase()
    );
    if (found) {
      setEmployeeNameInput(found.name);
    }
  };

  // Submit Add User
  const handleSubmitAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetLayerId || !currentFlowWorkflow) return;

    if (userType === "Specific" && !employeeIdInput.trim()) {
      toast.error("Please enter Employee ID");
      return;
    }

    const assignedName =
      employeeNameInput.trim() ||
      (userType === "Specific"
        ? `Employee (${employeeIdInput})`
        : userType === "Group (Role)"
        ? "Group (HOD)"
        : userType);

    const newApprover: ApproverUser = {
      id: `u-${Date.now()}`,
      name: assignedName,
      email: KNOWN_EMPLOYEES.find((e) => e.id === employeeIdInput.trim())?.email || "N/A",
      employeeId: employeeIdInput.trim() || "N/A",
      point: `${requiredPointsInput} pts`,
      userType,
      action: userActionInput as any,
    };

    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === currentFlowWorkflow.id
          ? {
              ...w,
              layers: w.layers.map((l) =>
                l.id === targetLayerId
                  ? {
                      ...l,
                      approvers: [...l.approvers, newApprover],
                    }
                  : l
              ),
            }
          : w
      )
    );

    toast.success(`User added successfully to approval layer!`);
    setAddUserModalOpen(false);
  };

  // Delete approver user from layer
  const handleDeleteApproverUser = (layerId: string, approverId: string) => {
    if (!currentFlowWorkflow) return;
    if (confirm("Are you sure you want to remove this approver?")) {
      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === currentFlowWorkflow.id
            ? {
                ...w,
                layers: w.layers.map((l) =>
                  l.id === layerId
                    ? {
                        ...l,
                        approvers: l.approvers.filter((u) => u.id !== approverId),
                      }
                    : l
                ),
              }
            : w
        )
      );
      toast.success("Approver removed successfully!");
    }
  };

  return (
    <div className="flex h-screen bg-[#f4f7fb] text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-sans font-['Inter'] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Topbar />

        {/* Subheader Toolbar matching Image 1 */}
        <div className="px-8 py-5 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500 font-medium select-none">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-500">Approvals</span>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              Work Flows
            </span>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 bg-[#0062d2] hover:bg-[#0051b0] active:scale-[0.98] text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
          >
            <Plus size={15} className="stroke-[3]" />
            CREATE WORKFLOW
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto px-8 pb-10">
          {/* Main Card with rounded borders and shadow */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs min-w-[1000px]">
                <thead>
                  <tr className="border-b border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold tracking-wider uppercase text-[11px]">
                    <th className="py-4.5 px-6 w-16 text-center">SL</th>
                    <th className="py-4.5 px-6 w-32">ACTIONS</th>
                    <th className="py-4.5 px-6 min-w-[180px]">NAME</th>
                    <th className="py-4.5 px-6 w-28 text-center">TOTAL LAYERS</th>
                    <th className="py-4.5 px-6 min-w-[220px]">LAYERS</th>
                    <th className="py-4.5 px-6 min-w-[260px]">DEPARTMENTS</th>
                    <th className="py-4.5 px-6 min-w-[160px]">SECTIONS</th>
                    <th className="py-4.5 px-6 w-24">LINES</th>
                    <th className="py-4.5 px-6 w-32">DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {workflows.map((wf) => {
                    const isLayersExpanded = expandedLayers[wf.id];
                    const displayedLayers = isLayersExpanded ? wf.layers : wf.layers.slice(0, 2);

                    const isDeptsExpanded = expandedDepts[wf.id];
                    const displayedDepts = isDeptsExpanded ? wf.departments : wf.departments.slice(0, 2);

                    const isSectionsExpanded = expandedSections[wf.id];
                    const displayedSections = isSectionsExpanded ? wf.sections : wf.sections.slice(0, 2);

                    return (
                      <tr
                        key={wf.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        {/* SL */}
                        <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-400 font-medium">
                          {wf.sl}
                        </td>

                        {/* ACTIONS: Edit, Delete, Flow */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1.5">
                            {/* Edit Button */}
                            <button
                              onClick={() => handleOpenEditModal(wf)}
                              title="Edit Workflow"
                              className="w-7 h-7 rounded border border-amber-300 dark:border-amber-600/60 bg-amber-50/50 dark:bg-amber-950/30 text-amber-500 hover:bg-amber-100/60 flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <Pencil size={13} />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteWorkflow(wf.id)}
                              title="Delete Workflow"
                              className="w-7 h-7 rounded border border-rose-300 dark:border-rose-600/60 bg-rose-50/50 dark:bg-rose-950/30 text-rose-500 hover:bg-rose-100/60 flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>

                            {/* Flow / Layers Button */}
                            <button
                              onClick={() => setFlowModalWorkflowId(wf.id)}
                              title="View Basic Approval Flow"
                              className="w-7 h-7 rounded border border-blue-300 dark:border-blue-600/60 bg-blue-50/50 dark:bg-blue-950/30 text-blue-500 hover:bg-blue-100/60 flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <Workflow size={13} />
                            </button>
                          </div>
                        </td>

                        {/* NAME */}
                        <td className="py-4 px-6 font-medium text-slate-900 dark:text-slate-100">
                          {wf.name}
                        </td>

                        {/* TOTAL LAYERS */}
                        <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-400 font-medium">
                          {wf.layers.length}
                        </td>

                        {/* LAYERS */}
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-1 items-start">
                            <div className="flex flex-wrap gap-1.5">
                              {displayedLayers.map((l) => (
                                <span
                                  key={l.id}
                                  className="inline-block bg-[#eef3fe] dark:bg-blue-950/60 text-[#2b59c3] dark:text-blue-300 px-3 py-1 rounded-full text-[11px] font-medium leading-none"
                                >
                                  {l.layerName}
                                </span>
                              ))}
                            </div>
                            {wf.layers.length > 2 && (
                              <button
                                onClick={() =>
                                  setExpandedLayers((prev) => ({
                                    ...prev,
                                    [wf.id]: !prev[wf.id],
                                  }))
                                }
                                className="text-blue-600 dark:text-blue-400 hover:underline text-[11px] font-medium mt-0.5 cursor-pointer"
                              >
                                {isLayersExpanded ? "Show Less" : "Show More"}
                              </button>
                            )}
                          </div>
                        </td>

                        {/* DEPARTMENTS */}
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-1 items-start">
                            <div className="flex flex-wrap gap-1.5">
                              {displayedDepts.map((dept, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block bg-[#eef3fe] dark:bg-blue-950/60 text-[#2b59c3] dark:text-blue-300 px-3 py-1 rounded-full text-[11px] font-medium leading-none"
                                >
                                  {dept}
                                </span>
                              ))}
                            </div>
                            {wf.departments.length > 2 && (
                              <button
                                onClick={() =>
                                  setExpandedDepts((prev) => ({
                                    ...prev,
                                    [wf.id]: !prev[wf.id],
                                  }))
                                }
                                className="text-blue-600 dark:text-blue-400 hover:underline text-[11px] font-medium mt-0.5 cursor-pointer"
                              >
                                {isDeptsExpanded ? "Show Less" : "Show More"}
                              </button>
                            )}
                          </div>
                        </td>

                        {/* SECTIONS */}
                        <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                          {wf.sections && wf.sections.length > 0 ? (
                            <div className="flex flex-col gap-1 items-start">
                              <div className="flex flex-wrap gap-1.5">
                                {displayedSections.map((sec, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-block bg-[#eef3fe] dark:bg-blue-950/60 text-[#2b59c3] dark:text-blue-300 px-3 py-1 rounded-full text-[11px] font-medium leading-none"
                                  >
                                    {sec}
                                  </span>
                                ))}
                              </div>
                              {wf.sections.length > 2 && (
                                <button
                                  onClick={() =>
                                    setExpandedSections((prev) => ({
                                      ...prev,
                                      [wf.id]: !prev[wf.id],
                                    }))
                                  }
                                  className="text-blue-600 dark:text-blue-400 hover:underline text-[11px] font-medium mt-0.5 cursor-pointer"
                                >
                                  {isSectionsExpanded ? "Show Less" : "Show More"}
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500 font-medium">N/A</span>
                          )}
                        </td>

                        {/* LINES */}
                        <td className="py-4 px-6 text-slate-400 dark:text-slate-500 font-medium">
                          {wf.lines && wf.lines.length > 0 ? wf.lines.join(", ") : "N/A"}
                        </td>

                        {/* DESCRIPTION */}
                        <td className="py-4 px-6 text-slate-400 dark:text-slate-500 font-medium">
                          {wf.description}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination & Counter Footer */}
            <div className="border-t border-slate-200/90 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
              {/* Pagination */}
              <div className="flex items-center gap-1.5 text-xs select-none">
                <button
                  disabled
                  className="px-2.5 py-1 text-slate-400 dark:text-slate-500 cursor-not-allowed font-medium hover:text-slate-600"
                >
                  &lt; Previous
                </button>
                <span className="w-7 h-7 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold flex items-center justify-center shadow-2xs">
                  1
                </span>
                <button
                  disabled
                  className="px-2.5 py-1 text-slate-400 dark:text-slate-500 cursor-not-allowed font-medium hover:text-slate-600"
                >
                  Next &gt;
                </button>
              </div>

              {/* Total approvals counter with icon matching Image 1 */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-semibold">
                <Layers size={15} className="text-slate-500" />
                <span>{workflows.length} approvals</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE / EDIT WORKFLOW (Image 2) */}
      {/* ========================================================================= */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 relative animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0d162a] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles size={18} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {editingWorkflow ? "Edit Workflow" : "Create Workflow"}
                </h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveWorkflow} className="space-y-4">
              {/* WORKFLOW NAME * */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  WORKFLOW NAME <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={wfName}
                  onChange={(e) => setWfName(e.target.value)}
                  placeholder="Enter workflow name"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* PERMISSION SETTING * */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  PERMISSION SETTING <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={wfPermission}
                  onChange={(e) => setWfPermission(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Main Menu</option>
                  <option value="Approvals">Approvals</option>
                  <option value="Requisitions">Requisitions</option>
                  <option value="Leave Application">Leave Application</option>
                  <option value="Loan & Advance">Loan & Advance</option>
                  <option value="Sim Requisition">Sim Requisition</option>
                  <option value="IOU Requisition">IOU Requisition</option>
                  <option value="HR Policy">HR Policy</option>
                  <option value="Procurement">Procurement</option>
                  <option value="Inventory">Inventory</option>
                </select>
              </div>

              {/* DEPARTMENT * */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  DEPARTMENT <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={wfDepartment}
                  onChange={(e) => setWfDepartment(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Department</option>
                  <option value="HR, Admin And Compliance">HR, Admin And Compliance</option>
                  <option value="Implementation & Business Analysis">Implementation & Business Analysis</option>
                  <option value="MIS">MIS</option>
                  <option value="Management">Management</option>
                  <option value="Business Innovation">Business Innovation</option>
                  <option value="Business Development">Business Development</option>
                  <option value="Finance & Accounts">Finance & Accounts</option>
                  <option value="Factory Operations">Factory Operations</option>
                  <option value="E-Governance">E-Governance</option>
                </select>
              </div>

              {/* SECTION */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  SECTION
                </label>
                <select
                  value={wfSection}
                  onChange={(e) => setWfSection(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Section</option>
                  <option value="Business Innovation">Business Innovation</option>
                  <option value="Business Development">Business Development</option>
                  <option value="IT Support">IT Support</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Accounts Payable">Accounts Payable</option>
                </select>
              </div>

              {/* LINE */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  LINE
                </label>
                <select
                  value={wfLine}
                  onChange={(e) => setWfLine(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Line</option>
                  <option value="Line 01">Line 01</option>
                  <option value="Line 02">Line 02</option>
                  <option value="Line 03">Line 03</option>
                  <option value="N/A">N/A</option>
                </select>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  value={wfDescription}
                  onChange={(e) => setWfDescription(e.target.value)}
                  placeholder="Enter notes"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* STATUS */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  STATUS
                </label>
                <select
                  value={wfStatus}
                  onChange={(e) => setWfStatus(e.target.value as "Active" | "Inactive")}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  CLOSE
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#0062d2] hover:bg-[#0051b0] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                >
                  {editingWorkflow ? "SAVE WORKFLOW" : "CREATE WORKFLOW"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: BASIC APPROVAL FLOW (Image 3) */}
      {/* ========================================================================= */}
      {flowModalWorkflowId && currentFlowWorkflow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 relative animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0d162a] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles size={18} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Basic Approval Flow: {currentFlowWorkflow.name}
                </h3>
              </div>
              <button
                onClick={() => setFlowModalWorkflowId(null)}
                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Top action row */}
            <div className="flex justify-end mb-4">
              <button
                onClick={handleOpenAddLayer}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-wider shadow-2xs transition-colors cursor-pointer"
              >
                <Plus size={14} className="stroke-[3]" />
                ADD LAYER
              </button>
            </div>

            {/* Layers Table */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4 w-12 text-center">SL</th>
                    <th className="py-3 px-4">LAYER NAME</th>
                    <th className="py-3 px-4">TOTAL POINTS</th>
                    <th className="py-3 px-4">TOTAL APPROVERS</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4 w-36 text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {currentFlowWorkflow.layers.map((layer, index) => (
                    <tr
                      key={layer.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 text-center text-slate-600 dark:text-slate-400 font-medium">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                        {layer.layerName}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">
                        {layer.totalPoints}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">
                        {layer.approvers.length} Approvers
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-emerald-500 font-bold text-xs">
                          {layer.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Eye: View Users (Image 5) */}
                          <button
                            onClick={() => setViewingLayerId(layer.id)}
                            title="View Layer Users"
                            className="w-7 h-7 rounded border border-indigo-200 dark:border-indigo-700/60 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-500 hover:bg-indigo-100/60 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Eye size={13} />
                          </button>

                          {/* Pencil: Edit Layer */}
                          <button
                            onClick={() => handleOpenEditLayer(layer)}
                            title="Edit Layer"
                            className="w-7 h-7 rounded border border-blue-200 dark:border-blue-700/60 bg-blue-50/50 dark:bg-blue-950/30 text-blue-500 hover:bg-blue-100/60 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Pencil size={13} />
                          </button>

                          {/* UserPlus: Add Users (Image 4) */}
                          <button
                            onClick={() => handleOpenAddUserModal(layer.id)}
                            title="Add Users to Layer"
                            className="w-7 h-7 rounded border border-emerald-200 dark:border-emerald-700/60 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-500 hover:bg-emerald-100/60 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <UserPlus size={13} />
                          </button>

                          {/* Trash: Delete Layer */}
                          <button
                            onClick={() => handleDeleteLayer(layer.id)}
                            title="Delete Layer"
                            className="w-7 h-7 rounded border border-rose-200 dark:border-rose-700/60 bg-rose-50/50 dark:bg-rose-950/30 text-rose-500 hover:bg-rose-100/60 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentFlowWorkflow.layers.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-slate-400 font-medium"
                      >
                        No layers defined for this workflow yet. Click &quot;+ ADD LAYER&quot; above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: LAYER USERS (Image 5) */}
      {/* ========================================================================= */}
      {viewingLayerId && currentViewingLayer && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/45 backdrop-blur-[2px] p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 relative animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0d162a] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles size={18} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Layer Users: {currentViewingLayer.layerName}
                </h3>
              </div>
              <button
                onClick={() => setViewingLayerId(null)}
                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Subheading row: Approvers (n) and + ADD USERS */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Approvers ({currentViewingLayer.approvers.length})
              </span>
              <button
                onClick={() => handleOpenAddUserModal(currentViewingLayer.id)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-wider shadow-2xs transition-colors cursor-pointer"
              >
                <UserPlus size={14} />
                ADD USERS
              </button>
            </div>

            {/* Users Table */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4 w-12 text-center">SL</th>
                    <th className="py-3 px-4">NAME</th>
                    <th className="py-3 px-4">EMAIL</th>
                    <th className="py-3 px-4">EMPLOYEE ID</th>
                    <th className="py-3 px-4">POINT</th>
                    <th className="py-3 px-4 w-24 text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {currentViewingLayer.approvers.map((approver, index) => (
                    <tr
                      key={approver.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 text-center text-slate-600 dark:text-slate-400 font-medium">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                        {approver.name}
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-medium">
                        {approver.email}
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-medium">
                        {approver.employeeId}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">
                        {approver.point}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() =>
                              toast.info("Approver user details can be updated via Add User modal.")
                            }
                            title="Edit User"
                            className="w-7 h-7 rounded border border-blue-200 dark:border-blue-700/60 bg-blue-50/50 dark:bg-blue-950/30 text-blue-500 hover:bg-blue-100/60 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteApproverUser(currentViewingLayer.id, approver.id)
                            }
                            title="Remove User"
                            className="w-7 h-7 rounded border border-rose-200 dark:border-rose-700/60 bg-rose-50/50 dark:bg-rose-950/30 text-rose-500 hover:bg-rose-100/60 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentViewingLayer.approvers.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-slate-400 font-medium"
                      >
                        No approvers assigned to this layer yet. Click &quot;+ ADD USERS&quot; above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ADD USERS (Image 4) */}
      {/* ========================================================================= */}
      {addUserModalOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 relative animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0d162a] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles size={18} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Add Users
                </h3>
              </div>
              <button
                onClick={() => setAddUserModalOpen(false)}
                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitAddUser} className="space-y-4">
              {/* USER TYPE */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  USER TYPE
                </label>
                <select
                  value={userType}
                  onChange={(e) =>
                    setUserType(e.target.value as "Specific" | "Group (Role)" | "Department Head" | "Manager")
                  }
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Specific">Specific</option>
                  <option value="Group (Role)">Group (Role)</option>
                  <option value="Department Head">Department Head</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>

              {/* EMPLOYEE ID * */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  EMPLOYEE ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  list="employees-list"
                  value={employeeIdInput}
                  onChange={(e) => handleEmployeeIdChange(e.target.value)}
                  placeholder="Enter employee ID and press Enter..."
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
                <datalist id="employees-list">
                  {KNOWN_EMPLOYEES.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.dept})
                    </option>
                  ))}
                </datalist>
              </div>

              {/* EMPLOYEE NAME */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  EMPLOYEE NAME
                </label>
                <input
                  type="text"
                  value={employeeNameInput}
                  onChange={(e) => setEmployeeNameInput(e.target.value)}
                  placeholder="Employee name will appear here..."
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* REQUIRED POINTS * */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  REQUIRED POINTS <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={requiredPointsInput}
                  onChange={(e) => setRequiredPointsInput(e.target.value)}
                  placeholder="Enter points"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* ACTION */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  ACTION
                </label>
                <select
                  value={userActionInput}
                  onChange={(e) => setUserActionInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Approve">Approve</option>
                  <option value="Recommend">Recommend</option>
                  <option value="Verify">Verify</option>
                  <option value="Acknowledge">Acknowledge</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-auto px-7 py-2.5 rounded-lg bg-[#0062d2] hover:bg-[#0051b0] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                >
                  SUBMIT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: ADD / EDIT LAYER MODAL */}
      {/* ========================================================================= */}
      {layerModalOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 relative animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0d162a] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles size={18} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {editingLayer ? "Edit Layer" : "Add Layer"}
                </h3>
              </div>
              <button
                onClick={() => setLayerModalOpen(false)}
                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveLayer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  LAYER NAME <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={layerNameInput}
                  onChange={(e) => setLayerNameInput(e.target.value)}
                  placeholder="e.g. Approved By CFO"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  TOTAL POINTS <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={layerPointsInput}
                  onChange={(e) => setLayerPointsInput(e.target.value)}
                  placeholder="100"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  STATUS
                </label>
                <select
                  value={layerStatusInput}
                  onChange={(e) => setLayerStatusInput(e.target.value as "Active" | "Inactive")}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setLayerModalOpen(false)}
                  className="px-5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  CLOSE
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0062d2] hover:bg-[#0051b0] text-white text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
                >
                  {editingLayer ? "SAVE" : "ADD LAYER"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
