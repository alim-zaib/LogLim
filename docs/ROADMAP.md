# ROADMAP.md

## Roadmap strategy

Build LogLim in small vertical slices.

Each phase should produce something usable and testable.

Avoid trying to build the full app in one pass.

Recommended build logic:

1. Foundation
2. Auth + Supabase connection
3. Daily Notes
4. Reusable item bucket system
5. Skincare
6. Supplements
7. Gym
8. Calories/protein
9. Weight
10. Web dashboard
11. Export/import
12. Offline/local-first improvements

## Phase 0: Project setup

### Goal

Create a clean Expo React Native TypeScript project and add project guidance docs.

### Tasks

- Create Expo app.
- Ensure TypeScript works.
- Add `AGENTS.md`.
- Add `docs/` files.
- Add basic README.
- Confirm `npx expo start` works.
- Confirm Expo Go opens the app on iPhone.

### Acceptance criteria

- App starts successfully.
- Home screen renders.
- Docs exist in repo.
- Codex can read and follow docs.

### Suggested Codex prompt

```text
Read AGENTS.md and all docs under docs/.

Set up the initial LogLim Expo React Native TypeScript project structure.

Do not implement full features yet.

Create:
- src/domain
- src/services
- src/storage
- src/theme
- src/components/common
- basic Home screen
- basic calm dark theme

Keep it Expo Go compatible.
Report files changed and commands to run.
```

## Phase 1: Supabase foundation

### Goal

Connect LogLim to Supabase through an isolated storage layer.

### Tasks

- Install required Supabase dependencies.
- Add environment variable support.
- Create Supabase client.
- Create auth service.
- Create storage interface.
- Create Supabase storage adapter skeleton.
- Add basic login/sign-out.
- Add loading/auth states.
- Add basic error handling.

### Acceptance criteria

- User can sign in.
- Session persists after app reload.
- User can sign out.
- Supabase imports are isolated to storage/auth infrastructure.
- UI does not call `supabase.from(...)` directly.

### Suggested Codex prompt

```text
Read AGENTS.md and docs/ARCHITECTURE.md and docs/SUPABASE.md.

Implement Supabase foundation for LogLim.

Requirements:
- Use Supabase for v1.
- Keep Supabase behind storage/auth infrastructure.
- Do not call Supabase directly from screens.
- Add auth session handling.
- Add a simple login screen.
- Add sign out in a minimal settings area.
- Use environment variables:
  EXPO_PUBLIC_SUPABASE_URL
  EXPO_PUBLIC_SUPABASE_ANON_KEY

Do not implement app modules yet, except any minimal data call needed to confirm auth.
```

## Phase 2: Database schema

### Goal

Create Supabase database tables and RLS policies.

### Tasks

- Apply schema from `DATA_MODEL.md` and `SUPABASE.md`.
- Enable RLS on all tables.
- Add policies for own-row access.
- Add updated_at trigger.
- Add indexes.
- Confirm authenticated user can insert/select own data.
- Confirm unauthenticated access is blocked.

### Acceptance criteria

- Tables exist.
- RLS enabled.
- Policies work.
- App can read/write at least one test row through storage adapter.
- No service role key in mobile app.

### Suggested Codex prompt

```text
Read docs/DATA_MODEL.md and docs/SUPABASE.md.

Create a single SQL migration file for LogLim's initial Supabase schema.

Include:
- tables
- indexes
- updated_at trigger
- RLS enablement
- own-row policies
- optional profile creation trigger

Do not change app UI in this task.
```

## Phase 3: Daily Notes module

### Goal

Implement the first real module end-to-end.

Daily Notes proves:
- auth works
- Supabase storage works
- date-based records work
- history works
- app remains low-friction

### Tasks

- Add domain types for daily notes.
- Add storage methods:
  - getDailyNote
  - upsertDailyNote
  - listDailyNotes
- Add notes service.
- Add `useDailyNote` hook.
- Add Daily Notes screen.
- Add date switcher.
- Add recent notes list.
- Add save state.
- Add empty state.

### Acceptance criteria

- Opens today's note by default.
- User can type and save today's note.
- Previous notes can be opened.
- Data persists after app restart.
- Data is stored in Supabase.
- UI remains simple.

### Suggested Codex prompt

```text
Read AGENTS.md and docs/PRODUCT.md, docs/ARCHITECTURE.md, docs/DATA_MODEL.md, docs/UI_UX.md.

Implement the Daily Notes module only.

Requirements:
- Open today's note by default.
- Save one note per date.
- Browse recent previous notes.
- Use storage/service abstraction.
- Do not call Supabase directly from UI.
- Keep the UI calm and simple.
- Do not implement gym, skincare, supplements, calories, or weight in this task.
```

