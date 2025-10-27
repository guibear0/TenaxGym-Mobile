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
import { Plus, Trash2, TrendingUp } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";
import MeasuresModal from "../components/MeasuresModal";
import MeasuresChartView from "../components/MeasuresChartView";
import CollapsibleGroup from "../components/CollapsibleGroup";

export default function MeasuresScreen({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedView, setSelectedView] = useState("list");

  // Definir grupos de medidas
  const measureGroups = {
    Pecho: ["pecho"],
    Cintura: ["cintura"],
    Cadera: ["cadera"],
    Bíceps: [
      "biceps_izq",
      "biceps_der",
      "biceps_contraido_izq",
      "biceps_contraido_der",
    ],
    Muslos: ["muslo_izq", "muslo_der"],
    Gemelos: ["gemelo_izq", "gemelo_der"],
  };

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

  const handleDeleteMeasure = async (recordId, fieldKey, label) => {
    Alert.alert("Confirmar", `¿Eliminar "${label}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const { error } = await supabase
              .from("perimetros")
              .update({ [fieldKey]: null })
              .eq("id", recordId);

            if (error) throw error;
            fetchData();
            Alert.alert("Éxito", "Medida eliminada");
          } catch (err) {
            Alert.alert("Error", "No se pudo eliminar");
          }
        },
      },
    ]);
  };

  const getFieldLabel = (field) => {
    const labels = {
      pecho: "Pecho",
      cintura: "Cintura",
      cadera: "Cadera",
      biceps_izq: "Bíceps Izquierdo",
      biceps_der: "Bíceps Derecho",
      biceps_contraido_izq: "Bíceps Contraído Izq",
      biceps_contraido_der: "Bíceps Contraído Der",
      muslo_izq: "Muslo Izquierdo",
      muslo_der: "Muslo Derecho",
      gemelo_izq: "Gemelo Izquierdo",
      gemelo_der: "Gemelo Derecho",
    };
    return labels[field] || field;
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

  // Agrupar registros por grupo de medidas
  const getGroupedData = (groupName, fields) => {
    const groupedItems = [];

    data.forEach((record) => {
      const recordItems = [];

      fields.forEach((field) => {
        if (record[field] !== null && record[field] !== undefined) {
          recordItems.push({
            id: `${record.id}-${field}`,
            recordId: record.id,
            field,
            label: getFieldLabel(field),
            value: record[field],
            fecha: record.fecha,
          });
        }
      });

      if (recordItems.length > 0) {
        groupedItems.push({
          id: record.id,
          fecha: record.fecha,
          items: recordItems,
        });
      }
    });

    return groupedItems;
  };

  const renderGroupItem = (group, onDelete) => {
    return (
      <>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text style={{ color: "#60a5fa", fontWeight: "600" }}>
            {formatDate(group.fecha)}
          </Text>
        </View>

        {group.items.map((item) => (
          <View
            key={item.id}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 6,
              borderBottomWidth: 1,
              borderBottomColor: "rgba(107, 114, 128, 0.12)",
            }}
          >
            <Text style={{ color: "#d1d5db" }}>{item.label}</Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                {item.value} cm
              </Text>
              <TouchableOpacity
                onPress={() =>
                  handleDeleteMeasure(item.recordId, item.field, item.label)
                }
              >
                <Trash2 size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </>
    );
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
              Object.entries(measureGroups).map(([groupName, fields]) => {
                const groupData = getGroupedData(groupName, fields);
                return (
                  <CollapsibleGroup
                    key={groupName}
                    title={groupName}
                    items={groupData}
                    renderItem={renderGroupItem}
                    defaultOpen={false}
                    emptyMessage="No hay medidas en este grupo"
                  />
                );
              })
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
