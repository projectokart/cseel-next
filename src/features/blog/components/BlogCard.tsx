'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, User, ArrowRight, Bookmark } from 'lucide-react';
import { BlogPost } from '../types';

export interface BlogCardProps {
  post: BlogPost;
  onClick?: () => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, onClick }) => {
  return (
    <article
      onClick={onClick}
      className="relative flex flex-col justify-between border border-[#dadce0] hover:border-[#bdc1c6] rounded-2xl bg-white w-full select-none overflow-hidden cursor-pointer group box-border transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5"
    >
      {/* Cover Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#f8f9fa] border-b border-[#dadce0]">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/95 text-[#1a73e8] border border-[#dadce0] shadow-xs backdrop-blur-xs font-['Google_Sans',Roboto,sans-serif]">
            {post.category}
          </span>
        </div>

        <div className="absolute bottom-2 right-2 z-10">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-900/75 text-white backdrop-blur-xs border border-white/20 flex items-center gap-1 shadow-xs">
            <Clock size={9} />
            {post.readTimeMinutes} min read
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
        <div className="space-y-1.5">
          <p className="text-[11px] text-[#656773] font-medium font-['Google_Sans',Roboto,sans-serif]">
            {post.publishedAt}
          </p>

          <h3 className="text-[15px] sm:text-[16px] font-semibold text-[#16171A] group-hover:text-[#1a73e8] leading-snug transition-colors line-clamp-2 font-['Google_Sans',Roboto,sans-serif]">
            {post.title}
          </h3>

          <p className="text-[12px] text-[#656773] font-normal leading-relaxed line-clamp-2 font-['Google_Sans',Roboto,sans-serif]">
            {post.summary}
          </p>
        </div>

        {/* Footer: Author & Read Pill */}
        <div className="pt-3 border-t border-[#dadce0] flex items-center justify-between gap-2 mt-auto">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
              <User size={12} />
            </div>
            <span className="text-[11px] font-medium text-[#16171A] truncate font-['Google_Sans',Roboto,sans-serif]">
              {post.author.name}
            </span>
          </div>

          <span className="px-3 py-1 rounded-full border border-[#dadce0] bg-white text-[#1a73e8] group-hover:bg-[#f8fafd] group-hover:border-[#1a73e8]/40 text-[11px] font-medium transition-colors inline-flex items-center gap-1 shrink-0 font-['Google_Sans',Roboto,sans-serif]">
            <span>Read</span>
            <ArrowRight size={11} />
          </span>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
