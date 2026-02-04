import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility to decode Unicode escapes like \ud83d\udc4d
export function decodeUnicode(str: string) {
  try {
    return str.replace(/\\u[\dA-F]{4}/gi, (match) =>
      String.fromCharCode(parseInt(match.replace("\\u", ""), 16)),
    );
  } catch {
    return str;
  }
}