## Phase 4: Trackable item bucket foundation

### Goal

Create a reusable item system for skincare and supplements.

### Tasks

- Add domain types:
  - TrackableItem
  - TrackableCategory
  - DailyItemLog
  - LogPeriod
- Add storage methods:
  - listTrackableItems
  - createTrackableItem
  - updateTrackableItem
  - archiveTrackableItem
  - listDailyItemLogs
  - upsertDailyItemLog
  - deleteDailyItemLog
- Add item service.
- Add reusable item checklist component.
- Add manage items component/screen.

### Acceptance criteria

- User can create trackable items.
- User can list items by category.
- User can archive items.
- Daily logs can be created/toggled.
- This system can support skincare and supplements.

### Suggested Codex prompt

```text
Read docs/ARCHITECTURE.md and docs/DATA_MODEL.md.

Implement the reusable trackable item foundation for skincare and supplements.

Do not build full skincare or supplement screens yet unless needed for a minimal test.

Requirements:
- Create domain types.
- Add storage adapter methods.
- Add item service.
- Add reusable item checklist component.
- Keep category support for skincare and supplement.
- Keep Supabase behind the storage adapter.
```

## Phase 5: Skincare module

### Goal

Implement skincare tracking using the reusable item bucket system.

### Tasks

- Add Skincare screen.
- Load active skincare items.
- Add item creation flow.
- Toggle morning/night usage for selected date.
- Add optional daily note support if using item log notes or a simple category note.
- Show previous day logs.
- Add calm empty state.

### Acceptance criteria

- User can add skincare items.
- User can tap items used in the morning.
- User can tap items used at night.
- Logs persist.
- Previous dates can be browsed.
- No unnecessary skincare complexity.

### Suggested Codex prompt

```text
Read docs/PRODUCT.md and docs/UI_UX.md.

Implement the Skincare module using the existing trackable item system.

Requirements:
- Use category = skincare.
- Support Morning and Night periods.
- User can add skincare items.
- User can tap items to mark used for the selected date and period.
- User can browse previous dates.
- Keep the UI simple, calm, and quick.
- Do not add product photos, routines, reminders, or medical advice.
```

## Phase 6: Supplement module

### Goal

Implement supplement tracking using the reusable item bucket system.

### Tasks

- Add Supplements screen.
- Load active supplement items.
- Add item creation flow.
- Toggle taken status for selected date.
- Support optional default dose/time.
- Support optional dose override/note.
- Show previous day logs.

### Acceptance criteria

- User can add supplements.
- User can mark supplements taken.
- Logs persist.
- Previous dates can be browsed.
- UI does not give medical advice.

### Suggested Codex prompt

```text
Read docs/PRODUCT.md and docs/UI_UX.md.

Implement the Supplement module using the existing trackable item system.

Requirements:
- Use category = supplement.
- User can add supplement items with optional default dose/default time.
- User can tap items to mark taken for the selected date.
- User can browse previous dates.
- Keep dose/time optional.
- Do not give medical advice.
- Keep the UI simple and low-friction.
```

## Phase 7: Gym module

### Goal

Implement gym session tracking.

### Tasks

- Add gym domain types.
- Add constants for muscles and default templates.
- Add storage methods:
  - createGymSession
  - updateGymSession
  - listGymSessions
  - deleteGymSession
- Add gym service.
- Add Gym screen.
- Add template chips.
- Add muscle chips.
- Add notes.
- Add recent history.

### Acceptance criteria

- User can log a gym session.
- Templates fill suggested muscles.
- User can modify muscles.
- User can use custom workout names.
- Sessions persist.
- History is visible.
- No exercise-level tracking in v1.

### Suggested Codex prompt

```text
Read docs/PRODUCT.md, docs/DATA_MODEL.md, and docs/UI_UX.md.

Implement the Gym Tracker module.

Requirements:
- Date defaults to today.
- Templates:
  - Back & Biceps
  - Legs & Shoulders
  - Chest & Triceps
- Templates are suggestions only, not restrictions.
- User can enter a custom workout name.
- User can select/deselect muscle groups.
- Optional notes.
- Save session.
- Show recent sessions in reverse chronological order.
- Use storage/service abstraction.
- Do not add sets/reps/weight tracking yet.
```

## Phase 8: Home screen refinement

### Goal

Make the home screen useful after core modules exist.

### Tasks

- Show today's date.
- Show module cards.
- Show real status only:
  - note exists
  - gym logged
  - skincare logged
  - supplements logged
