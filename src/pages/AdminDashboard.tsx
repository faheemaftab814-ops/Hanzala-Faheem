import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Search,
  Filter,
  Users,
  Save,
  Eye,
  Lock,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { Product, Order, OrderStatus, PaymentStatus, StoreSettings } from '../types';
import { ASSETS } from '../lib/seedData';

interface AdminDashboardProps {
  onNavigateHome: () => void;
  onViewProduct: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateHome,
  onViewProduct,
}) => {
  const {
    products,
    orders,
    settings,
    saveProduct,
    deleteProduct,
    updateOrderStatus,
    updateStoreSettings,
    seedInitialCatalog,
  } = useStore();
  const { currentUser, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'inventory' | 'settings'>('overview');

  // Admin access unlock state (in case user is testing before setting admin role in Firebase)
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  // Product Editing Modal State
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | undefined>(undefined);
  const [prodName, setProdName] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(3500);
  const [prodComparePrice, setProdComparePrice] = useState<number>(4500);
  const [prodStock, setProdStock] = useState<number>(25);
  const [prodCategory, setProdCategory] = useState('Tumblers');
  const [prodColors, setProdColors] = useState('Matte Obsidian Black, Champagne Gold, Brushed Stainless Silver');
  const [prodCapacity, setProdCapacity] = useState('40 oz (1,180 ml)');
  const [prodMaterial, setProdMaterial] = useState('18/8 Food-grade Stainless Steel, BPA-Free');
  const [prodRetention, setProdRetention] = useState('24h Cold / 12h Hot');
  const [prodActive, setProdActive] = useState(true);
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodImagePreset, setProdImagePreset] = useState<'black' | 'gold' | 'silver' | 'hero' | 'custom'>('black');
  const [prodCustomImageUrl, setProdCustomImageUrl] = useState('');
  const [savingProduct, setSavingProduct] = useState(false);
  const [batchPriceUpdating, setBatchPriceUpdating] = useState(false);

  // Orders Tab filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');

  // Settings State
  const [storeSettingsForm, setStoreSettingsForm] = useState<StoreSettings>(settings);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Metrics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending').length;
  const paidRevenue = orders
    .filter((o) => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + o.finalTotal, 0);
  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  const canAccess = isAdmin || adminUnlocked;

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default master admin key for store administrator
    if (adminPasscode.trim() === 'HYDROVA-ADMIN-2026' || adminPasscode.trim() === '923069614050') {
      setAdminUnlocked(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  const handleOpenAddProduct = () => {
    setCurrentEditId(undefined);
    setProdName('');
    setProdDescription('');
    setProdPrice(3500);
    setProdComparePrice(4500);
    setProdStock(25);
    setProdCategory('Tumblers');
    setProdColors('Matte Obsidian Black, Champagne Gold, Brushed Stainless Silver');
    setProdCapacity('40 oz (1,180 ml)');
    setProdMaterial('Pro-grade 18/8 Double-Wall Stainless Steel');
    setProdRetention('24 Hours Cold / 12 Hours Hot');
    setProdActive(true);
    setProdFeatured(false);
    setProdImagePreset('black');
    setProdCustomImageUrl('');
    setIsEditingProduct(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setCurrentEditId(p.id);
    setProdName(p.name);
    setProdDescription(p.description);
    setProdPrice(p.price);
    setProdComparePrice(p.compareAtPrice || 0);
    setProdStock(p.stock);
    setProdCategory(p.category || 'Tumblers');
    setProdColors(p.colors?.join(', ') || '');
    setProdCapacity(p.capacity || '');
    setProdMaterial(p.material || '');
    setProdRetention(p.temperatureRetention || '');
    setProdActive(p.active);
    setProdFeatured(p.featured);
    setProdCustomImageUrl(p.images?.[0] || '');
    setProdImagePreset('custom');
    setIsEditingProduct(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);

    let finalImages: string[] = [];
    if (prodImagePreset === 'black') {
      finalImages = [ASSETS.matteBlack, ASSETS.gold, ASSETS.silver];
    } else if (prodImagePreset === 'gold') {
      finalImages = [ASSETS.gold, ASSETS.matteBlack];
    } else if (prodImagePreset === 'silver') {
      finalImages = [ASSETS.silver, ASSETS.matteBlack];
    } else if (prodImagePreset === 'hero') {
      finalImages = [ASSETS.hero, ASSETS.matteBlack];
    } else {
      finalImages = prodCustomImageUrl.trim() ? [prodCustomImageUrl.trim()] : [ASSETS.matteBlack];
    }

    const colorsArray = prodColors
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    try {
      await saveProduct(
        {
          name: prodName.trim(),
          description: prodDescription.trim(),
          price: Number(prodPrice),
          compareAtPrice: Number(prodComparePrice) || undefined,
          stock: Number(prodStock),
          category: prodCategory.trim(),
          colors: colorsArray,
          images: finalImages,
          capacity: prodCapacity.trim(),
          material: prodMaterial.trim(),
          temperatureRetention: prodRetention.trim(),
          active: prodActive,
          featured: prodFeatured,
        },
        currentEditId
      );
      setIsEditingProduct(false);
    } catch (err: any) {
      alert(`Error saving product: ${err.message}`);
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from Firestore?`)) {
      await deleteProduct(id);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await updateStoreSettings(storeSettingsForm);
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } finally {
      setSavingSettings(false);
    }
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderStatusFilter !== 'All' && o.orderStatus !== orderStatusFilter) return false;
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        return (
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.phoneNumber.toLowerCase().includes(q) ||
          o.city.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  if (!canAccess) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-[#121216] border border-[#2a2a32] rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#1e1c14] border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Administrator Access</h2>
            <p className="text-xs text-gray-400 mt-2">
              This area is restricted to authorized store managers.
            </p>
          </div>

          <form onSubmit={handleUnlockAdmin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 text-left">
                Admin Master Key / WhatsApp Phone
              </label>
              <input
                type="password"
                placeholder="Enter store passkey or 923069614050"
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                className="w-full bg-[#18181f] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#2a2a34] focus:border-[#d4af37] focus:outline-none"
              />
              {passcodeError && (
                <p className="text-[11px] text-red-400 text-left mt-1">
                  Invalid master key. Try &quot;HYDROVA-ADMIN-2026&quot; or store WhatsApp.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-90 shadow"
            >
              Authorize & Enter
            </button>
          </form>

          <button
            onClick={onNavigateHome}
            className="text-xs text-gray-400 hover:text-white"
          >
            ← Return to Storefront
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f1f26] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-2xl tracking-[0.2em] text-white">
              HYDROVA
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#221c10] text-[#d4af37] border border-[#d4af37]/30 font-bold uppercase tracking-wider">
              Admin Portal
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Store management • Live Firestore database integration
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="px-4 py-2 rounded-xl bg-[#16161c] hover:bg-[#1f1f26] text-gray-300 hover:text-white text-xs font-semibold border border-[#262630] transition-colors"
          >
            View Live Store
          </button>

          {products.length === 0 && (
            <button
              onClick={() => seedInitialCatalog()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e6cb85] text-black text-xs font-extrabold flex items-center gap-1.5 shadow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Seed Initial Catalog</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#1f1f26]">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'overview'
              ? 'bg-[#221c10] text-[#d4af37] border border-[#d4af37]/40 shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'products'
              ? 'bg-[#221c10] text-[#d4af37] border border-[#d4af37]/40 shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'orders'
              ? 'bg-[#221c10] text-[#d4af37] border border-[#d4af37]/40 shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders ({orders.length})</span>
          {pendingOrders > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'inventory'
              ? 'bg-[#221c10] text-[#d4af37] border border-[#d4af37]/40 shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Inventory Alerts</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'settings'
              ? 'bg-[#221c10] text-[#d4af37] border border-[#d4af37]/40 shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Store Settings</span>
        </button>
      </div>

      {/* 11.A Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-[#121216] border border-[#222228] space-y-2">
              <span className="text-xs text-gray-400">Total Orders</span>
              <div className="text-2xl font-extrabold text-white">{totalOrders}</div>
              <span className="text-[11px] text-gray-500">All-time recorded</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#121216] border border-[#222228] space-y-2">
              <span className="text-xs text-gray-400">Paid Revenue</span>
              <div className="text-2xl font-extrabold text-emerald-400">
                Rs. {paidRevenue.toLocaleString()}
              </div>
              <span className="text-[11px] text-gray-500">Collected from COD</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#121216] border border-[#222228] space-y-2">
              <span className="text-xs text-gray-400">Pending Orders</span>
              <div className="text-2xl font-extrabold text-amber-400">{pendingOrders}</div>
              <span className="text-[11px] text-amber-500/80">Awaiting confirmation</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#121216] border border-[#222228] space-y-2">
              <span className="text-xs text-gray-400">Total Products</span>
              <div className="text-2xl font-extrabold text-white">{totalProducts}</div>
              <span className="text-[11px] text-gray-500">Tumbler variants</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#121216] border border-[#222228] space-y-2">
              <span className="text-xs text-gray-400">Low-Stock Alerts</span>
              <div className="text-2xl font-extrabold text-red-400">
                {lowStockProducts.length}
              </div>
              <span className="text-[11px] text-red-400/80">Stock &le; 5 units</span>
            </div>
          </div>

          {/* Quick Actions & Recent Orders preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-[#121216] border border-[#222228] rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Recent Customer Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#d4af37] hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-400">
                  No orders placed yet. As customers order with Cash on Delivery, they will appear here in real-time.
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 5).map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3.5 rounded-xl bg-[#17171e] border border-[#24242e] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-[#d4af37] font-extrabold">{ord.orderNumber}</strong>
                          <span className="text-white font-medium">{ord.customerName}</span>
                          <span className="text-gray-400">({ord.city})</span>
                        </div>
                        <div className="text-gray-400 mt-1">
                          {ord.items.length} item(s) • Total: Rs. {ord.finalTotal.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#201d14] text-[#e6cb85] border border-[#d4af37]/30 text-[10px] font-semibold">
                          {ord.orderStatus}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            ord.paymentStatus === 'Paid'
                              ? 'bg-emerald-950 text-emerald-300'
                              : 'bg-amber-950 text-amber-300'
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-4 bg-[#121216] border border-[#222228] rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white">Store Controls</h3>
              <div className="space-y-3">
                <button
                  onClick={handleOpenAddProduct}
                  className="w-full py-3 rounded-xl bg-[#221c10] text-[#d4af37] border border-[#d4af37]/40 hover:bg-[#d4af37] hover:text-black font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Tumbler Product</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className="w-full py-3 rounded-xl bg-[#17171e] text-gray-300 hover:text-white border border-[#2a2a34] font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Configure Shipping & WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 11.B Product Management Tab */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">Product Catalog Management</h3>
              <p className="text-xs text-gray-400">
                Add, modify prices, update stock, and control visibility in Firestore.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  if (window.confirm('Set selling price of all tumblers to PKR 3,500 in Firestore?')) {
                    setBatchPriceUpdating(true);
                    try {
                      for (const p of products) {
                        await saveProduct({ price: 3500 }, p.id);
                      }
                      alert('All tumbler prices updated to Rs. 3,500 in Firestore.');
                    } finally {
                      setBatchPriceUpdating(false);
                    }
                  }
                }}
                disabled={batchPriceUpdating}
                className="px-4 py-2.5 rounded-xl bg-[#221c10] text-[#d4af37] border border-[#d4af37]/40 hover:bg-[#d4af37] hover:text-black font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <span>{batchPriceUpdating ? 'Updating...' : 'Set All to Rs. 3,500'}</span>
              </button>

              <button
                onClick={handleOpenAddProduct}
                className="px-5 py-2.5 rounded-xl gold-gradient-bg text-black font-extrabold text-xs flex items-center gap-2 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Tumbler</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-2xl bg-[#121216] border border-[#222228] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-[#18181f] p-1 shrink-0 flex items-center justify-center">
                    <img
                      src={p.images?.[0] || ''}
                      alt={p.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">{p.name}</h4>
                      {p.featured && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#d4af37] text-black font-extrabold">
                          Featured
                        </span>
                      )}
                      {!p.active && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300">
                          Disabled
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Price: <strong className="text-white">Rs. {p.price.toLocaleString()}</strong> • Stock: <strong className={p.stock <= 5 ? 'text-red-400' : 'text-emerald-400'}>{p.stock}</strong> units
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      Colors: {p.colors?.join(', ')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => onViewProduct(p.id)}
                    className="p-2 rounded-lg bg-[#18181f] text-gray-400 hover:text-white"
                    title="Preview on Store"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEditProduct(p)}
                    className="px-3 py-1.5 rounded-lg bg-[#221c10] text-[#d4af37] border border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-black text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(p.id, p.name)}
                    className="p-2 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11.C Order Management Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">Order Management</h3>
              <p className="text-xs text-gray-400">
                Update delivery statuses, confirm phone calls, and mark payments collected.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by order #, phone, city..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="bg-[#18181f] text-white text-xs pl-8 pr-3 py-2 rounded-xl border border-[#2a2a34] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-[#18181f] text-white text-xs px-3 py-2 rounded-xl border border-[#2a2a34] focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#121216] border border-[#222228] text-xs text-gray-400">
                No orders match your filter criteria.
              </div>
            ) : (
              filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-6 rounded-2xl bg-[#121216] border border-[#222228] space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1f1f26] pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base text-[#d4af37]">
                          {ord.orderNumber}
                        </span>
                        <span className="text-xs text-gray-400">
                          Placed: {new Date(ord.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-white mt-0.5">
                        {ord.customerName} • {ord.phoneNumber} • {ord.city}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-gray-400">Total COD Amount</div>
                        <div className="text-base font-extrabold text-white">
                          Rs. {ord.finalTotal.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items Ordered */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    {ord.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-[#17171e] border border-[#24242e] flex items-center gap-2.5"
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#202028] p-0.5 shrink-0 flex items-center justify-center">
                          <img
                            src={item.image}
                            alt=""
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-white truncate">{item.productName}</div>
                          <div className="text-[11px] text-[#d4af37]">
                            {item.color} • Qty: {item.quantity} (Rs. {item.price.toLocaleString()})
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer Address & Notes */}
                  <div className="text-xs text-gray-400 bg-[#16161c] p-3 rounded-xl border border-[#22222a]">
                    <strong className="text-gray-300">Delivery Address: </strong>
                    <span>{ord.shippingAddress}, {ord.city}</span>
                    {ord.orderNotes && (
                      <div className="text-[11px] text-[#a7843b] mt-1">
                        Notes: {ord.orderNotes}
                      </div>
                    )}
                  </div>

                  {/* Status update controls */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#1f1f26]">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-300">
                        <span>Order Status:</span>
                        <select
                          value={ord.orderStatus}
                          onChange={(e) =>
                            updateOrderStatus(ord.id, e.target.value as OrderStatus)
                          }
                          className="bg-[#18181f] text-white text-xs px-2.5 py-1.5 rounded-lg border border-[#2a2a34] focus:outline-none focus:border-[#d4af37] font-semibold"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-gray-300">
                        <span>Payment (COD):</span>
                        <select
                          value={ord.paymentStatus}
                          onChange={(e) =>
                            updateOrderStatus(ord.id, ord.orderStatus, e.target.value as PaymentStatus)
                          }
                          className="bg-[#18181f] text-white text-xs px-2.5 py-1.5 rounded-lg border border-[#2a2a34] focus:outline-none focus:border-[#d4af37] font-semibold"
                        >
                          <option value="Unpaid">Unpaid</option>
                          <option value="Paid">Paid</option>
                        </select>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/${ord.phoneNumber.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(ord.customerName)},%20this%20is%20HYDROVA%20regarding%20your%20Order%20${ord.orderNumber}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-[#1a2b1a] text-emerald-400 border border-emerald-900/60 hover:bg-emerald-900/40 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <span>Message Customer on WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 11.D Inventory Management Tab */}
      {activeTab === 'inventory' && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-xl font-bold text-white">Inventory & Stock Levels</h3>
            <p className="text-xs text-gray-400">
              Real-time available stock count per tumbler variant. Low stock warnings trigger automatically when quantity is 5 or below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => {
              const isLow = p.stock <= 5;
              const isOut = p.stock <= 0;
              return (
                <div
                  key={p.id}
                  className={`p-5 rounded-2xl bg-[#121216] border ${
                    isOut
                      ? 'border-red-900/60'
                      : isLow
                      ? 'border-amber-900/60'
                      : 'border-[#222228]'
                  } space-y-3`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm truncate">{p.name}</h4>
                    {isOut ? (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 font-bold">
                        OUT OF STOCK
                      </span>
                    ) : isLow ? (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold animate-pulse">
                        LOW STOCK
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">
                        HEALTHY
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-gray-400">Available Stock:</span>
                    <span className="text-2xl font-extrabold text-white">{p.stock}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#1f1f26]">
                    <button
                      onClick={() => saveProduct({ stock: Math.max(0, p.stock - 5) }, p.id)}
                      className="px-2.5 py-1 rounded bg-[#18181f] text-gray-300 hover:text-white text-xs"
                    >
                      -5
                    </button>
                    <button
                      onClick={() => saveProduct({ stock: Math.max(0, p.stock - 1) }, p.id)}
                      className="px-2.5 py-1 rounded bg-[#18181f] text-gray-300 hover:text-white text-xs"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => saveProduct({ stock: p.stock + 1 }, p.id)}
                      className="px-2.5 py-1 rounded bg-[#18181f] text-gray-300 hover:text-white text-xs"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => saveProduct({ stock: p.stock + 10 }, p.id)}
                      className="px-2.5 py-1 rounded bg-[#18181f] text-gray-300 hover:text-white text-xs"
                    >
                      +10
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 11.F Store Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-[#121216] border border-[#222228] rounded-3xl p-6 sm:p-8 space-y-6 max-w-3xl animate-in fade-in">
          <div>
            <h3 className="text-xl font-bold text-white">Store Configuration & Policies</h3>
            <p className="text-xs text-gray-400">
              Update official contact numbers, nationwide delivery fee, and announcement text.
            </p>
          </div>

          {settingsSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Store settings updated successfully in Firestore.</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Store Brand Name
                </label>
                <input
                  type="text"
                  required
                  value={storeSettingsForm.storeName}
                  onChange={(e) =>
                    setStoreSettingsForm({ ...storeSettingsForm, storeName: e.target.value })
                  }
                  className="w-full bg-[#18181f] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#2a2a34] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Official WhatsApp Number
                </label>
                <input
                  type="text"
                  required
                  value={storeSettingsForm.whatsappNumber}
                  onChange={(e) =>
                    setStoreSettingsForm({ ...storeSettingsForm, whatsappNumber: e.target.value })
                  }
                  className="w-full bg-[#18181f] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#2a2a34] focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Official Contact Email
                </label>
                <input
                  type="email"
                  required
                  value={storeSettingsForm.contactEmail}
                  onChange={(e) =>
                    setStoreSettingsForm({ ...storeSettingsForm, contactEmail: e.target.value })
                  }
                  className="w-full bg-[#18181f] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#2a2a34] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Standard Nationwide COD Shipping (PKR)
                </label>
                <input
                  type="number"
                  required
                  value={storeSettingsForm.shippingCharges}
                  onChange={(e) =>
                    setStoreSettingsForm({
                      ...storeSettingsForm,
                      shippingCharges: Number(e.target.value),
                    })
                  }
                  className="w-full bg-[#18181f] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#2a2a34] focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Free Shipping Threshold (PKR)
              </label>
              <input
                type="number"
                value={storeSettingsForm.freeShippingThreshold}
                onChange={(e) =>
                  setStoreSettingsForm({
                    ...storeSettingsForm,
                    freeShippingThreshold: Number(e.target.value),
                  })
                }
                className="w-full bg-[#18181f] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#2a2a34] focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Announcement Bar Text
              </label>
              <input
                type="text"
                value={storeSettingsForm.announcementText}
                onChange={(e) =>
                  setStoreSettingsForm({
                    ...storeSettingsForm,
                    announcementText: e.target.value,
                  })
                }
                className="w-full bg-[#18181f] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#2a2a34] focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                7-Day Replacement Policy Text
              </label>
              <textarea
                rows={3}
                value={storeSettingsForm.returnPolicy}
                onChange={(e) =>
                  setStoreSettingsForm({ ...storeSettingsForm, returnPolicy: e.target.value })
                }
                className="w-full bg-[#18181f] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#2a2a34] focus:outline-none focus:border-[#d4af37] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="py-3 px-6 rounded-xl gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-90 shadow flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingSettings ? 'Saving...' : 'Save Settings to Firestore'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {isEditingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121216] border border-[#2a2a32] rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white">
              {currentEditId ? 'Edit Tumbler Listing' : 'Add New Tumbler'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HYDROVA Apex 40oz Insulated Tumbler"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full bg-[#18181f] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#2a2a34] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  className="w-full bg-[#18181f] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#2a2a34] focus:outline-none focus:border-[#d4af37] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full bg-[#18181f] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#2a2a34] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Compare Price (PKR)
                  </label>
                  <input
                    type="number"
                    value={prodComparePrice}
                    onChange={(e) => setProdComparePrice(Number(e.target.value))}
                    className="w-full bg-[#18181f] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#2a2a34] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Initial Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full bg-[#18181f] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#2a2a34] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Colors (comma separated)
                  </label>
                  <input
                    type="text"
                    value={prodColors}
                    onChange={(e) => setProdColors(e.target.value)}
                    className="w-full bg-[#18181f] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#2a2a34] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Capacity
                  </label>
                  <input
                    type="text"
                    value={prodCapacity}
                    onChange={(e) => setProdCapacity(e.target.value)}
                    className="w-full bg-[#18181f] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#2a2a34] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              {/* Image selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Tumbler Photography Image (Unbranded High-Res Studio Shot)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setProdImagePreset('black')}
                    className={`p-2 rounded-xl border text-xs flex flex-col items-center gap-1.5 ${
                      prodImagePreset === 'black'
                        ? 'border-[#d4af37] bg-[#221c10] text-[#d4af37]'
                        : 'border-[#2a2a34] text-gray-400'
                    }`}
                  >
                    <img src={ASSETS.matteBlack} alt="" className="w-10 h-10 object-contain" />
                    <span>Matte Black</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProdImagePreset('gold')}
                    className={`p-2 rounded-xl border text-xs flex flex-col items-center gap-1.5 ${
                      prodImagePreset === 'gold'
                        ? 'border-[#d4af37] bg-[#221c10] text-[#d4af37]'
                        : 'border-[#2a2a34] text-gray-400'
                    }`}
                  >
                    <img src={ASSETS.gold} alt="" className="w-10 h-10 object-contain" />
                    <span>Gold Edition</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProdImagePreset('silver')}
                    className={`p-2 rounded-xl border text-xs flex flex-col items-center gap-1.5 ${
                      prodImagePreset === 'silver'
                        ? 'border-[#d4af37] bg-[#221c10] text-[#d4af37]'
                        : 'border-[#2a2a34] text-gray-400'
                    }`}
                  >
                    <img src={ASSETS.silver} alt="" className="w-10 h-10 object-contain" />
                    <span>Brushed Silver</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProdImagePreset('custom')}
                    className={`p-2 rounded-xl border text-xs flex flex-col items-center gap-1.5 ${
                      prodImagePreset === 'custom'
                        ? 'border-[#d4af37] bg-[#221c10] text-[#d4af37]'
                        : 'border-[#2a2a34] text-gray-400'
                    }`}
                  >
                    <div className="w-10 h-10 rounded bg-[#202028] flex items-center justify-center text-xs">URL</div>
                    <span>Custom Image</span>
                  </button>
                </div>

                {prodImagePreset === 'custom' && (
                  <input
                    type="url"
                    placeholder="https://..."
                    value={prodCustomImageUrl}
                    onChange={(e) => setProdCustomImageUrl(e.target.value)}
                    className="w-full bg-[#18181f] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#2a2a34] focus:outline-none focus:border-[#d4af37]"
                  />
                )}
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodActive}
                    onChange={(e) => setProdActive(e.target.checked)}
                    className="rounded text-[#d4af37] focus:ring-0 w-4 h-4 bg-[#18181f] border-[#2a2a34]"
                  />
                  <span>Active &amp; Visible on Store</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodFeatured}
                    onChange={(e) => setProdFeatured(e.target.checked)}
                    className="rounded text-[#d4af37] focus:ring-0 w-4 h-4 bg-[#18181f] border-[#2a2a34]"
                  />
                  <span>Mark as Featured (Homepage)</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#1f1f26]">
                <button
                  type="button"
                  onClick={() => setIsEditingProduct(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#18181f] text-gray-300 text-xs font-semibold hover:bg-[#202028]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="px-6 py-2.5 rounded-xl gold-gradient-bg text-black text-xs font-extrabold shadow"
                >
                  {savingProduct ? 'Saving...' : 'Save Tumbler to Firestore'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
