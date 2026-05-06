import type { HomeModule, MuscleGroup } from "./types";

export const HOME_MODULES: readonly HomeModule[] = [
  {
    description: "Quick notes for today.",
    id: "daily_notes",
    title: "Daily Notes",
  },
  {
    description: "Record a session and muscles worked.",
    id: "gym",
    title: "Gym",
  },
  {
    description: "Morning and night product logging.",
    id: "skincare",
    title: "Skincare",
  },
  {
    description: "Simple taken-today checklist.",
    id: "supplements",
    title: "Supplements",
  },
];

export const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  abs: "Abs",
  back: "Back",
  biceps: "Biceps",
  calves: "Calves",
  chest: "Chest",
  forearms: "Forearms",
  glutes: "Glutes",
  hamstrings: "Hamstrings",
  lower_back: "Lower back",
  other: "Other",
  quads: "Quads",
  shoulders: "Shoulders",
  traps: "Traps",
  triceps: "Triceps",
};

export const DEFAULT_WORKOUT_TEMPLATES: readonly {
  muscles: readonly MuscleGroup[];
  name: string;
}[] = [
  {
    muscles: ["back", "biceps"],
    name: "Back & Biceps",
  },
  {
    muscles: ["quads", "hamstrings", "glutes", "calves", "shoulders"],
    name: "Legs & Shoulders",
  },
  {
    muscles: ["chest", "triceps"],
    name: "Chest & Triceps",
  },
];

export const SKINCARE_PERIODS = ["morning", "night"] as const;

export const SUPPLEMENT_PERIODS = [
  "anytime",
  "morning",
  "afternoon",
  "evening",
  "night",
] as const;

