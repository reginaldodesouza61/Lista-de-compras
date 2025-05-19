import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProduct } from '../context/ProductContext';
import { Product } from '../types';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
}

const ProductForm: React.FC<ProductFormProps> = ({ isOpen, onClose, product }) => {
  const { addProduct, updateProduct } = useProduct();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Update form fields when product prop changes or form opens
  useEffect(() => {
    if (product) {
      setName(product.name);
      setQuantity(product.quantity);
      setUnitPrice(product.unitPrice);
      setTotalPrice(product.totalPrice);
    } else {
      // Reset form for new product
      setName('');
      setQuantity(1);
      setUnitPrice(0);
      setTotalPrice(0);
    }
  }, [product, isOpen]);

  // Calculate total price when quantity or unit price changes
  useEffect(() => {
    setTotalPrice(quantity * unitPrice);
  }, [quantity, unitPrice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData: Omit<Product, 'id'> = {
      name,
      quantity,
      unitPrice,
      totalPrice,
      purchased: product ? product.purchased : false
    };
    
    if (product) {
      updateProduct({ ...productData, id: product.id });
    } else {
      addProduct(productData);
    }
    
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={onClose}
            />
            
            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {product ? 'Editar produto' : 'Adicionar produto'}
                  </h3>
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="sr-only">Fechar</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Produto
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                        placeholder="Nome do produto"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                          Quantidade
                        </label>
                        <input
                          type="number"
                          id="quantity"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                          min="1"
                          step="1"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700">
                          Valor Unitário (R$)
                        </label>
                        <input
  type="number"
  id="unitPrice"
  value={unitPrice}
  onChange={(e) => {
    const value = e.target.value.replace(',', '.');
    setUnitPrice(parseFloat(value) || 0);
  }}
  min="0"
  step="0.01"
  required
  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
/>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Valor Total
                      </label>
                      <div className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700 sm:text-sm">
                        R$ {totalPrice.toFixed(2)}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Calculado automaticamente (quantidade × valor unitário)
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-green-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {product ? 'Atualizar' : 'Adicionar'}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={onClose}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductForm;