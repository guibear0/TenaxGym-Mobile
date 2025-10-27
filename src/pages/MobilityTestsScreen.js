import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Plus, Trash2, TrendingUp, X, Check } from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";
import TestsChartView from "../components/TestsChartView";
import CollapsibleGroup from "../components/CollapsibleGroup";

const EJERCICIOS_MOVILIDAD = {
  Hombros: [
    "Rotación Interna Izquierda",
    "Rotación Interna Derecha",
    "Rotación Externa Izquierda",
    "Rotación Externa Derecha",
  ],
  Overhead: [
    "Overhead Flexión Izquierda",
    "Overhead Flexión Derecha",
    "Overhead Squat",
  ],
  Tórax: ["Rotación Derecha", "Rotación Izquierda"],
  Caderas: [
    "Rotación Interna Izquierda",
    "Rotación Interna Derecha",
    "Flexión Izquierda",
    "Flexión Derecha",
    "Abducción Izquierda",
    "Abducción Derecha",
  ],
  "Cadera Posterior": ["Flexibilidad Izquierda", "Flexibilidad Derecha"],
  Tobillos: ["Flexión Izquierda", "Flexión Derecha"],
};

// Lista plana para picker
const ALL_EJERCICIOS = Object.entries(EJERCICIOS_MOVILIDAD).flatMap(
  ([grupo, ejercicios]) =>
    ejercicios.map((ej) => ({
      grupo,
      ejercicio: ej,
      uniqueKey: `${grupo}::${ej}`,
      label: `${grupo} - ${ej}`,
    }))
);

