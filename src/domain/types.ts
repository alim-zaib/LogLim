export type ISODate = string;
export type ISODateTime = string;

export type HomeModuleId =
  | "daily_notes"
  | "gym"
  | "skincare"
  | "supplements";

export type HomeModule = {
  description: string;
  id: HomeModuleId;
  title: string;
};

export type ListByDateRangeParams = {
  endDate?: ISODate;
  limit?: number;
  startDate?: ISODate;
};

export type DailyNote = {
  content: string;
  createdAt: ISODateTime;
  date: ISODate;
  deletedAt: ISODateTime | null;
  id: string;
  updatedAt: ISODateTime;
  userId: string;
};

export type UpsertDailyNoteInput = {
  content: string;
  date: ISODate;
};

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

export type GymSession = {
  createdAt: ISODateTime;
  date: ISODate;
  deletedAt: ISODateTime | null;
  id: string;
  muscles: MuscleGroup[];
  notes: string | null;
  updatedAt: ISODateTime;
  userId: string;
  workoutName: string;
};

export type CreateGymSessionInput = {
  date: ISODate;
  muscles: MuscleGroup[];
  notes?: string;
  workoutName: string;
};

export type UpdateGymSessionInput = Partial<CreateGymSessionInput>;

export type TrackableCategory = "skincare" | "supplement";

export type TrackableItem = {
  active: boolean;
  category: TrackableCategory;
  createdAt: ISODateTime;
  defaultDose: string | null;
  defaultTime: string | null;
  deletedAt: ISODateTime | null;
  id: string;
  name: string;
  notes: string | null;
  sortOrder: number;
  updatedAt: ISODateTime;
  userId: string;
};

export type CreateTrackableItemInput = {
  category: TrackableCategory;
  defaultDose?: string;
  defaultTime?: string;
  name: string;
  notes?: string;
  sortOrder?: number;
};

export type UpdateTrackableItemInput = Partial<CreateTrackableItemInput> & {
  active?: boolean;
};

export type LogPeriod =
  | "morning"
  | "afternoon"
  | "evening"
  | "night"
  | "anytime";

export type DailyItemStatus = "done" | "skipped";

export type DailyItemLog = {
  category: TrackableCategory;
  createdAt: ISODateTime;
  date: ISODate;
  deletedAt: ISODateTime | null;
  dose: string | null;
  id: string;
  itemId: string;
  notes: string | null;
  period: LogPeriod;
  status: DailyItemStatus;
  updatedAt: ISODateTime;
  userId: string;
};

export type ListDailyItemLogsParams = {
  category?: TrackableCategory;
  date?: ISODate;
  endDate?: ISODate;
  itemId?: string;
  startDate?: ISODate;
};

export type UpsertDailyItemLogInput = {
  category: TrackableCategory;
  date: ISODate;
  dose?: string;
  itemId: string;
  notes?: string;
  period: LogPeriod;
  status?: DailyItemStatus;
};

export type FoodEntry = {
  calories: number;
  createdAt: ISODateTime;
  date: ISODate;
  deletedAt: ISODateTime | null;
  id: string;
  itemName: string;
  notes: string | null;
  proteinGrams: number;
  updatedAt: ISODateTime;
  userId: string;
};

export type CreateFoodEntryInput = {
  calories: number;
  date: ISODate;
  itemName: string;
  notes?: string;
  proteinGrams: number;
};

export type WeightEntry = {
  createdAt: ISODateTime;
  date: ISODate;
  deletedAt: ISODateTime | null;
  id: string;
  notes: string | null;
  updatedAt: ISODateTime;
  userId: string;
  weightKg: number;
};

export type UpsertWeightEntryInput = {
  date: ISODate;
  notes?: string;
  weightKg: number;
};

