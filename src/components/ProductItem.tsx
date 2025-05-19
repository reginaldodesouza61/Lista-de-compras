import React, { useState } from 'react';
import { Edit, Trash2, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProduct } from '../context/ProductContext';
import ProductForm from './ProductForm';
import { Product } from '../types';

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const { updateProduct, deleteProduct } = useProduct();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const togglePurchased = () => {
    updateProduct({
      ...product,
      purchased: !product.purchased
    });
  };

  const handleDelete = () => {
    deleteProduct(product.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className={`p-4 hover:bg-gray-50 transition-colors ${product.purchased ? 'bg-green-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1 min-w-0">
          <input
            type="checkbox"
            checked={product.purchased}
            onChange={togglePurchased}
            className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
          />

          <div className="ml-3 flex-1 min-w-0">
            <p className={`text-sm font-medium text-gray-900 truncate ${product.purchased ? 'line-through text-gray-500' : ''}`}>
              {product.name}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {product.quantity} unid. x R$ {product.unitPrice.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-900">
            R$ {product.totalPrice.toFixed(2)}
          </span>

          {showDeleteConfirm ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-1"
            >
              <button
                onClick={handleDelete}
                className="p-1 rounded-full text-red-600 hover:bg-red-100"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ) : (
            <>
              <button
                onClick={() => setShowEditForm(true)}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Edit form modal */}
      <ProductForm 
        isOpen={showEditForm} 
        onClose={() => setShowEditForm(false)}
        product={product}
      />
    </div>
  );
};

export default ProductItem;
