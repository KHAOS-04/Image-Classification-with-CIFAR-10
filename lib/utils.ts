import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 85) return "#10B981";
  if (confidence >= 65) return "#F59E0B";
  return "#EF4444";
}
