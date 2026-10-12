'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import EditableText from '@/components/schools/template/EditableText';
import EditableImage from '@/components/schools/template/EditableImage';
import EditableIcon from '@/components/schools/template/EditableIcon';
import VerifiedBadge from '@/components/schools/template/VerifiedBadge';

export interface SchoolAboutSectionProps {
  displayName: string;
  isLiveTemplate: boolean;
  isEditMode: boolean;
  templateData: any;
  initialProfileData?: any;
  imageUrl?: string;
  displayEstablished: string;
  displayStudents: string;
  displayTeachers: string;
  displayCampusArea: string;
  onApplyClick: () => void;
}

export default function SchoolAboutSection({
  displayName,
  isLiveTemplate,
  isEditMode,
  templateData,
  initialProfileData,
  imageUrl,
  displayEstablished,
  displayStudents,
  displayTeachers,
  displayCampusArea,
  onApplyClick,
}: SchoolAboutSectionProps) {
  return (
    <section id="about" className="py-14 sm:py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Narrative Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] bg-[#EDF5FA] border border-[#D6EDFF] px-3.5 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-[#FBBC04] rounded-full inline-block" />
              <EditableText contentKey="about_eyebrow" value="ABOUT OUR INSTITUTION" showVerificationBadge={false} />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                <EditableText
                  contentKey="about_heading_l1"
                  value="More Than Just"
                  className="block text-slate-950"
                  showVerificationBadge={false}
                />
                <span className="text-[#005689] block mt-0.5">
                  <EditableText
                    contentKey="about_heading_l2"
                    value="An Education.."
                    className="inline text-[#005689]"
                    showVerificationBadge={false}
                  />
                </span>
              </h2>
            </div>

            {isLiveTemplate && isEditMode ? (
              <EditableText
                value={templateData?.aboutText || `At ${displayName}, we believe education is not just about knowledge, but about developing confident, compassionate and capable individuals. Our student-centered approach focuses on holistic growth — academically, socially, emotionally and creatively.`}
                fieldKey="aboutText"
                multiline={true}
                rows={4}
                showVerificationBadge={false}
                className="text-slate-600 leading-relaxed text-sm sm:text-base w-full block font-normal"
              />
            ) : (
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-normal">
                {templateData?.aboutText || `At ${displayName}, we believe education is not just about knowledge, but about developing confident, compassionate and capable individuals. Our student-centered approach focuses on holistic growth — academically, socially, emotionally and creatively.`}
              </p>
            )}

            <div>
              <button
                type="button"
                onClick={onApplyClick}
                className="rounded-full px-7 py-3.5 bg-[#005689] hover:bg-[#004168] text-white text-xs sm:text-sm font-extrabold tracking-wide shadow-md shadow-[#005689]/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <EditableText contentKey="about_cta_btn" value="Discover Our Story" showVerificationBadge={false} />
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Right Image Showcase with Arched Frame */}
          <div className="lg:col-span-6 relative pb-6 lg:pb-0 flex items-center justify-center">
            <div className="relative w-full max-w-lg aspect-[4/3] rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-2xl border-[8px] sm:border-[10px] border-[#005689] bg-slate-100 group">
              <EditableImage
                imageKey="about_campus_photo"
                src={templateData?.imageOverrides?.about_campus_photo || initialProfileData?.imageOverrides?.about_campus_photo || imageUrl}
                defaultSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600' fill='%23002B49'%3E%3Crect width='800' height='600' fill='%230D4979'/%3E%3Crect y='480' width='800' height='120' fill='%2309375C'/%3E%3Cg fill='%23196296' opacity='0.7'%3E%3Crect x='100' y='220' width='220' height='260' rx='8'/%3E%3Crect x='360' y='160' width='340' height='320' rx='8'/%3E%3Cpolygon points='400,160 530,70 660,160' fill='%232279B5'/%3E%3Crect x='490' y='180' width='80' height='100' rx='4' fill='%23EDF5FA' opacity='0.8'/%3E%3C/g%3E%3Cg fill='%23EDF5FA' opacity='0.85'%3E%3Ccircle cx='530' cy='230' r='18' fill='%23005689'/%3E%3Crect x='140' y='260' width='40' height='50' rx='4'/%3E%3Crect x='200' y='260' width='40' height='50' rx='4'/%3E%3Crect x='260' y='260' width='40' height='50' rx='4'/%3E%3Crect x='140' y='340' width='40' height='50' rx='4'/%3E%3Crect x='200' y='340' width='40' height='50' rx='4'/%3E%3Crect x='260' y='340' width='40' height='50' rx='4'/%3E%3Crect x='410' y='320' width='50' height='60' rx='4'/%3E%3Crect x='490' y='320' width='50' height='60' rx='4'/%3E%3Crect x='570' y='320' width='50' height='60' rx='4'/%3E%3Crect x='650' y='320' width='35' height='60' rx='4'/%3E%3Crect x='400' y='535' font-family='system-ui, sans-serif' font-size='22' font-weight='bold' fill='%23FFFFFF' text-anchor='middle'%3EOfficial Campus Infrastructure%3C/text%3E%3C/svg%3E"
                alt={`${displayName} Campus Architecture`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Floating Decorative Badge */}
            <div className="absolute -top-4 right-4 sm:right-8 bg-white border border-[#EADBBD] rounded-2xl px-4 py-2 shadow-lg -rotate-3 z-20">
              <EditableText
                contentKey="about_badge_text"
                value="A Campus Built for Big Dreams ✨"
                className="font-serif italic text-[#005689] font-bold text-xs sm:text-sm tracking-wide"
                showVerificationBadge={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
