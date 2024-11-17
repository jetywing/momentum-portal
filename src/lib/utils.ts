import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function minToTimeFormat(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12; // Convert 0 or 12 to 12 for AM/PM
  const formattedMinutes = mins.toString().padStart(2, "0"); // Ensure two-digit minutes
  return `${formattedHours}:${formattedMinutes} ${period}`;
}
