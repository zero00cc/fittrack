# FitTrack — Project Guide for Claude

## What this project is
A web-based fitness app with two features:
1. **Calorie Tracker** — log daily meals, visualize intake vs. a user-set target, view 3-month history
2. **Workout Plans** — select a training level, follow a structured plan, mark daily workouts as done

## How to run
```bash
npm install          # first time only
npm run dev          # dev server at http://localhost:5173
npm run build        # production build
```

## Tech stack
- React 18 + Vite + TypeScript
- Tailwind CSS (utility-first styling)
- react-router-dom v6 (routes: `/`, `/calories`, `/workouts`)
- recharts (bar chart, scatter+line trend chart)
- react-calendar (calorie history calendar)
- localStorage only — no backend, no auth

## Project structure
```
src/
├── types/              # TypeScript interfaces (calorie.types.ts, workout.types.ts)
├── data/
│   ├── foods.ts        # 30 common foods with kcal/100g
│   └── workoutPlans.ts # 3 built-in plans (Beginner/Intermediate/Professional)
├── hooks/
│   ├── useLocalStorage.ts    # generic typed localStorage hook
│   ├── useCalorieStore.ts    # all calorie state + persistence
│   └── useWorkoutStore.ts    # all workout state + persistence
├── utils/
│   ├── dateUtils.ts          # toYMD, addDays, getLast30Days, getLast90Days
│   └── calorieUtils.ts       # calcEntryCalories, getCalorieStatus, statusColor
├── components/
│   ├── common/         # NavBar, Badge
│   ├── calorie/        # TargetSlider, FoodSelector, MealEntry, DailyLog,
│   │                   #   CalorieBarChart, CalorieCalendar, CalorieTrendChart
│   └── workout/        # LevelSelector, PlanList, PlanOverview, WorkoutCalendar,
│                       #   DayDetail, ExerciseCard
└── pages/
    ├── HomePage.tsx
    ├── CalorieTrackerPage.tsx
    └── WorkoutPlansPage.tsx   # manages 3-layer view state internally
```

## localStorage keys
| Key | Contents |
|---|---|
| `fittrack_calorie_history` | `CalorieHistory` — all daily meal logs keyed by `YYYY-MM-DD` |
| `fittrack_calorie_settings` | `CalorieSettings` — `{ dailyTarget: 2000 }` |
| `fittrack_workout_state` | `WorkoutState` — selected level, active plan ID, day status map |

## Calorie color logic
- **Red** — daily total > target × 1.1
- **Green** — daily total between target × 0.9 and × 1.1
- **Blue** — daily total < target × 0.9

## Workout plan structure
- **Beginner Full-Body** — 4 weeks, 3 days/week (Mon/Wed/Fri), 3 × 10–12 reps
- **Intermediate Upper/Lower** — 5 weeks, 4 days/week, volume increases weeks 3–5
- **Professional PPL** — 6 weeks, 6 days/week, 4–5 × 5–8 reps, week 6 = deload
- YouTube links are placeholders — replace `youtubeUrl` values in `src/data/workoutPlans.ts`
- Food list can be expanded in `src/data/foods.ts`

## Git workflow — REQUIRED

**Commit and push to GitHub regularly throughout every session.** This is non-negotiable: the user relies on GitHub as the single source of truth and must be able to revert to any previous state at any time.

### Rules
- **Commit after every meaningful unit of work** — a completed component, a bug fix, a data change. Do not batch multiple unrelated changes into one commit.
- **Push immediately after every commit.** Never leave committed work sitting locally.
- **Never end a session without committing and pushing all completed work.**
- Commit style: conventional commits — `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`
- Write commit messages that describe *why*, not just *what* (e.g. `feat: add calorie trend chart for 90-day history` not `update chart`)
- Stage specific files by name — never `git add -A` or `git add .` blindly

### Workflow per change
```bash
git add <specific files>
git commit -m "feat: description of what and why"
git push
```

### Recovery
- `git log --oneline` — review history
- `git revert <hash>` — safely undo a commit without rewriting history
- Remote: https://github.com/zero00cc/fittrack (branch: `main`)

## Known limitations / future work
- YouTube URLs in workout plans are search-query placeholders — real links to be added by the user
- Food list is 30 items — user can extend `src/data/foods.ts` with their own list
- No user accounts — all data is device-local (localStorage)
- Bundle size warning from recharts (~641KB minified) — can be addressed with code-splitting if needed
