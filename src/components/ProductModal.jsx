import React, { useState } from 'react';
import { actions } from 'astro:actions';

export default function ProductModal({ product, onClose, onProductUpdated }) {
  const [action, setAction] = useState('sell');
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let result;
      
      if (action === 'sell') {
        result = await actions.inventory.sell({
          productId: product.id,
          amount: Number(amount)
        });
        setSuccess(`Sold ${amount} units of ${product.name}`);
      } else if (action === 'restock') {
        result = await actions.inventory.restock({
          productId: product.id,
          amount: Number(amount)
        });
        setSuccess(`Restocked ${amount} units of ${product.name}`);
      } else if (action === 'delete') {
        result = await actions.inventory.deleteProduct({
          id: product.id
        });
        setSuccess(`Deleted ${product.name}`);
        setTimeout(() => {
          onClose();
          onProductUpdated();
        }, 1500);
        return;
      }
      
      onProductUpdated();
    } catch (err) {
      console.error('Error in product action:', err);
      setError(`Failed to ${action} product: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay" onClick={handleOutsideClick}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {product.name}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600">
            Current stock: <span className="font-medium">{product.quantity}</span>
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-800 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-2 bg-green-100 text-green-800 rounded-md">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Action
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button 
                type="button"
                onClick={() => setAction('sell')}
                className={`py-2 px-3 text-sm rounded-md ${
                  action === 'sell' 
                    ? 'bg-blue-100 text-blue-800 border-blue-300 border' 
                    : 'bg-gray-100 text-gray-800 border-gray-200 border'
                }`}
              >
                Sell
              </button>
              <button 
                type="button"
                onClick={() => setAction('restock')}
                className={`py-2 px-3 text-sm rounded-md ${
                  action === 'restock' 
                    ? 'bg-green-100 text-green-800 border-green-300 border' 
                    : 'bg-gray-100 text-gray-800 border-gray-200 border'
                }`}
              >
                Restock
              </button>
              <button 
                type="button"
                onClick={() => setAction('delete')}
                className={`py-2 px-3 text-sm rounded-md ${
                  action === 'delete' 
                    ? 'bg-red-100 text-red-800 border-red-300 border' 
                    : 'bg-gray-100 text-gray-800 border-gray-200 border'
                }`}
              >
                Delete
              </button>
            </div>
          </div>
          
          {action !== 'delete' && (
            <div className="mb-4">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                {action === 'sell' ? 'Sell Amount' : 'Restock Amount'}
              </label>
              <input
                type="number"
                id="amount"
                min="1"
                max={action === 'sell' ? product.quantity : 1000}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}
          
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                action === 'delete'
                  ? 'bg-red-600 hover:bg-red-700'
                  : action === 'restock'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-blue-600 hover:bg-blue-700'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : action === 'delete' ? 'Delete' : action === 'sell' ? 'Sell' : 'Restock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 