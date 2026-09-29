import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  Menu,
  X,
  ShieldCheck,
  Truck,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string, param?: string) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, onOpenSearch }) => {
  const { currentUser, userProfile, isAdmin, logout } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const { settings } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'Shop', id: 'shop' },
    { label: 'About Us', id: 'about' },
    { label: 'Contact', id: 'contact' },
    { label: 'Track Order', id: 'track' },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0b0c]/95 backdrop-blur-md border-b border-[#232328]">
      {/* 1. Announcement Bar */}
      <div className="bg-[#121215] text-[#e6cb85] text-xs py-2 px-4 border-b border-[#232328]/60 flex items-center justify-center gap-2 font-medium tracking-wide">
        <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
        <span className="truncate text-center">
          {settings.announcementText || 'Nationwide Cash on Delivery (COD) | Free Delivery Over Rs. 5,000'}
        </span>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#9ca3af] hover:text-[#d4af37] focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* 3. HYDROVA Text Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="cursor-pointer select-none flex items-center gap-2 group"
        >
          <div className="flex flex-col">
            <span className="font-extrabold text-2xl sm:text-3xl tracking-[0.25em] text-white group-hover:text-white transition-colors duration-200">
              HYDROVA
            </span>
            <span className="text-[9px] tracking-[0.4em] uppercase text-[#a7843b] -mt-1 font-semibold">
              Drinkware
            </span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] shadow-[0_0_8px_#d4af37] group-hover:scale-125 transition-transform" />
        </div>

        {/* 4. Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`relative py-1 transition-colors duration-200 ${
                currentPage === link.id
                  ? 'text-[#d4af37] font-semibold'
                  : 'text-[#d1d5db] hover:text-white'
              }`}
            >
              {link.label}
              {currentPage === link.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#d4af37] shadow-[0_0_6px_#d4af37]" />
              )}
            </button>
          ))}

          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#221c10] text-[#d4af37] border border-[#d4af37]/40 hover:bg-[#d4af37]/20 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Portal
            </button>
          )}
        </nav>

        {/* 5. Utility Icons */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search Icon */}
          <button
            onClick={onOpenSearch}
            className="p-2.5 rounded-full text-[#9ca3af] hover:text-white hover:bg-[#1f1f23] transition-colors"
            aria-label="Search tumblers"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Account Icon */}
          <button
            onClick={() => handleNavClick(currentUser ? 'account' : 'auth')}
            className="relative p-2.5 rounded-full text-[#9ca3af] hover:text-white hover:bg-[#1f1f23] transition-colors flex items-center gap-2"
            aria-label="Customer Account"
            title={currentUser ? `Signed in as ${userProfile?.name || currentUser.email}` : 'Customer Login'}
          >
            <UserIcon className="w-5 h-5" />
            {currentUser && (
              <span className="hidden xl:inline text-xs text-[#e5e7eb] max-w-[100px] truncate">
                {userProfile?.name?.split(' ')[0] || 'Account'}
              </span>
            )}
          </button>

          {/* Shopping Cart Icon with Item Count */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-full text-[#9ca3af] hover:text-white hover:bg-[#1f1f23] transition-colors group"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 group-hover:text-[#d4af37] transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold bg-[#d4af37] text-black shadow-md">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#101014] border-b border-[#232328] px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                  currentPage === link.id
                    ? 'bg-[#1e1c15] text-[#d4af37] border-l-2 border-[#d4af37]'
                    : 'text-[#d1d5db] hover:bg-[#17171c]'
                }`}
              >
                {link.label}
              </button>
            ))}

            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className="text-left px-3 py-2.5 rounded-lg text-sm font-semibold bg-[#221c10] text-[#d4af37] border border-[#d4af37]/30 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Dashboard
              </button>
            )}

            <div className="pt-2 border-t border-[#232328] flex items-center justify-between">
              {currentUser ? (
                <div className="flex items-center justify-between w-full">
                  <button
                    onClick={() => handleNavClick('account')}
                    className="text-sm font-medium text-[#d1d5db] hover:text-white"
                  >
                    My Account ({userProfile?.name || currentUser.email})
                  </button>
                  <button
                    onClick={() => logout()}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNavClick('auth')}
                  className="w-full text-center py-2.5 rounded-lg bg-[#d4af37] text-black font-semibold text-sm hover:bg-[#e6cb85]"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
