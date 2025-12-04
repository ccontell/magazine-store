
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

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

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[60] w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-5 flex justify-between items-center text-white shadow-md flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                   <ShoppingCart size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold leading-none">Meu Carrinho</h2>
                  <span className="text-blue-100 text-xs font-medium opacity-90">
                    {cart.reduce((acc, item) => acc + item.quantity, 0)} itens adicionados
                  </span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-white/20 rounded-full transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                     <ShoppingCart size={32} className="opacity-40" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-600">Seu carrinho está vazio</h3>
                  <p className="text-sm max-w-xs mt-2 mb-6 text-gray-500">Navegue pelas ofertas e adicione produtos incríveis aqui!</p>
                  <button 
                    onClick={onClose}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/30"
                  >
                    Começar a Comprar
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {cart.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-3 relative overflow-hidden group"
                    >
                      {/* Product Image Preview */}
                      <div className="w-16 h-16 bg-white rounded-lg flex-shrink-0 border border-gray-100 p-1 flex items-center justify-center">
                        <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between min-h-[4rem]">
                        <div className="pr-8">
                          <h3 className="font-bold text-gray-800 text-sm line-clamp-2 leading-snug">{item.title}</h3>
                          <p className="text-[10px] text-gray-400 uppercase font-bold mt-0.5">{item.brand}</p>
                        </div>
                        
                        <div className="flex justify-between items-end mt-2">
                          {/* Compact Quantity Selector */}
                          <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 h-8">
                            <button 
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-full flex items-center justify-center hover:bg-gray-200 text-gray-500 hover:text-blue-600 disabled:opacity-30 transition rounded-l-lg"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-gray-800">{item.quantity}</span>
                            <button 
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              disabled={item.quantity >= item.stock}
                              className="w-8 h-full flex items-center justify-center hover:bg-gray-200 text-gray-500 hover:text-blue-600 disabled:opacity-30 transition rounded-r-lg"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                             {item.quantity > 1 && <p className="text-[10px] text-gray-400">R$ {item.price.toFixed(2)} un.</p>}
                             <p className="font-bold text-blue-700 text-sm">R$ {(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button (Highlighted) */}
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="absolute top-2 right-2 text-gray-300 hover:text-red-500 hover:bg-red-50 transition p-1.5 rounded-lg"
                        title="Remover item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer / Checkout */}
            {cart.length > 0 && (
              <div className="p-5 bg-white border-t border-gray-100 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.05)] z-20">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 font-medium text-sm">Total do Pedido</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900 block leading-none">R$ {total.toFixed(2)}</span>
                    <p className="text-[10px] text-green-600 font-bold mt-1">ou 10x de R$ {(total/10).toFixed(2)} sem juros</p>
                  </div>
                </div>
                
                <button
                  onClick={onCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 group transition transform active:scale-[0.98]"
                >
                  Finalizar Compra
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
