'use client';

import React from 'react';
import { ExperimentActivity } from '@/data/subjectActivitiesData';
import ExperimentBottomSheetDrawer from '@/components/experiment/ExperimentBottomSheetDrawer';

interface Props {
  activity: ExperimentActivity | null;
  onClose: () => void;
  accentColor?: string;
  relatedPool?: ExperimentActivity[];
}

export default function ExperimentDetailModal({
  activity,
  onClose,
  relatedPool,
}: Props) {
  if (!activity) return null;

  const subjectFallback = activity.id.startsWith('chem')
    ? 'Chemistry'
    : activity.id.startsWith('phys')
    ? 'Physics'
    : activity.id.startsWith('bio')
    ? 'Biology'
    : activity.id.startsWith('math')
    ? 'Mathematics'
    : activity.id.startsWith('art')
    ? 'Art & Design'
    : activity.id.startsWith('tech')
    ? 'Technology'
    : 'Engineering';

  return (
    <ExperimentBottomSheetDrawer
      experiment={activity}
      onClose={onClose}
      subjectFallback={subjectFallback}
      relatedPool={relatedPool}
    />
  );
}
