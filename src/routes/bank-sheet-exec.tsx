import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Printer, ArrowLeft } from "lucide-react";
import { mockData } from "./monthly-salary-details";

export const Route = createFileRoute("/bank-sheet-exec")({
  component: BankSheetExecPage,
});

interface BankSheetFilters {
  year: string;
  month: string;
  empType: string[];
}

export function BankSheetExecPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [filters, setFilters] = useState<BankSheetFilters>({
    year: "2026",
    month: "Jul",
    empType: ["Office Executive"],
  });

  useEffect(() => {
    const printData = localStorage.getItem("print_salary_sheet_data");
    const filtersData = localStorage.getItem("print_salary_sheet_filters");

    if (printData) {
      setEmployees(JSON.parse(printData));
    } else {
      // Default to mockData if no print data is in localStorage
      setEmployees(mockData);
    }

    if (filtersData) {
      setFilters(JSON.parse(filtersData));
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const getAccountNo = (empId: string) => {
    const map: Record<string, string> = {
      "2025058109": "171.103.0271428",
      "2026058685": "171.103.0756536",
      "2022035599": "105.105.30780",
      "2024052333": "171.103.0276840",
      "2024052410": "157.105.0001891",
      "2025057067": "171.103.0675015",
      "2021028542": "171.103.0200220",
      "2023044017": "171.103.0257009",
      "2025055045": "171.103.0497618",
      "2023044012": "115.151.141106",
    };
    return map[empId] || `171.103.${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`;
  };

  const getBankNetPay = (empId: string, totalPayStr: string) => {
    const defaultNetPay = parseInt(totalPayStr.replace(/[^0-9]/g, ""), 10) || 0;

    const bankPayMap: Record<string, number> = {
      "2025058109": 49583.00,
      "2026058685": 30000.00,
      "2022035599": 35545.00,
      "2024052333": 38220.00,
      "2024052410": 32760.00,
      "2025057067": 30000.00,
      "2021028542": 28340.00,
      "2023044017": 40132.00,
      "2025055045": 20310.00,
      "2023044012": 45583.00,
    };

    if (empId in bankPayMap) {
      return bankPayMap[empId];
    }

    return Math.round((defaultNetPay * 0.80) / 10) * 10;
  };

  const calculatedRows = employees.map((emp, index) => {
    const bankNetPay = getBankNetPay(emp.empId, emp.totalPay);
    const accountNo = getAccountNo(emp.empId);
    return {
      serialNo: index + 1,
      empId: emp.empId,
      name: emp.name,
      accountNo,
      bankNetPay,
    };
  });

  const grandTotal = calculatedRows.reduce((acc, row) => acc + row.bankNetPay, 0);

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const CHUNK_SIZE = 47;
  const employeeChunks = [];
  for (let i = 0; i < calculatedRows.length; i += CHUNK_SIZE) {
    employeeChunks.push(calculatedRows.slice(i, i + CHUNK_SIZE));
  }

  const currentDate = new Date().toLocaleDateString("en-GB"); // Format: dd/mm/yyyy

  return (
    <div className="min-h-screen bg-neutral-200 print:bg-white text-black p-4 print:p-0 font-serif text-[10px] flex flex-col items-center">
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
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
            height: 297mm !important;
            width: 210mm !important;
            padding: 12mm 15mm !important;
            box-sizing: border-box;
          }
          .print-page:last-child {
            page-break-after: avoid;
          }
        }
        .print-page {
          background-color: white;
          width: 210mm;
          height: 297mm;
          padding: 12mm 15mm;
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
          margin-top: 10px;
        }
        th, td {
          border: 1px solid black;
          padding: 3px 6px;
          text-align: center;
          vertical-align: middle;
          font-size: 8px;
        }
        th {
          font-weight: bold;
        }
        .text-left {
          text-align: left;
        }
        .text-right {
          text-align: right;
        }
        .font-bold {
          font-weight: bold;
        }
      `}</style>

      {/* Screen Toolbar */}
      <div className="no-print bg-white shadow-md border-b px-6 py-4 flex justify-between items-center mb-6 rounded-lg w-full max-w-[210mm] mx-auto font-sans">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div>
            <h1 className="text-base font-bold">Print Bank Sheet (Exec)</h1>
            <p className="text-xs text-neutral-500">
              Portrait Print Preview for {filters.month} {filters.year} ({calculatedRows.length} employees • {employeeChunks.length} pages)
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

      {/* Pages Container */}
      <div className="w-full flex flex-col items-center print:block font-serif">
        {employeeChunks.map((chunk, pageIndex) => (
          <div key={pageIndex} className="print-page">
            <div>
              {/* Header Block */}
              <div className="text-center flex flex-col items-center pb-2 mb-3">
                <h2 className="text-[14px] font-bold text-black">
                  Pakiza Software Limited
                </h2>
                <h3 className="text-[11px] font-bold text-black mt-1">
                  Bank Sheet
                </h3>
                <p className="text-[10px] text-black font-bold mt-1">
                  {filters.month} {filters.year}
                </p>
              </div>

              {/* Main Table */}
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="w-[5%]">SL.</th>
                    <th className="w-[12%] text-left pl-2">ID</th>
                    <th className="w-[38%] text-left pl-2">Name</th>
                    <th className="w-[25%]">Account No</th>
                    <th className="w-[20%] text-right pr-2">NetPay</th>
                  </tr>
                </thead>
                <tbody>
                  {chunk.map((row) => (
                    <tr key={row.serialNo}>
                      <td>{row.serialNo}</td>
                      <td className="text-left pl-2">{row.empId}</td>
                      <td className="text-left pl-2">{row.name}</td>
                      <td>{row.accountNo}</td>
                      <td className="text-right pr-2">{formatNumber(row.bankNetPay)}</td>
                    </tr>
                  ))}
                  
                  {/* Total Row (only on the last page) */}
                  {pageIndex === employeeChunks.length - 1 && (
                    <tr className="font-bold">
                      <td colSpan={4} className="text-right pr-3 font-bold">Total</td>
                      <td className="text-right pr-2 font-bold">{formatNumber(grandTotal)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Row */}
            <div className="flex justify-between items-center text-[10px] font-bold mt-4 font-sans text-black">
              <div>Print Date: &nbsp;&nbsp;&nbsp; {currentDate}</div>
              <div>Page {pageIndex + 1} of {employeeChunks.length}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
