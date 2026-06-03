import { WorkoutPlan, TrainingLevel } from '../../types/workout.types';

interface Props {
  plan: WorkoutPlan;
  startDate: string;
  onBack: () => void;
  onReset: () => void;
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

export function PlanOverview({ plan, startDate, onBack, onReset }: Props) {
  const totalTrainingDays = plan.days.filter((d) => !d.isRestDay).length;

  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-sm text-emerald-600 hover:underline">← Back</button>
        <h2 className="text-xl font-bold text-gray-800 flex-1">{plan.name}</h2>
        <button
          onClick={onReset}
          className="text-xs text-red-500 hover:underline"
        >
          Reset plan
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${levelBadge[plan.level]}`}>
          {levelLabel[plan.level]}
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
          {plan.durationWeeks} weeks
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
          {totalTrainingDays} training days
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
          Started {startDate}
        </span>
      </div>

      <p className="text-sm text-gray-600">{plan.description}</p>

      <div className="flex gap-4 text-xs text-gray-500 pt-1">
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-green-400"></span>Finished</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-yellow-400"></span>Skipped</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-gray-300"></span>Unfinished</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-gray-100 border border-gray-200"></span>Rest day</span>
      </div>
    </div>
  );
}
