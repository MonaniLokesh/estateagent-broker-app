import { useCallback, useEffect, useMemo, useState } from "react";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { getProperties } from "@/lib/properties";
import { formatCompactInr } from "@/lib/formatInr";
import { filterLabelToApiStatus, propertySpecs, statusPillFromMetadata } from "@/lib/propertyDisplay";
import type { Property } from "@/types";
import { ApiError } from "@/lib/api";
import { useAddPropertyOverlay } from "@/lib/addPropertyOverlay";

const filters = ["All", "Available", "Under Offer", "Sold"];

export default function PropertiesScreen() {
  const { openOverlay } = useAddPropertyOverlay();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [list, setList] = useState<Property[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const apiStatus = useMemo(() => filterLabelToApiStatus(selectedFilter), [selectedFilter]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await getProperties({
        status: apiStatus,
        search: debouncedSearch || undefined,
      });
      setList(rows);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Could not load properties";
      setError(msg);
      setList([]);
    } finally {
      setLoading(false);
    }
  }, [apiStatus, debouncedSearch]);

  useEffect(() => {
    void load();
  }, [load]);

  const activeCountLabel = useMemo(() => {
    const n = list.filter((p) => p.metadata?.status === "Active").length;
    if (list.length === 0) return "your portfolio";
    return `${n} active in view`;
  }, [list]);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-6 pt-4">
          <View className="mb-6 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuANBfIxSbNbpd-08_uc7xyjA_aXF2WtsWLf1EBkc6TzNE1bx2fAIJuFQaqA4y3alSkiiaWoV6vfGO2fyANvT9iUEv2TI0hIG33wIqcJpJPehCBSQf3SzvOOzCH_dPaO42aThe6Z_NzqVsD_MRJKciM7p5siPhpvJp5YHZeCuwQfq9W0Bi0yzZ7Nd2qhY8HUpssx6-8akarNaMsyfijgQLoTwmxlQoBu4XX-uQt19OUiiQ8Rx9yXieCtTpqajrE-xRskyXAcq09bLGC2",
                }}
                className="h-10 w-10 rounded-full"
              />
              <Text className="text-2xl font-black tracking-tight text-[#10B981]">Verdant Ledger</Text>
            </View>
            <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-surface-container-low">
              <MaterialIcons name="notifications-none" size={21} color="#64748b" />
            </Pressable>
          </View>

          <View className="mb-5">
            <Text className="text-3xl font-black tracking-tight text-on-surface">Property Inventory</Text>
            <Text className="mt-1 text-sm text-on-surface-variant">Manage {activeCountLabel}</Text>
          </View>

          {error ? (
            <View className="mb-4 rounded-xl bg-error-container px-4 py-3">
              <Text className="text-sm text-on-error-container">{error}</Text>
            </View>
          ) : null}

          <View className="relative mb-4 rounded-xl bg-surface-container-low px-4 py-4">
            <View className="absolute left-4 top-4">
              <MaterialIcons name="search" size={20} color="#6c7a71" />
            </View>
            <TextInput
              placeholder="Search by area or project name..."
              placeholderTextColor="#8d9f95"
              className="pl-8 text-sm text-on-surface"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 8, paddingBottom: 8 }}>
          {filters.map((filter) => (
            <Pressable
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              className={`rounded-full px-6 py-2 ${selectedFilter === filter ? "bg-primary-container" : "bg-surface-container-highest"}`}
            >
              <Text className={`text-sm font-bold ${selectedFilter === filter ? "text-on-primary-container" : "text-on-surface-variant"}`}>
                {filter}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View className="gap-6 px-6 pt-4">
          {loading
            ? [0, 1, 2].map((k) => (
                <View key={k} className="overflow-hidden rounded-xl bg-surface-container-lowest opacity-70">
                  <View className="h-64 w-full bg-surface-container-low" />
                  <View className="gap-4 p-6">
                    <View className="h-5 w-[72%] rounded bg-surface-container-low" />
                    <View className="h-4 w-[48%] rounded bg-surface-container-low" />
                    <View className="h-10 w-full rounded bg-surface-container-low" />
                  </View>
                </View>
              ))
            : list.map((property) => {
                const pill = statusPillFromMetadata(property.metadata?.status);
                const { main, unit } = formatCompactInr(property.price_inr);
                const thumb = property.metadata?.images?.[0];
                const specs = propertySpecs(property);
                return (
                  <Pressable
                    key={property.id}
                    className="overflow-hidden rounded-xl bg-surface-container-lowest"
                    onPress={() => router.push(`/property/${property.id}` as never)}
                  >
                    <View className="relative h-64">
                      {thumb ? (
                        <Image source={{ uri: thumb }} className="h-full w-full" />
                      ) : (
                        <View className="h-full w-full items-center justify-center bg-surface-container-low">
                          <MaterialIcons name="image-not-supported" size={36} color="#94a3b8" />
                        </View>
                      )}
                      <View className="absolute left-4 top-4 rounded-full px-3 py-1" style={{ backgroundColor: pill.bg }}>
                        <Text className="text-[10px] font-black uppercase tracking-[1.5px] text-on-primary-container">{pill.label}</Text>
                      </View>
                      <Pressable className="absolute right-4 top-4 h-10 w-10 items-center justify-center rounded-full bg-black/20">
                        <MaterialIcons name="favorite" size={20} color="#fff" />
                      </Pressable>
                    </View>

                    <View className="gap-4 p-6">
                      <View className="flex-row items-start justify-between gap-4">
                        <View className="flex-1">
                          <Text className="text-xl font-bold text-on-surface">{property.title}</Text>
                          <View className="mt-1 flex-row items-center gap-1">
                            <MaterialIcons name="location-on" size={16} color="#6c7a71" />
                            <Text className="text-sm text-on-surface-variant">{property.location ?? "—"}</Text>
                          </View>
                        </View>
                        <View>
                          <Text className="text-right text-2xl font-black tracking-tight text-primary">{main}</Text>
                          {unit ? (
                            <Text className="text-right text-[10px] font-bold uppercase tracking-[1.5px] text-outline">{unit}</Text>
                          ) : null}
                        </View>
                      </View>

                      <View className="flex-row flex-wrap items-center gap-6 border-t border-surface-container-low pt-3">
                        {specs.map((spec) => (
                          <Text key={spec} className="text-sm font-bold text-on-surface">
                            {spec}
                          </Text>
                        ))}
                      </View>
                    </View>
                  </Pressable>
                );
              })}
          {!loading && list.length === 0 && !error ? (
            <View className="items-center rounded-xl bg-surface-container-low px-4 py-8">
              <MaterialIcons name="search-off" size={26} color="#6c7a71" />
              <Text className="mt-2 text-sm font-semibold text-on-surface">No properties found</Text>
              <Text className="mt-1 text-xs text-outline">Try changing filters or search text.</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <Pressable
        className="absolute bottom-28 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary"
        onPress={() => openOverlay()}
      >
        <MaterialIcons name="add" size={30} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}
