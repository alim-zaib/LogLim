# ARCHITECTURE.md

## Architecture goal

LogLim should be simple to build now and flexible enough to change later.

The key architectural goal is:

> Supabase is used for v1, but the app must not be tightly coupled to Supabase.

The UI should not know where data comes from. It should call services/hooks. Services should call a storage abstraction. Supabase should be one storage implementation.

## High-level architecture

```text
Expo React Native app
        |
        v
Screens and components
        |
        v
Hooks / services
        |
        v
Storage interface
        |
        v
Supabase storage adapter
        |
        v
Supabase Auth + Postgres
```

Later, the final layer could be swapped:

```text
Storage interface
        |
        +-- Supabase adapter
        +-- Firebase adapter
        +-- Local SQLite adapter
        +-- Custom API adapter
```

## App clients

### Mobile app

Primary client.

- Built with Expo React Native.
- Used mostly on iPhone.
- Must stay simple and low-friction.
- Should be Expo Go compatible during early development.

### Web dashboard

Later client.

- Used occasionally from PC.
- Can be built with React, Next.js, Expo Web, or a separate simple web app.
- Should use the same Supabase backend and ideally shared domain types.
- Does not need to be built in v1 unless explicitly requested.

## Suggested folder structure

Use this as the target structure. Adapt if the Expo starter template differs.

```text
src/
  app/
    navigation/
      AppNavigator.tsx
      routes.ts
    screens/
      HomeScreen.tsx
      DailyNotesScreen.tsx
      GymScreen.tsx
      SkincareScreen.tsx
      SupplementsScreen.tsx
      NutritionScreen.tsx
      WeightScreen.tsx
      SettingsScreen.tsx

  components/
    common/
      AppButton.tsx
      AppCard.tsx
      AppInput.tsx
      AppTextArea.tsx
      EmptyState.tsx
      Screen.tsx
      SectionHeader.tsx
      Pill.tsx
      DateSwitcher.tsx
    modules/
      notes/
      gym/
      items/
      nutrition/
      weight/

  domain/
    types.ts
    constants.ts
    defaults.ts

  services/
    notesService.ts
    gymService.ts
    itemService.ts
    nutritionService.ts
    weightService.ts
    authService.ts

  storage/
    LogLimStorage.ts
    storageClient.ts
    supabase/
      supabaseClient.ts
      supabaseStorage.ts
      mappers.ts
      errors.ts

  hooks/
    useDailyNote.ts
    useGymSessions.ts
    useTrackableItems.ts
    useDailyItemLogs.ts
    useAuth.ts

  theme/
    colours.ts
    spacing.ts
    typography.ts
    shadows.ts

  utils/
    dates.ts
    ids.ts
    arrays.ts
    errors.ts
```

## Layer responsibilities

### 1. Screens

Screens are top-level UI routes.

Responsibilities:
- compose components
- display loading/error/empty states
- call hooks/services
- manage local UI state
- handle navigation

Screens should not:
- call Supabase directly
- import database row types
- know about SQL table names
- perform complex data mapping

Example allowed:

```ts
const { note, saveNote, loading } = useDailyNote(selectedDate);
```

Example not allowed:

```ts
const { data } = await supabase.from("daily_notes").select("*");
```

### 2. Components

Components should be reusable and visual.

Responsibilities:
- display data
- handle UI interactions
- emit callbacks

Components should not:
- fetch data directly
- mutate backend state directly
- contain storage-specific logic

### 3. Hooks

Hooks connect UI to services.

Responsibilities:
- load data for screens
- expose loading/error state
- call service functions
- refresh state after mutations
- keep screens readable

Hooks may call services, but should not call Supabase directly.

### 4. Services

Services contain application logic.

Examples:
- creating a daily note
- normalising date strings
- checking required fields
- sorting history
- deciding default gym template values
- converting UI inputs into domain inputs

Services call the storage interface.

Services should not:
- render UI
- import React components
- use Supabase query syntax directly

### 5. Storage interface

The storage interface defines what the app needs from persistence.

It should use domain types, not database row types.

Example:

```ts
export interface LogLimStorage {
  getDailyNote(date: ISODate): Promise<DailyNote | null>;
  upsertDailyNote(input: UpsertDailyNoteInput): Promise<DailyNote>;
}
```

### 6. Supabase adapter

The Supabase adapter implements the storage interface.

Responsibilities:
- execute Supabase queries
- map database rows to domain types
- map domain input to database rows
- handle Supabase-specific errors
- enforce auth assumptions
- hide snake_case database fields from the rest of the app

## Domain types vs database rows

Use camelCase in app domain types:

```ts
export type DailyNote = {
  id: string;
  userId: string;
  date: ISODate;
  content: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  deletedAt: ISODateTime | null;
};
```

Use snake_case in Supabase tables:

