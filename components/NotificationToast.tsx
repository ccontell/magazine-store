
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Info, Tag, AlertTriangle } from 'lucide-react';
import { Notification } from '../types';

interface NotificationToastProps {
  notifications: Notification[];
  removeNotification: (id: string) => void;
  onNotificationClick?: (productId: number) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notifications, removeNotification, onNotificationClick }) => {
  return (
    <div className="fixed top-20 right-4 z-[60] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            layout
            onClick={() => {
               if (notif.productId && onNotificationClick) {
                  onNotificationClick(notif.productId);
                  removeNotification(notif.id);
               }
            }}
            className={`pointer-events-auto w-80 md:w-96 bg-white rounded-lg shadow-2xl overflow-hidden border-l-4 border-l-blue-500 relative flex ${notif.productId ? 'cursor-pointer hover:bg-gray-50 transition' : ''}`}
          >
            {/* Type Indicator Color Override */}
            <div 
              className={`absolute left-0 top-0 bottom-0 w-1 
              ${notif.type === 'promotion' ? 'bg-red-500' : 
                notif.type === 'success' ? 'bg-green-500' : 
                notif.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`} 
            />

            <div className="p-4 flex gap-3 w-full items-start">
              {/* Icon */}
              <div className="mt-1">
                {notif.type === 'promotion' && <div className="p-2 bg-red-100 text-red-600 rounded-full"><Tag size={18} /></div>}
                {notif.type === 'success' && <div className="p-2 bg-green-100 text-green-600 rounded-full"><CheckCircle size={18} /></div>}
                {notif.type === 'info' && <div className="p-2 bg-blue-100 text-blue-600 rounded-full"><Info size={18} /></div>}
                {notif.type === 'warning' && <div className="p-2 bg-yellow-100 text-yellow-600 rounded-full"><AlertTriangle size={18} /></div>}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 text-sm">{notif.title}</h4>
                <p className="text-gray-600 text-xs mt-1 leading-relaxed">{notif.message}</p>
                {notif.image && (
                   <img src={notif.image} alt="Product" className="mt-2 w-12 h-12 rounded object-cover border border-gray-100" />
                )}
                {notif.productId && (
                   <p className="text-[10px] text-blue-600 font-bold mt-2 flex items-center gap-1">Clique para ver oferta &rarr;</p>
                )}
              </div>

              {/* Close Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notif.id);
                }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
