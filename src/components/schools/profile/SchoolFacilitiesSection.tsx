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
  isTemplate?: boolean;
}

export default function SchoolFacilitiesSection({
  isEditMode = false,
  effectiveFacilities = [],
  templateCtx,
  isTemplate = false,
}: SchoolFacilitiesSectionProps) {
  // In edit mode: show all facilities for administrative customization
  // In public view: STRICTLY show only verified/selected facilities with green ticks
  const isCustomizing = isEditMode;

  const isFacilitySelected = (itemName: string) => {
    const itemKey = itemName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');
    return effectiveFacilities.some(
      (f) =>
        f.name === itemName ||
        f.title === itemName ||
        f.key === itemKey ||
        f.id === itemKey ||
        f.id === itemName
    );
  };

  const hasAnySelectedFacility = FACILITY_CATEGORIES.some((category) =>
    category.items.some((item) => isFacilitySelected(item.name))
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
            const selectedItemsInCategory = isCustomizing
              ? category.items
              : category.items.filter((item) => isFacilitySelected(item.name));

            // In public view: hide any category that has 0 verified/selected facilities
            if (!isCustomizing && selectedItemsInCategory.length === 0) return null;

            return (
              <div key={category.category} className="px-3 py-2.5 sm:px-4 sm:py-3">
                {/* Distinct Visual Category Header with Icon Badge & Divider Line */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-md bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center shrink-0 border border-[#D0E4F5] [&_svg]:!w-3.5 [&_svg]:!h-3.5 [&_img]:!w-3.5 [&_img]:!h-3.5">
                    {renderCategoryHeaderIcon(category.category, category.categoryIcon)}
                  </span>
                  <h3 className="!text-xs sm:!text-[12px] !leading-none !font-bold uppercase tracking-wider font-['Montserrat',sans-serif] text-[#003C6E] m-0">
                    {category.category}
                  </h3>
                  <span className="flex-1 h-px bg-slate-200/90 ml-1.5" />
                </div>

                {/* Readable Compact Chips with Crisp Icons */}
                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                  {selectedItemsInCategory.map((item) => {
                    const isSelected = isFacilitySelected(item.name);

                    // In read-only public view, strictly skip non-selected items
                    if (!isCustomizing && !isSelected) return null;

                    return (
                      <div
                        key={item.name}
                        onClick={() => {
                          if (!isEditMode) return;
                          const alreadySaved = isFacilitySelected(item.name);
                          if (alreadySaved) {
                            const existing = effectiveFacilities.find(
                              (f) =>
                                f.name === item.name ||
                                f.title === item.name ||
                                f.key ===
                                  item.name
                                    .toLowerCase()
                                    .replace(/[^a-z0-9]+/g, '_')
                                    .replace(/(^_|_$)/g, '')
                            );
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
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] sm:text-[11.5px] font-medium leading-tight transition-all ${
                          isEditMode ? 'cursor-pointer select-none active:scale-95' : ''
                        } ${
                          isSelected
                            ? 'bg-emerald-50/80 border border-emerald-500/80 text-emerald-950 font-semibold shadow-2xs hover:border-emerald-600'
                            : 'bg-white border border-dashed border-slate-300 text-slate-400 hover:border-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <span
                          className={`shrink-0 inline-flex items-center [&_svg]:!w-3.5 [&_svg]:!h-3.5 [&_img]:!w-3.5 [&_img]:!h-3.5 ${
                            isSelected ? 'text-emerald-700' : 'text-slate-400'
                          }`}
                        >
                          {renderFacilityIcon(item)}
                        </span>
                        <span className="whitespace-nowrap">{item.name}</span>
                        {isSelected && (
                          <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 ml-0.5 shadow-xs border border-emerald-700/40">
                            <Check className="w-2.5 h-2.5 stroke-[3.5] text-white" />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {!isEditMode && !hasAnySelectedFacility && (
            <div className="px-4 py-5 text-center text-xs text-slate-500 font-medium">
              Official campus infrastructure & facilities data are published upon administrative verification.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
