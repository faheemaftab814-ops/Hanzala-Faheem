import React, { useState } from 'react';
import { ShoppingBag, Eye, Check, Zap, Plus, Minus, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelect: (productId: string) => void;
  onBuyNow?: (product: Product, selectedColor: string, quantity: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onBuyNow,
}) => {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || 'Default');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, selectedColor, quantity);
    if (onBuyNow) {
      onBuyNow(product, selectedColor, quantity);
    } else {
      onSelect(product.id);
    }
  };

  const handleDecreaseQty = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQty = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => Math.min(product.stock || 99, prev + 1));
  };

  return (
    <div
      onClick={() => onSelect(product.id)}
      className="group relative bg-[#121215] border border-[#23232a] hover:border-[#d4af37]/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.7)] cursor-pointer flex flex-col h-full"
    >
      {/* Top Badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        {discountPercent ? (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-[#d4af37] text-black uppercase tracking-wider shadow">
            Save {discountPercent}%
          </span>
        ) : (
          <span />
        )}

        {isOutOfStock ? (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-red-950/90 text-red-300 border border-red-800">
            Sold Out
          </span>
        ) : isLowStock ? (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-950/90 text-amber-300 border border-amber-800 animate-pulse">
            Only {product.stock} Left
          </span>
        ) : (
          <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-800 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            In Stock ({product.stock})
          </span>
        )}
      </div>

      {/* 8. Product Image Frame */}
      <div className="relative aspect-square w-full bg-[#18181d] overflow-hidden flex items-center justify-center p-4">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
            No image available
          </div>
        )}

        {/* Hover Quick Action */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product.id);
            }}
            className="px-4 py-2 rounded-full bg-white/95 text-black hover:bg-white font-semibold text-xs flex items-center gap-1.5 shadow-xl transition-all"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </button>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Capacity & Category info */}
          <div className="flex items-center justify-between text-xs text-[#9ca3af] mb-1 font-medium">
            <span>{product.capacity || '40 oz / 1180ml'}</span>
            <span className="text-[#d4af37] font-semibold">{product.category || 'Tumblers'}</span>
          </div>

          {/* 1. Product Name */}
          <h3 className="font-extrabold text-white text-base group-hover:text-[#e6cb85] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* 2 & 3. Product Price clearly below product name */}
          <div className="mt-2 flex items-baseline gap-2.5">
            <span className="text-xl sm:text-2xl font-black text-[#d4af37] tracking-tight">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-gray-500 line-through">
                Rs. {product.compareAtPrice.toLocaleString()}
              </span>
            )}
            <span className="text-[11px] text-gray-400 font-medium">PKR</span>
          </div>

          {/* 7. Stock availability indicator */}
          <div className="mt-1 flex items-center gap-1.5 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
            />
            <span className={isOutOfStock ? 'text-red-400' : isLowStock ? 'text-amber-400' : 'text-gray-300'}>
              {isOutOfStock
                ? 'Out of Stock'
                : isLowStock
                ? `Low Stock: Only ${product.stock} left in Pakistan`
                : `In Stock • Ready to dispatch nationwide`}
            </span>
          </div>
        </div>

        {/* Color swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="pt-2 border-t border-[#1f1f26]">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
              <span>Color: <strong className="text-white">{selectedColor}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {product.colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(c);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                    selectedColor === c
                      ? 'border-[#d4af37] bg-[#221c10] text-white ring-1 ring-[#d4af37]'
                      : 'border-[#2d2d38] text-gray-400 bg-[#16161c] hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 6. Quantity Selector with + and - buttons */}
        <div className="pt-2 border-t border-[#1f1f26]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-semibold">Quantity:</span>
            <div className="flex items-center border border-[#2e2e38] rounded-xl overflow-hidden bg-[#16161d]">
              <button
                type="button"
                onClick={handleDecreaseQty}
                disabled={quantity <= 1 || isOutOfStock}
                className="px-2.5 py-1 text-gray-400 hover:text-white hover:bg-[#22222c] disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-3 text-xs font-bold text-white min-w-[24px] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncreaseQty}
                disabled={quantity >= product.stock || isOutOfStock}
                className="px-2.5 py-1 text-gray-400 hover:text-white hover:bg-[#22222c] disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 & 5. Functional Add to Cart & Buy Now Buttons */}
        <div className="pt-2 space-y-2">
          {/* Add to Cart button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              isOutOfStock
                ? 'bg-[#1b1b20] text-gray-500 cursor-not-allowed'
                : addedAnimation
                ? 'bg-emerald-500 text-black'
                : 'bg-[#1e1c14] text-[#d4af37] border border-[#d4af37]/50 hover:bg-[#d4af37] hover:text-black active:scale-[0.98]'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" /> Added to Cart!
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Add to Cart • Rs. {(product.price * quantity).toLocaleString()}
              </>
            )}
          </button>

          {/* Buy Now button */}
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="w-full py-2.5 px-4 rounded-xl gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Zap className="w-3.5 h-3.5 fill-black" />
            <span>Buy Now (Cash on Delivery)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
