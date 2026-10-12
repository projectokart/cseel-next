'use client';

import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import EditableText from '@/components/schools/template/EditableText';
import EditableImage from '@/components/schools/template/EditableImage';
import EditableIcon from '@/components/schools/template/EditableIcon';

export interface SchoolVisionMissionSectionProps {
  isLiveTemplate?: boolean;
  isEditMode?: boolean;
  templateData?: any;
  initialProfileData?: any;
}

export default function SchoolVisionMissionSection({
  isLiveTemplate = false,
  isEditMode = false,
  templateData,
  initialProfileData,
}: SchoolVisionMissionSectionProps) {
  return (
    <section id="vision-mission" className="pt-6 sm:pt-10 pb-10 sm:pb-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-left max-w-3xl mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] bg-[#EDF5FA] border border-[#D6EDFF] px-3.5 py-1.5 rounded-full mb-3">
            <span className="w-2 h-2 bg-[#FBBC04] rounded-full inline-block" />
            <EditableText
              contentKey="principles_eyebrow"
              value="VISION • MISSION • VALUES"
              className="inline-block"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
            <EditableText
              contentKey="principles_heading_l1"
              value="Our Guiding Philosophy,"
              className="block text-slate-950"
            />
            <span className="text-[#005689] block mt-0.5">
              <EditableText
                contentKey="principles_heading_l2"
                value="Vision & Mission.."
                className="inline text-[#005689]"
              />
            </span>
          </h2>

          <EditableText
            contentKey="principles_subheading"
            value="Every initiative, practical laboratory experiment, and pedagogical lesson is driven by our institutional philosophy."
            multiline={true}
            rows={2}
            className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed block"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card 1: Vision */}
          <div className="bg-gradient-to-b from-blue-50/50 via-white to-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white mb-6 p-2 flex items-center justify-center border border-blue-50 group-hover:scale-105 transition-transform duration-500">
                <EditableImage
                  imageKey="vision_image"
                  defaultSrc="/images/illustrations/vision-telescope.jpg"
                  alt="Our Vision"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-[#005689] flex items-center justify-center font-bold">
                  <EditableIcon
                    iconKey="vision_icon"
                    defaultIcon="Telescope"
                    className="w-5 h-5 text-[#005689]"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  <EditableText
                    contentKey="vision_title"
                    value="Our Vision"
                    className="inline"
                  />
                </h3>
              </div>

              <EditableText
                contentKey="vision_desc"
                value={templateData?.visionText || "To cultivate enlightened, creative, and compassionate leaders who excel academically and contribute positively to society."}
                multiline={true}
                rows={4}
                className="text-sm text-gray-600 leading-relaxed block"
              />
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-[#005689]">
              <Sparkles className="w-4 h-4 text-[#FBBC04]" />
              <EditableText
                contentKey="vision_tag"
                value="Future-Focused Education"
                className="inline"
              />
            </div>
          </div>

          {/* Card 2: Mission */}
          <div className="bg-gradient-to-b from-amber-50/40 via-white to-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white mb-6 p-2 flex items-center justify-center border border-amber-50 group-hover:scale-105 transition-transform duration-500">
                <EditableImage
                  imageKey="mission_image"
                  defaultSrc="/images/illustrations/mission-target.png"
                  alt="Our Mission"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center font-bold">
                  <EditableIcon
                    iconKey="mission_icon"
                    defaultIcon="Target"
                    className="w-5 h-5 text-amber-700"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  <EditableText
                    contentKey="mission_title"
                    value="Our Mission"
                    className="inline"
                  />
                </h3>
              </div>

              <EditableText
                contentKey="mission_desc"
                value={templateData?.missionText || "To provide experiential, inclusive, and technologically advanced learning that builds critical thinking, scientific temperament, and ethical character."}
                multiline={true}
                rows={4}
                className="text-sm text-gray-600 leading-relaxed block"
              />
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-amber-700">
              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              <EditableText
                contentKey="mission_tag"
                value="Experiential Pedagogy"
                className="inline"
              />
            </div>
          </div>

          {/* Card 3: Core Values */}
          <div className="bg-gradient-to-b from-emerald-50/40 via-white to-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white mb-6 p-2 flex items-center justify-center border border-emerald-50 group-hover:scale-105 transition-transform duration-500">
                <EditableImage
                  imageKey="values_image"
                  defaultSrc="/images/illustrations/values-community.jpg"
                  alt="Core Values"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center font-bold">
                  <EditableIcon
                    iconKey="values_icon"
                    defaultIcon="Heart"
                    className="w-5 h-5 text-emerald-700"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  <EditableText
                    contentKey="values_title"
                    value="Core Values"
                    className="inline"
                  />
                </h3>
              </div>

              <EditableText
                contentKey="values_desc"
                value={templateData?.contentOverrides?.['values_desc'] || "Integrity, curiosity, resilience, empathy, and respect form the bedrock of our student development and school culture."}
                multiline={true}
                rows={4}
                className="text-sm text-gray-600 leading-relaxed block"
              />
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <EditableText
                contentKey="values_tag"
                value="Character & Ethics"
                className="inline"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
