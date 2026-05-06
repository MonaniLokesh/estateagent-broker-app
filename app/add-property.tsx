import { useEffect, useMemo, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, Image, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import {
  createProperty,
  getPropertyById,
  updateProperty,
  uploadPropertyImages,
  type ImageFile,
  type PropertyPayload,
} from "@/lib/properties";
import type { Property } from "@/types";
import { metadataStatusToUi, parseBhkFromTypeLabel, uiStatusToMetadataStatus } from "@/lib/propertyDisplay";
import { ApiError } from "@/lib/api";

type PhotoRow = { key: string; uri: string; file?: ImageFile };

const typeOptions = ["2 BHK Apartment", "3 BHK Apartment", "4 BHK Penthouse", "Luxury Villa", "Studio"];
const statusOptions = ["Available", "Under Construction", "Coming Soon", "Sold Out"];

function newKey() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function AddPropertyScreen() {
  const { id: idParam } = useLocalSearchParams<{ id?: string | string[] }>();
  const editId = useMemo(() => {
    const v = idParam;
    if (Array.isArray(v)) return v[0];
    return v;
  }, [idParam]);

  const [selectedType, setSelectedType] = useState("Select Type");
  const [selectedStatus, setSelectedStatus] = useState("Available");
  const [openDropdown, setOpenDropdown] = useState<"type" | "status" | null>(null);

  const [title, setTitle] = useState("");
  const [priceText, setPriceText] = useState("");
  const [sizeText, setSizeText] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [brokeragePercentText, setBrokeragePercentText] = useState("");
  const [photos, setPhotos] = useState<PhotoRow[]>([]);

  const [initialLoading, setInitialLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [baselineMeta, setBaselineMeta] = useState<Property["metadata"] | null>(null);

  const goBackOrDashboard = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/(tabs)");
  };

  useEffect(() => {
    if (!editId) {
      setBaselineMeta(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setInitialLoading(true);
      setLoadError(null);
      try {
        const p = await getPropertyById(editId);
        if (cancelled) return;
        const rawMeta: Record<string, unknown> = { ...(p.metadata as object) };
        delete rawMeta.embedding;
        setBaselineMeta(rawMeta as Property["metadata"]);
        setTitle(p.title ?? "");
        setPriceText(p.price_inr != null ? String(p.price_inr) : "");
        setSizeText(p.metadata?.size_sqft != null ? String(p.metadata.size_sqft) : "");
        setLocation(p.location ?? "");
        setDescription(p.description ?? "");
        const typeFromMeta = p.metadata?.type?.trim();
        setSelectedType(typeFromMeta && typeFromMeta.length > 0 ? typeFromMeta : "Select Type");
        setSelectedStatus(metadataStatusToUi(p.metadata?.status));
        setOwnerName(p.metadata?.owner_name?.trim() ?? "");
        setOwnerPhone(p.metadata?.owner_phone?.trim() ?? "");
        const cr = p.metadata?.commission_rate;
        setBrokeragePercentText(cr != null && !Number.isNaN(Number(cr)) ? String(cr) : "");
        const imgs = (p.metadata?.images ?? []).filter(Boolean);
        setPhotos(imgs.map((uri) => ({ key: newKey(), uri })));
      } catch (e) {
        if (!cancelled) {
          const msg = e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Could not load property";
          setLoadError(msg);
        }
      } finally {
        if (!cancelled) setInitialLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [editId]);

  const pickImages = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.85,
    });
    if (res.canceled) return;
    const next: PhotoRow[] = [];
    for (const a of res.assets) {
      const file: ImageFile = {
        uri: a.uri,
        name: a.fileName ?? `upload_${newKey()}.jpg`,
        type: a.mimeType ?? "image/jpeg",
      };
      next.push({ key: newKey(), uri: a.uri, file });
    }
    setPhotos((prev) => [...prev, ...next]);
  };

  const removePhoto = (key: string) => {
    setPhotos((prev) => prev.filter((p) => p.key !== key));
  };

  const clearPhotos = () => setPhotos([]);

  const saveProperty = async () => {
    setSaveError(null);
    setSaving(true);
    try {
      const titleTrim = title.trim();
      if (!titleTrim) {
        throw new Error("Title is required");
      }

      const locationTrim = location.trim();
      if (!locationTrim) {
        throw new Error("Location is required");
      }

      if (selectedType === "Select Type") {
        throw new Error("BHK / Type is required");
      }

      if (!selectedStatus.trim()) {
        throw new Error("Status is required");
      }

      const priceRaw = priceText.trim();
      if (!priceRaw) {
        throw new Error("Price is required");
      }
      const price_inr = Number(priceRaw.replace(/,/g, ""));
      if (Number.isNaN(price_inr)) {
        throw new Error("Price must be a valid number");
      }

      const sizeRaw = sizeText.trim();
      if (!sizeRaw) {
        throw new Error("Size is required");
      }
      const size_sqft = Number(sizeRaw.replace(/,/g, ""));
      if (Number.isNaN(size_sqft)) {
        throw new Error("Size must be a valid number");
      }

      const owner_name = ownerName.trim();
      const owner_phone = ownerPhone.trim();
      if (!owner_name) {
        throw new Error("Client / owner name is required");
      }
      if (!owner_phone) {
        throw new Error("Client phone number is required");
      }
      const phoneDigits = owner_phone.replace(/\D/g, "");
      if (phoneDigits.length < 8) {
        throw new Error("Enter a valid phone number (at least 8 digits)");
      }

      let commission_rate: number | undefined;
      const brokerageRaw = brokeragePercentText.trim();
      if (brokerageRaw) {
        const parsedCommission = Number(brokerageRaw.replace(/,/g, ""));
        if (Number.isNaN(parsedCommission) || parsedCommission < 0 || parsedCommission > 100) {
          throw new Error("Brokerage % must be between 0 and 100");
        }
        commission_rate = parsedCommission;
      }

      const remoteUris = photos.filter((p) => !p.file).map((p) => p.uri);
      const files = photos.map((p) => p.file).filter((f): f is ImageFile => Boolean(f));
      const uploaded = files.length ? await uploadPropertyImages(files) : [];
      const imageUrls = [...remoteUris, ...uploaded];

      const bhk = parseBhkFromTypeLabel(selectedType);

      const metaBase: Record<string, unknown> = { ...(baselineMeta ?? {}) };
      delete metaBase.embedding;

      const metadata: NonNullable<PropertyPayload["metadata"]> = {
        ...(metaBase as Property["metadata"]),
        type: selectedType === "Select Type" ? undefined : selectedType,
        status: uiStatusToMetadataStatus(selectedStatus),
        size_sqft,
        images: imageUrls.length ? imageUrls : undefined,
        owner_name,
        owner_phone,
      };

      if (commission_rate !== undefined) {
        metadata.commission_rate = commission_rate;
      } else {
        delete (metadata as Record<string, unknown>).commission_rate;
      }

      const payload: PropertyPayload = {
        title: titleTrim,
        description: description.trim() || undefined,
        price_inr,
        location: locationTrim,
        bhk,
        possession: undefined,
        metadata,
      };

      if (editId) {
        await updateProperty(editId, payload);
      } else {
        await createProperty(payload);
      }
      router.replace("/(tabs)/properties");
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Save failed";
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      {Platform.OS === "web" ? (
        <BlurView intensity={65} tint="dark" pointerEvents="none" className="absolute inset-0" />
      ) : null}
      <View pointerEvents="none" className="absolute inset-0 bg-black/35" />
      <Pressable className="flex-1 items-center justify-center px-3 py-3" onPress={goBackOrDashboard}>
        <Pressable
          className="w-full overflow-hidden rounded-3xl bg-surface"
          style={{ maxWidth: 760, height: "92%" }}
          onPress={(e) => e.stopPropagation()}
        >
          <View className="flex-row items-center justify-between border-b border-outline-variant/20 px-6 py-4">
            <View>
              <Text className="text-2xl font-black text-on-surface">{editId ? "Edit Property" : "Add New Property"}</Text>
              <Text className="mt-1 text-on-surface-variant">Fill in the details to list a new luxury asset.</Text>
            </View>
            <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-surface-container-low" onPress={goBackOrDashboard}>
              <MaterialIcons name="close" size={21} color="#151c27" />
            </Pressable>
          </View>

          <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
            {loadError ? (
              <View className="mt-4 px-6">
                <View className="rounded-xl bg-error-container px-4 py-3">
                  <Text className="text-sm text-on-error-container">{loadError}</Text>
                </View>
              </View>
            ) : null}

            {initialLoading ? (
              <View className="mt-10 items-center px-6">
                <ActivityIndicator size="large" color="#006c49" />
                <Text className="mt-3 text-sm text-outline">Loading property...</Text>
              </View>
            ) : (
              <View className="mt-6 gap-10 px-6">
                <View className="gap-5">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name="description" size={16} color="#006c49" />
                    <Text className="text-[12px] font-black uppercase tracking-[2px] text-primary/80">Property Details</Text>
                  </View>

                  <View className="gap-2">
                    <Text className="text-[11px] font-bold uppercase tracking-[2px] text-outline">
                      Property Title <Text className="text-error">*</Text>
                    </Text>
                    <TextInput
                      placeholder="e.g. Suncity Platinum Towers Penthouse"
                      placeholderTextColor="#8a9b92"
                      className="rounded-xl bg-surface-container-low px-4 py-4 text-on-surface"
                      value={title}
                      onChangeText={setTitle}
                    />
                  </View>

                  <View className="gap-2">
                    <Text className="text-[11px] font-bold uppercase tracking-[2px] text-outline">
                      Price (INR) <Text className="text-error">*</Text>
                    </Text>
                    <TextInput
                      placeholder="e.g. 14500000"
                      placeholderTextColor="#8a9b92"
                      keyboardType="decimal-pad"
                      className="rounded-xl bg-surface-container-low px-4 py-4 text-base font-bold text-on-surface"
                      value={priceText}
                      onChangeText={setPriceText}
                    />
                  </View>

                  <View className="gap-2">
                    <Text className="text-[11px] font-bold uppercase tracking-[2px] text-outline">
                      Size (sq.ft) <Text className="text-error">*</Text>
                    </Text>
                    <View className="relative">
                      <TextInput
                        placeholder="2400"
                        placeholderTextColor="#8a9b92"
                        keyboardType="number-pad"
                        className="rounded-xl bg-surface-container-low px-4 py-4 pr-16 text-on-surface"
                        value={sizeText}
                        onChangeText={setSizeText}
                      />
                      <Text className="absolute right-4 top-4 text-[10px] font-black uppercase text-outline">Sq.FT</Text>
                    </View>
                  </View>

                  <View className="gap-2">
                    <Text className="text-[11px] font-bold uppercase tracking-[2px] text-outline">
                      Location <Text className="text-error">*</Text>
                    </Text>
                    <View className="flex-row items-center gap-2 rounded-xl bg-surface-container-low px-4 py-4">
                      <MaterialIcons name="location-on" size={16} color="#6c7a71" />
                      <TextInput
                        className="flex-1 text-on-surface"
                        placeholder="Sector 54, Golf Course Road, Gurgaon"
                        placeholderTextColor="#8a9b92"
                        value={location}
                        onChangeText={setLocation}
                      />
                    </View>
                  </View>

                  <View className="gap-2">
                    <Text className="text-[11px] font-bold uppercase tracking-[2px] text-outline">
                      BHK / Type <Text className="text-error">*</Text>
                    </Text>
                    <Pressable
                      className="flex-row items-center justify-between rounded-xl bg-surface-container-low px-4 py-4"
                      onPress={() => setOpenDropdown(openDropdown === "type" ? null : "type")}
                    >
                      <Text className="text-on-surface">{selectedType}</Text>
                      <MaterialIcons name={openDropdown === "type" ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={18} color="#6c7a71" />
                    </Pressable>
                    {openDropdown === "type" && (
                      <View className="overflow-hidden rounded-xl bg-surface-container-lowest">
                        <Pressable
                          className="px-4 py-3"
                          onPress={() => {
                            setSelectedType("Select Type");
                            setOpenDropdown(null);
                          }}
                        >
                          <Text className="text-on-surface">Select Type</Text>
                        </Pressable>
                        {typeOptions.map((option) => (
                          <Pressable
                            key={option}
                            className="px-4 py-3"
                            onPress={() => {
                              setSelectedType(option);
                              setOpenDropdown(null);
                            }}
                          >
                            <Text className="text-on-surface">{option}</Text>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>

                  <View className="gap-2">
                    <Text className="text-[11px] font-bold uppercase tracking-[2px] text-outline">
                      Status <Text className="text-error">*</Text>
                    </Text>
                    <Pressable
                      className="flex-row items-center justify-between rounded-xl bg-surface-container-low px-4 py-4"
                      onPress={() => setOpenDropdown(openDropdown === "status" ? null : "status")}
                    >
                      <Text className="text-on-surface">{selectedStatus}</Text>
                      <MaterialIcons name={openDropdown === "status" ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={18} color="#6c7a71" />
                    </Pressable>
                    {openDropdown === "status" && (
                      <View className="overflow-hidden rounded-xl bg-surface-container-lowest">
                        {statusOptions.map((option) => (
                          <Pressable
                            key={option}
                            className="px-4 py-3"
                            onPress={() => {
                              setSelectedStatus(option);
                              setOpenDropdown(null);
                            }}
                          >
                            <Text className="text-on-surface">{option}</Text>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>

                  <View className="gap-2">
                    <Text className="text-[11px] font-bold uppercase tracking-[2px] text-outline">Description</Text>
                    <TextInput
                      multiline
                      numberOfLines={4}
                      placeholder="Highlight key features like modular kitchen, servant quarters, high floor..."
                      placeholderTextColor="#8a9b92"
                      textAlignVertical="top"
                      className="rounded-xl bg-surface-container-low px-4 py-4 text-on-surface"
                      value={description}
                      onChangeText={setDescription}
                    />
                  </View>

                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name="person" size={16} color="#006c49" />
                    <Text className="text-[12px] font-black uppercase tracking-[2px] text-primary/80">Client / owner</Text>
                  </View>

                  <View className="gap-2">
                    <Text className="text-[11px] font-bold uppercase tracking-[2px] text-outline">
                      Client or owner name <Text className="text-error">*</Text>
                    </Text>
                    <TextInput
                      placeholder="Who should you call about this listing?"
                      placeholderTextColor="#8a9b92"
                      className="rounded-xl bg-surface-container-low px-4 py-4 text-on-surface"
                      value={ownerName}
                      onChangeText={setOwnerName}
                      autoCapitalize="words"
                    />
                  </View>

                  <View className="gap-2">
                    <Text className="text-[11px] font-bold uppercase tracking-[2px] text-outline">
                      Client phone <Text className="text-error">*</Text>
                    </Text>
                    <TextInput
                      placeholder="e.g. 9876543210 or +91 9876543210"
                      placeholderTextColor="#8a9b92"
                      keyboardType="phone-pad"
                      className="rounded-xl bg-surface-container-low px-4 py-4 text-on-surface"
                      value={ownerPhone}
                      onChangeText={setOwnerPhone}
                    />
                  </View>

                  <View className="gap-2">
                    <Text className="text-[11px] font-bold uppercase tracking-[2px] text-outline">Expected brokerage (%)</Text>
                    <Text className="text-[10px] leading-4 text-outline">Optional. If you add a %, we show an estimated commission on the property page.</Text>
                    <TextInput
                      placeholder="e.g. 2 for 2% — leave blank if unknown"
                      placeholderTextColor="#8a9b92"
                      keyboardType="decimal-pad"
                      className="rounded-xl bg-surface-container-low px-4 py-4 text-on-surface"
                      value={brokeragePercentText}
                      onChangeText={setBrokeragePercentText}
                    />
                  </View>
                </View>

                <View className="gap-5">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <MaterialIcons name="photo-library" size={16} color="#006c49" />
                      <Text className="text-[12px] font-black uppercase tracking-[2px] text-primary/80">Upload Property Photos</Text>
                    </View>
                    <Pressable onPress={clearPhotos}>
                      <Text className="text-[10px] font-black uppercase tracking-[1.3px] text-primary">Clear All</Text>
                    </Pressable>
                  </View>

                  <View className="flex-row flex-wrap justify-between gap-y-3">
                    <Pressable
                      className="h-[96px] w-[48%] items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/50 bg-surface-container-high"
                      onPress={pickImages}
                    >
                      <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
                        <MaterialIcons name="add" size={24} color="#006c49" />
                      </View>
                      <Text className="mt-1 text-[9px] font-black uppercase tracking-[1.3px] text-outline">Add Media</Text>
                    </Pressable>

                    {photos.map((photo, index) => (
                      <View key={photo.key} className="relative h-[96px] w-[48%] overflow-hidden rounded-xl">
                        <Image source={{ uri: photo.uri }} className="h-full w-full" />
                        <Pressable
                          className="absolute right-1 top-1 h-6 w-6 items-center justify-center rounded-full bg-white/90"
                          onPress={() => removePhoto(photo.key)}
                        >
                          <MaterialIcons name="close" size={14} color="#ba1a1a" />
                        </Pressable>
                        {index === 0 ? (
                          <View className="absolute bottom-1 left-1 rounded-full bg-primary px-2 py-[2px]">
                            <Text className="text-[8px] font-black uppercase tracking-[1.2px] text-white">Primary</Text>
                          </View>
                        ) : null}
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          <View className="border-t border-outline-variant/20 bg-white/95 px-6 py-4">
            {saveError ? (
              <View className="mb-3 rounded-xl bg-error-container px-4 py-3">
                <Text className="text-sm text-on-error-container">{saveError}</Text>
              </View>
            ) : null}
            <View className="flex-row gap-3">
              <Pressable className="flex-1 items-center rounded-xl bg-surface-container-highest py-4" onPress={goBackOrDashboard} disabled={saving}>
                <Text className="font-bold text-on-surface">Cancel</Text>
              </Pressable>
              <Pressable className="flex-[2] overflow-hidden rounded-xl" onPress={() => void saveProperty()} disabled={saving || initialLoading}>
                <LinearGradient colors={["#006c49", "#10b981"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="items-center py-4">
                  {saving ? <ActivityIndicator color="#fff" /> : <Text className="font-black text-white">Save Property</Text>}
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </SafeAreaView>
  );
}
