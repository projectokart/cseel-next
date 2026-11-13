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
  const showAllSampleFacilities = !isEditMode && effectiveFacilities.length === 0;
  const hasAnySelectedFacility =
    showAllSampleFacilities ||
    FACILITY_CATEGORIES.some((category) =>
      category.items.some((item) => effectiveFacilities.some((f) => f.name === item.name))
    );

  return (
    <section id="facilities" className="py-4 sm:py-6 bg-white border-b border-[#E8EAED] relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Balanced Compact Single-Screen Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div>
            <h2 className="!text-[17px] sm:!text-[20px] !leading-tight font-bold font-['Montserrat',sans-serif] text-[#003C6E] tracking-tight pl-2.5 border-l-[3px] border-[#006FCC] m-0">
              <EditableText
                contentKey="facilities_heading"
                value="Campus Facilities &"
                className="inline text-[#003C6E]"
              />{' '}
              <span className="text-[#006FCC]">Infrastructure</span>
            </h2>
          </div>
          {isEditMode && (
            <span className="text-[10.5px] font-bold text-[#006FCC] bg-[#EDF5FA] border border-[#D0E4F5] px-2.5 py-0.5 rounded-full">
              Tap items to toggle
            </span>
          )}
        </div>

        {/* Readable & Compact Categorized Facility Matrix */}
        <div className="rounded-xl border border-[#DCE2E8] bg-[#F8FAFC] divide-y divide-[#E5E7EB]">
          {FACILITY_CATEGORIES.map((category) => {
            const selectedItemsInCategory = showAllSampleFacilities
              ? category.items
              : category.items.filter((item) =>
                  effectiveFacilities.some((f) => f.name === item.name)
                );

            if (!isEditMode && selectedItemsInCategory.length === 0) return null;

            return (
              <div key={category.category} className="px-2.5 py-1.5 sm:px-3.5 sm:py-2">
                {/* Small Category Heading (clearly visible, compact) */}
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[#006FCC] [&_svg]:!w-3.5 [&_svg]:!h-3.5 [&_img]:!w-3.5 [&_img]:!h-3.5 shrink-0 inline-flex items-center">
                    {renderCategoryHeaderIcon(category.category, category.categoryIcon)}
                  </span>
                  <h3 className="!text-[10.5px] sm:!text-[11.5px] !leading-none !font-semibold uppercase tracking-wider font-['Montserrat',sans-serif] text-[#003C6E] m-0">
                    {category.category}
                  </h3>
                </div>

                {/* Readable Compact Chips with Crisp Icons */}
                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                  {category.items.map((item) => {
                    const isSelected =
                      showAllSampleFacilities ||
                      effectiveFacilities.some((f) => f.name === item.name);
                    if (!isEditMode && !isSelected) return null;

                    return (
                      <div
                        key={item.name}
                        onClick={() => {
                          if (!isEditMode) return;
                          const alreadySaved = effectiveFacilities.some((f) => f.name === item.name);
                          if (alreadySaved) {
                            const existing = effectiveFacilities.find((f) => f.name === item.name);
                            if (existing?.id) {
                              templateCtx?.deleteFacilityCard(existing.id);
                            }
                          } else {
                            templateCtx?.addFacilityCard({
                              title: item.name,
                              desc: '',
                              icon: item.icon,
                              badge: category.category,
                              points: [],
                            });
                          }
                        }}
                        className={`inline-flex items-center gap-1.5 px-2 py-[3px] sm:px-2.5 sm:py-1 rounded-md text-[11px] sm:text-[12px] font-normal leading-[1.25] transition-colors ${
                          isEditMode ? 'cursor-pointer select-none' : ''
                        } ${
                          isSelected
                            ? 'bg-white border border-[#DCE1E7] text-[#202124]'
                            : 'bg-white/50 border border-dashed border-slate-300 text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        <span
                          className={`shrink-0 inline-flex items-center [&_svg]:!w-3.5 [&_svg]:!h-3.5 [&_img]:!w-3.5 [&_img]:!h-3.5 ${
                            isSelected ? 'text-[#006FCC]' : 'text-slate-400'
                          }`}
                        >
                          {renderFacilityIcon(item)}
                        </span>
                        <span className="whitespace-nowrap">{item.name}</span>
                        {isEditMode && isSelected && (
                          <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3] shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {!isEditMode && !hasAnySelectedFacility && (
            <div className="px-4 py-4 text-center text-xs text-[#5F6368]">
              Official infrastructure facilities records are published directly by the institution.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
