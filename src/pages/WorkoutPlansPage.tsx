import { useState } from 'react';
import { useWorkoutStore } from '../hooks/useWorkoutStore';
import { workoutPlans } from '../data/workoutPlans';
import { LevelSelector } from '../components/workout/LevelSelector';
import { PlanList } from '../components/workout/PlanList';
import { SchedulePicker } from '../components/workout/SchedulePicker';
import { PlanOverview } from '../components/workout/PlanOverview';
import { WorkoutCalendar } from '../components/workout/WorkoutCalendar';
import { TrainingLevel, WorkoutPlan } from '../types/workout.types';

type View = 'level' | 'plans' | 'schedule' | 'detail';

export function WorkoutPlansPage() {
  const { workoutState, setLevel, activatePlan, updateDayStatus, updateSetProgress, resetPlan } = useWorkoutStore();

  const getInitialView = (): View => {
    if (workoutState.activePlanId && workoutState.progress) return 'detail';
    if (workoutState.selectedLevel) return 'plans';
    return 'level';
  };

  const [view, setView] = useState<View>(getInitialView);
  // Holds the plan the user clicked on the plan list, before confirming the schedule
  const [pendingPlan, setPendingPlan] = useState<WorkoutPlan | null>(null);

  function handleSelectLevel(level: TrainingLevel) {
    setLevel(level);
    setView('plans');
  }

  function handleSelectPlan(plan: WorkoutPlan) {
    setPendingPlan(plan);
    setView('schedule');
  }

  function handleConfirmSchedule(weeklySchedule: number[]) {
    if (!pendingPlan) return;
    activatePlan(pendingPlan.id, weeklySchedule);
    setPendingPlan(null);
    setView('detail');
  }

  function handleReset() {
    resetPlan();
    setPendingPlan(null);
    setView('plans');
  }

  const filteredPlans = workoutState.selectedLevel
    ? workoutPlans.filter((p) => p.level === workoutState.selectedLevel)
    : [];

  const activePlan = workoutPlans.find((p) => p.id === workoutState.activePlanId) ?? null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-5">
      <h1 className="text-2xl font-bold text-gray-800">Workout Plans</h1>

      {view === 'level' && (
        <LevelSelector
          selected={workoutState.selectedLevel}
          onSelect={handleSelectLevel}
        />
      )}

      {view === 'plans' && workoutState.selectedLevel && (
        <PlanList
          plans={filteredPlans}
          level={workoutState.selectedLevel}
          activePlanId={workoutState.activePlanId}
          onSelect={handleSelectPlan}
          onBack={() => setView('level')}
        />
      )}

      {view === 'schedule' && pendingPlan && (
        <SchedulePicker
          plan={pendingPlan}
          onConfirm={handleConfirmSchedule}
          onBack={() => setView('plans')}
        />
      )}

      {view === 'detail' && activePlan && workoutState.progress && (
        <div className="flex flex-col gap-4">
          <PlanOverview
            plan={activePlan}
            startDate={workoutState.progress.startDate}
            onBack={() => setView('plans')}
            onReset={handleReset}
          />
          <WorkoutCalendar
            plan={activePlan}
            progress={workoutState.progress}
            onUpdateStatus={updateDayStatus}
            onUpdateSetProgress={updateSetProgress}
          />
        </div>
      )}
    </div>
  );
}
