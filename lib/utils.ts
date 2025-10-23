import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatIsoToLocal(iso?: string | Date) {
  if (!iso) return "";
  try {
    const d = typeof iso === "string" ? new Date(iso) : iso;
    if (isNaN(d.getTime())) return String(iso);
    return d.toLocaleString();
  } catch {
    console.error(`Error formatting ISO to local: ${iso}`);
    return String(iso);
  }
}

// Task 4: Logging
export function createRequestLogger(context: string) {
  const requestId = Math.random().toString(36).slice(2, 10);
  const base = { requestId, context, timestamp: new Date().toISOString() } as const;
  return {
    info(msg: string, extra?: Record<string, unknown>) {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify({ level: "info", msg, ...base, ...extra }));
    },
    error(msg: string, extra?: Record<string, unknown>) {
      // eslint-disable-next-line no-console
      console.error(JSON.stringify({ level: "error", msg, ...base, ...extra }));
    },
  };
}

// Time formatting helpers (assume input in minutes)
export function minutesToHoursValue(minutes?: number | null) {
  if (minutes == null) return 0;
  return minutes / 60;
}

export function minutesToHoursLabel(minutes?: number | null) {
  const hours = minutesToHoursValue(minutes);
  return `${hours.toFixed(1)} h`;
}
