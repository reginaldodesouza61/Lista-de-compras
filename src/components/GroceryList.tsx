import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useProduct } from '../context/ProductContext';
import ProductItem from './ProductItem';
import ProductForm from './ProductForm';
import EmptyState from './EmptyState';

const GroceryList: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { products, loading } = useProduct();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Faça login para ver sua lista de compras</h2>
        <p className="text-gray-600">Conecte-se com sua conta Google para acessar e gerenciar sua lista de compras.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Lista de Compras</h2>
          <div className="flex items-center gap-2">
            <div className="relative flex-grow max-w-xs">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm"
              />
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-1" />
              Adicionar
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
          <span className="ml-2 text-gray-600">Carregando produtos...</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState searchTerm={searchTerm} onAddClick={() => setShowAddForm(true)} />
      ) : (
        <div className="divide-y divide-gray-200">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ProductItem product={product} />
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="p-4 bg-gray-50">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-gray-600">Total de itens: {filteredProducts.length}</span>
              <span className="text-gray-900">
                Valor total: R$ {filteredProducts.reduce((sum, product) => sum + product.totalPrice, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Add product form modal */}
      <ProductForm 
        isOpen={showAddForm} 
        onClose={() => setShowAddForm(false)} 
      />
    </div>
  );
};

export default GroceryList;