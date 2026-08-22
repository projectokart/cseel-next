'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MaterialProduct, MaterialCategory, MaterialCategoryKey, CartItem, MaterialOrder } from '../../types/materialTypes';
import { materialsApi } from '../../api/materialsApiClient';
import MaterialCard from './MaterialCard';
import CartDrawer from './CartDrawer';
import OrderTrackingModal from './OrderTrackingModal';
import PincodeDeliveryChecker from './PincodeDeliveryChecker';
import {
  ShoppingBag, Search, Filter, SlidersHorizontal,
  RefreshCw, Package, Check, Sparkles, Truck, ShieldCheck,
  CheckCircle2, X
} from 'lucide-react';

export default function MaterialsStorefront() {
  const [products, setProducts] = useState<MaterialProduct[]>([]);
  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<MaterialCategoryKey[]>([]);
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating' | 'newest'>('featured');
  const [maxPrice, setMaxPrice] = useState(5000);

  // Cart State (Persisted in localStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Order Tracking Modal State
  const [activeOrder, setActiveOrder] = useState<MaterialOrder | null>(null);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [orderSuccessBanner, setOrderSuccessBanner] = useState<MaterialOrder | null>(null);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cseel_lab_cart');
      if (saved) setCartItems(JSON.parse(saved));
    } catch {}
  }, []);

  // Save cart to localStorage
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    try {
      localStorage.setItem('cseel_lab_cart', JSON.stringify(items));
    } catch {}
  };

  const handleAddToCart = (product: MaterialProduct) => {
    const existing = cartItems.find((item) => item.product.id === product.id);
    if (existing) {
      saveCart(cartItems.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)));
    } else {
      saveCart([...cartItems, { product, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    saveCart(cartItems.map((item) => (item.product.id === productId ? { ...item, quantity } : item)));
  };

  const handleRemoveItem = (productId: string) => {
    saveCart(cartItems.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    saveCart([]);
  };

  const handleOrderSuccess = (order: MaterialOrder) => {
    setOrderSuccessBanner(order);
    setActiveOrder(order);
  };

  // Fetch catalog
  const loadStore = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await materialsApi.fetchMaterials({
        searchQuery,
        selectedCategories,
        sortBy,
        maxPrice: maxPrice < 5000 ? maxPrice : undefined,
      });
      setProducts(result.items);
      setCategories(result.categories);
    } catch {}
    finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategories, sortBy, maxPrice]);

  useEffect(() => {
    loadStore();
  }, [loadStore]);

  const toggleCategory = (catKey: MaterialCategoryKey) => {
    setSelectedCategories((prev) =>
      prev.includes(catKey) ? prev.filter((k) => k !== catKey) : [...prev, catKey]
    );
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6">
      
      {/* ── STORE HEADER BANNER ── */}
      <div className="relative rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 p-6 sm:p-10 text-white overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-teal-300 border border-teal-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CSEEL SCIENTIFIC LAB EQUIPMENT STORE</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Certified STEM Hardware, Lab Kits & Precision Glassware
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Institutional laboratory supplies aligned with NEP-2020 pedagogy. Free shipping above ₹999 with 2-4 day express delivery across all states.
          </p>

          {/* Highlights */}
          <div className="flex items-center gap-4 flex-wrap pt-2 text-xs font-bold text-teal-200">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> 100% Quality Guaranteed</span>
            <span className="flex items-center gap-1.5"><Truck className="w-4 h-4" /> Express Institutional Delivery</span>
          </div>
        </div>

        {/* Floating Cart Button */}
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="absolute top-6 right-6 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-950 font-black text-xs rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-2 z-10"
        >
          <ShoppingBag className="w-4 h-4 text-teal-600" />
          <span>Cart ({totalCartCount})</span>
        </button>
      </div>

      {/* ── RECENT ORDER SUCCESS ALERT ── */}
      {orderSuccessBanner && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-black text-emerald-900 dark:text-emerald-200">
                Order #{orderSuccessBanner.orderNumber} Placed Successfully!
              </p>
              <p className="text-emerald-700/90 dark:text-emerald-400 text-[11px]">
                Your package is being prepared for dispatch to {orderSuccessBanner.shippingAddress.city}.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setTrackingOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shrink-0"
          >
            Track Shipment
          </button>
        </div>
      )}

      {/* ── STORE WORKSPACE: Left Sidebar + Right Products ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5 sticky top-20">
            
            {/* PIN Code Checker */}
            <PincodeDeliveryChecker />

            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-black text-xs uppercase text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
                <span>Filter Catalog</span>
              </span>
              {selectedCategories.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedCategories([])}
                  className="text-[10px] font-bold text-teal-600 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-black uppercase text-slate-400">Department Categories</p>
              <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                {categories.map((cat) => {
                  const isChecked = selectedCategories.includes(cat.key);
                  return (
                    <label
                      key={cat.key}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 font-bold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCategory(cat.key)}
                          className="w-3.5 h-3.5 accent-teal-600 rounded"
                        />
                        <span className="truncate">{cat.label}</span>
                      </div>
                      {cat.itemCount !== undefined && (
                        <span className="text-[10px] font-mono text-slate-400">{cat.itemCount}</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Max Price Slider */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                <span>Max Price</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

          </div>
        </div>

        {/* Right Products Feed */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Top Search & Sort Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search lab materials, chemistry reagents, robotics kits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-teal-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
              <span className="text-[11px] text-slate-400 font-bold hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs outline-none text-slate-700 dark:text-slate-200"
              >
                <option value="featured">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 p-4 space-y-3 animate-pulse">
                  <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-8 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 text-slate-500 space-y-2">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-bold">No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {products.map((product) => (
                <MaterialCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}

        </div>

      </div>

      {/* ── CART DRAWER ── */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* ── ORDER TRACKING MODAL ── */}
      <OrderTrackingModal
        isOpen={trackingOpen}
        onClose={() => setTrackingOpen(false)}
        order={activeOrder}
      />

    </div>
  );
}
