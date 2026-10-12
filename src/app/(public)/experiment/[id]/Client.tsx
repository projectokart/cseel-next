'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import PageTransition from '@/components/shared/PageTransition';
import { supabase } from '@/integrations/supabase/client';
import { getExperimentBySlugOrId, ALL_EXPERIMENTS } from '@/lib/experimentsData';
import { findActivityById, SUBJECTS_DATA } from '@/data/subjectActivitiesData';
import ExperimentTemplateView, {
  buildExperimentTemplateData,
  DEFAULT_FARADAY_EXPERIMENT,
  ExperimentTemplateData,
} from '@/components/experiment/ExperimentTemplateView';

export default function ExperimentDetailClient() {
  const params = useParams();
  const idOrSlug = (params?.id as string) || '';

  const [dbExp, setDbExp] = useState<any | null>(null);
  const [overrideExp, setOverrideExp] = useState<any | null>(null);

  useEffect(() => {
    if (!idOrSlug) return;
    let cancelled = false;

    async function loadFromDb() {
      try {
        const { data } = await (supabase as any)
          .from('experiments')
          .select('*')
          .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
          .maybeSingle();
        if (!cancelled && data) {
          setDbExp(data);
        }
      } catch {
        // Fallback to local catalog
      }
    }

    loadFromDb();
    return () => {
      cancelled = true;
    };
  }, [idOrSlug]);

  const templateData: ExperimentTemplateData = useMemo(() => {
    if (overrideExp) {
      return buildExperimentTemplateData(overrideExp, overrideExp.subject);
    }

    if (dbExp) {
      return buildExperimentTemplateData(dbExp, dbExp.subject);
    }

    const catalogExp = getExperimentBySlugOrId(idOrSlug);
    if (catalogExp) {
      return buildExperimentTemplateData(catalogExp, catalogExp.subject);
    }

    const subjectAct = findActivityById(idOrSlug);
    if (subjectAct) {
      return buildExperimentTemplateData(
        subjectAct.activity,
        subjectAct.subject.name.replace(' Activities', '')
      );
    }

    if (
      !idOrSlug ||
      idOrSlug.toLowerCase().includes('faraday') ||
      idOrSlug.toLowerCase().includes('electromagnetic')
    ) {
      return DEFAULT_FARADAY_EXPERIMENT;
    }

    const readableTitle = idOrSlug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return buildExperimentTemplateData({
      id: idOrSlug,
      title: readableTitle,
      subject: 'Physics',
    });
  }, [idOrSlug, dbExp, overrideExp]);

  const handleSelectRelated = (relTitle: string) => {
    const clean = relTitle.toLowerCase().trim();

    const fromAll = ALL_EXPERIMENTS.find(
      (e) =>
        e.title.toLowerCase().includes(clean) ||
        clean.includes(e.title.toLowerCase())
    );
    if (fromAll) {
      setOverrideExp(fromAll);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

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
    <PageTransition>
      <div className="min-h-screen bg-[#f3f7f1]">
        <ExperimentTemplateView
          data={templateData}
          isInsideDrawer={false}
          onSelectRelated={handleSelectRelated}
        />
      </div>
    </PageTransition>
  );
}