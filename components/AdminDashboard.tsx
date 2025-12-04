

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  DollarSign, 
  LogOut, 
  Search,
  Settings,
  Bell,
  Box,
  ChevronRight,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  X,
  Shield,
  Moon,
  Globe,
  Save,
  CheckCircle, 
  AlertTriangle,
  Info,
  Loader2,
  AtSign,
  Edit,
  Trash2,
  Upload,
  Image as ImageIcon,
  MoreVertical,
  Plus,
  MapPin,
  Calendar,
  CreditCard,
  ArrowLeft,
  Send,
  Check,
  Eye,
  FileText,
  Tag,
  Percent
} from 'lucide-react';
import { Product, Order, User } from '../types';
import { CATEGORIES, CATEGORY_BRANDS } from '../constants';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  products: Product[];
  orders: Order[];
  registeredUsers?: User[]; // Accept real users
  onUpdateProducts?: (products: Product[]) => void; // Function to update global state
}

type AdminView = 'dashboard' | 'products' | 'orders' | 'customers';
type CustomerTab = 'overview' | 'orders' | 'edit' | 'email';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout, products, orders, registeredUsers = [], onUpdateProducts }) => {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Local Product State for CRUD operations (Simulation)
  const [localProducts, setLocalProducts] = useState<Product[]>(products);
  
  // Update local state when parent props change (two-way sync)
  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  // Helper to sync changes back to App.tsx
  const syncProducts = (newProducts: Product[]) => {
    setLocalProducts(newProducts);
    if (onUpdateProducts) {
      onUpdateProducts(newProducts);
    }
  };
  
  // Header Actions State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Notifications State
  const [adminNotifications, setAdminNotifications] = useState([
    { id: 1, title: 'Estoque Crítico', message: '5 produtos acabaram de esgotar e precisam de reposição urgente.', type: 'alert', time: '5 min', read: false, details: 'Os itens: iPhone 15, Geladeira Brastemp e +3 itens estão com estoque zerado.' },
    { id: 2, title: 'Novo Pedido #12390', message: 'Venda de R$ 3.450,00 aprovada via Cartão de Crédito.', type: 'success', time: '12 min', read: false, details: 'Cliente: Ana Silva. Itens: Smart TV LG 55". Pagamento confirmado.' },
    { id: 3, title: 'Backup do Sistema', message: 'Backup diário realizado com sucesso no servidor seguro.', type: 'info', time: '1 hora', read: true, details: 'O backup de 1.2GB foi salvo em cloud storage às 03:00 AM.' },
    { id: 4, title: 'Novo Cliente', message: 'Roberto Souza se cadastrou na plataforma.', type: 'info', time: '2 horas', read: true, details: 'Origem: Campanha Google Ads. Localização: Curitiba/PR.' },
  ]);
  const [viewingNotification, setViewingNotification] = useState<any | null>(null);

  // Order Details State
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Edit Product State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [actionMenuOpenId, setActionMenuOpenId] = useState<number | null>(null);

  // Discount Modal State
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discountConfig, setDiscountConfig] = useState({
    percentage: 20,
    category: 'Todos',
    isApplying: false
  });

  // Customer Details State
  // Mock Base Customers
  const initialCustomers = [
    { id: 1, name: 'Ana Silva', email: 'ana.silva@email.com', phone: '(11) 99999-1111', spent: 4500.00, orders: 3, lastOrder: '12/05/2024', status: 'Ativo', address: 'Rua das Flores, 123 - SP' },
    { id: 2, name: 'Carlos Oliveira', email: 'carlos.o@email.com', phone: '(21) 98888-2222', spent: 1250.50, orders: 1, lastOrder: '10/05/2024', status: 'Inativo', address: 'Av. Paulista, 1000 - SP' },
    { id: 3, name: 'Fernanda Santos', email: 'nanda.s@email.com', phone: '(31) 97777-3333', spent: 8900.00, orders: 5, lastOrder: '05/05/2024', status: 'Ativo', address: 'Rua da Bahia, 500 - MG' },
    { id: 4, name: 'Roberto Souza', email: 'roberto.fz@email.com', phone: '(41) 96666-4444', spent: 340.00, orders: 1, lastOrder: '01/05/2024', status: 'Novo', address: 'Rua XV de Novembro, 20 - PR' },
    { id: 5, name: 'Juliana Lima', email: 'ju.lima@email.com', phone: '(51) 95555-5555', spent: 12400.00, orders: 8, lastOrder: '28/04/2024', status: 'VIP', address: 'Av. Ipiranga, 300 - RS' },
  ];

  const [customers, setCustomers] = useState(initialCustomers);

  // Effect to merge real registered users into the customer list
  useEffect(() => {
    if (registeredUsers && registeredUsers.length > 0) {
       const mappedUsers = registeredUsers.map((u, idx) => ({
          id: 100 + idx, // Simple ID generation to avoid clash
          name: u.name,
          email: u.email,
          phone: '(00) 00000-0000', // Mock missing data
          spent: 0,
          orders: 0,
          lastOrder: 'Nunca',
          status: 'Novo',
          address: 'Endereço não informado' // Mock missing data
       }));

       // Merge avoiding duplicates (by email)
       setCustomers(prev => {
          const existingEmails = new Set(prev.map(c => c.email));
          const newUnique = mappedUsers.filter(u => !existingEmails.has(u.email));
          return [...newUnique, ...prev];
       });
    }
  }, [registeredUsers]);

  const [viewingCustomer, setViewingCustomer] = useState<any | null>(null);
  const [customerTab, setCustomerTab] = useState<CustomerTab>('overview');
  const [customerFormData, setCustomerFormData] = useState<any>({});
  
  // Email State
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  
  // Mock Customer Orders (Generated when viewing a customer)
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);

  // Settings State
  const [settings, setSettings] = useState({
    darkMode: false,
    emailAlerts: true,
    reportEmail: 'suporte@magazine.com',
    twoFactor: true,
    language: 'Português (Brasil)'
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Derived Stats
  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const totalStock = localProducts.reduce((acc, p) => acc + p.stock, 0);
  const lowStockProducts = localProducts.filter(p => p.stock < 5 && p.stock > 0);
  const outOfStockProducts = localProducts.filter(p => p.stock === 0);
  const unreadNotificationsCount = adminNotifications.filter(n => !n.read).length;

  // Filtering Logic
  const filteredProducts = localProducts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredOrders = orders.filter(o => o.id.includes(searchTerm));
  const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Handlers
  const toggleSetting = (key: 'darkMode' | 'emailAlerts' | 'twoFactor') => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const cycleLanguage = () => {
    const langs = ['Português (Brasil)', 'English (US)', 'Español'];
    const currentIdx = langs.indexOf(settings.language);
    const nextIdx = (currentIdx + 1) % langs.length;
    setSettings(prev => ({ ...prev, language: langs[nextIdx] }));
  };

  const handleSaveSettings = () => {
    setIsSavingSettings(true);
    setTimeout(() => {
      setIsSavingSettings(false);
      setIsSettingsOpen(false);
    }, 1500);
  };

  const handleMarkAllAsRead = () => {
    setAdminNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (id: number) => {
    const notif = adminNotifications.find(n => n.id === id);
    if (notif) {
      setViewingNotification(notif);
      setAdminNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setIsNotificationsOpen(false);
    }
  };

  // --- PRODUCT ACTIONS HANDLERS ---
  
  const handleNewProduct = () => {
    // Create blank product template
    const newProduct: Product = {
      id: 0, // 0 indicates new product
      title: '',
      price: 0,
      originalPrice: 0,
      image: '',
      gallery: [],
      category: 'Smartphones', // Default
      brand: '',
      rating: 5,
      reviews: 0,
      description: '',
      specifications: {},
      features: [],
      stock: 10
    };
    setEditingProduct(newProduct);
    setIsEditModalOpen(true);
    setActionMenuOpenId(null);
  };
  
  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product }); // Clone object
    setIsEditModalOpen(true);
    setActionMenuOpenId(null);
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      const updated = localProducts.filter(p => p.id !== id);
      syncProducts(updated);
      setActionMenuOpenId(null);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    let updatedList;
    if (editingProduct.id === 0) {
      // Create New
      const newId = Math.max(...localProducts.map(p => p.id), 0) + 1;
      const productToAdd = {
        ...editingProduct,
        id: newId,
        image: editingProduct.image || 'https://images.unsplash.com/photo-1580910051074-3eb6948d3ea0?auto=format&fit=crop&q=80&w=600', // Default placeholder
        title: editingProduct.title || 'Novo Produto Sem Nome',
        features: ['Novo produto adicionado pelo admin'],
        specifications: { "Origem": "Nacional" }
      };
      updatedList = [productToAdd, ...localProducts];
    } else {
      // Update Existing
      updatedList = localProducts.map(p => p.id === editingProduct.id ? editingProduct : p);
    }

    syncProducts(updatedList);
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        if (typeof reader.result === 'string' && editingProduct) {
          setEditingProduct({ ...editingProduct, image: reader.result });
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  // --- DISCOUNT HANDLER ---
  const handleApplyDiscount = () => {
    setDiscountConfig(prev => ({ ...prev, isApplying: true }));
    
    setTimeout(() => {
      const { percentage, category } = discountConfig;
      
      const updatedList = localProducts.map(product => {
        // Filter Check
        if (category !== 'Todos' && product.category !== category) return product;
        
        // Logic: Always base discount on the Original Price to avoid compound discounts shrinking value to zero
        // If originalPrice doesn't exist, set it to current price
        const basePrice = product.originalPrice || product.price;
        const newPrice = Math.round(basePrice * (1 - percentage / 100));
        
        return {
          ...product,
          originalPrice: basePrice,
          price: newPrice
        };
      });

      syncProducts(updatedList);
      setDiscountConfig(prev => ({ ...prev, isApplying: false }));
      setIsDiscountModalOpen(false);
      
      // Add notification about change
      const count = category === 'Todos' ? localProducts.length : localProducts.filter(p => p.category === category).length;
      setAdminNotifications(prev => [
        { 
          id: Date.now(), 
          title: 'Promoção Aplicada', 
          message: `Desconto de ${percentage}% aplicado a ${count} produtos da categoria ${category}.`, 
          type: 'success', 
          time: 'Agora', 
          read: false,
          details: 'Preços atualizados automaticamente.' 
        },
        ...prev
      ]);

    }, 1500);
  };

  // --- CUSTOMER ACTIONS ---
  const handleViewCustomer = (customer: any) => {
    setViewingCustomer(customer);
    setCustomerTab('overview');
    
    // Initialize Edit Form Data
    setCustomerFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      status: customer.status
    });
    
    // Reset Email State
    setEmailSubject('');
    setEmailMessage('');
    setEmailSuccess(false);

    // Generate Mock Orders for this specific customer
    const mockOrders = Array.from({ length: customer.orders || 0 }).map((_, i) => ({
      id: `#${Math.floor(200000 + Math.random() * 800000)}`,
      date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString('pt-BR'),
      status: Math.random() > 0.7 ? 'Entregue' : (Math.random() > 0.4 ? 'Enviado' : 'Processando'),
      total: (Math.random() * 2000 + 100),
      items: Math.floor(Math.random() * 5) + 1
    })).sort((a, b) => b.id.localeCompare(a.id));
    
    setCustomerOrders(mockOrders);
  };

  const handleSaveCustomerChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingCustomer) return;

    // Update main list
    setCustomers(prev => prev.map(c => c.id === viewingCustomer.id ? { ...c, ...customerFormData } : c));
    
    // Update current view
    setViewingCustomer(prev => ({ ...prev, ...customerFormData }));
    
    // Go back to overview
    setCustomerTab('overview');
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingEmail(true);

    // Simulate API Call
    setTimeout(() => {
      setIsSendingEmail(false);
      setEmailSuccess(true);
      
      // Auto close/reset after success
      setTimeout(() => {
        setEmailSuccess(false);
        setCustomerTab('overview');
        setEmailSubject('');
        setEmailMessage('');
      }, 2000);
    }, 1500);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'products':
        return (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors min-h-[500px]">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center flex-wrap gap-4">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">Gerenciar Produtos</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Total de {localProducts.length} itens no catálogo</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsDiscountModalOpen(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition flex items-center gap-2"
                >
                  <Percent size={16} /> Ativar Descontos
                </button>
                <button 
                  onClick={handleNewProduct}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <Plus size={16} /> Novo Produto
                </button>
              </div>
            </div>
            <div className="overflow-visible">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-4">Produto</th>
                    <th className="px-6 py-4">Categoria</th>
                    <th className="px-6 py-4">Preço</th>
                    <th className="px-6 py-4">Estoque</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredProducts.slice(0, 20).map(product => (
                    <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors relative group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt="" className="w-10 h-10 rounded object-contain bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600" />
                          <span className="font-medium text-slate-800 dark:text-slate-200 line-clamp-1 max-w-[200px]">{product.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{product.category}</td>
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs text-slate-400 line-through mr-1">R$ {product.originalPrice.toFixed(0)}</span>
                        )}
                        R$ {product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{product.stock} un</td>
                      <td className="px-6 py-4">
                        {product.stock === 0 ? (
                          <span className="px-2 py-1 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 rounded text-xs font-bold">Esgotado</span>
                        ) : product.stock < 5 ? (
                          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400 rounded text-xs font-bold">Baixo</span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 rounded text-xs font-bold">Normal</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActionMenuOpenId(actionMenuOpenId === product.id ? null : product.id);
                          }}
                          className="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                          {actionMenuOpenId === product.id && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute right-0 mt-1 w-32 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden"
                            >
                              <button 
                                onClick={() => handleEditProduct(product)}
                                className="w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                              >
                                <Edit size={14} /> Editar
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                              >
                                <Trash2 size={14} /> Excluir
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
               <h3 className="font-bold text-slate-800 dark:text-white text-lg">Pedidos Recentes</h3>
               <p className="text-slate-500 dark:text-slate-400 text-sm">Monitoramento de vendas em tempo real</p>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Pagamento</th>
                  <th className="px-6 py-4 text-right">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredOrders.length > 0 ? filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-400">{order.id}</td>
                    <td className="px-6 py-4 text-slate-800 dark:text-slate-200">{order.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                      `}>
                        {order.status === 'processing' ? 'Processando' : order.status === 'shipped' ? 'Enviado' : 'Entregue'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">R$ {order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-xs">
                       {order.paymentMethod === 'credit_card' && 'Cartão de Crédito'}
                       {order.paymentMethod === 'debit_card' && 'Débito'}
                       {order.paymentMethod === 'pix' && 'PIX'}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button 
                         onClick={() => setViewingOrder(order)}
                         className="text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 p-2 rounded-lg transition"
                         title="Ver todos os detalhes"
                       >
                         <FileText size={18} />
                       </button>
                    </td>
                  </tr>
                )) : (
                   <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">Nenhum pedido encontrado.</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        );

      case 'customers':
        return (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
               <h3 className="font-bold text-slate-800 dark:text-white text-lg">Base de Clientes</h3>
               <p className="text-slate-500 dark:text-slate-400 text-sm">Gerenciamento de relacionamento (CRM)</p>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Contato</th>
                  <th className="px-6 py-4">Total Gasto</th>
                  <th className="px-6 py-4">Pedidos</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredCustomers.map(customer => (
                  <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{customer.name}</p>
                          <p className="text-xs text-slate-400">ID: {customer.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 dark:text-slate-400">{customer.email}</p>
                      <p className="text-xs text-slate-400">{customer.phone}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-green-600 dark:text-green-400">R$ {customer.spent.toFixed(2)}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{customer.orders}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold
                        ${customer.status === 'VIP' ? 'bg-purple-100 text-purple-700' : customer.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                      `}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleViewCustomer(customer)}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-bold"
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default: // Dashboard Overview
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Receita Total', value: `R$ ${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'bg-green-500' },
                { label: 'Total de Pedidos', value: orders.length, icon: ShoppingCart, color: 'bg-blue-500' },
                { label: 'Produtos em Estoque', value: totalStock, icon: Package, color: 'bg-purple-500' },
                { label: 'Clientes Ativos', value: customers.length, icon: Users, color: 'bg-orange-500' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 transition-transform hover:scale-105">
                  <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center text-white shadow-lg`}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Dashboard Alerts / Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Stock Alerts */}
               <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                 <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-4 flex items-center gap-2">
                   <AlertTriangle className="text-yellow-500" /> Atenção Necessária
                 </h3>
                 <div className="space-y-3">
                   {outOfStockProducts.length > 0 && (
                     <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg">
                       <p className="font-bold text-red-700 dark:text-red-400 text-sm">Produtos Esgotados ({outOfStockProducts.length})</p>
                       <ul className="mt-2 space-y-1">
                         {outOfStockProducts.slice(0, 3).map(p => (
                           <li 
                             key={p.id} 
                             onClick={() => handleEditProduct(p)}
                             className="text-xs text-red-600 dark:text-red-300 flex justify-between cursor-pointer hover:underline"
                           >
                             <span>{p.title}</span>
                             <span className="font-bold">0 un</span>
                           </li>
                         ))}
                       </ul>
                     </div>
                   )}
                   {lowStockProducts.length > 0 && (
                     <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r-lg">
                       <p className="font-bold text-yellow-700 dark:text-yellow-400 text-sm">Estoque Baixo ({lowStockProducts.length})</p>
                       <ul className="mt-2 space-y-1">
                         {lowStockProducts.slice(0, 3).map(p => (
                           <li 
                             key={p.id} 
                             onClick={() => handleEditProduct(p)}
                             className="text-xs text-yellow-600 dark:text-yellow-300 flex justify-between cursor-pointer hover:underline"
                           >
                             <span>{p.title}</span>
                             <span className="font-bold">{p.stock} un</span>
                           </li>
                         ))}
                       </ul>
                     </div>
                   )}
                   {outOfStockProducts.length === 0 && lowStockProducts.length === 0 && (
                     <div className="text-center py-8 text-slate-400 dark:text-slate-500 flex flex-col items-center">
                       <CheckCircle size={48} className="mb-2 text-green-500" />
                       <p>Tudo certo com o estoque!</p>
                     </div>
                   )}
                 </div>
               </div>

               {/* Quick Actions */}
               <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <TrendingUp /> Ações Rápidas
                  </h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => { setActiveView('products'); handleNewProduct(); }}
                      className="w-full bg-white/10 hover:bg-white/20 p-3 rounded-lg flex items-center gap-3 transition"
                    >
                      <Plus size={20} /> <span className="font-medium">Adicionar Produto</span>
                    </button>
                    <button 
                      onClick={() => setIsDiscountModalOpen(true)}
                      className="w-full bg-white/10 hover:bg-white/20 p-3 rounded-lg flex items-center gap-3 transition"
                    >
                      <Percent size={20} /> <span className="font-medium">Criar Promoção</span>
                    </button>
                    <button 
                      onClick={() => setActiveView('orders')}
                      className="w-full bg-white/10 hover:bg-white/20 p-3 rounded-lg flex items-center gap-3 transition"
                    >
                      <Search size={20} /> <span className="font-medium">Buscar Pedido</span>
                    </button>
                    <button 
                      onClick={() => setActiveView('customers')}
                      className="w-full bg-white/10 hover:bg-white/20 p-3 rounded-lg flex items-center gap-3 transition"
                    >
                      <Mail size={20} /> <span className="font-medium">Enviar Email Mkt</span>
                    </button>
                  </div>
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${settings.darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors flex flex-col md:flex-row">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex-shrink-0 z-20">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <LayoutDashboard size={20} />
            </div>
            <span className="font-bold text-xl text-slate-800 dark:text-white">Admin<span className="text-blue-600">Panel</span></span>
          </div>

          <nav className="p-4 space-y-2">
            {[
              { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
              { id: 'products', label: 'Produtos', icon: Package },
              { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
              { id: 'customers', label: 'Clientes', icon: Users },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as AdminView)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${activeView === item.id 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}
                `}
              >
                <item.icon size={20} />
                {item.label}
                {activeView === item.id && <ChevronRight size={16} className="ml-auto" />}
              </button>
            ))}
          </nav>

          <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-700">
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              <LogOut size={20} />
              Sair do Sistema
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header */}
          <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 z-10 flex-shrink-0">
             <div className="flex items-center gap-4 flex-1">
                <div className="relative w-full max-w-md hidden md:block">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Buscar em todo o sistema..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-lg bg-slate-50 dark:bg-slate-700 border-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800 dark:text-white placeholder-slate-400 transition-all"
                  />
                </div>
             </div>

             <div className="flex items-center gap-4">
                {/* Notifications */}
                <div className="relative">
                   <button 
                     onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                     className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition"
                   >
                     <Bell size={20} />
                     {unreadNotificationsCount > 0 && (
                       <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                     )}
                   </button>

                   <AnimatePresence>
                     {isNotificationsOpen && (
                       <motion.div 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: 10 }}
                         className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden"
                       >
                          <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                             <h4 className="font-bold text-slate-800 dark:text-white text-sm">Notificações</h4>
                             <button onClick={handleMarkAllAsRead} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Marcar lidas</button>
                          </div>
                          <div className="max-h-80 overflow-y-auto">
                            {adminNotifications.map(notif => (
                              <div 
                                key={notif.id} 
                                onClick={() => handleNotificationClick(notif.id)}
                                className={`p-4 border-b border-slate-50 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition
                                  ${!notif.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}
                                `}
                              >
                                 <div className="flex justify-between items-start mb-1">
                                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded uppercase
                                      ${notif.type === 'alert' ? 'bg-red-100 text-red-600' : notif.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}
                                    `}>
                                      {notif.type}
                                    </span>
                                    <span className="text-[10px] text-slate-400">{notif.time}</span>
                                 </div>
                                 <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{notif.title}</p>
                                 <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{notif.message}</p>
                              </div>
                            ))}
                          </div>
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>

                {/* Settings */}
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition"
                >
                  <Settings size={20} />
                </button>

                {/* User Avatar */}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                   <div className="text-right hidden md:block">
                      <p className="text-sm font-bold text-slate-800 dark:text-white leading-none">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Administrador</p>
                   </div>
                   <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden border-2 border-white dark:border-slate-600 shadow-sm">
                      <img src={user.avatar} alt="Admin" className="w-full h-full object-cover" />
                   </div>
                </div>
             </div>
          </header>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-100 dark:bg-slate-900">
             <AnimatePresence mode="wait">
               <motion.div
                 key={activeView}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.2 }}
               >
                 {renderContent()}
               </motion.div>
             </AnimatePresence>
          </div>
        </main>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        
        {/* Discount Activation Modal */}
        {isDiscountModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDiscountModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden">
               <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                  <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
                    <Tag size={20} className="text-indigo-500" /> Ativar Descontos em Massa
                  </h3>
                  <button onClick={() => setIsDiscountModalOpen(false)}><X size={20} className="text-slate-400" /></button>
               </div>
               
               <div className="p-6 space-y-6">
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
                     <p className="text-sm text-indigo-800 dark:text-indigo-200">
                        Isso aplicará o desconto escolhido sobre o <b>preço original</b> de todos os produtos da categoria selecionada.
                     </p>
                  </div>

                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Percentual de Desconto</label>
                     <div className="flex items-center gap-4">
                        <input 
                           type="range" 
                           min="10" 
                           max="60" 
                           step="5" 
                           value={discountConfig.percentage}
                           onChange={(e) => setDiscountConfig({...discountConfig, percentage: parseInt(e.target.value)})}
                           className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <span className="font-bold text-xl text-indigo-600 dark:text-indigo-400 w-16 text-right">{discountConfig.percentage}%</span>
                     </div>
                     <div className="flex justify-between text-xs text-slate-400 mt-1 px-1">
                        <span>10%</span>
                        <span>35%</span>
                        <span>60%</span>
                     </div>
                  </div>

                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Categoria Alvo</label>
                     <select 
                        value={discountConfig.category}
                        onChange={(e) => setDiscountConfig({...discountConfig, category: e.target.value})}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                     >
                        {CATEGORIES.map(c => (
                           <option key={c} value={c}>{c}</option>
                        ))}
                     </select>
                  </div>
               </div>

               <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900">
                  <button onClick={() => setIsDiscountModalOpen(false)} className="px-6 py-2 rounded-lg text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 font-bold transition">Cancelar</button>
                  <button 
                     onClick={handleApplyDiscount}
                     disabled={discountConfig.isApplying}
                     className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-bold shadow-lg transition flex items-center gap-2 disabled:opacity-70"
                  >
                     {discountConfig.isApplying ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                     {discountConfig.isApplying ? 'Aplicando...' : 'Aplicar Desconto'}
                  </button>
               </div>
            </motion.div>
          </div>
        )}

        {/* Order Details Modal */}
        {viewingOrder && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingOrder(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
               {/* Modal Header */}
               <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                       <Package size={24} /> Detalhes do Pedido
                    </h3>
                    <p className="text-slate-400 text-sm">ID: <span className="font-mono text-blue-400">{viewingOrder.id}</span></p>
                  </div>
                  <button onClick={() => setViewingOrder(null)} className="p-1 hover:bg-white/20 rounded-full transition"><X size={24} /></button>
               </div>
               
               {/* Modal Body */}
               <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-900">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     
                     {/* Order Summary */}
                     <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <h4 className="font-bold text-slate-800 dark:text-white mb-3 text-sm uppercase flex items-center gap-2">
                           <Info size={16} className="text-blue-500" /> Resumo
                        </h4>
                        <div className="space-y-2 text-sm">
                           <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                              <span className="text-slate-500">Data do Pedido:</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">{viewingOrder.date}</span>
                           </div>
                           <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                              <span className="text-slate-500">Status Atual:</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${viewingOrder.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                 {viewingOrder.status === 'processing' ? 'Processando' : viewingOrder.status === 'shipped' ? 'Enviado' : 'Entregue'}
                              </span>
                           </div>
                           <div className="flex justify-between pt-2">
                              <span className="text-slate-500">Valor Total:</span>
                              <span className="font-bold text-green-600 text-lg">R$ {viewingOrder.total.toFixed(2)}</span>
                           </div>
                        </div>
                     </div>

                     {/* Payment Details (Sensitive Info) */}
                     <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <h4 className="font-bold text-slate-800 dark:text-white mb-3 text-sm uppercase flex items-center gap-2">
                           <CreditCard size={16} className="text-green-500" /> Dados de Pagamento
                        </h4>
                        <div className="space-y-2 text-sm">
                           <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                              <span className="text-slate-500">Método:</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">{viewingOrder.paymentMethod.replace('_', ' ')}</span>
                           </div>
                           {viewingOrder.paymentDetails && (
                              <>
                                 <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                                    <span className="text-slate-500">Parcelamento:</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{viewingOrder.installments || 'À Vista'}</span>
                                 </div>
                                 {viewingOrder.paymentMethod !== 'pix' && (
                                    <>
                                       <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                                          <span className="text-slate-500">Titular:</span>
                                          <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">{viewingOrder.paymentDetails.cardHolder || 'N/A'}</span>
                                       </div>
                                       <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                                          <span className="text-slate-500">CPF Titular:</span>
                                          <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{viewingOrder.paymentDetails.cardCpf || 'N/A'}</span>
                                       </div>
                                       <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2 bg-red-50 dark:bg-red-900/10 p-1 rounded">
                                          <span className="text-red-500 font-bold text-xs">Cartão (Sensitive):</span>
                                          <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">{viewingOrder.paymentDetails.cardNumber || '**** **** **** ****'}</span>
                                       </div>
                                       <div className="flex justify-between pt-1">
                                          <span className="text-slate-500 text-xs">Validade: {viewingOrder.paymentDetails.expiry}</span>
                                          <span className="text-slate-500 text-xs">CVV: {viewingOrder.paymentDetails.cvv}</span>
                                       </div>
                                    </>
                                 )}
                              </>
                           )}
                        </div>
                     </div>

                  </div>

                  {/* Order Items */}
                  <div className="mt-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                     <h4 className="font-bold text-slate-800 dark:text-white mb-4 text-sm uppercase flex items-center gap-2">
                        <ShoppingCart size={16} className="text-orange-500" /> Itens do Pedido
                     </h4>
                     <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {viewingOrder.items.map((item, idx) => (
                           <div key={idx} className="flex items-center gap-4 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition">
                              <div className="w-12 h-12 bg-white rounded border border-slate-200 p-1 flex-shrink-0">
                                 <img src={item.image} alt="" className="w-full h-full object-contain" />
                              </div>
                              <div className="flex-1">
                                 <p className="font-bold text-sm text-slate-800 dark:text-slate-200 line-clamp-1">{item.title}</p>
                                 <p className="text-xs text-slate-500">Qtd: {item.quantity}</p>
                              </div>
                              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">R$ {item.price.toFixed(2)}</p>
                           </div>
                        ))}
                     </div>
                  </div>

               </div>
               
               {/* Footer */}
               <div className="p-4 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                  <button onClick={() => setViewingOrder(null)} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition">
                     Fechar
                  </button>
               </div>
            </motion.div>
          </div>
        )}

        {/* Settings Modal */}
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSettingsOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
             <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                   <h3 className="font-bold text-lg dark:text-white">Configurações do Sistema</h3>
                   <button onClick={() => setIsSettingsOpen(false)}><X size={20} className="text-slate-400" /></button>
                </div>
                <div className="p-6 space-y-6">
                   {/* Dark Mode */}
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300"><Moon size={20} /></div>
                         <div>
                            <p className="font-bold text-slate-800 dark:text-white text-sm">Modo Escuro</p>
                            <p className="text-xs text-slate-500">Ajustar aparência do painel</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => toggleSetting('darkMode')}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.darkMode ? 'bg-blue-600' : 'bg-slate-200'}`}
                      >
                         <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-sm" />
                      </button>
                   </div>

                   {/* Email Alerts */}
                   <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300"><Mail size={20} /></div>
                           <div>
                              <p className="font-bold text-slate-800 dark:text-white text-sm">Alertas por E-mail</p>
                              <p className="text-xs text-slate-500">Receber relatórios diários</p>
                           </div>
                        </div>
                        <button 
                           onClick={() => toggleSetting('emailAlerts')}
                           className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.emailAlerts ? 'bg-green-500' : 'bg-slate-200'}`}
                        >
                           <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-sm" />
                        </button>
                      </div>
                      
                      {/* Collapsible Email Input */}
                      <AnimatePresence>
                         {settings.emailAlerts && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                               <div className="relative">
                                  <AtSign size={16} className="absolute left-3 top-3 text-slate-400" />
                                  <input 
                                     type="email" 
                                     value={settings.reportEmail}
                                     onChange={(e) => setSettings({ ...settings, reportEmail: e.target.value })}
                                     className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                     placeholder="email@exemplo.com"
                                  />
                               </div>
                            </motion.div>
                         )}
                      </AnimatePresence>
                   </div>

                   {/* Language */}
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300"><Globe size={20} /></div>
                         <div>
                            <p className="font-bold text-slate-800 dark:text-white text-sm">Idioma</p>
                            <p className="text-xs text-slate-500">{settings.language}</p>
                         </div>
                      </div>
                      <button onClick={cycleLanguage} className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline">Alterar</button>
                   </div>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700">
                   <button 
                     onClick={handleSaveSettings}
                     disabled={isSavingSettings}
                     className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                   >
                     {isSavingSettings ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                     {isSavingSettings ? 'Salvando...' : 'Salvar Alterações'}
                   </button>
                </div>
             </motion.div>
          </div>
        )}

        {/* Edit Product Modal */}
        {isEditModalOpen && editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
               <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                  <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
                    {editingProduct.id === 0 ? <Plus size={20} /> : <Edit size={20} />}
                    {editingProduct.id === 0 ? 'Novo Produto' : 'Editar Produto'}
                  </h3>
                  <button onClick={() => setIsEditModalOpen(false)}><X size={20} className="text-slate-400" /></button>
               </div>
               
               <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Image Upload */}
                  <div className="flex flex-col items-center justify-center mb-4">
                     <div className="w-32 h-32 bg-slate-100 dark:bg-slate-700 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden relative group cursor-pointer">
                        {editingProduct.image ? (
                          <img src={editingProduct.image} className="w-full h-full object-contain" />
                        ) : (
                          <ImageIcon className="text-slate-400" size={32} />
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                           <Upload className="text-white" size={24} />
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                        />
                     </div>
                     <p className="text-xs text-slate-500 mt-2">Clique para alterar a imagem</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="col-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Nome do Produto</label>
                        <input 
                          type="text" 
                          value={editingProduct.title}
                          onChange={e => setEditingProduct({...editingProduct, title: e.target.value})}
                          className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg dark:text-white"
                          required
                        />
                     </div>
                     
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Preço (R$)</label>
                        <input 
                          type="number" 
                          value={editingProduct.price}
                          onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                          className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg dark:text-white"
                          required
                        />
                     </div>

                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Estoque (Un)</label>
                        <input 
                          type="number" 
                          value={editingProduct.stock}
                          onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                          className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg dark:text-white"
                          required
                        />
                     </div>

                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Categoria</label>
                        <select 
                           value={editingProduct.category}
                           onChange={e => {
                              // Reset brand when category changes to prevent invalid state
                              setEditingProduct({
                                 ...editingProduct, 
                                 category: e.target.value,
                                 brand: '' // Reset brand
                              });
                           }}
                           className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg dark:text-white"
                        >
                           {CATEGORIES.filter(c => c !== 'Todos').map(c => (
                              <option key={c} value={c}>{c}</option>
                           ))}
                        </select>
                     </div>

                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Marca</label>
                        <select
                           value={editingProduct.brand}
                           onChange={e => setEditingProduct({...editingProduct, brand: e.target.value})}
                           className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg dark:text-white"
                        >
                           <option value="">Selecione...</option>
                           {CATEGORY_BRANDS[editingProduct.category]?.map(brand => (
                              <option key={brand} value={brand}>{brand}</option>
                           ))}
                        </select>
                     </div>
                  </div>
               </form>

               <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900">
                  <button onClick={() => setIsEditModalOpen(false)} className="px-6 py-2 rounded-lg text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 font-bold transition">Cancelar</button>
                  <button onClick={handleSaveProduct} className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-bold shadow-lg transition">Salvar Produto</button>
               </div>
            </motion.div>
          </div>
        )}

        {/* Notification Detail Modal */}
        {viewingNotification && (
           <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingNotification(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm relative z-10 overflow-hidden">
                 <div className={`h-2 w-full ${viewingNotification.type === 'alert' ? 'bg-red-500' : viewingNotification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} />
                 <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                       <div className={`p-3 rounded-full ${viewingNotification.type === 'alert' ? 'bg-red-100 text-red-600' : viewingNotification.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                          {viewingNotification.type === 'alert' ? <AlertTriangle size={24} /> : viewingNotification.type === 'success' ? <CheckCircle size={24} /> : <Info size={24} />}
                       </div>
                       <div>
                          <h3 className="font-bold text-slate-800 dark:text-white">{viewingNotification.title}</h3>
                          <p className="text-xs text-slate-400">{viewingNotification.time}</p>
                       </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 leading-relaxed">{viewingNotification.message}</p>
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-xs text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
                       <span className="font-bold block mb-1">Detalhes Técnicos:</span>
                       {viewingNotification.details}
                    </div>
                 </div>
                 <div className="p-4 bg-slate-50 dark:bg-slate-900 flex justify-end">
                    <button onClick={() => setViewingNotification(null)} className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline">Fechar</button>
                 </div>
              </motion.div>
           </div>
        )}

        {/* Customer Details Modal */}
        {viewingCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingCustomer(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 flex justify-between items-start text-white">
                 <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-full bg-white text-slate-900 flex items-center justify-center font-bold text-2xl shadow-lg border-4 border-slate-700">
                       {viewingCustomer.name.charAt(0)}
                    </div>
                    <div>
                       <h2 className="text-2xl font-bold">{viewingCustomer.name}</h2>
                       <div className="flex items-center gap-3 mt-1 text-slate-300 text-sm">
                          <span className="flex items-center gap-1"><Mail size={14} /> {viewingCustomer.email}</span>
                          <span className="flex items-center gap-1"><MapPin size={14} /> {viewingCustomer.address}</span>
                       </div>
                    </div>
                 </div>
                 <button onClick={() => setViewingCustomer(null)} className="p-1 hover:bg-white/20 rounded-full transition"><X size={24} /></button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                 <button onClick={() => setCustomerTab('overview')} className={`px-6 py-3 text-sm font-bold border-b-2 transition ${customerTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Visão Geral</button>
                 <button onClick={() => setCustomerTab('orders')} className={`px-6 py-3 text-sm font-bold border-b-2 transition ${customerTab === 'orders' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Pedidos</button>
                 <button onClick={() => setCustomerTab('email')} className={`px-6 py-3 text-sm font-bold border-b-2 transition ${customerTab === 'email' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Nova Mensagem</button>
                 <button onClick={() => setCustomerTab('edit')} className={`px-6 py-3 text-sm font-bold border-b-2 transition ${customerTab === 'edit' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Editar Perfil</button>
              </div>

              {/* Content Area */}
              <div className="p-6 overflow-y-auto flex-1 bg-white dark:bg-slate-800">
                 
                 {/* 1. OVERVIEW TAB */}
                 {customerTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       {/* Stats */}
                       <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-900/30">
                             <p className="text-xs text-green-600 dark:text-green-400 uppercase font-bold">Total Gasto</p>
                             <p className="text-2xl font-bold text-green-700 dark:text-green-300">R$ {viewingCustomer.spent.toFixed(2)}</p>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                             <p className="text-xs text-blue-600 dark:text-blue-400 uppercase font-bold">Pedidos Feitos</p>
                             <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{viewingCustomer.orders}</p>
                          </div>
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30">
                             <p className="text-xs text-purple-600 dark:text-purple-400 uppercase font-bold">Ticket Médio</p>
                             <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">R$ {(viewingCustomer.spent / (viewingCustomer.orders || 1)).toFixed(2)}</p>
                          </div>
                          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30">
                             <p className="text-xs text-orange-600 dark:text-orange-400 uppercase font-bold">Última Compra</p>
                             <p className="text-lg font-bold text-orange-700 dark:text-orange-300">{viewingCustomer.lastOrder}</p>
                          </div>
                       </div>
                       
                       {/* Actions Card */}
                       <div className="md:col-span-1 space-y-3">
                          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                             <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-3 text-sm">Ações Rápidas</h4>
                             <button onClick={() => setCustomerTab('email')} className="w-full flex items-center gap-2 p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-400 transition mb-1">
                                <Mail size={16} /> Enviar E-mail
                             </button>
                             <button onClick={() => setCustomerTab('orders')} className="w-full flex items-center gap-2 p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-400 transition mb-1">
                                <Package size={16} /> Ver Histórico
                             </button>
                             <button onClick={() => setCustomerTab('edit')} className="w-full flex items-center gap-2 p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-sm text-blue-600 dark:text-blue-400 transition font-bold">
                                <Edit size={16} /> Editar Dados
                             </button>
                          </div>
                       </div>

                       {/* Recent Activity Mini List */}
                       <div className="md:col-span-2">
                          <h4 className="font-bold text-slate-800 dark:text-white mb-3">Últimas Atividades</h4>
                          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                             {customerOrders.slice(0, 3).map(order => (
                                <div key={order.id} className="p-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center text-sm">
                                   <div>
                                      <span className="font-bold text-slate-700 dark:text-slate-300">Pedido {order.id}</span>
                                      <span className="text-slate-400 text-xs ml-2">{order.date}</span>
                                   </div>
                                   <div className="flex items-center gap-4">
                                      <span className="font-bold text-slate-600 dark:text-slate-400">R$ {order.total.toFixed(2)}</span>
                                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${order.status === 'Entregue' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status}</span>
                                   </div>
                                </div>
                             ))}
                             <button onClick={() => setCustomerTab('orders')} className="w-full p-2 text-center text-xs font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition">
                                Ver todos os pedidos
                             </button>
                          </div>
                       </div>
                    </div>
                 )}

                 {/* 2. ORDERS TAB */}
                 {customerTab === 'orders' && (
                    <div className="space-y-4">
                       <h3 className="font-bold text-slate-800 dark:text-white">Histórico Completo de Pedidos</h3>
                       <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                          <table className="w-full text-sm text-left">
                             <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase text-xs">
                                <tr>
                                   <th className="px-4 py-3">ID</th>
                                   <th className="px-4 py-3">Data</th>
                                   <th className="px-4 py-3">Itens</th>
                                   <th className="px-4 py-3">Total</th>
                                   <th className="px-4 py-3">Status</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {customerOrders.map(order => (
                                   <tr key={order.id} className="hover:bg-white dark:hover:bg-slate-800 transition">
                                      <td className="px-4 py-3 font-mono">{order.id}</td>
                                      <td className="px-4 py-3">{order.date}</td>
                                      <td className="px-4 py-3">{order.items} produtos</td>
                                      <td className="px-4 py-3 font-bold">R$ {order.total.toFixed(2)}</td>
                                      <td className="px-4 py-3">
                                         <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'Entregue' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {order.status}
                                         </span>
                                      </td>
                                   </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </div>
                 )}

                 {/* 3. EDIT PROFILE TAB */}
                 {customerTab === 'edit' && (
                    <form onSubmit={handleSaveCustomerChanges} className="max-w-xl mx-auto space-y-4">
                       <h3 className="font-bold text-slate-800 dark:text-white mb-4">Atualizar Dados Cadastrais</h3>
                       
                       <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Nome Completo</label>
                          <input 
                             type="text" 
                             value={customerFormData.name}
                             onChange={e => setCustomerFormData({...customerFormData, name: e.target.value})}
                             className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg dark:text-white"
                          />
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="text-xs font-bold text-slate-500 uppercase">E-mail</label>
                             <input 
                                type="email" 
                                value={customerFormData.email}
                                onChange={e => setCustomerFormData({...customerFormData, email: e.target.value})}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg dark:text-white"
                             />
                          </div>
                          <div>
                             <label className="text-xs font-bold text-slate-500 uppercase">Telefone</label>
                             <input 
                                type="text" 
                                value={customerFormData.phone}
                                onChange={e => setCustomerFormData({...customerFormData, phone: e.target.value})}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg dark:text-white"
                             />
                          </div>
                       </div>

                       <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Endereço Completo</label>
                          <input 
                             type="text" 
                             value={customerFormData.address}
                             onChange={e => setCustomerFormData({...customerFormData, address: e.target.value})}
                             className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg dark:text-white"
                          />
                       </div>

                       <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Status da Conta</label>
                          <select 
                             value={customerFormData.status}
                             onChange={e => setCustomerFormData({...customerFormData, status: e.target.value})}
                             className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg dark:text-white"
                          >
                             <option value="Ativo">Ativo</option>
                             <option value="Inativo">Inativo</option>
                             <option value="VIP">VIP</option>
                             <option value="Novo">Novo</option>
                          </select>
                       </div>

                       <div className="pt-4 flex gap-3">
                          <button type="button" onClick={() => setCustomerTab('overview')} className="flex-1 py-3 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50">Cancelar</button>
                          <button type="submit" className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg">Salvar Alterações</button>
                       </div>
                    </form>
                 )}

                 {/* 4. EMAIL TAB */}
                 {customerTab === 'email' && (
                    <div className="max-w-xl mx-auto">
                       {emailSuccess ? (
                          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
                             <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Send size={32} />
                             </div>
                             <h3 className="text-xl font-bold text-slate-800 dark:text-white">E-mail Enviado!</h3>
                             <p className="text-slate-500 dark:text-slate-400">Sua mensagem foi entregue para {viewingCustomer.email}.</p>
                          </motion.div>
                       ) : (
                          <form onSubmit={handleSendEmail} className="space-y-4">
                             <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-slate-800 dark:text-white">Nova Mensagem</h3>
                                <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">Para: {viewingCustomer.email}</div>
                             </div>

                             <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Assunto</label>
                                <input 
                                   type="text" 
                                   value={emailSubject}
                                   onChange={e => setEmailSubject(e.target.value)}
                                   placeholder="Ex: Oferta Especial para Você"
                                   required
                                   className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                             </div>

                             <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Mensagem</label>
                                <textarea 
                                   value={emailMessage}
                                   onChange={e => setEmailMessage(e.target.value)}
                                   placeholder="Escreva sua mensagem aqui..."
                                   required
                                   rows={6}
                                   className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                />
                             </div>

                             <div className="pt-2 flex justify-end">
                                <button 
                                  type="submit" 
                                  disabled={isSendingEmail}
                                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg flex items-center gap-2 disabled:opacity-70 transition"
                                >
                                   {isSendingEmail ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                                   {isSendingEmail ? 'Enviando...' : 'Enviar Mensagem'}
                                </button>
                             </div>
                          </form>
                       )}
                    </div>
                 )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
