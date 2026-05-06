import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Linking, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { getLeads, logCall, logWhatsApp, updateLeadStage } from "@/lib/leads";
import { formatInrFull } from "@/lib/formatInr";
import type { Lead } from "@/types";
import { ApiError } from "@/lib/api";

const STAGES = ["New", "Contacted", "Viewing", "Negotiation", "Closed"] as const;

function leadName(l: Lead) {
  return l.display_name?.trim() || l.phone?.trim() || l.contact_id || "Unknown lead";
}

function digitsOnly(phone?: string) {
  return (phone ?? "").replace(/\D/g, "");
}

function priorityClasses(p?: string) {
  if (p === "High") return "bg-tertiary-container text-on-tertiary-container";
  if (p === "Medium") return "bg-secondary-container text-on-secondary-container";
  if (p === "Low") return "bg-surface-container-highest text-on-surface";
  return "bg-surface-container-highest text-on-surface";
}

export default function LeadsScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [stagePickerLead, setStagePickerLead] = useState<Lead | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await getLeads();
      setLeads(rows);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Could not load leads";
      setError(msg);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const leadStats = useMemo(() => {
    const newCount = leads.filter((l) => (l.lead_info?.stage ?? "New") === "New").length;
    const visits = leads.filter((l) => l.lead_info?.stage === "Viewing").length;
    const nego = leads.filter((l) => l.lead_info?.stage === "Negotiation").length;
    return [
      { label: "New Enquiries", value: String(newCount) },
      { label: "Site Visits", value: String(visits) },
      { label: "Negotiations", value: String(nego) },
    ];
  }, [leads]);

  const applyStage = (lead: Lead, stage: (typeof STAGES)[number]) => {
    const prev = leads;
    setLeads((rows) =>
      rows.map((r) =>
        r.id === lead.id ? { ...r, lead_info: { ...r.lead_info, stage } } satisfies Lead : r,
      ),
    );
    setStagePickerLead(null);
    void (async () => {
      try {
        await updateLeadStage(lead.id, stage);
      } catch (e) {
        setLeads(prev);
        const msg = e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Update failed";
        Alert.alert("Stage update failed", msg);
      }
    })();
  };

  const onWhatsApp = (lead: Lead) => {
    const d = digitsOnly(lead.phone);
    if (!d) {
      Alert.alert("No phone", "This lead has no phone number on file.");
      return;
    }
    void (async () => {
      try {
        await logWhatsApp(lead.id);
      } catch (e) {
        const msg = e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Log failed";
        Alert.alert("WhatsApp log failed", msg);
        return;
      }
      await Linking.openURL(`whatsapp://send?phone=${d}`);
    })();
  };

  const onCall = (lead: Lead) => {
    const d = digitsOnly(lead.phone);
    if (!d) {
      Alert.alert("No phone", "This lead has no phone number on file.");
      return;
    }
    void (async () => {
      try {
        await logCall(lead.id);
      } catch (e) {
        const msg = e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Log failed";
        Alert.alert("Call log failed", msg);
        return;
      }
      void Linking.openURL(`tel:${d}`);
    })();
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-6 pt-4">
          <View className="mb-6 flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-black tracking-tight text-on-surface">Lead Pipeline</Text>
              <Text className="mt-1 text-sm text-outline">Track conversations and close deals faster.</Text>
            </View>
            <Pressable className="h-11 w-11 items-center justify-center rounded-full bg-surface-container-low">
              <MaterialIcons name="add" size={24} color="#006c49" />
            </Pressable>
          </View>

          {error ? (
            <View className="mb-4 rounded-xl bg-error-container px-4 py-3">
              <Text className="text-sm text-on-error-container">{error}</Text>
            </View>
          ) : null}

          <View className="mb-8 flex-row gap-3">
            {loading
              ? [0, 1, 2].map((k) => (
                  <View key={k} className="flex-1 rounded-xl bg-surface-container-lowest p-4 opacity-60">
                    <View className="h-3 w-16 rounded bg-surface-container-high" />
                    <View className="mt-3 h-7 w-10 rounded bg-surface-container-high" />
                  </View>
                ))
              : leadStats.map((item) => (
                  <View key={item.label} className="flex-1 rounded-xl bg-surface-container-lowest p-4">
                    <Text className="text-[10px] font-black uppercase tracking-[1.2px] text-outline">{item.label}</Text>
                    <Text className="mt-1 text-3xl font-black text-on-surface">{item.value}</Text>
                  </View>
                ))}
          </View>

          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-on-surface">Priority Leads</Text>
            <Pressable onPress={() => void load()}>
              <Text className="text-xs font-black uppercase tracking-[1.5px] text-primary">Refresh</Text>
            </Pressable>
          </View>

          <View className="gap-4">
            {loading
              ? [0, 1, 2].map((k) => (
                  <View key={k} className="rounded-xl bg-surface-container-lowest p-5 opacity-60">
                    <View className="mb-3 h-5 w-40 rounded bg-surface-container-high" />
                    <View className="mb-4 h-4 w-56 rounded bg-surface-container-high" />
                    <View className="mb-4 h-14 w-full rounded-lg bg-surface-container-high" />
                    <View className="h-10 w-full rounded bg-surface-container-high" />
                  </View>
                ))
              : leads.map((lead) => {
                  const stage = lead.lead_info?.stage ?? "New";
                  const priority = lead.lead_info?.priority;
                  const expanded = expandedId === lead.id;
                  return (
                    <View key={lead.id} className="rounded-xl bg-surface-container-lowest p-5">
                      {lead.human_handoff_requested ? (
                        <View className="mb-3 rounded-lg bg-error-container px-3 py-2">
                          <Text className="text-center text-[11px] font-black uppercase tracking-[1.2px] text-on-error-container">
                            Human handoff requested
                          </Text>
                        </View>
                      ) : null}

                      <View className="mb-3 flex-row items-start justify-between gap-2">
                        <View className="flex-1">
                          <View className="mb-1 flex-row flex-wrap items-center gap-2">
                            <Text className="text-lg font-bold text-on-surface">{leadName(lead)}</Text>
                            <View
                              className="rounded-full px-2 py-0.5"
                              style={{
                                backgroundColor: lead.channel === "whatsapp" ? "#25D366" : "#229ED9",
                              }}
                            >
                              <Text className="text-[9px] font-black uppercase tracking-[1px] text-white">{lead.channel}</Text>
                            </View>
                            {priority ? (
                              <View className={`rounded-full px-2 py-0.5 ${priorityClasses(priority)}`}>
                                <Text className="text-[9px] font-black uppercase tracking-[1px]">{priority}</Text>
                              </View>
                            ) : null}
                          </View>
                          <Text className="text-sm text-on-surface-variant">{lead.lead_info?.property_interest ?? "—"}</Text>
                        </View>
                        <Pressable onPress={() => setStagePickerLead(lead)}>
                          <View className="rounded-full bg-secondary-container px-3 py-1">
                            <Text className="text-[10px] font-black tracking-[1.2px] text-on-secondary-container">{stage}</Text>
                          </View>
                        </Pressable>
                      </View>

                      <View className="mb-4 rounded-lg bg-surface-container-low p-3">
                        <Text className="text-[10px] font-black uppercase tracking-[1.2px] text-outline">Budget</Text>
                        <Text className="mt-1 text-base font-bold text-on-surface">
                          {formatInrFull(
                            lead.lead_info?.budget != null && !Number.isNaN(Number(lead.lead_info.budget))
                              ? Number(lead.lead_info.budget)
                              : undefined,
                          )}
                        </Text>
                      </View>

                      {lead.summary ? (
                        <Pressable className="mb-3" onPress={() => setExpandedId(expanded ? null : lead.id)}>
                          <Text className="text-[10px] font-black uppercase tracking-[1.2px] text-outline">Summary</Text>
                          <Text className="mt-1 text-sm text-on-surface-variant" numberOfLines={expanded ? undefined : 3}>
                            {lead.summary}
                          </Text>
                          <Text className="mt-1 text-[10px] font-bold uppercase tracking-[1px] text-primary">
                            {expanded ? "Show less" : "Show more"}
                          </Text>
                        </Pressable>
                      ) : null}

                      <View className="mb-4 flex-row items-start gap-2">
                        <MaterialIcons name="event" size={16} color="#6c7a71" />
                        <Text className="flex-1 text-sm text-on-surface-variant">{lead.lead_info?.next_action ?? "—"}</Text>
                      </View>

                      <View className="flex-row gap-2">
                        <Pressable className="flex-1 items-center rounded-xl bg-surface-container-high py-3" onPress={() => onCall(lead)}>
                          <Text className="text-xs font-black uppercase tracking-[1.2px] text-primary">Call</Text>
                        </Pressable>
                        <Pressable className="flex-1 items-center rounded-xl bg-primary py-3" onPress={() => onWhatsApp(lead)}>
                          <Text className="text-xs font-black uppercase tracking-[1.2px] text-white">WhatsApp</Text>
                        </Pressable>
                      </View>
                    </View>
                  );
                })}
            {!loading && leads.length === 0 && !error ? (
              <View className="items-center rounded-xl bg-surface-container-low px-4 py-10">
                <MaterialIcons name="groups" size={28} color="#6c7a71" />
                <Text className="mt-2 text-sm font-semibold text-on-surface">No leads yet</Text>
                <Text className="mt-1 text-center text-xs text-outline">New enquiries will appear here.</Text>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
      <Modal visible={stagePickerLead != null} transparent animationType="fade" onRequestClose={() => setStagePickerLead(null)}>
        <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setStagePickerLead(null)}>
          <Pressable className="rounded-t-3xl bg-surface-container-lowest px-4 pb-10 pt-4" onPress={(e) => e.stopPropagation()}>
            <Text className="mb-3 text-center text-sm font-black text-on-surface">
              {stagePickerLead ? `Stage · ${leadName(stagePickerLead)}` : "Stage"}
            </Text>
            {STAGES.map((stage) => (
              <Pressable
                key={stage}
                className="mb-2 rounded-xl bg-surface-container-low px-4 py-3"
                onPress={() => {
                  if (stagePickerLead) applyStage(stagePickerLead, stage);
                }}
              >
                <Text className="text-center text-sm font-bold text-on-surface">{stage}</Text>
              </Pressable>
            ))}
            <Pressable className="mt-2 rounded-xl bg-surface-container-highest px-4 py-3" onPress={() => setStagePickerLead(null)}>
              <Text className="text-center text-sm font-bold text-on-surface">Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
