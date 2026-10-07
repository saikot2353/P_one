import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { SimRequisitionModal } from "@/components/ssp/SimRequisitionModal";
import type { SimRequisitionData } from "@/components/ssp/SimRequisitionModal";

export const Route = createFileRoute("/ssp-sim-requisition-view")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      id: (search.id as string) || "",
    };
  },
  head: () => ({
    meta: [
      { title: "SIM Requisition Modal View — CRIPTON HRIS" },
      {
        name: "description",
        content: "Corporate Mobile SIM Card Requisition Modal View.",
      },
    ],
  }),
  component: SimRequisitionViewPage,
});

function SimRequisitionViewPage() {
  const search = useSearch({ from: "/ssp-sim-requisition-view" });
  const navigate = useNavigate();
  const [reqData, setReqData] = useState<SimRequisitionData | null>(null);
  const [modalOpen, setModalOpen] = useState(true);

  useEffect(() => {
    const storedSimsRaw = localStorage.getItem("cripton_sim_requisitions");
    if (storedSimsRaw) {
      try {
        const storedSims: SimRequisitionData[] = JSON.parse(storedSimsRaw);
        if (search.id) {
          const found = storedSims.find((s) => s.id === search.id || s.reqNum === search.id);
          if (found) {
            setReqData(found);
            return;
          }
        } else if (storedSims.length > 0) {
          setReqData(storedSims[0]);
          return;
        }
      } catch (e) {
        console.error("Failed to parse sim requisitions", e);
      }
    }

    setReqData({
      id: "SIM/2026/00142",
      reqNum: "SIM/2026/00142",
      reqDate: "2026-09-19",
      status: "Pending",
      requestFor: "New SIM Card Allocation (Official)",
      operator: "Grameenphone (GP)",
      justification:
        "Assigned as Lead Field Coordinator for the ERP implementation team. Requires an official voice & 4G high-speed cellular package for 24/7 technical communication and customer onboarding.",
      attachmentName: "HOD_Approval_Memo_ERP_Field.pdf",
      attachmentSize: "1.4 MB",
      onBehalf: true,
      section: "Software Engineering & Solutions",
      requisitionFor: "Md. Anik Islam (EMP-20230412)",
      requesterName: "Tahmid Afsar",
      requesterId: "2023043910",
      department: "Business Innovation",
      createdAt: new Date().toISOString(),
    });
  }, [search.id]);

  const handleOpenChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      navigate({ to: "/ssp-my-requisition" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900/40 flex items-center justify-center">
      <SimRequisitionModal open={modalOpen} onOpenChange={handleOpenChange} data={reqData} />
    </div>
  );
}
