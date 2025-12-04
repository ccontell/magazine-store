import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onViewDetails, 
  onAddToCart, 
  isWishlisted, 
  onToggleWishlist 
}) => {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const isOutOfStock = product.stock === 0;

  return (
    <motion.div 
      layout
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
      }}
      whileHover={!isOutOfStock ? { y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" } : {}}
      className={`group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full relative cursor-pointer ${isOutOfStock ? 'opacity-70 grayscale-[0.5]' : ''}`}
      onClick={() => onViewDetails(product)}
    >
      {/* Discount Badge */}
      {discount > 0 && !isOutOfStock && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded z-10">
          {discount}% OFF
        </div>
      )}

      {/* Out of Stock Badge */}
      {isOutOfStock && (
        <div className="absolute top-2 left-2 bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded z-10">
          ESGOTADO
        </div>
      )}
      
      {/* Wishlist Button */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`absolute top-2 right-2 p-2 rounded-full transition z-20 shadow-sm
          ${isWishlisted ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white'}
        `}
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(product);
        }}
      >
        <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
      </motion.button>

      {/* Image Area */}
      <div 
        className="h-48 sm:h-56 p-4 flex items-center justify-center bg-white group-hover:opacity-95 transition"
      >
        <motion.img 
          initial={{ scale: 1 }}
          whileHover={!isOutOfStock ? { scale: 1.1 } : {}}
          transition={{ duration: 0.3 }}
          src={product.image} 
          alt={product.title} 
          className="max-h-full max-w-full object-contain" 
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="text-gray-700 font-medium text-sm leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition">
            {product.title}
          </h3>
          
          <div className="flex items-center gap-1 mb-2">
             <div className="flex text-yellow-400 text-xs">
               {'★'.repeat(Math.floor(product.rating))}
               {'★'.repeat(5 - Math.floor(product.rating)).split('').map((_, i) => <span key={i} className="text-gray-200">★</span>)}
             </div>
             <span className="text-xs text-gray-400">({product.reviews})</span>
          </div>
          
          <div className="mt-auto">
             {product.originalPrice && (
               <p className="text-xs text-gray-400 line-through">R$ {product.originalPrice.toFixed(2).replace('.', ',')}</p>
             )}
             <div className="flex items-baseline gap-1">
               <span className="text-xs font-medium text-gray-600">R$</span>
               <span className="text-xl sm:text-2xl font-bold text-gray-900">{product.price.toFixed(2).split('.')[0]}</span>
               <span className="text-xs font-bold text-gray-900">,{product.price.toFixed(2).split('.')[1]}</span>
             </div>
             <p className="text-[10px] text-green-600 font-medium">à vista no Pix</p>
          </div>
        </div>

        {/* Add to Cart Button (Mobile/Desktop variation) */}
        <motion.button 
          whileHover={!isOutOfStock ? { scale: 1.03 } : {}}
          whileTap={!isOutOfStock ? { scale: 0.95 } : {}}
          disabled={isOutOfStock}
          onClick={(e) => {
            e.stopPropagation();
            if (!isOutOfStock) onAddToCart(product);
          }}
          className={`mt-3 w-full font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition
            ${isOutOfStock 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'}
          `}
        >
          {isOutOfStock ? (
             <span className="text-sm">Indisponível</span>
          ) : (
            <>
              <ShoppingCart size={16} />
              <span className="text-sm">Adicionar</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};