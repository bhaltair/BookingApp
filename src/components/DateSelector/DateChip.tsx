import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  ViewStyle,
  TextStyle,
} from "react-native";
import { DateSlot } from "../../types";

interface DateChipProps {
  date: DateSlot;
  isSelected: boolean;
  onSelect: (date: DateSlot) => void;
  chipSpacing: number;
}

/**
 * A single selectable date button with full accessibility support.
 * Screen reader announces: "Monday, August 3, button, selected/not selected".
 * On web, aria-pressed is added as fallback since RNW doesn't map
 * accessibilityState.selected to aria-selected on buttons.
 */
export default function DateChip({
  date,
  isSelected,
  onSelect,
  chipSpacing,
}: DateChipProps) {
  return (
    <TouchableOpacity
      testID={`date-chip-${date.key}`}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={date.fullLabel}
      accessibilityState={{ selected: isSelected }}
      accessibilityHint="Selects this date to show available sessions"
      // Web fallback: RNW doesn't render aria-selected on buttons
      {...(Platform.OS === "web" ? { "aria-pressed": isSelected } : {})}
      onPress={() => onSelect(date)}
      style={[styles.chip, { marginRight: chipSpacing }, isSelected && styles.selectedChip]}
      activeOpacity={0.7}
    >
      <Text
        style={[styles.label, isSelected && styles.selectedLabel]}
        numberOfLines={1}
      >
        {date.label}
      </Text>
      <Text style={[styles.dateNumber, isSelected && styles.selectedDateNumber]}>
        {date.date}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create<{
  chip: ViewStyle;
  selectedChip: ViewStyle;
  label: TextStyle;
  selectedLabel: TextStyle;
  dateNumber: TextStyle;
  selectedDateNumber: TextStyle;
}>({
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    minWidth: 52,
  } as ViewStyle,
  selectedChip: {
    backgroundColor: "#4F46E5",
  } as ViewStyle,
  label: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  } as TextStyle,
  selectedLabel: {
    color: "#C7D2FE",
  } as TextStyle,
  dateNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 2,
  } as TextStyle,
  selectedDateNumber: {
    color: "#FFFFFF",
  } as TextStyle,
});
