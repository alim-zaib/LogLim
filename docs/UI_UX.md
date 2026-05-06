# UI_UX.md

## UI direction

LogLim should feel:

- calm
- clean
- personal
- simple
- low-friction
- slightly premium
- not overdesigned

The app is not trying to impress strangers. It is trying to be useful every day.

The desired feel is:

```text
quiet personal dashboard
soft dark interface
fast daily logging
minimal visual noise
```

## Design principles

### 1. Less screen noise

Each screen should have one clear purpose.

Avoid:
- too many cards
- too many stats
- huge forms
- loud empty states
- unnecessary icons
- unnecessary charts
- placeholder modules

Prefer:
- clear section headings
- one primary action
- simple inputs
- compact history lists
- calm spacing

### 2. Tap-first logging

Most logs should be tappable.

Examples:

- Tap skincare items used.
- Tap supplements taken.
- Tap a workout template.
- Tap muscle chips.
- Type a note only if needed.

The app should not require typing for common repeated actions.

### 3. History should be easy

Every module needs a clear way to see previous days.

Common patterns:

- date switcher
- recent history list
- "Today" shortcut
- previous/next day arrows
- compact cards by date

### 4. No guilt UI

Do not shame missed logs.

Avoid wording like:
- "You failed"
- "You missed your streak"
- "Incomplete"
- "Bad day"

Prefer:
- "Nothing logged yet"
- "No skincare logged for this day"
- "Add a session"
- "No note for this date"

### 5. Quiet confirmations

Use simple save states.

Examples:

- "Saved"
- "Updated"
- "Logged"
- "Synced"

Avoid celebration animations or loud success modals.

## Visual style

### Theme

Start with a dark calm theme.

Possible palette:

```ts
export const colours = {
  background: "#0E1116",
  surface: "#151A22",
  surfaceSoft: "#1B222C",
  surfaceRaised: "#202936",

  textPrimary: "#F3F4F6",
  textSecondary: "#A7B0BE",
  textMuted: "#6F7A89",

  border: "#2A3340",
  borderSoft: "#222A35",

  accent: "#8EA7E9",
  accentSoft: "#202A44",
  accentMuted: "#6F86C6",

  success: "#8BC7A6",
  warning: "#D9B76E",
  danger: "#D97D7D",

  inputBackground: "#111722",
};
```

This can be adjusted during implementation.

### Colour usage

- Background should be dark but not pure black.
- Cards should be slightly lighter than background.
- Accent colour should be muted, not neon.
- Use red/danger only for delete actions or true errors.
- Do not colour every module differently in v1.

### Typography

Keep text readable.

Suggested scale:

```ts
export const typography = {
  title: 28,
  heading: 22,
  subheading: 18,
  body: 16,
  small: 14,
  tiny: 12,
};
```

Usage:

- app/screen title: 26-30
- section headings: 18-22
- body text: 15-16
- metadata: 12-14

Avoid too many font weights.

### Spacing

Use consistent spacing.

```ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};
```

### Corners

Use rounded cards, but not cartoonish.

Suggested:
- cards: 18-24px
- buttons: 14-18px
- chips: pill radius

### Shadows

Use subtle shadows or none.

On dark UI, heavy shadows can look messy. Prefer borders and slight surface contrast.

## Common components

### Screen

A shared screen wrapper.

Responsibilities:
- safe area
- background colour
- horizontal padding
- vertical spacing
- keyboard handling where needed

### AppCard

Used for modules, history entries, forms.

Props:
- children
- pressable optional
- selected optional
- compact optional

### AppButton

Variants:
- primary
- secondary
- ghost
- danger

Primary should be used sparingly.

### Pill / Chip

Used for:
- muscles
- selected items
- periods
- templates

States:
- default
- selected
- disabled

### DateSwitcher

Used by daily modules.

Should support:
- previous day
- next day
- today
- display selected date

V1 can be simple:

```text
‹  Today, 6 May  ›
```

### EmptyState

Calm empty states.

Example:

```text
No note for this day.
Start typing to save one.
```

### SectionHeader

For consistent module sections.

Example:
- title
- optional subtitle/action

## Navigation UX

V1 should be simple.

Possible home screen:

```text
LogLim
Personal log

Today
[Daily Notes]
[Gym]
[Skincare]
[Supplements]

Later
[Calories]
[Weight]
```

Modules can be cards.

Do not build a complicated dashboard before useful data exists.

## Home screen

### Purpose

The home screen is a launcher and light daily summary.

It should not be a fake analytics dashboard.

### Content

V1 home should include:

1. App title: LogLim
2. Calm subtitle, e.g. "Today’s logs"
3. Date
4. Module cards:
   - Daily Notes
   - Gym
   - Skincare
   - Supplements
5. Optional "Today at a glance" with real statuses only:
   - Note saved
   - Gym logged
   - Skincare logged
   - Supplements logged

### Module card style

Each card:
- title
- one-line description
- optional status
- subtle arrow/chevron

Example:

```text
Daily Notes
Quick notes for today
Saved 12:40
```

## Daily Notes UX

### Goal

Make it feel like a quick daily scratchpad.

### Screen layout

```text
Daily Notes
[Date switcher]

[Large text area]

Recent days
[6 May] preview...
[5 May] preview...
[4 May] preview...
```

### Behaviour

