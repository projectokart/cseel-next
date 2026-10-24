'use client';

import React from 'react';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { CseelEvent } from '../types';

export interface EventCardProps {
  event: CseelEvent;
  onClick?: () => void;
  onRegister?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick, onRegister }) => {
  return (
    <article
      onClick={onClick}
      className="relative flex flex-col justify-between border border-[#dadce0] hover:border-[#bdc1c6] rounded-2xl bg-white w-full select-none overflow-hidden cursor-pointer group box-border transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#f8f9fa] border-b border-[#dadce0]">
        <img
          src={event.bannerImage}
          alt={event.title}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/95 text-[#1a73e8] border border-[#dadce0] shadow-xs backdrop-blur-xs font-['Google_Sans',Roboto,sans-serif]">
            {event.type}
          </span>
        </div>

        <div className="absolute bottom-2 right-2 z-10">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-900/75 text-white backdrop-blur-xs border border-white/20 flex items-center gap-1 shadow-xs">
            <Users size={9} />
            {event.registeredCount} / {event.capacity} Registered
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 text-[11px] text-[#656773] font-medium font-['Google_Sans',Roboto,sans-serif]">
            <span className="flex items-center gap-1">
              <Calendar size={12} className="text-[#1a73e8]" /> {event.date}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-slate-400" /> {event.time}
            </span>
          </div>

          <h3 className="text-[15px] sm:text-[16px] font-semibold text-[#16171A] group-hover:text-[#1a73e8] leading-snug transition-colors line-clamp-2 font-['Google_Sans',Roboto,sans-serif]">
            {event.title}
          </h3>

          <p className="text-[12px] text-[#656773] font-normal leading-relaxed line-clamp-2 font-['Google_Sans',Roboto,sans-serif]">
            {event.agendaSummary}
          </p>

          <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-1 font-['Google_Sans',Roboto,sans-serif]">
            <MapPin size={12} className="text-[#d97706] shrink-0" />
            <span className="truncate">{event.venue}, {event.city}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-[#dadce0] flex items-center justify-between gap-2 mt-auto">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-[11px] font-medium text-emerald-700 font-['Google_Sans',Roboto,sans-serif]">
              {event.isRegistrationOpen ? 'Registration Open' : 'Housefull'}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRegister?.();
            }}
            className="px-3.5 py-1 rounded-full border border-[#dadce0] bg-white text-[#1a73e8] hover:bg-[#f8fafd] hover:border-[#1a73e8]/40 text-[11px] font-medium transition-colors inline-flex items-center gap-1 shrink-0 font-['Google_Sans',Roboto,sans-serif]"
          >
            <span>Register</span>
            <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default EventCard;
