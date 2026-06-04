import { Exercise } from '../../data/exercises';

interface Props {
  exercise: Exercise;
}

export function ExerciseCard({ exercise }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">{exercise.name}</h2>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {exercise.muscleGroups.map((m) => (
            <span
              key={m}
              className="text-xs bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded-full"
            >
              {m}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">{exercise.description}</p>
      </div>

      {/* Video */}
      <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
        {exercise.youtubeId ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${exercise.youtubeId}`}
            title={`${exercise.name} tutorial`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
            <span className="text-3xl">🎬</span>
            <p className="text-sm">Video coming soon</p>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Steps */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">How to perform</h3>
          <ol className="flex flex-col gap-2 list-none pl-0">
            {exercise.steps.map((step, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-gray-600">
                <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center font-bold mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Tips */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Tips & cues</h3>
          <ul className="flex flex-col gap-2 list-none pl-0">
            {exercise.tips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="shrink-0 text-emerald-400 font-bold mt-0.5">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
