import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { Product } from '../types';
import { getProducts, addProductToSheet, updateProductInSheet, deleteProductFromSheet } from '../services/sheetService';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType>({
  products: [],
  loading: false,
  addProduct: async () => {},
  updateProduct: async () => {},
  deleteProduct: async () => {},
});

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, accessToken } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      if (isAuthenticated && accessToken) {
        setLoading(true);
        try {
          const fetchedProducts = await getProducts(accessToken);
          setProducts(fetchedProducts);
        } catch (error) {
          console.error('Error fetching products', error);
          toast.error('Erro ao carregar produtos. Tente novamente.');
        }
        setLoading(false);
      } else {
        setProducts([]);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [isAuthenticated, accessToken]);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    if (!accessToken) return;
    try {
      const newProduct = await addProductToSheet(product, accessToken);
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      toast.success('Produto adicionado com sucesso!');
    } catch (error) {
      console.error('Error adding product', error);
      toast.error('Erro ao adicionar produto. Tente novamente.');
    }
  };

  const updateProduct = async (product: Product) => {
    if (!accessToken) return;
    try {
      await updateProductInSheet(product, accessToken);
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p.id === product.id ? product : p))
      );
      toast.success('Produto atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating product', error);
      toast.error('Erro ao atualizar produto. Tente novamente.');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!accessToken) return;
    try {
      await deleteProductFromSheet(id, accessToken);
      setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id));
      toast.success('Produto removido com sucesso!');
    } catch (error) {
      console.error('Error deleting product', error);
      toast.error('Erro ao remover produto. Tente novamente.');
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);