import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInUp } from "react-native-reanimated";
import { ArrowLeft, User, LogOut } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";
import bcrypt from "bcryptjs";
import AuthInput from "../components/ui/AuthInput";

export default function Profile({ navigation }) {
  const [userProfile, setUserProfile] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await AsyncStorage.getItem("userProfile");
      if (profile) {
        const user = JSON.parse(profile);
        setUserProfile(user);
        setEmail(user.email);
        setPassword(user.password || "");
      }
    } catch (err) {
      console.error("Error cargando perfil:", err);
    }
  };

  const handleEmailChange = async (newEmail) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ email: newEmail })
        .eq("id", userProfile.id);

      if (error) throw error;

      const updatedProfile = { ...userProfile, email: newEmail };
      await AsyncStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      setUserProfile(updatedProfile);
      setEmail(newEmail);
      setEditingField(null);
      Alert.alert("Éxito", "Correo actualizado");
    } catch (err) {
      Alert.alert("Error", err.message || "No se pudo actualizar el correo");
    }
  };

  const handlePasswordChange = async (newPassword) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      const { error } = await supabase
        .from("profiles")
        .update({ password: hashedPassword })
        .eq("id", userProfile.id);

      if (error) throw error;

      setPassword(newPassword);
      setEditingField(null);
      Alert.alert("Éxito", "Contraseña actualizada");
    } catch (err) {
      Alert.alert(
        "Error",
        err.message || "No se pudo actualizar la contraseña"
      );
    }
  };

  const handleLogout = async () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro?", [
      { text: "Cancelar", onPress: () => {} },
      {
        text: "Cerrar sesión",
        onPress: async () => {
          await AsyncStorage.removeItem("userProfile");
          navigation.navigate("Home");
        },
      },
    ]);
  };

  return (
    <LinearGradient
      colors={["#1a1a1a", "#1e40af", "#4f46e5"]}
      className="flex-1"
    >
      <ScrollView className="flex-1 p-6">
        {/* Card Perfil */}
        {userProfile ? (
          <Animated.View entering={FadeInUp.duration(400).delay(100)}>
            {/* Nombre (solo lectura) */}
            <View className="bg-blue-900/40 rounded-2xl border border-gray-600/50 p-6 mb-6">
              <View className="flex-row items-center">
                <View className="w-16 h-16 rounded-full bg-blue-600 justify-center items-center">
                  <User size={32} color="#fff" />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-2xl font-bold text-white">
                    {userProfile.name}
                  </Text>
                  <Text className="text-gray-400 text-sm">Cliente</Text>
                </View>
              </View>
            </View>

            {/* Email editable */}
            <AuthInput
              label="Correo"
              value={email}
              onChangeText={setEmail}
              isEditing={editingField === "email"}
              onEditPress={() => setEditingField("email")}
              onConfirmPress={handleEmailChange}
              onCancelPress={() => setEditingField(null)}
              type="email"
            />

            {/* Password editable */}
            <AuthInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              isPassword={true}
              isEditing={editingField === "password"}
              onEditPress={() => setEditingField("password")}
              onConfirmPress={handlePasswordChange}
              onCancelPress={() => setEditingField(null)}
              type="password"
            />

            {/* Botón Logout */}
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red-900/40 rounded-lg p-4 flex-row items-center justify-center gap-2 mt-8"
            >
              <LogOut size={20} color="#ef4444" />
              <Text className="text-red-400 font-semibold text-base">
                Cerrar sesión
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <Text className="text-gray-300">Cargando perfil...</Text>
        )}
      </ScrollView>
    </LinearGradient>
  );
}
