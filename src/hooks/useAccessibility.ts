import { AccessibilityInfo, AccessibilityState } from "react-native";
import { useRef, useCallback } from "react";

/**
 * Build a composite accessibility label that combines multiple pieces
 * of information into a single, screen-reader-friendly string.
 */
export function buildAccessibilityLabel(...parts: (string | number | undefined)[]): string {
  return parts.filter(Boolean).join(", ");
}

/**
 * Helper to create the standard selected-state object for
 * accessible buttons / selectable items.
 */
export function selectedState(isSelected: boolean): AccessibilityState {
  return { selected: isSelected };
}

/**
 * Announce a message via the accessibility live region.
 * Useful for communicating state changes (e.g. "Date changed to Tuesday").
 */
export function useAccessibilityAnnouncement() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const announce = useCallback((message: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      AccessibilityInfo.announceForAccessibility(message);
    }, 100);
  }, []);

  return announce;
}
