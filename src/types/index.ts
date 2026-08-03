// Type definitions for the Booking feature

export interface Session {
  id: string;
  title: string;
  openSpots: number;
  totalSpots: number;
  difficulty: Difficulty;
  duration: number; // in minutes
}

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface DateSlot {
  key: string;
  label: string; // e.g. "Mon"
  fullLabel: string; // e.g. "Monday, Aug 3"
  date: number; // day of month
}

export interface Filter {
  id: string;
  label: string;
  value: boolean;
}

export interface LayoutConfig {
  columns: number;
  containerPadding: number;
  cardSpacing: number;
  dateChipSpacing: number;
  cardWidth: number;
}

export type DeviceClass = "small" | "standard" | "tablet";
