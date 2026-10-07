'use client';

import { redirect } from 'next/navigation';

// Art.tsx now redirects to the ExperimentDetail page
// This file is kept for backward compatibility with /art route
const Art = () => {
  return redirect("/simulations");
};

export default Art;
