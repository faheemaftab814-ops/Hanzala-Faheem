import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Star,
  Clock,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';

interface ProductDetailPageProps {
  productId: string;
  onBack: () => void;
  onCheckout: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onBack,
  onCheckout,
}) => {
  const { getProductById, getProductReviews, addReview } = useStore();
  const { addToCart } = useCart();
  const { currentUser, userProfile } = useAuth();

  const product = getProductById(productId);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (product?.colors && product.colors.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0]);
    }
  }, [product, selectedColor]);

  useEffect(() => {
    if (productId) {
      setLoadingReviews(true);
      getProductReviews(productId)
        .then((data) => setReviews(data))
        .finally(() => setLoadingReviews(false));
    }
  }, [productId]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Tumbler Not Found</h2>
        <p className="text-gray-400 text-sm">
          The requested tumbler listing may have been moved or removed.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl bg-[#221c10] text-[#d4af37] border border-[#d4af37]/40 hover:bg-[#d4af37] hover:text-black text-xs font-semibold"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedColor, quantity);
    onCheckout();
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      await addReview({
        productId: product.id,
        customerName: reviewName.trim(),
        customerId: currentUser?.uid,
        rating: reviewRating,
        comment: reviewComment.trim(),
        verifiedPurchase: true,
      });
      setReviewSuccess(true);
      setReviewComment('');
      const updated = await getProductReviews(product.id);
      setReviews(updated);
      setTimeout(() => setReviewSuccess(false), 4000);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Tumblers</span>
      </button>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Gallery Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl bg-[#141418] border border-[#26262e] overflow-hidden flex items-center justify-center p-6 shadow-2xl">
            {discountPercent && (
              <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-md text-xs font-extrabold bg-[#d4af37] text-black shadow">
                Save {discountPercent}%
              </span>
            )}
            {product.images && product.images[activeImageIndex] ? (
              <img
                src={product.images[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="text-gray-500 text-sm">No image available</div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl bg-[#16161b] border-2 p-1.5 shrink-0 overflow-hidden transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#d4af37] scale-105 shadow-md'
                      : 'border-[#26262e] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Column */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37] uppercase tracking-wider mb-2">
              <span>HYDROVA Pro Collection</span>
              <span>•</span>
              <span>{product.category || 'Stainless Steel Drinkware'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              {product.name}
            </h1>
          </div>

          {/* Price & Stock */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#131317] border border-[#22222a]">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-white">
                  Rs. {product.price.toLocaleString()}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm sm:text-base text-gray-500 line-through">
                    Rs. {product.compareAtPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#a7843b] font-medium">
                Cash on Delivery (COD) Included
              </span>
            </div>

            <div>
              {isOutOfStock ? (
                <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-950/80 text-red-300 border border-red-800">
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-800 animate-pulse">
                  Only {product.stock} Left!
                </span>
              ) : (
                <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-800">
                  In Stock ({product.stock} units)
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-[#9ca3af] leading-relaxed">
            {product.description}
          </p>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center justify-between">
                <span>Color: <strong className="text-[#d4af37]">{selectedColor}</strong></span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all ${
                      selectedColor === color
                        ? 'bg-[#221c10] border-[#d4af37] text-white shadow-sm ring-1 ring-[#d4af37]'
                        : 'bg-[#15151a] border-[#292934] text-gray-400 hover:text-white'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/40"
                      style={{
                        backgroundColor:
                          color.toLowerCase().includes('gold')
                            ? '#d4af37'
                            : color.toLowerCase().includes('silver')
                            ? '#c0c0c0'
                            : color.toLowerCase().includes('blue')
                            ? '#1e3a8a'
                            : color.toLowerCase().includes('sand')
                            ? '#d2b48c'
                            : '#1a1a1a',
                      }}
                    />
                    <span>{color}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#2b2b36] rounded-xl overflow-hidden bg-[#16161c]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3.5 py-2.5 text-gray-400 hover:text-white hover:bg-[#202028] disabled:opacity-40"
                >
                  -
                </button>
                <span className="px-4 text-sm font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="px-3.5 py-2.5 text-gray-400 hover:text-white hover:bg-[#202028] disabled:opacity-40"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-gray-400">
                Max available: {product.stock}
              </span>
            </div>
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-1 py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                isOutOfStock
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : addedAnimation
                  ? 'bg-emerald-500 text-black'
                  : 'bg-[#221c10] text-[#d4af37] border border-[#d4af37]/60 hover:bg-[#d4af37] hover:text-black shadow-lg active:scale-95'
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

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="flex-1 py-4 px-6 rounded-xl gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-[0_0_20px_rgba(212,175,55,0.35)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>Buy with Cash on Delivery</span>
            </button>
          </div>

          {/* Delivery & Warranty perks */}
          <div className="pt-6 border-t border-[#1f1f26] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#141418] border border-[#212128]">
              <Truck className="w-5 h-5 text-[#d4af37] shrink-0" />
              <div>
                <span className="font-bold text-white block">Cash on Delivery</span>
                <span className="text-gray-400">Nationwide courier in 2-4 days</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#141418] border border-[#212128]">
              <RotateCcw className="w-5 h-5 text-[#d4af37] shrink-0" />
              <div>
                <span className="font-bold text-white block">7-Day Warranty</span>
                <span className="text-gray-400">Easy replacement guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Construction */}
      <section className="bg-[#101014] border border-[#22222a] rounded-3xl p-8 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#d4af37]" />
          <span>Product Specifications & Details</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div className="p-4 rounded-xl bg-[#17171e] border border-[#252530] space-y-1">
            <span className="text-gray-400">Capacity & Volume</span>
            <div className="text-sm font-bold text-white">{product.capacity || '40 oz (1,180 ml)'}</div>
          </div>
          <div className="p-4 rounded-xl bg-[#17171e] border border-[#252530] space-y-1">
            <span className="text-gray-400">Temperature Defense</span>
            <div className="text-sm font-bold text-white">{product.temperatureRetention || '24h Cold / 12h Hot'}</div>
          </div>
          <div className="p-4 rounded-xl bg-[#17171e] border border-[#252530] space-y-1">
            <span className="text-gray-400">Alloy & Material</span>
            <div className="text-sm font-bold text-white">{product.material || 'Pro-grade 18/8 Stainless Steel'}</div>
          </div>
          <div className="p-4 rounded-xl bg-[#17171e] border border-[#252530] space-y-1">
            <span className="text-gray-400">Lid & Straw</span>
            <div className="text-sm font-bold text-white">3-way rotating lid + reusable straw</div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="space-y-8 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1f1f26] pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
              Customer Feedback
            </span>
            <h3 className="text-2xl font-bold text-white mt-1">
              Reviews & Experiences
            </h3>
          </div>
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Reviews Stream */}
          <div className="lg:col-span-7 space-y-4">
            {loadingReviews ? (
              <div className="p-6 rounded-2xl bg-[#121216] text-gray-500 text-sm">
                Loading verified customer reviews...
              </div>
            ) : reviews.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#121216] border border-[#222228] text-center space-y-2">
                <p className="text-sm text-gray-300">No reviews yet for this tumbler.</p>
                <p className="text-xs text-gray-500">
                  Be the first to share your experience with HYDROVA.
                </p>
              </div>
            ) : (
              reviews.map((r) => (
                <div
                  key={r.id}
                  className="p-5 rounded-2xl bg-[#121216] border border-[#222228] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-white text-sm">{r.customerName}</h5>
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        ✓ Verified Hydration Buyer
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[#d4af37]">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#d4af37]" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">&quot;{r.comment}&quot;</p>
                  <div className="text-[10px] text-gray-500">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent'}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Leave a Review Form */}
          <div className="lg:col-span-5 bg-[#121216] border border-[#222228] rounded-2xl p-6 space-y-4">
            <h4 className="font-bold text-base text-white">Write a Review</h4>
            <p className="text-xs text-gray-400">
              Share your honest feedback on insulation performance, finish, and durability.
            </p>

            {reviewSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs font-medium">
                Thank you! Your verified review has been submitted to Firestore.
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Your Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-[#d4af37] focus:outline-none"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= reviewRating ? 'fill-[#d4af37]' : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-[#d4af37] font-semibold ml-2">
                    {reviewRating} out of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Faheem Aftab"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="w-full bg-[#18181e] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#2a2a34] focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Your Review
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="How long did it keep your ice cold? What do you think of the handle and lid?"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-[#18181e] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#2a2a34] focus:border-[#d4af37] focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-2.5 rounded-xl bg-[#221c10] text-[#d4af37] border border-[#d4af37]/40 hover:bg-[#d4af37] hover:text-black font-semibold text-xs transition-all disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Post Customer Review'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
