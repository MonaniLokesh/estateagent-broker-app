export type Property = {
  id: string;
  title: string;
  description?: string;
  price_inr?: number;
  location?: string;
  bhk?: number;
  possession?: string;
  metadata: {
    type?: string;
    status?: "Active" | "Sold" | "Pending";
    size_sqft?: number;
    images?: string[];
    amenities?: string[];
    owner_name?: string;
    owner_phone?: string;
    commission_rate?: number;
  };
  created_at: string;
  updated_at: string;
};

export type Lead = {
  id: string;
  channel: "whatsapp" | "telegram";
  contact_id: string;
  phone?: string;
  chat_id?: string;
  display_name?: string;
  lead_info: {
    stage?: "New" | "Contacted" | "Viewing" | "Negotiation" | "Closed";
    priority?: "High" | "Medium" | "Low";
    budget?: number;
    property_interest?: string;
    next_action?: string;
    [key: string]: unknown;
  };
  summary?: string;
  human_handoff_requested: boolean;
  created_at: string;
  updated_at: string;
};

export type DashboardSummary = {
  totalListings: number;
  activeListings: number;
  totalLeads: number;
  revenueEstimate: number;
};
