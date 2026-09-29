import React, { useState } from 'react';
import {
  ShieldCheck,
  Flame,
  Snowflake,
  Droplets,
  Award,
  CheckCircle2,
  Star,
  ArrowRight,
  MessageCircle,
  Truck,
  Sparkles,
  ShoppingBag,
  Zap,
  Plus,
  Minus,
  Check,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import { ASSETS, INITIAL_PRODUCTS } from '../lib/seedData';

interface HomePageProps {
  onNavigate: (page: string, param?: string) => void;
  onSelectProduct: (id: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectProduct }) => {
  const { featuredProducts, products, loadingProducts } = useStore();
  const { addToCart } = useCart();

  // Primary flagship product
  const primaryProduct =
    products.find((p) => p.name.includes('Stainless Steel Tumbler')) ||
    products[0] ||
    INITIAL_PRODUCTS[0];

  const [heroColor, setHeroColor] = useState<string>(
    primaryProduct.colors?.[0] || 'Matte Obsidian Black'
  );
  const [heroQty, setHeroQty] = useState(1);
  const [heroAdded, setHeroAdded] = useState(false);

  const displayFeatured =
    featuredProducts.length > 0 ? featuredProducts : products.slice(0, 3);

  const handleHeroAddToCart = () => {
    addToCart(primaryProduct, heroColor, heroQty);
    setHeroAdded(true);
    setTimeout(() => setHeroAdded(false), 1200);
  };

  const handleHeroBuyNow = () => {
    addToCart(primaryProduct, heroColor, heroQty);
    onNavigate('checkout');
  };

  const reviews = [
    {
      name: 'Hamza Malik',
      city: 'Lahore',
      rating: 5,
      date: 'Verified Buyer',
      comment:
        'Kept my water icy cold through an entire hot workday in Lahore. The ergonomic handle and matte finish feel amazingly premium. Cash on delivery arrived in 2 days!',
    },
    {
      name: 'Ayesha Khan',
      city: 'Karachi',
      rating: 5,
      date: 'Verified Buyer',
      comment:
        'The build quality is incredible. Real 18/8 stainless steel, doesn’t sweat at all on my work desk, and fits right inside my car’s cup holder. Easily the best tumbler brand in Pakistan.',
    },
    {
      name: 'Daniyal Tariq',
      city: 'Islamabad',
      rating: 5,
      date: 'Verified Buyer',
      comment:
        'Obsessed with the minimalist design. No unnecessary loud graphics, just pure heavy-gauge steel, great straw lid, and keeps hot tea piping hot for over 10 hours.',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 8. Hero Section with Premium Tumbler Photography, Name, Price, and Shopping Controls */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#111115] via-[#0b0b0d] to-[#0b0b0c] px-4 sm:px-6 lg:px-8 border-b border-[#1f1f26]">
        {/* Subtle radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#d4af37]/10 blur-[140px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12 lg:py-20 relative z-10">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#201a0f] border border-[#d4af37]/30 text-xs font-semibold text-[#e6cb85] shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Engineered for Pakistan’s Everyday Hydration</span>
            </div>

            {/* 9. Main heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Hydrate in Style <br />
              <span className="gold-gradient-text">with HYDROVA</span>
            </h1>

            {/* 10. Supporting text */}
            <p className="text-base sm:text-lg text-[#9ca3af] max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Discover stylish stainless steel tumblers designed for everyday hydration.
              Triple-layer vacuum engineering keeps drinks icy cold for 24 hours or piping hot for 12 hours.
            </p>

            {/* 11. Shop Now button & Badges */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => onNavigate('shop')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl gold-gradient-bg text-black font-extrabold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-[0_0_25px_rgba(212,175,55,0.35)] active:scale-95"
              >
                <span>Explore Full Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('about')}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#141418] hover:bg-[#1c1c22] text-[#d1d5db] font-semibold text-sm border border-[#2c2c36] transition-all"
              >
                Why Choose Us
              </button>
            </div>

            {/* Micro guarantees */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#1f1f26] text-center lg:text-left">
              <div>
                <div className="text-white font-bold text-base sm:text-lg">24 Hours</div>
                <div className="text-xs text-[#9ca3af]">Cold Retention</div>
              </div>
              <div>
                <div className="text-white font-bold text-base sm:text-lg">18/8 Steel</div>
                <div className="text-xs text-[#9ca3af]">Food-Grade Pro Alloy</div>
              </div>
              <div>
                <div className="text-white font-bold text-base sm:text-lg">Nationwide</div>
                <div className="text-xs text-[#9ca3af]">Cash on Delivery</div>
              </div>
            </div>
          </div>

          {/* Right Product Hero Card with Complete Shopping Controls */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="w-full max-w-md bg-[#121216] border border-[#2c2c36] hover:border-[#d4af37]/60 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] space-y-5 transition-all">
              {/* Product Image Frame */}
              <div
                onClick={() => onSelectProduct(primaryProduct.id)}
                className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#18181f] p-4 flex items-center justify-center cursor-pointer group"
              >
                <img
                  src={primaryProduct.images?.[0] || ASSETS.matteBlack}
                  alt={primaryProduct.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-md text-xs font-extrabold bg-[#d4af37] text-black shadow uppercase tracking-wider">
                  Save 22%
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  In Stock ({primaryProduct.stock})
                </div>
              </div>

              {/* 1. Product Name */}
              <div>
                <div className="flex items-center justify-between text-xs text-[#d4af37] font-semibold uppercase tracking-wider mb-1">
                  <span>Pro Drinkware Series</span>
                  <span>{primaryProduct.capacity || '40 oz / 1180ml'}</span>
                </div>
                <h3
                  onClick={() => onSelectProduct(primaryProduct.id)}
                  className="text-xl sm:text-2xl font-black text-white hover:text-[#d4af37] cursor-pointer transition-colors"
                >
                  HYDROVA Stainless Steel Tumbler
                </h3>

                {/* 2 & 3. Price clearly below product name */}
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-[#d4af37] tracking-tight">
                    Rs. 3,500
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    Rs. 4,500
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#221c10] text-[#e6cb85] border border-[#d4af37]/30 font-semibold">
                    PKR 3,500
                  </span>
                </div>

                {/* 7. Stock availability indicator */}
                <p className="text-xs text-gray-300 mt-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Available in stock for instant Cash on Delivery across Pakistan</span>
                </p>
              </div>

              {/* Color selection */}
              {primaryProduct.colors && primaryProduct.colors.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-[#1f1f26]">
                  <div className="text-xs text-gray-400 flex items-center justify-between">
                    <span>Color: <strong className="text-white">{heroColor}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {primaryProduct.colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setHeroColor(c)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          heroColor === c
                            ? 'border-[#d4af37] bg-[#221c10] text-white ring-1 ring-[#d4af37]'
                            : 'border-[#2c2c36] text-gray-400 bg-[#17171e] hover:text-white'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Quantity Selector with + and - buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-[#1f1f26]">
                <span className="text-xs font-semibold text-gray-300">Quantity:</span>
                <div className="flex items-center border border-[#2e2e38] rounded-xl overflow-hidden bg-[#16161d]">
                  <button
                    type="button"
                    onClick={() => setHeroQty((q) => Math.max(1, q - 1))}
                    disabled={heroQty <= 1}
                    className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-[#22222c] disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-sm font-bold text-white min-w-[28px] text-center">
                    {heroQty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setHeroQty((q) => Math.min(primaryProduct.stock, q + 1))}
                    disabled={heroQty >= primaryProduct.stock}
                    className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-[#22222c] disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 4 & 5. Functional Add to Cart & Buy Now Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleHeroAddToCart}
                  className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    heroAdded
                      ? 'bg-emerald-500 text-black'
                      : 'bg-[#1c1a14] text-[#d4af37] border border-[#d4af37]/60 hover:bg-[#d4af37] hover:text-black active:scale-[0.98]'
                  }`}
                >
                  {heroAdded ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Cart • Rs. {(3500 * heroQty).toLocaleString()}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleHeroBuyNow}
                  className="w-full py-3.5 px-4 rounded-xl gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:opacity-95 active:scale-[0.98] transition-all"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>Buy Now (Cash on Delivery)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-2">
              Curated Drinkware
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Featured Tumblers
            </h2>
            <p className="text-sm text-[#9ca3af] mt-2">
              Each unit priced at Rs. 3,500 with nationwide Cash on Delivery.
            </p>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#d4af37] hover:text-[#e6cb85] group"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-[#141418] animate-pulse border border-[#222228]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayFeatured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(id) => onSelectProduct(id)}
                onBuyNow={(prod, col, qty) => {
                  addToCart(prod, col, qty);
                  onNavigate('checkout');
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* 13. Product Benefits Section */}
      <section className="bg-[#0f0f13] border-y border-[#1f1f26] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
              Thermal Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Engineered For The Everyday
            </h2>
            <p className="text-sm text-[#9ca3af]">
              Every HYDROVA tumbler incorporates state-of-the-art thermal engineering to keep your hydration optimal in Pakistan’s varying climates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-[#141418] border border-[#22222a] hover:border-[#d4af37]/40 transition-colors space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#221c10] text-[#d4af37] flex items-center justify-center">
                <Snowflake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">24 Hours Cold</h3>
              <p className="text-xs text-[#9ca3af] leading-relaxed">
                Double-wall vacuum barrier prevents temperature transfer, keeping ice frozen and hydration crisp even on sweltering summer afternoons.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#141418] border border-[#22222a] hover:border-[#d4af37]/40 transition-colors space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#221c10] text-[#d4af37] flex items-center justify-center">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">12 Hours Hot</h3>
              <p className="text-xs text-[#9ca3af] leading-relaxed">
                Sip piping-hot morning chai, espresso, or herbal infusions through your morning commute and long work hours.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#141418] border border-[#22222a] hover:border-[#d4af37]/40 transition-colors space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#221c10] text-[#d4af37] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">18/8 Stainless Steel</h3>
              <p className="text-xs text-[#9ca3af] leading-relaxed">
                Constructed from food-grade kitchen alloy. Rust-proof, flavor-neutral, completely BPA-free, and leaves zero metallic taste.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#141418] border border-[#22222a] hover:border-[#d4af37]/40 transition-colors space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#221c10] text-[#d4af37] flex items-center justify-center">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">No-Sweat & Leak Lid</h3>
              <p className="text-xs text-[#9ca3af] leading-relaxed">
                Condensation-free exterior ensures zero slippery rings on desks, while the multi-position straw lid provides spill-resistant convenience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 14. Why Choose HYDROVA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
              The HYDROVA Difference
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Why Discerning Customers <br />
              Choose HYDROVA
            </h2>
            <p className="text-sm text-[#9ca3af] leading-relaxed">
              We focus on thoughtful product design, honest customer service, and reliable nationwide fulfillment. You get top-tier thermal performance without astronomical markups.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Pure Minimalist Finish</h4>
                  <p className="text-xs text-[#9ca3af]">
                    Clean unbranded tumblers with pristine powder coats in timeless Matte Black, Champagne Gold, and Silver.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Vehicle Cup Holder Friendly</h4>
                  <p className="text-xs text-[#9ca3af]">
                    Tapered slim base slides right into standard car cup holders, ensuring effortless travel hydration.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Nationwide Cash on Delivery (COD)</h4>
                  <p className="text-xs text-[#9ca3af]">
                    Order comfortably with zero upfront card requirement. Inspect upon courier delivery at your doorstep anywhere in Pakistan.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">7-Day Replacement Warranty</h4>
                  <p className="text-xs text-[#9ca3af]">
                    Direct human support via WhatsApp (+923069614050) if any unit arrives damaged or defective.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-[#16161b] border border-[#2b2b35] p-3 shadow-2xl">
              <img
                src={ASSETS.gold}
                alt="Champagne Gold Tumbler"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 15. Customer Reviews Section */}
      <section className="bg-[#0e0e11] border-y border-[#1f1f26] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
              Customer Experiences
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Loved by Hydration Seekers
            </h2>
            <p className="text-sm text-[#9ca3af]">
              Real feedback from customers across Pakistan who switched to HYDROVA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#141418] border border-[#22222a] flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-[#d4af37]">
                    {[...Array(r.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-[#d4af37]" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#d1d5db] leading-relaxed italic">
                    &quot;{r.comment}&quot;
                  </p>
                </div>

                <div className="pt-4 border-t border-[#1e1e24] flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{r.name}</h4>
                    <span className="text-[11px] text-[#6b7280]">{r.city}, Pakistan</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#1e281e] text-emerald-400 border border-emerald-900/60 font-medium">
                    {r.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 16. Contact and WhatsApp Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#17171d] via-[#141418] to-[#1a1711] border border-[#2e2a22] shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
              Need Quick Assistance?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Connect Directly with HYDROVA
            </h2>
            <p className="text-sm text-[#9ca3af] leading-relaxed">
              Have questions regarding sizing, custom corporate orders, or cash on delivery tracking? We are available via WhatsApp and official email.
            </p>

            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <a
                href="https://wa.me/923069614050?text=Hi%20HYDROVA,%20I%20have%20an%20inquiry%20about%20your%20stainless%20steel%20tumblers."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                <span>WhatsApp: +92 306 9614050</span>
              </a>

              <a
                href="mailto:hanzalafaheem85@gmail.com"
                className="px-6 py-3.5 rounded-xl bg-[#1c1c22] hover:bg-[#24242c] text-white text-xs font-semibold border border-[#343440] transition-colors"
              >
                Email: hanzalafaheem85@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
