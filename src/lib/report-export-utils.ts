// src/lib/report-export-utils.ts
// Standardized client-side exports (CSV, Excel) for all Procurement & Inventory Reports

/**
 * Downloads data as a standard UTF-8 BOM CSV file.
 */
export function exportToCSV(
  filename: string,
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][]
) {
  const sanitizeCell = (val: any): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerLine = headers.map(sanitizeCell).join(",");
  const rowLines = rows.map((row) => row.map(sanitizeCell).join(","));
  const csvContent = [headerLine, ...rowLines].join("\r\n");

  const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads data as an Excel compatible XML/HTML spreadsheet (.xls).
 */
export function exportToExcel(
  filename: string,
  reportTitle: string,
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][],
  subtotals?: { label: string; value: string | number }[]
) {
  const sanitizeHtml = (val: any): string => {
    if (val === null || val === undefined) return "";
    return String(val)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };

  const tableHeaders = headers.map((h) => `<th style="background-color: #1e293b; color: #ffffff; font-weight: bold; padding: 8px 12px; border: 1px solid #cbd5e1; text-align: left;">${sanitizeHtml(h)}</th>`).join("");

  const tableRows = rows
    .map(
      (row, idx) =>
        `<tr style="background-color: ${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">` +
        row
          .map(
            (c) =>
              `<td style="padding: 6px 10px; border: 1px solid #e2e8f0; font-size: 11px; text-align: ${typeof c === "number" ? "right" : "left"};">${sanitizeHtml(c)}</td>`
          )
          .join("") +
        "</tr>"
    )
    .join("");

  let subtotalHtml = "";
  if (subtotals && subtotals.length > 0) {
    subtotalHtml = subtotals
      .map(
        (s) =>
          `<tr style="background-color: #e2e8f0; font-weight: bold;">
            <td colspan="${Math.max(1, headers.length - 1)}" style="padding: 8px 12px; text-align: right; border: 1px solid #cbd5e1;">${sanitizeHtml(s.label)}:</td>
            <td style="padding: 8px 12px; text-align: right; border: 1px solid #cbd5e1;">${sanitizeHtml(s.value)}</td>
          </tr>`
      )
      .join("");
  }

  const excelContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>${sanitizeHtml(reportTitle.slice(0, 31))}</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; }
      </style>
    </head>
    <body>
      <h2 style="font-family: sans-serif; color: #0f172a; margin-bottom: 4px;">${sanitizeHtml(reportTitle)}</h2>
      <p style="font-size: 11px; color: #64748b; margin-top: 0; margin-bottom: 16px;">Generated on: ${new Date().toLocaleString()}</p>
      <table border="1" style="border-collapse: collapse; font-family: sans-serif; width: 100%;">
        <thead>
          <tr>${tableHeaders}</tr>
        </thead>
        <tbody>
          ${tableRows}
          ${subtotalHtml}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([excelContent], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".xls") ? filename : `${filename}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
