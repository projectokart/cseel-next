'use client';

import React, { useState } from 'react';
import PageTransition from '@/components/shared/PageTransition';
import { useMaterialsRequisition } from '@/contexts/MaterialsRequisitionContext';
import {
  ApparatusItem,
  MaterialsHeroSlider,
  MaterialCard,
  MaterialsFilterBar,
  MaterialsFilterDrawer,
  RequisitionDrawer,
  QuotationModal,
  useMaterialsFilter,
} from '@/features/materials';
import physicsMaterialsRaw from '@/data/physics_materials_954.json';

const INITIAL_MATERIALS: ApparatusItem[] = (physicsMaterialsRaw as any[]).map((m) => ({
  id: m.id || m.sku,
  sku: m.sku || m.id,
  name: m.name,
  scientific_name: m.name,
  slug: m.slug || `${(m.sku || m.id).toLowerCase()}`,
  description: m.description || '',
  cbse_chapter: m.cbse_chapter || 'Laboratory Hardware & Measurement Essentials',
  image_url: m.image_url || `/images/materials/physics/${m.sku || m.id}.jpg`,
  cdn_image_url:
    m.cdn_image_url ||
    `https://cdn.jsdelivr.net/gh/projectokart/cseel-next@main/public/images/materials/physics/${m.sku || m.id}.jpg`,
  admin_cost_ref: m.admin_cost_ref || 500,
}));

export default function MaterialsClient() {
  const [products] = useState<ApparatusItem[]>(INITIAL_MATERIALS);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  // Modular Requisition State
  const {
    items: requisitionItems,
    totalQuantity,
    getItemQty,
    incrementQty,
    decrementQty,
    removeItem,
    clearAll,
    drawerOpen: requisitionDrawerOpen,
    setDrawerOpen: setRequisitionDrawerOpen,
  } = useMaterialsRequisition();

  // Modular Filter & Search Hook
  const {
    search,
    setSearch,
    activeChapter,
    setActiveChapter,
    activeSort,
    setActiveSort,
    chapterListWithCounts,
    quickChapters,
    filtered,
    displayed,
    hasMore,
    sentinelRef,
    loadMore,
  } = useMaterialsFilter(products);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <PageTransition>
      <div className="bg-[#f7f8fa] min-h-screen">
        {/* Swiper Hero Image Slider (Same as /subject/physics) */}
        <MaterialsHeroSlider
          totalQuantity={totalQuantity}
          onOpenRequisition={() => setRequisitionDrawerOpen(true)}
          onExploreClick={() => {
            const el = document.getElementById('materials-catalog-grid');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Modular Google M3 Filter & Search Bar */}
        <MaterialsFilterBar
          search={search}
          onSearchChange={setSearch}
          activeChapter={activeChapter}
          onSelectChapter={setActiveChapter}
          quickChapters={quickChapters}
          totalProductsCount={products.length}
          filteredCount={filtered.length}
          displayedCount={displayed.length}
          activeSort={activeSort}
          onApplySort={setActiveSort}
          onOpenFilterDrawer={() => setIsFilterSheetOpen(true)}
          selectedCount={totalQuantity}
          onOpenRequisitionDrawer={() => setRequisitionDrawerOpen(true)}
        />

        {/* Product Grid (Google Shopping Style Card Grid - Image 3) */}
        <section id="materials-catalog-grid" className="py-4 pb-12">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            {displayed.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 p-8 max-w-md mx-auto">
                <p className="text-4xl mb-2">🔬</p>
                <h3 className="text-sm font-bold text-gray-800">No apparatuses match your search</h3>
                <p className="text-xs text-gray-500 mt-1 mb-4">
                  Try searching with another keyword or reset the chapter filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setActiveChapter('All');
                  }}
                  className="px-4 py-2 bg-[#005689] text-white rounded-xl text-xs font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {displayed.map((p) => (
                  <MaterialCard
                    key={p.id}
                    product={p}
                    quantity={getItemQty(p.id)}
                    isWishlisted={wishlist.includes(p.id)}
                    onIncrement={() =>
                      incrementQty(p.id, {
                        id: p.id,
                        slug: p.slug,
                        name: p.name,
                        sku: p.sku,
                        category: p.cbse_chapter,
                        image_url: p.image_url,
                      })
                    }
                    onDecrement={() => decrementQty(p.id)}
                    onToggleWishlist={() => toggleWishlist(p.id)}
                  />
                ))}
              </div>
            )}

            {/* Infinite Scroll Sentinel & Load More */}
            <div ref={sentinelRef} className="py-8 flex flex-col items-center justify-center gap-3">
              {hasMore && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-[#006FCC] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-bold text-slate-500 font-['Montserrat',sans-serif]">
                      Loading next 25 apparatuses... ({displayed.length} of {filtered.length})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={loadMore}
                    className="px-5 py-2 text-xs font-bold text-[#006FCC] bg-white border border-[#006FCC]/30 hover:bg-[#EDF5FA] rounded-xl shadow-2xs transition active:scale-95 cursor-pointer"
                  >
                    Load Next 25 Apparatuses
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Google Refine Results Left Drawer (Uniform with /subject/physics) */}
        <MaterialsFilterDrawer
          isOpen={isFilterSheetOpen}
          onClose={() => setIsFilterSheetOpen(false)}
          activeChapter={activeChapter}
          onApplyChapter={setActiveChapter}
          activeSort={activeSort}
          onApplySort={setActiveSort}
          chapterListWithCounts={chapterListWithCounts}
          filteredCount={filtered.length}
        />

        {/* Google Material 3 Standard Requisition Drawer (Right) */}
        <RequisitionDrawer
          isOpen={requisitionDrawerOpen}
          onClose={() => setRequisitionDrawerOpen(false)}
          items={requisitionItems}
          totalQuantity={totalQuantity}
          onIncrement={(id) => incrementQty(id)}
          onDecrement={(id) => decrementQty(id)}
          onRemove={(id) => removeItem(id)}
          onRequestQuotation={() => {
            setRequisitionDrawerOpen(false);
            setOrderModalOpen(true);
          }}
        />

        {/* Quotation Request Modal */}
        <QuotationModal
          isOpen={orderModalOpen}
          onClose={() => setOrderModalOpen(false)}
          items={requisitionItems}
          onSuccess={() => {
            clearAll();
          }}
        />
      </div>
    </PageTransition>
  );
}
