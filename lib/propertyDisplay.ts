import type { Property } from "@/types";

export function statusPillFromMetadata(status?: string): { label: string; bg: string } {
  switch (status) {
    case "Active":
      return { label: "Available", bg: "#10b981" };
    case "Pending":
      return { label: "Under Offer", bg: "#fc7c78" };
    case "Sold":
      return { label: "Sold", bg: "#64748b" };
    default:
      return { label: "Listing", bg: "#94a3b8" };
  }
}

export function filterLabelToApiStatus(label: string): string | undefined {
  if (label === "All") return undefined;
  if (label === "Available") return "Active";
  if (label === "Under Offer") return "Pending";
  if (label === "Sold") return "Sold";
  return undefined;
}

export function parseBhkFromTypeLabel(typeLabel: string): number | undefined {
  const m = typeLabel.match(/(\d+)\s*BHK/i);
  if (!m) return undefined;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : undefined;
}

export function uiStatusToMetadataStatus(
  ui: string,
): "Active" | "Sold" | "Pending" | undefined {
  if (ui === "Available") return "Active";
  if (ui === "Sold Out") return "Sold";
  if (ui === "Under Construction" || ui === "Coming Soon") return "Pending";
  return "Active";
}

export function metadataStatusToUi(status?: string): string {
  if (status === "Sold") return "Sold Out";
  if (status === "Pending") return "Under Construction";
  return "Available";
}

export function propertySpecs(p: Property): string[] {
  const parts: string[] = [];
  if (p.bhk != null) parts.push(`${p.bhk} BHK`);
  if (p.metadata?.size_sqft != null) {
    parts.push(`${Number(p.metadata.size_sqft).toLocaleString("en-IN")} sqft`);
  }
  if (p.metadata?.type) parts.push(p.metadata.type);
  return parts.slice(0, 3);
}
