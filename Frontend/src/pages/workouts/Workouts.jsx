import { useState, useEffect } from 'react';
import { workoutService } from '../../services/workoutService';
import toast from 'react-hot-toast';
import { Plus, Dumbbell, CreditCard as Edit2, Trash2, Search, Calendar, Flame, Clock, X } from 'lucide-react';
import { format } from 'date-fns';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    type: '',
    duration: '',
    caloriesBurned: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });

  const workoutTypes = ['running', 'cycling', 'yoga', 'strength', 'swimming', 'walking', 'other'];

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await workoutService.getAll();
      setWorkouts(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch workouts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...formData,
      duration: Number(formData.duration),
      caloriesBurned: formData.caloriesBurned ? Number(formData.caloriesBurned) : undefined,
    };

    try {
      if (editingWorkout) {
        await workoutService.update(editingWorkout._id, data);
        toast.success('Workout updated successfully');
      } else {
        await workoutService.create(data);
        toast.success('Workout logged successfully');
      }
      setShowModal(false);
      setEditingWorkout(null);
      setFormData({
        type: '',
        duration: '',
        caloriesBurned: '',
        notes: '',
        date: new Date().toISOString().split('T')[0],
      });
      fetchWorkouts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (workout) => {
    setEditingWorkout(workout);
    setFormData({
      type: workout.type,
      duration: workout.duration,
      caloriesBurned: workout.caloriesBurned || '',
      notes: workout.notes || '',
      date: workout.date ? new Date(workout.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return;

    try {
      await workoutService.delete(id);
      toast.success('Workout deleted successfully');
      fetchWorkouts();
    } catch (error) {
      toast.error('Failed to delete workout');
    }
  };

  const filteredWorkouts = workouts.filter(
    (w) =>
      w.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.notes && w.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Workouts</h1>
            <p className="text-gray-600">Track and manage your workout sessions</p>
          </div>
          <button
            onClick={() => {
              setEditingWorkout(null);
              setFormData({
                type: '',
                duration: '',
                caloriesBurned: '',
                notes: '',
                date: new Date().toISOString().split('T')[0],
              });
              setShowModal(true);
            }}
            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 transition"
          >
            <Plus className="h-4 w-4 mr-2" />
            Log Workout
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search workouts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      {filteredWorkouts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <Dumbbell className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No workouts</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'No workouts match your search.' : 'Get started by logging your first workout.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-teal-500 hover:bg-teal-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Log Workout
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredWorkouts.map((workout) => (
            <div
              key={workout._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <Dumbbell className="h-6 w-6 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">
                        {workout.type}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
                        {workout.duration} min
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {workout.date ? format(new Date(workout.date), 'MMM d, yyyy') : 'N/A'}
                      </span>
                      {workout.caloriesBurned && (
                        <span className="flex items-center">
                          <Flame className="w-4 h-4 mr-1 text-orange-500" />
                          {workout.caloriesBurned} calories burned
                        </span>
                      )}
                    </div>
                    {workout.notes && (
                      <p className="mt-2 text-sm text-gray-600">{workout.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(workout)}
                    className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(workout._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)} />
            <div className="relative bg-white rounded-2xl max-w-lg w-full mx-4 shadow-xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingWorkout ? 'Edit Workout' : 'Log Workout'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Workout Type *</label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Select type</option>
                    {workoutTypes.map((type) => (
                      <option key={type} value={type} className="capitalize">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (min) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Calories Burned</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.caloriesBurned}
                      onChange={(e) => setFormData({ ...formData, caloriesBurned: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    rows="3"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    placeholder="How did you feel? Any personal records?"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-teal-500 hover:bg-teal-600"
                  >
                    {editingWorkout ? 'Update' : 'Log Workout'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workouts;