export default function MobilityTestsScreen({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedView, setSelectedView] = useState("list");
  const [formValues, setFormValues] = useState({
    ejercicio: ALL_EJERCICIOS[0].uniqueKey,
    marca: "",
  });

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  const loadUser = async () => {
    try {
      const profile = await AsyncStorage.getItem("userProfile");
      if (profile) {
        const user = JSON.parse(profile);
        setUserId(user.id);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: records, error } = await supabase
        .from("test_resultados")
        .select("*")
        .eq("user_id", userId)
        .eq("tipo", "movilidad")
        .order("fecha", { ascending: false });

      if (error) throw error;
      setData(records || []);
    } catch (err) {
      console.error("Error:", err);
      Alert.alert("Error", "No se pudieron cargar los tests");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formValues.ejercicio || !formValues.marca) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    const [categoria, nombreEjercicio] = formValues.ejercicio.split("::");

    try {
      const record = {
        user_id: userId,
        tipo: "movilidad",
        categoria, // ✅ ahora guardamos categoría
        ejercicio: nombreEjercicio, // ✅ solo nombre
        marca: parseFloat(formValues.marca),
        fecha: new Date().toISOString().split("T")[0],
      };

      const { error } = await supabase.from("test_resultados").insert(record);

      if (error) throw error;

      Alert.alert("Éxito", "Test guardado");
      setFormValues({ ejercicio: ALL_EJERCICIOS[0].uniqueKey, marca: "" });
      fetchData();
      setModalVisible(false);
    } catch (err) {
      console.error("Error:", err);
      Alert.alert("Error", err.message || "No se pudo guardar");
    }
  };

  const handleDelete = (id) => {
    Alert.alert("Confirmar", "¿Eliminar este test?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const { error } = await supabase
              .from("test_resultados")
              .delete()
              .eq("id", id);
            if (error) throw error;
            fetchData();
            Alert.alert("Éxito", "Test eliminado");
          } catch (err) {
            Alert.alert("Error", "No se pudo eliminar");
          }
        },
      },
    ]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Agrupar por categoría
  const groupedData = {};
  data.forEach((record) => {
    const grupo = record.categoria || "Otros";
    if (!groupedData[grupo]) groupedData[grupo] = {};
    if (!groupedData[grupo][record.ejercicio])
      groupedData[grupo][record.ejercicio] = [];
    groupedData[grupo][record.ejercicio].push(record);
  });

  const renderTestItem = (record, onDelete) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ color: "#60a5fa", fontSize: 12, marginBottom: 4 }}>
          {formatDate(record.fecha)}
        </Text>
        <Text style={{ color: "#22c55e", fontSize: 20, fontWeight: "bold" }}>
          {record.marca} cm
        </Text>
      </View>
      <TouchableOpacity onPress={onDelete}>
        <Trash2 size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  const renderSubGroup = (ejercicio, tests) => (
    <View key={ejercicio} style={{ marginBottom: 12 }}>
      <View
        style={{
          backgroundColor: "rgba(55, 65, 81, 0.4)",
          padding: 10,
          borderRadius: 8,
          marginBottom: 8,
        }}
      >
        <Text style={{ color: "#e5e7eb", fontWeight: "600", fontSize: 14 }}>
          {ejercicio}
        </Text>
      </View>
      {tests.map((test) => (
        <View
          key={`${test.id}-${test.ejercicio}`}
          style={{
            backgroundColor: "rgba(31, 41, 55, 0.6)",
            padding: 12,
            borderRadius: 12,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: "rgba(107, 114, 128, 0.3)",
          }}
        >
          {renderTestItem(test, () => handleDelete(test.id))}
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <LinearGradient
        colors={["#1a1a1a", "#1e40af", "#4f46e5"]}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#1a1a1a", "#1e40af", "#4f46e5"]}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, paddingTop: 60 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 24,
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: "bold", color: "#fff" }}>
            Tests de Movilidad
          </Text>
        </View>

        {/* Toggle */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 24,
            marginBottom: 20,
            gap: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => setSelectedView("list")}
            style={{
              flex: 1,
              backgroundColor:
                selectedView === "list" ? "#3b82f6" : "rgba(55, 65, 81, 0.6)",
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Lista</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedView("chart")}
            style={{
              flex: 1,
              backgroundColor:
                selectedView === "chart" ? "#3b82f6" : "rgba(55, 65, 81, 0.6)",
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <TrendingUp size={18} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "600" }}>Gráficas</Text>
          </TouchableOpacity>
        </View>

        {/* Add Button */}
        <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{
              backgroundColor: "#10b981",
              paddingVertical: 14,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Plus size={20} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
              Añadir Test
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {selectedView === "list" ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
          >
            {data.length === 0 ? (
              <View
                style={{
                  backgroundColor: "rgba(31, 41, 55, 0.6)",
                  padding: 24,
                  borderRadius: 16,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#9ca3af", fontSize: 16 }}>
                  No hay tests registrados
                </Text>
              </View>
            ) : (
              Object.entries(groupedData).map(([grupo, ejercicios]) => (
                <CollapsibleGroup
                  key={grupo}
                  title={grupo}
                  items={[{ id: grupo }]}
                  renderItem={() => (
                    <View>
                      {Object.entries(ejercicios).map(([ejercicio, tests]) =>
                        renderSubGroup(ejercicio, tests)
                      )}
                    </View>
                  )}
                  defaultOpen={false}
                />
              ))
            )}
          </ScrollView>
        ) : (
          <TestsChartView data={data} tipo="movilidad" />
        )}

        {/* Modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
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
                  padding: 20,
                  maxHeight: "80%",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 20,
                  }}
                >
                  <Text
                    style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}
                  >
                    Nuevo Test de Movilidad
                  </Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <X size={24} color="#9ca3af" />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={{ marginBottom: 16 }}>
                    <Text
                      style={{
                        color: "#d1d5db",
                        fontSize: 14,
                        fontWeight: "600",
                        marginBottom: 8,
                      }}
                    >
                      Ejercicio
                    </Text>
                    <View
                      style={{
                        backgroundColor: "#374151",
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: "rgba(107, 114, 128, 0.3)",
                      }}
                    >
                      <Picker
                        selectedValue={formValues.ejercicio}
                        onValueChange={(value) =>
                          setFormValues({ ...formValues, ejercicio: value })
                        }
                        style={{ color: "#fff" }}
                        dropdownIconColor="#fff"
                      >
                        {ALL_EJERCICIOS.map((item) => (
                          <Picker.Item
                            key={item.uniqueKey}
                            label={item.label}
                            value={item.uniqueKey}
                          />
                        ))}
                      </Picker>
                    </View>
                  </View>

                  <View style={{ marginBottom: 20 }}>
                    <Text
                      style={{
                        color: "#d1d5db",
                        fontSize: 14,
                        fontWeight: "600",
                        marginBottom: 8,
                      }}
                    >
                      Marca (cm)
                    </Text>
                    <TextInput
                      value={formValues.marca}
                      onChangeText={(text) =>
                        setFormValues({ ...formValues, marca: text })
                      }
                      placeholder="Ej: 45"
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
                </ScrollView>

                <View style={{ flexDirection: "row", gap: 12 }}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
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
                    onPress={handleAdd}
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
      </View>
    </LinearGradient>
  );
}
