import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId, useCdn } from '../env';

export const isSanityConfigured = Boolean(
  projectId && projectId !== 'your-project-id'
);

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
  perspective: 'published',
});
