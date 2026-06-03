export type TrainingLevel = 'beginner' | 'intermediate' | 'professional';

export type DayStatus = 'unfinished' | 'finished' | 'skipped';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  youtubeUrl: string;
  notes?: string;
}

export interface WorkoutDay {
  dayNumber: number;
  weekNumber: number;
  label: string;
  isRestDay: boolean;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  id: string;
  level: TrainingLevel;
  name: string;
  durationWeeks: number;
  description: string;
  days: WorkoutDay[];
}

export interface PlanProgress {
  planId: string;
  startDate: string;
  dayStatus: { [dayNumber: number]: DayStatus };
}

export interface WorkoutState {
  selectedLevel: TrainingLevel | null;
  activePlanId: string | null;
  progress: PlanProgress | null;
}
