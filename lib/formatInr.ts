/** Compact display for property cards and metrics (Indian numbering). */
export function formatCompactInr(amount?: number | null): { main: string; unit: string } {
  if (amount == null || Number.isNaN(Number(amount))) {
    return { main: "INR —", unit: "" };
  }
  const n = Number(amount);
  if (n >= 1e7) {
    return { main: `INR ${(n / 1e7).toFixed(2)}`, unit: "Cr" };
  }
  if (n >= 1e5) {
    return { main: `INR ${(n / 1e5).toFixed(2)}`, unit: "Lakhs" };
  }
  return { main: `INR ${Math.round(n).toLocaleString("en-IN")}`, unit: "" };
}

export function formatInrFull(amount?: number | null): string {
  if (amount == null || Number.isNaN(Number(amount))) return "INR —";
  return `INR ${Number(amount).toLocaleString("en-IN")}`;
}

export function formatRelativeListed(createdAt?: string): string {
  if (!createdAt) return "Recently listed";
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return "Recently listed";
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / (86400 * 1000));
  if (days <= 0) return "Listed today";
  if (days === 1) return "Listed 1 day ago";
  if (days < 7) return `Listed ${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "Listed 1 week ago";
  if (weeks < 5) return `Listed ${weeks} weeks ago`;
  return `Listed ${d.toLocaleDateString("en-IN")}`;
}
