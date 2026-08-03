import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import DateChip from "./DateChip";
import { DateSlot } from "../../types";

interface DateSelectorProps {
  dates: DateSlot[];
  selectedDateKey: string;
  onSelectDate: (date: DateSlot) => void;
  chipSpacing: number;
  isTablet: boolean;
}

/**
 * Date selector component.
 * - On phones: horizontal scroll of date chips.
 * - On tablets: a centered row (no scroll needed if dates fit).
 *
 * Accessibility: each chip is a button with a full date label and
 * selected state announced via accessibilityState.
 */
export default function DateSelector({
  dates,
  selectedDateKey,
  onSelectDate,
  chipSpacing,
  isTablet,
}: DateSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading} accessibilityRole="header">
        Select a Date
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { gap: chipSpacing },
          isTablet && styles.tabletCenter,
        ]}
        accessible={false}
      >
        {dates.map((date) => (
          <DateChip
            key={date.key}
            date={date}
            isSelected={selectedDateKey === date.key}
            onSelect={onSelectDate}
            chipSpacing={0}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  scrollContent: {
    paddingVertical: 4,
  alignItems: "center",
  minHeight: 60,
  flexDirection: "row",
  // gap is used via the array, fallback below
  gap: 10,
  paddingHorizontal: 4,
  flexWrap: "wrap",
    // spread dates evenly on wide screens
    justifyContent: "flex-start",
  },
  tabletCenter: {
    justifyContent: "center",
  },
});
