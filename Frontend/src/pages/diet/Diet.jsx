import { useState, useEffect } from 'react';
import { dietService } from '../../services/dietService';
import toast from 'react-hot-toast';
import { Plus, UtensilsCrossed, CreditCard as Edit2, Trash2, Search, Calendar, X, CirclePlus as PlusCircle, CircleMinus as MinusCircle, Flame } from 'lucide-react';
import { format } from 'date-fns';

const Diet = () => {
  const [dietLogs, setDietLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDiet, setEditingDiet] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    mealType: '',
    date: new Date().toISOString().split('T')[0],
    foodItems: [{ name: '', calories: '', protein: '', carbs: '', fat: '' }],
  });

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  useEffect(() => {
    fetchDietLogs();
  }, []);

  const fetchDietLogs = async () => {
    try {
      const response = await dietService.getAll();
      setDietLogs(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch diet logs');
    } finally {
      setLoading(false);
    }
  };

  const handleFoodItemChange = (index, field, value) => {
    const newFoodItems = [...formData.foodItems];
    newFoodItems[index] = { ...newFoodItems[index], [field]: value };
    setFormData({ ...formData, foodItems: newFoodItems });
  };

  const addFoodItem = () => {
    setFormData({
      ...formData,
      foodItems: [...formData.foodItems, { name: '', calories: '', protein: '', carbs: '', fat: '' }],
    });
  };

  const removeFoodItem = (index) => {
    if (formData.foodItems.length > 1) {
      const newFoodItems = formData.foodItems.filter((_, i) => i !== index);
      setFormData({ ...formData, foodItems: newFoodItems });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const foodItems = formData.foodItems.map((item) => ({
      name: item.name,
      calories: Number(item.calories) || 0,
      protein: Number(item.protein) || 0,
      carbs: Number(item.carbs) || 0,
      fat: Number(item.fat) || 0,
    }));

    const data = {
      mealType: formData.mealType,
      date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
      foodItems,
    };

    try {
      if (editingDiet) {
        await dietService.update(editingDiet._id, data);
        toast.success('Diet log updated successfully');
      } else {
        await dietService.create(data);
        toast.success('Meal logged successfully');
      }
      setShowModal(false);
      setEditingDiet(null);
      setFormData({
        mealType: '',
        date: new Date().toISOString().split('T')[0],
        foodItems: [{ name: '', calories: '', protein: '', carbs: '', fat: '' }],
      });
      fetchDietLogs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (diet) => {
    setEditingDiet(diet);
    setFormData({
      mealType: diet.mealType,
      date: diet.date ? new Date(diet.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      foodItems: diet.foodItems?.length > 0
        ? diet.foodItems.map((item) => ({
            name: item.name || '',
            calories: item.calories || '',
            protein: item.protein || '',
            carbs: item.carbs || '',
            fat: item.fat || '',
          }))
        : [{ name: '', calories: '', protein: '', carbs: '', fat: '' }],
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this diet log?')) return;

    try {
      await dietService.delete(id);
      toast.success('Diet log deleted successfully');
      fetchDietLogs();
    } catch (error) {
      toast.error('Failed to delete diet log');
    }
  };

  const filteredDietLogs = dietLogs.filter(
    (d) =>
      d.mealType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.foodItems?.some((item) => item.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const calculateTotals = (foodItems) => {
    return foodItems?.reduce(
      (acc, item) => ({
        calories: acc.calories + (item.calories || 0),
        protein: acc.protein + (item.protein || 0),
        carbs: acc.carbs + (item.carbs || 0),
        fat: acc.fat + (item.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const totalMacros = dietLogs.reduce(
    (acc, log) => {
      const totals = calculateTotals(log.foodItems);
      return {
        calories: acc.calories + totals.calories,
        protein: acc.protein + totals.protein,
        carbs: acc.carbs + totals.carbs,
        fat: acc.fat + totals.fat,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
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
            <h1 className="text-2xl font-bold text-gray-900">Diet Tracker</h1>
            <p className="text-gray-600">Track your nutrition and meals</p>
          </div>
          <button
            onClick={() => {
              setEditingDiet(null);
              setFormData({
                mealType: '',
                date: new Date().toISOString().split('T')[0],
                foodItems: [{ name: '', calories: '', protein: '', carbs: '', fat: '' }],
              });
              setShowModal(true);
            }}
            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition"
          >
            <Plus className="h-4 w-4 mr-2" />
            Log Meal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Calories</p>
          <p className="text-xl font-bold text-gray-900">{totalMacros.calories.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Protein</p>
          <p className="text-xl font-bold text-red-600">{totalMacros.protein.toFixed(1)}g</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Carbs</p>
          <p className="text-xl font-bold text-yellow-600">{totalMacros.carbs.toFixed(1)}g</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Fat</p>
          <p className="text-xl font-bold text-blue-600">{totalMacros.fat.toFixed(1)}g</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search meals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      {filteredDietLogs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <UtensilsCrossed className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No meals logged</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'No meals match your search.' : 'Start tracking your nutrition by logging your first meal.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Log Your First Meal
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredDietLogs.map((diet) => {
            const totals = calculateTotals(diet.foodItems);
            return (
              <div
                key={diet._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <UtensilsCrossed className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 capitalize">
                          {diet.mealType}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          {diet.foodItems?.length || 0} items
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {diet.date ? format(new Date(diet.date), 'MMM d, yyyy') : 'N/A'}
                        </span>
                        <span className="flex items-center">
                          <Flame className="w-4 h-4 mr-1 text-orange-500" />
                          {totals.calories} calories
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(diet)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(diet._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Calories</p>
                    <p className="font-semibold text-gray-900">{totals.calories}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Protein</p>
                    <p className="font-semibold text-red-600">{totals.protein.toFixed(1)}g</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Carbs</p>
                    <p className="font-semibold text-yellow-600">{totals.carbs.toFixed(1)}g</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Fat</p>
                    <p className="font-semibold text-blue-600">{totals.fat.toFixed(1)}g</p>
                  </div>
                </div>

                {diet.foodItems?.length > 0 && (
                  <div className="space-y-2">
                    {diet.foodItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm p-2 rounded bg-gray-50">
                        <span className="text-gray-900">{item.name}</span>
                        <span className="text-gray-500">{item.calories} cal</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)} />
            <div className="relative bg-white rounded-2xl max-w-lg w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingDiet ? 'Edit Meal' : 'Log Meal'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meal Type *</label>
                    <select
                      required
                      value={formData.mealType}
                      onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select type</option>
                      {mealTypes.map((type) => (
                        <option key={type} value={type} className="capitalize">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Food Items *</label>
                    <button
                      type="button"
                      onClick={addFoodItem}
                      className="flex items-center text-sm text-green-600 hover:text-green-700"
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add Item
                    </button>
                  </div>

                  {formData.foodItems.map((item, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <input
                          type="text"
                          placeholder="Food name"
                          required
                          value={item.name}
                          onChange={(e) => handleFoodItemChange(index, 'name', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        />
                        {formData.foodItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFoodItem(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <MinusCircle className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <div>
                          <input
                            type="number"
                            placeholder="Calories"
                            min="0"
                            value={item.calories}
                            onChange={(e) => handleFoodItemChange(index, 'calories', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          />
                          <p className="text-xs text-gray-500 mt-1 text-center">Cal</p>
                        </div>
                        <div>
                          <input
                            type="number"
                            placeholder="Protein"
                            min="0"
                            step="0.1"
                            value={item.protein}
                            onChange={(e) => handleFoodItemChange(index, 'protein', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          />
                          <p className="text-xs text-gray-500 mt-1 text-center">Pro</p>
                        </div>
                        <div>
                          <input
                            type="number"
                            placeholder="Carbs"
                            min="0"
                            step="0.1"
                            value={item.carbs}
                            onChange={(e) => handleFoodItemChange(index, 'carbs', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          />
                          <p className="text-xs text-gray-500 mt-1 text-center">Carb</p>
                        </div>
                        <div>
                          <input
                            type="number"
                            placeholder="Fat"
                            min="0"
                            step="0.1"
                            value={item.fat}
                            onChange={(e) => handleFoodItemChange(index, 'fat', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          />
                          <p className="text-xs text-gray-500 mt-1 text-center">Fat</p>
                        </div>
                      </div>
                    </div>
                  ))}
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
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    {editingDiet ? 'Update' : 'Log Meal'}
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

export default Diet;
