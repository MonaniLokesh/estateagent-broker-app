import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";

const gallery = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAFDYhj8P0gP7g0N-05z9zApFseeh3vfos3m0UaA5VepD57fl6yC9EVqUEsWDvAa7ti1JY34IR4jc_dOwBq8DHSuIIOl85I8wLP9g6-17AyDAbprcitmHK2vcsjIcLzJhwdZfZiPtqppUZ0n2cXGtS95DTyk3Ry3lWsGIGLUhC8pvCAw4KPYIiG2ERZaZ9hZaWjRacLiqFyAGxwVvZEcamOQmjpKASDXSwBz_pdkWyFAk8hGDfRsiRgqINk54tduqVahZGGZezydPlr",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC7MOk1bDpeGK_iL-J8mFEQuvlYZcyrufZTsQwltlX_FUfY2yJjTvSe5G-lSSHSYsmBf7mhlXMHOlLgl2qE9uXpc29YzW8hfgt7Znl20K9roM_fJKdB0GcjJRNGbEcXrI0bJgEkIqNTJThle9yt0EEp1Or2Gr7kpyHcrti1DmLLhBR12TRzpSGl-BslzWaKG_CU_Yq09skFW37QGC6O4Eg6dgakhHocJbIpQXuKHxm1X47fH7bDuyaRnGSq_S861eJezwXc-SIX6ZJ3",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC9YcqutBafiMINgHP9zPt8JQL5mHpajGiXfu88hFJtX9qD6kkVAq-muB_WVqLRDZ0ntiLHBN6_-iq0XW-ZhINgvI5VsdVKbiksXCVz-ZUcNTt3-6f0lUXfokaXySDz2v_ytPMCf6sYO7R6NY5f1Jqdv7hq9WMoMBUyvkQEWjdtYqKrA3wvw1w3obTIfoZpO7ACiEu0Fxfsdtl7_yci7lLluH4xE1M0EJKNWKjMvajLlQh34pQQm7nx41eweMzjuhN_4vq7Lu3-YMlR",
];

const metrics = [
  ["Pricing", "INR 4.50", "Cr"],
  ["Configuration", "4", "BHK"],
  ["Total Area", "3,200", "Sq.Ft"],
  ["Floor", "18", "/ 24"],
];

