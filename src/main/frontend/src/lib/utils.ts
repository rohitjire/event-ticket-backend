import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const EVENT_GRADIENTS = [
  "from-purple-600/20 to-indigo-600/20",
  "from-blue-600/20 to-cyan-600/20",
  "from-rose-600/20 to-pink-600/20",
  "from-amber-600/20 to-orange-600/20",
  "from-emerald-600/20 to-teal-600/20",
  "from-violet-600/20 to-fuchsia-600/20",
];

const EVENT_ACCENT_COLORS = [
  "text-purple-400",
  "text-blue-400",
  "text-rose-400",
  "text-amber-400",
  "text-emerald-400",
  "text-violet-400",
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function getEventGradient(name: string): string {
  return EVENT_GRADIENTS[hashString(name) % EVENT_GRADIENTS.length];
}

export function getEventAccent(name: string): string {
  return EVENT_ACCENT_COLORS[hashString(name) % EVENT_ACCENT_COLORS.length];
}
