import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  PanResponder,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
const BLOCK_ORDER = ["Calentamiento", "Fuerza", "Estabilidad", "Cardio"];

export default function Exercises({ day }) {
  const [exercisesByBlock, setExercisesByBlock] = useState(null);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🧠 Refs para que PanResponder siempre vea el valor actualizado
  const selectedBlockIndexRef = useRef(0);
  const currentExerciseIndexRef = useRef(0);

  useEffect(() => {
    selectedBlockIndexRef.current = selectedBlockIndex;
  }, [selectedBlockIndex]);
  useEffect(() => {
    currentExerciseIndexRef.current = currentExerciseIndex;
  }, [currentExerciseIndex]);

  // Cargar usuario
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

  // Cargar ejercicios
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
          .order("catalogo_id", { ascending: true });

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
        selectedBlockIndexRef.current = firstIdx >= 0 ? firstIdx : 0;
        currentExerciseIndexRef.current = 0;
      } catch (err) {
        console.log("Error cargando ejercicios:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [day, userId]);

  // Swipe handler usando refs
  const handleSwipeExercise = (direction) => {
    if (!exercisesByBlock) return;
    const grouped = exercisesByBlock.grouped;
    let blockIdx = selectedBlockIndexRef.current;
    let exIdx = currentExerciseIndexRef.current;

    const currentBlock = BLOCK_ORDER[blockIdx];
    const exercises = grouped[currentBlock] || [];

    if (direction === "next") {
      if (exIdx < exercises.length - 1) {
        setCurrentExerciseIndex(exIdx + 1);
      } else {
        const nextBlock = findNextBlockWithExercises(blockIdx, 1, grouped);
        if (nextBlock !== -1) {
          setSelectedBlockIndex(nextBlock);
          setCurrentExerciseIndex(0);
        }
      }
    } else {
      if (exIdx > 0) {
        setCurrentExerciseIndex(exIdx - 1);
      } else {
        const prevBlock = findNextBlockWithExercises(blockIdx, -1, grouped);
        if (prevBlock !== -1) {
          const prevExercises = grouped[BLOCK_ORDER[prevBlock]] || [];
          setSelectedBlockIndex(prevBlock);
          setCurrentExerciseIndex(prevExercises.length - 1);
        }
      }
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 15,
      onPanResponderRelease: (_, g) => {
        if (g.dx < -50) handleSwipeExercise("next");
        else if (g.dx > 50) handleSwipeExercise("prev");
      },
    })
  ).current;

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
        {...panResponder.panHandlers}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>
          No hay ejercicios para este día
        </Text>
      </View>
    );

  return (
    <View
      {...panResponder.panHandlers}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 40,
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: "bold", color: "#fff" }}>
        {currentBlock}
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: "#ccc",
          marginVertical: 12,
          textAlign: "center",
        }}
      >
        {comment}
      </Text>

      {exercise.catalogo_ejercicios?.imagen && (
        <Image
          source={{ uri: exercise.catalogo_ejercicios.imagen }}
          style={{
            width: width * 0.9,
            height: height * 0.45,
            borderRadius: 16,
          }}
          resizeMode="cover"
        />
      )}

      <Text
        style={{
          fontSize: 22,
          fontWeight: "600",
          color: "#fff",
          marginTop: 20,
          textAlign: "center",
        }}
      >
        {exercise.catalogo_ejercicios?.nombre}
      </Text>
      <Text style={{ marginTop: 8, color: "#aaa" }}>
        Ejercicio {currentExerciseIndex + 1} de {exercises.length}
      </Text>
    </View>
  );
}
