import React, { useState } from "react";
import { View, Pressable, Text } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

type Tool = "pen" | "brush" | "erase";

type Stroke = {
  path: string;
  color: string;
  width: number;
  mode: Tool;
};

const COLORS = [
  "#000000",
  "#FF0000",
  "#00AAFF",
  "#00C851",
  "#FFBB33",
  "#AA66CC",
];

export default function AdvancedDrawer() {
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState("#000000");

  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);
  const [currentPath, setCurrentPath] = useState("");

  /* ---------------- TOOL CONFIG ---------------- */

  const getStrokeWidth = () => {
    if (tool === "brush") return 12;
    if (tool === "erase") return 20;
    return 4; // pen
  };

  const getStrokeColor = () => {
    if (tool === "erase") return "#FFFFFF";
    return color;
  };

  /* ---------------- DRAW LOGIC ---------------- */

  const beginPath = (path: string) => {
    setCurrentPath(path);
  };

  const updatePath = (path: string) => {
    setCurrentPath(path);
  };

  const endPath = (path: string) => {
    const newStroke: Stroke = {
      path,
      color: getStrokeColor(),
      width: getStrokeWidth(),
      mode: tool,
    };

    setStrokes((prev) => [...prev, newStroke]);
    setRedoStack([]); // reset redo
    setCurrentPath("");
  };

  const gesture = Gesture.Pan()
    .onBegin((e) => {
      runOnJS(beginPath)(`M ${e.x} ${e.y}`);
    })
    .onUpdate((e) => {
      runOnJS(updatePath)(`${currentPath} L ${e.x} ${e.y}`);
    })
    .onEnd(() => {
      runOnJS(endPath)(currentPath);
    });

  /* ---------------- ACTIONS ---------------- */

  const undo = () => {
    if (strokes.length === 0) return;

    const last = strokes[strokes.length - 1];
    setRedoStack((prev) => [...prev, last]);
    setStrokes((prev) => prev.slice(0, -1));
  };

  const redo = () => {
    if (redoStack.length === 0) return;

    const lastRedo = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setStrokes((prev) => [...prev, lastRedo]);
  };

  const clearAll = () => {
    setStrokes([]);
    setRedoStack([]);
  };

  /* ---------------- UI ---------------- */

  return (
    <View className="flex-1 bg-green-100 p-4">
      {/* Toolbar */}
      <View className="flex-row justify-between mb-4 bg-white p-3 rounded-2xl">

        <Pressable onPress={() => setTool("pen")}>
          <Text className={tool === "pen" ? "font-bold" : ""}>Pen</Text>
        </Pressable>

        <Pressable onPress={() => setTool("brush")}>
          <Text className={tool === "brush" ? "font-bold" : ""}>Brush</Text>
        </Pressable>

        <Pressable onPress={() => setTool("erase")}>
          <Text className={tool === "erase" ? "font-bold" : ""}>Erase</Text>
        </Pressable>

        <Pressable onPress={undo}>
          <Text>Undo</Text>
        </Pressable>

        <Pressable onPress={redo}>
          <Text>Redo</Text>
        </Pressable>

        <Pressable onPress={clearAll}>
          <Text>Clear</Text>
        </Pressable>
      </View>

      {/* Color Palette */}
      <View className="flex-row mb-4">
        {COLORS.map((c) => (
          <Pressable
            key={c}
            onPress={() => setColor(c)}
            className="w-8 h-8 rounded-full mr-3"
            style={{
              backgroundColor: c,
              borderWidth: color === c ? 3 : 0,
              borderColor: "#000",
            }}
          />
        ))}
      </View>

      {/* Canvas */}
      <GestureDetector gesture={gesture}>
        <View className="flex-1 bg-white rounded-3xl overflow-hidden">
          <Svg height="500" width="500">
            {strokes.map((stroke, index) => (
              <Path
                key={index}
                d={stroke.path}
                stroke={stroke.color}
                strokeWidth={stroke.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity={stroke.mode === "brush" ? 0.6 : 1}
              />
            ))}

            {currentPath !== "" && (
              <Path
                d={currentPath}
                stroke={getStrokeColor()}
                strokeWidth={getStrokeWidth()}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity={tool === "brush" ? 0.6 : 1}
              />
            )}
          </Svg>
        </View>
      </GestureDetector>
    </View>
  );
}