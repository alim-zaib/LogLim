# DATA_MODEL.md

## Data model goals

The LogLim data model should be:

- simple
- relational where useful
- easy to query by date
- easy to sync across devices
- easy to migrate later
- suitable for Supabase/Postgres v1
- not overly tied to Supabase from the app's perspective

All user-owned records must include:

- `id`
- `user_id`
- `created_at`
- `updated_at`
- `deleted_at`

The app domain should convert these to camelCase:

- `id`
- `userId`
- `createdAt`
- `updatedAt`
- `deletedAt`

## Date model

Use two date concepts:

### Daily log date

For daily modules, use:

```text
date
```

Format:

```text
YYYY-MM-DD
```

Examples:

```text
2026-05-06
2026-05-07
```

This represents the user's local day.

### Timestamp

For creation/update metadata, use ISO timestamps.

In Postgres, use:

```sql
timestamptz
```

In TypeScript, use string:

```ts
type ISODateTime = string;
```

## Core tables

V1 and planned modules use these tables:

```text
profiles
daily_notes
gym_sessions
gym_session_muscles
trackable_items
daily_item_logs
food_entries
weight_entries
```

Calories and weight can be added later, but the model is included so the architecture can be planned properly.

## Table: profiles

### Purpose

Stores app-specific user profile data.

Supabase Auth stores auth users. `profiles` stores app-level metadata.

### Columns

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### Notes

- `id` equals `auth.users.id`.
- For this private app, this can stay minimal.

## Table: daily_notes

### Purpose

Stores one note per user per day.

### Columns

```sql
create table public.daily_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,

  constraint daily_notes_user_date_unique unique (user_id, date)
);
```

### Domain type

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

### Inputs

```ts
export type UpsertDailyNoteInput = {
  date: ISODate;
  content: string;
};
```

### Behaviour

- Each user can have only one note per date.
- Saving today's note should upsert by `(user_id, date)`.
- Empty content can be stored if useful, but the UI may choose not to show empty old notes.
- Soft delete can be used later if needed.

## Table: gym_sessions

### Purpose

Stores gym workout sessions.

### Columns

```sql
create table public.gym_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  workout_name text not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
```

### Domain type

```ts
export type GymSession = {
  id: string;
  userId: string;
  date: ISODate;
  workoutName: string;
  muscles: MuscleGroup[];
  notes: string | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  deletedAt: ISODateTime | null;
};
```

### Inputs

```ts
export type CreateGymSessionInput = {
  date: ISODate;
  workoutName: string;
  muscles: MuscleGroup[];
  notes?: string;
};

export type UpdateGymSessionInput = Partial<CreateGymSessionInput>;
```

## Table: gym_session_muscles

### Purpose

Stores muscles linked to each gym session.

This is separate from `gym_sessions` to keep the model relational and queryable.

### Columns

```sql
create table public.gym_session_muscles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  gym_session_id uuid not null references public.gym_sessions(id) on delete cascade,
  muscle text not null,
  created_at timestamptz not null default now(),

  constraint gym_session_muscles_unique unique (gym_session_id, muscle)
);
```

### Muscle groups

Use stable string values in the app.

```ts
export type MuscleGroup =
  | "back"
  | "biceps"
  | "chest"
  | "triceps"
  | "shoulders"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "abs"
  | "forearms"
  | "traps"
  | "lower_back"
  | "other";
```

Display labels should be separate:

```ts
export const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  back: "Back",
  biceps: "Biceps",
  chest: "Chest",
  triceps: "Triceps",
  shoulders: "Shoulders",
  quads: "Quads",
  hamstrings: "Hamstrings",
  glutes: "Glutes",
  calves: "Calves",
  abs: "Abs",
  forearms: "Forearms",
  traps: "Traps",
  lower_back: "Lower back",
  other: "Other",
};
```

## Table: trackable_items

### Purpose

Stores reusable items that can be logged daily.

Used for:

- skincare items
- supplement items

This avoids duplicating two similar systems.

### Columns

```sql
create table public.trackable_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in ('skincare', 'supplement')),
  name text not null,
  default_dose text,
  default_time text,
  notes text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
```

