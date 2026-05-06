# AGENTS.md

## Project

This repository is for **LogLim**.

LogLim is a private personal tracking app for one user. It is designed to make quick daily logging easy, calm, and low-friction. The app starts with a small set of practical modules:

- Daily Notes
- Gym Tracker
- Skincare Tracker
- Supplement Tracker
- Calories / Protein Tracker
- Weight Tracker

The app will use **Expo React Native** for the mobile client and **Supabase** for v1 cloud sync, so data can be accessed from the phone and later from a PC/web dashboard.

## Required reading before changes

Before making any code changes, read these files:

- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/DATA_MODEL.md`
- `docs/SUPABASE.md`
- `docs/UI_UX.md`
- `docs/ROADMAP.md`

If the task touches a specific module, re-read the relevant section in these docs before editing.

## Core principles

1. **Simplicity first**
   - LogLim is for one private user.
   - Avoid building broad generic productivity features.
   - Avoid unnecessary forms, settings, dashboards, analytics, or flows.
   - The main usage pattern should be: open app, log quickly, close app.

2. **Calm and minimal UI**
   - The app should feel quiet, sleek, and personal.
   - Prefer simple cards, soft spacing, clear labels, and muted colours.
   - Avoid gamification, streak pressure, aggressive colours, and clutter.

3. **Cloud sync, but replaceable backend**
   - Supabase is the v1 backend.
   - Do not couple UI components directly to Supabase.
   - Screens/components must call app services or hooks.
   - App services must call a storage abstraction.
   - Supabase-specific code belongs in a Supabase adapter only.
   - The app should be able to switch later to Firebase, local-first SQLite sync, or a custom backend by replacing the storage adapter.

4. **Historical data matters**
   - Logs must persist.
   - The app must make previous days easy to browse.
   - Date-based history is a core product feature, not an afterthought.

5. **Portable data model**
   - Use simple domain fields: `id`, `userId`, `date`, `createdAt`, `updatedAt`, `deletedAt`.
   - Use ISO date strings.
   - Keep domain types independent from Supabase naming.
   - Convert between app camelCase and database snake_case inside the storage adapter.

6. **TypeScript by default**
   - Use TypeScript throughout.
   - Avoid `any` unless there is a clear, isolated reason.
   - Domain types should live in a shared location.
   - Validate inputs at service boundaries where practical.

7. **Expo compatibility**
   - Keep the app Expo Go compatible unless explicitly instructed otherwise.
   - Do not add native modules that require a custom development build unless the task explicitly approves it.
   - Do not add unnecessary external packages.

8. **British spelling**
   - Use British spelling in user-facing text where applicable, e.g. "favourite", "organise", "colour".

## Expected repo structure

The exact Expo starter structure may differ, but the app should converge towards this shape:

```text
src/
  app/
    navigation/
    screens/
  components/
    common/
    modules/
  domain/
    types.ts
    constants.ts
  services/
    notesService.ts
    gymService.ts
    itemService.ts
    nutritionService.ts
    weightService.ts
  storage/
    LogLimStorage.ts
    storageClient.ts
    supabase/
      supabaseClient.ts
      supabaseStorage.ts
      mappers.ts
  hooks/
  utils/
  theme/
```

If the project uses Expo Router, adapt the screen/navigation structure while keeping the same layering.

## Layering rules

### UI layer

Allowed:
- React Native components
- local component state
- custom hooks
- calling services/hooks

Not allowed:
- direct `supabase.from(...)` calls
- raw database row shapes
- business rules that belong in services
- hardcoded storage assumptions

### Service layer

Allowed:
- business operations
- input normalisation
- calling storage abstraction
- app-level validation
- sorting/filtering where it is not database-specific

Not allowed:
- direct React UI logic
- hardcoded screen behaviour
- Supabase-specific query syntax unless the service itself is explicitly storage-specific, which should be avoided

### Storage layer

Allowed:
- Supabase calls
- database row mapping
- backend-specific errors
- auth/session persistence
- RLS-aware queries

Not allowed:
- UI components
- screen-specific logic
- styling

## Storage abstraction requirement

Create and use a storage interface such as:

```ts
export interface LogLimStorage {
  getCurrentUserId(): Promise<string | null>;

  getDailyNote(date: string): Promise<DailyNote | null>;
  upsertDailyNote(input: UpsertDailyNoteInput): Promise<DailyNote>;
  listDailyNotes(params?: ListByDateRangeParams): Promise<DailyNote[]>;

  createGymSession(input: CreateGymSessionInput): Promise<GymSession>;
  updateGymSession(id: string, input: UpdateGymSessionInput): Promise<GymSession>;
  listGymSessions(params?: ListByDateRangeParams): Promise<GymSession[]>;
  deleteGymSession(id: string): Promise<void>;

  listTrackableItems(category?: TrackableCategory): Promise<TrackableItem[]>;
  createTrackableItem(input: CreateTrackableItemInput): Promise<TrackableItem>;
  updateTrackableItem(id: string, input: UpdateTrackableItemInput): Promise<TrackableItem>;
  archiveTrackableItem(id: string): Promise<void>;

  listDailyItemLogs(params: ListDailyItemLogsParams): Promise<DailyItemLog[]>;
  upsertDailyItemLog(input: UpsertDailyItemLogInput): Promise<DailyItemLog>;
  deleteDailyItemLog(id: string): Promise<void>;

  createFoodEntry(input: CreateFoodEntryInput): Promise<FoodEntry>;
  listFoodEntries(params?: ListByDateRangeParams): Promise<FoodEntry[]>;
  deleteFoodEntry(id: string): Promise<void>;

  upsertWeightEntry(input: UpsertWeightEntryInput): Promise<WeightEntry>;
  listWeightEntries(params?: ListByDateRangeParams): Promise<WeightEntry[]>;
  deleteWeightEntry(id: string): Promise<void>;
}
```

The exact method names can evolve, but the UI must depend on services, not raw Supabase.

## Coding style

- Prefer small, readable functions.
- Avoid clever abstractions unless they remove real duplication.
- Keep naming direct and obvious.
- Do not prematurely optimise.
- Do not introduce full state-management libraries unless needed.
- Use plain React state/hooks first.
- Add comments only when they clarify important decisions or non-obvious logic.
- Prefer explicit types over inference for exported functions and domain objects.

## Error handling

- Show user-friendly errors in the UI.
- Log technical errors in development where helpful.
- Do not swallow errors silently.
- Keep backend-specific error mapping inside storage adapters/services.
- Avoid exposing raw database error messages directly to the user.

## Security and privacy

- Treat all LogLim data as private.
- Use Supabase Row Level Security.
- Every user-owned table must include `user_id`.
- Users should only be able to select/insert/update/delete their own rows.
- Do not add public sharing features.
- Do not add social features.
- Do not add public profiles.

## Testing expectations

At minimum, after implementing a feature:

- TypeScript should compile.
- Expo should start.
- The main screen should render without crashing.
- Data should persist after app restart.
- Data should appear after reloading/fetching from Supabase.
- Empty states should look intentional.
- Error states should be understandable.

If adding tests, prefer focused tests for:
- mappers
- date helpers
- service logic
- storage abstraction boundaries

## Reporting after changes

After making changes, report:

1. Files changed.
2. What was implemented.
3. Commands to run.
4. What to test in Expo Go.
5. Any assumptions or limitations.
6. Any follow-up tasks recommended.

Do not claim something is complete unless it has been implemented.
