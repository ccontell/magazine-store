
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User as UserIcon, ShoppingBag, Heart, CircleHelp, LogOut, ChevronRight, ChevronDown, Circle, LogIn } from 'lucide-react';
import { Category, SortOption, User } from '../types';
import { PriceFilter } from './PriceFilter';
import { CATEGORY_BRANDS } from '../constants';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  selectedBrand: string | null;
  onSelectBrand: (brand: string | null) => void;
  // Filter Props
  sortBy: SortOption;
  onSortChange: (option: SortOption) => void;
  onlyDeals: boolean;
  onDealsChange: (checked: boolean) => void;
  // Navigation
  onViewOrders: () => void;
  onViewWishlist: () => void;
  // Auth
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  onClose, 
  categories, 
  selectedCategory,
  onSelectCategory,
  selectedBrand,
  onSelectBrand,
  sortBy,
  onSortChange,
  onlyDeals,
  onDealsChange,
  onViewOrders,
  onViewWishlist,
  user,
  onOpenAuth,
  onLogout
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />
          
          {/* Sidebar */}
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm bg-white shadow-2xl h-[100dvh] flex flex-col"
          >
            {/* Header (Fixed) */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-6 text-white flex-shrink-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 border-2 border-yellow-400 overflow-hidden flex-shrink-0">
                    {user ? (
                      user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <span className="font-bold text-lg">{user.name.charAt(0)}</span>
                    ) : (
                      <UserIcon size={24} />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    {user ? (
                      <>
                        <h3 className="font-bold text-lg leading-tight truncate">{user.name}</h3>
                        <p className="text-blue-100 text-xs truncate">{user.email}</p>
                      </>
                    ) : (
                      <div onClick={() => { onOpenAuth(); onClose(); }} className="cursor-pointer">
                        <h3 className="font-bold text-lg leading-tight">Olá, Cliente!</h3>
                        <p className="text-blue-100 text-xs underline">Entre ou cadastre-se</p>
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-blue-500 rounded transition flex-shrink-0">
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-4 space-y-6">
                
                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => {
                      onViewOrders();
                      onClose();
                    }}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50 text-blue-800 hover:bg-blue-100 transition"
                  >
                    <ShoppingBag size={20} className="mb-1" />
                    <span className="text-xs font-bold">Pedidos</span>
                  </button>
                  <button 
                    onClick={() => {
                      onViewWishlist();
                      onClose();
                    }}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-pink-50 text-pink-700 hover:bg-pink-100 transition"
                  >
                    <Heart size={20} className="mb-1" />
                    <span className="text-xs font-bold">Favoritos</span>
                  </button>
                </div>

                <hr className="border-gray-100" />

                {/* Price Filter (Visible in Menu) */}
                <div>
                   <PriceFilter 
                      sortBy={sortBy}
                      onSortChange={onSortChange}
                      onlyDeals={onlyDeals}
                      onDealsChange={onDealsChange}
                   />
                </div>

                <hr className="border-gray-100" />

                {/* Categories */}
                <div className="pb-4">
                  <h4 className="text-gray-900 font-bold mb-3 text-sm uppercase tracking-wide">Produtos</h4>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <div key={cat} className="flex flex-col">
                        <button
                          onClick={() => {
                             onSelectCategory(cat);
                             onSelectBrand(null);
                             onClose();
                          }}
                          className={`
                            w-full flex items-center justify-between p-2.5 rounded-lg transition text-sm font-medium
                            ${selectedCategory === cat 
                              ? 'bg-blue-600 text-white shadow-md' 
                              : 'text-gray-600 hover:bg-gray-100'}
                          `}
                        >
                          <span>{cat}</span>
                          {selectedCategory === cat ? <ChevronDown size={14} /> : <ChevronRight size={14} className="opacity-30" />}
                        </button>

                        {/* Mobile Brand Sub-menu */}
                        <AnimatePresence>
                          {selectedCategory === cat && CATEGORY_BRANDS[cat] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-gray-50 ml-2 border-l-2 border-gray-100 pl-4 mt-1"
                            >
                               <button
                                 onClick={() => { onSelectBrand(null); onClose(); }}
                                 className={`w-full text-left text-xs py-2 px-1 rounded flex items-center gap-2 ${!selectedBrand ? 'font-bold text-blue-600' : 'text-gray-500'}`}
                               >
                                 {!selectedBrand && <Circle size={6} fill="currentColor"/>}
                                 Todas
                               </button>
                               {CATEGORY_BRANDS[cat].map(brand => (
                                 <button
                                   key={brand}
                                   onClick={() => { onSelectBrand(brand); onClose(); }}
                                   className={`w-full text-left text-xs py-2 px-1 rounded flex items-center gap-2 ${selectedBrand === brand ? 'font-bold text-blue-600' : 'text-gray-500'}`}
                                 >
                                   {selectedBrand === brand && <Circle size={6} fill="currentColor"/>}
                                   {brand}
                                 </button>
                               ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Support Footer (Fixed) */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-2 flex-shrink-0">
               {user ? (
                 <button 
                  onClick={() => { onLogout(); onClose(); }}
                  className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-lg transition"
                 >
                   <LogOut size={18} />
                   <span className="text-sm font-medium">Sair da conta</span>
                 </button>
               ) : (
                 <button 
                  onClick={() => { onOpenAuth(); onClose(); }}
                  className="w-full flex items-center gap-3 p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                 >
                   <LogIn size={18} />
                   <span className="text-sm font-medium">Entrar / Cadastrar</span>
                 </button>
               )}
               <button className="w-full flex items-center gap-3 p-3 text-gray-600 hover:text-blue-600 transition">
                 <CircleHelp size={18} />
                 <span className="text-sm font-medium">Central de Ajuda</span>
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
