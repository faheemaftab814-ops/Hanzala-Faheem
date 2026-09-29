import React, { useState } from 'react';
import { Mail, Phone, MapPin, Shield, RefreshCw, Truck, ArrowRight, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useStore();
  const [activePolicy, setActivePolicy] = useState<'return' | 'shipping' | 'cod' | null>(null);

  const policyContent = {
    return: {
      title: '7-Day Return & Replacement Warranty',
      text: settings.returnPolicy || 'We offer a 7-day hassle-free replacement warranty for manufacturing defects or shipping damages. Tumblers must be unused and reported via WhatsApp (+923069614050) with unboxing media.',
    },
    shipping: {
      title: 'Shipping & Nationwide Delivery',
      text: settings.shippingPolicy || 'We dispatch orders within 24 hours. Delivery across all major cities of Pakistan (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, and beyond) takes 2 to 4 business days.',
    },
    cod: {
      title: 'Cash on Delivery (COD) Terms',
      text: 'All orders qualify for Cash on Delivery without requiring credit cards or pre-payments. Please ensure your phone number is active for verification by our logistics partner upon dispatch.',
    },
  };

  return (
    <footer className="bg-[#08080a] border-t border-[#1f1f24] text-[#9ca3af] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-[0.25em] text-white">
                HYDROVA
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] shadow-[0_0_6px_#d4af37]" />
            </div>
            <p className="text-sm text-[#9ca3af] leading-relaxed">
              Premium double-wall stainless steel drinkware designed for modern lifestyle hydration. Engineered to preserve ice-cold refreshment and piping hot warmth for hours.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-[#d4af37]">
              <span className="inline-flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> Nationwide COD
              </span>
              <span className="text-[#3a3a42]">•</span>
              <span className="inline-flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> 18/8 Steel
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Explore Store
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('shop')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  All Tumblers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  About HYDROVA
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Contact & Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('track')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Track Your Order
                </button>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => setActivePolicy('return')}
                  className="hover:text-[#d4af37] transition-colors text-left"
                >
                  Return & Replacement Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicy('shipping')}
                  className="hover:text-[#d4af37] transition-colors text-left"
                >
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicy('cod')}
                  className="hover:text-[#d4af37] transition-colors text-left"
                >
                  Cash on Delivery Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Official Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-[#6b7280]">WhatsApp & Calls:</span>
                  <a
                    href="https://wa.me/923069614050"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#d4af37] transition-colors font-medium"
                  >
                    +92 306 9614050
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-[#6b7280]">Official Email:</span>
                  <a
                    href="mailto:hanzalafaheem85@gmail.com"
                    className="text-white hover:text-[#d4af37] transition-colors font-medium break-all"
                  >
                    hanzalafaheem85@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-[#6b7280]">Location:</span>
                  <span className="text-white">Pakistan (Nationwide Courier Dispatch)</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#1a1a20] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6b7280]">
          <p>© {new Date().getFullYear()} HYDROVA. All rights reserved. Designed for everyday hydration.</p>
          <p className="flex items-center gap-2">
            <span>Payment: Cash on Delivery (COD)</span>
            <span className="text-[#374151]">|</span>
            <span>Currency: PKR (Rs.)</span>
          </p>
        </div>
      </div>

      {/* Policy Modal */}
      {activePolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121215] border border-[#2a2a30] rounded-2xl max-w-lg w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setActivePolicy(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-[#202026]"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-4 pr-8">
              {policyContent[activePolicy].title}
            </h3>
            <p className="text-sm text-[#d1d5db] leading-relaxed whitespace-pre-line mb-6">
              {policyContent[activePolicy].text}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setActivePolicy(null)}
                className="px-5 py-2 rounded-lg bg-[#221c10] text-[#d4af37] border border-[#d4af37]/40 hover:bg-[#d4af37]/20 font-medium text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
