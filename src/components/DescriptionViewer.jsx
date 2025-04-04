import { useState, useEffect } from 'react';
import { actions } from 'astro:actions';

export default function DescriptionViewer() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDescription() {
      console.log('fetching description')
      try {
        setLoading(true);
        const result = await actions.description({});
        setData(result.data.description);
      } catch (err) {
        setError(err.message || 'Failed to load description');
      } finally {
        setLoading(false);
      }
    }

    fetchDescription();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8 text-black">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Runner Description</h2>
      
      {data && (
        <div className="overflow-auto">
          {Object.keys(data).length === 0 ? (
            <h3 className="text-xl text-center py-6 text-gray-600">No tasks on the runner</h3>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(data).map(([key, value]) => (
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