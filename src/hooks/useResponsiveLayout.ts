import { useWindowDimensions } from "react-native";
import { DeviceClass, LayoutConfig } from "../types";

/**
 * Returns the device class based on screen width.
 *  - small: < 375px (compact phones)
 *  - standard: 375–768px (most phones)
 *  - tablet: > 768px
 */
export function getDeviceClass(width: number): DeviceClass {
  if (width < 375) return "small";
  if (width < 768) return "standard";
  return "tablet";
}

/**
 * Returns layout configuration based on the current screen width.
 * Adjusts columns, padding, and spacing for different device classes.
 */
export function useResponsiveLayout(): LayoutConfig & { deviceClass: DeviceClass } {
  const { width } = useWindowDimensions();
  const deviceClass = getDeviceClass(width);

  switch (deviceClass) {
    case "small":
      return {
        columns: 1,
        containerPadding: 12,
        cardSpacing: 6,
        dateChipSpacing: 6,
        deviceClass,
      };
    case "standard":
      return {
        columns: 1,
        containerPadding: 16,
        cardSpacing: 8,
        dateChipSpacing: 10,
        deviceClass,
      };
    case "tablet":
      return {
        columns: width > 1024 ? 3 : 2,
        containerPadding: 24,
        cardSpacing: 12,
        dateChipSpacing: 12,
        deviceClass,
      };
  }
}
