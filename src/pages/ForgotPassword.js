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
import emailjs from "@emailjs/react-native";
import { supabase } from "../lib/supabase";

function generateResetCode() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let code = "";
  for (let i = 0; i < 3; i++)
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  for (let i = 0; i < 3; i++)
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  return code;
}

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRecover = async () => {
    if (!email.trim()) {
      setMsg("Por favor ingresa tu correo electrónico");
      return;
    }

    setMsg("");
    setLoading(true);

    try {
      // Verificar si el usuario existe
      const { data: user, error } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("email", email.trim())
        .single();

      if (error || !user) {
        setMsg("❌ El correo electrónico no está registrado.");
        setLoading(false);
        return;
      }

      // Generar y guardar código
      const resetCode = generateResetCode();
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ reset_token: resetCode })
        .eq("email", email.trim());

      if (updateError) {
        setMsg("❌ Error guardando código en la base de datos.");
        setLoading(false);
        return;
      }

      // Enviar email con EmailJS (SDK nativo)
      await emailjs.send(
        "service_ntzqsbc", // ID de tu servicio
        "template_qadxe77", // ID de tu plantilla
        {
          email: email.trim(),
          reset_code: resetCode,
        },
        {
          publicKey: "iZi8bO391P5WcW5I9", // Tu public key
        }
      );

      setMsg("✅ Código enviado a tu correo. Redirigiendo...");
      setTimeout(() => {
        navigation.navigate("ResetPassword", { email });
      }, 3000);
    } catch (err) {
      console.error("EmailJS Error:", err);
      setMsg("❌ Error enviando correo: " + err.message);
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
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mb-6"
          >
            <Text className="text-2xl font-bold text-gray-100 text-center">
              Recuperar contraseña
            </Text>
          </TouchableOpacity>

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

            <Text className="mb-2 text-sm font-semibold text-gray-100">
              Correo electrónico
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="tucorreo@correo.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-gray-900 border border-gray-600 text-white rounded-lg p-3 mb-6"
            />

            <TouchableOpacity
              onPress={handleRecover}
              disabled={loading}
              className={`bg-blue-600 rounded-lg p-4 ${
                loading ? "opacity-50" : ""
              }`}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-center font-semibold text-lg">
                  Enviar código
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
