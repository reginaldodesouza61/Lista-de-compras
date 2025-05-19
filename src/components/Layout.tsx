import React, { ReactNode, useState } from 'react';
import { Menu, X, ShoppingCart, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, signIn, signOut } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-green-500" />
              <h1 className="ml-2 text-2xl font-semibold text-gray-800">Lista de Compras</h1>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <button 
                  onClick={signOut} 
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </button>
              ) : (
                <button 
                  onClick={signIn} 
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-md transition-colors"
                >
                  Conectar com Google
                </button>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                aria-expanded="false"
              >
                <span className="sr-only">Abrir menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu, show/hide based on menu state */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {isAuthenticated ? (
                  <button 
                    onClick={signOut} 
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <div className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </div>
                  </button>
                ) : (
                  <button 
                    onClick={signIn} 
                    className="block w-full text-left px-3 py-2 text-base font-medium text-white bg-green-500 hover:bg-green-600 rounded-md transition-colors"
                  >
                    Conectar com Google
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      
<footer className="bg-white">
  <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
    <p className="text-center text-sm text-gray-500">
      &copy; {new Date().getFullYear()} Lista de Compras. Todos os direitos reservados.<br />
      <span className="text-gray-400">Desenvolvido por Reginaldo de Souza</span>
    </p>
  </div>
</footer>
    </div>
  );
};

export default Layout;