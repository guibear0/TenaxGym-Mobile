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
import {
  ArrowLeft,
  Plus,
  Trash2,
  TrendingUp,
  X,
  Check,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";
import TestsChartView from "../components/TestsChartView";

export default function StrengthTestsScreen({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedView, setSelectedView] = useState("list");
  const [formValues, setFormValues] = useState({ ejercicio: "", marca: "" });

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
        .eq("tipo", "fuerza")
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

    try {
      const record = {
        user_id: userId,
        tipo: "fuerza",
        ejercicio: formValues.ejercicio,
        marca: parseFloat(formValues.marca),
        fecha: new Date().toISOString().split("T")[0],
      };

      const { error } = await supabase.from("test_resultados").insert(record);

      if (error) throw error;

      Alert.alert("Éxito", "Test guardado");
      setFormValues({ ejercicio: "", marca: "" });
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
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginRight: 16 }}
          >
            <ArrowLeft size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={{ fontSize: 28, fontWeight: "bold", color: "#fff" }}>
            Tests de Fuerza
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
              data.map((record) => (
                <View
                  key={record.id}
                  style={{
                    backgroundColor: "rgba(31, 41, 55, 0.6)",
                    padding: 16,
                    borderRadius: 16,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: "rgba(107, 114, 128, 0.3)",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <Text style={{ color: "#60a5fa", fontWeight: "600" }}>
                      {formatDate(record.fecha)}
                    </Text>
                    <TouchableOpacity onPress={() => handleDelete(record.id)}>
                      <Trash2 size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 4,
                    }}
                  >
                    {record.ejercicio}
                  </Text>
                  <Text
                    style={{
                      color: "#22c55e",
                      fontSize: 24,
                      fontWeight: "bold",
                    }}
                  >
                    {record.marca} kg
                  </Text>
                </View>
              ))
            )}
          </ScrollView>
        ) : (
          <TestsChartView data={data} tipo="fuerza" />
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
                    Nuevo Test de Fuerza
                  </Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <X size={24} color="#9ca3af" />
                  </TouchableOpacity>
                </View>

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
                  <TextInput
                    value={formValues.ejercicio}
                    onChangeText={(text) =>
                      setFormValues({ ...formValues, ejercicio: text })
                    }
                    placeholder="Ej: Press Banca"
                    placeholderTextColor="#6b7280"
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

                <View style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      color: "#d1d5db",
                      fontSize: 14,
                      fontWeight: "600",
                      marginBottom: 8,
                    }}
                  >
                    Marca (kg)
                  </Text>
                  <TextInput
                    value={formValues.marca}
                    onChangeText={(text) =>
                      setFormValues({ ...formValues, marca: text })
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
