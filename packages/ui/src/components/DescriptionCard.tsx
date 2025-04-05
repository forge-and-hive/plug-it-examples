import { useEffect, useState } from 'react';
import { actions } from 'astro:actions';

interface TaskDescription {
  name: string;
  description: string;
  parameters: Record<string, any>;
}

export default function DescriptionCard() {
  const [tasks, setTasks] = useState<TaskDescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        setLoading(true);
        const result = await actions.description({});

        console.log('result:', result.data?.description)
        if (!result.error) {
          setTasks(result.data?.description || []);
        } else {
          setError(result.error.message || 'Failed to fetch tasks');
        }
      } catch (err) {
        setError('An error occurred while fetching tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchDescription();
  }, []);

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4 w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-medium">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8 text-black">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Runner Description</h2>
      
      {tasks && (
        <div className="overflow-auto">
          {Object.keys(tasks).length === 0 ? (
            <h3 className="text-xl text-center py-6 text-gray-600">No tasks on the runner</h3>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(tasks).map(([key, value]) => (
                <div key={key} className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold text-lg text-gray-700 capitalize mb-2">{key}</h3>
                  <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-3 rounded overflow-auto max-h-48">
                    {typeof value === 'object' 
                      ? JSON.stringify(value, null, 2) 
                      : String(value)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 