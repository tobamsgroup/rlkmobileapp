import { KidCourseWithPopulatedKid } from "@/actions/curriculum";
import { format, formatDistanceToNowStrict } from "date-fns";


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


export function timeAgo(date: Date | string): string {
  if(!date) return ""
  return formatDistanceToNowStrict(new Date(date), {
    addSuffix: true,
  })
    .replace("seconds", "secs")
    .replace("second", "sec")
    .replace("minutes", "mins")
    .replace("minute", "min")
    .replace("hours", "hrs")
    .replace("hour", "hr")
    .replace("days", "days")
    .replace("day", "day");
}


export const formatDateSlash = (isoDate: string): string => {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

type KidProgress = {
  _id: string;
  kidId: { _id: string; name: string; [key: string]: any };
  [key: string]: any;
};

export interface GroupedByKid {
  kid: KidCourseWithPopulatedKid["kidId"];
  courses: KidCourseWithPopulatedKid[];
}

export function groupByKid(
  data: KidCourseWithPopulatedKid[]
): GroupedByKid[] {
  const map: Record<string, GroupedByKid> = {};

  data.forEach((item) => {
    const kidKey = item.kidId._id;

    if (!map[kidKey]) {
      map[kidKey] = {
        kid: item.kidId,
        courses: [],
      };
    }

    map[kidKey].courses.push(item);
  });

  return Object.values(map);
}


export function shuffleArray<T>(array?: T[]): T[] {
  if (!array) return [];
  return array.sort(() => Math.random() - 0.5);
}