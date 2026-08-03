import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Filter } from "../../types";

interface FilterChipProps {
  filter: Filter;
  isSelected: boolean;
  onToggle: (filter: Filter) => void;
}

/**
 * A single toggleable filter chip.
 * Screen reader announces: "Beginner, filter, selected/not selected".
 */
export default function FilterChip({
  filter,
  isSelected,
  onToggle,
}: FilterChipProps) {
  return (
    <TouchableOpacity
      testID={`filter-${filter.id}`}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${filter.label} filter`}
      accessibilityState={{ selected: isSelected }}
      accessibilityHint="Toggles this filter on or off"
      {...(Platform.OS === "web" ? { "aria-pressed": isSelected } : {})}
      onPress={() => onToggle(filter)}
      style={[styles.chip, isSelected && styles.selectedChip]}
      activeOpacity={0.7}
    >
      <Text
        style={[styles.label, isSelected && styles.selectedLabel]}
        numberOfLines={1}
      >
        {filter.label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create<{
  chip: ViewStyle;
  selectedChip: ViewStyle;
  label: TextStyle;
  selectedLabel: TextStyle;
}>({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  } as ViewStyle,
  selectedChip: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  } as ViewStyle,
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#4B5563",
  } as TextStyle,
  selectedLabel: {
    color: "#FFFFFF",
    fontWeight: "600",
  } as TextStyle,
});
