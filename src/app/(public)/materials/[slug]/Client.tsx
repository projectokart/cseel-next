'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield, CheckCircle, ArrowLeft, Share2, Heart,
  Package, ChevronRight, Check, Plus, Minus, Send, X, School, BookOpen, FileText
} from "lucide-react";
import { useMaterialsRequisition } from "@/contexts/MaterialsRequisitionContext";
import { useToast } from "@/hooks/use-toast";
import { getMaterialBySlugOrId, MaterialItem, getRelatedMaterials } from "@/lib/materialsData";
import PageTransition from "@/components/shared/PageTransition";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { QuotationModal } from "@/features/materials";

export default function MaterialDetailClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { getItemQty, incrementQty, decrementQty } = useMaterialsRequisition();
  const { toast } = useToast();

  const [item, setItem] = useState<MaterialItem | null>(() => getMaterialBySlugOrId(slug) || null);
  const [loading, setLoading] = useState(!item);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  useEffect(() => {
    const local = getMaterialBySlugOrId(slug);
    if (local) {
      setItem(local);
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-[#005689] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-gray-500">Loading apparatus description...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl">🔬</div>
        <h1 className="text-2xl font-bold text-gray-900">Physics Apparatus Not Found</h1>
        <p className="text-sm text-gray-500 max-w-md">
          The apparatus &quot;{slug}&quot; could not be found in the catalog.
        </p>
        <Link
          href="/materials"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#005689] text-white text-sm font-semibold rounded-xl hover:bg-[#003c6e] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Physics Materials Catalog
        </Link>
      </div>
    );
  }

  const currentQty = getItemQty(item.id);
  const isSelected = currentQty > 0;
  const relatedItems = getRelatedMaterials(item, 4);

  const handleSelect = () => {
    incrementQty(item.id, {
      id: item.id,
      slug: item.slug,
      name: item.name,
      sku: item.sku,
      category: item.cbse_chapter,
      image_url: item.image_url,
    });
    toast({
      title: "Apparatus Selected ✓",
      description: `${item.name} added to quotation list.`,
    });
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${item.name} (${item.sku}) - Physics Lab Apparatus`,
          text: `Check out ${item.name} on CSEEL Experiential Learning!`,
          url,
        });
      } catch (e) {}
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link Copied!", description: "Apparatus link copied to clipboard." });
    }
  };

  return (
    <PageTransition>
      <div className="bg-[#f8fafc] min-h-screen py-6 md:py-10">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-6 overflow-x-auto whitespace-nowrap pb-1">
            <Link href="/" className="hover:text-[#005689] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <Link href="/materials" className="hover:text-[#005689] transition-colors">Physics Materials</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="text-gray-600 truncate max-w-[200px]">{item.cbse_chapter}</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="font-semibold text-gray-900 truncate max-w-[200px]">{item.name}</span>
          </nav>

          {/* Clean Learning Showcase Card */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-sm mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

              {/* Image Frame */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-gray-100 flex items-center justify-center p-6 shadow-inner">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (item.cdn_image_url && target.src !== item.cdn_image_url) {
                        target.src = item.cdn_image_url;
                      }
                    }}
                    className="w-full h-full object-contain"
                  />

                  {/* SKU Badge - Bottom Left */}
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-sm text-white text-[10px] font-mono font-bold rounded-md">
                    SKU: {item.sku}
                  </span>

                  {/* Wishlist */}
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    aria-label="Save apparatus"
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:bg-white text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                  </button>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                  <span className="text-[11px] font-semibold text-slate-600">
                    Experiential Learning Apparatus &bull; Science Practical Calibration
                  </span>
                </div>
              </div>

              {/* Description & Selection Area */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  {/* Chapter Pill */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EDF5FA] text-[#005689] border border-blue-200">
                      {item.cbse_chapter}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      CBSE / NCERT Syllabus
                    </span>
                  </div>

                  {/* Apparatus Name */}
                  <h1 className="text-2xl md:text-3xl font-extrabold text-[#003c6e] leading-tight mb-4">
                    {item.name}
                  </h1>

                  {/* Description directly from catalog */}
                  <div className="p-5 bg-slate-50/70 border border-slate-200/80 rounded-2xl mb-6">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#005689]" /> Apparatus Description &amp; Purpose
                    </h3>
                    <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line font-normal">
                      {item.description}
                    </div>
                  </div>
                </div>

                {/* Selection & Quotation Action */}
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Select / Stepper Button */}
                    {currentQty === 0 ? (
                      <button
                        onClick={handleSelect}
                        className="flex-1 h-12 px-6 rounded-xl font-semibold text-sm bg-[#005689] text-white hover:bg-[#003c6e] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span>Select</span>
                      </button>
                    ) : (
                      <QuantityStepper
                        value={currentQty}
                        onIncrement={() =>
                          incrementQty(item.id, {
                            id: item.id,
                            slug: item.slug,
                            name: item.name,
                            sku: item.sku,
                            category: item.cbse_chapter,
                            image_url: item.image_url,
                          })
                        }
                        onDecrement={() => decrementQty(item.id)}
                        size="lg"
                        showLabel
                        label="Qty:"
                        className="flex-1"
                      />
                    )}

                    {/* Get Quotation Direct Button */}
                    <button
                      onClick={() => setQuoteModalOpen(true)}
                      className="h-12 px-6 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-black active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
                    >
                      <FileText className="w-4 h-4 text-blue-300" />
                      <span>Get Quotation</span>
                    </button>

                    {/* Share */}
                    <button
                      onClick={handleShare}
                      title="Share Apparatus"
                      className="h-12 w-12 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center shrink-0"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-500 text-center sm:text-left">
                    CSEEL provides turn-key science laboratory setup, teacher pedagogy training, and institutional quotation support.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Related Apparatuses */}
          {relatedItems.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg md:text-xl font-black text-[#003c6e]">Related Practical Apparatus</h2>
                  <p className="text-xs text-gray-500">More equipment from {item.cbse_chapter}</p>
                </div>
                <Link
                  href="/materials"
                  className="text-xs font-bold text-[#005689] hover:underline"
                >
                  View All Materials &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {relatedItems.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/materials/${rel.slug}`}
                    className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-square bg-white rounded-xl mb-3 overflow-hidden flex items-center justify-center p-2 border border-gray-100">
                        <img
                          src={rel.image_url}
                          alt={rel.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[#005689] uppercase tracking-wider block mb-1 truncate">
                        {rel.cbse_chapter}
                      </span>
                      <h3 className="text-xs font-bold text-gray-900 group-hover:text-[#005689] line-clamp-2 mb-1">
                        {rel.name}
                      </h3>
                      <span className="text-[10px] font-mono text-gray-400 block">
                        {rel.sku}
                      </span>
                    </div>
                    <div className="pt-2 mt-2 border-t border-gray-100 text-right">
                      <span className="text-[11px] font-bold text-[#005689] group-hover:underline">
                        Details &rarr;
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modular Institutional Quotation Modal */}
        <QuotationModal
          isOpen={quoteModalOpen}
          onClose={() => setQuoteModalOpen(false)}
          singleItem={{
            name: item.name,
            sku: item.sku,
            chapter: item.cbse_chapter,
            quantity: `${Math.max(1, currentQty)} Sets`,
          }}
        />

      </div>
    </PageTransition>
  );
}
