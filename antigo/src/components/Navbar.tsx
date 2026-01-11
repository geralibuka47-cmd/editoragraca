
import React from 'react';
import { ShoppingBag, BookOpen, User as UserIcon, LogOut, ShieldCheck, ChevronDown, Heart, LayoutDashboard, Settings, Menu, X } from 'lucide-react';
import { User, ViewState } from '../types';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onNavigate: (view: ViewState) => void;
  user: User | null;
  onLogout: () => void;
  currentView: ViewState;
}

const Navbar: React.FC<NavbarProps> = ({ 
    cartCount, 
    wishlistCount, 
    onOpenCart, 
    onOpenWishlist, 
    onNavigate, 
    user, 
    onLogout, 
    currentView 
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = React.useState(false);

  const mainNavItems = [
    { label: 'HOME', view: 'HOME' as ViewState },
    { label: 'LIVRARIA', view: 'CATALOG' as ViewState },
    { label: 'SERVIÇOS', view: 'SERVICES' as ViewState },
  ];

  const moreNavItems = [
    { label: 'PODCAST', view: 'PODCAST' as ViewState },
    { label: 'NOTÍCIAS', view: 'BLOG' as ViewState },
    { label: 'EQUIPA', view: 'TEAM' as ViewState },
    { label: 'SOBRE', view: 'ABOUT' as ViewState },
    { label: 'CONTACTO', view: 'CONTACT' as ViewState },
  ];

  const getUserDashboardView = () => {
    if (!user) return 'AUTH';
    if (user.role === 'adm') return 'ADMIN';
    if (user.role === 'autor') return 'AUTHOR_DASHBOARD';
    return 'READER_DASHBOARD';
  };

  return (
    <nav className="sticky top-0 z-[150] bg-white/95 backdrop-blur-xl py-4 md:py-6 px-4 md:px-6 lg:px-8 border-b border-brand-50">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-4">
        
        {/* Logo */}
        <div 
          className="flex items-center gap-2 md:gap-3 cursor-pointer group shrink-0" 
          onClick={() => onNavigate('HOME')}
        >
          <div className="p-1.5 md:p-2 bg-brand-900 rounded-lg group-hover:bg-accent-gold transition-all">
            <BookOpen className="h-4 w-4 md:h-6 md:w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg md:text-2xl font-bold text-brand-900 tracking-tight leading-none">Editora Graça</span>
            <span className="text-[6px] md:text-[7px] uppercase tracking-[0.3em] md:tracking-[0.5em] text-accent-gold font-bold">Malanje · Angola</span>
          </div>
        </div>

        {/* Floating Capsule Menu (Hidden labels on very small screens, scrollable) */}
        <div className="hidden md:flex bg-white border border-brand-100 rounded-full px-2 py-1.5 shadow-lg items-center gap-1">
          {mainNavItems.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`
                  px-4 lg:px-5 py-2.5 text-[8px] lg:text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-full whitespace-nowrap
                  ${isActive 
                    ? 'bg-brand-900 text-white shadow-lg' 
                    : 'text-gray-500 hover:text-brand-900 hover:bg-brand-50'}
                `}
              >
                {item.label}
              </button>
            );
          })}
          
          <div className="relative">
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className={`
                px-4 lg:px-5 py-2.5 text-[8px] lg:text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-full flex items-center gap-2 whitespace-nowrap
                ${moreNavItems.some(i => i.view === currentView) ? 'bg-brand-50 text-brand-900' : 'text-gray-500 hover:text-brand-900'}
              `}
            >
              MAIS <ChevronDown size={12} className={`transition-transform ${isMoreMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isMoreMenuOpen && (
              <>
                <div className="fixed inset-0 z-[-1]" onClick={() => setIsMoreMenuOpen(false)}></div>
                <div className="absolute top-full right-0 mt-4 w-48 bg-white border border-brand-100 shadow-2xl rounded-2xl py-3 animate-slide-up">
                  {moreNavItems.map((item) => (
                    <button
                      key={item.view}
                      onClick={() => { onNavigate(item.view); setIsMoreMenuOpen(false); }}
                      className={`w-full text-left px-6 py-3 text-[9px] font-bold uppercase tracking-widest transition-colors ${currentView === item.view ? 'text-accent-gold bg-brand-50' : 'text-gray-500 hover:text-brand-900 hover:bg-brand-50'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* User Actions & Mobile Toggle */}
        <div className="flex items-center space-x-2 md:space-x-3 shrink-0">
          <button 
            className="relative p-2 md:p-3 text-brand-900 hover:text-accent-gold transition-all bg-brand-50 rounded-full" 
            onClick={onOpenWishlist}
            title="Favoritos"
          >
            <Heart className={`h-4 w-4 md:h-5 md:w-5 ${wishlistCount > 0 ? 'fill-accent-gold text-accent-gold' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent-gold text-white text-[8px] font-bold rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center border-2 border-white shadow-md">
                {wishlistCount}
              </span>
            )}
          </button>

          <button 
            className="relative p-2 md:p-3 text-brand-900 hover:text-accent-gold transition-all bg-brand-50 rounded-full" 
            onClick={onOpenCart}
            title="Carrinho"
          >
            <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-900 text-white text-[8px] font-bold rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center border-2 border-white shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          <div className="relative">
            {user ? (
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 bg-brand-50 rounded-full group transition-all hover:bg-brand-100"
              >
                <div className="w-7 h-7 md:w-8 md:h-8 bg-brand-900 text-white rounded-full flex items-center justify-center group-hover:bg-accent-gold transition-all font-bold text-[10px] uppercase">
                  {user.name.charAt(0)}
                </div>
              </button>
            ) : (
              <button 
                onClick={() => onNavigate('AUTH')}
                className="hidden sm:block px-4 md:px-6 py-2 md:py-3 bg-brand-900 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-accent-gold transition-all rounded-full shadow-md"
              >
                Entrar
              </button>
            )}

            {isUserMenuOpen && user && (
              <>
                <div className="fixed inset-0 z-[-1]" onClick={() => setIsUserMenuOpen(false)}></div>
                <div className="absolute right-0 mt-4 w-52 md:w-60 bg-white border border-brand-100 shadow-2xl rounded-2xl py-4 animate-slide-up z-[200]">
                  <div className="px-6 py-4 border-b border-brand-50 mb-2">
                    <p className="font-serif font-bold text-brand-900 truncate text-sm">{user.name}</p>
                    <p className="text-[8px] uppercase tracking-widest text-accent-gold font-bold">{user.role}</p>
                  </div>
                  
                  <button onClick={() => { onNavigate(getUserDashboardView()); setIsUserMenuOpen(false); }} className="w-full text-left px-6 py-3 text-[9px] md:text-[10px] font-bold text-gray-500 hover:text-brand-900 hover:bg-brand-50 flex items-center gap-3 uppercase tracking-widest">
                    {user.role === 'adm' ? <ShieldCheck className="h-4 w-4" /> : <LayoutDashboard className="h-4 w-4" />} 
                    Dashboard
                  </button>

                  <button onClick={() => { onLogout(); setIsUserMenuOpen(false); }} className="w-full text-left px-6 py-3 text-[9px] md:text-[10px] font-bold text-red-500 hover:bg-red-50 flex items-center gap-3 uppercase tracking-widest">
                    <LogOut className="h-4 w-4" /> Sair
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className="md:hidden p-2 text-brand-900 bg-brand-50 rounded-full"
          >
            {isMoreMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMoreMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[73px] bg-white border-b border-brand-100 shadow-2xl py-6 px-6 animate-slide-up max-h-[70vh] overflow-y-auto">
          <div className="flex flex-col gap-4">
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-2">Navegação</p>
            {[...mainNavItems, ...moreNavItems].map((item) => (
              <button
                key={item.view}
                onClick={() => { onNavigate(item.view); setIsMoreMenuOpen(false); }}
                className={`text-left py-2 text-[10px] font-bold uppercase tracking-widest border-b border-brand-50 ${currentView === item.view ? 'text-accent-gold' : 'text-brand-900'}`}
              >
                {item.label}
              </button>
            ))}
            {!user && (
              <button 
                onClick={() => { onNavigate('AUTH'); setIsMoreMenuOpen(false); }}
                className="mt-4 w-full py-4 bg-brand-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl"
              >
                Iniciar Sessão
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
