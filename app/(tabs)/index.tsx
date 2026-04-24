import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

const recentProperties = [
  {
    id: "1",
    label: "Luxury Villa",
    price: "INR 4.50",
    unit: "Cr",
    title: "Suncity Platinum Towers",
    location: "Sector 54, Gurgaon",
    tagBg: "#10b981",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCj_BNMidUe4j4NeFLYJZRhGYIJ4WyzpKykOK7sPUwjTk6FT87daXqV9ePvWPaNl2QJHjGQLGlP2Ix1IOljXv9VqZ9a2Lbhke9zGpdU2vCsTvionsdTEzQ3IDiGfCMSf-Jx1QudVvLybUNhv-YWBVl4qkOLp_rqeGqGMgIqUZVw4U673FILeOspB6zobSBqxxk7FcI7AMgT7oVP9tgX5RBOhhaKzhI_Kefu09XRhwK49oTNN_3f0x_IdXQFK5X1JdqDQpXWRdTC-Xhj",
  },
  {
    id: "2",
    label: "Apartment",
    price: "INR 85.00",
    unit: "Lakhs",
    title: "Greenwood Residency",
    location: "Whitefield, Bangalore",
    tagBg: "#b7ebce",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCSdzDVWCnp-9C6T5-C9F0QQqfCVgWN0umDCQ55faU6SsO4qcbzd-sQsQjAbxz8K2j2XVnan8WBrHybH9D7Kq5Qm66tHxgSqeF8vqe9IgynbBrfarrvwTilMmwI1VNmHXBXLXZ3GuxAhi1FHS3aL5OUN4t-bAbG8DfTFOzIp2zXdpULryiC2ZbYX30rIcmFiupoGUrhCy0KFAmZwOwLij61K4q-s0ae8KjMlX_NtI1wIaDgQzoY9-bq-qWRx4UFt3wSnqkpOm0dbFcu",
  },
  {
    id: "3",
    label: "Bungalow",
    price: "INR 2.10",
    unit: "Cr",
    title: "Oakwood Estate",
    location: "Bandra West, Mumbai",
    tagBg: "#fc7c78",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDoq5dsZMvnyMJUQfAm1U6l47HVW_Le92NnH8BFVrhSLGyXUhbrxTDqc-HlGVMFe2WSJm4GZXj7Lwq06_zQx6pj3Y4a179J41PpQbI9ma3Weu1vzUDEdpYrQHO7nNd2KtvqZcXOva1ACvPgAj-EMYy8Du6fqJmb1NMQrd3VFnErIeKl-zipyPlj2nqJiqLuI8gxadNAp2VioVpd62zUKsmT_Oa6T7cH2ZTwnB_ZZPvtBm2LEJSjkVR4aXsTxoS2xME83TsykZBEKfxY",
  },
];

export default function DashboardScreen() {
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

          <View className="mb-8 flex-row gap-4">
            <View className="flex-1 rounded-xl bg-surface-container-lowest p-5">
              <MaterialIcons name="domain" size={24} color="#006c49" />
              <Text className="mt-5 text-[11px] font-extrabold uppercase tracking-[2px] text-outline">Total Properties</Text>
              <Text className="mt-1 text-4xl font-black text-on-surface">24</Text>
            </View>
            <View className="flex-1 rounded-xl bg-surface-container-low p-5">
              <MaterialIcons name="analytics" size={24} color="#006c49" />
              <Text className="mt-5 text-[11px] font-extrabold uppercase tracking-[2px] text-outline">Active Listings</Text>
              <Text className="mt-1 text-4xl font-black text-on-surface">18</Text>
            </View>
          </View>

          <Pressable className="mb-10" onPress={() => router.push("/(tabs)/add-property") as never}>
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
              <Text className="text-xs text-outline">Fresh listings added this week</Text>
            </View>
            <Pressable onPress={() => router.push("/(tabs)/properties") as never}>
              <Text className="text-xs font-extrabold uppercase tracking-[2px] text-primary">View All</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 18 }}>
          {recentProperties.map((property) => (
            <Pressable
              key={property.id}
              className="w-[280px]"
              onPress={() => router.push(`/property/${property.id}` as never)}
            >
              <View className="relative mb-4 h-[360px] overflow-hidden rounded-xl">
                <Image source={{ uri: property.image }} className="h-full w-full" />
                <LinearGradient
                  colors={["rgba(21,28,39,0)", "rgba(21,28,39,0.8)"]}
                  start={{ x: 0.5, y: 0.2 }}
                  end={{ x: 0.5, y: 1 }}
                  className="absolute inset-0"
                />
                <View className="absolute bottom-4 left-4 right-4">
                  <View className="mb-2 self-start rounded-full px-3 py-1" style={{ backgroundColor: property.tagBg }}>
                    <Text className="text-[10px] font-black uppercase tracking-[1.6px] text-on-primary-container">{property.label}</Text>
                  </View>
                  <View className="flex-row items-end gap-1">
                    <Text className="text-2xl font-black text-white">{property.price}</Text>
                    <Text className="pb-1 text-xs font-semibold text-white/80">{property.unit}</Text>
                  </View>
                </View>
              </View>
              <Text className="mb-1 text-lg font-bold text-on-surface">{property.title}</Text>
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="location-on" size={14} color="#6c7a71" />
                <Text className="text-xs text-outline">{property.location}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}
