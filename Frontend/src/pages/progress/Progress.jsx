import { useState, useEffect } from 'react';
import { progressService } from '../../services/progressService';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Plus, TrendingUp, Trash2, Calendar, Activity, X } from 'lucide-react';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const Progress = () => {
  const { user, updateUser } = useAuth();
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    bodyFat: '',
  });

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await progressService.getAll();
      setProgressData(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch progress data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
      bodyFat: formData.bodyFat ? Number(formData.bodyFat) : undefined,
    };

    try {
      await progressService.create(data);
      toast.success('Progress logged successfully');
      setShowModal(false);
      setFormData({ date: new Date().toISOString().split('T')[0], bodyFat: '' });
      fetchProgress();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to log progress');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this progress entry?')) return;

    try {
      await progressService.delete(id);
      toast.success('Progress deleted successfully');
      fetchProgress();
    } catch (error) {
      toast.error('Failed to delete progress');
    }
  };

  const chartData = progressData.map((item) => ({
    date: format(new Date(item.date), 'MMM d'),
    BMI: item.bmi,
    'Body Fat %': item.bodyFat,
  }));

  const latestBMI = progressData.length > 0 ? progressData[progressData.length - 1].bmi : null;
  const latestBodyFat = progressData.length > 0 ? progressData[progressData.length - 1].bodyFat : null;

  const getBMICategory = (bmi) => {
    if (!bmi) return { label: 'N/A', color: 'text-gray-500' };
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
    if (bmi < 25) return { label: 'Normal', color: 'text-green-500' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-500' };
    return { label: 'Obese', color: 'text-red-500' };
  };

  const bmiCategory = getBMICategory(latestBMI);

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
            <h1 className="text-2xl font-bold text-gray-900">Progress Tracker</h1>
            <p className="text-gray-600">Monitor your fitness progress over time</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            <Plus className="h-4 w-4 mr-2" />
            Log Progress
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Current BMI</p>
              <p className="text-2xl font-bold text-gray-900">
                {latestBMI ? latestBMI.toFixed(1) : 'N/A'}
              </p>
              <p className={`text-sm ${bmiCategory.color}`}>{bmiCategory.label}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Body Fat %</p>
              <p className="text-2xl font-bold text-gray-900">
                {latestBodyFat ? `${latestBodyFat}%` : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Log Entries</p>
              <p className="text-2xl font-bold text-gray-900">{progressData.length}</p>
            </div>
          </div>
        </div>
      </div>

      {progressData.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Progress Over Time</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="BMI"
                  stroke="#0d9488"
                  strokeWidth={2}
                  dot={{ fill: '#0d9488', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="Body Fat %"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <TrendingUp className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No progress data yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start tracking your progress to see your fitness journey.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Log Your First Entry
          </button>
        </div>
      )}

      {progressData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Progress History</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {progressData.map((entry) => (
              <div
                key={entry._id}
                className="p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {format(new Date(entry.date), 'MMMM d, yyyy')}
                    </p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      {entry.bmi && <span>BMI: {entry.bmi.toFixed(1)}</span>}
                      {entry.bodyFat && <span>Body Fat: {entry.bodyFat}%</span>}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(entry._id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)} />
            <div className="relative bg-white rounded-2xl max-w-md w-full mx-4 shadow-xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Log Progress</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Body Fat % (optional)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="2"
                    max="75"
                    value={formData.bodyFat}
                    onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 18.5"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                  <p className="font-medium mb-2">Note:</p>
                  <p>Your BMI will be automatically calculated based on your current height ({user?.height} cm) and weight ({user?.weight} kg).</p>
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
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Log Progress
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

export default Progress;
