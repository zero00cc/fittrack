import { WorkoutPlan, WorkoutDay } from '../types/workout.types';

function ex(id: string, name: string, sets: number, reps: string, notes?: string) {
  const slug = name.toLowerCase().replace(/\s+/g, '+').replace(/[()]/g, '');
  return {
    id,
    name,
    sets,
    reps,
    youtubeUrl: `https://www.youtube.com/results?search_query=how+to+${slug}+proper+form`,
    notes,
  };
}

function restDay(dayNumber: number, weekNumber: number): WorkoutDay {
  return { dayNumber, weekNumber, label: 'Rest Day', isRestDay: true, exercises: [] };
}

// ─── Plan A: Beginner Full-Body (4 weeks, Mon/Wed/Fri) ──────────────────────
const beginnerTrainingDay = (dayNumber: number, weekNumber: number, variant: 'A' | 'B'): WorkoutDay => ({
  dayNumber,
  weekNumber,
  label: variant === 'A' ? `Week ${weekNumber} — Upper Focus` : `Week ${weekNumber} — Lower Focus`,
  isRestDay: false,
  exercises:
    variant === 'A'
      ? [
          ex('squat', 'Squat', 3, '10-12', 'Keep chest up and knees tracking over toes'),
          ex('bench', 'Bench Press', 3, '10-12', 'Plant feet firmly, squeeze shoulder blades'),
          ex('row', 'Bent-Over Row', 3, '10-12', 'Hinge at hips, pull elbows back'),
          ex('ohp', 'Overhead Press', 3, '10-12', 'Brace core, press straight overhead'),
          ex('plank', 'Plank', 3, '30–45s', 'Keep hips level, breathe steadily'),
        ]
      : [
          ex('deadlift', 'Deadlift', 3, '8-10', 'Neutral spine, drive through heels'),
          ex('squat', 'Squat', 3, '10-12'),
          ex('bench', 'Bench Press', 3, '10-12'),
          ex('pullup', 'Pull-Up (assisted)', 3, '8-10', 'Use band or machine if needed'),
          ex('ohp', 'Overhead Press', 3, '10-12'),
        ],
});

function buildBeginnerDays(): WorkoutDay[] {
  const days: WorkoutDay[] = [];
  // Week pattern: Mon(1)=train, Tue(2)=rest, Wed(3)=train, Thu(4)=rest, Fri(5)=train, Sat(6)=rest, Sun(7)=rest
  const weekPattern: Array<'A' | 'B' | null> = ['A', null, 'B', null, 'A', null, null];
  let dayNumber = 1;
  for (let week = 1; week <= 4; week++) {
    for (let d = 0; d < 7; d++) {
      const variant = weekPattern[d];
      if (variant) {
        days.push(beginnerTrainingDay(dayNumber, week, variant));
      } else {
        days.push(restDay(dayNumber, week));
      }
      dayNumber++;
    }
  }
  return days;
}

// ─── Plan B: Intermediate Upper/Lower Split (5 weeks, Mon/Tue/Thu/Fri) ──────
function buildIntermediateDays(): WorkoutDay[] {
  const days: WorkoutDay[] = [];
  // Pattern: Mon=Upper A, Tue=Lower A, Wed=rest, Thu=Upper B, Fri=Lower B, Sat=rest, Sun=rest
  let dayNumber = 1;
  for (let week = 1; week <= 5; week++) {
    const sets = week <= 2 ? 3 : 4;
    const dayDefs: Array<{ label: string; exFn: () => ReturnType<typeof ex>[] } | null> = [
      {
        label: `Week ${week} — Upper A`,
        exFn: () => [
          ex('bench', 'Bench Press', sets, '8-10'),
          ex('ohp', 'Overhead Press', sets, '8-10'),
          ex('row', 'Bent-Over Row', sets, '8-10'),
          ex('pullup', 'Pull-Up', sets, '6-8'),
          ex('curl', 'Barbell Curl', 3, '10-12'),
          ex('tricdip', 'Tricep Dip', 3, '10-12'),
        ],
      },
      {
        label: `Week ${week} — Lower A`,
        exFn: () => [
          ex('squat', 'Squat', sets, '8-10'),
          ex('rdl', 'Romanian Deadlift', sets, '10-12'),
          ex('legpress', 'Leg Press', sets, '10-12'),
          ex('calfraise', 'Calf Raise', 3, '15-20'),
          ex('plank', 'Plank', 3, '45s'),
        ],
      },
      null,
      {
        label: `Week ${week} — Upper B`,
        exFn: () => [
          ex('inclinebench', 'Incline Bench Press', sets, '8-10'),
          ex('seatedrow', 'Seated Cable Row', sets, '10-12'),
          ex('lateralraise', 'Lateral Raise', 3, '12-15'),
          ex('facepull', 'Face Pull', 3, '15'),
          ex('hammercurl', 'Hammer Curl', 3, '10-12'),
        ],
      },
      {
        label: `Week ${week} — Lower B`,
        exFn: () => [
          ex('deadlift', 'Deadlift', sets, '5-6'),
          ex('bulgariansplit', 'Bulgarian Split Squat', sets, '8-10 each'),
          ex('legcurl', 'Leg Curl', 3, '12-15'),
          ex('glutebridge', 'Glute Bridge', 3, '15'),
        ],
      },
      null,
      null,
    ];
    for (const def of dayDefs) {
      if (def) {
        days.push({ dayNumber, weekNumber: week, label: def.label, isRestDay: false, exercises: def.exFn() });
      } else {
        days.push(restDay(dayNumber, week));
      }
      dayNumber++;
    }
  }
  return days;
}