```ts
type DailyNoteRow = {
  id: string;
  user_id: string;
  date: string;
  content: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};
```

Mapping belongs in:

```text
src/storage/supabase/mappers.ts
```

## State management

Start simple.

Use:
- React local state
- custom hooks
- service calls

Do not add Redux, Zustand, MobX, TanStack Query, or other state libraries unless the app becomes complex enough to justify them.

A later version could add TanStack Query for:
- caching
- refetching
- optimistic updates
- shared request state

But v1 should not require it.

## Navigation approach

Use the simplest approach available.

Possible options:

1. Expo Router
2. React Navigation
3. Single-screen prototype with tabs/cards first

For v1, a simple tab-like home with module screens is enough.

Suggested routes:

```text
Home
Daily Notes
Gym
Skincare
Supplements
Settings
```

Calories and Weight can be placeholders or omitted until implemented.

## Authentication architecture

Use Supabase Auth in v1.

Auth responsibilities should be isolated in:

```text
src/services/authService.ts
src/hooks/useAuth.ts
src/storage/supabase/supabaseClient.ts
```

UI should not manually manage Supabase sessions across many files.

V1 auth can be simple:

- login screen
- email/password or magic link
- remember session
- sign out in settings

Since this is a private app, registration can be minimal.

## Data fetching patterns

For each module:

1. screen calls hook
2. hook calls service
3. service calls storage
4. storage calls Supabase
5. storage maps row to domain type
6. hook updates UI state

Example:

```text
DailyNotesScreen
  -> useDailyNote(date)
    -> notesService.getNoteForDate(date)
      -> storage.getDailyNote(date)
        -> supabase.from("daily_notes")
```

## Mutation patterns

For mutations:

1. UI collects input
2. screen/component calls hook action
3. hook calls service mutation
4. service validates/normalises
5. storage persists
6. hook refreshes or updates local state

Example:

```text
Save note button
  -> saveNote(content)
    -> notesService.upsertDailyNote({ date, content })
      -> storage.upsertDailyNote(...)
```

## Offline support

Do not implement full offline-first sync in v1.

V1 source of truth:

```text
Supabase cloud database
```

Later offline-first architecture:

```text
Local SQLite database
  -> sync queue
    -> cloud backend
```

Prepare for future offline sync by using:

- stable IDs
- `createdAt`
- `updatedAt`
- `deletedAt`
- service/storage abstraction
- soft deletes

Do not build sync conflict resolution until needed.

## Error handling architecture

Use three levels:

### Storage errors

Backend-specific.

Example:
- Supabase network error
- auth expired
- RLS denied
- duplicate constraint

Handled/mapped in storage adapter.

### Service errors

App-specific.

Example:
- missing note date
- empty required workout name
- invalid weight value
- invalid calorie value

Handled in services.

### UI errors

User-facing.

Example:
- "Could not save note. Try again."
- "You need to sign in again."
- "Workout name is required."

Do not display raw Supabase errors directly unless debugging.

## Date handling

Use ISO date strings.

Definitions:

```ts
type ISODate = string;     // "2026-05-06"
type ISODateTime = string; // full ISO timestamp
```

Use local date for daily logs, not UTC date, because the user thinks in local days.

Create helpers:

```ts
getTodayISODate(): ISODate
formatDisplayDate(date: ISODate): string
addDays(date: ISODate, amount: number): ISODate
isDateInCurrentWeek(date: ISODate): boolean
```

Be careful with timezone boundaries. Daily logs should not accidentally shift date because of UTC conversion.

## Design for future backend switching

To keep migration easier:

- Keep domain types backend-agnostic.
- Keep table/collection names out of UI.
- Keep auth assumptions isolated.
- Avoid Supabase RPCs unless needed.
- Avoid business-critical database triggers.
- Do not make UI depend on Supabase realtime.
- Keep export/import on the roadmap.

## Build phases at architecture level

### Foundation phase

- Expo app setup
- TypeScript
- basic theme
- screen shell
- Supabase client
- auth session handling
- storage interface
- Supabase adapter skeleton

### First real module

- Daily Notes
- proves auth
- proves Supabase read/write
- proves date-based history

### Reusable item module

- Trackable items
- item categories
- daily item logs
- used by skincare and supplements

### Gym module

- workout sessions
- muscles
- history

### Later modules

- calories/protein
- weight
- web dashboard
- export/import
- offline caching

## Implementation rule for Codex

When implementing any feature, do not jump ahead into unrelated modules.

For example:

- If asked to implement Daily Notes, do not build calories or weight.
- If asked to implement Skincare, reuse trackable items instead of inventing a new unrelated pattern.
- If asked to improve UI, do not change database schema unless required.
- If asked to change storage, do not scatter backend-specific logic into screens.

Keep changes narrow and consistent with the docs.
