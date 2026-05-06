import { useCallback, useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, Image, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { deleteProperty, getPropertyById } from "@/lib/properties";
import { formatCompactInr, formatRelativeListed } from "@/lib/formatInr";
import { statusPillFromMetadata } from "@/lib/propertyDisplay";
import type { Property } from "@/types";
import { ApiError } from "@/lib/api";

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const propertyId = (Array.isArray(id) ? id[0] : id) ?? "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [property, setProperty] = useState<Property | null>(null);

  const load = useCallback(async () => {
    if (!propertyId) {
      setError("Missing property id");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const p = await getPropertyById(propertyId);
      setProperty(p);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Could not load property";
      setError(msg);
      setProperty(null);
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    void load();
  }, [load]);

  const goBackOrInventory = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/(tabs)/properties");
  };

  const handleDeleteProperty = () => {
    Alert.alert("Delete Property", "Are you sure you want to delete this listing?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          void (async () => {
            try {
              await deleteProperty(propertyId);
              router.replace("/(tabs)/properties");
            } catch (e) {
              const msg = e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Delete failed";
              Alert.alert("Delete failed", msg);
            }
          })();
        },
      },
    ]);
  };

  const handleEditProperty = () => {
    router.push(`/add-property?id=${encodeURIComponent(propertyId)}` as never);
  };

  const gallery = property?.metadata?.images?.filter(Boolean) ?? [];
  const pill = statusPillFromMetadata(property?.metadata?.status);
  const { main: priceMain, unit: priceUnit } = formatCompactInr(property?.price_inr);
  const commissionRate = property?.metadata?.commission_rate;
  const hasBrokeragePct =
    commissionRate != null && !Number.isNaN(Number(commissionRate)) && Number(commissionRate) >= 0;
  const expected =
    property?.price_inr != null && hasBrokeragePct
      ? (Number(property.price_inr) * Number(commissionRate)) / 100
      : null;
  const { main: commMain, unit: commUnit } = formatCompactInr(expected ?? undefined);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <View className="flex-row items-center justify-between px-4 pt-3">
          <View className="flex-row items-center gap-2">
            <Pressable className="h-8 w-8 items-center justify-center rounded-full bg-surface-container-low" onPress={goBackOrInventory}>
              <MaterialIcons name="arrow-back" size={18} color="#475569" />
            </Pressable>
            <Text className="text-base font-bold text-on-surface">Verdant Ledger</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <MaterialIcons name="notifications-none" size={18} color="#64748b" />
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDD7V3XdL-mspFPWmQsetriBSZWSGqqcDoiTDWkKh0QbU7Ytl-gEwrjaULjR4L892tff4B0EDKbmzbHp-Wx03C9ldKSz7fbsfH809c34pLuQAdkzwaouDAk_cFP25wDxpSimQKXRxqIP1321d9xlLDc5Z8C1-PrNSzLYZ70IpyyOdMpGZrosxtEKfMVcHbe801phc26C9q5BMWUVyVWFDjr1s6X9tlV8WIvytZqFeQvVF1jwA8B9uqNj9rsNtYTceRgxrfrlT2MhHYb",
              }}
              className="h-8 w-8 rounded-full"
            />
          </View>
        </View>

        {error ? (
          <View className="mt-4 px-4">
            <View className="rounded-xl bg-error-container px-4 py-3">
              <Text className="text-sm text-on-error-container">{error}</Text>
            </View>
          </View>
        ) : null}

        {loading ? (
          <View className="mt-3 px-4">
            <View className="mb-4 flex-row gap-3 opacity-60">
              <View className="relative h-[280px] flex-1 overflow-hidden rounded-xl bg-surface-container-low" />
              <View className="w-[32%] gap-3">
                <View className="h-[133px] rounded-xl bg-surface-container-low" />
                <View className="h-[133px] rounded-xl bg-surface-container-low" />
              </View>
            </View>
            <View className="h-10 w-[80%] rounded bg-surface-container-low" />
            <View className="mt-3 h-6 w-[60%] rounded bg-surface-container-low" />
          </View>
        ) : property ? (
          <>
            <View className="mt-3 px-4">
              <View className="mb-4 flex-row gap-3">
                <View className="relative h-[280px] flex-1 overflow-hidden rounded-xl">
                  {gallery[0] ? (
                    <Image source={{ uri: gallery[0] }} className="h-full w-full" />
                  ) : (
                    <View className="h-full w-full items-center justify-center bg-surface-container-low">
                      <MaterialIcons name="image-not-supported" size={40} color="#94a3b8" />
                    </View>
                  )}
                  <LinearGradient
                    colors={["rgba(21,28,39,0)", "rgba(21,28,39,0.78)"]}
                    start={{ x: 0.5, y: 0.3 }}
                    end={{ x: 0.5, y: 1 }}
                    className="absolute inset-0"
                  />
                  <View className="absolute bottom-3 left-3 flex-row items-center gap-1 rounded-full bg-black/35 px-3 py-1">
                    <MaterialIcons name="photo-camera" size={11} color="#fff" />
                    <Text className="text-[10px] font-medium text-white">
                      {gallery.length ? `1 / ${gallery.length} Photos` : "0 Photos"}
                    </Text>
                  </View>
                </View>
                <View className="w-[32%] gap-3">
                  <View className="h-[133px] overflow-hidden rounded-xl">
                    {gallery[1] ? <Image source={{ uri: gallery[1] }} className="h-full w-full" /> : <View className="h-full bg-surface-container-low" />}
                  </View>
                  <View className="h-[133px] overflow-hidden rounded-xl">
                    {gallery[2] ? (
                      <Image source={{ uri: gallery[2] }} className="h-full w-full" />
                    ) : (
                      <View className="h-full bg-surface-container-low" />
                    )}
                    {gallery.length > 3 ? (
                      <View className="absolute inset-0 items-center justify-center bg-on-surface/45">
                        <Text className="text-xl font-black text-white">+{gallery.length - 3} View All</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
            </View>

            <View className="px-4">
              <View className="mb-2 flex-row items-center gap-2">
                <Text
                  className="rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[1.2px] text-white"
                  style={{ backgroundColor: pill.bg }}
                >
                  {pill.label}
                </Text>
                <Text className="text-[9px] font-semibold uppercase tracking-[1px] text-outline">{formatRelativeListed(property.created_at)}</Text>
              </View>

              <Text className="text-[46px] font-black leading-[50px] text-on-surface">{property.title}</Text>
              <View className="mt-1 flex-row items-center gap-1">
                <MaterialIcons name="location-on" size={16} color="#6c7a71" />
                <Text className="text-sm text-outline">{property.location ?? "—"}</Text>
              </View>

              <View className="mt-5 flex-row flex-wrap gap-3">
                {(
                  [
                    ["Pricing", priceMain, priceUnit],
                    ["Configuration", property.bhk != null ? String(property.bhk) : "—", "BHK"],
                    ["Total Area", property.metadata?.size_sqft != null ? Number(property.metadata.size_sqft).toLocaleString("en-IN") : "—", "Sq.Ft"],
                    ["Possession", property.possession?.trim() ? property.possession : "—", ""],
                  ] as const
                ).map(([label, value, unit]) => (
                  <View key={label} className="min-w-[47%] flex-1 rounded-xl bg-surface-container-low p-4">
                    <Text className="text-[10px] font-black uppercase tracking-[1.4px] text-outline">{label}</Text>
                    <View className="mt-1 flex-row items-end gap-1">
                      <Text className="text-[24px] font-black leading-[28px] text-on-surface">{value}</Text>
                      {unit ? (
                        <Text className="pb-[2px] text-xs font-black uppercase text-primary">{unit}</Text>
                      ) : null}
                    </View>
                  </View>
                ))}
              </View>

              <View className="mt-5 rounded-xl bg-surface-container-lowest p-5">
                <Text className="mb-4 text-[10px] font-black uppercase tracking-[1.7px] text-outline">Property Overview</Text>
                <Text className="leading-6 text-on-surface-variant">{property.description?.trim() || "No description provided."}</Text>

                <View className="mt-4 flex-row flex-wrap gap-2">
                  {(property.metadata?.amenities ?? []).length ? (
                    property.metadata!.amenities!.map((item) => (
                      <View key={item} className="rounded-full bg-surface-container-low px-3 py-2">
                        <Text className="text-[10px] font-semibold text-on-surface-variant">{item}</Text>
                      </View>
                    ))
                  ) : (
                    <Text className="text-xs text-outline">No amenities listed.</Text>
                  )}
                </View>
              </View>

              <View className="mt-5 h-[210px] overflow-hidden rounded-xl bg-surface-container-low">
                <Image
                  source={{
                    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBE1hAWJdWTvXQ25A9q2SD7BX1rSh0k6vzb45fUfLOPMZ-AQcGSS72pRU9hXWw0-ru4EN9sxNK-E_sTXIucJXHETBtkNi3KvC2rVhpE51HUSCotomX8xqK7c2wotJ6Qoq2ykTZLVcissRoyut7MW1iU7mHD4rH_FfRIm2Gz1m6h5-rmSFLAWci5fcGMaNpqvuW6o-geS9BZMZPGiuHQ85GPA79qpROiVF0VZUlKjdm0X33cJ6N2i4DHOmHZBb36WN3VP8Tmci6hpqqS",
                  }}
                  className="h-full w-full opacity-45"
                />
                <View className="absolute inset-0 items-center justify-center">
                  <View className="h-11 w-11 items-center justify-center rounded-full bg-primary">
                    <MaterialIcons name="location-on" size={22} color="#fff" />
                  </View>
                  <Text className="mt-2 rounded-lg bg-white px-3 py-1 text-xs font-bold text-on-surface">{property.title}</Text>
                </View>
              </View>

              <View className="mt-5 rounded-xl bg-surface-container-low p-5">
                <Text className="text-[10px] font-black uppercase tracking-[1.5px] text-outline">Commission Forecast</Text>
                <Text className="mt-1 text-[10px] text-on-surface-variant">Optional — add expected brokerage % when creating or editing.</Text>
                <View className="mt-4 flex-row items-center gap-3">
                  <View className="h-16 w-16 items-center justify-center rounded-full border-[5px] border-surface-variant">
                    <View className="h-14 w-14 items-center justify-center rounded-full border-[5px] border-primary/70">
                      <Text className="text-[10px] font-bold text-on-surface">
                        {hasBrokeragePct ? `${commissionRate}%` : "—"}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-1">
                    {!hasBrokeragePct ? (
                      <>
                        <Text className="text-base font-bold text-on-surface-variant">Not set for this listing</Text>
                        <Text className="mt-1 text-[10px] font-semibold uppercase tracking-[1px] text-outline">Use Edit Property to add a % if you want an INR estimate here.</Text>
                      </>
                    ) : property?.price_inr == null ? (
                      <>
                        <Text className="text-lg font-black text-on-surface">{commissionRate}% saved</Text>
                        <Text className="mt-1 text-[10px] font-semibold uppercase tracking-[1px] text-outline">Add a listing price to see the INR brokerage estimate.</Text>
                      </>
                    ) : (
                      <>
                        <Text className="text-[26px] font-black leading-[30px] text-on-surface">
                          {commMain}
                          <Text className="text-sm font-bold text-primary"> {commUnit}</Text>
                        </Text>
                        <Text className="text-[10px] font-semibold uppercase tracking-[1.2px] text-outline">Expected Brokerage</Text>
                      </>
                    )}
                  </View>
                </View>
              </View>

              <View className="mt-4 rounded-xl bg-surface-container-lowest p-5">
                <Text className="mb-1 text-[10px] font-black uppercase tracking-[1.5px] text-outline">Client / owner</Text>
                <Text className="mb-4 text-[10px] text-on-surface-variant">Saved from the listing form so you can reach them anytime.</Text>
                <View className="mb-4 flex-row items-center gap-3">
                  <Image
                    source={{
                      uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkp6FxXQkjW2tK9t3AYcIou_JXPFihnTVdHEM0DZpknRDJCO7MPN22Ngr4WzxWcCvXjtVq4uRnRUdDThoLDfKz3CW4FCOssy0ysVGq-ruIzcQxCeq_Kc2gHjJ7T8-bvcwUKZoegjbj4T8KEjsCd7qgNqUOF1TTav1UJzZS-SFXO4QAv7M3T51XQg0c3AzyRyz13ka42jrhYjYPdjZugS0FPgdicB3z4TaXk4IOS_s8k7C7UUFI6_tLgzLNgA_inwvcbFG8QhC3iaLz",
                    }}
                    className="h-11 w-11 rounded-full"
                  />
                  <View>
                    <Text className="text-sm font-bold text-on-surface">{property.metadata?.owner_name ?? "—"}</Text>
                    <Text className="text-xs text-outline">{property.metadata?.owner_phone ?? "No phone on file"}</Text>
                  </View>
                </View>
                <View className="gap-2">
                  <Pressable
                    className="flex-row items-center justify-center gap-2 rounded-xl bg-surface-container-high py-3"
                    onPress={() => {
                      const raw = property.metadata?.owner_phone ?? "";
                      const digits = raw.replace(/\D/g, "");
                      if (!digits) return;
                      void Linking.openURL(`tel:${digits}`);
                    }}
                  >
                    <MaterialIcons name="call" size={16} color="#006c49" />
                    <Text className="text-[11px] font-black uppercase tracking-[1.2px] text-primary">Call Owner</Text>
                  </Pressable>
                  <Pressable
                    className="flex-row items-center justify-center gap-2 rounded-xl bg-surface-container-high py-3"
                    onPress={() => {
                      const raw = property.metadata?.owner_phone ?? "";
                      let digits = raw.replace(/\D/g, "");
                      if (!digits) return;
                      if (digits.length === 10) digits = `91${digits}`;
                      void Linking.openURL(`whatsapp://send?phone=${digits}`);
                    }}
                  >
                    <MaterialIcons name="chat-bubble" size={16} color="#006c49" />
                    <Text className="text-[11px] font-black uppercase tracking-[1.2px] text-primary">WhatsApp</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </>
        ) : !error ? (
          <View className="mt-10 items-center px-4">
            <Text className="text-sm text-outline">Property not found.</Text>
          </View>
        ) : null}
      </ScrollView>

      <View className="absolute bottom-0 w-full bg-white/95 px-4 pb-6 pt-3">
        <View className="flex-row gap-3">
          <Pressable
            className="flex-1 items-center justify-center rounded-xl bg-surface-container-high py-3.5"
            onPress={handleDeleteProperty}
            disabled={loading || !property}
          >
            <Text className="text-[11px] font-black uppercase tracking-[1.2px] text-on-surface">Delete Property</Text>
          </Pressable>
          <Pressable className="flex-1 overflow-hidden rounded-xl" onPress={handleEditProperty} disabled={loading || !property}>
            <LinearGradient colors={["#006c49", "#10b981"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="items-center py-3.5">
              <Text className="text-[11px] font-black uppercase tracking-[1.2px] text-white">Edit Property</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
