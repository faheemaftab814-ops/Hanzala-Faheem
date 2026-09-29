import React from 'react';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  phoneNumber = '+923069614050',
  defaultMessage = 'Hi HYDROVA, I am interested in your stainless steel tumblers and have a question.',
}) => {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 group flex items-center gap-3">
      {/* Tooltip */}
      <span className="hidden sm:inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-[#141416] text-[#E5E7EB] border border-[#2a2a2e] shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        Chat with us on WhatsApp
      </span>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact HYDROVA on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-105 active:scale-95 transition-transform duration-200"
      >
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />
        <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
      </a>
    </div>
  );
};
