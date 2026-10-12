'use client';

import React from 'react';
import EditableText from '@/components/schools/template/EditableText';
import EditableIcon from '@/components/schools/template/EditableIcon';

export interface SchoolStatsSectionProps {
  displayBoard: string;
  displayUdise: string;
  totalStudents: number;
  totalTeachers: number;
  classroomsCount: number;
  schoolCategory: string;
  classFrom: string;
  classTo: string;
  templateData: any;
  residentialSchool?: string;
  schoolType?: string;
  medium?: string;
  genderType?: string;
}

export default function SchoolStatsSection({
  displayBoard,
  displayUdise,
  totalStudents,
  totalTeachers,
  classroomsCount,
  schoolCategory,
  classFrom,
  classTo,
  templateData,
  residentialSchool,
  schoolType,
  medium,
  genderType,
}: SchoolStatsSectionProps) {
  const displayResidential = templateData?.residentialSchool || residentialSchool || templateData?.schoolFormat || 'Day School';
  const displaySchoolType = templateData?.management || schoolType || 'Government';
  const displayMedium = templateData?.medium || medium || 'Hindi & English';
  const displayGender = templateData?.genderType || genderType || 'Co-Educational';

  return (
    <section id="school-key-metrics" className="relative z-20 w-full bg-[#FEFBF3] border-b border-[#F4EBD9]/90 py-5 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header Eyebrow */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#005689] animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">
              Key School Profile & Academic Indicators
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">
            Government UDISE+ Verified
          </span>
        </div>

        {/* Floating Elevated Statistical Cards (8 Comprehensive Cards in Responsive Grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-4.5">
          
          {/* Card 1: Board */}
          <div className="group relative rounded-2xl bg-white/95 backdrop-blur-md p-3 sm:p-3.5 border border-slate-200/90 shadow-[0_12px_28px_-6px_rgba(0,43,73,0.09),0_4px_12px_-2px_rgba(0,43,73,0.05),inset_0_1px_0_rgba(255,255,255,0.9)] hover:shadow-[0_18px_36px_-6px_rgba(0,86,137,0.18),0_8px_16px_-3px_rgba(0,86,137,0.09),inset_0_1px_0_rgba(255,255,255,1)] hover:-translate-y-1 transition-all duration-200 flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/70 border border-amber-200/80 text-amber-700 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <EditableIcon iconKey="stat_icon_1" defaultIcon="Award" className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs sm:text-sm font-black text-[#002B49] leading-tight truncate">
                <EditableText
                  contentKey="hero_stat_val_1"
                  value={templateData?.contentOverrides?.['hero_stat_val_1'] || (displayBoard && displayBoard !== 'N/A' ? displayBoard : 'Recognized')}
                  maxLength={14}
                  showVerificationBadge={false}
                  className="text-xs sm:text-sm font-black text-[#002B49] leading-tight truncate block"
                />
              </div>
              <EditableText
                contentKey="hero_stat_lbl_1"
                value="Affiliated Board"
                maxLength={25}
                className="text-[10px] sm:text-[11px] font-semibold text-slate-500 block truncate leading-tight mt-0.5"
                showVerificationBadge={false}
              />
            </div>
          </div>

          {/* Card 2: School Nature (Residential / Day School) */}
          <div className="group relative rounded-2xl bg-white/95 backdrop-blur-md p-3 sm:p-3.5 border border-slate-200/90 shadow-[0_12px_28px_-6px_rgba(0,43,73,0.09),0_4px_12px_-2px_rgba(0,43,73,0.05),inset_0_1px_0_rgba(255,255,255,0.9)] hover:shadow-[0_18px_36px_-6px_rgba(0,86,137,0.18),0_8px_16px_-3px_rgba(0,86,137,0.09),inset_0_1px_0_rgba(255,255,255,1)] hover:-translate-y-1 transition-all duration-200 flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/70 border border-orange-200/80 text-orange-700 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <EditableIcon iconKey="stat_icon_nature" defaultIcon="Home" className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs sm:text-sm font-black text-[#002B49] leading-tight truncate">
                <EditableText
                  contentKey="hero_stat_val_nature"
                  value={templateData?.contentOverrides?.['hero_stat_val_nature'] || displayResidential}
                  maxLength={18}
                  showVerificationBadge={false}
                  className="text-xs sm:text-sm font-black text-[#002B49] leading-tight truncate block"
                />
              </div>
              <EditableText
                contentKey="hero_stat_lbl_nature"
                value="School Nature"
                maxLength={25}
                className="text-[10px] sm:text-[11px] font-semibold text-slate-500 block truncate leading-tight mt-0.5"
                showVerificationBadge={false}
              />
            </div>
          </div>

          {/* Card 3: School Type / Management */}
          <div className="group relative rounded-2xl bg-white/95 backdrop-blur-md p-3 sm:p-3.5 border border-slate-200/90 shadow-[0_12px_28px_-6px_rgba(0,43,73,0.09),0_4px_12px_-2px_rgba(0,43,73,0.05),inset_0_1px_0_rgba(255,255,255,0.9)] hover:shadow-[0_18px_36px_-6px_rgba(0,86,137,0.18),0_8px_16px_-3px_rgba(0,86,137,0.09),inset_0_1px_0_rgba(255,255,255,1)] hover:-translate-y-1 transition-all duration-200 flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/70 border border-emerald-200/80 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <EditableIcon iconKey="stat_icon_mgmt" defaultIcon="Building2" className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs sm:text-sm font-black text-[#002B49] leading-tight truncate">
                <EditableText
                  contentKey="hero_stat_val_mgmt"
                  value={templateData?.contentOverrides?.['hero_stat_val_mgmt'] || displaySchoolType}
                  maxLength={24}
                  showVerificationBadge={false}
                  className="text-xs sm:text-sm font-black text-[#002B49] leading-tight truncate block"
                />
              </div>
              <EditableText
                contentKey="hero_stat_lbl_mgmt"
                value="Management Type"
                maxLength={25}
                className="text-[10px] sm:text-[11px] font-semibold text-slate-500 block truncate leading-tight mt-0.5"
                showVerificationBadge={false}
              />
            </div>
          </div>

          {/* Card 4: Medium of Instruction */}
          <div className="group relative rounded-2xl bg-white/95 backdrop-blur-md p-3 sm:p-3.5 border border-slate-200/90 shadow-[0_12px_28px_-6px_rgba(0,43,73,0.09),0_4px_12px_-2px_rgba(0,43,73,0.05),inset_0_1px_0_rgba(255,255,255,0.9)] hover:shadow-[0_18px_36px_-6px_rgba(0,86,137,0.18),0_8px_16px_-3px_rgba(0,86,137,0.09),inset_0_1px_0_rgba(255,255,255,1)] hover:-translate-y-1 transition-all duration-200 flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/70 border border-blue-200/80 text-blue-700 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <EditableIcon iconKey="stat_icon_med" defaultIcon="BookOpen" className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs sm:text-sm font-black text-[#002B49] leading-tight truncate">
                <EditableText
                  contentKey="hero_stat_val_med"
                  value={templateData?.contentOverrides?.['hero_stat_val_med'] || displayMedium}
                  maxLength={18}
                  showVerificationBadge={false}
                  className="text-xs sm:text-sm font-black text-[#002B49] leading-tight truncate block"
                />
              </div>
              <EditableText
                contentKey="hero_stat_lbl_med"
                value="Instruction Medium"
                maxLength={25}
                className="text-[10px] sm:text-[11px] font-semibold text-slate-500 block truncate leading-tight mt-0.5"
                showVerificationBadge={false}
              />
            </div>
          </div>

          {/* Card 5: Student Gender Type */}
          <div className="group relative rounded-2xl bg-white/95 backdrop-blur-md p-3 sm:p-3.5 border border-slate-200/90 shadow-[0_12px_28px_-6px_rgba(0,43,73,0.09),0_4px_12px_-2px_rgba(0,43,73,0.05),inset_0_1px_0_rgba(255,255,255,0.9)] hover:shadow-[0_18px_36px_-6px_rgba(0,86,137,0.18),0_8px_16px_-3px_rgba(0,86,137,0.09),inset_0_1px_0_rgba(255,255,255,1)] hover:-translate-y-1 transition-all duration-200 flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/70 border border-purple-200/80 text-purple-700 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <EditableIcon iconKey="stat_icon_gender" defaultIcon="Users" className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs sm:text-sm font-black text-[#002B49] leading-tight truncate">
                <EditableText
                  contentKey="hero_stat_val_gender"
                  value={templateData?.contentOverrides?.['hero_stat_val_gender'] || displayGender}
                  maxLength={16}
                  showVerificationBadge={false}
                  className="text-xs sm:text-sm font-black text-[#002B49] leading-tight truncate block"
                />
              </div>
              <EditableText
                contentKey="hero_stat_lbl_gender"
                value="Student Gender"
                maxLength={25}
                className="text-[10px] sm:text-[11px] font-semibold text-slate-500 block truncate leading-tight mt-0.5"
                showVerificationBadge={false}
              />
            </div>
          </div>

          {/* Card 6: Student-Teacher Ratio */}
          <div className="group relative rounded-2xl bg-white/95 backdrop-blur-md p-3 sm:p-3.5 border border-slate-200/90 shadow-[0_12px_28px_-6px_rgba(0,43,73,0.09),0_4px_12px_-2px_rgba(0,43,73,0.05),inset_0_1px_0_rgba(255,255,255,0.9)] hover:shadow-[0_18px_36px_-6px_rgba(0,86,137,0.18),0_8px_16px_-3px_rgba(0,86,137,0.09),inset_0_1px_0_rgba(255,255,255,1)] hover:-translate-y-1 transition-all duration-200 flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-sky-50 to-sky-100/70 border border-sky-200/80 text-[#005689] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <EditableIcon iconKey="stat_icon_2" defaultIcon="UsersRound" className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs sm:text-sm font-black text-[#002B49] leading-tight truncate">
                <EditableText
                  contentKey="hero_stat_val_2"
                  value={templateData?.contentOverrides?.['hero_stat_val_2'] || (totalStudents > 0 && totalTeachers > 0 ? `1:${Math.round(totalStudents / Math.max(totalTeachers, 1))}` : '—')}
                  maxLength={10}
                  showVerificationBadge={false}
                  className="text-xs sm:text-sm font-black text-[#002B49] leading-tight truncate block"
                />
              </div>
              <EditableText
                contentKey="hero_stat_lbl_2"
                value="Student-Teacher Ratio"
                maxLength={25}
                className="text-[10px] sm:text-[11px] font-semibold text-slate-500 block truncate leading-tight mt-0.5"
                showVerificationBadge={false}
              />
            </div>
          </div>

          {/* Card 7: Classrooms & Labs */}
          <div className="group relative rounded-2xl bg-white/95 backdrop-blur-md p-3 sm:p-3.5 border border-slate-200/90 shadow-[0_12px_28px_-6px_rgba(0,43,73,0.09),0_4px_12px_-2px_rgba(0,43,73,0.05),inset_0_1px_0_rgba(255,255,255,0.9)] hover:shadow-[0_18px_36px_-6px_rgba(0,86,137,0.18),0_8px_16px_-3px_rgba(0,86,137,0.09),inset_0_1px_0_rgba(255,255,255,1)] hover:-translate-y-1 transition-all duration-200 flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/70 border border-indigo-200/80 text-indigo-700 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <EditableIcon iconKey="stat_icon_3" defaultIcon="FlaskConical" className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs sm:text-sm font-black text-[#002B49] leading-tight truncate">
                <EditableText
                  contentKey="hero_stat_val_3"
                  value={templateData?.contentOverrides?.['hero_stat_val_3'] || (classroomsCount > 0 ? `${classroomsCount} Rooms` : '—')}
                  maxLength={12}
                  showVerificationBadge={false}
                  className="text-xs sm:text-sm font-black text-[#002B49] leading-tight truncate block"
                />
              </div>
              <EditableText
                contentKey="hero_stat_lbl_3"
                value="Classrooms & Labs"
                maxLength={25}
                className="text-[10px] sm:text-[11px] font-semibold text-slate-500 block truncate leading-tight mt-0.5"
                showVerificationBadge={false}
              />
            </div>
          </div>

          {/* Card 8: School Level / Class Range */}
          <div className="group relative rounded-2xl bg-white/95 backdrop-blur-md p-3 sm:p-3.5 border border-slate-200/90 shadow-[0_12px_28px_-6px_rgba(0,43,73,0.09),0_4px_12px_-2px_rgba(0,43,73,0.05),inset_0_1px_0_rgba(255,255,255,0.9)] hover:shadow-[0_18px_36px_-6px_rgba(0,86,137,0.18),0_8px_16px_-3px_rgba(0,86,137,0.09),inset_0_1px_0_rgba(255,255,255,1)] hover:-translate-y-1 transition-all duration-200 flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100/70 border border-teal-200/80 text-teal-700 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <EditableIcon iconKey="stat_icon_4" defaultIcon="GraduationCap" className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs sm:text-sm font-black text-[#002B49] leading-tight truncate">
                <EditableText
                  contentKey="hero_stat_val_4"
                  value={templateData?.contentOverrides?.['hero_stat_val_4'] || (classFrom && classTo ? `Class ${classFrom} - ${classTo}` : (schoolCategory ? schoolCategory : '—'))}
                  maxLength={18}
                  showVerificationBadge={false}
                  className="text-xs sm:text-sm font-black text-[#002B49] leading-tight truncate block"
                />
              </div>
              <EditableText
                contentKey="hero_stat_lbl_4"
                value="Grades / Level"
                maxLength={25}
                className="text-[10px] sm:text-[11px] font-semibold text-slate-500 block truncate leading-tight mt-0.5"
                showVerificationBadge={false}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
