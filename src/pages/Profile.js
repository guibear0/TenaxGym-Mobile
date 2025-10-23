import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInUp } from "react-native-reanimated";
import {
  User,
  LogOut,
  Eye,
  EyeOff,
  Check,
  X,
  Edit2,
} from "lucide-react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";

import bcrypt from "bcryptjs";

export default function Profile({ navigation }) {
  const [userProfile, setUserProfile] = useState(null);
  const [editingField, setEditingField] = useState(null);

  // Estados para campos
  const [nombre, setNombre] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados temporales para edición
  const [tempNombre, setTempNombre] = useState("");
  const [tempAltura, setTempAltura] = useState("");
  const [tempPeso, setTempPeso] = useState("");
  const [tempEmail, setTempEmail] = useState("");

  // Visibilidad contraseñas
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await AsyncStorage.getItem("userProfile");
      if (profile) {
        const user = JSON.parse(profile);
        setUserProfile(user);
        setNombre(user.name || "");
        setEmail(user.email);
        setAltura(user.height?.toString() || "");
        setPeso(user.weight?.toString() || "");
      }
    } catch (err) {
      console.error("Error cargando perfil:", err);
    }
  };

  const handleNombreChange = async (newNombre) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ name: newNombre })
        .eq("id", userProfile.id);

      if (error) throw error;

      const updatedProfile = { ...userProfile, name: newNombre };
      await AsyncStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      setUserProfile(updatedProfile);
      setNombre(newNombre);
      setEditingField(null);
      Alert.alert("Éxito", "Nombre actualizado");
    } catch (err) {
      Alert.alert("Error", err.message || "No se pudo actualizar el nombre");
    }
  };

  const handleAlturaChange = async (newAltura) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ height: parseFloat(newAltura) })
        .eq("id", userProfile.id);

      if (error) throw error;

      const updatedProfile = { ...userProfile, altura: parseFloat(newAltura) };
      await AsyncStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      setUserProfile(updatedProfile);
      setAltura(newAltura);
      setEditingField(null);
      Alert.alert("Éxito", "Altura actualizada");
    } catch (err) {
      Alert.alert("Error", err.message || "No se pudo actualizar la altura");
    }
  };

  const handlePesoChange = async (newPeso) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ weight: parseFloat(newPeso) })
        .eq("id", userProfile.id);

      if (error) throw error;

      const updatedProfile = { ...userProfile, peso: parseFloat(newPeso) };
      await AsyncStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      setUserProfile(updatedProfile);
      setPeso(newPeso);
      setEditingField(null);
      Alert.alert("Éxito", "Peso actualizado");
    } catch (err) {
      Alert.alert("Error", err.message || "No se pudo actualizar el peso");
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

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      const { error } = await supabase
        .from("profiles")
        .update({ password: hashedPassword })
        .eq("id", userProfile.id);

      if (error) throw error;

      setNewPassword("");
      setConfirmPassword("");
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
    await AsyncStorage.removeItem("userProfile");
    navigation.navigate("Home");
  };

  const renderField = (label, value, field, isNumeric = false) => (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-gray-400 text-sm font-semibold">{label}</Text>
        {!editingField && (
          <TouchableOpacity
            onPress={() => {
              setEditingField(field);
              if (field === "nombre") setTempNombre(value);
              if (field === "altura") setTempAltura(value);
              if (field === "peso") setTempPeso(value);
              if (field === "email") setTempEmail(value);
            }}
          >
            <Edit2 size={18} color="#60a5fa" />
          </TouchableOpacity>
        )}
      </View>

      {editingField !== field ? (
        <View className="bg-gray-900 border border-gray-600 rounded-lg p-3">
          <Text className="text-white">{value || "No especificado"}</Text>
        </View>
      ) : (
        <View>
          <TextInput
            value={
              field === "nombre"
                ? tempNombre
                : field === "altura"
                  ? tempAltura
                  : field === "peso"
                    ? tempPeso
                    : tempEmail
            }
            onChangeText={
              field === "nombre"
                ? setTempNombre
                : field === "altura"
                  ? setTempAltura
                  : field === "peso"
                    ? setTempPeso
                    : setTempEmail
            }
            placeholder={`Ingresa ${label.toLowerCase()}`}
            placeholderTextColor="#6b7280"
            keyboardType={
              isNumeric
                ? "numeric"
                : field === "email"
                  ? "email-address"
                  : "default"
            }
            autoCapitalize={field === "nombre" ? "words" : "none"}
            className="bg-gray-900 border border-gray-600 text-white rounded-lg p-3 mb-3"
          />

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => {
                const val =
                  field === "nombre"
                    ? tempNombre
                    : field === "altura"
                      ? tempAltura
                      : field === "peso"
                        ? tempPeso
                        : tempEmail;
                if (field === "nombre") handleNombreChange(val);
                else if (field === "altura") handleAlturaChange(val);
                else if (field === "peso") handlePesoChange(val);
                else if (field === "email") handleEmailChange(val);
              }}
              className="flex-1 bg-blue-600 rounded-lg p-3 flex-row items-center justify-center gap-2"
            >
              <Check size={18} color="#fff" />
              <Text className="text-white font-semibold">Confirmar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setEditingField(null);
                setTempNombre(nombre);
                setTempAltura(altura);
                setTempPeso(peso);
                setTempEmail(email);
              }}
              className="flex-1 bg-gray-700 rounded-lg p-3 flex-row items-center justify-center gap-2"
            >
              <X size={18} color="#fff" />
              <Text className="text-white font-semibold">Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <LinearGradient
      colors={["#1a1a1a", "#1e40af", "#4f46e5"]}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 24, paddingBottom: 80 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {userProfile ? (
            <Animated.View entering={FadeInUp.duration(400).delay(100)}>
              {/* CARD AZUL */}
              <View
                className="bg-blue-900/40 rounded-2xl border border-gray-600/50 p-6 mb-6"
                style={{ marginTop: 40 }}
              >
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

              {/* Campos */}
              {renderField("Nombre de usuario", nombre, "nombre")}
              {renderField("Altura (cm)", altura, "altura", true)}
              {renderField("Peso (kg)", peso, "peso", true)}
              {renderField("Email", email, "email")}

              {/* Contraseña */}
              <View className="mb-6">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-400 text-sm font-semibold">
                    Contraseña
                  </Text>
                  {!editingField && (
                    <TouchableOpacity
                      onPress={() => setEditingField("password")}
                    >
                      <Edit2 size={18} color="#60a5fa" />
                    </TouchableOpacity>
                  )}
                </View>

                {editingField !== "password" ? (
                  <View className="bg-gray-900 border border-gray-600 rounded-lg p-3">
                    <Text className="text-white">••••••••</Text>
                  </View>
                ) : (
                  <View>
                    {/* Nueva contraseña */}
                    <View className="mb-3">
                      <Text className="text-gray-400 text-xs mb-1">
                        Nueva contraseña
                      </Text>
                      <View className="relative">
                        <TextInput
                          value={newPassword}
                          onChangeText={setNewPassword}
                          placeholder="Ingresa nueva contraseña"
                          placeholderTextColor="#6b7280"
                          secureTextEntry={!showNewPassword}
                          className="bg-gray-900 border border-gray-600 text-white rounded-lg p-3 pr-12"
                        />
                        <TouchableOpacity
                          onPress={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-3"
                        >
                          {showNewPassword ? (
                            <EyeOff size={20} color="#9ca3af" />
                          ) : (
                            <Eye size={20} color="#9ca3af" />
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Confirmar contraseña */}
                    <View className="mb-3">
                      <Text className="text-gray-400 text-xs mb-1">
                        Confirmar contraseña
                      </Text>
                      <View className="relative">
                        <TextInput
                          value={confirmPassword}
                          onChangeText={setConfirmPassword}
                          placeholder="Confirma tu contraseña"
                          placeholderTextColor="#6b7280"
                          secureTextEntry={!showConfirmPassword}
                          className="bg-gray-900 border border-gray-600 text-white rounded-lg p-3 pr-12"
                        />
                        <TouchableOpacity
                          onPress={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-3"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={20} color="#9ca3af" />
                          ) : (
                            <Eye size={20} color="#9ca3af" />
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={handlePasswordChange}
                        className="flex-1 bg-blue-600 rounded-lg p-3 flex-row items-center justify-center gap-2"
                      >
                        <Check size={18} color="#fff" />
                        <Text className="text-white font-semibold">
                          Confirmar
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          setEditingField(null);
                          setNewPassword("");
                          setConfirmPassword("");
                        }}
                        className="flex-1 bg-gray-700 rounded-lg p-3 flex-row items-center justify-center gap-2"
                      >
                        <X size={18} color="#fff" />
                        <Text className="text-white font-semibold">
                          Cancelar
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>

              {/* Logout */}
              <TouchableOpacity
                onPress={handleLogout}
                className="bg-red-900/40 rounded-lg p-4 flex-row items-center justify-center gap-2 mt-4"
              >
                <LogOut size={20} color="#ef4444" />
                <Text className="text-red-400 font-semibold text-base">
                  Cerrar sesión
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            // Cargando perfil centrado
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text className="text-gray-300 text-lg">Cargando perfil...</Text>
            </View>
          )}
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
