'use client';

import React from 'react';
import CurrentlyWorkingOnPage from '@/components/shared/CurrentlyWorkingOnPage';

export default function EventDetailClient() {
  return (
    <CurrentlyWorkingOnPage
      pageTitle="Event Details"
      badge="Under Active Development"
      subtitle="Event Registration & Guidelines"
      customDescription="We are currently setting up verified event details, schedules, and registration portals."
    />
  );
}