### Domain type

```ts
export type TrackableCategory = "skincare" | "supplement";

export type TrackableItem = {
  id: string;
  userId: string;
  category: TrackableCategory;
  name: string;
  defaultDose: string | null;
  defaultTime: string | null;
  notes: string | null;
  active: boolean;
  sortOrder: number;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  deletedAt: ISODateTime | null;
};
```

### Inputs

```ts
export type CreateTrackableItemInput = {
  category: TrackableCategory;
  name: string;
  defaultDose?: string;
  defaultTime?: string;
  notes?: string;
  sortOrder?: number;
};

export type UpdateTrackableItemInput = Partial<CreateTrackableItemInput> & {
  active?: boolean;
};
```

### Behaviour

- Items are user-defined.
- Items can be archived by setting `active = false` or `deleted_at`.
- Archived items should not appear in default daily checklists.
- Historical logs should still display the item name even if archived.

## Table: daily_item_logs

### Purpose

Stores daily item usage for skincare and supplements.

Examples:

- used SPF in the morning
- used tretinoin at night
- took finasteride at lunch
- took magnesium at night

### Columns

```sql
create table public.daily_item_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id uuid not null references public.trackable_items(id) on delete cascade,
  category text not null check (category in ('skincare', 'supplement')),
  date date not null,
  period text not null default 'anytime',
  status text not null default 'done',
  dose text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,

  constraint daily_item_logs_unique unique (user_id, item_id, date, period)
);
```

### Period values

Use these app values:

```ts
export type LogPeriod =
  | "morning"
  | "afternoon"
  | "evening"
  | "night"
  | "anytime";
```

For skincare V1, use:

- morning
- night

For supplements V1, use:

- anytime
- morning
- afternoon
- evening
- night

### Status values

Use these app values:

```ts
export type DailyItemStatus = "done" | "skipped";
```

V1 can mostly use `done`.

### Domain type

```ts
export type DailyItemLog = {
  id: string;
  userId: string;
  itemId: string;
  category: TrackableCategory;
  date: ISODate;
  period: LogPeriod;
  status: DailyItemStatus;
  dose: string | null;
  notes: string | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  deletedAt: ISODateTime | null;
};
```

### Inputs

```ts
export type UpsertDailyItemLogInput = {
  itemId: string;
  category: TrackableCategory;
  date: ISODate;
  period: LogPeriod;
  status?: DailyItemStatus;
  dose?: string;
  notes?: string;
};
```

## Table: food_entries

### Purpose

Stores simple calories/protein entries.

This is a later module.

### Columns

```sql
create table public.food_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  item_name text not null,
  calories integer not null check (calories >= 0),
  protein_grams numeric(6, 2) not null default 0 check (protein_grams >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
```

### Domain type

```ts
export type FoodEntry = {
  id: string;
  userId: string;
  date: ISODate;
  itemName: string;
  calories: number;
  proteinGrams: number;
  notes: string | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  deletedAt: ISODateTime | null;
};
```

### Inputs

```ts
export type CreateFoodEntryInput = {
  date: ISODate;
  itemName: string;
  calories: number;
  proteinGrams: number;
  notes?: string;
};
```

## Table: weight_entries

### Purpose

Stores bodyweight entries over time.

This is a later module.

### Columns

```sql
create table public.weight_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  weight_kg numeric(5, 2) not null check (weight_kg > 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,

  constraint weight_entries_user_date_unique unique (user_id, date)
);
```

### Domain type

```ts
export type WeightEntry = {
  id: string;
  userId: string;
  date: ISODate;
  weightKg: number;
  notes: string | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  deletedAt: ISODateTime | null;
};
```

### Inputs

```ts
export type UpsertWeightEntryInput = {
  date: ISODate;
  weightKg: number;
  notes?: string;
};
```

## Indexes

Recommended indexes:

