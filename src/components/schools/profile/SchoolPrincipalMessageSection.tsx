'use client';

import React from 'react';
import EditableText from '@/components/schools/template/EditableText';
import EditableImage from '@/components/schools/template/EditableImage';
import EditableIcon from '@/components/schools/template/EditableIcon';
import VerifiedBadge from '@/components/schools/template/VerifiedBadge';

export interface SchoolPrincipalMessageSectionProps {
  displayName: string;
  displayPrincipal: string;
  displayUdise: string;
  isLiveTemplate?: boolean;
  isEditMode?: boolean;
  templateData?: any;
  initialProfileData?: any;
}

export default function SchoolPrincipalMessageSection({
  displayName,
  displayPrincipal,
  displayUdise,
  isLiveTemplate = false,
  isEditMode = false,
  templateData,
  initialProfileData,
}: SchoolPrincipalMessageSectionProps) {
  return (
    <section id="principal-message" className="py-14 sm:py-20 bg-[#FEFBF3] border-t border-[#F4EBD9]/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Pill Badge */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] bg-white border border-[#EADBBD] px-3.5 py-1.5 rounded-full shadow-2xs">
            <span className="w-2 h-2 bg-[#FBBC04] rounded-full inline-block" />
            <EditableText contentKey="principal_eyebrow" value="FROM THE PRINCIPAL'S DESK" showVerificationBadge={false} />
          </div>
        </div>

        <div className="mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
            <EditableText
              contentKey="principal_heading_l1"
              value="Inspiring Leadership,"
              className="block text-slate-950"
            />
            <span className="text-[#005689] block mt-0.5">
              <EditableText
                contentKey="principal_heading_l2"
                value="Nurturing Excellence.."
                className="inline text-[#005689]"
              />
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Principal Photo in Iconic Circular/Arched Frame */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden shadow-2xl border-[8px] sm:border-[10px] border-[#005689] bg-slate-100 group">
              <EditableImage
                imageKey="principal_photo"
                src={templateData?.imageOverrides?.principal_photo || initialProfileData?.imageOverrides?.principal_photo}
                defaultSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 250' fill='%23f1f5f9'%3E%3Crect width='200' height='250' fill='%23f8fafc'/%3E%3Ccircle cx='100' cy='85' r='38' fill='%23cbd5e1'/%3E%3Cpath d='M35 210c0-42 29-65 65-65s65 23 65 65z' fill='%23cbd5e1'/%3E%3Ctext x='100' y='235' font-family='sans-serif' font-size='11' font-weight='600' fill='%2394a3b8' text-anchor='middle'%3EPrincipal Desk%3C/text%3E%3C/svg%3E"
                alt={displayPrincipal}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <div className="mt-4 text-center">
              <div className="font-black text-slate-950 text-lg flex items-center justify-center gap-1.5">
                <EditableText
                  contentKey="principal_name"
                  value={displayPrincipal}
                  className="inline"
                />
                <VerifiedBadge fieldKey="principalName" size="sm" />
              </div>
              <div className="text-xs font-bold text-[#005689] mt-0.5 uppercase tracking-wider">
                <EditableText
                  contentKey="principal_designation"
                  value="Principal / Head of Institution"
                  className="inline"
                />
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">
                {displayName} • UDISE: {displayUdise}
              </div>
            </div>
          </div>

          {/* Right Principal Quote & Message */}
          <div className="lg:col-span-8 space-y-6">
            <div className="relative pl-6 sm:pl-8 border-l-4 border-[#005689]">
              <span className="absolute -top-4 -left-2 text-6xl text-[#005689]/20 font-serif select-none pointer-events-none">
                “
              </span>
              <EditableText
                contentKey="principal_quote"
                value="True education is not merely the learning of facts, but the training of the mind to think critically, act ethically, and live compassionately."
                multiline={true}
                rows={3}
                className="text-lg sm:text-xl font-medium text-gray-900 italic leading-relaxed block"
              />
            </div>

            <div className="space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
              <EditableText
                contentKey="principal_body_1"
                value="At our institution, we believe every child arrives with unique curiosity and innate genius. Our dedicated faculty works tirelessly to build a safe, stimulating environment where young scholars test boundaries, conduct hands-on experiments, and develop resilience."
                multiline={true}
                rows={4}
                className="block"
              />

              <EditableText
                contentKey="principal_body_2"
                value="We partner closely with parents and the wider community to instill strong moral compasses alongside 21st-century technological fluency. Together, we are nurturing compassionate architects of tomorrow."
                multiline={true}
                rows={4}
                className="block"
              />
            </div>

            <div className="pt-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-[#005689] flex items-center justify-center">
                <EditableIcon
                  iconKey="principal_badge_icon"
                  defaultIcon="Award"
                  className="w-6 h-6 text-[#005689]"
                />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Leadership Commitment
                </div>
                <div className="text-sm font-bold text-gray-900">
                  <EditableText
                    contentKey="principal_tagline"
                    value="Student-First Academic Excellence & Integrity"
                    className="inline"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
