import { format } from "date-fns";


export function ensureHttps(url: string): string {
  if (url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }
  return url;
}


export function formatDate(date: string | Date) {
  const d = new Date(date);
  const day = d.getDate();
  const suffix =
    day > 3 && day < 21
      ? "th"
      : ["st", "nd", "rd"][(day % 10) - 1] || "th";

  return format(d, `d'${suffix}' MMM, yyyy`);
}


export function formatWithOrdinal(
  date: Date | string,
): string {
  const d = new Date(date);
  const day = d.getDate();

  const suffix =
    day > 3 && day < 21
      ? "th"
      : ["st", "nd", "rd"][(day % 10) - 1] || "th";

  return format(d, `d'${suffix}' MMMM, yyyy`);
}