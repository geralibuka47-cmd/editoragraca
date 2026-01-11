
import React, { useState, useEffect } from 'react';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
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
import { Book, CartItem, ViewState, User, Order } from './types';

// Appwrite Services
import { subscribeToAuthChanges, logout } from './services/authService';
import { getBooks, getOrders, createOrder } from './services/dataService';
import { client } from './services/appwrite';

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Book[]>(() => JSON.parse(localStorage.getItem('editora_graca_wishlist') || '[]'));
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Checkout State
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  // Sync Auth State
  useEffect(() => {
    // Ping Appwrite to verify setup
    client.ping()
      .then(() => console.log('Appwrite connection verified'))
      .catch((err) => console.error('Appwrite connection failed:', err));

    const unsubscribe = subscribeToAuthChanges((u: User | null) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Initial Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedBooks, fetchedOrders] = await Promise.all([
          getBooks(),
          user ? getOrders(user.role === 'adm' ? undefined : user.id) : Promise.resolve([])
        ]);
        setBooks(fetchedBooks);
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    localStorage.setItem('editora_graca_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (book: Book) => {
    setCart((prev: CartItem[]) => {
      const existing = prev.find((item: CartItem) => item.id === book.id);
      if (existing) return prev.map((item: CartItem) => item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...book, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const toggleWishlist = (book: Book) => {
    setWishlist((prev: Book[]) => prev.some((b: Book) => b.id === book.id) ? prev.filter((b: Book) => b.id !== book.id) : [...prev, book]);
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

  const finalizeOrder = async () => {
    if (!user) return;
    setIsCheckoutLoading(true);
    try {
      const orderData: Omit<Order, 'id'> = {
        customerName: user.name,
        customerEmail: user.email,
        customerId: user.id,
        items: cart.map((i: CartItem) => ({ title: i.title, quantity: i.quantity, price: i.price })),
        total: cart.reduce((acc: number, i: CartItem) => acc + (i.price * i.quantity), 0),
        status: 'Pendente',
        date: new Date().toLocaleDateString('pt-AO')
      };

      const orderId = await createOrder(orderData);
      const newOrder: Order = { ...orderData, id: orderId };

      setOrders((prev: Order[]) => [newOrder, ...prev]);
      setCart([]);
      setIsCheckoutLoading(false);
      setCurrentView('READER_DASHBOARD');
      alert("Encomenda registada! O seu pedido será validado após verificação do comprovativo.");
    } catch (error) {
      console.error("Error creating order:", error);
      setIsCheckoutLoading(false);
      alert("Erro ao registar encomenda. Por favor tente novamente.");
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'HOME': return (
        <HomePage
          onNavigate={handleNavigate}
          books={books}
          addToCart={addToCart}
          toggleWishlist={toggleWishlist}
          wishlist={wishlist}
          setSelectedBook={setSelectedBook}
        />
      );
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
        return (
          <HomePage
            onNavigate={handleNavigate}
            books={books}
            addToCart={addToCart}
            toggleWishlist={toggleWishlist}
            wishlist={wishlist}
            setSelectedBook={setSelectedBook}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent-gold selection:text-white">
      <Analytics />
      <SpeedInsights />
      <Navbar
        cartCount={cart.reduce((a: number, b: CartItem) => a + b.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onNavigate={handleNavigate}
        user={user}
        onLogout={() => { logout(); handleNavigate('HOME'); }}
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
          isInWishlist={wishlist.some((w: Book) => w.id === (selectedBook as Book).id)}
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
