'use client';

import React from 'react';
import { Briefcase, MapPin, IndianRupee, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { JobOpening } from '../types';

export interface JobCardProps {
  job: JobOpening;
  onClick?: () => void;
  onApply?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onClick, onApply }) => {
  return (
    <div
      onClick={onClick}
      className="relative flex flex-col justify-between border border-[#dadce0] hover:border-[#bdc1c6] rounded-2xl bg-white w-full select-none overflow-hidden cursor-pointer group box-border transition-all duration-300 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 space-y-3.5"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#eef3fc] text-[#1a73e8] border border-[#d3e3fd] font-['Google_Sans',Roboto,sans-serif]">
            {job.department}
          </span>
          <span className="text-[11px] font-medium text-[#656773] font-['Google_Sans',Roboto,sans-serif]">
            Posted: {job.postedDate}
          </span>
        </div>

        <h3 className="text-[16px] sm:text-[17px] font-semibold text-[#16171A] group-hover:text-[#1a73e8] leading-snug transition-colors font-['Google_Sans',Roboto,sans-serif]">
          {job.title}
        </h3>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#656773] font-medium font-['Google_Sans',Roboto,sans-serif]">
          <span className="flex items-center gap-1">
            <MapPin size={13} className="text-[#d97706]" /> {job.location}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase size={13} className="text-[#1a73e8]" /> {job.type} &bull; {job.experience}
          </span>
          <span className="flex items-center gap-1 text-[#16171A] font-bold">
            <IndianRupee size={13} className="text-emerald-600" /> {job.salary}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          {job.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center text-[10px] font-medium text-[#656773] bg-[#f8f9fa] px-2 py-0.5 rounded-full border border-[#dadce0] font-['Google_Sans',Roboto,sans-serif]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-[#dadce0] flex items-center justify-between gap-2">
        <span className="text-[11px] text-[#656773] font-normal font-['Google_Sans',Roboto,sans-serif]">
          Deadline: <strong className="text-[#16171A] font-medium">{job.deadline}</strong>
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onApply?.();
          }}
          className="px-4 py-1.5 rounded-full border border-[#dadce0] bg-white text-[#1a73e8] hover:bg-[#f8fafd] hover:border-[#1a73e8]/40 text-xs font-medium transition-colors inline-flex items-center gap-1.5 shadow-xs font-['Google_Sans',Roboto,sans-serif]"
        >
          <span>Apply Now</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
};

export default JobCard;
