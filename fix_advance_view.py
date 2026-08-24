import re

with open('src/routes/payroll-advance.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add required imports from lucide-react if missing
imports_to_add = ["CircleDollarSign", "Clock", "UserCheck", "MessageSquare", "AlertCircle", "Check", "X", "Building2", "Briefcase", "CalendarDays", "MapPin", "Eye"]
for imp in imports_to_add:
    if imp not in content:
        content = re.sub(r'import\s+\{([^}]+)\}\s+from\s+"lucide-react";', r'import {\1, ' + imp + r'} from "lucide-react";', content, 1)

# Add local Icons if not in lucide-react
local_icons = """
const LayersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-10 5 10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>
);

const BuildingIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="16"/><line x1="15" y1="22" x2="15" y2="16"/><line x1="9" y1="16" x2="15" y2="16"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/></svg>
);
"""
if "LayersIcon" not in content:
    content = content.replace('export const Route =', local_icons + '\nexport const Route =')

# 2. Update advanceData to have all fields required by the view modal
extended_data_replacement = """const advanceData = [
  {
    id: "PSL-RQ-ADV-391911",
    empId: "2021028542",
    empName: "Zakir Hossain",
    employeeName: "Zakir Hossain",
    employeeId: "2021028542",
    designation: "Executive",
    type: "Office Executive",
    dept: "Implementation & Support (HR)",
    department: "Implementation & Support (HR)",
    section: "Project Resource & Strategy",
    joiningDate: "15 Mar 2025",
    businessUnit: "Pakiza Software Limited",
    location: "PSL-Operation",
    company: "Pakiza Software Limited",
    month: "April",
    year: "2026",
    amount: 15000.0,
    advanceAmount: 15000.0,
    basicSalary: 12000.0,
    grossSalary: 20000.0,
    status: "Approved",
    remarks: "Salary Advance.",
    remark: "Requesting salary advance due to family medical emergency.",
    applicationDate: "14 Jul 2026",
    submittedTime: "09:18 AM",
    revision: "00",
    history: [
      { month: "March", year: "2026", advance: 5000.0, status: "Approved", remark: "Medical checkup" },
      { month: "May", year: "2026", advance: 3000.0, status: "Approved", remark: "Festival helper" }
    ],
    approvalSteps: [
      { role: "MANAGER", name: "Tahmid Afsar", title: "Deputy Manager", department: "Business Innovation", status: "Approved", timestamp: "09:18 AM · 14 Jul 2026" },
      { role: "HOD", name: "Md. Zahidul Islam", title: "COO", department: "Operations", status: "Approved", timestamp: "10:30 AM · 14 Jul 2026" },
      { role: "HEAD OF HR", name: "Rajeabul Hasan Rajon", title: "Head of HR", department: "Human Resources", status: "Pending", timestamp: "Pending" }
    ],
    comments: [
      { id: 1, authorName: "Tahmid Afsar", authorRole: "Manager", initials: "TA", comment: "Created requisition", timestamp: "14 Jul 2026 · 09:18 AM" }
    ]
  },
  {
    id: "PSL-RQ-ADV-391912",
    empId: "2022041203",
    empName: "Khairul Bashar Masum",
    employeeName: "Khairul Bashar Masum",
    employeeId: "2022041203",
    designation: "Asst. Manager",
    type: "Office Executive",
    dept: "HR Team",
    department: "HR Team",
    section: "Human Resources",
    joiningDate: "10 Jan 2024",
    businessUnit: "Pakiza Software Limited",
    location: "PSL-Operation",
    company: "Pakiza Software Limited",
    month: "February",
    year: "2026",
    amount: 5500.0,
    advanceAmount: 5500.0,
    basicSalary: 22500.0,
    grossSalary: 35000.0,
    status: "Approved",
    remarks: "Salary Advance.",
    remark: "Personal reasons.",
    applicationDate: "05 Feb 2026",
    submittedTime: "11:20 AM",
    revision: "00",
    history: [],
    approvalSteps: [],
    comments: []
  },
  {
    id: "PSL-RQ-ADV-391913",
    empId: "2022041203",
    empName: "Khairul Bashar Masum",
    employeeName: "Khairul Bashar Masum",
    employeeId: "2022041203",
    designation: "Asst. Manager",
    type: "Office Executive",
    dept: "HR Team",
    department: "HR Team",
    section: "Human Resources",
    joiningDate: "10 Jan 2024",
    businessUnit: "Pakiza Software Limited",
    location: "PSL-Operation",
    company: "Pakiza Software Limited",
    month: "April",
    year: "2026",
    amount: 3500.0,
    advanceAmount: 3500.0,
    basicSalary: 22500.0,
    grossSalary: 35000.0,
    status: "Pending",
    remarks: "Salary Advance",
    remark: "Emergency.",
    applicationDate: "10 Apr 2026",
    submittedTime: "10:15 AM",
    revision: "00",
    history: [],
    approvalSteps: [],
    comments: []
  }
];"""
content = re.sub(r'const advanceData = \[.*?\];', extended_data_replacement, content, flags=re.DOTALL)

# 3. Add state for selectedReq
if "const [selectedReq, setSelectedReq] = useState<any>(null);" not in content:
    content = content.replace('const [selectedEmpId, setSelectedEmpId] = useState("");', 'const [selectedEmpId, setSelectedEmpId] = useState("");\n  const [selectedReq, setSelectedReq] = useState<any>(null);\n  const [approvalComment, setApprovalComment] = useState("");')

# 4. Add the View Modal code
view_modal_code = """
      {/* -------------------- DETAIL APPROVAL VIEW MODAL -------------------- */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 relative space-y-5">
            
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-100 gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs shrink-0 border border-blue-100/50">
                  <CircleDollarSign className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-sm font-black text-slate-800 uppercase tracking-tight">Salary Advance Requisition</h1>
                    {getStatusBadge(selectedReq.status)}
                  </div>
                  <div className="flex flex-col gap-0.5 mt-1">
                    <p className="text-[11px] text-slate-500 font-semibold tracking-tight">
                      # Application No: <span className="text-slate-700">{selectedReq.id}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold tracking-tight">
                      # Revision: <span className="text-slate-600">{selectedReq.revision}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right metadata / Close Button */}
              <div className="flex items-center gap-4 self-end md:self-center">
                <div className="text-right border-r pr-4 border-slate-200 hidden sm:block">
                  <span className="text-[9px] text-slate-400 block font-bold tracking-wider uppercase">APPLICATION DATE</span>
                  <span className="text-xs font-extrabold text-slate-700 block">{selectedReq.applicationDate}</span>
                  <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">Submitted {selectedReq.submittedTime}</span>
                </div>
                <button
                  onClick={() => setSelectedReq(null)}
                  className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all shrink-0 shadow-3xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* REQUEST FOR Card Section */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-4 flex items-center gap-4 border-b lg:border-b-0 lg:border-r border-slate-100 pb-4 lg:pb-0 lg:pr-6">
                  <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-lg shadow-sm shadow-blue-500/20 shrink-0">
                    {selectedReq.employeeName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">REQUEST FOR</span>
                    <h2 className="text-sm font-extrabold text-slate-800 truncate">{selectedReq.employeeName}</h2>
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Employee ID · {selectedReq.employeeId}</p>
                  </div>
                </div>

                <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">DESIGNATION</p>
                      <p className="font-bold text-slate-700 mt-0.5">{selectedReq.designation}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">DEPARTMENT</p>
                      <p className="font-bold text-slate-700 mt-0.5">{selectedReq.department}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <LayersIcon className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">SECTION</p>
                      <p className="font-bold text-slate-700 mt-0.5">{selectedReq.section || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">DATE OF JOINING</p>
                      <p className="font-bold text-slate-700 mt-0.5">{selectedReq.joiningDate}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <BuildingIcon className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">BUSINESS UNIT</p>
                      <p className="font-bold text-slate-700 mt-0.5">{selectedReq.businessUnit}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">LOCATION</p>
                      <p className="font-bold text-slate-700 mt-0.5">{selectedReq.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Requisition Items section */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-2">
                <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Salary Advance Details</h3>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-3xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold select-none text-[10px]">
                      <th className="py-3 px-4 w-12 text-center uppercase tracking-wider">SL</th>
                      <th className="py-3 px-4 uppercase tracking-wider">Advance Month/Year</th>
                      <th className="py-3 px-4 uppercase tracking-wider">Basic Salary</th>
                      <th className="py-3 px-4 uppercase tracking-wider">Gross Salary</th>
                      <th className="py-3 px-4 uppercase tracking-wider text-right">Requested Advance</th>
                      <th className="py-3 px-4 uppercase tracking-wider text-center">Ratio to Basic</th>
                      <th className="py-3 px-4 uppercase tracking-wider text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 hover:bg-slate-50/50 font-semibold text-slate-700 transition-colors">
                      <td className="py-4 px-4 text-center text-slate-400">1</td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-800">{selectedReq.month} {selectedReq.year}</div>
                        <div className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wide">SALARY ADVANCE</div>
                      </td>
                      <td className="py-4 px-4 font-mono text-slate-600">BDT {selectedReq.basicSalary?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="py-4 px-4 font-mono text-slate-600">BDT {selectedReq.grossSalary?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-blue-600">BDT {selectedReq.advanceAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-150">
                          {selectedReq.basicSalary ? ((selectedReq.advanceAmount / selectedReq.basicSalary) * 100).toFixed(1) : 0}% of Basic
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {getStatusBadge(selectedReq.status)}
                      </td>
                    </tr>
                    <tr className="bg-slate-50/30 text-xs">
                      <td colSpan={7} className="py-3 px-5 text-slate-600 leading-relaxed">
                        <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[9px] mr-2">Employee Remark:</span>
                        <span className="italic">"{selectedReq.remark}"</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Salary Advance History Section */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-2">
                <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Salary Advance History</h3>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-3xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 font-bold select-none text-[10px]">
                      <th className="py-2.5 px-4 uppercase tracking-wider">Month</th>
                      <th className="py-2.5 px-4 uppercase tracking-wider">Year</th>
                      <th className="py-2.5 px-4 uppercase tracking-wider text-right">Advance</th>
                      <th className="py-2.5 px-4 uppercase tracking-wider text-center">Status</th>
                      <th className="py-2.5 px-4 uppercase tracking-wider">Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!selectedReq.history || selectedReq.history.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 font-semibold bg-white">
                          No data available!
                        </td>
                      </tr>
                    ) : (
                      selectedReq.history.map((hist: any, idx: number) => (
                        <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 bg-white font-semibold text-slate-700 transition-colors">
                          <td className="py-3 px-4 text-slate-900">{hist.month}</td>
                          <td className="py-3 px-4 text-slate-600">{hist.year}</td>
                          <td className="py-3 px-4 text-right font-mono text-slate-800">BDT {hist.advance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                          <td className="py-3 px-4 text-center">
                            {getStatusBadge(hist.status)}
                          </td>
                          <td className="py-3 px-4 text-slate-500 italic font-medium">{hist.remark}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Approval Workflow & Signatures */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-2">
                <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Approval Workflow & Signatures</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 border border-slate-200 rounded-xl divide-y sm:divide-y-0 sm:divide-x divide-slate-200 overflow-hidden bg-white shadow-3xs">
                {selectedReq.approvalSteps?.map((step: any, idx: number) => (
                  <div key={idx} className="p-4 flex flex-col justify-between space-y-3 bg-white hover:bg-slate-50/20 transition-colors">
                    <div className="flex items-center justify-between gap-1 border-b border-slate-100 pb-2">
                      <span className="text-[9px] font-extrabold text-slate-400 tracking-wider uppercase">{step.role}</span>
                      {step.status === 'Approved' ? (
                        <span className="text-[9px] font-extrabold text-emerald-600 flex items-center gap-1 tracking-tight">
                          ✓ APPROVED
                        </span>
                      ) : step.status === 'Rejected' ? (
                        <span className="text-[9px] font-extrabold text-rose-600 flex items-center gap-1 tracking-tight">
                          ✗ REJECTED
                        </span>
                      ) : (
                        <span className="text-[9px] font-extrabold text-amber-600 flex items-center gap-1 tracking-tight">
                          ◔ PENDING
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{step.name}</h4>
                      <p className="text-[10px] text-slate-500 truncate font-semibold mt-0.5">{step.title}</p>
                      <p className="text-[9px] text-slate-400 truncate mt-0.5">{step.department}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-100/50 mt-1">
                      <p className="text-[9px] text-slate-400 font-bold mt-1 tracking-tighter">
                        {step.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments & Approval Notes */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-2">
                <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Comments & Approval Notes</h3>
              </div>

              <div className="space-y-3">
                {selectedReq.comments?.map((comment: any) => (
                  <div key={comment.id} className="p-3.5 rounded-xl border border-slate-150 bg-slate-50/20 flex gap-3.5 items-start">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] flex items-center justify-center shrink-0 shadow-xs">
                      {comment.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-4 flex-wrap">
                        <h4 className="text-xs font-bold text-slate-800">
                          {comment.authorName} <span className="text-[10px] text-slate-400 font-semibold">· {comment.authorRole}</span>
                        </h4>
                        <span className="text-[10px] text-slate-400 font-bold">{comment.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">
                        {comment.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {selectedReq.status === 'Pending' && (
                <div className="border border-amber-250 bg-amber-50/10 rounded-xl p-4 mt-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-slate-800">Review & Action Panel</span>
                  </div>
                  
                  <textarea
                    value={approvalComment}
                    onChange={(e) => setApprovalComment(e.target.value)}
                    placeholder="Enter approval note or rejection explanation..."
                    className="w-full p-3 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
                    rows={3}
                  />

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        const newReq = {...selectedReq, status: 'Approved'};
                        setSelectedReq(newReq);
                      }}
                      className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve Request</span>
                    </button>
                    <button
                      onClick={() => {
                        const newReq = {...selectedReq, status: 'Rejected'};
                        setSelectedReq(newReq);
                      }}
                      className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject Request</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
          </div>
        </div>
      )}
"""
if "{selectedReq && (" not in content:
    content = content.replace('<div className="p-4 md:p-6 space-y-6 w-full">', '<div className="p-4 md:p-6 space-y-6 w-full">\n' + view_modal_code)

# 5. Add "Eye" (View) button to actions in the table
action_buttons = """<Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => setSelectedReq(row)}
                          >
                            <Eye className="size-4" />
                          </Button>"""
if "<Eye className=" not in content:
    content = content.replace('<div className="flex items-center justify-end gap-2 opacity-70 hover:opacity-100 transition-opacity">', '<div className="flex items-center justify-end gap-2 opacity-70 hover:opacity-100 transition-opacity">\n                          ' + action_buttons)

with open('src/routes/payroll-advance.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
