'use client';

import React, { useState } from 'react';
import {
  SCHOOL_ICONS_COLLECTION,
  SCHOOL_ILLUSTRATIONS_COLLECTION,
  SchoolIconOption,
  SchoolIllustrationOption
} from './SchoolAssetLibrary';
import {
  X,
  Check,
  Plus,
  Layers,
  GraduationCap,
  Sparkles,
  FlaskConical,
  Bot,
  Monitor,
  Tv,
  Eye,
  BookOpen,
  Palette,
  Award,
  MessageSquare,
  Activity,
  Trophy,
  Target,
  Heart,
  Bus,
  HeartPulse,
  Home,
  Building2,
  ShieldCheck,
  Lightbulb
} from 'lucide-react';
import {
  ScienceLabIllustration,
  ComputerLabIllustration,
  RoboticsLabIllustration,
  LibraryIllustration,
  SmartClassroomIllustration,
  SportsIllustration,
  ArtMusicIllustration,
  AuditoriumIllustration,
  TransportIllustration,
  MedicalRoomIllustration,
  PrincipalDeskIllustration,
  SchoolCampusIllustration
} from '@/components/illustrations/FacilityIllustrations';

export const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FlaskConical,
  Bot,
  Monitor,
  Tv,
  Eye,
  BookOpen,
  Palette,
  Award,
  GraduationCap,
  MessageSquare,
  Activity,
  Trophy,
  Target,
  Heart,
  Bus,
  HeartPulse,
  Home,
  Building2,
  ShieldCheck,
  Lightbulb,
  Sparkles
};

export const ILLUSTRATION_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ScienceLabIllustration,
  ComputerLabIllustration,
  RoboticsLabIllustration,
  LibraryIllustration,
  SmartClassroomIllustration,
  SportsIllustration,
  ArtMusicIllustration,
  AuditoriumIllustration,
  TransportIllustration,
  MedicalRoomIllustration,
  PrincipalDeskIllustration,
  SchoolCampusIllustration
};

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardType: 'facility' | 'admission';
  initialData?: {
    id?: string;
    title: string;
    desc?: string;
    criteria?: string;
    fees?: string;
    icon: string;
    illustration?: string;
    badge?: string;
  };
  onSave: (data: {
    title: string;
    desc?: string;
    criteria?: string;
    fees?: string;
    icon: string;
    illustration?: string;
    badge?: string;
  }) => void;
}

export default function AddCardModal({
  isOpen,
  onClose,
  cardType,
  initialData,
  onSave
}: AddCardModalProps) {
  const [title, setTitle] = useState<string>(initialData?.title || '');
  const [description, setDescription] = useState<string>(initialData?.desc || initialData?.criteria || '');
  const [fees, setFees] = useState<string>(initialData?.fees || '');
  const [badge, setBadge] = useState<string>(initialData?.badge || 'Verified Facility');
  const [selectedIcon, setSelectedIcon] = useState<string>(initialData?.icon || 'FlaskConical');
  const [selectedIllustration, setSelectedIllustration] = useState<string>(
    initialData?.illustration || 'ScienceLabIllustration'
  );
  const [activeAssetTab, setActiveAssetTab] = useState<'icon' | 'illustration'>('icon');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (cardType === 'facility') {
      onSave({
        title: title.trim(),
        desc: description.trim(),
        badge: badge.trim(),
        icon: selectedIcon,
        illustration: selectedIllustration
      });
    } else {
      onSave({
        title: title.trim(),
        criteria: description.trim(),
        fees: fees.trim(),
        badge: badge.trim(),
        icon: selectedIcon,
        illustration: selectedIllustration
      });
    }
    onClose();
  };

  const SelectedIconComp = ICON_MAP[selectedIcon] || Sparkles;
  const SelectedIllustrationComp = ILLUSTRATION_MAP[selectedIllustration] || ScienceLabIllustration;

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl max-h-[90vh] flex flex-col text-slate-800 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-[#006FCC]">
              {cardType === 'facility' ? <Layers className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                {initialData?.id ? 'Edit' : 'Add New'} {cardType === 'facility' ? 'School Facility Card' : 'Admission Criteria Card'}
              </h3>
              <p className="text-xs text-slate-500">
                Choose an icon or illustration from the prebuilt library and customize text
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Card Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Card Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={cardType === 'facility' ? 'e.g. AI & Robotics Innovation Lab' : 'e.g. Class 11th Science & STEM Admissions'}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
            />
          </div>

          {/* Description / Criteria */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {cardType === 'facility' ? 'Facility Description & Equipment' : 'Eligibility & Admission Details'}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={cardType === 'facility' ? 'e.g. 3D printers, microcontrollers, autonomous bots & student maker benches...' : 'e.g. Minimum 75% in Class 10th Board, entrance aptitude evaluation & direct counseling...'}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
            />
          </div>

          {/* Admission-only Fees Field */}
          {cardType === 'admission' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Annual / Term Fee Structure</label>
              <input
                type="text"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                placeholder="e.g. ₹45,000 / term or Scholarship Available"
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
              />
            </div>
          )}

          {/* Badge Tag */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Badge Tag / Highlight</label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. NEP 2020 Aligned / Verified / Air-Conditioned"
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
            />
          </div>

          {/* Visual Asset Selector: Icon vs Illustration */}
          <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
              <span className="text-xs font-bold text-slate-700">Select Card Artwork</span>
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveAssetTab('icon')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                    activeAssetTab === 'icon' ? 'bg-[#006FCC] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Icon Library
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAssetTab('illustration')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                    activeAssetTab === 'illustration' ? 'bg-[#006FCC] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Illustration Art
                </button>
              </div>
            </div>

            {/* Asset Picker Grid */}
            {activeAssetTab === 'icon' ? (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-44 overflow-y-auto p-1">
                {SCHOOL_ICONS_COLLECTION.map((item) => {
                  const IconComp = ICON_MAP[item.iconName] || Sparkles;
                  const isSelected = selectedIcon === item.iconName;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedIcon(item.iconName)}
                      className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer text-center ${
                        isSelected
                          ? 'border-[#006FCC] bg-sky-50 shadow-xs ring-2 ring-[#006FCC]/30'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <IconComp className="w-5 h-5 text-[#006FCC]" />
                      <span className="text-[9px] font-medium text-slate-700 line-clamp-1">{item.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-44 overflow-y-auto p-1">
                {SCHOOL_ILLUSTRATIONS_COLLECTION.map((item) => {
                  const IllusComp = ILLUSTRATION_MAP[item.previewName] || ScienceLabIllustration;
                  const isSelected = selectedIllustration === item.previewName;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedIllustration(item.previewName)}
                      className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer text-center ${
                        isSelected
                          ? 'border-[#006FCC] bg-sky-50 shadow-xs ring-2 ring-[#006FCC]/30'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-full h-12 overflow-hidden rounded flex items-center justify-center">
                        <IllusComp className="w-full h-full object-contain" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-800 line-clamp-1">{item.title}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#006FCC] hover:bg-[#005499] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>{initialData?.id ? 'Update Card' : 'Add Card to Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
