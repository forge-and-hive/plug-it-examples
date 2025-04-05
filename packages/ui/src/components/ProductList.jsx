import React, { useState, useEffect } from 'react';
import { actions } from 'astro:actions';
import AddProductForm from './AddProductForm';
import ProductModal from './ProductModal';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const result = await actions.inventory.listProducts({});

      setProducts(result.data);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductAdded = () => {
    fetchProducts();
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-8">
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={handleCloseModal} 
          onProductUpdated={fetchProducts}
        />
      )}
      
      <h2 className="text-2xl font-bold mb-4">Product Inventory</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          
          {loading && (
            <div className="p-4 text-center">
              <div className="text-lg font-medium text-gray-600">Loading products...</div>
            </div>
          )}
          
          {error && (
            <div className="p-4 text-center">
              <div className="text-lg font-medium text-red-600">{error}</div>
            </div>
          )}
          
          {!loading && !error && products.length === 0 && (
            <div className="p-4 text-center">
              <div className="text-lg font-medium text-gray-600">No products available</div>
            </div>
          )}
          
          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map(product => (
                <div 
                  key={product.id} 
                  className="bg-white p-4 rounded-lg shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleProductClick(product)}
                >
                  <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm text-gray-600">ID: {product.id}</span>
                    <span 
                      className={`font-medium px-2 py-1 rounded-full text-sm ${
                        product.quantity > 10 
                          ? 'bg-green-100 text-green-800' 
                          : product.quantity > 3 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      In stock: {product.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <AddProductForm onProductAdded={handleProductAdded} />
        </div>
      </div>
    </div>
  );
} 