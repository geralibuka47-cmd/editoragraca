
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AIChat from './components/AIChat';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import BookDetailModal from './components/BookDetailModal';

// Pages
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import AboutPage from './pages/AboutPage';
import TeamPage from './pages/TeamPage';
import BlogPage from './pages/BlogPage';
import AdminDashboard from './pages/AdminDashboard';
import ReaderDashboard from './pages/ReaderDashboard';
import AuthPage from './pages/AuthPage';
import CheckoutPage from './pages/CheckoutPage';
import ServicesPage from './pages/ServicesPage';
import PodcastPage from './pages/PodcastPage';
import ContactPage from './pages/ContactPage';

// Data & Types
import { BOOKS as INITIAL_BOOKS } from './constants';
import { Book, CartItem, ViewState, User, Order } from './types';

const App: React.FC = () => {
  const [books] = useState<Book[]>(INITIAL_BOOKS);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Book[]>(() => JSON.parse(localStorage.getItem('editora_graca_wishlist') || '[]'));
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [user, setUser] = useState<User | null>(() => JSON.parse(localStorage.getItem('editora_graca_user') || 'null'));
  const [orders, setOrders] = useState<Order[]>(() => JSON.parse(localStorage.getItem('editora_graca_orders') || '[]'));

  // Checkout State
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('editora_graca_wishlist', JSON.stringify(wishlist));
    localStorage.setItem('editora_graca_orders', JSON.stringify(orders));
    if (user) localStorage.setItem('editora_graca_user', JSON.stringify(user));
    else localStorage.removeItem('editora_graca_user');
  }, [wishlist, orders, user]);

  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (book: Book) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === book.id);
      if (existing) return prev.map(item => item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...book, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const toggleWishlist = (book: Book) => {
    setWishlist(prev => prev.some(b => b.id === book.id) ? prev.filter(b => b.id !== book.id) : [...prev, book]);
  };

  const handleCheckout = () => {
    if (!user) {
      handleNavigate('AUTH');
      setIsCartOpen(false);
      return;
    }
    setCurrentView('CHECKOUT');
    setIsCartOpen(false);
    setCheckoutStep(1);
  };

  const finalizeOrder = () => {
    if (!user) return;
    setIsCheckoutLoading(true);
    setTimeout(() => {
      const newOrder: Order = {
        id: Math.floor(1000 + Math.random() * 9000).toString(),
        customerName: user.name,
        customerEmail: user.email,
        customerId: user.id,
        items: cart.map(i => ({ title: i.title, quantity: i.quantity, price: i.price })),
        total: cart.reduce((acc, i) => acc + (i.price * i.quantity), 0),
        status: 'Pendente',
        date: new Date().toLocaleDateString('pt-AO')
      };
      setOrders(prev => [newOrder, ...prev]);
      setCart([]);
      setIsCheckoutLoading(false);
      setCurrentView('READER_DASHBOARD');
      alert("Encomenda registada! O seu pedido será validado após verificação do comprovativo.");
    }, 2000);
  };

  const renderView = () => {
    switch (currentView) {
      case 'HOME':
        return <HomePage onNavigate={handleNavigate} />;
      case 'CATALOG':
        return (
          <CatalogPage
            books={books}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            addToCart={addToCart}
            setSelectedBook={setSelectedBook}
          />
        );
      case 'ABOUT':
        return <AboutPage />;
      case 'TEAM':
        return <TeamPage />;
      case 'BLOG':
        return <BlogPage />;
      case 'SERVICES':
        return <ServicesPage />;
      case 'PODCAST':
        return <PodcastPage />;
      case 'CONTACT':
        return <ContactPage />;
      case 'READER_DASHBOARD':
        return user ? <ReaderDashboard user={user} orders={orders} wishlist={wishlist} /> : <AuthPage setUser={setUser} handleNavigate={handleNavigate} />;
      case 'ADMIN':
        return <AdminDashboard orders={orders} setOrders={setOrders} />;
      case 'CHECKOUT':
        return (
          <CheckoutPage
            cart={cart}
            checkoutStep={checkoutStep}
            setCheckoutStep={setCheckoutStep}
            isCheckoutLoading={isCheckoutLoading}
            finalizeOrder={finalizeOrder}
          />
        );
      case 'AUTH':
        return <AuthPage setUser={setUser} handleNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent-gold selection:text-white">
      <Navbar
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onNavigate={handleNavigate}
        user={user}
        onLogout={() => { setUser(null); handleNavigate('HOME'); }}
        currentView={currentView}
      />

      <main className="flex-grow">
        {renderView()}
      </main>

      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onAddToCart={addToCart}
          onToggleWishlist={toggleWishlist}
          isInWishlist={wishlist.some(w => w.id === selectedBook.id)}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        setCart={setCart}
        handleCheckout={handleCheckout}
      />

      <Footer />
      <AIChat />
    </div>
  );
};

export default App;
