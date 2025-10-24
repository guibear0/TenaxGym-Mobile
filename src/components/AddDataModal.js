import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { X, Check } from "lucide-react-native";

export default function AddDataModal({ visible, onClose, onSave, fields }) {
  const [values, setValues] = useState({});

  const handleSave = () => {
    // Validar campos requeridos
    const missingFields = [];

    fields.forEach((field) => {
      if (field.type === "single") {
        if (!values[field.name]) {
          missingFields.push(field.label);
        }
      } else if (field.type === "paired") {
        if (!values[field.left] || !values[field.right]) {
          missingFields.push(field.label);
        }
      }
    });

    if (missingFields.length > 0) {
      Alert.alert(
        "Campos incompletos",
        `Por favor completa: ${missingFields.join(", ")}`
      );
      return;
    }

    onSave(values);
    setValues({});
  };

  const handleCancel = () => {
    setValues({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#1f2937",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxHeight: "85%",
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(107, 114, 128, 0.3)",
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
                Nueva Medida
              </Text>
              <TouchableOpacity onPress={handleCancel}>
                <X size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            {/* Form */}
            <ScrollView
              contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
            >
              {fields.map((field, idx) => (
                <View key={idx} style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      color: "#d1d5db",
                      fontSize: 14,
                      fontWeight: "600",
                      marginBottom: 8,
                    }}
                  >
                    {field.label}
                  </Text>

                  {field.type === "single" ? (
                    <TextInput
                      value={values[field.name] || ""}
                      onChangeText={(text) =>
                        setValues({ ...values, [field.name]: text })
                      }
                      placeholder={`Ej: 90`}
                      placeholderTextColor="#6b7280"
                      keyboardType={field.keyboardType || "default"}
                      style={{
                        backgroundColor: "#374151",
                        color: "#fff",
                        padding: 14,
                        borderRadius: 12,
                        fontSize: 16,
                        borderWidth: 1,
                        borderColor: "rgba(107, 114, 128, 0.3)",
                      }}
                    />
                  ) : field.type === "paired" ? (
                    <View style={{ flexDirection: "row", gap: 12 }}>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            color: "#9ca3af",
                            fontSize: 12,
                            marginBottom: 6,
                          }}
                        >
                          Izquierda
                        </Text>
                        <TextInput
                          value={values[field.left] || ""}
                          onChangeText={(text) =>
                            setValues({ ...values, [field.left]: text })
                          }
                          placeholder="Ej: 32"
                          placeholderTextColor="#6b7280"
                          keyboardType={field.keyboardType || "default"}
                          style={{
                            backgroundColor: "#374151",
                            color: "#fff",
                            padding: 14,
                            borderRadius: 12,
                            fontSize: 16,
                            borderWidth: 1,
                            borderColor: "rgba(107, 114, 128, 0.3)",
                          }}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            color: "#9ca3af",
                            fontSize: 12,
                            marginBottom: 6,
                          }}
                        >
                          Derecha
                        </Text>
                        <TextInput
                          value={values[field.right] || ""}
                          onChangeText={(text) =>
                            setValues({ ...values, [field.right]: text })
                          }
                          placeholder="Ej: 33"
                          placeholderTextColor="#6b7280"
                          keyboardType={field.keyboardType || "default"}
                          style={{
                            backgroundColor: "#374151",
                            color: "#fff",
                            padding: 14,
                            borderRadius: 12,
                            fontSize: 16,
                            borderWidth: 1,
                            borderColor: "rgba(107, 114, 128, 0.3)",
                          }}
                        />
                      </View>
                    </View>
                  ) : null}
                </View>
              ))}
            </ScrollView>

            {/* Buttons */}
            <View
              style={{
                flexDirection: "row",
                gap: 12,
                padding: 20,
                borderTopWidth: 1,
                borderTopColor: "rgba(107, 114, 128, 0.3)",
              }}
            >
              <TouchableOpacity
                onPress={handleCancel}
                style={{
                  flex: 1,
                  backgroundColor: "#374151",
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  gap: 8,
                }}
              >
                <X size={18} color="#fff" />
                <Text
                  style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                style={{
                  flex: 1,
                  backgroundColor: "#10b981",
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  gap: 8,
                }}
              >
                <Check size={18} color="#fff" />
                <Text
                  style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}
                >
                  Guardar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