- Add quick navigation.
- Remove placeholder/fake stats.

### Acceptance criteria

- Home screen is calm and useful.
- No fake modules.
- No fake analytics.
- Tapping a module opens it quickly.

### Suggested Codex prompt

```text
Read docs/UI_UX.md.

Refine the LogLim home screen.

Requirements:
- Show today's date.
- Show module cards for implemented modules only.
- Show simple real statuses from existing data.
- Keep the UI calm, dark, and minimal.
- Do not add fake stats or unrelated modules.
```

## Phase 9: Calories / Protein module

### Goal

Add simple manual nutrition logging.

### Tasks

- Add food entry storage methods.
- Add nutrition service.
- Add Calories screen.
- Add entry form:
  - item name
  - calories
  - protein grams
  - notes optional
- Show daily totals.
- Show entries for selected date.
- Add delete entry.

### Acceptance criteria

- User can add manual food entries.
- Daily calories/protein totals calculate correctly.
- Entries persist.
- Previous dates can be browsed.
- No full food database or barcode scanning.

### Suggested Codex prompt

```text
Implement the Calories / Protein module as a simple manual logger.

Requirements:
- Manual entries only.
- Fields: item name, calories, protein grams, optional notes.
- Show today's totals.
- Browse previous dates.
- Use storage/service abstraction.
- Do not add barcode scanning, food database, meal plans, or macro coaching.
```

## Phase 10: Weight module

### Goal

Add simple weight tracking.

### Tasks

- Add weight storage methods.
- Add weight service.
- Add Weight screen.
- Add date + weight entry.
- Show history.
- Add simple trend later if useful.

### Acceptance criteria

- User can save one weight per date.
- User can update a date's weight.
- History persists.
- Previous entries display clearly.

### Suggested Codex prompt

```text
Implement the Weight Tracker module.

Requirements:
- Date defaults to today.
- User can enter weight in kg.
- One weight entry per date.
- Show previous weight entries.
- Use storage/service abstraction.
- Keep UI simple.
- Do not add complex analytics yet.
```

## Phase 11: PC/web dashboard

### Goal

Allow occasional PC access.

### Options

1. Expo Web
2. Separate React app
3. Next.js dashboard

### Suggested approach

Do not build until the mobile app proves useful.

When built, it should share:
- Supabase project
- database schema
- domain types if possible
- design principles

### Web dashboard scope

Start with:
- sign in
- view daily notes
- view gym history
- view skincare/supplements history
- edit notes

Do not try to make the web dashboard full-featured immediately.

## Phase 12: Export/import backup

### Goal

Allow data ownership and backend migration.

### Tasks

- Export all data as JSON.
- Import JSON backup.
- Show export version.
- Include all modules.
- Keep export shape based on domain types, not raw Supabase rows.

### Acceptance criteria

- User can download/export all data.
- Export can be inspected as JSON.
- Import can restore data in a test environment.
- Export supports future backend switching.

## Phase 13: Offline/local-first improvements

### Goal

Make the app work better without internet.

### Approach

Only do this after the cloud-first version is stable.

Possible architecture:

```text
Local SQLite cache
Pending mutations queue
Sync service
Conflict resolution
Supabase/custom backend
```

### Requirements

- stable IDs
- updatedAt
- deletedAt
- sync status
- conflict rules

This is intentionally not v1.

## Phase order recommendation

Strong recommended order:

```text
0. Project setup
1. Supabase foundation
2. Database schema
3. Daily Notes
4. Trackable item foundation
5. Skincare
6. Supplements
7. Gym
8. Home refinement
9. Calories/protein
10. Weight
11. Web dashboard
12. Export/import
13. Offline/local-first
```

## What not to build early

Do not build these before core modules are useful:

- AI summaries
- charts everywhere
- push notifications
- streaks
- reminders
- calendar integrations
- photos
- voice notes
- social sharing
- multi-user support
- finance tracking
- project tracking
- complex exercise tracking
- full food database

## Definition of done for any module

A module is done when:

- it has a clear screen
- it saves to Supabase
- it loads historical data
- it handles empty states
- it handles basic errors
- it has no direct Supabase calls in UI
- it follows the calm design system
- it can be tested in Expo Go
- it does not introduce unrelated features

## Recommended Codex intelligence

For simple UI tweaks:
- medium/high is enough

For architecture, Supabase schema, storage abstraction, and multi-file implementation:
- high or extra high is appropriate

For debugging sync/auth/storage issues:
- high or extra high is appropriate

Always ask Codex to:
- read the docs first
- keep changes narrow
- report changed files
- report testing steps
