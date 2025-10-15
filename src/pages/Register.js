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
import { Picker } from "@react-native-picker/picker";

export default function Register({ navigation }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    sexo: "Hombre",
    is_trainer: false,
    trainerCode: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      setErrorMsg("Por favor completa todos los campos");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      if (form.is_trainer) {
        const code = (form.trainerCode || "").trim().toUpperCase();
        if (code !== "TENAXTRAINER") {
          setErrorMsg("Código de entrenador incorrecto");
          setLoading(false);
          return;
        }
      }

      const hashedPassword = await bcrypt.hash(form.password, 10);

      const { data, error } = await supabase
        .from("profiles")
        .insert({
          name: form.name,
          email: form.email,
          password: hashedPassword,
          is_trainer: form.is_trainer,
          sexo: form.sexo,
        })
        .select();

      if (error) throw error;

      await AsyncStorage.setItem(
        "userProfile",
        JSON.stringify({
          id: data[0].id,
          name: form.name,
          email: form.email,
          is_trainer: form.is_trainer,
          sexo: form.sexo,
        })
      );

      navigation.replace(
        form.is_trainer ? "TrainerDashboard" : "ClientDashboard"
      );
    } catch (err) {
      setErrorMsg(err.message || "Error al registrar");
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
                Crear cuenta
              </Text>

              {errorMsg ? (
                <Animated.View entering={FadeInUp.duration(300)}>
                  <Text className="text-red-400 text-sm font-medium mb-4">
                    {errorMsg}
                  </Text>
                </Animated.View>
              ) : null}

              <View className="space-y-4">
                <View className="mb-4">
                  <Text className="mb-2 text-sm font-semibold text-gray-100">
                    Nombre
                  </Text>
                  <TextInput
                    value={form.name}
                    onChangeText={(text) => setForm({ ...form, name: text })}
                    placeholder="Tu nombre"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="words"
                    className="bg-gray-900 border border-gray-600 text-white rounded-lg p-3"
                  />
                </View>

                <View className="mb-4">
                  <Text className="mb-2 text-sm font-semibold text-gray-100">
                    Sexo
                  </Text>
                  <View className="bg-gray-900 border border-gray-600 rounded-lg overflow-hidden">
                    <Picker
                      selectedValue={form.sexo}
                      onValueChange={(value) =>
                        setForm({ ...form, sexo: value })
                      }
                      style={{ color: "white" }}
                    >
                      <Picker.Item label="Hombre" value="Hombre" />
                      <Picker.Item label="Mujer" value="Mujer" />
                    </Picker>
                  </View>
                </View>

                <View className="mb-4">
                  <Text className="mb-2 text-sm font-semibold text-gray-100">
                    Correo electrónico
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

                <View className="mb-4">
                  <Text className="mb-2 text-sm font-semibold text-gray-100">
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
                  onPress={() =>
                    setForm({
                      ...form,
                      is_trainer: !form.is_trainer,
                      trainerCode: !form.is_trainer ? form.trainerCode : "",
                    })
                  }
                  className="flex-row items-center mb-4"
                >
                  <View
                    className={`w-5 h-5 border-2 rounded mr-2 items-center justify-center ${
                      form.is_trainer
                        ? "bg-blue-600 border-blue-600"
                        : "border-gray-600"
                    }`}
                  >
                    {form.is_trainer && (
                      <Text className="text-white text-xs">✓</Text>
                    )}
                  </View>
                  <Text className="text-sm font-semibold text-gray-100">
                    Soy entrenador
                  </Text>
                </TouchableOpacity>

                {form.is_trainer && (
                  <Animated.View
                    entering={FadeInUp.duration(400)}
                    className="mb-4"
                  >
                    <Text className="mb-2 text-sm font-semibold text-gray-100">
                      Código de entrenador
                    </Text>
                    <TextInput
                      value={form.trainerCode}
                      onChangeText={(text) =>
                        setForm({ ...form, trainerCode: text })
                      }
                      placeholder="Introduce el código"
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="characters"
                      className="bg-gray-900 border border-gray-600 text-white rounded-lg p-3"
                    />
                    <Text className="text-sm text-gray-300 mt-1">
                      Introduce el código secreto para entrenadores
                    </Text>
                  </Animated.View>
                )}

                <TouchableOpacity
                  onPress={handleRegister}
                  disabled={loading}
                  className={`bg-blue-600 rounded-lg p-4 mt-4 ${
                    loading ? "opacity-50" : ""
                  }`}
                >
                  <Text className="text-white text-center font-semibold text-lg">
                    {loading ? "Registrando..." : "Regístrate"}
                  </Text>
                </TouchableOpacity>

                <View className="flex-row justify-center mt-4">
                  <Text className="text-sm text-gray-100">
                    ¿Ya tienes cuenta?{" "}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Login")}
                  >
                    <Text className="text-sm font-medium text-blue-400">
                      Inicia sesión
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
