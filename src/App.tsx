/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AuthPage } from './pages/AuthPage';
import { AccountPage } from './pages/AccountPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { Order } from './types';

function MainApp() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, selectedProductId]);

  const handleNavigate = (page: string, param?: string) => {
    if (page === 'track' && param) {
      setTrackingOrderNumber(param);
    }
    setCurrentPage(page);
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentPage('product');
  };

  const handleOrderSuccess = (order: Order) => {
    setLastPlacedOrder(order);
    setCurrentPage('order-confirmation');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0b0c] text-[#f3f4f6]">
      {/* Header with Announcement, Logo, and Nav */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'shop' && (
          <ShopPage
            onSelectProduct={handleSelectProduct}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'product' && selectedProductId && (
          <ProductDetailPage
            productId={selectedProductId}
            onBack={() => setCurrentPage('shop')}
            onCheckout={() => setCurrentPage('checkout')}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            onBack={() => setCurrentPage('shop')}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {currentPage === 'order-confirmation' && lastPlacedOrder && (
          <OrderConfirmationPage
            order={lastPlacedOrder}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'track' && (
          <OrderTrackingPage
            initialOrderNumber={trackingOrderNumber}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage onNavigateShop={() => setCurrentPage('shop')} />
        )}

        {currentPage === 'contact' && <ContactPage />}

        {currentPage === 'auth' && (
          <AuthPage
            onSuccess={() => setCurrentPage('account')}
            onNavigateHome={() => setCurrentPage('home')}
          />
        )}

        {currentPage === 'account' && (
          <AccountPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'admin' && (
          <AdminDashboard
            onNavigateHome={() => setCurrentPage('home')}
            onViewProduct={(id) => {
              setSelectedProductId(id);
              setCurrentPage('product');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Modals & Floating Tools */}
      <CartDrawer onCheckout={() => setCurrentPage('checkout')} />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={handleSelectProduct}
      />
      <FloatingWhatsApp
        phoneNumber="+923069614050"
        defaultMessage="Hi HYDROVA, I am interested in your stainless steel tumblers and have a question."
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
