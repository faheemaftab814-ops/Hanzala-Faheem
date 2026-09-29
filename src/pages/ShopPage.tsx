import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, PlusCircle, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';

interface ShopPageProps {
  onSelectProduct: (productId: string) => void;
  onNavigate: (page: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onSelectProduct, onNavigate }) => {
  const { products, loadingProducts, seedInitialCatalog } = useStore();
  const { isAdmin } = useAuth();
  const { addToCart } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [seeding, setSeeding] = useState(false);

  // Extract unique categories & colors
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  const allColors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      p.colors?.forEach((c) => set.add(c));
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filtering and sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // active products only (or all if admin)
        if (!p.active && !isAdmin) return false;

        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchColor = p.colors?.some((c) => c.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchColor) return false;
        }

        // Category
        if (selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }

        // Color
        if (selectedColor !== 'All' && !p.colors?.includes(selectedColor)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'newest') {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        // featured first
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, searchQuery, selectedCategory, selectedColor, sortBy, isAdmin]);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedInitialCatalog();
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Description */}
      <div className="border-b border-[#1f1f26] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Stainless Steel Tumblers
          </h1>
          <p className="text-sm text-[#9ca3af] mt-2 max-w-xl">
            Explore our precision vacuum-insulated drinkware range. Crafted with food-grade 18/8 stainless steel to preserve icy cold and steaming hot beverages.
          </p>
        </div>

        <div className="text-xs text-[#9ca3af] bg-[#141418] px-3.5 py-2 rounded-xl border border-[#222228] inline-flex items-center gap-2 self-start md:self-end">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Showing {filteredProducts.length} items • Cash on Delivery</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#121216] border border-[#222228] rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tumblers (e.g. 40oz, Gold, Matte Black)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#18181e] text-white text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-[#282832] focus:border-[#d4af37] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Dropdown */}
          {categories.length > 2 && (
            <div className="flex items-center gap-1.5 text-xs text-gray-300 bg-[#18181e] border border-[#282832] rounded-xl px-3 py-2">
              <span className="text-gray-500">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-white focus:outline-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#18181e] text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Color filter */}
          {allColors.length > 2 && (
            <div className="flex items-center gap-1.5 text-xs text-gray-300 bg-[#18181e] border border-[#282832] rounded-xl px-3 py-2">
              <span className="text-gray-500">Color:</span>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="bg-transparent text-white focus:outline-none cursor-pointer"
              >
                {allColors.map((color) => (
                  <option key={color} value={color} className="bg-[#18181e] text-white">
                    {color}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 text-xs text-gray-300 bg-[#18181e] border border-[#282832] rounded-xl px-3 py-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#d4af37]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-[#18181e] text-white">Featured</option>
              <option value="price-asc" className="bg-[#18181e] text-white">Price: Low to High</option>
              <option value="price-desc" className="bg-[#18181e] text-white">Price: High to Low</option>
              <option value="newest" className="bg-[#18181e] text-white">Newest Additions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loadingProducts ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="h-96 rounded-2xl bg-[#141418] animate-pulse border border-[#222228]"
            />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 px-6 rounded-3xl bg-[#121216] border border-[#222228] text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#1e1c14] border border-[#d4af37]/30 text-[#d4af37] flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No Tumblers Found</h3>
          <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed">
            {searchQuery || selectedCategory !== 'All' || selectedColor !== 'All'
              ? 'No products matched your exact filter combination. Try clearing your search.'
              : 'The Firestore catalog is currently empty. If you are an administrator, you can add products or initialize the starter catalog below.'}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {(searchQuery || selectedCategory !== 'All' || selectedColor !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedColor('All');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#22222a] text-white text-xs font-semibold hover:bg-[#2c2c36]"
              >
                Reset All Filters
              </button>
            )}

            {isAdmin && (
              <>
                <button
                  onClick={handleSeed}
                  disabled={seeding}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e6cb85] text-black text-xs font-bold hover:opacity-90 flex items-center gap-1.5 shadow-lg"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{seeding ? 'Populating...' : 'Initialize Starter Catalog'}</span>
                </button>
                <button
                  onClick={() => onNavigate('admin')}
                  className="px-5 py-2.5 rounded-xl bg-[#18181e] text-[#d4af37] border border-[#d4af37]/30 text-xs font-semibold hover:bg-[#221c10]"
                >
                  Open Admin Dashboard
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onBuyNow={(prod, col, qty) => {
                addToCart(prod, col, qty);
                onNavigate('checkout');
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
