# PRODUCT.md

## Product name

**LogLim**

## One-line description

LogLim is a private personal tracking app for quick daily logging, simple history, and calm cross-device access.

## Product purpose

LogLim exists so one user can quickly record small daily things without needing several separate apps.

The core value is not complex analytics or heavy dashboards. The core value is:

- fast logging
- reliable history
- low-friction daily use
- simple private records
- easy lookup later
- phone-first use with optional PC access

## Product positioning

LogLim is a private personal utility app.

It is not:

- a social app
- a public habit-tracking app
- a full fitness coaching app
- a full finance app
- a full medical tracker
- a full MyFitnessPal clone
- a task-management app
- a journalling app with heavy prompts
- a gamified productivity system

It should feel closer to a personal database with a clean mobile interface.

## Target user

The target user is the owner of the app.

The app should optimise for:

- speed
- simplicity
- privacy
- flexibility
- long-term usefulness
- personal preferences

Do not design for generic market appeal unless explicitly asked later.

## Core product principles

### 1. Quick capture

The main interaction should be:

```text
Open app → tap/log something → close app
```

A useful log should be possible in under 10 seconds.

### 2. History by default

Every module should preserve historical records.

The user should be able to answer questions such as:

- When did I last train chest?
- What skincare did I use last night?
- Did I take finasteride today?
- What did I jot down last Tuesday?
- What was my weight trend this month?
- How much protein did I log yesterday?

### 3. Flexible, not overbuilt

The app should support the user's current patterns without trapping the app in those patterns.

Example:

Current gym split:
- Back & Biceps
- Legs & Shoulders
- Chest & Triceps

These should be templates, not hardcoded restrictions.

### 4. Calm and personal

The app should not feel like a loud productivity system.

Avoid:
- streak pressure
- guilt-based warnings
- aggressive red/green statuses
- unnecessary badges
- fake insights
- cluttered dashboards

Prefer:
- soft cards
- muted colours
- simple copy
- quiet confirmations
- useful empty states

### 5. Modular growth

The app should grow module by module.

Each module should be usable on its own and not require every other module to exist.

## Current modules

### 1. Daily Notes

#### Purpose

A lightweight notepad that refreshes each day while preserving previous days.

#### User story

As the user, I want to open LogLim and immediately type quick notes for today, so that I can jot things down without deciding where they belong.

#### Behaviour

- The app opens today's note by default.
- Each date has one note.
- Today's note starts blank if no note exists.
- Previous days are saved automatically or manually.
- The user can browse previous days easily.
- The user can edit previous notes.
- The user can search or filter previous notes later.

#### Fields

- date
- content
- createdAt
- updatedAt

#### V1 scope

- View today's note.
- Edit/save today's note.
- Browse recent previous notes.
- Open a specific previous note.
- Preserve notes in Supabase.

#### Later scope

- Search notes.
- Calendar picker.
- Tags.
- Pin important notes.
- Export notes.

### 2. Gym Tracker

#### Purpose

Track gym attendance and muscles worked without forcing detailed exercise-by-exercise logging.

#### User story

As the user, I want to quickly log that I went gym and what muscles I worked, so that I can see my training history without spending ages filling out details.

#### Current workout templates

- Back & Biceps
- Legs & Shoulders
- Chest & Triceps

These are default templates only.

The app must allow:

- custom workout names
- custom muscle selections
- new templates later
- sessions that do not match the usual split

#### Common muscle groups

- Back
- Biceps
- Chest
- Triceps
- Shoulders
- Quads
- Hamstrings
- Glutes
- Calves
- Abs
- Forearms
- Traps
- Lower back

#### Fields

- date
- workoutName
- muscles worked
- optional notes
- createdAt
- updatedAt

#### V1 scope

- Create gym session.
- Choose workout template.
- Select/deselect muscles.
- Add optional notes.
- View history reverse-chronologically.
- Delete/archive a session.
- Show simple recent training summary.

#### Later scope

- Exercise-level logging.
- Sets/reps/weight.
- Personal records.
- Workout templates editor.
- Muscle frequency charts.
- Rest-time awareness.

