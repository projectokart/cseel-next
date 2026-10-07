'use client';

import React from 'react';
import StandardArticleLayout from '@/components/article/StandardArticleLayout';
import { SchemeArticleData } from '@/lib/schemesData';

interface Props {
  scheme: SchemeArticleData;
}

export default function SchemeDetailClient({ scheme }: Props) {
  return <StandardArticleLayout scheme={scheme} />;
}
