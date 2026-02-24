import { KidCourseWithPopulatedKid } from "@/actions/curriculum";
import { format, formatDistanceToNowStrict } from "date-fns";
import * as Application from "expo-application";
import { Platform } from "react-native";


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



export const getDeviceId = async () => {
  if (Platform.OS === "android") {
    return Application.getAndroidId();
  }

  return await Application.getIosIdForVendorAsync();
};


export function maskEmail(email?: string): string {
  if(!email) return ""
  if (!email || !email.includes("@")) return email;

  const [, domain] = email.split("@");
  return `***@${domain}`;
}

export function formatFriendlyDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const isYesterday = (d: Date) => {
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    return isSameDay(d, yesterday);
  };

  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (isSameDay(date, now)) {
    return `Today, ${timeFormatter.format(date)}`;
  } else if (isYesterday(date)) {
    return `Yesterday, ${timeFormatter.format(date)}`;
  } else {
    const dateFormatter = new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
    });
    return `${dateFormatter.format(date)}, ${timeFormatter.format(date)}`;
  }
}