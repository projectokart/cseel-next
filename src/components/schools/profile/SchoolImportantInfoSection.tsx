'use client';

import React, { useState } from 'react';
import { Lock, ChevronDown, ShieldCheck } from 'lucide-react';
import EditableText from '@/components/schools/template/EditableText';
import VerifiedBadge from '@/components/schools/template/VerifiedBadge';

export interface SchoolImportantInfoSectionProps {
  isLiveTemplate?: boolean;
  isEditMode?: boolean;
  templateData?: any;
  displayBoard: string;
  boardsList: string[];
  displayAffiliationNo: string;
  displayUdise: string;
  displayManagementLabel: string;
  displayMedium: string;
  mediumsList: string[];
  classFrom: string;
  classTo: string;
  displayClasses: string;
}

export default function SchoolImportantInfoSection({
  isLiveTemplate = false,
  isEditMode = false,
  templateData,
  displayBoard,
  boardsList,
  displayAffiliationNo,
  displayUdise,
  displayManagementLabel,
  displayMedium,
  mediumsList,
  classFrom,
  classTo,
  displayClasses,
}: SchoolImportantInfoSectionProps) {
  const [isCredOpen, setIsCredOpen] = useState(false);

  return (
    <section id="important-info" className="py-3 sm:py-4 bg-[#FEFBF3] border-b border-[#F4EBD9]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/95 rounded-[28px] border border-[#F4EBD9] shadow-[0_8px_24px_rgba(0,35,70,0.05),inset_0_1px_0_rgba(255,255,255,0.9)] overflow-hidden">
          
          {/* Collapsible Header */}
          <button
            type="button"
            onClick={() => setIsCredOpen(prev => !prev)}
            className="w-full flex items-center justify-between p-3.5 sm:px-5 text-left hover:bg-[#F8FAFC] transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#EDF5FA] text-[#005689] flex items-center justify-center shrink-0 border border-[#D6EDFF] shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#005689] stroke-[2.4]" />
              </div>
              <div>
                <span className="text-[9px] font-black tracking-widest uppercase text-[#005689] block leading-none">Important Information &amp; Accreditation</span>
                <span className="text-xs sm:text-sm font-black text-slate-900 mt-0.5">Affiliation, UDISE &amp; Regulatory Credentials</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-[#005689] font-extrabold hidden sm:inline bg-[#EDF5FA] border border-[#D6EDFF] px-3 py-1 rounded-full">
                {isCredOpen ? 'Hide Quick Profile' : 'View Quick Profile'}
              </span>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 transition-transform duration-200 ${isCredOpen ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
          </button>

          {/* Quick Profile Content Table (Claymorphic) */}
          {isCredOpen && (
            <div className="border-t border-slate-100 p-4 sm:p-5 bg-gradient-to-b from-[#F8FAFC] to-white">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                
                {/* 1. Board */}
                <div className="bg-white rounded-2xl p-3 border border-[#D6EDFF] shadow-2xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Board</span>
                  <div className="text-xs font-black text-slate-950 mt-1 truncate flex items-center gap-1">
                    {isLiveTemplate && isEditMode ? (
                      <EditableText
                        contentKey="board"
                        value={displayBoard}
                        maxLength={30}
                        className="text-xs font-black text-slate-950 truncate"
                      />
                    ) : (
                      <span>{displayBoard}</span>
                    )}
                    <VerifiedBadge fieldKey="board" size="sm" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#005689] block truncate mt-1" title={boardsList.join(', ')}>
                    {boardsList.length > 1 ? `${boardsList.length} Boards` : 'Recognized'}
                  </span>
                </div>

                {/* 2. Affiliation No */}
                <div className="bg-white rounded-2xl p-3 border border-[#D6EDFF] shadow-2xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Affiliation No.</span>
                  <div className="text-xs font-black text-slate-950 mt-1 font-mono truncate flex items-center gap-1">
                    {isLiveTemplate && isEditMode ? (
                      <EditableText
                        contentKey="affiliationNumber"
                        value={displayAffiliationNo || '—'}
                        maxLength={25}
                        className="text-xs font-black text-slate-950 font-mono truncate"
                      />
                    ) : (
                      <span>{displayAffiliationNo || '—'}</span>
                    )}
                    <VerifiedBadge fieldKey="affiliationNumber" size="sm" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 block truncate mt-1">
                    {displayAffiliationNo ? 'Official Record' : 'Pending Verification'}
                  </span>
                </div>

                {/* 3. UDISE Code */}
                <div className="bg-white rounded-2xl p-3 border border-[#D6EDFF] shadow-2xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">UDISE Code</span>
                  <div className="text-xs font-black text-slate-950 mt-1 font-mono truncate flex items-center gap-1">
                    <span>{displayUdise}</span>
                    {isLiveTemplate && isEditMode && (
                      <span title="Locked to government UDISE record" className="inline-flex items-center text-amber-700">
                        <Lock className="w-2.5 h-2.5" />
                      </span>
                    )}
                    <VerifiedBadge fieldKey="udiseCode" size="sm" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#005689] block truncate mt-1">National Database</span>
                </div>

                {/* 4. Management */}
                <div className="bg-white rounded-2xl p-3 border border-[#D6EDFF] shadow-2xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Management</span>
                  <div className="text-xs font-black text-slate-950 mt-1 truncate flex items-center gap-1" title={displayManagementLabel}>
                    {isLiveTemplate && isEditMode ? (
                      <EditableText
                        contentKey="management"
                        value={displayManagementLabel}
                        maxLength={40}
                        className="text-xs font-black text-slate-950 truncate"
                      />
                    ) : (
                      <span className="truncate">{displayManagementLabel}</span>
                    )}
                    <VerifiedBadge fieldKey="management" size="sm" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 block truncate mt-1">Authorized Body</span>
                </div>

                {/* 5. Medium */}
                <div className="bg-white rounded-2xl p-3 border border-[#D6EDFF] shadow-2xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Medium</span>
                  <div className="text-xs font-black text-slate-950 mt-1 truncate flex items-center gap-1">
                    {isLiveTemplate && isEditMode ? (
                      <EditableText
                        contentKey="medium"
                        value={displayMedium}
                        maxLength={35}
                        className="text-xs font-black text-slate-950 truncate"
                      />
                    ) : (
                      <span>{displayMedium}</span>
                    )}
                    <VerifiedBadge fieldKey="medium" size="sm" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#005689] block truncate mt-1" title={mediumsList.join(', ')}>
                    {mediumsList.length > 1 ? `${mediumsList.length} Mediums` : 'Primary Medium'}
                  </span>
                </div>

                {/* 6. Classes Offered */}
                <div className="bg-white rounded-2xl p-3 border border-[#D6EDFF] shadow-2xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Classes</span>
                  <div className="text-xs font-black text-slate-950 mt-1 truncate flex items-center gap-1">
                    {isLiveTemplate && isEditMode ? (
                      <div className="flex items-center gap-0.5 text-xs font-black text-slate-950">
                        <EditableText contentKey="classFrom" value={classFrom || 'Class 1'} maxLength={10} className="inline font-bold" />
                        <span>to</span>
                        <EditableText contentKey="classTo" value={classTo || 'Class 12th'} maxLength={10} className="inline font-bold" />
                      </div>
                    ) : (
                      <span>{displayClasses}</span>
                    )}
                    <VerifiedBadge fieldKey="classFrom" size="sm" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 block truncate mt-1">Approved Levels</span>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
