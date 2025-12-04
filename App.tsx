
import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { Assistant } from './components/Assistant';
import { MobileMenu } from './components/MobileMenu';
import { NotificationToast } from './components/NotificationToast';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard'; // Import Admin Dashboard
import { CheckoutModal } from './components/CheckoutModal'; // Import Checkout Modal
import { CartDrawer } from './components/CartDrawer'; // Import Cart Drawer
import { MOCK_PRODUCTS, CATEGORIES, CATEGORY_BRANDS } from './constants';
import { Product, CartItem, Category, Notification, SortOption, Order, User, PaymentMethod, PaymentDetails } from './types';
import { X, Minus, Plus, Trash2, ArrowRight, CircleCheck, Smartphone, Tv, Laptop, Sofa, Snowflake, ShoppingCart, Sparkles, Tag, ChevronLeft, ChevronRight, Gamepad2, Dumbbell, Shirt, CarFront, SprayCan, Heart, Filter, Menu, Grid, Circle, Package, Clock, Calendar, Truck, ShieldCheck, Award, CreditCard } from 'lucide-react';
import { generateProductSummary } from './services/geminiService';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<number[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]); // Track real registrations

  // View State: 'home' (default), 'wishlist', 'orders', 'admin'
  const [viewMode, setViewMode] = useState<'home' | 'wishlist' | 'orders' | 'admin'>('home');

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>('Todos');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Checkout State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState(false);

  // Product Details Modal State
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [detailsQuantity, setDetailsQuantity] = useState(1); // Quantity selector state
  const [activeImage, setActiveImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [aiSummary, setAiSummary] = useState<string>('');
  
  // --- Filter State ---
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [onlyDeals, setOnlyDeals] = useState(false);

  // --- Deals Carousel State ---
  const [currentDealIndex, setCurrentDealIndex] = useState(0);

  // --- Notification Helpers ---
  const addNotification = (title: string, message: string, type: 'success' | 'info' | 'promotion' | 'warning', image?: string, productId?: number) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, title, message, type, image, productId }]);
    
    // Auto dismiss after 6 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 6000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleNotificationClick = (productId: number) => {
     const product = MOCK_PRODUCTS.find(p => p.id === productId);
     if (product) {
       handleViewDetails(product);
     }
  };

  // --- Auth Handlers ---
  const handleLogin = (userData: User) => {
    setUser(userData);
    
    // Track registered users for admin panel (if not admin)
    if (userData.role !== 'admin') {
      setRegisteredUsers(prev => {
        // Avoid duplicates
        if (prev.find(u => u.email === userData.email)) return prev;
        return [userData, ...prev];
      });
    }

    // Admin Check
    if (userData.role === 'admin') {
      setViewMode('admin');
      addNotification('Painel Admin', `Bem-vindo, Mestre! Acesso ao painel liberado.`, 'success');
    } else {
      addNotification('Bem-vindo!', `Olá, ${userData.name}! Que bom te ver por aqui.`, 'success');
      setViewMode('home');

      // Auto-resume checkout if pending
      if (pendingCheckout) {
        setPendingCheckout(false);
        setTimeout(() => setIsCheckoutOpen(true), 500); // Small delay for smooth transition
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    addNotification('Até logo', 'Você saiu da sua conta. Volte logo!', 'info');
    setViewMode('home');
  };

  // --- Wishlist Logic ---
  const toggleWishlist = (product: Product) => {
    if (wishlist.includes(product.id)) {
      setWishlist(prev => prev.filter(id => id !== product.id));
      addNotification('Removido', `${product.title} saiu dos seus favoritos.`, 'info');
    } else {
      setWishlist(prev => [...prev, product.id]);
      addNotification('Favoritado!', `${product.title} foi salvo para depois.`, 'success', product.image, product.id);
    }
  };

  // --- Recently Viewed Logic ---
  const addToRecentlyViewed = (id: number) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(itemId => itemId !== id);
      return [id, ...filtered].slice(0, 10); // Keep last 10
    });
  };

  // --- Navigation Logic ---
  const handleGoHome = () => {
    // If admin is logged in, going "Home" might mean going back to dashboard, or site.
    // For now, let's allow admins to see the site but viewMode 'admin' is distinct.
    if (user?.role === 'admin') {
       // Optional: Decide if clicking logo goes to Dashboard or Shop for admin
       // setViewMode('admin'); 
       setViewMode('home'); // Let admin shop too
    } else {
       setViewMode('home');
    }
    setSelectedCategory('Todos');
    setSelectedBrand(null);
    setSearchTerm('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Price Drop Simulator (Promotion Notification) ---
  useEffect(() => {
    const interval = setInterval(() => {
      // Logic: Pick a random item from Wishlist OR Recently Viewed to simulate a price drop
      const candidates = [...new Set([...wishlist, ...recentlyViewed])];
      
      if (candidates.length > 0) {
        // 30% chance to trigger a notification per interval cycle if there are candidates
        if (Math.random() < 0.3) {
          const randomId = candidates[Math.floor(Math.random() * candidates.length)];
          const product = MOCK_PRODUCTS.find(p => p.id === randomId);
          
          if (product) {
            // const randomDrop = Math.floor(Math.random() * 15) + 5; 
            const isWishlisted = wishlist.includes(randomId);
            
            addNotification(
              '🔥 Preço Baixou!',
              `${isWishlisted ? 'Um item da sua lista de desejos' : 'Um produto que você viu'} entrou em oferta relâmpago!`,
              'promotion',
              product.image,
              product.id
            );
          }
        }
      }
    }, 15000); // Check every 15 seconds for demo purposes (real app would be server push)

    return () => clearInterval(interval);
  }, [wishlist, recentlyViewed]);


  // --- Cart Logic ---
  const addToCart = (product: Product, quantityToAdd: number = 1) => {
    // 1. Stock Check: Is it completely sold out?
    if (product.stock === 0) {
      addNotification('Produto Esgotado', `O item ${product.title} está indisponível no momento.`, 'warning', product.image);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      
      // 2. Stock Check: Do we have enough for existing + quantityToAdd?
      if (existing) {
        if (existing.quantity + quantityToAdd > product.stock) {
          // Notification MUST happen outside set state ideally, but reacting here is immediate
          setTimeout(() => addNotification(
            'Estoque Limitado', 
            `Desculpe, limite máximo de ${product.stock} unidades atingido.`, 
            'warning',
            undefined,
            product.id
          ), 0);
          return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item);
      }
      
      // New Item check
      if (quantityToAdd > product.stock) {
         setTimeout(() => addNotification(
            'Estoque Limitado', 
            `Desculpe, só temos ${product.stock} unidades disponíveis.`, 
            'warning',
            undefined,
            product.id
          ), 0);
         return prev;
      }

      setIsCartOpen(true);
      setTimeout(() => addNotification('Adicionado ao Carrinho', `${product.title} já está na sua sacola!`, 'success', undefined, product.id), 0);
      return [...prev, { ...product, quantity: quantityToAdd }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        
        // Stock Check for increasing quantity
        if (delta > 0 && newQty > item.stock) {
           setTimeout(() => addNotification(
            'Estoque Máximo Atingido', 
            `Você já selecionou todo o estoque disponível (${item.stock} un).`, 
            'warning'
          ), 0);
           return item;
        }

        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const totalCartValue = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleInitiateCheckout = () => {
    if (cart.length === 0) return;
    
    if (!user) {
      addNotification('Acesso Restrito', 'Somente pessoas cadastradas podem efetuar compras. Por favor, identifique-se.', 'warning');
      setPendingCheckout(true);
      setIsCartOpen(false);
      setIsAuthModalOpen(true);
      return;
    }
    
    // Open Payment Modal
    setIsCartOpen(false); // Close cart drawer
    setIsCheckoutOpen(true); // Open payment modal
  };

  const handleConfirmPayment = (method: PaymentMethod, paymentDetails: PaymentDetails) => {
    // Generate Final Order
    const newOrder: Order = {
      id: `#${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('pt-BR'),
      items: [...cart],
      total: totalCartValue,
      status: 'processing',
      paymentMethod: method,
      installments: paymentDetails.installmentsSummary,
      paymentDetails: paymentDetails // Store full details including secure info (Demo Only)
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setIsCheckoutOpen(false);
    setViewMode('orders'); // Go to orders view
    addNotification('Pedido Confirmado!', `Seu pedido ${newOrder.id} foi realizado com sucesso via ${method === 'pix' ? 'PIX' : 'Cartão'}.`, 'success');
  };

  // --- Filtering Logic (View Mode Agnostic) ---
  const filteredProducts = useMemo(() => {
    let result = MOCK_PRODUCTS.filter(product => {
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
      const matchesBrand = selectedBrand ? product.brand === selectedBrand : true;
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesDeal = true;
      if (onlyDeals) {
        const discount = product.originalPrice 
          ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
          : 0;
        matchesDeal = discount > 0;
      }
      
      return matchesCategory && matchesBrand && matchesSearch && matchesDeal;
    });

    // Sorting
    return result.sort((a, b) => {
      if (sortBy === 'lowest') return a.price - b.price;
      if (sortBy === 'highest') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  }, [selectedCategory, selectedBrand, searchTerm, sortBy, onlyDeals]);

  // --- Wishlist View Logic ---
  const wishlistProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => wishlist.includes(p.id));
  }, [wishlist]);

  // --- Highlighted Deals Logic (20% to 60% OFF) ---
  const highlightedDeals = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      if (!p.originalPrice) return false;
      const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
      return discount >= 20 && discount <= 60;
    }).slice(0, 10); // Limit to top 10 to rotate
  }, []);

  // Auto-play deals carousel
  useEffect(() => {
    if (highlightedDeals.length === 0) return;
    const interval = setInterval(() => {
      setCurrentDealIndex((prev) => (prev + 1) % highlightedDeals.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [highlightedDeals.length]);

  const nextDeal = () => {
    setCurrentDealIndex((prev) => (prev + 1) % highlightedDeals.length);
  };

  const prevDeal = () => {
    setCurrentDealIndex((prev) => (prev - 1 + highlightedDeals.length) % highlightedDeals.length);
  };

  const currentDeal = highlightedDeals[currentDealIndex];
  const currentDealDiscount = currentDeal 
    ? Math.round(((currentDeal.originalPrice! - currentDeal.price) / currentDeal.originalPrice!) * 100)
    : 0;

  // --- Product Details Logic ---
  const handleViewDetails = async (product: Product) => {
    setActiveProduct(product);
    setActiveImage(product.image); // Initialize gallery with main image
    setActiveTab('description');
    setDetailsQuantity(1); // Reset quantity when opening a product
    addToRecentlyViewed(product.id);
    setAiSummary('Gerando resumo inteligente com Maga AI...');
    const summary = await generateProductSummary(product);
    setAiSummary(summary);
  };

  // --- Category Icons Helper ---
  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case 'Smartphones': return <Smartphone size={18} />;
      case 'TV e Vídeo': return <Tv size={18} />;
      case 'Informática': return <Laptop size={18} />;
      case 'Móveis': return <Sofa size={18} />;
      case 'Eletrodomésticos': return <Snowflake size={18} />;
      case 'Games': return <Gamepad2 size={18} />;
      case 'Beleza e Perfumaria': return <SprayCan size={18} />;
      case 'Esporte e Lazer': return <Dumbbell size={18} />;
      case 'Moda': return <Shirt size={18} />;
      case 'Automotivo': return <CarFront size={18} />;
      default: return <Grid size={18} />;
    }
  };

  // Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const pageVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  // --- RENDER ADMIN DASHBOARD ---
  if (viewMode === 'admin' && user?.role === 'admin') {
    return (
      <div className="bg-slate-100">
         <NotificationToast notifications={notifications} removeNotification={removeNotification} onNotificationClick={handleNotificationClick} />
         <AdminDashboard 
            user={user} 
            onLogout={handleLogout} 
            products={MOCK_PRODUCTS} 
            orders={orders} 
            registeredUsers={registeredUsers} // Pass real users
         />
      </div>
    );
  }

  // --- RENDER STANDARD SHOP ---
  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 bg-[#f8f9fa]">
      <NotificationToast notifications={notifications} removeNotification={removeNotification} onNotificationClick={handleNotificationClick} />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingCheckout(false); // Reset pending checkout if user cancels login
        }} 
        onLogin={handleLogin} 
      />
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleInitiateCheckout}
      />
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        total={totalCartValue} 
        onConfirmPayment={handleConfirmPayment}
        user={user}
      />
      
      <Header 
        cart={cart} 
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenMenu={() => setIsMenuOpen(true)}
        onViewWishlist={() => setViewMode('wishlist')}
        onGoHome={handleGoHome}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Mobile Menu Sidebar (Includes Filters) */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSelectedBrand(null);
          setViewMode('home'); // Reset view to home when filtering
        }}
        selectedBrand={selectedBrand}
        onSelectBrand={setSelectedBrand}
        // Filter Props
        sortBy={sortBy}
        onSortChange={setSortBy}
        onlyDeals={onlyDeals}
        onDealsChange={setOnlyDeals}
        // Navigation Props
        onViewOrders={() => {
          if (!user) {
            addNotification('Faça login', 'Entre para ver seus pedidos.', 'info');
            setIsAuthModalOpen(true);
          } else {
            setViewMode('orders');
          }
        }}
        onViewWishlist={() => setViewMode('wishlist')}
        // Auth Props
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          
          {/* VIEW: HOME (Product Grid + Carousel) */}
          {viewMode === 'home' && (
            <motion.div
              key="home"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
            >
              {/* Dynamic Deals Carousel (Hero) */}
              {currentDeal ? (
                 <div className="relative w-full h-[400px] md:h-[350px] bg-gradient-to-r from-blue-900 to-indigo-800 rounded-2xl mb-8 shadow-2xl overflow-hidden flex items-center group">
                   <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                   <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-blue-600/30 to-transparent skew-x-12"></div>

                   <button 
                     onClick={(e) => { e.stopPropagation(); prevDeal(); }}
                     className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-md transition-all border border-white/20 shadow-lg"
                   >
                     <ChevronLeft size={24} />
                   </button>

                   <button 
                     onClick={(e) => { e.stopPropagation(); nextDeal(); }}
                     className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-md transition-all border border-white/20 shadow-lg"
                   >
                     <ChevronRight size={24} />
                   </button>

                   <AnimatePresence mode="wait">
                     <motion.div
                       key={currentDeal.id}
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 1.05 }}
                       transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                       className="w-full h-full flex flex-col md:flex-row items-center justify-between p-6 md:p-12 relative z-10 pl-16 pr-16"
                     >
                        <div className="flex-1 text-white flex flex-col items-start space-y-4 max-w-xl">
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="bg-yellow-400 text-blue-900 font-extrabold px-3 py-1 rounded text-sm uppercase flex items-center gap-2"
                          >
                            <Tag size={16} /> Oferta Relâmpago
                          </motion.div>
                          
                          <h2 className="text-2xl md:text-4xl font-bold leading-tight line-clamp-2">
                            {currentDeal.title}
                          </h2>

                          <div className="flex items-center gap-4">
                            <div className="bg-red-600 text-white text-3xl md:text-5xl font-extrabold px-4 py-2 rounded-lg -rotate-2 shadow-lg border-2 border-white/20">
                              {currentDealDiscount}% OFF
                            </div>
                            <div className="flex flex-col">
                              <span className="text-gray-300 line-through text-sm">De R$ {currentDeal.originalPrice?.toFixed(2)}</span>
                              <span className="text-3xl font-bold text-yellow-400">R$ {currentDeal.price.toFixed(2)}</span>
                              <span className="text-xs text-blue-200">à vista no Pix</span>
                            </div>
                          </div>

                          <motion.button 
                             whileHover={{ scale: 1.05 }}
                             whileTap={{ scale: 0.95 }}
                             animate={{ scale: [1, 1.02, 1] }}
                             transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                             onClick={() => handleViewDetails(currentDeal)}
                             className="mt-4 bg-yellow-400 text-blue-900 text-lg font-extrabold px-8 py-3 rounded-full hover:bg-yellow-300 transition-all shadow-xl hover:shadow-yellow-400/50 flex items-center gap-2"
                          >
                            <ShoppingCart size={20} strokeWidth={3} />
                            Aproveitar Agora
                          </motion.button>
                        </div>

                        <div className="flex-1 h-full flex items-center justify-center relative mt-6 md:mt-0">
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            className="relative w-full h-full flex items-center justify-center"
                          >
                             <div className="absolute inset-0 bg-white/20 blur-[50px] rounded-full transform scale-75"></div>
                             <img 
                               src={currentDeal.image} 
                               alt={currentDeal.title} 
                               className="max-h-[200px] md:max-h-[300px] object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)] z-10 hover:scale-105 transition duration-500"
                             />
                          </motion.div>
                        </div>
                     </motion.div>
                   </AnimatePresence>

                   {/* Dots Navigation */}
                   <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
                     {highlightedDeals.map((_, idx) => (
                       <button
                         key={idx}
                         onClick={(e) => { e.stopPropagation(); setCurrentDealIndex(idx); }}
                         className={`transition-all duration-300 rounded-full shadow-sm ${idx === currentDealIndex ? 'w-8 h-3 bg-yellow-400' : 'w-3 h-3 bg-white/40 hover:bg-white hover:scale-110'}`}
                         aria-label={`Ir para oferta ${idx + 1}`}
                       />
                     ))}
                   </div>
                 </div>
              ) : null}

              <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Desktop Category Sidebar */}
                <aside className="hidden lg:block w-64 sticky top-24 bg-white rounded-xl shadow-sm border border-gray-100 p-2 overflow-hidden flex-shrink-0">
                   <div className="p-4 border-b border-gray-50 mb-2">
                      <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                        <Grid size={20} className="text-blue-600" />
                        Produtos
                      </h2>
                   </div>
                   
                   <div className="flex flex-col gap-1 max-h-[calc(100vh-200px)] overflow-y-auto pr-1 custom-scrollbar">
                     {CATEGORIES.map(cat => (
                       <div key={cat} className="flex flex-col">
                          <motion.button 
                            whileHover={{ x: 4 }}
                            onClick={() => {
                              setSelectedCategory(cat);
                              setSelectedBrand(null);
                            }}
                            className={`
                              w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left
                              ${selectedCategory === cat 
                                ? 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600' 
                                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600 border-l-4 border-transparent'}
                            `}
                          >
                            <div className={`${selectedCategory === cat ? 'text-blue-600' : 'text-gray-400'}`}>
                              {getCategoryIcon(cat)}
                            </div>
                            {cat}
                            {selectedCategory === cat && <ChevronRight size={14} className="ml-auto" />}
                          </motion.button>
                          
                          <AnimatePresence>
                            {selectedCategory === cat && CATEGORY_BRANDS[cat] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden bg-gray-50/50 rounded-b-lg ml-2"
                              >
                                 <div className="flex flex-col pl-9 py-2 gap-1 border-l-2 border-gray-100 ml-4">
                                    <button
                                      onClick={() => setSelectedBrand(null)}
                                      className={`text-left text-xs py-1.5 px-2 rounded hover:bg-gray-100 transition flex items-center gap-2 ${!selectedBrand ? 'text-blue-600 font-bold' : 'text-gray-500'}`}
                                    >
                                      { !selectedBrand && <Circle size={6} fill="currentColor" /> }
                                      Todas as Marcas
                                    </button>
                                    {CATEGORY_BRANDS[cat].map(brand => (
                                      <button
                                        key={brand}
                                        onClick={() => setSelectedBrand(brand)}
                                        className={`text-left text-xs py-1.5 px-2 rounded hover:bg-gray-100 transition flex items-center gap-2 ${selectedBrand === brand ? 'text-blue-600 font-bold' : 'text-gray-500'}`}
                                      >
                                        { selectedBrand === brand && <Circle size={6} fill="currentColor" /> }
                                        {brand}
                                      </button>
                                    ))}
                                 </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                       </div>
                     ))}
                   </div>
                   
                   <div className="mt-8 p-4 bg-gray-50 rounded-lg text-xs text-gray-500 border border-gray-100 text-center mx-2 mb-2">
                      <p>Busca Avançada?</p>
                      <p className="font-bold text-blue-600 mt-1 cursor-pointer flex items-center justify-center gap-1" onClick={() => setIsMenuOpen(true)}>
                         <Menu size={12} /> Abra o Menu
                      </p>
                   </div>
                </aside>

                {/* Product Grid Area */}
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                     <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                          {selectedCategory === 'Todos' ? <Sparkles size={24} className="text-yellow-400" /> : null}
                          {selectedCategory === 'Todos' ? 'Ofertas em Destaque' : selectedCategory}
                        </h2>
                        {selectedBrand && (
                          <span className="text-sm text-blue-600 font-medium flex items-center gap-1 mt-1">
                            <ChevronRight size={14} /> {selectedBrand}
                            <button onClick={() => setSelectedBrand(null)} className="ml-2 hover:bg-blue-50 p-0.5 rounded-full"><X size={12}/></button>
                          </span>
                        )}
                     </div>
                     <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm w-fit">
                       <span className="font-bold text-gray-900">{filteredProducts.length}</span> resultados
                     </div>
                   </div>
                   
                   {filteredProducts.length > 0 ? (
                     <motion.div 
                       layout
                       variants={containerVariants}
                       initial="hidden"
                       animate="visible"
                       className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                     >
                       <AnimatePresence mode="popLayout">
                         {filteredProducts.slice(0, 50).map(product => (
                           <ProductCard 
                             key={product.id} 
                             product={product} 
                             onViewDetails={handleViewDetails}
                             onAddToCart={(p) => addToCart(p, 1)}
                             isWishlisted={wishlist.includes(product.id)}
                             onToggleWishlist={toggleWishlist}
                           />
                         ))}
                       </AnimatePresence>
                     </motion.div>
                   ) : (
                     <motion.div 
                       initial={{ opacity: 0 }} 
                       animate={{ opacity: 1 }}
                       className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300"
                     >
                       <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                          <Filter size={40} />
                       </div>
                       <h3 className="text-gray-800 font-bold text-lg mb-2">Nenhum produto encontrado</h3>
                       <p className="text-gray-500 text-sm mb-6">Tente ajustar seus filtros ou buscar por outro termo.</p>
                       <button onClick={() => {
                         setSearchTerm(''); 
                         setSelectedCategory('Todos');
                         setSelectedBrand(null);
                         setOnlyDeals(false);
                       }} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                         Limpar Filtros
                       </button>
                     </motion.div>
                   )}
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Other views are handled via viewMode check in render logic or conditional rendering */}
          {viewMode === 'wishlist' && (
             <motion.div 
               key="wishlist"
               initial="initial"
               animate="animate"
               exit="exit"
               variants={pageVariants}
            >
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <Heart className="text-red-500" fill="currentColor" /> Meus Favoritos
                  </h2>
                  <p className="text-gray-500 text-sm mb-6">
                    {wishlistProducts.length} itens salvos para depois
                  </p>

                  {wishlistProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                      {wishlistProducts.map(product => (
                        <ProductCard 
                          key={product.id} 
                          product={product} 
                          onViewDetails={handleViewDetails}
                          onAddToCart={(p) => addToCart(p, 1)}
                          isWishlisted={true}
                          onToggleWishlist={toggleWishlist}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                      <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                      <h3 className="text-gray-800 font-bold mb-2">Sua lista está vazia</h3>
                      <p className="text-gray-500 text-sm mb-6">Aproveite nossas ofertas e salve o que você mais gosta!</p>
                      <button onClick={handleGoHome} className="text-blue-600 font-bold hover:underline">
                        Ir para a Loja
                      </button>
                    </div>
                  )}
                </div>
             </motion.div>
          )}

          {viewMode === 'orders' && user && (
            <motion.div
               key="orders"
               initial="initial"
               animate="animate"
               exit="exit"
               variants={pageVariants}
            >
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                 <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                   <Package className="text-blue-600" /> Meus Pedidos
                 </h2>
                 
                 {orders.length > 0 ? (
                   <div className="space-y-4">
                     {orders.map(order => (
                       <div key={order.id} className="border border-gray-200 rounded-xl overflow-hidden">
                         <div className="bg-gray-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                           <div className="flex flex-col sm:flex-row sm:gap-6">
                             <div>
                               <p className="text-xs text-gray-500 uppercase font-bold">Pedido Realizado</p>
                               <p className="text-sm font-medium text-gray-900">{order.date}</p>
                             </div>
                             <div>
                               <p className="text-xs text-gray-500 uppercase font-bold">Total</p>
                               <p className="text-sm font-medium text-gray-900">R$ {order.total.toFixed(2)}</p>
                             </div>
                             <div>
                               <p className="text-xs text-gray-500 uppercase font-bold">Pagamento</p>
                               <p className="text-sm font-medium text-gray-900">
                                 {order.paymentMethod === 'credit_card' ? 'Cartão de Crédito' : order.paymentMethod === 'debit_card' ? 'Débito' : 'Pix'}
                                 {order.installments && <span className="text-gray-500 text-xs font-normal ml-1">({order.installments})</span>}
                               </p>
                             </div>
                           </div>
                           <div className="flex items-center gap-2">
                             <span className="text-xs font-bold text-gray-500 uppercase">Pedido</span>
                             <span className="text-sm font-mono text-gray-900">{order.id}</span>
                           </div>
                         </div>
                         <div className="p-4">
                           <div className="flex items-center justify-between mb-4">
                             <div className="flex items-center gap-2">
                               <div className={`w-2 h-2 rounded-full ${order.status === 'delivered' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                               <span className="font-bold text-sm text-gray-800 uppercase">
                                 {order.status === 'processing' ? 'Processando Pagamento' : order.status === 'shipped' ? 'Em Trânsito' : 'Entregue'}
                               </span>
                             </div>
                           </div>
                           <div className="space-y-3">
                             {order.items.map((item, idx) => (
                               <div key={idx} className="flex items-center gap-4">
                                 <img src={item.image} alt={item.title} className="w-16 h-16 object-contain border border-gray-100 rounded bg-white" />
                                 <div className="flex-1">
                                   <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</p>
                                   <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
                                 </div>
                                 <p className="text-sm font-bold text-gray-900">R$ {item.price.toFixed(2)}</p>
                               </div>
                             ))}
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="text-center py-20">
                     <Package size={48} className="mx-auto text-gray-300 mb-4" />
                     <h3 className="text-gray-800 font-bold mb-2">Nenhum pedido encontrado</h3>
                     <p className="text-gray-500 text-sm mb-6">Você ainda não fez nenhuma compra conosco.</p>
                     <button onClick={handleGoHome} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">
                       Começar a Comprar
                     </button>
                   </div>
                 )}
               </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Assistant Chat */}
      <Assistant products={MOCK_PRODUCTS} cart={cart} />

      {/* Product Details Modal */}
      <AnimatePresence>
        {activeProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProduct(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl relative z-10 overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setActiveProduct(null)}
                className="absolute top-4 right-4 z-20 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition"
              >
                <X size={20} className="text-gray-600" />
              </button>

              {/* Gallery Section */}
              <div className="w-full md:w-1/2 bg-gray-50 p-6 flex flex-col">
                <div className="flex-1 flex items-center justify-center mb-4 relative">
                   <AnimatePresence mode="wait">
                     <motion.img 
                       key={activeImage}
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       src={activeImage} 
                       alt={activeProduct.title} 
                       className="max-h-[300px] md:max-h-[400px] w-auto object-contain mix-blend-multiply"
                     />
                   </AnimatePresence>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                  {activeProduct.gallery.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-16 h-16 flex-shrink-0 border-2 rounded-lg overflow-hidden bg-white p-1 ${activeImage === img ? 'border-blue-600' : 'border-transparent hover:border-gray-300'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Info Section */}
              <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto custom-scrollbar bg-white">
                 <div className="mb-1">
                   <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wide">
                     {activeProduct.category}
                   </span>
                   {activeProduct.brand && (
                      <span className="text-xs font-bold text-gray-500 ml-2 uppercase tracking-wide">
                        {activeProduct.brand}
                      </span>
                   )}
                 </div>
                 
                 <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                   {activeProduct.title}
                 </h2>
                 
                 <div className="flex items-center gap-2 mb-4">
                   <div className="flex text-yellow-400 text-sm">
                     {'★'.repeat(Math.floor(activeProduct.rating))}
                     {'★'.repeat(5 - Math.floor(activeProduct.rating)).split('').map((_, i) => <span key={i} className="text-gray-200">★</span>)}
                   </div>
                   <span className="text-sm text-gray-500">({activeProduct.reviews} avaliações)</span>
                 </div>
                 
                 <div className="mb-6 pb-6 border-b border-gray-100">
                   {activeProduct.originalPrice && (
                     <p className="text-gray-400 line-through text-sm">R$ {activeProduct.originalPrice.toFixed(2)}</p>
                   )}
                   <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-bold text-gray-900">R$ {activeProduct.price.toFixed(2)}</span>
                   </div>
                   <p className="text-green-600 text-sm font-medium mt-1">
                     Em até 10x de R$ {(activeProduct.price / 10).toFixed(2)} sem juros
                   </p>
                 </div>

                 {/* AI Summary Box */}
                 <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-100 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                       <Sparkles size={16} className="text-indigo-600" />
                       <span className="text-xs font-bold text-indigo-700 uppercase">Resumo da Maga IA</span>
                    </div>
                    <p className="text-sm text-indigo-900 italic leading-relaxed">
                       "{aiSummary || 'Carregando análise inteligente...'}"
                    </p>
                 </div>

                 <div className="flex gap-3 mb-8">
                   {/* Quantity Selector */}
                   <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 h-[52px]">
                      <button 
                        onClick={() => setDetailsQuantity(Math.max(1, detailsQuantity - 1))}
                        disabled={detailsQuantity <= 1 || activeProduct.stock === 0}
                        className="px-3 text-gray-500 hover:text-blue-600 disabled:opacity-30 transition"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-bold text-gray-800">{detailsQuantity}</span>
                      <button 
                        onClick={() => setDetailsQuantity(Math.min(activeProduct.stock, detailsQuantity + 1))}
                        disabled={detailsQuantity >= activeProduct.stock || activeProduct.stock === 0}
                        className="px-3 text-gray-500 hover:text-blue-600 disabled:opacity-30 transition"
                      >
                        <Plus size={16} />
                      </button>
                   </div>

                   <button 
                     onClick={() => {
                        addToCart(activeProduct, detailsQuantity);
                        setActiveProduct(null);
                     }}
                     disabled={activeProduct.stock === 0}
                     className={`flex-1 font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition transform active:scale-95
                       ${activeProduct.stock === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-500/30'}
                     `}
                   >
                     {activeProduct.stock === 0 ? (
                       'Indisponível'
                     ) : (
                       <>
                         <ShoppingCart size={20} /> Adicionar à Sacola
                       </>
                     )}
                   </button>
                   <button 
                      onClick={() => toggleWishlist(activeProduct)}
                      className={`p-3.5 rounded-xl border-2 transition ${wishlist.includes(activeProduct.id) ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'}`}
                   >
                     <Heart size={24} fill={wishlist.includes(activeProduct.id) ? "currentColor" : "none"} />
                   </button>
                 </div>
                 
                 {/* Tabs for Details */}
                 <div className="flex border-b border-gray-200 mb-4">
                    <button 
                      onClick={() => setActiveTab('description')}
                      className={`pb-3 pr-4 text-sm font-bold border-b-2 transition ${activeTab === 'description' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                      Descrição
                    </button>
                    <button 
                      onClick={() => setActiveTab('specs')}
                      className={`pb-3 px-4 text-sm font-bold border-b-2 transition ${activeTab === 'specs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                      Especificações
                    </button>
                 </div>
                 
                 <div className="text-sm text-gray-600 leading-relaxed">
                    {activeTab === 'description' ? (
                       <div className="space-y-4">
                          <p className="whitespace-pre-line">{activeProduct.description}</p>
                          {activeProduct.features && (
                            <ul className="space-y-2 mt-4">
                              {activeProduct.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <CircleCheck size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                       </div>
                    ) : (
                       <div className="grid grid-cols-1 gap-y-3">
                          {Object.entries(activeProduct.specifications).map(([key, value]) => (
                             <div key={key} className="grid grid-cols-3 border-b border-gray-50 pb-2">
                                <span className="text-gray-500 font-medium">{key}</span>
                                <span className="col-span-2 text-gray-800">{value}</span>
                             </div>
                          ))}
                       </div>
                    )}
                 </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default App;
