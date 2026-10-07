import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  X,
  FileText,
  Printer,
  Paperclip,
  CheckCircle2,
  XCircle,
  Calendar,
  Edit3,
  Check,
} from "lucide-react";
import { toast } from "sonner";

export interface ResignationItem {
  id: string;
  empId: string;
  empName: string;
  department: string;
  designation: string;
  joiningDate: string;
  subject: string;
  noticeDate: string;
  intendedLastWorkingDate: string;
  noticePeriodDays: number;
  reason: string;
  letterBody: string;
  attachedFileName?: string;
  status: string;
  submittedDate: string;
}

interface ResignationApprovalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: ResignationItem | null;
  onApprove?: (id: string, remark: string, newLwd?: string) => void;
  onReject?: (id: string, remark: string) => void;
}

export function ResignationApprovalModal({
  open,
  onOpenChange,
  data,
  onApprove,
  onReject,
}: ResignationApprovalModalProps) {
  const reqNo = data?.id || "RES-00002";
  const refNo = `PKCL/HR/RES/${reqNo.replace(/^RES-/, "")}`;
  const submittedDate = data?.submittedDate || "19/09/2026 12:39 PM";
  
  const [currentStatus, setCurrentStatus] = useState(data?.status || "Pending");
  const [actionRemark, setActionRemark] = useState("");
  
  // Editable Intended Last Working Day
  const [lastWorkingDate, setLastWorkingDate] = useState(data?.intendedLastWorkingDate || "30/09/2026");
  const [isEditingLwd, setIsEditingLwd] = useState(false);
  const [tempLwd, setTempLwd] = useState(lastWorkingDate);

  useEffect(() => {
    if (data) {
      setCurrentStatus(data.status || "Pending");
      setLastWorkingDate(data.intendedLastWorkingDate || "30/09/2026");
      setTempLwd(data.intendedLastWorkingDate || "30/09/2026");
    }
  }, [data]);

  const employeeName = data?.empName || "Md. Rejaul Karim (Aonkon)";
  const employeeId = data?.empId || "2023044017";
  const designation = data?.designation || "Deputy Manager";
  const department = data?.department || "Support & Business Automation | Pakiza Software Limited";
  const noticeDate = data?.noticeDate || "01/09/2026";
  const reason = data?.reason || "Personal & Family Responsibilities";
  const subject = data?.subject || `Formal Resignation Letter - ${employeeName} (${employeeId})`;
  const attachment = data?.attachedFileName || "1789799952_984e3614.png";

  const handleSaveLwd = () => {
    if (tempLwd.trim()) {
      setLastWorkingDate(tempLwd.trim());
      setIsEditingLwd(false);
      toast.success(`Intended Last Working Day updated to ${tempLwd.trim()}`);
    }
  };

  const handleApprove = () => {
    setCurrentStatus("Approved");
    toast.success(`Resignation Request #${reqNo} Approved successfully!`);
    onApprove?.(reqNo, actionRemark, lastWorkingDate);
    setActionRemark("");
  };

  const handleReject = () => {
    setCurrentStatus("Rejected");
    toast.error(`Resignation Request #${reqNo} Rejected.`);
    onReject?.(reqNo, actionRemark);
    setActionRemark("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl overflow-hidden gap-0 max-h-[95vh] flex flex-col [&>button]:hidden text-slate-800 dark:text-slate-100 font-sans">
        
        {/* Modal Header */}
        <div className="px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <FileText className="size-5" />
            </div>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Official Resignation Letter ({reqNo})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="h-8 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="size-3.5" />
              <span>PRINT LETTER</span>
            </button>
            <button
              onClick={() => onOpenChange(false)}
              className="size-8 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-white dark:bg-slate-900">
          
          {/* Corporate Header Letterhead */}
          <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                PAKIZA SOFTWARE LIMITED
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                Business Automation (HR)
              </p>
            </div>
            <div className="text-right text-[11px] text-slate-400 dark:text-slate-500 font-medium space-y-0.5">
              <div>
                Ref: <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">{refNo}</span>
              </div>
              <div>
                Submitted: <span className="font-bold text-slate-600 dark:text-slate-400">{submittedDate}</span>
              </div>
            </div>
          </div>

          {/* Metadata Gray Box */}
          <div className="bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/80 pb-3">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Subject: {subject}
              </span>
              <span
                className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                  currentStatus === "Approved" || currentStatus.includes("Cleared")
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                    : currentStatus === "Rejected"
                    ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400"
                    : "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400"
                }`}
              >
                {currentStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block tracking-wider mb-1">
                  NOTICE DATE
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                  {noticeDate}
                </span>
              </div>

              {/* Editable Intended Last Working Day */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    INTENDED LAST WORKING DAY
                  </span>
                  {!isEditingLwd && (
                    <button
                      onClick={() => setIsEditingLwd(true)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-[10px] font-bold flex items-center gap-0.5 cursor-pointer"
                      title="Edit Last Working Day"
                    >
                      <Edit3 className="size-3" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                {isEditingLwd ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={tempLwd}
                      onChange={(e) => setTempLwd(e.target.value)}
                      placeholder="DD/MM/YYYY"
                      className="h-7 px-2 border border-blue-400 rounded bg-white dark:bg-slate-800 text-xs font-bold font-mono text-blue-700 dark:text-blue-300 outline-none w-28"
                    />
                    <button
                      onClick={handleSaveLwd}
                      className="h-7 px-2 rounded bg-blue-600 text-white font-bold text-[10px] flex items-center gap-1 hover:bg-blue-700 cursor-pointer"
                    >
                      <Check className="size-3" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => {
                        setTempLwd(lastWorkingDate);
                        setIsEditingLwd(false);
                      }}
                      className="h-7 px-2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[10px] hover:bg-slate-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <span
                    onClick={() => setIsEditingLwd(true)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 font-extrabold font-mono text-xs cursor-pointer hover:bg-blue-100 transition-colors"
                  >
                    <span>{lastWorkingDate}</span>
                    <Edit3 className="size-3 opacity-60 ml-0.5" />
                  </span>
                )}
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block tracking-wider mb-1">
                  SEPARATION REASON
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {reason}
                </span>
              </div>
            </div>
          </div>

          {/* Letter Body Container */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-sans">
            <div className="space-y-1 font-medium text-slate-800 dark:text-slate-200">
              <p className="font-bold">To</p>
              <p>The HR, Admin and Compliance</p>
              <p>Pakiza Software Ltd.</p>
              <p>Dhanmondi, Dhaka</p>
            </div>

            <p className="font-bold text-slate-900 dark:text-slate-100 pt-1">
              Subject: Resignation from My Position.
            </p>

            <div className="space-y-3 pt-1">
              <p>Dear @Rajebul Hasan Rajon Bhai,</p>
              <p>
                I am writing to formally submit my resignation from my position at Pakiza Software Ltd., effective from{" "}
                <strong className="text-slate-900 dark:text-white font-mono bg-blue-50 dark:bg-blue-950/40 px-1 py-0.5 rounded border border-blue-200 dark:border-blue-900">
                  [{lastWorkingDate}]
                </strong>
                .
              </p>
              <p>
                I am grateful for the opportunities, guidance, and support I have received during my time with the organization. My experience here has helped me develop both professionally and personally, and I sincerely appreciate the cooperation of the management and my colleagues.
              </p>
              <p>
                I will ensure that all my assigned responsibilities and ongoing tasks are properly handed over before my last working day to ensure a smooth transition.
              </p>
              <p>
                I kindly request you to accept my resignation and process the necessary formalities, including my final settlement and release documents.
              </p>
              <p>
                Thank you for your support and cooperation throughout my tenure. I wish Pakiza Software Ltd. continued success and prosperity in the future.
              </p>
            </div>

            <div className="pt-4 space-y-1">
              <p className="font-medium text-slate-600 dark:text-slate-400">Best Regards,</p>
              <p className="font-black text-slate-900 dark:text-slate-100 text-sm">
                {employeeName}
              </p>
              <p className="font-bold text-slate-700 dark:text-slate-300">
                Employee ID:{employeeId}
              </p>
              <p className="text-slate-600 dark:text-slate-400 font-semibold">{designation}</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">
                {department}
              </p>
            </div>
          </div>

          {/* Attachment Box */}
          {attachment && (
            <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/60 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                <Paperclip className="size-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>
                  Attached Signed Copy: <strong className="font-mono text-slate-900 dark:text-slate-100">{attachment}</strong>
                </span>
              </div>
              <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                VERIFIED FILE
              </span>
            </div>
          )}

          {/* Bottom Verification & Signature Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-end text-xs">
            <div>
              <div className="text-slate-400 dark:text-slate-500 text-[10px] font-semibold">
                Submitted By Employee
              </div>
              <div className="font-extrabold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                {employeeName}
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">
                {designation} (ID: {employeeId})
              </div>
            </div>

            <div className="text-right">
              <div className="text-slate-400 dark:text-slate-500 text-[10px] font-semibold">
                HR Department Verification
              </div>
              <div className="font-black text-emerald-600 dark:text-emerald-400 text-xs mt-1 flex items-center gap-1 justify-end">
                <span>✓ Notice Received & Logged</span>
              </div>
            </div>
          </div>

          {/* Approver Directive Input & Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={actionRemark}
                onChange={(e) => setActionRemark(e.target.value)}
                placeholder="Type approver directive or clearance remarks..."
                className="flex-1 h-9 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex justify-between items-center shrink-0">
          <button
            onClick={() => window.print()}
            className="h-8.5 px-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="size-3.5" />
            <span>Print Application</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReject}
              className="h-8.5 px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <XCircle className="size-3.5" />
              <span>Reject Request</span>
            </button>

            <button
              onClick={handleApprove}
              className="h-8.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="size-3.5" />
              <span>Approve Resignation</span>
            </button>

            <button
              onClick={() => onOpenChange(false)}
              className="h-8.5 px-4 bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
