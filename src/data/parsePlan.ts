import { SetBlock } from '../types/workout.types';

export interface ParsedExercise {
  label: string;
  name: string;
  setBlocks: SetBlock[];
}

export interface ParsedTrainingDay {
  weekNumber: number;
  trainingDayIndex: number; // 1-based day number within the week (Day 1, Day 2, …)
  exercises: ParsedExercise[];
}

function parseVal(s: string): number | null {
  const t = s.trim();
  if (t === '-' || t === '') return null;
  const n = Number(t);
  return isNaN(n) ? null : n;
}

/**
 * Parses a workout plan txt file into structured data.
 *
 * Expected format:
 *   Week X, Day Y
 *   A. Exercise Name
 *   Sets, Reps, RPE, Load   ← optional header, ignored
 *   1,5,-,-                  ← set block row
 *   2,5,8,-
 *   B. Next Exercise
 *   ...
 *
 * '-' in any column means "not prescribed" (user sets it themselves).
 */
export function parsePlanTxt(txt: string): ParsedTrainingDay[] {
  const lines = txt.split('\n').map((l) => l.trim());
  const days: ParsedTrainingDay[] = [];
  let currentDay: ParsedTrainingDay | null = null;
  let currentExercise: ParsedExercise | null = null;

  function flushExercise() {
    if (currentExercise && currentDay) {
      currentDay.exercises.push(currentExercise);
      currentExercise = null;
    }
  }

  for (const line of lines) {
    if (!line) continue;

    // "Week X, Day Y"
    const dayMatch = line.match(/^Week\s+(\d+),\s*Day\s+(\d+)/i);
    if (dayMatch) {
      flushExercise();
      currentDay = {
        weekNumber: parseInt(dayMatch[1]),
        trainingDayIndex: parseInt(dayMatch[2]),
        exercises: [],
      };
      days.push(currentDay);
      continue;
    }

    // "A. Exercise name"
    const exMatch = line.match(/^([A-Za-z])\.\s+(.+)/);
    if (exMatch) {
      flushExercise();
      currentExercise = {
        label: exMatch[1].toUpperCase(),
        name: exMatch[2].trim(),
        setBlocks: [],
      };
      continue;
    }

    // Header row — skip
    if (/^sets,\s*reps/i.test(line)) continue;

    // Set block data: "N,N,-,-"  (each field is a number or '-')
    if (/^(\d+|-),(\d+|-),(\d+|-),(\d+|-)$/.test(line) && currentExercise) {
      const [s, r, rpe, load] = line.split(',');
      currentExercise.setBlocks.push({
        sets: parseInt(s) || 1,
        reps: parseVal(r),
        rpe: parseVal(rpe),
        load: parseVal(load),
      });
    }
  }

  flushExercise();
  return days;
}
