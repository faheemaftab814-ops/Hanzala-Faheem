import React, { useState, useEffect } from 'react';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  MapPin,
  Calendar,
  MessageCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { Order, OrderStatus } from '../types';

interface OrderTrackingPageProps {
  initialOrderNumber?: string;
  onNavigate: (page: string) => void;
}

const ORDER_STEPS: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialOrderNumber = '',
  onNavigate,
}) => {
  const { getOrderByNumber, getUserOrders } = useStore();
  const { currentUser } = useAuth();

  const [orderQuery, setOrderQuery] = useState(initialOrderNumber);
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loadingUserOrders, setLoadingUserOrders] = useState(false);

  // If initial order query is provided, auto search
  useEffect(() => {
    if (initialOrderNumber) {
      setOrderQuery(initialOrderNumber);
      handleSearch(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  // Load user's recent orders if logged in
  useEffect(() => {
    if (currentUser) {
      setLoadingUserOrders(true);
      getUserOrders(currentUser.uid)
        .then((orders) => setUserOrders(orders))
        .finally(() => setLoadingUserOrders(false));
    }
  }, [currentUser]);

  const handleSearch = async (query = orderQuery) => {
    if (!query.trim()) return;
    setLoading(true);
    setNotFound(false);
    try {
      const order = await getOrderByNumber(query.trim(), phoneOrEmail.trim());
      if (order) {
        setActiveOrder(order);
      } else {
        setActiveOrder(null);
        setNotFound(true);
      }
    } catch {
      setActiveOrder(null);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'Cancelled') return -1;
    return ORDER_STEPS.indexOf(status);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
          Nationwide Dispatch Tracking
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Track Your HYDROVA Order
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Enter your unique order number (e.g. HYD-12345) to view live courier and packaging status.
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-[#121216] border border-[#222228] rounded-2xl p-6 shadow-xl max-w-2xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Order Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. HYD-28491"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                className="w-full bg-[#18181f] text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#2a2a34] focus:border-[#d4af37] focus:outline-none uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Phone Number or Email (Optional)
              </label>
              <input
                type="text"
                placeholder="03001234567 or email"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                className="w-full bg-[#18181f] text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#2a2a34] focus:border-[#d4af37] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow"
          >
            {loading ? (
              <span>Searching Firestore Records...</span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Track Order Status</span>
              </>
            )}
          </button>
        </form>

        {notFound && (
          <div className="mt-4 p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <span>
              No order found matching &quot;{orderQuery}&quot;. Please verify the order number on your confirmation screen or message our support.
            </span>
          </div>
        )}
      </div>

      {/* Active Order Details & Status Bar */}
      {activeOrder && (
        <div className="bg-[#121216] border border-[#222228] rounded-3xl p-6 sm:p-8 space-y-8 animate-in fade-in">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222228] pb-6">
            <div>
              <div className="text-xs text-gray-400">Order Number:</div>
              <div className="text-2xl font-extrabold text-[#d4af37]">
                {activeOrder.orderNumber}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Placed on: {new Date(activeOrder.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-gray-400">Total Amount (COD):</div>
                <div className="text-xl font-bold text-white">
                  Rs. {activeOrder.finalTotal.toLocaleString()}
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  activeOrder.paymentStatus === 'Paid'
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                    : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                }`}
              >
                {activeOrder.paymentStatus}
              </span>
            </div>
          </div>

          {/* Stepper Progress */}
          {activeOrder.orderStatus === 'Cancelled' ? (
            <div className="p-4 rounded-2xl bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-400 shrink-0" />
              <div>
                <strong className="block text-sm font-bold">Order Cancelled</strong>
                <span>This order was cancelled. Please contact customer care for assistance.</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Delivery Milestones
              </div>

              <div className="relative">
                {/* Horizontal Progress line for desktop */}
                <div className="hidden sm:block absolute top-5 left-6 right-6 h-1 bg-[#22222a] -z-0">
                  <div
                    className="h-full bg-[#d4af37] transition-all duration-500"
                    style={{
                      width: `${(Math.max(0, getStepIndex(activeOrder.orderStatus)) / (ORDER_STEPS.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                  {ORDER_STEPS.map((step, idx) => {
                    const currentIdx = getStepIndex(activeOrder.orderStatus);
                    const isCompleted = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div
                        key={step}
                        className={`flex sm:flex-col items-center gap-3 sm:text-center p-3 sm:p-0 rounded-xl ${
                          isCurrent ? 'bg-[#1a1811] sm:bg-transparent border sm:border-0 border-[#d4af37]/30' : ''
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                            isCompleted
                              ? 'bg-[#d4af37] text-black shadow-[0_0_12px_#d4af37]'
                              : 'bg-[#1c1c22] text-gray-500 border border-[#2c2c36]'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-5 h-5 text-black" /> : idx + 1}
                        </div>
                        <div>
                          <div
                            className={`text-xs font-bold ${
                              isCurrent
                                ? 'text-[#d4af37]'
                                : isCompleted
                                ? 'text-white'
                                : 'text-gray-500'
                            }`}
                          >
                            {step}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            {idx === 0 && 'Recorded in system'}
                            {idx === 1 && 'Call verified'}
                            {idx === 2 && 'Packing tumbler'}
                            {idx === 3 && 'With courier'}
                            {idx === 4 && 'Delivered'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Delivery & Items Snapshot */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#222228]">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Order Items ({activeOrder.items.length})
              </h4>
              <div className="space-y-2">
                {activeOrder.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#17171d] border border-[#22222a] text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white">{item.productName}</div>
                      <div className="text-[11px] text-[#a7843b]">
                        Color: {item.color} • Qty: {item.quantity}
                      </div>
                    </div>
                    <div className="font-bold text-white">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Destination Address
              </h4>
              <div className="bg-[#17171d] border border-[#22222a] rounded-xl p-4 text-xs space-y-1 text-gray-300 leading-relaxed">
                <div className="font-bold text-white">{activeOrder.customerName}</div>
                <div>{activeOrder.phoneNumber}</div>
                <div>{activeOrder.email}</div>
                <div className="text-gray-400 pt-1">
                  {activeOrder.shippingAddress}, {activeOrder.city}
                </div>
              </div>

              {/* WhatsApp Support button for this order */}
              <a
                href={`https://wa.me/923069614050?text=Hi%20HYDROVA,%20I%20am%20inquiring%20about%20Order%20${activeOrder.orderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-[#1e2e1e] text-emerald-400 border border-emerald-900/60 hover:bg-emerald-900/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact Dispatch Support on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* User's Order History if logged in */}
      {currentUser && (
        <div className="pt-8 border-t border-[#1f1f26] space-y-4">
          <h3 className="text-lg font-bold text-white">
            Your Account Order History
          </h3>

          {loadingUserOrders ? (
            <div className="p-6 rounded-2xl bg-[#121216] text-gray-400 text-xs">
              Loading your past orders...
            </div>
          ) : userOrders.length === 0 ? (
            <div className="p-6 rounded-2xl bg-[#121216] border border-[#222228] text-center text-xs text-gray-400">
              You haven&apos;t placed any orders with this account yet.
            </div>
          ) : (
            <div className="space-y-3">
              {userOrders.map((o) => (
                <div
                  key={o.id}
                  onClick={() => {
                    setActiveOrder(o);
                    window.scrollTo({ top: 150, behavior: 'smooth' });
                  }}
                  className="p-4 rounded-2xl bg-[#121216] hover:bg-[#17171e] border border-[#222228] hover:border-[#d4af37]/40 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[#d4af37]">
                        {o.orderNumber}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#221c10] text-[#e6cb85] border border-[#d4af37]/30">
                        {o.orderStatus}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {o.items.length} item(s) • Placed on {new Date(o.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Total (COD)</div>
                      <div className="text-sm font-bold text-white">
                        Rs. {o.finalTotal.toLocaleString()}
                      </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-[#202028] text-gray-300 text-xs hover:text-white font-medium">
                      View Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
