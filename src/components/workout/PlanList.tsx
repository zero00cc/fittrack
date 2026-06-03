import { WorkoutPlan, TrainingLevel } from '../../types/workout.types';
import clsx from 'clsx';

interface Props {
  plans: WorkoutPlan[];
  level: TrainingLevel;
  activePlanId: string | null;
  onSelect: (plan: WorkoutPlan) => void;
  onBack: () => void;
}

const levelLabel: Record<TrainingLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  professional: 'Professional',
};

const levelBadge: Record<TrainingLevel, string> = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-blue-100 text-blue-800',
  professional: 'bg-purple-100 text-purple-800',
};

export function PlanList({ plans, level, activePlanId, onSelect, onBack }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-sm text-emerald-600 hover:underline">← Back</button>
        <h2 className="text-xl font-bold text-gray-800">{levelLabel[level]} Plans</h2>
      </div>
      <div className="flex flex-col gap-3">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => onSelect(plan)}
            className={clsx(
              'rounded-xl border-2 p-5 text-left transition-all shadow-sm hover:shadow-md',
              activePlanId === plan.id
                ? 'border-emerald-400 bg-emerald-50'
                : 'border-gray-200 bg-white hover:border-gray-300',
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-800">{plan.name}</span>
                  <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', levelBadge[level])}>
                    {levelLabel[level]}
                  </span>
                  {activePlanId === plan.id && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Active</span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-lg font-bold text-gray-800">{plan.durationWeeks}w</div>
                <div className="text-xs text-gray-400">duration</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
