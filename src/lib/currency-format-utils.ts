// src/lib/currency-format-utils.ts
// Configured Amount Format from Currency Setup

import { getStoredData, CurrencyMaster } from "./procurement-master-data";

export type AmountFormatType =
  | "1,00,000"
  | "100,000"
  | "100000"
  | "1,00,000.00"
  | "100,000.00"
  | "1,00,000.000"
  | "100,000.000";

/**
 * Returns the currently active currency format and currency symbol.
 */
export function getActiveCurrencyConfig(): {
  format: AmountFormatType;
  currencyCode: string;
  symbol: string;
} {
  try {
    const currencies = getStoredData<CurrencyMaster[]>("proc_currencies_v2", []);
    // Find active base currency or first active currency
    const active =
      currencies.find((c) => c.status === "Active" && (c.baseCurrency || (c as any).isBaseCurrency || c.currencyCode === "BDT")) ||
      currencies.find((c) => c.status === "Active") ||
      currencies[0];

    const format = (active?.amountFormat as AmountFormatType) || "1,00,000.00";
    const currencyCode = active?.currencyCode || "BDT";
    const symbol = active?.symbol || "৳";

    return { format, currencyCode, symbol };
  } catch {
    return {
      format: "1,00,000.00",
      currencyCode: "BDT",
      symbol: "৳",
    };
  }
}

/**
 * Formats a number with Indian/Bangladesh numbering system (e.g., 12,34,567.89).
 */
function formatSouthAsianNumber(val: number, decimals: number): string {
  const isNegative = val < 0;
  const absVal = Math.abs(val);

  const fixed = absVal.toFixed(decimals);
  const parts = fixed.split(".");
  let intPart = parts[0];
  const decPart = parts.length > 1 ? "." + parts[1] : "";

  if (intPart.length > 3) {
    const lastThree = intPart.substring(intPart.length - 3);
    const otherNumbers = intPart.substring(0, intPart.length - 3);
    const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    intPart = formattedOther + "," + lastThree;
  }

  return (isNegative ? "-" : "") + intPart + decPart;
}

/**
 * Formats a number with International standard numbering system (e.g., 1,234,567.89).
 */
function formatInternationalNumber(val: number, decimals: number): string {
  const isNegative = val < 0;
  const absVal = Math.abs(val);

  const fixed = absVal.toFixed(decimals);
  const parts = fixed.split(".");
  let intPart = parts[0];
  const decPart = parts.length > 1 ? "." + parts[1] : "";

  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return (isNegative ? "-" : "") + intPart + decPart;
}

/**
 * Formats any amount strictly following the configured Amount Format.
 */
export function formatAmount(
  value: number | string | null | undefined,
  formatOverride?: AmountFormatType,
  showCurrencySymbol = false
): string {
  if (value === null || value === undefined || value === "") return "0.00";
  const num = typeof value === "number" ? value : parseFloat(String(value).replace(/,/g, "")) || 0;

  const { format: activeFormat, symbol } = getActiveCurrencyConfig();
  const format = formatOverride || activeFormat;

  let formatted = "";

  switch (format) {
    case "1,00,000":
      formatted = formatSouthAsianNumber(num, 0);
      break;
    case "100,000":
      formatted = formatInternationalNumber(num, 0);
      break;
    case "100000":
      formatted = String(Math.round(num));
      break;
    case "1,00,000.00":
      formatted = formatSouthAsianNumber(num, 2);
      break;
    case "100,000.00":
      formatted = formatInternationalNumber(num, 2);
      break;
    case "1,00,000.000":
      formatted = formatSouthAsianNumber(num, 3);
      break;
    case "100,000.000":
      formatted = formatInternationalNumber(num, 3);
      break;
    default:
      formatted = formatSouthAsianNumber(num, 2);
      break;
  }

  return showCurrencySymbol ? `${symbol} ${formatted}` : formatted;
}
