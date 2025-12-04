import React, { useState } from 'react';
import { Search, ShoppingCart, User as UserIcon, Menu, Heart, LogOut, ChevronDown } from 'lucide-react';
import { CartItem, User } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  cart: CartItem[];
  wishlistCount: number;
  onOpenCart: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onOpenMenu: () => void;
  onViewWishlist: () => void;
  onGoHome: () => void;
  // Auth Props
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  cart, 
  wishlistCount, 
  onOpenCart, 
  searchTerm, 
  setSearchTerm, 
  onOpenMenu,
  onViewWishlist,
  onGoHome,
  user,
  onOpenAuth,
  onLogout
}) => {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* Top Bar - Promotion */}
      <div className="bg-yellow-400 text-blue-900 text-xs font-bold text-center py-1 px-4 hidden sm:block overflow-hidden">
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: '-100%' }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="whitespace-nowrap inline-block"
        >
          CADASTRE-SE AGORA E TENHA FRETE GRÁTIS NA PRIMEIRA COMPRA! 🚛💨 &nbsp;&nbsp;&nbsp;&nbsp; • &nbsp;&nbsp;&nbsp;&nbsp; OFERTAS IMPERDÍVEIS SÓ HOJE &nbsp;&nbsp;&nbsp;&nbsp; • &nbsp;&nbsp;&nbsp;&nbsp; PARCELE EM ATÉ 24X NO CARTÃO DE CRÉDITO
        </motion.div>
      </div>

      {/* Main Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">
          
          {/* Logo & Menu */}
          <div className="flex items-center gap-4">
            <button 
              onClick={onOpenMenu}
              className="p-1 text-white hover:bg-blue-500 rounded transition mr-1"
              aria-label="Abrir menu"
            >
              <Menu size={28} />
            </button>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex flex-col leading-none cursor-pointer"
              onClick={onGoHome}
            >
              <span className="font-extrabold text-2xl tracking-tighter">Maga<span className="text-yellow-400">Zine</span></span>
              <span className="text-[10px] tracking-widest opacity-80 font-semibold uppercase">Store</span>
            </motion.div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl relative mx-4">
            <input
              type="text"
              placeholder="O que você procura hoje?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-4 pr-12 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner transition-all"
            />
            <button className="absolute right-0 top-0 h-10 w-12 flex items-center justify-center text-blue-600 hover:text-blue-800 transition">
              <Search size={20} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* User Account / Login */}
            <div className="hidden sm:block relative">
              {user ? (
                <div 
                  className="flex items-center gap-2 cursor-pointer group"
                  onMouseEnter={() => setIsUserMenuOpen(true)}
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center text-blue-800 font-bold overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  <div className="flex flex-col text-xs">
                    <span className="font-medium text-blue-100">Olá, {user.name.split(' ')[0]}</span>
                    <span className="font-bold flex items-center gap-1">Minha Conta <ChevronDown size={10} /></span>
                  </div>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 text-gray-800 z-50 border border-gray-100"
                      >
                         <div className="px-4 py-2 border-b border-gray-100">
                           <p className="font-bold text-sm truncate">{user.name}</p>
                           <p className="text-xs text-gray-500 truncate">{user.email}</p>
                         </div>
                         <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                           <LogOut size={16} /> Sair
                         </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition group"
                  onClick={onOpenAuth}
                >
                  <motion.div whileHover={{ rotate: 10 }}>
                    <UserIcon size={24} />
                  </motion.div>
                  <div className="flex flex-col text-xs">
                    <span>Bem-vindo :)</span>
                    <span className="font-bold group-hover:underline">Entre ou cadastre-se</span>
                  </div>
                </div>
              )}
            </div>

            <motion.button 
              whileHover={{ scale: 1.1 }}
              onClick={onViewWishlist}
              className="hidden sm:block relative transition p-2"
            >
               <Heart size={24} />
               <AnimatePresence>
                {wishlistCount > 0 && (
                  <motion.span 
                    key={wishlistCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-0 right-0 bg-white text-blue-600 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenCart}
              className="relative flex items-center justify-center p-2 hover:bg-blue-500 rounded-lg transition"
            >
              <ShoppingCart size={24} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span 
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-yellow-400 text-blue-900 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-blue-600"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Search Bar (visible only on small screens) */}
        <div className="md:hidden px-4 mt-3">
           <div className="relative">
            <input
              type="text"
              placeholder="Busque por produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-4 pr-12 rounded-lg text-gray-800 text-sm focus:outline-none shadow-inner"
            />
            <Search size={18} className="absolute right-3 top-2.5 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
};