// ─── Plan C: Professional PPL (6 weeks, 6 days/week) ────────────────────────
function buildProfessionalDays(): WorkoutDay[] {
  const days: WorkoutDay[] = [];
  // Pattern: Mon=Push, Tue=Pull, Wed=Legs, Thu=Push, Fri=Pull, Sat=Legs, Sun=Rest
  let dayNumber = 1;
  for (let week = 1; week <= 6; week++) {
    const isDeload = week === 6;
    const sets = isDeload ? 3 : 5;
    const repsModifier = isDeload ? '5-6' : '5-8';
    const dayDefs: Array<{ label: string; exFn: () => ReturnType<typeof ex>[] } | null> = [
      {
        label: `Week ${week} — Push A`,
        exFn: () => [
          ex('bench', 'Bench Press', sets, repsModifier),
          ex('ohp', 'Overhead Press', sets, repsModifier),
          ex('inclinedb', 'Incline Dumbbell Press', 4, '8-10'),
          ex('lateralraise', 'Lateral Raise', 3, '12-15'),
          ex('tricepdown', 'Tricep Pushdown', 3, '12-15'),
        ],
      },
      {
        label: `Week ${week} — Pull A`,
        exFn: () => [
          ex('deadlift', 'Deadlift', sets, repsModifier),
          ex('pullup', 'Pull-Up', sets, '6-8'),
          ex('row', 'Bent-Over Row', 4, '8-10'),
          ex('facepull', 'Face Pull', 3, '15'),
          ex('barbellcurl', 'Barbell Curl', 3, '10-12'),
        ],
      },
      {
        label: `Week ${week} — Legs A`,
        exFn: () => [
          ex('squat', 'Squat', sets, repsModifier),
          ex('rdl', 'Romanian Deadlift', 4, '8-10'),
          ex('legpress', 'Leg Press', 3, '10-12'),
          ex('legcurl', 'Leg Curl', 3, '12-15'),
          ex('calfraise', 'Calf Raise', 4, '15-20'),
        ],
      },
      {
        label: `Week ${week} — Push B`,
        exFn: () => [
          ex('bench', 'Bench Press', sets, repsModifier),
          ex('ohp', 'Overhead Press', sets, repsModifier),
          ex('inclinedb', 'Incline Dumbbell Press', 4, '8-10'),
          ex('lateralraise', 'Lateral Raise', 3, '12-15'),
          ex('tricepdown', 'Tricep Pushdown', 3, '12-15'),
        ],
      },
      {
        label: `Week ${week} — Pull B`,
        exFn: () => [
          ex('deadlift', 'Deadlift', sets, repsModifier),
          ex('pullup', 'Pull-Up', sets, '6-8'),
          ex('row', 'Bent-Over Row', 4, '8-10'),
          ex('facepull', 'Face Pull', 3, '15'),
          ex('barbellcurl', 'Barbell Curl', 3, '10-12'),
        ],
      },
      {
        label: `Week ${week} — Legs B`,
        exFn: () => [
          ex('squat', 'Squat', sets, repsModifier),
          ex('rdl', 'Romanian Deadlift', 4, '8-10'),
          ex('legpress', 'Leg Press', 3, '10-12'),
          ex('legcurl', 'Leg Curl', 3, '12-15'),
          ex('calfraise', 'Calf Raise', 4, '15-20'),
        ],
      },
      null,
    ];
    for (const def of dayDefs) {
      if (def) {
        days.push({ dayNumber, weekNumber: week, label: def.label, isRestDay: false, exercises: def.exFn() });
      } else {
        days.push(restDay(dayNumber, week));
      }
      dayNumber++;
    }
  }
  return days;
}

export const workoutPlans: WorkoutPlan[] = [
  {
    id: 'plan-beginner',
    level: 'beginner',
    name: 'Full-Body Foundations',
    durationWeeks: 4,
    description:
      'A 4-week full-body program training 3 days per week. Focuses on the fundamental compound movements — squat, bench press, deadlift, overhead press, and row. Ideal for those new to weight training who want to build a strong movement foundation and develop consistent gym habits.',
    days: buildBeginnerDays(),
  },
  {
    id: 'plan-intermediate',
    level: 'intermediate',
    name: 'Upper / Lower Power Split',
    durationWeeks: 5,
    description:
      'A 5-week upper/lower split training 4 days per week. Volume increases in weeks 3–5 to drive continued adaptation. You will train two distinct upper-body days and two lower-body days, hitting each muscle group twice a week with appropriate variation.',
    days: buildIntermediateDays(),
  },
  {
    id: 'plan-professional',
    level: 'professional',
    name: 'Push / Pull / Legs Hypertrophy',
    durationWeeks: 6,
    description:
      'A 6-week high-volume Push/Pull/Legs program training 6 days per week. Targets maximum hypertrophy through high frequency and progressive overload. Week 6 is a planned deload to allow recovery and supercompensation before the next training block.',
    days: buildProfessionalDays(),
  },
];
