'use client';

import React from 'react';
import { Check } from 'lucide-react';
import EditableText from '@/components/schools/template/EditableText';
import { FACILITY_CATEGORIES } from '@/components/schools/FacilityData';
import { renderFacilityIcon, renderCategoryHeaderIcon } from '@/components/schools/FacilityIcons';

export interface SchoolFacilitiesSectionProps {
  isEditMode?: boolean;
  effectiveFacilities?: any[];
  templateCtx?: any;
}

export default function SchoolFacilitiesSection({
  isEditMode = false,
  effectiveFacilities = [],
  templateCtx,
}: SchoolFacilitiesSectionProps) {
  const hasAnySelectedFacility = FACILITY_CATEGORIES.some(category => 
    category.items.some(item => effectiveFacilities.some(f => f.name === item.name))
  );

  return (
    <section id="facilities" className="py-12 sm:py-20 bg-[#FEFBF3] border-t border-[#F4EBD9]/80 relative overflow-hidden">
      {/* Decorative ambient background blur */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#EDF5FA]/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center sm:text-left mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] bg-[#EDF5FA] border border-[#D6EDFF] px-3.5 py-1.5 rounded-full mb-3 shadow-2xs">
            <span className="w-2 h-2 bg-[#FBBC04] rounded-full inline-block" />
            <EditableText
              contentKey="facilities_eyebrow"
              value="OUR CAMPUS INFRASTRUCTURE"
              className="inline-block"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
            <EditableText
              contentKey="facilities_heading"
              value="Campus Facilities &"
              className="inline"
            />
            <span className="text-[#005689] block mt-0.5">Learning Infrastructure</span>
          </h2>

          {isEditMode ? (
            <p className="mt-3 text-slate-600 font-medium max-w-2xl text-xs sm:text-sm">
              Click facilities to toggle them on or off. This updates your institutional profile in real time for prospective parents.
            </p>
          ) : (
            <p className="mt-3 text-slate-600 font-medium max-w-2xl text-sm sm:text-base leading-relaxed">
              Explore the verified digital, experiential, and athletic infrastructure facilities available on campus.
            </p>
          )}
        </div>

        <div className="space-y-10">
          {FACILITY_CATEGORIES.map((category) => {
            const selectedItemsInCategory = category.items.filter(item => 
              effectiveFacilities.some(f => f.name === item.name)
            );
            
            if (!isEditMode && selectedItemsInCategory.length === 0) return null;

            return (
              <div
                key={category.category}
                className="bg-white/95 rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 border border-[#F4EBD9] shadow-[0_12px_36px_rgba(0,35,70,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] space-y-6"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#EDF5FA] text-[#005689] border border-[#D6EDFF] flex items-center justify-center shadow-xs">
                      {renderCategoryHeaderIcon(category.category, category.categoryIcon)}
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                        {category.category}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {selectedItemsInCategory.length} Facilities Available
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#005689] bg-[#EDF5FA] border border-[#D6EDFF] px-3 py-1 rounded-full hidden sm:inline-block">
                    Verified Category
                  </span>
                </div>

                {/* Facility Tiles Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
                  {category.items.map((item) => {
                    const isSelected = effectiveFacilities.some(f => f.name === item.name);

                    if (!isEditMode && !isSelected) return null;

                    return (
                      <div
                        key={item.name}
                        onClick={() => {
                          if (!isEditMode) return;
                          if (isSelected) {
                            const existing = effectiveFacilities.find(f => f.name === item.name);
                            if (existing?.id) {
                              templateCtx?.deleteFacilityCard(existing.id);
                            }
                          } else {
                            templateCtx?.addFacilityCard({
                              title: item.name,
                              desc: '',
                              icon: item.icon,
                              badge: category.category,
                              points: []
                            });
                          }
                        }}
                        className={`relative rounded-[22px] p-4 flex flex-col items-center text-center transition-all duration-300 ${
                          isEditMode ? 'cursor-pointer select-none' : ''
                        } ${
                          isSelected
                            ? 'bg-[#F8FAFD] border-2 border-[#D6EDFF] shadow-[0_6px_20px_rgba(0,86,137,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] hover:-translate-y-1 hover:shadow-md hover:border-[#005689]'
                            : 'bg-white/40 border-2 border-dashed border-slate-300 opacity-60 hover:opacity-100 hover:border-slate-400'
                        }`}
                      >
                        {isEditMode && isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}

                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-colors shadow-2xs border ${
                          isSelected 
                            ? 'bg-white text-[#005689] border-[#D6EDFF]' 
                            : 'bg-slate-100 text-slate-400 border-slate-200'
                        }`}>
                          {renderFacilityIcon(item)}
                        </div>

                        <div className="w-full">
                          <h4 className={`text-xs font-black leading-snug ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
                            {item.name}
                          </h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {!isEditMode && !hasAnySelectedFacility && (
            <div className="bg-white/95 rounded-[32px] sm:rounded-[36px] border border-[#F4EBD9] p-10 text-center max-w-xl mx-auto shadow-[0_12px_36px_rgba(0,35,70,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]">
              <div className="w-14 h-14 rounded-2xl bg-[#EDF5FA] text-[#005689] border border-[#D6EDFF] flex items-center justify-center mx-auto mb-4 shadow-xs">
                <Check className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-black text-slate-950">Campus Facilities Verification</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-medium">
                Official infrastructure facilities records are published directly by the institution.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
