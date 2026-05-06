import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="add-property"
          options={{
            presentation: "transparentModal",
            animation: "fade",
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
        <Stack.Screen name="property/[id]" />
        <Stack.Screen name="login" />
      </Stack>
    </>
  );
}
