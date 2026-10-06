import React, { useEffect, useState, useRef } from "react";
import { View, Text, Image, Dimensions, ActivityIndicator } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImageOff } from "lucide-react-native";
import PaginationDots from "../components/ui/PaginationDots";
import SwipeHint from "../components/ui/SwipeHint";

const { width, height } = Dimensions.get("window");
const BLOCK_ORDER = ["Calentamiento", "Fuerza", "Estabilidad", "Cardio"];

export default function Exercises({ day }) {
  const [exercisesByBlock, setExercisesByBlock] = useState(null);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const touchStartX = useRef(0);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await AsyncStorage.getItem("userProfile");
      const user = data ? JSON.parse(data) : null;
      setUserId(user?.id);
    };
    fetchUser();
  }, []);

  const normalizeType = (raw) => {
    if (!raw) return null;
    const val = raw.toString().toUpperCase();
    if (val.includes("CALENTAMIENTO")) return "Calentamiento";
    if (val.includes("FUERZA")) return "Fuerza";
    if (val.includes("ESTABILIDAD")) return "Estabilidad";
    if (val.includes("CARDIO")) return "Cardio";
    return null;
  };

  const findNextBlockWithExercises = (start, dir, grouped) => {
    let idx = start + dir;
    while (idx >= 0 && idx < BLOCK_ORDER.length) {
      const block = BLOCK_ORDER[idx];
      if ((grouped?.[block]?.length || 0) > 0) return idx;
      idx += dir;
    }
    return -1;
  };

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: exercises } = await supabase
          .from("ejercicios_cliente")
          .select("*, catalogo_ejercicios(nombre, tipo, imagen)")
          .eq("client_id", userId)
          .eq("numero_dia", day)
          .order("orden", { ascending: true });

        const { data: comments } = await supabase
          .from("comentarios_bloque")
          .select("*")
          .eq("client_id", userId)
          .eq("numero_dia", day);

        const grouped = {};
        const blockComments = {};
        BLOCK_ORDER.forEach((b) => {
          grouped[b] = [];
          blockComments[b] = "Sin comentarios del entrenador";
        });

        exercises?.forEach((ex) => {
          const type = normalizeType(ex.catalogo_ejercicios?.tipo);
          if (type && grouped[type]) grouped[type].push(ex);
        });

        comments?.forEach((c) => {
          const type = normalizeType(c.tipo);
          if (type && c.comentario?.trim()) {
            blockComments[type] = `Comentario del entrenador: ${c.comentario}`;
          }
        });

        const firstIdx = BLOCK_ORDER.findIndex(
          (b) => (grouped[b]?.length || 0) > 0
        );

        setExercisesByBlock({ grouped, blockComments });
        setSelectedBlockIndex(firstIdx >= 0 ? firstIdx : 0);
        setCurrentExerciseIndex(0);
      } catch (err) {
        console.log("Error cargando ejercicios:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [day, userId]);

  const goNext = () => {
    if (!exercisesByBlock) return;
    const grouped = exercisesByBlock.grouped;
    const currentBlock = BLOCK_ORDER[selectedBlockIndex];
    const exercises = grouped[currentBlock] || [];

    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      const nextBlock = findNextBlockWithExercises(
        selectedBlockIndex,
        1,
        grouped
      );
      if (nextBlock !== -1) {
        setSelectedBlockIndex(nextBlock);
        setCurrentExerciseIndex(0);
      }
    }
  };

  const goPrev = () => {
    if (!exercisesByBlock) return;
    const grouped = exercisesByBlock.grouped;
    const currentBlock = BLOCK_ORDER[selectedBlockIndex];

    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    } else {
      const prevBlock = findNextBlockWithExercises(
        selectedBlockIndex,
        -1,
        grouped
      );
      if (prevBlock !== -1) {
        const prevExercises = grouped[BLOCK_ORDER[prevBlock]] || [];
        setSelectedBlockIndex(prevBlock);
        setCurrentExerciseIndex(Math.max(0, prevExercises.length - 1));
      }
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.nativeEvent.pageX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.nativeEvent.pageX;
    const distance = touchStartX.current - touchEndX;
    const threshold = 50;

    if (distance > threshold) goNext();
    else if (distance < -threshold) goPrev();
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );

  if (!exercisesByBlock) return null;

  const currentBlock = BLOCK_ORDER[selectedBlockIndex];
  const exercises = exercisesByBlock.grouped[currentBlock] || [];
  const exercise = exercises[currentExerciseIndex];
  const comment = exercisesByBlock.blockComments[currentBlock];

  if (!exercise)
    return (
      <View
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>
          No hay ejercicios para este día
        </Text>
      </View>
    );

  const imageHeight = height * 0.45;
  const imageWidth = width * 0.9;

  return (
    <View
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingBottom: 40,
      }}
    >
      {/* Header Block */}
      <View style={{ alignItems: "center", marginBottom: 16 }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", color: "#fff" }}>
          {currentBlock}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#9ca3af",
            marginTop: 8,
            textAlign: "center",
            paddingHorizontal: 24,
            lineHeight: 20,
          }}
        >
          {comment}
        </Text>
      </View>

      {/* Image */}
      {exercise.catalogo_ejercicios?.imagen ? (
        <Image
          source={{ uri: exercise.catalogo_ejercicios.imagen }}
          style={{
            width: imageWidth,
            height: imageHeight,
            borderRadius: 16,
            marginBottom: 16,
          }}
          resizeMode="cover"
        />
      ) : (
        <Animated.View
          entering={FadeIn.duration(600)}
          exiting={FadeOut.duration(400)}
          style={{
            width: imageWidth,
            height: imageHeight,
            borderRadius: 16,
            backgroundColor: "#1f2937",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <ImageOff size={64} color="#9CA3AF" />
        </Animated.View>
      )}

      {/* Exercise Info Card */}
      <View
        style={{
          backgroundColor: "rgba(31, 41, 55, 0.8)",
          borderRadius: 16,
          padding: 20,
          width: imageWidth,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: "rgba(107, 114, 128, 0.3)",
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            color: "#fff",
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          {exercise.catalogo_ejercicios?.nombre}
        </Text>

        {/* Details Grid */}
        <View style={{ gap: 12 }}>
          {exercise.repeticiones && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(107, 114, 128, 0.2)",
              }}
            >
              <Text style={{ color: "#9ca3af", fontSize: 14 }}>
                Repeticiones
              </Text>
              <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>
                {exercise.repeticiones}
              </Text>
            </View>
          )}

          {exercise.descanso && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(107, 114, 128, 0.2)",
              }}
            >
              <Text style={{ color: "#9ca3af", fontSize: 14 }}>Descanso</Text>
              <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>
                {exercise.descanso}
              </Text>
            </View>
          )}

          {exercise.duracion && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 8,
              }}
            >
              <Text style={{ color: "#9ca3af", fontSize: 14 }}>Duración</Text>
              <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>
                {exercise.duracion}
              </Text>
            </View>
          )}
        </View>

        <Text
          style={{
            marginTop: 16,
            color: "#60a5fa",
            textAlign: "center",
            fontSize: 13,
          }}
        >
          Ejercicio {currentExerciseIndex + 1} de {exercises.length}
        </Text>
      </View>

      {/* Navigation */}
      <PaginationDots
        currentIndex={currentExerciseIndex}
        totalDots={exercises.length}
        containerStyle={{ marginBottom: 12 }}
      />

      <SwipeHint dependencies={[currentExerciseIndex, selectedBlockIndex]} />
    </View>
  );
}
