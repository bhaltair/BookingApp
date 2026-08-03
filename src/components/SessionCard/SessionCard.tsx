import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Session } from "../../types";

interface SessionCardProps {
  session: Session;
  isSelected: boolean;
  onSelect: (session: Session) => void;
  cardSpacing: number;
  isTablet: boolean;
  cardWidth: number;
}

const difficultyColors: Record<string, string> = {
  Beginner: "#10B981",
  Intermediate: "#F59E0B",
  Advanced: "#EF4444",
};

/**
 * SessionCard displays a single bookable session with full accessibility.
 *
 * Screen reader announces:
 * "Strength Session 3, 5 of 20 spots available, Intermediate, 45 minutes, button, selected/not selected"
 */
export default function SessionCard({
  session,
  isSelected,
  onSelect,
  cardSpacing,
  isTablet,
  cardWidth,
}: SessionCardProps) {
  const spotsLabel =
    session.openSpots === 0
      ? "Full"
      : `${session.openSpots} of ${session.totalSpots} spots available`;

  const a11yLabel = `${session.title}, ${spotsLabel}, ${session.difficulty}, ${session.duration} minutes`;

  return (
    <TouchableOpacity
      testID={`session-card-${session.id}`}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityState={{ selected: isSelected }}
      accessibilityHint="Selects this session to view details"
      {...(Platform.OS === "web" ? { "aria-pressed": isSelected } : {})}
      onPress={() => onSelect(session)}
      style={[
        styles.card,
        { marginBottom: cardSpacing, width: cardWidth },
        isTablet && styles.cardTablet,
        isSelected ? styles.cardSelected : styles.cardDefault,
      ]}
      activeOpacity={0.7}
    >
      {/* Top row: title + difficulty badge */}
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={2}>
          {session.title}
        </Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: difficultyColors[session.difficulty] ?? "#6B7280" },
          ]}
          accessible={false}
        >
          <Text style={styles.badgeText}>{session.difficulty}</Text>
        </View>
      </View>

      {/* Bottom row: spots + duration */}
      <View style={styles.footerRow}>
        <Text
          style={[
            styles.spots,
            session.openSpots === 0 && styles.spotsFull,
          ]}
          numberOfLines={1}
        >
          {session.openSpots === 0 ? "Full" : `${session.openSpots} open`}
        </Text>
        <Text style={styles.duration} numberOfLines={1}>
          {session.duration} min
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create<{
  card: ViewStyle;
  cardTablet: ViewStyle;
  cardDefault: ViewStyle;
  cardSelected: ViewStyle;
  headerRow: ViewStyle;
  title: TextStyle;
  badge: ViewStyle;
  badgeText: TextStyle;
  footerRow: ViewStyle;
  spots: TextStyle;
  spotsFull: TextStyle;
  duration: TextStyle;
}>({
  card: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  } as ViewStyle,
  cardTablet: {
    padding: 20,
  } as ViewStyle,
  cardDefault: {
    borderColor: "#E5E7EB",
  } as ViewStyle,
  cardSelected: {
    borderColor: "#4F46E5",
    borderWidth: 2,
    backgroundColor: "#EEF2FF",
  } as ViewStyle,
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  } as ViewStyle,
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    flex: 1,
    marginRight: 8,
  } as TextStyle,
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    flexShrink: 0,
  } as ViewStyle,
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
  } as TextStyle,
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  } as ViewStyle,
  spots: {
    fontSize: 14,
    fontWeight: "500",
    color: "#059669",
  } as TextStyle,
  spotsFull: {
    color: "#EF4444",
  } as TextStyle,
  duration: {
    fontSize: 13,
    color: "#6B7280",
  } as TextStyle,
});
