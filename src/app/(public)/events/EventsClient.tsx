'use client';

import React from 'react';
import CurrentlyWorkingOnPage from '@/components/shared/CurrentlyWorkingOnPage';

export default function EventsClient() {
  return (
    <CurrentlyWorkingOnPage
      pageTitle="Events & Workshops"
      badge="Under Active Development"
      subtitle="National STEM Conclaves & Experiential Workshops"
      customDescription="We are currently organizing our upcoming calendar for experiential science exhibitions, robotics hackathons, and school workshops. Verified schedules and registration forms will be updated here shortly."
    />
  );
}
