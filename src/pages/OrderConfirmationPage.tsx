import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  MessageCircle,
  Clock,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Order } from '../types';

interface OrderConfirmationPageProps {
  order: Order;
  onNavigate: (page: string, param?: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  onNavigate,
}) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FFF3D6', '#AA8238', '#FFFFFF'],
      });
    } catch {
      // Ignore if canvas is unavailable
    }
  }, []);

  const whatsappMessage = `Hi HYDROVA, I just placed Cash on Delivery Order #${order.orderNumber} for Rs. ${order.finalTotal.toLocaleString()}. Please confirm dispatch.`;
  const whatsappUrl = `https://wa.me/923069614050?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-in fade-in zoom-in-95 duration-300">
      {/* Success Banner */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-[#1e1c14] border-2 border-[#d4af37] text-[#d4af37] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(212,175,55,0.3)]">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
          Order Successfully Placed
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Thank You, {order.customerName.split(' ')[0]}!
        </h1>
        <p className="text-sm text-gray-400 max-w-md mx-auto">
          Your order has been recorded in our dispatch system. We will contact you via SMS / WhatsApp before dispatching your package.
        </p>

        {/* Order Number Capsule */}
        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[#141418] border border-[#2b2b36] shadow">
          <span className="text-xs text-gray-400">Order Number:</span>
          <strong className="text-base font-extrabold text-[#d4af37] tracking-wider">
            {order.orderNumber}
          </strong>
        </div>
      </div>

      {/* Main Order Details Card */}
      <div className="bg-[#121216] border border-[#222228] rounded-3xl p-6 sm:p-8 space-y-8">
        {/* Status Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-[#222228] pb-6 text-xs">
          <div className="p-3.5 rounded-xl bg-[#18181e] border border-[#272732] space-y-1">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#d4af37]" /> Order Status
            </span>
            <div className="text-sm font-bold text-amber-400">{order.orderStatus}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#18181e] border border-[#272732] space-y-1">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#d4af37]" /> Payment Method
            </span>
            <div className="text-sm font-bold text-white">
              Cash on Delivery (Unpaid)
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#18181e] border border-[#272732] space-y-1">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#d4af37]" /> Placed On
            </span>
            <div className="text-sm font-bold text-white">
              {new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Ordered Tumblers ({order.items.reduce((s, i) => s + i.quantity, 0)})
          </h3>

          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#17171e] border border-[#22222a]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-[#202028] p-1 flex items-center justify-center shrink-0">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{item.productName}</h4>
                    <span className="text-xs text-[#a7843b]">
                      Color: {item.color} • Qty: {item.quantity}
                    </span>
                  </div>
                </div>

                <div className="text-sm font-bold text-white">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown & Delivery Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[#222228]">
          {/* Shipping Address */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37]" /> Delivery Destination
            </h4>
            <div className="text-gray-300 leading-relaxed bg-[#17171e] p-4 rounded-xl border border-[#22222a] space-y-1">
              <div className="font-bold text-white">{order.customerName}</div>
              <div>{order.phoneNumber}</div>
              <div>{order.email}</div>
              <div className="pt-1 text-gray-400">
                {order.shippingAddress}, {order.city}
              </div>
              {order.orderNotes && (
                <div className="pt-2 text-[11px] text-[#a7843b] italic">
                  Note: &quot;{order.orderNotes}&quot;
                </div>
              )}
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="space-y-3 text-xs bg-[#17171e] p-4 rounded-xl border border-[#22222a]">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span className="text-white font-medium">Rs. {order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Nationwide Shipping</span>
              <span>
                {order.shippingCharges === 0 ? (
                  <span className="text-emerald-400 font-semibold">FREE</span>
                ) : (
                  `Rs. ${order.shippingCharges}`
                )}
              </span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-[#252530]">
              <span>Final Total (Due on Delivery)</span>
              <span className="text-[#d4af37]">Rs. {order.finalTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold flex items-center justify-center gap-2 shadow"
          >
            <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
            <span>Confirm Order on WhatsApp</span>
          </a>

          <button
            onClick={() => onNavigate('track', order.orderNumber)}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#221c10] text-[#d4af37] border border-[#d4af37]/40 hover:bg-[#d4af37] hover:text-black text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <span>Live Order Tracking</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onNavigate('shop')}
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#17171d] text-gray-300 hover:text-white text-xs font-semibold border border-[#2b2b36]"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
