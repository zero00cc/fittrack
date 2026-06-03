import { Routes, Route } from 'react-router-dom';
import { NavBar } from './components/common/NavBar';
import { HomePage } from './pages/HomePage';
import { CalorieTrackerPage } from './pages/CalorieTrackerPage';
import { WorkoutPlansPage } from './pages/WorkoutPlansPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/calories" element={<CalorieTrackerPage />} />
        <Route path="/workouts" element={<WorkoutPlansPage />} />
      </Routes>
    </div>
  );
}

export default App;
