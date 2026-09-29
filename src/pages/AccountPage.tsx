import React, { useState, useEffect } from 'react';
import {
  User,
  MapPin,
  Package,
  LogOut,
  Save,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';

interface AccountPageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate }) => {
  const { currentUser, userProfile, logout, updateUserProfileData, isAdmin } = useAuth();
  const { getUserOrders } = useStore();

  const [name, setName] = useState(userProfile?.name || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [city, setCity] = useState(userProfile?.city || '');
  const [address, setAddress] = useState(userProfile?.address || '');

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setPhone(userProfile.phone || '');
      setCity(userProfile.city || '');
      setAddress(userProfile.address || '');
    }
  }, [userProfile]);

  useEffect(() => {
    if (currentUser) {
      setLoadingOrders(true);
      getUserOrders(currentUser.uid)
        .then((data) => setOrders(data))
        .finally(() => setLoadingOrders(false));
    }
  }, [currentUser]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfileData({
        name: name.trim(),
        phone: phone.trim(),
        city: city.trim(),
        address: address.trim(),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f1f26] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            Customer Portal
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Hello, {userProfile?.name || currentUser?.email}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage your personal profile, saved delivery address, and view your HYDROVA orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => onNavigate('admin')}
              className="px-4 py-2 rounded-xl bg-[#221c10] text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold hover:bg-[#d4af37] hover:text-black flex items-center gap-1.5 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </button>
          )}

          <button
            onClick={() => {
              logout();
              onNavigate('home');
            }}
            className="px-4 py-2 rounded-xl bg-[#17171e] text-red-400 hover:text-red-300 border border-[#262630] text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Saved Shipping Profile Form */}
        <div className="lg:col-span-5 bg-[#121216] border border-[#222228] rounded-3xl p-6 sm:p-7 space-y-6">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#d4af37]" />
            <h3 className="font-bold text-base text-white">Default Shipping Details</h3>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Profile and address successfully saved!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#18181f] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#2a2a34] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                placeholder="03001234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#18181f] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#2a2a34] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                City
              </label>
              <input
                type="text"
                placeholder="e.g. Lahore, Karachi, Islamabad"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#18181f] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#2a2a34] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Complete Street Address
              </label>
              <textarea
                rows={3}
                placeholder="House #, Street, Area"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#18181f] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#2a2a34] focus:border-[#d4af37] focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 rounded-xl bg-[#221c10] text-[#d4af37] border border-[#d4af37]/40 hover:bg-[#d4af37] hover:text-black font-semibold text-xs transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Shipping Address'}</span>
            </button>
          </form>
        </div>

        {/* Right: Order History */}
        <div className="lg:col-span-7 bg-[#121216] border border-[#222228] rounded-3xl p-6 sm:p-7 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#d4af37]" />
              <h3 className="font-bold text-base text-white">Order History</h3>
            </div>
            <span className="text-xs text-gray-400">{orders.length} order(s)</span>
          </div>

          {loadingOrders ? (
            <div className="p-8 text-center text-xs text-gray-500">
              Loading orders from database...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#18181e] text-gray-500 flex items-center justify-center mx-auto">
                <Package className="w-6 h-6" />
              </div>
              <p className="text-sm text-gray-300 font-medium">No orders placed yet</p>
              <p className="text-xs text-gray-500">
                Browse our collection of stainless steel tumblers to place your first COD order.
              </p>
              <button
                onClick={() => onNavigate('shop')}
                className="mt-2 px-5 py-2 rounded-xl gold-gradient-bg text-black text-xs font-bold hover:opacity-90"
              >
                Shop Now
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-2xl bg-[#17171e] border border-[#24242e] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[#d4af37]">
                        {ord.orderNumber}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#201d14] text-[#e6cb85] border border-[#d4af37]/30">
                        {ord.orderStatus}
                      </span>
                    </div>

                    <div className="text-xs text-gray-400 mt-1">
                      {ord.items.map((i) => `${i.productName} (${i.color}) x${i.quantity}`).join(', ')}
                    </div>

                    <div className="text-[11px] text-gray-500 mt-1">
                      Placed: {new Date(ord.createdAt).toLocaleDateString()} • {ord.paymentMethod}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                    <div className="text-sm font-bold text-white">
                      Rs. {ord.finalTotal.toLocaleString()}
                    </div>
                    <button
                      onClick={() => onNavigate('track', ord.orderNumber)}
                      className="px-3 py-1.5 rounded-lg bg-[#221c10] text-[#d4af37] border border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-black text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>Track</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
