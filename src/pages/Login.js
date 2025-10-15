import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { supabase } from "../lib/supabase";
import bcrypt from "bcryptjs";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login({ navigation }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setErrorMsg("Por favor completa todos los campos");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", form.email)
        .single();

      if (error || !data) {
        setErrorMsg("Usuario o contraseña incorrectos");
        setLoading(false);
        return;
      }

      const match = await bcrypt.compare(form.password, data.password);
      if (!match) {
        setErrorMsg("Usuario o contraseña incorrectos");
        setLoading(false);
        return;
      }

      await AsyncStorage.setItem("userProfile", JSON.stringify(data));

      navigation.replace(
        data.is_trainer ? "TrainerDashboard" : "ClientDashboard"
      );
    } catch (err) {
      setErrorMsg(err.message);
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

            <View className="bg-gray-800/80 rounded-2xl border border-gray-700/50 p-6 space-y-4">
              <Text className="text-2xl font-bold text-gray-100 mb-2">
                Inicia sesión en tu cuenta
              </Text>

              {errorMsg ? (
                <Animated.View entering={FadeInUp.duration(300)}>
                  <Text className="text-red-400 text-sm font-medium">
                    {errorMsg}
                  </Text>
                </Animated.View>
              ) : null}

              <View className="space-y-4">
                <View>
                  <Text className="block mb-2 text-sm font-semibold text-gray-100">
                    Tu correo
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

                <View>
                  <Text className="block mb-2 text-sm font-semibold text-gray-100">
                    Contraseña
                  </Text>
                  <TextInput
                    value={form.password}
                    onChangeText={(text) =>
                      setForm({ ...form, password: text })
                    }
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    autoCapitalize="none"
                    className="bg-gray-900 border border-gray-600 text-white rounded-lg p-3"
                  />
                </View>

                <TouchableOpacity
                  onPress={() => navigation.navigate("ForgotPassword")}
                >
                  <Text className="text-sm font-medium text-blue-400 text-right">
                    ¿Olvidaste tu contraseña?
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={loading}
                  className={`bg-blue-600 rounded-lg p-4 mt-4 ${
                    loading ? "opacity-50" : ""
                  }`}
                >
                  <Text className="text-white text-center font-semibold text-lg">
                    {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Text>
                </TouchableOpacity>

                <View className="flex-row justify-center mt-4">
                  <Text className="text-sm text-gray-100">
                    ¿No tienes cuenta aún?{" "}
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
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