### 3. Skincare Tracker

#### Purpose

Track which skincare products were used on which days, optionally split by morning/night.

#### User story

As the user, I want a simple bucket of skincare items and the ability to tap what I used today, so that I can spot patterns in dryness, flaking, irritation, or consistency.

#### Key concept

The user maintains a reusable **skincare item bucket**.

Example items:

- Cleanser
- Moisturiser
- SPF
- Tretinoin
- Azelaic acid
- Cicaplast balm
- Exfoliant

For each day, the user taps which items were used.

#### Periods

Skincare logging should support periods because morning and night routines differ.

V1 periods:

- Morning
- Night

Later possible periods:

- Afternoon
- Anytime

#### Fields

Trackable item:
- category = skincare
- name
- notes
- active

Daily log:
- date
- itemId
- period
- status/value
- optional notes

#### V1 scope

- Create skincare items.
- List active skincare items.
- Tap items used today.
- Split by Morning/Night.
- Add optional daily skin note.
- View previous skincare days.

#### Later scope

- Routine templates.
- Irritation/dryness rating.
- Product start/end dates.
- Frequency analysis.
- Calendar view.

### 4. Supplement Tracker

#### Purpose

Track supplements or medication-style recurring items in a quick checklist.

#### User story

As the user, I want a simple list of supplements/meds and the ability to tick what I took today, so that I can keep a reliable history.

#### Key concept

The user maintains a reusable **supplement item bucket**.

Example items:

- Finasteride
- Vitamin D
- Omega-3
- Magnesium
- Ashwagandha
- P5P
- L-citrulline

The app must not give medical advice. It only records user-entered data.

#### Fields

Trackable item:
- category = supplement
- name
- default dose
- default time
- notes
- active

Daily log:
- date
- itemId
- period/time
- status/value
- dose override
- optional notes

#### V1 scope

- Create supplement items.
- List active supplement items.
- Tap items taken today.
- Optional dose/time notes.
- View previous days.

#### Later scope

- Reminders.
- Schedule/frequency rules.
- Missed item summaries.
- Export history.
- More structured dose tracking.

### 5. Calories / Protein Tracker

#### Purpose

Simple nutrition logging focused on calories and protein.

#### User story

As the user, I want to quickly enter food items with calories and protein, so that I can track rough daily totals without building a full food database.

#### Fields

- date
- itemName
- calories
- proteinGrams
- optional notes

#### V1 or later?

Later module.

Do not build this before the core logging structure is stable unless explicitly instructed.

#### Scope principles

This should not become a MyFitnessPal clone.

Avoid early complexity:
- barcode scanning
- public food database
- meal plans
- macro coaching
- recipe parsing

Start with manual entries only.

### 6. Weight Tracker

#### Purpose

Track bodyweight over time.

#### User story

As the user, I want to log my weight and see history/trends, so that I can understand changes over time.

#### Fields

- date
- weightKg
- optional notes

#### V1 or later?

Later module.

#### Later scope

- Weekly average.
- Trend chart.
- 7-day/30-day change.
- Link to calories/gym view.

## Home screen concept

The home screen should not be a fake dashboard with placeholder stats.

It should show only real, relevant modules and today's quick actions.

Possible V1 home sections:

- Today's date
- Quick actions:
  - Daily Note
  - Log Gym
  - Skincare
  - Supplements
- Small "Today" status:
  - Note exists or not
  - Gym logged or not
  - Skincare logged or not
  - Supplements logged or not

Do not include finance, random habits, project tracking, or unrelated cards unless added to the product scope later.

## Data ownership

The user owns all data.

The app should eventually support:

- export all data
- import backup
- delete data
- switch backend if needed

## Authentication

V1 should use Supabase Auth.

Because the app is private, the auth flow can be simple:

- email/password or magic link
- no public registration UI necessary unless convenient
- no social login unless explicitly requested

## Success criteria

LogLim is successful if:

- the user actually wants to open it daily
- logging takes very little effort
- history is easy to browse
- sync works between phone and PC/web later
- the app remains simple as new modules are added
