import React from 'react';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import GroceryList from './components/GroceryList';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <Layout>
          <GroceryList />
        </Layout>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#ffffff',
              color: '#333333',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              padding: '16px',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            }
          }}
        />
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;