'use client';

import React from 'react';
import CurrentlyWorkingOnPage from '@/components/shared/CurrentlyWorkingOnPage';

export default function UpcomingEventsClient() {
  return (
    <CurrentlyWorkingOnPage
      pageTitle="Upcoming Events & Conclaves"
      badge="Under Active Development"
      subtitle="Upcoming Experiential STEM Events"
      customDescription="We are currently organizing and finalizing the schedule for upcoming national STEM competitions, hackathons, and science exhibitions. Verified events will be listed here soon."
    />
  );
}
