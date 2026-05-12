import type { Lead } from "@/types";
import { apiFetch } from "./api";

function parseLeadsResponse(data: unknown): Lead[] {
  if (Array.isArray(data)) {
    return data as Lead[];
  }
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    const arr = o.leads ?? o.items ?? o.data ?? o.results;
    if (Array.isArray(arr)) {
      return arr as Lead[];
    }
  }
  return [];
}

export async function getLeads(): Promise<Lead[]> {
  const data = await apiFetch<unknown>("/leads");
  return parseLeadsResponse(data);
}

export async function updateLeadStage(id: string, stage: string): Promise<Lead | void> {
  const data = await apiFetch<unknown>(`/leads/${encodeURIComponent(id)}/stage`, {
    method: "PATCH",
    body: JSON.stringify({ stage }),
  });
  if (data && typeof data === "object" && "id" in (data as object)) {
    return data as Lead;
  }
}

export async function logWhatsApp(id: string): Promise<void> {
  await apiFetch<unknown>(`/leads/${encodeURIComponent(id)}/whatsapp`, {
    method: "POST",
  });
}

export async function logCall(id: string): Promise<void> {
  await apiFetch<unknown>(`/leads/${encodeURIComponent(id)}/call-log`, {
    method: "POST",
  });
}
