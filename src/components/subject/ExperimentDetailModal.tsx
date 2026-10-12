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

  const subjectFallback =
    (activity as any).subject ||
    (activity.category?.includes('Physics') ? 'Physics' :
     activity.category?.includes('Chemistry') ? 'Chemistry' :
     activity.category?.includes('Biology') ? 'Biology' :
     activity.category?.includes('Math') ? 'Mathematics' :
     activity.id.startsWith('chem') ? 'Chemistry' :
     activity.id.startsWith('phys') ? 'Physics' :
     activity.id.startsWith('bio') ? 'Biology' :
     activity.id.startsWith('math') ? 'Mathematics' :
     'Physics');

  return (
    <ExperimentBottomSheetDrawer
      experiment={activity}
      onClose={onClose}
      subjectFallback={subjectFallback}
      relatedPool={relatedPool}
    />
  );
}
