import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectProduct }) => {
  const { products } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.colors.some((c) => c.toLowerCase().includes(term)) ||
        (p.category && p.category.toLowerCase().includes(term))
    );
  }, [searchTerm, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative w-full max-w-2xl bg-[#121216] border border-[#2a2a32] rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#22222a] gap-3">
          <Search className="w-5 h-5 text-[#d4af37]" />
          <input
            type="text"
            placeholder="Search tumblers by name, size, or color (e.g. 40oz, Black, Gold)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded bg-[#202026]"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {!searchTerm.trim() ? (
            <div className="py-8 text-center text-xs text-gray-500">
              Try searching for &quot;Apex&quot;, &quot;40oz&quot;, &quot;Matte Black&quot;, or &quot;Gold&quot;
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              No stainless steel tumblers found matching &quot;{searchTerm}&quot;
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product.id);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#17171d] hover:bg-[#1f1f26] border border-transparent hover:border-[#d4af37]/30 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#202028] p-1 flex items-center justify-center shrink-0">
                      <img
                        src={product.images?.[0] || ''}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{product.name}</h4>
                      <p className="text-xs text-[#a7843b]">
                        Rs. {product.price.toLocaleString()} • {product.capacity || '40oz'}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
