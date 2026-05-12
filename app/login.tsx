import { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { login } from "@/lib/auth";
import { ApiError } from "@/lib/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace("/(tabs)");
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Sign in failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1 justify-center px-6">
        <Text className="mb-2 text-3xl font-black text-on-surface">Broker sign in</Text>
        <Text className="mb-8 text-sm text-outline">Use your backend credentials.</Text>

        {error ? (
          <View className="mb-4 rounded-xl bg-error-container px-4 py-3">
            <Text className="text-sm text-on-error-container">{error}</Text>
          </View>
        ) : null}

        <Text className="mb-1 text-[11px] font-bold uppercase tracking-[2px] text-outline">Email</Text>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@example.com"
          placeholderTextColor="#8a9b92"
          className="mb-4 rounded-xl bg-surface-container-low px-4 py-4 text-on-surface"
          value={email}
          onChangeText={setEmail}
        />

        <Text className="mb-1 text-[11px] font-bold uppercase tracking-[2px] text-outline">Password</Text>
        <TextInput
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor="#8a9b92"
          className="mb-6 rounded-xl bg-surface-container-low px-4 py-4 text-on-surface"
          value={password}
          onChangeText={setPassword}
        />

        <Pressable
          className="items-center rounded-xl bg-primary py-4"
          onPress={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="font-black text-white">Sign in</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
