'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { findActivityById, SUBJECTS_DATA } from '@/data/subjectActivitiesData';
import { ExperimentsStorageService } from '@/services/experimentsStorage';
import { ExperimentItem } from '@/types/experiment';
import { getExperimentBySlugOrId } from '@/lib/experimentsData';
import ExperimentTemplateView, {
  buildExperimentTemplateData,
  DEFAULT_FARADAY_EXPERIMENT,
  ExperimentTemplateData,
} from '@/components/experiment/ExperimentTemplateView';

import { supabase } from '@/integrations/supabase/client';

export default function ExperimentDetailPage() {
  const params = useParams();
  const activityId = (params?.id as string) || '';

  const [customExp, setCustomExp] = useState<ExperimentItem | null>(null);
  const [overrideExp, setOverrideExp] = useState<any | null>(null);

  useEffect(() => {
    if (!activityId) return;

    const found = ExperimentsStorageService.getExperimentById(activityId);
    if (found) setCustomExp(found);

    async function fetchFromDb() {
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(activityId);
        const query = isUuid
          ? (supabase.from('experiments') as any).select('*').or(`id.eq.${activityId},slug.eq.${activityId}`).maybeSingle()
          : (supabase.from('experiments') as any).select('*').eq('slug', activityId).maybeSingle();

        const { data, error } = await query;
        if (!error && data) {
          setOverrideExp(data);
        }
      } catch (err) {
        // Fallbacks will handle
      }
    }
    fetchFromDb();
  }, [activityId]);

  const templateData: ExperimentTemplateData = useMemo(() => {
    if (overrideExp) {
      return buildExperimentTemplateData(overrideExp, overrideExp.subject);
    }

    if (!activityId) return DEFAULT_FARADAY_EXPERIMENT;

    // 1. Check rich custom experiment storage
    if (customExp) {
      return buildExperimentTemplateData(customExp, customExp.subjectName);
    }

    // 2. Check subjectActivitiesData
    const subjectFound = findActivityById(activityId);
    if (subjectFound) {
      return buildExperimentTemplateData(
        subjectFound.activity,
        subjectFound.subject.name.replace(' Activities', '')
      );
    }

    // 3. Check ALL_EXPERIMENTS catalog
    const catalogExp = getExperimentBySlugOrId(activityId);
    if (catalogExp) {
      return buildExperimentTemplateData(catalogExp, catalogExp.subject);
    }

    // 4. Fallback to Faraday's Law template with formatted title if slug provided
    const readableTitle = activityId
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    if (
      activityId.toLowerCase().includes('faraday') ||
      activityId.toLowerCase().includes('electromagnetic')
    ) {
      return DEFAULT_FARADAY_EXPERIMENT;
    }

    return buildExperimentTemplateData({
      id: activityId,
      title: readableTitle,
      subject: 'Physics',
    });
  }, [activityId, customExp, overrideExp]);

  const handleSelectRelated = (relTitle: string) => {
    const clean = relTitle.toLowerCase().trim();
    for (const subj of Object.values(SUBJECTS_DATA)) {
      const match = subj.activities.find(
        (a) =>
          a.title.toLowerCase().includes(clean) ||
          clean.includes(a.title.toLowerCase())
      );
      if (match) {
        setOverrideExp(match);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }
    setOverrideExp({
      id: `rel-${Date.now()}`,
      title: relTitle,
      subject: templateData.crumb?.[1] || 'Physics',
      gradeLevel: templateData.meta?.[0] || 'Class 10',
      duration: templateData.meta?.[1] || '30 mins',
      difficulty: templateData.meta?.[2] || 'Intermediate',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8fafd]">
      <ExperimentTemplateView
        data={templateData}
        isInsideDrawer={false}
        onSelectRelated={handleSelectRelated}
      />
    </div>
  );
}
