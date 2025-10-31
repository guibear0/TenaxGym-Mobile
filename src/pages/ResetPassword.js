import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import bcrypt from "bcryptjs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";

export default function ResetPassword({ route, navigation }) {
  const { email } = route.params || {};
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!code.trim() || !password.trim() || !confirm.trim()) {
      setMsg("Por favor completa todos los campos");
      return;
    }

    if (password !== confirm) {
      setMsg("Las contraseñas no coinciden");
      return;
    }

    setMsg("");
    setLoading(true);

    try {
      // Buscar usuario válido
      const { data: user, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .eq("reset_token", code.trim())
        .single();

      if (error || !user) {
        setMsg("Código incorrecto o correo no válido");
        setLoading(false);
        return;
      }

      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Actualizar en la base de datos
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          password: hashedPassword,
          reset_token: null,
          reset_token_expiry: null,
        })
        .eq("email", email);

      if (updateError) {
        setMsg("Error al actualizar contraseña");
        setLoading(false);
        return;
      }

      // Guardar sesión local
      await AsyncStorage.setItem("userProfile", JSON.stringify(user));

      setMsg("✅ Contraseña actualizada correctamente. Iniciando sesión...");
      setTimeout(() => {
        if (user.is_trainer) {
          navigation.replace("TrainerDashboard");
        } else {
          navigation.replace("ClientDashboard");
        }
      }, 2000);
    } catch (err) {
      console.error("Error al restablecer contraseña:", err);
      setMsg("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#1a1a1a", "#1e40af", "#4f46e5"]}
      className="flex-1 justify-center px-6 py-8"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center"
      >
        <Animated.View
          entering={FadeInDown.duration(800)}
          className="w-full max-w-md mx-auto"
        >
          <Text className="text-2xl font-bold text-center text-gray-100 mb-6">
            Restablecer contraseña
          </Text>

          <View className="bg-gray-800/80 rounded-2xl border border-gray-700/50 p-6">
            {msg ? (
              <Animated.View entering={FadeInUp.duration(300)}>
                <Text
                  className={`${
                    msg.includes("✅") ? "text-green-400" : "text-red-400"
                  } text-sm font-medium mb-4 text-center`}
                >
                  {msg}
                </Text>
              </Animated.View>
            ) : null}

            <Text className="text-gray-300 text-center mb-4">
              {email || "Correo no especificado"}
            </Text>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-semibold text-gray-100">
                Código recibido
              </Text>
              <TextInput
                value={code}
                onChangeText={(text) => setCode(text.toUpperCase())}
                placeholder="Introduce el código"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="characters"
                className="bg-gray-900 border border-gray-600 text-white rounded-lg p-3"
              />
            </View>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-semibold text-gray-100">
                Nueva contraseña
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                className="bg-gray-900 border border-gray-600 text-white rounded-lg p-3"
              />
            </View>

            <View className="mb-6">
              <Text className="mb-2 text-sm font-semibold text-gray-100">
                Confirmar contraseña
              </Text>
              <TextInput
                value={confirm}
                onChangeText={setConfirm}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                className="bg-gray-900 border border-gray-600 text-white rounded-lg p-3"
              />
            </View>

            <TouchableOpacity
              onPress={handleReset}
              disabled={loading}
              className={`bg-blue-600 rounded-lg p-4 ${
                loading ? "opacity-50" : ""
              }`}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-center font-semibold text-lg">
                  Guardar nueva contraseña
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
