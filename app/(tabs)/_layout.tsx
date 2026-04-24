import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const tint = "#10B981";
const idle = "#94a3b8";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 84,
          paddingTop: 10,
          paddingBottom: 20,
          borderTopWidth: 0,
          backgroundColor: "rgba(255,255,255,0.94)",
          position: "absolute",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        },
        tabBarActiveTintColor: tint,
        tabBarInactiveTintColor: idle,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "800",
          textTransform: "uppercase",
          letterSpacing: 1,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="dashboard" size={22} color={color} style={{ opacity: focused ? 1 : 0.9 }} />
          ),
        }}
      />
      <Tabs.Screen
        name="properties"
        options={{
          title: "Inventory",
          tabBarIcon: ({ color }) => <MaterialIcons name="domain" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="leads"
        options={{
          title: "Leads",
          tabBarIcon: ({ color }) => <MaterialIcons name="groups" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-property"
        options={{
          title: "Add",
          href: null,
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color }) => <MaterialIcons name="add-circle" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
