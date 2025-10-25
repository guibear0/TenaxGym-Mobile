import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Dumbbell, PersonStanding } from "lucide-react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function TestsScreen({ navigation }) {
  return (
    <LinearGradient
      colors={["#1a1a1a", "#1e40af", "#4f46e5"]}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, paddingTop: 60, paddingHorizontal: 24 }}>
        {/* Header */}
        <View
          style={{
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <Text
            style={{
              fontSize: 44, // Aumentado para resaltar más
              fontWeight: "bold",
              color: "#fff",
              textAlign: "center",
            }}
          >
            Tests
          </Text>
        </View>

        {/* Description */}
        <Animated.View
          entering={FadeInUp.duration(400)}
          style={{ marginBottom: -40 }}
        >
          <Text
            style={{
              fontSize: 30, // Más grande para mejor legibilidad
              color: "#d1d5db",
              textAlign: "center",
              lineHeight: 30,
            }}
          >
            Registra y monitorea tus marcas en tests de fuerza y movilidad
          </Text>
        </Animated.View>

        {/* Cards */}
        <View style={{ flex: 1, justifyContent: "center", gap: 20 }}>
          {/* Fuerza */}
          <Animated.View entering={FadeInUp.duration(400).delay(100)}>
            <TouchableOpacity
              onPress={() => navigation.navigate("StrengthTests")}
              activeOpacity={0.8}
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.2)",
                borderWidth: 2,
                borderColor: "rgba(239, 68, 68, 0.5)",
                borderRadius: 20,
                padding: 24,
                alignItems: "center",
              }}
            >
              <Dumbbell size={64} color="#ef4444" />
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#fff",
                  marginTop: 16,
                  marginBottom: 8,
                }}
              >
                Tests de Fuerza
              </Text>
              <Text
                style={{ fontSize: 14, color: "#d1d5db", textAlign: "center" }}
              >
                Registra tus récords en ejercicios de fuerza
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Movilidad */}
          <Animated.View entering={FadeInUp.duration(400).delay(200)}>
            <TouchableOpacity
              onPress={() => navigation.navigate("MobilityTests")}
              activeOpacity={0.8}
              style={{
                backgroundColor: "rgba(232, 209, 107, 0.3)",
                borderWidth: 2,
                borderColor: "rgba(232, 209, 107, 0.5)",
                borderRadius: 20,
                padding: 24,
                alignItems: "center",
              }}
            >
              <PersonStanding size={64} color="#e8d16b" />
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#fff",
                  marginTop: 16,
                  marginBottom: 8,
                }}
              >
                Tests de Movilidad
              </Text>
              <Text
                style={{ fontSize: 14, color: "#d1d5db", textAlign: "center" }}
              >
                Mide tu progreso en flexibilidad y rango de movimiento
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </LinearGradient>
  );
}
