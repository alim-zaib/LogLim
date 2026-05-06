# SUPABASE.md

## Supabase role in LogLim

Supabase is the v1 backend for LogLim.

It provides:

- authentication
- Postgres database
- cloud sync across devices
- later access from a PC/web dashboard

Supabase should be treated as an implementation detail behind the storage adapter. UI components must not call Supabase directly.

## V1 backend approach

V1 is cloud-first:

```text
Mobile app → Supabase Auth + Postgres
```

This means:

- data syncs across devices
- PC/web dashboard can read the same data later
- no complex offline-first sync in v1
- the app should show sensible error states if offline or unauthenticated

Future versions can add:

```text
Mobile app → local SQLite cache → sync queue → Supabase/custom backend
```

Do not implement that in v1 unless explicitly requested.

## Supabase project setup

1. Create a Supabase project.
2. Save the project URL.
3. Save the anon public key.
4. Add these environment variables to the Expo app:

```text
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Do not commit real secrets to git.

The anon key is safe to use in the client only when RLS is correctly enabled. RLS is required.

## Client setup

Create:

```text
src/storage/supabase/supabaseClient.ts
```

Expected structure:

```ts
import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

If the Expo starter does not include AsyncStorage, install it with Expo-compatible installation commands.

## Authentication

V1 can use either:

1. Email/password
2. Magic link

Email/password is simpler for private testing.

Auth requirements:

- User can sign in.
- Session persists.
- User can sign out.
- App can get current user ID.
- Protected screens require auth.

Recommended auth files:

```text
src/services/authService.ts
src/hooks/useAuth.ts
src/storage/supabase/supabaseClient.ts
```

## Schema SQL

The following is a full starting schema. It should be applied in Supabase SQL editor or migrations.

### Enable UUID support

```sql
create extension if not exists pgcrypto;
```

### Profiles

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### Daily notes

