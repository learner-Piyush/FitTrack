import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { workoutService } from '../services/workoutService';
import { dietService } from '../services/dietService';
import { progressService } from '../services/progressService';
import { Dumbbell, UtensilsCrossed, TrendingUp, Flame, Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalCaloriesBurned: 0,
    totalCaloriesConsumed: 0,
    latestBMI: null,
  });
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [recentDiet, setRecentDiet] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [workoutsRes, dietRes, progressRes] = await Promise.all([
        workoutService.getAll(),
        dietService.getAll(),
        progressService.getAll(),
      ]);

      const workouts = workoutsRes.data || [];
      const dietLogs = dietRes.data || [];
      const progress = progressRes.data || [];

      const totalCaloriesBurned = workouts.reduce(
        (sum, w) => sum + (w.caloriesBurned || 0),
        0
      );
      const totalCaloriesConsumed = dietLogs.reduce(
        (sum, d) => sum + (d.totalCalories || 0),
        0
      );

      setStats({
        totalWorkouts: workouts.length,
        totalCaloriesBurned,
        totalCaloriesConsumed,
        latestBMI: progress.length > 0 ? progress[progress.length - 1].bmi : null,
      });

      setRecentWorkouts(workouts.slice(0, 5));
      setRecentDiet(dietLogs.slice(0, 5));
      setProgressData(progress.slice(-7));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.fullName?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-gray-600">Here's an overview of your fitness journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-teal-100">
              <Dumbbell className="h-6 w-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Workouts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalWorkouts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-100">
              <Flame className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Calories Burned</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCaloriesBurned.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <UtensilsCrossed className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Calories Consumed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCaloriesConsumed.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Current BMI</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.latestBMI ? stats.latestBMI.toFixed(1) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Workouts</h2>
              <Link
                to="/workouts"
                className="flex items-center text-sm text-teal-600 hover:text-teal-500"
              >
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentWorkouts.length === 0 ? (
              <div className="text-center py-8">
                <Dumbbell className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-gray-500">No workouts logged yet</p>
                <Link
                  to="/workouts"
                  className="mt-4 inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-teal-500 hover:bg-teal-600"
                >
                  Add your first workout
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentWorkouts.map((workout) => (
                  <div
                    key={workout._id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                        <Dumbbell className="h-5 w-5 text-teal-600" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900 capitalize">{workout.type}</p>
                        <p className="text-sm text-gray-500">{workout.duration} minutes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {workout.date ? format(new Date(workout.date), 'MMM d, yyyy') : 'N/A'}
                      </p>
                      {workout.caloriesBurned && (
                        <p className="text-sm text-orange-600">{workout.caloriesBurned} cal</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Meals</h2>
              <Link
                to="/diet"
                className="flex items-center text-sm text-teal-600 hover:text-teal-500"
              >
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentDiet.length === 0 ? (
              <div className="text-center py-8">
                <UtensilsCrossed className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-gray-500">No meals logged yet</p>
                <Link
                  to="/diet"
                  className="mt-4 inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-teal-500 hover:bg-teal-600"
                >
                  Log your first meal
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentDiet.map((meal) => (
                  <div
                    key={meal._id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <UtensilsCrossed className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900 capitalize">{meal.mealType}</p>
                        <p className="text-sm text-gray-500">
                          {meal.foodItems?.length || 0} items
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {meal.date ? format(new Date(meal.date), 'MMM d, yyyy') : 'N/A'}
                      </p>
                      <p className="text-sm text-green-600">{meal.totalCalories || 0} cal</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/workouts"
            className="flex items-center p-4 rounded-lg bg-teal-50 hover:bg-teal-100 transition"
          >
            <Dumbbell className="h-6 w-6 text-teal-600" />
            <div className="ml-3">
              <p className="font-medium text-gray-900">Log Workout</p>
              <p className="text-sm text-gray-500">Track your exercise</p>
            </div>
          </Link>
          <Link
            to="/diet"
            className="flex items-center p-4 rounded-lg bg-green-50 hover:bg-green-100 transition"
          >
            <UtensilsCrossed className="h-6 w-6 text-green-600" />
            <div className="ml-3">
              <p className="font-medium text-gray-900">Log Meal</p>
              <p className="text-sm text-gray-500">Track your nutrition</p>
            </div>
          </Link>
          <Link
            to="/progress"
            className="flex items-center p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
          >
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <p className="font-medium text-gray-900">Update Progress</p>
              <p className="text-sm text-gray-500">Record your measurements</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
