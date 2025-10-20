import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Eye, EyeOff, Edit2, Check, X } from "lucide-react-native";

export default function AuthInput({
  label,
  value,
  onChangeText,
  isPassword = false,
  isEditing = false,
  onEditPress,
  onConfirmPress,
  onCancelPress,
  type = "email", // 'email', 'password', 'confirm-password'
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const isPasswordField = isPassword || type.includes("password");

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-gray-400 text-sm font-semibold">{label}</Text>
        {!isEditing && (
          <TouchableOpacity onPress={onEditPress}>
            <Edit2 size={18} color="#60a5fa" />
          </TouchableOpacity>
        )}
      </View>

      {!isEditing ? (
        // Modo lectura
        <View className="bg-gray-900 border border-gray-600 rounded-lg p-3 flex-row items-center justify-between">
          <Text className="text-white flex-1">
            {isPasswordField ? "•".repeat(value?.length || 0) : value}
          </Text>
          {isPasswordField && (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="ml-2"
            >
              {showPassword ? (
                <EyeOff size={20} color="#9ca3af" />
              ) : (
                <Eye size={20} color="#9ca3af" />
              )}
            </TouchableOpacity>
          )}
        </View>
      ) : (
        // Modo edición
        <View>
          <TextInput
            value={tempValue}
            onChangeText={setTempValue}
            placeholder={`Ingresa ${label.toLowerCase()}`}
            placeholderTextColor="#6b7280"
            secureTextEntry={isPasswordField && !showPassword}
            keyboardType={type === "email" ? "email-address" : "default"}
            autoCapitalize="none"
            className="bg-gray-900 border border-gray-600 text-white rounded-lg p-3 mb-3"
          />

          {isPasswordField && (
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
          )}

          {/* Botones Confirmar/Cancelar */}
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => {
                onConfirmPress(tempValue);
                setTempValue("");
              }}
              className="flex-1 bg-blue-600 rounded-lg p-3 flex-row items-center justify-center gap-2"
            >
              <Check size={18} color="#fff" />
              <Text className="text-white font-semibold">Confirmar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                onCancelPress();
                setTempValue(value);
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
}
