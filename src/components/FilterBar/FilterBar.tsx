import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import FilterChip from "./FilterChip";
import { Filter } from "../../types";

interface FilterBarProps {
  filters: Filter[];
  onToggleFilter: (filter: Filter) => void;
  activeFilterCount: number;
}

/**
 * FilterBar displays a horizontal scrollable list of filter chips.
 *
 * Accessibility:
 * - The bar header communicates active filter count.
 * - Each chip has a descriptive label, selected state, and toggle hint.
 */
export default function FilterBar({
  filters,
  onToggleFilter,
  activeFilterCount,
}: FilterBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow} accessible={false}>
        <Text style={styles.heading} accessibilityRole="header">
          Filters
        </Text>
        {activeFilterCount > 0 && (
          <View style={styles.countBadge} accessible={false}>
            <Text style={styles.countText}>
              {activeFilterCount} active
            </Text>
          </View>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        accessible={false}
      >
        {filters.map((filter) => (
          <FilterChip
            key={filter.id}
            filter={filter}
            isSelected={filter.value}
            onToggle={onToggleFilter}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create<{
  container: ViewStyle;
  headerRow: ViewStyle;
  heading: TextStyle;
  countBadge: ViewStyle;
  countText: TextStyle;
  scrollContent: ViewStyle;
}>({
  container: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 4,
  } as ViewStyle,
  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  } as TextStyle,
  countBadge: {
    marginLeft: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: "#EDE9FE",
  } as ViewStyle,
  countText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#5B21B6",
  } as TextStyle,
  scrollContent: {
    paddingVertical: 4,
    gap: 8,
    alignItems: "center",
  } as ViewStyle,
});
