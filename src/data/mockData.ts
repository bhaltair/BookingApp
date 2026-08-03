import { DateSlot, Filter, Session, Difficulty } from "../types";

const difficulties: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];

export const mockDates: DateSlot[] = [
  { key: "mon", label: "Mon", fullLabel: "Monday, August 3", date: 3 },
  { key: "tue", label: "Tue", fullLabel: "Tuesday, August 4", date: 4 },
  { key: "wed", label: "Wed", fullLabel: "Wednesday, August 5", date: 5 },
  { key: "thu", label: "Thu", fullLabel: "Thursday, August 6", date: 6 },
  { key: "fri", label: "Fri", fullLabel: "Friday, August 7", date: 7 },
];

export const mockSessions: Session[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `session_${i}`,
  title: `Strength Session ${i}`,
  openSpots: Math.floor(Math.random() * 20) + 1,
  totalSpots: 20,
  difficulty: difficulties[i % 3],
  duration: [30, 45, 60][i % 3],
}));

export const mockFilters: Filter[] = [
  { id: "all", label: "All Levels", value: true },
  { id: "beginner", label: "Beginner", value: false },
  { id: "intermediate", label: "Intermediate", value: false },
  { id: "advanced", label: "Advanced", value: false },
  { id: "morning", label: "Morning", value: false },
  { id: "afternoon", label: "Afternoon", value: false },
];
