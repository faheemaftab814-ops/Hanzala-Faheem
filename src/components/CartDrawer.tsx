import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

interface CartDrawerProps {
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const { cart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, subtotal, totalItems } =
    useCart();
  const { settings } = useStore();

  if (!isCartOpen) return null;

  const freeThreshold = settings.freeShippingThreshold || 5000;
  const differenceToFree = Math.max(0, freeThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
  const estimatedShipping = subtotal >= freeThreshold || subtotal === 0 ? 0 : settings.shippingCharges;
  const finalTotal = subtotal + estimatedShipping;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    onCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer content */}
      <div className="relative w-full max-w-md bg-[#101014] text-white h-full flex flex-col shadow-2xl border-l border-[#222228] z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-[#222228] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
            <h3 className="font-bold text-lg text-white">Your Cart ({totalItems})</h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-[#1a1a20] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress bar */}
        <div className="px-5 py-3 bg-[#16161b] border-b border-[#222228] text-xs">
          {differenceToFree > 0 ? (
            <p className="text-[#d1d5db] mb-1.5">
              Add <span className="text-[#d4af37] font-bold">Rs. {differenceToFree.toLocaleString()}</span> more for <strong className="text-white">FREE Nationwide Delivery</strong>
            </p>
          ) : (
            <p className="text-emerald-400 font-semibold mb-1.5 flex items-center gap-1">
              🎉 Congratulations! You have unlocked FREE Nationwide Delivery!
            </p>
          )}
          <div className="w-full h-1.5 bg-[#25252e] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#d4af37] to-[#e6cb85] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#18181f] flex items-center justify-center text-[#d4af37]">
                <ShoppingBag className="w-8 h-8 opacity-60" />
              </div>
              <p className="text-base font-medium text-white">Your cart is empty</p>
              <p className="text-xs text-gray-400 max-w-xs">
                Explore our premium stainless steel tumblers engineered for maximum temperature retention.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-6 py-2.5 rounded-xl bg-[#221c10] text-[#d4af37] border border-[#d4af37]/40 hover:bg-[#d4af37] hover:text-black transition-all text-xs font-semibold"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.productId}-${item.selectedColor}`}
                className="flex gap-4 p-3 bg-[#15151a] rounded-xl border border-[#212128]"
              >
                <div className="w-20 h-20 bg-[#1c1c24] rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1">
                  <img
                    src={item.product.images?.[0] || ''}
                    alt={item.product.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-semibold text-sm text-white line-clamp-1">
                        {item.product.name}
                      </h4>
                      <div className="text-xs text-[#d4af37] mt-0.5">
                        Color: <span className="text-gray-300 font-medium">{item.selectedColor}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId, item.selectedColor)}
                      className="text-gray-500 hover:text-red-400 p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-[#2c2c36] rounded-lg overflow-hidden bg-[#1c1c22]">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.selectedColor, item.quantity - 1)
                        }
                        className="px-2 py-1 text-gray-400 hover:text-white hover:bg-[#282832]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-semibold text-white">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.selectedColor, item.quantity + 1)
                        }
                        className="px-2 py-1 text-gray-400 hover:text-white hover:bg-[#282832]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-sm font-bold text-white">
                      Rs. {(item.unitPrice * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#222228] bg-[#141418] space-y-3">
            <div className="space-y-1.5 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-medium">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-white font-medium">
                  {estimatedShipping === 0 ? (
                    <span className="text-emerald-400 font-semibold">FREE</span>
                  ) : (
                    `Rs. ${estimatedShipping}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-[#222228]">
                <span>Total (PKR)</span>
                <span className="text-[#d4af37]">Rs. {finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="text-[11px] text-gray-400 flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Cash on Delivery (COD) available across Pakistan</span>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e6cb85] text-black font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-lg active:scale-[0.99] transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