```sql
create index daily_notes_user_date_idx
  on public.daily_notes (user_id, date desc)
  where deleted_at is null;

create index gym_sessions_user_date_idx
  on public.gym_sessions (user_id, date desc)
  where deleted_at is null;

create index gym_session_muscles_session_idx
  on public.gym_session_muscles (gym_session_id);

create index trackable_items_user_category_idx
  on public.trackable_items (user_id, category, active)
  where deleted_at is null;

create index daily_item_logs_user_category_date_idx
  on public.daily_item_logs (user_id, category, date desc)
  where deleted_at is null;

create index food_entries_user_date_idx
  on public.food_entries (user_id, date desc)
  where deleted_at is null;

create index weight_entries_user_date_idx
  on public.weight_entries (user_id, date desc)
  where deleted_at is null;
```

## Updated-at handling

Use an `updated_at` trigger in Supabase.

```sql
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_daily_notes_updated_at
before update on public.daily_notes
for each row execute function public.set_updated_at();

create trigger set_gym_sessions_updated_at
before update on public.gym_sessions
for each row execute function public.set_updated_at();

create trigger set_trackable_items_updated_at
before update on public.trackable_items
for each row execute function public.set_updated_at();

create trigger set_daily_item_logs_updated_at
before update on public.daily_item_logs
for each row execute function public.set_updated_at();

create trigger set_food_entries_updated_at
before update on public.food_entries
for each row execute function public.set_updated_at();

create trigger set_weight_entries_updated_at
before update on public.weight_entries
for each row execute function public.set_updated_at();
```

This is acceptable backend-specific infrastructure. It should not affect UI portability because the app only sees `updatedAt`.

## Soft delete strategy

Prefer soft delete for user logs.

Set:

```sql
deleted_at = now()
```

rather than hard deleting, where practical.

Benefits:
- safer accidental deletion recovery
- easier future offline sync
- easier conflict resolution

For child records like `gym_session_muscles`, hard delete is acceptable when updating a session's muscles, because these are dependent rows.

## Row Level Security assumptions

Every user-owned table must enforce:

- user can select own rows only
- user can insert own rows only
- user can update own rows only
- user can delete/soft-delete own rows only

RLS details live in `SUPABASE.md`.

## Seed data

V1 can seed default items after first login.

Default gym templates are app constants, not database rows yet.

Default skincare items could be added manually by the user. If seeded, use non-invasive examples only.

Default supplements should not be auto-created unless the user adds them, because this can feel personal/medical. The app may provide empty state suggestions.

## App constants

### Workout templates

```ts
export const DEFAULT_WORKOUT_TEMPLATES = [
  {
    name: "Back & Biceps",
    muscles: ["back", "biceps"] as MuscleGroup[],
  },
  {
    name: "Legs & Shoulders",
    muscles: ["quads", "hamstrings", "glutes", "calves", "shoulders"] as MuscleGroup[],
  },
  {
    name: "Chest & Triceps",
    muscles: ["chest", "triceps"] as MuscleGroup[],
  },
];
```

### Skincare periods

```ts
export const SKINCARE_PERIODS = ["morning", "night"] as const;
```

### Supplement periods

```ts
export const SUPPLEMENT_PERIODS = [
  "anytime",
  "morning",
  "afternoon",
  "evening",
  "night",
] as const;
```

## Data loading patterns

### Daily Notes

Load:
- selected date note
- recent notes list

Save:
- upsert by `(user_id, date)`

### Gym

Load:
- recent sessions
- optional date range

Save:
- insert gym session
- insert session muscle rows

Update:
- update session row
- replace muscle rows

Delete:
- soft delete session
- either leave muscle rows or cascade hard-delete if actually deleting

### Skincare/Supplements

Load:
- active items by category
- logs for selected date/category

Save/toggle:
- if item is ticked, upsert log
- if unticked, soft-delete or delete that day's log

## Future migration/export model

A full export should produce JSON shaped by domain entities, not raw Supabase rows.

Example:

```json
{
  "version": 1,
  "exportedAt": "2026-05-06T12:00:00Z",
  "dailyNotes": [],
  "gymSessions": [],
  "trackableItems": [],
  "dailyItemLogs": [],
  "foodEntries": [],
  "weightEntries": []
}
```

This makes backend switching easier.
