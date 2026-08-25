import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Printer, ArrowLeft } from "lucide-react";
import { mockData } from "./monthly-salary-details";

export const Route = createFileRoute("/ot-sheet-holiday")({
  component: OTSheetHolidayPage,
});

interface OTSheetFilters {
  year: string;
  month: string;
  empType: string[];
  department: string;
  unit: string;
  line: string;
}

export function OTSheetHolidayPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [filters, setFilters] = useState<OTSheetFilters>({
    year: "2026",
    month: "Jul",
    empType: ["Office Executive"],
    department: "All Departments",
    unit: "ALL",
    line: "ALL",
  });

  useEffect(() => {
    const printData = localStorage.getItem("print_salary_sheet_data");
    const filtersData = localStorage.getItem("print_salary_sheet_filters");

    if (printData) {
      setEmployees(JSON.parse(printData));
    } else {
      setEmployees(mockData);
    }

    if (filtersData) {
      setFilters(JSON.parse(filtersData));
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const getValues = (totalPayStr: string, empId: string) => {
    const totalPay = parseInt(totalPayStr.replace(/[^0-9]/g, ""), 10) || 0;
    
    const gross = Math.round((totalPay * 1.12) / 500) * 500 || 30000;
    const basic = Math.round(gross * 0.60);
    const houseRent = Math.round(gross * 0.30);
    const medical = Math.round(gross * 0.06);
    const conveyance = gross - basic - houseRent - medical;
    const food = 0;
    
    // Medical + Food + Conveyance
    const mfc = medical + food + conveyance;

    const totalDay = 31;
    const present = 25;
    const cl = 1;
    const sl = 0;
    const el = 0;
    const ml = 0;
    const absent = 0;

    const otHour = empId === "2023045146" ? 34.00 : empId === "2021023079" ? 67.00 : 0;
    const otRate = Math.round((basic / 208) * 1.5 * 100) / 100;
    const otPay = otHour > 0 ? otHour * otRate : 0;

    const tiffin = 0;
    const night = empId === "2021023079" ? 200 : 0;

    const netPay = otPay + tiffin + night; // Or actual net pay computation for holiday

    return {
      basic,
      houseRent,
      mfc,
      gross,
      totalDay,
      present,
      cl,
      sl,
      el,
      ml,
      absent,
      otHour,
      otRate,
      otPay,
      tiffin,
      night,
      netPay
    };
  };

  const calculatedRows = employees.map((emp, index) => {
    const vals = getValues(emp.totalPay, emp.empId);
    return {
      serialNo: index + 1,
      empId: emp.empId,
      name: emp.name,
      designation: emp.designation,
      grade: emp.grade || "None",
      joinDate: emp.joinDate,
      ...vals
    };
  });

  const totals = calculatedRows.reduce(
    (acc, row) => {
      acc.basic += row.basic;
      acc.houseRent += row.houseRent;
      acc.mfc += row.mfc;
      acc.gross += row.gross;
      acc.otHour += row.otHour;
      acc.otPay += row.otPay;
      acc.tiffin += row.tiffin;
      acc.night += row.night;
      acc.netPay += row.netPay;
      return acc;
    },
    {
      basic: 0,
      houseRent: 0,
      mfc: 0,
      gross: 0,
      otHour: 0,
      otPay: 0,
      tiffin: 0,
      night: 0,
      netPay: 0
    }
  );

  const formatNumber = (num: number) => {
    if (num === 0) return "";
    return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  
  const formatInt = (num: number) => {
    return num === 0 ? "" : num.toLocaleString("en-US");
  };

  const CHUNK_SIZE = 10;
  const employeeChunks: any[] = [];
  for (let i = 0; i < calculatedRows.length; i += CHUNK_SIZE) {
    const chunkRows = calculatedRows.slice(i, i + CHUNK_SIZE);
    const firstRow = chunkRows[0];
    const empData = employees.find(e => e.empId === firstRow.empId);
    const empType = empData?.empType || filters.empType[0] || "Office Executive";
    const section = empData?.section || filters.department;
    
    employeeChunks.push({
      empType,
      section,
      rows: chunkRows
    });
  }

  return (
    <div className="min-h-screen bg-neutral-200 print:bg-white text-black p-4 print:p-0 font-sans text-[9px] flex flex-col items-center">
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          body {
            background-color: white;
            color: black;
          }
          .no-print {
            display: none !important;
          }
          .print-page {
            margin: 0 !important;
            box-shadow: none !important;
            page-break-after: always;
            height: 210mm !important;
            width: 297mm !important;
            padding: 10mm !important;
            box-sizing: border-box;
          }
          .print-page:last-child {
            page-break-after: avoid;
          }
        }
        .print-page {
          background-color: white;
          width: 297mm;
          height: 210mm;
          padding: 10mm;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          margin-bottom: 24px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        table {
          border-collapse: collapse;
          width: 100%;
        }
        th, td {
          border: 1px solid #000;
          padding: 2px 4px;
          text-align: center;
          vertical-align: middle;
          line-height: 1.2;
        }
        th {
          font-weight: bold;
          font-size: 8px;
        }
        .rotated-th {
          height: 80px !important;
          vertical-align: bottom !important;
          padding-bottom: 5px !important;
        }
        .header-rotated {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          white-space: nowrap;
          display: inline-block;
          font-size: 8px;
          font-weight: bold;
          line-height: 1;
        }
      `}</style>

      <div className="no-print bg-white shadow-md border-b px-6 py-4 flex justify-between items-center mb-6 rounded-lg w-full max-w-[297mm] mx-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div>
            <h1 className="text-base font-bold">Print OT Sheet (Holiday)</h1>
            <p className="text-xs text-neutral-500">
              Landscape Print Preview for {filters.month}, {filters.year}
            </p>
          </div>
        </div>
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
        >
          <Printer className="size-4" />
          PRINT REPORT
        </button>
      </div>

      <div className="w-full flex flex-col items-center print:block">
        {employeeChunks.map((chunk, pageIndex) => (
          <div key={pageIndex} className="print-page">
            <div>
              <div className="grid grid-cols-4 font-bold text-[9px] mb-1">
                <div>Employee Type : <span className="font-normal">{chunk.empType}</span></div>
                <div className="text-center">Department : <span className="font-normal">{chunk.section}</span></div>
                <div className="text-center">Unit : <span className="font-normal">{filters.unit}</span></div>
                <div className="text-right">Line : <span className="font-normal">{filters.line}</span></div>
              </div>

              <table className="w-full">
                <thead>
                  <tr>
                    <th rowSpan={2} className="w-[3%]">SL</th>
                    <th rowSpan={2} className="w-[20%] text-left">ID & Name</th>
                    <th colSpan={4} className="w-[20%]">Salary Breakdown</th>
                    <th colSpan={7} className="w-[14%]">Attendance</th>
                    <th colSpan={3} className="w-[12%]">Overtime</th>
                    <th colSpan={2} className="w-[8%]">Allowance</th>
                    <th rowSpan={2} className="rotated-th w-[8%]"><div className="header-rotated">Net Pay</div></th>
                    <th rowSpan={2} className="rotated-th w-[15%]"><div className="header-rotated">Signature</div></th>
                  </tr>
                  <tr>
                    <th className="rotated-th"><div className="header-rotated">Basic</div></th>
                    <th className="rotated-th"><div className="header-rotated">House Rent</div></th>
                    <th className="rotated-th"><div className="header-rotated">Medical+<br/>Food+<br/>Conveyance</div></th>
                    <th className="rotated-th"><div className="header-rotated">Gross</div></th>
                    
                    <th className="rotated-th"><div className="header-rotated">Total Day</div></th>
                    <th className="rotated-th"><div className="header-rotated">Present</div></th>
                    <th className="rotated-th"><div className="header-rotated">CL</div></th>
                    <th className="rotated-th"><div className="header-rotated">SL</div></th>
                    <th className="rotated-th"><div className="header-rotated">EL</div></th>
                    <th className="rotated-th"><div className="header-rotated">ML</div></th>
                    <th className="rotated-th"><div className="header-rotated">Absent</div></th>
                    
                    <th className="rotated-th"><div className="header-rotated">OTHour</div></th>
                    <th className="rotated-th"><div className="header-rotated">OT Rate</div></th>
                    <th className="rotated-th"><div className="header-rotated">OT Pay</div></th>
                    
                    <th className="rotated-th"><div className="header-rotated">Tiffin</div></th>
                    <th className="rotated-th"><div className="header-rotated">Night</div></th>
                  </tr>
                </thead>
                <tbody>
                  {chunk.rows.map((row: any) => (
                    <tr key={row.serialNo}>
                      <td>{row.serialNo}</td>
                      <td className="text-left font-sans p-1">
                        <div className="font-bold text-black">{row.empId} &nbsp; {row.name}</div>
                        <div className="mt-4 text-neutral-600 text-[7px] flex justify-between">
                          <span>Grade: {row.grade}</span>
                          <span>JD: {row.joinDate}</span>
                        </div>
                      </td>
                      
                      <td>{formatNumber(row.basic)}</td>
                      <td>{formatNumber(row.houseRent)}</td>
                      <td>{formatNumber(row.mfc)}</td>
                      <td>{formatNumber(row.gross)}</td>

                      <td>{row.totalDay}</td>
                      <td>{row.present}</td>
                      <td>{formatInt(row.cl)}</td>
                      <td>{formatInt(row.sl)}</td>
                      <td>{formatInt(row.el)}</td>
                      <td>{formatInt(row.ml)}</td>
                      <td>{formatInt(row.absent)}</td>

                      <td>{row.otHour ? row.otHour.toFixed(2) : ""}</td>
                      <td>{row.otRate ? row.otRate.toFixed(2) : ""}</td>
                      <td>{formatNumber(row.otPay)}</td>

                      <td>{formatInt(row.tiffin)}</td>
                      <td>{formatInt(row.night)}</td>
                      
                      <td className="font-bold">{formatNumber(row.netPay)}</td>
                      <td className="h-14"></td>
                    </tr>
                  ))}
                  
                  {/* Empty rows if chunk is less than CHUNK_SIZE */}
                  {chunk.rows.length < CHUNK_SIZE && (
                    Array.from({ length: CHUNK_SIZE - chunk.rows.length }).map((_, i) => (
                      <tr key={`empty-${i}`} className="text-transparent h-14">
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                      </tr>
                    ))
                  )}
                  
                  {pageIndex === employeeChunks.length - 1 && (
                    <tr className="font-bold bg-neutral-50 text-[9px] h-8">
                      <td colSpan={2} className="text-left font-bold pl-2">Total Amount In Taka :</td>
                      <td>{formatNumber(totals.basic)}</td>
                      <td>{formatNumber(totals.houseRent)}</td>
                      <td>{formatNumber(totals.mfc)}</td>
                      <td>{formatNumber(totals.gross)}</td>
                      <td colSpan={7}></td>
                      <td>{totals.otHour ? totals.otHour.toFixed(2) : ""}</td>
                      <td></td>
                      <td>{formatNumber(totals.otPay)}</td>
                      <td>{formatInt(totals.tiffin)}</td>
                      <td>{formatInt(totals.night)}</td>
                      <td>{formatNumber(totals.netPay)}</td>
                      <td></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-end text-[8px] font-sans pb-4">
              <div className="w-[15%] text-center">
                <div className="border-t border-black pt-1">Prepared By</div>
              </div>
              <div className="w-[15%] text-center">
                <div className="border-t border-black pt-1">Checked By</div>
              </div>
              <div className="w-[15%] text-center">
                <div className="border-t border-black pt-1">Checked By ( VAT & TAX )</div>
              </div>
              <div className="w-[15%] text-center">
                <div className="border-t border-black pt-1">Checked By ( Audit )</div>
              </div>
              <div className="w-[15%] text-center">
                <div className="border-t border-black pt-1">Approved By (Plant Head)</div>
              </div>
              <div className="w-[15%] text-center">
                <div className="border-t border-black pt-1">Authorized By ( Accounts)</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
