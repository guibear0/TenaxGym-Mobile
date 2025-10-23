import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import DaySelector from "../sections/DaySelector";
import Exercises from "../sections/Exercises";

export default function DailyExercisesScreen() {
  const [day, setDay] = useState(1);

  return (
    <LinearGradient
      colors={["#1a1a1a", "#1e40af", "#4f46e5"]}
      style={{ flex: 1 }}
    >
      <DaySelector day={day} onDayChange={setDay} />
      <Exercises day={day} />
    </LinearGradient>
  );
}
