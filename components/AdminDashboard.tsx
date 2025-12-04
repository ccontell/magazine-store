
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
  Percent,
  Store, // Add Store icon
  Truck,
  Printer,
  Grid,
  Layers,
  Type
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
  onGoToShop: () => void; // Function to go back to shop
  siteTitle?: string;
  promoMessage?: string;
  onUpdateSiteConfig?: (title: string, message: string) => void;
}

type AdminView = 'dashboard' | 'products' | 'orders' | 'customers' | 'config';
type CustomerTab = 'overview' | 'orders' | 'edit' | 'email';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout, products, orders, registeredUsers = [], onUpdateProducts, onGoToShop, siteTitle = 'MagaZine Store', promoMessage = '', onUpdateSiteConfig }) => {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Local Product State for CRUD operations (Simulation)
  const [localProducts, setLocalProducts] = useState<Product[]>(products);
  
  // Config State
  const [configTitle, setConfigTitle] = useState(siteTitle);
  const [configMessage, setConfigMessage] = useState(promoMessage);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [configSuccess, setConfigSuccess] = useState(false);

  // Update local state when parent props change (two-way sync)
  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  useEffect(() => {
     setConfigTitle(siteTitle);
     setConfigMessage(promoMessage);
  }, [siteTitle, promoMessage]);

  // Helper to sync changes back to App.tsx
  const syncProducts = (newProducts: Product[]) => {
    setLocalProducts(newProducts);
    if (onUpdateProducts) {
      onUpdateProducts(newProducts);
    }
  };
  
  // Header Actions State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // Used for generic settings modal, redirected to config tab

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
    percentage: 10,
    targetType: 'category', // 'category' | 'brand' | 'product'
    targetValue: 'Todos', // Stores Category Name, Brand Name, or Product ID
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
       const mappedUsers = registeredUsers.map((u, idx) => {
          // Type casting to access extended properties that might exist from AuthModal
          const extendedUser = u as any;
          return {
            id: 100 + idx, // Simple ID generation to avoid clash
            name: u.name,
            email: u.email,
            phone: extendedUser.phone || '(11) 90000-0000', 
            spent: 0,
            orders: 0,
            lastOrder: 'Nunca',
            status: extendedUser.status || 'Novo',
            address: extendedUser.address || 'Endereço não informado' 
          };
       });

       // Merge avoiding duplicates (by email)
       setCustomers(prev => {
          const existingEmails = new Set(prev.map(c => c.email));
          const newUnique = mappedUsers.filter(u => !existingEmails.has(u.email));
          // Prepend new users so they appear first
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
  
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateSiteConfig) {
      setIsSavingConfig(true);
      // Simulate save delay
      setTimeout(() => {
        onUpdateSiteConfig(configTitle, configMessage);
        setIsSavingConfig(false);
        setConfigSuccess(true);
        setTimeout(() => setConfigSuccess(false), 3000);
      }, 1000);
    }
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

    // Ensure numeric values are numbers
    const processedProduct = {
      ...editingProduct,
      price: Number(editingProduct.price),
      originalPrice: editingProduct.originalPrice ? Number(editingProduct.originalPrice) : undefined,
      stock: Number(editingProduct.stock),
      reviews: Number(editingProduct.reviews),
      rating: Number(editingProduct.rating)
    };

    let updatedList;
    if (editingProduct.id === 0) {
      // Create New
      const newId = Math.max(...localProducts.map(p => p.id), 0) + 1;
      const productToAdd = {
        ...processedProduct,
        id: newId,
        image: editingProduct.image || 'https://images.unsplash.com/photo-1580910051074-3eb6948d3ea0?auto=format&fit=crop&q=80&w=600', // Default placeholder
        title: editingProduct.title || 'Novo Produto Sem Nome',
        features: editingProduct.features.length ? editingProduct.features : ['Novo produto adicionado pelo admin'],
        specifications: Object.keys(editingProduct.specifications).length ? editingProduct.specifications : { "Origem": "Nacional" }
      };
      updatedList = [productToAdd, ...localProducts];
    } else {
      // Update Existing
      updatedList = localProducts.map(p => p.id === editingProduct.id ? processedProduct : p);
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
      const { percentage, targetType, targetValue } = discountConfig;
      
      const updatedList = localProducts.map(product => {
        let shouldApply = false;

        // Determine if product matches criteria
        if (targetType === 'category') {
          if (targetValue === 'Todos' || product.category === targetValue) shouldApply = true;
        } else if (targetType === 'brand') {
           if (product.brand === targetValue) shouldApply = true;
        } else if (targetType === 'product') {
           if (product.id.toString() === targetValue) shouldApply = true;
        }

        if (!shouldApply) return product;
        
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
      let affectedLabel = '';
      if (targetType === 'category') affectedLabel = `Categoria ${targetValue}`;
      else if (targetType === 'brand') affectedLabel = `Marca ${targetValue}`;
      else affectedLabel = 'Produto Individual';

      setAdminNotifications(prev => [
        { 
          id: Date.now(), 
          title: 'Promoção Aplicada', 
          message: `Desconto de ${percentage}% aplicado a: ${affectedLabel}.`, 
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
      case 'config':
        return (
          <div className="max-w-4xl mx-auto space-y-8">
             <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex justify-between items-center">
                <div>
                   <h3 className="font-bold text-slate-800 dark:text-white text-lg">Configurações da Loja</h3>
                   <p className="text-slate-500 dark:text-slate-400 text-sm">Personalize a aparência e mensagens do seu e-commerce.</p>
                </div>
                <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500">
                   <Settings size={24} />
                </div>
             </div>

             <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <form onSubmit={handleSaveConfig} className="p-6 space-y-6">
                   {configSuccess && (
                      <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg flex items-center gap-2 animate-pulse">
                         <CheckCircle size={20} />
                         <span className="font-bold">Alterações salvas com sucesso!</span>
                      </div>
                   )}

                   <div className="space-y-4">
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                         <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase mb-2 flex items-center gap-2">
                            <Type size={16} className="text-blue-500" /> Título da Página (Aba do Navegador)
                         </label>
                         <input 
                            type="text" 
                            required
                            value={configTitle}
                            onChange={(e) => setConfigTitle(e.target.value)}
                            className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Ex: MagaZine Store - Ofertas Todo Dia"
                         />
                         <p className="text-xs text-slate-500 mt-1">Este é o texto que aparece na aba do navegador ou nos favoritos.</p>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                         <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase mb-2 flex items-center gap-2">
                            <MegaphoneIcon /> Faixa Promocional (Topo do Site)
                         </label>
                         <textarea 
                            rows={3}
                            required
                            value={configMessage}
                            onChange={(e) => setConfigMessage(e.target.value)}
                            className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            placeholder="Ex: FRETE GRÁTIS PARA TODO O BRASIL..."
                         />
                         <p className="text-xs text-slate-500 mt-1">Texto rotativo que aparece na faixa amarela no topo do cabeçalho.</p>
                      </div>
                   </div>

                   <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
                      <button 
                         type="submit" 
                         disabled={isSavingConfig}
                         className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 disabled:opacity-70 transition shadow-lg shadow-blue-500/30"
                      >
                         {isSavingConfig ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                         {isSavingConfig ? 'Salvando...' : 'Salvar Configurações'}
                      </button>
                   </div>
                </form>
             </div>
          </div>
        );

      case 'products':
        // Group filtered products by category for visualization
        const groupedProducts = filteredProducts.reduce((acc, product) => {
           const cat = product.category;
           if (!acc[cat]) acc[cat] = [];
           acc[cat].push(product);
           return acc;
        }, {} as Record<string, Product[]>);

        return (
          <div className="space-y-8 pb-10">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex justify-between items-center flex-wrap gap-4">
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

            {Object.keys(groupedProducts).length === 0 ? (
               <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-xl">
                 <Package size={48} className="mx-auto text-slate-300 mb-2"/>
                 <p className="text-slate-500">Nenhum produto encontrado com estes filtros.</p>
               </div>
            ) : (
               Object.entries(groupedProducts).map(([category, items]) => (
                  <div key={category} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                     <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
                        <Grid size={18} className="text-blue-500"/>
                        <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide text-sm">{category}</h4>
                        <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">{items.length}</span>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-white dark:bg-slate-800 text-slate-400 uppercase text-xs font-semibold border-b border-slate-100 dark:border-slate-700">
                            <tr>
                              <th className="px-6 py-3">Produto</th>
                              <th className="px-6 py-3">Marca</th>
                              <th className="px-6 py-3">Preço</th>
                              <th className="px-6 py-3">Estoque</th>
                              <th className="px-6 py-3 text-right">Ações</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {items.map(product => (
                              <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors relative group">
                                <td className="px-6 py-3">
                                  <div className="flex items-center gap-3">
                                    <img src={product.image} alt="" className="w-9 h-9 rounded object-contain bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600" />
                                    <span className="font-medium text-slate-800 dark:text-slate-200 line-clamp-1 max-w-[220px]">{product.title}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-3 text-slate-600 dark:text-slate-400">{product.brand}</td>
                                <td className="px-6 py-3 font-bold text-slate-800 dark:text-slate-200">
                                  {product.originalPrice && product.originalPrice > product.price && (
                                    <span className="text-xs text-slate-400 line-through mr-1">R$ {product.originalPrice.toFixed(0)}</span>
                                  )}
                                  R$ {product.price.toFixed(2)}
                                </td>
                                <td className="px-6 py-3">
                                  {product.stock === 0 ? (
                                    <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 rounded text-[10px] font-bold">Esgotado</span>
                                  ) : product.stock < 5 ? (
                                    <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400 rounded text-[10px] font-bold">Baixo ({product.stock})</span>
                                  ) : (
                                    <span className="text-slate-600 dark:text-slate-400">{product.stock} un</span>
                                  )}
                                </td>
                                <td className="px-6 py-3 text-right relative">
                                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button onClick={() => handleEditProduct(product)} className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"><Edit size={16}/></button>
                                     <button onClick={() => handleDeleteProduct(product.id)} className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"><Trash2 size={16}/></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                     </div>
                  </div>
               ))
            )}
          </div>
        );

      case 'orders':
        if (viewingOrder) {
          return (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors min-h-[500px] flex flex-col">
              {/* Header Details */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center gap-4">
                  <button onClick={() => setViewingOrder(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition text-slate-500">
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                     <h3 className="font-bold text-slate-800 dark:text-white text-lg leading-tight flex items-center gap-2">
                       Pedido {viewingOrder.id}
                       <span className={`text-xs px-2 py-0.5 rounded uppercase ${viewingOrder.status === 'delivered' ? 'bg-green-100 text-green-700' : viewingOrder.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                         {viewingOrder.status === 'processing' ? 'Processando' : viewingOrder.status === 'shipped' ? 'Enviado' : 'Entregue'}
                       </span>
                     </h3>
                     <p className="text-slate-500 dark:text-slate-400 text-sm">Realizado em {viewingOrder.date}</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                  <Printer size={16} /> Imprimir
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                {/* Status Progress */}
                <div className="mb-8">
                  <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-700 -z-10"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-green-500 -z-10 transition-all duration-500" style={{ width: viewingOrder.status === 'processing' ? '0%' : viewingOrder.status === 'shipped' ? '50%' : '100%' }}></div>
                    
                    <div className="flex flex-col items-center gap-2">
                       <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-800">
                          <Package size={20} />
                       </div>
                       <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Processando</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-800 ${viewingOrder.status === 'shipped' || viewingOrder.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                          <Truck size={20} />
                       </div>
                       <span className={`text-xs font-bold ${viewingOrder.status === 'shipped' || viewingOrder.status === 'delivered' ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}`}>Enviado</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-800 ${viewingOrder.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                          <CheckCircle size={20} />
                       </div>
                       <span className={`text-xs font-bold ${viewingOrder.status === 'delivered' ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}`}>Entregue</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Order Items */}
                  <div className="lg:col-span-2 space-y-4">
                    <h4 className="font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2"><ShoppingCart size={18} /> Itens do Pedido</h4>
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                       <table className="w-full text-sm text-left">
                          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase text-xs font-bold">
                             <tr>
                                <th className="px-4 py-3">Produto</th>
                                <th className="px-4 py-3 text-center">Qtd</th>
                                <th className="px-4 py-3 text-right">Preço Un.</th>
                                <th className="px-4 py-3 text-right">Total</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                             {viewingOrder.items.map((item, idx) => (
                                <tr key={idx} className="bg-white dark:bg-slate-800">
                                   <td className="px-4 py-3">
                                      <div className="flex items-center gap-3">
                                         <img src={item.image} alt="" className="w-10 h-10 rounded object-contain bg-white border border-slate-100" />
                                         <div>
                                            <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{item.title}</p>
                                            <p className="text-xs text-slate-500">{item.brand}</p>
                                         </div>
                                      </div>
                                   </td>
                                   <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{item.quantity}</td>
                                   <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">R$ {item.price.toFixed(2)}</td>
                                   <td className="px-4 py-3 text-right font-bold text-slate-800 dark:text-white">R$ {(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                  </div>

                  {/* Summary & Customer */}
                  <div className="space-y-6">
                     <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h4 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><CreditCard size={18} /> Pagamento</h4>
                        <div className="space-y-3 text-sm">
                           <div className="flex justify-between">
                              <span className="text-slate-500">Método</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                 {viewingOrder.paymentMethod === 'credit_card' ? 'Cartão de Crédito' : viewingOrder.paymentMethod === 'debit_card' ? 'Débito' : 'PIX'}
                              </span>
                           </div>
                           {viewingOrder.paymentDetails?.cardHolder && (
                              <div className="flex justify-between">
                                 <span className="text-slate-500">Titular</span>
                                 <span className="font-medium text-slate-800 dark:text-slate-200 uppercase">{viewingOrder.paymentDetails.cardHolder}</span>
                              </div>
                           )}
                           {viewingOrder.installments && (
                              <div className="flex justify-between">
                                 <span className="text-slate-500">Parcelas</span>
                                 <span className="font-medium text-slate-800 dark:text-slate-200">{viewingOrder.installments}</span>
                              </div>
                           )}
                           <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                              <span className="font-bold text-lg text-slate-800 dark:text-white">Total</span>
                              <span className="font-bold text-xl text-blue-600 dark:text-blue-400">R$ {viewingOrder.total.toFixed(2)}</span>
                           </div>
                        </div>
                     </div>

                     <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800">
                        <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2"><Info size={18} /> Cliente</h4>
                        <p className="text-sm text-blue-900 dark:text-blue-100 mb-1">
                           <b>{viewingOrder.paymentDetails?.cardHolder || "Cliente Visitante"}</b>
                        </p>
                        {viewingOrder.paymentDetails?.cardCpf && (
                           <p className="text-xs text-blue-700 dark:text-blue-300">CPF: {viewingOrder.paymentDetails.cardCpf}</p>
                        )}
                     </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

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
        if (viewingCustomer) {
           return (
             <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors min-h-[600px] flex flex-col">
               {/* Detail Header */}
               <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                  <div className="flex items-center gap-4">
                     <button onClick={() => setViewingCustomer(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition text-slate-500">
                        <ArrowLeft size={20} />
                     </button>
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                           {viewingCustomer.name.charAt(0)}
                        </div>
                        <div>
                           <h3 className="font-bold text-slate-800 dark:text-white text-lg leading-tight">{viewingCustomer.name}</h3>
                           <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2">
                             ID: #{viewingCustomer.id} <span className="w-1 h-1 bg-slate-300 rounded-full"></span> 
                             <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${viewingCustomer.status === 'VIP' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{viewingCustomer.status}</span>
                           </p>
                        </div>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <button onClick={() => setCustomerTab('email')} className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"><Mail size={18}/></button>
                     <button onClick={() => setCustomerTab('edit')} className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"><Edit size={18}/></button>
                  </div>
               </div>

               <div className="flex border-b border-slate-100 dark:border-slate-700 px-6">
                  {['overview', 'orders', 'edit', 'email'].map(tab => (
                     <button 
                       key={tab}
                       onClick={() => setCustomerTab(tab as CustomerTab)}
                       className={`px-4 py-3 text-sm font-bold border-b-2 transition capitalize ${customerTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                     >
                        {tab === 'overview' ? 'Visão Geral' : tab === 'orders' ? 'Pedidos' : tab === 'edit' ? 'Editar Dados' : 'Enviar Email'}
                     </button>
                  ))}
               </div>

               <div className="p-6 flex-1 overflow-y-auto">
                  {customerTab === 'overview' && (
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                           <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                                 <p className="text-xs font-bold text-blue-500 uppercase mb-1">Total Gasto</p>
                                 <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">R$ {viewingCustomer.spent.toFixed(2)}</p>
                              </div>
                              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
                                 <p className="text-xs font-bold text-purple-500 uppercase mb-1">Pedidos Realizados</p>
                                 <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{viewingCustomer.orders}</p>
                              </div>
                           </div>
                           
                           <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700">
                              <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2"><MapPin size={18}/> Endereço Principal</h4>
                              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{viewingCustomer.address || "Endereço não cadastrado."}</p>
                           </div>

                           <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700">
                              <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2"><Info size={18}/> Informações de Contato</h4>
                              <div className="space-y-3">
                                 <div className="flex items-center gap-3 text-sm">
                                    <Mail className="text-slate-400" size={16} />
                                    <span className="text-slate-600 dark:text-slate-300">{viewingCustomer.email}</span>
                                 </div>
                                 <div className="flex items-center gap-3 text-sm">
                                    <Phone className="text-slate-400" size={16} />
                                    <span className="text-slate-600 dark:text-slate-300">{viewingCustomer.phone}</span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-4">
                           <h4 className="font-bold text-slate-800 dark:text-white mb-2">Últimos Pedidos</h4>
                           {customerOrders.length > 0 ? customerOrders.slice(0, 3).map((order: any) => (
                              <div key={order.id} className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg shadow-sm">
                                 <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-mono font-bold text-slate-500">{order.id}</span>
                                    <span className="text-[10px] text-slate-400">{order.date}</span>
                                 </div>
                                 <div className="flex justify-between items-center">
                                    <span className="font-bold text-slate-800 dark:text-white text-sm">R$ {order.total.toFixed(2)}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${order.status === 'Entregue' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status}</span>
                                 </div>
                              </div>
                           )) : (
                              <p className="text-sm text-slate-500 italic">Nenhum pedido recente.</p>
                           )}
                           <button onClick={() => setCustomerTab('orders')} className="w-full py-2 text-sm text-blue-600 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition">Ver Histórico Completo</button>
                        </div>
                     </div>
                  )}

                  {customerTab === 'orders' && (
                     <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700">
                        <table className="w-full text-sm text-left">
                           <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase text-xs font-bold">
                              <tr>
                                 <th className="px-4 py-3">ID</th>
                                 <th className="px-4 py-3">Data</th>
                                 <th className="px-4 py-3">Itens</th>
                                 <th className="px-4 py-3">Total</th>
                                 <th className="px-4 py-3">Status</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                              {customerOrders.length > 0 ? customerOrders.map((order: any) => (
                                 <tr key={order.id} className="bg-white dark:bg-slate-800">
                                    <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">{order.id}</td>
                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{order.date}</td>
                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{order.items}</td>
                                    <td className="px-4 py-3 font-bold text-slate-800 dark:text-white">R$ {order.total.toFixed(2)}</td>
                                    <td className="px-4 py-3">
                                       <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${order.status === 'Entregue' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status}</span>
                                    </td>
                                 </tr>
                              )) : (
                                 <tr><td colSpan={5} className="p-6 text-center text-slate-500">Nenhum pedido encontrado.</td></tr>
                              )}
                           </tbody>
                        </table>
                     </div>
                  )}

                  {customerTab === 'edit' && (
                     <div className="max-w-2xl mx-auto">
                        <form onSubmit={handleSaveCustomerChanges} className="space-y-6">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                 <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Nome Completo</label>
                                 <input 
                                    type="text" 
                                    value={customerFormData.name || ''}
                                    onChange={(e) => setCustomerFormData({...customerFormData, name: e.target.value})}
                                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white text-sm"
                                 />
                              </div>
                              <div>
                                 <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Status</label>
                                 <select 
                                    value={customerFormData.status || 'Novo'}
                                    onChange={(e) => setCustomerFormData({...customerFormData, status: e.target.value})}
                                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white text-sm"
                                 >
                                    <option value="Novo">Novo</option>
                                    <option value="Ativo">Ativo</option>
                                    <option value="Inativo">Inativo</option>
                                    <option value="VIP">VIP</option>
                                 </select>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                 <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">E-mail</label>
                                 <input 
                                    type="email" 
                                    value={customerFormData.email || ''}
                                    onChange={(e) => setCustomerFormData({...customerFormData, email: e.target.value})}
                                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white text-sm"
                                 />
                              </div>
                              <div>
                                 <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Telefone</label>
                                 <input 
                                    type="text" 
                                    value={customerFormData.phone || ''}
                                    onChange={(e) => setCustomerFormData({...customerFormData, phone: e.target.value})}
                                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white text-sm"
                                 />
                              </div>
                           </div>

                           <div>
                              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Endereço Completo</label>
                              <textarea 
                                 rows={3}
                                 value={customerFormData.address || ''}
                                 onChange={(e) => setCustomerFormData({...customerFormData, address: e.target.value})}
                                 className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white text-sm resize-none"
                              />
                           </div>

                           <div className="flex justify-end pt-4">
                              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2">
                                 <Save size={18} /> Salvar Alterações
                              </button>
                           </div>
                        </form>
                     </div>
                  )}

                  {customerTab === 'email' && (
                     <div className="max-w-2xl mx-auto">
                        <form onSubmit={handleSendEmail} className="space-y-4">
                           {emailSuccess ? (
                              <div className="p-8 bg-green-50 rounded-xl text-center border border-green-100">
                                 <CheckCircle className="mx-auto text-green-500 mb-2" size={48} />
                                 <h4 className="text-xl font-bold text-green-700">E-mail Enviado!</h4>
                                 <p className="text-green-600">Sua mensagem foi enviada com sucesso para {viewingCustomer.email}.</p>
                              </div>
                           ) : (
                              <>
                                 <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mb-6">
                                    <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center gap-2">
                                       <Info size={16} /> Enviando mensagem para: <b>{viewingCustomer.name}</b> ({viewingCustomer.email})
                                    </p>
                                 </div>
                                 
                                 <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Assunto</label>
                                    <input 
                                       type="text" 
                                       required
                                       value={emailSubject}
                                       onChange={(e) => setEmailSubject(e.target.value)}
                                       className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white text-sm"
                                       placeholder="Ex: Oferta Especial para Você"
                                    />
                                 </div>
                                 <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Mensagem</label>
                                    <textarea 
                                       rows={8}
                                       required
                                       value={emailMessage}
                                       onChange={(e) => setEmailMessage(e.target.value)}
                                       className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white text-sm resize-none"
                                       placeholder="Escreva sua mensagem aqui..."
                                    />
                                 </div>
                                 <div className="flex justify-end pt-2">
                                    <button 
                                       type="submit" 
                                       disabled={isSendingEmail}
                                       className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 disabled:opacity-50"
                                    >
                                       {isSendingEmail ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                       {isSendingEmail ? 'Enviando...' : 'Enviar E-mail'}
                                    </button>
                                 </div>
                              </>
                           )}
                        </form>
                     </div>
                  )}
               </div>
             </div>
           );
        }

        return (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
               <h3 className="font-bold text-slate-800 dark:text-white text-lg">Pedidos Recentes</h3>
               <p className="text-slate-500 dark:text-slate-400 text-sm">Monitoramento de vendas em tempo real</p>
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
                      onClick={() => setActiveView('config')}
                      className="w-full bg-white/10 hover:bg-white/20 p-3 rounded-lg flex items-center gap-3 transition"
                    >
                      <Type size={20} /> <span className="font-medium">Editar Textos</span>
                    </button>
                  </div>
               </div>
            </div>
          </div>
        );
    }
  };

  const MegaphoneIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
  );

  return (
    <div className={`min-h-screen ${settings.darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors flex flex-col md:flex-row">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex-shrink-0 z-20 flex flex-col">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <LayoutDashboard size={20} />
            </div>
            <span className="font-bold text-xl text-slate-800 dark:text-white">Admin<span className="text-blue-600">Panel</span></span>
          </div>

          <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
            {[
              { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
              { id: 'products', label: 'Produtos', icon: Package },
              { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
              { id: 'customers', label: 'Clientes', icon: Users },
              { id: 'config', label: 'Configurações', icon: Settings },
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

          <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-700 space-y-2">
            <button 
              onClick={onGoToShop}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
            >
              <Store size={20} />
              Ver Loja Online
            </button>
            
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
                  onClick={() => setActiveView('config')}
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
                    <Tag size={20} className="text-indigo-500" /> Criar Promoção
                  </h3>
                  <button onClick={() => setIsDiscountModalOpen(false)}><X size={20} className="text-slate-400" /></button>
               </div>
               
               <div className="p-6 space-y-6">
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
                     <p className="text-sm text-indigo-800 dark:text-indigo-200">
                        O desconto será aplicado sobre o <b>preço original</b> dos produtos selecionados.
                     </p>
                  </div>

                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Percentual de Desconto</label>
                     <div className="flex items-center gap-4">
                        <input 
                           type="range" 
                           min="5" 
                           max="80" 
                           step="5"
                           value={discountConfig.percentage}
                           onChange={(e) => setDiscountConfig(prev => ({...prev, percentage: parseInt(e.target.value)}))}
                           className="flex-1"
                        />
                        <span className="font-bold text-lg text-slate-800 dark:text-white w-16 text-right">{discountConfig.percentage}%</span>
                     </div>
                  </div>

                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Aplicar Em:</label>
                     <select 
                        value={discountConfig.targetType}
                        onChange={(e) => {
                           const type = e.target.value;
                           setDiscountConfig(prev => ({
                              ...prev, 
                              targetType: type,
                              targetValue: type === 'category' ? 'Todos' : '' 
                           }))
                        }}
                        className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white text-sm mb-3"
                     >
                        <option value="category">Por Categoria</option>
                        <option value="brand">Por Marca</option>
                        <option value="product">Produto Específico</option>
                     </select>

                     {/* Dynamic Secondary Select */}
                     {discountConfig.targetType === 'category' && (
                        <select 
                           value={discountConfig.targetValue}
                           onChange={(e) => setDiscountConfig(prev => ({...prev, targetValue: e.target.value}))}
                           className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white text-sm"
                        >
                           <option value="Todos">Todas as Categorias</option>
                           {CATEGORIES.filter(c => c !== 'Todos').map(c => (
                              <option key={c} value={c}>{c}</option>
                           ))}
                        </select>
                     )}

                     {discountConfig.targetType === 'brand' && (
                        <select 
                           value={discountConfig.targetValue}
                           onChange={(e) => setDiscountConfig(prev => ({...prev, targetValue: e.target.value}))}
                           className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white text-sm"
                        >
                           <option value="" disabled>Selecione uma Marca</option>
                           {Array.from(new Set(localProducts.map(p => p.brand).filter(Boolean))).sort().map(brand => (
                              <option key={brand} value={brand}>{brand}</option>
                           ))}
                        </select>
                     )}

                     {discountConfig.targetType === 'product' && (
                        <select 
                           value={discountConfig.targetValue}
                           onChange={(e) => setDiscountConfig(prev => ({...prev, targetValue: e.target.value}))}
                           className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white text-sm"
                        >
                           <option value="" disabled>Selecione um Produto</option>
                           {localProducts.sort((a,b) => a.title.localeCompare(b.title)).map(p => (
                              <option key={p.id} value={p.id.toString()}>{p.title} - R$ {p.price.toFixed(2)}</option>
                           ))}
                        </select>
                     )}
                  </div>

                  <button 
                     onClick={handleApplyDiscount}
                     disabled={discountConfig.isApplying || (discountConfig.targetType !== 'category' && !discountConfig.targetValue)}
                     className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                     {discountConfig.isApplying ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                     {discountConfig.isApplying ? 'Aplicando...' : 'Aplicar Desconto'}
                  </button>
               </div>
            </motion.div>
          </div>
        )}

        {/* Edit Product Modal */}
        {isEditModalOpen && editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl relative z-10 flex flex-col max-h-[90vh]">
               <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
                    {editingProduct.id === 0 ? <Plus size={20} className="text-blue-500"/> : <Edit size={20} className="text-blue-500"/>}
                    {editingProduct.id === 0 ? 'Adicionar Novo Produto' : 'Editar Produto'}
                  </h3>
                  <button onClick={() => setIsEditModalOpen(false)}><X size={20} className="text-slate-400" /></button>
               </div>

               <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                  <form id="productForm" onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* Left Column: Image & Basic Info */}
                     <div className="space-y-4">
                        <div className="aspect-square bg-slate-50 dark:bg-slate-700/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-600 flex flex-col items-center justify-center relative overflow-hidden group">
                           {editingProduct.image ? (
                              <img src={editingProduct.image} alt="Preview" className="w-full h-full object-contain" />
                           ) : (
                              <div className="text-center text-slate-400">
                                 <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                                 <p className="text-sm">Nenhuma imagem</p>
                              </div>
                           )}
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                              <label className="cursor-pointer bg-white text-slate-800 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-100 transition flex items-center gap-2">
                                 <Upload size={16} /> Trocar Imagem
                                 <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                              </label>
                           </div>
                        </div>

                        <div>
                           <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Nome do Produto</label>
                           <input 
                              type="text" 
                              required
                              value={editingProduct.title}
                              onChange={(e) => setEditingProduct({...editingProduct, title: e.target.value})}
                              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                              placeholder="Ex: iPhone 15 Pro Max"
                           />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Categoria</label>
                              <select 
                                 value={editingProduct.category}
                                 onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                                 className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                              >
                                 {CATEGORIES.filter(c => c !== 'Todos').map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                           </div>
                           <div>
                              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Marca</label>
                              <input 
                                 type="text" 
                                 value={editingProduct.brand}
                                 onChange={(e) => setEditingProduct({...editingProduct, brand: e.target.value})}
                                 className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                 placeholder="Ex: Apple"
                              />
                           </div>
                        </div>
                     </div>

                     {/* Right Column: Pricing & Details */}
                     <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Preço Atual (R$)</label>
                              <input 
                                 type="number" 
                                 required
                                 step="0.01"
                                 value={editingProduct.price}
                                 onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})}
                                 className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                              />
                           </div>
                           <div>
                              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Preço Original (R$)</label>
                              <input 
                                 type="number" 
                                 step="0.01"
                                 value={editingProduct.originalPrice || ''}
                                 onChange={(e) => setEditingProduct({...editingProduct, originalPrice: parseFloat(e.target.value) || undefined})}
                                 className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                 placeholder="Opcional"
                              />
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Estoque</label>
                              <input 
                                 type="number" 
                                 required
                                 value={editingProduct.stock}
                                 onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value) || 0})}
                                 className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                              />
                           </div>
                           <div>
                              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Avaliação (0-5)</label>
                              <input 
                                 type="number" 
                                 step="0.1"
                                 max="5"
                                 value={editingProduct.rating}
                                 onChange={(e) => setEditingProduct({...editingProduct, rating: parseFloat(e.target.value) || 0})}
                                 className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                              />
                           </div>
                        </div>

                        <div>
                           <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Descrição Completa</label>
                           <textarea 
                              rows={5}
                              value={editingProduct.description}
                              onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                              placeholder="Descreva os detalhes do produto..."
                           />
                        </div>
                     </div>
                  </form>
               </div>

               <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
                  <button 
                     onClick={() => setIsEditModalOpen(false)}
                     className="px-6 py-2 rounded-lg text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  >
                     Cancelar
                  </button>
                  <button 
                     form="productForm"
                     type="submit"
                     className="px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition flex items-center gap-2"
                  >
                     <Save size={18} /> Salvar Alterações
                  </button>
               </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>
    </div>
  );
};
