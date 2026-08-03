# Cross-Platform Feature Architecture & Accessibility Refactor

## Overview

This project refactors a "Session Booking" screen from a single 130-line component into a modular, accessible, and cross-platform-ready React Native (Expo) application. The original implementation was functional but suffered from poor accessibility, no responsive strategy, and zero component reuse.

## Tech Stack

- **React Native** (via Expo SDK 52)
- **TypeScript**
- **React Native FlatList** with `numColumns` for responsive grids

## Project Structure

```
src/
├── components/
│   ├── DateSelector/       # Date picker (horizontal chips)
│   │   ├── DateSelector.tsx
│   │   └── DateChip.tsx
│   ├── SessionCard/        # Bookable session card
│   │   └── SessionCard.tsx
│   ├── FilterBar/          # Horizontal filter chips
│   │   ├── FilterBar.tsx
│   │   └── FilterChip.tsx
│   └── layout/
│       └── ResponsiveContainer.tsx
├── hooks/
│   ├── useResponsiveLayout.ts   # Screen-width-based layout config
│   └── useAccessibility.ts       # a11y label builder + announcements
├── types/
│   └── index.ts                 # Session, DateSlot, Filter, etc.
├── data/
│   └── mockData.ts              # Extracted mock data
└── screens/
    └── BookingScreen.tsx        # Main screen — state management + composition
```

## Audit Findings (Part A)

### P0 — Critical

| Issue | Description |
|-------|-------------|
| **Missing accessibility labels** | All `TouchableOpacity` elements lacked `accessibilityLabel`, `accessibilityRole`, and `accessibilityState`. Screen reader users had no way to understand button purpose. |
| **Empty filter button** | The first `TouchableOpacity` rendered `<Text></Text>` with no content — invisible to both sighted and assistive-tech users. |
| **Unlabeled arrow buttons** | `<` and `>` buttons had no `onPress` handler and no accessibility label. Screen readers announced "less than sign" / "greater than sign". |

### P1 — High Impact

| Issue | Description |
|-------|-------------|
| **Selection state not announced** | Selected date/session was only conveyed via `fontWeight` and `borderWidth`. Screen readers could not detect which item was selected. |
| **No responsive layout** | Fixed `padding: 16` everywhere. Tablet screens showed a single-column list, wasting horizontal space. |
| **No focus order management** | Components were not ordered for logical keyboard/screen-reader navigation. |

### P2 — Maintainability

| Issue | Description |
|-------|-------------|
| **Monolithic component** | All logic (dates, sessions, filters, layout) was in one 130-line component. Nothing was reusable. |
| **Hardcoded mock data** | Mock data was inline in the component file, making it impossible to swap with a real API. |
| **No type definitions** | No interfaces or types for domain entities (Session, DateSlot, etc.). |

## Structural Decisions (Part B)

### Why the new architecture?

1. **Component decomposition**: Split the monolith into `DateSelector`, `SessionCard`, and `FilterBar` — each with a single responsibility. This enables independent testing, reuse across screens, and parallel development.

2. **State hoisting**: All state (`selectedDate`, `selectedSession`, `filters`) lives in `BookingScreen`. Child components are pure presentational components receiving props. This makes the data flow predictable and testable.

3. **Hook-based responsive layout**: `useResponsiveLayout()` uses `useWindowDimensions()` to compute columns, padding, and spacing at runtime. This reacts to orientation changes and device class transitions without re-renders of the entire tree.

4. **Type-safe domain models**: `Session`, `DateSlot`, `Filter`, and `LayoutConfig` interfaces live in `types/index.ts`, ensuring contracts between components.

5. **Data layer separation**: Mock data moved to `data/mockData.ts`, making it trivial to replace with API calls later.

## Accessibility Decisions (Part C)

