import React, { useState } from 'react';
import {
  Search,
  Building2,
  Calendar,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CalendarDays,
  ArrowLeft,
  Check,
  X,
  ChevronDown,
  CircleDollarSign,
  Clock,
  Plus,
  MessageSquare,
  User,
  UserCheck,
  MapPin,
  Briefcase
} from 'lucide-react';
import { EmployeeInfo, AdvanceRequisition, AdvanceHistoryItem } from '../../types/advance';
import { INITIAL_EMPLOYEES, INITIAL_ADVANCE_REQUISITIONS } from '../../data/advanceData';

export const AdvancePage: React.FC = () => {
  // State variables
  const [employees] = useState<EmployeeInfo[]>(INITIAL_EMPLOYEES);
  const [requisitions, setRequisitions] = useState<AdvanceRequisition[]>(INITIAL_ADVANCE_REQUISITIONS);
  const [selectedReq, setSelectedReq] = useState<AdvanceRequisition | null>(null);
  
  // Tabs & Search for List View
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Form State for New Requisition Modal
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('June');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [remark, setRemark] = useState('');
  const [empSearchQuery, setEmpSearchQuery] = useState('');
  const [showEmpDropdown, setShowEmpDropdown] = useState(false);

  // Approval Form State
  const [approvalComment, setApprovalComment] = useState('');

  // Find selected employee details for form
  const currentSelectedEmp = employees.find(e => e.employeeId === selectedEmployeeId);

  // Filtered requisitions list
  const filteredRequisitions = requisitions.filter(req => {
    const matchesTab = activeTab === 'All' || req.status === activeTab;
    const matchesSearch = 
      req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.employeeId.includes(searchQuery) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // KPI Calculations
  const totalCount = requisitions.length;
  const pendingCount = requisitions.filter(r => r.status === 'Pending').length;
  const approvedCount = requisitions.filter(r => r.status === 'Approved').length;
  const totalDisbursed = requisitions
    .filter(r => r.status === 'Approved')
    .reduce((sum, r) => sum + r.advanceAmount, 0);

  // Create Requisition Handler
  const handleCreateRequisition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSelectedEmp || !advanceAmount || isNaN(Number(advanceAmount)) || Number(advanceAmount) <= 0) {
      alert('Please select an employee and input a valid advance amount.');
      return;
    }

    const newReqId = `PSL-RQ-ADV-${Math.floor(100000 + Math.random() * 900000)}`;
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const formattedTime = today.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const newRequisition: AdvanceRequisition = {
      sl: requisitions.length + 1,
      id: newReqId,
      applicationDate: formattedDate,
      submittedTime: formattedTime,
      revision: '00',
      employeeId: currentSelectedEmp.employeeId,
      employeeName: currentSelectedEmp.employeeName,
      company: currentSelectedEmp.company,
      employeeType: currentSelectedEmp.employeeType,
      department: currentSelectedEmp.department,
      designation: currentSelectedEmp.designation,
      section: currentSelectedEmp.section,
      businessUnit: currentSelectedEmp.businessUnit,
      location: currentSelectedEmp.location,
      joiningDate: currentSelectedEmp.joiningDate,
      basicSalary: currentSelectedEmp.basicSalary,
      grossSalary: currentSelectedEmp.grossSalary,
      month: selectedMonth,
      year: parseInt(selectedYear),
      advanceAmount: parseFloat(advanceAmount),
      remark: remark,
      status: 'Pending',
      history: currentSelectedEmp.history,
      approvalSteps: [
        {
          role: 'MANAGER',
          name: 'Tahmid Afsar',
          title: 'Deputy Manager',
          department: 'Business Innovation',
          status: 'Approved',
          timestamp: `${formattedTime} · ${formattedDate}`,
        },
        {
          role: 'MANAGER',
          name: 'Tahmid Afsar',
          title: 'Deputy Manager',
          department: 'Business Innovation',
          status: 'Approved',
          timestamp: `${formattedTime} · ${formattedDate}`,
        },
        {
          role: 'MANAGER',
          name: 'Tahmid Afsar',
          title: 'Deputy Manager',
          department: 'Business Innovation',
          status: 'Approved',
          timestamp: `${formattedTime} · ${formattedDate}`,
        },
        {
          role: 'MANAGER',
          name: 'Tahmid Afsar',
          title: 'Deputy Manager',
          department: 'Business Innovation',
          status: 'Approved',
          timestamp: `${formattedTime} · ${formattedDate}`,
        },
        {
          role: 'HOD',
          name: 'Md. Zahidul Islam',
          title: 'COO',
          department: 'Operations',
          status: 'Approved',
          timestamp: `${formattedTime} · ${formattedDate}`,
        },
        {
          role: 'HEAD OF HR',
          name: 'Rajeabul Hasan Rajon',
          title: 'Deputy Manager',
          department: 'Human Resources',
          status: 'Pending',
          timestamp: 'Pending',
        }
      ],
      comments: [
        {
          id: 1,
          authorName: 'Tahmid Afsar',
          authorRole: 'Manager',
          initials: 'TA',
          comment: `Created requisition: ${remark}`,
          timestamp: `${formattedDate} · ${formattedTime}`
        }
      ]
    };

    // Update requisitions list
    setRequisitions([newRequisition, ...requisitions]);
    
    // Reset Form
    setSelectedEmployeeId('');
    setAdvanceAmount('');
    setRemark('');
    setEmpSearchQuery('');
    setIsCreateModalOpen(false);
  };

  // Perform Approval Workflow Action
  const handleApprovalAction = (action: 'Approved' | 'Rejected') => {
    if (!selectedReq) return;

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const formattedTime = today.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const newComment = {
      id: selectedReq.comments.length + 1,
      authorName: 'Rajeabul Hasan Rajon',
      authorRole: 'Head of HR',
      initials: 'RR',
      comment: approvalComment || `${action} the salary advance requisition request.`,
      timestamp: `${formattedDate} · ${formattedTime}`
    };

    // Update approval steps (HEAD OF HR step is the last index)
    const updatedSteps = selectedReq.approvalSteps.map(step => {
      if (step.role === 'HEAD OF HR') {
        return {
          ...step,
          status: action,
          timestamp: `${formattedTime} · ${formattedDate}`
        };
      }
      return step;
    });

    const updatedReq: AdvanceRequisition = {
      ...selectedReq,
      status: action,
      approvalSteps: updatedSteps,
      comments: [...selectedReq.comments, newComment]
    };

    // Update master lists
    setRequisitions(requisitions.map(r => r.id === selectedReq.id ? updatedReq : r));
    setSelectedReq(updatedReq);
    setApprovalComment('');
  };

  // Helper: Status styles
  const getStatusBadge = (status: 'Pending' | 'Approved' | 'Rejected') => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
            APPROVED
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            REJECTED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            PENDING
          </span>
        );
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* -------------------- DETAIL APPROVAL VIEW MODAL -------------------- */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 relative space-y-5">
            
            {/* Header section matching 2nd Image */}
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

            {/* REQUEST FOR Card Section matching Image 2 */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left side: Avatar & Name */}
                <div className="lg:col-span-4 flex items-center gap-4 border-b lg:border-b-0 lg:border-r border-slate-100 pb-4 lg:pb-0 lg:pr-6">
                  <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-lg shadow-sm shadow-blue-500/20 shrink-0">
                    {selectedReq.employeeName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">REQUEST FOR</span>
                    <h2 className="text-sm font-extrabold text-slate-800 truncate">{selectedReq.employeeName}</h2>
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Employee ID · {selectedReq.employeeId}</p>
                  </div>
                </div>

                {/* Right side: 6 columns Metadata Grid */}
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

            {/* Requisition Items section styled like store items table */}
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
                      <td className="py-4 px-4 font-mono text-slate-600">BDT {selectedReq.basicSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="py-4 px-4 font-mono text-slate-600">BDT {selectedReq.grossSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-blue-600">BDT {selectedReq.advanceAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-150">
                          {((selectedReq.advanceAmount / selectedReq.basicSalary) * 100).toFixed(1)}% of Basic
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {selectedReq.status === 'Pending' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                            <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                            PENDING
                          </span>
                        ) : selectedReq.status === 'Approved' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-600 border border-green-200">
                            <span className="w-1 h-1 rounded-full bg-green-500"></span>
                            APPROVED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                            <span className="w-1 h-1 rounded-full bg-rose-500"></span>
                            REJECTED
                          </span>
                        )}
                      </td>
                    </tr>
                    {/* Reason for Request Row */}
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
                      selectedReq.history.map((hist, idx) => (
                        <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 bg-white font-semibold text-slate-700 transition-colors">
                          <td className="py-3 px-4 text-slate-900">{hist.month}</td>
                          <td className="py-3 px-4 text-slate-600">{hist.year}</td>
                          <td className="py-3 px-4 text-right font-mono text-slate-800">BDT {hist.advance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              hist.status === 'Approved' 
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                              {hist.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-500 italic font-medium">{hist.remark}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Approval Workflow & Signatures matching Image 2 */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-2">
                <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Approval Workflow & Signatures</h3>
              </div>

              {/* Steps progression grid: 6 items (exactly matches image columns layout) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 border border-slate-200 rounded-xl divide-y sm:divide-y-0 sm:divide-x divide-slate-200 overflow-hidden bg-white shadow-3xs">
                {selectedReq.approvalSteps?.map((step, idx) => (
                  <div key={idx} className="p-4 flex flex-col justify-between space-y-3 bg-white hover:bg-slate-50/20 transition-colors">
                    {/* Step Header */}
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

                    {/* Step Body */}
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{step.name}</h4>
                      <p className="text-[10px] text-slate-500 truncate font-semibold mt-0.5">{step.title}</p>
                      <p className="text-[9px] text-slate-400 truncate mt-0.5">{step.department}</p>
                    </div>

                    {/* Step Timestamp */}
                    <div className="pt-2 border-t border-slate-100/50 mt-1">
                      <p className="text-[9px] text-slate-400 font-bold mt-1 tracking-tighter">
                        {step.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments & Approval Notes matching Image 2 */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-2">
                <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Comments & Approval Notes</h3>
              </div>

              {/* Comments Feed */}
              <div className="space-y-3">
                {selectedReq.comments?.map((comment) => (
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

              {/* Interactive Approval Actions Box for Head of HR */}
              {selectedReq.status === 'Pending' && (
                <div className="border border-amber-250 bg-amber-50/10 rounded-xl p-4 mt-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-slate-800">Review & Action Panel (as HEAD OF HR)</span>
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
                      onClick={() => handleApprovalAction('Approved')}
                      className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve Request</span>
                    </button>
                    <button
                      onClick={() => handleApprovalAction('Rejected')}
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
        
      {/* -------------------- MAIN REQUISITIONS LIST VIEW -------------------- */}
      <div className="space-y-6">
          
          {/* Header block */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <CircleDollarSign className="w-6 h-6 text-blue-600" />
                <span>Salary & General Advance Requisitions</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Manage, review and process employee advance requisitions with automatic approval routing.
              </p>
            </div>
            
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center gap-2 transition-all shadow-md shadow-blue-500/20 self-start md:self-center cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>NEW ADVANCE REQUISITION</span>
            </button>
          </div>

          {/* Metric Cards Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Requests</span>
                <span className="text-2xl font-black text-slate-800 mt-1 block">{totalCount}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100">
                <FileText className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pending Approvals</span>
                <span className="text-2xl font-black text-amber-600 mt-1 block">{pendingCount}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Approved Requests</span>
                <span className="text-2xl font-black text-green-600 mt-1 block">{approvedCount}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center border border-green-100">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Disbursed</span>
                <span className="text-xl font-black text-blue-600 mt-1 block">
                  BDT {totalDisbursed.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100">
                <CircleDollarSign className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-3xs overflow-hidden">
            {/* Filter controls */}
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Tab options */}
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 self-start">
                {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === tab
                        ? 'bg-white text-blue-600 shadow-2xs font-extrabold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Employee, ID or Requisition..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 focus:bg-white bg-slate-50/50"
                />
              </div>
            </div>

            {/* List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 font-bold select-none text-[10px]">
                    <th className="py-3 px-5 text-center w-12 uppercase tracking-wider">SL</th>
                    <th className="py-3 px-5 uppercase tracking-wider">Application ID</th>
                    <th className="py-3 px-5 uppercase tracking-wider">Employee Name & ID</th>
                    <th className="py-3 px-5 uppercase tracking-wider text-center">Month/Year</th>
                    <th className="py-3 px-5 uppercase tracking-wider text-right">Advance Amount</th>
                    <th className="py-3 px-5 uppercase tracking-wider">Submitted On</th>
                    <th className="py-3 px-5 uppercase tracking-wider text-center">Status</th>
                    <th className="py-3 px-5 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequisitions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 font-semibold">
                        No advance requisitions found.
                      </td>
                    </tr>
                  ) : (
                    filteredRequisitions.map((req, idx) => (
                      <tr key={req.id} className="border-b border-slate-100 hover:bg-slate-50/40 text-slate-700 font-semibold transition-colors">
                        <td className="py-4 px-5 text-center text-slate-400">{idx + 1}</td>
                        <td className="py-4 px-5 font-bold text-slate-800">{req.id}</td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-[10px] shadow-3xs">
                              {req.employeeName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{req.employeeName}</p>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">ID: {req.employeeId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-center font-bold text-slate-600">
                          {req.month} {req.year}
                        </td>
                        <td className="py-4 px-5 text-right font-mono font-bold text-slate-800">
                          BDT {req.advanceAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 px-5 text-slate-500 font-medium">
                          <div>{req.applicationDate}</div>
                          <div className="text-[10px] text-slate-400 font-bold mt-0.5">{req.submittedTime}</div>
                        </td>
                        <td className="py-4 px-5 text-center">
                          {getStatusBadge(req.status)}
                        </td>
                        <td className="py-4 px-5 text-center">
                          <button
                            onClick={() => setSelectedReq(req)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 text-slate-700 hover:text-blue-600 font-bold text-[11px] transition-all cursor-pointer shadow-3xs"
                          >
                            Review & Approval
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table pagination placeholder */}
            <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>Showing {filteredRequisitions.length} of {requisitions.length} records</span>
              <div className="flex gap-2">
                <button className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 cursor-not-allowed select-none font-bold">Prev</button>
                <button className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-bold cursor-pointer">Next</button>
              </div>
            </div>
          </div>

        </div>

      {/* -------------------- NEW ADVANCE REQUISITION MODAL matching Image 1 -------------------- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between select-none">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/50 shadow-xs shrink-0">
                  <CircleDollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">New Advance Requisition</h2>
                  <p className="text-[10.5px] text-slate-400 font-semibold">Create a new salary or general advance request for an employee.</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body (Scrollable Form) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Main Fields Form */}
              <form id="new-req-form" onSubmit={handleCreateRequisition} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                
                {/* EmpId (Search dropdown) */}
                <div className="space-y-1 relative">
                  <label className="text-[10px] font-bold text-slate-600 tracking-wider uppercase">EmpId</label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search Emp ID..."
                      value={empSearchQuery || (currentSelectedEmp ? `${currentSelectedEmp.employeeId} - ${currentSelectedEmp.employeeName}` : '')}
                      onChange={(e) => {
                        setEmpSearchQuery(e.target.value);
                        setShowEmpDropdown(true);
                      }}
                      onFocus={() => setShowEmpDropdown(true)}
                      className="w-full pl-9 pr-8 h-9 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500 bg-slate-50/20"
                    />
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 cursor-pointer pointer-events-none" />
                  </div>

                  {/* Dropdown Options */}
                  {showEmpDropdown && (
                    <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg z-30 divide-y divide-slate-100">
                      {employees
                        .filter(e => 
                          e.employeeName.toLowerCase().includes(empSearchQuery.toLowerCase()) ||
                          e.employeeId.includes(empSearchQuery)
                        )
                        .map(emp => (
                          <div
                            key={emp.employeeId}
                            onClick={() => {
                              setSelectedEmployeeId(emp.employeeId);
                              setEmpSearchQuery('');
                              setShowEmpDropdown(false);
                            }}
                            className="p-3 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer font-semibold flex items-center justify-between"
                          >
                            <span>{emp.employeeName}</span>
                            <span className="text-slate-400 font-bold">ID: {emp.employeeId}</span>
                          </div>
                        ))
                      }
                      {employees.filter(e => 
                        e.employeeName.toLowerCase().includes(empSearchQuery.toLowerCase()) ||
                        e.employeeId.includes(empSearchQuery)
                      ).length === 0 && (
                        <div className="p-3 text-xs text-slate-400 text-center font-semibold">No employees found</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Month Dropdown */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 tracking-wider uppercase">Month</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-3 h-9 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
                  >
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Company (Read only) */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Company</label>
                  <input
                    type="text"
                    readOnly
                    value={currentSelectedEmp?.company || '-'}
                    className="w-full px-3 h-9 bg-slate-50 text-slate-500 border border-slate-200 rounded-lg text-xs font-semibold cursor-not-allowed"
                  />
                </div>

                {/* Year Dropdown */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 tracking-wider uppercase">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 h-9 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
                  >
                    {['2025', '2026', '2027', '2028'].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                {/* Employee Type (Read only) */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Employee Type</label>
                  <input
                    type="text"
                    readOnly
                    value={currentSelectedEmp?.employeeType || '-'}
                    className="w-full px-3 h-9 bg-slate-50 text-slate-500 border border-slate-200 rounded-lg text-xs font-semibold cursor-not-allowed"
                  />
                </div>

                {/* Advance Amount */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 tracking-wider uppercase">Advance Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={advanceAmount}
                    onChange={(e) => setAdvanceAmount(e.target.value)}
                    className="w-full px-3 h-9 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
                  />
                </div>

                {/* Department (Read only) */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Department</label>
                  <input
                    type="text"
                    readOnly
                    value={currentSelectedEmp?.department || '-'}
                    className="w-full px-3 h-9 bg-slate-50 text-slate-500 border border-slate-200 rounded-lg text-xs font-semibold cursor-not-allowed"
                  />
                </div>

                {/* Remark / Justification */}
                <div className="space-y-1 md:row-span-3">
                  <label className="text-[10px] font-bold text-slate-600 tracking-wider uppercase">Remark</label>
                  <textarea
                    placeholder="Provide justification for the request..."
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
                    rows={4}
                  />
                </div>

                {/* Designation (Read only) */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Designation</label>
                  <input
                    type="text"
                    readOnly
                    value={currentSelectedEmp?.designation || '-'}
                    className="w-full px-3 h-9 bg-slate-50 text-slate-500 border border-slate-200 rounded-lg text-xs font-semibold cursor-not-allowed"
                  />
                </div>

                {/* Basic Salary (Read only) */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Basic Salary</label>
                  <input
                    type="text"
                    readOnly
                    value={currentSelectedEmp ? `BDT ${currentSelectedEmp.basicSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                    className="w-full px-3 h-9 bg-slate-50 text-slate-500 border border-slate-200 rounded-lg text-xs font-semibold cursor-not-allowed"
                  />
                </div>

                {/* Gross Salary (Read only) */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Gross Salary</label>
                  <input
                    type="text"
                    readOnly
                    value={currentSelectedEmp ? `BDT ${currentSelectedEmp.grossSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                    className="w-full px-3 h-9 bg-slate-50 text-slate-500 border border-slate-200 rounded-lg text-xs font-semibold cursor-not-allowed"
                  />
                </div>

              </form>

              {/* Salary Advance History Section matching Image 1 */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="border-b-2 border-slate-200 pb-1 flex justify-between items-center select-none">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider relative">
                    Salary Advance History
                    <span className="absolute bottom-[-6px] left-0 right-0 h-1 bg-blue-600 rounded-full"></span>
                  </h3>
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
                      {!currentSelectedEmp || currentSelectedEmp.history.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400 font-semibold bg-white">
                            No data available!
                          </td>
                        </tr>
                      ) : (
                        currentSelectedEmp.history.map((hist, idx) => (
                          <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 bg-white font-semibold text-slate-700 transition-colors">
                            <td className="py-3 px-4 text-slate-900">{hist.month}</td>
                            <td className="py-3 px-4 text-slate-600">{hist.year}</td>
                            <td className="py-3 px-4 text-right font-mono text-slate-800">BDT {hist.advance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                hist.status === 'Approved' 
                                  ? 'bg-green-50 text-green-700 border border-green-200' 
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}>
                                {hist.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-500 italic font-medium">{hist.remark}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3 select-none">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all shadow-3xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="new-req-form"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Create
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

// Local component helpers to replace lucide missing items safely
const LayersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-10 5 10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>
);

const BuildingIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="16"/><line x1="15" y1="22" x2="15" y2="16"/><line x1="9" y1="16" x2="15" y2="16"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/></svg>
);