const highlights = ["Vaastu Compliant", "Servant Room", "3 Parkings"];

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const propertyId = id ?? "1";

  const goBackOrInventory = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/(tabs)/properties");
  };

  const handleDeleteProperty = () => {
    Alert.alert("Delete Property", `Are you sure you want to delete Property #${propertyId}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => router.replace("/(tabs)/properties"),
      },
    ]);
  };

  const handleEditProperty = () => {
    router.push("/(tabs)/add-property");
  };

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

        <View className="mt-3 px-4">
          <View className="mb-4 flex-row gap-3">
            <View className="relative h-[280px] flex-1 overflow-hidden rounded-xl">
              <Image source={{ uri: gallery[0] }} className="h-full w-full" />
              <LinearGradient
                colors={["rgba(21,28,39,0)", "rgba(21,28,39,0.78)"]}
                start={{ x: 0.5, y: 0.3 }}
                end={{ x: 0.5, y: 1 }}
                className="absolute inset-0"
              />
              <View className="absolute bottom-3 left-3 flex-row items-center gap-1 rounded-full bg-black/35 px-3 py-1">
                <MaterialIcons name="photo-camera" size={11} color="#fff" />
                <Text className="text-[10px] font-medium text-white">2 / 12 Photos</Text>
              </View>
            </View>
            <View className="w-[32%] gap-3">
              <View className="h-[133px] overflow-hidden rounded-xl">
                <Image source={{ uri: gallery[1] }} className="h-full w-full" />
              </View>
              <View className="h-[133px] overflow-hidden rounded-xl">
                <Image source={{ uri: gallery[2] }} className="h-full w-full" />
                <View className="absolute inset-0 items-center justify-center bg-on-surface/45">
                  <Text className="text-xl font-black text-white">+9 View All</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className="px-4">
          <View className="mb-2 flex-row items-center gap-2">
            <Text className="rounded-full bg-secondary-container px-2.5 py-1 text-[9px] font-black uppercase tracking-[1.2px] text-on-secondary-container">
              Premium Listing
            </Text>
            <Text className="text-[9px] font-semibold uppercase tracking-[1px] text-outline">Listed 2 days ago</Text>
          </View>

          <Text className="text-[46px] font-black leading-[50px] text-on-surface">Suncity Platinum Towers</Text>
          <View className="mt-1 flex-row items-center gap-1">
            <MaterialIcons name="location-on" size={16} color="#6c7a71" />
            <Text className="text-sm text-outline">Golf Course Road, Gurgaon, Sector 54</Text>
          </View>

          <View className="mt-5 flex-row flex-wrap gap-3">
            {metrics.map(([label, value, unit]) => (
              <View key={label} className="min-w-[47%] flex-1 rounded-xl bg-surface-container-low p-4">
                <Text className="text-[10px] font-black uppercase tracking-[1.4px] text-outline">{label}</Text>
                <View className="mt-1 flex-row items-end gap-1">
                  <Text className="text-[24px] font-black leading-[28px] text-on-surface">{value}</Text>
                  <Text className="pb-[2px] text-xs font-black uppercase text-primary">{unit}</Text>
                </View>
              </View>
            ))}
          </View>

          <View className="mt-5 rounded-xl bg-surface-container-lowest p-5">
            <Text className="mb-4 text-[10px] font-black uppercase tracking-[1.7px] text-outline">Property Overview</Text>
            <Text className="leading-6 text-on-surface-variant">
              This ultraluxury penthouse at Suncity Platinum Towers defines the pinnacle of urban living. Boasting floor-to-ceiling glass
              walls, this residence offers panoramic views of the Aravalli range and the Gurgaon skyline.
            </Text>
            <Text className="mt-3 leading-6 text-on-surface-variant">
              Designed with an editorial eye, the interiors feature Italian marble flooring, a bespoke modular kitchen with high-end
              appliances, and automated smart home systems. The expansive wrap-around balcony serves as a private oasis in the sky.
            </Text>

            <View className="mt-4 flex-row flex-wrap gap-2">
              {highlights.map((item) => (
                <View key={item} className="rounded-full bg-surface-container-low px-3 py-2">
                  <Text className="text-[10px] font-semibold text-on-surface-variant">{item}</Text>
                </View>
              ))}
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
              <Text className="mt-2 rounded-lg bg-white px-3 py-1 text-xs font-bold text-on-surface">Platinum Towers</Text>
            </View>
          </View>

          <View className="mt-5 rounded-xl bg-surface-container-low p-5">
            <Text className="text-[10px] font-black uppercase tracking-[1.5px] text-outline">Commission Forecast</Text>
            <View className="mt-4 flex-row items-center gap-3">
              <View className="h-16 w-16 items-center justify-center rounded-full border-[5px] border-surface-variant">
                <View className="h-14 w-14 items-center justify-center rounded-full border-[5px] border-primary/70">
                  <Text className="text-[10px] font-bold text-on-surface">2.5%</Text>
                </View>
              </View>
              <View>
                <Text className="text-[26px] font-black leading-[30px] text-on-surface">INR 11.25 L</Text>
                <Text className="text-[10px] font-semibold uppercase tracking-[1.2px] text-outline">Expected Brokerage</Text>
              </View>
            </View>
          </View>

          <View className="mt-4 rounded-xl bg-surface-container-lowest p-5">
            <Text className="mb-4 text-[10px] font-black uppercase tracking-[1.5px] text-outline">Owner Identity</Text>
            <View className="mb-4 flex-row items-center gap-3">
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkp6FxXQkjW2tK9t3AYcIou_JXPFihnTVdHEM0DZpknRDJCO7MPN22Ngr4WzxWcCvXjtVq4uRnRUdDThoLDfKz3CW4FCOssy0ysVGq-ruIzcQxCeq_Kc2gHjJ7T8-bvcwUKZoegjbj4T8KEjsCd7qgNqUOF1TTav1UJzZS-SFXO4QAv7M3T51XQg0c3AzyRyz13ka42jrhYjYPdjZugS0FPgdicB3z4TaXk4IOS_s8k7C7UUFI6_tLgzLNgA_inwvcbFG8QhC3iaLz",
                }}
                className="h-11 w-11 rounded-full"
              />
              <View>
                <Text className="text-sm font-bold text-on-surface">Vikram Singh Rathore</Text>
                <Text className="text-xs text-outline">HNI Investor</Text>
              </View>
            </View>
            <View className="gap-2">
              <Pressable className="flex-row items-center justify-center gap-2 rounded-xl bg-surface-container-high py-3">
                <MaterialIcons name="call" size={16} color="#006c49" />
                <Text className="text-[11px] font-black uppercase tracking-[1.2px] text-primary">Call Owner</Text>
              </Pressable>
              <Pressable className="flex-row items-center justify-center gap-2 rounded-xl bg-surface-container-high py-3">
                <MaterialIcons name="chat-bubble" size={16} color="#006c49" />
                <Text className="text-[11px] font-black uppercase tracking-[1.2px] text-primary">WhatsApp</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 w-full bg-white/95 px-4 pb-6 pt-3">
        <View className="flex-row gap-3">
          <Pressable className="flex-1 items-center justify-center rounded-xl bg-surface-container-high py-3.5" onPress={handleDeleteProperty}>
            <Text className="text-[11px] font-black uppercase tracking-[1.2px] text-on-surface">Delete Property</Text>
          </Pressable>
          <Pressable className="flex-1 overflow-hidden rounded-xl" onPress={handleEditProperty}>
            <LinearGradient colors={["#006c49", "#10b981"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="items-center py-3.5">
              <Text className="text-[11px] font-black uppercase tracking-[1.2px] text-white">Edit Property</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
