export type Metrics = { total: number; used: number; rate: number };

// Compute follow-through rate with guards.
export function computeRate(total: number, used: number): Metrics {
  const safeTotal = Math.max(0, total);
  const safeUsed = Math.max(0, Math.min(used, safeTotal));
  const rate = safeTotal === 0 ? 0 : safeUsed / safeTotal;
  return { total: safeTotal, used: safeUsed, rate };
}
