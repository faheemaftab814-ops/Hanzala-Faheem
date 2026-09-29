import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  ArrowLeft,
  AlertCircle,
  Lock,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  FileText,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';

interface CheckoutPageProps {
  onBack: () => void;
  onOrderSuccess: (order: Order) => void;
}

const PAKISTAN_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Other City',
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBack, onOrderSuccess }) => {
  const { cart, subtotal, clearCart } = useCart();
  const { settings, createOrder } = useStore();
  const { currentUser, userProfile } = useAuth();

  const [fullName, setFullName] = useState(userProfile?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(userProfile?.phone || '');
  const [email, setEmail] = useState(userProfile?.email || currentUser?.email || '');
  const [city, setCity] = useState(userProfile?.city || 'Lahore');
  const [customCity, setCustomCity] = useState('');
  const [shippingAddress, setShippingAddress] = useState(userProfile?.address || '');
  const [orderNotes, setOrderNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const freeThreshold = settings.freeShippingThreshold || 5000;
  const shippingCharges = subtotal >= freeThreshold ? 0 : settings.shippingCharges;
  const finalTotal = subtotal + shippingCharges;

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Your Cart is Empty</h2>
        <p className="text-sm text-gray-400">
          Please add items to your cart before proceeding to checkout.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl bg-[#221c10] text-[#d4af37] border border-[#d4af37]/40 text-xs font-semibold hover:bg-[#d4af37] hover:text-black"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Form field validation
    if (!fullName.trim() || fullName.trim().length < 3) {
      setErrorMsg('Please enter your valid full name.');
      return;
    }

    const cleanPhone = phoneNumber.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid Pakistani contact phone number (e.g. 03001234567).');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please provide a valid email address for order notifications.');
      return;
    }

    const resolvedCity = city === 'Other City' ? customCity.trim() : city;
    if (!resolvedCity) {
      setErrorMsg('Please specify your delivery city.');
      return;
    }

    if (!shippingAddress.trim() || shippingAddress.trim().length < 8) {
      setErrorMsg('Please provide your complete shipping address (House #, Street, Area).');
      return;
    }

    setLoading(true);

    try {
      const itemsPayload = cart.map((item) => ({
        productId: item.productId,
        color: item.selectedColor,
        quantity: item.quantity,
      }));

      const newOrder = await createOrder(
        {
          fullName: fullName.trim(),
          phoneNumber: cleanPhone,
          email: email.trim(),
          city: resolvedCity,
          shippingAddress: shippingAddress.trim(),
          orderNotes: orderNotes.trim(),
          customerId: currentUser?.uid || 'guest',
        },
        itemsPayload
      );

      clearCart();
      onOrderSuccess(newOrder);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order. Please review your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Shopping</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Form Column */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
              Checkout Details
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Cash on Delivery (COD) Checkout
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Pay in cash directly to the courier upon delivery at your doorstep anywhere in Pakistan.
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
              <div>
                <strong className="block font-bold">Checkout Notice:</strong>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmitOrder} className="space-y-5">
            {/* Contact Information */}
            <div className="bg-[#121216] border border-[#222228] rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>1. Contact & Customer Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Faheem Aftab"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#17171e] text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#282834] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Mobile Number (For Courier Verification) *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="03001234567 or +923069614050"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-[#17171e] text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#282834] focus:border-[#d4af37] focus:outline-none"
                    />
                    <Phone className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Email Address (For Confirmation Receipt) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#17171e] text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#282834] focus:border-[#d4af37] focus:outline-none"
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-[#121216] border border-[#222228] rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>2. Delivery Address in Pakistan</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    City *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#17171e] text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#282834] focus:border-[#d4af37] focus:outline-none"
                  >
                    {PAKISTAN_CITIES.map((c) => (
                      <option key={c} value={c} className="bg-[#17171e] text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {city === 'Other City' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Specify City Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter city"
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      className="w-full bg-[#17171e] text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#282834] focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Complete Street Address (House/Apartment #, Sector, Area) *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. House 42, Street 8, Phase 5, DHA, near main market"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full bg-[#17171e] text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#282834] focus:border-[#d4af37] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Order Notes (Optional Landmark or Instructions)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Please deliver between 2pm to 6pm"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full bg-[#17171e] text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#282834] focus:border-[#d4af37] focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Method Section: Cash on Delivery */}
            <div className="bg-[#121216] border border-[#222228] rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span>3. Payment Method</span>
              </h3>

              <div className="p-4 rounded-xl bg-[#1b1912] border-2 border-[#d4af37] flex items-start gap-4">
                <div className="w-5 h-5 rounded-full bg-[#d4af37] text-black flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-black" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm flex items-center gap-2">
                    <span>Cash on Delivery (COD)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#d4af37] text-black font-extrabold uppercase">
                      Default
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    Zero prepayment or credit card required. You pay the courier delivery person in cash upon physical arrival of your HYDROVA package.
                  </p>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl gold-gradient-bg text-black font-extrabold text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Verifying & Placing Order...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Place Cash on Delivery Order • Rs. {finalTotal.toLocaleString()}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Summary Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#121216] border border-[#222228] rounded-2xl p-6 sticky top-28 space-y-5">
            <h3 className="font-bold text-base text-white border-b border-[#222228] pb-3">
              Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
            </h3>

            {/* Items */}
            <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedColor}`}
                  className="flex items-center gap-3 p-2 rounded-xl bg-[#17171d] border border-[#23232c]"
                >
                  <div className="w-14 h-14 bg-[#202028] rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1">
                    <img
                      src={item.product.images?.[0] || ''}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-semibold text-white truncate">
                      {item.product.name}
                    </h5>
                    <div className="text-[11px] text-[#a7843b]">
                      Color: {item.selectedColor} • Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="text-xs font-bold text-white shrink-0">
                    Rs. {(item.unitPrice * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculation */}
            <div className="space-y-2 pt-3 border-t border-[#222228] text-xs text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-medium">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Nationwide Shipping</span>
                <span>
                  {shippingCharges === 0 ? (
                    <span className="text-emerald-400 font-bold">FREE Delivery</span>
                  ) : (
                    `Rs. ${shippingCharges}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-[#222228]">
                <span>Total Amount (PKR)</span>
                <span className="text-[#d4af37]">Rs. {finalTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="pt-2 text-[11px] text-gray-400 space-y-2 border-t border-[#222228]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>100% Guaranteed 18/8 Stainless Steel Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Courier delivery in 2-4 business days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
