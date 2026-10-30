const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  JPY: "¥",
  CNY: "¥",
  CAD: "CA$",
  AUD: "A$",
  BRL: "R$",
  MXN: "MX$",
  SGD: "S$",
  HKD: "HK$",
  KRW: "₩",
  TRY: "₺",
  RUB: "₽",
  ZAR: "R",
  SAR: "﷼",
  AED: "د.إ",
  THB: "฿",
  IDR: "Rp",
  MYR: "RM",
  PHP: "₱",
  PKR: "₨",
  NGN: "₦",
  EGP: "E£",
  Other: "",
};

export function getCurrencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency] ?? currency + " ";
}

export function formatCurrency(value: number, currency = "USD"): string {
  if (!isFinite(value) || isNaN(value)) return `${getCurrencySymbol(currency)}0.00`;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency === "Other" ? "USD" : currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    const sym = getCurrencySymbol(currency);
    return `${value < 0 ? "-" : ""}${sym}${Math.abs(value).toFixed(2)}`;
  }
}

export function formatPercent(value: number, decimals = 2): string {
  if (!isFinite(value) || isNaN(value)) return "0.00%";
  return `${value.toFixed(decimals)}%`;
}

export function formatROAS(value: number): string {
  if (!isFinite(value) || isNaN(value)) return "0.00x";
  return `${value.toFixed(2)}x`;
}

export function formatNumber(value: number, decimals = 2): string {
  if (!isFinite(value) || isNaN(value)) return "0";
  return value.toLocaleString("en-US", { maximumFractionDigits: decimals });
}

export function formatCompact(value: number, currency = "USD"): string {
  if (!isFinite(value) || isNaN(value)) return `${getCurrencySymbol(currency)}0`;
  const sym = getCurrencySymbol(currency);
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}${sym}${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}${sym}${(abs / 1_000).toFixed(1)}K`;
  return `${sign}${sym}${abs.toFixed(2)}`;
}

export function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function formatShortDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}
