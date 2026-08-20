'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart, Star, Shield, AlertTriangle, CheckCircle, Truck, RefreshCw,
  ArrowLeft, Share2, Heart, Plus, Minus, Package, BookOpen, ChevronRight, Check,
  Sparkles, ExternalLink, Info, Award
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { getMaterialBySlugOrId, ALL_MATERIALS, MaterialItem } from "@/lib/materialsData";
import { supabase } from "@/integrations/supabase/client";
import PageTransition from "@/components/shared/PageTransition";
import ScrollReveal from "@/components/shared/ScrollReveal";

const CAT_COLORS: Record<string, string> = {
  Chemistry: "bg-blue-100 text-blue-800 border-blue-200",
  Physics: "bg-purple-100 text-purple-800 border-purple-200",
  Biology: "bg-green-100 text-green-800 border-green-200",
  Electronics: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Robotics: "bg-red-100 text-red-800 border-red-200",
  Environment: "bg-teal-100 text-teal-800 border-teal-200",
  Mathematics: "bg-indigo-100 text-indigo-800 border-indigo-200",
};

const fmt = (n: number) => "₹" + (n || 0).toLocaleString("en-IN");
const discountPercent = (p: number, op: number) => op > p ? Math.round((1 - p / op) * 100) : 0;

export default function MaterialDetailClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { addItem, isInCart, items: cartItems, updateQty } = useCart();
  const { toast } = useToast();

  const [item, setItem] = useState<MaterialItem | null>(() => getMaterialBySlugOrId(slug) || null);
  const [loading, setLoading] = useState(!item);
  const [qty, setQty] = useState(1);
  const [selectedImg, setSelectedImg] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"specs" | "safety" | "includes" | "experiments">("specs");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const local = getMaterialBySlugOrId(slug);
    if (local) {
      setItem(local);
      setSelectedImg(local.image_url);
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-gray-500">Loading lab material details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl">📦</div>
        <h1 className="text-2xl font-bold text-gray-900">Lab Material Not Found</h1>
        <p className="text-sm text-gray-500 max-w-md">
          The item &quot;{slug}&quot; could not be located. It may have been moved or is temporarily unavailable.
        </p>
        <Link
          href="/materials"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Browse All Materials
        </Link>
      </div>
    );
  }

  const inCart = isInCart(item.id);
  const cartItem = cartItems.find((c) => c.lab_material_id === item.id);
  const discount = discountPercent(item.price, item.original_price);
  const relatedItems = ALL_MATERIALS.filter((m) => m.id !== item.id && (m.category === item.category || m.tag === "Bestseller")).slice(0, 3);

  const handleAddToCart = () => {
    addItem(item.id, qty);
    toast({
      title: "Added to Cart!",
      description: `${qty}x ${item.name} added to your lab order.`,
    });
  };

  const handleBuyNow = () => {
    addItem(item.id, qty);
    router.push("/cart");
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.name,
          text: `Check out ${item.name} on CSEEL Lab Store!`,
          url,
        });
      } catch (e) {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({ title: "Link Copied!", description: "Product URL copied to clipboard." });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <PageTransition>
      <div className="bg-gray-50/50 min-h-screen py-6 md:py-10">
        <div className="container mx-auto px-4 max-w-7xl">

          {/* Breadcrumb navigation */}
          <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-6 overflow-x-auto whitespace-nowrap pb-1">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link href="/materials" className="hover:text-primary transition-colors">Lab Materials</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-400">{item.category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-semibold text-gray-900 truncate max-w-[200px]">{item.name}</span>
          </nav>

          {/* Top Product Showcase Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-10 shadow-sm mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

              {/* Left Column: Image Gallery */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group">
                  <img
                    src={selectedImg || item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {item.tag && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full shadow-md uppercase tracking-wider">
                      {item.tag}
                    </span>
                  )}
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    aria-label="Add to wishlist"
                    className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-md hover:bg-white text-gray-700 hover:text-red-500 transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                  </button>
                </div>

                {/* Thumbnails */}
                {item.gallery && item.gallery.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {item.gallery.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImg(img)}
                        className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                          selectedImg === img ? "border-primary shadow-sm" : "border-gray-200 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={img} alt={`${item.name} preview ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 text-center">
                  <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-xl">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-semibold text-gray-700">Lab Certified</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-xl">
                    <Truck className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-semibold text-gray-700">Fast India Delivery</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-xl">
                    <RefreshCw className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-semibold text-gray-700">Easy Replacement</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Product Overview & Buy Section */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  {/* Category & Rating */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${CAT_COLORS[item.category] || "bg-gray-100 text-gray-800"}`}>
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-900">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.rating}</span>
                      <span className="text-gray-400">({item.reviews} reviews)</span>
                    </div>
                    {item.grade && (
                      <span className="px-2.5 py-1 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        {item.grade}
                      </span>
                    )}
                  </div>

                  {/* Title & Scientific Name */}
                  <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
                    {item.name}
                  </h1>
                  <p className="text-sm text-gray-500 font-medium italic mb-4">
                    {item.scientific_name}
                  </p>

                  {/* Price Section */}
                  <div className="flex items-baseline gap-3 p-4 bg-gray-50 rounded-2xl mb-6">
                    <span className="text-3xl md:text-4xl font-black text-gray-900">{fmt(item.price)}</span>
                    {item.original_price > item.price && (
                      <>
                        <span className="text-base text-gray-400 line-through">{fmt(item.original_price)}</span>
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                          Save {discount}%
                        </span>
                      </>
                    )}
                    <span className="text-xs text-gray-400 ml-auto font-medium">Inclusive of all taxes & GST</span>
                  </div>

                  {/* Short Description */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Stock Availability */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.stock > 10 ? "bg-green-500" : item.stock > 0 ? "bg-orange-500 animate-pulse" : "bg-red-500"}`} />
                    <span className="text-sm font-semibold text-gray-700">
                      {item.stock > 10 ? "In Stock - Ready to Dispatch" : item.stock > 0 ? `Only ${item.stock} left in stock!` : "Currently Out of Stock"}
                    </span>
                  </div>
                </div>

                {/* Purchase Controls */}
                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between border-2 border-gray-200 rounded-2xl p-1 bg-white sm:w-36">
                      <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        disabled={qty <= 1}
                        className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-gray-900 text-base">{qty}</span>
                      <button
                        onClick={() => setQty(Math.min(item.stock || 99, qty + 1))}
                        disabled={qty >= (item.stock || 99)}
                        className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={handleAddToCart}
                      disabled={item.stock === 0}
                      className="flex-1 py-3.5 px-6 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary-hover transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>

                    {/* Buy Now Button */}
                    <button
                      onClick={handleBuyNow}
                      disabled={item.stock === 0}
                      className="py-3.5 px-6 rounded-2xl bg-gray-900 text-white font-bold text-sm hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      Buy Now
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={handleShare}
                      title="Share Material"
                      className="p-3.5 rounded-2xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  {inCart && (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl text-xs font-semibold text-green-800">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        This item is currently in your cart ({cartItem?.quantity || 1} units).
                      </span>
                      <Link href="/cart" className="underline hover:text-green-950 font-bold">
                        Go to Cart &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Tabbed In-Depth Information */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-10 shadow-sm mb-12">
            {/* Tab navigation */}
            <div className="flex border-b border-gray-200 gap-4 md:gap-8 overflow-x-auto pb-px mb-8">
              <button
                onClick={() => setActiveTab("specs")}
                className={`pb-3 text-sm md:text-base font-bold transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "specs"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                <Info className="w-4 h-4" />
                Technical Specifications
              </button>
              <button
                onClick={() => setActiveTab("safety")}
                className={`pb-3 text-sm md:text-base font-bold transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "safety"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                <Shield className="w-4 h-4" />
                Safety &amp; Handling Protocols
              </button>
              <button
                onClick={() => setActiveTab("includes")}
                className={`pb-3 text-sm md:text-base font-bold transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "includes"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                <Package className="w-4 h-4" />
                Package Contents
              </button>
              {item.relatedExperiments && item.relatedExperiments.length > 0 && (
                <button
                  onClick={() => setActiveTab("experiments")}
                  className={`pb-3 text-sm md:text-base font-bold transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "experiments"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Related Experiments ({item.relatedExperiments.length})
                </button>
              )}
            </div>

            {/* Tab 1: Technical Specs */}
            {activeTab === "specs" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="text-xs text-gray-400 font-semibold uppercase block mb-1">Specification Summary</span>
                    <p className="text-sm font-medium text-gray-800">{item.specification}</p>
                  </div>
                  {item.grade && (
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="text-xs text-gray-400 font-semibold uppercase block mb-1">Quality Grade</span>
                      <p className="text-sm font-medium text-gray-800">{item.grade}</p>
                    </div>
                  )}
                  {item.purity && (
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="text-xs text-gray-400 font-semibold uppercase block mb-1">Purity Level</span>
                      <p className="text-sm font-medium text-gray-800">{item.purity}</p>
                    </div>
                  )}
                  {item.common_names && item.common_names.length > 0 && (
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="text-xs text-gray-400 font-semibold uppercase block mb-1">Alternative &amp; Common Names</span>
                      <p className="text-sm font-medium text-gray-800">{item.common_names.join(", ")}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Safety & Handling */}
            {activeTab === "safety" && (
              <div className="space-y-6">
                {item.warning && (
                  <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold mb-0.5">Hazard &amp; Safety Warning</h4>
                      <p className="text-xs leading-relaxed">{item.warning}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50">
                    <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" /> Handling Precautions
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{item.handling}</p>
                  </div>
                  <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50">
                    <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary" /> Storage Guidelines
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{item.storage}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Included Items */}
            {activeTab === "includes" && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Items Included in this Box:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {item.includes.map((inc, i) => (
                    <div key={i} className="flex items-center gap-3 p-3.5 bg-gray-50 border border-gray-100 rounded-xl">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm text-gray-800 font-medium">{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Related Experiments */}
            {activeTab === "experiments" && item.relatedExperiments && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  This lab material is utilized in the following virtual simulations and hands-on science experiments:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {item.relatedExperiments.map((exp) => (
                    <Link
                      key={exp.id}
                      href={`/experiment/${exp.id}`}
                      className="group p-4 bg-gray-50 hover:bg-primary/5 border border-gray-100 hover:border-primary/30 rounded-2xl transition-all flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase text-primary mb-1 block">
                          {exp.subject}
                        </span>
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug">
                          {exp.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-semibold text-primary mt-3">
                        Launch Simulation <ExternalLink className="w-3 h-3" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Related Materials Section */}
          {relatedItems.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">Recommended Lab Materials</h2>
                  <p className="text-xs md:text-sm text-gray-500">Complementary apparatus and experiment kits for your lab</p>
                </div>
                <Link
                  href="/materials"
                  className="text-xs md:text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {relatedItems.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/materials/${rel.slug}`}
                    className="group bg-white border border-gray-100 hover:border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col"
                  >
                    <div className="aspect-[4/3] bg-gray-50 overflow-hidden relative">
                      <img
                        src={rel.image_url}
                        alt={rel.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {rel.tag && (
                        <span className="absolute top-3 left-3 px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full uppercase">
                          {rel.tag}
                        </span>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <span className="text-[10px] font-bold text-primary uppercase mb-1">{rel.category}</span>
                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1 mb-1">
                        {rel.name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{rel.description}</p>
                      <div className="mt-auto flex items-baseline justify-between pt-2 border-t border-gray-50">
                        <span className="text-base font-black text-gray-900">{fmt(rel.price)}</span>
                        <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          Details &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </PageTransition>
  );
}