```sql
create table if not exists public.daily_notes (
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

### Gym sessions

```sql
create table if not exists public.gym_sessions (
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

### Gym session muscles

```sql
create table if not exists public.gym_session_muscles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  gym_session_id uuid not null references public.gym_sessions(id) on delete cascade,
  muscle text not null,
  created_at timestamptz not null default now(),

  constraint gym_session_muscles_unique unique (gym_session_id, muscle)
);
```

### Trackable items

```sql
create table if not exists public.trackable_items (
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

### Daily item logs

```sql
create table if not exists public.daily_item_logs (
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

### Food entries

```sql
create table if not exists public.food_entries (
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

### Weight entries

```sql
create table if not exists public.weight_entries (
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

## Indexes

```sql
create index if not exists daily_notes_user_date_idx
  on public.daily_notes (user_id, date desc)
  where deleted_at is null;

create index if not exists gym_sessions_user_date_idx
  on public.gym_sessions (user_id, date desc)
  where deleted_at is null;

create index if not exists gym_session_muscles_session_idx
  on public.gym_session_muscles (gym_session_id);

create index if not exists trackable_items_user_category_idx
  on public.trackable_items (user_id, category, active)
  where deleted_at is null;

create index if not exists daily_item_logs_user_category_date_idx
  on public.daily_item_logs (user_id, category, date desc)
  where deleted_at is null;

create index if not exists food_entries_user_date_idx
  on public.food_entries (user_id, date desc)
  where deleted_at is null;

create index if not exists weight_entries_user_date_idx
  on public.weight_entries (user_id, date desc)
  where deleted_at is null;
```

## Updated-at trigger

```sql
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_daily_notes_updated_at on public.daily_notes;
create trigger set_daily_notes_updated_at
before update on public.daily_notes
for each row execute function public.set_updated_at();

drop trigger if exists set_gym_sessions_updated_at on public.gym_sessions;
create trigger set_gym_sessions_updated_at
before update on public.gym_sessions
for each row execute function public.set_updated_at();

drop trigger if exists set_trackable_items_updated_at on public.trackable_items;
create trigger set_trackable_items_updated_at
before update on public.trackable_items
for each row execute function public.set_updated_at();

drop trigger if exists set_daily_item_logs_updated_at on public.daily_item_logs;
create trigger set_daily_item_logs_updated_at
before update on public.daily_item_logs
for each row execute function public.set_updated_at();

drop trigger if exists set_food_entries_updated_at on public.food_entries;
create trigger set_food_entries_updated_at
before update on public.food_entries
for each row execute function public.set_updated_at();

drop trigger if exists set_weight_entries_updated_at on public.weight_entries;
create trigger set_weight_entries_updated_at
before update on public.weight_entries
for each row execute function public.set_updated_at();
```

## Row Level Security

Enable RLS on all user-owned tables.

```sql
alter table public.profiles enable row level security;
alter table public.daily_notes enable row level security;
alter table public.gym_sessions enable row level security;
alter table public.gym_session_muscles enable row level security;
alter table public.trackable_items enable row level security;
alter table public.daily_item_logs enable row level security;
alter table public.food_entries enable row level security;
alter table public.weight_entries enable row level security;
```

## RLS policies

### Profiles

```sql
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
using (id = auth.uid());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
with check (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());
```

### Reusable own-row policies

For tables with `user_id`, use policies like this.

Daily notes:

```sql
drop policy if exists "daily_notes_select_own" on public.daily_notes;
create policy "daily_notes_select_own"
on public.daily_notes for select
using (user_id = auth.uid());

drop policy if exists "daily_notes_insert_own" on public.daily_notes;
create policy "daily_notes_insert_own"
on public.daily_notes for insert
with check (user_id = auth.uid());

drop policy if exists "daily_notes_update_own" on public.daily_notes;
create policy "daily_notes_update_own"
on public.daily_notes for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "daily_notes_delete_own" on public.daily_notes;
create policy "daily_notes_delete_own"
on public.daily_notes for delete
using (user_id = auth.uid());
```

Apply the same pattern to:

- `gym_sessions`
- `gym_session_muscles`
- `trackable_items`
- `daily_item_logs`
- `food_entries`
- `weight_entries`

Example for all remaining tables:

```sql
create policy "gym_sessions_select_own"
on public.gym_sessions for select
using (user_id = auth.uid());

create policy "gym_sessions_insert_own"
on public.gym_sessions for insert
with check (user_id = auth.uid());

create policy "gym_sessions_update_own"
on public.gym_sessions for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "gym_sessions_delete_own"
on public.gym_sessions for delete
using (user_id = auth.uid());
```

Repeat with table-specific policy names.

## Profile creation trigger

Optional but useful:

```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, null)
  on conflict (id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
```

## Supabase adapter expectations

Create:

```text
src/storage/supabase/supabaseStorage.ts
```

It should:

- implement `LogLimStorage`
- call Supabase tables
- get the current user ID from the session
- insert `user_id` on every new row
- map snake_case rows to camelCase domain objects
- filter out `deleted_at` rows by default
- return clean app-level errors

## Example storage method

```ts
async getDailyNote(date: ISODate): Promise<DailyNote | null> {
  const userId = await this.requireUserId();

  const { data, error } = await supabase
    .from("daily_notes")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw mapSupabaseError(error);
  return data ? mapDailyNoteRow(data) : null;
}
```

## Environment safety

Use:

```text
.env
```

Do not commit real environment values.

Add to `.gitignore` if not already present:

```text
.env
.env.local
```

For Expo, only expose public client-safe variables with:

```text
EXPO_PUBLIC_
```

Never put service role keys in the mobile app.

## Data privacy

Because this app contains personal logs:

- keep RLS enabled
- never expose service role key to client
- do not create public buckets unless needed
- do not add public sharing
- do not add anonymous read policies
- test as an authenticated user

## Local development notes

Useful development checks:

1. Confirm env variables are loaded.
2. Confirm user can sign in.
3. Confirm user ID is available.
4. Confirm daily note can be inserted.
5. Confirm another user cannot read that note.
6. Confirm app refresh still loads data.
7. Confirm PC/web dashboard later sees same data.

## Migration approach

For early development, SQL editor is acceptable.

As the app matures, prefer migration files:

```text
supabase/migrations/
```

Keep schema changes documented.

## When not to use Supabase features

Avoid in v1 unless necessary:

- realtime subscriptions
- Edge Functions
- RPC functions
- complex database triggers for business logic
- storage buckets
- public policies
- complicated role systems

Use simple Auth + Postgres CRUD first.

## Future backend switching considerations

To allow future switching:

- keep app domain types backend-neutral
- keep Supabase imports only inside storage/auth infrastructure
- keep mappers isolated
- create JSON export/import later
- do not design features around Supabase-only functionality
- avoid using SQL-specific behaviour in UI expectations

Supabase is the v1 backend, not the identity of the app.
