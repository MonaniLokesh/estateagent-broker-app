import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { BlurTargetView } from "expo-blur";
import { AddPropertyOverlayProvider, useAddPropertyOverlay } from "@/lib/addPropertyOverlay";
import { AddPropertyOverlay } from "@/components/AddPropertyOverlay";
import "../global.css";

function StackWithOverlay() {
  const { blurTargetRef } = useAddPropertyOverlay();
  return (
    <>
      <BlurTargetView ref={blurTargetRef} collapsable={false} style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="property/[id]" />
          <Stack.Screen name="login" />
        </Stack>
      </BlurTargetView>
      <AddPropertyOverlay />
    </>
  );
}

export default function RootLayout() {
  return (
    <AddPropertyOverlayProvider>
      <StatusBar style="dark" />
      <StackWithOverlay />
    </AddPropertyOverlayProvider>
  );
}
