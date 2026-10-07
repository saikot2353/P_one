import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Printer } from "lucide-react";

export const Route = createFileRoute("/payslip-print")({
  validateSearch: (search: Record<string, unknown>): { lang?: "en" | "bn" } => ({
    lang: search.lang === "bn" ? "bn" : "en",
  }),
  component: PayslipPrintPage,
});

interface PayslipField {
  key: string;
  category: "status" | "payment" | "deduction";
  defaultLabelEng: string;
  defaultLabelBng: string;
  customLabelEng: string;
  customLabelBng: string;
  isVisible: boolean;
}

interface PayslipTemplate {
  id: string;
  title: string;
  companyName: string;
  employeeType: string;
  otType?: string;
  isActive: boolean;
  fields: PayslipField[];
}

export function PayslipPrintPage() {
  const { lang = "en" } = Route.useSearch();
  const [employees, setEmployees] = useState<any[]>([]);
  const [templates, setTemplates] = useState<PayslipTemplate[]>([]);

  useEffect(() => {
    // Load print data
    const printData = localStorage.getItem("print_payslip_data");
    if (printData) {
      setEmployees(JSON.parse(printData));
    }

    // Load templates
    const templatesData = localStorage.getItem("payslip_templates_data");
    if (templatesData) {
      setTemplates(JSON.parse(templatesData));
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  // Helper to generate smart mathematical breakdown
  const getMockValues = (totalPayStr: string) => {
    const total = parseInt(totalPayStr.replace(/[^0-9]/g, ""), 10) || 0;
    const basic = Math.round(total * 0.6);
    const houseRent = Math.round(total * 0.3);
    const medical = total - basic - houseRent; // Remaining 10%

    return {
      working_day: "26",
      holiday: "4",
      present: "26",
      cl: "0",
      sl: "0",
      el: "0",
      ml: "0",
      spl: "0",
      absent: "0",
      ot_rate: "0",
      ot_hour: "0",
      
      basic_pay: basic.toLocaleString(),
      house_rent: houseRent.toLocaleString(),
      medical: medical.toLocaleString(),
      food: "0",
      conveyance: "0",
      gross_salary: total.toLocaleString(),
      ot_payment: "0",
      tiffin: "0",
      night_allowance: "0",
      attendance_bonus: "0",
      allowance: "0",
      arrear: "0",
      total_payment: total.toLocaleString(),

      absent_deduction: "0",
      lunch_deduction: "0",
      advance: "0",
      wagely_advance: "0",
      adjust: "0",
      income_tax: "0",
      revenue_stamp: "10",
      total_deduction: "10",
      
      net_payment: (total - 10).toLocaleString()
    };
  };

  // Find the most appropriate template
  const getTemplateForEmployee = (emp: any) => {
    let match = templates.find(t => t.isActive && t.employeeType === emp.empType);
    if (!match && templates.length > 0) {
      match = templates.find(t => t.isActive);
    }
    if (!match) {
      match = {
        id: "default",
        title: "Default",
        companyName: "CRIPTON HRIS",
        employeeType: emp.empType,
        isActive: true,
        fields: []
      };
    }
    return match;
  };

  if (employees.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <h1 className="text-xl font-bold text-red-500 mb-2">No Data Available</h1>
          <p className="text-sm text-gray-600">Please generate a report from the Monthly Salary Details page first.</p>
        </div>
      </div>
    );
  }

  // Chunking employees into groups of 4 for A4 printing (2x2 grid)
  const CHUNK_SIZE = 4;
  const employeeChunks = [];
  for (let i = 0; i < employees.length; i += CHUNK_SIZE) {
    employeeChunks.push(employees.slice(i, i + CHUNK_SIZE));
  }

  const fontClass = lang === "bn" ? "font-bangla" : "font-english";

  return (
    <div className={`min-h-screen bg-gray-200 print:bg-white text-black pb-10 ${fontClass}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        @font-face {
          font-family: 'Kalpurush';
          src: url('https://fonts.maateen.me/kalpurush/font.css');
        }
        .font-english {
          font-family: 'Inter', Arial, sans-serif;
        }
        .font-bangla {
          font-family: 'Kalpurush', Arial, sans-serif;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
      
      {/* Non-printable header */}
      <div className="print:hidden bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50 mb-8">
        <div>
          <h1 className="text-lg font-bold">Print Payslips (4 per A4 Page)</h1>
          <p className="text-xs text-gray-500">{employees.length} employees selected • {lang === 'en' ? 'English' : 'Bengali'} Format</p>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
        >
          <Printer className="w-4 h-4" />
          Print All
        </button>
      </div>

      <div className="flex flex-col items-center print:block">
        {employeeChunks.map((chunk, pageIndex) => (
          <div 
            key={pageIndex}
            className="w-[210mm] min-h-[297mm] print:h-[297mm] bg-white shadow-md print:shadow-none p-4 grid grid-cols-2 grid-rows-2 gap-4 box-border overflow-hidden mb-8 print:mb-0"
            style={{ pageBreakAfter: pageIndex < employeeChunks.length - 1 ? 'always' : 'auto' }}
          >
            {chunk.map((emp, idx) => {
              const tpl = getTemplateForEmployee(emp);
              const mockValues = getMockValues(emp.totalPay);
              
              const paymentFields = tpl.fields?.filter(f => f.category === "payment" && f.isVisible && f.key !== "total_payment") || [];
              const deductionFields = tpl.fields?.filter(f => f.category === "deduction" && f.isVisible && f.key !== "total_deduction") || [];
              const statusFields = tpl.fields?.filter(f => f.category === "status" && f.isVisible) || [];

              const preGrossPayments = paymentFields.slice(0, 5);
              const postGrossPayments = paymentFields.slice(5);

              return (
                <div 
                  key={idx} 
                  className="border border-blue-200/50 rounded-[4px] p-4 relative flex flex-col h-full bg-white text-[9px] leading-[1.2] tracking-tight"
                >
                  {/* Company Header */}
                  <div className="text-center font-bold text-[12px] uppercase tracking-wide">
                    {tpl.companyName || "PAKIZA SOFTWARE LIMITED"}
                  </div>
                  <div className="text-center font-bold mb-3">
                    {lang === "en" ? "Pay Slip For the month of -Jul, 2026" : "পে স্লিপ - জুলাই, ২০২৬"}
                  </div>

                  {/* Emp Info */}
                  <div className="grid grid-cols-2 gap-x-1 gap-y-0.5 mb-3">
                    <div><span className="font-bold">{lang === "en" ? "ID" : "আইডি"}:</span> {emp.empId}</div>
                    <div className="text-right"><span className="font-bold">{lang === "en" ? "JD" : "যোগদানের তারিখ"}:</span> {emp.joinDate}</div>
                    
                    <div className="col-span-2"><span className="font-bold">{lang === "en" ? "Name" : "নাম"}:</span> {emp.name}</div>
                    <div className="col-span-2"><span className="font-bold">{lang === "en" ? "Department" : "বিভাগ"}:</span> {emp.department}</div>
                    <div className="col-span-2"><span className="font-bold">{lang === "en" ? "Designation" : "পদবী"}:</span> {emp.designation}</div>
                    
                    <div className="col-span-2 flex justify-between mt-1">
                      <span><span className="font-bold">{lang === "en" ? "Grade" : "গ্রেড"}:</span> —</span>
                      <span><span className="font-bold">{lang === "en" ? "Unit" : "ইউনিট"}:</span> Main</span>
                      <span><span className="font-bold">{lang === "en" ? "Line" : "লাইন"}:</span> N/A</span>
                    </div>
                  </div>

                  {/* Working Status */}
                  <div className="border-y border-black py-[2px] mb-1 flex justify-between font-bold uppercase">
                    <span>{lang === "en" ? "WORKING STATUS" : "কার্য অবস্থা"}</span>
                    <span>{lang === "en" ? "UNIT" : "ইউনিট"}</span>
                  </div>
                  <div className="space-y-[1px] mb-2">
                    {statusFields.map(f => {
                      const label = lang === "en" ? f.customLabelEng || f.defaultLabelEng : f.customLabelBng || f.defaultLabelBng;
                      return (
                        <div key={f.key} className="flex justify-between pl-3 pr-1">
                          <span className="font-semibold">{label}</span>
                          <span className="font-bold font-mono">{(mockValues as any)[f.key] || "0"}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Payments and Deductions Header */}
                  <div className="border-y border-black py-[2px] mb-1 flex justify-between font-bold uppercase">
                    <span>{lang === "en" ? "PAYMENTS AND DEDUCTIONS" : "প্রদান এবং কর্তনসমূহ"}</span>
                    <span>{lang === "en" ? "AMOUNT (TK.)" : "পরিমাণ (TK.)"}</span>
                  </div>
                  
                  {/* Payments Section 1 */}
                  <div className="space-y-[1px]">
                    {preGrossPayments.map(f => {
                      const label = lang === "en" ? f.customLabelEng || f.defaultLabelEng : f.customLabelBng || f.defaultLabelBng;
                      return (
                        <div key={f.key} className="flex justify-between pl-3 pr-1">
                          <span className="font-semibold">{label}</span>
                          <span className="font-bold font-mono">{(mockValues as any)[f.key] || "0"}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Dashed Separator */}
                  <div className="border-t border-dashed border-gray-400 my-1.5 mx-1"></div>

                  {/* Payments Section 2 */}
                  <div className="space-y-[1px] mb-1.5">
                    {postGrossPayments.map(f => {
                      const label = lang === "en" ? f.customLabelEng || f.defaultLabelEng : f.customLabelBng || f.defaultLabelBng;
                      return (
                        <div key={f.key} className="flex justify-between pl-3 pr-1">
                          <span className="font-semibold">{label}</span>
                          <span className="font-bold font-mono">{(mockValues as any)[f.key] || "0"}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Total Payment */}
                  <div className="border-t-[1.5px] border-black pt-1 mb-2 flex justify-between font-bold uppercase">
                    <span>{lang === "en" ? "TOTAL PAYMENT" : "মোট প্রদান"}</span>
                    <span className="font-mono pr-1">{mockValues.total_payment}</span>
                  </div>

                  {/* Deductions */}
                  <div className="space-y-[1px] mb-2">
                    {deductionFields.map(f => {
                      const label = lang === "en" ? f.customLabelEng || f.defaultLabelEng : f.customLabelBng || f.defaultLabelBng;
                      return (
                        <div key={f.key} className="flex justify-between pl-3 pr-1">
                          <span className="font-semibold">{label}</span>
                          <span className="font-bold font-mono">{(mockValues as any)[f.key] || "0"}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Total Deduction */}
                  <div className="border-y-[1.5px] border-black py-1 mb-2 flex justify-between font-bold uppercase mt-auto">
                    <span>{lang === "en" ? "TOTAL DEDUCTION" : "মোট কর্তন"}</span>
                    <span className="font-mono pr-1">{mockValues.total_deduction}</span>
                  </div>

                  {/* Net Payment */}
                  <div className="border-b-[2px] border-black pb-1 mb-1 flex justify-between font-bold uppercase text-[10px]">
                    <span>{lang === "en" ? "NET PAYMENT" : "নীট পেমেন্ট"}</span>
                    <span className="font-mono pr-1">{mockValues.net_payment}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
