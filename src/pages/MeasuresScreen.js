import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Plus } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";
import DataManager from "../components/DataManager";

export default function MeasuresScreen({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

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

  // Configuración específica para perímetros
  const measureConfig = {
    title: "Perímetros Corporales",
    tableName: "perimetros",
    fields: [
      {
        name: "pecho",
        label: "Pecho (cm)",
        type: "single",
        keyboardType: "numeric",
      },
      {
        name: "cintura",
        label: "Cintura (cm)",
        type: "single",
        keyboardType: "numeric",
      },
      {
        name: "cadera",
        label: "Cadera (cm)",
        type: "single",
        keyboardType: "numeric",
      },
      {
        name: "biceps",
        label: "Bíceps (cm)",
        type: "paired",
        left: "biceps_izq",
        right: "biceps_der",
        keyboardType: "numeric",
      },
      {
        name: "biceps_contraido",
        label: "Bíceps Contraído (cm)",
        type: "paired",
        left: "biceps_contraido_izq",
        right: "biceps_contraido_der",
        keyboardType: "numeric",
      },
      {
        name: "muslo",
        label: "Muslo (cm)",
        type: "paired",
        left: "muslo_izq",
        right: "muslo_der",
        keyboardType: "numeric",
      },
      {
        name: "gemelo",
        label: "Gemelo (cm)",
        type: "paired",
        left: "gemelo_izq",
        right: "gemelo_der",
        keyboardType: "numeric",
      },
    ],
    chartConfig: {
      singles: ["pecho", "cintura", "cadera"],
      pairs: [
        { left: "biceps_izq", right: "biceps_der", label: "Bíceps" },
        {
          left: "biceps_contraido_izq",
          right: "biceps_contraido_der",
          label: "Bíceps Contraído",
        },
        { left: "muslo_izq", right: "muslo_der", label: "Muslo" },
        { left: "gemelo_izq", right: "gemelo_der", label: "Gemelo" },
      ],
    },
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
            {measureConfig.title}
          </Text>
        </View>

        {/* Data Manager Component */}
        {userId && <DataManager userId={userId} config={measureConfig} />}
      </View>
    </LinearGradient>
  );
}