- Opens to today.
- Text area should be ready to use.
- Save manually in v1, or autosave if implemented cleanly.
- Show small "Saved" state.
- Previous notes should be easy to open.

### Text area

Should be:
- large enough for quick notes
- not visually heavy
- no unnecessary formatting toolbar

### Empty state

```text
No note for this day.
Use this as a quick scratchpad.
```

## Gym Tracker UX

### Goal

Make gym logging quick.

### Screen layout

```text
Gym
[Date]

Workout
[Back & Biceps] [Legs & Shoulders] [Chest & Triceps] [Custom]

Muscles
[Back] [Biceps] [Chest] [Triceps] ...

Notes
[Optional note]

[Save Session]

Recent sessions
[session cards]
```

### Interaction

- Tapping a template sets workout name and suggested muscles.
- User can still add/remove muscles after choosing template.
- Custom lets user type workout name.
- Save button creates session.
- Recent sessions appear below.

### Session card

```text
6 May
Back & Biceps
Back · Biceps
Optional note preview
```

Actions:
- edit later
- delete/archive

V1 can include delete. Edit can come later if needed.

## Skincare Tracker UX

### Goal

Make daily skincare tracking a quick checklist.

### Screen layout

```text
Skincare
[Date]

Morning
[Cleanser] [Moisturiser] [SPF]

Night
[Cleanser] [Tretinoin] [Cicaplast]

Notes
[Optional skin note]

Manage items
```

### Interaction

- Tap item to toggle used/not used.
- Selected state should be clear but calm.
- Item bucket can be managed separately.
- Add item flow should be simple: name + optional note.

### Add item flow

V1 can use an inline form or modal:

```text
Item name
Optional note
[Add]
```

No need for brands, photos, categories, or complex routines in v1.

### Empty state

```text
No skincare items yet.
Add your first item to start logging.
```

## Supplement Tracker UX

### Goal

Make supplements/meds tracking a quick checklist.

### Screen layout

```text
Supplements
[Date]

Today
[Finasteride] [Vitamin D] [Magnesium]

Optional details
Dose/time notes only when needed

Manage items
```

### Interaction

- Tap item to mark taken.
- If an item has default dose/time, show it subtly.
- Do not force dose/time input every time.
- Let user add a quick note if needed.

### Add item flow

Fields:
- name
- default dose optional
- default time optional
- notes optional

### Medical positioning

Do not display medical advice.

Use neutral language:
- "Supplements"
- "Taken"
- "Default dose"
- "Notes"

Avoid:
- "recommended dose"
- "safe dose"
- "you should take"

## Calories / Protein UX

Later module.

### Goal

Manual logging, not a food database.

### Screen layout

```text
Calories
[Date]

Today
Calories: 1,850
Protein: 130g

Add entry
Food/item
Calories
Protein
Notes optional

Entries
[entry list]
```

### Principles

- Manual entries only at first.
- No barcode scanner.
- No food database.
- No meal plan.
- No complicated macro targets unless requested.

## Weight Tracker UX

Later module.

### Goal

Simple weight entries and history.

### Screen layout

```text
Weight
Today’s weight
[73.5 kg]

History
[date] [weight]
```

Later:
- line chart
- weekly average
- trend

V1/later first version:
- add/edit today's weight
- list previous weights

## Settings UX

Settings should stay minimal.

Possible options:

- Account
- Sign out
- Theme
- Export data later
- Data source/debug info later

Do not overbuild settings.

## Loading states

Use subtle loading states.

Examples:
- small spinner
- "Loading note..."
- skeleton card if easy

Avoid full-screen loading unless auth/session is loading.

## Error states

Use calm direct messages.

Examples:

```text
Could not save.
Check your connection and try again.
```

```text
You are signed out.
Sign in again to continue.
```

Avoid technical error dumps in UI.

## Form behaviour

### Required fields

Keep required fields minimal.

Daily notes:
- date required
- content can be empty

Gym:
- date required
- workout name required
- muscles optional but encouraged

Skincare:
- item name required for creating item
- daily logs are toggle-based

Supplements:
- item name required for creating item
- dose/time optional

### Validation copy

Use plain text.

Examples:
- "Add a workout name."
- "Item name is required."
- "Calories must be 0 or more."

## Accessibility

At minimum:

- touch targets should be comfortable
- text should have enough contrast
- buttons should have clear labels
- selected chips should not rely only on colour
- inputs should have labels/placeholders

## Animation

Use little or no animation in v1.

If using animation later:
- subtle fades
- slight card transitions
- no bouncy gamified motion

## Copywriting style

Use direct, calm labels.

Good:
- "Today"
- "Recent"
- "Save"
- "Logged"
- "Nothing logged yet"
- "Add item"

Avoid:
- "Crush your goals"
- "Unlock your potential"
- "Become your best self"
- "You are on fire"

## Do not include by default

Do not add these unless explicitly requested:

- finance dashboard
- project tracker
- mood tracker
- sleep tracker
- habit streaks
- reminders
- calendar integrations
- achievements
- social sharing
- public profiles
- AI summaries
- notifications
- photos
- audio notes

## UI success criteria

A good v1 screen should pass these checks:

- Can the user understand it within 2 seconds?
- Can the user log the main thing in under 10 seconds?
- Is there only one obvious primary action?
- Does the screen avoid fake/placeholder data?
- Does the screen feel calm?
- Does it work on a small iPhone screen?
- Does it look acceptable in Expo Go without native customisation?
