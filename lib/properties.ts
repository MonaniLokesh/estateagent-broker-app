import type { Property } from "@/types";
import { Platform } from "react-native";
import { apiFetch } from "./api";

export type PropertyPayload = {
  title: string;
  description?: string;
  price_inr?: number;
  location?: string;
  bhk?: number;
  possession?: string;
  metadata?: {
    type?: string;
    status?: "Active" | "Sold" | "Pending";
    size_sqft?: number;
    images?: string[];
    amenities?: string[];
    owner_name?: string;
    owner_phone?: string;
    commission_rate?: number;
  };
};

export type ImageFile = {
  uri: string;
  name: string;
  type: string;
};

function parseListResponse(data: unknown): Property[] {
  if (Array.isArray(data)) {
    return data as Property[];
  }
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    const arr = o.properties ?? o.items ?? o.data ?? o.results;
    if (Array.isArray(arr)) {
      return arr as Property[];
    }
  }
  return [];
}

export async function getProperties(filters?: {
  status?: string;
  bhk?: number;
  search?: string;
}): Promise<Property[]> {
  const q = new URLSearchParams();
  if (filters?.status) q.set("status", filters.status);
  if (filters?.bhk != null) q.set("bhk", String(filters.bhk));
  if (filters?.search) q.set("search", filters.search);
  const qs = q.toString();
  const path = qs ? `/properties?${qs}` : "/properties";
  const data = await apiFetch<unknown>(path);
  return parseListResponse(data);
}

export async function getPropertyById(id: string): Promise<Property> {
  return apiFetch<Property>(`/properties/${encodeURIComponent(id)}`);
}

export async function createProperty(data: PropertyPayload): Promise<Property> {
  return apiFetch<Property>("/properties", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProperty(id: string, data: PropertyPayload): Promise<Property> {
  return apiFetch<Property>(`/properties/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProperty(id: string): Promise<void> {
  await apiFetch<unknown>(`/properties/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function uploadPropertyImages(files: ImageFile[]): Promise<string[]> {
  const form = new FormData();
  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    const name = file.name || `upload_${index}.jpg`;
    const type = file.type || "image/jpeg";
    if (Platform.OS === "web") {
      const blobRes = await fetch(file.uri);
      const blob = await blobRes.blob();
      form.append("files", blob.slice(0, blob.size, type), name);
    } else {
      form.append("files", {
        uri: file.uri,
        name,
        type,
      } as unknown as Blob);
    }
  }

  const data = await apiFetch<string[] | { urls?: string[]; images?: string[] }>("/properties/images/upload", {
    method: "POST",
    body: form,
  });
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    if (Array.isArray(data.urls)) return data.urls;
    if (Array.isArray(data.images)) return data.images;
  }
  return [];
}
