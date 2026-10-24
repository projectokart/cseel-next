'use client';

import React from 'react';
import { School, MapPin, Users, Award, ShieldCheck, ArrowRight, Phone, Mail } from 'lucide-react';
import { PartnerSchool } from '../types';

export interface SchoolCardProps {
  school: PartnerSchool;
  onClick?: () => void;
  onContact?: () => void;
}

export const SchoolCard: React.FC<SchoolCardProps> = ({ school, onClick, onContact }) => {
  return (
    <article
      onClick={onClick}
      className="relative flex flex-col justify-between border border-[#dadce0] hover:border-[#bdc1c6] rounded-2xl bg-white w-full select-none overflow-hidden cursor-pointer group box-border transition-all duration-300 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 space-y-3.5"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#eef3fc] text-[#1a73e8] border border-[#d3e3fd] font-['Google_Sans',Roboto,sans-serif]">
              {school.board} &bull; {school.type}
            </span>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <ShieldCheck size={11} />
              <span>{school.accreditationLevel}</span>
            </span>
          </div>

          <span className="text-[11px] font-mono text-slate-400">
            {school.code}
          </span>
        </div>

        <h3 className="text-[16px] sm:text-[17px] font-semibold text-[#16171A] group-hover:text-[#1a73e8] leading-snug transition-colors font-['Google_Sans',Roboto,sans-serif]">
          {school.name}
        </h3>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#656773] font-medium font-['Google_Sans',Roboto,sans-serif]">
          <span className="flex items-center gap-1">
            <MapPin size={13} className="text-[#d97706]" /> {school.city}, {school.state} ({school.pincode})
          </span>
          <span className="flex items-center gap-1">
            <Users size={13} className="text-[#1a73e8]" /> {school.studentCount} Students &bull; {school.facultyCount} Faculty
          </span>
        </div>

        {school.labsEquipped && school.labsEquipped.length > 0 && (
          <div className="space-y-1 pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Equipped CSEEL Laboratories:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {school.labsEquipped.map((lab) => (
                <span
                  key={lab}
                  className="inline-flex items-center text-[10px] font-medium text-[#1a73e8] bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200 font-['Google_Sans',Roboto,sans-serif]"
                >
                  {lab}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-[#dadce0] flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-3 text-xs text-[#656773]">
          <span className="flex items-center gap-1">
            <Phone size={12} className="text-slate-400" /> {school.phone}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onContact?.();
          }}
          className="px-3.5 py-1.5 rounded-full border border-[#dadce0] bg-white text-[#1a73e8] hover:bg-[#f8fafd] hover:border-[#1a73e8]/40 text-xs font-medium transition-colors inline-flex items-center gap-1.5 shadow-xs font-['Google_Sans',Roboto,sans-serif]"
        >
          <span>View Profile</span>
          <ArrowRight size={11} />
        </button>
      </div>
    </article>
  );
};

export default SchoolCard;
