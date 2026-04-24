import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";

const mediaImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCVNjBBtbh9r-dV8z_Z3iumO7DWSWsyGw-by22UdIRtjV_ieVcW-Ydi9KAQMPLxTMTGnSNRAwPaDBFWbn0DKgjhNHH39a1RRt3YRQeBdJcxyCQBBMqn5qR69G12_txdL7NmlW4XNZDun_2WIsHKKyft1Dw3XZ-t9gjUrF7VNvqt10xaMg2a2Q74AcbTbBPis-Bg3fkPjQgCoK8HaekjHkC3UovONPUVOkl2yXlfnZYWFALHawCOYVeL45MAJC8QRHZV9m3JW1BrHG7Q",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuASz9nJ9xEzBR_W0YITBJwVz7ZlrlSBO3vpkMrz1Dmamy9tPAG9nySeu2XUyAFeybPN3li8i1nqcg3g5sV12J5_CFKaJ09B8OD5qtf08CQCxJkPLsz4SU1jUD8xclka7QGLGsuPoBpv0o4WkdMUhUngaNOxEz0XwUeUmKq1uJNyD5xR6eetuICYbAhlnQecfheWiaEUNKRmMmKpJV460KA3-SU527cUWoKGk1tvS2scDL_W_p6zdo6KLJp_UxPDmWXbCIyrDnF4uvw1",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCSH9Lw4plp4p0xLNaugWBDao_qaJqztEb57j4f88JQIqMzf9D6RQ1VkV7ET0kZK8dPw-YMlYkaXYA6d3cIOuhKi4MhguiIkU6NW8lh3z8PXluEFNhj5jFmCsNz5E-ANGPkrh1jBer5bHsFG4PpQRJGn0AosvnbCaLx4ZCJ58GkRzpyVyHdZ6lYPktznmjt3ZS0sV_zZplqqafRmkW7_CqB8LyADWbcW2d1R7k4MZG5Z3f0lCO6eZ209ibmDJDpPPClOiu5Ggd4WGvx",
];

