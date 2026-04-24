import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, ScrollView, Text, View } from "react-native";

const leadStats = [
  { label: "New Enquiries", value: "12" },
  { label: "Site Visits", value: "5" },
  { label: "Negotiations", value: "3" },
];

const leads = [
  {
    id: "LD-204",
    name: "Rohit Mehra",
    property: "Suncity Platinum Towers",
    budget: "INR 4.2 - 4.8 Cr",
    stage: "HOT LEAD",
    stageStyle: "bg-tertiary-container text-on-tertiary-container",
    nextAction: "Site visit tomorrow, 11:00 AM",
  },
  {
    id: "LD-198",
    name: "Neha Kapoor",
    property: "Greenwood Residency",
    budget: "INR 85 - 95 Lakhs",
    stage: "NEGOTIATION",
    stageStyle: "bg-secondary-container text-on-secondary-container",
    nextAction: "Send revised offer deck",
  },
  {
    id: "LD-191",
    name: "Arjun Bansal",
    property: "Oakwood Estate",
    budget: "INR 2.0 - 2.3 Cr",
    stage: "FOLLOW UP",
    stageStyle: "bg-surface-container-highest text-on-surface",
    nextAction: "Call back after 6:30 PM",
  },
];

export default function LeadsScreen() {
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

          <View className="mb-8 flex-row gap-3">
            {leadStats.map((item) => (
              <View key={item.label} className="flex-1 rounded-xl bg-surface-container-lowest p-4">
                <Text className="text-[10px] font-black uppercase tracking-[1.2px] text-outline">{item.label}</Text>
                <Text className="mt-1 text-3xl font-black text-on-surface">{item.value}</Text>
              </View>
            ))}
          </View>

          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-on-surface">Priority Leads</Text>
            <Pressable>
              <Text className="text-xs font-black uppercase tracking-[1.5px] text-primary">View All</Text>
            </Pressable>
          </View>

          <View className="gap-4">
            {leads.map((lead) => (
              <View key={lead.id} className="rounded-xl bg-surface-container-lowest p-5">
                <View className="mb-3 flex-row items-start justify-between">
                  <View>
                    <Text className="text-lg font-bold text-on-surface">{lead.name}</Text>
                    <Text className="text-sm text-on-surface-variant">{lead.property}</Text>
                  </View>
                  <View className={`rounded-full px-3 py-1 ${lead.stageStyle}`}>
                    <Text className="text-[10px] font-black tracking-[1.2px]">{lead.stage}</Text>
                  </View>
                </View>

                <View className="mb-4 rounded-lg bg-surface-container-low p-3">
                  <Text className="text-[10px] font-black uppercase tracking-[1.2px] text-outline">Budget</Text>
                  <Text className="mt-1 text-base font-bold text-on-surface">{lead.budget}</Text>
                </View>

                <View className="mb-4 flex-row items-start gap-2">
                  <MaterialIcons name="event" size={16} color="#6c7a71" />
                  <Text className="flex-1 text-sm text-on-surface-variant">{lead.nextAction}</Text>
                </View>

                <View className="flex-row gap-2">
                  <Pressable className="flex-1 items-center rounded-xl bg-surface-container-high py-3">
                    <Text className="text-xs font-black uppercase tracking-[1.2px] text-primary">Call</Text>
                  </Pressable>
                  <Pressable className="flex-1 items-center rounded-xl bg-primary py-3">
                    <Text className="text-xs font-black uppercase tracking-[1.2px] text-white">WhatsApp</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
