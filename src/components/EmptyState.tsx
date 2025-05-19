import React from 'react';
import { ShoppingCart, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  searchTerm?: string;
  onAddClick: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ searchTerm, onAddClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-12 px-4 text-center"
    >
      <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
      
      {searchTerm ? (
        <>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum produto encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Não foi possível encontrar produtos com "{searchTerm}".
          </p>
          <div className="mt-6">
            <button
              onClick={onAddClick}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <PlusCircle className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Adicionar produto
            </button>
          </div>
        </>
      ) : (
        <>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Sua lista está vazia</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comece adicionando o primeiro produto à sua lista de compras.
          </p>
          <div className="mt-6">
            <button
              onClick={onAddClick}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <PlusCircle className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Adicionar primeiro produto
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default EmptyState;