export default function AddPropertyScreen() {
  const [selectedType, setSelectedType] = useState("Select Type");
  const [selectedStatus, setSelectedStatus] = useState("Available");
  const [openDropdown, setOpenDropdown] = useState<"type" | "status" | null>(null);

  const typeOptions = ["2 BHK Apartment", "3 BHK Apartment", "4 BHK Penthouse", "Luxury Villa", "Studio"];
  const statusOptions = ["Available", "Under Construction", "Coming Soon", "Sold Out"];

  const goBackOrDashboard = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/(tabs)");
  };

  const saveProperty = () => {
    Alert.alert("Property saved", "Your property listing has been saved.", [
      {
        text: "View Inventory",
        onPress: () => router.replace("/(tabs)/properties"),
      },
      {
        text: "Stay Here",
        style: "cancel",
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 170 }}>
        <View className="flex-row items-center justify-between px-6 pt-4">
          <View className="flex-row items-center gap-3">
            <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-surface-container-low" onPress={goBackOrDashboard}>
              <MaterialIcons name="arrow-back" size={21} color="#151c27" />
            </Pressable>
            <Text className="text-2xl font-black tracking-tight text-[#10B981]">Verdant Ledger</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Text className="text-sm text-slate-500">Draft Saved</Text>
            <MaterialIcons name="cloud-done" size={18} color="#94a3b8" />
          </View>
        </View>

        <View className="mt-8 px-6">
          <Text className="text-3xl font-black text-on-surface">Add New Property</Text>
          <Text className="mt-2 text-on-surface-variant">Fill in the details to list a new luxury asset.</Text>
        </View>

        <View className="mt-10 gap-10 px-6">
          <View className="gap-5">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="description" size={16} color="#006c49" />
              <Text className="text-[12px] font-black uppercase tracking-[2px] text-primary/80">Property Details</Text>
            </View>

            <View className="gap-2">
              <Text className="text-[11px] font-bold uppercase tracking-[2px] text-outline">Property Title</Text>
              <TextInput
                placeholder="e.g. Suncity Platinum Towers Penthouse"
                placeholderTextColor="#8a9b92"
                className="rounded-xl bg-surface-container-low px-4 py-4 text-on-surface"
              />
            </View>

            <View className="gap-2">
              <Text className="text-[11px] font-bold uppercase tracking-[2px] text-outline">Price (INR)</Text>
              <View className="rounded-xl bg-surface-container-low px-4 py-4">
                <Text className="text-base font-bold text-on-surface">INR 0.00</Text>
              </View>
            </View>

            <View className="gap-2">
              <Text className="text-[11px] font-bold uppercase tracking-[2px] text-outline">Size (sq.ft)</Text>
              <View className="relative">
                <TextInput placeholder="2400" placeholderTextColor="#8a9b92" className="rounded-xl bg-surface-container-low px-4 py-4 pr-16" />
                <Text className="absolute right-4 top-4 text-[10px] font-black uppercase text-outline">Sq.FT</Text>
              </View>
            </View>

            <View className="gap-2">
              <Text className="text-[11px] font-bold uppercase tracking-[2px] text-outline">Location</Text>
              <View className="flex-row items-center gap-2 rounded-xl bg-surface-container-low px-4 py-4">
                <MaterialIcons name="location-on" size={16} color="#6c7a71" />
                <Text className="flex-1 text-on-surface">Sector 54, Golf Course Road, Gurgaon</Text>
              </View>
            </View>

            <View className="gap-2">
              <Text className="text-[11px] font-bold uppercase tracking-[2px] text-outline">BHK / Type</Text>
              <Pressable
                className="flex-row items-center justify-between rounded-xl bg-surface-container-low px-4 py-4"
                onPress={() => setOpenDropdown(openDropdown === "type" ? null : "type")}
              >
                <Text className="text-on-surface">{selectedType}</Text>
                <MaterialIcons name={openDropdown === "type" ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={18} color="#6c7a71" />
              </Pressable>
              {openDropdown === "type" && (
                <View className="overflow-hidden rounded-xl bg-surface-container-lowest">
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
              <Text className="text-[11px] font-bold uppercase tracking-[2px] text-outline">Status</Text>
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
              />
            </View>
          </View>

          <View className="gap-5">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="photo-library" size={16} color="#006c49" />
                <Text className="text-[12px] font-black uppercase tracking-[2px] text-primary/80">Upload Property Photos</Text>
              </View>
              <Pressable>
                <Text className="text-[10px] font-black uppercase tracking-[1.3px] text-primary">Clear All</Text>
              </Pressable>
            </View>

            <View className="flex-row flex-wrap justify-between gap-y-3">
              <Pressable className="h-[96px] w-[48%] items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/50 bg-surface-container-high">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
                  <MaterialIcons name="add" size={24} color="#006c49" />
                </View>
                <Text className="mt-1 text-[9px] font-black uppercase tracking-[1.3px] text-outline">Add Media</Text>
              </Pressable>

              {mediaImages.map((image, index) => (
                <View key={image} className="relative h-[96px] w-[48%] overflow-hidden rounded-xl">
                  <Image source={{ uri: image }} className="h-full w-full" />
                  <Pressable className="absolute right-1 top-1 h-6 w-6 items-center justify-center rounded-full bg-white/90">
                    <MaterialIcons name="close" size={14} color="#ba1a1a" />
                  </Pressable>
                  {index === 0 && (
                    <View className="absolute bottom-1 left-1 rounded-full bg-primary px-2 py-[2px]">
                      <Text className="text-[8px] font-black uppercase tracking-[1.2px] text-white">Primary</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 w-full bg-white/95 px-6 pb-8 pt-4">
        <View className="flex-row gap-3">
          <Pressable className="flex-1 items-center rounded-xl bg-surface-container-highest py-4" onPress={goBackOrDashboard}>
            <Text className="font-bold text-on-surface">Cancel</Text>
          </Pressable>
          <Pressable className="flex-[2] overflow-hidden rounded-xl" onPress={saveProperty}>
            <LinearGradient colors={["#006c49", "#10b981"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="items-center py-4">
              <Text className="font-black text-white">Save Property</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
