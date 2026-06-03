import clsx from 'clsx';
import { DayStatus } from '../../types/workout.types';

const statusConfig: Record<DayStatus, { label: string; classes: string }> = {
  finished: { label: 'Finished', classes: 'bg-green-100 text-green-800 border-green-300' },
  skipped: { label: 'Skipped', classes: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  unfinished: { label: 'Unfinished', classes: 'bg-gray-100 text-gray-600 border-gray-300' },
};

export function Badge({ status }: { status: DayStatus }) {
  const { label, classes } = statusConfig[status];
  return (
    <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full border', classes)}>
      {label}
    </span>
  );
}
