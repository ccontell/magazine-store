import React from 'react';
import { Filter, Zap, ArrowDown01, ArrowUp10, Trophy } from 'lucide-react';
import { SortOption } from '../types';

interface PriceFilterProps {
  sortBy: SortOption;
  onSortChange: (option: SortOption) => void;
  onlyDeals: boolean;
  onDealsChange: (checked: boolean) => void;
  className?: string;
}

export const PriceFilter: React.FC<PriceFilterProps> = ({
  sortBy,
  onSortChange,
  onlyDeals,
  onDealsChange,
  className = ""
}) => {
  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide flex items-center gap-2">
          <Filter size={16} className="text-blue-600" />
          Filtros
        </h3>
      </div>

      {/* 1. Sorting */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-500 uppercase">Ordenar Por</h4>
        <div className="grid grid-cols-1 gap-2">
          <button 
            onClick={() => onSortChange('rating')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-all ${sortBy === 'rating' ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'}`}
          >
            <Trophy size={16} /> Melhores Avaliados
          </button>
          <button 
            onClick={() => onSortChange('lowest')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-all ${sortBy === 'lowest' ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'}`}
          >
            <ArrowDown01 size={16} /> Menor Preço
          </button>
          <button 
            onClick={() => onSortChange('highest')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-all ${sortBy === 'highest' ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'}`}
          >
            <ArrowUp10 size={16} /> Maior Preço
          </button>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* 2. Deals Only */}
      <div className="space-y-3">
        <label className="flex items-center justify-between cursor-pointer group">
           <div className="flex items-center gap-2">
              <div className="p-1.5 bg-red-100 text-red-600 rounded-md">
                 <Zap size={16} fill="currentColor" />
              </div>
              <span className="text-sm font-bold text-gray-700 group-hover:text-red-600 transition">Apenas Ofertas</span>
           </div>
           <div className="relative">
             <input 
               type="checkbox" 
               checked={onlyDeals}
               onChange={(e) => onDealsChange(e.target.checked)}
               className="sr-only peer" 
             />
             <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
           </div>
        </label>
      </div>

    </div>
  );
};