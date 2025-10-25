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

export default function MeasuresModal({ visible, onClose, onSave }) {
  const [values, setValues] = useState({});

  const handleSave = () => {
    // Al menos un campo debe estar lleno
    const hasValue = Object.values(values).some((v) => v && v.trim() !== "");

    if (!hasValue) {
      Alert.alert("Error", "Debes completar al menos una medida");
      return;
    }

    // Validar pares (si pones izquierda, debes poner derecha)
    if (
      (values.biceps_izq || values.biceps_der) &&
      !(values.biceps_izq && values.biceps_der)
    ) {
      Alert.alert("Error", "Completa ambos bíceps (izquierdo y derecho)");
      return;
    }
    if (
      (values.biceps_contraido_izq || values.biceps_contraido_der) &&
      !(values.biceps_contraido_izq && values.biceps_contraido_der)
    ) {
      Alert.alert("Error", "Completa ambos bíceps contraídos");
      return;
    }
    if (
      (values.muslo_izq || values.muslo_der) &&
      !(values.muslo_izq && values.muslo_der)
    ) {
      Alert.alert("Error", "Completa ambos muslos");
      return;
    }
    if (
      (values.gemelo_izq || values.gemelo_der) &&
      !(values.gemelo_izq && values.gemelo_der)
    ) {
      Alert.alert("Error", "Completa ambos gemelos");
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
                Nuevas Medidas
              </Text>
              <TouchableOpacity onPress={handleCancel}>
                <X size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Pecho */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    color: "#d1d5db",
                    fontSize: 14,
                    fontWeight: "600",
                    marginBottom: 8,
                  }}
                >
                  Pecho (cm)
                </Text>
                <TextInput
                  value={values.pecho || ""}
                  onChangeText={(text) => setValues({ ...values, pecho: text })}
                  placeholder="Ej: 95"
                  placeholderTextColor="#6b7280"
                  keyboardType="numeric"
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

              {/* Cintura */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    color: "#d1d5db",
                    fontSize: 14,
                    fontWeight: "600",
                    marginBottom: 8,
                  }}
                >
                  Cintura (cm)
                </Text>
                <TextInput
                  value={values.cintura || ""}
                  onChangeText={(text) =>
                    setValues({ ...values, cintura: text })
                  }
                  placeholder="Ej: 80"
                  placeholderTextColor="#6b7280"
                  keyboardType="numeric"
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

              {/* Cadera */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    color: "#d1d5db",
                    fontSize: 14,
                    fontWeight: "600",
                    marginBottom: 8,
                  }}
                >
                  Cadera (cm)
                </Text>
                <TextInput
                  value={values.cadera || ""}
                  onChangeText={(text) =>
                    setValues({ ...values, cadera: text })
                  }
                  placeholder="Ej: 98"
                  placeholderTextColor="#6b7280"
                  keyboardType="numeric"
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

              {/* Bíceps */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    color: "#d1d5db",
                    fontSize: 14,
                    fontWeight: "600",
                    marginBottom: 8,
                  }}
                >
                  Bíceps (cm)
                </Text>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: "#9ca3af",
                        fontSize: 12,
                        marginBottom: 6,
                      }}
                    >
                      Izquierdo
                    </Text>
                    <TextInput
                      value={values.biceps_izq || ""}
                      onChangeText={(text) =>
                        setValues({ ...values, biceps_izq: text })
                      }
                      placeholder="Ej: 32"
                      placeholderTextColor="#6b7280"
                      keyboardType="numeric"
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
                      Derecho
                    </Text>
                    <TextInput
                      value={values.biceps_der || ""}
                      onChangeText={(text) =>
                        setValues({ ...values, biceps_der: text })
                      }
                      placeholder="Ej: 33"
                      placeholderTextColor="#6b7280"
                      keyboardType="numeric"
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
              </View>

              {/* Bíceps Contraído */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    color: "#d1d5db",
                    fontSize: 14,
                    fontWeight: "600",
                    marginBottom: 8,
                  }}
                >
                  Bíceps Contraído (cm)
                </Text>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: "#9ca3af",
                        fontSize: 12,
                        marginBottom: 6,
                      }}
                    >
                      Izquierdo
                    </Text>
                    <TextInput
                      value={values.biceps_contraido_izq || ""}
                      onChangeText={(text) =>
                        setValues({ ...values, biceps_contraido_izq: text })
                      }
                      placeholder="Ej: 35"
                      placeholderTextColor="#6b7280"
                      keyboardType="numeric"
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
                      Derecho
                    </Text>
                    <TextInput
                      value={values.biceps_contraido_der || ""}
                      onChangeText={(text) =>
                        setValues({ ...values, biceps_contraido_der: text })
                      }
                      placeholder="Ej: 36"
                      placeholderTextColor="#6b7280"
                      keyboardType="numeric"
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
              </View>

              {/* Muslo */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    color: "#d1d5db",
                    fontSize: 14,
                    fontWeight: "600",
                    marginBottom: 8,
                  }}
                >
                  Muslo (cm)
                </Text>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: "#9ca3af",
                        fontSize: 12,
                        marginBottom: 6,
                      }}
                    >
                      Izquierdo
                    </Text>
                    <TextInput
                      value={values.muslo_izq || ""}
                      onChangeText={(text) =>
                        setValues({ ...values, muslo_izq: text })
                      }
                      placeholder="Ej: 55"
                      placeholderTextColor="#6b7280"
                      keyboardType="numeric"
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
                      Derecho
                    </Text>
                    <TextInput
                      value={values.muslo_der || ""}
                      onChangeText={(text) =>
                        setValues({ ...values, muslo_der: text })
                      }
                      placeholder="Ej: 56"
                      placeholderTextColor="#6b7280"
                      keyboardType="numeric"
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
              </View>

              {/* Gemelo */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    color: "#d1d5db",
                    fontSize: 14,
                    fontWeight: "600",
                    marginBottom: 8,
                  }}
                >
                  Gemelo (cm)
                </Text>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: "#9ca3af",
                        fontSize: 12,
                        marginBottom: 6,
                      }}
                    >
                      Izquierdo
                    </Text>
                    <TextInput
                      value={values.gemelo_izq || ""}
                      onChangeText={(text) =>
                        setValues({ ...values, gemelo_izq: text })
                      }
                      placeholder="Ej: 38"
                      placeholderTextColor="#6b7280"
                      keyboardType="numeric"
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
                      Derecho
                    </Text>
                    <TextInput
                      value={values.gemelo_der || ""}
                      onChangeText={(text) =>
                        setValues({ ...values, gemelo_der: text })
                      }
                      placeholder="Ej: 39"
                      placeholderTextColor="#6b7280"
                      keyboardType="numeric"
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
              </View>
            </ScrollView>

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
                  flexDirection: "row",
                  justifyContent: "center",
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
                  flexDirection: "row",
                  justifyContent: "center",
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
