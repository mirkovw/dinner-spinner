import { useEffect, useState } from 'react';
import { api } from './api/client';

interface Dish {
  _id: string;
  name: string;
  description?: string;
  cuisine?: string;
}

function App() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newDish, setNewDish] = useState({ name: '', description: '', cuisine: '' });

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      const data = await api.get('/dishes');
      setDishes(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch dishes:', error);
    }
  };

  const spinForDinner = async () => {
    if (dishes.length === 0) {
      alert('Please add some dishes first!');
      return;
    }

    setSpinning(true);
    setSelectedDish(null);

    // Simulate spinning animation
    const spinDuration = 2000;
    const intervalTime = 100;
    const iterations = spinDuration / intervalTime;

    for (let i = 0; i < iterations; i++) {
      await new Promise(resolve => setTimeout(resolve, intervalTime));
      const randomIndex = Math.floor(Math.random() * dishes.length);
      setSelectedDish(dishes[randomIndex]);
    }

    // Get final random dish from backend
    try {
      const dish = await api.get('/dishes/random');
      setSelectedDish(dish);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to get random dish:', error);
    } finally {
      setSpinning(false);
    }
  };

  const addDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDish.name) return;

    try {
      await api.post('/dishes', newDish);
      setNewDish({ name: '', description: '', cuisine: '' });
      setShowForm(false);
      await fetchDishes();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to add dish:', error);
    }
  };

  const deleteDish = async (id: string) => {
    try {
      await api.delete(`/dishes/${id}`);
      await fetchDishes();
      if (selectedDish?._id === id) {
        setSelectedDish(null);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete dish:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-orange-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-2 bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
          Dinner Spinner
        </h1>
        <p className="text-center text-gray-600 mb-8">Can't decide what to eat? Let fate decide!</p>

        {/* Spinner Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="flex flex-col items-center">
            <div className="relative w-64 h-64 mb-8">
              <div className={`absolute inset-0 flex items-center justify-center ${spinning ? 'animate-spin' : ''}`}>
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-red-400 to-rose-400 flex items-center justify-center shadow-lg">
                  <div className="w-40 h-40 rounded-full bg-white flex items-center justify-center">
                    {selectedDish ? (
                      <div className="text-center p-4">
                        <p className="text-2xl font-bold text-gray-800">{selectedDish.name}</p>
                        {selectedDish.cuisine && (
                          <p className="text-sm text-red-600 mt-2">{selectedDish.cuisine}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-center">?</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {selectedDish && !spinning && selectedDish.description && (
              <div className="mb-6 text-center">
                <p className="text-gray-600 italic">{selectedDish.description}</p>
              </div>
            )}

            <button
              onClick={spinForDinner}
              disabled={spinning || dishes.length === 0}
              className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-12 py-4 rounded-full text-xl font-bold hover:from-red-700 hover:to-rose-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {spinning ? 'Spinning...' : 'SPIN FOR DINNER!'}
            </button>
          </div>
        </div>

        {/* Dishes Management */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Your Dishes ({dishes.length})
            </h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              {showForm ? 'Cancel' : '+ Add Dish'}
            </button>
          </div>

          {/* Add Dish Form */}
          {showForm && (
            <form onSubmit={addDish} className="mb-6 p-4 bg-red-50 rounded-lg">
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Dish name *"
                  value={newDish.name}
                  onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={newDish.description}
                  onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Cuisine type (optional)"
                  value={newDish.cuisine}
                  onChange={(e) => setNewDish({ ...newDish, cuisine: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Add Dish
                </button>
              </div>
            </form>
          )}

          {/* Dishes List */}
          {dishes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">No dishes yet!</p>
              <p className="text-sm">Add your favorite dishes to get started.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {dishes.map((dish) => (
                <div
                  key={dish._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{dish.name}</h3>
                    {dish.description && (
                      <p className="text-sm text-gray-600">{dish.description}</p>
                    )}
                    {dish.cuisine && (
                      <span className="inline-block mt-1 text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                        {dish.cuisine}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => deleteDish(dish._id)}
                    className="ml-4 text-red-500 hover:text-red-700 transition-colors font-semibold"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
