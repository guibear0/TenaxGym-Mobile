import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function TestsChartView({ data, tipo }) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  if (!data || data.length < 2) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        <Text style={{ color: "#9ca3af", fontSize: 16, textAlign: "center" }}>
          Necesitas al menos 2 registros para ver gráficas
        </Text>
      </View>
    );
  }

  // Agrupar por "categoria::ejercicio"
  const exerciseGroups = {};
  data.forEach((record) => {
    const key = `${record.categoria || "Fuerza"}::${record.ejercicio}`;
    if (!exerciseGroups[key]) exerciseGroups[key] = [];
    exerciseGroups[key].push(record);
  });

  // Crear gráficas por categoría + ejercicio
  const charts = Object.keys(exerciseGroups).map((key) => {
    const records = exerciseGroups[key].sort(
      (a, b) => new Date(a.fecha) - new Date(b.fecha)
    );

    // Separar categoría y nombre limpio
    const [categoria, ejercicio] = key.split("::");

    return {
      categoria,
      ejercicio,
      data: {
        labels: records.map((r) =>
          new Date(r.fecha).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
          })
        ),
        datasets: [
          {
            data: records.map((r) => parseFloat(r.marca)),
            color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
            strokeWidth: 3,
          },
        ],
      },
      records,
    };
  });

  if (charts.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#9ca3af", fontSize: 16 }}>
          No hay datos suficientes
        </Text>
      </View>
    );
  }

  const currentChart = charts[currentExerciseIndex];

  return (
    <ScrollView
      contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
    >
      {/* Navigation */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            setCurrentExerciseIndex(Math.max(0, currentExerciseIndex - 1))
          }
          disabled={currentExerciseIndex === 0}
          style={{ padding: 8, opacity: currentExerciseIndex === 0 ? 0.3 : 1 }}
        >
          <ChevronLeft size={28} color="#fff" />
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: "center" }}>
          {/* Categoría arriba */}
          <Text style={{ color: "#9ca3af", fontSize: 14, fontWeight: "500" }}>
            {currentChart.categoria}
          </Text>

          {/* Ejercicio debajo, centrado */}
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: "bold",
              marginTop: 2,
            }}
          >
            {currentChart.ejercicio}
          </Text>

          {/* Contador abajo */}
          <Text style={{ color: "#9ca3af", fontSize: 12, marginTop: 4 }}>
            {currentExerciseIndex + 1} de {charts.length}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            setCurrentExerciseIndex(
              Math.min(charts.length - 1, currentExerciseIndex + 1)
            )
          }
          disabled={currentExerciseIndex === charts.length - 1}
          style={{
            padding: 8,
            opacity: currentExerciseIndex === charts.length - 1 ? 0.3 : 1,
          }}
        >
          <ChevronRight size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Chart */}
      <Animated.View
        entering={FadeIn.duration(400)}
        style={{
          backgroundColor: "rgba(31, 41, 55, 0.8)",
          borderRadius: 16,
          paddingVertical: 16,
          paddingHorizontal: 12,
          borderWidth: 1,
          borderColor: "rgba(107, 114, 128, 0.3)",
          alignItems: "center",
        }}
      >
        <LineChart
          data={currentChart.data}
          width={Math.max(width - 80, currentChart.data.labels.length * 60)}
          height={260}
          chartConfig={{
            backgroundColor: "transparent",
            backgroundGradientFrom: "#1f2937",
            backgroundGradientTo: "#1f2937",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(209, 213, 219, ${opacity})`,
            propsForDots: { r: "5", strokeWidth: "2", stroke: "#1f2937" },
            propsForBackgroundLines: { stroke: "rgba(107, 114, 128, 0.2)" },
          }}
          bezier
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </Animated.View>

      {/* Stats */}
      <View
        style={{
          marginTop: 20,
          backgroundColor: "rgba(31, 41, 55, 0.6)",
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: "rgba(107, 114, 128, 0.3)",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            fontWeight: "600",
            marginBottom: 12,
          }}
        >
          Estadísticas
        </Text>

        {(() => {
          const values = currentChart.records.map((r) => parseFloat(r.marca));
          const min = Math.min(...values);
          const max = Math.max(...values);
          const avg = (
            values.reduce((a, b) => a + b, 0) / values.length
          ).toFixed(1);
          const latest = values[values.length - 1];
          const change = values.length > 1 ? latest - values[0] : 0;
          const mejora = ((change / values[0]) * 100).toFixed(1);

          return (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
              <View style={{ flex: 1, minWidth: "45%" }}>
                <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                  Marca Mínima
                </Text>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "600",
                    marginTop: 2,
                  }}
                >
                  {min.toFixed(1)} {tipo === "fuerza" ? "kg" : "cm"}
                </Text>
              </View>

              <View style={{ flex: 1, minWidth: "45%" }}>
                <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                  Marca Máxima
                </Text>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "600",
                    marginTop: 2,
                  }}
                >
                  {max.toFixed(1)} {tipo === "fuerza" ? "kg" : "cm"}
                </Text>
              </View>

              <View style={{ flex: 1, minWidth: "45%" }}>
                <Text style={{ color: "#9ca3af", fontSize: 12 }}>Promedio</Text>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "600",
                    marginTop: 2,
                  }}
                >
                  {avg} {tipo === "fuerza" ? "kg" : "cm"}
                </Text>
              </View>

              <View style={{ flex: 1, minWidth: "45%" }}>
                <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                  Mejora Total
                </Text>
                <Text
                  style={{
                    color: change >= 0 ? "#22c55e" : "#ef4444",
                    fontSize: 16,
                    fontWeight: "600",
                    marginTop: 2,
                  }}
                >
                  {change >= 0 ? "+" : ""}
                  {change.toFixed(1)} ({mejora}%)
                </Text>
              </View>

              <View style={{ flex: 1, minWidth: "100%" }}>
                <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                  Última Marca
                </Text>
                <Text
                  style={{
                    color: "#22c55e",
                    fontSize: 20,
                    fontWeight: "bold",
                    marginTop: 2,
                  }}
                >
                  {latest.toFixed(1)} {tipo === "fuerza" ? "kg" : "cm"}
                </Text>
              </View>
            </View>
          );
        })()}
      </View>

      {/* History */}
      <View
        style={{
          marginTop: 20,
          backgroundColor: "rgba(31, 41, 55, 0.6)",
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: "rgba(107, 114, 128, 0.3)",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            fontWeight: "600",
            marginBottom: 12,
          }}
        >
          Historial de Marcas
        </Text>

        {currentChart.records
          .slice()
          .reverse()
          .map((record, idx) => (
            <View
              key={record.id}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 8,
                borderBottomWidth:
                  idx < currentChart.records.length - 1 ? 1 : 0,
                borderBottomColor: "rgba(107, 114, 128, 0.2)",
              }}
            >
              <Text style={{ color: "#d1d5db", fontSize: 14 }}>
                {new Date(record.fecha).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
              <Text
                style={{ color: "#22c55e", fontSize: 16, fontWeight: "600" }}
              >
                {record.marca} {tipo === "fuerza" ? "kg" : "cm"}
              </Text>
            </View>
          ))}
      </View>

      {/* Dots */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 24,
          gap: 8,
        }}
      >
        {charts.map((_, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => setCurrentExerciseIndex(idx)}
            style={{
              width: idx === currentExerciseIndex ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor:
                idx === currentExerciseIndex
                  ? "#60a5fa"
                  : "rgba(167, 167, 167, 0.3)",
            }}
          />
        ))}
      </View>
    </ScrollView>
  );
}
