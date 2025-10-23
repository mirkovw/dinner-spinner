import { useEffect, useState } from 'react';
import { api } from './api/client';

interface HealthResponse {
  status: string;
  message: string;
  database: string;
}

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const data = await api.get('/health');
        setHealth(data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Health check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Full Stack Boilerplate
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            API Status
          </h2>
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
              <p className="text-gray-600">Checking...</p>
            </div>
          ) : health ? (
            <pre className="bg-gray-50 rounded p-4 overflow-x-auto text-sm">
              {JSON.stringify(health, null, 2)}
            </pre>
          ) : (
            <p className="text-red-600">API not responding</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
