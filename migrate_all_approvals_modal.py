import re

def main():
    with open('src/routes/payroll-advance.tsx', 'r', encoding='utf-8') as f:
        payroll_content = f.read()

    # Extract the modal
    modal_match = re.search(r'({\s*/\*\s*-------------------- DETAIL APPROVAL VIEW MODAL --------------------\s*\*/.*?)\s*{\s*/\*\s*Breadcrumb Navigation\s*\*/', payroll_content, re.DOTALL)
    if not modal_match:
        print("Could not find modal in payroll-advance.tsx")
        return
    modal_code = modal_match.group(1)

    with open('src/routes/all-approvals.tsx', 'r', encoding='utf-8') as f:
        all_content = f.read()

    # 1. Add selectedReq and approvalComment state
    all_content = all_content.replace(
        '  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);\n  const [selectedLoanData, setSelectedLoanData] = useState<LoanApprovalModalData | null>(null);',
        '  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);\n  const [selectedLoanData, setSelectedLoanData] = useState<LoanApprovalModalData | null>(null);\n  const [selectedReq, setSelectedReq] = useState<any>(null);\n  const [approvalComment, setApprovalComment] = useState("");'
    )

    # 1.5 Add getStatusBadge inside AllApprovalsPage
    status_badge_fn = """
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Approved</Badge>
        );
      case "Pending":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">Pending</Badge>;
      case "Rejected":
        return <Badge className="bg-rose-500/10 text-rose-600 border-rose-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
"""
    all_content = all_content.replace(
        '  const [approvalComment, setApprovalComment] = useState("");',
        '  const [approvalComment, setApprovalComment] = useState("");\n' + status_badge_fn
    )

    # 2. Add imports
    imports_to_add = 'CircleDollarSign, UserCheck, MessageSquare, AlertCircle, X, BuildingIcon, LayersIcon, CalendarDays, MapPin, Check,'
    all_content = all_content.replace(
        '  UserX,\n} from "lucide-react";',
        '  UserX,\n  ' + imports_to_add + '\n} from "lucide-react";'
    )

    # 3. Update handleOpenDetailsModal
    handle_open_target = """  const handleOpenDetailsModal = (item: ApprovalRequest) => {
    setSelectedLoanData({"""
    handle_open_replacement = """  const handleOpenDetailsModal = (item: ApprovalRequest) => {
    if (item.module === "Advance") {
      setSelectedReq({
        ...item,
        employeeName: item.employee.name,
        employeeId: item.employee.id,
        designation: item.employee.designation,
        department: item.employee.department,
        joiningDate: "15 Mar 2025",
        businessUnit: "Pakiza Software Limited",
        location: "PSL-Operation",
        month: "April",
        year: "2026",
        basicSalary: 25000,
        grossSalary: 40000,
        advanceAmount: item.amount,
        remark: item.details,
        applicationDate: item.date,
        submittedTime: "09:18 AM",
        revision: "00",
        history: [],
        approvalSteps: [],
        comments: []
      });
      return;
    }
    setSelectedLoanData({"""
    
    all_content = all_content.replace(handle_open_target, handle_open_replacement)

    # 4. Inject Modal before `      {/* Loan Approval View Modal */}`
    all_content = all_content.replace(
        '      {/* Loan Approval View Modal */}',
        modal_code + '\n      {/* Loan Approval View Modal */}'
    )

    with open('src/routes/all-approvals.tsx', 'w', encoding='utf-8') as f:
        f.write(all_content)
    
    print("Successfully copied modal to all-approvals.tsx")

if __name__ == '__main__':
    main()
