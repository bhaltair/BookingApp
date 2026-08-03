import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ListRenderItem,
  ViewStyle,
  TextStyle,
} from "react-native";
import ResponsiveContainer from "../components/layout/ResponsiveContainer";
import DateSelector from "../components/DateSelector";
import SessionCard from "../components/SessionCard";
import FilterBar from "../components/FilterBar";
import { useResponsiveLayout } from "../hooks/useResponsiveLayout";
import { useAccessibilityAnnouncement } from "../hooks/useAccessibility";
import { mockDates, mockSessions, mockFilters } from "../data/mockData";
import { DateSlot, Filter, Session } from "../types";

export default function BookingScreen() {
  // --- State ---
  const [selectedDateKey, setSelectedDateKey] = useState(mockDates[0].key);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filter[]>(mockFilters);

  // --- Hooks ---
  const layout = useResponsiveLayout();
  const announce = useAccessibilityAnnouncement();

  const isTablet = layout.deviceClass === "tablet";

  // --- Derived data ---
  const selectedDate = mockDates.find((d) => d.key === selectedDateKey) ?? mockDates[0];

  const activeFilters = useMemo(
    () => filters.filter((f) => f.value && f.id !== "all"),
    [filters],
  );

  const filteredSessions = useMemo(() => {
    return mockSessions.filter((session) => {
      // If no active filters (or "all" is selected), show everything
      if (activeFilters.length === 0) return true;

      return activeFilters.some((f) => {
        if (f.id === "beginner") return session.difficulty === "Beginner";
        if (f.id === "intermediate") return session.difficulty === "Intermediate";
        if (f.id === "advanced") return session.difficulty === "Advanced";
        // Morning/Afternoon filters: use session index as a proxy for demo
        if (f.id === "morning") return parseInt(session.id.split("_")[1]) < 10;
        if (f.id === "afternoon") return parseInt(session.id.split("_")[1]) >= 10;
        return false;
      });
    });
  }, [activeFilters]);

  // --- Handlers ---
  const handleSelectDate = useCallback(
    (date: DateSlot) => {
      setSelectedDateKey(date.key);
      setSelectedSessionId(null);
      announce(`Selected ${date.fullLabel}`);
    },
    [announce],
  );

  const handleSelectSession = useCallback(
    (session: Session) => {
      setSelectedSessionId(session.id);
      announce(`Selected ${session.title}`);
    },
    [announce],
  );

  const handleToggleFilter = useCallback(
    (toggledFilter: Filter) => {
      setFilters((prev) => {
        // If "all" is selected, clear all others
        if (toggledFilter.id === "all") {
          const newFilters = prev.map((f) => ({
            ...f,
            value: f.id === "all",
          }));
          announce("All levels filter applied");
          return newFilters;
        }

        // Otherwise, toggle the individual filter and deactivate "all"
        const newFilters = prev.map((f) => {
          if (f.id === "all") return { ...f, value: false };
          if (f.id === toggledFilter.id) return { ...f, value: !f.value };
          return f;
        });

        // If nothing is selected, fall back to "all"
        const anyActive = newFilters.some((f) => f.value);
        if (!anyActive) {
          const resetFilters = newFilters.map((f) => ({
            ...f,
            value: f.id === "all",
          }));
          announce(`${toggledFilter.label} filter removed, showing all`);
          return resetFilters;
        }

        announce(`${toggledFilter.label} filter ${toggledFilter.value ? "removed" : "applied"}`);
        return newFilters;
      });
    },
    [announce],
  );

  // --- Renderers ---
  const renderSessionCard: ListRenderItem<Session> = useCallback(
    ({ item }) => (
      <SessionCard
        session={item}
        isSelected={selectedSessionId === item.id}
        onSelect={handleSelectSession}
        cardSpacing={layout.cardSpacing}
        isTablet={isTablet}
      />
    ),
    [selectedSessionId, handleSelectSession, layout.cardSpacing, isTablet],
  );

  const keyExtractor = useCallback((item: Session) => item.id, []);

  // --- Render ---
  return (
    <ResponsiveContainer padding={layout.containerPadding} gap={16}>
      {/* Screen title */}
      <View style={styles.titleBar}>
        <Text style={styles.screenTitle} accessibilityRole="header">
          Session Booking
        </Text>
        <Text style={styles.screenSubtitle} numberOfLines={1}>
          {filteredSessions.length} sessions available on {selectedDate.fullLabel}
        </Text>
      </View>

      {/* Date selector */}
      <DateSelector
        dates={mockDates}
        selectedDateKey={selectedDateKey}
        onSelectDate={handleSelectDate}
        chipSpacing={layout.dateChipSpacing}
        isTablet={isTablet}
      />

      {/* Filter bar */}
      <FilterBar
        filters={filters}
        onToggleFilter={handleToggleFilter}
        activeFilterCount={activeFilters.length}
      />

      {/* Session list */}
      <FlatList
        data={filteredSessions}
        keyExtractor={keyExtractor}
        renderItem={renderSessionCard}
        numColumns={layout.columns}
        key={`grid-${layout.columns}`}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No sessions match the current filters.
            </Text>
          </View>
        }
        accessible={false}
      />
    </ResponsiveContainer>
  );
}

const styles = StyleSheet.create<{
  titleBar: ViewStyle;
  screenTitle: TextStyle;
  screenSubtitle: TextStyle;
  emptyState: ViewStyle;
  emptyText: TextStyle;
}>({
  titleBar: {
    paddingHorizontal: 4,
    marginBottom: 8,
  } as ViewStyle,
  screenTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  } as TextStyle,
  screenSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  } as TextStyle,
  emptyState: {
    padding: 40,
    alignItems: "center",
  } as ViewStyle,
  emptyText: {
    fontSize: 15,
    color: "#9CA3AF",
    textAlign: "center",
  } as TextStyle,
});
