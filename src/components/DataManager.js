import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react-native";
import { supabase } from "../lib/supabase";
import AddDataModal from "./AddDataModal";
import ChartView from "./ChartView";

const { width } = Dimensions.get("window");

export default function DataManager({ userId, config }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedView, setSelectedView] = useState("list"); // 'list' o 'chart'
  const [openGroups, setOpenGroups] = useState({}); // control acordeones

  useEffect(() => {
    fetchData();
  }, [userId]);

  // Genera agrupación por zona a partir de config.fields
  // Estructura: { "Bíceps": [{ key: 'biceps_izq', label: 'Izquierda', ... }, ...], "Cintura": [...] }
  const groups = useMemo(() => {
    // Debes indicar aquí la lógica de agrupado: por nombre o prefijo.
    // Vamos a agrupar por etiquetas conocidas (puedes ajustar):
    const mapping = {
      Bíceps: [
        "biceps_izq",
        "biceps_der",
        "biceps_contraido_izq",
        "biceps_contraido_der",
      ],
      Cintura: ["cintura"],
      Pecho: ["pecho"],
      Cadera: ["cadera"],
      Muslo: ["muslo_izq", "muslo_der"],
      Gemelo: ["gemelo_izq", "gemelo_der"],
    };

    const byGroup = {};
    Object.entries(mapping).forEach(([groupName, keys]) => {
      const fields = [];
      keys.forEach((k) => {
        const f = config.fields.find(
          (fld) => fld.name === k || fld.left === k || fld.right === k
        );
        if (f) {
          // Si es paired, puede contener left/right: lo normalizamos
          if (f.type === "single") {
            fields.push({ key: f.name, label: f.label, type: "single" });
          } else if (f.type === "paired") {
            // añadimos entradas separadas para left/right si coinciden
            if (f.left && keys.includes(f.left))
              fields.push({
                key: f.left,
                label: `${f.label} (Izq)`,
                type: "single",
              });
            if (f.right && keys.includes(f.right))
              fields.push({
                key: f.right,
                label: `${f.label} (Der)`,
                type: "single",
              });
          }
        } else {
          // Si no encaja con config.fields, añadimos clave raw
          if (k.includes("_")) {
            const pretty = k.replace(/_/g, " ");
            fields.push({ key: k, label: pretty, type: "single" });
          } else {
            fields.push({ key: k, label: k, type: "single" });
          }
        }
      });

      if (fields.length > 0) {
        // Filtra duplicados por clave
        const uniqueFields = [];
        const seen = new Set();
        for (const f of fields) {
          if (!seen.has(f.key)) {
            seen.add(f.key);
            uniqueFields.push(f);
          }
        }
        byGroup[groupName] = uniqueFields;
      }
    });

    return byGroup;
  }, [config.fields]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: records, error } = await supabase
        .from(config.tableName)
        .select("*")
        .eq("user_id", userId)
        .order("fecha", { ascending: false });

      if (error) throw error;
      setData(records || []);
    } catch (err) {
      console.error("Error cargando datos:", err);
      Alert.alert("Error", "No se pudieron cargar los datos");
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

      const { error } = await supabase.from(config.tableName).insert(record);

      if (error) throw error;

      Alert.alert("Éxito", "Datos guardados correctamente");
      fetchData();
      setModalVisible(false);
    } catch (err) {
      console.error("Error guardando:", err);
      Alert.alert("Error", err.message || "No se pudo guardar");
    }
  };

  // Borra (pone a null) un campo concreto de un registro
  const handleDeleteField = (recordId, fieldKey, prettyLabel) => {
    Alert.alert(
      "Confirmar eliminación",
      `¿Eliminar "${prettyLabel}" para este registro?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from(config.tableName)
                .update({ [fieldKey]: null })
                .eq("id", recordId);

              if (error) throw error;
              await fetchData();
              Alert.alert("Éxito", "Marca eliminada");
            } catch (err) {
              console.error("Error eliminando campo:", err);
              Alert.alert("Error", "No se pudo eliminar la marca");
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  // VIEW
  return (
    <View style={{ flex: 1 }}>
      {/* Toggle View Buttons */}
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
            Añadir Medida
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {selectedView === "list" ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        >
          {Object.keys(groups).map((groupName) => {
            const fields = groups[groupName];

            // Contenido del acordeón: para cada registro mostramos las medidas que tiene
            return (
              <View key={groupName} style={{ marginBottom: 12 }}>
                {/* Header acordeón */}
                <TouchableOpacity
                  onPress={() =>
                    setOpenGroups((s) => ({ ...s, [groupName]: !s[groupName] }))
                  }
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 12,
                    backgroundColor: "rgba(31, 41, 55, 0.6)",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "rgba(107, 114, 128, 0.3)",
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}
                  >
                    {groupName}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                      {
                        data.filter((rec) =>
                          fields.some(
                            (f) =>
                              rec[f.key] !== null && rec[f.key] !== undefined
                          )
                        ).length
                      }{" "}
                      registros
                    </Text>
                    {openGroups[groupName] ? (
                      <ChevronUp size={20} color="#fff" />
                    ) : (
                      <ChevronDown size={20} color="#fff" />
                    )}
                  </View>
                </TouchableOpacity>

                {/* Body acordeón */}
                {openGroups[groupName] && (
                  <View style={{ marginTop: 10 }}>
                    {data.length === 0 ? (
                      <Text style={{ color: "#9ca3af", padding: 12 }}>
                        No hay registros
                      </Text>
                    ) : (
                      data.map((record) => {
                        // Para este registro, comprobamos si tiene alguna medida del grupo
                        const presentFields = fields.filter(
                          (f) =>
                            record[f.key] !== null &&
                            record[f.key] !== undefined &&
                            record[f.key] !== ""
                        );
                        if (presentFields.length === 0) return null;

                        return (
                          <View
                            key={record.id}
                            style={{
                              backgroundColor: "rgba(31, 41, 55, 0.6)",
                              padding: 12,
                              borderRadius: 12,
                              marginBottom: 10,
                              borderWidth: 1,
                              borderColor: "rgba(107, 114, 128, 0.3)",
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 8,
                              }}
                            >
                              <Text
                                style={{ color: "#60a5fa", fontWeight: "600" }}
                              >
                                {formatDate(record.fecha)}
                              </Text>
                            </View>

                            {presentFields.map((f) => (
                              <View
                                key={f.key}
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  paddingVertical: 6,
                                  borderBottomWidth: 1,
                                  borderBottomColor:
                                    "rgba(107, 114, 128, 0.12)",
                                }}
                              >
                                <Text style={{ color: "#d1d5db" }}>
                                  {f.label}
                                </Text>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 12,
                                  }}
                                >
                                  <Text
                                    style={{ color: "#fff", fontWeight: "600" }}
                                  >
                                    {String(record[f.key])}
                                  </Text>
                                  <TouchableOpacity
                                    onPress={() =>
                                      handleDeleteField(
                                        record.id,
                                        f.key,
                                        f.label
                                      )
                                    }
                                  >
                                    <Trash2 size={18} color="#ef4444" />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            ))}
                          </View>
                        );
                      })
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <ChartView data={data} config={config} />
      )}

      {/* Add Modal */}
      <AddDataModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAdd}
        fields={config.fields}
      />
    </View>
  );
}
