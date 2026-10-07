'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Compass, ArrowLeft, Check } from 'lucide-react';
import { findActivityById, ExperimentActivity, slugifyExperimentTitle } from '@/data/subjectActivitiesData';
import PrintableLabManual from '@/components/subject/PrintableLabManual';
import { ExperimentsStorageService } from '@/services/experimentsStorage';
import { ExperimentItem } from '@/types/experiment';
import SinglePageDocumentView from '@/components/experiments/SinglePageDocumentView';

export default function ExperimentDetailPage() {
  const params = useParams();
  const activityId = params?.id as string;

  const [shareToastText, setShareToastText] = useState<string | null>(null);
  const [customExp, setCustomExp] = useState<ExperimentItem | null>(() => {
    return activityId ? ExperimentsStorageService.getExperimentById(activityId) : null;
  });

  // Check if this experiment exists in the rich ExperimentsStorageService
  useEffect(() => {
    if (activityId) {
      const found = ExperimentsStorageService.getExperimentById(activityId);
      if (found) setCustomExp(found);
    }
  }, [activityId]);

  // Locate the activity and its parent subject
  const data = useMemo(() => {
    if (!activityId) return null;
    const found = findActivityById(activityId);
    if (found) return found;

    if (customExp) {
      return {
        activity: {
          id: customExp.id,
          title: customExp.title,
          subtitle: customExp.subtitle,
          category: customExp.category,
          gradeLevel: customExp.gradeLevel as any,
          difficulty: customExp.difficulty,
          duration: customExp.duration,
          safetyLevel: customExp.safetyLevel,
          description: customExp.subtitle,
          scientificPrinciple: '',
          materials: [],
          steps: [],
          realWorldApplication: '',
          tags: customExp.tags,
          colorTheme: customExp.colorTheme || 'from-blue-600 to-indigo-700',
        },
        subject: {
          slug: customExp.subjectSlug,
          name: customExp.subjectName,
          tagline: '',
          heroGradient: '',
          accentColor: '#005689',
          badgeColor: '',
          iconName: 'FlaskConical',
          activeCount: 1,
          labType: 'Virtual Laboratory',
          description: '',
          popularConcepts: [],
          simulatorType: 'chemistry_titration' as const,
          activities: [],
        },
      };
    }
    return null;
  }, [activityId, customExp]);

  const fullExperiment: ExperimentItem | null = useMemo(() => {
    if (customExp && customExp.sections && customExp.sections.length > 0) {
      return customExp;
    }
    if (!data) return null;
    const { activity: act, subject: sub } = data;
    return {
      id: act.id,
      slug: slugifyExperimentTitle(act.title),
      title: act.title,
      subtitle: act.subtitle || act.description,
      subjectSlug: sub.slug,
      subjectName: sub.name.replace(' Activities', ''),
      category: act.category,
      gradeLevel: act.gradeLevel,
      difficulty: act.difficulty,
      duration: act.duration,
      safetyLevel: act.safetyLevel,
      status: 'published',
      tags: act.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: [
        {
          id: 'sec-mat',
          type: 'materials',
          title: 'Materials & Apparatus Required',
          order: 1,
          isEnabled: true,
          columns: [
            { id: 'c1', key: 'name', label: 'Item / Reagent Name', type: 'text' },
            { id: 'c2', key: 'quantity', label: 'Quantity Required', type: 'text' },
            { id: 'c3', key: 'spec', label: 'Specification / Grade', type: 'text' },
          ],
          rows: (act.materials || []).map((m, idx) => ({
            id: `r-${idx}`,
            name: m,
            quantity: '1 Unit',
            spec: 'Standard Grade',
          })),
        },
        {
          id: 'sec-prec',
          type: 'precautions',
          title: 'Safety Precautions & Laboratory Protocol',
          order: 2,
          isEnabled: true,
          safetyLevel: act.safetyLevel,
          ppeRequired: ['Safety Goggles', 'Nitrile Gloves', 'Lab Coat'],
          warnings: [
            {
              id: 'w1',
              type: 'caution',
              title: 'Laboratory Safety Notice',
              text: 'Ensure bench is clean, organized and ventilated before starting procedure.',
            },
          ],
        },
        {
          id: 'sec-theo',
          type: 'theory',
          title: 'Scientific Principle & Reaction Theory',
          order: 3,
          isEnabled: true,
          headingLevel: 'h2',
          alignment: 'left',
          content: act.scientificPrinciple || act.description,
        },
        {
          id: 'sec-proc',
          type: 'procedure',
          title: 'Step-by-Step Experimental Procedure',
          order: 4,
          isEnabled: true,
          steps: (act.steps || []).map((st, idx) => ({
            id: `st-${idx}`,
            stepNumber: idx + 1,
            title: `Step ${idx + 1}`,
            instruction: st,
            duration: '5 Mins',
          })),
        },
      ],
    };
  }, [customExp, data]);

  if (!data) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#006fcc] flex items-center justify-center mx-auto">
            <Compass size={28} />
          </div>
          <h2 className="text-xl font-black text-slate-900">Experiment Not Found</h2>
          <p className="text-xs text-slate-500">
            The requested science activity could not be found or has been relocated in the curriculum directory.
          </p>
          <Link
            href="/subject/chemistry"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#003c6e] text-white font-bold text-xs shadow-md hover:bg-[#002d54] transition-all"
          >
            <ArrowLeft size={14} /> Back to Experiments Hub
          </Link>
        </div>
      </div>
    );
  }

  const { activity, subject } = data;

  const relatedActivities = subject.activities
    .filter((a) => a.id !== activity.id)
    .slice(0, 4);

  return (
    <>
      <div className="experiment-page-body min-h-screen bg-white pb-20 print:hidden">
        {fullExperiment && (
          <div className="w-full bg-white">
            <SinglePageDocumentView
              experiment={fullExperiment}
              isStandalone={true}
              relatedActivities={relatedActivities}
            />
          </div>
        )}

        {/* Floating Toast Notification */}
        {shareToastText && (
          <div className="fixed bottom-6 right-6 z-[1100] bg-slate-900/95 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl border border-slate-700/80 backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <Check size={14} className="text-emerald-400 shrink-0" />
            <span>{shareToastText}</span>
          </div>
        )}
      </div>

      {/* Dedicated Clean A4 Printable Lab Manual */}
      <PrintableLabManual activity={activity} subjectName={subject.name} />
    </>
  );
}
