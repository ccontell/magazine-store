
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
import { X, Minus, Plus, Trash2, ArrowRight, CircleCheck, Smartphone, Tv, Laptop, Sofa, Snowflake, ShoppingCart, Sparkles, Tag, ChevronLeft, ChevronRight, Gamepad2, Dumbbell, Shirt, CarFront, SprayCan, Heart, Filter, Menu, Grid, Circle, Package, Clock, Calendar, Truck, ShieldCheck, Award, CreditCard, Zap } from 'lucide-react';
import { generateProductSummary } from './services/geminiService';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const App: React.FC = () => {
  // --- Global Product State (Replaces static MOCK_PRODUCTS usage) ---
  const [products, setProducts] = useState<Product[]>(() => {
    // Try to load from localStorage first
    const saved = localStorage.getItem('magazine_products');
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });

  // Persist products when changed
  useEffect(() => {
    localStorage.setItem('magazine_products', JSON.stringify(products));
  }, [products]);

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
     const product = products.find(p => p.id === productId);
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

  const handleGoToAdmin = () => {
    if (user?.role === 'admin') {
      setViewMode('admin');
    }
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
          const product = products.find(p => p.id === randomId);
          
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
  }, [wishlist, recentlyViewed, products]);


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
    let result = products.filter(product => {
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

  }, [products, selectedCategory, selectedBrand, searchTerm, sortBy, onlyDeals]);

  // --- Wishlist View Logic ---
  const wishlistProducts = useMemo(() => {
    return products.filter(p => wishlist.includes(p.id));
  }, [wishlist, products]);

  // --- Highlighted Deals Logic (20% to 60% OFF) ---
  const highlightedDeals = useMemo(() => {
    return products.filter(p => {
      if (!p.originalPrice) return false;
      const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
      return discount >= 20 && discount <= 60;
    }).slice(0, 10); // Limit to top 10 to rotate
  }, [products]);

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
            products={products} // Pass real state
            onUpdateProducts={setProducts} // Pass updater function
            orders={orders} 
            registeredUsers={registeredUsers} 
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
                <aside className="hidden lg:flex flex-col w-64 sticky top-24 h-[calc(100vh-100px)] bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex-shrink-0">
                   <div className="p-4 border-b border-gray-50 mb-2 flex-shrink-0">
                      <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                        <Grid size={20} className="text-blue-600" />
                        Produtos
                      </h2>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar min-h-0 flex flex-col gap-1">
                     {CATEGORIES.map(cat => (
                       <div key={cat} className="flex flex-col flex-shrink-0">
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
                   
                   <div className="mt-2 p-4 bg-gray-50 rounded-lg text-xs text-gray-500 border border-gray-100 text-center mx-2 flex-shrink-0">
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

                     {/* Right Side: Results Count & Deals Toggle */}
                     <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setOnlyDeals(!onlyDeals)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition border shadow-sm ${onlyDeals ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                        >
                           <Zap size={16} fill={onlyDeals ? "currentColor" : "none"} />
                           Apenas Ofertas
                        </button>
                        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm w-fit">
                           <span className="font-bold text-gray-900">{filteredProducts.length}</span> resultados
                        </div>
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
          
          {/* Other views... */}
          {/* Wishlist and Orders views remain largely unchanged except they now rely on 'products' state instead of MOCK_PRODUCTS for wishlist mapping */}
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
