import type {
  CreateFoodEntryInput,
  CreateGymSessionInput,
  CreateTrackableItemInput,
  DailyItemLog,
  DailyNote,
  FoodEntry,
  GymSession,
  ListByDateRangeParams,
  ListDailyItemLogsParams,
  TrackableCategory,
  TrackableItem,
  UpdateGymSessionInput,
  UpdateTrackableItemInput,
  UpsertDailyItemLogInput,
  UpsertDailyNoteInput,
  UpsertWeightEntryInput,
  WeightEntry,
} from "../domain";

export interface LogLimStorage {
  archiveTrackableItem(id: string): Promise<void>;
  createFoodEntry(input: CreateFoodEntryInput): Promise<FoodEntry>;
  createGymSession(input: CreateGymSessionInput): Promise<GymSession>;
  createTrackableItem(input: CreateTrackableItemInput): Promise<TrackableItem>;
  deleteDailyItemLog(id: string): Promise<void>;
  deleteFoodEntry(id: string): Promise<void>;
  deleteGymSession(id: string): Promise<void>;
  deleteWeightEntry(id: string): Promise<void>;
  getCurrentUserId(): Promise<string | null>;
  getDailyNote(date: string): Promise<DailyNote | null>;
  listDailyItemLogs(params: ListDailyItemLogsParams): Promise<DailyItemLog[]>;
  listDailyNotes(params?: ListByDateRangeParams): Promise<DailyNote[]>;
  listFoodEntries(params?: ListByDateRangeParams): Promise<FoodEntry[]>;
  listGymSessions(params?: ListByDateRangeParams): Promise<GymSession[]>;
  listTrackableItems(category?: TrackableCategory): Promise<TrackableItem[]>;
  listWeightEntries(params?: ListByDateRangeParams): Promise<WeightEntry[]>;
  updateGymSession(
    id: string,
    input: UpdateGymSessionInput,
  ): Promise<GymSession>;
  updateTrackableItem(
    id: string,
    input: UpdateTrackableItemInput,
  ): Promise<TrackableItem>;
  upsertDailyItemLog(input: UpsertDailyItemLogInput): Promise<DailyItemLog>;
  upsertDailyNote(input: UpsertDailyNoteInput): Promise<DailyNote>;
  upsertWeightEntry(input: UpsertWeightEntryInput): Promise<WeightEntry>;
}

