'use client';

import React from 'react';
import PremiumSchoolProfileClient from '@/components/edu-network/PremiumSchoolProfileClient';

interface OrgProfileClientProps {
  orgId: string;
}

export default function OrgProfileClient({ orgId }: OrgProfileClientProps) {
  return <PremiumSchoolProfileClient orgId={orgId} />;
}
