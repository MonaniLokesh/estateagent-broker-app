import { useCallback, useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { getDashboardSummary } from "@/lib/dashboard";
import { getProperties } from "@/lib/properties";
import { formatCompactInr } from "@/lib/formatInr";
import { statusPillFromMetadata } from "@/lib/propertyDisplay";
import type { Property } from "@/types";
import { ApiError } from "@/lib/api";

export default function DashboardScreen() {
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [summary, setSummary] = useState<{
    totalListings: number;
    activeListings: number;
    totalLeads: number;
    revenueEstimate: number;
  } | null>(null);

  const [recentLoading, setRecentLoading] = useState(true);
  const [recentError, setRecentError] = useState<string | null>(null);
  const [recent, setRecent] = useState<Property[]>([]);

  const loadSummary = useCallback(async () => {
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Could not load dashboard";
      setSummaryError(msg);
      setSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  const loadRecent = useCallback(async () => {
    setRecentLoading(true);
    setRecentError(null);
    try {
      const list = await getProperties();
      setRecent(list.slice(0, 3));
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Could not load properties";
      setRecentError(msg);
      setRecent([]);
    } finally {
      setRecentLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSummary();
    void loadRecent();
  }, [loadSummary, loadRecent]);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-6 pt-4">
          <View className="mb-7 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBm3TAxwBBoPmimZnccl_6gK95KrqhyReSiByJMZXPgxUlyP8VF723gBj5_Ol7baX2Gdlm88pSI4SWnNDfv8G0bFMVhHtZVZiUioFH6oCNrUONz0UMYu3dqf_EXes3Z5Z7ByUYUEySf9MuuKvpDl7JIENRi4vEQcbjjQZ3sNP6sO-nmF7UWGu-tec16-k_xPNauHVvrymGiO__-oUADcbcsp0yVkpL0mWRE802wF94MbiQMFIpbmMnFV8twqk2ivMj3pUlYmraq6COQ",
                }}
                className="h-10 w-10 rounded-full"
              />
              <View>
                <Text className="text-[10px] font-extrabold uppercase tracking-[2px] text-outline">Broker</Text>
                <Text className="text-lg font-black text-on-surface">Amit Sharma</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-3">
              <Text className="text-xl font-black tracking-tight text-[#10B981]">Verdant Ledger</Text>
              <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-surface-container-low">
                <MaterialIcons name="notifications-none" size={21} color="#6c7a71" />
              </Pressable>
            </View>
          </View>

          <View className="mb-8">
            <Text className="mb-2 text-3xl font-black tracking-tight text-on-surface">Portfolio Overview</Text>
            <Text className="text-sm text-outline">Welcome back, your real estate metrics are looking strong today.</Text>
          </View>

          {summaryError ? (
            <View className="mb-4 rounded-xl bg-error-container px-4 py-3">
              <Text className="text-sm text-on-error-container">{summaryError}</Text>
            </View>
          ) : null}

          <View className="mb-4 flex-row gap-4">
            {summaryLoading ? (
              <>
                <View className="flex-1 rounded-xl bg-surface-container-lowest p-5 opacity-60">
                  <View className="h-6 w-6 rounded bg-surface-container-high" />
                  <View className="mt-5 h-3 w-24 rounded bg-surface-container-high" />
                  <View className="mt-3 h-8 w-16 rounded bg-surface-container-high" />
                </View>
                <View className="flex-1 rounded-xl bg-surface-container-low p-5 opacity-60">
                  <View className="h-6 w-6 rounded bg-surface-container-high" />
                  <View className="mt-5 h-3 w-24 rounded bg-surface-container-high" />
                  <View className="mt-3 h-8 w-16 rounded bg-surface-container-high" />
                </View>
              </>
            ) : (
              <>
                <View className="flex-1 rounded-xl bg-surface-container-lowest p-5">
                  <MaterialIcons name="domain" size={24} color="#006c49" />
                  <Text className="mt-5 text-[11px] font-extrabold uppercase tracking-[2px] text-outline">Total Properties</Text>
                  <Text className="mt-1 text-4xl font-black text-on-surface">{summary?.totalListings ?? "—"}</Text>
                </View>
                <View className="flex-1 rounded-xl bg-surface-container-low p-5">
                  <MaterialIcons name="analytics" size={24} color="#006c49" />
                  <Text className="mt-5 text-[11px] font-extrabold uppercase tracking-[2px] text-outline">Active Listings</Text>
                  <Text className="mt-1 text-4xl font-black text-on-surface">{summary?.activeListings ?? "—"}</Text>
                </View>
              </>
            )}
          </View>

          <View className="mb-8 flex-row gap-4">
            {summaryLoading ? (
              <>
                <View className="flex-1 rounded-xl bg-surface-container-lowest p-5 opacity-60">
                  <View className="h-6 w-6 rounded bg-surface-container-high" />
                  <View className="mt-5 h-3 w-20 rounded bg-surface-container-high" />
                  <View className="mt-3 h-8 w-12 rounded bg-surface-container-high" />
                </View>
                <View className="flex-1 rounded-xl bg-surface-container-low p-5 opacity-60">
                  <View className="h-6 w-6 rounded bg-surface-container-high" />
                  <View className="mt-5 h-3 w-20 rounded bg-surface-container-high" />
                  <View className="mt-3 h-8 w-20 rounded bg-surface-container-high" />
                </View>
              </>
            ) : (
              <>
                <View className="flex-1 rounded-xl bg-surface-container-lowest p-5">
                  <MaterialIcons name="groups" size={24} color="#006c49" />
                  <Text className="mt-5 text-[11px] font-extrabold uppercase tracking-[2px] text-outline">Total Leads</Text>
                  <Text className="mt-1 text-4xl font-black text-on-surface">{summary?.totalLeads ?? "—"}</Text>
                </View>
                <View className="flex-1 rounded-xl bg-surface-container-low p-5">
                  <MaterialIcons name="payments" size={24} color="#006c49" />
                  <Text className="mt-5 text-[11px] font-extrabold uppercase tracking-[2px] text-outline">Revenue Est.</Text>
                  <Text className="mt-1 text-2xl font-black text-on-surface">
                    {formatCompactInr(summary?.revenueEstimate).main}
                    <Text className="text-sm font-bold text-primary"> {formatCompactInr(summary?.revenueEstimate).unit}</Text>
                  </Text>
                </View>
              </>
            )}
          </View>

          <Pressable className="mb-10" onPress={() => router.push("/add-property") as never}>
            <LinearGradient
              colors={["#006c49", "#10b981"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 24 }}
              className="flex-row items-center justify-center gap-2 py-5"
            >
              <MaterialIcons name="add-circle" size={21} color="#fff" />
              <Text className="text-base font-black text-white">Add New Property</Text>
            </LinearGradient>
          </Pressable>

          <View className="mb-5 flex-row items-end justify-between">
            <View>
              <Text className="text-2xl font-bold text-on-surface">Recent Properties</Text>
              <Text className="text-xs text-outline">Fresh listings from your portfolio</Text>
            </View>
            <Pressable onPress={() => router.push("/(tabs)/properties") as never}>
              <Text className="text-xs font-extrabold uppercase tracking-[2px] text-primary">View All</Text>
            </Pressable>
          </View>
        </View>

        {recentError ? (
          <View className="mb-4 px-6">
            <View className="rounded-xl bg-error-container px-4 py-3">
              <Text className="text-sm text-on-error-container">{recentError}</Text>
            </View>
          </View>
        ) : null}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 18 }}>
          {recentLoading
            ? [0, 1, 2].map((k) => (
                <View key={k} className="w-[280px] opacity-60">
                  <View className="relative mb-4 h-[360px] overflow-hidden rounded-xl bg-surface-container-low" />
                  <View className="mb-2 h-4 w-40 rounded bg-surface-container-low" />
                  <View className="h-3 w-28 rounded bg-surface-container-low" />
                </View>
              ))
            : recent.length === 0
              ? (
                  <View className="w-[280px] items-center justify-center rounded-xl bg-surface-container-low px-4 py-10">
                    <MaterialIcons name="domain" size={26} color="#6c7a71" />
                    <Text className="mt-2 text-sm font-semibold text-on-surface">No properties yet</Text>
                    <Text className="mt-1 text-center text-xs text-outline">Add a listing to see it here.</Text>
                  </View>
                )
              : recent.map((property) => {
                  const pill = statusPillFromMetadata(property.metadata?.status);
                  const { main, unit } = formatCompactInr(property.price_inr);
                  const thumb = property.metadata?.images?.[0];
                  return (
                    <Pressable
                      key={property.id}
                      className="w-[280px]"
                      onPress={() => router.push(`/property/${property.id}` as never)}
                    >
                      <View className="relative mb-4 h-[360px] overflow-hidden rounded-xl">
                        {thumb ? (
                          <Image source={{ uri: thumb }} className="h-full w-full" />
                        ) : (
                          <View className="h-full w-full items-center justify-center bg-surface-container-low">
                            <MaterialIcons name="image-not-supported" size={32} color="#94a3b8" />
                          </View>
                        )}
                        <LinearGradient
                          colors={["rgba(21,28,39,0)", "rgba(21,28,39,0.8)"]}
                          start={{ x: 0.5, y: 0.2 }}
                          end={{ x: 0.5, y: 1 }}
                          className="absolute inset-0"
                        />
                        <View className="absolute bottom-4 left-4 right-4">
                          <View className="mb-2 self-start rounded-full px-3 py-1" style={{ backgroundColor: pill.bg }}>
                            <Text className="text-[10px] font-black uppercase tracking-[1.6px] text-on-primary-container">{pill.label}</Text>
                          </View>
                          <View className="flex-row items-end gap-1">
                            <Text className="text-2xl font-black text-white">{main}</Text>
                            {unit ? (
                              <Text className="pb-1 text-xs font-semibold text-white/80">{unit}</Text>
                            ) : null}
                          </View>
                        </View>
                      </View>
                      <Text className="mb-1 text-lg font-bold text-on-surface">{property.title}</Text>
                      <View className="flex-row items-center gap-1">
                        <MaterialIcons name="location-on" size={14} color="#6c7a71" />
                        <Text className="text-xs text-outline">{property.location ?? "—"}</Text>
                      </View>
                    </Pressable>
                  );
                })}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}
