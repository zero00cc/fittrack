import { TrainingLevel } from '../../types/workout.types';
import clsx from 'clsx';

interface Props {
  selected: TrainingLevel | null;
  onSelect: (level: TrainingLevel) => void;
}

const levels: Array<{ id: TrainingLevel; label: string; description: string; icon: string; color: string }> = [
  {
    id: 'beginner',
    label: 'Beginner',
    description: 'New to weight training. 3 days/week, full-body compound movements, 4-week program.',
    icon: '🌱',
    color: 'border-green-400 bg-green-50 hover:bg-green-100',
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    description: '6+ months of training. 4 days/week, upper/lower split, 5-week program with progressive overload.',
    icon: '⚡',
    color: 'border-blue-400 bg-blue-50 hover:bg-blue-100',
  },
  {
    id: 'professional',
    label: 'Professional',
    description: 'Advanced lifter. 6 days/week, push/pull/legs, 6-week high-volume hypertrophy block.',
    icon: '🏆',
    color: 'border-purple-400 bg-purple-50 hover:bg-purple-100',
  },
];

export function LevelSelector({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Select Your Training Level</h2>
        <p className="text-sm text-gray-500 mt-1">Choose the level that best describes your current experience with weight training.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => onSelect(level.id)}
            className={clsx(
              'rounded-xl border-2 p-5 text-left transition-all shadow-sm',
              level.color,
              selected === level.id && 'ring-2 ring-offset-2 ring-emerald-500',
            )}
          >
            <div className="text-3xl mb-2">{level.icon}</div>
            <div className="text-base font-bold text-gray-800 mb-1">{level.label}</div>
            <p className="text-xs text-gray-600">{level.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
