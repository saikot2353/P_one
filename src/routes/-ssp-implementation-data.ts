import {
  DEFAULT_REQUISITION,
  ON_BEHALF_DEMO_REQUISITION,
  RequisitionViewData,
} from "@/components/ssp/GeneralStoreRequisitionModal";

export type ImplementationStatus =
  | "Ready to Execute"
  | "Needs Purchase"
  | "Sent to Purchase"
  | "Executed";

export interface StoreImplementationRecord {
  id: string;
  ref: string;
  date: string;
  requesterName: string;
  requesterEmpId: string;
  requesterDept: string;
  onBehalf?: boolean;
  onBehalfFor?: string;
  reqType: "ICT" | "General";
  itemsSummary: string;
  totalDemand: number;
  availableStock: number;
  hasStock: boolean;
  approvalStatus: "Approved";
  implementationStatus: ImplementationStatus;
  executedDate?: string;
  executedBy?: string;
  sentToPurchaseDate?: string;
  viewData: RequisitionViewData;
}

export const INITIAL_IMPLEMENTATION_REQUISITIONS: StoreImplementationRecord[] = [
  {
    id: "378956",
    ref: "PTVL-RQ-ICT-PUR-178920",
    date: "2026-05-05",
    requesterName: "Rajebul Hasan Rajon",
    requesterEmpId: "2022034013",
    requesterDept: "HR, Admin and Compliance",
    onBehalf: false,
    reqType: "ICT",
    itemsSummary: "Sony LED TV Wall mount Kit full set (1 SET) & HDMI Cable 4K 5m (1 PCS)",
    totalDemand: 2,
    availableStock: 0,
    hasStock: false,
    approvalStatus: "Approved",
    implementationStatus: "Needs Purchase",
    viewData: DEFAULT_REQUISITION,
  },
  {
    id: "389201",
    ref: "PTVL-RQ-ICT-OB-179320",
    date: "2026-09-12",
    requesterName: "Tahmid Afsar",
    requesterEmpId: "2023011409",
    requesterDept: "Information & Communication Technology",
    onBehalf: true,
    onBehalfFor: "Fahim Chowdhury (Deputy Manager)",
    reqType: "ICT",
    itemsSummary: "Dell UltraSharp 24\" FHD USB-C Hub Monitor (P2422HE) (1 PCS)",
    totalDemand: 1,
    availableStock: 0,
    hasStock: false,
    approvalStatus: "Approved",
    implementationStatus: "Needs Purchase",
    viewData: ON_BEHALF_DEMO_REQUISITION,
  },
  {
    id: "394821",
    ref: "PTVL-RQ-ICT-STR-184501",
    date: "2026-10-18",
    requesterName: "Md. Anik Islam",
    requesterEmpId: "2023044078",
    requesterDept: "Merchandising & Operations",
    onBehalf: false,
    reqType: "ICT",
    itemsSummary: "Logitech MK295 Silent Wireless Keyboard & Mouse Combo (2 SET)",
    totalDemand: 2,
    availableStock: 12,
    hasStock: true,
    approvalStatus: "Approved",
    implementationStatus: "Ready to Execute",
    viewData: {
      title: "ICT STORE HARDWARE ALLOCATION REQUISITION",
      docCode: "PTVL/REC/STR/05",
      ref: "PTVL-RQ-ICT-STR-184501",
      revision: "01",
      date: "18/10/2026 14:15:20",
      onBehalf: false,
      requestFor: {
        name: "Md. Anik Islam",
        empId: "2023044078",
        doj: "10/03/2023",
        designation: "Deputy Manager",
        section: "Woven Merchandising",
        dept: "Merchandising & Operations",
        company: "Pakiza Technovation Limited , PTVL-HQ",
      },
      items: [
        {
          grant: true,
          sl: 1,
          name: "Logitech MK295 Silent Wireless Keyboard & Mouse Combo",
          advJustification: "Replacement of malfunctioning wired peripherals for data entry desk",
          stock: "12.00 SET",
          demand: "2.00 SET",
          safety: "2.00 SET",
          adjust: "0.00 SET",
          total: "2.000 SET",
          apdQty: "2",
          unit: "SET",
          category: "Computer Peripherals",
        },
      ],
      approvers: [
        {
          role: "Manager: Review",
          status: "Review",
          name: "Md. Shahiduzzaman",
          designation: "Assistant General Manager (AGM)",
          date: "18/10/2026 15:00:10",
        },
        {
          role: "Store & Inventory: Approved",
          status: "Approved",
          name: "Mamunoor Rashid",
          designation: "Deputy General Manager",
          date: "18/10/2026 16:30:45",
        },
      ],
      comments: [
        {
          id: "cm-394821-1",
          author: "Md. Anik Islam",
          designation: "Deputy Manager",
          role: "Requester",
          date: "18/10/2026 14:15:20",
          text: "Required for desk merchandising workstations.",
        },
        {
          id: "cm-394821-2",
          author: "Mamunoor Rashid",
          designation: "Deputy General Manager",
          role: "Approver",
          date: "18/10/2026 16:30:45",
          text: "Approved. Stock verified in central inventory. Ready for implementation and store issue.",
        },
      ],
    },
  },
  {
    id: "395104",
    ref: "PTVL-RQ-GEN-STR-189204",
    date: "2026-10-22",
    requesterName: "Farzana Yasmin",
    requesterEmpId: "2024018721",
    requesterDept: "Woven Merchandising Division",
    onBehalf: false,
    reqType: "General",
    itemsSummary: "Double A A4 Copy Paper (80 GSM) (5 Reams) & Matador Gel Pens (2 Boxes)",
    totalDemand: 7,
    availableStock: 45,
    hasStock: true,
    approvalStatus: "Approved",
    implementationStatus: "Ready to Execute",
    viewData: {
      title: "GENERAL STORE STATIONERY REQUISITION",
      docCode: "PTVL/REC/STR/06",
      ref: "PTVL-RQ-GEN-STR-189204",
      revision: "00",
      date: "22/10/2026 09:40:12",
      onBehalf: false,
      requestFor: {
        name: "Farzana Yasmin",
        empId: "2024018721",
        doj: "15/01/2024",
        designation: "Merchandiser",
        section: "Woven Sampling & Costing",
        dept: "Merchandising",
        company: "Pakiza Technovation Limited , PTVL-Operation",
      },
      items: [
        {
          grant: true,
          sl: 1,
          name: "Double A A4 Copy Paper (80 GSM, 500 Sheets)",
          advJustification: "Buyer audit tech-packs, order confirmation printing, and contract dockets",
          stock: "45.00 REAM",
          demand: "5.00 REAM",
          safety: "10.00 REAM",
          adjust: "0.00 REAM",
          total: "5.000 REAM",
          apdQty: "5",
          unit: "REAM",
          category: "General Stationery",
        },
        {
          grant: true,
          sl: 2,
          name: "Matador Pinpoint Gel Ballpen Box (Blue)",
          advJustification: "Daily fabric inspection logs and sample sign-off documentation",
          stock: "20.00 BOX",
          demand: "2.00 BOX",
          safety: "5.00 BOX",
          adjust: "0.00 BOX",
          total: "2.000 BOX",
          apdQty: "2",
          unit: "BOX",
          category: "General Stationery",
        },
      ],
      approvers: [
        {
          role: "Department Head: Approved",
          status: "Approved",
          name: "Seikh Zahidul Islam",
          designation: "Chief Operating Officer",
          date: "22/10/2026 11:20:00",
        },
      ],
      comments: [
        {
          id: "cm-395104-1",
          author: "Farzana Yasmin",
          designation: "Merchandiser",
          role: "Requester",
          date: "22/10/2026 09:40:12",
          text: "Urgent copy paper and inspection pens for upcoming buyer compliance audit.",
        },
      ],
    },
  },
  {
    id: "392109",
    ref: "PTVL-RQ-ICT-STR-182390",
    date: "2026-10-10",
    requesterName: "Shirin Akter",
    requesterEmpId: "2022091834",
    requesterDept: "Finance & Accounts",
    onBehalf: false,
    reqType: "ICT",
    itemsSummary: "Kingston 16GB DDR4 3200MHz Laptop RAM (1 Unit)",
    totalDemand: 1,
    availableStock: 3,
    hasStock: true,
    approvalStatus: "Approved",
    implementationStatus: "Executed",
    executedDate: "2026-10-12 16:45:00",
    executedBy: "Tahmid Afsar (Store In-Charge)",
    viewData: {
      title: "ICT STORE HARDWARE ALLOCATION REQUISITION",
      docCode: "PTVL/REC/STR/07",
      ref: "PTVL-RQ-ICT-STR-182390",
      revision: "00",
      date: "10/10/2026 10:15:00",
      onBehalf: false,
      requestFor: {
        name: "Shirin Akter",
        empId: "2022091834",
        doj: "01/09/2022",
        designation: "Senior Executive",
        section: "Payroll & Taxation",
        dept: "Finance & Accounts",
        company: "Pakiza Technovation Limited , PTVL-HQ",
      },
      items: [
        {
          grant: true,
          sl: 1,
          name: "Kingston 16GB DDR4 3200MHz Laptop RAM",
          advJustification: "Memory upgrade for running heavy ERP payroll computations",
          stock: "3.00 UNIT",
          demand: "1.00 UNIT",
          safety: "1.00 UNIT",
          adjust: "0.00 UNIT",
          total: "1.000 UNIT",
          apdQty: "1",
          unit: "UNIT",
          category: "Hardware Upgrade",
        },
      ],
      approvers: [
        {
          role: "Finance HOD: Approved",
          status: "Approved",
          name: "Md. Mahbub Hasan",
          designation: "Finance Director",
          date: "11/10/2026 14:00:00",
        },
      ],
      comments: [
        {
          id: "cm-392109-1",
          author: "Tahmid Afsar",
          designation: "Assistant Manager — HR & Admin",
          role: "Store In-Charge",
          date: "12/10/2026 16:45:00",
          text: "✓ Requisition executed. 1x 16GB Kingston RAM issued from store inventory and installed on user workstation.",
        },
      ],
    },
  },
];

const STORAGE_KEY = "cripton_ssp_implementation_requisitions";

export function loadImplementationRequisitions(): StoreImplementationRecord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to parse implementation requisitions from localStorage", e);
  }
  return INITIAL_IMPLEMENTATION_REQUISITIONS;
}

export function saveImplementationRequisitions(records: StoreImplementationRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error("Failed to save implementation requisitions to localStorage", e);
  }
}
