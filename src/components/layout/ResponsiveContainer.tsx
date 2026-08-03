import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  padding: number;
  columns?: number;
  gap?: number;
}

/**
 * ResponsiveContainer wraps content with adaptive padding and
 * optionally arranges children in a grid for tablet layouts.
 */
export default function ResponsiveContainer({
  children,
  padding,
  gap = 0,
}: ResponsiveContainerProps) {
  return (
    <View
      style={[styles.container, { padding, gap }]}
      accessible={false}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create<{ container: ViewStyle }>({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  } as ViewStyle,
});
