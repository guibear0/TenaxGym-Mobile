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

export default function ChartView({ data, config }) {
  const [currentChartIndex, setCurrentChartIndex] = useState(0);

  if (!data || data.length === 0) {
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
          No hay suficientes datos para mostrar gráficas
        </Text>
        <Text
          style={{
            color: "#6b7280",
            fontSize: 14,
            marginTop: 8,
            textAlign: "center",
          }}
        >
          Añade al menos 2 registros
        </Text>
      </View>
    );
  }

  // Preparar datos ordenados por fecha
  const sortedData = [...data].sort(
    (a, b) => new Date(a.fecha) - new Date(b.fecha)
  );

  // Crear todas las gráficas disponibles
  const allCharts = [];

  // Gráficas individuales
  if (config.chartConfig?.singles) {
    config.chartConfig.singles.forEach((fieldName) => {
      const field = config.fields.find((f) => f.name === fieldName);
      if (!field) return;

      const values = sortedData
        .map((record) => parseFloat(record[fieldName]))
        .filter((v) => !isNaN(v));

      if (values.length > 0) {
        allCharts.push({
          title: field.label,
          type: "single",
          data: {
            labels: sortedData
              .filter((record) => record[fieldName])
              .map((record) =>
                new Date(record.fecha).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "short",
                })
              ),
            datasets: [
              {
                data: values,
                color: (opacity = 1) => `rgba(96, 165, 250, ${opacity})`,
                strokeWidth: 3,
              },
            ],
          },
        });
      }
    });
  }

  // Gráficas pareadas (izquierda/derecha)
  if (config.chartConfig?.pairs) {
    config.chartConfig.pairs.forEach((pair) => {
      const leftValues = sortedData
        .map((record) => parseFloat(record[pair.left]))
        .filter((v) => !isNaN(v));

      const rightValues = sortedData
        .map((record) => parseFloat(record[pair.right]))
        .filter((v) => !isNaN(v));

      if (leftValues.length > 0 && rightValues.length > 0) {
        allCharts.push({
          title: pair.label,
          type: "paired",
          data: {
            labels: sortedData
              .filter((record) => record[pair.left] && record[pair.right])
              .map((record) =>
                new Date(record.fecha).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "short",
                })
              ),
            datasets: [
              {
                data: leftValues,
                color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`, // Rojo para izquierda
                strokeWidth: 2,
              },
              {
                data: rightValues,
                color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // Verde para derecha
                strokeWidth: 2,
              },
            ],
            legend: ["Izquierda", "Derecha"],
          },
        });
      }
    });
  }

  if (allCharts.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        <Text style={{ color: "#9ca3af", fontSize: 16 }}>
          No hay datos para mostrar
        </Text>
      </View>
    );
  }

  const currentChart = allCharts[currentChartIndex];

  const handlePrevChart = () => {
    if (currentChartIndex > 0) {
      setCurrentChartIndex(currentChartIndex - 1);
    }
  };

  const handleNextChart = () => {
    if (currentChartIndex < allCharts.length - 1) {
      setCurrentChartIndex(currentChartIndex + 1);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingBottom: 40,
      }}
    >
      {/* Chart Navigation */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <TouchableOpacity
          onPress={handlePrevChart}
          disabled={currentChartIndex === 0}
          style={{
            padding: 8,
            opacity: currentChartIndex === 0 ? 0.3 : 1,
          }}
        >
          <ChevronLeft size={28} color="#fff" />
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
            {currentChart.title}
          </Text>
          <Text style={{ color: "#9ca3af", fontSize: 12, marginTop: 4 }}>
            {currentChartIndex + 1} de {allCharts.length}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleNextChart}
          disabled={currentChartIndex === allCharts.length - 1}
          style={{
            padding: 8,
            opacity: currentChartIndex === allCharts.length - 1 ? 0.3 : 1,
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
          alignItems: "center", // centramos el chart
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
            color: (opacity = 1) => `rgba(96, 165, 250, ${opacity})`, // azul brillante
            labelColor: (opacity = 1) => `rgba(209, 213, 219, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "5",
              strokeWidth: "2",
              stroke: "#1f2937",
            },
            propsForBackgroundLines: {
              stroke: "rgba(107, 114, 128, 0.2)",
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />

        {/* Legend for paired charts */}
        {currentChart.type === "paired" && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 24,
              marginTop: 12,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <View
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: "rgba(239, 68, 68, 1)",
                  borderRadius: 8,
                }}
              />
              <Text style={{ color: "#d1d5db", fontSize: 14 }}>Izquierda</Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <View
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: "rgba(34, 197, 94, 1)",
                  borderRadius: 8,
                }}
              />
              <Text style={{ color: "#d1d5db", fontSize: 14 }}>Derecha</Text>
            </View>
          </View>
        )}
      </Animated.View>

      {/* Stats Summary */}
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

        {currentChart.data.datasets.map((dataset, idx) => {
          const values = dataset.data;
          const min = Math.min(...values);
          const max = Math.max(...values);
          const avg = (
            values.reduce((a, b) => a + b, 0) / values.length
          ).toFixed(1);
          const latest = values[values.length - 1];
          const change = values.length > 1 ? latest - values[0] : 0;

          return (
            <View key={idx} style={{ marginBottom: idx === 0 ? 12 : 0 }}>
              {currentChart.type === "paired" && (
                <Text
                  style={{
                    color: idx === 0 ? "#ef4444" : "#22c55e",
                    fontSize: 14,
                    fontWeight: "600",
                    marginBottom: 8,
                  }}
                >
                  {currentChart.data.legend[idx]}
                </Text>
              )}

              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <View style={{ flex: 1, minWidth: "45%" }}>
                  <Text style={{ color: "#9ca3af", fontSize: 12 }}>Mínimo</Text>
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 16,
                      fontWeight: "600",
                      marginTop: 2,
                    }}
                  >
                    {min.toFixed(1)}
                  </Text>
                </View>

                <View style={{ flex: 1, minWidth: "45%" }}>
                  <Text style={{ color: "#9ca3af", fontSize: 12 }}>Máximo</Text>
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 16,
                      fontWeight: "600",
                      marginTop: 2,
                    }}
                  >
                    {max.toFixed(1)}
                  </Text>
                </View>

                <View style={{ flex: 1, minWidth: "45%" }}>
                  <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                    Promedio
                  </Text>
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 16,
                      fontWeight: "600",
                      marginTop: 2,
                    }}
                  >
                    {avg}
                  </Text>
                </View>

                <View style={{ flex: 1, minWidth: "45%" }}>
                  <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                    Cambio Total
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
                    {change.toFixed(1)}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
