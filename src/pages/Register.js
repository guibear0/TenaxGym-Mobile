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
import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import bcrypt from "bcryptjs";

export default function Register({ navigation }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    sexo: "Hombre",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedPassword = form.password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      setErrorMsg("Por favor completa todos los campos");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      // Verificar si el correo ya existe
      const { data: existingUser, error: fetchError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", trimmedEmail)
        .single();

      if (existingUser) {
        setErrorMsg("Esta cuenta ya está en uso. Inicia sesión.");
        setLoading(false);
        return;
      }

      if (fetchError && fetchError.code !== "PGRST116") {
        // Si el error no es "no rows found"
        throw fetchError;
      }

      // Generar salt y hashear contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(trimmedPassword, salt);

      const { data, error } = await supabase
        .from("profiles")
        .insert({
          name: trimmedName,
          email: trimmedEmail,
          password: hashedPassword,
          is_trainer: false,
          sexo: form.sexo,
        })
        .select();

      if (error) {
        setErrorMsg(error.message || "Error al registrar la cuenta");
        setLoading(false);
        return;
      }

      const userId = data[0].id;

      // Verificar si el cliente ya existe
      const { data: existingClient } = await supabase
        .from("clientes")
        .select("id_cliente")
        .eq("id_cliente", userId)
        .single();

      // Solo insertar si no existe
      if (!existingClient) {
        const { error: clientError } = await supabase.from("clientes").insert({
          id_cliente: userId,
          trainer_id: null,
        });

        if (clientError) {
          setErrorMsg(
            clientError.message || "Error al crear perfil de cliente"
          );
          setLoading(false);
          return;
        }
      }

      await AsyncStorage.setItem(
        "userProfile",
        JSON.stringify({
          id: userId,
          name: trimmedName,
          email: trimmedEmail,
          is_trainer: false,
          sexo: form.sexo,
        })
      );

      navigation.replace("ClientDashboard");
    } catch (err) {
      console.error("Error en registro:", err);
      setErrorMsg(err.message || "Error al registrar");
    } finally {
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
                  <Text className="text-lg  text-gray-100">
                    ¿Ya tienes cuenta?{" "}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Login")}
                  >
                    <Text className="text-lg font-medium text-blue-400">
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
