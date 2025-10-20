import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Eye, EyeOff } from "lucide-react-native";
import "../lib/crypto-setup";
import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import bcrypt from "bcryptjs";

export default function Login({ navigation }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const trimmedEmail = (form.email || "").trim();
    const trimmedPassword = (form.password || "").trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMsg("Por favor completa todos los campos");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", trimmedEmail)
        .single();

      if (error || !data) {
        setErrorMsg("Usuario o contraseña incorrectos");
        setLoading(false);
        return;
      }

      const match = await bcrypt.compare(trimmedPassword, data.password);
      if (!match) {
        setErrorMsg("Usuario o contraseña incorrectos");
        setLoading(false);
        return;
      }

      await AsyncStorage.setItem("userProfile", JSON.stringify(data));
      navigation.replace("ClientDashboard");
    } catch (err) {
      console.error("Error en login:", err);
      setErrorMsg(err.message || "Error al iniciar sesión");
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#1a1a1a", "#1e40af", "#4f46e5"]}
      className="flex-1"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            entering={FadeInDown.duration(800)}
            className="w-full max-w-md mx-auto"
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mb-6"
            >
              <Text className="text-2xl font-bold text-gray-100 text-center">
                TENAX GYM
              </Text>
            </TouchableOpacity>

            <View className="bg-gray-800/80 rounded-2xl border border-gray-700/50 p-6">
              <Text className="text-2xl font-bold text-gray-100 mb-4">
                Inicia sesión
              </Text>

              {errorMsg ? (
                <Animated.View entering={FadeInUp.duration(300)}>
                  <Text className="text-red-400 text-sm font-medium mb-4">
                    {errorMsg}
                  </Text>
                </Animated.View>
              ) : null}

              {/* Email */}
              <View className="mb-4">
                <Text className="block mb-2 text-sm font-semibold text-gray-100">
                  Correo
                </Text>
                <TextInput
                  value={form.email}
                  onChangeText={(text) => setForm({ ...form, email: text })}
                  placeholder="tucorreo@correo.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  className="bg-gray-900 border border-gray-600 text-white rounded-lg p-3"
                />
              </View>

              {/* Contraseña con ojo */}
              <View className="mb-6">
                <Text className="block mb-2 text-sm font-semibold text-gray-100">
                  Contraseña
                </Text>
                <View className="relative">
                  <TextInput
                    value={form.password}
                    onChangeText={(text) =>
                      setForm({ ...form, password: text })
                    }
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    className="bg-gray-900 border border-gray-600 text-white rounded-lg p-3 pr-12"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#9ca3af" />
                    ) : (
                      <Eye size={20} color="#9ca3af" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                className={`bg-blue-600 rounded-lg p-4 ${loading ? "opacity-50" : ""}`}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Text>
              </TouchableOpacity>

              <View className="flex-row justify-center mt-4">
                <Text className="text-sm text-gray-100">
                  ¿No tienes cuenta?{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Register")}
                >
                  <Text className="text-sm font-medium text-blue-400">
                    Regístrate
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
