'use client';

import React from 'react';
import EditableText from '@/components/schools/template/EditableText';
import EditableIcon from '@/components/schools/template/EditableIcon';
import VerifiedBadge from '@/components/schools/template/VerifiedBadge';

export interface SchoolAboutCardsSectionProps {
  displayName: string;
  isLiveTemplate: boolean;
  isEditMode: boolean;
  templateData: any;
  displayEstablished: string;
  displayStudents: string;
  displayTeachers: string;
  displayCampusArea: string;
}

export default function SchoolAboutCardsSection({
  displayName,
  isLiveTemplate,
  isEditMode,
  templateData,
  displayEstablished,
  displayStudents,
  displayTeachers,
  displayCampusArea,
}: SchoolAboutCardsSectionProps) {
  return (
    <section id="about-cards-section" className="relative z-10 w-full bg-[#F8FAFC] py-6 sm:py-8 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header Eyebrow */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#005689] animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
              Institutional Heritage & Infrastructure Metrics
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">
            Verified Campus Record
          </span>
        </div>

        {/* 4 Floating Elevated Cards with 3D Depth */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
          
          {/* Card 1: Established Year */}
          <div className="group relative rounded-2xl bg-white/95 backdrop-blur-md p-3.5 sm:p-4 border border-slate-200/90 shadow-[0_12px_28px_-6px_rgba(0,43,73,0.09),0_4px_12px_-2px_rgba(0,43,73,0.05),inset_0_1px_0_rgba(255,255,255,0.9)] hover:shadow-[0_18px_36px_-6px_rgba(0,86,137,0.18),0_8px_16px_-3px_rgba(0,86,137,0.09),inset_0_1px_0_rgba(255,255,255,1)] hover:-translate-y-1 transition-all duration-200 flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/70 border border-amber-200/80 text-amber-700 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <EditableIcon iconKey="about_stat_icon_1" defaultIcon="Building2" className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <EditableText
                contentKey="about_stat_lbl_1"
                value="Established"
                maxLength={25}
                className="text-[10px] sm:text-[11px] text-slate-500 font-semibold block truncate leading-tight mb-0.5"
                showVerificationBadge={false}
              />
              <div className="text-sm sm:text-base lg:text-lg font-black text-[#002B49] leading-tight truncate flex items-center gap-1">
                {isLiveTemplate && isEditMode ? (
                  <EditableText
                    value={templateData?.establishedYear || (displayEstablished && displayEstablished !== 'N/A' ? displayEstablished : '—')}
                    fieldKey="establishedYear"
                    maxLength={12}
                    showVerificationBadge={false}
                    className="text-sm sm:text-base lg:text-lg font-black text-[#002B49] leading-tight truncate"
                  />
                ) : (
                  <span>{displayEstablished && displayEstablished !== 'N/A' ? displayEstablished : '—'}</span>
                )}
                <VerifiedBadge fieldKey="establishedYear" size="sm" />
              </div>
            </div>
          </div>

          {/* Card 2: Student Strength */}
          <div className="group relative rounded-2xl bg-white/95 backdrop-blur-md p-3.5 sm:p-4 border border-slate-200/90 shadow-[0_12px_28px_-6px_rgba(0,43,73,0.09),0_4px_12px_-2px_rgba(0,43,73,0.05),inset_0_1px_0_rgba(255,255,255,0.9)] hover:shadow-[0_18px_36px_-6px_rgba(0,86,137,0.18),0_8px_16px_-3px_rgba(0,86,137,0.09),inset_0_1px_0_rgba(255,255,255,1)] hover:-translate-y-1 transition-all duration-200 flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-sky-50 to-sky-100/70 border border-sky-200/80 text-[#005689] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <EditableIcon iconKey="about_stat_icon_2" defaultIcon="Users" className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <EditableText
                contentKey="about_stat_lbl_2"
                value="Total Students"
                maxLength={25}
                className="text-[10px] sm:text-[11px] text-slate-500 font-semibold block truncate leading-tight mb-0.5"
                showVerificationBadge={false}
              />
              <div className="text-sm sm:text-base lg:text-lg font-black text-[#002B49] leading-tight truncate flex items-center gap-1">
                {isLiveTemplate && isEditMode ? (
                  <EditableText
                    value={templateData?.totalStudents ? String(templateData.totalStudents) : (displayStudents && displayStudents !== 'N/A' && displayStudents !== '0' ? displayStudents : '—')}
                    fieldKey="totalStudents"
                    maxLength={12}
                    showVerificationBadge={false}
                    className="text-sm sm:text-base lg:text-lg font-black text-[#002B49] leading-tight truncate"
                  />
                ) : (
                  <span>{displayStudents && displayStudents !== 'N/A' && displayStudents !== '0' ? displayStudents : '—'}</span>
                )}
                <VerifiedBadge fieldKey="totalStudents" size="sm" />
              </div>
            </div>
          </div>

          {/* Card 3: Faculty Strength */}
          <div className="group relative rounded-2xl bg-white/95 backdrop-blur-md p-3.5 sm:p-4 border border-slate-200/90 shadow-[0_12px_28px_-6px_rgba(0,43,73,0.09),0_4px_12px_-2px_rgba(0,43,73,0.05),inset_0_1px_0_rgba(255,255,255,0.9)] hover:shadow-[0_18px_36px_-6px_rgba(0,86,137,0.18),0_8px_16px_-3px_rgba(0,86,137,0.09),inset_0_1px_0_rgba(255,255,255,1)] hover:-translate-y-1 transition-all duration-200 flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/70 border border-indigo-200/80 text-indigo-700 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <EditableIcon iconKey="about_stat_icon_3" defaultIcon="Award" className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <EditableText
                contentKey="about_stat_lbl_3"
                value="Expert Faculty"
                maxLength={25}
                className="text-[10px] sm:text-[11px] text-slate-500 font-semibold block truncate leading-tight mb-0.5"
                showVerificationBadge={false}
              />
              <div className="text-sm sm:text-base lg:text-lg font-black text-[#002B49] leading-tight truncate flex items-center gap-1">
                {isLiveTemplate && isEditMode ? (
                  <EditableText
                    value={templateData?.totalTeachers ? String(templateData.totalTeachers) : (displayTeachers && displayTeachers !== 'N/A' && displayTeachers !== '0' ? displayTeachers : '—')}
                    fieldKey="totalTeachers"
                    maxLength={12}
                    showVerificationBadge={false}
                    className="text-sm sm:text-base lg:text-lg font-black text-[#002B49] leading-tight truncate"
                  />
                ) : (
                  <span>{displayTeachers && displayTeachers !== 'N/A' && displayTeachers !== '0' ? displayTeachers : '—'}</span>
                )}
                <VerifiedBadge fieldKey="totalTeachers" size="sm" />
              </div>
            </div>
          </div>

          {/* Card 4: Campus Area */}
          <div className="group relative rounded-2xl bg-white/95 backdrop-blur-md p-3.5 sm:p-4 border border-slate-200/90 shadow-[0_12px_28px_-6px_rgba(0,43,73,0.09),0_4px_12px_-2px_rgba(0,43,73,0.05),inset_0_1px_0_rgba(255,255,255,0.9)] hover:shadow-[0_18px_36px_-6px_rgba(0,86,137,0.18),0_8px_16px_-3px_rgba(0,86,137,0.09),inset_0_1px_0_rgba(255,255,255,1)] hover:-translate-y-1 transition-all duration-200 flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/70 border border-emerald-200/80 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <EditableIcon iconKey="about_stat_icon_4" defaultIcon="Compass" className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <EditableText
                contentKey="about_stat_lbl_4"
                value="Campus Area"
                maxLength={25}
                className="text-[10px] sm:text-[11px] text-slate-500 font-semibold block truncate leading-tight mb-0.5"
                showVerificationBadge={false}
              />
              <div className="text-sm sm:text-base lg:text-lg font-black text-[#002B49] leading-tight truncate flex items-center gap-1">
                {isLiveTemplate && isEditMode ? (
                  <EditableText
                    value={displayCampusArea || '—'}
                    fieldKey="campusArea"
                    maxLength={18}
                    showVerificationBadge={false}
                    className="text-sm sm:text-base lg:text-lg font-black text-[#002B49] leading-tight truncate"
                  />
                ) : (
                  <span>{displayCampusArea || '—'}</span>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
