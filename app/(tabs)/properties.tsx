import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";

const properties = [
  {
    id: "1",
    title: "Suncity Platinum Towers",
    location: "Wakad, Pune",
    status: "Available",
    statusBg: "#10b981",
    price: "INR 1.45",
    unit: "Cr",
    specs: ["3 BHK", "1,850 sqft", "2 Park"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC3VDg1YBWeebcQsYDGeK3IsvTuyeQhMGphwubnY1rL3EdAk4CjIc4gBq7xrJeU1in0tB_n1wX3OM9rthDpm1OTRmoKEby9UkyrTfl4JKhW0hiqtN1khlQUOJE5gyOx6nsADZCWjTgAmzWx0p3IwGmRA1yEBEqA4cpbp5D6eOdhBHnLmMCqHBHl9z82f6AdsDsAJ3FTfAEhvf8ey1NW5IfRvjXEEV_g-zCzvl42SKeXaYMiWaZEjVn52-II3aolhTAh4RlTaVy6hu8O",
  },
  {
    id: "2",
    title: "VTP Blue Waters",
    location: "Mahalunge, Pune",
    status: "Under Offer",
    statusBg: "#fc7c78",
    price: "INR 88.5",
    unit: "Lakhs",
    specs: ["2 BHK", "1,050 sqft", "Garden View"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBSZBjAu69C9DP1w6sGypIHFXWIEztvm7CIfERxa-BnxFAgKi69fCj0zW6n9MY52vY4_Iuoe26yGAnJwk6vgtJemV2RD29dvngKi1XfJpnzcpQzLZi8c7d-G3Tp4z1NusuQBV9-oRHPHFRuWv5KowPy3Cu0sxMsQExVWx4ojyGMjFT6TJFN2PYooR38WeO479TSXpPrju4IDDw8T3zlorbFcmOcRfy3gCeRkGb7RFfe2SPxtWjQpgEldOs5-plRNS4-Ea9Z-evBMJty",
  },
  {
    id: "3",
    title: "Lodha Belmondo",
    location: "Gahunje, Pune",
    status: "Available",
    statusBg: "#10b981",
    price: "INR 2.10",
    unit: "Cr",
    specs: ["4 BHK", "Premium Club", "RERA"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAS0DaqCjwce1lAgZolj0wlljZLyBx1umkAhkJnNh33MOF5xluYaeI8aw4Z5BJSSRqKQ0RbcqhVcj5vnm6tIWOCYXW40VuVXGA1etb68-Wv_2Nvonk1e9p3Eg3wmo7VxVBRCduD_HSnNJM9ZkNvV9kVKdk2OdOqeT1c18LEp_I4OPH7-1XgM77YC_4O2-8LZ3ircRDby3ZGfZrrca6AScjERvr8l6_5QIW_B-N6uIPZsdvAtFnqNoUFyrWbGsXKx6OvRzSrVb38CGOA",
  },
];

const filters = ["All", "Available", "Under Offer", "Sold"];

export default function PropertiesScreen() {
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
            <Text className="mt-1 text-sm text-on-surface-variant">Manage 24 active listings in Pune</Text>
          </View>

          <View className="relative mb-4 rounded-xl bg-surface-container-low px-4 py-4">
            <View className="absolute left-4 top-4">
              <MaterialIcons name="search" size={20} color="#6c7a71" />
            </View>
            <TextInput
              placeholder="Search by area or project name..."
              placeholderTextColor="#8d9f95"
              className="pl-8 text-sm text-on-surface"
            />
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 8, paddingBottom: 8 }}>
          {filters.map((filter, idx) => (
            <Pressable
              key={filter}
              className={`rounded-full px-6 py-2 ${idx === 0 ? "bg-primary-container" : "bg-surface-container-highest"}`}
            >
              <Text className={`text-sm font-bold ${idx === 0 ? "text-on-primary-container" : "text-on-surface-variant"}`}>{filter}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View className="gap-6 px-6 pt-4">
          {properties.map((property) => (
            <Pressable
              key={property.id}
              className="overflow-hidden rounded-xl bg-surface-container-lowest"
              onPress={() => router.push(`/property/${property.id}` as never)}
            >
              <View className="relative h-64">
                <Image source={{ uri: property.image }} className="h-full w-full" />
                <View className="absolute left-4 top-4 rounded-full px-3 py-1" style={{ backgroundColor: property.statusBg }}>
                  <Text className="text-[10px] font-black uppercase tracking-[1.5px] text-on-primary-container">{property.status}</Text>
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
                      <Text className="text-sm text-on-surface-variant">{property.location}</Text>
                    </View>
                  </View>
                  <View>
                    <Text className="text-right text-2xl font-black tracking-tight text-primary">{property.price}</Text>
                    <Text className="text-right text-[10px] font-bold uppercase tracking-[1.5px] text-outline">{property.unit}</Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-6 border-t border-surface-container-low pt-3">
                  {property.specs.map((spec) => (
                    <Text key={spec} className="text-sm font-bold text-on-surface">
                      {spec}
                    </Text>
                  ))}
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <Pressable
        className="absolute bottom-28 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary"
        onPress={() => router.push("/(tabs)/add-property") as never}
      >
        <MaterialIcons name="add" size={30} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}
