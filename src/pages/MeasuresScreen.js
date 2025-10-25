import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Plus, Trash2, TrendingUp } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";
import MeasuresModal from "../components/MeasuresModal";
import MeasuresChartView from "../components/MeasuresChartView";

export default function MeasuresScreen({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedView, setSelectedView] = useState("list");

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
      console.error("Error cargando usuario:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: records, error } = await supabase
        .from("perimetros")
        .select("*")
        .eq("user_id", userId)
        .order("fecha", { ascending: false });

      if (error) throw error;
      setData(records || []);
    } catch (err) {
      console.error("Error:", err);
      Alert.alert("Error", "No se pudieron cargar las medidas");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (values) => {
    try {
      const record = {
        user_id: userId,
        fecha: new Date().toISOString().split("T")[0],
        ...values,
      };

      const { error } = await supabase.from("perimetros").insert(record);

      if (error) throw error;

      Alert.alert("Éxito", "Medidas guardadas");
      fetchData();
      setModalVisible(false);
    } catch (err) {
      console.error("Error:", err);
      Alert.alert("Error", err.message || "No se pudo guardar");
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Confirmar",
      "¿Eliminar este registro de medidas?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("perimetros")
                .delete()
                .eq("id", id);

              if (error) throw error;
              fetchData();
              Alert.alert("Éxito", "Registro eliminado");
            } catch (err) {
              Alert.alert("Error", "No se pudo eliminar");
            }
          },
        },
      ]
    );
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
    <LinearGradient colors={["#1a1a1a", "#1e40af", "#4f46e5"]} style={{ flex: 1 }}>
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
            Perímetros Corporales
          </Text>
        </View>

        {/* Toggle Buttons */}
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
              Añadir Medidas
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
                  No hay registros aún
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
                      marginBottom: 12,
                    }}
                  >
                    <Text style={{ color: "#60a5fa", fontWeight: "600" }}>
                      {formatDate(record.fecha)}
                    </Text>
                    <TouchableOpacity onPress={() => handleDelete(record.id)}>
                      <Trash2 size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </View>

                  {record.pecho && (
                    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 }}>
                      <Text style={{ color: "#d1d5db" }}>Pecho</Text>
                      <Text style={{ color: "#fff", fontWeight: "600" }}>{record.pecho} cm</Text>
                    </View>
                  )}
                  {record.cintura && (
                    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 }}>
                      <Text style={{ color: "#d1d5db" }}>Cintura</Text>
                      <Text style={{ color: "#fff", fontWeight: "600" }}>{record.cintura} cm</Text>
                    </View>
                  )}
                  {record.cadera && (
                    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 }}>
                      <Text style={{ color: "#d1d5db" }}>Cadera</Text>
                      <Text style={{ color: "#fff", fontWeight: "600" }}>{record.cadera} cm</Text>
                    </View>
                  )}
                  {(record.biceps_izq || record.biceps_der) && (
                    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 }}>
                      <Text style={{ color: "#d1d5db" }}>Bíceps</Text>
                      <Text style={{ color: "#fff", fontWeight: "600" }}>
                        I: {record.biceps_izq || "-"} / D: {record.biceps_der || "-"}
                      </Text>
                    </View>
                  )}
                  {(record.muslo_izq || record.muslo_der) && (
                    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 }}>
                      <Text style={{ color: "#d1d5db" }}>Muslo</Text>
                      <Text style={{ color: "#fff", fontWeight: "600" }}>
                        I: {record.muslo_izq || "-"} / D: {record.muslo_der || "-"}
                      </Text>
                    </View>
                  )}
                  {(record.gemelo_izq || record.gemelo_der) && (
                    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 }}>
                      <Text style={{ color: "#d1d5db" }}>Gemelo</Text>
                      <Text style={{ color: "#fff", fontWeight: "600" }}>
                        I: {record.gemelo_izq || "-"} / D: {record.gemelo_der || "-"}
                      </Text>
                    </View>
                  )}
                </View>
              ))
            )}
          </ScrollView>
        ) : (
          <MeasuresChartView data={data} />
        )}

        <MeasuresModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleAdd}
        />
      </View>
    </LinearGradient>
  );
}