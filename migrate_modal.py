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

    with open('src/routes/approve-advance.tsx', 'r', encoding='utf-8') as f:
        approve_content = f.read()

    # 1. Add states
    approve_content = approve_content.replace(
        '  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());',
        '  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());\n  const [selectedReq, setSelectedReq] = useState<any>(null);\n  const [approvalComment, setApprovalComment] = useState("");'
    )

    # 1.5 Add getStatusBadge function inside ApproveAdvancePage
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
    approve_content = approve_content.replace(
        '  const [selectedReq, setSelectedReq] = useState<any>(null);\n  const [approvalComment, setApprovalComment] = useState("");',
        '  const [selectedReq, setSelectedReq] = useState<any>(null);\n  const [approvalComment, setApprovalComment] = useState("");\n' + status_badge_fn
    )

    # 2. Update Icons
    imports_to_add = 'CircleDollarSign, Clock, UserCheck, MessageSquare, AlertCircle, X, Building2, Briefcase, CalendarDays, MapPin, Check,'
    approve_content = approve_content.replace(
        '  Activity,\n} from "lucide-react";',
        '  Activity,\n  ' + imports_to_add + '\n} from "lucide-react";'
    )

    # 3. Replace alert in Eye button
    eye_button_target = """                              onClick={(e) => {
                                e.stopPropagation();
                                alert(`Remarks: ${row.remarks}`);
                              }}"""
    eye_button_replacement = """                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedReq({
                                  ...row,
                                  employeeName: row.empName,
                                  employeeId: row.empId,
                                  designation: row.designation,
                                  department: row.dept,
                                  joiningDate: "15 Mar 2025",
                                  businessUnit: "Pakiza Software Limited",
                                  location: "PSL-Operation",
                                  month: "April",
                                  year: "2026",
                                  basicSalary: 25000,
                                  grossSalary: 40000,
                                  advanceAmount: row.amount,
                                  remark: row.remarks,
                                  applicationDate: row.reqDate,
                                  submittedTime: "09:18 AM",
                                  revision: "00",
                                  history: [],
                                  approvalSteps: [],
                                  comments: []
                                });
                              }}"""
    approve_content = approve_content.replace(eye_button_target, eye_button_replacement)

    # 4. Insert Modal before closing main tag
    # In approve-advance.tsx, the end is:
    #         </div>
    #       </div>
    #     </div>
    #   </main>
    # </div>
    
    # We will inject right before `</main>`
    main_close_pattern = r'(\s*</main>\s*</div>\s*<script)'
    # wait, the file doesn't have script tags at the end. It ends with:
    #       </main>
    #     </div>
    #   );
    # }

    approve_content = approve_content.replace(
        '      </main>\n    </div>\n  );\n}',
        modal_code + '\n      </main>\n    </div>\n  );\n}'
    )

    # 5. The modal from payroll-advance uses `LayersIcon` and `BuildingIcon`. We need to import them.
    # Oh wait, `LayersIcon`, `BuildingIcon` were not in the imports to add. Let's add them.
    approve_content = approve_content.replace(
        '  Building2,',
        '  Building2, LayersIcon, BuildingIcon,'
    )

    with open('src/routes/approve-advance.tsx', 'w', encoding='utf-8') as f:
        f.write(approve_content)
    
    print("Successfully copied modal to approve-advance.tsx")

if __name__ == '__main__':
    main()