| Improvement | What & Why |
|-------------|-----------|
| **Descriptive `accessibilityLabel`** | Every interactive element has a meaningful label. Session cards announce `"Strength Session 3, 5 of 20 spots available, Intermediate, 45 minutes"`. |
| **`accessibilityRole`** | All tappable items use `role="button"`. Headers use `role="header"` for navigation hierarchy. |
| **`accessibilityState`** | Selected/unselected state is communicated via `{ selected: isSelected }` — screen readers announce "selected" or "not selected". |
| **`accessibilityHint`** | Hints explain what happens when a control is activated, e.g. "Selects this date to show available sessions". |
| **Removed redundant arrow buttons** | The `<` / `>` buttons had no handler and added confusion. Removed entirely — `ScrollView` supports native swipe gestures. |
| **Live announcements** | `useAccessibilityAnnouncement()` calls `AccessibilityInfo.announceForAccessibility()` on date/session/filter changes, so users hear confirmation of their actions. |
| **Empty state messaging** | When filters yield no results, a clear text message appears — also readable by screen readers. |

## Cross-Platform Decisions (Part D)

### Layout strategy

| Device class | Width range | Columns | Padding | Date selector | Filter bar |
|-------------|-------------|---------|---------|----------------|------------|
| Small phone | < 375px | 1 | 12px | Horizontal scroll | Horizontal scroll |
| Standard phone | 375–768px | 1 | 16px | Horizontal scroll | Horizontal scroll |
| Tablet | > 768px | 2–3 | 24px | Centered row (no scroll) | Horizontal scroll |

### How it adapts

- **FlatList `numColumns`**: Dynamically set from `useResponsiveLayout`. The `key` prop forces remount when column count changes (React Native requirement).
- **Card padding**: Tablet cards get `padding: 20` vs `padding: 16` on phones for better touch target spacing.
- **Date selector on tablet**: Chips center-align and wrap (`flexWrap: "wrap"`) instead of scrolling, since all 5 dates fit comfortably.
- **Container padding**: Scales from 12 → 16 → 24 across device classes.

## QA Validation Plan

| Test area | Method |
|-----------|--------|
| **Screen reader (iOS)** | Enable VoiceOver, navigate through dates → filters → sessions. Verify each element announces label + state. |
| **Screen reader (Android)** | Enable TalkBack, repeat the same flow. Verify `accessibilityState` announces "selected". |
| **Keyboard navigation** | Use external keyboard (iPad / Android tablet). Tab through elements in order: date → filter → session list. |
| **Small screen** | Test on iPhone SE (375px) and a <375px simulator. Verify no overflow, text truncation is graceful. |
| **Large screen** | Test on iPad (1024px+). Verify 2–3 column grid, centered dates, comfortable spacing. |
| **Orientation change** | Rotate portrait ↔ landscape on tablet. Verify columns adapt and layout reflows. |
| **Filter behavior** | Toggle filters, verify session list updates and empty state appears when no matches. |
| **State announcement** | With screen reader on, select a date and session — verify the announcement fires. |

## Trade-offs

| Area | What's simplified | Why |
|------|-----------------|-----|
| **Filters** | Morning/Afternoon filters use session index as a proxy, not real time data | Mock data has no timestamps; real implementation would filter by actual session time. |
| **Navigation** | No detail screen navigation — session selection only sets state | A real app would navigate to a detail page; kept minimal for scope. |
| **Theming** | Colors are hardcoded, not a theme system | A production app would use a theme provider; colors are centralized enough to swap easily. |
| **Testing** | No automated tests included | The assignment focuses on architecture and accessibility; unit tests would be the next step. |
| **RTL support** | Not explicitly handled | Production would need RTL layout direction support. |

## Getting Started

```bash
# Install dependencies
npm install

# Start the Expo dev server
npx expo start

# Press 'i' for iOS simulator, 'a' for Android emulator
# Or scan the QR code with the Expo Go app
```

## Time Spent

~3 hours (implementation + README)
# BookingApp
